/* Пароли и сессии.
   Пароль хранится как scrypt-хеш с солью, сам пароль сервер нигде не сохраняет.
   Сессия — случайный токен в cookie ash_sid (HttpOnly, SameSite=Lax); в базе лежит только его SHA-256. */
const crypto = require('node:crypto');

const SCRYPT = { N: 16384, r: 8, p: 1, len: 32 };
function hashPassword(pass) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(pass), salt, SCRYPT.len, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${salt.toString('base64')}$${hash.toString('base64')}`;
}
function verifyPassword(pass, stored) {
  if (!stored) return false;
  const [algo, N, salt, hash] = stored.split('$');
  if (algo !== 'scrypt') return false;
  const want = Buffer.from(hash, 'base64');
  const got = crypto.scryptSync(String(pass), Buffer.from(salt, 'base64'), want.length, { N: +N, r: SCRYPT.r, p: SCRYPT.p });
  return crypto.timingSafeEqual(want, got);
}

const COOKIE = 'ash_sid';
const TTL = 14 * 24 * 3600 * 1000; // две недели
const sha = t => crypto.createHash('sha256').update(t).digest('hex');

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

// Ограничение попыток входа: не больше 10 неудач за 10 минут с одного адреса
const fails = new Map();
const WINDOW = 10 * 60 * 1000, LIMIT = 10;
function tooMany(ip) {
  const f = fails.get(ip);
  if (!f || Date.now() - f.since > WINDOW) return false;
  return f.n >= LIMIT;
}
function failed(ip) {
  const f = fails.get(ip);
  if (!f || Date.now() - f.since > WINDOW) fails.set(ip, { n: 1, since: Date.now() });
  else f.n++;
}
const succeeded = ip => fails.delete(ip);

module.exports = { hashPassword, verifyPassword, COOKIE, TTL, sha, parseCookies, tooMany, failed, succeeded };
