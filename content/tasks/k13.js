/* Занятие 13. Каскад, наследование, блочная модель */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k1301', lesson: 'mdk-13', module: 'mdk2', mech: 'build',
      title: 'Карточка курса', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Дизайнер нарисовал в Figma карточки курсов шириной ровно 300 пикселей. Сверстайте их так, чтобы с отступами и рамкой ширина не уехала ни на пиксель.',
      goal: 'HTML не меняйте. Напишите правило .card: box-sizing: border-box, ширина 300px, внутренний отступ 16px сверху и снизу и 20px по бокам (одной записью padding), рамка 2px solid #1f4e79, скругление 8px, фон #f4f8fc, внешний отступ снизу 24px. Карточка вместе с отступами и рамкой должна быть шириной ровно 300 пикселей, а между карточками — 24 пикселя.',
      hints: [
        'Начните с width: 300px и посмотрите в предпросмотр. Потом добавьте padding и border — карточка станет шире.',
        'box-sizing: border-box заставляет padding и border уместиться внутри width.',
        'padding из двух значений: сначала верх и низ, потом бока — padding: 16px 20px;',
        '.card { box-sizing: border-box; width: 300px; padding: 16px 20px; border: 2px solid #1f4e79; border-radius: 8px; background-color: #f4f8fc; margin-bottom: 24px; }'
      ],
      html: `<h1>Курсы колледжа</h1>
<div class="card">
  <h2>Основы веб-дизайна</h2>
  <p>Восемь занятий по вторникам. Научитесь делать макеты в Figma.</p>
</div>
<div class="card">
  <h2>Фотография на телефон</h2>
  <p>Шесть занятий по субботам. Свет, композиция и обработка.</p>
</div>`,
      css: `${BASE}
h1 { color: #1f4e79; }
h2 { color: #1f4e79; margin-top: 0; }
/* Правило для .card — ниже */
`,
      tests: [
        { name: 'box-sizing: border-box', check: h => h.cs('.card', 'box-sizing') === 'border-box' || `сейчас ${h.cs('.card', 'box-sizing')}` },
        { name: 'Карточка ровно 300px в ширину вместе с рамкой', check: h => near(h.rect('.card').width, 300, 0.5) || `сейчас ${Math.round(h.rect('.card').width)}px` },
        { name: 'padding: 16px сверху и снизу, 20px по бокам', check: h => h.px('.card', 'padding-top') === 16 && h.px('.card', 'padding-bottom') === 16 && h.px('.card', 'padding-left') === 20 && h.px('.card', 'padding-right') === 20 || `сейчас ${h.cs('.card', 'padding')}` },
        { name: 'Рамка 2px solid #1f4e79, скругление 8px', check: h => h.px('.card', 'border-top-width') === 2 && h.cs('.card', 'border-top-style') === 'solid' && h.cs('.card', 'border-top-color') === rgb('#1f4e79') && h.px('.card', 'border-top-left-radius') === 8 || `рамка: ${h.cs('.card', 'border-top-width')} ${h.cs('.card', 'border-top-style')} ${h.cs('.card', 'border-top-color')}, скругление ${h.cs('.card', 'border-top-left-radius')}` },
        { name: 'Фон #f4f8fc', check: h => h.cs('.card', 'background-color') === rgb('#f4f8fc') || `сейчас ${h.cs('.card', 'background-color')}` },
        { name: 'Между карточками 24px', check: h => { const [a, b] = h.$$('.card').map(e => e.getBoundingClientRect()); return near(b.top - a.bottom, 24, 0.5) || `сейчас ${Math.round(b.top - a.bottom)}px`; } }
      ]
    },
    {
      id: 'k1302', lesson: 'mdk-13', module: 'mdk2', mech: 'fix',
      title: 'Почему не красится?', level: 'Среднее', minutes: 20, points: 150,
      story: 'Блок новостей студсовета сверстали, но первый абзац не зеленеет, размер скачет, а у кнопки «Все новости» не работает отступ сверху. Разберитесь с каскадом.',
      goal: 'Исправьте CSS, HTML не меняйте. 1) Первый абзац .lead — зелёный #1d5c3a и 20px, остальные абзацы — #555555. В CSS не должно остаться селекторов с id (#news): перебивайте классами и тегами. 2) Правило .lead должно остаться одно. 3) Шрифт Georgia, serif задайте один раз — блоку .block, а заголовок, абзацы и ссылка получат его по наследству (в CSS слово Georgia встречается один раз). 4) Ссылка .more — display: inline-block, чтобы работал margin-top.',
      hints: [
        'Откройте «Просмотреть код» на абзаце: какое правило перебило .lead? Посчитайте специфичность #news p и .lead.',
        'Замените #news p на просто p: тогда .lead (класс) окажется сильнее. Второе правило .lead с 16px перебивает размер — удалите его.',
        'font-family наследуется: допишите его в .block и уберите из h2, p и .more.',
        'Ссылка — строчный элемент, вертикальный margin на неё не действует. Допишите в .more: display: inline-block;'
      ],
      html: `<div id="news" class="block">
  <h2>Новости совета</h2>
  <p class="lead">Открыт набор в студенческий совет колледжа.</p>
  <p>Собрание кандидатов — в пятницу в 15:00 в актовом зале.</p>
  <p>Приходите со своими идеями: от дискотеки до субботника.</p>
  <a class="more" href="#news">Все новости совета</a>
</div>`,
      css: `${BASE}
.block { border: 2px solid #1f4e79; padding: 16px; max-width: 520px; }
h2 { font-family: Georgia, serif; color: #1f4e79; margin-top: 0; }
p { font-family: Georgia, serif; }
#news p { color: #555555; }
.lead { color: #1d5c3a; font-size: 20px; }
.more { font-family: Georgia, serif; padding: 8px 16px; margin-top: 12px; background-color: #1f4e79; color: #ffffff; }
.lead { font-size: 16px; }`,
      tests: [
        { name: 'Абзац .lead зелёный #1d5c3a', check: h => h.cs('.lead', 'color') === rgb('#1d5c3a') || `сейчас ${h.cs('.lead', 'color')}` },
        { name: 'Абзац .lead размером 20px', check: h => h.px('.lead', 'font-size') === 20 || `сейчас ${h.px('.lead', 'font-size')}px` },
        { name: 'Остальные абзацы #555555', check: h => h.$$('p:not(.lead)').every(p => h.cs(p, 'color') === rgb('#555555')) || `сейчас ${h.cs('p:not(.lead)', 'color')}` },
        { name: 'В CSS нет селекторов с id', check: h => !h.rules.some(r => r.selector.includes('#')) || 'уберите #news из селекторов' },
        { name: 'Правило .lead одно', check: h => h.rules.filter(r => r.selector === '.lead').length === 1 || 'правил .lead больше одного' },
        { name: 'Georgia задан один раз — у .block, остальные наследуют', check: h => { if (h.occurrences('georgia') !== 1) return `Georgia встречается ${h.occurrences('georgia')} раз(а)`; const r = h.rules.find(x => x.selector === '.block'); if (!r || !/georgia/i.test(r.style.fontFamily)) return 'шрифт задайте в правиле .block'; return ['h2', 'p', '.more'].every(s => /georgia/i.test(h.cs(s, 'font-family'))) || 'заголовок, абзацы и ссылка должны быть в Georgia'; } },
        { name: 'Ссылка .more — inline-block', check: h => h.cs('.more', 'display') === 'inline-block' || `сейчас display: ${h.cs('.more', 'display')}` }
      ]
    },
    {
      id: 'k1303', lesson: 'mdk-13', module: 'mdk2', mech: 'build',
      title: 'Статья по центру', level: 'Среднее', minutes: 20, points: 150,
      story: 'Статья для студенческого блога растянута на весь монитор: строки по 200 символов, читать невозможно. Нужна аккуратная колонка по центру, которая не ломается на телефоне.',
      goal: 'HTML не меняйте. Правило .page: максимальная ширина 640px, по центру страницы (margin: 0 auto), внутренний отступ 24px, box-sizing: border-box, фон #f4f1ea. Правило .tag: display: inline-block, padding 4px 8px, отступ справа 8px, фон #1f4e79, белый текст #ffffff, скругление 4px. Абзац .draft (черновая заметка автора) спрячьте: display: none. На телефоне 360px не должно быть горизонтальной прокрутки.',
      hints: [
        'Ширина колонки: max-width: 640px; а не width — тогда на телефоне блок сожмётся.',
        'По центру ставит margin: 0 auto; Не путайте с text-align: center — тот двигает текст внутри.',
        'Метки — строчные span. Чтобы padding работал как у кнопки, нужно display: inline-block.',
        '.draft { display: none; } — элемент исчезнет со страницы, но останется в коде.'
      ],
      html: `<div class="page">
  <h1>Как пережить первую сессию</h1>
  <p><span class="tag">учёба</span><span class="tag">советы</span><span class="tag">первый курс</span></p>
  <p>Первая сессия пугает всех, но готовиться к ней проще, чем кажется. Главное — начать не за ночь до экзамена, а хотя бы за две недели.</p>
  <p>Составьте список предметов и отметьте, по каким есть долги. Сначала закройте долги, потом повторяйте темы по билетам. Спрашивайте преподавателей на консультациях: это бесплатная подсказка, что будет на экзамене.</p>
  <p class="draft">Черновик: дописать про пересдачи и стипендию.</p>
</div>`,
      css: `${BASE}
h1 { color: #1f4e79; margin-top: 0; }
p { line-height: 1.6; }
/* Правила для .page, .tag и .draft — ниже */
`,
      tests: [
        { name: '.page: не шире 640px, box-sizing: border-box', check: h => h.cs('.page', 'box-sizing') === 'border-box' && near(h.rect('.page').width, 640, 0.5) || `сейчас ширина ${Math.round(h.rect('.page').width)}px, box-sizing ${h.cs('.page', 'box-sizing')}` },
        { name: '.page стоит по центру', check: h => { const r = h.rect('.page'); return near(r.left, h.width - r.right, 1) || `слева ${Math.round(r.left)}px, справа ${Math.round(h.width - r.right)}px`; } },
        { name: '.page: padding 24px, фон #f4f1ea', check: h => h.px('.page', 'padding-top') === 24 && h.px('.page', 'padding-left') === 24 && h.cs('.page', 'background-color') === rgb('#f4f1ea') || `сейчас padding ${h.cs('.page', 'padding')}, фон ${h.cs('.page', 'background-color')}` },
        { name: '.tag: inline-block, padding 4px 8px, отступ справа 8px', check: h => h.$$('.tag').every(e => h.cs(e, 'display') === 'inline-block' && h.px(e, 'padding-top') === 4 && h.px(e, 'padding-left') === 8 && h.px(e, 'margin-right') === 8) || `сейчас: ${h.cs('.tag', 'display')}, padding ${h.cs('.tag', 'padding')}, margin-right ${h.cs('.tag', 'margin-right')}` },
        { name: '.tag: фон #1f4e79, текст #ffffff, скругление 4px', check: h => h.cs('.tag', 'background-color') === rgb('#1f4e79') && h.cs('.tag', 'color') === rgb('#ffffff') && h.px('.tag', 'border-top-left-radius') === 4 || `сейчас: фон ${h.cs('.tag', 'background-color')}, текст ${h.cs('.tag', 'color')}` },
        { name: 'Метки стоят в одну строку', check: h => h.sameRow(h.$$('.tag')) || 'метки должны быть в одной строке' },
        { name: 'Черновик .draft спрятан', check: h => h.cs('.draft', 'display') === 'none' || 'нужно display: none' },
        { name: 'На телефоне 360px колонка сжимается без прокрутки', at: 360, check: h => !h.overflow() && h.rect('.page').width <= 312.5 || `ширина колонки ${Math.round(h.rect('.page').width)}px, есть прокрутка: ${h.overflow() ? 'да' : 'нет'}` }
      ]
    }
  );
})();
