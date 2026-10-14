/* Занятие 22: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2201: t => ({
      html: t.html,
      css: `${BASE}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.gallery figure {
  margin: 0;
}
.gallery img {
  display: block;
  width: 100%;
  height: auto;
}
figcaption {
  margin-top: 6px;
  font-size: 14px;
  color: #555555;
}`
    }),
    k2202: t => ({
      html: t.html,
      css: `${BASE}
.page {
  display: grid;
  gap: 16px;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "aside"
    "footer";
}
.page > * {
  padding: 16px;
  border-radius: 8px;
}
.page p {
  margin: 0;
}
.page__header { grid-area: header; }
.page__nav { grid-area: nav; }
.page__main { grid-area: main; }
.page__aside { grid-area: aside; }
.page__footer { grid-area: footer; }
.page__header,
.page__footer {
  background-color: #1f2a44;
  color: #ffffff;
}
.page__nav,
.page__aside {
  background-color: #f1f4fa;
}
.page__nav ul {
  margin: 0;
  padding-left: 20px;
}
.page__main h1 {
  margin-top: 0;
}
@media (min-width: 768px) {
  .page {
    grid-template-columns: 200px 1fr 200px;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
  }
}`
    }),
    k2203: t => ({
      html: t.html,
      css: `${BASE}
.layout {
  display: grid;
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}
.post__img {
  display: block;
  max-width: 100%;
  height: auto;
}
.sidebar {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.sidebar h2 {
  margin-top: 0;
}
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 2fr 1fr;
  }
}`
    })
  });
})();
