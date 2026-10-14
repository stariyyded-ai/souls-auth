/* Занятие 36: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3601: () => ({
      html: `<h1>Персона: для кого делаем сайт библиотеки</h1>
<article class="persona">
  <img src="img/icon.svg" alt="Условный портрет Марины" width="64" height="64">
  <h2>Марина, 17 лет</h2>
  <p class="role">Студентка первого курса, живёт за городом, в колледж ездит на электричке</p>
  <h3>Цели</h3>
  <ul>
    <li>Узнать, есть ли нужный учебник, не заходя в библиотеку.</li>
    <li>Продлить книгу, если не успевает её вернуть.</li>
  </ul>
  <h3>Что мешает</h3>
  <ul>
    <li>Каталог есть только на бумаге, в читальном зале.</li>
    <li>Библиотека закрыта, когда Марина уезжает домой.</li>
  </ul>
  <blockquote>«Пока выяснишь, есть ли учебник, перемена уже закончилась».</blockquote>
</article>`,
      css: `${BASE}
.persona {
  box-sizing: border-box;
  max-width: 480px;
  padding: 24px;
  border: 1px solid #c9c2e0;
  border-radius: 16px;
  background: #faf9fe;
}
.persona h2 { margin: 8px 0 0; }
.role { margin: 4px 0 16px; color: #555555; }
.persona h3 { margin: 16px 0 8px; color: #3b2a7a; }
.persona ul { margin: 0; padding-left: 20px; }
.persona blockquote { margin: 16px 0 0; padding-left: 16px; border-left: 4px solid #3b2a7a; font-style: italic; }`
    }),
    k3602: t => ({
      html: `<h1>Карта сайта библиотеки колледжа</h1>
<nav aria-label="Карта сайта">
  <ul>
    <li><a href="#">Главная</a>
      <ul>
        <li><a href="#">Каталог</a>
          <ul>
            <li><a href="#">Учебники</a></li>
            <li><a href="#">Художественная литература</a></li>
            <li><a href="#">Периодика</a></li>
          </ul>
        </li>
        <li><a href="#">Электронная библиотека</a></li>
        <li><a href="#">Услуги</a>
          <ul>
            <li><a href="#">Продление книг</a></li>
            <li><a href="#">Заказ книги</a></li>
          </ul>
        </li>
        <li><a href="#">О библиотеке</a>
          <ul>
            <li><a href="#">Правила</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</nav>`,
      css: t.css
    }),
    k3603: () => ({
      html: `<h1>Онлайн-запись к врачу: путь пользователя</h1>
<ol class="flow">
  <li><strong>Главная</strong><p>Нажимает «Записаться к врачу»</p></li>
  <li><strong>Выбор врача</strong><p>Выбирает терапевта из списка</p></li>
  <li><strong>Дата и время</strong><p>Выбирает свободное время в четверг</p></li>
  <li><strong>Ваши данные</strong><p>Вводит имя, телефон и номер полиса</p></li>
  <li><strong>Проверка заявки</strong><p>Сверяет врача и время, нажимает «Подтвердить»</p></li>
  <li><strong>Подтверждение</strong><p>Видит номер талона и кнопку «Добавить в календарь»</p></li>
</ol>`,
      css: `${BASE}
.flow {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.flow li {
  position: relative;
  width: 140px;
  padding: 12px;
  border: 1px solid #c9c2e0;
  border-radius: 12px;
  background: #faf9fe;
}
.flow p { margin: 8px 0 0; font-size: 14px; }
.flow li:not(:last-child)::after {
  content: "→";
  position: absolute;
  right: -20px;
  top: 40%;
  color: #3b2a7a;
}`
    })
  });
})();
