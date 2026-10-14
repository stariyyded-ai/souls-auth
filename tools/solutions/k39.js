/* Занятие 39: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3901: t => ({
      html: t.html,
      css: `${BASE}
.card {
  max-width: 480px;
  padding: 24px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: hsl(210 70% 35% / 0.15);
  color: hsl(210, 70%, 25%);
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: hsl(210, 70%, 35%);
  color: #ffffff;
}
.btn:hover {
  background-color: hsl(210, 70%, 25%);
}`
    }),
    k3902: t => ({
      html: t.html,
      css: t.css
        .replace('color: #a0a0a0;', 'color: #595959;')
        .replace('color: #8c8c8c;', 'color: #4d4d4d;')
        .replace('color: #6fa8dc;', 'color: #0b5cad;')
        .replace(/background-color: #f5c518;\n  color: #ffffff;/, 'background-color: #f5c518;\n  color: #1a1a1a;')
        .replace('color: #666666;', 'color: #ffffff;')
        .replace('color: #5a5a5a;', 'color: #d6d6d6;')
        .replace('color: #b0b0b0;', 'color: #595959;')
    }),
    k3903: t => ({
      html: t.html,
      css: t.css.replace(`.theme--dark {
  --bg: #121417;
}`, `.theme--dark {
  --bg: #121417;
  --text: #e6e8eb;
  --muted: #a9b1ba;
  --accent: #6cb6ff;
  --on-accent: #0d1117;
}`)
    })
  });
})();
