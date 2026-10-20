/* Занятие 58. ПР23. Оптимизация: Lighthouse, изображения, доступность */
(() => {
  const { BASE, IMG, ICON } = window.COURSE_KIT;
  window.COURSE_TASKS.push(
    {
      id: 'w5801', lesson: 'm9-pr23', module: 'mdk96', mech: 'a11y', title: 'Чиним страницу-антипример', level: 'Среднее', minutes: 30, points: 150,
      story: 'Перед вами bad-page.html — страница «Новая заявка», которую Lighthouse разносит в пух и прах: поля без подписей, серый текст, кнопка-крестик без имени, ленивый логотип и пропавший фокус. Исправьте всё по списку, не удаляя содержимое.',
      goal: 'Исправьте: 1) у каждого поля (fio, phone, email) есть видимая подпись <label for="…"> (placeholder можно оставить); 2) autocomplete: у ФИО name, у телефона tel, у email email; 3) телефон связан с подсказкой: aria-describedby="phone-error"; 4) у кнопки-крестика aria-label="Закрыть"; 5) у логотипа нет loading="lazy", а у фото есть loading="lazy", width="300" и height="150"; правило img { max-width: 100%; height: auto; }; 6) текст .note — с контрастом не ниже 4,5:1; 7) уберите outline: none и сделайте видимый фокус: :focus-visible с outline не тоньше 2px.',
      hints: [
        'Подпись: <label for="fio">ФИО</label> прямо перед <input id="fio" …>. Так же для phone и email.',
        'Атрибуты поля телефона: <input id="phone" name="phone" type="tel" autocomplete="tel" aria-describedby="phone-error" …>',
        'Картинки: у логотипа удалите loading="lazy" — он нужен сразу. У фото: width="300" height="150" loading="lazy".',
        'CSS: .note { color: #555555; }, правило с outline: none удалите и добавьте :focus-visible { outline: 3px solid #1f4fb8; outline-offset: 2px; }'
      ],
      html: `<header class="top">
  <img class="logo" src="${ICON}" alt="Логотип портала «Чистый дом»" width="40" height="40" loading="lazy">
  <button class="icon-btn" type="button">✕</button>
</header>
<main class="page">
  <h1>Новая заявка</h1>
  <p class="note">Заполните поля, и мастер перезвонит в течение часа.</p>
  <img class="photo" src="${IMG}" alt="Уборка квартиры после ремонта">
  <form class="form">
    <input id="fio" name="fio" placeholder="ФИО">
    <input id="phone" name="phone" type="tel" placeholder="Телефон">
    <div class="hint" id="phone-error">Телефон в формате +7(XXX)-XXX-XX-XX</div>
    <input id="email" name="email" type="email" placeholder="Email">
    <button class="btn" type="submit">Отправить</button>
  </form>
</main>`,
      css: `${BASE}
.top { display: flex; align-items: center; justify-content: space-between; }
.icon-btn { padding: 6px 12px; border: 2px solid #1f4fb8; border-radius: 8px; background: #ffffff; color: #1f4fb8; font: inherit; cursor: pointer; }
.page { max-width: 420px; }
.note { color: #aaaaaa; }
.form { display: grid; gap: 8px; }
.form input { padding: 8px 10px; border: 2px solid #6b7280; border-radius: 8px; font: inherit; }
.hint { color: #555555; font-size: 14px; }
.btn { padding: 10px 18px; border: 0; border-radius: 8px; background: #1f4fb8; color: #ffffff; font: inherit; cursor: pointer; }
* { outline: none; }`,
      tests: [
        { name: 'У каждого поля есть <label for>', check: h => {
          const bad = ['fio', 'phone', 'email'].filter(id => !h.$(`label[for="${id}"]`) || !h.text(`label[for="${id}"]`));
          return !bad.length || `нет подписи у: ${bad.join(', ')}`;
        } },
        { name: 'autocomplete: name, tel, email', check: h => {
          const want = { fio: 'name', phone: 'tel', email: 'email' };
          const bad = Object.keys(want).find(id => h.$('#' + id)?.getAttribute('autocomplete') !== want[id]);
          return !bad || `у поля ${bad} нужен autocomplete="${want[bad]}"`;
        } },
        { name: 'Телефон связан с подсказкой через aria-describedby', check: h => h.$('#phone').getAttribute('aria-describedby') === 'phone-error' || 'добавьте aria-describedby="phone-error"' },
        { name: 'У кнопки-крестика aria-label="Закрыть"', check: h => h.$('.icon-btn').getAttribute('aria-label') === 'Закрыть' || 'кнопке ✕ нужен aria-label="Закрыть"' },
        { name: 'Логотип грузится сразу, фото — лениво и с размерами', check: h => {
          if (h.$('.logo').getAttribute('loading') === 'lazy') return 'у логотипа не должно быть loading="lazy"';
          const p = h.$('.photo');
          if (p.getAttribute('loading') !== 'lazy') return 'у фото нужен loading="lazy"';
          return p.getAttribute('width') === '300' && p.getAttribute('height') === '150' || 'у фото нужны width="300" и height="150"';
        } },
        { name: 'Картинки не вылезают за экран и сохраняют пропорции', at: 360, check: h => {
          if (!h.rules.some(r => /(^|,)\s*img\s*(,|$)/.test(r.selector) && r.style.maxWidth === '100%' && r.style.height === 'auto')) return 'нужно правило img { max-width: 100%; height: auto; }';
          return !h.overflow() || 'на 360px появилась горизонтальная прокрутка';
        } },
        { name: 'Контраст текста .note не ниже 4,5:1', check: h => { const c = h.contrast('.note'); return c >= 4.5 || `сейчас ${c.toFixed(2)}:1`; } },
        { name: 'Фокус виден: нет outline: none, есть :focus-visible с outline от 2px', check: h => {
          if (h.rules.some(r => r.style.outlineStyle === 'none' || r.style.outline === 'none' || r.style.outlineWidth === '0px')) return 'уберите outline: none';
          const f = h.rules.find(r => /:focus-visible/.test(r.selector) && parseFloat(r.style.outlineWidth) >= 2 && r.style.outlineStyle && r.style.outlineStyle !== 'none');
          return !!f || 'добавьте :focus-visible { outline: 3px solid …; }';
        } }
      ]
    }
  );
})();
