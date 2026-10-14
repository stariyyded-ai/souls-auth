/* Занятие 4. Изображения. Форматирование текста и фона */
(() => {
  const { BASE, IMG, ICON, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k0401', lesson: 'mdk-04', module: 'mdk1', mech: 'build', title: 'Карточка похода', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Клуб туристов колледжа зовёт в поход. Объявление уже написано, не хватает картинок: иконки у заголовка и фотографии маршрута с подписью.',
      goal: `1) В начало заголовка h1, перед текстом, вставьте иконку-украшение ${ICON} размером 24×24 (атрибуты width и height) с пустым alt. 2) Между двумя абзацами вставьте иллюстрацию figure: картинка ${IMG} с width="300" и height="150" и осмысленным alt (что на ней изображено, не короче 10 символов, без слов «фото» и «картинка»), под ней подпись figcaption о маршруте.`,
      hints: [
        `Иконка: <img src="${ICON}" alt="" width="24" height="24">. alt пустой, потому что это украшение.`,
        'Иллюстрация с подписью: <figure> <img …> <figcaption>…</figcaption> </figure>.',
        `Картинка: <img src="${IMG}" alt="Горная тропа среди сосен" width="300" height="150">.`,
        'В подписи напишите то, чего нет на картинке: длину маршрута, время в пути.'
      ],
      html: `<!-- В начало h1 добавьте иконку-украшение -->
<h1>Поход выходного дня</h1>
<p>Клуб туристов колледжа идёт в поход в субботу. Сбор в 8:00 у главного входа.</p>
<!-- Здесь иллюстрация: figure с картинкой и подписью -->
<p>Возьмите с собой воду, перекус и удобную обувь.</p>`,
      css: `${BASE}
h1 { color: #1d6b3a; }
figcaption { color: #555555; font-size: 14px; }`,
      tests: [
        { name: 'В h1 перед текстом — иконка с пустым alt и размером 24×24', check: h => { const i = h.$(`h1 img[src="${ICON}"]`); return !!i && i.getAttribute('alt') === '' && i.getAttribute('width') === '24' && i.getAttribute('height') === '24' && h.$('h1').firstElementChild === i || 'нужна <img src="' + ICON + '" alt="" width="24" height="24"> в начале h1'; } },
        { name: 'Есть figure с картинкой маршрута', check: h => !!h.$(`figure img[src="${IMG}"]`) || `внутри figure нет <img src="${IMG}">` },
        { name: 'У картинки маршрута осмысленный alt', check: h => { const a = (h.$(`figure img[src="${IMG}"]`)?.getAttribute('alt') || '').trim(); return a.length >= 10 && !/фото|картинк|изображени|image/i.test(a) || `alt сейчас: «${a}»`; } },
        { name: 'У картинки маршрута width="300" и height="150"', check: h => { const i = h.$(`figure img[src="${IMG}"]`); return !!i && i.getAttribute('width') === '300' && i.getAttribute('height') === '150' || 'нужны width="300" height="150" (числа без px)'; } },
        { name: 'В figure есть подпись figcaption', check: h => (h.$('figure figcaption')?.textContent.trim().length || 0) >= 5 || 'нет figcaption с текстом внутри figure' },
        { name: 'Иллюстрация стоит между двумя абзацами', check: h => { const p = h.$$('p'); return p.length === 2 && h.before(p[0], 'figure') && h.before('figure', p[1]) || 'figure должна быть между абзацами'; } }
      ]
    },
    {
      id: 'k0402', lesson: 'mdk-04', module: 'mdk1', mech: 'build', title: 'Шпаргалка кружка', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Кружок «Веб с нуля» делает шпаргалку для новичков. Текст набран, но цитата, код и формулы выглядят как обычный текст, а код и вовсе склеился в одну строку.',
      goal: 'Разметьте текст. 1) Цитату Тима Бернерса-Ли оберните в blockquote с абзацем p внутри, автора — отдельным абзацем сразу после blockquote. 2) Названия тегов <p> и <img> в предложении оберните в code. 3) Пример списка поместите в pre, чтобы сохранились переносы и отступы. 4) Запишите формулы правильно: H<sub>2</sub>O и м<sup>2</sup>. 5) Перед последним абзацем о следующей встрече поставьте разделитель hr.',
      hints: [
        'Цитата: <blockquote><p>Сила интернета…</p></blockquote>, а ниже <p>— Тим Бернерс-Ли</p>.',
        'Код в предложении: <code>&lt;p&gt;</code> — мнемоники внутри code остаются.',
        'Для блока кода: <pre> перед первой строкой и </pre> после последней. Отступы внутри pre сохранятся как есть.',
        'Индексы: H<sub>2</sub>O, м<sup>2</sup>. Разделитель — пустой тег <hr>.'
      ],
      html: `<h1>Шпаргалка кружка «Веб с нуля»</h1>

<h2>Цитата недели</h2>
Сила интернета — во всеобщности. Доступ для всех, независимо от ограничений, — его главная черта.
— Тим Бернерс-Ли

<h2>Теги</h2>
<p>Абзац делается тегом &lt;p&gt;, а картинка — тегом &lt;img&gt;.</p>
<p>Так выглядит список из двух пунктов:</p>
&lt;ul&gt;
  &lt;li&gt;Главная&lt;/li&gt;
  &lt;li&gt;Контакты&lt;/li&gt;
&lt;/ul&gt;

<h2>Немного химии и геометрии</h2>
<p>Формула воды: H2O. Площадь кабинета 214 — 48 м2.</p>

<p>Следующая встреча кружка — в четверг в 16:00, кабинет 214.</p>`,
      css: `${BASE}
h1, h2 { color: #8a3b12; }
blockquote { margin-left: 0; padding-left: 16px; border-left: 4px solid #8a3b12; }
pre { padding: 12px; background-color: #f4f1ec; }
code { color: #8a3b12; }`,
      tests: [
        { name: 'Цитата в blockquote с абзацем внутри', check: h => /Сила интернета/.test(h.$('blockquote p')?.textContent || '') || 'нужен <blockquote><p>Сила интернета…</p></blockquote>' },
        { name: 'Автор — отдельный абзац сразу после blockquote', check: h => { const n = h.$('blockquote')?.nextElementSibling; return !!n && n.tagName === 'P' && /Бернерс-Ли/.test(n.textContent) || 'после blockquote нужен <p>— Тим Бернерс-Ли</p>'; } },
        { name: 'Теги <p> и <img> в предложении — в code', check: h => { const t = h.$$('p code').map(c => c.textContent.trim()); return t.includes('<p>') && t.includes('<img>') || 'оберните &lt;p&gt; и &lt;img&gt; в code'; } },
        { name: 'Пример списка в pre с сохранёнными переносами', check: h => { const t = h.$('pre')?.textContent || ''; return t.trim().split('\n').length >= 4 && /\n\s+<li>Главная<\/li>/.test(t) || 'нужен pre с четырьмя строками кода и отступами'; } },
        { name: 'Формулы: H<sub>2</sub>O и м<sup>2</sup>', check: h => /H<sub>2<\/sub>O/.test(h.html) && /м<sup>2<\/sup>/.test(h.html) || 'запишите H<sub>2</sub>O и м<sup>2</sup>' },
        { name: 'Перед абзацем о встрече — разделитель hr', check: h => { const n = h.$('hr')?.nextElementSibling; return h.count('hr') === 1 && !!n && /четверг/.test(n.textContent) || 'нужен один <hr> прямо перед абзацем о встрече'; } }
      ]
    },
    {
      id: 'k0403', lesson: 'mdk-04', module: 'mdk1', mech: 'fix', title: 'Оформление — в CSS', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Страницу кафе «Корица» раскрасили атрибутами style прямо в HTML. Теперь заказчик хочет сменить фон отзыва, и искать нужное место по всему коду неудобно.',
      goal: 'Уберите из HTML все атрибуты style. Цвет заголовка и фон отзыва уже есть во вкладке style.css. Для strong правила там нет: добавьте в style.css правило strong { color: #1d6b3a; }. И выполните просьбу заказчика: в style.css поменяйте фон blockquote на светло-зелёный #e6f4ea.',
      hints: [
        'Атрибут удаляется целиком, вместе с кавычками: <h1 style="…"> → <h1>.',
        'Новое правило пишется по образцу тех, что уже есть в style.css: селектор, фигурные скобки, свойство: значение;',
        'В правиле blockquote замените значение background-color: #fff4d6 на #e6f4ea.'
      ],
      html: `<h1 style="color: #8a3b12;">Кафе «Корица»</h1>
<p>Свежая выпечка каждый день с 8:00 до 21:00.</p>
<blockquote style="background-color: #fff4d6;">
  <p>Лучшие сырники в районе! Приходим всей группой после пар.</p>
</blockquote>
<p>Сегодня скидка на какао: <strong style="color: #1d6b3a;">минус 20%</strong></p>`,
      css: `${BASE}
h1 { color: #8a3b12; }
blockquote { margin: 16px 0; padding: 12px 16px; background-color: #fff4d6; }`,
      tests: [
        { name: 'В HTML нет атрибутов style', check: h => { const n = h.$$('body [style]').length; return !n || `элементов со style: ${n}`; } },
        { name: 'Заголовок по-прежнему цвета #8a3b12', check: h => h.cs('h1', 'color') === rgb('#8a3b12') || `сейчас ${h.cs('h1', 'color')}` },
        { name: 'Фон отзыва — #e6f4ea', check: h => h.cs('blockquote', 'background-color') === rgb('#e6f4ea') || `сейчас ${h.cs('blockquote', 'background-color')}` },
        { name: 'В style.css есть правило для strong с цветом #1d6b3a', check: h => h.rules.some(r => r.selector === 'strong' && r.style.color) && h.cs('strong', 'color') === rgb('#1d6b3a') || 'добавьте в style.css: strong { color: #1d6b3a; }' }
      ]
    }
  );
})();
