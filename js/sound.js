/* 8-битные звуки без файлов: всё синтезируется через Web Audio API.
   Браузер разрешает звук только после первого клика, поэтому контекст создаётся лениво.
   Состояние «звук вкл/выкл» хранится в localStorage. */
(() => {
  let ctx = null, master = null;
  let muted = false;
  try { muted = localStorage.getItem('ash:muted') === '1'; } catch (e) {}

  function audio() {
    if (muted) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Один тон: частота может «съезжать» от from к to
  function tone({ from, to = from, dur = 0.08, type = 'square', vol = 0.12, at = 0 }) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + at;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  // Шум через фильтр: треск, шорох, «вжух»
  function noise({ dur = 0.3, vol = 0.15, freq = 1200, toFreq = freq, q = 0.8, at = 0, type = 'bandpass' }) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + at;
    const len = Math.ceil(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, toFreq), t + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t); src.stop(t + dur);
  }

  const sfx = {
    // Обычный клик по кнопке
    click() { tone({ from: 660, to: 440, dur: 0.06, vol: 0.1 }); tone({ from: 990, dur: 0.03, vol: 0.05, at: 0.02 }); },
    // Ссылка или переход
    link() { tone({ from: 520, to: 780, dur: 0.07, type: 'triangle', vol: 0.12 }); },
    // Ошибка в форме
    error() { tone({ from: 196, dur: 0.09, vol: 0.12 }); tone({ from: 147, dur: 0.14, vol: 0.12, at: 0.1 }); },
    // Окно разбивается на кубики: удар, хруст и звон осколков
    shatter() {
      noise({ dur: 0.25, vol: 0.35, freq: 3000, toFreq: 400, q: 0.6 });
      tone({ from: 140, to: 40, dur: 0.3, type: 'square', vol: 0.15 });
      for (let i = 0; i < 14; i++) tone({ from: 1800 + Math.random() * 2400, dur: 0.04, type: 'triangle', vol: 0.05, at: 0.05 + i * 0.05 + Math.random() * 0.03 });
    },
    // «КОСТЁР ЗАЖЖЁН»: вспышка пламени и восходящий аккорд
    lit() {
      noise({ dur: 0.9, vol: 0.2, freq: 300, toFreq: 2400, type: 'lowpass', q: 0.4 });
      [262, 330, 392, 523, 659].forEach((f, i) => tone({ from: f, dur: 0.9 - i * 0.08, type: 'triangle', vol: 0.09, at: 0.15 + i * 0.09 }));
    },
    // «ВЫ ПОГИБЛИ»: низкий тянущийся удар
    death() {
      tone({ from: 220, to: 55, dur: 1.4, type: 'sawtooth', vol: 0.14 });
      tone({ from: 110, to: 41, dur: 1.6, type: 'square', vol: 0.08, at: 0.05 });
      noise({ dur: 1.2, vol: 0.12, freq: 400, toFreq: 80, type: 'lowpass' });
    },
    // Скрип двери
    door(open = true) {
      const [a, b] = open ? [110, 190] : [190, 95];
      for (let i = 0; i < 6; i++) tone({ from: a + (b - a) * i / 6, to: a + (b - a) * (i + 1) / 6, dur: 0.05, type: 'sawtooth', vol: 0.06, at: i * 0.045 });
      if (!open) noise({ dur: 0.12, vol: 0.25, freq: 200, type: 'lowpass', at: 0.28 });
    },
    // Один «шлёп» слизняка
    squish() { tone({ from: 320 + Math.random() * 60, to: 160, dur: 0.05, type: 'sine', vol: 0.14 }); }
  };

  function setMuted(v) {
    muted = v;
    try { localStorage.setItem('ash:muted', v ? '1' : '0'); } catch (e) {}
    if (v && ctx) ctx.suspend();
    renderToggle();
  }

  // Кнопка «звук вкл/выкл» в шапке
  const toggle = document.getElementById('sound-toggle');
  function renderToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(!muted));
    toggle.querySelector('.label').textContent = muted ? 'ЗВУК ВЫКЛ' : 'ЗВУК ВКЛ';
  }
  if (toggle) {
    renderToggle();
    toggle.addEventListener('click', () => { setMuted(!muted); if (!muted) sfx.click(); });
  }

  // Звук клика для всех кнопок и ссылок. Кнопки отправки форм звучат в своих скриптах.
  document.addEventListener('click', e => {
    const el = e.target.closest('button, a');
    if (!el || el === toggle || el.type === 'submit') return;
    if (el.matches('a, .link')) sfx.link(); else sfx.click();
  });
  document.addEventListener('change', e => { if (e.target.matches('input[type="checkbox"]')) sfx.click(); });

  window.Ash = Object.assign(window.Ash || {}, { sfx });
})();
