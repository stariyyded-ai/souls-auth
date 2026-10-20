/* Занятие 55: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5501: t => ({
      html: t.html, css: t.css,
      js: t.js.replace('// Ваш код: async function checkLogin() и обработчик blur\n', `async function checkLogin() {
  const login = loginInput.value.trim();
  if (login.length < 6) return; // короткий — пусть ругается валидация из ЛР33

  try {
    const url = 'check_login.php?login=' + encodeURIComponent(login);
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();

    loginInput.classList.toggle('is-invalid', !data.free);
    loginInput.classList.toggle('is-valid', data.free);
    loginBox.textContent = data.free ? '' : data.message;
  } catch (err) {
    console.error(err);
    loginBox.textContent = 'Не удалось проверить логин';
  }
}

loginInput.addEventListener('blur', checkLogin);
`)
    }),
    w5502: t => ({
      html: t.html, css: t.css,
      js: t.js.replace(`// 1. JSON туда и обратно: переменные note и parsed

// 2. Кнопка «Который час?»
`, `// JSON туда и обратно
const note = JSON.stringify({ a: 1, b: 'текст' });
const parsed = JSON.parse('{"x": [1, 2, 3]}');
console.log(note, parsed.x);

// Кнопка «Который час?»
ask.addEventListener('click', async () => {
  try {
    const response = await fetch('hello.php');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    answer.textContent = \`\${data.name}: сейчас \${data.time}\`;
  } catch (err) {
    answer.textContent = 'Сервер не отвечает';
  }
});
`)
    })
  });
})();
