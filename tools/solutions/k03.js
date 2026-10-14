/* Занятие 3: эталонные решения */
(() => {
  const MDN = 'https://developer.mozilla.org/ru/docs/Web/HTML';
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0301: t => ({
      html: `<!-- Это файл courses/web.html -->
<h1>Курс «Веб-разработка»</h1>
<p>Учимся делать сайты: HTML, CSS и немного JavaScript.</p>

<ul>
  <li><a href="../index.html">Главная</a></li>
  <li><a href="../about.html">О колледже</a></li>
  <li><a href="design.html">Курс «Дизайн интерфейсов»</a></li>
  <li><a href="${MDN}" target="_blank" rel="noopener">Справочник по HTML на MDN</a></li>
</ul>`,
      css: t.css
    }),
    k0302: t => ({
      html: `<h1>Справочник первокурсника</h1>
<ul>
  <li><a href="#bells">Звонки</a></li>
  <li><a href="#library">Библиотека</a></li>
  <li><a href="#canteen">Столовая</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="bells">Звонки</h2>
<p>Первая пара начинается в 8:30, перемены по 10 минут, большая перемена — 40 минут.</p>

<h2 id="library">Библиотека</h2>
<p>Второй этаж, кабинет 204. Читательский билет выдают по студенческому.</p>

<h2 id="canteen">Столовая</h2>
<p>Первый этаж. Комплексный обед с 12:00 до 15:00.</p>

<h2 id="contacts">Контакты</h2>
<p>Почта приёмной комиссии: <a href="mailto:priem@college.ru">priem@college.ru</a></p>
<p>Телефон: <a href="tel:+74951234567">+7 (495) 123-45-67</a></p>`,
      css: t.css
    }),
    k0303: t => ({
      html: `<h1>Новости колледжа</h1>
<p>Открыта запись в спортивные секции. <a href="sport.html">Запишитесь в спортивную секцию</a> до 15 сентября.</p>
<p>Опубликовано <a href="exams.html">расписание экзаменов зимней сессии</a>.</p>
<p>Для первокурсников есть <a href="${MDN}" target="_blank" rel="noopener">справочник по HTML на MDN</a>.</p>
<p>Вопросы присылайте на почту <a href="mailto:priem@college.ru">priem@college.ru</a>.</p>`,
      css: t.css
    })
  });
})();
