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
