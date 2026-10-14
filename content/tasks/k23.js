/* Занятие 23. Практическая работа №5 (ч. 1). Вёрстка страницы по макету */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  window.COURSE_TASKS.push(
    {
      id: 'k2301', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: шапка и первый экран', level: 'Среднее', minutes: 30, points: 150,
      story: 'Кофейня «Зерно» у колледжа заказала одностраничный сайт — лендинг. Начинаем сверху: шапка и первый экран с главным призывом.',
      goal: 'В секции .hero напишите заголовок h1 (не короче 10 символов), абзац p и ссылку-кнопку a с классом btn. Шапка .header — flex: логотип слева, меню справа (space-between), по центру по высоте. Пункты .menu — в ряд через flex с gap не меньше 16px. Первый экран: фон — линейный градиент (linear-gradient) в тёмных тонах, текст белый (#ffffff), padding сверху и снизу не меньше 48px, размер h1 не меньше 40px. Кнопка .btn: display: inline-block, padding сверху не меньше 10px, скругление не меньше 8px, фон var(--accent) и белый текст, transition и правило .btn:hover.',
      hints: [
        'HTML первого экрана: <h1>Кофе, который ждёт вас между парами</h1>, потом <p>…</p> и <a class="btn" href="#menu">Посмотреть меню</a>.',
        'Шапка — как на занятии про Flexbox: .header { display: flex; justify-content: space-between; align-items: center; }',
        'Градиент пишется в background-image: linear-gradient(135deg, #3b2416, #6b3d1f); Белый текст: color: #ffffff;',
        'Кнопка: .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background-color: var(--accent); color: #ffffff; text-decoration: none; transition: background-color 0.2s; } и .btn:hover { background-color: #7d3f14; }'
      ],
      html: `<header class="header">
  <a class="header__logo" href="#top">Зерно</a>
  <nav>
    <ul class="menu">
      <li><a href="#menu">Меню</a></li>
      <li><a href="#about">О нас</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<section class="hero">
  <!-- Напишите здесь заголовок h1, абзац p и ссылку-кнопку a с классом btn -->
</section>`,
      css: `${BASE}
${PALETTE}
.header {
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  margin: 0;
  padding: 0;
  list-style: none;
}`,
      tests: [
        { name: 'В первом экране h1, абзац и ссылка-кнопка .btn', check: h => {
          if (h.count('.hero h1') !== 1 || h.text('.hero h1').length < 10) return 'нужен один h1 не короче 10 символов';
          if (h.text('.hero p').length < 10) return 'нет абзаца с текстом';
          const a = h.$('.hero a.btn');
          return !!(a && a.getAttribute('href') && a.textContent.trim().length >= 3) || 'нет ссылки a.btn с href и текстом';
        } },
        { name: 'Шапка: логотип слева, меню справа, по центру по высоте', check: h => (h.cs('.header', 'display') === 'flex' && h.cs('.header', 'justify-content') === 'space-between' && h.cs('.header', 'align-items') === 'center') || 'у .header нужны display: flex, justify-content: space-between, align-items: center' },
        { name: 'Пункты меню в ряд, gap от 16px', check: h => (h.cs('.menu', 'display') === 'flex' && h.sameRow(h.$$('.menu li')) && h.px('.menu', 'column-gap') >= 16) || 'у .menu нужны display: flex и gap' },
        { name: 'Первый экран на градиенте, текст белый', check: h => {
          if (!/linear-gradient/.test(h.cs('.hero', 'background-image'))) return 'нет linear-gradient у .hero';
          return h.cs('.hero', 'color') === 'rgb(255, 255, 255)' || 'цвет текста .hero не белый';
        } },
        { name: 'Просторный экран: padding сверху и снизу от 48px, h1 от 40px', check: h => {
          if (h.px('.hero', 'padding-top') < 48 || h.px('.hero', 'padding-bottom') < 48) return `padding: ${h.cs('.hero', 'padding-top')} / ${h.cs('.hero', 'padding-bottom')}`;
          return h.px('.hero h1', 'font-size') >= 40 || `h1 сейчас ${h.cs('.hero h1', 'font-size')}`;
        } },
        { name: 'Кнопка: inline-block, отступы, скругление от 8px, фон --accent', check: h => {
          if (!/inline-(block|flex)/.test(h.cs('.btn', 'display'))) return 'нужно display: inline-block';
          if (h.px('.btn', 'padding-top') < 10) return 'маленький padding';
          if (radius(h, '.btn') < 8) return 'скругление меньше 8px';
          return h.cs('.btn', 'background-color') === 'rgb(164, 84, 28)' || 'фон кнопки — var(--accent)';
        } },
        { name: 'Кнопка плавно реагирует на наведение', check: h => (h.cs('.btn', 'transition-duration').split(',').some(d => parseFloat(d) > 0) && h.rules.some(r => /\.btn:hover/.test(r.selector))) || 'нужны transition у .btn и правило .btn:hover' }
      ]
    },
    {
      id: 'k2302', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: преимущества на Flexbox', level: 'Среднее', minutes: 25, points: 150,
      story: 'Второй блок лендинга — три причины зайти в «Зерно». По макету это три одинаковые карточки в ряд, в каждой иконка, заголовок и короткий текст.',
      goal: 'Допишите третье преимущество по образцу: li.feature с иконкой img (alt=""), заголовком h3 «Есть розетки» и абзацем. Список .features__list: без маркеров и отступа слева, flex, gap не меньше 24px; три карточки стоят в один ряд и одинаковой ширины (flex: 1). Иконка .feature__icon — 48×48px. Карточка .feature: фон var(--cream), padding не меньше 16px, скругление не меньше 12px.',
      hints: [
        'Скопируйте любой li.feature целиком и поменяйте текст. Иконка — украшение, поэтому alt пустой.',
        'Маркеры и отступ у списка: list-style: none; padding-left: 0; Потом display: flex; gap: 24px;',
        'Одинаковая ширина: .feature { flex: 1; } Иконке задайте width: 48px; height: 48px;'
      ],
      html: `<section class="features" id="about">
  <h2>Почему к нам заходят между парами</h2>
  <ul class="features__list">
    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Быстро</h3>
      <p>Заказ готов за 5 минут — успеете до звонка.</p>
    </li>
    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Студенческие цены</h3>
      <p>Скидка 15% по студенческому билету.</p>
    </li>
    <!-- Третье преимущество «Есть розетки»: напишите по образцу -->
  </ul>
</section>`,
      css: `${BASE}
${PALETTE}
.features h2 {
  color: var(--coffee);
}
.feature h3 {
  margin: 12px 0 8px;
  color: var(--coffee);
}
.feature p {
  margin: 0;
}`,
      tests: [
        { name: 'Три преимущества: иконка, h3 и абзац; третье — «Есть розетки»', check: h => {
          const f = h.$$('li.feature');
          if (f.length !== 3) return `преимуществ: ${f.length}`;
          if (!f.every(e => e.querySelector('img[alt]') && e.querySelector('h3')?.textContent.trim() && e.querySelector('p')?.textContent.trim().length > 5)) return 'в каждом нужны img с alt, h3 и p';
          return /розетк/i.test(f[2].querySelector('h3').textContent) || 'третий заголовок — «Есть розетки»';
        } },
        { name: 'Список без маркеров и отступа слева', check: h => (h.cs('.features__list', 'list-style-type') === 'none' && h.px('.features__list', 'padding-left') === 0) || 'нужны list-style: none и padding-left: 0' },
        { name: 'Список — flex с gap от 24px', check: h => (h.cs('.features__list', 'display') === 'flex' && h.px('.features__list', 'column-gap') >= 24) || 'нужны display: flex и gap: 24px' },
        { name: 'Три карточки в ряд одинаковой ширины', check: h => { const f = h.$$('.feature'), w = f.map(e => e.getBoundingClientRect().width); return (f.length === 3 && h.sameRow(f) && Math.max(...w) - Math.min(...w) < 2) || 'карточки не в ряд или разной ширины'; } },
        { name: 'Иконки 48×48px', check: h => h.$$('.feature__icon').every(i => { const r = i.getBoundingClientRect(); return Math.abs(r.width - 48) < 1 && Math.abs(r.height - 48) < 1; }) || 'размер иконок не 48×48' },
        { name: 'Карточка: фон --cream, padding от 16px, скругление от 12px', check: h => (h.cs('.feature', 'background-color') === 'rgb(253, 246, 238)' && h.px('.feature', 'padding-top') >= 16 && radius(h, '.feature') >= 12) || 'проверьте фон, padding и border-radius у .feature' }
      ]
    },
    {
      id: 'k2303', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: меню на Grid и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Самый большой блок — меню кофейни: шесть карточек ровной сеткой. Тексты у напитков разной длины, а кнопки «В заказ» по макету стоят на одной линии внизу. Под меню — подвал с контактами.',
      goal: 'Добавьте ещё четыре карточки .product по образцу: Американо, Какао, Чай с чабрецом, Сырник — в каждой картинка с alt, h3, абзац, цена .product__price и ссылка .product__btn. Сетка .catalog__grid: grid, три равные колонки (repeat(3, 1fr)), gap не меньше 24px. Карточка: скругление не меньше 12px, тень box-shadow, картинка во всю ширину карточки. Кнопки «В заказ» в одном ряду стоят на одной линии внизу карточек: сделайте .product и .product__body flex-столбиками (flex-direction: column), .product__body растяните на всю оставшуюся высоту (flex: 1), а кнопке дайте margin-top: auto. Подвал .footer: flex, space-between, align-items: center, тёмный фон и светлый текст.',
      hints: [
        'Скопируйте article.product целиком четыре раза и поменяйте название, описание, цену и alt.',
        'Сетка: .catalog__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }',
        'Столбики: .product, .product__body { display: flex; flex-direction: column; } Тело карточки забирает всю высоту: .product__body { flex: 1; } А кнопка уезжает вниз: .product__btn { margin-top: auto; }',
        'Картинка во всю ширину: .product__img { display: block; width: 100%; height: auto; } Чтобы углы картинки тоже скруглились, у .product добавьте overflow: hidden.'
      ],
      html: `<section class="catalog" id="menu">
  <h2>Меню</h2>
  <div class="catalog__grid">
    <article class="product">
      <img class="product__img" src="img/art.svg" alt="Капучино в белой чашке">
      <div class="product__body">
        <h3>Капучино</h3>
        <p>Эспрессо и молочная пена. 300 мл.</p>
        <p class="product__price">160 ₽</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>
    <article class="product">
      <img class="product__img" src="img/art.svg" alt="Раф в высоком стакане">
      <div class="product__body">
        <h3>Раф ванильный</h3>
        <p>Эспрессо, сливки и ванильный сироп, взбитые вместе. Мягкий и сладкий — любимый напиток первокурсников. 300 мл.</p>
        <p class="product__price">210 ₽</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>
    <!-- Добавьте ещё четыре карточки: Американо 120 ₽, Какао 140 ₽, Чай с чабрецом 90 ₽, Сырник 110 ₽ -->
  </div>
</section>
<footer class="footer" id="contacts">
  <p>Кофейня «Зерно»</p>
  <p>ул. Студенческая, 5 · 8:00–20:00</p>
  <a href="tel:+79990001122">+7 999 000-11-22</a>
</footer>`,
      css: `${BASE}
${PALETTE}
.product__body {
  padding: 16px;
}
.product h3 {
  margin: 0 0 8px;
}
.product__price {
  font-weight: bold;
  color: var(--coffee);
}
.product__btn {
  padding: 10px 16px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шесть карточек: картинка с alt, h3, цена и кнопка', check: h => {
          const p = h.$$('.product');
          if (p.length !== 6) return `карточек: ${p.length}`;
          if (!p.every(e => e.querySelector('img[alt]')?.getAttribute('alt').trim() && e.querySelector('h3')?.textContent.trim() && e.querySelector('.product__price')?.textContent.trim() && e.querySelector('a.product__btn[href]'))) return 'в какой-то карточке не хватает img с alt, h3, цены или кнопки';
          const names = p.map(e => e.querySelector('h3').textContent).join(' ');
          return ['Американо', 'Какао', 'Чай', 'Сырник'].every(n => names.includes(n)) || 'нужны Американо, Какао, Чай с чабрецом и Сырник';
        } },
        { name: 'Сетка: три равные колонки, gap от 24px', check: h => {
          if (h.cs('.catalog__grid', 'display') !== 'grid') return 'у .catalog__grid нет display: grid';
          if (h.px('.catalog__grid', 'column-gap') < 24) return 'gap меньше 24px';
          const p = h.$$('.product').slice(0, 3), w = p.map(e => e.getBoundingClientRect().width);
          return (h.sameRow(p) && Math.max(...w) - Math.min(...w) < 2 && h.cs('.catalog__grid', 'grid-template-columns').split(' ').length === 3) || 'нужно ровно три равные колонки';
        } },
        { name: 'Карточка: скругление от 12px и тень', check: h => (radius(h, '.product') >= 12 && h.cs('.product', 'box-shadow') !== 'none') || 'нужны border-radius и box-shadow у .product' },
        { name: 'Картинка во всю ширину карточки', check: h => h.$$('.product').every(p => Math.abs(p.querySelector('.product__img').getBoundingClientRect().width - p.clientWidth) < 2) || 'картинка уже карточки' },
        { name: 'Кнопки в первом ряду на одной линии внизу карточек', check: h => {
          const b = h.$$('.product__btn').slice(0, 3).map(e => e.getBoundingClientRect().bottom);
          const c = h.$$('.product').slice(0, 3).map(e => e.getBoundingClientRect().bottom);
          if (Math.max(...b) - Math.min(...b) > 1) return 'кнопки на разной высоте';
          return b.every((x, i) => c[i] - x <= 40) || 'кнопки не внизу карточек';
        } },
        { name: 'Подвал: flex, края, по центру по высоте, тёмный фон', check: h => {
          if (!(h.cs('.footer', 'display') === 'flex' && h.cs('.footer', 'justify-content') === 'space-between' && h.cs('.footer', 'align-items') === 'center')) return 'у .footer нужны display: flex, justify-content: space-between, align-items: center';
          const m = h.cs('.footer', 'background-color').match(/\d+/g);
          return (m && (+m[0] + +m[1] + +m[2]) / 3 < 100 && h.cs('.footer', 'background-color') !== 'rgba(0, 0, 0, 0)') || 'фон подвала должен быть тёмным';
        } }
      ]
    }
  );
})();
