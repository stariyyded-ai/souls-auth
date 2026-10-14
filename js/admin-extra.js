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
  const DIFF = ['Лёгкий', 'Средний', 'Сложный'];
  // Списки группы; у группы, которую ещё не настраивали, берём то, что ей сейчас открыто по старому правилу
  function lists(g) {
    const all = S.db.lessonList || [];
    if (Array.isArray(g.lessons)) return { lessons: g.lessons.slice(), open: (g.lessonsOpen || []).slice(), legacy: false };
    const open = all.filter(l => Logic.lessonAccess({ ...l, hidden: false, modHidden: false }, g, 'student') === 'open').map(l => l.id);
    return { lessons: open.slice(), open, legacy: true };
  }
  function save(g, lessons, open, text) {
    const keep = new Set(lessons);
    S.update('groups', g.id, { lessons: [...keep], lessonsOpen: [...new Set(open)].filter(id => keep.has(id)) }, 'уроки группы');
    toast(text);
  }

  /* ---------- тема ---------- */
  async function editModule(id) {
    const m = id ? S.byId('modules', id) : { title: '', lessons: 0 };
    let vals;
    const v = await A.modal({
      title: id ? 'Изменить тему' : 'Новая тема',
      body: `<div class="form">
        <div class="f full"><label for="mo-title">Название темы</label><input id="mo-title" type="text" maxlength="80" value="${esc(m.title)}" placeholder="Например, Анимации в CSS"></div>
        <div class="f"><label for="mo-n">Сколько уроков планируется</label><input id="mo-n" type="number" min="0" max="99" value="${m.lessons || 0}"><span class="hint">Для полосы прогресса. Можно оставить 0.</span></div></div>`,
      actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: id ? 'СОХРАНИТЬ' : 'СОЗДАТЬ', value: 'ok', primary: true }],
      onSubmit: val => {
        if (val !== 'ok') return null;
        vals = { title: $('mo-title').value.trim(), lessons: +$('mo-n').value || 0 };
        return vals.title.length < 2 ? 'Название темы — хотя бы 2 символа.' : null;
      }
    });
    if (v !== 'ok') return;
    if (await S.saveModule({ ...m, ...vals, id: id || S.uid('m') }, !id)) toast(id ? 'Тема сохранена.' : `Тема «${vals.title}» создана. Добавьте в неё уроки.`);
  }
  async function removeModule(id) {
    const m = S.byId('modules', id);
    if ((S.db.lessonList || []).some(l => l.module === id)) { toast('В теме есть уроки. Сначала удалите их или перенесите в другую тему.'); return; }
    if (await A.confirmBox('Удалить тему?', `Тема «${esc(m.title)}» пустая и будет удалена.`)) { if (await S.dropModule(id)) toast('Тема удалена.'); }
  }

  /* ---------- урок ---------- */
  const qBlock = (q = { q: '', options: ['', ''], answer: 0, explain: '' }) => `<fieldset class="le-q">
      <legend>Вопрос</legend>
      <textarea class="le-qt" rows="2" placeholder="Текст вопроса">${esc(q.q)}</textarea>
      <label class="lbl">Варианты ответа, каждый с новой строки</label>
      <textarea class="le-qo" rows="3" placeholder="Первый вариант&#10;Второй вариант">${esc(q.options.join('\n'))}</textarea>
      <div class="le-row"><label>Верный вариант № <input class="le-qa" type="number" min="1" max="8" value="${q.answer + 1}"></label>
        <button type="button" class="act danger le-qdel">Убрать вопрос</button></div>
      <input class="le-qe" type="text" placeholder="Пояснение после ответа (необязательно)" value="${esc(q.explain || '')}">
    </fieldset>`;
  async function editLesson(id, moduleId) {
    const src = id ? (S.db.lessonList || []).find(l => l.id === id) : null;
    if (src && typeof src.markdown !== 'string') {
      try { const r = await fetch(`content/md/${encodeURIComponent(src.id)}.md${src.md ? '?v=' + src.md : ''}`); if (!r.ok) throw new Error(); src.markdown = await r.text(); }
      catch (e) { toast('Не получилось загрузить текст урока. Обновите страницу.'); return; }
    }
    const l = src || { title: '', module: moduleId || S.db.modules[0]?.id, lesson: (S.db.lessonList || []).filter(x => x.module === moduleId).length + 1, minutes: 120, difficulty: 'Лёгкий', kind: 'lecture', markdown: '', quiz: [], tasks: [] };
    const lTasks = Array.isArray(l.tasks) && l.tasks.length ? l.tasks : l.task ? [l.task] : [];
    // Задания в списке: сначала задания курса по занятиям, потом испытания
    const lessonTitle = id => (S.db.lessonList || []).find(x => x.id === id);
    const taskOptions = sel => {
      const all = S.db.taskList || [];
      const course = all.filter(t => t.lesson), game = all.filter(t => !t.lesson);
      const opt = t => `<option value="${t.id}"${t.id === sel ? ' selected' : ''}>${esc(t.title)}</option>`;
      const byLesson = [...new Set(course.map(t => t.lesson))].map(lid => {
        const ll = lessonTitle(lid);
        return `<optgroup label="${esc(ll ? `${ll.session ? 'Занятие ' + ll.session : 'Урок ' + ll.lesson}. ${ll.title}` : lid)}">${course.filter(t => t.lesson === lid).map(opt).join('')}</optgroup>`;
      }).join('');
      return `<option value="">— нет —</option>${byLesson}${game.length ? `<optgroup label="Испытания">${game.map(opt).join('')}</optgroup>` : ''}`;
    };
    let item = null;
    const v = await A.modal({
      title: id ? 'Изменить урок' : 'Новый урок',
      wide: true,
      body: `${src?.builtin ? `<p class="hint">Урок из курса. Ваши правки заменят исходный текст${src.edited ? '; вернуть исходный можно кнопкой «Вернуть как было» в списке' : ''}.</p>` : ''}
        <div class="form">
        <div class="f full"><label for="le-title">Название урока</label><input id="le-title" type="text" maxlength="120" value="${esc(l.title)}"></div>
        <div class="f"><label for="le-mod">Тема</label><select id="le-mod">${S.db.modules.map(m => `<option value="${m.id}"${m.id === l.module ? ' selected' : ''}>${esc(m.title)}</option>`).join('')}</select></div>
        <div class="f"><label for="le-n">Номер в теме</label><input id="le-n" type="number" min="1" max="99" value="${l.lesson}"></div>
        <div class="f"><label for="le-kind">Вид занятия</label><select id="le-kind"><option value="lecture"${l.kind !== 'practice' ? ' selected' : ''}>Лекция</option><option value="practice"${l.kind === 'practice' ? ' selected' : ''}>Практическая работа</option></select></div>
        <div class="f"><label for="le-ses">Номер занятия в курсе</label><input id="le-ses" type="number" min="1" max="999" value="${l.session || ''}" placeholder="необязательно"></div>
        <div class="f"><label for="le-min">Минут на занятие</label><input id="le-min" type="number" min="1" max="600" value="${l.minutes}"></div>
        <div class="f"><label for="le-diff">Сложность</label><select id="le-diff">${DIFF.map(d => `<option${d === l.difficulty ? ' selected' : ''}>${d}</option>`).join('')}</select></div>
        <div class="f full"><span class="lbl">Задания урока, по порядку</span>
          <div class="le-tasks">${[0, 1, 2, 3].map(i => `<select id="le-task-${i}" class="le-task" aria-label="Задание ${i + 1}">${taskOptions(lTasks[i])}</select>`).join('')}</div>
          <span class="hint">Урок считается пройденным, когда прочитан, квиз решён без ошибок и все задания сданы.</span></div>
        <div class="f full"><div class="le-row"><label for="le-md">Текст урока</label><button type="button" class="act" id="le-pv">Показать как у студента</button></div>
          <textarea id="le-md" rows="14" spellcheck="true" placeholder="## Заголовок&#10;&#10;Обычный текст. **Жирный**, \`код\`, списки через «- ».&#10;&#10;\`\`\`html&#10;<p>Пример кода</p>&#10;\`\`\`">${esc(l.markdown || '')}</textarea>
          <span class="hint">Разметка Markdown: ## заголовок, **жирный**, \`код\`, списки через «- », блок кода между строками \`\`\`.</span>
          <div class="le-preview prose" id="le-preview" hidden></div></div>
        <div class="f full"><span class="lbl">Квиз</span><div id="le-quiz">${(l.quiz || []).map(qBlock).join('')}</div>
          <button type="button" class="btn ghost" id="le-qadd">+ ВОПРОС</button><span class="hint">Без вопросов квиза у урока не будет.</span></div>
        </div>`,
      actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: id ? 'СОХРАНИТЬ' : 'СОЗДАТЬ', value: 'ok', primary: true }],
      onSubmit: val => {
        if (val !== 'ok') return null;
        const quiz = [...document.querySelectorAll('#le-quiz .le-q')].map(f => ({
          q: f.querySelector('.le-qt').value.trim(),
          options: f.querySelector('.le-qo').value.split('\n').map(x => x.trim()).filter(Boolean),
          answer: (+f.querySelector('.le-qa').value || 1) - 1,
          explain: f.querySelector('.le-qe').value.trim()
        }));
        for (const [i, q] of quiz.entries()) {
          if (!q.q) return `Вопрос ${i + 1}: напишите текст вопроса.`;
          if (q.options.length < 2) return `Вопрос ${i + 1}: нужно хотя бы 2 варианта ответа.`;
          if (q.answer < 0 || q.answer >= q.options.length) return `Вопрос ${i + 1}: верный вариант — число от 1 до ${q.options.length}.`;
        }
        item = {
          id: id || S.uid('l'), title: $('le-title').value.trim(), module: $('le-mod').value, lesson: +$('le-n').value || 1,
          minutes: +$('le-min').value || 120, difficulty: $('le-diff').value, kind: $('le-kind').value, session: +$('le-ses').value || undefined,
          tasks: [...new Set([...document.querySelectorAll('.le-task')].map(x => x.value).filter(Boolean))], markdown: $('le-md').value, quiz,
          hidden: !!l.hidden
        };
        item.task = item.tasks[0] || null;
        if (item.title.length < 2) return 'Напишите название урока.';
        if (!item.markdown.trim()) return 'Напишите текст урока.';
        return null;
      },
      onOpen: () => {
        $('le-qadd').addEventListener('click', () => { $('le-quiz').insertAdjacentHTML('beforeend', qBlock()); $('le-quiz').lastElementChild.querySelector('textarea').focus(); });
        $('le-quiz').addEventListener('click', e => { if (e.target.closest('.le-qdel')) e.target.closest('.le-q').remove(); });
        $('le-pv').addEventListener('click', () => {
          const box = $('le-preview'), on = box.hidden;
          box.hidden = !on; $('le-pv').textContent = on ? 'Скрыть просмотр' : 'Показать как у студента';
          if (on) box.innerHTML = window.marked ? window.marked.parse($('le-md').value) : esc($('le-md').value);
        });
      }
    });
    if (v !== 'ok' || !item) return;
    // Изменённый урок из курса хранится под своим id: в первый раз — создаём запись, дальше — обновляем
    const isNew = !id || (src.builtin && !src.stored);
    if (await S.saveLesson(item, isNew)) toast(id ? `Урок «${item.title}» сохранён.` : `Урок «${item.title}» создан. Добавьте его группам галочкой «В группе».`);
  }
  // Удалить можно только свой урок; урок курса можно скрыть (кнопка «Скрыть» рядом)
  async function removeLesson(id) {
    const l = (S.db.lessonList || []).find(x => x.id === id);
    if (await A.confirmBox('Удалить урок?', `«${esc(l.title)}» будет удалён у всех групп. Прогресс студентов по нему перестанет учитываться. Если урок нужен потом, лучше нажмите «Скрыть».`)) {
      if (await S.dropLesson(id)) toast('Урок удалён.');
    }
  }
  /* Скрыть или показать урок и тему у выбранной группы (group.hiddenLessons, group.hiddenModules).
     Скрытое студенты группы не видят нигде: ни в «Уроках», ни в кабинете («Модули курса»), ни в заданиях; прогресс сохраняется. */
  function toggleForGroup(g, key, id, title, what) {
    const list = g[key] || [], on = !list.includes(id);
    S.update('groups', g.id, { [key]: on ? [...list, id] : list.filter(x => x !== id) }, 'скрытое у группы');
    const fem = what === 'Тема';
    toast(on ? `${what} «${title}» ${fem ? 'скрыта' : 'скрыт'} у группы ${g.code}.` : `${what} «${title}» снова ${fem ? 'видна' : 'виден'} группе ${g.code}.`);
  }
  /* Старое скрытие сразу у всех групп (поле hidden у урока и темы): здесь только снимается кнопкой «Показать всем».
     У неизменённого урока курса хранится только отметка { id, hidden, title }. */
  async function toggleLesson(id) {
    const l = (S.db.lessonList || []).find(x => x.id === id), hidden = !l.hidden;
    const raw = (S.db.lessons || []).find(o => o.id === id);
    const item = l.builtin && !l.edited ? { id, hidden, title: l.title } : { ...raw, hidden };
    if (await S.saveLesson(item, !l.stored)) toast(hidden ? `«${l.title}» скрыт от студентов.` : `«${l.title}» снова виден студентам.`);
  }
  async function toggleModule(id) {
    const m = S.byId('modules', id), hidden = !m.hidden;
    if (await S.saveModule({ ...m, hidden }, false)) toast(hidden ? `Тема «${m.title}» скрыта: её уроки студенты не видят.` : `Тема «${m.title}» снова видна студентам.`);
  }

  A.register('lessons', (root, st) => {
    const groups = S.db.groups;
    const all = S.db.lessonList || [];
    if (groups.length && !groups.some(g => g.id === st.group)) st.group = groups[0].id;
    const g = S.byId('groups', st.group), L = g ? lists(g) : { lessons: [], open: [], legacy: false };
    const added = new Set(L.lessons), open = new Set(L.open);
    const students = g ? S.db.users.filter(u => u.group === g.id && u.role === 'student').length : 0;
    const gHidM = new Set(g?.hiddenModules || []), gHidL = new Set(g?.hiddenLessons || []);
    const hiddenN = g ? all.filter(l => l.hidden || l.modHidden || gHidM.has(l.module) || gHidL.has(l.id)).length : 0;
    root.innerHTML = `
      <div class="view-head"><h1>Уроки групп</h1><span class="count">${all.length} уроков в ${S.db.modules.length} темах${hiddenN ? `, у группы скрыто ${hiddenN}` : ''}${g ? `, группе ${esc(g.code)} добавлено ${added.size}, можно проходить ${open.size}` : ''}</span>
        <button type="button" class="btn" id="lg-new-mod">НОВАЯ ТЕМА</button></div>
      <section class="plate">
        ${g ? `<div class="toolbar lg-tools">
          <select class="sel" id="lg-group" aria-label="Группа">${groups.map(x => `<option value="${x.id}"${x.id === g.id ? ' selected' : ''}>${esc(x.code)} · ${esc(x.title)}</option>`).join('')}</select>
          <button type="button" class="btn ghost" id="lg-add-all">ДОБАВИТЬ ВСЕ</button>
          <button type="button" class="btn ghost" id="lg-open-all">РАЗРЕШИТЬ ВСЕ ДОБАВЛЕННЫЕ</button>
          <button type="button" class="btn ghost" id="lg-close-all">ЗАКРЫТЬ ВСЕ</button>
        </div>
        <p class="hint">${students} студентов в группе. «В группе» — студенты видят урок в списке. «Можно проходить» — урок открыт: можно читать, решать квиз и получать награду. Без разрешения урок виден с замком. «Скрыть» прячет урок или целую тему от студентов выбранной группы: они пропадают из «Уроков», заданий и «Модулей курса» в кабинете. У других групп всё остаётся как было, галочки и прогресс сохраняются.</p>
        ${L.legacy ? '<p class="hint lg-legacy">Эту группу ещё не настраивали: сейчас ей открыты уроки, у которых в описании не указаны группы. Первое изменение сохранит собственный список группы.</p>' : ''}`
        : '<p class="hint">Групп пока нет: создайте группу в разделе «Группы», чтобы выдавать ей уроки. Темы и уроки можно готовить уже сейчас.</p>'}
        ${S.db.modules.map((m, mi) => {
          const ls = all.filter(l => l.module === m.id).sort((a, b) => a.lesson - b.lesson);
          const mOff = m.hidden || gHidM.has(m.id);
          return `<div class="lg-mod${mOff ? ' off' : ''}"><div class="lg-mod-head"><h2>${mi + 1}. ${esc(m.title)}${m.hidden ? ' <span class="pill off">скрыта у всех</span>' : gHidM.has(m.id) ? ` <span class="pill off">скрыта у ${esc(g.code)}</span>` : ''}</h2>
              <button type="button" class="act" data-new-les="${m.id}">+ Урок</button>
              ${g && ls.length ? `<button type="button" class="act" data-mod-add="${m.id}">Добавить тему группе</button><button type="button" class="act" data-mod-open="${m.id}">Разрешить тему</button>` : ''}
              <button type="button" class="act" data-ed-mod="${m.id}">Изменить тему</button>${m.hidden ? `<button type="button" class="act" data-hide-mod="${m.id}">Показать тему всем</button>` : ''}${g ? `<button type="button" class="act" data-ghide-mod="${m.id}">${gHidM.has(m.id) ? 'Показать тему группе' : 'Скрыть тему у группы'}</button>` : ''}<button type="button" class="act danger" data-rm-mod="${m.id}">Удалить тему</button></div>
            ${ls.length ? `<div class="table-wrap"><table class="data-table">
              <thead><tr><th>Урок</th>${g ? '<th>В группе</th><th>Можно проходить</th>' : ''}<th class="acts"><span class="sr">Действия</span></th></tr></thead>
              <tbody>${ls.map(l => `<tr${l.hidden || gHidL.has(l.id) ? ' class="off"' : ''}>
                <td>${l.lesson}. ${esc(l.title)}${l.hidden ? ' <span class="pill off">скрыт у всех</span>' : gHidL.has(l.id) ? ` <span class="pill off">скрыт у ${esc(g.code)}</span>` : ''}<small>${l.custom ? 'ваш урок' : l.edited ? 'урок курса, изменён' : 'урок курса'} · ${l.minutes} мин · ${(l.quiz || []).length} вопр.${(l.tasks || []).length > 1 ? ` · заданий: ${l.tasks.length}` : (l.tasks || []).length || l.task ? ' · задание' : ''}</small></td>
                ${g ? `<td><label class="check"><input type="checkbox" data-add="${l.id}"${added.has(l.id) ? ' checked' : ''}> <span class="sr">Добавить «${esc(l.title)}» группе</span></label></td>
                <td><label class="check"><input type="checkbox" data-open="${l.id}"${open.has(l.id) ? ' checked' : ''}${added.has(l.id) ? '' : ' disabled'}> <span class="sr">Разрешить «${esc(l.title)}»</span></label></td>` : ''}
                <td class="acts"><button type="button" class="act" data-ed-les="${l.id}">Изменить</button>${l.edited ? `<button type="button" class="act" data-revert="${l.id}">Вернуть как было</button>` : ''}${l.hidden ? `<button type="button" class="act" data-hide-les="${l.id}">Показать всем</button>` : ''}${g ? `<button type="button" class="act" data-ghide-les="${l.id}">${gHidL.has(l.id) ? 'Показать' : 'Скрыть'}</button>` : ''}${l.custom ? `<button type="button" class="act danger" data-rm-les="${l.id}">Удалить</button>` : ''}</td>
              </tr>`).join('')}</tbody>
            </table></div>` : '<p class="empty">В теме пока нет уроков. Нажмите «+ Урок».</p>'}</div>`;
        }).join('') || '<p class="empty">Тем пока нет. Нажмите «НОВАЯ ТЕМА».</p>'}
      </section>`;
    $('lg-new-mod').addEventListener('click', () => editModule());
    const modIds = m => all.filter(l => l.module === m).map(l => l.id);
    if (g) {
      $('lg-group').addEventListener('change', e => { st.group = e.target.value; render(); });
      $('lg-add-all').addEventListener('click', () => save(g, all.map(l => l.id), L.open, `Группе ${g.code} добавлены все уроки.`));
      $('lg-open-all').addEventListener('click', () => save(g, L.lessons, L.lessons, `Группе ${g.code} разрешены все добавленные уроки.`));
      $('lg-close-all').addEventListener('click', () => save(g, L.lessons, [], `Уроки группы ${g.code} закрыты, в списке они остались.`));
      root.addEventListener('change', e => {
        const c = e.target; const id = c.dataset.add || c.dataset.open; if (!id) return;
        const title = all.find(l => l.id === id).title;
        if (c.dataset.add) save(g, c.checked ? [...L.lessons, id] : L.lessons.filter(x => x !== id), L.open, c.checked ? `«${title}» добавлен группе ${g.code}.` : `«${title}» убран у группы ${g.code}.`);
        else save(g, L.lessons, c.checked ? [...L.open, id] : L.open.filter(x => x !== id), c.checked ? `«${title}» можно проходить.` : `«${title}» закрыт.`);
      });
    }
    root.addEventListener('click', async e => {
      const b = e.target.closest('[data-mod-add],[data-mod-open],[data-new-les],[data-ed-mod],[data-rm-mod],[data-hide-mod],[data-ghide-mod],[data-ed-les],[data-rm-les],[data-hide-les],[data-ghide-les],[data-revert]'); if (!b) return;
      const d = b.dataset;
      if (d.modAdd) save(g, [...L.lessons, ...modIds(d.modAdd)], L.open, 'Тема добавлена группе.');
      if (d.modOpen) { const m = modIds(d.modOpen); save(g, [...L.lessons, ...m], [...L.open, ...m], 'Тема разрешена группе.'); }
      if (d.newLes) editLesson(null, d.newLes);
      if (d.edMod) editModule(d.edMod);
      if (d.rmMod) removeModule(d.rmMod);
      if (d.edLes) editLesson(d.edLes);
      if (d.rmLes) removeLesson(d.rmLes);
      if (d.hideLes) toggleLesson(d.hideLes);
      if (d.hideMod) toggleModule(d.hideMod);
      if (d.ghideLes) toggleForGroup(g, 'hiddenLessons', d.ghideLes, all.find(l => l.id === d.ghideLes).title, 'Урок');
      if (d.ghideMod) toggleForGroup(g, 'hiddenModules', d.ghideMod, S.byId('modules', d.ghideMod).title, 'Тема');
      // Скрытый урок после возврата остаётся скрытым: оставляем только отметку
      if (d.revert && await A.confirmBox('Вернуть урок курса?', 'Урок снова станет таким, как в курсе. Ваши правки пропадут.', 'ВЕРНУТЬ')) {
        const l = all.find(x => x.id === d.revert);
        if (await (l?.hidden ? S.saveLesson({ id: l.id, hidden: true, title: l.title }, false) : S.dropLesson(d.revert))) toast('Урок возвращён.');
      }
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
