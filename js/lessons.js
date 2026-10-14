/* Уроки и лекции.
   Уроки — Markdown из content/lessons: описание и квиз собраны в js/content.js, текст урока лежит в content/md/<id>.md
   и подгружается, когда урок открыт. У урока может быть несколько заданий (поле tasks).
   Под примерами HTML — кнопка «Попробовать»: код открывается в песочнице tasks.html#sandbox.
   Лекции — то, что администратор загрузил в админке: конспект, видео, файл PDF или Word.
   Адреса: lessons.html#html-structure — урок, lessons.html#lecture-l2 — лекция,
   lessons.html#course-c6 — уроки одного курса (только его темы; сюда ведёт кнопка «Открыть» в кабинете).
   Скрытые администратором уроки и темы здесь не показываются никому. */
(() => {
  const { $, esc, fmt, toast, announce } = window.UI;
  const St = window.Student, A = window.AdminStore, Files = window.AshFiles;
  const LESSONS = window.LESSONS, TASKS = window.TASKS, MECH = window.TASK_MECHANICS;
  const { banner, sfx = {} } = window.Ash;
  // Темы — из админки, в том порядке, в каком они там идут; номер темы — её место в списке
  const MODULES = A.db.modules.map((m, i) => ({ id: m.id, title: m.title, n: i + 1 }));
  const modN = id => MODULES.find(m => m.id === id)?.n || '';
  const myGroup = window.STUDENT.group.code;
  const myGroupId = A.db.groups.find(g => g.code === myGroup)?.id;
  const LEVELS = { easy: 'Лёгкая', base: 'Средняя', hard: 'Сложная' };
  // Какие уроки видны и можно ли их проходить, решает преподаватель в разделе «Уроки групп» (js/student-logic.js)
  const group = A.db.groups.find(g => g.id === window.BOOT.me.group);
  const access = l => window.StudentLogic.lessonAccess(l, group, window.BOOT.me.role);
  const open = l => access(l) === 'open';
  const VISIBLE = LESSONS.filter(l => !l.hidden && !l.modHidden && access(l) !== 'hidden');
  // Курс, открытый кнопкой «Открыть» в кабинете: показываем только его темы
  let course = null;
  const inCourse = l => !course || !(course.modules || []).length || course.modules.includes(l.module);
  const modTitle = id => MODULES.find(m => m.id === id)?.title || '';
  const tasksOf = l => window.Economy.lessonTasks(l).map(id => TASKS.find(t => t.id === id)).filter(Boolean);
  const KIND = { lecture: 'Лекция', practice: 'Практическая работа' };
  const plural = (n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many;
  let blobUrl = null;

  // Текст урока: у уроков из админки он приходит сразу, у уроков курса — отдельным файлом
  const mdCache = new Map();
  async function markdownOf(l) {
    if (typeof l.markdown === 'string') return l.markdown;
    if (mdCache.has(l.id)) return mdCache.get(l.id);
    const r = await fetch(`content/md/${encodeURIComponent(l.id)}.md${l.md ? '?v=' + l.md : ''}`);
    if (!r.ok) throw new Error('текст урока не найден');
    const text = await r.text();
    mdCache.set(l.id, text);
    return text;
  }

  /* ---------- список ---------- */
  function lessonStatus(l) {
    if (!open(l)) return { cls: 'locked', text: 'откроется, когда преподаватель разрешит' };
    const s = St.lessonState(l.id), ts = tasksOf(l), solved = ts.filter(t => St.taskState(t.id)?.solved).length;
    const parts = [];
    if (s && s.quizMax) parts.push(`квиз ${s.quiz} из ${s.quizMax}`);
    if (ts.length && solved) parts.push(ts.length === 1 ? 'задание решено' : `заданий решено ${solved} из ${ts.length}`);
    if (window.Economy.lessonDone(l, St.state)) return { cls: 'done', text: parts.join(' · ') };
    if (s && s.read) return { cls: 'started', text: parts.join(' · ') || 'прочитан' };
    return { cls: 'new', text: 'не начат' };
  }
  // Администратор видит лекции всех групп, студент — только своей (файлы сервер всё равно отдаёт по тем же правилам)
  const lectures = () => A.db.lectures.filter(l => l.published && (window.Ash.isAdmin() || !l.groups || !l.groups.length || l.groups.includes(myGroupId)));

  function renderList() {
    const used = MODULES.filter(m => VISIBLE.some(l => l.module === m.id && inCourse(l)));
    $('list-title').textContent = course ? course.title : 'Уроки';
    $('course-bar').hidden = !course; $('list-lead').hidden = !!course;
    if (course) $('course-text').textContent = course.text ? course.text + '.' : '';
    $('mat-plate').hidden = !!course;
    $('modules').innerHTML = !used.length ? `<section class="plate"><p class="empty">${course ? 'В этом курсе пока нет открытых вам уроков.' : 'Преподаватель ещё не добавил уроки вашей группе.'}</p></section>` : used.map((m, i) => {
      const ls = VISIBLE.filter(l => l.module === m.id).sort((a, b) => a.lesson - b.lesson);
      const done = ls.filter(l => lessonStatus(l).cls === 'done').length;
      return `<section class="plate module" aria-labelledby="mod-${m.id}">
        <div class="plate-head"><span class="mod-n">${course ? i + 1 : m.n}</span><h2 id="mod-${m.id}">${esc(m.title)}</h2><p class="plate-sub">пройдено ${done} из ${ls.length}</p></div>
        <div class="bar hp" role="progressbar" aria-label="Модуль «${esc(m.title)}»" aria-valuemin="0" aria-valuemax="${ls.length}" aria-valuenow="${done}"><i style="--w:${done / ls.length * 100}%"></i></div>
        <ol class="lesson-list">${ls.map(l => {
          const s = lessonStatus(l), ts = tasksOf(l);
          const taskMeta = !ts.length ? '' : ts.length === 1 ? `<span>задание: ${esc(ts[0].title)}, ${ts[0].minutes} мин</span>`
            : `<span>${ts.length} ${plural(ts.length, 'задание', 'задания', 'заданий')}, ${ts.reduce((a, t) => a + t.minutes, 0)} мин</span>`;
          return `<li class="lesson-item ${s.cls}${l.kind === 'practice' ? ' practice' : ''}">
            <span class="ln">${l.session || l.lesson}</span>
            <div><h3>${s.cls === 'locked' ? esc(l.title) : `<a href="#${l.id}">${esc(l.title)}</a>`}</h3>
              <p class="meta">${l.kind ? `<span class="kind">${KIND[l.kind]}</span>` : ''}<span>${esc(l.difficulty || '')}</span><span>${l.minutes >= 120 && l.minutes % 60 === 0 ? l.minutes / 60 + ' ч' : l.minutes + ' мин'}</span>${taskMeta}</p>
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
  let renderId = 0;
  async function renderLesson(l) {
    const my = ++renderId;
    // У занятий курса номер темы уже в её названии (08.01.01 · …), поэтому показываем номер занятия
    $('ls-crumb').textContent = l.session ? `${modTitle(l.module)} · занятие ${l.session}` : `Тема ${modN(l.module)} · ${modTitle(l.module)} · урок ${l.lesson}`;
    $('ls-title').textContent = l.title;
    $('ls-meta').innerHTML = `${l.kind ? `<span class="kind">${KIND[l.kind]}</span>` : ''}<span>Сложность: ${esc(l.difficulty || '')}</span><span>${l.minutes >= 120 && l.minutes % 60 === 0 ? `${l.minutes / 60} ч (${l.minutes} мин)` : l.minutes + ' мин'}</span>`;
    document.title = `${l.title} · Уроки · Пепельный Пиксель`;
    if (!open(l)) {
      $('ls-body').innerHTML = `<p>Этот урок откроется, когда преподаватель разрешит его проходить.</p>`;
      document.querySelector('.quiz').hidden = true; document.querySelector('.mini').hidden = true; $('ls-nav').innerHTML = '';
      return;
    }
    // Квиз и мини-задание у урока из админки могут отсутствовать
    document.querySelector('.quiz').hidden = !(l.quiz && l.quiz.length); document.querySelector('.mini').hidden = !tasksOf(l).length;
    $('ls-body').innerHTML = '<p class="loading">Открываю урок…</p>';
    let md;
    try { md = await markdownOf(l); } catch (e) {
      if (my === renderId) $('ls-body').innerHTML = `<p class="note">Не получилось загрузить текст урока: ${esc(e.message)}. Обновите страницу.</p>`;
      return;
    }
    if (my !== renderId) return;
    St.markRead(l.id);
    $('ls-body').innerHTML = window.marked.parse(md);
    $('ls-body').querySelectorAll('table').forEach(t => { const w = document.createElement('div'); w.className = 'table-wrap'; t.replaceWith(w); w.appendChild(t); });
    $('ls-body').querySelectorAll('pre').forEach(p => {
      p.tabIndex = 0; p.setAttribute('aria-label', 'Пример кода');
      const code = p.querySelector('code');
      if (!code || !/language-html\b/.test(code.className)) return;
      // HTML-пример можно открыть в песочнице и поменять
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'try'; b.textContent = 'Попробовать';
      b.addEventListener('click', () => {
        try { sessionStorage.setItem('ash.sandbox', JSON.stringify({ html: code.textContent, from: l.id, title: l.title })); } catch (e) { }
        location.href = 'tasks.html#sandbox';
      });
      p.after(b);
    });
    if (l.quiz && l.quiz.length) renderQuiz(l);
    renderMini(l);
    const list = VISIBLE.filter(l => open(l) && inCourse(l)).sort((a, b) => (modN(a.module) || 99) - (modN(b.module) || 99) || a.lesson - b.lesson);
    const i = list.indexOf(l), prev = list[i - 1], next = list[i + 1];
    $('ls-nav').innerHTML = `${prev ? `<a href="#${prev.id}" class="prev">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="#${next.id}" class="next">${esc(next.title)} →</a>` : ''}`;
  }

  function renderQuiz(l) {
    const s = St.lessonState(l.id) || {};
    $('quiz-sub').textContent = s.quizMax ? `лучший результат ${s.quiz} из ${s.quizMax}` : `${l.quiz.length} ${plural(l.quiz.length, 'вопрос', 'вопроса', 'вопросов')} · 20 XP и 20 душ за каждый новый верный ответ`;
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
      const res = St.recordQuiz(l.id, answers);
      $('quiz-note').textContent = `Верно ${ok} из ${l.quiz.length}.` + (res.gain ? ` +${res.gain} XP и +${res.gain} душ.` : ok === l.quiz.length ? '' : ' Попробуйте ещё раз: награда за новые верные ответы.');
      if (ok === l.quiz.length) { if (sfx.lit) sfx.lit(); banner('bn-lit'); } else if (sfx.error) sfx.error();
      announce(res.got);
      $('quiz-sub').textContent = `лучший результат ${St.lessonState(l.id).quiz} из ${l.quiz.length}`;
    };
  }

  function renderMini(l) {
    const ts = tasksOf(l);
    $('mini-title').textContent = ts.length > 1 ? `Задания (${ts.length})` : 'Задание';
    $('mini').innerHTML = (ts.length > 1 ? `<p class="mini-note">Решайте по порядку. Урок будет пройден, когда сданы все задания и квиз решён без ошибок. Всего ≈ ${ts.reduce((a, t) => a + t.minutes, 0)} мин.</p>` : '') + ts.map((t, i) => {
      const s = St.taskState(t.id);
      const max = Math.round(t.points * 1.7);
      return `<div class="mini-card${s && s.solved ? ' solved' : ''}">
      <div><p class="eyebrow">${ts.length > 1 ? `Задание ${i + 1} · ` : ''}${MECH[t.mech].title} · ${t.level}</p><h3>${esc(t.title)}</h3><p>${esc(t.goal)}</p>
        <p class="meta"><span>норма ${t.minutes} мин</span><span>до ${fmt(max)} очков</span><span>автопроверка: ${t.tests.length} ${plural(t.tests.length, 'требование', 'требования', 'требований')} + качество кода</span></p></div>
      <div class="mini-act">${s && s.solved ? `<p class="done">Решено · ${fmt(s.best)} из ${fmt(max)}</p>` : ''}<a class="btn" href="tasks.html#${t.id}">${s && s.solved ? 'ПЕРЕРЕШАТЬ' : s ? 'ПРОДОЛЖИТЬ' : 'НАЧАТЬ'}</a></div>
    </div>`;
    }).join('');
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
    const lesson = VISIBLE.find(l => l.id === h);
    const lecture = h.startsWith('lecture-') && lectures().find(l => l.id === h.slice(8));
    if (lesson) { show('lesson-view'); renderLesson(lesson); window.scrollTo(0, 0); $('ls-title').focus({ preventScroll: true }); }
    else if (lecture) { show('mat-view'); renderLecture(lecture); window.scrollTo(0, 0); $('mt-title').focus({ preventScroll: true }); }
    else {
      // #course-c6 — уроки курса; курс запоминаем, чтобы «← Все уроки» из урока вернул в тот же курс
      if (h.startsWith('course-')) course = (window.BOOT.db.courses || []).find(c => c.id === h.slice(7)) || null;
      else course = null;
      show('list-view'); document.title = `${course ? course.title : 'Уроки'} · Пепельный Пиксель`; renderList();
    }
  }
  document.querySelectorAll('[data-back]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); location.hash = course ? 'course-' + course.id : ''; }));
  window.addEventListener('hashchange', route);
  route();
})();
