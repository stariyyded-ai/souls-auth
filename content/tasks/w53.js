/* Занятие 53. ПР21. JS для форм: DOM, события, условия */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.error { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.hint { margin-top: 4px; color: #555555; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn:disabled { background: #6b7280; cursor: not-allowed; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w5301', lesson: 'm9-pr21', module: 'mdk96', mech: 'build', title: 'Ошибки под полями', level: 'Среднее', minutes: 30, points: 150,
      story: 'Форма регистрации портала заявок уходит на сервер с любыми данными, а пользователь узнаёт об ошибке только после перезагрузки. Сделаем проверку в браузере: ошибка появляется прямо под нужным полем, и форма не отправляется.',
      goal: 'Напишите функции showError(name, message) и clearError(name): первая находит поле [name="…"] и блок #ИМЯ-error, добавляет полю класс is-invalid и aria-invalid="true", пишет текст через textContent; вторая всё это убирает. Обработчик submit формы #register-form: логин (после trim) короче 6 символов — ошибка под логином «Логин — не менее 6 символов»; пароль пустой — «Введите пароль»; password2 не совпадает с password — «Пароли не совпадают» под password2. Верное поле очищается через clearError. Проверяются все три поля сразу, и при любой ошибке вызывается event.preventDefault().',
      hints: [
        'showError: const input = document.querySelector(`[name="${name}"]`); const box = document.getElementById(`${name}-error`); input.classList.add(\'is-invalid\'); input.setAttribute(\'aria-invalid\', \'true\'); box.textContent = message;',
        'clearError делает обратное: classList.remove, removeAttribute(\'aria-invalid\'), box.textContent = \'\'.',
        'В обработчике заведите let ok = true; и три отдельных if/else: if (login.length < 6) { showError(\'login\', \'…\'); ok = false; } else { clearError(\'login\'); }',
        'В конце: if (!ok) event.preventDefault(); Поля удобно читать как form.login.value.trim(), form.password.value, form.password2.value.'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username">
      <div class="error" id="login-error"></div>
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input id="password" name="password" type="password" autocomplete="new-password">
      <div class="error" id="password-error"></div>
    </div>
    <div class="field">
      <label for="password2">Повторите пароль</label>
      <input id="password2" name="password2" type="password" autocomplete="new-password">
      <div class="error" id="password2-error"></div>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// Проверка формы регистрации
const form = document.getElementById('register-form');

// 1. showError(name, message) и clearError(name)

// 2. Обработчик submit: логин, пароль, совпадение паролей
`,
      tests: [
        { name: 'Короткий логин: ошибка под логином, класс is-invalid, aria-invalid, форма не отправлена', js: true, check: h => {
          h.type('#login', 'ivan'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (h.submit('#register-form')) return 'форма отправилась: нужен event.preventDefault()';
          if (h.text('#login-error') !== 'Логин — не менее 6 символов') return `текст под логином: «${h.text('#login-error')}»`;
          const i = h.$('#login');
          return i.classList.contains('is-invalid') && i.getAttribute('aria-invalid') === 'true' || 'у поля логина нет класса is-invalid или aria-invalid="true"';
        } },
        { name: 'Пробелы по краям логина не считаются', js: true, check: h => {
          h.type('#login', '  abc  '); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          return h.submit('#register-form') === false && h.text('#login-error') !== '' || 'логин «  abc  » должен считаться коротким: используйте trim()';
        } },
        { name: 'Пустой пароль и разные пароли — ошибки под своими полями', js: true, check: h => {
          h.type('#login', 'ivanov'); h.type('#password', ''); h.type('#password2', 'qwerty');
          if (h.submit('#register-form')) return 'форма отправилась';
          if (h.text('#password-error') !== 'Введите пароль') return `под паролем: «${h.text('#password-error')}»`;
          if (h.text('#password2-error') !== 'Пароли не совпадают') return `под повтором: «${h.text('#password2-error')}»`;
          return h.text('#login-error') === '' || 'у верного логина не должно быть ошибки';
        } },
        { name: 'Все ошибки видны сразу, а не по одной', js: true, check: h => {
          h.type('#login', 'iv'); h.type('#password', ''); h.type('#password2', 'x');
          h.submit('#register-form');
          return h.$$('.is-invalid').length === 3 || `подсвечено полей: ${h.$$('.is-invalid').length}, нужно 3`;
        } },
        { name: 'Исправили — ошибки исчезли, форма уходит', js: true, check: h => {
          h.type('#login', 'iv'); h.type('#password', ''); h.type('#password2', 'x');
          h.submit('#register-form');
          h.type('#login', 'ivanov'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (!h.submit('#register-form')) return 'верная форма не отправляется';
          if (h.$$('.is-invalid').length) return 'класс is-invalid остался';
          if (h.$$('[aria-invalid]').length) return 'aria-invalid остался: нужен removeAttribute';
          return h.$$('.error').every(e => e.textContent === '') || 'текст ошибки остался';
        } },
        { name: 'Текст ошибки — через textContent, а не innerHTML', check: h => !/innerHTML/.test(h.js) || 'для текста ошибок используйте textContent' }
      ]
    },
    {
      id: 'w5302', lesson: 'm9-pr21', module: 'mdk96', mech: 'build', title: 'Живая форма: счётчик и кнопка', level: 'Среднее', minutes: 25, points: 150,
      story: 'Проверка при отправке уже есть. Теперь форма должна реагировать, пока человек печатает: ошибка исчезает, как только поле начали исправлять, под ФИО растёт счётчик символов, а кнопка «Отправить» неактивна, пока не заполнено всё.',
      goal: 'Повесьте на форму #register-form один обработчик input (делегирование). В нём: стереть ошибку того поля, в которое печатают (event.target.name и готовая clearError); обновить счётчик #fio-counter текстом «Символов: N», где N — длина ФИО после trim; кнопке #send ставить disabled = true, пока хотя бы одно из четырёх полей пустое (после trim). Готовую проверку при отправке не трогайте.',
      hints: [
        'Каркас: form.addEventListener(\'input\', (event) => { … }); — событие всплывает от любого поля до формы.',
        'Ошибка: if (event.target.name) clearError(event.target.name);',
        'Счётчик: counter.textContent = `Символов: ${form.fio.value.trim().length}`;',
        'Кнопка: const names = [\'login\', \'password\', \'password2\', \'fio\']; send.disabled = names.some((n) => form[n].value.trim() === \'\');'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username">
      <div class="error" id="login-error"></div>
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input id="password" name="password" type="password" autocomplete="new-password">
      <div class="error" id="password-error"></div>
    </div>
    <div class="field">
      <label for="password2">Повторите пароль</label>
      <input id="password2" name="password2" type="password" autocomplete="new-password">
      <div class="error" id="password2-error"></div>
    </div>
    <div class="field">
      <label for="fio">ФИО</label>
      <input id="fio" name="fio" autocomplete="name">
      <div class="hint" id="fio-counter">Символов: 0</div>
      <div class="error" id="fio-error"></div>
    </div>
    <button class="btn" id="send" type="submit" disabled>Отправить</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// Живая форма
const form = document.getElementById('register-form');
const send = document.getElementById('send');
const counter = document.getElementById('fio-counter');

function showError(name, message) {
  const input = form[name];
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  document.getElementById(name + '-error').textContent = message;
}

function clearError(name) {
  const input = form[name];
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  document.getElementById(name + '-error').textContent = '';
}

// Готовая проверка при отправке — не меняйте
form.addEventListener('submit', (event) => {
  let ok = true;
  if (form.login.value.trim().length < 6) { showError('login', 'Логин — не менее 6 символов'); ok = false; }
  if (form.password.value === '') { showError('password', 'Введите пароль'); ok = false; }
  if (form.password2.value !== form.password.value) { showError('password2', 'Пароли не совпадают'); ok = false; }
  if (form.fio.value.trim() === '') { showError('fio', 'Введите ФИО'); ok = false; }
  if (!ok) event.preventDefault();
});

// Ваш код: один обработчик input на всю форму
`,
      tests: [
        { name: 'Ввод в поле с ошибкой стирает ошибку только этого поля', js: true, check: h => {
          h.$('#login').value = 'iv'; h.$('#password2').value = 'x';
          h.submit('#register-form');
          if (!h.$('#login').classList.contains('is-invalid')) return 'готовая проверка не сработала — не меняли ли вы её?';
          h.type('#login', 'iva');
          if (h.$('#login').classList.contains('is-invalid') || h.text('#login-error')) return 'ошибка логина не стёрлась при вводе';
          return h.$('#password').classList.contains('is-invalid') && h.text('#password-error') !== '' || 'ошибка пароля тоже стёрлась, а в него не печатали';
        } },
        { name: 'Счётчик под ФИО: «Символов: N» без пробелов по краям', js: true, check: h => {
          h.type('#fio', ' Иванов Иван ');
          return h.text('#fio-counter') === 'Символов: 11' || `сейчас: «${h.text('#fio-counter')}», нужно «Символов: 11»`;
        } },
        { name: 'Кнопка активна только когда заполнены все четыре поля', js: true, check: h => {
          const b = h.$('#send');
          h.type('#login', 'ivanov'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (!b.disabled) return 'кнопка активна, а ФИО пустое';
          h.type('#fio', 'Иванов Иван');
          if (b.disabled) return 'все поля заполнены, а кнопка неактивна';
          h.type('#password', '   ');
          return b.disabled || 'пароль из пробелов считается пустым: кнопка должна стать неактивной';
        } },
        { name: 'Один обработчик input на форме (делегирование)', check: h => /form\.addEventListener\(\s*['"]input['"]/.test(h.js) || 'повесьте form.addEventListener(\'input\', …)' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.type('#fio', 'Пётр'); h.submit('#register-form'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
