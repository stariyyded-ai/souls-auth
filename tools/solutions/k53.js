/* Занятие 53: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5301: t => ({
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<section>
  <h2>Экраны</h2>
  <div class="screens">
    <article class="screen" id="screen-home">
      <h3>Главная</h3>
      <p>Стартовый экран пациента.</p>
      <ul><li>Ближайшая запись</li><li>Кнопка «Записаться»</li><li>Меню</li></ul>
    </article>
    <article class="screen" id="screen-login">
      <h3>Вход</h3>
      <p>Пациент входит в личный кабинет.</p>
      <ul><li>Номер полиса и пароль</li><li>Кнопка «Войти»</li></ul>
    </article>
    <article class="screen" id="screen-doctors">
      <h3>Выбор врача</h3>
      <p>Пациент находит нужного специалиста.</p>
      <ul><li>Специальности</li><li>Список врачей</li><li>Поиск</li></ul>
    </article>
    <article class="screen" id="screen-time">
      <h3>Выбор времени</h3>
      <p>Пациент выбирает удобный слот.</p>
      <ul><li>Дни недели</li><li>Свободные слоты</li><li>Кнопка «Далее»</li></ul>
    </article>
    <article class="screen" id="screen-confirm">
      <h3>Подтверждение</h3>
      <p>Пациент проверяет данные записи.</p>
      <ul><li>Врач, дата и время</li><li>Кнопка «Записаться»</li></ul>
    </article>
    <article class="screen" id="screen-done">
      <h3>Запись создана</h3>
      <p>Подтверждение, что всё получилось.</p>
      <ul><li>Номер талона</li><li>Кнопка «В мои записи»</li></ul>
    </article>
    <article class="screen" id="screen-my">
      <h3>Мои записи</h3>
      <p>Все будущие визиты пациента.</p>
      <ul><li>Список записей</li><li>Кнопка «Отменить»</li></ul>
    </article>
  </div>
</section>`,
      css: `${BASE}
h1 { font-size: 26px; }
.screens { display: grid; grid-template-columns: 1fr; gap: 16px; }
.screen { padding: 12px 16px; border: 2px solid #1f5f8b; border-radius: 12px; }
.screen h3 { margin: 0 0 4px; }
.screen p { margin: 0; color: #57606a; }
.screen ul { margin: 8px 0 0; padding-left: 20px; }
@media (min-width: 768px) {
  .screens { grid-template-columns: repeat(3, 1fr); }
}`
    }),
    k5302: t => ({
      html: t.html.replace('<!-- Здесь раздел «Переходы» с таблицей -->', `<section>
  <h2>Переходы</h2>
  <table>
    <caption>Как пользователь переходит между экранами</caption>
    <thead>
      <tr><th scope="col">Откуда</th><th scope="col">Действие пользователя</th><th scope="col">Куда</th></tr>
    </thead>
    <tbody>
      <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Войти»</td><td><a href="#screen-login">Вход</a></td></tr>
      <tr><td><a href="#screen-login">Вход</a></td><td>Вводит полис и пароль</td><td><a href="#screen-home">Главная</a></td></tr>
      <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-doctors">Выбор врача</a></td></tr>
      <tr><td><a href="#screen-doctors">Выбор врача</a></td><td>Выбирает терапевта</td><td><a href="#screen-time">Выбор времени</a></td></tr>
      <tr><td><a href="#screen-time">Выбор времени</a></td><td>Выбирает слот, нажимает «Далее»</td><td><a href="#screen-confirm">Подтверждение</a></td></tr>
      <tr><td><a href="#screen-confirm">Подтверждение</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-done">Запись создана</a></td></tr>
      <tr><td><a href="#screen-done">Запись создана</a></td><td>Нажимает «В мои записи»</td><td><a href="#screen-my">Мои записи</a></td></tr>
      <tr><td><a href="#screen-home">Главная</a></td><td>Открывает меню «Мои записи»</td><td><a href="#screen-my">Мои записи</a></td></tr>
    </tbody>
  </table>
</section>`),
      css: `${t.css}
.screen:target { background-color: #fff3cd; border-color: #8a5a00; }
table { margin-top: 8px; border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px; border: 1px solid #8c959f; text-align: left; }
td a { color: #1f5f8b; }`
    }),
    k5303: t => ({
      html: `<h1>User flow: запись к терапевту</h1>
<ol class="flow">
  <li class="step">Главная: нажимает «Записаться»</li>
  <li class="step">Выбор врача: выбирает терапевта</li>
  <li class="step">Выбор времени: смотрит свободные слоты</li>
  <li class="step decision">Есть свободное время?
    <ul>
      <li>Да — выбирает слот и идёт дальше</li>
      <li>Нет — «Сообщить, когда появится», возврат на Главную</li>
    </ul>
  </li>
  <li class="step">Подтверждение: проверяет данные, нажимает «Записаться»</li>
  <li class="step">Запись создана: видит номер талона</li>
</ol>`,
      css: `${BASE}
h1 { font-size: 26px; }
.flow { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0; list-style: none; }
.step { padding: 12px; border: 2px solid #1f5f8b; border-radius: 12px; }
.step:not(:last-child)::after { content: " →"; font-weight: bold; color: #1f5f8b; }
.decision { border-style: dashed; background-color: #fff3cd; }
.decision ul { margin: 8px 0 0; padding-left: 20px; }
@media (min-width: 768px) {
  .flow { flex-direction: row; flex-wrap: wrap; }
  .step { flex: 1 1 180px; }
}`
    })
  });
})();
