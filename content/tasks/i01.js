/* Информатика, занятие 1. Цвет в цифре: системы счисления и кодирование цвета */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const plain = h => h.css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Строка таблицы задания i0102: числа из ячеек R, G, B
  const row = (h, cls) => h.$$(`tr.${cls} td`).slice(1, 4).map(td => td.textContent.trim());

  window.COURSE_TASKS.push(
    {
      id: 'i0101', lesson: 'inf-01', module: 'inf1', mech: 'build',
      title: 'Фирменные цвета кафе', level: 'Лёгкое', minutes: 10, points: 100,
      story: 'Дизайнер прислал цвета кафе «Сибирский чай» в десятичной записи RGB. В проекте договорились писать цвета только HEX-кодами: так их проще искать и сравнивать с макетом.',
      goal: 'Перепишите три цвета в CSS из rgb() в HEX-код: фон шапки .top — rgb(30, 58, 95), фон кнопки .btn — rgb(200, 75, 49), цвет цены .price — rgb(46, 125, 50). Каждый канал переведите в шестнадцатеричную систему: две цифры на канал. В CSS не должно остаться записи rgb().',
      hints: [
        'HEX-код — это решётка и три пары цифр подряд: сначала красный канал, потом зелёный, потом синий.',
        'Чтобы перевести число в 16-ричную систему, разделите его на 16: целая часть — первая цифра, остаток — вторая. 10–15 записываются буквами A–F.',
        '30 = 1·16 + 14 → 1E; 58 = 3·16 + 10 → 3A; 95 = 5·16 + 15 → 5F. Шапка: #1e3a5f.',
        'Кнопка: 200 → C8, 75 → 4B, 49 → 31. Цена: 46 → 2E, 125 → 7D, 50 → 32.'
      ],
      html: `<header class="top">
  <h1>Кафе «Сибирский чай»</h1>
</header>
<p>Свежая выпечка и чай из трав каждый день.</p>
<p class="price">Капучино — 180 ₽</p>
<button class="btn" type="button">Забронировать стол</button>`,
      css: `${BASE}
/* Цвета от дизайнера. Перепишите их HEX-кодами */
.top { background: rgb(30, 58, 95); color: #ffffff; padding: 16px; }
.btn { background: rgb(200, 75, 49); color: #ffffff; border: none; padding: 12px 20px; font-size: 16px; }
.price { color: rgb(46, 125, 50); font-weight: bold; }`,
      tests: [
        { name: 'Фон шапки .top — rgb(30, 58, 95)', check: h => h.cs('.top', 'background-color') === rgb('#1e3a5f') || `сейчас ${h.cs('.top', 'background-color')}` },
        { name: 'Фон кнопки .btn — rgb(200, 75, 49)', check: h => h.cs('.btn', 'background-color') === rgb('#c84b31') || `сейчас ${h.cs('.btn', 'background-color')}` },
        { name: 'Цвет цены .price — rgb(46, 125, 50)', check: h => h.cs('.price', 'color') === rgb('#2e7d32') || `сейчас ${h.cs('.price', 'color')}` },
        { name: 'В CSS не осталось записи rgb()', check: h => !/rgba?\(/i.test(plain(h)) || 'цвета ещё записаны через rgb()' },
        { name: 'Три цвета записаны шестизначными HEX-кодами', check: h => ['#1e3a5f', '#c84b31', '#2e7d32'].every(c => plain(h).toLowerCase().includes(c)) || 'не все три кода найдены в CSS' }
      ]
    },
    {
      id: 'i0102', lesson: 'inf-01', module: 'inf1', mech: 'build',
      title: 'Расшифруйте палитру библиотеки', level: 'Лёгкое', minutes: 10, points: 100,
      story: 'Разработчик сайта городской библиотеки уволился, а в стилях остались только HEX-коды. Новому дизайнеру нужны те же цвета в десятичной записи R, G, B, чтобы перенести их в графический редактор.',
      goal: 'Заполните таблицу: вместо знаков вопроса впишите десятичные значения каналов R, G и B для каждого HEX-кода. В каждой ячейке — только число от 0 до 255. Структуру таблицы не меняйте.',
      hints: [
        'Разбейте код на три пары цифр: #1e90ff → 1E, 90, FF. Первая пара — красный, вторая — зелёный, третья — синий.',
        'Двузначное 16-ричное число переводится так: первая цифра · 16 + вторая цифра. A = 10, B = 11, … F = 15.',
        '1E = 1·16 + 14 = 30; 90 = 9·16 + 0 = 144; FF = 15·16 + 15 = 255.',
        'Ответы: 30, 144, 255; 255, 215, 0; 139, 69, 19.'
      ],
      html: `<h1>Палитра сайта библиотеки</h1>
<table>
  <tr><th scope="col">HEX</th><th scope="col">R</th><th scope="col">G</th><th scope="col">B</th></tr>
  <tr class="c1"><td><span class="sw sw1"></span> #1e90ff</td><td>?</td><td>?</td><td>?</td></tr>
  <tr class="c2"><td><span class="sw sw2"></span> #ffd700</td><td>?</td><td>?</td><td>?</td></tr>
  <tr class="c3"><td><span class="sw sw3"></span> #8b4513</td><td>?</td><td>?</td><td>?</td></tr>
</table>`,
      css: `${BASE}
table { border-collapse: collapse; }
th, td { border: 1px solid #999999; padding: 8px 12px; text-align: center; }
.sw { display: inline-block; width: 16px; height: 16px; vertical-align: middle; }
.sw1 { background: #1e90ff; }
.sw2 { background: #ffd700; }
.sw3 { background: #8b4513; }`,
      tests: [
        { name: 'Таблица на месте: 3 строки по 4 ячейки', check: h => ['c1', 'c2', 'c3'].every(c => h.$$(`tr.${c} td`).length === 4) || 'структура таблицы изменена' },
        { name: '#1e90ff → 30, 144, 255', check: h => row(h, 'c1').join(',') === '30,144,255' || `сейчас: ${row(h, 'c1').join(', ')}` },
        { name: '#ffd700 → 255, 215, 0', check: h => row(h, 'c2').join(',') === '255,215,0' || `сейчас: ${row(h, 'c2').join(', ')}` },
        { name: '#8b4513 → 139, 69, 19', check: h => row(h, 'c3').join(',') === '139,69,19' || `сейчас: ${row(h, 'c3').join(', ')}` }
      ]
    },
    {
      id: 'i0103', lesson: 'inf-01', module: 'inf1', mech: 'build',
      title: 'Свой конвертер цвета', level: 'Сложное', minutes: 20, points: 200,
      story: 'Переводить цвета вручную долго, а ошибиться в одной цифре легко. Напишите маленький инструмент для команды: вводишь HEX-код, получаешь RGB.',
      goal: 'Допишите функцию hexToRgb(hex). Она получает строку вида «#c84b31» (буквы могут быть заглавными) и возвращает массив из трёх десятичных чисел [R, G, B], например [200, 75, 49]. Обработчик кнопки уже написан: он вызовет вашу функцию и покажет результат на странице.',
      hints: [
        'Сначала отрежьте решётку и разбейте строку на три пары символов: hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7).',
        'Пару символов в число переводит parseInt(строка, 16): второй аргумент — основание системы счисления.',
        'parseInt сам понимает и строчные, и заглавные буквы: parseInt("FF", 16) и parseInt("ff", 16) дают 255.',
        'return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];'
      ],
      html: `<h1>Конвертер HEX → RGB</h1>
<label for="hex">HEX-код</label>
<input id="hex" type="text" value="#c84b31">
<button id="go" type="button">Перевести</button>
<p>Результат: <output id="out">—</output></p>`,
      css: `${BASE}
input { padding: 8px; font-size: 16px; }
button { padding: 8px 16px; font-size: 16px; }
output { font-weight: bold; }`,
      js: `// Переводит HEX-код цвета в массив [R, G, B] десятичных чисел
function hexToRgb(hex) {
  // ваш код
}

document.querySelector('#go').addEventListener('click', () => {
  const [r, g, b] = hexToRgb(document.querySelector('#hex').value.trim());
  document.querySelector('#out').textContent = \`rgb(\${r}, \${g}, \${b})\`;
});`,
      tests: [
        { name: 'hexToRgb("#c84b31") возвращает [200, 75, 49]', js: true, check: async h => { const f = h.get('hexToRgb'); if (typeof f !== 'function') return 'функции hexToRgb нет'; const r = f('#c84b31'); return JSON.stringify(r) === '[200,75,49]' || `вернула ${JSON.stringify(r)}`; } },
        { name: 'Работает с заглавными буквами: "#FFD700" → [255, 215, 0]', js: true, check: async h => { const f = h.get('hexToRgb'); if (typeof f !== 'function') return 'функции hexToRgb нет'; const r = f('#FFD700'); return JSON.stringify(r) === '[255,215,0]' || `вернула ${JSON.stringify(r)}`; } },
        { name: 'Крайние значения: "#000000" → [0, 0, 0] и "#ffffff" → [255, 255, 255]', js: true, check: async h => { const f = h.get('hexToRgb'); if (typeof f !== 'function') return 'функции hexToRgb нет'; const a = JSON.stringify(f('#000000')), b = JSON.stringify(f('#ffffff')); return a === '[0,0,0]' && b === '[255,255,255]' || `вернула ${a} и ${b}`; } },
        { name: 'Кнопка показывает rgb(30, 58, 95) для #1e3a5f', js: true, check: async h => { h.type('#hex', '#1e3a5f'); h.click('#go'); await h.wait(30); return h.text('#out') === 'rgb(30, 58, 95)' || `на странице: ${h.text('#out')}`; } },
        { name: 'Скрипт работает без ошибок', js: true, check: async h => { h.click('#go'); await h.wait(30); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
