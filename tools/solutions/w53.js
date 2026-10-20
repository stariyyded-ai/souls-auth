/* Занятие 53: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5301: t => ({
      html: t.html, css: t.css,
      js: `// Проверка формы регистрации
const form = document.getElementById('register-form');

function showError(name, message) {
  const input = document.querySelector(\`[name="\${name}"]\`);
  const box = document.getElementById(\`\${name}-error\`);
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  box.textContent = message;
}

function clearError(name) {
  const input = document.querySelector(\`[name="\${name}"]\`);
  const box = document.getElementById(\`\${name}-error\`);
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  box.textContent = '';
}

form.addEventListener('submit', (event) => {
  const login = form.login.value.trim();
  const password = form.password.value;
  const password2 = form.password2.value;
  let ok = true;

  if (login.length < 6) {
    showError('login', 'Логин — не менее 6 символов');
    ok = false;
  } else {
    clearError('login');
  }

  if (password === '') {
    showError('password', 'Введите пароль');
    ok = false;
  } else {
    clearError('password');
  }

  if (password2 !== password) {
    showError('password2', 'Пароли не совпадают');
    ok = false;
  } else {
    clearError('password2');
  }

  if (!ok) event.preventDefault();
});
`
    }),
    w5302: t => ({
      html: t.html, css: t.css,
      js: t.js.replace('// Ваш код: один обработчик input на всю форму\n', `// Живые события: один обработчик на всю форму
form.addEventListener('input', (event) => {
  if (event.target.name) clearError(event.target.name);

  counter.textContent = \`Символов: \${form.fio.value.trim().length}\`;

  const names = ['login', 'password', 'password2', 'fio'];
  send.disabled = names.some((name) => form[name].value.trim() === '');
});
`)
    })
  });
})();
