/* Экономика: уровни и начисление очков за задание.
   Очки = базовый балл + бонус за чистоту кода + бонус за скорость.
   - Базовый балл: доля пройденных проверок результата × очки задания.
   - Чистота кода: до 40% очков задания, пропорционально пройденным проверкам качества
     (семантика, доступность, контраст, чистота CSS, линтер).
   - Скорость: до 30% очков задания, если уложились в норму времени; дальше убывает до нуля к двойной норме.
   Бонусы начисляются, только если все проверки результата пройдены.
   Опыт (XP) и души начисляются одинаково, бустеры умножают их по отдельности. */
(() => {
  const LEVELS = [
    { title: 'Новичок', xp: 0 },
    { title: 'Джун', xp: 1000 },
    { title: 'Мидл', xp: 3000 },
    { title: 'Сеньор', xp: 6000 }
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

  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  window.Economy = { LEVELS, CLEAN_SHARE, SPEED_SHARE, level, score, applyBoosters, clock };
})();
