/* Занятие 20. ПР10. Разминка HTML/CSS: семантика, блочная модель, Flexbox, Grid */
(() => {
  const { rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w2001', lesson: 'm9-pr10', module: 'mdk93', mech: 'fix', title: 'Каркас страницы «Мои заявки»', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник начал страницу «Мои заявки» портала «ЧистоДом», но собрал её из одних div, взял устаревший <font>, а на телефоне карточка вылезает за край экрана. Приведите каркас в порядок — на нём будут стоять все пять страниц портала.',
      goal: 'HTML: шапку .top замените на <header class="header">, обёртку меню — на <nav class="nav">, общую обёртку содержимого — на <main class="page">. «Мои заявки» — единственный <h1> без <font> и <b>, карточка — <article class="card">, её название — <h2>. CSS: включите box-sizing: border-box для всех элементов (*, *::before, *::after); переименуйте .top в .header и сделайте её flex: логотип слева, меню справа (justify-content: space-between), по вертикали по центру (align-items: center); .nav — тоже flex с gap не меньше 8px. На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        'Каркас: <header class="header"> <a class="logo" …>…</a> <nav class="nav">…две ссылки…</nav> </header> <main class="page"> <h1>Мои заявки</h1> <article class="card">…</article> </main>',
        'Заголовок карточки: <h2>Генеральная уборка</h2> вместо <div class="card-title">. Размер заголовков задаётся в CSS, а не тегом <font>.',
        'Первое правило CSS: *, *::before, *::after { box-sizing: border-box; } — тогда width: 100% включает padding и рамку.',
        '.header { display: flex; justify-content: space-between; align-items: center; … } и .nav { display: flex; gap: 16px; }'
      ],
      html: `<div class="top">
  <div><a class="logo" href="#requests">ЧистоДом</a></div>
  <div class="nav">
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </div>
</div>
<div>
  <div><b><font size="6">Мои заявки</font></b></div>
  <div class="card">
    <div class="card-title">Генеральная уборка</div>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </div>
</div>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.top { padding: 12px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav a { color: #ffffff; }
.card { width: 100%; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }`,
      tests: [
        { name: 'Шапка — <header class="header">, в ней логотип и <nav class="nav"> с двумя ссылками', check: h => {
          if (!h.$('header.header')) return 'нет <header class="header">';
          if (!h.$('header.header .logo')) return 'логотип должен быть внутри шапки';
          return h.count('header.header nav.nav a') === 2 || 'внутри шапки нужен <nav class="nav"> с двумя ссылками';
        } },
        { name: 'Содержимое в <main class="page">, «Мои заявки» — единственный <h1>', check: h => {
          if (h.count('main.page') !== 1) return 'нужен один <main class="page">';
          if (h.count('h1') !== 1) return `заголовков h1: ${h.count('h1')}, нужен один`;
          return h.text('main h1') === 'Мои заявки' || 'h1 «Мои заявки» должен быть внутри main';
        } },
        { name: 'Нет <font> и <b>, карточка — <article class="card"> с <h2>', check: h => {
          if (h.$('font, b')) return 'остались <font> или <b>';
          return h.text('main article.card h2') === 'Генеральная уборка' || 'карточка — <article class="card">, внутри <h2>Генеральная уборка</h2>';
        } },
        { name: 'box-sizing: border-box у всех элементов', check: h => ['.card', 'main', 'p'].every(s => h.cs(s, 'box-sizing') === 'border-box') || 'добавьте *, *::before, *::after { box-sizing: border-box; }' },
        { name: 'Шапка на Flexbox: логотип слева, меню справа, по центру по вертикали', check: h => {
          if (h.cs('header', 'display') !== 'flex') return `у шапки display: ${h.cs('header', 'display')}`;
          if (h.cs('header', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          if (h.cs('header', 'align-items') !== 'center') return 'нужно align-items: center';
          const a = h.rect('header .logo'), n = h.rect('header nav');
          if (!a || !n) return 'нет логотипа или меню';
          return a.right <= n.left || 'меню должно стоять правее логотипа';
        } },
        { name: 'Меню .nav — flex с промежутком gap не меньше 8px', check: h => h.cs('.nav', 'display') === 'flex' && h.px('.nav', 'column-gap') >= 8 || 'нужно .nav { display: flex; gap: … }' },
        { name: 'Цвета не потерялись: шапка #0f766e', check: h => h.cs('header', 'background-color') === rgb('#0f766e') || 'перенесите фон .top в .header' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана: карточка с padding вылезает' }
      ]
    },
    {
      id: 'w2002', lesson: 'm9-pr10', module: 'mdk93', mech: 'build', title: 'Карточки заявок на Grid', level: 'Среднее', minutes: 25, points: 150,
      story: 'В каждой карточке заявки «ЧистоДома» есть подписи «Дата», «Адрес», «Оплата» и значения к ним. Сейчас всё идёт столбиком, а сами карточки стоят друг под другом даже на большом мониторе. Разложим всё сеткой.',
      goal: 'Список .request-info сделайте Grid с колонками 100px и 1fr (gap: 4px 12px, margin: 0), у dd уберите отступ браузера (margin: 0). Ошибку в правиле .request-info dt (display: grid стоит у ребёнка, а не у контейнера) исправьте: у dt оставьте только цвет. Контейнер .requests — Grid с grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) и gap 16px. На 1024px три карточки встанут в ряд, на 360px — в одну колонку без прокрутки.',
      hints: [
        'Grid включается у контейнера: .request-info { display: grid; grid-template-columns: 100px 1fr; gap: 4px 12px; margin: 0; }',
        'У <dd> браузер ставит margin-left: 40px — сбросьте: .request-info dd { margin: 0; }',
        '.requests { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
    <article class="request-card">
      <h2>Генеральная уборка</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>12.11.2026, 10:00</dd>
        <dt>Адрес</dt><dd>ул. Ленина, 5, кв. 12</dd>
        <dt>Оплата</dt><dd>Банковская карта</dd>
      </dl>
    </article>
    <article class="request-card">
      <h2>Химчистка ковров</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>03.11.2026, 14:30</dd>
        <dt>Адрес</dt><dd>пр. Мира, 18</dd>
        <dt>Оплата</dt><dd>Наличные</dd>
      </dl>
    </article>
    <article class="request-card">
      <h2>Общий клининг</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>20.10.2026, 09:00</dd>
        <dt>Адрес</dt><dd>ул. Ленина, 5, кв. 12</dd>
        <dt>Оплата</dt><dd>Наличные</dd>
      </dl>
    </article>
  </section>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 28px; }
.request-card { padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.request-info dt { display: grid; color: #64748b; }
`,
      tests: [
        { name: 'Список .request-info — Grid с колонками 100px и 1fr', check: h => {
          if (h.cs('.request-info', 'display') !== 'grid') return `у .request-info display: ${h.cs('.request-info', 'display')}`;
          const cols = h.cs('.request-info', 'grid-template-columns').split(' ');
          return cols.length === 2 && cols[0] === '100px' || `колонки сейчас: ${h.cs('.request-info', 'grid-template-columns')}`;
        } },
        { name: 'Подпись и значение стоят в одной строке', check: h => {
          const dt = h.$('.request-info dt'), dd = h.$('.request-info dd');
          return h.sameRow([dt, dd]) && h.rect(dd).left > h.rect(dt).left || 'значение должно стоять справа от подписи';
        } },
        { name: 'У dd и dl нет отступов браузера (margin: 0)', check: h => h.px('.request-info dd', 'margin-left') === 0 && h.px('.request-info', 'margin-top') === 0 || 'сбросьте margin у .request-info и dd' },
        { name: 'У dt больше нет display: grid', check: h => h.cs('.request-info dt', 'display') !== 'grid' || 'grid включают у контейнера, а не у dt' },
        { name: '.requests — Grid с repeat(auto-fill, minmax(280px, 1fr)) и gap 16px', check: h => {
          if (h.cs('.requests', 'display') !== 'grid') return 'у .requests нет display: grid';
          if (!h.has(/repeat\(\s*auto-fill\s*,\s*minmax\(\s*280px\s*,\s*1fr\s*\)\s*\)/)) return 'нужно repeat(auto-fill, minmax(280px, 1fr))';
          return h.px('.requests', 'row-gap') === 16 && h.px('.requests', 'column-gap') === 16 || 'промежуток должен быть 16px';
        } },
        { name: '1024px: три карточки в одном ряду', check: h => h.sameRow(h.$$('.request-card')) || 'карточки не встали в ряд' },
        { name: '360px: карточки в одну колонку, без прокрутки', at: 360, check: h => {
          const l = h.$$('.request-card').map(c => h.rect(c).left);
          if (Math.max(...l) - Math.min(...l) > 1) return 'на телефоне карточки должны стоять одна под другой';
          return !h.overflow() || 'страница шире экрана';
        } }
      ]
    }
  );
})();
