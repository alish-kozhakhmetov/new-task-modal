# `equation.multi.stack.n4.before`

Четыре поля столбиком с подписями слева.

## Когда выбирать

`input1..4` столбиком, есть `before`, `after` пустые (`a_1 =` … `a_4 =`).

Классификатор — `classifyEquationTemplate` (`../../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- поля `input1..N` в порядке номеров; ряды — из семейства text (`text-template.module.scss`)
- ответ — значения полей через `multipleTaskAnswerSeparator` (`;;`) в порядке `input`, все слоты даже пустые

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_10_7_13_1` — собран по исходнику генератора (`task_types/10-grade/chapter7/lesson3/task_10_7_13_1.ex`): в выгрузке 02.08 этой раскладки нет

## Stories

`equation-multi-stack-n4-before.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-multi-stack-n4-before.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
