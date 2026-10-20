/* Занятие 20: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2001: () => ({
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Мои заявки</h1>
  <article class="card">
    <h2>Генеральная уборка</h2>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav { display: flex; gap: 16px; }
.nav a { color: #ffffff; }
.page { padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 28px; }
.card { width: 100%; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.card h2 { margin: 0 0 8px; font-size: 18px; }`
    }),
    w2002: t => ({
      html: t.html,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 28px; }
.requests { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.request-card { padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.request-info { display: grid; grid-template-columns: 100px 1fr; gap: 4px 12px; margin: 0; }
.request-info dt { color: #64748b; }
.request-info dd { margin: 0; }
`
    })
  });
})();
