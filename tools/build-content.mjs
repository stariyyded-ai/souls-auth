// Собирает уроки и задания курса.
// Запуск: node tools/build-content.mjs          — собрать
//         node tools/build-content.mjs --check  — только проверить, ничего не записывая
//
// Уроки: content/lessons/*.md → js/content.js (описание урока и квиз) и content/md/<id>.md (текст урока,
// страница уроков подгружает его, когда урок открыт; так список уроков грузится быстро).
// Формат урока: front-matter с метаданными, дальше Markdown.
//   id, module, lesson (номер в теме), title, minutes — обязательно;
//   tasks: [k0101, k0102] — задания урока (или старое task: t01), kind: lecture | practice,
//   session — номер занятия в курсе, difficulty, groups; kind: lab — лабораторная работа (курс МДК.09.01).
//   work: yes — работу сдают преподавателю на оценку (ссылка и комментарий); критерии берутся из таблицы
//   под заголовком «## Критерии оценки» (столбцы: аспект, 2 балла, 1 балл, 0 баллов).
// Квиз — блок между строками «:::quiz» и «:::»:
//   ? Вопрос
//   - [ ] неверный вариант
//   - [x] верный вариант
//   > пояснение после ответа
//
// Задания курса: content/tasks/_kit.js и content/tasks/k*.js → js/tasks-course.js.
// Эталонные решения: tools/solutions/k*.js → tools/solutions-course.js (только для проверки, студентам не отдаётся).
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'content', 'lessons');
const CHECK = process.argv.includes('--check');
// --only 07,08 — проверить только занятия 7 и 8 (файлы mdk-07-*.md и content/tasks/k07.js); работает только вместе с --check
const oi = process.argv.indexOf('--only');
const ONLY = oi > 0 ? process.argv[oi + 1].split(',').map(s => s.trim().padStart(2, '0')) : null;
if (ONLY && !CHECK) { console.error('--only работает только с --check'); process.exit(1); }
const problems = [];

function frontMatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error(`${file}: нет front-matter`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*?)\s*(#.*)?$/); if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    else if (/^\d+$/.test(v)) v = Number(v);
    meta[kv[1]] = v;
  }
  return { meta, body: src.slice(m[0].length) };
}
function quiz(body, file) {
  const qs = [];
  const text = body.replace(/^:::quiz\r?\n([\s\S]*?)\r?\n:::\s*$/m, (_, block) => {
    let q = null;
    for (const raw of block.split(/\r?\n/)) {
      const line = raw.trim(); if (!line) continue;
      if (line.startsWith('? ')) { q = { q: line.slice(2), options: [], answer: -1, explain: '' }; qs.push(q); }
      else if (/^- \[[ xX]\] /.test(line)) { if (!q) throw new Error(`${file}: вариант ответа до вопроса`); if (line[3].toLowerCase() === 'x') q.answer = q.options.length; q.options.push(line.slice(6)); }
      else if (line.startsWith('> ')) { if (q) q.explain = line.slice(2); }
      else throw new Error(`${file}: непонятная строка в квизе: ${line.slice(0, 60)}`);
    }
    return '';
  });
  qs.forEach((q, i) => {
    if (q.answer < 0) throw new Error(`${file}: у вопроса ${i + 1} нет верного ответа`);
    if (q.options.length < 2 || q.options.length > 8) throw new Error(`${file}: у вопроса ${i + 1} должно быть от 2 до 8 вариантов`);
    if (new Set(q.options).size !== q.options.length) throw new Error(`${file}: повтор варианта в вопросе ${i + 1}`);
  });
  if (/^:::quiz/m.test(text)) throw new Error(`${file}: блок квиза не закрыт строкой «:::»`);
  return { text: text.trim(), quiz: qs };
}

// Критерии сдаваемой работы: строки таблицы под «## Критерии оценки» → { name, d2, d1, d0 }
function criteria(text) {
  const m = text.match(/^## Критерии оценки\s*\n([\s\S]*?)(?=\n## |(?![\s\S]))/m);
  if (!m) return [];
  const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim().replace(/\*\*/g, ''));
  return m[1].split('\n').filter(l => /^\s*\|/.test(l)).slice(2).map(cells)
    .filter(c => c.length >= 4 && c[0] && !/^итого/i.test(c[0])).map(c => ({ name: c[0], d2: c[1], d1: c[2], d0: c[3] }));
}

/* ---------- задания курса ---------- */
const tdir = join(root, 'content', 'tasks');
const taskFiles = existsSync(tdir) ? readdirSync(tdir).filter(f => /^[kwi].*\.js$/.test(f) && (!ONLY || ONLY.includes(f.slice(1, 3)))).sort() : [];
const kit = existsSync(join(tdir, '_kit.js')) ? readFileSync(join(tdir, '_kit.js'), 'utf8') : 'window.COURSE_TASKS = [];';
const taskSrc = taskFiles.map(f => `/* ---- content/tasks/${f} ---- */\n` + readFileSync(join(tdir, f), 'utf8').trim());
const course = `/* Собрано из content/tasks командой node tools/build-content.mjs. Руками не править. */\n${kit.trim()}\n${taskSrc.join('\n')}\n(window.TASKS = window.TASKS || []).push(...window.COURSE_TASKS);\n`;
// Загружаем так же, как браузер: сначала игровые задания, потом курс
const ctx = { window: {} };
try {
  vm.runInNewContext(readFileSync(join(root, 'js', 'tasks-data.js'), 'utf8'), ctx, { filename: 'js/tasks-data.js' });
  vm.runInNewContext(course, ctx, { filename: 'js/tasks-course.js' });
} catch (e) { throw new Error('Задания курса не загрузились: ' + e.message); }
const TASKS = ctx.window.TASKS;
const MECH = ctx.window.TASK_MECHANICS;
const seen = new Set();
for (const t of TASKS) {
  if (seen.has(t.id)) problems.push(`задание ${t.id} объявлено дважды`);
  seen.add(t.id);
  if (!/^t\d\d$/.test(t.id) && !/^[kwi]\d{4}$/.test(t.id)) problems.push(`${t.id}: id задания курса пишется как k0101 (занятие 01, задание 1), у МДК.09.01 — w1001, у информатики — i0101`);
  for (const k of ['title', 'level', 'minutes', 'points', 'goal', 'html', 'css', 'tests', 'mech']) if (t[k] == null) problems.push(`${t.id}: нет поля ${k}`);
  if (!MECH[t.mech]) problems.push(`${t.id}: неизвестная механика ${t.mech}`);
  if (!Array.isArray(t.tests) || !t.tests.length) problems.push(`${t.id}: нет проверок`);
  else t.tests.forEach((x, i) => { if (!x.name || typeof x.check !== 'function') problems.push(`${t.id}: проверка ${i + 1} без name или check`); });
  if (t.tests?.some(x => x.js) && typeof t.js !== 'string') problems.push(`${t.id}: проверки js есть, а поля js (код-шаблон, можно '') нет`);
}

/* ---------- уроки ---------- */
const mdDir = join(root, 'content', 'md');
const lessons = readdirSync(dir).filter(f => f.endsWith('.md') && (!ONLY || ONLY.some(n => f.startsWith(`mdk-${n}-`) || f.startsWith(`m9-${n}-`) || f.startsWith(`inf-${n}-`)))).sort().map(file => {
  const { meta, body } = frontMatter(readFileSync(join(dir, file), 'utf8'), file);
  for (const k of ['id', 'module', 'lesson', 'title', 'minutes']) if (meta[k] == null) throw new Error(`${file}: нет поля ${k}`);
  const { text, quiz: q } = quiz(body, file);
  const tasks = Array.isArray(meta.tasks) ? meta.tasks : meta.task ? [meta.task] : [];
  delete meta.task;
  for (const id of tasks) {
    const t = TASKS.find(x => x.id === id);
    if (!t) problems.push(`${file}: нет задания ${id}`);
    else if (t.lesson && t.lesson !== meta.id) problems.push(`${file}: задание ${id} привязано к уроку ${t.lesson}`);
  }
  if (meta.kind && !['lecture', 'practice', 'lab'].includes(meta.kind)) problems.push(`${file}: kind бывает lecture, practice или lab`);
  if (meta.work === 'yes') {
    meta.work = { criteria: criteria(text) };
    if (!meta.work.criteria.length) problems.push(`${file}: work: yes, но нет таблицы «## Критерии оценки»`);
  } else delete meta.work;
  const v = createHash('sha1').update(text).digest('hex').slice(0, 10);
  return { ...meta, tasks, task: tasks[0] || null, groups: meta.groups || [], file: 'content/lessons/' + file, md: v, quiz: q, text };
});
const ids = new Set();
lessons.forEach(l => { if (ids.has(l.id)) problems.push(`урок ${l.id} объявлен дважды`); ids.add(l.id); });
TASKS.filter(t => t.lesson).forEach(t => { if (!lessons.some(l => l.id === t.lesson && l.tasks.includes(t.id))) problems.push(`задание ${t.id}: урок ${t.lesson} его не перечисляет`); });

if (problems.length) { console.error('Ошибки:\n  ' + problems.join('\n  ')); process.exit(1); }

const quizN = lessons.reduce((a, l) => a + l.quiz.length, 0);
if (CHECK) { console.log(`Проверено. Уроков: ${lessons.length}, вопросов: ${quizN}, заданий: ${TASKS.length}`); process.exit(0); }

if (existsSync(mdDir)) rmSync(mdDir, { recursive: true });
mkdirSync(mdDir, { recursive: true });
lessons.forEach(l => writeFileSync(join(mdDir, l.id + '.md'), l.text + '\n'));
const out = lessons.map(({ text, ...l }) => l);
writeFileSync(join(root, 'js', 'content.js'),
  `/* Собрано из content/lessons/*.md командой node tools/build-content.mjs. Руками не править.\n   Текст урока лежит в content/md/<id>.md, поле md — его версия для кэша. */\nwindow.LESSONS = ${JSON.stringify(out)};\n`);
writeFileSync(join(root, 'js', 'tasks-course.js'), course);
const sdir = join(root, 'tools', 'solutions');
const sols = existsSync(sdir) ? readdirSync(sdir).filter(f => f.endsWith('.js')).sort() : [];
writeFileSync(join(root, 'tools', 'solutions-course.js'), `/* Собрано из tools/solutions командой node tools/build-content.mjs. */\nwindow.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {};\n` +
  sols.map(f => `/* ---- tools/solutions/${f} ---- */\n` + readFileSync(join(sdir, f), 'utf8').trim()).join('\n') + '\n');
console.log(`Уроков: ${lessons.length}, вопросов в квизах: ${quizN}, заданий: ${TASKS.length} (курса: ${ctx.window.COURSE_TASKS.length})`);
