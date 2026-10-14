// Проверка автотестов: node tools/check-tasks.mjs [http://localhost:8765/] [--only k01,k02]
// --only — только задания курса из content/tasks/k01.js… с решениями из tools/solutions (без сборки)
// Нужен Playwright и запущенный в корне проекта сервер: python3 -m http.server 8765
import { chromium } from 'playwright';
const args = process.argv.slice(2), oi = args.indexOf('--only');
const only = oi >= 0 ? args.splice(oi, 2)[1] : '';
const base = args[0] || 'http://localhost:8765/';
const b = await chromium.launch(); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base + 'tools/check-tasks.html' + (only ? '?only=' + only : ''));
await p.waitForFunction(() => window.RESULT, null, { timeout: 600000 });
const fatal = await p.evaluate(() => window.FATAL);
if (fatal) { console.log('Ошибка загрузки: ' + fatal); await b.close(); process.exit(1); }
const rows = await p.evaluate(() => window.RESULT);
let bad = 0;
for (const r of rows) {
  const problems = [];
  if (!r.starterFails) problems.push('шаблон проходит все проверки результата');
  problems.push(...r.solutionFuncFails.map(x => 'эталон: ' + x), ...r.solutionQualityFails.map(x => 'качество: ' + x), ...r.lintErrors.map(x => 'линтер: ' + x));
  if (problems.length) bad++;
  console.log(`${problems.length ? '✗' : '✓'} ${r.id} ${r.title} (шаблон валит ${r.starterFails})${problems.map(x => '\n    ' + x).join('')}`);
}
// Ошибки из кода шаблонов (задания «почини скрипт») тоже приходят сюда: показываем, но не считаем провалом
if (errs.length) console.log('Ошибки скриптов на странице (в том числе из шаблонов заданий):', errs.length);
console.log(bad ? `Проблем: ${bad} из ${rows.length}` : `Все ${rows.length} заданий в порядке`);
await b.close();
process.exit(bad ? 1 : 0);
