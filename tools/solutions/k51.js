/* Занятие 51: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5101: t => ({
      html: t.html,
      css: `${BASE}
.page { max-width: 960px; margin: 0 auto; font-size: 16px; }
.top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; }
.logo { font-weight: bold; }
.menu { display: flex; flex-wrap: wrap; gap: 8px; }
.menu a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; font-size: 16px; color: #1f5f8b; }
.btn { display: block; min-height: 48px; padding: 12px 16px; font-size: 18px; text-align: center; background-color: #8a3b12; color: #ffffff; text-decoration: none; border-radius: 8px; }
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; margin: 24px 0; }
.card { padding: 16px; border: 1px solid #d0d7de; border-radius: 12px; }
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
  .btn { display: inline-block; }
}`
    }),
    k5102: t => ({
      html: `<form class="order" id="order">
  <h2>Заказ обеда</h2>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="name">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel" autocomplete="tel">
  <label for="email">Почта для чека</label>
  <input id="email" name="email" type="email" autocomplete="email">
  <label for="code">Код из СМС</label>
  <input id="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code">
  <label for="time">Ко скольки приготовить</label>
  <input id="time" name="time" type="time">
  <button class="btn" type="submit">Заказать</button>
</form>`,
      css: `${BASE}
.order { max-width: 420px; }
label { display: block; margin: 12px 0 4px; font-weight: bold; }
input { width: 100%; box-sizing: border-box; min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 6px; }
.btn { width: 100%; min-height: 48px; margin-top: 16px; padding: 12px; font-size: 16px; border: none; border-radius: 8px; background-color: #8a3b12; color: #ffffff; }`
    }),
    k5103: t => ({
      html: t.html.replace('<a href="#schedule">', '<a href="#schedule" aria-current="page">'),
      css: `${BASE}
.content { padding-bottom: 88px; }
.tabbar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; background-color: #ffffff; border-top: 1px solid #d0d7de; }
.tabbar a { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-height: 56px; color: #57606a; font-size: 12px; text-decoration: none; }
.tabbar a[aria-current="page"] { color: #1f5f8b; font-weight: bold; }
.tabbar img { width: 24px; height: 24px; }
@media (min-width: 768px) {
  .tabbar { position: static; border-top: none; border-bottom: 1px solid #d0d7de; }
  .tabbar a { flex: 0 0 120px; }
  .content { padding-bottom: 24px; }
}`
    })
  });
})();
