/* Состояние студента: опыт, души, покупки, надетые предметы, бустеры, результаты заданий и уроков.
   Главная копия — на сервере. Страница получает её в api/boot.js (window.BOOT).
   Каждое действие (покупка, проверка задания, квиз…) страница сразу применяет у себя по правилам
   js/student-logic.js, чтобы ответить без задержки, и отправляет на сервер (POST api/me/actions).
   Сервер применяет то же действие сам — со своими ценами, ответами и часами — и присылает итоговое состояние,
   которое заменяет посчитанное страницей. Так очки и души нельзя подправить из браузера.
   Нужны js/common.js, js/data.js (описания достижений), js/economy.js и js/student-logic.js. */
(() => {
  const D = window.STUDENT, E = window.Economy, L = window.StudentLogic, B = window.BOOT, Ash = window.Ash;
  const ME = B.me;

  // Имя и группа в кабинете и уроках — того, кто вошёл
  D.name = ME.name;
  const grp = B.db.groups.find(g => g.id === ME.group);
  D.group = grp
    ? { ...D.group, code: grp.code, title: grp.title, curator: grp.curator, members: B.db.users.filter(u => u.group === grp.id).length }
    : { ...D.group, code: '—', title: 'Без группы', curator: '—', members: 0 };

  let st = B.state && B.state.v === 1 ? B.state : L.fresh(ME);

  // Часы сервера: таймер задания считает от времени сервера, иначе при спешащих или отстающих часах компьютера
  // после перезагрузки страницы он показывал минус или лишние минуты
  const skew = B.now ? Date.parse(B.now) - Date.now() : 0;
  const now = () => Date.now() + skew;

  // Справочники для правил: на каждой странице есть то, что ей нужно (магазин, задания или уроки)
  const env = {
    now: () => new Date(now()).toISOString(),
    uid: p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
    achievements: D.achievements, Economy: E,
    shopItem: id => B.db.shop.find(s => s.id === id),
    sold: id => B.db.purchases.filter(p => p.item === id).length,
    task: id => (window.TASKS || []).find(t => t.id === id),
    lesson: id => (window.LESSONS || []).find(l => l.id === id && L.lessonAccess(l, grp, ME.role) === 'open'),
    moduleTitle: id => B.db.modules.find(m => m.id === id)?.title
  };

  /* ---------- отправка на сервер ---------- */
  const listeners = new Set();
  let queue = [], timer = null, sending = false, warned = false;
  // Заменяем содержимое, а не объект: страницы держат ссылку на St.state
  function replaceState(next) {
    Object.keys(st).forEach(k => delete st[k]);
    Object.assign(st, next);
    scene();
  }
  // Купленный и надетый фон сразу виден на странице
  // (у администратора фон свой, бесплатный, его не трогаем)
  const scene = () => { if (window.AshScene && ME.role !== 'admin') window.AshScene.set(st.equipped.theme || 'night'); };
  async function flush() {
    clearTimeout(timer); timer = null;
    if (sending || !queue.length) return;
    sending = true;
    const batch = queue.splice(0, 50);
    try {
      const r = await Ash.api('POST', 'api/me/actions', { actions: batch });
      // Сервер — главный: берём его состояние и заново применяем то, что ещё не успели отправить
      replaceState(r.state);
      queue.forEach(a => L.apply(st, a, env));
      if (r.results.some(x => x.ok === false)) Ash.notice('Сервер не принял действие: ' + r.results.find(x => x.ok === false).msg);
      warned = false;
      listeners.forEach(fn => fn(st));
    } catch (e) {
      if (e.status === 401) { location.replace('index.html'); return; }
      if (e.status >= 400 && e.status < 500) { Ash.notice('Сервер не принял действие: ' + e.message); setTimeout(() => location.reload(), 1500); return; }
      queue = batch.concat(queue);
      if (!warned) { Ash.notice('Не получилось сохранить прогресс: ' + e.message + ' Повторю через 5 секунд.'); warned = true; }
      timer = setTimeout(flush, 5000);
    } finally { sending = false; }
    if (queue.length && !timer) flush();
  }
  // Уходим со страницы с неотправленным — отправляем напоследок (keepalive переживает закрытие вкладки)
  addEventListener('pagehide', () => {
    if (!queue.length) return;
    try {
      fetch('api/me/actions', { method: 'POST', keepalive: true, credentials: 'same-origin',
        headers: { 'X-Ash': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ actions: queue }) });
      queue = [];
    } catch (e) {}
  });
  // Применить у себя и поставить в очередь на сервер
  function run(action) {
    const res = L.apply(st, action, env);
    if (res.ok !== false) {
      queue.push(action);
      if (!timer && !sending) timer = setTimeout(flush, 300);
      scene();
      listeners.forEach(fn => fn(st));
    }
    return res;
  }

  const S = {
    get state() { return st; },
    get name() { return ME.name; },
    // id в таблицах админки и лидеров
    adminId: ME.id,
    flush,
    on(fn) { listeners.add(fn); },
    level() { return E.level(st.xp); },
    achievements() { return D.achievements.map(a => ({ ...a, date: st.ach[a.id] ? st.ach[a.id].slice(0, 10) : null })); },

    /* ---------- магазин ---------- */
    owned(item) { return !!st.inv[item.id]; },
    // Звания, аватары и рамки покупаются один раз; бустеры, бонусы и мерч — сколько угодно
    once: L.once,
    buy(item) { return run({ type: 'buy', item: item.id }); },
    equip(item) { run({ type: 'equip', item: item.id }); },
    unequip(slot) { run({ type: 'unequip', slot }); },
    isEquipped(item) { return L.isEquipped(st, item); },
    activeBoosters() { return L.activeBoosters(st); },

    /* ---------- таблица лидеров ---------- */
    setHidden(v) { run({ type: 'hidden', value: !!v }); },
    // Вступительный ролик кабинета
    introSeen() { return !!st.introSeen; },
    markIntro() { if (!st.introSeen) run({ type: 'intro' }); },

    /* ---------- задания ---------- */
    // Черновик кода, чтобы не потерять при перезагрузке
    saveDraft(taskId, code) { run({ type: 'draft', task: taskId, code }); },
    taskState(taskId) { return st.tasks[taskId] || null; },
    now,
    startTask(taskId) { return run({ type: 'start', task: taskId }).startedAt; },
    restartTask(taskId) { return run({ type: 'restart', task: taskId }).startedAt; },
    // Сколько секунд студент реально работал над заданием (считает страница заданий)
    workTime(taskId, sec) { run({ type: 'time', task: taskId, sec: Math.round(sec) }); },
    // report — отчёт автопроверки; на сервер уходят только отметки «прошла / не прошла» по каждой проверке
    recordTask(task, report, code) {
      const flags = list => list.map(t => ({ ok: !!t.ok }));
      return run({ type: 'task', task: task.id, report: { func: flags(report.func), quality: flags(report.quality) }, code });
    },

    /* ---------- уроки ---------- */
    lessonState(id) { return st.lessons[id] || null; },
    markRead(id) { if (!st.lessons[id]?.read) run({ type: 'read', lesson: id }); },
    // answers — номера выбранных вариантов; правильность проверяет и сервер
    recordQuiz(id, answers) { return run({ type: 'quiz', lesson: id, answers }); }
  };
  window.Student = S;
})();
