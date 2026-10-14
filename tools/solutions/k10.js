/* Занятие 10: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1001: t => ({
      html: `<h1>Отзыв о кафе «Пенка»</h1>
<p>Расскажите, что понравилось, а что нет. Мы читаем каждый отзыв.</p>
<form action="/feedback" method="post">
  <label for="name">Имя</label>
  <input type="text" id="name" name="name">
  <label for="email">Почта</label>
  <input type="email" id="email" name="email">
  <label for="message">Отзыв</label>
  <textarea id="message" name="message" rows="4" cols="40"></textarea>
  <p><button type="submit">Отправить</button></p>
</form>
`,
      css: t.css
    }),
    k1002: t => ({
      html: `<h1>Анкета первокурсника</h1>
<form action="/anketa" method="post">
  <p><label for="name">Имя</label> <input type="text" id="name" name="name"></p>
  <p><label for="email">Почта</label> <input type="email" id="email" name="email"></p>
  <p><label for="phone">Телефон</label> <input type="tel" id="phone" name="phone"></p>
  <p><label for="age">Возраст</label> <input type="number" id="age" name="age" min="14" max="99"></p>
  <p>Форма обучения:</p>
  <p>
    <input type="radio" id="day" name="study" value="day"> <label for="day">Очная</label>
    <input type="radio" id="extramural" name="study" value="extramural"> <label for="extramural">Заочная</label>
  </p>
  <p><input type="checkbox" id="news" name="news"> <label for="news">Получать новости</label></p>
  <p><button type="submit">Отправить анкету</button></p>
</form>`,
      css: t.css
    }),
    k1003: t => ({
      html: `<h1>Пробная тренировка</h1>
<p>Первая тренировка бесплатная. Поля со звёздочкой обязательны.</p>
<form action="/gym" method="post">
  <fieldset>
    <legend>Ваши данные</legend>
    <p><label for="name">Имя *</label> <input type="text" id="name" name="name" required></p>
    <p><label for="phone">Телефон *</label> <input type="tel" id="phone" name="phone" required pattern="\\+7[0-9]{10}" placeholder="+79001234567"></p>
  </fieldset>
  <fieldset>
    <legend>Тренировка</legend>
    <p>
      <input type="radio" id="morning" name="time" value="morning"> <label for="morning">Утро</label>
      <input type="radio" id="day" name="time" value="day"> <label for="day">День</label>
      <input type="radio" id="evening" name="time" value="evening"> <label for="evening">Вечер</label>
    </p>
    <p>
      <label for="coach">Тренер</label>
      <select id="coach" name="coach">
        <option value="">Выберите тренера</option>
        <option value="ivanov">Иванов Пётр — тренажёры</option>
        <option value="petrova">Петрова Анна — йога</option>
        <option value="sidorov">Сидоров Илья — бокс</option>
      </select>
    </p>
    <p><label for="date">Дата</label> <input type="date" id="date" name="date" min="2026-09-01"></p>
    <p><label for="people">Сколько человек</label> <input type="number" id="people" name="people" min="1" max="5"></p>
  </fieldset>
  <p><input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен с правилами зала *</label></p>
  <p><button type="submit">Записаться</button></p>
</form>
`,
      css: t.css
    })
  });
})();
