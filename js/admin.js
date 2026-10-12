/* Админ-панель: общий каркас (роутинг по #разделу, модальные окна, уведомления),
   дашборд, пользователи и логи. Разделы с CRUD регистрируются в admin-crud.js. */
(() => {
  const S = window.AdminStore;
  const { svg, C } = window.Ash;
  const sfx = window.Ash.sfx || {};
  const ICONS = window.ASH_ICONS, RARITY = window.ASH_RARITY;
  const $ = id => document.getElementById(id);

  /* ---------- форматирование ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('ru-RU');
  const dateStr = iso => iso ? new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const timeStr = iso => new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  function ago(iso) {
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 1) return 'только что';
    if (m < 60) return `${m} мин назад`;
    const h = Math.round(m / 60); if (h < 24) return `${h} ч назад`;
    const d = Math.round(h / 24); return `${d} дн назад`;
  }
  const daysLeft = iso => Math.ceil((new Date(iso + 'T23:59:59') - Date.now()) / 864e5);
  const icon = (key, pal, s = 4) => {
    const rows = typeof ICONS[key] === 'function' ? ICONS[key](window.Ash.S) : ICONS[key];
    return rows ? svg(rows, pal, s) : '';
  };
  const achIcon = (a, s = 4) => {
    const r = RARITY[a.rarity] || RARITY.common;
    const pal = a.icon === 'slug' ? { G: '#8db85a', g: '#4e6e33', k: '#111', w: '#e6f0c0' } : a.icon === 'flame' ? { Y: C.emberHi, O: C.ember } : { X: r.c, Y: r.d };
    return icon(a.icon, pal, a.icon === 'slug' ? 3 : s);
  };
  const ROLES = { student: 'Студент', teacher: 'Преподаватель', admin: 'Администратор' };
  const LEVELS = [{ title: 'Новичок', xp: 0 }, { title: 'Джун', xp: 1000 }, { title: 'Мидл', xp: 3000 }, { title: 'Сеньор', xp: 6000 }];
  const level = xp => LEVELS.filter(l => xp >= l.xp).pop().title;
  const userName = id => (S.byId('users', id) || { name: 'Удалённый пользователь' }).name;
  const totalLessons = () => S.db.modules.reduce((a, m) => a + m.lessons, 0);
  const userDone = u => Object.values(u.progress || {}).reduce((a, b) => a + b, 0);
  const bar = (pct, cls = 'hp', extra = '') => `<span class="bar ${cls} ${extra}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="--w:${pct}%"></i></span>`;

  /* ---------- уведомление ---------- */
  let toastTimer;
  function toast(text) {
    const t = $('toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- модальное окно ----------
     modal({ title, body, actions: [{ label, value, kind, primary }], onSubmit }) → Promise со значением нажатой кнопки.
     onSubmit(value) может вернуть строку ошибки — тогда окно не закроется. */
  const dlg = $('modal');
  function modal({ title, body, actions = [{ label: 'ЗАКРЫТЬ', value: 'close' }], onSubmit }) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = body;
    $('modal-note').textContent = '';
    $('modal-actions').innerHTML = actions.map(a =>
      `<button type="${a.primary ? 'submit' : 'button'}" class="btn ${a.kind || ''}" data-val="${a.value}">${a.label}</button>`).join('');
    return new Promise(resolve => {
      const finish = v => { cleanup(); if (dlg.open) dlg.close(); resolve(v); };
      const onClick = async e => {
        const b = e.target.closest('[data-val]');
        if (b && b.type !== 'submit') { e.preventDefault(); handle(b.dataset.val); }
        if (e.target.closest('#modal-x')) { e.preventDefault(); finish(null); }
      };
      const onSub = e => { e.preventDefault(); const b = e.submitter || $('modal-actions').querySelector('[type=submit]'); handle(b ? b.dataset.val : 'ok'); };
      const handle = v => {
        if (onSubmit && v !== 'cancel' && v !== 'close') {
          const err = onSubmit(v);
          if (err) { $('modal-note').textContent = err; if (sfx.error) sfx.error(); return; }
        }
        finish(v);
      };
      const onCancel = e => { e.preventDefault(); finish(null); };
      function cleanup() { dlg.removeEventListener('click', onClick); $('modal-form').removeEventListener('submit', onSub); dlg.removeEventListener('cancel', onCancel); }
      dlg.addEventListener('click', onClick); $('modal-form').addEventListener('submit', onSub); dlg.addEventListener('cancel', onCancel);
      dlg.showModal();
      const first = $('modal-body').querySelector('input:not([type=checkbox]):not([type=radio]), select, textarea');
      if (first) first.focus();
    });
  }
  async function confirmBox(title, text, okLabel = 'УДАЛИТЬ') {
    const v = await modal({ title, body: `<p>${text}</p>`, actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: okLabel, value: 'ok', kind: 'danger', primary: true }] });
    return v === 'ok';
  }

  /* ---------- роутинг ---------- */
  const views = {};
  const state = {}; // фильтры и поиск по разделам, чтобы не сбрасывались при перерисовке
  function register(name, render) { views[name] = render; }
  function current() { const h = location.hash.slice(1); return views[h] ? h : 'dashboard'; }
  function render() {
    const name = current();
    document.querySelectorAll('#side-nav a').forEach(a => {
      const on = a.dataset.v === name; a.classList.toggle('on', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    const old = $('view');
    const focused = document.activeElement && old.contains(document.activeElement) ? document.activeElement.id : null;
    const caret = focused && document.activeElement.selectionStart;
    // Новый пустой контейнер на каждую перерисовку, чтобы обработчики кликов не копились
    const view = old.cloneNode(false); old.replaceWith(view);
    views[name](view, state[name] = state[name] || {});
    if (focused && $(focused)) { const el = $(focused); el.focus(); if (caret != null && el.setSelectionRange) el.setSelectionRange(caret, caret); }
    document.title = (document.querySelector(`#side-nav a[data-v="${name}"]`)?.textContent || 'Админка') + ' · Админ-панель';
  }
  addEventListener('hashchange', () => { render(); scrollTo({ top: 0 }); });
  S.on(render);
  $('reset-demo').addEventListener('click', async () => {
    if (await confirmBox('Сбросить демо-данные?', 'Все изменения на сервере пропадут у всех: аккаунты, прогресс, загруженные лекции. Вернутся исходные примеры.', 'СБРОСИТЬ')) { S.resetDemo(); toast('Возвращаю демо-данные…'); }
  });

  /* ================= ДАШБОРД ================= */
  register('dashboard', (root) => {
    const db = S.db;
    const students = db.users.filter(u => u.role === 'student');
    const week = Date.now() - 7 * 864e5;
    const active = students.filter(u => new Date(u.lastSeen) > week);
    const weekPurch = db.purchases.filter(p => new Date(p.date) > week);
    const weekErr = db.logs.filter(l => l.kind === 'error' && new Date(l.date) > week);

    // Активность за 7 дней: уникальные пользователи в логах по дням
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return d; });
    const perDay = days.map(d => { const next = +d + 864e5; return new Set(db.logs.filter(l => +new Date(l.date) >= +d && +new Date(l.date) < next).map(l => l.user)).size; });
    const maxDay = Math.max(1, ...perDay);

    // Средний прогресс по модулям среди студентов групп, где модуль назначен
    const modStats = db.modules.map(m => {
      const inGroups = students.filter(u => (S.byId('groups', u.group)?.modules || []).includes(m.id));
      const avg = inGroups.length ? inGroups.reduce((a, u) => a + (u.progress[m.id] || 0) / m.lessons, 0) / inGroups.length * 100 : 0;
      return { m, avg, n: inGroups.length };
    });
    const top = [...students].sort((a, b) => b.xp - a.xp).slice(0, 5);
    const recent = db.purchases.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

    root.innerHTML = `
      <div class="view-head"><h1>Дашборд</h1><span class="count">сводка по платформе</span></div>
      <div class="tiles">
        <div class="tile good"><span class="eyebrow">Активны за 7 дней</span><p class="big">${active.length}</p><p class="small">из ${students.length} студентов</p></div>
        <div class="tile"><span class="eyebrow">Групп</span><p class="big">${db.groups.length}</p><p class="small">${db.courses.length} курсов, ${db.modules.length} модулей</p></div>
        <div class="tile gold"><span class="eyebrow">Покупок за неделю</span><p class="big">${weekPurch.length}</p><p class="small">${fmt(weekPurch.reduce((a, p) => a + p.price, 0))} душ потрачено</p></div>
        <div class="tile ${weekErr.length ? 'bad' : ''}"><span class="eyebrow">Ошибок автопроверки</span><p class="big">${weekErr.length}</p><p class="small">за 7 дней · <a href="#logs" data-logs-kind="error">открыть</a></p></div>
      </div>
      <div class="dash">
        <section class="plate">
          <div class="plate-head"><h2>Активность</h2><p class="plate-sub">уникальные пользователи по дням</p></div>
          <div class="activity">${perDay.map((n, i) => `<div><b>${n}</b><i style="height:${Math.max(4, n / maxDay * 100)}%"></i><span>${days[i].toLocaleDateString('ru-RU', { weekday: 'short' })}</span></div>`).join('')}</div>
        </section>
        <section class="plate">
          <div class="plate-head"><h2>Прогресс по модулям</h2><p class="plate-sub">средний по студентам</p></div>
          <div class="mod-rows">${modStats.map(s => `<div class="mod-row"><span>${esc(s.m.title)}</span><span class="stat-val">${s.n ? Math.round(s.avg) + '%' : 'не назначен'}</span>${bar(s.avg)}</div>`).join('')}</div>
        </section>
        <section class="plate">
          <div class="plate-head"><h2>Топ студентов</h2><p class="plate-sub">по опыту</p></div>
          <ol class="rank-list">${top.map((u, i) => `<li><span class="pos">${i + 1}</span><div class="who-n"><p>${esc(u.name)}</p><small>${esc(S.byId('groups', u.group)?.code || 'без группы')} · ${level(u.xp)}</small></div><span class="val">${fmt(u.xp)} XP<small>${fmt(u.souls)} душ</small></span></li>`).join('')}</ol>
        </section>
        <section class="plate">
          <div class="plate-head"><h2>Последние покупки</h2><p class="plate-sub"><a href="#shop">магазин</a></p></div>
          <ol class="rank-list">${recent.map(p => `<li><span class="pos">${icon('soul', { Y: '#7fb0ff', W: '#e8f1ff' }, 3)}</span><div class="who-n"><p>${esc(S.byId('shop', p.item)?.title || 'Удалённый товар')}</p><small>${esc(userName(p.user))} · ${ago(p.date)}</small></div><span class="val">${fmt(p.price)}<small>душ</small></span></li>`).join('') || '<li class="empty">Покупок пока нет</li>'}</ol>
        </section>
      </div>`;
    root.querySelector('[data-logs-kind]')?.addEventListener('click', () => { state.logs = { ...(state.logs || {}), kind: 'error' }; });
  });

  /* ================= ПОЛЬЗОВАТЕЛИ ================= */
  register('users', (root, st) => {
    const db = S.db;
    st.q ??= ''; st.role ??= 'all'; st.group ??= 'all'; st.sort ??= 'xp';
    const q = st.q.trim().toLowerCase();
    let list = db.users.filter(u =>
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (st.role === 'all' || u.role === st.role) &&
      (st.group === 'all' || (st.group === 'none' ? !u.group : u.group === st.group)));
    const sorters = { xp: (a, b) => b.xp - a.xp, name: (a, b) => a.name.localeCompare(b.name, 'ru'), seen: (a, b) => b.lastSeen.localeCompare(a.lastSeen), souls: (a, b) => b.souls - a.souls };
    list.sort(sorters[st.sort]);
    const total = totalLessons();
    const opt = (v, l, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${l}</option>`;

    root.innerHTML = `
      <div class="view-head"><h1>Пользователи</h1><span class="count">найдено ${list.length} из ${db.users.length}</span></div>
      <section class="plate">
        <div class="toolbar">
          <input class="sel search" id="u-q" type="search" placeholder="Поиск по имени или e-mail" aria-label="Поиск по имени или e-mail" value="${esc(st.q)}">
          <select id="u-role" aria-label="Роль">${opt('all', 'Все роли', st.role)}${Object.entries(ROLES).map(([k, v]) => opt(k, v, st.role)).join('')}</select>
          <select id="u-group" aria-label="Группа">${opt('all', 'Все группы', st.group)}${db.groups.map(g => opt(g.id, g.code, st.group)).join('')}${opt('none', 'Без группы', st.group)}</select>
          <select id="u-sort" aria-label="Сортировка">${opt('xp', 'По опыту', st.sort)}${opt('souls', 'По душам', st.sort)}${opt('seen', 'По активности', st.sort)}${opt('name', 'По имени', st.sort)}</select>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Пользователь</th><th>Роль</th><th>Группа</th><th class="num">Опыт</th><th>Прогресс</th><th>Был в сети</th><th class="acts"><span class="sr">Действия</span></th></tr></thead>
            <tbody>${list.map(u => {
              const pct = total ? userDone(u) / total * 100 : 0;
              const live = Date.now() - new Date(u.lastSeen) < 864e5;
              return `<tr>
                <td>${esc(u.name)}<small>${esc(u.email)}</small></td>
                <td><select class="sel" data-role="${u.id}" aria-label="Роль: ${esc(u.name)}">${Object.entries(ROLES).map(([k, v]) => opt(k, v, u.role)).join('')}</select></td>
                <td>${esc(S.byId('groups', u.group)?.code || '—')}</td>
                <td class="num">${fmt(u.xp)}<small>${level(u.xp)}</small></td>
                <td>${u.role === 'student' ? `${bar(pct, 'hp', 'mini-bar')} <small>${Math.round(pct)}%</small>` : '<small>—</small>'}</td>
                <td><span class="dot${live ? ' live' : ''}"></span>${ago(u.lastSeen)}</td>
                <td class="acts"><button type="button" class="act" data-open="${u.id}">Открыть</button><button type="button" class="act" data-grant="${u.id}">Достижение</button><button type="button" class="act danger" data-reset="${u.id}">Сброс</button></td>
              </tr>`; }).join('') || `<tr><td colspan="7" class="empty">Никого не нашлось. Попробуйте другой запрос или фильтр.</td></tr>`}</tbody>
          </table>
        </div>
      </section>`;

    $('u-q').addEventListener('input', e => { st.q = e.target.value; render(); });
    $('u-role').addEventListener('change', e => { st.role = e.target.value; render(); });
    $('u-group').addEventListener('change', e => { st.group = e.target.value; render(); });
    $('u-sort').addEventListener('change', e => { st.sort = e.target.value; render(); });
    root.querySelectorAll('[data-role]').forEach(s => s.addEventListener('change', () => {
      const u = S.byId('users', s.dataset.role);
      S.setRole(u.id, s.value); toast(`Роль «${u.name}»: ${ROLES[s.value]}.`);
    }));
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-open],[data-grant],[data-reset]'); if (!b) return;
      if (b.dataset.open) openUser(b.dataset.open);
      if (b.dataset.grant) grant(b.dataset.grant);
      if (b.dataset.reset) resetUser(b.dataset.reset);
    });
  });

  async function resetUser(id) {
    const u = S.byId('users', id);
    if (await confirmBox('Сбросить прогресс?', `У «${esc(u.name)}» обнулятся пройденные уроки и опыт. Души и достижения останутся.`, 'СБРОСИТЬ')) {
      S.resetProgress(id); if (sfx.death) sfx.death(); toast(`Прогресс «${u.name}» сброшен.`);
    }
  }
  async function grant(id) {
    const u = S.byId('users', id);
    const has = new Set(u.achievements.map(a => a.id));
    const free = S.db.achievements.filter(a => !has.has(a.id));
    if (!free.length) { toast(`У «${u.name}» уже есть все достижения.`); return; }
    const v = await modal({
      title: 'Выдать достижение',
      body: `<p>Кому: <b>${esc(u.name)}</b></p><div class="form"><div class="f full"><span class="lbl">Достижение</span><div class="checks" role="radiogroup">${free.map((a, i) =>
        `<label><input type="radio" name="ach" value="${a.id}"${i === 0 ? ' checked' : ''}> ${achIcon(a, 3)} ${esc(a.title)} <small class="hint">${RARITY[a.rarity].label}, +${fmt(a.reward)} душ</small></label>`).join('')}</div></div></div>`,
      actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: 'ВЫДАТЬ', value: 'ok', primary: true }]
    });
    if (v !== 'ok') return;
    const achId = document.querySelector('#modal-body input[name=ach]:checked')?.value;
    const a = S.byId('achievements', achId);
    if (a && S.grantAchievement(id, achId)) { if (sfx.lit) sfx.lit(); toast(`«${u.name}» получает «${a.title}».`); }
  }
  function openUser(id) {
    const u = S.byId('users', id), g = S.byId('groups', u.group);
    const mods = S.db.modules.map(m => { const d = u.progress[m.id] || 0; return `<div class="mod-row"><span>${esc(m.title)}</span><span class="stat-val">${d} / ${m.lessons}</span>${bar(d / m.lessons * 100)}</div>`; }).join('');
    const ach = u.achievements.map(x => { const a = S.byId('achievements', x.id); if (!a) return ''; return `<span style="--r:${RARITY[a.rarity].c}">${achIcon(a, 3)}${esc(a.title)} <small class="hint">${dateStr(x.date)}</small></span>`; }).join('') || '<p class="hint">Пока нет достижений.</p>';
    const tx = S.db.logs.filter(l => l.kind === 'transaction' && l.user === id).slice(0, 5)
      .map(l => `<tr><td class="date">${timeStr(l.date)}</td><td>${esc(l.text)}</td><td class="num ${l.amount < 0 ? 'minus' : 'plus'}">${l.amount > 0 ? '+' : '−'}${fmt(Math.abs(l.amount))}</td></tr>`).join('');
    modal({
      title: u.name,
      body: `
        <div class="u-head"><div class="avatar">${icon('avatar', { X: '#9a93a6', Y: '#0a090c', R: '#8e1b1b', P: C.ember }, 4)}</div>
          <div><p>${esc(u.email)}</p><p class="hint">${ROLES[u.role]} · ${esc(g ? g.code + ', ' + g.title : 'без группы')}</p></div></div>
        <div class="kv">
          <div><span class="eyebrow">Уровень</span><p>${level(u.xp)}</p></div>
          <div><span class="eyebrow">Опыт</span><p>${fmt(u.xp)} XP</p></div>
          <div><span class="eyebrow">Души</span><p>${fmt(u.souls)}</p></div>
          <div><span class="eyebrow">Был в сети</span><p>${ago(u.lastSeen)}</p></div>
        </div>
        <span class="eyebrow">Прогресс по модулям</span><div class="mod-rows">${mods}</div>
        <span class="eyebrow">Достижения</span><div class="badges">${ach}</div>
        ${tx ? `<span class="eyebrow">Последние транзакции</span><div class="table-wrap"><table class="data-table" style="min-width:0"><tbody>${tx}</tbody></table></div>` : ''}`,
      actions: [{ label: 'СБРОСИТЬ ПРОГРЕСС', value: 'reset', kind: 'danger' }, { label: 'ВЫДАТЬ ДОСТИЖЕНИЕ', value: 'grant', kind: 'ghost' }, { label: 'ЗАКРЫТЬ', value: 'close', primary: true }]
    }).then(v => { if (v === 'reset') resetUser(id); if (v === 'grant') grant(id); });
  }

  /* ================= ЛОГИ ================= */
  register('logs', (root, st) => {
    const db = S.db;
    st.kind ??= 'all'; st.q ??= ''; st.limit ??= 40;
    const KINDS = { all: 'Все', action: 'Действия', error: 'Ошибки автопроверки', transaction: 'Транзакции' };
    const LABEL = { action: 'Действие', error: 'Ошибка', transaction: 'Транзакция' };
    const q = st.q.trim().toLowerCase();
    const list = db.logs.filter(l => (st.kind === 'all' || l.kind === st.kind) &&
      (!q || l.text.toLowerCase().includes(q) || userName(l.user).toLowerCase().includes(q)));
    const counts = Object.fromEntries(Object.keys(KINDS).map(k => [k, k === 'all' ? db.logs.length : db.logs.filter(l => l.kind === k).length]));
    const sum = list.filter(l => l.kind === 'transaction').reduce((a, l) => a + l.amount, 0);

    root.innerHTML = `
      <div class="view-head"><h1>Логи и события</h1><span class="count">${list.length} записей${st.kind === 'transaction' ? ` · баланс ${sum >= 0 ? '+' : '−'}${fmt(Math.abs(sum))} душ` : ''}</span></div>
      <section class="plate">
        <div class="toolbar">
          <div class="chips" role="group" aria-label="Тип события" style="margin-left:0">${Object.entries(KINDS).map(([k, v]) =>
            `<button type="button" class="chip${st.kind === k ? ' on' : ''}" aria-pressed="${st.kind === k}" data-kind="${k}">${v} · ${counts[k]}</button>`).join('')}</div>
          <input class="sel search" id="l-q" type="search" placeholder="Поиск по тексту или имени" aria-label="Поиск по логам" value="${esc(st.q)}">
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Время</th><th>Тип</th><th>Пользователь</th><th>Событие</th><th class="num">Сумма</th></tr></thead>
            <tbody>${list.slice(0, st.limit).map(l => `<tr>
              <td class="date">${timeStr(l.date)}</td>
              <td><span class="pill ${l.kind}">${LABEL[l.kind]}</span></td>
              <td>${esc(userName(l.user))}</td>
              <td>${esc(l.text)}${l.task ? `<small>Задание: ${esc(S.byId('tasks', l.task)?.title || 'удалено')}</small>` : ''}</td>
              <td class="num">${l.kind === 'transaction' ? `<span class="${l.amount < 0 ? 'minus' : 'plus'}">${l.amount > 0 ? '+' : '−'}${fmt(Math.abs(l.amount))}</span>` : '<span class="zero">—</span>'}</td>
            </tr>`).join('') || '<tr><td colspan="5" class="empty">Событий не найдено.</td></tr>'}</tbody>
          </table>
        </div>
        ${list.length > st.limit ? `<div class="more"><button type="button" class="btn ghost" id="l-more">ПОКАЗАТЬ ЕЩЁ ${Math.min(40, list.length - st.limit)}</button></div>` : ''}
      </section>`;
    root.querySelectorAll('[data-kind]').forEach(b => b.addEventListener('click', () => { st.kind = b.dataset.kind; st.limit = 40; render(); }));
    $('l-q').addEventListener('input', e => { st.q = e.target.value; st.limit = 40; render(); });
    $('l-more')?.addEventListener('click', () => { st.limit += 40; render(); });
  });

  // Общие функции для admin-crud.js
  window.Admin = { register, render, modal, confirmBox, toast, esc, fmt, dateStr, daysLeft, achIcon, icon, bar, state, userName, RARITY, ROLES };
  document.addEventListener('DOMContentLoaded', render);
})();
