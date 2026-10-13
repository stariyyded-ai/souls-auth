/* Уроки на странице: js/content.js плюс то, что администратор создал или изменил в админке (приходит в api/boot.js).
   Подключается сразу после js/content.js; нужен js/student-logic.js. */
window.LESSONS = window.StudentLogic.mergeLessons(window.LESSONS || [], (window.BOOT && window.BOOT.db && window.BOOT.db.lessons) || []);
