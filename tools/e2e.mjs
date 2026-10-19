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
  // Студента в кабинете при первом входе встречает ролик: закрываем его, чтобы не мешал остальным проверкам
  await p.waitForURL(/cabinet|admin/, { timeout: 5000 }).catch(() => {});
  if (/cabinet/.test(p.url())) { const box = p.locator('.intro'); if (await box.count() || await box.waitFor({ timeout: 2000 }).then(() => true, () => false)) { introSeenOnLogin = true; await p.keyboard.press('Escape'); } }
}
let introSeenOnLogin = false;
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

  /* ---------- глазик у пароля ---------- */
  await anon.goto(U + 'index.html'); await anon.fill('#l-pass', 'secret');
  await anon.click('#l-pass + .eye');
  ok(await anon.getAttribute('#l-pass', 'type') === 'text' && await anon.getAttribute('#l-pass + .eye', 'aria-pressed') === 'true', 'глазик показывает пароль');
  await anon.click('#l-pass + .eye');
  ok(await anon.getAttribute('#l-pass', 'type') === 'password', 'и снова прячет');

  /* ---------- неверный пароль ---------- */
  await login(anon, '123', 'wrong-pass');
  await anon.waitForFunction(() => document.getElementById('n-login').textContent.length > 0, null, { timeout: 8000 });
  ok((await anon.textContent('#n-login')).includes('Неверное'), 'неверный пароль: «ВЫ ПОГИБЛИ» и сообщение');

  /* ---------- регистрация ---------- */
  const fillReg = async (name, code) => {
    await anon.goto(U + 'register.html');
    await anon.fill('#r-name', name); await anon.fill('#r-code', code);
    await anon.fill('#r-pass', 'pass1234'); await anon.fill('#r-pass2', 'pass1234'); await anon.check('#r-oath');
    await anon.click('#b-reg');
  };
  ok(await anon.locator('#r-mail, #r-consent').count() === 0, 'в регистрации нет e-mail и согласия на обработку персональных данных');
  ok((await api(anon, 'POST', 'api/register', { name: 'knight@test.io', password: 'pass1234', code: invite('g1') })).status === 400, 'e-mail вместо имени персонажа сервер не принимает');
  await fillReg('Рыцарь Тестов', 'AAAA-BBBB'); await anon.waitForTimeout(500);
  ok((await anon.textContent('#n-reg')).includes('Неверный код группы'), 'с чужим кодом группы регистрации нет');
  await fillReg('Рыцарь Тестов', invite('g1').toLowerCase().replace('-', ' '));
  await anon.waitForURL(/index\.html/, { timeout: 10000 });
  ok(await anon.inputValue('#l-name') === 'Рыцарь Тестов', 'после регистрации имя подставлено во вход');
  await fillReg('рыцарь тестов', invite('g1')); await anon.waitForTimeout(500);
  ok((await anon.textContent('#n-reg')).includes('занято'), 'занятое имя (другой регистр) не пускает');

  /* ---------- новый студент ---------- */
  await login(anon, 'рыцарь тестов', 'pass1234');
  await anon.waitForURL(/cabinet\.html/, { timeout: 10000 });
  ok(await anon.textContent('#st-name') === 'Рыцарь Тестов', 'вход по имени персонажа, в кабинете своё имя');
  const hp = await anon.textContent('#hp-val');
  ok(/^0 \/ \d+ уроков · 0%$/.test(hp) && await anon.locator('#hist-body .empty').count() === 1 && await anon.textContent('#souls') === '0', `новичок начинает с нуля: ${hp}, история пуста, 0 душ`);
  ok(await anon.locator('#mod-list .pip.done').count() === 0, 'в модулях новичка нет пройденных уроков');
  ok(await anon.textContent('#st-group') === 'Группа ВД-21 · Веб-дизайн, 2 курс', 'по коду студент попал в свою группу');
  // Курсы: открыты курсы группы (ВД-21: c1, c2), остальные — только по запросу
  ok(await anon.locator('#course-list .course.active').count() === 2 && await anon.locator('#course-list [data-ask]').count() === 4, 'в кабинете открыты только курсы группы');
  await anon.click('[data-ask="c4"]'); await anon.waitForTimeout(500);
  ok((await anon.textContent('#course-list .course:has-text("Продвинутый JavaScript") button')) === 'ЗАЯВКА ОТПРАВЛЕНА', 'студент попросил открыть курс');
  const again = await api(anon, 'POST', 'api/me/course-request', { course: 'c4' });
  ok(again.status === 200 && again.body.status === 'pending', 'повторная заявка на тот же курс не дублируется');
  ok((await api(anon, 'POST', 'api/me/course-request', { course: 'c1' })).status === 409, 'на уже открытый курс заявку не подать');

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
  // Фон «Привал у костра»: покупка меняет сцену сразу и на всех страницах
  await st.goto(U + 'shop.html'); await st.waitForTimeout(500);
  await st.click('[data-buy="s24"]'); await st.click('[data-buy="s24"]'); await st.waitForTimeout(1200);
  ok(await st.evaluate(() => window.AshScene.name) === 'day', 'купленный фон сразу виден на странице');
  await st.goto(U + 'cabinet.html'); await st.waitForTimeout(400);
  ok(await st.evaluate(() => window.BOOT.me.theme === 'day' && document.documentElement.dataset.scene === 'day'), 'фон сохранился на сервере и стоит в кабинете');
  ok((await api(st, 'POST', 'api/me/theme', { theme: 'autumn' })).status === 403, 'студент не может поставить фон бесплатно');
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
  ok((await api(ad, 'POST', 'api/me/theme', { theme: 'autumn' })).status === 200, 'администратор меняет фон бесплатно');
  await ad.reload(); await ad.waitForTimeout(300);
  ok(await ad.evaluate(() => window.AshScene.name) === 'autumn', 'фон администратора сохранился');
  const adb = (await api(ad, 'GET', 'api/admin/db')).body;
  ok(adb.users.some(u => u.name === 'Рыцарь Тестов'), 'новый студент виден в пользователях');
  ok(adb.purchases.some(p => p.user === 'u24' && p.item === 's12'), 'покупка студента видна в админке');
  const kid = adb.users.find(u => u.name === 'Рыцарь Тестов').id;
  ok(!adb.users.some(u => u.email) && adb.groups.every(g => g.invite), 'e-mail нигде не хранится, у групп есть коды');
  // Заявка на курс приходит администратору: счётчик в меню, раздел «Заявки», кнопка «Открыть курс»
  const req = adb.requests.find(r => r.user === kid && r.course === 'c4');
  ok(req?.status === 'pending' && await ad.textContent('#side-nav a[data-v="requests"] .nav-badge') === '1', 'заявка пришла администратору, в меню счётчик');
  await ad.goto(U + 'admin.html#requests'); await ad.waitForTimeout(500);
  await ad.click(`[data-ok="${req.id}"]`); await ad.waitForTimeout(800);
  const adb2 = (await api(ad, 'GET', 'api/admin/db')).body;
  ok(adb2.requests.find(r => r.id === req.id).status === 'approved' && adb2.users.find(u => u.id === kid).courses.includes('c4'), 'администратор открыл курс по заявке');
  ok(await ad.locator('#side-nav .nav-badge').count() === 0, 'после ответа счётчик заявок пропал');
  await anon.goto(U + 'cabinet.html'); await anon.waitForTimeout(500);
  ok(await anon.locator('#course-list .course.active').count() === 3, 'студент видит открытый по заявке курс');
  // Новая заявка, пока админка открыта: приходит уведомление
  await api(anon, 'POST', 'api/me/course-request', { course: 'c3' });
  await ad.evaluate(() => window.AdminStore.pollRequests()); await ad.waitForTimeout(300);
  ok(await ad.textContent('#side-nav a[data-v="requests"] .nav-badge') === '1', 'новая заявка появляется в открытой админке без перезагрузки');
  await api(ad, 'POST', `api/admin/requests/${(await api(ad, 'GET', 'api/admin/requests')).body.find(r => r.course === 'c3').id}/decline`);
  await anon.goto(U + 'cabinet.html'); await anon.waitForTimeout(500);
  ok(await anon.textContent('[data-ask="c3"]') === 'ПОПРОСИТЬ СНОВА', 'отклонённую заявку студент видит и может повторить');

  // Несколько достижений сразу одному и одно сразу нескольким
  const g2 = await api(ad, 'POST', `api/admin/users/${kid}/achievements`, { ids: ['a1', 'a2', 'a3'] });
  ok(g2.status === 200 && ['a1', 'a2', 'a3'].every(id => g2.body.achievements.some(a => a.id === id)), 'администратор выдал три достижения за раз');
  const g3 = await api(ad, 'POST', 'api/admin/achievements/a4/grant', { users: [kid, 'u24'] });
  ok(g3.status === 200 && g3.body.every(u => u.achievements.some(a => a.id === 'a4')), 'одно достижение выдано сразу двоим');
  await anon.goto(U + 'cabinet.html'); await anon.waitForTimeout(500);
  ok(await anon.evaluate(() => ['a1', 'a2', 'a3', 'a4'].every(id => window.Student.state.ach[id])), 'студент получил все выданные достижения');
  await ad.goto(U + 'admin.html#users'); await ad.reload(); await ad.waitForTimeout(400);
  await ad.click(`[data-grant="${kid}"]`); await ad.waitForTimeout(300);
  const boxes = ad.locator('#modal-body input[name=ach]');
  await boxes.nth(0).check(); await boxes.nth(1).check();
  await ad.click('#modal-actions button:has-text("ВЫДАТЬ")'); await ad.waitForTimeout(900);
  const nAch = (await api(ad, 'GET', 'api/admin/db')).body.users.find(u => u.id === kid).achievements.length;
  ok(nAch === 6, `в окне админки отмечено и выдано два достижения сразу (у студента ${nAch})`);

  // Уроки группы: добавлен, но не разрешён — виден с замком и не засчитывается; разрешён — проходится
  await ad.goto(U + 'admin.html#lessons'); await ad.waitForTimeout(400);
  await ad.selectOption('#lg-group', 'g1'); await ad.waitForTimeout(200);
  await ad.click('#lg-all'); await ad.waitForTimeout(100);
  ok(await ad.locator('details.lg-mod:not([open])').count() === 0, 'кнопка раскрывает все темы в «Уроках групп»');
  ok(await ad.locator('.lg-legacy').count() === 1, 'у старой группы подсказка про прежнее правило');
  await ad.click('#lg-close-all'); await ad.waitForTimeout(400);
  const keepOne = await ad.evaluate(() => window.AdminStore.db.lessonList.map(l => l.id));
  for (const id of keepOne.slice(1)) { await ad.uncheck(`[data-add="${id}"]`); await ad.waitForTimeout(80); }
  await ad.waitForTimeout(600);
  const g1 = (await api(ad, 'GET', 'api/admin/db')).body.groups.find(g => g.id === 'g1');
  ok(g1.lessons.length === 1 && g1.lessonsOpen.length === 0, 'группе оставлен один урок без разрешения');
  await anon.goto(U + 'lessons.html'); await anon.waitForTimeout(500);
  ok(await anon.locator('.lesson-item').count() === 1 && await anon.locator('.lesson-item.locked').count() === 1, 'студент видит только добавленный урок, с замком');
  const first = keepOne[0], firstLesson = await anon.evaluate(id => window.LESSONS.find(l => l.id === id), first);
  const right = firstLesson.quiz.map(q => q.answer);
  ok((await act({ type: 'quiz', lesson: first, answers: right })).body.state.xp === 0, 'квиз неразрешённого урока сервер не засчитывает');
  await ad.check(`[data-open="${first}"]`); await ad.waitForTimeout(600);
  await anon.goto(U + 'lessons.html'); await anon.waitForTimeout(500);
  ok(await anon.locator('.lesson-item.locked').count() === 0, 'после разрешения урок открыт');
  ok((await anon.getAttribute('#resume-link', 'href')) === '#' + first, '«Продолжить» в уроках ведёт к открытому уроку');
  await anon.goto(U + 'cabinet.html'); await anon.waitForTimeout(500);
  if (await anon.locator('.intro').count()) await anon.keyboard.press('Escape');
  ok((await anon.getAttribute('#go-btn', 'href')) === 'lessons.html#' + first && await anon.locator('#me-chip').count() === 1, 'в кабинете «Продолжить путь» ведёт к уроку, в шапке плашка игрока');
  ok((await act({ type: 'quiz', lesson: first, answers: right })).body.state.xp > 0, 'квиз разрешённого урока засчитан');
  await ad.goto(U + 'admin.html#groups'); await ad.waitForTimeout(300);
  await ad.click('[data-x="g2"]'); await ad.waitForTimeout(300);
  ok(ad.url().endsWith('#lessons') && await ad.inputValue('#lg-group') === 'g2', 'из раздела «Группы» кнопка «Уроки» ведёт к урокам группы');

  // Новая тема и свой урок с квизом из админки
  await ad.selectOption('#lg-group', 'g1'); await ad.waitForTimeout(200);
  await ad.click('#lg-new-mod'); await ad.fill('#mo-title', 'Анимации'); await ad.click('#modal-actions button:has-text("СОЗДАТЬ")'); await ad.waitForTimeout(800);
  const mod = (await api(ad, 'GET', 'api/admin/db')).body.modules.find(m => m.title === 'Анимации');
  ok(mod, 'администратор создал тему');
  await ad.click(`[data-new-les="${mod.id}"]`); await ad.waitForTimeout(300);
  await ad.fill('#le-title', 'Переходы и transition'); await ad.fill('#le-md', '## Плавно\n\nСвойство `transition` делает смену стилей плавной.');
  await ad.click('#le-pv'); ok((await ad.innerHTML('#le-preview')).includes('<h2'), 'предпросмотр текста урока как у студента');
  await ad.click('#le-qadd'); await ad.fill('#le-quiz .le-qt', 'Что делает transition?'); await ad.fill('#le-quiz .le-qo', 'Ничего\nПлавно меняет стили'); await ad.fill('#le-quiz .le-qa', '2');
  await ad.click('#modal-actions button:has-text("СОЗДАТЬ")'); await ad.waitForTimeout(900);
  const les = (await api(ad, 'GET', 'api/admin/db')).body.lessonList.find(l => l.title === 'Переходы и transition');
  ok(les && les.custom && les.module === mod.id && les.quiz[0].answer === 1, 'администратор создал урок с квизом');
  await ad.check(`[data-add="${les.id}"]`); await ad.waitForTimeout(400); await ad.check(`[data-open="${les.id}"]`); await ad.waitForTimeout(700);
  await anon.goto(U + 'lessons.html'); await anon.waitForTimeout(500);
  ok((await anon.textContent('#modules')).includes('Анимации') && (await anon.textContent('#modules')).includes('Переходы и transition'), 'студент видит новую тему и урок');
  await anon.goto(U + 'lessons.html#' + les.id); await anon.waitForTimeout(500);
  ok((await anon.textContent('#ls-body')).includes('делает смену стилей плавной') && await anon.locator('.mini').isHidden(), 'урок открывается, без мини-задания блок скрыт');
  const xp0 = (await api(anon, 'GET', 'api/me')).body.state.xp;
  await anon.check('input[name=q0][value="1"]'); await anon.click('#quiz-form button[type=submit]'); await anon.waitForTimeout(1200);
  const meL = (await api(anon, 'GET', 'api/me')).body;
  const prog = (await api(ad, 'GET', 'api/admin/db')).body.users.find(u => u.id === kid).progress[mod.id];
  ok(meL.state.xp === xp0 + 20 && prog === 1, `квиз нового урока засчитан сервером, урок пройден (+${meL.state.xp - xp0} XP, пройдено ${prog})`);
  // Изменить урок курса и вернуть как было
  const base = (await api(ad, 'GET', 'api/admin/db')).body.lessonList.find(l => l.builtin);
  await ad.click(`[data-ed-les="${base.id}"]`); await ad.waitForTimeout(300);
  await ad.fill('#le-title', 'Изменённый урок'); await ad.click('#modal-actions button:has-text("СОХРАНИТЬ")'); await ad.waitForTimeout(900);
  ok((await api(ad, 'GET', 'api/admin/db')).body.lessonList.find(l => l.id === base.id).title === 'Изменённый урок', 'урок курса изменён');
  await ad.click(`[data-revert="${base.id}"]`); await ad.click('#modal-actions button:has-text("ВЕРНУТЬ")'); await ad.waitForTimeout(900);
  ok((await api(ad, 'GET', 'api/admin/db')).body.lessonList.find(l => l.id === base.id).title === base.title, 'урок курса возвращён как было');
  ok((await api(ad, 'DELETE', `api/admin/modules/${mod.id}`, { label: 'тему' })).status === 409, 'тему с уроками удалить нельзя');
  const stDb = await anon.evaluate(() => window.BOOT.db.groups);
  ok(stDb.every(g => !('invite' in g)), 'коды групп студенту не видны');
  ok((await api(ad, 'POST', 'api/me/password', { current: 'wrong', password: 'new-admin-pass' })).status === 400, 'свой пароль не меняется без текущего');
  ok((await api(ad, 'POST', 'api/me/password', { current: '123123123', password: 'new-admin-pass' })).status === 200
    && (await api(anon, 'POST', 'api/login', { login: '123', password: 'new-admin-pass' })).status === 200, 'администратор сменил свой пароль');
  await api(ad, 'POST', 'api/me/password', { current: 'new-admin-pass', password: '123123123' });
  await login(anon, 'Рыцарь Тестов', 'pass1234'); await anon.waitForURL(/cabinet\.html/, { timeout: 10000 });
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
  ok((await api(anon, 'POST', 'api/login', { login: 'Рыцарь Тестов', password: 'pass1234' })).status === 401, 'старый пароль больше не подходит');
  ok((await api(anon, 'POST', 'api/login', { login: 'Рыцарь Тестов', password: 'new-pass-77' })).status === 200, 'новый пароль от администратора подходит');
  await ad.goto(U + 'admin.html#users'); await ad.waitForTimeout(500);
  ok(await ad.locator('[data-del="u1"]').count() === 0, 'удалить себя администратор не может');
  await ad.click(`[data-del="${knight}"]`); await ad.waitForTimeout(300);
  await ad.click('#modal-actions button:has-text("УДАЛИТЬ")'); await ad.waitForTimeout(800);
  ok(!(await api(ad, 'GET', 'api/admin/db')).body.users.some(u => u.id === knight), 'пользователь удалён');
  ok((await api(anon, 'POST', 'api/login', { login: 'Рыцарь Тестов', password: 'new-pass-77' })).status === 401, 'удалённый пользователь не может войти');

  /* ---------- выход ---------- */
  await st.goto(U + 'cabinet.html'); await st.waitForTimeout(400);
  await st.click('a.exit'); await st.waitForURL(/index\.html/, { timeout: 8000 });
  await st.goto(U + 'cabinet.html');
  ok(st.url().endsWith('/index.html'), 'после выхода кабинет снова закрыт');

  /* ---------- курс МДК.08.01: текст урока, задание с JavaScript, песочница ---------- */
  const ca = await ctxPage();
  await login(ca, '123', '123123123'); await ca.waitForURL(/admin\.html/, { timeout: 10000 });
  await ca.goto(U + 'lessons.html#mdk-28'); await ca.waitForTimeout(1500);
  ok((await ca.textContent('#ls-body')).length > 3000 && await ca.locator('#mini .mini-card').count() === 3, 'урок курса: текст подгрузился, у занятия три задания');
  ok(await ca.locator('#ls-body .try').count() > 0, 'под примерами HTML есть кнопка «Попробовать»');
  await ca.locator('#ls-body .try').first().click(); await ca.waitForURL(/tasks\.html#sandbox/, { timeout: 8000 }); await ca.waitForTimeout(800);
  ok((await ca.textContent('#t-mech')).startsWith('Песочница') && await ca.locator('#run').isHidden(), 'пример открылся в песочнице без проверки');
  await ca.goto(U + 'tasks.html#k2801'); await ca.waitForTimeout(1200);
  ok(await ca.locator('#tab-js').isVisible(), 'у задания с JavaScript есть вкладка script.js');
  await ca.evaluate(() => new Promise(r => { const s = document.createElement('script'); s.src = 'tools/solutions-course.js'; s.onload = r; document.head.appendChild(s); }));
  await ca.evaluate(() => { const t = window.TASKS.find(x => x.id === 'k2801'), sol = window.TASK_SOLUTIONS.k2801(t), cms = document.querySelectorAll('.CodeMirror'); cms[0].CodeMirror.setValue(sol.html); cms[1].CodeMirror.setValue(sol.css); cms[2].CodeMirror.setValue(sol.js || ''); });
  await ca.click('#run'); await ca.waitForSelector('#result:not([hidden])', { timeout: 20000 });
  ok(await ca.locator('#t-checks li.ok').count() === await ca.locator('#t-checks li').count(), 'задание с JavaScript решается через редактор: все проверки зелёные');
  ok((await ca.getAttribute('#preview', 'sandbox')).includes('allow-scripts') && !(await ca.getAttribute('#preview', 'sandbox')).includes('allow-same-origin'), 'предпросмотр выполняет скрипт студента без доступа к сайту');
  await ca.goto(U + 'tasks.html'); await ca.waitForTimeout(1000);
  ok(await ca.locator('#course-list .course-mod').count() === 5, 'в заданиях курс разложен по пяти темам');

  /* ---------- курс из кабинета, время на задание, скрытые уроки и темы ---------- */
  const sx = await ctxPage();
  await sx.goto(U + 'index.html');
  ok((await api(sx, 'POST', 'api/register', { name: 'Студент Курса', password: 'kurs1234', code: invite('g4') })).status === 201, 'студент зарегистрировался в группу ИСП-11');
  await login(sx, 'Студент Курса', 'kurs1234'); await sx.waitForURL(/cabinet\.html/, { timeout: 10000 });
  await sx.click('#course-list a[href="lessons.html#course-c6"]'); await sx.waitForURL(/lessons\.html#course-c6/, { timeout: 8000 }); await sx.waitForTimeout(600);
  const heads = await sx.locator('#modules .module h2').allTextContents();
  ok(heads.length === 5 && heads.every(h => h.startsWith('08.01')) && (await sx.textContent('#list-title')).startsWith('МДК.08.01'), 'кнопка «Открыть» в кабинете ведёт в уроки курса: только его пять тем');
  await sx.goto(U + 'tasks.html#k0101'); await sx.waitForTimeout(1200);
  await sx.evaluate(() => { window.Student.workTime('k0101', 42); return window.Student.flush(); }); await sx.waitForTimeout(800);
  const sid = (await api(ad, 'GET', 'api/admin/db')).body.users.find(u => u.name === 'Студент Курса').id;
  const tt = (await api(ad, 'GET', `api/admin/users/${sid}/tasks`)).body.tasks.find(t => t.id === 'k0101');
  ok(tt && tt.active >= 42 && tt.norm === 15 && !tt.solved, `админка видит время студента на задании (${tt && tt.active} с)`);
  await ad.goto(U + 'admin.html#users'); await ad.reload(); await ad.waitForTimeout(800);
  await ad.click(`[data-open="${sid}"]`); await ad.waitForSelector('#u-time table', { timeout: 8000 });
  ok((await ad.textContent('#u-time')).includes('Первая страница'), 'в карточке студента есть таблица «Время на задания»');
  await ad.click('#modal-actions button:has-text("ЗАКРЫТЬ")');
  // Скрыть урок и тему у группы ИСП-11 в разделе «Уроки групп»; у других групп они остаются
  await ad.goto(U + 'admin.html#lessons'); await ad.waitForTimeout(600);
  await ad.selectOption('#lg-group', 'g4'); await ad.waitForTimeout(400);
  await ad.click('#lg-all'); await ad.waitForTimeout(100);
  await ad.click('[data-ghide-les="mdk-01"]'); await ad.waitForTimeout(900);
  await ad.click('[data-ghide-mod="mdk2"]'); await ad.waitForTimeout(900);
  const gdb = (await api(ad, 'GET', 'api/admin/db')).body.groups;
  ok(gdb.find(g => g.id === 'g4').hiddenLessons.includes('mdk-01') && gdb.find(g => g.id === 'g4').hiddenModules.includes('mdk2') && !(gdb.find(g => g.id === 'g1').hiddenModules || []).length, 'скрытие сохранено только у группы ИСП-11');
  await sx.goto(U + 'lessons.html'); await sx.waitForTimeout(800);
  const vis = await sx.evaluate(() => [...document.querySelectorAll('#modules .lesson-item h3')].map(h => h.textContent));
  ok(!vis.some(t => t.startsWith('Как устроен веб')) && await sx.locator('#modules .module').count() === 4, 'скрытые урок и тема пропали из «Уроков» студента группы');
  await sx.goto(U + 'cabinet.html'); await sx.waitForTimeout(800);
  ok(!(await sx.textContent('#mod-list')).includes('CSS: оформление страниц') && (await sx.textContent('#mod-list')).includes('HTML: первые страницы'), 'скрытая тема пропала из «Модулей курса» в кабинете');
  ok((await api(sx, 'POST', 'api/me/actions', { actions: [{ type: 'read', lesson: 'mdk-01' }] })).body.results[0].ok === false, 'скрытый урок сервер не засчитывает');
  await sx.goto(U + 'tasks.html#k0101'); await sx.waitForTimeout(800);
  ok(!sx.url().includes('#k0101'), 'задание скрытого урока не открывается');
  await ad.click('[data-ghide-les="mdk-01"]'); await ad.waitForTimeout(900);
  await ad.click('[data-ghide-mod="mdk2"]'); await ad.waitForTimeout(900);
  await sx.goto(U + 'lessons.html'); await sx.waitForTimeout(800);
  ok(await sx.locator('#modules .module').count() === 5 && await sx.locator('#modules a[href="#mdk-01"]').count() === 1, 'урок и тема снова видны группе после «Показать»');

  /* ---------- вступительный ролик ---------- */
  ok(introSeenOnLogin, 'при первом входе студента в кабинет открывается ролик «Путь путника»');
  await sx.goto(U + 'cabinet.html'); await sx.waitForTimeout(800);
  ok(await sx.locator('.intro').count() === 0, 'второй раз ролик сам не открывается');
  await sx.bringToFront(); await sx.click('#intro-btn'); await sx.click('.intro [data-go]');
  ok(await sx.waitForFunction(() => document.querySelector('.intro-text')?.textContent.startsWith('Пепел'), null, { timeout: 8000 }).then(() => true, () => false), 'кнопка внизу кабинета запускает ролик, идут подписи');
  await sx.keyboard.press('Escape'); await sx.waitForTimeout(300);
  ok(await sx.locator('.intro').count() === 0, 'Esc закрывает ролик');

  /* ---------- правки по замечаниям: «Назад», таймер, рамка при масштабе, ссылки в предпросмотре, копипаст, меню, лидеры ---------- */
  {
    // Масштаб браузера 125% и часы компьютера отстают на 5 минут
    const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1.25 });
    await ctx.clock.install({ time: new Date(Date.now() - 5 * 60000) });
    const z = await ctx.newPage(); z.on('pageerror', e => errs.push(e.message));
    await login(z, 'Солер из Асторы', 'astora123');
    await z.click('nav.topnav a[href="leaderboard.html"]'); await z.waitForURL(/leaderboard/);
    await z.goBack();
    const backOk = await z.waitForFunction(() => { const p = document.getElementById('panel'); return /cabinet/.test(location.href) && p && !p.classList.contains('out') && getComputedStyle(p).opacity === '1'; }, null, { timeout: 5000 }).then(() => true, () => false);
    ok(backOk, 'после «Назад» в браузере страница видна');
    await z.goto(U + 'tasks.html#t01'); await z.waitForTimeout(1200);
    await z.reload(); await z.waitForTimeout(1500);
    const clk = await z.textContent('#clock');
    ok(!clk.startsWith('-') && /^0:0\d$/.test(clk), `таймер после перезагрузки идёт от нуля по часам сервера (${clk})`);
    const bw = await z.evaluate(async () => {
      const t = { id: 'x', tests: [{ name: 'рамка', check: h => h.px('.b', 'border-top-width') === 2 || h.cs('.b', 'border-top-width') }, { name: 'цвет', check: h => h.cs('.b', 'color') === 'x' || h.cs('.b', 'color') }] };
      const r = await window.TaskRunner.run(t, '<button class="b">Кнопка</button>', '.b { border: 2px solid #2d6a4f; color: #ffffff; }');
      return r.func.map(f => f.ok + ':' + f.note);
    });
    ok(bw[0] === 'true:' && bw[1] === 'false:#ffffff', `при масштабе 125% рамка 2px засчитана, цвет в подсказке как в CSS (${bw.join(' / ')})`);
    // Ссылка-якорь в предпросмотре не открывает вместо работы страницу сайта
    await z.evaluate(() => document.querySelector('#task-view .CodeMirror').CodeMirror.setValue('<a id="go" href="#far">к записи</a><div style="height:3000px"></div><p id="far">Запись</p><a id="out" href="tasks.html">сайт</a>'));
    await z.waitForTimeout(800);
    const pv = z.frameLocator('#preview');
    await pv.locator('#go').click(); await pv.locator('#out').click({ timeout: 3000 }).catch(() => {}); await z.waitForTimeout(800);
    ok(await pv.locator('#far').count() === 1 && await pv.locator('.topnav').count() === 0, 'ссылки в предпросмотре не уводят на страницу сайта');
    // Копипаст: текст страницы не копируется, чужой код в редактор не вставляется, свой — вставляется
    const cp = await z.evaluate(() => {
      const ta = document.querySelector('#task-view .CodeMirror textarea'), cm = document.querySelector('#task-view .CodeMirror').CodeMirror;
      // CodeMirror сам отменяет стандартную вставку и вставляет текст, поэтому смотрим на содержимое редактора
      const paste = text => { cm.setValue(''); cm.focus(); const dt = new DataTransfer(); dt.setData('text/plain', text); ta.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); return cm.getValue(); };
      const copy = el => { const e = new ClipboardEvent('copy', { bubbles: true, cancelable: true }); el.dispatchEvent(e); return e.defaultPrevented; };
      const pageCopy = copy(document.getElementById('t-goal'));
      const foreign = paste('body { color: red; }');
      cm.setValue('<p>своё</p>'); cm.execCommand('selectAll'); copy(ta);
      return { pageCopy, foreign, own: paste('<p>своё</p>') };
    });
    ok(cp.pageCopy && cp.foreign === '' && cp.own === '<p>своё</p>', `копировать текст страницы и вставлять чужой код нельзя, свой код вставляется (${JSON.stringify(cp)})`);
    // Проценты в «Модулях курса» учитывают начатые уроки
    const lp = await z.evaluate(() => window.Economy.lessonProgress({ id: 'x', quiz: [1, 2], tasks: ['a', 'b'] }, { lessons: { x: { read: true, quiz: 1, quizMax: 2 } }, tasks: { a: { solved: true } } }));
    ok(lp === 0.625, `прогресс начатого урока: прочитан, квиз наполовину, одно задание из двух — ${lp * 100}%`);
    // Лидеры по группам
    await z.goto(U + 'leaderboard.html'); await z.waitForTimeout(600);
    await z.click('#lb-filter [data-g="groups"]'); await z.waitForTimeout(200);
    const grp = await z.locator('#lb-body tr.grp-row').count();
    await z.selectOption('#lb-group', { index: 1 }); await z.waitForTimeout(200);
    const one = await z.evaluate(() => new Set([...document.querySelectorAll('#lb-body tr td:nth-child(3)')].map(td => td.textContent)).size);
    ok(grp >= 2 && one === 1, `таблица лидеров разбивается по группам (${grp}) и показывает одну выбранную группу`);
    // Администратор скрывает «Уроки» из меню студентов
    const ad2 = await ctxPage(); await login(ad2, '123', '123123123'); await ad2.waitForURL(/admin\.html/, { timeout: 10000 });
    await ad2.check('[data-hide-nav="lessons"]'); await ad2.waitForTimeout(600);
    await z.goto(U + 'cabinet.html'); await z.waitForTimeout(500);
    const studentNav = await z.locator('nav.topnav a[href="lessons.html"]').count();
    ok(studentNav === 0 && await ad2.locator('nav.topnav a.off[href="lessons.html"]').count() === 1, 'скрытые «Уроки» пропали из меню студента, у администратора — с пометкой');
    await ad2.uncheck('[data-hide-nav="lessons"]'); await ad2.waitForTimeout(600);
    await z.goto(U + 'cabinet.html'); await z.waitForTimeout(500);
    ok(await z.locator('nav.topnav a[href="lessons.html"]').count() === 1, '«Уроки» вернулись в меню студента');
    await ctx.close(); await ad2.context().close();
  }

  /* ---------- телефон: все страницы без горизонтальной прокрутки ---------- */
  const m = await ctxPage(390);
  await login(m, '123', '123123123'); await m.waitForURL(/admin\.html/, { timeout: 10000 });
  for (const pg of ['cabinet.html', 'lessons.html', 'tasks.html', 'shop.html', 'leaderboard.html', 'admin.html#users', 'admin.html#lessons', 'admin.html#requests', 'register.html', 'privacy.html']) {
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
