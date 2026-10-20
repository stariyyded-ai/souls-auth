/* Занятие 60: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w6001: t => ({
      html: t.html, css: t.css,
      js: `// js/validation.js — минимальный экзаменационный вариант
const rules = {
  fio:   [/^[А-ЯЁа-яё]+(?:[ -][А-ЯЁа-яё]+)*$/, 'ФИО — только кириллица'],
  phone: [/^\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$/,  'Формат: +7(XXX)-XXX-XX-XX'],
  email: [/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/,     'Некорректный email'],
  login: [/^.{6,}$/,                            'Логин — не менее 6 символов'],
};

function check(input) {
  const rule = rules[input.name];
  if (!rule) return true;
  const ok = rule[0].test(input.value.trim());
  input.classList.toggle('is-invalid', !ok);
  const box = document.getElementById(input.name + '-error');
  if (box) box.textContent = ok ? '' : rule[1];
  return ok;
}

const form = document.querySelector('form');
form.setAttribute('novalidate', '');
form.addEventListener('focusout', (e) => {
  if (e.target.name) check(e.target);
});
form.addEventListener('submit', (e) => {
  const allOk = [...form.elements].map(check).every(Boolean);
  if (!allOk) e.preventDefault();
});

// маска телефона
document.querySelector('[name="phone"]').addEventListener('input', (e) => {
  let d = e.target.value.replace(/\\D/g, '');
  if (/^[78]/.test(d)) d = d.slice(1);
  d = d.slice(0, 10);
  e.target.value = !d ? '' : '+7(' + d.slice(0, 3)
    + (d.length > 3 ? ')-' + d.slice(3, 6) : '')
    + (d.length > 6 ? '-' + d.slice(6, 8) : '')
    + (d.length > 8 ? '-' + d.slice(8, 10) : '');
});
`
    }),
    w6002: t => ({
      html: t.html,
      css: t.css
        .replace('color: #14532d; }', 'color: #14532d; animation: slide-in .3s ease-out; }')
        .replace('border-radius: 12px; background: #ffffff; }', 'border-radius: 12px; background: #ffffff; transition: transform .2s ease-out, box-shadow .2s ease-out; }') + `
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgb(0 0 0 / 0.1); }

@keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } }

@media (prefers-reduced-motion: reduce) {
  .card { transition-duration: 0.01ms; }
  .alert { animation-duration: 0.01ms; }
}`
    })
  });
})();
