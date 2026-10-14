/* Занятие 52. Аудит юзабилити, тестирование и документирование */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PRIO = { 'высокий': 0, 'средний': 1, 'низкий': 2 };
  const prioCells = h => h.$$('tbody tr').map(tr => tr.lastElementChild);
  window.COURSE_TASKS.push(
    {
      id: 'k5201', lesson: 'mdk-52', module: 'mdk5', mech: 'build', title: 'Отчёт об аудите таблицей', level: 'Среднее', minutes: 20, points: 150,
      story: 'Вы провели юзабилити-тест формы записи в спортзал с пятью участниками. Заметки лежат в комментарии. Менеджеру нужен отчёт, где сразу видно, что чинить первым.',
      goal: 'Под заголовком сделайте таблицу отчёта: caption с названием, в thead шесть заголовков th scope="col": №, Проблема, Где, Эвристика, Как исправить, Приоритет. В tbody — пять строк, по одной на каждую заметку, в каждой шесть ячеек. Приоритет пишите словом: Высокий, Средний или Низкий. Строки отсортируйте: сначала высокий, потом средний, потом низкий. Ячейке приоритета дайте класс prio-high, prio-medium или prio-low и разный цвет фона для высокого и низкого. Ячейкам таблицы — внутренний отступ не меньше 8px.',
      hints: [
        'Каркас: <table><caption>…</caption><thead><tr><th scope="col">№</th>…</tr></thead><tbody>…</tbody></table>.',
        'Сначала выпишите строки с приоритетом «высокий» (их две), потом «средний» (две), потом «низкий» (одна). Номера № ставьте по новому порядку.',
        'Ячейка приоритета: <td class="prio-high">Высокий</td>.',
        'CSS: table { border-collapse: collapse; } th, td { padding: 8px; border: 1px solid #8c959f; } .prio-high { background-color: #fde2e1; }'
      ],
      html: `<h1>Отчёт об аудите: форма записи в спортзал</h1>
<!-- Заметки с юзабилити-теста (5 участников, задача «Запишитесь на пробное занятие»):
1. Где: кнопка отправки. Кнопка подписана «Ок», двое не поняли, что она записывает на занятие.
   Эвристика: соответствие реальному миру. Исправить: подпись «Записаться на занятие». Приоритет: средний.
2. Где: поле телефона. Подписи нет, только серый текст внутри поля. После ввода номера непонятно, что это за поле.
   Эвристика: узнавание вместо вспоминания. Исправить: постоянная подпись label над полем. Приоритет: высокий.
3. Где: шапка. Логотип не ведёт на главную, один участник искал, как вернуться.
   Эвристика: единообразие и стандарты. Исправить: сделать логотип ссылкой на главную. Приоритет: низкий.
4. Где: после нажатия кнопки. Три секунды ничего не происходит, трое нажали кнопку повторно и записались дважды.
   Эвристика: видимость состояния системы. Исправить: состояние загрузки на кнопке и сообщение об успехе. Приоритет: высокий.
5. Где: поле даты. При неверной дате появляется «Error 0x13».
   Эвристика: помощь в распознавании и исправлении ошибок. Исправить: «Выберите дату не раньше завтрашнего дня». Приоритет: средний.
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Есть таблица с подписью caption', check: h => h.count('table') === 1 && h.text('caption').length >= 5 || 'нужна одна таблица с caption' },
        { name: 'В thead шесть заголовков th scope="col"', check: h => { const th = h.$$('thead th'); return th.length === 6 && th.every(e => e.getAttribute('scope') === 'col') || `заголовков: ${th.length}, со scope="col": ${th.filter(e => e.getAttribute('scope') === 'col').length}`; } },
        { name: 'В tbody пять строк по шесть ячеек', check: h => { const tr = h.$$('tbody tr'); return tr.length === 5 && tr.every(r => r.children.length === 6) || `строк: ${tr.length}, ячеек в строках: ${tr.map(r => r.children.length).join(', ')}`; } },
        { name: 'Приоритет — Высокий, Средний или Низкий; два высоких, два средних, один низкий', check: h => { const v = prioCells(h).map(c => c.textContent.trim().toLowerCase()); if (!v.length || v.some(x => !(x in PRIO))) return `в последнем столбце: ${v.join(', ') || 'пусто'}`; const n = k => v.filter(x => x === k).length; return n('высокий') === 2 && n('средний') === 2 && n('низкий') === 1 || 'приоритеты не совпадают с заметками'; } },
        { name: 'Строки отсортированы: высокий → средний → низкий', check: h => { const v = prioCells(h).map(c => PRIO[c.textContent.trim().toLowerCase()]); return v.length === 5 && v.every((x, i) => i === 0 || x >= v[i - 1]) || 'сначала высокий приоритет, в конце низкий'; } },
        { name: 'У ячеек приоритета классы prio-high / prio-medium / prio-low, высокий и низкий разного цвета', check: h => { const map = { 'высокий': 'prio-high', 'средний': 'prio-medium', 'низкий': 'prio-low' }; const c = prioCells(h); if (!c.length || c.some(e => !e.classList.contains(map[e.textContent.trim().toLowerCase()]))) return 'класс ячейки не совпадает с приоритетом'; return h.cs('.prio-high', 'background-color') !== h.cs('.prio-low', 'background-color') || 'фон высокого и низкого приоритета одинаковый'; } },
        { name: 'У ячеек внутренний отступ не меньше 8px', check: h => { const p = h.px('tbody td', 'padding-left'); return p >= 8 || `сейчас ${p || 0}px`; } }
      ]
    },
    {
      id: 'k5202', lesson: 'mdk-52', module: 'mdk5', mech: 'a11y', title: 'Чиним форму по отчёту', level: 'Среднее', minutes: 20, points: 150,
      story: 'Отчёт об аудите принят, пора исправлять. Перед вами та самая форма записи в спортзал со всеми найденными проблемами.',
      goal: 'Исправьте форму по отчёту: 1) у полей телефона и даты — подписи label for («Телефон», «Дата занятия»); 2) кнопка подписана «Записаться на занятие»; 3) ссылка «тут» заменена понятным текстом, например «Правила клуба»; 4) серый текст условий читается: контраст не меньше 4,5:1 (цвет темнее, например #595959); 5) вместо «Error 0x13» — понятное сообщение, что случилось и как исправить (от 25 символов), и поле даты связано с ним: aria-describedby="date-error".',
      hints: [
        'Подпись: <label for="phone">Телефон</label> перед <input id="phone" …>. Placeholder можно оставить как пример, но подписью он не считается.',
        'Понятная ссылка говорит, куда ведёт: <a href="#rules">правилами клуба</a>.',
        'Контраст: замените color: #b0b0b0 на #595959 — это 7:1 на белом.',
        'Сообщение: <p class="error" id="date-error">Выберите дату не раньше завтрашнего дня.</p>, а у поля: <input id="date" type="date" aria-describedby="date-error">.'
      ],
      html: `<form class="signup" id="signup">
  <h2>Запись на пробное занятие</h2>
  <input id="phone" type="tel" placeholder="Телефон">
  <input id="date" type="date">
  <p class="error">Error 0x13</p>
  <p class="terms">Нажимая кнопку, вы соглашаетесь с правилами клуба. Прочитать их можно <a href="#rules">тут</a>.</p>
  <button class="btn" type="submit">Ок</button>
</form>`,
      css: `${BASE}
.signup { max-width: 400px; display: flex; flex-direction: column; gap: 8px; }
input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
.error { margin: 0; color: #b3261e; }
.terms { color: #b0b0b0; font-size: 14px; }
.btn { min-height: 48px; font-size: 16px; border: none; border-radius: 8px; background-color: #1e6b34; color: #ffffff; }`,
      tests: [
        { name: 'У полей телефона и даты есть подписи label for', check: h => ['phone', 'date'].every(id => h.$(`label[for="${id}"]`)?.textContent.trim()) || 'нет <label for="…"> у поля' },
        { name: 'Кнопка подписана «Записаться на занятие»', check: h => /записаться/i.test(h.text('.btn')) || `сейчас «${h.text('.btn')}»` },
        { name: 'Текст ссылки понятен без контекста (не «тут» и не «здесь»)', check: h => { const t = h.text('.terms a'); return t.length >= 6 && !/^(тут|здесь|сюда|подробнее|ссылка)$/i.test(t) || `ссылка «${t}»`; } },
        { name: 'Текст условий: контраст не меньше 4,5:1', check: h => { const c = h.contrast('.terms'); return c >= 4.5 || `сейчас ${c ? c.toFixed(2) : '?'}:1`; } },
        { name: 'Ошибка понятна: без «Error» и кодов, от 25 символов', check: h => { const t = h.text('.error'); return t.length >= 25 && !/error|0x/i.test(t) || `сейчас «${t}»`; } },
        { name: 'Поле даты связано с сообщением: aria-describedby="date-error"', check: h => { const d = h.$('#date'); const id = d?.getAttribute('aria-describedby'); const e = id && h.doc.getElementById(id); return !!e && e.classList.contains('error') || 'нет aria-describedby, указывающего на сообщение .error'; } }
      ]
    },
    {
      id: 'k5203', lesson: 'mdk-52', module: 'mdk5', mech: 'build', title: 'Отмена с возможностью вернуть', level: 'Сложное', minutes: 20, points: 200,
      story: 'Эвристика «Пользователь управляет и свободен»: ошибочное действие должно легко отменяться. В списке занятий кнопка «Отменить запись» удаляет навсегда — исправим.',
      goal: 'В script.js: по нажатию на кнопку .del её запись .item скрывается (item.hidden = true), а сообщение #toast с кнопкой «Вернуть» появляется. Запомните скрытую запись в переменной. Нажатие на #undo показывает эту запись снова на её месте и прячет #toast. В HTML #toast скрыт атрибутом hidden с самого начала.',
      hints: [
        'Переменная для «последней отменённой» записи: let lastItem = null;',
        'Найти запись, в которой нажата кнопка: const item = button.closest(\'.item\');',
        'Обработчик кнопки .del: item.hidden = true; lastItem = item; toast.hidden = false;',
        'Обработчик #undo: if (lastItem) { lastItem.hidden = false; } toast.hidden = true;'
      ],
      html: `<section class="bookings">
  <h2>Мои занятия</h2>
  <ul class="list">
    <li class="item"><span>Йога, вторник 18:00</span> <button class="del" type="button">Отменить запись</button></li>
    <li class="item"><span>Бассейн, четверг 19:30</span> <button class="del" type="button">Отменить запись</button></li>
    <li class="item"><span>Силовая, суббота 11:00</span> <button class="del" type="button">Отменить запись</button></li>
  </ul>
  <div class="toast" id="toast">
    <p>Запись отменена.</p>
    <button class="undo" id="undo" type="button">Вернуть</button>
  </div>
</section>`,
      css: `${BASE}
.bookings { max-width: 420px; }
.list { margin: 0; padding: 0; list-style: none; }
.item { padding: 8px 0; border-bottom: 1px solid #d0d7de; }
.del { min-height: 44px; margin-left: 8px; padding: 0 12px; font-size: 14px; border: 1px solid #b3261e; border-radius: 8px; background-color: #ffffff; color: #b3261e; }
.toast { margin-top: 16px; padding: 12px 16px; border-radius: 8px; background-color: #24292f; color: #ffffff; }
.toast p { margin: 0 0 8px; }
.undo { min-height: 44px; padding: 0 16px; font-size: 16px; border: none; border-radius: 8px; background-color: #f2a900; color: #24292f; }`,
      js: `const toast = document.querySelector('#toast');
const undo = document.querySelector('#undo');
// 1. Переменная для последней отменённой записи

// 2. Каждой кнопке .del — обработчик: скрыть запись, показать #toast

// 3. Кнопка #undo: вернуть запись, спрятать #toast
`,
      tests: [
        { name: 'В HTML сообщение #toast скрыто атрибутом hidden', check: h => h.$('#toast')?.hidden === true || 'нет hidden у #toast' },
        { name: 'Сначала видны три записи и нет сообщения', js: true, check: h => h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').length === 3 && getComputedStyle(h.doc.querySelector("#toast")).display === 'none' || 'сообщение видно до отмены' },
        { name: '«Отменить запись» скрывает именно свою запись и показывает сообщение', js: true, check: async h => { h.click(h.$$('.del')[1]); await h.wait(); const v = h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent); if (v.length !== 2) return `видно записей: ${v.length}`; if (v.some(t => /Бассейн/.test(t))) return 'скрылась не та запись'; return getComputedStyle(h.doc.querySelector("#toast")).display !== 'none' || 'сообщение #toast не появилось'; } },
        { name: '«Вернуть» возвращает запись на её место и прячет сообщение', js: true, check: async h => { h.click(h.$$('.del')[1]); await h.wait(); h.click('#undo'); await h.wait(); const v = h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').map(e => e.querySelector('span').textContent); if (v.join('|') !== 'Йога, вторник 18:00|Бассейн, четверг 19:30|Силовая, суббота 11:00') return `сейчас: ${v.join('; ')}`; return getComputedStyle(h.doc.querySelector("#toast")).display === 'none' || 'сообщение не спряталось'; } }
      ]
    }
  );
})();
