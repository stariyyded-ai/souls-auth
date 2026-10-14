/* Занятие 26: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2601: t => ({
      html: `<!-- Страница 404 кофейни «Зерно».
     Всё содержимое — внутри main с классом not-found. -->
<main class="not-found">
  <p class="code">404</p>
  <h1>Страница не найдена</h1>
  <p>Возможно, страницу переименовали или в адресе опечатка.</p>
  <p><a href="index.html">Перейти на главную</a></p>
  <nav aria-label="Популярные разделы">
    <ul>
      <li><a href="menu.html">Меню и цены</a></li>
      <li><a href="contacts.html">Как нас найти</a></li>
    </ul>
  </nav>
</main>`,
      css: t.css
    }),
    k2602: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Кофейня «Зерно» у колледжа — меню и цены</title>
  <meta name="description" content="Кофе, выпечка и обеды для студентов в двух минутах от колледжа. Скидка 10% по студенческому, открыты с 8:00.">
</head>
<body>
  <h1>Кофейня «Зерно»</h1>
  <p>Кофе, выпечка и обеды в двух минутах от колледжа. Скидка 10% по студенческому билету.</p>
</body>
</html>`,
      css: t.css
    }),
    k2603: t => ({
      html: `<header class="site-header">
  <img src="img/icon.svg" alt="Кофейня «Зерно»" width="48" height="48">
  <nav aria-label="Главное меню">
    <ul class="menu">
      <li><a href="index.html">Главная</a></li>
      <li><a href="menu.html">Меню</a></li>
      <li><a href="contacts.html">Контакты</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Кофейня «Зерно»</h1>
  <img class="photo" src="img/art.svg" alt="Зал кофейни вечером" width="600" height="300">
  <p>Мы в двух минутах от колледжа. <a href="https://yandex.ru/maps">Посмотреть на карте</a></p>
</main>`,
      css: t.css
    })
  });
})();
