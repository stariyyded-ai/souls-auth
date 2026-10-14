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
