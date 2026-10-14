/* Занятие 27: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2701: t => ({
      html: t.html, css: t.css,
      js: `// Чек в кафе
const coffeePrice = 150;
const bunPrice = 60;
let count = 2;

const total = (coffeePrice + bunPrice) * count;

console.log('Итого: ' + total + ' руб.');
`
    }),
    k2702: t => ({
      html: t.html, css: t.css,
      js: `// Скрипт считает, сколько студентов пришло на пару.
const group = 'ИСП-11';
let students = 25;
let absent = 3;
let present = students - absent;
let withGuests = students + 2;

console.log('Группа ' + group);
console.log('Пришло: ' + present + ' человек');

function checkLesson() {
  if (present === 0) {
    console.log('Пара отменяется');
  } else {
    console.log('Пара состоится');
  }
}

checkLesson();
`
    }),
    k2703: t => ({
      html: t.html, css: t.css,
      js: `// Баллы за тест (из 100)
const scores = [95, 78, 61, 40, 88];

function getGrade(score) {
  if (score >= 90) {
    return 5;
  } else if (score >= 75) {
    return 4;
  } else if (score >= 60) {
    return 3;
  } else {
    return 2;
  }
}

let sum = 0;
for (const score of scores) {
  console.log(score + ' баллов — оценка ' + getGrade(score));
  sum = sum + score;
}

const average = sum / scores.length;
console.log('Средний балл: ' + average);
`
    })
  });
})();
