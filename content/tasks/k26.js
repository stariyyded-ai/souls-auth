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
