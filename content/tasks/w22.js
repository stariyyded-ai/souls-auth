/* Занятие 22. ПР11. Формы HTML: типы input, label, required, pattern, select, radio */
(() => {
  // Проверяет, пропустит ли браузер значение v в поле sel; значение поля потом возвращается обратно
  const valid = (h, sel, v) => {
    const e = typeof sel === 'string' ? h.$(sel) : sel;
    if (!e) return null;
    const old = e.value; e.value = v;
    const ok = e.checkValidity(); e.value = old;
    return ok;
  };
  const FORM_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a; background: #f8fafc; }
.page { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.btn { min-height: 48px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font: inherit; font-weight: 600; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w2201', lesson: 'm9-pr11', module: 'mdk93', mech: 'build', title: 'Регистрация: правила проверки', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма регистрации «ЧистоДома» свёрстана, но пропускает что угодно: логин «a», ФИО латиницей, телефон без скобок. А ещё ни у одного поля нет name — сервер не получит ни одного значения. Научим форму требованиям ТЗ.',
      goal: 'У каждого поля задайте name, совпадающий с его id (login, password, fio, phone, email), и required. Типы: пароль — password, телефон — tel, email — email. Логин и пароль — не короче 6 символов (minlength). ФИО — только русские буквы, пробелы и дефис, включая Ёё: pattern="[А-Яа-яЁё\\s\\-]+". Телефон — формат +7(XXX)-XXX-XX-XX: pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" и placeholder с примером.',
      hints: [
        'Пример поля: <input type="text" id="login" name="login" required minlength="6" autocomplete="username">',
        'ФИО: <input type="text" id="fio" name="fio" required pattern="[А-Яа-яЁё\\s\\-]+" title="Только русские буквы, пробелы и дефис">. Без Ёё «Артём» не пройдёт.',
        'Телефон: <input type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">. Плюс и скобки в шаблоне экранируются обратным слешем.',
        'Email: <input type="email" id="email" name="email" required> — формат браузер проверит сам.'
      ],
      html: `<main class="page">
  <h1>Регистрация</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label for="login">Логин</label>
      <input type="text" id="login">
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input type="text" id="password">
    </div>
    <div class="field">
      <label for="fio">ФИО</label>
      <input type="text" id="fio">
    </div>
    <div class="field">
      <label for="phone">Телефон</label>
      <input type="text" id="phone">
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input type="text" id="email">
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${FORM_CSS}
input { font: inherit; }`,
      tests: [
        { name: 'У каждого поля есть name, такой же, как id', check: h => {
          const bad = ['login', 'password', 'fio', 'phone', 'email'].filter(id => h.$('#' + id)?.getAttribute('name') !== id);
          return !bad.length || `нет name у: ${bad.join(', ')}`;
        } },
        { name: 'Все пять полей обязательные (required)', check: h => {
          const bad = ['login', 'password', 'fio', 'phone', 'email'].filter(id => !h.$('#' + id)?.required);
          return !bad.length || `нет required у: ${bad.join(', ')}`;
        } },
        { name: 'Типы: пароль — password, телефон — tel, email — email', check: h => {
          if (h.$('#password').type !== 'password') return 'пароль должен быть скрыт: type="password"';
          if (h.$('#phone').type !== 'tel') return 'телефон: type="tel"';
          return h.$('#email').type === 'email' || 'email: type="email"';
        } },
        { name: 'Логин и пароль — не короче 6 символов (minlength="6")', check: h => {
          const bad = ['login', 'password'].filter(id => h.$('#' + id)?.minLength !== 6);
          return !bad.length || `нет minlength="6" у: ${bad.join(', ')}`;
        } },
        { name: 'ФИО — кириллица, пробелы и дефис, буква Ё тоже', check: h => {
          if (valid(h, '#fio', 'Ivanov Petr') !== false) return '«Ivanov Petr» проходит, а не должен';
          if (valid(h, '#fio', 'Анна1') !== false) return '«Анна1» с цифрой проходит, а не должен';
          return valid(h, '#fio', 'Артём Семёнов-Ёлкин') === true || '«Артём Семёнов-Ёлкин» не проходит: проверьте Ёё и экранирование дефиса';
        } },
        { name: 'Телефон — строго +7(XXX)-XXX-XX-XX, есть placeholder', check: h => {
          if (valid(h, '#phone', '89001234567') !== false) return '«89001234567» проходит, а не должен';
          if (valid(h, '#phone', '+7(900)-123-45-6') !== false) return '«+7(900)-123-45-6» (не хватает цифры) проходит';
          if (valid(h, '#phone', '+7(900)-123-45-67') !== true) return '«+7(900)-123-45-67» не проходит';
          return !!h.$('#phone').placeholder || 'добавьте placeholder с примером формата';
        } },
        { name: 'Email проверяется браузером', check: h => valid(h, '#email', 'ivanov') === false && valid(h, '#email', 'ivanov@mail.ru') === true || '«ivanov» должен не проходить, «ivanov@mail.ru» — проходить' }
      ]
    },
    {
      id: 'w2202', lesson: 'm9-pr11', module: 'mdk93', mech: 'build', title: 'Новая заявка: список, переключатели, дата', level: 'Сложное', minutes: 30, points: 200,
      story: 'В форме новой заявки «ЧистоДома» готовы адрес и телефон. Осталось самое интересное: выбор услуги, дата и время уборки, тип оплаты, комментарий и согласие на обработку данных.',
      goal: 'Допишите в форму поля, у каждого — подпись label. Вид услуги: <select id="service" name="service_id" required>, первый пункт «— Выберите услугу —» с value="", затем 4 услуги со значениями 1–4: Общий клининг, Генеральная уборка, Послестроительная уборка, Химчистка ковров и мебели. Дата: type="date", id и name date, required, не раньше 01.12.2026 (min="2026-12-01"). Время: type="time", id и name time, required. Тип оплаты: <fieldset> с <legend>Тип оплаты</legend> и двумя radio с name="payment" и value cash/card («Наличными», «Банковской картой»), required. Комментарий: <textarea id="comment" name="comment">, необязательный, maxlength="300". Согласие: checkbox name="agree", required.',
      hints: [
        '<label for="service">Вид услуги</label> <select id="service" name="service_id" required> <option value="">— Выберите услугу —</option> <option value="1">Общий клининг</option> … </select>',
        '<input type="date" id="date" name="date" required min="2026-12-01"> — дату в min пишут в формате ГГГГ-ММ-ДД.',
        'Радиокнопки одной группы — один name: <fieldset> <legend>Тип оплаты</legend> <label><input type="radio" name="payment" value="cash" required> Наличными</label> <label><input type="radio" name="payment" value="card"> Банковской картой</label> </fieldset>',
        '<textarea id="comment" name="comment" rows="3" maxlength="300"></textarea> и <label><input type="checkbox" name="agree" required> Согласен на обработку персональных данных</label>'
      ],
      html: `<main class="page">
  <h1>Новая заявка</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label for="address">Адрес</label>
      <input type="text" id="address" name="address" required autocomplete="street-address">
    </div>
    <div class="field">
      <label for="phone">Контактный телефон</label>
      <input type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">
    </div>
    <!-- Допишите: вид услуги, дата, время, тип оплаты, комментарий, согласие -->

    <button class="btn" type="submit">Отправить заявку</button>
  </form>
</main>`,
      css: `${FORM_CSS}
input, select, textarea { font: inherit; }
fieldset { margin: 0; padding: 0; border: 0; }`,
      tests: [
        { name: 'Вид услуги: select#service с name="service_id", required и пустым первым пунктом', check: h => {
          const s = h.$('select#service');
          if (!s) return 'нет <select id="service">';
          if (s.name !== 'service_id') return 'name="service_id"';
          if (!s.required) return 'нет required';
          return s.options[0]?.value === '' && !s.checkValidity() || 'первый пункт должен быть с value="" — тогда выбор обязателен';
        } },
        { name: 'В списке 4 услуги со значениями-номерами', check: h => {
          const o = h.$$('#service option').filter(x => x.value !== '');
          if (o.length !== 4) return `услуг: ${o.length}, нужно 4`;
          return o.every(x => /^\d+$/.test(x.value)) && valid(h, '#service', '2') === true || 'value услуг — номера 1–4';
        } },
        { name: 'Дата: type="date", name="date", обязательна, не раньше 01.12.2026', check: h => {
          const d = h.$('#date');
          if (!d || d.type !== 'date' || d.name !== 'date') return 'нужно <input type="date" id="date" name="date">';
          if (valid(h, d, '') !== false) return 'пустая дата проходит: добавьте required';
          if (valid(h, d, '2026-11-15') !== false) return '15.11.2026 проходит: добавьте min="2026-12-01"';
          return valid(h, d, '2026-12-05') === true || '05.12.2026 не проходит';
        } },
        { name: 'Время: type="time", name="time", обязательно', check: h => {
          const t = h.$('#time');
          return t && t.type === 'time' && t.name === 'time' && t.required || 'нужно <input type="time" id="time" name="time" required>';
        } },
        { name: 'Оплата: 2 radio с name="payment" в fieldset с legend', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (r.length !== 2) return `radio с name="payment": ${r.length}, нужно 2`;
          if (!r.every(x => x.closest('fieldset')?.querySelector('legend'))) return 'оберните кнопки в <fieldset> с <legend>';
          return r[0].value !== r[1].value && r.every(x => x.value) || 'у кнопок разные value: cash и card';
        } },
        { name: 'Тип оплаты нельзя не выбрать (required)', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (!r.length) return 'нет кнопок оплаты';
          if (r[0].checkValidity()) return 'без выбора оплаты форма проходит: добавьте required';
          r[1].checked = true; const ok = r[0].checkValidity(); r[1].checked = false;
          return ok || 'после выбора оплаты проверка всё ещё не проходит';
        } },
        { name: 'Комментарий: textarea name="comment", необязательный, до 300 символов', check: h => {
          const t = h.$('textarea#comment');
          return t && t.name === 'comment' && t.maxLength === 300 && !t.required || 'нужно <textarea id="comment" name="comment" maxlength="300"> без required';
        } },
        { name: 'Согласие: checkbox name="agree", обязательный', check: h => {
          const c = h.$('input[type="checkbox"][name="agree"]');
          return c && c.required && !c.checkValidity() || 'нужен <input type="checkbox" name="agree" required>';
        } }
      ]
    }
  );
})();
