# PILOT-LOG — поток IMG, счёт по картинке

Ветка `feat/count-by-image` от тега 2.5.8. Каталог `~/Documents/Projects/qalan/ntm-img`.

- 19:44:33 26.11 — старт.
- Разбор: фикстуры, бэк (`calculate_by_image_task_answer.ex`), старый экран
  (`TaskDescriptionAndAnswerInput.jsx`), наш `trainer/`, прежняя наработка
  `feat/new-types`. Найдено: в 2.5.8 типов нет, на `feat/new-types` уже были —
  взяли за основу, поправили проверку (мультимножество) и режимы withCell.
- Картинки: в `variants.json` SVG обрезаны на 200 символах, восстановлены из
  модулей бэка по началу и длине — 51 вариант из 136, в сторибук взято 27
  целых payload.
- 20:14 — закрыт `calculateByImage.plain`: решается 106 генераторов
  (0: 27, 1: 24, 2: 28, 3: 26, 4: 1) из 117 с примером; 11 — к бэку или не
  собрать (список в спеке).
- 20:14 — закрыт `calculateByImage.withCell`: решается 39 из 39 с примером
  (0: 17, 1: 15, 2: 6, 4: 1).
- 20:20 — юнит пакета: 851 из 854; три падения те же, что на чистом 2.5.8
  (`table-plain` removeBorders, `detect-column-operation-type` — нет файла
  `stats/snapshots` на машине, `task-unavailable` — по нагрузке).
- 20:24 — спека: `qalan-docs/trainer/specs/count-by-image.md` в qalan-assets.
