/* Занятие 2. Синтаксис HTML и структура документа */
(() => {
  const { BASE } = window.COURSE_KIT;
  // Код студента без комментариев: в заданиях про скелет документа проверяем сырой текст
  const raw = h => h.html.replace(/<!--[\s\S]*?-->/g, '');
  window.COURSE_TASKS.push(
    {
      id: 'k0201', lesson: 'mdk-02', module: 'mdk1', mech: 'build', title: 'Скелет страницы библиотеки', level: 'Лёгкое', minutes: 15, points: 100,
      story: 'Библиотека колледжа просит страницу с часами работы. Текст уже готов, но это ещё не документ: нет ни doctype, ни head, ни названия вкладки.',
      goal: 'Оберните готовые h1 и абзац в полный HTML-документ: первой строкой <!DOCTYPE html>, затем <html lang="ru">. В head: <meta charset="utf-8">, <meta name="viewport" content="width=device-width, initial-scale=1"> и <title> с текстом «Библиотека колледжа». h1 и абзац — внутри body. Все парные теги (html, head, body) закрыты, head идёт перед body.',
      hints: [
        'Порядок такой: doctype → html → head (служебное) → body (видимое) → закрыть html.',
        'Внутри head три строки: meta с кодировкой, meta с viewport и title.',
        'Скелет есть в начале урока: скопируйте его и замените содержимое body на h1 и абзац из шаблона.'
      ],
      html: `<!-- Соберите здесь полный HTML-документ:
     doctype, html с языком, head (кодировка, viewport, title) и body -->
<h1>Библиотека колледжа</h1>
<p>Работаем с понедельника по пятницу, с 9:00 до 18:00.</p>
`,
      css: `${BASE}
h1 { color: #8a3b12; }`,
      tests: [
        { name: 'Первая строка — <!DOCTYPE html>', check: h => /^\s*<!doctype html>/i.test(raw(h)) || 'документ должен начинаться с <!DOCTYPE html>' },
        { name: 'Есть <html lang="ru">, закрыт в конце', check: h => /<html\s+lang="ru"\s*>/.test(raw(h)) && /<\/html>\s*$/.test(raw(h)) || 'нужен <html lang="ru"> и </html> последней строкой' },
        { name: 'head идёт перед body, оба закрыты', check: h => { const s = raw(h), a = ['<head>', '</head>', '<body>', '</body>', '</html>'].map(t => s.indexOf(t)); return a.every(i => i >= 0) && a.every((v, i) => !i || v > a[i - 1]) || 'порядок: <head>…</head> <body>…</body> </html>'; } },
        { name: 'В head есть meta charset="utf-8"', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<meta\s+charset="utf-8"\s*\/?>/i.test(m[1])) || 'нет <meta charset="utf-8"> внутри head'; } },
        { name: 'В head есть meta viewport', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1(\.0)?"\s*\/?>/.test(m[1])) || 'нет meta viewport внутри head'; } },
        { name: 'В head есть title «Библиотека колледжа»', check: h => { const m = raw(h).match(/<head>([\s\S]*)<\/head>/); return !!(m && /<title>\s*Библиотека колледжа\s*<\/title>/.test(m[1])) || 'нет <title>Библиотека колледжа</title> внутри head'; } },
        { name: 'h1 и абзац — внутри body', check: h => { const m = raw(h).match(/<body>([\s\S]*)<\/body>/); return !!(m && /<h1>/.test(m[1]) && /<p>/.test(m[1])) && h.count('h1') === 1 || 'h1 и p должны стоять между <body> и </body>'; } }
      ]
    },
    {
      id: 'k0202', lesson: 'mdk-02', module: 'mdk1', mech: 'fix', title: 'Объявление кружка', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Староста сделал страницу кружка программирования, но на ней творится странное: подсказка показывает одно слово, а вместо текста «теги <p> и <h1>» появился огромный заголовок.',
      goal: 'Почините разметку. 1) У первого абзаца атрибут title должен быть «Запись открыта до пятницы» целиком — поставьте кавычки. 2) Во втором абзаце теги <p> и <h1> должны быть видны как текст — запишите их мнемониками, на странице останется один h1. 3) Знак & запишите как &amp;. 4) Между «500» и «₽» поставьте неразрывный пробел &nbsp;. 5) Вместо (c) поставьте знак © через &copy;.',
      hints: [
        'Значение атрибута — в двойных кавычках: title="Запись открыта до пятницы".',
        'Знак < пишется как &lt;, знак > — как &gt;. Значит, <p> превращается в &lt;p&gt;.',
        'Амперсанд: &amp;. Неразрывный пробел: 500&nbsp;₽. Копирайт: &copy; 2026.',
        'Чтобы в абзаце осталось «теги <p> и <h1>», напишите: теги &lt;p&gt; и &lt;h1&gt;.'
      ],
      html: `<h1>Кружок «Веб с нуля»</h1>
<p title=Запись открыта до пятницы>Наведите на этот абзац мышь — появится подсказка.</p>
<p>На первой встрече разберём теги <p> и <h1>.</p>
<p>Взнос — 500 ₽ за месяц, приходите с ноутбуком & хорошим настроением.</p>
<p>(c) 2026 Кружок «Веб с нуля»</p>`,
      css: `${BASE}
h1 { color: #8a3b12; }`,
      tests: [
        { name: 'У первого абзаца title «Запись открыта до пятницы»', check: h => h.$('p[title]')?.getAttribute('title') === 'Запись открыта до пятницы' || `сейчас title: «${h.$('p[title]')?.getAttribute('title') || 'нет'}»` },
        { name: 'Теги <p> и <h1> видны как текст, h1 на странице один', check: h => h.count('h1') === 1 && h.$$('p').some(p => /<p>\s*и\s*<h1>/.test(p.textContent)) || (h.count('h1') > 1 ? `заголовков h1: ${h.count('h1')} — браузер принял текст за теги` : 'нет текста «<p> и <h1>»') },
        { name: 'Амперсанд записан как &amp;', check: h => /ноутбуком\s*&amp;\s*хорошим/.test(h.html) || 'вместо & напишите &amp;' },
        { name: '«500» и «₽» склеены неразрывным пробелом', check: h => /500&nbsp;₽/.test(h.html) && h.$$('p').some(p => p.textContent.includes('500 ₽')) || 'нужно 500&nbsp;₽' },
        { name: 'Знак © вместо (c)', check: h => h.$$('p').some(p => p.textContent.includes('©')) && !/\(c\)/i.test(h.html) || 'замените (c) на &copy;' }
      ]
    },
    {
      id: 'k0203', lesson: 'mdk-02', module: 'mdk1', mech: 'fix', title: 'Порядок в коде спортзала', level: 'Лёгкое', minutes: 20, points: 120,
      story: 'Страницу спортзала кто-то написал в одну строку и прописными буквами, да ещё со старой кодировкой. Работает, но читать и править это невозможно.',
      goal: 'Перепишите документ аккуратно. Все теги и атрибуты — строчными буквами (DOCTYPE можно оставить как есть). У html добавьте lang="ru". Кодировку замените на utf-8 и добавьте meta viewport. Каждый тег — на своей строке (в коде не меньше 12 непустых строк), а всё, что вложено в head и body (meta, title, h1, p), сдвинуто вправо пробелами. Текст title и абзацев не меняйте.',
      hints: [
        'Начните с того, что разбейте строку: после каждого > нажмите Enter там, где начинается новый тег.',
        'Строки внутри head и body сдвиньте на 2 или 4 пробела. Например: «  <title>Спортзал колледжа</title>».',
        'Имена тегов и атрибутов пишем маленькими буквами: <HEAD> → <head>, CHARSET → charset.',
        'Сравните со скелетом из урока: структура должна быть такой же.'
      ],
      html: `<!DOCTYPE html><HTML><HEAD><META CHARSET="windows-1251"><TITLE>Спортзал колледжа</TITLE></HEAD><BODY><H1>Спортзал колледжа</H1><P>Открыт с 8:00 до 20:00, в воскресенье — выходной.</P><P>Сменная обувь обязательна.</P></BODY></HTML>`,
      css: `${BASE}
h1 { color: #1d5c8a; }`,
      tests: [
        { name: 'Теги и атрибуты — строчными буквами', check: h => { const s = raw(h).replace(/<!DOCTYPE/i, ''); return !/<\/?[A-Z]/.test(s) && !/<[a-z][^>]*\s[A-Z][A-Za-z-]*=/.test(s) || 'остались прописные буквы в тегах или атрибутах'; } },
        { name: 'У html есть lang="ru"', check: h => /<html\s+lang="ru"\s*>/.test(raw(h)) || 'нужен <html lang="ru">' },
        { name: 'Кодировка utf-8, есть meta viewport', check: h => /<meta\s+charset="utf-8"\s*\/?>/i.test(raw(h)) && !/windows-1251/i.test(h.html) && /<meta\s+name="viewport"/.test(raw(h)) || 'нужны <meta charset="utf-8"> и <meta name="viewport" …>' },
        { name: 'Каждый тег на своей строке', check: h => { const n = raw(h).split('\n').filter(l => l.trim()).length; return n >= 12 || `непустых строк: ${n}, нужно хотя бы 12`; } },
        { name: 'Вложенные meta, title, h1, p — с отступом', check: h => { const bad = raw(h).split('\n').filter(l => /<(meta|title|h1|p)[\s>]/i.test(l) && !/^[ \t]+</.test(l)); return !bad.length || `без отступа: ${bad[0].trim().slice(0, 30)}`; } },
        { name: 'Title и тексты не изменились', check: h => /<title>Спортзал колледжа<\/title>/.test(raw(h)) && h.text('h1') === 'Спортзал колледжа' && h.count('p') === 2 && /Сменная обувь обязательна/.test(h.text('body')) || 'верните исходные title, h1 и два абзаца' }
      ]
    }
  );
})();
