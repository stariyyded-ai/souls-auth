# Озвучка ролика «Путь путника»

Без файлов ролик озвучивает сам браузер (русский голос системы). Чтобы поставить свои записи,
положите сюда mp3 и перечислите их в `manifest.json`, например:

```json
{
  "prolog": "prolog.mp3",
  "spring": "spring.mp3",
  "summer": "summer.mp3",
  "autumn": "autumn.mp3",
  "winter": "winter.mp3",
  "master1": "master1.mp3",
  "master2": "master2.mp3",
  "master3": "master3.mp3",
  "master4": "master4.mp3",
  "end": "end.mp3"
}
```

Тексты — в `js/intro.js` (поле `text` у сцен и `lines` у избушки). Можно записать не все: чего нет в списке, прочитает браузер.
Пока запись играет, ролик ждёт её конца.
