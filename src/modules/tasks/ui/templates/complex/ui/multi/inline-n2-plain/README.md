# `complex.multi.inline.n2.plain`

2 `MathInput` в строку, без подписей. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input2`; `inline` true; подписи у полей: без подписей.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_1_3_6_10`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 1. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-inline-n2-plain.test.tsx](complex-multi-inline-n2-plain.test.tsx): classify → id; 2 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 2 поля.
