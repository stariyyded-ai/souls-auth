/* Сервер Пепельного Пикселя: Express + SQLite.
   Отдаёт страницы сайта, пускает на них только после входа, админку — только администратору,
   хранит аккаунты, прогресс студентов, покупки, разделы админки и файлы лекций.
   Запуск: npm start (порт из PORT, по умолчанию 3000). */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const D = require('./db');
const A = require('./auth');

if (process.argv.includes('--reset')) {
  D.seed();
  console.log('База пересоздана из демо-данных.');
  process.exit(0);
}

const ROOT = path.join(__dirname, '..');
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // за прокси Render, Railway или nginx req.secure и req.ip берутся из заголовков

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
  const u = D.userOut(row);
  return { id: u.id, name: u.name, email: u.email, role: u.role, group: u.group || null, xp: u.xp || 0, souls: u.souls || 0, hidden: !!u.hidden, achievements: u.achievements || [] };
}
function adminDb() {
  const out = {};
  D.COLLS.forEach(c => { out[c] = D.listColl(c); });
  return { ...out, users: D.allUsers(), purchases: D.listPurchases(), logs: D.listLogs() };
}
// Студент видит только то, что ему положено: опубликованные лекции своей группы,
// других игроков без e-mail, а скрывшихся из таблицы лидеров — без имени и опыта
function studentDb(row) {
  const self = D.userOut(row);
  const out = {};
  ['courses', 'modules', 'groups', 'achievements'].forEach(c => { out[c] = D.listColl(c); });
  out.shop = D.listColl('shop').filter(s => s.active);
  out.lectures = D.listColl('lectures').filter(l => lectureOpen(l, self));
  out.tasks = [];
  out.users = D.allUsers().filter(u => u.role === 'student' || u.id === self.id).map(u =>
    u.hidden && u.id !== self.id ? { id: u.id, role: u.role, group: u.group, name: '', xp: 0, hidden: true }
      : { id: u.id, role: u.role, group: u.group, name: u.name, xp: u.xp || 0, hidden: !!u.hidden });
  out.purchases = D.listPurchases().map(p => ({ id: p.id, item: p.item, user: p.user === self.id ? p.user : null }));
  out.logs = [];
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
    me: me(row), state: parseState(row), rev: row.rev,
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
  const name = String(b.name || '').trim().replace(/\s+/g, ' '), email = String(b.email || '').trim(), pass = String(b.password || '');
  if (A.tooMany('reg:' + req.ip)) fail(429, 'Слишком много регистраций с этого адреса. Подождите 10 минут.');
  if (name.length < 2 || name.length > 40) fail(400, 'Имя персонажа — от 2 до 40 символов.');
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 120) fail(400, 'Проверьте e-mail.');
  if (pass.length < 4 || pass.length > 200) fail(400, 'Пароль должен быть не короче 4 символов.');
  if (D.nameTaken(name) || D.key(name) === D.key(D.ADMIN_LOGIN)) fail(409, 'Это имя уже занято. Выберите другое.');
  if (D.emailTaken(email)) fail(409, 'Этот e-mail уже зарегистрирован. Войдите.');
  A.failed('reg:' + req.ip);
  const id = D.uid('u'), created = D.now();
  const progress = {}; D.listColl('modules').forEach(m => { progress[m.id] = 0; });
  // Новичок попадает в первую группу; перевести в другую можно в админке
  const group = D.listColl('groups')[0]?.id || null;
  const profile = { id, name, email, role: 'student', group, xp: 0, souls: 0, lastSeen: created, created, progress, hidden: false, achievements: [] };
  D.insertUser({ id, name, email, pass: A.hashPassword(pass), profile });
  D.addLog({ kind: 'action', user: id, text: 'зарегистрировался' });
  res.status(201).json({ id, name });
});

app.post('/api/logout', (req, res) => {
  if (req.user) D.addLog({ kind: 'action', user: req.user.id, text: 'вышел из системы' });
  endSession(req, res);
  res.json({ ok: true });
});

/* ---------- состояние студента ---------- */
// Страница присылает своё состояние целиком вместе с номером версии.
// Если версия устарела (админ сбросил прогресс или выдал награду), сервер вернёт свежее состояние.
function checkState(st) {
  if (!st || typeof st !== 'object' || st.v !== 1) fail(400, 'Неверный формат состояния.');
  for (const k of ['xp', 'souls']) if (!Number.isFinite(st[k]) || st[k] < 0) fail(400, 'Неверный формат состояния.');
  for (const k of ['ach', 'tasks', 'lessons', 'inv', 'equipped', 'boosters']) if (!st[k] || typeof st[k] !== 'object') fail(400, 'Неверный формат состояния.');
  for (const k of ['history', 'journal']) if (!Array.isArray(st[k])) fail(400, 'Неверный формат состояния.');
}
// То, что видно админке: опыт, души, скрытие, достижения; покупки и награды — в журнал
function syncProfile(row, st) {
  const p = JSON.parse(row.profile);
  p.xp = st.xp; p.souls = st.souls; p.hidden = !!st.hidden; p.lastSeen = D.now();
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
app.put('/api/me/state', needUser, (req, res) => {
  const { state, rev } = req.body || {};
  const row = D.getUser(req.user.id);
  if (rev !== row.rev) return res.status(409).json({ error: 'Данные изменились.', state: parseState(row), rev: row.rev, me: me(row) });
  checkState(state);
  const next = D.tx(() => {
    const p = syncProfile(row, state);
    D.db.prepare('UPDATE users SET state = ?, profile = ?, rev = rev + 1 WHERE id = ?').run(JSON.stringify(state), JSON.stringify(p), row.id);
    return row.rev + 1;
  });
  res.json({ rev: next });
});

/* ---------- админка ---------- */
const coll = req => { const c = req.params.coll; if (!D.COLLS.includes(c)) fail(404, 'Нет такого раздела.'); return c; };
const label = (req, it) => `${String(req.body?.label || 'запись')} «${it.title || it.code || it.name || it.id}»`;
const adminLog = (req, text, extra = {}) => D.addLog({ kind: 'action', user: req.user.id, text, ...extra });

app.get('/api/admin/db', needAdmin, (req, res) => res.json(adminDb()));

app.post('/api/admin/:coll', needAdmin, (req, res) => {
  const c = coll(req), it = req.body?.item;
  if (!it || typeof it !== 'object' || typeof it.id !== 'string' || !it.id) fail(400, 'Нет данных.');
  if (D.getItem(c, it.id)) fail(409, 'Такая запись уже есть.');
  D.tx(() => { D.putItem(c, it); adminLog(req, `создал ${label(req, it)}`); });
  res.status(201).json(it);
});
app.put('/api/admin/:coll/:id', needAdmin, (req, res) => {
  const c = coll(req), it = req.body?.item;
  if (!D.getItem(c, req.params.id)) fail(404, 'Запись не найдена.');
  if (!it || typeof it !== 'object') fail(400, 'Нет данных.');
  it.id = req.params.id;
  D.tx(() => { D.putItem(c, it); adminLog(req, `изменил ${label(req, it)}`); });
  res.json(it);
});
app.delete('/api/admin/:coll/:id', needAdmin, (req, res) => {
  const c = coll(req), it = D.getItem(c, req.params.id);
  if (!it) fail(404, 'Запись не найдена.');
  D.tx(() => { D.removeItem(c, it.id); adminLog(req, `удалил ${label(req, it)}`); });
  if (c === 'lectures' && it.file?.id) removeFile(it.file.id);
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
app.post('/api/admin/users/:id/achievements', needAdmin, (req, res) => {
  const a = D.getItem('achievements', req.body?.id);
  if (!a) fail(404, 'Достижение не найдено.');
  const u = D.tx(() => changeUser(req.params.id, (p, st, row) => {
    p.achievements ||= [];
    if (p.achievements.some(x => x.id === a.id)) fail(409, 'Это достижение уже выдано.');
    const date = D.now();
    p.achievements.push({ id: a.id, date }); p.souls = (p.souls || 0) + (a.reward || 0);
    if (st) { st.ach[a.id] ||= date; st.souls += a.reward || 0; }
    adminLog(req, `выдал достижение «${a.title}» игроку «${row.name}»`);
    if (a.reward) D.addLog({ kind: 'transaction', user: row.id, amount: a.reward, text: `Награда за достижение «${a.title}»` });
  }));
  res.json(u);
});
app.post('/api/admin/reset-demo', needAdmin, (req, res) => {
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
app.use(express.static(ROOT, {
  dotfiles: 'ignore',
  setHeaders: (res, file) => { if (file.endsWith('.html')) res.set('Cache-Control', 'no-cache'); }
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
