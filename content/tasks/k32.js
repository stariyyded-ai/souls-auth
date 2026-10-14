/* Занятие 32. Практическая работа №8. Создание баннера для веб-страницы */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Контраст текста на градиенте: браузер не умеет считать его сам, поэтому сравниваем цвет текста
  // с каждым цветом градиента по формуле WCAG
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const colors = s => (s.match(/rgba?\([^)]*\)/g) || []).map(c => c.match(/[\d.]+/g).slice(0, 3).map(Number));
  const onGradient = (h, box, texts) => {
    const stops = colors(h.cs(box, 'background-image'));
    if (!stops.length) return 'у баннера нет градиента — сравнивать не с чем';
    for (const t of texts) {
      if (!h.$(t)) return `нет элемента ${t}`;
      const fg = colors(h.cs(t, 'color'))[0];
      const worst = Math.min(...stops.map(s => ratio(s, fg)));
      if (worst < 4.5) return `${t}: на самом светлом цвете градиента контраст ${worst.toFixed(2)}:1, нужно 4,5:1`;
    }
    return true;
  };
  const transparent = c => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);

  window.COURSE_TASKS.push(
    {
      id: 'k3201', lesson: 'mdk-32', module: 'mdk3', mech: 'build',
      title: 'Горизонтальный баннер 728×90', level: 'Среднее', minutes: 25, points: 150,
      story: 'Колледж набирает группу на бесплатный пробный урок по веб-дизайну. Для сайта колледжа нужен узкий баннер над статьями — стандартный размер 728×90.',
      goal: 'Допишите CSS. Баннер .banner — ровно 728×90 пикселей (используйте box-sizing: border-box), фон — линейный градиент, текст белый и читается на любом цвете градиента (контраст не ниже 4,5:1). Заголовок, текст и кнопка стоят в один ряд на flexbox и выровнены по центру по высоте, кнопка прижата к правому краю. Кнопка .banner__button — со своим фоном, внутренними отступами не меньше 12px по бокам и без подчёркивания.',
      hints: [
        'Начните с размеров: box-sizing: border-box; width: 728px; height: 90px; padding: 0 24px. Тогда отступы не прибавятся к ширине.',
        'В ряд и по центру: display: flex; align-items: center; justify-content: space-between; gap: 16px.',
        'Градиент: background: linear-gradient(90deg, #2b1a66, #7a1f5c); color: #ffffff. Берите два тёмных цвета, тогда белый текст будет читаться везде.',
        'Кнопка: .banner__button { padding: 12px 20px; border-radius: 8px; background: #ffd166; color: #222222; font-weight: bold; text-decoration: none; }'
      ],
      html: `<section class="banner">
  <h2 class="banner__title">Курсы веб-дизайна</h2>
  <p class="banner__text">Первое занятие — бесплатно, 15 марта</p>
  <a class="banner__button" href="#signup">Записаться</a>
</section>`,
      css: `${BASE}
/* Допишите правило .banner: размер 728×90, градиент, flexbox */

.banner__title { margin: 0; font-size: 24px; }
.banner__text { margin: 0; }

/* Допишите правило .banner__button */`,
      tests: [
        { name: 'Баннер ровно 728×90 пикселей', check: h => { const r = h.rect('.banner'); return r && Math.round(r.width) === 728 && Math.round(r.height) === 90 || `сейчас ${r ? Math.round(r.width) + '×' + Math.round(r.height) : 'нет .banner'}`; } },
        { name: 'Фон баннера — линейный градиент', check: h => h.cs('.banner', 'background-image').includes('linear-gradient') || 'нужен background: linear-gradient(…)' },
        { name: 'Заголовок, текст и кнопка в один ряд, по центру по высоте', check: h => {
          if (h.cs('.banner', 'display') !== 'flex') return 'у .banner нет display: flex';
          const mid = s => { const r = h.rect(s); return r ? r.top + r.height / 2 : NaN; };
          const m = ['.banner__title', '.banner__text', '.banner__button'].map(mid);
          return Math.max(...m) - Math.min(...m) <= 2 || 'элементы не выровнены по центру: align-items: center';
        } },
        { name: 'Кнопка прижата к правому краю баннера', check: h => { const b = h.rect('.banner'), a = h.rect('.banner__button'), t = h.rect('.banner__text'); return !!(b && a && t) && b.right - a.right <= 32 && a.left > t.right || 'кнопка должна стоять справа: justify-content: space-between'; } },
        { name: 'Текст читается на всех цветах градиента (4,5:1)', check: h => onGradient(h, '.banner', ['.banner__title', '.banner__text']) },
        { name: 'Кнопка заметная: свой фон, отступы от 12px, без подчёркивания', check: h => {
          if (transparent(h.cs('.banner__button', 'background-color'))) return 'у кнопки нет своего фона';
          if (h.px('.banner__button', 'padding-left') < 12 || h.px('.banner__button', 'padding-right') < 12) return `отступы по бокам: ${h.px('.banner__button', 'padding-left')}px`;
          return h.cs('.banner__button', 'text-decoration-line') === 'none' || 'уберите подчёркивание: text-decoration: none';
        } }
      ]
    },
    {
      id: 'k3202', lesson: 'mdk-32', module: 'mdk3', mech: 'build',
      title: 'Квадратный баннер 300×250', level: 'Среднее', minutes: 25, points: 150,
      story: 'Тот же пробный урок нужно прорекламировать в боковой колонке сайта. Туда помещается «средний прямоугольник» — баннер 300×250.',
      goal: 'Напишите HTML и CSS. Блок aside с классом promo, внутри по порядку: заголовок h2, абзац p и ссылка-кнопка с классом promo__button. Баннер — ровно 300×250 пикселей, со скруглёнными углами (радиус от 12px), тенью box-shadow и фоном-градиентом; текст читается на всех цветах градиента (4,5:1). Содержимое стоит столбиком по центру: flex-direction: column, justify-content: center, text-align: center. У кнопки есть плавный переход transition, состояние :hover меняет её фон, а для :focus-visible задана рамка outline.',
      hints: [
        'Разметка: <aside class="promo"><h2>…</h2><p>…</p><a class="promo__button" href="#signup">…</a></aside>.',
        'Размер и вид: box-sizing: border-box; width: 300px; height: 250px; padding: 24px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25).',
        'Столбик по центру: display: flex; flex-direction: column; justify-content: center; text-align: center; gap: 8px.',
        'Состояния: .promo__button { transition: background-color 0.2s; } .promo__button:hover { background: #ffe8a3; } .promo__button:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }'
      ],
      html: `<!-- Баннер 300×250: aside.promo, внутри h2, p и a.promo__button -->
`,
      css: `${BASE}
/* Оформите баннер .promo и кнопку .promo__button */
`,
      tests: [
        { name: 'Есть aside.promo, внутри h2, p и a.promo__button по порядку', check: h => {
          const a = h.$('aside.promo'); if (!a) return 'нет <aside class="promo">';
          const h2 = a.querySelector('h2'), p = a.querySelector('p'), btn = a.querySelector('a.promo__button');
          if (!h2 || !p || !btn) return 'внутри нужны h2, p и a.promo__button';
          if (!btn.textContent.trim() || !btn.getAttribute('href')) return 'у кнопки нет текста или href';
          return h.before(h2, p) && h.before(p, btn) || 'порядок: заголовок, текст, кнопка';
        } },
        { name: 'Баннер ровно 300×250 пикселей', check: h => { const r = h.rect('.promo'); return r && Math.round(r.width) === 300 && Math.round(r.height) === 250 || `сейчас ${r ? Math.round(r.width) + '×' + Math.round(r.height) : 'нет .promo'}`; } },
        { name: 'Скруглённые углы от 12px и тень', check: h => {
          if (!(h.px('.promo', 'border-top-left-radius') >= 12)) return `радиус: ${h.cs('.promo', 'border-top-left-radius') || 'нет'}`;
          return h.cs('.promo', 'box-shadow') !== 'none' || 'нет box-shadow';
        } },
        { name: 'Фон — градиент, текст читается на всех его цветах', check: h => {
          const g = h.cs('.promo', 'background-image');
          if (!/gradient/.test(g)) return 'нужен фон-градиент';
          return onGradient(h, '.promo', ['.promo h2', '.promo p']);
        } },
        { name: 'Содержимое столбиком по центру', check: h => h.cs('.promo', 'display') === 'flex' && h.cs('.promo', 'flex-direction') === 'column' && h.cs('.promo', 'justify-content') === 'center' && h.cs('.promo', 'text-align') === 'center' || 'нужны display: flex, flex-direction: column, justify-content: center, text-align: center' },
        { name: 'У кнопки есть transition, :hover меняет фон, :focus-visible даёт outline', check: h => {
          const dur = h.cs('.promo__button', 'transition-duration').split(',').some(d => parseFloat(d) > 0);
          if (!dur) return 'нет transition у .promo__button';
          const hover = h.rules.some(r => /\.promo__button:hover/.test(r.selector) && (r.style.backgroundColor || r.style.backgroundImage));
          if (!hover) return 'нет правила .promo__button:hover с background';
          const focus = h.rules.some(r => /\.promo__button:focus-visible/.test(r.selector) && (r.style.outlineStyle || r.style.outline));
          return focus || 'нет правила .promo__button:focus-visible с outline';
        } }
      ]
    },
    {
      id: 'k3203', lesson: 'mdk-32', module: 'mdk3', mech: 'adaptive',
      title: 'Резиновый баннер с анимацией', level: 'Сложное', minutes: 35, points: 200,
      story: 'Баннеры фиксированного размера на телефоне вылезают за экран. Сделаем адаптивный баннер для главной страницы: он подстраивается под ширину экрана и мягко появляется при загрузке — но только у тех, кто не отключил анимацию.',
      goal: 'Переделайте CSS. На компьютере баннер .hero-banner не шире 728px (используйте max-width) и стоит в ряд; на телефоне 360px нет горизонтальной прокрутки, кнопка стоит под текстом и растянута на всю ширину баннера. Добавьте анимацию появления: правило @keyframes и свойство animation у баннера или кнопки; анимация длится не больше 1 секунды и проигрывается конечное число раз (не infinite). В @media (prefers-reduced-motion: reduce) отключите анимацию: animation: none. Текст должен читаться на всех цветах градиента.',
      hints: [
        'Замените width: 728px на max-width: 728px и добавьте box-sizing: border-box. Теперь баннер сжимается вместе с экраном.',
        'Mobile first: в .hero-banner поставьте flex-direction: column и align-items: stretch, а ряд верните в @media (min-width: 768px) { .hero-banner { flex-direction: row; align-items: center; } }.',
        'Анимация: @keyframes banner-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } } и у баннера animation: banner-in 0.6s ease-out.',
        'Для тех, кто просит меньше движения: @media (prefers-reduced-motion: reduce) { .hero-banner { animation: none; } }.'
      ],
      html: `<section class="hero-banner">
  <img class="hero-banner__icon" src="img/icon.svg" alt="" width="64" height="64">
  <div class="hero-banner__body">
    <h2 class="hero-banner__title">Весенний интенсив по вёрстке</h2>
    <p class="hero-banner__text">5 занятий, практика на настоящих макетах</p>
  </div>
  <a class="hero-banner__button" href="#signup">Хочу на интенсив</a>
</section>`,
      css: `${BASE}
.hero-banner {
  width: 728px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #1d3557, #6a2c70);
  color: #ffffff;
  border-radius: 16px;
}
.hero-banner__title { margin: 0 0 8px; font-size: 24px; }
.hero-banner__text { margin: 0; }
.hero-banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
}`,
      tests: [
        { name: 'На компьютере баннер не шире 728px и стоит в ряд', check: h => {
          const r = h.rect('.hero-banner'); if (!r) return 'нет .hero-banner';
          if (r.width > 728.5) return `ширина ${Math.round(r.width)}px`;
          if (r.width < 600) return `баннер сжался до ${Math.round(r.width)}px — нужна ширина 728px на большом экране`;
          return h.sameRow(['.hero-banner__icon', '.hero-banner__button']) || h.cs('.hero-banner', 'flex-direction') === 'row' || 'на компьютере элементы должны стоять в ряд';
        } },
        { at: 360, name: 'На телефоне нет горизонтальной прокрутки', check: h => !h.overflow() && h.rect('.hero-banner').right <= 360 || 'баннер шире экрана: замените width на max-width' },
        { at: 360, name: 'На телефоне кнопка под текстом и во всю ширину баннера', check: h => {
          const b = h.rect('.hero-banner'), t = h.rect('.hero-banner__body'), a = h.rect('.hero-banner__button');
          if (a.top < t.bottom - 1) return 'кнопка должна стоять ниже текста';
          const inner = b.width - h.px('.hero-banner', 'padding-left') - h.px('.hero-banner', 'padding-right');
          return a.width >= inner - 2 || `ширина кнопки ${Math.round(a.width)}px из ${Math.round(inner)}px`;
        } },
        { name: 'Есть @keyframes и animation у баннера или кнопки', check: h => {
          if (!h.has(/@keyframes\s+[\w-]+/)) return 'нет правила @keyframes';
          return ['.hero-banner', '.hero-banner__button'].some(s => h.cs(s, 'animation-name') !== 'none') || 'анимация не подключена: animation: имя 0.6s';
        } },
        { name: 'Анимация короткая (до 1 с) и не бесконечная', check: h => {
          const s = ['.hero-banner', '.hero-banner__button'].find(x => h.cs(x, 'animation-name') !== 'none');
          if (!s) return 'анимации нет';
          if (/infinite/.test(h.cs(s, 'animation-iteration-count'))) return 'бесконечная анимация отвлекает: уберите infinite';
          const d = parseFloat(h.cs(s, 'animation-duration'));
          return d > 0 && d <= 1 || `длительность ${h.cs(s, 'animation-duration')}`;
        } },
        { name: 'При prefers-reduced-motion: reduce анимация выключена', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media || '') && r.style.animationName === 'none') || 'нужно @media (prefers-reduced-motion: reduce) { … animation: none; }' },
        { name: 'Текст читается на всех цветах градиента (4,5:1)', check: h => onGradient(h, '.hero-banner', ['.hero-banner__title', '.hero-banner__text']) }
      ]
    }
  );
})();
