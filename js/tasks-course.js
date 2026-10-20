/* Собрано из content/tasks командой node tools/build-content.mjs. Руками не править. */
/* Общие помощники для заданий курса (content/tasks/k*.js).
   Сборка (node tools/build-content.mjs) склеивает этот файл и все задания в js/tasks-course.js. */
window.COURSE_TASKS = window.COURSE_TASKS || [];
window.COURSE_KIT = {
  // '#f2d58a' → 'rgb(242, 213, 138)': так браузер отдаёт цвет в getComputedStyle
  rgb: hex => { const n = parseInt(hex.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; },
  near: (a, b, d = 1.5) => Math.abs(a - b) <= d,
  // Светлая страница по умолчанию: так выглядит обычный сайт, с которого начинают первокурсники
  BASE: 'body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }',
  IMG: 'img/art.svg',
  ICON: 'img/icon.svg'
};
/* ---- content/tasks/k01.js ---- */
/* Занятие 1. Как устроен веб. Язык разметки HTML */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k0101', lesson: 'mdk-01', module: 'mdk1', mech: 'build', title: 'Первая страница', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Ваша первая веб-страница: короткая визитка о себе.',
      goal: 'Напишите заголовок h1 с вашим именем, под ним два абзаца p: в первом — откуда вы, во втором — чему хотите научиться. Одно важное слово во втором абзаце выделите тегом strong.',
      hints: [
        'Заголовок пишется так: <h1>Анна Смирнова</h1>. Текст между тегами — любой.',
        'Каждый абзац — отдельная пара тегов: <p>…</p>. Значит, нужно две такие пары.',
        'Выделение — внутри абзаца: <p>Хочу научиться делать <strong>сайты</strong>.</p>'
      ],
      html: `<!-- Напишите здесь заголовок h1 с вашим именем -->

<!-- Ниже — два абзаца p -->
`,
      css: `${BASE}
h1 { color: #8a3b12; }
strong { color: #8a3b12; }`,
      tests: [
        { name: 'Есть заголовок h1 с текстом', check: h => h.count('h1') === 1 && h.text('h1').length >= 2 || (h.count('h1') ? 'заголовок пустой или их больше одного' : 'нет h1') },
        { name: 'Под заголовком два абзаца p с текстом', check: h => h.$$('p').filter(p => p.textContent.trim().length >= 3).length >= 2 || `абзацев с текстом: ${h.$$('p').filter(p => p.textContent.trim().length >= 3).length}` },
        { name: 'Абзацы идут после заголовка', check: h => h.before('h1', 'p') || 'сначала h1, потом абзацы' },
        { name: 'Во втором абзаце есть слово в strong', check: h => !!h.$$('p')[1]?.querySelector('strong')?.textContent.trim() || 'нет strong во втором абзаце' }
      ]
    },
    {
      id: 'k0102', lesson: 'mdk-01', module: 'mdk1', mech: 'fix', title: 'Почините объявление', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Староста набрал объявление для группы, но перепутал теги. Половина текста стала заголовком, а выделение расползлось.',
      goal: 'Исправьте разметку: заголовок h1 закрыт, каждый абзац — отдельный p, теги закрыты в правильном порядке, «до пятницы» выделено strong, а адрес разбит на две строки через br.',
      hints: [
        'Посмотрите на красные отметки слева от строк: линтер показывает, где тег не закрыт.',
        'Заголовок закрывается тегом </h1>, а не <h1>.',
        'Сначала закрывается тот тег, что открыт последним: <p>… <strong>…</strong></p>.',
        'Адрес: <p>Корпус 2,<br>кабинет 214</p>.'
      ],
      html: `<h1>Важное объявление<h1>
<p>Практическая работа сдаётся <strong>до пятницы</p></strong>
<p>Консультация в среду.
Приносите ноутбуки.
<p>Корпус 2, кабинет 214</p>`,
      css: `${BASE}
h1 { font-size: 28px; }`,
      tests: [
        { name: 'Один заголовок h1 с текстом «Важное объявление»', check: h => h.count('h1') === 1 && h.text('h1') === 'Важное объявление' || `заголовков h1: ${h.count('h1')}, текст: «${h.text('h1').slice(0, 40)}»` },
        { name: '«до пятницы» выделено strong внутри первого абзаца', check: h => h.$$('p')[0]?.querySelector('strong')?.textContent.trim() === 'до пятницы' || 'strong должен быть внутри p и содержать «до пятницы»' },
        { name: 'Три отдельных абзаца p', check: h => h.count('p') === 3 || `абзацев: ${h.count('p')}` },
        { name: 'Адрес в последнем абзаце разбит на две строки через br', check: h => { const p = h.$$('p')[2]; return !!(p && p.querySelector('br') && /Корпус 2/.test(p.textContent) && /кабинет 214/.test(p.textContent)) || 'нужен <br> между «Корпус 2,» и «кабинет 214»'; } },
        { name: 'Линтер не находит незакрытых тегов', check: h => !window.TaskRunner || !window.TaskRunner.htmlLint(h.html).some(m => m.type === 'error') || 'есть ошибки в HTML' }
      ]
    },
    {
      id: 'k0103', lesson: 'mdk-01', module: 'mdk1', mech: 'build', title: 'Страница расписания', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Нужно сделать страницу с расписанием консультаций по курсу. Текст уже есть, осталось его разметить.',
      goal: 'Разметьте текст: «Консультации по МДК.08.01» — заголовок h1, «Понедельник» и «Четверг» — заголовки h2, под каждым — абзац p со временем. В абзаце про четверг выделите «только онлайн» тегом em. Комментарий в начале кода оставьте.',
      hints: [
        'Сначала оберните первую строку в <h1>…</h1>.',
        'Дни недели — заголовки второго уровня: <h2>Понедельник</h2>.',
        'Время — абзац под заголовком: <p>с 15:00 до 16:30, кабинет 214</p>.',
        'Логическое ударение: <em>только онлайн</em>.'
      ],
      html: `<!-- Расписание консультаций -->
Консультации по МДК.08.01
Понедельник
с 15:00 до 16:30, кабинет 214
Четверг
с 14:00 до 15:00, только онлайн`,
      css: `${BASE}
h2 { margin-bottom: 4px; color: #8a3b12; }
p { margin-top: 0; }`,
      tests: [
        { name: 'Заголовок h1 «Консультации по МДК.08.01»', check: h => h.count('h1') === 1 && h.text('h1') === 'Консультации по МДК.08.01' || 'нет h1 с этим текстом' },
        { name: 'Два заголовка h2: Понедельник и Четверг', check: h => h.$$('h2').map(e => e.textContent.trim()).join('|') === 'Понедельник|Четверг' || `h2: ${h.$$('h2').map(e => e.textContent.trim()).join(', ') || 'нет'}` },
        { name: 'Под каждым h2 идёт абзац со временем', check: h => h.$$('h2').length === 2 && h.$$('h2').every(e => e.nextElementSibling?.tagName === 'P' && /\d\d:\d\d/.test(e.nextElementSibling.textContent)) || 'после каждого h2 нужен p со временем' },
        { name: '«только онлайн» выделено em', check: h => h.text('em') === 'только онлайн' || 'нет <em>только онлайн</em>' },
        { name: 'Комментарий в начале кода сохранён', check: h => /^\s*<!--[\s\S]*?-->/.test(h.html) || 'комментарий удалён' }
      ]
    }
  );
})();
/* ---- content/tasks/k02.js ---- */
/* Занятие 2. Синтаксис HTML и структура документа */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Код студента без комментариев: в заданиях про скелет документа проверяем сырой текст
  const raw = h => h.html.replace(/<!--[\s\S]*?-->/g, '');
  window.COURSE_TASKS.push(
    {
      id: 'k0201', lesson: 'mdk-02', module: 'mdk1', mech: 'build', title: 'Скелет страницы библиотеки', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Библиотека колледжа просит страницу с часами работы. Текст уже готов, но это ещё не документ: нет ни doctype, ни head, ни названия вкладки.',
      goal: 'Оберните готовые h1 и абзац в полный HTML-документ: первой строкой <!DOCTYPE html>, затем <html lang="ru">. В head: <meta charset="utf-8">, <meta name="viewport" content="width=device-width, initial-scale=1"> и <title> с текстом «Библиотека колледжа». h1 и абзац — внутри body. Все парные теги (html, head, body) закрыты, head идёт перед body.',
      hints: [
        'Порядок такой: doctype → html → head (служебное) → body (видимое) → закрыть html.',
        'Внутри head три строки: meta с кодировкой, meta с viewport и title.',
        'Скелет есть в начале урока: скопируйте его и замените содержимое body на h1 и абзац из шаблона.'
      ],
      html: `<!-- Соберите здесь полный HTML-документ:
     doctype, html с языком, head (кодировка, viewport, title) и body -->
<h1>Библиотека колледжа</h1>
<p>Работаем с понедельника по пятницу, с 9:00 до 18:00.</p>
`,
      css: `${BASE}
h1 { color: #8a3b12; }`,
      tests: [
        { name: 'Первая строка — <!DOCTYPE html>', check: h => /^\s*<!doctype html>/i.test(raw(h)) || 'документ должен начинаться с <!DOCTYPE html>' },
        { name: 'Есть <html lang="ru">, закрыт в конце', check: h => /<html\s+lang="ru"\s*>/.test(raw(h)) && /<\/html>\s*$/.test(raw(h)) || 'нужен <html lang="ru"> и </html> последней строкой' },
        { name: 'head идёт перед body, оба закрыты', check: h => { const s = raw(h), a = ['<head>', '</head>', '<body>', '</body>', '</html>'].map(t => s.indexOf(t)); return a.every(i => i >= 0) && a.every((v, i) => !i || v > a[i - 1]) || 'порядок: <head>…</head> <body>…</body> </html>'; } },
        { name: 'В head есть meta charset="utf-8"', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<meta\s+charset="utf-8"\s*\/?>/i.test(m[1])) || 'нет <meta charset="utf-8"> внутри head'; } },
        { name: 'В head есть meta viewport', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1(\.0)?"\s*\/?>/.test(m[1])) || 'нет meta viewport внутри head'; } },
        { name: 'В head есть title «Библиотека колледжа»', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<title>\s*Библиотека колледжа\s*<\/title>/.test(m[1])) || 'нет <title>Библиотека колледжа</title> внутри head'; } },
        { name: 'h1 и абзац — внутри body', check: h => { const m = raw(h).match(/<body>([\s\S]*)<\/body>/); return !!(m && /<h1>/.test(m[1]) && /<p>/.test(m[1])) && h.count('h1') === 1 || 'h1 и p должны стоять между <body> и </body>'; } }
      ]
    },
    {
      id: 'k0202', lesson: 'mdk-02', module: 'mdk1', mech: 'fix', title: 'Объявление кружка', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Староста сделал страницу кружка программирования, но на ней творится странное: подсказка показывает одно слово, а вместо текста «теги <p> и <h1>» появился огромный заголовок.',
      goal: 'Почините разметку. 1) У первого абзаца атрибут title должен быть «Запись открыта до пятницы» целиком — поставьте кавычки. 2) Во втором абзаце теги <p> и <h1> должны быть видны как текст — запишите их мнемониками, на странице останется один h1. 3) Знак & запишите как &amp;. 4) Между «500» и «₽» поставьте неразрывный пробел &nbsp;. 5) Вместо (c) поставьте знак © через &copy;.',
      hints: [
        'Значение атрибута — в двойных кавычках: title="Запись открыта до пятницы".',
        'Знак < пишется как &lt;, знак > — как &gt;. Значит, <p> превращается в &lt;p&gt;.',
        'Амперсанд: &amp;. Неразрывный пробел: 500&nbsp;₽. Копирайт: &copy; 2026.',
        'Чтобы в абзаце осталось «теги <p> и <h1>», напишите: теги &lt;p&gt; и &lt;h1&gt;.'
      ],
      html: `<h1>Кружок «Веб с нуля»</h1>
<p title=Запись открыта до пятницы>Наведите на этот абзац мышь — появится подсказка.</p>
<p>На первой встрече разберём теги <p> и <h1>.</p>
<p>Взнос — 500 ₽ за месяц, приходите с ноутбуком & хорошим настроением.</p>
<p>(c) 2026 Кружок «Веб с нуля»</p>`,
      css: `${BASE}
h1 { color: #8a3b12; }`,
      tests: [
        { name: 'У первого абзаца title «Запись открыта до пятницы»', check: h => h.$('p[title]')?.getAttribute('title') === 'Запись открыта до пятницы' || `сейчас title: «${h.$('p[title]')?.getAttribute('title') || 'нет'}»` },
        { name: 'Теги <p> и <h1> видны как текст, h1 на странице один', check: h => h.count('h1') === 1 && h.$$('p').some(p => /<p>\s*и\s*<h1>/.test(p.textContent)) || (h.count('h1') > 1 ? `заголовков h1: ${h.count('h1')} — браузер принял текст за теги` : 'нет текста «<p> и <h1>»') },
        { name: 'Амперсанд записан как &amp;', check: h => /ноутбуком\s*&amp;\s*хорошим/.test(h.html) || 'вместо & напишите &amp;' },
        { name: '«500» и «₽» склеены неразрывным пробелом', check: h => /500&nbsp;₽/.test(h.html) && h.$$('p').some(p => p.textContent.includes('500 ₽')) || 'нужно 500&nbsp;₽' },
        { name: 'Знак © вместо (c)', check: h => h.$$('p').some(p => p.textContent.includes('©')) && !/\(c\)/i.test(h.html) || 'замените (c) на &copy;' }
      ]
    },
    {
      id: 'k0203', lesson: 'mdk-02', module: 'mdk1', mech: 'fix', title: 'Порядок в коде спортзала', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Страницу спортзала кто-то написал в одну строку и прописными буквами, да ещё со старой кодировкой. Работает, но читать и править это невозможно.',
      goal: 'Перепишите документ аккуратно. Все теги и атрибуты — строчными буквами (DOCTYPE можно оставить как есть). У html добавьте lang="ru". Кодировку замените на utf-8 и добавьте meta viewport. Каждый тег — на своей строке (в коде не меньше 12 непустых строк), а всё, что вложено в head и body (meta, title, h1, p), сдвинуто вправо пробелами. Текст title и абзацев не меняйте.',
      hints: [
        'Начните с того, что разбейте строку: после каждого > нажмите Enter там, где начинается новый тег.',
        'Строки внутри head и body сдвиньте на 2 или 4 пробела. Например: «  <title>Спортзал колледжа</title>».',
        'Имена тегов и атрибутов пишем маленькими буквами: <HEAD> → <head>, CHARSET → charset.',
        'Сравните со скелетом из урока: структура должна быть такой же.'
      ],
      html: `<!DOCTYPE html><HTML><HEAD><META CHARSET="windows-1251"><TITLE>Спортзал колледжа</TITLE></HEAD><BODY><H1>Спортзал колледжа</H1><P>Открыт с 8:00 до 20:00, в воскресенье — выходной.</P><P>Сменная обувь обязательна.</P></BODY></HTML>`,
      css: `${BASE}
h1 { color: #1d5c8a; }`,
      tests: [
        { name: 'Теги и атрибуты — строчными буквами', check: h => { const s = raw(h).replace(/<!DOCTYPE/i, ''); return !/<\/?[A-Z]/.test(s) && !/<[a-z][^>]*\s[A-Z][A-Za-z-]*=/.test(s) || 'остались прописные буквы в тегах или атрибутах'; } },
        { name: 'У html есть lang="ru"', check: h => /<html\s+lang="ru"\s*>/.test(raw(h)) || 'нужен <html lang="ru">' },
        { name: 'Кодировка utf-8, есть meta viewport', check: h => /<meta\s+charset="utf-8"\s*\/?>/i.test(raw(h)) && !/windows-1251/i.test(h.html) && /<meta\s+name="viewport"/.test(raw(h)) || 'нужны <meta charset="utf-8"> и <meta name="viewport" …>' },
        { name: 'Каждый тег на своей строке', check: h => { const n = raw(h).split('\n').filter(l => l.trim()).length; return n >= 12 || `непустых строк: ${n}, нужно хотя бы 12`; } },
        { name: 'Вложенные meta, title, h1, p — с отступом', check: h => { const bad = raw(h).split('\n').filter(l => /<(meta|title|h1|p)[\s>]/i.test(l) && !/^[ \t]+</.test(l)); return !bad.length || `без отступа: ${bad[0].trim().slice(0, 30)}`; } },
        { name: 'Title и тексты не изменились', check: h => /<title>Спортзал колледжа<\/title>/.test(raw(h)) && h.text('h1') === 'Спортзал колледжа' && h.count('p') === 2 && /Сменная обувь обязательна/.test(h.text('body')) || 'верните исходные title, h1 и два абзаца' }
      ]
    }
  );
})();
/* ---- content/tasks/k03.js ---- */
/* Занятие 3. Гиперссылки */
(() => {
  const { BASE } = window.COURSE_KIT;
  const MDN = 'https://developer.mozilla.org/ru/docs/Web/HTML';
  window.COURSE_TASKS.push(
    {
      id: 'k0301', lesson: 'mdk-03', module: 'mdk1', mech: 'build', title: 'Меню по карте сайта', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Вы делаете страницу курса «Веб-разработка» на сайте колледжа. Файл лежит в папке courses, а главная и страница «О колледже» — уровнем выше. Нужно меню, которое не сломается при переезде сайта.',
      goal: `Под абзацем сделайте меню: список ul из четырёх пунктов li, в каждом ссылка a. По порядку: «Главная» → ../index.html; «О колледже» → ../about.html; «Курс «Дизайн интерфейсов»» → design.html (лежит в той же папке); «Справочник по HTML на MDN» → ${MDN}, эта ссылка открывается в новой вкладке (target="_blank") и защищена rel="noopener". Ссылки по своему сайту в новой вкладке не открывайте.`,
      hints: [
        'Каркас меню: <ul> <li><a href="…">Главная</a></li> … </ul>. Внутри ul — четыре li.',
        'Страница лежит в courses. Чтобы выйти на уровень выше, путь начинается с ../',
        'design.html лежит рядом с текущей страницей, поэтому путь — просто имя файла.',
        `Внешняя ссылка: <a href="${MDN}" target="_blank" rel="noopener">Справочник по HTML на MDN</a>`
      ],
      html: `<!-- Это файл courses/web.html. Структура сайта:
  college-site/
    index.html
    about.html
    courses/
      web.html (вы здесь)
      design.html
-->
<h1>Курс «Веб-разработка»</h1>
<p>Учимся делать сайты: HTML, CSS и немного JavaScript.</p>

<!-- Меню: список ul из четырёх пунктов li со ссылками -->
`,
      css: `${BASE}
h1 { color: #8a3b12; }
li { margin-bottom: 6px; }`,
      tests: [
        { name: 'Меню — список ul из четырёх li, в каждом ссылка', check: h => h.count('ul > li') === 4 && h.count('ul > li > a[href]') === 4 || `пунктов li: ${h.count('ul > li')}, ссылок в них: ${h.count('ul > li > a[href]')}` },
        { name: '«Главная» ведёт на ../index.html', check: h => h.$$('ul a')[0]?.getAttribute('href') === '../index.html' || `сейчас: ${h.$$('ul a')[0]?.getAttribute('href') || 'нет ссылки'}` },
        { name: '«О колледже» ведёт на ../about.html', check: h => h.$$('ul a')[1]?.getAttribute('href') === '../about.html' || `сейчас: ${h.$$('ul a')[1]?.getAttribute('href') || 'нет ссылки'}` },
        { name: 'Курс «Дизайн интерфейсов» ведёт на design.html в той же папке', check: h => ['design.html', './design.html'].includes(h.$$('ul a')[2]?.getAttribute('href')) || `сейчас: ${h.$$('ul a')[2]?.getAttribute('href') || 'нет ссылки'}` },
        { name: 'Справочник MDN — абсолютная ссылка в новой вкладке с rel="noopener"', check: h => { const a = h.$$('ul a')[3]; return !!a && a.getAttribute('href') === MDN && a.getAttribute('target') === '_blank' && /\bnoopener\b/.test(a.getAttribute('rel') || '') || 'нужны href с https://, target="_blank" и rel="noopener"'; } },
        { name: 'Ссылки по своему сайту открываются в той же вкладке', check: h => h.$$('ul a').slice(0, 3).every(a => !a.hasAttribute('target')) || 'у внутренних ссылок не нужен target' }
      ]
    },
    {
      id: 'k0302', lesson: 'mdk-03', module: 'mdk1', mech: 'build', title: 'Справочник с оглавлением', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Справочник первокурсника получился длинным. Нужно оглавление, по которому можно прыгнуть к разделу, а почту и телефон приёмной — сделать нажимаемыми, чтобы с телефона сразу звонить.',
      goal: 'Дайте каждому заголовку h2 атрибут id латиницей, маленькими буквами (например, id="library"). Сразу под h1 сделайте оглавление: список ul со ссылками-якорями на все четыре раздела в том же порядке, что и заголовки. Адрес priem@college.ru сделайте ссылкой mailto:priem@college.ru (текст — сам адрес). Телефон сделайте ссылкой tel:+74951234567, текст ссылки оставьте «+7 (495) 123-45-67».',
      hints: [
        'Сначала id: <h2 id="bells">Звонки</h2>. Имена придумайте сами, латиницей и без пробелов.',
        'Ссылка на раздел: <a href="#bells">Звонки</a>. В href — решётка, в id — без неё.',
        'Почта: <a href="mailto:priem@college.ru">priem@college.ru</a>.',
        'Телефон: в href только плюс и цифры — tel:+74951234567, а в тексте ссылки — как удобно читать.'
      ],
      html: `<h1>Справочник первокурсника</h1>
<!-- Здесь оглавление: список ссылок на разделы -->

<h2>Звонки</h2>
<p>Первая пара начинается в 8:30, перемены по 10 минут, большая перемена — 40 минут.</p>

<h2>Библиотека</h2>
<p>Второй этаж, кабинет 204. Читательский билет выдают по студенческому.</p>

<h2>Столовая</h2>
<p>Первый этаж. Комплексный обед с 12:00 до 15:00.</p>

<h2>Контакты</h2>
<p>Почта приёмной комиссии: priem@college.ru</p>
<p>Телефон: +7 (495) 123-45-67</p>`,
      css: `${BASE}
h1 { color: #8a3b12; }
h2 { margin-top: 32px; color: #8a3b12; }`,
      tests: [
        { name: 'У каждого h2 есть id латиницей', check: h => { const bad = h.$$('h2').filter(e => !/^[a-z][a-z0-9-]*$/.test(e.id)); return h.count('h2') === 4 && !bad.length || (bad.length ? `без правильного id: «${bad[0].textContent.trim()}»` : 'должно остаться четыре h2'); } },
        { name: 'Под h1 — оглавление ul из четырёх ссылок-якорей', check: h => h.$('h1 + ul') && h.$$('h1 + ul a[href^="#"]').length === 4 || 'сразу после h1 нужен ul с четырьмя ссылками href="#…"' },
        { name: 'Каждый якорь ведёт на существующий id, порядок как у разделов', check: h => { const links = h.$$('h1 + ul a').map(a => a.getAttribute('href')), ids = h.$$('h2').map(e => '#' + e.id); return links.length === 4 && links.join() === ids.join() || `ссылки: ${links.join(', ') || 'нет'}; id разделов: ${ids.join(', ')}`; } },
        { name: 'Почта — ссылка mailto:priem@college.ru', check: h => h.$('a[href="mailto:priem@college.ru"]')?.textContent.trim() === 'priem@college.ru' || 'нужна <a href="mailto:priem@college.ru">priem@college.ru</a>' },
        { name: 'Телефон — ссылка tel:+74951234567', check: h => { const a = h.$('a[href^="tel:"]'); return !!a && a.getAttribute('href') === 'tel:+74951234567' && a.textContent.includes('123-45-67') || (a ? `сейчас href: ${a.getAttribute('href')}` : 'нет ссылки tel:'); } }
      ]
    },
    {
      id: 'k0303', lesson: 'mdk-03', module: 'mdk1', mech: 'a11y', title: 'Понятные ссылки в новостях', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Студентка с плохим зрением слушает новости колледжа через экранный диктор. В списке ссылок она слышит «нажмите здесь, подробнее, тут» и не понимает, куда они ведут. А ссылка на почту и вовсе не работает.',
      goal: 'Перепишите тексты ссылок так, чтобы каждый сам объяснял, куда она ведёт: минимум два слова, без «здесь», «тут», «подробнее», «ссылка». Адреса sport.html, exams.html и справочника MDN не меняйте. У внешней ссылки с target="_blank" добавьте rel="noopener". Ссылку на почту почините: href="mailto:priem@college.ru". Остальной текст абзацев можно перестроить, чтобы фразы читались естественно.',
      hints: [
        'Сделайте ссылкой не «нажмите здесь», а само действие: «Запишитесь в спортивную секцию».',
        'Вместо «Подробнее» ссылкой станет предмет новости: «расписание экзаменов».',
        'Внешняя ссылка: target="_blank" rel="noopener".',
        'Почта: href начинается с mailto: — <a href="mailto:priem@college.ru">priem@college.ru</a>.'
      ],
      html: `<h1>Новости колледжа</h1>
<p>Открыта запись в спортивные секции. Чтобы записаться, <a href="sport.html">нажмите здесь</a>.</p>
<p>Опубликовано расписание экзаменов зимней сессии. <a href="exams.html">Подробнее</a></p>
<p>Справочник по HTML для первокурсников лежит <a href="${MDN}" target="_blank">тут</a>.</p>
<p>Вопросы присылайте на почту <a href="priem@college.ru">priem@college.ru</a>.</p>`,
      css: `${BASE}
h1 { color: #8a3b12; }
p { max-width: 640px; line-height: 1.5; }`,
      tests: [
        { name: 'Ссылок по-прежнему четыре, адреса страниц не изменились', check: h => h.count('a[href]') === 4 && h.count('a[href="sport.html"]') === 1 && h.count('a[href="exams.html"]') === 1 && h.count(`a[href="${MDN}"]`) === 1 || 'нужны ссылки на sport.html, exams.html, MDN и почту' },
        { name: 'Нет ссылок «здесь», «тут», «подробнее», «ссылка»', check: h => { const bad = h.$$('a').find(a => /(^|\s)(здесь|тут|подробнее|ссылка|ссылке)(\s|$)/i.test(a.textContent.trim())); return !bad || `«${bad.textContent.trim()}» — непонятно, куда ведёт`; } },
        { name: 'Тексты ссылок на страницы — минимум два слова', check: h => { const bad = h.$$('a[href]').filter(a => !a.getAttribute('href').startsWith('mailto:')).find(a => a.textContent.trim().split(/\s+/).length < 2); return !bad || `«${bad.textContent.trim()}» — слишком коротко`; } },
        { name: 'Внешняя ссылка с target="_blank" защищена rel="noopener"', check: h => h.$$('a[target="_blank"]').every(a => /\bnoopener\b/.test(a.getAttribute('rel') || '')) && h.count('a[target="_blank"]') === 1 || 'добавьте rel="noopener"' },
        { name: 'Ссылка на почту начинается с mailto:', check: h => !!h.$('a[href="mailto:priem@college.ru"]') || 'нужно href="mailto:priem@college.ru"' }
      ]
    }
  );
})();
/* ---- content/tasks/k04.js ---- */
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
/* ---- content/tasks/k05.js ---- */
/* Занятие 5. Списки и таблицы */
(() => {
  const { BASE } = window.COURSE_KIT;
  const TABLE_CSS = `table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 6px 10px; border: 1px solid #999999; text-align: left; }
thead th { background-color: #f4e6dc; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k0501', lesson: 'mdk-05', module: 'mdk1', mech: 'build', title: 'Рецепт блинов', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Студсовет выкладывает на сайт рецепт блинов к Масленице. Текст есть, но это просто строки подряд: не видно, где ингредиенты, а где шаги.',
      goal: 'Ингредиенты оформите маркированным списком ul сразу после заголовка «Ингредиенты»: пять пунктов, последний — «Для начинки:», а внутри него вложенный список ul из двух пунктов (творог, изюм). Шаги приготовления — нумерованный список ol из четырёх пунктов сразу после заголовка «Приготовление». Номера руками не пишите.',
      hints: [
        'Каждая строка становится пунктом: <li>Молоко — 500 мл</li>. Все пункты — внутри <ul>…</ul>.',
        'Вложенный список стоит внутри li, до </li>: <li>Для начинки: <ul><li>творог — 200 г</li>…</ul></li>.',
        'Для шагов — <ol>: браузер сам поставит 1, 2, 3, 4.'
      ],
      html: `<h1>Блины на Масленицу</h1>
<h2>Ингредиенты</h2>
<!-- Порядок не важен: маркированный список.
     В пункт «Для начинки:» вложите список из двух пунктов -->
Молоко — 500 мл
Яйца — 2 шт.
Мука — 250 г
Сахар — 2 столовые ложки
Для начинки:
  творог — 200 г
  изюм — горсть

<h2>Приготовление</h2>
<!-- Порядок важен: нумерованный список -->
Взбейте яйца с сахаром.
Влейте молоко и перемешайте.
Постепенно всыпьте муку, чтобы не было комочков.
Жарьте блины на разогретой сковороде с двух сторон.`,
      css: `${BASE}
h1, h2 { color: #8a3b12; }
li { margin-bottom: 4px; }`,
      tests: [
        { name: 'После «Ингредиенты» — ul из пяти пунктов', check: h => { const n = h.$$('h2')[0]?.nextElementSibling; return !!n && n.tagName === 'UL' && n.querySelectorAll(':scope > li').length === 5 || 'сразу после первого h2 нужен ul с пятью li'; } },
        { name: 'В пункте «Для начинки:» — вложенный список из двух пунктов', check: h => { const li = h.$$('li').find(e => /^Для начинки/.test(e.textContent.trim())); return !!li && li.querySelectorAll(':scope > ul > li').length === 2 || 'внутри li «Для начинки:» нужен ul с двумя li'; } },
        { name: 'Вложенный список стоит внутри li, а не между пунктами', check: h => !h.$('ul > ul, ol > ul, ul > ol, ol > ol') || 'список не может лежать прямо в списке — только внутри li' },
        { name: 'После «Приготовление» — ol из четырёх шагов', check: h => { const n = h.$$('h2')[1]?.nextElementSibling; return !!n && n.tagName === 'OL' && n.querySelectorAll(':scope > li').length === 4 || 'сразу после второго h2 нужен ol с четырьмя li'; } },
        { name: 'Номера шагов ставит браузер, а не текст', check: h => !h.$$('ol li').some(e => /^\d/.test(e.textContent.trim())) || 'уберите цифры из текста пунктов' }
      ]
    },
    {
      id: 'k0502', lesson: 'mdk-05', module: 'mdk1', mech: 'build', title: 'Расписание на понедельник', level: 'Среднее', minutes: 25, points: 150,
      story: 'Группе ИСП-11 нужно расписание на сайте. Староста прислал данные текстом. Сделайте из них таблицу, которую поймёт и человек, и экранный диктор.',
      goal: 'Сделайте таблицу по данным из комментария. caption — «Понедельник». В thead одна строка с тремя th: Время, Предмет, Кабинет, у каждого scope="col". В tbody четыре строки; первая ячейка каждой строки — th scope="row" со временем. В строке обеда ячейка «Обед» растянута на два столбца (colspan="2"), поэтому в этой строке всего две ячейки. В tfoot одна строка с одной ячейкой td на все три столбца: «Всего пар: 3».',
      hints: [
        'Каркас: <table> <caption> <thead> <tbody> <tfoot> </table>. Внутри каждой части — строки tr.',
        'Шапка: <tr><th scope="col">Время</th><th scope="col">Предмет</th><th scope="col">Кабинет</th></tr>.',
        'Строка данных: <tr><th scope="row">08:30–10:00</th><td>МДК.08.01</td><td>214</td></tr>.',
        'Обед: <tr><th scope="row">11:40–12:20</th><td colspan="2">Обед</td></tr>. Подвал: <td colspan="3">Всего пар: 3</td>.'
      ],
      html: `<h1>Расписание группы ИСП-11</h1>
<!-- Сделайте таблицу по этим данным.
  Название таблицы: Понедельник
  Заголовки столбцов: Время | Предмет | Кабинет
  08:30–10:00 | МДК.08.01 | 214
  10:10–11:40 | Математика | 305
  11:40–12:20 | Обед (на два столбца: предмет и кабинет)
  12:20–13:50 | Английский язык | 112
  Подвал таблицы, на все три столбца: Всего пар: 3
-->
`,
      css: `${BASE}
h1 { color: #8a3b12; }
${TABLE_CSS}`,
      tests: [
        { name: 'Таблица с caption «Понедельник»', check: h => /Понедельник/.test(h.text('table > caption')) || 'нет caption «Понедельник» внутри table' },
        { name: 'В thead три th со scope="col": Время, Предмет, Кабинет', check: h => { const th = h.$$('thead th'); return th.map(e => e.textContent.trim()).join('|') === 'Время|Предмет|Кабинет' && th.every(e => e.getAttribute('scope') === 'col') || `в thead: ${th.map(e => e.textContent.trim()).join(', ') || 'пусто'}`; } },
        { name: 'В tbody четыре строки, первая ячейка каждой — th scope="row"', check: h => { const rows = h.$$('tbody tr'); return rows.length === 4 && rows.every(r => r.cells[0]?.tagName === 'TH' && r.cells[0].getAttribute('scope') === 'row') || `строк в tbody: ${rows.length}; первая ячейка — th scope="row"?`; } },
        { name: 'В обычных строках по три ячейки', check: h => { const rows = h.$$('tbody tr').filter(r => !/Обед/.test(r.textContent)); return rows.length === 3 && rows.every(r => r.cells.length === 3) || 'в строках с парами должно быть по 3 ячейки'; } },
        { name: '«Обед» растянут на два столбца, в строке две ячейки', check: h => { const td = h.$$('tbody td').find(e => e.textContent.trim() === 'Обед'); return !!td && td.getAttribute('colspan') === '2' && td.parentElement.cells.length === 2 || 'нужна <td colspan="2">Обед</td> и всего две ячейки в строке'; } },
        { name: 'В tfoot ячейка на три столбца «Всего пар: 3»', check: h => { const td = h.$('tfoot td'); return !!td && td.getAttribute('colspan') === '3' && /Всего пар: 3/.test(td.textContent) || 'нужен tfoot с <td colspan="3">Всего пар: 3</td>'; } }
      ]
    },
    {
      id: 'k0503', lesson: 'mdk-05', module: 'mdk1', mech: 'fix', title: 'Словарик без таблицы', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Словарик первокурсника сверстали таблицей, хотя это пары «термин — пояснение», а шаги пересдачи — абзацами с цифрами. Диктор объявляет «таблица, 2 столбца», а номера шагов приходится править руками.',
      goal: 'Замените таблицу списком определений dl: четыре пары dt (термин) и dd (пояснение) в том же порядке, термины — Тег, Атрибут, Элемент, Браузер. Теги b уберите: термины выделит CSS. Шаги пересдачи превратите в нумерованный список ol из трёх пунктов, цифры из текста уберите.',
      hints: [
        'Каркас: <dl> <dt>Тег</dt> <dd>Команда разметки…</dd> … </dl>. Таблицу удалите целиком.',
        'dt и dd идут парами по очереди: термин, его пояснение, следующий термин…',
        'Шаги: <ol><li>Узнайте дату пересдачи у куратора.</li>…</ol> — без «1.» в тексте.'
      ],
      html: `<h1>Словарик первокурсника</h1>
<h2>Термины</h2>
<table>
  <tr><td><b>Тег</b></td><td>Команда разметки в угловых скобках.</td></tr>
  <tr><td><b>Атрибут</b></td><td>Настройка тега: имя и значение.</td></tr>
  <tr><td><b>Элемент</b></td><td>Открывающий тег, содержимое и закрывающий тег.</td></tr>
  <tr><td><b>Браузер</b></td><td>Программа для просмотра сайтов.</td></tr>
</table>
<h2>Как пересдать зачёт</h2>
<p>1. Узнайте дату пересдачи у куратора.</p>
<p>2. Получите направление в учебной части.</p>
<p>3. Подготовьтесь по вопросам из методички.</p>`,
      css: `${BASE}
h1, h2 { color: #8a3b12; }
dt { margin-top: 8px; font-weight: bold; }
dd { margin-left: 24px; }`,
      tests: [
        { name: 'Таблицы больше нет', check: h => !h.count('table') || 'удалите table' },
        { name: 'Список dl из четырёх пар dt и dd', check: h => { const dt = h.$$('dl > dt'); return dt.length === 4 && h.count('dl > dd') === 4 && dt.every(e => e.nextElementSibling?.tagName === 'DD') || `dt: ${dt.length}, dd: ${h.count('dl > dd')}; после каждого dt — dd`; } },
        { name: 'Термины по порядку: Тег, Атрибут, Элемент, Браузер', check: h => h.$$('dt').map(e => e.textContent.trim()).join('|') === 'Тег|Атрибут|Элемент|Браузер' || `сейчас: ${h.$$('dt').map(e => e.textContent.trim()).join(', ') || 'нет'}` },
        { name: 'Нет тегов b', check: h => !h.count('b') || 'термины выделяет CSS, b не нужен' },
        { name: 'Шаги — ol из трёх пунктов без цифр в тексте', check: h => h.count('ol > li') === 3 && !h.$$('ol li, p').some(e => /^\d+\./.test(e.textContent.trim())) || 'нужен ol с тремя li, без «1.», «2.» в тексте' }
      ]
    }
  );
})();
/* ---- content/tasks/k06.js ---- */
/* Занятие 6. Практическая работа №1. Техническое задание на разработку сайта */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Раздел ТЗ — заголовок h2, который начинается с номера: «4. Структура сайта»
  const sec = (h, n) => h.$$('h2').find(e => e.textContent.trim().startsWith(n + '.'));
  const after = (h, n) => sec(h, n)?.nextElementSibling || null;
  const secName = (h, n, re) => { const e = sec(h, n); return !!e && re.test(e.textContent) || `нет h2 «${n}. …» с нужным названием`; };
  const DOC_CSS = `${BASE}
h1 { color: #8a3b12; }
h2 { margin-top: 28px; color: #8a3b12; }`;
  const TABLE_CSS = `table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 6px 10px; border: 1px solid #999999; text-align: left; }
thead th { background-color: #f4e6dc; }`;
  const H1 = '<h1>Техническое задание на разработку сайта кофейни «Корица»</h1>';
  window.COURSE_TASKS.push(
    {
      id: 'k0601', lesson: 'mdk-06', module: 'mdk1', mech: 'build', title: 'ТЗ: общие сведения, цель и аудитория', level: 'Среднее', minutes: 25, points: 150,
      story: 'Кофейня «Корица» прислала письмо (оно в уроке, шаг 1): хотят сайт с меню, контактами и заявкой на торт. Начинаем ТЗ — шапку документа и первые три раздела.',
      goal: 'Напишите h1 «Техническое задание на разработку сайта кофейни «Корица»». Затем три раздела, каждый — h2 с номером. «1. Общие сведения»: список dl минимум из трёх пар dt/dd, среди терминов обязательно «Заказчик» и «Исполнитель». «2. Цель сайта»: абзац p не короче 60 символов. «3. Целевая аудитория»: список ul минимум из трёх пунктов — группы гостей из письма. Содержимое разделов идёт сразу после своего h2.',
      hints: [
        'Каркас: h1, потом h2 «1. Общие сведения», h2 «2. Цель сайта», h2 «3. Целевая аудитория». Под каждым h2 — своё содержимое.',
        'Общие сведения: <dl><dt>Заказчик</dt><dd>Кофейня «Корица», директор О. В. Смирнова</dd><dt>Исполнитель</dt><dd>…</dd>…</dl>.',
        'Цель — польза: «Гости сами узнают меню, цены и часы работы, а заявки на торты приходят через сайт».',
        'Аудитория из письма: студенты и преподаватели колледжа, мамы с детьми, сотрудники офисов.'
      ],
      html: `<!-- Письмо заказчика — в уроке, шаг 1.
  Порядок: h1, затем разделы:
  1. Общие сведения — список dl (Заказчик, Исполнитель, Название сайта…)
  2. Цель сайта — абзац
  3. Целевая аудитория — список ul -->
`,
      css: `${DOC_CSS}
dt { margin-top: 6px; font-weight: bold; }`,
      tests: [
        { name: 'h1 «Техническое задание на разработку сайта кофейни «Корица»»', check: h => h.count('h1') === 1 && /^Техническое задание на разработку сайта/.test(h.text('h1')) && /Корица/.test(h.text('h1')) || 'нет нужного h1' },
        { name: 'Разделы h2: «1. Общие сведения», «2. Цель сайта», «3. Целевая аудитория»', check: h => [secName(h, 1, /Общие сведения/), secName(h, 2, /Цель/), secName(h, 3, /аудитория/i)].find(r => r !== true) || true },
        { name: 'В разделе 1 — dl минимум из трёх пар dt/dd', check: h => { const d = after(h, 1); if (!d || d.tagName !== 'DL') return 'сразу после «1. Общие сведения» нужен dl'; const dt = [...d.querySelectorAll(':scope > dt')]; return dt.length >= 3 && dt.every(e => e.nextElementSibling?.tagName === 'DD' && e.nextElementSibling.textContent.trim()) || `пар dt/dd: ${dt.length}`; } },
        { name: 'Среди терминов есть «Заказчик» и «Исполнитель»', check: h => { const t = h.$$('dt').map(e => e.textContent.trim()); return t.includes('Заказчик') && t.includes('Исполнитель') || 'нужны dt «Заказчик» и «Исполнитель»'; } },
        { name: 'В разделе 2 — абзац с целью не короче 60 символов', check: h => { const p = after(h, 2); return !!p && p.tagName === 'P' && p.textContent.trim().length >= 60 || 'сразу после «2. Цель сайта» нужен p, 60+ символов'; } },
        { name: 'В разделе 3 — ul минимум из трёх групп', check: h => { const u = after(h, 3); return !!u && u.tagName === 'UL' && [...u.children].filter(li => li.textContent.trim().length >= 3).length >= 3 || 'сразу после «3. Целевая аудитория» нужен ul с тремя li'; } }
      ]
    },
    {
      id: 'k0602', lesson: 'mdk-06', module: 'mdk1', mech: 'build', title: 'ТЗ: карта сайта и страницы', level: 'Среднее', minutes: 30, points: 150,
      story: 'Карта сайта нарисована на листке (шаг 3). Теперь её нужно перенести в ТЗ и расписать, что будет на каждой странице.',
      goal: 'Под h1 добавьте два раздела. «4. Структура сайта»: вложенный список ul — пункт «Главная», внутри него список разделов, и хотя бы у одного раздела свой вложенный список (всего не меньше 6 пунктов li). «5. Содержание страниц»: таблица с caption; в thead три th со scope="col" (Страница, Файл, Содержание); в tbody не меньше 4 строк, первая ячейка — th scope="row" с названием страницы, вторая — имя файла латиницей маленькими буквами с .html (у первой строки — index.html, имена не повторяются), третья — что на странице (не короче 10 символов).',
      hints: [
        'Карта: <ul><li>Главная <ul><li>Меню <ul><li>Выпечка</li>…</ul></li><li>О нас</li>…</ul></li></ul>.',
        'Вложенный список всегда внутри li, перед </li>. Отступы помогают не запутаться.',
        'Строка таблицы: <tr><th scope="row">Меню</th><td>menu.html</td><td>Выпечка и напитки с ценами и фото</td></tr>.',
        'Имена файлов: index.html, menu.html, about.html, contacts.html, cakes.html — без пробелов и русских букв.'
      ],
      html: `${H1}
<!-- Разделы 1–3 вы сделали в прошлом задании. Продолжите:
  4. Структура сайта — вложенный список ul
  5. Содержание страниц — таблица: Страница | Файл | Содержание -->
`,
      css: `${DOC_CSS}
${TABLE_CSS}`,
      tests: [
        { name: 'Разделы h2: «4. Структура сайта» и «5. Содержание страниц»', check: h => [secName(h, 4, /Структура/), secName(h, 5, /Содержание/)].find(r => r !== true) || true },
        { name: 'В разделе 4 — вложенный ul: Главная, разделы, подразделы', check: h => { const u = after(h, 4); if (!u || u.tagName !== 'UL') return 'сразу после «4. Структура сайта» нужен ul'; return !!u.querySelector(':scope > li > ul > li > ul > li') || 'нужно три уровня: Главная → раздел → подраздел'; } },
        { name: 'В карте сайта не меньше 6 пунктов, списки только внутри li', check: h => { const u = after(h, 4); const n = u && u.tagName === 'UL' ? u.querySelectorAll('li').length : 0; return n >= 6 && !h.$('ul > ul') || (n < 6 ? `пунктов: ${n}` : 'ul не может лежать прямо в ul'); } },
        { name: 'В разделе 5 — таблица с caption и тремя th scope="col" в thead', check: h => { const t = after(h, 5); if (!t || t.tagName !== 'TABLE') return 'сразу после «5. Содержание страниц» нужна table'; const th = [...t.querySelectorAll('thead th')]; return !!t.querySelector(':scope > caption')?.textContent.trim() && th.length === 3 && th.every(e => e.getAttribute('scope') === 'col') || 'нужны caption и thead с тремя th scope="col"'; } },
        { name: 'Не меньше 4 строк, первая ячейка — th scope="row"', check: h => { const rows = h.$$('tbody tr'); return rows.length >= 4 && rows.every(r => r.cells.length === 3 && r.cells[0].tagName === 'TH' && r.cells[0].getAttribute('scope') === 'row') || `строк: ${rows.length}; в каждой 3 ячейки, первая — th scope="row"`; } },
        { name: 'Имена файлов: латиница, .html, первая — index.html, без повторов', check: h => { const f = h.$$('tbody tr').map(r => r.cells[1]?.textContent.trim() || ''); const bad = f.find(x => !/^[a-z0-9-]+\.html$/.test(x)); return !bad && f[0] === 'index.html' && new Set(f).size === f.length || (bad != null ? `«${bad}» — неправильное имя файла` : 'первая страница — index.html, имена не повторяются'); } },
        { name: 'У каждой страницы описано содержание', check: h => h.$$('tbody tr').every(r => (r.cells[2]?.textContent.trim().length || 0) >= 10) && h.count('tbody tr') > 0 || 'в третьем столбце опишите страницу (10+ символов)' }
      ]
    },
    {
      id: 'k0603', lesson: 'mdk-06', module: 'mdk1', mech: 'build', title: 'ТЗ: требования и сроки', level: 'Среднее', minutes: 25, points: 150,
      story: 'Осталось записать, что сайт умеет, как выглядит, на каких экранах работает и когда будет готов. По этим пунктам заказчик потом примет работу.',
      goal: 'Под h1 добавьте четыре раздела. «6. Функции сайта»: список ul или ol минимум из трёх пунктов. «7. Требования к дизайну»: ul минимум из трёх пунктов, хотя бы в одном — цвет hex-кодом вида #8a3b12. «8. Адаптивность»: абзац p, в котором названа ширина телефона 360 пикселей. «9. Сроки и этапы»: таблица с caption, в thead th со scope="col" (Этап, Срок), в tbody не меньше 4 строк по две ячейки, первая — th scope="row".',
      hints: [
        'Функции — то, что можно сделать на сайте: посмотреть меню, позвонить, отправить заявку на торт.',
        'Требования к дизайну делайте проверяемыми: «Основной цвет — тёплый коричневый #8a3b12».',
        'Адаптивность: «Сайт удобно смотреть на телефоне шириной от 360 пикселей, на планшете и на компьютере».',
        'Строка этапа: <tr><th scope="row">Вёрстка</th><td>до 20 ноября</td></tr>.'
      ],
      html: `${H1}
<!-- Разделы 1–5 вы сделали в прошлых заданиях. Продолжите:
  6. Функции сайта — список
  7. Требования к дизайну — список, цвета hex-кодами
  8. Адаптивность — абзац
  9. Сроки и этапы — таблица: Этап | Срок -->
`,
      css: `${DOC_CSS}
${TABLE_CSS}`,
      tests: [
        { name: 'Разделы h2 с номерами 6, 7, 8 и 9', check: h => [secName(h, 6, /Функции/), secName(h, 7, /дизайн/i), secName(h, 8, /Адаптивность/), secName(h, 9, /Сроки/)].find(r => r !== true) || true },
        { name: 'В разделе 6 — список минимум из трёх функций', check: h => { const u = after(h, 6); return !!u && /^(UL|OL)$/.test(u.tagName) && u.querySelectorAll(':scope > li').length >= 3 || 'сразу после «6. Функции сайта» нужен ul или ol с тремя li'; } },
        { name: 'В разделе 7 — ul из трёх требований, есть цвет в hex', check: h => { const u = after(h, 7); if (!u || u.tagName !== 'UL' || u.querySelectorAll(':scope > li').length < 3) return 'сразу после «7. Требования к дизайну» нужен ul с тремя li'; return /#[0-9a-f]{6}\b/i.test(u.textContent) || 'укажите цвет hex-кодом: #8a3b12'; } },
        { name: 'В разделе 8 — абзац с шириной телефона 360', check: h => { const p = after(h, 8); return !!p && p.tagName === 'P' && /360/.test(p.textContent) || 'сразу после «8. Адаптивность» нужен p, где есть 360'; } },
        { name: 'В разделе 9 — таблица с caption и th scope="col" в thead', check: h => { const t = after(h, 9); if (!t || t.tagName !== 'TABLE') return 'сразу после «9. Сроки и этапы» нужна table'; const th = [...t.querySelectorAll('thead th')]; return !!t.querySelector(':scope > caption')?.textContent.trim() && th.length === 2 && th.every(e => e.getAttribute('scope') === 'col') || 'нужны caption и thead с двумя th scope="col"'; } },
        { name: 'Не меньше 4 этапов, первая ячейка — th scope="row"', check: h => { const rows = h.$$('tbody tr'); return rows.length >= 4 && rows.every(r => r.cells.length === 2 && r.cells[0].tagName === 'TH' && r.cells[0].getAttribute('scope') === 'row' && r.cells[1].textContent.trim()) || `строк: ${rows.length}; в каждой этап (th scope="row") и срок`; } }
      ]
    }
  );
})();
/* ---- content/tasks/k07.js ---- */
/* Занятие 7. Практическая работа №2 (ч. 1). Страница-визитка на HTML */
(() => {
  const { BASE } = window.COURSE_KIT;
  const AV = 'img/course/k07-avatar.svg';
  const h2 = (h, re) => h.$$('h2').find(e => re.test(e.textContent));
  const CSS = `${BASE}
h1, h2 { color: #8a3b12; }
img { border-radius: 50%; }`;
  const TABLE_CSS = `table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 6px 10px; border: 1px solid #999999; text-align: left; }
thead th { background-color: #f4e6dc; }`;
  // Результат задания 1 — начало шаблона задания 2
  const PART1 = `<h1>Анна Смирнова</h1>
<img src="${AV}" alt="Анна Смирнова, студентка колледжа" width="160" height="160">
<p>Студентка группы ИСП-11, будущий веб-разработчик</p>

<h2>Обо мне</h2>
<p>Учусь в колледже на первом курсе. Люблю рисовать и придумывать, как сделать сайты <strong>удобнее</strong> для людей.</p>
<p>По вечерам играю в волейбол в секции колледжа, а по выходным помогаю в кофейне рядом с домом.</p>`;
  // Результат задания 2 — продолжение шаблона задания 3
  const PART2 = `<h2>Навыки</h2>
<ul>
  <li>Пишу разметку на HTML</li>
  <li>Рисую эскизы от руки</li>
  <li>Работаю в команде</li>
  <li>Программы:
    <ul>
      <li>VS Code</li>
      <li>Figma</li>
    </ul>
  </li>
</ul>

<h2>Моё расписание</h2>
<table>
  <caption>Моя неделя</caption>
  <thead>
    <tr>
      <th scope="col">День</th>
      <th scope="col">Учёба</th>
      <th scope="col">После пар</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Понедельник</th>
      <td>4 пары</td>
      <td>Волейбол, 17:00</td>
    </tr>
    <tr>
      <th scope="row">Среда</th>
      <td>3 пары</td>
      <td>Кружок «Веб с нуля», 16:00</td>
    </tr>
    <tr>
      <th scope="row">Суббота</th>
      <td colspan="2">Работа в кофейне</td>
    </tr>
  </tbody>
</table>`;
  window.COURSE_TASKS.push(
    {
      id: 'k0701', lesson: 'mdk-07', module: 'mdk1', mech: 'build', title: 'Визитка: шапка и обо мне', level: 'Среднее', minutes: 25, points: 150,
      story: 'Первая страница о себе: имя, фото и пара абзацев. Её увидит преподаватель, а потом — будущий работодатель.',
      goal: `Напишите h1 с именем и фамилией. Сразу после h1 — фото: img с src="${AV}", width="160", height="160" и осмысленным alt (кто на фото, не короче 8 символов, без слов «фото», «картинка», «аватар»). Сразу после фото — абзац-подпись: группа или специальность. Затем раздел h2 «Обо мне» и сразу за ним два абзаца не короче 30 символов каждый; в них одно слово выделено strong или em.`,
      hints: [
        'Порядок: <h1>Имя Фамилия</h1>, потом <img …>, потом <p>Студент группы …</p>.',
        `Картинка: <img src="${AV}" alt="Анна Смирнова, студентка колледжа" width="160" height="160">.`,
        'Раздел: <h2>Обо мне</h2> и под ним два <p>. Важное слово: <strong>удобнее</strong>.'
      ],
      html: `<!-- 1. h1 с именем и фамилией
     2. фото: img/course/k07-avatar.svg, 160×160, с alt
     3. абзац-подпись: группа или специальность
     4. h2 «Обо мне» и два абзаца -->
`,
      css: CSS,
      tests: [
        { name: 'h1 с именем и фамилией', check: h => h.count('h1') === 1 && h.text('h1').split(' ').length >= 2 || 'нужен один h1: имя и фамилия через пробел' },
        { name: 'Сразу после h1 — фото, после фото — абзац-подпись', check: h => { const i = h.$('h1')?.nextElementSibling; const p = i?.nextElementSibling; return !!i && i.tagName === 'IMG' && i.getAttribute('src') === AV && !!p && p.tagName === 'P' && p.textContent.trim().length >= 5 || 'порядок: h1 → img → p'; } },
        { name: 'У фото осмысленный alt', check: h => { const a = (h.$(`img[src="${AV}"]`)?.getAttribute('alt') || '').trim(); return a.length >= 8 && !/фото|картинк|изображени|аватар|avatar|image|\.svg/i.test(a) || `alt сейчас: «${a}» — опишите, кто на фото`; } },
        { name: 'У фото width="160" и height="160"', check: h => { const i = h.$(`img[src="${AV}"]`); return !!i && i.getAttribute('width') === '160' && i.getAttribute('height') === '160' || 'нужны width="160" height="160"'; } },
        { name: 'Раздел h2 «Обо мне» и два абзаца по 30+ символов', check: h => { const e = h2(h, /Обо мне/); const a = e?.nextElementSibling, b = a?.nextElementSibling; return !!a && !!b && [a, b].every(p => p.tagName === 'P' && p.textContent.trim().length >= 30) || 'после h2 «Обо мне» нужны два p'; } },
        { name: 'В рассказе о себе есть strong или em', check: h => { const a = h2(h, /Обо мне/)?.nextElementSibling, b = a?.nextElementSibling; return [a, b].some(p => p?.querySelector('strong, em')) || 'выделите одно слово strong или em'; } }
      ]
    },
    {
      id: 'k0702', lesson: 'mdk-07', module: 'mdk1', mech: 'build', title: 'Визитка: навыки и расписание', level: 'Среднее', minutes: 30, points: 150,
      story: 'Шапка готова (в шаблоне — пример; можете заменить его своим текстом из задания 1). Теперь расскажите, что вы умеете и когда вы свободны.',
      goal: 'Ниже раздела «Обо мне» добавьте раздел h2 «Навыки» и сразу за ним список ul минимум из четырёх пунктов; один пункт — группа со вложенным списком из двух и более пунктов. Затем раздел h2 «Моё расписание» и сразу за ним таблица: caption; в thead не меньше трёх th со scope="col"; в tbody не меньше трёх строк, первая ячейка каждой — th scope="row" с днём недели. Во всех строках столько же столбцов, сколько в шапке (с учётом colspan).',
      hints: [
        'Вложенный список стоит внутри li: <li>Программы: <ul><li>VS Code</li><li>Figma</li></ul></li>.',
        'Шапка таблицы: <thead><tr><th scope="col">День</th><th scope="col">Учёба</th><th scope="col">После пар</th></tr></thead>.',
        'Строка: <tr><th scope="row">Понедельник</th><td>4 пары</td><td>Волейбол</td></tr>.',
        'Если весь день занят одним делом, растяните ячейку: <td colspan="2">Работа в кофейне</td>.'
      ],
      html: `${PART1}

<!-- Ниже: раздел «Навыки» (список) и раздел «Моё расписание» (таблица) -->
`,
      css: `${CSS}
${TABLE_CSS}`,
      tests: [
        { name: 'Разделы по порядку: «Обо мне», «Навыки», «Моё расписание»', check: h => { const a = h2(h, /Обо мне/), b = h2(h, /Навыки/), c = h2(h, /расписание/i); return !!(a && b && c) && h.before(a, b) && h.before(b, c) || 'нужны h2 «Навыки» и «Моё расписание» после «Обо мне»'; } },
        { name: 'После «Навыки» — ul минимум из четырёх пунктов', check: h => { const u = h2(h, /Навыки/)?.nextElementSibling; return !!u && u.tagName === 'UL' && u.querySelectorAll(':scope > li').length >= 4 || 'сразу после h2 «Навыки» нужен ul с четырьмя li'; } },
        { name: 'В одном пункте — вложенный список из двух и более пунктов', check: h => { const u = h2(h, /Навыки/)?.nextElementSibling; return !!u && [...u.querySelectorAll(':scope > li > ul')].some(x => x.querySelectorAll(':scope > li').length >= 2) && !h.$('ul > ul') || 'внутри одного li нужен ul с двумя li'; } },
        { name: 'После «Моё расписание» — таблица с caption и th scope="col"', check: h => { const t = h2(h, /расписание/i)?.nextElementSibling; if (!t || t.tagName !== 'TABLE') return 'сразу после h2 «Моё расписание» нужна table'; const th = [...t.querySelectorAll('thead th')]; return !!t.querySelector(':scope > caption')?.textContent.trim() && th.length >= 3 && th.every(e => e.getAttribute('scope') === 'col') || 'нужны caption и thead с тремя th scope="col"'; } },
        { name: 'В tbody не меньше трёх строк, первая ячейка — th scope="row"', check: h => { const rows = h.$$('tbody tr'); return rows.length >= 3 && rows.every(r => r.cells[0]?.tagName === 'TH' && r.cells[0].getAttribute('scope') === 'row') || `строк: ${rows.length}; первая ячейка — th scope="row"`; } },
        { name: 'Во всех строках столько столбцов, сколько в шапке', check: h => { const n = h.count('thead th'); const bad = h.$$('tbody tr').find(r => [...r.cells].reduce((s, c) => s + c.colSpan, 0) !== n); return !!n && !bad || (bad ? `строка «${bad.cells[0]?.textContent.trim()}»: столбцов не ${n}` : 'нет шапки'); } }
      ]
    },
    {
      id: 'k0703', lesson: 'mdk-07', module: 'mdk1', mech: 'build', title: 'Визитка: контакты и подвал', level: 'Среднее', minutes: 25, points: 150,
      story: 'Визитка почти готова. Осталось главное — как с вами связаться. С телефона по номеру должно звонить, по почте — открываться письмо.',
      goal: 'После таблицы добавьте раздел h2 «Контакты» и сразу за ним список ul минимум из трёх пунктов со ссылками: почта (href="mailto:…" с адресом без пробелов), телефон (href="tel:+7…" — плюс и 11 цифр), внешний профиль или портфолио (адрес с https://, target="_blank", rel="noopener", текст ссылки — минимум два слова). После списка поставьте разделитель hr, а за ним абзац-подвал со знаком © и годом.',
      hints: [
        'Почта: <li>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></li>.',
        'Телефон: <a href="tel:+79000000000">+7 900 000-00-00</a> — в href только плюс и цифры.',
        'Внешняя ссылка: <a href="https://github.com/" target="_blank" rel="noopener">Мои работы на GitHub</a>.',
        'Подвал: <hr> и <p>&copy; 2026 Анна Смирнова</p>.'
      ],
      html: `${PART1}

${PART2}

<!-- Ниже: раздел «Контакты» (список ссылок), разделитель hr и подвал с © -->
`,
      css: `${CSS}
${TABLE_CSS}`,
      tests: [
        { name: 'Раздел h2 «Контакты» после таблицы', check: h => { const e = h2(h, /Контакты/); return !!e && h.before('table', e) || 'нужен h2 «Контакты» ниже таблицы'; } },
        { name: 'После «Контакты» — ul минимум из трёх пунктов со ссылками', check: h => { const u = h2(h, /Контакты/)?.nextElementSibling; return !!u && u.tagName === 'UL' && [...u.querySelectorAll(':scope > li')].filter(li => li.querySelector('a[href]')).length >= 3 || 'сразу после h2 «Контакты» нужен ul с тремя ссылками'; } },
        { name: 'Почта — ссылка mailto: с правильным адресом', check: h => h.$$('a[href^="mailto:"]').some(a => /^mailto:[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(a.getAttribute('href'))) || 'нужна ссылка mailto:имя@домен.ru' },
        { name: 'Телефон — ссылка tel: с плюсом и 11 цифрами', check: h => { const a = h.$('a[href^="tel:"]'); return !!a && /^tel:\+\d{11}$/.test(a.getAttribute('href')) || (a ? `сейчас: ${a.getAttribute('href')}` : 'нет ссылки tel:'); } },
        { name: 'Внешняя ссылка: https, новая вкладка, rel="noopener", понятный текст', check: h => { const a = h.$('a[href^="https://"]'); return !!a && a.getAttribute('target') === '_blank' && /\bnoopener\b/.test(a.getAttribute('rel') || '') && a.textContent.trim().split(/\s+/).length >= 2 || 'нужна ссылка https:// с target="_blank", rel="noopener" и текстом из 2+ слов'; } },
        { name: 'После списка — hr и подвал с © и годом', check: h => { const u = h2(h, /Контакты/)?.nextElementSibling; const hr = u?.nextElementSibling, p = hr?.nextElementSibling; return !!hr && hr.tagName === 'HR' && !!p && p.tagName === 'P' && /©/.test(p.textContent) && /\d{4}/.test(p.textContent) || 'после ul нужны <hr> и <p>&copy; 2026 Имя</p>'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k08.js ---- */
/* Занятие 8. Практическая работа №2 (ч. 2). Несколько страниц и навигация */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k0801', lesson: 'mdk-08', module: 'mdk1', mech: 'build',
      title: 'Меню-оглавление и «Наверх»', level: 'Лёгкое', minutes: 30, points: 100,
      story: 'Визитка Анны выросла в длинную страницу. На телефоне до контактов приходится листать целую минуту. Нужно оглавление сверху и быстрый путь обратно.',
      goal: 'Дайте заголовку h1 id="top". Заголовкам h2 дайте id по порядку: about, skills, schedule, contacts. Между h1 и первым h2 сделайте оглавление: список ul из четырёх пунктов li, в каждом ссылка на свой раздел (#about, #skills, #schedule, #contacts) с тем же текстом, что у заголовка раздела. В конце каждого из четырёх разделов (перед следующим h2 и в самом конце страницы) добавьте абзац со ссылкой «Наверх», которая ведёт на #top.',
      hints: [
        'Сначала id: <h1 id="top">, <h2 id="about">Обо мне</h2> и так далее. Решётку в id не пишут.',
        'Оглавление — обычный список: <ul><li><a href="#about">Обо мне</a></li> … </ul>. Поставьте его сразу после h1.',
        'Ссылка «Наверх» — отдельный абзац перед каждым следующим h2: <p><a href="#top">Наверх</a></p>. Последнюю поставьте в самый конец.',
        'Всего ссылок на #top должно быть четыре: после «Обо мне», «Навыки», «Расписание» и «Контакты».'
      ],
      html: `<h1>Анна Смирнова</h1>
<!-- Здесь будет оглавление -->

<h2>Обо мне</h2>
<p>Учусь на первом курсе по специальности «Информационные системы». Люблю рисовать и разбираться, как устроены сайты.</p>
<p>По выходным работаю в кофейне у вокзала, поэтому умею объяснять сложное простыми словами.</p>

<h2>Навыки</h2>
<ul>
  <li>HTML: заголовки, списки, таблицы, ссылки</li>
  <li>Рисование от руки и в графическом планшете</li>
  <li>Работа с людьми и терпение</li>
</ul>

<h2>Расписание</h2>
<table>
  <caption>Когда меня можно найти в колледже</caption>
  <tr><th scope="col">День</th><th scope="col">Время</th><th scope="col">Кабинет</th></tr>
  <tr><td>Понедельник</td><td>9:00–14:00</td><td>214</td></tr>
  <tr><td>Среда</td><td>11:00–16:00</td><td>305</td></tr>
  <tr><td>Пятница</td><td>9:00–12:30</td><td>214</td></tr>
</table>

<h2>Контакты</h2>
<p>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></p>
<p>Телефон: <a href="tel:+79001234567">+7 900 123-45-67</a></p>
`,
      css: `${BASE}
h1 { color: #8a3b12; }
h2 { color: #8a3b12; margin-top: 32px; }
table { border-collapse: collapse; }
th, td { border: 1px solid #999999; padding: 6px 10px; text-align: left; }
caption { text-align: left; margin-bottom: 6px; }`,
      tests: [
        { name: 'У h1 есть id="top"', check: h => h.$('h1')?.id === 'top' || `сейчас id: «${h.$('h1')?.id || 'нет'}»` },
        { name: 'У h2 по порядку id: about, skills, schedule, contacts', check: h => { const ids = h.$$('h2').map(e => e.id).join(', '); return ids === 'about, skills, schedule, contacts' || `сейчас: ${ids.replace(/(^|, )(?=,|$)/g, '$1—') || 'нет id'}`; } },
        { name: 'Оглавление — список ul между h1 и первым h2', check: h => { const ul = h.$('ul'); return !!(ul && h.before('h1', ul) && h.before(ul, 'h2')) || 'первый ul на странице должен стоять после h1 и до первого h2'; } },
        { name: 'В оглавлении 4 ссылки на #about, #skills, #schedule, #contacts по порядку', check: h => { const a = h.$$('ul:first-of-type li > a').map(e => e.getAttribute('href')); return a.join(' ') === '#about #skills #schedule #contacts' || `сейчас: ${a.join(' ') || 'ссылок нет'}`; } },
        { name: 'Текст пунктов оглавления совпадает с заголовками разделов', check: h => { const a = h.$$('ul:first-of-type li > a').map(e => e.textContent.trim()), t = h.$$('h2').map(e => e.textContent.trim()); return a.length === 4 && a.join('|') === t.join('|') || 'пункты должны называться «Обо мне», «Навыки», «Расписание», «Контакты»'; } },
        { name: 'Каждый якорь ведёт на существующий id', check: h => { const bad = h.$$('a[href^="#"]').map(e => e.getAttribute('href')).filter(x => x.length < 2 || !h.doc.getElementById(x.slice(1))); return !bad.length || `не найдено, куда ведёт: ${bad.join(', ')}`; } },
        { name: 'В конце каждого из 4 разделов — ссылка «Наверх» на #top', check: h => {
          const tops = h.$$('a[href="#top"]'), hs = h.$$('h2');
          if (tops.length !== 4) return `ссылок на #top: ${tops.length}, нужно 4`;
          if (tops.some(a => !/наверх/i.test(a.textContent))) return 'текст ссылки — «Наверх»';
          const ok = hs.every((s, i) => tops.some(a => h.before(s, a) && (!hs[i + 1] || h.before(a, hs[i + 1]))));
          return ok || 'в каждом разделе, после текста и до следующего h2, должна быть своя ссылка «Наверх»';
        } }
      ]
    },
    {
      id: 'k0802', lesson: 'mdk-08', module: 'mdk1', mech: 'fix',
      title: 'Почините навигацию', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Практикант сделал страницу библиотеки колледжа. Меню есть, но ни один пункт не переносит туда, куда надо, а внешняя ссылка открывается небезопасно.',
      goal: 'Исправьте ошибки. Пункты меню ведут на #hours, #rules, #new-books, #contacts, и у разделов ровно такие id (без пробелов и без решётки). Текст четвёртого пункта — «Контакты», как у раздела. У ссылки на электронную библиотеку, которая открывается в новой вкладке, есть rel="noopener". Ссылка «Наверх» ведёт на #top. Каждый якорь на странице должен вести на существующий id.',
      hints: [
        'Проверьте каждую пару «ссылка — id» по очереди: в href есть #, в id — нет, буквы совпадают, включая регистр.',
        'В id нельзя пробел: «new books» превратите в «new-books» и в заголовке, и в ссылке.',
        '«Нажмите сюда» — плохой текст ссылки. Пункт меню должен называться как раздел.',
        'У ссылки с target="_blank" допишите rel="noopener". «Наверх» — это href="#top".'
      ],
      html: `<h1 id="top">Библиотека колледжа</h1>
<ul>
  <li><a href="hours">Часы работы</a></li>
  <li><a href="#Rules">Правила</a></li>
  <li><a href="#new books">Новинки</a></li>
  <li><a href="#contacts">Нажмите сюда</a></li>
</ul>

<h2 id="hours">Часы работы</h2>
<p>Понедельник — пятница: с 9:00 до 18:00. Суббота: с 10:00 до 14:00.</p>

<h2 id="rules">Правила</h2>
<p>Книги выдаются на две недели по студенческому билету. Продлить срок можно один раз.</p>

<h2 id="new books">Новинки</h2>
<p>В сентябре пришли учебники по веб-дизайну и вёрстке. Их можно читать и онлайн в <a href="https://elib.example.ru" target="_blank">электронной библиотеке колледжа</a>.</p>

<h2 id="#contacts">Контакты</h2>
<p>Корпус 1, кабинет 107. Почта: <a href="mailto:library@example.ru">library@example.ru</a></p>

<p><a href="top">Наверх</a></p>`,
      css: `${BASE}
h1 { color: #1f4e79; }
h2 { color: #1f4e79; margin-top: 28px; }`,
      tests: [
        { name: 'Меню ведёт на #hours, #rules, #new-books, #contacts', check: h => { const a = h.$$('ul li a').map(e => e.getAttribute('href')); return a.join(' ') === '#hours #rules #new-books #contacts' || `сейчас: ${a.join(' ')}`; } },
        { name: 'У разделов id: hours, rules, new-books, contacts', check: h => { const ids = h.$$('h2').map(e => e.id); return ids.join(' ') === 'hours rules new-books contacts' || `сейчас: ${ids.map(x => `«${x}»`).join(' ')}`; } },
        { name: 'В id нет пробелов и решёток', check: h => { const bad = h.$$('[id]').map(e => e.id).filter(x => /[\s#]/.test(x)); return !bad.length || `плохие id: ${bad.map(x => `«${x}»`).join(', ')}`; } },
        { name: 'Пункты меню называются как разделы', check: h => { const a = h.$$('ul li a').map(e => e.textContent.trim()).join('|'), t = h.$$('h2').map(e => e.textContent.trim()).join('|'); return a === t || `пункты: ${a.replace(/\|/g, ', ')}`; } },
        { name: 'У ссылки с target="_blank" есть rel="noopener"', check: h => { const a = h.$$('a[target="_blank"]'); return a.length >= 1 && a.every(e => /\bnoopener\b/.test(e.getAttribute('rel') || '')) || (a.length ? 'нет rel="noopener"' : 'ссылка на электронную библиотеку должна открываться в новой вкладке'); } },
        { name: 'Ссылка «Наверх» ведёт на #top', check: h => { const a = h.$$('a').find(e => /наверх/i.test(e.textContent)); return a?.getAttribute('href') === '#top' || `сейчас href: «${a?.getAttribute('href') || 'нет ссылки'}»`; } },
        { name: 'Каждый якорь ведёт на существующий id', check: h => { const bad = h.$$('a[href^="#"]').map(e => e.getAttribute('href')).filter(x => { try { return !h.doc.getElementById(decodeURIComponent(x.slice(1))) || /\s/.test(x); } catch (e) { return true; } }); return !bad.length || `ведут в никуда: ${bad.join(', ')}`; } }
      ]
    },
    {
      id: 'k0803', lesson: 'mdk-08', module: 'mdk1', mech: 'build',
      title: 'Страница 404', level: 'Среднее', minutes: 30, points: 150,
      story: 'В рассылке колледжа опечатались в адресе, и сотня студентов попала на несуществующую страницу. Сделайте страницу 404, которая не бросит их в тупике.',
      goal: 'Соберите страницу «не найдено». Заголовок h1 «Страница не найдена». Под ним абзац, где есть код ошибки 404 и спокойное объяснение (не меньше 40 символов). Картинка img/art.svg — украшение, поэтому у неё пустой alt="". Список ul минимум из трёх ссылок на страницы сайта: обязательно index.html (главная) и ещё две, например schedule.html и contacts.html — только относительные пути к .html-файлам. В конце — абзац со ссылкой mailto: на почту, чтобы сообщить о сломанной ссылке. Ни одна ссылка не называется «здесь», «тут», «сюда», «подробнее» или «нажмите».',
      hints: [
        'Порядок: h1 → абзац с «404» → картинка → список ссылок → абзац с почтой.',
        'Декоративная картинка: <img src="img/art.svg" alt="">. Пустой alt говорит программе экранного чтения: «пропусти».',
        'Ссылки в списке: <li><a href="index.html">Главная</a></li>. Без https:// и без решёток.',
        'Почта: <p>Нашли сломанную ссылку? Напишите на <a href="mailto:site@example.ru">site@example.ru</a>.</p>'
      ],
      html: `<!-- Страница 404: заголовок, объяснение, картинка, ссылки на разделы, почта -->
`,
      css: `${BASE}
h1 { color: #8a3b12; }
img { display: block; margin: 16px 0; }
li { margin-bottom: 6px; }`,
      tests: [
        { name: 'Заголовок h1 «Страница не найдена»', check: h => h.count('h1') === 1 && /страница не найдена/i.test(h.text('h1')) || (h.count('h1') ? `сейчас: «${h.text('h1')}»` : 'нет h1') },
        { name: 'После h1 абзац с кодом 404 и объяснением', check: h => { const p = h.$$('p').find(e => /404/.test(e.textContent)); if (!p) return 'нет абзаца с «404»'; if (!h.before('h1', p)) return 'абзац должен стоять после h1'; return p.textContent.replace(/\s+/g, ' ').trim().length >= 40 || 'объяснение слишком короткое'; } },
        { name: 'Картинка img/art.svg с пустым alt', check: h => { const i = h.$('img[src$="art.svg"]'); if (!i) return 'нет картинки img/art.svg'; return i.getAttribute('alt') === '' || 'картинка — украшение, alt должен быть пустым: alt=""'; } },
        { name: 'Список из 3+ ссылок на страницы сайта, среди них index.html', check: h => {
          const a = h.$$('ul li a');
          if (a.length < 3) return `ссылок в списке: ${a.length}`;
          const href = a.map(e => e.getAttribute('href') || '');
          const bad = href.filter(x => !/^[\w./-]+\.html(#[\w-]+)?$/i.test(x) || /^\//.test(x));
          if (bad.length) return `не относительный путь к .html: ${bad[0]}`;
          return href.some(x => /^(\.\/)?index\.html$/i.test(x)) || 'нет ссылки на index.html';
        } },
        { name: 'Есть ссылка mailto: после списка', check: h => { const m = h.$('a[href^="mailto:"]'); return !!m && h.before('ul', m) || (m ? 'почту поставьте после списка' : 'нет ссылки mailto:'); } },
        { name: 'Тексты ссылок понятны без окружения', check: h => { const bad = h.$$('a').filter(e => /^(здесь|тут|сюда|подробнее|нажмите.*|жми.*)$/i.test(e.textContent.trim())); return !bad.length || `плохой текст ссылки: «${bad[0].textContent.trim()}»`; } }
      ]
    }
  );
})();
/* ---- content/tasks/k09.js ---- */
/* Занятие 9. Фреймы и плавающие фреймы */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k0901', lesson: 'mdk-09', module: 'mdk1', mech: 'build',
      title: 'Карта в контактах', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Первокурсники каждый сентябрь ищут второй корпус колледжа. На странице «Контакты» нужна схема проезда прямо на странице и ссылка, чтобы открыть её крупно.',
      goal: 'После абзаца с адресом вставьте iframe со схемой: src="img/course/k09-map.svg", title с понятным описанием (не короче 10 символов), width="600", height="300" и loading="lazy". Под фреймом добавьте абзац со ссылкой на тот же файл img/course/k09-map.svg, которая открывается в новой вкладке (target="_blank" и rel="noopener"). Абзац с адресом не удаляйте.',
      hints: [
        'Фрейм пишется парой тегов, внутри пусто: <iframe src="…" …></iframe>.',
        'title описывает содержимое: «Схема проезда ко второму корпусу колледжа».',
        'Ширина и высота — атрибуты без «px»: width="600" height="300". Ленивая загрузка — loading="lazy".',
        'Ссылка: <p><a href="img/course/k09-map.svg" target="_blank" rel="noopener">Открыть схему в новой вкладке</a></p>'
      ],
      html: `<h1>Контакты</h1>
<p>Корпус 2: ул. Ленина, 15. Вход со двора, через арку у библиотеки.</p>
<!-- Здесь будет фрейм со схемой проезда -->

<!-- Здесь будет ссылка на схему в новой вкладке -->
`,
      css: `${BASE}
h1 { color: #8e1f14; }
iframe { border: 1px solid #999999; }`,
      tests: [
        { name: 'Есть один iframe со схемой img/course/k09-map.svg', check: h => h.count('iframe') === 1 && /(^|\/)img\/course\/k09-map\.svg$/.test(h.$('iframe').getAttribute('src') || '') || (h.count('iframe') ? `src: «${h.$('iframe').getAttribute('src') || ''}»` : 'нет iframe') },
        { name: 'У фрейма понятный title (от 10 символов)', check: h => (h.$('iframe')?.getAttribute('title') || '').trim().length >= 10 || 'title пустой или слишком короткий' },
        { name: 'Размер фрейма: width="600" height="300"', check: h => { const f = h.$('iframe'); return !!f && f.getAttribute('width') === '600' && f.getAttribute('height') === '300' || `сейчас: ${f?.getAttribute('width') || '—'} × ${f?.getAttribute('height') || '—'}`; } },
        { name: 'Фрейм грузится лениво: loading="lazy"', check: h => h.$('iframe')?.getAttribute('loading') === 'lazy' || 'нет loading="lazy"' },
        { name: 'Фрейм стоит после абзаца с адресом', check: h => { const p = h.$$('p').find(e => /Ленина/.test(e.textContent)); return !!p && h.before(p, 'iframe') || (p ? 'фрейм должен быть под адресом' : 'абзац с адресом удалён'); } },
        { name: 'Под фреймом ссылка на схему в новой вкладке с rel="noopener"', check: h => { const a = h.$$('a').find(e => /k09-map\.svg$/.test(e.getAttribute('href') || '')); if (!a) return 'нет ссылки на img/course/k09-map.svg'; if (!h.before('iframe', a)) return 'ссылка должна быть под фреймом'; return a.getAttribute('target') === '_blank' && /\bnoopener\b/.test(a.getAttribute('rel') || '') || 'нужны target="_blank" и rel="noopener"'; } }
      ]
    },
    {
      id: 'k0902', lesson: 'mdk-09', module: 'mdk1', mech: 'a11y',
      title: 'Почините встраивание', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Страницу музыкального кружка собрали из кусков кода, найденных в интернете. Незрячий участник кружка слышит только «фрейм, фрейм», а проверяющий нашёл устаревшие атрибуты и лишние разрешения.',
      goal: 'Исправьте оба фрейма. У каждого есть свой понятный title (не короче 10 символов, у двух фреймов разные). Устаревших атрибутов frameborder и scrolling нет: рамку уже убирает CSS. У обоих loading="lazy". Видеофрейму разрешён только полный экран: allow="fullscreen". Фрейм с чужим виджетом заперт в песочницу: атрибут sandbox без значения.',
      hints: [
        'Начните с title: «Видео: отчётный концерт кружка», «Виджет: расписание репетиций».',
        'frameborder="0" и scrolling="no" просто удалите — в CSS уже есть iframe { border: 0; }.',
        'В allow оставьте одно значение: allow="fullscreen". Камера и местоположение плееру не нужны.',
        'Песочница без значения: <iframe … sandbox></iframe>.'
      ],
      html: `<h1>Музыкальный кружок</h1>
<h2>Отчётный концерт</h2>
<iframe src="img/art.svg" width="560" height="315" frameborder="0" scrolling="no" allow="camera; microphone; geolocation; fullscreen"></iframe>
<p>Запись концерта 20 мая: гитара, вокал и школьный хор.</p>

<h2>Расписание репетиций</h2>
<iframe src="img/icon.svg" width="200" height="200" frameborder="0"></iframe>
<p>Виджет предоставлен сайтом городского дома культуры.</p>`,
      css: `${BASE}
h1 { color: #4a2c7a; }
h2 { color: #4a2c7a; }
iframe { border: 0; display: block; }`,
      tests: [
        { name: 'У каждого фрейма понятный title (от 10 символов)', check: h => { const f = h.$$('iframe'); return f.length === 2 && f.every(e => (e.getAttribute('title') || '').trim().length >= 10) || 'у фрейма нет title или он короче 10 символов'; } },
        { name: 'Названия двух фреймов разные', check: h => { const t = h.$$('iframe').map(e => (e.getAttribute('title') || '').trim().toLowerCase()); return t.length === 2 && t[0] && t[0] !== t[1] || 'title должны различаться'; } },
        { name: 'Нет устаревших frameborder и scrolling', check: h => !h.$('iframe[frameborder], iframe[scrolling]') || 'удалите frameborder и scrolling' },
        { name: 'Оба фрейма грузятся лениво', check: h => { const f = h.$$('iframe'); return f.length === 2 && f.every(e => e.getAttribute('loading') === 'lazy') || 'нужно loading="lazy" у обоих'; } },
        { name: 'Видео разрешён только полный экран', check: h => { const v = h.$('iframe[src$="art.svg"]'); return (v?.getAttribute('allow') || '').trim().replace(/;$/, '') === 'fullscreen' || `сейчас allow: «${v?.getAttribute('allow') || ''}»`; } },
        { name: 'Виджет в песочнице: пустой sandbox', check: h => { const w = h.$('iframe[src$="icon.svg"]'); if (!w || !w.hasAttribute('sandbox')) return 'у виджета нет sandbox'; return w.getAttribute('sandbox').trim() === '' || 'песочница должна быть пустой: sandbox без значения'; } }
      ]
    },
    {
      id: 'k0903', lesson: 'mdk-09', module: 'mdk1', mech: 'build',
      title: 'Окно предпросмотра', level: 'Среднее', minutes: 25, points: 150,
      story: 'Кружок дизайна выкладывает работы студентов. Хочется, чтобы работа открывалась в окне рядом со списком, а сама страница никуда не уходила.',
      goal: 'Сделайте галерею. Заголовок h2 «Работы студентов». Под ним список ul из трёх ссылок: «Пейзаж» на img/art.svg, «Иконка» на img/icon.svg, «Схема проезда» на img/course/k09-map.svg. Каждая ссылка открывается во фрейме: target="preview". Под списком — iframe с name="preview", понятным title (не короче 10 символов), width="600", height="300", а сразу в нём показана первая работа: src="img/art.svg".',
      hints: [
        'Сначала сделайте обычный список ссылок, как меню: <ul><li><a href="img/art.svg">Пейзаж</a></li>…</ul>.',
        'Каждой ссылке допишите target="preview" — это имя окна, куда она откроется.',
        'Фрейм: <iframe src="img/art.svg" name="preview" title="Предпросмотр работы студента" width="600" height="300"></iframe>.',
        'Если ссылка открывается в новой вкладке, значит имя в target и в name не совпадает.'
      ],
      html: `<h1>Кружок дизайна</h1>
<p>Нажмите на название работы, чтобы посмотреть её в окне ниже.</p>
<!-- Здесь будут заголовок h2, список ссылок и фрейм -->
`,
      css: `${BASE}
h1 { color: #1f4e79; }
h2 { color: #1f4e79; }
li { margin-bottom: 6px; }
iframe { border: 2px solid #1f4e79; }`,
      tests: [
        { name: 'Заголовок h2 «Работы студентов»', check: h => /работы студентов/i.test(h.text('h2')) || 'нет h2 «Работы студентов»' },
        { name: 'В списке три ссылки: art.svg, icon.svg, k09-map.svg', check: h => { const a = h.$$('ul li a').map(e => (e.getAttribute('href') || '').replace(/^\.\//, '')); return a.join(' ') === 'img/art.svg img/icon.svg img/course/k09-map.svg' || `сейчас: ${a.join(', ') || 'нет ссылок в списке'}`; } },
        { name: 'Тексты ссылок: Пейзаж, Иконка, Схема проезда', check: h => { const a = h.$$('ul li a').map(e => e.textContent.trim()); return a.join('|') === 'Пейзаж|Иконка|Схема проезда' || `сейчас: ${a.join(', ') || '—'}`; } },
        { name: 'У фрейма name="preview" и понятный title', check: h => { const f = h.$('iframe'); if (!f) return 'нет iframe'; if (f.getAttribute('name') !== 'preview') return `name: «${f.getAttribute('name') || ''}»`; return (f.getAttribute('title') || '').trim().length >= 10 || 'title пустой или короче 10 символов'; } },
        { name: 'Все ссылки открываются во фрейме: target="preview"', check: h => { const a = h.$$('ul li a'); return a.length === 3 && a.every(e => e.getAttribute('target') === 'preview') || 'у каждой ссылки нужен target="preview"'; } },
        { name: 'Фрейм под списком, сразу показывает img/art.svg, размер 600 × 300', check: h => { const f = h.$('iframe'); if (!f) return 'нет iframe'; if (!h.before('ul', f)) return 'фрейм должен стоять под списком'; if ((f.getAttribute('src') || '').replace(/^\.\//, '') !== 'img/art.svg') return 'src фрейма — img/art.svg'; return f.getAttribute('width') === '600' && f.getAttribute('height') === '300' || 'нужно width="600" height="300"'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k10.js ---- */
/* Занятие 10. Формы */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Поле подписано: label for=id или поле внутри label
  const labelled = (h, el) => !!el && ((el.id && !!h.doc.querySelector(`label[for="${el.id}"]`)) || !!el.closest('label'));
  window.COURSE_TASKS.push(
    {
      id: 'k1001', lesson: 'mdk-10', module: 'mdk1', mech: 'build',
      title: 'Обратная связь', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Кафе «Пенка» у колледжа хочет знать, что студенты думают о новом меню. Нужна простая форма отзыва.',
      goal: 'Соберите форму form с action="/feedback" и method="post". Внутри три подписанных поля (label for + id): «Имя» — input type="text" с name="name", «Почта» — input type="email" с name="email», «Отзыв» — textarea с name="message". В конце — кнопка button type="submit" с текстом «Отправить».',
      hints: [
        'Каркас: <form action="/feedback" method="post"> … </form>. Всё остальное — внутри.',
        'Каждое поле — пара: <label for="name">Имя</label> и <input type="text" id="name" name="name">.',
        'Отзыв — парный тег: <textarea id="message" name="message" rows="4"></textarea>.',
        'Кнопка: <button type="submit">Отправить</button>.'
      ],
      html: `<h1>Отзыв о кафе «Пенка»</h1>
<p>Расскажите, что понравилось, а что нет. Мы читаем каждый отзыв.</p>
<!-- Здесь будет форма -->
`,
      css: `${BASE}
h1 { color: #6b3e1f; }
label { display: block; margin-top: 12px; }`,
      tests: [
        { name: 'Форма с action="/feedback" и method="post"', check: h => { const f = h.$('form'); if (!f) return 'нет form'; return f.getAttribute('action') === '/feedback' && (f.getAttribute('method') || '').toLowerCase() === 'post' || `action: «${f.getAttribute('action') || ''}», method: «${f.getAttribute('method') || ''}»`; } },
        { name: 'Поле имени: input type="text" name="name"', check: h => !!h.$('form input[type="text"][name="name"]') || 'нет input type="text" с name="name" внутри формы' },
        { name: 'Поле почты: input type="email" name="email"', check: h => !!h.$('form input[type="email"][name="email"]') || 'нет input type="email" с name="email"' },
        { name: 'Отзыв: textarea name="message"', check: h => !!h.$('form textarea[name="message"]') || 'нет textarea с name="message"' },
        { name: 'Все три поля подписаны через label', check: h => { const f = h.$$('form input, form textarea'); return f.length >= 3 && f.every(e => labelled(h, e)) || 'у каждого поля нужен label с for, равным id поля'; } },
        { name: 'Кнопка button type="submit" «Отправить» в конце формы', check: h => { const b = h.$('form button'); if (!b) return 'нет button внутри формы'; if (b.getAttribute('type') !== 'submit') return 'нужен type="submit"'; if (!/отправить/i.test(b.textContent)) return 'текст кнопки — «Отправить»'; return h.before('form textarea', b) || 'кнопка должна быть после полей'; } }
      ]
    },
    {
      id: 'k1002', lesson: 'mdk-10', module: 'mdk1', mech: 'fix',
      title: 'Почините анкету', level: 'Среднее', minutes: 20, points: 150,
      story: 'Анкета первокурсника собирает личные данные, но сделана наспех: подписи не работают, почту можно ввести без @, а форму обучения можно выбрать сразу всю.',
      goal: 'Исправьте форму. Метод отправки — post (данные личные). Почта — type="email", телефон — type="tel", возраст — type="number" с min="14" и max="99". У каждого поля есть подпись label, связанная с ним через for и id (проверьте и телефон: for и id должны совпадать). Переключатели «Очная» и «Заочная» — одна группа: name="study". Флажок «Получать новости» подписан. Вместо div — настоящая кнопка button type="submit" «Отправить анкету». Атрибуты name у полей не меняйте (кроме переключателей).',
      hints: [
        'Начните с form: method="post". Потом пройдите по полям сверху вниз.',
        'Подпись к имени: оберните слово «Имя» в <label for="name"> и дайте полю id="name". У телефона for="phone", значит и id="phone".',
        'Переключатели: у обоих name="study", а value разные — "day" и "extramural".',
        'Флажок: <input type="checkbox" id="news" name="news"> <label for="news">Получать новости</label>. Кнопка: <button type="submit">Отправить анкету</button>.'
      ],
      html: `<h1>Анкета первокурсника</h1>
<form action="/anketa" method="get">
  <p>Имя <input type="text" name="name"></p>
  <p><label>Почта</label> <input type="text" name="email"></p>
  <p><label for="phone">Телефон</label> <input type="text" id="tel" name="phone"></p>
  <p><label for="age">Возраст</label> <input type="text" id="age" name="age"></p>
  <p>Форма обучения:</p>
  <p>
    <input type="radio" id="day" name="study1" value="day"> <label for="day">Очная</label>
    <input type="radio" id="extramural" name="study2" value="extramural"> <label for="extramural">Заочная</label>
  </p>
  <p><input type="checkbox" name="news"> Получать новости</p>
  <div>Отправить анкету</div>
</form>`,
      css: `${BASE}
h1 { color: #1f4e79; }
form { max-width: 480px; }`,
      tests: [
        { name: 'Форма отправляется методом post', check: h => (h.$('form')?.getAttribute('method') || '').toLowerCase() === 'post' || 'method должен быть post' },
        { name: 'Почта — type="email", телефон — type="tel"', check: h => { const e = h.$('[name="email"]'), p = h.$('[name="phone"]'); return e?.type === 'email' && p?.type === 'tel' || `почта: ${e?.type || 'нет поля'}, телефон: ${p?.type || 'нет поля'}`; } },
        { name: 'Возраст — type="number" от 14 до 99', check: h => { const a = h.$('[name="age"]'); if (!a) return 'нет поля age'; if (a.type !== 'number') return `тип: ${a.type}`; return a.getAttribute('min') === '14' && a.getAttribute('max') === '99' || 'нужны min="14" и max="99"'; } },
        { name: 'Имя, почта, телефон и возраст подписаны через label', check: h => { const bad = ['name', 'email', 'phone', 'age'].filter(n => !labelled(h, h.$(`[name="${n}"]`))); return !bad.length || `без связанной подписи: ${bad.join(', ')}`; } },
        { name: 'Переключатели — одна группа name="study" с разными value', check: h => { const r = h.$$('input[type="radio"]'); return r.length === 2 && r.every(e => e.name === 'study') && r[0].value !== r[1].value || `name у переключателей: ${r.map(e => e.name).join(', ')}`; } },
        { name: 'Флажок «Получать новости» подписан', check: h => { const c = h.$('input[type="checkbox"]'); if (!c) return 'нет флажка'; return labelled(h, c) || 'нет связанной подписи у флажка'; } },
        { name: 'Кнопка button type="submit" «Отправить анкету»', check: h => { const b = h.$('form button'); return !!b && b.getAttribute('type') === 'submit' && /отправить анкету/i.test(b.textContent) || (b ? 'нужен type="submit" и текст «Отправить анкету»' : 'нет button в форме'); } },
        { name: 'Кнопки из div нет', check: h => !h.$$('form div').some(d => /отправить/i.test(d.textContent)) || 'уберите div «Отправить анкету»' }
      ]
    },
    {
      id: 'k1003', lesson: 'mdk-10', module: 'mdk1', mech: 'build',
      title: 'Запись в спортзал', level: 'Среднее', minutes: 25, points: 150,
      story: 'Спортзал колледжа открыл запись на пробную тренировку. Администратор просит форму вместо очереди у стойки.',
      goal: 'Соберите форму form (action="/gym", method="post") из двух групп fieldset с legend. Группа «Ваши данные»: имя — input type="text" name="name" required; телефон — input type="tel" name="phone" required с pattern="\\+7[0-9]{10}" и placeholder="+79001234567". Группа «Тренировка»: время — три переключателя name="time" со значениями morning, day, evening; тренер — select name="coach" минимум с тремя пунктами option, у каждого есть value (первый — подсказка с value=""); дата — input type="date" name="date" с атрибутом min; число человек — input type="number" name="people" с min="1" max="5". После групп — флажок name="agree" required с подписью «Согласен с правилами зала» и кнопка button type="submit" «Записаться». Все поля подписаны через label.',
      hints: [
        'Сначала каркас: form → fieldset с legend «Ваши данные» → fieldset с legend «Тренировка» → флажок → кнопка.',
        'Телефон: <input type="tel" id="phone" name="phone" required pattern="\\+7[0-9]{10}" placeholder="+79001234567">.',
        'Переключатели: три пары input type="radio" name="time" с value="morning", "day", "evening" и подписями «Утро», «День», «Вечер».',
        'Тренер: <select id="coach" name="coach"><option value="">Выберите тренера</option><option value="ivanov">Иванов</option>…</select>. Дата: <input type="date" id="date" name="date" min="2026-09-01">.'
      ],
      html: `<h1>Пробная тренировка</h1>
<p>Первая тренировка бесплатная. Поля со звёздочкой обязательны.</p>
<!-- Здесь будет форма записи -->
`,
      css: `${BASE}
h1 { color: #1d5c3a; }
fieldset { margin-bottom: 16px; border: 1px solid #8aa596; }
legend { font-weight: bold; color: #1d5c3a; }`,
      tests: [
        { name: 'Форма с action="/gym" и method="post"', check: h => { const f = h.$('form'); return !!f && f.getAttribute('action') === '/gym' && (f.getAttribute('method') || '').toLowerCase() === 'post' || (f ? 'проверьте action и method' : 'нет form'); } },
        { name: 'Две группы fieldset с legend «Ваши данные» и «Тренировка»', check: h => { const l = h.$$('form fieldset > legend').map(e => e.textContent.trim()); return h.count('form fieldset') === 2 && /ваши данные/i.test(l[0] || '') && /тренировка/i.test(l[1] || '') || `legend: ${l.join(', ') || 'нет'}`; } },
        { name: 'Имя и телефон в первой группе, обязательные', check: h => { const fs = h.$$('fieldset')[0]; if (!fs) return 'нет первой группы'; const n = fs.querySelector('input[type="text"][name="name"]'), p = fs.querySelector('input[type="tel"][name="phone"]'); if (!n || !p) return 'нужны input type="text" name="name" и input type="tel" name="phone"'; return n.required && p.required || 'имя и телефон — required'; } },
        { name: 'Телефон проверяется шаблоном +7 и 10 цифр', check: h => { const p = h.$('[name="phone"]'); const pat = p?.getAttribute('pattern'); if (!pat) return 'нет pattern'; let re; try { re = new RegExp('^(?:' + pat + ')$', 'v'); } catch (e) { return 'ошибка в pattern'; } if (!re.test('+79001234567') || re.test('89001234567') || re.test('+7900123')) return 'pattern должен пропускать только +7 и 10 цифр'; return !!p.getAttribute('placeholder') || 'нет placeholder с примером'; } },
        { name: 'Время: три переключателя name="time" — morning, day, evening', check: h => { const v = h.$$('input[type="radio"][name="time"]').map(e => e.value).join(' '); return v === 'morning day evening' || `сейчас value: ${v || 'нет переключателей'}`; } },
        { name: 'Тренер: select name="coach", от 3 пунктов, у всех value', check: h => { const s = h.$('select[name="coach"]'); if (!s) return 'нет select name="coach"'; const o = [...s.options]; if (o.length < 3) return `пунктов: ${o.length}`; if (!o.every(e => e.hasAttribute('value'))) return 'у каждого option нужен value'; return o[0].value === '' || 'первый пункт — подсказка с value=""'; } },
        { name: 'Дата с min и число человек от 1 до 5', check: h => { const d = h.$('input[type="date"][name="date"]'), n = h.$('input[type="number"][name="people"]'); if (!d || !d.getAttribute('min')) return 'нужен input type="date" name="date" с min'; return !!n && n.getAttribute('min') === '1' && n.getAttribute('max') === '5' || 'нужен input type="number" name="people" min="1" max="5"'; } },
        { name: 'Обязательный флажок согласия после групп', check: h => { const c = h.$('input[type="checkbox"][name="agree"]'); if (!c) return 'нет флажка name="agree"'; if (!c.required) return 'флажок должен быть required'; if (c.closest('fieldset')) return 'флажок — после групп, вне fieldset'; return labelled(h, c) || 'у флажка нет подписи'; } },
        { name: 'Все поля формы подписаны через label', check: h => { const bad = h.$$('form input, form select, form textarea').filter(e => !labelled(h, e)); return !bad.length || `без подписи: ${bad.map(e => e.name || e.type).join(', ')}`; } },
        { name: 'Кнопка button type="submit" «Записаться» в конце', check: h => { const b = h.$('form button'); return !!b && b.getAttribute('type') === 'submit' && /записаться/i.test(b.textContent) && h.before('[name="agree"]', b) || 'нужна кнопка «Записаться» с type="submit" после флажка'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k11.js ---- */
/* Занятие 11. Практическая работа №3. Создание формы на HTML-странице */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Подпись поля: label for=id или label, внутри которого поле
  const labelOf = (h, el) => el && ((el.id && h.doc.querySelector(`label[for="${el.id}"]`)) || el.closest('label'));
  window.COURSE_TASKS.push(
    {
      id: 'k1101', lesson: 'mdk-11', module: 'mdk1', mech: 'build',
      title: 'Форма записи на курс', level: 'Среднее', minutes: 35, points: 150,
      story: 'Колледж открывает вечерние курсы для всех желающих. Администратор устал записывать людей по телефону и просит форму на сайт.',
      goal: 'Соберите форму form (action="/enroll", method="post"). Группа fieldset «Контактные данные»: имя — type="text" name="name", почта — type="email" name="email" (обе обязательные), телефон — type="tel" name="phone" с pattern="\\+7[0-9]{10}" и placeholder. Группа fieldset «Курс»: select name="course" (обязательный, от 3 пунктов, у каждого value, первый — подсказка с value=""); вложенный fieldset с legend «Формат занятий» и двумя переключателями name="format" со значениями offline и online (выбор обязателен); дата type="date" name="start" с min; textarea name="comment". После групп — обязательный флажок name="agree" (согласие на обработку данных) и кнопка button type="submit" «Записаться на курс». Каждое поле подписано через label. У обязательных полей в подписи есть звёздочка *, у группы переключателей — в legend.',
      hints: [
        'Начните с каркаса: form → fieldset «Контактные данные» → fieldset «Курс» → флажок → кнопка. Поля пишите, когда каркас готов.',
        'Обязательное поле: <label for="name">Имя *</label> <input type="text" id="name" name="name" required>.',
        'Формат — группа внутри группы: <fieldset><legend>Формат занятий *</legend> два radio с name="format" и required у первого </fieldset>.',
        'Флажок и кнопка — после второго </fieldset>, но до </form>: <input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен на обработку данных *</label>.'
      ],
      html: `<h1>Запись на вечерние курсы</h1>
<p>Поля со звёздочкой * обязательны. Мы пришлём подтверждение на почту.</p>
<!-- Здесь будет форма. Сначала каркас: form, два fieldset, флажок, кнопка -->
`,
      css: `${BASE}
h1 { color: #1f4e79; }
fieldset { margin-bottom: 16px; }
legend { font-weight: bold; }`,
      tests: [
        { name: 'Форма с action="/enroll" и method="post"', check: h => { const f = h.$('form'); return !!f && f.getAttribute('action') === '/enroll' && (f.getAttribute('method') || '').toLowerCase() === 'post' || (f ? 'проверьте action и method' : 'нет form'); } },
        { name: 'Две группы: «Контактные данные» и «Курс»', check: h => { const l = h.$$('form > fieldset > legend').map(e => e.textContent.trim()); return l.length === 2 && /контактные данные/i.test(l[0]) && /^курс/i.test(l[1]) || `группы верхнего уровня: ${l.join(', ') || 'нет'}`; } },
        { name: 'Имя, почта, телефон — в первой группе, с правильными типами', check: h => { const fs = h.$('form > fieldset'); if (!fs) return 'нет группы'; const ok = fs.querySelector('input[type="text"][name="name"]') && fs.querySelector('input[type="email"][name="email"]') && fs.querySelector('input[type="tel"][name="phone"]'); return !!ok || 'нужны text name="name", email name="email", tel name="phone"'; } },
        { name: 'Имя и почта обязательные, телефон проверяется шаблоном', check: h => { if (!h.$('[name="name"]')?.required || !h.$('[name="email"]')?.required) return 'имя и почта — required'; const p = h.$('[name="phone"]'), pat = p?.getAttribute('pattern'); if (!pat) return 'у телефона нет pattern'; let re; try { re = new RegExp('^(?:' + pat + ')$', 'v'); } catch (e) { return 'ошибка в pattern'; } return re.test('+79001234567') && !re.test('89001234567') && !!p.getAttribute('placeholder') || 'pattern для +7 и 10 цифр и placeholder с примером'; } },
        { name: 'Курс: обязательный select name="course", от 3 пунктов с value', check: h => { const s = h.$('form > fieldset:nth-of-type(2) select[name="course"]'); if (!s) return 'нет select name="course" во второй группе'; const o = [...s.options]; if (!s.required) return 'select должен быть required'; if (o.length < 3 || !o.every(e => e.hasAttribute('value'))) return 'от 3 пунктов, у каждого value'; return o[0].value === '' || 'первый пункт — подсказка с value=""'; } },
        { name: 'Формат: вложенный fieldset с legend и переключателями offline, online', check: h => { const fs = h.$('form fieldset fieldset'); if (!fs) return 'нет вложенного fieldset'; if (!/формат/i.test(fs.querySelector('legend')?.textContent || '')) return 'legend вложенной группы — «Формат занятий»'; const r = [...fs.querySelectorAll('input[type="radio"]')]; if (r.map(e => e.name + '=' + e.value).join(' ') !== 'format=offline format=online') return 'два radio name="format" со значениями offline и online'; return r.some(e => e.required) || 'выбор формата обязателен: required'; } },
        { name: 'Дата name="start" с min и комментарий textarea name="comment"', check: h => { const d = h.$('input[type="date"][name="start"]'); if (!d || !d.getAttribute('min')) return 'нужен input type="date" name="start" с min'; return !!h.$('textarea[name="comment"]') || 'нет textarea name="comment"'; } },
        { name: 'Обязательное согласие и кнопка «Записаться на курс» после групп', check: h => { const c = h.$('input[type="checkbox"][name="agree"]'), b = h.$('form button'); if (!c || !c.required) return 'нужен флажок name="agree" с required'; if (c.closest('fieldset')) return 'флажок — после групп'; if (!b || b.getAttribute('type') !== 'submit' || !/записаться на курс/i.test(b.textContent)) return 'нужна кнопка button type="submit" «Записаться на курс»'; if (b.closest('fieldset')) return 'кнопка — вне fieldset'; return h.before(c, b) || 'кнопка — после флажка'; } },
        { name: 'Все поля подписаны через label', check: h => { const bad = h.$$('form input, form select, form textarea').filter(e => !labelOf(h, e)); return !bad.length || `без подписи: ${bad.map(e => e.name || e.type).join(', ')}`; } },
        { name: 'У обязательных полей в подписи звёздочка *', check: h => { const bad = h.$$('form [required]').filter(e => e.type !== 'radio' && !/\*/.test(labelOf(h, e)?.textContent || '')).map(e => e.name); const leg = h.$('form fieldset fieldset legend'); if (leg && !/\*/.test(leg.textContent)) bad.push('формат (в legend)'); return !bad.length || `нет звёздочки: ${bad.join(', ')}`; } }
      ]
    },
    {
      id: 'k1102', lesson: 'mdk-11', module: 'mdk1', mech: 'a11y',
      title: 'Регистрация на олимпиаду', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма регистрации на олимпиаду по информатике выглядит прилично, но участник с программой экранного чтения не смог в ней зарегистрироваться: он слышал только «поле ввода, поле ввода».',
      goal: 'Исправьте форму. У полей ФИО, почты и пароля есть подписи label, связанные через for и id; в подписях звёздочка: «ФИО *», «Почта *», «Пароль *». Эти три поля обязательные (required). Пароль скрыт: type="password", и не короче 8 символов: minlength="8". Переключатели курса собраны в fieldset с legend «Курс *», а лишний абзац «Курс:» удалён; выбор курса обязателен. Текст кнопки — «Зарегистрироваться». Имена name не меняйте.',
      hints: [
        'placeholder — не подпись. Перед каждым полем добавьте <label for="…">, а полю — такой же id.',
        'Пароль: <input type="password" id="password" name="password" minlength="8" required>.',
        'Замените <p>Курс:</p> и абзац с переключателями на <fieldset><legend>Курс *</legend> … </fieldset>. Первому переключателю — required.',
        'Кнопка «ОК» ничего не объясняет: <button type="submit">Зарегистрироваться</button>.'
      ],
      html: `<h1>Олимпиада по информатике</h1>
<form action="/olymp" method="post">
  <p><input type="text" name="name" placeholder="ФИО"></p>
  <p><input type="email" name="email" placeholder="Почта"></p>
  <p><input type="text" name="password" placeholder="Пароль"></p>
  <p>Курс:</p>
  <p>
    <input type="radio" id="c1" name="year" value="1"> <label for="c1">1 курс</label>
    <input type="radio" id="c2" name="year" value="2"> <label for="c2">2 курс</label>
    <input type="radio" id="c3" name="year" value="3"> <label for="c3">3 курс</label>
  </p>
  <p><button type="submit">ОК</button></p>
</form>`,
      css: `${BASE}
h1 { color: #5a2d82; }
form { max-width: 480px; }`,
      tests: [
        { name: 'ФИО, почта и пароль подписаны через label for', check: h => { const bad = ['name', 'email', 'password'].filter(n => { const e = h.$(`[name="${n}"]`); return !(e && e.id && h.$(`label[for="${e.id}"]`)); }); return !bad.length || `без подписи: ${bad.join(', ')}`; } },
        { name: 'В подписях звёздочка: «ФИО *», «Почта *», «Пароль *»', check: h => { const t = ['name', 'email', 'password'].map(n => { const e = h.$(`[name="${n}"]`); return e && e.id ? (h.$(`label[for="${e.id}"]`)?.textContent || '') : ''; }); return t.every(x => /\*/.test(x)) && /фио/i.test(t[0]) && /почта/i.test(t[1]) && /пароль/i.test(t[2]) || `подписи: ${t.map(x => `«${x.trim()}»`).join(', ')}`; } },
        { name: 'ФИО, почта и пароль обязательные', check: h => ['name', 'email', 'password'].every(n => h.$(`[name="${n}"]`)?.required) || 'нужен required у трёх полей' },
        { name: 'Пароль скрыт и не короче 8 символов', check: h => { const p = h.$('[name="password"]'); return p?.type === 'password' && p.getAttribute('minlength') === '8' || `тип: ${p?.type}, minlength: ${p?.getAttribute('minlength') || 'нет'}`; } },
        { name: 'Переключатели в fieldset с legend «Курс *», выбор обязателен', check: h => { const r = h.$$('input[type="radio"]'); const fs = r[0]?.closest('fieldset'); if (!fs || !r.every(e => e.closest('fieldset') === fs)) return 'все переключатели — внутри одного fieldset'; const l = fs.querySelector('legend')?.textContent || ''; if (!/курс/i.test(l) || !/\*/.test(l)) return `legend: «${l.trim()}»`; return r.some(e => e.required) || 'нужен required у переключателя'; } },
        { name: 'Лишнего абзаца «Курс:» нет', check: h => !h.$$('p').some(p => /^курс:?$/i.test(p.textContent.trim())) || 'удалите <p>Курс:</p>' },
        { name: 'Кнопка «Зарегистрироваться»', check: h => /^зарегистрироваться$/i.test(h.text('form button')) || `сейчас: «${h.text('form button')}»` }
      ]
    },
    {
      id: 'k1103', lesson: 'mdk-11', module: 'mdk1', mech: 'build',
      title: 'Оформление формы по образцу', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма записи готова и работает, но выглядит как в 1995 году. Дизайнер прислал описание стилей — осталось перенести их в CSS.',
      goal: 'HTML не меняйте, работайте во вкладке CSS. Правило для label — образец. Допишите ещё четыре правила. 1) input, select, textarea: padding 8px, border 1px solid #767676, border-radius 4px, font-size 16px, margin-bottom 16px. 2) fieldset: border 1px solid #c4c4c4, border-radius 8px, padding 16px, margin-bottom 20px. 3) legend: font-weight bold, color #1f4e79. 4) button: background-color #1f4e79, color #ffffff, padding 12px 24px, border 0, border-radius 4px, font-size 16px.',
      hints: [
        'Посмотрите на образец label { … }: селектор, фигурные скобки, внутри «свойство: значение;».',
        'Несколько селекторов через запятую: input, select, textarea { padding: 8px; … }.',
        'Рамка пишется одним свойством из трёх частей: border: 1px solid #767676;',
        'Кнопка: button { background-color: #1f4e79; color: #ffffff; padding: 12px 24px; border: 0; border-radius: 4px; font-size: 16px; }'
      ],
      html: `<h1>Запись на вечерние курсы</h1>
<form action="/enroll" method="post">
  <fieldset>
    <legend>Контактные данные</legend>
    <label for="name">Имя *</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Почта *</label>
    <input type="email" id="email" name="email" required>
  </fieldset>
  <fieldset>
    <legend>Курс</legend>
    <label for="course">Курс *</label>
    <select id="course" name="course" required>
      <option value="">Выберите курс</option>
      <option value="pc">Компьютерная грамотность</option>
      <option value="web">Основы веб-дизайна</option>
      <option value="photo">Фотография на телефон</option>
    </select>
    <label for="comment">Комментарий</label>
    <textarea id="comment" name="comment" rows="3" cols="30"></textarea>
  </fieldset>
  <label><input type="checkbox" name="agree" required> Согласен на обработку данных *</label>
  <p><button type="submit">Записаться на курс</button></p>
</form>`,
      css: `${BASE}
h1 { color: #1f4e79; }

/* Образец: каждая подпись на своей строке, небольшой отступ до поля */
label {
  display: block;
  margin-bottom: 4px;
}

/* 1. Поля input, select, textarea: padding 8px, рамка 1px solid #767676,
      скругление 4px, шрифт 16px, отступ снизу 16px */

/* 2. Группы fieldset: рамка 1px solid #c4c4c4, скругление 8px,
      padding 16px, отступ снизу 20px */

/* 3. Названия групп legend: жирные, цвет #1f4e79 */

/* 4. Кнопка button: фон #1f4e79, текст #ffffff, padding 12px 24px,
      без рамки, скругление 4px, шрифт 16px */
`,
      tests: [
        { name: 'Подписи на своей строке (образец не сломан)', check: h => h.cs('label[for="name"]', 'display') === 'block' || 'label должен остаться display: block' },
        { name: 'Поля: padding 8px, скругление 4px, шрифт 16px, отступ снизу 16px', check: h => { const bad = ['#name', '#course', '#comment'].filter(s => !(h.px(s, 'padding-top') === 8 && h.px(s, 'padding-left') === 8 && h.px(s, 'border-top-left-radius') === 4 && h.px(s, 'font-size') === 16 && h.px(s, 'margin-bottom') === 16)); return !bad.length || `не подходит: ${bad.map(s => ({ '#name': 'input', '#course': 'select', '#comment': 'textarea' })[s]).join(', ')} (padding ${h.px(bad[0], 'padding-top')}px, шрифт ${h.px(bad[0], 'font-size')}px)`; } },
        { name: 'Рамка полей: 1px solid #767676', check: h => ['#name', '#course', '#comment'].every(s => h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-style') === 'solid' && h.cs(s, 'border-top-color') === rgb('#767676')) || `сейчас у input: ${h.cs('#name', 'border-top-width')} ${h.cs('#name', 'border-top-style')} ${h.cs('#name', 'border-top-color')}` },
        { name: 'Группы: рамка 1px solid #c4c4c4, скругление 8px, padding 16px, отступ 20px', check: h => { const s = 'fieldset'; return h.cs(s, 'border-top-color') === rgb('#c4c4c4') && h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-style') === 'solid' && h.px(s, 'border-top-left-radius') === 8 && h.px(s, 'padding-top') === 16 && h.px(s, 'padding-left') === 16 && h.px(s, 'margin-bottom') === 20 || `сейчас: рамка ${h.cs(s, 'border-top-width')} ${h.cs(s, 'border-top-style')} ${h.cs(s, 'border-top-color')}, padding ${h.cs(s, 'padding-top')}`; } },
        { name: 'legend: жирный, цвет #1f4e79', check: h => +h.cs('legend', 'font-weight') >= 700 && h.cs('legend', 'color') === rgb('#1f4e79') || `сейчас: ${h.cs('legend', 'font-weight')}, ${h.cs('legend', 'color')}` },
        { name: 'Кнопка: фон #1f4e79, белый текст', check: h => h.cs('button', 'background-color') === rgb('#1f4e79') && h.cs('button', 'color') === rgb('#ffffff') || `сейчас: фон ${h.cs('button', 'background-color')}, текст ${h.cs('button', 'color')}` },
        { name: 'Кнопка: padding 12px 24px, без рамки, скругление 4px, шрифт 16px', check: h => h.px('button', 'padding-top') === 12 && h.px('button', 'padding-left') === 24 && h.px('button', 'border-top-width') === 0 && h.px('button', 'border-top-left-radius') === 4 && h.px('button', 'font-size') === 16 || `сейчас: padding ${h.cs('button', 'padding')}, рамка ${h.cs('button', 'border-top-width')}, шрифт ${h.cs('button', 'font-size')}` }
      ]
    }
  );
})();
/* ---- content/tasks/k12.js ---- */
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
/* ---- content/tasks/k13.js ---- */
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
/* ---- content/tasks/k14.js ---- */
/* Занятие 14. Стили при создании сайта */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  // Правила с псевдоклассом (например ':hover'), которые относятся к элементам sel
  const pseudoRules = (h, pseudo, sel) => h.rules.filter(r => r.selector.split(',').some(s => {
    if (!s.includes(pseudo)) return false;
    try { const base = s.split(pseudo).join('').trim() || '*'; return h.$$(base).some(e => e.matches(sel)); } catch (e) { return false; }
  }));
  const rootVar = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  window.COURSE_TASKS.push(
    {
      id: 'k1401', lesson: 'mdk-14', module: 'mdk2', mech: 'optimize', title: 'Цвета — в переменные', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Библиотека колледжа решила сменить фирменный синий. В CSS этот цвет записан пять раз, оранжевый — два. Сделаем так, чтобы в следующий раз цвет менялся в одном месте.',
      goal: 'Объявите в правиле :root две переменные: --color-main со значением #1f4e79 и --color-accent со значением #b3541e. Замените все записи #1f4e79 и #b3541e в остальных правилах на var(--color-main) и var(--color-accent). Каждый из этих кодов цвета должен остаться в CSS ровно один раз — в объявлении переменной. Внешний вид страницы меняться не должен.',
      hints: [
        'Начните CSS с правила :root { } — внутри объявляются переменные. Имя переменной начинается с двух дефисов.',
        ':root { --color-main: #1f4e79; --color-accent: #b3541e; }',
        'Теперь в каждом правиле вместо #1f4e79 напишите var(--color-main). Например: h2 { color: var(--color-main); }',
        'Пройдитесь поиском (Ctrl+F) по коду: #1f4e79 и #b3541e должны встречаться только внутри :root.'
      ],
      html: `<header class="header">
  <h1 class="header__title">Библиотека колледжа</h1>
  <p>Работаем с 9:00 до 18:00, без перерыва</p>
</header>
<main>
  <h2>Новые книги</h2>
  <p>В октябре пришли учебники по веб-дизайну. Записаться в очередь можно <a href="#queue">на абонементе</a>.</p>
  <p class="note">Учебники выдаются на две недели.</p>
  <button class="button" type="button">Записаться в очередь</button>
</main>
<footer class="footer">
  <p>Корпус 1, кабинет 105</p>
</footer>`,
      css: `${BASE}
.header { border-bottom: 4px solid #1f4e79; margin-bottom: 16px; }
.header__title { color: #1f4e79; }
h2 { color: #1f4e79; }
a { color: #1f4e79; }
.note { border-left: 4px solid #b3541e; padding-left: 12px; }
.button { background-color: #b3541e; color: #ffffff; border: 0; padding: 10px 20px; font-size: 16px; }
.footer { border-top: 1px solid #1f4e79; margin-top: 24px; color: #555555; }`,
      tests: [
        { name: 'В :root объявлена --color-main: #1f4e79', check: h => rootVar(h, '--color-main') === '#1f4e79' || (rootVar(h, '--color-main') ? `сейчас ${rootVar(h, '--color-main')}` : 'переменной --color-main нет') },
        { name: 'В :root объявлена --color-accent: #b3541e', check: h => rootVar(h, '--color-accent') === '#b3541e' || (rootVar(h, '--color-accent') ? `сейчас ${rootVar(h, '--color-accent')}` : 'переменной --color-accent нет') },
        { name: 'Код #1f4e79 записан в CSS только один раз', check: h => h.occurrences('#1f4e79') === 1 || `встречается ${h.occurrences('#1f4e79')} раз` },
        { name: 'Код #b3541e записан в CSS только один раз', check: h => h.occurrences('#b3541e') === 1 || `встречается ${h.occurrences('#b3541e')} раз` },
        { name: 'Правила используют var(--color-main) и var(--color-accent)', check: h => (h.occurrences('var(--color-main)') >= 5 && h.occurrences('var(--color-accent)') >= 2) || `var(--color-main): ${h.occurrences('var(--color-main)')} из 5, var(--color-accent): ${h.occurrences('var(--color-accent)')} из 2` },
        { name: 'Страница выглядит как раньше', check: h => {
          const main = rgb('#1f4e79'), acc = rgb('#b3541e');
          if (h.cs('.header__title', 'color') !== main) return 'заголовок h1 потерял синий цвет';
          if (h.cs('h2', 'color') !== main || h.cs('a', 'color') !== main) return 'h2 или ссылка потеряли синий цвет';
          if (h.cs('.header', 'border-bottom-color') !== main || h.cs('.footer', 'border-top-color') !== main) return 'рамка шапки или подвала потеряла цвет';
          if (h.cs('.button', 'background-color') !== acc || h.cs('.note', 'border-left-color') !== acc) return 'кнопка или заметка потеряли оранжевый цвет';
          return true; } }
      ]
    },
    {
      id: 'k1402', lesson: 'mdk-14', module: 'mdk2', mech: 'build', title: 'Карточки кружков на классах', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице три карточки кружков, и каждая оформлена отдельно по id. Стили повторяются трижды, а добавить четвёртый кружок — значит снова копировать. Переведём карточки на общий класс.',
      goal: 'Добавьте в начало CSS сброс * { box-sizing: border-box; }. Каждому div дайте класс card, заголовку внутри — класс card__title, абзацу — класс card__text. Карточке «Шахматы» добавьте второй класс card--accent. Удалите все правила с id и напишите вместо них: .card — ширина 320px, padding 16px, рамка 1px solid #c9d3df, margin-bottom 16px, фон #f5f8fb; .card__title — margin-top 0, размер 20px, цвет #1f4e79; .card--accent — цвет рамки #b3541e, толщина рамки 2px, фон #fff4ec. Ширина карточки с рамкой и отступами — ровно 320px.',
      hints: [
        'В HTML: <div class="card"> и <h2 class="card__title">. У третьей карточки: class="card card--accent" — два класса через пробел.',
        'В CSS удалите все правила, которые начинаются с #. Вместо них — .card { … } и .card__title { … }.',
        'Модификатор меняет только то, что отличается: .card--accent { border-color: #b3541e; border-width: 2px; background-color: #fff4ec; }',
        'Чтобы ширина 320px включала padding и рамку, нужен * { box-sizing: border-box; } в начале CSS.'
      ],
      html: `<h1>Кружки колледжа</h1>
<div id="robot">
  <h2>Робототехника</h2>
  <p>Собираем роботов из конструктора. Вторник, 16:00.</p>
</div>
<div id="design">
  <h2>Веб-дизайн</h2>
  <p>Рисуем макеты сайтов в Figma. Среда, 15:30.</p>
</div>
<div id="chess">
  <h2>Шахматы</h2>
  <p>Новый набор! Турнир каждую пятницу в 17:00.</p>
</div>`,
      css: `${BASE}
#robot { width: 320px; padding: 16px; border: 1px solid #c9d3df; margin-bottom: 16px; background-color: #f5f8fb; }
#robot h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }
#design { width: 320px; padding: 16px; border: 1px solid #c9d3df; margin-bottom: 16px; background-color: #f5f8fb; }
#design h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }
#chess { width: 320px; padding: 16px; border: 2px solid #b3541e; margin-bottom: 16px; background-color: #fff4ec; }
#chess h2 { margin-top: 0; font-size: 20px; color: #1f4e79; }`,
      tests: [
        { name: 'Три карточки с классом card, в каждой card__title и card__text', check: h => {
          const c = h.$$('.card');
          if (c.length !== 3) return `карточек .card: ${c.length}`;
          return c.every(e => e.querySelector('h2.card__title') && e.querySelector('p.card__text')) || 'в каждой карточке нужны h2.card__title и p.card__text'; } },
        { name: 'В CSS нет селекторов по id', check: h => !h.rules.some(r => r.selector.includes('#')) || 'удалите правила с #robot, #design, #chess' },
        { name: '.card: padding 16px, рамка 1px solid #c9d3df, фон #f5f8fb, margin-bottom 16px', check: h => {
          const s = h.$$('.card').find(e => !e.classList.contains('card--accent')); if (!s) return 'нет обычной карточки';
          const cs = h.win.getComputedStyle(s);
          if (cs.paddingTop !== '16px' || cs.paddingLeft !== '16px') return `padding сейчас ${cs.padding}`;
          if (cs.borderTopWidth !== '1px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#c9d3df')) return 'рамка должна быть 1px solid #c9d3df';
          if (cs.backgroundColor !== rgb('#f5f8fb')) return 'фон должен быть #f5f8fb';
          return cs.marginBottom === '16px' || `margin-bottom сейчас ${cs.marginBottom}`; } },
        { name: 'Сброс box-sizing: ширина карточки ровно 320px', check: h => {
          if (h.cs('.card', 'box-sizing') !== 'border-box') return 'нет * { box-sizing: border-box; }';
          return h.$$('.card').every(e => near(e.getBoundingClientRect().width, 320, 0.5)) || 'ширина карточки с рамкой и отступами должна быть 320px'; } },
        { name: '.card__title: margin-top 0, 20px, цвет #1f4e79', check: h => (h.px('.card__title', 'margin-top') === 0 && h.px('.card__title', 'font-size') === 20 && h.cs('.card__title', 'color') === rgb('#1f4e79')) || 'проверьте margin-top, font-size и color у .card__title' },
        { name: 'Модификатор card--accent только у «Шахмат»: рамка 2px #b3541e, фон #fff4ec', check: h => {
          const a = h.$$('.card--accent');
          if (a.length !== 1 || !/Шахматы/.test(a[0].textContent)) return 'класс card--accent нужен одной карточке — «Шахматы»';
          if (!a[0].classList.contains('card')) return 'у карточки должны быть оба класса: card card--accent';
          const cs = h.win.getComputedStyle(a[0]);
          return (cs.borderTopWidth === '2px' && cs.borderTopColor === rgb('#b3541e') && cs.backgroundColor === rgb('#fff4ec')) || 'рамка 2px #b3541e и фон #fff4ec'; } }
      ]
    },
    {
      id: 'k1403', lesson: 'mdk-14', module: 'mdk2', mech: 'build', title: 'Меню и кнопка с состояниями', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт спортзала «Олимп»: меню выглядит как обычный список с точками, а кнопка — серая, как в 1999 году. Приведём их в порядок и не забудем про тех, кто ходит по сайту клавишей Tab.',
      goal: 'Переменные цветов уже есть в :root. Оформите: .menu__list — без маркеров, padding 0, margin 0 0 24px; .menu__item — display: inline-block и margin-right 16px (пункты в одну строку); .menu__link — цвет var(--color-main), без подчёркивания, жирный. При наведении (.menu__link:hover) ссылка подчёркивается. Кнопка .button: фон var(--color-main), белый текст, без рамки (border: 0), padding 12px 24px, курсор-рука (cursor: pointer); при наведении фон var(--color-main-dark). Ссылкам и кнопке задайте состояние :focus-visible — рамка outline 3px solid var(--color-focus).',
      hints: [
        'Маркеры убирает list-style: none; отступ слева у списка — это padding, его обнуляем.',
        'Пункты в строку: .menu__item { display: inline-block; margin-right: 16px; }',
        '.menu__link:hover { text-decoration: underline; } — отдельное правило с двоеточием.',
        'Одно правило на всех: a:focus-visible, .button:focus-visible { outline: 3px solid var(--color-focus); }'
      ],
      html: `<nav class="menu">
  <ul class="menu__list">
    <li class="menu__item"><a class="menu__link" href="#home">Главная</a></li>
    <li class="menu__item"><a class="menu__link" href="#schedule">Расписание</a></li>
    <li class="menu__item"><a class="menu__link" href="#contacts">Контакты</a></li>
  </ul>
</nav>
<h1>Спортзал «Олимп»</h1>
<p>Первая тренировка бесплатно. Запишитесь онлайн или <a href="#call">позвоните администратору</a>.</p>
<button class="button" type="button">Записаться</button>`,
      css: `${BASE}
:root {
  --color-main: #1f4e79;
  --color-main-dark: #163a5a;
  --color-focus: #f2a541;
}`,
      tests: [
        { name: 'Список меню без маркеров, padding 0, margin-bottom 24px', check: h => (h.cs('.menu__list', 'list-style-type') === 'none' && h.px('.menu__list', 'padding-left') === 0 && h.px('.menu__list', 'margin-top') === 0 && h.px('.menu__list', 'margin-bottom') === 24) || 'нужно list-style: none; padding: 0; margin: 0 0 24px;' },
        { name: 'Пункты меню стоят в одну строку, между ними 16px', check: h => (h.cs('.menu__item', 'display') === 'inline-block' && h.px('.menu__item', 'margin-right') === 16 && h.sameRow(h.$$('.menu__item'))) || 'нужно display: inline-block и margin-right: 16px' },
        { name: 'Ссылки меню: основной цвет, без подчёркивания, жирные', check: h => {
          if (h.cs('.menu__link', 'color') !== rgb('#1f4e79')) return 'цвет должен быть var(--color-main)';
          if (h.cs('.menu__link', 'text-decoration-line') !== 'none') return 'уберите подчёркивание';
          return h.px('.menu__link', 'font-weight') >= 700 || 'ссылки должны быть жирными'; } },
        { name: 'При наведении ссылка меню подчёркивается', check: h => pseudoRules(h, ':hover', '.menu__link').some(r => /underline/.test(r.style.cssText)) || 'нет правила .menu__link:hover с text-decoration: underline' },
        { name: 'Кнопка: фон основной, белый текст, без рамки, padding 12px 24px, cursor: pointer', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          if (cs.backgroundColor !== rgb('#1f4e79') || cs.color !== rgb('#ffffff')) return 'фон var(--color-main), текст #ffffff';
          if (cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') return 'уберите рамку: border: 0';
          if (cs.paddingTop !== '12px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          return cs.cursor === 'pointer' || 'нужен cursor: pointer'; } },
        { name: 'При наведении фон кнопки темнеет', check: h => pseudoRules(h, ':hover', '.button').some(r => /background/.test(r.style.cssText) && (/--color-main-dark/.test(r.style.cssText) || r.style.cssText.includes(rgb('#163a5a')))) || 'нет .button:hover с фоном var(--color-main-dark)' },
        { name: 'У ссылок и кнопки есть заметный :focus-visible', check: h => {
          const ok = sel => pseudoRules(h, ':focus-visible', sel).some(r => /outline/.test(r.style.cssText) && !/outline:\s*(none|0)\b/.test(r.style.cssText));
          if (!ok('.menu__link')) return 'нет :focus-visible с outline для ссылок';
          return ok('.button') || 'нет :focus-visible с outline для кнопки'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k15.js ---- */
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
/* ---- content/tasks/k16.js ---- */
/* Занятие 16. Практическая работа №4 (ч. 2). Блоки, отступы, рамки и меню */
(() => {
  const { BASE, rgb, near } = window.COURSE_KIT;
  const pseudoRules = (h, pseudo, sel) => h.rules.filter(r => r.selector.split(',').some(s => {
    if (!s.includes(pseudo)) return false;
    try { const base = s.split(pseudo).join('').trim() || '*'; return h.$$(base).some(e => e.matches(sel)); } catch (e) { return false; }
  }));
  // В cssText цвет может прийти и как #hex, и как rgb(…)
  const mentions = (r, hex) => r.style.cssText.toLowerCase().includes(hex) || r.style.cssText.includes(rgb(hex));
  const hasOutline = r => /outline/.test(r.style.cssText) && !/outline:\s*(none|0)\b/.test(r.style.cssText);

  window.COURSE_TASKS.push(
    {
      id: 'k1601', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Шапка с горизонтальным меню', level: 'Среднее', minutes: 30, points: 150,
      story: 'Кафе «Пиксель» заказало сайт. Начинаем с шапки: тёмная полоса, слева название, рядом меню из трёх пунктов. Текущий раздел подчёркнут жёлтой линией.',
      goal: 'Цвета уже в переменных. Шапка .site-header: фон var(--color-dark), padding 16px 24px. Логотип .logo: белый (var(--color-light)), 22px, жирный, без подчёркивания, display: inline-block, margin-right 32px. Блок меню .nav — display: inline-block, чтобы он встал в одну строку с логотипом. Список .nav__list: без маркеров, margin 0, padding 0. Пункты .nav__item — display: inline-block. Ссылки .nav__link: белые, без подчёркивания, display: inline-block, padding 8px 12px. Состояния: .nav__link:hover — фон #34446b; .nav__link:focus-visible — outline 3px solid var(--color-accent). Активный пункт .nav__link--active — нижняя рамка 3px solid var(--color-accent).',
      hints: [
        'Логотип и меню встанут в строку, если оба будут display: inline-block.',
        '.nav__list { list-style: none; margin: 0; padding: 0; } — так список теряет точки и отступ слева.',
        'Ссылке нужно display: inline-block, иначе вертикальный padding не раздвинет строку.',
        'Активный пункт: .nav__link--active { border-bottom: 3px solid var(--color-accent); }'
      ],
      html: `<header class="site-header">
  <a class="logo" href="#home">Кафе «Пиксель»</a>
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item"><a class="nav__link nav__link--active" href="#menu">Меню</a></li>
      <li class="nav__item"><a class="nav__link" href="#delivery">Доставка</a></li>
      <li class="nav__item"><a class="nav__link" href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Завтраки весь день</h1>
  <p>Каша, сырники и омлет — с 8:00 до 22:00.</p>
</main>`,
      css: `${BASE}
:root {
  --color-dark: #1f2a44;
  --color-light: #ffffff;
  --color-accent: #ffd166;
}`,
      tests: [
        { name: 'Шапка: тёмный фон, padding 16px 24px', check: h => (h.cs('.site-header', 'background-color') === rgb('#1f2a44') && h.px('.site-header', 'padding-top') === 16 && h.px('.site-header', 'padding-left') === 24) || `фон ${h.cs('.site-header', 'background-color')}, padding ${h.cs('.site-header', 'padding')}` },
        { name: 'Логотип: белый, 22px, жирный, без подчёркивания, отступ справа 32px', check: h => {
          if (h.cs('.logo', 'color') !== rgb('#ffffff')) return 'логотип должен быть белым';
          if (h.px('.logo', 'font-size') !== 22 || h.px('.logo', 'font-weight') < 700) return 'размер 22px и жирный';
          if (h.cs('.logo', 'text-decoration-line') !== 'none') return 'уберите подчёркивание';
          return (h.cs('.logo', 'display') === 'inline-block' && h.px('.logo', 'margin-right') === 32) || 'display: inline-block и margin-right: 32px'; } },
        { name: 'Логотип и меню — в одной строке', check: h => {
          if (h.cs('.nav', 'display') !== 'inline-block') return '.nav должен быть inline-block';
          const a = h.rect('.logo'), b = h.rect('.nav__list');
          return (b.top < a.bottom && a.top < b.bottom && b.left > a.right) || 'меню должно стоять справа от логотипа в той же строке'; } },
        { name: 'Список меню без маркеров и отступов, пункты в строку', check: h => {
          if (h.cs('.nav__list', 'list-style-type') !== 'none') return 'нужно list-style: none';
          if (h.px('.nav__list', 'padding-left') !== 0 || h.px('.nav__list', 'margin-top') !== 0 || h.px('.nav__list', 'margin-bottom') !== 0) return 'margin: 0; padding: 0;';
          return (h.cs('.nav__item', 'display') === 'inline-block' && h.sameRow(h.$$('.nav__item'))) || 'пункты .nav__item: display: inline-block'; } },
        { name: 'Ссылки меню: белые, без подчёркивания, inline-block, padding 8px 12px', check: h => h.$$('.nav__link').every(a => { const cs = h.win.getComputedStyle(a); return cs.color === rgb('#ffffff') && cs.textDecorationLine === 'none' && cs.display === 'inline-block' && cs.paddingTop === '8px' && cs.paddingLeft === '12px'; }) || 'проверьте color, text-decoration, display и padding у .nav__link' },
        { name: 'Состояния ссылок: :hover с фоном #34446b и :focus-visible с outline', check: h => {
          if (!pseudoRules(h, ':hover', '.nav__link').some(r => /background/.test(r.style.cssText) && mentions(r, '#34446b'))) return 'нет .nav__link:hover { background-color: #34446b; }';
          return pseudoRules(h, ':focus-visible', '.nav__link').some(hasOutline) || 'нет .nav__link:focus-visible с outline'; } },
        { name: 'Активный пункт подчёркнут рамкой 3px #ffd166', check: h => {
          const others = h.$$('.nav__link:not(.nav__link--active)');
          if (others.some(a => h.win.getComputedStyle(a).borderBottomStyle !== 'none')) return 'рамка нужна только активному пункту';
          return (h.cs('.nav__link--active', 'border-bottom-width') === '3px' && h.cs('.nav__link--active', 'border-bottom-style') === 'solid' && h.cs('.nav__link--active', 'border-bottom-color') === rgb('#ffd166')) || 'border-bottom: 3px solid var(--color-accent)'; } }
      ]
    },
    {
      id: 'k1602', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Ряд карточек', level: 'Среднее', minutes: 30, points: 150,
      story: 'Под шапкой — блок «Что мы готовим»: три карточки с названием, описанием и ценой. Одна из них — хит продаж, у неё яркая рамка и значок.',
      goal: 'Сброс * { box-sizing: border-box; } уже есть. Карточка .card: display: inline-block, vertical-align: top, ширина 300px, padding 24px, рамка 1px solid #d0d7e2, скругление border-radius 12px, фон #ffffff, отступы margin 0 16px 16px 0. Три карточки должны стоять в один ряд. Заголовок .card__title: margin 0 0 8px, 20px. Цена .card__price: жирная, 18px, цвет #1f4e79. Карточка-хит .card--hit: рамка 2px цвета #b3541e. Значок .card__badge: display: inline-block, padding 2px 8px, border-radius 12px, фон #b3541e, белый текст, 14px.',
      hints: [
        'Блоки встают в ряд, если сделать их display: inline-block и задать ширину. vertical-align: top выравнивает их по верху.',
        'Скругление углов: border-radius: 12px;',
        'Модификатор меняет только рамку: .card--hit { border: 2px solid #b3541e; }',
        'Значок — маленькая «таблетка»: inline-block, padding 2px 8px, border-radius 12px, фон и белый текст.'
      ],
      html: `<section class="services">
  <h2 class="services__title">Что мы готовим</h2>
  <article class="card">
    <h3 class="card__title">Завтраки</h3>
    <p class="card__text">Каши, сырники и омлеты. Подаём с 8:00.</p>
    <p class="card__price">от 250 ₽</p>
  </article>
  <article class="card">
    <h3 class="card__title">Обеды</h3>
    <p class="card__text">Суп, второе и чай. Студентам скидка.</p>
    <p class="card__price">от 290 ₽</p>
  </article>
  <article class="card card--hit">
    <span class="card__badge">Хит</span>
    <h3 class="card__title">Десерты</h3>
    <p class="card__text">Чизкейк, брауни и пирожное «Картошка».</p>
    <p class="card__price">от 180 ₽</p>
  </article>
</section>`,
      css: `* { box-sizing: border-box; }
${BASE}
.services__title { margin: 0 0 16px; }`,
      tests: [
        { name: 'Три карточки стоят в один ряд, по верхнему краю', check: h => (h.cs('.card', 'display') === 'inline-block' && h.cs('.card', 'vertical-align') === 'top' && h.sameRow(h.$$('.card'))) || 'нужны display: inline-block и vertical-align: top' },
        { name: 'Карточка: ширина 300px, padding 24px, отступы margin 0 16px 16px 0', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card'));
          if (!near(h.rect('.card').width, 300, 0.5)) return `ширина сейчас ${Math.round(h.rect('.card').width)}px`;
          if (cs.paddingTop !== '24px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          return (cs.marginTop === '0px' && cs.marginRight === '16px' && cs.marginBottom === '16px') || `margin сейчас ${cs.margin}`; } },
        { name: 'Карточка: рамка 1px solid #d0d7e2, скругление 12px, белый фон', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card'));
          if (cs.borderTopWidth !== '1px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#d0d7e2')) return 'рамка: 1px solid #d0d7e2';
          if (cs.borderTopLeftRadius !== '12px' || cs.borderBottomRightRadius !== '12px') return 'скругление: border-radius: 12px';
          return cs.backgroundColor === rgb('#ffffff') || 'фон #ffffff'; } },
        { name: 'Заголовок карточки 20px, margin 0 0 8px; цена жирная, 18px, #1f4e79', check: h => {
          if (h.px('.card__title', 'font-size') !== 20 || h.px('.card__title', 'margin-top') !== 0 || h.px('.card__title', 'margin-bottom') !== 8) return 'проверьте .card__title';
          return (h.px('.card__price', 'font-weight') >= 700 && h.px('.card__price', 'font-size') === 18 && h.cs('.card__price', 'color') === rgb('#1f4e79')) || 'проверьте .card__price'; } },
        { name: 'Карточка-хит: рамка 2px #b3541e', check: h => (h.cs('.card--hit', 'border-top-width') === '2px' && h.cs('.card--hit', 'border-top-color') === rgb('#b3541e') && h.cs('.card--hit', 'border-top-style') === 'solid') || `сейчас ${h.cs('.card--hit', 'border-top-width')} ${h.cs('.card--hit', 'border-top-color')}` },
        { name: 'Значок «Хит»: inline-block, padding 2px 8px, скругление 12px, фон #b3541e, белый текст 14px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.card__badge'));
          if (cs.display !== 'inline-block' || cs.paddingTop !== '2px' || cs.paddingLeft !== '8px') return 'display: inline-block; padding: 2px 8px;';
          if (cs.borderTopLeftRadius !== '12px') return 'border-radius: 12px';
          return (cs.backgroundColor === rgb('#b3541e') && cs.color === rgb('#ffffff') && cs.fontSize === '14px') || 'фон #b3541e, цвет #ffffff, 14px'; } }
      ]
    },
    {
      id: 'k1603', lesson: 'mdk-16', module: 'mdk2', mech: 'build', title: 'Кнопки с состояниями и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Страница записи на мастер-класс: основная кнопка, второстепенная и кнопка на занятие, где мест уже нет. Внизу — тёмный подвал с почтой кафе.',
      goal: 'Кнопка .button: padding 12px 24px, 16px, рамка 2px solid #1f4e79, border-radius 8px, фон #1f4e79, белый текст, cursor: pointer, margin-right 8px. Состояния: .button:hover — фон и цвет рамки #163a5a; .button:focus-visible — outline 3px solid #f2a541 и outline-offset 2px; .button:disabled — фон и рамка #e1e5ea, текст #5a6470, cursor: not-allowed. Второстепенная .button--secondary — фон #ffffff, текст #1f4e79, а при наведении (.button--secondary:hover) — фон #eef3f8, иначе синий текст пропадёт на тёмном фоне. Подвал .site-footer: фон #1f2a44, белый текст, padding 24px, margin-top 40px; текст .site-footer__text — 14px; ссылка .site-footer__link — цвет #ffd166.',
      hints: [
        'Рамка 2px нужна и основной кнопке: тогда основная и второстепенная будут одной высоты.',
        'Состояние «недоступна» описывает псевдокласс :disabled — он срабатывает, когда у кнопки есть атрибут disabled.',
        'Правила .button--secondary:hover и .button:disabled пишите после .button:hover: при равной специфичности побеждает последнее.',
        'outline-offset: 2px отодвигает рамку фокуса от кнопки — так её лучше видно.'
      ],
      html: `<main>
  <h1>Мастер-класс по латте-арту</h1>
  <p>Суббота, 12:00. Научим рисовать сердечко и листик на кофе.</p>
  <p class="actions">
    <button class="button" type="button">Записаться</button>
    <button class="button button--secondary" type="button">Подробнее</button>
  </p>
  <h2>Воскресенье, 12:00</h2>
  <p class="actions">
    <button class="button" type="button" disabled>Мест нет</button>
  </p>
</main>
<footer class="site-footer">
  <p class="site-footer__text">© 2026 Кафе «Пиксель». Пишите: <a class="site-footer__link" href="mailto:hello@pixel.example">hello@pixel.example</a></p>
</footer>`,
      css: `${BASE}
.actions { margin: 16px 0 32px; }`,
      tests: [
        { name: 'Кнопка: padding 12px 24px, 16px, рамка 2px #1f4e79, скругление 8px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          if (cs.paddingTop !== '12px' || cs.paddingLeft !== '24px') return `padding сейчас ${cs.padding}`;
          if (cs.fontSize !== '16px') return `размер шрифта ${cs.fontSize}`;
          if (cs.borderTopWidth !== '2px' || cs.borderTopStyle !== 'solid' || cs.borderTopColor !== rgb('#1f4e79')) return 'рамка: 2px solid #1f4e79';
          return cs.borderTopLeftRadius === '8px' || 'border-radius: 8px'; } },
        { name: 'Кнопка: фон #1f4e79, белый текст, cursor: pointer, margin-right 8px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.button'));
          return (cs.backgroundColor === rgb('#1f4e79') && cs.color === rgb('#ffffff') && cs.cursor === 'pointer' && cs.marginRight === '8px') || 'проверьте background-color, color, cursor и margin-right'; } },
        { name: 'Второстепенная кнопка: белый фон, синий текст, та же рамка; при наведении фон #eef3f8', check: h => {
          if (!(h.cs('.button--secondary', 'background-color') === rgb('#ffffff') && h.cs('.button--secondary', 'color') === rgb('#1f4e79') && h.cs('.button--secondary', 'border-top-width') === '2px')) return 'фон #ffffff, текст #1f4e79';
          return h.rules.some(r => r.selector.split(',').some(s => /\.button--secondary:hover/.test(s)) && mentions(r, '#eef3f8')) || 'нет .button--secondary:hover с фоном #eef3f8'; } },
        { name: 'Есть :hover (фон #163a5a) и :focus-visible (outline 3px, outline-offset 2px)', check: h => {
          if (!pseudoRules(h, ':hover', '.button').some(r => /background/.test(r.style.cssText) && mentions(r, '#163a5a'))) return 'нет .button:hover с фоном #163a5a';
          const f = pseudoRules(h, ':focus-visible', '.button');
          if (!f.some(hasOutline)) return 'нет .button:focus-visible с outline';
          return f.some(r => r.style.getPropertyValue('outline-offset') === '2px') || 'нужен outline-offset: 2px'; } },
        { name: 'Недоступная кнопка: фон #e1e5ea, текст #5a6470, cursor: not-allowed', check: h => {
          const b = h.$('.button[disabled]'), cs = h.win.getComputedStyle(b);
          if (!pseudoRules(h, ':disabled', '.button').length) return 'нет правила .button:disabled';
          return (cs.backgroundColor === rgb('#e1e5ea') && cs.borderTopColor === rgb('#e1e5ea') && cs.color === rgb('#5a6470') && cs.cursor === 'not-allowed') || `фон ${cs.backgroundColor}, текст ${cs.color}, курсор ${cs.cursor}`; } },
        { name: 'Подвал: фон #1f2a44, белый текст, padding 24px, margin-top 40px', check: h => {
          const cs = h.win.getComputedStyle(h.$('.site-footer'));
          return (cs.backgroundColor === rgb('#1f2a44') && cs.color === rgb('#ffffff') && cs.paddingTop === '24px' && cs.paddingLeft === '24px' && cs.marginTop === '40px') || `фон ${cs.backgroundColor}, padding ${cs.padding}, margin-top ${cs.marginTop}`; } },
        { name: 'Текст подвала 14px, ссылка жёлтая #ffd166', check: h => (h.px('.site-footer__text', 'font-size') === 14 && h.cs('.site-footer__link', 'color') === rgb('#ffd166')) || `размер ${h.cs('.site-footer__text', 'font-size')}, ссылка ${h.cs('.site-footer__link', 'color')}` }
      ]
    }
  );
})();
/* ---- content/tasks/k17.js ---- */
/* Занятие 17. Веб-стандарты и их поддержка */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  const lastFamily = (h, sel) => h.cs(sel, 'font-family').split(',').pop().trim().replace(/["']/g, '');
  window.COURSE_TASKS.push(
    {
      id: 'k1701', lesson: 'mdk-17', module: 'mdk2', mech: 'fix', title: 'Пройдите валидатор', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Страницу консультаций сделали по старой книге 2005 года. Браузер её кое-как показывает, но валидатор W3C нашёл шесть ошибок. На экзамене за такое снимают баллы.',
      goal: 'Исправьте все ошибки, не теряя текста: 1) уберите устаревший тег center, а абзацу с кабинетом дайте класс place (центровка уже описана в CSS); 2) замените b на strong и закройте теги в правильном порядке; 3) у второго абзаца повторяется id="info" — замените его на id="teacher"; 4) устаревший font замените на span с классом teacher-name; 5) у картинки возьмите значения атрибутов в двойные кавычки и добавьте alt; 6) знак «меньше» в тексте запишите как &lt;. Линтер не должен показывать ошибок.',
      hints: [
        'Начните с красных отметок линтера: они показывают строки с ошибками.',
        'Было: <center><p>…</p></center>. Стало: <p class="place">…</p>.',
        'Было: <font color="#1f4e79">Ирина Петровна</font>. Стало: <span class="teacher-name">Ирина Петровна</span> — цвет уже в CSS.',
        'Картинка: <img src="img/icon.svg" width="48" height="48" alt="Календарь">. Знак «<» в тексте: &lt;.'
      ],
      html: `<h1>Консультации по МДК.08.01</h1>
<center><p>Кабинет 214, второй этаж</p></center>
<p id="info">Консультации проходят <b>по понедельникам</p></b>
<p id="info">Ведёт: <font color="#1f4e79">Ирина Петровна</font></p>
<img src=${ICON} width=48 height=48>
<p>Время на один вопрос: < 10 минут.</p>`,
      css: `${BASE}
.place { text-align: center; }
.teacher-name { color: #1f4e79; font-weight: bold; }`,
      tests: [
        { name: 'Линтер HTML не находит ошибок', check: h => !window.TaskRunner || !window.TaskRunner.htmlLint(h.html).some(m => m.type === 'error') || `ошибка: ${window.TaskRunner.htmlLint(h.html).find(m => m.type === 'error').message}` },
        { name: 'Нет устаревших тегов center, font, b', check: h => !h.count('center, font, b') || `осталось: <${h.$('center, font, b').tagName.toLowerCase()}>` },
        { name: 'Абзац с кабинетом стоит по центру благодаря классу place', check: h => { const p = h.$('p.place'); return (p && /Кабинет 214/.test(p.textContent) && h.cs(p, 'text-align') === 'center') || 'нужен <p class="place">Кабинет 214…</p>'; } },
        { name: '«по понедельникам» выделено strong внутри абзаца', check: h => (h.$('p strong') && h.text('p strong') === 'по понедельникам') || 'нужно <p>… <strong>по понедельникам</strong></p>' },
        { name: 'id не повторяются: info и teacher', check: h => (h.count('#info') === 1 && h.count('#teacher') === 1) || `id="info": ${h.count('#info')}, id="teacher": ${h.count('#teacher')}` },
        { name: 'Имя преподавателя в span.teacher-name', check: h => (h.text('span.teacher-name') === 'Ирина Петровна' && h.cs('span.teacher-name', 'color') === rgb('#1f4e79')) || 'нужно <span class="teacher-name">Ирина Петровна</span>' },
        { name: 'У картинки есть alt, а знак «<» записан как &lt;', check: h => {
          if (!h.$('img[alt]')) return 'нет alt у картинки';
          return (/&lt;\s*10/.test(h.html) && /<\s*10 минут/.test(h.text('body'))) || 'запишите «&lt; 10 минут»'; } }
      ]
    },
    {
      id: 'k1702', lesson: 'mdk-17', module: 'mdk2', mech: 'a11y', title: 'Запись к врачу для всех', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма записи в поликлинику работает только для зрячих с мышкой. Пользователь экранного диктора слышит «картинка, поле ввода, поле ввода», а клавишей Tab до кнопки не добраться.',
      goal: 'Сделайте страницу доступной по WCAG: 1) у картинки — alt «Логотип поликлиники №3»; 2) у каждого поля — видимая подпись label for: «Ваше имя» и «Телефон» (placeholder можно оставить); 3) вместо div.button — настоящая кнопка button type="submit" с тем же классом button внутри формы; 4) серый текст .hint сделайте темнее, чтобы контраст был не ниже 4,5:1 (например, #595959); 5) замените текст ссылки «здесь» на понятный — «Правила приёма пациентов»; 6) удалите правило, которое убирает outline при фокусе.',
      hints: [
        'Подпись связывается с полем через одинаковые for и id: <label for="name">Ваше имя</label> и <input id="name" …>.',
        'div не получает фокус с клавиатуры и не нажимается Enter. Замените его на <button class="button" type="submit">Записаться</button>.',
        'Ссылку можно перестроить: <p>Перед визитом прочитайте <a href="#rules">Правила приёма пациентов</a>.</p>',
        'Правило с outline: none в конце CSS удалите целиком.'
      ],
      html: `<h1>Запись к терапевту</h1>
<img src="${ICON}" width="64" height="64">
<p class="hint">Приём ведёт терапевт, кабинет 12.</p>
<form class="form" action="#" method="post">
  <input id="name" name="name" type="text" placeholder="Ваше имя">
  <input id="phone" name="phone" type="tel" placeholder="Телефон">
  <div class="button">Записаться</div>
</form>
<p>Перед визитом прочитайте правила — <a href="#rules">здесь</a>.</p>`,
      css: `${BASE}
.hint { color: #aaaaaa; }
.form input { display: block; margin: 4px 0 12px; padding: 8px; font-size: 16px; }
.button { display: inline-block; padding: 10px 20px; background-color: #1f4e79; color: #ffffff; border: 0; font-size: 16px; }
a:focus, .button:focus { outline: none; }`,
      tests: [
        { name: 'У картинки есть понятный alt', check: h => (h.$('img')?.getAttribute('alt') || '').trim().length >= 5 || 'нужен alt="Логотип поликлиники №3"' },
        { name: 'У каждого поля есть видимая подпись label for', check: h => {
          for (const id of ['name', 'phone']) { const l = h.$(`label[for="${id}"]`); if (!l || l.textContent.trim().length < 3) return `нет <label for="${id}"> с текстом`; }
          return true; } },
        { name: 'Кнопка — настоящий button type="submit" внутри формы', check: h => {
          if (h.$('div.button')) return 'div.button остался — замените на <button>';
          const b = h.$('form button.button');
          return (b && b.type === 'submit' && b.textContent.trim().length > 0) || 'нужен <button class="button" type="submit"> внутри form'; } },
        { name: 'Контраст подсказки .hint не ниже 4,5:1', check: h => { const c = h.contrast('.hint'); return c >= 4.5 || `сейчас ${c.toFixed(2)}:1`; } },
        { name: 'Текст ссылки понятен без окружения', check: h => { const t = h.text('a').toLowerCase(); return (t.length >= 10 && !/^(здесь|тут|подробнее|ссылка|нажмите)$/.test(t)) || `сейчас «${t}»`; } },
        { name: 'Фокус не спрятан: нет outline: none', check: h => !h.has(/outline\s*:\s*(none|0)\b/i) || 'удалите правило с outline: none' }
      ]
    },
    {
      id: 'k1703', lesson: 'mdk-17', module: 'mdk2', mech: 'fix', title: 'Страница без сюрпризов', level: 'Среднее', minutes: 20, points: 150,
      story: 'Афиша дня открытых дверей отлично выглядит на компьютере дизайнера. А у директора заголовок стал чёрным, шрифт — с засечками, а экранный диктор читает английский слоган русскими буквами. Добавим запасные варианты.',
      goal: 'Файл с переменными до этой страницы не доходит, поэтому переменная --brand не объявлена — так и оставьте. 1) Заголовку .title задайте цвет с запасным значением: var(--brand, #1f4e79). 2) Шрифтам .title и .text допишите запасные варианты: "PT Sans", Arial, sans-serif и "Fira Sans", Arial, sans-serif — в конце списка всегда общее семейство. 3) Английскую фразу Learn by doing оберните в span с атрибутом lang="en". 4) У картинки добавьте атрибуты width="48" и height="48", чтобы место под неё было известно заранее, и alt.',
      hints: [
        'У var() есть второй аргумент — запасное значение: color: var(--brand, #1f4e79);',
        'Браузер берёт первый шрифт из списка, который у него есть. sans-serif в конце — шрифт без засечек, он есть везде.',
        'Атрибут lang можно ставить любому элементу: <span lang="en">Learn by doing</span>.',
        '<img src="img/icon.svg" width="48" height="48" alt="Иконка колледжа">'
      ],
      html: `<img src="${ICON}">
<h1 class="title">Неделя открытых дверей</h1>
<p class="text">Приходите знакомиться с колледжем 20–24 октября.</p>
<p class="text">Наш девиз — Learn by doing: учимся на практике.</p>`,
      css: `${BASE}
.title { color: var(--brand); font-family: "PT Sans"; }
.text { font-family: "Fira Sans"; font-size: 18px; }`,
      tests: [
        { name: 'Переменная --brand не объявлена (имитация старого браузера)', check: h => !h.win.getComputedStyle(h.doc.documentElement).getPropertyValue('--brand').trim() || 'не объявляйте --brand: нужно запасное значение в var()' },
        { name: 'Цвет заголовка: var(--brand, #1f4e79)', check: h => (h.has(/var\(\s*--brand\s*,\s*#1f4e79\s*\)/i) && h.cs('.title', 'color') === rgb('#1f4e79')) || 'нужно color: var(--brand, #1f4e79)' },
        { name: 'Шрифт заголовка: "PT Sans", Arial, sans-serif', check: h => (/PT Sans/.test(h.cs('.title', 'font-family')) && /Arial/.test(h.cs('.title', 'font-family')) && lastFamily(h, '.title') === 'sans-serif') || `сейчас ${h.cs('.title', 'font-family')}` },
        { name: 'Шрифт текста: "Fira Sans", Arial, sans-serif', check: h => (/Fira Sans/.test(h.cs('.text', 'font-family')) && /Arial/.test(h.cs('.text', 'font-family')) && lastFamily(h, '.text') === 'sans-serif') || `сейчас ${h.cs('.text', 'font-family')}` },
        { name: 'Английская фраза размечена lang="en"', check: h => (h.$('span[lang="en"]') && h.text('span[lang="en"]') === 'Learn by doing') || 'нужно <span lang="en">Learn by doing</span>' },
        { name: 'У картинки есть width, height и alt', check: h => { const i = h.$('img'); return (i && i.getAttribute('width') === '48' && i.getAttribute('height') === '48' && (i.getAttribute('alt') || '').trim()) ? true : 'нужны width="48", height="48" и alt'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k18.js ---- */
/* Занятие 18. HTML5: элементы, атрибуты и структура страницы */
(() => {
  const { BASE, IMG, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k1801', lesson: 'mdk-18', module: 'mdk2', mech: 'build', title: 'Из div — в семантику', level: 'Среднее', minutes: 20, points: 150,
      story: 'Страница библиотеки свёрстана одними div. Выглядит нормально, но поисковик и экранный диктор не понимают, где меню, где главное, а где подвал.',
      goal: 'Замените div на семантические теги, сохранив классы (на них держится CSS): div.header → header, div.nav → nav, div.main → main, div.article → article, div.aside → aside, div.footer → footer. Логотип div.logo замените на абзац p с тем же классом. Порядок блоков и текст не меняйте.',
      hints: [
        'Меняются оба тега: и открывающий, и закрывающий. <div class="header"> … </div> → <header class="header"> … </header>.',
        'nav остаётся внутри header, article и aside — внутри main.',
        'Класс не удаляйте: <main class="main">. Если стиль пропал — проверьте класс.',
        'Последний div.footer становится <footer class="footer">.'
      ],
      html: `<div class="header">
  <div class="logo">Библиотека колледжа</div>
  <div class="nav">
    <a href="#catalog">Каталог</a>
    <a href="#rules">Правила</a>
    <a href="#contacts">Контакты</a>
  </div>
</div>
<div class="main">
  <div class="article">
    <h1>Как записаться в библиотеку</h1>
    <p>Возьмите студенческий билет и подойдите на абонемент. Читательский билет выдадут сразу.</p>
  </div>
  <div class="aside">
    <h2>Часы работы</h2>
    <p>Пн–Пт, 9:00–18:00</p>
  </div>
</div>
<div class="footer">
  <p>© 2026 Библиотека колледжа</p>
</div>`,
      css: `${BASE}
.header { background-color: #1f2a44; color: #ffffff; padding: 12px 16px; }
.logo { margin: 0 0 8px; font-weight: bold; }
.nav a { color: #ffd166; margin-right: 16px; }
.main { padding: 16px 0; }
.article { margin-bottom: 16px; }
.aside { border-left: 4px solid #1f4e79; padding-left: 12px; }
.footer { border-top: 1px solid #c9d3df; color: #555555; }`,
      tests: [
        { name: 'Шапка — header с классом header, внутри nav со ссылками', check: h => (h.count('header.header') === 1 && h.$('header.header nav.nav') && h.count('nav.nav a') === 3) || 'нужен <header class="header"> и внутри <nav class="nav"> с тремя ссылками' },
        { name: 'Логотип — абзац p.logo', check: h => (h.$('header p.logo') && h.text('p.logo') === 'Библиотека колледжа') || 'нужен <p class="logo">Библиотека колледжа</p>' },
        { name: 'Главное — один main, в нём article с h1 и aside', check: h => {
          if (h.count('main') !== 1 || !h.$('main.main')) return 'нужен один <main class="main">';
          if (!h.$('main article.article h1')) return 'h1 должен быть в <article class="article"> внутри main';
          return !!h.$('main aside.aside h2') || 'нужен <aside class="aside"> с h2 внутри main'; } },
        { name: 'Подвал — footer после main', check: h => (h.$('footer.footer') && h.before('main', 'footer')) || 'нужен <footer class="footer"> после main' },
        { name: 'Ни одного div не осталось', check: h => !h.count('div') || `div осталось: ${h.count('div')}` },
        { name: 'Стили на месте: шапка тёмная, у боковой колонки рамка', check: h => (h.cs('header', 'background-color') === rgb('#1f2a44') && h.cs('aside', 'border-left-width') === '4px') || 'классы потерялись — стили не применились' }
      ]
    },
    {
      id: 'k1802', lesson: 'mdk-18', module: 'mdk2', mech: 'build', title: 'Новость с датой и иллюстрацией', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Для ленты новостей колледжа нужна разметка одной новости: заголовок, дата, текст с важной пометкой и фотография с подписью.',
      goal: 'Разметьте текст как новость: всё обёрнуто в article с атрибутом data-category="events". «День открытых дверей» — заголовок h2. Дата — элемент time с атрибутом datetime="2026-10-15" внутри абзаца. Описание — абзац p, слова «вход свободный» выделены тегом mark. Ниже — figure: картинка img/art.svg с осмысленным alt и подпись figcaption «Так выглядела мастерская в прошлом году».',
      hints: [
        'Каркас: <article data-category="events"> … </article>. Атрибуты data-* придумывает сам автор.',
        'Дата для людей и для машин: <p><time datetime="2026-10-15">15 октября 2026 года</time></p>',
        'Пометка: <mark>вход свободный</mark>.',
        '<figure><img src="img/art.svg" alt="…"><figcaption>…</figcaption></figure>'
      ],
      html: `<!-- Сделайте из этого текста новость -->
День открытых дверей
15 октября 2026 года
Приглашаем школьников и родителей. Начало в 11:00, вход свободный.
Так выглядела мастерская в прошлом году`,
      css: `${BASE}
article { max-width: 600px; }
time { color: #555555; font-size: 14px; }
figure { margin: 16px 0 0; }
figcaption { font-size: 14px; color: #555555; }`,
      tests: [
        { name: 'Новость в article с data-category="events"', check: h => (h.count('article') === 1 && h.$('article').dataset.category === 'events') || 'нужен <article data-category="events">' },
        { name: 'Заголовок h2 «День открытых дверей» внутри article', check: h => h.text('article h2') === 'День открытых дверей' || 'нет h2 с этим текстом в article' },
        { name: 'Дата в time с datetime="2026-10-15"', check: h => (h.$('article time')?.getAttribute('datetime') === '2026-10-15' && /15 октября/.test(h.text('time'))) || 'нужно <time datetime="2026-10-15">15 октября 2026 года</time>' },
        { name: '«вход свободный» выделено mark в абзаце', check: h => (h.$('article p mark') && h.text('mark') === 'вход свободный') || 'нужно <mark>вход свободный</mark> внутри p' },
        { name: 'Иллюстрация: figure с img (alt) и figcaption', check: h => {
          const f = h.$('article figure'); if (!f) return 'нет figure внутри article';
          const i = f.querySelector('img');
          if (!i || !/art\.svg$/.test(i.getAttribute('src') || '') || !(i.getAttribute('alt') || '').trim()) return 'нужна <img src="img/art.svg" alt="…"> внутри figure';
          return /мастерская/.test(f.querySelector('figcaption')?.textContent || '') || 'нет figcaption с подписью'; } }
      ]
    },
    {
      id: 'k1803', lesson: 'mdk-18', module: 'mdk2', mech: 'fix', title: 'Форма на новых типах полей', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма записи на пробную тренировку: все поля типа text. На телефоне для почты не появляется «@», для телефона — цифры, а дату приходится печатать руками.',
      goal: 'Поменяйте типы полей: почта — email, телефон — tel, дата — date, число гостей — number с ограничениями min="1" и max="5". Поля «Имя» и «Почта» сделайте обязательными (required). Для даты укажите min="2026-11-01" — раньше записи нет. Подписи, id и name не меняйте.',
      hints: [
        'Тип задаётся атрибутом type: <input id="email" name="email" type="email">.',
        'Ограничения числа: type="number" min="1" max="5".',
        'Обязательное поле — атрибут без значения: required.',
        'Для type="date" min пишется в формате ГГГГ-ММ-ДД: min="2026-11-01".'
      ],
      html: `<h1>Пробная тренировка</h1>
<form class="form" action="#" method="post">
  <label for="name">Имя</label>
  <input id="name" name="name" type="text">
  <label for="email">Почта</label>
  <input id="email" name="email" type="text">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="text">
  <label for="date">Дата тренировки</label>
  <input id="date" name="date" type="text">
  <label for="guests">Сколько человек придёт</label>
  <input id="guests" name="guests" type="text">
  <button type="submit">Записаться</button>
</form>`,
      css: `${BASE}
.form label { display: block; margin-top: 12px; }
.form input { display: block; margin-top: 4px; padding: 8px; font-size: 16px; }
.form button { margin-top: 16px; padding: 10px 20px; font-size: 16px; }`,
      tests: [
        { name: 'Почта — type="email", телефон — type="tel"', check: h => (h.$('#email')?.type === 'email' && h.$('#phone')?.type === 'tel') || `сейчас: почта ${h.$('#email')?.type}, телефон ${h.$('#phone')?.type}` },
        { name: 'Дата — type="date" с min="2026-11-01"', check: h => (h.$('#date')?.type === 'date' && h.$('#date').getAttribute('min') === '2026-11-01') || 'нужно type="date" min="2026-11-01"' },
        { name: 'Число гостей — type="number" от 1 до 5', check: h => { const g = h.$('#guests'); return (g?.type === 'number' && g.getAttribute('min') === '1' && g.getAttribute('max') === '5') || 'нужно type="number" min="1" max="5"'; } },
        { name: 'Имя и почта обязательны (required)', check: h => (h.$('#name')?.required && h.$('#email')?.required) || 'добавьте required полям name и email' },
        { name: 'Подписи, id и name на месте', check: h => ['name', 'email', 'phone', 'date', 'guests'].every(id => h.$(`label[for="${id}"]`) && h.$(`#${id}`)?.getAttribute('name') === id) || 'не меняйте label for, id и name' }
      ]
    }
  );
})();
/* ---- content/tasks/k19.js ---- */
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
/* ---- content/tasks/k20.js ---- */
/* Занятие 20. Свойства CSS2 и CSS3 */
(() => {
  const { BASE } = window.COURSE_KIT;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  window.COURSE_TASKS.push(
    {
      id: 'k2001', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Обложка афиши', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Библиотека колледжа устраивает вечер настольных игр. Афиша на сайте пока скучная: тёмный прямоугольник с текстом. Сделайте из неё обложку с картинкой.',
      goal: 'У блока .cover поставьте фоновую картинку img/art.svg, растяните её на весь блок (background-size: cover) и поставьте по центру (background-position: center); тёмный background-color оставьте на случай, если картинка не загрузится. Скруглите углы обложки (border-radius не меньше 8px). Плашке с датой .cover__badge дайте полупрозрачный тёмный фон через rgba и скругление не меньше 8px. Заголовку .cover__title добавьте тень text-shadow, чтобы он читался на картинке.',
      hints: [
        'Фоновая картинка: background-image: url("img/art.svg"); Размер и положение — отдельными свойствами background-size и background-position.',
        'Полупрозрачный чёрный фон: background-color: rgba(0, 0, 0, 0.6); Четвёртое число — прозрачность, меньше 1.',
        'Абзац p растягивается на всю ширину, и фон плашки тоже. Чтобы фон был только под текстом, добавьте плашке display: inline-block и padding: 6px 12px.',
        'Тень текста: text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);'
      ],
      html: `<header class="cover">
  <p class="cover__badge">Суббота, 19:00 · читальный зал</p>
  <h1 class="cover__title">Вечер настольных игр в библиотеке</h1>
  <p class="cover__text">Вход свободный, игры принесём мы</p>
</header>`,
      css: `${BASE}
.cover {
  padding: 48px 24px;
  background-color: #2a2238;
  color: #ffffff;
}
.cover__title {
  margin: 16px 0 8px;
  font-size: 36px;
}`,
      tests: [
        { name: 'У .cover фоновая картинка img/art.svg', check: h => /art\.svg/.test(h.cs('.cover', 'background-image')) || 'нет background-image: url("img/art.svg")' },
        { name: 'Картинка закрывает весь блок: background-size: cover', check: h => h.cs('.cover', 'background-size') === 'cover' || `сейчас ${h.cs('.cover', 'background-size')}` },
        { name: 'Картинка по центру: background-position: center', check: h => h.cs('.cover', 'background-position') === '50% 50%' || `сейчас ${h.cs('.cover', 'background-position')}` },
        { name: 'Тёмный background-color у обложки сохранён', check: h => h.cs('.cover', 'background-color') === 'rgb(42, 34, 56)' || 'верните background-color: #2a2238' },
        { name: 'Скругление обложки не меньше 8px', check: h => radius(h, '.cover') >= 8 || `сейчас ${radius(h, '.cover')}px` },
        { name: 'Плашка с датой: полупрозрачный фон rgba и скругление от 8px', check: h => {
          const m = h.cs('.cover__badge', 'background-color').match(/rgba\([^)]*,\s*([\d.]+)\)/);
          if (!m || +m[1] <= 0.2 || +m[1] >= 1) return 'нужен фон rgba(…, …, …, 0.5) — прозрачность от 0.3 до 0.9';
          return radius(h, '.cover__badge') >= 8 || 'скругление плашки меньше 8px';
        } },
        { name: 'У заголовка есть тень text-shadow', check: h => h.cs('.cover__title', 'text-shadow') !== 'none' || 'нет text-shadow' }
      ]
    },
    {
      id: 'k2002', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Карточка с живой кнопкой', level: 'Среднее', minutes: 20, points: 150,
      story: 'Кофейня у колледжа выкладывает напитки недели на сайт. Карточка выглядит плоской, а кнопка «Заказать» никак не отвечает на наведение мыши.',
      goal: 'Карточке .card дайте скругление не меньше 12px и мягкую тень box-shadow, рамку border уберите. Картинку .card__img скруглите (не меньше 8px). Кнопке .card__btn: скругление не меньше 8px и transition на transform длительностью от 0.1 до 0.5 секунды. В правиле .card__btn:hover кнопка приподнимается или увеличивается (transform) и темнеет (другой background-color).',
      hints: [
        'Мягкая тень: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); А строку border у .card просто удалите.',
        'Переход пишется у обычного состояния: .card__btn { transition: transform 0.2s ease, background-color 0.2s ease; }',
        'Новое правило: .card__btn:hover { transform: translateY(-2px); background-color: #5c260b; }'
      ],
      html: `<article class="card">
  <img class="card__img" src="img/art.svg" alt="Кофейня вечером">
  <h2 class="card__title">Раф «Лавандовый»</h2>
  <p class="card__price">220 ₽ · 300 мл</p>
  <a class="card__btn" href="#order">Заказать</a>
</article>`,
      css: `${BASE}
.card {
  width: 260px;
  padding: 16px;
  border: 1px solid #999999;
  background-color: #ffffff;
}
.card__img {
  display: block;
  width: 100%;
}
.card__btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #8a3b12;
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'Карточка скруглена (от 12px) и с тенью, без рамки', check: h => {
          if (radius(h, '.card') < 12) return `скругление ${radius(h, '.card')}px`;
          if (h.cs('.card', 'box-shadow') === 'none') return 'нет box-shadow';
          return h.px('.card', 'border-top-width') === 0 || 'рамка border осталась';
        } },
        { name: 'Картинка скруглена (от 8px)', check: h => radius(h, '.card__img') >= 8 || `сейчас ${radius(h, '.card__img')}px` },
        { name: 'Кнопка скруглена (от 8px)', check: h => radius(h, '.card__btn') >= 8 || `сейчас ${radius(h, '.card__btn')}px` },
        { name: 'У кнопки transition на transform от 0.1 до 0.5 с', check: h => {
          const props = h.cs('.card__btn', 'transition-property').split(',').map(s => s.trim());
          const durs = h.cs('.card__btn', 'transition-duration').split(',').map(s => parseFloat(s) * (/ms/.test(s) ? 0.001 : 1));
          const i = props.findIndex(p => p === 'transform' || p === 'all');
          if (i < 0) return 'в transition нет transform';
          const d = durs[i % durs.length];
          return (d >= 0.1 && d <= 0.5) || `длительность ${d}s`;
        } },
        { name: 'В .card__btn:hover есть transform', check: h => h.rules.some(r => /\.card__btn:hover/.test(r.selector) && r.style.getPropertyValue('transform') && r.style.getPropertyValue('transform') !== 'none') || 'нет правила .card__btn:hover с transform' },
        { name: 'В .card__btn:hover меняется цвет фона', check: h => h.rules.some(r => /\.card__btn:hover/.test(r.selector) && r.style.getPropertyValue('background-color')) || 'в :hover нет background-color' }
      ]
    },
    {
      id: 'k2003', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Значок «Новинка» и свой шрифт', level: 'Среднее', minutes: 20, points: 150,
      story: 'В столовой колледжа новое меню. На баннере нужен пульсирующий значок «Новинка», а текст — фирменным шрифтом Golos. И никого не должно укачать.',
      goal: 'Подключите шрифт через @font-face: имя Golos, файл fonts/golos-text-cyrillic-400-normal.woff2. Поставьте его блоку .promo: font-family с Golos первым и запасными Arial, sans-serif. Опишите анимацию @keyframes pulse (значок увеличивается через transform: scale и возвращается обратно) и подключите её к .promo__badge: бесконечно (infinite), длительность от 1 до 3 секунд. Добавьте @media (prefers-reduced-motion: reduce), где у .promo__badge анимация выключена (animation: none).',
      hints: [
        '@font-face { font-family: "Golos"; src: url("fonts/golos-text-cyrillic-400-normal.woff2") format("woff2"); }',
        'Кадры: @keyframes pulse { from { transform: scale(1); } 50% { transform: scale(1.1); } to { transform: scale(1); } }',
        'Подключение: .promo__badge { animation: pulse 1.5s ease-in-out infinite; }',
        'Медиазапрос пишется отдельным блоком: @media (prefers-reduced-motion: reduce) { .promo__badge { animation: none; } }'
      ],
      html: `<section class="promo">
  <h2 class="promo__title">Новое меню столовой <span class="promo__badge">Новинка</span></h2>
  <p>С понедельника — суп дня, свежая выпечка и комплексный обед за 250 ₽.</p>
</section>`,
      css: `${BASE}
.promo {
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff8e1;
}
.promo__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #ffd54f;
  color: #222222;
  font-size: 14px;
}`,
      tests: [
        { name: 'Есть @font-face с файлом fonts/golos-text-cyrillic-400-normal.woff2', check: h => /@font-face\s*\{[^}]*url\(\s*["']?fonts\/golos-text-cyrillic-400-normal\.woff2/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, '')) || 'нет @font-face с этим файлом' },
        { name: 'У .promo font-family: Golos, потом запасные Arial, sans-serif', check: h => { const f = h.cs('.promo', 'font-family'); return (/^"?Golos"?,/.test(f) && /sans-serif\s*$/.test(f)) || `сейчас: ${f}`; } },
        { name: 'Есть @keyframes pulse с transform', check: h => /@keyframes\s+pulse\s*\{[\s\S]*transform\s*:\s*scale/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, '')) || 'нет @keyframes pulse со scale' },
        { name: 'Значок анимирован pulse бесконечно, круг от 1 до 3 секунд', check: h => {
          if (h.cs('.promo__badge', 'animation-name') !== 'pulse') return 'у .promo__badge нет animation: pulse';
          if (h.cs('.promo__badge', 'animation-iteration-count') !== 'infinite') return 'нужно infinite';
          const d = parseFloat(h.cs('.promo__badge', 'animation-duration'));
          return (d >= 1 && d <= 3) || `длительность ${d}s`;
        } },
        { name: 'В @media (prefers-reduced-motion: reduce) анимация значка выключена', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media) && /\.promo__badge/.test(r.selector) && r.style.getPropertyValue('animation-name') === 'none') || 'нет такого медиазапроса с animation: none' }
      ]
    }
  );
})();
/* ---- content/tasks/k21.js ---- */
/* Занятие 21. Вёрстка страниц: Flexbox */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2101', lesson: 'mdk-21', module: 'mdk3', mech: 'build', title: 'Шапка спортзала', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Спортзал «Пульс» делает сайт. В шапке название и меню идут друг под другом, а дизайнер нарисовал их в одну строку.',
      goal: 'Сделайте шапку .header flex-контейнером: логотип .header__logo у левого края, меню .header__nav у правого (justify-content: space-between), по вертикали по центру (align-items: center). Пункты списка .menu поставьте в ряд через flex с промежутком gap не меньше 16px.',
      hints: [
        'В шапке два прямых ребёнка: ссылка-логотип и nav. Значит, display: flex пишем самой .header.',
        'Раздвинуть по краям: justify-content: space-between; выровнять по высоте: align-items: center;',
        'Пункты меню — дети ul.menu, поэтому второй flex-контейнер — .menu: .menu { display: flex; gap: 24px; }'
      ],
      html: `<header class="header">
  <a class="header__logo" href="#top">Спортзал «Пульс»</a>
  <nav class="header__nav">
    <ul class="menu">
      <li><a href="#schedule">Расписание</a></li>
      <li><a href="#prices">Цены</a></li>
      <li><a href="#coaches">Тренеры</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>`,
      css: `${BASE}
.header {
  padding: 16px 24px;
  background-color: #1f2a44;
}
.header__logo {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}
.menu {
  margin: 0;
  padding: 0;
  list-style: none;
}
.menu a {
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шапка .header — flex-контейнер', check: h => h.cs('.header', 'display') === 'flex' || `display: ${h.cs('.header', 'display')}` },
        { name: 'Логотип у левого края, меню у правого', check: h => {
          if (h.cs('.header', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          const H = h.rect('.header'), L = h.rect('.header__logo'), N = h.rect('.header__nav');
          return (Math.abs(L.left - H.left - 24) < 2 && Math.abs(H.right - 24 - N.right) < 2) || 'логотип и меню не прижаты к краям';
        } },
        { name: 'Логотип и меню выровнены по центру по высоте', check: h => h.cs('.header', 'align-items') === 'center' || `align-items: ${h.cs('.header', 'align-items')}` },
        { name: 'Пункты меню в одну строку', check: h => (h.cs('.menu', 'display') === 'flex' && h.sameRow(h.$$('.menu li'))) || 'у .menu нет display: flex' },
        { name: 'Между пунктами меню gap не меньше 16px', check: h => h.px('.menu', 'column-gap') >= 16 || `сейчас ${h.cs('.menu', 'column-gap')}` }
      ]
    },
    {
      id: 'k2102', lesson: 'mdk-21', module: 'mdk3', mech: 'build', title: 'Ряд абонементов', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице «Цены» три абонемента. На компьютере они должны стоять в ряд одинаковой ширины, а на телефоне — друг под другом, без прокрутки вбок.',
      goal: 'Сделайте .plans__list flex-контейнером с переносом (flex-wrap: wrap) и промежутком gap не меньше 16px. Карточкам .plan задайте flex: 1 1 220px. На компьютере три карточки встанут в один ряд одинаковой ширины, на телефоне (360px) — каждая на своей строке, без горизонтальной прокрутки.',
      hints: [
        'Контейнер — общий родитель карточек: .plans__list { display: flex; }',
        'Добавьте ему flex-wrap: wrap; и gap: 24px;',
        'Карточке: .plan { flex: 1 1 220px; } — начальная ширина 220px, растёт и сжимается вместе с соседями.'
      ],
      html: `<section class="plans">
  <h2>Абонементы</h2>
  <div class="plans__list">
    <article class="plan">
      <h3>Утренний</h3>
      <p>С 7:00 до 12:00 в будни</p>
      <p class="plan__price">1200 ₽ в месяц</p>
    </article>
    <article class="plan">
      <h3>Студенческий</h3>
      <p>В любое время, при предъявлении студенческого билета</p>
      <p class="plan__price">1500 ₽ в месяц</p>
    </article>
    <article class="plan">
      <h3>Безлимит</h3>
      <p>В любое время плюс групповые занятия</p>
      <p class="plan__price">2500 ₽ в месяц</p>
    </article>
  </div>
</section>`,
      css: `${BASE}
.plan {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.plan h3 {
  margin-top: 0;
}
.plan__price {
  margin-bottom: 0;
  font-weight: bold;
  color: #1f2a44;
}`,
      tests: [
        { name: '.plans__list — flex-контейнер', check: h => h.cs('.plans__list', 'display') === 'flex' || `display: ${h.cs('.plans__list', 'display')}` },
        { name: 'Перенос разрешён: flex-wrap: wrap', check: h => h.cs('.plans__list', 'flex-wrap') === 'wrap' || `flex-wrap: ${h.cs('.plans__list', 'flex-wrap')}` },
        { name: 'Между карточками gap не меньше 16px', check: h => h.px('.plans__list', 'column-gap') >= 16 || `сейчас ${h.cs('.plans__list', 'column-gap')}` },
        { name: 'Карточки растут: flex-grow 1, начальная ширина flex-basis около 220px', check: h => (h.cs('.plan', 'flex-grow') === '1' && Math.abs(h.px('.plan', 'flex-basis') - 220) <= 20) || `flex: ${h.cs('.plan', 'flex-grow')} ${h.cs('.plan', 'flex-shrink')} ${h.cs('.plan', 'flex-basis')}` },
        { name: 'На компьютере три карточки в ряд одинаковой ширины', check: h => {
          const p = h.$$('.plan'), w = p.map(e => e.getBoundingClientRect().width);
          return (h.sameRow(p) && Math.max(...w) - Math.min(...w) < 2) || 'карточки не в одном ряду или разной ширины';
        } },
        { name: 'На телефоне карточки друг под другом, прокрутки вбок нет', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const r = h.$$('.plan').map(e => e.getBoundingClientRect());
          return r.every((x, i) => !i || x.top >= r[i - 1].bottom - 1) || 'карточки не переносятся';
        } }
      ]
    },
    {
      id: 'k2103', lesson: 'mdk-21', module: 'mdk3', mech: 'fix', title: 'Окно по центру', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт записи к врачу показывает окно «Вы записаны». Прошлый верстальщик поставил его «в центр» подбором отступов: на его ноутбуке ровно, на других экранах криво, а на телефоне окно уезжает за край.',
      goal: 'Уберите у .notice подобранные margin-left и margin-top, ширину задайте через max-width: 320px вместо width. Поставьте окно в центр .screen с помощью Flexbox: display: flex, justify-content: center, align-items: center (min-height у .screen оставьте). Кнопки в .notice__actions поставьте в ряд через flex с gap не меньше 12px и по центру. На телефоне окно тоже по центру и без горизонтальной прокрутки.',
      hints: [
        'Центрирует родитель: .screen { display: flex; justify-content: center; align-items: center; }',
        'Строки margin-left: 300px и margin-top: 120px удалите совсем, а width: 320px замените на max-width: 320px.',
        'Кнопки: .notice__actions { display: flex; justify-content: center; gap: 12px; }'
      ],
      html: `<main class="screen">
  <section class="notice">
    <h1 class="notice__title">Вы записаны</h1>
    <p>Терапевт Иванова О. П., вторник, 14:30, кабинет 12.</p>
    <div class="notice__actions">
      <a class="btn" href="#cabinet">Мои записи</a>
      <a class="btn btn--light" href="#home">На главную</a>
    </div>
  </section>
</main>`,
      css: `${BASE}
.screen {
  min-height: 400px;
  background-color: #e8f0fe;
}
.notice {
  width: 320px;
  margin-left: 300px;
  margin-top: 120px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.notice__title {
  margin-top: 0;
  font-size: 28px;
}
.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
}
.btn--light {
  background-color: #e8f0fe;
  color: #1a3d7a;
}`,
      tests: [
        { name: '.screen — flex-контейнер с центрированием по обеим осям', check: h => (h.cs('.screen', 'display') === 'flex' && h.cs('.screen', 'justify-content') === 'center' && h.cs('.screen', 'align-items') === 'center') || 'нужны display: flex, justify-content: center, align-items: center' },
        { name: 'Подобранных отступов у .notice больше нет', check: h => (h.px('.notice', 'margin-left') === 0 && h.px('.notice', 'margin-top') === 0) || 'margin-left или margin-top остались' },
        { name: 'Ширина окна через max-width: 320px', check: h => (h.px('.notice', 'max-width') === 320 && !/width\s*:\s*320px/.test(h.css.replace(/max-width\s*:\s*320px/g, ''))) || 'замените width: 320px на max-width: 320px' },
        { name: 'На компьютере окно ровно в центре .screen', check: h => {
          const s = h.rect('.screen'), n = h.rect('.notice');
          return (Math.abs((s.left + s.right) / 2 - (n.left + n.right) / 2) < 2 && Math.abs((s.top + s.bottom) / 2 - (n.top + n.bottom) / 2) < 2) || 'окно не в центре';
        } },
        { name: 'Кнопки в ряд через flex, gap от 12px, по центру', check: h => (h.cs('.notice__actions', 'display') === 'flex' && h.px('.notice__actions', 'column-gap') >= 12 && h.cs('.notice__actions', 'justify-content') === 'center') || 'у .notice__actions нужны display: flex, gap и justify-content: center' },
        { name: 'На телефоне окно по центру и без прокрутки вбок', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const s = h.rect('.screen'), n = h.rect('.notice');
          return Math.abs((s.left + s.right) / 2 - (n.left + n.right) / 2) < 2 || 'окно не по центру';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/k22.js ---- */
/* Занятие 22. Вёрстка страниц: Grid и адаптивность */
(() => {
  const { BASE } = window.COURSE_KIT;
  const stacked = els => els.every((x, i) => !i || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);
  window.COURSE_TASKS.push(
    {
      id: 'k2201', lesson: 'mdk-22', module: 'mdk3', mech: 'build', title: 'Галерея фотоконкурса', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Студсовет проводит фотоконкурс «Мой колледж». Работы нужно показать галереей: на компьютере в несколько колонок, на телефоне — по одной.',
      goal: 'Сделайте .gallery grid-контейнером. Колонки задайте одной строкой: repeat(auto-fit, minmax(200px, 1fr)), промежуток gap не меньше 16px. Картинки .gallery img растяните на всю ширину ячейки (width: 100%, height: auto, display: block). На компьютере в первом ряду окажется не меньше трёх работ, на телефоне — одна колонка без прокрутки вбок.',
      hints: [
        'Начните с контейнера: .gallery { display: grid; gap: 16px; }',
        'Колонки, которые сами считают своё число: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
        'Картинка размером 600px сейчас шире ячейки. Правило .gallery img { display: block; width: 100%; height: auto; } вписывает её в ячейку.'
      ],
      html: `<h2>Фотоконкурс «Мой колледж»</h2>
<div class="gallery">
  <figure><img src="img/art.svg" alt="Закат над учебным корпусом"><figcaption>Анна К., «Закат»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Двор колледжа вечером"><figcaption>Илья П., «Вечер»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Луна над спортзалом"><figcaption>Мария С., «Луна»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Дорога к общежитию"><figcaption>Тимур Р., «Дорога домой»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Силуэт библиотеки"><figcaption>Ольга Д., «Библиотека»</figcaption></figure>
  <figure><img src="img/art.svg" alt="Огни мастерских"><figcaption>Денис В., «Огни»</figcaption></figure>
</div>`,
      css: `${BASE}
.gallery figure {
  margin: 0;
}
figcaption {
  margin-top: 6px;
  font-size: 14px;
  color: #555555;
}`,
      tests: [
        { name: '.gallery — grid-контейнер', check: h => h.cs('.gallery', 'display') === 'grid' || `display: ${h.cs('.gallery', 'display')}` },
        { name: 'Колонки: repeat(auto-fit, minmax(200px, 1fr))', check: h => h.has(/grid-template-columns\s*:\s*repeat\(\s*auto-(fit|fill)\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\s*\)/) || 'нет такой записи в grid-template-columns' },
        { name: 'Промежуток gap не меньше 16px', check: h => h.px('.gallery', 'column-gap') >= 16 || `сейчас ${h.cs('.gallery', 'column-gap')}` },
        { name: 'На компьютере в первом ряду не меньше трёх работ', check: h => { const f = h.$$('.gallery figure'), t = f[0].getBoundingClientRect().top; const n = f.filter(e => Math.abs(e.getBoundingClientRect().top - t) < 2).length; return n >= 3 || `в первом ряду ${n}`; } },
        { name: 'Картинки во всю ширину своей ячейки', check: h => h.$$('.gallery figure').every(f => Math.abs(f.querySelector('img').getBoundingClientRect().width - f.getBoundingClientRect().width) < 2) || 'картинка не совпадает по ширине с ячейкой' },
        { name: 'На телефоне одна колонка и нет прокрутки вбок', at: 360, check: h => !h.overflow() && stacked(h.$$('.gallery figure')) || 'на 360px работы не в одну колонку или есть прокрутка' }
      ]
    },
    {
      id: 'k2202', lesson: 'mdk-22', module: 'mdk3', mech: 'build', title: 'Страница по областям', level: 'Среднее', minutes: 25, points: 150,
      story: 'Нужно разложить страницу расписания колледжа: шапка, меню, расписание, объявления и подвал. На телефоне всё идёт столбиком, на планшете и компьютере — три колонки.',
      goal: 'Mobile first. У .page: display: grid, gap не меньше 16px и схема из одной колонки через grid-template-areas с областями header, nav, main, aside, footer (в этом порядке). Каждому блоку назначьте область через grid-area: .page__header — header, .page__nav — nav, .page__main — main, .page__aside — aside, .page__footer — footer. В @media (min-width: 768px) задайте колонки 200px 1fr 200px и схему: шапка и подвал во всю ширину, между ними nav, main, aside. Медиазапросы с max-width не используйте.',
      hints: [
        'Схема на телефоне — пять строк по одному слову: grid-template-areas: "header" "nav" "main" "aside" "footer";',
        'Каждому блоку своя область: .page__header { grid-area: header; } и так далее для всех пяти.',
        'В медиазапросе меняем только .page: grid-template-columns: 200px 1fr 200px; и схему из трёх строк по три слова.',
        'Схема для широкого экрана: "header header header" "nav main aside" "footer footer footer"'
      ],
      html: `<div class="page">
  <header class="page__header">
    <p class="page__logo">Колледж связи · Расписание</p>
  </header>
  <nav class="page__nav">
    <ul>
      <li><a href="#mon">Понедельник</a></li>
      <li><a href="#tue">Вторник</a></li>
      <li><a href="#wed">Среда</a></li>
    </ul>
  </nav>
  <main class="page__main">
    <h1>Расписание группы ИС-11</h1>
    <p>Первая пара начинается в 8:30. Перерыв между парами — 10 минут, большой перерыв после второй пары — 40 минут.</p>
  </main>
  <aside class="page__aside">
    <h2>Объявления</h2>
    <p>В пятницу консультация по МДК.08.01 переносится в кабинет 214.</p>
  </aside>
  <footer class="page__footer">
    <p>Учебная часть: кабинет 101</p>
  </footer>
</div>`,
      css: `${BASE}
.page > * {
  padding: 16px;
  border-radius: 8px;
}
.page p {
  margin: 0;
}
.page__header,
.page__footer {
  background-color: #1f2a44;
  color: #ffffff;
}
.page__nav,
.page__aside {
  background-color: #f1f4fa;
}
.page__nav ul {
  margin: 0;
  padding-left: 20px;
}
.page__main h1 {
  margin-top: 0;
}`,
      tests: [
        { name: '.page — grid-контейнер с gap от 16px', check: h => (h.cs('.page', 'display') === 'grid' && h.px('.page', 'row-gap') >= 16) || 'нужны display: grid и gap: 16px' },
        { name: 'Блоки стоят в областях header, nav, main, aside, footer', check: h => {
          const map = { '.page__header': 'header', '.page__nav': 'nav', '.page__main': 'main', '.page__aside': 'aside', '.page__footer': 'footer' };
          for (const [s, a] of Object.entries(map)) if (h.cs(s, 'grid-row-start') !== a) return `${s}: нет grid-area: ${a}`;
          return h.has(/grid-template-areas/) || 'нет grid-template-areas';
        } },
        { name: 'На компьютере шапка и подвал во всю ширину, подвал внизу', check: h => {
          const p = h.rect('.page'), hd = h.rect('.page__header'), ft = h.rect('.page__footer'), m = h.rect('.page__main');
          return (Math.abs(hd.width - p.width) < 2 && Math.abs(ft.width - p.width) < 2 && ft.top >= m.bottom - 1) || 'шапка или подвал не во всю ширину';
        } },
        { name: 'На компьютере три колонки: меню, расписание, объявления', check: h => {
          const n = h.rect('.page__nav'), m = h.rect('.page__main'), a = h.rect('.page__aside');
          if (!(n.right <= m.left + 1 && m.right <= a.left + 1 && Math.abs(n.top - m.top) < 2 && Math.abs(a.top - m.top) < 2)) return 'nav, main и aside не стоят в один ряд';
          return (Math.abs(n.width - 200) < 2 && Math.abs(a.width - 200) < 2 && m.width > 300) || 'колонки должны быть 200px 1fr 200px';
        } },
        { name: 'Mobile first: колонки добавлены в @media (min-width: 768px), без max-width', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'есть медиазапрос с max-width';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.page\b/.test(r.selector) && r.style.getPropertyValue('grid-template-areas')) || 'нет @media (min-width: 768px) со схемой для .page';
        } },
        { name: 'На телефоне все блоки столбиком по порядку, без прокрутки', at: 360, check: h => {
          if (h.overflow()) return 'есть горизонтальная прокрутка';
          const els = ['.page__header', '.page__nav', '.page__main', '.page__aside', '.page__footer'].map(s => h.$(s));
          const w = h.rect('.page').width;
          return (stacked(els) && els.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) || 'блоки не в одну колонку';
        } }
      ]
    },
    {
      id: 'k2203', lesson: 'mdk-22', module: 'mdk3', mech: 'adaptive', title: 'Статья не помещается в телефон', level: 'Среднее', minutes: 20, points: 150,
      story: 'Статью «Как подготовиться к сессии» сверстали только для компьютера: ширина 960px, колонки в пикселях, картинка 600px. На телефоне страницу приходится листать вбок.',
      goal: 'Переделайте вёрстку по принципу mobile first. У .layout вместо width: 960px — max-width: 960px; базовые стили без колонок (на телефоне статья и боковая колонка идут друг под другом). В @media (min-width: 768px) задайте .layout колонки 2fr 1fr. Картинку .post__img сделайте резиновой: max-width: 100% и height: auto. На телефоне не должно быть горизонтальной прокрутки, картинка не шире статьи и не сплющена.',
      hints: [
        'Начните с картинки: .post__img { display: block; max-width: 100%; height: auto; }',
        'У .layout удалите grid-template-columns и замените width на max-width. Без колонок grid ставит блоки друг под другом.',
        'Колонки — только для широких экранов: @media (min-width: 768px) { .layout { grid-template-columns: 2fr 1fr; } }'
      ],
      html: `<div class="layout">
  <article class="post">
    <h1>Как подготовиться к сессии</h1>
    <img class="post__img" src="img/art.svg" width="600" height="300" alt="Вечерний город за окном читального зала">
    <p>Начните за месяц: составьте список экзаменов и зачётов, рядом запишите, что уже сдано и чего не хватает.</p>
    <p>Разбейте подготовку на короткие подходы по 25 минут с перерывами. Так проще не отвлекаться на телефон.</p>
  </article>
  <aside class="sidebar">
    <h2>Полезные ссылки</h2>
    <ul>
      <li><a href="#library">Электронная библиотека</a></li>
      <li><a href="#schedule">Расписание экзаменов</a></li>
      <li><a href="#consult">Консультации</a></li>
    </ul>
  </aside>
</div>`,
      css: `${BASE}
.layout {
  display: grid;
  grid-template-columns: 640px 300px;
  gap: 20px;
  width: 960px;
  margin: 0 auto;
}
.post__img {
  display: block;
}
.sidebar {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.sidebar h2 {
  margin-top: 0;
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страницу можно листать вбок' },
        { name: 'На телефоне картинка не шире статьи и не сплющена', at: 360, check: h => {
          const i = h.rect('.post__img'), p = h.rect('.post');
          if (i.width > p.width + 1) return `картинка ${Math.round(i.width)}px шире статьи ${Math.round(p.width)}px`;
          return Math.abs(i.width / i.height - 2) < 0.05 || 'пропорции картинки нарушены: нужен height: auto';
        } },
        { name: 'На телефоне боковая колонка под статьёй', at: 360, check: h => h.rect('.sidebar').top >= h.rect('.post').bottom - 1 || 'колонки стоят рядом' },
        { name: 'На компьютере две колонки: статья шире боковой', check: h => {
          const p = h.rect('.post'), s = h.rect('.sidebar');
          return (s.left >= p.right - 1 && Math.abs(s.top - p.top) < 2 && p.width > s.width * 1.5) || 'нужны две колонки 2fr 1fr';
        } },
        { name: 'У .layout max-width вместо фиксированной ширины', check: h => (h.cs('.layout', 'max-width') === '960px' && !/(^|[^-])width\s*:\s*960px/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, ''))) || 'замените width: 960px на max-width: 960px' },
        { name: 'Mobile first: колонки только в @media (min-width: 768px)', check: h => {
          if (h.rules.some(r => !r.media && /\.layout/.test(r.selector) && r.style.getPropertyValue('grid-template-columns'))) return 'в базовых стилях .layout остались колонки';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.layout/.test(r.selector) && r.style.getPropertyValue('grid-template-columns')) || 'нет колонок в @media (min-width: 768px)';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/k23.js ---- */
/* Занятие 23. Практическая работа №5 (ч. 1). Вёрстка страницы по макету */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  window.COURSE_TASKS.push(
    {
      id: 'k2301', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: шапка и первый экран', level: 'Среднее', minutes: 30, points: 150,
      story: 'Кофейня «Зерно» у колледжа заказала одностраничный сайт — лендинг. Начинаем сверху: шапка и первый экран с главным призывом.',
      goal: 'В секции .hero напишите заголовок h1 (не короче 10 символов), абзац p и ссылку-кнопку a с классом btn. Шапка .header — flex: логотип слева, меню справа (space-between), по центру по высоте. Пункты .menu — в ряд через flex с gap не меньше 16px. Первый экран: фон — линейный градиент (linear-gradient) в тёмных тонах, текст белый (#ffffff), padding сверху и снизу не меньше 48px, размер h1 не меньше 40px. Кнопка .btn: display: inline-block, padding сверху не меньше 10px, скругление не меньше 8px, фон var(--accent) и белый текст, transition и правило .btn:hover.',
      hints: [
        'HTML первого экрана: <h1>Кофе, который ждёт вас между парами</h1>, потом <p>…</p> и <a class="btn" href="#menu">Посмотреть меню</a>.',
        'Шапка — как на занятии про Flexbox: .header { display: flex; justify-content: space-between; align-items: center; }',
        'Градиент пишется в background-image: linear-gradient(135deg, #3b2416, #6b3d1f); Белый текст: color: #ffffff;',
        'Кнопка: .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background-color: var(--accent); color: #ffffff; text-decoration: none; transition: background-color 0.2s; } и .btn:hover { background-color: #7d3f14; }'
      ],
      html: `<header class="header">
  <a class="header__logo" href="#top">Зерно</a>
  <nav>
    <ul class="menu">
      <li><a href="#menu">Меню</a></li>
      <li><a href="#about">О нас</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<section class="hero">
  <!-- Напишите здесь заголовок h1, абзац p и ссылку-кнопку a с классом btn -->
</section>`,
      css: `${BASE}
${PALETTE}
.header {
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  margin: 0;
  padding: 0;
  list-style: none;
}`,
      tests: [
        { name: 'В первом экране h1, абзац и ссылка-кнопка .btn', check: h => {
          if (h.count('.hero h1') !== 1 || h.text('.hero h1').length < 10) return 'нужен один h1 не короче 10 символов';
          if (h.text('.hero p').length < 10) return 'нет абзаца с текстом';
          const a = h.$('.hero a.btn');
          return !!(a && a.getAttribute('href') && a.textContent.trim().length >= 3) || 'нет ссылки a.btn с href и текстом';
        } },
        { name: 'Шапка: логотип слева, меню справа, по центру по высоте', check: h => (h.cs('.header', 'display') === 'flex' && h.cs('.header', 'justify-content') === 'space-between' && h.cs('.header', 'align-items') === 'center') || 'у .header нужны display: flex, justify-content: space-between, align-items: center' },
        { name: 'Пункты меню в ряд, gap от 16px', check: h => (h.cs('.menu', 'display') === 'flex' && h.sameRow(h.$$('.menu li')) && h.px('.menu', 'column-gap') >= 16) || 'у .menu нужны display: flex и gap' },
        { name: 'Первый экран на градиенте, текст белый', check: h => {
          if (!/linear-gradient/.test(h.cs('.hero', 'background-image'))) return 'нет linear-gradient у .hero';
          return h.cs('.hero', 'color') === 'rgb(255, 255, 255)' || 'цвет текста .hero не белый';
        } },
        { name: 'Просторный экран: padding сверху и снизу от 48px, h1 от 40px', check: h => {
          if (h.px('.hero', 'padding-top') < 48 || h.px('.hero', 'padding-bottom') < 48) return `padding: ${h.cs('.hero', 'padding-top')} / ${h.cs('.hero', 'padding-bottom')}`;
          return h.px('.hero h1', 'font-size') >= 40 || `h1 сейчас ${h.cs('.hero h1', 'font-size')}`;
        } },
        { name: 'Кнопка: inline-block, отступы, скругление от 8px, фон --accent', check: h => {
          if (!/inline-(block|flex)/.test(h.cs('.btn', 'display'))) return 'нужно display: inline-block';
          if (h.px('.btn', 'padding-top') < 10) return 'маленький padding';
          if (radius(h, '.btn') < 8) return 'скругление меньше 8px';
          return h.cs('.btn', 'background-color') === 'rgb(164, 84, 28)' || 'фон кнопки — var(--accent)';
        } },
        { name: 'Кнопка плавно реагирует на наведение', check: h => (h.cs('.btn', 'transition-duration').split(',').some(d => parseFloat(d) > 0) && h.rules.some(r => /\.btn:hover/.test(r.selector))) || 'нужны transition у .btn и правило .btn:hover' }
      ]
    },
    {
      id: 'k2302', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: преимущества на Flexbox', level: 'Среднее', minutes: 25, points: 150,
      story: 'Второй блок лендинга — три причины зайти в «Зерно». По макету это три одинаковые карточки в ряд, в каждой иконка, заголовок и короткий текст.',
      goal: 'Допишите третье преимущество по образцу: li.feature с иконкой img (alt=""), заголовком h3 «Есть розетки» и абзацем. Список .features__list: без маркеров и отступа слева, flex, gap не меньше 24px; три карточки стоят в один ряд и одинаковой ширины (flex: 1). Иконка .feature__icon — 48×48px. Карточка .feature: фон var(--cream), padding не меньше 16px, скругление не меньше 12px.',
      hints: [
        'Скопируйте любой li.feature целиком и поменяйте текст. Иконка — украшение, поэтому alt пустой.',
        'Маркеры и отступ у списка: list-style: none; padding-left: 0; Потом display: flex; gap: 24px;',
        'Одинаковая ширина: .feature { flex: 1; } Иконке задайте width: 48px; height: 48px;'
      ],
      html: `<section class="features" id="about">
  <h2>Почему к нам заходят между парами</h2>
  <ul class="features__list">
    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Быстро</h3>
      <p>Заказ готов за 5 минут — успеете до звонка.</p>
    </li>
    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Студенческие цены</h3>
      <p>Скидка 15% по студенческому билету.</p>
    </li>
    <!-- Третье преимущество «Есть розетки»: напишите по образцу -->
  </ul>
</section>`,
      css: `${BASE}
${PALETTE}
.features h2 {
  color: var(--coffee);
}
.feature h3 {
  margin: 12px 0 8px;
  color: var(--coffee);
}
.feature p {
  margin: 0;
}`,
      tests: [
        { name: 'Три преимущества: иконка, h3 и абзац; третье — «Есть розетки»', check: h => {
          const f = h.$$('li.feature');
          if (f.length !== 3) return `преимуществ: ${f.length}`;
          if (!f.every(e => e.querySelector('img[alt]') && e.querySelector('h3')?.textContent.trim() && e.querySelector('p')?.textContent.trim().length > 5)) return 'в каждом нужны img с alt, h3 и p';
          return /розетк/i.test(f[2].querySelector('h3').textContent) || 'третий заголовок — «Есть розетки»';
        } },
        { name: 'Список без маркеров и отступа слева', check: h => (h.cs('.features__list', 'list-style-type') === 'none' && h.px('.features__list', 'padding-left') === 0) || 'нужны list-style: none и padding-left: 0' },
        { name: 'Список — flex с gap от 24px', check: h => (h.cs('.features__list', 'display') === 'flex' && h.px('.features__list', 'column-gap') >= 24) || 'нужны display: flex и gap: 24px' },
        { name: 'Три карточки в ряд одинаковой ширины', check: h => { const f = h.$$('.feature'), w = f.map(e => e.getBoundingClientRect().width); return (f.length === 3 && h.sameRow(f) && Math.max(...w) - Math.min(...w) < 2) || 'карточки не в ряд или разной ширины'; } },
        { name: 'Иконки 48×48px', check: h => h.$$('.feature__icon').every(i => { const r = i.getBoundingClientRect(); return Math.abs(r.width - 48) < 1 && Math.abs(r.height - 48) < 1; }) || 'размер иконок не 48×48' },
        { name: 'Карточка: фон --cream, padding от 16px, скругление от 12px', check: h => (h.cs('.feature', 'background-color') === 'rgb(253, 246, 238)' && h.px('.feature', 'padding-top') >= 16 && radius(h, '.feature') >= 12) || 'проверьте фон, padding и border-radius у .feature' }
      ]
    },
    {
      id: 'k2303', lesson: 'mdk-23', module: 'mdk3', mech: 'build', title: 'Лендинг: меню на Grid и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Самый большой блок — меню кофейни: шесть карточек ровной сеткой. Тексты у напитков разной длины, а кнопки «В заказ» по макету стоят на одной линии внизу. Под меню — подвал с контактами.',
      goal: 'Добавьте ещё четыре карточки .product по образцу: Американо, Какао, Чай с чабрецом, Сырник — в каждой картинка с alt, h3, абзац, цена .product__price и ссылка .product__btn. Сетка .catalog__grid: grid, три равные колонки (repeat(3, 1fr)), gap не меньше 24px. Карточка: скругление не меньше 12px, тень box-shadow, картинка во всю ширину карточки. Кнопки «В заказ» в одном ряду стоят на одной линии внизу карточек: сделайте .product и .product__body flex-столбиками (flex-direction: column), .product__body растяните на всю оставшуюся высоту (flex: 1), а кнопке дайте margin-top: auto. Подвал .footer: flex, space-between, align-items: center, тёмный фон и светлый текст.',
      hints: [
        'Скопируйте article.product целиком четыре раза и поменяйте название, описание, цену и alt.',
        'Сетка: .catalog__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }',
        'Столбики: .product, .product__body { display: flex; flex-direction: column; } Тело карточки забирает всю высоту: .product__body { flex: 1; } А кнопка уезжает вниз: .product__btn { margin-top: auto; }',
        'Картинка во всю ширину: .product__img { display: block; width: 100%; height: auto; } Чтобы углы картинки тоже скруглились, у .product добавьте overflow: hidden.'
      ],
      html: `<section class="catalog" id="menu">
  <h2>Меню</h2>
  <div class="catalog__grid">
    <article class="product">
      <img class="product__img" src="img/art.svg" alt="Капучино в белой чашке">
      <div class="product__body">
        <h3>Капучино</h3>
        <p>Эспрессо и молочная пена. 300 мл.</p>
        <p class="product__price">160 ₽</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>
    <article class="product">
      <img class="product__img" src="img/art.svg" alt="Раф в высоком стакане">
      <div class="product__body">
        <h3>Раф ванильный</h3>
        <p>Эспрессо, сливки и ванильный сироп, взбитые вместе. Мягкий и сладкий — любимый напиток первокурсников. 300 мл.</p>
        <p class="product__price">210 ₽</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>
    <!-- Добавьте ещё четыре карточки: Американо 120 ₽, Какао 140 ₽, Чай с чабрецом 90 ₽, Сырник 110 ₽ -->
  </div>
</section>
<footer class="footer" id="contacts">
  <p>Кофейня «Зерно»</p>
  <p>ул. Студенческая, 5 · 8:00–20:00</p>
  <a href="tel:+79990001122">+7 999 000-11-22</a>
</footer>`,
      css: `${BASE}
${PALETTE}
.product__body {
  padding: 16px;
}
.product h3 {
  margin: 0 0 8px;
}
.product__price {
  font-weight: bold;
  color: var(--coffee);
}
.product__btn {
  padding: 10px 16px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шесть карточек: картинка с alt, h3, цена и кнопка', check: h => {
          const p = h.$$('.product');
          if (p.length !== 6) return `карточек: ${p.length}`;
          if (!p.every(e => e.querySelector('img[alt]')?.getAttribute('alt').trim() && e.querySelector('h3')?.textContent.trim() && e.querySelector('.product__price')?.textContent.trim() && e.querySelector('a.product__btn[href]'))) return 'в какой-то карточке не хватает img с alt, h3, цены или кнопки';
          const names = p.map(e => e.querySelector('h3').textContent).join(' ');
          return ['Американо', 'Какао', 'Чай', 'Сырник'].every(n => names.includes(n)) || 'нужны Американо, Какао, Чай с чабрецом и Сырник';
        } },
        { name: 'Сетка: три равные колонки, gap от 24px', check: h => {
          if (h.cs('.catalog__grid', 'display') !== 'grid') return 'у .catalog__grid нет display: grid';
          if (h.px('.catalog__grid', 'column-gap') < 24) return 'gap меньше 24px';
          const p = h.$$('.product').slice(0, 3), w = p.map(e => e.getBoundingClientRect().width);
          return (h.sameRow(p) && Math.max(...w) - Math.min(...w) < 2 && h.cs('.catalog__grid', 'grid-template-columns').split(' ').length === 3) || 'нужно ровно три равные колонки';
        } },
        { name: 'Карточка: скругление от 12px и тень', check: h => (radius(h, '.product') >= 12 && h.cs('.product', 'box-shadow') !== 'none') || 'нужны border-radius и box-shadow у .product' },
        { name: 'Картинка во всю ширину карточки', check: h => h.$$('.product').every(p => Math.abs(p.querySelector('.product__img').getBoundingClientRect().width - p.clientWidth) < 2) || 'картинка уже карточки' },
        { name: 'Кнопки в первом ряду на одной линии внизу карточек', check: h => {
          const b = h.$$('.product__btn').slice(0, 3).map(e => e.getBoundingClientRect().bottom);
          const c = h.$$('.product').slice(0, 3).map(e => e.getBoundingClientRect().bottom);
          if (Math.max(...b) - Math.min(...b) > 1) return 'кнопки на разной высоте';
          return b.every((x, i) => c[i] - x <= 40) || 'кнопки не внизу карточек';
        } },
        { name: 'Подвал: flex, края, по центру по высоте, тёмный фон', check: h => {
          if (!(h.cs('.footer', 'display') === 'flex' && h.cs('.footer', 'justify-content') === 'space-between' && h.cs('.footer', 'align-items') === 'center')) return 'у .footer нужны display: flex, justify-content: space-between, align-items: center';
          const m = h.cs('.footer', 'background-color').match(/\d+/g);
          return (m && (+m[0] + +m[1] + +m[2]) / 3 < 100 && h.cs('.footer', 'background-color') !== 'rgba(0, 0, 0, 0)') || 'фон подвала должен быть тёмным';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/k24.js ---- */
/* Занятие 24. Практическая работа №5 (ч. 2). Адаптивная вёрстка */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const stacked = els => els.every((x, i) => !i || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);
  const noMax = h => !h.rules.some(r => /max-width/.test(r.media));
  window.COURSE_TASKS.push(
    {
      id: 'k2401', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Шапка и первый экран на телефоне', level: 'Среднее', minutes: 30, points: 150,
      story: 'Лендинг «Зерна» открыли на телефоне: страница шире экрана, меню не помещается, заголовок огромный. Переделываем верх страницы по принципу mobile first.',
      goal: 'Базовые стили — для телефона, широкие экраны — в @media (min-width: 768px); медиазапросы с max-width не используйте. У .container вместо width: 960px — max-width: 1200px. На телефоне: шапка столбиком (логотип над меню), у .menu перенос flex-wrap: wrap, заголовок .hero h1 не больше 32px, кнопка .btn во всю ширину первого экрана (display: block, текст по центру). От 768px: шапка в строку (логотип слева, меню справа), h1 не меньше 44px, кнопка снова inline-block. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Начните с контейнера: width: 960px замените на max-width: 1200px. Прокрутка вбок пропадёт.',
        'Шапка на телефоне: .header { flex-direction: column; align-items: flex-start; gap: 12px; } а у .menu добавьте flex-wrap: wrap;',
        'Телефонные значения пишите в обычных правилах: font-size: 30px у h1, display: block; text-align: center; у .btn. Отступы у .hero тоже уменьшите: padding: 32px 20px.',
        'Всё компьютерное — в конце CSS: @media (min-width: 768px) { .header { flex-direction: row; justify-content: space-between; align-items: center; } .hero h1 { font-size: 48px; } .btn { display: inline-block; } }'
      ],
      html: `<div class="container">
  <header class="header">
    <a class="header__logo" href="#top">Зерно</a>
    <nav>
      <ul class="menu">
        <li><a href="#menu">Меню</a></li>
        <li><a href="#about">О нас</a></li>
        <li><a href="#sale">Акции</a></li>
        <li><a href="#jobs">Вакансии</a></li>
        <li><a href="#contacts">Контакты</a></li>
      </ul>
    </nav>
  </header>
  <section class="hero">
    <h1>Кофе, который ждёт вас между парами</h1>
    <p>Свежая обжарка, выпечка каждое утро и скидка по студенческому билету.</p>
    <a class="btn" href="#menu">Посмотреть меню</a>
  </section>
</div>`,
      css: `${BASE}
${PALETTE}
.container {
  width: 960px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 64px 48px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 48px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'У .container max-width: 1200px вместо фиксированной ширины', check: h => (h.cs('.container', 'max-width') === '1200px' && !/(^|[^-])width\s*:\s*960px/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, ''))) || 'замените width: 960px на max-width: 1200px' },
        { name: 'На телефоне логотип над меню, пункты меню переносятся', at: 360, check: h => {
          if (h.rect('.header nav').top < h.rect('.header__logo').bottom - 1) return 'меню стоит рядом с логотипом';
          return h.cs('.menu', 'flex-wrap') === 'wrap' || 'у .menu нет flex-wrap: wrap';
        } },
        { name: 'На компьютере логотип слева, меню справа в одну строку', check: h => {
          const l = h.rect('.header__logo'), n = h.rect('.header nav'), c = h.rect('.container');
          return (n.top < l.bottom && Math.abs(c.right - n.right) < 2 && Math.abs(l.left - c.left) < 2 && h.sameRow(h.$$('.menu li'))) || 'шапка на 1024px должна быть в строку, меню у правого края';
        } },
        { name: 'На телефоне заголовок не больше 32px', at: 360, check: h => h.px('.hero h1', 'font-size') <= 32 || `сейчас ${h.cs('.hero h1', 'font-size')}` },
        { name: 'На компьютере заголовок не меньше 44px', check: h => h.px('.hero h1', 'font-size') >= 44 || `сейчас ${h.cs('.hero h1', 'font-size')}` },
        { name: 'На телефоне кнопка во всю ширину, текст по центру', at: 360, check: h => {
          const hero = h.$('.hero'), inner = hero.clientWidth - h.px('.hero', 'padding-left') - h.px('.hero', 'padding-right');
          if (Math.abs(h.rect('.btn').width - inner) > 2) return 'на 360px кнопка не во всю ширину';
          return h.cs('.btn', 'text-align') === 'center' || 'текст кнопки не по центру';
        } },
        { name: 'Mobile first: @media (min-width: 768px) без max-width, на компьютере кнопка inline-block', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          if (!h.rules.some(r => /min-width:\s*768px/.test(r.media))) return 'нет @media (min-width: 768px)';
          return /inline-(block|flex)/.test(h.cs('.btn', 'display')) || 'на компьютере кнопка должна быть inline-block';
        } }
      ]
    },
    {
      id: 'k2402', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Преимущества и меню на трёх экранах', level: 'Сложное', minutes: 30, points: 200,
      story: 'Блоки преимуществ и меню на телефоне сжались в узкие полоски: три карточки в ряд на 360px читать невозможно. Делаем раскладку для телефона, планшета и компьютера.',
      goal: 'Mobile first, без max-width. Преимущества .features__list: на телефоне столбиком (flex-direction: column), от 768px — в ряд. Меню .catalog__grid: на телефоне одна колонка, от 768px — две (repeat(2, 1fr)), от 1280px — три (repeat(3, 1fr)). Медиазапрос на 768px идёт в CSS раньше, чем на 1280px. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Сначала телефон: у .features__list добавьте flex-direction: column; у .catalog__grid поставьте grid-template-columns: 1fr;',
        'Планшет: @media (min-width: 768px) { .features__list { flex-direction: row; } .catalog__grid { grid-template-columns: repeat(2, 1fr); } }',
        'Компьютер — отдельный медиазапрос ниже первого: @media (min-width: 1280px) { .catalog__grid { grid-template-columns: repeat(3, 1fr); } }',
        'Проверка смотрит на ширину 1024px — это планшетная раскладка, там должно быть две колонки меню.'
      ],
      html: `<section class="features">
  <h2>Почему к нам заходят между парами</h2>
  <ul class="features__list">
    <li class="feature"><h3>Быстро</h3><p>Заказ готов за 5 минут — успеете до звонка.</p></li>
    <li class="feature"><h3>Студенческие цены</h3><p>Скидка 15% по студенческому билету.</p></li>
    <li class="feature"><h3>Есть розетки</h3><p>У каждого стола можно зарядить ноутбук.</p></li>
  </ul>
</section>
<section class="catalog">
  <h2>Меню</h2>
  <div class="catalog__grid">
    <article class="product"><img src="img/art.svg" alt="Капучино в белой чашке"><h3>Капучино</h3><p>160 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Раф в высоком стакане"><h3>Раф ванильный</h3><p>210 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Американо в бумажном стакане"><h3>Американо</h3><p>120 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Какао с маршмеллоу"><h3>Какао</h3><p>140 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Чайник с травяным чаем"><h3>Чай с чабрецом</h3><p>90 ₽</p></article>
    <article class="product"><img src="img/art.svg" alt="Сырник со сметаной"><h3>Сырник</h3><p>110 ₽</p></article>
  </div>
</section>`,
      css: `${BASE}
${PALETTE}
.features__list {
  display: flex;
  gap: 24px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature h3 {
  margin-top: 0;
  color: var(--coffee);
}
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product img {
  display: block;
  width: 100%;
  height: auto;
}
.product h3,
.product p {
  margin: 12px 16px;
}`,
      tests: [
        { name: 'На телефоне преимущества столбиком', at: 360, check: h => stacked(h.$$('.feature')) || 'карточки преимуществ стоят в ряд' },
        { name: 'На компьютере преимущества в один ряд', check: h => h.sameRow(h.$$('.feature')) || 'карточки преимуществ не в ряд' },
        { name: 'На телефоне меню в одну колонку', at: 360, check: h => {
          const p = h.$$('.product'), w = h.rect('.catalog__grid').width;
          return (stacked(p) && p.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) || 'на 360px карточки не в одну колонку';
        } },
        { name: 'На ширине 1024px меню в две колонки', check: h => {
          const p = h.$$('.product');
          return (h.sameRow([p[0], p[1]]) && p[2].getBoundingClientRect().top > p[0].getBoundingClientRect().bottom - 1) || 'должно быть ровно две карточки в ряду';
        } },
        { name: 'От 1280px меню в три колонки: repeat(3, 1fr)', check: h => h.rules.some(r => /min-width:\s*1280px/.test(r.media) && /\.catalog__grid/.test(r.selector) && /repeat\(\s*3\s*,\s*1fr\s*\)/.test(r.style.getPropertyValue('grid-template-columns'))) || 'нет @media (min-width: 1280px) с тремя колонками' },
        { name: 'Медиазапрос 768px раньше, чем 1280px, без max-width', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          const a = h.rules.findIndex(r => /min-width:\s*768px/.test(r.media)), b = h.rules.findIndex(r => /min-width:\s*1280px/.test(r.media));
          return (a >= 0 && b > a) || 'нужны @media (min-width: 768px), а ниже — @media (min-width: 1280px)';
        } },
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k2403', lesson: 'mdk-24', module: 'mdk3', mech: 'adaptive', title: 'Картинка, длинная почта и подвал', level: 'Среднее', minutes: 20, points: 150,
      story: 'Последние блоки: «О нас» с большой фотографией и подвал с адресом почты, который не помещается в узкий экран. Убираем последние причины прокрутки вбок.',
      goal: 'Mobile first, без max-width. Картинку .about__img сделайте резиновой: max-width: 100% и height: auto вместо фиксированных размеров. Блок .about: на телефоне картинка над текстом, от 768px — две колонки 1fr 1fr рядом. Подвал .footer: на телефоне столбиком (flex-direction: column), от 768px — в строку, с краями (space-between). Длинной почте .footer__mail разрешите перенос внутри слова: overflow-wrap: anywhere. На телефоне нет горизонтальной прокрутки.',
      hints: [
        'Картинка: удалите width: 600px и height: 300px, напишите max-width: 100%; height: auto;',
        'У .about в базовых стилях уберите grid-template-columns, а колонки 1fr 1fr перенесите в @media (min-width: 768px).',
        'Подвал на телефоне: .footer { flex-direction: column; align-items: flex-start; } В медиазапросе: flex-direction: row; justify-content: space-between; align-items: center;',
        'Адрес почты — одно длинное «слово» без пробелов. .footer__mail { overflow-wrap: anywhere; } разрешает браузеру перенести его в любом месте.'
      ],
      html: `<section class="about" id="about">
  <img class="about__img" src="img/art.svg" width="600" height="300" alt="Зал кофейни вечером">
  <div class="about__text">
    <h2>О нас</h2>
    <p>«Зерно» открыли выпускники колледжа в 2022 году. Мы обжариваем кофе сами и печём выпечку каждое утро.</p>
  </div>
</section>
<footer class="footer" id="contacts">
  <p>Кофейня «Зерно»</p>
  <p>ул. Студенческая, 5 · 8:00–20:00</p>
  <a class="footer__mail" href="mailto:zakazy.kofeyni.zerno.kolledzh@example.ru">zakazy.kofeyni.zerno.kolledzh@example.ru</a>
</footer>`,
      css: `${BASE}
${PALETTE}
.about {
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 32px;
  align-items: center;
}
.about__img {
  display: block;
  width: 600px;
  height: 300px;
  border-radius: 12px;
}
.about__text h2 {
  color: var(--coffee);
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer a {
  color: var(--cream);
}`,
      tests: [
        { name: 'На телефоне нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'На телефоне картинка не шире блока и не сплющена', at: 360, check: h => {
          const i = h.rect('.about__img'), a = h.rect('.about');
          if (i.width > a.width + 1) return 'картинка шире блока';
          return Math.abs(i.width / i.height - 2) < 0.05 || 'пропорции нарушены: нужен height: auto';
        } },
        { name: 'На телефоне текст «О нас» под картинкой', at: 360, check: h => h.rect('.about__text').top >= h.rect('.about__img').bottom - 1 || 'текст стоит рядом с картинкой' },
        { name: 'На компьютере картинка и текст рядом, колонки равные', check: h => {
          const i = h.rect('.about__img'), t = h.rect('.about__text');
          return (t.left >= i.right - 1 && Math.abs(i.width - t.width) < 2) || 'нужны две колонки 1fr 1fr';
        } },
        { name: 'На телефоне подвал столбиком', at: 360, check: h => (h.cs('.footer', 'flex-direction') === 'column' && stacked([...h.$('.footer').children])) || 'элементы подвала не друг под другом' },
        { name: 'На компьютере подвал в строку с краями', check: h => (h.cs('.footer', 'flex-direction') === 'row' && h.cs('.footer', 'justify-content') === 'space-between') || 'нужны flex-direction: row и justify-content: space-between от 768px' },
        { name: 'Длинная почта переносится: overflow-wrap: anywhere', check: h => ['anywhere', 'break-word'].includes(h.cs('.footer__mail', 'overflow-wrap')) || 'нет overflow-wrap у .footer__mail' },
        { name: 'Mobile first: колонки и строка подвала в @media (min-width: 768px)', check: h => {
          if (!noMax(h)) return 'есть медиазапрос с max-width';
          if (h.rules.some(r => !r.media && r.selector === '.about' && r.style.getPropertyValue('grid-template-columns'))) return 'в базовых стилях .about остались колонки';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media) && r.selector === '.about') || 'нет колонок .about в @media (min-width: 768px)';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/k25.js ---- */
/* Занятие 25. CSS-фреймворки, LESS, шаблоны CMS, типовые решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  const PRIMARY = 'rgb(26, 86, 176)';
  window.COURSE_TASKS.push(
    {
      id: 'k2501', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Компилятор — это вы', level: 'Среднее', minutes: 20, points: 150,
      story: 'Коллега прислал стили карточки тарифа на LESS, но компилятора под рукой нет. Браузер LESS не понимает — переведите код в обычный CSS вручную.',
      goal: 'В комментарии в начале CSS — исходник на LESS. Напишите под ним обычный CSS, который получился бы после компиляции: подставьте значения переменных, разверните вложенность (&__title → .tariff__title, &:hover → .tariff__btn:hover), вставьте миксин .rounded() и посчитайте (@gap / 2). Нужны пять правил: .tariff, .tariff__title, .tariff__price, .tariff__btn, .tariff__btn:hover. Синтаксиса LESS (@переменных, вложенных правил) в CSS остаться не должно.',
      hints: [
        'Подставьте переменные: @primary — это #1a56b0, @primary-dark — #123d7d, @gap — 16px, @radius — 12px. Значит (@gap / 2) — 8px.',
        'Миксин .rounded() без параметра даёт border-radius: 12px (значение по умолчанию), а .rounded(8px) — border-radius: 8px.',
        'Каждое вложенное правило становится отдельным: .tariff { … } .tariff__title { … } и так далее. & заменяется родительским селектором целиком.',
        'Последнее правило: .tariff__btn:hover { background-color: #123d7d; }'
      ],
      html: `<article class="tariff">
  <h2 class="tariff__title">Тариф «Студент»</h2>
  <p>Безлимитный интернет в общежитии, скорость до 100 Мбит/с.</p>
  <p class="tariff__price">350 ₽ в месяц</p>
  <a class="tariff__btn" href="#connect">Подключить</a>
</article>`,
      css: `${BASE}
/* Исходник на LESS — перепишите его ниже обычным CSS.

@primary: #1a56b0;
@primary-dark: #123d7d;
@gap: 16px;
@radius: 12px;

.rounded(@r: @radius) {
  border-radius: @r;
}

.tariff {
  max-width: 320px;
  padding: @gap;
  border: 2px solid @primary;
  .rounded();

  &__title {
    margin: 0 0 8px;
    color: @primary;
  }
  &__price {
    font-size: 24px;
    font-weight: bold;
  }
  &__btn {
    display: inline-block;
    padding: (@gap / 2) @gap;
    background-color: @primary;
    color: #ffffff;
    text-decoration: none;
    .rounded(8px);

    &:hover {
      background-color: @primary-dark;
    }
  }
}
*/
`,
      tests: [
        { name: '.tariff: max-width 320px, padding 16px, рамка 2px #1a56b0, скругление 12px', check: h => {
          if (h.px('.tariff', 'max-width') !== 320) return 'max-width не 320px';
          if (h.px('.tariff', 'padding-top') !== 16 || h.px('.tariff', 'padding-left') !== 16) return 'padding не 16px';
          if (h.px('.tariff', 'border-top-width') !== 2 || h.cs('.tariff', 'border-top-style') !== 'solid' || h.cs('.tariff', 'border-top-color') !== PRIMARY) return 'рамка не 2px solid #1a56b0';
          return radius(h, '.tariff') === 12 || `скругление ${radius(h, '.tariff')}px`;
        } },
        { name: '.tariff__title: margin 0 0 8px, цвет #1a56b0', check: h => (h.px('.tariff__title', 'margin-top') === 0 && h.px('.tariff__title', 'margin-bottom') === 8 && h.cs('.tariff__title', 'color') === PRIMARY) || 'проверьте margin и color у заголовка' },
        { name: '.tariff__price: 24px, жирный', check: h => (h.px('.tariff__price', 'font-size') === 24 && +h.cs('.tariff__price', 'font-weight') >= 700) || 'нужны font-size: 24px и font-weight: bold' },
        { name: '.tariff__btn: inline-block, padding 8px 16px, фон #1a56b0, белый текст, скругление 8px, без подчёркивания', check: h => {
          if (h.cs('.tariff__btn', 'display') !== 'inline-block') return 'нет display: inline-block';
          if (h.px('.tariff__btn', 'padding-top') !== 8 || h.px('.tariff__btn', 'padding-left') !== 16) return `padding ${h.cs('.tariff__btn', 'padding')}`;
          if (h.cs('.tariff__btn', 'background-color') !== PRIMARY || h.cs('.tariff__btn', 'color') !== 'rgb(255, 255, 255)') return 'проверьте цвета кнопки';
          if (radius(h, '.tariff__btn') !== 8) return `скругление ${radius(h, '.tariff__btn')}px`;
          return /^none/.test(h.cs('.tariff__btn', 'text-decoration-line')) || 'у кнопки осталось подчёркивание';
        } },
        { name: 'Правило .tariff__btn:hover с фоном #123d7d', check: h => h.rules.some(r => r.selector.trim() === '.tariff__btn:hover' && r.style.getPropertyValue('background-color') === 'rgb(18, 61, 125)') || 'нет .tariff__btn:hover { background-color: #123d7d; }' },
        { name: 'В CSS не осталось синтаксиса LESS', check: h => {
          const css = h.css.replace(/\/\*[\s\S]*?\*\//g, '');
          if (/@(primary|gap|radius)/.test(css)) return 'остались переменные LESS';
          return !/&/.test(css) || 'остался знак & — разверните вложенность';
        } }
      ]
    },
    {
      id: 'k2502', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Сетка как в Bootstrap', level: 'Сложное', minutes: 20, points: 200,
      story: 'Страницу новостей колледжа сверстали на классах Bootstrap, но сам Bootstrap подключать не стали: он слишком тяжёлый ради одной сетки. Напишите CSS для этих классов сами.',
      goal: 'Напишите CSS для классов сетки. .container: max-width 1140px, по центру (margin: 0 auto). .row: grid из 12 равных колонок (repeat(12, 1fr)), gap 24px. .col-12 занимает все 12 колонок (grid-column: span 12) — так блоки стоят на телефоне. В @media (min-width: 768px): .col-md-6 занимает 6 колонок, .col-md-4 — 4. HTML не меняйте. Медиазапросы с max-width не используйте.',
      hints: [
        'Сетка: .row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }',
        'Элемент на несколько колонок — grid-column: span N. Для телефона: .col-12 { grid-column: span 12; }',
        'Размеры для широких экранов — в медиазапросе: @media (min-width: 768px) { .col-md-6 { grid-column: span 6; } .col-md-4 { grid-column: span 4; } }',
        'Почему медиазапрос перебивает .col-12? У блока оба класса, специфичность одинаковая, а правило в медиазапросе стоит ниже.'
      ],
      html: `<div class="container">
  <h1>Новости колледжа</h1>
  <div class="row">
    <article class="col-12 col-md-6 news news--main">
      <h2>День открытых дверей</h2>
      <p>В субботу в 11:00 покажем мастерские и расскажем о специальностях.</p>
    </article>
    <article class="col-12 col-md-6 news news--main">
      <h2>Чемпионат «Профессионалы»</h2>
      <p>Наши студенты прошли в финал по веб-технологиям.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Новые книги</h3>
      <p>В библиотеку пришли учебники по дизайну.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Спортзал</h3>
      <p>Открыта запись в секцию волейбола.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Столовая</h3>
      <p>Комплексный обед теперь стоит 250 ₽.</p>
    </article>
  </div>
</div>`,
      css: `${BASE}
.news {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.news h2,
.news h3 {
  margin-top: 0;
}
.news--main {
  background-color: #fff8e1;
}`,
      tests: [
        { name: '.container: max-width 1140px, по центру', check: h => (h.px('.container', 'max-width') === 1140 && h.cs('.container', 'margin-left') === h.cs('.container', 'margin-right')) || 'нужны max-width: 1140px и margin: 0 auto' },
        { name: '.row — grid из 12 колонок, gap 24px', check: h => (h.cs('.row', 'display') === 'grid' && h.cs('.row', 'grid-template-columns').split(' ').length === 12 && h.px('.row', 'column-gap') === 24) || 'нужны display: grid, repeat(12, 1fr) и gap: 24px' },
        { name: 'На телефоне каждая новость во всю ширину, друг под другом', at: 360, check: h => {
          const n = h.$$('.news'), w = h.rect('.row').width;
          if (!n.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) return 'новости не во всю ширину';
          return (n.every((x, i) => !i || x.getBoundingClientRect().top >= n[i - 1].getBoundingClientRect().bottom - 1) && !h.overflow()) || 'новости не друг под другом или есть прокрутка';
        } },
        { name: 'На компьютере две главные новости в ряд, по половине', check: h => {
          const m = h.$$('.col-md-6'), w = h.rect('.row').width;
          return (h.sameRow(m) && m.every(e => Math.abs(e.getBoundingClientRect().width - (w - 24) / 2) < 2)) || 'col-md-6 должны занимать по 6 колонок из 12';
        } },
        { name: 'На компьютере три короткие новости в ряд, по трети', check: h => {
          const m = h.$$('.col-md-4'), w = h.rect('.row').width;
          return (h.sameRow(m) && m.every(e => Math.abs(e.getBoundingClientRect().width - (w - 48) / 3) < 2)) || 'col-md-4 должны занимать по 4 колонки из 12';
        } },
        { name: 'Размеры md — в @media (min-width: 768px), без max-width', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'есть медиазапрос с max-width';
          return (h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.col-md-6/.test(r.selector)) && h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.col-md-4/.test(r.selector))) || 'нет .col-md-6 и .col-md-4 в @media (min-width: 768px)';
        } }
      ]
    },
    {
      id: 'k2503', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Типовое решение: модальное окно', level: 'Среднее', minutes: 20, points: 150,
      story: 'После записи на консультацию сайт должен показать окно «Вы записаны» поверх страницы. Разметка готова, нужно оформить окно по типовой схеме и сделать его понятным для экранного диктора.',
      goal: 'Затемнение .modal: position: fixed и inset: 0 (на всё окно), фон rgba с прозрачностью от 0.4 до 0.9, flex-центрирование, padding 16px. Окно .modal__dialog: белый фон, скругление не меньше 12px, max-width 400px, position: relative. Крестик .modal__close: position: absolute в правом верхнем углу окна (top и right не больше 16px). В HTML окну добавьте role="dialog", aria-modal="true" и aria-labelledby со ссылкой на id заголовка (у h2 уже есть id="modal-title"), крестику — aria-label="Закрыть". На телефоне окно не касается краёв экрана.',
      hints: [
        'Затемнение: .modal { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; padding: 16px; background-color: rgba(0, 0, 0, 0.6); }',
        'Окну: position: relative; max-width: 400px; padding: 24px; border-radius: 12px; background-color: #ffffff;',
        'Крестик: .modal__close { position: absolute; top: 8px; right: 8px; }',
        'Атрибуты пишутся в открывающем теге: <section class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">'
      ],
      html: `<main>
  <h1>Консультации по МДК.08.01</h1>
  <p>Выберите удобное время и нажмите «Записаться».</p>
</main>
<div class="modal">
  <section class="modal__dialog">
    <h2 id="modal-title">Вы записаны</h2>
    <p>Консультация в среду в 15:00, кабинет 214. Напоминание придёт на почту.</p>
    <button class="modal__close" type="button">×</button>
  </section>
</div>`,
      css: `${BASE}
.modal__dialog h2 {
  margin-top: 0;
}
.modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background-color: #eeeeee;
  color: #222222;
  font-size: 20px;
  cursor: pointer;
}`,
      tests: [
        { name: 'Затемнение на всё окно: position: fixed и inset: 0', check: h => {
          if (h.cs('.modal', 'position') !== 'fixed') return 'нет position: fixed';
          const r = h.rect('.modal');
          return (r.left === 0 && r.top === 0 && Math.abs(r.width - h.width) < 1 && Math.abs(r.height - h.height) < 1) || 'затемнение не закрывает всё окно';
        } },
        { name: 'Фон затемнения rgba, прозрачность от 0.4 до 0.9', check: h => { const m = h.cs('.modal', 'background-color').match(/rgba\([^)]*,\s*([\d.]+)\)/); return (m && +m[1] >= 0.4 && +m[1] <= 0.9) || 'нужен фон вроде rgba(0, 0, 0, 0.6)'; } },
        { name: 'Окно ровно в центре экрана', check: h => {
          const d = h.rect('.modal__dialog');
          return (Math.abs((d.left + d.right) / 2 - h.width / 2) < 2 && Math.abs((d.top + d.bottom) / 2 - h.height / 2) < 2) || 'окно не по центру';
        } },
        { name: 'Окно: белый фон, скругление от 12px, max-width 400px', check: h => (h.cs('.modal__dialog', 'background-color') === 'rgb(255, 255, 255)' && radius(h, '.modal__dialog') >= 12 && h.px('.modal__dialog', 'max-width') === 400) || 'проверьте фон, border-radius и max-width окна' },
        { name: 'Крестик в правом верхнем углу окна', check: h => {
          if (h.cs('.modal__dialog', 'position') !== 'relative' || h.cs('.modal__close', 'position') !== 'absolute') return 'нужны position: relative у окна и absolute у крестика';
          const d = h.rect('.modal__dialog'), c = h.rect('.modal__close');
          return (d.right - c.right >= 0 && d.right - c.right <= 16 && c.top - d.top >= 0 && c.top - d.top <= 16) || 'крестик не в правом верхнем углу';
        } },
        { name: 'Доступность: role="dialog", aria-modal, aria-labelledby, aria-label у крестика', check: h => {
          const d = h.$('.modal__dialog');
          if (d.getAttribute('role') !== 'dialog') return 'нет role="dialog"';
          if (d.getAttribute('aria-modal') !== 'true') return 'нет aria-modal="true"';
          if (d.getAttribute('aria-labelledby') !== 'modal-title') return 'aria-labelledby должен ссылаться на modal-title';
          return h.$('.modal__close').getAttribute('aria-label') === 'Закрыть' || 'у крестика нет aria-label="Закрыть"';
        } },
        { name: 'На телефоне окно не касается краёв экрана', at: 360, check: h => { const d = h.rect('.modal__dialog'); return (d.left >= 12 && d.right <= 348) || 'нужен padding у затемнения'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k26.js ---- */
/* Занятие 26. Размещение сайта на сервере и поддержка сайта */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2601', lesson: 'mdk-26', module: 'mdk3', mech: 'build', title: 'Страница 404', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Сайт кофейни «Зерно» готовят к публикации. Хостинг покажет файл 404.html, если человек ошибётся в адресе. Сейчас там пусто — посетитель увидит скучную ошибку и уйдёт.',
      goal: 'Внутри main с классом not-found сделайте страницу 404: абзац с классом code и текстом 404, заголовок h1 «Страница не найдена», абзац с объяснением (не меньше 20 знаков), ссылку на главную index.html с понятным текстом (не «сюда» и не «здесь») и навигацию nav со списком ul минимум из двух ссылок на разделы сайта.',
      hints: [
        'Начните с каркаса: <main class="not-found"> … </main>. Всё остальное — внутри.',
        'Число и заголовок: <p class="code">404</p> и <h1>Страница не найдена</h1>.',
        'Ссылка на главную: <p><a href="index.html">Перейти на главную</a></p>. Текст ссылки должен говорить, куда она ведёт.',
        'Популярные разделы: <nav aria-label="Разделы"><ul><li><a href="menu.html">Меню</a></li><li><a href="contacts.html">Контакты</a></li></ul></nav>.'
      ],
      html: `<!-- Страница 404 кофейни «Зерно».
     Всё содержимое — внутри main с классом not-found. -->
`,
      css: `${BASE}
.not-found { max-width: 560px; margin: 40px auto; text-align: center; }
.code { margin: 0; font-size: 72px; font-weight: 700; color: #8a3b12; }
.not-found ul { padding: 0; list-style: none; }
.not-found li { margin: 6px 0; }
.not-found a { color: #8a3b12; }`,
      tests: [
        { name: 'Есть main с классом not-found', check: h => h.count('main.not-found') === 1 || 'нет <main class="not-found">' },
        { name: 'Абзац с классом code и текстом 404', check: h => h.$('main.not-found p.code') && h.text('p.code') === '404' || 'нужен <p class="code">404</p> внутри main' },
        { name: 'Заголовок h1 «Страница не найдена»', check: h => h.count('h1') === 1 && /страница не найдена/i.test(h.text('h1')) || `h1: «${h.text('h1') || 'нет'}»` },
        { name: 'Есть абзац с объяснением (от 20 знаков)', check: h => h.$$('main.not-found p').some(p => !p.classList.contains('code') && !p.querySelector('a') && p.textContent.trim().length >= 20) || 'добавьте абзац, почему страница не нашлась' },
        { name: 'Ссылка на index.html с понятным текстом', check: h => {
          const a = h.$$('main.not-found a').find(x => /^(\.\/)?index\.html$|^\/$/.test(x.getAttribute('href') || ''));
          if (!a) return 'нет ссылки с href="index.html"';
          return !/^(сюда|здесь|тут|ссылка|жми|нажмите)$/i.test(a.textContent.trim()) && a.textContent.trim().length >= 5 || 'текст ссылки должен говорить, куда она ведёт';
        } },
        { name: 'nav со списком минимум из двух ссылок', check: h => h.$$('main.not-found nav ul li a[href]').length >= 2 || `ссылок в nav > ul: ${h.$$('main.not-found nav ul li a[href]').length}` },
        { name: 'Число 404 оформлено крупно (стили из шаблона сработали)', check: h => h.px('.code', 'font-size') >= 60 && h.cs('.code', 'color') === rgb('#8a3b12') || 'класс code не найден или стиль изменён' }
      ]
    },
    {
      id: 'k2602', lesson: 'mdk-26', module: 'mdk3', mech: 'build', title: 'Шапка документа для поисковиков', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Кофейню «Зерно» ищут в Яндексе, но в результатах поиска видно только «Документ» и случайный кусок текста. Пора заполнить head как следует.',
      goal: 'Допишите документ: у html атрибут lang="ru"; в head — meta charset="utf-8", meta viewport (width=device-width, initial-scale=1), title длиной 10–70 знаков со словом «Зерно» (не «Документ») и meta name="description" длиной 50–160 знаков. В body оставьте заголовок h1 и абзац.',
      hints: [
        'Сравните шаблон со схемой документа из второго занятия: чего не хватает в head?',
        'Язык страницы: <html lang="ru">. Кодировка: <meta charset="utf-8">.',
        'Окно для телефона: <meta name="viewport" content="width=device-width, initial-scale=1">.',
        'Описание: <meta name="description" content="Кофе и выпечка для студентов рядом с колледжем. Скидка 10% по студенческому, открыты с 8:00.">. Посчитайте знаки: нужно от 50 до 160.'
      ],
      html: `<!DOCTYPE html>
<html>
<head>
  <title>Документ</title>
</head>
<body>
  <h1>Кофейня «Зерно»</h1>
  <p>Кофе, выпечка и обеды в двух минутах от колледжа. Скидка 10% по студенческому билету.</p>
</body>
</html>`,
      css: `${BASE}
h1 { color: #8a3b12; }`,
      tests: [
        { name: 'У html есть lang="ru"', check: h => /<html[^>]*\blang="ru"/i.test(h.html) || 'добавьте <html lang="ru">' },
        { name: 'Есть meta charset="utf-8"', check: h => /<meta[^>]*\bcharset="utf-8"/i.test(h.html) || 'нет <meta charset="utf-8">' },
        { name: 'Есть meta viewport', check: h => /<meta[^>]*name="viewport"[^>]*content="[^"]*width=device-width[^"]*"|<meta[^>]*content="[^"]*width=device-width[^"]*"[^>]*name="viewport"/i.test(h.html) || 'нет meta viewport с width=device-width' },
        { name: 'title со словом «Зерно», 10–70 знаков', check: h => {
          const m = h.html.match(/<title>([\s\S]*?)<\/title>/i);
          if (!m) return 'нет title';
          const t = m[1].trim();
          if (!/зерн/i.test(t)) return 'в title нет слова «Зерно»';
          return t.length >= 10 && t.length <= 70 || `длина title: ${t.length}`;
        } },
        { name: 'meta description длиной 50–160 знаков', check: h => {
          const tag = (h.html.match(/<meta[^>]*>/gi) || []).find(x => /name="description"/i.test(x));
          if (!tag) return 'нет <meta name="description">';
          const c = (tag.match(/content="([^"]*)"/i) || [])[1];
          if (c == null) return 'у description нет content';
          return c.trim().length >= 50 && c.trim().length <= 160 || `длина описания: ${c.trim().length}`;
        } },
        { name: 'meta и title стоят внутри head', check: h => {
          const head = (h.html.match(/<head>([\s\S]*?)<\/head>/i) || [])[1] || '';
          return /<title>/i.test(head) && /name="description"/i.test(head) && /charset=/i.test(head) || 'всё для поисковиков пишется в head';
        } },
        { name: 'В body остались h1 и абзац', check: h => h.count('h1') === 1 && h.count('p') >= 1 || 'не удаляйте h1 и абзац' }
      ]
    },
    {
      id: 'k2603', lesson: 'mdk-26', module: 'mdk3', mech: 'fix', title: 'Пути перед публикацией', level: 'Среднее', minutes: 20, points: 150,
      story: 'Студент собрал сайт кофейни у себя на компьютере, загрузил на хостинг — и логотип с фотографией пропали, а меню ведёт в никуда. Хостинг уже переименовал файлы по правилам: index.html, menu.html, contacts.html, папка img с файлами icon.svg и art.svg.',
      goal: 'Исправьте все пути: логотип — img/icon.svg, фото зала — img/art.svg, ссылки меню — index.html, menu.html, contacts.html. Никаких C:\\, file://, обратных косых, пробелов и заглавных букв в путях. Ссылку на карту переведите на https://. Обе картинки должны реально загрузиться.',
      hints: [
        'Найдите в коде все атрибуты src и href — их здесь семь.',
        'Путь к диску C:\\Users\\… на сервере не существует. Оставьте только часть от папки сайта: img/icon.svg.',
        'Сервер различает регистр: IMG/Art.svg и img/art.svg — разные файлы. Пишите маленькими буквами.',
        'Ссылки: href="index.html", href="menu.html", href="contacts.html"; карта — https://yandex.ru/maps.'
      ],
      html: `<header class="site-header">
  <img src="C:\\Users\\Student\\Desktop\\Зерно\\img\\icon.svg" alt="Кофейня «Зерно»" width="48" height="48">
  <nav aria-label="Главное меню">
    <ul class="menu">
      <li><a href="file:///C:/Users/Student/Desktop/Зерно/Index.html">Главная</a></li>
      <li><a href="Menu Page.html">Меню</a></li>
      <li><a href="Contacts.HTML">Контакты</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Кофейня «Зерно»</h1>
  <img class="photo" src="IMG/Art.svg" alt="Зал кофейни вечером" width="600" height="300">
  <p>Мы в двух минутах от колледжа. <a href="http://yandex.ru/maps">Посмотреть на карте</a></p>
</main>`,
      css: `${BASE}
.site-header { display: flex; align-items: center; gap: 16px; }
.menu { display: flex; gap: 16px; margin: 0; padding: 0; list-style: none; }
.menu a { color: #8a3b12; }
.photo { max-width: 100%; height: auto; }`,
      tests: [
        { name: 'Логотип: src="img/icon.svg" и картинка загрузилась', check: h => { const i = h.$('.site-header img'); return !!i && i.getAttribute('src') === 'img/icon.svg' && i.naturalWidth > 0 || `сейчас: ${i ? i.getAttribute('src') : 'нет картинки'}`; } },
        { name: 'Фото зала: src="img/art.svg" и картинка загрузилась', check: h => { const i = h.$('main img'); return !!i && i.getAttribute('src') === 'img/art.svg' && i.naturalWidth > 0 || `сейчас: ${i ? i.getAttribute('src') : 'нет картинки'}`; } },
        { name: 'Меню ведёт на index.html, menu.html, contacts.html', check: h => { const s = h.$$('.menu a').map(a => a.getAttribute('href')).join(' '); return s === 'index.html menu.html contacts.html' || `сейчас: ${s}`; } },
        { name: 'Ссылка на карту по https://', check: h => /^https:\/\//.test(h.$('main p a')?.getAttribute('href') || '') || 'нужен https://' },
        { name: 'Ни одного пути к диску, обратной косой, пробела или заглавной буквы', check: h => {
          const bad = h.$$('[src],[href]').map(e => e.getAttribute('src') || e.getAttribute('href')).find(p => /^https?:\/\//.test(p) ? /\s/.test(p) : /file:|^[a-z]:|\\|\s/i.test(p) || /[A-ZА-ЯЁ]/.test(p));
          return !bad || `плохой путь: ${bad}`;
        } },
        { name: 'Подписи картинок (alt) не потерялись', check: h => h.$$('img').length === 2 && h.$$('img').every(i => i.alt.trim().length > 3) || 'у обеих картинок должен остаться alt' }
      ]
    }
  );
})();
/* ---- content/tasks/k27.js ---- */
/* Занятие 27. Язык сценариев JavaScript: основы */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PAGE_CSS = `${BASE}
h1 { color: #8a3b12; }
code { background: #f3ece4; padding: 2px 4px; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k2701', lesson: 'mdk-27', module: 'mdk3', mech: 'build', title: 'Чек в кафе', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'В кафе у колледжа сломалась касса. Бариста просит маленький скрипт: сколько стоят несколько наборов «кофе + булочка».',
      goal: 'Во вкладке script.js создайте константы coffeePrice = 150 и bunPrice = 60 (через const), переменную count = 2 (через let) и переменную total, которая считается по формуле (coffeePrice + bunPrice) * count — не пишите 420 руками. Выведите в консоль строку «Итого: 420 руб.» с помощью console.log, подставив total.',
      hints: [
        'Константа создаётся так: const coffeePrice = 150; Так же — bunPrice.',
        'Количество может меняться, поэтому let count = 2;',
        'Сумма: const total = (coffeePrice + bunPrice) * count; Скобки нужны, иначе умножится только булочка.',
        'Вывод: console.log(\'Итого: \' + total + \' руб.\'); или console.log(`Итого: ${total} руб.`);'
      ],
      html: `<h1>Чек в кафе</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Чек в кафе
// 1. Константы coffeePrice (150) и bunPrice (60)

// 2. Переменная count (2) — сколько наборов

// 3. total = (coffeePrice + bunPrice) * count

// 4. console.log: «Итого: 420 руб.»
`,
      tests: [
        { name: 'coffeePrice и bunPrice объявлены через const', check: h => /const\s+coffeePrice\s*=/.test(h.js) && /const\s+bunPrice\s*=/.test(h.js) || 'нужно const coffeePrice = … и const bunPrice = …' },
        { name: 'count объявлена через let', check: h => /let\s+count\s*=/.test(h.js) || 'нужно let count = 2;' },
        { name: 'coffeePrice = 150, bunPrice = 60, count = 2', js: true, check: h => h.get('coffeePrice') === 150 && h.get('bunPrice') === 60 && h.get('count') === 2 || `сейчас: ${h.get('coffeePrice')}, ${h.get('bunPrice')}, ${h.get('count')}` },
        { name: 'total считается формулой и равен 420', js: true, check: h => h.get('total') === 420 || `total = ${h.get('total')}` },
        { name: 'В формуле total есть coffeePrice, bunPrice и count', check: h => /total\s*=[^;\n]*coffeePrice[^;\n]*bunPrice[^;\n]*count|total\s*=[^;\n]*count[^;\n]*coffeePrice[^;\n]*bunPrice/.test(h.js) || 'посчитайте total из переменных, а не числом' },
        { name: 'В консоли «Итого: 420 руб.»', js: true, check: h => h.logs.some(l => /Итого:\s*420\s*руб\./.test(l)) || (h.logs.length ? `в консоли: ${h.logs[0]}` : 'в консоль ничего не выведено') },
        { name: 'Скрипт работает без ошибок', js: true, check: h => !h.errors.length || h.errors[0] }
      ]
    },
    {
      id: 'k2702', lesson: 'mdk-27', module: 'mdk3', mech: 'fix', title: 'Почините скрипт старосты', level: 'Лёгкое', minutes: 15, points: 120,
      story: 'Староста пишет скрипт для журнала: сколько человек пришло на пару и состоится ли она. Красных ошибок в консоли нет, но скрипт врёт: гостей считает странно, группу не называет, а итог пары вообще не печатает. Таких ошибок называют логическими — их ищут, выводя значения в консоль.',
      goal: 'Найдите и исправьте пять ошибок. Должно получиться: students — число 25 (не строка), present = 22, withGuests = 27, в консоли по порядку «Группа ИСП-11», «Пришло: 22 человек» и «Пара состоится». В условии сравнивайте через ===, функцию checkLesson вызовите после её объявления. Ошибок в консоли быть не должно.',
      hints: [
        'Почему withGuests получается «252»? Потому что \'25\' в кавычках — строка, и + склеивает. Уберите кавычки у числа.',
        'Сравните \'group\' и group: в кавычках — просто текст из пяти букв, без кавычек — значение переменной.',
        'В строке «Пришло: …» подставлена не та переменная. Пришедших хранит present.',
        'if (present = 0) не сравнивает, а кладёт в present ноль: нужно ===. И функция сама не запустится — допишите вызов checkLesson(); в конце.'
      ],
      html: `<h1>Журнал группы</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Скрипт считает, сколько студентов пришло на пару.
// В нём пять логических ошибок: консоль молчит, но результат неверный.
const group = 'ИСП-11';
let students = '25';
let absent = 3;
let present = students - absent;
let withGuests = students + 2;

console.log('Группа ' + 'group');
console.log('Пришло: ' + absent + ' человек');

function checkLesson() {
  if (present = 0) {
    console.log('Пара отменяется');
  } else {
    console.log('Пара состоится');
  }
}
`,
      tests: [
        { name: 'Скрипт выполняется без ошибок', js: true, check: h => !h.errors.length || h.errors[0] },
        { name: 'students — число 25', js: true, check: h => h.get('students') === 25 || `сейчас: ${JSON.stringify(h.get('students'))} (${typeof h.get('students')})` },
        { name: 'present = 22, withGuests = 27', js: true, check: h => h.get('present') === 22 && h.get('withGuests') === 27 || `present = ${JSON.stringify(h.get('present'))}, withGuests = ${JSON.stringify(h.get('withGuests'))}` },
        { name: 'В консоли «Группа ИСП-11», «Пришло: 22 человек», «Пара состоится»', js: true, check: h => h.logs.join('|') === 'Группа ИСП-11|Пришло: 22 человек|Пара состоится' || `в консоли: ${h.logs.join(' / ') || 'пусто'}` },
        { name: 'В условии сравнение через ===', check: h => /if\s*\(\s*present\s*===\s*0\s*\)|if\s*\(\s*0\s*===\s*present\s*\)/.test(h.js) || 'нужно if (present === 0)' },
        { name: 'Функция checkLesson вызвана', check: h => /^\s*checkLesson\(\s*\)\s*;?/m.test(h.js) || 'добавьте вызов checkLesson();' }
      ]
    },
    {
      id: 'k2703', lesson: 'mdk-27', module: 'mdk3', mech: 'build', title: 'Оценки за тест', level: 'Среднее', minutes: 25, points: 150,
      story: 'Преподаватель проверил тест и записал баллы. Переводить каждый балл в оценку вручную долго — пусть посчитает скрипт.',
      goal: 'Напишите функцию getGrade(score), которая возвращает число: 90 и больше → 5, от 75 до 89 → 4, от 60 до 74 → 3, меньше 60 → 2. Пройдите по массиву scores циклом for…of и для каждого результата выведите в консоль строку вида «78 баллов — оценка 4». Посчитайте средний балл в переменной average (сумма, делённая на scores.length) и выведите «Средний балл: …».',
      hints: [
        'Каркас функции: function getGrade(score) { … } Внутри — if / else if / else, в каждой ветке return с оценкой.',
        'Начните с самой высокой оценки: if (score >= 90) { return 5; } else if (score >= 75) { return 4; } …',
        'Цикл: for (const score of scores) { console.log(score + \' баллов — оценка \' + getGrade(score)); }',
        'Сумма: let sum = 0; и в цикле sum = sum + score; После цикла: const average = sum / scores.length;'
      ],
      html: `<h1>Оценки за тест</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Баллы за тест (из 100)
const scores = [95, 78, 61, 40, 88];

// 1. Функция getGrade(score) возвращает оценку 2, 3, 4 или 5

// 2. Цикл for…of по scores: «78 баллов — оценка 4»

// 3. Средний балл average и вывод «Средний балл: …»
`,
      tests: [
        { name: 'getGrade — функция', js: true, check: h => typeof h.get('getGrade') === 'function' || 'нет функции getGrade' },
        { name: 'getGrade правильно ставит 5 и 4 (100, 90, 89, 75)', js: true, check: h => { const g = h.get('getGrade'); if (typeof g !== 'function') return 'нет функции getGrade'; const r = [100, 90, 89, 75].map(g); return r.join() === '5,5,4,4' || `получилось: ${r.join(', ')}`; } },
        { name: 'getGrade правильно ставит 3 и 2 (74, 60, 59, 0)', js: true, check: h => { const g = h.get('getGrade'); if (typeof g !== 'function') return 'нет функции getGrade'; const r = [74, 60, 59, 0].map(g); return r.join() === '3,3,2,2' || `получилось: ${r.join(', ')}`; } },
        { name: 'Используется цикл for…of по scores', check: h => /for\s*\(\s*(const|let)\s+\w+\s+of\s+scores\s*\)/.test(h.js) || 'нужен for (const score of scores)' },
        { name: 'Для каждого результата строка «… баллов — оценка …»', js: true, check: h => {
          const want = ['95 баллов — оценка 5', '78 баллов — оценка 4', '61 баллов — оценка 3', '40 баллов — оценка 2', '88 баллов — оценка 4'];
          const got = h.logs.filter(l => /оценка/.test(l));
          return want.every(w => got.some(l => l.replace(/\s+/g, ' ').trim() === w)) || `в консоли: ${got.slice(0, 2).join(' / ') || 'нет строк с оценками'}`;
        } },
        { name: 'average = 72.4 и выведен «Средний балл»', js: true, check: h => h.get('average') === 72.4 && h.logs.some(l => /Средний балл:\s*72\.4/.test(l)) || `average = ${h.get('average')}` },
        { name: 'Скрипт работает без ошибок', js: true, check: h => !h.errors.length || h.errors[0] }
      ]
    }
  );
})();
/* ---- content/tasks/k28.js ---- */
/* Занятие 28. JavaScript и страница: DOM и события */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2801', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Счётчик стаканов воды', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Спортзал колледжа просит простую страницу-напоминалку: сколько стаканов воды выпито за день. Разметка и стили готовы, кнопки пока не работают.',
      goal: 'В script.js сделайте так: кнопка #plus увеличивает число в span#count на 1, кнопка #reset возвращает 0. Когда число дошло до 8, покажите абзац #done (уберите hidden). После сброса абзац #done снова скрыт.',
      hints: [
        'Найдите элементы: const plus = document.querySelector(\'#plus\'); так же reset, countEl (для #count) и done. И заведите let count = 0;',
        'Обработчик: plus.addEventListener(\'click\', function () { count = count + 1; countEl.textContent = count; });',
        'Показать абзац, когда набрали 8: if (count >= 8) { done.hidden = false; }',
        'В обработчике #reset: count = 0; обновите текст и спрячьте абзац: done.hidden = true;'
      ],
      html: `<section class="water">
  <h1>Вода за день</h1>
  <p class="counter">Выпито стаканов: <span id="count">0</span> из 8</p>
  <div class="buttons">
    <button id="plus" type="button">+1 стакан</button>
    <button id="reset" type="button">Сбросить</button>
  </div>
  <p id="done" class="done" hidden>Норма на день выполнена!</p>
</section>`,
      css: `${BASE}
.water { max-width: 420px; margin: 0 auto; text-align: center; }
.counter { font-size: 20px; }
#count { font-size: 40px; font-weight: 700; color: #0b5c8a; }
.buttons { display: flex; justify-content: center; gap: 12px; }
button { padding: 10px 16px; border: 2px solid #0b5c8a; border-radius: 8px; background: #ffffff; color: #0b5c8a; font: inherit; cursor: pointer; }
button:hover { background: #e6f2f9; }
.done { color: #1e6b34; font-weight: 700; }`,
      js: `// Счётчик стаканов воды
// 1. Найдите кнопки #plus и #reset, span #count и абзац #done

// 2. Переменная для счётчика

// 3. Щелчок по #plus: +1, показать число, при 8 и больше — показать #done

// 4. Щелчок по #reset: 0, показать число, спрятать #done
`,
      tests: [
        { name: 'Три щелчка по «+1 стакан» — на странице 3', js: true, check: h => { h.click('#plus'); h.click('#plus'); h.click('#plus'); return h.text('#count') === '3' || `сейчас: ${h.text('#count')}`; } },
        { name: '«Сбросить» возвращает 0', js: true, check: h => { h.click('#plus'); h.click('#plus'); h.click('#reset'); return h.text('#count') === '0' || `после сброса: ${h.text('#count')}`; } },
        { name: 'До 8 стаканов абзац #done скрыт, на 8-м — появляется', js: true, check: h => {
          for (let i = 0; i < 7; i++) h.click('#plus');
          if (h.visible('#done')) return 'абзац виден уже после 7 стаканов';
          h.click('#plus');
          return h.visible('#done') || 'после 8 стаканов абзац не появился';
        } },
        { name: 'После сброса #done снова скрыт', js: true, check: h => { for (let i = 0; i < 8; i++) h.click('#plus'); h.click('#reset'); return !h.visible('#done') || 'абзац остался на экране'; } },
        { name: 'Кнопки подключены через addEventListener', check: h => /addEventListener\(\s*['"]click['"]/.test(h.js) || 'нужен addEventListener(\'click\', …)' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#plus'); h.click('#reset'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2802', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Выбор объёма напитка', level: 'Среднее', minutes: 20, points: 150,
      story: 'В онлайн-заказе кофейни можно выбрать объём стакана. Выбранная кнопка закрашивается — за это отвечает класс selected в CSS. Осталось научить кнопки переключаться.',
      goal: 'При щелчке по любой кнопке .size класс selected должен остаться только у неё (у остальных — убраться), а в абзаце #choice появиться текст «Вы выбрали: » и надпись с этой кнопки, например «Вы выбрали: 0,25 л». Используйте querySelectorAll, цикл for…of и classList.',
      hints: [
        'Все кнопки сразу: const sizes = document.querySelectorAll(\'.size\'); и абзац const choice = document.querySelector(\'#choice\');',
        'Каждой кнопке — свой обработчик: for (const size of sizes) { size.addEventListener(\'click\', function () { … }); }',
        'Внутри обработчика сначала уберите класс у всех: for (const other of sizes) { other.classList.remove(\'selected\'); }',
        'Потом добавьте нажатой: size.classList.add(\'selected\'); и текст: choice.textContent = \'Вы выбрали: \' + size.textContent;'
      ],
      html: `<section class="order">
  <h1>Какой объём?</h1>
  <div class="sizes">
    <button class="size" type="button">0,25 л</button>
    <button class="size selected" type="button">0,4 л</button>
    <button class="size" type="button">0,5 л</button>
  </div>
  <p id="choice">Вы выбрали: 0,4 л</p>
</section>`,
      css: `${BASE}
.order { max-width: 420px; }
.sizes { display: flex; gap: 8px; }
.size { flex: 1; padding: 12px; border: 2px solid #8a3b12; border-radius: 8px; background: #ffffff; color: #8a3b12; font: inherit; cursor: pointer; }
.size:hover { background: #fff4e8; }
.size.selected { background: #8a3b12; color: #ffffff; }
#choice { font-weight: 700; }`,
      js: `// Выбор объёма
// 1. Найдите все кнопки .size и абзац #choice

// 2. Каждой кнопке — обработчик щелчка:
//    убрать selected у всех, добавить нажатой, обновить текст в #choice
`,
      tests: [
        { name: 'Щелчок по «0,25 л» — selected только у неё', js: true, check: h => { h.click(h.$$('.size')[0]); const s = h.$$('.size').map(b => b.classList.contains('selected')); return s.join() === 'true,false,false' || `selected: ${s.join(', ')}`; } },
        { name: 'Текст: «Вы выбрали: 0,25 л»', js: true, check: h => { h.click(h.$$('.size')[0]); return h.text('#choice') === 'Вы выбрали: 0,25 л' || `сейчас: «${h.text('#choice')}»`; } },
        { name: 'Потом щелчок по «0,5 л» — выбор переходит к ней', js: true, check: h => {
          h.click(h.$$('.size')[0]); h.click(h.$$('.size')[2]);
          const s = h.$$('.size').map(b => b.classList.contains('selected'));
          return s.join() === 'false,false,true' && h.text('#choice') === 'Вы выбрали: 0,5 л' || `selected: ${s.join(', ')}; текст: «${h.text('#choice')}»`;
        } },
        { name: 'Повторный щелчок не снимает выбор', js: true, check: h => { h.click(h.$$('.size')[1]); h.click(h.$$('.size')[1]); return h.$$('.size')[1].classList.contains('selected') || 'после второго щелчка класс пропал: нужен add, а не toggle'; } },
        { name: 'Используются querySelectorAll, for…of и classList', check: h => /querySelectorAll\(/.test(h.js) && /for\s*\(\s*(const|let)\s+\w+\s+of\s+/.test(h.js) && /classList\.(add|remove)/.test(h.js) || 'нужны querySelectorAll, for (… of …) и classList' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click(h.$$('.size')[0]); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2803', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Запись на тренировку', level: 'Среднее', minutes: 25, points: 150,
      story: 'Спортзал колледжа записывает на пробную тренировку через форму. Хочется, чтобы страница здоровалась с человеком, пока он вводит имя, и не перезагружалась при отправке.',
      goal: 'Пока человек вводит имя в поле #name, абзац #hello показывает «Здравствуйте, Имя!» (событие input). При отправке формы #signup отмените перезагрузку (preventDefault). Если имя пустое или из одних пробелов — в абзац #message напишите «Введите имя». Иначе — «Спасибо, Имя! Ждём вас на тренировке.» (имя без пробелов по краям).',
      hints: [
        'Найдите форму, поле и два абзаца: const form = document.querySelector(\'#signup\'); const nameInput = document.querySelector(\'#name\'); так же hello и message.',
        'Приветствие: nameInput.addEventListener(\'input\', function () { hello.textContent = \'Здравствуйте, \' + nameInput.value + \'!\'; });',
        'Отправка: form.addEventListener(\'submit\', function (event) { event.preventDefault(); … });',
        'Внутри: const value = nameInput.value.trim(); if (value === \'\') { message.textContent = \'Введите имя\'; } else { message.textContent = \'Спасибо, \' + value + \'! Ждём вас на тренировке.\'; }'
      ],
      html: `<form id="signup" class="signup">
  <h1>Пробная тренировка</h1>
  <label for="name">Ваше имя</label>
  <input id="name" name="name" type="text" autocomplete="given-name">
  <p id="hello" class="hello">Здравствуйте!</p>
  <button type="submit">Записаться</button>
</form>
<p id="message" class="message" role="status"></p>`,
      css: `${BASE}
.signup { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
label { font-weight: 700; }
input { padding: 10px; border: 1px solid #767676; border-radius: 6px; font: inherit; }
.hello { margin: 0; color: #555555; }
button { padding: 12px; border: 0; border-radius: 6px; background: #1e6b34; color: #ffffff; font: inherit; cursor: pointer; }
button:hover { background: #154d25; }
.message { font-weight: 700; }`,
      js: `// Запись на тренировку
// 1. Найдите форму #signup, поле #name, абзацы #hello и #message

// 2. Событие input у поля: «Здравствуйте, Имя!»

// 3. Событие submit у формы: preventDefault и проверка имени
`,
      tests: [
        { name: 'При вводе «Анна» — «Здравствуйте, Анна!»', js: true, check: h => { h.type('#name', 'Анна'); return h.text('#hello') === 'Здравствуйте, Анна!' || `сейчас: «${h.text('#hello')}»`; } },
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: h => { h.type('#name', 'Анна'); return h.submit('#signup') === false || 'вызовите event.preventDefault() в обработчике submit'; } },
        { name: 'Пустое имя — «Введите имя»', js: true, check: h => { h.type('#name', ''); h.submit('#signup'); return h.text('#message') === 'Введите имя' || `сейчас: «${h.text('#message')}»`; } },
        { name: 'Имя из одних пробелов — тоже «Введите имя»', js: true, check: h => { h.type('#name', '   '); h.submit('#signup'); return h.text('#message') === 'Введите имя' || `сейчас: «${h.text('#message')}» — используйте trim()`; } },
        { name: '« Олег » — «Спасибо, Олег! Ждём вас на тренировке.»', js: true, check: h => { h.type('#name', ' Олег '); h.submit('#signup'); return h.text('#message') === 'Спасибо, Олег! Ждём вас на тренировке.' || `сейчас: «${h.text('#message')}»`; } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.type('#name', 'Анна'); h.submit('#signup'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k29.js ---- */
/* Занятие 29. Практическая работа №6 (ч. 1). Интерактивные элементы на JavaScript */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2901', lesson: 'mdk-29', module: 'mdk3', mech: 'adaptive', title: 'Меню-бургер', level: 'Среднее', minutes: 25, points: 150,
      story: 'Сайт кофейни «Зерно» на телефоне: меню из трёх ссылок не помещается в шапку. Нужна кнопка «Меню», которая открывает и закрывает список, а на компьютере меню просто стоит в строку.',
      goal: 'CSS: допишите медиазапрос @media (min-width: 768px), в котором кнопка .burger скрыта (display: none), а меню .menu — в строку (display: flex), даже с атрибутом hidden. JS: щелчок по #burger переключает hidden у #menu; когда меню открыто, у кнопки aria-expanded="true" и надпись «Закрыть», когда закрыто — aria-expanded="false" и «Меню». На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        'Медиазапрос в конце CSS: @media (min-width: 768px) { .burger { display: none; } nav { flex-basis: auto; } .menu, .menu[hidden] { display: flex; gap: 24px; } }',
        'Скрипт: найдите кнопку и меню — const burger = document.querySelector(\'#burger\'); const menu = document.querySelector(\'#menu\');',
        'В обработчике щелчка сначала переключите: menu.hidden = !menu.hidden;',
        'Потом: if (menu.hidden) { burger.setAttribute(\'aria-expanded\', \'false\'); burger.textContent = \'Меню\'; } else { … \'true\' … \'Закрыть\' }'
      ],
      html: `<header class="site-header">
  <a class="logo" href="#top">Зерно</a>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu">Меню</button>
  <nav aria-label="Главное меню">
    <ul class="menu" id="menu" hidden>
      <li><a href="#coffee">Кофе</a></li>
      <li><a href="#food">Выпечка</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<main id="top">
  <h1>Кофейня «Зерно»</h1>
  <section id="coffee">
    <h2>Кофе</h2>
    <p>Эспрессо, капучино и раф на овсяном молоке.</p>
  </section>
  <section id="food">
    <h2>Выпечка</h2>
    <p>Круассаны и сырники каждое утро с 8:00.</p>
  </section>
  <section id="contacts">
    <h2>Контакты</h2>
    <p>Улица Студенческая, 5, напротив главного корпуса.</p>
  </section>
</main>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }
.site-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 16px; background: #2a2238; }
.logo { color: #f2d58a; font-size: 20px; font-weight: 700; text-decoration: none; }
.burger { padding: 8px 14px; border: 2px solid #f2d58a; border-radius: 6px; background: #2a2238; color: #f2d58a; font: inherit; cursor: pointer; }
nav { flex-basis: 100%; }
.menu { margin: 0; padding: 0; list-style: none; }
.menu a { display: block; padding: 10px 0; color: #ffffff; }
main { padding: 0 16px; }
/* Ниже — медиазапрос для экранов от 768px */
`,
      js: `// Меню-бургер
// 1. Найдите кнопку #burger и список #menu

// 2. Щелчок по кнопке: переключить hidden у меню,
//    обновить aria-expanded и надпись кнопки
`,
      tests: [
        { name: 'Телефон: при загрузке меню закрыто, aria-expanded="false"', at: 360, js: true, check: h => !h.visible('#menu') && h.$('#burger').getAttribute('aria-expanded') === 'false' || 'меню должно быть закрыто при загрузке' },
        { name: 'Телефон: щелчок по «Меню» открывает меню, aria-expanded="true", надпись «Закрыть»', at: 360, js: true, check: h => {
          h.click('#burger');
          if (!h.visible('#menu')) return 'меню не открылось';
          if (h.$('#burger').getAttribute('aria-expanded') !== 'true') return 'aria-expanded не стал "true"';
          return h.text('#burger') === 'Закрыть' || `надпись кнопки: «${h.text('#burger')}»`;
        } },
        { name: 'Телефон: второй щелчок закрывает меню и возвращает «Меню»', at: 360, js: true, check: h => {
          h.click('#burger'); h.click('#burger');
          return !h.visible('#menu') && h.$('#burger').getAttribute('aria-expanded') === 'false' && h.text('#burger') === 'Меню' || 'после второго щелчка меню должно закрыться, aria-expanded="false", надпись «Меню»';
        } },
        { name: 'Телефон: кнопка «Меню» видна', at: 360, check: h => h.cs('.burger', 'display') !== 'none' || 'на телефоне кнопка должна быть видна' },
        { name: 'Компьютер: кнопка скрыта, меню видно в строку', check: h => {
          if (h.cs('.burger', 'display') !== 'none') return 'на 1024px кнопку нужно скрыть';
          if (h.cs('#menu', 'display') !== 'flex') return `у меню display: ${h.cs('#menu', 'display')}, нужно flex`;
          return h.sameRow(h.$$('.menu li')) || 'пункты меню не в одну строку';
        } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'Скрипт работает без ошибок', at: 360, js: true, check: h => { h.click('#burger'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2902', lesson: 'mdk-29', module: 'mdk3', mech: 'build', title: 'Вкладки с расписанием', level: 'Среднее', minutes: 25, points: 150,
      story: 'На странице спортзала колледжа расписание секций на три дня. Целиком оно длинное, поэтому дни сделали вкладками. Вёрстка готова, но вкладки не переключаются.',
      goal: 'При щелчке по вкладке .tab: у всех вкладок убрать класс active и поставить aria-selected="false", все панели .panel спрятать (hidden); нажатой вкладке добавить active и aria-selected="true" и показать её панель — ту, чей id записан в aria-controls вкладки.',
      hints: [
        'Найдите все вкладки и все панели: const tabs = document.querySelectorAll(\'.tab\'); const panels = document.querySelectorAll(\'.panel\');',
        'Обработчик каждой вкладке: for (const tab of tabs) { tab.addEventListener(\'click\', function () { … }); }',
        'Внутри сначала выключите всё: for (const t of tabs) { t.classList.remove(\'active\'); t.setAttribute(\'aria-selected\', \'false\'); } и for (const p of panels) { p.hidden = true; }',
        'Потом включите одну: tab.classList.add(\'active\'); tab.setAttribute(\'aria-selected\', \'true\'); document.querySelector(\'#\' + tab.getAttribute(\'aria-controls\')).hidden = false;'
      ],
      html: `<section class="schedule">
  <h1>Расписание секций</h1>
  <div class="tab-list" role="tablist" aria-label="Дни недели">
    <button class="tab active" id="tab-mon" type="button" role="tab" aria-selected="true" aria-controls="panel-mon">Понедельник</button>
    <button class="tab" id="tab-wed" type="button" role="tab" aria-selected="false" aria-controls="panel-wed">Среда</button>
    <button class="tab" id="tab-fri" type="button" role="tab" aria-selected="false" aria-controls="panel-fri">Пятница</button>
  </div>
  <div class="panel" id="panel-mon" role="tabpanel" aria-labelledby="tab-mon">
    <ul>
      <li>16:00 — волейбол, большой зал</li>
      <li>18:00 — настольный теннис, малый зал</li>
    </ul>
  </div>
  <div class="panel" id="panel-wed" role="tabpanel" aria-labelledby="tab-wed" hidden>
    <ul>
      <li>15:30 — баскетбол, большой зал</li>
      <li>17:00 — йога, зал хореографии</li>
    </ul>
  </div>
  <div class="panel" id="panel-fri" role="tabpanel" aria-labelledby="tab-fri" hidden>
    <ul>
      <li>16:00 — мини-футбол, стадион</li>
      <li>18:30 — шахматы, кабинет 105</li>
    </ul>
  </div>
</section>`,
      css: `${BASE}
.schedule { max-width: 560px; }
.tab-list { display: flex; gap: 4px; border-bottom: 2px solid #0b5c8a; }
.tab { padding: 10px 16px; border: 0; border-radius: 8px 8px 0 0; background: #e6f2f9; color: #0b5c8a; font: inherit; cursor: pointer; }
.tab:hover { background: #cfe6f3; }
.tab.active { background: #0b5c8a; color: #ffffff; }
.panel { padding: 8px 16px; border: 2px solid #0b5c8a; border-top: 0; }
.panel li { margin: 8px 0; }`,
      js: `// Вкладки
// 1. Найдите все вкладки .tab и все панели .panel

// 2. Каждой вкладке — обработчик щелчка:
//    выключить все вкладки и панели, включить нажатую и её панель
`,
      tests: [
        { name: 'Щелчок по «Среда» — active и aria-selected="true" только у неё', js: true, check: h => {
          h.click('#tab-wed');
          const a = h.$$('.tab').map(t => t.classList.contains('active') + '/' + t.getAttribute('aria-selected')).join(' ');
          return a === 'false/false true/true false/false' || `сейчас (active/aria-selected): ${a}`;
        } },
        { name: 'Щелчок по «Среда» — видна только панель среды', js: true, check: h => {
          h.click('#tab-wed');
          const v = h.$$('.panel').map(p => h.visible(p)).join(' ');
          return v === 'false true false' || `видимость панелей: ${v}`;
        } },
        { name: '«Пятница», потом «Понедельник» — снова понедельник', js: true, check: h => {
          h.click('#tab-fri'); h.click('#tab-mon');
          const ok = h.visible('#panel-mon') && !h.visible('#panel-fri') && h.$('#tab-mon').classList.contains('active') && !h.$('#tab-fri').classList.contains('active');
          return ok || 'после возврата на понедельник должна быть видна только его панель';
        } },
        { name: 'Повторный щелчок по активной вкладке её не прячет', js: true, check: h => { h.click('#tab-mon'); h.click('#tab-mon'); return h.visible('#panel-mon') || 'панель понедельника пропала'; } },
        { name: 'Панель ищется по aria-controls (getAttribute)', check: h => /getAttribute\(\s*['"]aria-controls['"]\s*\)/.test(h.js) || 'найдите панель через tab.getAttribute(\'aria-controls\')' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#tab-fri'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2903', lesson: 'mdk-29', module: 'mdk3', mech: 'build', title: 'Вопросы о поступлении', level: 'Сложное', minutes: 30, points: 200,
      story: 'Приёмная комиссия колледжа устала отвечать на одни и те же вопросы. На сайте сделали блок «вопрос-ответ»: сначала видны три вопроса, остальные — по кнопке «Показать ещё».',
      goal: 'Аккордеон: щелчок по кнопке .faq-question переключает hidden у ответа, id которого записан в её aria-controls, и ставит aria-expanded="true" (открыт) или "false" (закрыт). Вопросы открываются независимо друг от друга и работают в том числе в скрытых блоках. Кнопка #more: показывает все блоки .extra и прячет саму себя.',
      hints: [
        'Цикл по всем вопросам: for (const question of document.querySelectorAll(\'.faq-question\')) { question.addEventListener(\'click\', function () { … }); }',
        'Ответ этого вопроса: const answer = document.querySelector(\'#\' + question.getAttribute(\'aria-controls\'));',
        'Переключение: answer.hidden = !answer.hidden; question.setAttribute(\'aria-expanded\', answer.hidden ? \'false\' : \'true\'); — или то же самое через if / else.',
        'Кнопка «Показать ещё»: more.addEventListener(\'click\', function () { for (const item of document.querySelectorAll(\'.extra\')) { item.hidden = false; } more.hidden = true; });'
      ],
      html: `<section class="faq">
  <h1>Вопросы о поступлении</h1>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a1">Какие документы нужны?</button></h2>
    <p class="faq-answer" id="a1" hidden>Паспорт, аттестат, четыре фото 3×4 и медицинская справка.</p>
  </div>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a2">До какого числа принимают документы?</button></h2>
    <p class="faq-answer" id="a2" hidden>На бюджет — до 15 августа, на платное обучение — до 1 октября.</p>
  </div>
  <div class="faq-item">
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a3">Есть ли общежитие?</button></h2>
    <p class="faq-answer" id="a3" hidden>Да, общежитие в десяти минутах пешком от главного корпуса.</p>
  </div>
  <div class="faq-item extra" hidden>
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a4">Можно ли подать документы онлайн?</button></h2>
    <p class="faq-answer" id="a4" hidden>Да, через портал Госуслуг или по электронной почте приёмной комиссии.</p>
  </div>
  <div class="faq-item extra" hidden>
    <h2><button class="faq-question" type="button" aria-expanded="false" aria-controls="a5">Платят ли стипендию?</button></h2>
    <p class="faq-answer" id="a5" hidden>Да, студентам бюджета, которые учатся без троек.</p>
  </div>
  <button class="more" id="more" type="button">Показать ещё</button>
</section>`,
      css: `${BASE}
.faq { max-width: 620px; }
.faq-item { border-bottom: 1px solid #cccccc; }
.faq-item h2 { margin: 0; font-size: 18px; }
.faq-question { width: 100%; padding: 14px 0; border: 0; background: #ffffff; color: #222222; font: inherit; font-weight: 700; text-align: left; cursor: pointer; }
.faq-question:hover { color: #8a3b12; }
.faq-question::after { content: " +"; color: #8a3b12; }
.faq-answer { margin: 0 0 14px; color: #444444; }
.more { margin-top: 16px; padding: 10px 18px; border: 2px solid #8a3b12; border-radius: 6px; background: #ffffff; color: #8a3b12; font: inherit; cursor: pointer; }`,
      js: `// Вопрос-ответ и «Показать ещё»
// 1. Цикл по всем кнопкам .faq-question:
//    найти ответ по aria-controls, переключить hidden и aria-expanded

// 2. Кнопка #more: показать все .extra и спрятать себя
`,
      tests: [
        { name: 'Щелчок по первому вопросу открывает ответ, aria-expanded="true"', js: true, check: h => {
          const q = h.$$('.faq-question')[0]; h.click(q);
          return h.visible('#a1') && q.getAttribute('aria-expanded') === 'true' || 'ответ не открылся или aria-expanded не "true"';
        } },
        { name: 'Второй щелчок закрывает ответ, aria-expanded="false"', js: true, check: h => {
          const q = h.$$('.faq-question')[0]; h.click(q); h.click(q);
          return !h.visible('#a1') && q.getAttribute('aria-expanded') === 'false' || 'ответ не закрылся или aria-expanded не "false"';
        } },
        { name: 'Вопросы открываются независимо: можно открыть первый и третий', js: true, check: h => {
          const qs = h.$$('.faq-question'); h.click(qs[0]); h.click(qs[2]);
          return h.visible('#a1') && h.visible('#a3') && !h.visible('#a2') || 'должны быть открыты ответы 1 и 3, а 2 — закрыт';
        } },
        { name: '«Показать ещё» показывает оба скрытых вопроса и прячет кнопку', js: true, check: h => {
          if (h.$$('.extra').some(e => h.visible(e))) return 'до щелчка дополнительные вопросы должны быть скрыты';
          h.click('#more');
          if (!h.$$('.extra').every(e => h.visible(e))) return 'после щелчка видны не все вопросы';
          return !h.visible('#more') || 'кнопка «Показать ещё» осталась на экране';
        } },
        { name: 'Вопросы из «Показать ещё» тоже раскрываются', js: true, check: h => {
          h.click('#more');
          const q = h.$$('.faq-question')[4]; h.click(q);
          return h.visible('#a5') && q.getAttribute('aria-expanded') === 'true' || 'пятый вопрос не раскрылся';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#more'); h.click(h.$$('.faq-question')[3]); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k30.js ---- */
/* Занятие 30. Практическая работа №6 (ч. 2). Проверка формы на JavaScript */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.form { display: flex; flex-direction: column; gap: 4px; max-width: 380px; }
label { margin-top: 12px; font-weight: 700; }
input { padding: 10px; border: 1px solid #767676; border-radius: 6px; font: inherit; }
input:focus-visible { outline: 3px solid #0b5c8a; outline-offset: 1px; }
.error { min-height: 20px; margin: 0; color: #b3261e; font-size: 14px; }
button { margin-top: 16px; padding: 12px; border: 0; border-radius: 6px; background: #0b5c8a; color: #ffffff; font: inherit; cursor: pointer; }
button:hover { background: #08476b; }
.result { font-weight: 700; color: #1e6b34; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k3001', lesson: 'mdk-30', module: 'mdk3', mech: 'build', title: 'Имя и почта', level: 'Среднее', minutes: 25, points: 150,
      story: 'Студсовет собирает заявки на волонтёрство. Половина заявок приходит без имени, а в почте то нет @, то нет точки. Добавим проверку до отправки.',
      goal: 'При отправке формы #signup отмените перезагрузку. Имя (#name): пусто или одни пробелы — в #name-error текст «Введите имя» и aria-invalid="true" у поля. Почта (#email): пусто — «Введите почту»; нет @ или нет точки — «Почта должна быть в формате name@mail.ru»; в обоих случаях aria-invalid="true". Если поле верное — сообщение пустое, aria-invalid="false". Ошибки обоих полей показываются одновременно.',
      hints: [
        'Найдите форму, два поля и два абзаца ошибок по id. Обработчик: form.addEventListener(\'submit\', function (event) { event.preventDefault(); … });',
        'Имя: if (nameInput.value.trim() === \'\') { nameError.textContent = \'Введите имя\'; nameInput.setAttribute(\'aria-invalid\', \'true\'); } else { … пусто и \'false\' }',
        'Почту сохраните в переменную: const email = emailInput.value.trim(); Дальше if (email === \'\') { … } else if (!email.includes(\'@\') || !email.includes(\'.\')) { … } else { … }',
        'Не ставьте return после первой ошибки: проверка имени и проверка почты — два отдельных if, один за другим.'
      ],
      html: `<form id="signup" class="form" novalidate>
  <h1>Стать волонтёром</h1>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="given-name" aria-describedby="name-error" required>
  <p class="error" id="name-error"></p>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <button type="submit">Отправить заявку</button>
</form>`,
      css: FORM_CSS.replace(/\n\.result[^\n]*/, ''),
      js: `// Проверка имени и почты
// 1. Найдите форму #signup, поля #name и #email, абзацы #name-error и #email-error

// 2. Событие submit: отменить отправку, проверить имя, проверить почту
`,
      tests: [
        { name: 'Отправка не перезагружает страницу (preventDefault)', js: true, check: h => h.submit('#signup') === false || 'вызовите event.preventDefault()' },
        { name: 'Пустая форма: обе ошибки сразу и aria-invalid="true" у обоих полей', js: true, check: h => {
          h.submit('#signup');
          if (h.text('#name-error') !== 'Введите имя') return `у имени: «${h.text('#name-error')}»`;
          if (h.text('#email-error') !== 'Введите почту') return `у почты: «${h.text('#email-error')}»`;
          return h.$('#name').getAttribute('aria-invalid') === 'true' && h.$('#email').getAttribute('aria-invalid') === 'true' || 'aria-invalid должен стать "true" у обоих полей';
        } },
        { name: 'Имя из пробелов — «Введите имя»', js: true, check: h => { h.type('#name', '   '); h.submit('#signup'); return h.text('#name-error') === 'Введите имя' || 'используйте trim()'; } },
        { name: 'Почта без @ или без точки — ошибка формата', js: true, check: h => {
          const msg = 'Почта должна быть в формате name@mail.ru';
          h.type('#email', 'anna.mail.ru'); h.submit('#signup');
          if (h.text('#email-error') !== msg) return `для anna.mail.ru: «${h.text('#email-error')}»`;
          h.type('#email', 'anna@mailru'); h.submit('#signup');
          if (h.text('#email-error') !== msg) return `для anna@mailru: «${h.text('#email-error')}»`;
          return h.$('#email').getAttribute('aria-invalid') === 'true' || 'aria-invalid должен быть "true"';
        } },
        { name: 'После исправления ошибки исчезают, aria-invalid="false"', js: true, check: h => {
          h.submit('#signup');
          h.type('#name', 'Анна'); h.type('#email', 'anna@mail.ru'); h.submit('#signup');
          if (h.text('#name-error') || h.text('#email-error')) return `остались сообщения: «${h.text('#name-error')}» «${h.text('#email-error')}»`;
          return h.$('#name').getAttribute('aria-invalid') === 'false' && h.$('#email').getAttribute('aria-invalid') === 'false' || 'aria-invalid должен стать "false"';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#signup'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k3002', lesson: 'mdk-30', module: 'mdk3', mech: 'build', title: 'Регистрация в библиотеке', level: 'Сложное', minutes: 30, points: 200,
      story: 'Электронная библиотека колледжа открывает регистрацию. Нужна полная проверка: имя, почта, пароль и сообщение об успехе.',
      goal: 'Напишите функцию setError(input, errorEl, message): кладёт message в errorEl и ставит input aria-invalid="true", если message не пустое, и "false", если пустое. При отправке #register (без перезагрузки) проверьте: имя (#name) не пустое после trim — «Введите имя»; почта (#email) — пусто: «Введите почту», нет @ или точки: «Почта должна быть в формате name@mail.ru»; пароль (#password) не короче 8 символов — «Пароль — не меньше 8 символов». Если всё верно — в #result «Заявка отправлена», если есть ошибки — #result пустой.',
      hints: [
        'Функция: function setError(input, errorEl, message) { errorEl.textContent = message; if (message === \'\') { input.setAttribute(\'aria-invalid\', \'false\'); } else { input.setAttribute(\'aria-invalid\', \'true\'); } }',
        'В обработчике submit: event.preventDefault(); let valid = true; — дальше три проверки.',
        'Пример для пароля: if (passwordInput.value.length < 8) { setError(passwordInput, passwordError, \'Пароль — не меньше 8 символов\'); valid = false; } else { setError(passwordInput, passwordError, \'\'); }',
        'Итог: if (valid) { result.textContent = \'Заявка отправлена\'; } else { result.textContent = \'\'; }'
      ],
      html: `<form id="register" class="form" novalidate>
  <h1>Регистрация в библиотеке</h1>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="name" aria-describedby="name-error" required>
  <p class="error" id="name-error"></p>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <label for="password">Пароль</label>
  <input id="password" name="password" type="password" autocomplete="new-password" aria-describedby="password-error" required minlength="8">
  <p class="error" id="password-error"></p>
  <button type="submit">Зарегистрироваться</button>
</form>
<p class="result" id="result" role="status"></p>`,
      css: FORM_CSS,
      js: `// Регистрация: проверка трёх полей
// 1. Функция setError(input, errorEl, message)

// 2. Найдите форму, поля, абзацы ошибок и #result

// 3. Событие submit: preventDefault, let valid = true, три проверки, итог
`,
      tests: [
        { name: 'setError — функция, ставит текст и aria-invalid', js: true, check: h => {
          const f = h.get('setError');
          if (typeof f !== 'function') return 'нет функции setError';
          f(h.$('#name'), h.$('#name-error'), 'Тест');
          if (h.text('#name-error') !== 'Тест' || h.$('#name').getAttribute('aria-invalid') !== 'true') return 'с сообщением: нужен текст и aria-invalid="true"';
          f(h.$('#name'), h.$('#name-error'), '');
          return h.text('#name-error') === '' && h.$('#name').getAttribute('aria-invalid') === 'false' || 'с пустым сообщением: текст пустой и aria-invalid="false"';
        } },
        { name: 'Отправка не перезагружает страницу', js: true, check: h => h.submit('#register') === false || 'вызовите event.preventDefault()' },
        { name: 'Пустая форма: три сообщения, итога нет', js: true, check: h => {
          h.submit('#register');
          const got = ['#name-error', '#email-error', '#password-error'].map(s => h.text(s)).join(' | ');
          if (got !== 'Введите имя | Введите почту | Пароль — не меньше 8 символов') return `сейчас: ${got}`;
          return h.text('#result') === '' || '#result должен быть пустым';
        } },
        { name: 'Почта anna@mailru — ошибка формата', js: true, check: h => { h.type('#email', 'anna@mailru'); h.submit('#register'); return h.text('#email-error') === 'Почта должна быть в формате name@mail.ru' || `сейчас: «${h.text('#email-error')}»`; } },
        { name: 'Пароль из 7 символов — ошибка, из 8 — нет', js: true, check: h => {
          h.type('#password', '1234567'); h.submit('#register');
          if (h.text('#password-error') !== 'Пароль — не меньше 8 символов') return '7 символов должны давать ошибку';
          h.type('#password', '12345678'); h.submit('#register');
          return h.text('#password-error') === '' && h.$('#password').getAttribute('aria-invalid') === 'false' || '8 символов — уже без ошибки';
        } },
        { name: 'Всё верно — «Заявка отправлена», ошибок нет', js: true, check: h => {
          h.submit('#register');
          h.type('#name', 'Олег'); h.type('#email', 'oleg@mail.ru'); h.type('#password', 'книги2024'); h.submit('#register');
          if (['#name-error', '#email-error', '#password-error'].some(s => h.text(s))) return 'остались сообщения об ошибках';
          return h.text('#result') === 'Заявка отправлена' || `#result: «${h.text('#result')}»`;
        } },
        { name: 'После успеха и новой ошибки итог исчезает', js: true, check: h => {
          h.type('#name', 'Олег'); h.type('#email', 'oleg@mail.ru'); h.type('#password', 'книги2024'); h.submit('#register');
          h.type('#email', ''); h.submit('#register');
          return h.text('#result') === '' || '«Заявка отправлена» осталась, хотя почта пустая';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#register'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k3003', lesson: 'mdk-30', module: 'mdk3', mech: 'fix', title: 'Почините форму входа', level: 'Среднее', minutes: 25, points: 150,
      story: 'Однокурсник сделал проверку формы входа в личный кабинет. Консоль чистая, но форма ведёт себя странно: ругается на правильную почту, пускает пароль из шести символов, а «Заявка отправлена» пишет даже при ошибках.',
      goal: 'Найдите и исправьте пять логических ошибок. Должно работать так: страница не перезагружается; почта без @ или без точки — «Почта должна быть в формате name@mail.ru», верная почта — без ошибки; пароль короче 8 символов — «Пароль — не меньше 8 символов»; исправленные поля очищают сообщение и получают aria-invalid="false"; «Заявка отправлена» в #result — только если ошибок нет, иначе #result пустой.',
      hints: [
        'Первое, что должно быть в обработчике submit, — event.preventDefault().',
        'Условие для почты сейчас срабатывает, когда @ ЕСТЬ. Нужно наоборот, и ещё проверить точку: !email.value.includes(\'@\') || !email.value.includes(\'.\')',
        'Сравните число в проверке пароля с текстом сообщения.',
        'У каждого if с ошибкой нужна ветка else, которая стирает сообщение и ставит aria-invalid="false". А итог пишите только if (valid).'
      ],
      html: `<form id="login" class="form" novalidate>
  <h1>Вход в личный кабинет</h1>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required>
  <p class="error" id="email-error"></p>
  <label for="password">Пароль</label>
  <input id="password" name="password" type="password" autocomplete="current-password" aria-describedby="password-error" required>
  <p class="error" id="password-error"></p>
  <button type="submit">Войти</button>
</form>
<p class="result" id="result" role="status"></p>`,
      css: FORM_CSS,
      js: `// Проверка формы входа. Пять логических ошибок!
const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  let valid = true;

  if (email.value.includes('@')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    email.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (password.value.length < 6) {
    passwordError.textContent = 'Пароль — не меньше 8 символов';
    password.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  result.textContent = 'Заявка отправлена';
});
`,
      tests: [
        { name: 'Отправка не перезагружает страницу', js: true, check: h => h.submit('#login') === false || 'не хватает event.preventDefault()' },
        { name: 'Верная почта anna@mail.ru — без ошибки', js: true, check: h => { h.type('#email', 'anna@mail.ru'); h.submit('#login'); return h.text('#email-error') === '' || `сейчас: «${h.text('#email-error')}»`; } },
        { name: 'Почта без @ или без точки — ошибка формата', js: true, check: h => {
          h.type('#email', 'anna.mail.ru'); h.submit('#login');
          if (h.text('#email-error') !== 'Почта должна быть в формате name@mail.ru') return 'для anna.mail.ru нет ошибки';
          h.type('#email', 'anna@mailru'); h.submit('#login');
          return h.text('#email-error') === 'Почта должна быть в формате name@mail.ru' || 'для anna@mailru нет ошибки';
        } },
        { name: 'Пароль из 6–7 символов — ошибка', js: true, check: h => { h.type('#password', 'abc1234'); h.submit('#login'); return h.text('#password-error') === 'Пароль — не меньше 8 символов' || 'пароль из 7 символов прошёл проверку'; } },
        { name: 'Исправленные поля очищают сообщение, aria-invalid="false"', js: true, check: h => {
          h.type('#email', 'anna'); h.type('#password', '123'); h.submit('#login');
          h.type('#email', 'anna@mail.ru'); h.type('#password', 'parol2024'); h.submit('#login');
          if (h.text('#email-error') || h.text('#password-error')) return 'старые сообщения не исчезли';
          return h.$('#email').getAttribute('aria-invalid') === 'false' && h.$('#password').getAttribute('aria-invalid') === 'false' || 'aria-invalid должен стать "false"';
        } },
        { name: '«Заявка отправлена» — только без ошибок', js: true, check: h => {
          h.type('#email', 'anna'); h.submit('#login');
          if (h.text('#result') !== '') return 'при ошибке #result должен быть пустым';
          h.type('#email', 'anna@mail.ru'); h.type('#password', 'parol2024'); h.submit('#login');
          return h.text('#result') === 'Заявка отправлена' || 'при верных данных нет «Заявка отправлена»';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.submit('#login'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k31.js ---- */
/* Занятие 31. Практическая работа №7. Подготовка и оптимизация графики */
(() => {
  const { BASE, IMG, ICON, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k3101', lesson: 'mdk-31', module: 'mdk3', mech: 'fix', title: 'Галерея без прыжков', level: 'Лёгкое', minutes: 25, points: 120,
      story: 'Фотогалерея с выпускного на сайте колледжа грузится долго, текст «прыгает», пока появляются фото, а на телефоне картинки вылезают за экран.',
      goal: 'У всех четырёх картинок галереи: width="600" и height="300" (настоящий размер файла), понятный alt (не пустой — это содержательные фото), loading="lazy" у всех, кроме первой (первая видна сразу). В CSS замените фиксированную ширину на max-width: 100% и height: auto, чтобы на телефоне 360px не было горизонтальной прокрутки и пропорции 2:1 сохранились.',
      hints: [
        'Пример готовой картинки: <img src="img/art.svg" alt="Выпускники во дворе колледжа" width="600" height="300" loading="lazy">',
        'Первой картинке loading="lazy" не нужен: она на первом экране и должна появиться сразу.',
        'Пустой alt="" — только для декоративных картинок. Здесь фото с праздника, опишите, что на них.',
        'CSS: .gallery img { max-width: 100%; height: auto; } — без width: 600px.'
      ],
      html: `<main class="gallery-page">
  <h1>Фотографии с выпускного</h1>
  <p>Июнь, актовый зал и двор колледжа.</p>
  <div class="gallery">
    <img src="${IMG}" alt="Актовый зал перед началом вечера">
    <img src="${IMG}">
    <img src="${IMG}" alt="">
    <img src="${IMG}" alt="Выпускники во дворе колледжа">
  </div>
</main>`,
      css: `${BASE}
.gallery { display: grid; gap: 12px; }
.gallery img { width: 600px; }`,
      tests: [
        { name: 'У всех картинок width="600" и height="300"', check: h => { const bad = h.$$('.gallery img').filter(i => i.getAttribute('width') !== '600' || i.getAttribute('height') !== '300'); return h.count('.gallery img') === 4 && !bad.length || `без правильных width/height: ${bad.length}`; } },
        { name: 'У всех картинок понятный alt', check: h => { const bad = h.$$('.gallery img').filter(i => (i.getAttribute('alt') || '').trim().length < 5); return !bad.length || `без описания: ${bad.length}`; } },
        { name: 'loading="lazy" у всех, кроме первой', check: h => { const l = h.$$('.gallery img').map(i => i.getAttribute('loading') === 'lazy'); return l.join() === 'false,true,true,true' || `lazy: ${l.join(', ')}`; } },
        { name: 'Телефон: картинки не шире экрана, пропорции 2:1', at: 360, check: h => {
          const r = h.rect('.gallery img');
          if (r.width > 320) return `ширина картинки ${Math.round(r.width)}px`;
          return Math.abs(r.width / r.height - 2) < 0.05 || `пропорции искажены: ${Math.round(r.width)}×${Math.round(r.height)}`;
        } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'В CSS нет фиксированной ширины 600px', check: h => !h.has(/width:\s*600px/) || 'уберите width: 600px' }
      ]
    },
    {
      id: 'k3102', lesson: 'mdk-31', module: 'mdk3', mech: 'adaptive', title: 'Картинка под экран', level: 'Сложное', minutes: 30, points: 200,
      story: 'На главной кофейни широкая панорама зала. На телефоне она превращается в узкую полоску, а картинка торта весит как на огромный монитор. Подберём файлы под экран.',
      goal: 'Первый экран: оберните картинку .hero-img в picture. В source с media="(min-width: 768px)" — srcset="img/course/k31-wide.svg"; в img — src="img/course/k31-square.svg", width="600", height="600", alt остаётся. Карточка: у .card-img src="img/course/k31-card-480.svg", srcset из двух файлов k31-card-480.svg (480w) и k31-card-960.svg (960w), sizes="(min-width: 768px) 50vw, 100vw", width="480", height="320".',
      hints: [
        'Каркас: <picture><source media="(min-width: 768px)" srcset="img/course/k31-wide.svg"><img class="hero-img" …></picture>',
        'Внутри picture у img поменяйте src на квадратный файл и размеры на 600×600. Класс hero-img и alt оставьте.',
        'srcset: два файла через запятую, после каждого ширина: srcset="img/course/k31-card-480.svg 480w, img/course/k31-card-960.svg 960w"',
        'sizes="(min-width: 768px) 50vw, 100vw" — на компьютере карточка занимает половину окна, на телефоне всю ширину.'
      ],
      html: `<header class="hero">
  <h1>Кофейня «Зерно»</h1>
  <img class="hero-img" src="img/course/k31-wide.svg" alt="Зал кофейни вечером" width="1200" height="500">
</header>
<main>
  <article class="card">
    <img class="card-img" src="img/course/k31-card-960.svg" alt="Шоколадный торт с вишней" width="960" height="640">
    <h2>Торт дня</h2>
    <p>Шоколадный бисквит, вишня и сливочный крем. 180 рублей за кусочек.</p>
  </article>
</main>`,
      css: `${BASE}
.hero-img, .card-img { display: block; max-width: 100%; height: auto; }
.card { margin-top: 24px; border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card h2, .card p { margin: 12px 16px; }
@media (min-width: 768px) {
  .card { width: 50%; }
}`,
      tests: [
        { name: 'Картинка первого экрана внутри picture с source для экранов от 768px', check: h => {
          const s = h.$('.hero picture source');
          if (!s) return 'нет picture > source в .hero';
          if (!/\(\s*min-width:\s*768px\s*\)/.test(s.getAttribute('media') || '')) return `media: «${s.getAttribute('media') || ''}»`;
          return (s.getAttribute('srcset') || '').trim() === 'img/course/k31-wide.svg' || 'srcset у source — img/course/k31-wide.svg';
        } },
        { name: 'img в picture: квадратный файл, 600×600, alt и класс на месте', check: h => {
          const i = h.$('.hero picture img.hero-img');
          if (!i) return 'внутри picture нет img с классом hero-img';
          if (i.getAttribute('src') !== 'img/course/k31-square.svg') return `src: ${i.getAttribute('src')}`;
          if (i.getAttribute('width') !== '600' || i.getAttribute('height') !== '600') return 'width и height должны быть 600';
          return i.alt.trim().length > 3 || 'нет alt';
        } },
        { name: 'Компьютер: показывается широкая картинка', check: h => /k31-wide\.svg$/.test(h.$('.hero-img')?.currentSrc || '') || `сейчас: ${(h.$('.hero-img')?.currentSrc || '').split('/').pop()}` },
        { name: 'Телефон: показывается квадратная картинка', at: 360, check: h => /k31-square\.svg$/.test(h.$('.hero-img')?.currentSrc || '') || `сейчас: ${(h.$('.hero-img')?.currentSrc || '').split('/').pop()}` },
        { name: 'Карточка: srcset из 480w и 960w', check: h => {
          const s = (h.$('.card-img')?.getAttribute('srcset') || '').split(',').map(x => x.trim().replace(/\s+/g, ' ')).sort().join(' | ');
          return s === 'img/course/k31-card-480.svg 480w | img/course/k31-card-960.svg 960w' || `srcset: ${s || 'нет'}`;
        } },
        { name: 'Карточка: sizes="(min-width: 768px) 50vw, 100vw"', check: h => (h.$('.card-img')?.getAttribute('sizes') || '').replace(/\s+/g, ' ').replace(/\(\s*/g, '(').replace(/\s*\)/g, ')').trim() === '(min-width: 768px) 50vw, 100vw' || `sizes: «${h.$('.card-img')?.getAttribute('sizes') || ''}»` },
        { name: 'Карточка: src на маленьком файле, 480×320', check: h => { const i = h.$('.card-img'); return !!i && i.getAttribute('src') === 'img/course/k31-card-480.svg' && i.getAttribute('width') === '480' && i.getAttribute('height') === '320' || 'src — k31-card-480.svg, width 480, height 320'; } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k3103', lesson: 'mdk-31', module: 'mdk3', mech: 'build', title: 'Обложки, иконки и фон', level: 'Среднее', minutes: 25, points: 150,
      story: 'Страница кофейни почти готова, но карточки меню разной высоты из-за фото разных пропорций, скринридер читает «иконка» перед каждым контактом, а первый экран — просто текст на белом.',
      goal: 'Карточки: всем картинкам .card img — width: 100%, height: 180px, object-fit: cover. Контакты: иконкам в .contacts — пустой alt="" и атрибуты width="24" height="24". Первый экран .hero: фон background-image: url("img/art.svg"), background-size: cover, background-position: center, запасной тёмный background-color #2a2238, белый цвет текста #ffffff.',
      hints: [
        'Карточки: .card img { width: 100%; height: 180px; object-fit: cover; } Картинки обрежутся по краям, но не исказятся.',
        'Иконка рядом со словом «Телефон» его дублирует: <img src="img/icon.svg" alt="" width="24" height="24">.',
        'Фон: .hero { background-color: #2a2238; background-image: url("img/art.svg"); background-size: cover; background-position: center; color: #ffffff; }'
      ],
      html: `<section class="hero">
  <h1>Кофейня «Зерно»</h1>
  <p>Кофе и выпечка у колледжа с 8:00</p>
</section>
<section class="menu">
  <h2>Хиты недели</h2>
  <div class="cards">
    <article class="card">
      <img src="${IMG}" alt="Вечерний зал кофейни" width="600" height="300">
      <h3>Раф «Вечерний»</h3>
    </article>
    <article class="card">
      <img src="img/course/k31-square.svg" alt="Яблочный пирог на тарелке" width="600" height="600">
      <h3>Пирог с яблоком</h3>
    </article>
    <article class="card">
      <img src="img/course/k31-card-480.svg" alt="Шоколадный торт с вишней" width="480" height="320">
      <h3>Торт дня</h3>
    </article>
  </div>
</section>
<section class="contacts">
  <h2>Контакты</h2>
  <ul>
    <li><img src="${ICON}" alt="иконка">Телефон: <a href="tel:+79990000000">+7 999 000-00-00</a></li>
    <li><img src="${ICON}" alt="иконка">Почта: <a href="mailto:hello@zerno.example">hello@zerno.example</a></li>
  </ul>
</section>`,
      css: `${BASE}
.hero { padding: 64px 24px; border-radius: 12px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.card { border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card img { display: block; width: 100%; }
.card h3 { margin: 12px 16px; }
.contacts ul { padding: 0; list-style: none; }
.contacts li { margin: 8px 0; }
.contacts img { margin-right: 8px; vertical-align: middle; }`,
      tests: [
        { name: 'Картинки карточек: object-fit: cover', check: h => h.$$('.card img').every(i => h.cs(i, 'object-fit') === 'cover') || 'нужно object-fit: cover' },
        { name: 'Картинки карточек одной высоты 180px и во всю ширину карточки', check: h => {
          for (const i of h.$$('.card img')) {
            const r = i.getBoundingClientRect(), c = i.closest('.card').getBoundingClientRect();
            if (Math.abs(r.height - 180) > 1) return `высота картинки ${Math.round(r.height)}px`;
            if (r.width < c.width - 4) return 'картинка уже карточки';
          }
          return true;
        } },
        { name: 'Иконки в контактах: alt="" и width/height 24', check: h => { const bad = h.$$('.contacts img').filter(i => i.getAttribute('alt') !== '' || i.getAttribute('width') !== '24' || i.getAttribute('height') !== '24'); return h.count('.contacts img') === 2 && !bad.length || `неправильных иконок: ${bad.length}`; } },
        { name: 'Первый экран: фон img/art.svg, cover, по центру', check: h => {
          if (!/art\.svg/.test(h.cs('.hero', 'background-image'))) return 'нет background-image с img/art.svg';
          if (h.cs('.hero', 'background-size') !== 'cover') return `background-size: ${h.cs('.hero', 'background-size')}`;
          return /^50% 50%$/.test(h.cs('.hero', 'background-position')) || `background-position: ${h.cs('.hero', 'background-position')}`;
        } },
        { name: 'Первый экран: запасной фон #2a2238 и белый текст', check: h => h.cs('.hero', 'background-color') === rgb('#2a2238') && h.cs('.hero h1', 'color') === rgb('#ffffff') && h.cs('.hero p', 'color') === rgb('#ffffff') || 'нужны background-color: #2a2238 и color: #ffffff' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/k32.js ---- */
/* Занятие 32. Практическая работа №8. Создание баннера для веб-страницы */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Контраст текста на градиенте: браузер не умеет считать его сам, поэтому сравниваем цвет текста
  // с каждым цветом градиента по формуле WCAG
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const colors = s => (s.match(/rgba?\([^)]*\)/g) || []).map(c => c.match(/[\d.]+/g).slice(0, 3).map(Number));
  const onGradient = (h, box, texts) => {
    const stops = colors(h.cs(box, 'background-image'));
    if (!stops.length) return 'у баннера нет градиента — сравнивать не с чем';
    for (const t of texts) {
      if (!h.$(t)) return `нет элемента ${t}`;
      const fg = colors(h.cs(t, 'color'))[0];
      const worst = Math.min(...stops.map(s => ratio(s, fg)));
      if (worst < 4.5) return `${t}: на самом светлом цвете градиента контраст ${worst.toFixed(2)}:1, нужно 4,5:1`;
    }
    return true;
  };
  const transparent = c => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);

  window.COURSE_TASKS.push(
    {
      id: 'k3201', lesson: 'mdk-32', module: 'mdk3', mech: 'build',
      title: 'Горизонтальный баннер 728×90', level: 'Среднее', minutes: 25, points: 150,
      story: 'Колледж набирает группу на бесплатный пробный урок по веб-дизайну. Для сайта колледжа нужен узкий баннер над статьями — стандартный размер 728×90.',
      goal: 'Допишите CSS. Баннер .banner — ровно 728×90 пикселей (используйте box-sizing: border-box), фон — линейный градиент, текст белый и читается на любом цвете градиента (контраст не ниже 4,5:1). Заголовок, текст и кнопка стоят в один ряд на flexbox и выровнены по центру по высоте, кнопка прижата к правому краю. Кнопка .banner__button — со своим фоном, внутренними отступами не меньше 12px по бокам и без подчёркивания.',
      hints: [
        'Начните с размеров: box-sizing: border-box; width: 728px; height: 90px; padding: 0 24px. Тогда отступы не прибавятся к ширине.',
        'В ряд и по центру: display: flex; align-items: center; justify-content: space-between; gap: 16px.',
        'Градиент: background: linear-gradient(90deg, #2b1a66, #7a1f5c); color: #ffffff. Берите два тёмных цвета, тогда белый текст будет читаться везде.',
        'Кнопка: .banner__button { padding: 12px 20px; border-radius: 8px; background: #ffd166; color: #222222; font-weight: bold; text-decoration: none; }'
      ],
      html: `<section class="banner">
  <h2 class="banner__title">Курсы веб-дизайна</h2>
  <p class="banner__text">Первое занятие — бесплатно, 15 марта</p>
  <a class="banner__button" href="#signup">Записаться</a>
</section>`,
      css: `${BASE}
/* Допишите правило .banner: размер 728×90, градиент, flexbox */

.banner__title { margin: 0; font-size: 24px; }
.banner__text { margin: 0; }

/* Допишите правило .banner__button */`,
      tests: [
        { name: 'Баннер ровно 728×90 пикселей', check: h => { const r = h.rect('.banner'); return r && Math.round(r.width) === 728 && Math.round(r.height) === 90 || `сейчас ${r ? Math.round(r.width) + '×' + Math.round(r.height) : 'нет .banner'}`; } },
        { name: 'Фон баннера — линейный градиент', check: h => h.cs('.banner', 'background-image').includes('linear-gradient') || 'нужен background: linear-gradient(…)' },
        { name: 'Заголовок, текст и кнопка в один ряд, по центру по высоте', check: h => {
          if (h.cs('.banner', 'display') !== 'flex') return 'у .banner нет display: flex';
          const mid = s => { const r = h.rect(s); return r ? r.top + r.height / 2 : NaN; };
          const m = ['.banner__title', '.banner__text', '.banner__button'].map(mid);
          return Math.max(...m) - Math.min(...m) <= 2 || 'элементы не выровнены по центру: align-items: center';
        } },
        { name: 'Кнопка прижата к правому краю баннера', check: h => { const b = h.rect('.banner'), a = h.rect('.banner__button'), t = h.rect('.banner__text'); return !!(b && a && t) && b.right - a.right <= 32 && a.left > t.right || 'кнопка должна стоять справа: justify-content: space-between'; } },
        { name: 'Текст читается на всех цветах градиента (4,5:1)', check: h => onGradient(h, '.banner', ['.banner__title', '.banner__text']) },
        { name: 'Кнопка заметная: свой фон, отступы от 12px, без подчёркивания', check: h => {
          if (transparent(h.cs('.banner__button', 'background-color'))) return 'у кнопки нет своего фона';
          if (h.px('.banner__button', 'padding-left') < 12 || h.px('.banner__button', 'padding-right') < 12) return `отступы по бокам: ${h.px('.banner__button', 'padding-left')}px`;
          return h.cs('.banner__button', 'text-decoration-line') === 'none' || 'уберите подчёркивание: text-decoration: none';
        } }
      ]
    },
    {
      id: 'k3202', lesson: 'mdk-32', module: 'mdk3', mech: 'build',
      title: 'Квадратный баннер 300×250', level: 'Среднее', minutes: 25, points: 150,
      story: 'Тот же пробный урок нужно прорекламировать в боковой колонке сайта. Туда помещается «средний прямоугольник» — баннер 300×250.',
      goal: 'Напишите HTML и CSS. Блок aside с классом promo, внутри по порядку: заголовок h2, абзац p и ссылка-кнопка с классом promo__button. Баннер — ровно 300×250 пикселей, со скруглёнными углами (радиус от 12px), тенью box-shadow и фоном-градиентом; текст читается на всех цветах градиента (4,5:1). Содержимое стоит столбиком по центру: flex-direction: column, justify-content: center, text-align: center. У кнопки есть плавный переход transition, состояние :hover меняет её фон, а для :focus-visible задана рамка outline.',
      hints: [
        'Разметка: <aside class="promo"><h2>…</h2><p>…</p><a class="promo__button" href="#signup">…</a></aside>.',
        'Размер и вид: box-sizing: border-box; width: 300px; height: 250px; padding: 24px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25).',
        'Столбик по центру: display: flex; flex-direction: column; justify-content: center; text-align: center; gap: 8px.',
        'Состояния: .promo__button { transition: background-color 0.2s; } .promo__button:hover { background: #ffe8a3; } .promo__button:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }'
      ],
      html: `<!-- Баннер 300×250: aside.promo, внутри h2, p и a.promo__button -->
`,
      css: `${BASE}
/* Оформите баннер .promo и кнопку .promo__button */
`,
      tests: [
        { name: 'Есть aside.promo, внутри h2, p и a.promo__button по порядку', check: h => {
          const a = h.$('aside.promo'); if (!a) return 'нет <aside class="promo">';
          const h2 = a.querySelector('h2'), p = a.querySelector('p'), btn = a.querySelector('a.promo__button');
          if (!h2 || !p || !btn) return 'внутри нужны h2, p и a.promo__button';
          if (!btn.textContent.trim() || !btn.getAttribute('href')) return 'у кнопки нет текста или href';
          return h.before(h2, p) && h.before(p, btn) || 'порядок: заголовок, текст, кнопка';
        } },
        { name: 'Баннер ровно 300×250 пикселей', check: h => { const r = h.rect('.promo'); return r && Math.round(r.width) === 300 && Math.round(r.height) === 250 || `сейчас ${r ? Math.round(r.width) + '×' + Math.round(r.height) : 'нет .promo'}`; } },
        { name: 'Скруглённые углы от 12px и тень', check: h => {
          if (!(h.px('.promo', 'border-top-left-radius') >= 12)) return `радиус: ${h.cs('.promo', 'border-top-left-radius') || 'нет'}`;
          return h.cs('.promo', 'box-shadow') !== 'none' || 'нет box-shadow';
        } },
        { name: 'Фон — градиент, текст читается на всех его цветах', check: h => {
          const g = h.cs('.promo', 'background-image');
          if (!/gradient/.test(g)) return 'нужен фон-градиент';
          return onGradient(h, '.promo', ['.promo h2', '.promo p']);
        } },
        { name: 'Содержимое столбиком по центру', check: h => h.cs('.promo', 'display') === 'flex' && h.cs('.promo', 'flex-direction') === 'column' && h.cs('.promo', 'justify-content') === 'center' && h.cs('.promo', 'text-align') === 'center' || 'нужны display: flex, flex-direction: column, justify-content: center, text-align: center' },
        { name: 'У кнопки есть transition, :hover меняет фон, :focus-visible даёт outline', check: h => {
          const dur = h.cs('.promo__button', 'transition-duration').split(',').some(d => parseFloat(d) > 0);
          if (!dur) return 'нет transition у .promo__button';
          const hover = h.rules.some(r => /\.promo__button:hover/.test(r.selector) && (r.style.backgroundColor || r.style.backgroundImage));
          if (!hover) return 'нет правила .promo__button:hover с background';
          const focus = h.rules.some(r => /\.promo__button:focus-visible/.test(r.selector) && (r.style.outlineStyle || r.style.outline));
          return focus || 'нет правила .promo__button:focus-visible с outline';
        } }
      ]
    },
    {
      id: 'k3203', lesson: 'mdk-32', module: 'mdk3', mech: 'adaptive',
      title: 'Резиновый баннер с анимацией', level: 'Сложное', minutes: 35, points: 200,
      story: 'Баннеры фиксированного размера на телефоне вылезают за экран. Сделаем адаптивный баннер для главной страницы: он подстраивается под ширину экрана и мягко появляется при загрузке — но только у тех, кто не отключил анимацию.',
      goal: 'Переделайте CSS. На компьютере баннер .hero-banner не шире 728px (используйте max-width) и стоит в ряд; на телефоне 360px нет горизонтальной прокрутки, кнопка стоит под текстом и растянута на всю ширину баннера. Добавьте анимацию появления: правило @keyframes и свойство animation у баннера или кнопки; анимация длится не больше 1 секунды и проигрывается конечное число раз (не infinite). В @media (prefers-reduced-motion: reduce) отключите анимацию: animation: none. Текст должен читаться на всех цветах градиента.',
      hints: [
        'Замените width: 728px на max-width: 728px и добавьте box-sizing: border-box. Теперь баннер сжимается вместе с экраном.',
        'Mobile first: в .hero-banner поставьте flex-direction: column и align-items: stretch, а ряд верните в @media (min-width: 768px) { .hero-banner { flex-direction: row; align-items: center; } }.',
        'Анимация: @keyframes banner-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } } и у баннера animation: banner-in 0.6s ease-out.',
        'Для тех, кто просит меньше движения: @media (prefers-reduced-motion: reduce) { .hero-banner { animation: none; } }.'
      ],
      html: `<section class="hero-banner">
  <img class="hero-banner__icon" src="img/icon.svg" alt="" width="64" height="64">
  <div class="hero-banner__body">
    <h2 class="hero-banner__title">Весенний интенсив по вёрстке</h2>
    <p class="hero-banner__text">5 занятий, практика на настоящих макетах</p>
  </div>
  <a class="hero-banner__button" href="#signup">Хочу на интенсив</a>
</section>`,
      css: `${BASE}
.hero-banner {
  width: 728px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #1d3557, #6a2c70);
  color: #ffffff;
  border-radius: 16px;
}
.hero-banner__title { margin: 0 0 8px; font-size: 24px; }
.hero-banner__text { margin: 0; }
.hero-banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
}`,
      tests: [
        { name: 'На компьютере баннер не шире 728px и стоит в ряд', check: h => {
          const r = h.rect('.hero-banner'); if (!r) return 'нет .hero-banner';
          if (r.width > 728.5) return `ширина ${Math.round(r.width)}px`;
          if (r.width < 600) return `баннер сжался до ${Math.round(r.width)}px — нужна ширина 728px на большом экране`;
          return h.sameRow(['.hero-banner__icon', '.hero-banner__button']) || h.cs('.hero-banner', 'flex-direction') === 'row' || 'на компьютере элементы должны стоять в ряд';
        } },
        { at: 360, name: 'На телефоне нет горизонтальной прокрутки', check: h => !h.overflow() && h.rect('.hero-banner').right <= 360 || 'баннер шире экрана: замените width на max-width' },
        { at: 360, name: 'На телефоне кнопка под текстом и во всю ширину баннера', check: h => {
          const b = h.rect('.hero-banner'), t = h.rect('.hero-banner__body'), a = h.rect('.hero-banner__button');
          if (a.top < t.bottom - 1) return 'кнопка должна стоять ниже текста';
          const inner = b.width - h.px('.hero-banner', 'padding-left') - h.px('.hero-banner', 'padding-right');
          return a.width >= inner - 2 || `ширина кнопки ${Math.round(a.width)}px из ${Math.round(inner)}px`;
        } },
        { name: 'Есть @keyframes и animation у баннера или кнопки', check: h => {
          if (!h.has(/@keyframes\s+[\w-]+/)) return 'нет правила @keyframes';
          return ['.hero-banner', '.hero-banner__button'].some(s => h.cs(s, 'animation-name') !== 'none') || 'анимация не подключена: animation: имя 0.6s';
        } },
        { name: 'Анимация короткая (до 1 с) и не бесконечная', check: h => {
          const s = ['.hero-banner', '.hero-banner__button'].find(x => h.cs(x, 'animation-name') !== 'none');
          if (!s) return 'анимации нет';
          if (/infinite/.test(h.cs(s, 'animation-iteration-count'))) return 'бесконечная анимация отвлекает: уберите infinite';
          const d = parseFloat(h.cs(s, 'animation-duration'));
          return d > 0 && d <= 1 || `длительность ${h.cs(s, 'animation-duration')}`;
        } },
        { name: 'При prefers-reduced-motion: reduce анимация выключена', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media || '') && r.style.animationName === 'none') || 'нужно @media (prefers-reduced-motion: reduce) { … animation: none; }' },
        { name: 'Текст читается на всех цветах градиента (4,5:1)', check: h => onGradient(h, '.hero-banner', ['.hero-banner__title', '.hero-banner__text']) }
      ]
    }
  );
})();
/* ---- content/tasks/k33.js ---- */
/* Занятие 33. Веб-дизайн и профессия веб-дизайнера */
(() => {
  const { BASE } = window.COURSE_KIT;
  const SPECS = [
    [/\bUI\b/, 'UI'], [/\bUX\b/, 'UX'], [/продукт/i, 'продуктовый'], [/графич/i, 'графический веб'], [/моушн|motion/i, 'моушн']
  ];
  const CRITERIA = ['Обучаемость', 'Эффективность', 'Запоминаемость', 'Ошибки', 'Удовлетворённость'];

  window.COURSE_TASKS.push(
    {
      id: 'k3301', lesson: 'mdk-33', module: 'mdk4', mech: 'build',
      title: 'Карточки специализаций', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Для дня открытых дверей колледжа делаем страницу «Кем работает веб-дизайнер». Абитуриенты должны с первого взгляда увидеть пять направлений профессии.',
      goal: 'Под заголовком h1 сделайте блок section с классом specs, а в нём пять карточек article с классом spec. В каждой карточке — заголовок h2 и абзац p о том, чем занимается специалист. Заголовки: UI-дизайнер, UX-дизайнер, продуктовый дизайнер, графический веб-дизайнер, моушн-дизайнер (порядок любой). В CSS у .specs включите сетку: display: grid, три колонки одинаковой ширины и промежуток gap не меньше 16px.',
      hints: [
        'Одна карточка выглядит так: <article class="spec"><h2>UI-дизайнер</h2><p>Рисует экраны: кнопки, поля, карточки.</p></article>.',
        'Все пять карточек лежат внутри <section class="specs"> … </section>, сразу после h1.',
        'Сетка: .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }.'
      ],
      html: `<h1>Кем работает веб-дизайнер</h1>
<!-- Ниже: section.specs и пять карточек article.spec -->
`,
      css: `${BASE}
.specs {
  /* включите сетку из трёх колонок */
  margin-top: 24px;
}
.spec {
  padding: 16px;
  border: 1px solid #c9c9d6;
  border-radius: 12px;
  background: #f6f6fb;
}
.spec h2 { margin: 0 0 8px; font-size: 20px; color: #3b2a7a; }
.spec p { margin: 0; line-height: 1.5; }`,
      tests: [
        { name: 'Есть section.specs и в ней пять article.spec', check: h => h.count('section.specs > article.spec') === 5 || `карточек внутри section.specs: ${h.count('section.specs > article.spec')}` },
        { name: 'В каждой карточке есть h2 и абзац p с текстом', check: h => { const c = h.$$('article.spec'); return c.length > 0 && c.every(a => a.querySelector('h2')?.textContent.trim() && (a.querySelector('p')?.textContent.trim().length || 0) >= 10) || 'в какой-то карточке нет h2 или абзаца хотя бы из пары слов'; } },
        { name: 'Названы все пять специализаций', check: h => { const t = h.$$('article.spec h2').map(e => e.textContent).join(' | '); const miss = SPECS.filter(([re]) => !re.test(t)).map(([, n]) => n); return !miss.length || `нет: ${miss.join(', ')}`; } },
        { name: 'Карточки стоят сеткой в три колонки', check: h => {
          if (h.cs('.specs', 'display') !== 'grid') return 'у .specs нет display: grid';
          const cols = h.cs('.specs', 'grid-template-columns').split(' ').filter(Boolean);
          if (cols.length !== 3) return `колонок: ${cols.length}`;
          return Math.max(...cols.map(parseFloat)) - Math.min(...cols.map(parseFloat)) < 1 || 'колонки разной ширины: используйте 1fr';
        } },
        { name: 'Между карточками промежуток от 16px', check: h => h.px('.specs', 'column-gap') >= 16 && h.px('.specs', 'row-gap') >= 16 || `gap: ${h.cs('.specs', 'gap') || 'нет'}` }
      ]
    },
    {
      id: 'k3302', lesson: 'mdk-33', module: 'mdk4', mech: 'build',
      title: 'Страница портфолио', level: 'Среднее', minutes: 25, points: 150,
      story: 'Портфолио — главный документ дизайнера при устройстве на работу. Начнём своё: шапка с именем, три работы и контакты.',
      goal: 'Сделайте страницу из трёх частей. 1) header: h1 с вашим именем и абзац с классом role (кто вы, например «начинающий веб-дизайнер»). 2) section с классом works: заголовок h2 «Работы» и три figure, в каждой картинка img/art.svg с осмысленным alt и подпись figcaption. 3) footer со ссылкой на почту (mailto:). На компьютере три работы стоят в ряд, а на телефоне 360px — друг под другом, без горизонтальной прокрутки.',
      hints: [
        'Одна работа: <figure><img src="img/art.svg" alt="Главная страница сайта кофейни"><figcaption>Сайт кофейни «Зерно»</figcaption></figure>.',
        'Чтобы картинки не вылезали за экран: .works img { max-width: 100%; height: auto; }. Уберите у figure лишний отступ: margin: 0.',
        'Mobile first: сначала .works-list { display: grid; gap: 24px; } — одна колонка, а в @media (min-width: 768px) — grid-template-columns: repeat(3, 1fr).',
        'Работы удобно обернуть в div class="works-list", чтобы заголовок h2 не попал в сетку.'
      ],
      html: `<!-- 1. header: h1 и p.role -->

<!-- 2. section.works: h2 «Работы» и три figure -->

<!-- 3. footer: ссылка mailto: -->
`,
      css: `${BASE}
/* Оформите портфолио: работы в ряд на компьютере и столбиком на телефоне */
`,
      tests: [
        { name: 'В header есть h1 и p.role с текстом', check: h => !!(h.$('header h1')?.textContent.trim() && h.$('header p.role')?.textContent.trim()) || 'нужны <header><h1>…</h1><p class="role">…</p></header>' },
        { name: 'В section.works есть h2 «Работы» и три figure', check: h => {
          if (!h.$('section.works')) return 'нет section.works';
          if (h.text('section.works h2') !== 'Работы') return 'нужен заголовок h2 «Работы»';
          return h.count('section.works figure') === 3 || `figure: ${h.count('section.works figure')}`;
        } },
        { name: 'В каждой figure картинка img/art.svg с alt и подпись figcaption', check: h => { const f = h.$$('section.works figure'); return f.length === 3 && f.every(x => { const i = x.querySelector('img'); return i && i.getAttribute('src') === 'img/art.svg' && (i.getAttribute('alt') || '').trim().length >= 3 && x.querySelector('figcaption')?.textContent.trim(); }) || 'проверьте img src, alt из нескольких слов и figcaption в каждой работе'; } },
        { name: 'В footer есть ссылка на почту mailto:', check: h => !!h.$('footer a[href^="mailto:"]')?.textContent.trim() || 'нет <footer> со ссылкой <a href="mailto:…">' },
        { name: 'На компьютере три работы в ряд', check: h => { const f = h.$$('section.works figure'); return f.length === 3 && h.sameRow(f) || 'работы не стоят в один ряд'; } },
        { at: 360, name: 'На телефоне работы друг под другом и нет прокрутки', check: h => {
          const f = h.$$('section.works figure'); if (f.length !== 3) return 'нужно три figure';
          if (h.overflow()) return 'есть горизонтальная прокрутка: max-width: 100% у картинок';
          return f[1].getBoundingClientRect().top >= f[0].getBoundingClientRect().bottom - 1 || 'на телефоне работы должны стоять столбиком';
        } }
      ]
    },
    {
      id: 'k3303', lesson: 'mdk-33', module: 'mdk4', mech: 'fix',
      title: 'Пять критериев юзабилити', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Одногруппник сделал шпаргалку по юзабилити, но разметил её как попало: жирный текст через b, переносы через br, всё в div. Экранный диктор прочитает это сплошной кашей.',
      goal: 'Переделайте шпаргалку в список определений: один dl, в нём пять пар dt + dd. В dt — название критерия (Обучаемость, Эффективность, Запоминаемость, Ошибки, Удовлетворённость — в этом порядке), в dd — его объяснение. Теги b, br и div не используйте. Заголовок h1 оставьте.',
      hints: [
        'Список определений: <dl><dt>Термин</dt><dd>Объяснение</dd>…</dl>. Его проходили на занятии 5.',
        'Каждый div превращается в пару: <b>Обучаемость</b> → <dt>Обучаемость</dt>, текст после <br> → <dd>…</dd>.',
        'Жирность dt уже задана в CSS, поэтому тег b больше не нужен.'
      ],
      html: `<h1>Юзабилити по Якобу Нильсену</h1>
<div><b>Обучаемость</b><br>Насколько легко новичку сделать простое дело с первого раза.</div>
<div><b>Эффективность</b><br>Как быстро опытный пользователь выполняет задачу.</div>
<div><b>Запоминаемость</b><br>Легко ли вспомнить, как пользоваться сайтом, после перерыва.</div>
<div><b>Ошибки</b><br>Сколько ошибок делают люди, насколько они серьёзны и легко ли их исправить.</div>
<div><b>Удовлетворённость</b><br>Приятно ли пользоваться сайтом.</div>`,
      css: `${BASE}
dt { margin-top: 16px; font-weight: bold; color: #3b2a7a; }
dd { margin: 4px 0 0 24px; line-height: 1.5; }`,
      tests: [
        { name: 'Есть один список dl', check: h => h.count('dl') === 1 || `списков dl: ${h.count('dl')}` },
        { name: 'Пять терминов dt по порядку', check: h => { const t = h.$$('dl dt').map(e => e.textContent.trim()); return t.join('|') === CRITERIA.join('|') || `сейчас: ${t.join(', ') || 'нет dt'}`; } },
        { name: 'После каждого dt идёт dd с объяснением', check: h => { const t = h.$$('dl dt'); return t.length === 5 && t.every(e => e.nextElementSibling?.tagName === 'DD' && e.nextElementSibling.textContent.trim().length > 10) || 'за каждым dt должен идти dd с текстом'; } },
        { name: 'Нет тегов b, br и div', check: h => { const n = h.count('b, br, div'); return !n || `осталось тегов b/br/div: ${n}`; } },
        { name: 'Заголовок h1 на месте', check: h => h.text('h1') === 'Юзабилити по Якобу Нильсену' || 'верните h1' }
      ]
    }
  );
})();
/* ---- content/tasks/k34.js ---- */
/* Занятие 34. Этапы разработки сайта. Техническое задание */
(() => {
  const { BASE } = window.COURSE_KIT;
  const STAGES = ['Бриф и анализ', 'Техническое задание', 'Прототип', 'Дизайн', 'Вёрстка', 'Программирование', 'Тестирование', 'Запуск', 'Поддержка'];
  const PARTS = ['Цель сайта', 'Целевая аудитория', 'Конкуренты', 'Структура', 'Требования к дизайну', 'Адаптивность', 'Контент'];
  const part = (h, name) => h.$$('section').find(s => s.querySelector('h2')?.textContent.trim() === name);

  window.COURSE_TASKS.push(
    {
      id: 'k3401', lesson: 'mdk-34', module: 'mdk4', mech: 'fix',
      title: 'Этапы по порядку', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Новичок в студии записал этапы разработки сайта, но перепутал их порядок и сделал маркированный список. А у этапов важен порядок: прототип не рисуют после вёрстки.',
      goal: 'Превратите список в нумерованный ol и расставьте девять этапов по порядку: Бриф и анализ, Техническое задание, Прототип, Дизайн, Вёрстка, Программирование, Тестирование, Запуск, Поддержка. Каждый пункт сохраните целиком: название в strong и описание после него. Маркированного списка ul на странице остаться не должно.',
      hints: [
        'Замените <ul> на <ol> и </ul> на </ol>: номера браузер расставит сам.',
        'Переставляйте пункты li целиком, вместе с описанием. Удобно вырезать строку (Ctrl+X) и вставить на нужное место (Ctrl+V).',
        'Порядок: сначала понять задачу (бриф, ТЗ), потом нарисовать (прототип, дизайн), потом сделать (вёрстка, программирование), потом проверить и выпустить (тестирование, запуск), потом поддерживать.'
      ],
      html: `<h1>Как студия делает сайт</h1>
<ul class="stages">
  <li><strong>Вёрстка</strong> — переводим макет в HTML и CSS.</li>
  <li><strong>Бриф и анализ</strong> — расспрашиваем заказчика, изучаем аудиторию и конкурентов.</li>
  <li><strong>Запуск</strong> — переносим сайт на хостинг и подключаем домен.</li>
  <li><strong>Дизайн</strong> — рисуем макеты в цвете и собираем стайлгайд.</li>
  <li><strong>Техническое задание</strong> — записываем все требования к сайту в один документ.</li>
  <li><strong>Поддержка</strong> — обновляем тексты, делаем резервные копии, чиним ошибки.</li>
  <li><strong>Прототип</strong> — рисуем схемы страниц серыми блоками.</li>
  <li><strong>Тестирование</strong> — проверяем сайт в разных браузерах и на телефонах.</li>
  <li><strong>Программирование</strong> — добавляем JavaScript, формы, связь с сервером.</li>
</ul>`,
      css: `${BASE}
.stages { line-height: 1.6; }
.stages li { margin-bottom: 8px; }
.stages strong { color: #3b2a7a; }`,
      tests: [
        { name: 'Список нумерованный: ol, а не ul', check: h => h.count('ol') === 1 && h.count('ul') === 0 || 'нужен один <ol> и ни одного <ul>' },
        { name: 'В списке девять этапов', check: h => h.count('ol > li') === 9 || `пунктов: ${h.count('ol > li')}` },
        { name: 'Этапы стоят по порядку', check: h => {
          const got = h.$$('ol > li > strong').map(e => e.textContent.trim());
          const i = got.findIndex((s, k) => s !== STAGES[k]);
          return i < 0 && got.length === 9 || `на месте ${i + 1} ожидается «${STAGES[i]}», сейчас «${got[i] || 'ничего'}»`;
        } },
        { name: 'У каждого этапа сохранено описание', check: h => { const li = h.$$('ol > li'); return li.length === 9 && li.every(l => l.textContent.replace(l.querySelector('strong')?.textContent || '', '').trim().length > 10) || 'у какого-то пункта пропало описание после strong'; } }
      ]
    },
    {
      id: 'k3402', lesson: 'mdk-34', module: 'mdk4', mech: 'build',
      title: 'Кто делает сайт', level: 'Среднее', minutes: 20, points: 150,
      story: 'Заказчик спросил: «А кто у вас что делает и что я получу на каждом шаге?» Ответим ему понятной таблицей.',
      goal: 'Сделайте таблицу table с подписью caption. В шапке thead одна строка с тремя заголовками th scope="col": Этап, Кто отвечает, Результат. В теле tbody не меньше шести строк: первая ячейка строки — th scope="row" с названием этапа, ещё две — td с текстом. Оформление: border-collapse: collapse, рамки у ячеек, внутренние отступы ячеек от 8px, у заголовков шапки свой цвет фона.',
      hints: [
        'Каркас: <table><caption>…</caption><thead><tr><th scope="col">Этап</th>…</tr></thead><tbody>…</tbody></table>.',
        'Строка тела: <tr><th scope="row">Прототип</th><td>UX-дизайнер</td><td>Схемы страниц серыми блоками</td></tr>.',
        'CSS: table { border-collapse: collapse; } th, td { padding: 8px 12px; border: 1px solid #b9b9c9; text-align: left; } thead th { background: #ece8f8; }.'
      ],
      html: `<h1>Над сайтом работает команда</h1>
<!-- Таблица: этап — кто отвечает — что получится -->
`,
      css: `${BASE}
/* Оформите таблицу */
`,
      tests: [
        { name: 'Есть таблица с подписью caption', check: h => !!h.$('table caption')?.textContent.trim() || 'нет <caption> с текстом' },
        { name: 'В thead три заголовка th scope="col": Этап, Кто отвечает, Результат', check: h => { const t = h.$$('thead th[scope="col"]').map(e => e.textContent.trim()); return t.join('|') === 'Этап|Кто отвечает|Результат' || `сейчас: ${t.join(', ') || 'нет'}`; } },
        { name: 'В tbody не меньше шести строк', check: h => h.count('tbody tr') >= 6 || `строк: ${h.count('tbody tr')}` },
        { name: 'В каждой строке тела: th scope="row" и две td с текстом', check: h => { const r = h.$$('tbody tr'); return r.length > 0 && r.every(tr => { const c = [...tr.children]; return c.length === 3 && c[0].matches('th[scope="row"]') && c[0].textContent.trim() && c.slice(1).every(td => td.tagName === 'TD' && td.textContent.trim()); }) || 'строка должна быть: th scope="row" + td + td, всё с текстом'; } },
        { name: 'Рамки ячеек слиты: border-collapse: collapse', check: h => h.cs('table', 'border-collapse') === 'collapse' || 'нет border-collapse: collapse' },
        { name: 'У ячеек рамка и отступ от 8px', check: h => { const c = h.$('tbody td'); return !!c && h.px(c, 'border-top-width') >= 1 && h.cs(c, 'border-top-style') !== 'none' && h.px(c, 'padding-top') >= 8 && h.px(c, 'padding-left') >= 8 || 'нужны border и padding у th, td'; } },
        { name: 'У заголовков шапки свой фон', check: h => { const c = h.cs('thead th', 'background-color'); return !!c && c !== 'rgba(0, 0, 0, 0)' || 'задайте thead th { background: … }'; } }
      ]
    },
    {
      id: 'k3403', lesson: 'mdk-34', module: 'mdk4', mech: 'build',
      title: 'Бриф для дизайнера', level: 'Среднее', minutes: 25, points: 150,
      story: 'Кофейня «Зерно» у колледжа хочет сайт, где можно заказать кофе навынос к перемене. Перед дизайном соберём ТЗ глазами дизайнера — короткий документ, по которому потом будем рисовать.',
      goal: 'Под заголовком h1 сделайте оглавление nav из ссылок на разделы и семь разделов section, у каждого свой id и заголовок h2 — строго по порядку: Цель сайта, Целевая аудитория, Конкуренты, Структура, Требования к дизайну, Адаптивность, Контент. Ссылки оглавления ведут на id разделов (href="#…"). Каждый раздел не пустой. В «Целевой аудитории» — список ul минимум из двух групп, в «Структуре» — нумерованный список ol минимум из четырёх страниц, в «Требованиях к дизайну» — список ul минимум из трёх пунктов, в «Адаптивности» упомяните ширины 360 и 1440.',
      hints: [
        'Один раздел: <section id="goal"><h2>Цель сайта</h2><p>Заказать кофе навынос за минуту, без очереди.</p></section>.',
        'Оглавление: <nav><ul><li><a href="#goal">Цель сайта</a></li>…</ul></nav>. Значение после # совпадает с id раздела.',
        'id пишите латиницей без пробелов: goal, audience, rivals, structure, design, adaptive, content.',
        'Адаптивность: <ul><li>Телефон — 360px</li><li>Планшет — 768px</li><li>Компьютер — 1440px</li></ul>.'
      ],
      html: `<h1>Бриф: сайт кофейни «Зерно»</h1>
<!-- Оглавление nav и семь разделов section:
     Цель сайта, Целевая аудитория, Конкуренты, Структура,
     Требования к дизайну, Адаптивность, Контент -->
`,
      css: `${BASE}
nav ul { padding-left: 20px; }
section { margin-top: 24px; padding-top: 8px; border-top: 1px solid #d6d2e6; }
h2 { color: #3b2a7a; }`,
      tests: [
        { name: 'Семь разделов с заголовками h2 по порядку', check: h => {
          const got = h.$$('section > h2').map(e => e.textContent.trim());
          const i = PARTS.findIndex((p, k) => got[k] !== p);
          return i < 0 && got.length === 7 || `раздел ${i + 1}: ожидается «${PARTS[i] || '—'}», сейчас «${got[i] || 'нет'}»`;
        } },
        { name: 'У каждого раздела есть id', check: h => { const s = h.$$('section'); return s.length >= 7 && s.every(x => x.id) || 'у какого-то section нет id'; } },
        { name: 'Оглавление nav: семь ссылок на разделы', check: h => {
          const a = h.$$('nav a[href^="#"]');
          if (a.length !== 7) return `ссылок в nav: ${a.length}`;
          const bad = a.find(x => { const id = x.getAttribute('href').slice(1); return !id || !h.doc.getElementById(id) || h.doc.getElementById(id).tagName !== 'SECTION'; });
          return !bad || `ссылка ${bad.getAttribute('href')} никуда не ведёт`;
        } },
        { name: 'Ни один раздел не пустой', check: h => { const s = h.$$('section'); const e = s.find(x => x.textContent.replace(x.querySelector('h2')?.textContent || '', '').trim().length < 15); return s.length >= 7 && !e || `раздел «${e?.querySelector('h2')?.textContent.trim() || '?'}» почти пустой`; } },
        { name: 'Аудитория — ul от 2 пунктов, структура — ol от 4, дизайн — ul от 3', check: h => {
          const n = (name, sel) => part(h, name)?.querySelectorAll(sel).length || 0;
          if (n('Целевая аудитория', 'ul > li') < 2) return 'в «Целевой аудитории» нужен ul минимум из двух li';
          if (n('Структура', 'ol > li') < 4) return 'в «Структуре» нужен ol минимум из четырёх li';
          return n('Требования к дизайну', 'ul > li') >= 3 || 'в «Требованиях к дизайну» нужен ul минимум из трёх li';
        } },
        { name: 'В «Адаптивности» есть ширины 360 и 1440', check: h => { const t = part(h, 'Адаптивность')?.textContent || ''; return /360/.test(t) && /1440/.test(t) || 'упомяните 360 и 1440'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k35.js ---- */
/* Занятие 35. Файловая структура сайта. Два типа графики. Имена файлов */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Пункт дерева по тексту его code: <li><code>css/</code> …</li>
  const node = (h, name) => h.$$('.tree li').find(li => li.querySelector(':scope > code')?.textContent.trim() === name);
  const kids = li => li ? [...li.querySelectorAll(':scope > ul > li > code')].map(c => c.textContent.trim()) : [];
  const lacks = (h, folder, need) => { const li = node(h, folder); if (!li) return `нет папки ${folder}`; const k = kids(li); const miss = need.filter(n => !k.includes(n)); return miss.length ? `в ${folder} нет: ${miss.join(', ')}` : ''; };
  const GOOD = /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$/;
  const RASTER = [/капучино/i, /зал/i, /скриншот/i, /з[её]рен/i];
  const VECTOR = [/логотип/i, /корзин/i, /наверх/i];
  const section = (h, title) => h.$$('section').find(s => s.querySelector('h2')?.textContent.trim() === title);

  window.COURSE_TASKS.push(
    {
      id: 'k3501', lesson: 'mdk-35', module: 'mdk4', mech: 'build',
      title: 'Дерево папок сайта', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Перед вёрсткой сайта кофейни договоримся с командой, где что лежит. Нарисуем структуру папок прямо на странице — вложенными списками, как в проводнике.',
      goal: 'Сделайте список ul с классом tree. В нём один пункт — корневая папка cafe-site/. Внутри неё (вложенным ul): файлы index.html, menu.html, contacts.html и папки css/, js/, img/, fonts/. В css/ лежит style.css, в js/ — script.js, в fonts/ — roboto.woff2, в img/ — logo.svg, hero.jpg и папка icons/, а в icons/ — cart.svg. Каждое имя файла или папки оберните в code, имена папок заканчиваются на /, а у каждой папки внутри свой вложенный ul.',
      hints: [
        'Пункт-папка: <li><code>css/</code><ul><li><code>style.css</code></li></ul></li>. Вложенный ul стоит внутри li папки.',
        'Корень: <ul class="tree"><li><code>cafe-site/</code><ul> … всё содержимое сайта … </ul></li></ul>.',
        'Папка icons/ лежит внутри img/, поэтому её li — внутри ul папки img/, рядом с logo.svg и hero.jpg.'
      ],
      html: `<h1>Файлы сайта кофейни «Зерно»</h1>
<!-- Дерево: ul.tree → cafe-site/ → файлы и папки -->
`,
      css: `${BASE}
.tree, .tree ul { list-style: none; margin: 0; padding-left: 24px; }
.tree { padding-left: 0; }
.tree ul { border-left: 2px solid #c9c2e0; }
.tree li { margin: 4px 0; }
.tree code { font-size: 16px; color: #3b2a7a; }`,
      tests: [
        { name: 'В ul.tree один корневой пункт cafe-site/', check: h => { const top = h.$$('ul.tree > li'); return top.length === 1 && top[0].querySelector(':scope > code')?.textContent.trim() === 'cafe-site/' || 'в ul.tree должен быть один li с <code>cafe-site/</code>'; } },
        { name: 'В корне три HTML-файла и папки css/, js/, img/, fonts/', check: h => lacks(h, 'cafe-site/', ['index.html', 'menu.html', 'contacts.html', 'css/', 'js/', 'img/', 'fonts/']) || true },
        { name: 'style.css в css/, script.js в js/, roboto.woff2 в fonts/', check: h => lacks(h, 'css/', ['style.css']) || lacks(h, 'js/', ['script.js']) || lacks(h, 'fonts/', ['roboto.woff2']) || true },
        { name: 'В img/ — logo.svg, hero.jpg и icons/ с cart.svg внутри', check: h => lacks(h, 'img/', ['logo.svg', 'hero.jpg', 'icons/']) || lacks(h, 'icons/', ['cart.svg']) || true },
        { name: 'Имена папок заканчиваются на /, и у каждой папки есть вложенный ul', check: h => {
          const codes = h.$$('.tree li > code');
          if (!codes.length) return 'нет имён в code';
          const bad = codes.find(c => { const t = c.textContent.trim(), sub = c.parentElement.querySelector(':scope > ul'); return t.endsWith('/') ? !sub : !/\.[a-z0-9]+$/.test(t) || !!sub; });
          return !bad || `проверьте «${bad.textContent.trim()}»: у папки — / и вложенный ul, у файла — расширение`;
        } }
      ]
    },
    {
      id: 'k3502', lesson: 'mdk-35', module: 'mdk4', mech: 'fix',
      title: 'Переименуйте файлы', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Заказчик прислал файлы для сайта с именами «как получилось». На сервере такие имена ломают ссылки: пробелы, русские буквы, заглавные. Составим таблицу переименования.',
      goal: 'Во второй столбец таблицы («Стало») в каждую строку впишите новое имя файла внутри тега code. Правила: только латинские буквы в нижнем регистре, цифры и дефис между словами, без пробелов, подчёркиваний и скобок; расширение то же, что было, но строчными буквами. Главная страница должна называться index.html. Все новые имена разные.',
      hints: [
        'Ячейка выглядит так: <td><code>style.css</code></td>.',
        'Русские слова переводим или пишем латиницей: «Фото кафе» → cafe-photo или foto-kafe. Пробелы и подчёркивания заменяем дефисом.',
        'Расширение тоже строчными: .JPG → .jpg, .PNG → .png, .HTML → .html.'
      ],
      html: `<h1>Переименование файлов</h1>
<table>
  <thead>
    <tr><th scope="col">Было</th><th scope="col">Стало</th></tr>
  </thead>
  <tbody>
    <tr><td>Главная Страница.HTML</td><td></td></tr>
    <tr><td>Style.CSS</td><td></td></tr>
    <tr><td>мой скрипт.js</td><td></td></tr>
    <tr><td>Фото_кафе (1).JPG</td><td></td></tr>
    <tr><td>Логотип Зерно.svg</td><td></td></tr>
    <tr><td>Баннер Весна 2025.PNG</td><td></td></tr>
  </tbody>
</table>`,
      css: `${BASE}
table { border-collapse: collapse; }
th, td { padding: 8px 12px; border: 1px solid #b9b9c9; text-align: left; }
thead th { background: #ece8f8; }`,
      tests: [
        { name: 'В каждой строке во втором столбце есть code с именем', check: h => { const r = h.$$('tbody tr'); return r.length === 6 && r.every(tr => tr.children[1]?.querySelector('code')?.textContent.trim()) || 'заполните все ячейки «Стало» тегом code'; } },
        { name: 'Имена: латиница в нижнем регистре, цифры, дефис, без пробелов', check: h => { const bad = h.$$('tbody tr td:nth-child(2) code').map(c => c.textContent.trim()).find(n => !GOOD.test(n)); return h.count('tbody tr td:nth-child(2) code') === 6 && !bad || `неудачное имя: «${bad || 'пусто'}»`; } },
        { name: 'Расширение сохранено и написано строчными', check: h => { const r = h.$$('tbody tr'); const bad = r.find(tr => { const was = tr.children[0].textContent.trim().split('.').pop().toLowerCase(); const now = (tr.children[1]?.textContent.trim() || '').split('.').pop(); return was !== now; }); return r.length === 6 && !bad || `строка «${bad?.children[0].textContent.trim()}»: другое расширение`; } },
        { name: 'Главная страница называется index.html', check: h => h.$('tbody tr:first-child td:nth-child(2) code')?.textContent.trim() === 'index.html' || 'главная страница — index.html' },
        { name: 'Все новые имена разные', check: h => { const n = h.$$('tbody td:nth-child(2) code').map(c => c.textContent.trim()); return n.length === 6 && new Set(n).size === 6 || 'есть одинаковые имена'; } }
      ]
    },
    {
      id: 'k3503', lesson: 'mdk-35', module: 'mdk4', mech: 'build',
      title: 'Растр или вектор', level: 'Среднее', minutes: 20, points: 150,
      story: 'Дизайнер готовит графику для сайта кофейни и решает, в каком формате экспортировать каждую картинку из Figma. Разложим их по двум типам.',
      goal: 'Сделайте два раздела section: с заголовком h2 «Растровая графика» и с заголовком h2 «Векторная графика». В каждом — список ul. Разложите семь изображений: фотография капучино, фото зала кофейни, скриншот приложения, фоновая фотография зёрен, логотип кофейни, иконка корзины, стрелка «наверх». В каждом пункте после названия укажите формат в теге code: для растровых — jpg, png или webp, для векторных — svg. Разделы оберните в div с классом kinds: на компьютере разделы стоят рядом, на телефоне 360px — друг под другом без горизонтальной прокрутки.',
      hints: [
        'Фотографии и скриншоты — растр: из точек. Логотипы, иконки, стрелки — вектор: из линий и фигур.',
        'Пункт: <li>Фотография капучино — <code>webp</code></li>. Для скриншота с текстом подойдёт png.',
        'Рядом: .kinds { display: grid; gap: 24px; }, а в @media (min-width: 768px) — grid-template-columns: 1fr 1fr.'
      ],
      html: `<h1>Графика для сайта кофейни</h1>
<!-- div.kinds: два section — «Растровая графика» и «Векторная графика» -->
`,
      css: `${BASE}
/* Оформите блок .kinds: разделы рядом на компьютере */
`,
      tests: [
        { name: 'Есть разделы «Растровая графика» и «Векторная графика» со списками', check: h => { const r = section(h, 'Растровая графика'), v = section(h, 'Векторная графика'); return !!(r && v && r.querySelector('ul') && v.querySelector('ul')) || 'нужны два section с h2 и ul внутри'; } },
        { name: 'Фотографии и скриншот — в растровой графике', check: h => { const t = [...(section(h, 'Растровая графика')?.querySelectorAll('li') || [])].map(l => l.textContent); const miss = RASTER.filter(re => !t.some(x => re.test(x))); const wrong = VECTOR.filter(re => t.some(x => re.test(x))); return !miss.length && !wrong.length && t.length === 4 || 'в растровом списке должны быть ровно 4 пункта: два фото, скриншот, фон из зёрен'; } },
        { name: 'Логотип, иконка и стрелка — в векторной графике', check: h => { const t = [...(section(h, 'Векторная графика')?.querySelectorAll('li') || [])].map(l => l.textContent); const miss = VECTOR.filter(re => !t.some(x => re.test(x))); return !miss.length && t.length === 3 || 'в векторном списке должны быть ровно 3 пункта: логотип, иконка, стрелка'; } },
        { name: 'У каждого пункта формат в code: растр — jpg/png/webp, вектор — svg', check: h => {
          const r = [...(section(h, 'Растровая графика')?.querySelectorAll('li') || [])], v = [...(section(h, 'Векторная графика')?.querySelectorAll('li') || [])];
          if (!r.length || !v.length) return 'списков нет';
          const fmt = li => (li.querySelector('code')?.textContent || '').trim().toLowerCase().replace(/^\./, '');
          const br = r.find(li => !/^(jpe?g|png|webp)$/.test(fmt(li))), bv = v.find(li => fmt(li) !== 'svg');
          return !br && !bv || `проверьте формат у «${(br || bv).textContent.trim().slice(0, 30)}»`;
        } },
        { name: 'На компьютере разделы стоят рядом', check: h => { const s = h.$$('.kinds > section'); return s.length === 2 && h.sameRow(s) || 'оба section внутри div.kinds должны стоять в один ряд'; } },
        { at: 360, name: 'На телефоне разделы друг под другом, без прокрутки', check: h => { const s = h.$$('.kinds > section'); if (s.length !== 2) return 'нужны два section в .kinds'; if (h.overflow()) return 'есть горизонтальная прокрутка'; return s[1].getBoundingClientRect().top >= s[0].getBoundingClientRect().bottom - 1 || 'на телефоне разделы должны стоять столбиком'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k36.js ---- */
/* Занятие 36. Концептуальное и логическое проектирование */
(() => {
  const { BASE } = window.COURSE_KIT;
  const after = (h, sel) => (h.$$(sel).map(e => h.win.getComputedStyle(e, '::after').content));
  const hasContent = c => c && c !== 'none' && c !== 'normal' && c !== '""';
  // Карта сайта: пункт — li со ссылкой a, подразделы — во вложенном ul
  const label = li => li?.querySelector(':scope > a')?.textContent.trim() || '';
  const sub = li => li ? [...li.querySelectorAll(':scope > ul > li')] : [];
  const top = h => h.$$('nav[aria-label="Карта сайта"] > ul > li');
  const sect = (h, name) => sub(top(h)[0]).find(li => label(li) === name);
  const FLOW = ['Главная', 'Выбор врача', 'Дата и время', 'Ваши данные', 'Проверка заявки', 'Подтверждение'];
  const listAfter = (h, title) => { const t = h.$$('.persona h3').find(e => e.textContent.trim() === title); return t?.nextElementSibling?.tagName === 'UL' ? t.nextElementSibling.querySelectorAll('li').length : 0; };

  window.COURSE_TASKS.push(
    {
      id: 'k3601', lesson: 'mdk-36', module: 'mdk4', mech: 'build',
      title: 'Карточка персоны', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Библиотека колледжа заказала сайт. Прежде чем рисовать, опишем типичного читателя — персону, — чтобы вся команда помнила, для кого делаем.',
      goal: 'Сделайте карточку article с классом persona. Внутри: картинка img/icon.svg с alt, заголовок h2 с именем и возрастом, абзац с классом role (кто это), заголовок h3 «Цели» и сразу после него список ul минимум из двух пунктов, заголовок h3 «Что мешает» и сразу после него ul минимум из двух пунктов, цитата blockquote — как персона говорит о проблеме своими словами. Карточка вместе с отступами и рамкой не шире 480px (box-sizing: border-box), с внутренним отступом от 16px и рамкой или фоном.',
      hints: [
        'Начало: <article class="persona"><img src="img/icon.svg" alt="Портрет Марины" width="64" height="64"><h2>Марина, 17 лет</h2><p class="role">Студентка первого курса</p> …',
        'Цели и боли: <h3>Цели</h3><ul><li>…</li><li>…</li></ul>, потом <h3>Что мешает</h3><ul>…</ul>. Список идёт сразу после своего h3.',
        'Цитата: <blockquote>«Пока найдёшь, есть ли учебник, перемена уже закончилась»</blockquote>.',
        'CSS: .persona { box-sizing: border-box; max-width: 480px; padding: 24px; border: 1px solid #c9c2e0; border-radius: 16px; }.'
      ],
      html: `<h1>Персона: для кого делаем сайт библиотеки</h1>
<!-- article.persona: img, h2, p.role, h3 «Цели» + ul, h3 «Что мешает» + ul, blockquote -->
`,
      css: `${BASE}
/* Оформите карточку .persona */
`,
      tests: [
        { name: 'Есть article.persona с h2 и абзацем p.role', check: h => !!(h.$('article.persona h2')?.textContent.trim() && h.$('article.persona p.role')?.textContent.trim()) || 'нужны article.persona, h2 с именем и p.role' },
        { name: 'В карточке картинка img/icon.svg с непустым alt', check: h => { const i = h.$('.persona img'); return !!i && i.getAttribute('src') === 'img/icon.svg' && (i.getAttribute('alt') || '').trim().length > 0 || 'нужна <img src="img/icon.svg" alt="…">'; } },
        { name: 'h3 «Цели» и сразу после него ul от двух пунктов', check: h => listAfter(h, 'Цели') >= 2 || 'после h3 «Цели» нужен ul минимум из двух li' },
        { name: 'h3 «Что мешает» и сразу после него ul от двух пунктов', check: h => listAfter(h, 'Что мешает') >= 2 || 'после h3 «Что мешает» нужен ul минимум из двух li' },
        { name: 'Есть цитата blockquote', check: h => (h.$('.persona blockquote')?.textContent.trim().length || 0) >= 10 || 'нужна цитата blockquote внутри карточки' },
        { name: 'Карточка не шире 480px, отступ от 16px, рамка или фон', check: h => {
          const r = h.rect('.persona'); if (!r) return 'нет .persona';
          if (r.width > 480.5) return `ширина ${Math.round(r.width)}px`;
          if (h.px('.persona', 'padding-left') < 16) return `отступ ${h.cs('.persona', 'padding-left')}`;
          const framed = h.cs('.persona', 'border-top-style') !== 'none' || h.cs('.persona', 'background-color') !== 'rgba(0, 0, 0, 0)';
          return framed || 'добавьте рамку border или фон background';
        } }
      ]
    },
    {
      id: 'k3602', lesson: 'mdk-36', module: 'mdk4', mech: 'build',
      title: 'Карта сайта библиотеки', level: 'Среднее', minutes: 20, points: 150,
      story: 'Карточная сортировка с читателями дала разделы будущего сайта библиотеки. Соберём из них карту сайта — схему всех страниц и их вложенности.',
      goal: 'Сделайте навигацию nav с атрибутом aria-label="Карта сайта", в ней список ul с одним пунктом «Главная». Внутри «Главной» — вложенный ul из четырёх разделов по порядку: Каталог, Электронная библиотека, Услуги, О библиотеке. У «Каталога» три подраздела: Учебники, Художественная литература, Периодика. У «Услуг» — два: Продление книг, Заказ книги. У «О библиотеке» — два: Правила, Контакты. У «Электронной библиотеки» подразделов нет. Каждый пункт — ссылка a (href="#" пока достаточно) с точным названием.',
      hints: [
        'Каркас: <nav aria-label="Карта сайта"><ul><li><a href="#">Главная</a><ul> … разделы … </ul></li></ul></nav>.',
        'Раздел с подразделами: <li><a href="#">Услуги</a><ul><li><a href="#">Продление книг</a></li><li><a href="#">Заказ книги</a></li></ul></li>.',
        'Вложенный ul всегда стоит внутри li своего раздела, после ссылки и перед </li>.'
      ],
      html: `<h1>Карта сайта библиотеки колледжа</h1>
<!-- Главная
       Каталог: Учебники, Художественная литература, Периодика
       Электронная библиотека
       Услуги: Продление книг, Заказ книги
       О библиотеке: Правила, Контакты -->
`,
      css: `${BASE}
nav ul { list-style: none; margin: 0; padding-left: 24px; border-left: 2px solid #c9c2e0; }
nav > ul { padding-left: 0; border-left: 0; }
nav li { margin: 8px 0; }
nav a { color: #3b2a7a; }`,
      tests: [
        { name: 'Есть nav aria-label="Карта сайта" с одним пунктом «Главная»', check: h => { const t = top(h); return t.length === 1 && label(t[0]) === 'Главная' || 'в nav[aria-label="Карта сайта"] > ul нужен один li со ссылкой «Главная»'; } },
        { name: 'В «Главной» четыре раздела по порядку', check: h => { const s = sub(top(h)[0]).map(label); return s.join('|') === 'Каталог|Электронная библиотека|Услуги|О библиотеке' || `сейчас: ${s.join(', ') || 'нет вложенного списка'}`; } },
        { name: 'В «Каталоге» три подраздела', check: h => { const s = sub(sect(h, 'Каталог')).map(label); return s.join('|') === 'Учебники|Художественная литература|Периодика' || `сейчас: ${s.join(', ') || 'нет'}`; } },
        { name: 'В «Услугах» и «О библиотеке» по два подраздела', check: h => {
          const u = sub(sect(h, 'Услуги')).map(label).join('|'), o = sub(sect(h, 'О библиотеке')).map(label).join('|');
          if (u !== 'Продление книг|Заказ книги') return 'в «Услугах»: Продление книг, Заказ книги';
          return o === 'Правила|Контакты' || 'в «О библиотеке»: Правила, Контакты';
        } },
        { name: 'У «Электронной библиотеки» нет подразделов', check: h => { const e = sect(h, 'Электронная библиотека'); return !!e && !e.querySelector('ul') || 'у этого раздела не должно быть вложенного списка'; } },
        { name: 'Каждый пункт карты — ссылка a с href', check: h => { const li = h.$$('nav[aria-label="Карта сайта"] li'); return li.length === 12 && li.every(x => x.querySelector(':scope > a[href]')) || `пунктов: ${li.length} из 12, у каждого должна быть ссылка`; } }
      ]
    },
    {
      id: 'k3603', lesson: 'mdk-36', module: 'mdk4', mech: 'build',
      title: 'User flow: запись к врачу', level: 'Среднее', minutes: 20, points: 150,
      story: 'В поликлинике хотят онлайн-запись. Нарисуем user flow — путь человека по экранам от главной до подтверждения записи.',
      goal: 'Сделайте нумерованный список ol с классом flow из шести шагов по порядку: Главная, Выбор врача, Дата и время, Ваши данные, Проверка заявки, Подтверждение. В каждом пункте li — название экрана в strong и абзац p с действием человека на этом экране. Оформление: шаги стоят карточками в ряд с переносом (display: flex, flex-wrap: wrap, gap от 16px), у каждой карточки рамка и отступ от 12px. Между шагами — стрелка: у всех пунктов, кроме последнего, есть псевдоэлемент ::after со стрелкой.',
      hints: [
        'Шаг: <li><strong>Выбор врача</strong><p>Выбирает терапевта из списка</p></li>.',
        'Ряд с переносом: .flow { display: flex; flex-wrap: wrap; gap: 16px; list-style: none; padding: 0; }.',
        'Стрелка: .flow li:not(:last-child)::after { content: "→"; }. Знак :not(:last-child) значит «все, кроме последнего».',
        'Чтобы стрелка стояла справа от карточки: .flow li { position: relative; } и у ::after — position: absolute; right: -14px; top: 40%.'
      ],
      html: `<h1>Онлайн-запись к врачу: путь пользователя</h1>
<!-- ol.flow: шесть шагов, в каждом strong и p -->
`,
      css: `${BASE}
/* Оформите .flow: карточки в ряд, стрелки между ними */
`,
      tests: [
        { name: 'Список ol.flow из шести шагов', check: h => h.count('ol.flow > li') === 6 || `шагов: ${h.count('ol.flow > li')}` },
        { name: 'Экраны в strong идут по порядку', check: h => { const s = h.$$('ol.flow > li > strong').map(e => e.textContent.trim()); const i = FLOW.findIndex((x, k) => s[k] !== x); return i < 0 || `шаг ${i + 1}: ожидается «${FLOW[i]}», сейчас «${s[i] || 'нет'}»`; } },
        { name: 'В каждом шаге есть абзац с действием', check: h => { const li = h.$$('ol.flow > li'); return li.length === 6 && li.every(x => (x.querySelector('p')?.textContent.trim().length || 0) >= 5) || 'в каждом li нужен p с действием'; } },
        { name: 'Шаги в ряд с переносом, промежуток от 16px', check: h => h.cs('.flow', 'display') === 'flex' && h.cs('.flow', 'flex-wrap') === 'wrap' && h.px('.flow', 'column-gap') >= 16 || 'нужны display: flex, flex-wrap: wrap и gap от 16px' },
        { name: 'У карточек шагов рамка и отступ от 12px', check: h => { const li = h.$$('.flow > li'); return li.length > 0 && li.every(x => h.cs(x, 'border-top-style') !== 'none' && h.px(x, 'padding-left') >= 12) || 'у .flow li нужны border и padding'; } },
        { name: 'Стрелки ::after у всех шагов, кроме последнего', check: h => { const c = after(h, '.flow > li'); if (c.length !== 6) return 'нет шагов'; if (!c.slice(0, 5).every(hasContent)) return 'у какого-то шага нет ::after с content'; return !hasContent(c[5]) || 'у последнего шага стрелки быть не должно'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k37.js ---- */
/* Занятие 37. Физическое проектирование: макет и модульная сетка */
(() => {
  const { BASE } = window.COURSE_KIT;
  const parse = s => { const m = (s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] }; };
  const grey = c => !c || c.a === 0 || (c.r === c.g && c.g === c.b);
  const ownGrey = (h, el) => { const c = parse(h.cs(el, 'background-color')); return !!c && c.a > 0 && grey(c) && c.r < 255; };
  // Сетка: ширина колонки по ширине контейнера, числу колонок и гаттеру
  const inner = (h, sel) => h.rect(sel).width - h.px(sel, 'padding-left') - h.px(sel, 'padding-right');
  const span = (h, n) => { const g = h.px('.page', 'column-gap'), cols = h.cs('.page', 'grid-template-columns').split(' ').filter(Boolean).length; const c = (inner(h, '.page') - (cols - 1) * g) / cols; return n * c + (n - 1) * g; };
  const near = (a, b) => Math.abs(a - b) <= 1.5;
  const tracks = h => h.cs('.page', 'grid-template-columns').split(' ').filter(Boolean);
  const SPACING = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'row-gap', 'column-gap'];
  const offGrid = h => {
    for (const r of h.rules) for (const p of SPACING) {
      const v = r.style.getPropertyValue(p).trim();
      if (!v || v === 'auto' || v === '0' || v === 'normal') continue;
      const m = v.match(/^(-?\d+(?:\.\d+)?)px$/);
      if (!m) return `${r.selector} { ${p}: ${v} } — пишите отступы в px`;
      if (+m[1] % 8) return `${r.selector} { ${p}: ${v} } — не кратно 8`;
    }
    return true;
  };
  const GRID_HTML = `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <aside class="block side">Боковая колонка</aside>
  <section class="block content">Основной текст</section>
  <footer class="block footer">Подвал</footer>
</div>`;

  window.COURSE_TASKS.push(
    {
      id: 'k3701', lesson: 'mdk-37', module: 'mdk4', mech: 'build',
      title: 'Wireframe главной страницы', level: 'Среднее', minutes: 20, points: 150,
      story: 'Перед макетом в цвете покажем заказчику — секции «Шахматы» при колледже — прототип главной страницы серыми блоками. Никакого цвета: обсуждаем только, что где стоит.',
      goal: 'Сверстайте wireframe с правильной семантикой. 1) header: блок с классом logo с текстом «Логотип» и навигация nav минимум из трёх ссылок — в один ряд. 2) main: section с классом hero (заголовок h1, абзац p и ссылка-кнопка с классом button) и section с классом features (заголовок h2 и три article в ряд, в каждом h3 и p). 3) footer с текстом. У header, .hero, у каждого article и у footer свой серый фон (не белый). На всей странице только оттенки серого: и у текста, и у фонов, и у ссылок — никаких синих ссылок по умолчанию.',
      hints: [
        'Серый — это цвет, где все три канала одинаковые: #eeeeee, #d9d9d9, #555555, #222222.',
        'Ссылки по умолчанию синие. Перекрасьте их: a { color: #222222; }. Кнопке задайте тёмно-серый фон и белый текст.',
        'В ряд: header { display: flex; justify-content: space-between; align-items: center; } и nav { display: flex; gap: 16px; }.',
        'Три карточки: .features-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } — оберните article в div с этим классом.'
      ],
      html: `<!-- header: .logo и nav
     main: section.hero (h1, p, a.button) и section.features (h2 и три article)
     footer -->
`,
      css: `${BASE}
/* Wireframe: только оттенки серого.
   Палитра: #222222 текст, #555555 кнопка, #d9d9d9 блоки, #eeeeee фон секций */
`,
      tests: [
        { name: 'В header есть .logo и nav минимум из трёх ссылок', check: h => !!h.$('header .logo')?.textContent.trim() && h.count('header nav a[href]') >= 3 || 'нужны header, внутри .logo и nav с тремя ссылками' },
        { name: 'В main есть section.hero с h1, p и a.button', check: h => !!(h.$('main section.hero h1') && h.$('main section.hero p') && h.$('main section.hero a.button')?.textContent.trim()) || 'в main > section.hero нужны h1, p и a.button' },
        { name: 'В section.features есть h2 и три article с h3 и p', check: h => { const a = h.$$('main section.features article'); return !!h.$('section.features h2') && a.length === 3 && a.every(x => x.querySelector('h3') && x.querySelector('p')) || `article в .features: ${a.length}, в каждом нужны h3 и p`; } },
        { name: 'Есть footer с текстом', check: h => !!h.$('footer')?.textContent.trim() || 'нет footer' },
        { name: 'У header, .hero, каждого article и footer свой серый фон', check: h => { const els = ['header', '.hero', 'footer'].map(s => h.$(s)).concat(h.$$('.features article')); const bad = els.find(e => !e || !ownGrey(h, e)); return !bad || `нет серого фона у ${bad ? bad.tagName.toLowerCase() + (bad.className ? '.' + bad.className : '') : 'блока'}`; } },
        { name: 'Только оттенки серого — ни одного цветного текста или фона', check: h => {
          for (const e of h.$$('body, body *')) {
            for (const p of ['color', 'background-color']) if (!grey(parse(h.cs(e, p)))) return `<${e.tagName.toLowerCase()}> ${p}: ${h.cs(e, p)}`;
          }
          return true;
        } },
        { name: 'Логотип и меню в одном ряду, три карточки в ряд', check: h => {
          if (!h.$('header .logo') || !h.$('header nav')) return 'нет .logo или nav';
          const lt = h.rect('header .logo'), nt = h.rect('header nav');
          if (!(nt.left > lt.right && nt.top < lt.bottom && nt.bottom > lt.top)) return 'логотип и меню должны стоять в один ряд';
          const a = h.$$('.features article'); return a.length === 3 && h.sameRow(a) || 'карточки не в один ряд';
        } }
      ]
    },
    {
      id: 'k3702', lesson: 'mdk-37', module: 'mdk4', mech: 'build',
      title: 'Модульная сетка 12 колонок', level: 'Сложное', minutes: 25, points: 200,
      story: 'Дизайнер нарисовал макет по сетке из 12 колонок с гаттерами 24px и полями 24px. Перенесём эту сетку в CSS Grid так, чтобы блоки встали ровно по колонкам.',
      goal: 'Сделайте .page сеткой из 12 одинаковых колонок (grid-template-columns: repeat(12, 1fr)) с гаттером column-gap 24px. Контейнер: max-width 1200px, по центру (margin: 0 auto), поля слева и справа — padding 24px. Расставьте блоки через grid-column: шапка, первый экран и подвал занимают все 12 колонок; три карточки — по 4 колонки и стоят в один ряд; боковая колонка — 3 колонки, основной текст — 9, рядом друг с другом.',
      hints: [
        'Сетка: .page { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 24px; }.',
        'Контейнер с полями: max-width: 1200px; margin: 0 auto; padding: 0 24px.',
        'Сколько колонок занять: .card { grid-column: span 4; }, .side { grid-column: span 3; }, .content { grid-column: span 9; }.',
        'Во всю ширину: .header, .hero, .footer { grid-column: 1 / -1; } — от первой линии сетки до последней.'
      ],
      html: GRID_HTML,
      css: `${BASE}
/* Сетка: 12 колонок, гаттер 24px, поля 24px */

.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.hero { min-height: 160px; }
.card { min-height: 120px; }
.content { min-height: 200px; }`,
      tests: [
        { name: '.page — сетка из 12 одинаковых колонок', check: h => { if (h.cs('.page', 'display') !== 'grid') return 'у .page нет display: grid'; const t = tracks(h).map(parseFloat); return t.length === 12 && Math.max(...t) - Math.min(...t) < 0.5 || `колонок: ${t.length}`; } },
        { name: 'Гаттер 24px', check: h => h.px('.page', 'column-gap') === 24 || `column-gap: ${h.cs('.page', 'column-gap')}` },
        { name: 'Контейнер: max-width 1200px, поля по 24px', check: h => h.cs('.page', 'max-width') === '1200px' && h.px('.page', 'padding-left') === 24 && h.px('.page', 'padding-right') === 24 || 'нужны max-width: 1200px и padding: 0 24px' },
        { name: 'Шапка, первый экран и подвал — во все 12 колонок', check: h => { const w = inner(h, '.page'); const bad = ['.header', '.hero', '.footer'].find(s => !near(h.rect(s).width, w)); return !bad || `${bad} занимает не всю ширину сетки`; } },
        { name: 'Три карточки по 4 колонки в один ряд', check: h => { const c = h.$$('.card'); if (!h.sameRow(c)) return 'карточки не в один ряд'; const w = span(h, 4); return c.every(x => near(x.getBoundingClientRect().width, w)) || `ширина карточки ${Math.round(c[0].getBoundingClientRect().width)}px, а 4 колонки — ${Math.round(w)}px`; } },
        { name: 'Боковая колонка — 3 колонки, основной текст — 9, рядом', check: h => {
          if (!h.sameRow(['.side', '.content'])) return 'боковая колонка и текст должны стоять рядом';
          if (!near(h.rect('.side').width, span(h, 3))) return `.side: ${Math.round(h.rect('.side').width)}px, а 3 колонки — ${Math.round(span(h, 3))}px`;
          return near(h.rect('.content').width, span(h, 9)) || `.content: ${Math.round(h.rect('.content').width)}px, а 9 колонок — ${Math.round(span(h, 9))}px`;
        } }
      ]
    },
    {
      id: 'k3703', lesson: 'mdk-37', module: 'mdk4', mech: 'adaptive',
      title: 'Шаг 8 и сетка на телефоне', level: 'Среднее', minutes: 15, points: 150,
      story: 'Верстальщик перенёс сетку, но отступы взял «на глаз»: 13, 15, 20, 30 пикселей. А на телефоне карточки по 4 колонки из 12 превратились в узкие полоски. Приведём всё к системе.',
      goal: 'Исправьте CSS. Все отступы на странице — margin, padding и gap — кратны 8 (0, 8, 16, 24, 32…). На компьютере сетка остаётся 12-колоночной, карточки по-прежнему стоят по три в ряд. На телефоне 360px сетка из 4 колонок, все блоки во всю ширину, карточки стоят друг под другом, горизонтальной прокрутки нет.',
      hints: [
        'Пройдитесь по каждому числу в px: 13 → 16, 15 → 16, 20 → 24, 30 → 32, 5 → 8, 10 → 8.',
        'Блоки во всю ширину при любом числе колонок: grid-column: 1 / -1. А вот span 12 в сетке из 4 колонок создаст лишние колонки и прокрутку.',
        'Mobile first: в .page — grid-template-columns: repeat(4, 1fr), у .card — grid-column: 1 / -1. В @media (min-width: 768px) — repeat(12, 1fr) и .card { grid-column: span 4; }.'
      ],
      html: `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <footer class="block footer">Подвал</footer>
</div>`,
      css: `${BASE}
.page {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  padding: 0 15px;
}
.block {
  padding: 13px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .footer { grid-column: span 12; }
.hero { min-height: 160px; padding: 30px; }
.card { grid-column: span 4; min-height: 120px; margin-bottom: 5px; }
.footer { margin-top: 10px; }`,
      tests: [
        { name: 'Все margin, padding и gap кратны 8', check: offGrid },
        { name: 'На компьютере 12 колонок и три карточки в ряд', check: h => tracks(h).length === 12 && h.sameRow(h.$$('.card')) || `колонок: ${tracks(h).length}, карточки должны стоять в ряд` },
        { at: 360, name: 'На телефоне сетка из 4 колонок', check: h => tracks(h).length === 4 || `колонок на телефоне: ${tracks(h).length}` },
        { at: 360, name: 'На телефоне карточки друг под другом во всю ширину', check: h => {
          const c = h.$$('.card'), w = inner(h, '.page');
          if (c[1].getBoundingClientRect().top < c[0].getBoundingClientRect().bottom - 1) return 'карточки должны стоять столбиком';
          return c.every(x => near(x.getBoundingClientRect().width, w)) || 'карточки не во всю ширину сетки';
        } },
        { at: 360, name: 'На телефоне нет горизонтальной прокрутки', check: h => !h.overflow() || 'есть прокрутка: span 12 в сетке из 4 колонок добавляет лишние колонки' }
      ]
    }
  );
})();
/* ---- content/tasks/k38.js ---- */
/* Занятие 38. Цвет в дизайне: цветовой круг и гармонии */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // значение CSS-переменной, объявленной в :root
  const cssVar = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  // CSS без комментариев — чтобы считать, сколько раз записан цвет
  const plain = h => h.css.replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();
  const times = (h, hex) => plain(h).split(hex.toLowerCase()).length - 1;
  const bg = (h, sel) => h.cs(sel, 'background-color');

  window.COURSE_TASKS.push(
    {
      id: 'k3801', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Палитра кофейни в переменных', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Кофейня «Зерно» заказала сайт. Дизайнер прислал палитру из четырёх цветов. Прежде чем верстать страницы, палитру записывают в CSS-переменные: тогда цвет меняется в одном месте, а не в сорока.',
      goal: 'В правиле :root уже объявлена переменная --color-bg. Добавьте ещё три: --color-surface: #e8d9c5, --color-text: #3b2a1e, --color-accent: #b5462a. Дальше пишите цвета только через var(): body — фон var(--color-bg) и цвет текста var(--color-text); каждый образец .swatch закрашен своим цветом (Фон, Карточки, Текст, Акцент); кнопка .btn — фон var(--color-accent) и белый текст. Каждый hex-код палитры должен встречаться в CSS ровно один раз — в :root. Текст на тёмных образцах сделайте светлым, чтобы его можно было прочитать.',
      hints: [
        'Переменная объявляется внутри :root так: --color-surface: #e8d9c5; — с двумя дефисами в начале имени.',
        'Использование: background-color: var(--color-surface); Скобки и два дефиса обязательны. Правило body уже есть в первой строке CSS — меняйте его, а не пишите второе.',
        'На тёмном образце «Текст» поставьте color: var(--color-bg), на «Акценте» — color: #ffffff.',
        'Проверьте поиском (Ctrl+F) в CSS: каждый hex палитры должен найтись один раз.'
      ],
      html: `<h1>Палитра кофейни «Зерно»</h1>
<ul class="palette">
  <li class="swatch swatch--bg">Фон</li>
  <li class="swatch swatch--surface">Карточки</li>
  <li class="swatch swatch--text">Текст</li>
  <li class="swatch swatch--accent">Акцент</li>
</ul>
<button class="btn" type="button">Заказать кофе</button>`,
      css: `${BASE}
:root {
  --color-bg: #faf6f0;
  /* добавьте ещё три переменные палитры */
}
.palette {
  display: flex;
  gap: 16px;
  padding: 0;
  list-style: none;
}
.swatch {
  width: 120px;
  height: 120px;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
}`,
      tests: [
        { name: 'В :root объявлены четыре переменные палитры с нужными цветами', check: h => {
          const want = { '--color-bg': '#faf6f0', '--color-surface': '#e8d9c5', '--color-text': '#3b2a1e', '--color-accent': '#b5462a' };
          const bad = Object.keys(want).filter(k => cssVar(h, k) !== want[k]);
          return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Страница: фон и цвет текста из переменных', check: h => bg(h, 'body') === rgb('#faf6f0') && h.cs('body', 'color') === rgb('#3b2a1e') && /body\s*\{[^}]*var\(--color-bg\)[^}]*\}/.test(plain(h)) || 'у body фон var(--color-bg) и color var(--color-text)' },
        { name: 'Каждый образец закрашен своим цветом', check: h => {
          const pairs = [['.swatch--bg', '#faf6f0'], ['.swatch--surface', '#e8d9c5'], ['.swatch--text', '#3b2a1e'], ['.swatch--accent', '#b5462a']];
          const bad = pairs.filter(([s, c]) => bg(h, s) !== rgb(c)).map(([s]) => s);
          return !bad.length || `не закрашены: ${bad.join(', ')}`; } },
        { name: 'Кнопка: акцентный фон и белый текст', check: h => bg(h, '.btn') === rgb('#b5462a') && h.cs('.btn', 'color') === rgb('#ffffff') || 'фон .btn — var(--color-accent), color — #ffffff' },
        { name: 'Каждый цвет палитры записан в CSS один раз', check: h => {
          const many = ['#faf6f0', '#e8d9c5', '#3b2a1e', '#b5462a'].filter(c => times(h, c) !== 1);
          return !many.length || `встречается не один раз: ${many.join(', ')}`; } },
        { name: 'Подписи на тёмных образцах читаются (контраст 4,5:1)', check: h => ['.swatch--text', '.swatch--accent'].every(s => h.contrast(s) >= 4.5) || 'сделайте текст на тёмных образцах светлым' }
      ]
    },
    {
      id: 'k3802', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Правило 60-30-10 для фитнес-клуба', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Страница фитнес-клуба «Пульс» свёрстана, но вся чёрно-белая. Палитра уже лежит в переменных. Раскрасьте страницу по правилу 60-30-10, чтобы глаз сразу находил кнопку записи.',
      goal: 'Используйте переменные из :root. 60% — основной светлый цвет: фон body — var(--color-main). 30% — дополнительный: шапка header и подвал footer с фоном var(--color-second) и белым текстом (#ffffff), у карточек .card белый фон (#ffffff) и верхняя полоса border-top: 4px solid var(--color-second). 10% — акцент: им закрашена только кнопка .btn (фон var(--color-accent), текст тёмный #1a1a1a, чтобы контраст был не меньше 4,5:1). Больше нигде акцентный цвет не используйте: ни в тексте, ни в рамках, ни в фонах.',
      hints: [
        'Начните с body. Правило body уже есть в первой строке CSS — поменяйте в нём background на var(--color-main), второе правило body не создавайте.',
        'Шапка и подвал: одно правило на два селектора — header, footer { background-color: var(--color-second); color: #ffffff; }',
        'Карточка: background-color: #ffffff; border-top: 4px solid var(--color-second);',
        'Белый текст на оранжевой кнопке не проходит по контрасту — поэтому текст кнопки тёмный: color: #1a1a1a.'
      ],
      html: `<header class="header">
  <p class="logo">Пульс</p>
</header>
<main>
  <section class="hero">
    <h1>Фитнес-клуб у колледжа</h1>
    <p>Тренажёрный зал, йога и бассейн. Студентам — скидка 20%.</p>
    <a class="btn" href="#signup">Записаться на пробное</a>
  </section>
  <section class="cards">
    <h2>Направления</h2>
    <article class="card"><h3>Тренажёрный зал</h3><p>С тренером или самостоятельно.</p></article>
    <article class="card"><h3>Йога</h3><p>Утренние и вечерние группы.</p></article>
    <article class="card"><h3>Бассейн</h3><p>Дорожка 25 метров.</p></article>
  </section>
</main>
<footer class="footer">
  <p>Пульс · ул. Студенческая, 5</p>
</footer>`,
      css: `${BASE}
:root {
  --color-main: #f4f7f6;
  --color-second: #1f4e5f;
  --color-accent: #ff7a3d;
}
.header,
.footer {
  padding: 16px 24px;
}
.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
.hero,
.cards {
  padding: 24px;
}
.card {
  margin-bottom: 16px;
  padding: 16px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}`,
      tests: [
        { name: '60%: фон страницы — основной цвет', check: h => bg(h, 'body') === rgb('#f4f7f6') || 'у body фон var(--color-main)' },
        { name: '30%: шапка и подвал дополнительного цвета с белым текстом', check: h => ['header', 'footer'].every(s => bg(h, s) === rgb('#1f4e5f') && h.cs(s, 'color') === rgb('#ffffff')) || 'header и footer: фон var(--color-second), color #ffffff' },
        { name: 'Карточки белые с полосой 4px дополнительного цвета сверху', check: h => h.$$('.card').every(c => bg(h, c) === rgb('#ffffff') && h.cs(c, 'border-top-color') === rgb('#1f4e5f') && h.px(c, 'border-top-width') === 4 && h.cs(c, 'border-top-style') === 'solid') || 'у .card белый фон и border-top: 4px solid var(--color-second)' },
        { name: '10%: кнопка акцентного цвета с тёмным текстом', check: h => bg(h, '.btn') === rgb('#ff7a3d') && h.cs('.btn', 'color') === rgb('#1a1a1a') || 'у .btn фон var(--color-accent) и color #1a1a1a' },
        { name: 'Акцент используется только на кнопке', check: h => {
          const acc = rgb('#ff7a3d');
          const other = h.$$('body, body *').filter(e => !e.matches('.btn')).find(e => { const s = h.win.getComputedStyle(e); return [s.backgroundColor, s.color, s.borderTopColor, s.borderBottomColor, s.borderLeftColor].includes(acc); });
          return !other || `акцент найден у <${other.tagName.toLowerCase()}${other.className ? '.' + other.className : ''}>`; } }
      ]
    },
    {
      id: 'k3803', lesson: 'mdk-38', module: 'mdk4', mech: 'build',
      title: 'Разложите цвета по гармониям', level: 'Среднее', minutes: 20, points: 150,
      story: 'Дизайнер собрал девять цветов для трёх промо-баннеров и перемешал их. Нужно разложить цвета по трём гармониям, чтобы каждый баннер смотрелся цельно.',
      goal: 'В :root девять переменных --c1 … --c9. Закрасьте образцы .chip (свойство background-color, только через var()): в строке «Монохромная» — три оттенка одного цвета; в строке «Аналоговая» — три цвета, которые стоят рядом на цветовом круге; в строке «Комплементарная» — два оттенка одного цвета и один цвет с противоположной стороны круга, его поставьте последним, это акцент. Порядок в первых двух строках — любой. Не переписывайте hex-коды: каждый должен встречаться в CSS один раз.',
      hints: [
        'Сначала выпишите на бумагу девять цветов и подпишите, на что каждый похож: «фиолетовый тёмный», «жёлтый» и т. д. Можно временно закрасить ими образцы по порядку и посмотреть.',
        'Монохромная — три фиолетовых разной светлоты. Аналоговая — тёплые соседи по кругу: красный, оранжевый, жёлтый.',
        'Комплементарная — два зелёных и малиновый: зелёный и красный стоят на круге напротив друг друга.',
        'Пример правила: .mono-1 { background-color: var(--c4); }'
      ],
      html: `<h1>Гармонии для промо-баннеров</h1>
<section class="row">
  <h2>Монохромная</h2>
  <ul class="chips">
    <li class="chip mono-1"></li>
    <li class="chip mono-2"></li>
    <li class="chip mono-3"></li>
  </ul>
</section>
<section class="row">
  <h2>Аналоговая</h2>
  <ul class="chips">
    <li class="chip analog-1"></li>
    <li class="chip analog-2"></li>
    <li class="chip analog-3"></li>
  </ul>
</section>
<section class="row">
  <h2>Комплементарная</h2>
  <ul class="chips">
    <li class="chip compl-1"></li>
    <li class="chip compl-2"></li>
    <li class="chip compl-3"></li>
  </ul>
</section>`,
      css: `${BASE}
:root {
  --c1: #f2c14e;
  --c2: #2e8b57;
  --c3: #7e57c2;
  --c4: #d64545;
  --c5: #b9e4c9;
  --c6: #4a2c6d;
  --c7: #e8833a;
  --c8: #c2185b;
  --c9: #d1c4e9;
}
.chips {
  display: flex;
  gap: 8px;
  padding: 0;
  list-style: none;
}
.chip {
  width: 96px;
  height: 64px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
/* Закрасьте образцы ниже: .mono-1 { background-color: var(--c?); } */
`,
      tests: [
        { name: 'Монохромная: три оттенка фиолетового', check: h => {
          const got = ['.mono-1', '.mono-2', '.mono-3'].map(s => bg(h, s)).sort().join();
          return got === ['#4a2c6d', '#7e57c2', '#d1c4e9'].map(rgb).sort().join() || 'в первой строке должны быть три фиолетовых разной светлоты'; } },
        { name: 'Аналоговая: три соседа по кругу — красный, оранжевый, жёлтый', check: h => {
          const got = ['.analog-1', '.analog-2', '.analog-3'].map(s => bg(h, s)).sort().join();
          return got === ['#d64545', '#e8833a', '#f2c14e'].map(rgb).sort().join() || 'во второй строке нужны тёплые соседи по кругу'; } },
        { name: 'Комплементарная: два зелёных и противоположный им акцент последним', check: h => {
          const first = ['.compl-1', '.compl-2'].map(s => bg(h, s)).sort().join();
          if (first !== ['#2e8b57', '#b9e4c9'].map(rgb).sort().join()) return 'первые два образца — два оттенка зелёного';
          return bg(h, '.compl-3') === rgb('#c2185b') || 'последний образец — цвет напротив зелёного на круге'; } },
        { name: 'Цвета заданы через var(), hex-коды не переписаны', check: h => {
          const many = ['#f2c14e', '#2e8b57', '#7e57c2', '#d64545', '#b9e4c9', '#4a2c6d', '#e8833a', '#c2185b', '#d1c4e9'].filter(c => times(h, c) !== 1);
          return !many.length && (plain(h).match(/var\(--c\d\)/g) || []).length >= 9 || 'закрашивайте через var(--c1)…var(--c9), hex не копируйте'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k39.js ---- */
/* Занятие 39. Модели цвета и контраст */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  const close = (a, b) => { const x = parse(a), y = parse(b); return x.length >= 3 && y.length >= 3 && [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 2); };
  // HSL → «rgb(r, g, b)», как браузер отдаёт цвет
  const hsl = (H, S, L) => {
    S /= 100; L /= 100;
    const k = n => (n + H / 30) % 12, a = S * Math.min(L, 1 - L);
    const f = n => Math.round(255 * (L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  };
  // Цвет из правила с селектором re (например, .btn:hover): значение переводим в вычисленный цвет через временный элемент
  const ruleColor = (h, re, prop) => {
    const r = h.rules.find(x => re.test(x.selector)); if (!r) return '';
    const short = prop === 'background-color' ? 'background' : prop;
    const v = r.style.getPropertyValue(prop) || r.style.getPropertyValue(short); if (!v) return '';
    const t = h.doc.createElement('span'); h.doc.body.appendChild(t);
    t.style.setProperty(short, v);
    const out = h.win.getComputedStyle(t).getPropertyValue(prop); t.remove();
    return out;
  };
  const lum = s => { const [r, g, b] = parse(s).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const plain = h => h.css.replace(/\/\*[\s\S]*?\*\//g, '');

  window.COURSE_TASKS.push(
    {
      id: 'k3901', lesson: 'mdk-39', module: 'mdk4', mech: 'build',
      title: 'Кнопка и метка в HSL', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'В карточке читального зала цвета записаны в HEX, и никто не помнит, как получить «тот же синий, только темнее». Перепишите их в HSL: там светлота — отдельное число.',
      goal: 'Запишите цвета в формате HSL (в CSS должно быть не меньше четырёх hsl()). Кнопка .btn: фон hsl(210, 70%, 35%), текст белый. При наведении .btn:hover: тот же оттенок и насыщенность, но светлота 25% — hsl(210, 70%, 25%). Метка .badge: полупрозрачный фон того же цвета, что кнопка, с непрозрачностью 0.15 — hsl(210 70% 35% / 0.15), а текст метки — hsl(210, 70%, 25%).',
      hints: [
        'HSL читается так: hsl(оттенок, насыщенность, светлота). Оттенок — угол на цветовом круге от 0 до 360, синий около 210.',
        'Чтобы сделать цвет темнее, меняйте только третье число: 35% → 25%.',
        'Прозрачность в HSL пишется через косую черту: hsl(210 70% 35% / 0.15). Запятые в такой записи не ставят.',
        'Правило наведения: .btn:hover { background-color: hsl(210, 70%, 25%); }'
      ],
      html: `<article class="card">
  <span class="badge">Новинка</span>
  <h1>Читальный зал открыт до 20:00</h1>
  <p>Свободные места есть на втором этаже, у окна.</p>
  <button class="btn" type="button">Забронировать место</button>
</article>`,
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
  background-color: #dde6f0;
  color: #333333;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #2a6eb8;
  color: #ffffff;
}`,
      tests: [
        { name: 'Кнопка: фон hsl(210, 70%, 35%) и белый текст', check: h => close(h.cs('.btn', 'background-color'), hsl(210, 70, 35)) && h.cs('.btn', 'color') === rgb('#ffffff') || `сейчас фон ${h.cs('.btn', 'background-color')}` },
        { name: 'При наведении: тот же оттенок, светлота 25%', check: h => close(ruleColor(h, /\.btn:hover/, 'background-color'), hsl(210, 70, 25)) || 'нет правила .btn:hover с фоном hsl(210, 70%, 25%)' },
        { name: 'Метка: фон цвета кнопки с непрозрачностью 0.15', check: h => { const c = h.cs('.badge', 'background-color'), p = parse(c); return close(c, hsl(210, 70, 35)) && Math.abs(p[3] - 0.15) < 0.01 || `сейчас фон метки ${c}`; } },
        { name: 'Метка: текст hsl(210, 70%, 25%)', check: h => close(h.cs('.badge', 'color'), hsl(210, 70, 25)) || `сейчас цвет ${h.cs('.badge', 'color')}` },
        { name: 'Цвета записаны в HSL (не меньше четырёх hsl())', check: h => (plain(h).match(/hsla?\(/gi) || []).length >= 4 || 'пишите цвета как hsl(…)' }
      ]
    },
    {
      id: 'k3902', lesson: 'mdk-39', module: 'mdk4', mech: 'a11y',
      title: 'Почините контраст объявления', level: 'Среднее', minutes: 20, points: 150,
      story: 'Объявление о неделе открытых дверей сделано «стильно»: бледный текст, белые буквы на жёлтом. С телефона на улице его не прочитать, а человеку со слабым зрением — и в помещении.',
      goal: 'Поменяйте только цвета текста (свойство color), фоны оставьте как есть. Нужен контраст по WCAG AA: обычный текст — не меньше 4,5:1, крупный (24px и больше) — не меньше 3:1. Почините: дату .date, вводный абзац .lead, ссылку .link (она должна остаться синей — синий канал больше красного и зелёного), текст кнопки .btn, заголовок и текст в тёмном баннере .banner, примечание .note.',
      hints: [
        'Контраст можно посмотреть в инструментах разработчика: правый клик → «Просмотреть код», выбрать элемент, нажать на квадратик цвета в стилях — там будет строка Contrast ratio.',
        'Серый на белом читается, если он не светлее #767676. Возьмите, например, #595959.',
        'Белый на жёлтом не спасти — на жёлтой кнопке пишут тёмным: #1a1a1a.',
        'На тёмном фоне #2b2b2b текст должен быть светлым: #ffffff для заголовка, #d6d6d6 для абзаца. Ссылка: #0b5cad.'
      ],
      html: `<section class="notice">
  <h1>Неделя открытых дверей</h1>
  <p class="date">С 12 по 16 марта, библиотека колледжа</p>
  <p class="lead">Покажем, как найти книгу в каталоге, взять ноутбук и забронировать переговорную.</p>
  <p><a class="link" href="#program">Программа недели</a></p>
  <p><button class="btn" type="button">Записаться</button></p>
</section>
<section class="banner">
  <h2>Нужна помощь?</h2>
  <p class="banner__text">Спросите библиотекаря у стойки выдачи.</p>
</section>
<p class="note">Вход по студенческому билету.</p>`,
      css: `${BASE}
.notice {
  padding: 24px;
  background-color: #ffffff;
}
.date {
  color: #a0a0a0;
}
.lead {
  font-size: 18px;
  color: #8c8c8c;
}
.link {
  color: #6fa8dc;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f5c518;
  color: #ffffff;
}
.banner {
  padding: 24px;
  background-color: #2b2b2b;
}
.banner h2 {
  margin-top: 0;
  font-size: 24px;
  color: #666666;
}
.banner__text {
  color: #5a5a5a;
}
.note {
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #b0b0b0;
}`,
      tests: [
        { name: 'Фоны не изменились', check: h => [['.notice', '#ffffff'], ['.btn', '#f5c518'], ['.banner', '#2b2b2b'], ['.note', '#f0f0f0']].every(([s, c]) => h.cs(s, 'background-color') === rgb(c)) || 'меняйте только color, фоны оставьте' },
        { name: 'Дата и вводный абзац: контраст от 4,5:1', check: h => ['.date', '.lead'].every(s => h.contrast(s) >= 4.5) || `сейчас ${h.contrast('.date').toFixed(2)} и ${h.contrast('.lead').toFixed(2)}` },
        { name: 'Ссылка синяя и с контрастом от 4,5:1', check: h => { const [r, g, b] = parse(h.cs('.link', 'color')); return h.contrast('.link') >= 4.5 && b > r && b > g || `контраст ${h.contrast('.link').toFixed(2)}, ссылка должна остаться синей`; } },
        { name: 'Текст на жёлтой кнопке: контраст от 4,5:1', check: h => h.contrast('.btn') >= 4.5 || `сейчас ${h.contrast('.btn').toFixed(2)}:1` },
        { name: 'Тёмный баннер: заголовок от 3:1, текст от 4,5:1', check: h => h.contrast('.banner h2') >= 3 && h.contrast('.banner__text') >= 4.5 || `заголовок ${h.contrast('.banner h2').toFixed(2)}, текст ${h.contrast('.banner__text').toFixed(2)}` },
        { name: 'Примечание на сером фоне: контраст от 4,5:1', check: h => h.contrast('.note') >= 4.5 || `сейчас ${h.contrast('.note').toFixed(2)}:1` }
      ]
    },
    {
      id: 'k3903', lesson: 'mdk-39', module: 'mdk4', mech: 'build',
      title: 'Тёмная тема на переменных', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт библиотеки просят сделать с тёмной темой: вечером в читальном зале белый экран слепит. Компоненты уже написаны на переменных, осталось подобрать значения для тёмной темы.',
      goal: 'Допишите правило .theme--dark: объявите в нём переменные --text, --muted, --accent и --on-accent (фон --bg уже есть). Требования: фон тёмный, но не чисто чёрный (#121417 уже подходит); заголовок, обычный и приглушённый текст, ссылка и текст кнопки в тёмной теме имеют контраст не меньше 4,5:1; акцент в тёмной теме светлее, чем в светлой (насыщенный тёмно-синий на тёмном фоне не читается). Светлую тему не трогайте. В правилах компонентов (.theme, .muted, .link, .btn) свойства color и background-color задаются только через var().',
      hints: [
        'Переменные наследуются: всё, что внутри .theme--dark, берёт значения из этого правила.',
        'Для текста на тёмном фоне не нужен чисто белый: #e6e8eb мягче для глаз. Приглушённый — #a9b1ba.',
        'Акцент для тёмной темы — светлый синий, например #6cb6ff. Тогда текст на кнопке должен быть тёмным: --on-accent: #0d1117.',
        'Проверьте каждую пару «текст / фон» в инструментах разработчика, строка Contrast ratio.'
      ],
      html: `<h1>Две темы библиотеки</h1>
<div class="theme theme--light">
  <h2>Светлая тема</h2>
  <p class="muted">Обновлено сегодня в 10:00</p>
  <p>Новые поступления: 24 книги по программированию.</p>
  <p><a class="link" href="#catalog">Открыть каталог</a></p>
  <button class="btn" type="button">Забронировать</button>
</div>
<div class="theme theme--dark">
  <h2>Тёмная тема</h2>
  <p class="muted">Обновлено сегодня в 10:00</p>
  <p>Новые поступления: 24 книги по программированию.</p>
  <p><a class="link" href="#catalog">Открыть каталог</a></p>
  <button class="btn" type="button">Забронировать</button>
</div>`,
      css: `${BASE}
.theme--light {
  --bg: #ffffff;
  --text: #1f2328;
  --muted: #59636e;
  --accent: #0b5cad;
  --on-accent: #ffffff;
}
.theme--dark {
  --bg: #121417;
}
.theme {
  margin-bottom: 16px;
  padding: 24px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: var(--bg);
  color: var(--text);
}
.muted {
  color: var(--muted);
}
.link {
  color: var(--accent);
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--accent);
  color: var(--on-accent);
}`,
      tests: [
        { name: 'Фон тёмной темы тёмный, но не чисто чёрный', check: h => { const c = h.cs('.theme--dark', 'background-color'); return lum(c) < 0.05 && c !== 'rgb(0, 0, 0)' || `сейчас ${c}`; } },
        { name: 'Тёмная тема: заголовок, текст и приглушённый текст — контраст от 4,5:1', check: h => ['.theme--dark h2', '.theme--dark p:not(.muted)', '.theme--dark .muted'].every(s => h.contrast(s) >= 4.5) || `заголовок ${h.contrast('.theme--dark h2').toFixed(2)}, приглушённый ${h.contrast('.theme--dark .muted').toFixed(2)}` },
        { name: 'Тёмная тема: ссылка и текст кнопки — контраст от 4,5:1', check: h => h.contrast('.theme--dark .link') >= 4.5 && h.contrast('.theme--dark .btn') >= 4.5 || `ссылка ${h.contrast('.theme--dark .link').toFixed(2)}, кнопка ${h.contrast('.theme--dark .btn').toFixed(2)}` },
        { name: 'Акцент в тёмной теме светлее, чем в светлой', check: h => lum(h.cs('.theme--dark .btn', 'background-color')) > lum(h.cs('.theme--light .btn', 'background-color')) + 0.1 || 'возьмите для --accent в тёмной теме светлый синий' },
        { name: 'Светлая тема не сломана', check: h => h.cs('.theme--light', 'background-color') === rgb('#ffffff') && ['.theme--light h2', '.theme--light .muted', '.theme--light .link', '.theme--light .btn'].every(s => h.contrast(s) >= 4.5) || 'верните светлой теме прежние значения' },
        { name: 'В компонентах цвета только через var()', check: h => {
          const bad = h.rules.filter(r => /^\.(theme|muted|link|btn)$/.test(r.selector)).find(r => ['color', 'background-color'].some(p => { const v = r.style.getPropertyValue(p) || (p === 'background-color' ? r.style.getPropertyValue('background') : ''); return v && !/var\(/.test(v); }));
          return !bad || `в правиле ${bad.selector} цвет без var()`; } }
      ]
    }
  );
})();
/* ---- content/tasks/k40.js ---- */
/* Занятие 40. Практическая работа №9 (ч. 1). Эскизы веб-приложения */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const nums = s => (s.match(/[\d.]+/g) || []).map(Number);
  // Эскиз — только в оттенках серого: у цвета r = g = b. Возвращает первый «цветной» элемент или null
  const colored = h => {
    for (const e of h.$$('body, body *')) {
      const s = h.win.getComputedStyle(e);
      const list = [['фон', s.backgroundColor], ['цвет текста', s.color]];
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(s[`border${side}Width`]) > 0 && s[`border${side}Style`] !== 'none') list.push(['рамка', s[`border${side}Color`]]);
      for (const [what, c] of list) {
        const [r, g, b, a] = nums(c);
        if (a === 0) continue;
        if (r !== g || g !== b) return `${what} у <${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''}>: ${c}`;
      }
    }
    return null;
  };
  // Элементы стоят в одну строку: их вертикальные полосы пересекаются
  const oneRow = (h, sels) => {
    const r = sels.map(s => h.rect(s)); if (r.some(x => !x)) return false;
    return Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom));
  };
  const leftToRight = (h, sels) => sels.every((s, i) => i === 0 || h.rect(sels[i - 1]).right <= h.rect(s).left + 1);
  // Все отступы в CSS (padding, margin, gap) в пикселях кратны 8
  const off8 = h => {
    for (const r of h.rules) for (let i = 0; i < r.style.length; i++) {
      const p = r.style[i];
      if (!/^(padding|margin|gap|row-gap|column-gap)/.test(p)) continue;
      const v = r.style.getPropertyValue(p);
      const bad = (v.match(/[\d.]+px/g) || []).find(x => parseFloat(x) % 8 !== 0);
      if (bad) return `${r.selector} { ${p}: ${v} }`;
    }
    return null;
  };
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
  --wf-bg: #f5f5f5;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4001', lesson: 'mdk-40', module: 'mdk4', mech: 'build',
      title: 'Эскиз главной: шапка, поиск, подвал', level: 'Среднее', minutes: 25, points: 150,
      story: 'Вы проектируете веб-приложение «Библиотека колледжа». Эскиз на бумаге готов, теперь переносим его в браузер серыми блоками: без цветов и красоты, зато с правильной структурой.',
      goal: 'Сверстайте каркас страницы. 1) header: блок-логотип .logo с текстом «ЛОГО», меню nav со списком ul из четырёх ссылок (Каталог, Новинки, Мероприятия, Контакты) и ссылка-кнопка a.login «Войти»; всё в одну строку: логотип слева, меню посередине, «Войти» справа. Фон шапки var(--wf-light), отступ padding кратен 8 (например, 16px 24px). 2) main: заголовок h1 «Найдите книгу в библиотеке колледжа» и форма form.search: подпись label, поле input type="search" и кнопка «Найти» в одну строку. 3) footer с абзацем «Библиотека колледжа · корпус 1, этаж 2». Это эскиз, поэтому все цвета — только серые (ссылки тоже!): берите их из переменных --wf-….',
      hints: [
        'Шапка: <header class="header"><div class="logo">ЛОГО</div><nav>…</nav><a class="login" href="#login">Войти</a></header>. В CSS: .header { display: flex; justify-content: space-between; align-items: center; }',
        'Меню в строку: nav ul { display: flex; gap: 24px; margin: 0; padding: 0; list-style: none; }',
        'Ссылки по умолчанию синие — для эскиза перекрасьте их: a { color: var(--wf-dark); }',
        'Форма: <form class="search"><label for="q">Книга или автор</label><input id="q" type="search"><button type="submit">Найти</button></form> и .search { display: flex; gap: 8px; align-items: center; }'
      ],
      html: `<!-- 1. Шапка: логотип, меню из четырёх ссылок, «Войти» -->

<main>
  <!-- 2. Заголовок h1 и форма поиска -->
</main>

<!-- 3. Подвал -->
`,
      css: `${BASE}
${WF}`,
      tests: [
        { name: 'В шапке есть .logo, nav со списком из 4 ссылок и a.login', check: h => h.count('header .logo') === 1 && h.count('header nav ul li a') === 4 && h.count('header a.login') === 1 || `ссылок в меню: ${h.count('header nav ul li a')}, .logo: ${h.count('header .logo')}, a.login: ${h.count('header a.login')}` },
        { name: 'Шапка в одну строку: логотип, меню, «Войти» слева направо', check: h => h.$('header nav') && oneRow(h, ['header .logo', 'header nav', 'header .login']) && leftToRight(h, ['header .logo', 'header nav', 'header .login']) || 'сделайте шапку флекс-контейнером' },
        { name: 'Фон шапки var(--wf-light), отступ кратен 8', check: h => { const p = h.px('header', 'padding-top'); return h.cs('header', 'background-color') === rgb('#e0e0e0') && p > 0 && p % 8 === 0 || `фон ${h.cs('header', 'background-color')}, padding-top ${p}px`; } },
        { name: 'В main один h1 и форма поиска с полем type="search" и кнопкой', check: h => h.count('main h1') === 1 && h.count('h1') === 1 && !!h.$('main form.search input[type="search"]') && !!h.$('main form.search button') || 'нужны h1 и form.search с input type="search" и button внутри main' },
        { name: 'Подпись, поле и кнопка поиска в одну строку', check: h => h.$('form.search label') && h.$('form.search button') && oneRow(h, ['form.search label', 'form.search input', 'form.search button']) || 'сделайте форму флекс-контейнером' },
        { name: 'Подвал footer после main', check: h => h.count('footer') === 1 && h.before('main', 'footer') && h.text('footer').length > 3 || 'добавьте footer с текстом после main' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } }
      ]
    },
    {
      id: 'k4002', lesson: 'mdk-40', module: 'mdk4', mech: 'build',
      title: 'Эскиз контента: карточки и шаги', level: 'Среднее', minutes: 25, points: 150,
      story: 'Шапка эскиза готова. Теперь главная часть: блок новых книг и короткая инструкция «Как взять книгу». Вместо обложек — серые заглушки, как на бумажном эскизе.',
      goal: 'Внутри main после h1 добавьте два раздела section. Первый: h2 «Новые поступления» и блок .cards с тремя карточками article.card; в каждой — заглушка обложки div.ph с текстом «Обложка», заголовок h3 и абзац p. Карточки стоят в один ряд одинаковой ширины (сетка grid на 3 колонки), расстояние gap кратно 8. Заглушка: высота 160px, фон var(--wf-mid), пунктирная рамка 2px dashed var(--wf-dark). Второй раздел: h2 «Как взять книгу» и нумерованный список ol.steps из трёх шагов, шаги стоят в ряд. Цвета — только серые.',
      hints: [
        'Карточка: <article class="card"><div class="ph">Обложка</div><h3>Название книги</h3><p>Автор</p></article>. Сделайте три таких.',
        'Сетка: .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }',
        'Заглушка: .ph { height: 160px; background-color: var(--wf-mid); border: 2px dashed var(--wf-dark); }',
        'Шаги в ряд: .steps { display: flex; gap: 16px; }'
      ],
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav>
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
</header>
<main>
  <h1>Найдите книгу в библиотеке колледжа</h1>
  <!-- Раздел 1: h2 «Новые поступления» и три карточки -->

  <!-- Раздел 2: h2 «Как взять книгу» и список из трёх шагов -->

</main>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}`,
      tests: [
        { name: 'Два раздела section с заголовками h2 внутри main', check: h => h.count('main section') === 2 && h.$$('main section').every(s => s.querySelector('h2')) || `разделов с h2: ${h.$$('main section').filter(s => s.querySelector('h2')).length}` },
        { name: 'Три карточки article.card: заглушка .ph, h3 и p', check: h => h.count('.cards article.card') === 3 && h.$$('.card').every(c => c.querySelector('.ph') && c.querySelector('h3') && c.querySelector('p')) || `карточек: ${h.count('.cards article.card')}; в каждой нужны .ph, h3, p` },
        { name: 'Карточки в один ряд, одинаковой ширины', check: h => { const c = h.$$('.card'); if (c.length !== 3) return 'нужно три карточки'; const w = c.map(e => h.rect(e).width); return h.sameRow(c) && Math.max(...w) - Math.min(...w) < 2 || 'сделайте .cards сеткой на 3 колонки'; } },
        { name: 'Расстояние между карточками кратно 8', check: h => { const g = h.px('.cards', 'column-gap'); return g > 0 && g % 8 === 0 || `сейчас gap ${isNaN(g) ? 'не задан' : g + 'px'}`; } },
        { name: 'Заглушка: высота 160px, серый фон, пунктирная рамка', check: h => h.$$('.ph').length === 3 && h.$$('.ph').every(e => Math.abs(h.px(e, 'height') - 160) < 1.5 && h.cs(e, 'background-color') === rgb('#bdbdbd') && h.cs(e, 'border-top-style') === 'dashed') || 'у .ph height: 160px, фон var(--wf-mid), border: 2px dashed' },
        { name: 'Список ol.steps из трёх шагов в ряд', check: h => h.count('ol.steps > li') === 3 && h.sameRow(h.$$('ol.steps > li')) || 'нужен ol.steps с тремя li в ряд' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } }
      ]
    },
    {
      id: 'k4003', lesson: 'mdk-40', module: 'mdk4', mech: 'fix',
      title: 'Наведите порядок в чужом эскизе', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник сверстал эскиз электронной библиотеки, но сделал его цветным, на одних div и с отступами «на глаз». Преподаватель такой эскиз не примет. Приведите его в порядок.',
      goal: 'Исправьте эскиз. 1) Семантика: div.top → header, div.menu → nav, div.content → main, div.bottom → footer, div.title → h1, h4 → h2 (классы можно оставить). 2) Цвета: только серые — используйте переменные --wf-… из :root, ссылки тоже серые. 3) Отступы: все значения padding, margin и gap в CSS кратны 8 (0, 8, 16, 24, 32…). 4) Баннер .banner — заглушка с пунктирной рамкой (border-style: dashed). 5) Три подборки по-прежнему стоят в один ряд.',
      hints: [
        'Меняйте и открывающий, и закрывающий тег: <div class="top">…</div> → <header class="top">…</header>.',
        'Цветные фоны замените: #4caf50 → var(--wf-light), #2196f3 → var(--wf-mid) и так далее. Белый текст на светло-сером не прочитать — поменяйте его на var(--wf-dark) или #222222.',
        'Отступы округлите до ближайшего кратного 8: 13px → 16px, 21px → 24px, 15px → 16px, 10px → 8px, 30px → 32px, 20px → 24px, 12px → 16px.',
        'Баннер: border: 2px dashed var(--wf-dark);'
      ],
      html: `<div class="top">
  <div class="logo">ЛОГО</div>
  <div class="menu">
    <a href="#catalog">Каталог</a>
    <a href="#events">Мероприятия</a>
    <a href="#rules">Правила</a>
  </div>
</div>
<div class="content">
  <div class="title">Электронная библиотека колледжа</div>
  <div class="banner">Баннер: книга недели</div>
  <h4>Подборки</h4>
  <div class="grid">
    <div class="item">Подборка 1</div>
    <div class="item">Подборка 2</div>
    <div class="item">Подборка 3</div>
  </div>
</div>
<div class="bottom">Контакты библиотеки</div>`,
      css: `${BASE}
${WF}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 21px;
  background-color: #4caf50;
}
.menu {
  display: flex;
  gap: 15px;
}
.menu a {
  color: #ffffff;
}
.title {
  margin: 20px 0;
  font-size: 32px;
  font-weight: bold;
}
.banner {
  height: 120px;
  padding: 10px;
  background-color: #ff9800;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.item {
  padding: 30px;
  background-color: #2196f3;
  color: #ffffff;
}
.bottom {
  margin-top: 20px;
  padding: 12px;
  background-color: #9c27b0;
  color: #ffffff;
}`,
      tests: [
        { name: 'Семантика: header с nav, main, footer — по одному', check: h => ['header', 'main', 'footer'].every(s => h.count(s) === 1) && h.count('header nav') === 1 && h.count('div.top, div.menu, div.content, div.bottom') === 0 || 'замените div.top, div.menu, div.content, div.bottom на семантические теги' },
        { name: 'Заголовки: h1 «Электронная библиотека колледжа» и h2 «Подборки»', check: h => h.count('h1') === 1 && h.text('h1') === 'Электронная библиотека колледжа' && h.count('h4') === 0 && h.text('h2') === 'Подборки' || 'div.title → h1, h4 → h2' },
        { name: 'Эскиз только в серых тонах', check: h => { const c = colored(h); return !c || c; } },
        { name: 'Все padding, margin и gap кратны 8', check: h => { const b = off8(h); return !b || `не кратно 8: ${b}`; } },
        { name: 'Баннер — заглушка с пунктирной рамкой', check: h => h.cs('.banner', 'border-top-style') === 'dashed' && h.px('.banner', 'border-top-width') > 0 || 'добавьте .banner рамку dashed' },
        { name: 'Три подборки в один ряд', check: h => h.count('.item') === 3 && h.sameRow(h.$$('.item')) || 'подборки должны стоять в ряд' }
      ]
    }
  );
})();
/* ---- content/tasks/k41.js ---- */
/* Занятие 41. Практическая работа №9 (ч. 2). Эскизы для телефона и компьютера */
(() => {
  const { BASE } = window.COURSE_KIT;
  const shown = (h, sel) => { const e = h.$(sel); return !!(e && h.cs(e, 'display') !== 'none' && e.getClientRects().length); };
  const hidden = (h, sel) => { const e = h.$(sel); return !!e && !e.getClientRects().length; };
  const oneRow = (h, sels) => { const r = sels.map(s => h.rect(s)); return r.every(x => x && x.height) && Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom)); };
  const below = (h, a, b) => { const x = h.rect(a), y = h.rect(b); return !!(x && y && y.top >= x.bottom - 1); };
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4101', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Шапка эскиза: компьютер и телефон', level: 'Среднее', minutes: 25, points: 150,
      story: 'Эскиз шапки библиотеки нарисован для компьютера. На телефоне меню из четырёх пунктов не помещается, и страница уезжает вбок. На мобильном эскизе меню прячут за кнопку «Меню».',
      goal: 'Сделайте две версии шапки. Компьютер (1024px): кнопка .burger спрятана (display: none), логотип, меню nav и «Войти» стоят в один ряд слева направо. Телефон (360px, медиазапрос @media (max-width: 767px)): меню nav спрятано, кнопка .burger видна и стоит в одном ряду с логотипом, справа от него; ссылка «Войти» остаётся видна; горизонтальной прокрутки нет (уменьшите отступы и промежутки шапки).',
      hints: [
        'Сначала спрячьте бургер для всех: .burger { display: none; } — и допишите это в правило .burger.',
        'Ниже добавьте медиазапрос: @media (max-width: 767px) { … } — внутри него правила для телефона.',
        'В медиазапросе: .nav { display: none; } и .burger { display: block; }',
        'Если всё ещё есть прокрутка, в том же медиазапросе уменьшите промежуток: .header { gap: 8px; padding: 8px; }'
      ],
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav class="nav">
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
  <button class="burger" type="button">Меню</button>
</header>
<main>
  <h1>Библиотека колледжа</h1>
  <p>Каталог, новинки и запись на мероприятия.</p>
</main>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.logo {
  padding: 4px 8px;
  border: 2px solid var(--wf-dark);
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.login {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
}
.burger {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
  background-color: var(--wf-mid);
  color: #222222;
  font-size: 16px;
}`,
      tests: [
        { name: 'Компьютер: кнопка «Меню» спрятана', check: h => hidden(h, '.burger') || 'на 1024px .burger должен быть display: none' },
        { name: 'Компьютер: логотип, меню и «Войти» в один ряд слева направо', check: h => shown(h, '.nav') && oneRow(h, ['.logo', '.nav', '.login']) && h.rect('.logo').right <= h.rect('.nav').left && h.rect('.nav').right <= h.rect('.login').left || 'на компьютере меню должно быть видно в одном ряду' },
        { name: 'Телефон: меню спрятано', at: 360, check: h => hidden(h, '.nav') || 'на 360px спрячьте .nav' },
        { name: 'Телефон: кнопка «Меню» видна, в ряду с логотипом, справа', at: 360, check: h => shown(h, '.burger') && oneRow(h, ['.logo', '.burger']) && h.rect('.burger').left > h.rect('.logo').right || 'на 360px покажите .burger справа от логотипа' },
        { name: 'Телефон: ссылка «Войти» видна', at: 360, check: h => shown(h, '.login') || '«Войти» нельзя прятать' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k4102', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Каталог: что переставить на телефоне', level: 'Среднее', minutes: 30, points: 150,
      story: 'На компьютере слева от результатов поиска стоит колонка «Новости». На телефоне человек пришёл за книгой, а первым экраном видит новости. Главное должно идти первым.',
      goal: 'Компьютер (1024px) оставьте как есть: новости .news слева, результаты .results справа, три карточки .card в один ряд. Телефон (@media (max-width: 767px)): раскладка .layout в одну колонку; результаты .results идут первыми, новости .news — под ними (HTML не меняйте, переставьте через CSS: order или grid-template-areas); карточки стоят друг под другом в одну колонку; горизонтальной прокрутки нет.',
      hints: [
        'Одна колонка в сетке: grid-template-columns: 1fr;',
        'Порядок в сетке и во флексе меняет свойство order: у .news поставьте order: 2 — тогда она уйдёт после результатов (у остальных order по умолчанию 0).',
        'Карточки в одну колонку: .cards { grid-template-columns: 1fr; }',
        'Всё это пишется внутри @media (max-width: 767px) { … } после основных правил.'
      ],
      html: `<h1>Каталог библиотеки</h1>
<div class="layout">
  <aside class="news">
    <h2>Новости</h2>
    <p>С 1 марта библиотека работает до 20:00.</p>
  </aside>
  <section class="results">
    <h2>Найдено 3 книги</h2>
    <div class="cards">
      <article class="card"><div class="ph">Обложка</div><h3>Основы HTML</h3><p>И. Петров</p></article>
      <article class="card"><div class="ph">Обложка</div><h3>CSS для начинающих</h3><p>А. Смирнова</p></article>
      <article class="card"><div class="ph">Обложка</div><h3>Веб-дизайн</h3><p>О. Кузнецова</p></article>
    </div>
  </section>
</div>`,
      css: `${BASE}
${WF}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}
.news {
  padding: 16px;
  background-color: var(--wf-light);
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  padding: 16px;
  border: 2px solid var(--wf-mid);
}
.ph {
  height: 120px;
  border: 2px dashed var(--wf-dark);
  background-color: var(--wf-mid);
}`,
      tests: [
        { name: 'Компьютер: новости слева от результатов, карточки в ряд', check: h => h.rect('.news').right <= h.rect('.results').left && oneRow(h, ['.news', '.results']) && h.sameRow(h.$$('.card')) || 'на компьютере раскладку не меняйте' },
        { name: 'Телефон: результаты первыми, новости под ними', at: 360, check: h => below(h, '.results', '.news') || 'на 360px .news должна идти после .results' },
        { name: 'Телефон: раскладка в одну колонку', at: 360, check: h => Math.abs(h.rect('.results').width - h.rect('.layout').width) < 2 && Math.abs(h.rect('.news').width - h.rect('.layout').width) < 2 || 'на 360px у .layout одна колонка' },
        { name: 'Телефон: карточки друг под другом', at: 360, check: h => { const c = h.$$('.card'); return c.length === 3 && c.every((e, i) => i === 0 || below(h, c[i - 1], e)) && c.every(e => Math.abs(h.rect(e).left - h.rect(c[0]).left) < 1) || 'на 360px у .cards одна колонка'; } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k4103', lesson: 'mdk-41', module: 'mdk4', mech: 'adaptive',
      title: 'Экран брони: что спрятать и растянуть', level: 'Среднее', minutes: 25, points: 150,
      story: 'Экран бронирования книги на компьютере: форма слева, подсказка справа, имя и группа в одну строку. На телефоне это превращается в узкие столбики, в которые не попасть пальцем.',
      goal: 'Компьютер (1024px) оставьте как есть: подсказка .tips видна справа от формы, поля «Имя и фамилия» и «Группа» в одной строке. Телефон (@media (max-width: 767px)): подсказку .tips спрячьте; поля из .row встают друг под другом; каждое поле input растянуто на всю ширину формы; кнопка .btn тоже на всю ширину формы; горизонтальной прокрутки нет.',
      hints: [
        'Флекс-строку можно развернуть в столбец: .row { flex-direction: column; }. То же для .screen.',
        'Поле на всю ширину: input { width: 100%; box-sizing: border-box; } — без box-sizing отступы и рамка вылезут за край.',
        'Кнопка на всю ширину: .btn { width: 100%; }',
        'Прятать: .tips { display: none; } внутри медиазапроса.'
      ],
      html: `<h1>Бронирование книги</h1>
<div class="screen">
  <form class="booking">
    <div class="row">
      <div class="field">
        <label for="name">Имя и фамилия</label>
        <input id="name" type="text" name="name">
      </div>
      <div class="field">
        <label for="group">Группа</label>
        <input id="group" type="text" name="group">
      </div>
    </div>
    <div class="field">
      <label for="date">Когда заберёте</label>
      <input id="date" type="date" name="date">
    </div>
    <button class="btn" type="submit">Забронировать</button>
  </form>
  <aside class="tips">
    <h2>Подсказка</h2>
    <p>Бронь хранится три дня. Заберите книгу у стойки выдачи.</p>
  </aside>
</div>`,
      css: `${BASE}
${WF}
.screen {
  display: flex;
  gap: 32px;
}
.booking {
  flex: 1;
}
.tips {
  flex: 0 0 280px;
  padding: 16px;
  background-color: var(--wf-light);
}
.row {
  display: flex;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  padding: 8px;
  border: 2px solid var(--wf-dark);
  font-size: 16px;
}
.btn {
  padding: 12px 24px;
  border: 2px solid var(--wf-dark);
  background-color: var(--wf-mid);
  color: #222222;
  font-size: 16px;
}`,
      tests: [
        { name: 'Компьютер: подсказка справа от формы, имя и группа в одной строке', check: h => shown(h, '.tips') && h.rect('.booking').right <= h.rect('.tips').left && oneRow(h, h.$$('.row .field')) || 'на компьютере раскладку не меняйте' },
        { name: 'Телефон: подсказка спрятана', at: 360, check: h => hidden(h, '.tips') || 'на 360px спрячьте .tips' },
        { name: 'Телефон: имя и группа друг под другом', at: 360, check: h => { const f = h.$$('.row .field'); return f.length === 2 && below(h, f[0], f[1]) || 'на 360px поля .row встают в столбец'; } },
        { name: 'Телефон: каждое поле на всю ширину формы', at: 360, check: h => { const w = h.rect('.booking').width; const bad = h.$$('.booking input').filter(i => Math.abs(h.rect(i).width - w) > 2); return !bad.length || `не растянуто полей: ${bad.length}`; } },
        { name: 'Телефон: кнопка на всю ширину формы', at: 360, check: h => Math.abs(h.rect('.btn').width - h.rect('.booking').width) <= 2 || 'на 360px у .btn width: 100%' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/k42.js ---- */
/* Занятие 42. Взаимодействие пользователя с сайтом */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const oneRow = (h, sels) => { const r = sels.map(s => h.rect(s)); return r.every(x => x && x.height) && Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom)); };
  // правый край содержимого блока (без внутреннего отступа)
  const innerRight = (h, sel) => h.rect(sel).right - h.px(sel, 'padding-right') - h.px(sel, 'border-right-width');
  const transparent = c => /rgba\(.*,\s*0\)$/.test(c) || c === 'transparent';

  window.COURSE_TASKS.push(
    {
      id: 'k4201', lesson: 'mdk-42', module: 'mdk5', mech: 'build',
      title: 'Первый экран по Z-паттерну', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'На посадочной странице фитнес-клуба взгляд скользит буквой Z: логотип → кнопка в шапке → заголовок → главная кнопка. Сейчас все элементы стоят столбиком, и кнопка «Записаться» теряется внизу слева.',
      goal: 'Расставьте элементы по Z-паттерну. 1) В шапке .header логотип .logo слева, ссылка .header__cta справа, в одном ряду; правый край ссылки — у правого края шапки. 2) Заголовок h1 — под шапкой, слева. 3) В блоке .hero__bottom абзац слева, кнопка .btn справа, в одном ряду; правый край кнопки — у правого края блока .hero. HTML не меняйте, только CSS.',
      hints: [
        'Флекс-контейнер с разносом по краям: display: flex; justify-content: space-between; align-items: center;',
        'Нужны два таких контейнера: .header и .hero__bottom.',
        'Чтобы абзац не растягивался во всю ширину и не прижимал кнопку, ограничьте его: .hero__bottom p { max-width: 400px; }',
        'Отступ между абзацем и кнопкой: gap: 24px; у контейнера.'
      ],
      html: `<header class="header">
  <div class="logo">Пульс</div>
  <a class="header__cta" href="#trial">Пробное занятие</a>
</header>
<section class="hero">
  <h1>Первая тренировка — бесплатно</h1>
  <div class="hero__bottom">
    <p>Тренажёрный зал в пяти минутах от колледжа. Студентам — скидка 20%.</p>
    <a class="btn" href="#signup">Записаться</a>
  </div>
</section>`,
      css: `${BASE}
.header {
  padding: 16px 24px;
  border-bottom: 1px solid #d0d7de;
}
.logo {
  font-size: 24px;
  font-weight: bold;
}
.header__cta {
  color: #1f4e5f;
  font-weight: bold;
}
.hero {
  padding: 48px 24px;
  background-color: #f4f7f6;
}
.hero h1 {
  margin-top: 0;
  font-size: 40px;
}
.btn {
  display: inline-block;
  padding: 16px 32px;
  border-radius: 8px;
  background-color: #1f4e5f;
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шапка: логотип слева, ссылка справа в одном ряду', check: h => oneRow(h, ['.logo', '.header__cta']) && h.rect('.header__cta').left > h.rect('.logo').right || 'сделайте .header флекс-контейнером' },
        { name: 'Ссылка в шапке прижата к правому краю', check: h => Math.abs(h.rect('.header__cta').right - innerRight(h, '.header')) <= 2 || 'используйте justify-content: space-between' },
        { name: 'Заголовок под шапкой, слева', check: h => h.rect('h1').top >= h.rect('.header').bottom && h.rect('h1').left < h.width / 3 || 'h1 должен стоять под шапкой слева' },
        { name: 'Абзац и кнопка в одном ряду, кнопка справа', check: h => oneRow(h, ['.hero__bottom p', '.btn']) && h.rect('.btn').left > h.rect('.hero__bottom p').right || 'сделайте .hero__bottom флекс-контейнером' },
        { name: 'Кнопка прижата к правому краю блока .hero', check: h => Math.abs(h.rect('.btn').right - innerRight(h, '.hero')) <= 2 || 'кнопка — конец буквы Z, она справа' }
      ]
    },
    {
      id: 'k4202', lesson: 'mdk-42', module: 'mdk5', mech: 'fix',
      title: 'Один главный призыв к действию', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице курсов английского три кнопки разного цвета кричат одновременно: зелёная, красная и жёлтая. Пользователь не понимает, что от него хотят, и уходит.',
      goal: 'Оставьте один главный призыв. Главная кнопка .btn--primary: фон #2e7d32, белый текст, высота не меньше 44px (min-height: 44px). Второстепенная .btn--secondary: прозрачный фон (transparent), рамка 2px solid #2e7d32, текст #2e7d32, высота как у главной. Третье действие .link-more — обычная ссылка: без фона, с подчёркиванием. HTML не меняйте.',
      hints: [
        'Прозрачный фон: background-color: transparent;',
        'Чтобы кнопки были одной высоты, задайте общий min-height: 44px в правиле .btn, а рамку главной кнопке тоже сделайте 2px того же цвета — тогда размеры совпадут.',
        'min-height работает у блоков: у .btn уже стоит display: inline-flex, так что всё получится.',
        'Ссылка: у .link-more уберите фон и padding, а text-decoration: underline верните.'
      ],
      html: `<section class="offer">
  <h1>Курсы английского в колледже</h1>
  <p>Группы по 8 человек, занятия два раза в неделю после пар.</p>
  <div class="actions">
    <a class="btn btn--primary" href="#signup">Записаться на пробный урок</a>
    <a class="btn btn--secondary" href="#schedule">Посмотреть расписание</a>
    <a class="link-more" href="#about">Подробнее о преподавателях</a>
  </div>
</section>`,
      css: `${BASE}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
}
.btn--primary {
  background-color: #2e7d32;
  color: #ffffff;
}
.btn--secondary {
  background-color: #c62828;
  color: #ffffff;
}
.link-more {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #f9a825;
  color: #222222;
  text-decoration: none;
}`,
      tests: [
        { name: 'Главная кнопка: фон #2e7d32, белый текст', check: h => h.cs('.btn--primary', 'background-color') === rgb('#2e7d32') && h.cs('.btn--primary', 'color') === rgb('#ffffff') || 'не меняйте цвета главной кнопки' },
        { name: 'Главная кнопка не ниже 44px', check: h => h.rect('.btn--primary').height >= 44 || `сейчас ${Math.round(h.rect('.btn--primary').height)}px` },
        { name: 'Второстепенная: прозрачный фон, рамка 2px и текст цвета #2e7d32', check: h => transparent(h.cs('.btn--secondary', 'background-color')) && h.px('.btn--secondary', 'border-top-width') === 2 && h.cs('.btn--secondary', 'border-top-style') === 'solid' && h.cs('.btn--secondary', 'border-top-color') === rgb('#2e7d32') && h.cs('.btn--secondary', 'color') === rgb('#2e7d32') || 'у .btn--secondary: transparent, border: 2px solid #2e7d32, color #2e7d32' },
        { name: 'Кнопки одной высоты', check: h => Math.abs(h.rect('.btn--primary').height - h.rect('.btn--secondary').height) < 1 || 'выровняйте высоту кнопок' },
        { name: 'Третье действие — подчёркнутая ссылка без фона', check: h => transparent(h.cs('.link-more', 'background-color')) && /underline/.test(h.cs('.link-more', 'text-decoration-line')) || 'у .link-more уберите фон и верните подчёркивание' }
      ]
    },
    {
      id: 'k4203', lesson: 'mdk-42', module: 'mdk5', mech: 'build',
      title: 'Кнопка «В избранное» с откликом', level: 'Среднее', minutes: 20, points: 150,
      story: 'В подборке библиотеки можно добавить книгу в избранное. Сейчас кнопка ничего не отвечает, и студенты жмут её по пять раз. Нужна обратная связь: кнопка меняет вид и текст, а под списком появляется сообщение.',
      goal: 'Напишите скрипт. При нажатии на кнопку .fav: если она не нажата (aria-pressed="false") — поставьте aria-pressed="true", текст кнопки «В избранном», а в абзац .status (у него role="status", не удаляйте его — так сообщение услышит экранный диктор) запишите «Книга добавлена в избранное». Если нажата — наоборот: aria-pressed="false", текст «В избранное», сообщение «Книга убрана из избранного». Так должна работать каждая кнопка .fav. Вид нажатой кнопки CSS уже меняет сам, по атрибуту aria-pressed.',
      hints: [
        'Прочитать атрибут: button.getAttribute(\'aria-pressed\') — это строка \'true\' или \'false\', не логическое значение.',
        'Записать атрибут: button.setAttribute(\'aria-pressed\', \'true\');',
        'Удобно так: const pressed = button.getAttribute(\'aria-pressed\') === \'true\'; if (pressed) { … } else { … }',
        'Текст: button.textContent = \'В избранном\'; status.textContent = \'Книга добавлена в избранное\';'
      ],
      html: `<h1>Подборка недели</h1>
<article class="book">
  <h2>«Мастер и Маргарита»</h2>
  <p>М. Булгаков</p>
  <button class="fav" type="button" aria-pressed="true">В избранном</button>
</article>
<article class="book">
  <h2>«Шинель»</h2>
  <p>Н. Гоголь</p>
  <button class="fav" type="button" aria-pressed="false">В избранное</button>
</article>
<p class="status" role="status"></p>`,
      css: `${BASE}
.book {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.fav {
  padding: 8px 16px;
  border: 2px solid #1f5fa8;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1f5fa8;
  font-size: 16px;
}
.fav[aria-pressed="true"] {
  background-color: #1f5fa8;
  color: #ffffff;
}
.status {
  font-weight: bold;
  color: #1b5e20;
}`,
      js: `const buttons = document.querySelectorAll('.fav');
const status = document.querySelector('.status');

for (const button of buttons) {
  button.addEventListener('click', () => {
    // 1. Узнайте, нажата ли кнопка сейчас
    // 2. Переключите aria-pressed на противоположное значение
    // 3. Поменяйте текст кнопки и сообщение в .status
  });
}
`,
      tests: [
        { name: 'Сообщение выводится в области role="status"', check: h => h.$('.status')?.getAttribute('role') === 'status' || 'у .status должен остаться role="status"' },
        { name: 'Добавление: aria-pressed="true", текст «В избранном», сообщение', js: true, check: async h => {
          const b = h.$$('.fav')[1]; b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'true' && b.textContent.trim() === 'В избранном' && h.text('.status') === 'Книга добавлена в избранное' || `aria-pressed=${b.getAttribute('aria-pressed')}, кнопка «${b.textContent.trim()}», сообщение «${h.text('.status')}»`; } },
        { name: 'Удаление: aria-pressed="false", текст «В избранное», сообщение', js: true, check: async h => {
          const b = h.$$('.fav')[0]; b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'false' && b.textContent.trim() === 'В избранное' && h.text('.status') === 'Книга убрана из избранного' || `aria-pressed=${b.getAttribute('aria-pressed')}, кнопка «${b.textContent.trim()}», сообщение «${h.text('.status')}»`; } },
        { name: 'Повторное нажатие возвращает кнопку обратно', js: true, check: async h => {
          const b = h.$$('.fav')[1]; b.click(); await h.wait();
          if (b.getAttribute('aria-pressed') !== 'true') return 'после первого нажатия кнопка должна стать нажатой';
          b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'false' && b.textContent.trim() === 'В избранное' && h.text('.status') === 'Книга убрана из избранного' || 'после второго нажатия кнопка должна вернуться в исходное состояние'; } },
        { name: 'В консоли нет ошибок', js: true, check: async h => { h.$$('.fav').forEach(b => b.click()); await h.wait(); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k43.js ---- */
/* Занятие 43. Обратная связь и состояния элементов */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Правило по регулярному выражению для селектора
  const rule = (h, re) => h.rules.find(x => re.test(x.selector));
  // Значение свойства из правила, переведённое в вычисленный вид через временный элемент
  const ruleValue = (h, re, prop, short) => {
    const r = rule(h, re); if (!r) return '';
    const v = r.style.getPropertyValue(prop) || (short ? r.style.getPropertyValue(short) : ''); if (!v) return '';
    const t = h.doc.createElement('span'); h.doc.body.appendChild(t);
    t.style.setProperty(short && !r.style.getPropertyValue(prop) ? short : prop, v);
    const out = h.win.getComputedStyle(t).getPropertyValue(prop); t.remove();
    return out;
  };
  const before = (h, sel) => { const e = h.$(sel); if (!e) return 'none'; return h.win.getComputedStyle(e, '::before').getPropertyValue('content'); };
  // Сообщение, связанное с полем через aria-describedby
  const described = (h, sel) => { const i = h.$(sel); const id = i && i.getAttribute('aria-describedby'); return id ? h.doc.getElementById(id.split(/\s+/)[0]) : null; };

  window.COURSE_TASKS.push(
    {
      id: 'k4301', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Все состояния кнопки', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице записи на консультацию кнопки времени никак не реагируют: не темнеют под мышью, не видно фокуса с клавиатуры, а занятое время выглядит так же, как свободное.',
      goal: 'Допишите состояния кнопки .btn. Наведение — правило .btn:hover:not(:disabled), фон #174a83. Нажатие — правило .btn:active:not(:disabled), фон #103660 и сдвиг transform: translateY(1px). Фокус с клавиатуры — правило .btn:focus-visible, обводка outline: 3px solid #1a1a1a и outline-offset: 2px. Недоступная кнопка — правило .btn:disabled: фон #d6d6d6, текст #555555, курсор cursor: not-allowed. Часть :not(:disabled) нужна, чтобы недоступная кнопка не реагировала на мышь.',
      hints: [
        'Состояния пишутся после основного правила .btn — так они его переопределяют.',
        'Наведение: .btn:hover:not(:disabled) { background-color: #174a83; }',
        'Фокус: .btn:focus-visible { outline: 3px solid #1a1a1a; outline-offset: 2px; }',
        'Недоступная: .btn:disabled { background-color: #d6d6d6; color: #555555; cursor: not-allowed; }'
      ],
      html: `<h1>Запись на консультацию</h1>
<p>Выберите удобное время:</p>
<div class="slots">
  <button class="btn" type="button">Пн, 15:00</button>
  <button class="btn" type="button">Ср, 14:00</button>
  <button class="btn" type="button" disabled>Пт, 16:00 — мест нет</button>
</div>`,
      css: `${BASE}
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background-color: #1f5fa8;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}`,
      tests: [
        { name: 'Наведение: .btn:hover:not(:disabled) с фоном #174a83', check: h => ruleValue(h, /^\.btn:hover:not\(:disabled\)$/, 'background-color', 'background') === rgb('#174a83') || 'нет правила .btn:hover:not(:disabled) с фоном #174a83' },
        { name: 'Нажатие: фон #103660 и сдвиг на 1px вниз', check: h => { const r = rule(h, /^\.btn:active:not\(:disabled\)$/); return !!r && ruleValue(h, /^\.btn:active:not\(:disabled\)$/, 'background-color', 'background') === rgb('#103660') && /translateY\(1px\)/.test(r.style.transform) || 'нужно .btn:active:not(:disabled) с фоном и transform: translateY(1px)'; } },
        { name: 'Фокус: обводка 3px solid с отступом 2px', check: h => { const r = rule(h, /^\.btn:focus-visible$/); return !!r && r.style.outlineStyle === 'solid' && r.style.outlineWidth === '3px' && r.style.outlineOffset === '2px' || 'нужно .btn:focus-visible { outline: 3px solid #1a1a1a; outline-offset: 2px; }'; } },
        { name: 'Недоступная кнопка: серый фон, тёмно-серый текст, курсор not-allowed', check: h => h.cs('.btn:disabled', 'background-color') === rgb('#d6d6d6') && h.cs('.btn:disabled', 'color') === rgb('#555555') && h.cs('.btn:disabled', 'cursor') === 'not-allowed' || 'у .btn:disabled фон #d6d6d6, color #555555, cursor: not-allowed' },
        { name: 'Обычная кнопка не изменилась', check: h => h.cs('.btn', 'background-color') === rgb('#1f5fa8') && h.cs('.btn', 'cursor') === 'pointer' || 'основное правило .btn оставьте как было' }
      ]
    },
    {
      id: 'k4302', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Поле с ошибкой и поле с успехом', level: 'Среднее', minutes: 20, points: 150,
      story: 'Для стайлгайда библиотеки нужна «витрина» состояний поля: обычное, с ошибкой и с успехом. Дизайнер просит, чтобы ошибку было понятно не только по красному цвету.',
      goal: 'Сразу после поля почты добавьте абзац p.error-text с id="email-error": что не так и как исправить, с примером правильного адреса (в тексте должен быть знак @). Сразу после поля логина — p.success-text с id="login-ok" и текстом «Логин свободен». Свяжите поля с сообщениями атрибутом aria-describedby. В CSS: поле с aria-invalid="true" — рамка 2px solid #c62828; .error-text — цвет #c62828 и значок перед текстом через ::before (например, content: "✕ "); поле .is-valid — рамка 2px solid #2e7d32; .success-text — цвет #2e7d32.',
      hints: [
        'Разметка: <input id="email" … aria-invalid="true" aria-describedby="email-error"> и сразу под ним <p class="error-text" id="email-error">…</p>.',
        'Хорошая ошибка: «В адресе нет знака @. Пример: anna@mail.ru». Плохая: «Ошибка ввода».',
        'Селектор по атрибуту: input[aria-invalid="true"] { border: 2px solid #c62828; }',
        'Значок: .error-text::before { content: "✕ "; }'
      ],
      html: `<h1>Регистрация в электронной библиотеке</h1>
<form class="form" novalidate>
  <div class="field">
    <label for="name">Имя</label>
    <input id="name" type="text" value="Анна">
  </div>
  <div class="field">
    <label for="email">Электронная почта</label>
    <input id="email" type="email" value="anna.mail.ru" aria-invalid="true">
  </div>
  <div class="field">
    <label for="login">Логин</label>
    <input id="login" class="is-valid" type="text" value="anna_reader">
  </div>
  <button class="btn" type="submit">Зарегистрироваться</button>
</form>`,
      css: `${BASE}
.form {
  max-width: 360px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  padding: 8px;
  border: 2px solid #767676;
  border-radius: 4px;
  font-size: 16px;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background-color: #1f5fa8;
  color: #ffffff;
  font-size: 16px;
}`,
      tests: [
        { name: 'Ошибка: сообщение сразу после поля почты, связано через aria-describedby', check: h => { const m = described(h, '#email'); return !!m && m.matches('p.error-text') && h.$('#email').nextElementSibling === m || 'нужен p.error-text сразу после #email и aria-describedby="email-error"'; } },
        { name: 'Ошибка объясняет, как исправить: есть пример с @', check: h => { const m = h.$('.error-text'); return !!m && m.textContent.trim().length >= 20 && m.textContent.includes('@') || 'напишите, что не так, и дайте пример адреса'; } },
        { name: 'Поле с ошибкой: рамка 2px #c62828', check: h => h.cs('#email', 'border-top-color') === rgb('#c62828') && h.px('#email', 'border-top-width') === 2 || 'input[aria-invalid="true"] { border: 2px solid #c62828; }' },
        { name: 'Текст ошибки красный и со значком (не только цветом)', check: h => h.cs('.error-text', 'color') === rgb('#c62828') && !/^(none|normal)$/.test(before(h, '.error-text')) || 'у .error-text цвет #c62828 и ::before с content' },
        { name: 'Успех: «Логин свободен» после поля логина, связан через aria-describedby', check: h => { const m = described(h, '#login'); return !!m && m.matches('p.success-text') && h.$('#login').nextElementSibling === m && m.textContent.trim() === 'Логин свободен' || 'нужен p.success-text сразу после #login и aria-describedby="login-ok"'; } },
        { name: 'Поле и текст успеха зелёные #2e7d32', check: h => h.cs('#login', 'border-top-color') === rgb('#2e7d32') && h.px('#login', 'border-top-width') === 2 && h.cs('.success-text', 'color') === rgb('#2e7d32') || '.is-valid — рамка 2px solid #2e7d32, .success-text — color #2e7d32' }
      ]
    },
    {
      id: 'k4303', lesson: 'mdk-43', module: 'mdk5', mech: 'build',
      title: 'Опасное действие и пустое состояние', level: 'Среднее', minutes: 20, points: 150,
      story: 'В разделе «Мои брони» студент случайно нажал «Отменить бронь» и потерял книгу, которую ждал месяц. А когда броней не осталось, страница стала просто пустой — непонятно, сломалось что-то или так и надо.',
      goal: 'Допишите скрипт. При нажатии на «Отменить бронь» спросите подтверждение через confirm(), в вопросе назовите книгу (текст из .title пункта, например «Отменить бронь книги «Основы HTML»?»). Если пользователь согласился — удалите пункт .item из списка. Если отказался — ничего не меняйте. Когда в списке не осталось пунктов, покажите пустое состояние .empty (уберите у него hidden).',
      hints: [
        'confirm(\'вопрос\') показывает окно с кнопками «ОК» и «Отмена» и возвращает true или false.',
        'Пункт, в котором лежит кнопка: const item = button.closest(\'.item\'); — closest ищет ближайшего предка с таким селектором. Удалить элемент: item.remove().',
        'Сколько пунктов осталось: document.querySelectorAll(\'.item\').length',
        'if (confirm(\'Отменить бронь книги \' + title + \'?\')) { item.remove(); if (document.querySelectorAll(\'.item\').length === 0) { empty.hidden = false; } }'
      ],
      html: `<h1>Мои брони</h1>
<ul class="list">
  <li class="item"><span class="title">«Основы HTML»</span> <button class="cancel" type="button">Отменить бронь</button></li>
  <li class="item"><span class="title">«Веб-дизайн»</span> <button class="cancel" type="button">Отменить бронь</button></li>
</ul>
<div class="empty" hidden>
  <h2>Броней пока нет</h2>
  <p>Найдите книгу в каталоге и нажмите «Забронировать».</p>
  <a class="empty__link" href="#catalog">Перейти в каталог</a>
</div>`,
      css: `${BASE}
.list {
  padding: 0;
  list-style: none;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  padding: 16px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.cancel {
  padding: 8px 16px;
  border: 2px solid #c62828;
  border-radius: 8px;
  background-color: #ffffff;
  color: #c62828;
  font-size: 16px;
}
.empty {
  padding: 24px;
  border: 2px dashed #8c959f;
  border-radius: 8px;
  text-align: center;
}`,
      js: `const empty = document.querySelector('.empty');
const buttons = document.querySelectorAll('.cancel');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    const title = item.querySelector('.title').textContent;
    // 1. Спросите подтверждение через confirm, назовите книгу
    // 2. Если пользователь согласился — удалите пункт
    // 3. Если пунктов не осталось — покажите пустое состояние
  });
}
`,
      tests: [
        { name: 'Перед отменой спрашивается подтверждение с названием книги', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return h.alerts.length === 1 && h.alerts[0].includes('Основы HTML') || (h.alerts.length ? `в вопросе нет названия книги: «${h.alerts[0]}»` : 'confirm не вызван'); } },
        { name: 'После согласия пункт удаляется', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return h.count('.item') === 1 && !h.text('.list').includes('Основы HTML') || `пунктов осталось: ${h.count('.item')}`; } },
        { name: 'Если пользователь отказался — ничего не меняется', js: true, check: async h => {
          window.confirm = () => false;
          h.$$('.cancel')[0].click(); await h.wait();
          return h.count('.item') === 2 || 'при «Отмена» пункт удалять нельзя'; } },
        { name: 'Пока брони есть, пустое состояние скрыто', js: true, check: async h => {
          h.$$('.cancel')[0].click(); await h.wait();
          return !h.visible('.empty') || 'одна бронь ещё осталась, а пустое состояние уже видно'; } },
        { name: 'Когда броней не осталось, видно пустое состояние', js: true, check: async h => {
          h.$$('.cancel').forEach(b => b.click()); await h.wait();
          return h.count('.item') === 0 && h.visible('.empty') || `пунктов: ${h.count('.item')}, пустое состояние ${h.visible('.empty') ? 'видно' : 'скрыто'}`; } },
        { name: 'В консоли нет ошибок', js: true, check: async h => { h.$$('.cancel').forEach(b => b.click()); await h.wait(); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k44.js ---- */
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
/* ---- content/tasks/k45.js ---- */
/* Занятие 45. Вопросы разработки интерфейса: навигация и формы */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k4501', lesson: 'mdk-45', module: 'mdk5', mech: 'build',
      title: 'Хлебные крошки и пагинация', level: 'Среднее', minutes: 20, points: 150,
      story: 'В электронном каталоге библиотеки колледжа студенты теряются: непонятно, в каком они разделе и как перейти к следующей странице списка.',
      goal: 'Перед h1 добавьте хлебные крошки: nav с классом breadcrumbs и aria-label="Хлебные крошки", внутри ol из трёх пунктов: «Главная» и «Каталог» — ссылки, «Информатика» — обычный текст с aria-current="page" у li. Пункты стоят в одну строку (flex), перед вторым и третьим CSS рисует разделитель через li + li::before. После списка книг добавьте пагинацию: nav с классом pagination и aria-label="Страницы", внутри список из четырёх ссылок «1», «2», «3», «Вперёд» в одну строку. У ссылки «1» — aria-current="page" и другой фон. Каждая ссылка пагинации не меньше 44×44 пикселей.',
      hints: [
        'Каркас крошек: <nav class="breadcrumbs" aria-label="Хлебные крошки"><ol><li><a href="#">Главная</a></li> … <li aria-current="page">Информатика</li></ol></nav>.',
        'В строку: .breadcrumbs ol { display: flex; margin: 0; padding: 0; list-style: none; }. Разделитель: .breadcrumbs li + li::before { content: "/"; margin: 0 8px; }.',
        'Пагинация: <nav class="pagination" aria-label="Страницы"><ul><li><a href="#" aria-current="page">1</a></li> …</ul></nav>, у ul — display: flex и gap.',
        'Размер ссылки: .pagination a { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px; }. Выделение: .pagination a[aria-current="page"] { background: #1f5fa8; color: #ffffff; }.'
      ],
      html: `<!-- Здесь хлебные крошки: Главная / Каталог / Информатика -->

<h1>Информатика</h1>
<ul class="books">
  <li>Основы алгоритмизации и программирования</li>
  <li>Информационные технологии в профессии</li>
  <li>Компьютерные сети: учебник для колледжей</li>
</ul>

<!-- Здесь пагинация: 1, 2, 3, Вперёд -->
`,
      css: `${BASE}
.books { margin-bottom: 24px; line-height: 1.6; }`,
      tests: [
        { name: 'Перед h1 есть nav.breadcrumbs с aria-label и списком ol из 3 пунктов', check: h => { const n = h.$('nav.breadcrumbs'); return !!(n && n.getAttribute('aria-label') && h.count('nav.breadcrumbs ol > li') === 3 && h.before('nav.breadcrumbs', 'h1')) || (n ? 'нужны aria-label и ol из трёх li' : 'нет nav.breadcrumbs перед h1'); } },
        { name: 'Первые два пункта — ссылки, последний — текст с aria-current="page"', check: h => { const li = h.$$('nav.breadcrumbs li'); return (li.length === 3 && li[0].querySelector('a[href]') && li[1].querySelector('a[href]') && !li[2].querySelector('a') && li[2].getAttribute('aria-current') === 'page') || 'последний пункт без ссылки и с aria-current="page"'; } },
        { name: 'Крошки в одну строку', check: h => { const li = h.$$('nav.breadcrumbs li'); return (li.length === 3 && h.sameRow(li)) || 'сделайте ol flex-контейнером'; } },
        { name: 'Перед вторым пунктом CSS рисует разделитель (::before)', check: h => { const li = h.$$('nav.breadcrumbs li')[1]; const c = li ? h.win.getComputedStyle(li, '::before').content : 'none'; return !!(c && c !== 'none' && c !== 'normal' && c !== '""') || 'нет li + li::before с content'; } },
        { name: 'После списка книг есть nav.pagination с aria-label и 4 ссылками', check: h => (!!h.$('nav.pagination[aria-label]') && h.count('nav.pagination a[href]') === 4 && h.before('.books', 'nav.pagination')) || `ссылок в пагинации: ${h.count('nav.pagination a[href]')}` },
        { name: 'Ссылки пагинации в одну строку', check: h => { const a = h.$$('nav.pagination a'); return (a.length === 4 && h.sameRow(a)) || 'сделайте список flex-контейнером'; } },
        { name: 'Текущая страница «1»: aria-current="page" и другой фон', check: h => { const a = h.$$('nav.pagination a'); const cur = a.find(e => e.getAttribute('aria-current') === 'page'); return !!(cur && cur.textContent.trim() === '1' && a.filter(e => e !== cur).every(e => h.cs(e, 'background-color') !== h.cs(cur, 'background-color'))) || 'у ссылки «1» нужен aria-current="page" и свой фон'; } },
        { name: 'Каждая ссылка пагинации не меньше 44×44', check: h => { const a = h.$$('nav.pagination a'); const bad = a.filter(e => { const r = e.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }); return (a.length > 0 && !bad.length) || (a.length ? `меньше 44×44: ${bad.length}` : 'нет ссылок'); } }
      ]
    },
    {
      id: 'k4502', lesson: 'mdk-45', module: 'mdk5', mech: 'fix',
      title: 'Удобная форма записи', level: 'Среднее', minutes: 15, points: 150,
      story: 'Фитнес-клуб колледжа жалуется: до конца формы записи доходит меньше половины студентов. Подписи слева, у телефона и почты вместо подписей бледные placeholder, а ошибка звучит как «Ошибка!».',
      goal: 'Почините форму. У телефона и почты — подписи label for («Телефон» и «Почта»). Все подписи стоят над полями, поля в одну колонку (у .row поменяйте направление flex на колонку). Телефону — type="tel", почте — type="email". Подсказку #phone-hint свяжите с телефоном через aria-describedby. Ошибке дайте id="email-error", текст «Укажите почту в формате name@mail.ru» и свяжите её с почтой через aria-describedby. Текст кнопки — «Записаться на тренировку».',
      hints: [
        'Подпись: <label for="phone">Телефон</label> перед полем внутри .row. Значение for совпадает с id поля.',
        'Подписи над полями: .row { display: flex; flex-direction: column; }. Ширину подписи 160px тогда можно убрать.',
        'Связь с подсказкой: <input id="phone" … aria-describedby="phone-hint">.',
        'Ошибка: <p id="email-error" class="error">Укажите почту в формате name@mail.ru</p>, а у поля почты — aria-describedby="email-error".'
      ],
      html: `<form class="form">
  <h2>Запись на пробную тренировку</h2>
  <div class="row">
    <label for="name">Имя</label>
    <input id="name" name="name" type="text">
  </div>
  <div class="row">
    <input id="phone" name="phone" type="text" placeholder="Телефон">
    <p id="phone-hint" class="hint">Например, +7 900 123-45-67</p>
  </div>
  <div class="row">
    <input id="email" name="email" type="text" placeholder="Почта" value="ivan.mail.ru" aria-invalid="true">
    <p class="error">Ошибка!</p>
  </div>
  <button type="submit">OK</button>
</form>`,
      css: `${BASE}
.form { max-width: 480px; }
.row { display: flex; gap: 8px; margin-bottom: 16px; }
.row label { width: 160px; font-weight: bold; }
.row input { padding: 10px; border: 1px solid #5a6475; border-radius: 6px; font-size: 16px; }
.row input[aria-invalid="true"] { border-color: #c62828; }
.hint, .error { margin: 0; font-size: 14px; }
.hint { color: #5a6475; }
.error { color: #c62828; }
button { padding: 12px 20px; border: 0; border-radius: 8px; background: #1f5fa8; color: #ffffff; font-size: 16px; }`,
      tests: [
        { name: 'У всех трёх полей есть label for', check: h => { const bad = ['name', 'phone', 'email'].filter(id => !h.$(`label[for="${id}"]`) || !h.$('#' + id)); return !bad.length || `без подписи: ${bad.join(', ')}`; } },
        { name: 'Каждая подпись стоит над своим полем', check: h => { const bad = ['name', 'phone', 'email'].filter(id => { const l = h.rect(`label[for="${id}"]`), i = h.rect('#' + id); return !l || !i || l.bottom > i.top + 1; }); return !bad.length || `подпись не над полем: ${bad.join(', ')}`; } },
        { name: 'Поля в одну колонку: левые края совпадают', check: h => { const x = ['#name', '#phone', '#email'].map(s => h.rect(s)?.left ?? -99); return Math.max(...x) - Math.min(...x) < 1.5 || 'поля начинаются в разных местах'; } },
        { name: 'Телефон — type="tel", почта — type="email"', check: h => (h.$('#phone')?.type === 'tel' && h.$('#email')?.type === 'email') || `сейчас телефон: ${h.$('#phone')?.type}, почта: ${h.$('#email')?.type}` },
        { name: 'Подсказка #phone-hint связана с телефоном через aria-describedby', check: h => ((h.$('#phone')?.getAttribute('aria-describedby') || '').split(/\s+/).includes('phone-hint') && !!h.$('#phone-hint')) || 'нет aria-describedby="phone-hint"' },
        { name: 'Ошибка #email-error объясняет формат и связана с почтой', check: h => { const e = h.$('#email-error'); const ok = e && /@/.test(e.textContent) && e.textContent.trim().length > 15; const link = (h.$('#email')?.getAttribute('aria-describedby') || '').split(/\s+/).includes('email-error'); return (ok && link) || (ok ? 'нет aria-describedby="email-error" у почты' : 'нужен p#email-error с текстом про формат почты'); } },
        { name: 'Кнопка «Записаться на тренировку»', check: h => h.text('form button') === 'Записаться на тренировку' || `сейчас «${h.text('form button')}»` }
      ]
    },
    {
      id: 'k4503', lesson: 'mdk-45', module: 'mdk5', mech: 'build',
      title: 'Листалка страниц на JavaScript', level: 'Среднее', minutes: 20, points: 150,
      story: 'Новости колледжа разбиты на 5 страниц. Нужна простая пагинация: «Назад», номер страницы, «Вперёд». На первой странице «Назад» не работает, на последней — «Вперёд».',
      goal: 'В script.js заведите переменную page = 1 и константу total = 5. Напишите функцию render(): она пишет в .status текст «Страница N из 5» и отключает кнопки: .prev.disabled = true на первой странице, .next.disabled = true на последней. Вызовите render() сразу. Клик по .next увеличивает page на 1 (если это не последняя страница) и вызывает render(), клик по .prev уменьшает (если это не первая). Ошибок в консоли быть не должно.',
      hints: [
        'Найдите элементы: const prev = document.querySelector(\'.prev\'); так же next и status.',
        'Текст: status.textContent = \'Страница \' + page + \' из \' + total;',
        'Кнопки: prev.disabled = page === 1; next.disabled = page === total;',
        'Клик: next.addEventListener(\'click\', () => { if (page < total) { page = page + 1; render(); } });'
      ],
      html: `<h1>Новости колледжа</h1>
<nav class="pager" aria-label="Страницы новостей">
  <button type="button" class="prev">Назад</button>
  <p class="status">Страница 1 из 5</p>
  <button type="button" class="next">Вперёд</button>
</nav>`,
      css: `${BASE}
.pager { display: flex; align-items: center; gap: 16px; }
.status { margin: 0; }
.pager button { min-width: 44px; min-height: 44px; padding: 0 16px; border: 2px solid #1f5fa8; border-radius: 8px; background: #ffffff; color: #1f5fa8; font-size: 16px; }
.pager button:disabled { border-color: #c4cad4; color: #5a6475; }`,
      js: `// Ваш код здесь
`,
      tests: [
        { name: 'В начале: «Страница 1 из 5», «Назад» отключена, «Вперёд» включена', js: true, check: h => (h.text('.status') === 'Страница 1 из 5' && h.$('.prev').disabled && !h.$('.next').disabled) || `статус «${h.text('.status')}», Назад отключена: ${h.$('.prev').disabled}` },
        { name: 'Клик «Вперёд» → «Страница 2 из 5», «Назад» включается', js: true, check: h => { h.click('.next'); return (h.text('.status') === 'Страница 2 из 5' && !h.$('.prev').disabled) || `после клика: «${h.text('.status')}»`; } },
        { name: 'На последней странице «Вперёд» отключена и дальше 5 не уходит', js: true, check: h => { for (let i = 0; i < 6; i++) h.click('.next'); return (h.text('.status') === 'Страница 5 из 5' && h.$('.next').disabled) || `после 6 кликов: «${h.text('.status')}», Вперёд отключена: ${h.$('.next').disabled}`; } },
        { name: 'Клик «Назад» уменьшает номер страницы', js: true, check: h => { h.click('.next'); h.click('.next'); h.click('.prev'); return h.text('.status') === 'Страница 2 из 5' || `вперёд, вперёд, назад: «${h.text('.status')}»`; } },
        { name: 'Есть функция render и переменная page', js: true, check: h => (typeof h.get('render') === 'function' && h.get('page') === 1) || 'нужны function render() и let page = 1' },
        { name: 'В консоли нет ошибок', js: true, check: h => !h.errors.length || h.errors[0] }
      ]
    }
  );
})();
/* ---- content/tasks/k46.js ---- */
/* Занятие 46. Визуализация элементов интерфейса */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  const TRANSPARENT = 'rgba(0, 0, 0, 0)';
  window.COURSE_TASKS.push(
    {
      id: 'k4601', lesson: 'mdk-46', module: 'mdk5', mech: 'build',
      title: 'Три вида кнопок', level: 'Среднее', minutes: 20, points: 150,
      story: 'Интернет-магазин канцтоваров собирает свой набор кнопок. На странице корзины три действия разной важности, а сейчас все кнопки выглядят как серые прямоугольники браузера.',
      goal: 'Напишите CSS. Общий класс .btn: высота не меньше 44px (min-height), рамка 2px solid transparent, border-radius не меньше 6px, шрифт 16px. .btn-primary: фон #1f5fa8, текст #ffffff. .btn-secondary: прозрачный фон (transparent), рамка цвета #1f5fa8, текст #1f5fa8. .btn-text: прозрачный фон, текст #1f5fa8, подчёркивание (text-decoration: underline), рамку не видно. Добавьте правило .btn-primary:hover с более тёмным фоном #174a84 и правило .btn:focus-visible с обводкой outline.',
      hints: [
        'Общее — в .btn: .btn { min-height: 44px; padding: 0 20px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; }.',
        'Вторичной кнопке нужно поменять только цвет рамки: .btn-secondary { border-color: #1f5fa8; background: transparent; color: #1f5fa8; }.',
        'Текстовой рамку не трогайте — она останется прозрачной из .btn. Достаточно фона, цвета и text-decoration.',
        'Состояния: .btn-primary:hover { background: #174a84; } и .btn:focus-visible { outline: 3px solid #1d2433; outline-offset: 2px; }.'
      ],
      html: `<h1>Корзина</h1>
<p>В корзине 3 товара на сумму 840 ₽.</p>
<div class="actions">
  <button class="btn btn-primary" type="button">Оформить заказ</button>
  <button class="btn btn-secondary" type="button">Продолжить покупки</button>
  <button class="btn btn-text" type="button">Очистить корзину</button>
</div>`,
      css: `${BASE}
.actions { display: flex; flex-wrap: wrap; gap: 12px; }`,
      tests: [
        { name: 'У всех кнопок высота не меньше 44px', check: h => { const b = h.$$('.btn'); return (b.length === 3 && b.every(e => e.getBoundingClientRect().height >= 43.5)) || 'нужен min-height: 44px у .btn'; } },
        { name: '.btn: рамка 2px, скругление от 6px, шрифт 16px', check: h => (h.px('.btn', 'border-top-width') === 2 && h.px('.btn', 'border-top-left-radius') >= 6 && h.px('.btn', 'font-size') === 16) || `рамка ${h.px('.btn', 'border-top-width')}px, скругление ${h.px('.btn', 'border-top-left-radius')}px, шрифт ${h.px('.btn', 'font-size')}px` },
        { name: 'Первичная: фон #1f5fa8, белый текст', check: h => (h.cs('.btn-primary', 'background-color') === rgb('#1f5fa8') && h.cs('.btn-primary', 'color') === rgb('#ffffff')) || 'проверьте фон и цвет .btn-primary' },
        { name: 'Вторичная: прозрачный фон, рамка и текст #1f5fa8', check: h => (h.cs('.btn-secondary', 'background-color') === TRANSPARENT && h.cs('.btn-secondary', 'border-top-color') === rgb('#1f5fa8') && h.cs('.btn-secondary', 'color') === rgb('#1f5fa8')) || 'проверьте фон, border-color и color .btn-secondary' },
        { name: 'Текстовая: прозрачный фон, без видимой рамки, подчёркнута, текст #1f5fa8', check: h => (h.cs('.btn-text', 'background-color') === TRANSPARENT && h.cs('.btn-text', 'border-top-color') === TRANSPARENT && /underline/.test(h.cs('.btn-text', 'text-decoration-line')) && h.cs('.btn-text', 'color') === rgb('#1f5fa8')) || 'проверьте фон, рамку, color и text-decoration .btn-text' },
        { name: 'Есть .btn-primary:hover с фоном #174a84', check: h => { const r = h.rules.find(x => x.selector === '.btn-primary:hover'); return !!(r && /174a84|rgb\(23, 74, 132\)/i.test(r.style.backgroundColor || r.style.background)) || 'нет правила .btn-primary:hover { background: #174a84; }'; } },
        { name: 'Есть .btn:focus-visible с обводкой outline', check: h => { const r = h.rules.find(x => x.selector === '.btn:focus-visible'); return !!(r && (r.style.outlineStyle || r.style.outline) && r.style.outlineStyle !== 'none') || 'нет правила .btn:focus-visible { outline: … }'; } }
      ]
    },
    {
      id: 'k4602', lesson: 'mdk-46', module: 'mdk5', mech: 'a11y',
      title: 'Панель с иконками и бейджем', level: 'Среднее', minutes: 20, points: 150,
      story: 'Нижняя панель приложения «Электронный дневник» состоит из четырёх одинаковых иконок без подписей. Студенты нажимают наугад, а на телефоне ещё и промахиваются: кнопки крошечные.',
      goal: 'В каждую кнопку .tab после иконки добавьте подпись span.label: «Расписание», «Оценки», «Уведомления», «Профиль». Иконкам поставьте alt="" (они теперь украшение). Кнопка — flex-колонка: иконка над подписью. Каждая кнопка не меньше 44×44 пикселей. В кнопку «Уведомления» после подписи добавьте бейдж span.badge с числом 3: фон #c62828, белый текст, шрифт не больше 14px, border-radius не меньше 8px.',
      hints: [
        'Разметка одной кнопки: <button class="tab" type="button"><img src="img/icon.svg" alt=""><span class="label">Расписание</span></button>.',
        'Иконка над подписью: .tab { display: flex; flex-direction: column; align-items: center; gap: 4px; }.',
        'Размер: .tab { min-width: 44px; min-height: 44px; } — даже если иконка 20×20.',
        'Бейдж: .badge { padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 12px; font-weight: bold; }.'
      ],
      html: `<h1>Дневник</h1>
<nav class="tabbar" aria-label="Разделы">
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
  <button class="tab" type="button"><img src="${ICON}"></button>
</nav>`,
      css: `${BASE}
.tabbar { display: flex; justify-content: space-around; padding: 8px 0; border-top: 1px solid #c4cad4; }
.tab { padding: 4px; border: 0; background: transparent; color: #1d2433; }
.tab img { width: 16px; height: 16px; }`,
      tests: [
        { name: 'В каждой из 4 кнопок есть подпись span.label', check: h => { const t = h.$$('.tab'); const ok = t.filter(b => (b.querySelector('.label')?.textContent.trim().length || 0) >= 4); return (t.length === 4 && ok.length === 4) || `с подписью: ${ok.length} из ${t.length}`; } },
        { name: 'Подписи: Расписание, Оценки, Уведомления, Профиль', check: h => h.$$('.tab .label').map(e => e.textContent.trim()).join('|') === 'Расписание|Оценки|Уведомления|Профиль' || `сейчас: ${h.$$('.tab .label').map(e => e.textContent.trim()).join(', ') || 'нет'}` },
        { name: 'У иконок пустой alt=""', check: h => { const i = h.$$('.tab img'); return (i.length === 4 && i.every(e => e.getAttribute('alt') === '')) || 'нужно alt="" у каждой иконки'; } },
        { name: 'Иконка стоит над подписью', check: h => { const t = h.$$('.tab'); return (t.length === 4 && t.every(b => { const i = b.querySelector('img'), l = b.querySelector('.label'); return i && l && i.getBoundingClientRect().bottom <= l.getBoundingClientRect().top + 1; })) || 'сделайте .tab flex-колонкой'; } },
        { name: 'Каждая кнопка не меньше 44×44', check: h => { const bad = h.$$('.tab').filter(b => { const r = b.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }); return !bad.length || `меньше 44×44: ${bad.length}`; } },
        { name: 'В кнопке «Уведомления» бейдж .badge с числом 3', check: h => { const b = h.$$('.tab')[2]; return (b?.querySelector('.badge')?.textContent.trim() === '3' && h.count('.badge') === 1) || 'нужен <span class="badge">3</span> в третьей кнопке'; } },
        { name: 'Бейдж: фон #c62828, белый текст, шрифт до 14px, скругление от 8px', check: h => (h.cs('.badge', 'background-color') === rgb('#c62828') && h.cs('.badge', 'color') === rgb('#ffffff') && h.px('.badge', 'font-size') <= 14 && h.px('.badge', 'border-top-left-radius') >= 8) || 'проверьте фон, цвет, размер шрифта и border-radius .badge' }
      ]
    },
    {
      id: 'k4603', lesson: 'mdk-46', module: 'mdk5', mech: 'build',
      title: 'Уведомление «Товар в корзине»', level: 'Среднее', minutes: 15, points: 150,
      story: 'Покупатель нажимает «В корзину» и не понимает, сработало или нет. Нужна обратная связь: всплывающее уведомление и счётчик-бейдж у корзины.',
      goal: 'В script.js: по клику на .add показывайте уведомление .toast (уберите hidden) и увеличивайте число в бейдже .cart-count на 1 (было 0 → 1 → 2…). По клику на крестик .toast-close уведомление снова прячется (hidden = true). Ошибок в консоли быть не должно.',
      hints: [
        'Найдите элементы через document.querySelector: .add, .toast, .toast-close, .cart-count.',
        'Показать и спрятать: toast.hidden = false; и toast.hidden = true;',
        'Счётчик: заведите let count = 0; при клике count = count + 1; cartCount.textContent = count;'
      ],
      html: `<header class="top">
  <p class="shop">Канцтовары</p>
  <p class="cart">Корзина <span class="cart-count">0</span></p>
</header>
<h1>Тетрадь в клетку, 96 листов</h1>
<p>Цена: 120 ₽</p>
<button class="add" type="button">В корзину</button>
<div class="toast" role="status" hidden>
  Товар добавлен в корзину
  <button class="toast-close" type="button" aria-label="Закрыть уведомление">×</button>
</div>`,
      css: `${BASE}
.top { display: flex; justify-content: space-between; align-items: center; }
.shop { font-weight: bold; }
.cart-count { display: inline-block; min-width: 20px; padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 13px; font-weight: bold; text-align: center; }
.add { min-height: 44px; padding: 0 20px; border: 0; border-radius: 8px; background: #1f5fa8; color: #ffffff; font-size: 16px; }
.toast { margin-top: 16px; padding: 8px 8px 8px 16px; border-radius: 8px; background: #1d2433; color: #ffffff; }
.toast-close { min-width: 44px; min-height: 44px; border: 0; background: transparent; color: #ffffff; font-size: 20px; }
[hidden] { display: none; }`,
      js: `// Ваш код здесь
`,
      tests: [
        { name: 'В начале уведомление спрятано, в корзине 0', js: true, check: h => (!h.visible('.toast') && h.text('.cart-count') === '0') || 'уведомление должно быть скрыто, счётчик 0' },
        { name: 'Клик «В корзину» показывает уведомление', js: true, check: h => { h.click('.add'); return h.visible('.toast') || 'после клика .toast не видно'; } },
        { name: 'Каждый клик увеличивает счётчик: 0 → 1 → 2', js: true, check: h => { h.click('.add'); const a = h.text('.cart-count'); h.click('.add'); const b = h.text('.cart-count'); return (a === '1' && b === '2') || `после кликов: ${a}, ${b}`; } },
        { name: 'Крестик прячет уведомление', js: true, check: h => { h.click('.add'); h.click('.toast-close'); return !h.visible('.toast') || 'после крестика уведомление видно'; } },
        { name: 'После закрытия «В корзину» снова показывает уведомление', js: true, check: h => { h.click('.add'); h.click('.toast-close'); h.click('.add'); return h.visible('.toast') || 'уведомление не появилось второй раз'; } },
        { name: 'В консоли нет ошибок', js: true, check: h => { h.click('.add'); h.click('.toast-close'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k47.js ---- */
/* Занятие 47. UI-kit и стайлгайд */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // значение CSS-переменной на :root: без пробелов по краям, без кавычек, строчными
  const v = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().replace(/["']/g, '').replace(/\s*,\s*/g, ', ').toLowerCase();
  const mismatch = (h, want) => Object.entries(want).filter(([k, val]) => v(h, k) !== val.toLowerCase()).map(([k]) => k);
  // правила, где цвет записан числом (HEX или rgb), кроме :root и body из базовых стилей
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const ruleProp = (h, sel, prop) => (h.rules.find(r => r.selector === sel && !r.media)?.style.getPropertyValue(prop) || '');

  const ROOT47 = `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`;

  window.COURSE_TASKS.push(
    {
      id: 'k4701', lesson: 'mdk-47', module: 'mdk5', mech: 'build',
      title: 'Стайлгайд в переменных', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Дизайнер сдал стайлгайд сайта библиотеки колледжа. Страница-образец стайлгайда уже свёрстана, но все её стили ссылаются на переменные, которых ещё нет, — поэтому образцы цветов пустые.',
      goal: 'В начале CSS напишите правило :root с переменными стайлгайда: --color-primary: #1f5fa8; --color-primary-dark: #174a84; --color-accent: #e8a33d; --color-text: #1d2433; --color-muted: #5a6475; --color-surface: #f2f5fa; --font-main: Arial, sans-serif; --font-heading: Georgia, serif; --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px; --radius: 8px. Остальной CSS не меняйте: образцы должны «ожить» сами.',
      hints: [
        'Каркас: :root { --color-primary: #1f5fa8; } — имя с двумя дефисами, двоеточие, значение, точка с запятой.',
        'Пишите каждую переменную с новой строки: так проще сверять с таблицей стайлгайда.',
        'Имена должны совпадать буква в букву: --color-primary-dark, а не --color-dark-primary. Шрифт: --font-main: Arial, sans-serif;'
      ],
      html: `<main class="guide">
  <h1>Стайлгайд: библиотека колледжа</h1>
  <h2>Палитра</h2>
  <ul class="swatches">
    <li class="swatch swatch-primary"><code>--color-primary</code></li>
    <li class="swatch swatch-primary-dark"><code>--color-primary-dark</code></li>
    <li class="swatch swatch-accent"><code>--color-accent</code></li>
    <li class="swatch swatch-text"><code>--color-text</code></li>
    <li class="swatch swatch-muted"><code>--color-muted</code></li>
    <li class="swatch swatch-surface"><code>--color-surface</code></li>
  </ul>
  <h2>Шрифты</h2>
  <p class="sample-heading">Georgia — заголовки</p>
  <p class="sample-muted">Arial — основной и приглушённый текст</p>
  <h2>Отступы и скругление</h2>
  <ul class="spaces">
    <li class="space"><span class="bar bar-1"></span> --space-1</li>
    <li class="space"><span class="bar bar-2"></span> --space-2</li>
    <li class="space"><span class="bar bar-3"></span> --space-3</li>
    <li class="space"><span class="bar bar-4"></span> --space-4</li>
  </ul>
</main>`,
      css: `${BASE}
/* Сюда — правило :root с переменными стайлгайда */

.guide { font-family: var(--font-main); color: var(--color-text); }
.guide h1, .guide h2, .sample-heading { font-family: var(--font-heading); }
.swatches { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.swatch { width: 160px; padding: var(--space-1); border-radius: var(--radius); background: var(--color-surface); font-size: 13px; }
.swatch::before { content: ""; display: block; height: 48px; margin-bottom: var(--space-1); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.swatch-primary::before { background: var(--color-primary); }
.swatch-primary-dark::before { background: var(--color-primary-dark); }
.swatch-accent::before { background: var(--color-accent); }
.swatch-text::before { background: var(--color-text); }
.swatch-muted::before { background: var(--color-muted); }
.swatch-surface::before { background: var(--color-surface); }
.sample-heading { font-size: 28px; }
.sample-muted { color: var(--color-muted); }
.spaces { margin: 0; padding: 0; list-style: none; }
.space { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1); }
.bar { height: 16px; background: var(--color-accent); }
.bar-1 { width: var(--space-1); }
.bar-2 { width: var(--space-2); }
.bar-3 { width: var(--space-3); }
.bar-4 { width: var(--space-4); }`,
      tests: [
        { name: 'Переменные объявлены в правиле :root', check: h => !!h.rules.find(r => r.selector === ':root' && r.style.length >= 13) || 'нет правила :root со всеми переменными' },
        { name: 'Шесть цветов палитры совпадают со стайлгайдом', check: h => { const bad = mismatch(h, { '--color-primary': '#1f5fa8', '--color-primary-dark': '#174a84', '--color-accent': '#e8a33d', '--color-text': '#1d2433', '--color-muted': '#5a6475', '--color-surface': '#f2f5fa' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Шрифты: --font-main и --font-heading', check: h => { const bad = mismatch(h, { '--font-main': 'arial, sans-serif', '--font-heading': 'georgia, serif' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Отступы --space-1…--space-4 и --radius', check: h => { const bad = mismatch(h, { '--space-1': '8px', '--space-2': '16px', '--space-3': '24px', '--space-4': '32px', '--radius': '8px' }); return !bad.length || `не так: ${bad.join(', ')}`; } },
        { name: 'Образцы цветов «ожили»', check: h => { const c = s => h.win.getComputedStyle(h.$(s), '::before').backgroundColor; return (c('.swatch-primary') === rgb('#1f5fa8') && c('.swatch-accent') === rgb('#e8a33d')) || 'образец основного цвета пустой'; } },
        { name: 'Заголовки шрифтом Georgia, текст Arial', check: h => (/georgia/i.test(h.cs('h1', 'font-family')) && /arial/i.test(h.cs('.sample-muted', 'font-family'))) || 'шрифты не применились' },
        { name: 'Полоски отступов: 8, 16, 24 и 32px', check: h => h.$$('.bar').map(e => Math.round(e.getBoundingClientRect().width)).join(',') === '8,16,24,32' || `сейчас ${h.$$('.bar').map(e => Math.round(e.getBoundingClientRect().width)).join(', ')}` }
      ]
    },
    {
      id: 'k4702', lesson: 'mdk-47', module: 'mdk5', mech: 'build',
      title: 'Компоненты из переменных', level: 'Среднее', minutes: 20, points: 150,
      story: 'Переменные стайлгайда библиотеки уже в :root. Теперь из них нужно собрать компоненты UI-kit: карточку, бейдж, поле и две кнопки. Правило команды: внутри классов — никаких HEX-кодов, только var().',
      goal: 'Допишите CSS, используя только переменные из :root (HEX и rgb вне :root запрещены). .card: padding var(--space-3), border-radius var(--radius), фон --color-surface. .card-text: цвет --color-muted. .badge: фон --color-accent, цвет --color-text, скругление --radius, padding var(--space-1). .label: display: block и отступ снизу --space-1. .field: min-height 44px, рамка 1px solid --color-muted, скругление --radius, padding 0 var(--space-2). .btn: min-height 44px, padding 0 var(--space-3), рамка 2px solid transparent, скругление --radius, шрифт 16px. .btn-primary: фон --color-primary, текст --color-on-primary; .btn-primary:hover: фон --color-primary-dark. .btn-secondary: прозрачный фон, цвет рамки и текста --color-primary.',
      hints: [
        'Карточка: .card { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }.',
        'Поле: .field { min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }.',
        'Кнопки: общий размер — в .btn, цвета — в .btn-primary и .btn-secondary. Для вторичной: border-color: var(--color-primary); background: transparent; color: var(--color-primary);',
        'Белый текст на кнопке — тоже переменная: color: var(--color-on-primary). Найдите поиском «#» — HEX должен остаться только в :root.'
      ],
      html: `<div class="page">
  <h1>Запись в читальный зал</h1>
  <article class="card">
    <h2>Место у окна</h2>
    <p class="card-text">Свободно сегодня с 14:00 до 18:00. Рядом розетка и лампа.</p>
    <span class="badge">Свободно</span>
  </article>
  <form class="form">
    <label class="label" for="ticket">Номер читательского билета</label>
    <input class="field" id="ticket" name="ticket" type="text">
    <div class="actions">
      <button class="btn btn-primary" type="submit">Забронировать</button>
      <button class="btn btn-secondary" type="button">Отмена</button>
    </div>
  </form>
</div>`,
      css: `${BASE}
${ROOT47}
.page { max-width: 480px; font-family: var(--font-main); color: var(--color-text); }
.page h1, .page h2 { font-family: var(--font-heading); }
.form { margin-top: var(--space-4); }
.actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
/* Ниже — ваши компоненты: .card, .card-text, .badge, .label, .field, .btn, .btn-primary, .btn-primary:hover, .btn-secondary */
`,
      tests: [
        { name: 'Карточка: padding 24px, скругление 8px, фон --color-surface', check: h => (h.px('.card', 'padding-top') === 24 && h.px('.card', 'border-top-left-radius') === 8 && h.cs('.card', 'background-color') === rgb('#f2f5fa')) || 'проверьте padding, border-radius и background у .card' },
        { name: 'Текст карточки — цвет --color-muted', check: h => h.cs('.card-text', 'color') === rgb('#5a6475') || 'нужно color: var(--color-muted)' },
        { name: 'Бейдж: фон --color-accent, текст --color-text, скругление 8px', check: h => (h.cs('.badge', 'background-color') === rgb('#e8a33d') && h.cs('.badge', 'color') === rgb('#1d2433') && h.px('.badge', 'border-top-left-radius') === 8 && h.px('.badge', 'padding-left') === 8) || 'проверьте фон, цвет, padding и скругление .badge' },
        { name: 'Подпись над полем, поле высотой от 44px с рамкой --color-muted', check: h => { const l = h.rect('.label'), f = h.rect('.field'); return !!(l && f && l.bottom <= f.top + 1 && f.height >= 43.5 && h.cs('.field', 'border-top-color') === rgb('#5a6475') && h.px('.field', 'border-top-width') === 1 && h.px('.field', 'border-top-left-radius') === 8 && h.px('.field', 'padding-left') === 16) || 'проверьте .label { display: block } и стили .field'; } },
        { name: 'Кнопки: высота от 44px, рамка 2px, скругление 8px, отступ 24px', check: h => { const b = h.$$('.btn'); return (b.length === 2 && b.every(e => e.getBoundingClientRect().height >= 43.5 && h.px(e, 'border-top-width') === 2 && h.px(e, 'border-top-left-radius') === 8 && h.px(e, 'padding-left') === 24)) || 'проверьте .btn'; } },
        { name: 'Первичная: фон --color-primary, текст --color-on-primary', check: h => (h.cs('.btn-primary', 'background-color') === rgb('#1f5fa8') && h.cs('.btn-primary', 'color') === rgb('#ffffff')) || 'проверьте .btn-primary' },
        { name: 'Вторичная: прозрачный фон, рамка и текст --color-primary', check: h => (h.cs('.btn-secondary', 'background-color') === 'rgba(0, 0, 0, 0)' && h.cs('.btn-secondary', 'border-top-color') === rgb('#1f5fa8') && h.cs('.btn-secondary', 'color') === rgb('#1f5fa8')) || 'проверьте .btn-secondary' },
        { name: '.btn-primary:hover берёт фон из --color-primary-dark', check: h => /var\(\s*--color-primary-dark\s*\)/.test(ruleProp(h, '.btn-primary:hover', 'background-color') || ruleProp(h, '.btn-primary:hover', 'background')) || 'нет .btn-primary:hover { background: var(--color-primary-dark); }' },
        { name: 'Отступы взяты из переменных --space-…', check: h => (/var\(--space/.test(ruleProp(h, '.card', 'padding')) && /var\(--space/.test(ruleProp(h, '.btn', 'padding'))) || 'у .card и .btn padding через var(--space-…)' },
        { name: 'Вне :root нет HEX и rgb — только переменные', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } }
      ]
    },
    {
      id: 'k4703', lesson: 'mdk-47', module: 'mdk5', mech: 'optimize',
      title: 'Цвета — в переменные', level: 'Среднее', minutes: 20, points: 150,
      story: 'Страницу кружка робототехники сверстали без стайлгайда: основной синий повторяется в CSS пять раз. Руководитель кружка хочет сменить цвет, и никто не уверен, что найдёт все места.',
      goal: 'Добавьте в начало CSS правило :root с переменными: --color-primary: #1f5fa8; --color-primary-dark: #174a84; --color-on-primary: #ffffff; --color-text: #1d2433; --color-surface: #f2f5fa. Замените все цвета в остальных правилах на var(…): HEX и rgb должны остаться только в :root (правило body из базовых стилей не трогайте). Внешне страница не должна измениться.',
      hints: [
        'Сначала соберите все разные цвета из CSS: их ровно пять. Каждому — переменная по роли.',
        'Замена по одному: background: #1f5fa8; → background: var(--color-primary);',
        'Белый текст на синем — var(--color-on-primary), тёмный текст — var(--color-text).',
        'В конце найдите поиском «#»: HEX-коды остаются только в :root и в body.'
      ],
      html: `<header class="header">
  <p class="logo">Робокружок</p>
  <nav class="nav" aria-label="Главное меню">
    <a href="#about">О кружке</a>
    <a href="#signup">Запись</a>
  </nav>
</header>
<section class="hero">
  <h1>Соберите своего первого робота</h1>
  <p>Занятия по вторникам и четвергам в мастерской 112. Детали и ноутбуки выдаём.</p>
  <a class="btn" href="#signup">Записаться в кружок</a>
</section>
<footer class="footer">
  <p>Вопросы — <a href="mailto:robo@college.ru">robo@college.ru</a></p>
</footer>`,
      css: `${BASE}
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #1f5fa8; }
.logo { margin: 0; color: #ffffff; font-weight: bold; }
.nav { display: flex; gap: 16px; }
.nav a { color: #ffffff; }
.hero { padding: 32px 24px; background: #f2f5fa; }
.hero h1 { margin: 0 0 16px; color: #1d2433; }
.hero p { color: #1d2433; }
.btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background: #1f5fa8; color: #ffffff; text-decoration: none; }
.btn:hover { background: #174a84; }
.footer { padding: 16px 24px; border-top: 4px solid #1f5fa8; color: #1d2433; }
.footer a { color: #1f5fa8; }`,
      tests: [
        { name: 'В :root объявлены пять переменных палитры', check: h => { const bad = mismatch(h, { '--color-primary': '#1f5fa8', '--color-primary-dark': '#174a84', '--color-on-primary': '#ffffff', '--color-text': '#1d2433', '--color-surface': '#f2f5fa' }); return (!bad.length && !!h.rules.find(r => r.selector === ':root')) || `не так или нет: ${bad.join(', ')}`; } },
        { name: 'Вне :root и body нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } },
        { name: '#1f5fa8 встречается в CSS один раз', check: h => h.occurrences('#1f5fa8') === 1 || `сейчас ${h.occurrences('#1f5fa8')} раз` },
        { name: 'var(--color-primary) используется хотя бы 4 раза', check: h => h.occurrences('var(--color-primary)') >= 4 || `сейчас ${h.occurrences('var(--color-primary)')}` },
        { name: 'Наведение на кнопку берёт var(--color-primary-dark)', check: h => /var\(\s*--color-primary-dark\s*\)/.test(ruleProp(h, '.btn:hover', 'background-color') || ruleProp(h, '.btn:hover', 'background')) || 'в .btn:hover нужен var(--color-primary-dark)' },
        { name: 'Страница выглядит как раньше', check: h => (h.cs('.header', 'background-color') === rgb('#1f5fa8') && h.cs('.nav a', 'color') === rgb('#ffffff') && h.cs('.hero', 'background-color') === rgb('#f2f5fa') && h.cs('.hero h1', 'color') === rgb('#1d2433') && h.cs('.btn', 'background-color') === rgb('#1f5fa8') && h.cs('.footer', 'border-top-color') === rgb('#1f5fa8') && h.cs('.footer a', 'color') === rgb('#1f5fa8')) || 'какой-то цвет изменился или переменная не находится' }
      ]
    }
  );
})();
/* ---- content/tasks/k48.js ---- */
/* Занятие 48. Практическая работа №10 (ч. 1). Прототип дизайна: главная страница */
(() => {
  const { BASE, IMG, ICON, rgb } = window.COURSE_KIT;
  // Стайлгайд проекта «Читальный зал» (тот же, что на занятии 47, плюс цвет успеха)
  const ROOT = `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --color-success: #2e7d32;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`;
  const BTN = `.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; text-decoration: none; }
.btn:focus-visible { outline: 3px solid var(--color-text); outline-offset: 2px; }
.btn-secondary { border-color: var(--color-primary); color: var(--color-primary); }`;
  const BTN_PRIMARY = `.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }`;
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const noLiterals = { name: 'Цвета только из переменных: вне :root нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } };
  const noOverflow = { name: 'На телефоне 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' };
  const stacked = (h, sel) => { const e = h.$$(sel); return e.length > 1 && e.every((x, i) => i === 0 || x.getBoundingClientRect().top >= e[i - 1].getBoundingClientRect().bottom - 1); };
  const gapVar = (h, sel) => h.rules.some(r => r.selector === sel && /var\(--space/.test(r.style.getPropertyValue('gap') || r.style.getPropertyValue('row-gap') || ''));

  window.COURSE_TASKS.push(
    {
      id: 'k4801', lesson: 'mdk-48', module: 'mdk5', mech: 'build',
      title: 'Прототип: шапка и первый экран', level: 'Сложное', minutes: 30, points: 200,
      story: 'Начинаем верстать главную страницу «Читального зала» по ТЗ из урока. Стайлгайд уже в :root, классы кнопок готовы. Ваша часть — шапка и первый экран.',
      goal: 'Внутри .page сверстайте: 1) header.header — логотип p.logo «Читальный зал» и nav.nav с aria-label, внутри ul из 3–4 ссылок; шапка — flex, логотип слева, меню справа (justify-content: space-between), ссылки меню в одну строку; фон шапки — var(--color-primary), ссылки и логотип — var(--color-on-primary). 2) После шапки section.hero: один h1, абзац p и блок .hero-actions с двумя ссылками: «Найти книгу» (.btn .btn-primary) и «Забронировать место» (.btn .btn-secondary) в одну строку. h1 хотя бы в 2 раза крупнее абзаца. Фон hero — var(--color-surface), padding не меньше 24px. Цвета — только через var(). На 360px нет горизонтальной прокрутки.',
      hints: [
        'Каркас шапки: <header class="header"><p class="logo">Читальный зал</p><nav class="nav" aria-label="Главное меню"><ul><li><a href="#catalog">Каталог</a></li>…</ul></nav></header>.',
        'Шапка: .header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-primary); }. Меню: .nav ul { display: flex; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }.',
        'Белый текст: .logo, .nav a { color: var(--color-on-primary); }. У .logo уберите margin: 0, чтобы шапка не была высокой.',
        'Первый экран: .hero { padding: var(--space-4) var(--space-3); background: var(--color-surface); }, .hero h1 { font-size: 40px; }, .hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }.'
      ],
      html: `<div class="page">
  <!-- 1. Шапка header.header: логотип p.logo «Читальный зал» и меню nav.nav (ul из 3–4 ссылок) -->

  <!-- 2. Первый экран section.hero: h1, абзац и .hero-actions с кнопками «Найти книгу» и «Забронировать место» -->

</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h1 { font-family: var(--font-heading); line-height: 1.2; }
${BTN}
${BTN_PRIMARY}
/* Ниже — ваши стили шапки и первого экрана */
`,
      tests: [
        { name: 'header.header: логотип .logo и nav.nav с aria-label и 3–4 ссылками', check: h => { const n = h.count('.header nav.nav[aria-label] ul a[href]'); return (!!h.$('.page header.header .logo') && n >= 3 && n <= 4) || `логотип: ${h.count('.header .logo')}, ссылок в меню: ${n}`; } },
        { name: 'Шапка — flex: логотип слева, меню справа в одной строке', check: h => (h.cs('.header', 'display') === 'flex' && h.cs('.header', 'justify-content') === 'space-between' && (() => { const l = h.rect('.header .logo'), n = h.rect('.header .nav'); const mid = (l.top + l.bottom) / 2; return mid > n.top && mid < n.bottom && l.right < n.left; })()) || 'нужно .header { display: flex; justify-content: space-between; }' },
        { name: 'Ссылки меню в одну строку', check: h => { const a = h.$$('.header .nav a'); return (a.length >= 3 && h.sameRow(a)) || 'сделайте список меню flex-контейнером'; } },
        { name: 'Шапка: фон --color-primary, логотип и ссылки --color-on-primary', check: h => (h.cs('.header', 'background-color') === rgb('#1f5fa8') && h.cs('.header .logo', 'color') === rgb('#ffffff') && h.$$('.header .nav a').every(a => h.cs(a, 'color') === rgb('#ffffff'))) || 'проверьте background шапки и color логотипа и ссылок' },
        { name: 'После шапки section.hero: h1, абзац и две кнопки', check: h => (h.count('h1') === 1 && !!h.$('section.hero h1') && !!h.$('.hero p') && h.before('.header', '.hero') && !!h.$('.hero .hero-actions .btn.btn-primary') && !!h.$('.hero .hero-actions .btn.btn-secondary')) || 'нужны section.hero с h1, p и .hero-actions с .btn-primary и .btn-secondary' },
        { name: 'Кнопки «Найти книгу» (первичная) и «Забронировать место» (вторичная) в одну строку', check: h => (h.text('.hero .btn-primary') === 'Найти книгу' && h.text('.hero .btn-secondary') === 'Забронировать место' && h.sameRow(['.hero .btn-primary', '.hero .btn-secondary'])) || 'проверьте тексты кнопок и flex у .hero-actions' },
        { name: 'h1 хотя бы в 2 раза крупнее абзаца первого экрана', check: h => h.px('.hero h1', 'font-size') >= 2 * h.px('.hero p', 'font-size') - 0.5 || `h1 ${h.px('.hero h1', 'font-size')}px, абзац ${h.px('.hero p', 'font-size')}px` },
        { name: 'Первый экран: фон --color-surface, padding от 24px', check: h => (h.cs('.hero', 'background-color') === rgb('#f2f5fa') && h.px('.hero', 'padding-top') >= 24 && h.px('.hero', 'padding-left') >= 24) || 'проверьте background и padding у .hero' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4802', lesson: 'mdk-48', module: 'mdk5', mech: 'adaptive',
      title: 'Прототип: блок «Почему у нас удобно»', level: 'Среднее', minutes: 25, points: 150,
      story: 'Следующий блок главной по ТЗ — три преимущества библиотеки. На компьютере они стоят в ряд, на телефоне — друг под другом.',
      goal: 'В section.features после h2 добавьте div.features-list и в нём три article.feature: в каждой иконка img (src="img/icon.svg", alt=""), заголовок h3 и абзац p. Стили (mobile first): .features-list — grid с gap через var(--space-…); с 768px (@media (min-width: 768px)) — три колонки, на 360px карточки друг под другом. Карточка .feature: фон var(--color-surface), скругление var(--radius), padding не меньше 16px. Цвета только через var(), горизонтальной прокрутки на 360px нет.',
      hints: [
        'Одна карточка: <article class="feature"><img src="img/icon.svg" alt=""><h3>Тихие места</h3><p>40 мест с лампами и розетками.</p></article>.',
        'Mobile first: .features-list { display: grid; gap: var(--space-3); } — на телефоне это уже одна колонка.',
        'Для компьютера: @media (min-width: 768px) { .features-list { grid-template-columns: repeat(3, 1fr); } }.',
        'Карточка: .feature { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }. Иконке задайте размер: .feature img { width: 32px; height: 32px; }.'
      ],
      html: `<div class="page">
  <section class="features">
    <h2>Почему у нас удобно</h2>
    <!-- div.features-list с тремя article.feature: иконка, h3, абзац -->

  </section>
</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h2 { font-family: var(--font-heading); font-size: 28px; }
/* Ниже — стили блока преимуществ */
`,
      tests: [
        { name: 'В .features-list три article.feature с иконкой, h3 и абзацем', check: h => { const f = h.$$('.features .features-list > article.feature'); return (f.length === 3 && f.every(e => e.querySelector('img') && e.querySelector('h3')?.textContent.trim() && e.querySelector('p')?.textContent.trim())) || `карточек: ${f.length}`; } },
        { name: 'У иконок пустой alt="" (рядом есть заголовок)', check: h => { const i = h.$$('.feature img'); return (i.length === 3 && i.every(e => e.getAttribute('alt') === '')) || 'нужно alt="" у иконок'; } },
        { name: '.features-list — grid, gap через var(--space-…)', check: h => (h.cs('.features-list', 'display') === 'grid' && gapVar(h, '.features-list')) || 'нужно .features-list { display: grid; gap: var(--space-3); }' },
        { name: 'На компьютере три карточки в ряд', check: h => (h.count('.feature') === 3 && h.sameRow(h.$$('.feature'))) || 'добавьте @media (min-width: 768px) с тремя колонками' },
        { name: 'На телефоне карточки друг под другом', at: 360, check: h => stacked(h, '.feature') || 'на 360px карточки должны идти в колонку' },
        { name: 'Карточка: фон --color-surface, скругление 8px, padding от 16px', check: h => (h.cs('.feature', 'background-color') === rgb('#f2f5fa') && h.px('.feature', 'border-top-left-radius') === 8 && h.px('.feature', 'padding-top') >= 16) || 'проверьте .feature' },
        { name: 'Заголовки карточек — шрифт заголовков Georgia', check: h => /georgia/i.test(h.cs('.feature h3', 'font-family')) || 'добавьте h3 к правилу шрифта заголовков' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4803', lesson: 'mdk-48', module: 'mdk5', mech: 'build',
      title: 'Прототип: новые поступления и подвал', level: 'Сложное', minutes: 30, points: 200,
      story: 'Последние блоки главной: сетка карточек новых книг и подвал с контактами. Карточка книги — компонент, который пригодится на странице каталога.',
      goal: 'В section.new-books после h2 добавьте ul.cards с тремя li.card. В карточке: img (src="img/art.svg", непустой alt), h3 с названием, p.author с автором, span.badge «Новинка» и ссылка «Забронировать» с классами btn btn-secondary. Сетка .cards — grid с gap через var(--space-…): на компьютере три карточки в ряд, на 360px друг под другом (mobile first). Карточка: padding от 16px, скругление var(--radius), рамка или фон. Картинка не шире карточки. .author — цвет var(--color-muted), .badge — фон var(--color-accent) и цвет var(--color-text). После секции — footer.footer: ссылки на телефон (href="tel:…") и почту (href="mailto:…"); фон подвала var(--color-text), текст и ссылки var(--color-on-primary). Цвета только через var().',
      hints: [
        'Карточка: <li class="card"><img src="img/art.svg" alt="Обложка книги «…»"><h3>…</h3><p class="author">…</p><span class="badge">Новинка</span> <a class="btn btn-secondary" href="#">Забронировать</a></li>.',
        'Сетка: .cards { display: grid; gap: var(--space-3); margin: 0; padding: 0; list-style: none; } и @media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); } }.',
        'Картинка: .card img { display: block; width: 100%; height: auto; border-radius: var(--radius); }.',
        'Подвал: .footer { margin-top: var(--space-4); padding: var(--space-3); background: var(--color-text); color: var(--color-on-primary); } и .footer a { color: var(--color-on-primary); }.'
      ],
      html: `<div class="page">
  <section class="new-books">
    <h2>Новые поступления</h2>
    <!-- ul.cards с тремя li.card -->

  </section>
  <!-- footer.footer: адрес, телефон (tel:), почта (mailto:) -->

</div>`,
      css: `${BASE}
${ROOT}
.page { font-family: var(--font-main); color: var(--color-text); }
.page h2, .page h3 { font-family: var(--font-heading); }
${BTN}
/* Ниже — стили карточек и подвала */
`,
      tests: [
        { name: 'ul.cards: три li.card с картинкой (alt), h3, .author, .badge и ссылкой', check: h => { const c = h.$$('.new-books ul.cards > li.card'); return (c.length === 3 && c.every(e => e.querySelector('img')?.alt.trim() && e.querySelector('h3')?.textContent.trim() && e.querySelector('.author')?.textContent.trim() && e.querySelector('.badge')?.textContent.trim() === 'Новинка' && e.querySelector('a.btn.btn-secondary[href]'))) || `полных карточек: ${c.filter(e => e.querySelector('img')?.alt.trim() && e.querySelector('h3') && e.querySelector('.author') && e.querySelector('.badge') && e.querySelector('a.btn.btn-secondary')).length} из 3`; } },
        { name: '.cards — grid, gap через var(--space-…)', check: h => (h.cs('.cards', 'display') === 'grid' && gapVar(h, '.cards')) || 'нужно .cards { display: grid; gap: var(--space-…); }' },
        { name: 'На компьютере три карточки в ряд', check: h => (h.count('.card') === 3 && h.sameRow(h.$$('.card'))) || 'добавьте три колонки в @media (min-width: 768px)' },
        { name: 'На телефоне карточки друг под другом, картинки не шире карточек', at: 360, check: h => (stacked(h, '.card') && h.$$('.card img').every(i => h.inside(i, i.closest('.card')))) || 'на 360px — колонка и img { width: 100%; }' },
        { name: 'Карточка: padding от 16px, скругление 8px, рамка или фон', check: h => (h.px('.card', 'padding-top') >= 16 && h.px('.card', 'border-top-left-radius') === 8 && (h.px('.card', 'border-top-width') > 0 || h.cs('.card', 'background-color') !== 'rgba(0, 0, 0, 0)')) || 'проверьте .card' },
        { name: 'Автор — --color-muted, бейдж — фон --color-accent и текст --color-text', check: h => (h.cs('.author', 'color') === rgb('#5a6475') && h.cs('.badge', 'background-color') === rgb('#e8a33d') && h.cs('.badge', 'color') === rgb('#1d2433')) || 'проверьте .author и .badge' },
        { name: 'footer.footer после секции: ссылки tel: и mailto:', check: h => (h.before('.new-books', 'footer.footer') && !!h.$('.footer a[href^="tel:"]') && !!h.$('.footer a[href^="mailto:"]')) || 'нужен footer.footer с ссылками tel: и mailto:' },
        { name: 'Подвал: фон --color-text, текст и ссылки --color-on-primary', check: h => (h.cs('.footer', 'background-color') === rgb('#1d2433') && h.cs('.footer', 'color') === rgb('#ffffff') && h.$$('.footer a').every(a => h.cs(a, 'color') === rgb('#ffffff'))) || 'проверьте background и color подвала и его ссылок' },
        noLiterals,
        noOverflow
      ]
    }
  );
})();
/* ---- content/tasks/k49.js ---- */
/* Занятие 49. Практическая работа №10 (ч. 2). Прототип: внутренняя страница и форма */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Стайлгайд проекта «Читальный зал» (занятия 47–48)
  const ROOT = `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --color-success: #2e7d32;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`;
  const PAGE = `.page { font-family: var(--font-main); color: var(--color-text); }
.page h1 { font-family: var(--font-heading); }`;
  const BTN = `.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; }
.btn:focus-visible { outline: 3px solid var(--color-text); outline-offset: 2px; }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }`;
  const BOOKS = `<ul class="catalog">
    <li class="book" data-genre="fantasy" data-available="yes">
      <h2 class="book-title">Пикник на обочине</h2>
      <p class="author">А. и Б. Стругацкие</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="fantasy" data-available="no">
      <h2 class="book-title">Солярис</h2>
      <p class="author">С. Лем</p>
      <span class="badge badge-no">На руках</span>
    </li>
    <li class="book" data-genre="textbook" data-available="yes">
      <h2 class="book-title">Основы веб-дизайна</h2>
      <p class="author">Е. Смирнова</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="textbook" data-available="no">
      <h2 class="book-title">HTML и CSS для начинающих</h2>
      <p class="author">И. Петров</p>
      <span class="badge badge-no">На руках</span>
    </li>
    <li class="book" data-genre="detective" data-available="yes">
      <h2 class="book-title">Собака Баскервилей</h2>
      <p class="author">А. Конан Дойл</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
    <li class="book" data-genre="detective" data-available="yes">
      <h2 class="book-title">Убийство в «Восточном экспрессе»</h2>
      <p class="author">А. Кристи</p>
      <span class="badge badge-yes">В наличии</span>
    </li>
  </ul>`;
  const literalColors = h => h.rules.filter(r => r.selector !== ':root' && r.selector !== 'body' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText)).map(r => r.selector);
  const noLiterals = { name: 'Цвета только из переменных: вне :root нет HEX и rgb', check: h => { const bad = literalColors(h); return !bad.length || `цвет числом в: ${bad.join(', ')}`; } };
  const noOverflow = { name: 'На телефоне 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' };
  const stacked = (h, els) => els.length > 1 && els.every((x, i) => i === 0 || x.getBoundingClientRect().top >= els[i - 1].getBoundingClientRect().bottom - 1);

  window.COURSE_TASKS.push(
    {
      id: 'k4901', lesson: 'mdk-49', module: 'mdk5', mech: 'build',
      title: 'Каталог: форма-фильтр', level: 'Среднее', minutes: 25, points: 150,
      story: 'На странице каталога «Читального зала» нужен фильтр: поиск, жанр и флажок «Только в наличии». Студенты открывают каталог и с телефона, и с компьютера.',
      goal: 'В form.filter сделайте три обёртки div.filter-field: 1) label for="q" «Название или автор» и input id="q" name="q" type="search"; 2) label for="genre" «Жанр» и select id="genre" name="genre" с вариантами: all «Все жанры», fantasy «Фантастика», textbook «Учебники», detective «Детективы»; 3) label с классом check, внутри input id="available" name="available" type="checkbox" и текст «Только в наличии». Кнопку переименуйте в «Показать». Подписи поиска и жанра — над полями (display: block), поля #q и #genre высотой не меньше 44px с рамкой var(--color-muted). Mobile first: на телефоне обёртки друг под другом, с 768px — в строку, поля и кнопка выровнены по нижнему краю (align-items: flex-end). Цвета только через var().',
      hints: [
        'Обёртка: <div class="filter-field"><label for="q">Название или автор</label><input id="q" name="q" type="search"></div>. Так же для select: <option value="all">Все жанры</option>…',
        'Флажок: <div class="filter-field"><label class="check"><input id="available" name="available" type="checkbox"> Только в наличии</label></div>.',
        'Поля: .filter-field label { display: block; margin-bottom: var(--space-1); } и #q, #genre { min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }. Флажку display: flex; align-items: center; min-height: 44px.',
        'Раскладка: .filter { display: flex; flex-direction: column; gap: var(--space-2); } и @media (min-width: 768px) { .filter { flex-direction: row; align-items: flex-end; } }.'
      ],
      html: `<div class="page">
  <h1>Каталог книг</h1>
  <form class="filter">
    <!-- Три div.filter-field: поиск, жанр, флажок «Только в наличии» -->

    <button class="btn btn-primary" type="submit">OK</button>
  </form>
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
${BTN}
/* Ниже — стили формы-фильтра */
`,
      tests: [
        { name: 'Три обёртки div.filter-field внутри form.filter', check: h => h.count('form.filter > .filter-field') === 3 || `сейчас ${h.count('form.filter > .filter-field')}` },
        { name: 'Поиск: label for="q" и input#q type="search"', check: h => (h.$('#q')?.type === 'search' && !!h.$('label[for="q"]') && h.$('#q').name === 'q') || 'нужны <label for="q"> и <input id="q" name="q" type="search">' },
        { name: 'Жанр: select#genre с вариантами all, fantasy, textbook, detective', check: h => { const o = h.$$('select#genre option').map(e => e.value).join(','); return (o === 'all,fantasy,textbook,detective' && !!h.$('label[for="genre"]')) || `варианты: ${o || 'нет'}`; } },
        { name: 'Флажок #available внутри label.check с текстом «Только в наличии»', check: h => { const c = h.$('#available'); return !!(c && c.type === 'checkbox' && c.closest('label.check') && /Только в наличии/.test(c.closest('label').textContent)) || 'нужен <label class="check"><input id="available" type="checkbox"> Только в наличии</label>'; } },
        { name: 'Кнопка отправки «Показать»', check: h => (h.text('.filter button[type="submit"]') === 'Показать') || `сейчас «${h.text('.filter button')}»` },
        { name: 'Подписи над полями, поля от 44px с рамкой --color-muted', check: h => { const ok = ['q', 'genre'].every(id => { const l = h.rect(`label[for="${id}"]`), f = h.rect('#' + id); return l && f && l.bottom <= f.top + 1 && f.height >= 43.5 && h.cs('#' + id, 'border-top-color') === rgb('#5a6475'); }); return ok || 'проверьте display: block у подписей и min-height, border у #q и #genre'; } },
        { name: 'На компьютере поля и кнопка в одну строку по нижнему краю', check: h => { const r = ['#q', '#genre', '.filter button'].map(s => h.rect(s)); if (r.some(x => !x)) return 'нет полей'; const b = r.map(x => x.bottom); return (Math.max(...b) - Math.min(...b) < 2 && r[0].left < r[1].left && r[1].left < r[2].left) || 'нужно @media (min-width: 768px) { .filter { flex-direction: row; align-items: flex-end; } }'; } },
        { name: 'На телефоне поля друг под другом', at: 360, check: h => stacked(h, h.$$('.filter-field')) || 'на 360px обёртки должны идти в колонку' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4902', lesson: 'mdk-49', module: 'mdk5', mech: 'adaptive',
      title: 'Каталог: крошки и сетка карточек', level: 'Среднее', minutes: 25, points: 150,
      story: 'Карточки книг каталога уже в разметке, но стоят сплошным списком. Нужна навигация «где я» и аккуратная сетка, которая сама подстраивается под ширину экрана.',
      goal: 'Перед h1 добавьте хлебные крошки: nav.breadcrumbs с aria-label, внутри ol: «Главная» — ссылка, «Каталог» — текст с aria-current="page" у li; пункты в строку, перед вторым — разделитель через li + li::before. Сетка .catalog: display: grid, grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)), gap через var(--space-…), без маркеров списка; на компьютере не меньше трёх карточек в ряд, на 360px — одна колонка. Карточка .book: padding от 16px, скругление var(--radius), рамка или фон. Бейдж .badge-yes: фон var(--color-success), текст var(--color-on-primary); .badge-no: фон var(--color-surface), текст var(--color-muted). Цвета только через var().',
      hints: [
        'Крошки: <nav class="breadcrumbs" aria-label="Хлебные крошки"><ol><li><a href="#">Главная</a></li><li aria-current="page">Каталог</li></ol></nav>.',
        'Крошки в строку: .breadcrumbs ol { display: flex; margin: 0; padding: 0; list-style: none; } и .breadcrumbs li + li::before { content: "/"; margin: 0 var(--space-1); }.',
        'Сетка: .catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin: 0; padding: 0; list-style: none; }. Медиазапрос не нужен.',
        'Бейдж: общий .badge { display: inline-block; padding: 2px var(--space-1); border-radius: var(--radius); font-size: 14px; } и цвета в .badge-yes и .badge-no.'
      ],
      html: `<div class="page">
  <!-- Здесь хлебные крошки: Главная / Каталог -->

  <h1>Каталог книг</h1>
  <p class="found">Найдено: 6</p>
  ${BOOKS}
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
.book-title { margin: 0 0 var(--space-1); font-family: var(--font-heading); font-size: 20px; }
.author { margin: 0 0 var(--space-2); color: var(--color-muted); }
/* Ниже — стили крошек, сетки, карточек и бейджей */
`,
      tests: [
        { name: 'Перед h1 nav.breadcrumbs с aria-label и ol из двух пунктов', check: h => (!!h.$('nav.breadcrumbs[aria-label]') && h.count('nav.breadcrumbs ol > li') === 2 && h.before('nav.breadcrumbs', 'h1')) || 'нужен nav.breadcrumbs с aria-label и ol из двух li перед h1' },
        { name: '«Главная» — ссылка, «Каталог» — текст с aria-current="page"', check: h => { const li = h.$$('nav.breadcrumbs li'); return (li.length === 2 && !!li[0].querySelector('a[href]') && !li[1].querySelector('a') && li[1].getAttribute('aria-current') === 'page' && li[1].textContent.trim() === 'Каталог') || 'проверьте пункты крошек'; } },
        { name: 'Крошки в строку, перед вторым пунктом разделитель', check: h => { const li = h.$$('nav.breadcrumbs li'); const c = li[1] ? h.win.getComputedStyle(li[1], '::before').content : 'none'; return (li.length === 2 && h.sameRow(li) && c && c !== 'none' && c !== 'normal') || 'нужны flex у ol и li + li::before { content: … }'; } },
        { name: '.catalog — grid с repeat(auto-fit, minmax(220px, 1fr))', check: h => { const r = h.rules.find(x => x.selector === '.catalog'); return (h.cs('.catalog', 'display') === 'grid' && !!r && /repeat\(\s*auto-fit\s*,\s*minmax\(\s*220px\s*,\s*1fr\s*\)\s*\)/.test(r.style.gridTemplateColumns)) || 'нужно grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))'; } },
        { name: 'Отступы сетки через var(--space-…), без маркеров списка', check: h => { const r = h.rules.find(x => x.selector === '.catalog'); return (!!r && /var\(--space/.test(r.style.getPropertyValue('gap') || r.style.getPropertyValue('row-gap')) && h.cs('.catalog', 'list-style-type') === 'none') || 'нужны gap: var(--space-…) и list-style: none'; } },
        { name: 'На компьютере хотя бы три карточки в ряд', check: h => { const b = h.$$('.book').slice(0, 3); return (b.length === 3 && h.sameRow(b)) || 'первые три карточки должны стоять в одной строке'; } },
        { name: 'На телефоне одна колонка', at: 360, check: h => stacked(h, h.$$('.book')) || 'на 360px карточки должны идти друг под другом' },
        { name: 'Карточка: padding от 16px, скругление 8px, рамка или фон', check: h => (h.px('.book', 'padding-top') >= 16 && h.px('.book', 'border-top-left-radius') === 8 && (h.px('.book', 'border-top-width') > 0 || h.cs('.book', 'background-color') !== 'rgba(0, 0, 0, 0)')) || 'проверьте .book' },
        { name: 'Бейджи: «В наличии» — --color-success и белый, «На руках» — --color-surface и --color-muted', check: h => (h.cs('.badge-yes', 'background-color') === rgb('#2e7d32') && h.cs('.badge-yes', 'color') === rgb('#ffffff') && h.cs('.badge-no', 'background-color') === rgb('#f2f5fa') && h.cs('.badge-no', 'color') === rgb('#5a6475')) || 'проверьте .badge-yes и .badge-no' },
        noLiterals,
        noOverflow
      ]
    },
    {
      id: 'k4903', lesson: 'mdk-49', module: 'mdk5', mech: 'build',
      title: 'Каталог: фильтр работает', level: 'Сложное', minutes: 30, points: 200,
      story: 'Форма и карточки готовы, но кнопка «Показать» пока просто перезагружает страницу. Оживите фильтр на JavaScript.',
      goal: 'В script.js обработайте событие submit формы .filter: отмените перезагрузку (event.preventDefault()), прочитайте жанр (#genre), флажок (#available) и текст поиска (#q, без пробелов по краям, в нижнем регистре). Книга .book видна (hidden = false), если: жанр «all» или совпадает с её data-genre; флажок снят или у неё data-available="yes"; название .book-title в нижнем регистре содержит текст поиска. Остальные книги — hidden = true. В .found напишите «Найдено: N». Если N = 0, покажите .empty (hidden = false), иначе спрячьте. Ошибок в консоли быть не должно.',
      hints: [
        'Каркас: const form = document.querySelector(\'.filter\'); form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Значения: const genre = document.querySelector(\'#genre\').value; const onlyAvailable = document.querySelector(\'#available\').checked; const text = document.querySelector(\'#q\').value.trim().toLowerCase();',
        'Перебор: let count = 0; for (const book of document.querySelectorAll(\'.book\')) { const title = book.querySelector(\'.book-title\').textContent.toLowerCase(); … }',
        'Условие: const ok = (genre === \'all\' || book.dataset.genre === genre) && (!onlyAvailable || book.dataset.available === \'yes\') && title.includes(text); book.hidden = !ok; if (ok) { count = count + 1; }'
      ],
      html: `<div class="page">
  <h1>Каталог книг</h1>
  <form class="filter">
    <div class="filter-field">
      <label for="q">Название или автор</label>
      <input id="q" name="q" type="search">
    </div>
    <div class="filter-field">
      <label for="genre">Жанр</label>
      <select id="genre" name="genre">
        <option value="all">Все жанры</option>
        <option value="fantasy">Фантастика</option>
        <option value="textbook">Учебники</option>
        <option value="detective">Детективы</option>
      </select>
    </div>
    <div class="filter-field">
      <label class="check"><input id="available" name="available" type="checkbox"> Только в наличии</label>
    </div>
    <button class="btn btn-primary" type="submit">Показать</button>
  </form>
  <p class="found" role="status">Найдено: 6</p>
  <p class="empty" hidden>Ничего не нашлось. Попробуйте выбрать другой жанр или убрать флажок.</p>
  ${BOOKS}
</div>`,
      css: `${BASE}
${ROOT}
${PAGE}
${BTN}
.filter { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-3); }
.filter-field label { display: block; margin-bottom: var(--space-1); }
.filter-field .check { display: flex; align-items: center; gap: var(--space-1); min-height: 44px; margin: 0; }
#q, #genre { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }
.found { font-weight: bold; }
.empty { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); }
.catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.book { padding: var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.book-title { margin: 0 0 var(--space-1); font-family: var(--font-heading); font-size: 20px; }
.author { margin: 0 0 var(--space-2); color: var(--color-muted); }
.badge { display: inline-block; padding: 2px var(--space-1); border-radius: var(--radius); font-size: 14px; }
.badge-yes { background: var(--color-success); color: var(--color-on-primary); }
.badge-no { background: var(--color-surface); color: var(--color-muted); }
[hidden] { display: none; }
@media (min-width: 768px) {
  .filter { flex-direction: row; align-items: flex-end; }
}`,
      js: `// Ваш код здесь
`,
      tests: [
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: h => h.submit('.filter') === false || 'вызовите event.preventDefault() в обработчике submit' },
        { name: 'Жанр «Фантастика» → видны только 2 книги этого жанра', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 2 && v.every(b => b.dataset.genre === 'fantasy')) || `видно книг: ${v.length}`; } },
        { name: 'Флажок «Только в наличии» → видны только 4 книги в наличии', js: true, check: h => { h.$('#available').checked = true; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 4 && v.every(b => b.dataset.available === 'yes')) || `видно книг: ${v.length}`; } },
        { name: 'Поиск «css» находит «HTML и CSS для начинающих» (без учёта регистра)', js: true, check: h => { h.$('#q').value = '  css '; h.submit('.filter'); const v = h.$$('.book').filter(b => h.visible(b)); return (v.length === 1 && /CSS/.test(v[0].textContent)) || `видно книг: ${v.length}`; } },
        { name: 'Строка «Найдено: N» обновляется', js: true, check: h => { h.$('#genre').value = 'detective'; h.submit('.filter'); return h.text('.found') === 'Найдено: 2' || `сейчас «${h.text('.found')}»`; } },
        { name: 'Ничего не нашлось → видно .empty и «Найдено: 0»', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.$('#q').value = 'css'; h.submit('.filter'); return (h.visible('.empty') && h.text('.found') === 'Найдено: 0' && !h.$$('.book').some(b => h.visible(b))) || 'при пустом результате покажите .empty'; } },
        { name: 'После сброса фильтра снова видны все 6 книг, .empty спрятан', js: true, check: h => { h.$('#genre').value = 'fantasy'; h.$('#q').value = 'css'; h.submit('.filter'); h.$('#genre').value = 'all'; h.$('#q').value = ''; h.submit('.filter'); return (h.$$('.book').filter(b => h.visible(b)).length === 6 && !h.visible('.empty') && h.text('.found') === 'Найдено: 6') || 'после «Все жанры» и пустого поиска должно быть видно 6 книг'; } },
        { name: 'В консоли нет ошибок', js: true, check: h => { h.submit('.filter'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/k50.js ---- */
/* Занятие 50. Практическая работа №10 (ч. 3). Интерактивный прототип и состояния */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Правило CSS, в селекторе которого есть re и задано свойство prop
  const ruleWith = (h, re, prop) => h.rules.find(r => re.test(r.selector) && r.style.getPropertyValue(prop));
  const BTN = '.btn { min-height: 44px; padding: 10px 16px; font-size: 16px; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }';
  window.COURSE_TASKS.push(
    {
      id: 'k5001', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Кнопка и поле во всех состояниях', level: 'Среднее', minutes: 25, points: 150,
      story: 'В Figma вы нарисовали варианты кнопки: обычная, наведение, нажатие, фокус, выключена. Теперь те же состояния нужно перенести в CSS, иначе в браузере кнопка будет «мёртвой».',
      goal: 'Оформите кнопку .btn: фон #1f5f8b, белый текст, min-height не меньше 44px, курсор pointer. Добавьте состояния: .btn:hover — фон темнее (например #174a6c), .btn:active — ещё темнее или сдвиг, .btn:focus-visible — рамка outline не тоньше 2px. Удалите правило с outline: none. Вторую кнопку выключите атрибутом disabled и оформите .btn:disabled: серый фон, тёмно-серый текст, курсор not-allowed. Полю .field при фокусе (.field:focus-visible) дайте заметную рамку.',
      hints: [
        'Состояние — это то же правило с псевдоклассом: .btn:hover { … }, .btn:active { … }.',
        'outline: none прячет фокус от тех, кто ходит по странице клавишей Tab. Удалите это правило и напишите .btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }.',
        'Выключенная кнопка: <button class="btn" type="button" disabled>Недоступно</button>. Правило .btn:disabled поставьте ниже .btn:hover, иначе наведение перекрасит серую кнопку.',
        'Серый фон с читаемым текстом: background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed;'
      ],
      html: `<section class="card">
  <h2>Бронирование книги</h2>
  <label for="reader">Номер читательского билета</label>
  <input id="reader" class="field" type="text">
  <div class="actions">
    <button class="btn" type="button">Забронировать</button>
    <button class="btn" type="button">Недоступно</button>
  </div>
</section>`,
      css: `${BASE}
.card { max-width: 420px; padding: 24px; border: 1px solid #d0d7de; border-radius: 12px; }
label { display: block; margin-bottom: 6px; font-weight: bold; }
.field { width: 100%; box-sizing: border-box; padding: 10px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
.actions { display: flex; gap: 12px; margin-top: 16px; }
.btn { padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; }
.btn:focus { outline: none; }`,
      tests: [
        { name: 'Кнопка .btn: фон #1f5f8b, белый текст, высота не меньше 44px', check: h => { const b = h.$('.btn:not([disabled])'); if (!b) return 'нет активной кнопки .btn'; const bg = h.cs(b, 'background-color'), c = h.cs(b, 'color'), ht = h.rect(b).height; return bg === rgb('#1f5f8b') && c === rgb('#ffffff') && ht >= 43.5 || `фон ${bg}, текст ${c}, высота ${Math.round(ht)}px`; } },
        { name: '.btn:hover меняет цвет фона', check: h => { const r = ruleWith(h, /\.btn:hover/, 'background-color'); return !!r && r.style.getPropertyValue('background-color') !== rgb('#1f5f8b') || 'нет правила .btn:hover с другим background-color'; } },
        { name: '.btn:active показывает нажатие (фон или сдвиг)', check: h => !!(ruleWith(h, /\.btn:active/, 'background-color') || ruleWith(h, /\.btn:active/, 'transform')) || 'нет правила .btn:active с background-color или transform' },
        { name: '.btn:focus-visible рисует рамку outline не тоньше 2px', check: h => { const r = ruleWith(h, /\.btn:focus-visible/, 'outline-style'); if (!r) return 'нет правила .btn:focus-visible с outline'; const w = parseFloat(r.style.getPropertyValue('outline-width')) || 3; return r.style.getPropertyValue('outline-style') !== 'none' && w >= 2 || `рамка ${r.style.getPropertyValue('outline')}`; } },
        { name: 'Нет outline: none — фокус не прячем', check: h => !h.has(/outline(-style)?\s*:\s*(none|0)\s*[;}]/i) || 'найдено outline: none' },
        { name: 'Вторая кнопка выключена: disabled, серый фон, курсор not-allowed', check: h => { const b = h.$$('.btn')[1]; if (!b || !b.disabled) return 'у второй кнопки нет атрибута disabled'; const bg = h.cs(b, 'background-color'); return bg !== rgb('#1f5f8b') && bg !== 'rgba(0, 0, 0, 0)' && h.cs(b, 'cursor') === 'not-allowed' || `фон ${bg}, курсор ${h.cs(b, 'cursor')}`; } },
        { name: 'Поле .field при фокусе выделяется рамкой', check: h => !!(ruleWith(h, /\.field:focus/, 'outline-style') || ruleWith(h, /\.field:focus/, 'border-top-color') || ruleWith(h, /\.field:focus/, 'box-shadow')) || 'нет правила .field:focus-visible с outline или border-color' }
      ]
    },
    {
      id: 'k5002', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Прототип из трёх экранов', level: 'Среднее', minutes: 30, points: 150,
      story: 'В Figma экраны связаны стрелками на вкладке Prototype. В браузере стрелок нет: переходы между экранами делает JavaScript. Соберём живой прототип приложения библиотеки.',
      goal: 'В HTML скройте второй и третий экраны атрибутом hidden. В CSS добавьте правило .screen[hidden] { display: none; } (без него display: flex перебивает hidden). В script.js напишите функцию showScreen(id): она скрывает все .screen и показывает экран с этим id. Каждой кнопке с атрибутом data-go добавьте обработчик click, который вызывает showScreen с значением data-go. Должно работать: «Подробнее» → карточка книги, «Забронировать» → «Книга забронирована», «Назад к каталогу» и «В каталог» → каталог.',
      hints: [
        'Скрыть экран в HTML: <section class="screen" id="screen-book" hidden>. Проверьте предпросмотр: если экран всё равно виден, значит, его показывает display: flex — добавьте правило .screen[hidden].',
        'Функция: function showScreen(id) { for (const screen of screens) { screen.hidden = screen.id !== id; } } — где screens = document.querySelectorAll(\'.screen\').',
        'screen.id !== id — это true для всех «чужих» экранов (их прячем) и false для нужного (его показываем).',
        'Кнопки: for (const button of document.querySelectorAll(\'[data-go]\')) { button.addEventListener(\'click\', () => showScreen(button.dataset.go)); }'
      ],
      html: `<main class="phone">
  <section class="screen" id="screen-catalog">
    <h2>Каталог</h2>
    <ul class="books">
      <li>«Мастер и Маргарита» <button class="btn" type="button" data-go="screen-book">Подробнее</button></li>
    </ul>
  </section>
  <section class="screen" id="screen-book">
    <h2>Мастер и Маргарита</h2>
    <p>М. А. Булгаков. В наличии: 2 экземпляра.</p>
    <button class="btn" type="button" data-go="screen-done">Забронировать</button>
    <button class="btn btn-secondary" type="button" data-go="screen-catalog">Назад к каталогу</button>
  </section>
  <section class="screen" id="screen-done">
    <h2>Книга забронирована</h2>
    <p>Заберите её на абонементе в течение трёх дней.</p>
    <button class="btn" type="button" data-go="screen-catalog">В каталог</button>
  </section>
</main>`,
      css: `${BASE}
.phone { max-width: 360px; margin: 0 auto; padding: 16px; border: 1px solid #d0d7de; border-radius: 16px; }
.screen { display: flex; flex-direction: column; gap: 12px; }
.books { margin: 0; padding: 0; list-style: none; }
.books li { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
${BTN}
.btn-secondary { background-color: #e7eef4; color: #1f5f8b; }`,
      js: `// 1. Найдите все экраны: document.querySelectorAll('.screen')

// 2. Функция showScreen(id): скрыть все экраны, кроме экрана с этим id

// 3. Каждой кнопке с атрибутом data-go — обработчик click
`,
      tests: [
        { name: 'В HTML второй и третий экраны скрыты атрибутом hidden', check: h => h.count('.screen[hidden]') === 2 && !h.$('#screen-catalog').hidden || `скрыто экранов: ${h.count('.screen[hidden]')}` },
        { name: 'При открытии виден только экран «Каталог»', js: true, check: h => { const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); if (v.length === 1 && v[0] === 'screen-catalog') return true; return `видны: ${v.join(', ') || 'ни одного'}` + (h.count('.screen[hidden]') && v.length > 1 ? ' — hidden есть, но display: flex его перебивает' : ''); } },
        { name: '«Подробнее» открывает карточку книги, каталог скрыт', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-book' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: '«Забронировать» открывает экран «Книга забронирована»', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); h.click('#screen-book [data-go="screen-done"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-done' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: '«Назад к каталогу» возвращает в каталог', js: true, check: async h => { h.click('[data-go="screen-book"]'); await h.wait(); h.click('#screen-book [data-go="screen-catalog"]'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-catalog' || `видны: ${v.join(', ') || 'ни одного'}`; } },
        { name: 'Есть функция showScreen(id), и она работает', js: true, check: async h => { const f = h.get('showScreen'); if (typeof f !== 'function') return 'нет функции showScreen'; f('screen-done'); await h.wait(); const v = h.$$('.screen').filter(s => getComputedStyle(s).display !== 'none').map(s => s.id); return v.join() === 'screen-done' || `после showScreen('screen-done') видны: ${v.join(', ') || 'ни одного'}`; } }
      ]
    },
    {
      id: 'k5003', lesson: 'mdk-50', module: 'mdk5', mech: 'build', title: 'Кнопка, которая ждёт согласия', level: 'Среднее', minutes: 25, points: 150,
      story: 'Последний экран прототипа — подтверждение брони. Кнопка должна быть выключена, пока читатель не согласился с правилами, а после отправки — показать результат.',
      goal: 'Выключите кнопку #send атрибутом disabled в HTML и добавьте правило .btn:disabled (серый фон, курсор not-allowed). В script.js: при событии change у галочки #agree кнопка включается, если галочка стоит, и выключается, если снята. При отправке формы #booking отмените перезагрузку (preventDefault), выключите кнопку, смените её текст на «Готово», а в #status напишите «Бронь подтверждена» (можно с номером брони).',
      hints: [
        'Включить и выключить кнопку можно одной строкой: send.disabled = !agree.checked;',
        'Слушаем галочку: agree.addEventListener(\'change\', () => { … });',
        'Форма: form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Внутри обработчика submit: send.disabled = true; send.textContent = \'Готово\'; statusText.textContent = \'Бронь подтверждена. Номер брони: 1024.\';'
      ],
      html: `<form class="booking" id="booking">
  <h2>Подтверждение брони</h2>
  <p>«Мастер и Маргарита», абонемент, срок — 3 дня.</p>
  <label class="check"><input type="checkbox" id="agree"> Я прочитал правила библиотеки</label>
  <button class="btn" type="submit" id="send">Подтвердить бронь</button>
  <p class="status" id="status" role="status"></p>
</form>`,
      css: `${BASE}
.booking { max-width: 420px; display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid #d0d7de; border-radius: 12px; }
.check { display: flex; gap: 8px; align-items: center; }
${BTN}
.status { margin: 0; color: #1e6b34; font-weight: bold; }`,
      js: `const agree = document.querySelector('#agree');
const send = document.querySelector('#send');
const form = document.querySelector('#booking');
const statusText = document.querySelector('#status');

// 1. Галочка включает и выключает кнопку

// 2. Отправка формы: без перезагрузки, кнопка «Готово», сообщение в #status
`,
      tests: [
        { name: 'Кнопка выключена с самого начала (disabled в HTML)', check: h => h.$('#send')?.disabled === true || 'у #send нет атрибута disabled' },
        { name: 'Выключенная кнопка выглядит иначе: серый фон и курсор not-allowed', check: h => { const bg = h.cs('#send', 'background-color'); return h.$('#send')?.disabled && bg !== rgb('#1f5f8b') && h.cs('#send', 'cursor') === 'not-allowed' || `фон ${bg}, курсор ${h.cs('#send', 'cursor')}`; } },
        { name: 'Галочка включает кнопку, снятая галочка снова выключает', js: true, check: async h => { h.click('#agree'); await h.wait(); const on = !h.doc.querySelector("#send").disabled; h.click('#agree'); await h.wait(); const off = h.doc.querySelector("#send").disabled; return on && off || (on ? 'после снятия галочки кнопка осталась включённой' : 'после галочки кнопка не включилась'); } },
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: async h => { h.click('#agree'); await h.wait(); return h.submit('#booking') === false || 'в обработчике submit нет event.preventDefault()'; } },
        { name: 'После отправки: кнопка «Готово» выключена, в #status «Бронь подтверждена»', js: true, check: async h => { h.click('#agree'); await h.wait(); h.submit('#booking'); await h.wait(); const b = h.doc.querySelector("#send"); return b.disabled && h.text('#send') === 'Готово' && /бронь подтверждена/i.test(h.text('#status')) || `кнопка: «${h.text('#send')}», ${b.disabled ? 'выключена' : 'включена'}; статус: «${h.text('#status')}»`; } }
      ]
    }
  );
})();
/* ---- content/tasks/k51.js ---- */
/* Занятие 51. Юзабилити мобильных сайтов и приложений */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k5101', lesson: 'mdk-51', module: 'mdk5', mech: 'adaptive', title: 'Кафе, удобное для пальца', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт кафе «Перемена» сделан только для компьютера. Студенты заказывают обед с телефона на перемене — одной рукой, на ходу — и промахиваются по крошечным ссылкам.',
      goal: 'Сделайте страницу удобной на телефоне 360px: никакой горизонтальной прокрутки (уберите фиксированную ширину 960px, поставьте max-width), основной текст не меньше 16px, каждая ссылка меню не ниже 44px и между ссылками не меньше 8px, кнопка «Заказать обед» не ниже 48px и почти на всю ширину экрана (от 280px). Карточки блюд на телефоне — в одну колонку, а на компьютере (от 768px) — три в ряд.',
      hints: [
        'Ширину страницы сделайте резиновой: .page { max-width: 960px; } вместо width: 960px.',
        'Ссылку меню удобно делать гибким блоком: .menu a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; }, а у .menu — display: flex; gap: 8px; flex-wrap: wrap;',
        'Кнопка: .btn { display: block; min-height: 48px; text-align: center; … }, тогда на телефоне она растянется на всю ширину.',
        'Mobile first: по умолчанию .cards { grid-template-columns: 1fr; }, а в @media (min-width: 768px) — repeat(3, 1fr).'
      ],
      html: `<div class="page">
  <header class="top">
    <p class="logo">Кафе «Перемена»</p>
    <nav class="menu" aria-label="Разделы сайта">
      <a href="#dishes">Меню</a>
      <a href="#hours">Часы работы</a>
      <a href="#contacts">Контакты</a>
    </nav>
  </header>
  <main>
    <h1>Обед за 15 минут между парами</h1>
    <p class="lead">Суп, горячее и компот — 290 ₽. Закажите заранее, и обед будет ждать вас на стойке.</p>
    <a class="btn" href="#dishes">Заказать обед</a>
    <section class="cards" id="dishes">
      <article class="card"><h2>Борщ</h2><p>Со сметаной и чесночной булочкой.</p></article>
      <article class="card"><h2>Плов</h2><p>С курицей и морковью.</p></article>
      <article class="card"><h2>Сырники</h2><p>Три штуки с вареньем.</p></article>
    </section>
    <p id="hours">Работаем с 8:00 до 17:00, в субботу — до 14:00.</p>
    <p id="contacts">Корпус 1, первый этаж, рядом с гардеробом.</p>
  </main>
</div>`,
      css: `${BASE}
.page { width: 960px; margin: 0 auto; font-size: 12px; }
.top { display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: bold; }
.menu a { font-size: 12px; padding: 2px; color: #1f5f8b; }
.btn { padding: 4px 8px; font-size: 12px; background-color: #8a3b12; color: #ffffff; text-decoration: none; border-radius: 6px; }
.cards { display: grid; grid-template-columns: repeat(3, 300px); gap: 16px; margin: 24px 0; }
.card { padding: 16px; border: 1px solid #d0d7de; border-radius: 12px; }`,
      tests: [
        { name: 'На 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || `ширина страницы ${h.doc.documentElement.scrollWidth}px` },
        { name: 'Основной текст на телефоне не меньше 16px', at: 360, check: h => { const s = h.px('.lead', 'font-size'), c = h.px('.card p', 'font-size'); return s >= 16 && c >= 16 || `текст ${s}px, в карточках ${c}px`; } },
        { name: 'Каждая ссылка меню не ниже 44px', at: 360, check: h => { const hs = h.$$('.menu a').map(a => Math.round(a.getBoundingClientRect().height)); return hs.every(x => x >= 44) || `высота ссылок: ${hs.join(', ')}px`; } },
        { name: 'Между ссылками меню не меньше 8px', at: 360, check: h => { const r = h.$$('.menu a').map(a => a.getBoundingClientRect()); for (let i = 1; i < r.length; i++) { const gap = Math.max(r[i].left - r[i - 1].right, r[i].top - r[i - 1].bottom, r[i - 1].left - r[i].right); if (gap < 7.5) return `между ссылками ${i} и ${i + 1}: ${Math.round(gap)}px`; } return true; } },
        { name: 'Кнопка «Заказать обед» не ниже 48px и шириной от 280px', at: 360, check: h => { const r = h.rect('.btn'); return r.height >= 47.5 && r.width >= 280 || `кнопка ${Math.round(r.width)}×${Math.round(r.height)}px`; } },
        { name: 'На телефоне карточки в одну колонку', at: 360, check: h => { const l = h.$$('.card').map(c => Math.round(c.getBoundingClientRect().left)); return new Set(l).size === 1 || 'карточки стоят в ряд'; } },
        { name: 'На компьютере три карточки в ряд', check: h => h.sameRow(h.$$('.card')) || 'карточки не в одном ряду' }
      ]
    },
    {
      id: 'k5102', lesson: 'mdk-51', module: 'mdk5', mech: 'build', title: 'Форма заказа под телефонную клавиатуру', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма заказа работает, но на телефоне везде открывается буквенная клавиатура, а браузер не предлагает подставить имя и номер. Каждое лишнее касание — повод бросить заказ.',
      goal: 'Настройте поля: имени — autocomplete="name"; телефону — type="tel" и autocomplete="tel"; почте — type="email" и autocomplete="email"; коду из СМС — inputmode="numeric" и autocomplete="one-time-code"; времени — type="time". В CSS: у полей шрифт не меньше 16px (иначе iPhone увеличит страницу), высота не меньше 44px, на телефоне 360px поля во всю ширину формы (от 300px). Подписи стоят над полями. Кнопка не ниже 48px.',
      hints: [
        'Тип поля меняет клавиатуру: <input id="phone" name="phone" type="tel" autocomplete="tel">.',
        'Код из СМС — это цифры, но не число (с ним не считают), поэтому type оставляем text, а клавиатуру меняем через inputmode="numeric".',
        'Подпись над полем: label { display: block; }. Поле во всю ширину: input { width: 100%; box-sizing: border-box; }.',
        'Размеры: input { font-size: 16px; min-height: 44px; } и .btn { min-height: 48px; }.'
      ],
      html: `<form class="order" id="order">
  <h2>Заказ обеда</h2>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="text">
  <label for="email">Почта для чека</label>
  <input id="email" name="email" type="text">
  <label for="code">Код из СМС</label>
  <input id="code" name="code" type="text">
  <label for="time">Ко скольки приготовить</label>
  <input id="time" name="time" type="text">
  <button class="btn" type="submit">Заказать</button>
</form>`,
      css: `${BASE}
.order { max-width: 420px; }
label { margin-right: 8px; font-weight: bold; }
input { padding: 4px; font-size: 13px; border: 1px solid #8c959f; border-radius: 6px; }
.btn { margin-top: 16px; padding: 6px 12px; font-size: 16px; border: none; border-radius: 8px; background-color: #8a3b12; color: #ffffff; }`,
      tests: [
        { name: 'Имя: autocomplete="name"', check: h => h.$('#name')?.getAttribute('autocomplete') === 'name' || 'нет autocomplete="name"' },
        { name: 'Телефон: type="tel" и autocomplete="tel"', check: h => { const e = h.$('#phone'); return e?.type === 'tel' && e.getAttribute('autocomplete') === 'tel' || `type="${e?.getAttribute('type')}", autocomplete="${e?.getAttribute('autocomplete') || ''}"`; } },
        { name: 'Почта: type="email" и autocomplete="email"', check: h => { const e = h.$('#email'); return e?.type === 'email' && e.getAttribute('autocomplete') === 'email' || `type="${e?.getAttribute('type')}", autocomplete="${e?.getAttribute('autocomplete') || ''}"`; } },
        { name: 'Код из СМС: inputmode="numeric" и autocomplete="one-time-code"', check: h => { const e = h.$('#code'); return e?.getAttribute('inputmode') === 'numeric' && e.getAttribute('autocomplete') === 'one-time-code' || 'нужны inputmode="numeric" и autocomplete="one-time-code"'; } },
        { name: 'Время: type="time"', check: h => h.$('#time')?.type === 'time' || 'у поля времени нет type="time"' },
        { name: 'Поля: шрифт от 16px, высота от 44px, ширина от 300px на телефоне', at: 360, check: h => { for (const e of h.$$('input')) { const r = e.getBoundingClientRect(), f = h.px(e, 'font-size'); if (f < 16 || r.height < 43.5 || r.width < 300) return `#${e.id}: шрифт ${f}px, ${Math.round(r.width)}×${Math.round(r.height)}px`; } return true; } },
        { name: 'Подписи стоят над полями', at: 360, check: h => h.$$('label').every(l => { const i = h.doc.getElementById(l.htmlFor); return i && l.getBoundingClientRect().bottom <= i.getBoundingClientRect().top + 1; }) || 'подпись стоит сбоку от поля' },
        { name: 'Кнопка «Заказать» не ниже 48px', at: 360, check: h => h.rect('.btn').height >= 47.5 || `сейчас ${Math.round(h.rect('.btn').height)}px` }
      ]
    },
    {
      id: 'k5103', lesson: 'mdk-51', module: 'mdk5', mech: 'build', title: 'Нижняя навигация приложения', level: 'Сложное', minutes: 20, points: 200,
      story: 'Приложение «Мой колледж»: расписание, оценки, чат, профиль. На телефоне меню должно быть внизу, в зоне большого пальца, а на компьютере — обычным меню сверху.',
      goal: 'На телефоне (по умолчанию) закрепите .tabbar внизу экрана: position: fixed, bottom: 0, left: 0, ширина во весь экран. Четыре ссылки стоят в один ряд, каждая не меньше 48px в высоту и 64px в ширину, иконка над подписью (flex-direction: column). Текущему разделу «Расписание» добавьте aria-current="page" и выделите его цветом. Чтобы панель не закрывала текст, дайте .content отступ снизу не меньше высоты панели. На компьютере (@media (min-width: 768px)) панель снова обычная: position: static.',
      hints: [
        'Закрепить внизу: .tabbar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; }.',
        'Ссылки поровну: .tabbar a { flex: 1; display: flex; flex-direction: column; align-items: center; min-height: 56px; }.',
        'Текущий раздел: <a href="#schedule" aria-current="page">…</a>, а в CSS — .tabbar a[aria-current="page"] { color: …; }.',
        'Отступ: .content { padding-bottom: 80px; }. На компьютере: @media (min-width: 768px) { .tabbar { position: static; } }.'
      ],
      html: `<nav class="tabbar" aria-label="Разделы приложения">
  <a href="#schedule"><img src="${ICON}" alt=""><span>Расписание</span></a>
  <a href="#marks"><img src="${ICON}" alt=""><span>Оценки</span></a>
  <a href="#chat"><img src="${ICON}" alt=""><span>Чат</span></a>
  <a href="#profile"><img src="${ICON}" alt=""><span>Профиль</span></a>
</nav>
<main class="content" id="schedule">
  <h1>Расписание на вторник</h1>
  <p>1 пара, 8:30 — Проектирование интерфейсов, кабинет 214.</p>
  <p>2 пара, 10:10 — Английский язык, кабинет 305.</p>
  <p>3 пара, 12:10 — Физкультура, спортзал.</p>
  <p>4 пара, 13:50 — Математика, кабинет 118.</p>
  <p>Консультация по курсовой — в 15:30, кабинет 214.</p>
</main>`,
      css: `${BASE}
.tabbar { background-color: #ffffff; border-top: 1px solid #d0d7de; }
.tabbar a { color: #57606a; font-size: 12px; text-decoration: none; }
.tabbar img { width: 24px; height: 24px; }`,
      tests: [
        { name: 'На телефоне панель закреплена внизу во всю ширину', at: 360, check: h => { const r = h.rect('.tabbar'); return h.cs('.tabbar', 'position') === 'fixed' && Math.abs(r.bottom - h.win.innerHeight) < 2 && r.width >= 359 || `position: ${h.cs('.tabbar', 'position')}, низ ${Math.round(r.bottom)}px, ширина ${Math.round(r.width)}px`; } },
        { name: 'Четыре ссылки в один ряд, каждая от 64×48px', at: 360, check: h => { const a = h.$$('.tabbar a'); if (a.length !== 4) return `ссылок: ${a.length}`; if (!h.sameRow(a)) return 'ссылки не в одном ряду'; const bad = a.map(e => e.getBoundingClientRect()).find(r => r.width < 64 || r.height < 47.5); return !bad || `ссылка ${Math.round(bad.width)}×${Math.round(bad.height)}px`; } },
        { name: 'Иконка стоит над подписью', at: 360, check: h => h.$$('.tabbar a').every(a => { const i = a.querySelector('img'), s = a.querySelector('span'); return i && s && i.getBoundingClientRect().bottom <= s.getBoundingClientRect().top + 1; }) || 'иконка сбоку от подписи' },
        { name: '«Расписание» отмечено aria-current="page" и выделено цветом', check: h => { const cur = h.$$('.tabbar a[aria-current="page"]'); if (cur.length !== 1 || !/Расписание/.test(cur[0].textContent)) return 'aria-current="page" должен быть у одной ссылки «Расписание»'; const other = h.$$('.tabbar a')[1]; return h.cs(cur[0], 'color') !== h.cs(other, 'color') || 'текущий раздел того же цвета, что и остальные'; } },
        { name: 'Панель не закрывает текст: у .content отступ снизу не меньше высоты панели', at: 360, check: h => { const pb = h.px('.content', 'padding-bottom') + h.px('.content', 'margin-bottom'); const nav = h.rect('.tabbar').height; return pb >= nav || `отступ ${pb}px, панель ${Math.round(nav)}px`; } },
        { name: 'На компьютере панель обычная (position: static)', check: h => h.cs('.tabbar', 'position') === 'static' || `position: ${h.cs('.tabbar', 'position')}` }
      ]
    }
  );
})();
/* ---- content/tasks/k52.js ---- */
/* Занятие 52. Аудит юзабилити, тестирование и документирование */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PRIO = { 'высокий': 0, 'средний': 1, 'низкий': 2 };
  const prioCells = h => h.$$('tbody tr').map(tr => tr.lastElementChild);
  window.COURSE_TASKS.push(
    {
      id: 'k5201', lesson: 'mdk-52', module: 'mdk5', mech: 'build', title: 'Отчёт об аудите таблицей', level: 'Среднее', minutes: 20, points: 150,
      story: 'Вы провели юзабилити-тест формы записи в спортзал с пятью участниками. Заметки лежат в комментарии. Менеджеру нужен отчёт, где сразу видно, что чинить первым.',
      goal: 'Под заголовком сделайте таблицу отчёта: caption с названием, в thead шесть заголовков th scope="col": №, Проблема, Где, Эвристика, Как исправить, Приоритет. В tbody — пять строк, по одной на каждую заметку, в каждой шесть ячеек. Приоритет пишите словом: Высокий, Средний или Низкий. Строки отсортируйте: сначала высокий, потом средний, потом низкий. Ячейке приоритета дайте класс prio-high, prio-medium или prio-low и разный цвет фона для высокого и низкого. Ячейкам таблицы — внутренний отступ не меньше 8px.',
      hints: [
        'Каркас: <table><caption>…</caption><thead><tr><th scope="col">№</th>…</tr></thead><tbody>…</tbody></table>.',
        'Сначала выпишите строки с приоритетом «высокий» (их две), потом «средний» (две), потом «низкий» (одна). Номера № ставьте по новому порядку.',
        'Ячейка приоритета: <td class="prio-high">Высокий</td>.',
        'CSS: table { border-collapse: collapse; } th, td { padding: 8px; border: 1px solid #8c959f; } .prio-high { background-color: #fde2e1; }'
      ],
      html: `<h1>Отчёт об аудите: форма записи в спортзал</h1>
<!-- Заметки с юзабилити-теста (5 участников, задача «Запишитесь на пробное занятие»):
1. Где: кнопка отправки. Кнопка подписана «Ок», двое не поняли, что она записывает на занятие.
   Эвристика: соответствие реальному миру. Исправить: подпись «Записаться на занятие». Приоритет: средний.
2. Где: поле телефона. Подписи нет, только серый текст внутри поля. После ввода номера непонятно, что это за поле.
   Эвристика: узнавание вместо вспоминания. Исправить: постоянная подпись label над полем. Приоритет: высокий.
3. Где: шапка. Логотип не ведёт на главную, один участник искал, как вернуться.
   Эвристика: единообразие и стандарты. Исправить: сделать логотип ссылкой на главную. Приоритет: низкий.
4. Где: после нажатия кнопки. Три секунды ничего не происходит, трое нажали кнопку повторно и записались дважды.
   Эвристика: видимость состояния системы. Исправить: состояние загрузки на кнопке и сообщение об успехе. Приоритет: высокий.
5. Где: поле даты. При неверной дате появляется «Error 0x13».
   Эвристика: помощь в распознавании и исправлении ошибок. Исправить: «Выберите дату не раньше завтрашнего дня». Приоритет: средний.
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Есть таблица с подписью caption', check: h => h.count('table') === 1 && h.text('caption').length >= 5 || 'нужна одна таблица с caption' },
        { name: 'В thead шесть заголовков th scope="col"', check: h => { const th = h.$$('thead th'); return th.length === 6 && th.every(e => e.getAttribute('scope') === 'col') || `заголовков: ${th.length}, со scope="col": ${th.filter(e => e.getAttribute('scope') === 'col').length}`; } },
        { name: 'В tbody пять строк по шесть ячеек', check: h => { const tr = h.$$('tbody tr'); return tr.length === 5 && tr.every(r => r.children.length === 6) || `строк: ${tr.length}, ячеек в строках: ${tr.map(r => r.children.length).join(', ')}`; } },
        { name: 'Приоритет — Высокий, Средний или Низкий; два высоких, два средних, один низкий', check: h => { const v = prioCells(h).map(c => c.textContent.trim().toLowerCase()); if (!v.length || v.some(x => !(x in PRIO))) return `в последнем столбце: ${v.join(', ') || 'пусто'}`; const n = k => v.filter(x => x === k).length; return n('высокий') === 2 && n('средний') === 2 && n('низкий') === 1 || 'приоритеты не совпадают с заметками'; } },
        { name: 'Строки отсортированы: высокий → средний → низкий', check: h => { const v = prioCells(h).map(c => PRIO[c.textContent.trim().toLowerCase()]); return v.length === 5 && v.every((x, i) => i === 0 || x >= v[i - 1]) || 'сначала высокий приоритет, в конце низкий'; } },
        { name: 'У ячеек приоритета классы prio-high / prio-medium / prio-low, высокий и низкий разного цвета', check: h => { const map = { 'высокий': 'prio-high', 'средний': 'prio-medium', 'низкий': 'prio-low' }; const c = prioCells(h); if (!c.length || c.some(e => !e.classList.contains(map[e.textContent.trim().toLowerCase()]))) return 'класс ячейки не совпадает с приоритетом'; return h.cs('.prio-high', 'background-color') !== h.cs('.prio-low', 'background-color') || 'фон высокого и низкого приоритета одинаковый'; } },
        { name: 'У ячеек внутренний отступ не меньше 8px', check: h => { const p = h.px('tbody td', 'padding-left'); return p >= 8 || `сейчас ${p || 0}px`; } }
      ]
    },
    {
      id: 'k5202', lesson: 'mdk-52', module: 'mdk5', mech: 'a11y', title: 'Чиним форму по отчёту', level: 'Среднее', minutes: 20, points: 150,
      story: 'Отчёт об аудите принят, пора исправлять. Перед вами та самая форма записи в спортзал со всеми найденными проблемами.',
      goal: 'Исправьте форму по отчёту: 1) у полей телефона и даты — подписи label for («Телефон», «Дата занятия»); 2) кнопка подписана «Записаться на занятие»; 3) ссылка «тут» заменена понятным текстом, например «Правила клуба»; 4) серый текст условий читается: контраст не меньше 4,5:1 (цвет темнее, например #595959); 5) вместо «Error 0x13» — понятное сообщение, что случилось и как исправить (от 25 символов), и поле даты связано с ним: aria-describedby="date-error".',
      hints: [
        'Подпись: <label for="phone">Телефон</label> перед <input id="phone" …>. Placeholder можно оставить как пример, но подписью он не считается.',
        'Понятная ссылка говорит, куда ведёт: <a href="#rules">правилами клуба</a>.',
        'Контраст: замените color: #b0b0b0 на #595959 — это 7:1 на белом.',
        'Сообщение: <p class="error" id="date-error">Выберите дату не раньше завтрашнего дня.</p>, а у поля: <input id="date" type="date" aria-describedby="date-error">.'
      ],
      html: `<form class="signup" id="signup">
  <h2>Запись на пробное занятие</h2>
  <input id="phone" type="tel" placeholder="Телефон">
  <input id="date" type="date">
  <p class="error">Error 0x13</p>
  <p class="terms">Нажимая кнопку, вы соглашаетесь с правилами клуба. Прочитать их можно <a href="#rules">тут</a>.</p>
  <button class="btn" type="submit">Ок</button>
</form>`,
      css: `${BASE}
.signup { max-width: 400px; display: flex; flex-direction: column; gap: 8px; }
input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
.error { margin: 0; color: #b3261e; }
.terms { color: #b0b0b0; font-size: 14px; }
.btn { min-height: 48px; font-size: 16px; border: none; border-radius: 8px; background-color: #1e6b34; color: #ffffff; }`,
      tests: [
        { name: 'У полей телефона и даты есть подписи label for', check: h => ['phone', 'date'].every(id => h.$(`label[for="${id}"]`)?.textContent.trim()) || 'нет <label for="…"> у поля' },
        { name: 'Кнопка подписана «Записаться на занятие»', check: h => /записаться/i.test(h.text('.btn')) || `сейчас «${h.text('.btn')}»` },
        { name: 'Текст ссылки понятен без контекста (не «тут» и не «здесь»)', check: h => { const t = h.text('.terms a'); return t.length >= 6 && !/^(тут|здесь|сюда|подробнее|ссылка)$/i.test(t) || `ссылка «${t}»`; } },
        { name: 'Текст условий: контраст не меньше 4,5:1', check: h => { const c = h.contrast('.terms'); return c >= 4.5 || `сейчас ${c ? c.toFixed(2) : '?'}:1`; } },
        { name: 'Ошибка понятна: без «Error» и кодов, от 25 символов', check: h => { const t = h.text('.error'); return t.length >= 25 && !/error|0x/i.test(t) || `сейчас «${t}»`; } },
        { name: 'Поле даты связано с сообщением: aria-describedby="date-error"', check: h => { const d = h.$('#date'); const id = d?.getAttribute('aria-describedby'); const e = id && h.doc.getElementById(id); return !!e && e.classList.contains('error') || 'нет aria-describedby, указывающего на сообщение .error'; } }
      ]
    },
    {
      id: 'k5203', lesson: 'mdk-52', module: 'mdk5', mech: 'build', title: 'Отмена с возможностью вернуть', level: 'Сложное', minutes: 20, points: 200,
      story: 'Эвристика «Пользователь управляет и свободен»: ошибочное действие должно легко отменяться. В списке занятий кнопка «Отменить запись» удаляет навсегда — исправим.',
      goal: 'В script.js: по нажатию на кнопку .del её запись .item скрывается (item.hidden = true), а сообщение #toast с кнопкой «Вернуть» появляется. Запомните скрытую запись в переменной. Нажатие на #undo показывает эту запись снова на её месте и прячет #toast. В HTML #toast скрыт атрибутом hidden с самого начала.',
      hints: [
        'Переменная для «последней отменённой» записи: let lastItem = null;',
        'Найти запись, в которой нажата кнопка: const item = button.closest(\'.item\');',
        'Обработчик кнопки .del: item.hidden = true; lastItem = item; toast.hidden = false;',
        'Обработчик #undo: if (lastItem) { lastItem.hidden = false; } toast.hidden = true;'
      ],
      html: `<section class="bookings">
  <h2>Мои занятия</h2>
  <ul class="list">
    <li class="item"><span>Йога, вторник 18:00</span> <button class="del" type="button">Отменить запись</button></li>
    <li class="item"><span>Бассейн, четверг 19:30</span> <button class="del" type="button">Отменить запись</button></li>
    <li class="item"><span>Силовая, суббота 11:00</span> <button class="del" type="button">Отменить запись</button></li>
  </ul>
  <div class="toast" id="toast">
    <p>Запись отменена.</p>
    <button class="undo" id="undo" type="button">Вернуть</button>
  </div>
</section>`,
      css: `${BASE}
.bookings { max-width: 420px; }
.list { margin: 0; padding: 0; list-style: none; }
.item { padding: 8px 0; border-bottom: 1px solid #d0d7de; }
.del { min-height: 44px; margin-left: 8px; padding: 0 12px; font-size: 14px; border: 1px solid #b3261e; border-radius: 8px; background-color: #ffffff; color: #b3261e; }
.toast { margin-top: 16px; padding: 12px 16px; border-radius: 8px; background-color: #24292f; color: #ffffff; }
.toast p { margin: 0 0 8px; }
.undo { min-height: 44px; padding: 0 16px; font-size: 16px; border: none; border-radius: 8px; background-color: #f2a900; color: #24292f; }`,
      js: `const toast = document.querySelector('#toast');
const undo = document.querySelector('#undo');
// 1. Переменная для последней отменённой записи

// 2. Каждой кнопке .del — обработчик: скрыть запись, показать #toast

// 3. Кнопка #undo: вернуть запись, спрятать #toast
`,
      tests: [
        { name: 'В HTML сообщение #toast скрыто атрибутом hidden', check: h => h.$('#toast')?.hidden === true || 'нет hidden у #toast' },
        { name: 'Сначала видны три записи и нет сообщения', js: true, check: h => h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').length === 3 && getComputedStyle(h.doc.querySelector("#toast")).display === 'none' || 'сообщение видно до отмены' },
        { name: '«Отменить запись» скрывает именно свою запись и показывает сообщение', js: true, check: async h => { h.click(h.$$('.del')[1]); await h.wait(); const v = h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent); if (v.length !== 2) return `видно записей: ${v.length}`; if (v.some(t => /Бассейн/.test(t))) return 'скрылась не та запись'; return getComputedStyle(h.doc.querySelector("#toast")).display !== 'none' || 'сообщение #toast не появилось'; } },
        { name: '«Вернуть» возвращает запись на её место и прячет сообщение', js: true, check: async h => { h.click(h.$$('.del')[1]); await h.wait(); h.click('#undo'); await h.wait(); const v = h.$$('.item').filter(e => getComputedStyle(e).display !== 'none').map(e => e.querySelector('span').textContent); if (v.join('|') !== 'Йога, вторник 18:00|Бассейн, четверг 19:30|Силовая, суббота 11:00') return `сейчас: ${v.join('; ')}`; return getComputedStyle(h.doc.querySelector("#toast")).display === 'none' || 'сообщение не спряталось'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k53.js ---- */
/* Занятие 53. Практическая работа №11 (ч. 1). Схема интерфейса: карта экранов */
(() => {
  const { BASE } = window.COURSE_KIT;
  const CARDS_CSS = `.screens { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.screen { padding: 12px 16px; border: 2px solid #1f5f8b; border-radius: 12px; }
.screen h3 { margin: 0 0 4px; }
.screen p { margin: 0; color: #57606a; }`;
  const card = (id, name, goal) => `    <article class="screen" id="screen-${id}"><h3>${name}</h3><p>${goal}</p></article>`;
  const CARDS = [
    card('home', 'Главная', 'Ближайшая запись и кнопка «Записаться»'),
    card('login', 'Вход', 'Номер полиса и пароль'),
    card('doctors', 'Выбор врача', 'Список специальностей и врачей'),
    card('time', 'Выбор времени', 'Свободные слоты на неделю'),
    card('confirm', 'Подтверждение', 'Врач, дата, время, кнопка «Записаться»'),
    card('done', 'Запись создана', 'Номер талона, кнопка «В мои записи»'),
    card('my', 'Мои записи', 'Список записей с кнопкой «Отменить»')
  ].join('\n');
  window.COURSE_TASKS.push(
    {
      id: 'k5301', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'Экраны приложения карточками', level: 'Среднее', minutes: 25, points: 150,
      story: 'Начинаем схему интерфейса веб-приложения «Запись к врачу». Сначала — полный список экранов: что это за экран, зачем он и что на нём главное.',
      goal: 'После заголовка h1 добавьте раздел section с заголовком h2 «Экраны» и контейнером div.screens. В нём не меньше шести карточек article.screen из списка в комментарии. У каждой карточки: id вида screen-… (латиницей), заголовок h3 с названием экрана, абзац p с назначением и список ul с двумя-тремя главными элементами экрана. Контейнер .screens — сетка (display: grid): на компьютере три карточки в ряд, на телефоне 360px — одна колонка, без горизонтальной прокрутки.',
      hints: [
        'Одна карточка: <article class="screen" id="screen-home"><h3>Главная</h3><p>Стартовый экран пациента.</p><ul><li>Ближайшая запись</li><li>Кнопка «Записаться»</li></ul></article>.',
        'id пишем латиницей без пробелов: screen-home, screen-doctors, screen-time…',
        'Mobile first: .screens { display: grid; grid-template-columns: 1fr; gap: 16px; }.',
        '@media (min-width: 768px) { .screens { grid-template-columns: repeat(3, 1fr); } }'
      ],
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<!-- Экраны приложения:
  Главная — ближайшая запись, кнопка «Записаться», меню
  Вход — номер полиса, пароль, кнопка «Войти»
  Выбор врача — специальности, список врачей, поиск
  Выбор времени — дни недели, свободные слоты, кнопка «Далее»
  Подтверждение — врач, дата и время, кнопка «Записаться»
  Запись создана — номер талона, кнопка «В мои записи»
  Мои записи — список записей, кнопка «Отменить»
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Раздел с заголовком h2 и не меньше шести карточек article.screen', check: h => { const n = h.count('.screens article.screen'); return h.count('section h2') >= 1 && n >= 6 || `карточек в .screens: ${n}`; } },
        { name: 'У каждой карточки id вида screen-…', check: h => { const bad = h.$$('article.screen').filter(a => !/^screen-[a-z0-9-]+$/.test(a.id)); return h.count('article.screen') > 0 && !bad.length || `без правильного id: ${bad.length || 'карточек нет'}`; } },
        { name: 'В каждой карточке h3, абзац p и список ul из 2–3 пунктов', check: h => { const a = h.$$('article.screen'); const bad = a.find(e => !e.querySelector('h3')?.textContent.trim() || !e.querySelector('p')?.textContent.trim() || !(e.querySelectorAll('ul li').length >= 2 && e.querySelectorAll('ul li').length <= 3)); return a.length > 0 && !bad || `карточка «${bad ? (bad.querySelector('h3')?.textContent || bad.id) : '—'}» неполная`; } },
        { name: 'На компьютере .screens — сетка, три карточки в ряд', check: h => { const a = h.$$('article.screen'); if (h.cs('.screens', 'display') !== 'grid') return '.screens не grid'; return a.length >= 4 && h.sameRow(a.slice(0, 3)) && !h.sameRow(a.slice(0, 4)) || 'в ряду должно быть три карточки'; } },
        { name: 'На телефоне карточки в одну колонку, без прокрутки', at: 360, check: h => { const l = h.$$('article.screen').map(e => Math.round(e.getBoundingClientRect().left)); return l.length > 1 && new Set(l).size === 1 && !h.overflow() || 'карточки не в одну колонку или есть прокрутка'; } }
      ]
    },
    {
      id: 'k5302', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'Таблица переходов', level: 'Среднее', minutes: 25, points: 150,
      story: 'Экраны есть, теперь нужны связи: откуда, по какому действию и куда попадает пользователь. В Figma это стрелки, в документе — таблица переходов со ссылками на карточки.',
      goal: 'Под карточками добавьте section с h2 «Переходы» и таблицей: caption, в thead три th scope="col" — «Откуда», «Действие пользователя», «Куда». В tbody не меньше семи строк. В ячейках «Откуда» и «Куда» — ссылки a на карточки экранов (href="#screen-…"), и каждая ссылка ведёт на существующий экран. В каждый экран, кроме Главной, должен вести хотя бы один переход. Добавьте правило .screen:target — выделение карточки, на которую перешли по ссылке (фон или рамка другого цвета).',
      hints: [
        'Строка таблицы: <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-doctors">Выбор врача</a></td></tr>.',
        'Пройдите основной сценарий: Главная → Выбор врача → Выбор времени → Подтверждение → Запись создана → Мои записи. Не забудьте про Вход.',
        'Псевдокласс :target срабатывает у элемента, id которого стоит в адресе после #. Нажмите ссылку в предпросмотре — карточка подсветится.',
        '.screen:target { background-color: #fff3cd; border-color: #8a5a00; }'
      ],
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<section>
  <h2>Экраны</h2>
  <div class="screens">
${CARDS}
  </div>
</section>
<!-- Здесь раздел «Переходы» с таблицей -->
`,
      css: `${BASE}
h1 { font-size: 26px; }
${CARDS_CSS}`,
      tests: [
        { name: 'Таблица переходов: caption и три th scope="col"', check: h => { const th = h.$$('table thead th'); return !!h.text('table caption') && th.length === 3 && th.every(e => e.getAttribute('scope') === 'col') || `caption: ${h.text('table caption') ? 'есть' : 'нет'}, th: ${th.length}`; } },
        { name: 'Не меньше семи переходов', check: h => h.count('table tbody tr') >= 7 || `строк: ${h.count('table tbody tr')}` },
        { name: 'В столбцах «Откуда» и «Куда» — ссылки на существующие экраны', check: h => { const rows = h.$$('table tbody tr'); if (!rows.length) return 'нет строк'; for (const r of rows) for (const td of [r.children[0], r.children[2]]) { const a = td?.querySelector('a[href^="#"]'); if (!a) return `в строке «${r.textContent.trim().slice(0, 30)}» нет ссылки`; const t = h.doc.getElementById(a.getAttribute('href').slice(1)); if (!t || !t.classList.contains('screen')) return `ссылка ${a.getAttribute('href')} никуда не ведёт`; } return true; } },
        { name: 'В каждый экран, кроме Главной, ведёт хотя бы один переход', check: h => { const to = new Set(h.$$('table tbody tr').map(r => r.children[2]?.querySelector('a')?.getAttribute('href'))); const miss = h.$$('article.screen').filter(a => a.id !== 'screen-home' && !to.has('#' + a.id)); return !miss.length || `нет перехода в: ${miss.map(a => a.querySelector('h3').textContent).join(', ')}`; } },
        { name: 'Есть правило .screen:target с выделением', check: h => h.rules.some(r => /\.screen:target/.test(r.selector) && (r.style.backgroundColor || r.style.borderTopColor || r.style.outlineStyle)) || 'нет правила .screen:target с фоном или рамкой' }
      ]
    },
    {
      id: 'k5303', lesson: 'mdk-53', module: 'mdk5', mech: 'build', title: 'User flow основного сценария', level: 'Сложное', minutes: 30, points: 200,
      story: 'Карта экранов показывает всё сразу. Чтобы обсудить с командой главное, рисуют user flow — путь пользователя по одному сценарию, шаг за шагом, с развилками.',
      goal: 'Разметьте сценарий из комментария нумерованным списком ol.flow: каждый шаг — li.step (не меньше пяти). Шаг-развилка «Есть свободное время?» — li.step с дополнительным классом decision, внутри — список ul из двух вариантов: «Да — …» и «Нет — …». На компьютере шаги стоят в ряд (display: flex, flex-wrap: wrap), на телефоне 360px — в колонку. Развилка выглядит иначе, чем обычный шаг (пунктирная рамка или другой фон). У каждого шага, кроме последнего, псевдоэлемент ::after рисует стрелку «→» (подсказка: .step:not(:last-child)::after).',
      hints: [
        'Каркас: <ol class="flow"><li class="step">Главная: нажимает «Записаться»</li> … </ol>.',
        'Развилка: <li class="step decision">Есть свободное время?<ul><li>Да — выбирает слот</li><li>Нет — «Сообщить, когда появится»</li></ul></li>.',
        'Ряд и колонка: .flow { display: flex; flex-direction: column; gap: 12px; } и @media (min-width: 768px) { .flow { flex-direction: row; flex-wrap: wrap; } }.',
        'Стрелка: .step:not(:last-child)::after { content: " →"; font-weight: bold; }. Пунктир: .decision { border-style: dashed; }.'
      ],
      html: `<h1>User flow: запись к терапевту</h1>
<!-- Сценарий: пациент записывается к терапевту
  1. Главная: нажимает «Записаться»
  2. Выбор врача: выбирает терапевта
  3. Выбор времени: смотрит свободные слоты
  4. Развилка «Есть свободное время?»
       Да — выбирает слот и идёт дальше
       Нет — нажимает «Сообщить, когда появится» и возвращается на Главную
  5. Подтверждение: проверяет данные и нажимает «Записаться»
  6. Запись создана: видит номер талона
-->
`,
      css: `${BASE}
h1 { font-size: 26px; }`,
      tests: [
        { name: 'Список ol.flow, в нём не меньше пяти шагов li.step', check: h => { const n = h.$$('ol.flow > li.step').length; return n >= 5 || `шагов: ${n}`; } },
        { name: 'Развилка li.step.decision со списком из двух вариантов «Да…» и «Нет…»', check: h => { const d = h.$('ol.flow > li.step.decision'); if (!d) return 'нет шага с классом decision'; const v = [...d.querySelectorAll('ul > li')].map(e => e.textContent.trim()); return v.length === 2 && /^да/i.test(v[0]) && /^нет/i.test(v[1]) || `варианты: ${v.join(' | ') || 'нет списка'}`; } },
        { name: 'На компьютере шаги стоят в ряд (flex)', check: h => { const s = h.$$('ol.flow > li.step'); return h.cs('ol.flow', 'display') === 'flex' && s.length > 1 && h.sameRow(s.slice(0, 2)) || 'первые шаги не в одном ряду'; } },
        { name: 'На телефоне шаги в колонку', at: 360, check: h => { const l = h.$$('ol.flow > li.step').map(e => Math.round(e.getBoundingClientRect().left)); return l.length > 1 && new Set(l).size === 1 && !h.overflow() || 'шаги не в одну колонку или есть прокрутка'; } },
        { name: 'Развилка выглядит иначе: рамка или фон отличаются', check: h => { const d = h.$('li.step.decision'), s = h.$$('li.step').find(e => !e.classList.contains('decision')); if (!d || !s) return 'нет развилки или обычного шага'; return ['border-top-style', 'background-color', 'border-top-color'].some(p => h.cs(d, p) !== h.cs(s, p)) || 'развилка оформлена так же, как шаг'; } },
        { name: 'Стрелки ::after у всех шагов, кроме последнего', check: h => { const s = h.$$('ol.flow > li.step'); if (s.length < 2) return 'мало шагов'; const has = e => { const c = h.win.getComputedStyle(e, '::after').content; return c && c !== 'none' && c !== 'normal' && c !== '""'; }; return s.slice(0, -1).every(has) && !has(s[s.length - 1]) || 'стрелка должна быть у каждого шага, кроме последнего'; } }
      ]
    }
  );
})();
/* ---- content/tasks/k54.js ---- */
/* Занятие 54. Практическая работа №11 (ч. 2). Схема интерфейса: компоненты и состояния */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  // Рамка outline в правиле: longhand пуст, если в shorthand есть var(), поэтому смотрим и outline
  const hasOutline = (h, re) => h.rules.some(r => re.test(r.selector) && (r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')) && !/none/.test(r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')));
  window.COURSE_TASKS.push(
    {
      id: 'k5401', lesson: 'mdk-54', module: 'mdk5', mech: 'build', title: 'Слоты времени: все состояния', level: 'Среднее', minutes: 25, points: 150,
      story: 'Главный компонент экрана «Выбор времени» — кнопка-слот. В схеме вы описали её состояния: свободно, наведение, фокус, выбрано, занято. Соберём живой компонент.',
      goal: 'Занятые слоты 09:30 и 10:30 выключите атрибутом disabled и оформите .slot:disabled: зачёркнутый текст (text-decoration: line-through), серый фон, курсор not-allowed. Всем слотам добавьте aria-pressed: у 09:00 — "true" (выбран по умолчанию), у остальных — "false". Выбранный слот .slot[aria-pressed="true"] — синий фон #1f5f8b и белый текст. Добавьте .slot:focus-visible с рамкой outline. В script.js: нажатие на свободный слот делает его выбранным (aria-pressed="true"), все остальные — "false", а в #chosen пишет «Выбрано: » и время.',
      hints: [
        'aria-pressed говорит экранному диктору «кнопка нажата». Это и состояние для CSS: .slot[aria-pressed="true"] { … }.',
        'Сброс выбора: for (const s of slots) { s.setAttribute(\'aria-pressed\', \'false\'); }, потом slot.setAttribute(\'aria-pressed\', \'true\').',
        'Текст: chosen.textContent = \'Выбрано: \' + slot.textContent;',
        'На выключенную кнопку click не приходит, поэтому занятые слоты выбрать нельзя — отдельная проверка не нужна.'
      ],
      html: `<section class="picker">
  <h2>Выберите время приёма</h2>
  <p>Терапевт Иванова А. С., вторник, 14 октября</p>
  <div class="slots">
    <button class="slot" type="button">09:00</button>
    <button class="slot" type="button">09:30</button>
    <button class="slot" type="button">10:00</button>
    <button class="slot" type="button">10:30</button>
    <button class="slot" type="button">11:00</button>
    <button class="slot" type="button">11:30</button>
  </div>
  <p class="chosen" id="chosen">Выбрано: 09:00</p>
</section>`,
      css: `${BASE}
.picker { max-width: 420px; }
.slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.slot { min-height: 48px; font-size: 16px; border: 2px solid #1f5f8b; border-radius: 8px; background-color: #ffffff; color: #1f5f8b; cursor: pointer; }
.slot:hover { background-color: #e7eef4; }
.chosen { font-weight: bold; }`,
      js: `const slots = document.querySelectorAll('.slot');
const chosen = document.querySelector('#chosen');

// Нажатие на слот: этот — aria-pressed="true", остальные — "false", текст в #chosen
`,
      tests: [
        { name: 'Слоты 09:30 и 10:30 выключены (disabled), остальные — нет', check: h => { const off = h.$$('.slot').filter(b => b.disabled).map(b => b.textContent.trim()); return off.join() === '09:30,10:30' || `выключены: ${off.join(', ') || 'ни одного'}`; } },
        { name: 'Занятый слот: зачёркнут, серый фон, курсор not-allowed', check: h => { const b = h.$('.slot:disabled'); if (!b) return 'нет выключенного слота'; return /line-through/.test(h.cs(b, 'text-decoration-line')) && h.cs(b, 'background-color') !== rgb('#ffffff') && h.cs(b, 'cursor') === 'not-allowed' || `зачёркивание: ${h.cs(b, 'text-decoration-line')}, фон ${h.cs(b, 'background-color')}, курсор ${h.cs(b, 'cursor')}`; } },
        { name: 'У всех слотов есть aria-pressed, выбран только 09:00', check: h => { const s = h.$$('.slot'); if (s.some(b => !b.hasAttribute('aria-pressed'))) return 'не у всех слотов есть aria-pressed'; const on = s.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent.trim()); return on.join() === '09:00' || `выбраны: ${on.join(', ') || 'ни одного'}`; } },
        { name: 'Выбранный слот: фон #1f5f8b, белый текст', check: h => { const b = h.$('.slot[aria-pressed="true"]'); return !!b && h.cs(b, 'background-color') === rgb('#1f5f8b') && h.cs(b, 'color') === rgb('#ffffff') || 'выбранный слот не выделен'; } },
        { name: 'Есть .slot:focus-visible с рамкой outline', check: h => hasOutline(h, /\.slot:focus-visible/) || 'нет правила .slot:focus-visible с outline' },
        { name: 'Нажатие на 11:00 выбирает его и снимает выбор с остальных', js: true, check: async h => { const b = h.$$('.slot').find(e => e.textContent.trim() === '11:00'); h.click(b); await h.wait(); const on = h.$$('.slot').filter(e => e.getAttribute('aria-pressed') === 'true').map(e => e.textContent.trim()); if (on.join() !== '11:00') return `выбраны: ${on.join(', ') || 'ни одного'}`; return /11:00/.test(h.text('#chosen')) || `в #chosen: «${h.text('#chosen')}»`; } }
      ]
    },
    {
      id: 'k5402', lesson: 'mdk-54', module: 'mdk5', mech: 'a11y', title: 'Вход по отчёту аудита', level: 'Сложное', minutes: 30, points: 200,
      story: 'Аудит экрана «Вход» нашёл пять проблем. Отчёт ниже, исправьте каждую.',
      goal: 'Исправьте по отчёту: 1) у полей нет подписей — добавьте label for «Номер полиса» и «Пароль»; 2) «кнопка» сделана из div и не нажимается с клавиатуры — замените на <button class="btn" type="submit">Войти</button>, а в script.js слушайте событие submit у формы (с preventDefault) вместо click; 3) фокус не виден — удалите outline: none и добавьте правило с :focus-visible и outline; 4) ошибка «Неверно» ничего не объясняет — если в полисе не 16 цифр, напишите в #policy-error, что номер полиса — 16 цифр (в тексте должно быть «16»), если пароль пустой — «Введите пароль» в #pass-error; полю с ошибкой ставьте aria-invalid="true", исправленному — "false"; поля свяжите с сообщениями атрибутом aria-describedby; 5) успех не объявляется — у #status добавьте role="status", при верных данных ошибки очищаются, в #status появляется «Вход выполнен».',
      hints: [
        'Начните с HTML: label for, button вместо div, aria-describedby="policy-error" у полиса и aria-describedby="pass-error" у пароля, role="status" у #status.',
        'Обработчик: form.addEventListener(\'submit\', (event) => { event.preventDefault(); … });',
        'Проверка полиса: const ok = policy.value.trim().length === 16; policyError.textContent = ok ? \'\' : \'Номер полиса — 16 цифр. Он есть на лицевой стороне полиса.\';',
        'Состояние для диктора: policy.setAttribute(\'aria-invalid\', ok ? \'false\' : \'true\');'
      ],
      html: `<form class="login" id="login" novalidate>
  <h2>Вход в личный кабинет</h2>
  <input id="policy" type="text" inputmode="numeric" placeholder="Номер полиса">
  <p class="error" id="policy-error"></p>
  <input id="pass" type="password" placeholder="Пароль">
  <p class="error" id="pass-error"></p>
  <div class="btn" id="enter">Войти</div>
  <p class="status" id="status"></p>
</form>`,
      css: `${BASE}
.login { max-width: 360px; display: flex; flex-direction: column; gap: 6px; }
input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 8px; }
input:focus { outline: none; }
.error { margin: 0; color: #b3261e; font-size: 14px; }
.btn { min-height: 48px; padding: 12px; font-size: 16px; text-align: center; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }
.status { margin: 0; color: #1e6b34; font-weight: bold; }`,
      js: `const enter = document.querySelector('#enter');
enter.addEventListener('click', () => {
  const policy = document.querySelector('#policy');
  if (policy.value.length !== 16) {
    document.querySelector('#policy-error').textContent = 'Неверно';
    return;
  }
  document.querySelector('#status').textContent = 'Вход выполнен';
});
`,
      tests: [
        { name: 'У полей есть подписи label for', check: h => ['policy', 'pass'].every(id => h.$(`label[for="${id}"]`)?.textContent.trim()) || 'нет <label for> у поля' },
        { name: 'Кнопка — настоящий <button type="submit">, div-кнопки нет', check: h => { const b = h.$('form button[type="submit"]'); return !!b && /войти/i.test(b.textContent) && !h.$('div.btn') || 'нужен <button type="submit">Войти</button> вместо div'; } },
        { name: 'Фокус виден: нет outline: none, есть :focus-visible с outline', check: h => { if (h.has(/outline(-style)?\s*:\s*(none|0)\s*[;}]/i)) return 'осталось outline: none'; return hasOutline(h, /:focus-visible/) || 'нет правила :focus-visible с outline'; } },
        { name: 'Поля связаны с сообщениями: aria-describedby, у #status role="status"', check: h => { for (const [f, e] of [['#policy', 'policy-error'], ['#pass', 'pass-error']]) if (h.$(f)?.getAttribute('aria-describedby') !== e) return `у ${f} нет aria-describedby="${e}"`; return h.$('#status')?.getAttribute('role') === 'status' || 'у #status нет role="status"'; } },
        { name: 'Неверный полис и пустой пароль: понятные ошибки и aria-invalid="true"', js: true, check: async h => { h.type('#policy', '123'); h.type('#pass', ''); if (h.submit('#login') !== false) return 'нет preventDefault в обработчике submit'; await h.wait(); const pe = h.text('#policy-error'), se = h.text('#pass-error'); if (!/16/.test(pe) || pe.length < 20) return `ошибка полиса: «${pe}»`; if (se.length < 5) return 'нет ошибки пароля'; const p = h.doc.querySelector("#policy"), s = h.doc.querySelector("#pass"); return p.getAttribute('aria-invalid') === 'true' && s.getAttribute('aria-invalid') === 'true' || 'у полей с ошибкой нет aria-invalid="true"'; } },
        { name: 'Верные данные: ошибки очищены, aria-invalid="false", «Вход выполнен»', js: true, check: async h => { h.submit('#login'); await h.wait(); h.type('#policy', '1234567890123456'); h.type('#pass', 'secret12'); h.submit('#login'); await h.wait(); if (h.text('#policy-error') || h.text('#pass-error')) return 'ошибки остались на экране'; const p = h.doc.querySelector("#policy"), s = h.doc.querySelector("#pass"); if (p.getAttribute('aria-invalid') !== 'false' || s.getAttribute('aria-invalid') !== 'false') return 'после исправления aria-invalid должен стать "false"'; return /вход выполнен/i.test(h.text('#status')) || `статус: «${h.text('#status')}»`; } }
      ]
    },
    {
      id: 'k5403', lesson: 'mdk-54', module: 'mdk5', mech: 'build', title: 'Пустое состояние «Мои записи»', level: 'Среднее', minutes: 25, points: 150,
      story: 'В схеме у экрана «Мои записи» три состояния: несколько записей, одна, ни одной. Про последнее часто забывают — и пользователь видит пустой белый экран.',
      goal: 'Блок #empty скройте атрибутом hidden в HTML и добавьте правило .empty[hidden] { display: none; } (у .empty свой display: flex). В script.js: кнопка .cancel удаляет свою запись (item.remove()) и обновляет счётчик #count — сколько записей осталось. Когда записей не осталось, список .list скрывается (hidden), а #empty показывается.',
      hints: [
        'Запись, в которой нажата кнопка: button.closest(\'.item\'). Удаляем: item.remove();',
        'Сколько осталось: const left = list.querySelectorAll(\'.item\').length; count.textContent = left;',
        'Пустое состояние: if (left === 0) { list.hidden = true; empty.hidden = false; }',
        'Если #empty не прячется, проверьте правило .empty[hidden] { display: none; }.'
      ],
      html: `<section class="my">
  <h2>Мои записи (<span id="count">2</span>)</h2>
  <ul class="list">
    <li class="item"><span>Терапевт, 14 октября, 09:00</span> <button class="cancel" type="button">Отменить</button></li>
    <li class="item"><span>Стоматолог, 20 октября, 16:30</span> <button class="cancel" type="button">Отменить</button></li>
  </ul>
  <div class="empty" id="empty">
    <img src="${ICON}" alt="" width="48" height="48">
    <p>У вас пока нет записей. Выберите врача и удобное время — это займёт минуту.</p>
    <a class="btn" href="#doctors">Записаться к врачу</a>
  </div>
</section>`,
      css: `${BASE}
.my { max-width: 420px; }
.list { margin: 0; padding: 0; list-style: none; }
.item { padding: 8px 0; border-bottom: 1px solid #d0d7de; }
.cancel { min-height: 44px; margin-left: 8px; padding: 0 12px; font-size: 14px; border: 1px solid #b3261e; border-radius: 8px; background-color: #ffffff; color: #b3261e; }
.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center; border: 2px dashed #8c959f; border-radius: 12px; }
.btn { display: inline-block; min-height: 44px; padding: 12px 16px; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; text-decoration: none; }`,
      js: `const list = document.querySelector('.list');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');

// Каждой кнопке .cancel — обработчик: удалить запись, обновить счётчик, показать пустое состояние
`,
      tests: [
        { name: 'В HTML #empty скрыт атрибутом hidden', check: h => h.$('#empty')?.hidden === true || 'нет hidden у #empty' },
        { name: 'При открытии пустое состояние не видно', js: true, check: h => getComputedStyle(h.doc.querySelector("#empty")).display === 'none' || '#empty виден: добавьте .empty[hidden] { display: none; }' },
        { name: 'Отмена одной записи: осталась одна, счётчик 1, пустого состояния нет', js: true, check: async h => { h.click('.cancel'); await h.wait(); const n = h.count('.item'); return n === 1 && h.text('#count') === '1' && getComputedStyle(h.doc.querySelector("#empty")).display === 'none' || `записей ${n}, счётчик «${h.text('#count')}»`; } },
        { name: 'Отмена всех записей: список скрыт, видно пустое состояние, счётчик 0', js: true, check: async h => { h.click('.cancel'); await h.wait(); h.click('.cancel'); await h.wait(); if (h.count('.item')) return `осталось записей: ${h.count('.item')}`; if (getComputedStyle(h.doc.querySelector(".list")).display !== 'none') return 'пустой список не скрыт'; if (getComputedStyle(h.doc.querySelector("#empty")).display === 'none') return 'пустое состояние не показалось'; return h.text('#count') === '0' || `счётчик «${h.text('#count')}»`; } }
      ]
    }
  );
})();
/* ---- content/tasks/k55.js ---- */
/* Занятие 55. Практическая работа №11 (ч. 3). Итоговая работа в формате демоэкзамена */
(() => {
  const { BASE, IMG, rgb } = window.COURSE_KIT;
  const ruleWith = (h, re, prop) => h.rules.find(r => re.test(r.selector) && r.style.getPropertyValue(prop));
  // Рамка outline в правиле: longhand пуст, если в shorthand есть var(), поэтому смотрим и outline
  const hasOutline = (h, re) => h.rules.some(r => re.test(r.selector) && (r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')) && !/none/.test(r.style.getPropertyValue('outline-style') || r.style.getPropertyValue('outline')));
  // Стайлгайд ветклиники «Хвост и лапы» — результат задания 1, готов в заданиях 2 и 3
  const GUIDE = `:root {
  --color-primary: #2d6a4f;
  --color-primary-dark: #1b4332;
  --color-surface: #f1f7f4;
  --color-accent: #f4a261;
  --color-text: #1f2933;
  --color-error: #b3261e;
  --radius: 8px;
  --space: 16px;
}
body { margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: var(--color-text); background-color: #ffffff; }
.btn { display: inline-block; min-height: 44px; padding: 10px 20px; font-size: 16px; border-radius: var(--radius); text-decoration: none; cursor: pointer; }
.btn-primary { border: 2px solid var(--color-primary); background-color: var(--color-primary); color: #ffffff; }
.btn-primary:hover { background-color: var(--color-primary-dark); }
.btn:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k5501', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 1. Стайлгайд в коде', level: 'Среднее', minutes: 25, points: 150,
      story: 'Демоэкзамен в миниатюре. По ТЗ из урока вы собрали стайлгайд ветклиники «Хвост и лапы» в Figma. Первый шаг вёрстки — перенести его в CSS: переменные и компоненты.',
      goal: 'В :root объявите переменные: --color-primary (#2d6a4f), --color-primary-dark (#1b4332), --color-surface (#f1f7f4), --color-accent (#f4a261), --color-text (#1f2933) и --radius (8px). Цвет текста body — var(--color-text). Образцы цвета .swatch-… закрасьте своими цветами через переменные (текст на тёмных — белый). Кнопки: .btn — min-height 44px и скругление var(--radius); .btn-primary — фон var(--color-primary), белый текст; .btn-secondary — белый фон, рамка 2px и текст цвета var(--color-primary); .btn-primary:hover — фон var(--color-primary-dark); .btn:focus-visible — outline цвета акцента; .btn:disabled — серый фон и курсор not-allowed. Поле .input: шрифт 16px, высота от 44px, при фокусе (.input:focus-visible) — рамка outline.',
      hints: [
        'Переменная объявляется в :root { --color-primary: #2d6a4f; }, а используется так: background-color: var(--color-primary);',
        'Образец: .swatch-primary { background-color: var(--color-primary); color: #ffffff; }. На светлых образцах (фон блоков, акцент) текст оставьте тёмным.',
        'Вторичная кнопка: .btn-secondary { border: 2px solid var(--color-primary); background-color: #ffffff; color: var(--color-primary); }',
        'Выключенную кнопку опишите ниже :hover: .btn:disabled { border-color: #c9c9c9; background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }'
      ],
      html: `<section class="guide">
  <h1>Стайлгайд «Хвост и лапы»</h1>
  <h2>Цвета</h2>
  <ul class="palette">
    <li class="swatch swatch-primary">Основной #2d6a4f</li>
    <li class="swatch swatch-dark">Тёмный #1b4332</li>
    <li class="swatch swatch-surface">Фон блоков #f1f7f4</li>
    <li class="swatch swatch-accent">Акцент #f4a261</li>
  </ul>
  <h2>Кнопки</h2>
  <div class="buttons">
    <button class="btn btn-primary" type="button">Записаться</button>
    <button class="btn btn-secondary" type="button">Позвонить</button>
    <button class="btn btn-primary" type="button" disabled>Нет мест</button>
  </div>
  <h2>Поле ввода</h2>
  <label for="demo">Кличка питомца</label>
  <input class="input" id="demo" type="text">
</section>`,
      css: `${BASE}
.guide { max-width: 640px; }
.palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.swatch { padding: 32px 12px 12px; border-radius: 8px; border: 1px solid #d0d7de; }
.buttons { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: block; margin-bottom: 4px; font-weight: bold; }
.btn { padding: 10px 20px; }`,
      tests: [
        { name: 'В :root объявлены пять цветов --color-… и --radius', check: h => { const r = h.rules.find(x => x.selector === ':root'); if (!r) return 'нет правила :root'; const need = { '--color-primary': '#2d6a4f', '--color-primary-dark': '#1b4332', '--color-surface': '#f1f7f4', '--color-accent': '#f4a261', '--color-text': '#1f2933' }; for (const [k, v] of Object.entries(need)) if (r.style.getPropertyValue(k).trim().toLowerCase() !== v) return `${k}: «${r.style.getPropertyValue(k).trim()}», нужно ${v}`; return !!r.style.getPropertyValue('--radius').trim() || 'нет --radius'; } },
        { name: 'Цвет текста body — #1f2933 через var(--color-text)', check: h => h.cs('body', 'color') === rgb('#1f2933') && h.has(/color\s*:\s*var\(--color-text\)/) || `цвет ${h.cs('body', 'color')}` },
        { name: 'Образцы закрашены своими цветами через переменные', check: h => { for (const e of h.$$('.swatch')) { const hex = e.textContent.match(/#[0-9a-f]{6}/i)[0]; if (h.cs(e, 'background-color') !== rgb(hex)) return `«${e.textContent.trim()}»: фон ${h.cs(e, 'background-color')}`; } return h.occurrences('var(--color-') >= 6 || 'цвета записаны напрямую, а не через var(--color-…)'; } },
        { name: '.btn-primary: фон основного цвета, белый текст, высота от 44px, скругление var(--radius)', check: h => { const b = h.$('.btn-primary:not([disabled])'); const r = h.rect(b); return h.cs(b, 'background-color') === rgb('#2d6a4f') && h.cs(b, 'color') === rgb('#ffffff') && r.height >= 43.5 && h.px(b, 'border-top-left-radius') === 8 && h.has(/border-radius\s*:\s*var\(--radius\)/) || `фон ${h.cs(b, 'background-color')}, текст ${h.cs(b, 'color')}, высота ${Math.round(r.height)}px, скругление ${h.cs(b, 'border-top-left-radius')}`; } },
        { name: '.btn-secondary: белый фон, рамка 2px и текст основного цвета', check: h => { const b = h.$('.btn-secondary'); return h.cs(b, 'background-color') === rgb('#ffffff') && h.px(b, 'border-top-width') === 2 && h.cs(b, 'border-top-color') === rgb('#2d6a4f') && h.cs(b, 'color') === rgb('#2d6a4f') || `фон ${h.cs(b, 'background-color')}, рамка ${h.cs(b, 'border-top-width')} ${h.cs(b, 'border-top-color')}, текст ${h.cs(b, 'color')}`; } },
        { name: 'Состояния: :hover с тёмным фоном, :focus-visible с outline, :disabled серый', check: h => { const hov = ruleWith(h, /\.btn(-primary)?:hover/, 'background-color'); if (!hov || !/var\(--color-primary-dark\)|27, 67, 50/.test(hov.style.getPropertyValue('background-color'))) return 'нет :hover с фоном var(--color-primary-dark)'; if (!hasOutline(h, /\.btn:focus-visible/)) return 'нет .btn:focus-visible с outline'; const d = h.$('.btn:disabled'); return h.cs(d, 'background-color') !== rgb('#2d6a4f') && h.cs(d, 'cursor') === 'not-allowed' || 'выключенная кнопка выглядит как обычная'; } },
        { name: 'Поле .input: шрифт 16px, высота от 44px, :focus-visible с outline', check: h => { const r = h.rect('.input'); if (h.px('.input', 'font-size') < 16 || r.height < 43.5) return `шрифт ${h.px('.input', 'font-size')}px, высота ${Math.round(r.height)}px`; return hasOutline(h, /\.input:focus-visible/) || 'нет .input:focus-visible с outline'; } }
      ]
    },
    {
      id: 'k5502', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 2. Адаптивная главная страница', level: 'Сложное', minutes: 35, points: 200,
      story: 'Стайлгайд готов (он уже в CSS). Теперь — главная страница клиники по ТЗ: шапка, первый экран, услуги, подвал. Проверять будут на компьютере и на телефоне 360px.',
      goal: 'Замените div на семантические теги, сохранив классы: .header → header, .nav → nav (внутри header), .main → main, .footer → footer. Вёрстку пишите mobile first: на телефоне 360px нет горизонтальной прокрутки, текст не меньше 16px, карточки услуг в одну колонку, картинки не вылезают за карточку (max-width: 100%). На компьютере (@media (min-width: 768px)) логотип и меню стоят в один ряд, а три карточки услуг — в один ряд (grid). Кнопка «Записаться на приём» — не ниже 44px. Телефон в подвале — ссылка tel:.',
      hints: [
        'Семантика: <header class="header">…<nav class="nav" aria-label="Главное меню">…</nav></header>, <main class="main">, <footer class="footer">.',
        'Картинки: .card img { display: block; max-width: 100%; height: auto; }.',
        'Mobile first: .cards { display: grid; grid-template-columns: 1fr; gap: var(--space); } и в @media (min-width: 768px) — repeat(3, 1fr).',
        'Шапка на компьютере: .header { display: flex; justify-content: space-between; align-items: center; }. Телефон: <a href="tel:+74951234567">+7 495 123-45-67</a>.'
      ],
      html: `<div class="header">
  <p class="logo">Хвост и лапы</p>
  <div class="nav">
    <a href="#services">Услуги</a>
    <a href="#booking">Запись</a>
    <a href="#contacts">Контакты</a>
  </div>
</div>
<div class="main">
  <section class="hero">
    <h1>Ветклиника рядом с домом</h1>
    <p>Лечим кошек, собак и грызунов. Приём без очередей по записи, с 8:00 до 22:00 без выходных.</p>
    <a class="btn btn-primary" href="#booking">Записаться на приём</a>
  </section>
  <section class="services" id="services">
    <h2>Услуги</h2>
    <div class="cards">
      <article class="card"><img src="${IMG}" alt="Врач осматривает кошку" width="600" height="300"><h3>Осмотр терапевта</h3><p>Первичный приём и рекомендации — от 900 ₽.</p></article>
      <article class="card"><img src="${IMG}" alt="Собака на прививке" width="600" height="300"><h3>Прививки</h3><p>Комплексная вакцинация с паспортом — от 1500 ₽.</p></article>
      <article class="card"><img src="${IMG}" alt="Груминг шпица" width="600" height="300"><h3>Груминг</h3><p>Стрижка, когти, уши — от 1200 ₽.</p></article>
    </div>
  </section>
  <section class="booking" id="booking">
    <h2>Запись на приём</h2>
    <p>Форма записи появится в задании 3.</p>
  </section>
</div>
<div class="footer" id="contacts">
  <p>Москва, ул. Садовая, 12. Телефон: +7 495 123-45-67</p>
</div>`,
      css: `${GUIDE}
.logo { margin: 0; font-size: 22px; font-weight: bold; color: var(--color-primary); }
.nav a { color: var(--color-primary-dark); }
.card { width: 600px; }
.footer { background-color: var(--color-primary-dark); color: #ffffff; }`,
      tests: [
        { name: 'Семантика: header с nav внутри, main, footer', check: h => { if (h.count('header') !== 1 || !h.$('header nav')) return 'нужен header с nav внутри'; if (h.count('main') !== 1) return 'нужен один main'; if (h.count('footer') !== 1) return 'нужен footer'; return !h.$('div.header, div.nav, div.main, div.footer') || 'остались div с классами header/nav/main/footer'; } },
        { name: 'На 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || `ширина страницы ${h.doc.documentElement.scrollWidth}px` },
        { name: 'На телефоне текст не меньше 16px, карточки в одну колонку', at: 360, check: h => { const small = h.$$('p').find(p => h.px(p, 'font-size') < 16); if (small) return `текст ${h.px(small, 'font-size')}px`; const l = h.$$('.card').map(c => Math.round(c.getBoundingClientRect().left)); return new Set(l).size === 1 || 'карточки не в одну колонку'; } },
        { name: 'Картинки не вылезают за карточку', at: 360, check: h => h.$$('.card').every(c => h.inside(c.querySelector('img'), c)) || 'картинка шире карточки' },
        { name: 'На компьютере логотип и меню в один ряд', check: h => { const l = h.rect('.logo'), n = h.rect('nav'); return !!(l && n) && l.top < n.bottom && n.top < l.bottom && n.left >= l.right || 'логотип и меню на разных строках'; } },
        { name: 'На компьютере три карточки в один ряд, вёрстка mobile first (@media min-width)', check: h => { if (!h.sameRow(h.$$('.card'))) return 'карточки не в одном ряду'; return h.rules.some(r => /min-width/.test(r.media)) || 'нет @media (min-width: …)'; } },
        { name: 'Кнопка «Записаться на приём» не ниже 44px', at: 360, check: h => h.rect('.hero .btn').height >= 43.5 || `сейчас ${Math.round(h.rect('.hero .btn').height)}px` },
        { name: 'Телефон в подвале — ссылка tel:', check: h => !!h.$('footer a[href^="tel:"]') || 'нет ссылки tel: в footer' }
      ]
    },
    {
      id: 'k5503', lesson: 'mdk-55', module: 'mdk5', mech: 'build', title: 'Модуль 3. Форма записи с проверкой', level: 'Сложное', minutes: 30, points: 200,
      story: 'Последняя часть страницы — форма записи на приём. Браузерные всплывашки отключены (novalidate), проверяет ваш JavaScript, а ошибки показываются рядом с полями.',
      goal: 'В HTML свяжите каждое поле с его сообщением об ошибке: aria-describedby="name-error" и т. д. В script.js при отправке формы #booking-form: отмените перезагрузку; проверьте поля — имя не пустое, в телефоне не меньше 11 цифр, почта содержит @ и точку, галочка согласия стоит. Если поле с ошибкой — текст ошибки в его .error (что не так и как исправить) и aria-invalid="true"; если верно — ошибку очистить и aria-invalid="false". Если всё верно — в #status «Спасибо, <имя>! Мы перезвоним в течение часа.». Сообщения об ошибках — цвета var(--color-error). На телефоне 360px поля во всю ширину формы.',
      hints: [
        'Только цифры телефона: phone.value.replace(/\\D/g, \'\') — убирает всё, что не цифра. Потом сравните .length с 11.',
        'Почта: email.value.includes(\'@\') && email.value.includes(\'.\').',
        'Чтобы не повторять код четыре раза, напишите функцию: function setError(input, errorEl, message) { errorEl.textContent = message; input.setAttribute(\'aria-invalid\', message ? \'true\' : \'false\'); }',
        'Итог: let ok = true; … если ошибка — ok = false; … if (ok) { statusText.textContent = \'Спасибо, \' + name.value.trim() + \'! Мы перезвоним в течение часа.\'; }'
      ],
      html: `<section class="booking" id="booking">
  <h2>Запись на приём</h2>
  <form class="form" id="booking-form" novalidate>
    <label for="name">Ваше имя</label>
    <input class="input" id="name" type="text" autocomplete="name">
    <p class="error" id="name-error"></p>
    <label for="phone">Телефон</label>
    <input class="input" id="phone" type="tel" autocomplete="tel" placeholder="+7 900 123-45-67">
    <p class="error" id="phone-error"></p>
    <label for="email">Почта</label>
    <input class="input" id="email" type="email" autocomplete="email">
    <p class="error" id="email-error"></p>
    <label class="check"><input id="agree" type="checkbox"> Согласен на обработку персональных данных</label>
    <p class="error" id="agree-error"></p>
    <button class="btn btn-primary" type="submit">Записаться</button>
    <p class="status" id="status" role="status"></p>
  </form>
</section>`,
      css: `${GUIDE}
.booking { padding: var(--space); background-color: var(--color-surface); }
.form { display: flex; flex-direction: column; gap: 4px; max-width: 480px; }
label { font-weight: bold; }
.check { display: flex; gap: 8px; align-items: center; font-weight: normal; }
.input { min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #6b7780; border-radius: var(--radius); }
.input:focus-visible { outline: 3px solid var(--color-accent); }
.error { margin: 0; font-size: 14px; }
.status { margin: 8px 0 0; font-weight: bold; color: var(--color-primary-dark); }`,
      js: `const form = document.querySelector('#booking-form');
const statusText = document.querySelector('#status');

// При отправке: preventDefault, проверка четырёх полей, ошибки рядом с полями, итоговое сообщение
`,
      tests: [
        { name: 'Каждое поле связано со своей ошибкой через aria-describedby', check: h => { for (const id of ['name', 'phone', 'email', 'agree']) if (h.$('#' + id)?.getAttribute('aria-describedby') !== id + '-error') return `у #${id} нет aria-describedby="${id}-error"`; return true; } },
        { name: 'Ошибки красные: цвет var(--color-error)', check: h => h.cs('.error', 'color') === rgb('#b3261e') || `цвет ошибок ${h.cs('.error', 'color')}` },
        { name: 'На телефоне поля во всю ширину формы', at: 360, check: h => { const f = h.rect('.form').width; const bad = h.$$('.input').find(i => i.getBoundingClientRect().width < f - 1); return !bad || `поле #${bad.id} уже формы`; } },
        { name: 'Пустая форма: без перезагрузки, четыре ошибки и aria-invalid="true"', js: true, check: async h => { if (h.submit('#booking-form') !== false) return 'нет preventDefault в обработчике submit'; await h.wait(); for (const id of ['name', 'phone', 'email', 'agree']) { if (h.text('#' + id + '-error').length < 5) return `нет ошибки у поля #${id}`; if (h.doc.querySelector('#' + id).getAttribute('aria-invalid') !== 'true') return `у #${id} нет aria-invalid="true"`; } return true; } },
        { name: 'Короткий телефон и почта без @ — ошибки только у них', js: true, check: async h => { h.type('#name', 'Ольга'); h.type('#phone', '12345'); h.type('#email', 'olga.mail.ru'); h.click('#agree'); h.submit('#booking-form'); await h.wait(); if (h.text('#name-error') || h.text('#agree-error')) return 'ошибка у верно заполненного поля'; if (!h.text('#phone-error')) return 'нет ошибки у короткого телефона'; if (!h.text('#email-error')) return 'нет ошибки у почты без @'; return !/спасибо/i.test(h.text('#status')) || 'при ошибках не должно быть «Спасибо»'; } },
        { name: 'Всё верно: ошибки очищены, aria-invalid="false", «Спасибо, <имя>!»', js: true, check: async h => { h.submit('#booking-form'); await h.wait(); h.type('#name', 'Ольга'); h.type('#phone', '+7 900 123-45-67'); h.type('#email', 'olga@mail.ru'); h.click('#agree'); h.submit('#booking-form'); await h.wait(); for (const id of ['name', 'phone', 'email', 'agree']) { if (h.text('#' + id + '-error')) return `осталась ошибка у #${id}`; if (h.doc.querySelector('#' + id).getAttribute('aria-invalid') !== 'false') return `у #${id} aria-invalid не "false"`; } const s = h.text('#status'); return /спасибо/i.test(s) && /Ольга/.test(s) || `статус: «${s}»`; } }
      ]
    }
  );
})();
/* ---- content/tasks/w20.js ---- */
/* Занятие 20. ПР10. Разминка HTML/CSS: семантика, блочная модель, Flexbox, Grid */
(() => {
  const { rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w2001', lesson: 'm9-pr10', module: 'mdk93', mech: 'fix', title: 'Каркас страницы «Мои заявки»', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник начал страницу «Мои заявки» портала «ЧистоДом», но собрал её из одних div, взял устаревший <font>, а на телефоне карточка вылезает за край экрана. Приведите каркас в порядок — на нём будут стоять все пять страниц портала.',
      goal: 'HTML: шапку .top замените на <header class="header">, обёртку меню — на <nav class="nav">, общую обёртку содержимого — на <main class="page">. «Мои заявки» — единственный <h1> без <font> и <b>, карточка — <article class="card">, её название — <h2>. CSS: включите box-sizing: border-box для всех элементов (*, *::before, *::after); переименуйте .top в .header и сделайте её flex: логотип слева, меню справа (justify-content: space-between), по вертикали по центру (align-items: center); .nav — тоже flex с gap не меньше 8px. На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        'Каркас: <header class="header"> <a class="logo" …>…</a> <nav class="nav">…две ссылки…</nav> </header> <main class="page"> <h1>Мои заявки</h1> <article class="card">…</article> </main>',
        'Заголовок карточки: <h2>Генеральная уборка</h2> вместо <div class="card-title">. Размер заголовков задаётся в CSS, а не тегом <font>.',
        'Первое правило CSS: *, *::before, *::after { box-sizing: border-box; } — тогда width: 100% включает padding и рамку.',
        '.header { display: flex; justify-content: space-between; align-items: center; … } и .nav { display: flex; gap: 16px; }'
      ],
      html: `<div class="top">
  <div><a class="logo" href="#requests">ЧистоДом</a></div>
  <div class="nav">
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </div>
</div>
<div>
  <div><b><font size="6">Мои заявки</font></b></div>
  <div class="card">
    <div class="card-title">Генеральная уборка</div>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </div>
</div>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.top { padding: 12px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav a { color: #ffffff; }
.card { width: 100%; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }`,
      tests: [
        { name: 'Шапка — <header class="header">, в ней логотип и <nav class="nav"> с двумя ссылками', check: h => {
          if (!h.$('header.header')) return 'нет <header class="header">';
          if (!h.$('header.header .logo')) return 'логотип должен быть внутри шапки';
          return h.count('header.header nav.nav a') === 2 || 'внутри шапки нужен <nav class="nav"> с двумя ссылками';
        } },
        { name: 'Содержимое в <main class="page">, «Мои заявки» — единственный <h1>', check: h => {
          if (h.count('main.page') !== 1) return 'нужен один <main class="page">';
          if (h.count('h1') !== 1) return `заголовков h1: ${h.count('h1')}, нужен один`;
          return h.text('main h1') === 'Мои заявки' || 'h1 «Мои заявки» должен быть внутри main';
        } },
        { name: 'Нет <font> и <b>, карточка — <article class="card"> с <h2>', check: h => {
          if (h.$('font, b')) return 'остались <font> или <b>';
          return h.text('main article.card h2') === 'Генеральная уборка' || 'карточка — <article class="card">, внутри <h2>Генеральная уборка</h2>';
        } },
        { name: 'box-sizing: border-box у всех элементов', check: h => ['.card', 'main', 'p'].every(s => h.cs(s, 'box-sizing') === 'border-box') || 'добавьте *, *::before, *::after { box-sizing: border-box; }' },
        { name: 'Шапка на Flexbox: логотип слева, меню справа, по центру по вертикали', check: h => {
          if (h.cs('header', 'display') !== 'flex') return `у шапки display: ${h.cs('header', 'display')}`;
          if (h.cs('header', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          if (h.cs('header', 'align-items') !== 'center') return 'нужно align-items: center';
          const a = h.rect('header .logo'), n = h.rect('header nav');
          if (!a || !n) return 'нет логотипа или меню';
          return a.right <= n.left || 'меню должно стоять правее логотипа';
        } },
        { name: 'Меню .nav — flex с промежутком gap не меньше 8px', check: h => h.cs('.nav', 'display') === 'flex' && h.px('.nav', 'column-gap') >= 8 || 'нужно .nav { display: flex; gap: … }' },
        { name: 'Цвета не потерялись: шапка #0f766e', check: h => h.cs('header', 'background-color') === rgb('#0f766e') || 'перенесите фон .top в .header' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана: карточка с padding вылезает' }
      ]
    },
    {
      id: 'w2002', lesson: 'm9-pr10', module: 'mdk93', mech: 'build', title: 'Карточки заявок на Grid', level: 'Среднее', minutes: 25, points: 150,
      story: 'В каждой карточке заявки «ЧистоДома» есть подписи «Дата», «Адрес», «Оплата» и значения к ним. Сейчас всё идёт столбиком, а сами карточки стоят друг под другом даже на большом мониторе. Разложим всё сеткой.',
      goal: 'Список .request-info сделайте Grid с колонками 100px и 1fr (gap: 4px 12px, margin: 0), у dd уберите отступ браузера (margin: 0). Ошибку в правиле .request-info dt (display: grid стоит у ребёнка, а не у контейнера) исправьте: у dt оставьте только цвет. Контейнер .requests — Grid с grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) и gap 16px. На 1024px три карточки встанут в ряд, на 360px — в одну колонку без прокрутки.',
      hints: [
        'Grid включается у контейнера: .request-info { display: grid; grid-template-columns: 100px 1fr; gap: 4px 12px; margin: 0; }',
        'У <dd> браузер ставит margin-left: 40px — сбросьте: .request-info dd { margin: 0; }',
        '.requests { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
    <article class="request-card">
      <h2>Генеральная уборка</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>12.11.2026, 10:00</dd>
        <dt>Адрес</dt><dd>ул. Ленина, 5, кв. 12</dd>
        <dt>Оплата</dt><dd>Банковская карта</dd>
      </dl>
    </article>
    <article class="request-card">
      <h2>Химчистка ковров</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>03.11.2026, 14:30</dd>
        <dt>Адрес</dt><dd>пр. Мира, 18</dd>
        <dt>Оплата</dt><dd>Наличные</dd>
      </dl>
    </article>
    <article class="request-card">
      <h2>Общий клининг</h2>
      <dl class="request-info">
        <dt>Дата</dt><dd>20.10.2026, 09:00</dd>
        <dt>Адрес</dt><dd>ул. Ленина, 5, кв. 12</dd>
        <dt>Оплата</dt><dd>Наличные</dd>
      </dl>
    </article>
  </section>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 28px; }
.request-card { padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.request-info dt { display: grid; color: #64748b; }
`,
      tests: [
        { name: 'Список .request-info — Grid с колонками 100px и 1fr', check: h => {
          if (h.cs('.request-info', 'display') !== 'grid') return `у .request-info display: ${h.cs('.request-info', 'display')}`;
          const cols = h.cs('.request-info', 'grid-template-columns').split(' ');
          return cols.length === 2 && cols[0] === '100px' || `колонки сейчас: ${h.cs('.request-info', 'grid-template-columns')}`;
        } },
        { name: 'Подпись и значение стоят в одной строке', check: h => {
          const dt = h.$('.request-info dt'), dd = h.$('.request-info dd');
          return h.sameRow([dt, dd]) && h.rect(dd).left > h.rect(dt).left || 'значение должно стоять справа от подписи';
        } },
        { name: 'У dd и dl нет отступов браузера (margin: 0)', check: h => h.px('.request-info dd', 'margin-left') === 0 && h.px('.request-info', 'margin-top') === 0 || 'сбросьте margin у .request-info и dd' },
        { name: 'У dt больше нет display: grid', check: h => h.cs('.request-info dt', 'display') !== 'grid' || 'grid включают у контейнера, а не у dt' },
        { name: '.requests — Grid с repeat(auto-fill, minmax(280px, 1fr)) и gap 16px', check: h => {
          if (h.cs('.requests', 'display') !== 'grid') return 'у .requests нет display: grid';
          if (!h.has(/repeat\(\s*auto-fill\s*,\s*minmax\(\s*280px\s*,\s*1fr\s*\)\s*\)/)) return 'нужно repeat(auto-fill, minmax(280px, 1fr))';
          return h.px('.requests', 'row-gap') === 16 && h.px('.requests', 'column-gap') === 16 || 'промежуток должен быть 16px';
        } },
        { name: '1024px: три карточки в одном ряду', check: h => h.sameRow(h.$$('.request-card')) || 'карточки не встали в ряд' },
        { name: '360px: карточки в одну колонку, без прокрутки', at: 360, check: h => {
          const l = h.$$('.request-card').map(c => h.rect(c).left);
          if (Math.max(...l) - Math.min(...l) > 1) return 'на телефоне карточки должны стоять одна под другой';
          return !h.overflow() || 'страница шире экрана';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w21.js ---- */
/* Занятие 21. ЛР11. Перенос макета в код: шаблон страниц, общие стили */
(() => {
  const { rgb, near } = window.COURSE_KIT;
  const varOf = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  const VARS = [['--color-primary', '#0f766e'], ['--color-primary-dark', '#115e59'], ['--color-on-primary', '#ffffff'], ['--color-bg', '#f8fafc'],
    ['--color-surface', '#ffffff'], ['--color-text', '#0f172a'], ['--color-muted', '#64748b'], ['--color-border', '#cbd5e1']];
  const STYLE_ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --radius: 12px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
h1, h2 { margin: 0 0 var(--space-2); line-height: 1.2; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w2101', lesson: 'm9-lr11', module: 'mdk93', mech: 'optimize', title: 'Стайл-гайд в переменных', level: 'Среднее', minutes: 25, points: 150,
      story: 'Заказчик «ЧистоДома» уже дважды просил «чуть другой бирюзовый». Сейчас цвет вписан в CSS в четырёх местах, и каждый раз его ищут по всему файлу. Перенесём стайл-гайд в CSS-переменные — тогда перекраска портала займёт одну строку.',
      goal: 'В начале CSS объявите в :root переменные: --color-primary #0f766e, --color-primary-dark #115e59, --color-on-primary #ffffff, --color-bg #f8fafc, --color-surface #ffffff, --color-text #0f172a, --color-muted #64748b, --color-border #cbd5e1, --radius 12px, --space-2 16px, --space-3 24px. Во всех остальных правилах замените цвета, радиусы и отступы 16px/24px на var(…): вне :root в CSS не должно остаться ни одного #цвета. Внешний вид страницы не меняется.',
      hints: [
        ':root { --color-primary: #0f766e; --color-primary-dark: #115e59; … } — переменная начинается с двух дефисов.',
        'Использование: .btn { background: var(--color-primary); color: var(--color-on-primary); border-radius: var(--radius); }',
        'Белый фон карточки — var(--color-surface), белый текст на бирюзовом — var(--color-on-primary). Отступ 16px — var(--space-2), 24px — var(--space-3).',
        'Проверьте себя поиском по CSS: символ # должен встречаться только внутри :root.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Набор компонентов</h1>
  <p class="muted">Так выглядят кнопка и карточка во всех страницах портала.</p>
  <button class="btn" type="button">Создать заявку</button>
  <article class="card">
    <h2>Генеральная уборка</h2>
    <p class="muted">12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #0f766e; }
.header a { color: #ffffff; text-decoration: none; }
.nav { display: flex; gap: 16px; }
.page { padding: 24px 16px; }
.muted { color: #64748b; }
.btn { padding: 12px 24px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font: inherit; cursor: pointer; }
.btn:hover { background: #115e59; }
.card { margin-top: 24px; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; }
.card h2 { margin: 0 0 8px; color: #0f766e; }`,
      tests: [
        { name: ':root: восемь цветов стайл-гайда', check: h => {
          for (const [n, v] of VARS) { const got = varOf(h, n); if (got !== v) return got ? `${n}: ${got}, нужно ${v}` : `нет переменной ${n}`; }
          return true;
        } },
        { name: ':root: --radius 12px, --space-2 16px, --space-3 24px', check: h => varOf(h, '--radius') === '12px' && varOf(h, '--space-2') === '16px' && varOf(h, '--space-3') === '24px' || 'объявите --radius, --space-2 и --space-3' },
        { name: 'Вне :root нет ни одного #цвета', check: h => {
          const rest = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
          const m = rest.match(/#[0-9a-f]{3,8}\b/i);
          return !m || `в правилах остался ${m[0]}: замените на var(…)`;
        } },
        { name: 'var(--color-primary) используется у шапки, кнопки и заголовка карточки', check: h => h.occurrences('var(--color-primary)') >= 3 || `var(--color-primary) встречается ${h.occurrences('var(--color-primary)')} раз(а), нужно не меньше 3` },
        { name: 'Радиусы и отступы тоже из переменных', check: h => h.occurrences('var(--radius)') >= 2 && h.occurrences('var(--space-2)') >= 2 && h.occurrences('var(--space-3)') >= 1 || 'замените 12px, 16px и 24px на var(--radius), var(--space-2), var(--space-3)' },
        { name: 'Внешний вид не изменился: шапка и кнопка #0f766e, фон #f8fafc, радиус 12px', check: h => {
          if (h.cs('.header', 'background-color') !== rgb('#0f766e')) return 'шапка не бирюзовая';
          if (h.cs('.btn', 'background-color') !== rgb('#0f766e')) return 'кнопка не бирюзовая';
          if (h.cs('body', 'background-color') !== rgb('#f8fafc')) return 'фон страницы изменился';
          return h.px('.card', 'border-top-left-radius') === 12 && h.px('.page', 'padding-left') === 16 || 'радиус карточки или отступ страницы изменились';
        } }
      ]
    },
    {
      id: 'w2102', lesson: 'm9-lr11', module: 'mdk93', mech: 'build', title: 'Кнопки и карточка — компоненты', level: 'Среднее', minutes: 30, points: 150,
      story: 'В style.css «ЧистоДома» уже есть переменные стайл-гайда. Теперь нужны детали конструктора: кнопка с двумя вариантами, карточка и контейнер страницы. Из них потом соберём все пять страниц портала.',
      goal: 'Используя переменные из :root, напишите: .page — width: 100%, max-width: 480px, по центру (margin: 0 auto), padding var(--space-3) var(--space-2). .btn — display: inline-flex, текст по центру (justify-content и align-items: center), min-height: 48px, padding 0 var(--space-3), без рамки, радиус var(--radius), фон var(--color-primary), белый текст, font: inherit, жирность 600, без подчёркивания. .btn:hover — фон var(--color-primary-dark). .btn--block — width: 100%. .btn--outline — прозрачный фон, рамка 2px solid var(--color-primary), текст var(--color-primary). .card — фон var(--color-surface), радиус var(--radius), тень var(--shadow), padding var(--space-2).',
      hints: [
        '.page { width: 100%; max-width: 480px; margin: 0 auto; padding: var(--space-3) var(--space-2); }',
        '.btn { display: inline-flex; justify-content: center; align-items: center; min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; text-decoration: none; cursor: pointer; }',
        'Модификаторы пишутся отдельными классами: .btn--block { width: 100%; } .btn--outline { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }',
        '.card { background: var(--color-surface); border-radius: var(--radius); box-shadow: var(--shadow); padding: var(--space-2); }'
      ],
      html: `<main class="page">
  <h1>Набор компонентов</h1>
  <p>Ссылка-кнопка и две кнопки формы:</p>
  <p>
    <a class="btn" href="#new">Новая заявка</a>
    <button class="btn btn--outline" type="button">Отмена</button>
  </p>
  <button class="btn btn--block" type="submit">Войти</button>
  <h2>Карточка</h2>
  <article class="card">
    <h3>Генеральная уборка</h3>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `${STYLE_ROOT}
/* Ниже — компоненты: .page, .btn, .btn:hover, .btn--block, .btn--outline, .card */
`,
      tests: [
        { name: '.page не шире 480px и стоит по центру', check: h => {
          const r = h.rect('.page');
          if (r.width > 481) return `ширина .page ${Math.round(r.width)}px`;
          return near(r.left, (h.width - r.width) / 2, 2) || 'контейнер не по центру: margin: 0 auto';
        } },
        { name: '.page: внутренние отступы 24px сверху и 16px по бокам', check: h => h.px('.page', 'padding-top') === 24 && h.px('.page', 'padding-left') === 16 || 'padding: var(--space-3) var(--space-2)' },
        { name: '.btn: inline-flex, текст по центру, высота не меньше 48px', check: h => {
          if (h.cs('a.btn', 'display') !== 'inline-flex') return `display: ${h.cs('a.btn', 'display')}`;
          if (h.cs('a.btn', 'justify-content') !== 'center' || h.cs('a.btn', 'align-items') !== 'center') return 'нужно justify-content и align-items: center';
          return h.$$('.btn').every(b => h.rect(b).height >= 47.5) || 'кнопки ниже 48px';
        } },
        { name: '.btn: бирюзовый фон, белый текст, без рамки, радиус 12px', check: h => {
          if (h.cs('a.btn', 'background-color') !== rgb('#0f766e')) return 'фон — var(--color-primary)';
          if (h.cs('a.btn', 'color') !== rgb('#ffffff')) return 'текст белый';
          if (h.px('.btn--block', 'border-top-width') !== 0) return 'у кнопки осталась рамка браузера: border: none';
          return h.px('a.btn', 'border-top-left-radius') === 12 || 'радиус — var(--radius)';
        } },
        { name: '.btn: шрифт страницы (font: inherit), ссылка без подчёркивания', check: h => {
          if (h.cs('button.btn', 'font-family') !== h.cs('body', 'font-family')) return 'у кнопки шрифт браузера: font: inherit';
          return h.cs('a.btn', 'text-decoration-line') === 'none' || 'уберите подчёркивание у ссылки-кнопки';
        } },
        { name: '.btn:hover — фон var(--color-primary-dark)', check: h => h.rules.some(r => /\.btn:hover/.test(r.selector) && /var\(--color-primary-dark\)/.test(r.style.cssText)) || 'нет правила .btn:hover с var(--color-primary-dark)' },
        { name: '.btn--block — на всю ширину контейнера', check: h => {
          const p = h.rect('.page'), inner = p.width - h.px('.page', 'padding-left') - h.px('.page', 'padding-right');
          return near(h.rect('.btn--block').width, inner, 1) || 'кнопка «Войти» должна быть шириной во весь контейнер';
        } },
        { name: '.btn--outline: прозрачный фон, рамка 2px и текст бирюзового цвета', check: h => {
          const s = '.btn--outline', bg = h.cs(s, 'background-color');
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return 'фон должен быть прозрачным';
          if (h.px(s, 'border-top-width') !== 2 || h.cs(s, 'border-top-color') !== rgb('#0f766e')) return 'рамка 2px solid var(--color-primary)';
          return h.cs(s, 'color') === rgb('#0f766e') || 'текст — var(--color-primary)';
        } },
        { name: '.card: белый фон, радиус 12px, отступ 16px, тень', check: h => {
          if (h.cs('.card', 'background-color') !== rgb('#ffffff')) return 'фон карточки белый';
          if (h.px('.card', 'border-top-left-radius') !== 12) return 'радиус 12px';
          if (h.px('.card', 'padding-left') !== 16) return 'padding 16px';
          return h.cs('.card', 'box-shadow') !== 'none' || 'нужна тень var(--shadow)';
        } },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/w22.js ---- */
/* Занятие 22. ПР11. Формы HTML: типы input, label, required, pattern, select, radio */
(() => {
  // Проверяет, пропустит ли браузер значение v в поле sel; значение поля потом возвращается обратно
  const valid = (h, sel, v) => {
    const e = typeof sel === 'string' ? h.$(sel) : sel;
    if (!e) return null;
    const old = e.value; e.value = v;
    const ok = e.checkValidity(); e.value = old;
    return ok;
  };
  const FORM_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a; background: #f8fafc; }
.page { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.btn { min-height: 48px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font: inherit; font-weight: 600; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w2201', lesson: 'm9-pr11', module: 'mdk93', mech: 'build', title: 'Регистрация: правила проверки', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма регистрации «ЧистоДома» свёрстана, но пропускает что угодно: логин «a», ФИО латиницей, телефон без скобок. А ещё ни у одного поля нет name — сервер не получит ни одного значения. Научим форму требованиям ТЗ.',
      goal: 'У каждого поля задайте name, совпадающий с его id (login, password, fio, phone, email), и required. Типы: пароль — password, телефон — tel, email — email. Логин и пароль — не короче 6 символов (minlength). ФИО — только русские буквы, пробелы и дефис, включая Ёё: pattern="[А-Яа-яЁё\\s\\-]+". Телефон — формат +7(XXX)-XXX-XX-XX: pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" и placeholder с примером.',
      hints: [
        'Пример поля: <input type="text" id="login" name="login" required minlength="6" autocomplete="username">',
        'ФИО: <input type="text" id="fio" name="fio" required pattern="[А-Яа-яЁё\\s\\-]+" title="Только русские буквы, пробелы и дефис">. Без Ёё «Артём» не пройдёт.',
        'Телефон: <input type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">. Плюс и скобки в шаблоне экранируются обратным слешем.',
        'Email: <input type="email" id="email" name="email" required> — формат браузер проверит сам.'
      ],
      html: `<main class="page">
  <h1>Регистрация</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label for="login">Логин</label>
      <input type="text" id="login">
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input type="text" id="password">
    </div>
    <div class="field">
      <label for="fio">ФИО</label>
      <input type="text" id="fio">
    </div>
    <div class="field">
      <label for="phone">Телефон</label>
      <input type="text" id="phone">
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input type="text" id="email">
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${FORM_CSS}
input { font: inherit; }`,
      tests: [
        { name: 'У каждого поля есть name, такой же, как id', check: h => {
          const bad = ['login', 'password', 'fio', 'phone', 'email'].filter(id => h.$('#' + id)?.getAttribute('name') !== id);
          return !bad.length || `нет name у: ${bad.join(', ')}`;
        } },
        { name: 'Все пять полей обязательные (required)', check: h => {
          const bad = ['login', 'password', 'fio', 'phone', 'email'].filter(id => !h.$('#' + id)?.required);
          return !bad.length || `нет required у: ${bad.join(', ')}`;
        } },
        { name: 'Типы: пароль — password, телефон — tel, email — email', check: h => {
          if (h.$('#password').type !== 'password') return 'пароль должен быть скрыт: type="password"';
          if (h.$('#phone').type !== 'tel') return 'телефон: type="tel"';
          return h.$('#email').type === 'email' || 'email: type="email"';
        } },
        { name: 'Логин и пароль — не короче 6 символов (minlength="6")', check: h => {
          const bad = ['login', 'password'].filter(id => h.$('#' + id)?.minLength !== 6);
          return !bad.length || `нет minlength="6" у: ${bad.join(', ')}`;
        } },
        { name: 'ФИО — кириллица, пробелы и дефис, буква Ё тоже', check: h => {
          if (valid(h, '#fio', 'Ivanov Petr') !== false) return '«Ivanov Petr» проходит, а не должен';
          if (valid(h, '#fio', 'Анна1') !== false) return '«Анна1» с цифрой проходит, а не должен';
          return valid(h, '#fio', 'Артём Семёнов-Ёлкин') === true || '«Артём Семёнов-Ёлкин» не проходит: проверьте Ёё и экранирование дефиса';
        } },
        { name: 'Телефон — строго +7(XXX)-XXX-XX-XX, есть placeholder', check: h => {
          if (valid(h, '#phone', '89001234567') !== false) return '«89001234567» проходит, а не должен';
          if (valid(h, '#phone', '+7(900)-123-45-6') !== false) return '«+7(900)-123-45-6» (не хватает цифры) проходит';
          if (valid(h, '#phone', '+7(900)-123-45-67') !== true) return '«+7(900)-123-45-67» не проходит';
          return !!h.$('#phone').placeholder || 'добавьте placeholder с примером формата';
        } },
        { name: 'Email проверяется браузером', check: h => valid(h, '#email', 'ivanov') === false && valid(h, '#email', 'ivanov@mail.ru') === true || '«ivanov» должен не проходить, «ivanov@mail.ru» — проходить' }
      ]
    },
    {
      id: 'w2202', lesson: 'm9-pr11', module: 'mdk93', mech: 'build', title: 'Новая заявка: список, переключатели, дата', level: 'Сложное', minutes: 30, points: 200,
      story: 'В форме новой заявки «ЧистоДома» готовы адрес и телефон. Осталось самое интересное: выбор услуги, дата и время уборки, тип оплаты, комментарий и согласие на обработку данных.',
      goal: 'Допишите в форму поля, у каждого — подпись label. Вид услуги: <select id="service" name="service_id" required>, первый пункт «— Выберите услугу —» с value="", затем 4 услуги со значениями 1–4: Общий клининг, Генеральная уборка, Послестроительная уборка, Химчистка ковров и мебели. Дата: type="date", id и name date, required, не раньше 01.12.2026 (min="2026-12-01"). Время: type="time", id и name time, required. Тип оплаты: <fieldset> с <legend>Тип оплаты</legend> и двумя radio с name="payment" и value cash/card («Наличными», «Банковской картой»), required. Комментарий: <textarea id="comment" name="comment">, необязательный, maxlength="300". Согласие: checkbox name="agree", required.',
      hints: [
        '<label for="service">Вид услуги</label> <select id="service" name="service_id" required> <option value="">— Выберите услугу —</option> <option value="1">Общий клининг</option> … </select>',
        '<input type="date" id="date" name="date" required min="2026-12-01"> — дату в min пишут в формате ГГГГ-ММ-ДД.',
        'Радиокнопки одной группы — один name: <fieldset> <legend>Тип оплаты</legend> <label><input type="radio" name="payment" value="cash" required> Наличными</label> <label><input type="radio" name="payment" value="card"> Банковской картой</label> </fieldset>',
        '<textarea id="comment" name="comment" rows="3" maxlength="300"></textarea> и <label><input type="checkbox" name="agree" required> Согласен на обработку персональных данных</label>'
      ],
      html: `<main class="page">
  <h1>Новая заявка</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label for="address">Адрес</label>
      <input type="text" id="address" name="address" required autocomplete="street-address">
    </div>
    <div class="field">
      <label for="phone">Контактный телефон</label>
      <input type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">
    </div>
    <!-- Допишите: вид услуги, дата, время, тип оплаты, комментарий, согласие -->

    <button class="btn" type="submit">Отправить заявку</button>
  </form>
</main>`,
      css: `${FORM_CSS}
input, select, textarea { font: inherit; }
fieldset { margin: 0; padding: 0; border: 0; }`,
      tests: [
        { name: 'Вид услуги: select#service с name="service_id", required и пустым первым пунктом', check: h => {
          const s = h.$('select#service');
          if (!s) return 'нет <select id="service">';
          if (s.name !== 'service_id') return 'name="service_id"';
          if (!s.required) return 'нет required';
          return s.options[0]?.value === '' && !s.checkValidity() || 'первый пункт должен быть с value="" — тогда выбор обязателен';
        } },
        { name: 'В списке 4 услуги со значениями-номерами', check: h => {
          const o = h.$$('#service option').filter(x => x.value !== '');
          if (o.length !== 4) return `услуг: ${o.length}, нужно 4`;
          return o.every(x => /^\d+$/.test(x.value)) && valid(h, '#service', '2') === true || 'value услуг — номера 1–4';
        } },
        { name: 'Дата: type="date", name="date", обязательна, не раньше 01.12.2026', check: h => {
          const d = h.$('#date');
          if (!d || d.type !== 'date' || d.name !== 'date') return 'нужно <input type="date" id="date" name="date">';
          if (valid(h, d, '') !== false) return 'пустая дата проходит: добавьте required';
          if (valid(h, d, '2026-11-15') !== false) return '15.11.2026 проходит: добавьте min="2026-12-01"';
          return valid(h, d, '2026-12-05') === true || '05.12.2026 не проходит';
        } },
        { name: 'Время: type="time", name="time", обязательно', check: h => {
          const t = h.$('#time');
          return t && t.type === 'time' && t.name === 'time' && t.required || 'нужно <input type="time" id="time" name="time" required>';
        } },
        { name: 'Оплата: 2 radio с name="payment" в fieldset с legend', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (r.length !== 2) return `radio с name="payment": ${r.length}, нужно 2`;
          if (!r.every(x => x.closest('fieldset')?.querySelector('legend'))) return 'оберните кнопки в <fieldset> с <legend>';
          return r[0].value !== r[1].value && r.every(x => x.value) || 'у кнопок разные value: cash и card';
        } },
        { name: 'Тип оплаты нельзя не выбрать (required)', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (!r.length) return 'нет кнопок оплаты';
          if (r[0].checkValidity()) return 'без выбора оплаты форма проходит: добавьте required';
          r[1].checked = true; const ok = r[0].checkValidity(); r[1].checked = false;
          return ok || 'после выбора оплаты проверка всё ещё не проходит';
        } },
        { name: 'Комментарий: textarea name="comment", необязательный, до 300 символов', check: h => {
          const t = h.$('textarea#comment');
          return t && t.name === 'comment' && t.maxLength === 300 && !t.required || 'нужно <textarea id="comment" name="comment" maxlength="300"> без required';
        } },
        { name: 'Согласие: checkbox name="agree", обязательный', check: h => {
          const c = h.$('input[type="checkbox"][name="agree"]');
          return c && c.required && !c.checkValidity() || 'нужен <input type="checkbox" name="agree" required>';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w23.js ---- */
/* Занятие 23. ЛР12. Вёрстка форм регистрации, входа и заявки по макету */
(() => {
  const { rgb } = window.COURSE_KIT;
  const ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-accent: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #cbd5e1;
  --color-error: #dc2626;
  --fs-small: 0.875rem;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
h1 { margin: 0 0 var(--space-2); font-size: 1.75rem; }
.page { width: 100%; max-width: 480px; margin: 0 auto; padding: var(--space-3) var(--space-2); }
.btn { min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; cursor: pointer; }`;
  const FIELDS = `.form { display: flex; flex-direction: column; gap: var(--space-2); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { font-weight: 600; font-size: var(--fs-small); }
.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 16px; }
.field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; border-color: var(--color-primary); }
.btn--block { width: 100%; }`;
  const ruleWith = (h, re) => h.rules.find(r => re.test(r.selector));
  window.COURSE_TASKS.push(
    {
      id: 'w2301', lesson: 'm9-lr12', module: 'mdk93', mech: 'build', title: 'Компонент «поле» с ошибкой', level: 'Среднее', minutes: 30, points: 150,
      story: 'В макете регистрации «ЧистоДома» поля крупные, со скруглением, а под ними — подсказка или красная ошибка. Браузерные поля мелкие и серые. Сверстаем компонент «поле» и демо-состояние ошибки «Логин уже занят», которое в модуле 5 будет подставлять PHP.',
      goal: 'Разметка уже готова. Напишите CSS: .form и .field — flex-колонки с gap var(--space-2) и 4px. .field__label — жирность 600, размер var(--fs-small). .field__input — width: 100%, min-height: 48px, padding 0 var(--space-2), рамка 1px solid var(--color-border), радиус var(--radius), фон var(--color-surface), font: inherit и font-size: 16px. .field__input:focus-visible — outline 3px solid var(--color-accent). .field__hint — без отступов (margin: 0), размер var(--fs-small), цвет var(--color-muted). .field__error — margin: 0, размер var(--fs-small), цвет var(--color-error). .field--error .field__input — рамка цвета var(--color-error).',
      hints: [
        '.form { display: flex; flex-direction: column; gap: var(--space-2); } и .field { display: flex; flex-direction: column; gap: 4px; }',
        '.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); font: inherit; font-size: 16px; } — font-size после font, иначе font его перебьёт.',
        'Фокус: .field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; }',
        'Ошибка через модификатор родителя: .field--error .field__input { border-color: var(--color-error); }'
      ],
      html: `<main class="page">
  <h1>Регистрация</h1>
  <form class="form" action="#" method="post">
    <div class="field field--error">
      <label class="field__label" for="login">Логин</label>
      <input class="field__input" type="text" id="login" name="login" value="ivanov" required minlength="6" aria-invalid="true" aria-describedby="login-error">
      <p class="field__error" id="login-error">Логин уже занят</p>
    </div>
    <div class="field">
      <label class="field__label" for="password">Пароль</label>
      <input class="field__input" type="password" id="password" name="password" required minlength="6" aria-describedby="password-hint">
      <p class="field__hint" id="password-hint">Не менее 6 символов</p>
    </div>
    <div class="field">
      <label class="field__label" for="email">Email</label>
      <input class="field__input" type="email" id="email" name="email" required>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${ROOT}
/* Ниже — компонент «поле»: .form, .field, .field__label, .field__input, .field__hint, .field__error, .field--error */
`,
      tests: [
        { name: '.form и .field — колонки на Flexbox с промежутками 16px и 4px', check: h => {
          for (const [s, g] of [['.form', 16], ['.field', 4]]) {
            if (h.cs(s, 'display') !== 'flex' || h.cs(s, 'flex-direction') !== 'column') return `${s}: нужно display: flex и flex-direction: column`;
            if (h.px(s, 'row-gap') !== g) return `${s}: gap должен быть ${g}px`;
          }
          return true;
        } },
        { name: '.field__label: жирность 600, размер 0.875rem', check: h => +h.cs('.field__label', 'font-weight') >= 600 && h.px('.field__label', 'font-size') === 14 || 'font-weight: 600; font-size: var(--fs-small)' },
        { name: '.field__input: на всю ширину, высота не меньше 48px', check: h => {
          const f = h.rect('.field'), i = h.rect('#password');
          if (Math.abs(f.width - i.width) > 1) return 'поле должно быть шириной во весь блок .field';
          return i.height >= 47.5 || `высота поля ${Math.round(i.height)}px`;
        } },
        { name: '.field__input: шрифт страницы и размер 16px', check: h => h.cs('#password', 'font-family') === h.cs('body', 'font-family') && h.px('#password', 'font-size') === 16 || 'нужно font: inherit и font-size: 16px' },
        { name: '.field__input: рамка 1px цвета --color-border, радиус 12px, белый фон', check: h => {
          if (h.px('#password', 'border-top-width') !== 1 || h.cs('#password', 'border-top-color') !== rgb('#cbd5e1')) return 'рамка 1px solid var(--color-border)';
          if (h.cs('#password', 'background-color') !== rgb('#ffffff')) return 'фон — var(--color-surface)';
          return h.px('#password', 'border-top-left-radius') === 12 || 'радиус — var(--radius)';
        } },
        { name: 'Фокус заметен: :focus-visible с обводкой 3px', check: h => {
          const r = ruleWith(h, /field__input:focus-visible/);
          return r && /outline/.test(r.style.cssText) && /3px/.test(r.style.cssText) || 'нужно .field__input:focus-visible { outline: 3px solid var(--color-accent); }';
        } },
        { name: 'Подсказка серая, ошибка красная, обе без отступов, размер 0.875rem', check: h => {
          if (h.cs('.field__hint', 'color') !== rgb('#64748b')) return 'подсказка — var(--color-muted)';
          if (h.cs('.field__error', 'color') !== rgb('#dc2626')) return 'ошибка — var(--color-error)';
          if (h.px('.field__hint', 'margin-top') !== 0 || h.px('.field__error', 'margin-bottom') !== 0) return 'уберите margin у подсказки и ошибки';
          return h.px('.field__error', 'font-size') === 14 && h.px('.field__hint', 'font-size') === 14 || 'размер — var(--fs-small)';
        } },
        { name: 'Поле с ошибкой: рамка цвета --color-error, у обычных полей — серая', check: h => h.cs('#login', 'border-top-color') === rgb('#dc2626') && h.cs('#email', 'border-top-color') === rgb('#cbd5e1') || '.field--error .field__input { border-color: var(--color-error); }' }
      ]
    },
    {
      id: 'w2302', lesson: 'm9-lr12', module: 'mdk93', mech: 'build', title: 'Вход: форма по центру и общее сообщение', level: 'Среднее', minutes: 25, points: 150,
      story: 'В макете страница входа «ЧистоДома» стоит ровно посередине экрана телефона, а при неверном пароле сверху появляется плашка «Неверный логин или пароль». Сейчас форма прилипла к верху, а плашка выглядит как обычный текст.',
      goal: 'CSS: .page--auth — на всю высоту экрана (min-height: 100dvh), flex-колонка, содержимое по центру по вертикали (justify-content: center). .alert — padding 12px var(--space-2), радиус var(--radius), размер var(--fs-small). .alert--error — фон #fef2f2, текст #991b1b, рамка 1px solid #fecaca. .auth__link — текст по центру. HTML: блоку ошибки добавьте role="alert", полю логина — autocomplete="username", паролю — autocomplete="current-password".',
      hints: [
        '.page--auth { min-height: 100dvh; display: flex; flex-direction: column; justify-content: center; } — dvh учитывает панели мобильного браузера.',
        '.alert { padding: 12px var(--space-2); border-radius: var(--radius); font-size: var(--fs-small); } и .alert--error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }',
        'В HTML: <div class="alert alert--error" role="alert">…</div>, <input … autocomplete="username">, <input … autocomplete="current-password">',
        '.auth__link { text-align: center; }'
      ],
      html: `<main class="page page--auth">
  <img class="auth__logo" src="img/icon.svg" alt="ЧистоДом" width="48" height="48">
  <h1>Вход</h1>
  <div class="alert alert--error">Неверный логин или пароль</div>
  <form class="form" action="#" method="post">
    <div class="field">
      <label class="field__label" for="login">Логин</label>
      <input class="field__input" type="text" id="login" name="login" required>
    </div>
    <div class="field">
      <label class="field__label" for="password">Пароль</label>
      <input class="field__input" type="password" id="password" name="password" required>
    </div>
    <button class="btn btn--block" type="submit">Войти</button>
  </form>
  <p class="auth__link">Ещё нет аккаунта? <a href="#register">Зарегистрироваться</a></p>
</main>`,
      css: `${ROOT}
${FIELDS}
.auth__logo { display: block; margin: 0 auto var(--space-2); }
/* Ниже — .page--auth, .alert, .alert--error, .auth__link */
`,
      tests: [
        { name: 'Страница входа на всю высоту экрана: min-height: 100dvh', check: h => h.has(/min-height\s*:\s*100dvh/) && h.rect('.page--auth').height >= h.height - 1 || 'нужно .page--auth { min-height: 100dvh; }' },
        { name: 'Содержимое по центру по вертикали: flex, column, justify-content: center', check: h => {
          if (h.cs('.page--auth', 'display') !== 'flex' || h.cs('.page--auth', 'flex-direction') !== 'column') return 'нужно display: flex; flex-direction: column';
          return h.cs('.page--auth', 'justify-content') === 'center' || 'нужно justify-content: center';
        } },
        { name: 'Сообщение .alert--error: фон #fef2f2, текст #991b1b, рамка 1px #fecaca', check: h => {
          const s = '.alert--error';
          if (h.cs(s, 'background-color') !== rgb('#fef2f2')) return 'фон #fef2f2';
          if (h.cs(s, 'color') !== rgb('#991b1b')) return 'текст #991b1b';
          return h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-color') === rgb('#fecaca') || 'рамка 1px solid #fecaca';
        } },
        { name: '.alert: отступы 12px и 16px, радиус 12px, размер 0.875rem', check: h => h.px('.alert', 'padding-top') === 12 && h.px('.alert', 'padding-left') === 16 && h.px('.alert', 'border-top-left-radius') === 12 && h.px('.alert', 'font-size') === 14 || 'padding: 12px var(--space-2); border-radius: var(--radius); font-size: var(--fs-small)' },
        { name: 'Сообщение объявляется экранным диктором: role="alert"', check: h => h.$('.alert')?.getAttribute('role') === 'alert' || 'добавьте role="alert"' },
        { name: 'Подсказки браузеру: autocomplete="username" и "current-password"', check: h => h.$('#login').getAttribute('autocomplete') === 'username' && h.$('#password').getAttribute('autocomplete') === 'current-password' || 'добавьте autocomplete полям логина и пароля' },
        { name: 'Ссылка на регистрацию по центру', check: h => h.cs('.auth__link', 'text-align') === 'center' || 'text-align: center' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/w24.js ---- */
/* Занятие 24. ПР12. Адаптив: mobile-first, media queries, относительные единицы */
(() => {
  const { IMG } = window.COURSE_KIT;
  const card = (t, d) => `    <article class="request-card">
      <h2>${t}</h2>
      <p>${d}</p>
    </article>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2401', lesson: 'm9-pr12', module: 'mdk93', mech: 'adaptive', title: 'Mobile-first: список заявок', level: 'Среднее', minutes: 30, points: 150,
      story: 'Страницу «Мои заявки» «ЧистоДома» сверстали под монитор: ширина 1100px гвоздями, а телефон «чинят» медиазапросом max-width. На ноутбуке 1024px уже появилась прокрутка вбок. Перепишем стили по принципу mobile-first.',
      goal: 'Базовые правила (без медиазапросов) — для телефона: .page — width: min(100% - 32px, 1100px) и margin: 0 auto; .requests — одна колонка (grid-template-columns: 1fr) с gap 16px; h1 — font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem); размер заголовка карточки — 1.125rem. Затем @media (min-width: 768px) — .requests в две колонки (1fr 1fr), @media (min-width: 1200px) — в три (repeat(3, 1fr)). Медиазапросов с max-width быть не должно, размеры шрифтов — без px.',
      hints: [
        'Удалите блок @media (max-width: 768px) — его правила станут базовыми.',
        '.page { width: min(100% - 32px, 1100px); margin: 0 auto; } — 16px полей по бокам на телефоне и не шире 1100px на мониторе.',
        'Внутри медиазапроса пишите только то, что меняется: @media (min-width: 768px) { .requests { grid-template-columns: 1fr 1fr; } }',
        'Запросы идут от меньшего к большему: сначала 768px, потом @media (min-width: 1200px) { .requests { grid-template-columns: repeat(3, 1fr); } }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
${[['Генеральная уборка', '12.11.2026, 10:00 · ул. Ленина, 5'], ['Химчистка ковров', '03.11.2026, 14:30 · пр. Мира, 18'], ['Общий клининг', '20.10.2026, 09:00 · ул. Ленина, 5'],
    ['Мойка окон', '25.11.2026, 11:00 · ул. Садовая, 3'], ['Уборка после ремонта', '01.12.2026, 09:30 · ул. Мира, 7'], ['Химчистка дивана', '05.12.2026, 15:00 · ул. Ленина, 5']].map(x => card(...x)).join('\n')}
  </section>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.page { width: 1100px; margin: 0 auto; }
h1 { font-size: 40px; }
.requests { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.request-card p { margin: 0; color: #64748b; }
@media (max-width: 768px) {
  .page { width: 100%; }
  .requests { grid-template-columns: 1fr; }
  h1 { font-size: 28px; }
}`,
      tests: [
        { name: 'Медиазапросы только с min-width, есть запрос от 768px', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'остался медиазапрос с max-width';
          return h.rules.some(r => /min-width:\s*768px/.test(r.media)) || 'нет @media (min-width: 768px)';
        } },
        { name: 'Телефон 360px: одна колонка, поля 16px по бокам, без прокрутки', at: 360, check: h => {
          if (h.overflow()) return 'страница шире экрана';
          const l = h.$$('.request-card').map(c => h.rect(c).left);
          if (Math.max(...l) - Math.min(...l) > 1) return 'на телефоне карточки должны стоять в одну колонку';
          return Math.abs(h.rect('.page').left - 16) <= 1 || `слева ${Math.round(h.rect('.page').left)}px, нужно 16px`;
        } },
        { name: '1024px: две колонки, без прокрутки', check: h => {
          if (h.overflow()) return 'на 1024px страница шире экрана';
          const c = h.$$('.request-card');
          return h.sameRow([c[0], c[1]]) && h.rect(c[2]).top > h.rect(c[0]).bottom || 'на 1024px карточки должны стоять по две в ряд';
        } },
        { name: 'От 1200px — три колонки repeat(3, 1fr)', check: h => h.rules.some(r => /min-width:\s*1200px/.test(r.media) && /repeat\(\s*3/.test(r.style.gridTemplateColumns)) || 'нет @media (min-width: 1200px) с repeat(3, 1fr)' },
        { name: 'Ширина .page через min(100% - 32px, 1100px)', check: h => h.rules.some(r => r.selector === '.page' && !r.media && /min\(/.test(r.style.width)) || 'нужно .page { width: min(100% - 32px, 1100px); }' },
        { name: 'Заголовок h1 через clamp(), на телефоне не меньше 1.75rem', at: 360, check: h => {
          if (!h.rules.some(r => r.selector === 'h1' && /clamp\(/.test(r.style.fontSize))) return 'задайте h1 размер через clamp()';
          return h.px('h1', 'font-size') >= 27.5 || `на 360px h1 ${h.px('h1', 'font-size')}px`;
        } },
        { name: 'Размеры шрифтов без px', check: h => {
          const r = h.rules.find(x => /px/.test(x.style.fontSize));
          return !r || `${r.selector}: font-size ${r.style.fontSize} — переведите в rem`;
        } }
      ]
    },
    {
      id: 'w2402', lesson: 'm9-pr12', module: 'mdk93', mech: 'adaptive', title: 'Шапка и фото без прокрутки на 360px', level: 'Среднее', minutes: 25, points: 150,
      story: 'Одногруппник открыл «ЧистоДом» на своём Android шириной 360px: фото в карточке рвёт страницу, ссылки меню слиплись и в них трудно попасть пальцем, а тень у карточки «залипает» после касания.',
      goal: 'Шапка .header — с переносом (flex-wrap: wrap). Меню .nav — flex с переносом и gap не меньше 8px; у ссылок уберите margin-left, сделайте их зоной нажатия не ниже 44px (display: inline-flex, align-items: center, min-height: 44px). Картинка в карточке — не шире карточки (max-width: 100%) и с сохранением пропорций (height: auto). Тень при наведении на .request-card оставьте только для устройств с мышью: перенесите правило в @media (hover: hover). На 360px не должно быть горизонтальной прокрутки.',
      hints: [
        '.header { …; flex-wrap: wrap; gap: 8px; } и .nav { display: flex; flex-wrap: wrap; gap: 8px; }',
        '.nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: #ffffff; } — margin-left больше не нужен.',
        'img { display: block; max-width: 100%; height: auto; }',
        '@media (hover: hover) { .request-card:hover { box-shadow: … } } — и удалите старое правило :hover вне медиазапроса.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#requests">Мои заявки</a>
    <a href="#new">Новая заявка</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Мои заявки</h1>
  <article class="request-card">
    <img src="${IMG}" alt="Квартира после генеральной уборки" width="800" height="600">
    <h2>Генеральная уборка</h2>
    <p>12.11.2026, 10:00 · ул. Ленина, 5</p>
  </article>
</main>`,
      css: `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: #0f766e; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.nav a { margin-left: 32px; color: #ffffff; font-size: 1.125rem; }
.page { padding: 24px 16px; }
.request-card { padding: 16px; border-radius: 12px; background: #ffffff; }
.request-card:hover { box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }`,
      tests: [
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'Картинка не шире карточки и не растянута по высоте', at: 360, check: h => {
          if (!h.inside('.request-card img', '.request-card')) return 'картинка шире карточки: max-width: 100%';
          return h.rect('.request-card img').height < 400 || 'картинка вытянута по высоте: height: auto';
        } },
        { name: 'Шапка и меню переносятся: flex-wrap: wrap, у меню gap от 8px', check: h => {
          if (h.cs('.header', 'flex-wrap') !== 'wrap') return 'у .header нет flex-wrap: wrap';
          if (h.cs('.nav', 'display') !== 'flex' || h.cs('.nav', 'flex-wrap') !== 'wrap') return '.nav: display: flex; flex-wrap: wrap';
          return h.px('.nav', 'column-gap') >= 8 || 'у .nav gap меньше 8px';
        } },
        { name: 'Ссылки меню без margin-left: 32px', check: h => h.$$('.nav a').every(a => h.px(a, 'margin-left') === 0) || 'уберите margin-left у ссылок' },
        { name: 'Телефон: каждая ссылка меню не ниже 44px', at: 360, check: h => {
          const low = h.$$('.nav a').find(a => h.rect(a).height < 43.5);
          return !low || `«${low.textContent}»: высота ${Math.round(h.rect(low).height)}px`;
        } },
        { name: 'Тень при наведении — только в @media (hover: hover)', check: h => {
          const hov = h.rules.filter(r => /\.request-card:hover/.test(r.selector));
          if (!hov.length) return 'нет правила .request-card:hover';
          return hov.every(r => /hover:\s*hover/.test(r.media)) || 'правило :hover должно быть только внутри @media (hover: hover)';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w25.js ---- */
/* Занятие 25. ЛР13. Вёрстка списка заявок (карточки) и админ-таблицы */
(() => {
  const { rgb } = window.COURSE_KIT;
  const ROOT = `:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #cbd5e1;
  --status-new: #2563eb;
  --status-work: #f59e0b;
  --status-done: #15803d;
  --status-cancel: #dc2626;
  --fs-small: 0.875rem;
  --space-1: 8px;
  --space-2: 16px;
  --radius: 12px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.page { width: min(100% - 32px, 1100px); margin: 0 auto; padding: 24px 0; }`;
  const card = (title, badge, label, date, addr, pay, reason) => `    <article class="request-card">
      <header class="request-card__head">
        <h2 class="request-card__title">${title}</h2>
        <span class="badge badge--${badge}">${label}</span>
      </header>
      <dl class="request-card__info">
        <dt>Дата</dt><dd>${date}</dd>
        <dt>Адрес</dt><dd>${addr}</dd>
        <dt>Оплата</dt><dd>${pay}</dd>
      </dl>${reason ? `
      <p class="request-card__reason"><strong>Причина отмены:</strong> ${reason}</p>` : ''}
    </article>`;
  const row = (n, fio, tel, service, date, badge, label) => `      <tr>
        <td data-label="№">${n}</td>
        <td data-label="Клиент">${fio}<br>${tel}</td>
        <td data-label="Услуга">${service}</td>
        <td data-label="Дата">${date}</td>
        <td data-label="Статус"><span class="badge badge--${badge}">${label}</span></td>
        <td data-label="Действие">
          <form class="status-form" action="#" method="post">
            <input type="hidden" name="id" value="${n}">
            <select name="status" aria-label="Новый статус заявки ${n}">
              <option value="work">В работе</option>
              <option value="done">Выполнена</option>
              <option value="cancel">Отменена</option>
            </select>
            <button class="btn" type="submit">Сохранить</button>
          </form>
        </td>
      </tr>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2501', lesson: 'm9-lr13', module: 'mdk93', mech: 'build', title: 'Карточки заявок и бейджи статусов', level: 'Среднее', minutes: 30, points: 150,
      story: 'Страница «Мои заявки» «ЧистоДома»: разметка карточек одинаковая (потом её повторит PHP в цикле), осталось оформление. Главное — бейджи статусов: по цвету и надписи сразу видно, что с заявкой.',
      goal: 'Напишите CSS. .request-card__head — flex: заголовок слева, бейдж справа (justify-content: space-between, align-items: flex-start, gap var(--space-1)). .request-card__title — margin: 0, размер 1.125rem. .request-card__info — Grid с колонками 80px и 1fr, margin: 0, у dd margin: 0, у dt цвет var(--color-muted). .request-card__reason — полоса слева 3px solid var(--status-cancel), фон #fef2f2, padding var(--space-1). .badge — «таблетка»: border-radius: 999px, padding 2px 10px, размер 0.75rem, жирность 600, white-space: nowrap, белый текст. Модификаторы .badge--new, --work, --done, --cancel берут фон из переменных --status-*. Контраст текста каждого бейджа — не ниже 4,5:1: на жёлтом «В работе» белый текст не читается, сделайте его тёмным #1f2937.',
      hints: [
        '.request-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-1); margin-bottom: var(--space-1); }',
        '.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; color: #ffffff; }',
        '.badge--new { background: var(--status-new); } … .badge--work { background: var(--status-work); color: #1f2937; }',
        '.request-card__info { display: grid; grid-template-columns: 80px 1fr; gap: 4px var(--space-1); margin: 0; font-size: var(--fs-small); }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
${card('Генеральная уборка', 'work', 'В работе', '12.11.2026, 10:00', 'ул. Ленина, 5, кв. 12', 'Банковская карта')}
${card('Химчистка ковров', 'cancel', 'Отменена', '03.11.2026, 14:30', 'пр. Мира, 18', 'Наличные', 'нет свободных мастеров на это время')}
${card('Общий клининг', 'done', 'Выполнена', '20.10.2026, 09:00', 'ул. Ленина, 5, кв. 12', 'Наличные')}
${card('Мойка окон', 'new', 'Новая', '25.11.2026, 11:00', 'ул. Ленина, 5, кв. 12', 'Банковская карта')}
  </section>
</main>`,
      css: `${ROOT}
h1 { margin: 0 0 var(--space-2); }
.requests { display: grid; gap: var(--space-2); }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
/* Ниже — элементы карточки и бейджи */
`,
      tests: [
        { name: 'Шапка карточки — flex: заголовок слева, бейдж справа', check: h => {
          if (h.cs('.request-card__head', 'display') !== 'flex') return 'у .request-card__head нет display: flex';
          if (h.cs('.request-card__head', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          if (h.cs('.request-card__head', 'align-items') !== 'flex-start') return 'нужно align-items: flex-start';
          return h.rect('.request-card__head .badge').left > h.rect('.request-card__title').right || 'бейдж должен стоять справа от заголовка';
        } },
        { name: 'Заголовок без отступов, 1.125rem', check: h => h.px('.request-card__title', 'margin-top') === 0 && h.px('.request-card__title', 'font-size') === 18 || 'margin: 0; font-size: 1.125rem' },
        { name: '.badge — «таблетка»: радиус 999px, nowrap, жирность 600, 0.75rem', check: h => {
          if (h.px('.badge', 'border-top-left-radius') < 999) return 'border-radius: 999px';
          if (h.cs('.badge', 'white-space') !== 'nowrap') return 'white-space: nowrap';
          return +h.cs('.badge', 'font-weight') >= 600 && h.px('.badge', 'font-size') === 12 || 'font-weight: 600; font-size: 0.75rem';
        } },
        { name: 'Фон каждого бейджа — из переменной своего статуса', check: h => {
          for (const [m, c] of [['new', '#2563eb'], ['work', '#f59e0b'], ['done', '#15803d'], ['cancel', '#dc2626']])
            if (h.cs('.badge--' + m, 'background-color') !== rgb(c)) return `.badge--${m}: фон var(--status-${m})`;
          return true;
        } },
        { name: 'Текст каждого бейджа читается: контраст не ниже 4,5:1', check: h => {
          for (const b of h.$$('.badge')) { const c = h.contrast(b); if (c != null && c < 4.5) return `«${b.textContent}»: ${c.toFixed(2)}:1`; }
          return true;
        } },
        { name: 'Строки .request-card__info — Grid 80px + 1fr без отступов, dt серые', check: h => {
          if (h.cs('.request-card__info', 'display') !== 'grid' || h.cs('.request-card__info', 'grid-template-columns').split(' ')[0] !== '80px') return 'нужно display: grid; grid-template-columns: 80px 1fr';
          if (h.px('.request-card__info', 'margin-top') !== 0 || h.px('.request-card__info dd', 'margin-left') !== 0) return 'уберите margin у dl и dd';
          return h.cs('.request-card__info dt', 'color') === rgb('#64748b') || 'dt — var(--color-muted)';
        } },
        { name: 'Причина отмены: полоса слева 3px красная, фон #fef2f2', check: h => {
          const s = '.request-card__reason';
          return h.px(s, 'border-left-width') === 3 && h.cs(s, 'border-left-color') === rgb('#dc2626') && h.cs(s, 'background-color') === rgb('#fef2f2') || 'border-left: 3px solid var(--status-cancel); background: #fef2f2';
        } },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'w2502', lesson: 'm9-lr13', module: 'mdk93', mech: 'adaptive', title: 'Админ-таблица: карточки на телефоне', level: 'Сложное', minutes: 30, points: 200,
      story: 'Администратор «ЧистоДома» видит все заявки в таблице и меняет статус прямо в строке. На мониторе таблица хороша, а на телефоне шесть столбцов не помещаются. Превратим строки в карточки, а подписи столбцов возьмём из data-label.',
      goal: 'HTML: каждому <th> в <thead> добавьте scope="col". CSS для всех экранов: .table-wrap — overflow-x: auto; .admin-table — width: 100%, border-collapse: collapse; th и td — padding var(--space-1), text-align: left, нижняя рамка 1px solid var(--color-border). В @media (max-width: 767px): thead спрятать только визуально (position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%) — не display: none); tr — display: block, margin-bottom var(--space-2), белый фон, радиус var(--radius); td — Grid с колонками 90px и 1fr; td::before — content: attr(data-label), жирный, цвет var(--color-muted). На 360px страница не прокручивается вбок, на 1024px таблица остаётся таблицей.',
      hints: [
        '<th scope="col">Клиент</th> — так экранный диктор прочитает «Клиент: Петрова Анна».',
        '.admin-table { width: 100%; border-collapse: collapse; } .admin-table th, .admin-table td { padding: var(--space-1); text-align: left; border-bottom: 1px solid var(--color-border); }',
        '@media (max-width: 767px) { .admin-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } .admin-table tr { display: block; … } .admin-table td { display: grid; grid-template-columns: 90px 1fr; gap: var(--space-1); } }',
        'Подпись: .admin-table td::before { content: attr(data-label); font-weight: 600; color: var(--color-muted); } — тоже внутри медиазапроса.'
      ],
      html: `<main class="page">
  <h1>Панель администратора</h1>
  <div class="table-wrap">
    <table class="admin-table">
      <caption>Все заявки</caption>
      <thead>
        <tr>
          <th>№</th>
          <th>Клиент</th>
          <th>Услуга</th>
          <th>Дата</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
${row(17, 'Петрова Анна Сергеевна', '+7(912)-345-67-89', 'Общий клининг', '15.11.2026 12:00', 'new', 'Новая')}
${row(14, 'Иванов Пётр Алексеевич', '+7(900)-111-22-33', 'Генеральная уборка', '12.11.2026 10:00', 'work', 'В работе')}
      </tbody>
    </table>
  </div>
</main>`,
      css: `${ROOT}
h1 { margin: 0 0 var(--space-2); }
caption { padding-bottom: var(--space-1); font-weight: 700; text-align: left; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; color: #ffffff; }
.badge--new { background: var(--status-new); }
.badge--work { background: var(--status-work); color: #1f2937; }
.status-form { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.btn { min-height: 40px; padding: 0 var(--space-2); border: 0; border-radius: var(--radius); background: #0f766e; color: #ffffff; font: inherit; }
/* Ниже — .table-wrap, .admin-table и медиазапрос для телефона */
`,
      tests: [
        { name: 'Заголовки столбцов: th scope="col"', check: h => h.$$('thead th').every(th => th.getAttribute('scope') === 'col') || 'у каждого th в thead нужен scope="col"' },
        { name: '.table-wrap прокручивает таблицу внутри себя: overflow-x: auto', check: h => h.cs('.table-wrap', 'overflow-x') === 'auto' || 'нужно .table-wrap { overflow-x: auto; }' },
        { name: '1024px: таблица на всю ширину, border-collapse: collapse, ячейки с рамкой снизу', check: h => {
          if (h.cs('.admin-table', 'border-collapse') !== 'collapse') return 'border-collapse: collapse';
          if (Math.abs(h.rect('.admin-table').width - h.rect('.table-wrap').width) > 1) return 'width: 100%';
          return h.px('.admin-table td', 'border-bottom-width') === 1 && h.px('.admin-table td', 'padding-left') === 8 && h.cs('.admin-table th', 'text-align') === 'left' || 'th, td: padding var(--space-1), text-align: left, border-bottom 1px';
        } },
        { name: '1024px: строки остаются строками таблицы, шапка видна', check: h => h.cs('.admin-table tbody tr', 'display') === 'table-row' && h.rect('.admin-table thead').height > 10 || 'на компьютере таблица должна оставаться таблицей: медиазапрос только до 767px' },
        { name: '360px: строка — карточка (display: block), ячейка — Grid 90px + 1fr', at: 360, check: h => {
          if (h.cs('.admin-table tbody tr', 'display') !== 'block') return 'tr: display: block';
          if (h.cs('.admin-table td', 'display') !== 'grid') return 'td: display: grid';
          return h.cs('.admin-table td', 'grid-template-columns').split(' ')[0] === '90px' || 'grid-template-columns: 90px 1fr';
        } },
        { name: '360px: шапка таблицы спрятана только визуально, не display: none', at: 360, check: h => {
          if (h.cs('.admin-table thead', 'display') === 'none') return 'display: none прячет шапку и от экранного диктора';
          return h.rect('.admin-table thead').width <= 1 || 'шапка таблицы видна на телефоне';
        } },
        { name: '360px: подпись ячейки из data-label через ::before', at: 360, check: h => {
          const c = h.win.getComputedStyle(h.$('.admin-table td'), '::before').getPropertyValue('content');
          return h.has(/attr\(\s*data-label\s*\)/) && c && c !== 'none' && c !== 'normal' || 'нужно td::before { content: attr(data-label); }';
        } },
        { name: '360px: нет горизонтальной прокрутки страницы', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/w26.js ---- */
/* Занятие 26. ЛР14. Bootstrap 5: сетка и компоненты */
(() => {
  const { rgb } = window.COURSE_KIT;
  const varOf = (h, el, name) => h.win.getComputedStyle(typeof el === 'string' ? h.$(el) : el).getPropertyValue(name).trim().toLowerCase();
  // Сайт заданий не подключает внешние файлы, поэтому в шаблоне — упрощённый кусочек bootstrap.min.css
  // с теми же классами и переменными --bs-*, что в настоящем Bootstrap 5.3.
  const BS = `/* ===== Фрагмент bootstrap.min.css 5.3 (упрощён для задания, не меняйте) ===== */
:root { --bs-primary: #0d6efd; --bs-primary-rgb: 13, 110, 253; --bs-body-font-family: system-ui, sans-serif; --bs-body-color: #212529; --bs-body-bg: #ffffff; --bs-border-radius: 0.375rem; --bs-border-color: #dee2e6; }
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--bs-body-font-family); line-height: 1.5; color: var(--bs-body-color); background: var(--bs-body-bg); }
.container { width: 100%; max-width: 960px; margin-inline: auto; padding-inline: 0.75rem; }
.row { --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-inline: calc(-0.5 * var(--bs-gutter-x)); }
.row > * { flex-shrink: 0; width: 100%; max-width: 100%; padding-inline: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y); }
.g-3 { --bs-gutter-x: 1rem; --bs-gutter-y: 1rem; }
.col-12 { flex: 0 0 auto; width: 100%; }
@media (min-width: 768px) { .col-md-6 { flex: 0 0 auto; width: 50%; } }
.navbar { padding-block: 0.5rem; }
.bg-primary { background-color: rgb(var(--bs-primary-rgb)); }
.navbar-brand { color: #ffffff; font-size: 1.25rem; text-decoration: none; }
.card { height: 100%; border: 1px solid var(--bs-border-color); border-radius: var(--bs-border-radius); background: #ffffff; }
.card-body { padding: 1rem; }
.card-title { margin: 0 0 0.5rem; font-size: 1.25rem; }
.badge { display: inline-block; padding: 0.35em 0.65em; border-radius: var(--bs-border-radius); font-size: 0.75em; font-weight: 700; }
.text-bg-warning { background-color: #ffc107; color: #000000; }
.text-bg-success { background-color: #146c43; color: #ffffff; }
.text-bg-primary { background-color: rgb(var(--bs-primary-rgb)); color: #ffffff; }
.btn { --bs-btn-bg: transparent; --bs-btn-border-color: transparent; --bs-btn-hover-bg: transparent; display: inline-block; padding: 0.375rem 0.75rem; border: 1px solid var(--bs-btn-border-color); border-radius: var(--bs-border-radius); background-color: var(--bs-btn-bg); color: #ffffff; font: inherit; }
.btn:hover { background-color: var(--bs-btn-hover-bg); }
.btn-primary { --bs-btn-bg: #0d6efd; --bs-btn-border-color: #0d6efd; --bs-btn-hover-bg: #0b5ed7; }
.mt-3 { margin-top: 1rem; }
/* ===== Конец фрагмента. Ниже — ваш bs-theme.css ===== */
`;
  const card = (title, cls, label, text) => `      <div>
        <article class="card">
          <div class="card-body">
            <h2 class="card-title">${title}</h2>
            <span class="badge ${cls}">${label}</span>
            <p>${text}</p>
          </div>
        </article>
      </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2601', lesson: 'm9-lr14', module: 'mdk93', mech: 'build', title: 'Bootstrap в цветах «ЧистоДома»', level: 'Сложное', minutes: 30, points: 200,
      story: 'Страницу «Мои заявки» перевели на Bootstrap: шапка navbar, карточки card, бейджи text-bg-*. Но пока это стандартный синий Bootstrap, а у «ЧистоДома» фирменный бирюзовый и радиус 12px. Да и карточки стоят столбиком даже на мониторе. Доведём до макета.',
      goal: 'HTML: блоку .requests добавьте классы row g-3, каждой из трёх обёрток карточек — col-12 col-md-6 (на телефоне колонка во всю ширину, от 768px — половина). CSS-фрагмент Bootstrap не меняйте, свои правила пишите ниже (как в bs-theme.css): в :root переопределите --bs-primary: #0f766e, --bs-primary-rgb: 15, 118, 110 и --bs-border-radius: 12px; у .btn-primary — --bs-btn-bg и --bs-btn-border-color #0f766e, --bs-btn-hover-bg #115e59.',
      hints: [
        'Сетка: <div class="requests row g-3"> <div class="col-12 col-md-6"> <article class="card">…</article> </div> … </div> — всё внутри .container.',
        'Тема: :root { --bs-primary: #0f766e; --bs-primary-rgb: 15, 118, 110; --bs-border-radius: 12px; } — ваше правило ниже, поэтому оно перебивает Bootstrap.',
        'Одного --bs-primary мало: у кнопки свои переменные. .btn-primary { --bs-btn-bg: #0f766e; --bs-btn-border-color: #0f766e; --bs-btn-hover-bg: #115e59; }'
      ],
      // Тема Bootstrap по своей природе переопределяет те же селекторы (:root, .btn-primary), что и библиотека, поэтому проверку повторов отключаем
      skipQuality: ['dupes'],
      html: `<nav class="navbar bg-primary" aria-label="Главное меню">
  <div class="container">
    <a class="navbar-brand" href="#requests">ЧистоДом</a>
  </div>
</nav>
<main class="container">
  <h1>Мои заявки</h1>
  <div class="requests">
${card('Генеральная уборка', 'text-bg-warning', 'В работе', '12.11.2026, 10:00 · ул. Ленина, 5')}
${card('Общий клининг', 'text-bg-success', 'Выполнена', '20.10.2026, 09:00 · ул. Ленина, 5')}
${card('Мойка окон', 'text-bg-primary', 'Новая', '25.11.2026, 11:00 · ул. Садовая, 3')}
  </div>
  <a class="btn btn-primary mt-3" href="#new">Новая заявка</a>
</main>`,
      css: BS,
      tests: [
        { name: 'Сетка: .requests — row g-3, у трёх обёрток карточек col-12 col-md-6', check: h => {
          const row = h.$('.container .requests');
          if (!row || !row.classList.contains('row') || !row.classList.contains('g-3')) return 'у .requests нужны классы row g-3';
          const cols = [...row.children];
          return cols.length === 3 && cols.every(c => c.classList.contains('col-12') && c.classList.contains('col-md-6')) || 'у каждой обёртки карточки — col-12 col-md-6';
        } },
        { name: '1024px: карточки по две в ряд', check: h => {
          const c = h.$$('.card');
          return h.sameRow([c[0], c[1]]) && h.rect(c[2]).top > h.rect(c[0]).bottom || 'на 1024px первые две карточки должны стоять рядом, третья — ниже';
        } },
        { name: '360px: карточки в одну колонку, без прокрутки', at: 360, check: h => {
          const c = h.$$('.card');
          if (h.sameRow([c[0], c[1]])) return 'на телефоне карточки должны стоять одна под другой';
          return !h.overflow() || 'страница шире экрана';
        } },
        { name: ':root: --bs-primary #0f766e и --bs-primary-rgb 15, 118, 110', check: h => {
          if (varOf(h, 'html', '--bs-primary') !== '#0f766e') return '--bs-primary должен быть #0f766e';
          return varOf(h, 'html', '--bs-primary-rgb').replace(/\s/g, '') === '15,118,110' || '--bs-primary-rgb: 15, 118, 110';
        } },
        { name: 'Шапка .navbar.bg-primary и бейдж «Новая» стали бирюзовыми', check: h => h.cs('.navbar', 'background-color') === rgb('#0f766e') && h.cs('.text-bg-primary', 'background-color') === rgb('#0f766e') || 'bg-primary берёт цвет из --bs-primary-rgb' },
        { name: 'Кнопка .btn-primary: фон и рамка #0f766e, наведение #115e59', check: h => {
          if (h.cs('.btn-primary', 'background-color') !== rgb('#0f766e')) return 'фон кнопки не бирюзовый: переопределите --bs-btn-bg у .btn-primary';
          if (h.cs('.btn-primary', 'border-top-color') !== rgb('#0f766e')) return 'рамка: --bs-btn-border-color';
          return varOf(h, '.btn-primary', '--bs-btn-hover-bg') === '#115e59' || '--bs-btn-hover-bg: #115e59';
        } },
        { name: 'Скругление карточек и кнопки 12px через --bs-border-radius', check: h => h.px('.card', 'border-top-left-radius') === 12 && h.px('.btn', 'border-top-left-radius') === 12 || '--bs-border-radius: 12px' },
        { name: 'Фрагмент Bootstrap не тронут', check: h => h.css.includes(BS.trim()) || 'верните фрагмент bootstrap.min.css как был: свои правила пишите ниже' }
      ]
    }
  );
})();
/* ---- content/tasks/w27.js ---- */
/* Занятие 27. ЛР15. CSS-анимации: transition, keyframes, prefers-reduced-motion */
(() => {
  const ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.page { width: min(100% - 32px, 960px); margin: 0 auto; padding: var(--space-3) 0; }
.requests { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-2); }
.request-card h2 { margin: 0 0 var(--space-1); font-size: 1.125rem; }
.request-card p { margin: 0; color: var(--color-muted); }`;
  // Длительность '0.2s' или '200ms' → секунды
  const sec = v => /ms$/.test(v.trim()) ? parseFloat(v) / 1000 : parseFloat(v);
  const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean);
  const keyframes = (h, name) => {
    const out = [];
    const walk = rules => { for (const r of rules) { if (r.type === 7 && r.name === name) out.push(r); else if (r.cssRules && r.type !== 7) walk(r.cssRules); } };
    try { walk(h.doc.styleSheets[0].cssRules); } catch (e) { }
    return out[0];
  };
  const frame = (k, keys) => [...k.cssRules].find(f => keys.includes(f.keyText));
  const cards = n => Array.from({ length: n }, (_, i) => `    <article class="request-card">
      <h2>${['Генеральная уборка', 'Химчистка ковров', 'Общий клининг'][i]}</h2>
      <p>${['12.11.2026, 10:00 · ул. Ленина, 5', '03.11.2026, 14:30 · пр. Мира, 18', '20.10.2026, 09:00 · ул. Ленина, 5'][i]}</p>
    </article>`).join('\n');
  window.COURSE_TASKS.push(
    {
      id: 'w2701', lesson: 'm9-lr15', module: 'mdk93', mech: 'fix', title: 'Отклик кнопки и карточки', level: 'Среднее', minutes: 25, points: 150,
      story: 'В ТЗ «ЧистоДома» записано: кнопка откликается на наведение и нажатие, карточка заявки приподнимается под курсором. Анимации уже есть, но с ошибками: кнопка плывёт целую секунду и только в одну сторону, а карточка подпрыгивает через top и дёргается на телефоне.',
      goal: 'Кнопка: перенесите transition из .btn:hover в .btn и замените all на два свойства: background-color и transform, каждое не дольше 0.2s. Добавьте .btn:active { transform: scale(0.97); }. Карточка: уберите position и top из .request-card:hover, поднимайте её через transform: translateY(-4px) и усиливайте тень (box-shadow). У самой .request-card задайте transition для transform и box-shadow: 0.2s ease-out.',
      hints: [
        'transition пишут у исходного состояния — тогда анимация идёт в обе стороны: .btn { …; transition: background-color 0.2s ease, transform 0.15s ease; }',
        '.btn:active { transform: scale(0.97); } — кнопка «вжимается» при нажатии.',
        'Двигаем через transform, а не top: .request-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }',
        '.request-card { …; transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <p><button class="btn" type="button">Новая заявка</button></p>
  <section class="requests" aria-label="Список заявок">
${cards(3)}
  </section>
</main>`,
      css: `${ROOT}
.btn { min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; cursor: pointer; }
.btn:hover { background: var(--color-primary-dark); transition: all 1s; }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
.request-card:hover { position: relative; top: -4px; }`,
      tests: [
        { name: 'transition написан у .btn, а не у .btn:hover', check: h => {
          if (h.rules.some(r => /:hover/.test(r.selector) && /\.btn/.test(r.selector) && /transition/.test(r.style.cssText))) return 'уберите transition из .btn:hover';
          return list(h.cs('.btn', 'transition-property')).some(p => p !== 'all') || 'у .btn нет transition';
        } },
        { name: 'Кнопка: анимируются background-color и transform, каждое не дольше 0.2s, без all', check: h => {
          const p = list(h.cs('.btn', 'transition-property')), d = list(h.cs('.btn', 'transition-duration')).map(sec);
          if (p.includes('all')) return 'transition: all анимирует всё подряд — перечислите свойства';
          if (!p.includes('background-color') || !p.includes('transform')) return `сейчас анимируется: ${p.join(', ')}`;
          return d.every(x => x > 0 && x <= 0.2) || 'длительность каждого перехода — не больше 0.2s';
        } },
        { name: '.btn:active «вжимает» кнопку: transform: scale(0.97)', check: h => h.rules.some(r => /\.btn:active/.test(r.selector) && /scale\(\s*0?\.97\s*\)/.test(r.style.transform)) || 'нет .btn:active { transform: scale(0.97); }' },
        { name: 'Карточка поднимается через transform: translateY(-4px), без top и position', check: h => {
          const r = h.rules.find(x => /\.request-card:hover/.test(x.selector));
          if (!r) return 'нет правила .request-card:hover';
          if (r.style.top || r.style.position || r.style.marginTop) return 'уберите top, position и margin из :hover — они пересчитывают раскладку';
          return /translateY\(\s*-4px\s*\)/.test(r.style.transform) || 'нужно transform: translateY(-4px)';
        } },
        { name: 'При наведении тень карточки усиливается', check: h => h.rules.some(r => /\.request-card:hover/.test(r.selector) && /box-shadow/.test(r.style.cssText)) || 'добавьте box-shadow в .request-card:hover' },
        { name: 'У карточки плавный переход transform и box-shadow: 0.2s ease-out', check: h => {
          const p = list(h.cs('.request-card', 'transition-property')), d = list(h.cs('.request-card', 'transition-duration')).map(sec), f = list(h.cs('.request-card', 'transition-timing-function'));
          if (!p.includes('transform') || !p.includes('box-shadow')) return 'у .request-card нужен transition для transform и box-shadow';
          if (!d.every(x => Math.abs(x - 0.2) < 0.001)) return 'длительность 0.2s';
          return f.every(x => x === 'ease-out') || 'функция плавности ease-out';
        } }
      ]
    },
    {
      id: 'w2702', lesson: 'm9-lr15', module: 'mdk93', mech: 'build', title: 'Лесенка карточек и reduced motion', level: 'Сложное', minutes: 30, points: 200,
      story: 'Пользователь «ЧистоДома» создал заявку и попал на «Мои заявки»: сверху мягко выезжает сообщение «Заявка создана», а карточки появляются по очереди, лесенкой. А если в настройках телефона включено «Уменьшить движение», всё сразу стоит на месте.',
      goal: 'Напишите @keyframes fade-up (from: opacity 0 и transform: translateY(16px); to: opacity 1 и translateY(0)) и @keyframes slide-down (from: opacity 0 и translateY(-12px); to: opacity 1 и translateY(0)). В кадрах меняйте только opacity и transform. .request-card — animation: fade-up 0.4s ease-out both; вторая карточка (.request-card:nth-child(2)) — animation-delay 80ms, третья — 160ms. .alert — animation: slide-down 0.3s ease-out both. В конце — @media (prefers-reduced-motion: reduce), где у .request-card и .alert анимация выключена (animation: none).',
      hints: [
        '@keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }',
        '.request-card { …; animation: fade-up 0.4s ease-out both; } — both: до старта карточка уже прозрачная и не мелькает.',
        'Лесенка: .request-card:nth-child(2) { animation-delay: 80ms; } .request-card:nth-child(3) { animation-delay: 160ms; }',
        '@media (prefers-reduced-motion: reduce) { .request-card, .alert { animation: none; } } — карточки просто видны сразу. !important здесь не нужен.'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <div class="alert" role="status">Заявка создана. Мы позвоним вам в течение часа.</div>
  <section class="requests" aria-label="Список заявок">
${cards(3)}
  </section>
</main>`,
      css: `${ROOT}
.alert { margin-bottom: var(--space-2); padding: 12px var(--space-2); border: 1px solid #bbf7d0; border-radius: var(--radius); background: #f0fdf4; color: #166534; }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
/* Ниже — @keyframes, анимации и prefers-reduced-motion */
`,
      tests: [
        { name: '@keyframes fade-up: из прозрачности и сдвига вниз в обычное состояние', check: h => {
          const k = keyframes(h, 'fade-up');
          if (!k) return 'нет @keyframes fade-up';
          const a = frame(k, ['from', '0%']), b = frame(k, ['to', '100%']);
          if (!a || !b) return 'нужны кадры from и to';
          if (a.style.opacity !== '0' || !/translateY\(\s*16px\s*\)/.test(a.style.transform)) return 'from: opacity: 0; transform: translateY(16px)';
          return b.style.opacity === '1' || 'to: opacity: 1; transform: translateY(0)';
        } },
        { name: 'Карточки: fade-up 0.4s ease-out both', check: h => {
          const s = '.request-card';
          if (h.cs(s, 'animation-name') !== 'fade-up') return 'у .request-card нет animation: fade-up';
          if (Math.abs(sec(h.cs(s, 'animation-duration')) - 0.4) > 0.001) return 'длительность 0.4s';
          return h.cs(s, 'animation-fill-mode') === 'both' && h.cs(s, 'animation-timing-function') === 'ease-out' || 'нужно ease-out и both';
        } },
        { name: 'Лесенка: 0, 80ms и 160ms через nth-child', check: h => {
          const d = h.$$('.request-card').map(c => Math.round(sec(h.cs(c, 'animation-delay')) * 1000));
          if (!h.rules.some(r => /nth-child/.test(r.selector))) return 'задержки задайте через .request-card:nth-child(…)';
          return d.join(',') === '0,80,160' || `задержки сейчас: ${d.join(', ')} мс`;
        } },
        { name: 'Сообщение .alert выезжает сверху: slide-down 0.3s ease-out both', check: h => {
          const k = keyframes(h, 'slide-down');
          if (!k) return 'нет @keyframes slide-down';
          const a = frame(k, ['from', '0%']);
          if (!a || a.style.opacity !== '0' || !/translateY\(\s*-12px\s*\)/.test(a.style.transform)) return 'from: opacity: 0; transform: translateY(-12px)';
          if (h.cs('.alert', 'animation-name') !== 'slide-down') return 'у .alert нет animation: slide-down';
          return Math.abs(sec(h.cs('.alert', 'animation-duration')) - 0.3) < 0.001 && h.cs('.alert', 'animation-fill-mode') === 'both' || 'нужно 0.3s ease-out both';
        } },
        { name: 'В кадрах меняются только opacity и transform', check: h => {
          for (const name of ['fade-up', 'slide-down']) {
            const k = keyframes(h, name); if (!k) return `нет @keyframes ${name}`;
            for (const f of k.cssRules) for (let i = 0; i < f.style.length; i++) if (!['opacity', 'transform'].includes(f.style[i])) return `${name}: свойство ${f.style[i]} — двигайте через transform`;
          }
          return true;
        } },
        { name: '@media (prefers-reduced-motion: reduce) выключает анимацию карточек и сообщения', check: h => {
          const rs = h.rules.filter(r => /prefers-reduced-motion:\s*reduce/.test(r.media));
          if (!rs.length) return 'нет @media (prefers-reduced-motion: reduce)';
          const off = s => rs.some(r => r.selector.split(',').some(x => x.trim() === s) && (r.style.animationName === 'none' || (r.style.animationDuration && sec(r.style.animationDuration) <= 0.0001)));
          if (!off('.request-card')) return 'в медиазапросе выключите анимацию .request-card';
          return off('.alert') || 'в медиазапросе выключите анимацию .alert';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w28.js ---- */
/* Занятие 28. ЛР16. Контрольная: 5 страниц по чужому макету за 90 минут */
(() => {
  const { rgb } = window.COURSE_KIT;
  const varOf = (h, name) => h.win.getComputedStyle(h.doc.documentElement).getPropertyValue(name).trim().toLowerCase();
  window.COURSE_TASKS.push(
    {
      id: 'w2801', lesson: 'm9-lr16', module: 'mdk93', mech: 'build', title: 'Каркас под чужой стайл-гайд: «ТехноПульс»', level: 'Сложное', minutes: 30, points: 200,
      story: 'Контрольная: вариант не ваш, а сервиса ремонта техники «ТехноПульс». Правило №2 — заготовки разрешены: берём свою страницу «Новая заявка» от «ЧистоДома», перекрашиваем через переменные и сверяем поля с ТЗ. В макете забыли тип оплаты, но ТЗ важнее макета.',
      goal: 'В :root замените значения переменных на стайл-гайд «ТехноПульса»: --color-primary #1d4ed8, --color-primary-dark #1e3a8a, --color-accent #f97316, --color-bg #f1f5f9, --color-text #111827, --color-error #b91c1c, --radius 8px. Вне :root цвета пишите только через var(…). Логотип в шапке — «ТехноПульс». В списке «Вид услуги» после пустого пункта — услуги из ТЗ: Ремонт смартфона, Ремонт ноутбука, Ремонт бытовой техники, Иная услуга (value 1–4). Перед кнопкой добавьте тип оплаты: <fieldset class="field"> с <legend class="field__label">Тип оплаты</legend> и двумя радиокнопками name="payment" (value cash и card, «Наличные» и «Банковская карта»), обязательный выбор; каждую радиокнопку оберните в <label class="choice">. На 360px — без прокрутки вбок.',
      hints: [
        'Перекраска — это только :root: --color-primary: #1d4ed8; --color-primary-dark: #1e3a8a; … --radius: 8px; Правила ниже трогать не нужно, если в них var(…).',
        'Логотип: <a class="logo" href="#requests">ТехноПульс</a>. Услуги: <option value="1">Ремонт смартфона</option> … <option value="4">Иная услуга</option>',
        'Оплата: <fieldset class="field"> <legend class="field__label">Тип оплаты</legend> <label class="choice"><input type="radio" name="payment" value="cash" required> Наличные</label> <label class="choice"><input type="radio" name="payment" value="card"> Банковская карта</label> </fieldset>',
        'Для .choice в CSS уже есть правило — оно найдёт вашу разметку. Проверьте страницу на 360px.'
      ],
      html: `<header class="header">
  <a class="logo" href="#requests">ЧистоДом</a>
  <nav class="nav" aria-label="Меню">
    <a href="#requests">Мои заявки</a>
    <a href="#exit">Выход</a>
  </nav>
</header>
<main class="page">
  <h1>Новая заявка</h1>
  <form class="form" action="#" method="post">
    <div class="field">
      <label class="field__label" for="address">Адрес</label>
      <input class="field__input" type="text" id="address" name="address" required>
    </div>
    <div class="field">
      <label class="field__label" for="phone">Телефон</label>
      <input class="field__input" type="tel" id="phone" name="phone" required pattern="\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}" placeholder="+7(900)-123-45-67">
    </div>
    <div class="form__row">
      <div class="field">
        <label class="field__label" for="date">Дата</label>
        <input class="field__input" type="date" id="date" name="date" required>
      </div>
      <div class="field">
        <label class="field__label" for="time">Время</label>
        <input class="field__input" type="time" id="time" name="time" required>
      </div>
    </div>
    <div class="field field--error">
      <label class="field__label" for="service">Вид услуги</label>
      <select class="field__input" id="service" name="service_id" required aria-describedby="service-error">
        <option value="">— Выберите услугу —</option>
        <option value="1">Общий клининг</option>
        <option value="2">Генеральная уборка</option>
        <option value="3">Послестроительная уборка</option>
        <option value="4">Химчистка ковров и мебели</option>
      </select>
      <p class="field__error" id="service-error">Выберите услугу</p>
    </div>
    <div class="field">
      <label class="field__label" for="comment">Описание (для иной услуги)</label>
      <textarea class="field__input" id="comment" name="comment" rows="3"></textarea>
    </div>
    <button class="btn" type="submit">Отправить заявку</button>
  </form>
</main>`,
      css: `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-accent: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-border: #94a3b8;
  --color-error: #dc2626;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-1); padding: var(--space-1) var(--space-2); background: var(--color-primary); }
.logo { color: var(--color-surface); font-weight: 700; text-decoration: none; }
.nav { display: flex; gap: var(--space-2); }
.nav a { display: inline-flex; align-items: center; min-height: 44px; color: var(--color-surface); }
.page { width: min(100% - 32px, 480px); margin: 0 auto; padding: var(--space-3) 0; }
.form { display: flex; flex-direction: column; gap: var(--space-2); }
.form__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.field { display: flex; flex-direction: column; gap: 4px; min-width: 0; margin: 0; padding: 0; border: 0; }
.field__label { padding: 0; font-weight: 600; font-size: 0.875rem; }
.field__input { width: 100%; min-height: 48px; padding: 0 var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 16px; }
textarea.field__input { padding: 12px var(--space-2); resize: vertical; }
.field__input:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 1px; }
.field--error .field__input { border-color: var(--color-error); }
.field__error { margin: 0; font-size: 0.875rem; color: var(--color-error); }
.choice { display: flex; align-items: center; gap: var(--space-1); min-height: 44px; }
.btn { min-height: 48px; border: none; border-radius: var(--radius); background: var(--color-primary); color: var(--color-surface); font: inherit; font-weight: 600; cursor: pointer; }
.btn:hover { background: var(--color-primary-dark); }`,
      tests: [
        { name: 'Цвета «ТехноПульса»: основной #1d4ed8, тёмный #1e3a8a, акцент #f97316', check: h => {
          for (const [n, v] of [['--color-primary', '#1d4ed8'], ['--color-primary-dark', '#1e3a8a'], ['--color-accent', '#f97316']]) if (varOf(h, n) !== v) return `${n}: ${varOf(h, n) || 'нет'}, нужно ${v}`;
          return true;
        } },
        { name: 'Фон #f1f5f9, текст #111827, ошибка #b91c1c, радиус 8px', check: h => {
          for (const [n, v] of [['--color-bg', '#f1f5f9'], ['--color-text', '#111827'], ['--color-error', '#b91c1c'], ['--radius', '8px']]) if (varOf(h, n) !== v) return `${n}: ${varOf(h, n) || 'нет'}, нужно ${v}`;
          return true;
        } },
        { name: 'Страница перекрасилась: шапка и кнопка синие, фон светло-серый, поля скруглены на 8px', check: h => {
          if (h.cs('.header', 'background-color') !== rgb('#1d4ed8') || h.cs('.btn', 'background-color') !== rgb('#1d4ed8')) return 'шапка и кнопка должны быть #1d4ed8';
          if (h.cs('body', 'background-color') !== rgb('#f1f5f9')) return 'фон страницы #f1f5f9';
          if (h.cs('#service', 'border-top-color') !== rgb('#b91c1c')) return 'рамка поля с ошибкой — #b91c1c';
          return h.px('#address', 'border-top-left-radius') === 8 && h.px('.btn', 'border-top-left-radius') === 8 || 'радиус полей и кнопки 8px';
        } },
        { name: 'Вне :root цвета только через var(…)', check: h => {
          const m = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '').match(/#[0-9a-f]{3,8}\b/i);
          return !m || `в правилах есть ${m[0]}: используйте переменную`;
        } },
        { name: 'Логотип — «ТехноПульс»', check: h => h.text('.header .logo') === 'ТехноПульс' || `сейчас логотип: «${h.text('.header .logo')}»` },
        { name: 'Вид услуги по ТЗ: пустой пункт и 4 услуги ремонта', check: h => {
          const o = h.$$('#service option');
          if (o[0]?.value !== '') return 'первый пункт — пустой, value=""';
          const want = ['Ремонт смартфона', 'Ремонт ноутбука', 'Ремонт бытовой техники', 'Иная услуга'];
          const got = o.slice(1).map(x => x.textContent.trim());
          if (got.join('|') !== want.join('|')) return `услуги сейчас: ${got.join(', ')}`;
          return o.slice(1).map(x => x.value).join('') === '1234' || 'value услуг: 1, 2, 3, 4';
        } },
        { name: 'Тип оплаты по ТЗ: 2 radio name="payment" в fieldset с legend, выбор обязателен', check: h => {
          const r = h.$$('input[type="radio"][name="payment"]');
          if (r.length !== 2) return `radio с name="payment": ${r.length}, нужно 2`;
          if (!r.every(x => x.closest('fieldset')?.querySelector('legend'))) return 'оберните кнопки в <fieldset> с <legend>';
          if (r.map(x => x.value).sort().join() !== 'card,cash') return 'value: cash и card';
          if (!r.every(x => x.closest('label.choice'))) return 'каждую радиокнопку оберните в <label class="choice">';
          return !r[0].checkValidity() || 'добавьте required';
        } },
        { name: 'Оплата стоит перед кнопкой отправки', check: h => h.before('input[name="payment"]', '.btn') || 'тип оплаты — перед кнопкой «Отправить заявку»' },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
/* ---- content/tasks/w53.js ---- */
/* Занятие 53. ПР21. JS для форм: DOM, события, условия */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.error { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.hint { margin-top: 4px; color: #555555; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn:disabled { background: #6b7280; cursor: not-allowed; }`;
  window.COURSE_TASKS.push(
    {
      id: 'w5301', lesson: 'm9-pr21', module: 'mdk96', mech: 'build', title: 'Ошибки под полями', level: 'Среднее', minutes: 30, points: 150,
      story: 'Форма регистрации портала заявок уходит на сервер с любыми данными, а пользователь узнаёт об ошибке только после перезагрузки. Сделаем проверку в браузере: ошибка появляется прямо под нужным полем, и форма не отправляется.',
      goal: 'Напишите функции showError(name, message) и clearError(name): первая находит поле [name="…"] и блок #ИМЯ-error, добавляет полю класс is-invalid и aria-invalid="true", пишет текст через textContent; вторая всё это убирает. Обработчик submit формы #register-form: логин (после trim) короче 6 символов — ошибка под логином «Логин — не менее 6 символов»; пароль пустой — «Введите пароль»; password2 не совпадает с password — «Пароли не совпадают» под password2. Верное поле очищается через clearError. Проверяются все три поля сразу, и при любой ошибке вызывается event.preventDefault().',
      hints: [
        'showError: const input = document.querySelector(`[name="${name}"]`); const box = document.getElementById(`${name}-error`); input.classList.add(\'is-invalid\'); input.setAttribute(\'aria-invalid\', \'true\'); box.textContent = message;',
        'clearError делает обратное: classList.remove, removeAttribute(\'aria-invalid\'), box.textContent = \'\'.',
        'В обработчике заведите let ok = true; и три отдельных if/else: if (login.length < 6) { showError(\'login\', \'…\'); ok = false; } else { clearError(\'login\'); }',
        'В конце: if (!ok) event.preventDefault(); Поля удобно читать как form.login.value.trim(), form.password.value, form.password2.value.'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username">
      <div class="error" id="login-error"></div>
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input id="password" name="password" type="password" autocomplete="new-password">
      <div class="error" id="password-error"></div>
    </div>
    <div class="field">
      <label for="password2">Повторите пароль</label>
      <input id="password2" name="password2" type="password" autocomplete="new-password">
      <div class="error" id="password2-error"></div>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// Проверка формы регистрации
const form = document.getElementById('register-form');

// 1. showError(name, message) и clearError(name)

// 2. Обработчик submit: логин, пароль, совпадение паролей
`,
      tests: [
        { name: 'Короткий логин: ошибка под логином, класс is-invalid, aria-invalid, форма не отправлена', js: true, check: h => {
          h.type('#login', 'ivan'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (h.submit('#register-form')) return 'форма отправилась: нужен event.preventDefault()';
          if (h.text('#login-error') !== 'Логин — не менее 6 символов') return `текст под логином: «${h.text('#login-error')}»`;
          const i = h.$('#login');
          return i.classList.contains('is-invalid') && i.getAttribute('aria-invalid') === 'true' || 'у поля логина нет класса is-invalid или aria-invalid="true"';
        } },
        { name: 'Пробелы по краям логина не считаются', js: true, check: h => {
          h.type('#login', '  abc  '); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          return h.submit('#register-form') === false && h.text('#login-error') !== '' || 'логин «  abc  » должен считаться коротким: используйте trim()';
        } },
        { name: 'Пустой пароль и разные пароли — ошибки под своими полями', js: true, check: h => {
          h.type('#login', 'ivanov'); h.type('#password', ''); h.type('#password2', 'qwerty');
          if (h.submit('#register-form')) return 'форма отправилась';
          if (h.text('#password-error') !== 'Введите пароль') return `под паролем: «${h.text('#password-error')}»`;
          if (h.text('#password2-error') !== 'Пароли не совпадают') return `под повтором: «${h.text('#password2-error')}»`;
          return h.text('#login-error') === '' || 'у верного логина не должно быть ошибки';
        } },
        { name: 'Все ошибки видны сразу, а не по одной', js: true, check: h => {
          h.type('#login', 'iv'); h.type('#password', ''); h.type('#password2', 'x');
          h.submit('#register-form');
          return h.$$('.is-invalid').length === 3 || `подсвечено полей: ${h.$$('.is-invalid').length}, нужно 3`;
        } },
        { name: 'Исправили — ошибки исчезли, форма уходит', js: true, check: h => {
          h.type('#login', 'iv'); h.type('#password', ''); h.type('#password2', 'x');
          h.submit('#register-form');
          h.type('#login', 'ivanov'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (!h.submit('#register-form')) return 'верная форма не отправляется';
          if (h.$$('.is-invalid').length) return 'класс is-invalid остался';
          if (h.$$('[aria-invalid]').length) return 'aria-invalid остался: нужен removeAttribute';
          return h.$$('.error').every(e => e.textContent === '') || 'текст ошибки остался';
        } },
        { name: 'Текст ошибки — через textContent, а не innerHTML', check: h => !/innerHTML/.test(h.js) || 'для текста ошибок используйте textContent' }
      ]
    },
    {
      id: 'w5302', lesson: 'm9-pr21', module: 'mdk96', mech: 'build', title: 'Живая форма: счётчик и кнопка', level: 'Среднее', minutes: 25, points: 150,
      story: 'Проверка при отправке уже есть. Теперь форма должна реагировать, пока человек печатает: ошибка исчезает, как только поле начали исправлять, под ФИО растёт счётчик символов, а кнопка «Отправить» неактивна, пока не заполнено всё.',
      goal: 'Повесьте на форму #register-form один обработчик input (делегирование). В нём: стереть ошибку того поля, в которое печатают (event.target.name и готовая clearError); обновить счётчик #fio-counter текстом «Символов: N», где N — длина ФИО после trim; кнопке #send ставить disabled = true, пока хотя бы одно из четырёх полей пустое (после trim). Готовую проверку при отправке не трогайте.',
      hints: [
        'Каркас: form.addEventListener(\'input\', (event) => { … }); — событие всплывает от любого поля до формы.',
        'Ошибка: if (event.target.name) clearError(event.target.name);',
        'Счётчик: counter.textContent = `Символов: ${form.fio.value.trim().length}`;',
        'Кнопка: const names = [\'login\', \'password\', \'password2\', \'fio\']; send.disabled = names.some((n) => form[n].value.trim() === \'\');'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username">
      <div class="error" id="login-error"></div>
    </div>
    <div class="field">
      <label for="password">Пароль</label>
      <input id="password" name="password" type="password" autocomplete="new-password">
      <div class="error" id="password-error"></div>
    </div>
    <div class="field">
      <label for="password2">Повторите пароль</label>
      <input id="password2" name="password2" type="password" autocomplete="new-password">
      <div class="error" id="password2-error"></div>
    </div>
    <div class="field">
      <label for="fio">ФИО</label>
      <input id="fio" name="fio" autocomplete="name">
      <div class="hint" id="fio-counter">Символов: 0</div>
      <div class="error" id="fio-error"></div>
    </div>
    <button class="btn" id="send" type="submit" disabled>Отправить</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// Живая форма
const form = document.getElementById('register-form');
const send = document.getElementById('send');
const counter = document.getElementById('fio-counter');

function showError(name, message) {
  const input = form[name];
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  document.getElementById(name + '-error').textContent = message;
}

function clearError(name) {
  const input = form[name];
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  document.getElementById(name + '-error').textContent = '';
}

// Готовая проверка при отправке — не меняйте
form.addEventListener('submit', (event) => {
  let ok = true;
  if (form.login.value.trim().length < 6) { showError('login', 'Логин — не менее 6 символов'); ok = false; }
  if (form.password.value === '') { showError('password', 'Введите пароль'); ok = false; }
  if (form.password2.value !== form.password.value) { showError('password2', 'Пароли не совпадают'); ok = false; }
  if (form.fio.value.trim() === '') { showError('fio', 'Введите ФИО'); ok = false; }
  if (!ok) event.preventDefault();
});

// Ваш код: один обработчик input на всю форму
`,
      tests: [
        { name: 'Ввод в поле с ошибкой стирает ошибку только этого поля', js: true, check: h => {
          h.$('#login').value = 'iv'; h.$('#password2').value = 'x';
          h.submit('#register-form');
          if (!h.$('#login').classList.contains('is-invalid')) return 'готовая проверка не сработала — не меняли ли вы её?';
          h.type('#login', 'iva');
          if (h.$('#login').classList.contains('is-invalid') || h.text('#login-error')) return 'ошибка логина не стёрлась при вводе';
          return h.$('#password').classList.contains('is-invalid') && h.text('#password-error') !== '' || 'ошибка пароля тоже стёрлась, а в него не печатали';
        } },
        { name: 'Счётчик под ФИО: «Символов: N» без пробелов по краям', js: true, check: h => {
          h.type('#fio', ' Иванов Иван ');
          return h.text('#fio-counter') === 'Символов: 11' || `сейчас: «${h.text('#fio-counter')}», нужно «Символов: 11»`;
        } },
        { name: 'Кнопка активна только когда заполнены все четыре поля', js: true, check: h => {
          const b = h.$('#send');
          h.type('#login', 'ivanov'); h.type('#password', 'secret1'); h.type('#password2', 'secret1');
          if (!b.disabled) return 'кнопка активна, а ФИО пустое';
          h.type('#fio', 'Иванов Иван');
          if (b.disabled) return 'все поля заполнены, а кнопка неактивна';
          h.type('#password', '   ');
          return b.disabled || 'пароль из пробелов считается пустым: кнопка должна стать неактивной';
        } },
        { name: 'Один обработчик input на форме (делегирование)', check: h => /form\.addEventListener\(\s*['"]input['"]/.test(h.js) || 'повесьте form.addEventListener(\'input\', …)' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.type('#fio', 'Пётр'); h.submit('#register-form'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/w54.js ---- */
/* Занятие 54. ЛР33. Клиентская валидация регулярками и маска телефона +7(XXX)-XXX-XX-XX */
(() => {
  const { BASE } = window.COURSE_KIT;
  const FORM_CSS = `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.field input.is-valid { border-color: #146c43; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`;
  const field = (name, label, attrs = '') => `    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}"${attrs}>
      <div class="invalid-feedback" id="${name}-error"></div>
    </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w5401', lesson: 'm9-lr33', module: 'mdk96', mech: 'build', title: 'Регулярки для регистрации', level: 'Сложное', minutes: 30, points: 200,
      story: 'Это прямой кусок задания 3 демоэкзамена: эксперт будет вводить в регистрацию портала заведомо неправильные данные. Форма должна ответить понятным сообщением под каждым полем, а Пётр Алёшин и Анна Петрова-Водкина — спокойно зарегистрироваться.',
      goal: 'Допишите объект rules: для fio — только кириллица (с Ё), слова через один пробел или дефис; для phone — ровно формат +7(XXX)-XXX-XX-XX (с дефисом после скобки); для email — «без пробелов и @, затем @, домен, точка и зона от 2 символов»; для login — не меньше 6 символов. Функция validateField(input) уже готова: пустое поле — «Поле обязательно», не прошло test — rule.msg. Подключите проверку: событие focusout на форме проверяет поле, которое покинули; submit проверяет ВСЕ поля (map, а не every) и при ошибке отменяет отправку. Не забудьте ^ и $.',
      hints: [
        'ФИО: /^[А-ЯЁа-яё]+(?:[ -][А-ЯЁа-яё]+)*$/ — Ё стоит в Unicode отдельно, поэтому её пишут явно.',
        'Телефон: /^\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$/ — плюс и скобки экранируются обратным слешем.',
        'Email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/, логин: (v) => v.length >= 6.',
        'Подключение: form.addEventListener(\'focusout\', (e) => { if (e.target.name) validateField(e.target); }); и в submit: const results = [...form.querySelectorAll(\'input[name]\')].map(validateField); if (results.includes(false)) e.preventDefault();'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
${field('fio', 'ФИО', ' autocomplete="name"')}
${field('phone', 'Телефон', ' type="tel" inputmode="tel" placeholder="+7(XXX)-XXX-XX-XX" autocomplete="tel"')}
${field('email', 'Email', ' type="email" autocomplete="email"')}
${field('login', 'Логин', ' autocomplete="username"')}
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// js/validation.js
const rules = {
  fio:   { test: (v) => true, msg: 'ФИО — только кириллица и пробелы' },
  phone: { test: (v) => true, msg: 'Телефон в формате +7(XXX)-XXX-XX-XX' },
  email: { test: (v) => true, msg: 'Введите корректный email' },
  login: { test: (v) => true, msg: 'Логин — не менее 6 символов' },
};

function validateField(input) {
  const rule = rules[input.name];
  if (!rule) return true;
  const value = input.value.trim();
  const box = document.getElementById(\`\${input.name}-error\`);
  let message = '';
  if (value === '') message = 'Поле обязательно';
  else if (!rule.test(value)) message = rule.msg;

  input.classList.toggle('is-invalid', message !== '');
  input.classList.toggle('is-valid', message === '');
  if (box) box.textContent = message;
  return message === '';
}

const form = document.getElementById('register-form');

// Ваш код: focusout на форме и submit с проверкой всех полей
`,
      tests: [
        { name: 'ФИО: принимает Ё, двойную фамилию; отклоняет латиницу, цифры, два пробела', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.fio) return 'нет rules.fio';
          const good = ['Иванов Иван Иванович', 'Петрова-Водкина Анна', 'Ёлкин Пётр', 'Алёшин'];
          const bad = ['Ivanov Ivan', 'Иванов1', 'Иванов  Иван', 'Иванов Ivan', ' -Иван', 'Иван-'];
          const g = good.find(v => !r.fio.test(v)); if (g) return `не принимает «${g}»`;
          const b = bad.find(v => r.fio.test(v)); return !b || `пропускает «${b}»`;
        } },
        { name: 'Телефон: только +7(XXX)-XXX-XX-XX', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.phone) return 'нет rules.phone';
          if (!r.phone.test('+7(912)-345-67-89')) return 'не принимает +7(912)-345-67-89';
          const bad = ['+7(912)345-67-89', '8(912)-345-67-89', '+7(912)-345-67-8', '+7(912)-345-67-890', 'тел +7(912)-345-67-89', '+7 912-345-67-89'];
          const b = bad.find(v => r.phone.test(v)); return !b || `пропускает «${b}»`;
        } },
        { name: 'Email и логин', js: true, check: h => {
          const r = h.get('rules'); if (!r || !r.email || !r.login) return 'нет rules.email или rules.login';
          if (!r.email.test('user@mail.ru') || !r.email.test('a.b@college.edu')) return 'email не принимает user@mail.ru';
          const b = ['user@mail', 'user mail@x.ru', 'usermail.ru', 'user@@mail.ru', 'user@mail.r'].find(v => r.email.test(v));
          if (b) return `email пропускает «${b}»`;
          if (!r.login.test('ivanov')) return 'логин из 6 символов не принят';
          return !r.login.test('ivano') || 'логин из 5 символов принят';
        } },
        { name: 'Уход с поля (focusout) проверяет это поле', js: true, check: h => {
          h.type('#phone', '+7(912)345-67-89');
          h.$('#phone').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
          if (!h.$('#phone').classList.contains('is-invalid')) return 'после ухода с поля телефон не подсвечен';
          if (h.text('#phone-error') !== 'Телефон в формате +7(XXX)-XXX-XX-XX') return `сообщение: «${h.text('#phone-error')}»`;
          return !h.$('#fio').classList.contains('is-invalid') || 'проверилось и ФИО, а с него не уходили';
        } },
        { name: 'Отправка с ошибками: подсвечены ВСЕ неверные поля, форма не ушла', js: true, check: h => {
          h.type('#fio', 'Ivanov'); h.type('#phone', '89123456789'); h.type('#email', 'user@mail'); h.type('#login', 'ivan');
          if (h.submit('#register-form')) return 'форма отправилась';
          const n = h.$$('.is-invalid').length;
          return n === 4 || `подсвечено ${n} из 4: проверяйте все поля через map, а не every`;
        } },
        { name: 'Верные данные: форма отправляется, поля зелёные', js: true, check: h => {
          h.type('#fio', 'Алёшин Пётр'); h.type('#phone', '+7(912)-345-67-89'); h.type('#email', 'petr@mail.ru'); h.type('#login', 'aleshin');
          if (!h.submit('#register-form')) return 'верная форма не отправляется';
          return h.$$('.is-valid').length === 4 || 'не все поля получили is-valid';
        } }
      ]
    },
    {
      id: 'w5402', lesson: 'm9-lr33', module: 'mdk96', mech: 'build', title: 'Маска телефона', level: 'Среднее', minutes: 25, points: 150,
      story: 'Требовать от человека руками набрать +7(912)-345-67-89 со всеми скобками жестоко. Пусть он вводит только цифры, а скобки и дефисы появляются сами — и Backspace при этом не застревает.',
      goal: 'Напишите функцию formatPhone(value): оставить только цифры (replace(/\\D/g, \'\')), убрать первую 7 или 8, обрезать до 10 цифр; пустой ввод — пустая строка; дальше собрать «+7(» + 3 цифры, «)-» и следующие 3 — только если цифр больше 3, «-» + 2 — если больше 6, «-» + 2 — если больше 8. На каждое событие input поля [name="phone"] записывайте в него formatPhone(его значения). В HTML полю телефона добавьте maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX".',
      hints: [
        'Начало: let digits = value.replace(/\\D/g, \'\'); if (digits.startsWith(\'7\') || digits.startsWith(\'8\')) digits = digits.slice(1); digits = digits.slice(0, 10);',
        'if (digits.length === 0) return \'\'; let result = \'+7(\' + digits.slice(0, 3);',
        'if (digits.length > 3) result += \')-\' + digits.slice(3, 6); — и так же для 6 и 8. Закрывающая скобка появляется только с четвёртой цифрой, поэтому Backspace не застревает.',
        'Подключение: document.querySelectorAll(\'input[name="phone"]\').forEach((input) => { input.addEventListener(\'input\', () => { input.value = formatPhone(input.value); }); });'
      ],
      html: `<main class="reg">
  <h1>Новая заявка</h1>
  <form id="request-form" novalidate>
${field('phone', 'Телефон для связи', ' type="tel" inputmode="tel" autocomplete="tel"')}
    <button class="btn" type="submit">Отправить</button>
  </form>
</main>`,
      css: FORM_CSS,
      js: `// js/phone-mask.js
function formatPhone(value) {
  return value;
}

// Подключите маску к полю name="phone"
`,
      tests: [
        { name: 'formatPhone собирает полный номер из разных вариантов ввода', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          for (const v of ['9123456789', '89123456789', '79123456789', '+7 912 345 67 89', '8 (912) 345-67-89']) {
            const r = f(v); if (r !== '+7(912)-345-67-89') return `formatPhone('${v}') = '${r}'`;
          }
          return true;
        } },
        { name: 'Готовый номер не меняется, лишние цифры отрезаются', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          const a = f('+7(912)-345-67-89'); if (a !== '+7(912)-345-67-89') return `повторный прогон даёт '${a}'`;
          const b = f('891234567890000'); return b === '+7(912)-345-67-89' || `лишние цифры: '${b}'`;
        } },
        { name: 'Частичный ввод: скобка только с 4-й цифры', js: true, check: h => {
          const f = h.get('formatPhone'); if (typeof f !== 'function') return 'нет функции formatPhone';
          const cases = [['', ''], ['abc', ''], ['9', '+7(9'], ['912', '+7(912'], ['9123', '+7(912)-3'], ['912345', '+7(912)-345'], ['9123456', '+7(912)-345-6'], ['912345678', '+7(912)-345-67-8']];
          for (const [v, want] of cases) { const r = f(v); if (r !== want) return `formatPhone('${v}') = '${r}', нужно '${want}'`; }
          return true;
        } },
        { name: 'Маска работает при вводе в поле', js: true, check: h => {
          h.type('#phone', '89123456789');
          return h.$('#phone').value === '+7(912)-345-67-89' || `в поле: ${h.$('#phone').value}`;
        } },
        { name: 'У поля maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX"', check: h => {
          const i = h.$('#phone');
          return i.getAttribute('maxlength') === '17' && i.getAttribute('placeholder') === '+7(XXX)-XXX-XX-XX' || 'добавьте полю maxlength="17" и placeholder="+7(XXX)-XXX-XX-XX"';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w55.js ---- */
/* Занятие 55. ПР22. fetch и JSON: проверка логина без перезагрузки */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5501', lesson: 'm9-pr22', module: 'mdk96', mech: 'build', title: 'Логин свободен?', level: 'Сложное', minutes: 30, points: 200,
      story: 'Пользователь придумал логин, заполнил ещё шесть полей — и только после отправки узнал, что логин занят. Спросим сервер сразу, как человек ушёл с поля. Настоящего check_login.php в песочнице нет, поэтому вверху скрипта стоит заглушка: она отвечает на fetch так же, как ответил бы PHP.',
      goal: 'Напишите async-функцию checkLogin() и повесьте её на событие blur поля логина. Логин берите через trim; если он короче 6 символов — сразу return, запрос не отправляйте. Запрос: await fetch(\'check_login.php?login=\' + encodeURIComponent(login)); если !response.ok — бросьте ошибку (throw new Error(…)); иначе data = await response.json(). Свободен (data.free) — у поля класс is-valid, текст в #login-error пустой; занят — класс is-invalid и в #login-error текст data.message. Любую ошибку ловите в try/catch и выводите в #login-error «Не удалось проверить логин». Заглушку сервера не меняйте.',
      hints: [
        'Каркас: async function checkLogin() { const login = loginInput.value.trim(); if (login.length < 6) return; try { … } catch (err) { … } } и loginInput.addEventListener(\'blur\', checkLogin);',
        'Внутри try: const response = await fetch(\'check_login.php?login=\' + encodeURIComponent(login)); if (!response.ok) throw new Error(\'HTTP \' + response.status);',
        'Дальше: const data = await response.json(); loginInput.classList.toggle(\'is-invalid\', !data.free); loginInput.classList.toggle(\'is-valid\', data.free);',
        'Текст: loginBox.textContent = data.free ? \'\' : data.message; а в catch — loginBox.textContent = \'Не удалось проверить логин\';'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form" novalidate>
    <div class="field">
      <label for="login">Логин</label>
      <input id="login" name="login" autocomplete="username" aria-describedby="login-error">
      <div class="invalid-feedback" id="login-error"></div>
    </div>
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.field input.is-valid { border-color: #146c43; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`,
      js: `// ===== Заглушка сервера: так ответил бы check_login.php. Не меняйте =====
const takenLogins = ['adminka', 'ivanov', 'manager'];
const serverLog = [];          // адреса, на которые ушёл fetch
let serverOnline = true;       // false — «выключили Apache»
window.fetch = async (url) => {
  serverLog.push(url);
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (!serverOnline) throw new TypeError('Failed to fetch');
  const login = decodeURIComponent(String(url).split('login=')[1] || '');
  if (login === 'broken') return { ok: false, status: 500, json: async () => { throw new SyntaxError('Unexpected token <'); } };
  const free = !takenLogins.includes(login);
  const data = { free, message: free ? 'Логин свободен' : 'Логин уже занят' };
  return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(data)) };
};
// ===== Конец заглушки =====

const loginInput = document.querySelector('input[name="login"]');
const loginBox = document.getElementById('login-error');

// Ваш код: async function checkLogin() и обработчик blur
`,
      tests: [
        { name: 'Занятый логин: is-invalid и «Логин уже занят» после ухода с поля', js: true, check: async h => {
          h.type('#login', 'ivanov'); h.$('#login').dispatchEvent(new FocusEvent('blur'));
          await h.wait(150);
          if (!h.$('#login').classList.contains('is-invalid')) return 'занятый логин не подсвечен';
          return h.text('#login-error') === 'Логин уже занят' || `под полем: «${h.text('#login-error')}»`;
        } },
        { name: 'Свободный логин: is-valid, ошибки нет', js: true, check: async h => {
          h.type('#login', 'ivanov'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          h.type('#login', 'petrov2026'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          const i = h.$('#login');
          if (!i.classList.contains('is-valid') || i.classList.contains('is-invalid')) return 'свободный логин должен получить is-valid без is-invalid';
          return h.text('#login-error') === '' || 'текст ошибки остался';
        } },
        { name: 'Короткий логин — запрос не отправляется', js: true, check: async h => {
          h.type('#login', '  abc  '); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(100);
          return h.get('serverLog').length === 0 || 'для логина короче 6 символов fetch вызывать не нужно';
        } },
        { name: 'Логин в адресе закодирован через encodeURIComponent', js: true, check: async h => {
          h.type('#login', 'a&b=1 тест'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(100);
          const u = h.get('serverLog')[0] || '';
          return u === 'check_login.php?login=' + encodeURIComponent('a&b=1 тест') || `адрес запроса: ${u || 'запроса нет'}`;
        } },
        { name: 'Ответ 500 — проверка response.ok и сообщение пользователю', js: true, check: async h => {
          h.type('#login', 'broken'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#login-error') === 'Не удалось проверить логин' || `под полем: «${h.text('#login-error')}»`;
        } },
        { name: 'Сервер выключен — пользователь видит сообщение, а не тишину', js: true, check: async h => {
          h.get('serverOnline = false');
          h.type('#login', 'petrov2026'); h.$('#login').dispatchEvent(new FocusEvent('blur')); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#login-error') === 'Не удалось проверить логин' || 'нужен try/catch с сообщением «Не удалось проверить логин»';
        } },
        { name: 'Используются async/await и проверка response.ok', check: h => /async\s+function\s+checkLogin|checkLogin\s*=\s*async/.test(h.js) && /await\s+fetch/.test(h.js) && /response\.ok|\.ok\b/.test(h.js.split('// ===== Конец заглушки')[1] || '') || 'нужны async function checkLogin, await fetch и проверка response.ok' }
      ]
    },
    {
      id: 'w5502', lesson: 'm9-pr22', module: 'mdk96', mech: 'build', title: 'Который час на сервере', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Первое знакомство с JSON: тестовая страница портала спрашивает hello.php, который отвечает {"time": "…", "name": "Портал"}. Страница не перезагружается — меняется только одна строчка. Сервер в песочнице заменён заглушкой.',
      goal: 'По щелчку на #ask: отправьте await fetch(\'hello.php\'), проверьте response.ok, разберите JSON и запишите в #answer текст «Портал: сейчас 12:34:56» (название и время берите из data.name и data.time). Если сервер ответил ошибкой или недоступен — в #answer «Сервер не отвечает». Также запишите в переменную note строку JSON.stringify({ a: 1, b: \'текст\' }), а в переменную parsed — результат JSON.parse(\'{"x": [1, 2, 3]}\'). Заглушку не меняйте.',
      hints: [
        'Обработчик: ask.addEventListener(\'click\', async () => { try { … } catch (err) { answer.textContent = \'Сервер не отвечает\'; } });',
        'Внутри: const response = await fetch(\'hello.php\'); if (!response.ok) throw new Error(\'HTTP \' + response.status); const data = await response.json();',
        'Вывод: answer.textContent = `${data.name}: сейчас ${data.time}`;',
        'JSON: const note = JSON.stringify({ a: 1, b: \'текст\' }); const parsed = JSON.parse(\'{"x": [1, 2, 3]}\');'
      ],
      html: `<main class="demo">
  <h1>Проверка связи с сервером</h1>
  <button class="btn" id="ask" type="button">Который час?</button>
  <p id="answer">Ответа пока нет.</p>
</main>`,
      css: `${BASE}
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
#answer { font-size: 20px; }`,
      js: `// ===== Заглушка сервера: так ответил бы hello.php. Не меняйте =====
let serverStatus = 200;        // 500 — «сервер сломался»
window.fetch = async (url) => {
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (url !== 'hello.php') return { ok: false, status: 404, json: async () => ({}) };
  const text = JSON.stringify({ time: '12:34:56', name: 'Портал' });
  return { ok: serverStatus === 200, status: serverStatus, json: async () => JSON.parse(text) };
};
// ===== Конец заглушки =====

const ask = document.getElementById('ask');
const answer = document.getElementById('answer');

// 1. JSON туда и обратно: переменные note и parsed

// 2. Кнопка «Который час?»
`,
      tests: [
        { name: 'Щелчок по кнопке выводит «Портал: сейчас 12:34:56»', js: true, check: async h => {
          h.click('#ask'); await h.wait(150);
          return h.text('#answer') === 'Портал: сейчас 12:34:56' || `в #answer: «${h.text('#answer')}»`;
        } },
        { name: 'Ответ 500 — «Сервер не отвечает»', js: true, check: async h => {
          h.get('serverStatus = 500');
          h.click('#ask'); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          return h.text('#answer') === 'Сервер не отвечает' || `в #answer: «${h.text('#answer')}»: проверьте response.ok`;
        } },
        { name: 'note — строка JSON, parsed — объект с массивом x', js: true, check: h => {
          if (h.get('note') !== '{"a":1,"b":"текст"}') return `note = ${JSON.stringify(h.get('note'))}`;
          const p = h.get('parsed');
          return p && Array.isArray(p.x) && p.x.join() === '1,2,3' || 'parsed должен быть объектом { x: [1, 2, 3] }';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: async h => { h.click('#ask'); await h.wait(100); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
/* ---- content/tasks/w56.js ---- */
/* Занятие 56. ЛР34. Интеграция дизайна из модуля 2 в систему: сверка с макетом */
(() => {
  window.COURSE_TASKS.push(
    {
      id: 'w5601', lesson: 'm9-lr34', module: 'mdk96', mech: 'build', title: 'Токены и бейджи статусов', level: 'Среднее', minutes: 30, points: 150,
      story: 'Админ-панель портала работает, но на макет не похожа: цвета вписаны «на глаз» в десяти местах, а в таблице видны технические слова new и in_work. Вынесем цвета из стайл-гайда в CSS-переменные и превратим коды статусов в русские бейджи.',
      goal: 'CSS: в :root объявите токены из стайл-гайда: --color-primary: #1f4fb8; --color-text: #1d1f24; --color-muted: #4b5563; --color-bg: #f6f7fb; --color-success: #146c43; --color-warning: #8a5a00; --color-danger: #b42318. Замените ВСЕ hex-цвета в правилах на var(--…); вне :root можно оставить только белый #ffffff. JS: объект STATUS (new → «Новая», badge-new; in_work → «В работе», badge-work; done → «Выполнена», badge-done; cancelled → «Отменена», badge-cancel) и функция renderBadge(el, status): textContent — русское слово, className — «badge » + класс. Для неизвестного статуса — сам код и класс badge (оператор ??). При загрузке пройдите по всем [data-badge] и отрисуйте их.',
      hints: [
        'В начале CSS: :root { --color-primary: #1f4fb8; --color-text: #1d1f24; … } — значения копируйте точно, как из Figma.',
        'Дальше: body { color: var(--color-text); background: var(--color-bg); } .btn-main { background: var(--color-primary); } .badge-done { background: var(--color-success); } и так везде.',
        'const STATUS = { new: { text: \'Новая\', cls: \'badge-new\' }, in_work: { text: \'В работе\', cls: \'badge-work\' }, … };',
        'function renderBadge(el, status) { const s = STATUS[status] ?? { text: status, cls: \'\' }; el.textContent = s.text; el.className = `badge ${s.cls}`; } и document.querySelectorAll(\'[data-badge]\').forEach((b) => renderBadge(b, b.textContent.trim()));'
      ],
      html: `<header class="top">
  <a class="logo" href="#requests">Чистый дом</a>
</header>
<main class="admin" id="requests">
  <h1>Заявки</h1>
  <table class="table">
    <thead>
      <tr><th>№</th><th>Клиент</th><th>Статус</th></tr>
    </thead>
    <tbody>
      <tr><td>12</td><td>Иванова Анна</td><td><span class="badge" data-badge>new</span></td></tr>
      <tr><td>13</td><td>Петров Пётр</td><td><span class="badge" data-badge>in_work</span></td></tr>
      <tr><td>14</td><td>Сидорова Мария</td><td><span class="badge" data-badge>done</span></td></tr>
      <tr><td>15</td><td>Ёлкин Олег</td><td><span class="badge" data-badge>cancelled</span></td></tr>
    </tbody>
  </table>
  <button class="btn-main" type="button">Обновить список</button>
</main>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #1d1f24; background: #f6f7fb; }
.top { padding: 12px 16px; background: #1f4fb8; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.admin { padding: 16px; }
.table { width: 100%; border-collapse: collapse; background: #ffffff; }
.table th, .table td { padding: 8px; border-bottom: 1px solid #d0d5dd; text-align: left; }
.table th { color: #4b5563; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #4b5563; color: #ffffff; font-size: 14px; }
.badge-new { background: #1f4fb8; }
.badge-work { background: #8a5a00; }
.badge-done { background: #146c43; }
.badge-cancel { background: #4b5563; }
.btn-main { margin-top: 16px; padding: 8px 16px; border: 0; border-radius: 12px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn-main:hover { background: #1d1f24; }`,
      js: `// js/statuses.js
// 1. STATUS: код статуса → русский текст и класс бейджа

// 2. renderBadge(el, status)

// 3. При загрузке отрисовать все [data-badge]
`,
      tests: [
        { name: 'В :root объявлены все семь токенов с точными значениями', check: h => {
          const want = { primary: '#1f4fb8', text: '#1d1f24', muted: '#4b5563', bg: '#f6f7fb', success: '#146c43', warning: '#8a5a00', danger: '#b42318' };
          const cs = h.win.getComputedStyle(h.doc.documentElement);
          for (const [k, v] of Object.entries(want)) {
            const got = cs.getPropertyValue('--color-' + k).trim().toLowerCase();
            if (got !== v) return `--color-${k}: ${got || 'не задан'}, нужно ${v}`;
          }
          return true;
        } },
        { name: 'Вне :root нет hex-цветов, кроме белого', check: h => {
          const rest = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
          const bad = (rest.match(/#[0-9a-f]{3,8}\b/gi) || []).filter(c => !/^#(fff|ffffff)$/i.test(c));
          return !bad.length || `ещё вписаны цвета: ${[...new Set(bad)].join(', ')} — замените на var(--…)`;
        } },
        { name: 'Цвета на странице не изменились после перехода на токены', check: h => {
          if (h.cs('.btn-main', 'background-color') !== 'rgb(31, 79, 184)') return 'у .btn-main должен быть цвет --color-primary';
          if (h.cs('body', 'background-color') !== 'rgb(246, 247, 251)') return 'фон страницы — --color-bg';
          return h.cs('body', 'color') === 'rgb(29, 31, 36)' || 'цвет текста — --color-text';
        } },
        { name: 'После загрузки бейджи на русском, кодов статусов не видно', js: true, check: h => {
          const t = h.$$('[data-badge]').map(b => h.text(b)).join(', ');
          return t === 'Новая, В работе, Выполнена, Отменена' || `сейчас: ${t}`;
        } },
        { name: 'Классы и цвета бейджей как в макете', js: true, check: h => {
          const b = h.$$('[data-badge]');
          const cls = b.map(x => x.className).join(' | ');
          if (cls !== 'badge badge-new | badge badge-work | badge badge-done | badge badge-cancel') return `классы: ${cls}`;
          return h.cs(b[1], 'background-color') === 'rgb(138, 90, 0)' && h.cs(b[2], 'background-color') === 'rgb(20, 108, 67)' || 'цвета бейджей не совпадают с токенами';
        } },
        { name: 'Неизвестный статус не ломает интерфейс', js: true, check: h => {
          const f = h.get('renderBadge'); if (typeof f !== 'function') return 'нет функции renderBadge';
          const el = h.$('[data-badge]'); f(el, 'archived');
          if (h.errors.length) return h.errors[0];
          return h.text(el) === 'archived' && el.className.trim() === 'badge' || `текст «${h.text(el)}», классы «${el.className}»`;
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w57.js ---- */
/* Занятие 57. ЛР35. Анимация интерфейса: карточки, модальные окна, уведомления */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5701', lesson: 'm9-lr35', module: 'mdk96', mech: 'build', title: 'Окно «Подробнее о заявке»', level: 'Сложное', minutes: 30, points: 200,
      story: 'На странице «Мои заявки» портала у карточки есть кнопка «Подробнее». Пусть она открывает окно на <dialog>, которое плавно выезжает и так же плавно уходит — эксперт на экзамене кликнет и сразу увидит анимацию.',
      goal: 'CSS: окну .modal-anim с атрибутом open задайте анимацию появления (@keyframes modal-in) длительностью не больше 0.3s, а окну с классом is-closing — анимацию ухода modal-out (до 0.3s, с forwards). В @keyframes меняйте только transform и opacity. JS: функция openModal(dialog) вызывает showModal(); closeModal(dialog, value) добавляет класс is-closing, ждёт событие animationend, затем убирает класс и вызывает dialog.close(value). Кнопка с data-open="id" открывает окно с этим id (один обработчик click на document и closest). Окно закрывается с анимацией тремя способами: кнопкой «Понятно» (у неё атрибут data-close), клавишей Esc (событие cancel: вызовите e.preventDefault(), иначе браузер закроет окно мгновенно) и щелчком по затемнённому фону (e.target === dialog).',
      hints: [
        'CSS: .modal-anim[open] { animation: modal-in .25s ease-out; } .modal-anim.is-closing { animation: modal-out .2s ease-in forwards; } и два @keyframes: modal-in { from { opacity: 0; transform: translateY(24px) scale(.97); } }, modal-out { to { … то же … } }',
        'Открытие: document.addEventListener(\'click\', (e) => { const opener = e.target.closest(\'[data-open]\'); if (opener) openModal(document.getElementById(opener.dataset.open)); });',
        'closeModal: dialog.classList.add(\'is-closing\'); dialog.addEventListener(\'animationend\', () => { dialog.classList.remove(\'is-closing\'); dialog.close(value); }, { once: true });',
        'Для каждого dialog.modal-anim: cancel → e.preventDefault(); closeModal(dialog, \'cancel\'); click → if (e.target === dialog) closeModal(dialog, \'cancel\'); кнопка: dialog.querySelector(\'[data-close]\').addEventListener(\'click\', () => closeModal(dialog, \'ok\'));'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <article class="request-card">
    <h2>Заявка №15 · Уборка квартиры</h2>
    <p>Статус: в работе. Создана 12.10.2026.</p>
    <button class="btn" type="button" data-open="details-dialog">Подробнее</button>
  </article>
</main>
<dialog id="details-dialog" class="modal-anim" aria-labelledby="details-title">
  <h2 id="details-title">Заявка №15</h2>
  <p>Адрес: улица Студенческая, 5, квартира 12. Мастер приедет с 10:00 до 12:00.</p>
  <button class="btn" type="button" data-close>Понятно</button>
</dialog>`,
      css: `${BASE}
.page { max-width: 560px; }
.request-card { padding: 16px; border: 1px solid #d0d5dd; border-radius: 12px; }
.request-card h2 { margin: 0 0 8px; font-size: 18px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.modal-anim { max-width: min(90vw, 360px); padding: 24px; border: 0; border-radius: 12px; }
.modal-anim::backdrop { background: rgb(0 0 0 / 0.45); }
.modal-anim h2 { margin-top: 0; }
/* Ниже — анимация открытия и закрытия окна */
`,
      js: `// Модальное окно с анимацией
// 1. openModal(dialog) и closeModal(dialog, value)

// 2. Кнопки с data-open открывают своё окно (один обработчик на document)

// 3. Для каждого dialog.modal-anim: Esc (cancel), щелчок по фону, кнопка data-close
`,
      tests: [
        { name: 'Кнопка «Подробнее» открывает окно', js: true, check: h => { h.click('[data-open]'); return h.$('#details-dialog').open || 'окно не открылось: нужен showModal()'; } },
        { name: 'У открытого окна есть анимация не длиннее 0.3s', js: true, check: h => {
          h.click('[data-open]');
          const name = h.cs('#details-dialog', 'animation-name'), dur = parseFloat(h.cs('#details-dialog', 'animation-duration'));
          if (!name || name === 'none') return 'у .modal-anim[open] нет animation';
          return dur > 0 && dur <= 0.3 || `длительность ${dur}s, нужно до 0.3s`;
        } },
        { name: 'В @keyframes меняются только transform и opacity', check: h => {
          const frames = h.css.match(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g) || [];
          if (frames.length < 2) return 'нужны два @keyframes: modal-in и modal-out';
          const bad = frames.join(' ').match(/\b(top|left|right|bottom|width|height|margin[\w-]*)\s*:/);
          return !bad || `в @keyframes анимируется ${bad[1]} — используйте transform`;
        } },
        { name: 'Кнопка «Понятно»: сначала класс is-closing, после animationend окно закрыто', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          h.click('[data-close]');
          if (!d.open) return 'окно закрылось мгновенно, анимация не видна';
          if (!d.classList.contains('is-closing')) return 'нет класса is-closing';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          if (d.open) return 'после animationend окно не закрылось';
          return !d.classList.contains('is-closing') || 'после закрытия уберите класс is-closing';
        } },
        { name: 'Esc закрывает окно с анимацией', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          d.dispatchEvent(new Event('cancel', { cancelable: true }));
          if (!d.classList.contains('is-closing')) return 'по Esc (событие cancel) нет класса is-closing';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          return !d.open || 'по Esc окно не закрылось';
        } },
        { name: 'Щелчок по затемнённому фону закрывает окно, по тексту — нет', js: true, check: h => {
          h.click('[data-open]');
          const d = h.$('#details-dialog');
          h.click('#details-dialog p');
          if (d.classList.contains('is-closing')) return 'окно закрывается от щелчка по тексту внутри';
          h.click(d);
          if (!d.classList.contains('is-closing')) return 'щелчок по фону не запустил закрытие';
          d.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modal-out' }));
          return !d.open || 'щелчок по фону не закрыл окно';
        } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('[data-open]'); h.click('[data-close]'); h.$('#details-dialog').dispatchEvent(new AnimationEvent('animationend')); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'w5702', lesson: 'm9-lr35', module: 'mdk96', mech: 'build', title: 'Уведомление «Заявка создана»', level: 'Среднее', minutes: 25, points: 150,
      story: 'После создания заявки портал должен мягко сказать «Заявка создана» в углу экрана и через пару секунд сам убрать сообщение. Программа экранного чтения тоже должна его произнести.',
      goal: 'CSS: в правиле .toast задайте прозрачность 0 и сдвиг вниз (transform), transition только для opacity и transform, не дольше 0.3s; у .toast.is-shown opacity: 1 и transform: none; .toast--error — красный фон #b42318. Добавьте @media (prefers-reduced-motion: reduce), где у .toast transition-duration почти ноль (0.01ms). JS: функция showToast(text, type = \'success\', ms = 3000) создаёт div с классами toast и toast--ТИП, кладёт текст через textContent, добавляет в #toasts, на следующем кадре (requestAnimationFrame) вешает is-shown, а через ms миллисекунд убирает is-shown и после transitionend удаляет элемент. Кнопка #create показывает «Заявка создана», кнопка #fail — «Не удалось отправить заявку» с типом error.',
      hints: [
        'В готовое правило .toast допишите: opacity: 0; transform: translateY(12px); transition: opacity .25s, transform .25s; ниже — .toast.is-shown { opacity: 1; transform: none; }',
        'В конце CSS: @media (prefers-reduced-motion: reduce) { .toast { transition-duration: 0.01ms; } }',
        'Создание: const toast = document.createElement(\'div\'); toast.className = `toast toast--${type}`; toast.textContent = text; box.append(toast); requestAnimationFrame(() => toast.classList.add(\'is-shown\'));',
        'Исчезновение: setTimeout(() => { toast.classList.remove(\'is-shown\'); toast.addEventListener(\'transitionend\', () => toast.remove(), { once: true }); }, ms);'
      ],
      html: `<main class="page">
  <h1>Новая заявка</h1>
  <p>Нажмите кнопку, чтобы проверить уведомления.</p>
  <button class="btn" id="create" type="button">Создать заявку</button>
  <button class="btn btn-ghost" id="fail" type="button">Сымитировать ошибку</button>
</main>
<div id="toasts" class="toasts" aria-live="polite"></div>`,
      css: `${BASE}
.btn { padding: 10px 18px; border: 2px solid #1f4fb8; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn-ghost { background: #ffffff; color: #1f4fb8; }
.toasts { position: fixed; right: 16px; bottom: 16px; left: 16px; display: grid; gap: 8px; }
.toast { padding: 12px 16px; border-radius: 10px; background: #1d1f24; color: #ffffff; }
.toast--success { background: #146c43; }
/* Ниже — состояние is-shown, цвет ошибки и prefers-reduced-motion */
`,
      js: `// Уведомления
// 1. showToast(text, type = 'success', ms = 3000)

// 2. Кнопки #create и #fail
`,
      tests: [
        { name: 'showToast создаёт в #toasts уведомление с классами toast и toast--тип', js: true, check: h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          show('Проверка', 'error', 3000);
          const t = h.$('#toasts .toast'); if (!t) return 'в #toasts не появился .toast';
          return t.classList.contains('toast--error') && h.text(t) === 'Проверка' || 'нужны класс toast--error и текст «Проверка»';
        } },
        { name: 'Класс is-shown появляется на следующем кадре, а не сразу', js: true, check: async h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          h.win.requestAnimationFrame = cb => setTimeout(cb, 16);
          show('Кадр');
          const t = h.$('#toasts .toast'); if (!t) return 'уведомление не создано';
          if (t.classList.contains('is-shown')) return 'is-shown добавлен сразу: оберните в requestAnimationFrame';
          await h.wait(80);
          return t.classList.contains('is-shown') || 'is-shown так и не появился';
        } },
        { name: 'Через ms класс is-shown снимается, после transitionend элемент удалён', js: true, check: async h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          h.win.requestAnimationFrame = cb => setTimeout(cb, 16);
          show('Пока', 'success', 150);
          await h.wait(80);
          const t = h.$('#toasts .toast');
          if (!t || !t.classList.contains('is-shown')) return 'уведомление не показалось';
          await h.wait(150);
          if (t.classList.contains('is-shown')) return 'через ms класс is-shown не снят';
          if (!t.isConnected) return 'элемент удалён сразу, анимация исчезновения не видна: ждите transitionend';
          t.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'opacity' }));
          return !t.isConnected || 'после transitionend уведомление осталось на странице';
        } },
        { name: 'Текст выводится как текст, не как HTML', js: true, check: h => {
          const show = h.get('showToast'); if (typeof show !== 'function') return 'нет функции showToast';
          show('<b>жирный</b>');
          return !h.$('#toasts b') && h.text('#toasts .toast') === '<b>жирный</b>' || 'используйте textContent, а не innerHTML';
        } },
        { name: 'Кнопки «Создать заявку» и «Сымитировать ошибку» показывают уведомления', js: true, check: h => {
          h.click('#create'); h.click('#fail');
          const t = h.$$('#toasts .toast');
          if (t.length !== 2) return `уведомлений: ${t.length}, нужно 2`;
          if (h.text(t[0]) !== 'Заявка создана') return `первое: «${h.text(t[0])}»`;
          return t[1].classList.contains('toast--error') && h.text(t[1]) === 'Не удалось отправить заявку' || 'второе должно быть toast--error с текстом «Не удалось отправить заявку»';
        } },
        { name: 'Ошибка — красная #b42318', js: true, check: h => {
          h.click('#fail');
          const t = h.$('#toasts .toast'); if (!t) return 'уведомление не появилось';
          return h.cs(t, 'background-color') === 'rgb(180, 35, 24)' || `фон ошибки: ${h.cs(t, 'background-color')}`;
        } },
        { name: 'CSS: скрытое состояние и transition только для opacity и transform', check: h => {
          const r = h.rules.find(x => x.selector === '.toast' && !x.media && /opacity|transform/.test(x.style.transitionProperty));
          if (!r) return 'у .toast нет transition для opacity и transform';
          if (r.style.transitionProperty.split(',').some(p => !/^\s*(opacity|transform)\s*$/.test(p))) return `transition: ${r.style.transitionProperty}`;
          if (r.style.transitionDuration.split(',').some(d => parseFloat(d) > 0.3 && !/ms/.test(d))) return 'длительность больше 0.3s';
          if (r.style.opacity !== '0') return 'у .toast без is-shown должна быть opacity: 0';
          const shown = h.rules.find(x => x.selector === '.toast.is-shown' && !x.media);
          return shown && shown.style.opacity === '1' && shown.style.transform === 'none' || 'у .toast.is-shown нужны opacity: 1 и transform: none';
        } },
        { name: 'Есть @media (prefers-reduced-motion: reduce) для .toast', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media) && /\.toast/.test(r.selector)) || 'добавьте медиазапрос prefers-reduced-motion' }
      ]
    }
  );
})();
/* ---- content/tasks/w58.js ---- */
/* Занятие 58. ПР23. Оптимизация: Lighthouse, изображения, доступность */
(() => {
  const { BASE, IMG, ICON } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5801', lesson: 'm9-pr23', module: 'mdk96', mech: 'a11y', title: 'Чиним страницу-антипример', level: 'Среднее', minutes: 30, points: 150,
      story: 'Перед вами bad-page.html — страница «Новая заявка», которую Lighthouse разносит в пух и прах: поля без подписей, серый текст, кнопка-крестик без имени, ленивый логотип и пропавший фокус. Исправьте всё по списку, не удаляя содержимое.',
      goal: 'Исправьте: 1) у каждого поля (fio, phone, email) есть видимая подпись <label for="…"> (placeholder можно оставить); 2) autocomplete: у ФИО name, у телефона tel, у email email; 3) телефон связан с подсказкой: aria-describedby="phone-error"; 4) у кнопки-крестика aria-label="Закрыть"; 5) у логотипа нет loading="lazy", а у фото есть loading="lazy", width="300" и height="150"; правило img { max-width: 100%; height: auto; }; 6) текст .note — с контрастом не ниже 4,5:1; 7) уберите outline: none и сделайте видимый фокус: :focus-visible с outline не тоньше 2px.',
      hints: [
        'Подпись: <label for="fio">ФИО</label> прямо перед <input id="fio" …>. Так же для phone и email.',
        'Атрибуты поля телефона: <input id="phone" name="phone" type="tel" autocomplete="tel" aria-describedby="phone-error" …>',
        'Картинки: у логотипа удалите loading="lazy" — он нужен сразу. У фото: width="300" height="150" loading="lazy".',
        'CSS: .note { color: #555555; }, правило с outline: none удалите и добавьте :focus-visible { outline: 3px solid #1f4fb8; outline-offset: 2px; }'
      ],
      html: `<header class="top">
  <img class="logo" src="${ICON}" alt="Логотип портала «Чистый дом»" width="40" height="40" loading="lazy">
  <button class="icon-btn" type="button">✕</button>
</header>
<main class="page">
  <h1>Новая заявка</h1>
  <p class="note">Заполните поля, и мастер перезвонит в течение часа.</p>
  <img class="photo" src="${IMG}" alt="Уборка квартиры после ремонта">
  <form class="form">
    <input id="fio" name="fio" placeholder="ФИО">
    <input id="phone" name="phone" type="tel" placeholder="Телефон">
    <div class="hint" id="phone-error">Телефон в формате +7(XXX)-XXX-XX-XX</div>
    <input id="email" name="email" type="email" placeholder="Email">
    <button class="btn" type="submit">Отправить</button>
  </form>
</main>`,
      css: `${BASE}
.top { display: flex; align-items: center; justify-content: space-between; }
.icon-btn { padding: 6px 12px; border: 2px solid #1f4fb8; border-radius: 8px; background: #ffffff; color: #1f4fb8; font: inherit; cursor: pointer; }
.page { max-width: 420px; }
.note { color: #aaaaaa; }
.form { display: grid; gap: 8px; }
.form input { padding: 8px 10px; border: 2px solid #6b7280; border-radius: 8px; font: inherit; }
.hint { color: #555555; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
* { outline: none; }`,
      tests: [
        { name: 'У каждого поля есть <label for>', check: h => {
          const bad = ['fio', 'phone', 'email'].filter(id => !h.$(`label[for="${id}"]`) || !h.text(`label[for="${id}"]`));
          return !bad.length || `нет подписи у: ${bad.join(', ')}`;
        } },
        { name: 'autocomplete: name, tel, email', check: h => {
          const want = { fio: 'name', phone: 'tel', email: 'email' };
          const bad = Object.keys(want).find(id => h.$('#' + id)?.getAttribute('autocomplete') !== want[id]);
          return !bad || `у поля ${bad} нужен autocomplete="${want[bad]}"`;
        } },
        { name: 'Телефон связан с подсказкой через aria-describedby', check: h => h.$('#phone').getAttribute('aria-describedby') === 'phone-error' || 'добавьте aria-describedby="phone-error"' },
        { name: 'У кнопки-крестика aria-label="Закрыть"', check: h => h.$('.icon-btn').getAttribute('aria-label') === 'Закрыть' || 'кнопке ✕ нужен aria-label="Закрыть"' },
        { name: 'Логотип грузится сразу, фото — лениво и с размерами', check: h => {
          if (h.$('.logo').getAttribute('loading') === 'lazy') return 'у логотипа не должно быть loading="lazy"';
          const p = h.$('.photo');
          if (p.getAttribute('loading') !== 'lazy') return 'у фото нужен loading="lazy"';
          return p.getAttribute('width') === '300' && p.getAttribute('height') === '150' || 'у фото нужны width="300" и height="150"';
        } },
        { name: 'Картинки не вылезают за экран и сохраняют пропорции', at: 360, check: h => {
          if (!h.rules.some(r => /(^|,)\s*img\s*(,|$)/.test(r.selector) && r.style.maxWidth === '100%' && r.style.height === 'auto')) return 'нужно правило img { max-width: 100%; height: auto; }';
          return !h.overflow() || 'на 360px появилась горизонтальная прокрутка';
        } },
        { name: 'Контраст текста .note не ниже 4,5:1', check: h => { const c = h.contrast('.note'); return c >= 4.5 || `сейчас ${c.toFixed(2)}:1`; } },
        { name: 'Фокус виден: нет outline: none, есть :focus-visible с outline от 2px', check: h => {
          if (h.rules.some(r => r.style.outlineStyle === 'none' || r.style.outline === 'none' || r.style.outlineWidth === '0px')) return 'уберите outline: none';
          const f = h.rules.find(r => /:focus-visible/.test(r.selector) && parseFloat(r.style.outlineWidth) >= 2 && r.style.outlineStyle && r.style.outlineStyle !== 'none');
          return !!f || 'добавьте :focus-visible { outline: 3px solid …; }';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w59.js ---- */
/* Занятие 59. ЛР36. Модальное окно отмены с причиной и смена статуса через fetch */
(() => {
  const { BASE } = window.COURSE_KIT;
  const row = (id, fio, code, text, cls) => {
    const opts = [['new', 'Новая'], ['in_work', 'В работе'], ['done', 'Выполнена'], ['cancelled', 'Отменена']]
      .map(([v, t]) => `          <option value="${v}"${v === code ? ' selected' : ''}>${t}</option>`).join('\n');
    return `      <tr data-id="${id}">
        <td>${id}</td>
        <td>${fio}</td>
        <td><span class="badge ${cls}" data-badge>${text}</span></td>
        <td>
          <label class="visually-hidden" for="st-${id}">Статус заявки ${id}</label>
          <select id="st-${id}" class="status-select" data-current="${code}">
${opts}
          </select>
        </td>
      </tr>`;
  };
  const TABLE = `<meta name="csrf-token" content="a1b2c3d4">
<main class="admin">
  <h1>Заявки клиентов</h1>
  <table class="table">
    <thead>
      <tr><th>№</th><th>Клиент</th><th>Статус</th><th>Изменить</th></tr>
    </thead>
    <tbody>
${row(12, 'Иванова Анна', 'new', 'Новая', 'badge-new')}
${row(13, 'Петров Пётр', 'in_work', 'В работе', 'badge-work')}
${row(77, 'Сидорова Мария', 'done', 'Выполнена', 'badge-done')}
    </tbody>
  </table>
</main>`;
  const TOASTS = '<div id="toasts" class="toasts" aria-live="polite"></div>';
  const CSS = `${BASE}
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 8px; border-bottom: 1px solid #d0d5dd; text-align: left; }
.status-select { padding: 6px; font: inherit; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #4b5563; color: #ffffff; font-size: 14px; }
.badge-new { background: #1f4fb8; }
.badge-work { background: #8a5a00; }
.badge-done { background: #146c43; }
.toasts { position: fixed; right: 16px; bottom: 16px; left: 16px; display: grid; gap: 8px; }
.toast { padding: 12px 16px; border-radius: 10px; background: #146c43; color: #ffffff; }
.toast--error { background: #b42318; }`;
  const STUB = `// ===== Заглушка сервера: так ответил бы update_status.php. Не меняйте =====
const requestsDb = { 12: { status: 'new', reason: null }, 13: { status: 'in_work', reason: null } }; // заявки 77 в базе нет
const serverLog = [];          // что пришло на сервер
let serverOnline = true;       // false — «выключили Apache»
window.fetch = async (url, options = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (!serverOnline) throw new TypeError('Failed to fetch');
  const headers = options.headers || {};
  serverLog.push({ url, method: options.method || 'GET', headers, body: options.body });
  const reply = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
  if (url !== 'update_status.php') return reply(404, { ok: false, error: 'Нет такого адреса' });
  if (options.method !== 'POST') return reply(405, { ok: false, error: 'Метод не разрешён' });
  if (headers['X-CSRF-Token'] !== 'a1b2c3d4') return reply(403, { ok: false, error: 'Неверный токен, обновите страницу' });
  let data;
  try { data = JSON.parse(options.body); } catch (err) { return reply(400, { ok: false, error: 'Некорректный JSON' }); }
  const allowed = ['new', 'in_work', 'done', 'cancelled'];
  if (!Number.isInteger(data.id) || data.id < 1 || !allowed.includes(data.status)) return reply(400, { ok: false, error: 'Неверная заявка или статус' });
  const reason = String(data.reason || '').trim();
  if (data.status === 'cancelled' && reason === '') return reply(400, { ok: false, error: 'Укажите причину отмены' });
  if (!requestsDb[data.id]) return reply(404, { ok: false, error: 'Заявка не найдена' });
  requestsDb[data.id] = { status: data.status, reason: data.status === 'cancelled' ? reason : null };
  return reply(200, { ok: true, id: data.id, status: data.status });
};
// ===== Конец заглушки =====

// ===== Готовые помощники из ЛР34 и ЛР35 =====
const STATUS = {
  new:       { text: 'Новая',     cls: 'badge-new' },
  in_work:   { text: 'В работе',  cls: 'badge-work' },
  done:      { text: 'Выполнена', cls: 'badge-done' },
  cancelled: { text: 'Отменена',  cls: 'badge-cancel' },
};
function renderBadge(el, status) {
  const s = STATUS[status] ?? { text: status, cls: '' };
  el.textContent = s.text;
  el.className = \`badge \${s.cls}\`;
}
function showToast(text, type = 'success') {
  const toast = document.createElement('div');
  toast.className = \`toast toast--\${type}\`;
  toast.textContent = text;
  document.getElementById('toasts').append(toast);
}
// ===== Конец помощников =====

const csrf = document.querySelector('meta[name="csrf-token"]').content;
`;
  const SAVE = `async function saveStatus(select, status, reason = '') {
  const row = select.closest('tr');
  select.disabled = true;
  try {
    const response = await fetch('update_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      body: JSON.stringify({ id: Number(row.dataset.id), status, reason }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || \`Ошибка \${response.status}\`);

    select.dataset.current = status;
    renderBadge(row.querySelector('[data-badge]'), status);
    showToast('Статус изменён');
  } catch (err) {
    select.value = select.dataset.current;
    showToast(err.message, 'error');
  } finally {
    select.disabled = false;
  }
}
`;
  window.COURSE_TASKS.push(
    {
      id: 'w5901', lesson: 'm9-lr36', module: 'mdk96', mech: 'build', title: 'Статус без перезагрузки', level: 'Сложное', minutes: 30, points: 200,
      story: 'Администратор портала меняет статус заявки — и ждёт перезагрузки страницы. Сделаем как в современных системах: выбрал в списке — статус сразу сохранился через fetch, бейдж обновился, внизу всплыло «Статус изменён». А если сервер отказал — список честно вернулся к старому значению.',
      goal: 'Напишите async-функцию saveStatus(select, status, reason = \'\'): на время запроса select.disabled = true; fetch(\'update_status.php\') методом POST с заголовками Content-Type: application/json и X-CSRF-Token (токен уже в переменной csrf) и телом JSON.stringify({ id: Number(row.dataset.id), status, reason }), где row = select.closest(\'tr\'); ответ — await response.json(); если !response.ok или !data.ok — throw new Error(data.error). Успех: select.dataset.current = status, renderBadge для [data-badge] этой строки, showToast(\'Статус изменён\'). Ошибка (catch): select.value = select.dataset.current и showToast(err.message, \'error\'). В finally снимите disabled. Повесьте ОДИН обработчик change на таблицу (делегирование через closest(\'.status-select\')), который вызывает saveStatus(select, select.value). Заглушку и помощники не меняйте.',
      hints: [
        'Каркас: async function saveStatus(select, status, reason = \'\') { const row = select.closest(\'tr\'); select.disabled = true; try { … } catch (err) { … } finally { select.disabled = false; } }',
        'Запрос: const response = await fetch(\'update_status.php\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\', \'X-CSRF-Token\': csrf }, body: JSON.stringify({ id: Number(row.dataset.id), status, reason }) });',
        'Разбор: const data = await response.json().catch(() => ({})); if (!response.ok || !data.ok) throw new Error(data.error || `Ошибка ${response.status}`);',
        'Делегирование: document.querySelector(\'table\').addEventListener(\'change\', (e) => { const select = e.target.closest(\'.status-select\'); if (select) saveStatus(select, select.value); });'
      ],
      html: `${TABLE}
${TOASTS}`,
      css: CSS,
      js: `${STUB}
// Ваш код: saveStatus и один обработчик change на таблице
`,
      tests: [
        { name: 'Смена на «В работе»: бейдж, data-current, запись в базе, toast', js: true, check: async h => {
          const s = h.$('#st-12');
          h.type(s, 'in_work');
          if (!s.disabled) return 'на время запроса select должен быть disabled';
          await h.wait(150);
          if (s.disabled) return 'после ответа select остался disabled: нужен finally';
          if (h.get('requestsDb')[12].status !== 'in_work') return 'в «базе» статус не изменился';
          const b = h.$('tr[data-id="12"] [data-badge]');
          if (h.text(b) !== 'В работе' || !b.classList.contains('badge-work')) return `бейдж: «${h.text(b)}», ${b.className}`;
          if (s.dataset.current !== 'in_work') return 'data-current не обновлён';
          return h.text('#toasts .toast') === 'Статус изменён' || 'нет уведомления «Статус изменён»';
        } },
        { name: 'Запрос: POST, JSON, X-CSRF-Token, id числом', js: true, check: async h => {
          h.type('#st-13', 'done'); await h.wait(150);
          const r = h.get('serverLog')[0]; if (!r) return 'запрос не отправлен';
          if (r.url !== 'update_status.php' || r.method !== 'POST') return `запрос: ${r.method} ${r.url}`;
          if (r.headers['Content-Type'] !== 'application/json') return 'нет заголовка Content-Type: application/json';
          if (r.headers['X-CSRF-Token'] !== 'a1b2c3d4') return 'нет заголовка X-CSRF-Token с токеном из meta';
          let body; try { body = JSON.parse(r.body); } catch (e) { return 'тело — не JSON: используйте JSON.stringify'; }
          return body.id === 13 && body.status === 'done' || `тело: ${r.body}`;
        } },
        { name: 'Сервер ответил 404: select вернулся, бейдж прежний, toast с ошибкой', js: true, check: async h => {
          h.type('#st-77', 'new'); await h.wait(150);
          if (h.$('#st-77').value !== 'done') return `select показывает «${h.$('#st-77').value}», а в базе done`;
          if (h.text('tr[data-id="77"] [data-badge]') !== 'Выполнена') return 'бейдж изменился, хотя сервер отказал';
          const t = h.$('#toasts .toast');
          return t && t.classList.contains('toast--error') && h.text(t) === 'Заявка не найдена' || 'нужен toast с типом error и текстом ошибки сервера';
        } },
        { name: 'Отмена без причины: сервер вернул 400 — откат и сообщение', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); await h.wait(150);
          if (h.$('#st-12').value !== 'new') return 'select не откатился';
          return h.text('#toasts .toast') === 'Укажите причину отмены' || `уведомление: «${h.text('#toasts .toast')}»`;
        } },
        { name: 'Сервер выключен: откат, toast, без необработанных ошибок', js: true, check: async h => {
          h.get('serverOnline = false');
          h.type('#st-13', 'done'); await h.wait(150);
          if (h.errors.length) return 'ошибка не поймана: ' + h.errors[0];
          if (h.$('#st-13').value !== 'in_work') return 'select не вернулся к in_work';
          return !h.$('#st-13').disabled && !!h.$('#toasts .toast--error') || 'select должен разблокироваться, а toast — показать ошибку';
        } },
        { name: 'Один обработчик на таблицу работает и для новых строк', js: true, check: async h => {
          const tr = h.$('tr[data-id="12"]').cloneNode(true);
          tr.dataset.id = '13';
          tr.querySelector('select').id = 'st-new'; tr.querySelector('label').htmlFor = 'st-new';
          h.$('tbody').append(tr);
          h.type('#st-new', 'done'); await h.wait(150);
          const r = h.get('serverLog')[0];
          return r && JSON.parse(r.body).id === 13 || 'для добавленной строки запрос не ушёл: повесьте change на таблицу';
        } }
      ]
    },
    {
      id: 'w5902', lesson: 'm9-lr36', module: 'mdk96', mech: 'build', title: 'Причина отмены в окне', level: 'Сложное', minutes: 30, points: 200,
      story: 'Отменить заявку без объяснения нельзя: клиент должен знать почему. Когда администратор выбирает «Отменена», открывается окно с полем причины. Пустую причину окно не принимает, а если окно закрыли — список возвращается к прежнему статусу, чтобы интерфейс не расходился с базой.',
      goal: 'saveStatus уже готова. Напишите: 1) обработчик change на таблице: если выбрано cancelled — запомнить select в pendingSelect, очистить поле #cancel-reason, текст #reason-error и класс is-invalid, открыть окно showModal(); любой другой статус — сразу saveStatus(select, select.value). 2) submit формы #cancel-form: preventDefault; причина после trim пустая — полю класс is-invalid, в #reason-error «Укажите причину отмены», окно не закрывать; иначе запомнить select, обнулить pendingSelect, закрыть окно dialog.close() и вызвать saveStatus(select, \'cancelled\', reason). 3) Кнопка [data-cancel-close] закрывает окно. 4) Событие close окна: если pendingSelect ещё не null — вернуть ему value = dataset.current и обнулить.',
      hints: [
        'В change: if (select.value === \'cancelled\') { pendingSelect = select; reasonInput.value = \'\'; reasonError.textContent = \'\'; reasonInput.classList.remove(\'is-invalid\'); dialog.showModal(); reasonInput.focus(); } else { saveStatus(select, select.value); }',
        'Submit: const reason = reasonInput.value.trim(); if (reason === \'\') { reasonInput.classList.add(\'is-invalid\'); reasonError.textContent = \'Укажите причину отмены\'; return; }',
        'Порядок важен: const select = pendingSelect; pendingSelect = null; dialog.close(); saveStatus(select, \'cancelled\', reason); — иначе обработчик close решит, что окно закрыли без подтверждения.',
        'dialog.addEventListener(\'close\', () => { if (pendingSelect) { pendingSelect.value = pendingSelect.dataset.current; pendingSelect = null; } });'
      ],
      html: `${TABLE}
<dialog id="cancel-dialog" class="modal" aria-labelledby="cancel-title">
  <form id="cancel-form" novalidate>
    <h2 id="cancel-title">Отмена заявки</h2>
    <label for="cancel-reason">Причина отмены</label>
    <textarea id="cancel-reason" name="reason" maxlength="255" rows="3" aria-describedby="reason-error"></textarea>
    <div id="reason-error" class="invalid-feedback"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" type="button" data-cancel-close>Не отменять</button>
      <button class="btn" type="submit">Отменить заявку</button>
    </div>
  </form>
</dialog>
${TOASTS}`,
      css: `${CSS}
.modal { max-width: min(90vw, 380px); padding: 24px; border: 0; border-radius: 12px; }
.modal::backdrop { background: rgb(0 0 0 / 0.45); }
.modal h2 { margin-top: 0; }
.modal label { display: block; margin-bottom: 4px; font-weight: 700; }
.modal textarea { box-sizing: border-box; width: 100%; padding: 8px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.modal textarea.is-invalid { border-color: #c62828; }
.invalid-feedback { min-height: 1em; margin: 4px 0 12px; color: #b42318; font-size: 14px; }
.modal-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn { padding: 10px 16px; border: 2px solid #b42318; border-radius: 8px; background: #b42318; color: #ffffff; font: inherit; cursor: pointer; }
.btn-ghost { border-color: #4b5563; background: #ffffff; color: #1d1f24; }`,
      js: `${STUB}${SAVE}
const dialog = document.getElementById('cancel-dialog');
const cancelForm = document.getElementById('cancel-form');
const reasonInput = document.getElementById('cancel-reason');
const reasonError = document.getElementById('reason-error');
let pendingSelect = null;      // какой select ждёт причину

// 1. change на таблице: cancelled — окно, остальное — сразу saveStatus

// 2. submit формы причины

// 3. Кнопка «Не отменять»

// 4. Событие close: вернуть select, если отмену не подтвердили
`,
      tests: [
        { name: 'Выбор «Отменена» открывает окно и ничего не отправляет', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); await h.wait(100);
          if (!h.$('#cancel-dialog').open) return 'окно не открылось';
          return h.get('serverLog').length === 0 || 'запрос ушёл раньше, чем ввели причину';
        } },
        { name: 'Пустая причина: ошибка под полем, окно открыто, запроса нет', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-reason').value = '   ';
          if (h.submit('#cancel-form')) return 'нужен e.preventDefault() в submit';
          await h.wait(100);
          if (!h.$('#cancel-dialog').open) return 'окно закрылось без причины';
          if (h.text('#reason-error') !== 'Укажите причину отмены') return `под полем: «${h.text('#reason-error')}»`;
          if (!h.$('#cancel-reason').classList.contains('is-invalid')) return 'нет класса is-invalid у поля';
          return h.get('serverLog').length === 0 || 'запрос не должен уходить';
        } },
        { name: 'Причина введена: окно закрыто, в базе cancelled с причиной, бейдж «Отменена»', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-reason').value = '  Клиент передумал  ';
          h.submit('#cancel-form'); await h.wait(150);
          if (h.$('#cancel-dialog').open) return 'окно не закрылось';
          const r = h.get('requestsDb')[12];
          if (r.status !== 'cancelled' || r.reason !== 'Клиент передумал') return `в базе: ${JSON.stringify(r)}`;
          if (h.$('#st-12').value !== 'cancelled') return 'select откатился, хотя отмена подтверждена';
          return h.text('tr[data-id="12"] [data-badge]') === 'Отменена' || 'бейдж не обновился';
        } },
        { name: '«Не отменять»: окно закрыто, select вернулся, запроса нет', js: true, check: async h => {
          h.type('#st-13', 'cancelled');
          h.click('[data-cancel-close]'); await h.wait(100);
          if (h.$('#cancel-dialog').open) return 'окно не закрылось';
          // в скрытой проверочной рамке браузер может не прислать событие close — пришлём его сами
          h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          if (h.$('#st-13').value !== 'in_work') return `select показывает «${h.$('#st-13').value}»`;
          return h.get('serverLog').length === 0 || 'запрос не должен уходить';
        } },
        { name: 'Закрытие окна (Esc) тоже возвращает select', js: true, check: async h => {
          h.type('#st-12', 'cancelled');
          h.$('#cancel-dialog').close(); await h.wait(100);
          h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          return h.$('#st-12').value === 'new' || 'после закрытия окна select должен вернуться к data-current';
        } },
        { name: 'При новом открытии старая ошибка и причина стёрты', js: true, check: async h => {
          h.type('#st-12', 'cancelled'); h.$('#cancel-reason').value = ''; h.submit('#cancel-form');
          h.click('[data-cancel-close]'); h.$('#cancel-dialog').dispatchEvent(new Event('close'));
          h.$('#cancel-reason').value = 'старое';
          h.type('#st-13', 'cancelled');
          return h.$('#cancel-reason').value === '' && h.text('#reason-error') === '' && !h.$('#cancel-reason').classList.contains('is-invalid') || 'при открытии очистите поле, текст ошибки и is-invalid';
        } },
        { name: 'Другие статусы сохраняются сразу, без окна', js: true, check: async h => {
          h.type('#st-12', 'done'); await h.wait(150);
          if (h.$('#cancel-dialog').open) return 'окно открылось для статуса «Выполнена»';
          return h.get('requestsDb')[12].status === 'done' || 'статус не сохранился';
        } }
      ]
    }
  );
})();
/* ---- content/tasks/w60.js ---- */
/* Занятие 60. ЛР37. Контрольная: задание 3 КИМ за 60 минут */
(() => {
  const { BASE } = window.COURSE_KIT;
  const field = (name, label, attrs = '') => `    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}"${attrs}>
      <div class="invalid-feedback" id="${name}-error"></div>
    </div>`;
  window.COURSE_TASKS.push(
    {
      id: 'w6001', lesson: 'm9-lr37', module: 'mdk96', mech: 'build', title: 'Контрольная: валидация по памяти', level: 'Сложное', minutes: 25, points: 200,
      story: 'Тренировка «как на экзамене»: перед вами чистая форма регистрации портала и пустой скрипт. За 15–20 минут без подсказок напишите валидацию четырёх полей и маску телефона. Подсказки открывайте, только если застряли дольше 5 минут.',
      goal: 'Без готового кода: форме #register-form поставьте атрибут novalidate из JS. Проверки (значение после trim): login — не меньше 6 символов, сообщение «Логин — не менее 6 символов»; fio — кириллица с Ё, слова через пробел или дефис, «ФИО — только кириллица»; phone — ровно +7(XXX)-XXX-XX-XX, «Формат: +7(XXX)-XXX-XX-XX»; email — «что-то@домен.зона», зона от 2 символов, «Некорректный email». Неверное поле получает класс is-invalid и текст в #ИМЯ-error, верное — класс снимается и текст пустой. Проверка при уходе с поля (focusout на форме) и при отправке — ВСЕХ полей сразу, с preventDefault при ошибке. Маска: при вводе в телефон цифры превращаются в +7(XXX)-XXX-XX-XX (первая 7 или 8 отбрасывается, не больше 10 цифр).',
      hints: [
        'Скелет: const rules = { fio: [/^…$/, \'ФИО — только кириллица\'], … }; function check(input) { const rule = rules[input.name]; if (!rule) return true; const ok = rule[0].test(input.value.trim()); … return ok; }',
        'Внутри check: input.classList.toggle(\'is-invalid\', !ok); const box = document.getElementById(input.name + \'-error\'); if (box) box.textContent = ok ? \'\' : rule[1];',
        'Подключение: form.setAttribute(\'novalidate\', \'\'); form.addEventListener(\'focusout\', (e) => e.target.name && check(e.target)); в submit: const allOk = [...form.elements].map(check).every(Boolean); if (!allOk) e.preventDefault();',
        'Маска: let d = e.target.value.replace(/\\D/g, \'\'); if (/^[78]/.test(d)) d = d.slice(1); d = d.slice(0, 10); дальше собрать \'+7(\' + d.slice(0, 3) + (d.length > 3 ? \')-\' + d.slice(3, 6) : \'\') + …'
      ],
      html: `<main class="reg">
  <h1>Регистрация</h1>
  <form id="register-form">
${field('login', 'Логин', ' autocomplete="username"')}
${field('fio', 'ФИО', ' autocomplete="name"')}
${field('phone', 'Телефон', ' type="tel" inputmode="tel" maxlength="17" placeholder="+7(XXX)-XXX-XX-XX" autocomplete="tel"')}
${field('email', 'Email', ' type="email" autocomplete="email"')}
    <button class="btn" type="submit">Зарегистрироваться</button>
  </form>
</main>`,
      css: `${BASE}
.reg { max-width: 420px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { box-sizing: border-box; width: 100%; padding: 8px 10px; border: 2px solid #c5cad3; border-radius: 8px; font: inherit; }
.field input.is-invalid { border-color: #c62828; }
.invalid-feedback { min-height: 1em; margin-top: 4px; color: #b42318; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }`,
      js: `// js/validation.js — контрольная, пишем по памяти
`,
      tests: [
        { name: 'Форма получила novalidate из JS', js: true, check: h => h.$('#register-form').hasAttribute('novalidate') || 'поставьте форме атрибут novalidate' },
        { name: 'Неверные данные: все четыре ошибки под полями, форма не ушла', js: true, check: h => {
          h.$('#login').value = 'ivan'; h.$('#fio').value = 'Ivanov Ivan'; h.$('#phone').value = '+7(912)345-67-89'; h.$('#email').value = 'user@mail';
          if (h.submit('#register-form')) return 'форма отправилась';
          const want = { login: 'Логин — не менее 6 символов', fio: 'ФИО — только кириллица', phone: 'Формат: +7(XXX)-XXX-XX-XX', email: 'Некорректный email' };
          for (const [k, v] of Object.entries(want)) {
            if (!h.$('#' + k).classList.contains('is-invalid')) return `поле ${k} не подсвечено`;
            if (h.text(`#${k}-error`) !== v) return `под ${k}: «${h.text(`#${k}-error`)}»`;
          }
          return true;
        } },
        { name: 'Ловушки: Ё, двойная фамилия, логин с пробелами, телефон без дефиса', js: true, check: h => {
          h.$('#login').value = ' aleshin '; h.$('#fio').value = 'Алёшина-Петрова Ёлка'; h.$('#phone').value = '+7(912)-345-67-89'; h.$('#email').value = 'a@b.ru';
          if (!h.submit('#register-form')) return `верные данные не прошли: ${h.$$('.is-invalid').map(e => e.name).join(', ')}`;
          h.$('#login').value = '  ivan  ';
          h.submit('#register-form');
          if (!h.$('#login').classList.contains('is-invalid')) return 'логин «  ivan  » после trim короче 6';
          h.$('#login').value = 'aleshin'; h.$('#fio').value = 'Иванов  Иван';
          h.submit('#register-form');
          return h.$('#fio').classList.contains('is-invalid') || 'ФИО с двумя пробелами подряд пропущено';
        } },
        { name: 'Исправленное поле очищается', js: true, check: h => {
          h.$('#email').value = 'user@mail'; h.submit('#register-form');
          h.$('#email').value = 'user@mail.ru'; h.submit('#register-form');
          return !h.$('#email').classList.contains('is-invalid') && h.text('#email-error') === '' || 'после исправления email ошибка осталась';
        } },
        { name: 'Уход с поля проверяет только это поле', js: true, check: h => {
          h.$('#email').value = 'mail.ru';
          h.$('#email').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
          if (!h.$('#email').classList.contains('is-invalid')) return 'focusout не проверил email';
          return !h.$('#login').classList.contains('is-invalid') || 'проверилось и пустое поле логина, а с него не уходили';
        } },
        { name: 'Маска телефона', js: true, check: h => {
          h.type('#phone', '8 912 345 67 89');
          if (h.$('#phone').value !== '+7(912)-345-67-89') return `в поле: ${h.$('#phone').value}`;
          h.type('#phone', '9123');
          if (h.$('#phone').value !== '+7(912)-3') return `при вводе 9123: ${h.$('#phone').value}`;
          h.type('#phone', '');
          return h.$('#phone').value === '' || 'пустое поле должно остаться пустым';
        } }
      ]
    },
    {
      id: 'w6002', lesson: 'm9-lr37', module: 'mdk96', mech: 'build', title: 'Контрольная: анимация за 7 минут', level: 'Среднее', minutes: 15, points: 150,
      story: 'Последний пункт контрольной — анимация, которую эксперт увидит за 10 секунд: карточка заявки приподнимается при наведении, а сообщение «Заявка создана» мягко выезжает сверху. И, конечно, уважение к тем, кто отключил движение в системе.',
      goal: 'Только CSS. .card: transition для transform и box-shadow не дольше 0.3s; .card:hover: transform: translateY(-3px) и тень box-shadow. .alert: animation slide-in длительностью до 0.3s; @keyframes slide-in меняет только opacity и transform (from { opacity: 0; transform: translateY(-8px); }). В конце — @media (prefers-reduced-motion: reduce), где у .card transition-duration и у .alert animation-duration почти ноль (0.01ms). !important не используйте: правило внутри медиазапроса стоит ниже, поэтому и так победит.',
      hints: [
        '.card { … transition: transform .2s ease-out, box-shadow .2s ease-out; } — допишите в готовое правило.',
        '.card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgb(0 0 0 / 0.1); }',
        '.alert { … animation: slide-in .3s ease-out; } и @keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } }',
        '@media (prefers-reduced-motion: reduce) { .card { transition-duration: 0.01ms; } .alert { animation-duration: 0.01ms; } }'
      ],
      html: `<main class="list">
  <h1>Мои заявки</h1>
  <p class="alert">Заявка создана</p>
  <article class="card">
    <h2>Уборка квартиры</h2>
    <p>Статус: новая.</p>
  </article>
  <article class="card">
    <h2>Мытьё окон</h2>
    <p>Статус: в работе.</p>
  </article>
</main>`,
      css: `${BASE}
.list { max-width: 520px; }
.alert { padding: 12px 16px; border-radius: 10px; background: #e7f4ec; color: #14532d; }
.card { margin-bottom: 12px; padding: 16px; border: 1px solid #d0d5dd; border-radius: 12px; background: #ffffff; }
.card h2 { margin: 0 0 8px; font-size: 18px; }
.card p { margin: 0; }`,
      tests: [
        { name: '.card: transition для transform и box-shadow до 0.3s', check: h => {
          const p = h.cs('.card', 'transition-property'), d = h.cs('.card', 'transition-duration');
          if (!/transform/.test(p) || !/box-shadow/.test(p)) return `transition-property: ${p}`;
          return d.split(',').every(x => parseFloat(x) > 0 && parseFloat(x) <= 0.3) || `длительность: ${d}`;
        } },
        { name: '.card:hover приподнимает карточку и добавляет тень', check: h => {
          const r = h.rules.find(x => /\.card:hover/.test(x.selector) && !x.media);
          if (!r) return 'нет правила .card:hover';
          if (!/translateY\(\s*-/.test(r.style.transform)) return 'нужен transform: translateY(-3px)';
          return !!r.style.boxShadow && r.style.boxShadow !== 'none' || 'добавьте box-shadow';
        } },
        { name: '.alert выезжает анимацией slide-in до 0.3s', check: h => {
          if (h.cs('.alert', 'animation-name') !== 'slide-in') return `animation-name: ${h.cs('.alert', 'animation-name')}`;
          const d = parseFloat(h.cs('.alert', 'animation-duration'));
          return d > 0 && d <= 0.3 || `длительность ${d}s`;
        } },
        { name: '@keyframes slide-in меняет только opacity и transform', check: h => {
          const m = h.css.match(/@keyframes\s+slide-in\s*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}/);
          if (!m) return 'нет @keyframes slide-in';
          const props = (m[1].match(/[\w-]+(?=\s*:)/g) || []);
          if (!props.length) return '@keyframes пустой';
          const bad = props.find(p => !/^(opacity|transform)$/.test(p));
          return !bad || `в @keyframes анимируется ${bad}`;
        } },
        { name: 'prefers-reduced-motion: у .card и .alert почти нулевая длительность', check: h => {
          const inMedia = h.rules.filter(r => /prefers-reduced-motion:\s*reduce/.test(r.media));
          const card = inMedia.find(r => /\.card\b/.test(r.selector) && parseFloat(r.style.transitionDuration) <= 0.01 && r.style.transitionDuration !== '');
          const alert = inMedia.find(r => /\.alert\b/.test(r.selector) && parseFloat(r.style.animationDuration) <= 0.01 && r.style.animationDuration !== '');
          if (!card) return 'в медиазапросе нет .card с transition-duration: 0.01ms';
          return !!alert || 'в медиазапросе нет .alert с animation-duration: 0.01ms';
        } }
      ]
    }
  );
})();
(window.TASKS = window.TASKS || []).push(...window.COURSE_TASKS);
