/* Занятие 25: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2501: t => ({
      html: t.html,
      css: `${t.css}
.tariff {
  max-width: 320px;
  padding: 16px;
  border: 2px solid #1a56b0;
  border-radius: 12px;
}
.tariff__title {
  margin: 0 0 8px;
  color: #1a56b0;
}
.tariff__price {
  font-size: 24px;
  font-weight: bold;
}
.tariff__btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
}
.tariff__btn:hover {
  background-color: #123d7d;
}`
    }),
    k2502: t => ({
      html: t.html,
      css: `${BASE}
.container {
  max-width: 1140px;
  margin: 0 auto;
}
.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
.col-12 {
  grid-column: span 12;
}
.news {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.news h2,
.news h3 {
  margin-top: 0;
}
.news--main {
  background-color: #fff8e1;
}
@media (min-width: 768px) {
  .col-md-6 {
    grid-column: span 6;
  }
  .col-md-4 {
    grid-column: span 4;
  }
}`
    }),
    k2503: t => ({
      html: `<main>
  <h1>Консультации по МДК.08.01</h1>
  <p>Выберите удобное время и нажмите «Записаться».</p>
</main>
<div class="modal">
  <section class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Вы записаны</h2>
    <p>Консультация в среду в 15:00, кабинет 214. Напоминание придёт на почту.</p>
    <button class="modal__close" type="button" aria-label="Закрыть">×</button>
  </section>
</div>`,
      css: `${BASE}
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
}
.modal__dialog {
  position: relative;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
}
.modal__dialog h2 {
  margin-top: 0;
}
.modal__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background-color: #eeeeee;
  color: #222222;
  font-size: 20px;
  cursor: pointer;
}`
    })
  });
})();
