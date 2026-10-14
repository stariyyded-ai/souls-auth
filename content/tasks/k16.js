/* Занятие 16. Практическая работа №4 (ч. 2). Блоки, отступы, рамки и меню */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  const pseudoRules = (h, pseudo, sel) => h.rules.filter(r => r.selector.split(',').some(s => {
    if (!s.includes(pseudo)) return false;
    try { const base = s.split(pseudo).join('').trim() || '*'; return h.$$(base).some(e => e.matches(sel)); } catch (e) { return false; }
  }));
  // В cssText цвет может прийти и как #hex, и как rgb(…)
  const mentions = (r, hex) => r.style.cssText.toLowerCase().includes(hex) || r.style.cssText.includes(rgb(hex));
  const hasOutline = r => /outline/.test(r.style.cssText) && !/outline:\s*(none|0)\b/.test(r.style.cssText);

  window.COURSE_TASKS.push(
    {
      id: 'k1601', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Шапка с горизонтальным меню', level: 'Среднее', minutes: 30, points: 150,
      story: 'Кафе «Пиксель» заказало сайт. Начинаем с шапки: тёмная полоса, слева название, рядом меню из трёх пунктов. Текущий раздел подчёркнут жёлтой линией.',
      goal: 'Цвета уже в переменных. Шапка .site-header: фон var(--color-dark), padding 16px 24px. Логотип .logo: белый (var(--color-light)), 22px, жирный, без подчёркивания, display: inline-block, margin-right 32px. Блок меню .nav — display: inline-block, чтобы он встал в одну строку с логотипом. Список .nav__list: без маркеров, margin 0, padding 0. Пункты .nav__item — display: inline-block. Ссылки .nav__link: белые, без подчёркивания, display: inline-block, padding 8px 12px. Состояния: .nav__link:hover — фон #34446b; .nav__link:focus-visible — outline 3px solid var(--color-accent). Активный пункт .nav__link--active — нижняя рамка 3px solid var(--color-accent).',
      hints: [
        'Логотип и меню встанут в строку, если оба будут display: inline-block.',
        '.nav__list { list-style: none; margin: 0; padding: 0; } — так список теряет точки и отступ слева.',
        'Ссылке нужно display: inline-block, иначе вертикальный padding не раздвинет строку.',
        'Активный пункт: .nav__link--active { border-bottom: 3px solid var(--color-accent); }'
      ],
      html: `<header class="site-header">
  <a class="logo" href="#home">Кафе «Пиксель»</a>
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item"><a class="nav__link nav__link--active" href="#menu">Меню</a></li>
      <li class="nav__item"><a class="nav__link" href="#delivery">Доставка</a></li>
      <li class="nav__item"><a class="nav__link" href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Завтраки весь день</h1>
  <p>Каша, сырники и омлет — с 8:00 до 22:00.</p>
</main>`,
      css: `${BASE}
:root {
  --color-dark: #1f2a44;
  --color-light: #ffffff;
  --color-accent: #ffd166;
}`,
      tests: [
        { name: 'Шапка: тёмный фон, padding 16px 24px', check: h => (h.cs('.site-header', 'background-color') === rgb('#1f2a44') && h.px('.site-header', 'padding-top') === 16 && h.px('.site-header', 'padding-left') === 24) || `фон ${h.cs('.site-header', 'background-color')}, padding ${h.cs('.site-header', 'padding')}` },
        { name: 'Логотип: белый, 22px, жирный, без подчёркивания, отступ справа 32px', check: h => {
          if (h.cs('.logo', 'color') !== rgb('#ffffff')) return 'логотип должен быть белым';
          if (h.px('.logo', 'font-size') !== 22 || h.px('.logo', 'font-weight') < 700) return 'размер 22px и жирный';
          if (h.cs('.logo', 'text-decoration-line') !== 'none') return 'уберите подчёркивание';
          return (h.cs('.logo', 'display') === 'inline-block' && h.px('.logo', 'margin-right') === 32) || 'display: inline-block и margin-right: 32px'; } },
        { name: 'Логотип и меню — в одной строке', check: h => {
          if (h.cs('.nav', 'display') !== 'inline-block') return '.nav должен быть inline-block';
          const a = h.rect('.logo'), b = h.rect('.nav__list');
          return (b.top < a.bottom && a.top < b.bottom && b.left > a.right) || 'меню должно стоять справа от логотипа в той же строке'; } },
        { name: 'Список меню без маркеров и отступов, пункты в строку', check: h => {
          if (h.cs('.nav__list', 'list-style-type') !== 'none') return 'нужно list-style: none';
          if (h.px('.nav__list', 'padding-left') !== 0 || h.px('.nav__list', 'margin-top') !== 0 || h.px('.nav__list', 'margin-bottom') !== 0) return 'margin: 0; padding: 0;';
          return (h.cs('.nav__item', 'display') === 'inline-block' && h.sameRow(h.$$('.nav__item'))) || 'пункты .nav__item: display: inline-block'; } },
        { name: 'Ссылки меню: белые, без подчёркивания, inline-block, padding 8px 12px', check: h => h.$$('.nav__link').every(a => { const cs = h.win.getComputedStyle(a); return cs.color === rgb('#ffffff') && cs.textDecorationLine === 'none' && cs.display === 'inline-block' && cs.paddingTop === '8px' && cs.paddingLeft === '12px'; }) || 'проверьте color, text-decoration, display и padding у .nav__link' },
        { name: 'Состояния ссылок: :hover с фоном #34446b и :focus-visible с outline', check: h => {
          if (!pseudoRules(h, ':hover', '.nav__link').some(r => /background/.test(r.style.cssText) && mentions(r, '#34446b'))) return 'нет .nav__link:hover { background-color: #34446b; }';
          return pseudoRules(h, ':focus-visible', '.nav__link').some(hasOutline) || 'нет .nav__link:focus-visible с outline'; } },
        { name: 'Активный пункт подчёркнут рамкой 3px #ffd166', check: h => {
          const others = h.$$('.nav__link:not(.nav__link--active)');
          if (others.some(a => h.win.getComputedStyle(a).borderBottomStyle !== 'none')) return 'рамка нужна только активному пункту';
          return (h.cs('.nav__link--active', 'border-bottom-width') === '3px' && h.cs('.nav__link--active', 'border-bottom-style') === 'solid' && h.cs('.nav__link--active', 'border-bottom-color') === rgb('#ffd166')) || 'border-bottom: 3px solid var(--color-accent)'; } }
      ]
    },
    {
      id: 'k1602', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Ряд карточек', level: 'Среднее', minutes: 30, points: 150,
      story: 'Под шапкой — блок «Что мы готовим»: три карточки с названием, описанием и ценой. Одна из них — хит продаж, у неё яркая рамка и значок.',
      goal: 'Сброс * { box-sizing: border-box; } уже есть. Карточка .card: display: inline-block, vertical-align: top, ширина 300px, padding 24px, рамка 1px solid #d0d7e2, скругление border-radius 12px, фон #ffffff, отступы margin 0 16px 16px 0. Три карточки должны стоять в один ряд. Заголовок .card__title: margin 0 0 8px, 20px. Цена .card__price: жирная, 18px, цвет #1f4e79. Карточка-хит .card--hit: рамка 2px цвета #b3541e. Значок .card__badge: display: inline-block, padding 2px 8px, border-radius 12px, фон #b3541e, белый текст, 14px.',
      hints: [
        'Блоки встают в ряд, если сделать их display: inline-block и задать ширину. vertical-align: top выравнивает их по верху.',
        'Скругление углов: border-radius: 12px;',
        'Модификатор меняет только рамку: .card--hit { border: 2px solid #b3541e; }',
        'Значок — маленькая «таблетка»: inline-block, padding 2px 8px, border-radius 12px, фон и белый текст.'
      ],
      html: `<section class="services">
  <h2 class="services__title">Что мы готовим</h2>
  <article class="card">
    <h3 class="card__title">Завтраки</h3>
    <p class="card__text">Каши, сырники и омлеты. Подаём с 8:00.</p>
    <p class="card__price">от 250 ₽</p>
  </article>
  <article class="card">
    <h3 class="card__title">Обеды</h3>
    <p class="card__text">Суп, второе и чай. Студентам скидка.</p>
    <p class="card__price">от 290 ₽</p>
  </article>
  <article class="card card--hit">
    <span class="card__badge">Хит</span>
    <h3 class="card__title">Десерты</h3>
    <p class="card__text">Чизкейк, брауни и пирожное «Картошка».</p>
    <p class="card__price">от 180 ₽</p>
  </article>
</section>`,
      css: `* { box-sizing: border-box; }
${BASE}
.services__title { margin: 0 0 16px; }`,
      tests: [
        { name: 'Три карточки стоят в один ряд, по верхнему краю', check: h => (h.cs('.card', 'display') === 'inline-block' && h.cs('.card', 'vertical-align') === 'top' && h.sameRow(h.$$('.card'))) || 'нужны display: inline-block и vertical-align: top' },
        { name: 'Карточка: ширина 300px, padding 24px, отступы margin 0 16px 16px 0', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card'));
          if (!near(h.rect('.card').width, 300, 0.5)) return `ширина сейчас ${Math.round(h.rect('.card').width)}px`;
          if (cs.paddingTop !== '24px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          return (cs.marginTop === '0px' && cs.marginRight === '16px' && cs.marginBottom === '16px') || `margin сейчас ${cs.margin}`; } },
        { name: 'Карточка: рамка 1px solid #d0d7e2, скругление 12px, белый фон', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card'));
          if (cs.borderTopWidth !== '1px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#d0d7e2')) return 'рамка: 1px solid #d0d7e2';
          if (cs.borderTopLeftRadius !== '12px' || cs.borderBottomRightRadius !== '12px') return 'скругление: border-radius: 12px';
          return cs.backgroundColor === rgb('#ffffff') || 'фон #ffffff'; } },
        { name: 'Заголовок карточки 20px, margin 0 0 8px; цена жирная, 18px, #1f4e79', check: h => {
          if (h.px('.card__title', 'font-size') !== 20 || h.px('.card__title', 'margin-top') !== 0 || h.px('.card__title', 'margin-bottom') !== 8) return 'проверьте .card__title';
          return (h.px('.card__price', 'font-weight') >= 700 && h.px('.card__price', 'font-size') === 18 && h.cs('.card__price', 'color') === rgb('#1f4e79')) || 'проверьте .card__price'; } },
        { name: 'Карточка-хит: рамка 2px #b3541e', check: h => (h.cs('.card--hit', 'border-top-width') === '2px' && h.cs('.card--hit', 'border-top-color') === rgb('#b3541e') && h.cs('.card--hit', 'border-top-style') === 'solid') || `сейчас ${h.cs('.card--hit', 'border-top-width')} ${h.cs('.card--hit', 'border-top-color')}` },
        { name: 'Значок «Хит»: inline-block, padding 2px 8px, скругление 12px, фон #b3541e, белый текст 14px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card__badge'));
          if (cs.display !== 'inline-block' || cs.paddingTop !== '2px' || cs.paddingLeft !== '8px') return 'display: inline-block; padding: 2px 8px;';
          if (cs.borderTopLeftRadius !== '12px') return 'border-radius: 12px';
          return (cs.backgroundColor === rgb('#b3541e') && cs.color === rgb('#ffffff') && cs.fontSize === '14px') || 'фон #b3541e, цвет #ffffff, 14px'; } }
      ]
    },
    {
      id: 'k1603', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Кнопки с состояниями и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Страница записи на мастер-класс: основная кнопка, второстепенная и кнопка на занятие, где мест уже нет. Внизу — тёмный подвал с почтой кафе.',
      goal: 'Кнопка .button: padding 12px 24px, 16px, рамка 2px solid #1f4e79, border-radius 8px, фон #1f4e79, белый текст, cursor: pointer, margin-right 8px. Состояния: .button:hover — фон и цвет рамки #163a5a; .button:focus-visible — outline 3px solid #f2a541 и outline-offset 2px; .button:disabled — фон и рамка #e1e5ea, текст #5a6470, cursor: not-allowed. Второстепенная .button--secondary — фон #ffffff, текст #1f4e79, а при наведении (.button--secondary:hover) — фон #eef3f8, иначе синий текст пропадёт на тёмном фоне. Подвал .site-footer: фон #1f2a44, белый текст, padding 24px, margin-top 40px; текст .site-footer__text — 14px; ссылка .site-footer__link — цвет #ffd166.',
      hints: [
        'Рамка 2px нужна и основной кнопке: тогда основная и второстепенная будут одной высоты.',
        'Состояние «недоступна» описывает псевдокласс :disabled — он срабатывает, когда у кнопки есть атрибут disabled.',
        'Правила .button--secondary:hover и .button:disabled пишите после .button:hover: при равной специфичности побеждает последнее.',
        'outline-offset: 2px отодвигает рамку фокуса от кнопки — так её лучше видно.'
      ],
      html: `<main>
  <h1>Мастер-класс по латте-арту</h1>
  <p>Суббота, 12:00. Научим рисовать сердечко и листик на кофе.</p>
  <p class="actions">
    <button class="button" type="button">Записаться</button>
    <button class="button button--secondary" type="button">Подробнее</button>
  </p>
  <h2>Воскресенье, 12:00</h2>
  <p class="actions">
    <button class="button" type="button" disabled>Мест нет</button>
  </p>
</main>
<footer class="site-footer">
  <p class="site-footer__text">© 2026 Кафе «Пиксель». Пишите: <a class="site-footer__link" href="mailto:hello@pixel.example">hello@pixel.example</a></p>
</footer>`,
      css: `${BASE}
.actions { margin: 16px 0 32px; }`,
      tests: [
        { name: 'Кнопка: padding 12px 24px, 16px, рамка 2px #1f4e79, скругление 8px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          if (cs.paddingTop !== '12px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          if (cs.fontSize !== '16px') return `размер шрифта ${cs.fontSize}`;
          if (cs.borderTopWidth !== '2px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#1f4e79')) return 'рамка: 2px solid #1f4e79';
          return cs.borderTopLeftRadius === '8px' || 'border-radius: 8px'; } },
        { name: 'Кнопка: фон #1f4e79, белый текст, cursor: pointer, margin-right 8px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          return (cs.backgroundColor === rgb('#1f4e79') && cs.color === rgb('#ffffff') && cs.cursor === 'pointer' && cs.marginRight === '8px') || 'проверьте background-color, color, cursor и margin-right'; } },
        { name: 'Второстепенная кнопка: белый фон, синий текст, та же рамка; при наведении фон #eef3f8', check: h => {
          if (!(h.cs('.button--secondary', 'background-color') === rgb('#ffffff') && h.cs('.button--secondary', 'color') === rgb('#1f4e79') && h.cs('.button--secondary', 'border-top-width') === '2px')) return 'фон #ffffff, текст #1f4e79';
          return h.rules.some(r => r.selector.split(',').some(s => /\.button--secondary:hover/.test(s)) && mentions(r, '#eef3f8')) || 'нет .button--secondary:hover с фоном #eef3f8'; } },
        { name: 'Есть :hover (фон #163a5a) и :focus-visible (outline 3px, outline-offset 2px)', check: h => {
          if (!pseudoRules(h, ':hover', '.button').some(r => /background/.test(r.style.cssText) && mentions(r, '#163a5a'))) return 'нет .button:hover с фоном #163a5a';
          const f = pseudoRules(h, ':focus-visible', '.button');
          if (!f.some(hasOutline)) return 'нет .button:focus-visible с outline';
          return f.some(r => r.style.getPropertyValue('outline-offset') === '2px') || 'нужен outline-offset: 2px'; } },
        { name: 'Недоступная кнопка: фон #e1e5ea, текст #5a6470, cursor: not-allowed', check: h => {
          const b = h.$('.button[disabled]'), cs = h.win.getComputedStyle(b);
          if (!pseudoRules(h, ':disabled', '.button').length) return 'нет правила .button:disabled';
          return (cs.backgroundColor === rgb('#e1e5ea') && cs.borderTopColor === rgb('#e1e5ea') && cs.color === rgb('#5a6470') && cs.cursor === 'not-allowed') || `фон ${cs.backgroundColor}, текст ${cs.color}, курсор ${cs.cursor}`; } },
        { name: 'Подвал: фон #1f2a44, белый текст, padding 24px, margin-top 40px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.site-footer'));
          return (cs.backgroundColor === rgb('#1f2a44') && cs.color === rgb('#ffffff') && cs.paddingTop === '24px' && cs.paddingLeft === '24px' && cs.marginTop === '40px') || `фон ${cs.backgroundColor}, padding ${cs.padding}, margin-top ${cs.marginTop}`; } },
        { name: 'Текст подвала 14px, ссылка жёлтая #ffd166', check: h => (h.px('.site-footer__text', 'font-size') === 14 && h.cs('.site-footer__link', 'color') === rgb('#ffd166')) || `размер ${h.cs('.site-footer__text', 'font-size')}, ссылка ${h.cs('.site-footer__link', 'color')}` }
      ]
    }
  );
})();
