/* Занятие 57. ЛР35. Анимация интерфейса: карточки, модальные окна, уведомления */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5701', lesson: 'm9-lr35', module: 'mdk96', mech: 'build', title: 'Окно «Подробнее о заявке»', level: 'Сложное', minutes: 30, points: 200,
      story: 'На странице «Мои заявки» портала у карточки есть кнопка «Подробнее». Пусть она открывает окно на <dialog>, которое плавно выезжает и так же плавно уходит — эксперт на экзамене кликнет и сразу увидит анимацию.',
      goal: 'CSS: окну .modal-anim с атрибутом open задайте анимацию появления (@keyframes modal-in) длительностью не больше 0.3s, а окну с классом is-closing — анимацию ухода modal-out (до 0.3s, с forwards). В @keyframes меняйте только transform и opacity. JS: функция openModal(dialog) вызывает showModal(); closeModal(dialog, value) добавляет класс is-closing, ждёт событие animationend, затем убирает класс и вызывает dialog.close(value). Кнопка с data-open="id" открывает окно с этим id (один обработчик click на document и closest). Окно закрывается с анимацией тремя способами: кнопкой «Понятно» (у неё атрибут data-close), клавишей Esc (событие cancel: вызовите e.preventDefault(), иначе браузер закроет окно мгновенно) и щелчком по затемнённому фону (e.target === dialog).',
      hints: [
        'CSS: .modal-anim[open] { animation: modal-in .25s ease-out; } .modal-anim.is-closing { animation: modal-out .2s ease-in forwards; } и два @keyframes: modal-in { from { opacity: 0; transform: translateY(24px) scale(.97); } }, modal-out { to { … то же … } }',
        'Открытие: document.addEventListener(\'click\', (e) => { const opener = e.target.closest(\'[data-open]\'); if (opener) openModal(document.getElementById(opener.dataset.open)); });',
        'closeModal: dialog.classList.add(\'is-closing\'); dialog.addEventListener(\'animationend\', () => { dialog.classList.remove(\'is-closing\'); dialog.close(value); }, { once: true });',
        'Для каждого dialog.modal-anim: cancel → e.preventDefault(); closeModal(dialog, \'cancel\'); click → if (e.target === dialog) closeModal(dialog, \'cancel\'); кнопка: dialog.querySelector(\'[data-close]\').addEventListener(\'click\', () => closeModal(dialog, \'ok\'));'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <article class="request-card">
    <h2>Заявка №15 · Уборка квартиры</h2>
    <p>Статус: в работе. Создана 12.10.2026.</p>
    <button class="btn" type="button" data-open="details-dialog">Подробнее</button>
  </article>
</main>
<dialog id="details-dialog" class="modal-anim" aria-labelledby="details-title">
  <h2 id="details-title">Заявка №15</h2>
  <p>Адрес: улица Студенческая, 5, квартира 12. Мастер приедет с 10:00 до 12:00.</p>
  <button class="btn" type="button" data-close>Понятно</button>
</dialog>`,
      css: `${BASE}
.page { max-width: 560px; }
.request-card { padding: 16px; border: 1px solid #d0d5dd; border-radius: 12px; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.modal-anim { max-width: min(90vw, 360px); padding: 24px; border: 0; border-radius: 12px; }
.modal-anim::backdrop { background: rgb(0 0 0 / 0.45); }
.modal-anim h2 { margin-top: 0; }
/* Ниже — анимация открытия и закрытия окна */
`,
      js: `// Модальное окно с анимацией
// 1. openModal(dialog) и closeModal(dialog, value)

// 2. Кнопки с data-open открывают своё окно (один обработчик на document)

// 3. Для каждого dialog.modal-anim: Esc (cancel), щелчок по фону, кнопка data-close
`,
      tests: [
        { name: 'Кнопка «Подробнее» открывает окно', js: true, check: h => { h.click('[data-open]'); return h.$('#details-dialog').open || 'окно не открылось: нужен showModal()'; } },
        { name: 'У открытого окна есть анимация не длиннее 0.3s', js: true, check: h => {
          h.click('[data-open]');
          const name = h.cs('#details-dialog', 'animation-name'), dur = parseFloat(h.cs('#details-dialog', 'animation-duration'));
          if (!name || name === 'none') return 'у .modal-anim[open] нет animation';
          return dur > 0 && dur <= 0.3 || `длительность ${dur}s, нужно до 0.3s`;
        } },
        { name: 'В @keyframes меняются только transform и opacity', check: h => {
          const frames = h.css.match(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g) || [];
          if (frames.length < 2) return 'нужны два @keyframes: modal-in и modal-out';
          const bad = frames.join(' ').match(/\b(top|left|right|bottom|width|height|margin[\w-]*)\s*:/);
          return !bad || `в @keyframes анимируется ${bad[1]} — используйте transform`;
        } },
        { name: 'Кнопка «Понятно»: сначала класс is-closing, после animationend окно закрыто', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          h.click('[data-close]');
          if (!d.open) return 'окно закрылось мгновенно, анимация не видна';
          if (!d.classList.contains('is-closing')) return 'нет класса is-closing';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          if (d.open) return 'после animationend окно не закрылось';
          return !d.classList.contains('is-closing') || 'после закрытия уберите класс is-closing';
        } },
        { name: 'Esc закрывает окно с анимацией', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          d.dispatchEvent(new Event('cancel', { cancelable: true }));
          if (!d.classList.contains('is-closing')) return 'по Esc (событие cancel) нет класса is-closing';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          return !d.open || 'по Esc окно не закрылось';
        } },
        { name: 'Щелчок по затемнённому фону закрывает окно, по тексту — нет', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          h.click('#details-dialog p');
          if (d.classList.contains('is-closing')) return 'окно закрывается от щелчка по тексту внутри';
          h.click(d);
          if (!d.classList.contains('is-closing')) return 'щелчок по фону не запустил закрытие';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          return !d.open || 'щелчок по фону не закрыл окно';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('[data-open]'); h.click('[data-close]'); h.$('#details-dialog').dispatchEvent(new AnimationEvent('animationend')); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'w5702', lesson: 'm9-lr35', module: 'mdk96', mech: 'build', title: 'Уведомление «Заявка создана»', level: 'Среднее', minutes: 25, points: 150,
      story: 'После создания заявки портал должен мягко сказать «Заявка создана» в углу экрана и через пару секунд сам убрать сообщение. Программа экранного чтения тоже должна его произнести.',
      goal: 'CSS: в правиле .toast задайте прозрачность 0 и сдвиг вниз (transform), transition только для opacity и transform, не дольше 0.3s; у .toast.is-shown opacity: 1 и transform: none; .toast--error — красный фон #b42318. Добавьте @media (prefers-reduced-motion: reduce), где у .toast transition-duration почти ноль (0.01ms). JS: функция showToast(text, type = \'success\', ms = 3000) создаёт div с классами toast и toast--ТИП, кладёт текст через textContent, добавляет в #toasts, на следующем кадре (requestAnimationFrame) вешает is-shown, а через ms миллисекунд убирает is-shown и после transitionend удаляет элемент. Кнопка #create показывает «Заявка создана», кнопка #fail — «Не удалось отправить заявку» с типом error.',
      hints: [
        'В готовое правило .toast допишите: opacity: 0; transform: translateY(12px); transition: opacity .25s, transform .25s; ниже — .toast.is-shown { opacity: 1; transform: none; }',
        'В конце CSS: @media (prefers-reduced-motion: reduce) { .toast { transition-duration: 0.01ms; } }',
        'Создание: const toast = document.createElement(\'div\'); toast.className = `toast toast--${type}`; toast.textContent = text; box.append(toast); requestAnimationFrame(() => toast.classList.add(\'is-shown\'));',
        'Исчезновение: setTimeout(() => { toast.classList.remove(\'is-shown\'); toast.addEventListener(\'transitionend\', () => toast.remove(), { once: true }); }, ms);'
      ],
      html: `<main class="page">
  <h1>Новая заявка</h1>
  <p>Нажмите кнопку, чтобы проверить уведомления.</p>
  <button class="btn" id="create" type="button">Создать заявку</button>
  <button class="btn btn-ghost" id="fail" type="button">Сымитировать ошибку</button>
</main>
<div id="toasts" class="toasts" aria-live="polite"></div>`,
      css: `${BASE}
.btn { padding: 10px 18px; border: 2px solid #1f4fb8; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn-ghost { background: #ffffff; color: #1f4fb8; }
.toasts { position: fixed; right: 16px; bottom: 16px; left: 16px; display: grid; gap: 8px; }
.toast { padding: 12px 16px; border-radius: 10px; background: #1d1f24; color: #ffffff; }
.toast--success { background: #146c43; }
/* Ниже — состояние is-shown, цвет ошибки и prefers-reduced-motion */
`,
      js: `// Уведомления
// 1. showToast(text, type = 'success', ms = 3000)

// 2. Кнопки #create и #fail
`,
      tests: [
        { name: 'showToast создаёт в #toasts уведомление с классами toast и toast--тип', js: true, check: h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          show('Проверка', 'error', 3000);
          const t = h.$('#toasts .toast'); if (!t) return 'в #toasts не появился .toast';
          return t.classList.contains('toast--error') && h.text(t) === 'Проверка' || 'нужны класс toast--error и текст «Проверка»';
        } },
        { name: 'Класс is-shown появляется на следующем кадре, а не сразу', js: true, check: async h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          h.win.requestAnimationFrame = cb => setTimeout(cb, 16);
          show('Кадр');
          const t = h.$('#toasts .toast'); if (!t) return 'уведомление не создано';
          if (t.classList.contains('is-shown')) return 'is-shown добавлен сразу: оберните в requestAnimationFrame';
          await h.wait(80);
          return t.classList.contains('is-shown') || 'is-shown так и не появился';
        } },
        { name: 'Через ms класс is-shown снимается, после transitionend элемент удалён', js: true, check: async h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          h.win.requestAnimationFrame = cb => setTimeout(cb, 16);
          show('Пока', 'success', 150);
          await h.wait(80);
          const t = h.$('#toasts .toast');
          if (!t || !t.classList.contains('is-shown')) return 'уведомление не показалось';
          await h.wait(150);
          if (t.classList.contains('is-shown')) return 'через ms класс is-shown не снят';
          if (!t.isConnected) return 'элемент удалён сразу, анимация исчезновения не видна: ждите transitionend';
          t.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'opacity' }));
          return !t.isConnected || 'после transitionend уведомление осталось на странице';
        } },
        { name: 'Текст выводится как текст, не как HTML', js: true, check: h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          show('<b>жирный</b>');
          return !h.$('#toasts b') && h.text('#toasts .toast') === '<b>жирный</b>' || 'используйте textContent, а не innerHTML';
        } },
        { name: 'Кнопки «Создать заявку» и «Сымитировать ошибку» показывают уведомления', js: true, check: h => {
          h.click('#create'); h.click('#fail');
          const t = h.$$('#toasts .toast');
          if (t.length !== 2) return `уведомлений: ${t.length}, нужно 2`;
          if (h.text(t[0]) !== 'Заявка создана') return `первое: «${h.text(t[0])}»`;
          return t[1].classList.contains('toast--error') && h.text(t[1]) === 'Не удалось отправить заявку' || 'второе должно быть toast--error с текстом «Не удалось отправить заявку»';
        } },
        { name: 'Ошибка — красная #b42318', js: true, check: h => {
          h.click('#fail');
          const t = h.$('#toasts .toast'); if (!t) return 'уведомление не появилось';
          return h.cs(t, 'background-color') === 'rgb(180, 35, 24)' || `фон ошибки: ${h.cs(t, 'background-color')}`;
        } },
        { name: 'CSS: скрытое состояние и transition только для opacity и transform', check: h => {
          const r = h.rules.find(x => x.selector === '.toast' && !x.media && /opacity|transform/.test(x.style.transitionProperty));
          if (!r) return 'у .toast нет transition для opacity и transform';
          if (r.style.transitionProperty.split(',').some(p => !/^\s*(opacity|transform)\s*$/.test(p))) return `transition: ${r.style.transitionProperty}`;
          if (r.style.transitionDuration.split(',').some(d => parseFloat(d) > 0.3 && !/ms/.test(d))) return 'длительность больше 0.3s';
          if (r.style.opacity !== '0') return 'у .toast без is-shown должна быть opacity: 0';
          const shown = h.rules.find(x => x.selector === '.toast.is-shown' && !x.media);
          return shown && shown.style.opacity === '1' && shown.style.transform === 'none' || 'у .toast.is-shown нужны opacity: 1 и transform: none';
        } },
        { name: 'Есть @media (prefers-reduced-motion: reduce) для .toast', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media) && /\.toast/.test(r.selector)) || 'добавьте медиазапрос prefers-reduced-motion' }
      ]
    }
  );
})();
