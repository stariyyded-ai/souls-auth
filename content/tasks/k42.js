/* Занятие 42. Взаимодействие пользователя с сайтом */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const oneRow = (h, sels) => { const r = sels.map(s => h.rect(s)); return r.every(x => x && x.height) && Math.max(...r.map(x => x.top)) < Math.min(...r.map(x => x.bottom)); };
  // правый край содержимого блока (без внутреннего отступа)
  const innerRight = (h, sel) => h.rect(sel).right - h.px(sel, 'padding-right') - h.px(sel, 'border-right-width');
  const transparent = c => /rgba\(.*,\s*0\)$/.test(c) || c === 'transparent';

  window.COURSE_TASKS.push(
    {
      id: 'k4201', lesson: 'mdk-42', module: 'mdk5', mech: 'build',
      title: 'Первый экран по Z-паттерну', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'На посадочной странице фитнес-клуба взгляд скользит буквой Z: логотип → кнопка в шапке → заголовок → главная кнопка. Сейчас все элементы стоят столбиком, и кнопка «Записаться» теряется внизу слева.',
      goal: 'Расставьте элементы по Z-паттерну. 1) В шапке .header логотип .logo слева, ссылка .header__cta справа, в одном ряду; правый край ссылки — у правого края шапки. 2) Заголовок h1 — под шапкой, слева. 3) В блоке .hero__bottom абзац слева, кнопка .btn справа, в одном ряду; правый край кнопки — у правого края блока .hero. HTML не меняйте, только CSS.',
      hints: [
        'Флекс-контейнер с разносом по краям: display: flex; justify-content: space-between; align-items: center;',
        'Нужны два таких контейнера: .header и .hero__bottom.',
        'Чтобы абзац не растягивался во всю ширину и не прижимал кнопку, ограничьте его: .hero__bottom p { max-width: 400px; }',
        'Отступ между абзацем и кнопкой: gap: 24px; у контейнера.'
      ],
      html: `<header class="header">
  <div class="logo">Пульс</div>
  <a class="header__cta" href="#trial">Пробное занятие</a>
</header>
<section class="hero">
  <h1>Первая тренировка — бесплатно</h1>
  <div class="hero__bottom">
    <p>Тренажёрный зал в пяти минутах от колледжа. Студентам — скидка 20%.</p>
    <a class="btn" href="#signup">Записаться</a>
  </div>
</section>`,
      css: `${BASE}
.header {
  padding: 16px 24px;
  border-bottom: 1px solid #d0d7de;
}
.logo {
  font-size: 24px;
  font-weight: bold;
}
.header__cta {
  color: #1f4e5f;
  font-weight: bold;
}
.hero {
  padding: 48px 24px;
  background-color: #f4f7f6;
}
.hero h1 {
  margin-top: 0;
  font-size: 40px;
}
.btn {
  display: inline-block;
  padding: 16px 32px;
  border-radius: 8px;
  background-color: #1f4e5f;
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
}`,
      tests: [
        { name: 'Шапка: логотип слева, ссылка справа в одном ряду', check: h => oneRow(h, ['.logo', '.header__cta']) && h.rect('.header__cta').left > h.rect('.logo').right || 'сделайте .header флекс-контейнером' },
        { name: 'Ссылка в шапке прижата к правому краю', check: h => Math.abs(h.rect('.header__cta').right - innerRight(h, '.header')) <= 2 || 'используйте justify-content: space-between' },
        { name: 'Заголовок под шапкой, слева', check: h => h.rect('h1').top >= h.rect('.header').bottom && h.rect('h1').left < h.width / 3 || 'h1 должен стоять под шапкой слева' },
        { name: 'Абзац и кнопка в одном ряду, кнопка справа', check: h => oneRow(h, ['.hero__bottom p', '.btn']) && h.rect('.btn').left > h.rect('.hero__bottom p').right || 'сделайте .hero__bottom флекс-контейнером' },
        { name: 'Кнопка прижата к правому краю блока .hero', check: h => Math.abs(h.rect('.btn').right - innerRight(h, '.hero')) <= 2 || 'кнопка — конец буквы Z, она справа' }
      ]
    },
    {
      id: 'k4202', lesson: 'mdk-42', module: 'mdk5', mech: 'fix',
      title: 'Один главный призыв к действию', level: 'Среднее', minutes: 20, points: 150,
      story: 'На странице курсов английского три кнопки разного цвета кричат одновременно: зелёная, красная и жёлтая. Пользователь не понимает, что от него хотят, и уходит.',
      goal: 'Оставьте один главный призыв. Главная кнопка .btn--primary: фон #2e7d32, белый текст, высота не меньше 44px (min-height: 44px). Второстепенная .btn--secondary: прозрачный фон (transparent), рамка 2px solid #2e7d32, текст #2e7d32, высота как у главной. Третье действие .link-more — обычная ссылка: без фона, с подчёркиванием. HTML не меняйте.',
      hints: [
        'Прозрачный фон: background-color: transparent;',
        'Чтобы кнопки были одной высоты, задайте общий min-height: 44px в правиле .btn, а рамку главной кнопке тоже сделайте 2px того же цвета — тогда размеры совпадут.',
        'min-height работает у блоков: у .btn уже стоит display: inline-flex, так что всё получится.',
        'Ссылка: у .link-more уберите фон и padding, а text-decoration: underline верните.'
      ],
      html: `<section class="offer">
  <h1>Курсы английского в колледже</h1>
  <p>Группы по 8 человек, занятия два раза в неделю после пар.</p>
  <div class="actions">
    <a class="btn btn--primary" href="#signup">Записаться на пробный урок</a>
    <a class="btn btn--secondary" href="#schedule">Посмотреть расписание</a>
    <a class="link-more" href="#about">Подробнее о преподавателях</a>
  </div>
</section>`,
      css: `${BASE}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
}
.btn--primary {
  background-color: #2e7d32;
  color: #ffffff;
}
.btn--secondary {
  background-color: #c62828;
  color: #ffffff;
}
.link-more {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #f9a825;
  color: #222222;
  text-decoration: none;
}`,
      tests: [
        { name: 'Главная кнопка: фон #2e7d32, белый текст', check: h => h.cs('.btn--primary', 'background-color') === rgb('#2e7d32') && h.cs('.btn--primary', 'color') === rgb('#ffffff') || 'не меняйте цвета главной кнопки' },
        { name: 'Главная кнопка не ниже 44px', check: h => h.rect('.btn--primary').height >= 44 || `сейчас ${Math.round(h.rect('.btn--primary').height)}px` },
        { name: 'Второстепенная: прозрачный фон, рамка 2px и текст цвета #2e7d32', check: h => transparent(h.cs('.btn--secondary', 'background-color')) && h.px('.btn--secondary', 'border-top-width') === 2 && h.cs('.btn--secondary', 'border-top-style') === 'solid' && h.cs('.btn--secondary', 'border-top-color') === rgb('#2e7d32') && h.cs('.btn--secondary', 'color') === rgb('#2e7d32') || 'у .btn--secondary: transparent, border: 2px solid #2e7d32, color #2e7d32' },
        { name: 'Кнопки одной высоты', check: h => Math.abs(h.rect('.btn--primary').height - h.rect('.btn--secondary').height) < 1 || 'выровняйте высоту кнопок' },
        { name: 'Третье действие — подчёркнутая ссылка без фона', check: h => transparent(h.cs('.link-more', 'background-color')) && /underline/.test(h.cs('.link-more', 'text-decoration-line')) || 'у .link-more уберите фон и верните подчёркивание' }
      ]
    },
    {
      id: 'k4203', lesson: 'mdk-42', module: 'mdk5', mech: 'build',
      title: 'Кнопка «В избранное» с откликом', level: 'Среднее', minutes: 20, points: 150,
      story: 'В подборке библиотеки можно добавить книгу в избранное. Сейчас кнопка ничего не отвечает, и студенты жмут её по пять раз. Нужна обратная связь: кнопка меняет вид и текст, а под списком появляется сообщение.',
      goal: 'Напишите скрипт. При нажатии на кнопку .fav: если она не нажата (aria-pressed="false") — поставьте aria-pressed="true", текст кнопки «В избранном», а в абзац .status (у него role="status", не удаляйте его — так сообщение услышит экранный диктор) запишите «Книга добавлена в избранное». Если нажата — наоборот: aria-pressed="false", текст «В избранное», сообщение «Книга убрана из избранного». Так должна работать каждая кнопка .fav. Вид нажатой кнопки CSS уже меняет сам, по атрибуту aria-pressed.',
      hints: [
        'Прочитать атрибут: button.getAttribute(\'aria-pressed\') — это строка \'true\' или \'false\', не логическое значение.',
        'Записать атрибут: button.setAttribute(\'aria-pressed\', \'true\');',
        'Удобно так: const pressed = button.getAttribute(\'aria-pressed\') === \'true\'; if (pressed) { … } else { … }',
        'Текст: button.textContent = \'В избранном\'; status.textContent = \'Книга добавлена в избранное\';'
      ],
      html: `<h1>Подборка недели</h1>
<article class="book">
  <h2>«Мастер и Маргарита»</h2>
  <p>М. Булгаков</p>
  <button class="fav" type="button" aria-pressed="true">В избранном</button>
</article>
<article class="book">
  <h2>«Шинель»</h2>
  <p>Н. Гоголь</p>
  <button class="fav" type="button" aria-pressed="false">В избранное</button>
</article>
<p class="status" role="status"></p>`,
      css: `${BASE}
.book {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.fav {
  padding: 8px 16px;
  border: 2px solid #1f5fa8;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1f5fa8;
  font-size: 16px;
}
.fav[aria-pressed="true"] {
  background-color: #1f5fa8;
  color: #ffffff;
}
.status {
  font-weight: bold;
  color: #1b5e20;
}`,
      js: `const buttons = document.querySelectorAll('.fav');
const status = document.querySelector('.status');

for (const button of buttons) {
  button.addEventListener('click', () => {
    // 1. Узнайте, нажата ли кнопка сейчас
    // 2. Переключите aria-pressed на противоположное значение
    // 3. Поменяйте текст кнопки и сообщение в .status
  });
}
`,
      tests: [
        { name: 'Сообщение выводится в области role="status"', check: h => h.$('.status')?.getAttribute('role') === 'status' || 'у .status должен остаться role="status"' },
        { name: 'Добавление: aria-pressed="true", текст «В избранном», сообщение', js: true, check: async h => {
          const b = h.$$('.fav')[1]; b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'true' && b.textContent.trim() === 'В избранном' && h.text('.status') === 'Книга добавлена в избранное' || `aria-pressed=${b.getAttribute('aria-pressed')}, кнопка «${b.textContent.trim()}», сообщение «${h.text('.status')}»`; } },
        { name: 'Удаление: aria-pressed="false", текст «В избранное», сообщение', js: true, check: async h => {
          const b = h.$$('.fav')[0]; b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'false' && b.textContent.trim() === 'В избранное' && h.text('.status') === 'Книга убрана из избранного' || `aria-pressed=${b.getAttribute('aria-pressed')}, кнопка «${b.textContent.trim()}», сообщение «${h.text('.status')}»`; } },
        { name: 'Повторное нажатие возвращает кнопку обратно', js: true, check: async h => {
          const b = h.$$('.fav')[1]; b.click(); await h.wait();
          if (b.getAttribute('aria-pressed') !== 'true') return 'после первого нажатия кнопка должна стать нажатой';
          b.click(); await h.wait();
          return b.getAttribute('aria-pressed') === 'false' && b.textContent.trim() === 'В избранное' && h.text('.status') === 'Книга убрана из избранного' || 'после второго нажатия кнопка должна вернуться в исходное состояние'; } },
        { name: 'В консоли нет ошибок', js: true, check: async h => { h.$$('.fav').forEach(b => b.click()); await h.wait(); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
