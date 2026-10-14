/* Занятие 17. Веб-стандарты и их поддержка */
(() => {
  const { BASE, ICON, rgb } = window.COURSE_KIT;
  const lastFamily = (h, sel) => h.cs(sel, 'font-family').split(',').pop().trim().replace(/["']/g, '');
  window.COURSE_TASKS.push(
    {
      id: 'k1701', lesson: 'mdk-17', module: 'mdk2', mech: 'fix', title: 'Пройдите валидатор', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Страницу консультаций сделали по старой книге 2005 года. Браузер её кое-как показывает, но валидатор W3C нашёл шесть ошибок. На экзамене за такое снимают баллы.',
      goal: 'Исправьте все ошибки, не теряя текста: 1) уберите устаревший тег center, а абзацу с кабинетом дайте класс place (центровка уже описана в CSS); 2) замените b на strong и закройте теги в правильном порядке; 3) у второго абзаца повторяется id="info" — замените его на id="teacher"; 4) устаревший font замените на span с классом teacher-name; 5) у картинки возьмите значения атрибутов в двойные кавычки и добавьте alt; 6) знак «меньше» в тексте запишите как &lt;. Линтер не должен показывать ошибок.',
      hints: [
        'Начните с красных отметок линтера: они показывают строки с ошибками.',
        'Было: <center><p>…</p></center>. Стало: <p class="place">…</p>.',
        'Было: <font color="#1f4e79">Ирина Петровна</font>. Стало: <span class="teacher-name">Ирина Петровна</span> — цвет уже в CSS.',
        'Картинка: <img src="img/icon.svg" width="48" height="48" alt="Календарь">. Знак «<» в тексте: &lt;.'
      ],
      html: `<h1>Консультации по МДК.08.01</h1>
<center><p>Кабинет 214, второй этаж</p></center>
<p id="info">Консультации проходят <b>по понедельникам</p></b>
<p id="info">Ведёт: <font color="#1f4e79">Ирина Петровна</font></p>
<img src=${ICON} width=48 height=48>
<p>Время на один вопрос: < 10 минут.</p>`,
      css: `${BASE}
.place { text-align: center; }
.teacher-name { color: #1f4e79; font-weight: bold; }`,
      tests: [
        { name: 'Линтер HTML не находит ошибок', check: h => !window.TaskRunner || !window.TaskRunner.htmlLint(h.html).some(m => m.type === 'error') || `ошибка: ${window.TaskRunner.htmlLint(h.html).find(m => m.type === 'error').message}` },
        { name: 'Нет устаревших тегов center, font, b', check: h => !h.count('center, font, b') || `осталось: <${h.$('center, font, b').tagName.toLowerCase()}>` },
        { name: 'Абзац с кабинетом стоит по центру благодаря классу place', check: h => { const p = h.$('p.place'); return (p && /Кабинет 214/.test(p.textContent) && h.cs(p, 'text-align') === 'center') || 'нужен <p class="place">Кабинет 214…</p>'; } },
        { name: '«по понедельникам» выделено strong внутри абзаца', check: h => (h.$('p strong') && h.text('p strong') === 'по понедельникам') || 'нужно <p>… <strong>по понедельникам</strong></p>' },
        { name: 'id не повторяются: info и teacher', check: h => (h.count('#info') === 1 && h.count('#teacher') === 1) || `id="info": ${h.count('#info')}, id="teacher": ${h.count('#teacher')}` },
        { name: 'Имя преподавателя в span.teacher-name', check: h => (h.text('span.teacher-name') === 'Ирина Петровна' && h.cs('span.teacher-name', 'color') === rgb('#1f4e79')) || 'нужно <span class="teacher-name">Ирина Петровна</span>' },
        { name: 'У картинки есть alt, а знак «<» записан как &lt;', check: h => {
          if (!h.$('img[alt]')) return 'нет alt у картинки';
          return (/&lt;\s*10/.test(h.html) && /<\s*10 минут/.test(h.text('body'))) || 'запишите «&lt; 10 минут»'; } }
      ]
    },
    {
      id: 'k1702', lesson: 'mdk-17', module: 'mdk2', mech: 'a11y', title: 'Запись к врачу для всех', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма записи в поликлинику работает только для зрячих с мышкой. Пользователь экранного диктора слышит «картинка, поле ввода, поле ввода», а клавишей Tab до кнопки не добраться.',
      goal: 'Сделайте страницу доступной по WCAG: 1) у картинки — alt «Логотип поликлиники №3»; 2) у каждого поля — видимая подпись label for: «Ваше имя» и «Телефон» (placeholder можно оставить); 3) вместо div.button — настоящая кнопка button type="submit" с тем же классом button внутри формы; 4) серый текст .hint сделайте темнее, чтобы контраст был не ниже 4,5:1 (например, #595959); 5) замените текст ссылки «здесь» на понятный — «Правила приёма пациентов»; 6) удалите правило, которое убирает outline при фокусе.',
      hints: [
        'Подпись связывается с полем через одинаковые for и id: <label for="name">Ваше имя</label> и <input id="name" …>.',
        'div не получает фокус с клавиатуры и не нажимается Enter. Замените его на <button class="button" type="submit">Записаться</button>.',
        'Ссылку можно перестроить: <p>Перед визитом прочитайте <a href="#rules">Правила приёма пациентов</a>.</p>',
        'Правило с outline: none в конце CSS удалите целиком.'
      ],
      html: `<h1>Запись к терапевту</h1>
<img src="${ICON}" width="64" height="64">
<p class="hint">Приём ведёт терапевт, кабинет 12.</p>
<form class="form" action="#" method="post">
  <input id="name" name="name" type="text" placeholder="Ваше имя">
  <input id="phone" name="phone" type="tel" placeholder="Телефон">
  <div class="button">Записаться</div>
</form>
<p>Перед визитом прочитайте правила — <a href="#rules">здесь</a>.</p>`,
      css: `${BASE}
.hint { color: #aaaaaa; }
.form input { display: block; margin: 4px 0 12px; padding: 8px; font-size: 16px; }
.button { display: inline-block; padding: 10px 20px; background-color: #1f4e79; color: #ffffff; border: 0; font-size: 16px; }
a:focus, .button:focus { outline: none; }`,
      tests: [
        { name: 'У картинки есть понятный alt', check: h => (h.$('img')?.getAttribute('alt') || '').trim().length >= 5 || 'нужен alt="Логотип поликлиники №3"' },
        { name: 'У каждого поля есть видимая подпись label for', check: h => {
          for (const id of ['name', 'phone']) { const l = h.$(`label[for="${id}"]`); if (!l || l.textContent.trim().length < 3) return `нет <label for="${id}"> с текстом`; }
          return true; } },
        { name: 'Кнопка — настоящий button type="submit" внутри формы', check: h => {
          if (h.$('div.button')) return 'div.button остался — замените на <button>';
          const b = h.$('form button.button');
          return (b && b.type === 'submit' && b.textContent.trim().length > 0) || 'нужен <button class="button" type="submit"> внутри form'; } },
        { name: 'Контраст подсказки .hint не ниже 4,5:1', check: h => { const c = h.contrast('.hint'); return c >= 4.5 || `сейчас ${c.toFixed(2)}:1`; } },
        { name: 'Текст ссылки понятен без окружения', check: h => { const t = h.text('a').toLowerCase(); return (t.length >= 10 && !/^(здесь|тут|подробнее|ссылка|нажмите)$/.test(t)) || `сейчас «${t}»`; } },
        { name: 'Фокус не спрятан: нет outline: none', check: h => !h.has(/outline\s*:\s*(none|0)\b/i) || 'удалите правило с outline: none' }
      ]
    },
    {
      id: 'k1703', lesson: 'mdk-17', module: 'mdk2', mech: 'fix', title: 'Страница без сюрпризов', level: 'Среднее', minutes: 20, points: 150,
      story: 'Афиша дня открытых дверей отлично выглядит на компьютере дизайнера. А у директора заголовок стал чёрным, шрифт — с засечками, а экранный диктор читает английский слоган русскими буквами. Добавим запасные варианты.',
      goal: 'Файл с переменными до этой страницы не доходит, поэтому переменная --brand не объявлена — так и оставьте. 1) Заголовку .title задайте цвет с запасным значением: var(--brand, #1f4e79). 2) Шрифтам .title и .text допишите запасные варианты: "PT Sans", Arial, sans-serif и "Fira Sans", Arial, sans-serif — в конце списка всегда общее семейство. 3) Английскую фразу Learn by doing оберните в span с атрибутом lang="en". 4) У картинки добавьте атрибуты width="48" и height="48", чтобы место под неё было известно заранее, и alt.',
      hints: [
        'У var() есть второй аргумент — запасное значение: color: var(--brand, #1f4e79);',
        'Браузер берёт первый шрифт из списка, который у него есть. sans-serif в конце — шрифт без засечек, он есть везде.',
        'Атрибут lang можно ставить любому элементу: <span lang="en">Learn by doing</span>.',
        '<img src="img/icon.svg" width="48" height="48" alt="Иконка колледжа">'
      ],
      html: `<img src="${ICON}">
<h1 class="title">Неделя открытых дверей</h1>
<p class="text">Приходите знакомиться с колледжем 20–24 октября.</p>
<p class="text">Наш девиз — Learn by doing: учимся на практике.</p>`,
      css: `${BASE}
.title { color: var(--brand); font-family: "PT Sans"; }
.text { font-family: "Fira Sans"; font-size: 18px; }`,
      tests: [
        { name: 'Переменная --brand не объявлена (имитация старого браузера)', check: h => !h.win.getComputedStyle(h.doc.documentElement).getPropertyValue('--brand').trim() || 'не объявляйте --brand: нужно запасное значение в var()' },
        { name: 'Цвет заголовка: var(--brand, #1f4e79)', check: h => (h.has(/var\(\s*--brand\s*,\s*#1f4e79\s*\)/i) && h.cs('.title', 'color') === rgb('#1f4e79')) || 'нужно color: var(--brand, #1f4e79)' },
        { name: 'Шрифт заголовка: "PT Sans", Arial, sans-serif', check: h => (/PT Sans/.test(h.cs('.title', 'font-family')) && /Arial/.test(h.cs('.title', 'font-family')) && lastFamily(h, '.title') === 'sans-serif') || `сейчас ${h.cs('.title', 'font-family')}` },
        { name: 'Шрифт текста: "Fira Sans", Arial, sans-serif', check: h => (/Fira Sans/.test(h.cs('.text', 'font-family')) && /Arial/.test(h.cs('.text', 'font-family')) && lastFamily(h, '.text') === 'sans-serif') || `сейчас ${h.cs('.text', 'font-family')}` },
        { name: 'Английская фраза размечена lang="en"', check: h => (h.$('span[lang="en"]') && h.text('span[lang="en"]') === 'Learn by doing') || 'нужно <span lang="en">Learn by doing</span>' },
        { name: 'У картинки есть width, height и alt', check: h => { const i = h.$('img'); return (i && i.getAttribute('width') === '48' && i.getAttribute('height') === '48' && (i.getAttribute('alt') || '').trim()) ? true : 'нужны width="48", height="48" и alt'; } }
      ]
    }
  );
})();
