/* Занятие 17: эталонные решения */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1701: t => ({
      html: `<h1>Консультации по МДК.08.01</h1>
<p class="place">Кабинет 214, второй этаж</p>
<p id="info">Консультации проходят <strong>по понедельникам</strong></p>
<p id="teacher">Ведёт: <span class="teacher-name">Ирина Петровна</span></p>
<img src="${ICON}" width="48" height="48" alt="Календарь консультаций">
<p>Время на один вопрос: &lt; 10 минут.</p>`,
      css: t.css
    }),
    k1702: t => ({
      html: `<h1>Запись к терапевту</h1>
<img src="${ICON}" width="64" height="64" alt="Логотип поликлиники №3">
<p class="hint">Приём ведёт терапевт, кабинет 12.</p>
<form class="form" action="#" method="post">
  <label for="name">Ваше имя</label>
  <input id="name" name="name" type="text" placeholder="Анна">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel" placeholder="+7 900 000-00-00">
  <button class="button" type="submit">Записаться</button>
</form>
<p>Перед визитом прочитайте <a href="#rules">Правила приёма пациентов</a>.</p>`,
      css: `${BASE}
.hint { color: #595959; }
.form input { display: block; margin: 4px 0 12px; padding: 8px; font-size: 16px; }
.button { display: inline-block; padding: 10px 20px; background-color: #1f4e79; color: #ffffff; border: 0; font-size: 16px; }`
    }),
    k1703: t => ({
      html: `<img src="${ICON}" width="48" height="48" alt="Иконка колледжа">
<h1 class="title">Неделя открытых дверей</h1>
<p class="text">Приходите знакомиться с колледжем 20–24 октября.</p>
<p class="text">Наш девиз — <span lang="en">Learn by doing</span>: учимся на практике.</p>`,
      css: `${BASE}
.title { color: var(--brand, #1f4e79); font-family: "PT Sans", Arial, sans-serif; }
.text { font-family: "Fira Sans", Arial, sans-serif; font-size: 18px; }`
    })
  });
})();
