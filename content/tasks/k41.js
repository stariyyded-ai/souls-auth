/* Занятие 41. Практическая работа №9 (ч. 2). Эскизы для телефона и компьютера */
(() => {
  const { BASE } = window.COURSE_KIT;
  const shown = (h, sel) => { const e = h.$(sel); return !!(e && h.cs(e, 'display') !== 'none' && e.getClientRects().length); };
  const hidden = (h, sel) => { const e = h.$(sel); return !!e && !e.getClientRects().length; };
  const oneRow = (h, sels) => { const r = sels.map(s => h.rect(s)); return r.every(x => x && x.height) && Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom)); };
  const below = (h, a, b) => { const x = h.rect(a), y = h.rect(b); return !!(x && y && y.top >= x.bottom - 1); };
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4101', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Шапка эскиза: компьютер и телефон', level: 'Среднее', minutes: 25, points: 150,
      story: 'Эскиз шапки библиотеки нарисован для компьютера. На телефоне меню из четырёх пунктов не помещается, и страница уезжает вбок. На мобильном эскизе меню прячут за кнопку «Меню».',
      goal: 'Сделайте две версии шапки. Компьютер (1024px): кнопка .burger спрятана (display: none), логотип, меню nav и «Войти» стоят в один ряд слева направо. Телефон (360px, медиазапрос @media (max-width: 767px)): меню nav спрятано, кнопка .burger видна и стоит в одном ряду с логотипом, справа от него; ссылка «Войти» остаётся видна; горизонтальной прокрутки нет (уменьшите отступы и промежутки шапки).',
      hints: [
        'Сначала спрячьте бургер для всех: .burger { display: none; } — и допишите это в правило .burger.',
        'Ниже добавьте медиазапрос: @media (max-width: 767px) { … } — внутри него правила для телефона.',
        'В медиазапросе: .nav { display: none; } и .burger { display: block; }',
        'Если всё ещё есть прокрутка, в том же медиазапросе уменьшите промежуток: .header { gap: 8px; padding: 8px; }'
      ],
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav class="nav">
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
  <button class="burger" type="button">Меню</button>
</header>
<main>
  <h1>Библиотека колледжа</h1>
  <p>Каталог, новинки и запись на мероприятия.</p>
</main>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.logo {
  padding: 4px 8px;
  border: 2px solid var(--wf-dark);
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.login {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
}
.burger {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
  background-color: var(--wf-mid);
  color: #222222;
  font-size: 16px;
}`,
      tests: [
        { name: 'Компьютер: кнопка «Меню» спрятана', check: h => hidden(h, '.burger') || 'на 1024px .burger должен быть display: none' },
        { name: 'Компьютер: логотип, меню и «Войти» в один ряд слева направо', check: h => shown(h, '.nav') && oneRow(h, ['.logo', '.nav', '.login']) && h.rect('.logo').right <= h.rect('.nav').left && h.rect('.nav').right <= h.rect('.login').left || 'на компьютере меню должно быть видно в одном ряду' },
        { name: 'Телефон: меню спрятано', at: 360, check: h => hidden(h, '.nav') || 'на 360px спрячьте .nav' },
        { name: 'Телефон: кнопка «Меню» видна, в ряду с логотипом, справа', at: 360, check: h => shown(h, '.burger') && oneRow(h, ['.logo', '.burger']) && h.rect('.burger').left > h.rect('.logo').right || 'на 360px покажите .burger справа от логотипа' },
        { name: 'Телефон: ссылка «Войти» видна', at: 360, check: h => shown(h, '.login') || '«Войти» нельзя прятать' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k4102', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Каталог: что переставить на телефоне', level: 'Среднее', minutes: 30, points: 150,
      story: 'На компьютере слева от результатов поиска стоит колонка «Новости». На телефоне человек пришёл за книгой, а первым экраном видит новости. Главное должно идти первым.',
      goal: 'Компьютер (1024px) оставьте как есть: новости .news слева, результаты .results справа, три карточки .card в один ряд. Телефон (@media (max-width: 767px)): раскладка .layout в одну колонку; результаты .results идут первыми, новости .news — под ними (HTML не меняйте, переставьте через CSS: order или grid-template-areas); карточки стоят друг под другом в одну колонку; горизонтальной прокрутки нет.',
      hints: [
        'Одна колонка в сетке: grid-template-columns: 1fr;',
        'Порядок в сетке и во флексе меняет свойство order: у .news поставьте order: 2 — тогда она уйдёт после результатов (у остальных order по умолчанию 0).',
        'Карточки в одну колонку: .cards { grid-template-columns: 1fr; }',
        'Всё это пишется внутри @media (max-width: 767px) { … } после основных правил.'
      ],
      html: `<h1>Каталог библиотеки</h1>
<div class="layout">
  <aside class="news">
    <h2>Новости</h2>
    <p>С 1 марта библиотека работает до 20:00.</p>
  </aside>
  <section class="results">
    <h2>Найдено 3 книги</h2>
    <div class="cards">
      <article class="card"><div class="ph">Обложка</div><h3>Основы HTML</h3><p>И. Петров</p></article>
      <article class="card"><div class="ph">Обложка</div><h3>CSS для начинающих</h3><p>А. Смирнова</p></article>
      <article class="card"><div class="ph">Обложка</div><h3>Веб-дизайн</h3><p>О. Кузнецова</p></article>
    </div>
  </section>
</div>`,
      css: `${BASE}
${WF}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}
.news {
  padding: 16px;
  background-color: var(--wf-light);
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  padding: 16px;
  border: 2px solid var(--wf-mid);
}
.ph {
  height: 120px;
  border: 2px dashed var(--wf-dark);
  background-color: var(--wf-mid);
}`,
      tests: [
        { name: 'Компьютер: новости слева от результатов, карточки в ряд', check: h => h.rect('.news').right <= h.rect('.results').left && oneRow(h, ['.news', '.results']) && h.sameRow(h.$$('.card')) || 'на компьютере раскладку не меняйте' },
        { name: 'Телефон: результаты первыми, новости под ними', at: 360, check: h => below(h, '.results', '.news') || 'на 360px .news должна идти после .results' },
        { name: 'Телефон: раскладка в одну колонку', at: 360, check: h => Math.abs(h.rect('.results').width - h.rect('.layout').width) < 2 && Math.abs(h.rect('.news').width - h.rect('.layout').width) < 2 || 'на 360px у .layout одна колонка' },
        { name: 'Телефон: карточки друг под другом', at: 360, check: h => { const c = h.$$('.card'); return c.length === 3 && c.every((e, i) => i === 0 || below(h, c[i - 1], e)) && c.every(e => Math.abs(h.rect(e).left - h.rect(c[0]).left) < 1) || 'на 360px у .cards одна колонка'; } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k4103', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Экран брони: что спрятать и растянуть', level: 'Среднее', minutes: 25, points: 150,
      story: 'Экран бронирования книги на компьютере: форма слева, подсказка справа, имя и группа в одну строку. На телефоне это превращается в узкие столбики, в которые не попасть пальцем.',
      goal: 'Компьютер (1024px) оставьте как есть: подсказка .tips видна справа от формы, поля «Имя и фамилия» и «Группа» в одной строке. Телефон (@media (max-width: 767px)): подсказку .tips спрячьте; поля из .row встают друг под другом; каждое поле input растянуто на всю ширину формы; кнопка .btn тоже на всю ширину формы; горизонтальной прокрутки нет.',
      hints: [
        'Флекс-строку можно развернуть в столбец: .row { flex-direction: column; }. То же для .screen.',
        'Поле на всю ширину: input { width: 100%; box-sizing: border-box; } — без box-sizing отступы и рамка вылезут за край.',
        'Кнопка на всю ширину: .btn { width: 100%; }',
        'Прятать: .tips { display: none; } внутри медиазапроса.'
      ],
      html: `<h1>Бронирование книги</h1>
<div class="screen">
  <form class="booking">
    <div class="row">
      <div class="field">
        <label for="name">Имя и фамилия</label>
        <input id="name" type="text" name="name">
      </div>
      <div class="field">
        <label for="group">Группа</label>
        <input id="group" type="text" name="group">
      </div>
    </div>
    <div class="field">
      <label for="date">Когда заберёте</label>
      <input id="date" type="date" name="date">
    </div>
    <button class="btn" type="submit">Забронировать</button>
  </form>
  <aside class="tips">
    <h2>Подсказка</h2>
    <p>Бронь хранится три дня. Заберите книгу у стойки выдачи.</p>
  </aside>
</div>`,
      css: `${BASE}
${WF}
.screen {
  display: flex;
  gap: 32px;
}
.booking {
  flex: 1;
}
.tips {
  flex: 0 0 280px;
  padding: 16px;
  background-color: var(--wf-light);
}
.row {
  display: flex;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  padding: 8px;
  border: 2px solid var(--wf-dark);
  font-size: 16px;
}
.btn {
  padding: 12px 24px;
  border: 2px solid var(--wf-dark);
  background-color: var(--wf-mid);
  color: #222222;
  font-size: 16px;
}`,
      tests: [
        { name: 'Компьютер: подсказка справа от формы, имя и группа в одной строке', check: h => shown(h, '.tips') && h.rect('.booking').right <= h.rect('.tips').left && oneRow(h, h.$$('.row .field')) || 'на компьютере раскладку не меняйте' },
        { name: 'Телефон: подсказка спрятана', at: 360, check: h => hidden(h, '.tips') || 'на 360px спрячьте .tips' },
        { name: 'Телефон: имя и группа друг под другом', at: 360, check: h => { const f = h.$$('.row .field'); return f.length === 2 && below(h, f[0], f[1]) || 'на 360px поля .row встают в столбец'; } },
        { name: 'Телефон: каждое поле на всю ширину формы', at: 360, check: h => { const w = h.rect('.booking').width; const bad = h.$$('.booking input').filter(i => Math.abs(h.rect(i).width - w) > 2); return !bad.length || `не растянуто полей: ${bad.length}`; } },
        { name: 'Телефон: кнопка на всю ширину формы', at: 360, check: h => Math.abs(h.rect('.btn').width - h.rect('.booking').width) <= 2 || 'на 360px у .btn width: 100%' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
