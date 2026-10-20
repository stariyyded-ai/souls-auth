/* Занятие 59: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5901: t => ({
      html: t.html, css: t.css,
      js: t.js.replace('// Ваш код: saveStatus и один обработчик change на таблице\n', `async function saveStatus(select, status, reason = '') {
  const row = select.closest('tr');
  select.disabled = true;                       // защита от двойного клика
  try {
    const response = await fetch('update_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      body: JSON.stringify({ id: Number(row.dataset.id), status, reason }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || \`Ошибка \${response.status}\`);

    select.dataset.current = status;            // запоминаем новое значение
    renderBadge(row.querySelector('[data-badge]'), status);
    showToast('Статус изменён');
  } catch (err) {
    select.value = select.dataset.current;      // откат к старому значению
    showToast(err.message, 'error');
  } finally {
    select.disabled = false;
  }
}

document.querySelector('table').addEventListener('change', (e) => {
  const select = e.target.closest('.status-select');
  if (select) saveStatus(select, select.value);
});
`)
    }),
    w5902: t => ({
      html: t.html, css: t.css,
      js: t.js.replace(`// 1. change на таблице: cancelled — окно, остальное — сразу saveStatus

// 2. submit формы причины

// 3. Кнопка «Не отменять»

// 4. Событие close: вернуть select, если отмену не подтвердили
`, `document.querySelector('table').addEventListener('change', (e) => {
  const select = e.target.closest('.status-select');
  if (!select) return;
  if (select.value === 'cancelled') {
    pendingSelect = select;
    reasonInput.value = '';
    reasonError.textContent = '';
    reasonInput.classList.remove('is-invalid');
    dialog.showModal();
    reasonInput.focus();
  } else {
    saveStatus(select, select.value);
  }
});

cancelForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const reason = reasonInput.value.trim();
  if (reason === '') {
    reasonInput.classList.add('is-invalid');
    reasonError.textContent = 'Укажите причину отмены';
    reasonInput.focus();
    return;
  }
  const select = pendingSelect;
  pendingSelect = null;
  dialog.close();
  saveStatus(select, 'cancelled', reason);
});

document.querySelector('[data-cancel-close]').addEventListener('click', () => dialog.close());

// закрыли окно без подтверждения (кнопка, Esc) — вернуть select назад
dialog.addEventListener('close', () => {
  if (pendingSelect) {
    pendingSelect.value = pendingSelect.dataset.current;
    pendingSelect = null;
  }
});
`)
    })
  });
})();
