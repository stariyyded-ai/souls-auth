/* Занятие 19: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1901: t => ({
      html: t.html,
      css: `${t.css}
nav > ul {
  list-style: none;
  padding: 0;
}
nav li {
  display: inline-block;
  margin-right: 16px;
}
nav a {
  color: #1f4e79;
  text-decoration: none;
}
h2 + p { font-size: 20px; }`
    }),
    k1902: t => ({
      html: t.html,
      css: `${t.css}
thead th {
  background-color: #1f4e79;
  color: #ffffff;
}
tbody tr:nth-child(even) { background-color: #eef3f8; }
tbody td:first-child { font-weight: bold; }
ul {
  list-style: none;
  padding: 0;
}
li { padding: 8px 0; }
li:not(:last-child) { border-bottom: 1px solid #c9d3df; }`
    }),
    k1903: t => ({
      html: t.html,
      css: `${t.css}
a[href^="https"]::after { content: " ↗"; }
a[href^="mailto:"]::before { content: "✉ "; }
a[href^="tel:"] { font-weight: bold; }
input[type="email"] { border: 2px solid #1f4e79; }
h2::first-letter {
  color: #b3541e;
  font-size: 32px;
}`
    })
  });
})();
