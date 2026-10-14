/* Занятие 15. Практическая работа №4 (ч. 1). Оформление текста и цвета */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  const pseudoRules = (h, pseudo, sel) => h.rules.filter(r => r.selector.split(',').some(s => {
    if (!s.includes(pseudo)) return false;
    try { const base = s.split(pseudo).join('').trim() || '*'; return h.$$(base).some(e => e.matches(sel)); } catch (e) { return false; }
  }));
  const rootVar = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  const lastFamily = (h, sel) => h.cs(sel, 'font-family').split(',').pop().trim().replace(/["']/g, '');

  const ARTICLE = `<article class="article">
  <h1 class="article__title">Как готовиться к сессии без паники</h1>
  <p class="article__lead">Сессия пугает только тех, кто начинает готовиться в последнюю ночь. Рассказываем, как распределить силы и не потерять сон.</p>
  <h2>Составьте план</h2>
  <p>Выпишите все экзамены и зачёты с датами. Рядом с каждым отметьте, сколько тем нужно повторить. Разделите темы на дни так, чтобы последний день остался свободным: он нужен для повторения.</p>
  <p>План лучше держать на виду: на стене, в заметках телефона или в календаре. Вычёркивать сделанное приятно и полезно.</p>
  <h2>Делайте перерывы</h2>
  <p>Мозг устаёт за 40–50 минут. После этого полезно встать, пройтись, выпить воды. Десять минут отдыха вернут больше, чем отнимут.</p>
  <p>Не заменяйте сон кофе. Во сне память раскладывает выученное по полочкам, поэтому бессонная ночь перед экзаменом почти всегда вредит.</p>
</article>`;

  window.COURSE_TASKS.push(
    {
      id: 'k1501', lesson: 'mdk-15', module: 'mdk2', mech: 'build', title: 'Типографика статьи', level: 'Лёгкое', minutes: 25, points: 100,
      story: 'Студсовет попросил оформить статью для сайта колледжа. Сейчас текст тянется во всю ширину экрана, строки слипаются, а заголовки почти не отличаются от абзацев.',
      goal: 'Оформите текст статьи. Для body: размер шрифта 18px, межстрочный интервал 1.6 (без единиц). Для .article: максимальная ширина 680px и выравнивание по центру (margin: 0 auto). Заголовкам h1 и h2 задайте шрифт Georgia, "Times New Roman", serif. Для .article__title: 36px, line-height 1.2, отступы margin 0 0 16px. Для h2: 26px, отступы margin 32px 0 12px. Для p: margin 0 0 16px. Для вводного абзаца .article__lead: 22px, цвет #444444.',
      hints: [
        'Размер и межстрочный интервал задайте один раз в body — абзацы унаследуют их сами.',
        'Чтобы блок встал по центру, у него должна быть ширина (здесь max-width: 680px) и margin: 0 auto.',
        'Одинаковый шрифт двум заголовкам — через группировку: h1, h2 { font-family: Georgia, "Times New Roman", serif; }',
        'Не создавайте второе правило body: допишите свойства в уже существующее правило body в первой строке CSS.'
      ],
      html: ARTICLE,
      css: `${BASE}`,
      tests: [
        { name: 'Текст: 18px, межстрочный интервал 1.6', check: h => (h.px('h2 + p', 'font-size') === 18 && near(h.px('h2 + p', 'line-height') / 18, 1.6, 0.02)) || `сейчас ${h.cs('h2 + p', 'font-size')}, line-height ${h.cs('h2 + p', 'line-height')}` },
        { name: 'Статья не шире 680px и стоит по центру', check: h => {
          if (h.px('.article', 'max-width') !== 680) return 'нужно max-width: 680px';
          const a = h.rect('.article'), b = h.rect('body');
          return near(a.left - b.left, b.right - a.right, 2) || 'нужно margin: 0 auto'; } },
        { name: 'Заголовки набраны Georgia с запасным serif', check: h => ['h1', 'h2'].every(s => /Georgia/i.test(h.cs(s, 'font-family')) && lastFamily(h, s) === 'serif') || 'h1 и h2: font-family: Georgia, "Times New Roman", serif' },
        { name: 'Заголовок статьи: 36px, line-height 1.2, margin 0 0 16px', check: h => {
          if (h.px('.article__title', 'font-size') !== 36) return `размер сейчас ${h.cs('.article__title', 'font-size')}`;
          if (!near(h.px('.article__title', 'line-height'), 43.2, 0.5)) return 'line-height должен быть 1.2';
          return (h.px('.article__title', 'margin-top') === 0 && h.px('.article__title', 'margin-bottom') === 16) || 'margin: 0 0 16px'; } },
        { name: 'Подзаголовки h2: 26px, сверху 32px, снизу 12px', check: h => (h.px('h2', 'font-size') === 26 && h.px('h2', 'margin-top') === 32 && h.px('h2', 'margin-bottom') === 12) || `сейчас ${h.cs('h2', 'font-size')}, margin ${h.cs('h2', 'margin-top')} / ${h.cs('h2', 'margin-bottom')}` },
        { name: 'Абзацы: отступ сверху 0, снизу 16px', check: h => h.$$('p').every(p => { const cs = h.win.getComputedStyle(p); return cs.marginTop === '0px' && cs.marginBottom === '16px'; }) || 'p { margin: 0 0 16px; }' },
        { name: 'Вводный абзац: 22px, цвет #444444', check: h => (h.px('.article__lead', 'font-size') === 22 && h.cs('.article__lead', 'color') === rgb('#444444')) || `сейчас ${h.cs('.article__lead', 'font-size')}, ${h.cs('.article__lead', 'color')}` }
      ]
    },
    {
      id: 'k1502', lesson: 'mdk-15', module: 'mdk2', mech: 'fix', title: 'Цвета с контрастом и ссылки', level: 'Среднее', minutes: 30, points: 150,
      story: 'Дизайнер-любитель покрасил статью в «нежные» цвета. Красиво, но на телефоне на солнце ничего не прочитать, а ссылки не отличить от текста. Исправим палитру по правилам WCAG.',
      goal: 'Объявите в :root переменные: --color-text #222222, --color-brand #1f4e79, --color-muted #595959, --color-note-bg #fff4cc. Перекрасьте через var(): заголовок h1 — --color-brand; ссылки в статье — --color-brand и обязательно с подчёркиванием; подпись .article__meta — --color-muted; заметка .article__note — фон --color-note-bg, текст --color-text. Контраст текста h1, ссылок, подписи и заметки — не ниже 4,5:1. Добавьте .article a:hover (ссылка меняет цвет на --color-text) и .article a:focus-visible (outline 3px solid #f2a541).',
      hints: [
        'Объявление: :root { --color-brand: #1f4e79; … }, использование: color: var(--color-brand);',
        'Подчёркивание вернёт text-decoration: underline (сейчас в шаблоне стоит none).',
        'Ссылку в состоянии наведения описывает отдельное правило: .article a:hover { color: var(--color-text); }',
        'Проверьте вкладку «Чек-лист»: в строке про контраст видно, у какого текста он слишком низкий.'
      ],
      html: `<article class="article">
  <h1>Где поесть рядом с колледжем</h1>
  <p class="article__meta">Опубликовано 12 октября · Студсовет</p>
  <p>Мы обошли все кафе в пяти минутах от корпуса. Лучшие обеды — в <a href="#pixel">кафе «Пиксель»</a>: суп, второе и чай за 290 рублей.</p>
  <p class="article__note">Совет: покажите студенческий билет — во многих кафе дают скидку 10%.</p>
  <p>Полный список адресов с картой — на странице <a href="#map">«Еда рядом»</a>.</p>
</article>`,
      css: `${BASE}
.article { max-width: 680px; margin: 0 auto; line-height: 1.6; }
h1 { color: #6fa8dc; }
.article__meta { color: #b0b0b0; font-size: 14px; }
.article a { color: #7fb2e5; text-decoration: none; }
.article__note { background-color: #ffe8a3; color: #c9a227; padding: 12px 16px; }`,
      tests: [
        { name: 'В :root объявлены четыре переменные палитры', check: h => {
          const want = { '--color-text': '#222222', '--color-brand': '#1f4e79', '--color-muted': '#595959', '--color-note-bg': '#fff4cc' };
          for (const [k, v] of Object.entries(want)) if (rootVar(h, k) !== v) return `${k} должна быть ${v}`;
          return true; } },
        { name: 'Цвета заданы через var(), а не кодами', check: h => (h.occurrences('var(--color-brand)') >= 2 && h.occurrences('var(--color-muted)') >= 1 && h.occurrences('var(--color-note-bg)') >= 1 && h.occurrences('var(--color-text)') >= 1) || 'используйте var(--color-brand), var(--color-muted), var(--color-note-bg), var(--color-text)' },
        { name: 'Заголовок и ссылки — фирменный синий #1f4e79', check: h => (h.cs('h1', 'color') === rgb('#1f4e79') && h.$$('.article a').every(a => h.win.getComputedStyle(a).color === rgb('#1f4e79'))) || 'h1 и ссылки: color: var(--color-brand)' },
        { name: 'Ссылки в тексте подчёркнуты', check: h => h.$$('.article a').every(a => h.win.getComputedStyle(a).textDecorationLine.includes('underline')) || 'ссылку нельзя отличать только цветом: верните underline' },
        { name: 'Подпись и заметка в новых цветах', check: h => {
          if (h.cs('.article__meta', 'color') !== rgb('#595959')) return 'подпись: color: var(--color-muted)';
          return (h.cs('.article__note', 'background-color') === rgb('#fff4cc') && h.cs('.article__note', 'color') === rgb('#222222')) || 'заметка: фон var(--color-note-bg), текст var(--color-text)'; } },
        { name: 'Контраст не ниже 4,5:1 у заголовка, подписи, ссылок и заметки', check: h => {
          for (const s of ['h1', '.article__meta', '.article a', '.article__note']) { const c = h.contrast(s); if (c != null && c < 4.5) return `${s}: ${c.toFixed(2)}:1`; }
          return true; } },
        { name: 'Есть .article a:hover и .article a:focus-visible', check: h => {
          if (!pseudoRules(h, ':hover', '.article a').some(r => /color/.test(r.style.cssText))) return 'нет правила a:hover со сменой цвета';
          return pseudoRules(h, ':focus-visible', '.article a').some(r => /outline/.test(r.style.cssText) && !/outline:\s*(none|0)\b/.test(r.style.cssText)) || 'нет правила a:focus-visible с outline'; } }
      ]
    },
    {
      id: 'k1503', lesson: 'mdk-15', module: 'mdk2', mech: 'build', title: 'Цитата, списки и пометки', level: 'Среднее', minutes: 30, points: 150,
      story: 'Во второй половине статьи есть цитата преподавателя и два списка. Сейчас цитата выглядит как обычный абзац со сдвигом, а пункты списков слиплись.',
      goal: 'Оформите блоки статьи. Цитата .quote: margin 24px 0, padding 16px 24px, слева рамка 4px solid #1f4e79, фон #eef3f8, курсив, размер 20px. Подпись в цитате cite: отдельной строкой (display: block), без курсива (font-style: normal), 16px, цвет #595959. Оба списка (.tips и .steps): padding-left 24px, у каждого пункта li margin-bottom 8px; у маркированного списка .tips маркер — квадрат (list-style-type: square). Пометка mark: фон #ffe58f, padding 0 4px.',
      hints: [
        'Рамка только слева: border-left: 4px solid #1f4e79;',
        'cite по умолчанию строчный и курсивный. display: block переносит его на отдельную строку, font-style: normal убирает курсив.',
        'Одинаковые правила для двух списков: .tips, .steps { padding-left: 24px; }',
        'Отступ под каждым пунктом: li { margin-bottom: 8px; }, квадратный маркер: .tips { list-style-type: square; }'
      ],
      html: `<article class="article">
  <h2>Что говорят преподаватели</h2>
  <blockquote class="quote">
    <p>Лучшая шпаргалка — та, которую вы написали сами и оставили дома.</p>
    <cite>Ирина Петровна, преподаватель МДК.08.01</cite>
  </blockquote>
  <h2>Что взять на экзамен</h2>
  <ul class="tips">
    <li>Студенческий билет или зачётку</li>
    <li>Две ручки: синюю и запасную</li>
    <li>Бутылку воды</li>
  </ul>
  <h2>Порядок на экзамене</h2>
  <ol class="steps">
    <li>Возьмите билет и назовите его номер.</li>
    <li>Подготовьтесь за 20 минут, план ответа — на листке.</li>
    <li>Отвечайте спокойно: <mark>сначала определение, потом пример</mark>.</li>
  </ol>
</article>`,
      css: `${BASE}
.article { max-width: 680px; margin: 0 auto; line-height: 1.6; }`,
      tests: [
        { name: 'Цитата: margin 24px 0, padding 16px 24px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.quote'));
          return (cs.marginTop === '24px' && cs.marginLeft === '0px' && cs.paddingTop === '16px' && cs.paddingLeft === '24px') || `margin ${cs.margin}, padding ${cs.padding}`; } },
        { name: 'Цитата: рамка слева 4px solid #1f4e79 и фон #eef3f8', check: h => (h.cs('.quote', 'border-left-width') === '4px' && h.cs('.quote', 'border-left-style') === 'solid' && h.cs('.quote', 'border-left-color') === rgb('#1f4e79') && h.cs('.quote', 'border-top-style') === 'none' && h.cs('.quote', 'background-color') === rgb('#eef3f8')) || 'нужны border-left: 4px solid #1f4e79 и background-color: #eef3f8' },
        { name: 'Текст цитаты курсивом, 20px', check: h => (h.cs('.quote p', 'font-style') === 'italic' && h.px('.quote p', 'font-size') === 20) || `сейчас ${h.cs('.quote p', 'font-style')}, ${h.cs('.quote p', 'font-size')}` },
        { name: 'Подпись cite: отдельной строкой, прямым шрифтом, 16px, #595959', check: h => (h.cs('cite', 'display') === 'block' && h.cs('cite', 'font-style') === 'normal' && h.px('cite', 'font-size') === 16 && h.cs('cite', 'color') === rgb('#595959')) || `display ${h.cs('cite', 'display')}, font-style ${h.cs('cite', 'font-style')}, ${h.cs('cite', 'font-size')}` },
        { name: 'Списки: padding-left 24px, у пунктов margin-bottom 8px', check: h => (h.px('.tips', 'padding-left') === 24 && h.px('.steps', 'padding-left') === 24 && h.$$('li').every(li => h.win.getComputedStyle(li).marginBottom === '8px')) || 'проверьте padding-left у .tips и .steps и margin-bottom у li' },
        { name: 'У маркированного списка квадратные маркеры, у нумерованного — цифры', check: h => (h.cs('.tips', 'list-style-type') === 'square' && h.cs('.steps', 'list-style-type') === 'decimal') || `.tips: ${h.cs('.tips', 'list-style-type')}, .steps: ${h.cs('.steps', 'list-style-type')}` },
        { name: 'Пометка mark: фон #ffe58f, padding 0 4px', check: h => (h.cs('mark', 'background-color') === rgb('#ffe58f') && h.px('mark', 'padding-left') === 4 && h.px('mark', 'padding-top') === 0) || 'mark { background-color: #ffe58f; padding: 0 4px; }' }
      ]
    }
  );
})();
