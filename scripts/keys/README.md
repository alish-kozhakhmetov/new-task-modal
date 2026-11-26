# Keys of grades 5–13 — how they were checked

Signs the released keyboard (2.5.8) lacks: ∞, the brackets of an interval
one by one, ∪, π, { }, √, ⁿ√, log, xⁿ, sin cos tg ctg and their arcs, °,
the vector arrow. Code: `src/modules/task-modal/ui/content/controls/calculator/model/symbols/signs.ts`,
which tasks get them: `task-keys.ts` next to it (generated).

## Which task gets which keys

The window never sees the answer, only the task's type. So the set is chosen
by the **backend's answer type of the generator** (`coverage.json`,
`answerElixirType`) and generated into `task-keys.ts`:

| Set | Who | Keyboard |
|---|---|---|
| `interval` | `IntervalTaskAnswer`, `UnionTaskAnswer`, a string answer with `\cup` / `\infty` | digits page with `( [ ] )` in place of `< > ≠ =`, `∞ ∪ π` in place of `x² x³ ( )`; a «Знаки» page after it: `{ } √ log ⌫` |
| `trigonometry` | `TrigonometryTaskAnswer` | digits page as released; «Знаки»: `sin cos tg ctg ⌫ / arcsin arccos arctg arcctg xⁿ / π √ ⁿ√ °` |
| `vector` · `degree` · `root` | a string answer with `\overrightarrow` · `^{\circ}` · `\sqrt` (sample in `variants.json`) | «Знаки»: `a⃗` · `°` · `√ ⁿ√ xⁿ` |

Every task of a set gets the same keys — the keyboard doesn't hint the shape
of the answer (∪ is there in an interval task without a union). Grade 4 has no
set: its keyboard is the released one (`signs.test.ts`).

```bash
node scripts/keys/generate-task-keys.mjs \
  --coverage=<qalan>/qalan-docs/trainer/contracts/fixtures/coverage.json \
  --variants=<qalan>/qalan-docs/trainer/contracts/fixtures/variants.json
```

## What the keys write — by the backend's own checker

test.qalan.kz was down (502), so the check ran on the backend's code itself,
locally, read-only: `matheducator_task_common` compiled into a scratch folder
(Elixir 1.20 / OTP 28; the files with non-ASCII identifiers — lesson keys,
title strings — left out), the keys generators compiled against it.

1. Every keys generator, 5 tasks each, comma separator (Kazakhstan):
   the task and `to_string(answer)` — 3 020 samples.
2. `candidates.test.ts`: each reference typed into a real MathQuill field
   with the task's own keyboard (`reference-to-keys.ts`: only keys that
   board has; `null` if one is missing), and once more as from a computer's
   keyboard (digits, brackets, ; typed, the signs from our keys).
3. `TaskChecker.user_answer_correct?(task, field_latex)` on the very task.

The forms that passed are pinned in `src/ui/math-input/signs-input.test.ts`.
tg and ctg are letters on purpose: `\operatorname{tg}` and `\tan` failed the
checker on 41 of 169 sampled tg answers, letters on none.

## In the real window

`harness/` mounts the real TaskModal (LessonTrainer) on tasks exported from
the backend; `drive.mjs` types each reference with the keys (and from the
computer's keyboard for the interval ones), presses «Проверить», takes the
answer the window sends, shots at 390 and 1280. The package has no template
for these grades yet: the drive needs a temporary chapter map in
`src/modules/tasks/ui/grades/__keys-harness__/` — never committed.
