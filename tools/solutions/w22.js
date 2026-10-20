/* Занятие 22: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2201: t => ({
      html: `<main class="page">
  <h1>Регистрация</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label for="login">Логин</label>
      <input type="text" id="login" name="login" required minlength="6" autocomplete="username">
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
    </div>
    <div class="field">
      <label for="fio">ФИО</label>
      <input type="text" id="fio" name="fio" required pattern="[А-Яа-яЁё\\s\\-]+" title="Только русские буквы, пробелы и дефис" autocomplete="name">
    </div>
    <div class="field">
      <label for="phone">Телефон</label>
      <input type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67" autocomplete="tel">
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email">
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: t.css
    }),
    w2202: t => ({
      html: t.html.replace('    <!-- Допишите: вид услуги, дата, время, тип оплаты, комментарий, согласие -->\n', `    <div class="field">
      <label for="service">Вид услуги</label>
      <select id="service" name="service_id" required>
        <option value="">— Выберите услугу —</option>
        <option value="1">Общий клининг</option>
        <option value="2">Генеральная уборка</option>
        <option value="3">Послестроительная уборка</option>
        <option value="4">Химчистка ковров и мебели</option>
      </select>
    </div>
    <div class="field">
      <label for="date">Дата</label>
      <input type="date" id="date" name="date" required min="2026-12-01">
    </div>
    <div class="field">
      <label for="time">Время</label>
      <input type="time" id="time" name="time" required>
    </div>
    <fieldset class="field">
      <legend>Тип оплаты</legend>
      <label><input type="radio" name="payment" value="cash" required> Наличными</label>
      <label><input type="radio" name="payment" value="card"> Банковской картой</label>
    </fieldset>
    <div class="field">
      <label for="comment">Комментарий</label>
      <textarea id="comment" name="comment" rows="3" maxlength="300"></textarea>
    </div>
    <label><input type="checkbox" name="agree" required> Согласен на обработку персональных данных</label>
`),
      css: t.css
    })
  });
})();
