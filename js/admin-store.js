/* Хранилище админ-панели. Данные приходят с сервера в api/boot.js (window.BOOT.db).
   Изменение сразу видно на странице и тут же уходит на сервер; сервер сам пишет его в журнал.
   Если сервер отказал, показываем причину и перечитываем данные с сервера.
   Страницы студента (магазин, лидеры, уроки) получают урезанную версию: без e-mail, журнала и черновиков. */
(() => {
  const B = window.BOOT, Ash = window.Ash;
  let db = B.db;

  const listeners = new Set();
  const save = () => listeners.forEach(fn => fn());
  const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  const ADMIN_ID = B.me.id;
  const name = it => it.title || it.code || it.name;

  async function reload() {
    try { db = await Ash.api('GET', 'api/admin/db'); save(); } catch (e) {}
  }
  // Отправляем изменение; при ошибке — сообщение и данные с сервера
  async function send(method, url, body) {
    try { return await Ash.api(method, url, body); }
    catch (e) {
      if (e.status === 401) { location.replace('index.html#admin'); return null; }
      Ash.notice('Сервер не сохранил изменение: ' + e.message);
      await reload();
      return null;
    }
  }
  // Карточку пользователя после действия берём из ответа сервера
  const putUser = u => { if (!u) return; const i = db.users.findIndex(x => x.id === u.id); if (i >= 0) db.users[i] = u; save(); };

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
      this.log('action', `создал ${label} «${name(it)}»`);
      save();
      send('POST', `api/admin/${coll}`, { item: it, label });
      return it;
    },
    update(coll, id, patch, label) {
      const it = this.byId(coll, id); Object.assign(it, patch);
      this.log('action', `изменил ${label} «${name(it)}»`);
      save();
      send('PUT', `api/admin/${coll}/${encodeURIComponent(id)}`, { item: it, label });
      return it;
    },
    remove(coll, id, label) {
      const it = this.byId(coll, id);
      db[coll] = db[coll].filter(x => x.id !== id);
      this.log('action', `удалил ${label} «${name(it)}»`);
      save();
      send('DELETE', `api/admin/${coll}/${encodeURIComponent(id)}`, { label });
    },
    // Действия с пользователями
    async setRole(userId, role) {
      const u = this.byId('users', userId), old = u.role; u.role = role;
      this.log('action', `сменил роль «${u.name}»: ${old} → ${role}`); save();
      putUser(await send('POST', `api/admin/users/${userId}/role`, { role }));
    },
    async resetProgress(userId) {
      const u = this.byId('users', userId);
      Object.keys(u.progress).forEach(k => u.progress[k] = 0); u.xp = 0;
      this.log('action', `сбросил прогресс «${u.name}»`); save();
      putUser(await send('POST', `api/admin/users/${userId}/reset`));
    },
    // Достижения: несколько одному игроку или одно нескольким; журнал и души берём с сервера
    async grantAchievements(userId, ids) {
      const r = await send('POST', `api/admin/users/${userId}/achievements`, { ids });
      if (r) await reload();
      return !!r;
    },
    async grantToUsers(achId, users) {
      const r = await send('POST', `api/admin/achievements/${encodeURIComponent(achId)}/grant`, { users });
      if (r) await reload();
      return !!r;
    },
    /* ---------- заявки на курсы ---------- */
    pending() { return (db.requests || []).filter(r => r.status === 'pending'); },
    async decideRequest(id, verdict) {
      const r = await send('POST', `api/admin/requests/${encodeURIComponent(id)}/${verdict}`);
      if (!r) return false;
      db.requests = db.requests.map(x => x.id === id ? r.request : x);
      if (r.user) putUser(r.user);
      const it = r.request, c = this.byId('courses', it.course), u = this.byId('users', it.user);
      this.log('action', verdict === 'approve' ? `открыл «${u?.name}» курс «${c?.title}» по заявке` : `отклонил заявку «${u?.name}» на курс «${c?.title}»`);
      save(); return true;
    },
    // Проверка новых заявок, пока админка открыта; возвращает заявки, которых раньше не было
    async pollRequests() {
      let list; try { list = await Ash.api('GET', 'api/admin/requests'); } catch (e) { return []; }
      const known = new Set((db.requests || []).map(r => r.id));
      const fresh = list.filter(r => !known.has(r.id));
      const changed = fresh.length || list.some(r => (db.requests || []).find(x => x.id === r.id)?.status !== r.status);
      db.requests = list;
      if (fresh.length) await reload(); else if (changed) save();
      return fresh;
    },
    async setGroup(userId, group) {
      const u = this.byId('users', userId); u.group = group || null; save();
      putUser(await send('POST', `api/admin/users/${userId}/group`, { group: group || null }));
    },
    // Пароль виден только администратору в момент смены; сервер хранит лишь хеш
    async setPassword(userId, password) {
      const r = await send('POST', `api/admin/users/${userId}/password`, { password });
      if (r) { this.log('action', `сменил пароль «${this.byId('users', userId).name}»`); save(); }
      return !!r;
    },
    async setCourses(userId, courses) {
      const u = this.byId('users', userId); u.courses = courses; save();
      putUser(await send('POST', `api/admin/users/${userId}/courses`, { courses }));
    },
    async removeUser(userId) {
      const u = this.byId('users', userId);
      const r = await send('DELETE', `api/admin/users/${userId}`);
      if (!r) return false;
      db.users = db.users.filter(x => x.id !== userId);
      db.purchases = db.purchases.filter(p => p.user !== userId);
      this.log('action', `удалил пользователя «${u.name}»`);
      save(); return true;
    },
    // Возвращает демо-данные на сервере для всех; после этого перечитываем страницу
    async resetDemo() {
      if (await send('POST', 'api/admin/reset-demo')) setTimeout(() => location.reload(), 900);
    }
  };
  window.AdminStore = store;
})();
