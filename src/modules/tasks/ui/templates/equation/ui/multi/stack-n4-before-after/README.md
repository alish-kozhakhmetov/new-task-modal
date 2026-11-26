# `equation.multi.stack.n4.beforeAfter`

Четыре ряда «подпись · поле · подпись».

## Когда выбирать

`input1..4` столбиком, есть и `before`, и `after` (система: `x_1 =` ▢ `, (k,n∈Z)`).

Классификатор — `classifyEquationTemplate` (`../../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- поля `input1..N` в порядке номеров; ряды — из семейства text (`text-template.module.scss`)
- ответ — значения полей через `multipleTaskAnswerSeparator` (`;;`) в порядке `input`, все слоты даже пустые

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_10_4_6_1` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)

## Stories

`equation-multi-stack-n4-before-after.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-multi-stack-n4-before-after.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
