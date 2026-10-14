/* Занятие 31. Практическая работа №7. Подготовка и оптимизация графики */
(() => {
  const { BASE, IMG, ICON, rgb } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k3101', lesson: 'mdk-31', module: 'mdk3', mech: 'fix', title: 'Галерея без прыжков', level: 'Лёгкое', minutes: 25, points: 120,
      story: 'Фотогалерея с выпускного на сайте колледжа грузится долго, текст «прыгает», пока появляются фото, а на телефоне картинки вылезают за экран.',
      goal: 'У всех четырёх картинок галереи: width="600" и height="300" (настоящий размер файла), понятный alt (не пустой — это содержательные фото), loading="lazy" у всех, кроме первой (первая видна сразу). В CSS замените фиксированную ширину на max-width: 100% и height: auto, чтобы на телефоне 360px не было горизонтальной прокрутки и пропорции 2:1 сохранились.',
      hints: [
        'Пример готовой картинки: <img src="img/art.svg" alt="Выпускники во дворе колледжа" width="600" height="300" loading="lazy">',
        'Первой картинке loading="lazy" не нужен: она на первом экране и должна появиться сразу.',
        'Пустой alt="" — только для декоративных картинок. Здесь фото с праздника, опишите, что на них.',
        'CSS: .gallery img { max-width: 100%; height: auto; } — без width: 600px.'
      ],
      html: `<main class="gallery-page">
  <h1>Фотографии с выпускного</h1>
  <p>Июнь, актовый зал и двор колледжа.</p>
  <div class="gallery">
    <img src="${IMG}" alt="Актовый зал перед началом вечера">
    <img src="${IMG}">
    <img src="${IMG}" alt="">
    <img src="${IMG}" alt="Выпускники во дворе колледжа">
  </div>
</main>`,
      css: `${BASE}
.gallery { display: grid; gap: 12px; }
.gallery img { width: 600px; }`,
      tests: [
        { name: 'У всех картинок width="600" и height="300"', check: h => { const bad = h.$$('.gallery img').filter(i => i.getAttribute('width') !== '600' || i.getAttribute('height') !== '300'); return h.count('.gallery img') === 4 && !bad.length || `без правильных width/height: ${bad.length}`; } },
        { name: 'У всех картинок понятный alt', check: h => { const bad = h.$$('.gallery img').filter(i => (i.getAttribute('alt') || '').trim().length < 5); return !bad.length || `без описания: ${bad.length}`; } },
        { name: 'loading="lazy" у всех, кроме первой', check: h => { const l = h.$$('.gallery img').map(i => i.getAttribute('loading') === 'lazy'); return l.join() === 'false,true,true,true' || `lazy: ${l.join(', ')}`; } },
        { name: 'Телефон: картинки не шире экрана, пропорции 2:1', at: 360, check: h => {
          const r = h.rect('.gallery img');
          if (r.width > 320) return `ширина картинки ${Math.round(r.width)}px`;
          return Math.abs(r.width / r.height - 2) < 0.05 || `пропорции искажены: ${Math.round(r.width)}×${Math.round(r.height)}`;
        } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' },
        { name: 'В CSS нет фиксированной ширины 600px', check: h => !h.has(/width:\s*600px/) || 'уберите width: 600px' }
      ]
    },
    {
      id: 'k3102', lesson: 'mdk-31', module: 'mdk3', mech: 'adaptive', title: 'Картинка под экран', level: 'Сложное', minutes: 30, points: 200,
      story: 'На главной кофейни широкая панорама зала. На телефоне она превращается в узкую полоску, а картинка торта весит как на огромный монитор. Подберём файлы под экран.',
      goal: 'Первый экран: оберните картинку .hero-img в picture. В source с media="(min-width: 768px)" — srcset="img/course/k31-wide.svg"; в img — src="img/course/k31-square.svg", width="600", height="600", alt остаётся. Карточка: у .card-img src="img/course/k31-card-480.svg", srcset из двух файлов k31-card-480.svg (480w) и k31-card-960.svg (960w), sizes="(min-width: 768px) 50vw, 100vw", width="480", height="320".',
      hints: [
        'Каркас: <picture><source media="(min-width: 768px)" srcset="img/course/k31-wide.svg"><img class="hero-img" …></picture>',
        'Внутри picture у img поменяйте src на квадратный файл и размеры на 600×600. Класс hero-img и alt оставьте.',
        'srcset: два файла через запятую, после каждого ширина: srcset="img/course/k31-card-480.svg 480w, img/course/k31-card-960.svg 960w"',
        'sizes="(min-width: 768px) 50vw, 100vw" — на компьютере карточка занимает половину окна, на телефоне всю ширину.'
      ],
      html: `<header class="hero">
  <h1>Кофейня «Зерно»</h1>
  <img class="hero-img" src="img/course/k31-wide.svg" alt="Зал кофейни вечером" width="1200" height="500">
</header>
<main>
  <article class="card">
    <img class="card-img" src="img/course/k31-card-960.svg" alt="Шоколадный торт с вишней" width="960" height="640">
    <h2>Торт дня</h2>
    <p>Шоколадный бисквит, вишня и сливочный крем. 180 рублей за кусочек.</p>
  </article>
</main>`,
      css: `${BASE}
.hero-img, .card-img { display: block; max-width: 100%; height: auto; }
.card { margin-top: 24px; border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card h2, .card p { margin: 12px 16px; }
@media (min-width: 768px) {
  .card { width: 50%; }
}`,
      tests: [
        { name: 'Картинка первого экрана внутри picture с source для экранов от 768px', check: h => {
          const s = h.$('.hero picture source');
          if (!s) return 'нет picture > source в .hero';
          if (!/\(\s*min-width:\s*768px\s*\)/.test(s.getAttribute('media') || '')) return `media: «${s.getAttribute('media') || ''}»`;
          return (s.getAttribute('srcset') || '').trim() === 'img/course/k31-wide.svg' || 'srcset у source — img/course/k31-wide.svg';
        } },
        { name: 'img в picture: квадратный файл, 600×600, alt и класс на месте', check: h => {
          const i = h.$('.hero picture img.hero-img');
          if (!i) return 'внутри picture нет img с классом hero-img';
          if (i.getAttribute('src') !== 'img/course/k31-square.svg') return `src: ${i.getAttribute('src')}`;
          if (i.getAttribute('width') !== '600' || i.getAttribute('height') !== '600') return 'width и height должны быть 600';
          return i.alt.trim().length > 3 || 'нет alt';
        } },
        { name: 'Компьютер: показывается широкая картинка', check: h => /k31-wide\.svg$/.test(h.$('.hero-img')?.currentSrc || '') || `сейчас: ${(h.$('.hero-img')?.currentSrc || '').split('/').pop()}` },
        { name: 'Телефон: показывается квадратная картинка', at: 360, check: h => /k31-square\.svg$/.test(h.$('.hero-img')?.currentSrc || '') || `сейчас: ${(h.$('.hero-img')?.currentSrc || '').split('/').pop()}` },
        { name: 'Карточка: srcset из 480w и 960w', check: h => {
          const s = (h.$('.card-img')?.getAttribute('srcset') || '').split(',').map(x => x.trim().replace(/\s+/g, ' ')).sort().join(' | ');
          return s === 'img/course/k31-card-480.svg 480w | img/course/k31-card-960.svg 960w' || `srcset: ${s || 'нет'}`;
        } },
        { name: 'Карточка: sizes="(min-width: 768px) 50vw, 100vw"', check: h => (h.$('.card-img')?.getAttribute('sizes') || '').replace(/\s+/g, ' ').replace(/\(\s*/g, '(').replace(/\s*\)/g, ')').trim() === '(min-width: 768px) 50vw, 100vw' || `sizes: «${h.$('.card-img')?.getAttribute('sizes') || ''}»` },
        { name: 'Карточка: src на маленьком файле, 480×320', check: h => { const i = h.$('.card-img'); return !!i && i.getAttribute('src') === 'img/course/k31-card-480.svg' && i.getAttribute('width') === '480' && i.getAttribute('height') === '320' || 'src — k31-card-480.svg, width 480, height 320'; } },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    },
    {
      id: 'k3103', lesson: 'mdk-31', module: 'mdk3', mech: 'build', title: 'Обложки, иконки и фон', level: 'Среднее', minutes: 25, points: 150,
      story: 'Страница кофейни почти готова, но карточки меню разной высоты из-за фото разных пропорций, скринридер читает «иконка» перед каждым контактом, а первый экран — просто текст на белом.',
      goal: 'Карточки: всем картинкам .card img — width: 100%, height: 180px, object-fit: cover. Контакты: иконкам в .contacts — пустой alt="" и атрибуты width="24" height="24". Первый экран .hero: фон background-image: url("img/art.svg"), background-size: cover, background-position: center, запасной тёмный background-color #2a2238, белый цвет текста #ffffff.',
      hints: [
        'Карточки: .card img { width: 100%; height: 180px; object-fit: cover; } Картинки обрежутся по краям, но не исказятся.',
        'Иконка рядом со словом «Телефон» его дублирует: <img src="img/icon.svg" alt="" width="24" height="24">.',
        'Фон: .hero { background-color: #2a2238; background-image: url("img/art.svg"); background-size: cover; background-position: center; color: #ffffff; }'
      ],
      html: `<section class="hero">
  <h1>Кофейня «Зерно»</h1>
  <p>Кофе и выпечка у колледжа с 8:00</p>
</section>
<section class="menu">
  <h2>Хиты недели</h2>
  <div class="cards">
    <article class="card">
      <img src="${IMG}" alt="Вечерний зал кофейни" width="600" height="300">
      <h3>Раф «Вечерний»</h3>
    </article>
    <article class="card">
      <img src="img/course/k31-square.svg" alt="Яблочный пирог на тарелке" width="600" height="600">
      <h3>Пирог с яблоком</h3>
    </article>
    <article class="card">
      <img src="img/course/k31-card-480.svg" alt="Шоколадный торт с вишней" width="480" height="320">
      <h3>Торт дня</h3>
    </article>
  </div>
</section>
<section class="contacts">
  <h2>Контакты</h2>
  <ul>
    <li><img src="${ICON}" alt="иконка">Телефон: <a href="tel:+79990000000">+7 999 000-00-00</a></li>
    <li><img src="${ICON}" alt="иконка">Почта: <a href="mailto:hello@zerno.example">hello@zerno.example</a></li>
  </ul>
</section>`,
      css: `${BASE}
.hero { padding: 64px 24px; border-radius: 12px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.card { border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card img { display: block; width: 100%; }
.card h3 { margin: 12px 16px; }
.contacts ul { padding: 0; list-style: none; }
.contacts li { margin: 8px 0; }
.contacts img { margin-right: 8px; vertical-align: middle; }`,
      tests: [
        { name: 'Картинки карточек: object-fit: cover', check: h => h.$$('.card img').every(i => h.cs(i, 'object-fit') === 'cover') || 'нужно object-fit: cover' },
        { name: 'Картинки карточек одной высоты 180px и во всю ширину карточки', check: h => {
          for (const i of h.$$('.card img')) {
            const r = i.getBoundingClientRect(), c = i.closest('.card').getBoundingClientRect();
            if (Math.abs(r.height - 180) > 1) return `высота картинки ${Math.round(r.height)}px`;
            if (r.width < c.width - 4) return 'картинка уже карточки';
          }
          return true;
        } },
        { name: 'Иконки в контактах: alt="" и width/height 24', check: h => { const bad = h.$$('.contacts img').filter(i => i.getAttribute('alt') !== '' || i.getAttribute('width') !== '24' || i.getAttribute('height') !== '24'); return h.count('.contacts img') === 2 && !bad.length || `неправильных иконок: ${bad.length}`; } },
        { name: 'Первый экран: фон img/art.svg, cover, по центру', check: h => {
          if (!/art\.svg/.test(h.cs('.hero', 'background-image'))) return 'нет background-image с img/art.svg';
          if (h.cs('.hero', 'background-size') !== 'cover') return `background-size: ${h.cs('.hero', 'background-size')}`;
          return /^50% 50%$/.test(h.cs('.hero', 'background-position')) || `background-position: ${h.cs('.hero', 'background-position')}`;
        } },
        { name: 'Первый экран: запасной фон #2a2238 и белый текст', check: h => h.cs('.hero', 'background-color') === rgb('#2a2238') && h.cs('.hero h1', 'color') === rgb('#ffffff') && h.cs('.hero p', 'color') === rgb('#ffffff') || 'нужны background-color: #2a2238 и color: #ffffff' },
        { name: 'Телефон: нет горизонтальной прокрутки', at: 360, check: h => !h.overflow() || 'страница шире экрана' }
      ]
    }
  );
})();
