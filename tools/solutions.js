/* Эталонные решения 25 заданий — для преподавателя и для проверки автотестов (tools/check-tasks.mjs).
   Студентам не подключается. Каждое решение получает задание (с шаблоном) и возвращает { html, css }. */
(() => {
  const BASE = 'body { margin: 0; padding: 24px; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }';
  const frag = (t, label) => t.fragments.find(f => f.label === label).code;
  window.TASK_SOLUTIONS = {
    t01: t => ({
      html: t.html.replace('«Храм огня»<h1>', '«Храм огня»</h1>').replace('height="150">', 'height="150" alt="Костёр с мечом в Храме огня">'),
      css: `${BASE}
.sign { padding: 24px; text-align: center; color: #f2d58a; }
.sign h1 { font-size: 40px; margin: 0; }
.motto { color: #c9b89a; }
.btn { display: inline-block; padding: 12px 20px; background: #e8772e; color: #1b1620; text-decoration: none; }`
    }),
    t02: t => ({
      html: t.html,
      css: `${BASE}
.goods { display: flex; gap: 16px; list-style: none; padding: 0; margin: 0; }
.card { flex: 1; padding: 16px; border: 2px solid #c9a45c; }
.card h3 { margin: 0; }
.price { color: #f2d58a; font-weight: bold; }`
    }),
    t03: t => ({
      html: t.html,
      css: `body { margin: 0; background: #0a090c; font-family: Arial, sans-serif; }
.top { display: flex; align-items: center; padding: 0 24px; background: #1e1a24; }
.top nav { margin-left: auto; }
.logo { color: #f2d58a; font-weight: bold; text-decoration: none; }
.menu { display: flex; list-style: none; margin: 0; padding: 0; }
.menu a { display: block; padding: 14px 16px; color: #e6dcc6; text-decoration: none; }
.menu .active { color: #e8772e; }`
    }),
    t04: () => ({
      html: `<form class="join" action="#">
  <h2>Вступить в ковенант</h2>
  <div class="field">
    <label for="name">Имя персонажа</label>
    <input id="name" type="text" required>
  </div>
  <div class="field">
    <label for="mail">Почта</label>
    <input id="mail" type="email">
  </div>
  <button type="submit" class="send">Вступить</button>
</form>`,
      css: `${BASE}
.join { max-width: 420px; }
.field { margin-bottom: 16px; }
.field label { display: block; margin-bottom: 6px; }
.field input { width: 100%; box-sizing: border-box; padding: 10px; }
.send { width: 100%; padding: 12px; background: #c9a45c; color: #16131a; border: 0; font: inherit; }`
    }),
    t05: t => ({
      html: t.html,
      css: `${BASE}
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.work { margin: 0; padding: 8px; background: #241f2b; }
.work img { display: block; max-width: 100%; height: auto; }
.work.big { grid-column: span 2; }
figcaption { margin-top: 6px; font-size: 14px; }`
    }),
    t06: t => ({
      html: `<article class="boss">
  ${frag(t, 'Имя босса')}
  ${frag(t, 'Картинка')}
  ${frag(t, 'Характеристики')}
</article>`,
      css: [BASE, ...t.fragments.filter(f => f.lang === 'css' && !f.trap).map(f => f.code)].join('\n')
    }),
    t07: t => ({
      html: [frag(t, 'Шапка'), frag(t, 'Контент'), frag(t, 'Подвал')].join('\n'),
      css: `${t.css}\n${frag(t, 'Колонка во всю высоту')}`
    }),
    t08: t => ({ html: t.html, css: t.css.replace('/* сетка и карточка */', frag(t, 'Сетка') + '\n' + frag(t, 'Карточка')) }),
    t09: t => ({ html: t.html.replace('<!-- модальное окно -->', frag(t, 'Окно')), css: t.css.replace('/* затемнение и окно */', frag(t, 'Затемнение') + '\n' + t.fragments.find(f => f.label === 'Окно' && f.lang === 'css').code) }),
    t10: t => ({
      html: `<table class="records">
  ${frag(t, 'Подпись')}
  ${frag(t, 'Шапка')}
  ${frag(t, 'Строки')}
</table>`,
      css: t.css.replace('/* зебра и числа */', frag(t, 'Зебра') + '\n' + frag(t, 'Числа'))
    }),
    t11: t => ({
      html: t.html.replace(/class="btn-(\w+)"/g, 'class="btn btn-$1"'),
      css: `${BASE}
.btn { padding: 10px 18px; font: 16px Arial, sans-serif; border: 2px solid #f2d58a; color: #1b1620; cursor: pointer; }
.btn-fire { background: #e8772e; }
.btn-moon { background: #8fc3ff; }
.btn-gold { background: #c9a45c; }`
    }),
    t12: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; background: #16131a; font-family: Arial, sans-serif; }
.list { list-style: none; margin: 0; padding: 0; }
.item { border-bottom: 1px solid #5a5066; }
.link { display: block; padding: 12px; color: #f2d58a; text-decoration: none; }
.link:hover { color: #e8772e; }`
    }),
    t13: t => ({
      html: t.html,
      css: `:root { --gold: #c9a45c; --fire: #e8772e; --night: #16131a; }
body { margin: 0; background: var(--night); color: #e6dcc6; font-family: Arial, sans-serif; }
.hero { padding: 32px 24px; border-bottom: 2px solid var(--gold); }
.hero h1 { margin: 0 0 8px; color: var(--gold); }
.btn { display: inline-block; padding: 10px 18px; background: var(--fire); color: var(--night); border: 2px solid var(--gold); text-decoration: none; }
.btn:hover { background: var(--gold); }
.foot { padding: 16px 24px; color: var(--fire); border-top: 2px solid var(--gold); }`
    }),
    t14: t => ({
      html: t.html,
      css: `${BASE}
.row { display: flex; gap: 20px; }
.tile { width: 120px; height: 80px; padding: 8px; box-sizing: border-box; background: #241f2b; border: 2px solid #5a5066; }`
    }),
    t15: t => ({
      html: t.html,
      css: `body { margin: 0; background: #16131a; color: #e6dcc6; font-family: Arial, sans-serif; }
.hero { padding: 40px 24px; text-align: center; }
.title { font-size: 36px; margin: 0 0 12px; }
.lead { color: #c9b89a; font-size: 18px; }
.cta { display: inline-block; padding: 12px 24px; background: #e8772e; color: #16131a; text-decoration: none; font-weight: bold; }`
    }),
    t16: t => ({
      html: t.html,
      css: `body { margin: 0; background: #16131a; font-family: Arial, sans-serif; }
.top { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; max-width: 960px; padding: 16px 24px; box-sizing: border-box; background: #241f2b; }
.logo { color: #f2d58a; font-weight: bold; text-decoration: none; white-space: nowrap; }
.menu { display: flex; flex-wrap: wrap; gap: 8px 24px; list-style: none; margin: 0; padding: 0; }
.menu a { color: #e6dcc6; text-decoration: none; }`
    }),
    t17: t => ({
      html: t.html,
      css: `${BASE}
.gear { display: grid; grid-template-columns: repeat(3, minmax(0, 300px)); gap: 16px; }
.col { padding: 16px; background: #241f2b; }
.col h2 { margin: 0 0 8px; }
@media (max-width: 600px) { .gear { grid-template-columns: 1fr; } }`
    }),
    t18: t => ({
      html: t.html,
      css: `${BASE}
.post { max-width: 700px; }
.cover { display: block; width: 100%; height: auto; }
.post p { font-size: 16px; line-height: 1.5; }`
    }),
    t19: t => ({
      html: t.html,
      css: `${BASE}
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 640px; }
th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #5a5066; }`
    }),
    t20: t => ({
      html: t.html,
      css: `${BASE}
.actions { display: flex; gap: 12px; }
.btn { padding: 12px 20px; font-size: 16px; text-decoration: none; border: 2px solid #c9a45c; text-align: center; }
.yes { background: #e8772e; color: #16131a; }
.no { color: #e6dcc6; }
@media (max-width: 600px) { .actions { flex-direction: column; } .btn { min-height: 44px; box-sizing: border-box; } }`
    }),
    t21: () => ({
      html: `<header>
  <p class="title">Пепельный Пиксель</p>
  <nav aria-label="Главное меню"><a href="#">Уроки</a> <a href="#">Задания</a></nav>
</header>
<main>
  <h1>Храм огня</h1>
  <article>
    <h2>Как зажечь костёр</h2>
    <p>Подойди к костру и нажми «Зажечь». Он станет точкой возрождения.</p>
  </article>
</main>
<footer>© Эпоха огня</footer>`,
      css: `${BASE}
.title { font-size: 28px; font-weight: bold; }
a { color: #f2d58a; }`
    }),
    t22: t => ({
      html: t.html
        .replace('class="art" src', 'class="art" alt="Ложе Хаоса: огромное огненное дерево" src')
        .replace('class="divider" src', 'class="divider" alt="" src')
        .replace('class="map" src', 'class="map" alt="Карта: Изалит, за огненным озером" src')
        .replace('class="icon-btn"', 'class="icon-btn" aria-label="Добавить в бестиарий"')
        .replace('Тактика боя — <a href="#tactics">тут</a>.', '<a href="#tactics">Тактика боя с Ложем Хаоса</a>'),
      css: t.css
    }),
    t23: t => ({
      html: t.html,
      css: `${BASE}
.card { max-width: 420px; padding: 20px; background: #241f2b; }
.lead { font-size: 16px; color: #e6dcc6; }
.hint { font-size: 14px; color: #b3a892; }
.btn { display: inline-block; padding: 12px 18px; background: #e8772e; color: #16131a; text-decoration: none; }`
    }),
    t24: () => ({
      html: `<form class="arena" action="#">
  <h2>Турнир на арене</h2>
  <label for="hero">Имя героя</label>
  <input id="hero" type="text" required>
  <label for="pass">Пароль</label>
  <input id="pass" type="password" required aria-describedby="pass-hint">
  <p id="pass-hint" class="hint">Не меньше 8 символов.</p>
  <fieldset class="classes">
    <legend>Класс</legend>
    <label><input type="radio" name="cls" value="knight"> Рыцарь</label>
    <label><input type="radio" name="cls" value="sorcerer"> Чародей</label>
  </fieldset>
  <button type="submit">Записаться</button>
</form>`,
      css: `${BASE}
.arena { display: grid; gap: 12px; max-width: 360px; }
.arena input[type=text], .arena input[type=password] { padding: 10px; }
.hint { margin: 0; font-size: 14px; color: #c9b89a; }
button { padding: 12px; background: #e8772e; color: #16131a; border: 0; }`
    }),
    t25: () => ({
      html: `<a class="skip" href="#main">Перейти к содержимому</a>
<header class="top">
  <a href="#">Пепельный Пиксель</a>
</header>
<main id="main">
  <h1>Чумной город</h1>
  <button type="button" class="btn">Отдохнуть у костра</button>
  <button type="button" class="btn">Уйти</button>
</main>`,
      css: `${BASE}
:focus-visible { outline: 3px solid #f2d58a; outline-offset: 2px; }
.skip { position: absolute; left: 8px; top: -60px; padding: 8px 12px; background: #f2d58a; color: #16131a; }
.skip:focus { top: 8px; }
.top a { color: #f2d58a; }
.btn { display: inline-block; padding: 12px 18px; margin-right: 8px; background: #241f2b; color: #e6dcc6; border: 2px solid #c9a45c; cursor: pointer; font: inherit; }`
    })
  };
})();
