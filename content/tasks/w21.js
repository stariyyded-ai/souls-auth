/* Занятие 21. ЛР11. Перенос макета в код: шаблон страниц, общие стили */
(() => {
  const { rgb, near } = window.COURSE_KIT;
  const varOf = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  const VARS = [['--color-primary', '#0f766e'], ['--color-primary-dark', '#115e59'], ['--color-on-primary', '#ffffff'], ['--color-bg', '#f8fafc'],
    ['--color-surface', '#ffffff'], ['--color-text', '#0f172a'], ['--color-muted', '#64748b'], ['--color-border', '#cbd5e1']];
  const STYLE_ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --radius: 12px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
h1, h2 { margin: 0 0 var(--space-2); line-height: 1.2; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w2101', lesson: 'm9-lr11', module: 'mdk93', mech: 'optimize', title: 'Стайл-гайд в переменных', level: 'Среднее', minutes: 25, points: 150,
      story: 'Заказчик «ЧистоДома» уже дважды просил «чуть другой бирюзовый». Сейчас цвет вписан в CSS в четырёх местах, и каждый раз его ищут по всему файлу. Перенесём стайл-гайд в CSS-переменные — тогда перекраска портала займёт одну строку.',
      goal: 'В начале CSS объявите в :root переменные: --color-primary #0f766e, --color-primary-dark #115e59, --color-on-primary #ffffff, --color-bg #f8fafc, --color-surface #ffffff, --color-text #0f172a, --color-muted #64748b, --color-border #cbd5e1, --radius 12px, --space-2 16px, --space-3 24px. Во всех остальных правилах замените цвета, радиусы и отступы 16px/24px на var(…): вне :root в CSS не должно остаться ни одного #цвета. Внешний вид страницы не меняется.',
      hints: [
        ':root { --color-primary: #0f766e; --color-primary-dark: #115e59; … } — переменная начинается с двух дефисов.',
        'Использование: .btn { background: var(--color-primary); color: var(--color-on-primary); border-radius: var(--radius); }',
        'Белый фон карточки — var(--color-surface), белый текст на бирюзовом — var(--color-on-primary). Отступ 16px — var(--space-2), 24px — var(--space-3).',
        'Проверьте себя поиском по CSS: символ # должен встречаться только внутри :root.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Набор компонентов</h1>
  <p class="muted">Так выглядят кнопка и карточка во всех страницах портала.</p>
  <button class="btn" type="button">Создать заявку</button>
  <article class="card">
    <h2>Генеральная уборка</h2>
    <p class="muted">12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #0f766e; }
.header a { color: #ffffff; text-decoration: none; }
.nav { display: flex; gap: 16px; }
.page { padding: 24px 16px; }
.muted { color: #64748b; }
.btn { padding: 12px 24px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font: inherit; cursor: pointer; }
.btn:hover { background: #115e59; }
.card { margin-top: 24px; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.card h2 { margin: 0 0 8px; color: #0f766e; }`,
      tests: [
        { name: ':root: восемь цветов стайл-гайда', check: h => {
          for (const [n, v] of VARS) { const got = varOf(h, n); if (got !== v) return got ? `${n}: ${got}, нужно ${v}` : `нет переменной ${n}`; }
          return true;
        } },
        { name: ':root: --radius 12px, --space-2 16px, --space-3 24px', check: h => varOf(h, '--radius') === '12px' && varOf(h, '--space-2') === '16px' && varOf(h, '--space-3') === '24px' || 'объявите --radius, --space-2 и --space-3' },
        { name: 'Вне :root нет ни одного #цвета', check: h => {
          const rest = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
          const m = rest.match(/#[0-9a-f]{3,8}\b/i);
          return !m || `в правилах остался ${m[0]}: замените на var(…)`;
        } },
        { name: 'var(--color-primary) используется у шапки, кнопки и заголовка карточки', check: h => h.occurrences('var(--color-primary)') >= 3 || `var(--color-primary) встречается ${h.occurrences('var(--color-primary)')} раз(а), нужно не меньше 3` },
        { name: 'Радиусы и отступы тоже из переменных', check: h => h.occurrences('var(--radius)') >= 2 && h.occurrences('var(--space-2)') >= 2 && h.occurrences('var(--space-3)') >= 1 || 'замените 12px, 16px и 24px на var(--radius), var(--space-2), var(--space-3)' },
        { name: 'Внешний вид не изменился: шапка и кнопка #0f766e, фон #f8fafc, радиус 12px', check: h => {
          if (h.cs('.header', 'background-color') !== rgb('#0f766e')) return 'шапка не бирюзовая';
          if (h.cs('.btn', 'background-color') !== rgb('#0f766e')) return 'кнопка не бирюзовая';
          if (h.cs('body', 'background-color') !== rgb('#f8fafc')) return 'фон страницы изменился';
          return h.px('.card', 'border-top-left-radius') === 12 && h.px('.page', 'padding-left') === 16 || 'радиус карточки или отступ страницы изменились';
        } }
      ]
    },
    {
      id: 'w2102', lesson: 'm9-lr11', module: 'mdk93', mech: 'build', title: 'Кнопки и карточка — компоненты', level: 'Среднее', minutes: 30, points: 150,
      story: 'В style.css «ЧистоДома» уже есть переменные стайл-гайда. Теперь нужны детали конструктора: кнопка с двумя вариантами, карточка и контейнер страницы. Из них потом соберём все пять страниц портала.',
      goal: 'Используя переменные из :root, напишите: .page — width: 100%, max-width: 480px, по центру (margin: 0 auto), padding var(--space-3) var(--space-2). .btn — display: inline-flex, текст по центру (justify-content и align-items: center), min-height: 48px, padding 0 var(--space-3), без рамки, радиус var(--radius), фон var(--color-primary), белый текст, font: inherit, жирность 600, без подчёркивания. .btn:hover — фон var(--color-primary-dark). .btn--block — width: 100%. .btn--outline — прозрачный фон, рамка 2px solid var(--color-primary), текст var(--color-primary). .card — фон var(--color-surface), радиус var(--radius), тень var(--shadow), padding var(--space-2).',
      hints: [
        '.page { width: 100%; max-width: 480px; margin: 0 auto; padding: var(--space-3) var(--space-2); }',
        '.btn { display: inline-flex; justify-content: center; align-items: center; min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; text-decoration: none; cursor: pointer; }',
        'Модификаторы пишутся отдельными классами: .btn--block { width: 100%; } .btn--outline { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }',
        '.card { background: var(--color-surface); border-radius: var(--radius); box-shadow: var(--shadow); padding: var(--space-2); }'
      ],
      html: `<main class="page">
  <h1>Набор компонентов</h1>
  <p>Ссылка-кнопка и две кнопки формы:</p>
  <p>
    <a class="btn" href="#new">Новая заявка</a>
    <button class="btn btn--outline" type="button">Отмена</button>
  </p>
  <button class="btn btn--block" type="submit">Войти</button>
  <h2>Карточка</h2>
  <article class="card">
    <h3>Генеральная уборка</h3>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `${STYLE_ROOT}
/* Ниже — компоненты: .page, .btn, .btn:hover, .btn--block, .btn--outline, .card */
`,
      tests: [
        { name: '.page не шире 480px и стоит по центру', check: h => {
          const r = h.rect('.page');
          if (r.width > 481) return `ширина .page ${Math.round(r.width)}px`;
          return near(r.left, (h.width - r.width) / 2, 2) || 'контейнер не по центру: margin: 0 auto';
        } },
        { name: '.page: внутренние отступы 24px сверху и 16px по бокам', check: h => h.px('.page', 'padding-top') === 24 && h.px('.page', 'padding-left') === 16 || 'padding: var(--space-3) var(--space-2)' },
        { name: '.btn: inline-flex, текст по центру, высота не меньше 48px', check: h => {
          if (h.cs('a.btn', 'display') !== 'inline-flex') return `display: ${h.cs('a.btn', 'display')}`;
          if (h.cs('a.btn', 'justify-content') !== 'center' || h.cs('a.btn', 'align-items') !== 'center') return 'нужно justify-content и align-items: center';
          return h.$$('.btn').every(b => h.rect(b).height >= 47.5) || 'кнопки ниже 48px';
        } },
        { name: '.btn: бирюзовый фон, белый текст, без рамки, радиус 12px', check: h => {
          if (h.cs('a.btn', 'background-color') !== rgb('#0f766e')) return 'фон — var(--color-primary)';
          if (h.cs('a.btn', 'color') !== rgb('#ffffff')) return 'текст белый';
          if (h.px('.btn--block', 'border-top-width') !== 0) return 'у кнопки осталась рамка браузера: border: none';
          return h.px('a.btn', 'border-top-left-radius') === 12 || 'радиус — var(--radius)';
        } },
        { name: '.btn: шрифт страницы (font: inherit), ссылка без подчёркивания', check: h => {
          if (h.cs('button.btn', 'font-family') !== h.cs('body', 'font-family')) return 'у кнопки шрифт браузера: font: inherit';
          return h.cs('a.btn', 'text-decoration-line') === 'none' || 'уберите подчёркивание у ссылки-кнопки';
        } },
        { name: '.btn:hover — фон var(--color-primary-dark)', check: h => h.rules.some(r => /\.btn:hover/.test(r.selector) && /var\(--color-primary-dark\)/.test(r.style.cssText)) || 'нет правила .btn:hover с var(--color-primary-dark)' },
        { name: '.btn--block — на всю ширину контейнера', check: h => {
          const p = h.rect('.page'), inner = p.width - h.px('.page', 'padding-left') - h.px('.page', 'padding-right');
          return near(h.rect('.btn--block').width, inner, 1) || 'кнопка «Войти» должна быть шириной во весь контейнер';
        } },
        { name: '.btn--outline: прозрачный фон, рамка 2px и текст бирюзового цвета', check: h => {
          const s = '.btn--outline', bg = h.cs(s, 'background-color');
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return 'фон должен быть прозрачным';
          if (h.px(s, 'border-top-width') !== 2 || h.cs(s, 'border-top-color') !== rgb('#0f766e')) return 'рамка 2px solid var(--color-primary)';
          return h.cs(s, 'color') === rgb('#0f766e') || 'текст — var(--color-primary)';
        } },
        { name: '.card: белый фон, радиус 12px, отступ 16px, тень', check: h => {
          if (h.cs('.card', 'background-color') !== rgb('#ffffff')) return 'фон карточки белый';
          if (h.px('.card', 'border-top-left-radius') !== 12) return 'радиус 12px';
          if (h.px('.card', 'padding-left') !== 16) return 'padding 16px';
          return h.cs('.card', 'box-shadow') !== 'none' || 'нужна тень var(--shadow)';
        } },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
