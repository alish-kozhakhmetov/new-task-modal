# `answerCell.multi.inline.n5.plain`

5 `MathInput` в строку, без подписей. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input5`; `inline` true; подписи у полей: без подписей.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_5_2_4_2`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 5. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[answer-cell-multi-inline-n5-plain.test.tsx](answer-cell-multi-inline-n5-plain.test.tsx): classify → id; 5 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 5 поля.
