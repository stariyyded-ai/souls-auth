/* Разрушение окна на пиксельные кубики.
   Панель «фотографируется» на canvas (фон, рамки, текст, поля), затем режется на кубики,
   которые разлетаются от точки удара с гравитацией, вращением и затуханием. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- snapshot the panel onto a canvas ---------- */
  function snapshot(el) {
    const r = el.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    const c = document.createElement('canvas'); c.width = Math.ceil(r.width * dpr); c.height = Math.ceil(r.height * dpr);
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    x.fillStyle = 'rgba(40,34,42,0.55)'; x.fillRect(0, 0, r.width, r.height);
    const lg = x.createLinearGradient(0, 0, 0, r.height * 0.6); lg.addColorStop(0, 'rgba(255,255,255,0.09)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = lg; x.fillRect(0, 0, r.width, r.height);
    const all = [el, ...el.querySelectorAll('*')];
    for (const n of all) {
      if (n.closest('[hidden]')) continue;
      const cs = getComputedStyle(n), b = n.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const ox = b.left - r.left, oy = b.top - r.top;
      if (n.tagName === 'rect' || n.tagName === 'svg') {
        if (n.tagName === 'rect') { x.fillStyle = n.getAttribute('fill'); const p = n.closest('span'); const op = p ? +getComputedStyle(p).opacity : 1; x.globalAlpha = op; x.fillRect(ox, oy, b.width, b.height); x.globalAlpha = 1; }
        continue;
      }
      const bgc = cs.backgroundColor;
      if (bgc && bgc !== 'rgba(0, 0, 0, 0)' && n !== el) { x.fillStyle = bgc; x.fillRect(ox, oy, b.width, b.height); }
      if (cs.backgroundImage.includes('gradient') && n.classList.contains('btn')) {
        const bg = x.createLinearGradient(0, oy, 0, oy + b.height); bg.addColorStop(0, '#4a1a12'); bg.addColorStop(1, '#1e0a08'); x.fillStyle = bg; x.fillRect(ox, oy, b.width, b.height);
      }
      const bw = parseFloat(cs.borderTopWidth);
      if (bw > 0) { x.strokeStyle = cs.borderTopColor; x.lineWidth = bw; x.strokeRect(ox + bw / 2, oy + bw / 2, b.width - bw, b.height - bw); }
      if (n.tagName === 'INPUT' && n.type !== 'checkbox') {
        x.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; x.fillStyle = cs.color; x.textBaseline = 'middle';
        x.fillText(n.type === 'password' ? '•'.repeat(n.value.length) : n.value, ox, oy + b.height / 2);
      }
      for (const tn of n.childNodes) {
        if (tn.nodeType !== 3 || !tn.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(tn); const tr = rg.getBoundingClientRect();
        x.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; x.fillStyle = cs.color; x.textBaseline = 'middle';
        if ('letterSpacing' in x) x.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        x.globalAlpha = +cs.opacity || 1;
        let s = tn.textContent.trim().replace(/\s+/g, ' ');
        if (cs.textTransform === 'uppercase') s = s.toUpperCase();
        x.fillText(s, tr.left - r.left, tr.top - r.top + tr.height / 2);
        x.globalAlpha = 1;
      }
    }
    return { canvas: c, rect: r };
  }

  /* ---------- shatter into pixel cubes ---------- */
  function shatter(panel, origin) {
    return new Promise(resolve => {
      const { canvas: snap, rect: r } = snapshot(panel);
      panel.classList.add('gone');
      const fx = document.getElementById('fx'), ctx = fx.getContext('2d'), dpr = devicePixelRatio || 1;
      const size = innerWidth < 500 ? 12 : 16, cubes = [];
      for (let y = -8; y < r.height + 8; y += size) for (let x = -8; x < r.width + 8; x += size) {
        const cx = r.left + x + size / 2, cy = r.top + y + size / 2;
        const dx = cx - origin.x, dy = cy - origin.y, d = Math.hypot(dx, dy) || 1;
        const sp = 240 + Math.random() * 380;
        cubes.push({ sx: x, sy: y, x: cx, y: cy, vx: dx / d * sp + (Math.random() - .5) * 160, vy: dy / d * sp - 120 - Math.random() * 200,
          rot: 0, vr: (Math.random() - .5) * 14, delay: d / 1400 + Math.random() * 0.05, s: size - 1 });
      }
      const dur = reduce ? 0.4 : 1.7; const start = performance.now();
      function step(now) {
        const t = (now - start) / 1000;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
        // crack flash at impact
        if (t < 0.18) { ctx.fillStyle = `rgba(246,196,83,${0.35 * (1 - t / 0.18)})`; ctx.fillRect(r.left, r.top, r.width, r.height); }
        for (const c of cubes) {
          const lt = Math.max(0, t - c.delay);
          const px = c.x + c.vx * lt, py = c.y + c.vy * lt + 0.5 * 1500 * lt * lt;
          const a = lt === 0 ? 1 : Math.max(0, 1 - lt / (dur - c.delay));
          if (a <= 0) continue;
          ctx.save(); ctx.globalAlpha = a; ctx.translate(px, py); ctx.rotate(c.vr * lt);
          const s = c.s * (1 - lt * 0.25);
          ctx.drawImage(snap, Math.max(0, c.sx) * dpr, Math.max(0, c.sy) * dpr, size * dpr, size * dpr, -s / 2, -s / 2, s, s);
          if (lt > 0) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(-s / 2, s / 2 - 2, s, 2); ctx.fillRect(s / 2 - 2, -s / 2, 2, s); ctx.fillStyle = 'rgba(242,213,138,0.35)'; ctx.fillRect(-s / 2, -s / 2, s, 1); }
          ctx.restore();
        }
        if (t < dur) requestAnimationFrame(step); else { ctx.clearRect(0, 0, innerWidth, innerHeight); resolve(); }
      }
      requestAnimationFrame(step);
    });
  }

  window.Ash = Object.assign(window.Ash || {}, { shatter });
})();
