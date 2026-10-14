/* Правила экономики студента: покупки, бустеры, очки за задания и квизы, достижения.
   Один и тот же файл работает в браузере (чтобы страница отвечала сразу) и на сервере (server/student.js).
   Сервер применяет те же действия сам, со своими ценами, заданиями, ответами квизов и своими часами,
   и его результат заменяет то, что насчитала страница. Поэтому подправить себе души или опыт из браузера нельзя.

   apply(st, action, env) меняет состояние st и возвращает результат для страницы.
   env: now(), uid(p), achievements, Economy, shopItem(id), sold(id), task(id), lesson(id), moduleTitle(id) */
(() => {
  const ONCE = ['title', 'avatar', 'frame', 'theme'];
  const once = item => ONCE.includes(item.type);
  const titleOf = item => item.title.replace(/^Звание «|»$/g, '');
  const MAX_CODE = 100000;

  // Новое состояние: опыт, души и достижения — из карточки, которую ведёт администратор
  function fresh(me) {
    const ach = {};
    (me.achievements || []).forEach(a => { ach[a.id] = a.date; });
    return {
      v: 1, xp: me.xp || 0, souls: me.souls || 0, ach, history: [], tasks: {}, lessons: {},
      inv: {}, equipped: { title: null, avatar: 'knight', frame: null, theme: null }, boosters: {}, hidden: !!me.hidden, journal: []
    };
  }

  /* Доступ к уроку для студента группы.
     Преподаватель добавляет группе уроки (group.lessons) и разрешает их проходить (group.lessonsOpen):
     'open' — можно проходить, 'wait' — урок виден, но ждёт разрешения, 'hidden' — уроку группе не добавлен.
     У групп, которые ещё не настраивали в разделе «Уроки групп», действует старое правило: урок открыт,
     если в его описании не указаны группы или указана группа студента. Администратору открыто всё. */
  function lessonAccess(lesson, group, role) {
    if (role === 'admin') return 'open';
    if (!group || !Array.isArray(group.lessons)) {
      const only = lesson.groups || [];
      return !only.length || (group && only.includes(group.code)) ? 'open' : 'wait';
    }
    if (!group.lessons.includes(lesson.id)) return 'hidden';
    return (group.lessonsOpen || []).includes(lesson.id) ? 'open' : 'wait';
  }

  /* Уроки курса: встроенные (js/content.js) плюс правки администратора (коллекция lessons на сервере).
     Запись с id встроенного урока заменяет его, { id, removed: true } прячет, остальные — новые уроки.
     builtin — урок из курса, edited — изменён администратором, custom — создан администратором. */
  function mergeLessons(builtins, overrides) {
    const map = new Map(builtins.map(l => [l.id, { ...l, builtin: true }]));
    (overrides || []).forEach(o => {
      if (o.removed) { const b = map.get(o.id); if (b) b.removed = true; return; }
      const b = map.get(o.id);
      map.set(o.id, b ? { ...b, ...o, builtin: true, edited: true } : { groups: [], quiz: [], ...o, custom: true });
    });
    return [...map.values()].filter(l => !l.removed);
  }

  const activeBoosters = st => Object.entries(st.boosters).filter(([, b]) => b.charges > 0).map(([id, b]) => ({ id, ...b }));
  const isEquipped = (st, item) => {
    const e = st.equipped;
    return (item.type === 'title' && e.title === titleOf(item)) || (item.type === 'avatar' && e.avatar === item.art) || (item.type === 'frame' && e.frame === item.art)
      || (item.type === 'theme' && e.theme === item.art);
  };

  function apply(st, a, env) {
    const fail = msg => ({ ok: false, msg });
    const journal = (kind, text, amount) => {
      st.journal.unshift({ id: env.uid('j'), kind, text, amount, date: env.now() });
      st.journal = st.journal.slice(0, 200);
    };
    const unlock = id => {
      if (st.ach[id]) return null;
      const d = env.achievements.find(x => x.id === id); if (!d) return null;
      st.ach[id] = env.now();
      if (d.reward) { st.souls += d.reward; journal('transaction', `Награда за достижение «${d.title}»`, d.reward); }
      journal('action', `получил достижение «${d.title}»`);
      return d;
    };
    const checkAchievements = () => {
      const got = [], push = d => d && got.push(d);
      const solved = Object.values(st.tasks).filter(t => t.solved).length;
      if (solved >= 1) push(unlock('first-task'));
      if (solved >= 5) push(unlock('five-tasks'));
      if (Object.values(st.tasks).some(t => t.cleanFull)) push(unlock('clean'));
      if (Object.values(st.tasks).some(t => t.speedFull)) push(unlock('speed'));
      if (Object.values(st.lessons).some(l => l.quizMax && l.quiz === l.quizMax)) push(unlock('scholar'));
      if (Object.keys(st.inv).length) push(unlock('shopper'));
      return got;
    };
    const taskRec = id => st.tasks[id] || (st.tasks[id] = { best: 0, attempts: 0 });
    const str = v => typeof v === 'string' ? v : '';
    const code = c => (c && typeof c === 'object' && str(c.html).length <= MAX_CODE && str(c.css).length <= MAX_CODE && str(c.js).length <= MAX_CODE)
      ? { html: str(c.html), css: str(c.css), ...(c.js ? { js: str(c.js) } : {}) } : null;

    switch (a && a.type) {
      /* ---------- магазин ---------- */
      case 'buy': {
        const item = env.shopItem(a.item);
        if (!item || item.active === false) return fail('Этого товара нет в магазине.');
        if (once(item) && st.inv[item.id]) return fail('Уже куплено.');
        if (item.stock && env.sold(item.id) >= item.stock) return fail('Товар закончился.');
        if (st.souls < item.price) return fail(`Не хватает ${(item.price - st.souls).toLocaleString('ru-RU')} душ.`);
        st.souls -= item.price;
        st.inv[item.id] = (st.inv[item.id] || 0) + 1;
        if (item.type === 'booster') {
          const b = st.boosters[item.id] || { effect: item.effect, title: item.title, charges: 0 };
          b.charges += item.charges || 1; st.boosters[item.id] = b;
        }
        st.journal.unshift({ id: env.uid('j'), kind: 'purchase', item: item.id, price: item.price, text: 'Покупка: ' + item.title, amount: -item.price, date: env.now() });
        if (once(item)) wear(item);
        return { ok: true, got: checkAchievements() };
      }
      case 'equip': {
        const item = env.shopItem(a.item);
        if (!item || !once(item) || !st.inv[item.id]) return fail('Сначала купите этот предмет.');
        wear(item); return { ok: true };
      }
      case 'unequip': {
        if (!ONCE.includes(a.slot)) return fail('Нет такого места.');
        st.equipped[a.slot] = a.slot === 'avatar' ? 'knight' : null; return { ok: true };
      }

      /* ---------- таблица лидеров ---------- */
      case 'hidden':
        st.hidden = !!a.value;
        journal('action', a.value ? 'скрыл себя из таблицы лидеров' : 'вернулся в таблицу лидеров');
        return { ok: true };

      /* ---------- задания ---------- */
      case 'draft': {
        const c = code(a.code); if (!env.task(a.task) || !c) return fail('Черновик не сохранён.');
        taskRec(a.task).code = c; return { ok: true };
      }
      // Таймер для бонуса за скорость идёт с первого открытия задания (или с «Начать заново») по часам того, кто применяет
      case 'start': {
        if (!env.task(a.task)) return fail('Нет такого задания.');
        const t = taskRec(a.task); if (!t.startedAt) t.startedAt = env.now();
        return { ok: true, startedAt: t.startedAt };
      }
      case 'restart': {
        if (!env.task(a.task)) return fail('Нет такого задания.');
        const t = taskRec(a.task); t.startedAt = env.now(); delete t.code;
        return { ok: true, startedAt: t.startedAt };
      }
      // Начисляем только прирост к лучшему результату: перерешать ради очков бесполезно
      case 'task': {
        const task = env.task(a.task), c = code(a.code), rep = a.report;
        const flags = arr => Array.isArray(arr) && arr.every(x => x && typeof x.ok === 'boolean');
        if (!task || !c || !rep || !flags(rep.func) || !flags(rep.quality)) return fail('Отчёт проверки не принят.');
        if (rep.func.length !== task.tests.length || rep.quality.length > 30) return fail('Отчёт проверки не совпадает с заданием.');
        const t = taskRec(task.id);
        if (!t.startedAt) t.startedAt = env.now();
        const seconds = Math.max(0, (Date.parse(env.now()) - Date.parse(t.startedAt)) / 1000);
        const boosters = activeBoosters(st);
        const sc = env.Economy.score(task, rep, seconds, boosters.map(b => b.effect));
        t.attempts++; t.code = c; t.last = sc.total; t.lastDate = env.now();
        const delta = Math.max(0, sc.total - t.best);
        let gains = { xp: 0, souls: 0 }, effects = [];
        if (delta > 0) {
          const used = sc.solved ? boosters : [];
          effects = used.map(b => b.effect);
          gains = env.Economy.applyBoosters(delta, effects);
          used.forEach(b => { st.boosters[b.id].charges--; });
          t.best = sc.total; t.bestDetail = { base: sc.base, clean: sc.clean, speed: sc.speed };
          st.xp += gains.xp; st.souls += gains.souls;
          journal('transaction', `Награда за задание «${task.title}»`, gains.souls);
        }
        if (sc.solved && !t.solved) { t.solved = true; t.solvedAt = env.now(); }
        if (sc.cleanFull) t.cleanFull = true;
        if (sc.solved && sc.speedFull) t.speedFull = true;
        st.history.unshift({
          date: env.now().slice(0, 10), task: task.title, module: env.moduleTitle(task.module) || 'Задания', status: sc.solved ? 'accepted' : 'failed',
          xp: gains.xp, souls: gains.souls, auto: true
        });
        st.history = st.history.slice(0, 60);
        if (!sc.solved) journal('error', `Автопроверка «${task.title}»: пройдено ${sc.fOk} из ${sc.fAll} проверок результата`);
        return { ok: true, sc, delta, gains, effects, got: checkAchievements() };
      }

      /* ---------- уроки ---------- */
      case 'read': {
        if (!env.lesson(a.lesson)) return fail('Нет такого урока.');
        const l = st.lessons[a.lesson] || (st.lessons[a.lesson] = {});
        if (!l.read) l.read = env.now();
        return { ok: true };
      }
      // Квиз: ответы сверяет тот, кто применяет действие; 20 XP и 20 душ за каждый новый правильный ответ
      case 'quiz': {
        const lesson = env.lesson(a.lesson);
        if (!lesson || !lesson.quiz || !Array.isArray(a.answers) || a.answers.length !== lesson.quiz.length) return fail('Ответы не приняты.');
        const correct = lesson.quiz.filter((q, i) => a.answers[i] === q.answer).length, total = lesson.quiz.length;
        const l = st.lessons[lesson.id] || (st.lessons[lesson.id] = {});
        const prev = l.quiz || 0, gain = Math.max(0, correct - prev) * 20;
        l.quiz = Math.max(prev, correct); l.quizMax = total;
        if (gain) { st.xp += gain; st.souls += gain; journal('transaction', `Квиз урока «${lesson.title}»`, gain); }
        return { ok: true, correct, total, gain, got: checkAchievements() };
      }
    }
    return fail('Неизвестное действие.');

    function wear(item) {
      if (item.type === 'title') st.equipped.title = titleOf(item);
      if (item.type === 'avatar') st.equipped.avatar = item.art;
      if (item.type === 'frame') st.equipped.frame = item.art;
      if (item.type === 'theme') st.equipped.theme = item.art; // фон всех страниц: day или autumn (js/scene.js)
    }
  }

  window.StudentLogic = { fresh, apply, once, titleOf, activeBoosters, isEquipped, lessonAccess, mergeLessons };
})();
