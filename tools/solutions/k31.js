/* Занятие 31: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3101: t => ({
      html: `<main class="gallery-page">
  <h1>Фотографии с выпускного</h1>
  <p>Июнь, актовый зал и двор колледжа.</p>
  <div class="gallery">
    <img src="img/art.svg" alt="Актовый зал перед началом вечера" width="600" height="300">
    <img src="img/art.svg" alt="Выпускники получают дипломы на сцене" width="600" height="300" loading="lazy">
    <img src="img/art.svg" alt="Общее фото группы у входа" width="600" height="300" loading="lazy">
    <img src="img/art.svg" alt="Выпускники во дворе колледжа" width="600" height="300" loading="lazy">
  </div>
</main>`,
      css: `${BASE}
.gallery { display: grid; gap: 12px; }
.gallery img { max-width: 100%; height: auto; }`
    }),
    k3102: t => ({
      html: `<header class="hero">
  <h1>Кофейня «Зерно»</h1>
  <picture>
    <source media="(min-width: 768px)" srcset="img/course/k31-wide.svg">
    <img class="hero-img" src="img/course/k31-square.svg" alt="Зал кофейни вечером" width="600" height="600">
  </picture>
</header>
<main>
  <article class="card">
    <img class="card-img" src="img/course/k31-card-480.svg"
         srcset="img/course/k31-card-480.svg 480w, img/course/k31-card-960.svg 960w"
         sizes="(min-width: 768px) 50vw, 100vw"
         alt="Шоколадный торт с вишней" width="480" height="320">
    <h2>Торт дня</h2>
    <p>Шоколадный бисквит, вишня и сливочный крем. 180 рублей за кусочек.</p>
  </article>
</main>`,
      css: t.css
    }),
    k3103: t => ({
      html: t.html.replace(/alt="иконка"/g, 'alt="" width="24" height="24"'),
      css: `${BASE}
.hero { padding: 64px 24px; border-radius: 12px; background-color: #2a2238; background-image: url("img/art.svg"); background-size: cover; background-position: center; color: #ffffff; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.card { border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card img { display: block; width: 100%; height: 180px; object-fit: cover; }
.card h3 { margin: 12px 16px; }
.contacts ul { padding: 0; list-style: none; }
.contacts li { margin: 8px 0; }
.contacts img { margin-right: 8px; vertical-align: middle; }`
    })
  });
})();
