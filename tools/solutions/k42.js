/* Занятие 42: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4201: t => ({
      html: t.html,
      css: t.css
        .replace('.header {\n', '.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n')
        + `
.hero__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
.hero__bottom p {
  max-width: 400px;
}`
    }),
    k4202: t => ({
      html: t.html,
      css: `${BASE}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 8px 16px;
  border: 2px solid #2e7d32;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
}
.btn--primary {
  background-color: #2e7d32;
  color: #ffffff;
}
.btn--secondary {
  background-color: transparent;
  color: #2e7d32;
}
.link-more {
  color: #1f4e5f;
  text-decoration: underline;
}`
    }),
    k4203: t => ({
      html: t.html,
      css: t.css,
      js: `const buttons = document.querySelectorAll('.fav');
const status = document.querySelector('.status');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    if (pressed) {
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'В избранное';
      status.textContent = 'Книга убрана из избранного';
    } else {
      button.setAttribute('aria-pressed', 'true');
      button.textContent = 'В избранном';
      status.textContent = 'Книга добавлена в избранное';
    }
  });
}
`
    })
  });
})();
