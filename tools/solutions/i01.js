/* Информатика, занятие 1: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    i0101: t => ({
      html: t.html,
      css: `${BASE}
/* Цвета от дизайнера в HEX */
.top { background: #1e3a5f; color: #ffffff; padding: 16px; }
.btn { background: #c84b31; color: #ffffff; border: none; padding: 12px 20px; font-size: 16px; }
.price { color: #2e7d32; font-weight: bold; }`
    }),
    i0102: t => ({
      html: `<h1>Палитра сайта библиотеки</h1>
<table>
  <tr><th scope="col">HEX</th><th scope="col">R</th><th scope="col">G</th><th scope="col">B</th></tr>
  <tr class="c1"><td><span class="sw sw1"></span> #1e90ff</td><td>30</td><td>144</td><td>255</td></tr>
  <tr class="c2"><td><span class="sw sw2"></span> #ffd700</td><td>255</td><td>215</td><td>0</td></tr>
  <tr class="c3"><td><span class="sw sw3"></span> #8b4513</td><td>139</td><td>69</td><td>19</td></tr>
</table>`,
      css: t.css
    }),
    i0103: t => ({
      html: t.html,
      css: t.css,
      js: `// Переводит HEX-код цвета в массив [R, G, B] десятичных чисел
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

document.querySelector('#go').addEventListener('click', () => {
  const [r, g, b] = hexToRgb(document.querySelector('#hex').value.trim());
  document.querySelector('#out').textContent = \`rgb(\${r}, \${g}, \${b})\`;
});`
    })
  });
})();
