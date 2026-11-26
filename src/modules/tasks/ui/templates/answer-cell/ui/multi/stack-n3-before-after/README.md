# `answerCell.multi.stack.n3.beforeAfter`

3 `MathInput` столбиком, подписи слева и справа. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input3`; `inline` falsy; подписи у полей: подписи слева и справа.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_2_3_5_11`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 2. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[answer-cell-multi-stack-n3-before-after.test.tsx](answer-cell-multi-stack-n3-before-after.test.tsx): classify → id; 3 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 3 поля.
