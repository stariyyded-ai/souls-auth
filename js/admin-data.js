/* Демо-данные. Сервер один раз кладёт их в базу при первом запуске (server/db.js, функция seed).
   В браузер этот файл больше не загружается. */
window.ADMIN_SEED = (() => {
  let seed = 42;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const DAY = 864e5, now = Date.now();
  const ago = (maxDays, minDays = 0) => new Date(now - (minDays + rnd() * (maxDays - minDays)) * DAY).toISOString();
  const inDays = d => new Date(now + d * DAY).toISOString().slice(0, 10);

  // Курсы: студент видит опубликованные, а открыт курс, только если администратор дал доступ его группе или лично ему
  const courses = [
    { id: 'c1', title: 'Веб-дизайн: основы', text: 'HTML, CSS и адаптивная вёрстка', hours: 72, published: true },
    { id: 'c2', title: 'UI-анимация', text: 'Микроанимации, переходы, easing', hours: 24, published: true },
    { id: 'c3', title: 'Типографика в интерфейсах', text: 'Шрифтовые пары, ритм, сетка', hours: 16, published: true },
    { id: 'c4', title: 'Продвинутый JavaScript', text: 'Состояние, компоненты, API', hours: 40, published: true },
    { id: 'c5', title: 'Дизайн-системы', text: 'Токены, библиотеки, документация', hours: 32, published: true }
  ];
  const modules = [
    { id: 'm1', title: 'Основы HTML', lessons: 8 },
    { id: 'm2', title: 'CSS и вёрстка', lessons: 9 },
    { id: 'm3', title: 'Адаптивная вёрстка', lessons: 8 },
    { id: 'm4', title: 'Figma и прототипы', lessons: 6 },
    { id: 'm5', title: 'JavaScript для дизайнера', lessons: 10 }
  ];

  const groups = [
    { id: 'g1', code: 'ВД-21', title: 'Веб-дизайн, 2 курс', curator: 'Хранительница огня', courses: ['c1', 'c2'], modules: ['m1', 'm2', 'm3', 'm4'], deadline: inDays(21), quota: 20 },
    { id: 'g2', code: 'ВД-22', title: 'Веб-дизайн, 2 курс', curator: 'Андрэ из Асторы', courses: ['c1'], modules: ['m1', 'm2', 'm3'], deadline: inDays(14), quota: 18 },
    { id: 'g3', code: 'ВД-31', title: 'Веб-дизайн, 3 курс', curator: 'Лоскутик', courses: ['c1', 'c3', 'c4'], modules: ['m1', 'm2', 'm3', 'm4', 'm5'], deadline: inDays(30), quota: 16 }
  ];

  const achievements = [
    { id: 'a1', title: 'Первый костёр', icon: 'flame', rarity: 'common', condition: 'lessons', value: 1, reward: 50, text: 'Пройти первый урок' },
    { id: 'a2', title: 'Летописец', icon: 'scroll', rarity: 'common', condition: 'tasks', value: 10, reward: 100, text: 'Сдать 10 заданий' },
    { id: 'a3', title: 'Клинок Flexbox', icon: 'sword', rarity: 'rare', condition: 'manual', value: 0, reward: 200, text: 'Сдать вёрстку на флексах без доработок' },
    { id: 'a4', title: 'Несокрушимый', icon: 'shield', rarity: 'epic', condition: 'streak', value: 5, reward: 400, text: 'Пять заданий подряд с первого раза' },
    { id: 'a5', title: 'Ключ от склепа', icon: 'key', rarity: 'rare', condition: 'module', value: 1, reward: 250, text: 'Закрыть модуль на 100%' },
    { id: 'a6', title: 'Вы погибли', icon: 'skull', rarity: 'common', condition: 'manual', value: 0, reward: 30, text: 'Получить первую доработку и не сдаться' },
    { id: 'a7', title: 'Лорд вёрстки', icon: 'crown', rarity: 'legendary', condition: 'top', value: 3, reward: 1000, text: 'Войти в тройку лучших группы' },
    { id: 'a8', title: 'Знак тьмы', icon: 'ring', rarity: 'epic', condition: 'manual', value: 0, reward: 300, text: 'Сдать задание после полуночи' },
    { id: 'a9', title: 'Хвала солнцу', icon: 'star', rarity: 'rare', condition: 'manual', value: 0, reward: 200, text: 'Помочь трём одногруппникам' }
  ];

  const names = ['Хранитель огня', 'Сигмайер из Катарины', 'Лоскутик', 'Логан Большая Шляпа', 'Григгс из Винхейма', 'Ларентий', 'Анастасия из Астраи', 'Рея из Торолунда',
    'Петрус', 'Винс', 'Ники', 'Лотрек', 'Кротик', 'Квилана', 'Эйнгьярд', 'Сиегвард', 'Каас', 'Мельдерия', 'Ирина из Карима', 'Юрия', 'Гвиндолин', 'Шива', 'Мэй', 'Солер из Асторы'];
  // u24 «Солер из Асторы» — это демо-студент из кабинета (js/student-store.js синхронизирует его опыт и души)
  const translit = s => s.toLowerCase().split(' ')[0].replace(/[а-яё]/g, c => ({ а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ы:'y',э:'e',ю:'yu',я:'ya',ъ:'',ь:'' }[c] || ''));
  const users = names.map((name, i) => {
    const role = i === 0 ? 'admin' : i < 3 ? 'teacher' : 'student';
    const group = role === 'student' ? (i === names.length - 1 ? 'g1' : pick(groups).id) : null;
    const progress = {};
    modules.forEach((m, k) => { progress[m.id] = role === 'student' ? Math.max(0, Math.min(m.lessons, Math.round(m.lessons * (1.15 - k * 0.24) * rnd() * 1.2))) : 0; });
    const done = Object.values(progress).reduce((a, b) => a + b, 0);
    return {
      id: 'u' + (i + 1), name, email: `${translit(name)}${i + 1}@ashen.pixel`, role, group,
      xp: role === 'student' ? done * 95 + Math.round(rnd() * 700) : 0,
      souls: role === 'student' ? Math.round(rnd() * 40) * 100 : 0,
      lastSeen: ago(i % 5 === 4 ? 30 : 6, i % 5 === 4 ? 8 : 0),
      created: ago(60, 30),
      progress,
      hidden: role === 'student' && i % 7 === 5,
      achievements: role === 'student' ? achievements.filter(() => rnd() < 0.35).map(a => ({ id: a.id, date: ago(30) })) : []
    };
  });

  const tasks = [
    { id: 't1', title: 'Итоговая вёрстка HTML', module: 'm1', type: 'layout', xp: 200, souls: 400, deadline: inDays(-20), autocheck: true, attempts: 3, conditions: 'Валидный HTML, семантические теги, alt у картинок', description: 'Сверстать страницу-визитку по макету из Figma.' },
    { id: 't2', title: 'Шапка сайта на Flexbox', module: 'm2', type: 'layout', xp: 140, souls: 220, deadline: inDays(-10), autocheck: true, attempts: 3, conditions: 'Без float и абсолютного позиционирования', description: 'Логотип слева, меню справа, на телефоне меню прячется.' },
    { id: 't3', title: 'Сетка галереи на Grid', module: 'm2', type: 'layout', xp: 150, souls: 250, deadline: inDays(-3), autocheck: true, attempts: 3, conditions: 'grid-template-areas, не меньше 3 размеров карточек', description: 'Галерея работ с крупной первой карточкой.' },
    { id: 't4', title: 'Анимация кнопки в стиле Souls', module: 'm2', type: 'layout', xp: 120, souls: 200, deadline: inDays(4), autocheck: false, attempts: 2, conditions: 'Учесть prefers-reduced-motion', description: 'Кнопка с пиксельным нажатием и свечением.' },
    { id: 't5', title: 'Mobile first: карточка товара', module: 'm3', type: 'layout', xp: 120, souls: 200, deadline: inDays(7), autocheck: true, attempts: 3, conditions: 'Начинать со стилей для 360px', description: 'Карточка товара от телефона к компьютеру.' },
    { id: 't6', title: 'Компоненты кнопок в Figma', module: 'm4', type: 'mockup', xp: 90, souls: 150, deadline: inDays(10), autocheck: false, attempts: 1, conditions: 'Варианты: размер, состояние, иконка', description: 'Собрать набор кнопок с вариантами.' },
    { id: 't7', title: 'Тест: блочная модель', module: 'm2', type: 'quiz', xp: 50, souls: 80, deadline: inDays(2), autocheck: true, attempts: 2, conditions: '8 из 10 правильных ответов', description: 'Десять вопросов про margin, padding и box-sizing.' }
  ];

  const lectures = [
    { id: 'l1', title: 'Как браузер читает HTML', module: 'm1', minutes: 35, difficulty: 'base', groups: [], file: null, published: true, video: 'https://example.com/video/html', content: 'Документ разбирается сверху вниз.\nТеги образуют дерево, а дерево превращается в DOM.\n\nНа лекции разберём doctype, head и body.' },
    { id: 'l2', title: 'Flexbox без боли', module: 'm2', minutes: 48, difficulty: 'base', groups: [], file: null, published: true, video: 'https://example.com/video/flex', content: 'Главная ось, поперечная ось и три свойства, которых хватает на 90% задач.' },
    { id: 'l3', title: 'Grid и области', module: 'm2', minutes: 52, difficulty: 'base', groups: [], file: null, published: true, video: '', content: 'grid-template-areas позволяет нарисовать раскладку прямо в CSS.' },
    { id: 'l4', title: 'Медиазапросы и контрольные точки', module: 'm3', minutes: 40, difficulty: 'base', groups: [], file: null, published: false, video: '', content: 'Черновик: собрать примеры точек перелома из реальных сайтов.' },
    { id: 'l5', title: 'Компоненты в Figma', module: 'm4', minutes: 45, difficulty: 'base', groups: [], file: null, published: true, video: 'https://example.com/video/figma', content: 'Компонент, экземпляр, варианты и свойства.' }
  ];

  // Магазин. Типы: title — звание, avatar — аватар, frame — рамка, booster — бустер, bonus — бонус, merch — мерч.
  // art — какой аватар или рамка (см. js/icons.js), effect и charges — действие бустера и на сколько заданий его хватает.
  const shop = [
    { id: 's1', title: 'Рамка «Пепел»', type: 'frame', art: 'ash', rarity: 'common', price: 300, stock: 0, active: true, description: 'Золотая пепельная рамка вокруг аватара.' },
    { id: 's6', title: 'Рамка «Лунный свет»', type: 'frame', art: 'moon', rarity: 'rare', price: 700, stock: 0, active: true, description: 'Холодное сияние лунного меча.' },
    { id: 's7', title: 'Рамка «Тлеющий уголь»', type: 'frame', art: 'ember', rarity: 'epic', price: 1200, stock: 0, active: true, description: 'Рамка медленно тлеет, как костёр в Храме огня.' },
    { id: 's8', title: 'Рамка «Бездна»', type: 'frame', art: 'abyss', rarity: 'epic', price: 1800, stock: 0, active: true, description: 'Тьма, которая смотрит в ответ.' },
    { id: 's9', title: 'Рамка «Солнце Анор Лондо»', type: 'frame', art: 'sun', rarity: 'legendary', price: 2600, stock: 0, active: true, description: 'Золото и солнечный свет. Для тех, кто дошёл.' },
    { id: 's10', title: 'Аватар «Чародей»', type: 'avatar', art: 'sorcerer', rarity: 'common', price: 400, stock: 0, active: true, description: 'Остроконечная шляпа и мантия из Винхейма.' },
    { id: 's11', title: 'Аватар «Полый»', type: 'avatar', art: 'hollow', rarity: 'common', price: 500, stock: 0, active: true, description: 'Слишком много раз умирал на дедлайнах.' },
    { id: 's12', title: 'Аватар «Слизень»', type: 'avatar', art: 'slug', rarity: 'common', price: 300, stock: 0, active: true, description: 'Тот самый, что проходит в дверь регистрации.' },
    { id: 's13', title: 'Аватар «Луковый рыцарь»', type: 'avatar', art: 'onion', rarity: 'rare', price: 700, stock: 0, active: true, description: 'Хм-м-м... Любит подумать над задачей.' },
    { id: 's14', title: 'Аватар «Ворон»', type: 'avatar', art: 'crow', rarity: 'epic', price: 1200, stock: 0, active: true, description: 'Унесёт вас из Северного прибежища.' },
    { id: 's15', title: 'Аватар «Хранительница огня»', type: 'avatar', art: 'firekeeper', rarity: 'legendary', price: 2500, stock: 0, active: true, description: 'Маска и капюшон хранительницы.' },
    { id: 's24', title: 'Привал у костра', type: 'theme', art: 'day', rarity: 'rare', price: 800, stock: 0, active: true, description: 'Светлый день вместо ночи: у костра стоит путник. Фон меняется на всех страницах.' },
    { id: 's25', title: 'Осенний привал', type: 'theme', art: 'autumn', rarity: 'epic', price: 1500, stock: 0, active: true, description: 'Закат, рыжие деревья и листопад, путник греется у костра. Фон меняется на всех страницах.' },
    { id: 's16', title: 'Звание «Негорящий»', type: 'title', rarity: 'common', price: 200, stock: 0, active: true, description: 'Показывается под именем в кабинете и в таблице лидеров.' },
    { id: 's17', title: 'Звание «Рыцарь семантики»', type: 'title', rarity: 'rare', price: 600, stock: 0, active: true, description: 'Для тех, кто не верстает на div.' },
    { id: 's18', title: 'Звание «Повелитель Flexbox»', type: 'title', rarity: 'rare', price: 900, stock: 0, active: true, description: 'justify-content подчиняется вам.' },
    { id: 's19', title: 'Звание «Прочитавший спецификацию»', type: 'title', rarity: 'epic', price: 1500, stock: 0, active: true, description: 'Таких почти не осталось.' },
    { id: 's20', title: 'Звание «Лорд пикселя»', type: 'title', rarity: 'legendary', price: 3000, stock: 0, active: true, description: 'Высший титул Пепельного Пикселя.' },
    { id: 's21', title: 'Эстус опыта', type: 'booster', effect: 'xp2', charges: 3, rarity: 'rare', price: 600, stock: 0, active: true, description: 'Опыт ×2 за следующие 3 решённых задания.' },
    { id: 's22', title: 'Кольцо жадности', type: 'booster', effect: 'souls15', charges: 3, rarity: 'rare', price: 500, stock: 0, active: true, description: 'Души ×1,5 за следующие 3 решённых задания.' },
    { id: 's23', title: 'Зелёный цветок', type: 'booster', effect: 'speed', charges: 1, rarity: 'common', price: 400, stock: 0, active: true, description: 'Бонус за скорость засчитывается полностью, сколько бы вы ни решали. Одно задание.' },
    { id: 's2', title: 'Продление дедлайна на сутки', type: 'bonus', rarity: 'rare', price: 800, stock: 0, active: true, description: 'Сдвигает дедлайн одного задания на 24 часа. Покажите покупку куратору.' },
    { id: 's3', title: 'Лишняя попытка автопроверки', type: 'bonus', rarity: 'common', price: 500, stock: 0, active: true, description: 'Ещё одна попытка сверх лимита.' },
    { id: 's4', title: 'Наклейки «Хвала солнцу»', type: 'merch', rarity: 'epic', price: 1500, stock: 25, active: true, description: 'Набор из пяти наклеек, забрать у куратора.' },
    { id: 's5', title: 'Тема кабинета «Анор Лондо»', type: 'bonus', rarity: 'legendary', price: 1200, stock: 0, active: false, description: 'Светлая золотая тема. Готовится.' }
  ];

  const students = users.filter(u => u.role === 'student');
  const purchases = Array.from({ length: 14 }, (_, i) => {
    const u = pick(students), it = pick(shop.filter(s => s.active));
    return { id: 'p' + (i + 1), user: u.id, item: it.id, price: it.price, date: ago(10) };
  }).sort((a, b) => b.date.localeCompare(a.date));

  const actionTexts = ['вошёл в систему', 'сдал задание «Сетка галереи на Grid»', 'открыл лекцию «Flexbox без боли»', 'сменил пароль', 'купил «Рамка «Пепел»»', 'прошёл урок «Медиазапросы»', 'получил достижение «Первый костёр»', 'вышел из системы'];
  const errorTexts = ['Тест «шапка на телефоне» не прошёл: меню перекрывает логотип при 360px', 'HTML не валиден: незакрытый тег <section> в строке 42', 'Таймаут проверки: страница грузилась дольше 10 секунд', 'Не найден файл index.html в архиве', 'Найден float, хотя по условию нельзя', 'Контраст текста 2.9:1 при нужных 4.5:1'];
  const logs = [];
  for (let i = 0; i < 40; i++) { const u = pick(users); logs.push({ id: 'e' + i, kind: 'action', user: u.id, text: pick(actionTexts), date: ago(7) }); }
  for (let i = 0; i < 14; i++) { const u = pick(students), t = pick(tasks.filter(t => t.autocheck)); logs.push({ id: 'x' + i, kind: 'error', user: u.id, task: t.id, text: pick(errorTexts), date: ago(7) }); }
  purchases.forEach(p => logs.push({ id: 'tp' + p.id, kind: 'transaction', user: p.user, amount: -p.price, text: 'Покупка: ' + shop.find(s => s.id === p.item).title, date: p.date }));
  for (let i = 0; i < 16; i++) { const u = pick(students), t = pick(tasks); logs.push({ id: 'tr' + i, kind: 'transaction', user: u.id, amount: t.souls, text: 'Награда за задание «' + t.title + '»', date: ago(10) }); }
  logs.sort((a, b) => b.date.localeCompare(a.date));

  return { courses, modules, groups, achievements, users, tasks, lectures, shop, purchases, logs };
})();
