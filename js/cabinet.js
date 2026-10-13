/* Личный кабинет: рисует персонажа, уровень, полосы HP/XP, модули, достижения, курсы и историю.
   Всё считается по настоящим данным студента (Student) и курса с сервера (window.BOOT):
   модули — из админки, уроки — из js/content.js, история — решённые задания. Новичок начинает с нуля. */
(() => {
  const St = window.Student, SS = St.state;
  const D = { ...window.STUDENT, xp: SS.xp, souls: SS.souls, achievements: St.achievements(), history: SS.history };
  const B = window.BOOT, E = window.Economy;
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

  const eq = SS.equipped;
  $('avatar').innerHTML = window.ASH_AVATAR_SVG(eq.avatar, 5);
  if (eq.frame) $('avatar').dataset.frame = eq.frame;
  $('st-title').textContent = eq.title || '';
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
  // Модули группы из админки; в каждом — опубликованные уроки, остальные места модуля пока закрыты
  const myGroup = B.db.groups.find(g => g.id === B.me.group);
  const lessonAccess = l => window.StudentLogic.lessonAccess(l, myGroup, B.me.role);
  const lessonState = l => {
    if (lessonAccess(l) !== 'open') return 'locked';
    if (E.lessonDone(l, SS)) return 'done';
    return SS.lessons[l.id]?.read ? 'current' : 'open';
  };
  const modules = B.db.modules.filter(m => !myGroup || !myGroup.modules || myGroup.modules.includes(m.id)).map(m => {
    const real = window.LESSONS.filter(l => l.module === m.id && lessonAccess(l) !== 'hidden').sort((a, b) => a.lesson - b.lesson).map(l => [l.title, lessonState(l)]);
    // Группе, которой преподаватель сам набрал уроки, пустые места модуля не показываем
    const planned = Array.isArray(myGroup?.lessons) ? real.length : Math.max(m.lessons || 0, real.length);
    for (let k = real.length; k < planned; k++) real.push([`Урок ${k + 1} ещё не опубликован`, 'locked']);
    return { title: m.title, lessons: real };
  }).filter(m => m.lessons.length);
  const all = modules.flatMap(m => m.lessons);
  const done = all.filter(l => l[1] === 'done').length;
  $('hp-val').textContent = `${done} / ${all.length} уроков`;
  setBar($('hp-bar'), done, all.length, `${done} из ${all.length} уроков`);

  const STATUS_L = { done: 'пройден', current: 'в работе', open: 'доступен', locked: 'закрыт' };
  $('mod-list').innerHTML = modules.map((m, i) => {
    const d = m.lessons.filter(l => l[1] === 'done').length, n = m.lessons.length;
    const locked = m.lessons.every(l => l[1] === 'locked');
    const pct = n ? Math.round(d / n * 100) : 0;
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
  // Место в группе — по опыту среди одногруппников, скрывшиеся из таблицы лидеров тоже считаются
  const mates = B.db.users.filter(u => u.group === B.me.group && (u.role === 'student' || u.id === B.me.id));
  g.members = mates.length || 1;
  g.rank = mates.filter(u => u.id !== B.me.id && u.xp > SS.xp).length + 1;
  $('st-group').innerHTML = `Группа <b>${esc(g.code)}</b> · ${esc(g.title)}`;
  $('group-card').innerHTML = `
    <div><p class="eyebrow">Группа</p><p class="big">${esc(g.code)}</p></div>
    <div><p class="eyebrow">Место в группе</p><p class="big">${g.rank} / ${g.members}</p></div>
    <div><p class="eyebrow">Куратор</p><p>${esc(g.curator)}</p></div>`;
  // Курсы — из админки. Открыт курс, если администратор дал доступ группе студента или ему лично;
  // закрытый можно попросить открыть: заявка приходит администратору в раздел «Заявки»
  const access = new Set([...(myGroup?.courses || []), ...(B.me.courses || [])]);
  const courses = B.db.courses.slice().sort((a, b) => access.has(b.id) - access.has(a.id));
  const current = courses.find(c => access.has(c.id));
  $('course-name').textContent = current ? current.title : 'курс ещё не открыт';
  $('course-list').innerHTML = courses.map(c => {
    const open = access.has(c.id);
    const req = (B.db.requests || []).find(r => r.course === c.id); // последняя заявка на этот курс
    const right = c === current ? `<span class="tagline active">ИДЁТ · ${all.length ? Math.round(done / all.length * 100) : 0}%</span>`
      : open ? '<span class="tagline active">ОТКРЫТ</span>'
      : req?.status === 'pending' ? '<button type="button" class="btn" disabled>ЗАЯВКА ОТПРАВЛЕНА</button>'
      : `<button type="button" class="btn" data-ask="${c.id}">${req?.status === 'declined' ? 'ПОПРОСИТЬ СНОВА' : 'ПОПРОСИТЬ ДОСТУП'}</button>`;
    const note = open ? '' : req?.status === 'pending' ? ' · ждёт ответа преподавателя' : req?.status === 'declined' ? ' · преподаватель пока отклонил заявку' : ' · откроет преподаватель';
    return `<li class="course ${open ? 'active' : 'locked'}"><div class="course-info"><p class="course-title">${esc(c.title)}</p><p class="course-text">${esc(c.text || '')}${c.hours ? ` · ${c.hours} ч` : ''}${note}</p></div>${right}</li>`;
  }).join('') || '<li class="course locked"><div class="course-info"><p class="course-text">Курсов пока нет.</p></div></li>';
  $('course-list').addEventListener('click', async e => {
    const b = e.target.closest('[data-ask]'); if (!b) return;
    const c = B.db.courses.find(x => x.id === b.dataset.ask);
    b.disabled = true; b.textContent = 'ОТПРАВЛЯЮ…';
    try {
      await window.Ash.api('POST', 'api/me/course-request', { course: c.id });
      b.textContent = 'ЗАЯВКА ОТПРАВЛЕНА';
      if (sfx.click) sfx.click();
      toast(`Заявка отправлена. Преподаватель получит её в админке и откроет «${c.title}».`);
    } catch (err) { b.disabled = false; b.textContent = 'ПОПРОСИТЬ ДОСТУП'; toast('Не отправилось: ' + err.message); }
  });

  /* ---------- история заданий ---------- */
  const ST = { accepted: 'Принято', review: 'На проверке', revision: 'Доработка', failed: 'Не сдано' };
  const signed = n => n > 0 ? `<span class="plus">+${fmt(n)}</span>` : n < 0 ? `<span class="minus">−${fmt(-n)}</span>` : '<span class="zero">—</span>';
  $('hist-body').innerHTML = D.history.map(h => `<tr data-s="${h.status}">
      <td class="date">${date(h.date)}</td>
      <td>${esc(h.task)}<small>${esc(h.module)}${h.auto ? ' · автопроверка' : ''}</small></td>
      <td><span class="status ${h.status}">${ST[h.status]}</span></td>
      <td class="num">${signed(h.xp)}</td>
      <td class="num">${signed(h.souls)}</td>
    </tr>`).join('') || '<tr><td colspan="5" class="empty">Пока нет сданных заданий. Начните с раздела «Задания».</td></tr>';
  filterChips('hist-filter', 's', v => document.querySelectorAll('#hist-body tr').forEach(tr => tr.hidden = v !== 'all' && tr.dataset.s !== v));

  /* ---------- баланс ---------- */
  $('souls').textContent = fmt(D.souls);
  const weekAgo = Date.now() - 7 * 864e5;
  const week = SS.journal.filter(j => j.amount > 0 && j.kind === 'transaction' && new Date(j.date) > weekAgo).reduce((a, j) => a + j.amount, 0);
  $('souls-week').textContent = `+${fmt(week)} за неделю`;

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
