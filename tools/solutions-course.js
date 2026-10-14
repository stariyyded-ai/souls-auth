/* Собрано из tools/solutions командой node tools/build-content.mjs. */
window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {};
/* ---- tools/solutions/k01.js ---- */
/* Занятие 1: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0101: t => ({
      html: `<h1>Анна Смирнова</h1>
<p>Я из Казани, учусь на первом курсе.</p>
<p>Хочу научиться делать <strong>сайты</strong> для людей.</p>`,
      css: t.css
    }),
    k0102: t => ({
      html: `<h1>Важное объявление</h1>
<p>Практическая работа сдаётся <strong>до пятницы</strong></p>
<p>Консультация в среду.
Приносите ноутбуки.</p>
<p>Корпус 2,<br>кабинет 214</p>`,
      css: t.css
    }),
    k0103: t => ({
      html: `<!-- Расписание консультаций -->
<h1>Консультации по МДК.08.01</h1>
<h2>Понедельник</h2>
<p>с 15:00 до 16:30, кабинет 214</p>
<h2>Четверг</h2>
<p>с 14:00 до 15:00, <em>только онлайн</em></p>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k02.js ---- */
/* Занятие 2: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0201: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Библиотека колледжа</title>
  </head>
  <body>
    <h1>Библиотека колледжа</h1>
    <p>Работаем с понедельника по пятницу, с 9:00 до 18:00.</p>
  </body>
</html>`,
      css: t.css
    }),
    k0202: t => ({
      html: `<h1>Кружок «Веб с нуля»</h1>
<p title="Запись открыта до пятницы">Наведите на этот абзац мышь — появится подсказка.</p>
<p>На первой встрече разберём теги &lt;p&gt; и &lt;h1&gt;.</p>
<p>Взнос — 500&nbsp;₽ за месяц, приходите с ноутбуком &amp; хорошим настроением.</p>
<p>&copy; 2026 Кружок «Веб с нуля»</p>`,
      css: t.css
    }),
    k0203: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Спортзал колледжа</title>
  </head>
  <body>
    <h1>Спортзал колледжа</h1>
    <p>Открыт с 8:00 до 20:00, в воскресенье — выходной.</p>
    <p>Сменная обувь обязательна.</p>
  </body>
</html>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k03.js ---- */
/* Занятие 3: эталонные решения */
(() => {
  const MDN = 'https://developer.mozilla.org/ru/docs/Web/HTML';
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0301: t => ({
      html: `<!-- Это файл courses/web.html -->
<h1>Курс «Веб-разработка»</h1>
<p>Учимся делать сайты: HTML, CSS и немного JavaScript.</p>

<ul>
  <li><a href="../index.html">Главная</a></li>
  <li><a href="../about.html">О колледже</a></li>
  <li><a href="design.html">Курс «Дизайн интерфейсов»</a></li>
  <li><a href="${MDN}" target="_blank" rel="noopener">Справочник по HTML на MDN</a></li>
</ul>`,
      css: t.css
    }),
    k0302: t => ({
      html: `<h1>Справочник первокурсника</h1>
<ul>
  <li><a href="#bells">Звонки</a></li>
  <li><a href="#library">Библиотека</a></li>
  <li><a href="#canteen">Столовая</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="bells">Звонки</h2>
<p>Первая пара начинается в 8:30, перемены по 10 минут, большая перемена — 40 минут.</p>

<h2 id="library">Библиотека</h2>
<p>Второй этаж, кабинет 204. Читательский билет выдают по студенческому.</p>

<h2 id="canteen">Столовая</h2>
<p>Первый этаж. Комплексный обед с 12:00 до 15:00.</p>

<h2 id="contacts">Контакты</h2>
<p>Почта приёмной комиссии: <a href="mailto:priem@college.ru">priem@college.ru</a></p>
<p>Телефон: <a href="tel:+74951234567">+7 (495) 123-45-67</a></p>`,
      css: t.css
    }),
    k0303: t => ({
      html: `<h1>Новости колледжа</h1>
<p>Открыта запись в спортивные секции. <a href="sport.html">Запишитесь в спортивную секцию</a> до 15 сентября.</p>
<p>Опубликовано <a href="exams.html">расписание экзаменов зимней сессии</a>.</p>
<p>Для первокурсников есть <a href="${MDN}" target="_blank" rel="noopener">справочник по HTML на MDN</a>.</p>
<p>Вопросы присылайте на почту <a href="mailto:priem@college.ru">priem@college.ru</a>.</p>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k04.js ---- */
/* Занятие 4: эталонные решения */
(() => {
  const { BASE, IMG, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0401: t => ({
      html: `<h1><img src="${ICON}" alt="" width="24" height="24"> Поход выходного дня</h1>
<p>Клуб туристов колледжа идёт в поход в субботу. Сбор в 8:00 у главного входа.</p>
<figure>
  <img src="${IMG}" alt="Горная тропа среди сосен на закате" width="300" height="150">
  <figcaption>Маршрут: 12 км по лесной тропе, около 4 часов в пути.</figcaption>
</figure>
<p>Возьмите с собой воду, перекус и удобную обувь.</p>`,
      css: t.css
    }),
    k0402: t => ({
      html: `<h1>Шпаргалка кружка «Веб с нуля»</h1>

<h2>Цитата недели</h2>
<blockquote cite="https://www.w3.org/People/Berners-Lee/">
  <p>Сила интернета — во всеобщности. Доступ для всех, независимо от ограничений, — его главная черта.</p>
</blockquote>
<p>— Тим Бернерс-Ли</p>

<h2>Теги</h2>
<p>Абзац делается тегом <code>&lt;p&gt;</code>, а картинка — тегом <code>&lt;img&gt;</code>.</p>
<p>Так выглядит список из двух пунктов:</p>
<pre>&lt;ul&gt;
  &lt;li&gt;Главная&lt;/li&gt;
  &lt;li&gt;Контакты&lt;/li&gt;
&lt;/ul&gt;</pre>

<h2>Немного химии и геометрии</h2>
<p>Формула воды: H<sub>2</sub>O. Площадь кабинета 214 — 48 м<sup>2</sup>.</p>

<hr>
<p>Следующая встреча кружка — в четверг в 16:00, кабинет 214.</p>`,
      css: t.css
    }),
    k0403: () => ({
      html: `<h1>Кафе «Корица»</h1>
<p>Свежая выпечка каждый день с 8:00 до 21:00.</p>
<blockquote>
  <p>Лучшие сырники в районе! Приходим всей группой после пар.</p>
</blockquote>
<p>Сегодня скидка на какао: <strong>минус 20%</strong></p>`,
      css: `${BASE}
h1 { color: #8a3b12; }
blockquote { margin: 16px 0; padding: 12px 16px; background-color: #e6f4ea; }
strong { color: #1d6b3a; }`
    })
  });
})();
/* ---- tools/solutions/k05.js ---- */
/* Занятие 5: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0501: t => ({
      html: `<h1>Блины на Масленицу</h1>
<h2>Ингредиенты</h2>
<ul>
  <li>Молоко — 500 мл</li>
  <li>Яйца — 2 шт.</li>
  <li>Мука — 250 г</li>
  <li>Сахар — 2 столовые ложки</li>
  <li>Для начинки:
    <ul>
      <li>творог — 200 г</li>
      <li>изюм — горсть</li>
    </ul>
  </li>
</ul>

<h2>Приготовление</h2>
<ol>
  <li>Взбейте яйца с сахаром.</li>
  <li>Влейте молоко и перемешайте.</li>
  <li>Постепенно всыпьте муку, чтобы не было комочков.</li>
  <li>Жарьте блины на разогретой сковороде с двух сторон.</li>
</ol>`,
      css: t.css
    }),
    k0502: t => ({
      html: `<h1>Расписание группы ИСП-11</h1>
<table>
  <caption>Понедельник</caption>
  <thead>
    <tr>
      <th scope="col">Время</th>
      <th scope="col">Предмет</th>
      <th scope="col">Кабинет</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">08:30–10:00</th>
      <td>МДК.08.01</td>
      <td>214</td>
    </tr>
    <tr>
      <th scope="row">10:10–11:40</th>
      <td>Математика</td>
      <td>305</td>
    </tr>
    <tr>
      <th scope="row">11:40–12:20</th>
      <td colspan="2">Обед</td>
    </tr>
    <tr>
      <th scope="row">12:20–13:50</th>
      <td>Английский язык</td>
      <td>112</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Всего пар: 3</td>
    </tr>
  </tfoot>
</table>`,
      css: t.css
    }),
    k0503: t => ({
      html: `<h1>Словарик первокурсника</h1>
<h2>Термины</h2>
<dl>
  <dt>Тег</dt>
  <dd>Команда разметки в угловых скобках.</dd>
  <dt>Атрибут</dt>
  <dd>Настройка тега: имя и значение.</dd>
  <dt>Элемент</dt>
  <dd>Открывающий тег, содержимое и закрывающий тег.</dd>
  <dt>Браузер</dt>
  <dd>Программа для просмотра сайтов.</dd>
</dl>
<h2>Как пересдать зачёт</h2>
<ol>
  <li>Узнайте дату пересдачи у куратора.</li>
  <li>Получите направление в учебной части.</li>
  <li>Подготовьтесь по вопросам из методички.</li>
</ol>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k06.js ---- */
/* Занятие 6: эталонные решения */
(() => {
  const H1 = '<h1>Техническое задание на разработку сайта кофейни «Корица»</h1>';
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0601: t => ({
      html: `${H1}

<h2>1. Общие сведения</h2>
<dl>
  <dt>Заказчик</dt>
  <dd>Кофейня-пекарня «Корица», директор О. В. Смирнова</dd>
  <dt>Исполнитель</dt>
  <dd>Студентка группы ИСП-11 Анна Смирнова</dd>
  <dt>Название сайта</dt>
  <dd>Сайт кофейни «Корица»</dd>
  <dt>Адрес кофейни</dt>
  <dd>ул. Ленина, 15, напротив колледжа</dd>
</dl>

<h2>2. Цель сайта</h2>
<p>Гости сами узнают меню, цены и часы работы, поэтому бариста реже отвечают на звонки. Заявки на торты к праздникам приходят через сайт.</p>

<h2>3. Целевая аудитория</h2>
<ul>
  <li>Студенты и преподаватели колледжа — быстро узнать меню и цены перед перерывом.</li>
  <li>Мамы с детьми из соседних домов — посмотреть выпечку и заказать торт.</li>
  <li>Сотрудники офисов — узнать, есть ли обед и до скольки работает кофейня.</li>
</ul>`,
      css: t.css
    }),
    k0602: t => ({
      html: `${H1}

<h2>4. Структура сайта</h2>
<ul>
  <li>Главная
    <ul>
      <li>Меню
        <ul>
          <li>Выпечка</li>
          <li>Напитки</li>
        </ul>
      </li>
      <li>Торты на заказ</li>
      <li>О нас</li>
      <li>Контакты</li>
    </ul>
  </li>
</ul>

<h2>5. Содержание страниц</h2>
<table>
  <caption>Страницы сайта</caption>
  <thead>
    <tr>
      <th scope="col">Страница</th>
      <th scope="col">Файл</th>
      <th scope="col">Содержание</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Главная</th>
      <td>index.html</td>
      <td>Приветствие, часы работы, популярная выпечка</td>
    </tr>
    <tr>
      <th scope="row">Меню</th>
      <td>menu.html</td>
      <td>Выпечка и напитки с фото и ценами</td>
    </tr>
    <tr>
      <th scope="row">Торты на заказ</th>
      <td>cakes.html</td>
      <td>Фото тортов и форма заявки</td>
    </tr>
    <tr>
      <th scope="row">О нас</th>
      <td>about.html</td>
      <td>История кофейни и фото зала</td>
    </tr>
    <tr>
      <th scope="row">Контакты</th>
      <td>contacts.html</td>
      <td>Адрес, телефон, карта проезда</td>
    </tr>
  </tbody>
</table>`,
      css: t.css
    }),
    k0603: t => ({
      html: `${H1}

<h2>6. Функции сайта</h2>
<ol>
  <li>Посмотреть меню с ценами и фото.</li>
  <li>Позвонить в кофейню нажатием на номер телефона.</li>
  <li>Отправить заявку на торт к празднику.</li>
  <li>Найти дорогу по карте проезда.</li>
</ol>

<h2>7. Требования к дизайну</h2>
<ul>
  <li>Основной цвет — тёплый коричневый #8a3b12, фон — кремовый #fff8ee.</li>
  <li>Логотип кофейни в шапке слева на каждой странице.</li>
  <li>Шрифт без засечек, основной текст не меньше 16 пикселей.</li>
</ul>

<h2>8. Адаптивность</h2>
<p>Сайт удобно смотреть на телефоне шириной от 360 пикселей, на планшете (768 пикселей) и на компьютере (1280 пикселей).</p>

<h2>9. Сроки и этапы</h2>
<table>
  <caption>План работ</caption>
  <thead>
    <tr>
      <th scope="col">Этап</th>
      <th scope="col">Срок</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Согласование ТЗ</th>
      <td>до 20 октября</td>
    </tr>
    <tr>
      <th scope="row">Дизайн-макет</th>
      <td>до 3 ноября</td>
    </tr>
    <tr>
      <th scope="row">Вёрстка</th>
      <td>до 20 ноября</td>
    </tr>
    <tr>
      <th scope="row">Тестирование</th>
      <td>до 27 ноября</td>
    </tr>
    <tr>
      <th scope="row">Запуск</th>
      <td>1 декабря</td>
    </tr>
  </tbody>
</table>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k07.js ---- */
/* Занятие 7: эталонные решения.
   Задания 2 и 3 продолжают страницу: в их шаблоне уже есть результат прошлого шага,
   эталон дописывает новую часть вместо комментария-подсказки. */
(() => {
  const fill = (t, part) => t.html.replace(/<!--[\s\S]*?-->\s*$/, part);
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0701: t => ({
      html: `<h1>Анна Смирнова</h1>
<img src="img/course/k07-avatar.svg" alt="Анна Смирнова, студентка колледжа" width="160" height="160">
<p>Студентка группы ИСП-11, будущий веб-разработчик</p>

<h2>Обо мне</h2>
<p>Учусь в колледже на первом курсе. Люблю рисовать и придумывать, как сделать сайты <strong>удобнее</strong> для людей.</p>
<p>По вечерам играю в волейбол в секции колледжа, а по выходным помогаю в кофейне рядом с домом.</p>`,
      css: t.css
    }),
    k0702: t => ({
      html: fill(t, `<h2>Навыки</h2>
<ul>
  <li>Пишу разметку на HTML</li>
  <li>Рисую эскизы от руки</li>
  <li>Работаю в команде</li>
  <li>Программы:
    <ul>
      <li>VS Code</li>
      <li>Figma</li>
    </ul>
  </li>
</ul>

<h2>Моё расписание</h2>
<table>
  <caption>Моя неделя</caption>
  <thead>
    <tr>
      <th scope="col">День</th>
      <th scope="col">Учёба</th>
      <th scope="col">После пар</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Понедельник</th>
      <td>4 пары</td>
      <td>Волейбол, 17:00</td>
    </tr>
    <tr>
      <th scope="row">Среда</th>
      <td>3 пары</td>
      <td>Кружок «Веб с нуля», 16:00</td>
    </tr>
    <tr>
      <th scope="row">Суббота</th>
      <td colspan="2">Работа в кофейне</td>
    </tr>
  </tbody>
</table>`),
      css: t.css
    }),
    k0703: t => ({
      html: fill(t, `<h2>Контакты</h2>
<ul>
  <li>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></li>
  <li>Телефон: <a href="tel:+79000000000">+7 900 000-00-00</a></li>
  <li><a href="https://github.com/" target="_blank" rel="noopener">Мои работы на GitHub</a></li>
</ul>
<hr>
<p>&copy; 2026 Анна Смирнова</p>`),
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k08.js ---- */
/* Занятие 8: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0801: t => ({
      html: `<h1 id="top">Анна Смирнова</h1>
<ul>
  <li><a href="#about">Обо мне</a></li>
  <li><a href="#skills">Навыки</a></li>
  <li><a href="#schedule">Расписание</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="about">Обо мне</h2>
<p>Учусь на первом курсе по специальности «Информационные системы». Люблю рисовать и разбираться, как устроены сайты.</p>
<p>По выходным работаю в кофейне у вокзала, поэтому умею объяснять сложное простыми словами.</p>
<p><a href="#top">Наверх</a></p>

<h2 id="skills">Навыки</h2>
<ul>
  <li>HTML: заголовки, списки, таблицы, ссылки</li>
  <li>Рисование от руки и в графическом планшете</li>
  <li>Работа с людьми и терпение</li>
</ul>
<p><a href="#top">Наверх</a></p>

<h2 id="schedule">Расписание</h2>
<table>
  <caption>Когда меня можно найти в колледже</caption>
  <tr><th scope="col">День</th><th scope="col">Время</th><th scope="col">Кабинет</th></tr>
  <tr><td>Понедельник</td><td>9:00–14:00</td><td>214</td></tr>
  <tr><td>Среда</td><td>11:00–16:00</td><td>305</td></tr>
  <tr><td>Пятница</td><td>9:00–12:30</td><td>214</td></tr>
</table>
<p><a href="#top">Наверх</a></p>

<h2 id="contacts">Контакты</h2>
<p>Почта: <a href="mailto:anna@example.ru">anna@example.ru</a></p>
<p>Телефон: <a href="tel:+79001234567">+7 900 123-45-67</a></p>
<p><a href="#top">Наверх</a></p>
`,
      css: t.css
    }),
    k0802: t => ({
      html: `<h1 id="top">Библиотека колледжа</h1>
<ul>
  <li><a href="#hours">Часы работы</a></li>
  <li><a href="#rules">Правила</a></li>
  <li><a href="#new-books">Новинки</a></li>
  <li><a href="#contacts">Контакты</a></li>
</ul>

<h2 id="hours">Часы работы</h2>
<p>Понедельник — пятница: с 9:00 до 18:00. Суббота: с 10:00 до 14:00.</p>

<h2 id="rules">Правила</h2>
<p>Книги выдаются на две недели по студенческому билету. Продлить срок можно один раз.</p>

<h2 id="new-books">Новинки</h2>
<p>В сентябре пришли учебники по веб-дизайну и вёрстке. Их можно читать и онлайн в <a href="https://elib.example.ru" target="_blank" rel="noopener">электронной библиотеке колледжа</a>.</p>

<h2 id="contacts">Контакты</h2>
<p>Корпус 1, кабинет 107. Почта: <a href="mailto:library@example.ru">library@example.ru</a></p>

<p><a href="#top">Наверх</a></p>`,
      css: t.css
    }),
    k0803: t => ({
      html: `<!-- Страница 404: заголовок, объяснение, картинка, ссылки на разделы, почта -->
<h1>Страница не найдена</h1>
<p>Ошибка 404: такой страницы на сайте нет. Возможно, в адресе опечатка или страницу переместили. Ничего страшного — вот куда можно перейти.</p>
<img src="img/art.svg" alt="" width="300" height="150">
<ul>
  <li><a href="index.html">Главная</a></li>
  <li><a href="schedule.html">Расписание занятий</a></li>
  <li><a href="contacts.html">Контакты колледжа</a></li>
</ul>
<p>Нашли сломанную ссылку? Напишите нам на <a href="mailto:site@example.ru">site@example.ru</a>, и мы её починим.</p>
`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k09.js ---- */
/* Занятие 9: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k0901: t => ({
      html: `<h1>Контакты</h1>
<p>Корпус 2: ул. Ленина, 15. Вход со двора, через арку у библиотеки.</p>
<iframe src="img/course/k09-map.svg" title="Схема проезда ко второму корпусу колледжа" width="600" height="300" loading="lazy"></iframe>
<p><a href="img/course/k09-map.svg" target="_blank" rel="noopener">Открыть схему проезда в новой вкладке</a></p>
`,
      css: t.css
    }),
    k0902: t => ({
      html: `<h1>Музыкальный кружок</h1>
<h2>Отчётный концерт</h2>
<iframe src="img/art.svg" title="Видео: отчётный концерт кружка" width="560" height="315" allow="fullscreen" loading="lazy"></iframe>
<p>Запись концерта 20 мая: гитара, вокал и школьный хор.</p>

<h2>Расписание репетиций</h2>
<iframe src="img/icon.svg" title="Виджет: расписание репетиций кружка" width="200" height="200" loading="lazy" sandbox></iframe>
<p>Виджет предоставлен сайтом городского дома культуры.</p>`,
      css: t.css
    }),
    k0903: t => ({
      html: `<h1>Кружок дизайна</h1>
<p>Нажмите на название работы, чтобы посмотреть её в окне ниже.</p>
<h2>Работы студентов</h2>
<ul>
  <li><a href="img/art.svg" target="preview">Пейзаж</a></li>
  <li><a href="img/icon.svg" target="preview">Иконка</a></li>
  <li><a href="img/course/k09-map.svg" target="preview">Схема проезда</a></li>
</ul>
<iframe src="img/art.svg" name="preview" title="Предпросмотр работы студента" width="600" height="300"></iframe>
`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k10.js ---- */
/* Занятие 10: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1001: t => ({
      html: `<h1>Отзыв о кафе «Пенка»</h1>
<p>Расскажите, что понравилось, а что нет. Мы читаем каждый отзыв.</p>
<form action="/feedback" method="post">
  <label for="name">Имя</label>
  <input type="text" id="name" name="name">
  <label for="email">Почта</label>
  <input type="email" id="email" name="email">
  <label for="message">Отзыв</label>
  <textarea id="message" name="message" rows="4" cols="40"></textarea>
  <p><button type="submit">Отправить</button></p>
</form>
`,
      css: t.css
    }),
    k1002: t => ({
      html: `<h1>Анкета первокурсника</h1>
<form action="/anketa" method="post">
  <p><label for="name">Имя</label> <input type="text" id="name" name="name"></p>
  <p><label for="email">Почта</label> <input type="email" id="email" name="email"></p>
  <p><label for="phone">Телефон</label> <input type="tel" id="phone" name="phone"></p>
  <p><label for="age">Возраст</label> <input type="number" id="age" name="age" min="14" max="99"></p>
  <p>Форма обучения:</p>
  <p>
    <input type="radio" id="day" name="study" value="day"> <label for="day">Очная</label>
    <input type="radio" id="extramural" name="study" value="extramural"> <label for="extramural">Заочная</label>
  </p>
  <p><input type="checkbox" id="news" name="news"> <label for="news">Получать новости</label></p>
  <p><button type="submit">Отправить анкету</button></p>
</form>`,
      css: t.css
    }),
    k1003: t => ({
      html: `<h1>Пробная тренировка</h1>
<p>Первая тренировка бесплатная. Поля со звёздочкой обязательны.</p>
<form action="/gym" method="post">
  <fieldset>
    <legend>Ваши данные</legend>
    <p><label for="name">Имя *</label> <input type="text" id="name" name="name" required></p>
    <p><label for="phone">Телефон *</label> <input type="tel" id="phone" name="phone" required pattern="\\+7[0-9]{10}" placeholder="+79001234567"></p>
  </fieldset>
  <fieldset>
    <legend>Тренировка</legend>
    <p>
      <input type="radio" id="morning" name="time" value="morning"> <label for="morning">Утро</label>
      <input type="radio" id="day" name="time" value="day"> <label for="day">День</label>
      <input type="radio" id="evening" name="time" value="evening"> <label for="evening">Вечер</label>
    </p>
    <p>
      <label for="coach">Тренер</label>
      <select id="coach" name="coach">
        <option value="">Выберите тренера</option>
        <option value="ivanov">Иванов Пётр — тренажёры</option>
        <option value="petrova">Петрова Анна — йога</option>
        <option value="sidorov">Сидоров Илья — бокс</option>
      </select>
    </p>
    <p><label for="date">Дата</label> <input type="date" id="date" name="date" min="2026-09-01"></p>
    <p><label for="people">Сколько человек</label> <input type="number" id="people" name="people" min="1" max="5"></p>
  </fieldset>
  <p><input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен с правилами зала *</label></p>
  <p><button type="submit">Записаться</button></p>
</form>
`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k11.js ---- */
/* Занятие 11: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1101: t => ({
      html: `<h1>Запись на вечерние курсы</h1>
<p>Поля со звёздочкой * обязательны. Мы пришлём подтверждение на почту.</p>
<form action="/enroll" method="post">
  <fieldset>
    <legend>Контактные данные</legend>
    <p><label for="name">Имя *</label> <input type="text" id="name" name="name" required></p>
    <p><label for="email">Почта *</label> <input type="email" id="email" name="email" required></p>
    <p><label for="phone">Телефон</label> <input type="tel" id="phone" name="phone" pattern="\\+7[0-9]{10}" placeholder="+79001234567"></p>
  </fieldset>
  <fieldset>
    <legend>Курс</legend>
    <p>
      <label for="course">Курс *</label>
      <select id="course" name="course" required>
        <option value="">Выберите курс</option>
        <option value="pc">Компьютерная грамотность</option>
        <option value="web">Основы веб-дизайна</option>
        <option value="photo">Фотография на телефон</option>
      </select>
    </p>
    <fieldset>
      <legend>Формат занятий *</legend>
      <input type="radio" id="offline" name="format" value="offline" required>
      <label for="offline">Очно</label>
      <input type="radio" id="online" name="format" value="online">
      <label for="online">Онлайн</label>
    </fieldset>
    <p><label for="start">Когда удобно начать</label> <input type="date" id="start" name="start" min="2026-09-01"></p>
    <p><label for="comment">Комментарий</label></p>
    <textarea id="comment" name="comment" rows="3" cols="40"></textarea>
  </fieldset>
  <p><input type="checkbox" id="agree" name="agree" required> <label for="agree">Согласен на обработку персональных данных *</label></p>
  <p><button type="submit">Записаться на курс</button></p>
</form>
`,
      css: t.css
    }),
    k1102: t => ({
      html: `<h1>Олимпиада по информатике</h1>
<form action="/olymp" method="post">
  <p><label for="name">ФИО *</label> <input type="text" id="name" name="name" placeholder="Иванова Мария Петровна" required></p>
  <p><label for="email">Почта *</label> <input type="email" id="email" name="email" required></p>
  <p><label for="password">Пароль *</label> <input type="password" id="password" name="password" minlength="8" required></p>
  <fieldset>
    <legend>Курс *</legend>
    <input type="radio" id="c1" name="year" value="1" required> <label for="c1">1 курс</label>
    <input type="radio" id="c2" name="year" value="2"> <label for="c2">2 курс</label>
    <input type="radio" id="c3" name="year" value="3"> <label for="c3">3 курс</label>
  </fieldset>
  <p><button type="submit">Зарегистрироваться</button></p>
</form>`,
      css: t.css
    }),
    k1103: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; }

/* Образец: каждая подпись на своей строке, небольшой отступ до поля */
label {
  display: block;
  margin-bottom: 4px;
}

input, select, textarea {
  padding: 8px;
  border: 1px solid #767676;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
}

fieldset {
  border: 1px solid #c4c4c4;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

legend {
  font-weight: bold;
  color: #1f4e79;
}

button {
  background-color: #1f4e79;
  color: #ffffff;
  padding: 12px 24px;
  border: 0;
  border-radius: 4px;
  font-size: 16px;
}
`
    })
  });
})();
/* ---- tools/solutions/k12.js ---- */
/* Занятие 12: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1201: t => ({
      html: t.html,
      css: `${BASE}
/* Ваши правила для h1 и p — ниже */
h1 {
  color: #6b3e1f;
  text-align: center;
  font-family: Georgia, serif;
  font-size: 2rem;
}
p {
  font-size: 18px;
  line-height: 1.5;
}
`
    }),
    k1202: t => ({
      html: `<h1>Меню кафе «Пенка»</h1>
<h2>Завтраки</h2>
<ul>
  <li>Сырники со сметаной — <span class="price">150 ₽</span></li>
  <li class="new">Овсяная каша с ягодами (новинка) — <span class="price">120 ₽</span></li>
  <li>Омлет с сыром — <span class="price">130 ₽</span></li>
</ul>
<h2>Напитки</h2>
<ul>
  <li class="new">Какао с зефиром (новинка) — <span class="price">110 ₽</span></li>
  <li>Чай чёрный — <span class="price">50 ₽</span></li>
</ul>
<p id="special">Блюдо дня: тыквенный суп с гренками</p>`,
      css: `${BASE}
h1 { color: #6b3e1f; }
h2 { color: #6b3e1f; }
li { line-height: 1.8; }
/* Ваши правила для .price, .new и #special — ниже */
.price {
  font-weight: bold;
  color: #1d5c3a;
}
.new {
  background-color: #fff3c4;
}
#special {
  font-size: 20px;
  text-align: center;
}
`
    }),
    k1203: t => ({
      html: `<h1>Объявления колледжа</h1>
<p class="warning">Завтра столовая закрыта на санобработку.</p>
<p>В библиотеку пришли новые учебники по веб-дизайну.</p>
<p class="warning">Сдайте медицинские справки до 1 октября.</p>
<p class="warning">Пропуск без студенческого билета не выдаётся.</p>
<p class="note">Объявления обновляются каждый понедельник.</p>`,
      css: `${BASE}
h1 {
  color: #1f4e79;
  text-align: center;
}
.warning {
  color: #8e1f14;
  font-weight: bold;
}
.note {
  font-size: 14px;
  color: #555555;
}
`
    })
  });
})();
/* ---- tools/solutions/k13.js ---- */
/* Занятие 13: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1301: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; }
h2 { color: #1f4e79; margin-top: 0; }
/* Правило для .card — ниже */
.card {
  box-sizing: border-box;
  width: 300px;
  padding: 16px 20px;
  border: 2px solid #1f4e79;
  border-radius: 8px;
  background-color: #f4f8fc;
  margin-bottom: 24px;
}
`
    }),
    k1302: t => ({
      html: t.html,
      css: `${BASE}
.block { border: 2px solid #1f4e79; padding: 16px; max-width: 520px; font-family: Georgia, serif; }
h2 { color: #1f4e79; margin-top: 0; }
p { color: #555555; }
.lead { color: #1d5c3a; font-size: 20px; }
.more { display: inline-block; padding: 8px 16px; margin-top: 12px; background-color: #1f4e79; color: #ffffff; }`
    }),
    k1303: t => ({
      html: t.html,
      css: `${BASE}
h1 { color: #1f4e79; margin-top: 0; }
p { line-height: 1.6; }
/* Правила для .page, .tag и .draft — ниже */
.page {
  box-sizing: border-box;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1ea;
}
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
  background-color: #1f4e79;
  color: #ffffff;
  border-radius: 4px;
}
.draft {
  display: none;
}
`
    })
  });
})();
/* ---- tools/solutions/k14.js ---- */
/* Занятие 14: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1401: t => ({
      html: t.html,
      css: `${BASE}
:root {
  --color-main: #1f4e79;
  --color-accent: #b3541e;
}
.header { border-bottom: 4px solid var(--color-main); margin-bottom: 16px; }
.header__title { color: var(--color-main); }
h2 { color: var(--color-main); }
a { color: var(--color-main); }
.note { border-left: 4px solid var(--color-accent); padding-left: 12px; }
.button { background-color: var(--color-accent); color: #ffffff; border: 0; padding: 10px 20px; font-size: 16px; }
.footer { border-top: 1px solid var(--color-main); margin-top: 24px; color: #555555; }`
    }),
    k1402: t => ({
      html: `<h1>Кружки колледжа</h1>
<div class="card">
  <h2 class="card__title">Робототехника</h2>
  <p class="card__text">Собираем роботов из конструктора. Вторник, 16:00.</p>
</div>
<div class="card">
  <h2 class="card__title">Веб-дизайн</h2>
  <p class="card__text">Рисуем макеты сайтов в Figma. Среда, 15:30.</p>
</div>
<div class="card card--accent">
  <h2 class="card__title">Шахматы</h2>
  <p class="card__text">Новый набор! Турнир каждую пятницу в 17:00.</p>
</div>`,
      css: `* { box-sizing: border-box; }
${BASE}
.card {
  width: 320px;
  padding: 16px;
  border: 1px solid #c9d3df;
  margin-bottom: 16px;
  background-color: #f5f8fb;
}
.card__title {
  margin-top: 0;
  font-size: 20px;
  color: #1f4e79;
}
.card--accent {
  border-color: #b3541e;
  border-width: 2px;
  background-color: #fff4ec;
}`
    }),
    k1403: t => ({
      html: t.html,
      css: `${t.css}
.menu__list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.menu__item {
  display: inline-block;
  margin-right: 16px;
}
.menu__link {
  color: var(--color-main);
  text-decoration: none;
  font-weight: bold;
}
.menu__link:hover { text-decoration: underline; }
.button {
  background-color: var(--color-main);
  color: #ffffff;
  border: 0;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}
.button:hover { background-color: var(--color-main-dark); }
a:focus-visible,
.button:focus-visible { outline: 3px solid var(--color-focus); }`
    })
  });
})();
/* ---- tools/solutions/k15.js ---- */
/* Занятие 15: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1501: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; font-size: 18px; line-height: 1.6; color: #222222; background: #ffffff; }
.article {
  max-width: 680px;
  margin: 0 auto;
}
h1, h2 { font-family: Georgia, "Times New Roman", serif; }
.article__title {
  font-size: 36px;
  line-height: 1.2;
  margin: 0 0 16px;
}
h2 {
  font-size: 26px;
  margin: 32px 0 12px;
}
p { margin: 0 0 16px; }
.article__lead {
  font-size: 22px;
  color: #444444;
}`
    }),
    k1502: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: #ffffff; }
:root {
  --color-text: #222222;
  --color-brand: #1f4e79;
  --color-muted: #595959;
  --color-note-bg: #fff4cc;
}
.article { max-width: 680px; margin: 0 auto; line-height: 1.6; }
h1 { color: var(--color-brand); }
.article__meta { color: var(--color-muted); font-size: 14px; }
.article a { color: var(--color-brand); text-decoration: underline; }
.article a:hover { color: var(--color-text); }
.article a:focus-visible { outline: 3px solid #f2a541; }
.article__note { background-color: var(--color-note-bg); color: var(--color-text); padding: 12px 16px; }`
    }),
    k1503: t => ({
      html: t.html,
      css: `${t.css}
.quote {
  margin: 24px 0;
  padding: 16px 24px;
  border-left: 4px solid #1f4e79;
  background-color: #eef3f8;
  font-style: italic;
  font-size: 20px;
}
.quote p { margin: 0 0 8px; }
cite {
  display: block;
  font-style: normal;
  font-size: 16px;
  color: #595959;
}
.tips, .steps { padding-left: 24px; }
.tips { list-style-type: square; }
li { margin-bottom: 8px; }
mark {
  background-color: #ffe58f;
  padding: 0 4px;
}`
    })
  });
})();
/* ---- tools/solutions/k16.js ---- */
/* Занятие 16: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1601: t => ({
      html: t.html,
      css: `${t.css}
.site-header {
  background-color: var(--color-dark);
  padding: 16px 24px;
}
.logo {
  display: inline-block;
  margin-right: 32px;
  color: var(--color-light);
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
}
.nav { display: inline-block; }
.nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav__item { display: inline-block; }
.nav__link {
  display: inline-block;
  padding: 8px 12px;
  color: var(--color-light);
  text-decoration: none;
}
.nav__link:hover { background-color: #34446b; }
.nav__link:focus-visible { outline: 3px solid var(--color-accent); }
.nav__link--active { border-bottom: 3px solid var(--color-accent); }`
    }),
    k1602: t => ({
      html: t.html,
      css: `${t.css}
.card {
  display: inline-block;
  vertical-align: top;
  width: 300px;
  margin: 0 16px 16px 0;
  padding: 24px;
  border: 1px solid #d0d7e2;
  border-radius: 12px;
  background-color: #ffffff;
}
.card__title {
  margin: 0 0 8px;
  font-size: 20px;
}
.card__price {
  font-size: 18px;
  font-weight: bold;
  color: #1f4e79;
}
.card--hit { border: 2px solid #b3541e; }
.card__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #b3541e;
  color: #ffffff;
  font-size: 14px;
}`
    }),
    k1603: t => ({
      html: t.html,
      css: `${t.css}
.button {
  margin-right: 8px;
  padding: 12px 24px;
  font-size: 16px;
  border: 2px solid #1f4e79;
  border-radius: 8px;
  background-color: #1f4e79;
  color: #ffffff;
  cursor: pointer;
}
.button:hover {
  background-color: #163a5a;
  border-color: #163a5a;
}
.button:focus-visible {
  outline: 3px solid #f2a541;
  outline-offset: 2px;
}
.button--secondary {
  background-color: #ffffff;
  color: #1f4e79;
}
.button--secondary:hover { background-color: #eef3f8; }
.button:disabled {
  background-color: #e1e5ea;
  border-color: #e1e5ea;
  color: #5a6470;
  cursor: not-allowed;
}
.site-footer {
  margin-top: 40px;
  padding: 24px;
  background-color: #1f2a44;
  color: #ffffff;
}
.site-footer__text {
  margin: 0;
  font-size: 14px;
}
.site-footer__link { color: #ffd166; }`
    })
  });
})();
/* ---- tools/solutions/k17.js ---- */
/* Занятие 17: эталонные решения */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1701: t => ({
      html: `<h1>Консультации по МДК.08.01</h1>
<p class="place">Кабинет 214, второй этаж</p>
<p id="info">Консультации проходят <strong>по понедельникам</strong></p>
<p id="teacher">Ведёт: <span class="teacher-name">Ирина Петровна</span></p>
<img src="${ICON}" width="48" height="48" alt="Календарь консультаций">
<p>Время на один вопрос: &lt; 10 минут.</p>`,
      css: t.css
    }),
    k1702: t => ({
      html: `<h1>Запись к терапевту</h1>
<img src="${ICON}" width="64" height="64" alt="Логотип поликлиники №3">
<p class="hint">Приём ведёт терапевт, кабинет 12.</p>
<form class="form" action="#" method="post">
  <label for="name">Ваше имя</label>
  <input id="name" name="name" type="text" placeholder="Анна">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel" placeholder="+7 900 000-00-00">
  <button class="button" type="submit">Записаться</button>
</form>
<p>Перед визитом прочитайте <a href="#rules">Правила приёма пациентов</a>.</p>`,
      css: `${BASE}
.hint { color: #595959; }
.form input { display: block; margin: 4px 0 12px; padding: 8px; font-size: 16px; }
.button { display: inline-block; padding: 10px 20px; background-color: #1f4e79; color: #ffffff; border: 0; font-size: 16px; }`
    }),
    k1703: t => ({
      html: `<img src="${ICON}" width="48" height="48" alt="Иконка колледжа">
<h1 class="title">Неделя открытых дверей</h1>
<p class="text">Приходите знакомиться с колледжем 20–24 октября.</p>
<p class="text">Наш девиз — <span lang="en">Learn by doing</span>: учимся на практике.</p>`,
      css: `${BASE}
.title { color: var(--brand, #1f4e79); font-family: "PT Sans", Arial, sans-serif; }
.text { font-family: "Fira Sans", Arial, sans-serif; font-size: 18px; }`
    })
  });
})();
/* ---- tools/solutions/k18.js ---- */
/* Занятие 18: эталонные решения */
(() => {
  const { IMG } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1801: t => ({
      html: `<header class="header">
  <p class="logo">Библиотека колледжа</p>
  <nav class="nav">
    <a href="#catalog">Каталог</a>
    <a href="#rules">Правила</a>
    <a href="#contacts">Контакты</a>
  </nav>
</header>
<main class="main">
  <article class="article">
    <h1>Как записаться в библиотеку</h1>
    <p>Возьмите студенческий билет и подойдите на абонемент. Читательский билет выдадут сразу.</p>
  </article>
  <aside class="aside">
    <h2>Часы работы</h2>
    <p>Пн–Пт, 9:00–18:00</p>
  </aside>
</main>
<footer class="footer">
  <p>© 2026 Библиотека колледжа</p>
</footer>`,
      css: t.css
    }),
    k1802: t => ({
      html: `<article data-category="events">
  <h2>День открытых дверей</h2>
  <p><time datetime="2026-10-15">15 октября 2026 года</time></p>
  <p>Приглашаем школьников и родителей. Начало в 11:00, <mark>вход свободный</mark>.</p>
  <figure>
    <img src="${IMG}" alt="Мастерская колледжа: столы и станки">
    <figcaption>Так выглядела мастерская в прошлом году</figcaption>
  </figure>
</article>`,
      css: t.css
    }),
    k1803: t => ({
      html: `<h1>Пробная тренировка</h1>
<form class="form" action="#" method="post">
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" required>
  <label for="email">Почта</label>
  <input id="email" name="email" type="email" required>
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel">
  <label for="date">Дата тренировки</label>
  <input id="date" name="date" type="date" min="2026-11-01">
  <label for="guests">Сколько человек придёт</label>
  <input id="guests" name="guests" type="number" min="1" max="5">
  <button type="submit">Записаться</button>
</form>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k19.js ---- */
/* Занятие 19: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k1901: t => ({
      html: t.html,
      css: `${t.css}
nav > ul {
  list-style: none;
  padding: 0;
}
nav li {
  display: inline-block;
  margin-right: 16px;
}
nav a {
  color: #1f4e79;
  text-decoration: none;
}
h2 + p { font-size: 20px; }`
    }),
    k1902: t => ({
      html: t.html,
      css: `${t.css}
thead th {
  background-color: #1f4e79;
  color: #ffffff;
}
tbody tr:nth-child(even) { background-color: #eef3f8; }
tbody td:first-child { font-weight: bold; }
ul {
  list-style: none;
  padding: 0;
}
li { padding: 8px 0; }
li:not(:last-child) { border-bottom: 1px solid #c9d3df; }`
    }),
    k1903: t => ({
      html: t.html,
      css: `${t.css}
a[href^="https"]::after { content: " ↗"; }
a[href^="mailto:"]::before { content: "✉ "; }
a[href^="tel:"] { font-weight: bold; }
input[type="email"] { border: 2px solid #1f4e79; }
h2::first-letter {
  color: #b3541e;
  font-size: 32px;
}`
    })
  });
})();
/* ---- tools/solutions/k20.js ---- */
/* Занятие 20: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2001: t => ({
      html: t.html,
      css: `${BASE}
.cover {
  padding: 48px 24px;
  border-radius: 16px;
  background-color: #2a2238;
  background-image: url("img/art.svg");
  background-size: cover;
  background-position: center;
  color: #ffffff;
}
.cover__badge {
  display: inline-block;
  margin: 0;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
}
.cover__title {
  margin: 16px 0 8px;
  font-size: 36px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}`
    }),
    k2002: t => ({
      html: t.html,
      css: `${BASE}
.card {
  width: 260px;
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.card__img {
  display: block;
  width: 100%;
  border-radius: 8px;
}
.card__btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #8a3b12;
  color: #ffffff;
  text-decoration: none;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.card__btn:hover {
  transform: translateY(-2px);
  background-color: #5c260b;
}`
    }),
    k2003: t => ({
      html: t.html,
      css: `${BASE}
@font-face {
  font-family: "Golos";
  src: url("fonts/golos-text-cyrillic-400-normal.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@keyframes pulse {
  from { transform: scale(1); }
  50% { transform: scale(1.1); }
  to { transform: scale(1); }
}
.promo {
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff8e1;
  font-family: "Golos", Arial, sans-serif;
}
.promo__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #ffd54f;
  color: #222222;
  font-size: 14px;
  animation: pulse 1.5s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .promo__badge {
    animation: none;
  }
}`
    })
  });
})();
/* ---- tools/solutions/k21.js ---- */
/* Занятие 21: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2101: t => ({
      html: t.html,
      css: `${BASE}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #1f2a44;
}
.header__logo {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.menu a {
  color: #ffffff;
  text-decoration: none;
}`
    }),
    k2102: t => ({
      html: t.html,
      css: `${BASE}
.plans__list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.plan {
  flex: 1 1 220px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.plan h3 {
  margin-top: 0;
}
.plan__price {
  margin-bottom: 0;
  font-weight: bold;
  color: #1f2a44;
}`
    }),
    k2103: t => ({
      html: t.html,
      css: `${BASE}
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #e8f0fe;
}
.notice {
  max-width: 320px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.notice__title {
  margin-top: 0;
  font-size: 28px;
}
.notice__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
}
.btn--light {
  background-color: #e8f0fe;
  color: #1a3d7a;
}`
    })
  });
})();
/* ---- tools/solutions/k22.js ---- */
/* Занятие 22: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2201: t => ({
      html: t.html,
      css: `${BASE}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.gallery figure {
  margin: 0;
}
.gallery img {
  display: block;
  width: 100%;
  height: auto;
}
figcaption {
  margin-top: 6px;
  font-size: 14px;
  color: #555555;
}`
    }),
    k2202: t => ({
      html: t.html,
      css: `${BASE}
.page {
  display: grid;
  gap: 16px;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "aside"
    "footer";
}
.page > * {
  padding: 16px;
  border-radius: 8px;
}
.page p {
  margin: 0;
}
.page__header { grid-area: header; }
.page__nav { grid-area: nav; }
.page__main { grid-area: main; }
.page__aside { grid-area: aside; }
.page__footer { grid-area: footer; }
.page__header,
.page__footer {
  background-color: #1f2a44;
  color: #ffffff;
}
.page__nav,
.page__aside {
  background-color: #f1f4fa;
}
.page__nav ul {
  margin: 0;
  padding-left: 20px;
}
.page__main h1 {
  margin-top: 0;
}
@media (min-width: 768px) {
  .page {
    grid-template-columns: 200px 1fr 200px;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
  }
}`
    }),
    k2203: t => ({
      html: t.html,
      css: `${BASE}
.layout {
  display: grid;
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}
.post__img {
  display: block;
  max-width: 100%;
  height: auto;
}
.sidebar {
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f4fa;
}
.sidebar h2 {
  margin-top: 0;
}
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 2fr 1fr;
  }
}`
    })
  });
})();
/* ---- tools/solutions/k23.js ---- */
/* Занятие 23: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  const card = (alt, title, text, price) => `    <article class="product">
      <img class="product__img" src="img/art.svg" alt="${alt}">
      <div class="product__body">
        <h3>${title}</h3>
        <p>${text}</p>
        <p class="product__price">${price}</p>
        <a class="product__btn" href="#order">В заказ</a>
      </div>
    </article>`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2301: t => ({
      html: `<header class="header">
  <a class="header__logo" href="#top">Зерно</a>
  <nav>
    <ul class="menu">
      <li><a href="#menu">Меню</a></li>
      <li><a href="#about">О нас</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
</header>
<section class="hero">
  <h1>Кофе, который ждёт вас между парами</h1>
  <p>Свежая обжарка, выпечка каждое утро и скидка по студенческому билету.</p>
  <a class="btn" href="#menu">Посмотреть меню</a>
</section>`,
      css: `${BASE}
${PALETTE}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 64px 32px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 44px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.btn:hover {
  background-color: #7d3f14;
}`
    }),
    k2302: t => ({
      html: t.html.replace('    <!-- Третье преимущество «Есть розетки»: напишите по образцу -->', `    <li class="feature">
      <img class="feature__icon" src="img/icon.svg" alt="">
      <h3>Есть розетки</h3>
      <p>У каждого стола можно зарядить ноутбук и телефон.</p>
    </li>`),
      css: `${BASE}
${PALETTE}
.features h2 {
  color: var(--coffee);
}
.features__list {
  display: flex;
  gap: 24px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 24px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature__icon {
  display: block;
  width: 48px;
  height: 48px;
}
.feature h3 {
  margin: 12px 0 8px;
  color: var(--coffee);
}
.feature p {
  margin: 0;
}`
    }),
    k2303: t => ({
      html: t.html.replace('    <!-- Добавьте ещё четыре карточки: Американо 120 ₽, Какао 140 ₽, Чай с чабрецом 90 ₽, Сырник 110 ₽ -->', [
        card('Американо в бумажном стакане', 'Американо', 'Эспрессо и горячая вода. 300 мл.', '120 ₽'),
        card('Какао с маршмеллоу', 'Какао', 'Горячий шоколадный напиток на молоке. 300 мл.', '140 ₽'),
        card('Чайник с травяным чаем', 'Чай с чабрецом', 'Чёрный чай с чабрецом, чайник на двоих.', '90 ₽'),
        card('Сырник со сметаной', 'Сырник', 'Из творога, со сметаной или вареньем.', '110 ₽')
      ].join('\n')),
      css: `${BASE}
${PALETTE}
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product__img {
  display: block;
  width: 100%;
  height: auto;
}
.product__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}
.product h3 {
  margin: 0 0 8px;
}
.product__price {
  font-weight: bold;
  color: var(--coffee);
}
.product__btn {
  margin-top: auto;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer a {
  color: var(--cream);
}`
    })
  });
})();
/* ---- tools/solutions/k24.js ---- */
/* Занятие 24: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const PALETTE = `:root {
  --coffee: #3b2416;
  --accent: #a4541c;
  --cream: #fdf6ee;
}`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2401: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон: базовые стили */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
}
.header a {
  color: var(--coffee);
  text-decoration: none;
}
.header__logo {
  font-size: 28px;
  font-weight: bold;
}
.menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.hero {
  padding: 32px 20px;
  border-radius: 16px;
  background-color: #3b2416;
  background-image: linear-gradient(135deg, #3b2416, #6b3d1f);
  color: #ffffff;
}
.hero h1 {
  margin-top: 0;
  font-size: 30px;
}
.btn {
  display: block;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--accent);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
}

/* Планшет и компьютер */
@media (min-width: 768px) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .menu {
    gap: 24px;
  }
  .hero {
    padding: 64px 48px;
  }
  .hero h1 {
    font-size: 48px;
  }
  .btn {
    display: inline-block;
  }
}`
    }),
    k2402: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон */
.features__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.feature {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--cream);
}
.feature h3 {
  margin-top: 0;
  color: var(--coffee);
}
.catalog__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
.product {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.product img {
  display: block;
  width: 100%;
  height: auto;
}
.product h3,
.product p {
  margin: 12px 16px;
}

/* Планшет */
@media (min-width: 768px) {
  .features__list {
    flex-direction: row;
    gap: 24px;
  }
  .catalog__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Компьютер */
@media (min-width: 1280px) {
  .catalog__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`
    }),
    k2403: t => ({
      html: t.html,
      css: `${BASE}
${PALETTE}
/* Телефон */
.about {
  display: grid;
  gap: 24px;
}
.about__img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}
.about__text h2 {
  color: var(--coffee);
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 32px;
  padding: 16px 24px;
  background-color: var(--coffee);
  color: var(--cream);
}
.footer p {
  margin: 0;
}
.footer a {
  color: var(--cream);
}
.footer__mail {
  overflow-wrap: anywhere;
}

/* Планшет и компьютер */
@media (min-width: 768px) {
  .about {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
  .footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}`
    })
  });
})();
/* ---- tools/solutions/k25.js ---- */
/* Занятие 25: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2501: t => ({
      html: t.html,
      css: `${t.css}
.tariff {
  max-width: 320px;
  padding: 16px;
  border: 2px solid #1a56b0;
  border-radius: 12px;
}
.tariff__title {
  margin: 0 0 8px;
  color: #1a56b0;
}
.tariff__price {
  font-size: 24px;
  font-weight: bold;
}
.tariff__btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #1a56b0;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
}
.tariff__btn:hover {
  background-color: #123d7d;
}`
    }),
    k2502: t => ({
      html: t.html,
      css: `${BASE}
.container {
  max-width: 1140px;
  margin: 0 auto;
}
.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
.col-12 {
  grid-column: span 12;
}
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
}
@media (min-width: 768px) {
  .col-md-6 {
    grid-column: span 6;
  }
  .col-md-4 {
    grid-column: span 4;
  }
}`
    }),
    k2503: t => ({
      html: `<main>
  <h1>Консультации по МДК.08.01</h1>
  <p>Выберите удобное время и нажмите «Записаться».</p>
</main>
<div class="modal">
  <section class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Вы записаны</h2>
    <p>Консультация в среду в 15:00, кабинет 214. Напоминание придёт на почту.</p>
    <button class="modal__close" type="button" aria-label="Закрыть">×</button>
  </section>
</div>`,
      css: `${BASE}
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
}
.modal__dialog {
  position: relative;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
}
.modal__dialog h2 {
  margin-top: 0;
}
.modal__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background-color: #eeeeee;
  color: #222222;
  font-size: 20px;
  cursor: pointer;
}`
    })
  });
})();
/* ---- tools/solutions/k26.js ---- */
/* Занятие 26: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2601: t => ({
      html: `<!-- Страница 404 кофейни «Зерно».
     Всё содержимое — внутри main с классом not-found. -->
<main class="not-found">
  <p class="code">404</p>
  <h1>Страница не найдена</h1>
  <p>Возможно, страницу переименовали или в адресе опечатка.</p>
  <p><a href="index.html">Перейти на главную</a></p>
  <nav aria-label="Популярные разделы">
    <ul>
      <li><a href="menu.html">Меню и цены</a></li>
      <li><a href="contacts.html">Как нас найти</a></li>
    </ul>
  </nav>
</main>`,
      css: t.css
    }),
    k2602: t => ({
      html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Кофейня «Зерно» у колледжа — меню и цены</title>
  <meta name="description" content="Кофе, выпечка и обеды для студентов в двух минутах от колледжа. Скидка 10% по студенческому, открыты с 8:00.">
</head>
<body>
  <h1>Кофейня «Зерно»</h1>
  <p>Кофе, выпечка и обеды в двух минутах от колледжа. Скидка 10% по студенческому билету.</p>
</body>
</html>`,
      css: t.css
    }),
    k2603: t => ({
      html: `<header class="site-header">
  <img src="img/icon.svg" alt="Кофейня «Зерно»" width="48" height="48">
  <nav aria-label="Главное меню">
    <ul class="menu">
      <li><a href="index.html">Главная</a></li>
      <li><a href="menu.html">Меню</a></li>
      <li><a href="contacts.html">Контакты</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Кофейня «Зерно»</h1>
  <img class="photo" src="img/art.svg" alt="Зал кофейни вечером" width="600" height="300">
  <p>Мы в двух минутах от колледжа. <a href="https://yandex.ru/maps">Посмотреть на карте</a></p>
</main>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k27.js ---- */
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
/* ---- tools/solutions/k28.js ---- */
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
/* ---- tools/solutions/k29.js ---- */
/* Занятие 29: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k2901: t => ({
      html: t.html,
      css: `${t.css}@media (min-width: 768px) {
  .burger { display: none; }
  nav { flex-basis: auto; }
  .menu, .menu[hidden] { display: flex; gap: 24px; }
}`,
      js: `// Меню-бургер
const burger = document.querySelector('#burger');
const menu = document.querySelector('#menu');

burger.addEventListener('click', function () {
  menu.hidden = !menu.hidden;
  if (menu.hidden) {
    burger.setAttribute('aria-expanded', 'false');
    burger.textContent = 'Меню';
  } else {
    burger.setAttribute('aria-expanded', 'true');
    burger.textContent = 'Закрыть';
  }
});
`
    }),
    k2902: t => ({
      html: t.html, css: t.css,
      js: `// Вкладки
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

for (const tab of tabs) {
  tab.addEventListener('click', function () {
    for (const other of tabs) {
      other.classList.remove('active');
      other.setAttribute('aria-selected', 'false');
    }
    for (const panel of panels) {
      panel.hidden = true;
    }
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.querySelector('#' + tab.getAttribute('aria-controls'));
    panel.hidden = false;
  });
}
`
    }),
    k2903: t => ({
      html: t.html, css: t.css,
      js: `// Вопрос-ответ и «Показать ещё»
const questions = document.querySelectorAll('.faq-question');
const more = document.querySelector('#more');

for (const question of questions) {
  question.addEventListener('click', function () {
    const answer = document.querySelector('#' + question.getAttribute('aria-controls'));
    answer.hidden = !answer.hidden;
    if (answer.hidden) {
      question.setAttribute('aria-expanded', 'false');
    } else {
      question.setAttribute('aria-expanded', 'true');
    }
  });
}

more.addEventListener('click', function () {
  for (const item of document.querySelectorAll('.extra')) {
    item.hidden = false;
  }
  more.hidden = true;
});
`
    })
  });
})();
/* ---- tools/solutions/k30.js ---- */
/* Занятие 30: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3001: t => ({
      html: t.html, css: t.css,
      js: `// Проверка имени и почты
const form = document.querySelector('#signup');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Введите имя';
    nameInput.setAttribute('aria-invalid', 'true');
  } else {
    nameError.textContent = '';
    nameInput.setAttribute('aria-invalid', 'false');
  }

  const email = emailInput.value.trim();
  if (email === '') {
    emailError.textContent = 'Введите почту';
    emailInput.setAttribute('aria-invalid', 'true');
  } else if (!email.includes('@') || !email.includes('.')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    emailError.textContent = '';
    emailInput.setAttribute('aria-invalid', 'false');
  }
});
`
    }),
    k3002: t => ({
      html: t.html, css: t.css,
      js: `// Регистрация: проверка трёх полей
function setError(input, errorEl, message) {
  errorEl.textContent = message;
  if (message === '') {
    input.setAttribute('aria-invalid', 'false');
  } else {
    input.setAttribute('aria-invalid', 'true');
  }
}

const form = document.querySelector('#register');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let valid = true;

  if (nameInput.value.trim() === '') {
    setError(nameInput, nameError, 'Введите имя');
    valid = false;
  } else {
    setError(nameInput, nameError, '');
  }

  const email = emailInput.value.trim();
  if (email === '') {
    setError(emailInput, emailError, 'Введите почту');
    valid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    setError(emailInput, emailError, 'Почта должна быть в формате name@mail.ru');
    valid = false;
  } else {
    setError(emailInput, emailError, '');
  }

  if (passwordInput.value.length < 8) {
    setError(passwordInput, passwordError, 'Пароль — не меньше 8 символов');
    valid = false;
  } else {
    setError(passwordInput, passwordError, '');
  }

  if (valid) {
    result.textContent = 'Заявка отправлена';
  } else {
    result.textContent = '';
  }
});
`
    }),
    k3003: t => ({
      html: t.html, css: t.css,
      js: `// Проверка формы входа
const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const result = document.querySelector('#result');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let valid = true;

  if (!email.value.includes('@') || !email.value.includes('.')) {
    emailError.textContent = 'Почта должна быть в формате name@mail.ru';
    email.setAttribute('aria-invalid', 'true');
    valid = false;
  } else {
    emailError.textContent = '';
    email.setAttribute('aria-invalid', 'false');
  }

  if (password.value.length < 8) {
    passwordError.textContent = 'Пароль — не меньше 8 символов';
    password.setAttribute('aria-invalid', 'true');
    valid = false;
  } else {
    passwordError.textContent = '';
    password.setAttribute('aria-invalid', 'false');
  }

  if (valid) {
    result.textContent = 'Заявка отправлена';
  } else {
    result.textContent = '';
  }
});
`
    })
  });
})();
/* ---- tools/solutions/k31.js ---- */
/* Занятие 31: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3101: t => ({
      html: `<main class="gallery-page">
  <h1>Фотографии с выпускного</h1>
  <p>Июнь, актовый зал и двор колледжа.</p>
  <div class="gallery">
    <img src="img/art.svg" alt="Актовый зал перед началом вечера" width="600" height="300">
    <img src="img/art.svg" alt="Выпускники получают дипломы на сцене" width="600" height="300" loading="lazy">
    <img src="img/art.svg" alt="Общее фото группы у входа" width="600" height="300" loading="lazy">
    <img src="img/art.svg" alt="Выпускники во дворе колледжа" width="600" height="300" loading="lazy">
  </div>
</main>`,
      css: `${BASE}
.gallery { display: grid; gap: 12px; }
.gallery img { max-width: 100%; height: auto; }`
    }),
    k3102: t => ({
      html: `<header class="hero">
  <h1>Кофейня «Зерно»</h1>
  <picture>
    <source media="(min-width: 768px)" srcset="img/course/k31-wide.svg">
    <img class="hero-img" src="img/course/k31-square.svg" alt="Зал кофейни вечером" width="600" height="600">
  </picture>
</header>
<main>
  <article class="card">
    <img class="card-img" src="img/course/k31-card-480.svg"
         srcset="img/course/k31-card-480.svg 480w, img/course/k31-card-960.svg 960w"
         sizes="(min-width: 768px) 50vw, 100vw"
         alt="Шоколадный торт с вишней" width="480" height="320">
    <h2>Торт дня</h2>
    <p>Шоколадный бисквит, вишня и сливочный крем. 180 рублей за кусочек.</p>
  </article>
</main>`,
      css: t.css
    }),
    k3103: t => ({
      html: t.html.replace(/alt="иконка"/g, 'alt="" width="24" height="24"'),
      css: `${BASE}
.hero { padding: 64px 24px; border-radius: 12px; background-color: #2a2238; background-image: url("img/art.svg"); background-size: cover; background-position: center; color: #ffffff; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.card { border: 1px solid #cccccc; border-radius: 8px; overflow: hidden; }
.card img { display: block; width: 100%; height: 180px; object-fit: cover; }
.card h3 { margin: 12px 16px; }
.contacts ul { padding: 0; list-style: none; }
.contacts li { margin: 8px 0; }
.contacts img { margin-right: 8px; vertical-align: middle; }`
    })
  });
})();
/* ---- tools/solutions/k32.js ---- */
/* Занятие 32: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3201: t => ({
      html: t.html,
      css: `${BASE}
.banner {
  box-sizing: border-box;
  width: 728px;
  height: 90px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(90deg, #2b1a66, #7a1f5c);
  color: #ffffff;
}

.banner__title { margin: 0; font-size: 24px; }
.banner__text { margin: 0; }

.banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
}`
    }),
    k3202: () => ({
      html: `<aside class="promo">
  <h2 class="promo__title">Пробный урок по веб-дизайну</h2>
  <p class="promo__text">Сделаете свой первый макет в Figma за 2 часа</p>
  <a class="promo__button" href="#signup">Записаться бесплатно</a>
</aside>`,
      css: `${BASE}
.promo {
  box-sizing: border-box;
  width: 300px;
  height: 250px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: linear-gradient(160deg, #0b3d5c, #3c1f6b);
  color: #ffffff;
}
.promo__title { margin: 0; font-size: 22px; }
.promo__text { margin: 0 0 8px; }
.promo__button {
  padding: 12px 16px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;
}
.promo__button:hover { background: #ffe8a3; }
.promo__button:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }`
    }),
    k3203: t => ({
      html: t.html,
      css: `${BASE}
/* Сначала телефон: всё столбиком */
.hero-banner {
  box-sizing: border-box;
  max-width: 728px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  background: linear-gradient(135deg, #1d3557, #6a2c70);
  color: #ffffff;
  border-radius: 16px;
  animation: banner-in 0.6s ease-out;
}
.hero-banner__title { margin: 0 0 8px; font-size: 24px; }
.hero-banner__text { margin: 0; }
.hero-banner__button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #ffd166;
  color: #222222;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
}

@keyframes banner-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* С 768px — в ряд */
@media (min-width: 768px) {
  .hero-banner { flex-direction: row; align-items: center; gap: 24px; }
  .hero-banner__button { white-space: nowrap; }
}

/* Меньше движения для тех, кого анимация утомляет */
@media (prefers-reduced-motion: reduce) {
  .hero-banner { animation: none; }
}`
    })
  });
})();
/* ---- tools/solutions/k33.js ---- */
/* Занятие 33: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3301: t => ({
      html: `<h1>Кем работает веб-дизайнер</h1>
<section class="specs">
  <article class="spec">
    <h2>UI-дизайнер</h2>
    <p>Рисует экраны: кнопки, поля, карточки, иконки. Следит, чтобы всё было единым по стилю.</p>
  </article>
  <article class="spec">
    <h2>UX-дизайнер</h2>
    <p>Продумывает путь человека по сайту: какие шаги, в каком порядке, где он может запутаться.</p>
  </article>
  <article class="spec">
    <h2>Продуктовый дизайнер</h2>
    <p>Отвечает за весь сервис целиком: и интерфейс, и пользу для людей, и цели бизнеса.</p>
  </article>
  <article class="spec">
    <h2>Графический веб-дизайнер</h2>
    <p>Делает баннеры, иллюстрации, обложки и графику для сайтов и соцсетей.</p>
  </article>
  <article class="spec">
    <h2>Моушн-дизайнер</h2>
    <p>Оживляет интерфейс: анимации кнопок, переходы между экранами, короткие ролики.</p>
  </article>
</section>`,
      css: `${BASE}
.specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}
.spec {
  padding: 16px;
  border: 1px solid #c9c9d6;
  border-radius: 12px;
  background: #f6f6fb;
}
.spec h2 { margin: 0 0 8px; font-size: 20px; color: #3b2a7a; }
.spec p { margin: 0; line-height: 1.5; }`
    }),
    k3302: () => ({
      html: `<header>
  <h1>Анна Смирнова</h1>
  <p class="role">Начинающий веб-дизайнер: сайты для кафе, библиотек и спортклубов</p>
</header>
<section class="works">
  <h2>Работы</h2>
  <div class="works-list">
    <figure>
      <img src="img/art.svg" alt="Главная страница сайта кофейни с фотографией зала">
      <figcaption>Сайт кофейни «Зерно»</figcaption>
    </figure>
    <figure>
      <img src="img/art.svg" alt="Каталог книг библиотеки колледжа с фильтром">
      <figcaption>Каталог библиотеки колледжа</figcaption>
    </figure>
    <figure>
      <img src="img/art.svg" alt="Экран записи на тренировку в спортзал">
      <figcaption>Запись в спортзал</figcaption>
    </figure>
  </div>
</section>
<footer>
  <p>Пишите: <a href="mailto:anna@example.ru">anna@example.ru</a></p>
</footer>`,
      css: `${BASE}
.role { color: #555555; }
.works-list {
  display: grid;
  gap: 24px;
}
figure { margin: 0; }
.works img { max-width: 100%; height: auto; border-radius: 8px; }
figcaption { margin-top: 8px; font-weight: bold; }
footer { margin-top: 32px; }

@media (min-width: 768px) {
  .works-list { grid-template-columns: repeat(3, 1fr); }
}`
    }),
    k3303: () => ({
      html: `<h1>Юзабилити по Якобу Нильсену</h1>
<dl>
  <dt>Обучаемость</dt>
  <dd>Насколько легко новичку сделать простое дело с первого раза.</dd>
  <dt>Эффективность</dt>
  <dd>Как быстро опытный пользователь выполняет задачу.</dd>
  <dt>Запоминаемость</dt>
  <dd>Легко ли вспомнить, как пользоваться сайтом, после перерыва.</dd>
  <dt>Ошибки</dt>
  <dd>Сколько ошибок делают люди, насколько они серьёзны и легко ли их исправить.</dd>
  <dt>Удовлетворённость</dt>
  <dd>Приятно ли пользоваться сайтом.</dd>
</dl>`,
      css: `${BASE}
dt { margin-top: 16px; font-weight: bold; color: #3b2a7a; }
dd { margin: 4px 0 0 24px; line-height: 1.5; }`
    })
  });
})();
/* ---- tools/solutions/k34.js ---- */
/* Занятие 34: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3401: t => ({
      html: `<h1>Как студия делает сайт</h1>
<ol class="stages">
  <li><strong>Бриф и анализ</strong> — расспрашиваем заказчика, изучаем аудиторию и конкурентов.</li>
  <li><strong>Техническое задание</strong> — записываем все требования к сайту в один документ.</li>
  <li><strong>Прототип</strong> — рисуем схемы страниц серыми блоками.</li>
  <li><strong>Дизайн</strong> — рисуем макеты в цвете и собираем стайлгайд.</li>
  <li><strong>Вёрстка</strong> — переводим макет в HTML и CSS.</li>
  <li><strong>Программирование</strong> — добавляем JavaScript, формы, связь с сервером.</li>
  <li><strong>Тестирование</strong> — проверяем сайт в разных браузерах и на телефонах.</li>
  <li><strong>Запуск</strong> — переносим сайт на хостинг и подключаем домен.</li>
  <li><strong>Поддержка</strong> — обновляем тексты, делаем резервные копии, чиним ошибки.</li>
</ol>`,
      css: t.css
    }),
    k3402: () => ({
      html: `<h1>Над сайтом работает команда</h1>
<table>
  <caption>Кто отвечает за каждый этап</caption>
  <thead>
    <tr><th scope="col">Этап</th><th scope="col">Кто отвечает</th><th scope="col">Результат</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Бриф и анализ</th><td>Менеджер проекта, дизайнер</td><td>Заполненный бриф, список конкурентов</td></tr>
    <tr><th scope="row">Техническое задание</th><td>Менеджер, аналитик</td><td>Документ ТЗ, подписанный заказчиком</td></tr>
    <tr><th scope="row">Прототип</th><td>UX-дизайнер</td><td>Схемы страниц серыми блоками</td></tr>
    <tr><th scope="row">Дизайн</th><td>UI-дизайнер</td><td>Макеты всех экранов и стайлгайд</td></tr>
    <tr><th scope="row">Вёрстка</th><td>Верстальщик</td><td>HTML- и CSS-файлы страниц</td></tr>
    <tr><th scope="row">Тестирование</th><td>Тестировщик</td><td>Список найденных ошибок</td></tr>
    <tr><th scope="row">Запуск</th><td>Разработчик</td><td>Сайт работает по своему адресу</td></tr>
  </tbody>
</table>`,
      css: `${BASE}
table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px 12px; border: 1px solid #b9b9c9; text-align: left; vertical-align: top; }
thead th { background: #ece8f8; }`
    }),
    k3403: t => ({
      html: `<h1>Бриф: сайт кофейни «Зерно»</h1>
<nav>
  <ul>
    <li><a href="#goal">Цель сайта</a></li>
    <li><a href="#audience">Целевая аудитория</a></li>
    <li><a href="#rivals">Конкуренты</a></li>
    <li><a href="#structure">Структура</a></li>
    <li><a href="#design">Требования к дизайну</a></li>
    <li><a href="#adaptive">Адаптивность</a></li>
    <li><a href="#content">Контент</a></li>
  </ul>
</nav>
<section id="goal">
  <h2>Цель сайта</h2>
  <p>Студент заказывает кофе навынос за минуту и забирает его на перемене без очереди.</p>
</section>
<section id="audience">
  <h2>Целевая аудитория</h2>
  <ul>
    <li>Студенты колледжа 16–20 лет, заказывают с телефона между парами.</li>
    <li>Преподаватели, заказывают с компьютера в учительской.</li>
  </ul>
</section>
<section id="rivals">
  <h2>Конкуренты</h2>
  <ul>
    <li>Сетевая кофейня у метро: удобный заказ в приложении, но далеко.</li>
    <li>Столовая колледжа: дёшево, но нет предзаказа.</li>
  </ul>
</section>
<section id="structure">
  <h2>Структура</h2>
  <ol>
    <li>Главная</li>
    <li>Меню</li>
    <li>Корзина и оформление заказа</li>
    <li>О кофейне и контакты</li>
  </ol>
</section>
<section id="design">
  <h2>Требования к дизайну</h2>
  <ul>
    <li>Тёплая палитра: кофейный, сливочный, один яркий акцент для кнопок.</li>
    <li>Крупные кнопки «В корзину», удобные для пальца.</li>
    <li>Фотографии напитков, без стоковых людей.</li>
  </ul>
</section>
<section id="adaptive">
  <h2>Адаптивность</h2>
  <ul>
    <li>Телефон — 360px, главный вариант.</li>
    <li>Планшет — 768px.</li>
    <li>Компьютер — 1440px.</li>
  </ul>
</section>
<section id="content">
  <h2>Контент</h2>
  <p>Тексты и цены даёт заказчик до начала дизайна, фотографии напитков снимаем сами.</p>
</section>`,
      css: t.css
    })
  });
})();
/* ---- tools/solutions/k35.js ---- */
/* Занятие 35: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3501: t => ({
      html: `<h1>Файлы сайта кофейни «Зерно»</h1>
<ul class="tree">
  <li><code>cafe-site/</code>
    <ul>
      <li><code>index.html</code></li>
      <li><code>menu.html</code></li>
      <li><code>contacts.html</code></li>
      <li><code>css/</code>
        <ul>
          <li><code>style.css</code></li>
        </ul>
      </li>
      <li><code>js/</code>
        <ul>
          <li><code>script.js</code></li>
        </ul>
      </li>
      <li><code>img/</code>
        <ul>
          <li><code>logo.svg</code></li>
          <li><code>hero.jpg</code></li>
          <li><code>icons/</code>
            <ul>
              <li><code>cart.svg</code></li>
            </ul>
          </li>
        </ul>
      </li>
      <li><code>fonts/</code>
        <ul>
          <li><code>roboto.woff2</code></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>`,
      css: t.css
    }),
    k3502: t => ({
      html: `<h1>Переименование файлов</h1>
<table>
  <thead>
    <tr><th scope="col">Было</th><th scope="col">Стало</th></tr>
  </thead>
  <tbody>
    <tr><td>Главная Страница.HTML</td><td><code>index.html</code></td></tr>
    <tr><td>Style.CSS</td><td><code>style.css</code></td></tr>
    <tr><td>мой скрипт.js</td><td><code>script.js</code></td></tr>
    <tr><td>Фото_кафе (1).JPG</td><td><code>cafe-photo-1.jpg</code></td></tr>
    <tr><td>Логотип Зерно.svg</td><td><code>logo-zerno.svg</code></td></tr>
    <tr><td>Баннер Весна 2025.PNG</td><td><code>banner-spring-2025.png</code></td></tr>
  </tbody>
</table>`,
      css: t.css
    }),
    k3503: () => ({
      html: `<h1>Графика для сайта кофейни</h1>
<div class="kinds">
  <section>
    <h2>Растровая графика</h2>
    <ul>
      <li>Фотография капучино — <code>webp</code></li>
      <li>Фото зала кофейни — <code>jpg</code></li>
      <li>Скриншот приложения — <code>png</code></li>
      <li>Фоновая фотография зёрен — <code>webp</code></li>
    </ul>
  </section>
  <section>
    <h2>Векторная графика</h2>
    <ul>
      <li>Логотип кофейни — <code>svg</code></li>
      <li>Иконка корзины — <code>svg</code></li>
      <li>Стрелка «наверх» — <code>svg</code></li>
    </ul>
  </section>
</div>`,
      css: `${BASE}
.kinds {
  display: grid;
  gap: 24px;
}
.kinds section {
  padding: 16px;
  border: 1px solid #c9c2e0;
  border-radius: 12px;
}
.kinds h2 { margin-top: 0; color: #3b2a7a; }

@media (min-width: 768px) {
  .kinds { grid-template-columns: 1fr 1fr; }
}`
    })
  });
})();
/* ---- tools/solutions/k36.js ---- */
/* Занятие 36: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3601: () => ({
      html: `<h1>Персона: для кого делаем сайт библиотеки</h1>
<article class="persona">
  <img src="img/icon.svg" alt="Условный портрет Марины" width="64" height="64">
  <h2>Марина, 17 лет</h2>
  <p class="role">Студентка первого курса, живёт за городом, в колледж ездит на электричке</p>
  <h3>Цели</h3>
  <ul>
    <li>Узнать, есть ли нужный учебник, не заходя в библиотеку.</li>
    <li>Продлить книгу, если не успевает её вернуть.</li>
  </ul>
  <h3>Что мешает</h3>
  <ul>
    <li>Каталог есть только на бумаге, в читальном зале.</li>
    <li>Библиотека закрыта, когда Марина уезжает домой.</li>
  </ul>
  <blockquote>«Пока выяснишь, есть ли учебник, перемена уже закончилась».</blockquote>
</article>`,
      css: `${BASE}
.persona {
  box-sizing: border-box;
  max-width: 480px;
  padding: 24px;
  border: 1px solid #c9c2e0;
  border-radius: 16px;
  background: #faf9fe;
}
.persona h2 { margin: 8px 0 0; }
.role { margin: 4px 0 16px; color: #555555; }
.persona h3 { margin: 16px 0 8px; color: #3b2a7a; }
.persona ul { margin: 0; padding-left: 20px; }
.persona blockquote { margin: 16px 0 0; padding-left: 16px; border-left: 4px solid #3b2a7a; font-style: italic; }`
    }),
    k3602: t => ({
      html: `<h1>Карта сайта библиотеки колледжа</h1>
<nav aria-label="Карта сайта">
  <ul>
    <li><a href="#">Главная</a>
      <ul>
        <li><a href="#">Каталог</a>
          <ul>
            <li><a href="#">Учебники</a></li>
            <li><a href="#">Художественная литература</a></li>
            <li><a href="#">Периодика</a></li>
          </ul>
        </li>
        <li><a href="#">Электронная библиотека</a></li>
        <li><a href="#">Услуги</a>
          <ul>
            <li><a href="#">Продление книг</a></li>
            <li><a href="#">Заказ книги</a></li>
          </ul>
        </li>
        <li><a href="#">О библиотеке</a>
          <ul>
            <li><a href="#">Правила</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</nav>`,
      css: t.css
    }),
    k3603: () => ({
      html: `<h1>Онлайн-запись к врачу: путь пользователя</h1>
<ol class="flow">
  <li><strong>Главная</strong><p>Нажимает «Записаться к врачу»</p></li>
  <li><strong>Выбор врача</strong><p>Выбирает терапевта из списка</p></li>
  <li><strong>Дата и время</strong><p>Выбирает свободное время в четверг</p></li>
  <li><strong>Ваши данные</strong><p>Вводит имя, телефон и номер полиса</p></li>
  <li><strong>Проверка заявки</strong><p>Сверяет врача и время, нажимает «Подтвердить»</p></li>
  <li><strong>Подтверждение</strong><p>Видит номер талона и кнопку «Добавить в календарь»</p></li>
</ol>`,
      css: `${BASE}
.flow {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.flow li {
  position: relative;
  width: 140px;
  padding: 12px;
  border: 1px solid #c9c2e0;
  border-radius: 12px;
  background: #faf9fe;
}
.flow p { margin: 8px 0 0; font-size: 14px; }
.flow li:not(:last-child)::after {
  content: "→";
  position: absolute;
  right: -20px;
  top: 40%;
  color: #3b2a7a;
}`
    })
  });
})();
/* ---- tools/solutions/k37.js ---- */
/* Занятие 37: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3701: () => ({
      html: `<header>
  <p class="logo">Логотип</p>
  <nav>
    <a href="#about">О секции</a>
    <a href="#schedule">Расписание</a>
    <a href="#contacts">Контакты</a>
  </nav>
</header>
<main>
  <section class="hero">
    <h1>Шахматная секция колледжа</h1>
    <p>Короткий текст о том, зачем приходить: турниры, тренер, бесплатно.</p>
    <a class="button" href="#signup">Записаться</a>
  </section>
  <section class="features">
    <h2>Почему к нам</h2>
    <div class="features-list">
      <article>
        <h3>Преимущество 1</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
      <article>
        <h3>Преимущество 2</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
      <article>
        <h3>Преимущество 3</h3>
        <p>Две строки текста о преимуществе.</p>
      </article>
    </div>
  </section>
</main>
<footer>
  <p>Подвал: адрес, телефон, ссылки</p>
</footer>`,
      css: `${BASE}
/* Wireframe: только оттенки серого */
a { color: #222222; }
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #d9d9d9;
}
.logo { margin: 0; font-weight: bold; }
nav { display: flex; gap: 16px; }
.hero {
  margin-top: 24px;
  padding: 48px 24px;
  background: #eeeeee;
}
.hero h1 { margin-top: 0; }
.button {
  display: inline-block;
  padding: 12px 24px;
  background: #555555;
  color: #ffffff;
  text-decoration: none;
}
.features-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.features article { padding: 16px; background: #d9d9d9; }
.features h3 { margin-top: 0; }
footer {
  margin-top: 24px;
  padding: 16px 24px;
  background: #d9d9d9;
}`
    }),
    k3702: () => ({
      html: `<div class="page">
  <header class="block header">Шапка</header>
  <section class="block hero">Первый экран</section>
  <article class="block card">Карточка 1</article>
  <article class="block card">Карточка 2</article>
  <article class="block card">Карточка 3</article>
  <aside class="block side">Боковая колонка</aside>
  <section class="block content">Основной текст</section>
  <footer class="block footer">Подвал</footer>
</div>`,
      css: `${BASE}
/* Сетка: 12 колонок, гаттер 24px, поля 24px */
.page {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 24px;
  row-gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .footer { grid-column: 1 / -1; }
.hero { min-height: 160px; }
.card { grid-column: span 4; min-height: 120px; }
.side { grid-column: span 3; }
.content { grid-column: span 9; min-height: 200px; }`
    }),
    k3703: t => ({
      html: t.html,
      css: `${BASE}
/* Телефон: 4 колонки, всё во всю ширину */
.page {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}
.block {
  padding: 16px;
  background: #d9d9d9;
  border: 1px dashed #555555;
}
.header, .hero, .card, .footer { grid-column: 1 / -1; }
.hero { min-height: 160px; padding: 32px; }
.card { min-height: 120px; }
.footer { margin-top: 8px; }

/* С 768px: 12 колонок, карточки по 4 */
@media (min-width: 768px) {
  .page { grid-template-columns: repeat(12, 1fr); gap: 24px; padding: 0 24px; }
  .card { grid-column: span 4; }
}`
    })
  });
})();
/* ---- tools/solutions/k38.js ---- */
/* Занятие 38: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3801: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: var(--color-text); background: var(--color-bg); }
:root {
  --color-bg: #faf6f0;
  --color-surface: #e8d9c5;
  --color-text: #3b2a1e;
  --color-accent: #b5462a;
}
.palette {
  display: flex;
  gap: 16px;
  padding: 0;
  list-style: none;
}
.swatch {
  width: 120px;
  height: 120px;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}
.swatch--bg {
  background-color: var(--color-bg);
}
.swatch--surface {
  background-color: var(--color-surface);
}
.swatch--text {
  background-color: var(--color-text);
  color: var(--color-bg);
}
.swatch--accent {
  background-color: var(--color-accent);
  color: #ffffff;
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--color-accent);
  color: #ffffff;
}`
    }),
    k3802: t => ({
      html: t.html,
      css: `body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #222222; background: var(--color-main); }
:root {
  --color-main: #f4f7f6;
  --color-second: #1f4e5f;
  --color-accent: #ff7a3d;
}
.header,
.footer {
  padding: 16px 24px;
  background-color: var(--color-second);
  color: #ffffff;
}
.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
.hero,
.cards {
  padding: 24px;
}
.card {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-top: 4px solid var(--color-second);
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  background-color: var(--color-accent);
  color: #1a1a1a;
}`
    }),
    k3803: t => ({
      html: t.html,
      css: t.css.replace(/\/\* Закрасьте[^\n]*\n?/, '') + `
.mono-1 { background-color: var(--c6); }
.mono-2 { background-color: var(--c3); }
.mono-3 { background-color: var(--c9); }
.analog-1 { background-color: var(--c4); }
.analog-2 { background-color: var(--c7); }
.analog-3 { background-color: var(--c1); }
.compl-1 { background-color: var(--c2); }
.compl-2 { background-color: var(--c5); }
.compl-3 { background-color: var(--c8); }`
    })
  });
})();
/* ---- tools/solutions/k39.js ---- */
/* Занятие 39: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k3901: t => ({
      html: t.html,
      css: `${BASE}
.card {
  max-width: 480px;
  padding: 24px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: hsl(210 70% 35% / 0.15);
  color: hsl(210, 70%, 25%);
}
.btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  background-color: hsl(210, 70%, 35%);
  color: #ffffff;
}
.btn:hover {
  background-color: hsl(210, 70%, 25%);
}`
    }),
    k3902: t => ({
      html: t.html,
      css: t.css
        .replace('color: #a0a0a0;', 'color: #595959;')
        .replace('color: #8c8c8c;', 'color: #4d4d4d;')
        .replace('color: #6fa8dc;', 'color: #0b5cad;')
        .replace(/background-color: #f5c518;\n  color: #ffffff;/, 'background-color: #f5c518;\n  color: #1a1a1a;')
        .replace('color: #666666;', 'color: #ffffff;')
        .replace('color: #5a5a5a;', 'color: #d6d6d6;')
        .replace('color: #b0b0b0;', 'color: #595959;')
    }),
    k3903: t => ({
      html: t.html,
      css: t.css.replace(`.theme--dark {
  --bg: #121417;
}`, `.theme--dark {
  --bg: #121417;
  --text: #e6e8eb;
  --muted: #a9b1ba;
  --accent: #6cb6ff;
  --on-accent: #0d1117;
}`)
    })
  });
})();
/* ---- tools/solutions/k40.js ---- */
/* Занятие 40: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  const WF = `:root {
  --wf-dark: #444444;
  --wf-mid: #bdbdbd;
  --wf-light: #e0e0e0;
  --wf-bg: #f5f5f5;
}`;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4001: t => ({
      html: `<header class="header">
  <div class="logo">ЛОГО</div>
  <nav>
    <ul class="menu">
      <li><a href="#catalog">Каталог</a></li>
      <li><a href="#new">Новинки</a></li>
      <li><a href="#events">Мероприятия</a></li>
      <li><a href="#contacts">Контакты</a></li>
    </ul>
  </nav>
  <a class="login" href="#login">Войти</a>
</header>
<main class="main">
  <h1>Найдите книгу в библиотеке колледжа</h1>
  <form class="search">
    <label for="q">Книга или автор</label>
    <input id="q" type="search" name="q">
    <button type="submit">Найти</button>
  </form>
</main>
<footer class="footer">
  <p>Библиотека колледжа · корпус 1, этаж 2</p>
</footer>`,
      css: `${BASE}
${WF}
a {
  color: var(--wf-dark);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.logo {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
  font-weight: bold;
}
.menu {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.login {
  padding: 8px 16px;
  border: 2px solid var(--wf-dark);
}
.main {
  padding: 32px 0;
}
.search {
  display: flex;
  gap: 8px;
  align-items: center;
}
.footer {
  padding: 16px 24px;
  background-color: var(--wf-mid);
}`
    }),
    k4002: t => ({
      html: t.html.replace(/  <!-- Раздел 1[\s\S]*<\/main>/, `  <section class="new">
    <h2>Новые поступления</h2>
    <div class="cards">
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
      <article class="card">
        <div class="ph">Обложка</div>
        <h3>Название книги</h3>
        <p>Автор</p>
      </article>
    </div>
  </section>
  <section class="how">
    <h2>Как взять книгу</h2>
    <ol class="steps">
      <li>Найдите книгу в каталоге</li>
      <li>Забронируйте её</li>
      <li>Заберите у стойки выдачи</li>
    </ol>
  </section>
</main>`),
      css: t.css + `
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.card {
  padding: 16px;
  background-color: var(--wf-light);
}
.ph {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  background-color: var(--wf-mid);
  border: 2px dashed var(--wf-dark);
}
.steps {
  display: flex;
  gap: 16px;
}`
    }),
    k4003: t => ({
      html: `<header class="top">
  <div class="logo">ЛОГО</div>
  <nav class="menu">
    <a href="#catalog">Каталог</a>
    <a href="#events">Мероприятия</a>
    <a href="#rules">Правила</a>
  </nav>
</header>
<main class="content">
  <h1 class="title">Электронная библиотека колледжа</h1>
  <div class="banner">Баннер: книга недели</div>
  <h2>Подборки</h2>
  <div class="grid">
    <div class="item">Подборка 1</div>
    <div class="item">Подборка 2</div>
    <div class="item">Подборка 3</div>
  </div>
</main>
<footer class="bottom">Контакты библиотеки</footer>`,
      css: `${BASE}
${WF}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--wf-light);
}
.menu {
  display: flex;
  gap: 16px;
}
.menu a {
  color: var(--wf-dark);
}
.title {
  margin: 24px 0;
  font-size: 32px;
}
.banner {
  height: 120px;
  padding: 8px;
  border: 2px dashed var(--wf-dark);
  background-color: var(--wf-bg);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.item {
  padding: 32px;
  background-color: var(--wf-mid);
}
.bottom {
  margin-top: 24px;
  padding: 16px;
  background-color: var(--wf-light);
}`
    })
  });
})();
/* ---- tools/solutions/k41.js ---- */
/* Занятие 41: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4101: t => ({
      html: t.html,
      css: t.css.replace('  font-size: 16px;\n}', '  font-size: 16px;\n  display: none;\n}') + `
@media (max-width: 767px) {
  .header {
    gap: 8px;
    padding: 8px;
  }
  .nav {
    display: none;
  }
  .burger {
    display: block;
  }
}`
    }),
    k4102: t => ({
      html: t.html,
      css: t.css + `
@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .news {
    order: 2;
  }
  .cards {
    grid-template-columns: 1fr;
  }
}`
    }),
    k4103: t => ({
      html: t.html,
      css: t.css + `
@media (max-width: 767px) {
  .screen {
    flex-direction: column;
  }
  .tips {
    display: none;
  }
  .row {
    flex-direction: column;
    gap: 0;
  }
  input {
    width: 100%;
    box-sizing: border-box;
  }
  .btn {
    width: 100%;
  }
}`
    })
  });
})();
/* ---- tools/solutions/k42.js ---- */
/* Занятие 42: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4201: t => ({
      html: t.html,
      css: t.css
        .replace('.header {\n', '.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n')
        + `
.hero__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
.hero__bottom p {
  max-width: 400px;
}`
    }),
    k4202: t => ({
      html: t.html,
      css: `${BASE}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 8px 16px;
  border: 2px solid #2e7d32;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
}
.btn--primary {
  background-color: #2e7d32;
  color: #ffffff;
}
.btn--secondary {
  background-color: transparent;
  color: #2e7d32;
}
.link-more {
  color: #1f4e5f;
  text-decoration: underline;
}`
    }),
    k4203: t => ({
      html: t.html,
      css: t.css,
      js: `const buttons = document.querySelectorAll('.fav');
const status = document.querySelector('.status');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    if (pressed) {
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'В избранное';
      status.textContent = 'Книга убрана из избранного';
    } else {
      button.setAttribute('aria-pressed', 'true');
      button.textContent = 'В избранном';
      status.textContent = 'Книга добавлена в избранное';
    }
  });
}
`
    })
  });
})();
/* ---- tools/solutions/k43.js ---- */
/* Занятие 43: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4301: t => ({
      html: t.html,
      css: t.css + `
.btn:hover:not(:disabled) {
  background-color: #174a83;
}
.btn:active:not(:disabled) {
  background-color: #103660;
  transform: translateY(1px);
}
.btn:focus-visible {
  outline: 3px solid #1a1a1a;
  outline-offset: 2px;
}
.btn:disabled {
  background-color: #d6d6d6;
  color: #555555;
  cursor: not-allowed;
}`
    }),
    k4302: t => ({
      html: t.html
        .replace('aria-invalid="true">', 'aria-invalid="true" aria-describedby="email-error">\n    <p class="error-text" id="email-error">В адресе нет знака @. Пример: anna@mail.ru</p>')
        .replace('value="anna_reader">', 'value="anna_reader" aria-describedby="login-ok">\n    <p class="success-text" id="login-ok">Логин свободен</p>'),
      css: t.css + `
input[aria-invalid="true"] {
  border: 2px solid #c62828;
}
.error-text,
.success-text {
  margin: 0;
}
.error-text {
  color: #c62828;
}
.error-text::before {
  content: "✕ ";
}
.is-valid {
  border: 2px solid #2e7d32;
}
.success-text {
  color: #2e7d32;
}`
    }),
    k4303: t => ({
      html: t.html,
      css: t.css,
      js: `const empty = document.querySelector('.empty');
const buttons = document.querySelectorAll('.cancel');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    const title = item.querySelector('.title').textContent;
    if (confirm('Отменить бронь книги ' + title + '?')) {
      item.remove();
      if (document.querySelectorAll('.item').length === 0) {
        empty.hidden = false;
      }
    }
  });
}
`
    })
  });
})();
/* ---- tools/solutions/k44.js ---- */
/* Занятие 44: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4401: t => ({
      html: t.html,
      css: `${BASE}
article { max-width: 65ch; margin: 0 auto; }
h1, h2 { font-family: Georgia, "Times New Roman", serif; line-height: 1.2; }
h1 { font-size: 40px; margin: 0 0 16px; }
h2 { font-size: 26px; margin: 40px 0 12px; }
p { font-size: 18px; line-height: 1.6; margin: 0 0 16px; }`
    }),
    k4402: t => ({
      html: `<h1>Кофейня «Зерно»</h1>
<section class="group">
  <h2>Кофе</h2>
  <ul class="menu">
    <li class="item"><span>Американо</span> <span class="price">120 ₽</span></li>
    <li class="item"><span>Капучино</span> <span class="price">160 ₽</span></li>
    <li class="item"><span>Латте</span> <span class="price">170 ₽</span></li>
  </ul>
</section>
<section class="group">
  <h2>Выпечка</h2>
  <ul class="menu">
    <li class="item"><span>Круассан</span> <span class="price">110 ₽</span></li>
    <li class="item"><span>Сырник</span> <span class="price">90 ₽</span></li>
  </ul>
</section>`,
      css: `${BASE}
.group { max-width: 360px; }
h2 { margin: 32px 0 8px; }
.menu { margin: 0; padding: 0; list-style: none; }
.item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #dddddd; }
.price { font-weight: bold; color: #8a3b12; }`
    }),
    k4403: t => ({
      html: t.html,
      css: `${BASE}
.event { max-width: 420px; padding: 24px; border: 1px solid #d0d7e2; border-radius: 12px; }
.date, .title, .text { margin: 0 0 8px; font-size: 16px; }
.date { font-size: 14px; color: #5a6475; }
.title { font-size: 28px; line-height: 1.2; }
.text { margin-bottom: 16px; line-height: 1.5; }
.actions { display: flex; gap: 12px; }
.btn { display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; }
.btn-main { border: 2px solid #1f5fa8; background: #1f5fa8; color: #ffffff; }
.btn-more { border: 2px solid #1f5fa8; background: transparent; color: #1f5fa8; }`
    })
  });
})();
/* ---- tools/solutions/k45.js ---- */
/* Занятие 45: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4501: t => ({
      html: `<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <ol>
    <li><a href="#">Главная</a></li>
    <li><a href="#">Каталог</a></li>
    <li aria-current="page">Информатика</li>
  </ol>
</nav>

<h1>Информатика</h1>
<ul class="books">
  <li>Основы алгоритмизации и программирования</li>
  <li>Информационные технологии в профессии</li>
  <li>Компьютерные сети: учебник для колледжей</li>
</ul>

<nav class="pagination" aria-label="Страницы">
  <ul>
    <li><a href="#" aria-current="page">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">Вперёд</a></li>
  </ul>
</nav>`,
      css: `${BASE}
.books { margin-bottom: 24px; line-height: 1.6; }
.breadcrumbs ol, .pagination ul { display: flex; margin: 0; padding: 0; list-style: none; }
.breadcrumbs li + li::before { content: "/"; margin: 0 8px; color: #5a6475; }
.breadcrumbs a { color: #1f5fa8; }
.pagination ul { gap: 8px; }
.pagination a { display: flex; justify-content: center; align-items: center; min-width: 44px; min-height: 44px; padding: 0 12px; box-sizing: border-box; border: 1px solid #1f5fa8; border-radius: 8px; color: #1f5fa8; text-decoration: none; }
.pagination a[aria-current="page"] { background: #1f5fa8; color: #ffffff; }`
    }),
    k4502: t => ({
      html: `<form class="form">
  <h2>Запись на пробную тренировку</h2>
  <div class="row">
    <label for="name">Имя</label>
    <input id="name" name="name" type="text">
  </div>
  <div class="row">
    <label for="phone">Телефон</label>
    <input id="phone" name="phone" type="tel" aria-describedby="phone-hint">
    <p id="phone-hint" class="hint">Например, +7 900 123-45-67</p>
  </div>
  <div class="row">
    <label for="email">Почта</label>
    <input id="email" name="email" type="email" value="ivan.mail.ru" aria-invalid="true" aria-describedby="email-error">
    <p id="email-error" class="error">Укажите почту в формате name@mail.ru</p>
  </div>
  <button type="submit">Записаться на тренировку</button>
</form>`,
      css: `${BASE}
.form { max-width: 480px; }
.row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.row label { font-weight: bold; }
.row input { padding: 10px; border: 1px solid #5a6475; border-radius: 6px; font-size: 16px; }
.row input[aria-invalid="true"] { border-color: #c62828; }
.hint, .error { margin: 0; font-size: 14px; }
.hint { color: #5a6475; }
.error { color: #c62828; }
button { padding: 12px 20px; border: 0; border-radius: 8px; background: #1f5fa8; color: #ffffff; font-size: 16px; }`
    }),
    k4503: t => ({
      html: t.html,
      css: t.css,
      js: `const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const status = document.querySelector('.status');
const total = 5;
let page = 1;

function render() {
  status.textContent = 'Страница ' + page + ' из ' + total;
  prev.disabled = page === 1;
  next.disabled = page === total;
}

next.addEventListener('click', () => {
  if (page < total) {
    page = page + 1;
    render();
  }
});

prev.addEventListener('click', () => {
  if (page > 1) {
    page = page - 1;
    render();
  }
});

render();
`
    })
  });
})();
/* ---- tools/solutions/k46.js ---- */
/* Занятие 46: эталонные решения */
(() => {
  const { BASE, ICON } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4601: t => ({
      html: t.html,
      css: `${BASE}
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
.btn { min-height: 44px; padding: 0 20px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; cursor: pointer; }
.btn:focus-visible { outline: 3px solid #1d2433; outline-offset: 2px; }
.btn-primary { background: #1f5fa8; color: #ffffff; }
.btn-primary:hover { background: #174a84; }
.btn-secondary { border-color: #1f5fa8; background: transparent; color: #1f5fa8; }
.btn-text { background: transparent; color: #1f5fa8; text-decoration: underline; }`
    }),
    k4602: t => ({
      html: `<h1>Дневник</h1>
<nav class="tabbar" aria-label="Разделы">
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Расписание</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Оценки</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Уведомления</span><span class="badge">3</span></button>
  <button class="tab" type="button"><img src="${ICON}" alt=""><span class="label">Профиль</span></button>
</nav>`,
      css: `${BASE}
.tabbar { display: flex; justify-content: space-around; padding: 8px 0; border-top: 1px solid #c4cad4; }
.tab { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 44px; min-height: 44px; padding: 4px; border: 0; background: transparent; color: #1d2433; }
.tab img { width: 20px; height: 20px; }
.label { font-size: 13px; }
.badge { padding: 0 6px; border-radius: 999px; background: #c62828; color: #ffffff; font-size: 12px; font-weight: bold; }`
    }),
    k4603: t => ({
      html: t.html,
      css: t.css,
      js: `const add = document.querySelector('.add');
const toast = document.querySelector('.toast');
const close = document.querySelector('.toast-close');
const cartCount = document.querySelector('.cart-count');
let count = 0;

add.addEventListener('click', () => {
  count = count + 1;
  cartCount.textContent = count;
  toast.hidden = false;
});

close.addEventListener('click', () => {
  toast.hidden = true;
});
`
    })
  });
})();
/* ---- tools/solutions/k47.js ---- */
/* Занятие 47: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4701: t => ({
      html: t.html,
      css: t.css.replace('/* Сюда — правило :root с переменными стайлгайда */', `:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-accent: #e8a33d;
  --color-text: #1d2433;
  --color-muted: #5a6475;
  --color-surface: #f2f5fa;
  --font-main: Arial, sans-serif;
  --font-heading: Georgia, serif;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius: 8px;
}`)
    }),
    k4702: t => ({
      html: t.html,
      css: t.css + `.card { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }
.card h2 { margin-top: 0; }
.card-text { color: var(--color-muted); }
.badge { display: inline-block; padding: var(--space-1); border-radius: var(--radius); background: var(--color-accent); color: var(--color-text); }
.label { display: block; margin-bottom: var(--space-1); }
.field { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); font-size: 16px; }
.btn { min-height: 44px; padding: 0 var(--space-3); border: 2px solid transparent; border-radius: var(--radius); font-size: 16px; }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); }
.btn-secondary { border-color: var(--color-primary); background: transparent; color: var(--color-primary); }
`
    }),
    k4703: t => ({
      html: t.html,
      css: `${BASE}
:root {
  --color-primary: #1f5fa8;
  --color-primary-dark: #174a84;
  --color-on-primary: #ffffff;
  --color-text: #1d2433;
  --color-surface: #f2f5fa;
}
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--color-primary); }
.logo { margin: 0; color: var(--color-on-primary); font-weight: bold; }
.nav { display: flex; gap: 16px; }
.nav a { color: var(--color-on-primary); }
.hero { padding: 32px 24px; background: var(--color-surface); }
.hero h1 { margin: 0 0 16px; color: var(--color-text); }
.hero p { color: var(--color-text); }
.btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background: var(--color-primary); color: var(--color-on-primary); text-decoration: none; }
.btn:hover { background: var(--color-primary-dark); }
.footer { padding: 16px 24px; border-top: 4px solid var(--color-primary); color: var(--color-text); }
.footer a { color: var(--color-primary); }`
    })
  });
})();
/* ---- tools/solutions/k48.js ---- */
/* Занятие 48: эталонные решения */
(() => {
  const { IMG, ICON } = window.COURSE_KIT;
  const MARK = '/* Ниже — ';
  // решение = шаблон CSS до комментария «Ниже — …» + стили студента
  const keep = css => css.slice(0, css.indexOf(MARK));
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k4801: t => ({
      html: `<div class="page">
  <header class="header">
    <p class="logo">Читальный зал</p>
    <nav class="nav" aria-label="Главное меню">
      <ul>
        <li><a href="#catalog">Каталог</a></li>
        <li><a href="#booking">Бронирование</a></li>
        <li><a href="#contacts">Контакты</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero">
    <h1>Книги и тихие места — в два клика</h1>
    <p>Найдите учебник в каталоге библиотеки колледжа и заберите его на перемене. Или забронируйте место в читальном зале перед зачётом.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#catalog">Найти книгу</a>
      <a class="btn btn-secondary" href="#booking">Забронировать место</a>
    </div>
  </section>
</div>`,
      css: keep(t.css) + `.header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-primary); }
.logo { margin: 0; color: var(--color-on-primary); font-weight: bold; font-size: 20px; }
.nav ul { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.nav a { color: var(--color-on-primary); }
.hero { padding: var(--space-4) var(--space-3); background: var(--color-surface); }
.hero h1 { margin: 0 0 var(--space-2); font-size: 40px; }
.hero p { max-width: 60ch; margin: 0 0 var(--space-3); font-size: 18px; line-height: 1.6; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
`
    }),
    k4802: t => ({
      html: `<div class="page">
  <section class="features">
    <h2>Почему у нас удобно</h2>
    <div class="features-list">
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Тихие места</h3>
        <p>40 мест в читальном зале, у каждого стола лампа и розетка.</p>
      </article>
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Электронный каталог</h3>
        <p>Поиск по названию и автору, видно, есть ли книга на полке.</p>
      </article>
      <article class="feature">
        <img src="${ICON}" alt="">
        <h3>Бронь онлайн</h3>
        <p>Забронируйте книгу с телефона и заберите её на перемене.</p>
      </article>
    </div>
  </section>
</div>`,
      css: keep(t.css).replace('.page h2 {', '.page h2, .page h3 {') + `.features-list { display: grid; gap: var(--space-3); }
.feature { padding: var(--space-3); border-radius: var(--radius); background: var(--color-surface); }
.feature img { width: 32px; height: 32px; }
.feature h3 { margin: var(--space-1) 0; font-size: 22px; }
.feature p { margin: 0; line-height: 1.5; }
@media (min-width: 768px) {
  .features-list { grid-template-columns: repeat(3, 1fr); }
}
`
    }),
    k4803: t => ({
      html: `<div class="page">
  <section class="new-books">
    <h2>Новые поступления</h2>
    <ul class="cards">
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Основы веб-дизайна»">
        <h3>Основы веб-дизайна</h3>
        <p class="author">Е. Смирнова</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Пикник на обочине»">
        <h3>Пикник на обочине</h3>
        <p class="author">А. и Б. Стругацкие</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
      <li class="card">
        <img src="${IMG}" alt="Обложка книги «Собака Баскервилей»">
        <h3>Собака Баскервилей</h3>
        <p class="author">А. Конан Дойл</p>
        <span class="badge">Новинка</span>
        <a class="btn btn-secondary" href="#booking">Забронировать</a>
      </li>
    </ul>
  </section>
  <footer class="footer">
    <p>Библиотека колледжа, корпус 1, кабинет 105</p>
    <p>Телефон: <a href="tel:+78001234567">8 800 123-45-67</a></p>
    <p>Почта: <a href="mailto:library@college.ru">library@college.ru</a></p>
  </footer>
</div>`,
      css: keep(t.css) + `.cards { display: grid; gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.card { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-1); padding: var(--space-2); border: 1px solid var(--color-muted); border-radius: var(--radius); }
.card img { display: block; width: 100%; height: auto; border-radius: var(--radius); }
.card h3 { margin: var(--space-1) 0 0; }
.author { margin: 0; color: var(--color-muted); }
.badge { padding: 2px var(--space-1); border-radius: var(--radius); background: var(--color-accent); color: var(--color-text); font-size: 14px; }
.footer { margin-top: var(--space-4); padding: var(--space-3); background: var(--color-text); color: var(--color-on-primary); }
.footer a { color: var(--color-on-primary); }
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
`
    })
  });
})();
/* ---- tools/solutions/k49.js ---- */
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
/* ---- tools/solutions/k50.js ---- */
/* Занятие 50: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5001: t => ({
      html: `<section class="card">
  <h2>Бронирование книги</h2>
  <label for="reader">Номер читательского билета</label>
  <input id="reader" class="field" type="text">
  <div class="actions">
    <button class="btn" type="button">Забронировать</button>
    <button class="btn" type="button" disabled>Недоступно</button>
  </div>
</section>`,
      css: t.css.replace(`.btn { padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; }
.btn:focus { outline: none; }`, `.field:focus-visible { outline: 3px solid #f2a900; border-color: #1f5f8b; }
.btn { min-height: 44px; padding: 10px 18px; font-size: 16px; border: none; border-radius: 8px; background-color: #1f5f8b; color: #ffffff; cursor: pointer; }
.btn:hover { background-color: #174a6c; }
.btn:active { background-color: #10354e; transform: translateY(1px); }
.btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }
.btn:disabled { background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; transform: none; }`)
    }),
    k5002: t => ({
      html: t.html.replace('id="screen-book"', 'id="screen-book" hidden').replace('id="screen-done"', 'id="screen-done" hidden'),
      css: t.css.replace('.books {', '.screen[hidden] { display: none; }\n.books {'),
      js: `const screens = document.querySelectorAll('.screen');

function showScreen(id) {
  for (const screen of screens) {
    screen.hidden = screen.id !== id;
  }
}

const links = document.querySelectorAll('[data-go]');
for (const button of links) {
  button.addEventListener('click', () => {
    showScreen(button.dataset.go);
  });
}
`
    }),
    k5003: t => ({
      html: t.html.replace('id="send">', 'id="send" disabled>'),
      css: t.css.replace('.status {', '.btn:disabled { background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }\n.status {'),
      js: `const agree = document.querySelector('#agree');
const send = document.querySelector('#send');
const form = document.querySelector('#booking');
const statusText = document.querySelector('#status');

agree.addEventListener('change', () => {
  send.disabled = !agree.checked;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!agree.checked) return;
  send.disabled = true;
  send.textContent = 'Готово';
  agree.disabled = true;
  statusText.textContent = 'Бронь подтверждена. Номер брони: 1024.';
});
`
    })
  });
})();
/* ---- tools/solutions/k51.js ---- */
/* Занятие 51: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5101: t => ({
      html: t.html,
      css: `${BASE}
.page { max-width: 960px; margin: 0 auto; font-size: 16px; }
.top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; }
.logo { font-weight: bold; }
.menu { display: flex; flex-wrap: wrap; gap: 8px; }
.menu a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; font-size: 16px; color: #1f5f8b; }
.btn { display: block; min-height: 48px; padding: 12px 16px; font-size: 18px; text-align: center; background-color: #8a3b12; color: #ffffff; text-decoration: none; border-radius: 8px; }
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; margin: 24px 0; }
.card { padding: 16px; border: 1px solid #d0d7de; border-radius: 12px; }
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
  .btn { display: inline-block; }
}`
    }),
    k5102: t => ({
      html: `<form class="order" id="order">
  <h2>Заказ обеда</h2>
  <label for="name">Имя</label>
  <input id="name" name="name" type="text" autocomplete="name">
  <label for="phone">Телефон</label>
  <input id="phone" name="phone" type="tel" autocomplete="tel">
  <label for="email">Почта для чека</label>
  <input id="email" name="email" type="email" autocomplete="email">
  <label for="code">Код из СМС</label>
  <input id="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code">
  <label for="time">Ко скольки приготовить</label>
  <input id="time" name="time" type="time">
  <button class="btn" type="submit">Заказать</button>
</form>`,
      css: `${BASE}
.order { max-width: 420px; }
label { display: block; margin: 12px 0 4px; font-weight: bold; }
input { width: 100%; box-sizing: border-box; min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #8c959f; border-radius: 6px; }
.btn { width: 100%; min-height: 48px; margin-top: 16px; padding: 12px; font-size: 16px; border: none; border-radius: 8px; background-color: #8a3b12; color: #ffffff; }`
    }),
    k5103: t => ({
      html: t.html.replace('<a href="#schedule">', '<a href="#schedule" aria-current="page">'),
      css: `${BASE}
.content { padding-bottom: 88px; }
.tabbar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; background-color: #ffffff; border-top: 1px solid #d0d7de; }
.tabbar a { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-height: 56px; color: #57606a; font-size: 12px; text-decoration: none; }
.tabbar a[aria-current="page"] { color: #1f5f8b; font-weight: bold; }
.tabbar img { width: 24px; height: 24px; }
@media (min-width: 768px) {
  .tabbar { position: static; border-top: none; border-bottom: 1px solid #d0d7de; }
  .tabbar a { flex: 0 0 120px; }
  .content { padding-bottom: 24px; }
}`
    })
  });
})();
/* ---- tools/solutions/k52.js ---- */
/* Занятие 52: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5201: t => ({
      html: `<h1>Отчёт об аудите: форма записи в спортзал</h1>
<table>
  <caption>Проблемы формы записи, найденные на тесте с пятью участниками</caption>
  <thead>
    <tr>
      <th scope="col">№</th>
      <th scope="col">Проблема</th>
      <th scope="col">Где</th>
      <th scope="col">Эвристика</th>
      <th scope="col">Как исправить</th>
      <th scope="col">Приоритет</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Нет подписи, только серый текст внутри поля</td><td>Поле телефона</td><td>Узнавание вместо вспоминания</td><td>Постоянная подпись label над полем</td><td class="prio-high">Высокий</td></tr>
    <tr><td>2</td><td>Три секунды ничего не происходит, люди записываются дважды</td><td>После нажатия кнопки</td><td>Видимость состояния системы</td><td>Состояние загрузки и сообщение об успехе</td><td class="prio-high">Высокий</td></tr>
    <tr><td>3</td><td>Кнопка подписана «Ок»</td><td>Кнопка отправки</td><td>Соответствие реальному миру</td><td>Подпись «Записаться на занятие»</td><td class="prio-medium">Средний</td></tr>
    <tr><td>4</td><td>Сообщение «Error 0x13»</td><td>Поле даты</td><td>Помощь в исправлении ошибок</td><td>«Выберите дату не раньше завтрашнего дня»</td><td class="prio-medium">Средний</td></tr>
    <tr><td>5</td><td>Логотип не ведёт на главную</td><td>Шапка</td><td>Единообразие и стандарты</td><td>Сделать логотип ссылкой на главную</td><td class="prio-low">Низкий</td></tr>
  </tbody>
</table>`,
      css: `${BASE}
h1 { font-size: 26px; }
table { border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px; border: 1px solid #8c959f; text-align: left; vertical-align: top; }
thead th { background-color: #eaeef2; }
.prio-high { background-color: #fde2e1; color: #8a1c14; font-weight: bold; }
.prio-medium { background-color: #fff3cd; color: #5c4400; }
.prio-low { background-color: #e6f4ea; color: #1e4620; }`
    }),
    k5202: t => ({
      html: `<form class="signup" id="signup">
  <h2>Запись на пробное занятие</h2>
  <label for="phone">Телефон</label>
  <input id="phone" type="tel" placeholder="+7 900 123-45-67">
  <label for="date">Дата занятия</label>
  <input id="date" type="date" aria-describedby="date-error">
  <p class="error" id="date-error">Выберите дату не раньше завтрашнего дня.</p>
  <p class="terms">Нажимая кнопку, вы соглашаетесь с <a href="#rules">правилами клуба</a>.</p>
  <button class="btn" type="submit">Записаться на занятие</button>
</form>`,
      css: t.css.replace('color: #b0b0b0', 'color: #595959')
    }),
    k5203: t => ({
      html: t.html.replace('id="toast">', 'id="toast" hidden>'),
      css: t.css,
      js: `const toast = document.querySelector('#toast');
const undo = document.querySelector('#undo');
let lastItem = null;

const buttons = document.querySelectorAll('.del');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    item.hidden = true;
    lastItem = item;
    toast.hidden = false;
  });
}

undo.addEventListener('click', () => {
  if (lastItem) {
    lastItem.hidden = false;
    lastItem = null;
  }
  toast.hidden = true;
});
`
    })
  });
})();
/* ---- tools/solutions/k53.js ---- */
/* Занятие 53: эталонные решения */
(() => {
  const { BASE } = window.COURSE_KIT;
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5301: t => ({
      html: `<h1>Схема интерфейса: запись к врачу</h1>
<section>
  <h2>Экраны</h2>
  <div class="screens">
    <article class="screen" id="screen-home">
      <h3>Главная</h3>
      <p>Стартовый экран пациента.</p>
      <ul><li>Ближайшая запись</li><li>Кнопка «Записаться»</li><li>Меню</li></ul>
    </article>
    <article class="screen" id="screen-login">
      <h3>Вход</h3>
      <p>Пациент входит в личный кабинет.</p>
      <ul><li>Номер полиса и пароль</li><li>Кнопка «Войти»</li></ul>
    </article>
    <article class="screen" id="screen-doctors">
      <h3>Выбор врача</h3>
      <p>Пациент находит нужного специалиста.</p>
      <ul><li>Специальности</li><li>Список врачей</li><li>Поиск</li></ul>
    </article>
    <article class="screen" id="screen-time">
      <h3>Выбор времени</h3>
      <p>Пациент выбирает удобный слот.</p>
      <ul><li>Дни недели</li><li>Свободные слоты</li><li>Кнопка «Далее»</li></ul>
    </article>
    <article class="screen" id="screen-confirm">
      <h3>Подтверждение</h3>
      <p>Пациент проверяет данные записи.</p>
      <ul><li>Врач, дата и время</li><li>Кнопка «Записаться»</li></ul>
    </article>
    <article class="screen" id="screen-done">
      <h3>Запись создана</h3>
      <p>Подтверждение, что всё получилось.</p>
      <ul><li>Номер талона</li><li>Кнопка «В мои записи»</li></ul>
    </article>
    <article class="screen" id="screen-my">
      <h3>Мои записи</h3>
      <p>Все будущие визиты пациента.</p>
      <ul><li>Список записей</li><li>Кнопка «Отменить»</li></ul>
    </article>
  </div>
</section>`,
      css: `${BASE}
h1 { font-size: 26px; }
.screens { display: grid; grid-template-columns: 1fr; gap: 16px; }
.screen { padding: 12px 16px; border: 2px solid #1f5f8b; border-radius: 12px; }
.screen h3 { margin: 0 0 4px; }
.screen p { margin: 0; color: #57606a; }
.screen ul { margin: 8px 0 0; padding-left: 20px; }
@media (min-width: 768px) {
  .screens { grid-template-columns: repeat(3, 1fr); }
}`
    }),
    k5302: t => ({
      html: t.html.replace('<!-- Здесь раздел «Переходы» с таблицей -->', `<section>
  <h2>Переходы</h2>
  <table>
    <caption>Как пользователь переходит между экранами</caption>
    <thead>
      <tr><th scope="col">Откуда</th><th scope="col">Действие пользователя</th><th scope="col">Куда</th></tr>
    </thead>
    <tbody>
      <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Войти»</td><td><a href="#screen-login">Вход</a></td></tr>
      <tr><td><a href="#screen-login">Вход</a></td><td>Вводит полис и пароль</td><td><a href="#screen-home">Главная</a></td></tr>
      <tr><td><a href="#screen-home">Главная</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-doctors">Выбор врача</a></td></tr>
      <tr><td><a href="#screen-doctors">Выбор врача</a></td><td>Выбирает терапевта</td><td><a href="#screen-time">Выбор времени</a></td></tr>
      <tr><td><a href="#screen-time">Выбор времени</a></td><td>Выбирает слот, нажимает «Далее»</td><td><a href="#screen-confirm">Подтверждение</a></td></tr>
      <tr><td><a href="#screen-confirm">Подтверждение</a></td><td>Нажимает «Записаться»</td><td><a href="#screen-done">Запись создана</a></td></tr>
      <tr><td><a href="#screen-done">Запись создана</a></td><td>Нажимает «В мои записи»</td><td><a href="#screen-my">Мои записи</a></td></tr>
      <tr><td><a href="#screen-home">Главная</a></td><td>Открывает меню «Мои записи»</td><td><a href="#screen-my">Мои записи</a></td></tr>
    </tbody>
  </table>
</section>`),
      css: `${t.css}
.screen:target { background-color: #fff3cd; border-color: #8a5a00; }
table { margin-top: 8px; border-collapse: collapse; }
caption { margin-bottom: 8px; font-weight: bold; text-align: left; }
th, td { padding: 8px; border: 1px solid #8c959f; text-align: left; }
td a { color: #1f5f8b; }`
    }),
    k5303: t => ({
      html: `<h1>User flow: запись к терапевту</h1>
<ol class="flow">
  <li class="step">Главная: нажимает «Записаться»</li>
  <li class="step">Выбор врача: выбирает терапевта</li>
  <li class="step">Выбор времени: смотрит свободные слоты</li>
  <li class="step decision">Есть свободное время?
    <ul>
      <li>Да — выбирает слот и идёт дальше</li>
      <li>Нет — «Сообщить, когда появится», возврат на Главную</li>
    </ul>
  </li>
  <li class="step">Подтверждение: проверяет данные, нажимает «Записаться»</li>
  <li class="step">Запись создана: видит номер талона</li>
</ol>`,
      css: `${BASE}
h1 { font-size: 26px; }
.flow { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0; list-style: none; }
.step { padding: 12px; border: 2px solid #1f5f8b; border-radius: 12px; }
.step:not(:last-child)::after { content: " →"; font-weight: bold; color: #1f5f8b; }
.decision { border-style: dashed; background-color: #fff3cd; }
.decision ul { margin: 8px 0 0; padding-left: 20px; }
@media (min-width: 768px) {
  .flow { flex-direction: row; flex-wrap: wrap; }
  .step { flex: 1 1 180px; }
}`
    })
  });
})();
/* ---- tools/solutions/k54.js ---- */
/* Занятие 54: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5401: t => ({
      html: `<section class="picker">
  <h2>Выберите время приёма</h2>
  <p>Терапевт Иванова А. С., вторник, 14 октября</p>
  <div class="slots">
    <button class="slot" type="button" aria-pressed="true">09:00</button>
    <button class="slot" type="button" aria-pressed="false" disabled>09:30</button>
    <button class="slot" type="button" aria-pressed="false">10:00</button>
    <button class="slot" type="button" aria-pressed="false" disabled>10:30</button>
    <button class="slot" type="button" aria-pressed="false">11:00</button>
    <button class="slot" type="button" aria-pressed="false">11:30</button>
  </div>
  <p class="chosen" id="chosen">Выбрано: 09:00</p>
</section>`,
      css: t.css.replace('.chosen {', `.slot:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }
.slot[aria-pressed="true"] { background-color: #1f5f8b; color: #ffffff; }
.slot:disabled { background-color: #eaeef2; color: #57606a; border-color: #8c959f; text-decoration: line-through; cursor: not-allowed; }
.chosen {`),
      js: `const slots = document.querySelectorAll('.slot');
const chosen = document.querySelector('#chosen');

for (const slot of slots) {
  slot.addEventListener('click', () => {
    for (const other of slots) {
      other.setAttribute('aria-pressed', 'false');
    }
    slot.setAttribute('aria-pressed', 'true');
    chosen.textContent = 'Выбрано: ' + slot.textContent;
  });
}
`
    }),
    k5402: t => ({
      html: `<form class="login" id="login" novalidate>
  <h2>Вход в личный кабинет</h2>
  <label for="policy">Номер полиса</label>
  <input id="policy" type="text" inputmode="numeric" aria-describedby="policy-error">
  <p class="error" id="policy-error"></p>
  <label for="pass">Пароль</label>
  <input id="pass" type="password" aria-describedby="pass-error">
  <p class="error" id="pass-error"></p>
  <button class="btn" type="submit">Войти</button>
  <p class="status" id="status" role="status"></p>
</form>`,
      css: t.css.replace('input:focus { outline: none; }', 'input:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }')
        .replace('.status {', '.btn:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }\n.status {'),
      js: `const form = document.querySelector('#login');
const policy = document.querySelector('#policy');
const pass = document.querySelector('#pass');
const policyError = document.querySelector('#policy-error');
const passError = document.querySelector('#pass-error');
const statusText = document.querySelector('#status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusText.textContent = '';

  const policyOk = policy.value.trim().length === 16;
  policyError.textContent = policyOk ? '' : 'Номер полиса — 16 цифр. Он напечатан на лицевой стороне полиса.';
  policy.setAttribute('aria-invalid', policyOk ? 'false' : 'true');

  const passOk = pass.value !== '';
  passError.textContent = passOk ? '' : 'Введите пароль.';
  pass.setAttribute('aria-invalid', passOk ? 'false' : 'true');

  if (policyOk && passOk) {
    statusText.textContent = 'Вход выполнен. Открываем личный кабинет…';
  }
});
`
    }),
    k5403: t => ({
      html: t.html.replace('id="empty">', 'id="empty" hidden>'),
      css: t.css.replace('.btn {', '.empty[hidden] { display: none; }\n.btn {'),
      js: `const list = document.querySelector('.list');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');

const buttons = document.querySelectorAll('.cancel');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const item = button.closest('.item');
    item.remove();
    const left = list.querySelectorAll('.item').length;
    count.textContent = left;
    if (left === 0) {
      list.hidden = true;
      empty.hidden = false;
    }
  });
}
`
    })
  });
})();
/* ---- tools/solutions/k55.js ---- */
/* Занятие 55: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    k5501: t => ({
      html: t.html,
      css: `:root {
  --color-primary: #2d6a4f;
  --color-primary-dark: #1b4332;
  --color-surface: #f1f7f4;
  --color-accent: #f4a261;
  --color-text: #1f2933;
  --radius: 8px;
}
body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: var(--color-text); background-color: #ffffff; }
.guide { max-width: 640px; }
.palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.swatch { padding: 32px 12px 12px; border-radius: var(--radius); border: 1px solid #d0d7de; }
.swatch-primary { background-color: var(--color-primary); color: #ffffff; }
.swatch-dark { background-color: var(--color-primary-dark); color: #ffffff; }
.swatch-surface { background-color: var(--color-surface); }
.swatch-accent { background-color: var(--color-accent); }
.buttons { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: block; margin-bottom: 4px; font-weight: bold; }
.btn { min-height: 44px; padding: 10px 20px; font-size: 16px; border-radius: var(--radius); cursor: pointer; }
.btn-primary { border: 2px solid var(--color-primary); background-color: var(--color-primary); color: #ffffff; }
.btn-secondary { border: 2px solid var(--color-primary); background-color: #ffffff; color: var(--color-primary); }
.btn-primary:hover { border-color: var(--color-primary-dark); background-color: var(--color-primary-dark); }
.btn-secondary:hover { background-color: var(--color-surface); }
.btn:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }
.btn:disabled { border-color: #c9c9c9; background-color: #c9c9c9; color: #4a4a4a; cursor: not-allowed; }
.input { box-sizing: border-box; width: 100%; max-width: 320px; min-height: 44px; padding: 8px 12px; font-size: 16px; border: 1px solid #6b7780; border-radius: var(--radius); }
.input:focus-visible { outline: 3px solid var(--color-accent); border-color: var(--color-primary); }`
    }),
    k5502: t => ({
      html: t.html
        .replace('<div class="header">', '<header class="header">')
        .replace('<div class="nav">', '<nav class="nav" aria-label="Главное меню">')
        .replace('</a>\n  </div>\n</div>', '</a>\n  </nav>\n</header>')
        .replace('<div class="main">', '<main class="main">')
        .replace('</section>\n</div>', '</section>\n</main>')
        .replace('<div class="footer" id="contacts">\n  <p>Москва, ул. Садовая, 12. Телефон: +7 495 123-45-67</p>\n</div>',
          '<footer class="footer" id="contacts">\n  <p>Москва, ул. Садовая, 12. Телефон: <a href="tel:+74951234567">+7 495 123-45-67</a></p>\n</footer>'),
      css: t.css.replace(`.nav a { color: var(--color-primary-dark); }
.card { width: 600px; }
.footer { background-color: var(--color-primary-dark); color: #ffffff; }`, `.header { display: flex; flex-direction: column; gap: 8px; padding: var(--space); border-bottom: 1px solid #d0d7de; }
.nav { display: flex; flex-wrap: wrap; gap: 8px; }
.nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: var(--color-primary-dark); }
.main { padding: 0 var(--space); }
.hero { padding: 32px 0; }
.hero h1 { margin-top: 0; font-size: 30px; line-height: 1.2; }
.cards { display: grid; grid-template-columns: 1fr; gap: var(--space); }
.card { padding: var(--space); border-radius: var(--radius); background-color: var(--color-surface); }
.card img { display: block; max-width: 100%; height: auto; border-radius: var(--radius); }
.booking { padding: var(--space) 0; }
.footer { margin-top: 32px; padding: var(--space); background-color: var(--color-primary-dark); color: #ffffff; }
.footer a { color: #ffffff; }
@media (min-width: 768px) {
  .header { flex-direction: row; justify-content: space-between; align-items: center; }
  .cards { grid-template-columns: repeat(3, 1fr); }
  .hero h1 { font-size: 40px; }
}`)
    }),
    k5503: t => ({
      html: t.html
        .replace('autocomplete="name">', 'autocomplete="name" aria-describedby="name-error">')
        .replace('placeholder="+7 900 123-45-67">', 'placeholder="+7 900 123-45-67" aria-describedby="phone-error">')
        .replace('autocomplete="email">', 'autocomplete="email" aria-describedby="email-error">')
        .replace('type="checkbox">', 'type="checkbox" aria-describedby="agree-error">'),
      css: t.css.replace('.error { margin: 0; font-size: 14px; }', '.error { margin: 0; font-size: 14px; color: var(--color-error); }'),
      js: `const form = document.querySelector('#booking-form');
const statusText = document.querySelector('#status');
const name = document.querySelector('#name');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');
const agree = document.querySelector('#agree');

function setError(input, message) {
  const errorEl = document.querySelector('#' + input.id + '-error');
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return message === '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusText.textContent = '';
  let ok = true;

  const nameValue = name.value.trim();
  if (!setError(name, nameValue === '' ? 'Введите имя, чтобы врач знал, как к вам обращаться.' : '')) ok = false;

  const digits = phone.value.replace(/\\D/g, '');
  if (!setError(phone, digits.length < 11 ? 'Телефон — 11 цифр, например +7 900 123-45-67.' : '')) ok = false;

  const mailOk = email.value.includes('@') && email.value.includes('.');
  if (!setError(email, mailOk ? '' : 'Почта должна быть вида name@mail.ru.')) ok = false;

  if (!setError(agree, agree.checked ? '' : 'Без согласия мы не сможем записать вас на приём.')) ok = false;

  if (ok) {
    statusText.textContent = 'Спасибо, ' + nameValue + '! Мы перезвоним в течение часа.';
  }
});
`
    })
  });
})();
