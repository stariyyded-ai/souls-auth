/* Занятие 38: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3801: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: var(--color-text); background: var(--color-bg); }
:root {
  --color-bg: #faf6f0;
  --color-surface: #e8d9c5;
  --color-text: #3b2a1e;
  --color-accent: #b5462a;
}
.palette {
  display: flex;
  gap: 16px;
  padding: 0;
  list-style: none;
}
.swatch {
  width: 120px;
  height: 120px;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
.swatch--bg {
  background-color: var(--color-bg);
}
.swatch--surface {
  background-color: var(--color-surface);
}
.swatch--text {
  background-color: var(--color-text);
  color: var(--color-bg);
}
.swatch--accent {
  background-color: var(--color-accent);
  color: #ffffff;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--color-accent);
  color: #ffffff;
}`
    }),
    k3802: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: var(--color-main); }
:root {
  --color-main: #f4f7f6;
  --color-second: #1f4e5f;
  --color-accent: #ff7a3d;
}
.header,
.footer {
  padding: 16px 24px;
  background-color: var(--color-second);
  color: #ffffff;
}
.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
.hero,
.cards {
  padding: 24px;
}
.card {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-top: 4px solid var(--color-second);
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  background-color: var(--color-accent);
  color: #1a1a1a;
}`
    }),
    k3803: t => ({
      html: t.html,
      css: t.css.replace(/\/\* Закрасьте[^\n]*\n?/, '') + `
.mono-1 { background-color: var(--c6); }
.mono-2 { background-color: var(--c3); }
.mono-3 { background-color: var(--c9); }
.analog-1 { background-color: var(--c4); }
.analog-2 { background-color: var(--c7); }
.analog-3 { background-color: var(--c1); }
.compl-1 { background-color: var(--c2); }
.compl-2 { background-color: var(--c5); }
.compl-3 { background-color: var(--c8); }`
    })
  });
})();
