/* Магазин: товары берутся из админки (раздел «Магазин»), покупки и надетые предметы — из Student. */
(() => {
  const { $, esc, fmt, toast, chips, avatar, announce } = window.UI;
  const St = window.Student, A = window.AdminStore;
  const { svg, banner, sfx = {} } = window.Ash;
  const RARITY = window.ASH_RARITY, ICONS = window.ASH_ICONS;
  const TYPES = { theme: 'Фон', title: 'Звание', avatar: 'Аватар', frame: 'Рамка', booster: 'Бустер', bonus: 'Бонус', merch: 'Мерч' };
  const ORDER = Object.keys(TYPES);
  const RORDER = ['common', 'rare', 'epic', 'legendary'];
  let filter = 'all';
  let armed = null, armTimer; // товар, по которому нажали «Купить» один раз

  $('soul-icon').innerHTML = svg(ICONS.soul, { Y: '#7fb0ff', W: '#e8f1ff' }, 5);

  const items = () => A.db.shop.filter(s => s.active && TYPES[s.type])
    .sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type) || RORDER.indexOf(a.rarity) - RORDER.indexOf(b.rarity) || a.price - b.price);

  function art(s) {
    const st = St.state;
    if (s.type === 'avatar') return avatar(s.art, st.equipped.frame, 'sm');
    if (s.type === 'frame') return avatar(st.equipped.avatar, s.art, 'sm');
    if (s.type === 'title') return '<span class="ttl" aria-hidden="true">«»</span>';
    if (s.type === 'theme') return `<span class="theme-swatch" data-art="${esc(s.art || '')}" aria-hidden="true"></span>`;
    const key = s.type === 'booster' ? 'flame' : s.type === 'bonus' ? 'key' : 'scroll';
    return svg(ICONS[key], { X: RARITY[s.rarity || 'common'].c, Y: '#2a2010', O: '#e8772e', W: '#fff0b0' }, 5);
  }

  function action(s) {
    const st = St.state, once = St.once(s), owned = St.owned(s);
    const sold = s.stock && A.db.purchases.filter(p => p.item === s.id).length >= s.stock;
    if (once && owned) return St.isEquipped(s)
      ? `<button type="button" class="btn ghost" data-off="${s.type}">СНЯТЬ</button>`
      : `<button type="button" class="btn" data-wear="${s.id}">НАДЕТЬ</button>`;
    if (sold) return '<button type="button" class="btn" disabled>РАСПРОДАНО</button>';
    if (st.souls < s.price) return `<button type="button" class="btn" disabled aria-describedby="need-${s.id}">КУПИТЬ</button><span class="owned" id="need-${s.id}" style="color:var(--muted)">не хватает ${fmt(s.price - st.souls)}</span>`;
    if (armed === s.id) return `<button type="button" class="btn sure" data-buy="${s.id}">ТОЧНО? −${fmt(s.price)}</button>`;
    return `<button type="button" class="btn" data-buy="${s.id}">КУПИТЬ</button>`;
  }

  function render() {
    const st = St.state, e = st.equipped;
    $('me-ava').innerHTML = avatar(e.avatar, e.frame);
    $('me-name').textContent = St.name;
    $('me-title').textContent = e.title || '';
    $('souls').textContent = fmt(st.souls);
    const b = St.activeBoosters();
    $('boosts').innerHTML = b.length
      ? '<span>Действуют бустеры:</span>' + b.map(x => `<span class="boost">${esc(x.title)} · осталось на ${x.charges} зад.</span>`).join('')
      : '<span>Бустеров нет. Они усиливают награду за следующие решённые задания.</span>';

    const list = items().filter(s => filter === 'all' || s.type === filter || (filter === 'bonus' && s.type === 'merch'));
    $('shop-grid').innerHTML = list.map(s => {
      const r = RARITY[s.rarity || 'common'], n = st.inv[s.id] || 0;
      const on = St.once(s) && St.isEquipped(s);
      return `<li class="item${on ? ' on' : ''}" data-r="${s.rarity || 'common'}">
        <div class="item-top"><span class="item-art">${art(s)}</span>
          <div><h3>${esc(s.title)}</h3><p class="kind">${TYPES[s.type]} · ${r.label}</p></div></div>
        <p class="d">${esc(s.description)}</p>
        <div class="item-foot">
          <span class="price">${fmt(s.price)} <small>душ</small></span>
          ${n ? `<span class="owned">${on ? 'надето' : St.once(s) ? 'куплено' : 'куплено: ' + n}</span>` : ''}
          ${action(s)}
        </div></li>`;
    }).join('') || '<li class="lb-note">В этом разделе пока пусто.</li>';
  }

  $('shop-grid').addEventListener('click', e => {
    const buy = e.target.closest('[data-buy]'), wear = e.target.closest('[data-wear]'), off = e.target.closest('[data-off]');
    if (buy) {
      const s = A.byId('shop', buy.dataset.buy);
      // Первое нажатие просит подтвердить, второе покупает
      if (armed !== s.id) {
        armed = s.id; clearTimeout(armTimer);
        armTimer = setTimeout(() => { armed = null; render(); }, 4000);
        if (sfx.click) sfx.click();
        render(); document.querySelector(`[data-buy="${s.id}"]`)?.focus();
        return;
      }
      armed = null; clearTimeout(armTimer);
      const res = St.buy(s);
      if (!res.ok) { toast(res.msg); if (sfx.error) sfx.error(); render(); return; }
      if (sfx.lit) sfx.lit();
      banner('bn-lit');
      toast(s.type === 'theme' ? `Фон «${s.title}» куплен и уже на всех страницах.` : St.once(s) ? `«${s.title}» куплено и надето.` : s.type === 'booster' ? `Бустер «${s.title}» сработает на следующих решённых заданиях.` : `«${s.title}» куплено. Покажите покупку куратору.`);
      announce(res.got);
      render();
      document.querySelector(`[data-off="${s.type}"],[data-buy="${s.id}"]`)?.focus();
    }
    if (wear) { const s = A.byId('shop', wear.dataset.wear); St.equip(s); if (sfx.click) sfx.click(); toast(`Надето: ${s.title}.`); render(); }
    if (off) { St.unequip(off.dataset.off); if (sfx.click) sfx.click(); render(); }
  });
  chips('type-filter', 't', v => { filter = v; render(); });
  render();
})();
