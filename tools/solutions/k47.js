/* Занятие 47: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4701: t => ({
      html: t.html,
      css: t.css.replace('/* Сюда — правило :root с переменными стайлгайда */', `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`)
    }),
    k4702: t => ({
      html: t.html,
      css: t.css + `.card { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }
.card h2 { margin-top: 0; }
.card-text { color: var(--color-muted); }
.badge { display: inline-block; padding: var(--space-1); border-radius: var(--radius); background: var(--color-accent); color: var(--color-text); }
.label { display: block; margin-bottom: var(--space-1); }
.field { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }
.btn { min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }
.btn-secondary { border-color: var(--color-primary); background: transparent; color: var(--color-primary); }
`
    }),
    k4703: t => ({
      html: t.html,
      css: `${BASE}
:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-text: #1d2433;
  --color-surface: #f2f5fa;
}
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--color-primary); }
.logo { margin: 0; color: var(--color-on-primary); font-weight: bold; }
.nav { display: flex; gap: 16px; }
.nav a { color: var(--color-on-primary); }
.hero { padding: 32px 24px; background: var(--color-surface); }
.hero h1 { margin: 0 0 16px; color: var(--color-text); }
.hero p { color: var(--color-text); }
.btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background: var(--color-primary); color: var(--color-on-primary); text-decoration: none; }
.btn:hover { background: var(--color-primary-dark); }
.footer { padding: 16px 24px; border-top: 4px solid var(--color-primary); color: var(--color-text); }
.footer a { color: var(--color-primary); }`
    })
  });
})();
