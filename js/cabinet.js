/* Личный кабинет: рисует персонажа, уровень, полосы HP/XP, модули, достижения, курсы и историю из window.STUDENT. */
(() => {
  const D = window.STUDENT;
  const { svg, C, store, banner, sfx = {} } = window.Ash;
  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('ru-RU');
  const date = iso => new Date(iso + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Имя из формы входа, если пришли оттуда
  const name = store.get('name') || D.name;
  $('st-name').textContent = name;

  /* ---------- пиксельные иконки ---------- */
  const ICONS = window.ASH_ICONS, RARITY = window.ASH_RARITY;
  const icon = (key, pal, s) => {
    const rows = typeof ICONS[key] === 'function' ? ICONS[key](window.Ash.S) : ICONS[key];
    return svg(rows, pal, s);
  };

  $('avatar').innerHTML = icon('avatar', { X: '#9a93a6', Y: '#0a090c', R: '#8e1b1b', P: C.ember }, 5);
  $('soul-icon').innerHTML = icon('soul', { Y: '#7fb0ff', W: '#e8f1ff' }, 5);

  /* ---------- уровень и опыт ---------- */
  const lv = D.levels;
  let cur = 0;
  lv.forEach((l, i) => { if (D.xp >= l.xp) cur = i; });
  const next = lv[cur + 1];
  $('rank-title').textContent = lv[cur].title;
  $('rank-badge').innerHTML = icon('badge', { X: C.gold, Y: '#4a1a12', W: C.emberHi }, 4);
  $('ladder').innerHTML = lv.map((l, i) =>
    `<li class="${i < cur ? 'passed' : i === cur ? 'now' : ''}"${i === cur ? ' aria-current="step"' : ''}>${l.title}<small>${fmt(l.xp)} XP</small></li>`).join('');

  function setBar(el, value, max, text) {
    const pct = max ? Math.max(0, Math.min(100, value / max * 100)) : 100;
    el.querySelector('i').style.setProperty('--w', pct + '%');
    el.setAttribute('aria-valuemin', 0); el.setAttribute('aria-valuemax', max); el.setAttribute('aria-valuenow', value);
    el.setAttribute('aria-valuetext', text);
  }
  if (next) {
    const have = D.xp - lv[cur].xp, need = next.xp - lv[cur].xp;
    $('xp-val').textContent = `${fmt(have)} / ${fmt(need)}`;
    $('rank-next').innerHTML = `до уровня «${next.title}»<br>осталось ${fmt(next.xp - D.xp)} XP`;
    setBar($('xp-bar'), have, need, `${fmt(have)} из ${fmt(need)} опыта`);
  } else {
    $('xp-val').textContent = 'максимум';
    $('rank-next').textContent = 'высший уровень';
    setBar($('xp-bar'), 1, 1, 'Максимальный уровень');
  }

  /* ---------- курс и модули ---------- */
  const all = D.modules.flatMap(m => m.lessons);
  const done = all.filter(l => l[1] === 'done').length;
  $('hp-val').textContent = `${done} / ${all.length} уроков`;
  setBar($('hp-bar'), done, all.length, `${done} из ${all.length} уроков`);
  $('course-name').textContent = D.course;

  const STATUS_L = { done: 'пройден', current: 'в работе', open: 'доступен', locked: 'закрыт' };
  $('mod-list').innerHTML = D.modules.map((m, i) => {
    const d = m.lessons.filter(l => l[1] === 'done').length, n = m.lessons.length;
    const locked = m.lessons.every(l => l[1] === 'locked');
    const pct = Math.round(d / n * 100);
    return `<li class="mod${d === n ? ' full' : ''}${locked ? ' locked' : ''}">
      <span class="mod-num">${i + 1}</span>
      <div class="mod-top"><span class="mod-title">${esc(m.title)}</span><span class="mod-count">${locked ? 'закрыт' : `${d} / ${n} · ${pct}%`}</span></div>
      <div class="bar hp" role="progressbar" aria-label="${esc(m.title)}" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${d}"><i style="--w:${pct}%"></i></div>
      <div class="pips">${m.lessons.map(([t, s], k) => `<i class="pip ${s}" title="Урок ${k + 1}. ${esc(t)}: ${STATUS_L[s]}"></i>`).join('')}</div>
    </li>`;
  }).join('');

  /* ---------- достижения ---------- */
  const got = D.achievements.filter(a => a.date).length;
  $('ach-count').textContent = `получено ${got} из ${D.achievements.length}`;
  const achSorted = [...D.achievements].sort((a, b) => (b.date ? 1 : 0) - (a.date ? 1 : 0) || String(b.date).localeCompare(String(a.date)));
  $('ach-grid').innerHTML = achSorted.map(a => {
    const r = RARITY[a.rarity];
    const pal = a.icon === 'slug' ? { G: '#8db85a', g: '#4e6e33', k: '#111', w: '#e6f0c0' } : a.icon === 'flame' ? { Y: C.emberHi, O: C.ember } : { X: r.c, Y: r.d };
    return `<li class="ach-item${a.date ? '' : ' locked'}" data-r="${a.rarity}">
      <span class="ach-icon">${icon(a.icon, pal, a.icon === 'slug' ? 3 : 4)}</span>
      <p class="ach-title">${esc(a.title)}</p>
      <p class="ach-text">${esc(a.text)}</p>
      <p class="ach-meta"><span class="ach-rarity">${r.label}</span><span class="ach-date">${a.date ? date(a.date) : 'не получено'}</span></p>
    </li>`;
  }).join('');
  filterChips('ach-filter', 'r', v => document.querySelectorAll('.ach-item').forEach(el => el.hidden = v !== 'all' && el.dataset.r !== v));

  /* ---------- группа и курсы ---------- */
  const g = D.group;
  $('st-group').innerHTML = `Группа <b>${esc(g.code)}</b> · ${esc(g.title)}`;
  $('group-card').innerHTML = `
    <div><p class="eyebrow">Группа</p><p class="big">${esc(g.code)}</p></div>
    <div><p class="eyebrow">Место в группе</p><p class="big">${g.rank} / ${g.members}</p></div>
    <div><p class="eyebrow">Куратор</p><p>${esc(g.curator)}</p></div>`;
  const levelIndex = t => lv.findIndex(l => l.title === t);
  $('course-list').innerHTML = D.courses.map((c, i) => {
    const locked = c.status === 'locked' && levelIndex(c.need) > cur;
    const status = c.status === 'locked' && !locked ? 'open' : c.status;
    let right = '';
    if (status === 'active') right = `<span class="tagline active">ИДЁТ · ${Math.round(done / all.length * 100)}%</span>`;
    else if (status === 'open') right = `<button type="button" class="btn" data-enroll="${i}">ЗАПИСАТЬСЯ</button>`;
    else right = `<span class="tagline locked">НУЖЕН УРОВЕНЬ «${esc(c.need).toUpperCase()}»</span>`;
    return `<li class="course ${status}"><div class="course-info"><p class="course-title">${esc(c.title)}</p><p class="course-text">${esc(c.text)}${c.hours ? ` · ${c.hours} ч` : ''}</p></div>${right}</li>`;
  }).join('');
  $('course-list').addEventListener('click', e => {
    const b = e.target.closest('[data-enroll]'); if (!b) return;
    const c = D.courses[b.dataset.enroll];
    b.disabled = true; b.textContent = 'ВЫ ЗАПИСАНЫ';
    if (sfx.lit) sfx.lit();
    banner('bn-lit');
    toast(`Вы записаны на курс «${c.title}». Он появится в модулях после старта.`);
  });

  /* ---------- история заданий ---------- */
  const ST = { accepted: 'Принято', review: 'На проверке', revision: 'Доработка', failed: 'Не сдано' };
  const signed = n => n > 0 ? `<span class="plus">+${fmt(n)}</span>` : n < 0 ? `<span class="minus">−${fmt(-n)}</span>` : '<span class="zero">—</span>';
  $('hist-body').innerHTML = D.history.map(h => `<tr data-s="${h.status}">
      <td class="date">${date(h.date)}</td>
      <td>${esc(h.task)}<small>${esc(h.module)}</small></td>
      <td><span class="status ${h.status}">${ST[h.status]}</span></td>
      <td class="num">${signed(h.xp)}</td>
      <td class="num">${signed(h.souls)}</td>
    </tr>`).join('');
  filterChips('hist-filter', 's', v => document.querySelectorAll('#hist-body tr').forEach(tr => tr.hidden = v !== 'all' && tr.dataset.s !== v));

  /* ---------- баланс ---------- */
  $('souls').textContent = fmt(D.souls);
  $('souls-week').textContent = `+${fmt(D.soulsWeek)} за неделю`;

  /* ---------- общее ---------- */
  function filterChips(groupId, key, apply) {
    const box = $(groupId);
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      box.querySelectorAll('.chip').forEach(c => { c.classList.toggle('on', c === b); c.setAttribute('aria-pressed', String(c === b)); });
      apply(b.dataset[key]);
    });
    box.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.classList.contains('on'))));
  }
  let toastTimer;
  function toast(text) {
    const t = $('toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }
  document.querySelectorAll('.corner').forEach(n => { if (!n.innerHTML) n.innerHTML = svg(window.Ash.S.corner, { G: C.gold, L: '#7a5f2e' }, 4); });
})();
