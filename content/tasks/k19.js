/* Занятие 19. Селекторы */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Во всех заданиях занятия HTML менять нельзя: только CSS
  const noClasses = h => !h.count('[class]') || 'HTML менять нельзя: уберите добавленные классы';
  const pseudo = (h, sel, p, prop) => { const e = h.$(sel); return e ? h.win.getComputedStyle(e, p).getPropertyValue(prop) : ''; };

  window.COURSE_TASKS.push(
    {
      id: 'k1901', lesson: 'mdk-19', module: 'mdk2', mech: 'build', title: 'Меню и статья без классов', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Страницу шахматного клуба собрал конструктор сайтов, и классов в HTML нет. Поменять HTML нельзя, зато CSS — сколько угодно. Обойдёмся комбинаторами.',
      goal: 'HTML не меняйте и классы не добавляйте. Напишите CSS: 1) список, который является прямым ребёнком nav (nav > ul), — без маркеров, padding 0; список в статье остаётся с точками; 2) пункты меню (nav li) — display: inline-block, margin-right 16px; 3) ссылки в меню (nav a) — цвет #1f4e79, без подчёркивания; ссылка в статье остаётся подчёркнутой; 4) абзац сразу после заголовка h2 (h2 + p) — 20px, остальные абзацы — обычные 16px.',
      hints: [
        'Пробел между селекторами — «внутри на любой глубине»: nav a. Знак > — «прямой ребёнок»: nav > ul.',
        'Если написать просто ul { list-style: none; }, точки пропадут и в статье. Сузьте селектор.',
        'Плюс выбирает соседа, который стоит сразу после: h2 + p.',
        'nav li { display: inline-block; margin-right: 16px; }'
      ],
      html: `<nav>
  <ul>
    <li><a href="#news">Новости</a></li>
    <li><a href="#clubs">Секции</a></li>
    <li><a href="#contacts">Контакты</a></li>
  </ul>
</nav>
<article>
  <h2>Осенний турнир по шахматам</h2>
  <p>Турнир пройдёт в актовом зале 25 октября.</p>
  <p>Зарегистрироваться можно у <a href="#coach">тренера секции</a>.</p>
  <ul>
    <li>Начало в 15:00</li>
    <li>Призы — сертификаты в книжный магазин</li>
  </ul>
</article>`,
      css: `${BASE}`,
      tests: [
        { name: 'HTML без изменений: классов нет', check: noClasses },
        { name: 'Список меню без маркеров и отступа, список статьи — с точками', check: h => (h.cs('nav ul', 'list-style-type') === 'none' && h.px('nav ul', 'padding-left') === 0 && h.cs('article ul', 'list-style-type') === 'disc') || `меню: ${h.cs('nav ul', 'list-style-type')}, статья: ${h.cs('article ul', 'list-style-type')}` },
        { name: 'Пункты меню в одну строку, отступ 16px', check: h => (h.cs('nav li', 'display') === 'inline-block' && h.px('nav li', 'margin-right') === 16 && h.sameRow(h.$$('nav li'))) || 'nav li { display: inline-block; margin-right: 16px; }' },
        { name: 'Ссылки меню синие без подчёркивания, ссылка статьи подчёркнута', check: h => (h.$$('nav a').every(a => { const cs = h.win.getComputedStyle(a); return cs.color === rgb('#1f4e79') && cs.textDecorationLine === 'none'; }) && h.cs('article a', 'text-decoration-line') === 'underline') || 'стиль нужен только ссылкам внутри nav' },
        { name: 'Первый абзац после h2 — 20px, остальные — 16px', check: h => { const p = h.$$('article p'); return (h.px(p[0], 'font-size') === 20 && h.px(p[1], 'font-size') === 16) || `сейчас ${h.cs(p[0], 'font-size')} и ${h.cs(p[1], 'font-size')}`; } }
      ]
    },
    {
      id: 'k1902', lesson: 'mdk-19', module: 'mdk2', mech: 'build', title: 'Таблица-зебра и аккуратный список', level: 'Среднее', minutes: 20, points: 150,
      story: 'Расписание секций — длинная таблица, глаз съезжает со строки на строку. Сделаем «зебру», а в списке под таблицей разделим пункты линиями.',
      goal: 'HTML не меняйте. 1) Чётные строки тела таблицы (tbody tr:nth-child(even)) — фон #eef3f8, нечётные остаются белыми. 2) Ячейки заголовка (thead th) — фон #1f4e79, белый текст. 3) Первая ячейка каждой строки тела (td:first-child) — жирная. 4) Список ul — без маркеров, padding 0; пункты li — padding 8px 0. 5) У каждого пункта, кроме последнего (li:not(:last-child)), — нижняя линия 1px solid #c9d3df.',
      hints: [
        ':nth-child(even) — чётные по счёту, :nth-child(odd) — нечётные.',
        'Первая ячейка в строке: tbody td:first-child { font-weight: bold; }',
        ':not() исключает: li:not(:last-child) — все пункты, кроме последнего.',
        'Можно и по-другому: дать линию всем li, а у li:last-child её убрать. Но одно правило с :not короче.'
      ],
      html: `<h2>Расписание секций</h2>
<table>
  <thead>
    <tr><th scope="col">Секция</th><th scope="col">День</th><th scope="col">Время</th></tr>
  </thead>
  <tbody>
    <tr><td>Волейбол</td><td>Понедельник</td><td>16:00</td></tr>
    <tr><td>Шахматы</td><td>Вторник</td><td>15:30</td></tr>
    <tr><td>Баскетбол</td><td>Среда</td><td>17:00</td></tr>
    <tr><td>Настольный теннис</td><td>Четверг</td><td>16:30</td></tr>
    <tr><td>Футбол</td><td>Пятница</td><td>15:00</td></tr>
  </tbody>
</table>
<h2>Что взять с собой</h2>
<ul>
  <li>Спортивную форму</li>
  <li>Сменную обувь</li>
  <li>Бутылку воды</li>
  <li>Полотенце</li>
</ul>`,
      css: `${BASE}
table { border-collapse: collapse; }
th, td { padding: 8px 12px; text-align: left; }`,
      tests: [
        { name: 'HTML без изменений: классов нет', check: noClasses },
        { name: 'Чётные строки — фон #eef3f8, нечётные — без фона', check: h => {
          const r = h.$$('tbody tr'), bg = e => h.win.getComputedStyle(e).backgroundColor;
          const even = [r[1], r[3]].every(e => bg(e) === rgb('#eef3f8'));
          const odd = [r[0], r[2], r[4]].every(e => bg(e) !== rgb('#eef3f8'));
          return (even && odd) || 'tbody tr:nth-child(even) { background-color: #eef3f8; }'; } },
        { name: 'Заголовок таблицы: фон #1f4e79, белый текст', check: h => h.$$('thead th').every(e => { const cs = h.win.getComputedStyle(e); return cs.backgroundColor === rgb('#1f4e79') && cs.color === rgb('#ffffff'); }) || 'thead th: фон #1f4e79, color #ffffff' },
        { name: 'Первая ячейка строки — жирная, остальные — обычные', check: h => (h.$$('tbody tr').every(tr => h.px(tr.cells[0], 'font-weight') >= 700) && h.px(h.$$('tbody tr')[0].cells[1], 'font-weight') < 700) || 'жирной должна быть только первая ячейка (td:first-child)' },
        { name: 'Список без маркеров, padding 0, у пунктов padding 8px 0', check: h => (h.cs('ul', 'list-style-type') === 'none' && h.px('ul', 'padding-left') === 0 && h.$$('li').every(li => h.win.getComputedStyle(li).paddingTop === '8px' && h.win.getComputedStyle(li).paddingLeft === '0px')) || 'ul: list-style none, padding 0; li: padding 8px 0' },
        { name: 'Линия под каждым пунктом, кроме последнего', check: h => {
          const li = h.$$('li'), b = e => h.win.getComputedStyle(e);
          const ok = li.slice(0, -1).every(e => b(e).borderBottomStyle === 'solid' && b(e).borderBottomWidth === '1px' && b(e).borderBottomColor === rgb('#c9d3df'));
          return (ok && b(li[li.length - 1]).borderBottomStyle === 'none') || 'li:not(:last-child) { border-bottom: 1px solid #c9d3df; }'; } }
      ]
    },
    {
      id: 'k1903', lesson: 'mdk-19', module: 'mdk2', mech: 'build', title: 'Атрибуты и псевдоэлементы', level: 'Среднее', minutes: 20, points: 150,
      story: 'Страница контактов приёмной комиссии. Хочется, чтобы по виду ссылки было понятно, куда она ведёт: на другой сайт, в почту или по телефону. А поле почты пусть выделяется.',
      goal: 'HTML не меняйте. 1) Ссылкам, которые ведут на другой сайт (a[href^="https"]), добавьте после текста значок: content: " ↗" в ::after. 2) Ссылке на почту (a[href^="mailto:"]) — значок перед текстом: content: "✉ " в ::before. 3) Ссылке на телефон (a[href^="tel:"]) — жирный шрифт. 4) Полю почты (input[type="email"]) — рамка 2px solid #1f4e79; текстовое поле не трогайте. 5) Первая буква заголовка h2 (h2::first-letter) — цвет #b3541e и размер 32px.',
      hints: [
        '[href^="https"] — значение атрибута начинается с «https». Есть ещё $= (заканчивается) и *= (содержит).',
        'Псевдоэлемент без content не появится: a[href^="https"]::after { content: " ↗"; }',
        'Поле почты выбирается по атрибуту: input[type="email"] { border: 2px solid #1f4e79; }',
        'h2::first-letter { color: #b3541e; font-size: 32px; }'
      ],
      html: `<h2>Контакты приёмной комиссии</h2>
<p>Звоните: <a href="tel:+74950000000">+7 495 000-00-00</a></p>
<p>Пишите: <a href="mailto:priem@college.example">priem@college.example</a></p>
<p>Наш сайт: <a href="https://college.example">college.example</a></p>
<p>Расписание: <a href="#schedule">на этой странице</a></p>
<form action="#" method="post">
  <label for="email">Почта</label>
  <input id="email" type="email" name="email">
  <label for="question">Вопрос</label>
  <input id="question" type="text" name="question">
  <button type="submit">Отправить</button>
</form>`,
      css: `${BASE}
label { display: block; margin-top: 12px; }
input { padding: 8px; font-size: 16px; }`,
      tests: [
        { name: 'HTML без изменений: классов нет', check: noClasses },
        { name: 'У ссылки на другой сайт значок ↗, у остальных — нет', check: h => (/↗/.test(pseudo(h, 'a[href^="https"]', '::after', 'content')) && !/↗/.test(pseudo(h, 'a[href="#schedule"]', '::after', 'content'))) || 'a[href^="https"]::after { content: " ↗"; }' },
        { name: 'У ссылки на почту значок ✉ перед текстом', check: h => (/✉/.test(pseudo(h, 'a[href^="mailto:"]', '::before', 'content')) && !/✉/.test(pseudo(h, 'a[href^="tel:"]', '::before', 'content'))) || 'a[href^="mailto:"]::before { content: "✉ "; }' },
        { name: 'Ссылка на телефон жирная, другие — нет', check: h => (h.px('a[href^="tel:"]', 'font-weight') >= 700 && h.px('a[href^="mailto:"]', 'font-weight') < 700) || 'a[href^="tel:"] { font-weight: bold; }' },
        { name: 'Поле почты с рамкой 2px solid #1f4e79, текстовое — без неё', check: h => (h.cs('#email', 'border-top-color') === rgb('#1f4e79') && h.cs('#email', 'border-top-style') === 'solid' && h.cs('#email', 'border-top-width') === '2px' && h.cs('#question', 'border-top-color') !== rgb('#1f4e79')) || 'input[type="email"] { border: 2px solid #1f4e79; }' },
        { name: 'Первая буква заголовка: #b3541e, 32px', check: h => (pseudo(h, 'h2', '::first-letter', 'color') === rgb('#b3541e') && pseudo(h, 'h2', '::first-letter', 'font-size') === '32px') || 'h2::first-letter { color: #b3541e; font-size: 32px; }' }
      ]
    }
  );
})();
