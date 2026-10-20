/* Занятие 28. ЛР16. Контрольная: 5 страниц по чужому макету за 90 минут */
(() => {
  const { rgb } = window.COURSE_KIT;
  const varOf = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  window.COURSE_TASKS.push(
    {
      id: 'w2801', lesson: 'm9-lr16', module: 'mdk93', mech: 'build', title: 'Каркас под чужой стайл-гайд: «ТехноПульс»', level: 'Сложное', minutes: 30, points: 200,
      story: 'Контрольная: вариант не ваш, а сервиса ремонта техники «ТехноПульс». Правило №2 — заготовки разрешены: берём свою страницу «Новая заявка» от «ЧистоДома», перекрашиваем через переменные и сверяем поля с ТЗ. В макете забыли тип оплаты, но ТЗ важнее макета.',
      goal: 'В :root замените значения переменных на стайл-гайд «ТехноПульса»: --color-primary #1d4ed8, --color-primary-dark #1e3a8a, --color-accent #f97316, --color-bg #f1f5f9, --color-text #111827, --color-error #b91c1c, --radius 8px. Вне :root цвета пишите только через var(…). Логотип в шапке — «ТехноПульс». В списке «Вид услуги» после пустого пункта — услуги из ТЗ: Ремонт смартфона, Ремонт ноутбука, Ремонт бытовой техники, Иная услуга (value 1–4). Перед кнопкой добавьте тип оплаты: <fieldset class="field"> с <legend class="field__label">Тип оплаты</legend> и двумя радиокнопками name="payment" (value cash и card, «Наличные» и «Банковская карта»), обязательный выбор; каждую радиокнопку оберните в <label class="choice">. На 360px — без прокрутки вбок.',
      hints: [
        'Перекраска — это только :root: --color-primary: #1d4ed8; --color-primary-dark: #1e3a8a; … --radius: 8px; Правила ниже трогать не нужно, если в них var(…).',
        'Логотип: <a class="logo" href="#requests">ТехноПульс</a>. Услуги: <option value="1">Ремонт смартфона</option> … <option value="4">Иная услуга</option>',
        'Оплата: <fieldset class="field"> <legend class="field__label">Тип оплаты</legend> <label class="choice"><input type="radio" name="payment" value="cash" required> Наличные</label> <label class="choice"><input type="radio" name="payment" value="card"> Банковская карта</label> </fieldset>',
        'Для .choice в CSS уже есть правило — оно найдёт вашу разметку. Проверьте страницу на 360px.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#requests">Мои заявки</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Новая заявка</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label class="field__label" for="address">Адрес</label>
      <input class="field__input" type="text" id="address" name="address" required>
    </div>
    <div class="field">
      <label class="field__label" for="phone">Телефон</label>
      <input class="field__input" type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">
    </div>
    <div class="form__row">
      <div class="field">
        <label class="field__label" for="date">Дата</label>
        <input class="field__input" type="date" id="date" name="date" required>
      </div>
      <div class="field">
        <label class="field__label" for="time">Время</label>
        <input class="field__input" type="time" id="time" name="time" required>
      </div>
    </div>
    <div class="field field--error">
      <label class="field__label" for="service">Вид услуги</label>
      <select class="field__input" id="service" name="service_id" required aria-describedby="service-error">
        <option value="">— Выберите услугу —</option>
        <option value="1">Общий клининг</option>
        <option value="2">Генеральная уборка</option>
        <option value="3">Послестроительная уборка</option>
        <option value="4">Химчистка ковров и мебели</option>
      </select>
      <p class="field__error" id="service-error">Выберите услугу</p>
    </div>
    <div class="field">
      <label class="field__label" for="comment">Описание (для иной услуги)</label>
      <textarea class="field__input" id="comment" name="comment" rows="3"></textarea>
    </div>
    <button class="btn" type="submit">Отправить заявку</button>
  </form>
</main>`,
      css: `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-accent: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-border: #94a3b8;
  --color-error: #dc2626;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-1); padding: var(--space-1) var(--space-2); background: var(--color-primary); }
.logo { color: var(--color-surface); font-weight: 700; text-decoration: none; }
.nav { display: flex; gap: var(--space-2); }
.nav a { display: inline-flex; align-items: center; min-height: 44px; color: var(--color-surface); }
.page { width: min(100% - 32px, 480px); margin: 0 auto; padding: var(--space-3) 0; }
.form { display: flex; flex-direction: column; gap: var(--space-2); }
.form__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.field { display: flex; flex-direction: column; gap: 4px; min-width: 0; margin: 0; padding: 0; border: 0; }
.field__label { padding: 0; font-weight: 600; font-size: 0.875rem; }
.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 16px; }
textarea.field__input { padding: 12px var(--space-2); resize: vertical; }
.field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; }
.field--error .field__input { border-color: var(--color-error); }
.field__error { margin: 0; font-size: 0.875rem; color: var(--color-error); }
.choice { display: flex; align-items: center; gap: var(--space-1); min-height: 44px; }
.btn { min-height: 48px; border: none; border-radius: var(--radius); background: var(--color-primary); color: var(--color-surface); font: inherit; font-weight: 600; cursor: pointer; }
.btn:hover { background: var(--color-primary-dark); }`,
      tests: [
        { name: 'Цвета «ТехноПульса»: основной #1d4ed8, тёмный #1e3a8a, акцент #f97316', check: h => {
          for (const [n, v] of [['--color-primary', '#1d4ed8'], ['--color-primary-dark', '#1e3a8a'], ['--color-accent', '#f97316']]) if (varOf(h, n) !== v) return `${n}: ${varOf(h, n) || 'нет'}, нужно ${v}`;
          return true;
        } },
        { name: 'Фон #f1f5f9, текст #111827, ошибка #b91c1c, радиус 8px', check: h => {
          for (const [n, v] of [['--color-bg', '#f1f5f9'], ['--color-text', '#111827'], ['--color-error', '#b91c1c'], ['--radius', '8px']]) if (varOf(h, n) !== v) return `${n}: ${varOf(h, n) || 'нет'}, нужно ${v}`;
          return true;
        } },
        { name: 'Страница перекрасилась: шапка и кнопка синие, фон светло-серый, поля скруглены на 8px', check: h => {
          if (h.cs('.header', 'background-color') !== rgb('#1d4ed8') || h.cs('.btn', 'background-color') !== rgb('#1d4ed8')) return 'шапка и кнопка должны быть #1d4ed8';
          if (h.cs('body', 'background-color') !== rgb('#f1f5f9')) return 'фон страницы #f1f5f9';
          if (h.cs('#service', 'border-top-color') !== rgb('#b91c1c')) return 'рамка поля с ошибкой — #b91c1c';
          return h.px('#address', 'border-top-left-radius') === 8 && h.px('.btn', 'border-top-left-radius') === 8 || 'радиус полей и кнопки 8px';
        } },
        { name: 'Вне :root цвета только через var(…)', check: h => {
          const m = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '').match(/#[0-9a-f]{3,8}\b/i);
          return !m || `в правилах есть ${m[0]}: используйте переменную`;
        } },
        { name: 'Логотип — «ТехноПульс»', check: h => h.text('.header .logo') === 'ТехноПульс' || `сейчас логотип: «${h.text('.header .logo')}»` },
        { name: 'Вид услуги по ТЗ: пустой пункт и 4 услуги ремонта', check: h => {
          const o = h.$$('#service option');
          if (o[0]?.value !== '') return 'первый пункт — пустой, value=""';
          const want = ['Ремонт смартфона', 'Ремонт ноутбука', 'Ремонт бытовой техники', 'Иная услуга'];
          const got = o.slice(1).map(x => x.textContent.trim());
          if (got.join('|') !== want.join('|')) return `услуги сейчас: ${got.join(', ')}`;
          return o.slice(1).map(x => x.value).join('') === '1234' || 'value услуг: 1, 2, 3, 4';
        } },
        { name: 'Тип оплаты по ТЗ: 2 radio name="payment" в fieldset с legend, выбор обязателен', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (r.length !== 2) return `radio с name="payment": ${r.length}, нужно 2`;
          if (!r.every(x => x.closest('fieldset')?.querySelector('legend'))) return 'оберните кнопки в <fieldset> с <legend>';
          if (r.map(x => x.value).sort().join() !== 'card,cash') return 'value: cash и card';
          if (!r.every(x => x.closest('label.choice'))) return 'каждую радиокнопку оберните в <label class="choice">';
          return !r[0].checkValidity() || 'добавьте required';
        } },
        { name: 'Оплата стоит перед кнопкой отправки', check: h => h.before('input[name="payment"]', '.btn') || 'тип оплаты — перед кнопкой «Отправить заявку»' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
