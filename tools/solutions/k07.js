/* Занятие 7: эталонные решения.
   Задания 2 и 3 продолжают страницу: в их шаблоне уже есть результат прошлого шага,
   эталон дописывает новую часть вместо комментария-подсказки. */
(() => {
  const fill = (t, part) => t.html.replace(/<!--[\s\S]*?-->\s*$/, part);
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0701: t => ({
      html: `<h1>Анна Смирнова</h1>
<img src="img/course/k07-avatar.svg" alt="Анна Смирнова, студентка колледжа" width="160" height="160">
<p>Студентка группы ИСП-11, будущий веб-разработчик</p>

<h2>Обо мне</h2>
<p>Учусь в колледже на первом курсе. Люблю рисовать и придумывать, как сделать сайты <strong>удобнее</strong> для людей.</p>
<p>По вечерам играю в волейбол в секции колледжа, а по выходным помогаю в кофейне рядом с домом.</p>`,
      css: t.css
    }),
    k0702: t => ({
      html: fill(t, `<h2>Навыки</h2>
<ul>
  <li>Пишу разметку на HTML</li>
  <li>Рисую эскизы от руки</li>
  <li>Работаю в команде</li>
  <li>Программы:
    <ul>
      <li>VS Code</li>
      <li>Figma</li>
    </ul>
  </li>
</ul>

<h2>Моё расписание</h2>
<table>
  <caption>Моя неделя</caption>
  <thead>
    <tr>
      <th scope="col">День</th>
      <th scope="col">Учёба</th>
      <th scope="col">После пар</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Понедельник</th>
      <td>4 пары</td>
      <td>Волейбол, 17:00</td>
    </tr>
    <tr>
      <th scope="row">Среда</th>
      <td>3 пары</td>
      <td>Кружок «Веб с нуля», 16:00</td>
    </tr>
    <tr>
      <th scope="row">Суббота</th>
      <td colspan="2">Работа в кофейне</td>
    </tr>
  </tbody>
</table>`),
      css: t.css
    }),
    k0703: t => ({
      html: fill(t, `<h2>Контакты</h2>
<ul>
  <li>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></li>
  <li>Телефон: <a href="tel:+79000000000">+7 900 000-00-00</a></li>
  <li><a href="https://github.com/" target="_blank" rel="noopener">Мои работы на GitHub</a></li>
</ul>
<hr>
<p>&copy; 2026 Анна Смирнова</p>`),
      css: t.css
    })
  });
})();
