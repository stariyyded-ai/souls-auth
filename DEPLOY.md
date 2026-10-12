# Как выложить Пепельный Пиксель в интернет

Сайту нужен сервер на Node.js 22.13 или новее и постоянный диск. На диске лежат база `ash.db` (аккаунты, прогресс, покупки, разделы админки) и папка `uploads` с файлами лекций. Без постоянного диска всё это пропадёт при первом же перезапуске.

Ниже три варианта: Render, Railway и свой VPS. Выберите один.

## Перед запуском

Задайте настройки (переменные окружения):

| Переменная | Зачем | По умолчанию |
| --- | --- | --- |
| `DATA_DIR` | папка на постоянном диске для базы и файлов | `./data` |
| `ADMIN_PASSWORD` | пароль администратора (логин `123`) | `123123123` |
| `ADMIN_LOGIN` | логин администратора | `123` |
| `DEMO_PASSWORD` | пароль демо-студента «Солер из Асторы» | `astora123` |
| `PORT` | порт; Render и Railway задают его сами | `3000` |
| `DEMO_DATA` | `off` — рабочий режим: база создаётся без выдуманных студентов, покупок и журнала, кнопка «Сбросить демо-данные» отключена | включено |

Для запуска со студентами ставьте `DEMO_DATA=off`. Если база уже создана с демо-данными, очистите её командой `npm run reset-db -- --clean`: останутся только администратор, группы, модули, задания, лекции и магазин.

`ADMIN_PASSWORD`, `ADMIN_LOGIN` и `DEMO_PASSWORD` читаются только при первом запуске, когда база создаётся. Пароль `123123123` годится для демо. Для настоящих студентов задайте длинный пароль до первого запуска или смените его потом командой:

```bash
npm run set-password -- 123 "новый-длинный-пароль"
```

## Вариант 1. Render

Нужен платный план Starter: на бесплатном плане нет диска.

1. Зайдите на [render.com](https://render.com) через GitHub.
2. **New → Blueprint**, выберите репозиторий `souls-auth`. Render прочитает `render.yaml` и сам создаст сервис с диском на 1 ГБ.
3. Когда Render спросит `ADMIN_PASSWORD` и `DEMO_PASSWORD`, впишите свои пароли.
4. Нажмите **Apply** и дождитесь сборки. Адрес сайта будет вида `https://ashen-pixel.onrender.com`.

Без Blueprint, вручную: **New → Web Service** → репозиторий, Build Command `npm ci --omit=dev`, Start Command `npm start`. В **Disks** добавьте диск с путём `/var/data`, в **Environment** задайте `DATA_DIR=/var/data` и `ADMIN_PASSWORD`.

## Вариант 2. Railway

1. Зайдите на [railway.com](https://railway.com) через GitHub.
2. **New Project → Deploy from GitHub repo**, выберите `souls-auth`. Railway сам поймёт, что это Node, и запустит `npm start`.
3. В сервисе откройте **Variables** и добавьте `DATA_DIR=/data` и `ADMIN_PASSWORD`.
4. Правой кнопкой по сервису → **Attach Volume**, путь `/data`.
5. **Settings → Networking → Generate Domain**, чтобы получить адрес сайта.

## Вариант 3. Свой сервер (VPS на Ubuntu)

Подойдёт любой VPS от 1 ГБ памяти. Команды выполняются на сервере.

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Код
sudo mkdir -p /srv/ashen-pixel && sudo chown $USER /srv/ashen-pixel
git clone https://github.com/stariyyded-ai/souls-auth.git /srv/ashen-pixel
cd /srv/ashen-pixel && npm ci --omit=dev
```

Служба, чтобы сайт запускался сам и поднимался после сбоя. Файл `/etc/systemd/system/ashen-pixel.service`:

```ini
[Unit]
Description=Ashen Pixel
After=network.target

[Service]
WorkingDirectory=/srv/ashen-pixel
ExecStart=/usr/bin/npm start
Environment=PORT=3000
Environment=DATA_DIR=/srv/ashen-pixel/data
Environment=ADMIN_PASSWORD=впишите-свой-пароль
User=www-data
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown -R www-data /srv/ashen-pixel
sudo systemctl enable --now ashen-pixel
```

nginx принимает запросы и передаёт их сайту. Файл `/etc/nginx/sites-available/ashen-pixel`, вместо `example.ru` впишите свой домен:

```nginx
server {
  server_name example.ru;
  client_max_body_size 25m;   # файлы лекций до 20 МБ
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ashen-pixel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# HTTPS от Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d example.ru
```

Обновление после новых коммитов:

```bash
cd /srv/ashen-pixel && sudo -u www-data git pull && sudo -u www-data npm ci --omit=dev && sudo systemctl restart ashen-pixel
```

## Скорость

Сжатие и кэш браузера сервер включает сам, в nginx ничего добавлять не нужно. Сильнее всего на скорость влияет, где стоит сервер: выбирайте хостинг поближе к студентам. У Render и Railway ближайшие регионы — Европа (Франкфурт, Амстердам); VPS в России или рядом откроет страницы быстрее всего.

## Резервная копия

Копируйте папку `DATA_DIR` целиком: `ash.db` и `uploads`. Надёжнее всего остановить сайт на минуту или снять копию базы так:

```bash
sqlite3 data/ash.db ".backup data/backup-$(date +%F).db"
```

## Начать с чистого листа

`npm run reset-db` удаляет всё, включая аккаунты и загруженные лекции, и заново кладёт демо-данные. То же делает кнопка «Сбросить демо-данные» в админке (при `DEMO_DATA=off` её нет). `npm run reset-db -- --clean` тоже удаляет всё, но демо-студентов не создаёт.
