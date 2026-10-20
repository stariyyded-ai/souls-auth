/* Экономика: уровни и начисление очков за задание.
   Очки = базовый балл + бонус за чистоту кода + бонус за скорость.
   - Базовый балл: доля пройденных проверок результата × очки задания.
   - Чистота кода: до 40% очков задания, пропорционально пройденным проверкам качества
     (семантика, доступность, контраст, чистота CSS, линтер).
   - Скорость: до 30% очков задания, если уложились в норму времени; дальше убывает до нуля к двойной норме.
   Бонусы начисляются, только если все проверки результата пройдены.
   Опыт (XP) и души начисляются одинаково, бустеры умножают их по отдельности.
   Пороги уровней рассчитаны на курс МДК.08.01: за занятие (квиз и задания) аккуратный студент
   получает примерно 600–800 XP, поэтому уровни открываются постепенно, последний — к концу курса:
   Ученик ≈ 3-е занятие, Стажёр ≈ 6-е, Джун ≈ 12-е, Мидл ≈ 21-е, Сеньор ≈ 35-е, Мастер ≈ 50-е. */
(() => {
  const LEVELS = [
    { title: 'Новичок', xp: 0 },
    { title: 'Ученик', xp: 1500 },
    { title: 'Стажёр', xp: 4000 },
    { title: 'Джун', xp: 8000 },
    { title: 'Мидл', xp: 15000 },
    { title: 'Сеньор', xp: 25000 },
    { title: 'Мастер', xp: 38000 }
  ];
  const CLEAN_SHARE = 0.4, SPEED_SHARE = 0.3;

  function level(xp) {
    let i = 0;
    LEVELS.forEach((l, k) => { if (xp >= l.xp) i = k; });
    const cur = LEVELS[i], next = LEVELS[i + 1] || null;
    return { index: i, title: cur.title, cur, next, have: xp - cur.xp, need: next ? next.xp - cur.xp : 0, left: next ? next.xp - xp : 0 };
  }

  // report: { func: [{ok}], quality: [{ok}] }, seconds — сколько решали, effects — действующие бустеры ['xp2', ...]
  function score(task, report, seconds, effects = []) {
    const pts = task.points;
    const f = report.func, q = report.quality;
    const fOk = f.filter(t => t.ok).length, qOk = q.filter(t => t.ok).length;
    const solved = f.length > 0 && fOk === f.length;
    const base = Math.round(pts * (f.length ? fOk / f.length : 0));
    const clean = solved ? Math.round(pts * CLEAN_SHARE * (q.length ? qOk / q.length : 1)) : 0;
    const target = task.minutes * 60;
    let speedK = 0;
    if (solved) {
      if (effects.includes('speed') || seconds <= target) speedK = 1;
      else if (seconds < target * 2) speedK = 1 - (seconds - target) / target;
    }
    const speed = Math.round(pts * SPEED_SHARE * speedK);
    const total = base + clean + speed;
    return {
      solved, base, clean, speed, total, seconds, target,
      max: Math.round(pts * (1 + CLEAN_SHARE + SPEED_SHARE)),
      cleanFull: solved && qOk === q.length, speedFull: speedK === 1,
      fOk, fAll: f.length, qOk, qAll: q.length
    };
  }

  // Множители бустеров к приросту очков
  function applyBoosters(points, effects) {
    return {
      xp: Math.round(points * (effects.includes('xp2') ? 2 : 1)),
      souls: Math.round(points * (effects.includes('souls15') ? 1.5 : 1))
    };
  }

  // Задания урока: новый формат — массив tasks, старый — одно поле task
  const lessonTasks = l => Array.isArray(l.tasks) && l.tasks.length ? l.tasks : l.task ? [l.task] : [];
  // Работа, которую сдают преподавателю (курс МДК.09.01): засчитана, когда преподаватель её принял с оценкой
  const workAccepted = (l, st) => !l.work || !!(st.works && st.works[l.id] && st.works[l.id].status === 'graded');
  // Урок пройден, когда он прочитан, квиз решён без ошибок, все задания урока сданы
  // и работа (если она есть) принята преподавателем (то же считает сервер для админки)
  function lessonDone(l, st) {
    const s = st.lessons[l.id];
    const quizOk = !(l.quiz && l.quiz.length) || (s && s.quizMax && s.quiz === s.quizMax);
    const taskOk = lessonTasks(l).every(id => st.tasks[id] && st.tasks[id].solved);
    return !!(s && s.read && quizOk && taskOk && workAccepted(l, st));
  }

  // Насколько урок пройден, от 0 до 1: прочитан, доля верных ответов квиза и каждое решённое задание — равные части.
  // Нужна для процентов: пока урок не пройден целиком, прогресс по нему всё равно виден
  function lessonProgress(l, st) {
    if (lessonDone(l, st)) return 1;
    const s = st.lessons[l.id] || {}, ts = lessonTasks(l), hasQuiz = !!(l.quiz && l.quiz.length);
    const parts = 1 + (hasQuiz ? 1 : 0) + ts.length + (l.work ? 1 : 0);
    const got = (s.read ? 1 : 0) + (hasQuiz && s.quizMax ? (s.quiz || 0) / s.quizMax : 0) + ts.filter(id => st.tasks[id] && st.tasks[id].solved).length
      + (l.work && workAccepted(l, st) ? 1 : 0);
    return Math.min(0.99, got / parts);
  }

  // Награда за принятую работу: до 200 XP и 200 душ, пропорционально баллам (оценка 2/1/0 по каждому критерию)
  const WORK_MAX = 200;
  const workReward = (score, max) => max ? Math.round(WORK_MAX * Math.max(0, Math.min(score, max)) / max) : 0;

  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  window.Economy = { LEVELS, CLEAN_SHARE, SPEED_SHARE, level, score, applyBoosters, lessonDone, lessonProgress, lessonTasks, workAccepted, workReward, clock };
})();
