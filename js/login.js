/* Страница входа: проверка полей, «ВЫ ПОГИБЛИ» при коротком пароле, разрушение окна при успехе. */
(() => {
  const { reduce, wait, banner, store, sfx, api } = window.Ash;
  const panel = document.getElementById('panel');
  const form = document.getElementById('f-login');
  const nameInput = document.getElementById('l-name');
  const passInput = document.getElementById('l-pass');
  const note = document.getElementById('n-login');
  // Попытка открыть админку без входа
  if (location.hash === '#admin') note.textContent = 'Админ-панель доступна только администратору. Войдите под его логином.';

  // Пришли со страницы регистрации: подставляем имя и показываем подсказку
  const justRegistered = store.get('registered');
  if (justRegistered) {
    nameInput.value = justRegistered;
    note.textContent = 'Персонаж создан. Теперь войди.';
    store.set('registered', '');
    passInput.focus();
  }

  document.getElementById('forgot').addEventListener('click', () => {
    note.textContent = 'Пароль не вернуть, но преподаватель выдаст новый. Напишите ему.';
  });

  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;
    const name = nameInput.value.trim();
    const pass = passInput.value;
    note.textContent = '';
    sfx.click();

    if (!name) { sfx.error(); note.textContent = 'Введи имя персонажа.'; nameInput.focus(); return; }
    busy = true;
    if (pass.length < 4) {
      sfx.death();
      await banner('bn-dead');
      note.textContent = 'Пароль слишком короткий. Нужно хотя бы 4 символа.';
      passInput.focus();
      busy = false;
      return;
    }

    // Имя, e-mail или логин и пароль проверяет сервер; роль тоже приходит от него
    let user;
    try { user = await api('POST', 'api/login', { login: name, password: pass, remember: document.getElementById('l-remember').checked }); }
    catch (err) {
      if (err.status === 401) { sfx.death(); await banner('bn-dead'); } else sfx.error();
      note.textContent = err.message;
      passInput.focus();
      busy = false;
      return;
    }
    const admin = user.role === 'admin';
    store.set('role', user.role);
    store.set('name', user.name);
    const b = document.getElementById('b-login').getBoundingClientRect();
    sfx.shatter();
    await window.Ash.shatter(panel, { x: b.left + b.width / 2, y: b.top + b.height / 2 });
    sfx.lit();
    banner('bn-lit');
    await wait(reduce ? 300 : 1400);
    location.href = admin ? 'admin.html' : 'cabinet.html';
  });
})();
