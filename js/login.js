/* Страница входа: проверка полей, «ВЫ ПОГИБЛИ» при коротком пароле, разрушение окна при успехе. */
(() => {
  const { reduce, wait, banner, store, sfx } = window.Ash;
  const panel = document.getElementById('panel');
  const form = document.getElementById('f-login');
  const nameInput = document.getElementById('l-name');
  const passInput = document.getElementById('l-pass');
  const note = document.getElementById('n-login');

  // Пришли со страницы регистрации: подставляем имя и показываем подсказку
  const justRegistered = store.get('registered');
  if (justRegistered) {
    nameInput.value = justRegistered;
    note.textContent = 'Персонаж создан. Теперь войди.';
    store.set('registered', '');
    passInput.focus();
  }

  document.getElementById('forgot').addEventListener('click', () => {
    note.textContent = 'Пароль не вернуть. Но можно попросить новый на почту.';
  });

  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;
    const name = nameInput.value.trim();
    const pass = passInput.value;
    note.textContent = '';
    sfx.click();

    if (!name) { sfx.error(); note.textContent = 'Введи имя персонажа или e-mail.'; nameInput.focus(); return; }
    busy = true;
    if (pass.length < 4) {
      sfx.death();
      await banner('bn-dead');
      note.textContent = 'Пароль слишком короткий. Нужно хотя бы 4 символа.';
      passInput.focus();
      busy = false;
      return;
    }

    // Здесь будет настоящий запрос на сервер. Пока считаем вход успешным.
    store.set('name', name);
    const b = document.getElementById('b-login').getBoundingClientRect();
    sfx.shatter();
    await window.Ash.shatter(panel, { x: b.left + b.width / 2, y: b.top + b.height / 2 });
    sfx.lit();
    banner('bn-lit');
    await wait(reduce ? 300 : 1400);
    location.href = 'cabinet.html';
  });
})();
