/* Занятие 60. ЛР37. Контрольная: задание 3 КИМ за 60 минут */
(() => {
  const { BASE } = window.COURSE_KIT;
  const field = (name, label, attrs = '') => `    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}"${attrs}>
      <div class="invalid-feedback" id="${name}-error"></div>
    </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w6001', lesson: 'm9-lr37', module: 'mdk96', mech: 'build', title: 'Контрольная: валидация по памяти', level: 'Сложное', minutes: 25, points: 200,
      story: 'Тренировка «как на экзамене»: перед вами чистая форма регистрации портала и пустой скрипт. За 15–20 минут без подсказок напишите валидацию четырёх полей и маску телефона. Подсказки открывайте, только если застряли дольше 5 минут.',
      goal: 'Без готового кода: форме #register-form поставьте атрибут novalidate из JS. Проверки (значение после trim): login — не меньше 6 символов, сообщение «Логин — не менее 6 символов»; fio — кириллица с Ё, слова через пробел или дефис, «ФИО — только кириллица»; phone — ровно +7(XXX)-XXX-XX-XX, «Формат: +7(XXX)-XXX-XX-XX»; email — «что-то@домен.зона», зона от 2 символов, «Некорректный email». Неверное поле получает класс is-invalid и текст в #ИМЯ-error, верное — класс снимается и текст пустой. Проверка при уходе с поля (focusout на форме) и при отправке — ВСЕХ полей сразу, с preventDefault при ошибке. Маска: при вводе в телефон цифры превращаются в +7(XXX)-XXX-XX-XX (первая 7 или 8 отбрасывается, не больше 10 цифр).',
      hints: [
        'Скелет: const rules = { fio: [/^…$/, \'ФИО — только кириллица\'], … }; function check(input) { const rule = rules[input.name]; if (!rule) return true; const ok = rule[0].test(input.value.trim()); … return ok; }',
        'Внутри check: input.classList.toggle(\'is-invalid\', !ok); const box = document.getElementById(input.name + \'-error\'); if (box) box.textContent = ok ? \'\' : rule[1];',
        'Подключение: form.setAttribute(\'novalidate\', \'\'); form.addEventListener(\'focusout\', (e) => e.target.name && check(e.target)); в submit: const allOk = [...form.elements].map(check).every(Boolean); if (!allOk) e.preventDefault();',
        'Маска: let d = e.target.value.replace(/\\D/g, \'\'); if (/^[78]/.test(d)) d = d.slice(1); d = d.slice(0, 10); дальше собрать \'+7(\' + d.slice(0, 3) + (d.length > 3 ? \')-\' + d.slice(3, 6) : \'\') + …'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form">
${field('login', 'Логин', ' autocomplete="username"')}
${field('fio', 'ФИО', ' autocomplete="name"')}
${field('phone', 'Телефон', ' type="tel" inputmode="tel" maxlength="17" placeholder="+7(XXX)-XXX-XX-XX" autocomplete="tel"')}
${field('email', 'Email', ' type="email" autocomplete="email"')}
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`,
      js: `// js/validation.js — контрольная, пишем по памяти
`,
      tests: [
        { name: 'Форма получила novalidate из JS', js: true, check: h => h.$('#register-form').hasAttribute('novalidate') || 'поставьте форме атрибут novalidate' },
        { name: 'Неверные данные: все четыре ошибки под полями, форма не ушла', js: true, check: h => {
          h.$('#login').value = 'ivan'; h.$('#fio').value = 'Ivanov Ivan'; h.$('#phone').value = '+7(912)345-67-89'; h.$('#email').value = 'user@mail';
          if (h.submit('#register-form')) return 'форма отправилась';
          const want = { login: 'Логин — не менее 6 символов', fio: 'ФИО — только кириллица', phone: 'Формат: +7(XXX)-XXX-XX-XX', email: 'Некорректный email' };
          for (const [k, v] of Object.entries(want)) {
            if (!h.$('#' + k).classList.contains('is-invalid')) return `поле ${k} не подсвечено`;
            if (h.text(`#${k}-error`) !== v) return `под ${k}: «${h.text(`#${k}-error`)}»`;
          }
          return true;
        } },
        { name: 'Ловушки: Ё, двойная фамилия, логин с пробелами, телефон без дефиса', js: true, check: h => {
          h.$('#login').value = ' aleshin '; h.$('#fio').value = 'Алёшина-Петрова Ёлка'; h.$('#phone').value = '+7(912)-345-67-89'; h.$('#email').value = 'a@b.ru';
          if (!h.submit('#register-form')) return `верные данные не прошли: ${h.$$('.is-invalid').map(e => e.name).join(', ')}`;
          h.$('#login').value = '  ivan  ';
          h.submit('#register-form');
          if (!h.$('#login').classList.contains('is-invalid')) return 'логин «  ivan  » после trim короче 6';
          h.$('#login').value = 'aleshin'; h.$('#fio').value = 'Иванов  Иван';
          h.submit('#register-form');
          return h.$('#fio').classList.contains('is-invalid') || 'ФИО с двумя пробелами подряд пропущено';
        } },
        { name: 'Исправленное поле очищается', js: true, check: h => {
          h.$('#email').value = 'user@mail'; h.submit('#register-form');
          h.$('#email').value = 'user@mail.ru'; h.submit('#register-form');
          return !h.$('#email').classList.contains('is-invalid') && h.text('#email-error') === '' || 'после исправления email ошибка осталась';
        } },
        { name: 'Уход с поля проверяет только это поле', js: true, check: h => {
          h.$('#email').value = 'mail.ru';
          h.$('#email').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
          if (!h.$('#email').classList.contains('is-invalid')) return 'focusout не проверил email';
          return !h.$('#login').classList.contains('is-invalid') || 'проверилось и пустое поле логина, а с него не уходили';
        } },
        { name: 'Маска телефона', js: true, check: h => {
          h.type('#phone', '8 912 345 67 89');
          if (h.$('#phone').value !== '+7(912)-345-67-89') return `в поле: ${h.$('#phone').value}`;
          h.type('#phone', '9123');
          if (h.$('#phone').value !== '+7(912)-3') return `при вводе 9123: ${h.$('#phone').value}`;
          h.type('#phone', '');
          return h.$('#phone').value === '' || 'пустое поле должно остаться пустым';
        } }
      ]
    },
    {
      id: 'w6002', lesson: 'm9-lr37', module: 'mdk96', mech: 'build', title: 'Контрольная: анимация за 7 минут', level: 'Среднее', minutes: 15, points: 150,
      story: 'Последний пункт контрольной — анимация, которую эксперт увидит за 10 секунд: карточка заявки приподнимается при наведении, а сообщение «Заявка создана» мягко выезжает сверху. И, конечно, уважение к тем, кто отключил движение в системе.',
      goal: 'Только CSS. .card: transition для transform и box-shadow не дольше 0.3s; .card:hover: transform: translateY(-3px) и тень box-shadow. .alert: animation slide-in длительностью до 0.3s; @keyframes slide-in меняет только opacity и transform (from { opacity: 0; transform: translateY(-8px); }). В конце — @media (prefers-reduced-motion: reduce), где у .card transition-duration и у .alert animation-duration почти ноль (0.01ms). !important не используйте: правило внутри медиазапроса стоит ниже, поэтому и так победит.',
      hints: [
        '.card { … transition: transform .2s ease-out, box-shadow .2s ease-out; } — допишите в готовое правило.',
        '.card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgb(0 0 0 / 0.1); }',
        '.alert { … animation: slide-in .3s ease-out; } и @keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } }',
        '@media (prefers-reduced-motion: reduce) { .card { transition-duration: 0.01ms; } .alert { animation-duration: 0.01ms; } }'
      ],
      html: `<main class="list">
  <h1>Мои заявки</h1>
  <p class="alert">Заявка создана</p>
  <article class="card">
    <h2>Уборка квартиры</h2>
    <p>Статус: новая.</p>
  </article>
  <article class="card">
    <h2>Мытьё окон</h2>
    <p>Статус: в работе.</p>
  </article>
</main>`,
      css: `${BASE}
.list { max-width: 520px; }
.alert { padding: 12px 16px; border-radius: 10px; background: #e7f4ec; color: #14532d; }
.card { margin-bottom: 12px; padding: 16px; border: 1px solid #d0d5dd; border-radius: 12px; background: #ffffff; }
.card h2 { margin: 0 0 8px; font-size: 18px; }
.card p { margin: 0; }`,
      tests: [
        { name: '.card: transition для transform и box-shadow до 0.3s', check: h => {
          const p = h.cs('.card', 'transition-property'), d = h.cs('.card', 'transition-duration');
          if (!/transform/.test(p) || !/box-shadow/.test(p)) return `transition-property: ${p}`;
          return d.split(',').every(x => parseFloat(x) > 0 && parseFloat(x) <= 0.3) || `длительность: ${d}`;
        } },
        { name: '.card:hover приподнимает карточку и добавляет тень', check: h => {
          const r = h.rules.find(x => /\.card:hover/.test(x.selector) && !x.media);
          if (!r) return 'нет правила .card:hover';
          if (!/translateY\(\s*-/.test(r.style.transform)) return 'нужен transform: translateY(-3px)';
          return !!r.style.boxShadow && r.style.boxShadow !== 'none' || 'добавьте box-shadow';
        } },
        { name: '.alert выезжает анимацией slide-in до 0.3s', check: h => {
          if (h.cs('.alert', 'animation-name') !== 'slide-in') return `animation-name: ${h.cs('.alert', 'animation-name')}`;
          const d = parseFloat(h.cs('.alert', 'animation-duration'));
          return d > 0 && d <= 0.3 || `длительность ${d}s`;
        } },
        { name: '@keyframes slide-in меняет только opacity и transform', check: h => {
          const m = h.css.match(/@keyframes\s+slide-in\s*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}/);
          if (!m) return 'нет @keyframes slide-in';
          const props = (m[1].match(/[\w-]+(?=\s*:)/g) || []);
          if (!props.length) return '@keyframes пустой';
          const bad = props.find(p => !/^(opacity|transform)$/.test(p));
          return !bad || `в @keyframes анимируется ${bad}`;
        } },
        { name: 'prefers-reduced-motion: у .card и .alert почти нулевая длительность', check: h => {
          const inMedia = h.rules.filter(r => /prefers-reduced-motion:\s*reduce/.test(r.media));
          const card = inMedia.find(r => /\.card\b/.test(r.selector) && parseFloat(r.style.transitionDuration) <= 0.01 && r.style.transitionDuration !== '');
          const alert = inMedia.find(r => /\.alert\b/.test(r.selector) && parseFloat(r.style.animationDuration) <= 0.01 && r.style.animationDuration !== '');
          if (!card) return 'в медиазапросе нет .card с transition-duration: 0.01ms';
          return !!alert || 'в медиазапросе нет .alert с animation-duration: 0.01ms';
        } }
      ]
    }
  );
})();
