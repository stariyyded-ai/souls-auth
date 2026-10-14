/* Занятие 37: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3701: () => ({
      html: `<header>
  <p class="logo">Логотип</p>
  <nav>
    <a href="#about">О секции</a>
    <a href="#schedule">Расписание</a>
    <a href="#contacts">Контакты</a>
  </nav>
</header>
<main>
  <section class="hero">
    <h1>Шахматная секция колледжа</h1>
    <p>Короткий текст о том, зачем приходить: турниры, тренер, бесплатно.</p>
    <a class="button" href="#signup">Записаться</a>
  </section>
  <section class="features">
    <h2>Почему к нам</h2>
    <div class="features-list">
      <article>
        <h3>Преимущество 1</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
      <article>
        <h3>Преимущество 2</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
      <article>
        <h3>Преимущество 3</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
    </div>
  </section>
</main>
<footer>
  <p>Подвал: адрес, телефон, ссылки</p>
</footer>`,
      css: `${BASE}
/* Wireframe: только оттенки серого */
a { color: #222222; }
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #d9d9d9;
}
.logo { margin: 0; font-weight: bold; }
nav { display: flex; gap: 16px; }
.hero {
  margin-top: 24px;
  padding: 48px 24px;
  background: #eeeeee;
}
.hero h1 { margin-top: 0; }
.button {
  display: inline-block;
  padding: 12px 24px;
  background: #555555;
  color: #ffffff;
  text-decoration: none;
}
.features-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.features article { padding: 16px; background: #d9d9d9; }
.features h3 { margin-top: 0; }
footer {
  margin-top: 24px;
  padding: 16px 24px;
  background: #d9d9d9;
}`
    }),
    k3702: () => ({
      html: `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <aside class="block side">Боковая колонка</aside>
  <section class="block content">Основной текст</section>
  <footer class="block footer">Подвал</footer>
</div>`,
      css: `${BASE}
/* Сетка: 12 колонок, гаттер 24px, поля 24px */
.page {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 24px;
  row-gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .footer { grid-column: 1 / -1; }
.hero { min-height: 160px; }
.card { grid-column: span 4; min-height: 120px; }
.side { grid-column: span 3; }
.content { grid-column: span 9; min-height: 200px; }`
    }),
    k3703: t => ({
      html: t.html,
      css: `${BASE}
/* Телефон: 4 колонки, всё во всю ширину */
.page {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}
.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .card, .footer { grid-column: 1 / -1; }
.hero { min-height: 160px; padding: 32px; }
.card { min-height: 120px; }
.footer { margin-top: 8px; }

/* С 768px: 12 колонок, карточки по 4 */
@media (min-width: 768px) {
  .page { grid-template-columns: repeat(12, 1fr); gap: 24px; padding: 0 24px; }
  .card { grid-column: span 4; }
}`
    })
  });
})();
