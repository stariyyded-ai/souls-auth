/* Занятие 54. ЛР33. Клиентская валидация регулярками и маска телефона +7(XXX)-XXX-XX-XX */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.field input.is-valid { border-color: #146c43; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`;
  const field = (name, label, attrs = '') => `    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}"${attrs}>
      <div class="invalid-feedback" id="${name}-error"></div>
    </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w5401', lesson: 'm9-lr33', module: 'mdk96', mech: 'build', title: 'Регулярки для регистрации', level: 'Сложное', minutes: 30, points: 200,
      story: 'Это прямой кусок задания 3 демоэкзамена: эксперт будет вводить в регистрацию портала заведомо неправильные данные. Форма должна ответить понятным сообщением под каждым полем, а Пётр Алёшин и Анна Петрова-Водкина — спокойно зарегистрироваться.',
      goal: 'Допишите объект rules: для fio — только кириллица (с Ё), слова через один пробел или дефис; для phone — ровно формат +7(XXX)-XXX-XX-XX (с дефисом после скобки); для email — «без пробелов и @, затем @, домен, точка и зона от 2 символов»; для login — не меньше 6 символов. Функция validateField(input) уже готова: пустое поле — «Поле обязательно», не прошло test — rule.msg. Подключите проверку: событие focusout на форме проверяет поле, которое покинули; submit проверяет ВСЕ поля (map, а не every) и при ошибке отменяет отправку. Не забудьте ^ и $.',
      hints: [
        'ФИО: /^[А-ЯЁа-яё]+(?:[ -][А-ЯЁа-яё]+)*$/ — Ё стоит в Unicode отдельно, поэтому её пишут явно.',
        'Телефон: /^\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$/ — плюс и скобки экранируются обратным слешем.',
        'Email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/, логин: (v) => v.length >= 6.',
        'Подключение: form.addEventListener(\'focusout\', (e) => { if (e.target.name) validateField(e.target); }); и в submit: const results = [...form.querySelectorAll(\'input[name]\')].map(validateField); if (results.includes(false)) e.preventDefault();'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
${field('fio', 'ФИО', ' autocomplete="name"')}
${field('phone', 'Телефон', ' type="tel" inputmode="tel" placeholder="+7(XXX)-XXX-XX-XX" autocomplete="tel"')}
${field('email', 'Email', ' type="email" autocomplete="email"')}
${field('login', 'Логин', ' autocomplete="username"')}
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// js/validation.js
const rules = {
  fio:   { test: (v) => true, msg: 'ФИО — только кириллица и пробелы' },
  phone: { test: (v) => true, msg: 'Телефон в формате +7(XXX)-XXX-XX-XX' },
  email: { test: (v) => true, msg: 'Введите корректный email' },
  login: { test: (v) => true, msg: 'Логин — не менее 6 символов' },
};

function validateField(input) {
  const rule = rules[input.name];
  if (!rule) return true;
  const value = input.value.trim();
  const box = document.getElementById(\`\${input.name}-error\`);
  let message = '';
  if (value === '') message = 'Поле обязательно';
  else if (!rule.test(value)) message = rule.msg;

  input.classList.toggle('is-invalid', message !== '');
  input.classList.toggle('is-valid', message === '');
  if (box) box.textContent = message;
  return message === '';
}

const form = document.getElementById('register-form');

// Ваш код: focusout на форме и submit с проверкой всех полей
`,
      tests: [
        { name: 'ФИО: принимает Ё, двойную фамилию; отклоняет латиницу, цифры, два пробела', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.fio) return 'нет rules.fio';
          const good = ['Иванов Иван Иванович', 'Петрова-Водкина Анна', 'Ёлкин Пётр', 'Алёшин'];
          const bad = ['Ivanov Ivan', 'Иванов1', 'Иванов  Иван', 'Иванов Ivan', ' -Иван', 'Иван-'];
          const g = good.find(v => !r.fio.test(v)); if (g) return `не принимает «${g}»`;
          const b = bad.find(v => r.fio.test(v)); return !b || `пропускает «${b}»`;
        } },
        { name: 'Телефон: только +7(XXX)-XXX-XX-XX', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.phone) return 'нет rules.phone';
          if (!r.phone.test('+7(912)-345-67-89')) return 'не принимает +7(912)-345-67-89';
          const bad = ['+7(912)345-67-89', '8(912)-345-67-89', '+7(912)-345-67-8', '+7(912)-345-67-890', 'тел +7(912)-345-67-89', '+7 912-345-67-89'];
          const b = bad.find(v => r.phone.test(v)); return !b || `пропускает «${b}»`;
        } },
        { name: 'Email и логин', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.email || !r.login) return 'нет rules.email или rules.login';
          if (!r.email.test('user@mail.ru') || !r.email.test('a.b@college.edu')) return 'email не принимает user@mail.ru';
          const b = ['user@mail', 'user mail@x.ru', 'usermail.ru', 'user@@mail.ru', 'user@mail.r'].find(v => r.email.test(v));
          if (b) return `email пропускает «${b}»`;
          if (!r.login.test('ivanov')) return 'логин из 6 символов не принят';
          return !r.login.test('ivano') || 'логин из 5 символов принят';
        } },
        { name: 'Уход с поля (focusout) проверяет это поле', js: true, check: h => {
          h.type('#phone', '+7(912)345-67-89');
          h.$('#phone').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
          if (!h.$('#phone').classList.contains('is-invalid')) return 'после ухода с поля телефон не подсвечен';
          if (h.text('#phone-error') !== 'Телефон в формате +7(XXX)-XXX-XX-XX') return `сообщение: «${h.text('#phone-error')}»`;
          return !h.$('#fio').classList.contains('is-invalid') || 'проверилось и ФИО, а с него не уходили';
        } },
        { name: 'Отправка с ошибками: подсвечены ВСЕ неверные поля, форма не ушла', js: true, check: h => {
          h.type('#fio', 'Ivanov'); h.type('#phone', '89123456789'); h.type('#email', 'user@mail'); h.type('#login', 'ivan');
          if (h.submit('#register-form')) return 'форма отправилась';
          const n = h.$$('.is-invalid').length;
          return n === 4 || `подсвечено ${n} из 4: проверяйте все поля через map, а не every`;
        } },
        { name: 'Верные данные: форма отправляется, поля зелёные', js: true, check: h => {
          h.type('#fio', 'Алёшин Пётр'); h.type('#phone', '+7(912)-345-67-89'); h.type('#email', 'petr@mail.ru'); h.type('#login', 'aleshin');
          if (!h.submit('#register-form')) return 'верная форма не отправляется';
          return h.$$('.is-valid').length === 4 || 'не все поля получили is-valid';
        } }
      ]
    },
    {
      id: 'w5402', lesson: 'm9-lr33', module: 'mdk96', mech: 'build', title: 'Маска телефона', level: 'Среднее', minutes: 25, points: 150,
      story: 'Требовать от человека руками набрать +7(912)-345-67-89 со всеми скобками жестоко. Пусть он вводит только цифры, а скобки и дефисы появляются сами — и Backspace при этом не застревает.',
      goal: 'Напишите функцию formatPhone(value): оставить только цифры (replace(/\\D/g, \'\')), убрать первую 7 или 8, обрезать до 10 цифр; пустой ввод — пустая строка; дальше собрать «+7(» + 3 цифры, «)-» и следующие 3 — только если цифр больше 3, «-» + 2 — если больше 6, «-» + 2 — если больше 8. На каждое событие input поля [name="phone"] записывайте в него formatPhone(его значения). В HTML полю телефона добавьте maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX".',
      hints: [
        'Начало: let digits = value.replace(/\\D/g, \'\'); if (digits.startsWith(\'7\') || digits.startsWith(\'8\')) digits = digits.slice(1); digits = digits.slice(0, 10);',
        'if (digits.length === 0) return \'\'; let result = \'+7(\' + digits.slice(0, 3);',
        'if (digits.length > 3) result += \')-\' + digits.slice(3, 6); — и так же для 6 и 8. Закрывающая скобка появляется только с четвёртой цифрой, поэтому Backspace не застревает.',
        'Подключение: document.querySelectorAll(\'input[name="phone"]\').forEach((input) => { input.addEventListener(\'input\', () => { input.value = formatPhone(input.value); }); });'
      ],
      html: `<main class="reg">
  <h1>Новая заявка</h1>
  <form id="request-form" novalidate>
${field('phone', 'Телефон для связи', ' type="tel" inputmode="tel" autocomplete="tel"')}
    <button class="btn" type="submit">Отправить</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// js/phone-mask.js
function formatPhone(value) {
  return value;
}

// Подключите маску к полю name="phone"
`,
      tests: [
        { name: 'formatPhone собирает полный номер из разных вариантов ввода', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          for (const v of ['9123456789', '89123456789', '79123456789', '+7 912 345 67 89', '8 (912) 345-67-89']) {
            const r = f(v); if (r !== '+7(912)-345-67-89') return `formatPhone('${v}') = '${r}'`;
          }
          return true;
        } },
        { name: 'Готовый номер не меняется, лишние цифры отрезаются', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          const a = f('+7(912)-345-67-89'); if (a !== '+7(912)-345-67-89') return `повторный прогон даёт '${a}'`;
          const b = f('891234567890000'); return b === '+7(912)-345-67-89' || `лишние цифры: '${b}'`;
        } },
        { name: 'Частичный ввод: скобка только с 4-й цифры', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          const cases = [['', ''], ['abc', ''], ['9', '+7(9'], ['912', '+7(912'], ['9123', '+7(912)-3'], ['912345', '+7(912)-345'], ['9123456', '+7(912)-345-6'], ['912345678', '+7(912)-345-67-8']];
          for (const [v, want] of cases) { const r = f(v); if (r !== want) return `formatPhone('${v}') = '${r}', нужно '${want}'`; }
          return true;
        } },
        { name: 'Маска работает при вводе в поле', js: true, check: h => {
          h.type('#phone', '89123456789');
          return h.$('#phone').value === '+7(912)-345-67-89' || `в поле: ${h.$('#phone').value}`;
        } },
        { name: 'У поля maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX"', check: h => {
          const i = h.$('#phone');
          return i.getAttribute('maxlength') === '17' && i.getAttribute('placeholder') === '+7(XXX)-XXX-XX-XX' || 'добавьте полю maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX"';
        } }
      ]
    }
  );
})();
