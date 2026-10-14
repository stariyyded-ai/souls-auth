/* Занятие 49: эталонные решения */
(() => {
  const MARK = '/* Ниже — ';
  // решение = шаблон CSS до комментария «Ниже — …» + стили студента
  const keep = css => css.slice(0, css.indexOf(MARK));
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4901: t => ({
      html: `<div class="page">
  <h1>Каталог книг</h1>
  <form class="filter">
    <div class="filter-field">
      <label for="q">Название или автор</label>
      <input id="q" name="q" type="search">
    </div>
    <div class="filter-field">
      <label for="genre">Жанр</label>
      <select id="genre" name="genre">
        <option value="all">Все жанры</option>
        <option value="fantasy">Фантастика</option>
        <option value="textbook">Учебники</option>
        <option value="detective">Детективы</option>
      </select>
    </div>
    <div class="filter-field">
      <label class="check"><input id="available" name="available" type="checkbox"> Только в наличии</label>
    </div>
    <button class="btn btn-primary" type="submit">Показать</button>
  </form>
</div>`,
      css: keep(t.css) + `.filter { display: flex; flex-direction: column; gap: var(--space-2); }
.filter-field label { display: block; margin-bottom: var(--space-1); font-weight: bold; }
.filter-field .check { display: flex; align-items: center; gap: var(--space-1); min-height: 44px; margin: 0; font-weight: normal; }
#q, #genre { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }
@media (min-width: 768px) {
  .filter { flex-direction: row; align-items: flex-end; }
}
`
    }),
    k4902: t => ({
      html: t.html.replace('<!-- Здесь хлебные крошки: Главная / Каталог -->', `<nav class="breadcrumbs" aria-label="Хлебные крошки">
    <ol>
      <li><a href="#">Главная</a></li>
      <li aria-current="page">Каталог</li>
    </ol>
  </nav>`),
      css: keep(t.css) + `.breadcrumbs ol { display: flex; margin: 0; padding: 0; list-style: none; }
.breadcrumbs li + li::before { content: "/"; margin: 0 var(--space-1); color: var(--color-muted); }
.breadcrumbs a { color: var(--color-primary); }
.catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.book { padding: var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.badge { display: inline-block; padding: 2px var(--space-1); border-radius: var(--radius); font-size: 14px; }
.badge-yes { background: var(--color-success); color: var(--color-on-primary); }
.badge-no { background: var(--color-surface); color: var(--color-muted); }
`
    }),
    k4903: t => ({
      html: t.html,
      css: t.css,
      js: `const form = document.querySelector('.filter');
const found = document.querySelector('.found');
const empty = document.querySelector('.empty');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const genre = document.querySelector('#genre').value;
  const onlyAvailable = document.querySelector('#available').checked;
  const text = document.querySelector('#q').value.trim().toLowerCase();
  let count = 0;

  for (const book of document.querySelectorAll('.book')) {
    const title = book.querySelector('.book-title').textContent.toLowerCase();
    const ok = (genre === 'all' || book.dataset.genre === genre)
      && (!onlyAvailable || book.dataset.available === 'yes')
      && title.includes(text);
    book.hidden = !ok;
    if (ok) {
      count = count + 1;
    }
  }

  found.textContent = 'Найдено: ' + count;
  empty.hidden = count > 0;
});
`
    })
  });
})();
