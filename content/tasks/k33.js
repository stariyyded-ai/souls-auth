/* Занятие 33. Веб-дизайн и профессия веб-дизайнера */
(() => {
  const { BASE } = window.COURSE_KIT;
  const SPECS = [
    [/\bUI\b/, 'UI'], [/\bUX\b/, 'UX'], [/продукт/i, 'продуктовый'], [/графич/i, 'графический веб'], [/моушн|motion/i, 'моушн']
  ];
  const CRITERIA = ['Обучаемость', 'Эффективность', 'Запоминаемость', 'Ошибки', 'Удовлетворённость'];

  window.COURSE_TASKS.push(
    {
      id: 'k3301', lesson: 'mdk-33', module: 'mdk4', mech: 'build',
      title: 'Карточки специализаций', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Для дня открытых дверей колледжа делаем страницу «Кем работает веб-дизайнер». Абитуриенты должны с первого взгляда увидеть пять направлений профессии.',
      goal: 'Под заголовком h1 сделайте блок section с классом specs, а в нём пять карточек article с классом spec. В каждой карточке — заголовок h2 и абзац p о том, чем занимается специалист. Заголовки: UI-дизайнер, UX-дизайнер, продуктовый дизайнер, графический веб-дизайнер, моушн-дизайнер (порядок любой). В CSS у .specs включите сетку: display: grid, три колонки одинаковой ширины и промежуток gap не меньше 16px.',
      hints: [
        'Одна карточка выглядит так: <article class="spec"><h2>UI-дизайнер</h2><p>Рисует экраны: кнопки, поля, карточки.</p></article>.',
        'Все пять карточек лежат внутри <section class="specs"> … </section>, сразу после h1.',
        'Сетка: .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }.'
      ],
      html: `<h1>Кем работает веб-дизайнер</h1>
<!-- Ниже: section.specs и пять карточек article.spec -->
`,
      css: `${BASE}
.specs {
  /* включите сетку из трёх колонок */
  margin-top: 24px;
}
.spec {
  padding: 16px;
  border: 1px solid #c9c9d6;
  border-radius: 12px;
  background: #f6f6fb;
}
.spec h2 { margin: 0 0 8px; font-size: 20px; color: #3b2a7a; }
.spec p { margin: 0; line-height: 1.5; }`,
      tests: [
        { name: 'Есть section.specs и в ней пять article.spec', check: h => h.count('section.specs > article.spec') === 5 || `карточек внутри section.specs: ${h.count('section.specs > article.spec')}` },
        { name: 'В каждой карточке есть h2 и абзац p с текстом', check: h => { const c = h.$$('article.spec'); return c.length > 0 && c.every(a => a.querySelector('h2')?.textContent.trim() && (a.querySelector('p')?.textContent.trim().length || 0) >= 10) || 'в какой-то карточке нет h2 или абзаца хотя бы из пары слов'; } },
        { name: 'Названы все пять специализаций', check: h => { const t = h.$$('article.spec h2').map(e => e.textContent).join(' | '); const miss = SPECS.filter(([re]) => !re.test(t)).map(([, n]) => n); return !miss.length || `нет: ${miss.join(', ')}`; } },
        { name: 'Карточки стоят сеткой в три колонки', check: h => {
          if (h.cs('.specs', 'display') !== 'grid') return 'у .specs нет display: grid';
          const cols = h.cs('.specs', 'grid-template-columns').split(' ').filter(Boolean);
          if (cols.length !== 3) return `колонок: ${cols.length}`;
          return Math.max(...cols.map(parseFloat)) - Math.min(...cols.map(parseFloat)) < 1 || 'колонки разной ширины: используйте 1fr';
        } },
        { name: 'Между карточками промежуток от 16px', check: h => h.px('.specs', 'column-gap') >= 16 && h.px('.specs', 'row-gap') >= 16 || `gap: ${h.cs('.specs', 'gap') || 'нет'}` }
      ]
    },
    {
      id: 'k3302', lesson: 'mdk-33', module: 'mdk4', mech: 'build',
      title: 'Страница портфолио', level: 'Среднее', minutes: 25, points: 150,
      story: 'Портфолио — главный документ дизайнера при устройстве на работу. Начнём своё: шапка с именем, три работы и контакты.',
      goal: 'Сделайте страницу из трёх частей. 1) header: h1 с вашим именем и абзац с классом role (кто вы, например «начинающий веб-дизайнер»). 2) section с классом works: заголовок h2 «Работы» и три figure, в каждой картинка img/art.svg с осмысленным alt и подпись figcaption. 3) footer со ссылкой на почту (mailto:). На компьютере три работы стоят в ряд, а на телефоне 360px — друг под другом, без горизонтальной прокрутки.',
      hints: [
        'Одна работа: <figure><img src="img/art.svg" alt="Главная страница сайта кофейни"><figcaption>Сайт кофейни «Зерно»</figcaption></figure>.',
        'Чтобы картинки не вылезали за экран: .works img { max-width: 100%; height: auto; }. Уберите у figure лишний отступ: margin: 0.',
        'Mobile first: сначала .works-list { display: grid; gap: 24px; } — одна колонка, а в @media (min-width: 768px) — grid-template-columns: repeat(3, 1fr).',
        'Работы удобно обернуть в div class="works-list", чтобы заголовок h2 не попал в сетку.'
      ],
      html: `<!-- 1. header: h1 и p.role -->

<!-- 2. section.works: h2 «Работы» и три figure -->

<!-- 3. footer: ссылка mailto: -->
`,
      css: `${BASE}
/* Оформите портфолио: работы в ряд на компьютере и столбиком на телефоне */
`,
      tests: [
        { name: 'В header есть h1 и p.role с текстом', check: h => !!(h.$('header h1')?.textContent.trim() && h.$('header p.role')?.textContent.trim()) || 'нужны <header><h1>…</h1><p class="role">…</p></header>' },
        { name: 'В section.works есть h2 «Работы» и три figure', check: h => {
          if (!h.$('section.works')) return 'нет section.works';
          if (h.text('section.works h2') !== 'Работы') return 'нужен заголовок h2 «Работы»';
          return h.count('section.works figure') === 3 || `figure: ${h.count('section.works figure')}`;
        } },
        { name: 'В каждой figure картинка img/art.svg с alt и подпись figcaption', check: h => { const f = h.$$('section.works figure'); return f.length === 3 && f.every(x => { const i = x.querySelector('img'); return i && i.getAttribute('src') === 'img/art.svg' && (i.getAttribute('alt') || '').trim().length >= 3 && x.querySelector('figcaption')?.textContent.trim(); }) || 'проверьте img src, alt из нескольких слов и figcaption в каждой работе'; } },
        { name: 'В footer есть ссылка на почту mailto:', check: h => !!h.$('footer a[href^="mailto:"]')?.textContent.trim() || 'нет <footer> со ссылкой <a href="mailto:…">' },
        { name: 'На компьютере три работы в ряд', check: h => { const f = h.$$('section.works figure'); return f.length === 3 && h.sameRow(f) || 'работы не стоят в один ряд'; } },
        { at: 360, name: 'На телефоне работы друг под другом и нет прокрутки', check: h => {
          const f = h.$$('section.works figure'); if (f.length !== 3) return 'нужно три figure';
          if (h.overflow()) return 'есть горизонтальная прокрутка: max-width: 100% у картинок';
          return f[1].getBoundingClientRect().top >= f[0].getBoundingClientRect().bottom - 1 || 'на телефоне работы должны стоять столбиком';
        } }
      ]
    },
    {
      id: 'k3303', lesson: 'mdk-33', module: 'mdk4', mech: 'fix',
      title: 'Пять критериев юзабилити', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Одногруппник сделал шпаргалку по юзабилити, но разметил её как попало: жирный текст через b, переносы через br, всё в div. Экранный диктор прочитает это сплошной кашей.',
      goal: 'Переделайте шпаргалку в список определений: один dl, в нём пять пар dt + dd. В dt — название критерия (Обучаемость, Эффективность, Запоминаемость, Ошибки, Удовлетворённость — в этом порядке), в dd — его объяснение. Теги b, br и div не используйте. Заголовок h1 оставьте.',
      hints: [
        'Список определений: <dl><dt>Термин</dt><dd>Объяснение</dd>…</dl>. Его проходили на занятии 5.',
        'Каждый div превращается в пару: <b>Обучаемость</b> → <dt>Обучаемость</dt>, текст после <br> → <dd>…</dd>.',
        'Жирность dt уже задана в CSS, поэтому тег b больше не нужен.'
      ],
      html: `<h1>Юзабилити по Якобу Нильсену</h1>
<div><b>Обучаемость</b><br>Насколько легко новичку сделать простое дело с первого раза.</div>
<div><b>Эффективность</b><br>Как быстро опытный пользователь выполняет задачу.</div>
<div><b>Запоминаемость</b><br>Легко ли вспомнить, как пользоваться сайтом, после перерыва.</div>
<div><b>Ошибки</b><br>Сколько ошибок делают люди, насколько они серьёзны и легко ли их исправить.</div>
<div><b>Удовлетворённость</b><br>Приятно ли пользоваться сайтом.</div>`,
      css: `${BASE}
dt { margin-top: 16px; font-weight: bold; color: #3b2a7a; }
dd { margin: 4px 0 0 24px; line-height: 1.5; }`,
      tests: [
        { name: 'Есть один список dl', check: h => h.count('dl') === 1 || `списков dl: ${h.count('dl')}` },
        { name: 'Пять терминов dt по порядку', check: h => { const t = h.$$('dl dt').map(e => e.textContent.trim()); return t.join('|') === CRITERIA.join('|') || `сейчас: ${t.join(', ') || 'нет dt'}`; } },
        { name: 'После каждого dt идёт dd с объяснением', check: h => { const t = h.$$('dl dt'); return t.length === 5 && t.every(e => e.nextElementSibling?.tagName === 'DD' && e.nextElementSibling.textContent.trim().length > 10) || 'за каждым dt должен идти dd с текстом'; } },
        { name: 'Нет тегов b, br и div', check: h => { const n = h.count('b, br, div'); return !n || `осталось тегов b/br/div: ${n}`; } },
        { name: 'Заголовок h1 на месте', check: h => h.text('h1') === 'Юзабилити по Якобу Нильсену' || 'верните h1' }
      ]
    }
  );
})();
