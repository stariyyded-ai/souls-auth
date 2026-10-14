/* Занятие 25. CSS-фреймворки, LESS, шаблоны CMS, типовые решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const radius = (h, s) => h.px(s, 'border-top-left-radius');
  const PRIMARY = 'rgb(26, 86, 176)';
  window.COURSE_TASKS.push(
    {
      id: 'k2501', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Компилятор — это вы', level: 'Среднее', minutes: 20, points: 150,
      story: 'Коллега прислал стили карточки тарифа на LESS, но компилятора под рукой нет. Браузер LESS не понимает — переведите код в обычный CSS вручную.',
      goal: 'В комментарии в начале CSS — исходник на LESS. Напишите под ним обычный CSS, который получился бы после компиляции: подставьте значения переменных, разверните вложенность (&__title → .tariff__title, &:hover → .tariff__btn:hover), вставьте миксин .rounded() и посчитайте (@gap / 2). Нужны пять правил: .tariff, .tariff__title, .tariff__price, .tariff__btn, .tariff__btn:hover. Синтаксиса LESS (@переменных, вложенных правил) в CSS остаться не должно.',
      hints: [
        'Подставьте переменные: @primary — это #1a56b0, @primary-dark — #123d7d, @gap — 16px, @radius — 12px. Значит (@gap / 2) — 8px.',
        'Миксин .rounded() без параметра даёт border-radius: 12px (значение по умолчанию), а .rounded(8px) — border-radius: 8px.',
        'Каждое вложенное правило становится отдельным: .tariff { … } .tariff__title { … } и так далее. & заменяется родительским селектором целиком.',
        'Последнее правило: .tariff__btn:hover { background-color: #123d7d; }'
      ],
      html: `<article class="tariff">
  <h2 class="tariff__title">Тариф «Студент»</h2>
  <p>Безлимитный интернет в общежитии, скорость до 100 Мбит/с.</p>
  <p class="tariff__price">350 ₽ в месяц</p>
  <a class="tariff__btn" href="#connect">Подключить</a>
</article>`,
      css: `${BASE}
/* Исходник на LESS — перепишите его ниже обычным CSS.

@primary: #1a56b0;
@primary-dark: #123d7d;
@gap: 16px;
@radius: 12px;

.rounded(@r: @radius) {
  border-radius: @r;
}

.tariff {
  max-width: 320px;
  padding: @gap;
  border: 2px solid @primary;
  .rounded();

  &__title {
    margin: 0 0 8px;
    color: @primary;
  }
  &__price {
    font-size: 24px;
    font-weight: bold;
  }
  &__btn {
    display: inline-block;
    padding: (@gap / 2) @gap;
    background-color: @primary;
    color: #ffffff;
    text-decoration: none;
    .rounded(8px);

    &:hover {
      background-color: @primary-dark;
    }
  }
}
*/
`,
      tests: [
        { name: '.tariff: max-width 320px, padding 16px, рамка 2px #1a56b0, скругление 12px', check: h => {
          if (h.px('.tariff', 'max-width') !== 320) return 'max-width не 320px';
          if (h.px('.tariff', 'padding-top') !== 16 || h.px('.tariff', 'padding-left') !== 16) return 'padding не 16px';
          if (h.px('.tariff', 'border-top-width') !== 2 || h.cs('.tariff', 'border-top-style') !== 'solid' || h.cs('.tariff', 'border-top-color') !== PRIMARY) return 'рамка не 2px solid #1a56b0';
          return radius(h, '.tariff') === 12 || `скругление ${radius(h, '.tariff')}px`;
        } },
        { name: '.tariff__title: margin 0 0 8px, цвет #1a56b0', check: h => (h.px('.tariff__title', 'margin-top') === 0 && h.px('.tariff__title', 'margin-bottom') === 8 && h.cs('.tariff__title', 'color') === PRIMARY) || 'проверьте margin и color у заголовка' },
        { name: '.tariff__price: 24px, жирный', check: h => (h.px('.tariff__price', 'font-size') === 24 && +h.cs('.tariff__price', 'font-weight') >= 700) || 'нужны font-size: 24px и font-weight: bold' },
        { name: '.tariff__btn: inline-block, padding 8px 16px, фон #1a56b0, белый текст, скругление 8px, без подчёркивания', check: h => {
          if (h.cs('.tariff__btn', 'display') !== 'inline-block') return 'нет display: inline-block';
          if (h.px('.tariff__btn', 'padding-top') !== 8 || h.px('.tariff__btn', 'padding-left') !== 16) return `padding ${h.cs('.tariff__btn', 'padding')}`;
          if (h.cs('.tariff__btn', 'background-color') !== PRIMARY || h.cs('.tariff__btn', 'color') !== 'rgb(255, 255, 255)') return 'проверьте цвета кнопки';
          if (radius(h, '.tariff__btn') !== 8) return `скругление ${radius(h, '.tariff__btn')}px`;
          return /^none/.test(h.cs('.tariff__btn', 'text-decoration-line')) || 'у кнопки осталось подчёркивание';
        } },
        { name: 'Правило .tariff__btn:hover с фоном #123d7d', check: h => h.rules.some(r => r.selector.trim() === '.tariff__btn:hover' && r.style.getPropertyValue('background-color') === 'rgb(18, 61, 125)') || 'нет .tariff__btn:hover { background-color: #123d7d; }' },
        { name: 'В CSS не осталось синтаксиса LESS', check: h => {
          const css = h.css.replace(/\/\*[\s\S]*?\*\//g, '');
          if (/@(primary|gap|radius)/.test(css)) return 'остались переменные LESS';
          return !/&/.test(css) || 'остался знак & — разверните вложенность';
        } }
      ]
    },
    {
      id: 'k2502', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Сетка как в Bootstrap', level: 'Сложное', minutes: 20, points: 200,
      story: 'Страницу новостей колледжа сверстали на классах Bootstrap, но сам Bootstrap подключать не стали: он слишком тяжёлый ради одной сетки. Напишите CSS для этих классов сами.',
      goal: 'Напишите CSS для классов сетки. .container: max-width 1140px, по центру (margin: 0 auto). .row: grid из 12 равных колонок (repeat(12, 1fr)), gap 24px. .col-12 занимает все 12 колонок (grid-column: span 12) — так блоки стоят на телефоне. В @media (min-width: 768px): .col-md-6 занимает 6 колонок, .col-md-4 — 4. HTML не меняйте. Медиазапросы с max-width не используйте.',
      hints: [
        'Сетка: .row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }',
        'Элемент на несколько колонок — grid-column: span N. Для телефона: .col-12 { grid-column: span 12; }',
        'Размеры для широких экранов — в медиазапросе: @media (min-width: 768px) { .col-md-6 { grid-column: span 6; } .col-md-4 { grid-column: span 4; } }',
        'Почему медиазапрос перебивает .col-12? У блока оба класса, специфичность одинаковая, а правило в медиазапросе стоит ниже.'
      ],
      html: `<div class="container">
  <h1>Новости колледжа</h1>
  <div class="row">
    <article class="col-12 col-md-6 news news--main">
      <h2>День открытых дверей</h2>
      <p>В субботу в 11:00 покажем мастерские и расскажем о специальностях.</p>
    </article>
    <article class="col-12 col-md-6 news news--main">
      <h2>Чемпионат «Профессионалы»</h2>
      <p>Наши студенты прошли в финал по веб-технологиям.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Новые книги</h3>
      <p>В библиотеку пришли учебники по дизайну.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Спортзал</h3>
      <p>Открыта запись в секцию волейбола.</p>
    </article>
    <article class="col-12 col-md-4 news">
      <h3>Столовая</h3>
      <p>Комплексный обед теперь стоит 250 ₽.</p>
    </article>
  </div>
</div>`,
      css: `${BASE}
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
}`,
      tests: [
        { name: '.container: max-width 1140px, по центру', check: h => (h.px('.container', 'max-width') === 1140 && h.cs('.container', 'margin-left') === h.cs('.container', 'margin-right')) || 'нужны max-width: 1140px и margin: 0 auto' },
        { name: '.row — grid из 12 колонок, gap 24px', check: h => (h.cs('.row', 'display') === 'grid' && h.cs('.row', 'grid-template-columns').split(' ').length === 12 && h.px('.row', 'column-gap') === 24) || 'нужны display: grid, repeat(12, 1fr) и gap: 24px' },
        { name: 'На телефоне каждая новость во всю ширину, друг под другом', at: 360, check: h => {
          const n = h.$$('.news'), w = h.rect('.row').width;
          if (!n.every(e => Math.abs(e.getBoundingClientRect().width - w) < 2)) return 'новости не во всю ширину';
          return (n.every((x, i) => !i || x.getBoundingClientRect().top >= n[i - 1].getBoundingClientRect().bottom - 1) && !h.overflow()) || 'новости не друг под другом или есть прокрутка';
        } },
        { name: 'На компьютере две главные новости в ряд, по половине', check: h => {
          const m = h.$$('.col-md-6'), w = h.rect('.row').width;
          return (h.sameRow(m) && m.every(e => Math.abs(e.getBoundingClientRect().width - (w - 24) / 2) < 2)) || 'col-md-6 должны занимать по 6 колонок из 12';
        } },
        { name: 'На компьютере три короткие новости в ряд, по трети', check: h => {
          const m = h.$$('.col-md-4'), w = h.rect('.row').width;
          return (h.sameRow(m) && m.every(e => Math.abs(e.getBoundingClientRect().width - (w - 48) / 3) < 2)) || 'col-md-4 должны занимать по 4 колонки из 12';
        } },
        { name: 'Размеры md — в @media (min-width: 768px), без max-width', check: h => {
          if (h.rules.some(r => /max-width/.test(r.media))) return 'есть медиазапрос с max-width';
          return (h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.col-md-6/.test(r.selector)) && h.rules.some(r => /min-width:\s*768px/.test(r.media) && /\.col-md-4/.test(r.selector))) || 'нет .col-md-6 и .col-md-4 в @media (min-width: 768px)';
        } }
      ]
    },
    {
      id: 'k2503', lesson: 'mdk-25', module: 'mdk3', mech: 'build', title: 'Типовое решение: модальное окно', level: 'Среднее', minutes: 20, points: 150,
      story: 'После записи на консультацию сайт должен показать окно «Вы записаны» поверх страницы. Разметка готова, нужно оформить окно по типовой схеме и сделать его понятным для экранного диктора.',
      goal: 'Затемнение .modal: position: fixed и inset: 0 (на всё окно), фон rgba с прозрачностью от 0.4 до 0.9, flex-центрирование, padding 16px. Окно .modal__dialog: белый фон, скругление не меньше 12px, max-width 400px, position: relative. Крестик .modal__close: position: absolute в правом верхнем углу окна (top и right не больше 16px). В HTML окну добавьте role="dialog", aria-modal="true" и aria-labelledby со ссылкой на id заголовка (у h2 уже есть id="modal-title"), крестику — aria-label="Закрыть". На телефоне окно не касается краёв экрана.',
      hints: [
        'Затемнение: .modal { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; padding: 16px; background-color: rgba(0, 0, 0, 0.6); }',
        'Окну: position: relative; max-width: 400px; padding: 24px; border-radius: 12px; background-color: #ffffff;',
        'Крестик: .modal__close { position: absolute; top: 8px; right: 8px; }',
        'Атрибуты пишутся в открывающем теге: <section class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">'
      ],
      html: `<main>
  <h1>Консультации по МДК.08.01</h1>
  <p>Выберите удобное время и нажмите «Записаться».</p>
</main>
<div class="modal">
  <section class="modal__dialog">
    <h2 id="modal-title">Вы записаны</h2>
    <p>Консультация в среду в 15:00, кабинет 214. Напоминание придёт на почту.</p>
    <button class="modal__close" type="button">×</button>
  </section>
</div>`,
      css: `${BASE}
.modal__dialog h2 {
  margin-top: 0;
}
.modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background-color: #eeeeee;
  color: #222222;
  font-size: 20px;
  cursor: pointer;
}`,
      tests: [
        { name: 'Затемнение на всё окно: position: fixed и inset: 0', check: h => {
          if (h.cs('.modal', 'position') !== 'fixed') return 'нет position: fixed';
          const r = h.rect('.modal');
          return (r.left === 0 && r.top === 0 && Math.abs(r.width - h.width) < 1 && Math.abs(r.height - h.height) < 1) || 'затемнение не закрывает всё окно';
        } },
        { name: 'Фон затемнения rgba, прозрачность от 0.4 до 0.9', check: h => { const m = h.cs('.modal', 'background-color').match(/rgba\([^)]*,\s*([\d.]+)\)/); return (m && +m[1] >= 0.4 && +m[1] <= 0.9) || 'нужен фон вроде rgba(0, 0, 0, 0.6)'; } },
        { name: 'Окно ровно в центре экрана', check: h => {
          const d = h.rect('.modal__dialog');
          return (Math.abs((d.left + d.right) / 2 - h.width / 2) < 2 && Math.abs((d.top + d.bottom) / 2 - h.height / 2) < 2) || 'окно не по центру';
        } },
        { name: 'Окно: белый фон, скругление от 12px, max-width 400px', check: h => (h.cs('.modal__dialog', 'background-color') === 'rgb(255, 255, 255)' && radius(h, '.modal__dialog') >= 12 && h.px('.modal__dialog', 'max-width') === 400) || 'проверьте фон, border-radius и max-width окна' },
        { name: 'Крестик в правом верхнем углу окна', check: h => {
          if (h.cs('.modal__dialog', 'position') !== 'relative' || h.cs('.modal__close', 'position') !== 'absolute') return 'нужны position: relative у окна и absolute у крестика';
          const d = h.rect('.modal__dialog'), c = h.rect('.modal__close');
          return (d.right - c.right >= 0 && d.right - c.right <= 16 && c.top - d.top >= 0 && c.top - d.top <= 16) || 'крестик не в правом верхнем углу';
        } },
        { name: 'Доступность: role="dialog", aria-modal, aria-labelledby, aria-label у крестика', check: h => {
          const d = h.$('.modal__dialog');
          if (d.getAttribute('role') !== 'dialog') return 'нет role="dialog"';
          if (d.getAttribute('aria-modal') !== 'true') return 'нет aria-modal="true"';
          if (d.getAttribute('aria-labelledby') !== 'modal-title') return 'aria-labelledby должен ссылаться на modal-title';
          return h.$('.modal__close').getAttribute('aria-label') === 'Закрыть' || 'у крестика нет aria-label="Закрыть"';
        } },
        { name: 'На телефоне окно не касается краёв экрана', at: 360, check: h => { const d = h.rect('.modal__dialog'); return (d.left >= 12 && d.right <= 348) || 'нужен padding у затемнения'; } }
      ]
    }
  );
})();
