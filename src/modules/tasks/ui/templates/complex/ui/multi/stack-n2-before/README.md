# `complex.multi.stack.n2.before`

2 `MathInput` столбиком, подпись слева. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input2`; `inline` falsy; подписи у полей: подпись слева.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_3_14_16_19`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-stack-n2-before.test.tsx](complex-multi-stack-n2-before.test.tsx): classify → id; 2 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 2 поля.
