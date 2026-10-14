/* 25 заданий по HTML/CSS в игровой форме: пять механик по пять заданий.
   У каждого задания: история, условие, шаблон кода (html + css), чек-лист требований = автотесты результата.
   Проверки качества кода (семантика, WCAG, контраст, чистота CSS, линтер) общие — см. js/task-runner.js.
   Тест: { name, at?: 360, check: h => true | 'почему нет' }, помощник h описан в task-runner.js.
   minutes — норма времени для бонуса за скорость, points — базовый балл. */
(() => {
  const rgb = hex => { const n = parseInt(hex.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
  const near = (a, b, d = 1.5) => Math.abs(a - b) <= d;
  // Картинки прямо в коде, чтобы задания работали без сети
  // Картинки лежат в img/: страница задания открывается в iframe с адресом tasks.html, поэтому пути относительные
  const IMG = 'img/art.svg';
  const ICON = 'img/icon.svg';
  const BASE = 'body { margin: 0; padding: 24px; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }';

  const MECHANICS = {
    fix: { title: 'Почини сайт', text: 'Сайт сломан: найди и исправь ошибки в HTML и CSS.' },
    assemble: { title: 'Собери макет', text: 'Собери страницу из фрагментов. Осторожно: среди них есть ловушки.' },
    optimize: { title: 'Оптимизируй код', text: 'Всё работает, но код тяжёлый. Сделай его короче и чище, не меняя внешний вид.' },
    adaptive: { title: 'Адаптив за 5 минут', text: 'Страница сделана для компьютера. Заставь её работать на телефоне шириной 360px.' },
    build: { title: 'Сделай сам', text: 'Задание курса: по шагам из урока собери страницу или её часть.' },
    a11y: { title: 'Доступность и семантика', text: 'Страницей должны пользоваться все: с экранным диктором, с клавиатуры, со слабым зрением.' }
  };

  const T = [
    /* ===================== Почини сайт ===================== */
    {
      id: 't01', mech: 'fix', title: 'Сломанная вывеска костра', level: 'Лёгкое', minutes: 15, points: 100, module: 'm1',
      story: 'Над Храмом огня висит вывеска, но кто-то перепутал теги и опечатался в стилях. Путники проходят мимо.',
      goal: 'Исправь разметку и CSS вывески: один закрытый заголовок, золотой текст, кнопка-ссылка в оранжевом цвете, у картинки понятный alt.',
      html: `<header class="sign">
  <h1>Костёр «Храм огня»<h1>
  <p class="motto">Отдохни, негорящий. Здесь тепло.</p>
</header>
<main>
  <img src="${IMG}" width="300" height="150">
  <a href="#rest" class="btn">Присесть у костра</a>
</main>`,
      css: `${BASE}
.sign { padding: 24px; text-align: center; colr: #f2d58a }
.sign h1 { font-size: 40px margin: 0; }
.motto { color: #c9b89a; }
.bnt { display: inline-block; padding: 12px 20px; background: #e8772e; color: #1b1620; text-decoration: none; }`,
      tests: [
        { name: 'На странице один заголовок h1, и он правильно закрыт', check: h => h.count('h1') === 1 && h.text('h1') === 'Костёр «Храм огня»' || `заголовков h1: ${h.count('h1')}` },
        { name: 'Текст вывески золотой (#f2d58a)', check: h => h.cs('.sign', 'color') === rgb('#f2d58a') || `сейчас ${h.cs('.sign', 'color')}` },
        { name: 'Заголовок 40px и без внешних отступов', check: h => h.px('h1', 'font-size') === 40 && h.px('h1', 'margin-top') === 0 || 'проверь font-size и margin у h1' },
        { name: 'Кнопка оранжевая (#e8772e) и без подчёркивания', check: h => h.cs('.btn', 'background-color') === rgb('#e8772e') && h.cs('.btn', 'text-decoration-line') === 'none' || 'стили .btn не применились' },
        { name: 'Картинка описана словами (непустой alt)', check: h => (h.$('img')?.alt || '').trim().length > 3 || 'добавь alt с описанием' }
      ]
    },
    {
      id: 't02', mech: 'fix', title: 'Прилавок без прилавка', level: 'Лёгкое', minutes: 15, points: 100, module: 'm2',
      story: 'Андрэ разложил товары, но они съехали в столбик. Покупатели путаются, где что.',
      goal: 'Почини flex-раскладку: три карточки в один ряд одинаковой ширины, между ними 16px, заголовки карточек без верхнего отступа.',
      html: `<section class="shop">
  <h2>Прилавок Андрэ</h2>
  <ul class="goods">
    <li class="card"><h3>Титанитовый осколок</h3><p class="price">800 душ</p></li>
    <li class="card"><h3>Зелёный цветок</h3><p class="price">1000 душ</p></li>
    <li class="card"><h3>Эстус</h3><p class="price">500 душ</p></li>
  </ul>
</section>`,
      css: `${BASE}
.goods { display: flexbox; justify-content: space-beetween; gap: 16px; list-style: none; padding: 0; margin: 0; }
.card { width: 33.3%; padding: 16px; border: 2px solid #c9a45c; }
.card h3 { margin 0; }
.price { color: #f2d58a; font-weight: bold; }`,
      tests: [
        { name: 'Список товаров — flex-контейнер', check: h => h.cs('.goods', 'display') === 'flex' || `display: ${h.cs('.goods', 'display')}` },
        { name: 'Три карточки стоят в один ряд', check: h => h.sameRow(h.$$('.card')) || 'карточки на разной высоте' },
        { name: 'Карточки одинаковой ширины и не вылезают за прилавок', check: h => { const c = h.$$('.card').map(e => e.getBoundingClientRect().width); return Math.max(...c) - Math.min(...c) < 2 && h.inside(h.$$('.card')[2], '.goods') || 'ширины разные или карточка вылезает'; } },
        { name: 'Между карточками ровно 16px', check: h => { const [a, b] = h.$$('.card').map(e => e.getBoundingClientRect()); return near(b.left - a.right, 16) || `сейчас ${Math.round(b.left - a.right)}px`; } },
        { name: 'У заголовков карточек нет верхнего отступа', check: h => h.px('.card h3', 'margin-top') === 0 || 'margin-top у h3 не 0' }
      ]
    },
    {
      id: 't03', mech: 'fix', title: 'Меню провалилось в склеп', level: 'Среднее', minutes: 20, points: 150, module: 'm2',
      story: 'Пункты меню рухнули друг на друга, а активный пункт перестал светиться. Кликнуть по ним почти невозможно.',
      goal: 'Меню должно стоять справа в одну строку, активный пункт подсвечен оранжевым #e8772e, каждая ссылка высотой не меньше 44px (минимум для пальца по WCAG).',
      html: `<header class="top">
  <a class="logo" href="#">Пепельный Пиксель</a>
  <nav aria-label="Главное меню">
    <ul class="menu">
      <li><a href="#" class="active">Костры</a></li>
      <li><a href="#">Боссы</a></li>
      <li><a href="#">Ковенанты</a></li>
    </ul>
  </nav>
</header>`,
      css: `body { margin: 0; background: #0a090c; font-family: Arial, sans-serif; }
.top { display: flex; align-items: center; padding: 0 24px; background: #1e1a24; }
.logo { color: #f2d58a; font-weight: bold; text-decoration: none; }
.menu { list-style: none; margin: 0; padding: 0; }
.menu li { display: block; }
.menu a { color: #e6dcc6; text-decoration: none; }
.menu .is-active { color: #e8772e; }`,
      tests: [
        { name: 'Пункты меню в одну строку', check: h => h.sameRow(h.$$('.menu li')) || 'пункты стоят столбиком' },
        { name: 'Меню прижато к правому краю шапки', check: h => h.rect('.menu li:last-child').right >= h.rect('.top').right - 40 || 'меню не справа' },
        { name: 'Активный пункт оранжевый (#e8772e)', check: h => h.cs('.menu .active', 'color') === rgb('#e8772e') || 'класс в CSS и в HTML не совпадает' },
        { name: 'Каждая ссылка меню высотой не меньше 44px', check: h => h.$$('.menu a').every(a => a.getBoundingClientRect().height >= 44) || `высота ${Math.round(h.rect('.menu a').height)}px` }
      ]
    },
    {
      id: 't04', mech: 'fix', title: 'Ковенант не принимает новичков', level: 'Среднее', minutes: 20, points: 150, module: 'm1',
      story: 'Форма вступления в ковенант не работает: подписи не связаны с полями, почту не проверить, а «кнопка» — просто текст.',
      goal: 'Свяжи подписи с полями, сделай поле почты типом email, имя — обязательным, а отправку — настоящей кнопкой. Поля должны быть во всю ширину формы.',
      html: `<form class="join" action="#">
  <h2>Вступить в ковенант</h2>
  <div class="field">
    <label for="name">Имя персонажа</label>
    <input id="nick" type="text">
  </div>
  <div class="field">
    <label for="mail">Почта</label>
    <input id="mail" type="text">
  </div>
  <div class="send">Вступить</div>
</form>`,
      css: `${BASE}
.join { max-width: 420px; }
.field { margin-bottom: 16px; }
.field label { display: block; margin-bottom: 6px; }
.field input { width: 100 %; box-sizing: border-box; padding: 10px; }
.send { padding: 12px; background: #c9a45c; color: #16131a; text-align: center; }`,
      tests: [
        { name: 'Каждая подпись label связана со своим полем', check: h => h.$$('label').every(l => h.doc.getElementById(l.htmlFor)?.matches('input')) || 'for и id не совпадают' },
        { name: 'Поле почты имеет type="email"', check: h => h.$$('input[type=email]').length === 1 || 'нет поля type="email"' },
        { name: 'Имя персонажа — обязательное поле (required)', check: h => !!h.$('label[for]')?.htmlFor && !!h.doc.getElementById(h.$('label[for]').htmlFor)?.required || 'у поля имени нет required' },
        { name: 'Отправка — элемент button type="submit" с текстом', check: h => h.$$('form button[type=submit]').some(b => b.textContent.trim()) || 'нет кнопки отправки' },
        { name: 'Поля занимают всю ширину формы', check: h => h.$$('.field input').every(i => near(i.getBoundingClientRect().width, i.closest('.field').getBoundingClientRect().width)) || 'width не применилось' }
      ]
    },
    {
      id: 't05', mech: 'fix', title: 'Галерея Анор Лондо развалилась', level: 'Сложное', minutes: 25, points: 200, module: 'm2',
      story: 'Картины в галерее Анор Лондо съехали в одну колонку и вылезают из рам.',
      goal: 'Почини grid: три колонки, первая картина на две колонки, промежуток 12px, картинки не шире своих рамок.',
      html: `<section class="gallery">
  <figure class="work big"><img src="${IMG}" alt="Анор Лондо на закате"><figcaption>Анор Лондо</figcaption></figure>
  <figure class="work"><img src="${IMG}" alt="Мост у крепости Сена"><figcaption>Крепость Сена</figcaption></figure>
  <figure class="work"><img src="${IMG}" alt="Огни Уезда нежити"><figcaption>Уезд нежити</figcaption></figure>
  <figure class="work"><img src="${IMG}" alt="Озеро тёмных корней"><figcaption>Тёмные корни</figcaption></figure>
  <figure class="work"><img src="${IMG}" alt="Пепельное небо Изалита"><figcaption>Изалит</figcaption></figure>
</section>`,
      css: `${BASE}
.gallery { display: grid; grid-template-columns: repeat(3 1fr); gap: 12px; }
.work { margin: 0; padding: 8px; background: #241f2b; }
.work.big { grid-column: span2; }
figcaption { margin-top: 6px; font-size: 14px; }`,
      tests: [
        { name: 'Галерея — сетка из трёх колонок', check: h => h.cs('.gallery', 'grid-template-columns').split(' ').length === 3 || 'колонок не три' },
        { name: 'Первая картина занимает две колонки', check: h => { const b = h.rect('.work.big').width, s = h.rect('.work:nth-child(2)').width; return near(b, s * 2 + 12, 2) || 'ширина не на две колонки'; } },
        { name: 'Промежуток между картинами 12px', check: h => h.cs('.gallery', 'column-gap') === '12px' && h.cs('.gallery', 'row-gap') === '12px' || 'gap не 12px' },
        { name: 'Картинки не шире своих рамок', check: h => h.$$('.work img').every(i => i.getBoundingClientRect().right <= i.parentElement.getBoundingClientRect().right + 0.5) || 'картинка вылезает' }
      ]
    },

    /* ===================== Собери макет ===================== */
    {
      id: 't06', mech: 'assemble', title: 'Карточка босса', level: 'Лёгкое', minutes: 15, points: 100, module: 'm1',
      story: 'Летописец собирает бестиарий. Из обрывков нужно собрать карточку Арториаса.',
      goal: 'Вставь фрагменты в нужные места: имя, картинка, характеристики в две колонки. Карточка не шире 320px с золотой рамкой. Ловушки не бери.',
      html: `<article class="boss">
  <!-- 1. имя босса -->
  <!-- 2. картинка -->
  <!-- 3. характеристики -->
</article>`,
      css: `${BASE}
/* вставь сюда стили карточки */`,
      fragments: [
        { lang: 'html', label: 'Имя босса', code: '<h2 class="boss-name">Арториас Путник Бездны</h2>' },
        { lang: 'html', label: 'Имя (ловушка)', code: '<font color="red" size="5">Арториас</font>', trap: true },
        { lang: 'html', label: 'Картинка', code: `<img class="boss-img" src="${IMG}" alt="Арториас с мечом над Бездной">` },
        { lang: 'html', label: 'Характеристики', code: '<dl class="stats">\n    <dt>Здоровье</dt><dd>3750</dd>\n    <dt>Души</dt><dd>50 000</dd>\n  </dl>' },
        { lang: 'css', label: 'Карточка', code: '.boss { box-sizing: border-box; max-width: 320px; padding: 16px; background: #241f2b; border: 2px solid #c9a45c; }' },
        { lang: 'css', label: 'Картинка', code: '.boss-img { display: block; width: 100%; height: auto; }' },
        { lang: 'css', label: 'Две колонки', code: '.stats { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; }\n.stats dd { margin: 0; }' },
        { lang: 'css', label: 'Карточка (ловушка)', code: '.boss { float: left !important; width: 900px; }', trap: true }
      ],
      tests: [
        { name: 'В карточке заголовок h2 с именем босса', check: h => /Арториас/.test(h.text('.boss h2')) || 'нет h2 с именем' },
        { name: 'Картинка внутри карточки, с alt и не шире её', check: h => !!h.$('.boss img[alt]') && h.inside('.boss img', '.boss') || 'картинки нет или она вылезает' },
        { name: 'Характеристики — список dl из двух пар', check: h => h.count('.boss dl dt') === 2 && h.count('.boss dl dd') === 2 || 'нет dl с двумя dt и dd' },
        { name: 'Порядок: имя, картинка, характеристики', check: h => h.before('.boss h2', '.boss img') && h.before('.boss img', '.boss dl') || 'порядок другой' },
        { name: 'Карточка не шире 320px, рамка золотая (#c9a45c)', check: h => h.rect('.boss').width <= 320.5 && h.cs('.boss', 'border-top-color') === rgb('#c9a45c') || 'ширина или рамка не те' },
        { name: 'Характеристики в две колонки', check: h => h.sameRow([h.$('.boss dt'), h.$('.boss dd')]) || 'dt и dd на разных строках' }
      ]
    },
    {
      id: 't07', mech: 'assemble', title: 'Подвал прилипает к полу', level: 'Среднее', minutes: 20, points: 150, module: 'm2',
      story: 'Страница Северного прибежища короткая, и подвал висит посередине экрана, как призрак.',
      goal: 'Собери каркас: header с nav, main с одним h1, footer. Подвал должен стоять внизу окна, даже если контента мало.',
      html: `<!-- собери каркас страницы из фрагментов -->`,
      css: `html { background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }
header, footer { padding: 16px 24px; background: #241f2b; }
nav a { color: #f2d58a; margin-right: 16px; }`,
      fragments: [
        { lang: 'html', label: 'Шапка', code: '<header>\n  <nav aria-label="Главное меню"><a href="#">Прибежище</a><a href="#">Карта</a></nav>\n</header>' },
        { lang: 'html', label: 'Шапка (ловушка)', code: '<div class="header"><span onclick="go()">Прибежище</span></div>', trap: true },
        { lang: 'html', label: 'Контент', code: '<main>\n  <h1>Северное прибежище</h1>\n  <p>Отсюда начинается путь.</p>\n</main>' },
        { lang: 'html', label: 'Подвал', code: '<footer>\n  <p>© Эпоха огня</p>\n</footer>' },
        { lang: 'css', label: 'Колонка во всю высоту', code: 'body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; }\nmain { flex: 1; padding: 24px; }' },
        { lang: 'css', label: 'Подвал (ловушка)', code: 'footer { position: absolute; bottom: 0; }', trap: true }
      ],
      tests: [
        { name: 'Есть header, main и footer, именно в таком порядке', check: h => h.before('header', 'main') && h.before('main', 'footer') || 'нет тегов или порядок другой' },
        { name: 'Навигация внутри шапки, в теге nav', check: h => !!h.$('header nav a') || 'nav не в header' },
        { name: 'В main ровно один заголовок h1', check: h => h.count('h1') === 1 && !!h.$('main h1') || 'h1 нет или их несколько' },
        { name: 'Подвал стоит внизу окна', check: h => near(h.rect('footer').bottom, h.height, 2) || `подвал заканчивается на ${Math.round(h.rect('footer')?.bottom || 0)}px из ${h.height}` },
        { name: 'Подвал не перекрывает контент', check: h => h.rect('footer').top >= h.rect('main').bottom - 1 || 'подвал наезжает на main' }
      ]
    },
    {
      id: 't08', mech: 'assemble', title: 'Доска ковенантов', level: 'Среднее', minutes: 20, points: 150, module: 'm3',
      story: 'В Храме огня висит доска ковенантов. На большом экране их четыре в ряд, на телефоне — по одному.',
      goal: 'Собери CSS для сетки: на 1024px четыре карточки в ряд, на 360px по одной, промежуток 16px, у каждой карточки цветная полоса сверху 4px.',
      html: `<section class="covenants">
  <article class="cov way"><h2>Путь белых</h2><p>Помогать другим негорящим.</p></article>
  <article class="cov sun"><h2>Воины солнца</h2><p>Хвала солнцу!</p></article>
  <article class="cov dark"><h2>Тёмные духи</h2><p>Вторгаться в чужие миры.</p></article>
  <article class="cov forest"><h2>Охотники леса</h2><p>Охранять лес Дарквуда.</p></article>
</section>`,
      css: `${BASE}
.cov h2 { margin: 0 0 8px; font-size: 20px; }
.cov p { margin: 0; }
.way { border-top-color: #e6dcc6; }
.sun { border-top-color: #f2d58a; }
.dark { border-top-color: #a978ee; }
.forest { border-top-color: #7fb85a; }
/* сетка и карточка */`,
      fragments: [
        { lang: 'css', label: 'Сетка', code: '.covenants { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }' },
        { lang: 'css', label: 'Сетка (ловушка)', code: '.covenants { display: table; width: 1200px; }', trap: true },
        { lang: 'css', label: 'Карточка', code: '.cov { padding: 16px; background: #241f2b; border-top: 4px solid; }' },
        { lang: 'css', label: 'Карточка (ловушка)', code: '.cov { float: left; width: 25%; }', trap: true }
      ],
      tests: [
        { name: 'На компьютере четыре карточки в ряд', check: h => h.sameRow(h.$$('.cov')) || 'не все в одном ряду' },
        { name: 'На телефоне карточки по одной в ряд', at: 360, check: h => { const r = h.$$('.cov').map(e => e.getBoundingClientRect()); return r.every((x, i) => i === 0 || x.top > r[i - 1].bottom - 1) || 'карточки стоят рядом'; } },
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'Промежуток между карточками 16px', check: h => { const [a, b] = h.$$('.cov').map(e => e.getBoundingClientRect()); return near(b.left - a.right, 16) || `сейчас ${Math.round(b.left - a.right)}px`; } },
        { name: 'У каждой карточки цветная полоса сверху 4px', check: h => h.$$('.cov').every(e => h.cs(e, 'border-top-width') === '4px' && h.cs(e, 'border-top-style') === 'solid') || 'нет полосы 4px' }
      ]
    },
    {
      id: 't09', mech: 'assemble', title: 'Окно у костра', level: 'Сложное', minutes: 25, points: 200, module: 'm2',
      story: 'При отдыхе у костра должно появляться окно «Уровень повышен». Сейчас оно где-то в углу и без затемнения.',
      goal: 'Собери модальное окно: затемнение на весь экран, окно ровно по центру, у окна роль dialog и заголовок, кнопка закрытия с понятным именем.',
      html: `<main><h1>Храм огня</h1><p>Вы отдыхаете у костра.</p></main>
<!-- модальное окно -->`,
      css: `body { margin: 0; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }
main { padding: 24px; }
/* затемнение и окно */`,
      fragments: [
        { lang: 'html', label: 'Окно', code: '<div class="overlay">\n  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">\n    <h2 id="m-title">Уровень повышен</h2>\n    <p>Сила: 12 → 13</p>\n    <button type="button" class="close" aria-label="Закрыть окно">✕</button>\n  </section>\n</div>' },
        { lang: 'html', label: 'Окно (ловушка)', code: '<div class="modal"><b>Уровень повышен</b><span class="close">x</span></div>', trap: true },
        { lang: 'css', label: 'Затемнение', code: '.overlay { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.7); }' },
        { lang: 'css', label: 'Окно', code: '.modal { position: relative; width: min(360px, 90%); padding: 24px; background: #241f2b; border: 2px solid #c9a45c; }\n.close { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; background: none; border: 0; color: #e6dcc6; font-size: 20px; cursor: pointer; }' },
        { lang: 'css', label: 'Окно (ловушка)', code: '.modal { margin-left: 300px; margin-top: 200px; }', trap: true }
      ],
      tests: [
        { name: 'У окна роль dialog и подпись через aria-labelledby', check: h => { const m = h.$('[role=dialog],dialog'); return !!(m && m.getAttribute('aria-labelledby') && h.doc.getElementById(m.getAttribute('aria-labelledby'))) || 'нет role="dialog" или aria-labelledby'; } },
        { name: 'Затемнение закрывает весь экран', check: h => { const r = h.rect('.overlay'); return !!r && near(r.left, 0) && near(r.top, 0) && near(r.width, h.width) && near(r.height, h.height) || 'затемнение не на весь экран'; } },
        { name: 'Окно стоит по центру экрана', check: h => { const r = h.rect('[role=dialog],dialog'); return !!r && near(r.left + r.width / 2, h.width / 2, 2) && near(r.top + r.height / 2, h.height / 2, 2) || 'окно не по центру'; } },
        { name: 'Кнопка закрытия — button с понятным именем', check: h => { const b = h.$('[role=dialog] button,dialog button'); return !!(b && (b.getAttribute('aria-label') || '').length > 3) || 'нет кнопки с aria-label'; } }
      ]
    },
    {
      id: 't10', mech: 'assemble', title: 'Таблица рекордов', level: 'Среднее', minutes: 20, points: 150, module: 'm1',
      story: 'Хранитель ведёт учёт павших боссов. Нужна честная таблица, а не стопка div.',
      goal: 'Собери таблицу: подпись caption, заголовки столбцов th scope="col", минимум три строки данных, чётные строки другого цвета, числа справа.',
      html: `<table class="records">
  <!-- подпись, шапка, строки -->
</table>`,
      css: `${BASE}
.records { border-collapse: collapse; width: 100%; max-width: 560px; }
.records th, .records td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #5a5066; }
/* зебра и числа */`,
      fragments: [
        { lang: 'html', label: 'Подпись', code: '<caption>Павшие боссы</caption>' },
        { lang: 'html', label: 'Шапка', code: '<thead>\n    <tr><th scope="col">Босс</th><th scope="col">Попыток</th><th scope="col">Души</th></tr>\n  </thead>' },
        { lang: 'html', label: 'Строки', code: '<tbody>\n    <tr><td>Гвин</td><td class="num">12</td><td class="num">70 000</td></tr>\n    <tr><td>Орнштейн и Смоуг</td><td class="num">27</td><td class="num">50 000</td></tr>\n    <tr><td>Арториас</td><td class="num">9</td><td class="num">50 000</td></tr>\n  </tbody>' },
        { lang: 'html', label: 'Строки (ловушка)', code: '<div class="row"><div>Гвин</div><div>12</div></div>', trap: true },
        { lang: 'css', label: 'Зебра', code: '.records tbody tr:nth-child(even) { background: #241f2b; }' },
        { lang: 'css', label: 'Числа', code: '.records .num { text-align: right; font-variant-numeric: tabular-nums; }' }
      ],
      tests: [
        { name: 'У таблицы есть подпись caption', check: h => h.text('table caption').length > 2 || 'нет caption' },
        { name: 'Заголовки столбцов — th с scope="col"', check: h => h.count('thead th') >= 2 && h.$$('thead th').every(t => t.scope === 'col') || 'нет th scope="col"' },
        { name: 'Не меньше трёх строк с данными', check: h => h.count('tbody tr') >= 3 || `строк: ${h.count('tbody tr')}` },
        { name: 'Чётные строки другого цвета', check: h => { const r = h.$$('tbody tr'); return r.length > 1 && h.cs(r[0], 'background-color') !== h.cs(r[1], 'background-color') || 'зебры нет'; } },
        { name: 'Числа выровнены по правому краю', check: h => h.count('td.num') > 0 && h.$$('td.num').every(td => h.cs(td, 'text-align') === 'right') || 'числа не справа' }
      ]
    },

    /* ===================== Оптимизируй код ===================== */
    {
      id: 't11', mech: 'optimize', title: 'Три одинаковые кнопки', level: 'Лёгкое', minutes: 15, points: 100, module: 'm2',
      story: 'Кузнец Андрэ выковал три кнопки и для каждой переписал все стили заново. Металла ушло втрое больше.',
      goal: 'Вынеси общие свойства в класс .btn, а цвета оставь в модификаторах. Внешний вид не должен измениться, CSS — не длиннее 420 символов без пробелов.',
      html: `<div class="actions">
  <button type="button" class="btn-fire">Огонь</button>
  <button type="button" class="btn-moon">Луна</button>
  <button type="button" class="btn-gold">Золото</button>
</div>`,
      css: `${BASE}
.btn-fire { padding: 10px 18px; font-size: 16px; font-family: Arial, sans-serif; border: 2px solid #f2d58a; color: #1b1620 !important; background: #e8772e; cursor: pointer; }
.btn-moon { padding: 10px 18px; font-size: 16px; font-family: Arial, sans-serif; border: 2px solid #f2d58a; color: #1b1620 !important; background: #8fc3ff; cursor: pointer; }
.btn-gold { padding: 10px 18px; font-size: 16px; font-family: Arial, sans-serif; border: 2px solid #f2d58a; color: #1b1620 !important; background: #c9a45c; cursor: pointer; }`,
      tests: [
        { name: 'Кнопки выглядят как раньше', check: h => {
          const want = { 'Огонь': '#e8772e', 'Луна': '#8fc3ff', 'Золото': '#c9a45c' };
          const bs = h.$$('button');
          return bs.length === 3 && bs.every(b => h.cs(b, 'background-color') === rgb(want[b.textContent.trim()] || '#000') && h.cs(b, 'padding') === '10px 18px' && h.cs(b, 'font-size') === '16px' && h.cs(b, 'color') === rgb('#1b1620') && h.cs(b, 'border-top-color') === rgb('#f2d58a')) || 'цвет, отступы или рамка изменились';
        } },
        { name: 'Общие стили в одном классе .btn у всех кнопок', check: h => h.$$('button').every(b => b.classList.contains('btn')) && h.rules.some(r => r.selector === '.btn' && r.style.getPropertyValue('padding-top')) || 'нет общего .btn' },
        { name: 'CSS не длиннее 420 символов без пробелов', check: h => h.cssSize() <= 420 || `сейчас ${h.cssSize()}` }
      ]
    },
    {
      id: 't12', mech: 'optimize', title: 'Селектор в шесть этажей', level: 'Среднее', minutes: 20, points: 150, module: 'm2',
      story: 'Чтобы покрасить ссылку, кто-то прошёл через шесть этажей склепа. Переопределить такое почти невозможно.',
      goal: 'Упрости селекторы: не больше двух частей в каждом и без id. Список боссов должен выглядеть как раньше.',
      html: `<div class="page"><div class="content">
  <ul class="list" id="bosses">
    <li class="item"><a class="link" href="#">Гвин, Повелитель пепла</a></li>
    <li class="item"><a class="link" href="#">Нито, Первый из мёртвых</a></li>
    <li class="item"><a class="link" href="#">Сит Бесчешуйный</a></li>
    <li class="item"><a class="link" href="#">Ложе Хаоса</a></li>
  </ul>
</div></div>`,
      css: `body { margin: 0; padding: 24px; background: #16131a; font-family: Arial, sans-serif; }
body div.page div.content ul#bosses.list { list-style: none; margin: 0; padding: 0; }
body div.page div.content ul#bosses.list li.item { border-bottom: 1px solid #5a5066; }
body div.page div.content ul#bosses.list li.item a.link { display: block; padding: 12px; color: #f2d58a; text-decoration: none; }
body div.page div.content ul#bosses.list li.item a.link:hover { color: #e8772e; }`,
      tests: [
        { name: 'Ссылки выглядят как раньше', check: h => h.$$('.link').every(a => h.cs(a, 'display') === 'block' && h.cs(a, 'padding') === '12px' && h.cs(a, 'color') === rgb('#f2d58a') && h.cs(a, 'text-decoration-line') === 'none') && h.cs('.list', 'list-style-type') === 'none' && h.cs('.item', 'border-bottom-width') === '1px' || 'вид изменился' },
        { name: 'В каждом селекторе не больше двух частей', check: h => h.maxDepth() <= 2 || `самый длинный: ${h.maxDepth()} частей` },
        { name: 'В селекторах нет id', check: h => !h.rules.some(r => r.selector.includes('#')) || 'есть селектор с #' },
        { name: 'Подсветка при наведении осталась', check: h => h.rules.some(r => /:hover/.test(r.selector) && r.style.getPropertyValue('color')) || 'нет :hover' }
      ]
    },
    {
      id: 't13', mech: 'optimize', title: 'Цвета без системы', level: 'Среднее', minutes: 20, points: 150, module: 'm2',
      story: 'Золото и пламя повторяются в стилях десяток раз. Решили сменить оттенок — придётся искать по всему файлу.',
      goal: 'Заведи CSS-переменные в :root (минимум три) и используй их. Каждый из цветов #c9a45c и #e8772e должен встречаться в CSS не больше одного раза. Вид не меняется.',
      html: `<header class="hero">
  <h1>Пепельный Пиксель</h1>
  <p>Школа вёрстки для негорящих.</p>
  <a class="btn" href="#">Начать путь</a>
</header>
<footer class="foot">Хвала солнцу</footer>`,
      css: `body { margin: 0; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }
.hero { padding: 32px 24px; border-bottom: 2px solid #c9a45c; }
.hero h1 { margin: 0 0 8px; color: #c9a45c; }
.btn { display: inline-block; padding: 10px 18px; background: #e8772e; color: #16131a; border: 2px solid #c9a45c; text-decoration: none; }
.btn:hover { background: #c9a45c; }
.foot { padding: 16px 24px; color: #e8772e; border-top: 2px solid #c9a45c; }`,
      tests: [
        { name: 'В :root объявлено не меньше трёх переменных', check: h => (h.css.match(/:root\s*\{[^}]*\}/)?.[0].match(/--[\w-]+\s*:/g) || []).length >= 3 || 'переменных в :root меньше трёх' },
        { name: 'Цвет #c9a45c записан в CSS один раз', check: h => h.occurrences('#c9a45c') <= 1 || `встречается ${h.occurrences('#c9a45c')} раз` },
        { name: 'Цвет #e8772e записан в CSS один раз', check: h => h.occurrences('#e8772e') <= 1 || `встречается ${h.occurrences('#e8772e')} раз` },
        { name: 'Всё выглядит как раньше', check: h => h.cs('.hero h1', 'color') === rgb('#c9a45c') && h.cs('.btn', 'background-color') === rgb('#e8772e') && h.cs('.btn', 'border-top-color') === rgb('#c9a45c') && h.cs('.foot', 'color') === rgb('#e8772e') && h.cs('.hero', 'border-bottom-color') === rgb('#c9a45c') || 'какой-то цвет изменился' }
      ]
    },
    {
      id: 't14', mech: 'optimize', title: 'Отступы на костылях', level: 'Среднее', minutes: 20, points: 150, module: 'm2',
      story: 'Плитки инвентаря держатся на float, clearfix и отрицательных margin. Одно неловкое движение — и всё рассыплется.',
      goal: 'Перепиши ряд на flex или grid с gap 20px. Никаких float и clear. Плитки остаются 120 × 80px.',
      html: `<div class="row">
  <div class="tile">Эстус</div>
  <div class="tile">Пепельный эстус</div>
  <div class="tile">Душа героя</div>
  <div class="tile">Титанит</div>
</div>`,
      css: `${BASE}
.row::after { content: ""; display: table; clear: both; }
.tile { float: left; width: 120px; height: 80px; margin-right: 20px; padding: 8px; box-sizing: border-box; background: #241f2b; border: 2px solid #5a5066; }
.tile:last-child { margin-right: 0; }`,
      tests: [
        { name: 'Ряд собран на flex или grid', check: h => ['flex', 'grid'].includes(h.cs('.row', 'display')) || `display: ${h.cs('.row', 'display')}` },
        { name: 'В CSS нет float и clear', check: h => !h.has(/\b(float|clear)\s*:/) || 'float или clear остались' },
        { name: 'Между плитками ровно 20px', check: h => { const r = h.$$('.tile').map(e => e.getBoundingClientRect()); return r.slice(1).every((x, i) => near(x.left - r[i].right, 20)) || 'расстояния не 20px'; } },
        { name: 'Плитки 120 × 80px в один ряд', check: h => h.sameRow(h.$$('.tile')) && h.$$('.tile').every(t => near(t.getBoundingClientRect().width, 120) && near(t.getBoundingClientRect().height, 80)) || 'размер плиток изменился' }
      ]
    },
    {
      id: 't15', mech: 'optimize', title: 'Тяжёлый лендинг', level: 'Сложное', minutes: 25, points: 200, module: 'm2',
      story: 'Лендинг школы грузится, как гигант Изалита. В стилях дубли, пустые правила и длинные записи.',
      goal: 'Убери пустые и повторяющиеся правила, запиши отступы сокращённо, сократи CSS до 380 символов без пробелов. Вид не меняется.',
      html: `<section class="hero">
  <h1 class="title">Стань сеньором</h1>
  <p class="lead">Сорок уроков, двадцать пять испытаний, один костёр.</p>
  <a class="cta" href="#">Записаться</a>
</section>`,
      css: `body { margin: 0px; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }
.hero { padding-top: 40px; padding-right: 24px; padding-bottom: 40px; padding-left: 24px; text-align: center; }
.title { font-size: 36px; margin-top: 0px; margin-right: 0px; margin-bottom: 12px; margin-left: 0px; }
.lead { color: #c9b89a; }
.lead { font-size: 18px; }
.subtitle { }
.cta { display: inline-block; padding-top: 12px; padding-right: 24px; padding-bottom: 12px; padding-left: 24px; background: #e8772e; color: #16131a; text-decoration: none; }
.cta { font-weight: bold; }
.old-banner { }`,
      tests: [
        { name: 'Вид не изменился', check: h => h.cs('.hero', 'padding') === '40px 24px' && h.cs('.hero', 'text-align') === 'center' && h.px('.title', 'font-size') === 36 && h.cs('.title', 'margin') === '0px 0px 12px' && h.cs('.lead', 'color') === rgb('#c9b89a') && h.px('.lead', 'font-size') === 18 && h.cs('.cta', 'padding') === '12px 24px' && h.cs('.cta', 'font-weight') === '700' || 'что-то поменялось' },
        { name: 'Отступы записаны сокращённо', check: h => !h.has(/(margin|padding)-(top|right|bottom|left)\s*:/) || 'остались margin-top и подобные' },
        { name: 'Нет пустых правил и дублей селекторов', check: h => { const s = h.rules.map(r => r.selector); return !h.rules.some(r => r.empty) && new Set(s).size === s.length || 'есть пустые или повторы'; } },
        { name: 'CSS не длиннее 380 символов без пробелов', check: h => h.cssSize() <= 380 || `сейчас ${h.cssSize()}` }
      ]
    },

    /* ===================== Адаптив за 5 минут ===================== */
    {
      id: 't16', mech: 'adaptive', title: 'Шапка на телефоне', level: 'Лёгкое', minutes: 5, points: 100, module: 'm3',
      story: 'На телефоне шапка уезжает за край экрана: шириной она в огромный щит Хавела.',
      goal: 'На 360px не должно быть горизонтальной прокрутки, все пункты меню видны. На компьютере логотип и меню остаются в одну строку.',
      html: `<header class="top">
  <a class="logo" href="#">Пепельный Пиксель</a>
  <nav aria-label="Главное меню">
    <ul class="menu">
      <li><a href="#">Уроки</a></li>
      <li><a href="#">Задания</a></li>
      <li><a href="#">Магазин</a></li>
      <li><a href="#">Лидеры</a></li>
    </ul>
  </nav>
</header>`,
      css: `body { margin: 0; background: #16131a; font-family: Arial, sans-serif; }
.top { display: flex; align-items: center; justify-content: space-between; width: 960px; padding: 16px 24px; box-sizing: border-box; background: #241f2b; }
.logo { color: #f2d58a; font-weight: bold; text-decoration: none; white-space: nowrap; }
.menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
.menu a { color: #e6dcc6; text-decoration: none; }`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире 360px' },
        { name: 'На телефоне все пункты меню в пределах экрана', at: 360, check: h => h.$$('.menu a').every(a => a.getBoundingClientRect().right <= h.width + 0.5) || 'пункт за краем' },
        { name: 'На компьютере логотип и меню в одну строку', check: h => near(h.rect('.logo').top + h.rect('.logo').height / 2, h.rect('.menu').top + h.rect('.menu').height / 2, 4) || 'меню ушло на новую строку' }
      ]
    },
    {
      id: 't17', mech: 'adaptive', title: 'Колонки в стопку', level: 'Лёгкое', minutes: 5, points: 100, module: 'm3',
      story: 'Три колонки снаряжения на телефоне сжаты в щёлку. Негорящий не видит, что надевает.',
      goal: 'На 360px колонки идут одна под другой без горизонтальной прокрутки, на компьютере — три в ряд.',
      html: `<section class="gear">
  <article class="col"><h2>Оружие</h2><p>Меч Арториаса, +10</p></article>
  <article class="col"><h2>Броня</h2><p>Доспех Хавела</p></article>
  <article class="col"><h2>Кольца</h2><p>Кольцо Волка</p></article>
</section>`,
      css: `${BASE}
.gear { display: grid; grid-template-columns: 300px 300px 300px; gap: 16px; }
.col { padding: 16px; background: #241f2b; }
.col h2 { margin: 0 0 8px; }`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире 360px' },
        { name: 'На телефоне колонки одна под другой', at: 360, check: h => { const r = h.$$('.col').map(e => e.getBoundingClientRect()); return r.every((x, i) => i === 0 || x.top >= r[i - 1].bottom - 1) || 'колонки рядом'; } },
        { name: 'На компьютере три колонки в ряд', check: h => h.sameRow(h.$$('.col')) || 'колонки не в ряд' }
      ]
    },
    {
      id: 't18', mech: 'adaptive', title: 'Резиновая картинка', level: 'Среднее', minutes: 5, points: 150, module: 'm3',
      story: 'Картина Анор Лондо на телефоне вылезает за экран, а текст под ней мелкий, как надписи на могильных плитах.',
      goal: 'На 360px картинка помещается в экран и сохраняет пропорции 2:1, текст не меньше 16px. На компьютере колонка текста не шире 700px.',
      html: `<article class="post">
  <img class="cover" src="${IMG}" alt="Анор Лондо на закате" width="800" height="400">
  <h1>Город богов</h1>
  <p>Анор Лондо сияет вечным закатом. Говорят, солнце здесь держится только на иллюзии.</p>
</article>`,
      css: `${BASE}
.post { width: 700px; }
.cover { width: 800px; }
.post p { font-size: 14px; line-height: 1.5; }`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире 360px' },
        { name: 'На телефоне картинка помещается в экран', at: 360, check: h => h.rect('.cover').right <= h.width + 0.5 || 'картинка за краем' },
        { name: 'Картинка сохраняет пропорции 2:1', at: 360, check: h => { const r = h.rect('.cover'); return near(r.width / r.height, 2, 0.05) || 'картинка сплющена'; } },
        { name: 'Текст статьи не меньше 16px', at: 360, check: h => h.px('.post p', 'font-size') >= 16 || `сейчас ${h.px('.post p', 'font-size')}px` },
        { name: 'На компьютере колонка текста не шире 700px', check: h => h.rect('.post').width <= 700.5 || 'колонка шире 700px' }
      ]
    },
    {
      id: 't19', mech: 'adaptive', title: 'Таблица не помещается', level: 'Среднее', minutes: 5, points: 150, module: 'm3',
      story: 'Таблица характеристик оружия на телефоне растягивает всю страницу вбок.',
      goal: 'На 360px страница не прокручивается вбок, а таблица прокручивается внутри своей обёртки .table-wrap. На компьютере таблица видна целиком.',
      html: `<h1>Оружие</h1>
<div class="table-wrap">
  <table>
    <caption>Характеристики</caption>
    <thead><tr><th scope="col">Название</th><th scope="col">Урон</th><th scope="col">Вес</th><th scope="col">Сила</th><th scope="col">Ловкость</th><th scope="col">Тип</th></tr></thead>
    <tbody>
      <tr><td>Длинный меч</td><td>80</td><td>3.0</td><td>10</td><td>10</td><td>Режущий</td></tr>
      <tr><td>Клеймор</td><td>138</td><td>9.0</td><td>16</td><td>10</td><td>Режущий</td></tr>
      <tr><td>Меч Арториаса</td><td>160</td><td>6.0</td><td>24</td><td>14</td><td>Режущий</td></tr>
    </tbody>
  </table>
</div>`,
      css: `${BASE}
table { border-collapse: collapse; min-width: 640px; }
th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #5a5066; }`,
      tests: [
        { name: 'На телефоне страница не прокручивается вбок', at: 360, check: h => !h.overflow() || 'страница шире 360px' },
        { name: 'На телефоне таблица прокручивается внутри .table-wrap', at: 360, check: h => { const w = h.$('.table-wrap'); return ['auto', 'scroll'].includes(h.cs(w, 'overflow-x')) && w.scrollWidth > w.clientWidth || 'обёртка не прокручивается'; } },
        { name: 'На компьютере таблица видна целиком', check: h => { const w = h.$('.table-wrap'); return w.scrollWidth <= w.clientWidth + 1 || 'таблица обрезана'; } }
      ]
    },
    {
      id: 't20', mech: 'adaptive', title: 'Кнопки под палец', level: 'Сложное', minutes: 5, points: 200, module: 'm3',
      story: 'На телефоне кнопки «Принять» и «Отказаться» крошечные и стоят вплотную. Негорящие вступают не в тот ковенант.',
      goal: 'На 360px кнопки во всю ширину блока, одна под другой и высотой не меньше 44px. На компьютере — в один ряд.',
      html: `<section class="offer">
  <h2>Вступить в ковенант Тёмных духов?</h2>
  <div class="actions">
    <a class="btn yes" href="#">Принять</a>
    <a class="btn no" href="#">Отказаться</a>
  </div>
</section>`,
      css: `${BASE}
.actions { display: flex; gap: 12px; }
.btn { padding: 4px 8px; font-size: 13px; text-decoration: none; border: 2px solid #c9a45c; }
.yes { background: #e8772e; color: #16131a; }
.no { color: #e6dcc6; }`,
      tests: [
        { name: 'На телефоне кнопки во всю ширину блока', at: 360, check: h => h.$$('.btn').every(b => near(b.getBoundingClientRect().width, h.rect('.actions').width)) || 'кнопки не во всю ширину' },
        { name: 'На телефоне кнопки одна под другой', at: 360, check: h => h.rect('.no').top >= h.rect('.yes').bottom - 1 || 'кнопки рядом' },
        { name: 'На телефоне кнопки высотой не меньше 44px', at: 360, check: h => h.$$('.btn').every(b => b.getBoundingClientRect().height >= 44) || `высота ${Math.round(h.rect('.btn').height)}px` },
        { name: 'На компьютере кнопки в один ряд', check: h => h.sameRow(h.$$('.btn')) || 'кнопки не в ряд' }
      ]
    },

    /* ===================== Доступность и семантика ===================== */
    {
      id: 't21', mech: 'a11y', title: 'Суп из div', level: 'Лёгкое', minutes: 15, points: 100, module: 'm1',
      story: 'Экранный диктор читает страницу костра как «группа, группа, группа». Незрячий негорящий не может найти меню.',
      goal: 'Замени div на смысловые теги: header, nav, main, article, footer. На странице один h1, у статьи заголовок h2.',
      html: `<div class="header">
  <div class="title">Пепельный Пиксель</div>
  <div class="nav"><a href="#">Уроки</a> <a href="#">Задания</a></div>
</div>
<div class="main">
  <div class="post">
    <div class="post-title">Как зажечь костёр</div>
    <p>Подойди к костру и нажми «Зажечь». Он станет точкой возрождения.</p>
  </div>
</div>
<div class="footer">© Эпоха огня</div>`,
      css: `${BASE}
.title { font-size: 28px; font-weight: bold; }
.post-title { font-size: 22px; font-weight: bold; }
a { color: #f2d58a; }`,
      skipQuality: ['unused'],
      tests: [
        { name: 'Есть header, nav, main и footer', check: h => ['header', 'nav', 'main', 'footer'].every(t => h.$(t)) || 'не все смысловые теги на месте' },
        { name: 'Статья — article с заголовком h2', check: h => !!h.$('main article h2') || 'нет article с h2 внутри main' },
        { name: 'На странице ровно один h1', check: h => h.count('h1') === 1 || `h1: ${h.count('h1')}` },
        { name: 'Не осталось div вместо смысловых тегов', check: h => !h.$('div.header, div.nav, div.main, div.footer, div.post') || 'остались div.header и подобные' }
      ]
    },
    {
      id: 't22', mech: 'a11y', title: 'Картинки без слов', level: 'Среднее', minutes: 15, points: 150, module: 'm1',
      story: 'Страница босса полна картинок и иконок, но для экранного диктора это «картинка, картинка, кнопка».',
      goal: 'Опиши информативные картинки в alt, декоративному разделителю дай пустой alt, кнопкам-иконкам — aria-label, ссылке «тут» — понятный текст.',
      html: `<article class="boss">
  <h1>Ложе Хаоса</h1>
  <img class="art" src="${IMG}" width="300" height="150">
  <img class="divider" src="${ICON}" width="24" height="24">
  <p>Где искать: <img class="map" src="${IMG}" width="120" height="60"></p>
  <button type="button" class="icon-btn"><img src="${ICON}" alt=""></button>
  <p>Тактика боя — <a href="#tactics">тут</a>.</p>
</article>`,
      css: `${BASE}
.icon-btn { width: 44px; height: 44px; background: #241f2b; border: 2px solid #c9a45c; }
a { color: #f2d58a; }`,
      tests: [
        { name: 'У всех картинок есть атрибут alt', check: h => !h.$('img:not([alt])') || 'есть картинки без alt' },
        { name: 'Декоративный разделитель с пустым alt=""', check: h => h.$('img.divider')?.getAttribute('alt') === '' || 'у разделителя alt не пустой' },
        { name: 'Информативные картинки описаны (alt длиннее 5 символов)', check: h => ['img.art', 'img.map'].every(s => (h.$(s)?.alt || '').trim().length > 5) || 'опиши .art и .map' },
        { name: 'Кнопка-иконка названа через aria-label', check: h => (h.$('.icon-btn')?.getAttribute('aria-label') || '').trim().length > 2 || 'нет aria-label' },
        { name: 'Нет ссылок с текстом «тут», «здесь», «подробнее»', check: h => !h.$$('a').some(a => /^(тут|здесь|подробнее|сюда)$/i.test(a.textContent.trim())) || 'ссылка «тут» осталась' }
      ]
    },
    {
      id: 't23', mech: 'a11y', title: 'Нечитаемый текст', level: 'Среднее', minutes: 15, points: 150, module: 'm2',
      story: 'Подсказки написаны серым по тёмному, а кнопка — светло-золотым по белому. Даже Сигмайер щурится.',
      goal: 'Подними контраст до WCAG AA (4,5:1) у основного текста, подсказки и кнопки, а основной текст сделай не меньше 16px.',
      html: `<section class="card">
  <h2>Совет у костра</h2>
  <p class="lead">Не бейся с драконом без щита с защитой от огня.</p>
  <p class="hint">Щит можно купить у Андрэ за 2000 душ.</p>
  <a class="btn" href="#">Купить щит</a>
</section>`,
      css: `${BASE}
.card { max-width: 420px; padding: 20px; background: #241f2b; }
.lead { font-size: 13px; color: #6e665a; }
.hint { font-size: 14px; color: #4a4238; }
.btn { display: inline-block; padding: 12px 18px; background: #ffffff; color: #f2d58a; text-decoration: none; }`,
      tests: [
        { name: 'Основной текст: контраст не ниже 4,5:1', check: h => h.contrast('.lead') >= 4.5 || `сейчас ${h.contrast('.lead').toFixed(2)}:1` },
        { name: 'Подсказка: контраст не ниже 4,5:1', check: h => h.contrast('.hint') >= 4.5 || `сейчас ${h.contrast('.hint').toFixed(2)}:1` },
        { name: 'Кнопка: контраст не ниже 4,5:1', check: h => h.contrast('.btn') >= 4.5 || `сейчас ${h.contrast('.btn').toFixed(2)}:1` },
        { name: 'Основной текст не меньше 16px', check: h => h.px('.lead', 'font-size') >= 16 || `сейчас ${h.px('.lead', 'font-size')}px` }
      ]
    },
    {
      id: 't24', mech: 'a11y', title: 'Форма без подписей', level: 'Сложное', minutes: 20, points: 200, module: 'm1',
      story: 'Регистрация на турнир у арены: вместо подписей — серые подсказки внутри полей, которые исчезают при вводе.',
      goal: 'Подпиши каждое поле через label, сгруппируй выбор класса в fieldset с legend, свяжи подсказку к паролю через aria-describedby, отметь обязательные поля required.',
      html: `<form class="arena" action="#">
  <h2>Турнир на арене</h2>
  <input id="hero" type="text" placeholder="Имя героя">
  <input id="pass" type="password" placeholder="Пароль">
  <p id="pass-hint" class="hint">Не меньше 8 символов.</p>
  <div class="classes">
    Класс:
    <label><input type="radio" name="cls" value="knight"> Рыцарь</label>
    <label><input type="radio" name="cls" value="sorcerer"> Чародей</label>
  </div>
  <button type="submit">Записаться</button>
</form>`,
      css: `${BASE}
.arena { display: grid; gap: 12px; max-width: 360px; }
.arena input[type=text], .arena input[type=password] { padding: 10px; }
.hint { margin: 0; font-size: 14px; color: #c9b89a; }
button { padding: 12px; background: #e8772e; color: #16131a; border: 0; }`,
      tests: [
        { name: 'Имя и пароль подписаны через label', check: h => ['hero', 'pass'].every(id => h.$(`label[for="${id}"]`)?.textContent.trim()) || 'нет label for' },
        { name: 'Выбор класса в fieldset с legend', check: h => !!h.$('fieldset legend') && h.count('fieldset input[type=radio]') === 2 || 'нет fieldset с legend' },
        { name: 'Подсказка связана с паролем через aria-describedby', check: h => (h.$('#pass')?.getAttribute('aria-describedby') || '').split(' ').includes('pass-hint') || 'нет aria-describedby="pass-hint"' },
        { name: 'Имя и пароль — обязательные поля', check: h => h.$('#hero')?.required && h.$('#pass')?.required || 'нет required' }
      ]
    },
    {
      id: 't25', mech: 'a11y', title: 'Путь без мыши', level: 'Сложное', minutes: 20, points: 200, module: 'm2',
      story: 'Негорящий потерял мышь в Чумном городе. С клавиатуры сайт не пройти: фокус невидим, «кнопки» не нажимаются.',
      goal: 'Верни видимый фокус (стиль :focus-visible), замени div-кнопки на button, убери tabindex больше 0 и добавь первую ссылку «Перейти к содержимому» на main.',
      html: `<header class="top">
  <a href="#" tabindex="3">Пепельный Пиксель</a>
</header>
<main>
  <h1>Чумной город</h1>
  <div class="btn" onclick="rest()">Отдохнуть у костра</div>
  <div class="btn" onclick="leave()">Уйти</div>
</main>`,
      css: `${BASE}
*:focus { outline: none; }
.top a { color: #f2d58a; }
.btn { display: inline-block; padding: 12px 18px; margin-right: 8px; background: #241f2b; color: #e6dcc6; border: 2px solid #c9a45c; cursor: pointer; font: inherit; }`,
      tests: [
        { name: 'Фокус виден: есть стиль :focus-visible с outline или box-shadow', check: h => h.rules.some(r => /:focus(-visible)?/.test(r.selector) && ((r.style.getPropertyValue('outline-style') && r.style.getPropertyValue('outline-style') !== 'none') || r.style.getPropertyValue('box-shadow'))) || 'нет видимого стиля фокуса' },
        { name: 'Нигде не отключён outline без замены', check: h => !h.rules.some(r => r.style.getPropertyValue('outline-style') === 'none' && !r.style.getPropertyValue('box-shadow')) || 'outline: none без замены' },
        { name: 'Действия — настоящие кнопки button', check: h => h.count('main button') >= 2 && !h.$('[onclick]') && !h.$('div.btn') || 'остались div с onclick' },
        { name: 'Нет tabindex больше 0', check: h => !h.$$('[tabindex]').some(e => +e.getAttribute('tabindex') > 0) || 'есть tabindex > 0' },
        { name: 'Первая ссылка — «Перейти к содержимому» на main', check: h => { const a = h.$('a[href]'); const id = (a?.getAttribute('href') || '').slice(1); return !!(a && /содержим/i.test(a.textContent) && id && h.$('main')?.id === id) || 'первая ссылка не ведёт на main'; } }
      ]
    }
  ];

  window.TASKS = T;
  window.TASK_MECHANICS = MECHANICS;
})();
