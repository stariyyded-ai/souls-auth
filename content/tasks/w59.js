/* Занятие 59. ЛР36. Модальное окно отмены с причиной и смена статуса через fetch */
(() => {
  const { BASE } = window.COURSE_KIT;
  const row = (id, fio, code, text, cls) => {
    const opts = [['new', 'Новая'], ['in_work', 'В работе'], ['done', 'Выполнена'], ['cancelled', 'Отменена']]
      .map(([v, t]) => `          <option value="${v}"${v === code ? ' selected' : ''}>${t}</option>`).join('\n');
    return `      <tr data-id="${id}">
        <td>${id}</td>
        <td>${fio}</td>
        <td><span class="badge ${cls}" data-badge>${text}</span></td>
        <td>
          <label class="visually-hidden" for="st-${id}">Статус заявки ${id}</label>
          <select id="st-${id}" class="status-select" data-current="${code}">
${opts}
          </select>
        </td>
      </tr>`;
  };
  const TABLE = `<meta name="csrf-token" content="a1b2c3d4">
<main class="admin">
  <h1>Заявки клиентов</h1>
  <table class="table">
    <thead>
      <tr><th>№</th><th>Клиент</th><th>Статус</th><th>Изменить</th></tr>
    </thead>
    <tbody>
${row(12, 'Иванова Анна', 'new', 'Новая', 'badge-new')}
${row(13, 'Петров Пётр', 'in_work', 'В работе', 'badge-work')}
${row(77, 'Сидорова Мария', 'done', 'Выполнена', 'badge-done')}
    </tbody>
  </table>
</main>`;
  const TOASTS = '<div id="toasts" class="toasts" aria-live="polite"></div>';
  const CSS = `${BASE}
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 8px; border-bottom: 1px solid #d0d5dd; text-align: left; }
.status-select { padding: 6px; font: inherit; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #4b5563; color: #ffffff; font-size: 14px; }
.badge-new { background: #1f4fb8; }
.badge-work { background: #8a5a00; }
.badge-done { background: #146c43; }
.toasts { position: fixed; right: 16px; bottom: 16px; left: 16px; display: grid; gap: 8px; }
.toast { padding: 12px 16px; border-radius: 10px; background: #146c43; color: #ffffff; }
.toast--error { background: #b42318; }`;
  const STUB = `// ===== Заглушка сервера: так ответил бы update_status.php. Не меняйте =====
const requestsDb = { 12: { status: 'new', reason: null }, 13: { status: 'in_work', reason: null } }; // заявки 77 в базе нет
const serverLog = [];          // что пришло на сервер
let serverOnline = true;       // false — «выключили Apache»
window.fetch = async (url, options = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (!serverOnline) throw new TypeError('Failed to fetch');
  const headers = options.headers || {};
  serverLog.push({ url, method: options.method || 'GET', headers, body: options.body });
  const reply = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
  if (url !== 'update_status.php') return reply(404, { ok: false, error: 'Нет такого адреса' });
  if (options.method !== 'POST') return reply(405, { ok: false, error: 'Метод не разрешён' });
  if (headers['X-CSRF-Token'] !== 'a1b2c3d4') return reply(403, { ok: false, error: 'Неверный токен, обновите страницу' });
  let data;
  try { data = JSON.parse(options.body); } catch (err) { return reply(400, { ok: false, error: 'Некорректный JSON' }); }
  const allowed = ['new', 'in_work', 'done', 'cancelled'];
  if (!Number.isInteger(data.id) || data.id < 1 || !allowed.includes(data.status)) return reply(400, { ok: false, error: 'Неверная заявка или статус' });
  const reason = String(data.reason || '').trim();
  if (data.status === 'cancelled' && reason === '') return reply(400, { ok: false, error: 'Укажите причину отмены' });
  if (!requestsDb[data.id]) return reply(404, { ok: false, error: 'Заявка не найдена' });
  requestsDb[data.id] = { status: data.status, reason: data.status === 'cancelled' ? reason : null };
  return reply(200, { ok: true, id: data.id, status: data.status });
};
// ===== Конец заглушки =====

// ===== Готовые помощники из ЛР34 и ЛР35 =====
const STATUS = {
  new:       { text: 'Новая',     cls: 'badge-new' },
  in_work:   { text: 'В работе',  cls: 'badge-work' },
  done:      { text: 'Выполнена', cls: 'badge-done' },
  cancelled: { text: 'Отменена',  cls: 'badge-cancel' },
};
function renderBadge(el, status) {
  const s = STATUS[status] ?? { text: status, cls: '' };
  el.textContent = s.text;
  el.className = \`badge \${s.cls}\`;
}
function showToast(text, type = 'success') {
  const toast = document.createElement('div');
  toast.className = \`toast toast--\${type}\`;
  toast.textContent = text;
  document.getElementById('toasts').append(toast);
}
// ===== Конец помощников =====

const csrf = document.querySelector('meta[name="csrf-token"]').content;
`;
  const SAVE = `async function saveStatus(select, status, reason = '') {
  const row = select.closest('tr');
  select.disabled = true;
  try {
    const response = await fetch('update_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      body: JSON.stringify({ id: Number(row.dataset.id), status, reason }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || \`Ошибка \${response.status}\`);

    select.dataset.current = status;
    renderBadge(row.querySelector('[data-badge]'), status);
    showToast('Статус изменён');
  } catch (err) {
    select.value = select.dataset.current;
    showToast(err.message, 'error');
  } finally {
    select.disabled = false;
  }
}
`;
  window.COURSE_TASKS.push(
    {
      id: 'w5901', lesson: 'm9-lr36', module: 'mdk96', mech: 'build', title: 'Статус без перезагрузки', level: 'Сложное', minutes: 30, points: 200,
      story: 'Администратор портала меняет статус заявки — и ждёт перезагрузки страницы. Сделаем как в современных системах: выбрал в списке — статус сразу сохранился через fetch, бейдж обновился, внизу всплыло «Статус изменён». А если сервер отказал — список честно вернулся к старому значению.',
      goal: 'Напишите async-функцию saveStatus(select, status, reason = \'\'): на время запроса select.disabled = true; fetch(\'update_status.php\') методом POST с заголовками Content-Type: application/json и X-CSRF-Token (токен уже в переменной csrf) и телом JSON.stringify({ id: Number(row.dataset.id), status, reason }), где row = select.closest(\'tr\'); ответ — await response.json(); если !response.ok или !data.ok — throw new Error(data.error). Успех: select.dataset.current = status, renderBadge для [data-badge] этой строки, showToast(\'Статус изменён\'). Ошибка (catch): select.value = select.dataset.current и showToast(err.message, \'error\'). В finally снимите disabled. Повесьте ОДИН обработчик change на таблицу (делегирование через closest(\'.status-select\')), который вызывает saveStatus(select, select.value). Заглушку и помощники не меняйте.',
      hints: [
        'Каркас: async function saveStatus(select, status, reason = \'\') { const row = select.closest(\'tr\'); select.disabled = true; try { … } catch (err) { … } finally { select.disabled = false; } }',
        'Запрос: const response = await fetch(\'update_status.php\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\', \'X-CSRF-Token\': csrf }, body: JSON.stringify({ id: Number(row.dataset.id), status, reason }) });',
        'Разбор: const data = await response.json().catch(() => ({})); if (!response.ok || !data.ok) throw new Error(data.error || `Ошибка ${response.status}`);',
        'Делегирование: document.querySelector(\'table\').addEventListener(\'change\', (e) => { const select = e.target.closest(\'.status-select\'); if (select) saveStatus(select, select.value); });'
      ],
      html: `${TABLE}
${TOASTS}`,
      css: CSS,
      js: `${STUB}
// Ваш код: saveStatus и один обработчик change на таблице
`,
      tests: [
        { name: 'Смена на «В работе»: бейдж, data-current, запись в базе, toast', js: true, check: async h => {
          const s = h.$('#st-12');
          h.type(s, 'in_work');
          if (!s.disabled) return 'на время запроса select должен быть disabled';
          await h.wait(150);
          if (s.disabled) return 'после ответа select остался disabled: нужен finally';
          if (h.get('requestsDb')[12].status !== 'in_work') return 'в «базе» статус не изменился';
          const b = h.$('tr[data-id="12"] [data-badge]');
          if (h.text(b) !== 'В работе' || !b.classList.contains('badge-work')) return `бейдж: «${h.text(b)}», ${b.className}`;
          if (s.dataset.current !== 'in_work') return 'data-current не обновлён';
          return h.text('#toasts .toast') === 'Статус изменён' || 'нет уведомления «Статус изменён»';
        } },
        { name: 'Запрос: POST, JSON, X-CSRF-Token, id числом', js: true, check: async h => {
          h.type('#st-13', 'done'); await h.wait(150);
          const r = h.get('serverLog')[0]; if (!r) return 'запрос не отправлен';
          if (r.url !== 'update_status.php' || r.method !== 'POST') return `запрос: ${r.method} ${r.url}`;
          if (r.headers['Content-Type'] !== 'application/json') return 'нет заголовка Content-Type: application/json';
          if (r.headers['X-CSRF-Token'] !== 'a1b2c3d4') return 'нет заголовка X-CSRF-Token с токеном из meta';
          let body; try { body = JSON.parse(r.body); } catch (e) { return 'тело — не JSON: используйте JSON.stringify'; }
          return body.id === 13 && body.status === 'done' || `тело: ${r.body}`;
        } },
        { name: 'Сервер ответил 404: select вернулся, бейдж прежний, toast с ошибкой', js: true, check: async h => {
          h.type('#st-77', 'new'); await h.wait(150);
          if (h.$('#st-77').value !== 'done') return `select показывает «${h.$('#st-77').value}», а в базе done`;
          if (h.text('tr[data-id="77"] [data-badge]') !== 'Выполнена') return 'бейдж изменился, хотя сервер отказал';
          const t = h.$('#toasts .toast');
          return t && t.classList.contains('toast--error') && h.text(t) === 'Заявка не найдена' || 'нужен toast с типом error и текстом ошибки сервера';
        } },
        { name: 'Отмена без причины: сервер вернул 400 — откат и сообщение', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); await h.wait(150);
          if (h.$('#st-12').value !== 'new') return 'select не откатился';
          return h.text('#toasts .toast') === 'Укажите причину отмены' || `уведомление: «${h.text('#toasts .toast')}»`;
        } },
        { name: 'Сервер выключен: откат, toast, без необработанных ошибок', js: true, check: async h => {
          h.get('serverOnline = false');
          h.type('#st-13', 'done'); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          if (h.$('#st-13').value !== 'in_work') return 'select не вернулся к in_work';
          return !h.$('#st-13').disabled && !!h.$('#toasts .toast--error') || 'select должен разблокироваться, а toast — показать ошибку';
        } },
        { name: 'Один обработчик на таблицу работает и для новых строк', js: true, check: async h => {
          const tr = h.$('tr[data-id="12"]').cloneNode(true);
          tr.dataset.id = '13';
          tr.querySelector('select').id = 'st-new'; tr.querySelector('label').htmlFor = 'st-new';
          h.$('tbody').append(tr);
          h.type('#st-new', 'done'); await h.wait(150);
          const r = h.get('serverLog')[0];
          return r && JSON.parse(r.body).id === 13 || 'для добавленной строки запрос не ушёл: повесьте change на таблицу';
        } }
      ]
    },
    {
      id: 'w5902', lesson: 'm9-lr36', module: 'mdk96', mech: 'build', title: 'Причина отмены в окне', level: 'Сложное', minutes: 30, points: 200,
      story: 'Отменить заявку без объяснения нельзя: клиент должен знать почему. Когда администратор выбирает «Отменена», открывается окно с полем причины. Пустую причину окно не принимает, а если окно закрыли — список возвращается к прежнему статусу, чтобы интерфейс не расходился с базой.',
      goal: 'saveStatus уже готова. Напишите: 1) обработчик change на таблице: если выбрано cancelled — запомнить select в pendingSelect, очистить поле #cancel-reason, текст #reason-error и класс is-invalid, открыть окно showModal(); любой другой статус — сразу saveStatus(select, select.value). 2) submit формы #cancel-form: preventDefault; причина после trim пустая — полю класс is-invalid, в #reason-error «Укажите причину отмены», окно не закрывать; иначе запомнить select, обнулить pendingSelect, закрыть окно dialog.close() и вызвать saveStatus(select, \'cancelled\', reason). 3) Кнопка [data-cancel-close] закрывает окно. 4) Событие close окна: если pendingSelect ещё не null — вернуть ему value = dataset.current и обнулить.',
      hints: [
        'В change: if (select.value === \'cancelled\') { pendingSelect = select; reasonInput.value = \'\'; reasonError.textContent = \'\'; reasonInput.classList.remove(\'is-invalid\'); dialog.showModal(); reasonInput.focus(); } else { saveStatus(select, select.value); }',
        'Submit: const reason = reasonInput.value.trim(); if (reason === \'\') { reasonInput.classList.add(\'is-invalid\'); reasonError.textContent = \'Укажите причину отмены\'; return; }',
        'Порядок важен: const select = pendingSelect; pendingSelect = null; dialog.close(); saveStatus(select, \'cancelled\', reason); — иначе обработчик close решит, что окно закрыли без подтверждения.',
        'dialog.addEventListener(\'close\', () => { if (pendingSelect) { pendingSelect.value = pendingSelect.dataset.current; pendingSelect = null; } });'
      ],
      html: `${TABLE}
<dialog id="cancel-dialog" class="modal" aria-labelledby="cancel-title">
  <form id="cancel-form" novalidate>
    <h2 id="cancel-title">Отмена заявки</h2>
    <label for="cancel-reason">Причина отмены</label>
    <textarea id="cancel-reason" name="reason" maxlength="255" rows="3" aria-describedby="reason-error"></textarea>
    <div id="reason-error" class="invalid-feedback"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" type="button" data-cancel-close>Не отменять</button>
      <button class="btn" type="submit">Отменить заявку</button>
    </div>
  </form>
</dialog>
${TOASTS}`,
      css: `${CSS}
.modal { max-width: min(90vw, 380px); padding: 24px; border: 0; border-radius: 12px; }
.modal::backdrop { background: rgb(0 0 0 / 0.45); }
.modal h2 { margin-top: 0; }
.modal label { display: block; margin-bottom: 4px; font-weight: 700; }
.modal textarea { box-sizing: border-box; width: 100%; padding: 8px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.modal textarea.is-invalid { border-color: #c62828; }
.invalid-feedback { min-height: 1em; margin: 4px 0 12px; color: #b42318; font-size: 14px; }
.modal-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn { padding: 10px 16px; border: 2px solid #b42318; border-radius: 8px; background: #b42318; color: #ffffff; font: inherit; cursor: pointer; }
.btn-ghost { border-color: #4b5563; background: #ffffff; color: #1d1f24; }`,
      js: `${STUB}${SAVE}
const dialog = document.getElementById('cancel-dialog');
const cancelForm = document.getElementById('cancel-form');
const reasonInput = document.getElementById('cancel-reason');
const reasonError = document.getElementById('reason-error');
let pendingSelect = null;      // какой select ждёт причину

// 1. change на таблице: cancelled — окно, остальное — сразу saveStatus

// 2. submit формы причины

// 3. Кнопка «Не отменять»

// 4. Событие close: вернуть select, если отмену не подтвердили
`,
      tests: [
        { name: 'Выбор «Отменена» открывает окно и ничего не отправляет', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); await h.wait(100);
          if (!h.$('#cancel-dialog').open) return 'окно не открылось';
          return h.get('serverLog').length === 0 || 'запрос ушёл раньше, чем ввели причину';
        } },
        { name: 'Пустая причина: ошибка под полем, окно открыто, запроса нет', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-reason').value = '   ';
          if (h.submit('#cancel-form')) return 'нужен e.preventDefault() в submit';
          await h.wait(100);
          if (!h.$('#cancel-dialog').open) return 'окно закрылось без причины';
          if (h.text('#reason-error') !== 'Укажите причину отмены') return `под полем: «${h.text('#reason-error')}»`;
          if (!h.$('#cancel-reason').classList.contains('is-invalid')) return 'нет класса is-invalid у поля';
          return h.get('serverLog').length === 0 || 'запрос не должен уходить';
        } },
        { name: 'Причина введена: окно закрыто, в базе cancelled с причиной, бейдж «Отменена»', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-reason').value = '  Клиент передумал  ';
          h.submit('#cancel-form'); await h.wait(150);
          if (h.$('#cancel-dialog').open) return 'окно не закрылось';
          const r = h.get('requestsDb')[12];
          if (r.status !== 'cancelled' || r.reason !== 'Клиент передумал') return `в базе: ${JSON.stringify(r)}`;
          if (h.$('#st-12').value !== 'cancelled') return 'select откатился, хотя отмена подтверждена';
          return h.text('tr[data-id="12"] [data-badge]') === 'Отменена' || 'бейдж не обновился';
        } },
        { name: '«Не отменять»: окно закрыто, select вернулся, запроса нет', js: true, check: async h => {
          h.type('#st-13', 'cancelled');
          h.click('[data-cancel-close]'); await h.wait(100);
          if (h.$('#cancel-dialog').open) return 'окно не закрылось';
          // в скрытой проверочной рамке браузер может не прислать событие close — пришлём его сами
          h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          if (h.$('#st-13').value !== 'in_work') return `select показывает «${h.$('#st-13').value}»`;
          return h.get('serverLog').length === 0 || 'запрос не должен уходить';
        } },
        { name: 'Закрытие окна (Esc) тоже возвращает select', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-dialog').close(); await h.wait(100);
          h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          return h.$('#st-12').value === 'new' || 'после закрытия окна select должен вернуться к data-current';
        } },
        { name: 'При новом открытии старая ошибка и причина стёрты', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); h.$('#cancel-reason').value = ''; h.submit('#cancel-form');
          h.click('[data-cancel-close]'); h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          h.$('#cancel-reason').value = 'старое';
          h.type('#st-13', 'cancelled');
          return h.$('#cancel-reason').value === '' && h.text('#reason-error') === '' && !h.$('#cancel-reason').classList.contains('is-invalid') || 'при открытии очистите поле, текст ошибки и is-invalid';
        } },
        { name: 'Другие статусы сохраняются сразу, без окна', js: true, check: async h => {
          h.type('#st-12', 'done'); await h.wait(150);
          if (h.$('#cancel-dialog').open) return 'окно открылось для статуса «Выполнена»';
          return h.get('requestsDb')[12].status === 'done' || 'статус не сохранился';
        } }
      ]
    }
  );
})();
