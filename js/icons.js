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
  window.ASH_RARITY = {
    common: { label: 'Обычное', c: '#bdb2a0', d: '#6e665a' },
    rare: { label: 'Редкое', c: '#5aa0e8', d: '#24496e' },
    epic: { label: 'Эпическое', c: '#a978ee', d: '#4b2a78' },
    legendary: { label: 'Легендарное', c: '#f2a33a', d: '#7a3f10' }
  };
})();
