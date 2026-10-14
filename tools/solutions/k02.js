/* Занятие 2: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0201: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Библиотека колледжа</title>
  </head>
  <body>
    <h1>Библиотека колледжа</h1>
    <p>Работаем с понедельника по пятницу, с 9:00 до 18:00.</p>
  </body>
</html>`,
      css: t.css
    }),
    k0202: t => ({
      html: `<h1>Кружок «Веб с нуля»</h1>
<p title="Запись открыта до пятницы">Наведите на этот абзац мышь — появится подсказка.</p>
<p>На первой встрече разберём теги &lt;p&gt; и &lt;h1&gt;.</p>
<p>Взнос — 500&nbsp;₽ за месяц, приходите с ноутбуком &amp; хорошим настроением.</p>
<p>&copy; 2026 Кружок «Веб с нуля»</p>`,
      css: t.css
    }),
    k0203: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Спортзал колледжа</title>
  </head>
  <body>
    <h1>Спортзал колледжа</h1>
    <p>Открыт с 8:00 до 20:00, в воскресенье — выходной.</p>
    <p>Сменная обувь обязательна.</p>
  </body>
</html>`,
      css: t.css
    })
  });
})();
