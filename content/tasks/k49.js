/* Занятие 49. Практическая работа №10 (ч. 2). Прототип: внутренняя страница и форма */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Стайлгайд проекта «Читальный зал» (занятия 47–48)
  const ROOT = `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --color-success: #2e7d32;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`;
  const PAGE = `.page { font-family: var(--font-main); color: var(--color-text); }
.page h1 { font-family: var(--font-heading); }`;
  const BTN = `.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; }
.btn:focus-visible { outline: 3px solid var(--color-text); outline-offset: 2px; }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }`;
  const BOOKS = `<ul class="catalog">
    <li class="book" data-genre="fantasy" data-available="yes">
      <h2 class="book-title">Пикник на обочине</h2>
      <p class="author">А. и Б. Стругацкие</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="fantasy" data-available="no">
      <h2 class="book-title">Солярис</h2>
      <p class="author">С. Лем</p>
      <span class="badge badge-no">На руках</span>
    </li>
    <li class="book" data-genre="textbook" data-available="yes">
      <h2 class="book-title">Основы веб-дизайна</h2>
      <p class="author">Е. Смирнова</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="textbook" data-available="no">
      <h2 class="book-title">HTML и CSS для начинающих</h2>
      <p class="author">И. Петров</p>
      <span class="badge badge-no">На руках</span>
    </li>
    <li class="book" data-genre="detective" data-available="yes">
      <h2 class="book-title">Собака Баскервилей</h2>
      <p class="author">А. Конан Дойл</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="detective" data-available="yes">
      <h2 class="book-title">Убийство в «Восточном экспрессе»</h2>
      <p class="author">А. Кристи</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
  </ul>`;
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const noLiterals = { name: 'Цвета только из переменных: вне :root нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } };
  const noOverflow = { name: 'На телефоне 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' };
  const stacked = (h, els) => els.length > 1 && els.every((x, i) => i === 0 || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);

  window.COURSE_TASKS.push(
    {
      id: 'k4901', lesson: 'mdk-49', module: 'mdk5', mech: 'build',
      title: 'Каталог: форма-фильтр', level: 'Среднее', minutes: 25, points: 150,
      story: 'На странице каталога «Читального зала» нужен фильтр: поиск, жанр и флажок «Только в наличии». Студенты открывают каталог и с телефона, и с компьютера.',
      goal: 'В form.filter сделайте три обёртки div.filter-field: 1) label for="q" «Название или автор» и input id="q" name="q" type="search"; 2) label for="genre" «Жанр» и select id="genre" name="genre" с вариантами: all «Все жанры», fantasy «Фантастика», textbook «Учебники», detective «Детективы»; 3) label с классом check, внутри input id="available" name="available" type="checkbox" и текст «Только в наличии». Кнопку переименуйте в «Показать». Подписи поиска и жанра — над полями (display: block), поля #q и #genre высотой не меньше 44px с рамкой var(--color-muted). Mobile first: на телефоне обёртки друг под другом, с 768px — в строку, поля и кнопка выровнены по нижнему краю (align-items: flex-end). Цвета только через var().',
      hints: [
        'Обёртка: <div class="filter-field"><label for="q">Название или автор</label><input id="q" name="q" type="search"></div>. Так же для select: <option value="all">Все жанры</option>…',
        'Флажок: <div class="filter-field"><label class="check"><input id="available" name="available" type="checkbox"> Только в наличии</label></div>.',
        'Поля: .filter-field label { display: block; margin-bottom: var(--space-1); } и #q, #genre { min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }. Флажку display: flex; align-items: center; min-height: 44px.',
        'Раскладка: .filter { display: flex; flex-direction: column; gap: var(--space-2); } и @media (min-width: 768px) { .filter { flex-direction: row; align-items: flex-end; } }.'
      ],
      html: `<div class="page">
  <h1>Каталог книг</h1>
  <form class="filter">
    <!-- Три div.filter-field: поиск, жанр, флажок «Только в наличии» -->

    <button class="btn btn-primary" type="submit">OK</button>
  </form>
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
${BTN}
/* Ниже — стили формы-фильтра */
`,
      tests: [
        { name: 'Три обёртки div.filter-field внутри form.filter', check: h => h.count('form.filter > .filter-field') === 3 || `сейчас ${h.count('form.filter > .filter-field')}` },
        { name: 'Поиск: label for="q" и input#q type="search"', check: h => (h.$('#q')?.type === 'search' && !!h.$('label[for="q"]') && h.$('#q').name === 'q') || 'нужны <label for="q"> и <input id="q" name="q" type="search">' },
        { name: 'Жанр: select#genre с вариантами all, fantasy, textbook, detective', check: h => { const o = h.$$('select#genre option').map(e => e.value).join(','); return (o === 'all,fantasy,textbook,detective' && !!h.$('label[for="genre"]')) || `варианты: ${o || 'нет'}`; } },
        { name: 'Флажок #available внутри label.check с текстом «Только в наличии»', check: h => { const c = h.$('#available'); return !!(c && c.type === 'checkbox' && c.closest('label.check') && /Только в наличии/.test(c.closest('label').textContent)) || 'нужен <label class="check"><input id="available" type="checkbox"> Только в наличии</label>'; } },
        { name: 'Кнопка отправки «Показать»', check: h => (h.text('.filter button[type="submit"]') === 'Показать') || `сейчас «${h.text('.filter button')}»` },
        { name: 'Подписи над полями, поля от 44px с рамкой --color-muted', check: h => { const ok = ['q', 'genre'].every(id => { const l = h.rect(`label[for="${id}"]`), f = h.rect('#' + id); return l && f && l.bottom <= f.top + 1 && f.height >= 43.5 && h.cs('#' + id, 'border-top-color') === rgb('#5a6475'); }); return ok || 'проверьте display: block у подписей и min-height, border у #q и #genre'; } },
        { name: 'На компьютере поля и кнопка в одну строку по нижнему краю', check: h => { const r = ['#q', '#genre', '.filter button'].map(s => h.rect(s)); if (r.some(x => !x)) return 'нет полей'; const b = r.map(x => x.bottom); return (Math.max(...b) - Math.min(...b) < 2 && r[0].left < r[1].left && r[1].left < r[2].left) || 'нужно @media (min-width: 768px) { .filter { flex-direction: row; align-items: flex-end; } }'; } },
        { name: 'На телефоне поля друг под другом', at: 360, check: h => stacked(h, h.$$('.filter-field')) || 'на 360px обёртки должны идти в колонку' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4902', lesson: 'mdk-49', module: 'mdk5', mech: 'adaptive',
      title: 'Каталог: крошки и сетка карточек', level: 'Среднее', minutes: 25, points: 150,
      story: 'Карточки книг каталога уже в разметке, но стоят сплошным списком. Нужна навигация «где я» и аккуратная сетка, которая сама подстраивается под ширину экрана.',
      goal: 'Перед h1 добавьте хлебные крошки: nav.breadcrumbs с aria-label, внутри ol: «Главная» — ссылка, «Каталог» — текст с aria-current="page" у li; пункты в строку, перед вторым — разделитель через li + li::before. Сетка .catalog: display: grid, grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)), gap через var(--space-…), без маркеров списка; на компьютере не меньше трёх карточек в ряд, на 360px — одна колонка. Карточка .book: padding от 16px, скругление var(--radius), рамка или фон. Бейдж .badge-yes: фон var(--color-success), текст var(--color-on-primary); .badge-no: фон var(--color-surface), текст var(--color-muted). Цвета только через var().',
      hints: [
        'Крошки: <nav class="breadcrumbs" aria-label="Хлебные крошки"><ol><li><a href="#">Главная</a></li><li aria-current="page">Каталог</li></ol></nav>.',
        'Крошки в строку: .breadcrumbs ol { display: flex; margin: 0; padding: 0; list-style: none; } и .breadcrumbs li + li::before { content: "/"; margin: 0 var(--space-1); }.',
        'Сетка: .catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin: 0; padding: 0; list-style: none; }. Медиазапрос не нужен.',
        'Бейдж: общий .badge { display: inline-block; padding: 2px var(--space-1); border-radius: var(--radius); font-size: 14px; } и цвета в .badge-yes и .badge-no.'
      ],
      html: `<div class="page">
  <!-- Здесь хлебные крошки: Главная / Каталог -->

  <h1>Каталог книг</h1>
  <p class="found">Найдено: 6</p>
  ${BOOKS}
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
.book-title { margin: 0 0 var(--space-1); font-family: var(--font-heading); font-size: 20px; }
.author { margin: 0 0 var(--space-2); color: var(--color-muted); }
/* Ниже — стили крошек, сетки, карточек и бейджей */
`,
      tests: [
        { name: 'Перед h1 nav.breadcrumbs с aria-label и ol из двух пунктов', check: h => (!!h.$('nav.breadcrumbs[aria-label]') && h.count('nav.breadcrumbs ol > li') === 2 && h.before('nav.breadcrumbs', 'h1')) || 'нужен nav.breadcrumbs с aria-label и ol из двух li перед h1' },
        { name: '«Главная» — ссылка, «Каталог» — текст с aria-current="page"', check: h => { const li = h.$$('nav.breadcrumbs li'); return (li.length === 2 && !!li[0].querySelector('a[href]') && !li[1].querySelector('a') && li[1].getAttribute('aria-current') === 'page' && li[1].textContent.trim() === 'Каталог') || 'проверьте пункты крошек'; } },
        { name: 'Крошки в строку, перед вторым пунктом разделитель', check: h => { const li = h.$$('nav.breadcrumbs li'); const c = li[1] ? h.win.getComputedStyle(li[1], '::before').content : 'none'; return (li.length === 2 && h.sameRow(li) && c && c !== 'none' && c !== 'normal') || 'нужны flex у ol и li + li::before { content: … }'; } },
        { name: '.catalog — grid с repeat(auto-fit, minmax(220px, 1fr))', check: h => { const r = h.rules.find(x => x.selector === '.catalog'); return (h.cs('.catalog', 'display') === 'grid' && !!r && /repeat\(\s*auto-fit\s*,\s*minmax\(\s*220px\s*,\s*1fr\s*\)\s*\)/.test(r.style.gridTemplateColumns)) || 'нужно grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))'; } },
        { name: 'Отступы сетки через var(--space-…), без маркеров списка', check: h => { const r = h.rules.find(x => x.selector === '.catalog'); return (!!r && /var\(--space/.test(r.style.getPropertyValue('gap') || r.style.getPropertyValue('row-gap')) && h.cs('.catalog', 'list-style-type') === 'none') || 'нужны gap: var(--space-…) и list-style: none'; } },
        { name: 'На компьютере хотя бы три карточки в ряд', check: h => { const b = h.$$('.book').slice(0, 3); return (b.length === 3 && h.sameRow(b)) || 'первые три карточки должны стоять в одной строке'; } },
        { name: 'На телефоне одна колонка', at: 360, check: h => stacked(h, h.$$('.book')) || 'на 360px карточки должны идти друг под другом' },
        { name: 'Карточка: padding от 16px, скругление 8px, рамка или фон', check: h => (h.px('.book', 'padding-top') >= 16 && h.px('.book', 'border-top-left-radius') === 8 && (h.px('.book', 'border-top-width') > 0 || h.cs('.book', 'background-color') !== 'rgba(0, 0, 0, 0)')) || 'проверьте .book' },
        { name: 'Бейджи: «В наличии» — --color-success и белый, «На руках» — --color-surface и --color-muted', check: h => (h.cs('.badge-yes', 'background-color') === rgb('#2e7d32') && h.cs('.badge-yes', 'color') === rgb('#ffffff') && h.cs('.badge-no', 'background-color') === rgb('#f2f5fa') && h.cs('.badge-no', 'color') === rgb('#5a6475')) || 'проверьте .badge-yes и .badge-no' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4903', lesson: 'mdk-49', module: 'mdk5', mech: 'build',
      title: 'Каталог: фильтр работает', level: 'Сложное', minutes: 30, points: 200,
      story: 'Форма и карточки готовы, но кнопка «Показать» пока просто перезагружает страницу. Оживите фильтр на JavaScript.',
      goal: 'В script.js обработайте событие submit формы .filter: отмените перезагрузку (event.preventDefault()), прочитайте жанр (#genre), флажок (#available) и текст поиска (#q, без пробелов по краям, в нижнем регистре). Книга .book видна (hidden = false), если: жанр «all» или совпадает с её data-genre; флажок снят или у неё data-available="yes"; название .book-title в нижнем регистре содержит текст поиска. Остальные книги — hidden = true. В .found напишите «Найдено: N». Если N = 0, покажите .empty (hidden = false), иначе спрячьте. Ошибок в консоли быть не должно.',
      hints: [
        'Каркас: const form = document.querySelector(\'.filter\'); form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Значения: const genre = document.querySelector(\'#genre\').value; const onlyAvailable = document.querySelector(\'#available\').checked; const text = document.querySelector(\'#q\').value.trim().toLowerCase();',
        'Перебор: let count = 0; for (const book of document.querySelectorAll(\'.book\')) { const title = book.querySelector(\'.book-title\').textContent.toLowerCase(); … }',
        'Условие: const ok = (genre === \'all\' || book.dataset.genre === genre) && (!onlyAvailable || book.dataset.available === \'yes\') && title.includes(text); book.hidden = !ok; if (ok) { count = count + 1; }'
      ],
      html: `<div class="page">
  <h1>Каталог книг</h1>
  <form class="filter">
    <div class="filter-field">
      <label for="q">Название или автор</label>
      <input id="q" name="q" type="search">
    </div>
    <div class="filter-field">
      <label for="genre">Жанр</label>
      <select id="genre" name="genre">
        <option value="all">Все жанры</option>
        <option value="fantasy">Фантастика</option>
        <option value="textbook">Учебники</option>
        <option value="detective">Детективы</option>
      </select>
    </div>
    <div class="filter-field">
      <label class="check"><input id="available" name="available" type="checkbox"> Только в наличии</label>
    </div>
    <button class="btn btn-primary" type="submit">Показать</button>
  </form>
  <p class="found" role="status">Найдено: 6</p>
  <p class="empty" hidden>Ничего не нашлось. Попробуйте выбрать другой жанр или убрать флажок.</p>
  ${BOOKS}
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
${BTN}
.filter { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-3); }
.filter-field label { display: block; margin-bottom: var(--space-1); }
.filter-field .check { display: flex; align-items: center; gap: var(--space-1); min-height: 44px; margin: 0; }
#q, #genre { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }
.found { font-weight: bold; }
.empty { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); }
.catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.book { padding: var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.book-title { margin: 0 0 var(--space-1); font-family: var(--font-heading); font-size: 20px; }
.author { margin: 0 0 var(--space-2); color: var(--color-muted); }
.badge { display: inline-block; padding: 2px var(--space-1); border-radius: var(--radius); font-size: 14px; }
.badge-yes { background: var(--color-success); color: var(--color-on-primary); }
.badge-no { background: var(--color-surface); color: var(--color-muted); }
[hidden] { display: none; }
@media (min-width: 768px) {
  .filter { flex-direction: row; align-items: flex-end; }
}`,
      js: `// Ваш код здесь
`,
      tests: [
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: h => h.submit('.filter') === false || 'вызовите event.preventDefault() в обработчике submit' },
        { name: 'Жанр «Фантастика» → видны только 2 книги этого жанра', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 2 && v.every(b => b.dataset.genre === 'fantasy')) || `видно книг: ${v.length}`; } },
        { name: 'Флажок «Только в наличии» → видны только 4 книги в наличии', js: true, check: h => { h.$('#available').checked = true; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 4 && v.every(b => b.dataset.available === 'yes')) || `видно книг: ${v.length}`; } },
        { name: 'Поиск «css» находит «HTML и CSS для начинающих» (без учёта регистра)', js: true, check: h => { h.$('#q').value = '  css '; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 1 && /CSS/.test(v[0].textContent)) || `видно книг: ${v.length}`; } },
        { name: 'Строка «Найдено: N» обновляется', js: true, check: h => { h.$('#genre').value = 'detective'; h.submit('.filter'); return h.text('.found') === 'Найдено: 2' || `сейчас «${h.text('.found')}»`; } },
        { name: 'Ничего не нашлось → видно .empty и «Найдено: 0»', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.$('#q').value = 'css'; h.submit('.filter'); return (h.visible('.empty') && h.text('.found') === 'Найдено: 0' && !h.$$('.book').some(b => h.visible(b))) || 'при пустом результате покажите .empty'; } },
        { name: 'После сброса фильтра снова видны все 6 книг, .empty спрятан', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.$('#q').value = 'css'; h.submit('.filter'); h.$('#genre').value = 'all'; h.$('#q').value = ''; h.submit('.filter'); return (h.$$('.book').filter(b => h.visible(b)).length === 6 && !h.visible('.empty') && h.text('.found') === 'Найдено: 6') || 'после «Все жанры» и пустого поиска должно быть видно 6 книг'; } },
        { name: 'В консоли нет ошибок', js: true, check: h => { h.submit('.filter'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
