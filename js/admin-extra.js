/* Админка: заявки студентов на курсы и уроки групп.
   Заявки проверяются каждые 30 секунд, пока админка открыта: новая заявка — уведомление и счётчик в меню.
   Уроки групп: преподаватель добавляет группе уроки и разрешает их проходить (правило — в js/student-logic.js). */
(() => {
  const S = window.AdminStore, A = window.Admin;
  const { esc, timeStr, ago, toast, render } = A;
  const sfx = window.Ash.sfx || {};
  const $ = id => document.getElementById(id);
  const courseTitle = id => S.byId('courses', id)?.title || 'удалённый курс';

  /* ================= ЗАЯВКИ ================= */
  // Счётчик новых заявок в меню и в заголовке вкладки
  function badge() {
    const n = S.pending().length;
    const link = document.querySelector('#side-nav a[data-v="requests"]');
    if (link) link.innerHTML = `Заявки${n ? ` <span class="nav-badge" aria-label="${n} новых">${n}</span>` : ''}`;
    document.title = document.title.replace(/^\(\d+\) /, '');
    if (n) document.title = `(${n}) ${document.title}`;
  }
  S.on(badge);
  addEventListener('hashchange', badge);

  A.register('requests', (root, st) => {
    st.show ??= 'pending';
    const all = S.db.requests || [];
    const list = st.show === 'pending' ? all.filter(r => r.status === 'pending') : all;
    const STATUS = { pending: ['soon', 'ждёт ответа'], approved: ['on', 'курс открыт'], declined: ['late', 'отклонена'] };
    root.innerHTML = `
      <div class="view-head"><h1>Заявки на курсы</h1><span class="count">${S.pending().length} ждут ответа</span></div>
      <section class="plate">
        <div class="toolbar"><div class="chips" role="group" aria-label="Какие заявки показать" style="margin-left:0">
          <button type="button" class="chip${st.show === 'pending' ? ' on' : ''}" aria-pressed="${st.show === 'pending'}" data-show="pending">Новые · ${S.pending().length}</button>
          <button type="button" class="chip${st.show === 'all' ? ' on' : ''}" aria-pressed="${st.show === 'all'}" data-show="all">Все · ${all.length}</button>
        </div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Когда</th><th>Студент</th><th>Курс</th><th>Статус</th><th class="acts"><span class="sr">Действия</span></th></tr></thead>
            <tbody>${list.map(r => {
              const u = S.byId('users', r.user), g = u && S.byId('groups', u.group), [cls, txt] = STATUS[r.status];
              return `<tr>
                <td class="date">${timeStr(r.date)}<small>${ago(r.date)}</small></td>
                <td>${esc(u?.name || 'удалённый пользователь')}<small>${esc(g ? g.code : 'без группы')}</small></td>
                <td>${esc(courseTitle(r.course))}</td>
                <td><span class="pill ${cls}">${txt}</span>${r.decided ? `<small>${ago(r.decided)}</small>` : ''}</td>
                <td class="acts">${r.status === 'pending' ? `<button type="button" class="act" data-ok="${r.id}">Открыть курс</button><button type="button" class="act danger" data-no="${r.id}">Отклонить</button>` : ''}</td>
              </tr>`; }).join('') || `<tr><td colspan="5" class="empty">${st.show === 'pending' ? 'Новых заявок нет. Когда студент попросит открыть курс, заявка появится здесь.' : 'Заявок пока не было.'}</td></tr>`}</tbody>
          </table>
        </div>
        <p class="hint">«Открыть курс» даёт доступ этому студенту лично. Чтобы открыть курс всей группе, отметьте его в разделе «Группы».</p>
      </section>`;
    root.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => { st.show = b.dataset.show; render(); }));
    root.addEventListener('click', async e => {
      const b = e.target.closest('[data-ok],[data-no]'); if (!b) return;
      b.disabled = true;
      const id = b.dataset.ok || b.dataset.no, r = S.db.requests.find(x => x.id === id), u = S.byId('users', r.user);
      if (await S.decideRequest(id, b.dataset.ok ? 'approve' : 'decline')) {
        if (b.dataset.ok) { if (sfx.lit) sfx.lit(); toast(`«${u?.name}» получил доступ к курсу «${courseTitle(r.course)}».`); }
        else toast(`Заявка «${u?.name}» отклонена.`);
      }
    });
  });

  // Новые заявки, пока админка открыта
  async function poll() {
    if (document.hidden) return;
    const fresh = (await S.pollRequests()).filter(r => r.status === 'pending');
    if (!fresh.length) return;
    const r = fresh[0], u = S.byId('users', r.user);
    toast(fresh.length === 1 ? `Новая заявка: «${u?.name || 'студент'}» просит открыть «${courseTitle(r.course)}».` : `Новых заявок: ${fresh.length}. Откройте раздел «Заявки».`);
    if (sfx.lit) sfx.lit();
  }
  setInterval(poll, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });

  /* ================= УРОКИ ГРУПП ================= */
  const Logic = window.StudentLogic;
  // Списки группы; у группы, которую ещё не настраивали, берём то, что ей сейчас открыто по старому правилу
  function lists(g) {
    const all = S.db.lessonList || [];
    if (Array.isArray(g.lessons)) return { lessons: g.lessons.slice(), open: (g.lessonsOpen || []).slice(), legacy: false };
    const open = all.filter(l => Logic.lessonAccess(l, g, 'student') === 'open').map(l => l.id);
    return { lessons: open.slice(), open, legacy: true };
  }
  function save(g, lessons, open, text) {
    const keep = new Set(lessons);
    S.update('groups', g.id, { lessons: [...keep], lessonsOpen: [...new Set(open)].filter(id => keep.has(id)) }, 'уроки группы');
    toast(text);
  }

  A.register('lessons', (root, st) => {
    const groups = S.db.groups;
    if (!groups.length) { root.innerHTML = '<div class="view-head"><h1>Уроки групп</h1></div><section class="plate"><p class="empty">Сначала создайте группу в разделе «Группы».</p></section>'; return; }
    if (!groups.some(g => g.id === st.group)) st.group = groups[0].id;
    const g = S.byId('groups', st.group), L = lists(g);
    const all = S.db.lessonList || [];
    const mods = [...new Set(all.map(l => l.module))];
    const added = new Set(L.lessons), open = new Set(L.open);
    const students = S.db.users.filter(u => u.group === g.id && u.role === 'student').length;
    root.innerHTML = `
      <div class="view-head"><h1>Уроки групп</h1><span class="count">добавлено ${added.size} из ${all.length}, можно проходить ${open.size}</span></div>
      <section class="plate">
        <div class="toolbar lg-tools">
          <select class="sel" id="lg-group" aria-label="Группа">${groups.map(x => `<option value="${x.id}"${x.id === g.id ? ' selected' : ''}>${esc(x.code)} · ${esc(x.title)}</option>`).join('')}</select>
          <button type="button" class="btn ghost" id="lg-add-all">ДОБАВИТЬ ВСЕ</button>
          <button type="button" class="btn ghost" id="lg-open-all">РАЗРЕШИТЬ ВСЕ ДОБАВЛЕННЫЕ</button>
          <button type="button" class="btn ghost" id="lg-close-all">ЗАКРЫТЬ ВСЕ</button>
        </div>
        <p class="hint">${students} студентов в группе. «В группе» — студенты видят урок в списке. «Можно проходить» — урок открыт: можно читать, решать квиз и получать награду. Без разрешения урок виден с замком.</p>
        ${L.legacy ? '<p class="hint lg-legacy">Эту группу ещё не настраивали: сейчас ей открыты уроки, у которых в описании не указаны группы. Первое изменение сохранит собственный список группы.</p>' : ''}
        ${mods.map(m => {
          const ls = all.filter(l => l.module === m).sort((a, b) => a.lesson - b.lesson);
          return `<div class="lg-mod"><div class="lg-mod-head"><h2>${esc(S.byId('modules', m)?.title || 'Модуль ' + m.slice(1))}</h2>
              <button type="button" class="act" data-mod-add="${m}">Добавить модуль</button><button type="button" class="act" data-mod-open="${m}">Разрешить модуль</button></div>
            <div class="table-wrap"><table class="data-table">
              <thead><tr><th>Урок</th><th>В группе</th><th>Можно проходить</th></tr></thead>
              <tbody>${ls.map(l => `<tr>
                <td>${l.lesson}. ${esc(l.title)}</td>
                <td><label class="check"><input type="checkbox" data-add="${l.id}"${added.has(l.id) ? ' checked' : ''}> <span class="sr">Добавить «${esc(l.title)}» группе</span></label></td>
                <td><label class="check"><input type="checkbox" data-open="${l.id}"${open.has(l.id) ? ' checked' : ''}${added.has(l.id) ? '' : ' disabled'}> <span class="sr">Разрешить «${esc(l.title)}»</span></label></td>
              </tr>`).join('')}</tbody>
            </table></div></div>`;
        }).join('') || '<p class="empty">Уроков пока нет.</p>'}
      </section>`;
    $('lg-group').addEventListener('change', e => { st.group = e.target.value; render(); });
    const ids = all.map(l => l.id), modIds = m => all.filter(l => l.module === m).map(l => l.id);
    $('lg-add-all').addEventListener('click', () => save(g, ids, L.open, `Группе ${g.code} добавлены все уроки.`));
    $('lg-open-all').addEventListener('click', () => save(g, L.lessons, L.lessons, `Группе ${g.code} разрешены все добавленные уроки.`));
    $('lg-close-all').addEventListener('click', () => save(g, L.lessons, [], `Уроки группы ${g.code} закрыты, в списке они остались.`));
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-mod-add],[data-mod-open]'); if (!b) return;
      if (b.dataset.modAdd) save(g, [...L.lessons, ...modIds(b.dataset.modAdd)], L.open, 'Модуль добавлен группе.');
      else { const m = modIds(b.dataset.modOpen); save(g, [...L.lessons, ...m], [...L.open, ...m], 'Модуль разрешён группе.'); }
    });
    root.addEventListener('change', e => {
      const c = e.target; const id = c.dataset.add || c.dataset.open; if (!id) return;
      const title = all.find(l => l.id === id).title;
      if (c.dataset.add) save(g, c.checked ? [...L.lessons, id] : L.lessons.filter(x => x !== id), L.open, c.checked ? `«${title}» добавлен группе ${g.code}.` : `«${title}» убран у группы ${g.code}.`);
      else save(g, L.lessons, c.checked ? [...L.open, id] : L.open.filter(x => x !== id), c.checked ? `«${title}» можно проходить.` : `«${title}» закрыт.`);
    });
  });

  /* ================= ФОН АДМИНИСТРАТОРА ================= */
  // Студенты покупают фоны в магазине, администратор меняет свой бесплатно
  const THEMES = [['night', 'Ночь', 'затмение над замком, пепел'], ['day', 'Привал у костра', 'светлый день, у костра путник'], ['autumn', 'Осенний привал', 'закат, рыжие деревья, листопад']];
  $('my-theme').addEventListener('click', async () => {
    const cur = window.AshScene?.name || 'night';
    let pick = cur;
    const v = await A.modal({
      title: 'Фон страниц',
      body: `<p>Для вас бесплатно. Студенты получают фоны в магазине.</p><div class="form"><div class="f full"><div class="checks theme-pick" role="radiogroup" aria-label="Фон">${THEMES.map(([k, t, d]) =>
        `<label><input type="radio" name="theme" value="${k}"${k === cur ? ' checked' : ''}> <span class="theme-swatch" data-art="${k}"></span> ${t} <small class="hint">${d}</small></label>`).join('')}</div></div></div>`,
      actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: 'ПОСТАВИТЬ', value: 'ok', primary: true }],
      onSubmit: val => { if (val === 'ok') pick = document.querySelector('#modal-body input[name=theme]:checked')?.value || 'night'; return null; }
    });
    if (v !== 'ok' || pick === cur) return;
    try { await window.Ash.api('POST', 'api/me/theme', { theme: pick }); window.AshScene?.set(pick); if (sfx.lit) sfx.lit(); toast('Фон изменён на всех страницах.'); }
    catch (e) { toast('Фон не изменён: ' + e.message); }
  });

  badge();
})();
