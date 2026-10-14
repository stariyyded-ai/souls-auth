/* Занятие 14. Стили при создании сайта */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  // Правила с псевдоклассом (например ':hover'), которые относятся к элементам sel
  const pseudoRules = (h, pseudo, sel) => h.rules.filter(r => r.selector.split(',').some(s => {
    if (!s.includes(pseudo)) return false;
    try { const base = s.split(pseudo).join('').trim() || '*'; return h.$$(base).some(e => e.matches(sel)); } catch (e) { return false; }
  }));
  const rootVar = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  window.COURSE_TASKS.push(
    {
      id: 'k1401', lesson: 'mdk-14', module: 'mdk2', mech: 'optimize', title: 'Цвета — в переменные', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Библиотека колледжа решила сменить фирменный синий. В CSS этот цвет записан пять раз, оранжевый — два. Сделаем так, чтобы в следующий раз цвет менялся в одном месте.',
      goal: 'Объявите в правиле :root две переменные: --color-main со значением #1f4e79 и --color-accent со значением #b3541e. Замените все записи #1f4e79 и #b3541e в остальных правилах на var(--color-main) и var(--color-accent). Каждый из этих кодов цвета должен остаться в CSS ровно один раз — в объявлении переменной. Внешний вид страницы меняться не должен.',
      hints: [
        'Начните CSS с правила :root { } — внутри объявляются переменные. Имя переменной начинается с двух дефисов.',
        ':root { --color-main: #1f4e79; --color-accent: #b3541e; }',
        'Теперь в каждом правиле вместо #1f4e79 напишите var(--color-main). Например: h2 { color: var(--color-main); }',
        'Пройдитесь поиском (Ctrl+F) по коду: #1f4e79 и #b3541e должны встречаться только внутри :root.'
      ],
      html: `<header class="header">
  <h1 class="header__title">Библиотека колледжа</h1>
  <p>Работаем с 9:00 до 18:00, без перерыва</p>
</header>
<main>
  <h2>Новые книги</h2>
  <p>В октябре пришли учебники по веб-дизайну. Записаться в очередь можно <a href="#queue">на абонементе</a>.</p>
  <p class="note">Учебники выдаются на две недели.</p>
  <button class="button" type="button">Записаться в очередь</button>
</main>
<footer class="footer">
  <p>Корпус 1, кабинет 105</p>
</footer>`,
      css: `${BASE}
.header { border-bottom: 4px solid #1f4e79; margin-bottom: 16px; }
.header__title { color: #1f4e79; }
h2 { color: #1f4e79; }
a { color: #1f4e79; }
.note { border-left: 4px solid #b3541e; padding-left: 12px; }
.button { background-color: #b3541e; color: #ffffff; border: 0; padding: 10px 20px; font-size: 16px; }
.footer { border-top: 1px solid #1f4e79; margin-top: 24px; color: #555555; }`,
      tests: [
        { name: 'В :root объявлена --color-main: #1f4e79', check: h => rootVar(h, '--color-main') === '#1f4e79' || (rootVar(h, '--color-main') ? `сейчас ${rootVar(h, '--color-main')}` : 'переменной --color-main нет') },
        { name: 'В :root объявлена --color-accent: #b3541e', check: h => rootVar(h, '--color-accent') === '#b3541e' || (rootVar(h, '--color-accent') ? `сейчас ${rootVar(h, '--color-accent')}` : 'переменной --color-accent нет') },
        { name: 'Код #1f4e79 записан в CSS только один раз', check: h => h.occurrences('#1f4e79') === 1 || `встречается ${h.occurrences('#1f4e79')} раз` },
        { name: 'Код #b3541e записан в CSS только один раз', check: h => h.occurrences('#b3541e') === 1 || `встречается ${h.occurrences('#b3541e')} раз` },
        { name: 'Правила используют var(--color-main) и var(--color-accent)', check: h => (h.occurrences('var(--color-main)') >= 5 && h.occurrences('var(--color-accent)') >= 2) || `var(--color-main): ${h.occurrences('var(--color-main)')} из 5, var(--color-accent): ${h.occurrences('var(--color-accent)')} из 2` },
        { name: 'Страница выглядит как раньше', check: h => {
          const main = rgb('#1f4e79'), acc = rgb('#b3541e');
          if (h.cs('.header__title', 'color') !== main) return 'заголовок h1 потерял синий цвет';
          if (h.cs('h2', 'color') !== main || h.cs('a', 'color') !== main) return 'h2 или ссылка потеряли синий цвет';
          if (h.cs('.header', 'border-bottom-color') !== main || h.cs('.footer', 'border-top-color') !== main) return 'рамка шапки или подвала потеряла цвет';
          if (h.cs('.button', 'background-color') !== acc || h.cs('.note', 'border-left-color') !== acc) return 'кнопка или заметка потеряли оранжевый цвет';
          return true; } }
      ]
    },
    {
      id: 'k1402', lesson: 'mdk-14', module: 'mdk2', mech: 'build', title: 'Карточки кружков на классах', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице три карточки кружков, и каждая оформлена отдельно по id. Стили повторяются трижды, а добавить четвёртый кружок — значит снова копировать. Переведём карточки на общий класс.',
      goal: 'Добавьте в начало CSS сброс * { box-sizing: border-box; }. Каждому div дайте класс card, заголовку внутри — класс card__title, абзацу — класс card__text. Карточке «Шахматы» добавьте второй класс card--accent. Удалите все правила с id и напишите вместо них: .card — ширина 320px, padding 16px, рамка 1px solid #c9d3df, margin-bottom 16px, фон #f5f8fb; .card__title — margin-top 0, размер 20px, цвет #1f4e79; .card--accent — цвет рамки #b3541e, толщина рамки 2px, фон #fff4ec. Ширина карточки с рамкой и отступами — ровно 320px.',
      hints: [
        'В HTML: <div class="card"> и <h2 class="card__title">. У третьей карточки: class="card card--accent" — два класса через пробел.',
        'В CSS удалите все правила, которые начинаются с #. Вместо них — .card { … } и .card__title { … }.',
        'Модификатор меняет только то, что отличается: .card--accent { border-color: #b3541e; border-width: 2px; background-color: #fff4ec; }',
        'Чтобы ширина 320px включала padding и рамку, нужен * { box-sizing: border-box; } в начале CSS.'
      ],
      html: `<h1>Кружки колледжа</h1>
<div id="robot">
  <h2>Робототехника</h2>
  <p>Собираем роботов из конструктора. Вторник, 16:00.</p>
</div>
<div id="design">
  <h2>Веб-дизайн</h2>
  <p>Рисуем макеты сайтов в Figma. Среда, 15:30.</p>
</div>
<div id="chess">
  <h2>Шахматы</h2>
  <p>Новый набор! Турнир каждую пятницу в 17:00.</p>
</div>`,
      css: `${BASE}
#robot { width: 320px; padding: 16px; border: 1px solid #c9d3df; margin-bottom: 16px; background-color: #f5f8fb; }
#robot h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }
#design { width: 320px; padding: 16px; border: 1px solid #c9d3df; margin-bottom: 16px; background-color: #f5f8fb; }
#design h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }
#chess { width: 320px; padding: 16px; border: 2px solid #b3541e; margin-bottom: 16px; background-color: #fff4ec; }
#chess h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }`,
      tests: [
        { name: 'Три карточки с классом card, в каждой card__title и card__text', check: h => {
          const c = h.$$('.card');
          if (c.length !== 3) return `карточек .card: ${c.length}`;
          return c.every(e => e.querySelector('h2.card__title') && e.querySelector('p.card__text')) || 'в каждой карточке нужны h2.card__title и p.card__text'; } },
        { name: 'В CSS нет селекторов по id', check: h => !h.rules.some(r => r.selector.includes('#')) || 'удалите правила с #robot, #design, #chess' },
        { name: '.card: padding 16px, рамка 1px solid #c9d3df, фон #f5f8fb, margin-bottom 16px', check: h => {
          const s = h.$$('.card').find(e => !e.classList.contains('card--accent')); if (!s) return 'нет обычной карточки';
          const cs = h.win.getComputedStyle(s);
          if (cs.paddingTop !== '16px' || cs.paddingLeft !== '16px') return `padding сейчас ${cs.padding}`;
          if (cs.borderTopWidth !== '1px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#c9d3df')) return 'рамка должна быть 1px solid #c9d3df';
          if (cs.backgroundColor !== rgb('#f5f8fb')) return 'фон должен быть #f5f8fb';
          return cs.marginBottom === '16px' || `margin-bottom сейчас ${cs.marginBottom}`; } },
        { name: 'Сброс box-sizing: ширина карточки ровно 320px', check: h => {
          if (h.cs('.card', 'box-sizing') !== 'border-box') return 'нет * { box-sizing: border-box; }';
          return h.$$('.card').every(e => near(e.getBoundingClientRect().width, 320, 0.5)) || 'ширина карточки с рамкой и отступами должна быть 320px'; } },
        { name: '.card__title: margin-top 0, 20px, цвет #1f4e79', check: h => (h.px('.card__title', 'margin-top') === 0 && h.px('.card__title', 'font-size') === 20 && h.cs('.card__title', 'color') === rgb('#1f4e79')) || 'проверьте margin-top, font-size и color у .card__title' },
        { name: 'Модификатор card--accent только у «Шахмат»: рамка 2px #b3541e, фон #fff4ec', check: h => {
          const a = h.$$('.card--accent');
          if (a.length !== 1 || !/Шахматы/.test(a[0].textContent)) return 'класс card--accent нужен одной карточке — «Шахматы»';
          if (!a[0].classList.contains('card')) return 'у карточки должны быть оба класса: card card--accent';
          const cs = h.win.getComputedStyle(a[0]);
          return (cs.borderTopWidth === '2px' && cs.borderTopColor === rgb('#b3541e') && cs.backgroundColor === rgb('#fff4ec')) || 'рамка 2px #b3541e и фон #fff4ec'; } }
      ]
    },
    {
      id: 'k1403', lesson: 'mdk-14', module: 'mdk2', mech: 'build', title: 'Меню и кнопка с состояниями', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт спортзала «Олимп»: меню выглядит как обычный список с точками, а кнопка — серая, как в 1999 году. Приведём их в порядок и не забудем про тех, кто ходит по сайту клавишей Tab.',
      goal: 'Переменные цветов уже есть в :root. Оформите: .menu__list — без маркеров, padding 0, margin 0 0 24px; .menu__item — display: inline-block и margin-right 16px (пункты в одну строку); .menu__link — цвет var(--color-main), без подчёркивания, жирный. При наведении (.menu__link:hover) ссылка подчёркивается. Кнопка .button: фон var(--color-main), белый текст, без рамки (border: 0), padding 12px 24px, курсор-рука (cursor: pointer); при наведении фон var(--color-main-dark). Ссылкам и кнопке задайте состояние :focus-visible — рамка outline 3px solid var(--color-focus).',
      hints: [
        'Маркеры убирает list-style: none; отступ слева у списка — это padding, его обнуляем.',
        'Пункты в строку: .menu__item { display: inline-block; margin-right: 16px; }',
        '.menu__link:hover { text-decoration: underline; } — отдельное правило с двоеточием.',
        'Одно правило на всех: a:focus-visible, .button:focus-visible { outline: 3px solid var(--color-focus); }'
      ],
      html: `<nav class="menu">
  <ul class="menu__list">
    <li class="menu__item"><a class="menu__link" href="#home">Главная</a></li>
    <li class="menu__item"><a class="menu__link" href="#schedule">Расписание</a></li>
    <li class="menu__item"><a class="menu__link" href="#contacts">Контакты</a></li>
  </ul>
</nav>
<h1>Спортзал «Олимп»</h1>
<p>Первая тренировка бесплатно. Запишитесь онлайн или <a href="#call">позвоните администратору</a>.</p>
<button class="button" type="button">Записаться</button>`,
      css: `${BASE}
:root {
  --color-main: #1f4e79;
  --color-main-dark: #163a5a;
  --color-focus: #f2a541;
}`,
      tests: [
        { name: 'Список меню без маркеров, padding 0, margin-bottom 24px', check: h => (h.cs('.menu__list', 'list-style-type') === 'none' && h.px('.menu__list', 'padding-left') === 0 && h.px('.menu__list', 'margin-top') === 0 && h.px('.menu__list', 'margin-bottom') === 24) || 'нужно list-style: none; padding: 0; margin: 0 0 24px;' },
        { name: 'Пункты меню стоят в одну строку, между ними 16px', check: h => (h.cs('.menu__item', 'display') === 'inline-block' && h.px('.menu__item', 'margin-right') === 16 && h.sameRow(h.$$('.menu__item'))) || 'нужно display: inline-block и margin-right: 16px' },
        { name: 'Ссылки меню: основной цвет, без подчёркивания, жирные', check: h => {
          if (h.cs('.menu__link', 'color') !== rgb('#1f4e79')) return 'цвет должен быть var(--color-main)';
          if (h.cs('.menu__link', 'text-decoration-line') !== 'none') return 'уберите подчёркивание';
          return h.px('.menu__link', 'font-weight') >= 700 || 'ссылки должны быть жирными'; } },
        { name: 'При наведении ссылка меню подчёркивается', check: h => pseudoRules(h, ':hover', '.menu__link').some(r => /underline/.test(r.style.cssText)) || 'нет правила .menu__link:hover с text-decoration: underline' },
        { name: 'Кнопка: фон основной, белый текст, без рамки, padding 12px 24px, cursor: pointer', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          if (cs.backgroundColor !== rgb('#1f4e79') || cs.color !== rgb('#ffffff')) return 'фон var(--color-main), текст #ffffff';
          if (cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') return 'уберите рамку: border: 0';
          if (cs.paddingTop !== '12px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          return cs.cursor === 'pointer' || 'нужен cursor: pointer'; } },
        { name: 'При наведении фон кнопки темнеет', check: h => pseudoRules(h, ':hover', '.button').some(r => /background/.test(r.style.cssText) && (/--color-main-dark/.test(r.style.cssText) || r.style.cssText.includes(rgb('#163a5a')))) || 'нет .button:hover с фоном var(--color-main-dark)' },
        { name: 'У ссылок и кнопки есть заметный :focus-visible', check: h => {
          const ok = sel => pseudoRules(h, ':focus-visible', sel).some(r => /outline/.test(r.style.cssText) && !/outline:\s*(none|0)\b/.test(r.style.cssText));
          if (!ok('.menu__link')) return 'нет :focus-visible с outline для ссылок';
          return ok('.button') || 'нет :focus-visible с outline для кнопки'; } }
      ]
    }
  );
})();
