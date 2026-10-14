/* Занятие 46: эталонные решения */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4601: t => ({
      html: t.html,
      css: `${BASE}
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
.btn { min-height: 44px; padding: 0 20px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; cursor: pointer; }
.btn:focus-visible { outline: 3px solid #1d2433; outline-offset: 2px; }
.btn-primary { background: #1f5fa8; color: #ffffff; }
.btn-primary:hover { background: #174a84; }
.btn-secondary { border-color: #1f5fa8; background: transparent; color: #1f5fa8; }
.btn-text { background: transparent; color: #1f5fa8; text-decoration: underline; }`
    }),
    k4602: t => ({
      html: `<h1>Дневник</h1>
<nav class="tabbar" aria-label="Разделы">
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Расписание</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Оценки</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Уведомления</span><span class="badge">3</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Профиль</span></button>
</nav>`,
      css: `${BASE}
.tabbar { display: flex; justify-content: space-around; padding: 8px 0; border-top: 1px solid #c4cad4; }
.tab { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 44px; min-height: 44px; padding: 4px; border: 0; background: transparent; color: #1d2433; }
.tab img { width: 20px; height: 20px; }
.label { font-size: 13px; }
.badge { padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 12px; font-weight: bold; }`
    }),
    k4603: t => ({
      html: t.html,
      css: t.css,
      js: `const add = document.querySelector('.add');
const toast = document.querySelector('.toast');
const close = document.querySelector('.toast-close');
const cartCount = document.querySelector('.cart-count');
let count = 0;

add.addEventListener('click', () => {
  count = count + 1;
  cartCount.textContent = count;
  toast.hidden = false;
});

close.addEventListener('click', () => {
  toast.hidden = true;
});
`
    })
  });
})();
