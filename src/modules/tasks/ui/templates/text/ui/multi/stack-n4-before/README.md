# `text.multi.stack.n4.before`

4 `MathInput` столбиком, подпись слева. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input4`; `inline` falsy; подписи у полей: подпись слева.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_10_6_6_8`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 10. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[text-multi-stack-n4-before.test.tsx](text-multi-stack-n4-before.test.tsx): classify → id; 4 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 4 поля.
