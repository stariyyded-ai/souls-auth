/* Страница заданий: список 25 испытаний и рабочее место с редактором CodeMirror, линтером, предпросмотром и автопроверкой.
   Адрес задания: tasks.html#t07. */
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
  let mechFilter = 'all';
  $('mech-filter').innerHTML = `<button type="button" class="chip on" data-m="all">Все</button>` +
    Object.entries(MECH).map(([k, m]) => `<button type="button" class="chip" data-m="${k}">${m.title}</button>`).join('');
  chips('mech-filter', 'm', v => { mechFilter = v; renderList(); });

  function status(t) {
    const s = St.taskState(t.id);
    if (s && s.solved) return { cls: 'solved', text: `решено · ${fmt(s.best)} из ${fmt(maxPoints(t))}` };
    if (s && (s.attempts || s.code)) return { cls: 'started', text: s.attempts ? `попыток: ${s.attempts}` : 'начато' };
    return { cls: 'new', text: 'новое' };
  }
  function renderList() {
    const st = St.state;
    const solved = TASKS.filter(t => st.tasks[t.id]?.solved).length;
    const pts = TASKS.reduce((a, t) => a + (st.tasks[t.id]?.best || 0), 0);
    $('sum-solved').textContent = `${solved} / ${TASKS.length}`;
    $('sum-points').textContent = fmt(pts);
    const bar = $('sum-bar');
    bar.querySelector('i').style.setProperty('--w', (solved / TASKS.length * 100) + '%');
    bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', TASKS.length); bar.setAttribute('aria-valuenow', solved);
    $('boosts').innerHTML = boostsHTML();
    $('mech-list').innerHTML = Object.entries(MECH).filter(([k]) => mechFilter === 'all' || mechFilter === k).map(([k, m]) => `
      <section class="plate mech" aria-labelledby="m-${k}">
        <div class="plate-head"><span class="mech-ico">${icon(MECH_ICON[k], 4)}</span><h2 id="m-${k}">${m.title}</h2><p class="plate-sub">${m.text}</p></div>
        <ul class="task-grid">${TASKS.filter(t => t.mech === k).map(t => {
          const s = status(t);
          return `<li class="task-card ${s.cls}">
            <span class="num">${t.id.slice(1)}</span>
            <div class="tc-body">
              <h3><a href="#${t.id}">${esc(t.title)}</a></h3>
              <p class="tc-meta"><span>${t.level}</span><span>норма ${t.minutes} мин</span><span>до ${fmt(maxPoints(t))} очков</span></p>
              <p class="tc-status">${s.text}</p>
            </div></li>`;
        }).join('')}</ul>
      </section>`).join('');
  }

  /* ================= Рабочее место ================= */
  const CM = window.CodeMirror;
  CM.registerHelper('lint', 'html', text => R.htmlLint(text).map(m => ({ from: CM.Pos(m.line - 1, Math.max(0, m.col - 1)), to: CM.Pos(m.line - 1, m.col), message: m.message, severity: m.type })));
  CM.registerHelper('lint', 'css', text => R.cssLint(text).map(m => ({ from: CM.Pos(m.line - 1, Math.max(0, m.col - 1)), to: CM.Pos(m.line - 1, m.col + 3), message: m.message, severity: 'error' })));
  const common = { theme: 'ash', lineNumbers: true, lineWrapping: true, tabSize: 2, indentUnit: 2, matchBrackets: true, autoCloseBrackets: true, gutters: ['CodeMirror-lint-markers'], viewportMargin: Infinity };
  const ed = {
    html: CM($('pane-html'), { ...common, mode: 'htmlmixed', autoCloseTags: true, lint: { lintOnChange: true, delay: 400 }, screenReaderLabel: 'Код HTML' }),
    css: CM($('pane-css'), { ...common, mode: 'css', lint: { lintOnChange: true, delay: 400 }, screenReaderLabel: 'Код CSS' })
  };
  let task = null, startedAt = 0, tick, saveTimer, pvTimer, pvWidth = 'desk', lastReport = null;

  function tab(which) {
    ['html', 'css'].forEach(k => {
      $('tab-' + k).setAttribute('aria-selected', String(k === which));
      $('tab-' + k).tabIndex = k === which ? 0 : -1;
      $('pane-' + k).hidden = k !== which;
    });
    ed[which].refresh();
  }
  $('tab-html').addEventListener('click', () => tab('html'));
  $('tab-css').addEventListener('click', () => tab('css'));
  document.querySelector('.ed-tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = $('tab-html').getAttribute('aria-selected') === 'true' ? 'css' : 'html';
    tab(next); $('tab-' + next).focus();
  });

  function updatePreview() { $('preview').srcdoc = R.page(ed.html.getValue(), ed.css.getValue()); }
  function updateLintSum() {
    const n = R.lint(ed.html.getValue(), ed.css.getValue()).filter(m => m.type === 'error').length;
    $('lint-sum').textContent = n ? `линтер: ошибок ${n}` : 'линтер: чисто';
    $('lint-sum').className = 'lint-sum ' + (n ? 'bad' : 'ok');
  }
  ['html', 'css'].forEach(k => ed[k].on('change', () => {
    clearTimeout(saveTimer); clearTimeout(pvTimer);
    saveTimer = setTimeout(() => task && St.saveDraft(task.id, { html: ed.html.getValue(), css: ed.css.getValue() }), 600);
    pvTimer = setTimeout(() => { updatePreview(); updateLintSum(); }, 350);
  }));
  chips('pv-size', 'w', v => { pvWidth = v; $('preview').classList.toggle('phone', v === 'phone'); });

  function clock() {
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
    const q = R.QUALITY.filter(x => !(task.skipQuality || []).includes(x.id));
    $('t-quality').innerHTML = q.map((t, i) => { const r = rep && rep.quality[i]; return checkLi(t.name, r ? (r.ok ? 'ok' : 'bad') : 'idle', r && !r.ok ? r.note : ''); }).join('');
  }

  function open(id) {
    task = TASKS.find(t => t.id === id);
    if (!task) { location.hash = ''; return; }
    $('list-view').hidden = true; $('task-view').hidden = false;
    document.title = `${task.title} · Задания · Пепельный Пиксель`;
    $('t-mech').textContent = `Задание ${task.id.slice(1)} · ${MECH[task.mech].title}`;
    $('t-title').textContent = task.title;
    $('t-story').textContent = task.story;
    $('t-goal').textContent = task.goal;
    $('t-meta').innerHTML = `<span>${task.level}</span><span>Базовый балл ${task.points}</span><span>Чистота до +${Math.round(task.points * E.CLEAN_SHARE)}</span><span>Скорость до +${Math.round(task.points * E.SPEED_SHARE)} за ${task.minutes} мин</span>`;
    const s = St.taskState(task.id);
    const code = s && s.code ? s.code : { html: task.html, css: task.css };
    ed.html.setValue(code.html); ed.css.setValue(code.css);
    ed.html.clearHistory(); ed.css.clearHistory();
    startedAt = Date.parse(St.startTask(task.id));
    clearInterval(tick); clock(); tick = setInterval(clock, 1000);
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
  const route = () => { const id = location.hash.slice(1); if (/^t\d\d$/.test(id)) open(id); else close(); };
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
    startedAt = Date.parse(St.restartTask(task.id));
    ed.html.setValue(task.html); ed.css.setValue(task.css);
    renderChecks(null); $('result').hidden = true; clock();
    toast('Код вернулся к шаблону, таймер запущен заново.');
  });

  $('run').addEventListener('click', async () => {
    if (!task) return;
    const btn = $('run'); btn.disabled = true; btn.textContent = 'ПРОВЕРЯЮ…';
    const html = ed.html.getValue(), css = ed.css.getValue();
    let rep;
    try { rep = await R.run(task, html, css); } finally { btn.disabled = false; btn.textContent = 'ПРОВЕРИТЬ'; }
    lastReport = rep;
    renderChecks(rep);
    // Очки считает Student (и затем сервер) по отчёту проверки и времени с открытия задания
    const res = St.recordTask(task, rep, { html, css });
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
      ? `<h3 class="h3">Линтер нашёл ошибки</h3><ul class="lint">${errs.map(m => `<li><b>${m.lang}, строка ${m.line}</b> ${esc(m.message)}</li>`).join('')}</ul>`
      : '<p class="lint-ok">Линтер HTML и CSS ошибок не нашёл.</p>';
    $('result').scrollIntoView({ behavior: window.Ash.reduce ? 'auto' : 'smooth', block: 'start' });
  }

  route();
})();
