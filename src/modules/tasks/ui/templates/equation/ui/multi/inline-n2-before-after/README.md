# `equation.multi.inline.n2.beforeAfter`

Два поля в одну строку с подписями между ними; не влезает — переносится целыми парами.

## Когда выбирать

`input1`, `input2`, `inline: true`; подписи до и после (`x ∈` ▢ `∪` ▢ `, k∈Z`, `(` ▢ `;` ▢ `)`).

Классификатор — `classifyEquationTemplate` (`../../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- поля `input1..N` в порядке номеров; ряды — из семейства text (`text-template.module.scss`)
- ответ — значения полей через `multipleTaskAnswerSeparator` (`;;`) в порядке `input`, все слоты даже пустые

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_10_4_13_6` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)
- `Task_11_7_6_1` — реальный payload из `variants.json` / `equation.json` (прогон генераторов 02.08)

## Stories

`equation-multi-inline-n2-before-after.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-multi-inline-n2-before-after.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
