/* Занятие 23: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2301: t => ({
      html: t.html,
      css: `${t.css}.form { display: flex; flex-direction: column; gap: var(--space-2); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-weight: 600; font-size: var(--fs-small); }
.field__input {
  width: 100%;
  min-height: 48px;
  padding: 0 var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 16px;
}
.field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; border-color: var(--color-primary); }
.field__hint { margin: 0; font-size: var(--fs-small); color: var(--color-muted); }
.field__error { margin: 0; font-size: var(--fs-small); color: var(--color-error); }
.field--error .field__input { border-color: var(--color-error); }
`
    }),
    w2302: t => ({
      html: t.html
        .replace('<div class="alert alert--error">', '<div class="alert alert--error" role="alert">')
        .replace('id="login" name="login" required>', 'id="login" name="login" required autocomplete="username">')
        .replace('id="password" name="password" required>', 'id="password" name="password" required autocomplete="current-password">'),
      css: `${t.css}.page--auth { min-height: 100dvh; display: flex; flex-direction: column; justify-content: center; }
.alert { margin-bottom: var(--space-2); padding: 12px var(--space-2); border-radius: var(--radius); font-size: var(--fs-small); }
.alert--error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.auth__link { text-align: center; }
`
    })
  });
})();
