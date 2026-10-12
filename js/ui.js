/* Мелкие помощники для страниц студента: экранирование, числа, тост, фильтры-чипы, аватар с рамкой. */
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => Math.round(n).toLocaleString('ru-RU');
  const date = iso => new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  let toastTimer;
  function toast(text) {
    const t = $('toast'); if (!t) return;
    t.textContent = text; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }
  // Группа кнопок-фильтров: <div class="chips" id="..."><button class="chip on" data-x="all">
  function chips(boxId, key, apply) {
    const box = $(boxId);
    box.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.classList.contains('on'))));
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      box.querySelectorAll('.chip').forEach(c => { c.classList.toggle('on', c === b); c.setAttribute('aria-pressed', String(c === b)); });
      apply(b.dataset[key]);
    });
  }
  // Аватар персонажа с рамкой: size — '', 'sm' или 'xs'
  const PX = { '': 5, sm: 4, xs: 3 };
  const avatar = (art, frame, size = '') =>
    `<span class="ava ${size}"${frame ? ` data-frame="${esc(frame)}"` : ''}>${window.ASH_AVATAR_SVG(art || 'knight', PX[size])}</span>`;
  // Подсказки о новых достижениях после покупки или задания
  function announce(got) {
    (got || []).forEach((a, i) => setTimeout(() => {
      toast(`Достижение «${a.title}»${a.reward ? ` · +${fmt(a.reward)} душ` : ''}`);
      if (window.Ash.sfx && window.Ash.sfx.lit) window.Ash.sfx.lit();
    }, 1200 + i * 3600));
  }
  window.UI = { $, esc, fmt, date, toast, chips, avatar, announce };
})();
