/* Занятие 47. UI-kit и стайлгайд */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // значение CSS-переменной на :root: без пробелов по краям, без кавычек, строчными
  const v = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().replace(/["']/g, '').replace(/\s*,\s*/g, ', ').toLowerCase();
  const mismatch = (h, want) => Object.entries(want).filter(([k, val]) => v(h, k) !== val.toLowerCase()).map(([k]) => k);
  // правила, где цвет записан числом (HEX или rgb), кроме :root и body из базовых стилей
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const ruleProp = (h, sel, prop) => (h.rules.find(r => r.selector === sel && !r.media)?.style.getPropertyValue(prop) || '');

  const ROOT47 = `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4701', lesson: 'mdk-47', module: 'mdk5', mech: 'build',
      title: 'Стайлгайд в переменных', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Дизайнер сдал стайлгайд сайта библиотеки колледжа. Страница-образец стайлгайда уже свёрстана, но все её стили ссылаются на переменные, которых ещё нет, — поэтому образцы цветов пустые.',
      goal: 'В начале CSS напишите правило :root с переменными стайлгайда: --color-primary: #1f5fa8; --color-primary-dark: #174a84; --color-accent: #e8a33d; --color-text: #1d2433; --color-muted: #5a6475; --color-surface: #f2f5fa; --font-main: Arial, sans-serif; --font-heading: Georgia, serif; --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px; --radius: 8px. Остальной CSS не меняйте: образцы должны «ожить» сами.',
      hints: [
        'Каркас: :root { --color-primary: #1f5fa8; } — имя с двумя дефисами, двоеточие, значение, точка с запятой.',
        'Пишите каждую переменную с новой строки: так проще сверять с таблицей стайлгайда.',
        'Имена должны совпадать буква в букву: --color-primary-dark, а не --color-dark-primary. Шрифт: --font-main: Arial, sans-serif;'
      ],
      html: `<main class="guide">
  <h1>Стайлгайд: библиотека колледжа</h1>
  <h2>Палитра</h2>
  <ul class="swatches">
    <li class="swatch swatch-primary"><code>--color-primary</code></li>
    <li class="swatch swatch-primary-dark"><code>--color-primary-dark</code></li>
    <li class="swatch swatch-accent"><code>--color-accent</code></li>
    <li class="swatch swatch-text"><code>--color-text</code></li>
    <li class="swatch swatch-muted"><code>--color-muted</code></li>
    <li class="swatch swatch-surface"><code>--color-surface</code></li>
  </ul>
  <h2>Шрифты</h2>
  <p class="sample-heading">Georgia — заголовки</p>
  <p class="sample-muted">Arial — основной и приглушённый текст</p>
  <h2>Отступы и скругление</h2>
  <ul class="spaces">
    <li class="space"><span class="bar bar-1"></span> --space-1</li>
    <li class="space"><span class="bar bar-2"></span> --space-2</li>
    <li class="space"><span class="bar bar-3"></span> --space-3</li>
    <li class="space"><span class="bar bar-4"></span> --space-4</li>
  </ul>
</main>`,
      css: `${BASE}
/* Сюда — правило :root с переменными стайлгайда */

.guide { font-family: var(--font-main); color: var(--color-text); }
.guide h1, .guide h2, .sample-heading { font-family: var(--font-heading); }
.swatches { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.swatch { width: 160px; padding: var(--space-1); border-radius: var(--radius); background: var(--color-surface); font-size: 13px; }
.swatch::before { content: ""; display: block; height: 48px; margin-bottom: var(--space-1); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.swatch-primary::before { background: var(--color-primary); }
.swatch-primary-dark::before { background: var(--color-primary-dark); }
.swatch-accent::before { background: var(--color-accent); }
.swatch-text::before { background: var(--color-text); }
.swatch-muted::before { background: var(--color-muted); }
.swatch-surface::before { background: var(--color-surface); }
.sample-heading { font-size: 28px; }
.sample-muted { color: var(--color-muted); }
.spaces { margin: 0; padding: 0; list-style: none; }
.space { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1); }
.bar { height: 16px; background: var(--color-accent); }
.bar-1 { width: var(--space-1); }
.bar-2 { width: var(--space-2); }
.bar-3 { width: var(--space-3); }
.bar-4 { width: var(--space-4); }`,
      tests: [
        { name: 'Переменные объявлены в правиле :root', check: h => !!h.rules.find(r => r.selector === ':root' && r.style.length >= 13) || 'нет правила :root со всеми переменными' },
        { name: 'Шесть цветов палитры совпадают со стайлгайдом', check: h => { const bad = mismatch(h, { '--color-primary': '#1f5fa8', '--color-primary-dark': '#174a84', '--color-accent': '#e8a33d', '--color-text': '#1d2433', '--color-muted': '#5a6475', '--color-surface': '#f2f5fa' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Шрифты: --font-main и --font-heading', check: h => { const bad = mismatch(h, { '--font-main': 'arial, sans-serif', '--font-heading': 'georgia, serif' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Отступы --space-1…--space-4 и --radius', check: h => { const bad = mismatch(h, { '--space-1': '8px', '--space-2': '16px', '--space-3': '24px', '--space-4': '32px', '--radius': '8px' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Образцы цветов «ожили»', check: h => { const c = s => h.win.getComputedStyle(h.$(s), '::before').backgroundColor; return (c('.swatch-primary') === rgb('#1f5fa8') && c('.swatch-accent') === rgb('#e8a33d')) || 'образец основного цвета пустой'; } },
        { name: 'Заголовки шрифтом Georgia, текст Arial', check: h => (/georgia/i.test(h.cs('h1', 'font-family')) && /arial/i.test(h.cs('.sample-muted', 'font-family'))) || 'шрифты не применились' },
        { name: 'Полоски отступов: 8, 16, 24 и 32px', check: h => h.$$('.bar').map(e => Math.round(e.getBoundingClientRect().width)).join(',') === '8,16,24,32' || `сейчас ${h.$$('.bar').map(e => Math.round(e.getBoundingClientRect().width)).join(', ')}` }
      ]
    },
    {
      id: 'k4702', lesson: 'mdk-47', module: 'mdk5', mech: 'build',
      title: 'Компоненты из переменных', level: 'Среднее', minutes: 20, points: 150,
      story: 'Переменные стайлгайда библиотеки уже в :root. Теперь из них нужно собрать компоненты UI-kit: карточку, бейдж, поле и две кнопки. Правило команды: внутри классов — никаких HEX-кодов, только var().',
      goal: 'Допишите CSS, используя только переменные из :root (HEX и rgb вне :root запрещены). .card: padding var(--space-3), border-radius var(--radius), фон --color-surface. .card-text: цвет --color-muted. .badge: фон --color-accent, цвет --color-text, скругление --radius, padding var(--space-1). .label: display: block и отступ снизу --space-1. .field: min-height 44px, рамка 1px solid --color-muted, скругление --radius, padding 0 var(--space-2). .btn: min-height 44px, padding 0 var(--space-3), рамка 2px solid transparent, скругление --radius, шрифт 16px. .btn-primary: фон --color-primary, текст --color-on-primary; .btn-primary:hover: фон --color-primary-dark. .btn-secondary: прозрачный фон, цвет рамки и текста --color-primary.',
      hints: [
        'Карточка: .card { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }.',
        'Поле: .field { min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }.',
        'Кнопки: общий размер — в .btn, цвета — в .btn-primary и .btn-secondary. Для вторичной: border-color: var(--color-primary); background: transparent; color: var(--color-primary);',
        'Белый текст на кнопке — тоже переменная: color: var(--color-on-primary). Найдите поиском «#» — HEX должен остаться только в :root.'
      ],
      html: `<div class="page">
  <h1>Запись в читальный зал</h1>
  <article class="card">
    <h2>Место у окна</h2>
    <p class="card-text">Свободно сегодня с 14:00 до 18:00. Рядом розетка и лампа.</p>
    <span class="badge">Свободно</span>
  </article>
  <form class="form">
    <label class="label" for="ticket">Номер читательского билета</label>
    <input class="field" id="ticket" name="ticket" type="text">
    <div class="actions">
      <button class="btn btn-primary" type="submit">Забронировать</button>
      <button class="btn btn-secondary" type="button">Отмена</button>
    </div>
  </form>
</div>`,
      css: `${BASE}
${ROOT47}
.page { max-width: 480px; font-family: var(--font-main); color: var(--color-text); }
.page h1, .page h2 { font-family: var(--font-heading); }
.form { margin-top: var(--space-4); }
.actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
/* Ниже — ваши компоненты: .card, .card-text, .badge, .label, .field, .btn, .btn-primary, .btn-primary:hover, .btn-secondary */
`,
      tests: [
        { name: 'Карточка: padding 24px, скругление 8px, фон --color-surface', check: h => (h.px('.card', 'padding-top') === 24 && h.px('.card', 'border-top-left-radius') === 8 && h.cs('.card', 'background-color') === rgb('#f2f5fa')) || 'проверьте padding, border-radius и background у .card' },
        { name: 'Текст карточки — цвет --color-muted', check: h => h.cs('.card-text', 'color') === rgb('#5a6475') || 'нужно color: var(--color-muted)' },
        { name: 'Бейдж: фон --color-accent, текст --color-text, скругление 8px', check: h => (h.cs('.badge', 'background-color') === rgb('#e8a33d') && h.cs('.badge', 'color') === rgb('#1d2433') && h.px('.badge', 'border-top-left-radius') === 8 && h.px('.badge', 'padding-left') === 8) || 'проверьте фон, цвет, padding и скругление .badge' },
        { name: 'Подпись над полем, поле высотой от 44px с рамкой --color-muted', check: h => { const l = h.rect('.label'), f = h.rect('.field'); return !!(l && f && l.bottom <= f.top + 1 && f.height >= 43.5 && h.cs('.field', 'border-top-color') === rgb('#5a6475') && h.px('.field', 'border-top-width') === 1 && h.px('.field', 'border-top-left-radius') === 8 && h.px('.field', 'padding-left') === 16) || 'проверьте .label { display: block } и стили .field'; } },
        { name: 'Кнопки: высота от 44px, рамка 2px, скругление 8px, отступ 24px', check: h => { const b = h.$$('.btn'); return (b.length === 2 && b.every(e => e.getBoundingClientRect().height >= 43.5 && h.px(e, 'border-top-width') === 2 && h.px(e, 'border-top-left-radius') === 8 && h.px(e, 'padding-left') === 24)) || 'проверьте .btn'; } },
        { name: 'Первичная: фон --color-primary, текст --color-on-primary', check: h => (h.cs('.btn-primary', 'background-color') === rgb('#1f5fa8') && h.cs('.btn-primary', 'color') === rgb('#ffffff')) || 'проверьте .btn-primary' },
        { name: 'Вторичная: прозрачный фон, рамка и текст --color-primary', check: h => (h.cs('.btn-secondary', 'background-color') === 'rgba(0, 0, 0, 0)' && h.cs('.btn-secondary', 'border-top-color') === rgb('#1f5fa8') && h.cs('.btn-secondary', 'color') === rgb('#1f5fa8')) || 'проверьте .btn-secondary' },
        { name: '.btn-primary:hover берёт фон из --color-primary-dark', check: h => /var\(\s*--color-primary-dark\s*\)/.test(ruleProp(h, '.btn-primary:hover', 'background-color') || ruleProp(h, '.btn-primary:hover', 'background')) || 'нет .btn-primary:hover { background: var(--color-primary-dark); }' },
        { name: 'Отступы взяты из переменных --space-…', check: h => (/var\(--space/.test(ruleProp(h, '.card', 'padding')) && /var\(--space/.test(ruleProp(h, '.btn', 'padding'))) || 'у .card и .btn padding через var(--space-…)' },
        { name: 'Вне :root нет HEX и rgb — только переменные', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } }
      ]
    },
    {
      id: 'k4703', lesson: 'mdk-47', module: 'mdk5', mech: 'optimize',
      title: 'Цвета — в переменные', level: 'Среднее', minutes: 20, points: 150,
      story: 'Страницу кружка робототехники сверстали без стайлгайда: основной синий повторяется в CSS пять раз. Руководитель кружка хочет сменить цвет, и никто не уверен, что найдёт все места.',
      goal: 'Добавьте в начало CSS правило :root с переменными: --color-primary: #1f5fa8; --color-primary-dark: #174a84; --color-on-primary: #ffffff; --color-text: #1d2433; --color-surface: #f2f5fa. Замените все цвета в остальных правилах на var(…): HEX и rgb должны остаться только в :root (правило body из базовых стилей не трогайте). Внешне страница не должна измениться.',
      hints: [
        'Сначала соберите все разные цвета из CSS: их ровно пять. Каждому — переменная по роли.',
        'Замена по одному: background: #1f5fa8; → background: var(--color-primary);',
        'Белый текст на синем — var(--color-on-primary), тёмный текст — var(--color-text).',
        'В конце найдите поиском «#»: HEX-коды остаются только в :root и в body.'
      ],
      html: `<header class="header">
  <p class="logo">Робокружок</p>
  <nav class="nav" aria-label="Главное меню">
    <a href="#about">О кружке</a>
    <a href="#signup">Запись</a>
  </nav>
</header>
<section class="hero">
  <h1>Соберите своего первого робота</h1>
  <p>Занятия по вторникам и четвергам в мастерской 112. Детали и ноутбуки выдаём.</p>
  <a class="btn" href="#signup">Записаться в кружок</a>
</section>
<footer class="footer">
  <p>Вопросы — <a href="mailto:robo@college.ru">robo@college.ru</a></p>
</footer>`,
      css: `${BASE}
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #1f5fa8; }
.logo { margin: 0; color: #ffffff; font-weight: bold; }
.nav { display: flex; gap: 16px; }
.nav a { color: #ffffff; }
.hero { padding: 32px 24px; background: #f2f5fa; }
.hero h1 { margin: 0 0 16px; color: #1d2433; }
.hero p { color: #1d2433; }
.btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background: #1f5fa8; color: #ffffff; text-decoration: none; }
.btn:hover { background: #174a84; }
.footer { padding: 16px 24px; border-top: 4px solid #1f5fa8; color: #1d2433; }
.footer a { color: #1f5fa8; }`,
      tests: [
        { name: 'В :root объявлены пять переменных палитры', check: h => { const bad = mismatch(h, { '--color-primary': '#1f5fa8', '--color-primary-dark': '#174a84', '--color-on-primary': '#ffffff', '--color-text': '#1d2433', '--color-surface': '#f2f5fa' }); return (!bad.length && !!h.rules.find(r => r.selector === ':root')) || `не так или нет: ${bad.join(', ')}`; } },
        { name: 'Вне :root и body нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } },
        { name: '#1f5fa8 встречается в CSS один раз', check: h => h.occurrences('#1f5fa8') === 1 || `сейчас ${h.occurrences('#1f5fa8')} раз` },
        { name: 'var(--color-primary) используется хотя бы 4 раза', check: h => h.occurrences('var(--color-primary)') >= 4 || `сейчас ${h.occurrences('var(--color-primary)')}` },
        { name: 'Наведение на кнопку берёт var(--color-primary-dark)', check: h => /var\(\s*--color-primary-dark\s*\)/.test(ruleProp(h, '.btn:hover', 'background-color') || ruleProp(h, '.btn:hover', 'background')) || 'в .btn:hover нужен var(--color-primary-dark)' },
        { name: 'Страница выглядит как раньше', check: h => (h.cs('.header', 'background-color') === rgb('#1f5fa8') && h.cs('.nav a', 'color') === rgb('#ffffff') && h.cs('.hero', 'background-color') === rgb('#f2f5fa') && h.cs('.hero h1', 'color') === rgb('#1d2433') && h.cs('.btn', 'background-color') === rgb('#1f5fa8') && h.cs('.footer', 'border-top-color') === rgb('#1f5fa8') && h.cs('.footer a', 'color') === rgb('#1f5fa8')) || 'какой-то цвет изменился или переменная не находится' }
      ]
    }
  );
})();
