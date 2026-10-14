/* Занятие 8: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0801: t => ({
      html: `<h1 id="top">Анна Смирнова</h1>
<ul>
  <li><a href="#about">Обо мне</a></li>
  <li><a href="#skills">Навыки</a></li>
  <li><a href="#schedule">Расписание</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="about">Обо мне</h2>
<p>Учусь на первом курсе по специальности «Информационные системы». Люблю рисовать и разбираться, как устроены сайты.</p>
<p>По выходным работаю в кофейне у вокзала, поэтому умею объяснять сложное простыми словами.</p>
<p><a href="#top">Наверх</a></p>

<h2 id="skills">Навыки</h2>
<ul>
  <li>HTML: заголовки, списки, таблицы, ссылки</li>
  <li>Рисование от руки и в графическом планшете</li>
  <li>Работа с людьми и терпение</li>
</ul>
<p><a href="#top">Наверх</a></p>

<h2 id="schedule">Расписание</h2>
<table>
  <caption>Когда меня можно найти в колледже</caption>
  <tr><th scope="col">День</th><th scope="col">Время</th><th scope="col">Кабинет</th></tr>
  <tr><td>Понедельник</td><td>9:00–14:00</td><td>214</td></tr>
  <tr><td>Среда</td><td>11:00–16:00</td><td>305</td></tr>
  <tr><td>Пятница</td><td>9:00–12:30</td><td>214</td></tr>
</table>
<p><a href="#top">Наверх</a></p>

<h2 id="contacts">Контакты</h2>
<p>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></p>
<p>Телефон: <a href="tel:+79001234567">+7 900 123-45-67</a></p>
<p><a href="#top">Наверх</a></p>
`,
      css: t.css
    }),
    k0802: t => ({
      html: `<h1 id="top">Библиотека колледжа</h1>
<ul>
  <li><a href="#hours">Часы работы</a></li>
  <li><a href="#rules">Правила</a></li>
  <li><a href="#new-books">Новинки</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="hours">Часы работы</h2>
<p>Понедельник — пятница: с 9:00 до 18:00. Суббота: с 10:00 до 14:00.</p>

<h2 id="rules">Правила</h2>
<p>Книги выдаются на две недели по студенческому билету. Продлить срок можно один раз.</p>

<h2 id="new-books">Новинки</h2>
<p>В сентябре пришли учебники по веб-дизайну и вёрстке. Их можно читать и онлайн в <a href="https://elib.example.ru" target="_blank" rel="noopener">электронной библиотеке колледжа</a>.</p>

<h2 id="contacts">Контакты</h2>
<p>Корпус 1, кабинет 107. Почта: <a href="mailto:library@example.ru">library@example.ru</a></p>

<p><a href="#top">Наверх</a></p>`,
      css: t.css
    }),
    k0803: t => ({
      html: `<!-- Страница 404: заголовок, объяснение, картинка, ссылки на разделы, почта -->
<h1>Страница не найдена</h1>
<p>Ошибка 404: такой страницы на сайте нет. Возможно, в адресе опечатка или страницу переместили. Ничего страшного — вот куда можно перейти.</p>
<img src="img/art.svg" alt="" width="300" height="150">
<ul>
  <li><a href="index.html">Главная</a></li>
  <li><a href="schedule.html">Расписание занятий</a></li>
  <li><a href="contacts.html">Контакты колледжа</a></li>
</ul>
<p>Нашли сломанную ссылку? Напишите нам на <a href="mailto:site@example.ru">site@example.ru</a>, и мы её починим.</p>
`,
      css: t.css
    })
  });
})();
