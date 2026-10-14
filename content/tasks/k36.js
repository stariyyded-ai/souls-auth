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
