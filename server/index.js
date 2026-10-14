/* Сервер Пепельного Пикселя: Express + SQLite.
   Отдаёт страницы сайта, пускает на них только после входа, админку — только администратору,
   хранит аккаунты, прогресс студентов, покупки, разделы админки и файлы лекций.
   Запуск: npm start (порт из PORT, по умолчанию 3000). */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const compression = require('compression');
const D = require('./db');
const A = require('./auth');

if (process.argv.includes('--reset')) {
  // npm run reset-db — с демо-студентами; npm run reset-db -- --clean — только администратор и разделы курса
  const clean = process.argv.includes('--clean');
  D.seed(!clean);
  console.log(clean ? 'База пересоздана: только администратор, группы, модули, задания, лекции и магазин.' : 'База пересоздана из демо-данных.');
  process.exit(0);
}

const ROOT = path.join(__dirname, '..');
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // за прокси Render, Railway или nginx req.secure и req.ip берутся из заголовков
app.use(compression()); // gzip: скрипты, стили и данные страницы уходят в 3–5 раз меньше

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const fail = (status, msg) => { throw new HttpError(status, msg); };
const MAX_FILE = 20 * 1024 * 1024;
const KINDS = {
  pdf: { mime: 'application/pdf', magic: '%PDF' },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', magic: 'PK\u0003\u0004' }
};

/* ---------- сессия ---------- */
// «Запомнить у костра» — cookie на две недели; без галочки — до закрытия браузера (и не дольше суток на сервере)
function startSession(req, res, userId, remember = true) {
  const token = crypto.randomBytes(32).toString('base64url');
  D.db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
  D.db.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').run(A.sha(token), userId, Date.now() + (remember ? A.TTL : 24 * 3600 * 1000));
  res.append('Set-Cookie', `${A.COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax${remember ? `; Max-Age=${A.TTL / 1000}` : ''}${req.secure ? '; Secure' : ''}`);
}
function endSession(req, res) {
  const token = A.parseCookies(req.headers.cookie)[A.COOKIE];
  if (token) D.db.prepare('DELETE FROM sessions WHERE token = ?').run(A.sha(token));
  res.append('Set-Cookie', `${A.COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${req.secure ? '; Secure' : ''}`);
}
app.use((req, res, next) => {
  const token = A.parseCookies(req.headers.cookie)[A.COOKIE];
  if (token) {
    const s = D.db.prepare('SELECT user_id, expires FROM sessions WHERE token = ?').get(A.sha(token));
    if (s && s.expires > Date.now()) req.user = D.getUser(s.user_id) || null;
  }
  next();
});
const needUser = (req, res, next) => req.user ? next() : next(new HttpError(401, 'Сначала войдите.'));
const needAdmin = (req, res, next) => !req.user ? next(new HttpError(401, 'Сначала войдите.'))
  : req.user.role === 'admin' ? next() : next(new HttpError(403, 'Это может только администратор.'));

// Защита от подделки запросов с чужих сайтов: все изменения идут только с заголовком X-Ash,
// а его браузер не даст поставить чужой странице без нашего разрешения
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') return next();
  if (req.get('X-Ash') !== '1') return next(new HttpError(403, 'Запрос без заголовка X-Ash отклонён.'));
  next();
});
app.use('/api', express.json({ limit: '2mb' }));
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

/* ---------- данные для страниц ---------- */
const parseState = row => row.state ? JSON.parse(row.state) : null;
function me(row) {
  const u = D.userOut(row), st = parseState(row);
  // Фон страниц: студент надевает купленный в магазине, администратор выбирает сам бесплатно
  const theme = u.role === 'admin' ? u.theme || null : st?.equipped?.theme || null;
  return { id: u.id, name: u.name, theme, role: u.role, group: u.group || null, xp: u.xp || 0, souls: u.souls || 0, hidden: !!u.hidden, achievements: u.achievements || [], courses: u.courses || [] };
}
function adminDb() {
  const out = {};
  D.COLLS.forEach(c => { out[c] = D.listColl(c); });
  return { ...out, users: D.allUsers(), purchases: D.listPurchases(), logs: D.listLogs(), requests: listRequests(), lessonList: lessonList(), taskList: taskList() };
}
// Заявки студентов на доступ к курсу: новые сверху
const listRequests = () => D.listColl('requests').sort((a, b) => b.date.localeCompare(a.date));
// Уроки для раздела «Уроки групп» в админке: без текста и ответов
// Администратору — уроки целиком, чтобы их можно было править; задания — для выбора мини-задания
// Текст неизменённых уроков курса админка подгружает сама (content/md), чтобы не гонять его в каждом ответе
const lessonList = () => D.allLessons().map(l => l.builtin && !l.edited ? { ...l, markdown: undefined } : l);
const taskList = () => D.GAME.TASKS.map(t => ({ id: t.id, title: t.title, ...(t.lesson ? { lesson: t.lesson } : {}) }));
// Студент видит только то, что ему положено: опубликованные лекции своей группы,
// других игроков без e-mail, а скрывшихся из таблицы лидеров — без имени и опыта
function studentDb(row) {
  const self = D.userOut(row);
  const out = {};
  ['modules', 'achievements'].forEach(c => { out[c] = D.listColl(c); });
  // Код регистрации группы студентам не показываем
  out.groups = D.listColl('groups').map(({ invite, ...g }) => g);
  out.courses = D.listColl('courses').filter(c => c.published !== false);
  out.shop = D.listColl('shop').filter(s => s.active);
  out.lectures = D.listColl('lectures').filter(l => lectureOpen(l, self));
  out.tasks = [];
  out.users = D.allUsers().filter(u => u.role === 'student' || u.id === self.id).map(u =>
    u.hidden && u.id !== self.id ? { id: u.id, role: u.role, group: u.group, name: '', xp: 0, hidden: true }
      : { id: u.id, role: u.role, group: u.group, name: u.name, xp: u.xp || 0, hidden: !!u.hidden });
  out.purchases = D.listPurchases().map(p => ({ id: p.id, item: p.item, user: p.user === self.id ? p.user : null }));
  out.logs = [];
  out.requests = listRequests().filter(r => r.user === self.id);
  out.lessons = D.listColl('lessons'); // правки и новые уроки; страница сливает их с js/content.js
  return out;
}
function lectureOpen(l, user) {
  if (user.role === 'admin') return true;
  return l.published && (!l.groups || !l.groups.length || l.groups.includes(user.group));
}

app.get('/api/boot.js', (req, res) => {
  res.type('application/javascript').set('Cache-Control', 'no-store');
  if (!req.user) return res.send(`window.BOOT = null; location.replace('index.html');`);
  const row = req.user;
  const boot = {
    me: me(row), state: parseState(row), rev: row.rev, demo: D.DEMO,
    db: row.role === 'admin' ? adminDb() : studentDb(row)
  };
  res.send(`window.BOOT = ${JSON.stringify(boot).replace(/</g, '\\u003c')};`);
});
app.get('/api/me', needUser, (req, res) => res.json({ me: me(req.user), state: parseState(req.user), rev: req.user.rev }));

/* ---------- вход, регистрация, выход ---------- */
app.post('/api/login', (req, res) => {
  const { login, password, remember } = req.body || {};
  if (A.tooMany(req.ip)) fail(429, 'Слишком много неудачных попыток. Подождите 10 минут.');
  if (!login || !password) fail(400, 'Введите имя и пароль.');
  const row = D.findLogin(String(login));
  if (!row || !A.verifyPassword(String(password), row.pass)) { A.failed(req.ip); fail(401, 'Неверное имя или пароль.'); }
  A.succeeded(req.ip);
  const p = JSON.parse(row.profile); p.lastSeen = D.now(); D.saveProfile(row.id, p);
  D.addLog({ kind: 'action', user: row.id, text: 'вошёл в систему' });
  startSession(req, res, row.id, remember !== false);
  res.json({ id: row.id, name: row.name, role: row.role });
});

app.post('/api/register', (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim().replace(/\s+/g, ' '), pass = String(b.password || '');
  if (A.tooMany('reg:' + req.ip)) fail(429, 'Слишком много регистраций с этого адреса. Подождите 10 минут.');
  if (name.length < 2 || name.length > 40) fail(400, 'Имя персонажа — от 2 до 40 символов.');
  // Личных данных не собираем: только игровое имя, без e-mail и телефона
  if (name.includes('@')) fail(400, 'Здесь нужно игровое имя, а не e-mail.');
  if (pass.length < 4 || pass.length > 200) fail(400, 'Пароль должен быть не короче 4 символов.');
  if (D.nameTaken(name) || D.key(name) === D.key(D.ADMIN_LOGIN)) fail(409, 'Это имя уже занято. Выберите другое.');
  // Код группы выдаёт преподаватель: без него посторонний не зарегистрируется, а студент сразу попадает в свою группу
  const grp = D.groupByInvite(b.code);
  if (!grp) { A.failed('reg:' + req.ip); fail(400, 'Неверный код группы. Уточните его у преподавателя.'); }
  const inGroup = D.allUsers().filter(u => u.group === grp.id && u.role === 'student').length;
  if (grp.quota && inGroup >= grp.quota) fail(409, `Группа ${grp.code} уже заполнена. Напишите преподавателю.`);
  A.failed('reg:' + req.ip);
  const id = D.uid('u'), created = D.now();
  const progress = {}; D.listColl('modules').forEach(m => { progress[m.id] = 0; });
  const profile = { id, name, role: 'student', group: grp.id, xp: 0, souls: 0, lastSeen: created, created, progress, hidden: false, achievements: [], courses: [] };
  D.insertUser({ id, name, pass: A.hashPassword(pass), profile });
  D.addLog({ kind: 'action', user: id, text: `зарегистрировался в группе ${grp.code}` });
  res.status(201).json({ id, name });
});

app.post('/api/logout', (req, res) => {
  if (req.user) D.addLog({ kind: 'action', user: req.user.id, text: 'вышел из системы' });
  endSession(req, res);
  res.json({ ok: true });
});

/* ---------- состояние студента ---------- */
// То, что видно админке: опыт, души, скрытие, достижения; покупки и награды — в журнал
function syncProfile(row, st) {
  const p = JSON.parse(row.profile);
  p.xp = st.xp; p.souls = st.souls; p.hidden = !!st.hidden; p.lastSeen = D.now();
  // Прогресс по модулям для админки: сколько уроков пройдено (квиз без ошибок и мини-задание)
  p.progress = {};
  D.listColl('modules').forEach(m => { p.progress[m.id] = 0; });
  D.allLessons().forEach(l => { if (D.lessonDone(l, st)) p.progress[l.module] = (p.progress[l.module] || 0) + 1; });
  p.achievements ||= [];
  const known = new Set(D.listColl('achievements').map(a => a.id));
  Object.entries(st.ach).forEach(([id, date]) => {
    if (known.has(id) && !p.achievements.some(a => a.id === id)) p.achievements.push({ id, date });
  });
  st.journal.slice().reverse().forEach(j => {
    if (!j || typeof j.id !== 'string') return;
    const id = `${row.id}-${j.id}`;
    if (j.kind === 'purchase') {
      D.addPurchase({ id, user: row.id, item: j.item, price: j.price, date: j.date });
      D.addLog({ id, kind: 'transaction', user: row.id, amount: j.amount, text: String(j.text || ''), date: j.date });
    } else if (['action', 'error', 'transaction'].includes(j.kind)) {
      D.addLog({ id, kind: j.kind, user: row.id, amount: j.amount, text: String(j.text || ''), date: j.date });
    }
  });
  return p;
}
// Действия студента: сервер применяет их сам по тем же правилам (js/student-logic.js),
// но с ценами из базы, заданиями и ответами квизов с сервера и по своим часам
function gameEnv(row) {
  const G = D.GAME, u = D.userOut(row), grp = u.group ? D.getItem('groups', u.group) : null;
  return {
    now: D.now, uid: D.uid, achievements: G.ACHIEVEMENTS, Economy: G.Economy,
    shopItem: id => { const it = D.getItem('shop', String(id)); return it && it.active ? it : null; },
    sold: id => D.db.prepare('SELECT COUNT(*) AS n FROM purchases WHERE item = ?').get(String(id)).n,
    task: id => G.TASKS.find(t => t.id === id),
    // Урок, который группе не добавлен или ещё не разрешён, для сервера не существует: квиз и отметки не засчитываются
    lesson: id => D.allLessons().find(l => l.id === id && G.Logic.lessonAccess(l, grp, u.role) === 'open'),
    moduleTitle: id => D.getItem('modules', String(id))?.title
  };
}
app.post('/api/me/actions', needUser, (req, res) => {
  const actions = req.body?.actions;
  if (!Array.isArray(actions) || !actions.length || actions.length > 50) fail(400, 'Нет действий.');
  const out = D.tx(() => {
    const row = D.getUser(req.user.id);
    const st = parseState(row) || D.GAME.Logic.fresh(me(row));
    const env = gameEnv(row);
    const results = actions.map(a => {
      try { return D.GAME.Logic.apply(st, a, env); } catch (e) { return { ok: false, msg: 'Действие не принято.' }; }
    });
    const p = syncProfile(row, st);
    D.db.prepare('UPDATE users SET state = ?, profile = ?, rev = rev + 1 WHERE id = ?').run(JSON.stringify(st), JSON.stringify(p), row.id);
    return { state: st, results: results.map(r => ({ ok: r.ok !== false, msg: r.msg })) };
  });
  res.json(out);
});

// Свой пароль: нужен текущий; остальные входы этого пользователя закрываются
app.post('/api/me/password', needUser, (req, res) => {
  const { current, password } = req.body || {};
  if (!A.verifyPassword(String(current || ''), req.user.pass)) fail(400, 'Текущий пароль указан неверно.');
  const pass = String(password || '');
  if (pass.length < 8 || pass.length > 200) fail(400, 'Новый пароль должен быть не короче 8 символов.');
  D.tx(() => {
    D.db.prepare('UPDATE users SET pass = ? WHERE id = ?').run(A.hashPassword(pass), req.user.id);
    const token = A.parseCookies(req.headers.cookie)[A.COOKIE];
    D.db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(req.user.id, A.sha(token));
    D.addLog({ kind: 'action', user: req.user.id, text: 'сменил свой пароль' });
  });
  res.json({ ok: true });
});

// Фон для администратора: бесплатно и любой; студенту фон надевается через магазин
const THEMES = ['night', 'day', 'autumn'];
app.post('/api/me/theme', needUser, (req, res) => {
  if (req.user.role !== 'admin') fail(403, 'Фон покупается в магазине.');
  const theme = String(req.body?.theme || 'night');
  if (!THEMES.includes(theme)) fail(400, 'Нет такого фона.');
  const p = JSON.parse(req.user.profile); p.theme = theme === 'night' ? null : theme;
  D.saveProfile(req.user.id, p);
  res.json({ theme });
});

// Студент просит открыть курс: заявка приходит администратору в раздел «Заявки»; одна ожидающая заявка на курс
app.post('/api/me/course-request', needUser, (req, res) => {
  const c = D.getItem('courses', String(req.body?.course || ''));
  if (!c || c.published === false) fail(404, 'Курс не найден.');
  const u = D.userOut(req.user), grp = u.group && D.getItem('groups', u.group);
  if ((u.courses || []).includes(c.id) || (grp?.courses || []).includes(c.id)) fail(409, 'Этот курс у вас уже открыт.');
  const pending = D.listColl('requests').find(r => r.user === u.id && r.course === c.id && r.status === 'pending');
  if (pending) return res.json(pending);
  const r = { id: D.uid('r'), user: u.id, course: c.id, status: 'pending', date: D.now() };
  D.tx(() => { D.putItem('requests', r); D.addLog({ kind: 'action', user: u.id, text: `просит открыть курс «${c.title}»` }); });
  res.status(201).json(r);
});

/* ---------- админка ---------- */
const coll = req => { const c = req.params.coll; if (!D.COLLS.includes(c)) fail(404, 'Нет такого раздела.'); return c; };
const label = (req, it) => `${String(req.body?.label || 'запись')} «${it.title || it.code || it.name || it.id}»`;
const adminLog = (req, text, extra = {}) => D.addLog({ kind: 'action', user: req.user.id, text, ...extra });

app.get('/api/admin/db', needAdmin, (req, res) => res.json(adminDb()));
app.get('/api/admin/requests', needAdmin, (req, res) => res.json(listRequests()));
// Заявка на курс: «открыть» добавляет курс студенту лично, «отклонить» только закрывает заявку
app.post('/api/admin/requests/:id/:verdict', needAdmin, (req, res) => {
  const r = D.getItem('requests', req.params.id);
  if (!r) fail(404, 'Заявка не найдена.');
  const verdict = req.params.verdict;
  if (!['approve', 'decline'].includes(verdict)) fail(404, 'Нет такого действия.');
  if (r.status !== 'pending') fail(409, 'Эта заявка уже рассмотрена.');
  const c = D.getItem('courses', r.course);
  const out = D.tx(() => {
    let user = null;
    if (verdict === 'approve') {
      if (!c) fail(404, 'Курс уже удалён.');
      user = changeUser(r.user, (p, st, row) => {
        p.courses = [...new Set([...(p.courses || []), c.id])];
        adminLog(req, `открыл «${row.name}» курс «${c.title}» по заявке`);
      });
    } else {
      const row = D.getUser(r.user);
      adminLog(req, `отклонил заявку «${row?.name || 'удалённый пользователь'}» на курс «${c?.title || 'удалённый курс'}»`);
    }
    const done = { ...r, status: verdict === 'approve' ? 'approved' : 'declined', decided: D.now(), by: req.user.id };
    D.putItem('requests', done);
    return { request: done, user };
  });
  res.json(out);
});
// Код регистрации группы: без пробелов, большими буквами, у каждой группы свой; пустой — регистрация в группу закрыта
function checkInvite(g) {
  if (g.invite === undefined || g.invite === null) g.invite = D.inviteCode();
  g.invite = String(g.invite).trim().toUpperCase().replace(/\s+/g, '');
  if (g.invite && g.invite.replace(/-/g, '').length < 4) fail(400, 'Код регистрации — хотя бы 4 символа.');
  if (g.invite && D.listColl('groups').some(x => x.id !== g.id && D.groupByInvite(g.invite)?.id === x.id)) fail(409, 'Такой код регистрации уже у другой группы.');
}

/* Урок, который администратор создал или изменил. Изменённый урок из content/lessons хранится под тем же id
   и заменяет исходный; запись { id, hidden, title } у урока курса только прячет или показывает его, не меняя текст.
   Поле hidden у любого урока: true — студенты не видят урок в разделе «Уроки», в кабинете и в заданиях. */
const str = (v, max) => typeof v === 'string' && v.length <= max;
function checkLesson(it) {
  const builtin = D.LESSONS.find(l => l.id === it.id);
  if (builtin && Object.keys(it).every(k => ['id', 'hidden', 'removed', 'title'].includes(k))) {
    const hidden = !!(it.hidden || it.removed);
    Object.keys(it).forEach(k => delete it[k]);
    Object.assign(it, { id: builtin.id, hidden, title: builtin.title });
    return;
  }
  if (it.removed === true) fail(400, 'Урок можно скрыть или удалить.');
  it.hidden = !!it.hidden;
  it.title = String(it.title || '').trim();
  if (it.title.length < 2 || it.title.length > 120) fail(400, 'Название урока — от 2 до 120 символов.');
  if (!D.getItem('modules', String(it.module))) fail(400, 'Выберите тему урока.');
  it.lesson = Math.max(1, Math.min(99, parseInt(it.lesson, 10) || 1));
  it.minutes = Math.max(1, Math.min(600, parseInt(it.minutes, 10) || 30));
  if (!str(it.difficulty, 30)) it.difficulty = 'Лёгкий';
  if (!str(it.markdown, 200000)) fail(400, 'Текст урока слишком длинный.');
  // Задания урока: список tasks (старое поле task — первое из них)
  const tasks = Array.isArray(it.tasks) ? it.tasks : it.task ? [it.task] : [];
  if (tasks.length > 6) fail(400, 'У урока — не больше 6 заданий.');
  tasks.forEach(id => { if (!D.GAME.TASKS.some(t => t.id === id)) fail(400, 'Нет такого задания.'); });
  it.tasks = [...new Set(tasks)];
  it.task = it.tasks[0] || null;
  it.kind = it.kind === 'practice' ? 'practice' : 'lecture';
  it.session = it.session == null || it.session === '' ? undefined : Math.max(1, Math.min(999, parseInt(it.session, 10) || 1));
  if (!Array.isArray(it.quiz) || it.quiz.length > 30) fail(400, 'Квиз: до 30 вопросов.');
  it.quiz.forEach((q, i) => {
    if (!str(q.q, 2000) || !q.q.trim()) fail(400, `Вопрос ${i + 1}: нет текста.`);
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 8 || !q.options.every(o => str(o, 500) && o.trim())) fail(400, `Вопрос ${i + 1}: нужно от 2 до 8 вариантов ответа.`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(400, `Вопрос ${i + 1}: отметьте верный ответ.`);
    if (q.explain !== undefined && !str(q.explain, 2000)) fail(400, `Вопрос ${i + 1}: пояснение слишком длинное.`);
  });
  it.groups = [];
  delete it.file;
}
function checkModule(m) {
  m.title = String(m.title || '').trim();
  if (m.title.length < 2 || m.title.length > 80) fail(400, 'Название темы — от 2 до 80 символов.');
  m.lessons = Math.max(0, Math.min(99, parseInt(m.lessons, 10) || 0));
  m.hidden = !!m.hidden; // скрытая тема: её уроки студенты не видят
}

// Уроки группы: только существующие; разрешить можно только добавленный урок. Новая группа начинает без уроков.
function checkLessons(g, old) {
  // Что скрыто у группы: темы и уроки (списки id); если не прислали — оставляем как было
  for (const k of ['hiddenModules', 'hiddenLessons']) {
    if (g[k] === undefined) g[k] = old?.[k] || [];
    if (!Array.isArray(g[k])) fail(400, 'Неверный список скрытого.');
    g[k] = [...new Set(g[k].filter(x => typeof x === 'string' && x.length <= 80))];
  }
  if (g.lessons === undefined && old) { if (old.lessons !== undefined) { g.lessons = old.lessons; g.lessonsOpen = old.lessonsOpen; } return; }
  if (g.lessons === undefined) g.lessons = [];
  const known = new Set(D.allLessons().map(l => l.id));
  if (!Array.isArray(g.lessons)) fail(400, 'Неверный список уроков.');
  g.lessons = [...new Set(g.lessons)].filter(id => known.has(id)); // удалённые уроки просто выпадают из списка
  g.lessonsOpen = (Array.isArray(g.lessonsOpen) ? g.lessonsOpen : []).filter(id => g.lessons.includes(id));
}
app.post('/api/admin/:coll', needAdmin, (req, res) => {
  const c = coll(req), it = req.body?.item;
  if (!it || typeof it !== 'object' || typeof it.id !== 'string' || !it.id) fail(400, 'Нет данных.');
  if (D.getItem(c, it.id)) fail(409, 'Такая запись уже есть.');
  if (c === 'groups') { checkInvite(it); checkLessons(it); }
  if (c === 'lessons') checkLesson(it);
  if (c === 'modules') checkModule(it);
  D.tx(() => { D.putItem(c, it); adminLog(req, `создал ${label(req, it)}`); });
  res.status(201).json(it);
});
app.put('/api/admin/:coll/:id', needAdmin, (req, res) => {
  const c = coll(req), it = req.body?.item;
  if (!D.getItem(c, req.params.id)) fail(404, 'Запись не найдена.');
  if (!it || typeof it !== 'object') fail(400, 'Нет данных.');
  it.id = req.params.id;
  if (c === 'groups') { checkInvite(it); checkLessons(it, D.getItem(c, it.id)); }
  if (c === 'lessons') checkLesson(it);
  if (c === 'modules') checkModule(it);
  D.tx(() => { D.putItem(c, it); adminLog(req, `изменил ${label(req, it)}`); });
  res.json(it);
});
app.delete('/api/admin/:coll/:id', needAdmin, (req, res, next) => {
  if (req.params.coll === 'users') return next(); // пользователей удаляет отдельный обработчик ниже
  const c = coll(req), it = D.getItem(c, req.params.id);
  if (!it) fail(404, 'Запись не найдена.');
  if (c === 'modules' && D.allLessons().some(l => l.module === it.id)) fail(409, 'В теме есть уроки. Сначала удалите их или перенесите в другую тему.');
  D.tx(() => { D.removeItem(c, it.id); adminLog(req, `удалил ${label(req, it)}`); });
  if (c === 'lectures' && it.file?.id) removeFile(it.file.id);
  if (c === 'groups') D.allUsers().filter(u => u.group === it.id).forEach(u => changeUser(u.id, p => { p.group = null; }));
  res.json({ ok: true });
});

// Действия с пользователями меняют и карточку, и состояние студента (версия растёт, страница студента подхватит)
function changeUser(id, fn) {
  const row = D.getUser(id);
  if (!row) fail(404, 'Пользователь не найден.');
  const p = JSON.parse(row.profile), st = parseState(row);
  fn(p, st, row);
  D.db.prepare('UPDATE users SET profile = ?, role = ?, state = ?, rev = rev + 1 WHERE id = ?').run(JSON.stringify(p), p.role, st && JSON.stringify(st), id);
  return D.userOut(D.getUser(id));
}
/* Время студента на задания: для карточки студента в админке.
   active — сколько секунд студент реально работал (страница считает, пока задание открыто и он что-то делает),
   solvedActive — сколько из них ушло до первой успешной сдачи; startedAt → solvedAt — сколько прошло по календарю. */
app.get('/api/admin/users/:id/tasks', needAdmin, (req, res) => {
  const row = D.getUser(req.params.id);
  if (!row) fail(404, 'Пользователь не найден.');
  const st = parseState(row), lessons = D.allLessons(), E = D.GAME.Economy;
  const tasks = Object.entries(st?.tasks || {}).map(([id, t]) => {
    const task = D.GAME.TASKS.find(x => x.id === id);
    if (!task || !t || !(t.startedAt || t.attempts)) return null;
    const l = task.lesson && lessons.find(x => x.id === task.lesson);
    return {
      id, title: task.title, where: l ? (l.session ? `Занятие ${l.session}. ${l.title}` : l.title) : 'Испытания', norm: task.minutes,
      startedAt: t.startedAt || null, solvedAt: t.solvedAt || null, lastDate: t.lastDate || null, attempts: t.attempts || 0,
      active: t.active || 0, solvedActive: t.solvedActive ?? null, solved: !!t.solved,
      best: t.best || 0, max: Math.round(task.points * (1 + E.CLEAN_SHARE + E.SPEED_SHARE))
    };
  }).filter(Boolean).sort((a, b) => String(b.lastDate || b.startedAt).localeCompare(String(a.lastDate || a.startedAt)));
  res.json({ tasks });
});
app.post('/api/admin/users/:id/role', needAdmin, (req, res) => {
  const role = req.body?.role;
  if (!['student', 'teacher', 'admin'].includes(role)) fail(400, 'Нет такой роли.');
  if (req.params.id === req.user.id) fail(400, 'Свою роль менять нельзя, иначе вы потеряете доступ к админке.');
  const u = D.tx(() => changeUser(req.params.id, (p, st, row) => {
    adminLog(req, `сменил роль «${row.name}»: ${p.role} → ${role}`); p.role = role;
  }));
  res.json(u);
});
app.post('/api/admin/users/:id/reset', needAdmin, (req, res) => {
  const u = D.tx(() => changeUser(req.params.id, (p, st, row) => {
    Object.keys(p.progress || {}).forEach(k => { p.progress[k] = 0; }); p.xp = 0;
    if (st) { st.xp = 0; st.tasks = {}; st.lessons = {}; st.history = []; }
    adminLog(req, `сбросил прогресс «${row.name}»`);
  }));
  res.json(u);
});
// Выдача достижений: сразу несколько одному игроку или одно сразу нескольким. Уже полученные пропускаются.
function grantAchievements(req, userId, list) {
  return changeUser(userId, (p, st, row) => {
    p.achievements ||= [];
    list.forEach(a => {
      if (p.achievements.some(x => x.id === a.id)) return;
      const date = D.now();
      p.achievements.push({ id: a.id, date }); p.souls = (p.souls || 0) + (a.reward || 0);
      if (st) { st.ach[a.id] ||= date; st.souls += a.reward || 0; }
      adminLog(req, `выдал достижение «${a.title}» игроку «${row.name}»`);
      if (a.reward) D.addLog({ kind: 'transaction', user: row.id, amount: a.reward, text: `Награда за достижение «${a.title}»` });
    });
  });
}
const achList = ids => {
  if (!Array.isArray(ids) || !ids.length || ids.length > 200) fail(400, 'Не выбрано ни одного.');
  return [...new Set(ids.map(String))];
};
app.post('/api/admin/users/:id/achievements', needAdmin, (req, res) => {
  const list = achList(req.body?.ids || (req.body?.id ? [req.body.id] : null)).map(id => D.getItem('achievements', id) || fail(404, 'Достижение не найдено.'));
  res.json(D.tx(() => grantAchievements(req, req.params.id, list)));
});
app.post('/api/admin/achievements/:id/grant', needAdmin, (req, res) => {
  const a = D.getItem('achievements', req.params.id);
  if (!a) fail(404, 'Достижение не найдено.');
  const users = achList(req.body?.users);
  res.json(D.tx(() => users.map(id => grantAchievements(req, id, [a]))));
});
app.post('/api/admin/users/:id/group', needAdmin, (req, res) => {
  const group = req.body?.group || null;
  if (group && !D.getItem('groups', group)) fail(404, 'Группа не найдена.');
  const u = D.tx(() => changeUser(req.params.id, (p, st, row) => {
    p.group = group;
    adminLog(req, `перевёл «${row.name}» в группу ${group ? D.getItem('groups', group).code : '«без группы»'}`);
  }));
  res.json(u);
});
// Доступ к курсам лично студенту (вдобавок к курсам его группы)
app.post('/api/admin/users/:id/courses', needAdmin, (req, res) => {
  const list = req.body?.courses;
  if (!Array.isArray(list) || list.some(id => !D.getItem('courses', String(id)))) fail(400, 'Неверный список курсов.');
  const u = D.tx(() => changeUser(req.params.id, (p, st, row) => {
    p.courses = [...new Set(list.map(String))];
    adminLog(req, `открыл «${row.name}» курсы: ${p.courses.map(id => D.getItem('courses', id).title).join(', ') || 'только курсы группы'}`);
  }));
  res.json(u);
});
// Новый пароль для забывшего: старые входы этого пользователя закрываются
app.post('/api/admin/users/:id/password', needAdmin, (req, res) => {
  const pass = String(req.body?.password || '');
  if (pass.length < 6 || pass.length > 200) fail(400, 'Пароль должен быть не короче 6 символов.');
  const row = D.getUser(req.params.id);
  if (!row) fail(404, 'Пользователь не найден.');
  D.tx(() => {
    D.db.prepare('UPDATE users SET pass = ? WHERE id = ?').run(A.hashPassword(pass), row.id);
    if (row.id !== req.user.id) D.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(row.id);
    adminLog(req, `сменил пароль «${row.name}»`);
  });
  res.json({ ok: true });
});
// Удаление: аккаунт, входы и покупки; записи журнала остаются для истории
app.delete('/api/admin/users/:id', needAdmin, (req, res) => {
  if (req.params.id === req.user.id) fail(400, 'Себя удалить нельзя.');
  const row = D.getUser(req.params.id);
  if (!row) fail(404, 'Пользователь не найден.');
  D.tx(() => {
    D.db.prepare('DELETE FROM purchases WHERE user = ?').run(row.id);
    D.db.prepare('DELETE FROM users WHERE id = ?').run(row.id);
    D.listColl('requests').filter(r => r.user === row.id).forEach(r => D.removeItem('requests', r.id));
    adminLog(req, `удалил пользователя «${row.name}»`);
  });
  res.json({ ok: true });
});
app.post('/api/admin/reset-demo', needAdmin, (req, res) => {
  if (!D.DEMO) fail(403, 'Сброс демо-данных выключен (DEMO_DATA=off).');
  const id = req.user.id;
  D.seed();
  // Сброс стирает все сессии; администратора из демо-данных пускаем обратно сразу
  if (D.getUser(id)) startSession(req, res, id);
  res.json({ ok: true });
});

/* ---------- файлы лекций ---------- */
function removeFile(id) {
  D.db.prepare('DELETE FROM files WHERE id = ?').run(id);
  fs.rmSync(path.join(D.UPLOADS, id), { force: true });
}
const safeId = id => /^f[a-z0-9]+$/.test(id) ? id : fail(404, 'Файл не найден.');

app.post('/api/files', needAdmin, express.raw({ type: () => true, limit: MAX_FILE }), (req, res) => {
  let name;
  try { name = decodeURIComponent(req.get('X-File-Name') || ''); } catch (e) { name = ''; }
  name = path.basename(name).slice(0, 200);
  const kind = name.toLowerCase().split('.').pop();
  if (!KINDS[kind]) fail(400, 'Подходят только файлы PDF и Word (.docx).');
  const body = req.body;
  if (!Buffer.isBuffer(body) || !body.length) fail(400, 'Файл пустой.');
  if (body.subarray(0, 4).toString('latin1') !== KINDS[kind].magic) fail(400, kind === 'pdf' ? 'Это не PDF-файл.' : 'Это не файл Word (.docx).');
  const id = 'f' + crypto.randomBytes(8).toString('hex');
  fs.writeFileSync(path.join(D.UPLOADS, id), body);
  const rec = { id, name, kind, size: body.length };
  D.db.prepare('INSERT INTO files (id, name, kind, size, added) VALUES (?, ?, ?, ?, ?)').run(id, name, kind, body.length, D.now());
  res.status(201).json(rec);
});
app.get('/api/files/:id', needUser, (req, res) => {
  const id = safeId(req.params.id);
  const f = D.db.prepare('SELECT * FROM files WHERE id = ?').get(id);
  if (!f) fail(404, 'Файл не найден.');
  const user = D.userOut(req.user);
  // Студенту отдаём файл, только если он прикреплён к лекции, открытой его группе
  if (user.role !== 'admin' && !D.listColl('lectures').some(l => l.file?.id === id && lectureOpen(l, user))) fail(403, 'Эта лекция вам недоступна.');
  res.set({
    'Content-Type': KINDS[f.kind].mime,
    'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    'X-File-Name': encodeURIComponent(f.name), 'X-File-Kind': f.kind,
    'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-cache'
  });
  res.sendFile(path.join(D.UPLOADS, id));
});
app.delete('/api/files/:id', needAdmin, (req, res) => {
  removeFile(safeId(req.params.id));
  res.json({ ok: true });
});

app.use('/api', (req, res, next) => next(new HttpError(404, 'Нет такого адреса.')));

/* ---------- страницы ---------- */
// Без входа страницы студента не открываются; админка — только администратору
const PAGES = { 'cabinet.html': 'user', 'lessons.html': 'user', 'tasks.html': 'user', 'shop.html': 'user', 'leaderboard.html': 'user', 'home.html': 'user', 'admin.html': 'admin' };
app.get('/:page', (req, res, next) => {
  const need = PAGES[req.params.page];
  if (!need) return next();
  if (need === 'admin' && req.user?.role !== 'admin') return res.redirect('/index.html#admin');
  if (!req.user) return res.redirect('/index.html');
  next();
});
// Служебные папки наружу не отдаём
app.use((req, res, next) => /^\/(server|data|node_modules|package(-lock)?\.json)(\/|$)/.test(req.path) ? res.status(404).end() : next());

/* Кэш. Страница каждый раз сверяется с сервером, а скрипты, стили и картинки в ней (кроме шрифтов) получают метку ?v=<хеш файла>.
   С меткой браузер хранит файл год и не спрашивает сервер вовсе; изменился файл — изменилась метка, и браузер скачает новый. */
const stamps = new Map(), pages = new Map();
function stamp(rel) {
  const file = path.join(ROOT, rel);
  let st; try { st = fs.statSync(file); } catch (e) { return null; }
  const hit = stamps.get(rel);
  if (hit && hit.mtime === st.mtimeMs) return hit.v;
  const v = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  stamps.set(rel, { mtime: st.mtimeMs, v });
  return v;
}
function page(rel) {
  const file = path.join(ROOT, rel);
  let st; try { st = fs.statSync(file); } catch (e) { return null; }
  const hit = pages.get(rel);
  if (hit && hit.mtime === st.mtimeMs) return hit.html;
  const html = fs.readFileSync(file, 'utf8').replace(/((?:src|href)=")((?:js|css|vendor|img)\/[^"?#]+)"/g,
    (all, attr, url) => { const v = stamp(url); return v ? `${attr}${url}?v=${v}"` : all; });
  pages.set(rel, { mtime: st.mtimeMs, html });
  return html;
}
app.get(['/', '/:page.html'], (req, res, next) => {
  const html = page(req.params.page ? req.params.page + '.html' : 'index.html');
  if (html == null) return next();
  res.type('html').set('Cache-Control', 'no-cache').send(html);
});
const YEAR = 'public, max-age=31536000, immutable';
app.use(express.static(ROOT, {
  dotfiles: 'ignore',
  setHeaders: (res, file) => {
    const req = res.req;
    if (req.query.v) res.set('Cache-Control', YEAR);
    // Шрифты, библиотеки и картинки меняются редко: неделя без вопросов к серверу
    else if (/^\/(fonts|vendor|img)\//.test(req.path)) res.set('Cache-Control', 'public, max-age=604800');
    else res.set('Cache-Control', 'no-cache');
  }
}));

/* ---------- ошибки ---------- */
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const msg = err instanceof HttpError ? err.message
    : err.type === 'entity.too.large' ? 'Файл больше 20 МБ.'
    : err.type === 'entity.parse.failed' ? 'Неверный формат запроса.'
    : 'Ошибка сервера.';
  if (status >= 500) console.error(err);
  if (req.path.startsWith('/api')) res.status(status).json({ error: msg });
  else res.status(status).send(msg);
});

const PORT = +process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Пепельный Пиксель: http://localhost:${PORT}`));
