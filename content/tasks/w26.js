/* Занятие 26. ЛР14. Bootstrap 5: сетка и компоненты */
(() => {
  const { rgb } = window.COURSE_KIT;
  const varOf = (h, el, name) => h.win.getComputedStyle(typeof el === 'string' ? h.$(el) : el).getPropertyValue(name).trim().toLowerCase();
  // Сайт заданий не подключает внешние файлы, поэтому в шаблоне — упрощённый кусочек bootstrap.min.css
  // с теми же классами и переменными --bs-*, что в настоящем Bootstrap 5.3.
  const BS = `/* ===== Фрагмент bootstrap.min.css 5.3 (упрощён для задания, не меняйте) ===== */
:root { --bs-primary: #0d6efd; --bs-primary-rgb: 13, 110, 253; --bs-body-font-family: system-ui, sans-serif; --bs-body-color: #212529; --bs-body-bg: #ffffff; --bs-border-radius: 0.375rem; --bs-border-color: #dee2e6; }
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--bs-body-font-family); line-height: 1.5; color: var(--bs-body-color); background: var(--bs-body-bg); }
.container { width: 100%; max-width: 960px; margin-inline: auto; padding-inline: 0.75rem; }
.row { --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-inline: calc(-0.5 * var(--bs-gutter-x)); }
.row > * { flex-shrink: 0; width: 100%; max-width: 100%; padding-inline: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y); }
.g-3 { --bs-gutter-x: 1rem; --bs-gutter-y: 1rem; }
.col-12 { flex: 0 0 auto; width: 100%; }
@media (min-width: 768px) { .col-md-6 { flex: 0 0 auto; width: 50%; } }
.navbar { padding-block: 0.5rem; }
.bg-primary { background-color: rgb(var(--bs-primary-rgb)); }
.navbar-brand { color: #ffffff; font-size: 1.25rem; text-decoration: none; }
.card { height: 100%; border: 1px solid var(--bs-border-color); border-radius: var(--bs-border-radius); background: #ffffff; }
.card-body { padding: 1rem; }
.card-title { margin: 0 0 0.5rem; font-size: 1.25rem; }
.badge { display: inline-block; padding: 0.35em 0.65em; border-radius: var(--bs-border-radius); font-size: 0.75em; font-weight: 700; }
.text-bg-warning { background-color: #ffc107; color: #000000; }
.text-bg-success { background-color: #146c43; color: #ffffff; }
.text-bg-primary { background-color: rgb(var(--bs-primary-rgb)); color: #ffffff; }
.btn { --bs-btn-bg: transparent; --bs-btn-border-color: transparent; --bs-btn-hover-bg: transparent; display: inline-block; padding: 0.375rem 0.75rem; border: 1px solid var(--bs-btn-border-color); border-radius: var(--bs-border-radius); background-color: var(--bs-btn-bg); color: #ffffff; font: inherit; }
.btn:hover { background-color: var(--bs-btn-hover-bg); }
.btn-primary { --bs-btn-bg: #0d6efd; --bs-btn-border-color: #0d6efd; --bs-btn-hover-bg: #0b5ed7; }
.mt-3 { margin-top: 1rem; }
/* ===== Конец фрагмента. Ниже — ваш bs-theme.css ===== */
`;
  const card = (title, cls, label, text) => `      <div>
        <article class="card">
          <div class="card-body">
            <h2 class="card-title">${title}</h2>
            <span class="badge ${cls}">${label}</span>
            <p>${text}</p>
          </div>
        </article>
      </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2601', lesson: 'm9-lr14', module: 'mdk93', mech: 'build', title: 'Bootstrap в цветах «ЧистоДома»', level: 'Сложное', minutes: 30, points: 200,
      story: 'Страницу «Мои заявки» перевели на Bootstrap: шапка navbar, карточки card, бейджи text-bg-*. Но пока это стандартный синий Bootstrap, а у «ЧистоДома» фирменный бирюзовый и радиус 12px. Да и карточки стоят столбиком даже на мониторе. Доведём до макета.',
      goal: 'HTML: блоку .requests добавьте классы row g-3, каждой из трёх обёрток карточек — col-12 col-md-6 (на телефоне колонка во всю ширину, от 768px — половина). CSS-фрагмент Bootstrap не меняйте, свои правила пишите ниже (как в bs-theme.css): в :root переопределите --bs-primary: #0f766e, --bs-primary-rgb: 15, 118, 110 и --bs-border-radius: 12px; у .btn-primary — --bs-btn-bg и --bs-btn-border-color #0f766e, --bs-btn-hover-bg #115e59.',
      hints: [
        'Сетка: <div class="requests row g-3"> <div class="col-12 col-md-6"> <article class="card">…</article> </div> … </div> — всё внутри .container.',
        'Тема: :root { --bs-primary: #0f766e; --bs-primary-rgb: 15, 118, 110; --bs-border-radius: 12px; } — ваше правило ниже, поэтому оно перебивает Bootstrap.',
        'Одного --bs-primary мало: у кнопки свои переменные. .btn-primary { --bs-btn-bg: #0f766e; --bs-btn-border-color: #0f766e; --bs-btn-hover-bg: #115e59; }'
      ],
      // Тема Bootstrap по своей природе переопределяет те же селекторы (:root, .btn-primary), что и библиотека, поэтому проверку повторов отключаем
      skipQuality: ['dupes'],
      html: `<nav class="navbar bg-primary" aria-label="Главное меню">
  <div class="container">
    <a class="navbar-brand" href="#requests">ЧистоДом</a>
  </div>
</nav>
<main class="container">
  <h1>Мои заявки</h1>
  <div class="requests">
${card('Генеральная уборка', 'text-bg-warning', 'В работе', '12.11.2026, 10:00 · ул. Ленина, 5')}
${card('Общий клининг', 'text-bg-success', 'Выполнена', '20.10.2026, 09:00 · ул. Ленина, 5')}
${card('Мойка окон', 'text-bg-primary', 'Новая', '25.11.2026, 11:00 · ул. Садовая, 3')}
  </div>
  <a class="btn btn-primary mt-3" href="#new">Новая заявка</a>
</main>`,
      css: BS,
      tests: [
        { name: 'Сетка: .requests — row g-3, у трёх обёрток карточек col-12 col-md-6', check: h => {
          const row = h.$('.container .requests');
          if (!row || !row.classList.contains('row') || !row.classList.contains('g-3')) return 'у .requests нужны классы row g-3';
          const cols = [...row.children];
          return cols.length === 3 && cols.every(c => c.classList.contains('col-12') && c.classList.contains('col-md-6')) || 'у каждой обёртки карточки — col-12 col-md-6';
        } },
        { name: '1024px: карточки по две в ряд', check: h => {
          const c = h.$$('.card');
          return h.sameRow([c[0], c[1]]) && h.rect(c[2]).top > h.rect(c[0]).bottom || 'на 1024px первые две карточки должны стоять рядом, третья — ниже';
        } },
        { name: '360px: карточки в одну колонку, без прокрутки', at: 360, check: h => {
          const c = h.$$('.card');
          if (h.sameRow([c[0], c[1]])) return 'на телефоне карточки должны стоять одна под другой';
          return !h.overflow() || 'страница шире экрана';
        } },
        { name: ':root: --bs-primary #0f766e и --bs-primary-rgb 15, 118, 110', check: h => {
          if (varOf(h, 'html', '--bs-primary') !== '#0f766e') return '--bs-primary должен быть #0f766e';
          return varOf(h, 'html', '--bs-primary-rgb').replace(/\s/g, '') === '15,118,110' || '--bs-primary-rgb: 15, 118, 110';
        } },
        { name: 'Шапка .navbar.bg-primary и бейдж «Новая» стали бирюзовыми', check: h => h.cs('.navbar', 'background-color') === rgb('#0f766e') && h.cs('.text-bg-primary', 'background-color') === rgb('#0f766e') || 'bg-primary берёт цвет из --bs-primary-rgb' },
        { name: 'Кнопка .btn-primary: фон и рамка #0f766e, наведение #115e59', check: h => {
          if (h.cs('.btn-primary', 'background-color') !== rgb('#0f766e')) return 'фон кнопки не бирюзовый: переопределите --bs-btn-bg у .btn-primary';
          if (h.cs('.btn-primary', 'border-top-color') !== rgb('#0f766e')) return 'рамка: --bs-btn-border-color';
          return varOf(h, '.btn-primary', '--bs-btn-hover-bg') === '#115e59' || '--bs-btn-hover-bg: #115e59';
        } },
        { name: 'Скругление карточек и кнопки 12px через --bs-border-radius', check: h => h.px('.card', 'border-top-left-radius') === 12 && h.px('.btn', 'border-top-left-radius') === 12 || '--bs-border-radius: 12px' },
        { name: 'Фрагмент Bootstrap не тронут', check: h => h.css.includes(BS.trim()) || 'верните фрагмент bootstrap.min.css как был: свои правила пишите ниже' }
      ]
    }
  );
})();
