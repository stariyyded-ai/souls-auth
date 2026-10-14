/* Занятие 12: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1201: t => ({
      html: t.html,
      css: `${BASE}
/* Ваши правила для h1 и p — ниже */
h1 {
  color: #6b3e1f;
  text-align: center;
  font-family: Georgia, serif;
  font-size: 2rem;
}
p {
  font-size: 18px;
  line-height: 1.5;
}
`
    }),
    k1202: t => ({
      html: `<h1>Меню кафе «Пенка»</h1>
<h2>Завтраки</h2>
<ul>
  <li>Сырники со сметаной — <span class="price">150 ₽</span></li>
  <li class="new">Овсяная каша с ягодами (новинка) — <span class="price">120 ₽</span></li>
  <li>Омлет с сыром — <span class="price">130 ₽</span></li>
</ul>
<h2>Напитки</h2>
<ul>
  <li class="new">Какао с зефиром (новинка) — <span class="price">110 ₽</span></li>
  <li>Чай чёрный — <span class="price">50 ₽</span></li>
</ul>
<p id="special">Блюдо дня: тыквенный суп с гренками</p>`,
      css: `${BASE}
h1 { color: #6b3e1f; }
h2 { color: #6b3e1f; }
li { line-height: 1.8; }
/* Ваши правила для .price, .new и #special — ниже */
.price {
  font-weight: bold;
  color: #1d5c3a;
}
.new {
  background-color: #fff3c4;
}
#special {
  font-size: 20px;
  text-align: center;
}
`
    }),
    k1203: t => ({
      html: `<h1>Объявления колледжа</h1>
<p class="warning">Завтра столовая закрыта на санобработку.</p>
<p>В библиотеку пришли новые учебники по веб-дизайну.</p>
<p class="warning">Сдайте медицинские справки до 1 октября.</p>
<p class="warning">Пропуск без студенческого билета не выдаётся.</p>
<p class="note">Объявления обновляются каждый понедельник.</p>`,
      css: `${BASE}
h1 {
  color: #1f4e79;
  text-align: center;
}
.warning {
  color: #8e1f14;
  font-weight: bold;
}
.note {
  font-size: 14px;
  color: #555555;
}
`
    })
  });
})();
