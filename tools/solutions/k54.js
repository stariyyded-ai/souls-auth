/* Занятие 54: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5401: t => ({
      html: `<section class="picker">
  <h2>Выберите время приёма</h2>
  <p>Терапевт Иванова А. С., вторник, 14 октября</p>
  <div class="slots">
    <button class="slot" type="button" aria-pressed="true">09:00</button>
    <button class="slot" type="button" aria-pressed="false" disabled>09:30</button>
    <button class="slot" type="button" aria-pressed="false">10:00</button>
    <button class="slot" type="button" aria-pressed="false" disabled>10:30</button>
    <button class="slot" type="button" aria-pressed="false">11:00</button>
    <button class="slot" type="button" aria-pressed="false">11:30</button>
  </div>
  <p class="chosen" id="chosen">Выбрано: 09:00</p>
</section>`,
      css: t.css.replace('.chosen {', `.slot:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }
.slot[aria-pressed="true"] { background-color: #1f5f8b; color: #ffffff; }
.slot:disabled { background-color: #eaeef2; color: #57606a; border-color: #8c959f; text-decoration: line-through; cursor: not-allowed; }
.chosen {`),
      js: `const slots = document.querySelectorAll('.slot');
const chosen = document.querySelector('#chosen');

for (const slot of slots) {
  slot.addEventListener('click', () => {
    for (const other of slots) {
      other.setAttribute('aria-pressed', 'false');
    }
    slot.setAttribute('aria-pressed', 'true');
    chosen.textContent = 'Выбрано: ' + slot.textContent;
  });
}
`
    }),
    k5402: t => ({
      html: `<form class="login" id="login" novalidate>
  <h2>Вход в личный кабинет</h2>
  <label for="policy">Номер полиса</label>
  <input id="policy" type="text" inputmode="numeric" aria-describedby="policy-error">
  <p class="error" id="policy-error"></p>
  <label for="pass">Пароль</label>
  <input id="pass" type="password" aria-describedby="pass-error">
  <p class="error" id="pass-error"></p>
  <button class="btn" type="submit">Войти</button>
  <p class="status" id="status" role="status"></p>
</form>`,
      css: t.css.replace('input:focus { outline: none; }', 'input:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }')
        .replace('.status {', '.btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }\n.status {'),
      js: `const form = document.querySelector('#login');
const policy = document.querySelector('#policy');
const pass = document.querySelector('#pass');
const policyError = document.querySelector('#policy-error');
const passError = document.querySelector('#pass-error');
const statusText = document.querySelector('#status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusText.textContent = '';

  const policyOk = policy.value.trim().length === 16;
  policyError.textContent = policyOk ? '' : 'Номер полиса — 16 цифр. Он напечатан на лицевой стороне полиса.';
  policy.setAttribute('aria-invalid', policyOk ? 'false' : 'true');

  const passOk = pass.value !== '';
  passError.textContent = passOk ? '' : 'Введите пароль.';
  pass.setAttribute('aria-invalid', passOk ? 'false' : 'true');

  if (policyOk && passOk) {
    statusText.textContent = 'Вход выполнен. Открываем личный кабинет…';
  }
});
`
    }),
    k5403: t => ({
      html: t.html.replace('id="empty">', 'id="empty" hidden>'),
      css: t.css.replace('.btn {', '.empty[hidden] { display: none; }\n.btn {'),
      js: `const list = document.querySelector('.list');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');

const buttons = document.querySelectorAll('.cancel');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    item.remove();
    const left = list.querySelectorAll('.item').length;
    count.textContent = left;
    if (left === 0) {
      list.hidden = true;
      empty.hidden = false;
    }
  });
}
`
    })
  });
})();
