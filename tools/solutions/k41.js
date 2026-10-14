/* Занятие 41: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4101: t => ({
      html: t.html,
      css: t.css.replace('  font-size: 16px;\n}', '  font-size: 16px;\n  display: none;\n}') + `
@media (max-width: 767px) {
  .header {
    gap: 8px;
    padding: 8px;
  }
  .nav {
    display: none;
  }
  .burger {
    display: block;
  }
}`
    }),
    k4102: t => ({
      html: t.html,
      css: t.css + `
@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .news {
    order: 2;
  }
  .cards {
    grid-template-columns: 1fr;
  }
}`
    }),
    k4103: t => ({
      html: t.html,
      css: t.css + `
@media (max-width: 767px) {
  .screen {
    flex-direction: column;
  }
  .tips {
    display: none;
  }
  .row {
    flex-direction: column;
    gap: 0;
  }
  input {
    width: 100%;
    box-sizing: border-box;
  }
  .btn {
    width: 100%;
  }
}`
    })
  });
})();
