/* Занятие 35: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3501: t => ({
      html: `<h1>Файлы сайта кофейни «Зерно»</h1>
<ul class="tree">
  <li><code>cafe-site/</code>
    <ul>
      <li><code>index.html</code></li>
      <li><code>menu.html</code></li>
      <li><code>contacts.html</code></li>
      <li><code>css/</code>
        <ul>
          <li><code>style.css</code></li>
        </ul>
      </li>
      <li><code>js/</code>
        <ul>
          <li><code>script.js</code></li>
        </ul>
      </li>
      <li><code>img/</code>
        <ul>
          <li><code>logo.svg</code></li>
          <li><code>hero.jpg</code></li>
          <li><code>icons/</code>
            <ul>
              <li><code>cart.svg</code></li>
            </ul>
          </li>
        </ul>
      </li>
      <li><code>fonts/</code>
        <ul>
          <li><code>roboto.woff2</code></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>`,
      css: t.css
    }),
    k3502: t => ({
      html: `<h1>Переименование файлов</h1>
<table>
  <thead>
    <tr><th scope="col">Было</th><th scope="col">Стало</th></tr>
  </thead>
  <tbody>
    <tr><td>Главная Страница.HTML</td><td><code>index.html</code></td></tr>
    <tr><td>Style.CSS</td><td><code>style.css</code></td></tr>
    <tr><td>мой скрипт.js</td><td><code>script.js</code></td></tr>
    <tr><td>Фото_кафе (1).JPG</td><td><code>cafe-photo-1.jpg</code></td></tr>
    <tr><td>Логотип Зерно.svg</td><td><code>logo-zerno.svg</code></td></tr>
    <tr><td>Баннер Весна 2025.PNG</td><td><code>banner-spring-2025.png</code></td></tr>
  </tbody>
</table>`,
      css: t.css
    }),
    k3503: () => ({
      html: `<h1>Графика для сайта кофейни</h1>
<div class="kinds">
  <section>
    <h2>Растровая графика</h2>
    <ul>
      <li>Фотография капучино — <code>webp</code></li>
      <li>Фото зала кофейни — <code>jpg</code></li>
      <li>Скриншот приложения — <code>png</code></li>
      <li>Фоновая фотография зёрен — <code>webp</code></li>
    </ul>
  </section>
  <section>
    <h2>Векторная графика</h2>
    <ul>
      <li>Логотип кофейни — <code>svg</code></li>
      <li>Иконка корзины — <code>svg</code></li>
      <li>Стрелка «наверх» — <code>svg</code></li>
    </ul>
  </section>
</div>`,
      css: `${BASE}
.kinds {
  display: grid;
  gap: 24px;
}
.kinds section {
  padding: 16px;
  border: 1px solid #c9c2e0;
  border-radius: 12px;
}
.kinds h2 { margin-top: 0; color: #3b2a7a; }

@media (min-width: 768px) {
  .kinds { grid-template-columns: 1fr 1fr; }
}`
    })
  });
})();
