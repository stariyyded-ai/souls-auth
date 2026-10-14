/* Занятие 28. JavaScript и страница: DOM и события */
(() => {
  const { BASE } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'k2801', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Счётчик стаканов воды', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Спортзал колледжа просит простую страницу-напоминалку: сколько стаканов воды выпито за день. Разметка и стили готовы, кнопки пока не работают.',
      goal: 'В script.js сделайте так: кнопка #plus увеличивает число в span#count на 1, кнопка #reset возвращает 0. Когда число дошло до 8, покажите абзац #done (уберите hidden). После сброса абзац #done снова скрыт.',
      hints: [
        'Найдите элементы: const plus = document.querySelector(\'#plus\'); так же reset, countEl (для #count) и done. И заведите let count = 0;',
        'Обработчик: plus.addEventListener(\'click\', function () { count = count + 1; countEl.textContent = count; });',
        'Показать абзац, когда набрали 8: if (count >= 8) { done.hidden = false; }',
        'В обработчике #reset: count = 0; обновите текст и спрячьте абзац: done.hidden = true;'
      ],
      html: `<section class="water">
  <h1>Вода за день</h1>
  <p class="counter">Выпито стаканов: <span id="count">0</span> из 8</p>
  <div class="buttons">
    <button id="plus" type="button">+1 стакан</button>
    <button id="reset" type="button">Сбросить</button>
  </div>
  <p id="done" class="done" hidden>Норма на день выполнена!</p>
</section>`,
      css: `${BASE}
.water { max-width: 420px; margin: 0 auto; text-align: center; }
.counter { font-size: 20px; }
#count { font-size: 40px; font-weight: 700; color: #0b5c8a; }
.buttons { display: flex; justify-content: center; gap: 12px; }
button { padding: 10px 16px; border: 2px solid #0b5c8a; border-radius: 8px; background: #ffffff; color: #0b5c8a; font: inherit; cursor: pointer; }
button:hover { background: #e6f2f9; }
.done { color: #1e6b34; font-weight: 700; }`,
      js: `// Счётчик стаканов воды
// 1. Найдите кнопки #plus и #reset, span #count и абзац #done

// 2. Переменная для счётчика

// 3. Щелчок по #plus: +1, показать число, при 8 и больше — показать #done

// 4. Щелчок по #reset: 0, показать число, спрятать #done
`,
      tests: [
        { name: 'Три щелчка по «+1 стакан» — на странице 3', js: true, check: h => { h.click('#plus'); h.click('#plus'); h.click('#plus'); return h.text('#count') === '3' || `сейчас: ${h.text('#count')}`; } },
        { name: '«Сбросить» возвращает 0', js: true, check: h => { h.click('#plus'); h.click('#plus'); h.click('#reset'); return h.text('#count') === '0' || `после сброса: ${h.text('#count')}`; } },
        { name: 'До 8 стаканов абзац #done скрыт, на 8-м — появляется', js: true, check: h => {
          for (let i = 0; i < 7; i++) h.click('#plus');
          if (h.visible('#done')) return 'абзац виден уже после 7 стаканов';
          h.click('#plus');
          return h.visible('#done') || 'после 8 стаканов абзац не появился';
        } },
        { name: 'После сброса #done снова скрыт', js: true, check: h => { for (let i = 0; i < 8; i++) h.click('#plus'); h.click('#reset'); return !h.visible('#done') || 'абзац остался на экране'; } },
        { name: 'Кнопки подключены через addEventListener', check: h => /addEventListener\(\s*['"]click['"]/.test(h.js) || 'нужен addEventListener(\'click\', …)' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click('#plus'); h.click('#reset'); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2802', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Выбор объёма напитка', level: 'Среднее', minutes: 20, points: 150,
      story: 'В онлайн-заказе кофейни можно выбрать объём стакана. Выбранная кнопка закрашивается — за это отвечает класс selected в CSS. Осталось научить кнопки переключаться.',
      goal: 'При щелчке по любой кнопке .size класс selected должен остаться только у неё (у остальных — убраться), а в абзаце #choice появиться текст «Вы выбрали: » и надпись с этой кнопки, например «Вы выбрали: 0,25 л». Используйте querySelectorAll, цикл for…of и classList.',
      hints: [
        'Все кнопки сразу: const sizes = document.querySelectorAll(\'.size\'); и абзац const choice = document.querySelector(\'#choice\');',
        'Каждой кнопке — свой обработчик: for (const size of sizes) { size.addEventListener(\'click\', function () { … }); }',
        'Внутри обработчика сначала уберите класс у всех: for (const other of sizes) { other.classList.remove(\'selected\'); }',
        'Потом добавьте нажатой: size.classList.add(\'selected\'); и текст: choice.textContent = \'Вы выбрали: \' + size.textContent;'
      ],
      html: `<section class="order">
  <h1>Какой объём?</h1>
  <div class="sizes">
    <button class="size" type="button">0,25 л</button>
    <button class="size selected" type="button">0,4 л</button>
    <button class="size" type="button">0,5 л</button>
  </div>
  <p id="choice">Вы выбрали: 0,4 л</p>
</section>`,
      css: `${BASE}
.order { max-width: 420px; }
.sizes { display: flex; gap: 8px; }
.size { flex: 1; padding: 12px; border: 2px solid #8a3b12; border-radius: 8px; background: #ffffff; color: #8a3b12; font: inherit; cursor: pointer; }
.size:hover { background: #fff4e8; }
.size.selected { background: #8a3b12; color: #ffffff; }
#choice { font-weight: 700; }`,
      js: `// Выбор объёма
// 1. Найдите все кнопки .size и абзац #choice

// 2. Каждой кнопке — обработчик щелчка:
//    убрать selected у всех, добавить нажатой, обновить текст в #choice
`,
      tests: [
        { name: 'Щелчок по «0,25 л» — selected только у неё', js: true, check: h => { h.click(h.$$('.size')[0]); const s = h.$$('.size').map(b => b.classList.contains('selected')); return s.join() === 'true,false,false' || `selected: ${s.join(', ')}`; } },
        { name: 'Текст: «Вы выбрали: 0,25 л»', js: true, check: h => { h.click(h.$$('.size')[0]); return h.text('#choice') === 'Вы выбрали: 0,25 л' || `сейчас: «${h.text('#choice')}»`; } },
        { name: 'Потом щелчок по «0,5 л» — выбор переходит к ней', js: true, check: h => {
          h.click(h.$$('.size')[0]); h.click(h.$$('.size')[2]);
          const s = h.$$('.size').map(b => b.classList.contains('selected'));
          return s.join() === 'false,false,true' && h.text('#choice') === 'Вы выбрали: 0,5 л' || `selected: ${s.join(', ')}; текст: «${h.text('#choice')}»`;
        } },
        { name: 'Повторный щелчок не снимает выбор', js: true, check: h => { h.click(h.$$('.size')[1]); h.click(h.$$('.size')[1]); return h.$$('.size')[1].classList.contains('selected') || 'после второго щелчка класс пропал: нужен add, а не toggle'; } },
        { name: 'Используются querySelectorAll, for…of и classList', check: h => /querySelectorAll\(/.test(h.js) && /for\s*\(\s*(const|let)\s+\w+\s+of\s+/.test(h.js) && /classList\.(add|remove)/.test(h.js) || 'нужны querySelectorAll, for (… of …) и classList' },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.click(h.$$('.size')[0]); return !h.errors.length || h.errors[0]; } }
      ]
    },
    {
      id: 'k2803', lesson: 'mdk-28', module: 'mdk3', mech: 'build', title: 'Запись на тренировку', level: 'Среднее', minutes: 25, points: 150,
      story: 'Спортзал колледжа записывает на пробную тренировку через форму. Хочется, чтобы страница здоровалась с человеком, пока он вводит имя, и не перезагружалась при отправке.',
      goal: 'Пока человек вводит имя в поле #name, абзац #hello показывает «Здравствуйте, Имя!» (событие input). При отправке формы #signup отмените перезагрузку (preventDefault). Если имя пустое или из одних пробелов — в абзац #message напишите «Введите имя». Иначе — «Спасибо, Имя! Ждём вас на тренировке.» (имя без пробелов по краям).',
      hints: [
        'Найдите форму, поле и два абзаца: const form = document.querySelector(\'#signup\'); const nameInput = document.querySelector(\'#name\'); так же hello и message.',
        'Приветствие: nameInput.addEventListener(\'input\', function () { hello.textContent = \'Здравствуйте, \' + nameInput.value + \'!\'; });',
        'Отправка: form.addEventListener(\'submit\', function (event) { event.preventDefault(); … });',
        'Внутри: const value = nameInput.value.trim(); if (value === \'\') { message.textContent = \'Введите имя\'; } else { message.textContent = \'Спасибо, \' + value + \'! Ждём вас на тренировке.\'; }'
      ],
      html: `<form id="signup" class="signup">
  <h1>Пробная тренировка</h1>
  <label for="name">Ваше имя</label>
  <input id="name" name="name" type="text" autocomplete="given-name">
  <p id="hello" class="hello">Здравствуйте!</p>
  <button type="submit">Записаться</button>
</form>
<p id="message" class="message" role="status"></p>`,
      css: `${BASE}
.signup { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
label { font-weight: 700; }
input { padding: 10px; border: 1px solid #767676; border-radius: 6px; font: inherit; }
.hello { margin: 0; color: #555555; }
button { padding: 12px; border: 0; border-radius: 6px; background: #1e6b34; color: #ffffff; font: inherit; cursor: pointer; }
button:hover { background: #154d25; }
.message { font-weight: 700; }`,
      js: `// Запись на тренировку
// 1. Найдите форму #signup, поле #name, абзацы #hello и #message

// 2. Событие input у поля: «Здравствуйте, Имя!»

// 3. Событие submit у формы: preventDefault и проверка имени
`,
      tests: [
        { name: 'При вводе «Анна» — «Здравствуйте, Анна!»', js: true, check: h => { h.type('#name', 'Анна'); return h.text('#hello') === 'Здравствуйте, Анна!' || `сейчас: «${h.text('#hello')}»`; } },
        { name: 'Отправка формы не перезагружает страницу (preventDefault)', js: true, check: h => { h.type('#name', 'Анна'); return h.submit('#signup') === false || 'вызовите event.preventDefault() в обработчике submit'; } },
        { name: 'Пустое имя — «Введите имя»', js: true, check: h => { h.type('#name', ''); h.submit('#signup'); return h.text('#message') === 'Введите имя' || `сейчас: «${h.text('#message')}»`; } },
        { name: 'Имя из одних пробелов — тоже «Введите имя»', js: true, check: h => { h.type('#name', '   '); h.submit('#signup'); return h.text('#message') === 'Введите имя' || `сейчас: «${h.text('#message')}» — используйте trim()`; } },
        { name: '« Олег » — «Спасибо, Олег! Ждём вас на тренировке.»', js: true, check: h => { h.type('#name', ' Олег '); h.submit('#signup'); return h.text('#message') === 'Спасибо, Олег! Ждём вас на тренировке.' || `сейчас: «${h.text('#message')}»`; } },
        { name: 'Скрипт работает без ошибок', js: true, check: h => { h.type('#name', 'Анна'); h.submit('#signup'); return !h.errors.length || h.errors[0]; } }
      ]
    }
  );
})();
