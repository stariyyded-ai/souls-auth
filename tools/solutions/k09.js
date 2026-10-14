/* Занятие 9: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0901: t => ({
      html: `<h1>Контакты</h1>
<p>Корпус 2: ул. Ленина, 15. Вход со двора, через арку у библиотеки.</p>
<iframe src="img/course/k09-map.svg" title="Схема проезда ко второму корпусу колледжа" width="600" height="300" loading="lazy"></iframe>
<p><a href="img/course/k09-map.svg" target="_blank" rel="noopener">Открыть схему проезда в новой вкладке</a></p>
`,
      css: t.css
    }),
    k0902: t => ({
      html: `<h1>Музыкальный кружок</h1>
<h2>Отчётный концерт</h2>
<iframe src="img/art.svg" title="Видео: отчётный концерт кружка" width="560" height="315" allow="fullscreen" loading="lazy"></iframe>
<p>Запись концерта 20 мая: гитара, вокал и школьный хор.</p>

<h2>Расписание репетиций</h2>
<iframe src="img/icon.svg" title="Виджет: расписание репетиций кружка" width="200" height="200" loading="lazy" sandbox></iframe>
<p>Виджет предоставлен сайтом городского дома культуры.</p>`,
      css: t.css
    }),
    k0903: t => ({
      html: `<h1>Кружок дизайна</h1>
<p>Нажмите на название работы, чтобы посмотреть её в окне ниже.</p>
<h2>Работы студентов</h2>
<ul>
  <li><a href="img/art.svg" target="preview">Пейзаж</a></li>
  <li><a href="img/icon.svg" target="preview">Иконка</a></li>
  <li><a href="img/course/k09-map.svg" target="preview">Схема проезда</a></li>
</ul>
<iframe src="img/art.svg" name="preview" title="Предпросмотр работы студента" width="600" height="300"></iframe>
`,
      css: t.css
    })
  });
})();
