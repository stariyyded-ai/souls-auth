/* Фон: пиксельные сцены на canvas низкого разрешения.
   erdtree — золотое древо над замком, лучи сквозь туман, кладбище в траве и всадник с мечом (сейчас нигде не стоит).
   storm — фон после входа (по умолчанию): ночная буря, сияющий знак в небе, дождь, синее пламя и воин с двуручным мечом.
   night — ночь и затмение над замком, day — светлый день, у костра путник, autumn — осенний закат с листопадом.
   Фоны студент покупает в магазине, администратор выбирает бесплатно. Сменить на лету: window.AshScene.set('day'). */
(() => {
  const C = { gold: '#c9a45c', goldD: '#7a5f2e', ember: '#e8772e', emberHi: '#f6c453', stone: '#5a5066' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BONFIRE = ['.......HH.......','.......HH.......','.....HHHHHH.....','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.BCcCcCSsCcCcB..','BBCECcCCCCcECBB.','.CcCCECcCECCcC..','BBBCCCCCCCCCBBB.','.BBBBBBBBBBBBB..'];
  // Путник в плаще и капюшоне, с посохом, смотрит на костёр
  const TRAVELER = ['....HHH....','...HHHHH...','...SsHHH...','...ssHHH...','....HHH..w.','...CCCCC.w.','..CCCCCCCw.','..CCcCCCCw.','..CCcCCCSw.','..CCBBBCCw.','..CCcCCCCw.','..CCcCCCCw.','...CcCCC.w.','...LL.LL.w.','...LL.LL.w.','..KKK.KKKw.'];

  /* ---------- темы ---------- */
  const THEMES = {
    night: {
      sky: ['#1b1520', '#0e0b11', '#050406'], stars: true, orb: 'eclipse',
      far: '#1e1926', near: '#0c0a0e', windows: true,
      fog: ['rgba(42,37,48,0)', 'rgba(42,37,48,0.35)', 'rgba(10,9,12,0.9)'],
      ground: '#0b090c', groundLine: '#1f1a22', glow: 0.32, vignette: 0.75,
      particles: { kind: 'ash', n: 40, colors: ['230,220,198'] }
    },
    day: {
      sky: ['#5f9ad3', '#a9cdea', '#f2e2bb'], stars: false, orb: 'sun', clouds: true,
      far: '#8d9db6', near: '#58627a', windows: false,
      fog: ['rgba(240,236,224,0)', 'rgba(240,236,224,0.35)', 'rgba(70,88,52,0.85)'],
      ground: '#4f6b35', groundLine: '#668545', glow: 0.18, vignette: 0.3, traveler: true,
      cloak: { C: '#5a4a6e', c: '#3f3350' },
      particles: { kind: 'dust', n: 26, colors: ['255,252,230'] }
    },
    autumn: {
      sky: ['#2f2142', '#a24d6b', '#f3a252'], stars: false, orb: 'sunset', clouds: true, cloudColor: 'rgba(255,196,150,0.55)',
      far: '#5d3653', near: '#2b1a27', windows: true, trees: true,
      fog: ['rgba(120,60,70,0)', 'rgba(120,60,70,0.3)', 'rgba(28,14,16,0.9)'],
      ground: '#3c2418', groundLine: '#5a3420', glow: 0.3, vignette: 0.55, traveler: true, leavesOnGround: true,
      cloak: { C: '#6a3b2a', c: '#4a281c' },
      particles: { kind: 'leaves', n: 34, colors: ['232,119,46', '246,196,83', '184,64,31', '201,140,60'] }
    }
  };
  // Свои сцены: рисуются целиком функцией draw (ниже), общие частицы и виньетка — поверх
  THEMES.erdtree = { custom: 'erdtree', vignette: 0.62, particles: { kind: 'gold', n: 46, colors: ['242,213,138', '246,196,83', '255,236,170'] } };
  THEMES.storm = { custom: 'storm', vignette: 0.7, particles: { kind: 'none', n: 0, colors: ['0,0,0'] } };
  // После входа — фон пользователя с сервера (api/boot.js), по умолчанию ночная буря.
  // Вход и регистрация — как раньше: последний фон с костром (ночь, день или осень), иначе ночь и затмение
  const DEFAULT = 'storm';
  const saved = (() => { try { return localStorage.getItem('ash.scene'); } catch (e) { return null; } })();
  let name = window.BOOT ? (window.BOOT.me && window.BOOT.me.theme) || DEFAULT : ['night', 'day', 'autumn'].includes(saved) ? saved : 'night';
  if (!THEMES[name]) name = DEFAULT;
  let T = THEMES[name];
  function remember() { try { localStorage.setItem('ash.scene', name); } catch (e) {} document.documentElement.dataset.scene = name; }
  remember();

  /* ---------- pixel scene ---------- */
  const scene = document.getElementById('scene'), sx = scene.getContext('2d');
  const PX = 4;
  let W = 0, H = 0, stars = [], embers = [], parts = [], clouds = [], trees = [], litter = [];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  function towers(cols, base, list) {
    const h = Array.from({ length: cols }, (_, x) => base + ((x % 4 < 2) ? 1 : 0));
    list.forEach(t => {
      const cx = Math.round(t.cx * cols);
      for (let x = cx - t.w; x <= cx + t.w; x++) {
        if (x < 0 || x >= cols) continue;
        let v = t.h + Math.max(0, t.sp - Math.abs(x - cx) * 2);
        if (x === cx) v += t.n || 0;
        h[x] = Math.max(h[x], v);
      }
      t._cx = cx;
    });
    return h;
  }
  let far, near, nearT;
  const farT = [{cx:.04,w:3,h:44,sp:10},{cx:.17,w:4,h:52,sp:14,n:6},{cx:.29,w:2,h:38,sp:6},{cx:.49,w:5,h:58,sp:16,n:8},{cx:.67,w:3,h:44,sp:9},{cx:.83,w:4,h:50,sp:12,n:5},{cx:.96,w:3,h:40,sp:8}];
  const newPart = top => {
    const k = T.particles;
    return { x: rnd() * W, y: top ? -2 : rnd() * H, v: k.kind === 'gold' ? 10 + rnd() * 14 : k.kind === 'leaves' ? 5 + rnd() * 6 : 2 + rnd() * 4, a: k.kind === 'ash' ? 0.1 + rnd() * 0.25 : k.kind === 'dust' ? 0.25 + rnd() * 0.35 : k.kind === 'gold' ? 0.35 + rnd() * 0.5 : 0.75 + rnd() * 0.25,
      c: k.colors[Math.floor(rnd() * k.colors.length)], ph: rnd() * 6, big: k.kind === 'leaves' && rnd() < 0.5 };
  };
  function layout() {
    W = Math.ceil(innerWidth / PX); H = Math.ceil(innerHeight / PX);
    scene.width = W; scene.height = H;
    fx.width = innerWidth * devicePixelRatio; fx.height = innerHeight * devicePixelRatio;
    seed = 7;
    stars = Array.from({ length: Math.round(W * H / 260) }, () => ({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * H * 0.62), a: 0.15 + rnd() * 0.45, tw: rnd() * 6 }));
    far = towers(W, 26, farT.map(t => ({ ...t })));
    nearT = [{cx:.02,w:3,h:28,sp:6,win:2},{cx:.12,w:2,h:22,sp:5,win:1},{cx:.24,w:3,h:34,sp:9,n:3,win:3},{cx:.38,w:2,h:20,sp:4},{cx:.71,w:3,h:30,sp:8,n:2,win:2},{cx:.83,w:2,h:22,sp:5,win:1},{cx:.95,w:4,h:36,sp:10,n:4,win:3}];
    near = towers(W, 13, nearT);
    clouds = Array.from({ length: Math.max(3, Math.round(W / 70)) }, () => ({ x: rnd() * W, y: 6 + rnd() * H * 0.3, w: 14 + Math.floor(rnd() * 22), v: 0.6 + rnd() * 1.2 }));
    // Осенние деревья между башнями: крона из пикселей трёх цветов
    trees = [.31, .45, .56, .63, .77].map(p => {
      const r = 5 + Math.floor(rnd() * 4), dots = [];
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + rnd() * 4) dots.push([x, y, Math.floor(rnd() * 3)]);
      return { x: Math.round(p * W), h: 6 + Math.floor(rnd() * 6), r, dots };
    });
    litter = Array.from({ length: Math.round(W / 3) }, () => ({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * 6), c: Math.floor(rnd() * 3) }));
    parts = Array.from({ length: T.particles.n }, () => newPart(false));
    custom();
  }
  const fx = document.getElementById('fx');
  function bonfireX() { return W < 140 ? Math.round(W * 0.5) - 8 : Math.round(W * 0.14); }
  function drawSprite(rows, pal, x0, y0) {
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) { sx.fillStyle = c; sx.fillRect(x0 + x, y0 + y, 1, 1); } } });
  }
  const bonPal = { H: '#6b4a2b', S: '#b8b8c4', s: '#5a5a66', C: '#3a2a22', c: '#5a3a28', E: '#ff9a3c', B: '#bdb2a0' };
  const LEAF = ['#e8772e', '#f6c453', '#b8401f'];

  function orb(t, ex, ey, R) {
    if (T.orb === 'eclipse') {
      const glow = sx.createRadialGradient(ex, ey, R * 0.6, ex, ey, R * 2.6);
      glow.addColorStop(0, 'rgba(232,119,46,0.28)'); glow.addColorStop(1, 'rgba(232,119,46,0)');
      sx.fillStyle = glow; sx.fillRect(ex - R * 3, ey - R * 3, R * 6, R * 6);
      for (let y = -R - 2; y <= R + 2; y++) for (let x = -R - 2; x <= R + 2; x++) {
        const d = Math.hypot(x, y) / R;
        const flick = 0.02 * Math.sin(t * 3 + Math.atan2(y, x) * 5);
        let c = null;
        if (d <= 0.66) c = '#050304'; else if (d <= 0.76) c = '#4a1206'; else if (d <= 0.86 + flick) c = C.ember; else if (d <= 0.95 + flick) c = C.emberHi; else if (d <= 1.02 + flick) c = '#b8401f';
        if (c) { sx.fillStyle = c; sx.fillRect(ex + x, ey + y, 1, 1); }
      }
      return;
    }
    // Солнце: днём высокое и белое, на осеннем закате — большое и низкое
    const day = T.orb === 'sun', r = day ? Math.round(R * 0.8) : Math.round(R * 1.3);
    const glow = sx.createRadialGradient(ex, ey, r * 0.8, ex, ey, r * (day ? 4 : 3.2));
    glow.addColorStop(0, day ? 'rgba(255,248,214,0.6)' : 'rgba(255,170,90,0.5)'); glow.addColorStop(1, 'rgba(255,240,200,0)');
    sx.fillStyle = glow; sx.fillRect(ex - r * 5, ey - r * 5, r * 10, r * 10);
    for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) {
      const d = Math.hypot(x, y) / r;
      let c = null;
      if (d <= 0.7) c = day ? '#fffbe8' : '#ffd27a'; else if (d <= 0.9) c = day ? '#fff1b8' : '#f6a64a'; else if (d <= 1.03 + 0.03 * Math.sin(t * 2 + x)) c = day ? '#f8dc84' : '#e8772e';
      if (c) { sx.fillStyle = c; sx.fillRect(ex + x, ey + y, 1, 1); }
    }
  }

  // Частицы (пепел, пыль, листья, золотые искры) и виньетка — общие для всех сцен
  function overlay(t, dt, gy) {
    const leaves = T.particles.kind === 'leaves', gold = T.particles.kind === 'gold';
    parts.forEach(a => {
      if (gold) {
        // золотые искры летят наискосок длинными штрихами, как листья древа на ветру
        if (!reduce) { a.y += a.v * dt; a.x += a.v * 0.55 * dt; if (a.y > H + 2 || a.x > W + 4) Object.assign(a, newPart(true), { x: Math.random() * W * 1.2 - W * 0.2 }); }
        const x = Math.round(a.x), y = Math.round(a.y);
        sx.fillStyle = `rgba(${a.c},${a.a})`; sx.fillRect(x, y, 1, 1);
        sx.fillStyle = `rgba(${a.c},${a.a * 0.5})`; sx.fillRect(x - 1, y - 2, 1, 1);
        if (a.v > 17) sx.fillRect(x - 2, y - 4, 1, 1);
        return;
      }
      if (!reduce) {
        a.y += a.v * dt; a.x += Math.sin(t * (leaves ? 1.6 : 1) + a.ph) * dt * (leaves ? 6 : 2) + (leaves ? dt * 2 : 0);
        if (a.y > (leaves ? gy + 2 : H) || a.x > W + 2) Object.assign(a, newPart(true), { x: Math.random() * W });
      }
      sx.fillStyle = `rgba(${a.c},${a.a})`;
      const x = Math.round(a.x), y = Math.round(a.y);
      sx.fillRect(x, y, 1, 1);
      if (a.big) { const f = Math.sin(t * 4 + a.ph) > 0; sx.fillRect(x + (f ? 1 : -1), y + 1, 1, 1); }
    });
    // vignette
    const v = sx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${T.vignette})`);
    sx.fillStyle = v; sx.fillRect(0, 0, W, H);
  }

  /* ---------- свои сцены: золотое древо и ночная буря ---------- */
  let E = null; // всё, что сцена считает один раз при изменении размера окна
  const px = (x, y, c) => { sx.fillStyle = c; sx.fillRect(Math.round(x), Math.round(y), 1, 1); };
  // Линия из пикселей (Брезенхем)
  function line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sxx = x0 < x1 ? 1 : -1, syy = y0 < y1 ? 1 : -1;
    let e = dx + dy; sx.fillStyle = c;
    for (let i = 0; i < 2000; i++) {
      sx.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sxx; }
      if (e2 <= dx) { e += dx; y0 += syy; }
    }
  }
  // Пиксельная окружность (для знака в небе)
  function ring(cx, cy, r, c) {
    const n = Math.max(24, Math.round(r * 6.4));
    sx.fillStyle = c;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; sx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1); }
  }

  function custom() {
    E = null;
    if (!T.custom) return;
    seed = 23;
    if (T.custom === 'erdtree') {
      const hy = Math.round(H * 0.66), tx = Math.round(W * 0.52), crown = Math.round(H * 0.2);
      // Ветви древа: от вершины ствола расходятся во все стороны, ветвятся и тонут в тумане
      const branches = [];
      const grow = (x, y, a, len, d) => {
        const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len;
        branches.push([x, y, x1, y1, d]);
        if (d >= 7 || len < 2.5) { leaves.push([x1, y1]); return; }
        const k = 2 + (rnd() < 0.4 ? 1 : 0);
        for (let i = 0; i < k; i++) grow(x1, y1, a + (rnd() - 0.5) * 1.1, len * (0.64 + rnd() * 0.16), d + 1);
      };
      const leaves = [];
      const R = Math.min(W * 0.4, H * 0.62);
      // Крупные сучья выходят из верхней трети ствола на разной высоте, выше — круче вверх
      for (let i = 0; i < 13; i++) {
        const side = i % 2 ? 1 : -1, lvl = Math.floor(i / 2);
        const a = side > 0 ? -0.15 - lvl * 0.2 - rnd() * 0.15 : -Math.PI + 0.15 + lvl * 0.2 + rnd() * 0.15;
        grow(tx + side * 3, crown + 8 + (6 - lvl) * Math.round(H * 0.025), a, R * (0.28 + rnd() * 0.14), 0);
      }
      // Тёмная листва вокруг концов ветвей: крона кажется плотной, свет пробивается сквозь неё
      const foliage = [];
      leaves.forEach(([x, y]) => { for (let i = 0; i < 5; i++) foliage.push([x + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 4, 0.25 + rnd() * 0.35]); });
      // Повисшие корни-лианы по краям кроны
      const vines = Array.from({ length: Math.round(W / 9) }, () => ({ x: tx + (rnd() - 0.5) * R * 2.2, y: crown - 6 + rnd() * 18, len: 8 + rnd() * 24, ph: rnd() * 6 }));
      // Замок под древом и руины слева
      // Замок: стены и башни с зубцами, [смещение от ствола, ширина, высота, шпиль]
      const u = Math.max(1, Math.round(W / 320));
      const castle = [[-26, 14, 16, 0], [-17, 6, 30, 1], [-8, 18, 22, 0], [-6, 6, 42, 0], [3, 7, 52, 0], [11, 12, 28, 0], [21, 6, 34, 1], [27, 16, 14, 0]]
        .map(([dx, w, h, sp]) => ({ x: tx + dx * u, w: w * u, h: Math.round(h * u * Math.min(1.2, H / 200)), sp }));
      const ruins = towers(W, 0, [{ cx: 0.04, w: 4, h: 38, sp: 8 }, { cx: 0.12, w: 3, h: 30, sp: 6, n: 3 }, { cx: 0.2, w: 2, h: 24, sp: 4 }, { cx: 0.9, w: 4, h: 26, sp: 6 }, { cx: 0.97, w: 3, h: 34, sp: 8 }])
        .map((h, x) => (x < W * 0.26 || x > W * 0.84 ? h : 0));
      // Надгробия: чем ниже, тем крупнее (ближе к зрителю)
      const stones = Array.from({ length: Math.round(W / 6) }, () => {
        const y = hy + 6 + Math.pow(rnd(), 0.8) * (H - hy - 4);
        const k = (y - hy) / (H - hy);
        return { x: rnd() * W, y, w: Math.max(2, Math.round(2 + k * 7)), h: Math.max(3, Math.round(3 + k * 9)), tilt: rnd() < 0.3 ? (rnd() < 0.5 ? -1 : 1) : 0 };
      }).sort((a, b) => a.y - b.y);
      // Трава: высокие стебли с метёлками, качаются на ветру
      const grass = Array.from({ length: Math.round(W * 1.6) }, () => {
        const y = hy + 4 + Math.pow(rnd(), 0.6) * (H - hy);
        const k = (y - hy) / (H - hy);
        return { x: rnd() * W, y, h: 3 + k * 14 * (0.5 + rnd()), c: Math.floor(rnd() * 4), ph: rnd() * 6 };
      }).sort((a, b) => a.y - b.y);
      const rider = W >= 140 ? { x: Math.round(W * 0.12), y: H - Math.round(H * 0.04) } : null;
      E = { hy, tx, crown, branches, foliage, vines, castle, ruins, stones, grass, rider, R };
    } else {
      const hy = Math.round(H * 0.7), cx = Math.round(W * 0.5), cy = Math.round(H * 0.32), R = Math.round(Math.min(W * 0.2, H * 0.24));
      // Туманность в знаке: завитки из точек, медленно вращаются
      // Точки собраны в закрученные рукава, как языки пламени вокруг яркого ядра
      const neb = Array.from({ length: Math.round(R * R * 1.1) }, () => {
        const r = Math.pow(rnd(), 0.85) * R, arm = Math.floor(rnd() * 5);
        const a = arm / 5 * Math.PI * 2 + (rnd() - 0.5) * (0.5 + r / R * 0.6);
        const core = r < R * 0.3;
        return { r, a, sw: 2.2, c: rnd() < 0.08 ? 2 : core || rnd() < 0.35 ? 1 : 0, al: core ? 0.5 + rnd() * 0.5 : 0.15 + rnd() * 0.45 };
      });
      // Холмы: слева выше, с руинами замка; справа ниже, с обломками башен; посередине долина
      const hill = Array.from({ length: W }, (_, x) => {
        const u = x / W;
        const left = Math.max(0, 1 - u / 0.42) ** 1.4 * H * 0.42, right = Math.max(0, (u - 0.6) / 0.4) ** 1.3 * H * 0.3;
        return Math.round(H * 0.06 + left + right + Math.sin(x * 0.21) * 2 + Math.sin(x * 0.07) * 3);
      });
      const ruins = towers(W, 0, [{ cx: 0.05, w: 3, h: 22, sp: 6, n: 3 }, { cx: 0.11, w: 2, h: 16, sp: 4 }, { cx: 0.16, w: 3, h: 26, sp: 7, n: 4 }, { cx: 0.88, w: 2, h: 14, sp: 4 }, { cx: 0.95, w: 3, h: 18, sp: 5, n: 2 }])
        .map((h, x) => (x < W * 0.22 || x > W * 0.84 ? h : 0));
      // Синее пламя на склонах и в долине
      const flames = Array.from({ length: Math.round(W / 9) }, () => {
        const x = Math.floor(rnd() * W);
        return { x, y: H - hill[x] + 2 + Math.floor(rnd() * 6), w: 2 + Math.floor(rnd() * 3), h: 3 + Math.floor(rnd() * 5), ph: rnd() * 6 };
      });
      const rain = Array.from({ length: Math.min(900, Math.round(W * H / 55)) }, () => ({ x: rnd() * W, y: rnd() * H, v: 120 + rnd() * 80, l: 2 + Math.floor(rnd() * 3), a: 0.12 + rnd() * 0.25 }));
      const hero = { x: cx, y: H - Math.round(H * 0.05) };
      E = { hy, cx, cy, R, neb, hill, ruins, flames, rain, hero, flash: 0, nextFlash: 4 + rnd() * 6, bolt: null };
    }
  }

  /* Золотое древо: заставка входа */
  function drawErd(t) {
    if (!E) custom();
    const { hy, tx, crown, R } = E;
    // Небо: тёмная олива по краям, золотой свет за древом
    const g = sx.createLinearGradient(0, 0, 0, hy);
    g.addColorStop(0, '#0f0e0b'); g.addColorStop(0.5, '#262115'); g.addColorStop(1, '#5a4b2c');
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    const pulse = reduce ? 0 : 0.06 * Math.sin(t * 0.7);
    const glow = sx.createRadialGradient(tx, crown + R * 0.45, 2, tx, crown + R * 0.45, R * 1.25);
    glow.addColorStop(0, `rgba(255,236,170,${0.75 + pulse})`); glow.addColorStop(0.35, `rgba(242,213,138,${0.38 + pulse})`); glow.addColorStop(1, 'rgba(242,213,138,0)');
    sx.fillStyle = glow; sx.fillRect(0, 0, W, H);
    // Лучи сквозь крону: веером вниз, медленно дышат
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.18 + i * 0.11), al = Math.max(0, 0.07 + 0.05 * Math.sin(t * 0.5 + i * 1.7));
      const x0 = tx + (i - 3) * 3, y0 = crown + R * 0.3;
      const x1 = x0 + Math.cos(a) * H * 1.2 * (i < 3 ? -1 : 1) * 0.6, y1 = y0 + Math.sin(a) * H * 1.2;
      sx.fillStyle = `rgba(255,230,160,${al})`;
      sx.beginPath(); sx.moveTo(x0 - 1, y0); sx.lineTo(x0 + 1, y0); sx.lineTo(x1 + 10, y1); sx.lineTo(x1 - 10, y1); sx.closePath(); sx.fill();
    }
    // Ветви кроны: чем дальше от ствола, тем тоньше и прозрачнее
    E.branches.forEach(([x0, y0, x1, y1, d]) => {
      const sway = reduce ? 0 : Math.sin(t * 0.6 + x1 * 0.05) * d * 0.15;
      const c = d < 2 ? '#0b0907' : d < 4 ? 'rgba(14,12,9,0.85)' : 'rgba(20,17,12,0.6)';
      line(x0, y0, x1 + sway, y1 + sway * 0.4, c);
      if (d < 2) line(x0 + 1, y0, x1 + 1 + sway, y1, c);
    });
    E.foliage.forEach(([x, y, a]) => { const sw = reduce ? 0 : Math.sin(t * 0.6 + x * 0.05) * 0.8; px(x + sw, y, `rgba(12,10,7,${a})`); });
    // Лианы с кроны
    E.vines.forEach(v => { const sw = reduce ? 0 : Math.sin(t * 0.9 + v.ph) * 1.2; line(v.x, v.y, v.x + sw, v.y + v.len, 'rgba(18,15,10,0.55)'); });
    // Ствол: толстый, скрученный, с горящими трещинами
    const top = crown + 4, base = hy - 20;
    for (let y = top; y < base; y++) {
      const k = (y - top) / (base - top), w = Math.round(4 + (1 - k) * 3 + k * 5 + Math.sin(y * 0.35) * 1.4);
      const off = Math.round(Math.sin(y * 0.12) * 2);
      sx.fillStyle = '#0d0b08'; sx.fillRect(tx - w + off, y, w * 2, 1);
    }
    for (let i = 0; i < 3; i++) {
      let x = tx - 2 + i * 2;
      for (let y = top + 6 + i * 5; y < base - 6; y += 1) {
        x += Math.round(Math.sin(y * 0.6 + i * 2) * 0.6);
        const f = 0.55 + 0.45 * Math.sin(t * 2.4 + y * 0.3 + i);
        if ((y + i) % 3 !== 0) px(x + Math.round(Math.sin(y * 0.12) * 2), y, f > 0.7 ? `rgba(255,214,120,${f})` : `rgba(232,119,46,${f})`);
      }
    }
    // Руины слева и справа, акведук и замок под древом
    sx.fillStyle = 'rgba(40,34,22,0.85)'; E.ruins.forEach((h, x) => h && sx.fillRect(x, hy - h, 1, h));
    const aq0 = Math.round(W * 0.27), aq1 = Math.round(W * 0.43), ay = hy - 26;
    sx.fillStyle = 'rgba(44,37,24,0.9)'; sx.fillRect(aq0, ay, aq1 - aq0, 3);
    for (let x = aq0; x < aq1; x += 6) { sx.fillRect(x, ay, 2, 26); sx.fillRect(x + 2, ay + 3, 1, 1); sx.fillRect(x + 5, ay + 3, 1, 1); }
    sx.fillStyle = '#17140e';
    E.castle.forEach(b => {
      sx.fillRect(b.x, hy - b.h, b.w, b.h);
      for (let x = b.x; x < b.x + b.w; x += 3) sx.fillRect(x, hy - b.h - 2, 2, 2); // зубцы
      if (b.sp) for (let k = 0; k < b.w; k++) sx.fillRect(b.x + Math.min(k, b.w - 1 - k) + 0, hy - b.h - 2 - Math.min(k, b.w - 1 - k) * 2, 1, 1);
      if (b.sp) { const m = Math.floor(b.w / 2); sx.fillRect(b.x + m - 1, hy - b.h - 2 - m * 2, 2, m * 2 + 2); }
    });
    // Окна замка тлеют
    for (let i = 0; i < 6; i++) px(tx - 6 + i * 3, hy - 30 + (i % 3) * 6, `rgba(242,180,90,${0.4 + 0.3 * Math.sin(t * 2 + i)})`);
    // Туман у земли: полосы медленно плывут
    for (let i = 0; i < 4; i++) {
      const y = hy - 14 + i * 6, a = 0.16 + 0.06 * Math.sin(t * 0.4 + i);
      const fg = sx.createLinearGradient(0, y - 6, 0, y + 8);
      fg.addColorStop(0, 'rgba(200,180,130,0)'); fg.addColorStop(0.5, `rgba(200,180,130,${a})`); fg.addColorStop(1, 'rgba(200,180,130,0)');
      sx.fillStyle = fg; sx.fillRect(0, y - 6, W, 14);
    }
    // Поле
    const gg = sx.createLinearGradient(0, hy, 0, H);
    gg.addColorStop(0, '#3a3220'); gg.addColorStop(1, '#14110b');
    sx.fillStyle = gg; sx.fillRect(0, hy, W, H - hy);
    // Надгробия и трава вперемешку, по глубине
    const GR = ['#6e5a2e', '#8a6d34', '#a8843e', '#4e4224'];
    let gi = 0;
    E.stones.forEach(st => {
      while (gi < E.grass.length && E.grass[gi].y < st.y) blade(E.grass[gi++], t, GR);
      const x = Math.round(st.x), y = Math.round(st.y);
      for (let k = 0; k < st.h; k++) {
        const w = k === 0 ? st.w - 2 : st.w, off = k === 0 ? 1 : 0;
        sx.fillStyle = k < 2 ? '#aaa595' : '#858174'; sx.fillRect(x + off + Math.round(st.tilt * k / st.h), y - st.h + k, w, 1);
        sx.fillStyle = '#56534a'; sx.fillRect(x + off + w - 1 + Math.round(st.tilt * k / st.h), y - st.h + k, 1, 1);
      }
    });
    while (gi < E.grass.length) blade(E.grass[gi++], t, GR);
    if (E.rider) {
      // Всадник крупнее на больших экранах: рисуем в масштабе 2, пиксели остаются ровными
      const k = W >= 260 ? 2 : 1;
      sx.save(); sx.translate(E.rider.x, E.rider.y); sx.scale(k, k); drawRider(0, 0, t); sx.restore();
    }
  }
  function blade(b, t, GR) {
    const sway = reduce ? 0 : Math.sin(t * 1.4 + b.ph + b.x * 0.05) * (b.h * 0.18);
    const n = Math.round(b.h);
    for (let k = 0; k < n; k++) px(b.x + sway * (k / n) * (k / n), b.y - k, GR[b.c]);
    if (b.h > 9) px(b.x + sway, b.y - n, '#d8b25a');
  }
  // Всадник на рогатом коне, меч поднят над головой; плащ и плюмаж на ветру
  function drawRider(x, y, t) {
    const bob = reduce ? 0 : Math.round(Math.sin(t * 1.2) * 0.6);
    const fl = reduce ? 0 : Math.sin(t * 3);
    const D = '#1d1a16', M = '#2e2922', L = '#4a4236';
    sx.fillStyle = 'rgba(0,0,0,0.35)'; sx.fillRect(x + 2, y, 22, 2);
    // Ноги коня
    [[5, 0], [8, 1], [17, 0], [20, 1]].forEach(([lx, s]) => { sx.fillStyle = D; sx.fillRect(x + lx, y - 8 + s, 2, 8 - s); });
    // Туловище коня
    sx.fillStyle = M; sx.fillRect(x + 4, y - 14 + bob, 18, 6); sx.fillRect(x + 5, y - 15 + bob, 15, 1);
    sx.fillStyle = L; sx.fillRect(x + 6, y - 14 + bob, 12, 1);
    // Шея и голова с рогами
    for (let k = 0; k < 7; k++) { sx.fillStyle = M; sx.fillRect(x + 19 + Math.round(k * 0.6), y - 14 - k + bob, 4, 1); }
    sx.fillStyle = M; sx.fillRect(x + 22, y - 23 + bob, 6, 4); sx.fillRect(x + 27, y - 21 + bob, 2, 2);
    sx.fillStyle = '#d8cfb4'; [[22, -25], [21, -26], [21, -27], [26, -25], [27, -26], [27, -27]].forEach(([a, b]) => sx.fillRect(x + a, y + b + bob, 1, 1));
    sx.fillStyle = '#f2d58a'; sx.fillRect(x + 25, y - 22 + bob, 1, 1);
    // Хвост
    for (let k = 0; k < 7; k++) px(x + 3 - Math.round(k * 0.4 + fl * (k / 7)), y - 13 + k + bob, D);
    // Плащ всадника летит назад
    for (let k = 0; k < 9; k++) { sx.fillStyle = k < 4 ? '#5a1a14' : '#3a120e'; sx.fillRect(x + 4 - Math.round(k * 0.5 + fl * k * 0.15), y - 24 + k + bob, 6 - Math.floor(k / 3), 1); }
    // Тело и голова
    sx.fillStyle = '#3a312a'; sx.fillRect(x + 10, y - 24 + bob, 5, 9);
    sx.fillStyle = '#6a1c16'; sx.fillRect(x + 10, y - 18 + bob, 5, 2);
    sx.fillStyle = '#8f8a7e'; sx.fillRect(x + 11, y - 28 + bob, 3, 4);
    sx.fillStyle = '#c9c3b2'; sx.fillRect(x + 11, y - 28 + bob, 3, 1);
    // Плюмаж — белые пряди на ветру
    for (let k = 0; k < 6; k++) px(x + 10 - k, y - 28 + Math.round(Math.sin(t * 5 + k) * (reduce ? 0 : 0.8)) + Math.floor(k / 2) + bob, k < 3 ? '#efe8d8' : 'rgba(239,232,216,0.6)');
    // Рука и меч, поднятый к древу
    line(x + 14, y - 22 + bob, x + 17, y - 26 + bob, '#3a312a');
    line(x + 17, y - 26 + bob, x - 9, y - 35 + bob, '#d9dbe2');
    line(x + 16, y - 27 + bob, x - 9, y - 36 + bob, 'rgba(255,255,255,0.45)');
    sx.fillStyle = '#c9a45c'; sx.fillRect(x + 16, y - 28 + bob, 1, 3);
  }

  /* Ночная буря: фон после входа */
  function drawStorm(t, dt) {
    if (!E) custom();
    const { hy, cx, cy, R } = E;
    const g = sx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#07081a'); g.addColorStop(0.45, '#17153a'); g.addColorStop(0.68, '#3b2550'); g.addColorStop(0.74, '#8a4f78'); g.addColorStop(0.8, '#1a1838'); g.addColorStop(1, '#090b1a');
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    // Сияние за знаком
    const pulse = reduce ? 0 : 0.08 * Math.sin(t * 0.8);
    const glow = sx.createRadialGradient(cx, cy, 2, cx, cy, R * 2.2);
    glow.addColorStop(0, `rgba(230,220,255,${0.55 + pulse})`); glow.addColorStop(0.3, `rgba(150,120,230,${0.32 + pulse})`); glow.addColorStop(1, 'rgba(90,70,180,0)');
    sx.fillStyle = glow; sx.fillRect(0, 0, W, H);
    // Туманность: спирали из точек, медленно вращаются
    const rot = reduce ? 0 : t * 0.05;
    const NC = ['rgba(150,120,230,', 'rgba(220,210,255,', 'rgba(255,170,210,'];
    E.neb.forEach(p => {
      const a = p.a + rot + p.r / R * p.sw;
      sx.fillStyle = NC[p.c] + (p.al * (1 - p.r / R * 0.6)) + ')';
      sx.fillRect(Math.round(cx + Math.cos(a) * p.r), Math.round(cy + Math.sin(a) * p.r * 0.92), 1, 1);
    });
    // Знак: несколько пересекающихся кругов и столп света
    const la = 0.35 + (reduce ? 0 : 0.15 * Math.sin(t * 1.1));
    ring(cx, cy, R * 1.08, `rgba(220,215,255,${la})`);
    ring(cx - R * 0.35, cy + R * 0.1, R * 0.82, `rgba(200,190,255,${la * 0.8})`);
    ring(cx + R * 0.3, cy - R * 0.12, R * 0.7, `rgba(200,190,255,${la * 0.7})`);
    ring(cx, cy + R * 0.25, R * 0.45, `rgba(220,215,255,${la * 0.6})`);
    sx.fillStyle = `rgba(240,236,255,${0.55 + la * 0.5})`; sx.fillRect(cx, 0, 1, E.hero.y - (W >= 260 ? 84 : 42));
    sx.fillStyle = `rgba(200,190,255,${0.18})`; sx.fillRect(cx - 1, 0, 3, E.hero.y - (W >= 260 ? 84 : 42));
    // Звезда на вершине знака
    const sy = Math.round(cy - R * 1.08), tw = reduce ? 3 : 3 + Math.round(Math.sin(t * 2.2) * 1.5);
    sx.fillStyle = '#ffffff'; sx.fillRect(cx - tw, sy, tw * 2 + 1, 1); sx.fillRect(cx, sy - tw, 1, tw * 2 + 1);
    // Молния: изредка небо вспыхивает
    if (!reduce) {
      E.nextFlash -= dt;
      if (E.nextFlash <= 0) {
        E.flash = 1; E.nextFlash = 5 + Math.random() * 8;
        let bx = Math.random() < 0.5 ? W * (0.1 + Math.random() * 0.25) : W * (0.65 + Math.random() * 0.25), by = 0;
        E.bolt = [];
        while (by < H * 0.45) { const nx = bx + (Math.random() - 0.5) * 8, ny = by + 3 + Math.random() * 5; E.bolt.push([bx, by, nx, ny]); bx = nx; by = ny; }
      }
      if (E.flash > 0) {
        sx.fillStyle = `rgba(190,180,255,${E.flash * 0.22})`; sx.fillRect(0, 0, W, H);
        if (E.flash > 0.6) E.bolt.forEach(([a, b, c, d]) => line(a, b, c, d, `rgba(235,235,255,${E.flash})`));
        E.flash = Math.max(0, E.flash - dt * 2.2);
      }
    }
    // Холмы с руинами
    sx.fillStyle = '#0e1230'; E.ruins.forEach((h, x) => h && sx.fillRect(x, H - E.hill[x] - h, 1, h));
    E.hill.forEach((h, x) => {
      sx.fillStyle = '#121838'; sx.fillRect(x, H - h, 1, h);
      sx.fillStyle = '#1e2856'; sx.fillRect(x, H - h, 1, 1);
    });
    const fog = sx.createLinearGradient(0, hy - 20, 0, H);
    fog.addColorStop(0, 'rgba(60,70,140,0)'); fog.addColorStop(0.5, 'rgba(60,70,140,0.25)'); fog.addColorStop(1, 'rgba(8,10,24,0.85)');
    sx.fillStyle = fog; sx.fillRect(0, hy - 20, W, H - hy + 20);
    // Синее пламя
    E.flames.forEach(f => {
      const glowF = sx.createRadialGradient(f.x, f.y - 2, 0, f.x, f.y - 2, 10);
      glowF.addColorStop(0, 'rgba(70,140,255,0.22)'); glowF.addColorStop(1, 'rgba(70,140,255,0)');
      sx.fillStyle = glowF; sx.fillRect(f.x - 10, f.y - 12, 20, 20);
      for (let i = 0; i < f.w; i++) {
        const h = Math.max(1, Math.round(f.h * (1 - Math.abs(i - (f.w - 1) / 2) / f.w) + (reduce ? 0 : 1.6 * Math.sin(t * 9 + f.ph + i * 1.7))));
        for (let k = 0; k < h; k++) px(f.x + i, f.y - k, k / h < 0.3 ? '#cfeaff' : k / h < 0.65 ? '#4aa8ff' : '#2a4cff');
      }
    });
    { const k = W >= 260 ? 2 : 1; sx.save(); sx.translate(E.hero.x, E.hero.y); sx.scale(k, k); drawHero(-5, 0, t); sx.restore(); }
    // Дождь
    E.rain.forEach(r => {
      if (!reduce) { r.y += r.v * dt; r.x -= r.v * 0.18 * dt; if (r.y > H) { r.y = -4; r.x = Math.random() * (W + 20); } }
      sx.fillStyle = `rgba(170,190,255,${r.a})`;
      for (let k = 0; k < r.l; k++) sx.fillRect(Math.round(r.x + k * 0.2), Math.round(r.y - k), 1, 1);
    });
  }
  // Воин спиной к зрителю: рваный плащ на ветру, рука поднята к рукояти двуручного меча, воткнутого в землю
  function drawHero(x, y, t) {
    const fl = reduce ? 0 : Math.sin(t * 2.6), fl2 = reduce ? 0 : Math.sin(t * 3.7 + 1);
    const D = '#0d1024', M = '#1b2048', L = '#2c3670', B = '#5d7cff';
    sx.fillStyle = 'rgba(0,0,0,0.4)'; sx.fillRect(x - 4, y, 18, 2);
    // Ноги
    sx.fillStyle = D; sx.fillRect(x + 1, y - 9, 3, 9); sx.fillRect(x + 6, y - 9, 3, 8); sx.fillRect(x + 6, y - 1, 4, 1);
    // Рваный плащ: полосы разной длины, края летят влево
    for (let k = 0; k < 16; k++) {
      const w = 10 + Math.round(k * 0.35), off = Math.round((k / 16) * (k / 16) * (6 + fl * 3));
      sx.fillStyle = k > 12 && k % 2 ? D : M; sx.fillRect(x - off - Math.round(k * 0.15), y - 26 + k, w - (k > 12 ? (k % 3) * 2 : 0), 1);
    }
    for (let k = 0; k < 6; k++) px(x - 6 - k - Math.round(fl2 * 2), y - 13 + k * 2 + (k % 2), M);
    // Синие отблески на плаще
    for (let k = 0; k < 5; k++) px(x + 7 - Math.round(k * 0.4), y - 22 + k * 3, B);
    // Плечи и шлем с гребнем
    sx.fillStyle = L; sx.fillRect(x - 1, y - 27, 12, 2);
    sx.fillStyle = M; sx.fillRect(x + 2, y - 32, 6, 5);
    sx.fillStyle = L; sx.fillRect(x + 3, y - 34, 4, 2); sx.fillRect(x + 4, y - 36, 2, 2);
    px(x + 1, y - 34, L); px(x + 8, y - 34, L); px(x, y - 35, L); px(x + 9, y - 35, L);
    // Меч у правой руки: клинок в землю, рукоять выше головы
    const sx0 = x + 15;
    sx.fillStyle = '#7a88c8'; sx.fillRect(sx0, y - 30, 1, 31);
    sx.fillStyle = '#c8d4ff'; sx.fillRect(sx0 + 1, y - 30, 1, 31);
    sx.fillStyle = '#3a4280'; sx.fillRect(sx0 - 2, y - 31, 6, 1);
    sx.fillStyle = M; sx.fillRect(sx0, y - 38, 2, 7);
    sx.fillStyle = '#c8d4ff'; sx.fillRect(sx0 - 1, y - 40, 4, 2); px(sx0 - 2, y - 41, '#c8d4ff'); px(sx0 + 3, y - 41, '#c8d4ff');
    // Рука к рукояти
    line(x + 10, y - 26, sx0, y - 36, L);
    line(x + 10, y - 25, sx0, y - 35, M);
    // Синие огоньки, ползущие по мечу
    for (let k = 0; k < 4; k++) { const yy = y - 4 - ((t * 9 + k * 7) % 26 | 0); px(sx0 + (k % 2 ? 2 : -1), yy, `rgba(120,180,255,${0.8 - (y - yy) / 40})`); }
  }
  let t0 = performance.now(), last = 0;
  // Пиксельной картинке хватает 30 кадров в секунду: на слабых компьютерах страница остаётся отзывчивой
  const STEP = 1000 / 30;
  function frame(now) {
    if (now - last < STEP - 2) { requestAnimationFrame(frame); return; }
    const t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    const gy = H - Math.max(18, Math.round(H * 0.12));
    if (T.custom) { (T.custom === 'erdtree' ? drawErd : drawStorm)(t, dt); overlay(t, dt, gy); requestAnimationFrame(frame); return; }
    // sky
    const g = sx.createLinearGradient(0, 0, 0, gy);
    g.addColorStop(0, T.sky[0]); g.addColorStop(0.55, T.sky[1]); g.addColorStop(1, T.sky[2]);
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    if (T.stars) stars.forEach(s => { sx.fillStyle = `rgba(230,220,198,${s.a * (0.7 + 0.3 * Math.sin(t * 1.3 + s.tw))})`; sx.fillRect(s.x, s.y, 1, 1); });
    // sun / eclipse
    // Светило держится в правом верхнем углу, подальше от заголовков страниц
    const R = W < 140 ? Math.max(8, Math.round(W * 0.07)) : Math.max(12, Math.round(Math.min(W, H) * 0.075));
    const ex = W < 140 ? W - R * 2 - 2 : W - R * 2 - 4, ey = T.orb === 'sunset' ? Math.round(gy - 40 - R * 0.6) : Math.round(H * 0.13);
    orb(t, ex, ey, R);
    // clouds
    if (T.clouds) clouds.forEach(c => {
      if (!reduce) { c.x += c.v * dt; if (c.x > W + c.w) c.x = -c.w * 2; }
      const x = Math.round(c.x), y = Math.round(c.y);
      sx.fillStyle = T.cloudColor || 'rgba(255,255,255,0.75)';
      sx.fillRect(x, y, c.w, 3); sx.fillRect(x + 3, y - 2, c.w - 8, 2); sx.fillRect(x + 6, y - 4, Math.round(c.w / 3), 2);
    });
    // castles
    sx.fillStyle = T.far; far.forEach((h, x) => sx.fillRect(x, gy - h, 1, h));
    sx.fillStyle = T.near; near.forEach((h, x) => sx.fillRect(x, gy - h, 1, h));
    if (T.windows) nearT.forEach((tw, i) => { for (let k = 0; k < (tw.win || 0); k++) {
      const a = 0.55 + 0.35 * Math.sin(t * 2 + i * 1.7 + k);
      sx.fillStyle = `rgba(232,119,46,${a})`; sx.fillRect(tw._cx, gy - tw.h + 4 + k * 6, 1, 2);
    } });
    // autumn trees
    if (T.trees) trees.forEach((tr, i) => {
      sx.fillStyle = '#2a170f'; sx.fillRect(tr.x, gy - tr.h, 2, tr.h);
      const sway = reduce ? 0 : Math.round(Math.sin(t * 0.8 + i) * 0.6);
      tr.dots.forEach(([x, y, c]) => { sx.fillStyle = LEAF[c]; sx.fillRect(tr.x + x + sway, gy - tr.h - tr.r + y, 1, 1); });
    });
    // fog
    const fg = sx.createLinearGradient(0, gy - H * 0.35, 0, H);
    fg.addColorStop(0, T.fog[0]); fg.addColorStop(0.6, T.fog[1]); fg.addColorStop(1, T.fog[2]);
    sx.fillStyle = fg; sx.fillRect(0, gy - H * 0.35, W, H);
    // ground
    sx.fillStyle = T.ground; sx.fillRect(0, gy, W, H - gy);
    sx.fillStyle = T.groundLine; for (let x = 0; x < W; x += 8) sx.fillRect(x, gy, 7, 1);
    if (T.leavesOnGround) litter.forEach(l => { sx.fillStyle = LEAF[l.c]; sx.fillRect(l.x, gy + 1 + l.y, 1, 1); });
    // bonfire
    const bx = bonfireX(), by = gy - 19;
    const bg = sx.createRadialGradient(bx + 8, by + 10, 2, bx + 8, by + 10, 70);
    bg.addColorStop(0, `rgba(232,119,46,${T.glow + 0.06 * Math.sin(t * 9)})`); bg.addColorStop(1, 'rgba(232,119,46,0)');
    sx.fillStyle = bg; sx.fillRect(bx - 70, by - 70, 160, 150);
    drawSprite(BONFIRE, bonPal, bx, by);
    // traveler by the fire
    if (T.traveler) {
      const tx = bx + 17, ty = gy - TRAVELER.length;
      sx.fillStyle = 'rgba(0,0,0,0.25)'; sx.fillRect(tx + 1, gy, 9, 1);
      drawSprite(TRAVELER, { H: '#6b6470', S: '#e0b48a', s: '#b07a55', C: T.cloak.C, c: T.cloak.c, B: C.goldD, L: '#2e2a33', K: '#3a2a22', w: '#8a6a3a' }, tx, ty);
      // отсвет костра на плаще
      sx.fillStyle = `rgba(246,196,83,${0.25 + 0.1 * Math.sin(t * 9)})`; sx.fillRect(tx + 2, ty + 6, 1, 6);
    }
    // animated flames
    for (let col = 0; col < 13; col++) {
      const x = bx + 1 + col; if (x === bx + 7 || x === bx + 8) continue;
      const c = 6 - Math.abs(col - 6.5);
      const h = Math.max(1, Math.round(c * 2.4 + 2.5 * Math.sin(t * 11 + col * 1.9) + 1.5 * Math.sin(t * 7.3 + col)));
      for (let k = 0; k < h; k++) {
        const ratio = k / h;
        sx.fillStyle = ratio < 0.35 ? '#fff3c4' : ratio < 0.6 ? C.emberHi : ratio < 0.85 ? C.ember : '#b8401f';
        if (c < 2 && ratio < 0.35) sx.fillStyle = C.emberHi;
        sx.fillRect(x, by + 15 - k, 1, 1);
      }
    }
    // embers
    if (!reduce && embers.length < 40 && Math.random() < 0.5) embers.push({ x: bx + 4 + Math.random() * 8, y: by + 8, vx: (Math.random() - 0.5) * 5, vy: -8 - Math.random() * 12, life: 0, max: 2 + Math.random() * 3 });
    embers = embers.filter(e => (e.life += dt) < e.max);
    embers.forEach(e => {
      e.x += (e.vx + Math.sin(t * 3 + e.max) * 3) * dt; e.y += e.vy * dt;
      sx.fillStyle = `rgba(${e.life < e.max * 0.5 ? '246,196,83' : '232,119,46'},${1 - e.life / e.max})`;
      sx.fillRect(Math.round(e.x), Math.round(e.y), 1, 1);
    });
    overlay(t, dt, gy);
    requestAnimationFrame(frame);
  }
  layout(); addEventListener('resize', layout); requestAnimationFrame(frame);

  window.AshScene = {
    THEMES: Object.keys(THEMES),
    get name() { return name; },
    set(n) {
      if (!THEMES[n]) n = DEFAULT; // пусто — фон по умолчанию
      if (n === name) return;
      name = n; T = THEMES[n]; remember();
      seed = 11; parts = Array.from({ length: T.particles.n }, () => newPart(false));
      custom();
    }
  };
})();
