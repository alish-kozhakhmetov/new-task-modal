# `equation.after`

Уравнение + `MathInput` + подпись-суффикс после поля (знак и поле в 8px).

## Когда выбирать

`description.type: equation`, пустой `answerInput.before`, непустой `after` (`%`, `, k∈Z`).

Классификатор — `classifyEquationTemplate` (`../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- одно поле: префикс / `MathInput` / суффикс
- ответ — строка поля как есть, без нормализации LaTeX

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_6_1_1_2_1` — собран по исходнику генератора (`task_types/6-grade/chapter1/lesson1/lesson1_2/task_6_1_1_2_1.ex`): в выгрузке 02.08 этой раскладки нет

## Stories

`equation-after.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-after.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
