/* Занятие 24: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2401: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон: базовые стили */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
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
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 32px 20px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 30px;
}
.btn {
  display: block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}

/* Планшет и компьютер */
@media (min-width: 768px) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .menu {
    gap: 24px;
  }
  .hero {
    padding: 64px 48px;
  }
  .hero h1 {
    font-size: 48px;
  }
  .btn {
    display: inline-block;
  }
}`
    }),
    k2402: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон */
.features__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature h3 {
  margin-top: 0;
  color: var(--coffee);
}
.catalog__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
.product {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product img {
  display: block;
  width: 100%;
  height: auto;
}
.product h3,
.product p {
  margin: 12px 16px;
}

/* Планшет */
@media (min-width: 768px) {
  .features__list {
    flex-direction: row;
    gap: 24px;
  }
  .catalog__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Компьютер */
@media (min-width: 1280px) {
  .catalog__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`
    }),
    k2403: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон */
.about {
  display: grid;
  gap: 24px;
}
.about__img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}
.about__text h2 {
  color: var(--coffee);
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer p {
  margin: 0;
}
.footer a {
  color: var(--cream);
}
.footer__mail {
  overflow-wrap: anywhere;
}

/* Планшет и компьютер */
@media (min-width: 768px) {
  .about {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
  .footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}`
    })
  });
})();
