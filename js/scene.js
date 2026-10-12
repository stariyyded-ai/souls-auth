/* Фон: пиксельный склеп на canvas низкого разрешения (замок, затмение, костёр, искры, пепел). */
(() => {
  const C = { gold: '#c9a45c', goldD: '#7a5f2e', ember: '#e8772e', emberHi: '#f6c453', stone: '#5a5066' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BONFIRE = ['.......HH.......','.......HH.......','.....HHHHHH.....','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.......Ss.......','.BCcCcCSsCcCcB..','BBCECcCCCCcECBB.','.CcCCECcCECCcC..','BBBCCCCCCCCCBBB.','.BBBBBBBBBBBBB..'];

  /* ---------- pixel scene ---------- */
  const scene = document.getElementById('scene'), sx = scene.getContext('2d');
  const PX = 4;
  let W = 0, H = 0, stars = [], embers = [], ash = [];
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
  function layout() {
    W = Math.ceil(innerWidth / PX); H = Math.ceil(innerHeight / PX);
    scene.width = W; scene.height = H;
    fx.width = innerWidth * devicePixelRatio; fx.height = innerHeight * devicePixelRatio;
    seed = 7;
    stars = Array.from({ length: Math.round(W * H / 260) }, () => ({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * H * 0.62), a: 0.15 + rnd() * 0.45, tw: rnd() * 6 }));
    far = towers(W, 26, farT.map(t => ({ ...t })));
    nearT = [{cx:.02,w:3,h:28,sp:6,win:2},{cx:.12,w:2,h:22,sp:5,win:1},{cx:.24,w:3,h:34,sp:9,n:3,win:3},{cx:.38,w:2,h:20,sp:4},{cx:.71,w:3,h:30,sp:8,n:2,win:2},{cx:.83,w:2,h:22,sp:5,win:1},{cx:.95,w:4,h:36,sp:10,n:4,win:3}];
    near = towers(W, 13, nearT);
    ash = Array.from({ length: 40 }, () => ({ x: rnd() * W, y: rnd() * H, v: 2 + rnd() * 4, a: 0.1 + rnd() * 0.25 }));
  }
  const fx = document.getElementById('fx');
  function bonfireX() { return W < 140 ? Math.round(W * 0.5) - 8 : Math.round(W * 0.14); }
  function drawSprite(rows, pal, x0, y0) {
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) { sx.fillStyle = c; sx.fillRect(x0 + x, y0 + y, 1, 1); } } });
  }
  const bonPal = { H: '#6b4a2b', S: '#b8b8c4', s: '#5a5a66', C: '#3a2a22', c: '#5a3a28', E: '#ff9a3c', B: '#bdb2a0' };
  let t0 = performance.now(), last = 0;
  function frame(now) {
    const t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    const gy = H - Math.max(18, Math.round(H * 0.12));
    // sky
    const g = sx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1b1520'); g.addColorStop(0.55, '#0e0b11'); g.addColorStop(1, '#050406');
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    stars.forEach(s => { sx.fillStyle = `rgba(230,220,198,${s.a * (0.7 + 0.3 * Math.sin(t * 1.3 + s.tw))})`; sx.fillRect(s.x, s.y, 1, 1); });
    // eclipse (dark sign)
    const ex = Math.round(W * (W < 140 ? 0.78 : 0.82)), ey = Math.round(H * 0.2), R = Math.max(12, Math.round(Math.min(W, H) * 0.09));
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
    // castles
    sx.fillStyle = '#1e1926'; far.forEach((h, x) => sx.fillRect(x, gy - h, 1, h));
    sx.fillStyle = '#0c0a0e'; near.forEach((h, x) => sx.fillRect(x, gy - h, 1, h));
    nearT.forEach((tw, i) => { for (let k = 0; k < (tw.win || 0); k++) {
      const a = 0.55 + 0.35 * Math.sin(t * 2 + i * 1.7 + k);
      sx.fillStyle = `rgba(232,119,46,${a})`; sx.fillRect(tw._cx, gy - tw.h + 4 + k * 6, 1, 2);
    } });
    // fog
    const fg = sx.createLinearGradient(0, gy - H * 0.35, 0, H);
    fg.addColorStop(0, 'rgba(42,37,48,0)'); fg.addColorStop(0.6, 'rgba(42,37,48,0.35)'); fg.addColorStop(1, 'rgba(10,9,12,0.9)');
    sx.fillStyle = fg; sx.fillRect(0, gy - H * 0.35, W, H);
    // ground
    sx.fillStyle = '#0b090c'; sx.fillRect(0, gy, W, H - gy);
    sx.fillStyle = '#1f1a22'; for (let x = 0; x < W; x += 8) sx.fillRect(x, gy, 7, 1);
    // bonfire
    const bx = bonfireX(), by = gy - 19;
    const bg = sx.createRadialGradient(bx + 8, by + 10, 2, bx + 8, by + 10, 70);
    bg.addColorStop(0, `rgba(232,119,46,${0.32 + 0.06 * Math.sin(t * 9)})`); bg.addColorStop(1, 'rgba(232,119,46,0)');
    sx.fillStyle = bg; sx.fillRect(bx - 70, by - 70, 160, 150);
    drawSprite(BONFIRE, bonPal, bx, by);
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
    // drifting ash
    ash.forEach(a => { if (!reduce) { a.y += a.v * dt; a.x += Math.sin(t + a.v) * dt * 2; if (a.y > H) { a.y = -1; a.x = Math.random() * W; } }
      sx.fillStyle = `rgba(230,220,198,${a.a})`; sx.fillRect(Math.round(a.x), Math.round(a.y), 1, 1); });
    // vignette
    const v = sx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.75)');
    sx.fillStyle = v; sx.fillRect(0, 0, W, H);
    requestAnimationFrame(frame);
  }
  layout(); addEventListener('resize', layout); requestAnimationFrame(frame);
})();
