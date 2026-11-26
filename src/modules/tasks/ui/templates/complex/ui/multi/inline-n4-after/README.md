# `complex.multi.inline.n4.after`

4 `MathInput` в строку, подпись справа. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input4`; `inline` true; подписи у полей: подпись справа.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_2_6_10_22`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 2, 3, 5. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-inline-n4-after.test.tsx](complex-multi-inline-n4-after.test.tsx): classify → id; 4 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 4 поля.
