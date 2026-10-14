/* Общие помощники для заданий курса (content/tasks/k*.js).
   Сборка (node tools/build-content.mjs) склеивает этот файл и все задания в js/tasks-course.js. */
window.COURSE_TASKS = window.COURSE_TASKS || [];
window.COURSE_KIT = {
  // '#f2d58a' → 'rgb(242, 213, 138)': так браузер отдаёт цвет в getComputedStyle
  rgb: hex => { const n = parseInt(hex.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; },
  near: (a, b, d = 1.5) => Math.abs(a - b) <= d,
  // Светлая страница по умолчанию: так выглядит обычный сайт, с которого начинают первокурсники
  BASE: 'body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }',
  IMG: 'img/art.svg',
  ICON: 'img/icon.svg'
};
