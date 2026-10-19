/* Фон: пиксельный склеп на canvas низкого разрешения (замок, небо, костёр, искры, частицы).
   Три темы: night — ночь и затмение (по умолчанию), day — светлый день, у костра стоит путник,
   autumn — осенний закат с деревьями и листопадом, путник тоже у костра.
   Тему студент покупает в магазине, администратор выбирает бесплатно. Сменить на лету: window.AshScene.set('day'). */
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
  // Тема пользователя приходит с сервера (api/boot.js); на странице входа — та, что была в прошлый раз
  const saved = (() => { try { return localStorage.getItem('ash.scene'); } catch (e) { return null; } })();
  let name = (window.BOOT && window.BOOT.me && window.BOOT.me.theme) || (window.BOOT ? 'night' : saved) || 'night';
  if (!THEMES[name]) name = 'night';
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
    return { x: rnd() * W, y: top ? -2 : rnd() * H, v: k.kind === 'leaves' ? 5 + rnd() * 6 : 2 + rnd() * 4, a: k.kind === 'ash' ? 0.1 + rnd() * 0.25 : k.kind === 'dust' ? 0.25 + rnd() * 0.35 : 0.75 + rnd() * 0.25,
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

  let t0 = performance.now(), last = 0;
  // Пиксельной картинке хватает 30 кадров в секунду: на слабых компьютерах страница остаётся отзывчивой
  const STEP = 1000 / 30;
  function frame(now) {
    if (now - last < STEP - 2) { requestAnimationFrame(frame); return; }
    const t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    const gy = H - Math.max(18, Math.round(H * 0.12));
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
    // drifting ash, dust or falling leaves
    const leaves = T.particles.kind === 'leaves';
    parts.forEach(a => {
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
    requestAnimationFrame(frame);
  }
  layout(); addEventListener('resize', layout); requestAnimationFrame(frame);

  window.AshScene = {
    THEMES: Object.keys(THEMES),
    get name() { return name; },
    set(n) {
      if (!THEMES[n]) n = 'night';
      if (n === name) return;
      name = n; T = THEMES[n]; remember();
      seed = 11; parts = Array.from({ length: T.particles.n }, () => newPart(false));
    }
  };
})();
