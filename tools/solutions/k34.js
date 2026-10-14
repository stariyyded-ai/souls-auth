/* Занятие 34: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3401: t => ({
      html: `<h1>Как студия делает сайт</h1>
<ol class="stages">
  <li><strong>Бриф и анализ</strong> — расспрашиваем заказчика, изучаем аудиторию и конкурентов.</li>
  <li><strong>Техническое задание</strong> — записываем все требования к сайту в один документ.</li>
  <li><strong>Прототип</strong> — рисуем схемы страниц серыми блоками.</li>
  <li><strong>Дизайн</strong> — рисуем макеты в цвете и собираем стайлгайд.</li>
  <li><strong>Вёрстка</strong> — переводим макет в HTML и CSS.</li>
  <li><strong>Программирование</strong> — добавляем JavaScript, формы, связь с сервером.</li>
  <li><strong>Тестирование</strong> — проверяем сайт в разных браузерах и на телефонах.</li>
  <li><strong>Запуск</strong> — переносим сайт на хостинг и подключаем домен.</li>
  <li><strong>Поддержка</strong> — обновляем тексты, делаем резервные копии, чиним ошибки.</li>
</ol>`,
      css: t.css
    }),
    k3402: () => ({
      html: `<h1>Над сайтом работает команда</h1>
<table>
  <caption>Кто отвечает за каждый этап</caption>
  <thead>
    <tr><th scope="col">Этап</th><th scope="col">Кто отвечает</th><th scope="col">Результат</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Бриф и анализ</th><td>Менеджер проекта, дизайнер</td><td>Заполненный бриф, список конкурентов</td></tr>
    <tr><th scope="row">Техническое задание</th><td>Менеджер, аналитик</td><td>Документ ТЗ, подписанный заказчиком</td></tr>
    <tr><th scope="row">Прототип</th><td>UX-дизайнер</td><td>Схемы страниц серыми блоками</td></tr>
    <tr><th scope="row">Дизайн</th><td>UI-дизайнер</td><td>Макеты всех экранов и стайлгайд</td></tr>
    <tr><th scope="row">Вёрстка</th><td>Верстальщик</td><td>HTML- и CSS-файлы страниц</td></tr>
    <tr><th scope="row">Тестирование</th><td>Тестировщик</td><td>Список найденных ошибок</td></tr>
    <tr><th scope="row">Запуск</th><td>Разработчик</td><td>Сайт работает по своему адресу</td></tr>
  </tbody>
</table>`,
      css: `${BASE}
table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px 12px; border: 1px solid #b9b9c9; text-align: left; vertical-align: top; }
thead th { background: #ece8f8; }`
    }),
    k3403: t => ({
      html: `<h1>Бриф: сайт кофейни «Зерно»</h1>
<nav>
  <ul>
    <li><a href="#goal">Цель сайта</a></li>
    <li><a href="#audience">Целевая аудитория</a></li>
    <li><a href="#rivals">Конкуренты</a></li>
    <li><a href="#structure">Структура</a></li>
    <li><a href="#design">Требования к дизайну</a></li>
    <li><a href="#adaptive">Адаптивность</a></li>
    <li><a href="#content">Контент</a></li>
  </ul>
</nav>
<section id="goal">
  <h2>Цель сайта</h2>
  <p>Студент заказывает кофе навынос за минуту и забирает его на перемене без очереди.</p>
</section>
<section id="audience">
  <h2>Целевая аудитория</h2>
  <ul>
    <li>Студенты колледжа 16–20 лет, заказывают с телефона между парами.</li>
    <li>Преподаватели, заказывают с компьютера в учительской.</li>
  </ul>
</section>
<section id="rivals">
  <h2>Конкуренты</h2>
  <ul>
    <li>Сетевая кофейня у метро: удобный заказ в приложении, но далеко.</li>
    <li>Столовая колледжа: дёшево, но нет предзаказа.</li>
  </ul>
</section>
<section id="structure">
  <h2>Структура</h2>
  <ol>
    <li>Главная</li>
    <li>Меню</li>
    <li>Корзина и оформление заказа</li>
    <li>О кофейне и контакты</li>
  </ol>
</section>
<section id="design">
  <h2>Требования к дизайну</h2>
  <ul>
    <li>Тёплая палитра: кофейный, сливочный, один яркий акцент для кнопок.</li>
    <li>Крупные кнопки «В корзину», удобные для пальца.</li>
    <li>Фотографии напитков, без стоковых людей.</li>
  </ul>
</section>
<section id="adaptive">
  <h2>Адаптивность</h2>
  <ul>
    <li>Телефон — 360px, главный вариант.</li>
    <li>Планшет — 768px.</li>
    <li>Компьютер — 1440px.</li>
  </ul>
</section>
<section id="content">
  <h2>Контент</h2>
  <p>Тексты и цены даёт заказчик до начала дизайна, фотографии напитков снимаем сами.</p>
</section>`,
      css: t.css
    })
  });
})();
