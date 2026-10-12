// Сквозная проверка сервера в браузере: node tools/e2e.mjs
// Поднимает сервер на свободном порту с пустой временной базой и проходит путь студента и администратора.
// Нужен Playwright (npm i -D playwright, браузер: npx playwright install chromium).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3000 + Math.floor(Math.random() * 2000);
const U = `http://localhost:${PORT}/`;
const DATA = mkdtempSync(path.join(tmpdir(), 'ash-e2e-'));
const srv = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', 'server/index.js'], { cwd: ROOT, env: { ...process.env, PORT, DATA_DIR: DATA }, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((res, rej) => { srv.stdout.on('data', d => String(d).includes('http://') && res()); srv.on('exit', rej); });

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`); if (!cond) failed++; };
const b = await chromium.launch();
const errs = [];
async function ctxPage(w = 1280) {
  const ctx = await b.newContext({ viewport: { width: w, height: 860 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  // 400, 401, 403, 404 и 409 тест вызывает нарочно
  p.on('console', m => m.type() === 'error' && !/status of 40[01349]/.test(m.text()) && errs.push(m.text()));
  return p;
}
async function login(p, name, pass) {
  await p.goto(U + 'index.html');
  await p.fill('#l-name', name); await p.fill('#l-pass', pass);
  await p.click('#b-login');
}
// Код регистрации группы читаем прямо из базы теста
const { DatabaseSync } = await import('node:sqlite');
const invite = gid => { const d = new DatabaseSync(path.join(DATA, 'ash.db')); const g = JSON.parse(d.prepare("SELECT data FROM items WHERE coll = 'groups' AND id = ?").get(gid).data); d.close(); return g.invite; };
const api = (p, method, url, body) => p.evaluate(([m, u, bd]) => fetch(u, { method: m, headers: { 'X-Ash': '1', 'Content-Type': 'application/json' }, body: bd && JSON.stringify(bd) }).then(async r => ({ status: r.status, body: await r.json().catch(() => null) })), [method, url, body]);

try {
  /* ---------- без входа ---------- */
  const anon = await ctxPage();
  await anon.goto(U + 'cabinet.html');
  ok(anon.url().endsWith('/index.html'), 'кабинет без входа ведёт на страницу входа');
  await anon.goto(U + 'admin.html');
  ok(anon.url().endsWith('/index.html#admin'), 'админка без входа ведёт на вход с подсказкой');
  ok((await anon.request.get(U + 'data/ash.db')).status() === 404 && (await anon.request.get(U + 'server/db.js')).status() === 404, 'база и код сервера наружу не отдаются');
  ok((await anon.request.post(U + 'api/login', { data: { login: '123', password: '123123123' } })).status() === 403, 'запрос без X-Ash отклонён');

  /* ---------- скорость загрузки ---------- */
  const html = await (await anon.request.get(U + 'index.html')).text();
  const css = html.match(/href="(css\/style\.css\?v=\w+)"/);
  ok(css && !/fonts\.googleapis/.test(html), 'стили с меткой версии, шрифты свои, без Google');
  const cssRes = css && await anon.request.get(U + css[1], { headers: { 'Accept-Encoding': 'gzip' } });
  ok(cssRes && /immutable/.test(cssRes.headers()['cache-control']) && cssRes.headers()['content-encoding'] === 'gzip', 'стили сжаты и кэшируются надолго');

  /* ---------- неверный пароль ---------- */
  await login(anon, '123', 'wrong-pass');
  await anon.waitForFunction(() => document.getElementById('n-login').textContent.length > 0, null, { timeout: 8000 });
  ok((await anon.textContent('#n-login')).includes('Неверное'), 'неверный пароль: «ВЫ ПОГИБЛИ» и сообщение');

  /* ---------- регистрация ---------- */
  const fillReg = async (name, mail, code, consent = true) => {
    await anon.goto(U + 'register.html');
    await anon.fill('#r-name', name); await anon.fill('#r-mail', mail); await anon.fill('#r-code', code);
    await anon.fill('#r-pass', 'pass1234'); await anon.fill('#r-pass2', 'pass1234'); await anon.check('#r-oath');
    if (consent) await anon.check('#r-consent');
    await anon.click('#b-reg');
  };
  await fillReg('Рыцарь Тестов', 'knight@test.io', invite('g1'), false); await anon.waitForTimeout(400);
  ok((await anon.textContent('#n-reg')).includes('согласия'), 'без согласия на обработку данных регистрации нет');
  ok((await api(anon, 'POST', 'api/register', { name: 'Хитрец', email: 'h@x.io', password: 'pass1234', code: invite('g1') })).status === 400, 'сервер тоже требует согласие');
  await fillReg('Рыцарь Тестов', 'knight@test.io', 'AAAA-BBBB'); await anon.waitForTimeout(500);
  ok((await anon.textContent('#n-reg')).includes('Неверный код группы'), 'с чужим кодом группы регистрации нет');
  await fillReg('Рыцарь Тестов', 'knight@test.io', invite('g1').toLowerCase().replace('-', ' '));
  await anon.waitForURL(/index\.html/, { timeout: 10000 });
  ok(await anon.inputValue('#l-name') === 'Рыцарь Тестов', 'после регистрации имя подставлено во вход');
  await fillReg('рыцарь тестов', 'other@test.io', invite('g1')); await anon.waitForTimeout(500);
  ok((await anon.textContent('#n-reg')).includes('занято'), 'занятое имя (другой регистр) не пускает');

  /* ---------- новый студент ---------- */
  await login(anon, 'knight@test.io', 'pass1234');
  await anon.waitForURL(/cabinet\.html/, { timeout: 10000 });
  ok(await anon.textContent('#st-name') === 'Рыцарь Тестов', 'вход по e-mail, в кабинете своё имя');
  const hp = await anon.textContent('#hp-val');
  ok(/^0 \/ \d+ уроков$/.test(hp) && await anon.locator('#hist-body .empty').count() === 1 && await anon.textContent('#souls') === '0', `новичок начинает с нуля: ${hp}, история пуста, 0 душ`);
  ok(await anon.locator('#mod-list .pip.done').count() === 0, 'в модулях новичка нет пройденных уроков');
  ok(await anon.textContent('#st-group') === 'Группа ВД-21 · Веб-дизайн, 2 курс', 'по коду студент попал в свою группу');
  // Курсы: открыты курсы группы (ВД-21: c1, c2), остальные — только по запросу
  ok(await anon.locator('#course-list .course.active').count() === 2 && await anon.locator('#course-list [data-ask]').count() === 3, 'в кабинете открыты только курсы группы');
  await anon.click('[data-ask="c4"]'); await anon.waitForTimeout(500);
  ok(await anon.textContent('[data-ask="c4"]') === 'ЗАПРОС ОТПРАВЛЕН', 'студент попросил открыть курс');

  /* ---------- защита от накрутки: сервер считает сам ---------- */
  const act = (...actions) => api(anon, 'POST', 'api/me/actions', { actions });
  ok((await api(anon, 'PUT', 'api/me/state', { state: { v: 1, xp: 99999, souls: 99999 }, rev: 0 })).status === 404, 'прислать своё состояние целиком больше нельзя');
  const buy = await act({ type: 'buy', item: 's20' });
  ok(buy.body.results[0].ok === false && buy.body.state.souls === 0, 'купить без душ нельзя, даже в обход страницы');
  const fake = await act({ type: 'task', task: 't01', report: { func: [{ ok: true }], quality: [] }, code: { html: '', css: '' } });
  ok(fake.body.results[0].ok === false && fake.body.state.xp === 0, 'поддельный отчёт проверки не принят');
  const q = await act({ type: 'read', lesson: 'html-structure' }, { type: 'quiz', lesson: 'html-structure', answers: [9, 9, 9] });
  ok(q.body.state.xp === 0, 'неверные ответы квиза ничего не дают: ответы сверяет сервер');
  ok(await anon.locator('nav.topnav a[href="admin.html"]').count() === 0, 'у студента нет пункта «Админка»');
  ok((await api(anon, 'POST', 'api/admin/users/u5/reset')).status === 403, 'API админки студенту отвечает 403');
  await anon.goto(U + 'admin.html');
  ok(anon.url().endsWith('/index.html#admin'), 'студента не пускает в admin.html');

  /* ---------- демо-студент: покупка и задание сохраняются на сервере ---------- */
  const st = await ctxPage();
  await login(st, 'Солер из Асторы', 'astora123');
  await st.waitForURL(/cabinet\.html/, { timeout: 10000 });
  const souls0 = (await api(st, 'GET', 'api/me')).body.me.souls;
  await st.goto(U + 'shop.html'); await st.waitForTimeout(500);
  await st.click('[data-buy="s12"]'); await st.click('[data-buy="s12"]'); await st.waitForTimeout(1200);
  await st.reload(); await st.waitForTimeout(500);
  const me1 = (await api(st, 'GET', 'api/me')).body;
  ok(me1.state.inv.s12 === 1 && me1.state.souls === souls0 - 300 + 30 && me1.state.equipped.avatar === 'slug', 'покупка аватара сохранилась на сервере и надета (−300 душ, +30 за достижение «Клиент Андрэ»)');
  await st.goto(U + 'tasks.html#t01'); await st.waitForTimeout(900);
  await st.addScriptTag({ url: U + 'tools/solutions.js' });
  await st.evaluate(() => { const s = TASK_SOLUTIONS.t01(TASKS[0]); const cms = document.querySelectorAll('.CodeMirror'); cms[0].CodeMirror.setValue(s.html); cms[1].CodeMirror.setValue(s.css); });
  await st.click('#run'); await st.waitForSelector('#result:not([hidden])'); await st.waitForTimeout(1500);
  const me2 = (await api(st, 'GET', 'api/me')).body;
  ok(me2.state.tasks.t01?.solved && me2.state.xp > me1.state.xp, `решённое задание и опыт на сервере (+${me2.state.xp - me1.state.xp} XP)`);
  ok(me2.me.xp === me2.state.xp, 'опыт попал в карточку студента для админки');

  /* ---------- администратор ---------- */
  const ad = await ctxPage();
  await login(ad, '123', '123123123');
  await ad.waitForURL(/admin\.html/, { timeout: 10000 });
  ok(await ad.locator('nav.topnav a[href="admin.html"]').count() === 1, 'администратор попадает в админку, пункт меню есть');
  const adb = (await api(ad, 'GET', 'api/admin/db')).body;
  ok(adb.users.some(u => u.name === 'Рыцарь Тестов'), 'новый студент виден в пользователях');
  ok(adb.purchases.some(p => p.user === 'u24' && p.item === 's12'), 'покупка студента видна в админке');
  ok(adb.logs.some(l => l.text === 'просит открыть курс «Продвинутый JavaScript»'), 'запрос на курс виден в журнале админки');
  const kid = adb.users.find(u => u.name === 'Рыцарь Тестов').id;
  ok(adb.users.find(u => u.id === kid).consentAt && adb.groups.every(g => g.invite), 'согласие записано, у групп есть коды');
  await api(ad, 'POST', `api/admin/users/${kid}/courses`, { courses: ['c4'] });
  await anon.goto(U + 'cabinet.html'); await anon.waitForTimeout(500);
  ok(await anon.locator('#course-list .course.active').count() === 3, 'администратор открыл курс лично студенту');
  const stDb = await anon.evaluate(() => window.BOOT.db.groups);
  ok(stDb.every(g => !('invite' in g)), 'коды групп студенту не видны');
  ok((await api(ad, 'POST', 'api/me/password', { current: 'wrong', password: 'new-admin-pass' })).status === 400, 'свой пароль не меняется без текущего');
  ok((await api(ad, 'POST', 'api/me/password', { current: '123123123', password: 'new-admin-pass' })).status === 200
    && (await api(anon, 'POST', 'api/login', { login: '123', password: 'new-admin-pass' })).status === 200, 'администратор сменил свой пароль');
  await api(ad, 'POST', 'api/me/password', { current: 'new-admin-pass', password: '123123123' });
  await login(anon, 'knight@test.io', 'pass1234'); await anon.waitForURL(/cabinet\.html/, { timeout: 10000 });
  // Создание и удаление записи в разделе админки сохраняются на сервере и попадают в журнал
  await ad.evaluate(() => window.AdminStore.create('achievements', { title: 'Тестовое', icon: 'star', rarity: 'common', condition: 'manual', value: 0, reward: 10, text: 'проверка' }, 'достижение'));
  await ad.waitForTimeout(600); await ad.reload(); await ad.waitForTimeout(400);
  const made = await ad.evaluate(() => ({ a: window.AdminStore.db.achievements.find(x => x.title === 'Тестовое'), log: window.AdminStore.db.logs[0].text }));
  ok(made.a && made.log === 'создал достижение «Тестовое»', 'новое достижение сохранилось, в журнале запись');
  await ad.evaluate(id => window.AdminStore.remove('achievements', id, 'достижение'), made.a.id);
  await ad.waitForTimeout(600); await ad.reload(); await ad.waitForTimeout(400);
  ok(!(await ad.evaluate(() => window.AdminStore.db.achievements.some(x => x.title === 'Тестовое'))), 'удаление достижения сохранилось');
  // Лекция с PDF только для группы ВД-21 (g1) и с Word для ВД-31 (g3)
  await ad.goto(U + 'admin.html#lectures'); await ad.waitForTimeout(500);
  for (const [id, f, g] of [['l2', 'lekciya-flexbox.pdf', 'g1'], ['l3', 'lekciya-flexbox.docx', 'g3']]) {
    await ad.click(`[data-ed="${id}"]`); await ad.waitForTimeout(300);
    await ad.setInputFiles('#f-file', path.join(ROOT, 'samples', f));
    await ad.locator(`input[name=groups][value=${g}]`).check();
    await ad.click('#modal-actions button:has-text("СОХРАНИТЬ")'); await ad.waitForTimeout(800);
  }
  const lec = (await api(ad, 'GET', 'api/admin/db')).body.lectures;
  const l2 = lec.find(l => l.id === 'l2'), l3 = lec.find(l => l.id === 'l3');
  ok(l2.file?.kind === 'pdf' && l3.file?.kind === 'docx', 'файлы лекций загружены на сервер');

  // Студент группы ВД-21 видит PDF, а Word для ВД-31 ему не отдают
  await st.goto(U + 'lessons.html#lecture-l2'); await st.waitForTimeout(1500);
  ok(await st.locator('iframe.pdf').count() === 1, 'студент открывает PDF-лекцию своей группы');
  ok((await api(st, 'GET', 'api/files/' + l3.file.id)).status === 403, 'файл лекции чужой группы не отдаётся');
  await ad.goto(U + 'lessons.html#lecture-l3'); await ad.waitForTimeout(2500);
  ok((await ad.textContent('#mt-file')).length > 100 && await ad.locator('.docx.prose').count() === 1, 'Word-лекция открывается как страница');

  // Сброс прогресса из админки: страница студента получает 409 и перечитывает данные
  await st.goto(U + 'tasks.html'); await st.waitForTimeout(600);
  const r = await api(ad, 'POST', 'api/admin/users/u24/reset');
  ok(r.status === 200 && r.body.xp === 0, 'администратор сбросил прогресс студента');
  await st.evaluate(() => window.Student.setHidden(true)); await st.waitForTimeout(1500);
  ok(await st.evaluate(() => window.Student.state.xp) === 0, 'открытая страница студента получила состояние после сброса');
  const me3 = (await api(st, 'GET', 'api/me')).body;
  ok(me3.state.xp === 0 && !me3.state.tasks.t01, 'после сброса страница студента не затёрла сервер старыми данными');
  ok((await api(ad, 'POST', 'api/admin/users/u1/role', { role: 'student' })).status === 400, 'администратор не может снять роль с себя');

  // Смена роли: студент становится администратором — сервер пускает его в админку
  await api(ad, 'POST', `api/admin/users/${adb.users.find(u => u.name === 'Рыцарь Тестов').id}/role`, { role: 'admin' });
  await anon.goto(U + 'admin.html');
  ok(anon.url().endsWith('/admin.html'), 'после смены роли на сервере пользователь попадает в админку');
  const knight = adb.users.find(u => u.name === 'Рыцарь Тестов').id;
  await api(ad, 'POST', `api/admin/users/${knight}/role`, { role: 'student' });

  // Группа, пароль и удаление из админки
  await ad.goto(U + 'admin.html#users'); await ad.waitForTimeout(500);
  await ad.selectOption(`[data-group="${knight}"]`, 'g3'); await ad.waitForTimeout(600);
  ok((await api(ad, 'GET', 'api/admin/db')).body.users.find(u => u.id === knight).group === 'g3', 'администратор перевёл студента в другую группу');
  await ad.click(`[data-pass="${knight}"]`); await ad.waitForTimeout(300);
  await ad.fill('#new-pass', 'abc'); await ad.click('#modal-actions button:has-text("СМЕНИТЬ ПАРОЛЬ")'); await ad.waitForTimeout(300);
  ok((await ad.textContent('#modal-note')).includes('не короче 6'), 'слишком короткий новый пароль не принимается');
  await ad.fill('#new-pass', 'new-pass-77'); await ad.click('#modal-actions button:has-text("СМЕНИТЬ ПАРОЛЬ")'); await ad.waitForTimeout(800);
  await anon.goto(U + 'cabinet.html');
  ok(anon.url().endsWith('/index.html'), 'после смены пароля старый вход студента закрыт');
  ok((await api(anon, 'POST', 'api/login', { login: 'knight@test.io', password: 'pass1234' })).status === 401, 'старый пароль больше не подходит');
  ok((await api(anon, 'POST', 'api/login', { login: 'knight@test.io', password: 'new-pass-77' })).status === 200, 'новый пароль от администратора подходит');
  await ad.goto(U + 'admin.html#users'); await ad.waitForTimeout(500);
  ok(await ad.locator('[data-del="u1"]').count() === 0, 'удалить себя администратор не может');
  await ad.click(`[data-del="${knight}"]`); await ad.waitForTimeout(300);
  await ad.click('#modal-actions button:has-text("УДАЛИТЬ")'); await ad.waitForTimeout(800);
  ok(!(await api(ad, 'GET', 'api/admin/db')).body.users.some(u => u.id === knight), 'пользователь удалён');
  ok((await api(anon, 'POST', 'api/login', { login: 'knight@test.io', password: 'new-pass-77' })).status === 401, 'удалённый пользователь не может войти');

  /* ---------- выход ---------- */
  await st.goto(U + 'cabinet.html'); await st.waitForTimeout(400);
  await st.click('a.exit'); await st.waitForURL(/index\.html/, { timeout: 8000 });
  await st.goto(U + 'cabinet.html');
  ok(st.url().endsWith('/index.html'), 'после выхода кабинет снова закрыт');

  /* ---------- телефон: все страницы без горизонтальной прокрутки ---------- */
  const m = await ctxPage(390);
  await login(m, '123', '123123123'); await m.waitForURL(/admin\.html/, { timeout: 10000 });
  for (const pg of ['cabinet.html', 'lessons.html', 'tasks.html', 'shop.html', 'leaderboard.html', 'admin.html#users']) {
    await m.goto(U + pg); await m.waitForTimeout(700);
    const ov = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 0) ok(false, `${pg}: горизонтальная прокрутка ${ov}px на телефоне`);
  }
  ok(!errs.length, 'ошибок JavaScript на страницах нет' + (errs.length ? ': ' + errs.join(' | ') : ''));

  /* ---------- чистый запуск без демо-студентов ---------- */
  const clean = mkdtempSync(path.join(tmpdir(), 'ash-clean-'));
  await new Promise(res => spawn(process.execPath, ['--disable-warning=ExperimentalWarning', 'server/index.js', '--reset', '--clean'], { cwd: ROOT, env: { ...process.env, DATA_DIR: clean }, stdio: 'ignore' }).on('exit', res));
  const { DatabaseSync } = await import('node:sqlite');
  const cdb = new DatabaseSync(path.join(clean, 'ash.db'));
  const n = q => cdb.prepare(q).get().n;
  ok(n('SELECT COUNT(*) AS n FROM users') === 1 && n('SELECT COUNT(*) AS n FROM purchases') === 0 && n("SELECT COUNT(*) AS n FROM items WHERE coll = 'shop'") > 0,
    'reset-db --clean: только администратор, без покупок, магазин и курс на месте');
  cdb.close(); rmSync(clean, { recursive: true, force: true });
} finally {
  await b.close();
  srv.kill();
  rmSync(DATA, { recursive: true, force: true });
}
console.log(failed ? `\nПровалено: ${failed}` : '\nВсё прошло.');
process.exit(failed ? 1 : 0);
