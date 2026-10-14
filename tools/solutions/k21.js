/* Занятие 21: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2101: t => ({
      html: t.html,
      css: `${BASE}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #1f2a44;
}
.header__logo {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.menu a {
  color: #ffffff;
  text-decoration: none;
}`
    }),
    k2102: t => ({
      html: t.html,
      css: `${BASE}
.plans__list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.plan {
  flex: 1 1 220px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.plan h3 {
  margin-top: 0;
}
.plan__price {
  margin-bottom: 0;
  font-weight: bold;
  color: #1f2a44;
}`
    }),
    k2103: t => ({
      html: t.html,
      css: `${BASE}
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #e8f0fe;
}
.notice {
  max-width: 320px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.notice__title {
  margin-top: 0;
  font-size: 28px;
}
.notice__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
}
.btn--light {
  background-color: #e8f0fe;
  color: #1a3d7a;
}`
    })
  });
})();
