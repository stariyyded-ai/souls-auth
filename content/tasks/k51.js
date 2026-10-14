/* Занятие 51. Юзабилити мобильных сайтов и приложений */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k5101', lesson: 'mdk-51', module: 'mdk5', mech: 'adaptive', title: 'Кафе, удобное для пальца', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт кафе «Перемена» сделан только для компьютера. Студенты заказывают обед с телефона на перемене — одной рукой, на ходу — и промахиваются по крошечным ссылкам.',
      goal: 'Сделайте страницу удобной на телефоне 360px: никакой горизонтальной прокрутки (уберите фиксированную ширину 960px, поставьте max-width), основной текст не меньше 16px, каждая ссылка меню не ниже 44px и между ссылками не меньше 8px, кнопка «Заказать обед» не ниже 48px и почти на всю ширину экрана (от 280px). Карточки блюд на телефоне — в одну колонку, а на компьютере (от 768px) — три в ряд.',
      hints: [
        'Ширину страницы сделайте резиновой: .page { max-width: 960px; } вместо width: 960px.',
        'Ссылку меню удобно делать гибким блоком: .menu a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; }, а у .menu — display: flex; gap: 8px; flex-wrap: wrap;',
        'Кнопка: .btn { display: block; min-height: 48px; text-align: center; … }, тогда на телефоне она растянется на всю ширину.',
        'Mobile first: по умолчанию .cards { grid-template-columns: 1fr; }, а в @media (min-width: 768px) — repeat(3, 1fr).'
      ],
      html: `<div class="page">
  <header class="top">
    <p class="logo">Кафе «Перемена»</p>
    <nav class="menu" aria-label="Разделы сайта">
      <a href="#dishes">Меню</a>
      <a href="#hours">Часы работы</a>
      <a href="#contacts">Контакты</a>
    </nav>
  </header>
  <main>
    <h1>Обед за 15 минут между парами</h1>
    <p class="lead">Суп, горячее и компот — 290 ₽. Закажите заранее, и обед будет ждать вас на стойке.</p>
    <a class="btn" href="#dishes">Заказать обед</a>
    <section class="cards" id="dishes">
      <article class="card"><h2>Борщ</h2><p>Со сметаной и чесночной булочкой.</p></article>
      <article class="card"><h2>Плов</h2><p>С курицей и морковью.</p></article>
      <article class="card"><h2>Сырники</h2><p>Три штуки с вареньем.</p></article>
    </section>
    <p id="hours">Работаем с 8:00 до 17:00, в субботу — до 14:00.</p>
    <p id="contacts">Корпус 1, первый этаж, рядом с гардеробом.</p>
  </main>
</div>`,
      css: `${BASE}
.page { width: 960px; margin: 0 auto; font-size: 12px; }
.top { display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: bold; }
.menu a { font-size: 12px; padding: 2px; color: #1f5f8b; }
.btn { padding: 4px 8px; font-size: 12px; background-color: #8a3b12; color: #ffffff; text-decoration: none; border-radius: 6px; }
.cards { display: grid; grid-template-columns: repeat(3, 300px); gap: 16px; margin: 24px 0; }
.card { padding: 16px; border: 1px solid #d0d7de; border-radius: 12px; }`,
      tests: [
        { name: 'На 360px нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || `ширина страницы ${h.doc.documentElement.scrollWidth}px` },
        { name: 'Основной текст на телефоне не меньше 16px', at: 360, check: h => { const s = h.px('.lead', 'font-size'), c = h.px('.card p', 'font-size'); return s >= 16 && c >= 16 || `текст ${s}px, в карточках ${c}px`; } },
        { name: 'Каждая ссылка меню не ниже 44px', at: 360, check: h => { const hs = h.$$('.menu a').map(a => Math.round(a.getBoundingClientRect().height)); return hs.every(x => x >= 44) || `высота ссылок: ${hs.join(', ')}px`; } },
        { name: 'Между ссылками меню не меньше 8px', at: 360, check: h => { const r = h.$$('.menu a').map(a => a.getBoundingClientRect()); for (let i = 1; i < r.length; i++) { const gap = Math.max(r[i].left - r[i - 1].right, r[i].top - r[i - 1].bottom, r[i - 1].left - r[i].right); if (gap < 7.5) return `между ссылками ${i} и ${i + 1}: ${Math.round(gap)}px`; } return true; } },
        { name: 'Кнопка «Заказать обед» не ниже 48px и шириной от 280px', at: 360, check: h => { const r = h.rect('.btn'); return r.height >= 47.5 && r.width >= 280 || `кнопка ${Math.round(r.width)}×${Math.round(r.height)}px`; } },
        { name: 'На телефоне карточки в одну колонку', at: 360, check: h => { const l = h.$$('.card').map(c => Math.round(c.getBoundingClientRect().left)); return new Set(l).size === 1 || 'карточки стоят в ряд'; } },
        { name: 'На компьютере три карточки в ряд', check: h => h.sameRow(h.$$('.card')) || 'карточки не в одном ряду' }
      ]
    },
    {
      id: 'k5102', lesson: 'mdk-51', module: 'mdk5', mech: 'build', title: 'Форма заказа под телефонную клавиатуру', level: 'Среднее', minutes: 20, points: 150,
      story: 'Форма заказа работает, но на телефоне везде открывается буквенная клавиатура, а браузер не предлагает подставить имя и номер. Каждое лишнее касание — повод бросить заказ.',
      goal: 'Настройте поля: имени — autocomplete="name"; телефону — type="tel" и autocomplete="tel"; почте — type="email" и autocomplete="email"; коду из СМС — inputmode="numeric" и autocomplete="one-time-code"; времени — type="time". В CSS: у полей шрифт не меньше 16px (иначе iPhone увеличит страницу), высота не меньше 44px, на телефоне 360px поля во всю ширину формы (от 300px). Подписи стоят над полями. Кнопка не ниже 48px.',
      hints: [
        'Тип поля меняет клавиатуру: <input id="phone" name="phone" type="tel" autocomplete="tel">.',
        'Код из СМС — это цифры, но не число (с ним не считают), поэтому type оставляем text, а клавиатуру меняем через inputmode="numeric".',
        'Подпись над полем: label { display: block; }. Поле во всю ширину: input { width: 100%; box-sizing: border-box; }.',
        'Размеры: input { font-size: 16px; min-height: 44px; } и .btn { min-height: 48px; }.'
      ],
      html: `<form class="order" id="order">
  <h2>Заказ обеда</h2>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="text">
  <label for="email">Почта для чека</label>
  <input id="email" name="email" type="text">
  <label for="code">Код из СМС</label>
  <input id="code" name="code" type="text">
  <label for="time">Ко скольки приготовить</label>
  <input id="time" name="time" type="text">
  <button class="btn" type="submit">Заказать</button>
</form>`,
      css: `${BASE}
.order { max-width: 420px; }
label { margin-right: 8px; font-weight: bold; }
input { padding: 4px; font-size: 13px; border: 1px solid #8c959f; border-radius: 6px; }
.btn { margin-top: 16px; padding: 6px 12px; font-size: 16px; border: none; border-radius: 8px; background-color: #8a3b12; color: #ffffff; }`,
      tests: [
        { name: 'Имя: autocomplete="name"', check: h => h.$('#name')?.getAttribute('autocomplete') === 'name' || 'нет autocomplete="name"' },
        { name: 'Телефон: type="tel" и autocomplete="tel"', check: h => { const e = h.$('#phone'); return e?.type === 'tel' && e.getAttribute('autocomplete') === 'tel' || `type="${e?.getAttribute('type')}", autocomplete="${e?.getAttribute('autocomplete') || ''}"`; } },
        { name: 'Почта: type="email" и autocomplete="email"', check: h => { const e = h.$('#email'); return e?.type === 'email' && e.getAttribute('autocomplete') === 'email' || `type="${e?.getAttribute('type')}", autocomplete="${e?.getAttribute('autocomplete') || ''}"`; } },
        { name: 'Код из СМС: inputmode="numeric" и autocomplete="one-time-code"', check: h => { const e = h.$('#code'); return e?.getAttribute('inputmode') === 'numeric' && e.getAttribute('autocomplete') === 'one-time-code' || 'нужны inputmode="numeric" и autocomplete="one-time-code"'; } },
        { name: 'Время: type="time"', check: h => h.$('#time')?.type === 'time' || 'у поля времени нет type="time"' },
        { name: 'Поля: шрифт от 16px, высота от 44px, ширина от 300px на телефоне', at: 360, check: h => { for (const e of h.$$('input')) { const r = e.getBoundingClientRect(), f = h.px(e, 'font-size'); if (f < 16 || r.height < 43.5 || r.width < 300) return `#${e.id}: шрифт ${f}px, ${Math.round(r.width)}×${Math.round(r.height)}px`; } return true; } },
        { name: 'Подписи стоят над полями', at: 360, check: h => h.$$('label').every(l => { const i = h.doc.getElementById(l.htmlFor); return i && l.getBoundingClientRect().bottom <= i.getBoundingClientRect().top + 1; }) || 'подпись стоит сбоку от поля' },
        { name: 'Кнопка «Заказать» не ниже 48px', at: 360, check: h => h.rect('.btn').height >= 47.5 || `сейчас ${Math.round(h.rect('.btn').height)}px` }
      ]
    },
    {
      id: 'k5103', lesson: 'mdk-51', module: 'mdk5', mech: 'build', title: 'Нижняя навигация приложения', level: 'Сложное', minutes: 20, points: 200,
      story: 'Приложение «Мой колледж»: расписание, оценки, чат, профиль. На телефоне меню должно быть внизу, в зоне большого пальца, а на компьютере — обычным меню сверху.',
      goal: 'На телефоне (по умолчанию) закрепите .tabbar внизу экрана: position: fixed, bottom: 0, left: 0, ширина во весь экран. Четыре ссылки стоят в один ряд, каждая не меньше 48px в высоту и 64px в ширину, иконка над подписью (flex-direction: column). Текущему разделу «Расписание» добавьте aria-current="page" и выделите его цветом. Чтобы панель не закрывала текст, дайте .content отступ снизу не меньше высоты панели. На компьютере (@media (min-width: 768px)) панель снова обычная: position: static.',
      hints: [
        'Закрепить внизу: .tabbar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; }.',
        'Ссылки поровну: .tabbar a { flex: 1; display: flex; flex-direction: column; align-items: center; min-height: 56px; }.',
        'Текущий раздел: <a href="#schedule" aria-current="page">…</a>, а в CSS — .tabbar a[aria-current="page"] { color: …; }.',
        'Отступ: .content { padding-bottom: 80px; }. На компьютере: @media (min-width: 768px) { .tabbar { position: static; } }.'
      ],
      html: `<nav class="tabbar" aria-label="Разделы приложения">
  <a href="#schedule"><img src="${ICON}" alt=""><span>Расписание</span></a>
  <a href="#marks"><img src="${ICON}" alt=""><span>Оценки</span></a>
  <a href="#chat"><img src="${ICON}" alt=""><span>Чат</span></a>
  <a href="#profile"><img src="${ICON}" alt=""><span>Профиль</span></a>
</nav>
<main class="content" id="schedule">
  <h1>Расписание на вторник</h1>
  <p>1 пара, 8:30 — Проектирование интерфейсов, кабинет 214.</p>
  <p>2 пара, 10:10 — Английский язык, кабинет 305.</p>
  <p>3 пара, 12:10 — Физкультура, спортзал.</p>
  <p>4 пара, 13:50 — Математика, кабинет 118.</p>
  <p>Консультация по курсовой — в 15:30, кабинет 214.</p>
</main>`,
      css: `${BASE}
.tabbar { background-color: #ffffff; border-top: 1px solid #d0d7de; }
.tabbar a { color: #57606a; font-size: 12px; text-decoration: none; }
.tabbar img { width: 24px; height: 24px; }`,
      tests: [
        { name: 'На телефоне панель закреплена внизу во всю ширину', at: 360, check: h => { const r = h.rect('.tabbar'); return h.cs('.tabbar', 'position') === 'fixed' && Math.abs(r.bottom - h.win.innerHeight) < 2 && r.width >= 359 || `position: ${h.cs('.tabbar', 'position')}, низ ${Math.round(r.bottom)}px, ширина ${Math.round(r.width)}px`; } },
        { name: 'Четыре ссылки в один ряд, каждая от 64×48px', at: 360, check: h => { const a = h.$$('.tabbar a'); if (a.length !== 4) return `ссылок: ${a.length}`; if (!h.sameRow(a)) return 'ссылки не в одном ряду'; const bad = a.map(e => e.getBoundingClientRect()).find(r => r.width < 64 || r.height < 47.5); return !bad || `ссылка ${Math.round(bad.width)}×${Math.round(bad.height)}px`; } },
        { name: 'Иконка стоит над подписью', at: 360, check: h => h.$$('.tabbar a').every(a => { const i = a.querySelector('img'), s = a.querySelector('span'); return i && s && i.getBoundingClientRect().bottom <= s.getBoundingClientRect().top + 1; }) || 'иконка сбоку от подписи' },
        { name: '«Расписание» отмечено aria-current="page" и выделено цветом', check: h => { const cur = h.$$('.tabbar a[aria-current="page"]'); if (cur.length !== 1 || !/Расписание/.test(cur[0].textContent)) return 'aria-current="page" должен быть у одной ссылки «Расписание»'; const other = h.$$('.tabbar a')[1]; return h.cs(cur[0], 'color') !== h.cs(other, 'color') || 'текущий раздел того же цвета, что и остальные'; } },
        { name: 'Панель не закрывает текст: у .content отступ снизу не меньше высоты панели', at: 360, check: h => { const pb = h.px('.content', 'padding-bottom') + h.px('.content', 'margin-bottom'); const nav = h.rect('.tabbar').height; return pb >= nav || `отступ ${pb}px, панель ${Math.round(nav)}px`; } },
        { name: 'На компьютере панель обычная (position: static)', check: h => h.cs('.tabbar', 'position') === 'static' || `position: ${h.cs('.tabbar', 'position')}` }
      ]
    }
  );
})();
