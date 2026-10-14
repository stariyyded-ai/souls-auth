/* Занятие 46. Визуализация элементов интерфейса */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  const TRANSPARENT = 'rgba(0, 0, 0, 0)';
  window.COURSE_TASKS.push(
    {
      id: 'k4601', lesson: 'mdk-46', module: 'mdk5', mech: 'build',
      title: 'Три вида кнопок', level: 'Среднее', minutes: 20, points: 150,
      story: 'Интернет-магазин канцтоваров собирает свой набор кнопок. На странице корзины три действия разной важности, а сейчас все кнопки выглядят как серые прямоугольники браузера.',
      goal: 'Напишите CSS. Общий класс .btn: высота не меньше 44px (min-height), рамка 2px solid transparent, border-radius не меньше 6px, шрифт 16px. .btn-primary: фон #1f5fa8, текст #ffffff. .btn-secondary: прозрачный фон (transparent), рамка цвета #1f5fa8, текст #1f5fa8. .btn-text: прозрачный фон, текст #1f5fa8, подчёркивание (text-decoration: underline), рамку не видно. Добавьте правило .btn-primary:hover с более тёмным фоном #174a84 и правило .btn:focus-visible с обводкой outline.',
      hints: [
        'Общее — в .btn: .btn { min-height: 44px; padding: 0 20px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; }.',
        'Вторичной кнопке нужно поменять только цвет рамки: .btn-secondary { border-color: #1f5fa8; background: transparent; color: #1f5fa8; }.',
        'Текстовой рамку не трогайте — она останется прозрачной из .btn. Достаточно фона, цвета и text-decoration.',
        'Состояния: .btn-primary:hover { background: #174a84; } и .btn:focus-visible { outline: 3px solid #1d2433; outline-offset: 2px; }.'
      ],
      html: `<h1>Корзина</h1>
<p>В корзине 3 товара на сумму 840 ₽.</p>
<div class="actions">
  <button class="btn btn-primary" type="button">Оформить заказ</button>
  <button class="btn btn-secondary" type="button">Продолжить покупки</button>
  <button class="btn btn-text" type="button">Очистить корзину</button>
</div>`,
      css: `${BASE}
.actions { display: flex; flex-wrap: wrap; gap: 12px; }`,
      tests: [
        { name: 'У всех кнопок высота не меньше 44px', check: h => { const b = h.$$('.btn'); return (b.length === 3 && b.every(e => e.getBoundingClientRect().height >= 43.5)) || 'нужен min-height: 44px у .btn'; } },
        { name: '.btn: рамка 2px, скругление от 6px, шрифт 16px', check: h => (h.px('.btn', 'border-top-width') === 2 && h.px('.btn', 'border-top-left-radius') >= 6 && h.px('.btn', 'font-size') === 16) || `рамка ${h.px('.btn', 'border-top-width')}px, скругление ${h.px('.btn', 'border-top-left-radius')}px, шрифт ${h.px('.btn', 'font-size')}px` },
        { name: 'Первичная: фон #1f5fa8, белый текст', check: h => (h.cs('.btn-primary', 'background-color') === rgb('#1f5fa8') && h.cs('.btn-primary', 'color') === rgb('#ffffff')) || 'проверьте фон и цвет .btn-primary' },
        { name: 'Вторичная: прозрачный фон, рамка и текст #1f5fa8', check: h => (h.cs('.btn-secondary', 'background-color') === TRANSPARENT && h.cs('.btn-secondary', 'border-top-color') === rgb('#1f5fa8') && h.cs('.btn-secondary', 'color') === rgb('#1f5fa8')) || 'проверьте фон, border-color и color .btn-secondary' },
        { name: 'Текстовая: прозрачный фон, без видимой рамки, подчёркнута, текст #1f5fa8', check: h => (h.cs('.btn-text', 'background-color') === TRANSPARENT && h.cs('.btn-text', 'border-top-color') === TRANSPARENT && /underline/.test(h.cs('.btn-text', 'text-decoration-line')) && h.cs('.btn-text', 'color') === rgb('#1f5fa8')) || 'проверьте фон, рамку, color и text-decoration .btn-text' },
        { name: 'Есть .btn-primary:hover с фоном #174a84', check: h => { const r = h.rules.find(x => x.selector === '.btn-primary:hover'); return !!(r && /174a84|rgb\(23, 74, 132\)/i.test(r.style.backgroundColor || r.style.background)) || 'нет правила .btn-primary:hover { background: #174a84; }'; } },
        { name: 'Есть .btn:focus-visible с обводкой outline', check: h => { const r = h.rules.find(x => x.selector === '.btn:focus-visible'); return !!(r && (r.style.outlineStyle || r.style.outline) && r.style.outlineStyle !== 'none') || 'нет правила .btn:focus-visible { outline: … }'; } }
      ]
    },
    {
      id: 'k4602', lesson: 'mdk-46', module: 'mdk5', mech: 'a11y',
      title: 'Панель с иконками и бейджем', level: 'Среднее', minutes: 20, points: 150,
      story: 'Нижняя панель приложения «Электронный дневник» состоит из четырёх одинаковых иконок без подписей. Студенты нажимают наугад, а на телефоне ещё и промахиваются: кнопки крошечные.',
      goal: 'В каждую кнопку .tab после иконки добавьте подпись span.label: «Расписание», «Оценки», «Уведомления», «Профиль». Иконкам поставьте alt="" (они теперь украшение). Кнопка — flex-колонка: иконка над подписью. Каждая кнопка не меньше 44×44 пикселей. В кнопку «Уведомления» после подписи добавьте бейдж span.badge с числом 3: фон #c62828, белый текст, шрифт не больше 14px, border-radius не меньше 8px.',
      hints: [
        'Разметка одной кнопки: <button class="tab" type="button"><img src="img/icon.svg" alt=""><span class="label">Расписание</span></button>.',
        'Иконка над подписью: .tab { display: flex; flex-direction: column; align-items: center; gap: 4px; }.',
        'Размер: .tab { min-width: 44px; min-height: 44px; } — даже если иконка 20×20.',
        'Бейдж: .badge { padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 12px; font-weight: bold; }.'
      ],
      html: `<h1>Дневник</h1>
<nav class="tabbar" aria-label="Разделы">
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
</nav>`,
      css: `${BASE}
.tabbar { display: flex; justify-content: space-around; padding: 8px 0; border-top: 1px solid #c4cad4; }
.tab { padding: 4px; border: 0; background: transparent; color: #1d2433; }
.tab img { width: 16px; height: 16px; }`,
      tests: [
        { name: 'В каждой из 4 кнопок есть подпись span.label', check: h => { const t = h.$$('.tab'); const ok = t.filter(b => (b.querySelector('.label')?.textContent.trim().length || 0) >= 4); return (t.length === 4 && ok.length === 4) || `с подписью: ${ok.length} из ${t.length}`; } },
        { name: 'Подписи: Расписание, Оценки, Уведомления, Профиль', check: h => h.$$('.tab .label').map(e => e.textContent.trim()).join('|') === 'Расписание|Оценки|Уведомления|Профиль' || `сейчас: ${h.$$('.tab .label').map(e => e.textContent.trim()).join(', ') || 'нет'}` },
        { name: 'У иконок пустой alt=""', check: h => { const i = h.$$('.tab img'); return (i.length === 4 && i.every(e => e.getAttribute('alt') === '')) || 'нужно alt="" у каждой иконки'; } },
        { name: 'Иконка стоит над подписью', check: h => { const t = h.$$('.tab'); return (t.length === 4 && t.every(b => { const i = b.querySelector('img'), l = b.querySelector('.label'); return i && l && i.getBoundingClientRect().bottom <= l.getBoundingClientRect().top + 1; })) || 'сделайте .tab flex-колонкой'; } },
        { name: 'Каждая кнопка не меньше 44×44', check: h => { const bad = h.$$('.tab').filter(b => { const r = b.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }); return !bad.length || `меньше 44×44: ${bad.length}`; } },
        { name: 'В кнопке «Уведомления» бейдж .badge с числом 3', check: h => { const b = h.$$('.tab')[2]; return (b?.querySelector('.badge')?.textContent.trim() === '3' && h.count('.badge') === 1) || 'нужен <span class="badge">3</span> в третьей кнопке'; } },
        { name: 'Бейдж: фон #c62828, белый текст, шрифт до 14px, скругление от 8px', check: h => (h.cs('.badge', 'background-color') === rgb('#c62828') && h.cs('.badge', 'color') === rgb('#ffffff') && h.px('.badge', 'font-size') <= 14 && h.px('.badge', 'border-top-left-radius') >= 8) || 'проверьте фон, цвет, размер шрифта и border-radius .badge' }
      ]
    },
    {
      id: 'k4603', lesson: 'mdk-46', module: 'mdk5', mech: 'build',
      title: 'Уведомление «Товар в корзине»', level: 'Среднее', minutes: 15, points: 150,
      story: 'Покупатель нажимает «В корзину» и не понимает, сработало или нет. Нужна обратная связь: всплывающее уведомление и счётчик-бейдж у корзины.',
      goal: 'В script.js: по клику на .add показывайте уведомление .toast (уберите hidden) и увеличивайте число в бейдже .cart-count на 1 (было 0 → 1 → 2…). По клику на крестик .toast-close уведомление снова прячется (hidden = true). Ошибок в консоли быть не должно.',
      hints: [
        'Найдите элементы через document.querySelector: .add, .toast, .toast-close, .cart-count.',
        'Показать и спрятать: toast.hidden = false; и toast.hidden = true;',
        'Счётчик: заведите let count = 0; при клике count = count + 1; cartCount.textContent = count;'
      ],
      html: `<header class="top">
  <p class="shop">Канцтовары</p>
  <p class="cart">Корзина <span class="cart-count">0</span></p>
</header>
<h1>Тетрадь в клетку, 96 листов</h1>
<p>Цена: 120 ₽</p>
<button class="add" type="button">В корзину</button>
<div class="toast" role="status" hidden>
  Товар добавлен в корзину
  <button class="toast-close" type="button" aria-label="Закрыть уведомление">×</button>
</div>`,
      css: `${BASE}
.top { display: flex; justify-content: space-between; align-items: center; }
.shop { font-weight: bold; }
.cart-count { display: inline-block; min-width: 20px; padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 13px; font-weight: bold; text-align: center; }
.add { min-height: 44px; padding: 0 20px; border: 0; border-radius: 8px; background: #1f5fa8; color: #ffffff; font-size: 16px; }
.toast { margin-top: 16px; padding: 8px 8px 8px 16px; border-radius: 8px; background: #1d2433; color: #ffffff; }
.toast-close { min-width: 44px; min-height: 44px; border: 0; background: transparent; color: #ffffff; font-size: 20px; }
[hidden] { display: none; }`,
      js: `// Ваш код здесь
`,
      tests: [
        { name: 'В начале уведомление спрятано, в корзине 0', js: true, check: h => (!h.visible('.toast') && h.text('.cart-count') === '0') || 'уведомление должно быть скрыто, счётчик 0' },
        { name: 'Клик «В корзину» показывает уведомление', js: true, check: h => { h.click('.add'); return h.visible('.toast') || 'после клика .toast не видно'; } },
        { name: 'Каждый клик увеличивает счётчик: 0 → 1 → 2', js: true, check: h => { h.click('.add'); const a = h.text('.cart-count'); h.click('.add'); const b = h.text('.cart-count'); return (a === '1' && b === '2') || `после кликов: ${a}, ${b}`; } },
        { name: 'Крестик прячет уведомление', js: true, check: h => { h.click('.add'); h.click('.toast-close'); return !h.visible('.toast') || 'после крестика уведомление видно'; } },
        { name: 'После закрытия «В корзину» снова показывает уведомление', js: true, check: h => { h.click('.add'); h.click('.toast-close'); h.click('.add'); return h.visible('.toast') || 'уведомление не появилось второй раз'; } },
        { name: 'В консоли нет ошибок', js: true, check: h => { h.click('.add'); h.click('.toast-close'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
