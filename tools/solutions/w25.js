/* Занятие 25: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2501: t => ({
      html: t.html,
      css: `${t.css}.request-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-1); margin-bottom: var(--space-1); }
.request-card__title { margin: 0; font-size: 1.125rem; }
.request-card__info { display: grid; grid-template-columns: 80px 1fr; gap: 4px var(--space-1); margin: 0; font-size: var(--fs-small); }
.request-card__info dt { color: var(--color-muted); }
.request-card__info dd { margin: 0; }
.request-card__reason { margin: var(--space-1) 0 0; padding: var(--space-1); border-left: 3px solid var(--status-cancel); background: #fef2f2; font-size: var(--fs-small); }

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: #ffffff;
}
.badge--new { background: var(--status-new); }
.badge--work { background: var(--status-work); color: #1f2937; }
.badge--done { background: var(--status-done); }
.badge--cancel { background: var(--status-cancel); }
`
    }),
    w2502: t => ({
      html: t.html.replace(/<th>/g, '<th scope="col">'),
      css: `${t.css}.table-wrap { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th,
.admin-table td { padding: var(--space-1); text-align: left; border-bottom: 1px solid var(--color-border); }

@media (max-width: 767px) {
  .admin-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .admin-table tr { display: block; margin-bottom: var(--space-2); background: var(--color-surface); border-radius: var(--radius); box-shadow: var(--shadow); }
  .admin-table td { display: grid; grid-template-columns: 90px 1fr; gap: var(--space-1); }
  .admin-table td::before { content: attr(data-label); font-weight: 600; color: var(--color-muted); }
}
`
    })
  });
})();
