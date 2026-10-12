/* Демо-данные админ-панели. Генерируются один раз и дальше живут в localStorage (см. admin-store.js).
   Когда появится сервер, этот файл заменится запросами к API в том же формате. */
window.ADMIN_SEED = (() => {
  let seed = 42;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const DAY = 864e5, now = Date.now();
  const ago = (maxDays, minDays = 0) => new Date(now - (minDays + rnd() * (maxDays - minDays)) * DAY).toISOString();
  const inDays = d => new Date(now + d * DAY).toISOString().slice(0, 10);

  const courses = [
    { id: 'c1', title: 'Веб-дизайн: основы' },
    { id: 'c2', title: 'UI-анимация' },
    { id: 'c3', title: 'Типографика в интерфейсах' },
    { id: 'c4', title: 'Продвинутый JavaScript' },
    { id: 'c5', title: 'Дизайн-системы' }
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

  const names = ['Солер из Асторы', 'Сигмайер из Катарины', 'Лоскутик', 'Логан Большая Шляпа', 'Григгс из Винхейма', 'Ларентий', 'Анастасия из Астраи', 'Рея из Торолунда',
    'Петрус', 'Винс', 'Ники', 'Лотрек', 'Кротик', 'Квилана', 'Эйнгьярд', 'Сиегвард', 'Каас', 'Мельдерия', 'Ирина из Карима', 'Юрия', 'Гвиндолин', 'Шива', 'Мэй', 'Андрей'];
  const translit = s => s.toLowerCase().split(' ')[0].replace(/[а-яё]/g, c => ({ а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ы:'y',э:'e',ю:'yu',я:'ya',ъ:'',ь:'' }[c] || ''));
  const users = names.map((name, i) => {
    const role = i === 0 ? 'admin' : i < 3 ? 'teacher' : 'student';
    const group = role === 'student' ? pick(groups).id : null;
    const progress = {};
    modules.forEach((m, k) => { progress[m.id] = role === 'student' ? Math.max(0, Math.min(m.lessons, Math.round(m.lessons * (1.15 - k * 0.24) * rnd() * 1.2))) : 0; });
    const done = Object.values(progress).reduce((a, b) => a + b, 0);
    return {
      id: 'u' + (i + 1), name, email: `${translit(name)}${i + 1}@ashen.pixel`, role, group,
      xp: role === 'student' ? done * 60 + Math.round(rnd() * 400) : 0,
      souls: role === 'student' ? Math.round(rnd() * 40) * 100 : 0,
      lastSeen: ago(i % 5 === 4 ? 30 : 6, i % 5 === 4 ? 8 : 0),
      created: ago(60, 30),
      progress,
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
    { id: 'l1', title: 'Как браузер читает HTML', module: 'm1', minutes: 35, published: true, video: 'https://example.com/video/html', content: 'Документ разбирается сверху вниз.\nТеги образуют дерево, а дерево превращается в DOM.\n\nНа лекции разберём doctype, head и body.' },
    { id: 'l2', title: 'Flexbox без боли', module: 'm2', minutes: 48, published: true, video: 'https://example.com/video/flex', content: 'Главная ось, поперечная ось и три свойства, которых хватает на 90% задач.' },
    { id: 'l3', title: 'Grid и области', module: 'm2', minutes: 52, published: true, video: '', content: 'grid-template-areas позволяет нарисовать раскладку прямо в CSS.' },
    { id: 'l4', title: 'Медиазапросы и контрольные точки', module: 'm3', minutes: 40, published: false, video: '', content: 'Черновик: собрать примеры точек перелома из реальных сайтов.' },
    { id: 'l5', title: 'Компоненты в Figma', module: 'm4', minutes: 45, published: true, video: 'https://example.com/video/figma', content: 'Компонент, экземпляр, варианты и свойства.' }
  ];

  const shop = [
    { id: 's1', title: 'Рамка аватара «Пепел»', type: 'cosmetic', price: 300, stock: 0, active: true, description: 'Золотая рамка вокруг аватара в кабинете.' },
    { id: 's2', title: 'Продление дедлайна на сутки', type: 'bonus', price: 800, stock: 0, active: true, description: 'Сдвигает дедлайн одного задания на 24 часа.' },
    { id: 's3', title: 'Лишняя попытка автопроверки', type: 'bonus', price: 500, stock: 0, active: true, description: 'Ещё одна попытка сверх лимита.' },
    { id: 's4', title: 'Наклейки «Хвала солнцу»', type: 'merch', price: 1500, stock: 25, active: true, description: 'Набор из пяти наклеек, забрать у куратора.' },
    { id: 's5', title: 'Тема кабинета «Анор Лондо»', type: 'cosmetic', price: 1200, stock: 0, active: false, description: 'Светлая золотая тема. Готовится.' }
  ];

  const students = users.filter(u => u.role === 'student');
  const purchases = Array.from({ length: 14 }, (_, i) => {
    const u = pick(students), it = pick(shop.filter(s => s.active));
    return { id: 'p' + (i + 1), user: u.id, item: it.id, price: it.price, date: ago(10) };
  }).sort((a, b) => b.date.localeCompare(a.date));

  const actionTexts = ['вошёл в систему', 'сдал задание «Сетка галереи на Grid»', 'открыл лекцию «Flexbox без боли»', 'сменил пароль', 'купил «Рамка аватара «Пепел»»', 'прошёл урок «Медиазапросы»', 'получил достижение «Первый костёр»', 'вышел из системы'];
  const errorTexts = ['Тест «шапка на телефоне» не прошёл: меню перекрывает логотип при 360px', 'HTML не валиден: незакрытый тег <section> в строке 42', 'Таймаут проверки: страница грузилась дольше 10 секунд', 'Не найден файл index.html в архиве', 'Найден float, хотя по условию нельзя', 'Контраст текста 2.9:1 при нужных 4.5:1'];
  const logs = [];
  for (let i = 0; i < 40; i++) { const u = pick(users); logs.push({ id: 'e' + i, kind: 'action', user: u.id, text: pick(actionTexts), date: ago(7) }); }
  for (let i = 0; i < 14; i++) { const u = pick(students), t = pick(tasks.filter(t => t.autocheck)); logs.push({ id: 'x' + i, kind: 'error', user: u.id, task: t.id, text: pick(errorTexts), date: ago(7) }); }
  purchases.forEach(p => logs.push({ id: 'tp' + p.id, kind: 'transaction', user: p.user, amount: -p.price, text: 'Покупка: ' + shop.find(s => s.id === p.item).title, date: p.date }));
  for (let i = 0; i < 16; i++) { const u = pick(students), t = pick(tasks); logs.push({ id: 'tr' + i, kind: 'transaction', user: u.id, amount: t.souls, text: 'Награда за задание «' + t.title + '»', date: ago(10) }); }
  logs.sort((a, b) => b.date.localeCompare(a.date));

  return { courses, modules, groups, achievements, users, tasks, lectures, shop, purchases, logs };
})();
