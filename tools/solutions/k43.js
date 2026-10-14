/* Занятие 43: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4301: t => ({
      html: t.html,
      css: t.css + `
.btn:hover:not(:disabled) {
  background-color: #174a83;
}
.btn:active:not(:disabled) {
  background-color: #103660;
  transform: translateY(1px);
}
.btn:focus-visible {
  outline: 3px solid #1a1a1a;
  outline-offset: 2px;
}
.btn:disabled {
  background-color: #d6d6d6;
  color: #555555;
  cursor: not-allowed;
}`
    }),
    k4302: t => ({
      html: t.html
        .replace('aria-invalid="true">', 'aria-invalid="true" aria-describedby="email-error">\n    <p class="error-text" id="email-error">В адресе нет знака @. Пример: anna@mail.ru</p>')
        .replace('value="anna_reader">', 'value="anna_reader" aria-describedby="login-ok">\n    <p class="success-text" id="login-ok">Логин свободен</p>'),
      css: t.css + `
input[aria-invalid="true"] {
  border: 2px solid #c62828;
}
.error-text,
.success-text {
  margin: 0;
}
.error-text {
  color: #c62828;
}
.error-text::before {
  content: "✕ ";
}
.is-valid {
  border: 2px solid #2e7d32;
}
.success-text {
  color: #2e7d32;
}`
    }),
    k4303: t => ({
      html: t.html,
      css: t.css,
      js: `const empty = document.querySelector('.empty');
const buttons = document.querySelectorAll('.cancel');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    const title = item.querySelector('.title').textContent;
    if (confirm('Отменить бронь книги ' + title + '?')) {
      item.remove();
      if (document.querySelectorAll('.item').length === 0) {
        empty.hidden = false;
      }
    }
  });
}
`
    })
  });
})();
