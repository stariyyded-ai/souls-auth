/* Файлы лекций (PDF и Word) в IndexedDB этого браузера.
   Админка кладёт файл сюда и хранит в лекции только { id, name, type, size }.
   Когда появится сервер, put/get заменятся загрузкой и скачиванием по API. */
(() => {
  const DB = 'ash-files', STORE = 'files';
  const MAX = 20 * 1024 * 1024;
  const KINDS = {
    pdf: { label: 'PDF', mime: 'application/pdf' },
    docx: { label: 'Word', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  };
  let dbp;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(STORE, mode), req = fn(t.objectStore(STORE));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => rej(t.error);
    });
  }
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
    const rec = { id: 'f' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), name: file.name, kind, size: file.size, added: new Date().toISOString(), data: new Blob([await file.arrayBuffer()], { type: KINDS[kind].mime }) };
    await tx('readwrite', s => s.put(rec));
    return { id: rec.id, name: rec.name, kind: rec.kind, size: rec.size };
  }
  const get = id => tx('readonly', s => s.get(id));
  const remove = id => tx('readwrite', s => s.delete(id));
  const size = n => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} КБ` : `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`;

  window.AshFiles = { put, get, remove, check, kindOf, size, KINDS, ACCEPT: '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
})();
