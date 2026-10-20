/* Занятие 23. ЛР12. Вёрстка форм регистрации, входа и заявки по макету */
(() => {
  const { rgb } = window.COURSE_KIT;
  const ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-accent: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #cbd5e1;
  --color-error: #dc2626;
  --fs-small: 0.875rem;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
h1 { margin: 0 0 var(--space-2); font-size: 1.75rem; }
.page { width: 100%; max-width: 480px; margin: 0 auto; padding: var(--space-3) var(--space-2); }
.btn { min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; cursor: pointer; }`;
  const FIELDS = `.form { display: flex; flex-direction: column; gap: var(--space-2); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-weight: 600; font-size: var(--fs-small); }
.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 16px; }
.field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; border-color: var(--color-primary); }
.btn--block { width: 100%; }`;
  const ruleWith = (h, re) => h.rules.find(r => re.test(r.selector));
  window.COURSE_TASKS.push(
    {
      id: 'w2301', lesson: 'm9-lr12', module: 'mdk93', mech: 'build', title: 'Компонент «поле» с ошибкой', level: 'Среднее', minutes: 30, points: 150,
      story: 'В макете регистрации «ЧистоДома» поля крупные, со скруглением, а под ними — подсказка или красная ошибка. Браузерные поля мелкие и серые. Сверстаем компонент «поле» и демо-состояние ошибки «Логин уже занят», которое в модуле 5 будет подставлять PHP.',
      goal: 'Разметка уже готова. Напишите CSS: .form и .field — flex-колонки с gap var(--space-2) и 4px. .field__label — жирность 600, размер var(--fs-small). .field__input — width: 100%, min-height: 48px, padding 0 var(--space-2), рамка 1px solid var(--color-border), радиус var(--radius), фон var(--color-surface), font: inherit и font-size: 16px. .field__input:focus-visible — outline 3px solid var(--color-accent). .field__hint — без отступов (margin: 0), размер var(--fs-small), цвет var(--color-muted). .field__error — margin: 0, размер var(--fs-small), цвет var(--color-error). .field--error .field__input — рамка цвета var(--color-error).',
      hints: [
        '.form { display: flex; flex-direction: column; gap: var(--space-2); } и .field { display: flex; flex-direction: column; gap: 4px; }',
        '.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); font: inherit; font-size: 16px; } — font-size после font, иначе font его перебьёт.',
        'Фокус: .field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; }',
        'Ошибка через модификатор родителя: .field--error .field__input { border-color: var(--color-error); }'
      ],
      html: `<main class="page">
  <h1>Регистрация</h1>
  <form class="form" action="#" method="post">
    <div class="field field--error">
      <label class="field__label" for="login">Логин</label>
      <input class="field__input" type="text" id="login" name="login" value="ivanov" required minlength="6" aria-invalid="true" aria-describedby="login-error">
      <p class="field__error" id="login-error">Логин уже занят</p>
    </div>
    <div class="field">
      <label class="field__label" for="password">Пароль</label>
      <input class="field__input" type="password" id="password" name="password" required minlength="6" aria-describedby="password-hint">
      <p class="field__hint" id="password-hint">Не менее 6 символов</p>
    </div>
    <div class="field">
      <label class="field__label" for="email">Email</label>
      <input class="field__input" type="email" id="email" name="email" required>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${ROOT}
/* Ниже — компонент «поле»: .form, .field, .field__label, .field__input, .field__hint, .field__error, .field--error */
`,
      tests: [
        { name: '.form и .field — колонки на Flexbox с промежутками 16px и 4px', check: h => {
          for (const [s, g] of [['.form', 16], ['.field', 4]]) {
            if (h.cs(s, 'display') !== 'flex' || h.cs(s, 'flex-direction') !== 'column') return `${s}: нужно display: flex и flex-direction: column`;
            if (h.px(s, 'row-gap') !== g) return `${s}: gap должен быть ${g}px`;
          }
          return true;
        } },
        { name: '.field__label: жирность 600, размер 0.875rem', check: h => +h.cs('.field__label', 'font-weight') >= 600 && h.px('.field__label', 'font-size') === 14 || 'font-weight: 600; font-size: var(--fs-small)' },
        { name: '.field__input: на всю ширину, высота не меньше 48px', check: h => {
          const f = h.rect('.field'), i = h.rect('#password');
          if (Math.abs(f.width - i.width) > 1) return 'поле должно быть шириной во весь блок .field';
          return i.height >= 47.5 || `высота поля ${Math.round(i.height)}px`;
        } },
        { name: '.field__input: шрифт страницы и размер 16px', check: h => h.cs('#password', 'font-family') === h.cs('body', 'font-family') && h.px('#password', 'font-size') === 16 || 'нужно font: inherit и font-size: 16px' },
        { name: '.field__input: рамка 1px цвета --color-border, радиус 12px, белый фон', check: h => {
          if (h.px('#password', 'border-top-width') !== 1 || h.cs('#password', 'border-top-color') !== rgb('#cbd5e1')) return 'рамка 1px solid var(--color-border)';
          if (h.cs('#password', 'background-color') !== rgb('#ffffff')) return 'фон — var(--color-surface)';
          return h.px('#password', 'border-top-left-radius') === 12 || 'радиус — var(--radius)';
        } },
        { name: 'Фокус заметен: :focus-visible с обводкой 3px', check: h => {
          const r = ruleWith(h, /field__input:focus-visible/);
          return r && /outline/.test(r.style.cssText) && /3px/.test(r.style.cssText) || 'нужно .field__input:focus-visible { outline: 3px solid var(--color-accent); }';
        } },
        { name: 'Подсказка серая, ошибка красная, обе без отступов, размер 0.875rem', check: h => {
          if (h.cs('.field__hint', 'color') !== rgb('#64748b')) return 'подсказка — var(--color-muted)';
          if (h.cs('.field__error', 'color') !== rgb('#dc2626')) return 'ошибка — var(--color-error)';
          if (h.px('.field__hint', 'margin-top') !== 0 || h.px('.field__error', 'margin-bottom') !== 0) return 'уберите margin у подсказки и ошибки';
          return h.px('.field__error', 'font-size') === 14 && h.px('.field__hint', 'font-size') === 14 || 'размер — var(--fs-small)';
        } },
        { name: 'Поле с ошибкой: рамка цвета --color-error, у обычных полей — серая', check: h => h.cs('#login', 'border-top-color') === rgb('#dc2626') && h.cs('#email', 'border-top-color') === rgb('#cbd5e1') || '.field--error .field__input { border-color: var(--color-error); }' }
      ]
    },
    {
      id: 'w2302', lesson: 'm9-lr12', module: 'mdk93', mech: 'build', title: 'Вход: форма по центру и общее сообщение', level: 'Среднее', minutes: 25, points: 150,
      story: 'В макете страница входа «ЧистоДома» стоит ровно посередине экрана телефона, а при неверном пароле сверху появляется плашка «Неверный логин или пароль». Сейчас форма прилипла к верху, а плашка выглядит как обычный текст.',
      goal: 'CSS: .page--auth — на всю высоту экрана (min-height: 100dvh), flex-колонка, содержимое по центру по вертикали (justify-content: center). .alert — padding 12px var(--space-2), радиус var(--radius), размер var(--fs-small). .alert--error — фон #fef2f2, текст #991b1b, рамка 1px solid #fecaca. .auth__link — текст по центру. HTML: блоку ошибки добавьте role="alert", полю логина — autocomplete="username", паролю — autocomplete="current-password".',
      hints: [
        '.page--auth { min-height: 100dvh; display: flex; flex-direction: column; justify-content: center; } — dvh учитывает панели мобильного браузера.',
        '.alert { padding: 12px var(--space-2); border-radius: var(--radius); font-size: var(--fs-small); } и .alert--error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }',
        'В HTML: <div class="alert alert--error" role="alert">…</div>, <input … autocomplete="username">, <input … autocomplete="current-password">',
        '.auth__link { text-align: center; }'
      ],
      html: `<main class="page page--auth">
  <img class="auth__logo" src="img/icon.svg" alt="ЧистоДом" width="48" height="48">
  <h1>Вход</h1>
  <div class="alert alert--error">Неверный логин или пароль</div>
  <form class="form" action="#" method="post">
    <div class="field">
      <label class="field__label" for="login">Логин</label>
      <input class="field__input" type="text" id="login" name="login" required>
    </div>
    <div class="field">
      <label class="field__label" for="password">Пароль</label>
      <input class="field__input" type="password" id="password" name="password" required>
    </div>
    <button class="btn btn--block" type="submit">Войти</button>
  </form>
  <p class="auth__link">Ещё нет аккаунта? <a href="#register">Зарегистрироваться</a></p>
</main>`,
      css: `${ROOT}
${FIELDS}
.auth__logo { display: block; margin: 0 auto var(--space-2); }
/* Ниже — .page--auth, .alert, .alert--error, .auth__link */
`,
      tests: [
        { name: 'Страница входа на всю высоту экрана: min-height: 100dvh', check: h => h.has(/min-height\s*:\s*100dvh/) && h.rect('.page--auth').height >= h.height - 1 || 'нужно .page--auth { min-height: 100dvh; }' },
        { name: 'Содержимое по центру по вертикали: flex, column, justify-content: center', check: h => {
          if (h.cs('.page--auth', 'display') !== 'flex' || h.cs('.page--auth', 'flex-direction') !== 'column') return 'нужно display: flex; flex-direction: column';
          return h.cs('.page--auth', 'justify-content') === 'center' || 'нужно justify-content: center';
        } },
        { name: 'Сообщение .alert--error: фон #fef2f2, текст #991b1b, рамка 1px #fecaca', check: h => {
          const s = '.alert--error';
          if (h.cs(s, 'background-color') !== rgb('#fef2f2')) return 'фон #fef2f2';
          if (h.cs(s, 'color') !== rgb('#991b1b')) return 'текст #991b1b';
          return h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-color') === rgb('#fecaca') || 'рамка 1px solid #fecaca';
        } },
        { name: '.alert: отступы 12px и 16px, радиус 12px, размер 0.875rem', check: h => h.px('.alert', 'padding-top') === 12 && h.px('.alert', 'padding-left') === 16 && h.px('.alert', 'border-top-left-radius') === 12 && h.px('.alert', 'font-size') === 14 || 'padding: 12px var(--space-2); border-radius: var(--radius); font-size: var(--fs-small)' },
        { name: 'Сообщение объявляется экранным диктором: role="alert"', check: h => h.$('.alert')?.getAttribute('role') === 'alert' || 'добавьте role="alert"' },
        { name: 'Подсказки браузеру: autocomplete="username" и "current-password"', check: h => h.$('#login').getAttribute('autocomplete') === 'username' && h.$('#password').getAttribute('autocomplete') === 'current-password' || 'добавьте autocomplete полям логина и пароля' },
        { name: 'Ссылка на регистрацию по центру', check: h => h.cs('.auth__link', 'text-align') === 'center' || 'text-align: center' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
