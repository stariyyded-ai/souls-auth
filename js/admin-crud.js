/* CRUD-разделы админки: группы, задания, лекции, достижения, магазин.
   Каждый раздел описан схемой (колонки таблицы, поля формы, предпросмотр),
   а общий движок рисует поиск, таблицу, форму создания/редактирования и удаление с подтверждением. */
(() => {
  const S = window.AdminStore;
  const A = window.Admin;
  const { esc, fmt, dateStr, daysLeft, achIcon, icon, bar, RARITY } = A;
  const sfx = window.Ash.sfx || {};
  const db = () => S.db;
  const titleOf = (coll, id) => S.byId(coll, id)?.title || '—';

  const moduleOpts = () => db().modules.map(m => [m.id, m.title]);
  const courseOpts = () => db().courses.map(c => [c.id, c.title]);
  const TASK_TYPES = { layout: 'Вёрстка', mockup: 'Макет', quiz: 'Тест' };
  const SHOP_TYPES = { theme: 'Фон', title: 'Звание', avatar: 'Аватар', frame: 'Рамка', booster: 'Бустер', bonus: 'Бонус', merch: 'Мерч' };
  const EFFECTS = { xp2: 'Опыт ×2', souls15: 'Души ×1,5', speed: 'Полный бонус за скорость' };
  const artOpts = () => [['', '— не нужно —'], ...Object.entries(window.ASH_AVATARS).filter(([k]) => k !== 'knight').map(([k, a]) => [k, 'Аватар: ' + a.title]),
    ...Object.entries(window.ASH_FRAMES).map(([k, t]) => [k, 'Рамка: ' + t]), ['day', 'Фон: день, путник у костра'], ['autumn', 'Фон: осенний закат']];
  const shopArt = s => s.type === 'theme' ? `<span class="theme-swatch" data-art="${esc(s.art || '')}"></span>` : s.type === 'avatar' ? `<span class="ava sm">${window.ASH_AVATAR_SVG(s.art, 4)}</span>`
    : s.type === 'frame' ? `<span class="ava sm" data-frame="${esc(s.art || '')}">${window.ASH_AVATAR_SVG('knight', 4)}</span>`
    : icon(s.type === 'booster' ? 'flame' : s.type === 'title' ? 'badge' : s.type === 'bonus' ? 'key' : 'scroll', { X: '#f2d58a', Y: '#7a5f2e', O: '#e8772e', W: '#fff0b0' }, 5);
  const CONDITIONS = { manual: 'Выдаётся вручную', lessons: 'Пройдено уроков ≥ N', tasks: 'Сдано заданий ≥ N', streak: 'Заданий подряд без доработок ≥ N', module: 'Закрыто модулей на 100% ≥ N', top: 'Место в группе ≤ N' };
  const deadlinePill = d => {
    if (!d) return '—';
    const n = daysLeft(d);
    const cls = n < 0 ? 'late' : n <= 3 ? 'soon' : 'off';
    const txt = n < 0 ? `просрочен ${-n} дн` : n === 0 ? 'сегодня' : `через ${n} дн`;
    return `${dateStr(d)}<small><span class="pill ${cls}">${txt}</span></small>`;
  };
  const LEVELS = { easy: 'Лёгкая', base: 'Средняя', hard: 'Сложная' };
  const groupsText = ids => (ids && ids.length) ? ids.map(id => esc(S.byId('groups', id)?.code || '?')).join(', ') : 'все группы';
  const paragraphs = t => esc(t).split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  /* ---------- схемы разделов ---------- */
  // Код регистрации группы: 8 знаков без похожих букв и цифр, например K7QX-M2PA
  const newInvite = () => { const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; const c = Array.from(crypto.getRandomValues(new Uint32Array(8)), x => abc[x % abc.length]).join(''); return c.slice(0, 4) + '-' + c.slice(4); };

  const SCHEMAS = {
    groups: {
      title: 'Группы', one: 'группу', create: 'НОВАЯ ГРУППА', search: g => g.code + ' ' + g.title + ' ' + g.curator,
      defaults: () => ({ code: '', title: '', curator: '', quota: 20, deadline: '', courses: [], modules: [], invite: newInvite() }),
      columns: [
        ['Группа', g => `${esc(g.code)}<small>${esc(g.title)}</small>`],
        ['Код регистрации', g => g.invite ? `<code class="invite">${esc(g.invite)}</code><small>сообщите студентам группы</small>` : '<span class="pill off">закрыта</span>'],
        ['Куратор', g => esc(g.curator)],
        ['Студенты / квота', g => { const n = db().users.filter(u => u.group === g.id).length; const pct = g.quota ? n / g.quota * 100 : 0; return `${n} / ${g.quota}${n > g.quota ? ' <span class="pill late">сверх квоты</span>' : ''}<small>${bar(Math.min(100, pct), 'xp', 'mini-bar')}</small>`; }],
        ['Курсы и модули', g => `${g.courses.map(c => esc(titleOf('courses', c))).join(', ') || '—'}<small>${g.modules.length} модулей: ${g.modules.map(m => esc(titleOf('modules', m))).join(', ')}</small>`],
        ['Дедлайн', g => deadlinePill(g.deadline)]
      ],
      fields: [
        { key: 'code', label: 'Код группы', type: 'text', required: true, hint: 'Например, ВД-23' },
        { key: 'title', label: 'Название', type: 'text', required: true },
        { key: 'curator', label: 'Куратор', type: 'text', required: true },
        { key: 'quota', label: 'Квота студентов', type: 'number', min: 1, required: true },
        { key: 'invite', label: 'Код регистрации', type: 'text', hint: 'Студент вводит его при регистрации и попадает в эту группу. Пусто — регистрация в группу закрыта. Сменили код — старый перестаёт работать.' },
        { key: 'deadline', label: 'Дедлайн по программе', type: 'date' },
        { key: 'courses', label: 'Курсы', type: 'multi', options: courseOpts, full: true },
        { key: 'modules', label: 'Модули', type: 'multi', options: moduleOpts, full: true }
      ],
      validate: (v, id) => db().groups.some(g => g.code.trim().toLowerCase() === v.code.trim().toLowerCase() && g.id !== id) ? 'Группа с таким кодом уже есть.' : null,
      beforeRemove: g => { const n = db().users.filter(u => u.group === g.id).length; return n ? `В группе ${n} студентов, они останутся без группы.` : ''; },
      afterRemove: g => db().users.forEach(u => { if (u.group === g.id) u.group = null; }),
      // Новая группа начинает без уроков: преподаватель добавляет их в разделе «Уроки групп»
      hidden: () => ({ lessons: [], lessonsOpen: [] }),
      extra: { label: 'Уроки', run: id => { A.state.lessons = { ...(A.state.lessons || {}), group: id }; location.hash = 'lessons'; } }
    },

    courses: {
      title: 'Курсы', one: 'курс', create: 'НОВЫЙ КУРС', search: c => c.title + ' ' + (c.text || ''),
      defaults: () => ({ title: '', text: '', hours: 0, published: true }),
      columns: [
        ['Курс', c => `${esc(c.title)}<small>${esc(c.text || '')}${c.hours ? ` · ${c.hours} ч` : ''}</small>`],
        ['Открыт группам', c => esc(db().groups.filter(g => (g.courses || []).includes(c.id)).map(g => g.code).join(', ') || '—')],
        ['Открыт лично', c => { const n = db().users.filter(u => (u.courses || []).includes(c.id)).length; return n ? `${n} студ.` : '—'; }],
        ['Видимость', c => c.published !== false ? '<span class="pill on">в кабинете</span>' : '<span class="pill off">скрыт</span>']
      ],
      fields: [
        { key: 'title', label: 'Название', type: 'text', required: true, full: true },
        { key: 'text', label: 'Короткое описание', type: 'text', full: true },
        { key: 'hours', label: 'Длительность, часов', type: 'number', min: 0 },
        { key: 'published', label: 'Видимость', type: 'bool', text: 'Показывать в кабинете студента', hint: 'Открыть курс можно группе (раздел «Группы») или студенту лично (карточка пользователя → «Курсы»).' }
      ],
      beforeRemove: c => { const n = db().groups.filter(g => (g.courses || []).includes(c.id)).length; return n ? `Курс открыт ${n} группам, у них он пропадёт.` : ''; }
    },

    tasks: {
      title: 'Задания', one: 'задание', create: 'НОВОЕ ЗАДАНИЕ', search: t => t.title + ' ' + t.description,
      defaults: () => ({ title: '', module: db().modules[0]?.id, type: 'layout', description: '', conditions: '', xp: 100, souls: 150, attempts: 3, deadline: '', autocheck: true }),
      columns: [
        ['Задание', t => `${esc(t.title)}<small>${esc(titleOf('modules', t.module))} · ${TASK_TYPES[t.type]}</small>`],
        ['Награда', t => `+${fmt(t.xp)} XP<small>+${fmt(t.souls)} душ</small>`],
        ['Проверка', t => `<span class="pill ${t.autocheck ? 'on' : 'off'}">${t.autocheck ? 'авто' : 'вручную'}</span><small>попыток: ${t.attempts}</small>`],
        ['Дедлайн', t => deadlinePill(t.deadline)]
      ],
      fields: [
        { key: 'title', label: 'Название', type: 'text', required: true, full: true },
        { key: 'module', label: 'Модуль', type: 'select', options: moduleOpts },
        { key: 'type', label: 'Тип', type: 'select', options: () => Object.entries(TASK_TYPES) },
        { key: 'description', label: 'Описание для студента', type: 'textarea', full: true },
        { key: 'conditions', label: 'Условия приёма', type: 'textarea', full: true, hint: 'Что проверяется. Для автопроверки — по этим условиям пишутся тесты.' },
        { key: 'xp', label: 'Опыт за сдачу', type: 'number', min: 0 },
        { key: 'souls', label: 'Души за сдачу', type: 'number', min: 0 },
        { key: 'attempts', label: 'Попыток', type: 'number', min: 1 },
        { key: 'deadline', label: 'Дедлайн', type: 'date' },
        { key: 'autocheck', label: 'Автопроверка', type: 'bool', text: 'Проверять автоматически' }
      ],
      preview: t => `
        <h3>${esc(t.title || 'Без названия')}</h3>
        <div class="meta"><span>${esc(titleOf('modules', t.module))}</span><span>${TASK_TYPES[t.type]}</span><span>${t.deadline ? 'сдать до ' + dateStr(t.deadline) : 'без дедлайна'}</span></div>
        <div class="body">${paragraphs(t.description || 'Описание пока пустое.')}</div>
        ${t.conditions ? `<span class="eyebrow">Условия</span><div class="body">${paragraphs(t.conditions)}</div>` : ''}
        <div class="reward"><span>Награда: <b>+${fmt(t.xp)} XP</b></span><span><b>+${fmt(t.souls)}</b> душ</span><span>Попыток: <b>${t.attempts}</b></span><span>${t.autocheck ? 'Автопроверка' : 'Проверяет преподаватель'}</span></div>`
    },

    lectures: {
      title: 'Лекции', one: 'лекцию', create: 'НОВАЯ ЛЕКЦИЯ', search: l => l.title + ' ' + l.content + ' ' + (l.file?.name || ''),
      defaults: () => ({ title: '', module: db().modules[0]?.id, minutes: 45, difficulty: 'base', groups: [], video: '', content: '', file: null, published: false }),
      columns: [
        ['Лекция', l => `${esc(l.title)}<small>${esc(titleOf('modules', l.module))} · ${LEVELS[l.difficulty] || '—'}</small>`],
        ['Файл', l => l.file ? `<span class="pill on">${window.AshFiles.KINDS[l.file.kind]?.label || 'файл'}</span><small>${esc(l.file.name)} · ${window.AshFiles.size(l.file.size)}</small>` : '<span class="pill off">нет</span>'],
        ['Доступ', l => groupsText(l.groups)],
        ['Длительность', l => `${l.minutes} мин`],
        ['Статус', l => `<span class="pill ${l.published ? 'on' : 'soon'}">${l.published ? 'опубликована' : 'черновик'}</span>`]
      ],
      fields: [
        { key: 'title', label: 'Название', type: 'text', required: true, full: true },
        { key: 'module', label: 'Модуль', type: 'select', options: moduleOpts },
        { key: 'difficulty', label: 'Сложность', type: 'select', options: () => Object.entries(LEVELS) },
        { key: 'minutes', label: 'Время изучения, мин', type: 'number', min: 1 },
        { key: 'groups', label: 'Доступ для групп', type: 'multi', options: () => db().groups.map(g => [g.id, g.code]), full: true, hint: 'Ничего не отмечено — лекция видна всем группам' },
        { key: 'file', label: 'Файл лекции (PDF или Word)', type: 'file', full: true, hint: 'Студент откроет его прямо на сайте. До 20 МБ.' },
        { key: 'video', label: 'Ссылка на видео', type: 'url', full: true, hint: 'Необязательно' },
        { key: 'content', label: 'Конспект', type: 'textarea', full: true, hint: 'Пустая строка начинает новый абзац' },
        { key: 'published', label: 'Публикация', type: 'bool', text: 'Видна студентам' }
      ],
      preview: l => `
        <h3>${esc(l.title || 'Без названия')}</h3>
        <div class="meta"><span>${esc(titleOf('modules', l.module))}</span><span>${LEVELS[l.difficulty] || ''}</span><span>${l.minutes} мин</span><span>${groupsText(l.groups)}</span><span>${l.published ? 'опубликована' : 'черновик, студенты не видят'}</span></div>
        ${l.file ? `<p class="hint">Файл: ${esc(l.file.name)} (${window.AshFiles.size(l.file.size)})</p>` : ''}
        ${l.video ? `<p class="hint">Видео: ${esc(l.video)}</p>` : ''}
        <div class="body">${paragraphs(l.content || 'Конспект пока пустой.')}</div>`,
      afterRemove: l => { if (l.file) window.AshFiles.remove(l.file.id); }
    },

    achievements: {
      title: 'Достижения', one: 'достижение', create: 'НОВОЕ ДОСТИЖЕНИЕ', search: a => a.title + ' ' + a.text,
      defaults: () => ({ title: '', icon: 'star', rarity: 'common', text: '', condition: 'manual', value: 0, reward: 100 }),
      columns: [
        ['', a => `<span class="ach-icon" style="--r:${RARITY[a.rarity].c};width:40px;height:40px">${achIcon(a, 3)}</span>`],
        ['Достижение', a => `${esc(a.title)}<small>${esc(a.text)}</small>`],
        ['Редкость', a => `<span class="pill" style="color:${RARITY[a.rarity].c}">${RARITY[a.rarity].label}</span>`],
        ['Условие', a => `${CONDITIONS[a.condition].replace('N', a.value)}`],
        ['Награда', a => `+${fmt(a.reward)} душ<small>получили: ${db().users.filter(u => u.achievements.some(x => x.id === a.id)).length}</small>`]
      ],
      fields: [
        { key: 'title', label: 'Название', type: 'text', required: true },
        { key: 'rarity', label: 'Редкость', type: 'select', options: () => Object.entries(RARITY).map(([k, r]) => [k, r.label]) },
        { key: 'icon', label: 'Иконка', type: 'icon', full: true },
        { key: 'text', label: 'Описание', type: 'text', full: true, required: true },
        { key: 'condition', label: 'Условие получения', type: 'select', options: () => Object.entries(CONDITIONS) },
        { key: 'value', label: 'N для условия', type: 'number', min: 0, hint: 'Для ручной выдачи не важно' },
        { key: 'reward', label: 'Награда, душ', type: 'number', min: 0 }
      ],
      preview: a => `
        <ul class="ach-grid" style="grid-template-columns:minmax(0,320px)"><li class="ach-item" data-r="${a.rarity}">
          <span class="ach-icon">${achIcon(a)}</span>
          <p class="ach-title">${esc(a.title || 'Без названия')}</p>
          <p class="ach-text">${esc(a.text || 'Описание')}</p>
          <p class="ach-meta"><span class="ach-rarity">${RARITY[a.rarity].label}</span><span class="ach-date">+${fmt(a.reward)} душ</span></p>
        </li></ul>
        <p class="hint">${CONDITIONS[a.condition].replace('N', a.value)}</p>`,
      afterRemove: a => db().users.forEach(u => { u.achievements = u.achievements.filter(x => x.id !== a.id); }),
      extra: { label: 'Выдать', run: id => A.grantMany(id) }
    },

    shop: {
      title: 'Магазин', one: 'товар', create: 'НОВЫЙ ТОВАР', search: s => s.title + ' ' + s.description,
      defaults: () => ({ title: '', type: 'title', rarity: 'common', art: '', effect: 'xp2', charges: 3, price: 500, stock: 0, description: '', active: true }),
      columns: [
        ['Товар', s => `${esc(s.title)}<small>${SHOP_TYPES[s.type] || s.type} · <span style="color:${RARITY[s.rarity || 'common'].c}">${RARITY[s.rarity || 'common'].label}</span></small>`],
        ['Цена', s => `${fmt(s.price)} душ`],
        ['Остаток', s => s.stock ? `${s.stock} шт` : '<small>без ограничений</small>'],
        ['Продано', s => { const p = db().purchases.filter(x => x.item === s.id); return `${p.length}<small>${fmt(p.reduce((a, x) => a + x.price, 0))} душ</small>`; }],
        ['Статус', s => `<span class="pill ${s.active ? 'on' : 'off'}">${s.active ? 'в продаже' : 'скрыт'}</span>`]
      ],
      fields: [
        { key: 'title', label: 'Название', type: 'text', required: true, full: true },
        { key: 'type', label: 'Тип', type: 'select', options: () => Object.entries(SHOP_TYPES) },
        { key: 'rarity', label: 'Редкость', type: 'select', options: () => Object.entries(RARITY).map(([k, r]) => [k, r.label]) },
        { key: 'art', label: 'Аватар или рамка', type: 'select', options: artOpts, hint: 'Только для типов «Аватар» и «Рамка»' },
        { key: 'effect', label: 'Действие бустера', type: 'select', options: () => Object.entries(EFFECTS) },
        { key: 'charges', label: 'Бустер действует, заданий', type: 'number', min: 1 },
        { key: 'price', label: 'Цена, душ', type: 'number', min: 1, required: true },
        { key: 'stock', label: 'Остаток', type: 'number', min: 0, hint: '0 — без ограничений' },
        { key: 'description', label: 'Описание', type: 'textarea', full: true },
        { key: 'active', label: 'Продажа', type: 'bool', text: 'Показывать в магазине' }
      ],
      validate: v => (v.type === 'avatar' && !window.ASH_AVATARS[v.art]) ? 'Для аватара выберите картинку в поле «Аватар или рамка».'
        : (v.type === 'frame' && !window.ASH_FRAMES[v.art]) ? 'Для рамки выберите рамку в поле «Аватар или рамка».' : null,
      preview: s => `
        <div class="shop-card"><span class="ico">${shopArt(s)}</span>
          <div><h3>${esc(s.title || 'Без названия')}</h3><div class="meta"><span>${SHOP_TYPES[s.type]}</span><span style="color:${RARITY[s.rarity || 'common'].c}">${RARITY[s.rarity || 'common'].label}</span><span>${s.stock ? 'осталось ' + s.stock + ' шт' : 'в наличии'}</span></div></div></div>
        <div class="body">${paragraphs(s.description || 'Описание пока пустое.')}</div>
        ${s.type === 'booster' ? `<p class="hint">${EFFECTS[s.effect]} · на ${s.charges} заданий</p>` : ''}
        <div class="reward"><span>Цена: <b>${fmt(s.price)} душ</b></span>${s.active ? '' : '<span class="pill off">скрыт от студентов</span>'}</div>`
    }
  };

  /* ---------- форма ---------- */
  function fieldHTML(f, v) {
    const id = 'f-' + f.key, req = f.required ? ' required' : '';
    const wrap = inner => `<div class="f${f.full ? ' full' : ''}">${inner}${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`;
    switch (f.type) {
      case 'textarea': return wrap(`<label for="${id}">${f.label}</label><textarea id="${id}" name="${f.key}"${req}>${esc(v)}</textarea>`);
      case 'select': return wrap(`<label for="${id}">${f.label}</label><select id="${id}" name="${f.key}">${f.options().map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`);
      case 'multi': return wrap(`<span class="lbl" id="${id}-l">${f.label}</span><div class="checks" role="group" aria-labelledby="${id}-l">${f.options().map(([k, l]) => `<label><input type="checkbox" name="${f.key}" value="${k}"${(v || []).includes(k) ? ' checked' : ''}> ${esc(l)}</label>`).join('')}</div>`);
      case 'bool': return wrap(`<span class="lbl">${f.label}</span><label class="bool"><input type="checkbox" id="${id}" name="${f.key}"${v ? ' checked' : ''}> ${esc(f.text)}</label>`);
      case 'icon': return wrap(`<span class="lbl" id="${id}-l">${f.label}</span><div class="icon-pick" role="radiogroup" aria-labelledby="${id}-l">${Object.keys(window.ASH_ICONS).filter(k => !['avatar', 'soul', 'badge'].includes(k)).map(k =>
        `<label title="${k}"><input type="radio" name="${f.key}" value="${k}"${k === v ? ' checked' : ''}><span>${achIcon({ icon: k, rarity: 'legendary' }, 3)}</span></label>`).join('')}</div>`);
      case 'file': return wrap(`<label for="${id}">${f.label}</label>${v ? `<p class="file-now">Сейчас: <b>${esc(v.name)}</b> · ${window.AshFiles.size(v.size)} <label class="bool"><input type="checkbox" name="${f.key}-drop"> убрать файл</label></p>` : ''}<input id="${id}" name="${f.key}" type="file" accept="${window.AshFiles.ACCEPT}">`);
      default: return wrap(`<label for="${id}">${f.label}</label><input id="${id}" name="${f.key}" type="${f.type}"${f.min != null ? ` min="${f.min}"` : ''} value="${esc(v)}"${req}>`);
    }
  }
  function readForm(schema) {
    const box = document.getElementById('modal-body'), out = {};
    for (const f of schema.fields) {
      if (f.type === 'multi') out[f.key] = [...box.querySelectorAll(`input[name="${f.key}"]:checked`)].map(i => i.value);
      else if (f.type === 'bool') out[f.key] = box.querySelector(`[name="${f.key}"]`).checked;
      else if (f.type === 'icon') out[f.key] = box.querySelector(`[name="${f.key}"]:checked`)?.value;
      else if (f.type === 'file') out[f.key] = { pick: box.querySelector(`[name="${f.key}"]`).files[0] || null, drop: !!box.querySelector(`[name="${f.key}-drop"]`)?.checked };
      else if (f.type === 'number') out[f.key] = Number(box.querySelector(`[name="${f.key}"]`).value);
      else out[f.key] = box.querySelector(`[name="${f.key}"]`).value.trim();
    }
    return out;
  }
  function checkForm(schema, v, id) {
    const box = document.getElementById('modal-body');
    box.querySelectorAll('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));
    for (const f of schema.fields) {
      const el = box.querySelector(`[name="${f.key}"]`);
      if (f.required && (v[f.key] === '' || v[f.key] == null)) { el?.setAttribute('aria-invalid', 'true'); el?.focus(); return `Заполните поле «${f.label}».`; }
      if (f.type === 'file' && v[f.key].pick) { const e = window.AshFiles.check(v[f.key].pick); if (e) { el?.setAttribute('aria-invalid', 'true'); return e; } }
      if (f.type === 'number' && (Number.isNaN(v[f.key]) || (f.min != null && v[f.key] < f.min))) { el?.setAttribute('aria-invalid', 'true'); el?.focus(); return `«${f.label}»: число не меньше ${f.min}.`; }
    }
    return schema.validate ? schema.validate(v, id) : null;
  }

  async function edit(coll, id, draft) {
    const schema = SCHEMAS[coll];
    const item = draft || (id ? S.byId(coll, id) : schema.defaults());
    const actions = [{ label: 'ОТМЕНА', value: 'cancel', kind: 'ghost' }];
    if (schema.preview) actions.push({ label: 'ПРЕДПРОСМОТР', value: 'preview', kind: 'ghost' });
    actions.push({ label: id ? 'СОХРАНИТЬ' : 'СОЗДАТЬ', value: 'save', primary: true });
    let values = null;
    const v = await A.modal({
      title: id ? `Изменить ${schema.one}` : schema.create.charAt(0) + schema.create.slice(1).toLowerCase(),
      body: `<div class="form">${schema.fields.map(f => fieldHTML(f, item[f.key])).join('')}</div>`,
      actions,
      onSubmit: val => {
        values = readForm(schema);
        if (val === 'preview') return null;
        return checkForm(schema, values, id);
      }
    });
    if (v === 'preview') {
      const d = { ...item, ...values };
      // Выбранный, но ещё не сохранённый файл помним до сохранения
      schema.fields.filter(f => f.type === 'file').forEach(f => {
        const { pick, drop } = values[f.key];
        d[f.key] = drop ? null : pick ? { name: pick.name, size: pick.size, kind: window.AshFiles.kindOf(pick.name), _file: pick } : item[f.key];
      });
      await showPreview(coll, d); return edit(coll, id, d);
    }
    if (v !== 'save') return;
    // Файлы: новый кладём в IndexedDB, старый удаляем
    for (const f of schema.fields.filter(x => x.type === 'file')) {
      const stored = id ? S.byId(coll, id)[f.key] || null : null;
      const pick = values[f.key].pick || item[f.key]?._file || null;
      const drop = values[f.key].drop || (item[f.key] === null && !!stored);
      try {
        if (pick && !values[f.key].drop) { values[f.key] = await window.AshFiles.put(pick); if (stored) window.AshFiles.remove(stored.id); }
        else if (drop) { values[f.key] = null; if (stored) window.AshFiles.remove(stored.id); }
        else values[f.key] = stored;
      } catch (e) { A.toast('Не удалось сохранить файл: ' + e.message); return; }
    }
    if (id) { S.update(coll, id, values, schema.one); A.toast('Сохранено.'); }
    else { S.create(coll, { ...(schema.hidden ? schema.hidden() : {}), ...values }, schema.one); A.toast(`Создано: ${values.title || values.code}.`); }
  }
  async function showPreview(coll, item) {
    await A.modal({ title: 'Предпросмотр', body: `<span class="preview-label">Так увидит студент</span><div class="preview">${SCHEMAS[coll].preview(item)}</div>`, actions: [{ label: 'НАЗАД', value: 'close', primary: true }] });
  }
  async function remove(coll, id) {
    const schema = SCHEMAS[coll], item = S.byId(coll, id);
    const extra = schema.beforeRemove ? schema.beforeRemove(item) : '';
    const ok = await A.confirmBox(`Удалить ${schema.one}?`, `«${esc(item.title || item.code)}» будет удалено без возможности восстановления. ${esc(extra)}`);
    if (!ok) return;
    if (schema.afterRemove) schema.afterRemove(item);
    S.remove(coll, id, schema.one);
    if (sfx.death) sfx.death();
    A.toast('Удалено.');
  }

  /* ---------- таблица раздела ---------- */
  Object.entries(SCHEMAS).forEach(([coll, schema]) => {
    A.register(coll, (root, st) => {
      st.q ??= '';
      const q = st.q.trim().toLowerCase();
      const all = db()[coll];
      const list = all.filter(x => !q || schema.search(x).toLowerCase().includes(q));
      root.innerHTML = `
        <div class="view-head"><h1>${schema.title}</h1><span class="count">${list.length} из ${all.length}</span><button type="button" class="btn" id="c-new">${schema.create}</button></div>
        <section class="plate">
          <div class="toolbar"><input class="sel search" id="c-q-${coll}" type="search" placeholder="Поиск" aria-label="Поиск: ${schema.title}" value="${esc(st.q)}"></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr>${schema.columns.map(c => `<th>${c[0]}</th>`).join('')}<th class="acts"><span class="sr">Действия</span></th></tr></thead>
              <tbody>${list.map(x => `<tr>${schema.columns.map(c => `<td>${c[1](x)}</td>`).join('')}
                <td class="acts">${schema.extra ? `<button type="button" class="act" data-x="${x.id}">${schema.extra.label}</button>` : ''}${schema.preview ? `<button type="button" class="act" data-pv="${x.id}">Просмотр</button>` : ''}<button type="button" class="act" data-ed="${x.id}">Изменить</button><button type="button" class="act danger" data-rm="${x.id}">Удалить</button></td></tr>`).join('')
                || `<tr><td colspan="${schema.columns.length + 1}" class="empty">${all.length ? 'Ничего не нашлось.' : `Пока пусто. Нажмите «${schema.create}».`}</td></tr>`}</tbody>
            </table>
          </div>
        </section>`;
      document.getElementById('c-new').addEventListener('click', () => edit(coll));
      document.getElementById('c-q-' + coll).addEventListener('input', e => { st.q = e.target.value; A.render(); });
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-pv],[data-ed],[data-rm],[data-x]'); if (!b) return;
        if (b.dataset.x) schema.extra.run(b.dataset.x);
        if (b.dataset.pv) showPreview(coll, S.byId(coll, b.dataset.pv));
        if (b.dataset.ed) edit(coll, b.dataset.ed);
        if (b.dataset.rm) remove(coll, b.dataset.rm);
      });
    });
  });
})();
