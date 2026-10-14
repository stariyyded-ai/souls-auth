/* Занятие 28: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2801: t => ({
      html: t.html, css: t.css,
      js: `// Счётчик стаканов воды
const plus = document.querySelector('#plus');
const reset = document.querySelector('#reset');
const countEl = document.querySelector('#count');
const done = document.querySelector('#done');

let count = 0;

plus.addEventListener('click', function () {
  count = count + 1;
  countEl.textContent = count;
  if (count >= 8) {
    done.hidden = false;
  }
});

reset.addEventListener('click', function () {
  count = 0;
  countEl.textContent = count;
  done.hidden = true;
});
`
    }),
    k2802: t => ({
      html: t.html, css: t.css,
      js: `// Выбор объёма
const sizes = document.querySelectorAll('.size');
const choice = document.querySelector('#choice');

for (const size of sizes) {
  size.addEventListener('click', function () {
    for (const other of sizes) {
      other.classList.remove('selected');
    }
    size.classList.add('selected');
    choice.textContent = 'Вы выбрали: ' + size.textContent;
  });
}
`
    }),
    k2803: t => ({
      html: t.html, css: t.css,
      js: `// Запись на тренировку
const form = document.querySelector('#signup');
const nameInput = document.querySelector('#name');
const hello = document.querySelector('#hello');
const message = document.querySelector('#message');

nameInput.addEventListener('input', function () {
  hello.textContent = 'Здравствуйте, ' + nameInput.value + '!';
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const value = nameInput.value.trim();
  if (value === '') {
    message.textContent = 'Введите имя';
  } else {
    message.textContent = 'Спасибо, ' + value + '! Ждём вас на тренировке.';
  }
});
`
    })
  });
})();
