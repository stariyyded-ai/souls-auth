/* Занятие 25. ЛР13. Вёрстка списка заявок (карточки) и админ-таблицы */
(() => {
  const { rgb } = window.COURSE_KIT;
  const ROOT = `:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #cbd5e1;
  --status-new: #2563eb;
  --status-work: #f59e0b;
  --status-done: #15803d;
  --status-cancel: #dc2626;
  --fs-small: 0.875rem;
  --space-1: 8px;
  --space-2: 16px;
  --radius: 12px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.page { width: min(100% - 32px, 1100px); margin: 0 auto; padding: 24px 0; }`;
  const card = (title, badge, label, date, addr, pay, reason) => `    <article class="request-card">
      <header class="request-card__head">
        <h2 class="request-card__title">${title}</h2>
        <span class="badge badge--${badge}">${label}</span>
      </header>
      <dl class="request-card__info">
        <dt>Дата</dt><dd>${date}</dd>
        <dt>Адрес</dt><dd>${addr}</dd>
        <dt>Оплата</dt><dd>${pay}</dd>
      </dl>${reason ? `
      <p class="request-card__reason"><strong>Причина отмены:</strong> ${reason}</p>` : ''}
    </article>`;
  const row = (n, fio, tel, service, date, badge, label) => `      <tr>
        <td data-label="№">${n}</td>
        <td data-label="Клиент">${fio}<br>${tel}</td>
        <td data-label="Услуга">${service}</td>
        <td data-label="Дата">${date}</td>
        <td data-label="Статус"><span class="badge badge--${badge}">${label}</span></td>
        <td data-label="Действие">
          <form class="status-form" action="#" method="post">
            <input type="hidden" name="id" value="${n}">
            <select name="status" aria-label="Новый статус заявки ${n}">
              <option value="work">В работе</option>
              <option value="done">Выполнена</option>
              <option value="cancel">Отменена</option>
            </select>
            <button class="btn" type="submit">Сохранить</button>
          </form>
        </td>
      </tr>`;
  window.COURSE_TASKS.push(
    {
      id: 'w2501', lesson: 'm9-lr13', module: 'mdk93', mech: 'build', title: 'Карточки заявок и бейджи статусов', level: 'Среднее', minutes: 30, points: 150,
      story: 'Страница «Мои заявки» «ЧистоДома»: разметка карточек одинаковая (потом её повторит PHP в цикле), осталось оформление. Главное — бейджи статусов: по цвету и надписи сразу видно, что с заявкой.',
      goal: 'Напишите CSS. .request-card__head — flex: заголовок слева, бейдж справа (justify-content: space-between, align-items: flex-start, gap var(--space-1)). .request-card__title — margin: 0, размер 1.125rem. .request-card__info — Grid с колонками 80px и 1fr, margin: 0, у dd margin: 0, у dt цвет var(--color-muted). .request-card__reason — полоса слева 3px solid var(--status-cancel), фон #fef2f2, padding var(--space-1). .badge — «таблетка»: border-radius: 999px, padding 2px 10px, размер 0.75rem, жирность 600, white-space: nowrap, белый текст. Модификаторы .badge--new, --work, --done, --cancel берут фон из переменных --status-*. Контраст текста каждого бейджа — не ниже 4,5:1: на жёлтом «В работе» белый текст не читается, сделайте его тёмным #1f2937.',
      hints: [
        '.request-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-1); margin-bottom: var(--space-1); }',
        '.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; color: #ffffff; }',
        '.badge--new { background: var(--status-new); } … .badge--work { background: var(--status-work); color: #1f2937; }',
        '.request-card__info { display: grid; grid-template-columns: 80px 1fr; gap: 4px var(--space-1); margin: 0; font-size: var(--fs-small); }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <section class="requests" aria-label="Список заявок">
${card('Генеральная уборка', 'work', 'В работе', '12.11.2026, 10:00', 'ул. Ленина, 5, кв. 12', 'Банковская карта')}
${card('Химчистка ковров', 'cancel', 'Отменена', '03.11.2026, 14:30', 'пр. Мира, 18', 'Наличные', 'нет свободных мастеров на это время')}
${card('Общий клининг', 'done', 'Выполнена', '20.10.2026, 09:00', 'ул. Ленина, 5, кв. 12', 'Наличные')}
${card('Мойка окон', 'new', 'Новая', '25.11.2026, 11:00', 'ул. Ленина, 5, кв. 12', 'Банковская карта')}
  </section>
</main>`,
      css: `${ROOT}
h1 { margin: 0 0 var(--space-2); }
.requests { display: grid; gap: var(--space-2); }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
/* Ниже — элементы карточки и бейджи */
`,
      tests: [
        { name: 'Шапка карточки — flex: заголовок слева, бейдж справа', check: h => {
          if (h.cs('.request-card__head', 'display') !== 'flex') return 'у .request-card__head нет display: flex';
          if (h.cs('.request-card__head', 'justify-content') !== 'space-between') return 'нужно justify-content: space-between';
          if (h.cs('.request-card__head', 'align-items') !== 'flex-start') return 'нужно align-items: flex-start';
          return h.rect('.request-card__head .badge').left > h.rect('.request-card__title').right || 'бейдж должен стоять справа от заголовка';
        } },
        { name: 'Заголовок без отступов, 1.125rem', check: h => h.px('.request-card__title', 'margin-top') === 0 && h.px('.request-card__title', 'font-size') === 18 || 'margin: 0; font-size: 1.125rem' },
        { name: '.badge — «таблетка»: радиус 999px, nowrap, жирность 600, 0.75rem', check: h => {
          if (h.px('.badge', 'border-top-left-radius') < 999) return 'border-radius: 999px';
          if (h.cs('.badge', 'white-space') !== 'nowrap') return 'white-space: nowrap';
          return +h.cs('.badge', 'font-weight') >= 600 && h.px('.badge', 'font-size') === 12 || 'font-weight: 600; font-size: 0.75rem';
        } },
        { name: 'Фон каждого бейджа — из переменной своего статуса', check: h => {
          for (const [m, c] of [['new', '#2563eb'], ['work', '#f59e0b'], ['done', '#15803d'], ['cancel', '#dc2626']])
            if (h.cs('.badge--' + m, 'background-color') !== rgb(c)) return `.badge--${m}: фон var(--status-${m})`;
          return true;
        } },
        { name: 'Текст каждого бейджа читается: контраст не ниже 4,5:1', check: h => {
          for (const b of h.$$('.badge')) { const c = h.contrast(b); if (c != null && c < 4.5) return `«${b.textContent}»: ${c.toFixed(2)}:1`; }
          return true;
        } },
        { name: 'Строки .request-card__info — Grid 80px + 1fr без отступов, dt серые', check: h => {
          if (h.cs('.request-card__info', 'display') !== 'grid' || h.cs('.request-card__info', 'grid-template-columns').split(' ')[0] !== '80px') return 'нужно display: grid; grid-template-columns: 80px 1fr';
          if (h.px('.request-card__info', 'margin-top') !== 0 || h.px('.request-card__info dd', 'margin-left') !== 0) return 'уберите margin у dl и dd';
          return h.cs('.request-card__info dt', 'color') === rgb('#64748b') || 'dt — var(--color-muted)';
        } },
        { name: 'Причина отмены: полоса слева 3px красная, фон #fef2f2', check: h => {
          const s = '.request-card__reason';
          return h.px(s, 'border-left-width') === 3 && h.cs(s, 'border-left-color') === rgb('#dc2626') && h.cs(s, 'background-color') === rgb('#fef2f2') || 'border-left: 3px solid var(--status-cancel); background: #fef2f2';
        } },
        { name: 'Телефон 360px: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'w2502', lesson: 'm9-lr13', module: 'mdk93', mech: 'adaptive', title: 'Админ-таблица: карточки на телефоне', level: 'Сложное', minutes: 30, points: 200,
      story: 'Администратор «ЧистоДома» видит все заявки в таблице и меняет статус прямо в строке. На мониторе таблица хороша, а на телефоне шесть столбцов не помещаются. Превратим строки в карточки, а подписи столбцов возьмём из data-label.',
      goal: 'HTML: каждому <th> в <thead> добавьте scope="col". CSS для всех экранов: .table-wrap — overflow-x: auto; .admin-table — width: 100%, border-collapse: collapse; th и td — padding var(--space-1), text-align: left, нижняя рамка 1px solid var(--color-border). В @media (max-width: 767px): thead спрятать только визуально (position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%) — не display: none); tr — display: block, margin-bottom var(--space-2), белый фон, радиус var(--radius); td — Grid с колонками 90px и 1fr; td::before — content: attr(data-label), жирный, цвет var(--color-muted). На 360px страница не прокручивается вбок, на 1024px таблица остаётся таблицей.',
      hints: [
        '<th scope="col">Клиент</th> — так экранный диктор прочитает «Клиент: Петрова Анна».',
        '.admin-table { width: 100%; border-collapse: collapse; } .admin-table th, .admin-table td { padding: var(--space-1); text-align: left; border-bottom: 1px solid var(--color-border); }',
        '@media (max-width: 767px) { .admin-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } .admin-table tr { display: block; … } .admin-table td { display: grid; grid-template-columns: 90px 1fr; gap: var(--space-1); } }',
        'Подпись: .admin-table td::before { content: attr(data-label); font-weight: 600; color: var(--color-muted); } — тоже внутри медиазапроса.'
      ],
      html: `<main class="page">
  <h1>Панель администратора</h1>
  <div class="table-wrap">
    <table class="admin-table">
      <caption>Все заявки</caption>
      <thead>
        <tr>
          <th>№</th>
          <th>Клиент</th>
          <th>Услуга</th>
          <th>Дата</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
${row(17, 'Петрова Анна Сергеевна', '+7(912)-345-67-89', 'Общий клининг', '15.11.2026 12:00', 'new', 'Новая')}
${row(14, 'Иванов Пётр Алексеевич', '+7(900)-111-22-33', 'Генеральная уборка', '12.11.2026 10:00', 'work', 'В работе')}
      </tbody>
    </table>
  </div>
</main>`,
      css: `${ROOT}
h1 { margin: 0 0 var(--space-2); }
caption { padding-bottom: var(--space-1); font-weight: 700; text-align: left; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; color: #ffffff; }
.badge--new { background: var(--status-new); }
.badge--work { background: var(--status-work); color: #1f2937; }
.status-form { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.btn { min-height: 40px; padding: 0 var(--space-2); border: 0; border-radius: var(--radius); background: #0f766e; color: #ffffff; font: inherit; }
/* Ниже — .table-wrap, .admin-table и медиазапрос для телефона */
`,
      tests: [
        { name: 'Заголовки столбцов: th scope="col"', check: h => h.$$('thead th').every(th => th.getAttribute('scope') === 'col') || 'у каждого th в thead нужен scope="col"' },
        { name: '.table-wrap прокручивает таблицу внутри себя: overflow-x: auto', check: h => h.cs('.table-wrap', 'overflow-x') === 'auto' || 'нужно .table-wrap { overflow-x: auto; }' },
        { name: '1024px: таблица на всю ширину, border-collapse: collapse, ячейки с рамкой снизу', check: h => {
          if (h.cs('.admin-table', 'border-collapse') !== 'collapse') return 'border-collapse: collapse';
          if (Math.abs(h.rect('.admin-table').width - h.rect('.table-wrap').width) > 1) return 'width: 100%';
          return h.px('.admin-table td', 'border-bottom-width') === 1 && h.px('.admin-table td', 'padding-left') === 8 && h.cs('.admin-table th', 'text-align') === 'left' || 'th, td: padding var(--space-1), text-align: left, border-bottom 1px';
        } },
        { name: '1024px: строки остаются строками таблицы, шапка видна', check: h => h.cs('.admin-table tbody tr', 'display') === 'table-row' && h.rect('.admin-table thead').height > 10 || 'на компьютере таблица должна оставаться таблицей: медиазапрос только до 767px' },
        { name: '360px: строка — карточка (display: block), ячейка — Grid 90px + 1fr', at: 360, check: h => {
          if (h.cs('.admin-table tbody tr', 'display') !== 'block') return 'tr: display: block';
          if (h.cs('.admin-table td', 'display') !== 'grid') return 'td: display: grid';
          return h.cs('.admin-table td', 'grid-template-columns').split(' ')[0] === '90px' || 'grid-template-columns: 90px 1fr';
        } },
        { name: '360px: шапка таблицы спрятана только визуально, не display: none', at: 360, check: h => {
          if (h.cs('.admin-table thead', 'display') === 'none') return 'display: none прячет шапку и от экранного диктора';
          return h.rect('.admin-table thead').width <= 1 || 'шапка таблицы видна на телефоне';
        } },
        { name: '360px: подпись ячейки из data-label через ::before', at: 360, check: h => {
          const c = h.win.getComputedStyle(h.$('.admin-table td'), '::before').getPropertyValue('content');
          return h.has(/attr\(\s*data-label\s*\)/) && c && c !== 'none' && c !== 'normal' || 'нужно td::before { content: attr(data-label); }';
        } },
        { name: '360px: нет горизонтальной прокрутки страницы', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
