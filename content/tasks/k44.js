/* Занятие 44. Вопросы разработки интерфейса: иерархия и типографика */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  // line-height в px → во сколько раз он больше размера шрифта
  const lh = (h, sel) => { const v = h.cs(sel, 'line-height'); const fs = h.px(sel, 'font-size'); return /px$/.test(v) ? parseFloat(v) / fs : parseFloat(v); };
  window.COURSE_TASKS.push(
    {
      id: 'k4401', lesson: 'mdk-44', module: 'mdk5', mech: 'build',
      title: 'Читаемая статья', level: 'Среднее', minutes: 20, points: 150,
      story: 'Студсовет выложил на сайт колледжа памятку к сессии. Текст мелкий, строки тянутся через весь экран и слиплись, заголовки почти не отличаются от абзацев. Приведите типографику в порядок.',
      goal: 'Измените CSS. Абзацы p: размер 18px, line-height от 1.4 до 1.7. Заголовок h1 — хотя бы в 2 раза крупнее абзаца, h2 — крупнее абзаца хотя бы в 1,3 раза, но мельче h1. Заголовки h1 и h2 — шрифтом с засечками (Georgia, "Times New Roman", serif), абзацы остаются без засечек. Статье article задайте max-width от 45ch до 75ch и поставьте её по центру (margin: 0 auto). У h2 отступ сверху хотя бы в 2 раза больше, чем снизу.',
      hints: [
        'Работайте только в CSS: размеры — font-size, интерлиньяж — line-height, шрифт — font-family.',
        'Удобно писать line-height числом без единиц: p { font-size: 18px; line-height: 1.6; }.',
        'Ширина статьи: article { max-width: 65ch; margin: 0 auto; }. Единица ch — примерно ширина одного знака.',
        'Отступы заголовка: h2 { margin: 40px 0 12px; } — сверху 40px, снизу 12px.'
      ],
      html: `<article>
  <h1>Как готовиться к сессии</h1>
  <p>Сессия начинается не в январе, а в тот день, когда вы впервые пропустили лекцию. Но даже если до экзаменов осталось три недели, всё можно успеть.</p>
  <h2>Составьте план</h2>
  <p>Выпишите все предметы и даты экзаменов. Рядом с каждым предметом отметьте темы, которые уже знаете, и темы, которые нужно разобрать. Распределите темы по дням так, чтобы последний день остался свободным.</p>
  <h2>Повторяйте понемногу</h2>
  <p>Лучше по сорок минут каждый день, чем шесть часов в ночь перед экзаменом. После каждой темы закройте конспект и расскажите её вслух своими словами.</p>
  <h2>Высыпайтесь</h2>
  <p>Память укладывает выученное во сне. Ночь без сна перед экзаменом стирает половину того, что вы повторили.</p>
</article>`,
      css: `${BASE}
article { max-width: 100%; }
h1 { font-size: 20px; }
h2 { font-size: 17px; margin: 16px 0; }
p { font-size: 14px; line-height: 1.1; }`,
      tests: [
        { name: 'Абзацы: размер 18px', check: h => near(h.px('p', 'font-size'), 18, 0.5) || `сейчас ${h.px('p', 'font-size')}px` },
        { name: 'Абзацы: line-height от 1.4 до 1.7', check: h => { const r = lh(h, 'p'); return (r >= 1.39 && r <= 1.71) || `сейчас ${isNaN(r) ? h.cs('p', 'line-height') : r.toFixed(2)}`; } },
        { name: 'h1 хотя бы в 2 раза крупнее абзаца', check: h => h.px('h1', 'font-size') >= 2 * h.px('p', 'font-size') - 0.5 || `h1 ${h.px('h1', 'font-size')}px, абзац ${h.px('p', 'font-size')}px` },
        { name: 'h2 крупнее абзаца в 1,3 раза и больше, но мельче h1', check: h => { const a = h.px('h2', 'font-size'), p = h.px('p', 'font-size'), b = h.px('h1', 'font-size'); return (a >= 1.3 * p - 0.5 && a < b) || `h2 ${a}px, абзац ${p}px, h1 ${b}px`; } },
        { name: 'Шрифтовая пара: заголовки с засечками, абзацы без засечек', check: h => { const t = h.cs('h1', 'font-family'), s = h.cs('h2', 'font-family'), p = h.cs('p', 'font-family'); return (/serif/.test(t) && !/sans-serif/.test(t) && t === s && /sans-serif/.test(p)) || 'h1 и h2 — Georgia, "Times New Roman", serif; абзацы — Arial, sans-serif'; } },
        { name: 'У статьи max-width от 45ch до 75ch', check: h => { const r = h.rules.find(x => x.selector === 'article' && /ch$/.test(x.style.maxWidth)); const n = r ? parseFloat(r.style.maxWidth) : 0; return (n >= 45 && n <= 75) || `сейчас max-width: ${r ? r.style.maxWidth : h.cs('article', 'max-width')}`; } },
        { name: 'Статья стоит по центру страницы', check: h => { const l = h.px('article', 'margin-left'), r = h.px('article', 'margin-right'); return (l > 20 && near(l, r)) || 'нужно margin: 0 auto'; } },
        { name: 'У h2 отступ сверху хотя бы в 2 раза больше, чем снизу', check: h => { const t = h.px('h2', 'margin-top'), b = h.px('h2', 'margin-bottom'); return (b > 0 && t >= 2 * b) || `сверху ${t}px, снизу ${b}px`; } }
      ]
    },
    {
      id: 'k4402', lesson: 'mdk-44', module: 'mdk5', mech: 'fix',
      title: 'Меню кофейни: близость и сходство', level: 'Среднее', minutes: 15, points: 150,
      story: 'Меню кофейни «Зерно» верстал стажёр. Цены оформлены тремя разными способами, одна строка съехала в центр, а заголовок «Выпечка» висит посередине между разделами. Покупатели путаются.',
      goal: 'Почините меню. Все пять цен — элементы span с классом price (уберите класс cost и тег b, удалите правило .cost). Уберите класс center и его правило: все строки выровнены по левому краю. Каждая строка .item — flex-контейнер с justify-content: space-between, чтобы цены стояли по правому краю друг под другом. Близость: у h2 отступ снизу не больше 12px и хотя бы вдвое меньше отступа сверху, вертикальный padding строки .item — не больше 8px.',
      hints: [
        'Сходство: найдите в HTML class="cost" и <b> и замените их на <span class="price">…</span>.',
        'Выравнивание: удалите class="center" у строки «Латте» и правило .center в CSS — правило без элемента линтер считает мусором.',
        'Цена справа: .item { display: flex; justify-content: space-between; }.',
        'Близость: h2 { margin: 32px 0 8px; }, .item { padding: 6px 0; }.'
      ],
      html: `<h1>Кофейня «Зерно»</h1>
<section class="group">
  <h2>Кофе</h2>
  <ul class="menu">
    <li class="item"><span>Американо</span> <span class="price">120 ₽</span></li>
    <li class="item"><span>Капучино</span> <span class="cost">160 ₽</span></li>
    <li class="item center"><span>Латте</span> <span class="price">170 ₽</span></li>
  </ul>
</section>
<section class="group">
  <h2>Выпечка</h2>
  <ul class="menu">
    <li class="item"><span>Круассан</span> <b>110 ₽</b></li>
    <li class="item"><span>Сырник</span> <span class="price">90 ₽</span></li>
  </ul>
</section>`,
      css: `${BASE}
.group { max-width: 360px; }
h2 { margin: 24px 0 24px; }
.menu { margin: 0; padding: 0; list-style: none; }
.item { padding: 16px 0; border-bottom: 1px solid #dddddd; }
.center { text-align: center; }
.price { font-weight: bold; color: #8a3b12; }
.cost { font-style: italic; color: #1f5fa8; }`,
      tests: [
        { name: 'Все пять цен — span.price, нет .cost и b', check: h => (h.count('span.price') === 5 && !h.count('.cost, b')) || `span.price: ${h.count('span.price')}, лишних .cost/b: ${h.count('.cost, b')}` },
        { name: 'Цены выглядят одинаково (сходство)', check: h => { const p = h.$$('.price'); return (p.length === 5 && p.every(e => h.cs(e, 'color') === rgb('#8a3b12') && h.cs(e, 'font-style') === 'normal' && +h.cs(e, 'font-weight') >= 700)) || 'у всех цен один стиль .price'; } },
        { name: 'Нет строк по центру: класс center и его правило удалены', check: h => (!h.count('.center') && !h.has(/\.center/) && h.$$('.item').every(e => h.cs(e, 'text-align') !== 'center')) || 'уберите class="center" и правило .center' },
        { name: 'Строка .item — flex с justify-content: space-between', check: h => (h.cs('.item', 'display') === 'flex' && h.cs('.item', 'justify-content') === 'space-between') || `сейчас display: ${h.cs('.item', 'display')}` },
        { name: 'Цены стоят по правому краю друг под другом', check: h => { const r = h.$$('.price').map(e => e.getBoundingClientRect().right); return (r.length === 5 && Math.max(...r) - Math.min(...r) < 1.5) || 'правые края цен не совпадают'; } },
        { name: 'Заголовок h2 прижат к своему разделу', check: h => { const t = h.px('h2', 'margin-top'), b = h.px('h2', 'margin-bottom'); return (b <= 12 && t >= 2 * b) || `сверху ${t}px, снизу ${b}px`; } },
        { name: 'Строки внутри раздела ближе друг к другу: padding .item не больше 8px', check: h => (h.px('.item', 'padding-top') <= 8 && h.px('.item', 'padding-bottom') <= 8) || `сейчас ${h.px('.item', 'padding-top')}px` }
      ]
    },
    {
      id: 'k4403', lesson: 'mdk-44', module: 'mdk5', mech: 'build',
      title: 'Афиша: одна главная вещь', level: 'Среднее', minutes: 20, points: 150,
      story: 'На сайте колледжа карточка «День открытых дверей». Сейчас в ней всё одного размера и цвета, а две кнопки спорят за внимание. Абитуриент не понимает, что главное и что нажимать.',
      goal: 'Постройте иерархию в CSS. Карточке .event — padding не меньше 16px и рамка или фон (общая область). Название .title — самый крупный текст, хотя бы в 1,5 раза крупнее описания .text. Дата .date — мельче описания (не больше 14px) и другим, приглушённым цветом. Главная кнопка .btn-main — с заливкой (цветной фон, белый текст), второстепенная .btn-more — без заливки (прозрачный фон) и с рамкой. Блок .actions — flex с gap не меньше 8px: кнопки в одной строке.',
      hints: [
        'Иерархия текста: .title { font-size: 28px; }, .text { font-size: 16px; }, .date { font-size: 14px; color: #5a6475; }.',
        'Цвет даты проверьте на контраст: серый #5a6475 на белом — 6:1, это проходит.',
        'Вторичная кнопка: .btn-more { background: transparent; border: 2px solid #1f5fa8; color: #1f5fa8; }.',
        'Ряд кнопок: .actions { display: flex; gap: 12px; }. Карточка: .event { padding: 24px; border: 1px solid #d0d7e2; }.'
      ],
      html: `<article class="event">
  <p class="date">12 ноября · 15:00 · актовый зал</p>
  <h2 class="title">День открытых дверей</h2>
  <p class="text">Покажем мастерские, расскажем о специальностях и ответим на вопросы абитуриентов и родителей.</p>
  <div class="actions">
    <a class="btn btn-main" href="#reg">Записаться</a>
    <a class="btn btn-more" href="#about">Подробнее</a>
  </div>
</article>`,
      css: `${BASE}
.event { max-width: 420px; }
.date, .title, .text { margin: 0 0 8px; font-size: 16px; }
.btn { display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; }
.btn-main, .btn-more { background: #1f5fa8; color: #ffffff; }`,
      tests: [
        { name: 'Карточка — общая область: padding не меньше 16px и рамка или фон', check: h => { const pad = h.px('.event', 'padding-left') >= 16 && h.px('.event', 'padding-top') >= 16; const area = h.px('.event', 'border-top-width') > 0 || !['rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)'].includes(h.cs('.event', 'background-color')); return (pad && area) || (pad ? 'добавьте рамку или фон' : `padding сейчас ${h.px('.event', 'padding-top')}px`); } },
        { name: 'Название .title — самый крупный текст, хотя бы в 1,5 раза крупнее .text', check: h => { const t = h.px('.title', 'font-size'), x = h.px('.text', 'font-size'); const max = Math.max(...h.$$('.event *').map(e => h.px(e, 'font-size'))); return (t >= 1.5 * x - 0.5 && t >= max) || `.title ${t}px, .text ${x}px`; } },
        { name: 'Дата .date мельче описания (не больше 14px)', check: h => (h.px('.date', 'font-size') <= 14 && h.px('.date', 'font-size') < h.px('.text', 'font-size')) || `сейчас ${h.px('.date', 'font-size')}px` },
        { name: 'Дата .date другого, приглушённого цвета', check: h => h.cs('.date', 'color') !== h.cs('.text', 'color') || 'цвет даты такой же, как у описания' },
        { name: 'Главная кнопка .btn-main — с заливкой и белым текстом', check: h => (h.cs('.btn-main', 'background-color') !== 'rgba(0, 0, 0, 0)' && h.cs('.btn-main', 'color') === rgb('#ffffff')) || 'нужен цветной фон и белый текст' },
        { name: 'Кнопка .btn-more — без заливки и с рамкой', check: h => (h.cs('.btn-more', 'background-color') === 'rgba(0, 0, 0, 0)' && h.px('.btn-more', 'border-top-width') >= 1) || 'нужен прозрачный фон и border' },
        { name: 'Кнопки в одной строке, .actions — flex с gap от 8px', check: h => (h.cs('.actions', 'display') === 'flex' && h.px('.actions', 'column-gap') >= 8 && h.sameRow(['.btn-main', '.btn-more'])) || 'нужно .actions { display: flex; gap: … }' }
      ]
    }
  );
})();
