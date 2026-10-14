/* Занятие 29: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2901: t => ({
      html: t.html,
      css: `${t.css}@media (min-width: 768px) {
  .burger { display: none; }
  nav { flex-basis: auto; }
  .menu, .menu[hidden] { display: flex; gap: 24px; }
}`,
      js: `// Меню-бургер
const burger = document.querySelector('#burger');
const menu = document.querySelector('#menu');

burger.addEventListener('click', function () {
  menu.hidden = !menu.hidden;
  if (menu.hidden) {
    burger.setAttribute('aria-expanded', 'false');
    burger.textContent = 'Меню';
  } else {
    burger.setAttribute('aria-expanded', 'true');
    burger.textContent = 'Закрыть';
  }
});
`
    }),
    k2902: t => ({
      html: t.html, css: t.css,
      js: `// Вкладки
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

for (const tab of tabs) {
  tab.addEventListener('click', function () {
    for (const other of tabs) {
      other.classList.remove('active');
      other.setAttribute('aria-selected', 'false');
    }
    for (const panel of panels) {
      panel.hidden = true;
    }
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.querySelector('#' + tab.getAttribute('aria-controls'));
    panel.hidden = false;
  });
}
`
    }),
    k2903: t => ({
      html: t.html, css: t.css,
      js: `// Вопрос-ответ и «Показать ещё»
const questions = document.querySelectorAll('.faq-question');
const more = document.querySelector('#more');

for (const question of questions) {
  question.addEventListener('click', function () {
    const answer = document.querySelector('#' + question.getAttribute('aria-controls'));
    answer.hidden = !answer.hidden;
    if (answer.hidden) {
      question.setAttribute('aria-expanded', 'false');
    } else {
      question.setAttribute('aria-expanded', 'true');
    }
  });
}

more.addEventListener('click', function () {
  for (const item of document.querySelectorAll('.extra')) {
    item.hidden = false;
  }
  more.hidden = true;
});
`
    })
  });
})();
