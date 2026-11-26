# `equation.beforeAfter`

Уравнение + префикс + `MathInput` + суффикс в одну строку.

## Когда выбирать

`description.type: equation`, непустые `answerInput.before` и `after` (`x_{max} =` ▢ `, k∈Z`).

Классификатор — `classifyEquationTemplate` (`../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- одно поле: префикс / `MathInput` / суффикс
- ответ — строка поля как есть, без нормализации LaTeX

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_10_2_10_1` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)
- `Task_10_2_10_2` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)

## Stories

`equation-before-after.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-before-after.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
