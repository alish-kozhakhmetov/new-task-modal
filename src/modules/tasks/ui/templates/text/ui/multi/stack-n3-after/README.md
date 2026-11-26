# `text.multi.stack.n3.after`

3 `MathInput` столбиком, подпись справа. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input3`; `inline` falsy; подписи у полей: подпись справа.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_3_1_6`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 3. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[text-multi-stack-n3-after.test.tsx](text-multi-stack-n3-after.test.tsx): classify → id; 3 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 3 поля.
