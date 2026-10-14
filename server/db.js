/* База SQLite (встроенный в Node модуль node:sqlite, ничего компилировать не нужно).
   Таблицы:
   users     — аккаунты: логин, имя, e-mail, хеш пароля, роль; profile — карточка для админки (опыт, души, группа…),
               state — состояние студента со страниц кабинета, заданий и магазина (js/student-store.js)
   items     — разделы админки: группы, курсы, модули, задания, лекции, достижения, магазин
   purchases — покупки, logs — журнал, files — файлы лекций, sessions — входы */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DatabaseSync } = require('node:sqlite');
const { hashPassword } = require('./auth');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const UPLOADS = path.join(DATA_DIR, 'uploads');
const COLLS = ['courses', 'modules', 'groups', 'achievements', 'tasks', 'lectures', 'shop', 'lessons'];

fs.mkdirSync(UPLOADS, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'ash.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, login TEXT UNIQUE, email TEXT, name TEXT NOT NULL,
    name_key TEXT UNIQUE NOT NULL, email_key TEXT UNIQUE,
    pass TEXT, role TEXT NOT NULL DEFAULT 'student',
    profile TEXT NOT NULL, state TEXT, rev INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS items (coll TEXT NOT NULL, id TEXT NOT NULL, pos INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (coll, id));
  CREATE TABLE IF NOT EXISTS purchases (id TEXT PRIMARY KEY, user TEXT, item TEXT, price INTEGER, date TEXT);
  CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, kind TEXT, user TEXT, date TEXT, data TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS logs_date ON logs(date);
  CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, name TEXT, kind TEXT, size INTEGER, added TEXT);
  CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
`);

const now = () => new Date().toISOString();
const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
// SQLite не умеет lower() для кириллицы, поэтому ключи для поиска считаем здесь
const key = s => String(s || '').trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ');

function tx(fn) {
  db.exec('BEGIN');
  try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; }
}

/* ---------- пользователи ---------- */
function userOut(row) {
  if (!row) return null;
  const p = JSON.parse(row.profile);
  return { ...p, id: row.id, name: row.name, email: row.email, role: row.role };
}
const getUser = id => db.prepare('SELECT * FROM users WHERE id = ?').get(id);
function findLogin(login) {
  const k = key(login);
  return db.prepare('SELECT * FROM users WHERE login = ? OR email_key = ? OR name_key = ?').get(String(login).trim(), k, k);
}
const nameTaken = name => !!db.prepare('SELECT 1 FROM users WHERE name_key = ?').get(key(name));
const emailTaken = email => !!db.prepare('SELECT 1 FROM users WHERE email_key = ?').get(key(email));

function insertUser({ id, login = null, name, email = null, pass = null, role = 'student', profile, state = null }) {
  db.prepare(`INSERT INTO users (id, login, email, name, name_key, email_key, pass, role, profile, state, created)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, login, email, name, key(name), email ? key(email) : null, pass, role, JSON.stringify(profile), state && JSON.stringify(state), profile.created || now());
}
function saveProfile(id, profile) {
  db.prepare('UPDATE users SET profile = ?, role = ? WHERE id = ?').run(JSON.stringify(profile), profile.role, id);
}
const allUsers = () => db.prepare('SELECT * FROM users ORDER BY created, id').all().map(userOut);

/* ---------- разделы админки ---------- */
const listColl = coll => db.prepare('SELECT data FROM items WHERE coll = ? ORDER BY pos').all(coll).map(r => JSON.parse(r.data));
const getItem = (coll, id) => { const r = db.prepare('SELECT data FROM items WHERE coll = ? AND id = ?').get(coll, id); return r ? JSON.parse(r.data) : null; };
function putItem(coll, item) {
  const old = db.prepare('SELECT pos FROM items WHERE coll = ? AND id = ?').get(coll, item.id);
  const pos = old ? old.pos : (db.prepare('SELECT COALESCE(MAX(pos), -1) + 1 AS p FROM items WHERE coll = ?').get(coll).p);
  db.prepare('INSERT OR REPLACE INTO items (coll, id, pos, data) VALUES (?, ?, ?, ?)').run(coll, item.id, pos, JSON.stringify(item));
}
const removeItem = (coll, id) => db.prepare('DELETE FROM items WHERE coll = ? AND id = ?').run(coll, id);

/* ---------- журнал и покупки ---------- */
function addLog(entry) {
  const e = { id: uid('e'), date: now(), ...entry };
  db.prepare('INSERT OR IGNORE INTO logs (id, kind, user, date, data) VALUES (?, ?, ?, ?, ?)').run(e.id, e.kind, e.user || null, e.date, JSON.stringify(e));
  return e;
}
const listLogs = (limit = 1000) => db.prepare('SELECT data FROM logs ORDER BY date DESC LIMIT ?').all(limit).map(r => JSON.parse(r.data));
function addPurchase(p) {
  db.prepare('INSERT OR IGNORE INTO purchases (id, user, item, price, date) VALUES (?, ?, ?, ?, ?)').run(p.id, p.user, p.item, p.price, p.date);
}
const listPurchases = () => db.prepare('SELECT id, user, item, price, date FROM purchases ORDER BY date DESC').all().map(r => ({ ...r }));

/* ---------- начальные данные ---------- */
// Берём их из того же js/admin-data.js, что раньше жил в браузере, чтобы демо выглядело так же
function loadSeed() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/admin-data.js'), 'utf8'), ctx);
  return JSON.parse(JSON.stringify(ctx.window.ADMIN_SEED));
}
// Уроки, задания, достижения и правила экономики — те же файлы, что работают в браузере
const shared = { window: {} };
// js/tasks-course.js — задания курса МДК.08.01, его собирает node tools/build-content.mjs
['js/economy.js', 'js/content.js', 'js/data.js', 'js/tasks-data.js', 'js/tasks-course.js', 'js/student-logic.js']
  .filter(f => fs.existsSync(path.join(ROOT, f)))
  .forEach(f => vm.runInNewContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), shared, { filename: f }));
const W = shared.window;
const LESSONS = W.LESSONS, lessonDone = W.Economy.lessonDone;
// Текст урока лежит отдельно (content/md/<id>.md): страница уроков подгружает его сама, а админке он нужен для правки
LESSONS.forEach(l => {
  if (l.markdown != null) return;
  try { l.markdown = fs.readFileSync(path.join(ROOT, 'content', 'md', l.id + '.md'), 'utf8').trim(); } catch (e) { l.markdown = ''; }
});
// Уроки из content/lessons плюс то, что администратор создал или изменил в разделе «Уроки групп» (коллекция lessons)
// Список пересчитывается, только когда администратор что-то поменял (сравниваем сырые записи); менять его снаружи нельзя
let lessonsMemo = { key: null, list: [] };
function allLessons() {
  const rows = db.prepare("SELECT data FROM items WHERE coll = 'lessons' ORDER BY pos").all().map(r => r.data);
  // Скрытая тема прячет свои уроки, поэтому темы тоже входят в ключ
  const mods = db.prepare("SELECT data FROM items WHERE coll = 'modules' ORDER BY pos").all().map(r => r.data);
  const k = rows.join('\n') + '\n--\n' + mods.join('\n');
  if (k !== lessonsMemo.key) lessonsMemo = { key: k, list: JSON.parse(JSON.stringify(W.StudentLogic.mergeLessons(LESSONS, rows.map(r => JSON.parse(r)), mods.map(r => JSON.parse(r))))) };
  return lessonsMemo.list;
}
const GAME = { Economy: W.Economy, Logic: W.StudentLogic, TASKS: W.TASKS, ACHIEVEMENTS: W.STUDENT.achievements };

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || '123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123123123';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'astora123';
// DEMO_DATA=off — рабочий режим: при создании базы нет выдуманных студентов, покупок и журнала,
// а кнопка «Сбросить демо-данные» в админке отключена
const DEMO = process.env.DEMO_DATA !== 'off';

function seed(demo = DEMO) {
  const s = loadSeed();
  if (!demo) {
    s.users = s.users.slice(0, 1).map(u => ({ ...u, lastSeen: now(), created: now() }));
    s.purchases = []; s.logs = [];
  }
  tx(() => {
    ['users', 'items', 'purchases', 'logs', 'files', 'sessions'].forEach(t => db.exec(`DELETE FROM ${t}`));
    COLLS.forEach(c => (s[c] || []).forEach(item => putItem(c, item)));
    s.users.forEach((u, i) => {
      const admin = i === 0, student = u.id === 'u24';
      insertUser({
        id: u.id, login: admin ? ADMIN_LOGIN : null, name: u.name, role: u.role, profile: { ...u, email: undefined },
        // Войти можно администратором и демо-студентом «Солер из Асторы», остальные — примеры для таблиц
        pass: admin ? hashPassword(ADMIN_PASSWORD) : student ? hashPassword(DEMO_PASSWORD) : null
      });
    });
    s.purchases.forEach(addPurchase);
    s.logs.forEach(addLog);
    db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('seeded', now());
  });
  ensureInvites();
  fs.readdirSync(UPLOADS).forEach(f => fs.rmSync(path.join(UPLOADS, f), { force: true }));
}
// Код для регистрации в группе: студент вводит его при регистрации и сразу попадает в свою группу
const CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const inviteCode = () => { const b = require('node:crypto').randomBytes(8); const c = [...b].map(x => CODE_ABC[x % CODE_ABC.length]).join(''); return c.slice(0, 4) + '-' + c.slice(4); };
const inviteKey = s => String(s || '').trim().toUpperCase().replace(/[\s-]/g, '');
function ensureInvites() {
  listColl('groups').forEach(g => { if (g.invite === undefined) putItem('groups', { ...g, invite: inviteCode() }); });
}
const groupByInvite = code => { const k = inviteKey(code); return k ? listColl('groups').find(g => g.invite && inviteKey(g.invite) === k) : null; };

// Сайт больше не хранит e-mail: убираем его у тех, кто зарегистрировался раньше (войти можно по имени персонажа)
function dropEmails() {
  const rows = db.prepare('SELECT id, profile FROM users WHERE email IS NOT NULL OR profile LIKE \'%"email"%\'').all();
  if (!rows.length) return;
  tx(() => rows.forEach(r => {
    const p = JSON.parse(r.profile); delete p.email; delete p.consentAt;
    db.prepare('UPDATE users SET email = NULL, email_key = NULL, profile = ? WHERE id = ?').run(JSON.stringify(p), r.id);
  }));
}

// Фоны «Привал у костра» и «Осенний привал» появились позже: в уже созданную базу добавляем их один раз
function ensureThemes() {
  if (db.prepare('SELECT value FROM meta WHERE key = ?').get('themes')) return;
  const have = new Set(listColl('shop').map(s => s.id));
  tx(() => {
    loadSeed().shop.filter(s => s.type === 'theme' && !have.has(s.id)).forEach(s => putItem('shop', s));
    db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('themes', now());
  });
}

// Курс МДК.08.01 появился позже: в уже созданную базу один раз добавляем курс и его темы (группы не трогаем)
function ensureCourse() {
  if (db.prepare('SELECT value FROM meta WHERE key = ?').get('mdk0801')) return;
  const s = loadSeed();
  const have = c => new Set(listColl(c).map(x => x.id));
  const mods = have('modules'), courses = have('courses');
  tx(() => {
    s.modules.filter(m => m.id.startsWith('mdk') && !mods.has(m.id)).forEach(m => putItem('modules', m));
    s.courses.filter(c => c.id === 'c6' && !courses.has(c.id)).forEach(c => putItem('courses', c));
    db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('mdk0801', now());
  });
}

if (!db.prepare('SELECT value FROM meta WHERE key = ?').get('seeded')) { seed(); db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('mdk0801', now()); }
// Темы курса (кнопка «Открыть» в кабинете): старым базам проставляем их из начальных данных, если поля ещё нет
function ensureCourseModules() {
  if (db.prepare('SELECT value FROM meta WHERE key = ?').get('courseModules')) return;
  const s = loadSeed();
  tx(() => {
    listColl('courses').forEach(c => {
      if (Array.isArray(c.modules)) return;
      const seedC = s.courses.find(x => x.id === c.id);
      putItem('courses', { ...c, modules: (seedC?.modules || []).filter(id => getItem('modules', id)) });
    });
    db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('courseModules', now());
  });
}

ensureCourse();
ensureCourseModules();
ensureInvites();
ensureThemes();
dropEmails();

module.exports = {
  db, tx, now, uid, key, COLLS, UPLOADS,
  getUser, findLogin, nameTaken, emailTaken, insertUser, saveProfile, userOut, allUsers,
  listColl, getItem, putItem, removeItem, addLog, listLogs, addPurchase, listPurchases, seed,
  ADMIN_LOGIN, DEMO_PASSWORD, DEMO, LESSONS, allLessons, lessonDone, GAME, inviteCode, groupByInvite, ROOT
};
