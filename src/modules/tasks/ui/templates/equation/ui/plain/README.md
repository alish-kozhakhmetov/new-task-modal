# `equation.plain`

Уравнение (`description.content`) + одно поле `MathInput` во всю строку (правило 18: одно поле без подписей — во всю строку).

## Когда выбирать

`description.type: equation`, в `answerInput` пустые `before` и `after` (или его нет).

Классификатор — `classifyEquationTemplate` (`../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- одно поле: префикс / `MathInput` / суффикс
- ответ — строка поля как есть, без нормализации LaTeX

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_10_2_3_1` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)
- `Task_7_2_3_1` — собран по исходнику генератора (`task_types/7-grade/chapter2/task_7_2_3_1.ex`): в выгрузке 02.08 этой раскладки нет

## Stories

`equation-plain.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-plain.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
