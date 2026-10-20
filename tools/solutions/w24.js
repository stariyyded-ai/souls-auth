/* Занятие 24: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2401: t => ({
      html: t.html,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { width: min(100% - 32px, 1100px); margin: 0 auto; }
h1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem); }
.requests { display: grid; grid-template-columns: 1fr; gap: 16px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 1.125rem; }
.request-card p { margin: 0; color: #64748b; }

@media (min-width: 768px) {
  .requests { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 1200px) {
  .requests { grid-template-columns: repeat(3, 1fr); }
}`
    }),
    w2402: t => ({
      html: t.html,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; padding: 8px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav { display: flex; flex-wrap: wrap; gap: 8px; }
.nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: #ffffff; font-size: 1.125rem; }
.page { padding: 24px 16px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card img { display: block; max-width: 100%; height: auto; }

@media (hover: hover) {
  .request-card:hover { box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }
}`
    })
  });
})();
