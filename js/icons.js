/* Пиксельные иконки и редкости достижений: общие для кабинета и админ-панели. */
(() => {
  window.ASH_ICONS = {
    avatar: ['.....PP.....', '....PPP.....', '....XXXX....', '...XXXXXX...', '..XXXXXXXX..', '..XXYYYYXX..', '..XXXXXXXX..', '..XYXYXYXX..', '..XXXXXXXX..', '...XXXXXX...', '..RRXXXXRR..', '.RRRXXXXRRR.', 'RRRXXXXXXRRR', 'RRRXXXXXXRRR'],
    flame: ['...Y....', '..YOY...', '..YOOY..', '.YOOOY..', 'OYYOYYO.', 'OYYYYYO.', '.OOOOO..', '........'],
    sword: ['......XX', '.....XX.', '....XX..', 'X..XX...', '.XXX....', '..X.....', '.X.X....', 'X.......'],
    shield: ['.XXXXXX.', 'XYYYYYYX', 'XYYXXYYX', 'XYXXXXYX', 'XYYXXYYX', '.XYYYYX.', '..XYYX..', '...XX...'],
    skull: ['.XXXXXX.', 'XXXXXXXX', 'X..XX..X', 'X..XX..X', 'XXXXXXXX', '.XXX.XX.', '.X.X.XX.', '.XXXXXX.'],
    crown: ['X..X..X.', 'XX.X.XX.', 'XXXXXXX.', 'XYXYXYX.', 'XXXXXXX.', '........'],
    scroll: ['.XXXXXX.', 'X.YYYY.X', '.XYYYYX.', '.XY..YX.', '.XYYYYX.', '.XY..YX.', 'X.YYYY.X', '.XXXXXX.'],
    key: ['........', '.XXX....', 'X...X...', 'X...XXXX', 'X...X.X.', '.XXX..X.', '........'],
    ring: ['..XXXX..', '.XYYYYX.', 'XY....YX', 'XY....YX', 'XY....YX', 'XY....YX', '.XYYYYX.', '..XXXX..'],
    star: ['...X....', '...X....', 'XXXXXXX.', '.XXXXX..', '..XXX...', '.XX.XX..', 'X.....X.'],
    slug: S => S.slug,
    soul: ['...Y...', '..YWY..', '.YWWWY.', '.YWWWY.', 'YWWWWWY', '.YWWWY.', '..YYY..'],
    badge: ['XXXXXXXXXX', 'XYYYYYYYYX', 'XYYYWWYYYX', 'XYYWWWWYYX', 'XYYYWWYYYX', 'XYYYWWYYYX', '.XYYYYYYX.', '..XYYYYX..', '...XYYX...', '....XX....']
  };
  // Аватары персонажа (продаются в магазине; «Рыцарь» есть у всех с начала)
  window.ASH_AVATARS = {
    knight: { title: 'Рыцарь', rows: window.ASH_ICONS.avatar, pal: { X: '#9a93a6', Y: '#0a090c', R: '#8e1b1b', P: '#e8772e' } },
    sorcerer: { title: 'Чародей', pal: { H: '#3c3a6e', S: '#d9b48f', Y: '#0a090c', B: '#4b3a7a' }, rows: [
      '.....HH.....', '....HHH.....', '...HHHHH....', '..HHHHHHH...', '.HHHHHHHHHH.', '....SSSS....', '...SYSSYS...',
      '...SSSSSS...', '....SSSS....', '...BBBBBB...', '..BBBBBBBB..', '.BBBBBBBBBB.', 'BBBBBBBBBBBB', 'BBBBBBBBBBBB'] },
    onion: { title: 'Луковый рыцарь', pal: { X: '#b8a77a', Y: '#0a090c', R: '#7d6a3a' }, rows: [
      '....XXXX....', '..XXXXXXXX..', '.XXXXXXXXXX.', '.XXXXXXXXXX.', 'XXYYYYYYYYXX', '.XXXXXXXXXX.', '.XXXXXXXXXX.',
      '..XXXXXXXX..', '....RRRR....', '..RRRRRRRR..', '.RRRRRRRRRR.', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR'] },
    hollow: { title: 'Полый', pal: { X: '#cfc4ad', Y: '#1a1410', G: '#4a4238' }, rows: [
      '....XXXX....', '..XXXXXXXX..', '.XXXXXXXXXX.', '.XYYXXXXYYX.', '.XYYXXXXYYX.', '.XXXXYYXXXX.', '..XXXXXXXX..',
      '..XYXYXYXX..', '...XXXXXX...', '...GGGGGG...', '..GGGGGGGG..', '.GGGGGGGGGG.', 'GGGGGGGGGGGG', 'GGGGGGGGGGGG'] },
    crow: { title: 'Ворон', pal: { K: '#2a2633', W: '#f6c453', O: '#e8772e' }, rows: [
      '............', '....KKKK....', '...KKKKKK...', '..KKWKKKKK..', '..KKKKKKKOO.', '..KKKKKKOOO.', '...KKKKK....',
      '..KKKKKKK...', '.KKKKKKKKK..', 'KKKKKKKKKKK.', 'KKKKKKKKKKKK', '.KKKKKKKKKK.', '...O...O....', '..OO..OO....'] },
    firekeeper: { title: 'Хранительница огня', pal: { L: '#3a2d3f', M: '#c9c2b0', Y: '#5aa0e8' }, rows: [
      '....LLLL....', '..LLLLLLLL..', '.LLLLLLLLLL.', '.LLMMMMMMLL.', '.LMMMMMMMML.', '.LMMYMMYMML.', '.LMMMMMMMML.',
      '.LLMMMMMMLL.', '..LLLLLLLL..', '.LLLLLLLLLL.', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL'] },
    slug: { title: 'Слизень', pal: { G: '#8db85a', g: '#4e6e33', k: '#111', w: '#e6f0c0' }, rows: S => S.slug }
  };
  // Рамки аватара: оформление в css/pages.css по атрибуту data-frame
  window.ASH_FRAMES = { ash: 'Пепел', moon: 'Лунный свет', ember: 'Тлеющий уголь', abyss: 'Бездна', sun: 'Солнце Анор Лондо' };
  // Аватар в виде SVG: Ash.avatarSVG('crow', 5)
  window.ASH_AVATAR_SVG = (key, s) => {
    const a = window.ASH_AVATARS[key] || window.ASH_AVATARS.knight;
    const rows = typeof a.rows === 'function' ? a.rows(window.Ash.S) : a.rows;
    return window.Ash.svg(rows, a.pal, key === 'slug' ? Math.max(2, s - 1) : s);
  };
  window.ASH_RARITY = {
    common: { label: 'Обычное', c: '#bdb2a0', d: '#6e665a' },
    rare: { label: 'Редкое', c: '#5aa0e8', d: '#24496e' },
    epic: { label: 'Эпическое', c: '#a978ee', d: '#4b2a78' },
    legendary: { label: 'Легендарное', c: '#f2a33a', d: '#7a3f10' }
  };
})();
