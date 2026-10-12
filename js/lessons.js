/* Уроки и лекции.
   Уроки — Markdown из content/lessons (собраны в js/content.js): текст, код, квиз, мини-задание.
   Лекции — то, что администратор загрузил в админке: конспект, видео, файл PDF или Word.
   Адреса: lessons.html#html-structure — урок, lessons.html#lecture-l2 — лекция. */
(() => {
  const { $, esc, fmt, toast, announce } = window.UI;
  const St = window.Student, A = window.AdminStore, Files = window.AshFiles;
  const LESSONS = window.LESSONS, TASKS = window.TASKS, MECH = window.TASK_MECHANICS;
  const { banner, sfx = {} } = window.Ash;
  const MODULES = window.STUDENT.modules.map((m, i) => ({ id: 'm' + (i + 1), title: m.title }));
  const myGroup = window.STUDENT.group.code;
  const myGroupId = A.db.groups.find(g => g.code === myGroup)?.id;
  const LEVELS = { easy: 'Лёгкая', base: 'Средняя', hard: 'Сложная' };
  const open = l => !l.groups.length || l.groups.includes(myGroup);
  const modTitle = id => MODULES.find(m => m.id === id)?.title || '';
  let blobUrl = null;

  /* ---------- список ---------- */
  function lessonStatus(l) {
    if (!open(l)) return { cls: 'locked', text: `только для групп ${l.groups.join(', ')}` };
    const s = St.lessonState(l.id), t = St.taskState(l.task);
    const parts = [];
    if (s && s.quizMax) parts.push(`квиз ${s.quiz} из ${s.quizMax}`);
    if (t && t.solved) parts.push('задание решено');
    if (window.Economy.lessonDone(l, St.state)) return { cls: 'done', text: parts.join(' · ') };
    if (s && s.read) return { cls: 'started', text: parts.join(' · ') || 'прочитан' };
    return { cls: 'new', text: 'не начат' };
  }
  // Администратор видит лекции всех групп, студент — только своей (файлы сервер всё равно отдаёт по тем же правилам)
  const lectures = () => A.db.lectures.filter(l => l.published && (window.Ash.isAdmin() || !l.groups || !l.groups.length || l.groups.includes(myGroupId)));

  function renderList() {
    const used = MODULES.filter(m => LESSONS.some(l => l.module === m.id));
    $('modules').innerHTML = used.map((m, i) => {
      const ls = LESSONS.filter(l => l.module === m.id).sort((a, b) => a.lesson - b.lesson);
      const done = ls.filter(l => lessonStatus(l).cls === 'done').length;
      return `<section class="plate module" aria-labelledby="mod-${m.id}">
        <div class="plate-head"><span class="mod-n">${m.id.slice(1)}</span><h2 id="mod-${m.id}">${esc(m.title)}</h2><p class="plate-sub">пройдено ${done} из ${ls.length}</p></div>
        <div class="bar hp" role="progressbar" aria-label="Модуль «${esc(m.title)}»" aria-valuemin="0" aria-valuemax="${ls.length}" aria-valuenow="${done}"><i style="--w:${done / ls.length * 100}%"></i></div>
        <ol class="lesson-list">${ls.map(l => {
          const s = lessonStatus(l), task = TASKS.find(t => t.id === l.task);
          return `<li class="lesson-item ${s.cls}">
            <span class="ln">${l.lesson}</span>
            <div><h3>${s.cls === 'locked' ? esc(l.title) : `<a href="#${l.id}">${esc(l.title)}</a>`}</h3>
              <p class="meta"><span>${esc(l.difficulty)}</span><span>${l.minutes} мин</span><span>мини-задание: ${esc(task?.title || '')}, ${task?.minutes} мин</span></p>
              <p class="st">${s.cls === 'locked' ? '🔒 ' : ''}${esc(s.text)}</p></div></li>`;
        }).join('')}</ol>
      </section>`;
    }).join('');
    const mats = lectures();
    $('mat-sub').textContent = mats.length ? `${mats.length} для группы ${myGroup}` : '';
    $('mat-list').innerHTML = mats.map(l => `<li class="mat">
        <span class="mat-kind k-${l.file ? l.file.kind : 'none'}">${l.file ? Files.KINDS[l.file.kind].label : 'Текст'}</span>
        <div><h3><a href="#lecture-${l.id}">${esc(l.title)}</a></h3>
          <p class="meta"><span>${esc(modTitle(l.module))}</span><span>${LEVELS[l.difficulty] || ''}</span><span>${l.minutes} мин</span>${l.file ? `<span>${esc(l.file.name)} · ${Files.size(l.file.size)}</span>` : ''}${l.video ? '<span>есть видео</span>' : ''}</p></div></li>`).join('')
      || '<li class="empty">Преподаватель пока не выложил лекции для вашей группы.</li>';
  }

  /* ---------- урок ---------- */
  function renderLesson(l) {
    $('ls-crumb').textContent = `Модуль ${l.module.slice(1)} · ${modTitle(l.module)} · урок ${l.lesson}`;
    $('ls-title').textContent = l.title;
    $('ls-meta').innerHTML = `<span>Сложность: ${esc(l.difficulty)}</span><span>${l.minutes} мин</span><span>Группы: ${l.groups.length ? esc(l.groups.join(', ')) : 'все'}</span>`;
    document.title = `${l.title} · Уроки · Пепельный Пиксель`;
    if (!open(l)) {
      $('ls-body').innerHTML = `<p>Этот урок открыт только для групп ${esc(l.groups.join(', '))}. Ваша группа — ${esc(myGroup)}.</p>`;
      document.querySelector('.quiz').hidden = true; document.querySelector('.mini').hidden = true; $('ls-nav').innerHTML = '';
      return;
    }
    document.querySelector('.quiz').hidden = false; document.querySelector('.mini').hidden = false;
    St.markRead(l.id);
    $('ls-body').innerHTML = window.marked.parse(l.markdown);
    $('ls-body').querySelectorAll('table').forEach(t => { const w = document.createElement('div'); w.className = 'table-wrap'; t.replaceWith(w); w.appendChild(t); });
    $('ls-body').querySelectorAll('pre').forEach(p => { p.tabIndex = 0; p.setAttribute('aria-label', 'Пример кода'); });
    renderQuiz(l);
    renderMini(l);
    const list = LESSONS.filter(open);
    const i = list.indexOf(l), prev = list[i - 1], next = list[i + 1];
    $('ls-nav').innerHTML = `${prev ? `<a href="#${prev.id}" class="prev">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="#${next.id}" class="next">${esc(next.title)} →</a>` : ''}`;
  }

  function renderQuiz(l) {
    const s = St.lessonState(l.id) || {};
    $('quiz-sub').textContent = s.quizMax ? `лучший результат ${s.quiz} из ${s.quizMax}` : `${l.quiz.length} вопроса · 20 XP и 20 душ за каждый новый верный ответ`;
    $('quiz-form').innerHTML = l.quiz.map((q, i) => `
      <fieldset class="q" data-q="${i}">
        <legend><span class="qn">${i + 1}</span>${window.marked.parseInline(q.q)}</legend>
        ${q.options.map((o, k) => `<label class="opt"><input type="radio" name="q${i}" value="${k}"> <span>${window.marked.parseInline(o)}</span></label>`).join('')}
        <p class="explain" hidden></p>
      </fieldset>`).join('') + `<div class="quiz-actions"><button type="submit" class="btn">ПРОВЕРИТЬ ОТВЕТЫ</button><p class="note" id="quiz-note" role="status"></p></div>`;
    $('quiz-form').onsubmit = e => {
      e.preventDefault();
      const answers = l.quiz.map((q, i) => { const c = $('quiz-form').querySelector(`input[name=q${i}]:checked`); return c ? Number(c.value) : null; });
      if (answers.some(a => a === null)) { $('quiz-note').textContent = 'Ответьте на все вопросы.'; if (sfx.error) sfx.error(); return; }
      let ok = 0;
      l.quiz.forEach((q, i) => {
        const fs = $('quiz-form').querySelector(`[data-q="${i}"]`), right = answers[i] === q.answer;
        if (right) ok++;
        fs.classList.toggle('right', right); fs.classList.toggle('wrong', !right);
        fs.querySelectorAll('.opt').forEach((o, k) => { o.classList.toggle('is-answer', k === q.answer); o.classList.toggle('is-picked', k === answers[i]); });
        const ex = fs.querySelector('.explain'); ex.hidden = false;
        ex.innerHTML = `<b>${right ? 'Верно.' : 'Неверно.'}</b> ${window.marked.parseInline(q.explain || '')}`;
      });
      const res = St.recordQuiz(l.id, l.title, ok, l.quiz.length);
      $('quiz-note').textContent = `Верно ${ok} из ${l.quiz.length}.` + (res.gain ? ` +${res.gain} XP и +${res.gain} душ.` : ok === l.quiz.length ? '' : ' Попробуйте ещё раз: награда за новые верные ответы.');
      if (ok === l.quiz.length) { if (sfx.lit) sfx.lit(); banner('bn-lit'); } else if (sfx.error) sfx.error();
      announce(res.got);
      $('quiz-sub').textContent = `лучший результат ${St.lessonState(l.id).quiz} из ${l.quiz.length}`;
    };
  }

  function renderMini(l) {
    const t = TASKS.find(x => x.id === l.task); if (!t) { $('mini').innerHTML = ''; return; }
    const s = St.taskState(t.id);
    const max = Math.round(t.points * 1.7);
    $('mini').innerHTML = `<div class="mini-card">
      <div><p class="eyebrow">${MECH[t.mech].title} · ${t.level}</p><h3>${esc(t.title)}</h3><p>${esc(t.goal)}</p>
        <p class="meta"><span>норма ${t.minutes} мин</span><span>до ${fmt(max)} очков</span><span>автопроверка: ${t.tests.length} требований + качество кода</span></p></div>
      <div class="mini-act">${s && s.solved ? `<p class="done">Решено · ${fmt(s.best)} из ${fmt(max)}</p>` : ''}<a class="btn" href="tasks.html#${t.id}">${s && s.solved ? 'ПЕРЕРЕШАТЬ' : s ? 'ПРОДОЛЖИТЬ' : 'НАЧАТЬ'}</a></div>
    </div>`;
  }

  /* ---------- лекция ---------- */
  async function renderLecture(l) {
    $('mt-crumb').textContent = `Лекция · ${modTitle(l.module)}`;
    $('mt-title').textContent = l.title;
    $('mt-meta').innerHTML = `<span>${LEVELS[l.difficulty] || ''}</span><span>${l.minutes} мин</span>${l.video ? `<a href="${esc(l.video)}" target="_blank" rel="noopener">Смотреть видео</a>` : ''}`;
    document.title = `${l.title} · Лекции · Пепельный Пиксель`;
    $('mt-body').innerHTML = (l.content || '').split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
    $('mt-body').hidden = !l.content;
    const box = $('mt-file');
    if (!l.file) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<p class="loading">Открываю «${esc(l.file.name)}»…</p>`;
    try {
      const rec = await Files.get(l.file.id);
      if (!rec) throw new Error('файл не найден на сервере');
      blobUrl = URL.createObjectURL(rec.data);
      const head = `<div class="doc-head"><span class="mat-kind k-${rec.kind}">${Files.KINDS[rec.kind].label}</span><b>${esc(rec.name)}</b><span class="plate-sub">${Files.size(rec.size)}</span>
        <a href="${blobUrl}" download="${esc(rec.name)}">Скачать</a>${rec.kind === 'pdf' ? `<a href="${blobUrl}" target="_blank" rel="noopener">Открыть в новой вкладке</a>` : ''}</div>`;
      if (rec.kind === 'pdf') box.innerHTML = head + `<iframe class="pdf" src="${blobUrl}" title="${esc(rec.name)}"></iframe>`;
      else {
        await loadMammoth();
        const out = await window.mammoth.convertToHtml({ arrayBuffer: await rec.data.arrayBuffer() });
        box.innerHTML = head + `<div class="docx prose">${clean(out.value) || '<p>Документ пустой.</p>'}</div>`;
      }
    } catch (e) {
      box.innerHTML = `<p class="note">Не получилось открыть файл: ${esc(e.message)}. Попробуйте обновить страницу или напишите куратору.</p>`;
    }
  }
  // Word-документ превращается в HTML; на всякий случай убираем всё, что может выполнять код
  function clean(html) {
    const t = document.createElement('template'); t.innerHTML = html;
    t.content.querySelectorAll('script,style,iframe,object,embed').forEach(n => n.remove());
    t.content.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => { if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name); }));
    return t.innerHTML;
  }
  let mammothP;
  const loadMammoth = () => mammothP || (mammothP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'vendor/mammoth/mammoth.browser.min.js';
    s.onload = res; s.onerror = () => rej(new Error('не загрузился конвертер Word')); document.head.appendChild(s);
  }));

  /* ---------- маршрут ---------- */
  function show(view) {
    ['list-view', 'lesson-view', 'mat-view'].forEach(v => { $(v).hidden = v !== view; });
    if (blobUrl && view !== 'mat-view') { URL.revokeObjectURL(blobUrl); blobUrl = null; }
  }
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const lesson = LESSONS.find(l => l.id === h);
    const lecture = h.startsWith('lecture-') && lectures().find(l => l.id === h.slice(8));
    if (lesson) { show('lesson-view'); renderLesson(lesson); window.scrollTo(0, 0); $('ls-title').focus({ preventScroll: true }); }
    else if (lecture) { show('mat-view'); renderLecture(lecture); window.scrollTo(0, 0); $('mt-title').focus({ preventScroll: true }); }
    else { show('list-view'); document.title = 'Уроки · Пепельный Пиксель'; renderList(); }
  }
  document.querySelectorAll('[data-back]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); location.hash = ''; }));
  window.addEventListener('hashchange', route);
  route();
})();
