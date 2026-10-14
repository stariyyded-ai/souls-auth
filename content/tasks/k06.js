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
