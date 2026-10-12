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

  // Данные сессии (имя персонажа, роль) живут в sessionStorage: закрыли вкладку — нужно войти снова
  const store = {
    get(k) { try { return sessionStorage.getItem('ash:' + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem('ash:' + k, v); } catch (e) {} }
  };
  const isAdmin = () => store.get('role') === 'admin';

  // Меню в шапке: <nav class="topnav" data-page="cabinet"></nav> заполняется отсюда.
  // Пункт «Админка» видит только администратор.
  const NAV = [
    ['cabinet', 'cabinet.html', 'Кабинет'],
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
  document.querySelectorAll('a[data-fade]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.getAttribute('href')); }));

  // «Выйти» сбрасывает роль и имя
  document.querySelectorAll('a.exit').forEach(a => a.addEventListener('click', () => { store.set('role', ''); store.set('name', ''); }));

  window.Ash = Object.assign(window.Ash || {}, { reduce, wait, banner, go, store, isAdmin, svg, S, C });
})();
