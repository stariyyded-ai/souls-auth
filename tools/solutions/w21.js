/* Занятие 21: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2101: t => ({
      html: t.html,
      css: `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-on-primary: #ffffff;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #cbd5e1;
  --radius: 12px;
  --space-2: 16px;
  --space-3: 24px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: var(--color-text); background: var(--color-bg); }
.header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-2); background: var(--color-primary); }
.header a { color: var(--color-on-primary); text-decoration: none; }
.nav { display: flex; gap: var(--space-2); }
.page { padding: var(--space-3) var(--space-2); }
.muted { color: var(--color-muted); }
.btn { padding: 12px var(--space-3); border: 0; border-radius: var(--radius); background: var(--color-primary); color: var(--color-on-primary); font: inherit; cursor: pointer; }
.btn:hover { background: var(--color-primary-dark); }
.card { margin-top: var(--space-3); padding: var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); }
.card h2 { margin: 0 0 8px; color: var(--color-primary); }`
    }),
    w2102: t => ({
      html: t.html,
      css: `${t.css}.page { width: 100%; max-width: 480px; margin: 0 auto; padding: var(--space-3) var(--space-2); }
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  padding: 0 var(--space-3);
  border: none;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.btn:hover { background: var(--color-primary-dark); }
.btn--block { width: 100%; }
.btn--outline { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
.card { background: var(--color-surface); border-radius: var(--radius); box-shadow: var(--shadow); padding: var(--space-2); }
`
    })
  });
})();
