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
  const lv = E.LEVELS;
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
    $('rank-next').textContent = `до уровня «${next.title}» осталось ${fmt(next.xp - D.xp)} XP`;
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
  // У группы с набранными уроками показываем темы, где есть её уроки; у прочих — модули группы
  const configured = Array.isArray(myGroup?.lessons);
  // Скрытые темы (у всех или у группы студента) в «Модулях курса» не показываем
  const modOff = m => m.hidden || (myGroup?.hiddenModules || []).includes(m.id);
  const modules = B.db.modules.filter(m => !modOff(m) && (configured || !myGroup || !myGroup.modules || myGroup.modules.includes(m.id))).map(m => {
    const real = window.LESSONS.filter(l => l.module === m.id && lessonAccess(l) !== 'hidden').sort((a, b) => a.lesson - b.lesson).map(l => { const st = lessonState(l); return [l.title, st, st === 'locked' ? 0 : E.lessonProgress(l, SS)]; });
    // Группе, которой преподаватель сам набрал уроки, пустые места модуля не показываем
    const planned = configured ? real.length : Math.max(m.lessons || 0, real.length);
    for (let k = real.length; k < planned; k++) real.push([`Урок ${k + 1} ещё не опубликован`, 'locked', 0]);
    return { title: m.title, lessons: real };
  }).filter(m => m.lessons.length);
  const all = modules.flatMap(m => m.lessons);
  const done = all.filter(l => l[1] === 'done').length;
  // Проценты и полосы — с учётом начатых уроков (прочитан, квиз, решённые задания), счётчик — полностью пройденные
  const prog = list => list.length ? list.reduce((a, l) => a + l[2], 0) / list.length : 0;
  const allPct = Math.round(prog(all) * 100);
  $('hp-val').textContent = `${done} / ${all.length} уроков · ${allPct}%`;

  // «Продолжить путь»: урок, начатый последним по порядку тем, иначе первый доступный
  const order = B.db.modules.filter(m => !modOff(m)).flatMap(m => window.LESSONS.filter(l => l.module === m.id).sort((a, b) => a.lesson - b.lesson));
  const nextLes = order.find(l => lessonState(l) === 'current') || order.find(l => lessonState(l) === 'open');
  if (nextLes) {
    $('go-title').textContent = nextLes.title;
    $('go-sub').textContent = `${B.db.modules.find(m => m.id === nextLes.module)?.title || ''} · ${nextLes.minutes} мин`;
    $('go-btn').href = 'lessons.html#' + nextLes.id;
    $('go-btn').textContent = lessonState(nextLes) === 'current' ? 'ПРОДОЛЖИТЬ' : 'НАЧАТЬ УРОК';
  } else if (all.length && done === all.length) {
    $('go-title').textContent = 'Все открытые уроки пройдены';
    $('go-sub').textContent = 'Можно улучшить результаты в заданиях.';
    $('go-btn').href = 'tasks.html'; $('go-btn').textContent = 'К ЗАДАНИЯМ';
  } else {
    $('go-title').textContent = 'Уроки скоро откроются';
    $('go-sub').textContent = 'Преподаватель ещё не открыл уроки вашей группе.';
    $('go-btn').hidden = true;
  }
  setBar($('hp-bar'), allPct, 100, `пройдено ${done} из ${all.length} уроков, ${allPct}%`);

  const STATUS_L = { done: 'пройден', current: 'в работе', open: 'доступен', locked: 'закрыт' };
  $('mod-list').innerHTML = modules.map((m, i) => {
    const d = m.lessons.filter(l => l[1] === 'done').length, n = m.lessons.length;
    const locked = m.lessons.every(l => l[1] === 'locked');
    const pct = Math.round(prog(m.lessons) * 100);
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
  // По умолчанию видны только полученные награды, остальные — по кнопке «Все» или по редкости
  const achShow = v => document.querySelectorAll('.ach-item').forEach(el => el.hidden = v === 'got' ? el.classList.contains('locked') : v !== 'all' && el.dataset.r !== v);
  if (!got) document.querySelectorAll('#ach-filter .chip').forEach(c => c.classList.toggle('on', c.dataset.r === 'all'));
  achShow(got ? 'got' : 'all');
  filterChips('ach-filter', 'r', achShow);

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
  // Уроки курса — видимые студенту уроки из тем курса (у курса без тем — все видимые уроки)
  const courseLessons = c => window.LESSONS.filter(l => lessonAccess(l) !== 'hidden' && (!(c.modules || []).length || c.modules.includes(l.module)));
  const courses = B.db.courses.slice().sort((a, b) => access.has(b.id) - access.has(a.id));
  const current = courses.find(c => access.has(c.id));
  $('course-name').textContent = current ? current.title : 'курс ещё не открыт';
  $('course-list').innerHTML = courses.map(c => {
    const open = access.has(c.id);
    const req = (B.db.requests || []).find(r => r.course === c.id); // последняя заявка на этот курс
    // Открытый курс: кнопка «Открыть» ведёт в «Уроки», где показаны только темы этого курса
    const cl = open ? courseLessons(c) : [], cd = cl.filter(l => E.lessonDone(l, SS)).length, cp = cl.length ? Math.round(cl.reduce((a, l) => a + (lessonAccess(l) === 'open' ? E.lessonProgress(l, SS) : 0), 0) / cl.length * 100) : 0;
    const right = open ? `<div class="course-go"><span class="tagline active">${c === current ? 'ИДЁТ' : 'ОТКРЫТ'}${cl.length ? ` · ${cp}%` : ''}</span><a class="btn" href="lessons.html#course-${encodeURIComponent(c.id)}">ОТКРЫТЬ</a></div>`
      : req?.status === 'pending' ? '<button type="button" class="btn" disabled>ЗАЯВКА ОТПРАВЛЕНА</button>'
      : `<button type="button" class="btn" data-ask="${c.id}">${req?.status === 'declined' ? 'ПОПРОСИТЬ СНОВА' : 'ПОПРОСИТЬ ДОСТУП'}</button>`;
    const note = open ? (cl.length ? ` · пройдено ${cd} из ${cl.length} уроков` : '') : req?.status === 'pending' ? ' · ждёт ответа преподавателя' : req?.status === 'declined' ? ' · преподаватель пока отклонил заявку' : ' · откроет преподаватель';
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
  /* ---------- вступительный ролик ---------- */
  // При первом входе студента ролик открывается сам и сразу отмечается как показанный; потом — кнопкой внизу кабинета
  $('intro-btn').addEventListener('click', () => window.AshIntro.play());
  if (B.me.role === 'student' && !St.introSeen()) { St.markIntro(); window.AshIntro.play(); }
  document.querySelectorAll('.corner').forEach(n => { if (!n.innerHTML) n.innerHTML = svg(window.Ash.S.corner, { G: C.gold, L: '#7a5f2e' }, 4); });
})();
