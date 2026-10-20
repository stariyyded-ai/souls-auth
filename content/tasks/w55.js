/* Занятие 55. ПР22. fetch и JSON: проверка логина без перезагрузки */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5501', lesson: 'm9-pr22', module: 'mdk96', mech: 'build', title: 'Логин свободен?', level: 'Сложное', minutes: 30, points: 200,
      story: 'Пользователь придумал логин, заполнил ещё шесть полей — и только после отправки узнал, что логин занят. Спросим сервер сразу, как человек ушёл с поля. Настоящего check_login.php в песочнице нет, поэтому вверху скрипта стоит заглушка: она отвечает на fetch так же, как ответил бы PHP.',
      goal: 'Напишите async-функцию checkLogin() и повесьте её на событие blur поля логина. Логин берите через trim; если он короче 6 символов — сразу return, запрос не отправляйте. Запрос: await fetch(\'check_login.php?login=\' + encodeURIComponent(login)); если !response.ok — бросьте ошибку (throw new Error(…)); иначе data = await response.json(). Свободен (data.free) — у поля класс is-valid, текст в #login-error пустой; занят — класс is-invalid и в #login-error текст data.message. Любую ошибку ловите в try/catch и выводите в #login-error «Не удалось проверить логин». Заглушку сервера не меняйте.',
      hints: [
        'Каркас: async function checkLogin() { const login = loginInput.value.trim(); if (login.length < 6) return; try { … } catch (err) { … } } и loginInput.addEventListener(\'blur\', checkLogin);',
        'Внутри try: const response = await fetch(\'check_login.php?login=\' + encodeURIComponent(login)); if (!response.ok) throw new Error(\'HTTP \' + response.status);',
        'Дальше: const data = await response.json(); loginInput.classList.toggle(\'is-invalid\', !data.free); loginInput.classList.toggle(\'is-valid\', data.free);',
        'Текст: loginBox.textContent = data.free ? \'\' : data.message; а в catch — loginBox.textContent = \'Не удалось проверить логин\';'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username" aria-describedby="login-error">
      <div class="invalid-feedback" id="login-error"></div>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.field input.is-valid { border-color: #146c43; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`,
      js: `// ===== Заглушка сервера: так ответил бы check_login.php. Не меняйте =====
const takenLogins = ['adminka', 'ivanov', 'manager'];
const serverLog = [];          // адреса, на которые ушёл fetch
let serverOnline = true;       // false — «выключили Apache»
window.fetch = async (url) => {
  serverLog.push(url);
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (!serverOnline) throw new TypeError('Failed to fetch');
  const login = decodeURIComponent(String(url).split('login=')[1] || '');
  if (login === 'broken') return { ok: false, status: 500, json: async () => { throw new SyntaxError('Unexpected token <'); } };
  const free = !takenLogins.includes(login);
  const data = { free, message: free ? 'Логин свободен' : 'Логин уже занят' };
  return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(data)) };
};
// ===== Конец заглушки =====

const loginInput = document.querySelector('input[name="login"]');
const loginBox = document.getElementById('login-error');

// Ваш код: async function checkLogin() и обработчик blur
`,
      tests: [
        { name: 'Занятый логин: is-invalid и «Логин уже занят» после ухода с поля', js: true, check: async h => {
          h.type('#login', 'ivanov'); h.$('#login').dispatchEvent(new FocusEvent('blur'));
          await h.wait(150);
          if (!h.$('#login').classList.contains('is-invalid')) return 'занятый логин не подсвечен';
          return h.text('#login-error') === 'Логин уже занят' || `под полем: «${h.text('#login-error')}»`;
        } },
        { name: 'Свободный логин: is-valid, ошибки нет', js: true, check: async h => {
          h.type('#login', 'ivanov'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          h.type('#login', 'petrov2026'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          const i = h.$('#login');
          if (!i.classList.contains('is-valid') || i.classList.contains('is-invalid')) return 'свободный логин должен получить is-valid без is-invalid';
          return h.text('#login-error') === '' || 'текст ошибки остался';
        } },
        { name: 'Короткий логин — запрос не отправляется', js: true, check: async h => {
          h.type('#login', '  abc  '); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(100);
          return h.get('serverLog').length === 0 || 'для логина короче 6 символов fetch вызывать не нужно';
        } },
        { name: 'Логин в адресе закодирован через encodeURIComponent', js: true, check: async h => {
          h.type('#login', 'a&b=1 тест'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(100);
          const u = h.get('serverLog')[0] || '';
          return u === 'check_login.php?login=' + encodeURIComponent('a&b=1 тест') || `адрес запроса: ${u || 'запроса нет'}`;
        } },
        { name: 'Ответ 500 — проверка response.ok и сообщение пользователю', js: true, check: async h => {
          h.type('#login', 'broken'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#login-error') === 'Не удалось проверить логин' || `под полем: «${h.text('#login-error')}»`;
        } },
        { name: 'Сервер выключен — пользователь видит сообщение, а не тишину', js: true, check: async h => {
          h.get('serverOnline = false');
          h.type('#login', 'petrov2026'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#login-error') === 'Не удалось проверить логин' || 'нужен try/catch с сообщением «Не удалось проверить логин»';
        } },
        { name: 'Используются async/await и проверка response.ok', check: h => /async\s+function\s+checkLogin|checkLogin\s*=\s*async/.test(h.js) && /await\s+fetch/.test(h.js) && /response\.ok|\.ok\b/.test(h.js.split('// ===== Конец заглушки')[1] || '') || 'нужны async function checkLogin, await fetch и проверка response.ok' }
      ]
    },
    {
      id: 'w5502', lesson: 'm9-pr22', module: 'mdk96', mech: 'build', title: 'Который час на сервере', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Первое знакомство с JSON: тестовая страница портала спрашивает hello.php, который отвечает {"time": "…", "name": "Портал"}. Страница не перезагружается — меняется только одна строчка. Сервер в песочнице заменён заглушкой.',
      goal: 'По щелчку на #ask: отправьте await fetch(\'hello.php\'), проверьте response.ok, разберите JSON и запишите в #answer текст «Портал: сейчас 12:34:56» (название и время берите из data.name и data.time). Если сервер ответил ошибкой или недоступен — в #answer «Сервер не отвечает». Также запишите в переменную note строку JSON.stringify({ a: 1, b: \'текст\' }), а в переменную parsed — результат JSON.parse(\'{"x": [1, 2, 3]}\'). Заглушку не меняйте.',
      hints: [
        'Обработчик: ask.addEventListener(\'click\', async () => { try { … } catch (err) { answer.textContent = \'Сервер не отвечает\'; } });',
        'Внутри: const response = await fetch(\'hello.php\'); if (!response.ok) throw new Error(\'HTTP \' + response.status); const data = await response.json();',
        'Вывод: answer.textContent = `${data.name}: сейчас ${data.time}`;',
        'JSON: const note = JSON.stringify({ a: 1, b: \'текст\' }); const parsed = JSON.parse(\'{"x": [1, 2, 3]}\');'
      ],
      html: `<main class="demo">
  <h1>Проверка связи с сервером</h1>
  <button class="btn" id="ask" type="button">Который час?</button>
  <p id="answer">Ответа пока нет.</p>
</main>`,
      css: `${BASE}
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
#answer { font-size: 20px; }`,
      js: `// ===== Заглушка сервера: так ответил бы hello.php. Не меняйте =====
let serverStatus = 200;        // 500 — «сервер сломался»
window.fetch = async (url) => {
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (url !== 'hello.php') return { ok: false, status: 404, json: async () => ({}) };
  const text = JSON.stringify({ time: '12:34:56', name: 'Портал' });
  return { ok: serverStatus === 200, status: serverStatus, json: async () => JSON.parse(text) };
};
// ===== Конец заглушки =====

const ask = document.getElementById('ask');
const answer = document.getElementById('answer');

// 1. JSON туда и обратно: переменные note и parsed

// 2. Кнопка «Который час?»
`,
      tests: [
        { name: 'Щелчок по кнопке выводит «Портал: сейчас 12:34:56»', js: true, check: async h => {
          h.click('#ask'); await h.wait(150);
          return h.text('#answer') === 'Портал: сейчас 12:34:56' || `в #answer: «${h.text('#answer')}»`;
        } },
        { name: 'Ответ 500 — «Сервер не отвечает»', js: true, check: async h => {
          h.get('serverStatus = 500');
          h.click('#ask'); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#answer') === 'Сервер не отвечает' || `в #answer: «${h.text('#answer')}»: проверьте response.ok`;
        } },
        { name: 'note — строка JSON, parsed — объект с массивом x', js: true, check: h => {
          if (h.get('note') !== '{"a":1,"b":"текст"}') return `note = ${JSON.stringify(h.get('note'))}`;
          const p = h.get('parsed');
          return p && Array.isArray(p.x) && p.x.join() === '1,2,3' || 'parsed должен быть объектом { x: [1, 2, 3] }';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: async h => { h.click('#ask'); await h.wait(100); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
