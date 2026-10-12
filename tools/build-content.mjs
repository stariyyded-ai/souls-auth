// Собирает уроки из content/lessons/*.md в js/content.js.
// Запуск: node tools/build-content.mjs
// Формат урока: front-matter с метаданными (id, module, lesson, title, difficulty, minutes, groups, task),
// дальше Markdown. Квиз — блок между строками «:::quiz» и «:::»:
//   ? Вопрос
//   - [ ] неверный вариант
//   - [x] верный вариант
//   > пояснение после ответа
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'content', 'lessons');

function frontMatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error(`${file}: нет front-matter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/); if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    else if (/^\d+$/.test(v)) v = Number(v);
    meta[kv[1]] = v;
  }
  return { meta, body: src.slice(m[0].length) };
}
function quiz(body, file) {
  const qs = [];
  const text = body.replace(/^:::quiz\n([\s\S]*?)\n:::\s*$/m, (_, block) => {
    let q = null;
    for (const raw of block.split('\n')) {
      const line = raw.trim(); if (!line) continue;
      if (line.startsWith('? ')) { q = { q: line.slice(2), options: [], answer: -1, explain: '' }; qs.push(q); }
      else if (/^- \[[ x]\] /.test(line)) { if (line[3] === 'x') q.answer = q.options.length; q.options.push(line.slice(6)); }
      else if (line.startsWith('> ')) q.explain = line.slice(2);
    }
    return '';
  });
  qs.forEach((q, i) => { if (q.answer < 0) throw new Error(`${file}: у вопроса ${i + 1} нет верного ответа`); });
  return { text: text.trim(), quiz: qs };
}

const lessons = readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(file => {
  const { meta, body } = frontMatter(readFileSync(join(dir, file), 'utf8'), file);
  for (const k of ['id', 'module', 'lesson', 'title', 'minutes', 'task']) if (meta[k] == null) throw new Error(`${file}: нет поля ${k}`);
  const { text, quiz: q } = quiz(body, file);
  return { ...meta, groups: meta.groups || [], file: 'content/lessons/' + file, markdown: text, quiz: q };
});

writeFileSync(join(root, 'js', 'content.js'),
  `/* Собрано из content/lessons/*.md командой node tools/build-content.mjs. Руками не править. */\nwindow.LESSONS = ${JSON.stringify(lessons, null, 1)};\n`);
console.log(`Уроков: ${lessons.length}, вопросов в квизах: ${lessons.reduce((a, l) => a + l.quiz.length, 0)}`);
