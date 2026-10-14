/* Занятие 45: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4501: t => ({
      html: `<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <ol>
    <li><a href="#">Главная</a></li>
    <li><a href="#">Каталог</a></li>
    <li aria-current="page">Информатика</li>
  </ol>
</nav>

<h1>Информатика</h1>
<ul class="books">
  <li>Основы алгоритмизации и программирования</li>
  <li>Информационные технологии в профессии</li>
  <li>Компьютерные сети: учебник для колледжей</li>
</ul>

<nav class="pagination" aria-label="Страницы">
  <ul>
    <li><a href="#" aria-current="page">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">Вперёд</a></li>
  </ul>
</nav>`,
      css: `${BASE}
.books { margin-bottom: 24px; line-height: 1.6; }
.breadcrumbs ol, .pagination ul { display: flex; margin: 0; padding: 0; list-style: none; }
.breadcrumbs li + li::before { content: "/"; margin: 0 8px; color: #5a6475; }
.breadcrumbs a { color: #1f5fa8; }
.pagination ul { gap: 8px; }
.pagination a { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px; padding: 0 12px; box-sizing: border-box; border: 1px solid #1f5fa8; border-radius: 8px; color: #1f5fa8; text-decoration: none; }
.pagination a[aria-current="page"] { background: #1f5fa8; color: #ffffff; }`
    }),
    k4502: t => ({
      html: `<form class="form">
  <h2>Запись на пробную тренировку</h2>
  <div class="row">
    <label for="name">Имя</label>
    <input id="name" name="name" type="text">
  </div>
  <div class="row">
    <label for="phone">Телефон</label>
    <input id="phone" name="phone" type="tel" aria-describedby="phone-hint">
    <p id="phone-hint" class="hint">Например, +7 900 123-45-67</p>
  </div>
  <div class="row">
    <label for="email">Почта</label>
    <input id="email" name="email" type="email" value="ivan.mail.ru" aria-invalid="true" aria-describedby="email-error">
    <p id="email-error" class="error">Укажите почту в формате name@mail.ru</p>
  </div>
  <button type="submit">Записаться на тренировку</button>
</form>`,
      css: `${BASE}
.form { max-width: 480px; }
.row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.row label { font-weight: bold; }
.row input { padding: 10px; border: 1px solid #5a6475; border-radius: 6px; font-size: 16px; }
.row input[aria-invalid="true"] { border-color: #c62828; }
.hint, .error { margin: 0; font-size: 14px; }
.hint { color: #5a6475; }
.error { color: #c62828; }
button { padding: 12px 20px; border: 0; border-radius: 8px; background: #1f5fa8; color: #ffffff; font-size: 16px; }`
    }),
    k4503: t => ({
      html: t.html,
      css: t.css,
      js: `const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const status = document.querySelector('.status');
const total = 5;
let page = 1;

function render() {
  status.textContent = 'Страница ' + page + ' из ' + total;
  prev.disabled = page === 1;
  next.disabled = page === total;
}

next.addEventListener('click', () => {
  if (page < total) {
    page = page + 1;
    render();
  }
});

prev.addEventListener('click', () => {
  if (page > 1) {
    page = page - 1;
    render();
  }
});

render();
`
    })
  });
})();
