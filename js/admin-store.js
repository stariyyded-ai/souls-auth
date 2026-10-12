/* Хранилище админ-панели: данные в памяти + сохранение в localStorage.
   Каждое изменение пишется в журнал событий (раздел «Логи»).
   Чтобы подключить сервер, достаточно заменить load/save на запросы к API. */
(() => {
  const KEY = 'ash:admin:v1';
  const clone = o => JSON.parse(JSON.stringify(o));
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; }
  if (!db || !db.users) db = clone(window.ADMIN_SEED);

  const listeners = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
    listeners.forEach(fn => fn());
  }
  const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);

  // Кто сейчас работает в админке (для журнала)
  const ADMIN_ID = 'u1';

  const store = {
    get db() { return db; },
    on(fn) { listeners.add(fn); },
    byId(coll, id) { return db[coll].find(x => x.id === id); },
    log(kind, text, extra = {}) {
      db.logs.unshift({ id: uid('e'), kind, user: extra.user || ADMIN_ID, text, date: new Date().toISOString(), ...extra });
    },
    create(coll, item, label) {
      const it = { ...item, id: uid(coll[0]) };
      db[coll].push(it);
      this.log('action', `создал ${label} «${it.title || it.code || it.name}»`);
      save(); return it;
    },
    update(coll, id, patch, label) {
      const it = this.byId(coll, id); Object.assign(it, patch);
      this.log('action', `изменил ${label} «${it.title || it.code || it.name}»`);
      save(); return it;
    },
    remove(coll, id, label) {
      const it = this.byId(coll, id);
      db[coll] = db[coll].filter(x => x.id !== id);
      this.log('action', `удалил ${label} «${it.title || it.code || it.name}»`);
      save();
    },
    // Действия с пользователями
    setRole(userId, role) {
      const u = this.byId('users', userId), old = u.role; u.role = role;
      this.log('action', `сменил роль «${u.name}»: ${old} → ${role}`); save();
    },
    resetProgress(userId) {
      const u = this.byId('users', userId);
      Object.keys(u.progress).forEach(k => u.progress[k] = 0); u.xp = 0;
      this.log('action', `сбросил прогресс «${u.name}»`); save();
    },
    grantAchievement(userId, achId) {
      const u = this.byId('users', userId), a = this.byId('achievements', achId);
      if (u.achievements.some(x => x.id === achId)) return false;
      u.achievements.push({ id: achId, date: new Date().toISOString() });
      u.souls += a.reward || 0;
      this.log('action', `выдал достижение «${a.title}» игроку «${u.name}»`);
      if (a.reward) this.log('transaction', `Награда за достижение «${a.title}»`, { user: userId, amount: a.reward });
      save(); return true;
    },
    resetDemo() { db = clone(window.ADMIN_SEED); save(); }
  };
  window.AdminStore = store;
})();
