/* Вступительный ролик «Путь путника»: путник идёт через весенний лес, летние горы, осенние болота
   и зимнюю метель, доходит до избушки, где мастер кода говорит, что самый трудный путь ещё впереди.
   Рисуется на canvas 320×180 пикселями (как фон сайта), без видеофайлов: грузится мгновенно.
   Кабинет показывает ролик при первом входе (в состоянии студента отмечается introSeen),
   а кнопка «Посмотреть ролик» внизу кабинета открывает его снова: window.AshIntro.play().
   Esc или «Пропустить» — закрыть; звук — тихая мелодия, если на сайте не выключен звук. */
(() => {
  const W = 320, H = 180;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- спрайты ---------- */
  // Путник: тот же, что на фоне сайта у костра; тут смотрит вправо и шагает (две фазы ног)
  const BODY = ['....HHH....', '...HHHHH...', '...SsHHH...', '...ssHHH...', '....HHH..w.', '...CCCCC.w.', '..CCCCCCCw.', '..CCcCCCCw.', '..CCcCCCSw.', '..CCBBBCCw.', '..CCcCCCCw.', '..CCcCCCCw.', '...CcCCC.w.'];
  const LEGS = [['...LL.LL.w.', '..LL...LLw.', '.KKK...KKw.'], ['....LLL..w.', '....LLL..w.', '...KKKK..w.']];
  const STAND = ['...LL.LL.w.', '...LL.LL.w.', '..KKK.KKKw.'];
  const flip = rows => rows.map(r => r.split('').reverse().join(''));
  const WALK = LEGS.map(l => flip(BODY.concat(l))), IDLE = flip(BODY.concat(STAND));
  // Мастер кода: седая борода, синяя мантия с золотой каймой, сидит за столом
  const MASTER = [
    '.....rrrrrr.....', '....rRRRRRRr....', '...rRRRRRRRRr...', '...rRSSSSSSRr...', '...rRSESSESRr...', '...rRSSSSSSRr...',
    '...rRWWSSWWRr...', '..rRRWWWWWWRRr..', '..rRRWWWWWWRRr..', '.rRRRwWWWWwRRRr.', '.rRGRRwWWwRRGRr.', 'rRRGRRRwwRRRGRRr',
    'rRRGRRRRRRRRGRRr', 'rRRGRRRRRRRRGRRr', 'rRRGRRRRRRRRGRRr', 'rSSGRRRRRRRRGSSr'];
  // Костёр с мечом — как на фоне сайта; ворон — спутник путника
  const BONFIRE = ['.......HH.......', '.......HH.......', '.....HHHHHH.....', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.......Ss.......', '.BCcCcCSsCcCcB..', 'BBCECcCCCCcECBB.', '.CcCCECcCECCcC..', 'BBBCCCCCCCCCBBB.', '.BBBBBBBBBBBBB..'];
  const P_BON = { H: '#6b4a2b', S: '#b8b8c4', s: '#5a5a66', C: '#3a2a22', c: '#5a3a28', E: '#ff9a3c', B: '#bdb2a0' };
  const CROW = [['.k....', 'kkkk..', '.kkkkY', '..kk..'], ['......', '.kkkkY', 'kkkk..', 'k.....']];
  const P_TRAV = { H: '#6b6470', S: '#e0b48a', s: '#b07a55', C: '#5a4a6e', c: '#3f3350', B: '#7a5f2e', L: '#2e2a33', K: '#3a2a22', w: '#8a6a3a' };
  const P_MASTER = { r: '#141b36', R: '#2b3a6b', G: '#c9a45c', S: '#d8a77f', E: '#111111', W: '#ebe7dd', w: '#b9b3a6' };

  /* ---------- рисование ---------- */
  let cv, g;
  const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
  function sprite(rows, pal, x0, y0, s = 1) {
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) rect(x0 + x * s, y0 + y * s, s, s, c); } });
  }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
  // Небо полосами по 6 пикселей — пиксельный градиент (ниже to — цвет горизонта)
  function sky(top, mid, bottom, to = 130) {
    for (let y = 0; y < to; y += 6) { const k = y / to; rect(0, y, W, 6, k < 0.5 ? mix(top, mid, k * 2) : mix(mid, bottom, (k - 0.5) * 2)); }
    if (to < H) rect(0, to, W, H - to, bottom);
  }
  // Пиксельный круг: солнце, луна, свечение
  function disc(cx, cy, r, c) {
    for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); rect(cx - w, cy + dy, w * 2 + 1, 1, c); }
  }
  // Гряда холмов или гор: высота — сумма синусов, сдвиг off даёт параллакс
  function ridge(off, base, amp, f, color, cap) {
    for (let x = 0; x < W; x++) {
      const u = x + off;
      const h = Math.round(base + amp * (Math.sin(u * f) + 0.55 * Math.sin(u * f * 2.3 + 1.7) + 0.3 * Math.sin(u * f * 5.1 + 0.4)));
      rect(x, H - h, 1, h, color);
      if (cap) { const peak = amp * 1.15; if (h > base + peak * 0.55) rect(x, H - h, 1, Math.max(1, Math.round((h - base - peak * 0.55) * 0.6)), cap); }
    }
  }
  const hash = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  function pine(x, y, h, c1, c2, snow) {
    rect(x - 1, y - 3, 2, 3, '#3a2a22');
    for (let i = 0; i < h; i++) {
      const w = Math.max(1, Math.round((i / h) * h * 0.45) + (i % 4 === 3 ? 1 : 0));
      rect(x - w, y - 3 - h + i, w * 2, 1, i % 4 === 0 ? c2 : c1);
      if (snow && i % 4 === 0) rect(x - w, y - 3 - h + i, Math.max(1, w), 1, '#eef3fb');
    }
  }
  function leafy(x, y, h, crown, crown2, trunk = '#4a3424') {
    rect(x - 1, y - h, 3, h, trunk);
    const r = Math.round(h * 0.6);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy * 1.4 > r * r) continue;
      rect(x + dx, y - h - r * 0.4 + dy, 1, 1, (dx + dy) % 3 === 0 ? crown2 : crown);
    }
  }
  // Ряд деревьев, бегущий со сдвигом off; kind выбирает дерево по номеру
  function forest(off, spacing, ground, draw) {
    const first = Math.floor(off / spacing) - 1;
    for (let i = first; i < first + W / spacing + 3; i++) draw(i * spacing - off + Math.round(hash(i) * spacing * 0.5), ground, i);
  }
  function traveler(x, y, t, walking, s = 2) {
    const f = walking ? Math.floor(t * 6) % 2 : 0;
    rect(x + 2 * s, y + 16 * s, 8 * s, s, 'rgba(0,0,0,0.25)');
    sprite(walking ? WALK[f] : IDLE, P_TRAV, x, y - (walking && f ? s : 0), s);
  }

  // Ворон летит над путником и машет крыльями
  function crow(x, y, t) { sprite(CROW[Math.floor(t * 5) % 2], { k: '#16131a', Y: '#c9a45c' }, Math.round(x), Math.round(y + Math.sin(t * 2.2) * 3), 2); }

  /* ---------- частицы ---------- */
  let parts = [];
  function particles(kind, n) {
    parts = Array.from({ length: n }, (_, i) => ({ x: hash(i + 1) * W, y: hash(i + 77) * H, s: hash(i + 9), kind }));
  }
  function stepParticles(dt, t, colors) {
    parts.forEach((p, i) => {
      if (p.kind === 'snow') { p.y += (14 + p.s * 18) * dt; p.x += (Math.sin(t * 1.5 + i) * 6 - 10) * dt; }
      else if (p.kind === 'petal' || p.kind === 'leaf') { p.y += (10 + p.s * 10) * dt; p.x += (Math.sin(t * 2 + i) * 14 - 14) * dt; }
      else if (p.kind === 'wisp') { p.y += Math.sin(t * 1.3 + i) * 4 * dt; p.x += Math.cos(t * 0.8 + i) * 5 * dt - 6 * dt; }
      else if (p.kind === 'mote') { p.y -= 3 * dt; p.x -= 8 * dt; }
      else if (p.kind === 'spark') { p.y -= (14 + p.s * 20) * dt; p.x += Math.sin(t * 3 + i) * 6 * dt; if (p.y < 60) { p.y = 138; p.x = 52 + hash(i + t) * 18; } }
      if (p.y > H) { p.y = -2; p.x = hash(i + t) * W + 30; }
      if (p.y < -4) p.y = H;
      if (p.x < -4) p.x += W + 8;
      if (p.x > W + 4) p.x -= W + 8;
      if (p.kind === 'wisp') {
        const a = 0.5 + 0.5 * Math.sin(t * 4 + i * 2);
        rect(p.x - 1, p.y - 1, 3, 3, `rgba(170,240,200,${0.18 * a})`); rect(p.x, p.y, 1, 1, `rgba(220,255,230,${0.6 + 0.4 * a})`);
      } else {
        const c = colors[i % colors.length];
        rect(p.x, p.y, p.kind === 'snow' && p.s > 0.6 ? 2 : 1, p.kind === 'leaf' || p.kind === 'petal' ? 1 : (p.s > 0.6 ? 2 : 1), c);
        if (p.kind === 'leaf' || p.kind === 'petal') rect(p.x + 1, p.y + (i % 2), 1, 1, c);
      }
    });
  }

  /* ---------- сцены ---------- */
  const GY = 150; // линия земли
  const SPEED = 16; // пикселей в секунду при ходьбе
  const SCENES = [
    {
      dur: 7, season: 'Пролог', where: 'Привал',
      text: 'Пепел. Искра. Огонь разгорается, и путник поднимается с привала. Пора в дорогу.',
      init: () => particles('spark', 0),
      draw(t, dt) {
        sky('#0e0b11', '#1b1520', '#2a2230');
        for (let i = 0; i < 50; i++) rect(hash(i) * W, hash(i + 40) * 110, 1, 1, `rgba(255,250,230,${0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i))})`);
        disc(258, 34, 12, 'rgba(232,119,46,0.25)'); disc(258, 34, 10, '#e8772e'); disc(258, 34, 8, '#050406');
        ridge(0, 52, 10, 0.03, '#1e1926'); ridge(40, 36, 6, 0.05, '#141018');
        rect(0, GY - 2, W, H - GY + 2, '#0b090c'); rect(0, GY - 2, W, 2, '#1f1a22');
        // костёр загорается на 1.5 секунде: вспышка, пламя, искры
        const lit = t > 1.5;
        if (lit && !parts.length) for (let i = 0; i < 24; i++) parts.push({ x: 52 + hash(i) * 18, y: 100 + hash(i + 3) * 40, s: hash(i + 7), kind: 'spark' });
        if (lit) {
          const r = 34 + Math.sin(t * 8) * 3;
          for (let k = 3; k > 0; k--) disc(62, GY - 14, Math.round(r * k / 3), `rgba(232,119,46,${0.07})`);
          for (let i = 0; i < 7; i++) { const h = 8 + Math.abs(Math.sin(t * 7 + i * 1.7)) * 12; rect(50 + i * 3, GY - 6 - h, 3, h, i % 2 ? '#e8772e' : '#f6c453'); rect(50 + i * 3, GY - 6 - h * 0.4, 3, h * 0.4, '#fff0a8'); }
        } else if (Math.floor(t * 4) % 2) rect(58, GY - 7, 2, 1, '#e8772e');
        sprite(BONFIRE, P_BON, 46, GY - 32, 2);
        if (t > 1.5 && t < 1.9) { g.fillStyle = `rgba(255,220,150,${0.5 * (1.9 - t) / 0.4})`; g.fillRect(0, 0, W, H); }
        // путник сидит у огня, потом встаёт и уходит вправо
        const up = t > 3.5, tx = up ? 110 + Math.max(0, t - 4.5) * 20 : 110;
        if (up) traveler(tx, GY - 32, t, t > 4.5);
        else { sprite(flip(BODY), P_TRAV, 110, GY - 26, 2); }
        if (t > 4.8) crow(tx + 40 + (t - 4.8) * 10, GY - 62 - (t - 4.8) * 6, t);
        stepParticles(dt, t, ['#f6c453', '#e8772e', '#fff0a8']);
      }
    },
    {
      dur: 9, season: 'Весна', where: 'Лес',
      text: 'Весна. Путник выходит в дорогу. В котомке только любопытство и первые теги: h1, p, a.',
      init: () => particles('petal', 34),
      draw(t, dt) {
        const off = t * SPEED;
        sky('#7fb3e0', '#bcd9ef', '#f6dfe6');
        disc(257, 29, 12, 'rgba(255,246,210,0.35)'); disc(257, 29, 8, '#fff6d2');
        ridge(off * 0.15, 66, 10, 0.03, '#9fb8a6');
        ridge(off * 0.35, 48, 8, 0.05, '#6f9a6a');
        forest(off * 0.6, 22, GY - 6, (x, y, i) => pine(x, y, 18 + Math.round(hash(i) * 10), '#3f6e45', '#4f8455'));
        rect(0, GY - 2, W, H - GY + 2, '#5f8f42'); rect(0, GY - 2, W, 2, '#7fb257');
        forest(off, 46, GY + 2, (x, y, i) => hash(i + 3) > 0.45 ? leafy(x, y, 14 + Math.round(hash(i) * 6), '#f2b7c6', '#e48aa6', '#5a3e2c') : pine(x, y, 22, '#355f3a', '#457a4a'));
        for (let x = 0; x < W; x += 3) { const u = Math.floor((x + off) / 3); if (hash(u) > 0.7) rect(x, GY + 4 + Math.round(hash(u + 5) * 18), 1, 2, hash(u + 2) > 0.5 ? '#f6e27a' : '#ffffff'); }
        traveler(120, GY - 32, t, true);
        crow(150, GY - 70, t);
        stepParticles(dt, t, ['#ffd6e2', '#ffffff', '#f2a6bd']);
      }
    },
    {
      dur: 9, season: 'Лето', where: 'Горы',
      text: 'Лето. Горные перевалы CSS: отступы, сетки, flex. Чем выше поднимаешься, тем шире вид.',
      init: () => particles('mote', 18),
      draw(t, dt) {
        const off = t * SPEED;
        sky('#3f86d1', '#8cc3ec', '#e8f1f4');
        disc(60, 34, 15, 'rgba(255,240,170,0.3)'); disc(60, 34, 10, '#fff3b0');
        [[40, 30], [150, 18], [230, 40]].forEach(([cx, cy], k) => { const x = ((cx - off * 0.1 + k * 40) % (W + 60) + W + 60) % (W + 60) - 30; rect(x, cy, 26, 5, '#ffffff'); rect(x + 5, cy - 3, 14, 4, '#ffffff'); });
        ridge(off * 0.12, 92, 26, 0.018, '#7c8db0', '#f4f7fb');
        ridge(off * 0.3, 66, 20, 0.03, '#5d6b8a', '#e8eef7');
        ridge(off * 0.55, 42, 10, 0.05, '#4c6b3e');
        rect(0, GY - 2, W, H - GY + 2, '#6f7a54'); rect(0, GY - 2, W, 2, '#8a9668');
        forest(off, 34, GY + 4, (x, y, i) => { if (hash(i) > 0.5) { rect(x, y - 5, 9, 5, '#8a8a8f'); rect(x + 1, y - 7, 6, 2, '#a3a3a8'); } else pine(x, y, 14, '#2f5a3a', '#3e6e48'); });
        // орёл в небе
        const bx = (t * 30) % (W + 40) - 20, by = 50 + Math.sin(t * 2) * 4, wing = Math.floor(t * 4) % 2;
        rect(bx, by, 3, 1, '#2a2430'); rect(bx - 3, by - (wing ? 2 : 0), 3, 1, '#2a2430'); rect(bx + 3, by - (wing ? 2 : 0), 3, 1, '#2a2430');
        traveler(120, GY - 32, t, true);
        crow(156, GY - 74, t);
        stepParticles(dt, t, ['rgba(255,252,230,0.8)']);
      }
    },
    {
      dur: 9, season: 'Осень', where: 'Болота',
      text: 'Осень. Топи JavaScript: ошибки затягивают, но огоньки подсказок ведут вперёд.',
      init: () => { particles('leaf', 26); for (let i = 0; i < 7; i++) parts.push({ x: hash(i + 300) * W, y: 110 + hash(i + 40) * 30, s: hash(i), kind: 'wisp' }); },
      draw(t, dt) {
        const off = t * SPEED;
        sky('#2f2142', '#a24d6b', '#f3a252');
        disc(240, 82, 16, 'rgba(255,207,138,0.3)'); disc(240, 82, 11, '#ffcf8a');
        ridge(off * 0.15, 58, 8, 0.03, '#5d3653');
        forest(off * 0.4, 26, GY - 12, (x, y, i) => leafy(x, y, 12 + Math.round(hash(i) * 6), hash(i) > 0.5 ? '#c4622a' : '#d9963a', '#8f3a1f', '#2b1a20'));
        rect(0, GY - 6, W, H - GY + 6, '#3a2a1e');
        // вода болота с отблесками
        forest(off, 40, GY, (x, y, i) => { const w = 18 + Math.round(hash(i) * 14); rect(x, y - 2, w, 6, '#2b3a3a'); rect(x + 2, y - 1, w - 6, 1, Math.floor(t * 2 + i) % 2 ? '#e39a5a' : '#4d6262'); });
        forest(off, 15, GY - 4, (x, y, i) => { if (hash(i) > 0.4) { rect(x, y - 9, 1, 9, '#5d6b33'); rect(x - 1, y - 11, 1, 3, '#8a5a2a'); rect(x + 2, y - 6, 1, 6, '#4c5a2a'); } });
        forest(off * 1.2, 90, GY + 10, (x, y) => { rect(x, y - 28, 3, 28, '#2a1d17'); rect(x - 6, y - 22, 6, 2, '#2a1d17'); rect(x + 3, y - 16, 7, 2, '#2a1d17'); });
        traveler(120, GY - 36, t, true);
        crow(152, GY - 72, t);
        for (let k = 0; k < 3; k++) rect(0, 128 + k * 12 + Math.sin(t + k) * 2, W, 3, 'rgba(230,200,190,0.10)');
        stepParticles(dt, t, ['#e8772e', '#f6c453', '#b8401f']);
      }
    },
    {
      dur: 11, season: 'Зима', where: 'Метель',
      text: 'Зима. Метель дизайна и юзабилити, усталость, последние шаги. Впереди — огонёк в окне.',
      init: () => particles('snow', 70),
      draw(t, dt) {
        // Первые 7 секунд мир едет, потом избушка встаёт на место и путник подходит к двери
        const stopAt = 7, moving = t < stopAt, off = Math.min(t, stopAt) * SPEED;
        sky('#141c33', '#33466e', '#7d93b8');
        for (let i = 0; i < 30; i++) rect(hash(i) * W, hash(i + 9) * 70, 1, 1, `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(t + i))})`);
        disc(265, 32, 9, 'rgba(238,243,251,0.2)'); disc(265, 32, 6, '#eef3fb'); disc(268, 30, 5, mix('#141c33', '#33466e', 0.2));
        ridge(off * 0.15, 70, 14, 0.025, '#4a5b80', '#e8eef7');
        forest(off * 0.4, 18, GY - 8, (x, y, i) => pine(x, y, 16 + Math.round(hash(i) * 8), '#24384a', '#2f4a5f', true));
        rect(0, GY - 2, W, H - GY + 2, '#dfe7f2'); rect(0, GY - 2, W, 2, '#ffffff');
        for (let x = 0; x < W; x += 4) { const u = Math.floor((x + off) / 4); if (hash(u) > 0.75) rect(x, GY + 6 + Math.round(hash(u + 3) * 16), 3, 1, '#c3cfe0'); }
        // избушка выезжает справа
        const hx = Math.round(W - 30 - (off - (stopAt * SPEED - 120)));
        if (hx < W) hut(hx, GY, t);
        forest(off, 70, GY + 8, (x, y, i) => { if (x < hx - 20 || x > hx + 80) pine(x, y, 26, '#1d3040', '#28425a', true); });
        const tx = moving ? 120 : Math.min(120 + (t - stopAt) * 14, hx - 30);
        traveler(tx, GY - 32, t, moving || tx < hx - 30);
        // ворон летит за путником, а у избушки садится на крышу
        if (moving) crow(150, GY - 72, t); else sprite(CROW[0], { k: '#16131a', Y: '#c9a45c' }, hx + 22, GY - 60, 2);
        stepParticles(dt, t, ['#ffffff', '#dfe8f5']);
      }
    },
    {
      dur: 22, season: '', where: 'Избушка мастера',
      text: '',
      lines: [
        [1.5, 'Входи, путник. Я давно жду тебя у этого огня.'],
        [5.5, 'Ты прошёл горы, леса и болота. Ты прошёл этот путь достойно.'],
        [10.5, 'Но самый трудный путь тебе только предстоит пройти.'],
        [15.5, 'Возьми этот знак. Пусть он светит тебе, когда закончатся подсказки.']
      ],
      init: () => particles('mote', 0),
      draw(t) { inside(t); }
    }
  ];

  function hut(x, gy, t) {
    // сруб, крыша со снегом, окно со светом, труба с дымом
    for (let y = 0; y < 34; y += 4) { rect(x, gy - 34 + y, 74, 4, y % 8 ? '#5a3a24' : '#6b4630'); rect(x - 2, gy - 34 + y, 3, 3, '#7a5236'); rect(x + 73, gy - 34 + y, 3, 3, '#7a5236'); }
    for (let i = 0; i < 22; i++) rect(x - 8 + i * 2, gy - 34 - i, 90 - i * 4, 1, i < 3 ? '#eef3fb' : '#3a2a22');
    for (let i = 0; i < 22; i++) rect(x - 8 + i * 2, gy - 35 - i, 4, 1, '#ffffff');
    for (let i = 0; i < 22; i++) rect(x + 80 - i * 2, gy - 35 - i, 4, 1, '#ffffff');
    rect(x + 52, gy - 66, 8, 16, '#4a4450'); rect(x + 51, gy - 67, 10, 2, '#eef3fb');
    for (let k = 0; k < 5; k++) { const p = (t * 0.6 + k / 5) % 1; rect(x + 54 - p * 18 + Math.sin(p * 6 + k) * 3, gy - 70 - p * 40, 4 + p * 4, 3 + p * 3, `rgba(200,205,220,${0.45 * (1 - p)})`); }
    const glow = 0.85 + 0.15 * Math.sin(t * 7);
    rect(x + 10, gy - 26, 16, 12, '#3a2a22'); rect(x + 12, gy - 24, 12, 8, `rgba(255,190,90,${glow})`); rect(x + 17, gy - 24, 2, 8, '#3a2a22'); rect(x + 12, gy - 21, 12, 1, '#3a2a22');
    rect(x + 4, gy - 30, 28, 20, `rgba(255,170,80,${0.08 * glow})`);
    rect(x + 40, gy - 28, 16, 28, '#2a1d17'); rect(x + 42, gy - 26, 12, 26, '#4a3020'); rect(x + 51, gy - 14, 2, 2, '#c9a45c');
    rect(x - 10, gy - 1, 100, 2, '#ffffff');
  }

  // Изнутри: бревенчатые стены, очаг, полки со свитками, стол со светящимся свитком кода, мастер
  function inside(t) {
    for (let y = 0; y < 132; y += 8) { rect(0, y, W, 8, y % 16 ? '#4a3020' : '#56382a'); rect(0, y + 7, W, 1, '#2f1e15'); }
    rect(0, 132, W, H - 132, '#3a271c'); for (let x = 0; x < W; x += 24) rect(x, 132, 1, H - 132, '#2a1b13');
    // окно с метелью
    rect(232, 26, 44, 34, '#2a1d17'); rect(235, 29, 38, 28, '#22314f');
    for (let i = 0; i < 14; i++) rect(235 + ((hash(i) * 38 + t * 6) % 38), 29 + ((hash(i + 5) * 28 + t * 14) % 28), 1, 1, '#eef3fb');
    rect(253, 29, 2, 28, '#2a1d17'); rect(235, 42, 38, 2, '#2a1d17');
    // полки со свитками и книгами
    rect(150, 30, 60, 3, '#2a1d17'); rect(150, 58, 60, 3, '#2a1d17');
    ['#8e1b1b', '#2b3a6b', '#4c6b3e', '#c9a45c', '#6b4a8a', '#8a6a3a', '#2b5a6b'].forEach((c, i) => { rect(153 + i * 8, 18 + (i % 3), 6, 12 - (i % 3), c); rect(153 + i * 8, 46 + ((i + 1) % 3), 6, 12 - ((i + 1) % 3), ['#d9c9a0', '#8e1b1b', '#c9a45c'][i % 3]); });
    // очаг
    rect(14, 56, 56, 76, '#5a5066'); for (let y = 58; y < 130; y += 8) for (let x = 16 + ((y / 8) % 2) * 6; x < 68; x += 12) rect(x, y, 10, 6, '#6b6176');
    rect(24, 92, 36, 40, '#16110f');
    const fl = t * 10;
    for (let i = 0; i < 9; i++) {
      const h = 10 + Math.abs(Math.sin(fl * 0.7 + i * 1.3)) * 16, x = 27 + i * 3.4;
      rect(x, 130 - h, 3, h, i % 2 ? '#e8772e' : '#f6c453'); rect(x, 130 - h * 0.45, 3, h * 0.45, '#fff0a8');
    }
    rect(28, 126, 28, 4, '#3a2a22');
    // тёплый свет от огня
    g.fillStyle = `rgba(255,150,60,${0.07 + 0.03 * Math.sin(t * 9)})`; g.fillRect(0, 0, W, H);
    // мастер за столом
    sprite(MASTER, P_MASTER, 166, 74, 2);
    rect(150, 104, 90, 4, '#6b4630'); rect(146, 108, 98, 26, '#4a3020'); rect(152, 134, 6, 18, '#2f1e15'); rect(232, 134, 6, 18, '#2f1e15');
    // свиток с кодом светится
    rect(176, 98, 40, 7, '#e9dcb8'); rect(174, 98, 3, 7, '#c9b48a'); rect(215, 98, 3, 7, '#c9b48a');
    const code = ['#2b3a6b', '#8e1b1b', '#4c6b3e', '#7a5f2e'];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) if (hash(r * 9 + k) > 0.3) rect(179 + k * 6 + (r % 2) * 2, 99 + r * 2, 4, 1, code[(r + k) % 4]);
    rect(172, 92, 48, 16, `rgba(150,220,255,${0.08 + 0.05 * Math.sin(t * 3)})`);
    // свеча
    rect(226, 92, 4, 12, '#ebe7dd'); rect(227, 87 + Math.sin(t * 12), 2, 4, '#f6c453'); rect(227, 89, 2, 2, '#fff0a8');
    // путник входит слева и останавливается
    const tx = Math.min(70 + t * 22, 108);
    traveler(tx, 118, t, tx < 108);
    // дар мастера: знак </> поднимается со свитка и плывёт к путнику
    if (t > 15.5) {
      const k = Math.min(1, (t - 15.5) / 3), gx = 190 + (124 - 190) * k, gy = 92 - Math.sin(k * Math.PI) * 30 + (100 - 92) * k;
      const a = 0.6 + 0.4 * Math.sin(t * 6);
      disc(Math.round(gx + 2), Math.round(gy), 9, `rgba(150,220,255,${0.16 * a})`);
      sprite(['..g....g.g..', '.g....g...g.', 'g....g.....g', '.g..g.....g.', '..gg.....g..'].map(r => r), { g: `rgba(200,240,255,${0.7 + 0.3 * a})` }, Math.round(gx - 4), Math.round(gy - 3), 1);
      if (k === 1) disc(tx + 11, 136, 22, `rgba(150,220,255,${0.08 * a})`);
    }
    // ворон греется у очага
    sprite(CROW[0], { k: '#16131a', Y: '#c9a45c' }, 74, 120, 2);
  }

  /* ---------- звук: тихая мелодия по временам года ---------- */
  let ac = null, master = null, nextNote = 0, noteI = 0;
  const MELODY = {
    0: [262, 330, 392, 330, 262, 330, 392, 523],
    1: [523, 659, 784, 659, 587, 698, 880, 698], 2: [587, 740, 880, 740, 659, 784, 988, 784],
    3: [440, 523, 659, 523, 392, 494, 587, 494], 4: [392, 466, 587, 466, 349, 440, 523, 440], 5: [330, 392, 494, 392, 294, 349, 440, 349]
  };
  function audioOn() {
    try { if (localStorage.getItem('ash:muted') === '1') return; } catch (e) { }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0.05; master.connect(ac.destination);
      nextNote = ac.currentTime + 0.1; noteI = 0;
    } catch (e) { ac = null; }
  }
  function music(scene) {
    if (!ac) return;
    while (nextNote < ac.currentTime + 0.3) {
      const f = MELODY[scene][noteI % 8];
      [f, f / 2].forEach((fr, k) => {
        const o = ac.createOscillator(), v = ac.createGain();
        o.type = k ? 'sine' : 'triangle'; o.frequency.value = fr;
        v.gain.setValueAtTime(0.0001, nextNote); v.gain.exponentialRampToValueAtTime(k ? 0.5 : 0.8, nextNote + 0.04); v.gain.exponentialRampToValueAtTime(0.0001, nextNote + 0.9);
        o.connect(v); v.connect(master); o.start(nextNote); o.stop(nextNote + 1);
      });
      nextNote += scene === 0 || scene === 5 ? 0.75 : 0.5; noteI++;
    }
  }
  function audioOff() { if (ac) { try { ac.close(); } catch (e) { } ac = null; } }

  /* ---------- озвучка ---------- */
  /* Рассказчик читает подписи сцен, мастер кода — свои реплики, низким медленным голосом.
     Если в audio/intro/ лежит manifest.json со списком записанных файлов ({ "spring": "spring.mp3", "master1": "master1.mp3", … }),
     играют записи; иначе голос синтезирует браузер (русский голос есть в Windows, Android, iOS и macOS).
     Пока голос говорит, ролик не переходит к следующей сцене или реплике. Кнопка «Озвучка» запоминает выбор. */
  const VOICE_KEY = 'ash:voice';
  let voiceOn = (() => { try { const v = localStorage.getItem(VOICE_KEY); return v ? v === '1' : localStorage.getItem('ash:muted') !== '1'; } catch (e) { return true; } })();
  let talking = false, talkTimer = 0, rec = null, files = null;
  const synth = window.speechSynthesis;
  const ruVoice = () => {
    const vs = synth ? synth.getVoices().filter(v => /^ru/i.test(v.lang)) : [];
    return vs.find(v => /google|natural|online|milena|irina|dmitry|pavel|yuri/i.test(v.name)) || vs[0] || null;
  };
  if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => {};
  fetch('audio/intro/manifest.json').then(r => r.ok ? r.json() : null).then(m => { files = m; }).catch(() => {});
  function hush() {
    talking = false; clearTimeout(talkTimer);
    if (rec) { try { rec.pause(); } catch (e) { } rec = null; }
    if (synth) try { synth.cancel(); } catch (e) { }
    if (master) master.gain.value = 0.05;
  }
  function say(key, text, who) {
    hush();
    if (!voiceOn || !text) return;
    const done = () => { talking = false; clearTimeout(talkTimer); if (master) master.gain.value = 0.05; };
    talking = true; if (master) master.gain.value = 0.018; // музыка тише, пока говорят
    talkTimer = setTimeout(done, 2500 + text.length * 110); // на случай, если браузер не сообщит о конце речи
    if (files && files[key]) {
      rec = new Audio('audio/intro/' + files[key]); rec.onended = done; rec.onerror = done;
      rec.play().catch(done);
      return;
    }
    const v = ruVoice();
    if (!synth || !v) { done(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v; u.lang = v.lang;
    if (who === 'master') { u.rate = 0.82; u.pitch = 0.55; } else { u.rate = 0.95; u.pitch = 0.9; }
    u.onend = done; u.onerror = done;
    synth.speak(u);
  }

  /* ---------- окно ролика ---------- */
  let box, cap, raf = 0, onDone = null, lastFocus = null;
  function build() {
    box = document.createElement('div');
    box.className = 'intro'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Ролик «Путь путника»');
    box.innerHTML = `
      <div class="intro-frame">
        <canvas width="${W}" height="${H}" aria-hidden="true"></canvas>
        <div class="intro-start">
          <p class="intro-eyebrow">Пепельный Пиксель</p>
          <h2 class="intro-title">Путь путника</h2>
          <p class="intro-lead">Короткий ролик о дороге, которая начинается сегодня.</p>
          <div class="intro-acts"><button type="button" class="btn" data-go>СМОТРЕТЬ</button><button type="button" class="btn ghost" data-skip>ПРОПУСТИТЬ</button></div>
        </div>
        <div class="intro-end" hidden>
          <p class="intro-eyebrow">Глава I</p>
          <h2 class="intro-title">Твой путь начинается здесь</h2>
          <ol class="intro-path"><li><b>Весна</b> HTML</li><li><b>Лето</b> CSS</li><li><b>Осень</b> JavaScript</li><li><b>Зима</b> дизайн и юзабилити</li><li><b>Впереди</b> демоэкзамен</li></ol>
          <div class="intro-acts"><button type="button" class="btn" data-close>НАЧАТЬ ПУТЬ</button><button type="button" class="btn ghost" data-again>СМОТРЕТЬ ЕЩЁ РАЗ</button></div>
        </div>
        <p class="intro-season" aria-hidden="true"></p>
      </div>
      <div class="intro-cap" aria-live="polite"><span class="intro-who"></span><span class="intro-text"></span></div>
      <div class="intro-tools"><button type="button" class="intro-voice" data-voice aria-pressed="${voiceOn}">Озвучка: ${voiceOn ? 'вкл' : 'выкл'}</button><button type="button" class="intro-skip" data-skip>Пропустить ✕</button></div>`;
    document.body.appendChild(box);
    cv = box.querySelector('canvas'); g = cv.getContext('2d');
    cap = box.querySelector('.intro-cap');
    box.addEventListener('click', e => {
      const vb = e.target.closest('[data-voice]');
      if (vb) {
        voiceOn = !voiceOn; try { localStorage.setItem(VOICE_KEY, voiceOn ? '1' : '0'); } catch (err) { }
        vb.textContent = `Озвучка: ${voiceOn ? 'вкл' : 'выкл'}`; vb.setAttribute('aria-pressed', String(voiceOn));
        if (!voiceOn) hush();
        return;
      }
      if (e.target.closest('[data-go]')) start();
      else if (e.target.closest('[data-again]')) start();
      else if (e.target.closest('[data-skip],[data-close]')) close();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') { // фокус не уходит из окна
        const f = [...box.querySelectorAll('button')].filter(b => b.offsetParent);
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function setCaption(who, text) {
    box.querySelector('.intro-who').textContent = who ? who + ': ' : '';
    box.querySelector('.intro-text').textContent = text;
    cap.classList.toggle('on', !!text);
  }
  // Титульный кадр: ночное небо и звёзды
  function still() {
    sky('#0e0b11', '#1b1520', '#2a2230', H);
    for (let i = 0; i < 60; i++) rect(hash(i) * W, hash(i + 40) * H * 0.8, 1, 1, `rgba(255,250,230,${0.3 + hash(i + 3) * 0.6})`);
    ridge(0, 40, 12, 0.03, '#141018');
  }

  function start() {
    box.querySelector('.intro-start').hidden = true; box.querySelector('.intro-end').hidden = true;
    box.querySelector('.intro-skip').focus();
    audioOff(); audioOn();
    let si = -1, t0 = 0, last = performance.now(), shown = '', spoken = '';
    const KEYS = ['prolog', 'spring', 'summer', 'autumn', 'winter'];
    const total = SCENES.reduce((a, s) => a + s.dur, 0);
    let clock = 0;
    cancelAnimationFrame(raf);
    const tick = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      let acc = 0, i = 0;
      while (i < SCENES.length - 1 && clock >= acc + SCENES[i].dur) { acc += SCENES[i].dur; i++; }
      // Пока голос говорит, не уходим дальше: сцена ждёт перед затемнением, реплика — до следующей
      const sc0 = SCENES[i], t0n = clock - acc;
      const nextAt = sc0.lines ? (sc0.lines.find(([at]) => at > t0n)?.[0] ?? sc0.dur) : sc0.dur - 0.7;
      if (!(talking && t0n + dt >= nextAt - 0.05)) clock += dt;
      while (i < SCENES.length - 1 && clock >= acc + SCENES[i].dur) { acc += SCENES[i].dur; i++; }
      const sc = SCENES[i], t = clock - acc;
      if (i !== si) { si = i; sc.init(); t0 = acc; shown = ''; const s = box.querySelector('.intro-season'); s.textContent = [sc.season, sc.where].filter(Boolean).join(' · '); s.classList.remove('show'); void s.offsetWidth; s.classList.add('show'); }
      sc.draw(reduce ? Math.min(t, sc.dur * 0.4) : t, reduce ? 0 : dt);
      // переходы: затемнение на стыке сцен
      const fade = Math.max(0, 1 - t / 0.6, i < SCENES.length - 1 ? 1 - (sc.dur - t) / 0.6 : 0);
      if (fade > 0) { g.fillStyle = `rgba(5,4,6,${Math.min(1, fade)})`; g.fillRect(0, 0, W, H); }
      // подписи: у сцен — текст, у избушки — реплики мастера, печатаются по буквам
      let who = '', full = sc.text;
      if (sc.lines) { const l = sc.lines.filter(([at]) => t >= at).pop(); who = l ? 'Мастер кода' : ''; full = l ? l[1] : ''; }
      const since = sc.lines ? t - (sc.lines.filter(([at]) => t >= at).pop()?.[0] || 0) : t - 0.4;
      const typed = reduce ? full : full.slice(0, Math.max(0, Math.floor(since * 40)));
      if (typed !== shown) { shown = typed; setCaption(who, typed); }
      // озвучка: подпись сцены — рассказчик, реплика — мастер
      const key = sc.lines ? (full ? 'master' + (sc.lines.findIndex(l => l[1] === full) + 1) : '') : (t >= 0.4 ? KEYS[i] : '');
      if (key && key !== spoken) { spoken = key; say(key, full, sc.lines ? 'master' : 'narrator'); }
      music(i);
      if (clock >= total) { finish(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function finish() {
    cancelAnimationFrame(raf);
    say('end', 'Твой путь начинается здесь.', 'narrator');
    box.querySelector('.intro-end').hidden = false;
    box.querySelector('[data-close]').focus();
    setTimeout(audioOff, 1200);
  }
  function close() {
    cancelAnimationFrame(raf); audioOff(); hush();
    box.remove(); box = null;
    document.documentElement.classList.remove('intro-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    const cb = onDone; onDone = null; if (cb) cb();
  }
  // Открыть ролик; done() вызывается после закрытия (кабинет отмечает, что ролик показан)
  function play(done) {
    if (box) return;
    onDone = done || null; lastFocus = document.activeElement;
    build(); still();
    document.documentElement.classList.add('intro-open');
    box.querySelector('[data-go]').focus();
  }
  window.AshIntro = { play };
})();
