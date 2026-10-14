/* Занятие 48. Практическая работа №10 (ч. 1). Прототип дизайна: главная страница */
(() => {
  const { BASE, IMG, ICON, rgb } = window.COURSE_KIT;
  // Стайлгайд проекта «Читальный зал» (тот же, что на занятии 47, плюс цвет успеха)
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
  const BTN = `.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; text-decoration: none; }
.btn:focus-visible { outline: 3px solid var(--color-text); outline-offset: 2px; }
.btn-secondary { border-color: var(--color-primary); color: var(--color-primary); }`;
  const BTN_PRIMARY = `.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }`;
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const noLiterals = { name: 'Цвета только из переменных: вне :root нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } };
  const noOverflow = { name: 'На телефоне 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' };
  const stacked = (h, sel) => { const e = h.$$(sel); return e.length > 1 && e.every((x, i) => i === 0 || x.getBoundingClientRect().top >= e[i - 1].getBoundingClientRect().bottom - 1); };
  const gapVar = (h, sel) => h.rules.some(r => r.selector === sel && /var\(--space/.test(r.style.getPropertyValue('gap') || r.style.getPropertyValue('row-gap') || ''));

  window.COURSE_TASKS.push(
    {
      id: 'k4801', lesson: 'mdk-48', module: 'mdk5', mech: 'build',
      title: 'Прототип: шапка и первый экран', level: 'Сложное', minutes: 30, points: 200,
      story: 'Начинаем верстать главную страницу «Читального зала» по ТЗ из урока. Стайлгайд уже в :root, классы кнопок готовы. Ваша часть — шапка и первый экран.',
      goal: 'Внутри .page сверстайте: 1) header.header — логотип p.logo «Читальный зал» и nav.nav с aria-label, внутри ul из 3–4 ссылок; шапка — flex, логотип слева, меню справа (justify-content: space-between), ссылки меню в одну строку; фон шапки — var(--color-primary), ссылки и логотип — var(--color-on-primary). 2) После шапки section.hero: один h1, абзац p и блок .hero-actions с двумя ссылками: «Найти книгу» (.btn .btn-primary) и «Забронировать место» (.btn .btn-secondary) в одну строку. h1 хотя бы в 2 раза крупнее абзаца. Фон hero — var(--color-surface), padding не меньше 24px. Цвета — только через var(). На 360px нет горизонтальной прокрутки.',
      hints: [
        'Каркас шапки: <header class="header"><p class="logo">Читальный зал</p><nav class="nav" aria-label="Главное меню"><ul><li><a href="#catalog">Каталог</a></li>…</ul></nav></header>.',
        'Шапка: .header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-primary); }. Меню: .nav ul { display: flex; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }.',
        'Белый текст: .logo, .nav a { color: var(--color-on-primary); }. У .logo уберите margin: 0, чтобы шапка не была высокой.',
        'Первый экран: .hero { padding: var(--space-4) var(--space-3); background: var(--color-surface); }, .hero h1 { font-size: 40px; }, .hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }.'
      ],
      html: `<div class="page">
  <!-- 1. Шапка header.header: логотип p.logo «Читальный зал» и меню nav.nav (ul из 3–4 ссылок) -->

  <!-- 2. Первый экран section.hero: h1, абзац и .hero-actions с кнопками «Найти книгу» и «Забронировать место» -->

</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h1 { font-family: var(--font-heading); line-height: 1.2; }
${BTN}
${BTN_PRIMARY}
/* Ниже — ваши стили шапки и первого экрана */
`,
      tests: [
        { name: 'header.header: логотип .logo и nav.nav с aria-label и 3–4 ссылками', check: h => { const n = h.count('.header nav.nav[aria-label] ul a[href]'); return (!!h.$('.page header.header .logo') && n >= 3 && n <= 4) || `логотип: ${h.count('.header .logo')}, ссылок в меню: ${n}`; } },
        { name: 'Шапка — flex: логотип слева, меню справа в одной строке', check: h => (h.cs('.header', 'display') === 'flex' && h.cs('.header', 'justify-content') === 'space-between' && (() => { const l = h.rect('.header .logo'), n = h.rect('.header .nav'); const mid = (l.top + l.bottom) / 2; return mid > n.top && mid < n.bottom && l.right < n.left; })()) || 'нужно .header { display: flex; justify-content: space-between; }' },
        { name: 'Ссылки меню в одну строку', check: h => { const a = h.$$('.header .nav a'); return (a.length >= 3 && h.sameRow(a)) || 'сделайте список меню flex-контейнером'; } },
        { name: 'Шапка: фон --color-primary, логотип и ссылки --color-on-primary', check: h => (h.cs('.header', 'background-color') === rgb('#1f5fa8') && h.cs('.header .logo', 'color') === rgb('#ffffff') && h.$$('.header .nav a').every(a => h.cs(a, 'color') === rgb('#ffffff'))) || 'проверьте background шапки и color логотипа и ссылок' },
        { name: 'После шапки section.hero: h1, абзац и две кнопки', check: h => (h.count('h1') === 1 && !!h.$('section.hero h1') && !!h.$('.hero p') && h.before('.header', '.hero') && !!h.$('.hero .hero-actions .btn.btn-primary') && !!h.$('.hero .hero-actions .btn.btn-secondary')) || 'нужны section.hero с h1, p и .hero-actions с .btn-primary и .btn-secondary' },
        { name: 'Кнопки «Найти книгу» (первичная) и «Забронировать место» (вторичная) в одну строку', check: h => (h.text('.hero .btn-primary') === 'Найти книгу' && h.text('.hero .btn-secondary') === 'Забронировать место' && h.sameRow(['.hero .btn-primary', '.hero .btn-secondary'])) || 'проверьте тексты кнопок и flex у .hero-actions' },
        { name: 'h1 хотя бы в 2 раза крупнее абзаца первого экрана', check: h => h.px('.hero h1', 'font-size') >= 2 * h.px('.hero p', 'font-size') - 0.5 || `h1 ${h.px('.hero h1', 'font-size')}px, абзац ${h.px('.hero p', 'font-size')}px` },
        { name: 'Первый экран: фон --color-surface, padding от 24px', check: h => (h.cs('.hero', 'background-color') === rgb('#f2f5fa') && h.px('.hero', 'padding-top') >= 24 && h.px('.hero', 'padding-left') >= 24) || 'проверьте background и padding у .hero' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4802', lesson: 'mdk-48', module: 'mdk5', mech: 'adaptive',
      title: 'Прототип: блок «Почему у нас удобно»', level: 'Среднее', minutes: 25, points: 150,
      story: 'Следующий блок главной по ТЗ — три преимущества библиотеки. На компьютере они стоят в ряд, на телефоне — друг под другом.',
      goal: 'В section.features после h2 добавьте div.features-list и в нём три article.feature: в каждой иконка img (src="img/icon.svg", alt=""), заголовок h3 и абзац p. Стили (mobile first): .features-list — grid с gap через var(--space-…); с 768px (@media (min-width: 768px)) — три колонки, на 360px карточки друг под другом. Карточка .feature: фон var(--color-surface), скругление var(--radius), padding не меньше 16px. Цвета только через var(), горизонтальной прокрутки на 360px нет.',
      hints: [
        'Одна карточка: <article class="feature"><img src="img/icon.svg" alt=""><h3>Тихие места</h3><p>40 мест с лампами и розетками.</p></article>.',
        'Mobile first: .features-list { display: grid; gap: var(--space-3); } — на телефоне это уже одна колонка.',
        'Для компьютера: @media (min-width: 768px) { .features-list { grid-template-columns: repeat(3, 1fr); } }.',
        'Карточка: .feature { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }. Иконке задайте размер: .feature img { width: 32px; height: 32px; }.'
      ],
      html: `<div class="page">
  <section class="features">
    <h2>Почему у нас удобно</h2>
    <!-- div.features-list с тремя article.feature: иконка, h3, абзац -->

  </section>
</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h2 { font-family: var(--font-heading); font-size: 28px; }
/* Ниже — стили блока преимуществ */
`,
      tests: [
        { name: 'В .features-list три article.feature с иконкой, h3 и абзацем', check: h => { const f = h.$$('.features .features-list > article.feature'); return (f.length === 3 && f.every(e => e.querySelector('img') && e.querySelector('h3')?.textContent.trim() && e.querySelector('p')?.textContent.trim())) || `карточек: ${f.length}`; } },
        { name: 'У иконок пустой alt="" (рядом есть заголовок)', check: h => { const i = h.$$('.feature img'); return (i.length === 3 && i.every(e => e.getAttribute('alt') === '')) || 'нужно alt="" у иконок'; } },
        { name: '.features-list — grid, gap через var(--space-…)', check: h => (h.cs('.features-list', 'display') === 'grid' && gapVar(h, '.features-list')) || 'нужно .features-list { display: grid; gap: var(--space-3); }' },
        { name: 'На компьютере три карточки в ряд', check: h => (h.count('.feature') === 3 && h.sameRow(h.$$('.feature'))) || 'добавьте @media (min-width: 768px) с тремя колонками' },
        { name: 'На телефоне карточки друг под другом', at: 360, check: h => stacked(h, '.feature') || 'на 360px карточки должны идти в колонку' },
        { name: 'Карточка: фон --color-surface, скругление 8px, padding от 16px', check: h => (h.cs('.feature', 'background-color') === rgb('#f2f5fa') && h.px('.feature', 'border-top-left-radius') === 8 && h.px('.feature', 'padding-top') >= 16) || 'проверьте .feature' },
        { name: 'Заголовки карточек — шрифт заголовков Georgia', check: h => /georgia/i.test(h.cs('.feature h3', 'font-family')) || 'добавьте h3 к правилу шрифта заголовков' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4803', lesson: 'mdk-48', module: 'mdk5', mech: 'build',
      title: 'Прототип: новые поступления и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Последние блоки главной: сетка карточек новых книг и подвал с контактами. Карточка книги — компонент, который пригодится на странице каталога.',
      goal: 'В section.new-books после h2 добавьте ul.cards с тремя li.card. В карточке: img (src="img/art.svg", непустой alt), h3 с названием, p.author с автором, span.badge «Новинка» и ссылка «Забронировать» с классами btn btn-secondary. Сетка .cards — grid с gap через var(--space-…): на компьютере три карточки в ряд, на 360px друг под другом (mobile first). Карточка: padding от 16px, скругление var(--radius), рамка или фон. Картинка не шире карточки. .author — цвет var(--color-muted), .badge — фон var(--color-accent) и цвет var(--color-text). После секции — footer.footer: ссылки на телефон (href="tel:…") и почту (href="mailto:…"); фон подвала var(--color-text), текст и ссылки var(--color-on-primary). Цвета только через var().',
      hints: [
        'Карточка: <li class="card"><img src="img/art.svg" alt="Обложка книги «…»"><h3>…</h3><p class="author">…</p><span class="badge">Новинка</span> <a class="btn btn-secondary" href="#">Забронировать</a></li>.',
        'Сетка: .cards { display: grid; gap: var(--space-3); margin: 0; padding: 0; list-style: none; } и @media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); } }.',
        'Картинка: .card img { display: block; width: 100%; height: auto; border-radius: var(--radius); }.',
        'Подвал: .footer { margin-top: var(--space-4); padding: var(--space-3); background: var(--color-text); color: var(--color-on-primary); } и .footer a { color: var(--color-on-primary); }.'
      ],
      html: `<div class="page">
  <section class="new-books">
    <h2>Новые поступления</h2>
    <!-- ul.cards с тремя li.card -->

  </section>
  <!-- footer.footer: адрес, телефон (tel:), почта (mailto:) -->

</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h2, .page h3 { font-family: var(--font-heading); }
${BTN}
/* Ниже — стили карточек и подвала */
`,
      tests: [
        { name: 'ul.cards: три li.card с картинкой (alt), h3, .author, .badge и ссылкой', check: h => { const c = h.$$('.new-books ul.cards > li.card'); return (c.length === 3 && c.every(e => e.querySelector('img')?.alt.trim() && e.querySelector('h3')?.textContent.trim() && e.querySelector('.author')?.textContent.trim() && e.querySelector('.badge')?.textContent.trim() === 'Новинка' && e.querySelector('a.btn.btn-secondary[href]'))) || `полных карточек: ${c.filter(e => e.querySelector('img')?.alt.trim() && e.querySelector('h3') && e.querySelector('.author') && e.querySelector('.badge') && e.querySelector('a.btn.btn-secondary')).length} из 3`; } },
        { name: '.cards — grid, gap через var(--space-…)', check: h => (h.cs('.cards', 'display') === 'grid' && gapVar(h, '.cards')) || 'нужно .cards { display: grid; gap: var(--space-…); }' },
        { name: 'На компьютере три карточки в ряд', check: h => (h.count('.card') === 3 && h.sameRow(h.$$('.card'))) || 'добавьте три колонки в @media (min-width: 768px)' },
        { name: 'На телефоне карточки друг под другом, картинки не шире карточек', at: 360, check: h => (stacked(h, '.card') && h.$$('.card img').every(i => h.inside(i, i.closest('.card')))) || 'на 360px — колонка и img { width: 100%; }' },
        { name: 'Карточка: padding от 16px, скругление 8px, рамка или фон', check: h => (h.px('.card', 'padding-top') >= 16 && h.px('.card', 'border-top-left-radius') === 8 && (h.px('.card', 'border-top-width') > 0 || h.cs('.card', 'background-color') !== 'rgba(0, 0, 0, 0)')) || 'проверьте .card' },
        { name: 'Автор — --color-muted, бейдж — фон --color-accent и текст --color-text', check: h => (h.cs('.author', 'color') === rgb('#5a6475') && h.cs('.badge', 'background-color') === rgb('#e8a33d') && h.cs('.badge', 'color') === rgb('#1d2433')) || 'проверьте .author и .badge' },
        { name: 'footer.footer после секции: ссылки tel: и mailto:', check: h => (h.before('.new-books', 'footer.footer') && !!h.$('.footer a[href^="tel:"]') && !!h.$('.footer a[href^="mailto:"]')) || 'нужен footer.footer с ссылками tel: и mailto:' },
        { name: 'Подвал: фон --color-text, текст и ссылки --color-on-primary', check: h => (h.cs('.footer', 'background-color') === rgb('#1d2433') && h.cs('.footer', 'color') === rgb('#ffffff') && h.$$('.footer a').every(a => h.cs(a, 'color') === rgb('#ffffff'))) || 'проверьте background и color подвала и его ссылок' },
        noLiterals,
        noOverflow
      ]
    }
  );
})();
