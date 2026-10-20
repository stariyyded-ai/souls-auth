/* Занятие 28: эталонные решения */
(() => {
  Object.assign(window.TASK_SOLUTIONS = window.TASK_SOLUTIONS || {}, {
    w2801: t => ({
      html: t.html
        .replace('>ЧистоДом</a>', '>ТехноПульс</a>')
        .replace(`        <option value="1">Общий клининг</option>
        <option value="2">Генеральная уборка</option>
        <option value="3">Послестроительная уборка</option>
        <option value="4">Химчистка ковров и мебели</option>`, `        <option value="1">Ремонт смартфона</option>
        <option value="2">Ремонт ноутбука</option>
        <option value="3">Ремонт бытовой техники</option>
        <option value="4">Иная услуга</option>`)
        .replace('    <button class="btn" type="submit">', `    <fieldset class="field">
      <legend class="field__label">Тип оплаты</legend>
      <label class="choice"><input type="radio" name="payment" value="cash" required> Наличные</label>
      <label class="choice"><input type="radio" name="payment" value="card"> Банковская карта</label>
    </fieldset>
    <button class="btn" type="submit">`),
      css: t.css
        .replace('--color-primary: #0f766e;', '--color-primary: #1d4ed8;')
        .replace('--color-primary-dark: #115e59;', '--color-primary-dark: #1e3a8a;')
        .replace('--color-accent: #f59e0b;', '--color-accent: #f97316;')
        .replace('--color-bg: #f8fafc;', '--color-bg: #f1f5f9;')
        .replace('--color-text: #0f172a;', '--color-text: #111827;')
        .replace('--color-error: #dc2626;', '--color-error: #b91c1c;')
        .replace('--radius: 12px;', '--radius: 8px;')
    })
  });
})();
