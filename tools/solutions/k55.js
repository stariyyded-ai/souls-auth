/* Занятие 55: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5501: t => ({
      html: t.html,
      css: `:root {
  --color-primary: #2d6a4f;
  --color-primary-dark: #1b4332;
  --color-surface: #f1f7f4;
  --color-accent: #f4a261;
  --color-text: #1f2933;
  --radius: 8px;
}
body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: var(--color-text); background-color: #ffffff; }
.guide { max-width: 640px; }
.palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.swatch { padding: 32px 12px 12px; border-radius: var(--radius); border: 1px solid #d0d7de; }
.swatch-primary { background-color: var(--color-primary); color: #ffffff; }
.swatch-dark { background-color: var(--color-primary-dark); color: #ffffff; }
.swatch-surface { background-color: var(--color-surface); }
.swatch-accent { background-color: var(--color-accent); }
.buttons { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: block; margin-bottom: 4px; font-weight: bold; }
.btn { min-height: 44px; padding: 10px 20px; font-size: 16px; border-radius: var(--radius); cursor: pointer; }
.btn-primary { border: 2px solid var(--color-primary); background-color: var(--color-primary); color: #ffffff; }
.btn-secondary { border: 2px solid var(--color-primary); background-color: #ffffff; color: var(--color-primary); }
.btn-primary:hover { border-color: var(--color-primary-dark); background-color: var(--color-primary-dark); }
.btn-secondary:hover { background-color: var(--color-surface); }
.btn:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }
.btn:disabled { border-color: #c9c9c9; background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }
.input { box-sizing: border-box; width: 100%; max-width: 320px; min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #6b7780; border-radius: var(--radius); }
.input:focus-visible { outline: 3px solid var(--color-accent); border-color: var(--color-primary); }`
    }),
    k5502: t => ({
      html: t.html
        .replace('<div class="header">', '<header class="header">')
        .replace('<div class="nav">', '<nav class="nav" aria-label="Главное меню">')
        .replace('</a>\n  </div>\n</div>', '</a>\n  </nav>\n</header>')
        .replace('<div class="main">', '<main class="main">')
        .replace('</section>\n</div>', '</section>\n</main>')
        .replace('<div class="footer" id="contacts">\n  <p>Москва, ул. Садовая, 12. Телефон: +7 495 123-45-67</p>\n</div>',
          '<footer class="footer" id="contacts">\n  <p>Москва, ул. Садовая, 12. Телефон: <a href="tel:+74951234567">+7 495 123-45-67</a></p>\n</footer>'),
      css: t.css.replace(`.nav a { color: var(--color-primary-dark); }
.card { width: 600px; }
.footer { background-color: var(--color-primary-dark); color: #ffffff; }`, `.header { display: flex; flex-direction: column; gap: 8px; padding: var(--space); border-bottom: 1px solid #d0d7de; }
.nav { display: flex; flex-wrap: wrap; gap: 8px; }
.nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: var(--color-primary-dark); }
.main { padding: 0 var(--space); }
.hero { padding: 32px 0; }
.hero h1 { margin-top: 0; font-size: 30px; line-height: 1.2; }
.cards { display: grid; grid-template-columns: 1fr; gap: var(--space); }
.card { padding: var(--space); border-radius: var(--radius); background-color: var(--color-surface); }
.card img { display: block; max-width: 100%; height: auto; border-radius: var(--radius); }
.booking { padding: var(--space) 0; }
.footer { margin-top: 32px; padding: var(--space); background-color: var(--color-primary-dark); color: #ffffff; }
.footer a { color: #ffffff; }
@media (min-width: 768px) {
  .header { flex-direction: row; justify-content: space-between; align-items: center; }
  .cards { grid-template-columns: repeat(3, 1fr); }
  .hero h1 { font-size: 40px; }
}`)
    }),
    k5503: t => ({
      html: t.html
        .replace('autocomplete="name">', 'autocomplete="name" aria-describedby="name-error">')
        .replace('placeholder="+7 900 123-45-67">', 'placeholder="+7 900 123-45-67" aria-describedby="phone-error">')
        .replace('autocomplete="email">', 'autocomplete="email" aria-describedby="email-error">')
        .replace('type="checkbox">', 'type="checkbox" aria-describedby="agree-error">'),
      css: t.css.replace('.error { margin: 0; font-size: 14px; }', '.error { margin: 0; font-size: 14px; color: var(--color-error); }'),
      js: `const form = document.querySelector('#booking-form');
const statusText = document.querySelector('#status');
const name = document.querySelector('#name');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');
const agree = document.querySelector('#agree');

function setError(input, message) {
  const errorEl = document.querySelector('#' + input.id + '-error');
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return message === '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusText.textContent = '';
  let ok = true;

  const nameValue = name.value.trim();
  if (!setError(name, nameValue === '' ? 'Введите имя, чтобы врач знал, как к вам обращаться.' : '')) ok = false;

  const digits = phone.value.replace(/\\D/g, '');
  if (!setError(phone, digits.length < 11 ? 'Телефон — 11 цифр, например +7 900 123-45-67.' : '')) ok = false;

  const mailOk = email.value.includes('@') && email.value.includes('.');
  if (!setError(email, mailOk ? '' : 'Почта должна быть вида name@mail.ru.')) ok = false;

  if (!setError(agree, agree.checked ? '' : 'Без согласия мы не сможем записать вас на приём.')) ok = false;

  if (ok) {
    statusText.textContent = 'Спасибо, ' + nameValue + '! Мы перезвоним в течение часа.';
  }
});
`
    })
  });
})();
