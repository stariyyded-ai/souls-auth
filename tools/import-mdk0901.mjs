// Переносит программу МДК.09.01 (65 работ) в уроки сайта.
// Запуск: node tools/import-mdk0901.mjs <папка с module-1.md … module-7.md и quiz/module-N.quiz.md>
// Пишет content/lessons/m9-NN-<id>.md: по уроку на каждую работу ПР/ЛР, с квизом и сдачей работы (work: yes).
// Задания с автопроверкой (tasks) берёт из уже существующих файлов уроков, чтобы повторный импорт их не терял.
import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2] || '/mnt/project-files/mdk-09-01';
const out = join(root, 'content', 'lessons');
const DIFF = ['Лёгкий', 'Лёгкий', 'Средний', 'Средний', 'Сложный', 'Средний', 'Сложный'];

// Уже назначенные задания с автопроверкой
const keepTasks = {};
readdirSync(out).filter(f => f.startsWith('m9-')).forEach(f => {
  const s = readFileSync(join(out, f), 'utf8');
  const id = s.match(/^id: (\S+)/m)?.[1], t = s.match(/^tasks: \[(.*)\]/m)?.[1];
  if (id && t && t.trim()) keepTasks[id] = t;
  unlinkSync(join(out, f));
});

function quizzes(n) {
  const f = join(src, 'quiz', `module-${n}.quiz.md`);
  const map = {};
  if (!existsSync(f)) return map;
  let cur = null;
  readFileSync(f, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^@@ (\S+)/);
    if (m) { cur = m[1]; map[cur] = []; return; }
    if (cur && line.trim()) map[cur].push(line.trim());
  });
  return map;
}

let session = 0, made = 0, noQuiz = [];
for (let n = 1; n <= 7; n++) {
  const text = readFileSync(join(src, `module-${n}.md`), 'utf8');
  const head = text.match(/^# Модуль \d+\. (.+?) \(/m)[1];
  const parts = text.split(/^(?=## (?:ПР|ЛР)\d+\.)/m);
  // Вступление модуля (до первой работы) идёт в начало первой работы модуля
  const intro = parts[0].replace(/^# .*\n/, '').replace(/\n---\s*$/, '').trim();
  const qz = quizzes(n);
  parts.slice(1).forEach((part, k) => {
    session++;
    const h = part.match(/^## (ПР|ЛР)(\d+)\. (.+)$/m);
    const lab = h[1] === 'ЛР', num = +h[2];
    const id = `m9-${lab ? 'lr' : 'pr'}${String(num).padStart(2, '0')}`;
    let body = part.slice(h[0].length).replace(/\n---\s*$/, '').trim()
      .replace(/^#### /gm, '### ').replace(/^### /gm, '## ');
    const lead = `> **Работа ${session} из 65 · ${lab ? 'лабораторная' : 'практическая'} работа ${h[1]}${num} · 2 часа · модуль ${n} «${head}».** ` +
      'Прочитайте лекцию, выполните задание по шагам и сдайте работу внизу страницы: преподаватель оценит её по критериям.';
    if (k === 0 && intro) body = `## О модуле ${n}\n\n${intro}\n\n${body}`;
    const quiz = qz[id];
    if (!quiz) noQuiz.push(id);
    const fm = ['---', `id: ${id}`, `module: mdk9${n}`, `lesson: ${k + 1}`, `session: ${session}`, `kind: ${lab ? 'lab' : 'practice'}`,
      `title: ${h[1]}${num}. ${h[3].trim()}`, `difficulty: ${DIFF[n - 1]}`, 'minutes: 120', `tasks: [${keepTasks[id] || ''}]`, 'work: yes', '---'].join('\n');
    const file = `m9-${String(session).padStart(2, '0')}-${id.slice(3)}.md`;
    writeFileSync(join(out, file), `${fm}\n${lead}\n\n${body}\n${quiz ? `\n:::quiz\n${quiz.join('\n').replace(/\n(?=\? )/g, '\n\n')}\n:::\n` : ''}`);
    made++;
  });
}
console.log(`Уроков: ${made}${noQuiz.length ? `; без квиза: ${noQuiz.join(', ')}` : ''}`);
