/* Занятие 50: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5001: t => ({
      html: `<section class="card">
  <h2>Бронирование книги</h2>
  <label for="reader">Номер читательского билета</label>
  <input id="reader" class="field" type="text">
  <div class="actions">
    <button class="btn" type="button">Забронировать</button>
    <button class="btn" type="button" disabled>Недоступно</button>
  </div>
</section>`,
      css: t.css.replace(`.btn { padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; }
.btn:focus { outline: none; }`, `.field:focus-visible { outline: 3px solid #f2a900; border-color: #1f5f8b; }
.btn { min-height: 44px; padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }
.btn:hover { background-color: #174a6c; }
.btn:active { background-color: #10354e; transform: translateY(1px); }
.btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }
.btn:disabled { background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; transform: none; }`)
    }),
    k5002: t => ({
      html: t.html.replace('id="screen-book"', 'id="screen-book" hidden').replace('id="screen-done"', 'id="screen-done" hidden'),
      css: t.css.replace('.books {', '.screen[hidden] { display: none; }\n.books {'),
      js: `const screens = document.querySelectorAll('.screen');

function showScreen(id) {
  for (const screen of screens) {
    screen.hidden = screen.id !== id;
  }
}

const links = document.querySelectorAll('[data-go]');
for (const button of links) {
  button.addEventListener('click', () => {
    showScreen(button.dataset.go);
  });
}
`
    }),
    k5003: t => ({
      html: t.html.replace('id="send">', 'id="send" disabled>'),
      css: t.css.replace('.status {', '.btn:disabled { background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }\n.status {'),
      js: `const agree = document.querySelector('#agree');
const send = document.querySelector('#send');
const form = document.querySelector('#booking');
const statusText = document.querySelector('#status');

agree.addEventListener('change', () => {
  send.disabled = !agree.checked;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!agree.checked) return;
  send.disabled = true;
  send.textContent = 'Готово';
  agree.disabled = true;
  statusText.textContent = 'Бронь подтверждена. Номер брони: 1024.';
});
`
    })
  });
})();
