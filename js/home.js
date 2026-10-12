/* Заглушка главной: приветствуем персонажа по имени. */
(() => {
  const name = window.Ash.store.get('name');
  if (name) document.getElementById('hello').textContent = 'У костра, ' + name.split(' ')[0];
})();
