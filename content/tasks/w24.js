/* Занятие 24. ПР12. Адаптив: mobile-first, media queries, относительные единицы */
(() => {
  const { IMG } = window.COURSE_KIT;
  const card = (t, d) => `    <article class="request-card">
      <h2>${t}</h2>
      <p>${d}</p>
    </article>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2401', lesson: 'm9-pr12', module: 'mdk93', mech: 'adaptive', title: 'Mobile-first: список заявок', level: 'Среднее', minutes: 30, points: 150,
      story: 'Страницу «Мои заявки» «ЧистоДома» сверстали под монитор: ширина 1100px гвоздями, а телефон «чинят» медиазапросом max-width. На ноутбуке 1024px уже появилась прокрутка вбок. Перепишем стили по принципу mobile-first.',
      goal: 'Базовые правила (без медиазапросов) — для телефона: .page — width: min(100% - 32px, 1100px) и margin: 0 auto; .requests — одна колонка (grid-template-columns: 1fr) с gap 16px; h1 — font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem); размер заголовка карточки — 1.125rem. Затем @media (min-width: 768px) — .requests в две колонки (1fr 1fr), @media (min-width: 1200px) — в три (repeat(3, 1fr)). Медиазапросов с max-width быть не должно, размеры шрифтов — без px.',
      hints: [
        'Удалите блок @media (max-width: 768px) — его правила станут базовыми.',
        '.page { width: min(100% - 32px, 1100px); margin: 0 auto; } — 16px полей по бокам на телефоне и не шире 1100px на мониторе.',
        'Внутри медиазапроса пишите только то, что меняется: @media (min-width: 768px) { .requests { grid-template-columns: 1fr 1fr; } }',
        'Запросы идут от меньшего к большему: сначала 768px, потом @media (min-width: 1200px) { .requests { grid-template-columns: repeat(3, 1fr); } }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
${[['Генеральная уборка', '12.11.2026, 10:00 · ул. Ленина, 5'], ['Химчистка ковров', '03.11.2026, 14:30 · пр. Мира, 18'], ['Общий клининг', '20.10.2026, 09:00 · ул. Ленина, 5'],
    ['Мойка окон', '25.11.2026, 11:00 · ул. Садовая, 3'], ['Уборка после ремонта', '01.12.2026, 09:30 · ул. Мира, 7'], ['Химчистка дивана', '05.12.2026, 15:00 · ул. Ленина, 5']].map(x => card(...x)).join('\n')}
  </section>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { width: 1100px; margin: 0 auto; }
h1 { font-size: 40px; }
.requests { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.request-card p { margin: 0; color: #64748b; }
@media (max-width: 768px) {
  .page { width: 100%; }
  .requests { grid-template-columns: 1fr; }
  h1 { font-size: 28px; }
}`,
      tests: [
        { name: 'Медиазапросы только с min-width, есть запрос от 768px', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'остался медиазапрос с max-width';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media)) || 'нет @media (min-width: 768px)';
        } },
        { name: 'Телефон 360px: одна колонка, поля 16px по бокам, без прокрутки', at: 360, check: h => {
          if (h.overflow()) return 'страница шире экрана';
          const l = h.$$('.request-card').map(c => h.rect(c).left);
          if (Math.max(...l) - Math.min(...l) > 1) return 'на телефоне карточки должны стоять в одну колонку';
          return Math.abs(h.rect('.page').left - 16) <= 1 || `слева ${Math.round(h.rect('.page').left)}px, нужно 16px`;
        } },
        { name: '1024px: две колонки, без прокрутки', check: h => {
          if (h.overflow()) return 'на 1024px страница шире экрана';
          const c = h.$$('.request-card');
          return h.sameRow([c[0], c[1]]) && h.rect(c[2]).top > h.rect(c[0]).bottom || 'на 1024px карточки должны стоять по две в ряд';
        } },
        { name: 'От 1200px — три колонки repeat(3, 1fr)', check: h => h.rules.some(r => /min-width:\s*1200px/.test(r.media) && /repeat\(\s*3/.test(r.style.gridTemplateColumns)) || 'нет @media (min-width: 1200px) с repeat(3, 1fr)' },
        { name: 'Ширина .page через min(100% - 32px, 1100px)', check: h => h.rules.some(r => r.selector === '.page' && !r.media && /min\(/.test(r.style.width)) || 'нужно .page { width: min(100% - 32px, 1100px); }' },
        { name: 'Заголовок h1 через clamp(), на телефоне не меньше 1.75rem', at: 360, check: h => {
          if (!h.rules.some(r => r.selector === 'h1' && /clamp\(/.test(r.style.fontSize))) return 'задайте h1 размер через clamp()';
          return h.px('h1', 'font-size') >= 27.5 || `на 360px h1 ${h.px('h1', 'font-size')}px`;
        } },
        { name: 'Размеры шрифтов без px', check: h => {
          const r = h.rules.find(x => /px/.test(x.style.fontSize));
          return !r || `${r.selector}: font-size ${r.style.fontSize} — переведите в rem`;
        } }
      ]
    },
    {
      id: 'w2402', lesson: 'm9-pr12', module: 'mdk93', mech: 'adaptive', title: 'Шапка и фото без прокрутки на 360px', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник открыл «ЧистоДом» на своём Android шириной 360px: фото в карточке рвёт страницу, ссылки меню слиплись и в них трудно попасть пальцем, а тень у карточки «залипает» после касания.',
      goal: 'Шапка .header — с переносом (flex-wrap: wrap). Меню .nav — flex с переносом и gap не меньше 8px; у ссылок уберите margin-left, сделайте их зоной нажатия не ниже 44px (display: inline-flex, align-items: center, min-height: 44px). Картинка в карточке — не шире карточки (max-width: 100%) и с сохранением пропорций (height: auto). Тень при наведении на .request-card оставьте только для устройств с мышью: перенесите правило в @media (hover: hover). На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        '.header { …; flex-wrap: wrap; gap: 8px; } и .nav { display: flex; flex-wrap: wrap; gap: 8px; }',
        '.nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: #ffffff; } — margin-left больше не нужен.',
        'img { display: block; max-width: 100%; height: auto; }',
        '@media (hover: hover) { .request-card:hover { box-shadow: … } } — и удалите старое правило :hover вне медиазапроса.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#requests">Мои заявки</a>
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Мои заявки</h1>
  <article class="request-card">
    <img src="${IMG}" alt="Квартира после генеральной уборки" width="800" height="600">
    <h2>Генеральная уборка</h2>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav a { margin-left: 32px; color: #ffffff; font-size: 1.125rem; }
.page { padding: 24px 16px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card:hover { box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }`,
      tests: [
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'Картинка не шире карточки и не растянута по высоте', at: 360, check: h => {
          if (!h.inside('.request-card img', '.request-card')) return 'картинка шире карточки: max-width: 100%';
          return h.rect('.request-card img').height < 400 || 'картинка вытянута по высоте: height: auto';
        } },
        { name: 'Шапка и меню переносятся: flex-wrap: wrap, у меню gap от 8px', check: h => {
          if (h.cs('.header', 'flex-wrap') !== 'wrap') return 'у .header нет flex-wrap: wrap';
          if (h.cs('.nav', 'display') !== 'flex' || h.cs('.nav', 'flex-wrap') !== 'wrap') return '.nav: display: flex; flex-wrap: wrap';
          return h.px('.nav', 'column-gap') >= 8 || 'у .nav gap меньше 8px';
        } },
        { name: 'Ссылки меню без margin-left: 32px', check: h => h.$$('.nav a').every(a => h.px(a, 'margin-left') === 0) || 'уберите margin-left у ссылок' },
        { name: 'Телефон: каждая ссылка меню не ниже 44px', at: 360, check: h => {
          const low = h.$$('.nav a').find(a => h.rect(a).height < 43.5);
          return !low || `«${low.textContent}»: высота ${Math.round(h.rect(low).height)}px`;
        } },
        { name: 'Тень при наведении — только в @media (hover: hover)', check: h => {
          const hov = h.rules.filter(r => /\.request-card:hover/.test(r.selector));
          if (!hov.length) return 'нет правила .request-card:hover';
          return hov.every(r => /hover:\s*hover/.test(r.media)) || 'правило :hover должно быть только внутри @media (hover: hover)';
        } }
      ]
    }
  );
})();
