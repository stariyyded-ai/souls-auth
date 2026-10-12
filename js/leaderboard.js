/* Таблица лидеров: студенты из админки + вы (данные Student). Скрытые студенты не показываются. */
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
    return A.db.users.filter(u => u.role === 'student').map(u => u.id === St.adminId
      ? { id: u.id, me: true, name: St.name, group: u.group, xp: me.xp, hidden: me.hidden, ...me.equipped }
      : { id: u.id, name: u.name, group: u.group, xp: u.xp, hidden: !!u.hidden, ...look(u) })
      .sort((a, b) => b.xp - a.xp);
  }
  const groupCode = id => A.byId('groups', id)?.code || '—';

  function render() {
    const all = players(), me = all.find(p => p.me);
    const pool = all.filter(p => scope === 'all' || p.group === me.group);
    const visible = pool.filter(p => !p.hidden);
    // Место считаем среди видимых; если вы скрыты, показываем, где бы вы были
    const myPlace = me.hidden ? visible.filter(p => p.xp > me.xp).length + 1 : visible.indexOf(me) + 1;
    const lv = E.level(me.xp);
    $('me-card').innerHTML = `<span class="pos">${myPlace}</span>${avatar(me.avatar, me.frame, 'sm')}
      <div><p class="eyebrow">${me.hidden ? 'Вы скрыты · были бы на месте' : 'Ваше место'} ${scope === 'all' ? 'среди всех' : 'в группе'}</p>
      <p><b>${esc(me.name)}</b></p><p class="lvl">${lv.title} · ${fmt(me.xp)} XP${lv.next ? ` · до «${lv.next.title}» ${fmt(lv.left)}` : ''}</p></div>`;
    $('show-me').checked = !me.hidden;
    $('lb-sub').textContent = `${visible.length} игроков`;
    $('lb-body').innerHTML = visible.map((p, i) => `<tr class="${i < 3 ? 'top' + (i + 1) : ''}${p.me ? ' me' : ''}">
        <td class="pl">${i + 1}</td>
        <td><div class="player">${avatar(p.avatar, p.frame, 'xs')}<div><p>${esc(p.name)}${p.me ? ' <span class="plate-sub">(вы)</span>' : ''}</p>${p.title ? `<small>${esc(p.title)}</small>` : ''}</div></div></td>
        <td>${esc(groupCode(p.group))}</td>
        <td class="lvl">${E.level(p.xp).title}</td>
        <td class="num">${fmt(p.xp)}</td></tr>`).join('');
    const hiddenN = pool.filter(p => p.hidden && !p.me).length;
    $('lb-hidden').textContent = [hiddenN ? `Скрыли себя из таблицы: ${hiddenN}.` : '', me.hidden ? 'Вас в таблице не видно.' : ''].filter(Boolean).join(' ');
  }

  $('show-me').addEventListener('change', e => {
    St.setHidden(!e.target.checked);
    if (sfx.click) sfx.click();
    toast(e.target.checked ? 'Вы снова в таблице лидеров.' : 'Вы скрыты из таблицы лидеров. Другие студенты вас не видят.');
    render();
  });
  chips('lb-filter', 'g', v => { scope = v === 'mine' ? 'mine' : 'all'; render(); });
  render();
})();
