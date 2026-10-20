/* Админка: работы студентов на проверку (курс МДК.09.01).
   Студент сдаёт работу на странице заданий (tasks.html#work-<урок>): ссылка, комментарий и самопроверка по критериям.
   Преподаватель ставит 2, 1 или 0 баллов по каждому критерию урока и принимает работу или возвращает на доработку.
   Новые работы проверяются каждые 30 секунд, пока админка открыта: счётчик в меню и уведомление. */
(() => {
  const S = window.AdminStore, A = window.Admin;
  const { esc, timeStr, ago, toast, render } = A;
  const sfx = window.Ash.sfx || {};
  const $ = id => document.getElementById(id);
  const lessonOf = id => (S.db.lessonList || []).find(l => l.id === id);
  const STATUS = { sent: ['soon', 'ждёт проверки'], graded: ['on', 'принята'], returned: ['late', 'на доработке'] };

  function badge() {
    const n = S.worksWaiting().length;
    const link = document.querySelector('#side-nav a[data-v="works"]');
    if (link) link.innerHTML = `Работы${n ? ` <span class="nav-badge" aria-label="${n} ждут проверки">${n}</span>` : ''}`;
  }
  S.on(badge); badge();

  A.register('works', (root, st) => {
    st.show ??= 'sent';
    const all = S.db.works || [];
    const list = st.show === 'sent' ? all.filter(w => w.status === 'sent') : all;
    root.innerHTML = `
      <div class="view-head"><h1>Работы на проверку</h1><span class="count">${S.worksWaiting().length} ждут проверки</span></div>
      <section class="plate">
        <div class="toolbar"><div class="chips" role="group" aria-label="Какие работы показать" style="margin-left:0">
          <button type="button" class="chip${st.show === 'sent' ? ' on' : ''}" aria-pressed="${st.show === 'sent'}" data-show="sent">Ждут проверки · ${S.worksWaiting().length}</button>
          <button type="button" class="chip${st.show === 'all' ? ' on' : ''}" aria-pressed="${st.show === 'all'}" data-show="all">Все · ${all.length}</button>
        </div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Сдана</th><th>Студент</th><th>Работа</th><th>Статус</th><th class="acts"><span class="sr">Действия</span></th></tr></thead>
            <tbody>${list.map(w => {
              const u = S.byId('users', w.user), g = u && S.byId('groups', u.group), l = lessonOf(w.lesson), [cls, txt] = STATUS[w.status] || ['off', w.status];
              return `<tr>
                <td class="date">${w.sentAt ? timeStr(w.sentAt) : '—'}<small>${w.sentAt ? ago(w.sentAt) : ''}</small></td>
                <td>${esc(u?.name || 'удалённый пользователь')}<small>${esc(g ? g.code : 'без группы')}</small></td>
                <td>${esc(l?.title || w.lesson)}${w.tries > 1 ? `<small>попытка ${w.tries}</small>` : ''}</td>
                <td><span class="pill ${cls}">${txt}${w.status === 'graded' ? ` · ${w.grade} из ${w.max}` : ''}</span></td>
                <td class="acts"><button type="button" class="act" data-check="${esc(w.user)}|${esc(w.lesson)}">${w.status === 'sent' ? 'Проверить' : 'Открыть'}</button></td>
              </tr>`; }).join('') || `<tr><td colspan="5" class="empty">${st.show === 'sent' ? 'Новых работ нет. Когда студент сдаст работу курса МДК.09.01, она появится здесь.' : 'Работ пока не сдавали.'}</td></tr>`}</tbody>
          </table>
        </div>
        <p class="hint">По каждому критерию ставится 2, 1 или 0 баллов. Принятая работа даёт студенту до 200 XP и душ пропорционально баллам; если студент пересдаст и получит больше, доначислится разница.</p>
      </section>`;
    root.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => { st.show = b.dataset.show; render(); }));
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-check]'); if (!b) return;
      const [user, lesson] = b.dataset.check.split('|');
      check(user, lesson);
    });
  });

  async function check(userId, lessonId) {
    const w = (S.db.works || []).find(x => x.user === userId && x.lesson === lessonId), l = lessonOf(lessonId), u = S.byId('users', userId);
    if (!w || !l || !l.work) { toast('Работа не найдена.'); return; }
    const crit = l.work.criteria;
    let body = null;
    const v = await A.modal({
      title: `${l.title}`, wide: true,
      body: `<div class="work-check">
        <p><b>${esc(u?.name || 'Студент')}</b>${w.sentAt ? ` · сдана ${timeStr(w.sentAt)}` : ''}${w.tries > 1 ? ` · попытка ${w.tries}` : ''}</p>
        ${w.link ? `<p>Ссылка: <a href="${esc(w.link)}" target="_blank" rel="noopener noreferrer">${esc(w.link)}</a></p>` : '<p class="hint">Ссылки нет.</p>'}
        ${w.comment ? `<blockquote class="teacher-note">${esc(w.comment).replace(/\n/g, '<br>')}</blockquote>` : ''}
        <div class="table-wrap"><table class="data-table crit-grade">
          <thead><tr><th>Критерий</th><th>Самопроверка</th><th>2</th><th>1</th><th>0</th></tr></thead>
          <tbody>${crit.map((c, i) => {
            const cur = w.scores ? w.scores[i] : null;
            const cell = n => `<td><label class="grade-opt"><input type="radio" name="wc${i}" value="${n}"${cur === n ? ' checked' : ''}> <span>${esc(n === 2 ? c.d2 : n === 1 ? c.d1 : c.d0)}</span></label></td>`;
            return `<tr><th scope="row">${esc(c.name)}</th><td>${w.checks && w.checks[i] ? '✓ сделал' : '—'}</td>${cell(2)}${cell(1)}${cell(0)}</tr>`;
          }).join('')}</tbody>
        </table></div>
        <div class="form"><div class="f full"><label for="wc-note">Комментарий студенту</label><textarea id="wc-note" rows="3" maxlength="2000" placeholder="Что хорошо, что поправить">${esc(w.note || '')}</textarea></div></div>
      </div>`,
      actions: [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }, { label: 'ВЕРНУТЬ НА ДОРАБОТКУ', value: 'return', kind: 'danger' }, { label: 'ПРИНЯТЬ', value: 'accept', primary: true }],
      onSubmit: val => {
        const note = $('wc-note').value.trim();
        const scores = crit.map((c, i) => { const r = document.querySelector(`input[name="wc${i}"]:checked`); return r ? +r.value : null; });
        if (val === 'accept' && scores.some(x => x === null)) return 'Поставьте 2, 1 или 0 по каждому критерию.';
        if (val === 'return' && !note) return 'Напишите, что доработать.';
        body = { verdict: val, note, scores: scores.some(x => x === null) ? null : scores };
        return null;
      }
    });
    if (v !== 'accept' && v !== 'return') return;
    if (await S.gradeWork(userId, lessonId, body)) {
      const sum = body.scores ? body.scores.reduce((a, b) => a + b, 0) : 0;
      if (v === 'accept') { if (sfx.lit) sfx.lit(); toast(`Работа «${u?.name}» принята: ${sum} из ${crit.length * 2}.`); }
      else toast(`Работа «${u?.name}» возвращена на доработку.`);
    }
  }

  async function poll() {
    if (document.hidden) return;
    const fresh = await S.pollWorks();
    if (!fresh.length) return;
    const w = fresh[0], u = S.byId('users', w.user), l = lessonOf(w.lesson);
    toast(fresh.length === 1 ? `Новая работа на проверку: «${u?.name || 'студент'}», ${l?.title || ''}.` : `Новых работ на проверку: ${fresh.length}. Откройте раздел «Работы».`);
    if (sfx.lit) sfx.lit();
  }
  setInterval(poll, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
})();
