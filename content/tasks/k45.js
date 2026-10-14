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
