/* Занятие 40: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
  --wf-bg: #f5f5f5;
}`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4001: t => ({
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav>
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
</header>
<main class="main">
  <h1>Найдите книгу в библиотеке колледжа</h1>
  <form class="search">
    <label for="q">Книга или автор</label>
    <input id="q" type="search" name="q">
    <button type="submit">Найти</button>
  </form>
</main>
<footer class="footer">
  <p>Библиотека колледжа · корпус 1, этаж 2</p>
</footer>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.logo {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.login {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
}
.main {
  padding: 32px 0;
}
.search {
  display: flex;
  gap: 8px;
  align-items: center;
}
.footer {
  padding: 16px 24px;
  background-color: var(--wf-mid);
}`
    }),
    k4002: t => ({
      html: t.html.replace(/  <!-- Раздел 1[\s\S]*<\/main>/, `  <section class="new">
    <h2>Новые поступления</h2>
    <div class="cards">
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
    </div>
  </section>
  <section class="how">
    <h2>Как взять книгу</h2>
    <ol class="steps">
      <li>Найдите книгу в каталоге</li>
      <li>Забронируйте её</li>
      <li>Заберите у стойки выдачи</li>
    </ol>
  </section>
</main>`),
      css: t.css + `
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.card {
  padding: 16px;
  background-color: var(--wf-light);
}
.ph {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  background-color: var(--wf-mid);
  border: 2px dashed var(--wf-dark);
}
.steps {
  display: flex;
  gap: 16px;
}`
    }),
    k4003: t => ({
      html: `<header class="top">
  <div class="logo">ЛОГО</div>
  <nav class="menu">
    <a href="#catalog">Каталог</a>
    <a href="#events">Мероприятия</a>
    <a href="#rules">Правила</a>
  </nav>
</header>
<main class="content">
  <h1 class="title">Электронная библиотека колледжа</h1>
  <div class="banner">Баннер: книга недели</div>
  <h2>Подборки</h2>
  <div class="grid">
    <div class="item">Подборка 1</div>
    <div class="item">Подборка 2</div>
    <div class="item">Подборка 3</div>
  </div>
</main>
<footer class="bottom">Контакты библиотеки</footer>`,
      css: `${BASE}
${WF}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.menu {
  display: flex;
  gap: 16px;
}
.menu a {
  color: var(--wf-dark);
}
.title {
  margin: 24px 0;
  font-size: 32px;
}
.banner {
  height: 120px;
  padding: 8px;
  border: 2px dashed var(--wf-dark);
  background-color: var(--wf-bg);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.item {
  padding: 32px;
  background-color: var(--wf-mid);
}
.bottom {
  margin-top: 24px;
  padding: 16px;
  background-color: var(--wf-light);
}`
    })
  });
})();
