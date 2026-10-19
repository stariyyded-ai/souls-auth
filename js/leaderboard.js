/* Таблица лидеров: студенты с сервера + вы (данные Student). Скрытых сервер присылает без имени и опыта. */
(() => {
  const { $, esc, fmt, toast, chips, avatar } = window.UI;
  const St = window.Student, A = window.AdminStore, E = window.Economy;
  const sfx = window.Ash.sfx || {};
  let scope = 'all';

  // У других студентов облик выбирается по их id, чтобы таблица выглядела живой и не менялась между заходами
  const AV = Object.keys(window.ASH_AVATARS), FR = [null, null, ...Object.keys(window.ASH_FRAMES)];
  const TITLES = [null, null, 'Негорящий', 'Рыцарь семантики', 'Повелитель Flexbox', null, 'Прочитавший спецификацию'];
  const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const look = u => { const h = hash(u.id); return { avatar: AV[h % AV.length], frame: FR[(h >> 3) % FR.length], title: TITLES[(h >> 6) % TITLES.length] }; };

  function players() {
    const me = St.state;
    return A.db.users.filter(u => u.role === 'student' || u.id === St.adminId).map(u => u.id === St.adminId
      ? { id: u.id, me: true, name: St.name, group: u.group, xp: me.xp, hidden: me.hidden, ...me.equipped }
      : { id: u.id, name: u.name, group: u.group, xp: u.xp, hidden: !!u.hidden, ...look(u) })
      .sort((a, b) => b.xp - a.xp);
  }
  const groupCode = id => A.byId('groups', id)?.code || '—';

  // scope: 'all' — все, 'mine' — моя группа, 'groups' — таблица разбита по группам, 'g:<id>' — одна выбранная группа
  const row = (p, place) => `<tr class="${place <= 3 ? 'top' + place : ''}${p.me ? ' me' : ''}">
        <td class="pl">${place}</td>
        <td><div class="player">${avatar(p.avatar, p.frame, 'xs')}<div><p>${esc(p.name)}${p.me ? ' <span class="plate-sub">(вы)</span>' : ''}</p>${p.title ? `<small>${esc(p.title)}</small>` : ''}</div></div></td>
        <td>${esc(groupCode(p.group))}</td>
        <td class="lvl">${E.level(p.xp).title}</td>
        <td class="num">${fmt(p.xp)}</td></tr>`;

  function render() {
    const all = players(), me = all.find(p => p.me);
    const only = scope.startsWith('g:') ? scope.slice(2) : scope === 'mine' ? me.group : null;
    const pool = all.filter(p => !only || p.group === only);
    const visible = pool.filter(p => !p.hidden);
    // Место считаем среди видимых (в режиме «По группам» — внутри своей группы); если вы скрыты, показываем, где бы вы были
    const placeIn = list => me.hidden ? list.filter(p => !p.hidden && p.xp > me.xp).length + 1 : list.filter(p => !p.hidden).indexOf(me) + 1;
    const inGroups = scope === 'groups';
    const myPlace = placeIn(inGroups ? all.filter(p => p.group === me.group) : pool);
    const where = inGroups || scope === 'mine' || only === me.group ? 'в группе' : only ? `в группе ${groupCode(only)}` : 'среди всех';
    const lv = E.level(me.xp);
    $('me-card').innerHTML = `<span class="pos">${only && only !== me.group ? '—' : myPlace}</span>${avatar(me.avatar, me.frame, 'sm')}
      <div><p class="eyebrow">${me.hidden ? 'Вы скрыты · были бы на месте' : 'Ваше место'} ${where}</p>
      <p><b>${esc(me.name)}</b></p><p class="lvl">${lv.title} · ${fmt(me.xp)} XP${lv.next ? ` · до «${lv.next.title}» ${fmt(lv.left)}` : ''}</p></div>`;
    $('show-me').checked = !me.hidden;
    $('lb-sub').textContent = `${visible.length} игроков`;
    if (inGroups) {
      // Группы по среднему опыту видимых игроков; внутри группы — по опыту
      const groups = [...new Set(visible.map(p => p.group))].map(g => {
        const ps = visible.filter(p => p.group === g);
        return { g, ps, avg: ps.reduce((a, p) => a + p.xp, 0) / ps.length };
      }).sort((a, b) => b.avg - a.avg);
      $('lb-body').innerHTML = groups.map((x, gi) => `<tr class="grp-row"><td class="pl">${gi + 1}</td><td colspan="4"><b>${esc(groupCode(x.g))}</b> · ${x.ps.length} ${x.ps.length % 10 === 1 && x.ps.length % 100 !== 11 ? 'игрок' : x.ps.length % 10 >= 2 && x.ps.length % 10 <= 4 && (x.ps.length % 100 < 10 || x.ps.length % 100 >= 20) ? 'игрока' : 'игроков'} · средний опыт ${fmt(Math.round(x.avg))} XP</td></tr>`
        + x.ps.map((p, i) => row(p, i + 1)).join('')).join('');
    } else $('lb-body').innerHTML = visible.map((p, i) => row(p, i + 1)).join('');
    const hiddenN = pool.filter(p => p.hidden && !p.me).length;
    $('lb-hidden').textContent = [hiddenN ? `Скрыли себя из таблицы: ${hiddenN}.` : '', me.hidden ? 'Вас в таблице не видно.' : ''].filter(Boolean).join(' ');
  }

  // Список групп для выбора: только те, где есть студенты
  const grpIds = [...new Set(players().map(p => p.group).filter(Boolean))].sort((a, b) => groupCode(a).localeCompare(groupCode(b), 'ru'));
  $('lb-group').innerHTML = '<option value="">Выбрать группу…</option>' + grpIds.map(id => `<option value="${esc(id)}">${esc(groupCode(id))}</option>`).join('');
  $('lb-group').addEventListener('change', e => {
    if (!e.target.value) return;
    scope = 'g:' + e.target.value;
    document.querySelectorAll('#lb-filter .chip').forEach(c => { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
    render();
  });

  $('show-me').addEventListener('change', e => {
    St.setHidden(!e.target.checked);
    if (sfx.click) sfx.click();
    toast(e.target.checked ? 'Вы снова в таблице лидеров.' : 'Вы скрыты из таблицы лидеров. Другие студенты вас не видят.');
    render();
  });
  chips('lb-filter', 'g', v => { scope = v; $('lb-group').value = ''; render(); });
  render();
})();
