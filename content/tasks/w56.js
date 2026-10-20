/* Занятие 56. ЛР34. Интеграция дизайна из модуля 2 в систему: сверка с макетом */
(() => {
  window.COURSE_TASKS.push(
    {
      id: 'w5601', lesson: 'm9-lr34', module: 'mdk96', mech: 'build', title: 'Токены и бейджи статусов', level: 'Среднее', minutes: 30, points: 150,
      story: 'Админ-панель портала работает, но на макет не похожа: цвета вписаны «на глаз» в десяти местах, а в таблице видны технические слова new и in_work. Вынесем цвета из стайл-гайда в CSS-переменные и превратим коды статусов в русские бейджи.',
      goal: 'CSS: в :root объявите токены из стайл-гайда: --color-primary: #1f4fb8; --color-text: #1d1f24; --color-muted: #4b5563; --color-bg: #f6f7fb; --color-success: #146c43; --color-warning: #8a5a00; --color-danger: #b42318. Замените ВСЕ hex-цвета в правилах на var(--…); вне :root можно оставить только белый #ffffff. JS: объект STATUS (new → «Новая», badge-new; in_work → «В работе», badge-work; done → «Выполнена», badge-done; cancelled → «Отменена», badge-cancel) и функция renderBadge(el, status): textContent — русское слово, className — «badge » + класс. Для неизвестного статуса — сам код и класс badge (оператор ??). При загрузке пройдите по всем [data-badge] и отрисуйте их.',
      hints: [
        'В начале CSS: :root { --color-primary: #1f4fb8; --color-text: #1d1f24; … } — значения копируйте точно, как из Figma.',
        'Дальше: body { color: var(--color-text); background: var(--color-bg); } .btn-main { background: var(--color-primary); } .badge-done { background: var(--color-success); } и так везде.',
        'const STATUS = { new: { text: \'Новая\', cls: \'badge-new\' }, in_work: { text: \'В работе\', cls: \'badge-work\' }, … };',
        'function renderBadge(el, status) { const s = STATUS[status] ?? { text: status, cls: \'\' }; el.textContent = s.text; el.className = `badge ${s.cls}`; } и document.querySelectorAll(\'[data-badge]\').forEach((b) => renderBadge(b, b.textContent.trim()));'
      ],
      html: `<header class="top">
  <a class="logo" href="#requests">Чистый дом</a>
</header>
<main class="admin" id="requests">
  <h1>Заявки</h1>
  <table class="table">
    <thead>
      <tr><th>№</th><th>Клиент</th><th>Статус</th></tr>
    </thead>
    <tbody>
      <tr><td>12</td><td>Иванова Анна</td><td><span class="badge" data-badge>new</span></td></tr>
      <tr><td>13</td><td>Петров Пётр</td><td><span class="badge" data-badge>in_work</span></td></tr>
      <tr><td>14</td><td>Сидорова Мария</td><td><span class="badge" data-badge>done</span></td></tr>
      <tr><td>15</td><td>Ёлкин Олег</td><td><span class="badge" data-badge>cancelled</span></td></tr>
    </tbody>
  </table>
  <button class="btn-main" type="button">Обновить список</button>
</main>`,
      css: `body { margin: 0; font-family: Arial, sans-serif; color: #1d1f24; background: #f6f7fb; }
.top { padding: 12px 16px; background: #1f4fb8; }
.logo { color: #ffffff; font-weight: 700; text-decoration: none; }
.admin { padding: 16px; }
.table { width: 100%; border-collapse: collapse; background: #ffffff; }
.table th, .table td { padding: 8px; border-bottom: 1px solid #d0d5dd; text-align: left; }
.table th { color: #4b5563; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #4b5563; color: #ffffff; font-size: 14px; }
.badge-new { background: #1f4fb8; }
.badge-work { background: #8a5a00; }
.badge-done { background: #146c43; }
.badge-cancel { background: #4b5563; }
.btn-main { margin-top: 16px; padding: 8px 16px; border: 0; border-radius: 12px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
.btn-main:hover { background: #1d1f24; }`,
      js: `// js/statuses.js
// 1. STATUS: код статуса → русский текст и класс бейджа

// 2. renderBadge(el, status)

// 3. При загрузке отрисовать все [data-badge]
`,
      tests: [
        { name: 'В :root объявлены все семь токенов с точными значениями', check: h => {
          const want = { primary: '#1f4fb8', text: '#1d1f24', muted: '#4b5563', bg: '#f6f7fb', success: '#146c43', warning: '#8a5a00', danger: '#b42318' };
          const cs = h.win.getComputedStyle(h.doc.documentElement);
          for (const [k, v] of Object.entries(want)) {
            const got = cs.getPropertyValue('--color-' + k).trim().toLowerCase();
            if (got !== v) return `--color-${k}: ${got || 'не задан'}, нужно ${v}`;
          }
          return true;
        } },
        { name: 'Вне :root нет hex-цветов, кроме белого', check: h => {
          const rest = h.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
          const bad = (rest.match(/#[0-9a-f]{3,8}\b/gi) || []).filter(c => !/^#(fff|ffffff)$/i.test(c));
          return !bad.length || `ещё вписаны цвета: ${[...new Set(bad)].join(', ')} — замените на var(--…)`;
        } },
        { name: 'Цвета на странице не изменились после перехода на токены', check: h => {
          if (h.cs('.btn-main', 'background-color') !== 'rgb(31, 79, 184)') return 'у .btn-main должен быть цвет --color-primary';
          if (h.cs('body', 'background-color') !== 'rgb(246, 247, 251)') return 'фон страницы — --color-bg';
          return h.cs('body', 'color') === 'rgb(29, 31, 36)' || 'цвет текста — --color-text';
        } },
        { name: 'После загрузки бейджи на русском, кодов статусов не видно', js: true, check: h => {
          const t = h.$$('[data-badge]').map(b => h.text(b)).join(', ');
          return t === 'Новая, В работе, Выполнена, Отменена' || `сейчас: ${t}`;
        } },
        { name: 'Классы и цвета бейджей как в макете', js: true, check: h => {
          const b = h.$$('[data-badge]');
          const cls = b.map(x => x.className).join(' | ');
          if (cls !== 'badge badge-new | badge badge-work | badge badge-done | badge badge-cancel') return `классы: ${cls}`;
          return h.cs(b[1], 'background-color') === 'rgb(138, 90, 0)' && h.cs(b[2], 'background-color') === 'rgb(20, 108, 67)' || 'цвета бейджей не совпадают с токенами';
        } },
        { name: 'Неизвестный статус не ломает интерфейс', js: true, check: h => {
          const f = h.get('renderBadge'); if (typeof f !== 'function') return 'нет функции renderBadge';
          const el = h.$('[data-badge]'); f(el, 'archived');
          if (h.errors.length) return h.errors[0];
          return h.text(el) === 'archived' && el.className.trim() === 'badge' || `текст «${h.text(el)}», классы «${el.className}»`;
        } }
      ]
    }
  );
})();
