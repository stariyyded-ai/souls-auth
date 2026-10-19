/* Автопроверка заданий по HTML/CSS.
   Код студента собирается в страницу и открывается в двух скрытых iframe: 1024px (компьютер) и 360px (телефон).
   iframe без allow-scripts: скрипты студента не выполняются, а мы читаем DOM и вычисленные стили снаружи.
   Проверки бывают двух видов:
   - результата (из задания): работает ли то, что просили;
   - качества кода (общие для всех): семантика, доступность WCAG, контраст, чистота CSS, линтер.
   Задания с JavaScript (у задания есть поле js): проверки с флагом js: true выполняются внутри отдельного
   iframe с allow-scripts, но без allow-same-origin (у страницы студента нет доступа к сайту). Для каждой
   такой проверки страница загружается заново, функция check передаётся в iframe как текст, поэтому
   она не может пользоваться переменными снаружи. Помощник внутри описан в JS_HELPER ниже. */
(() => {
  const VIEWPORTS = { desk: 1024, phone: 360 };
  const HEIGHT = 800;

  const inline = js => String(js).replace(/<\/(script)/gi, '<\\/$1');
  // head — служебный код до кода студента (только для проверок JavaScript)
  const page = (html, css, js, head = '') => `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Задание</title>${head}<style>${css}</style></head><body>${html}${js ? `<script>${inline(js)}</script>` : ''}</body></html>`;

  function frame(width) {
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-same-origin');
    f.setAttribute('aria-hidden', 'true');
    f.tabIndex = -1;
    f.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${HEIGHT}px;border:0;visibility:hidden`;
    document.body.appendChild(f);
    return f;
  }
  function load(f, src) {
    return new Promise(res => {
      let done = false;
      const fin = () => { if (!done) { done = true; res(); } };
      f.addEventListener('load', fin, { once: true });
      f.srcdoc = src;
      setTimeout(fin, 3000);
    });
  }

  /* ---------- контраст по WCAG 2.x ---------- */
  function parseColor(s) {
    const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] };
  }
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  function background(el, win) {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = win.getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // на градиенте и картинке не считаем
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    return bg;
  }
  function contrast(el, win) {
    const cs = win.getComputedStyle(el);
    const bg = background(el, win); if (!bg) return null;
    const fg = blend(parseColor(cs.color) || { r: 0, g: 0, b: 0, a: 1 }, bg);
    const a = lum(fg), b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  /* ---------- помощник для проверок ---------- */
  // При масштабе браузера не 100% (125%, 150%) Chrome отдаёт толщину рамки дробной: 2px → 1.6px.
  // Рамку тоньше пикселя экрана браузер не рисует, поэтому возвращаем толщину, которую написал студент.
  const LINE_W = /^(border(-(top|right|bottom|left))?-width|outline-width|column-rule-width)$/;
  const fixStyle = (p, v) => LINE_W.test(p) ? v.replace(/(\d*\.\d+)px/g, (m, n) => Math.ceil(+n - 0.01) + 'px') : v;
  // В подсказках цвета пишем так же, как студент обычно пишет в CSS: #2d6a4f, а не rgb(45, 106, 79)
  const hex = note => String(note || '').replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g, (m, r, g, b, a) =>
    a !== undefined && +a < 1 ? m : '#' + [r, g, b].map(x => (+x).toString(16).padStart(2, '0')).join(''));
  function helper(f, html, css, js = '') {
    const doc = f.contentDocument, win = f.contentWindow;
    const el = s => typeof s === 'string' ? doc.querySelector(s) : s;
    const rules = [];
    const walk = (list, media) => [...list].forEach(r => {
      if (r.type === 1) rules.push({ selector: r.selectorText, style: r.style, media, empty: r.style.length === 0 });
      else if (r.cssRules) walk(r.cssRules, (media ? media + ' ' : '') + (r.conditionText || r.media?.mediaText || ''));
    });
    try { walk(doc.styleSheets[0]?.cssRules || [], ''); } catch (e) {}
    const h = {
      doc, win, html, css, js, rules, width: win.innerWidth, height: win.innerHeight,
      $: s => doc.querySelector(s),
      $$: s => [...doc.querySelectorAll(s)],
      count: s => doc.querySelectorAll(s).length,
      cs: (s, p) => { const e = el(s); return e ? fixStyle(p, win.getComputedStyle(e).getPropertyValue(p)) : ''; },
      px: (s, p) => { const e = el(s); return e ? parseFloat(fixStyle(p, win.getComputedStyle(e).getPropertyValue(p))) : NaN; },
      rect: s => { const e = el(s); return e ? e.getBoundingClientRect() : null; },
      text: s => (el(s)?.textContent || '').replace(/\s+/g, ' ').trim(),
      overflow: () => Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth) > win.innerWidth + 1,
      sameRow: els => { const t = els.map(e => el(e).getBoundingClientRect().top); return els.length > 1 && Math.max(...t) - Math.min(...t) < 2; },
      before: (a, b) => { const x = el(a), y = el(b); return !!(x && y && (x.compareDocumentPosition(y) & 4)); },
      inside: (a, b) => { const x = el(a)?.getBoundingClientRect(), y = el(b)?.getBoundingClientRect(); return !!(x && y && x.left >= y.left - 1 && x.right <= y.right + 1); },
      contrast: s => { const e = el(s); return e ? contrast(e, win) : null; },
      // CSS без комментариев и пробелов — для заданий «оптимизируй»
      cssSize: () => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '').length,
      has: re => re.test(css.replace(/\/\*[\s\S]*?\*\//g, '')),
      occurrences: str => (css.replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase().match(new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase(), 'g')) || []).length,
      // Число частей в самом длинном селекторе: «.menu a» — 2, «body div.page ul li a» — 5
      maxDepth: () => Math.max(0, ...rules.flatMap(r => r.selector.split(',').map(s => s.trim().replace(/::?[\w-]+(\([^)]*\))?/g, '').split(/\s*[>+~]\s*|\s+/).filter(Boolean).length)))
    };
    return h;
  }

  /* ---------- проверки JavaScript ----------
     Помощник h внутри страницы студента:
       h.$, h.$$, h.count, h.text, h.cs(sel, prop), h.px(sel, prop) — как в обычных проверках;
       h.click(sel) — клик; h.type(sel, value) — ввести значение и послать input и change;
       h.submit(sel = 'form') — отправить форму (событие submit без перехода и без проверки браузера);
       h.key(sel, key) — нажать клавишу (keydown и keyup); h.wait(ms = 60) — подождать;
       h.get('имя') — глобальная переменная или функция студента (в том числе объявленная через let/const);
       h.alerts — тексты alert, confirm и prompt; h.logs — что вывел console.log; h.errors — ошибки выполнения.
     check может быть async и возвращает true или строку с причиной. */
  const JS_HEAD = `<script>(()=>{const E=window.__ash={errors:[],logs:[],alerts:[]};
addEventListener('error',e=>E.errors.push(e.message||String(e)));
addEventListener('unhandledrejection',e=>E.errors.push(String(e.reason&&e.reason.message||e.reason)));
const L=console.log.bind(console);console.log=(...a)=>{E.logs.push(a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' '));L(...a)};
window.alert=m=>{E.alerts.push(String(m))};window.confirm=m=>{E.alerts.push(String(m));return true};window.prompt=(m,d)=>{E.alerts.push(String(m));return d==null?'':String(d)};})()<\/script>`;
  const JS_HELPER = `const D=document,E=window.__ash,el=s=>typeof s==='string'?D.querySelector(s):s,
FX=(p,v)=>/^(border(-(top|right|bottom|left))?-width|outline-width|column-rule-width)$/.test(p)?v.replace(/(\\d*\\.\\d+)px/g,(m,n)=>Math.ceil(+n-0.01)+'px'):v,
need=s=>{const e=el(s);if(!e)throw new Error('не найден элемент '+s);return e;};
const h={doc:D,win:window,errors:E.errors,logs:E.logs,alerts:E.alerts,
$:s=>D.querySelector(s),$$:s=>[...D.querySelectorAll(s)],count:s=>D.querySelectorAll(s).length,
text:s=>(el(s)?.textContent||'').replace(/\\s+/g,' ').trim(),
cs:(s,p)=>{const e=el(s);return e?FX(p,getComputedStyle(e).getPropertyValue(p)):''},
px:(s,p)=>{const e=el(s);return e?parseFloat(FX(p,getComputedStyle(e).getPropertyValue(p))):NaN},
visible:s=>{const e=el(s);if(!e)return false;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden'&&e.getClientRects().length>0},
click:s=>{need(s).click()},
type:(s,v)=>{const e=need(s);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))},
submit:(s='form')=>{const f=need(s);return f.dispatchEvent(typeof SubmitEvent==='function'?new SubmitEvent('submit',{bubbles:true,cancelable:true}):new Event('submit',{bubbles:true,cancelable:true}))},
key:(s,k)=>{const e=need(s);['keydown','keyup'].forEach(t=>e.dispatchEvent(new KeyboardEvent(t,{key:k,bubbles:true,cancelable:true})))},
wait:(ms=60)=>new Promise(r=>setTimeout(r,ms)),
get:n=>{try{return (0,eval)(n)}catch(e){return undefined}}};`;
  function jsCheck(test, html, css, js) {
    const id = 'r' + Math.random().toString(36).slice(2);
    const tail = `<script>(()=>{${JS_HELPER}
const run=async()=>{let out;try{await h.wait(30);const r=await (${test.check.toString()})(h);out={ok:r===true,note:typeof r==='string'?r:(r===true?'':'проверка не прошла')}}catch(e){out={ok:false,note:'ошибка: '+e.message}}
parent.postMessage({ash:'${id}',out},'*')};
if(D.readyState==='complete')run();else addEventListener('load',run);})()<\/script>`;
    const src = page(html, css, js, JS_HEAD).replace(/<\/body><\/html>$/, () => tail + '</body></html>'); // функция: «$'» в тексте проверки не должен раскрываться
    return new Promise(res => {
      const f = document.createElement('iframe');
      f.setAttribute('sandbox', 'allow-scripts');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = `position:fixed;left:-20000px;top:0;width:${test.at === 360 ? 360 : 1024}px;height:${HEIGHT}px;border:0;visibility:hidden`;
      let done = false;
      const fin = out => { if (done) return; done = true; removeEventListener('message', on); clearTimeout(timer); f.remove(); res(out); };
      const on = e => { if (e.source === f.contentWindow && e.data && e.data.ash === id) fin(e.data.out); };
      addEventListener('message', on);
      const timer = setTimeout(() => fin({ ok: false, note: 'страница не ответила за 5 секунд: нет ли бесконечного цикла?' }), 5000);
      document.body.appendChild(f);
      f.srcdoc = src;
    });
  }

  /* ---------- общие проверки качества ---------- */
  const DEPRECATED = 'font,center,marquee,big,strike,tt,blink,frame,frameset,basefont';
  const accName = (e, doc) => {
    const lb = e.getAttribute('aria-labelledby');
    if (lb) return lb.split(/\s+/).map(id => doc.getElementById(id)?.textContent || '').join(' ').trim();
    return (e.getAttribute('aria-label') || e.textContent || [...e.querySelectorAll('img[alt]')].map(i => i.alt).join(' ') || e.getAttribute('title') || '').trim();
  };
  const QUALITY = [
    { id: 'semantic', name: 'Семантика: нет устаревших тегов вроде <font> и <center>', check: h => { const bad = h.$$(DEPRECATED); return bad.length ? `найдено: <${bad[0].tagName.toLowerCase()}>` : true; } },
    { id: 'headings', name: 'Семантика: заголовки идут по порядку, без пропуска уровней', check: h => {
      let prev = 0;
      for (const e of h.$$('h1,h2,h3,h4,h5,h6')) { const n = +e.tagName[1]; if (prev && n > prev + 1) return `после h${prev} сразу h${n}`; prev = n; }
      return true; } },
    { id: 'alt', name: 'Доступность: у каждой картинки есть alt', check: h => { const n = h.$$('img:not([alt])').length; return n ? `без alt: ${n}` : true; } },
    { id: 'names', name: 'Доступность: у ссылок и кнопок есть понятное имя', check: h => { const bad = h.$$('a[href],button').filter(e => !accName(e, h.doc)); return bad.length ? `без имени: ${bad.length}` : true; } },
    { id: 'labels', name: 'Доступность: каждое поле формы подписано', check: h => {
      const bad = h.$$('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]),select,textarea')
        .filter(e => !(e.id && h.doc.querySelector(`label[for="${CSS.escape(e.id)}"]`)) && !e.closest('label') && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
      return bad.length ? `без подписи: ${bad.length}` : true; } },
    { id: 'contrast', name: 'Контраст текста по WCAG AA: 4,5:1, крупный текст 3:1', check: h => {
      for (const e of h.$$('body *')) {
        if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const cs = h.win.getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || !e.getClientRects().length) continue;
        const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
        const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
        const r = contrast(e, h.win);
        if (r != null && r < need - 0.005) return `«${e.textContent.trim().slice(0, 24)}»: ${r.toFixed(2)}:1`;
      }
      return true; } },
    { id: 'inline', name: 'Чистота: нет inline-стилей (атрибут style)', check: h => { const n = h.$$('body [style]').length; return n ? `элементов со style: ${n}` : true; } },
    { id: 'important', name: 'Чистота CSS: нет !important', check: h => h.has(/!\s*important/i) ? 'найден !important' : true },
    { id: 'dupes', name: 'Чистота CSS: нет пустых и повторяющихся правил', check: h => {
      const seen = new Set();
      for (const r of h.rules) {
        if (r.empty) return `пустое правило ${r.selector}`;
        const k = r.media + '|' + r.selector;
        if (seen.has(k)) return `${r.selector} описан дважды`;
        seen.add(k);
      }
      return true; } },
    { id: 'unused', name: 'Чистота CSS: каждый селектор что-то находит на странице', check: h => {
      for (const r of h.rules) for (const s of r.selector.split(',')) {
        const clean = s.replace(/::?(hover|focus-visible|focus-within|focus|active|visited|before|after|placeholder|marker|selection|first-letter|first-line|target|checked|disabled|invalid)\b/g, '').trim() || '*';
        try { if (!h.doc.querySelector(clean)) return `${s.trim()} ничего не находит`; } catch (e) { }
      }
      return true; } },
    { id: 'lint', name: 'Линтер HTML и CSS без ошибок', check: h => { const l = lint(h.html, h.css, h.js).filter(m => m.type === 'error'); return l.length ? (l[0].line ? `${l[0].lang}, строка ${l[0].line}: ${l[0].message}` : `${l[0].lang}: ${l[0].message}`) : true; } }
  ];

  /* ---------- линтер ---------- */
  // HTML проверяет HTMLHint, CSS — свой линтер на CSS.supports(): он знает всё, что знает браузер
  // (grid, gap, переменные), и ловит опечатки в свойствах, неверные значения, пропущенные «;» и скобки.
  const HH = () => { const g = window.HTMLHint; return g && (g.verify ? g : g.HTMLHint || g.default); };
  const HTML_RULES = { 'tag-pair': true, 'attr-no-duplication': true, 'id-unique': true, 'spec-char-escape': true, 'attr-lowercase': true, 'tagname-lowercase': true, 'src-not-empty': true, 'attr-value-double-quotes': true, 'alt-require': true };
  function cssLint(css) {
    const out = [];
    const src = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
    const lineOf = i => src.slice(0, i).split('\n').length;
    const colOf = i => i - src.lastIndexOf('\n', i - 1);
    const err = (i, message) => out.push({ lang: 'CSS', type: 'error', line: lineOf(i), col: colOf(i), from: i, message });
    const probe = document.createDocumentFragment();
    let i = 0;
    function block(depth, skipDecls) {
      let start = i;
      while (i < src.length) {
        const c = src[i];
        if (c === '{') {
          const prelude = src.slice(start, i).trim(), at = i;
          i++;
          if (/^@(media|supports|layer|container)/i.test(prelude)) block(depth + 1, false);
          else if (/^@(keyframes|font-face|page)/i.test(prelude)) block(depth + 1, true);
          else {
            const bodyStart = i;
            while (i < src.length && src[i] !== '}' && src[i] !== '{') i++;
            if (src[i] !== '}') { err(at, `не закрыта фигурная скобка после «${prelude.slice(0, 30)}»`); return; }
            if (!skipDecls) {
              if (!prelude) err(at, 'правило без селектора');
              else if (!prelude.startsWith('@')) { try { probe.querySelector(prelude); } catch (e) { err(at - prelude.length, `ошибка в селекторе «${prelude}»`); } }
              decls(src.slice(bodyStart, i), bodyStart);
            }
            i++;
          }
          start = i; continue;
        }
        if (c === '}') {
          if (depth === 0) err(i, 'лишняя закрывающая скобка }');
          else { i++; return; }
          i++; start = i; continue;
        }
        if (c === ';' && /^\s*@(import|charset)/i.test(src.slice(start, i))) { i++; start = i; continue; }
        i++;
      }
      if (depth > 0) err(src.length - 1, 'не хватает закрывающей скобки }');
      else if (src.slice(start).trim()) err(start, `непонятный текст «${src.slice(start).trim().slice(0, 30)}»`);
    }
    function decls(body, offset) {
      let k = 0, depth = 0, from = 0;
      const parts = [];
      for (; k <= body.length; k++) {
        const c = body[k];
        if (c === '(') depth++;
        else if (c === ')') depth--;
        else if ((c === ';' && depth === 0) || k === body.length) { parts.push([body.slice(from, k), offset + from]); from = k + 1; }
      }
      for (const [raw, at] of parts) {
        const d = raw.trim(); if (!d) continue;
        const pos = at + raw.indexOf(d);
        const colon = d.indexOf(':');
        if (colon < 1) { err(pos, `пропущено двоеточие: «${d.slice(0, 30)}»`); continue; }
        const prop = d.slice(0, colon).trim().toLowerCase(), value = d.slice(colon + 1).replace(/!\s*important\s*$/i, '').trim();
        if (prop.startsWith('--')) continue;
        if (!/^[a-z-]+$/.test(prop)) { err(pos, `странное имя свойства «${prop}»`); continue; }
        if (!value) { err(pos, `у свойства «${prop}» нет значения`); continue; }
        if (!CSS.supports(prop, 'inherit')) { err(pos, `неизвестное свойство «${prop}»`); continue; }
        if (/:\s*[^;]*$/.test(value) && /[a-z-]+\s*:/.test(value)) { err(pos, `пропущена «;» после «${prop}: ${value.split(/\s+/)[0]}»`); continue; }
        if (!CSS.supports(prop, value)) err(pos, `недопустимое значение «${value}» для «${prop}»`);
      }
    }
    block(0, false);
    return out;
  }
  const HTML_RU = {
    'tag-pair': 'Тег не закрыт или закрыт не тот', 'alt-require': 'У <img> нет атрибута alt', 'id-unique': 'Такой id уже есть на странице',
    'attr-no-duplication': 'Атрибут указан дважды', 'spec-char-escape': 'Символы < и > в тексте пишутся как &lt; и &gt;',
    'attr-value-double-quotes': 'Значение атрибута пишется в двойных кавычках', 'tagname-lowercase': 'Имя тега пишется строчными буквами',
    'attr-lowercase': 'Имя атрибута пишется строчными буквами', 'src-not-empty': 'Пустой атрибут src'
  };
  function htmlLint(html) {
    const hh = HH(); if (!hh) return [];
    return hh.verify(html, HTML_RULES).map(m => {
      const id = m.rule && m.rule.id, tags = id === 'tag-pair' ? (m.message.match(/\[[^\]]*\]/) || [''])[0] : '';
      return { lang: 'HTML', type: m.type === 'error' ? 'error' : 'warning', line: m.line, col: m.col, message: (HTML_RU[id] || m.message) + (tags ? ' ' + tags : '') };
    });
  }
  // JavaScript: только синтаксис. Код компилируется, но не выполняется.
  const JS_RU = [
    [/Unexpected end of input/, 'код оборвался: не хватает закрывающей } или )'],
    [/missing \) after argument list/, 'пропущена ) после аргументов функции'],
    [/Invalid or unexpected token/, 'непонятный символ: возможно, не закрыта кавычка'],
    [/Unexpected identifier '?([^']*)'?/, 'лишнее слово «$1»: возможно, пропущена запятая, точка или скобка'],
    [/Unexpected token '?([^']*)'?/, 'неожиданный символ «$1»'],
    [/Unexpected string/, 'неожиданная строка: возможно, пропущен + или запятая'],
    [/Unexpected number/, 'неожиданное число: возможно, пропущен оператор'],
    [/Identifier '([^']*)' has already been declared/, 'переменная «$1» объявлена дважды'],
    [/Missing initializer in const declaration/, 'у const нет значения: const x = …'],
    [/Invalid left-hand side in assignment/, 'слева от = должно быть имя переменной или свойства']
  ];
  function jsLint(js) {
    if (!js || !js.trim()) return [];
    try { new Function(js); return []; } catch (e) {
      let msg = e.message;
      for (const [re, ru] of JS_RU) if (re.test(msg)) { msg = msg.replace(new RegExp('^.*?' + re.source + '.*$'), ru); break; }
      return [{ lang: 'JS', type: 'error', line: 0, col: 0, message: msg }];
    }
  }
  const lint = (html, css, js) => [...htmlLint(html), ...cssLint(css), ...jsLint(js)];

  /* ---------- запуск ---------- */
  // Общие проверки для задания. В заданиях с JavaScript нет проверки «каждый селектор что-то находит»:
  // качество смотрится до запуска скриптов, а стили для состояний, которые добавляет скрипт (body.dark), законны.
  const qualityFor = task => QUALITY.filter(q => !(task.skipQuality || []).includes(q.id) && !(typeof task.js === 'string' && q.id === 'unused'));

  async function run(task, html, css, js = '') {
    const src = page(html, css);
    const frames = {};
    for (const [k, w] of Object.entries(VIEWPORTS)) { frames[k] = frame(w); }
    await Promise.all(Object.keys(frames).map(k => load(frames[k], src)));
    const H = { desk: helper(frames.desk, html, css, js), phone: helper(frames.phone, html, css, js) };
    const exec = (t, h) => {
      try {
        const r = t.check(h);
        return { name: t.name, ok: r === true, note: typeof r === 'string' ? r : '' };
      } catch (e) { return { name: t.name, ok: false, note: 'не удалось проверить: ' + e.message }; }
    };
    const quality = qualityFor(task).map(q => exec(q, H.desk));
    const func = await Promise.all(task.tests.map(async t => ({
      ...(t.js ? { name: t.name, ...(await jsCheck(t, html, css, js)) } : exec(t, t.at === 360 ? H.phone : H.desk)),
      at: t.at === 360 ? 'телефон 360px' : ''
    })));
    [...func, ...quality].forEach(r => { r.note = hex(r.note); });
    const report = { func, quality, lint: lint(html, css, js) };
    Object.values(frames).forEach(f => f.remove());
    return report;
  }

  window.TaskRunner = { run, page, lint, cssLint, htmlLint, jsLint, QUALITY, qualityFor, contrast };
})();
