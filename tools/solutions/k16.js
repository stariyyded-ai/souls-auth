/* Занятие 16: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1601: t => ({
      html: t.html,
      css: `${t.css}
.site-header {
  background-color: var(--color-dark);
  padding: 16px 24px;
}
.logo {
  display: inline-block;
  margin-right: 32px;
  color: var(--color-light);
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
}
.nav { display: inline-block; }
.nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav__item { display: inline-block; }
.nav__link {
  display: inline-block;
  padding: 8px 12px;
  color: var(--color-light);
  text-decoration: none;
}
.nav__link:hover { background-color: #34446b; }
.nav__link:focus-visible { outline: 3px solid var(--color-accent); }
.nav__link--active { border-bottom: 3px solid var(--color-accent); }`
    }),
    k1602: t => ({
      html: t.html,
      css: `${t.css}
.card {
  display: inline-block;
  vertical-align: top;
  width: 300px;
  margin: 0 16px 16px 0;
  padding: 24px;
  border: 1px solid #d0d7e2;
  border-radius: 12px;
  background-color: #ffffff;
}
.card__title {
  margin: 0 0 8px;
  font-size: 20px;
}
.card__price {
  font-size: 18px;
  font-weight: bold;
  color: #1f4e79;
}
.card--hit { border: 2px solid #b3541e; }
.card__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #b3541e;
  color: #ffffff;
  font-size: 14px;
}`
    }),
    k1603: t => ({
      html: t.html,
      css: `${t.css}
.button {
  margin-right: 8px;
  padding: 12px 24px;
  font-size: 16px;
  border: 2px solid #1f4e79;
  border-radius: 8px;
  background-color: #1f4e79;
  color: #ffffff;
  cursor: pointer;
}
.button:hover {
  background-color: #163a5a;
  border-color: #163a5a;
}
.button:focus-visible {
  outline: 3px solid #f2a541;
  outline-offset: 2px;
}
.button--secondary {
  background-color: #ffffff;
  color: #1f4e79;
}
.button--secondary:hover { background-color: #eef3f8; }
.button:disabled {
  background-color: #e1e5ea;
  border-color: #e1e5ea;
  color: #5a6470;
  cursor: not-allowed;
}
.site-footer {
  margin-top: 40px;
  padding: 24px;
  background-color: #1f2a44;
  color: #ffffff;
}
.site-footer__text {
  margin: 0;
  font-size: 14px;
}
.site-footer__link { color: #ffd166; }`
    })
  });
})();
