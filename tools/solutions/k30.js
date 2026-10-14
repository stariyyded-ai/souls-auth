/* Занятие 30: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3001: t => ({
      html: t.html, css: t.css,
      js: `// Проверка имени и почты
const form = document.querySelector('#signup');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Введите имя';
    nameInput.setAttribute('aria-invalid', 'true');
  } else {
    nameError.textContent = '';
    nameInput.setAttribute('aria-invalid', 'false');
  }

  const email = emailInput.value.trim();
  if (email === '') {
    emailError.textContent = 'Введите почту';
    emailInput.setAttribute('aria-invalid', 'true');
  } else if (!email.includes('@') || !email.includes('.')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    emailError.textContent = '';
    emailInput.setAttribute('aria-invalid', 'false');
  }
});
`
    }),
    k3002: t => ({
      html: t.html, css: t.css,
      js: `// Регистрация: проверка трёх полей
function setError(input, errorEl, message) {
  errorEl.textContent = message;
  if (message === '') {
    input.setAttribute('aria-invalid', 'false');
  } else {
    input.setAttribute('aria-invalid', 'true');
  }
}

const form = document.querySelector('#register');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let valid = true;

  if (nameInput.value.trim() === '') {
    setError(nameInput, nameError, 'Введите имя');
    valid = false;
  } else {
    setError(nameInput, nameError, '');
  }

  const email = emailInput.value.trim();
  if (email === '') {
    setError(emailInput, emailError, 'Введите почту');
    valid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    setError(emailInput, emailError, 'Почта должна быть в формате name@mail.ru');
    valid = false;
  } else {
    setError(emailInput, emailError, '');
  }

  if (passwordInput.value.length < 8) {
    setError(passwordInput, passwordError, 'Пароль — не меньше 8 символов');
    valid = false;
  } else {
    setError(passwordInput, passwordError, '');
  }

  if (valid) {
    result.textContent = 'Заявка отправлена';
  } else {
    result.textContent = '';
  }
});
`
    }),
    k3003: t => ({
      html: t.html, css: t.css,
      js: `// Проверка формы входа
const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let valid = true;

  if (!email.value.includes('@') || !email.value.includes('.')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    email.setAttribute('aria-invalid', 'true');
    valid = false;
  } else {
    emailError.textContent = '';
    email.setAttribute('aria-invalid', 'false');
  }

  if (password.value.length < 8) {
    passwordError.textContent = 'Пароль — не меньше 8 символов';
    password.setAttribute('aria-invalid', 'true');
    valid = false;
  } else {
    passwordError.textContent = '';
    password.setAttribute('aria-invalid', 'false');
  }

  if (valid) {
    result.textContent = 'Заявка отправлена';
  } else {
    result.textContent = '';
  }
});
`
    })
  });
})();
