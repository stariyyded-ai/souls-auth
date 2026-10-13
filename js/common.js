/* Общие вещи для всех страниц: пиксельные спрайты, баннеры в духе Souls, переходы между страницами. */
(() => {
  const C = { gold: '#c9a45c', goldD: '#7a5f2e', ember: '#e8772e', emberHi: '#f6c453', stone: '#5a5066' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- pixel sprites ---------- */
  function svg(rows, pal, s) {
    const w = Math.max(...rows.map(r => r.length)) * s, h = rows.length * s;
    let out = '';
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row[x];
        if (!pal[c]) { x++; continue; }
        let e = x; while (e < row.length && row[e] === c) e++;
        out += `<rect x="${x*s}" y="${y*s}" width="${(e-x)*s}" height="${s}" fill="${pal[c]}"/>`;
        x = e;
      }
    });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${out}</svg>`;
  }
  const S = {
    corner: ['GGGGGGGG','GLLLLLL.','GL......','GL.GG...','GL.GG...','GL......','GL......','G.......'],
    runes: [
      ['X....','X.X..','XX.X.','X.X..','XX...','X....','X....'],
      ['..X..','.X.X.','X...X','.X.X.','..X..','.X.X.','X...X'],
      ['X.X.X','.XXX.','..X..','..X..','..X..','..X..','..X..'],
      ['XXX..','X..X.','XXX..','XX...','X.X..','X..X.','X...X'],
      ['..X..','.XXX.','X.X.X','..X..','..X..','..X..','..X..']],
    dia: ['.X.','XXX','.X.'],
    flame: ['..Y..','.YOY.','.YOO.','OYYOO','.OOO.'],
    slug: ['..k.k.......','..g.g.......','.GGGG.......','GwGGGGG.....','GGGGGGGGGG..','gGGGGGGGGGGG','.gggggggggg.'].map(r => r.split('').reverse().join('')),
    doorC: ['...ffff...','.fFDDDDFf.','.FDDdDDDF.','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdYDF','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdDDF','FDDdDDdDDF','FFFFFFFFFF'],
    doorO: ['...ffff...','.fFXXXXFf.','.FDXXXXXF.','FDdXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FDYXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FDdXXXXXXF','FFFFFFFFFF'],
    bonfire: ['.......HH.......','.......HH.......','.....HHHHHH.....','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.BCcCcCSsCcCcB..','BBCECcCCCCcECBB.','.CcCCECcCECCcC..','BBBCCCCCCCCCBBB.','.BBBBBBBBBBBBB..']
  };
  const doorPal = { F: C.stone, D: '#6b4a2b', d: '#4a321d', Y: C.emberHi, X: '#050405', f: '#8a7f96' };
  document.querySelectorAll('.corner').forEach(n => n.innerHTML = svg(S.corner, { G: C.gold, L: C.goldD }, 4));
  document.querySelectorAll('.runes').forEach(n => n.innerHTML = S.runes.map((r, i) => `<span style="opacity:${i === 2 ? 1 : .7}">${svg(r, { X: C.gold }, 3)}</span>`).join(''));
  document.querySelectorAll('.dia').forEach(n => n.innerHTML = svg(S.dia, { X: n.classList.contains('ember') ? C.ember : C.gold }, 3));
  document.querySelectorAll('.flame').forEach(n => n.innerHTML = svg(S.flame, { Y: C.emberHi, O: C.ember }, 3));
  const logo = document.getElementById('logoFlame'); if (logo) logo.innerHTML = svg(S.flame, { Y: C.emberHi, O: C.ember }, 4);
  document.querySelectorAll('.btn.reg .slug').forEach(n => n.innerHTML = svg(S.slug, { G: '#8db85a', g: '#4e6e33', k: '#111', w: '#e6f0c0' }, 3));
  document.querySelectorAll('.btn.reg .door').forEach(n => n.innerHTML =
    svg(S.doorC, doorPal, 3).replace('<svg', '<svg class="closed"') + svg(S.doorO, doorPal, 3).replace('<svg', '<svg class="open"'));


  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Баннер «КОСТЁР ЗАЖЖЁН» / «ВЫ ПОГИБЛИ»
  async function banner(id) {
    const b = document.getElementById(id);
    if (!b) return;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    await wait(reduce ? 1200 : 2400); b.classList.remove('show');
  }

  // Запросы к серверу. Изменения идут с заголовком X-Ash: без него сервер их не примет (защита от чужих сайтов).
  async function api(method, url, body) {
    const opt = { method, headers: { 'X-Ash': '1' }, credentials: 'same-origin' };
    if (body !== undefined) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
    let r;
    try { r = await fetch(url, opt); } catch (e) { throw Object.assign(new Error('Нет связи с сервером.'), { status: 0 }); }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error || `Ошибка сервера (${r.status}).`), { status: r.status, data });
    return data;
  }
  // Короткое сообщение внизу экрана (элемент #toast есть на страницах кабинета и в админке)
  let noticeTimer;
  function notice(text) {
    const t = document.getElementById('toast'); if (!t) return;
    t.textContent = text; t.classList.add('show');
    clearTimeout(noticeTimer); noticeTimer = setTimeout(() => t.classList.remove('show'), 4000);
  }

  // Кто вошёл, сервер сообщает в api/boot.js (подключён в <head> закрытых страниц).
  // Имя и роль дублируем в sessionStorage, чтобы страница входа могла подставить имя.
  const store = {
    get(k) { try { return sessionStorage.getItem('ash:' + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem('ash:' + k, v); } catch (e) {} }
  };
  const me = window.BOOT && window.BOOT.me;
  if (me) { store.set('name', me.name); store.set('role', me.role); }
  // Только для меню: доступ к админке всё равно проверяет сервер
  const isAdmin = () => !!me && me.role === 'admin';

  // Меню в шапке: <nav class="topnav" data-page="cabinet"></nav> заполняется отсюда.
  // Пункт «Админка» видит только администратор.
  const NAV = [
    ['cabinet', 'cabinet.html', 'Кабинет'],
    ['lessons', 'lessons.html', 'Уроки'],
    ['tasks', 'tasks.html', 'Задания'],
    ['shop', 'shop.html', 'Магазин'],
    ['leaders', 'leaderboard.html', 'Лидеры'],
    ['admin', 'admin.html', 'Админка', 'admin']
  ];
  document.querySelectorAll('nav.topnav[data-page]').forEach(nav => {
    const page = nav.dataset.page;
    nav.innerHTML = NAV.filter(n => !n[3] || isAdmin()).map(([id, href, label]) =>
      id === page ? `<a href="${href}" class="on" aria-current="page">${label}</a>` : `<a href="${href}" data-fade>${label}</a>`).join('');
  });

  // Плавное появление панели при загрузке и уход со страницы
  const panel = document.getElementById('panel');
  if (panel) requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('out')));
  async function go(url) {
    if (panel) { panel.classList.add('out'); await wait(reduce ? 0 : 280); }
    location.href = url;
  }
  document.querySelectorAll('a[data-fade]:not(.exit)').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.getAttribute('href')); }));

  // «Выйти» закрывает сессию на сервере
  document.querySelectorAll('a.exit').forEach(a => a.addEventListener('click', async e => {
    e.preventDefault();
    store.set('role', ''); store.set('name', '');
    try { await api('POST', 'api/logout'); } catch (err) {}
    go(a.getAttribute('href'));
  }));

  // Глазик у поля пароля: показать или скрыть то, что введено
  const EYE = {
    open: 'M3 1h6v1H3zM1 2h2v1H1zM9 2h2v1H9zM0 3h1v2H0zM11 3h1v2h-1zM1 5h2v1H1zM9 5h2v1H9zM3 6h6v1H3zM5 2h2v1H5zM4 3h4v2H4zM5 5h2v1H5z',
    shut: 'M0 3h1v1H0zM11 3h1v1h-1zM1 4h2v1H1zM9 4h2v1H9zM3 5h6v1H3zM2 6h1v1H2zM5 6h2v1H5zM9 6h1v1H9z'
  };
  document.querySelectorAll('.input input[type=password]').forEach(inp => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'eye';
    const draw = () => {
      const shown = inp.type === 'text';
      b.setAttribute('aria-label', shown ? 'Скрыть пароль' : 'Показать пароль');
      b.setAttribute('aria-pressed', String(shown)); b.title = b.getAttribute('aria-label');
      b.innerHTML = `<svg viewBox="0 0 12 8" width="24" height="16" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true"><path d="${shown ? EYE.shut : EYE.open}"/></svg>`;
    };
    b.addEventListener('click', () => {
      const pos = inp.selectionStart;
      inp.type = inp.type === 'password' ? 'text' : 'password'; draw();
      inp.focus(); if (pos != null) try { inp.setSelectionRange(pos, pos); } catch (e) {}
    });
    // Перед отправкой формы пароль снова прячем, чтобы браузер не запомнил его как обычный текст
    inp.form?.addEventListener('submit', () => { inp.type = 'password'; draw(); }, true);
    draw(); inp.after(b);
  });

  window.Ash = Object.assign(window.Ash || {}, { reduce, wait, banner, go, store, isAdmin, api, notice, me, svg, S, C });
})();
