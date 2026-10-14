/* Занятие 18. HTML5: элементы, атрибуты и структура страницы */
(() => {
  const { BASE, IMG, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k1801', lesson: 'mdk-18', module: 'mdk2', mech: 'build', title: 'Из div — в семантику', level: 'Среднее', minutes: 20, points: 150,
      story: 'Страница библиотеки свёрстана одними div. Выглядит нормально, но поисковик и экранный диктор не понимают, где меню, где главное, а где подвал.',
      goal: 'Замените div на семантические теги, сохранив классы (на них держится CSS): div.header → header, div.nav → nav, div.main → main, div.article → article, div.aside → aside, div.footer → footer. Логотип div.logo замените на абзац p с тем же классом. Порядок блоков и текст не меняйте.',
      hints: [
        'Меняются оба тега: и открывающий, и закрывающий. <div class="header"> … </div> → <header class="header"> … </header>.',
        'nav остаётся внутри header, article и aside — внутри main.',
        'Класс не удаляйте: <main class="main">. Если стиль пропал — проверьте класс.',
        'Последний div.footer становится <footer class="footer">.'
      ],
      html: `<div class="header">
  <div class="logo">Библиотека колледжа</div>
  <div class="nav">
    <a href="#catalog">Каталог</a>
    <a href="#rules">Правила</a>
    <a href="#contacts">Контакты</a>
  </div>
</div>
<div class="main">
  <div class="article">
    <h1>Как записаться в библиотеку</h1>
    <p>Возьмите студенческий билет и подойдите на абонемент. Читательский билет выдадут сразу.</p>
  </div>
  <div class="aside">
    <h2>Часы работы</h2>
    <p>Пн–Пт, 9:00–18:00</p>
  </div>
</div>
<div class="footer">
  <p>© 2026 Библиотека колледжа</p>
</div>`,
      css: `${BASE}
.header { background-color: #1f2a44; color: #ffffff; padding: 12px 16px; }
.logo { margin: 0 0 8px; font-weight: bold; }
.nav a { color: #ffd166; margin-right: 16px; }
.main { padding: 16px 0; }
.article { margin-bottom: 16px; }
.aside { border-left: 4px solid #1f4e79; padding-left: 12px; }
.footer { border-top: 1px solid #c9d3df; color: #555555; }`,
      tests: [
        { name: 'Шапка — header с классом header, внутри nav со ссылками', check: h => (h.count('header.header') === 1 && h.$('header.header nav.nav') && h.count('nav.nav a') === 3) || 'нужен <header class="header"> и внутри <nav class="nav"> с тремя ссылками' },
        { name: 'Логотип — абзац p.logo', check: h => (h.$('header p.logo') && h.text('p.logo') === 'Библиотека колледжа') || 'нужен <p class="logo">Библиотека колледжа</p>' },
        { name: 'Главное — один main, в нём article с h1 и aside', check: h => {
          if (h.count('main') !== 1 || !h.$('main.main')) return 'нужен один <main class="main">';
          if (!h.$('main article.article h1')) return 'h1 должен быть в <article class="article"> внутри main';
          return !!h.$('main aside.aside h2') || 'нужен <aside class="aside"> с h2 внутри main'; } },
        { name: 'Подвал — footer после main', check: h => (h.$('footer.footer') && h.before('main', 'footer')) || 'нужен <footer class="footer"> после main' },
        { name: 'Ни одного div не осталось', check: h => !h.count('div') || `div осталось: ${h.count('div')}` },
        { name: 'Стили на месте: шапка тёмная, у боковой колонки рамка', check: h => (h.cs('header', 'background-color') === rgb('#1f2a44') && h.cs('aside', 'border-left-width') === '4px') || 'классы потерялись — стили не применились' }
      ]
    },
    {
      id: 'k1802', lesson: 'mdk-18', module: 'mdk2', mech: 'build', title: 'Новость с датой и иллюстрацией', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Для ленты новостей колледжа нужна разметка одной новости: заголовок, дата, текст с важной пометкой и фотография с подписью.',
      goal: 'Разметьте текст как новость: всё обёрнуто в article с атрибутом data-category="events". «День открытых дверей» — заголовок h2. Дата — элемент time с атрибутом datetime="2026-10-15" внутри абзаца. Описание — абзац p, слова «вход свободный» выделены тегом mark. Ниже — figure: картинка img/art.svg с осмысленным alt и подпись figcaption «Так выглядела мастерская в прошлом году».',
      hints: [
        'Каркас: <article data-category="events"> … </article>. Атрибуты data-* придумывает сам автор.',
        'Дата для людей и для машин: <p><time datetime="2026-10-15">15 октября 2026 года</time></p>',
        'Пометка: <mark>вход свободный</mark>.',
        '<figure><img src="img/art.svg" alt="…"><figcaption>…</figcaption></figure>'
      ],
      html: `<!-- Сделайте из этого текста новость -->
День открытых дверей
15 октября 2026 года
Приглашаем школьников и родителей. Начало в 11:00, вход свободный.
Так выглядела мастерская в прошлом году`,
      css: `${BASE}
article { max-width: 600px; }
time { color: #555555; font-size: 14px; }
figure { margin: 16px 0 0; }
figcaption { font-size: 14px; color: #555555; }`,
      tests: [
        { name: 'Новость в article с data-category="events"', check: h => (h.count('article') === 1 && h.$('article').dataset.category === 'events') || 'нужен <article data-category="events">' },
        { name: 'Заголовок h2 «День открытых дверей» внутри article', check: h => h.text('article h2') === 'День открытых дверей' || 'нет h2 с этим текстом в article' },
        { name: 'Дата в time с datetime="2026-10-15"', check: h => (h.$('article time')?.getAttribute('datetime') === '2026-10-15' && /15 октября/.test(h.text('time'))) || 'нужно <time datetime="2026-10-15">15 октября 2026 года</time>' },
        { name: '«вход свободный» выделено mark в абзаце', check: h => (h.$('article p mark') && h.text('mark') === 'вход свободный') || 'нужно <mark>вход свободный</mark> внутри p' },
        { name: 'Иллюстрация: figure с img (alt) и figcaption', check: h => {
          const f = h.$('article figure'); if (!f) return 'нет figure внутри article';
          const i = f.querySelector('img');
          if (!i || !/art\.svg$/.test(i.getAttribute('src') || '') || !(i.getAttribute('alt') || '').trim()) return 'нужна <img src="img/art.svg" alt="…"> внутри figure';
          return /мастерская/.test(f.querySelector('figcaption')?.textContent || '') || 'нет figcaption с подписью'; } }
      ]
    },
    {
      id: 'k1803', lesson: 'mdk-18', module: 'mdk2', mech: 'fix', title: 'Форма на новых типах полей', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма записи на пробную тренировку: все поля типа text. На телефоне для почты не появляется «@», для телефона — цифры, а дату приходится печатать руками.',
      goal: 'Поменяйте типы полей: почта — email, телефон — tel, дата — date, число гостей — number с ограничениями min="1" и max="5". Поля «Имя» и «Почта» сделайте обязательными (required). Для даты укажите min="2026-11-01" — раньше записи нет. Подписи, id и name не меняйте.',
      hints: [
        'Тип задаётся атрибутом type: <input id="email" name="email" type="email">.',
        'Ограничения числа: type="number" min="1" max="5".',
        'Обязательное поле — атрибут без значения: required.',
        'Для type="date" min пишется в формате ГГГГ-ММ-ДД: min="2026-11-01".'
      ],
      html: `<h1>Пробная тренировка</h1>
<form class="form" action="#" method="post">
  <label for="name">Имя</label>
  <input id="name" name="name" type="text">
  <label for="email">Почта</label>
  <input id="email" name="email" type="text">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="text">
  <label for="date">Дата тренировки</label>
  <input id="date" name="date" type="text">
  <label for="guests">Сколько человек придёт</label>
  <input id="guests" name="guests" type="text">
  <button type="submit">Записаться</button>
</form>`,
      css: `${BASE}
.form label { display: block; margin-top: 12px; }
.form input { display: block; margin-top: 4px; padding: 8px; font-size: 16px; }
.form button { margin-top: 16px; padding: 10px 20px; font-size: 16px; }`,
      tests: [
        { name: 'Почта — type="email", телефон — type="tel"', check: h => (h.$('#email')?.type === 'email' && h.$('#phone')?.type === 'tel') || `сейчас: почта ${h.$('#email')?.type}, телефон ${h.$('#phone')?.type}` },
        { name: 'Дата — type="date" с min="2026-11-01"', check: h => (h.$('#date')?.type === 'date' && h.$('#date').getAttribute('min') === '2026-11-01') || 'нужно type="date" min="2026-11-01"' },
        { name: 'Число гостей — type="number" от 1 до 5', check: h => { const g = h.$('#guests'); return (g?.type === 'number' && g.getAttribute('min') === '1' && g.getAttribute('max') === '5') || 'нужно type="number" min="1" max="5"'; } },
        { name: 'Имя и почта обязательны (required)', check: h => (h.$('#name')?.required && h.$('#email')?.required) || 'добавьте required полям name и email' },
        { name: 'Подписи, id и name на месте', check: h => ['name', 'email', 'phone', 'date', 'guests'].every(id => h.$(`label[for="${id}"]`) && h.$(`#${id}`)?.getAttribute('name') === id) || 'не меняйте label for, id и name' }
      ]
    }
  );
})();
