/* Состояние студента: опыт, души, покупки, надетые предметы, бустеры, результаты заданий и уроков.
   Живёт в localStorage этого браузера. Админка подхватывает его при загрузке (см. admin-store.js):
   опыт и души студента u24 и журнал покупок и наград.
   Нужны js/data.js (стартовые данные) и js/economy.js. */
(() => {
  const KEY = 'ash:student:v1';
  const D = window.STUDENT, E = window.Economy;
  const ADMIN_ID = 'u24';
  const now = () => new Date().toISOString();
  const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);

  function fresh() {
    const ach = {};
    D.achievements.forEach(a => { if (a.date) ach[a.id] = a.date; });
    return {
      v: 1, xp: D.xp, souls: D.souls, ach, history: [], tasks: {}, lessons: {},
      inv: {}, equipped: { title: null, avatar: 'knight', frame: null }, boosters: {}, hidden: false, journal: []
    };
  }
  let st;
  try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) { st = null; }
  if (!st || st.v !== 1) st = fresh();

  const listeners = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    listeners.forEach(fn => fn(st));
  }
  function journal(kind, text, amount) {
    st.journal.unshift({ id: uid('j'), kind, text, amount, date: now() });
    st.journal = st.journal.slice(0, 200);
  }
  const achDef = id => D.achievements.find(a => a.id === id);

  function unlock(id) {
    if (st.ach[id]) return null;
    const a = achDef(id); if (!a) return null;
    st.ach[id] = now();
    if (a.reward) { st.souls += a.reward; journal('transaction', `Награда за достижение «${a.title}»`, a.reward); }
    journal('action', `получил достижение «${a.title}»`);
    return a;
  }
  function checkAchievements() {
    const got = [];
    const solved = Object.values(st.tasks).filter(t => t.solved).length;
    const push = a => a && got.push(a);
    if (solved >= 1) push(unlock('first-task'));
    if (solved >= 5) push(unlock('five-tasks'));
    if (Object.values(st.tasks).some(t => t.cleanFull)) push(unlock('clean'));
    if (Object.values(st.tasks).some(t => t.speedFull)) push(unlock('speed'));
    if (Object.values(st.lessons).some(l => l.quizMax && l.quiz === l.quizMax)) push(unlock('scholar'));
    if (Object.keys(st.inv).length) push(unlock('shopper'));
    return got;
  }

  const S = {
    get state() { return st; },
    get name() { return (window.Ash && window.Ash.store.get('name')) || D.name; },
    adminId: ADMIN_ID,
    on(fn) { listeners.add(fn); },
    level() { return E.level(st.xp); },
    achievements() { return D.achievements.map(a => ({ ...a, date: st.ach[a.id] ? st.ach[a.id].slice(0, 10) : null })); },

    /* ---------- магазин ---------- */
    owned(item) { return !!st.inv[item.id]; },
    // Звания, аватары и рамки покупаются один раз; бустеры, бонусы и мерч — сколько угодно
    once: item => ['title', 'avatar', 'frame'].includes(item.type),
    buy(item) {
      if (this.once(item) && this.owned(item)) return { ok: false, msg: 'Уже куплено.' };
      if (st.souls < item.price) return { ok: false, msg: `Не хватает ${(item.price - st.souls).toLocaleString('ru-RU')} душ.` };
      st.souls -= item.price;
      st.inv[item.id] = (st.inv[item.id] || 0) + 1;
      if (item.type === 'booster') {
        const b = st.boosters[item.id] || { effect: item.effect, title: item.title, charges: 0 };
        b.charges += item.charges || 1; st.boosters[item.id] = b;
      }
      st.journal.unshift({ id: uid('j'), kind: 'purchase', item: item.id, price: item.price, text: 'Покупка: ' + item.title, amount: -item.price, date: now() });
      if (this.once(item)) this.equip(item, true);
      const got = checkAchievements();
      save();
      return { ok: true, got };
    },
    equip(item, silent) {
      const slot = item.type;
      if (slot === 'title') st.equipped.title = item.title.replace(/^Звание «|»$/g, '');
      if (slot === 'avatar') st.equipped.avatar = item.art;
      if (slot === 'frame') st.equipped.frame = item.art;
      if (!silent) save();
    },
    unequip(slot) {
      st.equipped[slot] = slot === 'avatar' ? 'knight' : null; save();
    },
    isEquipped(item) {
      const e = st.equipped;
      return (item.type === 'title' && e.title === item.title.replace(/^Звание «|»$/g, '')) ||
        (item.type === 'avatar' && e.avatar === item.art) || (item.type === 'frame' && e.frame === item.art);
    },
    activeBoosters() { return Object.entries(st.boosters).filter(([, b]) => b.charges > 0).map(([id, b]) => ({ id, ...b })); },

    /* ---------- таблица лидеров ---------- */
    setHidden(v) { st.hidden = !!v; journal('action', v ? 'скрыл себя из таблицы лидеров' : 'вернулся в таблицу лидеров'); save(); },

    /* ---------- задания ---------- */
    // Сохраняем черновик кода, чтобы не потерять при перезагрузке
    saveDraft(taskId, code) { const t = st.tasks[taskId] || (st.tasks[taskId] = { best: 0, attempts: 0 }); t.code = code; save(); },
    taskState(taskId) { return st.tasks[taskId] || null; },
    // Таймер для бонуса за скорость идёт с первого открытия задания (или с «Начать заново»)
    startTask(taskId) { const t = st.tasks[taskId] || (st.tasks[taskId] = { best: 0, attempts: 0 }); if (!t.startedAt) { t.startedAt = now(); save(); } return t.startedAt; },
    restartTask(taskId) { const t = st.tasks[taskId] || (st.tasks[taskId] = { best: 0, attempts: 0 }); t.startedAt = now(); delete t.code; save(); return t.startedAt; },
    // Начисляем только прирост к лучшему результату: перерешать ради очков бесполезно
    recordTask(task, sc, code, moduleTitle) {
      const t = st.tasks[task.id] || (st.tasks[task.id] = { best: 0, attempts: 0 });
      t.attempts++; t.code = code; t.last = sc.total; t.lastDate = now();
      const delta = Math.max(0, sc.total - t.best);
      let gains = { xp: 0, souls: 0 }, effects = [];
      if (delta > 0) {
        const boosters = sc.solved ? this.activeBoosters() : [];
        effects = boosters.map(b => b.effect);
        gains = E.applyBoosters(delta, effects);
        boosters.forEach(b => { st.boosters[b.id].charges--; });
        t.best = sc.total; t.bestDetail = { base: sc.base, clean: sc.clean, speed: sc.speed };
        st.xp += gains.xp; st.souls += gains.souls;
        journal('transaction', `Награда за задание «${task.title}»`, gains.souls);
      }
      if (sc.solved && !t.solved) { t.solved = true; t.solvedAt = now(); }
      if (sc.cleanFull) t.cleanFull = true;
      if (sc.solved && sc.speedFull) t.speedFull = true;
      st.history.unshift({
        date: now().slice(0, 10), task: task.title, module: moduleTitle || 'Задания', status: sc.solved ? 'accepted' : 'failed',
        xp: gains.xp, souls: gains.souls, auto: true
      });
      st.history = st.history.slice(0, 60);
      if (!sc.solved) journal('error', `Автопроверка «${task.title}»: пройдено ${sc.fOk} из ${sc.fAll} проверок результата`);
      const got = checkAchievements();
      save();
      return { delta, gains, effects, got };
    },

    /* ---------- уроки ---------- */
    lessonState(id) { return st.lessons[id] || null; },
    markRead(id) { const l = st.lessons[id] || (st.lessons[id] = {}); if (!l.read) { l.read = now(); save(); } },
    // За квиз: 20 XP и 20 душ за каждый новый правильный ответ сверх прошлого лучшего
    recordQuiz(id, title, correct, total) {
      const l = st.lessons[id] || (st.lessons[id] = {});
      const prev = l.quiz || 0, gain = Math.max(0, correct - prev) * 20;
      l.quiz = Math.max(prev, correct); l.quizMax = total;
      if (gain) { st.xp += gain; st.souls += gain; journal('transaction', `Квиз урока «${title}»`, gain); }
      const got = checkAchievements();
      save();
      return { gain, got };
    },

    reset() { st = fresh(); save(); }
  };
  window.Student = S;
})();
