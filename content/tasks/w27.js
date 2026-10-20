/* Занятие 27. ЛР15. CSS-анимации: transition, keyframes, prefers-reduced-motion */
(() => {
  const ROOT = `:root {
  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --radius: 12px;
  --shadow: 0 2px 8px rgb(15 23 42 / 0.08);
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--color-text); background: var(--color-bg); }
.page { width: min(100% - 32px, 960px); margin: 0 auto; padding: var(--space-3) 0; }
.requests { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-2); }
.request-card h2 { margin: 0 0 var(--space-1); font-size: 1.125rem; }
.request-card p { margin: 0; color: var(--color-muted); }`;
  // Длительность '0.2s' или '200ms' → секунды
  const sec = v => /ms$/.test(v.trim()) ? parseFloat(v) / 1000 : parseFloat(v);
  const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean);
  const keyframes = (h, name) => {
    const out = [];
    const walk = rules => { for (const r of rules) { if (r.type === 7 && r.name === name) out.push(r); else if (r.cssRules && r.type !== 7) walk(r.cssRules); } };
    try { walk(h.doc.styleSheets[0].cssRules); } catch (e) { }
    return out[0];
  };
  const frame = (k, keys) => [...k.cssRules].find(f => keys.includes(f.keyText));
  const cards = n => Array.from({ length: n }, (_, i) => `    <article class="request-card">
      <h2>${['Генеральная уборка', 'Химчистка ковров', 'Общий клининг'][i]}</h2>
      <p>${['12.11.2026, 10:00 · ул. Ленина, 5', '03.11.2026, 14:30 · пр. Мира, 18', '20.10.2026, 09:00 · ул. Ленина, 5'][i]}</p>
    </article>`).join('\n');
  window.COURSE_TASKS.push(
    {
      id: 'w2701', lesson: 'm9-lr15', module: 'mdk93', mech: 'fix', title: 'Отклик кнопки и карточки', level: 'Среднее', minutes: 25, points: 150,
      story: 'В ТЗ «ЧистоДома» записано: кнопка откликается на наведение и нажатие, карточка заявки приподнимается под курсором. Анимации уже есть, но с ошибками: кнопка плывёт целую секунду и только в одну сторону, а карточка подпрыгивает через top и дёргается на телефоне.',
      goal: 'Кнопка: перенесите transition из .btn:hover в .btn и замените all на два свойства: background-color и transform, каждое не дольше 0.2s. Добавьте .btn:active { transform: scale(0.97); }. Карточка: уберите position и top из .request-card:hover, поднимайте её через transform: translateY(-4px) и усиливайте тень (box-shadow). У самой .request-card задайте transition для transform и box-shadow: 0.2s ease-out.',
      hints: [
        'transition пишут у исходного состояния — тогда анимация идёт в обе стороны: .btn { …; transition: background-color 0.2s ease, transform 0.15s ease; }',
        '.btn:active { transform: scale(0.97); } — кнопка «вжимается» при нажатии.',
        'Двигаем через transform, а не top: .request-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgb(15 23 42 / 0.12); }',
        '.request-card { …; transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; }'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <p><button class="btn" type="button">Новая заявка</button></p>
  <section class="requests" aria-label="Список заявок">
${cards(3)}
  </section>
</main>`,
      css: `${ROOT}
.btn { min-height: 48px; padding: 0 var(--space-3); border: none; border-radius: var(--radius); background: var(--color-primary); color: #ffffff; font: inherit; font-weight: 600; cursor: pointer; }
.btn:hover { background: var(--color-primary-dark); transition: all 1s; }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
.request-card:hover { position: relative; top: -4px; }`,
      tests: [
        { name: 'transition написан у .btn, а не у .btn:hover', check: h => {
          if (h.rules.some(r => /:hover/.test(r.selector) && /\.btn/.test(r.selector) && /transition/.test(r.style.cssText))) return 'уберите transition из .btn:hover';
          return list(h.cs('.btn', 'transition-property')).some(p => p !== 'all') || 'у .btn нет transition';
        } },
        { name: 'Кнопка: анимируются background-color и transform, каждое не дольше 0.2s, без all', check: h => {
          const p = list(h.cs('.btn', 'transition-property')), d = list(h.cs('.btn', 'transition-duration')).map(sec);
          if (p.includes('all')) return 'transition: all анимирует всё подряд — перечислите свойства';
          if (!p.includes('background-color') || !p.includes('transform')) return `сейчас анимируется: ${p.join(', ')}`;
          return d.every(x => x > 0 && x <= 0.2) || 'длительность каждого перехода — не больше 0.2s';
        } },
        { name: '.btn:active «вжимает» кнопку: transform: scale(0.97)', check: h => h.rules.some(r => /\.btn:active/.test(r.selector) && /scale\(\s*0?\.97\s*\)/.test(r.style.transform)) || 'нет .btn:active { transform: scale(0.97); }' },
        { name: 'Карточка поднимается через transform: translateY(-4px), без top и position', check: h => {
          const r = h.rules.find(x => /\.request-card:hover/.test(x.selector));
          if (!r) return 'нет правила .request-card:hover';
          if (r.style.top || r.style.position || r.style.marginTop) return 'уберите top, position и margin из :hover — они пересчитывают раскладку';
          return /translateY\(\s*-4px\s*\)/.test(r.style.transform) || 'нужно transform: translateY(-4px)';
        } },
        { name: 'При наведении тень карточки усиливается', check: h => h.rules.some(r => /\.request-card:hover/.test(r.selector) && /box-shadow/.test(r.style.cssText)) || 'добавьте box-shadow в .request-card:hover' },
        { name: 'У карточки плавный переход transform и box-shadow: 0.2s ease-out', check: h => {
          const p = list(h.cs('.request-card', 'transition-property')), d = list(h.cs('.request-card', 'transition-duration')).map(sec), f = list(h.cs('.request-card', 'transition-timing-function'));
          if (!p.includes('transform') || !p.includes('box-shadow')) return 'у .request-card нужен transition для transform и box-shadow';
          if (!d.every(x => Math.abs(x - 0.2) < 0.001)) return 'длительность 0.2s';
          return f.every(x => x === 'ease-out') || 'функция плавности ease-out';
        } }
      ]
    },
    {
      id: 'w2702', lesson: 'm9-lr15', module: 'mdk93', mech: 'build', title: 'Лесенка карточек и reduced motion', level: 'Сложное', minutes: 30, points: 200,
      story: 'Пользователь «ЧистоДома» создал заявку и попал на «Мои заявки»: сверху мягко выезжает сообщение «Заявка создана», а карточки появляются по очереди, лесенкой. А если в настройках телефона включено «Уменьшить движение», всё сразу стоит на месте.',
      goal: 'Напишите @keyframes fade-up (from: opacity 0 и transform: translateY(16px); to: opacity 1 и translateY(0)) и @keyframes slide-down (from: opacity 0 и translateY(-12px); to: opacity 1 и translateY(0)). В кадрах меняйте только opacity и transform. .request-card — animation: fade-up 0.4s ease-out both; вторая карточка (.request-card:nth-child(2)) — animation-delay 80ms, третья — 160ms. .alert — animation: slide-down 0.3s ease-out both. В конце — @media (prefers-reduced-motion: reduce), где у .request-card и .alert анимация выключена (animation: none).',
      hints: [
        '@keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }',
        '.request-card { …; animation: fade-up 0.4s ease-out both; } — both: до старта карточка уже прозрачная и не мелькает.',
        'Лесенка: .request-card:nth-child(2) { animation-delay: 80ms; } .request-card:nth-child(3) { animation-delay: 160ms; }',
        '@media (prefers-reduced-motion: reduce) { .request-card, .alert { animation: none; } } — карточки просто видны сразу. !important здесь не нужен.'
      ],
      html: `<main class="page">
  <h1>Мои заявки</h1>
  <div class="alert" role="status">Заявка создана. Мы позвоним вам в течение часа.</div>
  <section class="requests" aria-label="Список заявок">
${cards(3)}
  </section>
</main>`,
      css: `${ROOT}
.alert { margin-bottom: var(--space-2); padding: 12px var(--space-2); border: 1px solid #bbf7d0; border-radius: var(--radius); background: #f0fdf4; color: #166534; }
.request-card { padding: var(--space-2); border-radius: var(--radius); background: var(--color-surface); box-shadow: var(--shadow); }
/* Ниже — @keyframes, анимации и prefers-reduced-motion */
`,
      tests: [
        { name: '@keyframes fade-up: из прозрачности и сдвига вниз в обычное состояние', check: h => {
          const k = keyframes(h, 'fade-up');
          if (!k) return 'нет @keyframes fade-up';
          const a = frame(k, ['from', '0%']), b = frame(k, ['to', '100%']);
          if (!a || !b) return 'нужны кадры from и to';
          if (a.style.opacity !== '0' || !/translateY\(\s*16px\s*\)/.test(a.style.transform)) return 'from: opacity: 0; transform: translateY(16px)';
          return b.style.opacity === '1' || 'to: opacity: 1; transform: translateY(0)';
        } },
        { name: 'Карточки: fade-up 0.4s ease-out both', check: h => {
          const s = '.request-card';
          if (h.cs(s, 'animation-name') !== 'fade-up') return 'у .request-card нет animation: fade-up';
          if (Math.abs(sec(h.cs(s, 'animation-duration')) - 0.4) > 0.001) return 'длительность 0.4s';
          return h.cs(s, 'animation-fill-mode') === 'both' && h.cs(s, 'animation-timing-function') === 'ease-out' || 'нужно ease-out и both';
        } },
        { name: 'Лесенка: 0, 80ms и 160ms через nth-child', check: h => {
          const d = h.$$('.request-card').map(c => Math.round(sec(h.cs(c, 'animation-delay')) * 1000));
          if (!h.rules.some(r => /nth-child/.test(r.selector))) return 'задержки задайте через .request-card:nth-child(…)';
          return d.join(',') === '0,80,160' || `задержки сейчас: ${d.join(', ')} мс`;
        } },
        { name: 'Сообщение .alert выезжает сверху: slide-down 0.3s ease-out both', check: h => {
          const k = keyframes(h, 'slide-down');
          if (!k) return 'нет @keyframes slide-down';
          const a = frame(k, ['from', '0%']);
          if (!a || a.style.opacity !== '0' || !/translateY\(\s*-12px\s*\)/.test(a.style.transform)) return 'from: opacity: 0; transform: translateY(-12px)';
          if (h.cs('.alert', 'animation-name') !== 'slide-down') return 'у .alert нет animation: slide-down';
          return Math.abs(sec(h.cs('.alert', 'animation-duration')) - 0.3) < 0.001 && h.cs('.alert', 'animation-fill-mode') === 'both' || 'нужно 0.3s ease-out both';
        } },
        { name: 'В кадрах меняются только opacity и transform', check: h => {
          for (const name of ['fade-up', 'slide-down']) {
            const k = keyframes(h, name); if (!k) return `нет @keyframes ${name}`;
            for (const f of k.cssRules) for (let i = 0; i < f.style.length; i++) if (!['opacity', 'transform'].includes(f.style[i])) return `${name}: свойство ${f.style[i]} — двигайте через transform`;
          }
          return true;
        } },
        { name: '@media (prefers-reduced-motion: reduce) выключает анимацию карточек и сообщения', check: h => {
          const rs = h.rules.filter(r => /prefers-reduced-motion:\s*reduce/.test(r.media));
          if (!rs.length) return 'нет @media (prefers-reduced-motion: reduce)';
          const off = s => rs.some(r => r.selector.split(',').some(x => x.trim() === s) && (r.style.animationName === 'none' || (r.style.animationDuration && sec(r.style.animationDuration) <= 0.0001)));
          if (!off('.request-card')) return 'в медиазапросе выключите анимацию .request-card';
          return off('.alert') || 'в медиазапросе выключите анимацию .alert';
        } }
      ]
    }
  );
})();
