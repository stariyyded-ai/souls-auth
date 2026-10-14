/* Занятие 27. Язык сценариев JavaScript: основы */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PAGE_CSS = `${BASE}
h1 { color: #8a3b12; }
code { background: #f3ece4; padding: 2px 4px; }`;
  window.COURSE_TASKS.push(
    {
      id: 'k2701', lesson: 'mdk-27', module: 'mdk3', mech: 'build', title: 'Чек в кафе', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'В кафе у колледжа сломалась касса. Бариста просит маленький скрипт: сколько стоят несколько наборов «кофе + булочка».',
      goal: 'Во вкладке script.js создайте константы coffeePrice = 150 и bunPrice = 60 (через const), переменную count = 2 (через let) и переменную total, которая считается по формуле (coffeePrice + bunPrice) * count — не пишите 420 руками. Выведите в консоль строку «Итого: 420 руб.» с помощью console.log, подставив total.',
      hints: [
        'Константа создаётся так: const coffeePrice = 150; Так же — bunPrice.',
        'Количество может меняться, поэтому let count = 2;',
        'Сумма: const total = (coffeePrice + bunPrice) * count; Скобки нужны, иначе умножится только булочка.',
        'Вывод: console.log(\'Итого: \' + total + \' руб.\'); или console.log(`Итого: ${total} руб.`);'
      ],
      html: `<h1>Чек в кафе</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Чек в кафе
// 1. Константы coffeePrice (150) и bunPrice (60)

// 2. Переменная count (2) — сколько наборов

// 3. total = (coffeePrice + bunPrice) * count

// 4. console.log: «Итого: 420 руб.»
`,
      tests: [
        { name: 'coffeePrice и bunPrice объявлены через const', check: h => /const\s+coffeePrice\s*=/.test(h.js) && /const\s+bunPrice\s*=/.test(h.js) || 'нужно const coffeePrice = … и const bunPrice = …' },
        { name: 'count объявлена через let', check: h => /let\s+count\s*=/.test(h.js) || 'нужно let count = 2;' },
        { name: 'coffeePrice = 150, bunPrice = 60, count = 2', js: true, check: h => h.get('coffeePrice') === 150 && h.get('bunPrice') === 60 && h.get('count') === 2 || `сейчас: ${h.get('coffeePrice')}, ${h.get('bunPrice')}, ${h.get('count')}` },
        { name: 'total считается формулой и равен 420', js: true, check: h => h.get('total') === 420 || `total = ${h.get('total')}` },
        { name: 'В формуле total есть coffeePrice, bunPrice и count', check: h => /total\s*=[^;\n]*coffeePrice[^;\n]*bunPrice[^;\n]*count|total\s*=[^;\n]*count[^;\n]*coffeePrice[^;\n]*bunPrice/.test(h.js) || 'посчитайте total из переменных, а не числом' },
        { name: 'В консоли «Итого: 420 руб.»', js: true, check: h => h.logs.some(l => /Итого:\s*420\s*руб\./.test(l)) || (h.logs.length ? `в консоли: ${h.logs[0]}` : 'в консоль ничего не выведено') },
        { name: 'Скрипт работает без ошибок', js: true, check: h => !h.errors.length || h.errors[0] }
      ]
    },
    {
      id: 'k2702', lesson: 'mdk-27', module: 'mdk3', mech: 'fix', title: 'Почините скрипт старосты', level: 'Лёгкое', minutes: 15, points: 120,
      story: 'Староста пишет скрипт для журнала: сколько человек пришло на пару и состоится ли она. Красных ошибок в консоли нет, но скрипт врёт: гостей считает странно, группу не называет, а итог пары вообще не печатает. Таких ошибок называют логическими — их ищут, выводя значения в консоль.',
      goal: 'Найдите и исправьте пять ошибок. Должно получиться: students — число 25 (не строка), present = 22, withGuests = 27, в консоли по порядку «Группа ИСП-11», «Пришло: 22 человек» и «Пара состоится». В условии сравнивайте через ===, функцию checkLesson вызовите после её объявления. Ошибок в консоли быть не должно.',
      hints: [
        'Почему withGuests получается «252»? Потому что \'25\' в кавычках — строка, и + склеивает. Уберите кавычки у числа.',
        'Сравните \'group\' и group: в кавычках — просто текст из пяти букв, без кавычек — значение переменной.',
        'В строке «Пришло: …» подставлена не та переменная. Пришедших хранит present.',
        'if (present = 0) не сравнивает, а кладёт в present ноль: нужно ===. И функция сама не запустится — допишите вызов checkLesson(); в конце.'
      ],
      html: `<h1>Журнал группы</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Скрипт считает, сколько студентов пришло на пару.
// В нём пять логических ошибок: консоль молчит, но результат неверный.
const group = 'ИСП-11';
let students = '25';
let absent = 3;
let present = students - absent;
let withGuests = students + 2;

console.log('Группа ' + 'group');
console.log('Пришло: ' + absent + ' человек');

function checkLesson() {
  if (present = 0) {
    console.log('Пара отменяется');
  } else {
    console.log('Пара состоится');
  }
}
`,
      tests: [
        { name: 'Скрипт выполняется без ошибок', js: true, check: h => !h.errors.length || h.errors[0] },
        { name: 'students — число 25', js: true, check: h => h.get('students') === 25 || `сейчас: ${JSON.stringify(h.get('students'))} (${typeof h.get('students')})` },
        { name: 'present = 22, withGuests = 27', js: true, check: h => h.get('present') === 22 && h.get('withGuests') === 27 || `present = ${JSON.stringify(h.get('present'))}, withGuests = ${JSON.stringify(h.get('withGuests'))}` },
        { name: 'В консоли «Группа ИСП-11», «Пришло: 22 человек», «Пара состоится»', js: true, check: h => h.logs.join('|') === 'Группа ИСП-11|Пришло: 22 человек|Пара состоится' || `в консоли: ${h.logs.join(' / ') || 'пусто'}` },
        { name: 'В условии сравнение через ===', check: h => /if\s*\(\s*present\s*===\s*0\s*\)|if\s*\(\s*0\s*===\s*present\s*\)/.test(h.js) || 'нужно if (present === 0)' },
        { name: 'Функция checkLesson вызвана', check: h => /^\s*checkLesson\(\s*\)\s*;?/m.test(h.js) || 'добавьте вызов checkLesson();' }
      ]
    },
    {
      id: 'k2703', lesson: 'mdk-27', module: 'mdk3', mech: 'build', title: 'Оценки за тест', level: 'Среднее', minutes: 25, points: 150,
      story: 'Преподаватель проверил тест и записал баллы. Переводить каждый балл в оценку вручную долго — пусть посчитает скрипт.',
      goal: 'Напишите функцию getGrade(score), которая возвращает число: 90 и больше → 5, от 75 до 89 → 4, от 60 до 74 → 3, меньше 60 → 2. Пройдите по массиву scores циклом for…of и для каждого результата выведите в консоль строку вида «78 баллов — оценка 4». Посчитайте средний балл в переменной average (сумма, делённая на scores.length) и выведите «Средний балл: …».',
      hints: [
        'Каркас функции: function getGrade(score) { … } Внутри — if / else if / else, в каждой ветке return с оценкой.',
        'Начните с самой высокой оценки: if (score >= 90) { return 5; } else if (score >= 75) { return 4; } …',
        'Цикл: for (const score of scores) { console.log(score + \' баллов — оценка \' + getGrade(score)); }',
        'Сумма: let sum = 0; и в цикле sum = sum + score; После цикла: const average = sum / scores.length;'
      ],
      html: `<h1>Оценки за тест</h1>
<p>Результат скрипта смотрите в консоли браузера: <code>F12</code>, вкладка Console.</p>`,
      css: PAGE_CSS,
      js: `// Баллы за тест (из 100)
const scores = [95, 78, 61, 40, 88];

// 1. Функция getGrade(score) возвращает оценку 2, 3, 4 или 5

// 2. Цикл for…of по scores: «78 баллов — оценка 4»

// 3. Средний балл average и вывод «Средний балл: …»
`,
      tests: [
        { name: 'getGrade — функция', js: true, check: h => typeof h.get('getGrade') === 'function' || 'нет функции getGrade' },
        { name: 'getGrade правильно ставит 5 и 4 (100, 90, 89, 75)', js: true, check: h => { const g = h.get('getGrade'); if (typeof g !== 'function') return 'нет функции getGrade'; const r = [100, 90, 89, 75].map(g); return r.join() === '5,5,4,4' || `получилось: ${r.join(', ')}`; } },
        { name: 'getGrade правильно ставит 3 и 2 (74, 60, 59, 0)', js: true, check: h => { const g = h.get('getGrade'); if (typeof g !== 'function') return 'нет функции getGrade'; const r = [74, 60, 59, 0].map(g); return r.join() === '3,3,2,2' || `получилось: ${r.join(', ')}`; } },
        { name: 'Используется цикл for…of по scores', check: h => /for\s*\(\s*(const|let)\s+\w+\s+of\s+scores\s*\)/.test(h.js) || 'нужен for (const score of scores)' },
        { name: 'Для каждого результата строка «… баллов — оценка …»', js: true, check: h => {
          const want = ['95 баллов — оценка 5', '78 баллов — оценка 4', '61 баллов — оценка 3', '40 баллов — оценка 2', '88 баллов — оценка 4'];
          const got = h.logs.filter(l => /оценка/.test(l));
          return want.every(w => got.some(l => l.replace(/\s+/g, ' ').trim() === w)) || `в консоли: ${got.slice(0, 2).join(' / ') || 'нет строк с оценками'}`;
        } },
        { name: 'average = 72.4 и выведен «Средний балл»', js: true, check: h => h.get('average') === 72.4 && h.logs.some(l => /Средний балл:\s*72\.4/.test(l)) || `average = ${h.get('average')}` },
        { name: 'Скрипт работает без ошибок', js: true, check: h => !h.errors.length || h.errors[0] }
      ]
    }
  );
})();
