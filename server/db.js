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
const COLLS = ['courses', 'modules', 'groups', 'achievements', 'tasks', 'lectures', 'shop'];

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

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || '123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123123123';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'astora123';

function seed() {
  const s = loadSeed();
  tx(() => {
    ['users', 'items', 'purchases', 'logs', 'files', 'sessions'].forEach(t => db.exec(`DELETE FROM ${t}`));
    COLLS.forEach(c => s[c].forEach(item => putItem(c, item)));
    s.users.forEach((u, i) => {
      const admin = i === 0, demo = u.id === 'u24';
      insertUser({
        id: u.id, login: admin ? ADMIN_LOGIN : null, name: u.name, email: u.email, role: u.role, profile: u,
        // Войти можно администратором и демо-студентом «Солер из Асторы», остальные — примеры для таблиц
        pass: admin ? hashPassword(ADMIN_PASSWORD) : demo ? hashPassword(DEMO_PASSWORD) : null
      });
    });
    s.purchases.forEach(addPurchase);
    s.logs.forEach(addLog);
    db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('seeded', now());
  });
  fs.readdirSync(UPLOADS).forEach(f => fs.rmSync(path.join(UPLOADS, f), { force: true }));
}
if (!db.prepare('SELECT value FROM meta WHERE key = ?').get('seeded')) seed();

module.exports = {
  db, tx, now, uid, key, COLLS, UPLOADS,
  getUser, findLogin, nameTaken, emailTaken, insertUser, saveProfile, userOut, allUsers,
  listColl, getItem, putItem, removeItem, addLog, listLogs, addPurchase, listPurchases, seed,
  ADMIN_LOGIN, DEMO_PASSWORD
};
