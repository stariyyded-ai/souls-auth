/* Занятие 20. Свойства CSS2 и CSS3 */
(() => {
  const { BASE } = window.COURSE_KIT;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  window.COURSE_TASKS.push(
    {
      id: 'k2001', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Обложка афиши', level: 'Лёгкое', minutes: 20, points: 100,
      story: 'Библиотека колледжа устраивает вечер настольных игр. Афиша на сайте пока скучная: тёмный прямоугольник с текстом. Сделайте из неё обложку с картинкой.',
      goal: 'У блока .cover поставьте фоновую картинку img/art.svg, растяните её на весь блок (background-size: cover) и поставьте по центру (background-position: center); тёмный background-color оставьте на случай, если картинка не загрузится. Скруглите углы обложки (border-radius не меньше 8px). Плашке с датой .cover__badge дайте полупрозрачный тёмный фон через rgba и скругление не меньше 8px. Заголовку .cover__title добавьте тень text-shadow, чтобы он читался на картинке.',
      hints: [
        'Фоновая картинка: background-image: url("img/art.svg"); Размер и положение — отдельными свойствами background-size и background-position.',
        'Полупрозрачный чёрный фон: background-color: rgba(0, 0, 0, 0.6); Четвёртое число — прозрачность, меньше 1.',
        'Абзац p растягивается на всю ширину, и фон плашки тоже. Чтобы фон был только под текстом, добавьте плашке display: inline-block и padding: 6px 12px.',
        'Тень текста: text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);'
      ],
      html: `<header class="cover">
  <p class="cover__badge">Суббота, 19:00 · читальный зал</p>
  <h1 class="cover__title">Вечер настольных игр в библиотеке</h1>
  <p class="cover__text">Вход свободный, игры принесём мы</p>
</header>`,
      css: `${BASE}
.cover {
  padding: 48px 24px;
  background-color: #2a2238;
  color: #ffffff;
}
.cover__title {
  margin: 16px 0 8px;
  font-size: 36px;
}`,
      tests: [
        { name: 'У .cover фоновая картинка img/art.svg', check: h => /art\.svg/.test(h.cs('.cover', 'background-image')) || 'нет background-image: url("img/art.svg")' },
        { name: 'Картинка закрывает весь блок: background-size: cover', check: h => h.cs('.cover', 'background-size') === 'cover' || `сейчас ${h.cs('.cover', 'background-size')}` },
        { name: 'Картинка по центру: background-position: center', check: h => h.cs('.cover', 'background-position') === '50% 50%' || `сейчас ${h.cs('.cover', 'background-position')}` },
        { name: 'Тёмный background-color у обложки сохранён', check: h => h.cs('.cover', 'background-color') === 'rgb(42, 34, 56)' || 'верните background-color: #2a2238' },
        { name: 'Скругление обложки не меньше 8px', check: h => radius(h, '.cover') >= 8 || `сейчас ${radius(h, '.cover')}px` },
        { name: 'Плашка с датой: полупрозрачный фон rgba и скругление от 8px', check: h => {
          const m = h.cs('.cover__badge', 'background-color').match(/rgba\([^)]*,\s*([\d.]+)\)/);
          if (!m || +m[1] <= 0.2 || +m[1] >= 1) return 'нужен фон rgba(…, …, …, 0.5) — прозрачность от 0.3 до 0.9';
          return radius(h, '.cover__badge') >= 8 || 'скругление плашки меньше 8px';
        } },
        { name: 'У заголовка есть тень text-shadow', check: h => h.cs('.cover__title', 'text-shadow') !== 'none' || 'нет text-shadow' }
      ]
    },
    {
      id: 'k2002', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Карточка с живой кнопкой', level: 'Среднее', minutes: 20, points: 150,
      story: 'Кофейня у колледжа выкладывает напитки недели на сайт. Карточка выглядит плоской, а кнопка «Заказать» никак не отвечает на наведение мыши.',
      goal: 'Карточке .card дайте скругление не меньше 12px и мягкую тень box-shadow, рамку border уберите. Картинку .card__img скруглите (не меньше 8px). Кнопке .card__btn: скругление не меньше 8px и transition на transform длительностью от 0.1 до 0.5 секунды. В правиле .card__btn:hover кнопка приподнимается или увеличивается (transform) и темнеет (другой background-color).',
      hints: [
        'Мягкая тень: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); А строку border у .card просто удалите.',
        'Переход пишется у обычного состояния: .card__btn { transition: transform 0.2s ease, background-color 0.2s ease; }',
        'Новое правило: .card__btn:hover { transform: translateY(-2px); background-color: #5c260b; }'
      ],
      html: `<article class="card">
  <img class="card__img" src="img/art.svg" alt="Кофейня вечером">
  <h2 class="card__title">Раф «Лавандовый»</h2>
  <p class="card__price">220 ₽ · 300 мл</p>
  <a class="card__btn" href="#order">Заказать</a>
</article>`,
      css: `${BASE}
.card {
  width: 260px;
  padding: 16px;
  border: 1px solid #999999;
  background-color: #ffffff;
}
.card__img {
  display: block;
  width: 100%;
}
.card__btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #8a3b12;
  color: #ffffff;
  text-decoration: none;
}`,
      tests: [
        { name: 'Карточка скруглена (от 12px) и с тенью, без рамки', check: h => {
          if (radius(h, '.card') < 12) return `скругление ${radius(h, '.card')}px`;
          if (h.cs('.card', 'box-shadow') === 'none') return 'нет box-shadow';
          return h.px('.card', 'border-top-width') === 0 || 'рамка border осталась';
        } },
        { name: 'Картинка скруглена (от 8px)', check: h => radius(h, '.card__img') >= 8 || `сейчас ${radius(h, '.card__img')}px` },
        { name: 'Кнопка скруглена (от 8px)', check: h => radius(h, '.card__btn') >= 8 || `сейчас ${radius(h, '.card__btn')}px` },
        { name: 'У кнопки transition на transform от 0.1 до 0.5 с', check: h => {
          const props = h.cs('.card__btn', 'transition-property').split(',').map(s => s.trim());
          const durs = h.cs('.card__btn', 'transition-duration').split(',').map(s => parseFloat(s) * (/ms/.test(s) ? 0.001 : 1));
          const i = props.findIndex(p => p === 'transform' || p === 'all');
          if (i < 0) return 'в transition нет transform';
          const d = durs[i % durs.length];
          return (d >= 0.1 && d <= 0.5) || `длительность ${d}s`;
        } },
        { name: 'В .card__btn:hover есть transform', check: h => h.rules.some(r => /\.card__btn:hover/.test(r.selector) && r.style.getPropertyValue('transform') && r.style.getPropertyValue('transform') !== 'none') || 'нет правила .card__btn:hover с transform' },
        { name: 'В .card__btn:hover меняется цвет фона', check: h => h.rules.some(r => /\.card__btn:hover/.test(r.selector) && r.style.getPropertyValue('background-color')) || 'в :hover нет background-color' }
      ]
    },
    {
      id: 'k2003', lesson: 'mdk-20', module: 'mdk2', mech: 'build', title: 'Значок «Новинка» и свой шрифт', level: 'Среднее', minutes: 20, points: 150,
      story: 'В столовой колледжа новое меню. На баннере нужен пульсирующий значок «Новинка», а текст — фирменным шрифтом Golos. И никого не должно укачать.',
      goal: 'Подключите шрифт через @font-face: имя Golos, файл fonts/golos-text-cyrillic-400-normal.woff2. Поставьте его блоку .promo: font-family с Golos первым и запасными Arial, sans-serif. Опишите анимацию @keyframes pulse (значок увеличивается через transform: scale и возвращается обратно) и подключите её к .promo__badge: бесконечно (infinite), длительность от 1 до 3 секунд. Добавьте @media (prefers-reduced-motion: reduce), где у .promo__badge анимация выключена (animation: none).',
      hints: [
        '@font-face { font-family: "Golos"; src: url("fonts/golos-text-cyrillic-400-normal.woff2") format("woff2"); }',
        'Кадры: @keyframes pulse { from { transform: scale(1); } 50% { transform: scale(1.1); } to { transform: scale(1); } }',
        'Подключение: .promo__badge { animation: pulse 1.5s ease-in-out infinite; }',
        'Медиазапрос пишется отдельным блоком: @media (prefers-reduced-motion: reduce) { .promo__badge { animation: none; } }'
      ],
      html: `<section class="promo">
  <h2 class="promo__title">Новое меню столовой <span class="promo__badge">Новинка</span></h2>
  <p>С понедельника — суп дня, свежая выпечка и комплексный обед за 250 ₽.</p>
</section>`,
      css: `${BASE}
.promo {
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff8e1;
}
.promo__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #ffd54f;
  color: #222222;
  font-size: 14px;
}`,
      tests: [
        { name: 'Есть @font-face с файлом fonts/golos-text-cyrillic-400-normal.woff2', check: h => /@font-face\s*\{[^}]*url\(\s*["']?fonts\/golos-text-cyrillic-400-normal\.woff2/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, '')) || 'нет @font-face с этим файлом' },
        { name: 'У .promo font-family: Golos, потом запасные Arial, sans-serif', check: h => { const f = h.cs('.promo', 'font-family'); return (/^"?Golos"?,/.test(f) && /sans-serif\s*$/.test(f)) || `сейчас: ${f}`; } },
        { name: 'Есть @keyframes pulse с transform', check: h => /@keyframes\s+pulse\s*\{[\s\S]*transform\s*:\s*scale/.test(h.css.replace(/\/\*[\s\S]*?\*\//g, '')) || 'нет @keyframes pulse со scale' },
        { name: 'Значок анимирован pulse бесконечно, круг от 1 до 3 секунд', check: h => {
          if (h.cs('.promo__badge', 'animation-name') !== 'pulse') return 'у .promo__badge нет animation: pulse';
          if (h.cs('.promo__badge', 'animation-iteration-count') !== 'infinite') return 'нужно infinite';
          const d = parseFloat(h.cs('.promo__badge', 'animation-duration'));
          return (d >= 1 && d <= 3) || `длительность ${d}s`;
        } },
        { name: 'В @media (prefers-reduced-motion: reduce) анимация значка выключена', check: h => h.rules.some(r => /prefers-reduced-motion:\s*reduce/.test(r.media) && /\.promo__badge/.test(r.selector) && r.style.getPropertyValue('animation-name') === 'none') || 'нет такого медиазапроса с animation: none' }
      ]
    }
  );
})();
