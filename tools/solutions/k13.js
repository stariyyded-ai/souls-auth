/* Занятие 13: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1301: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; }
h2 { color: #1f4e79; margin-top: 0; }
/* Правило для .card — ниже */
.card {
  box-sizing: border-box;
  width: 300px;
  padding: 16px 20px;
  border: 2px solid #1f4e79;
  border-radius: 8px;
  background-color: #f4f8fc;
  margin-bottom: 24px;
}
`
    }),
    k1302: t => ({
      html: t.html,
      css: `${BASE}
.block { border: 2px solid #1f4e79; padding: 16px; max-width: 520px; font-family: Georgia, serif; }
h2 { color: #1f4e79; margin-top: 0; }
p { color: #555555; }
.lead { color: #1d5c3a; font-size: 20px; }
.more { display: inline-block; padding: 8px 16px; margin-top: 12px; background-color: #1f4e79; color: #ffffff; }`
    }),
    k1303: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; margin-top: 0; }
p { line-height: 1.6; }
/* Правила для .page, .tag и .draft — ниже */
.page {
  box-sizing: border-box;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1ea;
}
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
  background-color: #1f4e79;
  color: #ffffff;
  border-radius: 4px;
}
.draft {
  display: none;
}
`
    })
  });
})();
