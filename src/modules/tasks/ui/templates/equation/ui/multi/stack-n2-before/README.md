# `equation.multi.stack.n2.before`

Два поля столбиком, у каждого подпись слева; подписи-слова — одной колонкой (правило 20).

## Когда выбирать

`answerInput` с `input1`, `input2`; `inline` ложно; хотя бы у одного `before`, `after` пустые у всех.

Классификатор — `classifyEquationTemplate` (`../../../shared/lib/classify-equation-template.ts`),
та же логика, что у Амирали (`classifyTemplate`) и в инвентаризации Qalan.

## UI

- `TaskTitle` + уравнение (`EquationContent`: голый TeX из `content` оборачивается в `\( … \)`)
- поля `input1..N` в порядке номеров; ряды — из семейства text (`text-template.module.scss`)
- ответ — значения полей через `multipleTaskAnswerSeparator` (`;;`) в порядке `input`, все слоты даже пустые

## Контракт данных

[data/task.json](data/task.json); все примеры — [data/groups.json](data/groups.json):

- `Task_7_2_9_2` — собран по исходнику генератора (`task_types/7-grade/chapter2/task_7_2_9_2.ex`): в выгрузке 02.08 этой раскладки нет

## Stories

`equation-multi-stack-n2-before.stories.tsx`: `Default`, `WithSolution`; `trainer.stories.tsx`: `Flow/Correct`, `Flow/Wrong Answer`, `Flow/Show Answer`.

## Тесты

`equation-multi-stack-n2-before.test.tsx`: classify → id; рендер — уравнение, подписи, число полей; ответ уходит в порядке полей; ветка решения.
