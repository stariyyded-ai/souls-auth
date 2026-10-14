/* Занятие 44: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4401: t => ({
      html: t.html,
      css: `${BASE}
article { max-width: 65ch; margin: 0 auto; }
h1, h2 { font-family: Georgia, "Times New Roman", serif; line-height: 1.2; }
h1 { font-size: 40px; margin: 0 0 16px; }
h2 { font-size: 26px; margin: 40px 0 12px; }
p { font-size: 18px; line-height: 1.6; margin: 0 0 16px; }`
    }),
    k4402: t => ({
      html: `<h1>Кофейня «Зерно»</h1>
<section class="group">
  <h2>Кофе</h2>
  <ul class="menu">
    <li class="item"><span>Американо</span> <span class="price">120 ₽</span></li>
    <li class="item"><span>Капучино</span> <span class="price">160 ₽</span></li>
    <li class="item"><span>Латте</span> <span class="price">170 ₽</span></li>
  </ul>
</section>
<section class="group">
  <h2>Выпечка</h2>
  <ul class="menu">
    <li class="item"><span>Круассан</span> <span class="price">110 ₽</span></li>
    <li class="item"><span>Сырник</span> <span class="price">90 ₽</span></li>
  </ul>
</section>`,
      css: `${BASE}
.group { max-width: 360px; }
h2 { margin: 32px 0 8px; }
.menu { margin: 0; padding: 0; list-style: none; }
.item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #dddddd; }
.price { font-weight: bold; color: #8a3b12; }`
    }),
    k4403: t => ({
      html: t.html,
      css: `${BASE}
.event { max-width: 420px; padding: 24px; border: 1px solid #d0d7e2; border-radius: 12px; }
.date, .title, .text { margin: 0 0 8px; font-size: 16px; }
.date { font-size: 14px; color: #5a6475; }
.title { font-size: 28px; line-height: 1.2; }
.text { margin-bottom: 16px; line-height: 1.5; }
.actions { display: flex; gap: 12px; }
.btn { display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; }
.btn-main { border: 2px solid #1f5fa8; background: #1f5fa8; color: #ffffff; }
.btn-more { border: 2px solid #1f5fa8; background: transparent; color: #1f5fa8; }`
    })
  });
})();
