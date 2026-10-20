/* Занятие 58: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5801: t => ({
      html: t.html
        .replace(' width="40" height="40" loading="lazy">', ' width="40" height="40">')
        .replace('<button class="icon-btn" type="button">', '<button class="icon-btn" type="button" aria-label="Закрыть">')
        .replace('alt="Уборка квартиры после ремонта">', 'alt="Уборка квартиры после ремонта" width="300" height="150" loading="lazy">')
        .replace('<input id="fio" name="fio" placeholder="ФИО">', '<label for="fio">ФИО</label>\n    <input id="fio" name="fio" placeholder="Иванов Иван" autocomplete="name">')
        .replace('<input id="phone" name="phone" type="tel" placeholder="Телефон">', '<label for="phone">Телефон</label>\n    <input id="phone" name="phone" type="tel" placeholder="+7(XXX)-XXX-XX-XX" autocomplete="tel" aria-describedby="phone-error">')
        .replace('<input id="email" name="email" type="email" placeholder="Email">', '<label for="email">Email</label>\n    <input id="email" name="email" type="email" placeholder="user@mail.ru" autocomplete="email">'),
      css: t.css
        .replace('.note { color: #aaaaaa; }', '.note { color: #555555; }')
        .replace('* { outline: none; }', `img { max-width: 100%; height: auto; }
:focus-visible { outline: 3px solid #1f4fb8; outline-offset: 2px; }`)
    })
  });
})();
