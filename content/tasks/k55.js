/* Занятие 55. Практическая работа №11 (ч. 3). Итоговая работа в формате демоэкзамена */
(() => {
  const { BASE, IMG, rgb } = window.COURSE_KIT;
  const ruleWith = (h, re, prop) => h.rules.find(r => re.test(r.selector) && r.style.getPropertyValue(prop));
  // Рамка outline в правиле: longhand пуст, если в shorthand есть var(), поэтому смотрим и outline
  const hasOutline = (h, re) => h.rules.some(r => re.test(r.selector) && (r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')) && !/none/.test(r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')));
  // Стайлгайд ветклиники «Хвост и лапы» — результат задания 1, готов в заданиях 2 и 3
  const GUIDE = `:root {
  --color-primary: #2d6a4f;
  --color-primary-dark: #1b4332;
  --color-surface: #f1f7f4;
  --color-accent: #f4a261;
  --color-text: #1f2933;
  --color-error: #b3261e;
  --radius: 8px;
  --space: 16px;
}
body { margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: var(--color-text); background-color: #ffffff; }
.btn { display: inline-block; min-height: 44px; padding: 10px 20px; font-size: 16px; border-radius: var(--radius); text-decoration: none; cursor: pointer; }
.btn-primary { border: 2px solid var(--color-primary); background-color: var(--color-primary); color: #ffffff; }
.btn-primary:hover { background-color: var(--color-primary-dark); }
.btn:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k5501', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 1. Стайлгайд в коде', level: 'Среднее', minutes: 25, points: 150,
      story: 'Демоэкзамен в миниатюре. По ТЗ из урока вы собрали стайлгайд ветклиники «Хвост и лапы» в Figma. Первый шаг вёрстки — перенести его в CSS: переменные и компоненты.',
      goal: 'В :root объявите переменные: --color-primary (#2d6a4f), --color-primary-dark (#1b4332), --color-surface (#f1f7f4), --color-accent (#f4a261), --color-text (#1f2933) и --radius (8px). Цвет текста body — var(--color-text). Образцы цвета .swatch-… закрасьте своими цветами через переменные (текст на тёмных — белый). Кнопки: .btn — min-height 44px и скругление var(--radius); .btn-primary — фон var(--color-primary), белый текст; .btn-secondary — белый фон, рамка 2px и текст цвета var(--color-primary); .btn-primary:hover — фон var(--color-primary-dark); .btn:focus-visible — outline цвета акцента; .btn:disabled — серый фон и курсор not-allowed. Поле .input: шрифт 16px, высота от 44px, при фокусе (.input:focus-visible) — рамка outline.',
      hints: [
        'Переменная объявляется в :root { --color-primary: #2d6a4f; }, а используется так: background-color: var(--color-primary);',
        'Образец: .swatch-primary { background-color: var(--color-primary); color: #ffffff; }. На светлых образцах (фон блоков, акцент) текст оставьте тёмным.',
        'Вторичная кнопка: .btn-secondary { border: 2px solid var(--color-primary); background-color: #ffffff; color: var(--color-primary); }',
        'Выключенную кнопку опишите ниже :hover: .btn:disabled { border-color: #c9c9c9; background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }'
      ],
      html: `<section class="guide">
  <h1>Стайлгайд «Хвост и лапы»</h1>
  <h2>Цвета</h2>
  <ul class="palette">
    <li class="swatch swatch-primary">Основной #2d6a4f</li>
    <li class="swatch swatch-dark">Тёмный #1b4332</li>
    <li class="swatch swatch-surface">Фон блоков #f1f7f4</li>
    <li class="swatch swatch-accent">Акцент #f4a261</li>
  </ul>
  <h2>Кнопки</h2>
  <div class="buttons">
    <button class="btn btn-primary" type="button">Записаться</button>
    <button class="btn btn-secondary" type="button">Позвонить</button>
    <button class="btn btn-primary" type="button" disabled>Нет мест</button>
  </div>
  <h2>Поле ввода</h2>
  <label for="demo">Кличка питомца</label>
  <input class="input" id="demo" type="text">
</section>`,
      css: `${BASE}
.guide { max-width: 640px; }
.palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.swatch { padding: 32px 12px 12px; border-radius: 8px; border: 1px solid #d0d7de; }
.buttons { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: block; margin-bottom: 4px; font-weight: bold; }
.btn { padding: 10px 20px; }`,
      tests: [
        { name: 'В :root объявлены пять цветов --color-… и --radius', check: h => { const r = h.rules.find(x => x.selector === ':root'); if (!r) return 'нет правила :root'; const need = { '--color-primary': '#2d6a4f', '--color-primary-dark': '#1b4332', '--color-surface': '#f1f7f4', '--color-accent': '#f4a261', '--color-text': '#1f2933' }; for (const [k, v] of Object.entries(need)) if (r.style.getPropertyValue(k).trim().toLowerCase() !== v) return `${k}: «${r.style.getPropertyValue(k).trim()}», нужно ${v}`; return !!r.style.getPropertyValue('--radius').trim() || 'нет --radius'; } },
        { name: 'Цвет текста body — #1f2933 через var(--color-text)', check: h => h.cs('body', 'color') === rgb('#1f2933') && h.has(/color\s*:\s*var\(--color-text\)/) || `цвет ${h.cs('body', 'color')}` },
        { name: 'Образцы закрашены своими цветами через переменные', check: h => { for (const e of h.$$('.swatch')) { const hex = e.textContent.match(/#[0-9a-f]{6}/i)[0]; if (h.cs(e, 'background-color') !== rgb(hex)) return `«${e.textContent.trim()}»: фон ${h.cs(e, 'background-color')}`; } return h.occurrences('var(--color-') >= 6 || 'цвета записаны напрямую, а не через var(--color-…)'; } },
        { name: '.btn-primary: фон основного цвета, белый текст, высота от 44px, скругление var(--radius)', check: h => { const b = h.$('.btn-primary:not([disabled])'); const r = h.rect(b); return h.cs(b, 'background-color') === rgb('#2d6a4f') && h.cs(b, 'color') === rgb('#ffffff') && r.height >= 43.5 && h.px(b, 'border-top-left-radius') === 8 && h.has(/border-radius\s*:\s*var\(--radius\)/) || `фон ${h.cs(b, 'background-color')}, текст ${h.cs(b, 'color')}, высота ${Math.round(r.height)}px, скругление ${h.cs(b, 'border-top-left-radius')}`; } },
        { name: '.btn-secondary: белый фон, рамка 2px и текст основного цвета', check: h => { const b = h.$('.btn-secondary'); return h.cs(b, 'background-color') === rgb('#ffffff') && h.px(b, 'border-top-width') === 2 && h.cs(b, 'border-top-color') === rgb('#2d6a4f') && h.cs(b, 'color') === rgb('#2d6a4f') || `фон ${h.cs(b, 'background-color')}, рамка ${h.cs(b, 'border-top-width')} ${h.cs(b, 'border-top-color')}, текст ${h.cs(b, 'color')}`; } },
        { name: 'Состояния: :hover с тёмным фоном, :focus-visible с outline, :disabled серый', check: h => { const hov = ruleWith(h, /\.btn(-primary)?:hover/, 'background-color'); if (!hov || !/var\(--color-primary-dark\)|27, 67, 50/.test(hov.style.getPropertyValue('background-color'))) return 'нет :hover с фоном var(--color-primary-dark)'; if (!hasOutline(h, /\.btn:focus-visible/)) return 'нет .btn:focus-visible с outline'; const d = h.$('.btn:disabled'); return h.cs(d, 'background-color') !== rgb('#2d6a4f') && h.cs(d, 'cursor') === 'not-allowed' || 'выключенная кнопка выглядит как обычная'; } },
        { name: 'Поле .input: шрифт 16px, высота от 44px, :focus-visible с outline', check: h => { const r = h.rect('.input'); if (h.px('.input', 'font-size') < 16 || r.height < 43.5) return `шрифт ${h.px('.input', 'font-size')}px, высота ${Math.round(r.height)}px`; return hasOutline(h, /\.input:focus-visible/) || 'нет .input:focus-visible с outline'; } }
      ]
    },
    {
      id: 'k5502', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 2. Адаптивная главная страница', level: 'Сложное', minutes: 35, points: 200,
      story: 'Стайлгайд готов (он уже в CSS). Теперь — главная страница клиники по ТЗ: шапка, первый экран, услуги, подвал. Проверять будут на компьютере и на телефоне 360px.',
      goal: 'Замените div на семантические теги, сохранив классы: .header → header, .nav → nav (внутри header), .main → main, .footer → footer. Вёрстку пишите mobile first: на телефоне 360px нет горизонтальной прокрутки, текст не меньше 16px, карточки услуг в одну колонку, картинки не вылезают за карточку (max-width: 100%). На компьютере (@media (min-width: 768px)) логотип и меню стоят в один ряд, а три карточки услуг — в один ряд (grid). Кнопка «Записаться на приём» — не ниже 44px. Телефон в подвале — ссылка tel:.',
      hints: [
        'Семантика: <header class="header">…<nav class="nav" aria-label="Главное меню">…</nav></header>, <main class="main">, <footer class="footer">.',
        'Картинки: .card img { display: block; max-width: 100%; height: auto; }.',
        'Mobile first: .cards { display: grid; grid-template-columns: 1fr; gap: var(--space); } и в @media (min-width: 768px) — repeat(3, 1fr).',
        'Шапка на компьютере: .header { display: flex; justify-content: space-between; align-items: center; }. Телефон: <a href="tel:+74951234567">+7 495 123-45-67</a>.'
      ],
      html: `<div class="header">
  <p class="logo">Хвост и лапы</p>
  <div class="nav">
    <a href="#services">Услуги</a>
    <a href="#booking">Запись</a>
    <a href="#contacts">Контакты</a>
  </div>
</div>
<div class="main">
  <section class="hero">
    <h1>Ветклиника рядом с домом</h1>
    <p>Лечим кошек, собак и грызунов. Приём без очередей по записи, с 8:00 до 22:00 без выходных.</p>
    <a class="btn btn-primary" href="#booking">Записаться на приём</a>
  </section>
  <section class="services" id="services">
    <h2>Услуги</h2>
    <div class="cards">
      <article class="card"><img src="${IMG}" alt="Врач осматривает кошку" width="600" height="300"><h3>Осмотр терапевта</h3><p>Первичный приём и рекомендации — от 900 ₽.</p></article>
      <article class="card"><img src="${IMG}" alt="Собака на прививке" width="600" height="300"><h3>Прививки</h3><p>Комплексная вакцинация с паспортом — от 1500 ₽.</p></article>
      <article class="card"><img src="${IMG}" alt="Груминг шпица" width="600" height="300"><h3>Груминг</h3><p>Стрижка, когти, уши — от 1200 ₽.</p></article>
    </div>
  </section>
  <section class="booking" id="booking">
    <h2>Запись на приём</h2>
    <p>Форма записи появится в задании 3.</p>
  </section>
</div>
<div class="footer" id="contacts">
  <p>Москва, ул. Садовая, 12. Телефон: +7 495 123-45-67</p>
</div>`,
      css: `${GUIDE}
.logo { margin: 0; font-size: 22px; font-weight: bold; color: var(--color-primary); }
.nav a { color: var(--color-primary-dark); }
.card { width: 600px; }
.footer { background-color: var(--color-primary-dark); color: #ffffff; }`,
      tests: [
        { name: 'Семантика: header с nav внутри, main, footer', check: h => { if (h.count('header') !== 1 || !h.$('header nav')) return 'нужен header с nav внутри'; if (h.count('main') !== 1) return 'нужен один main'; if (h.count('footer') !== 1) return 'нужен footer'; return !h.$('div.header, div.nav, div.main, div.footer') || 'остались div с классами header/nav/main/footer'; } },
        { name: 'На 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || `ширина страницы ${h.doc.documentElement.scrollWidth}px` },
        { name: 'На телефоне текст не меньше 16px, карточки в одну колонку', at: 360, check: h => { const small = h.$$('p').find(p => h.px(p, 'font-size') < 16); if (small) return `текст ${h.px(small, 'font-size')}px`; const l = h.$$('.card').map(c => Math.round(c.getBoundingClientRect().left)); return new Set(l).size === 1 || 'карточки не в одну колонку'; } },
        { name: 'Картинки не вылезают за карточку', at: 360, check: h => h.$$('.card').every(c => h.inside(c.querySelector('img'), c)) || 'картинка шире карточки' },
        { name: 'На компьютере логотип и меню в один ряд', check: h => { const l = h.rect('.logo'), n = h.rect('nav'); return !!(l && n) && l.top < n.bottom && n.top < l.bottom && n.left >= l.right || 'логотип и меню на разных строках'; } },
        { name: 'На компьютере три карточки в один ряд, вёрстка mobile first (@media min-width)', check: h => { if (!h.sameRow(h.$$('.card'))) return 'карточки не в одном ряду'; return h.rules.some(r => /min-width/.test(r.media)) || 'нет @media (min-width: …)'; } },
        { name: 'Кнопка «Записаться на приём» не ниже 44px', at: 360, check: h => h.rect('.hero .btn').height >= 43.5 || `сейчас ${Math.round(h.rect('.hero .btn').height)}px` },
        { name: 'Телефон в подвале — ссылка tel:', check: h => !!h.$('footer a[href^="tel:"]') || 'нет ссылки tel: в footer' }
      ]
    },
    {
      id: 'k5503', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 3. Форма записи с проверкой', level: 'Сложное', minutes: 30, points: 200,
      story: 'Последняя часть страницы — форма записи на приём. Браузерные всплывашки отключены (novalidate), проверяет ваш JavaScript, а ошибки показываются рядом с полями.',
      goal: 'В HTML свяжите каждое поле с его сообщением об ошибке: aria-describedby="name-error" и т. д. В script.js при отправке формы #booking-form: отмените перезагрузку; проверьте поля — имя не пустое, в телефоне не меньше 11 цифр, почта содержит @ и точку, галочка согласия стоит. Если поле с ошибкой — текст ошибки в его .error (что не так и как исправить) и aria-invalid="true"; если верно — ошибку очистить и aria-invalid="false". Если всё верно — в #status «Спасибо, <имя>! Мы перезвоним в течение часа.». Сообщения об ошибках — цвета var(--color-error). На телефоне 360px поля во всю ширину формы.',
      hints: [
        'Только цифры телефона: phone.value.replace(/\\D/g, \'\') — убирает всё, что не цифра. Потом сравните .length с 11.',
        'Почта: email.value.includes(\'@\') && email.value.includes(\'.\').',
        'Чтобы не повторять код четыре раза, напишите функцию: function setError(input, errorEl, message) { errorEl.textContent = message; input.setAttribute(\'aria-invalid\', message ? \'true\' : \'false\'); }',
        'Итог: let ok = true; … если ошибка — ok = false; … if (ok) { statusText.textContent = \'Спасибо, \' + name.value.trim() + \'! Мы перезвоним в течение часа.\'; }'
      ],
      html: `<section class="booking" id="booking">
  <h2>Запись на приём</h2>
  <form class="form" id="booking-form" novalidate>
    <label for="name">Ваше имя</label>
    <input class="input" id="name" type="text" autocomplete="name">
    <p class="error" id="name-error"></p>
    <label for="phone">Телефон</label>
    <input class="input" id="phone" type="tel" autocomplete="tel" placeholder="+7 900 123-45-67">
    <p class="error" id="phone-error"></p>
    <label for="email">Почта</label>
    <input class="input" id="email" type="email" autocomplete="email">
    <p class="error" id="email-error"></p>
    <label class="check"><input id="agree" type="checkbox"> Согласен на обработку персональных данных</label>
    <p class="error" id="agree-error"></p>
    <button class="btn btn-primary" type="submit">Записаться</button>
    <p class="status" id="status" role="status"></p>
  </form>
</section>`,
      css: `${GUIDE}
.booking { padding: var(--space); background-color: var(--color-surface); }
.form { display: flex; flex-direction: column; gap: 4px; max-width: 480px; }
label { font-weight: bold; }
.check { display: flex; gap: 8px; align-items: center; font-weight: normal; }
.input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #6b7780; border-radius: var(--radius); }
.input:focus-visible { outline: 3px solid var(--color-accent); }
.error { margin: 0; font-size: 14px; }
.status { margin: 8px 0 0; font-weight: bold; color: var(--color-primary-dark); }`,
      js: `const form = document.querySelector('#booking-form');
const statusText = document.querySelector('#status');

// При отправке: preventDefault, проверка четырёх полей, ошибки рядом с полями, итоговое сообщение
`,
      tests: [
        { name: 'Каждое поле связано со своей ошибкой через aria-describedby', check: h => { for (const id of ['name', 'phone', 'email', 'agree']) if (h.$('#' + id)?.getAttribute('aria-describedby') !== id + '-error') return `у #${id} нет aria-describedby="${id}-error"`; return true; } },
        { name: 'Ошибки красные: цвет var(--color-error)', check: h => h.cs('.error', 'color') === rgb('#b3261e') || `цвет ошибок ${h.cs('.error', 'color')}` },
        { name: 'На телефоне поля во всю ширину формы', at: 360, check: h => { const f = h.rect('.form').width; const bad = h.$$('.input').find(i => i.getBoundingClientRect().width < f - 1); return !bad || `поле #${bad.id} уже формы`; } },
        { name: 'Пустая форма: без перезагрузки, четыре ошибки и aria-invalid="true"', js: true, check: async h => { if (h.submit('#booking-form') !== false) return 'нет preventDefault в обработчике submit'; await h.wait(); for (const id of ['name', 'phone', 'email', 'agree']) { if (h.text('#' + id + '-error').length < 5) return `нет ошибки у поля #${id}`; if (h.doc.querySelector('#' + id).getAttribute('aria-invalid') !== 'true') return `у #${id} нет aria-invalid="true"`; } return true; } },
        { name: 'Короткий телефон и почта без @ — ошибки только у них', js: true, check: async h => { h.type('#name', 'Ольга'); h.type('#phone', '12345'); h.type('#email', 'olga.mail.ru'); h.click('#agree'); h.submit('#booking-form'); await h.wait(); if (h.text('#name-error') || h.text('#agree-error')) return 'ошибка у верно заполненного поля'; if (!h.text('#phone-error')) return 'нет ошибки у короткого телефона'; if (!h.text('#email-error')) return 'нет ошибки у почты без @'; return !/спасибо/i.test(h.text('#status')) || 'при ошибках не должно быть «Спасибо»'; } },
        { name: 'Всё верно: ошибки очищены, aria-invalid="false", «Спасибо, <имя>!»', js: true, check: async h => { h.submit('#booking-form'); await h.wait(); h.type('#name', 'Ольга'); h.type('#phone', '+7 900 123-45-67'); h.type('#email', 'olga@mail.ru'); h.click('#agree'); h.submit('#booking-form'); await h.wait(); for (const id of ['name', 'phone', 'email', 'agree']) { if (h.text('#' + id + '-error')) return `осталась ошибка у #${id}`; if (h.doc.querySelector('#' + id).getAttribute('aria-invalid') !== 'false') return `у #${id} aria-invalid не "false"`; } const s = h.text('#status'); return /спасибо/i.test(s) && /Ольга/.test(s) || `статус: «${s}»`; } }
      ]
    }
  );
})();
