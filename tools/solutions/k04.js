/* Занятие 4: эталонные решения */
(() => {
  const { BASE, IMG, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0401: t => ({
      html: `<h1><img src="${ICON}" alt="" width="24" height="24"> Поход выходного дня</h1>
<p>Клуб туристов колледжа идёт в поход в субботу. Сбор в 8:00 у главного входа.</p>
<figure>
  <img src="${IMG}" alt="Горная тропа среди сосен на закате" width="300" height="150">
  <figcaption>Маршрут: 12 км по лесной тропе, около 4 часов в пути.</figcaption>
</figure>
<p>Возьмите с собой воду, перекус и удобную обувь.</p>`,
      css: t.css
    }),
    k0402: t => ({
      html: `<h1>Шпаргалка кружка «Веб с нуля»</h1>

<h2>Цитата недели</h2>
<blockquote cite="https://www.w3.org/People/Berners-Lee/">
  <p>Сила интернета — во всеобщности. Доступ для всех, независимо от ограничений, — его главная черта.</p>
</blockquote>
<p>— Тим Бернерс-Ли</p>

<h2>Теги</h2>
<p>Абзац делается тегом <code>&lt;p&gt;</code>, а картинка — тегом <code>&lt;img&gt;</code>.</p>
<p>Так выглядит список из двух пунктов:</p>
<pre>&lt;ul&gt;
  &lt;li&gt;Главная&lt;/li&gt;
  &lt;li&gt;Контакты&lt;/li&gt;
&lt;/ul&gt;</pre>

<h2>Немного химии и геометрии</h2>
<p>Формула воды: H<sub>2</sub>O. Площадь кабинета 214 — 48 м<sup>2</sup>.</p>

<hr>
<p>Следующая встреча кружка — в четверг в 16:00, кабинет 214.</p>`,
      css: t.css
    }),
    k0403: () => ({
      html: `<h1>Кафе «Корица»</h1>
<p>Свежая выпечка каждый день с 8:00 до 21:00.</p>
<blockquote>
  <p>Лучшие сырники в районе! Приходим всей группой после пар.</p>
</blockquote>
<p>Сегодня скидка на какао: <strong>минус 20%</strong></p>`,
      css: `${BASE}
h1 { color: #8a3b12; }
blockquote { margin: 16px 0; padding: 12px 16px; background-color: #e6f4ea; }
strong { color: #1d6b3a; }`
    })
  });
})();
