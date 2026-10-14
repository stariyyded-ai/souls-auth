/* Занятие 22. Вёрстка страниц: Grid и адаптивность */
(() => {
  const { BASE } = window.COURSE_KIT;
  const stacked = els => els.every((x, i) => !i || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);
  window.COURSE_TASKS.push(
    {
      id: 'k2201', lesson: 'mdk-22', module: 'mdk3', mech: 'build', title: 'Галерея фотоконкурса', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Студсовет проводит фотоконкурс «Мой колледж». Работы нужно показать галереей: на компьютере в несколько колонок, на телефоне — по одной.',
      goal: 'Сделайте .gallery grid-контейнером. Колонки задайте одной строкой: repeat(auto-fit, minmax(200px, 1fr)), промежуток gap не меньше 16px. Картинки .gallery img растяните на всю ширину ячейки (width: 100%, height: auto, display: block). На компьютере в первом ряду окажется не меньше трёх работ, на телефоне — одна колонка без прокрутки вбок.',
      hints: [
        'Начните с контейнера: .gallery { display: grid; gap: 16px; }',
        'Колонки, которые сами считают своё число: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
        'Картинка размером 600px сейчас шире ячейки. Правило .gallery img { display: block; width: 100%; height: auto; } вписывает её в ячейку.'
      ],
      html: `<h2>Фотоконкурс «Мой колледж»</h2>
<div class="gallery">
  <figure><img src="img/art.svg" alt="Закат над учебным корпусом"><figcaption>Анна К., «Закат»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Двор колледжа вечером"><figcaption>Илья П., «Вечер»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Луна над спортзалом"><figcaption>Мария С., «Луна»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Дорога к общежитию"><figcaption>Тимур Р., «Дорога домой»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Силуэт библиотеки"><figcaption>Ольга Д., «Библиотека»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Огни мастерских"><figcaption>Денис В., «Огни»</figcaption></figure>
</div>`,
      css: `${BASE}
.gallery figure {
  margin: 0;
}
figcaption {
  margin-top: 6px;
  font-size: 14px;
  color: #555555;
}`,
      tests: [
        { name: '.gallery — grid-контейнер', check: h => h.cs('.gallery', 'display') === 'grid' || `display: ${h.cs('.gallery', 'display')}` },
        { name: 'Колонки: repeat(auto-fit, minmax(200px, 1fr))', check: h => h.has(/grid-template-columns\s*:\s*repeat\(\s*auto-(fit|fill)\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\s*\)/) || 'нет такой записи в grid-template-columns' },
        { name: 'Промежуток gap не меньше 16px', check: h => h.px('.gallery', 'column-gap') >= 16 || `сейчас ${h.cs('.gallery', 'column-gap')}` },
        { name: 'На компьютере в первом ряду не меньше трёх работ', check: h => { const f = h.$$('.gallery figure'), t = f[0].getBoundingClientRect().top; const n = f.filter(e => Math.abs(e.getBoundingClientRect().top - t) < 2).length; return n >= 3 || `в первом ряду ${n}`; } },
        { name: 'Картинки во всю ширину своей ячейки', check: h => h.$$('.gallery figure').every(f => Math.abs(f.querySelector('img').getBoundingClientRect().width - f.getBoundingClientRect().width) < 2) || 'картинка не совпадает по ширине с ячейкой' },
        { name: 'На телефоне одна колонка и нет прокрутки вбок', at: 360, check: h => !h.overflow() && stacked(h.$$('.gallery figure')) || 'на 360px работы не в одну колонку или есть прокрутка' }
      ]
    },
    {
      id: 'k2202', lesson: 'mdk-22', module: 'mdk3', mech: 'build', title: 'Страница по областям', level: 'Среднее', minutes: 25, points: 150,
      story: 'Нужно разложить страницу расписания колледжа: шапка, меню, расписание, объявления и подвал. На телефоне всё идёт столбиком, на планшете и компьютере — три колонки.',
      goal: 'Mobile first. У .page: display: grid, gap не меньше 16px и схема из одной колонки через grid-template-areas с областями header, nav, main, aside, footer (в этом порядке). Каждому блоку назначьте область через grid-area: .page__header — header, .page__nav — nav, .page__main — main, .page__aside — aside, .page__footer — footer. В @media (min-width: 768px) задайте колонки 200px 1fr 200px и схему: шапка и подвал во всю ширину, между ними nav, main, aside. Медиазапросы с max-width не используйте.',
      hints: [
        'Схема на телефоне — пять строк по одному слову: grid-template-areas: "header" "nav" "main" "aside" "footer";',
        'Каждому блоку своя область: .page__header { grid-area: header; } и так далее для всех пяти.',
        'В медиазапросе меняем только .page: grid-template-columns: 200px 1fr 200px; и схему из трёх строк по три слова.',
        'Схема для широкого экрана: "header header header" "nav main aside" "footer footer footer"'
      ],
      html: `<div class="page">
  <header class="page__header">
    <p class="page__logo">Колледж связи · Расписание</p>
  </header>
  <nav class="page__nav">
    <ul>
      <li><a href="#mon">Понедельник</a></li>
      <li><a href="#tue">Вторник</a></li>
      <li><a href="#wed">Среда</a></li>
    </ul>
  </nav>
  <main class="page__main">
    <h1>Расписание группы ИС-11</h1>
    <p>Первая пара начинается в 8:30. Перерыв между парами — 10 минут, большой перерыв после второй пары — 40 минут.</p>
  </main>
  <aside class="page__aside">
    <h2>Объявления</h2>
    <p>В пятницу консультация по МДК.08.01 переносится в кабинет 214.</p>
  </aside>
  <footer class="page__footer">
    <p>Учебная часть: кабинет 101</p>
  </footer>
</div>`,
      css: `${BASE}
.page > * {
  padding: 16px;
  border-radius: 8px;
}
.page p {
  margin: 0;
}
.page__header,
.page__footer {
  background-color: #1f2a44;
  color: #ffffff;
}
.page__nav,
.page__aside {
  background-color: #f1f4fa;
}
.page__nav ul {
  margin: 0;
  padding-left: 20px;
}
.page__main h1 {
  margin-top: 0;
}`,
      tests: [
        { name: '.page — grid-контейнер с gap от 16px', check: h => (h.cs('.page', 'display') === 'grid' && h.px('.page', 'row-gap') >= 16) || 'нужны display: grid и gap: 16px' },
        { name: 'Блоки стоят в областях header, nav, main, aside, footer', check: h => {
          const map = { '.page__header': 'header', '.page__nav': 'nav', '.page__main': 'main', '.page__aside': 'aside', '.page__footer': 'footer' };
          for (const [s, a] of Object.entries(map)) if (h.cs(s, 'grid-row-start') !== a) return `${s}: нет grid-area: ${a}`;
          return h.has(/grid-template-areas/) || 'нет grid-template-areas';
        } },
        { name: 'На компьютере шапка и подвал во всю ширину, подвал внизу', check: h => {
          const p = h.rect('.page'), hd = h.rect('.page__header'), ft = h.rect('.page__footer'), m = h.rect('.page__main');
          return (Math.abs(hd.width - p.width) < 2 && Math.abs(ft.width - p.width) < 2 && ft.top >= m.bottom - 1) || 'шапка или подвал не во всю ширину';
        } },
        { name: 'На компьютере три колонки: меню, расписание, объявления', check: h => {
          const n = h.rect('.page__nav'), m = h.rect('.page__main'), a = h.rect('.page__aside');
          if (!(n.right <= m.left + 1 && m.right <= a.left + 1 && Math.abs(n.top - m.top) < 2 && Math.abs(a.top - m.top) < 2)) return 'nav, main и aside не стоят в один ряд';
          return (Math.abs(n.width - 200) < 2 && Math.abs(a.width - 200) < 2 && m.width > 300) || 'колонки должны быть 200px 1fr 200px';
        } },
        { name: 'Mobile first: колонки добавлены в @media (min-width: 768px), без max-width', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'есть медиазапрос с max-width';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.page\b/.test(r.selector) && r.style.getPropertyValue('grid-template-areas')) || 'нет @media (min-width: 768px) со схемой для .page';
        } },
        { name: 'На телефоне все блоки столбиком по порядку, без прокрутки', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const els = ['.page__header', '.page__nav', '.page__main', '.page__aside', '.page__footer'].map(s => h.$(s));
          const w = h.rect('.page').width;
          return (stacked(els) && els.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) || 'блоки не в одну колонку';
        } }
      ]
    },
    {
      id: 'k2203', lesson: 'mdk-22', module: 'mdk3', mech: 'adaptive', title: 'Статья не помещается в телефон', level: 'Среднее', minutes: 20, points: 150,
      story: 'Статью «Как подготовиться к сессии» сверстали только для компьютера: ширина 960px, колонки в пикселях, картинка 600px. На телефоне страницу приходится листать вбок.',
      goal: 'Переделайте вёрстку по принципу mobile first. У .layout вместо width: 960px — max-width: 960px; базовые стили без колонок (на телефоне статья и боковая колонка идут друг под другом). В @media (min-width: 768px) задайте .layout колонки 2fr 1fr. Картинку .post__img сделайте резиновой: max-width: 100% и height: auto. На телефоне не должно быть горизонтальной прокрутки, картинка не шире статьи и не сплющена.',
      hints: [
        'Начните с картинки: .post__img { display: block; max-width: 100%; height: auto; }',
        'У .layout удалите grid-template-columns и замените width на max-width. Без колонок grid ставит блоки друг под другом.',
        'Колонки — только для широких экранов: @media (min-width: 768px) { .layout { grid-template-columns: 2fr 1fr; } }'
      ],
      html: `<div class="layout">
  <article class="post">
    <h1>Как подготовиться к сессии</h1>
    <img class="post__img" src="img/art.svg" width="600" height="300" alt="Вечерний город за окном читального зала">
    <p>Начните за месяц: составьте список экзаменов и зачётов, рядом запишите, что уже сдано и чего не хватает.</p>
    <p>Разбейте подготовку на короткие подходы по 25 минут с перерывами. Так проще не отвлекаться на телефон.</p>
  </article>
  <aside class="sidebar">
    <h2>Полезные ссылки</h2>
    <ul>
      <li><a href="#library">Электронная библиотека</a></li>
      <li><a href="#schedule">Расписание экзаменов</a></li>
      <li><a href="#consult">Консультации</a></li>
    </ul>
  </aside>
</div>`,
      css: `${BASE}
.layout {
  display: grid;
  grid-template-columns: 640px 300px;
  gap: 20px;
  width: 960px;
  margin: 0 auto;
}
.post__img {
  display: block;
}
.sidebar {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.sidebar h2 {
  margin-top: 0;
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страницу можно листать вбок' },
        { name: 'На телефоне картинка не шире статьи и не сплющена', at: 360, check: h => {
          const i = h.rect('.post__img'), p = h.rect('.post');
          if (i.width > p.width + 1) return `картинка ${Math.round(i.width)}px шире статьи ${Math.round(p.width)}px`;
          return Math.abs(i.width / i.height - 2) < 0.05 || 'пропорции картинки нарушены: нужен height: auto';
        } },
        { name: 'На телефоне боковая колонка под статьёй', at: 360, check: h => h.rect('.sidebar').top >= h.rect('.post').bottom - 1 || 'колонки стоят рядом' },
        { name: 'На компьютере две колонки: статья шире боковой', check: h => {
          const p = h.rect('.post'), s = h.rect('.sidebar');
          return (s.left >= p.right - 1 && Math.abs(s.top - p.top) < 2 && p.width > s.width * 1.5) || 'нужны две колонки 2fr 1fr';
        } },
        { name: 'У .layout max-width вместо фиксированной ширины', check: h => (h.cs('.layout', 'max-width') === '960px' && !/(^|[^-])width\s*:\s*960px/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, ''))) || 'замените width: 960px на max-width: 960px' },
        { name: 'Mobile first: колонки только в @media (min-width: 768px)', check: h => {
          if (h.rules.some(r => !r.media && /\.layout/.test(r.selector) && r.style.getPropertyValue('grid-template-columns'))) return 'в базовых стилях .layout остались колонки';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.layout/.test(r.selector) && r.style.getPropertyValue('grid-template-columns')) || 'нет колонок в @media (min-width: 768px)';
        } }
      ]
    }
  );
})();
