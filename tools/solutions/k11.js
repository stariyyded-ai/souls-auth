/* Занятие 11: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1101: t => ({
      html: `<h1>Запись на вечерние курсы</h1>
<p>Поля со звёздочкой * обязательны. Мы пришлём подтверждение на почту.</p>
<form action="/enroll" method="post">
  <fieldset>
    <legend>Контактные данные</legend>
    <p><label for="name">Имя *</label> <input type="text" id="name" name="name" required></p>
    <p><label for="email">Почта *</label> <input type="email" id="email" name="email" required></p>
    <p><label for="phone">Телефон</label> <input type="tel" id="phone" name="phone" pattern="\\+7[0-9]{10}" placeholder="+79001234567"></p>
  </fieldset>
  <fieldset>
    <legend>Курс</legend>
    <p>
      <label for="course">Курс *</label>
      <select id="course" name="course" required>
        <option value="">Выберите курс</option>
        <option value="pc">Компьютерная грамотность</option>
        <option value="web">Основы веб-дизайна</option>
        <option value="photo">Фотография на телефон</option>
      </select>
    </p>
    <fieldset>
      <legend>Формат занятий *</legend>
      <input type="radio" id="offline" name="format" value="offline" required>
      <label for="offline">Очно</label>
      <input type="radio" id="online" name="format" value="online">
      <label for="online">Онлайн</label>
    </fieldset>
    <p><label for="start">Когда удобно начать</label> <input type="date" id="start" name="start" min="2026-09-01"></p>
    <p><label for="comment">Комментарий</label></p>
    <textarea id="comment" name="comment" rows="3" cols="40"></textarea>
  </fieldset>
  <p><input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен на обработку персональных данных *</label></p>
  <p><button type="submit">Записаться на курс</button></p>
</form>
`,
      css: t.css
    }),
    k1102: t => ({
      html: `<h1>Олимпиада по информатике</h1>
<form action="/olymp" method="post">
  <p><label for="name">ФИО *</label> <input type="text" id="name" name="name" placeholder="Иванова Мария Петровна" required></p>
  <p><label for="email">Почта *</label> <input type="email" id="email" name="email" required></p>
  <p><label for="password">Пароль *</label> <input type="password" id="password" name="password" minlength="8" required></p>
  <fieldset>
    <legend>Курс *</legend>
    <input type="radio" id="c1" name="year" value="1" required> <label for="c1">1 курс</label>
    <input type="radio" id="c2" name="year" value="2"> <label for="c2">2 курс</label>
    <input type="radio" id="c3" name="year" value="3"> <label for="c3">3 курс</label>
  </fieldset>
  <p><button type="submit">Зарегистрироваться</button></p>
</form>`,
      css: t.css
    }),
    k1103: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; }

/* Образец: каждая подпись на своей строке, небольшой отступ до поля */
label {
  display: block;
  margin-bottom: 4px;
}

input, select, textarea {
  padding: 8px;
  border: 1px solid #767676;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
}

fieldset {
  border: 1px solid #c4c4c4;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

legend {
  font-weight: bold;
  color: #1f4e79;
}

button {
  background-color: #1f4e79;
  color: #ffffff;
  padding: 12px 24px;
  border: 0;
  border-radius: 4px;
  font-size: 16px;
}
`
    })
  });
})();
