/* Занятие 29. Практическая работа №6 (ч. 1). Интерактивные элементы на JavaScript */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2901', lesson: 'mdk-29', module: 'mdk3', mech: 'adaptive', title: 'Меню-бургер', level: 'Среднее', minutes: 25, points: 150,
      story: 'Сайт кофейни «Зерно» на телефоне: меню из трёх ссылок не помещается в шапку. Нужна кнопка «Меню», которая открывает и закрывает список, а на компьютере меню просто стоит в строку.',
      goal: 'CSS: допишите медиазапрос @media (min-width: 768px), в котором кнопка .burger скрыта (display: none), а меню .menu — в строку (display: flex), даже с атрибутом hidden. JS: щелчок по #burger переключает hidden у #menu; когда меню открыто, у кнопки aria-expanded="true" и надпись «Закрыть», когда закрыто — aria-expanded="false" и «Меню». На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        'Медиазапрос в конце CSS: @media (min-width: 768px) { .burger { display: none; } nav { flex-basis: auto; } .menu, .menu[hidden] { display: flex; gap: 24px; } }',
        'Скрипт: найдите кнопку и меню — const burger = document.querySelector(\'#burger\'); const menu = document.querySelector(\'#menu\');',
        'В обработчике щелчка сначала переключите: menu.hidden = !menu.hidden;',
        'Потом: if (menu.hidden) { burger.setAttribute(\'aria-expanded\', \'false\'); burger.textContent = \'Меню\'; } else { … \'true\' … \'Закрыть\' }'
      ],
      html: `<header class="site-header">
  <a class="logo" href="#top">Зерно</a>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu">Меню</button>
  <nav aria-label="Главное меню">
    <ul class="menu" id="menu" hidden>
      <li><a href="#coffee">Кофе</a></li>
      <li><a href="#food">Выпечка</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<main id="top">
  <h1>Кофейня «Зерно»</h1>
  <section id="coffee">
    <h2>Кофе</h2>
    <p>Эспрессо, капучино и раф на овсяном молоке.</p>
  </section>
  <section id="food">
    <h2>Выпечка</h2>
    <p>Круассаны и сырники каждое утро с 8:00.</p>
  </section>
  <section id="contacts">
    <h2>Контакты</h2>
    <p>Улица Студенческая, 5, напротив главного корпуса.</p>
  </section>
</main>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }
.site-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 16px; background: #2a2238; }
.logo { color: #f2d58a; font-size: 20px; font-weight: 700; text-decoration: none; }
.burger { padding: 8px 14px; border: 2px solid #f2d58a; border-radius: 6px; background: #2a2238; color: #f2d58a; font: inherit; cursor: pointer; }
nav { flex-basis: 100%; }
.menu { margin: 0; padding: 0; list-style: none; }
.menu a { display: block; padding: 10px 0; color: #ffffff; }
main { padding: 0 16px; }
/* Ниже — медиазапрос для экранов от 768px */
`,
      js: `// Меню-бургер
// 1. Найдите кнопку #burger и список #menu

// 2. Щелчок по кнопке: переключить hidden у меню,
//    обновить aria-expanded и надпись кнопки
`,
      tests: [
        { name: 'Телефон: при загрузке меню закрыто, aria-expanded="false"', at: 360, js: true, check: h => !h.visible('#menu') && h.$('#burger').getAttribute('aria-expanded') === 'false' || 'меню должно быть закрыто при загрузке' },
        { name: 'Телефон: щелчок по «Меню» открывает меню, aria-expanded="true", надпись «Закрыть»', at: 360, js: true, check: h => {
          h.click('#burger');
          if (!h.visible('#menu')) return 'меню не открылось';
          if (h.$('#burger').getAttribute('aria-expanded') !== 'true') return 'aria-expanded не стал "true"';
          return h.text('#burger') === 'Закрыть' || `надпись кнопки: «${h.text('#burger')}»`;
        } },
        { name: 'Телефон: второй щелчок закрывает меню и возвращает «Меню»', at: 360, js: true, check: h => {
          h.click('#burger'); h.click('#burger');
          return !h.visible('#menu') && h.$('#burger').getAttribute('aria-expanded') === 'false' && h.text('#burger') === 'Меню' || 'после второго щелчка меню должно закрыться, aria-expanded="false", надпись «Меню»';
        } },
        { name: 'Телефон: кнопка «Меню» видна', at: 360, check: h => h.cs('.burger', 'display') !== 'none' || 'на телефоне кнопка должна быть видна' },
        { name: 'Компьютер: кнопка скрыта, меню видно в строку', check: h => {
          if (h.cs('.burger', 'display') !== 'none') return 'на 1024px кнопку нужно скрыть';
          if (h.cs('#menu', 'display') !== 'flex') return `у меню display: ${h.cs('#menu', 'display')}, нужно flex`;
          return h.sameRow(h.$$('.menu li')) || 'пункты меню не в одну строку';
        } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'Скрипт работает без ошибок', at: 360, js: true, check: h => { h.click('#burger'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2902', lesson: 'mdk-29', module: 'mdk3', mech: 'build', title: 'Вкладки с расписанием', level: 'Среднее', minutes: 25, points: 150,
      story: 'На странице спортзала колледжа расписание секций на три дня. Целиком оно длинное, поэтому дни сделали вкладками. Вёрстка готова, но вкладки не переключаются.',
      goal: 'При щелчке по вкладке .tab: у всех вкладок убрать класс active и поставить aria-selected="false", все панели .panel спрятать (hidden); нажатой вкладке добавить active и aria-selected="true" и показать её панель — ту, чей id записан в aria-controls вкладки.',
      hints: [
        'Найдите все вкладки и все панели: const tabs = document.querySelectorAll(\'.tab\'); const panels = document.querySelectorAll(\'.panel\');',
        'Обработчик каждой вкладке: for (const tab of tabs) { tab.addEventListener(\'click\', function () { … }); }',
        'Внутри сначала выключите всё: for (const t of tabs) { t.classList.remove(\'active\'); t.setAttribute(\'aria-selected\', \'false\'); } и for (const p of panels) { p.hidden = true; }',
        'Потом включите одну: tab.classList.add(\'active\'); tab.setAttribute(\'aria-selected\', \'true\'); document.querySelector(\'#\' + tab.getAttribute(\'aria-controls\')).hidden = false;'
      ],
      html: `<section class="schedule">
  <h1>Расписание секций</h1>
  <div class="tab-list" role="tablist" aria-label="Дни недели">
    <button class="tab active" id="tab-mon" type="button" role="tab" aria-selected="true" aria-controls="panel-mon">Понедельник</button>
    <button class="tab" id="tab-wed" type="button" role="tab" aria-selected="false" aria-controls="panel-wed">Среда</button>
    <button class="tab" id="tab-fri" type="button" role="tab" aria-selected="false" aria-controls="panel-fri">Пятница</button>
  </div>
  <div class="panel" id="panel-mon" role="tabpanel" aria-labelledby="tab-mon">
    <ul>
      <li>16:00 — волейбол, большой зал</li>
      <li>18:00 — настольный теннис, малый зал</li>
    </ul>
  </div>
  <div class="panel" id="panel-wed" role="tabpanel" aria-labelledby="tab-wed" hidden>
    <ul>
      <li>15:30 — баскетбол, большой зал</li>
      <li>17:00 — йога, зал хореографии</li>
    </ul>
  </div>
  <div class="panel" id="panel-fri" role="tabpanel" aria-labelledby="tab-fri" hidden>
    <ul>
      <li>16:00 — мини-футбол, стадион</li>
      <li>18:30 — шахматы, кабинет 105</li>
    </ul>
  </div>
</section>`,
      css: `${BASE}
.schedule { max-width: 560px; }
.tab-list { display: flex; gap: 4px; border-bottom: 2px solid #0b5c8a; }
.tab { padding: 10px 16px; border: 0; border-radius: 8px 8px 0 0; background: #e6f2f9; color: #0b5c8a; font: inherit; cursor: pointer; }
.tab:hover { background: #cfe6f3; }
.tab.active { background: #0b5c8a; color: #ffffff; }
.panel { padding: 8px 16px; border: 2px solid #0b5c8a; border-top: 0; }
.panel li { margin: 8px 0; }`,
      js: `// Вкладки
// 1. Найдите все вкладки .tab и все панели .panel

// 2. Каждой вкладке — обработчик щелчка:
//    выключить все вкладки и панели, включить нажатую и её панель
`,
      tests: [
        { name: 'Щелчок по «Среда» — active и aria-selected="true" только у неё', js: true, check: h => {
          h.click('#tab-wed');
          const a = h.$$('.tab').map(t => t.classList.contains('active') + '/' + t.getAttribute('aria-selected')).join(' ');
          return a === 'false/false true/true false/false' || `сейчас (active/aria-selected): ${a}`;
        } },
        { name: 'Щелчок по «Среда» — видна только панель среды', js: true, check: h => {
          h.click('#tab-wed');
          const v = h.$$('.panel').map(p => h.visible(p)).join(' ');
          return v === 'false true false' || `видимость панелей: ${v}`;
        } },
        { name: '«Пятница», потом «Понедельник» — снова понедельник', js: true, check: h => {
          h.click('#tab-fri'); h.click('#tab-mon');
          const ok = h.visible('#panel-mon') && !h.visible('#panel-fri') && h.$('#tab-mon').classList.contains('active') && !h.$('#tab-fri').classList.contains('active');
          return ok || 'после возврата на понедельник должна быть видна только его панель';
        } },
        { name: 'Повторный щелчок по активной вкладке её не прячет', js: true, check: h => { h.click('#tab-mon'); h.click('#tab-mon'); return h.visible('#panel-mon') || 'панель понедельника пропала'; } },
        { name: 'Панель ищется по aria-controls (getAttribute)', check: h => /getAttribute\(\s*['"]aria-controls['"]\s*\)/.test(h.js) || 'найдите панель через tab.getAttribute(\'aria-controls\')' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#tab-fri'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2903', lesson: 'mdk-29', module: 'mdk3', mech: 'build', title: 'Вопросы о поступлении', level: 'Сложное', minutes: 30, points: 200,
      story: 'Приёмная комиссия колледжа устала отвечать на одни и те же вопросы. На сайте сделали блок «вопрос-ответ»: сначала видны три вопроса, остальные — по кнопке «Показать ещё».',
      goal: 'Аккордеон: щелчок по кнопке .faq-question переключает hidden у ответа, id которого записан в её aria-controls, и ставит aria-expanded="true" (открыт) или "false" (закрыт). Вопросы открываются независимо друг от друга и работают в том числе в скрытых блоках. Кнопка #more: показывает все блоки .extra и прячет саму себя.',
      hints: [
        'Цикл по всем вопросам: for (const question of document.querySelectorAll(\'.faq-question\')) { question.addEventListener(\'click\', function () { … }); }',
        'Ответ этого вопроса: const answer = document.querySelector(\'#\' + question.getAttribute(\'aria-controls\'));',
        'Переключение: answer.hidden = !answer.hidden; question.setAttribute(\'aria-expanded\', answer.hidden ? \'false\' : \'true\'); — или то же самое через if / else.',
        'Кнопка «Показать ещё»: more.addEventListener(\'click\', function () { for (const item of document.querySelectorAll(\'.extra\')) { item.hidden = false; } more.hidden = true; });'
      ],
      html: `<section class="faq">
  <h1>Вопросы о поступлении</h1>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a1">Какие документы нужны?</button></h2>
    <p class="faq-answer" id="a1" hidden>Паспорт, аттестат, четыре фото 3×4 и медицинская справка.</p>
  </div>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a2">До какого числа принимают документы?</button></h2>
    <p class="faq-answer" id="a2" hidden>На бюджет — до 15 августа, на платное обучение — до 1 октября.</p>
  </div>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a3">Есть ли общежитие?</button></h2>
    <p class="faq-answer" id="a3" hidden>Да, общежитие в десяти минутах пешком от главного корпуса.</p>
  </div>
  <div class="faq-item extra" hidden>
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a4">Можно ли подать документы онлайн?</button></h2>
    <p class="faq-answer" id="a4" hidden>Да, через портал Госуслуг или по электронной почте приёмной комиссии.</p>
  </div>
  <div class="faq-item extra" hidden>
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a5">Платят ли стипендию?</button></h2>
    <p class="faq-answer" id="a5" hidden>Да, студентам бюджета, которые учатся без троек.</p>
  </div>
  <button class="more" id="more" type="button">Показать ещё</button>
</section>`,
      css: `${BASE}
.faq { max-width: 620px; }
.faq-item { border-bottom: 1px solid #cccccc; }
.faq-item h2 { margin: 0; font-size: 18px; }
.faq-question { width: 100%; padding: 14px 0; border: 0; background: #ffffff; color: #222222; font: inherit; font-weight: 700; text-align: left; cursor: pointer; }
.faq-question:hover { color: #8a3b12; }
.faq-question::after { content: " +"; color: #8a3b12; }
.faq-answer { margin: 0 0 14px; color: #444444; }
.more { margin-top: 16px; padding: 10px 18px; border: 2px solid #8a3b12; border-radius: 6px; background: #ffffff; color: #8a3b12; font: inherit; cursor: pointer; }`,
      js: `// Вопрос-ответ и «Показать ещё»
// 1. Цикл по всем кнопкам .faq-question:
//    найти ответ по aria-controls, переключить hidden и aria-expanded

// 2. Кнопка #more: показать все .extra и спрятать себя
`,
      tests: [
        { name: 'Щелчок по первому вопросу открывает ответ, aria-expanded="true"', js: true, check: h => {
          const q = h.$$('.faq-question')[0]; h.click(q);
          return h.visible('#a1') && q.getAttribute('aria-expanded') === 'true' || 'ответ не открылся или aria-expanded не "true"';
        } },
        { name: 'Второй щелчок закрывает ответ, aria-expanded="false"', js: true, check: h => {
          const q = h.$$('.faq-question')[0]; h.click(q); h.click(q);
          return !h.visible('#a1') && q.getAttribute('aria-expanded') === 'false' || 'ответ не закрылся или aria-expanded не "false"';
        } },
        { name: 'Вопросы открываются независимо: можно открыть первый и третий', js: true, check: h => {
          const qs = h.$$('.faq-question'); h.click(qs[0]); h.click(qs[2]);
          return h.visible('#a1') && h.visible('#a3') && !h.visible('#a2') || 'должны быть открыты ответы 1 и 3, а 2 — закрыт';
        } },
        { name: '«Показать ещё» показывает оба скрытых вопроса и прячет кнопку', js: true, check: h => {
          if (h.$$('.extra').some(e => h.visible(e))) return 'до щелчка дополнительные вопросы должны быть скрыты';
          h.click('#more');
          if (!h.$$('.extra').every(e => h.visible(e))) return 'после щелчка видны не все вопросы';
          return !h.visible('#more') || 'кнопка «Показать ещё» осталась на экране';
        } },
        { name: 'Вопросы из «Показать ещё» тоже раскрываются', js: true, check: h => {
          h.click('#more');
          const q = h.$$('.faq-question')[4]; h.click(q);
          return h.visible('#a5') && q.getAttribute('aria-expanded') === 'true' || 'пятый вопрос не раскрылся';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#more'); h.click(h.$$('.faq-question')[3]); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
