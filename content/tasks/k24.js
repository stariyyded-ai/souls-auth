/* Занятие 24. Практическая работа №5 (ч. 2). Адаптивная вёрстка */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const stacked = els => els.every((x, i) => !i || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);
  const noMax = h => !h.rules.some(r => /max-width/.test(r.media));
  window.COURSE_TASKS.push(
    {
      id: 'k2401', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Шапка и первый экран на телефоне', level: 'Среднее', minutes: 30, points: 150,
      story: 'Лендинг «Зерна» открыли на телефоне: страница шире экрана, меню не помещается, заголовок огромный. Переделываем верх страницы по принципу mobile first.',
      goal: 'Базовые стили — для телефона, широкие экраны — в @media (min-width: 768px); медиазапросы с max-width не используйте. У .container вместо width: 960px — max-width: 1200px. На телефоне: шапка столбиком (логотип над меню), у .menu перенос flex-wrap: wrap, заголовок .hero h1 не больше 32px, кнопка .btn во всю ширину первого экрана (display: block, текст по центру). От 768px: шапка в строку (логотип слева, меню справа), h1 не меньше 44px, кнопка снова inline-block. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Начните с контейнера: width: 960px замените на max-width: 1200px. Прокрутка вбок пропадёт.',
        'Шапка на телефоне: .header { flex-direction: column; align-items: flex-start; gap: 12px; } а у .menu добавьте flex-wrap: wrap;',
        'Телефонные значения пишите в обычных правилах: font-size: 30px у h1, display: block; text-align: center; у .btn. Отступы у .hero тоже уменьшите: padding: 32px 20px.',
        'Всё компьютерное — в конце CSS: @media (min-width: 768px) { .header { flex-direction: row; justify-content: space-between; align-items: center; } .hero h1 { font-size: 48px; } .btn { display: inline-block; } }'
      ],
      html: `<div class="container">
  <header class="header">
    <a class="header__logo" href="#top">Зерно</a>
    <nav>
      <ul class="menu">
        <li><a href="#menu">Меню</a></li>
        <li><a href="#about">О нас</a></li>
        <li><a href="#sale">Акции</a></li>
        <li><a href="#jobs">Вакансии</a></li>
        <li><a href="#contacts">Контакты</a></li>
      </ul>
    </nav>
  </header>
  <section class="hero">
    <h1>Кофе, который ждёт вас между парами</h1>
    <p>Свежая обжарка, выпечка каждое утро и скидка по студенческому билету.</p>
    <a class="btn" href="#menu">Посмотреть меню</a>
  </section>
</div>`,
      css: `${BASE}
${PALETTE}
.container {
  width: 960px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 64px 48px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 48px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'У .container max-width: 1200px вместо фиксированной ширины', check: h => (h.cs('.container', 'max-width') === '1200px' && !/(^|[^-])width\s*:\s*960px/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, ''))) || 'замените width: 960px на max-width: 1200px' },
        { name: 'На телефоне логотип над меню, пункты меню переносятся', at: 360, check: h => {
          if (h.rect('.header nav').top < h.rect('.header__logo').bottom - 1) return 'меню стоит рядом с логотипом';
          return h.cs('.menu', 'flex-wrap') === 'wrap' || 'у .menu нет flex-wrap: wrap';
        } },
        { name: 'На компьютере логотип слева, меню справа в одну строку', check: h => {
          const l = h.rect('.header__logo'), n = h.rect('.header nav'), c = h.rect('.container');
          return (n.top < l.bottom && Math.abs(c.right - n.right) < 2 && Math.abs(l.left - c.left) < 2 && h.sameRow(h.$$('.menu li'))) || 'шапка на 1024px должна быть в строку, меню у правого края';
        } },
        { name: 'На телефоне заголовок не больше 32px', at: 360, check: h => h.px('.hero h1', 'font-size') <= 32 || `сейчас ${h.cs('.hero h1', 'font-size')}` },
        { name: 'На компьютере заголовок не меньше 44px', check: h => h.px('.hero h1', 'font-size') >= 44 || `сейчас ${h.cs('.hero h1', 'font-size')}` },
        { name: 'На телефоне кнопка во всю ширину, текст по центру', at: 360, check: h => {
          const hero = h.$('.hero'), inner = hero.clientWidth - h.px('.hero', 'padding-left') - h.px('.hero', 'padding-right');
          if (Math.abs(h.rect('.btn').width - inner) > 2) return 'на 360px кнопка не во всю ширину';
          return h.cs('.btn', 'text-align') === 'center' || 'текст кнопки не по центру';
        } },
        { name: 'Mobile first: @media (min-width: 768px) без max-width, на компьютере кнопка inline-block', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          if (!h.rules.some(r => /min-width:\s*768px/.test(r.media))) return 'нет @media (min-width: 768px)';
          return /inline-(block|flex)/.test(h.cs('.btn', 'display')) || 'на компьютере кнопка должна быть inline-block';
        } }
      ]
    },
    {
      id: 'k2402', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Преимущества и меню на трёх экранах', level: 'Сложное', minutes: 30, points: 200,
      story: 'Блоки преимуществ и меню на телефоне сжались в узкие полоски: три карточки в ряд на 360px читать невозможно. Делаем раскладку для телефона, планшета и компьютера.',
      goal: 'Mobile first, без max-width. Преимущества .features__list: на телефоне столбиком (flex-direction: column), от 768px — в ряд. Меню .catalog__grid: на телефоне одна колонка, от 768px — две (repeat(2, 1fr)), от 1280px — три (repeat(3, 1fr)). Медиазапрос на 768px идёт в CSS раньше, чем на 1280px. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Сначала телефон: у .features__list добавьте flex-direction: column; у .catalog__grid поставьте grid-template-columns: 1fr;',
        'Планшет: @media (min-width: 768px) { .features__list { flex-direction: row; } .catalog__grid { grid-template-columns: repeat(2, 1fr); } }',
        'Компьютер — отдельный медиазапрос ниже первого: @media (min-width: 1280px) { .catalog__grid { grid-template-columns: repeat(3, 1fr); } }',
        'Проверка смотрит на ширину 1024px — это планшетная раскладка, там должно быть две колонки меню.'
      ],
      html: `<section class="features">
  <h2>Почему к нам заходят между парами</h2>
  <ul class="features__list">
    <li class="feature"><h3>Быстро</h3><p>Заказ готов за 5 минут — успеете до звонка.</p></li>
    <li class="feature"><h3>Студенческие цены</h3><p>Скидка 15% по студенческому билету.</p></li>
    <li class="feature"><h3>Есть розетки</h3><p>У каждого стола можно зарядить ноутбук.</p></li>
  </ul>
</section>
<section class="catalog">
  <h2>Меню</h2>
  <div class="catalog__grid">
    <article class="product"><img src="img/art.svg" alt="Капучино в белой чашке"><h3>Капучино</h3><p>160 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Раф в высоком стакане"><h3>Раф ванильный</h3><p>210 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Американо в бумажном стакане"><h3>Американо</h3><p>120 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Какао с маршмеллоу"><h3>Какао</h3><p>140 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Чайник с травяным чаем"><h3>Чай с чабрецом</h3><p>90 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Сырник со сметаной"><h3>Сырник</h3><p>110 ₽</p></article>
  </div>
</section>`,
      css: `${BASE}
${PALETTE}
.features__list {
  display: flex;
  gap: 24px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature h3 {
  margin-top: 0;
  color: var(--coffee);
}
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product img {
  display: block;
  width: 100%;
  height: auto;
}
.product h3,
.product p {
  margin: 12px 16px;
}`,
      tests: [
        { name: 'На телефоне преимущества столбиком', at: 360, check: h => stacked(h.$$('.feature')) || 'карточки преимуществ стоят в ряд' },
        { name: 'На компьютере преимущества в один ряд', check: h => h.sameRow(h.$$('.feature')) || 'карточки преимуществ не в ряд' },
        { name: 'На телефоне меню в одну колонку', at: 360, check: h => {
          const p = h.$$('.product'), w = h.rect('.catalog__grid').width;
          return (stacked(p) && p.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) || 'на 360px карточки не в одну колонку';
        } },
        { name: 'На ширине 1024px меню в две колонки', check: h => {
          const p = h.$$('.product');
          return (h.sameRow([p[0], p[1]]) && p[2].getBoundingClientRect().top > p[0].getBoundingClientRect().bottom - 1) || 'должно быть ровно две карточки в ряду';
        } },
        { name: 'От 1280px меню в три колонки: repeat(3, 1fr)', check: h => h.rules.some(r => /min-width:\s*1280px/.test(r.media) && /\.catalog__grid/.test(r.selector) && /repeat\(\s*3\s*,\s*1fr\s*\)/.test(r.style.getPropertyValue('grid-template-columns'))) || 'нет @media (min-width: 1280px) с тремя колонками' },
        { name: 'Медиазапрос 768px раньше, чем 1280px, без max-width', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          const a = h.rules.findIndex(r => /min-width:\s*768px/.test(r.media)), b = h.rules.findIndex(r => /min-width:\s*1280px/.test(r.media));
          return (a >= 0 && b > a) || 'нужны @media (min-width: 768px), а ниже — @media (min-width: 1280px)';
        } },
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k2403', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Картинка, длинная почта и подвал', level: 'Среднее', minutes: 20, points: 150,
      story: 'Последние блоки: «О нас» с большой фотографией и подвал с адресом почты, который не помещается в узкий экран. Убираем последние причины прокрутки вбок.',
      goal: 'Mobile first, без max-width. Картинку .about__img сделайте резиновой: max-width: 100% и height: auto вместо фиксированных размеров. Блок .about: на телефоне картинка над текстом, от 768px — две колонки 1fr 1fr рядом. Подвал .footer: на телефоне столбиком (flex-direction: column), от 768px — в строку, с краями (space-between). Длинной почте .footer__mail разрешите перенос внутри слова: overflow-wrap: anywhere. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Картинка: удалите width: 600px и height: 300px, напишите max-width: 100%; height: auto;',
        'У .about в базовых стилях уберите grid-template-columns, а колонки 1fr 1fr перенесите в @media (min-width: 768px).',
        'Подвал на телефоне: .footer { flex-direction: column; align-items: flex-start; } В медиазапросе: flex-direction: row; justify-content: space-between; align-items: center;',
        'Адрес почты — одно длинное «слово» без пробелов. .footer__mail { overflow-wrap: anywhere; } разрешает браузеру перенести его в любом месте.'
      ],
      html: `<section class="about" id="about">
  <img class="about__img" src="img/art.svg" width="600" height="300" alt="Зал кофейни вечером">
  <div class="about__text">
    <h2>О нас</h2>
    <p>«Зерно» открыли выпускники колледжа в 2022 году. Мы обжариваем кофе сами и печём выпечку каждое утро.</p>
  </div>
</section>
<footer class="footer" id="contacts">
  <p>Кофейня «Зерно»</p>
  <p>ул. Студенческая, 5 · 8:00–20:00</p>
  <a class="footer__mail" href="mailto:zakazy.kofeyni.zerno.kolledzh@example.ru">zakazy.kofeyni.zerno.kolledzh@example.ru</a>
</footer>`,
      css: `${BASE}
${PALETTE}
.about {
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 32px;
  align-items: center;
}
.about__img {
  display: block;
  width: 600px;
  height: 300px;
  border-radius: 12px;
}
.about__text h2 {
  color: var(--coffee);
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer a {
  color: var(--cream);
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'На телефоне картинка не шире блока и не сплющена', at: 360, check: h => {
          const i = h.rect('.about__img'), a = h.rect('.about');
          if (i.width > a.width + 1) return 'картинка шире блока';
          return Math.abs(i.width / i.height - 2) < 0.05 || 'пропорции нарушены: нужен height: auto';
        } },
        { name: 'На телефоне текст «О нас» под картинкой', at: 360, check: h => h.rect('.about__text').top >= h.rect('.about__img').bottom - 1 || 'текст стоит рядом с картинкой' },
        { name: 'На компьютере картинка и текст рядом, колонки равные', check: h => {
          const i = h.rect('.about__img'), t = h.rect('.about__text');
          return (t.left >= i.right - 1 && Math.abs(i.width - t.width) < 2) || 'нужны две колонки 1fr 1fr';
        } },
        { name: 'На телефоне подвал столбиком', at: 360, check: h => (h.cs('.footer', 'flex-direction') === 'column' && stacked([...h.$('.footer').children])) || 'элементы подвала не друг под другом' },
        { name: 'На компьютере подвал в строку с краями', check: h => (h.cs('.footer', 'flex-direction') === 'row' && h.cs('.footer', 'justify-content') === 'space-between') || 'нужны flex-direction: row и justify-content: space-between от 768px' },
        { name: 'Длинная почта переносится: overflow-wrap: anywhere', check: h => ['anywhere', 'break-word'].includes(h.cs('.footer__mail', 'overflow-wrap')) || 'нет overflow-wrap у .footer__mail' },
        { name: 'Mobile first: колонки и строка подвала в @media (min-width: 768px)', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          if (h.rules.some(r => !r.media && r.selector === '.about' && r.style.getPropertyValue('grid-template-columns'))) return 'в базовых стилях .about остались колонки';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && r.selector === '.about') || 'нет колонок .about в @media (min-width: 768px)';
        } }
      ]
    }
  );
})();
