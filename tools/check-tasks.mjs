// Проверка автотестов: node tools/check-tasks.mjs [http://localhost:8765/]
// Нужен Playwright и запущенный в корне проекта сервер: python3 -m http.server 8765
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:8765/';
const b = await chromium.launch(); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base + 'tools/check-tasks.html');
await p.waitForFunction(() => window.RESULT, null, { timeout: 120000 });
const rows = await p.evaluate(() => window.RESULT);
let bad = 0;
for (const r of rows) {
  const problems = [];
  if (!r.starterFails) problems.push('шаблон проходит все проверки результата');
  problems.push(...r.solutionFuncFails.map(x => 'эталон: ' + x), ...r.solutionQualityFails.map(x => 'качество: ' + x), ...r.lintErrors.map(x => 'линтер: ' + x));
  if (problems.length) bad++;
  console.log(`${problems.length ? '✗' : '✓'} ${r.id} ${r.title} (шаблон валит ${r.starterFails})${problems.map(x => '\n    ' + x).join('')}`);
}
if (errs.length) console.log('Ошибки страницы:', errs);
console.log(bad ? `Проблем: ${bad}` : 'Все 25 заданий в порядке');
await b.close();
process.exit(bad ? 1 : 0);
