/* Занятие 23: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const card = (alt, title, text, price) => `    <article class="product">
      <img class="product__img" src="img/art.svg" alt="${alt}">
      <div class="product__body">
        <h3>${title}</h3>
        <p>${text}</p>
        <p class="product__price">${price}</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2301: t => ({
      html: `<header class="header">
  <a class="header__logo" href="#top">Зерно</a>
  <nav>
    <ul class="menu">
      <li><a href="#menu">Меню</a></li>
      <li><a href="#about">О нас</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<section class="hero">
  <h1>Кофе, который ждёт вас между парами</h1>
  <p>Свежая обжарка, выпечка каждое утро и скидка по студенческому билету.</p>
  <a class="btn" href="#menu">Посмотреть меню</a>
</section>`,
      css: `${BASE}
${PALETTE}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 64px 32px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 44px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.btn:hover {
  background-color: #7d3f14;
}`
    }),
    k2302: t => ({
      html: t.html.replace('    <!-- Третье преимущество «Есть розетки»: напишите по образцу -->', `    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Есть розетки</h3>
      <p>У каждого стола можно зарядить ноутбук и телефон.</p>
    </li>`),
      css: `${BASE}
${PALETTE}
.features h2 {
  color: var(--coffee);
}
.features__list {
  display: flex;
  gap: 24px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 24px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature__icon {
  display: block;
  width: 48px;
  height: 48px;
}
.feature h3 {
  margin: 12px 0 8px;
  color: var(--coffee);
}
.feature p {
  margin: 0;
}`
    }),
    k2303: t => ({
      html: t.html.replace('    <!-- Добавьте ещё четыре карточки: Американо 120 ₽, Какао 140 ₽, Чай с чабрецом 90 ₽, Сырник 110 ₽ -->', [
        card('Американо в бумажном стакане', 'Американо', 'Эспрессо и горячая вода. 300 мл.', '120 ₽'),
        card('Какао с маршмеллоу', 'Какао', 'Горячий шоколадный напиток на молоке. 300 мл.', '140 ₽'),
        card('Чайник с травяным чаем', 'Чай с чабрецом', 'Чёрный чай с чабрецом, чайник на двоих.', '90 ₽'),
        card('Сырник со сметаной', 'Сырник', 'Из творога, со сметаной или вареньем.', '110 ₽')
      ].join('\n')),
      css: `${BASE}
${PALETTE}
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product__img {
  display: block;
  width: 100%;
  height: auto;
}
.product__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}
.product h3 {
  margin: 0 0 8px;
}
.product__price {
  font-weight: bold;
  color: var(--coffee);
}
.product__btn {
  margin-top: auto;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer a {
  color: var(--cream);
}`
    })
  });
})();
