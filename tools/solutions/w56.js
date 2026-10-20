/* Занятие 56: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5601: t => ({
      html: t.html,
      css: `:root {
  --color-primary: #1f4fb8;
  --color-text: #1d1f24;
  --color-muted: #4b5563;
  --color-bg: #f6f7fb;
  --color-success: #146c43;
  --color-warning: #8a5a00;
  --color-danger: #b42318;
}
body { margin: 0; font-family: Arial, sans-serif; color: var(--color-text); background: var(--color-bg); }
.top { padding: 12px 16px; background: var(--color-primary); }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.admin { padding: 16px; }
.table { width: 100%; border-collapse: collapse; background: #ffffff; }
.table th, .table td { padding: 8px; border-bottom: 1px solid var(--color-muted); text-align: left; }
.table th { color: var(--color-muted); }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: var(--color-muted); color: #ffffff; font-size: 14px; }
.badge-new { background: var(--color-primary); }
.badge-work { background: var(--color-warning); }
.badge-done { background: var(--color-success); }
.badge-cancel { background: var(--color-muted); }
.btn-main { margin-top: 16px; padding: 8px 16px; border: 0; border-radius: 12px; background: var(--color-primary); color: #ffffff; font: inherit; cursor: pointer; }
.btn-main:hover { background: var(--color-text); }`,
      js: `// js/statuses.js
const STATUS = {
  new:       { text: 'Новая',     cls: 'badge-new' },
  in_work:   { text: 'В работе',  cls: 'badge-work' },
  done:      { text: 'Выполнена', cls: 'badge-done' },
  cancelled: { text: 'Отменена',  cls: 'badge-cancel' },
};

function renderBadge(el, status) {
  const s = STATUS[status] ?? { text: status, cls: '' };
  el.textContent = s.text;
  el.className = \`badge \${s.cls}\`;
}

document.querySelectorAll('[data-badge]').forEach((b) => renderBadge(b, b.textContent.trim()));
`
    })
  });
})();
