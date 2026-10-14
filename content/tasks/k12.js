/* Занятие 12. Каскадные таблицы стилей: подключение и синтаксис */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Есть ли в CSS правило, где среди селекторов через запятую есть sel
  const hasRule = (h, sel) => h.rules.some(r => r.selector.split(',').map(s => s.trim()).includes(sel));
  window.COURSE_TASKS.push(
    {
      id: 'k1201', lesson: 'mdk-12', module: 'mdk2', mech: 'build',
      title: 'Первые правила', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Кафе «Пенка» выкладывает новости о меню. Текст есть, но выглядит он как документ из блокнота. Пора оформить его стилями.',
      goal: 'HTML не меняйте. Во вкладке CSS напишите правило для h1: цвет #6b3e1f, выравнивание по центру, шрифт Georgia с запасным serif, размер 2rem. И правило для p: размер шрифта 18px, межстрочный интервал 1.5.',
      hints: [
        'Каркас правила: h1 { … } и p { … }. Внутри — объявления «свойство: значение;».',
        'Для h1: color, text-align, font-family, font-size. Шрифт с запасным: font-family: Georgia, serif;',
        'Размер в rem пишется без пробела: font-size: 2rem; Это 32 пикселя.',
        'p { font-size: 18px; line-height: 1.5; }'
      ],
      html: `<h1>Новое меню кафе «Пенка»</h1>
<p>С понедельника в кафе у колледжа появятся сырники, тыквенный суп и какао с зефиром. Мы долго выбирали и спрашивали студентов, чего им не хватает.</p>
<p>Кафе работает с 8:00 до 18:00 по будням. Студентам с билетом — скидка 10% на всё меню.</p>`,
      css: `${BASE}
/* Ваши правила для h1 и p — ниже */
`,
      tests: [
        { name: 'h1: цвет #6b3e1f', check: h => h.cs('h1', 'color') === rgb('#6b3e1f') || `сейчас ${h.cs('h1', 'color')}` },
        { name: 'h1: по центру', check: h => h.cs('h1', 'text-align') === 'center' || `сейчас ${h.cs('h1', 'text-align')}` },
        { name: 'h1: шрифт Georgia с запасным serif', check: h => { const f = h.cs('h1', 'font-family').toLowerCase().replace(/["']/g, ''); return /^georgia,\s*serif$/.test(f) || `сейчас: ${f}`; } },
        { name: 'h1: размер 2rem', check: h => { const r = h.rules.find(x => x.selector === 'h1'); if (!r || !/rem$/.test(r.style.fontSize)) return 'размер h1 задайте в rem'; return h.px('h1', 'font-size') === 32 || `сейчас ${h.px('h1', 'font-size')}px, нужно 2rem = 32px`; } },
        { name: 'p: шрифт 18px', check: h => h.$$('p').every(p => h.px(p, 'font-size') === 18) || `сейчас ${h.px('p', 'font-size')}px` },
        { name: 'p: межстрочный 1.5', check: h => h.px('p', 'line-height') === 27 || `сейчас ${h.cs('p', 'line-height')}` }
      ]
    },
    {
      id: 'k1202', lesson: 'mdk-12', module: 'mdk2', mech: 'build',
      title: 'Классы и id в меню', level: 'Среднее', minutes: 20, points: 150,
      story: 'В меню кафе цены теряются в тексте, а про новинки никто не знает. Нужно выделить цены, новинки и блюдо дня — но только их, а не все строки подряд.',
      goal: 'Добавьте в HTML классы и id, а в CSS — правила для них. Всем пяти ценам в span дайте class="price" и правило .price: жирный шрифт (font-weight: bold), цвет #1d5c3a. Двум пунктам li с пометкой «(новинка)» дайте class="new" и правило .new: фон #fff3c4. Абзацу «Блюдо дня» дайте id="special" и правило #special: размер шрифта 20px, выравнивание по центру. Остальные пункты меню остаются как были.',
      hints: [
        'Класс пишется в открывающем теге: <span class="price">150 ₽</span>. В CSS — с точкой: .price { … }.',
        'Новинки — это целые строки списка: <li class="new">Овсяная каша с ягодами (новинка) — …</li>.',
        'id — с решёткой в CSS: <p id="special"> и #special { font-size: 20px; text-align: center; }.',
        'Цвет фона задаёт свойство background-color: .new { background-color: #fff3c4; }'
      ],
      html: `<h1>Меню кафе «Пенка»</h1>
<h2>Завтраки</h2>
<ul>
  <li>Сырники со сметаной — <span>150 ₽</span></li>
  <li>Овсяная каша с ягодами (новинка) — <span>120 ₽</span></li>
  <li>Омлет с сыром — <span>130 ₽</span></li>
</ul>
<h2>Напитки</h2>
<ul>
  <li>Какао с зефиром (новинка) — <span>110 ₽</span></li>
  <li>Чай чёрный — <span>50 ₽</span></li>
</ul>
<p>Блюдо дня: тыквенный суп с гренками</p>`,
      css: `${BASE}
h1 { color: #6b3e1f; }
h2 { color: #6b3e1f; }
li { line-height: 1.8; }
/* Ваши правила для .price, .new и #special — ниже */
`,
      tests: [
        { name: 'У всех пяти цен class="price"', check: h => h.count('span.price') === 5 || `с классом price: ${h.count('span.price')} из 5` },
        { name: '.price: жирный, цвет #1d5c3a', check: h => { if (!hasRule(h, '.price')) return 'нет правила .price'; return h.$$('.price').every(e => +h.cs(e, 'font-weight') >= 700 && h.cs(e, 'color') === rgb('#1d5c3a')) || `сейчас: ${h.cs('.price', 'font-weight')}, ${h.cs('.price', 'color')}`; } },
        { name: 'Названия блюд не жирные', check: h => h.$$('li').every(e => +h.cs(e, 'font-weight') < 700) || 'жирными должны быть только цены' },
        { name: 'class="new" ровно у двух новинок', check: h => { const n = h.$$('.new'); return n.length === 2 && n.every(e => e.tagName === 'LI' && /новинка/i.test(e.textContent)) || `сейчас с классом new: ${n.length}`; } },
        { name: '.new: фон #fff3c4, у остальных пунктов фона нет', check: h => { if (!hasRule(h, '.new')) return 'нет правила .new'; const ok = h.$$('li').every(e => /новинка/i.test(e.textContent) ? h.cs(e, 'background-color') === rgb('#fff3c4') : h.cs(e, 'background-color') === 'rgba(0, 0, 0, 0)'); return ok || 'фон — только у новинок'; } },
        { name: 'Абзац «Блюдо дня» с id="special": 20px, по центру', check: h => { const p = h.$('#special'); if (!p || p.tagName !== 'P') return 'нет абзаца с id="special"'; if (!hasRule(h, '#special')) return 'нет правила #special'; return h.px(p, 'font-size') === 20 && h.cs(p, 'text-align') === 'center' || `сейчас: ${h.cs(p, 'font-size')}, ${h.cs(p, 'text-align')}`; } }
      ]
    },
    {
      id: 'k1203', lesson: 'mdk-12', module: 'mdk2', mech: 'fix',
      title: 'Из style в CSS', level: 'Среднее', minutes: 20, points: 150,
      story: 'Доску объявлений колледжа верстали атрибутом style. Теперь завуч хочет поменять цвет предупреждений, а для этого надо править каждую строчку. Наведите порядок.',
      goal: 'Уберите из HTML все атрибуты style, а оформление перенесите в CSS, чтобы страница выглядела так же. Заголовок h1 — через правило h1 (цвет #1f4e79, по центру). Три красных предупреждения — через один класс warning: class="warning" и одно правило .warning (цвет #8e1f14, жирный). Подпись внизу — через класс note: class="note", правило .note (размер 14px, цвет #555555). Абзац про библиотеку остаётся обычным.',
      hints: [
        'Скопируйте содержимое атрибута style в правило CSS и удалите сам атрибут.',
        'Три одинаковых style → один класс: <p class="warning"> у всех трёх и одно правило .warning { color: #8e1f14; font-weight: bold; }.',
        'Для заголовка класс не нужен — он один: h1 { color: #1f4e79; text-align: center; }.',
        'Подпись: <p class="note"> и .note { font-size: 14px; color: #555555; }.'
      ],
      html: `<h1 style="color: #1f4e79; text-align: center;">Объявления колледжа</h1>
<p style="color: #8e1f14; font-weight: bold;">Завтра столовая закрыта на санобработку.</p>
<p>В библиотеку пришли новые учебники по веб-дизайну.</p>
<p style="color: #8e1f14; font-weight: bold;">Сдайте медицинские справки до 1 октября.</p>
<p style="color: #8e1f14; font-weight: bold;">Пропуск без студенческого билета не выдаётся.</p>
<p style="font-size: 14px; color: #555555;">Объявления обновляются каждый понедельник.</p>`,
      css: `${BASE}
`,
      tests: [
        { name: 'В HTML нет атрибутов style', check: h => !h.$('body [style]') || `осталось со style: ${h.count('body [style]')}` },
        { name: 'h1: цвет #1f4e79, по центру', check: h => h.cs('h1', 'color') === rgb('#1f4e79') && h.cs('h1', 'text-align') === 'center' || `сейчас: ${h.cs('h1', 'color')}, ${h.cs('h1', 'text-align')}` },
        { name: 'Три предупреждения с class="warning"', check: h => { const w = h.$$('p.warning'); return w.length === 3 && w.every(e => /столовая|справки|пропуск/i.test(e.textContent)) || `с классом warning: ${w.length}`; } },
        { name: 'Одно правило .warning: цвет #8e1f14, жирный', check: h => { if (h.rules.filter(r => r.selector === '.warning').length !== 1) return 'нужно ровно одно правило .warning'; return h.$$('.warning').every(e => h.cs(e, 'color') === rgb('#8e1f14') && +h.cs(e, 'font-weight') >= 700) || `сейчас: ${h.cs('.warning', 'color')}, ${h.cs('.warning', 'font-weight')}`; } },
        { name: 'Абзац про библиотеку обычный', check: h => { const p = h.$$('p').find(e => /библиотек/i.test(e.textContent)); return !!p && h.cs(p, 'color') === rgb('#222222') && +h.cs(p, 'font-weight') < 700 && !p.className || 'абзац про библиотеку не трогаем'; } },
        { name: 'Подпись с class="note": 14px, цвет #555555', check: h => { const n = h.$('p.note'); if (!n) return 'нет абзаца с class="note"'; return h.px(n, 'font-size') === 14 && h.cs(n, 'color') === rgb('#555555') || `сейчас: ${h.cs(n, 'font-size')}, ${h.cs(n, 'color')}`; } }
      ]
    }
  );
})();
