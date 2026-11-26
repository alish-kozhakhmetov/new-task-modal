# `complex.multi.stack.n5.beforeAfter`

5 `MathInput` столбиком, подписи слева и справа. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input5`; `inline` falsy; подписи у полей: подписи слева и справа.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_5_6_5_3`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 5. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[complex-multi-stack-n5-before-after.test.tsx](complex-multi-stack-n5-before-after.test.tsx): classify → id; 5 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 5 поля.
