/* Занятие 30. Практическая работа №6 (ч. 2). Проверка формы на JavaScript */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.form { display: flex; flex-direction: column; gap: 4px; max-width: 380px; }
label { margin-top: 12px; font-weight: 700; }
input { padding: 10px; border: 1px solid #767676; border-radius: 6px; font: inherit; }
input:focus-visible { outline: 3px solid #0b5c8a; outline-offset: 1px; }
.error { min-height: 20px; margin: 0; color: #b3261e; font-size: 14px; }
button { margin-top: 16px; padding: 12px; border: 0; border-radius: 6px; background: #0b5c8a; color: #ffffff; font: inherit; cursor: pointer; }
button:hover { background: #08476b; }
.result { font-weight: 700; color: #1e6b34; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k3001', lesson: 'mdk-30', module: 'mdk3', mech: 'build', title: 'Имя и почта', level: 'Среднее', minutes: 25, points: 150,
      story: 'Студсовет собирает заявки на волонтёрство. Половина заявок приходит без имени, а в почте то нет @, то нет точки. Добавим проверку до отправки.',
      goal: 'При отправке формы #signup отмените перезагрузку. Имя (#name): пусто или одни пробелы — в #name-error текст «Введите имя» и aria-invalid="true" у поля. Почта (#email): пусто — «Введите почту»; нет @ или нет точки — «Почта должна быть в формате name@mail.ru»; в обоих случаях aria-invalid="true". Если поле верное — сообщение пустое, aria-invalid="false". Ошибки обоих полей показываются одновременно.',
      hints: [
        'Найдите форму, два поля и два абзаца ошибок по id. Обработчик: form.addEventListener(\'submit\', function (event) { event.preventDefault(); … });',
        'Имя: if (nameInput.value.trim() === \'\') { nameError.textContent = \'Введите имя\'; nameInput.setAttribute(\'aria-invalid\', \'true\'); } else { … пусто и \'false\' }',
        'Почту сохраните в переменную: const email = emailInput.value.trim(); Дальше if (email === \'\') { … } else if (!email.includes(\'@\') || !email.includes(\'.\')) { … } else { … }',
        'Не ставьте return после первой ошибки: проверка имени и проверка почты — два отдельных if, один за другим.'
      ],
      html: `<form id="signup" class="form" novalidate>
  <h1>Стать волонтёром</h1>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="given-name" aria-describedby="name-error" required>
  <p class="error" id="name-error"></p>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <button type="submit">Отправить заявку</button>
</form>`,
      css: FORM_CSS.replace(/\n\.result[^\n]*/, ''),
      js: `// Проверка имени и почты
// 1. Найдите форму #signup, поля #name и #email, абзацы #name-error и #email-error

// 2. Событие submit: отменить отправку, проверить имя, проверить почту
`,
      tests: [
        { name: 'Отправка не перезагружает страницу (preventDefault)', js: true, check: h => h.submit('#signup') === false || 'вызовите event.preventDefault()' },
        { name: 'Пустая форма: обе ошибки сразу и aria-invalid="true" у обоих полей', js: true, check: h => {
          h.submit('#signup');
          if (h.text('#name-error') !== 'Введите имя') return `у имени: «${h.text('#name-error')}»`;
          if (h.text('#email-error') !== 'Введите почту') return `у почты: «${h.text('#email-error')}»`;
          return h.$('#name').getAttribute('aria-invalid') === 'true' && h.$('#email').getAttribute('aria-invalid') === 'true' || 'aria-invalid должен стать "true" у обоих полей';
        } },
        { name: 'Имя из пробелов — «Введите имя»', js: true, check: h => { h.type('#name', '   '); h.submit('#signup'); return h.text('#name-error') === 'Введите имя' || 'используйте trim()'; } },
        { name: 'Почта без @ или без точки — ошибка формата', js: true, check: h => {
          const msg = 'Почта должна быть в формате name@mail.ru';
          h.type('#email', 'anna.mail.ru'); h.submit('#signup');
          if (h.text('#email-error') !== msg) return `для anna.mail.ru: «${h.text('#email-error')}»`;
          h.type('#email', 'anna@mailru'); h.submit('#signup');
          if (h.text('#email-error') !== msg) return `для anna@mailru: «${h.text('#email-error')}»`;
          return h.$('#email').getAttribute('aria-invalid') === 'true' || 'aria-invalid должен быть "true"';
        } },
        { name: 'После исправления ошибки исчезают, aria-invalid="false"', js: true, check: h => {
          h.submit('#signup');
          h.type('#name', 'Анна'); h.type('#email', 'anna@mail.ru'); h.submit('#signup');
          if (h.text('#name-error') || h.text('#email-error')) return `остались сообщения: «${h.text('#name-error')}» «${h.text('#email-error')}»`;
          return h.$('#name').getAttribute('aria-invalid') === 'false' && h.$('#email').getAttribute('aria-invalid') === 'false' || 'aria-invalid должен стать "false"';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#signup'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k3002', lesson: 'mdk-30', module: 'mdk3', mech: 'build', title: 'Регистрация в библиотеке', level: 'Сложное', minutes: 30, points: 200,
      story: 'Электронная библиотека колледжа открывает регистрацию. Нужна полная проверка: имя, почта, пароль и сообщение об успехе.',
      goal: 'Напишите функцию setError(input, errorEl, message): кладёт message в errorEl и ставит input aria-invalid="true", если message не пустое, и "false", если пустое. При отправке #register (без перезагрузки) проверьте: имя (#name) не пустое после trim — «Введите имя»; почта (#email) — пусто: «Введите почту», нет @ или точки: «Почта должна быть в формате name@mail.ru»; пароль (#password) не короче 8 символов — «Пароль — не меньше 8 символов». Если всё верно — в #result «Заявка отправлена», если есть ошибки — #result пустой.',
      hints: [
        'Функция: function setError(input, errorEl, message) { errorEl.textContent = message; if (message === \'\') { input.setAttribute(\'aria-invalid\', \'false\'); } else { input.setAttribute(\'aria-invalid\', \'true\'); } }',
        'В обработчике submit: event.preventDefault(); let valid = true; — дальше три проверки.',
        'Пример для пароля: if (passwordInput.value.length < 8) { setError(passwordInput, passwordError, \'Пароль — не меньше 8 символов\'); valid = false; } else { setError(passwordInput, passwordError, \'\'); }',
        'Итог: if (valid) { result.textContent = \'Заявка отправлена\'; } else { result.textContent = \'\'; }'
      ],
      html: `<form id="register" class="form" novalidate>
  <h1>Регистрация в библиотеке</h1>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="name" aria-describedby="name-error" required>
  <p class="error" id="name-error"></p>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <label for="password">Пароль</label>
  <input id="password" name="password" type="password" autocomplete="new-password" aria-describedby="password-error" required minlength="8">
  <p class="error" id="password-error"></p>
  <button type="submit">Зарегистрироваться</button>
</form>
<p class="result" id="result" role="status"></p>`,
      css: FORM_CSS,
      js: `// Регистрация: проверка трёх полей
// 1. Функция setError(input, errorEl, message)

// 2. Найдите форму, поля, абзацы ошибок и #result

// 3. Событие submit: preventDefault, let valid = true, три проверки, итог
`,
      tests: [
        { name: 'setError — функция, ставит текст и aria-invalid', js: true, check: h => {
          const f = h.get('setError');
          if (typeof f !== 'function') return 'нет функции setError';
          f(h.$('#name'), h.$('#name-error'), 'Тест');
          if (h.text('#name-error') !== 'Тест' || h.$('#name').getAttribute('aria-invalid') !== 'true') return 'с сообщением: нужен текст и aria-invalid="true"';
          f(h.$('#name'), h.$('#name-error'), '');
          return h.text('#name-error') === '' && h.$('#name').getAttribute('aria-invalid') === 'false' || 'с пустым сообщением: текст пустой и aria-invalid="false"';
        } },
        { name: 'Отправка не перезагружает страницу', js: true, check: h => h.submit('#register') === false || 'вызовите event.preventDefault()' },
        { name: 'Пустая форма: три сообщения, итога нет', js: true, check: h => {
          h.submit('#register');
          const got = ['#name-error', '#email-error', '#password-error'].map(s => h.text(s)).join(' | ');
          if (got !== 'Введите имя | Введите почту | Пароль — не меньше 8 символов') return `сейчас: ${got}`;
          return h.text('#result') === '' || '#result должен быть пустым';
        } },
        { name: 'Почта anna@mailru — ошибка формата', js: true, check: h => { h.type('#email', 'anna@mailru'); h.submit('#register'); return h.text('#email-error') === 'Почта должна быть в формате name@mail.ru' || `сейчас: «${h.text('#email-error')}»`; } },
        { name: 'Пароль из 7 символов — ошибка, из 8 — нет', js: true, check: h => {
          h.type('#password', '1234567'); h.submit('#register');
          if (h.text('#password-error') !== 'Пароль — не меньше 8 символов') return '7 символов должны давать ошибку';
          h.type('#password', '12345678'); h.submit('#register');
          return h.text('#password-error') === '' && h.$('#password').getAttribute('aria-invalid') === 'false' || '8 символов — уже без ошибки';
        } },
        { name: 'Всё верно — «Заявка отправлена», ошибок нет', js: true, check: h => {
          h.submit('#register');
          h.type('#name', 'Олег'); h.type('#email', 'oleg@mail.ru'); h.type('#password', 'книги2024'); h.submit('#register');
          if (['#name-error', '#email-error', '#password-error'].some(s => h.text(s))) return 'остались сообщения об ошибках';
          return h.text('#result') === 'Заявка отправлена' || `#result: «${h.text('#result')}»`;
        } },
        { name: 'После успеха и новой ошибки итог исчезает', js: true, check: h => {
          h.type('#name', 'Олег'); h.type('#email', 'oleg@mail.ru'); h.type('#password', 'книги2024'); h.submit('#register');
          h.type('#email', ''); h.submit('#register');
          return h.text('#result') === '' || '«Заявка отправлена» осталась, хотя почта пустая';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#register'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k3003', lesson: 'mdk-30', module: 'mdk3', mech: 'fix', title: 'Почините форму входа', level: 'Среднее', minutes: 25, points: 150,
      story: 'Однокурсник сделал проверку формы входа в личный кабинет. Консоль чистая, но форма ведёт себя странно: ругается на правильную почту, пускает пароль из шести символов, а «Заявка отправлена» пишет даже при ошибках.',
      goal: 'Найдите и исправьте пять логических ошибок. Должно работать так: страница не перезагружается; почта без @ или без точки — «Почта должна быть в формате name@mail.ru», верная почта — без ошибки; пароль короче 8 символов — «Пароль — не меньше 8 символов»; исправленные поля очищают сообщение и получают aria-invalid="false"; «Заявка отправлена» в #result — только если ошибок нет, иначе #result пустой.',
      hints: [
        'Первое, что должно быть в обработчике submit, — event.preventDefault().',
        'Условие для почты сейчас срабатывает, когда @ ЕСТЬ. Нужно наоборот, и ещё проверить точку: !email.value.includes(\'@\') || !email.value.includes(\'.\')',
        'Сравните число в проверке пароля с текстом сообщения.',
        'У каждого if с ошибкой нужна ветка else, которая стирает сообщение и ставит aria-invalid="false". А итог пишите только if (valid).'
      ],
      html: `<form id="login" class="form" novalidate>
  <h1>Вход в личный кабинет</h1>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <label for="password">Пароль</label>
  <input id="password" name="password" type="password" autocomplete="current-password" aria-describedby="password-error" required>
  <p class="error" id="password-error"></p>
  <button type="submit">Войти</button>
</form>
<p class="result" id="result" role="status"></p>`,
      css: FORM_CSS,
      js: `// Проверка формы входа. Пять логических ошибок!
const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  let valid = true;

  if (email.value.includes('@')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    email.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (password.value.length < 6) {
    passwordError.textContent = 'Пароль — не меньше 8 символов';
    password.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  result.textContent = 'Заявка отправлена';
});
`,
      tests: [
        { name: 'Отправка не перезагружает страницу', js: true, check: h => h.submit('#login') === false || 'не хватает event.preventDefault()' },
        { name: 'Верная почта anna@mail.ru — без ошибки', js: true, check: h => { h.type('#email', 'anna@mail.ru'); h.submit('#login'); return h.text('#email-error') === '' || `сейчас: «${h.text('#email-error')}»`; } },
        { name: 'Почта без @ или без точки — ошибка формата', js: true, check: h => {
          h.type('#email', 'anna.mail.ru'); h.submit('#login');
          if (h.text('#email-error') !== 'Почта должна быть в формате name@mail.ru') return 'для anna.mail.ru нет ошибки';
          h.type('#email', 'anna@mailru'); h.submit('#login');
          return h.text('#email-error') === 'Почта должна быть в формате name@mail.ru' || 'для anna@mailru нет ошибки';
        } },
        { name: 'Пароль из 6–7 символов — ошибка', js: true, check: h => { h.type('#password', 'abc1234'); h.submit('#login'); return h.text('#password-error') === 'Пароль — не меньше 8 символов' || 'пароль из 7 символов прошёл проверку'; } },
        { name: 'Исправленные поля очищают сообщение, aria-invalid="false"', js: true, check: h => {
          h.type('#email', 'anna'); h.type('#password', '123'); h.submit('#login');
          h.type('#email', 'anna@mail.ru'); h.type('#password', 'parol2024'); h.submit('#login');
          if (h.text('#email-error') || h.text('#password-error')) return 'старые сообщения не исчезли';
          return h.$('#email').getAttribute('aria-invalid') === 'false' && h.$('#password').getAttribute('aria-invalid') === 'false' || 'aria-invalid должен стать "false"';
        } },
        { name: '«Заявка отправлена» — только без ошибок', js: true, check: h => {
          h.type('#email', 'anna'); h.submit('#login');
          if (h.text('#result') !== '') return 'при ошибке #result должен быть пустым';
          h.type('#email', 'anna@mail.ru'); h.type('#password', 'parol2024'); h.submit('#login');
          return h.text('#result') === 'Заявка отправлена' || 'при верных данных нет «Заявка отправлена»';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#login'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
