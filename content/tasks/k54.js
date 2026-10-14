/* Занятие 54. Практическая работа №11 (ч. 2). Схема интерфейса: компоненты и состояния */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  // Рамка outline в правиле: longhand пуст, если в shorthand есть var(), поэтому смотрим и outline
  const hasOutline = (h, re) => h.rules.some(r => re.test(r.selector) && (r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')) && !/none/.test(r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')));
  window.COURSE_TASKS.push(
    {
      id: 'k5401', lesson: 'mdk-54', module: 'mdk5', mech: 'build', title: 'Слоты времени: все состояния', level: 'Среднее', minutes: 25, points: 150,
      story: 'Главный компонент экрана «Выбор времени» — кнопка-слот. В схеме вы описали её состояния: свободно, наведение, фокус, выбрано, занято. Соберём живой компонент.',
      goal: 'Занятые слоты 09:30 и 10:30 выключите атрибутом disabled и оформите .slot:disabled: зачёркнутый текст (text-decoration: line-through), серый фон, курсор not-allowed. Всем слотам добавьте aria-pressed: у 09:00 — "true" (выбран по умолчанию), у остальных — "false". Выбранный слот .slot[aria-pressed="true"] — синий фон #1f5f8b и белый текст. Добавьте .slot:focus-visible с рамкой outline. В script.js: нажатие на свободный слот делает его выбранным (aria-pressed="true"), все остальные — "false", а в #chosen пишет «Выбрано: » и время.',
      hints: [
        'aria-pressed говорит экранному диктору «кнопка нажата». Это и состояние для CSS: .slot[aria-pressed="true"] { … }.',
        'Сброс выбора: for (const s of slots) { s.setAttribute(\'aria-pressed\', \'false\'); }, потом slot.setAttribute(\'aria-pressed\', \'true\').',
        'Текст: chosen.textContent = \'Выбрано: \' + slot.textContent;',
        'На выключенную кнопку click не приходит, поэтому занятые слоты выбрать нельзя — отдельная проверка не нужна.'
      ],
      html: `<section class="picker">
  <h2>Выберите время приёма</h2>
  <p>Терапевт Иванова А. С., вторник, 14 октября</p>
  <div class="slots">
    <button class="slot" type="button">09:00</button>
    <button class="slot" type="button">09:30</button>
    <button class="slot" type="button">10:00</button>
    <button class="slot" type="button">10:30</button>
    <button class="slot" type="button">11:00</button>
    <button class="slot" type="button">11:30</button>
  </div>
  <p class="chosen" id="chosen">Выбрано: 09:00</p>
</section>`,
      css: `${BASE}
.picker { max-width: 420px; }
.slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.slot { min-height: 48px; font-size: 16px; border: 2px solid #1f5f8b; border-radius: 8px; background-color: #ffffff; color: #1f5f8b; cursor: pointer; }
.slot:hover { background-color: #e7eef4; }
.chosen { font-weight: bold; }`,
      js: `const slots = document.querySelectorAll('.slot');
const chosen = document.querySelector('#chosen');

// Нажатие на слот: этот — aria-pressed="true", остальные — "false", текст в #chosen
`,
      tests: [
        { name: 'Слоты 09:30 и 10:30 выключены (disabled), остальные — нет', check: h => { const off = h.$$('.slot').filter(b => b.disabled).map(b => b.textContent.trim()); return off.join() === '09:30,10:30' || `выключены: ${off.join(', ') || 'ни одного'}`; } },
        { name: 'Занятый слот: зачёркнут, серый фон, курсор not-allowed', check: h => { const b = h.$('.slot:disabled'); if (!b) return 'нет выключенного слота'; return /line-through/.test(h.cs(b, 'text-decoration-line')) && h.cs(b, 'background-color') !== rgb('#ffffff') && h.cs(b, 'cursor') === 'not-allowed' || `зачёркивание: ${h.cs(b, 'text-decoration-line')}, фон ${h.cs(b, 'background-color')}, курсор ${h.cs(b, 'cursor')}`; } },
        { name: 'У всех слотов есть aria-pressed, выбран только 09:00', check: h => { const s = h.$$('.slot'); if (s.some(b => !b.hasAttribute('aria-pressed'))) return 'не у всех слотов есть aria-pressed'; const on = s.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent.trim()); return on.join() === '09:00' || `выбраны: ${on.join(', ') || 'ни одного'}`; } },
        { name: 'Выбранный слот: фон #1f5f8b, белый текст', check: h => { const b = h.$('.slot[aria-pressed="true"]'); return !!b && h.cs(b, 'background-color') === rgb('#1f5f8b') && h.cs(b, 'color') === rgb('#ffffff') || 'выбранный слот не выделен'; } },
        { name: 'Есть .slot:focus-visible с рамкой outline', check: h => hasOutline(h, /\.slot:focus-visible/) || 'нет правила .slot:focus-visible с outline' },
        { name: 'Нажатие на 11:00 выбирает его и снимает выбор с остальных', js: true, check: async h => { const b = h.$$('.slot').find(e => e.textContent.trim() === '11:00'); h.click(b); await h.wait(); const on = h.$$('.slot').filter(e => e.getAttribute('aria-pressed') === 'true').map(e => e.textContent.trim()); if (on.join() !== '11:00') return `выбраны: ${on.join(', ') || 'ни одного'}`; return /11:00/.test(h.text('#chosen')) || `в #chosen: «${h.text('#chosen')}»`; } }
      ]
    },
    {
      id: 'k5402', lesson: 'mdk-54', module: 'mdk5', mech: 'a11y', title: 'Вход по отчёту аудита', level: 'Сложное', minutes: 30, points: 200,
      story: 'Аудит экрана «Вход» нашёл пять проблем. Отчёт ниже, исправьте каждую.',
      goal: 'Исправьте по отчёту: 1) у полей нет подписей — добавьте label for «Номер полиса» и «Пароль»; 2) «кнопка» сделана из div и не нажимается с клавиатуры — замените на <button class="btn" type="submit">Войти</button>, а в script.js слушайте событие submit у формы (с preventDefault) вместо click; 3) фокус не виден — удалите outline: none и добавьте правило с :focus-visible и outline; 4) ошибка «Неверно» ничего не объясняет — если в полисе не 16 цифр, напишите в #policy-error, что номер полиса — 16 цифр (в тексте должно быть «16»), если пароль пустой — «Введите пароль» в #pass-error; полю с ошибкой ставьте aria-invalid="true", исправленному — "false"; поля свяжите с сообщениями атрибутом aria-describedby; 5) успех не объявляется — у #status добавьте role="status", при верных данных ошибки очищаются, в #status появляется «Вход выполнен».',
      hints: [
        'Начните с HTML: label for, button вместо div, aria-describedby="policy-error" у полиса и aria-describedby="pass-error" у пароля, role="status" у #status.',
        'Обработчик: form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Проверка полиса: const ok = policy.value.trim().length === 16; policyError.textContent = ok ? \'\' : \'Номер полиса — 16 цифр. Он есть на лицевой стороне полиса.\';',
        'Состояние для диктора: policy.setAttribute(\'aria-invalid\', ok ? \'false\' : \'true\');'
      ],
      html: `<form class="login" id="login" novalidate>
  <h2>Вход в личный кабинет</h2>
  <input id="policy" type="text" inputmode="numeric" placeholder="Номер полиса">
  <p class="error" id="policy-error"></p>
  <input id="pass" type="password" placeholder="Пароль">
  <p class="error" id="pass-error"></p>
  <div class="btn" id="enter">Войти</div>
  <p class="status" id="status"></p>
</form>`,
      css: `${BASE}
.login { max-width: 360px; display: flex; flex-direction: column; gap: 6px; }
input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
input:focus { outline: none; }
.error { margin: 0; color: #b3261e; font-size: 14px; }
.btn { min-height: 48px; padding: 12px; font-size: 16px; text-align: center; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }
.status { margin: 0; color: #1e6b34; font-weight: bold; }`,
      js: `const enter = document.querySelector('#enter');
enter.addEventListener('click', () => {
  const policy = document.querySelector('#policy');
  if (policy.value.length !== 16) {
    document.querySelector('#policy-error').textContent = 'Неверно';
    return;
  }
  document.querySelector('#status').textContent = 'Вход выполнен';
});
`,
      tests: [
        { name: 'У полей есть подписи label for', check: h => ['policy', 'pass'].every(id => h.$(`label[for="${id}"]`)?.textContent.trim()) || 'нет <label for> у поля' },
        { name: 'Кнопка — настоящий <button type="submit">, div-кнопки нет', check: h => { const b = h.$('form button[type="submit"]'); return !!b && /войти/i.test(b.textContent) && !h.$('div.btn') || 'нужен <button type="submit">Войти</button> вместо div'; } },
        { name: 'Фокус виден: нет outline: none, есть :focus-visible с outline', check: h => { if (h.has(/outline(-style)?\s*:\s*(none|0)\s*[;}]/i)) return 'осталось outline: none'; return hasOutline(h, /:focus-visible/) || 'нет правила :focus-visible с outline'; } },
        { name: 'Поля связаны с сообщениями: aria-describedby, у #status role="status"', check: h => { for (const [f, e] of [['#policy', 'policy-error'], ['#pass', 'pass-error']]) if (h.$(f)?.getAttribute('aria-describedby') !== e) return `у ${f} нет aria-describedby="${e}"`; return h.$('#status')?.getAttribute('role') === 'status' || 'у #status нет role="status"'; } },
        { name: 'Неверный полис и пустой пароль: понятные ошибки и aria-invalid="true"', js: true, check: async h => { h.type('#policy', '123'); h.type('#pass', ''); if (h.submit('#login') !== false) return 'нет preventDefault в обработчике submit'; await h.wait(); const pe = h.text('#policy-error'), se = h.text('#pass-error'); if (!/16/.test(pe) || pe.length < 20) return `ошибка полиса: «${pe}»`; if (se.length < 5) return 'нет ошибки пароля'; const p = h.doc.querySelector("#policy"), s = h.doc.querySelector("#pass"); return p.getAttribute('aria-invalid') === 'true' && s.getAttribute('aria-invalid') === 'true' || 'у полей с ошибкой нет aria-invalid="true"'; } },
        { name: 'Верные данные: ошибки очищены, aria-invalid="false", «Вход выполнен»', js: true, check: async h => { h.submit('#login'); await h.wait(); h.type('#policy', '1234567890123456'); h.type('#pass', 'secret12'); h.submit('#login'); await h.wait(); if (h.text('#policy-error') || h.text('#pass-error')) return 'ошибки остались на экране'; const p = h.doc.querySelector("#policy"), s = h.doc.querySelector("#pass"); if (p.getAttribute('aria-invalid') !== 'false' || s.getAttribute('aria-invalid') !== 'false') return 'после исправления aria-invalid должен стать "false"'; return /вход выполнен/i.test(h.text('#status')) || `статус: «${h.text('#status')}»`; } }
      ]
    },
    {
      id: 'k5403', lesson: 'mdk-54', module: 'mdk5', mech: 'build', title: 'Пустое состояние «Мои записи»', level: 'Среднее', minutes: 25, points: 150,
      story: 'В схеме у экрана «Мои записи» три состояния: несколько записей, одна, ни одной. Про последнее часто забывают — и пользователь видит пустой белый экран.',
      goal: 'Блок #empty скройте атрибутом hidden в HTML и добавьте правило .empty[hidden] { display: none; } (у .empty свой display: flex). В script.js: кнопка .cancel удаляет свою запись (item.remove()) и обновляет счётчик #count — сколько записей осталось. Когда записей не осталось, список .list скрывается (hidden), а #empty показывается.',
      hints: [
        'Запись, в которой нажата кнопка: button.closest(\'.item\'). Удаляем: item.remove();',
        'Сколько осталось: const left = list.querySelectorAll(\'.item\').length; count.textContent = left;',
        'Пустое состояние: if (left === 0) { list.hidden = true; empty.hidden = false; }',
        'Если #empty не прячется, проверьте правило .empty[hidden] { display: none; }.'
      ],
      html: `<section class="my">
  <h2>Мои записи (<span id="count">2</span>)</h2>
  <ul class="list">
    <li class="item"><span>Терапевт, 14 октября, 09:00</span> <button class="cancel" type="button">Отменить</button></li>
    <li class="item"><span>Стоматолог, 20 октября, 16:30</span> <button class="cancel" type="button">Отменить</button></li>
  </ul>
  <div class="empty" id="empty">
    <img src="${ICON}" alt="" width="48" height="48">
    <p>У вас пока нет записей. Выберите врача и удобное время — это займёт минуту.</p>
    <a class="btn" href="#doctors">Записаться к врачу</a>
  </div>
</section>`,
      css: `${BASE}
.my { max-width: 420px; }
.list { margin: 0; padding: 0; list-style: none; }
.item { padding: 8px 0; border-bottom: 1px solid #d0d7de; }
.cancel { min-height: 44px; margin-left: 8px; padding: 0 12px; font-size: 14px; border: 1px solid #b3261e; border-radius: 8px; background-color: #ffffff; color: #b3261e; }
.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center; border: 2px dashed #8c959f; border-radius: 12px; }
.btn { display: inline-block; min-height: 44px; padding: 12px 16px; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; text-decoration: none; }`,
      js: `const list = document.querySelector('.list');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');

// Каждой кнопке .cancel — обработчик: удалить запись, обновить счётчик, показать пустое состояние
`,
      tests: [
        { name: 'В HTML #empty скрыт атрибутом hidden', check: h => h.$('#empty')?.hidden === true || 'нет hidden у #empty' },
        { name: 'При открытии пустое состояние не видно', js: true, check: h => getComputedStyle(h.doc.querySelector("#empty")).display === 'none' || '#empty виден: добавьте .empty[hidden] { display: none; }' },
        { name: 'Отмена одной записи: осталась одна, счётчик 1, пустого состояния нет', js: true, check: async h => { h.click('.cancel'); await h.wait(); const n = h.count('.item'); return n === 1 && h.text('#count') === '1' && getComputedStyle(h.doc.querySelector("#empty")).display === 'none' || `записей ${n}, счётчик «${h.text('#count')}»`; } },
        { name: 'Отмена всех записей: список скрыт, видно пустое состояние, счётчик 0', js: true, check: async h => { h.click('.cancel'); await h.wait(); h.click('.cancel'); await h.wait(); if (h.count('.item')) return `осталось записей: ${h.count('.item')}`; if (getComputedStyle(h.doc.querySelector(".list")).display !== 'none') return 'пустой список не скрыт'; if (getComputedStyle(h.doc.querySelector("#empty")).display === 'none') return 'пустое состояние не показалось'; return h.text('#count') === '0' || `счётчик «${h.text('#count')}»`; } }
      ]
    }
  );
})();
