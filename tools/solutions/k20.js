/* Занятие 20: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2001: t => ({
      html: t.html,
      css: `${BASE}
.cover {
  padding: 48px 24px;
  border-radius: 16px;
  background-color: #2a2238;
  background-image: url("img/art.svg");
  background-size: cover;
  background-position: center;
  color: #ffffff;
}
.cover__badge {
  display: inline-block;
  margin: 0;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
}
.cover__title {
  margin: 16px 0 8px;
  font-size: 36px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}`
    }),
    k2002: t => ({
      html: t.html,
      css: `${BASE}
.card {
  width: 260px;
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.card__img {
  display: block;
  width: 100%;
  border-radius: 8px;
}
.card__btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #8a3b12;
  color: #ffffff;
  text-decoration: none;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.card__btn:hover {
  transform: translateY(-2px);
  background-color: #5c260b;
}`
    }),
    k2003: t => ({
      html: t.html,
      css: `${BASE}
@font-face {
  font-family: "Golos";
  src: url("fonts/golos-text-cyrillic-400-normal.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@keyframes pulse {
  from { transform: scale(1); }
  50% { transform: scale(1.1); }
  to { transform: scale(1); }
}
.promo {
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff8e1;
  font-family: "Golos", Arial, sans-serif;
}
.promo__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #ffd54f;
  color: #222222;
  font-size: 14px;
  animation: pulse 1.5s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .promo__badge {
    animation: none;
  }
}`
    })
  });
})();
