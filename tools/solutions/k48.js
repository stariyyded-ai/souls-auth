/* Занятие 48: эталонные решения */
(() => {
  const { IMG, ICON } = window.COURSE_KIT;
  const MARK = '/* Ниже — ';
  // решение = шаблон CSS до комментария «Ниже — …» + стили студента
  const keep = css => css.slice(0, css.indexOf(MARK));
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4801: t => ({
      html: `<div class="page">
  <header class="header">
    <p class="logo">Читальный зал</p>
    <nav class="nav" aria-label="Главное меню">
      <ul>
        <li><a href="#catalog">Каталог</a></li>
        <li><a href="#booking">Бронирование</a></li>
        <li><a href="#contacts">Контакты</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero">
    <h1>Книги и тихие места — в два клика</h1>
    <p>Найдите учебник в каталоге библиотеки колледжа и заберите его на перемене. Или забронируйте место в читальном зале перед зачётом.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#catalog">Найти книгу</a>
      <a class="btn btn-secondary" href="#booking">Забронировать место</a>
    </div>
  </section>
</div>`,
      css: keep(t.css) + `.header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-primary); }
.logo { margin: 0; color: var(--color-on-primary); font-weight: bold; font-size: 20px; }
.nav ul { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.nav a { color: var(--color-on-primary); }
.hero { padding: var(--space-4) var(--space-3); background: var(--color-surface); }
.hero h1 { margin: 0 0 var(--space-2); font-size: 40px; }
.hero p { max-width: 60ch; margin: 0 0 var(--space-3); font-size: 18px; line-height: 1.6; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
`
    }),
    k4802: t => ({
      html: `<div class="page">
  <section class="features">
    <h2>Почему у нас удобно</h2>
    <div class="features-list">
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Тихие места</h3>
        <p>40 мест в читальном зале, у каждого стола лампа и розетка.</p>
      </article>
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Электронный каталог</h3>
        <p>Поиск по названию и автору, видно, есть ли книга на полке.</p>
      </article>
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Бронь онлайн</h3>
        <p>Забронируйте книгу с телефона и заберите её на перемене.</p>
      </article>
    </div>
  </section>
</div>`,
      css: keep(t.css).replace('.page h2 {', '.page h2, .page h3 {') + `.features-list { display: grid; gap: var(--space-3); }
.feature { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }
.feature img { width: 32px; height: 32px; }
.feature h3 { margin: var(--space-1) 0; font-size: 22px; }
.feature p { margin: 0; line-height: 1.5; }
@media (min-width: 768px) {
  .features-list { grid-template-columns: repeat(3, 1fr); }
}
`
    }),
    k4803: t => ({
      html: `<div class="page">
  <section class="new-books">
    <h2>Новые поступления</h2>
    <ul class="cards">
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Основы веб-дизайна»">
        <h3>Основы веб-дизайна</h3>
        <p class="author">Е. Смирнова</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Пикник на обочине»">
        <h3>Пикник на обочине</h3>
        <p class="author">А. и Б. Стругацкие</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Собака Баскервилей»">
        <h3>Собака Баскервилей</h3>
        <p class="author">А. Конан Дойл</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
    </ul>
  </section>
  <footer class="footer">
    <p>Библиотека колледжа, корпус 1, кабинет 105</p>
    <p>Телефон: <a href="tel:+78001234567">8 800 123-45-67</a></p>
    <p>Почта: <a href="mailto:library@college.ru">library@college.ru</a></p>
  </footer>
</div>`,
      css: keep(t.css) + `.cards { display: grid; gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.card { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-1); padding: var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.card img { display: block; width: 100%; height: auto; border-radius: var(--radius); }
.card h3 { margin: var(--space-1) 0 0; }
.author { margin: 0; color: var(--color-muted); }
.badge { padding: 2px var(--space-1); border-radius: var(--radius); background: var(--color-accent); color: var(--color-text); font-size: 14px; }
.footer { margin-top: var(--space-4); padding: var(--space-3); background: var(--color-text); color: var(--color-on-primary); }
.footer a { color: var(--color-on-primary); }
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
`
    })
  });
})();
