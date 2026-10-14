/* Занятие 37. Физическое проектирование: макет и модульная сетка */
(() => {
  const { BASE } = window.COURSE_KIT;
  const parse = s => { const m = (s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] }; };
  const grey = c => !c || c.a === 0 || (c.r === c.g && c.g === c.b);
  const ownGrey = (h, el) => { const c = parse(h.cs(el, 'background-color')); return !!c && c.a > 0 && grey(c) && c.r < 255; };
  // Сетка: ширина колонки по ширине контейнера, числу колонок и гаттеру
  const inner = (h, sel) => h.rect(sel).width - h.px(sel, 'padding-left') - h.px(sel, 'padding-right');
  const span = (h, n) => { const g = h.px('.page', 'column-gap'), cols = h.cs('.page', 'grid-template-columns').split(' ').filter(Boolean).length; const c = (inner(h, '.page') - (cols - 1) * g) / cols; return n * c + (n - 1) * g; };
  const near = (a, b) => Math.abs(a - b) <= 1.5;
  const tracks = h => h.cs('.page', 'grid-template-columns').split(' ').filter(Boolean);
  const SPACING = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'row-gap', 'column-gap'];
  const offGrid = h => {
    for (const r of h.rules) for (const p of SPACING) {
      const v = r.style.getPropertyValue(p).trim();
      if (!v || v === 'auto' || v === '0' || v === 'normal') continue;
      const m = v.match(/^(-?\d+(?:\.\d+)?)px$/);
      if (!m) return `${r.selector} { ${p}: ${v} } — пишите отступы в px`;
      if (+m[1] % 8) return `${r.selector} { ${p}: ${v} } — не кратно 8`;
    }
    return true;
  };
  const GRID_HTML = `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <aside class="block side">Боковая колонка</aside>
  <section class="block content">Основной текст</section>
  <footer class="block footer">Подвал</footer>
</div>`;

  window.COURSE_TASKS.push(
    {
      id: 'k3701', lesson: 'mdk-37', module: 'mdk4', mech: 'build',
      title: 'Wireframe главной страницы', level: 'Среднее', minutes: 20, points: 150,
      story: 'Перед макетом в цвете покажем заказчику — секции «Шахматы» при колледже — прототип главной страницы серыми блоками. Никакого цвета: обсуждаем только, что где стоит.',
      goal: 'Сверстайте wireframe с правильной семантикой. 1) header: блок с классом logo с текстом «Логотип» и навигация nav минимум из трёх ссылок — в один ряд. 2) main: section с классом hero (заголовок h1, абзац p и ссылка-кнопка с классом button) и section с классом features (заголовок h2 и три article в ряд, в каждом h3 и p). 3) footer с текстом. У header, .hero, у каждого article и у footer свой серый фон (не белый). На всей странице только оттенки серого: и у текста, и у фонов, и у ссылок — никаких синих ссылок по умолчанию.',
      hints: [
        'Серый — это цвет, где все три канала одинаковые: #eeeeee, #d9d9d9, #555555, #222222.',
        'Ссылки по умолчанию синие. Перекрасьте их: a { color: #222222; }. Кнопке задайте тёмно-серый фон и белый текст.',
        'В ряд: header { display: flex; justify-content: space-between; align-items: center; } и nav { display: flex; gap: 16px; }.',
        'Три карточки: .features-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } — оберните article в div с этим классом.'
      ],
      html: `<!-- header: .logo и nav
     main: section.hero (h1, p, a.button) и section.features (h2 и три article)
     footer -->
`,
      css: `${BASE}
/* Wireframe: только оттенки серого.
   Палитра: #222222 текст, #555555 кнопка, #d9d9d9 блоки, #eeeeee фон секций */
`,
      tests: [
        { name: 'В header есть .logo и nav минимум из трёх ссылок', check: h => !!h.$('header .logo')?.textContent.trim() && h.count('header nav a[href]') >= 3 || 'нужны header, внутри .logo и nav с тремя ссылками' },
        { name: 'В main есть section.hero с h1, p и a.button', check: h => !!(h.$('main section.hero h1') && h.$('main section.hero p') && h.$('main section.hero a.button')?.textContent.trim()) || 'в main > section.hero нужны h1, p и a.button' },
        { name: 'В section.features есть h2 и три article с h3 и p', check: h => { const a = h.$$('main section.features article'); return !!h.$('section.features h2') && a.length === 3 && a.every(x => x.querySelector('h3') && x.querySelector('p')) || `article в .features: ${a.length}, в каждом нужны h3 и p`; } },
        { name: 'Есть footer с текстом', check: h => !!h.$('footer')?.textContent.trim() || 'нет footer' },
        { name: 'У header, .hero, каждого article и footer свой серый фон', check: h => { const els = ['header', '.hero', 'footer'].map(s => h.$(s)).concat(h.$$('.features article')); const bad = els.find(e => !e || !ownGrey(h, e)); return !bad || `нет серого фона у ${bad ? bad.tagName.toLowerCase() + (bad.className ? '.' + bad.className : '') : 'блока'}`; } },
        { name: 'Только оттенки серого — ни одного цветного текста или фона', check: h => {
          for (const e of h.$$('body, body *')) {
            for (const p of ['color', 'background-color']) if (!grey(parse(h.cs(e, p)))) return `<${e.tagName.toLowerCase()}> ${p}: ${h.cs(e, p)}`;
          }
          return true;
        } },
        { name: 'Логотип и меню в одном ряду, три карточки в ряд', check: h => {
          if (!h.$('header .logo') || !h.$('header nav')) return 'нет .logo или nav';
          const lt = h.rect('header .logo'), nt = h.rect('header nav');
          if (!(nt.left > lt.right && nt.top < lt.bottom && nt.bottom > lt.top)) return 'логотип и меню должны стоять в один ряд';
          const a = h.$$('.features article'); return a.length === 3 && h.sameRow(a) || 'карточки не в один ряд';
        } }
      ]
    },
    {
      id: 'k3702', lesson: 'mdk-37', module: 'mdk4', mech: 'build',
      title: 'Модульная сетка 12 колонок', level: 'Сложное', minutes: 25, points: 200,
      story: 'Дизайнер нарисовал макет по сетке из 12 колонок с гаттерами 24px и полями 24px. Перенесём эту сетку в CSS Grid так, чтобы блоки встали ровно по колонкам.',
      goal: 'Сделайте .page сеткой из 12 одинаковых колонок (grid-template-columns: repeat(12, 1fr)) с гаттером column-gap 24px. Контейнер: max-width 1200px, по центру (margin: 0 auto), поля слева и справа — padding 24px. Расставьте блоки через grid-column: шапка, первый экран и подвал занимают все 12 колонок; три карточки — по 4 колонки и стоят в один ряд; боковая колонка — 3 колонки, основной текст — 9, рядом друг с другом.',
      hints: [
        'Сетка: .page { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 24px; }.',
        'Контейнер с полями: max-width: 1200px; margin: 0 auto; padding: 0 24px.',
        'Сколько колонок занять: .card { grid-column: span 4; }, .side { grid-column: span 3; }, .content { grid-column: span 9; }.',
        'Во всю ширину: .header, .hero, .footer { grid-column: 1 / -1; } — от первой линии сетки до последней.'
      ],
      html: GRID_HTML,
      css: `${BASE}
/* Сетка: 12 колонок, гаттер 24px, поля 24px */

.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.hero { min-height: 160px; }
.card { min-height: 120px; }
.content { min-height: 200px; }`,
      tests: [
        { name: '.page — сетка из 12 одинаковых колонок', check: h => { if (h.cs('.page', 'display') !== 'grid') return 'у .page нет display: grid'; const t = tracks(h).map(parseFloat); return t.length === 12 && Math.max(...t) - Math.min(...t) < 0.5 || `колонок: ${t.length}`; } },
        { name: 'Гаттер 24px', check: h => h.px('.page', 'column-gap') === 24 || `column-gap: ${h.cs('.page', 'column-gap')}` },
        { name: 'Контейнер: max-width 1200px, поля по 24px', check: h => h.cs('.page', 'max-width') === '1200px' && h.px('.page', 'padding-left') === 24 && h.px('.page', 'padding-right') === 24 || 'нужны max-width: 1200px и padding: 0 24px' },
        { name: 'Шапка, первый экран и подвал — во все 12 колонок', check: h => { const w = inner(h, '.page'); const bad = ['.header', '.hero', '.footer'].find(s => !near(h.rect(s).width, w)); return !bad || `${bad} занимает не всю ширину сетки`; } },
        { name: 'Три карточки по 4 колонки в один ряд', check: h => { const c = h.$$('.card'); if (!h.sameRow(c)) return 'карточки не в один ряд'; const w = span(h, 4); return c.every(x => near(x.getBoundingClientRect().width, w)) || `ширина карточки ${Math.round(c[0].getBoundingClientRect().width)}px, а 4 колонки — ${Math.round(w)}px`; } },
        { name: 'Боковая колонка — 3 колонки, основной текст — 9, рядом', check: h => {
          if (!h.sameRow(['.side', '.content'])) return 'боковая колонка и текст должны стоять рядом';
          if (!near(h.rect('.side').width, span(h, 3))) return `.side: ${Math.round(h.rect('.side').width)}px, а 3 колонки — ${Math.round(span(h, 3))}px`;
          return near(h.rect('.content').width, span(h, 9)) || `.content: ${Math.round(h.rect('.content').width)}px, а 9 колонок — ${Math.round(span(h, 9))}px`;
        } }
      ]
    },
    {
      id: 'k3703', lesson: 'mdk-37', module: 'mdk4', mech: 'adaptive',
      title: 'Шаг 8 и сетка на телефоне', level: 'Среднее', minutes: 15, points: 150,
      story: 'Верстальщик перенёс сетку, но отступы взял «на глаз»: 13, 15, 20, 30 пикселей. А на телефоне карточки по 4 колонки из 12 превратились в узкие полоски. Приведём всё к системе.',
      goal: 'Исправьте CSS. Все отступы на странице — margin, padding и gap — кратны 8 (0, 8, 16, 24, 32…). На компьютере сетка остаётся 12-колоночной, карточки по-прежнему стоят по три в ряд. На телефоне 360px сетка из 4 колонок, все блоки во всю ширину, карточки стоят друг под другом, горизонтальной прокрутки нет.',
      hints: [
        'Пройдитесь по каждому числу в px: 13 → 16, 15 → 16, 20 → 24, 30 → 32, 5 → 8, 10 → 8.',
        'Блоки во всю ширину при любом числе колонок: grid-column: 1 / -1. А вот span 12 в сетке из 4 колонок создаст лишние колонки и прокрутку.',
        'Mobile first: в .page — grid-template-columns: repeat(4, 1fr), у .card — grid-column: 1 / -1. В @media (min-width: 768px) — repeat(12, 1fr) и .card { grid-column: span 4; }.'
      ],
      html: `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <footer class="block footer">Подвал</footer>
</div>`,
      css: `${BASE}
.page {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  padding: 0 15px;
}
.block {
  padding: 13px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .footer { grid-column: span 12; }
.hero { min-height: 160px; padding: 30px; }
.card { grid-column: span 4; min-height: 120px; margin-bottom: 5px; }
.footer { margin-top: 10px; }`,
      tests: [
        { name: 'Все margin, padding и gap кратны 8', check: offGrid },
        { name: 'На компьютере 12 колонок и три карточки в ряд', check: h => tracks(h).length === 12 && h.sameRow(h.$$('.card')) || `колонок: ${tracks(h).length}, карточки должны стоять в ряд` },
        { at: 360, name: 'На телефоне сетка из 4 колонок', check: h => tracks(h).length === 4 || `колонок на телефоне: ${tracks(h).length}` },
        { at: 360, name: 'На телефоне карточки друг под другом во всю ширину', check: h => {
          const c = h.$$('.card'), w = inner(h, '.page');
          if (c[1].getBoundingClientRect().top < c[0].getBoundingClientRect().bottom - 1) return 'карточки должны стоять столбиком';
          return c.every(x => near(x.getBoundingClientRect().width, w)) || 'карточки не во всю ширину сетки';
        } },
        { at: 360, name: 'На телефоне нет горизонтальной прокрутки', check: h => !h.overflow() || 'есть прокрутка: span 12 в сетке из 4 колонок добавляет лишние колонки' }
      ]
    }
  );
})();
