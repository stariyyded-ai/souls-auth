/* Страница заданий: задания курса (по занятиям), 25 испытаний и рабочее место с редактором CodeMirror,
   линтером, предпросмотром и автопроверкой.
   Адреса: tasks.html#t07 — испытание, tasks.html#k0102 — задание курса, tasks.html#sandbox — песочница
   (код приходит со страницы урока кнопкой «Попробовать», ничего не проверяется и не сохраняется на сервере). */
(() => {
  const { $, esc, fmt, toast, chips, announce } = window.UI;
  const St = window.Student, E = window.Economy, R = window.TaskRunner;
  const TASKS = window.TASKS, MECH = window.TASK_MECHANICS;
  const { svg, banner, sfx = {} } = window.Ash;
  const ICONS = window.ASH_ICONS;
  const MECH_ICON = { fix: 'sword', assemble: 'scroll', optimize: 'flame', adaptive: 'ring', a11y: 'shield' };
  const maxPoints = t => Math.round(t.points * (1 + E.CLEAN_SHARE + E.SPEED_SHARE));
  const icon = (key, s = 3) => svg(ICONS[key], { X: '#f2d58a', Y: '#7a5f2e', O: '#e8772e', W: '#fff0b0' }, s);
  const boostsHTML = () => {
    const b = St.activeBoosters();
    return b.length ? '<span>Бустеры:</span>' + b.map(x => `<span class="boost">${esc(x.title)} · ещё ${x.charges}</span>`).join('') : '';
  };

  /* ================= Список ================= */
  const GAME = TASKS.filter(t => !t.lesson);
  const GAME_MECH = Object.entries(MECH).filter(([k]) => GAME.some(t => t.mech === k));
  // Задания курса видны, если виден их урок; проходить можно, когда урок открыт (раздел «Уроки групп» в админке)
  const B = window.BOOT, LESSONS = window.LESSONS || [];
  const group = B.db.groups.find(g => g.id === B.me.group);
  const lessonOf = t => t.lesson && LESSONS.find(l => l.id === t.lesson);
  const access = t => { const l = lessonOf(t); return !t.lesson ? 'open' : !l ? 'hidden' : window.StudentLogic.lessonAccess(l, group, B.me.role); };
  const COURSE = TASKS.filter(t => t.lesson && access(t) !== 'hidden');
  const MODULES = B.db.modules;
  let mechFilter = 'all', section = COURSE.length ? 'course' : 'game';
  $('mech-filter').innerHTML = `<button type="button" class="chip on" data-m="all">Все</button>` +
    GAME_MECH.map(([k, m]) => `<button type="button" class="chip" data-m="${k}">${m.title}</button>`).join('');
  chips('mech-filter', 'm', v => { mechFilter = v; renderList(); });
  if (!COURSE.length) $('sec-filter').hidden = true;
  $('sec-filter').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.s === section));
  chips('sec-filter', 's', v => { section = v; renderList(); });

  function status(t) {
    const s = St.taskState(t.id);
    if (s && s.solved) return { cls: 'solved', text: `решено · ${fmt(s.best)} из ${fmt(maxPoints(t))}` };
    if (s && (s.attempts || s.code)) return { cls: 'started', text: s.attempts ? `попыток: ${s.attempts}` : 'начато' };
    return { cls: 'new', text: 'новое' };
  }
  const card = (t, num, locked) => {
    const s = status(t);
    return `<li class="task-card ${locked ? 'locked' : s.cls}">
      <span class="num">${num}</span>
      <div class="tc-body">
        <h3>${locked ? esc(t.title) : `<a href="#${t.id}">${esc(t.title)}</a>`}</h3>
        <p class="tc-meta"><span>${t.level}</span><span>норма ${t.minutes} мин</span><span>до ${fmt(maxPoints(t))} очков</span></p>
        <p class="tc-status">${locked ? '🔒 откроется вместе с уроком' : s.text}</p>
      </div></li>`;
  };
  function renderList() {
    const st = St.state;
    const list = section === 'course' ? COURSE : GAME;
    const solved = list.filter(t => st.tasks[t.id]?.solved).length;
    const pts = list.reduce((a, t) => a + (st.tasks[t.id]?.best || 0), 0);
    $('sum-solved').textContent = `${solved} / ${list.length}`;
    $('sum-points').textContent = fmt(pts);
    const bar = $('sum-bar');
    bar.querySelector('i').style.setProperty('--w', (list.length ? solved / list.length * 100 : 0) + '%');
    bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', list.length); bar.setAttribute('aria-valuenow', solved);
    $('boosts').innerHTML = boostsHTML();
    $('mech-filter').hidden = section !== 'game';
    $('mech-list').hidden = section !== 'game';
    $('course-list').hidden = section !== 'course';
    if (section === 'game') {
      $('mech-list').innerHTML = GAME_MECH.filter(([k]) => mechFilter === 'all' || mechFilter === k).map(([k, m]) => `
      <section class="plate mech" aria-labelledby="m-${k}">
        <div class="plate-head"><span class="mech-ico">${icon(MECH_ICON[k], 4)}</span><h2 id="m-${k}">${m.title}</h2><p class="plate-sub">${m.text}</p></div>
        <ul class="task-grid">${GAME.filter(t => t.mech === k).map(t => card(t, t.id.slice(1), false)).join('')}</ul>
      </section>`).join('');
      return;
    }
    // Курс: темы по порядку из админки, внутри — занятия, у занятия — его задания
    const lessons = LESSONS.filter(l => COURSE.some(t => t.lesson === l.id));
    const firstOpen = COURSE.find(t => access(t) === 'open' && !st.tasks[t.id]?.solved);
    $('course-list').innerHTML = MODULES.map((m, mi) => {
      const ls = lessons.filter(l => l.module === m.id).sort((a, b) => (a.session || a.lesson) - (b.session || b.lesson));
      if (!ls.length) return '';
      const ts = COURSE.filter(t => ls.some(l => l.id === t.lesson));
      const done = ts.filter(t => st.tasks[t.id]?.solved).length;
      const open = firstOpen ? ls.some(l => l.id === firstOpen.lesson) : mi === 0;
      return `<details class="plate course-mod"${open ? ' open' : ''}>
        <summary><h2>${esc(m.title)}</h2><span class="plate-sub">решено ${done} из ${ts.length}</span></summary>
        ${ls.map(l => {
          const lt = window.Economy.lessonTasks(l).map(id => COURSE.find(t => t.id === id)).filter(Boolean);
          const locked = access(lt[0]) !== 'open';
          return `<div class="course-lesson">
            <h3 class="cl-title"><span class="eyebrow">${l.session ? `Занятие ${l.session}` : `Урок ${l.lesson}`}${l.kind === 'practice' ? ' · практическая работа' : l.kind === 'lecture' ? ' · лекция' : ''}</span>
              ${locked ? esc(l.title) : `<a href="lessons.html#${l.id}">${esc(l.title)}</a>`}</h3>
            <ul class="task-grid">${lt.map((t, i) => card(t, i + 1, locked)).join('')}</ul>
          </div>`;
        }).join('')}
      </details>`;
    }).join('') || '<section class="plate"><p class="empty">Преподаватель ещё не добавил занятия вашей группе.</p></section>';
  }

  /* ================= Рабочее место ================= */
  const CM = window.CodeMirror;
  CM.registerHelper('lint', 'html', text => R.htmlLint(text).map(m => ({ from: CM.Pos(m.line - 1, Math.max(0, m.col - 1)), to: CM.Pos(m.line - 1, m.col), message: m.message, severity: m.type })));
  CM.registerHelper('lint', 'css', text => R.cssLint(text).map(m => ({ from: CM.Pos(m.line - 1, Math.max(0, m.col - 1)), to: CM.Pos(m.line - 1, m.col + 3), message: m.message, severity: 'error' })));
  const common = { theme: 'ash', lineNumbers: true, lineWrapping: true, tabSize: 2, indentUnit: 2, matchBrackets: true, autoCloseBrackets: true, gutters: ['CodeMirror-lint-markers'], viewportMargin: Infinity };
  const ed = {
    html: CM($('pane-html'), { ...common, mode: 'htmlmixed', autoCloseTags: true, lint: { lintOnChange: true, delay: 400 }, screenReaderLabel: 'Код HTML' }),
    css: CM($('pane-css'), { ...common, mode: 'css', lint: { lintOnChange: true, delay: 400 }, screenReaderLabel: 'Код CSS' }),
    js: CM($('pane-js'), { ...common, mode: 'javascript', screenReaderLabel: 'Код JavaScript' })
  };
  const FILES = ['html', 'css', 'js'];
  const hasJs = () => !!task && typeof task.js === 'string';
  const codeNow = () => ({ html: ed.html.getValue(), css: ed.css.getValue(), ...(hasJs() ? { js: ed.js.getValue() } : {}) });
  // Песочница: свободный код из урока, без проверки и без сохранения на сервере
  const SANDBOX = { id: 'sandbox', sandbox: true, title: 'Песочница', mech: 'build', level: '', minutes: 0, points: 0, tests: [], html: '', css: '', js: '',
    story: 'Пример из урока. Меняйте код и сразу смотрите результат справа.',
    goal: 'Здесь ничего не проверяется и не сохраняется на сервере: это черновик для опытов. Код живёт, пока открыта вкладка.' };
  let task = null, startedAt = 0, tick, saveTimer, pvTimer, pvWidth = 'desk', lastReport = null;

  function tab(which) {
    FILES.forEach(k => {
      $('tab-' + k).setAttribute('aria-selected', String(k === which));
      $('tab-' + k).tabIndex = k === which ? 0 : -1;
      $('pane-' + k).hidden = k !== which;
    });
    ed[which].refresh();
  }
  $('tab-html').addEventListener('click', () => tab('html'));
  $('tab-css').addEventListener('click', () => tab('css'));
  $('tab-js').addEventListener('click', () => tab('js'));
  document.querySelector('.ed-tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const files = FILES.filter(k => !$('tab-' + k).hidden);
    const cur = files.findIndex(k => $('tab-' + k).getAttribute('aria-selected') === 'true');
    const next = files[(cur + (e.key === 'ArrowRight' ? 1 : files.length - 1)) % files.length];
    tab(next); $('tab-' + next).focus();
  });

  // Предпросмотр задания с JavaScript выполняет скрипты студента: iframe без allow-same-origin, доступа к сайту у них нет
  function updatePreview() {
    const c = codeNow(), pv = $('preview');
    const sb = hasJs() || (task && task.sandbox) ? 'allow-scripts allow-forms allow-modals' : '';
    if (pv.getAttribute('sandbox') !== sb) pv.setAttribute('sandbox', sb);
    pv.srcdoc = R.page(c.html, c.css, c.js || '');
  }
  function updateLintSum() {
    const c = codeNow();
    const n = R.lint(c.html, c.css, c.js || '').filter(m => m.type === 'error').length;
    $('lint-sum').textContent = n ? `линтер: ошибок ${n}` : 'линтер: чисто';
    $('lint-sum').className = 'lint-sum ' + (n ? 'bad' : 'ok');
  }
  FILES.forEach(k => ed[k].on('change', () => {
    clearTimeout(saveTimer); clearTimeout(pvTimer);
    saveTimer = setTimeout(() => {
      if (!task) return;
      if (task.sandbox) { try { sessionStorage.setItem('ash.sandbox.code', JSON.stringify({ ...codeNow(), from: task.html })); } catch (e) { } return; }
      St.saveDraft(task.id, codeNow());
    }, 600);
    pvTimer = setTimeout(() => { updatePreview(); updateLintSum(); }, 350);
  }));
  chips('pv-size', 'w', v => { pvWidth = v; $('preview').classList.toggle('phone', v === 'phone'); });

  function clock() {
    if (!task || task.sandbox) return;
    const sec = (Date.now() - startedAt) / 1000, norm = task.minutes * 60;
    $('clock').textContent = E.clock(sec);
    const tm = $('timer');
    tm.classList.toggle('late', sec > norm);
    tm.classList.toggle('burnt', sec > norm * 2);
    $('norm').textContent = sec <= norm ? `норма ${task.minutes} мин` : sec < norm * 2 ? 'бонус за скорость тает' : 'бонус за скорость сгорел';
  }

  const checkLi = (name, state, note, at) => `<li class="${state}"><span class="mark" aria-hidden="true">${state === 'ok' ? '✓' : state === 'bad' ? '✗' : '○'}</span><span>${esc(name)}${at ? ` <small>· ${at}</small>` : ''}${note ? `<small class="note">${esc(note)}</small>` : ''}<span class="sr"> — ${state === 'ok' ? 'выполнено' : state === 'bad' ? 'не выполнено' : 'не проверено'}</span></span></li>`;
  function renderChecks(rep) {
    $('t-checks').innerHTML = task.tests.map((t, i) => { const r = rep && rep.func[i]; return checkLi(t.name, r ? (r.ok ? 'ok' : 'bad') : 'idle', r && !r.ok ? r.note : '', t.at === 360 ? 'телефон 360px' : ''); }).join('');
    const q = R.qualityFor(task);
    $('t-quality').innerHTML = q.map((t, i) => { const r = rep && rep.quality[i]; return checkLi(t.name, r ? (r.ok ? 'ok' : 'bad') : 'idle', r && !r.ok ? r.note : ''); }).join('');
  }

  let hintsShown = 0;
  function renderHints() {
    const hs = (task && task.hints) || [];
    $('hint-box').hidden = !hs.length;
    $('hints').innerHTML = hs.slice(0, hintsShown).map(x => `<li>${esc(x)}</li>`).join('');
    $('hint-btn').hidden = hintsShown >= hs.length;
    $('hint-btn').textContent = hintsShown ? `ЕЩЁ ПОДСКАЗКА (${hintsShown + 1} из ${hs.length})` : `ПОДСКАЗКА (1 из ${hs.length})`;
  }
  $('hint-btn').addEventListener('click', () => { hintsShown++; renderHints(); try { sessionStorage.setItem('ash.hints.' + task.id, hintsShown); } catch (e) { } });

  function sandboxTask() {
    let src = {}, code = null;
    try { src = JSON.parse(sessionStorage.getItem('ash.sandbox') || '{}'); code = JSON.parse(sessionStorage.getItem('ash.sandbox.code') || 'null'); } catch (e) { }
    // Новый пример из урока заменяет прошлый черновик песочницы
    if (src.html && (!code || code.from !== src.html)) code = null;
    return { ...SANDBOX, html: src.html || '<h1>Песочница</h1>\n<p>Пишите здесь любой HTML.</p>', from: src.from, fromTitle: src.title, code };
  }

  function open(id) {
    if (id === 'sandbox') task = sandboxTask();
    else task = TASKS.find(t => t.id === id);
    if (!task) { location.hash = ''; return; }
    if (!task.sandbox && access(task) !== 'open') { toast('Это задание откроется вместе с уроком.'); location.hash = ''; return; }
    $('list-view').hidden = true; $('task-view').hidden = false;
    document.title = `${task.title} · Задания · Пепельный Пиксель`;
    const lesson = task.sandbox ? LESSONS.find(l => l.id === task.from) : lessonOf(task);
    const num = lesson ? window.Economy.lessonTasks(lesson).indexOf(task.id) + 1 : 0;
    $('t-mech').textContent = task.sandbox ? (lesson ? `Песочница · ${lesson.title}` : 'Песочница')
      : lesson ? `${lesson.session ? `Занятие ${lesson.session}` : `Урок ${lesson.lesson}`} · задание ${num} · ${MECH[task.mech].title}`
      : `Задание ${task.id.slice(1)} · ${MECH[task.mech].title}`;
    $('t-lesson').hidden = !lesson;
    if (lesson) $('t-lesson').href = `lessons.html#${lesson.id}`;
    $('t-title').textContent = task.title;
    $('t-story').textContent = task.story || '';
    $('t-story').hidden = !task.story;
    $('t-goal').textContent = task.goal;
    $('t-meta').innerHTML = task.sandbox ? '' : `<span>${task.level}</span><span>Базовый балл ${task.points}</span><span>Чистота до +${Math.round(task.points * E.CLEAN_SHARE)}</span><span>Скорость до +${Math.round(task.points * E.SPEED_SHARE)} за ${task.minutes} мин</span>`;
    try { hintsShown = +sessionStorage.getItem('ash.hints.' + task.id) || 0; } catch (e) { hintsShown = 0; }
    renderHints();
    // В песочнице нет проверки, таймера и очков
    document.querySelector('.brief-checks').hidden = !!task.sandbox;
    $('timer').hidden = !!task.sandbox; $('run').hidden = !!task.sandbox;
    $('restart').textContent = task.sandbox ? 'Вернуть пример из урока' : 'Начать заново';
    $('tab-js').hidden = !hasJs();
    const s = task.sandbox ? null : St.taskState(task.id);
    const code = task.sandbox ? (task.code || { html: task.html, css: '', js: '' }) : s && s.code ? s.code : { html: task.html, css: task.css, js: task.js };
    ed.html.setValue(code.html || ''); ed.css.setValue(code.css || ''); ed.js.setValue(code.js != null ? code.js : (task.js || ''));
    FILES.forEach(k => ed[k].clearHistory());
    if (task.sandbox) { clearInterval(tick); try { sessionStorage.setItem('ash.sandbox.code', JSON.stringify({ ...codeNow(), from: task.html })); } catch (e) { } }
    else { startedAt = Date.parse(St.startTask(task.id)); clearInterval(tick); clock(); tick = setInterval(clock, 1000); }
    // Фрагменты для «Собери макет»
    $('frag-box').hidden = !task.fragments;
    $('frags').innerHTML = (task.fragments || []).map((f, i) => `<button type="button" class="frag" data-f="${i}"><span class="lang">${f.lang.toUpperCase()}</span>${esc(f.label.replace(/ \(ловушка\)$/, ''))}<code>${esc(f.code.split('\n')[0].slice(0, 60))}${f.code.length > 60 || f.code.includes('\n') ? '…' : ''}</code></button>`).join('');
    lastReport = null;
    renderChecks(null);
    $('result').hidden = true;
    tab('html'); updatePreview(); updateLintSum();
    window.scrollTo(0, 0);
    $('t-title').setAttribute('tabindex', '-1'); $('t-title').focus({ preventScroll: true });
  }
  function close() {
    task = null; clearInterval(tick);
    $('task-view').hidden = true; $('list-view').hidden = false;
    document.title = 'Задания · Пепельный Пиксель';
    renderList();
  }
  const route = () => { const id = location.hash.slice(1); if (/^(t\d\d|k\d{4}|sandbox)$/.test(id)) open(id); else close(); };
  window.addEventListener('hashchange', route);
  $('back').addEventListener('click', e => { e.preventDefault(); location.hash = ''; });

  $('frags').addEventListener('click', e => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    const f = task.fragments[b.dataset.f];
    tab(f.lang);
    const cm = ed[f.lang];
    // Если курсор стоит на заглушке-комментарии, заменяем её
    const line = cm.getCursor().line, txt = cm.getLine(line);
    if (/^\s*(<!--.*-->|\/\*.*\*\/)\s*$/.test(txt)) {
      const indent = txt.match(/^\s*/)[0];
      cm.replaceRange(indent + f.code.replace(/\n/g, '\n' + indent), CM.Pos(line, 0), CM.Pos(line, txt.length));
    } else cm.replaceSelection((cm.getCursor().ch ? '\n' : '') + f.code + '\n');
    cm.focus();
    b.classList.add('used');
    if (sfx.click) sfx.click();
  });

  $('restart').addEventListener('click', () => {
    if (!task) return;
    if (task.sandbox) { ed.html.setValue(task.html); ed.css.setValue(''); ed.js.setValue(''); toast('Код вернулся к примеру из урока.'); return; }
    startedAt = Date.parse(St.restartTask(task.id));
    ed.html.setValue(task.html); ed.css.setValue(task.css); ed.js.setValue(task.js || '');
    renderChecks(null); $('result').hidden = true; clock();
    toast('Код вернулся к шаблону, таймер запущен заново.');
  });

  $('run').addEventListener('click', async () => {
    if (!task) return;
    const btn = $('run'); btn.disabled = true; btn.textContent = 'ПРОВЕРЯЮ…';
    if (task.sandbox) return;
    const code = codeNow();
    let rep;
    try { rep = await R.run(task, code.html, code.css, code.js || ''); } finally { btn.disabled = false; btn.textContent = 'ПРОВЕРИТЬ'; }
    lastReport = rep;
    renderChecks(rep);
    // Очки считает Student (и затем сервер) по отчёту проверки и времени с открытия задания
    const res = St.recordTask(task, rep, code);
    if (res.ok === false) { toast(res.msg); return; }
    const sc = res.sc;
    renderResult(sc, res, rep);
    if (sc.solved) { if (sfx.lit) sfx.lit(); banner('bn-lit'); }
    else { if (sfx.death) sfx.death(); banner('bn-dead'); }
    announce(res.got);
  });

  function renderResult(sc, res, rep) {
    $('result').hidden = false;
    $('res-sub').textContent = sc.solved ? `Все требования выполнены за ${E.clock(sc.seconds)}` : `Требования: ${sc.fOk} из ${sc.fAll}. Бонусы начисляются, когда выполнены все.`;
    const best = St.taskState(task.id).best;
    const row = (label, val, max, note) => `<tr><th scope="row">${label}${note ? `<small>${note}</small>` : ''}</th><td class="num">${fmt(val)}</td><td class="num muted">из ${fmt(max)}</td></tr>`;
    const effText = { xp2: 'опыт ×2', souls15: 'души ×1,5', speed: 'полная скорость' };
    $('score').innerHTML = `
      <table class="score-table">
        <caption class="sr">Подсчёт очков</caption>
        <tbody>
          ${row('Базовый балл', sc.base, task.points, `проверок результата: ${sc.fOk} из ${sc.fAll}`)}
          ${row('Бонус за чистоту кода', sc.clean, Math.round(task.points * E.CLEAN_SHARE), `проверок качества: ${sc.qOk} из ${sc.qAll}`)}
          ${row('Бонус за скорость', sc.speed, Math.round(task.points * E.SPEED_SHARE), `${E.clock(sc.seconds)} при норме ${task.minutes} мин`)}
        </tbody>
        <tfoot>${row('Итого', sc.total, sc.max, `лучший результат: ${fmt(best)}`)}</tfoot>
      </table>
      <div class="gain ${res.delta ? 'up' : ''}">
        ${res.delta ? `<p class="big">+${fmt(res.gains.xp)} XP · +${fmt(res.gains.souls)} душ</p><p>Прирост к лучшему результату: ${fmt(res.delta)}${res.effects.length ? ` · бустеры: ${res.effects.map(e => effText[e]).join(', ')}` : ''}</p>`
          : `<p class="big">Без награды</p><p>${sc.total ? 'Результат не лучше прошлого. Награда даётся только за прирост.' : 'Пока ни одно требование не выполнено.'}</p>`}
        <p class="lvl">Уровень: ${St.level().title} · ${fmt(St.state.xp)} XP · ${fmt(St.state.souls)} душ</p>
      </div>`;
    const errs = rep.lint.filter(m => m.type === 'error');
    $('lint-list').innerHTML = errs.length
      ? `<h3 class="h3">Линтер нашёл ошибки</h3><ul class="lint">${errs.map(m => `<li><b>${m.lang}${m.line ? `, строка ${m.line}` : ''}</b> ${esc(m.message)}</li>`).join('')}</ul>`
      : `<p class="lint-ok">Линтер ${hasJs() ? 'HTML, CSS и JavaScript' : 'HTML и CSS'} ошибок не нашёл.</p>`;
    $('result').scrollIntoView({ behavior: window.Ash.reduce ? 'auto' : 'smooth', block: 'start' });
  }

  route();
})();
