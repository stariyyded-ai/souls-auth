/* Занятие 33: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3301: t => ({
      html: `<h1>Кем работает веб-дизайнер</h1>
<section class="specs">
  <article class="spec">
    <h2>UI-дизайнер</h2>
    <p>Рисует экраны: кнопки, поля, карточки, иконки. Следит, чтобы всё было единым по стилю.</p>
  </article>
  <article class="spec">
    <h2>UX-дизайнер</h2>
    <p>Продумывает путь человека по сайту: какие шаги, в каком порядке, где он может запутаться.</p>
  </article>
  <article class="spec">
    <h2>Продуктовый дизайнер</h2>
    <p>Отвечает за весь сервис целиком: и интерфейс, и пользу для людей, и цели бизнеса.</p>
  </article>
  <article class="spec">
    <h2>Графический веб-дизайнер</h2>
    <p>Делает баннеры, иллюстрации, обложки и графику для сайтов и соцсетей.</p>
  </article>
  <article class="spec">
    <h2>Моушн-дизайнер</h2>
    <p>Оживляет интерфейс: анимации кнопок, переходы между экранами, короткие ролики.</p>
  </article>
</section>`,
      css: `${BASE}
.specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}
.spec {
  padding: 16px;
  border: 1px solid #c9c9d6;
  border-radius: 12px;
  background: #f6f6fb;
}
.spec h2 { margin: 0 0 8px; font-size: 20px; color: #3b2a7a; }
.spec p { margin: 0; line-height: 1.5; }`
    }),
    k3302: () => ({
      html: `<header>
  <h1>Анна Смирнова</h1>
  <p class="role">Начинающий веб-дизайнер: сайты для кафе, библиотек и спортклубов</p>
</header>
<section class="works">
  <h2>Работы</h2>
  <div class="works-list">
    <figure>
      <img src="img/art.svg" alt="Главная страница сайта кофейни с фотографией зала">
      <figcaption>Сайт кофейни «Зерно»</figcaption>
    </figure>
    <figure>
      <img src="img/art.svg" alt="Каталог книг библиотеки колледжа с фильтром">
      <figcaption>Каталог библиотеки колледжа</figcaption>
    </figure>
    <figure>
      <img src="img/art.svg" alt="Экран записи на тренировку в спортзал">
      <figcaption>Запись в спортзал</figcaption>
    </figure>
  </div>
</section>
<footer>
  <p>Пишите: <a href="mailto:anna@example.ru">anna@example.ru</a></p>
</footer>`,
      css: `${BASE}
.role { color: #555555; }
.works-list {
  display: grid;
  gap: 24px;
}
figure { margin: 0; }
.works img { max-width: 100%; height: auto; border-radius: 8px; }
figcaption { margin-top: 8px; font-weight: bold; }
footer { margin-top: 32px; }

@media (min-width: 768px) {
  .works-list { grid-template-columns: repeat(3, 1fr); }
}`
    }),
    k3303: () => ({
      html: `<h1>Юзабилити по Якобу Нильсену</h1>
<dl>
  <dt>Обучаемость</dt>
  <dd>Насколько легко новичку сделать простое дело с первого раза.</dd>
  <dt>Эффективность</dt>
  <dd>Как быстро опытный пользователь выполняет задачу.</dd>
  <dt>Запоминаемость</dt>
  <dd>Легко ли вспомнить, как пользоваться сайтом, после перерыва.</dd>
  <dt>Ошибки</dt>
  <dd>Сколько ошибок делают люди, насколько они серьёзны и легко ли их исправить.</dd>
  <dt>Удовлетворённость</dt>
  <dd>Приятно ли пользоваться сайтом.</dd>
</dl>`,
      css: `${BASE}
dt { margin-top: 16px; font-weight: bold; color: #3b2a7a; }
dd { margin: 4px 0 0 24px; line-height: 1.5; }`
    })
  });
})();
