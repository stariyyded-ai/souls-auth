/* Занятие 57: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w5701: t => ({
      html: t.html,
      css: `${t.css}.modal-anim[open] { animation: modal-in .25s ease-out; }
.modal-anim.is-closing { animation: modal-out .2s ease-in forwards; }

@keyframes modal-in { from { opacity: 0; transform: translateY(24px) scale(.97); } }
@keyframes modal-out { to { opacity: 0; transform: translateY(24px) scale(.97); } }
`,
      js: `// Модальное окно с анимацией
function openModal(dialog) {
  dialog.showModal();
}

function closeModal(dialog, value = '') {
  dialog.classList.add('is-closing');
  dialog.addEventListener('animationend', () => {
    dialog.classList.remove('is-closing');
    dialog.close(value);
  }, { once: true });
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open]');
  if (opener) openModal(document.getElementById(opener.dataset.open));
});

document.querySelectorAll('dialog.modal-anim').forEach((dialog) => {
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal(dialog, 'cancel');
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeModal(dialog, 'cancel');
  });
  dialog.querySelector('[data-close]').addEventListener('click', () => closeModal(dialog, 'ok'));
});
`
    }),
    w5702: t => ({
      html: t.html,
      css: `${t.css.replace('color: #ffffff; }', 'color: #ffffff; opacity: 0; transform: translateY(12px); transition: opacity .25s, transform .25s; }')}.toast.is-shown { opacity: 1; transform: none; }
.toast--error { background: #b42318; }

@media (prefers-reduced-motion: reduce) {
  .toast { transition-duration: 0.01ms; }
}
`,
      js: `// Уведомления
function showToast(text, type = 'success', ms = 3000) {
  const box = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = \`toast toast--\${type}\`;
  toast.textContent = text;
  box.append(toast);

  requestAnimationFrame(() => toast.classList.add('is-shown'));

  setTimeout(() => {
    toast.classList.remove('is-shown');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, ms);
}

document.getElementById('create').addEventListener('click', () => showToast('Заявка создана'));
document.getElementById('fail').addEventListener('click', () => showToast('Не удалось отправить заявку', 'error'));
`
    })
  });
})();
