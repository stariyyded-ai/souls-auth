/* Занятие 10. Формы */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Поле подписано: label for=id или поле внутри label
  const labelled = (h, el) => !!el && ((el.id && !!h.doc.querySelector(`label[for="${el.id}"]`)) || !!el.closest('label'));
  window.COURSE_TASKS.push(
    {
      id: 'k1001', lesson: 'mdk-10', module: 'mdk1', mech: 'build',
      title: 'Обратная связь', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Кафе «Пенка» у колледжа хочет знать, что студенты думают о новом меню. Нужна простая форма отзыва.',
      goal: 'Соберите форму form с action="/feedback" и method="post". Внутри три подписанных поля (label for + id): «Имя» — input type="text" с name="name", «Почта» — input type="email" с name="email», «Отзыв» — textarea с name="message". В конце — кнопка button type="submit" с текстом «Отправить».',
      hints: [
        'Каркас: <form action="/feedback" method="post"> … </form>. Всё остальное — внутри.',
        'Каждое поле — пара: <label for="name">Имя</label> и <input type="text" id="name" name="name">.',
        'Отзыв — парный тег: <textarea id="message" name="message" rows="4"></textarea>.',
        'Кнопка: <button type="submit">Отправить</button>.'
      ],
      html: `<h1>Отзыв о кафе «Пенка»</h1>
<p>Расскажите, что понравилось, а что нет. Мы читаем каждый отзыв.</p>
<!-- Здесь будет форма -->
`,
      css: `${BASE}
h1 { color: #6b3e1f; }
label { display: block; margin-top: 12px; }`,
      tests: [
        { name: 'Форма с action="/feedback" и method="post"', check: h => { const f = h.$('form'); if (!f) return 'нет form'; return f.getAttribute('action') === '/feedback' && (f.getAttribute('method') || '').toLowerCase() === 'post' || `action: «${f.getAttribute('action') || ''}», method: «${f.getAttribute('method') || ''}»`; } },
        { name: 'Поле имени: input type="text" name="name"', check: h => !!h.$('form input[type="text"][name="name"]') || 'нет input type="text" с name="name" внутри формы' },
        { name: 'Поле почты: input type="email" name="email"', check: h => !!h.$('form input[type="email"][name="email"]') || 'нет input type="email" с name="email"' },
        { name: 'Отзыв: textarea name="message"', check: h => !!h.$('form textarea[name="message"]') || 'нет textarea с name="message"' },
        { name: 'Все три поля подписаны через label', check: h => { const f = h.$$('form input, form textarea'); return f.length >= 3 && f.every(e => labelled(h, e)) || 'у каждого поля нужен label с for, равным id поля'; } },
        { name: 'Кнопка button type="submit" «Отправить» в конце формы', check: h => { const b = h.$('form button'); if (!b) return 'нет button внутри формы'; if (b.getAttribute('type') !== 'submit') return 'нужен type="submit"'; if (!/отправить/i.test(b.textContent)) return 'текст кнопки — «Отправить»'; return h.before('form textarea', b) || 'кнопка должна быть после полей'; } }
      ]
    },
    {
      id: 'k1002', lesson: 'mdk-10', module: 'mdk1', mech: 'fix',
      title: 'Почините анкету', level: 'Среднее', minutes: 20, points: 150,
      story: 'Анкета первокурсника собирает личные данные, но сделана наспех: подписи не работают, почту можно ввести без @, а форму обучения можно выбрать сразу всю.',
      goal: 'Исправьте форму. Метод отправки — post (данные личные). Почта — type="email", телефон — type="tel", возраст — type="number" с min="14" и max="99". У каждого поля есть подпись label, связанная с ним через for и id (проверьте и телефон: for и id должны совпадать). Переключатели «Очная» и «Заочная» — одна группа: name="study". Флажок «Получать новости» подписан. Вместо div — настоящая кнопка button type="submit" «Отправить анкету». Атрибуты name у полей не меняйте (кроме переключателей).',
      hints: [
        'Начните с form: method="post". Потом пройдите по полям сверху вниз.',
        'Подпись к имени: оберните слово «Имя» в <label for="name"> и дайте полю id="name". У телефона for="phone", значит и id="phone".',
        'Переключатели: у обоих name="study", а value разные — "day" и "extramural".',
        'Флажок: <input type="checkbox" id="news" name="news"> <label for="news">Получать новости</label>. Кнопка: <button type="submit">Отправить анкету</button>.'
      ],
      html: `<h1>Анкета первокурсника</h1>
<form action="/anketa" method="get">
  <p>Имя <input type="text" name="name"></p>
  <p><label>Почта</label> <input type="text" name="email"></p>
  <p><label for="phone">Телефон</label> <input type="text" id="tel" name="phone"></p>
  <p><label for="age">Возраст</label> <input type="text" id="age" name="age"></p>
  <p>Форма обучения:</p>
  <p>
    <input type="radio" id="day" name="study1" value="day"> <label for="day">Очная</label>
    <input type="radio" id="extramural" name="study2" value="extramural"> <label for="extramural">Заочная</label>
  </p>
  <p><input type="checkbox" name="news"> Получать новости</p>
  <div>Отправить анкету</div>
</form>`,
      css: `${BASE}
h1 { color: #1f4e79; }
form { max-width: 480px; }`,
      tests: [
        { name: 'Форма отправляется методом post', check: h => (h.$('form')?.getAttribute('method') || '').toLowerCase() === 'post' || 'method должен быть post' },
        { name: 'Почта — type="email", телефон — type="tel"', check: h => { const e = h.$('[name="email"]'), p = h.$('[name="phone"]'); return e?.type === 'email' && p?.type === 'tel' || `почта: ${e?.type || 'нет поля'}, телефон: ${p?.type || 'нет поля'}`; } },
        { name: 'Возраст — type="number" от 14 до 99', check: h => { const a = h.$('[name="age"]'); if (!a) return 'нет поля age'; if (a.type !== 'number') return `тип: ${a.type}`; return a.getAttribute('min') === '14' && a.getAttribute('max') === '99' || 'нужны min="14" и max="99"'; } },
        { name: 'Имя, почта, телефон и возраст подписаны через label', check: h => { const bad = ['name', 'email', 'phone', 'age'].filter(n => !labelled(h, h.$(`[name="${n}"]`))); return !bad.length || `без связанной подписи: ${bad.join(', ')}`; } },
        { name: 'Переключатели — одна группа name="study" с разными value', check: h => { const r = h.$$('input[type="radio"]'); return r.length === 2 && r.every(e => e.name === 'study') && r[0].value !== r[1].value || `name у переключателей: ${r.map(e => e.name).join(', ')}`; } },
        { name: 'Флажок «Получать новости» подписан', check: h => { const c = h.$('input[type="checkbox"]'); if (!c) return 'нет флажка'; return labelled(h, c) || 'нет связанной подписи у флажка'; } },
        { name: 'Кнопка button type="submit" «Отправить анкету»', check: h => { const b = h.$('form button'); return !!b && b.getAttribute('type') === 'submit' && /отправить анкету/i.test(b.textContent) || (b ? 'нужен type="submit" и текст «Отправить анкету»' : 'нет button в форме'); } },
        { name: 'Кнопки из div нет', check: h => !h.$$('form div').some(d => /отправить/i.test(d.textContent)) || 'уберите div «Отправить анкету»' }
      ]
    },
    {
      id: 'k1003', lesson: 'mdk-10', module: 'mdk1', mech: 'build',
      title: 'Запись в спортзал', level: 'Среднее', minutes: 25, points: 150,
      story: 'Спортзал колледжа открыл запись на пробную тренировку. Администратор просит форму вместо очереди у стойки.',
      goal: 'Соберите форму form (action="/gym", method="post") из двух групп fieldset с legend. Группа «Ваши данные»: имя — input type="text" name="name" required; телефон — input type="tel" name="phone" required с pattern="\\+7[0-9]{10}" и placeholder="+79001234567". Группа «Тренировка»: время — три переключателя name="time" со значениями morning, day, evening; тренер — select name="coach" минимум с тремя пунктами option, у каждого есть value (первый — подсказка с value=""); дата — input type="date" name="date" с атрибутом min; число человек — input type="number" name="people" с min="1" max="5". После групп — флажок name="agree" required с подписью «Согласен с правилами зала» и кнопка button type="submit" «Записаться». Все поля подписаны через label.',
      hints: [
        'Сначала каркас: form → fieldset с legend «Ваши данные» → fieldset с legend «Тренировка» → флажок → кнопка.',
        'Телефон: <input type="tel" id="phone" name="phone" required pattern="\\+7[0-9]{10}" placeholder="+79001234567">.',
        'Переключатели: три пары input type="radio" name="time" с value="morning", "day", "evening" и подписями «Утро», «День», «Вечер».',
        'Тренер: <select id="coach" name="coach"><option value="">Выберите тренера</option><option value="ivanov">Иванов</option>…</select>. Дата: <input type="date" id="date" name="date" min="2026-09-01">.'
      ],
      html: `<h1>Пробная тренировка</h1>
<p>Первая тренировка бесплатная. Поля со звёздочкой обязательны.</p>
<!-- Здесь будет форма записи -->
`,
      css: `${BASE}
h1 { color: #1d5c3a; }
fieldset { margin-bottom: 16px; border: 1px solid #8aa596; }
legend { font-weight: bold; color: #1d5c3a; }`,
      tests: [
        { name: 'Форма с action="/gym" и method="post"', check: h => { const f = h.$('form'); return !!f && f.getAttribute('action') === '/gym' && (f.getAttribute('method') || '').toLowerCase() === 'post' || (f ? 'проверьте action и method' : 'нет form'); } },
        { name: 'Две группы fieldset с legend «Ваши данные» и «Тренировка»', check: h => { const l = h.$$('form fieldset > legend').map(e => e.textContent.trim()); return h.count('form fieldset') === 2 && /ваши данные/i.test(l[0] || '') && /тренировка/i.test(l[1] || '') || `legend: ${l.join(', ') || 'нет'}`; } },
        { name: 'Имя и телефон в первой группе, обязательные', check: h => { const fs = h.$$('fieldset')[0]; if (!fs) return 'нет первой группы'; const n = fs.querySelector('input[type="text"][name="name"]'), p = fs.querySelector('input[type="tel"][name="phone"]'); if (!n || !p) return 'нужны input type="text" name="name" и input type="tel" name="phone"'; return n.required && p.required || 'имя и телефон — required'; } },
        { name: 'Телефон проверяется шаблоном +7 и 10 цифр', check: h => { const p = h.$('[name="phone"]'); const pat = p?.getAttribute('pattern'); if (!pat) return 'нет pattern'; let re; try { re = new RegExp('^(?:' + pat + ')$', 'v'); } catch (e) { return 'ошибка в pattern'; } if (!re.test('+79001234567') || re.test('89001234567') || re.test('+7900123')) return 'pattern должен пропускать только +7 и 10 цифр'; return !!p.getAttribute('placeholder') || 'нет placeholder с примером'; } },
        { name: 'Время: три переключателя name="time" — morning, day, evening', check: h => { const v = h.$$('input[type="radio"][name="time"]').map(e => e.value).join(' '); return v === 'morning day evening' || `сейчас value: ${v || 'нет переключателей'}`; } },
        { name: 'Тренер: select name="coach", от 3 пунктов, у всех value', check: h => { const s = h.$('select[name="coach"]'); if (!s) return 'нет select name="coach"'; const o = [...s.options]; if (o.length < 3) return `пунктов: ${o.length}`; if (!o.every(e => e.hasAttribute('value'))) return 'у каждого option нужен value'; return o[0].value === '' || 'первый пункт — подсказка с value=""'; } },
        { name: 'Дата с min и число человек от 1 до 5', check: h => { const d = h.$('input[type="date"][name="date"]'), n = h.$('input[type="number"][name="people"]'); if (!d || !d.getAttribute('min')) return 'нужен input type="date" name="date" с min'; return !!n && n.getAttribute('min') === '1' && n.getAttribute('max') === '5' || 'нужен input type="number" name="people" min="1" max="5"'; } },
        { name: 'Обязательный флажок согласия после групп', check: h => { const c = h.$('input[type="checkbox"][name="agree"]'); if (!c) return 'нет флажка name="agree"'; if (!c.required) return 'флажок должен быть required'; if (c.closest('fieldset')) return 'флажок — после групп, вне fieldset'; return labelled(h, c) || 'у флажка нет подписи'; } },
        { name: 'Все поля формы подписаны через label', check: h => { const bad = h.$$('form input, form select, form textarea').filter(e => !labelled(h, e)); return !bad.length || `без подписи: ${bad.map(e => e.name || e.type).join(', ')}`; } },
        { name: 'Кнопка button type="submit" «Записаться» в конце', check: h => { const b = h.$('form button'); return !!b && b.getAttribute('type') === 'submit' && /записаться/i.test(b.textContent) && h.before('[name="agree"]', b) || 'нужна кнопка «Записаться» с type="submit" после флажка'; } }
      ]
    }
  );
})();
