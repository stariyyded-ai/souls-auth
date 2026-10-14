/* Занятие 53. Практическая работа №11 (ч. 1). Схема интерфейса: карта экранов */
(() => {
  const { BASE } = window.COURSE_KIT;
  const CARDS_CSS = `.screens { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.screen { padding: 12px 16px; border: 2px solid #1f5f8b; border-radius: 12px; }
.screen h3 { margin: 0 0 4px; }
.screen p { margin: 0; color: #57606a; }`;
  const card = (id, name, goal) => `    <article class="screen" id="screen-${id}"><h3>${name}</h3><p>${goal}</p></article>`;
  const CARDS = [
    card('home', 'Главная', 'Ближайшая запись и кнопка «Записаться»'),
    card('login', 'Вход', 'Номер полиса и пароль'),
    card('doctors', 'Выбор врача', 'Список специальностей и врачей'),
    card('time', 'Выбор времени', 'Свободные слоты на неделю'),
    card('confirm', 'Подтверждение', 'Врач, дата, время, кнопка «Записаться»'),
    card('done', 'Запись создана', 'Номер талона, кнопка «В мои записи»'),
    card('my', 'Мои записи', 'Список записей с кнопкой «Отменить»')
  ].join('\n');
  window.COURSE_TASKS.push(
    {
      id: 'k5301', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'Экраны приложения карточками', level: 'Среднее', minutes: 25, points: 150,
      story: 'Начинаем схему интерфейса веб-приложения «Запись к врачу». Сначала — полный список экранов: что это за экран, зачем он и что на нём главное.',
      goal: 'После заголовка h1 добавьте раздел section с заголовком h2 «Экраны» и контейнером div.screens. В нём не меньше шести карточек article.screen из списка в комментарии. У каждой карточки: id вида screen-… (латиницей), заголовок h3 с названием экрана, абзац p с назначением и список ul с двумя-тремя главными элементами экрана. Контейнер .screens — сетка (display: grid): на компьютере три карточки в ряд, на телефоне 360px — одна колонка, без горизонтальной прокрутки.',
      hints: [
        'Одна карточка: <article class="screen" id="screen-home"><h3>Главная</h3><p>Стартовый экран пациента.</p><ul><li>Ближайшая запись</li><li>Кнопка «Записаться»</li></ul></article>.',
        'id пишем латиницей без пробелов: screen-home, screen-doctors, screen-time…',
        'Mobile first: .screens { display: grid; grid-template-columns: 1fr; gap: 16px; }.',
        '@media (min-width: 768px) { .screens { grid-template-columns: repeat(3, 1fr); } }'
      ],
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<!-- Экраны приложения:
  Главная — ближайшая запись, кнопка «Записаться», меню
  Вход — номер полиса, пароль, кнопка «Войти»
  Выбор врача — специальности, список врачей, поиск
  Выбор времени — дни недели, свободные слоты, кнопка «Далее»
  Подтверждение — врач, дата и время, кнопка «Записаться»
  Запись создана — номер талона, кнопка «В мои записи»
  Мои записи — список записей, кнопка «Отменить»
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Раздел с заголовком h2 и не меньше шести карточек article.screen', check: h => { const n = h.count('.screens article.screen'); return h.count('section h2') >= 1 && n >= 6 || `карточек в .screens: ${n}`; } },
        { name: 'У каждой карточки id вида screen-…', check: h => { const bad = h.$$('article.screen').filter(a => !/^screen-[a-z0-9-]+$/.test(a.id)); return h.count('article.screen') > 0 && !bad.length || `без правильного id: ${bad.length || 'карточек нет'}`; } },
        { name: 'В каждой карточке h3, абзац p и список ul из 2–3 пунктов', check: h => { const a = h.$$('article.screen'); const bad = a.find(e => !e.querySelector('h3')?.textContent.trim() || !e.querySelector('p')?.textContent.trim() || !(e.querySelectorAll('ul li').length >= 2 && e.querySelectorAll('ul li').length <= 3)); return a.length > 0 && !bad || `карточка «${bad ? (bad.querySelector('h3')?.textContent || bad.id) : '—'}» неполная`; } },
        { name: 'На компьютере .screens — сетка, три карточки в ряд', check: h => { const a = h.$$('article.screen'); if (h.cs('.screens', 'display') !== 'grid') return '.screens не grid'; return a.length >= 4 && h.sameRow(a.slice(0, 3)) && !h.sameRow(a.slice(0, 4)) || 'в ряду должно быть три карточки'; } },
        { name: 'На телефоне карточки в одну колонку, без прокрутки', at: 360, check: h => { const l = h.$$('article.screen').map(e => Math.round(e.getBoundingClientRect().left)); return l.length > 1 && new Set(l).size === 1 && !h.overflow() || 'карточки не в одну колонку или есть прокрутка'; } }
      ]
    },
    {
      id: 'k5302', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'Таблица переходов', level: 'Среднее', minutes: 25, points: 150,
      story: 'Экраны есть, теперь нужны связи: откуда, по какому действию и куда попадает пользователь. В Figma это стрелки, в документе — таблица переходов со ссылками на карточки.',
      goal: 'Под карточками добавьте section с h2 «Переходы» и таблицей: caption, в thead три th scope="col" — «Откуда», «Действие пользователя», «Куда». В tbody не меньше семи строк. В ячейках «Откуда» и «Куда» — ссылки a на карточки экранов (href="#screen-…"), и каждая ссылка ведёт на существующий экран. В каждый экран, кроме Главной, должен вести хотя бы один переход. Добавьте правило .screen:target — выделение карточки, на которую перешли по ссылке (фон или рамка другого цвета).',
      hints: [
        'Строка таблицы: <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-doctors">Выбор врача</a></td></tr>.',
        'Пройдите основной сценарий: Главная → Выбор врача → Выбор времени → Подтверждение → Запись создана → Мои записи. Не забудьте про Вход.',
        'Псевдокласс :target срабатывает у элемента, id которого стоит в адресе после #. Нажмите ссылку в предпросмотре — карточка подсветится.',
        '.screen:target { background-color: #fff3cd; border-color: #8a5a00; }'
      ],
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<section>
  <h2>Экраны</h2>
  <div class="screens">
${CARDS}
  </div>
</section>
<!-- Здесь раздел «Переходы» с таблицей -->
`,
      css: `${BASE}
h1 { font-size: 26px; }
${CARDS_CSS}`,
      tests: [
        { name: 'Таблица переходов: caption и три th scope="col"', check: h => { const th = h.$$('table thead th'); return !!h.text('table caption') && th.length === 3 && th.every(e => e.getAttribute('scope') === 'col') || `caption: ${h.text('table caption') ? 'есть' : 'нет'}, th: ${th.length}`; } },
        { name: 'Не меньше семи переходов', check: h => h.count('table tbody tr') >= 7 || `строк: ${h.count('table tbody tr')}` },
        { name: 'В столбцах «Откуда» и «Куда» — ссылки на существующие экраны', check: h => { const rows = h.$$('table tbody tr'); if (!rows.length) return 'нет строк'; for (const r of rows) for (const td of [r.children[0], r.children[2]]) { const a = td?.querySelector('a[href^="#"]'); if (!a) return `в строке «${r.textContent.trim().slice(0, 30)}» нет ссылки`; const t = h.doc.getElementById(a.getAttribute('href').slice(1)); if (!t || !t.classList.contains('screen')) return `ссылка ${a.getAttribute('href')} никуда не ведёт`; } return true; } },
        { name: 'В каждый экран, кроме Главной, ведёт хотя бы один переход', check: h => { const to = new Set(h.$$('table tbody tr').map(r => r.children[2]?.querySelector('a')?.getAttribute('href'))); const miss = h.$$('article.screen').filter(a => a.id !== 'screen-home' && !to.has('#' + a.id)); return !miss.length || `нет перехода в: ${miss.map(a => a.querySelector('h3').textContent).join(', ')}`; } },
        { name: 'Есть правило .screen:target с выделением', check: h => h.rules.some(r => /\.screen:target/.test(r.selector) && (r.style.backgroundColor || r.style.borderTopColor || r.style.outlineStyle)) || 'нет правила .screen:target с фоном или рамкой' }
      ]
    },
    {
      id: 'k5303', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'User flow основного сценария', level: 'Сложное', minutes: 30, points: 200,
      story: 'Карта экранов показывает всё сразу. Чтобы обсудить с командой главное, рисуют user flow — путь пользователя по одному сценарию, шаг за шагом, с развилками.',
      goal: 'Разметьте сценарий из комментария нумерованным списком ol.flow: каждый шаг — li.step (не меньше пяти). Шаг-развилка «Есть свободное время?» — li.step с дополнительным классом decision, внутри — список ul из двух вариантов: «Да — …» и «Нет — …». На компьютере шаги стоят в ряд (display: flex, flex-wrap: wrap), на телефоне 360px — в колонку. Развилка выглядит иначе, чем обычный шаг (пунктирная рамка или другой фон). У каждого шага, кроме последнего, псевдоэлемент ::after рисует стрелку «→» (подсказка: .step:not(:last-child)::after).',
      hints: [
        'Каркас: <ol class="flow"><li class="step">Главная: нажимает «Записаться»</li> … </ol>.',
        'Развилка: <li class="step decision">Есть свободное время?<ul><li>Да — выбирает слот</li><li>Нет — «Сообщить, когда появится»</li></ul></li>.',
        'Ряд и колонка: .flow { display: flex; flex-direction: column; gap: 12px; } и @media (min-width: 768px) { .flow { flex-direction: row; flex-wrap: wrap; } }.',
        'Стрелка: .step:not(:last-child)::after { content: " →"; font-weight: bold; }. Пунктир: .decision { border-style: dashed; }.'
      ],
      html: `<h1>User flow: запись к терапевту</h1>
<!-- Сценарий: пациент записывается к терапевту
  1. Главная: нажимает «Записаться»
  2. Выбор врача: выбирает терапевта
  3. Выбор времени: смотрит свободные слоты
  4. Развилка «Есть свободное время?»
       Да — выбирает слот и идёт дальше
       Нет — нажимает «Сообщить, когда появится» и возвращается на Главную
  5. Подтверждение: проверяет данные и нажимает «Записаться»
  6. Запись создана: видит номер талона
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Список ol.flow, в нём не меньше пяти шагов li.step', check: h => { const n = h.$$('ol.flow > li.step').length; return n >= 5 || `шагов: ${n}`; } },
        { name: 'Развилка li.step.decision со списком из двух вариантов «Да…» и «Нет…»', check: h => { const d = h.$('ol.flow > li.step.decision'); if (!d) return 'нет шага с классом decision'; const v = [...d.querySelectorAll('ul > li')].map(e => e.textContent.trim()); return v.length === 2 && /^да/i.test(v[0]) && /^нет/i.test(v[1]) || `варианты: ${v.join(' | ') || 'нет списка'}`; } },
        { name: 'На компьютере шаги стоят в ряд (flex)', check: h => { const s = h.$$('ol.flow > li.step'); return h.cs('ol.flow', 'display') === 'flex' && s.length > 1 && h.sameRow(s.slice(0, 2)) || 'первые шаги не в одном ряду'; } },
        { name: 'На телефоне шаги в колонку', at: 360, check: h => { const l = h.$$('ol.flow > li.step').map(e => Math.round(e.getBoundingClientRect().left)); return l.length > 1 && new Set(l).size === 1 && !h.overflow() || 'шаги не в одну колонку или есть прокрутка'; } },
        { name: 'Развилка выглядит иначе: рамка или фон отличаются', check: h => { const d = h.$('li.step.decision'), s = h.$$('li.step').find(e => !e.classList.contains('decision')); if (!d || !s) return 'нет развилки или обычного шага'; return ['border-top-style', 'background-color', 'border-top-color'].some(p => h.cs(d, p) !== h.cs(s, p)) || 'развилка оформлена так же, как шаг'; } },
        { name: 'Стрелки ::after у всех шагов, кроме последнего', check: h => { const s = h.$$('ol.flow > li.step'); if (s.length < 2) return 'мало шагов'; const has = e => { const c = h.win.getComputedStyle(e, '::after').content; return c && c !== 'none' && c !== 'normal' && c !== '""'; }; return s.slice(0, -1).every(has) && !has(s[s.length - 1]) || 'стрелка должна быть у каждого шага, кроме последнего'; } }
      ]
    }
  );
})();
