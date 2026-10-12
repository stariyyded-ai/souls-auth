/* Файлы лекций (PDF и Word) на сервере.
   Админка загружает файл (POST api/files) и хранит в лекции только { id, name, kind, size }.
   Студент скачивает его по api/files/<id>: сервер отдаст файл, только если лекция открыта его группе. */
(() => {
  const MAX = 20 * 1024 * 1024;
  const KINDS = {
    pdf: { label: 'PDF', mime: 'application/pdf' },
    docx: { label: 'Word', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  };
  // Тип по расширению: браузеры не всегда знают MIME для .docx
  const kindOf = name => { const ext = String(name).toLowerCase().split('.').pop(); return KINDS[ext] ? ext : null; };
  function check(file) {
    if (!kindOf(file.name)) return 'Подходят только файлы PDF и Word (.docx).';
    if (file.size > MAX) return 'Файл больше 20 МБ.';
    if (!file.size) return 'Файл пустой.';
    return null;
  }
  async function put(file) {
    const kind = kindOf(file.name);
    let r;
    try {
      r = await fetch('api/files', { method: 'POST', credentials: 'same-origin', body: file,
        headers: { 'X-Ash': '1', 'X-File-Name': encodeURIComponent(file.name), 'Content-Type': KINDS[kind].mime } });
    } catch (e) { throw new Error('нет связи с сервером'); }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || `ошибка сервера (${r.status})`);
    return data;
  }
  // Возвращает { id, name, kind, size, data: Blob } или null, если файла нет
  async function get(id) {
    let r;
    try { r = await fetch('api/files/' + encodeURIComponent(id), { credentials: 'same-origin' }); }
    catch (e) { throw new Error('нет связи с сервером'); }
    if (r.status === 404) return null;
    if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || `ошибка сервера (${r.status})`); }
    const data = await r.blob();
    return { id, name: decodeURIComponent(r.headers.get('X-File-Name') || 'lekciya'), kind: r.headers.get('X-File-Kind'), size: data.size, data };
  }
  const remove = id => window.Ash.api('DELETE', 'api/files/' + encodeURIComponent(id)).catch(() => {});
  const size = n => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} КБ` : `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`;

  window.AshFiles = { put, get, remove, check, kindOf, size, KINDS, ACCEPT: '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
})();
