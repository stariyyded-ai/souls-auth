/* Занятие 43. Обратная связь и состояния элементов */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Правило по регулярному выражению для селектора
  const rule = (h, re) => h.rules.find(x => re.test(x.selector));
  // Значение свойства из правила, переведённое в вычисленный вид через временный элемент
  const ruleValue = (h, re, prop, short) => {
    const r = rule(h, re); if (!r) return '';
    const v = r.style.getPropertyValue(prop) || (short ? r.style.getPropertyValue(short) : ''); if (!v) return '';
    const t = h.doc.createElement('span'); h.doc.body.appendChild(t);
    t.style.setProperty(short && !r.style.getPropertyValue(prop) ? short : prop, v);
    const out = h.win.getComputedStyle(t).getPropertyValue(prop); t.remove();
    return out;
  };
  const before = (h, sel) => { const e = h.$(sel); if (!e) return 'none'; return h.win.getComputedStyle(e, '::before').getPropertyValue('content'); };
  // Сообщение, связанное с полем через aria-describedby
  const described = (h, sel) => { const i = h.$(sel); const id = i && i.getAttribute('aria-describedby'); return id ? h.doc.getElementById(id.split(/\s+/)[0]) : null; };

  window.COURSE_TASKS.push(
    {
      id: 'k4301', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Все состояния кнопки', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице записи на консультацию кнопки времени никак не реагируют: не темнеют под мышью, не видно фокуса с клавиатуры, а занятое время выглядит так же, как свободное.',
      goal: 'Допишите состояния кнопки .btn. Наведение — правило .btn:hover:not(:disabled), фон #174a83. Нажатие — правило .btn:active:not(:disabled), фон #103660 и сдвиг transform: translateY(1px). Фокус с клавиатуры — правило .btn:focus-visible, обводка outline: 3px solid #1a1a1a и outline-offset: 2px. Недоступная кнопка — правило .btn:disabled: фон #d6d6d6, текст #555555, курсор cursor: not-allowed. Часть :not(:disabled) нужна, чтобы недоступная кнопка не реагировала на мышь.',
      hints: [
        'Состояния пишутся после основного правила .btn — так они его переопределяют.',
        'Наведение: .btn:hover:not(:disabled) { background-color: #174a83; }',
        'Фокус: .btn:focus-visible { outline: 3px solid #1a1a1a; outline-offset: 2px; }',
        'Недоступная: .btn:disabled { background-color: #d6d6d6; color: #555555; cursor: not-allowed; }'
      ],
      html: `<h1>Запись на консультацию</h1>
<p>Выберите удобное время:</p>
<div class="slots">
  <button class="btn" type="button">Пн, 15:00</button>
  <button class="btn" type="button">Ср, 14:00</button>
  <button class="btn" type="button" disabled>Пт, 16:00 — мест нет</button>
</div>`,
      css: `${BASE}
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background-color: #1f5fa8;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}`,
      tests: [
        { name: 'Наведение: .btn:hover:not(:disabled) с фоном #174a83', check: h => ruleValue(h, /^\.btn:hover:not\(:disabled\)$/, 'background-color', 'background') === rgb('#174a83') || 'нет правила .btn:hover:not(:disabled) с фоном #174a83' },
        { name: 'Нажатие: фон #103660 и сдвиг на 1px вниз', check: h => { const r = rule(h, /^\.btn:active:not\(:disabled\)$/); return !!r && ruleValue(h, /^\.btn:active:not\(:disabled\)$/, 'background-color', 'background') === rgb('#103660') && /translateY\(1px\)/.test(r.style.transform) || 'нужно .btn:active:not(:disabled) с фоном и transform: translateY(1px)'; } },
        { name: 'Фокус: обводка 3px solid с отступом 2px', check: h => { const r = rule(h, /^\.btn:focus-visible$/); return !!r && r.style.outlineStyle === 'solid' && r.style.outlineWidth === '3px' && r.style.outlineOffset === '2px' || 'нужно .btn:focus-visible { outline: 3px solid #1a1a1a; outline-offset: 2px; }'; } },
        { name: 'Недоступная кнопка: серый фон, тёмно-серый текст, курсор not-allowed', check: h => h.cs('.btn:disabled', 'background-color') === rgb('#d6d6d6') && h.cs('.btn:disabled', 'color') === rgb('#555555') && h.cs('.btn:disabled', 'cursor') === 'not-allowed' || 'у .btn:disabled фон #d6d6d6, color #555555, cursor: not-allowed' },
        { name: 'Обычная кнопка не изменилась', check: h => h.cs('.btn', 'background-color') === rgb('#1f5fa8') && h.cs('.btn', 'cursor') === 'pointer' || 'основное правило .btn оставьте как было' }
      ]
    },
    {
      id: 'k4302', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Поле с ошибкой и поле с успехом', level: 'Среднее', minutes: 20, points: 150,
      story: 'Для стайлгайда библиотеки нужна «витрина» состояний поля: обычное, с ошибкой и с успехом. Дизайнер просит, чтобы ошибку было понятно не только по красному цвету.',
      goal: 'Сразу после поля почты добавьте абзац p.error-text с id="email-error": что не так и как исправить, с примером правильного адреса (в тексте должен быть знак @). Сразу после поля логина — p.success-text с id="login-ok" и текстом «Логин свободен». Свяжите поля с сообщениями атрибутом aria-describedby. В CSS: поле с aria-invalid="true" — рамка 2px solid #c62828; .error-text — цвет #c62828 и значок перед текстом через ::before (например, content: "✕ "); поле .is-valid — рамка 2px solid #2e7d32; .success-text — цвет #2e7d32.',
      hints: [
        'Разметка: <input id="email" … aria-invalid="true" aria-describedby="email-error"> и сразу под ним <p class="error-text" id="email-error">…</p>.',
        'Хорошая ошибка: «В адресе нет знака @. Пример: anna@mail.ru». Плохая: «Ошибка ввода».',
        'Селектор по атрибуту: input[aria-invalid="true"] { border: 2px solid #c62828; }',
        'Значок: .error-text::before { content: "✕ "; }'
      ],
      html: `<h1>Регистрация в электронной библиотеке</h1>
<form class="form" novalidate>
  <div class="field">
    <label for="name">Имя</label>
    <input id="name" type="text" value="Анна">
  </div>
  <div class="field">
    <label for="email">Электронная почта</label>
    <input id="email" type="email" value="anna.mail.ru" aria-invalid="true">
  </div>
  <div class="field">
    <label for="login">Логин</label>
    <input id="login" class="is-valid" type="text" value="anna_reader">
  </div>
  <button class="btn" type="submit">Зарегистрироваться</button>
</form>`,
      css: `${BASE}
.form {
  max-width: 360px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  padding: 8px;
  border: 2px solid #767676;
  border-radius: 4px;
  font-size: 16px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background-color: #1f5fa8;
  color: #ffffff;
  font-size: 16px;
}`,
      tests: [
        { name: 'Ошибка: сообщение сразу после поля почты, связано через aria-describedby', check: h => { const m = described(h, '#email'); return !!m && m.matches('p.error-text') && h.$('#email').nextElementSibling === m || 'нужен p.error-text сразу после #email и aria-describedby="email-error"'; } },
        { name: 'Ошибка объясняет, как исправить: есть пример с @', check: h => { const m = h.$('.error-text'); return !!m && m.textContent.trim().length >= 20 && m.textContent.includes('@') || 'напишите, что не так, и дайте пример адреса'; } },
        { name: 'Поле с ошибкой: рамка 2px #c62828', check: h => h.cs('#email', 'border-top-color') === rgb('#c62828') && h.px('#email', 'border-top-width') === 2 || 'input[aria-invalid="true"] { border: 2px solid #c62828; }' },
        { name: 'Текст ошибки красный и со значком (не только цветом)', check: h => h.cs('.error-text', 'color') === rgb('#c62828') && !/^(none|normal)$/.test(before(h, '.error-text')) || 'у .error-text цвет #c62828 и ::before с content' },
        { name: 'Успех: «Логин свободен» после поля логина, связан через aria-describedby', check: h => { const m = described(h, '#login'); return !!m && m.matches('p.success-text') && h.$('#login').nextElementSibling === m && m.textContent.trim() === 'Логин свободен' || 'нужен p.success-text сразу после #login и aria-describedby="login-ok"'; } },
        { name: 'Поле и текст успеха зелёные #2e7d32', check: h => h.cs('#login', 'border-top-color') === rgb('#2e7d32') && h.px('#login', 'border-top-width') === 2 && h.cs('.success-text', 'color') === rgb('#2e7d32') || '.is-valid — рамка 2px solid #2e7d32, .success-text — color #2e7d32' }
      ]
    },
    {
      id: 'k4303', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Опасное действие и пустое состояние', level: 'Среднее', minutes: 20, points: 150,
      story: 'В разделе «Мои брони» студент случайно нажал «Отменить бронь» и потерял книгу, которую ждал месяц. А когда броней не осталось, страница стала просто пустой — непонятно, сломалось что-то или так и надо.',
      goal: 'Допишите скрипт. При нажатии на «Отменить бронь» спросите подтверждение через confirm(), в вопросе назовите книгу (текст из .title пункта, например «Отменить бронь книги «Основы HTML»?»). Если пользователь согласился — удалите пункт .item из списка. Если отказался — ничего не меняйте. Когда в списке не осталось пунктов, покажите пустое состояние .empty (уберите у него hidden).',
      hints: [
        'confirm(\'вопрос\') показывает окно с кнопками «ОК» и «Отмена» и возвращает true или false.',
        'Пункт, в котором лежит кнопка: const item = button.closest(\'.item\'); — closest ищет ближайшего предка с таким селектором. Удалить элемент: item.remove().',
        'Сколько пунктов осталось: document.querySelectorAll(\'.item\').length',
        'if (confirm(\'Отменить бронь книги \' + title + \'?\')) { item.remove(); if (document.querySelectorAll(\'.item\').length === 0) { empty.hidden = false; } }'
      ],
      html: `<h1>Мои брони</h1>
<ul class="list">
  <li class="item"><span class="title">«Основы HTML»</span> <button class="cancel" type="button">Отменить бронь</button></li>
  <li class="item"><span class="title">«Веб-дизайн»</span> <button class="cancel" type="button">Отменить бронь</button></li>
</ul>
<div class="empty" hidden>
  <h2>Броней пока нет</h2>
  <p>Найдите книгу в каталоге и нажмите «Забронировать».</p>
  <a class="empty__link" href="#catalog">Перейти в каталог</a>
</div>`,
      css: `${BASE}
.list {
  padding: 0;
  list-style: none;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  padding: 16px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.cancel {
  padding: 8px 16px;
  border: 2px solid #c62828;
  border-radius: 8px;
  background-color: #ffffff;
  color: #c62828;
  font-size: 16px;
}
.empty {
  padding: 24px;
  border: 2px dashed #8c959f;
  border-radius: 8px;
  text-align: center;
}`,
      js: `const empty = document.querySelector('.empty');
const buttons = document.querySelectorAll('.cancel');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    const title = item.querySelector('.title').textContent;
    // 1. Спросите подтверждение через confirm, назовите книгу
    // 2. Если пользователь согласился — удалите пункт
    // 3. Если пунктов не осталось — покажите пустое состояние
  });
}
`,
      tests: [
        { name: 'Перед отменой спрашивается подтверждение с названием книги', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return h.alerts.length === 1 && h.alerts[0].includes('Основы HTML') || (h.alerts.length ? `в вопросе нет названия книги: «${h.alerts[0]}»` : 'confirm не вызван'); } },
        { name: 'После согласия пункт удаляется', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return h.count('.item') === 1 && !h.text('.list').includes('Основы HTML') || `пунктов осталось: ${h.count('.item')}`; } },
        { name: 'Если пользователь отказался — ничего не меняется', js: true, check: async h => {
          window.confirm = () => false;
          h.$$('.cancel')[0].click(); await h.wait();
          return h.count('.item') === 2 || 'при «Отмена» пункт удалять нельзя'; } },
        { name: 'Пока брони есть, пустое состояние скрыто', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return !h.visible('.empty') || 'одна бронь ещё осталась, а пустое состояние уже видно'; } },
        { name: 'Когда броней не осталось, видно пустое состояние', js: true, check: async h => {
          h.$$('.cancel').forEach(b => b.click()); await h.wait();
          return h.count('.item') === 0 && h.visible('.empty') || `пунктов: ${h.count('.item')}, пустое состояние ${h.visible('.empty') ? 'видно' : 'скрыто'}`; } },
        { name: 'В консоли нет ошибок', js: true, check: async h => { h.$$('.cancel').forEach(b => b.click()); await h.wait(); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
