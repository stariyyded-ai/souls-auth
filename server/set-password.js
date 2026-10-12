/* Смена пароля из консоли сервера: npm run set-password -- <логин, имя или e-mail> <новый пароль>
   Например, чтобы сменить демо-пароль администратора: npm run set-password -- 123 "новый-длинный-пароль" */
const D = require('./db');
const { hashPassword } = require('./auth');
const [login, pass] = process.argv.slice(2);
if (!login || !pass) { console.error('Нужно: npm run set-password -- <логин> <пароль>'); process.exit(1); }
if (pass.length < 8) { console.error('Возьмите пароль хотя бы из 8 символов.'); process.exit(1); }
const row = D.findLogin(login);
if (!row) { console.error('Пользователь не найден: ' + login); process.exit(1); }
D.db.prepare('UPDATE users SET pass = ? WHERE id = ?').run(hashPassword(pass), row.id);
D.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(row.id);
console.log(`Пароль для «${row.name}» изменён, все его входы сброшены.`);
