# `text.multi.inline.n2.beforeAfter`

2 `MathInput` в строку, подписи слева и справа. Собрана потоком CX волны 1 (26.11.2026) из фабрики семейства — та же
вёрстка, что у соседних раскладок 4 класса.

## Когда выбирать

`answerInput` с `input1`…`input2`; `inline` true; подписи у полей: подписи слева и справа.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_3_5_10_8`). Примеры — из выгрузки
генераторов 02.08 (`variants.json`), классы: 3, 6, 11. Строки длиннее
200 символов выгрузка урезает: урезанный рисунок заменён помеченной заглушкой
(`truncated: true` в [data/all-tasks.json](data/all-tasks.json)). Боевые данные приходят целиком.

## Тесты

[text-multi-inline-n2-before-after.test.tsx](text-multi-inline-n2-before-after.test.tsx): classify → id; 2 поля; ветка решения;
корпус — каждая задача из `all-tasks.json` классифицируется сюда и рисует 2 поля.
