/* Занятие 40. Практическая работа №9 (ч. 1). Эскизы веб-приложения */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const nums = s => (s.match(/[\d.]+/g) || []).map(Number);
  // Эскиз — только в оттенках серого: у цвета r = g = b. Возвращает первый «цветной» элемент или null
  const colored = h => {
    for (const e of h.$$('body, body *')) {
      const s = h.win.getComputedStyle(e);
      const list = [['фон', s.backgroundColor], ['цвет текста', s.color]];
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(s[`border${side}Width`]) > 0 && s[`border${side}Style`] !== 'none') list.push(['рамка', s[`border${side}Color`]]);
      for (const [what, c] of list) {
        const [r, g, b, a] = nums(c);
        if (a === 0) continue;
        if (r !== g || g !== b) return `${what} у <${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''}>: ${c}`;
      }
    }
    return null;
  };
  // Элементы стоят в одну строку: их вертикальные полосы пересекаются
  const oneRow = (h, sels) => {
    const r = sels.map(s => h.rect(s)); if (r.some(x => !x)) return false;
    return Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom));
  };
  const leftToRight = (h, sels) => sels.every((s, i) => i === 0 || h.rect(sels[i - 1]).right <= h.rect(s).left + 1);
  // Все отступы в CSS (padding, margin, gap) в пикселях кратны 8
  const off8 = h => {
    for (const r of h.rules) for (let i = 0; i < r.style.length; i++) {
      const p = r.style[i];
      if (!/^(padding|margin|gap|row-gap|column-gap)/.test(p)) continue;
      const v = r.style.getPropertyValue(p);
      const bad = (v.match(/[\d.]+px/g) || []).find(x => parseFloat(x) % 8 !== 0);
      if (bad) return `${r.selector} { ${p}: ${v} }`;
    }
    return null;
  };
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
  --wf-bg: #f5f5f5;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4001', lesson: 'mdk-40', module: 'mdk4', mech: 'build',
      title: 'Эскиз главной: шапка, поиск, подвал', level: 'Среднее', minutes: 25, points: 150,
      story: 'Вы проектируете веб-приложение «Библиотека колледжа». Эскиз на бумаге готов, теперь переносим его в браузер серыми блоками: без цветов и красоты, зато с правильной структурой.',
      goal: 'Сверстайте каркас страницы. 1) header: блок-логотип .logo с текстом «ЛОГО», меню nav со списком ul из четырёх ссылок (Каталог, Новинки, Мероприятия, Контакты) и ссылка-кнопка a.login «Войти»; всё в одну строку: логотип слева, меню посередине, «Войти» справа. Фон шапки var(--wf-light), отступ padding кратен 8 (например, 16px 24px). 2) main: заголовок h1 «Найдите книгу в библиотеке колледжа» и форма form.search: подпись label, поле input type="search" и кнопка «Найти» в одну строку. 3) footer с абзацем «Библиотека колледжа · корпус 1, этаж 2». Это эскиз, поэтому все цвета — только серые (ссылки тоже!): берите их из переменных --wf-….',
      hints: [
        'Шапка: <header class="header"><div class="logo">ЛОГО</div><nav>…</nav><a class="login" href="#login">Войти</a></header>. В CSS: .header { display: flex; justify-content: space-between; align-items: center; }',
        'Меню в строку: nav ul { display: flex; gap: 24px; margin: 0; padding: 0; list-style: none; }',
        'Ссылки по умолчанию синие — для эскиза перекрасьте их: a { color: var(--wf-dark); }',
        'Форма: <form class="search"><label for="q">Книга или автор</label><input id="q" type="search"><button type="submit">Найти</button></form> и .search { display: flex; gap: 8px; align-items: center; }'
      ],
      html: `<!-- 1. Шапка: логотип, меню из четырёх ссылок, «Войти» -->

<main>
  <!-- 2. Заголовок h1 и форма поиска -->
</main>

<!-- 3. Подвал -->
`,
      css: `${BASE}
${WF}`,
      tests: [
        { name: 'В шапке есть .logo, nav со списком из 4 ссылок и a.login', check: h => h.count('header .logo') === 1 && h.count('header nav ul li a') === 4 && h.count('header a.login') === 1 || `ссылок в меню: ${h.count('header nav ul li a')}, .logo: ${h.count('header .logo')}, a.login: ${h.count('header a.login')}` },
        { name: 'Шапка в одну строку: логотип, меню, «Войти» слева направо', check: h => h.$('header nav') && oneRow(h, ['header .logo', 'header nav', 'header .login']) && leftToRight(h, ['header .logo', 'header nav', 'header .login']) || 'сделайте шапку флекс-контейнером' },
        { name: 'Фон шапки var(--wf-light), отступ кратен 8', check: h => { const p = h.px('header', 'padding-top'); return h.cs('header', 'background-color') === rgb('#e0e0e0') && p > 0 && p % 8 === 0 || `фон ${h.cs('header', 'background-color')}, padding-top ${p}px`; } },
        { name: 'В main один h1 и форма поиска с полем type="search" и кнопкой', check: h => h.count('main h1') === 1 && h.count('h1') === 1 && !!h.$('main form.search input[type="search"]') && !!h.$('main form.search button') || 'нужны h1 и form.search с input type="search" и button внутри main' },
        { name: 'Подпись, поле и кнопка поиска в одну строку', check: h => h.$('form.search label') && h.$('form.search button') && oneRow(h, ['form.search label', 'form.search input', 'form.search button']) || 'сделайте форму флекс-контейнером' },
        { name: 'Подвал footer после main', check: h => h.count('footer') === 1 && h.before('main', 'footer') && h.text('footer').length > 3 || 'добавьте footer с текстом после main' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } }
      ]
    },
    {
      id: 'k4002', lesson: 'mdk-40', module: 'mdk4', mech: 'build',
      title: 'Эскиз контента: карточки и шаги', level: 'Среднее', minutes: 25, points: 150,
      story: 'Шапка эскиза готова. Теперь главная часть: блок новых книг и короткая инструкция «Как взять книгу». Вместо обложек — серые заглушки, как на бумажном эскизе.',
      goal: 'Внутри main после h1 добавьте два раздела section. Первый: h2 «Новые поступления» и блок .cards с тремя карточками article.card; в каждой — заглушка обложки div.ph с текстом «Обложка», заголовок h3 и абзац p. Карточки стоят в один ряд одинаковой ширины (сетка grid на 3 колонки), расстояние gap кратно 8. Заглушка: высота 160px, фон var(--wf-mid), пунктирная рамка 2px dashed var(--wf-dark). Второй раздел: h2 «Как взять книгу» и нумерованный список ol.steps из трёх шагов, шаги стоят в ряд. Цвета — только серые.',
      hints: [
        'Карточка: <article class="card"><div class="ph">Обложка</div><h3>Название книги</h3><p>Автор</p></article>. Сделайте три таких.',
        'Сетка: .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }',
        'Заглушка: .ph { height: 160px; background-color: var(--wf-mid); border: 2px dashed var(--wf-dark); }',
        'Шаги в ряд: .steps { display: flex; gap: 16px; }'
      ],
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav>
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
</header>
<main>
  <h1>Найдите книгу в библиотеке колледжа</h1>
  <!-- Раздел 1: h2 «Новые поступления» и три карточки -->

  <!-- Раздел 2: h2 «Как взять книгу» и список из трёх шагов -->

</main>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}`,
      tests: [
        { name: 'Два раздела section с заголовками h2 внутри main', check: h => h.count('main section') === 2 && h.$$('main section').every(s => s.querySelector('h2')) || `разделов с h2: ${h.$$('main section').filter(s => s.querySelector('h2')).length}` },
        { name: 'Три карточки article.card: заглушка .ph, h3 и p', check: h => h.count('.cards article.card') === 3 && h.$$('.card').every(c => c.querySelector('.ph') && c.querySelector('h3') && c.querySelector('p')) || `карточек: ${h.count('.cards article.card')}; в каждой нужны .ph, h3, p` },
        { name: 'Карточки в один ряд, одинаковой ширины', check: h => { const c = h.$$('.card'); if (c.length !== 3) return 'нужно три карточки'; const w = c.map(e => h.rect(e).width); return h.sameRow(c) && Math.max(...w) - Math.min(...w) < 2 || 'сделайте .cards сеткой на 3 колонки'; } },
        { name: 'Расстояние между карточками кратно 8', check: h => { const g = h.px('.cards', 'column-gap'); return g > 0 && g % 8 === 0 || `сейчас gap ${isNaN(g) ? 'не задан' : g + 'px'}`; } },
        { name: 'Заглушка: высота 160px, серый фон, пунктирная рамка', check: h => h.$$('.ph').length === 3 && h.$$('.ph').every(e => Math.abs(h.px(e, 'height') - 160) < 1.5 && h.cs(e, 'background-color') === rgb('#bdbdbd') && h.cs(e, 'border-top-style') === 'dashed') || 'у .ph height: 160px, фон var(--wf-mid), border: 2px dashed' },
        { name: 'Список ol.steps из трёх шагов в ряд', check: h => h.count('ol.steps > li') === 3 && h.sameRow(h.$$('ol.steps > li')) || 'нужен ol.steps с тремя li в ряд' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } }
      ]
    },
    {
      id: 'k4003', lesson: 'mdk-40', module: 'mdk4', mech: 'fix',
      title: 'Наведите порядок в чужом эскизе', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник сверстал эскиз электронной библиотеки, но сделал его цветным, на одних div и с отступами «на глаз». Преподаватель такой эскиз не примет. Приведите его в порядок.',
      goal: 'Исправьте эскиз. 1) Семантика: div.top → header, div.menu → nav, div.content → main, div.bottom → footer, div.title → h1, h4 → h2 (классы можно оставить). 2) Цвета: только серые — используйте переменные --wf-… из :root, ссылки тоже серые. 3) Отступы: все значения padding, margin и gap в CSS кратны 8 (0, 8, 16, 24, 32…). 4) Баннер .banner — заглушка с пунктирной рамкой (border-style: dashed). 5) Три подборки по-прежнему стоят в один ряд.',
      hints: [
        'Меняйте и открывающий, и закрывающий тег: <div class="top">…</div> → <header class="top">…</header>.',
        'Цветные фоны замените: #4caf50 → var(--wf-light), #2196f3 → var(--wf-mid) и так далее. Белый текст на светло-сером не прочитать — поменяйте его на var(--wf-dark) или #222222.',
        'Отступы округлите до ближайшего кратного 8: 13px → 16px, 21px → 24px, 15px → 16px, 10px → 8px, 30px → 32px, 20px → 24px, 12px → 16px.',
        'Баннер: border: 2px dashed var(--wf-dark);'
      ],
      html: `<div class="top">
  <div class="logo">ЛОГО</div>
  <div class="menu">
    <a href="#catalog">Каталог</a>
    <a href="#events">Мероприятия</a>
    <a href="#rules">Правила</a>
  </div>
</div>
<div class="content">
  <div class="title">Электронная библиотека колледжа</div>
  <div class="banner">Баннер: книга недели</div>
  <h4>Подборки</h4>
  <div class="grid">
    <div class="item">Подборка 1</div>
    <div class="item">Подборка 2</div>
    <div class="item">Подборка 3</div>
  </div>
</div>
<div class="bottom">Контакты библиотеки</div>`,
      css: `${BASE}
${WF}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 21px;
  background-color: #4caf50;
}
.menu {
  display: flex;
  gap: 15px;
}
.menu a {
  color: #ffffff;
}
.title {
  margin: 20px 0;
  font-size: 32px;
  font-weight: bold;
}
.banner {
  height: 120px;
  padding: 10px;
  background-color: #ff9800;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.item {
  padding: 30px;
  background-color: #2196f3;
  color: #ffffff;
}
.bottom {
  margin-top: 20px;
  padding: 12px;
  background-color: #9c27b0;
  color: #ffffff;
}`,
      tests: [
        { name: 'Семантика: header с nav, main, footer — по одному', check: h => ['header', 'main', 'footer'].every(s => h.count(s) === 1) && h.count('header nav') === 1 && h.count('div.top, div.menu, div.content, div.bottom') === 0 || 'замените div.top, div.menu, div.content, div.bottom на семантические теги' },
        { name: 'Заголовки: h1 «Электронная библиотека колледжа» и h2 «Подборки»', check: h => h.count('h1') === 1 && h.text('h1') === 'Электронная библиотека колледжа' && h.count('h4') === 0 && h.text('h2') === 'Подборки' || 'div.title → h1, h4 → h2' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } },
        { name: 'Все padding, margin и gap кратны 8', check: h => { const b = off8(h); return !b || `не кратно 8: ${b}`; } },
        { name: 'Баннер — заглушка с пунктирной рамкой', check: h => h.cs('.banner', 'border-top-style') === 'dashed' && h.px('.banner', 'border-top-width') > 0 || 'добавьте .banner рамку dashed' },
        { name: 'Три подборки в один ряд', check: h => h.count('.item') === 3 && h.sameRow(h.$$('.item')) || 'подборки должны стоять в ряд' }
      ]
    }
  );
})();
