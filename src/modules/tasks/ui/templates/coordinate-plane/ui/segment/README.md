# coordinatePlane.segment — провести отрезок на плоскости

`figure.drawingFigure` 30. Ребёнок нажимает два узла сетки — это концы
отрезка, между ними появляется брендовая линия. Нажатие на конец снимает его;
когда оба конца стоят, новое нажатие переносит второй конец.

В сторе — строка `(x1;y1);;(x2;y2)`, как у точек. На бэк уходит объект
`GraphUserAnswer` (issue #23, ответ Абдуали 07.10):

```json
{"figures":[{"type":30,"points":[{"x":-1,"y":0},{"x":1,"y":0}],"dashed":false}]}
```

Перевод — `toPlaneWireAnswer` на границе перед `api.checkAnswer`
(`to-wire-answer.ts`). Бэк сверяет оба конца с эталоном, порядок не важен,
`dashed` не проверяет; фигура должна быть ровно одна.

Задачи (`./data/tasks.json`, эталон `_expected` — `LineSegmentTaskAnswer`):
1_5_2_16, 3_3_7_17, 6_6_19_1, 11_9_5_9. Шаблон — тот же
`createCoordinatePlanePointTemplate`, режим выбирается по `drawingFigure`.
