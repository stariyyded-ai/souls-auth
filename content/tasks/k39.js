/* Занятие 39. Модели цвета и контраст */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  const close = (a, b) => { const x = parse(a), y = parse(b); return x.length >= 3 && y.length >= 3 && [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 2); };
  // HSL → «rgb(r, g, b)», как браузер отдаёт цвет
  const hsl = (H, S, L) => {
    S /= 100; L /= 100;
    const k = n => (n + H / 30) % 12, a = S * Math.min(L, 1 - L);
    const f = n => Math.round(255 * (L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  };
  // Цвет из правила с селектором re (например, .btn:hover): значение переводим в вычисленный цвет через временный элемент
  const ruleColor = (h, re, prop) => {
    const r = h.rules.find(x => re.test(x.selector)); if (!r) return '';
    const short = prop === 'background-color' ? 'background' : prop;
    const v = r.style.getPropertyValue(prop) || r.style.getPropertyValue(short); if (!v) return '';
    const t = h.doc.createElement('span'); h.doc.body.appendChild(t);
    t.style.setProperty(short, v);
    const out = h.win.getComputedStyle(t).getPropertyValue(prop); t.remove();
    return out;
  };
  const lum = s => { const [r, g, b] = parse(s).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const plain = h => h.css.replace(/\/\*[\s\S]*?\*\//g, '');

  window.COURSE_TASKS.push(
    {
      id: 'k3901', lesson: 'mdk-39', module: 'mdk4', mech: 'build',
      title: 'Кнопка и метка в HSL', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'В карточке читального зала цвета записаны в HEX, и никто не помнит, как получить «тот же синий, только темнее». Перепишите их в HSL: там светлота — отдельное число.',
      goal: 'Запишите цвета в формате HSL (в CSS должно быть не меньше четырёх hsl()). Кнопка .btn: фон hsl(210, 70%, 35%), текст белый. При наведении .btn:hover: тот же оттенок и насыщенность, но светлота 25% — hsl(210, 70%, 25%). Метка .badge: полупрозрачный фон того же цвета, что кнопка, с непрозрачностью 0.15 — hsl(210 70% 35% / 0.15), а текст метки — hsl(210, 70%, 25%).',
      hints: [
        'HSL читается так: hsl(оттенок, насыщенность, светлота). Оттенок — угол на цветовом круге от 0 до 360, синий около 210.',
        'Чтобы сделать цвет темнее, меняйте только третье число: 35% → 25%.',
        'Прозрачность в HSL пишется через косую черту: hsl(210 70% 35% / 0.15). Запятые в такой записи не ставят.',
        'Правило наведения: .btn:hover { background-color: hsl(210, 70%, 25%); }'
      ],
      html: `<article class="card">
  <span class="badge">Новинка</span>
  <h1>Читальный зал открыт до 20:00</h1>
  <p>Свободные места есть на втором этаже, у окна.</p>
  <button class="btn" type="button">Забронировать место</button>
</article>`,
      css: `${BASE}
.card {
  max-width: 480px;
  padding: 24px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #dde6f0;
  color: #333333;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #2a6eb8;
  color: #ffffff;
}`,
      tests: [
        { name: 'Кнопка: фон hsl(210, 70%, 35%) и белый текст', check: h => close(h.cs('.btn', 'background-color'), hsl(210, 70, 35)) && h.cs('.btn', 'color') === rgb('#ffffff') || `сейчас фон ${h.cs('.btn', 'background-color')}` },
        { name: 'При наведении: тот же оттенок, светлота 25%', check: h => close(ruleColor(h, /\.btn:hover/, 'background-color'), hsl(210, 70, 25)) || 'нет правила .btn:hover с фоном hsl(210, 70%, 25%)' },
        { name: 'Метка: фон цвета кнопки с непрозрачностью 0.15', check: h => { const c = h.cs('.badge', 'background-color'), p = parse(c); return close(c, hsl(210, 70, 35)) && Math.abs(p[3] - 0.15) < 0.01 || `сейчас фон метки ${c}`; } },
        { name: 'Метка: текст hsl(210, 70%, 25%)', check: h => close(h.cs('.badge', 'color'), hsl(210, 70, 25)) || `сейчас цвет ${h.cs('.badge', 'color')}` },
        { name: 'Цвета записаны в HSL (не меньше четырёх hsl())', check: h => (plain(h).match(/hsla?\(/gi) || []).length >= 4 || 'пишите цвета как hsl(…)' }
      ]
    },
    {
      id: 'k3902', lesson: 'mdk-39', module: 'mdk4', mech: 'a11y',
      title: 'Почините контраст объявления', level: 'Среднее', minutes: 20, points: 150,
      story: 'Объявление о неделе открытых дверей сделано «стильно»: бледный текст, белые буквы на жёлтом. С телефона на улице его не прочитать, а человеку со слабым зрением — и в помещении.',
      goal: 'Поменяйте только цвета текста (свойство color), фоны оставьте как есть. Нужен контраст по WCAG AA: обычный текст — не меньше 4,5:1, крупный (24px и больше) — не меньше 3:1. Почините: дату .date, вводный абзац .lead, ссылку .link (она должна остаться синей — синий канал больше красного и зелёного), текст кнопки .btn, заголовок и текст в тёмном баннере .banner, примечание .note.',
      hints: [
        'Контраст можно посмотреть в инструментах разработчика: правый клик → «Просмотреть код», выбрать элемент, нажать на квадратик цвета в стилях — там будет строка Contrast ratio.',
        'Серый на белом читается, если он не светлее #767676. Возьмите, например, #595959.',
        'Белый на жёлтом не спасти — на жёлтой кнопке пишут тёмным: #1a1a1a.',
        'На тёмном фоне #2b2b2b текст должен быть светлым: #ffffff для заголовка, #d6d6d6 для абзаца. Ссылка: #0b5cad.'
      ],
      html: `<section class="notice">
  <h1>Неделя открытых дверей</h1>
  <p class="date">С 12 по 16 марта, библиотека колледжа</p>
  <p class="lead">Покажем, как найти книгу в каталоге, взять ноутбук и забронировать переговорную.</p>
  <p><a class="link" href="#program">Программа недели</a></p>
  <p><button class="btn" type="button">Записаться</button></p>
</section>
<section class="banner">
  <h2>Нужна помощь?</h2>
  <p class="banner__text">Спросите библиотекаря у стойки выдачи.</p>
</section>
<p class="note">Вход по студенческому билету.</p>`,
      css: `${BASE}
.notice {
  padding: 24px;
  background-color: #ffffff;
}
.date {
  color: #a0a0a0;
}
.lead {
  font-size: 18px;
  color: #8c8c8c;
}
.link {
  color: #6fa8dc;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f5c518;
  color: #ffffff;
}
.banner {
  padding: 24px;
  background-color: #2b2b2b;
}
.banner h2 {
  margin-top: 0;
  font-size: 24px;
  color: #666666;
}
.banner__text {
  color: #5a5a5a;
}
.note {
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #b0b0b0;
}`,
      tests: [
        { name: 'Фоны не изменились', check: h => [['.notice', '#ffffff'], ['.btn', '#f5c518'], ['.banner', '#2b2b2b'], ['.note', '#f0f0f0']].every(([s, c]) => h.cs(s, 'background-color') === rgb(c)) || 'меняйте только color, фоны оставьте' },
        { name: 'Дата и вводный абзац: контраст от 4,5:1', check: h => ['.date', '.lead'].every(s => h.contrast(s) >= 4.5) || `сейчас ${h.contrast('.date').toFixed(2)} и ${h.contrast('.lead').toFixed(2)}` },
        { name: 'Ссылка синяя и с контрастом от 4,5:1', check: h => { const [r, g, b] = parse(h.cs('.link', 'color')); return h.contrast('.link') >= 4.5 && b > r && b > g || `контраст ${h.contrast('.link').toFixed(2)}, ссылка должна остаться синей`; } },
        { name: 'Текст на жёлтой кнопке: контраст от 4,5:1', check: h => h.contrast('.btn') >= 4.5 || `сейчас ${h.contrast('.btn').toFixed(2)}:1` },
        { name: 'Тёмный баннер: заголовок от 3:1, текст от 4,5:1', check: h => h.contrast('.banner h2') >= 3 && h.contrast('.banner__text') >= 4.5 || `заголовок ${h.contrast('.banner h2').toFixed(2)}, текст ${h.contrast('.banner__text').toFixed(2)}` },
        { name: 'Примечание на сером фоне: контраст от 4,5:1', check: h => h.contrast('.note') >= 4.5 || `сейчас ${h.contrast('.note').toFixed(2)}:1` }
      ]
    },
    {
      id: 'k3903', lesson: 'mdk-39', module: 'mdk4', mech: 'build',
      title: 'Тёмная тема на переменных', level: 'Среднее', minutes: 20, points: 150,
      story: 'Сайт библиотеки просят сделать с тёмной темой: вечером в читальном зале белый экран слепит. Компоненты уже написаны на переменных, осталось подобрать значения для тёмной темы.',
      goal: 'Допишите правило .theme--dark: объявите в нём переменные --text, --muted, --accent и --on-accent (фон --bg уже есть). Требования: фон тёмный, но не чисто чёрный (#121417 уже подходит); заголовок, обычный и приглушённый текст, ссылка и текст кнопки в тёмной теме имеют контраст не меньше 4,5:1; акцент в тёмной теме светлее, чем в светлой (насыщенный тёмно-синий на тёмном фоне не читается). Светлую тему не трогайте. В правилах компонентов (.theme, .muted, .link, .btn) свойства color и background-color задаются только через var().',
      hints: [
        'Переменные наследуются: всё, что внутри .theme--dark, берёт значения из этого правила.',
        'Для текста на тёмном фоне не нужен чисто белый: #e6e8eb мягче для глаз. Приглушённый — #a9b1ba.',
        'Акцент для тёмной темы — светлый синий, например #6cb6ff. Тогда текст на кнопке должен быть тёмным: --on-accent: #0d1117.',
        'Проверьте каждую пару «текст / фон» в инструментах разработчика, строка Contrast ratio.'
      ],
      html: `<h1>Две темы библиотеки</h1>
<div class="theme theme--light">
  <h2>Светлая тема</h2>
  <p class="muted">Обновлено сегодня в 10:00</p>
  <p>Новые поступления: 24 книги по программированию.</p>
  <p><a class="link" href="#catalog">Открыть каталог</a></p>
  <button class="btn" type="button">Забронировать</button>
</div>
<div class="theme theme--dark">
  <h2>Тёмная тема</h2>
  <p class="muted">Обновлено сегодня в 10:00</p>
  <p>Новые поступления: 24 книги по программированию.</p>
  <p><a class="link" href="#catalog">Открыть каталог</a></p>
  <button class="btn" type="button">Забронировать</button>
</div>`,
      css: `${BASE}
.theme--light {
  --bg: #ffffff;
  --text: #1f2328;
  --muted: #59636e;
  --accent: #0b5cad;
  --on-accent: #ffffff;
}
.theme--dark {
  --bg: #121417;
}
.theme {
  margin-bottom: 16px;
  padding: 24px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: var(--bg);
  color: var(--text);
}
.muted {
  color: var(--muted);
}
.link {
  color: var(--accent);
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--accent);
  color: var(--on-accent);
}`,
      tests: [
        { name: 'Фон тёмной темы тёмный, но не чисто чёрный', check: h => { const c = h.cs('.theme--dark', 'background-color'); return lum(c) < 0.05 && c !== 'rgb(0, 0, 0)' || `сейчас ${c}`; } },
        { name: 'Тёмная тема: заголовок, текст и приглушённый текст — контраст от 4,5:1', check: h => ['.theme--dark h2', '.theme--dark p:not(.muted)', '.theme--dark .muted'].every(s => h.contrast(s) >= 4.5) || `заголовок ${h.contrast('.theme--dark h2').toFixed(2)}, приглушённый ${h.contrast('.theme--dark .muted').toFixed(2)}` },
        { name: 'Тёмная тема: ссылка и текст кнопки — контраст от 4,5:1', check: h => h.contrast('.theme--dark .link') >= 4.5 && h.contrast('.theme--dark .btn') >= 4.5 || `ссылка ${h.contrast('.theme--dark .link').toFixed(2)}, кнопка ${h.contrast('.theme--dark .btn').toFixed(2)}` },
        { name: 'Акцент в тёмной теме светлее, чем в светлой', check: h => lum(h.cs('.theme--dark .btn', 'background-color')) > lum(h.cs('.theme--light .btn', 'background-color')) + 0.1 || 'возьмите для --accent в тёмной теме светлый синий' },
        { name: 'Светлая тема не сломана', check: h => h.cs('.theme--light', 'background-color') === rgb('#ffffff') && ['.theme--light h2', '.theme--light .muted', '.theme--light .link', '.theme--light .btn'].every(s => h.contrast(s) >= 4.5) || 'верните светлой теме прежние значения' },
        { name: 'В компонентах цвета только через var()', check: h => {
          const bad = h.rules.filter(r => /^\.(theme|muted|link|btn)$/.test(r.selector)).find(r => ['color', 'background-color'].some(p => { const v = r.style.getPropertyValue(p) || (p === 'background-color' ? r.style.getPropertyValue('background') : ''); return v && !/var\(/.test(v); }));
          return !bad || `в правиле ${bad.selector} цвет без var()`; } }
      ]
    }
  );
})();
