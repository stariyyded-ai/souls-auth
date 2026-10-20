/* Занятие 54: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5401: t => ({
      html: t.html, css: t.css,
      js: t.js
        .replace("fio:   { test: (v) => true,", "fio:   { test: (v) => /^[А-ЯЁа-яё]+(?:[ -][А-ЯЁа-яё]+)*$/.test(v),")
        .replace("phone: { test: (v) => true,", "phone: { test: (v) => /^\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$/.test(v),")
        .replace("email: { test: (v) => true,", "email: { test: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v),")
        .replace("login: { test: (v) => true,", "login: { test: (v) => v.length >= 6,")
        .replace('// Ваш код: focusout на форме и submit с проверкой всех полей\n', `// проверяем поле, когда пользователь его покинул
form.addEventListener('focusout', (e) => {
  if (e.target.name) validateField(e.target);
});

// финальная проверка перед отправкой: map — чтобы проверились ВСЕ поля
form.addEventListener('submit', (e) => {
  const fields = [...form.querySelectorAll('input[name]')];
  const results = fields.map(validateField);
  if (results.includes(false)) {
    e.preventDefault();
    form.querySelector('.is-invalid')?.focus();
  }
});
`)
    }),
    w5402: t => ({
      html: t.html.replace('inputmode="tel"', 'inputmode="tel" maxlength="17" placeholder="+7(XXX)-XXX-XX-XX"'),
      css: t.css,
      js: `// js/phone-mask.js
function formatPhone(value) {
  let digits = value.replace(/\\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return '';
  let result = '+7(' + digits.slice(0, 3);
  if (digits.length > 3) result += ')-' + digits.slice(3, 6);
  if (digits.length > 6) result += '-' + digits.slice(6, 8);
  if (digits.length > 8) result += '-' + digits.slice(8, 10);
  return result;
}

document.querySelectorAll('input[name="phone"]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = formatPhone(input.value);
  });
});
`
    })
  });
})();
