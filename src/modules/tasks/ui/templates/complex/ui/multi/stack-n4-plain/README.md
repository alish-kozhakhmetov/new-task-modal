# `complex.multi.stack.n4.plain`

4 `MathInput` столбиком, без подписей. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input4`; `inline` falsy; подписи у полей: без подписей.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_1_2_2_26`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 1. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-stack-n4-plain.test.tsx](complex-multi-stack-n4-plain.test.tsx): classify → id; 4 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 4 поля.
