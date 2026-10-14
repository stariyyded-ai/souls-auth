/* Занятие 15: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1501: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; font-size: 18px; line-height: 1.6; color: #222222; background: #ffffff; }
.article {
  max-width: 680px;
  margin: 0 auto;
}
h1, h2 { font-family: Georgia, "Times New Roman", serif; }
.article__title {
  font-size: 36px;
  line-height: 1.2;
  margin: 0 0 16px;
}
h2 {
  font-size: 26px;
  margin: 32px 0 12px;
}
p { margin: 0 0 16px; }
.article__lead {
  font-size: 22px;
  color: #444444;
}`
    }),
    k1502: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }
:root {
  --color-text: #222222;
  --color-brand: #1f4e79;
  --color-muted: #595959;
  --color-note-bg: #fff4cc;
}
.article { max-width: 680px; margin: 0 auto; line-height: 1.6; }
h1 { color: var(--color-brand); }
.article__meta { color: var(--color-muted); font-size: 14px; }
.article a { color: var(--color-brand); text-decoration: underline; }
.article a:hover { color: var(--color-text); }
.article a:focus-visible { outline: 3px solid #f2a541; }
.article__note { background-color: var(--color-note-bg); color: var(--color-text); padding: 12px 16px; }`
    }),
    k1503: t => ({
      html: t.html,
      css: `${t.css}
.quote {
  margin: 24px 0;
  padding: 16px 24px;
  border-left: 4px solid #1f4e79;
  background-color: #eef3f8;
  font-style: italic;
  font-size: 20px;
}
.quote p { margin: 0 0 8px; }
cite {
  display: block;
  font-style: normal;
  font-size: 16px;
  color: #595959;
}
.tips, .steps { padding-left: 24px; }
.tips { list-style-type: square; }
li { margin-bottom: 8px; }
mark {
  background-color: #ffe58f;
  padding: 0 4px;
}`
    })
  });
})();
