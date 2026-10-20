/* Занятие 27: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2701: t => ({
      html: t.html,
      css: t.css
        .replace('font-weight: 600; cursor: pointer; }', 'font-weight: 600; cursor: pointer; transition: background-color 0.2s ease, transform 0.15s ease; }')
        .replace('.btn:hover { background: var(--color-primary-dark); transition: all 1s; }', `.btn:hover { background: var(--color-primary-dark); }
.btn:active { transform: scale(0.97); }`)
        .replace('box-shadow: var(--shadow); }\n.request-card:hover { position: relative; top: -4px; }', `box-shadow: var(--shadow); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; }
.request-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }`)
    }),
    w2702: t => ({
      html: t.html,
      css: `${t.css
        .replace('color: #166534; }', 'color: #166534; animation: slide-down 0.3s ease-out both; }')
        .replace('box-shadow: var(--shadow); }', 'box-shadow: var(--shadow); animation: fade-up 0.4s ease-out both; }')}@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
.request-card:nth-child(2) { animation-delay: 80ms; }
.request-card:nth-child(3) { animation-delay: 160ms; }

@media (prefers-reduced-motion: reduce) {
  .request-card,
  .alert { animation: none; }
}
`
    })
  });
})();
