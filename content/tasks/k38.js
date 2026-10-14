/* Занятие 38. Цвет в дизайне: цветовой круг и гармонии */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // значение CSS-переменной, объявленной в :root
  const cssVar = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  // CSS без комментариев — чтобы считать, сколько раз записан цвет
  const plain = h => h.css.replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();
  const times = (h, hex) => plain(h).split(hex.toLowerCase()).length - 1;
  const bg = (h, sel) => h.cs(sel, 'background-color');

  window.COURSE_TASKS.push(
    {
      id: 'k3801', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Палитра кофейни в переменных', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Кофейня «Зерно» заказала сайт. Дизайнер прислал палитру из четырёх цветов. Прежде чем верстать страницы, палитру записывают в CSS-переменные: тогда цвет меняется в одном месте, а не в сорока.',
      goal: 'В правиле :root уже объявлена переменная --color-bg. Добавьте ещё три: --color-surface: #e8d9c5, --color-text: #3b2a1e, --color-accent: #b5462a. Дальше пишите цвета только через var(): body — фон var(--color-bg) и цвет текста var(--color-text); каждый образец .swatch закрашен своим цветом (Фон, Карточки, Текст, Акцент); кнопка .btn — фон var(--color-accent) и белый текст. Каждый hex-код палитры должен встречаться в CSS ровно один раз — в :root. Текст на тёмных образцах сделайте светлым, чтобы его можно было прочитать.',
      hints: [
        'Переменная объявляется внутри :root так: --color-surface: #e8d9c5; — с двумя дефисами в начале имени.',
        'Использование: background-color: var(--color-surface); Скобки и два дефиса обязательны. Правило body уже есть в первой строке CSS — меняйте его, а не пишите второе.',
        'На тёмном образце «Текст» поставьте color: var(--color-bg), на «Акценте» — color: #ffffff.',
        'Проверьте поиском (Ctrl+F) в CSS: каждый hex палитры должен найтись один раз.'
      ],
      html: `<h1>Палитра кофейни «Зерно»</h1>
<ul class="palette">
  <li class="swatch swatch--bg">Фон</li>
  <li class="swatch swatch--surface">Карточки</li>
  <li class="swatch swatch--text">Текст</li>
  <li class="swatch swatch--accent">Акцент</li>
</ul>
<button class="btn" type="button">Заказать кофе</button>`,
      css: `${BASE}
:root {
  --color-bg: #faf6f0;
  /* добавьте ещё три переменные палитры */
}
.palette {
  display: flex;
  gap: 16px;
  padding: 0;
  list-style: none;
}
.swatch {
  width: 120px;
  height: 120px;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
}`,
      tests: [
        { name: 'В :root объявлены четыре переменные палитры с нужными цветами', check: h => {
          const want = { '--color-bg': '#faf6f0', '--color-surface': '#e8d9c5', '--color-text': '#3b2a1e', '--color-accent': '#b5462a' };
          const bad = Object.keys(want).filter(k => cssVar(h, k) !== want[k]);
          return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Страница: фон и цвет текста из переменных', check: h => bg(h, 'body') === rgb('#faf6f0') && h.cs('body', 'color') === rgb('#3b2a1e') && /body\s*\{[^}]*var\(--color-bg\)[^}]*\}/.test(plain(h)) || 'у body фон var(--color-bg) и color var(--color-text)' },
        { name: 'Каждый образец закрашен своим цветом', check: h => {
          const pairs = [['.swatch--bg', '#faf6f0'], ['.swatch--surface', '#e8d9c5'], ['.swatch--text', '#3b2a1e'], ['.swatch--accent', '#b5462a']];
          const bad = pairs.filter(([s, c]) => bg(h, s) !== rgb(c)).map(([s]) => s);
          return !bad.length || `не закрашены: ${bad.join(', ')}`; } },
        { name: 'Кнопка: акцентный фон и белый текст', check: h => bg(h, '.btn') === rgb('#b5462a') && h.cs('.btn', 'color') === rgb('#ffffff') || 'фон .btn — var(--color-accent), color — #ffffff' },
        { name: 'Каждый цвет палитры записан в CSS один раз', check: h => {
          const many = ['#faf6f0', '#e8d9c5', '#3b2a1e', '#b5462a'].filter(c => times(h, c) !== 1);
          return !many.length || `встречается не один раз: ${many.join(', ')}`; } },
        { name: 'Подписи на тёмных образцах читаются (контраст 4,5:1)', check: h => ['.swatch--text', '.swatch--accent'].every(s => h.contrast(s) >= 4.5) || 'сделайте текст на тёмных образцах светлым' }
      ]
    },
    {
      id: 'k3802', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Правило 60-30-10 для фитнес-клуба', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Страница фитнес-клуба «Пульс» свёрстана, но вся чёрно-белая. Палитра уже лежит в переменных. Раскрасьте страницу по правилу 60-30-10, чтобы глаз сразу находил кнопку записи.',
      goal: 'Используйте переменные из :root. 60% — основной светлый цвет: фон body — var(--color-main). 30% — дополнительный: шапка header и подвал footer с фоном var(--color-second) и белым текстом (#ffffff), у карточек .card белый фон (#ffffff) и верхняя полоса border-top: 4px solid var(--color-second). 10% — акцент: им закрашена только кнопка .btn (фон var(--color-accent), текст тёмный #1a1a1a, чтобы контраст был не меньше 4,5:1). Больше нигде акцентный цвет не используйте: ни в тексте, ни в рамках, ни в фонах.',
      hints: [
        'Начните с body. Правило body уже есть в первой строке CSS — поменяйте в нём background на var(--color-main), второе правило body не создавайте.',
        'Шапка и подвал: одно правило на два селектора — header, footer { background-color: var(--color-second); color: #ffffff; }',
        'Карточка: background-color: #ffffff; border-top: 4px solid var(--color-second);',
        'Белый текст на оранжевой кнопке не проходит по контрасту — поэтому текст кнопки тёмный: color: #1a1a1a.'
      ],
      html: `<header class="header">
  <p class="logo">Пульс</p>
</header>
<main>
  <section class="hero">
    <h1>Фитнес-клуб у колледжа</h1>
    <p>Тренажёрный зал, йога и бассейн. Студентам — скидка 20%.</p>
    <a class="btn" href="#signup">Записаться на пробное</a>
  </section>
  <section class="cards">
    <h2>Направления</h2>
    <article class="card"><h3>Тренажёрный зал</h3><p>С тренером или самостоятельно.</p></article>
    <article class="card"><h3>Йога</h3><p>Утренние и вечерние группы.</p></article>
    <article class="card"><h3>Бассейн</h3><p>Дорожка 25 метров.</p></article>
  </section>
</main>
<footer class="footer">
  <p>Пульс · ул. Студенческая, 5</p>
</footer>`,
      css: `${BASE}
:root {
  --color-main: #f4f7f6;
  --color-second: #1f4e5f;
  --color-accent: #ff7a3d;
}
.header,
.footer {
  padding: 16px 24px;
}
.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
.hero,
.cards {
  padding: 24px;
}
.card {
  margin-bottom: 16px;
  padding: 16px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}`,
      tests: [
        { name: '60%: фон страницы — основной цвет', check: h => bg(h, 'body') === rgb('#f4f7f6') || 'у body фон var(--color-main)' },
        { name: '30%: шапка и подвал дополнительного цвета с белым текстом', check: h => ['header', 'footer'].every(s => bg(h, s) === rgb('#1f4e5f') && h.cs(s, 'color') === rgb('#ffffff')) || 'header и footer: фон var(--color-second), color #ffffff' },
        { name: 'Карточки белые с полосой 4px дополнительного цвета сверху', check: h => h.$$('.card').every(c => bg(h, c) === rgb('#ffffff') && h.cs(c, 'border-top-color') === rgb('#1f4e5f') && h.px(c, 'border-top-width') === 4 && h.cs(c, 'border-top-style') === 'solid') || 'у .card белый фон и border-top: 4px solid var(--color-second)' },
        { name: '10%: кнопка акцентного цвета с тёмным текстом', check: h => bg(h, '.btn') === rgb('#ff7a3d') && h.cs('.btn', 'color') === rgb('#1a1a1a') || 'у .btn фон var(--color-accent) и color #1a1a1a' },
        { name: 'Акцент используется только на кнопке', check: h => {
          const acc = rgb('#ff7a3d');
          const other = h.$$('body, body *').filter(e => !e.matches('.btn')).find(e => { const s = h.win.getComputedStyle(e); return [s.backgroundColor, s.color, s.borderTopColor, s.borderBottomColor, s.borderLeftColor].includes(acc); });
          return !other || `акцент найден у <${other.tagName.toLowerCase()}${other.className ? '.' + other.className : ''}>`; } }
      ]
    },
    {
      id: 'k3803', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Разложите цвета по гармониям', level: 'Среднее', minutes: 20, points: 150,
      story: 'Дизайнер собрал девять цветов для трёх промо-баннеров и перемешал их. Нужно разложить цвета по трём гармониям, чтобы каждый баннер смотрелся цельно.',
      goal: 'В :root девять переменных --c1 … --c9. Закрасьте образцы .chip (свойство background-color, только через var()): в строке «Монохромная» — три оттенка одного цвета; в строке «Аналоговая» — три цвета, которые стоят рядом на цветовом круге; в строке «Комплементарная» — два оттенка одного цвета и один цвет с противоположной стороны круга, его поставьте последним, это акцент. Порядок в первых двух строках — любой. Не переписывайте hex-коды: каждый должен встречаться в CSS один раз.',
      hints: [
        'Сначала выпишите на бумагу девять цветов и подпишите, на что каждый похож: «фиолетовый тёмный», «жёлтый» и т. д. Можно временно закрасить ими образцы по порядку и посмотреть.',
        'Монохромная — три фиолетовых разной светлоты. Аналоговая — тёплые соседи по кругу: красный, оранжевый, жёлтый.',
        'Комплементарная — два зелёных и малиновый: зелёный и красный стоят на круге напротив друг друга.',
        'Пример правила: .mono-1 { background-color: var(--c4); }'
      ],
      html: `<h1>Гармонии для промо-баннеров</h1>
<section class="row">
  <h2>Монохромная</h2>
  <ul class="chips">
    <li class="chip mono-1"></li>
    <li class="chip mono-2"></li>
    <li class="chip mono-3"></li>
  </ul>
</section>
<section class="row">
  <h2>Аналоговая</h2>
  <ul class="chips">
    <li class="chip analog-1"></li>
    <li class="chip analog-2"></li>
    <li class="chip analog-3"></li>
  </ul>
</section>
<section class="row">
  <h2>Комплементарная</h2>
  <ul class="chips">
    <li class="chip compl-1"></li>
    <li class="chip compl-2"></li>
    <li class="chip compl-3"></li>
  </ul>
</section>`,
      css: `${BASE}
:root {
  --c1: #f2c14e;
  --c2: #2e8b57;
  --c3: #7e57c2;
  --c4: #d64545;
  --c5: #b9e4c9;
  --c6: #4a2c6d;
  --c7: #e8833a;
  --c8: #c2185b;
  --c9: #d1c4e9;
}
.chips {
  display: flex;
  gap: 8px;
  padding: 0;
  list-style: none;
}
.chip {
  width: 96px;
  height: 64px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
/* Закрасьте образцы ниже: .mono-1 { background-color: var(--c?); } */
`,
      tests: [
        { name: 'Монохромная: три оттенка фиолетового', check: h => {
          const got = ['.mono-1', '.mono-2', '.mono-3'].map(s => bg(h, s)).sort().join();
          return got === ['#4a2c6d', '#7e57c2', '#d1c4e9'].map(rgb).sort().join() || 'в первой строке должны быть три фиолетовых разной светлоты'; } },
        { name: 'Аналоговая: три соседа по кругу — красный, оранжевый, жёлтый', check: h => {
          const got = ['.analog-1', '.analog-2', '.analog-3'].map(s => bg(h, s)).sort().join();
          return got === ['#d64545', '#e8833a', '#f2c14e'].map(rgb).sort().join() || 'во второй строке нужны тёплые соседи по кругу'; } },
        { name: 'Комплементарная: два зелёных и противоположный им акцент последним', check: h => {
          const first = ['.compl-1', '.compl-2'].map(s => bg(h, s)).sort().join();
          if (first !== ['#2e8b57', '#b9e4c9'].map(rgb).sort().join()) return 'первые два образца — два оттенка зелёного';
          return bg(h, '.compl-3') === rgb('#c2185b') || 'последний образец — цвет напротив зелёного на круге'; } },
        { name: 'Цвета заданы через var(), hex-коды не переписаны', check: h => {
          const many = ['#f2c14e', '#2e8b57', '#7e57c2', '#d64545', '#b9e4c9', '#4a2c6d', '#e8833a', '#c2185b', '#d1c4e9'].filter(c => times(h, c) !== 1);
          return !many.length && (plain(h).match(/var\(--c\d\)/g) || []).length >= 9 || 'закрашивайте через var(--c1)…var(--c9), hex не копируйте'; } }
      ]
    }
  );
})();
