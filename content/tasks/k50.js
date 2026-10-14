/* Занятие 50. Практическая работа №10 (ч. 3). Интерактивный прототип и состояния */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Правило CSS, в селекторе которого есть re и задано свойство prop
  const ruleWith = (h, re, prop) => h.rules.find(r => re.test(r.selector) && r.style.getPropertyValue(prop));
  const BTN = '.btn { min-height: 44px; padding: 10px 16px; font-size: 16px; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }';
  window.COURSE_TASKS.push(
    {
      id: 'k5001', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Кнопка и поле во всех состояниях', level: 'Среднее', minutes: 25, points: 150,
      story: 'В Figma вы нарисовали варианты кнопки: обычная, наведение, нажатие, фокус, выключена. Теперь те же состояния нужно перенести в CSS, иначе в браузере кнопка будет «мёртвой».',
      goal: 'Оформите кнопку .btn: фон #1f5f8b, белый текст, min-height не меньше 44px, курсор pointer. Добавьте состояния: .btn:hover — фон темнее (например #174a6c), .btn:active — ещё темнее или сдвиг, .btn:focus-visible — рамка outline не тоньше 2px. Удалите правило с outline: none. Вторую кнопку выключите атрибутом disabled и оформите .btn:disabled: серый фон, тёмно-серый текст, курсор not-allowed. Полю .field при фокусе (.field:focus-visible) дайте заметную рамку.',
      hints: [
        'Состояние — это то же правило с псевдоклассом: .btn:hover { … }, .btn:active { … }.',
        'outline: none прячет фокус от тех, кто ходит по странице клавишей Tab. Удалите это правило и напишите .btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }.',
        'Выключенная кнопка: <button class="btn" type="button" disabled>Недоступно</button>. Правило .btn:disabled поставьте ниже .btn:hover, иначе наведение перекрасит серую кнопку.',
        'Серый фон с читаемым текстом: background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed;'
      ],
      html: `<section class="card">
  <h2>Бронирование книги</h2>
  <label for="reader">Номер читательского билета</label>
  <input id="reader" class="field" type="text">
  <div class="actions">
    <button class="btn" type="button">Забронировать</button>
    <button class="btn" type="button">Недоступно</button>
  </div>
</section>`,
      css: `${BASE}
.card { max-width: 420px; padding: 24px; border: 1px solid #d0d7de; border-radius: 12px; }
label { display: block; margin-bottom: 6px; font-weight: bold; }
.field { width: 100%; box-sizing: border-box; padding: 10px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
.actions { display: flex; gap: 12px; margin-top: 16px; }
.btn { padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; }
.btn:focus { outline: none; }`,
      tests: [
        { name: 'Кнопка .btn: фон #1f5f8b, белый текст, высота не меньше 44px', check: h => { const b = h.$('.btn:not([disabled])'); if (!b) return 'нет активной кнопки .btn'; const bg = h.cs(b, 'background-color'), c = h.cs(b, 'color'), ht = h.rect(b).height; return bg === rgb('#1f5f8b') && c === rgb('#ffffff') && ht >= 43.5 || `фон ${bg}, текст ${c}, высота ${Math.round(ht)}px`; } },
        { name: '.btn:hover меняет цвет фона', check: h => { const r = ruleWith(h, /\.btn:hover/, 'background-color'); return !!r && r.style.getPropertyValue('background-color') !== rgb('#1f5f8b') || 'нет правила .btn:hover с другим background-color'; } },
        { name: '.btn:active показывает нажатие (фон или сдвиг)', check: h => !!(ruleWith(h, /\.btn:active/, 'background-color') || ruleWith(h, /\.btn:active/, 'transform')) || 'нет правила .btn:active с background-color или transform' },
        { name: '.btn:focus-visible рисует рамку outline не тоньше 2px', check: h => { const r = ruleWith(h, /\.btn:focus-visible/, 'outline-style'); if (!r) return 'нет правила .btn:focus-visible с outline'; const w = parseFloat(r.style.getPropertyValue('outline-width')) || 3; return r.style.getPropertyValue('outline-style') !== 'none' && w >= 2 || `рамка ${r.style.getPropertyValue('outline')}`; } },
        { name: 'Нет outline: none — фокус не прячем', check: h => !h.has(/outline(-style)?\s*:\s*(none|0)\s*[;}]/i) || 'найдено outline: none' },
        { name: 'Вторая кнопка выключена: disabled, серый фон, курсор not-allowed', check: h => { const b = h.$$('.btn')[1]; if (!b || !b.disabled) return 'у второй кнопки нет атрибута disabled'; const bg = h.cs(b, 'background-color'); return bg !== rgb('#1f5f8b') && bg !== 'rgba(0, 0, 0, 0)' && h.cs(b, 'cursor') === 'not-allowed' || `фон ${bg}, курсор ${h.cs(b, 'cursor')}`; } },
        { name: 'Поле .field при фокусе выделяется рамкой', check: h => !!(ruleWith(h, /\.field:focus/, 'outline-style') || ruleWith(h, /\.field:focus/, 'border-top-color') || ruleWith(h, /\.field:focus/, 'box-shadow')) || 'нет правила .field:focus-visible с outline или border-color' }
      ]
    },
    {
      id: 'k5002', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Прототип из трёх экранов', level: 'Среднее', minutes: 30, points: 150,
      story: 'В Figma экраны связаны стрелками на вкладке Prototype. В браузере стрелок нет: переходы между экранами делает JavaScript. Соберём живой прототип приложения библиотеки.',
      goal: 'В HTML скройте второй и третий экраны атрибутом hidden. В CSS добавьте правило .screen[hidden] { display: none; } (без него display: flex перебивает hidden). В script.js напишите функцию showScreen(id): она скрывает все .screen и показывает экран с этим id. Каждой кнопке с атрибутом data-go добавьте обработчик click, который вызывает showScreen с значением data-go. Должно работать: «Подробнее» → карточка книги, «Забронировать» → «Книга забронирована», «Назад к каталогу» и «В каталог» → каталог.',
      hints: [
        'Скрыть экран в HTML: <section class="screen" id="screen-book" hidden>. Проверьте предпросмотр: если экран всё равно виден, значит, его показывает display: flex — добавьте правило .screen[hidden].',
        'Функция: function showScreen(id) { for (const screen of screens) { screen.hidden = screen.id !== id; } } — где screens = document.querySelectorAll(\'.screen\').',
        'screen.id !== id — это true для всех «чужих» экранов (их прячем) и false для нужного (его показываем).',
        'Кнопки: for (const button of document.querySelectorAll(\'[data-go]\')) { button.addEventListener(\'click\', () => showScreen(button.dataset.go)); }'
      ],
      html: `<main class="phone">
  <section class="screen" id="screen-catalog">
    <h2>Каталог</h2>
    <ul class="books">
      <li>«Мастер и Маргарита» <button class="btn" type="button" data-go="screen-book">Подробнее</button></li>
    </ul>
  </section>
  <section class="screen" id="screen-book">
    <h2>Мастер и Маргарита</h2>
    <p>М. А. Булгаков. В наличии: 2 экземпляра.</p>
    <button class="btn" type="button" data-go="screen-done">Забронировать</button>
    <button class="btn btn-secondary" type="button" data-go="screen-catalog">Назад к каталогу</button>
  </section>
  <section class="screen" id="screen-done">
    <h2>Книга забронирована</h2>
    <p>Заберите её на абонементе в течение трёх дней.</p>
    <button class="btn" type="button" data-go="screen-catalog">В каталог</button>
  </section>
</main>`,
      css: `${BASE}
.phone { max-width: 360px; margin: 0 auto; padding: 16px; border: 1px solid #d0d7de; border-radius: 16px; }
.screen { display: flex; flex-direction: column; gap: 12px; }
.books { margin: 0; padding: 0; list-style: none; }
.books li { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
${BTN}
.btn-secondary { background-color: #e7eef4; color: #1f5f8b; }`,
      js: `// 1. Найдите все экраны: document.querySelectorAll('.screen')

// 2. Функция showScreen(id): скрыть все экраны, кроме экрана с этим id

// 3. Каждой кнопке с атрибутом data-go — обработчик click
`,
      tests: [
        { name: 'В HTML второй и третий экраны скрыты атрибутом hidden', check: h => h.count('.screen[hidden]') === 2 && !h.$('#screen-catalog').hidden || `скрыто экранов: ${h.count('.screen[hidden]')}` },
        { name: 'При открытии виден только экран «Каталог»', js: true, check: h => { const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); if (v.length === 1 && v[0] === 'screen-catalog') return true; return `видны: ${v.join(', ') || 'ни одного'}` + (h.count('.screen[hidden]') && v.length > 1 ? ' — hidden есть, но display: flex его перебивает' : ''); } },
        { name: '«Подробнее» открывает карточку книги, каталог скрыт', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-book' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: '«Забронировать» открывает экран «Книга забронирована»', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); h.click('#screen-book [data-go="screen-done"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-done' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: '«Назад к каталогу» возвращает в каталог', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); h.click('#screen-book [data-go="screen-catalog"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-catalog' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: 'Есть функция showScreen(id), и она работает', js: true, check: async h => { const f = h.get('showScreen'); if (typeof f !== 'function') return 'нет функции showScreen'; f('screen-done'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-done' || `после showScreen('screen-done') видны: ${v.join(', ') || 'ни одного'}`; } }
      ]
    },
    {
      id: 'k5003', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Кнопка, которая ждёт согласия', level: 'Среднее', minutes: 25, points: 150,
      story: 'Последний экран прототипа — подтверждение брони. Кнопка должна быть выключена, пока читатель не согласился с правилами, а после отправки — показать результат.',
      goal: 'Выключите кнопку #send атрибутом disabled в HTML и добавьте правило .btn:disabled (серый фон, курсор not-allowed). В script.js: при событии change у галочки #agree кнопка включается, если галочка стоит, и выключается, если снята. При отправке формы #booking отмените перезагрузку (preventDefault), выключите кнопку, смените её текст на «Готово», а в #status напишите «Бронь подтверждена» (можно с номером брони).',
      hints: [
        'Включить и выключить кнопку можно одной строкой: send.disabled = !agree.checked;',
        'Слушаем галочку: agree.addEventListener(\'change\', () => { … });',
        'Форма: form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Внутри обработчика submit: send.disabled = true; send.textContent = \'Готово\'; statusText.textContent = \'Бронь подтверждена. Номер брони: 1024.\';'
      ],
      html: `<form class="booking" id="booking">
  <h2>Подтверждение брони</h2>
  <p>«Мастер и Маргарита», абонемент, срок — 3 дня.</p>
  <label class="check"><input type="checkbox" id="agree"> Я прочитал правила библиотеки</label>
  <button class="btn" type="submit" id="send">Подтвердить бронь</button>
  <p class="status" id="status" role="status"></p>
</form>`,
      css: `${BASE}
.booking { max-width: 420px; display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid #d0d7de; border-radius: 12px; }
.check { display: flex; gap: 8px; align-items: center; }
${BTN}
.status { margin: 0; color: #1e6b34; font-weight: bold; }`,
      js: `const agree = document.querySelector('#agree');
const send = document.querySelector('#send');
const form = document.querySelector('#booking');
const statusText = document.querySelector('#status');

// 1. Галочка включает и выключает кнопку

// 2. Отправка формы: без перезагрузки, кнопка «Готово», сообщение в #status
`,
      tests: [
        { name: 'Кнопка выключена с самого начала (disabled в HTML)', check: h => h.$('#send')?.disabled === true || 'у #send нет атрибута disabled' },
        { name: 'Выключенная кнопка выглядит иначе: серый фон и курсор not-allowed', check: h => { const bg = h.cs('#send', 'background-color'); return h.$('#send')?.disabled && bg !== rgb('#1f5f8b') && h.cs('#send', 'cursor') === 'not-allowed' || `фон ${bg}, курсор ${h.cs('#send', 'cursor')}`; } },
        { name: 'Галочка включает кнопку, снятая галочка снова выключает', js: true, check: async h => { h.click('#agree'); await h.wait(); const on = !h.doc.querySelector("#send").disabled; h.click('#agree'); await h.wait(); const off = h.doc.querySelector("#send").disabled; return on && off || (on ? 'после снятия галочки кнопка осталась включённой' : 'после галочки кнопка не включилась'); } },
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: async h => { h.click('#agree'); await h.wait(); return h.submit('#booking') === false || 'в обработчике submit нет event.preventDefault()'; } },
        { name: 'После отправки: кнопка «Готово» выключена, в #status «Бронь подтверждена»', js: true, check: async h => { h.click('#agree'); await h.wait(); h.submit('#booking'); await h.wait(); const b = h.doc.querySelector("#send"); return b.disabled && h.text('#send') === 'Готово' && /бронь подтверждена/i.test(h.text('#status')) || `кнопка: «${h.text('#send')}», ${b.disabled ? 'выключена' : 'включена'}; статус: «${h.text('#status')}»`; } }
      ]
    }
  );
})();
