/* Занятие 21. Вёрстка страниц: Flexbox */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2101', lesson: 'mdk-21', module: 'mdk3', mech: 'build', title: 'Шапка спортзала', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Спортзал «Пульс» делает сайт. В шапке название и меню идут друг под другом, а дизайнер нарисовал их в одну строку.',
      goal: 'Сделайте шапку .header flex-контейнером: логотип .header__logo у левого края, меню .header__nav у правого (justify-content: space-between), по вертикали по центру (align-items: center). Пункты списка .menu поставьте в ряд через flex с промежутком gap не меньше 16px.',
      hints: [
        'В шапке два прямых ребёнка: ссылка-логотип и nav. Значит, display: flex пишем самой .header.',
        'Раздвинуть по краям: justify-content: space-between; выровнять по высоте: align-items: center;',
        'Пункты меню — дети ul.menu, поэтому второй flex-контейнер — .menu: .menu { display: flex; gap: 24px; }'
      ],
      html: `<header class="header">
  <a class="header__logo" href="#top">Спортзал «Пульс»</a>
  <nav class="header__nav">
    <ul class="menu">
      <li><a href="#schedule">Расписание</a></li>
      <li><a href="#prices">Цены</a></li>
      <li><a href="#coaches">Тренеры</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>`,
      css: `${BASE}
.header {
  padding: 16px 24px;
  background-color: #1f2a44;
}
.header__logo {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}
.menu {
  margin: 0;
  padding: 0;
  list-style: none;
}
.menu a {
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шапка .header — flex-контейнер', check: h => h.cs('.header', 'display') === 'flex' || `display: ${h.cs('.header', 'display')}` },
        { name: 'Логотип у левого края, меню у правого', check: h => {
          if (h.cs('.header', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          const H = h.rect('.header'), L = h.rect('.header__logo'), N = h.rect('.header__nav');
          return (Math.abs(L.left - H.left - 24) < 2 && Math.abs(H.right - 24 - N.right) < 2) || 'логотип и меню не прижаты к краям';
        } },
        { name: 'Логотип и меню выровнены по центру по высоте', check: h => h.cs('.header', 'align-items') === 'center' || `align-items: ${h.cs('.header', 'align-items')}` },
        { name: 'Пункты меню в одну строку', check: h => (h.cs('.menu', 'display') === 'flex' && h.sameRow(h.$$('.menu li'))) || 'у .menu нет display: flex' },
        { name: 'Между пунктами меню gap не меньше 16px', check: h => h.px('.menu', 'column-gap') >= 16 || `сейчас ${h.cs('.menu', 'column-gap')}` }
      ]
    },
    {
      id: 'k2102', lesson: 'mdk-21', module: 'mdk3', mech: 'build', title: 'Ряд абонементов', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице «Цены» три абонемента. На компьютере они должны стоять в ряд одинаковой ширины, а на телефоне — друг под другом, без прокрутки вбок.',
      goal: 'Сделайте .plans__list flex-контейнером с переносом (flex-wrap: wrap) и промежутком gap не меньше 16px. Карточкам .plan задайте flex: 1 1 220px. На компьютере три карточки встанут в один ряд одинаковой ширины, на телефоне (360px) — каждая на своей строке, без горизонтальной прокрутки.',
      hints: [
        'Контейнер — общий родитель карточек: .plans__list { display: flex; }',
        'Добавьте ему flex-wrap: wrap; и gap: 24px;',
        'Карточке: .plan { flex: 1 1 220px; } — начальная ширина 220px, растёт и сжимается вместе с соседями.'
      ],
      html: `<section class="plans">
  <h2>Абонементы</h2>
  <div class="plans__list">
    <article class="plan">
      <h3>Утренний</h3>
      <p>С 7:00 до 12:00 в будни</p>
      <p class="plan__price">1200 ₽ в месяц</p>
    </article>
    <article class="plan">
      <h3>Студенческий</h3>
      <p>В любое время, при предъявлении студенческого билета</p>
      <p class="plan__price">1500 ₽ в месяц</p>
    </article>
    <article class="plan">
      <h3>Безлимит</h3>
      <p>В любое время плюс групповые занятия</p>
      <p class="plan__price">2500 ₽ в месяц</p>
    </article>
  </div>
</section>`,
      css: `${BASE}
.plan {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.plan h3 {
  margin-top: 0;
}
.plan__price {
  margin-bottom: 0;
  font-weight: bold;
  color: #1f2a44;
}`,
      tests: [
        { name: '.plans__list — flex-контейнер', check: h => h.cs('.plans__list', 'display') === 'flex' || `display: ${h.cs('.plans__list', 'display')}` },
        { name: 'Перенос разрешён: flex-wrap: wrap', check: h => h.cs('.plans__list', 'flex-wrap') === 'wrap' || `flex-wrap: ${h.cs('.plans__list', 'flex-wrap')}` },
        { name: 'Между карточками gap не меньше 16px', check: h => h.px('.plans__list', 'column-gap') >= 16 || `сейчас ${h.cs('.plans__list', 'column-gap')}` },
        { name: 'Карточки растут: flex-grow 1, начальная ширина flex-basis около 220px', check: h => (h.cs('.plan', 'flex-grow') === '1' && Math.abs(h.px('.plan', 'flex-basis') - 220) <= 20) || `flex: ${h.cs('.plan', 'flex-grow')} ${h.cs('.plan', 'flex-shrink')} ${h.cs('.plan', 'flex-basis')}` },
        { name: 'На компьютере три карточки в ряд одинаковой ширины', check: h => {
          const p = h.$$('.plan'), w = p.map(e => e.getBoundingClientRect().width);
          return (h.sameRow(p) && Math.max(...w) - Math.min(...w) < 2) || 'карточки не в одном ряду или разной ширины';
        } },
        { name: 'На телефоне карточки друг под другом, прокрутки вбок нет', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const r = h.$$('.plan').map(e => e.getBoundingClientRect());
          return r.every((x, i) => !i || x.top >= r[i - 1].bottom - 1) || 'карточки не переносятся';
        } }
      ]
    },
    {
      id: 'k2103', lesson: 'mdk-21', module: 'mdk3', mech: 'fix', title: 'Окно по центру', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт записи к врачу показывает окно «Вы записаны». Прошлый верстальщик поставил его «в центр» подбором отступов: на его ноутбуке ровно, на других экранах криво, а на телефоне окно уезжает за край.',
      goal: 'Уберите у .notice подобранные margin-left и margin-top, ширину задайте через max-width: 320px вместо width. Поставьте окно в центр .screen с помощью Flexbox: display: flex, justify-content: center, align-items: center (min-height у .screen оставьте). Кнопки в .notice__actions поставьте в ряд через flex с gap не меньше 12px и по центру. На телефоне окно тоже по центру и без горизонтальной прокрутки.',
      hints: [
        'Центрирует родитель: .screen { display: flex; justify-content: center; align-items: center; }',
        'Строки margin-left: 300px и margin-top: 120px удалите совсем, а width: 320px замените на max-width: 320px.',
        'Кнопки: .notice__actions { display: flex; justify-content: center; gap: 12px; }'
      ],
      html: `<main class="screen">
  <section class="notice">
    <h1 class="notice__title">Вы записаны</h1>
    <p>Терапевт Иванова О. П., вторник, 14:30, кабинет 12.</p>
    <div class="notice__actions">
      <a class="btn" href="#cabinet">Мои записи</a>
      <a class="btn btn--light" href="#home">На главную</a>
    </div>
  </section>
</main>`,
      css: `${BASE}
.screen {
  min-height: 400px;
  background-color: #e8f0fe;
}
.notice {
  width: 320px;
  margin-left: 300px;
  margin-top: 120px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.notice__title {
  margin-top: 0;
  font-size: 28px;
}
.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
}
.btn--light {
  background-color: #e8f0fe;
  color: #1a3d7a;
}`,
      tests: [
        { name: '.screen — flex-контейнер с центрированием по обеим осям', check: h => (h.cs('.screen', 'display') === 'flex' && h.cs('.screen', 'justify-content') === 'center' && h.cs('.screen', 'align-items') === 'center') || 'нужны display: flex, justify-content: center, align-items: center' },
        { name: 'Подобранных отступов у .notice больше нет', check: h => (h.px('.notice', 'margin-left') === 0 && h.px('.notice', 'margin-top') === 0) || 'margin-left или margin-top остались' },
        { name: 'Ширина окна через max-width: 320px', check: h => (h.px('.notice', 'max-width') === 320 && !/width\s*:\s*320px/.test(h.css.replace(/max-width\s*:\s*320px/g, ''))) || 'замените width: 320px на max-width: 320px' },
        { name: 'На компьютере окно ровно в центре .screen', check: h => {
          const s = h.rect('.screen'), n = h.rect('.notice');
          return (Math.abs((s.left + s.right) / 2 - (n.left + n.right) / 2) < 2 && Math.abs((s.top + s.bottom) / 2 - (n.top + n.bottom) / 2) < 2) || 'окно не в центре';
        } },
        { name: 'Кнопки в ряд через flex, gap от 12px, по центру', check: h => (h.cs('.notice__actions', 'display') === 'flex' && h.px('.notice__actions', 'column-gap') >= 12 && h.cs('.notice__actions', 'justify-content') === 'center') || 'у .notice__actions нужны display: flex, gap и justify-content: center' },
        { name: 'На телефоне окно по центру и без прокрутки вбок', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const s = h.rect('.screen'), n = h.rect('.notice');
          return Math.abs((s.left + s.right) / 2 - (n.left + n.right) / 2) < 2 || 'окно не по центру';
        } }
      ]
    }
  );
})();
