/* Занятие 32: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3201: t => ({
      html: t.html,
      css: `${BASE}
.banner {
  box-sizing: border-box;
  width: 728px;
  height: 90px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(90deg, #2b1a66, #7a1f5c);
  color: #ffffff;
}

.banner__title { margin: 0; font-size: 24px; }
.banner__text { margin: 0; }

.banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
}`
    }),
    k3202: () => ({
      html: `<aside class="promo">
  <h2 class="promo__title">Пробный урок по веб-дизайну</h2>
  <p class="promo__text">Сделаете свой первый макет в Figma за 2 часа</p>
  <a class="promo__button" href="#signup">Записаться бесплатно</a>
</aside>`,
      css: `${BASE}
.promo {
  box-sizing: border-box;
  width: 300px;
  height: 250px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: linear-gradient(160deg, #0b3d5c, #3c1f6b);
  color: #ffffff;
}
.promo__title { margin: 0; font-size: 22px; }
.promo__text { margin: 0 0 8px; }
.promo__button {
  padding: 12px 16px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;
}
.promo__button:hover { background: #ffe8a3; }
.promo__button:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }`
    }),
    k3203: t => ({
      html: t.html,
      css: `${BASE}
/* Сначала телефон: всё столбиком */
.hero-banner {
  box-sizing: border-box;
  max-width: 728px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  background: linear-gradient(135deg, #1d3557, #6a2c70);
  color: #ffffff;
  border-radius: 16px;
  animation: banner-in 0.6s ease-out;
}
.hero-banner__title { margin: 0 0 8px; font-size: 24px; }
.hero-banner__text { margin: 0; }
.hero-banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
}

@keyframes banner-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* С 768px — в ряд */
@media (min-width: 768px) {
  .hero-banner { flex-direction: row; align-items: center; gap: 24px; }
  .hero-banner__button { white-space: nowrap; }
}

/* Меньше движения для тех, кого анимация утомляет */
@media (prefers-reduced-motion: reduce) {
  .hero-banner { animation: none; }
}`
    })
  });
})();
