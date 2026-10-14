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
