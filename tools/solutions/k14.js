/* Занятие 14: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1401: t => ({
      html: t.html,
      css: `${BASE}
:root {
  --color-main: #1f4e79;
  --color-accent: #b3541e;
}
.header { border-bottom: 4px solid var(--color-main); margin-bottom: 16px; }
.header__title { color: var(--color-main); }
h2 { color: var(--color-main); }
a { color: var(--color-main); }
.note { border-left: 4px solid var(--color-accent); padding-left: 12px; }
.button { background-color: var(--color-accent); color: #ffffff; border: 0; padding: 10px 20px; font-size: 16px; }
.footer { border-top: 1px solid var(--color-main); margin-top: 24px; color: #555555; }`
    }),
    k1402: t => ({
      html: `<h1>Кружки колледжа</h1>
<div class="card">
  <h2 class="card__title">Робототехника</h2>
  <p class="card__text">Собираем роботов из конструктора. Вторник, 16:00.</p>
</div>
<div class="card">
  <h2 class="card__title">Веб-дизайн</h2>
  <p class="card__text">Рисуем макеты сайтов в Figma. Среда, 15:30.</p>
</div>
<div class="card card--accent">
  <h2 class="card__title">Шахматы</h2>
  <p class="card__text">Новый набор! Турнир каждую пятницу в 17:00.</p>
</div>`,
      css: `* { box-sizing: border-box; }
${BASE}
.card {
  width: 320px;
  padding: 16px;
  border: 1px solid #c9d3df;
  margin-bottom: 16px;
  background-color: #f5f8fb;
}
.card__title {
  margin-top: 0;
  font-size: 20px;
  color: #1f4e79;
}
.card--accent {
  border-color: #b3541e;
  border-width: 2px;
  background-color: #fff4ec;
}`
    }),
    k1403: t => ({
      html: t.html,
      css: `${t.css}
.menu__list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.menu__item {
  display: inline-block;
  margin-right: 16px;
}
.menu__link {
  color: var(--color-main);
  text-decoration: none;
  font-weight: bold;
}
.menu__link:hover { text-decoration: underline; }
.button {
  background-color: var(--color-main);
  color: #ffffff;
  border: 0;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}
.button:hover { background-color: var(--color-main-dark); }
a:focus-visible,
.button:focus-visible { outline: 3px solid var(--color-focus); }`
    })
  });
})();
