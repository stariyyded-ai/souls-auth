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
