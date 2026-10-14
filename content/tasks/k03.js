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
