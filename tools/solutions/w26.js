/* Занятие 26: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2601: t => ({
      html: t.html.replace('<div class="requests">', '<div class="requests row g-3">').replace(/ {6}<div>\n/g, '      <div class="col-12 col-md-6">\n'),
      css: `${t.css}:root {
  --bs-primary: #0f766e;
  --bs-primary-rgb: 15, 118, 110;
  --bs-border-radius: 12px;
}
.btn-primary {
  --bs-btn-bg: #0f766e;
  --bs-btn-border-color: #0f766e;
  --bs-btn-hover-bg: #115e59;
}
`
    })
  });
})();
