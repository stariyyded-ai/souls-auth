/* Пример данных студента для личного кабинета.
   Сейчас это заглушка: потом сюда придёт ответ сервера в том же формате. */
window.STUDENT = {
  name: 'Солер из Асторы',
  group: { code: 'ВД-21', title: 'Веб-дизайн, 2 курс', curator: 'Хранительница огня', members: 18, rank: 3 },

  // Опыт определяет уровень, души — это баланс очков, который можно тратить
  xp: 1840,
  souls: 3450,
  soulsWeek: 120,

  // Пороги уровней по опыту
  levels: [
    { title: 'Новичок', xp: 0 },
    { title: 'Джун', xp: 1000 },
    { title: 'Мидл', xp: 3000 },
    { title: 'Сеньор', xp: 6000 }
  ],

  course: 'Веб-дизайн: основы',
  // Статусы уроков: done — пройден, current — в работе, open — доступен, locked — закрыт
  modules: [
    { title: 'Основы HTML', lessons: [
      ['Структура документа', 'done'], ['Текст и списки', 'done'], ['Ссылки и изображения', 'done'], ['Таблицы', 'done'],
      ['Формы', 'done'], ['Семантика', 'done'], ['Доступность', 'done'], ['Итоговая вёрстка', 'done']] },
    { title: 'CSS и вёрстка', lessons: [
      ['Селекторы', 'done'], ['Блочная модель', 'done'], ['Цвет и фон', 'done'], ['Шрифты', 'done'], ['Flexbox', 'done'],
      ['Grid', 'done'], ['Позиционирование', 'done'], ['Анимации', 'current'], ['Итоговый лендинг', 'open']] },
    { title: 'Адаптивная вёрстка', lessons: [
      ['Медиазапросы', 'done'], ['Резиновые сетки', 'done'], ['Изображения', 'done'], ['Mobile first', 'current'],
      ['Типографика на телефоне', 'open'], ['Навигация', 'open'], ['Тестирование', 'locked'], ['Итоговый проект', 'locked']] },
    { title: 'Figma и прототипы', lessons: [
      ['Интерфейс Figma', 'done'], ['Компоненты', 'done'], ['Auto layout', 'open'], ['Прототипирование', 'locked'],
      ['Дизайн-токены', 'locked'], ['Передача в разработку', 'locked']] },
    { title: 'JavaScript для дизайнера', lessons: [
      ['Переменные', 'locked'], ['События', 'locked'], ['DOM', 'locked'], ['Формы', 'locked'], ['Анимации на JS', 'locked'],
      ['Fetch', 'locked'], ['Модули', 'locked'], ['Хранилище', 'locked'], ['Отладка', 'locked'], ['Итоговый проект', 'locked']] }
  ],

  // Редкость: common, rare, epic, legendary. Без даты — ещё не получено.
  achievements: [
    { icon: 'flame', title: 'Первый костёр', text: 'Пройти первый урок', rarity: 'common', date: '2026-09-02' },
    { icon: 'scroll', title: 'Летописец', text: 'Сдать 10 заданий', rarity: 'common', date: '2026-09-21' },
    { icon: 'sword', title: 'Клинок Flexbox', text: 'Сдать вёрстку на флексах без доработок', rarity: 'rare', date: '2026-09-28' },
    { icon: 'shield', title: 'Несокрушимый', text: 'Пять заданий подряд с первого раза', rarity: 'epic', date: '2026-10-05' },
    { icon: 'key', title: 'Ключ от склепа', text: 'Закрыть модуль «Основы HTML» на 100%', rarity: 'rare', date: '2026-09-19' },
    { icon: 'skull', title: 'Вы погибли', text: 'Получить первую доработку и не сдаться', rarity: 'common', date: '2026-09-10' },
    { icon: 'crown', title: 'Лорд вёрстки', text: 'Войти в тройку лучших группы', rarity: 'legendary', date: '2026-10-11' },
    { icon: 'ring', title: 'Знак тьмы', text: 'Сдать задание после полуночи', rarity: 'epic', date: null },
    { icon: 'star', title: 'Хвала солнцу', text: 'Помочь трём одногруппникам', rarity: 'rare', date: null },
    { icon: 'slug', title: 'Друг слизня', text: 'Зарегистрироваться через дверь', rarity: 'common', date: '2026-09-01' }
  ],

  // Статусы: accepted — принято, revision — на доработке, failed — не сдано, review — на проверке
  history: [
    { date: '2026-10-11', task: 'Анимация кнопки в стиле Souls', module: 'CSS и вёрстка', status: 'review', xp: 0, souls: 0 },
    { date: '2026-10-09', task: 'Mobile first: карточка товара', module: 'Адаптивная вёрстка', status: 'accepted', xp: 120, souls: 200 },
    { date: '2026-10-05', task: 'Сетка галереи на Grid', module: 'CSS и вёрстка', status: 'accepted', xp: 150, souls: 250 },
    { date: '2026-10-02', task: 'Компоненты кнопок в Figma', module: 'Figma и прототипы', status: 'accepted', xp: 90, souls: 150 },
    { date: '2026-09-30', task: 'Позиционирование: модальное окно', module: 'CSS и вёрстка', status: 'revision', xp: 0, souls: 0 },
    { date: '2026-09-28', task: 'Шапка сайта на Flexbox', module: 'CSS и вёрстка', status: 'accepted', xp: 140, souls: 220 },
    { date: '2026-09-24', task: 'Резиновая сетка блога', module: 'Адаптивная вёрстка', status: 'failed', xp: 0, souls: -50 },
    { date: '2026-09-19', task: 'Итоговая вёрстка HTML', module: 'Основы HTML', status: 'accepted', xp: 200, souls: 400 }
  ],

  // Курсы: active — идёт, open — можно записаться, locked — нужен уровень
  courses: [
    { title: 'Веб-дизайн: основы', text: 'Твой текущий курс', status: 'active' },
    { title: 'UI-анимация', text: 'Микроанимации, переходы, easing', status: 'open', hours: 24 },
    { title: 'Типографика в интерфейсах', text: 'Шрифтовые пары, ритм, сетка', status: 'open', hours: 16 },
    { title: 'Продвинутый JavaScript', text: 'Состояние, компоненты, API', status: 'locked', need: 'Мидл' },
    { title: 'Дизайн-системы', text: 'Токены, библиотеки, документация', status: 'locked', need: 'Сеньор' }
  ]
};
