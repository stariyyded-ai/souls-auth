/* Занятие 11. Практическая работа №3. Создание формы на HTML-странице */
(() => {
  const { BASE, rgb } = window.COURSE_KIT;
  // Подпись поля: label for=id или label, внутри которого поле
  const labelOf = (h, el) => el && ((el.id && h.doc.querySelector(`label[for="${el.id}"]`)) || el.closest('label'));
  window.COURSE_TASKS.push(
    {
      id: 'k1101', lesson: 'mdk-11', module: 'mdk1', mech: 'build',
      title: 'Форма записи на курс', level: 'Среднее', minutes: 35, points: 150,
      story: 'Колледж открывает вечерние курсы для всех желающих. Администратор устал записывать людей по телефону и просит форму на сайт.',
      goal: 'Соберите форму form (action="/enroll", method="post"). Группа fieldset «Контактные данные»: имя — type="text" name="name", почта — type="email" name="email" (обе обязательные), телефон — type="tel" name="phone" с pattern="\\+7[0-9]{10}" и placeholder. Группа fieldset «Курс»: select name="course" (обязательный, от 3 пунктов, у каждого value, первый — подсказка с value=""); вложенный fieldset с legend «Формат занятий» и двумя переключателями name="format" со значениями offline и online (выбор обязателен); дата type="date" name="start" с min; textarea name="comment". После групп — обязательный флажок name="agree" (согласие на обработку данных) и кнопка button type="submit" «Записаться на курс». Каждое поле подписано через label. У обязательных полей в подписи есть звёздочка *, у группы переключателей — в legend.',
      hints: [
        'Начните с каркаса: form → fieldset «Контактные данные» → fieldset «Курс» → флажок → кнопка. Поля пишите, когда каркас готов.',
        'Обязательное поле: <label for="name">Имя *</label> <input type="text" id="name" name="name" required>.',
        'Формат — группа внутри группы: <fieldset><legend>Формат занятий *</legend> два radio с name="format" и required у первого </fieldset>.',
        'Флажок и кнопка — после второго </fieldset>, но до </form>: <input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен на обработку данных *</label>.'
      ],
      html: `<h1>Запись на вечерние курсы</h1>
<p>Поля со звёздочкой * обязательны. Мы пришлём подтверждение на почту.</p>
<!-- Здесь будет форма. Сначала каркас: form, два fieldset, флажок, кнопка -->
`,
      css: `${BASE}
h1 { color: #1f4e79; }
fieldset { margin-bottom: 16px; }
legend { font-weight: bold; }`,
      tests: [
        { name: 'Форма с action="/enroll" и method="post"', check: h => { const f = h.$('form'); return !!f && f.getAttribute('action') === '/enroll' && (f.getAttribute('method') || '').toLowerCase() === 'post' || (f ? 'проверьте action и method' : 'нет form'); } },
        { name: 'Две группы: «Контактные данные» и «Курс»', check: h => { const l = h.$$('form > fieldset > legend').map(e => e.textContent.trim()); return l.length === 2 && /контактные данные/i.test(l[0]) && /^курс/i.test(l[1]) || `группы верхнего уровня: ${l.join(', ') || 'нет'}`; } },
        { name: 'Имя, почта, телефон — в первой группе, с правильными типами', check: h => { const fs = h.$('form > fieldset'); if (!fs) return 'нет группы'; const ok = fs.querySelector('input[type="text"][name="name"]') && fs.querySelector('input[type="email"][name="email"]') && fs.querySelector('input[type="tel"][name="phone"]'); return !!ok || 'нужны text name="name", email name="email", tel name="phone"'; } },
        { name: 'Имя и почта обязательные, телефон проверяется шаблоном', check: h => { if (!h.$('[name="name"]')?.required || !h.$('[name="email"]')?.required) return 'имя и почта — required'; const p = h.$('[name="phone"]'), pat = p?.getAttribute('pattern'); if (!pat) return 'у телефона нет pattern'; let re; try { re = new RegExp('^(?:' + pat + ')$', 'v'); } catch (e) { return 'ошибка в pattern'; } return re.test('+79001234567') && !re.test('89001234567') && !!p.getAttribute('placeholder') || 'pattern для +7 и 10 цифр и placeholder с примером'; } },
        { name: 'Курс: обязательный select name="course", от 3 пунктов с value', check: h => { const s = h.$('form > fieldset:nth-of-type(2) select[name="course"]'); if (!s) return 'нет select name="course" во второй группе'; const o = [...s.options]; if (!s.required) return 'select должен быть required'; if (o.length < 3 || !o.every(e => e.hasAttribute('value'))) return 'от 3 пунктов, у каждого value'; return o[0].value === '' || 'первый пункт — подсказка с value=""'; } },
        { name: 'Формат: вложенный fieldset с legend и переключателями offline, online', check: h => { const fs = h.$('form fieldset fieldset'); if (!fs) return 'нет вложенного fieldset'; if (!/формат/i.test(fs.querySelector('legend')?.textContent || '')) return 'legend вложенной группы — «Формат занятий»'; const r = [...fs.querySelectorAll('input[type="radio"]')]; if (r.map(e => e.name + '=' + e.value).join(' ') !== 'format=offline format=online') return 'два radio name="format" со значениями offline и online'; return r.some(e => e.required) || 'выбор формата обязателен: required'; } },
        { name: 'Дата name="start" с min и комментарий textarea name="comment"', check: h => { const d = h.$('input[type="date"][name="start"]'); if (!d || !d.getAttribute('min')) return 'нужен input type="date" name="start" с min'; return !!h.$('textarea[name="comment"]') || 'нет textarea name="comment"'; } },
        { name: 'Обязательное согласие и кнопка «Записаться на курс» после групп', check: h => { const c = h.$('input[type="checkbox"][name="agree"]'), b = h.$('form button'); if (!c || !c.required) return 'нужен флажок name="agree" с required'; if (c.closest('fieldset')) return 'флажок — после групп'; if (!b || b.getAttribute('type') !== 'submit' || !/записаться на курс/i.test(b.textContent)) return 'нужна кнопка button type="submit" «Записаться на курс»'; if (b.closest('fieldset')) return 'кнопка — вне fieldset'; return h.before(c, b) || 'кнопка — после флажка'; } },
        { name: 'Все поля подписаны через label', check: h => { const bad = h.$$('form input, form select, form textarea').filter(e => !labelOf(h, e)); return !bad.length || `без подписи: ${bad.map(e => e.name || e.type).join(', ')}`; } },
        { name: 'У обязательных полей в подписи звёздочка *', check: h => { const bad = h.$$('form [required]').filter(e => e.type !== 'radio' && !/\*/.test(labelOf(h, e)?.textContent || '')).map(e => e.name); const leg = h.$('form fieldset fieldset legend'); if (leg && !/\*/.test(leg.textContent)) bad.push('формат (в legend)'); return !bad.length || `нет звёздочки: ${bad.join(', ')}`; } }
      ]
    },
    {
      id: 'k1102', lesson: 'mdk-11', module: 'mdk1', mech: 'a11y',
      title: 'Регистрация на олимпиаду', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма регистрации на олимпиаду по информатике выглядит прилично, но участник с программой экранного чтения не смог в ней зарегистрироваться: он слышал только «поле ввода, поле ввода».',
      goal: 'Исправьте форму. У полей ФИО, почты и пароля есть подписи label, связанные через for и id; в подписях звёздочка: «ФИО *», «Почта *», «Пароль *». Эти три поля обязательные (required). Пароль скрыт: type="password", и не короче 8 символов: minlength="8". Переключатели курса собраны в fieldset с legend «Курс *», а лишний абзац «Курс:» удалён; выбор курса обязателен. Текст кнопки — «Зарегистрироваться». Имена name не меняйте.',
      hints: [
        'placeholder — не подпись. Перед каждым полем добавьте <label for="…">, а полю — такой же id.',
        'Пароль: <input type="password" id="password" name="password" minlength="8" required>.',
        'Замените <p>Курс:</p> и абзац с переключателями на <fieldset><legend>Курс *</legend> … </fieldset>. Первому переключателю — required.',
        'Кнопка «ОК» ничего не объясняет: <button type="submit">Зарегистрироваться</button>.'
      ],
      html: `<h1>Олимпиада по информатике</h1>
<form action="/olymp" method="post">
  <p><input type="text" name="name" placeholder="ФИО"></p>
  <p><input type="email" name="email" placeholder="Почта"></p>
  <p><input type="text" name="password" placeholder="Пароль"></p>
  <p>Курс:</p>
  <p>
    <input type="radio" id="c1" name="year" value="1"> <label for="c1">1 курс</label>
    <input type="radio" id="c2" name="year" value="2"> <label for="c2">2 курс</label>
    <input type="radio" id="c3" name="year" value="3"> <label for="c3">3 курс</label>
  </p>
  <p><button type="submit">ОК</button></p>
</form>`,
      css: `${BASE}
h1 { color: #5a2d82; }
form { max-width: 480px; }`,
      tests: [
        { name: 'ФИО, почта и пароль подписаны через label for', check: h => { const bad = ['name', 'email', 'password'].filter(n => { const e = h.$(`[name="${n}"]`); return !(e && e.id && h.$(`label[for="${e.id}"]`)); }); return !bad.length || `без подписи: ${bad.join(', ')}`; } },
        { name: 'В подписях звёздочка: «ФИО *», «Почта *», «Пароль *»', check: h => { const t = ['name', 'email', 'password'].map(n => { const e = h.$(`[name="${n}"]`); return e && e.id ? (h.$(`label[for="${e.id}"]`)?.textContent || '') : ''; }); return t.every(x => /\*/.test(x)) && /фио/i.test(t[0]) && /почта/i.test(t[1]) && /пароль/i.test(t[2]) || `подписи: ${t.map(x => `«${x.trim()}»`).join(', ')}`; } },
        { name: 'ФИО, почта и пароль обязательные', check: h => ['name', 'email', 'password'].every(n => h.$(`[name="${n}"]`)?.required) || 'нужен required у трёх полей' },
        { name: 'Пароль скрыт и не короче 8 символов', check: h => { const p = h.$('[name="password"]'); return p?.type === 'password' && p.getAttribute('minlength') === '8' || `тип: ${p?.type}, minlength: ${p?.getAttribute('minlength') || 'нет'}`; } },
        { name: 'Переключатели в fieldset с legend «Курс *», выбор обязателен', check: h => { const r = h.$$('input[type="radio"]'); const fs = r[0]?.closest('fieldset'); if (!fs || !r.every(e => e.closest('fieldset') === fs)) return 'все переключатели — внутри одного fieldset'; const l = fs.querySelector('legend')?.textContent || ''; if (!/курс/i.test(l) || !/\*/.test(l)) return `legend: «${l.trim()}»`; return r.some(e => e.required) || 'нужен required у переключателя'; } },
        { name: 'Лишнего абзаца «Курс:» нет', check: h => !h.$$('p').some(p => /^курс:?$/i.test(p.textContent.trim())) || 'удалите <p>Курс:</p>' },
        { name: 'Кнопка «Зарегистрироваться»', check: h => /^зарегистрироваться$/i.test(h.text('form button')) || `сейчас: «${h.text('form button')}»` }
      ]
    },
    {
      id: 'k1103', lesson: 'mdk-11', module: 'mdk1', mech: 'build',
      title: 'Оформление формы по образцу', level: 'Среднее', minutes: 25, points: 150,
      story: 'Форма записи готова и работает, но выглядит как в 1995 году. Дизайнер прислал описание стилей — осталось перенести их в CSS.',
      goal: 'HTML не меняйте, работайте во вкладке CSS. Правило для label — образец. Допишите ещё четыре правила. 1) input, select, textarea: padding 8px, border 1px solid #767676, border-radius 4px, font-size 16px, margin-bottom 16px. 2) fieldset: border 1px solid #c4c4c4, border-radius 8px, padding 16px, margin-bottom 20px. 3) legend: font-weight bold, color #1f4e79. 4) button: background-color #1f4e79, color #ffffff, padding 12px 24px, border 0, border-radius 4px, font-size 16px.',
      hints: [
        'Посмотрите на образец label { … }: селектор, фигурные скобки, внутри «свойство: значение;».',
        'Несколько селекторов через запятую: input, select, textarea { padding: 8px; … }.',
        'Рамка пишется одним свойством из трёх частей: border: 1px solid #767676;',
        'Кнопка: button { background-color: #1f4e79; color: #ffffff; padding: 12px 24px; border: 0; border-radius: 4px; font-size: 16px; }'
      ],
      html: `<h1>Запись на вечерние курсы</h1>
<form action="/enroll" method="post">
  <fieldset>
    <legend>Контактные данные</legend>
    <label for="name">Имя *</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Почта *</label>
    <input type="email" id="email" name="email" required>
  </fieldset>
  <fieldset>
    <legend>Курс</legend>
    <label for="course">Курс *</label>
    <select id="course" name="course" required>
      <option value="">Выберите курс</option>
      <option value="pc">Компьютерная грамотность</option>
      <option value="web">Основы веб-дизайна</option>
      <option value="photo">Фотография на телефон</option>
    </select>
    <label for="comment">Комментарий</label>
    <textarea id="comment" name="comment" rows="3" cols="30"></textarea>
  </fieldset>
  <label><input type="checkbox" name="agree" required> Согласен на обработку данных *</label>
  <p><button type="submit">Записаться на курс</button></p>
</form>`,
      css: `${BASE}
h1 { color: #1f4e79; }

/* Образец: каждая подпись на своей строке, небольшой отступ до поля */
label {
  display: block;
  margin-bottom: 4px;
}

/* 1. Поля input, select, textarea: padding 8px, рамка 1px solid #767676,
      скругление 4px, шрифт 16px, отступ снизу 16px */

/* 2. Группы fieldset: рамка 1px solid #c4c4c4, скругление 8px,
      padding 16px, отступ снизу 20px */

/* 3. Названия групп legend: жирные, цвет #1f4e79 */

/* 4. Кнопка button: фон #1f4e79, текст #ffffff, padding 12px 24px,
      без рамки, скругление 4px, шрифт 16px */
`,
      tests: [
        { name: 'Подписи на своей строке (образец не сломан)', check: h => h.cs('label[for="name"]', 'display') === 'block' || 'label должен остаться display: block' },
        { name: 'Поля: padding 8px, скругление 4px, шрифт 16px, отступ снизу 16px', check: h => { const bad = ['#name', '#course', '#comment'].filter(s => !(h.px(s, 'padding-top') === 8 && h.px(s, 'padding-left') === 8 && h.px(s, 'border-top-left-radius') === 4 && h.px(s, 'font-size') === 16 && h.px(s, 'margin-bottom') === 16)); return !bad.length || `не подходит: ${bad.map(s => ({ '#name': 'input', '#course': 'select', '#comment': 'textarea' })[s]).join(', ')} (padding ${h.px(bad[0], 'padding-top')}px, шрифт ${h.px(bad[0], 'font-size')}px)`; } },
        { name: 'Рамка полей: 1px solid #767676', check: h => ['#name', '#course', '#comment'].every(s => h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-style') === 'solid' && h.cs(s, 'border-top-color') === rgb('#767676')) || `сейчас у input: ${h.cs('#name', 'border-top-width')} ${h.cs('#name', 'border-top-style')} ${h.cs('#name', 'border-top-color')}` },
        { name: 'Группы: рамка 1px solid #c4c4c4, скругление 8px, padding 16px, отступ 20px', check: h => { const s = 'fieldset'; return h.cs(s, 'border-top-color') === rgb('#c4c4c4') && h.px(s, 'border-top-width') === 1 && h.cs(s, 'border-top-style') === 'solid' && h.px(s, 'border-top-left-radius') === 8 && h.px(s, 'padding-top') === 16 && h.px(s, 'padding-left') === 16 && h.px(s, 'margin-bottom') === 20 || `сейчас: рамка ${h.cs(s, 'border-top-width')} ${h.cs(s, 'border-top-style')} ${h.cs(s, 'border-top-color')}, padding ${h.cs(s, 'padding-top')}`; } },
        { name: 'legend: жирный, цвет #1f4e79', check: h => +h.cs('legend', 'font-weight') >= 700 && h.cs('legend', 'color') === rgb('#1f4e79') || `сейчас: ${h.cs('legend', 'font-weight')}, ${h.cs('legend', 'color')}` },
        { name: 'Кнопка: фон #1f4e79, белый текст', check: h => h.cs('button', 'background-color') === rgb('#1f4e79') && h.cs('button', 'color') === rgb('#ffffff') || `сейчас: фон ${h.cs('button', 'background-color')}, текст ${h.cs('button', 'color')}` },
        { name: 'Кнопка: padding 12px 24px, без рамки, скругление 4px, шрифт 16px', check: h => h.px('button', 'padding-top') === 12 && h.px('button', 'padding-left') === 24 && h.px('button', 'border-top-width') === 0 && h.px('button', 'border-top-left-radius') === 4 && h.px('button', 'font-size') === 16 || `сейчас: padding ${h.cs('button', 'padding')}, рамка ${h.cs('button', 'border-top-width')}, шрифт ${h.cs('button', 'font-size')}` }
      ]
    }
  );
})();
