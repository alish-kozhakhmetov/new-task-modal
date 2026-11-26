# `complex.multi.stack.n3.plain`

3 `MathInput` столбиком, без подписей. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input3`; `inline` falsy; подписи у полей: без подписей.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_2_4_10_5`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 1, 2, 3, 6. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-stack-n3-plain.test.tsx](complex-multi-stack-n3-plain.test.tsx): classify → id; 3 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 3 поля.
