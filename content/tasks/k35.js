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
