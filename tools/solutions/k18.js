/* Занятие 18: эталонные решения */
(() => {
  const { IMG } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1801: t => ({
      html: `<header class="header">
  <p class="logo">Библиотека колледжа</p>
  <nav class="nav">
    <a href="#catalog">Каталог</a>
    <a href="#rules">Правила</a>
    <a href="#contacts">Контакты</a>
  </nav>
</header>
<main class="main">
  <article class="article">
    <h1>Как записаться в библиотеку</h1>
    <p>Возьмите студенческий билет и подойдите на абонемент. Читательский билет выдадут сразу.</p>
  </article>
  <aside class="aside">
    <h2>Часы работы</h2>
    <p>Пн–Пт, 9:00–18:00</p>
  </aside>
</main>
<footer class="footer">
  <p>© 2026 Библиотека колледжа</p>
</footer>`,
      css: t.css
    }),
    k1802: t => ({
      html: `<article data-category="events">
  <h2>День открытых дверей</h2>
  <p><time datetime="2026-10-15">15 октября 2026 года</time></p>
  <p>Приглашаем школьников и родителей. Начало в 11:00, <mark>вход свободный</mark>.</p>
  <figure>
    <img src="${IMG}" alt="Мастерская колледжа: столы и станки">
    <figcaption>Так выглядела мастерская в прошлом году</figcaption>
  </figure>
</article>`,
      css: t.css
    }),
    k1803: t => ({
      html: `<h1>Пробная тренировка</h1>
<form class="form" action="#" method="post">
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" required>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" required>
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel">
  <label for="date">Дата тренировки</label>
  <input id="date" name="date" type="date" min="2026-11-01">
  <label for="guests">Сколько человек придёт</label>
  <input id="guests" name="guests" type="number" min="1" max="5">
  <button type="submit">Записаться</button>
</form>`,
      css: t.css
    })
  });
})();
