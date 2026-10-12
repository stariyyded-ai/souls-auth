/* Страница регистрации: проверка полей и анимация слизняка, который уходит в дверь внутри кнопки. */
(() => {
  const { reduce, wait, go, store, sfx, api } = window.Ash;
  const form = document.getElementById('f-reg');
  const note = document.getElementById('n-reg');
  const val = id => document.getElementById(id).value;

  function check() {
    if (!val('r-name').trim()) return ['r-name', 'Дай персонажу имя.'];
    if (!/^\S+@\S+\.\S+$/.test(val('r-mail').trim())) return ['r-mail', 'Проверь e-mail: в нём не хватает @ или домена.'];
    if (val('r-pass').length < 4) return ['r-pass', 'Пароль должен быть не короче 4 символов.'];
    if (val('r-pass') !== val('r-pass2')) return ['r-pass2', 'Пароли не совпадают.'];
    if (!document.getElementById('r-oath').checked) return ['r-oath', 'Без клятвы ковенант не примет.'];
    return null;
  }

  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;
    note.textContent = '';
    const err = check();
    sfx.click();
    if (err) { sfx.error(); note.textContent = err[1]; document.getElementById(err[0]).focus(); return; }
    busy = true;

    // Сначала сервер: имя или e-mail могут быть заняты
    try { await api('POST', 'api/register', { name: val('r-name').trim(), email: val('r-mail').trim(), password: val('r-pass') }); }
    catch (err) { sfx.error(); note.textContent = err.message; busy = false; return; }

    const btn = document.getElementById('b-reg');
    const slug = btn.querySelector('.slug');
    const door = btn.querySelector('.door');

    // 1. Надпись гаснет, слизняк начинает сжиматься и разжиматься
    btn.classList.add('go');
    await wait(220);
    // 2. Дверь открывается
    btn.classList.add('door-open');
    sfx.door(true);
    // 3. Слизняк ползёт к двери пиксельными шагами и скрывается за ней
    const dist = door.offsetLeft + 4 - slug.offsetLeft;
    const crawl = reduce ? 300 : 1500;
    slug.style.transition = `transform ${crawl}ms steps(${reduce ? 1 : 30})`;
    slug.style.transform = `translateX(${dist}px)`;
    const steps = reduce ? 0 : Math.floor(crawl / 110);
    for (let i = 0; i < steps; i++) setTimeout(sfx.squish, 60 + i * 110);
    await wait(crawl + 120);
    // 4. Дверь закрывается, переходим на вход
    btn.classList.remove('door-open');
    sfx.door(false);
    await wait(380);

    store.set('registered', val('r-name').trim());
    go('index.html');
  });
})();
