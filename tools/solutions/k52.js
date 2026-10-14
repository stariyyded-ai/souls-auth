/* Занятие 52: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5201: t => ({
      html: `<h1>Отчёт об аудите: форма записи в спортзал</h1>
<table>
  <caption>Проблемы формы записи, найденные на тесте с пятью участниками</caption>
  <thead>
    <tr>
      <th scope="col">№</th>
      <th scope="col">Проблема</th>
      <th scope="col">Где</th>
      <th scope="col">Эвристика</th>
      <th scope="col">Как исправить</th>
      <th scope="col">Приоритет</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Нет подписи, только серый текст внутри поля</td><td>Поле телефона</td><td>Узнавание вместо вспоминания</td><td>Постоянная подпись label над полем</td><td class="prio-high">Высокий</td></tr>
    <tr><td>2</td><td>Три секунды ничего не происходит, люди записываются дважды</td><td>После нажатия кнопки</td><td>Видимость состояния системы</td><td>Состояние загрузки и сообщение об успехе</td><td class="prio-high">Высокий</td></tr>
    <tr><td>3</td><td>Кнопка подписана «Ок»</td><td>Кнопка отправки</td><td>Соответствие реальному миру</td><td>Подпись «Записаться на занятие»</td><td class="prio-medium">Средний</td></tr>
    <tr><td>4</td><td>Сообщение «Error 0x13»</td><td>Поле даты</td><td>Помощь в исправлении ошибок</td><td>«Выберите дату не раньше завтрашнего дня»</td><td class="prio-medium">Средний</td></tr>
    <tr><td>5</td><td>Логотип не ведёт на главную</td><td>Шапка</td><td>Единообразие и стандарты</td><td>Сделать логотип ссылкой на главную</td><td class="prio-low">Низкий</td></tr>
  </tbody>
</table>`,
      css: `${BASE}
h1 { font-size: 26px; }
table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px; border: 1px solid #8c959f; text-align: left; vertical-align: top; }
thead th { background-color: #eaeef2; }
.prio-high { background-color: #fde2e1; color: #8a1c14; font-weight: bold; }
.prio-medium { background-color: #fff3cd; color: #5c4400; }
.prio-low { background-color: #e6f4ea; color: #1e4620; }`
    }),
    k5202: t => ({
      html: `<form class="signup" id="signup">
  <h2>Запись на пробное занятие</h2>
  <label for="phone">Телефон</label>
  <input id="phone" type="tel" placeholder="+7 900 123-45-67">
  <label for="date">Дата занятия</label>
  <input id="date" type="date" aria-describedby="date-error">
  <p class="error" id="date-error">Выберите дату не раньше завтрашнего дня.</p>
  <p class="terms">Нажимая кнопку, вы соглашаетесь с <a href="#rules">правилами клуба</a>.</p>
  <button class="btn" type="submit">Записаться на занятие</button>
</form>`,
      css: t.css.replace('color: #b0b0b0', 'color: #595959')
    }),
    k5203: t => ({
      html: t.html.replace('id="toast">', 'id="toast" hidden>'),
      css: t.css,
      js: `const toast = document.querySelector('#toast');
const undo = document.querySelector('#undo');
let lastItem = null;

const buttons = document.querySelectorAll('.del');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    item.hidden = true;
    lastItem = item;
    toast.hidden = false;
  });
}

undo.addEventListener('click', () => {
  if (lastItem) {
    lastItem.hidden = false;
    lastItem = null;
  }
  toast.hidden = true;
});
`
    })
  });
})();
