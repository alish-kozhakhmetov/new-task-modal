# Keys of grades 5–13 — how they were checked

Signs the released keyboard (2.5.8) lacks: ∞, the brackets of an interval
one by one, ∪, π, { }, ∅, √, ⁿ√, log, xⁿ, sin cos tg ctg and their arcs, °,
the vector arrow, ±, ≤ ≥ and the bars | |. Code:
`src/modules/task-modal/ui/content/controls/calculator/model/symbols/signs.ts`,
which tasks get them: `task-keys.ts` next to it (generated).

## Which task gets which keys

The window never sees the answer, only the task's type. So the set is chosen
per generator, by the signs in **its own answers as the production backend
prints them** (`to_string(answer)`): 10 samples of every generator of
`origin/master` `7c7c85f9741` (26.11; 11 490 generators, 27.11). A generator
master doesn't have is read from the test branch's backend (`hs`, 23.11, 6
samples); `variants.json` and the answer type in `coverage.json` add the
rest. Grades 5–13 only.

| Set | Who | Keyboard |
|---|---|---|
| `interval` | `IntervalTaskAnswer`, `UnionTaskAnswer`, an answer with `∪ ∞ ∅ [ ] { }` | digits page with `( [ ] )` in place of `< > ≠ =`, `∞ ∪ π` in place of `x² x³ ( )`; «Знаки» after it: `{ } ∅ √ ⌫ log ±` |
| `intervalTrig` | an interval with sin… arctg in it | the interval digits page; «Знаки» of trigonometry |
| `trigonometry` | `TrigonometryTaskAnswer`, sin… arctg, π beyond grade 8 or with a root or a power | digits page as released; «Знаки»: `sin cos tg ctg ⌫ / arcsin arccos arctg arcctg xⁿ / π √ ⁿ√ ° ±` |
| `pi` | π alone, grades 5–8 | «Знаки»: `π ⌫` |
| `root` | `\sqrt`, a power other than ² ³ | «Знаки»: `√ ⁿ√ xⁿ ± ⌫` |
| `log` | `\log`, ln/lg with the bars | «Знаки»: `log xⁿ √ ⁿ√ ⌫ \| sin cos` |
| `compare` | `≤ ≥`, the bars | «Знаки»: `≤ ≥ \| ⌫` (the digits page keeps `< >`) |
| `vector` · `degree` | `\overrightarrow` · `^{\circ}` | «Знаки»: `a⃗ ⌫` · `° ⌫` |

No set — the released keyboard — for multiple choice, coordinate planes,
matrices and answers with no new sign. On the digits page of every set `x/y` opens a fraction inside a fraction too
(−1/(6cos²(14 − x/6))); grades 0–4 keep the released key, which doesn't.
Every task of a set gets the same keys:
the keyboard doesn't hint the shape of the answer (∪ is there in an interval
task without a union). Grades 0–4 have no set: their keyboard is the released
one (`signs.test.ts`; on 27.11 all 12 432 ids of grades 0–4 of `coverage.json`
got none, and their calculator rendered the 2.5.8 DOM).

```bash
node tools/pilot/keys/generate-task-keys.mjs \
  --coverage=<qalan>/qalan-docs/trainer/contracts/fixtures/coverage.json \
  --variants=<qalan>/qalan-docs/trainer/contracts/fixtures/variants.json \
  --samples=<master samples.jsonl>,<test samples.jsonl>   # backend/sample.exs; the first file wins
```

## What the keys write — by the backend's own checker

On the production backend, read-only: the `master` build at
`task-screen-g5/.pilot-cache/master-2611/be`, run with `be.sh` of
`feat/grade-5-pilot` and `QALAN_BE_MODULES=<common>:<hs>`. The API rebuilds the
task from its fields and hands `userAnswer` to `TaskChecker` as is; the
scripts do the same, with `DecimalFormat.set_separator(:comma)` (Kazakhstan's
`DecimalFormatPlug`) inside every process that generates or checks:

1. `backend/sample.exs` — every generator, 10 seeds, comma separator set
   inside each sample's process: the task rebuilt from its fields (JSON →
   struct, as the API does) and `to_string(answer)`.
2. `candidates.test.ts` — each reference typed into a real MathQuill field
   with the task's own keyboard (`reference-to-keys.ts`: only keys that board
   has; `null` if one is missing), and once more as from a computer's
   keyboard (digits, brackets, ; typed, the signs from our keys).
3. `backend/judge.exs` — `TaskChecker.user_answer_correct?(task, field_latex)`
   on the very task; a wrong answer of the same shape (sin↔cos, π→2π, a digit)
   must be rejected; the reference itself is checked too.
4. `backend/need.mjs`, `backend/tally.mjs` — per generator: needs a sign,
   has a set, passes on every sample.

27.11, master: 2 040 generators need a sign the 2.5.8 keyboard lacks; with
these keys 1 920 are typed and accepted on all 10 samples (19 240 of 20 400),
with the sets read from test's backend 1 828. By grade, before → after:
5: 12 → 13 of 26, 6: 162 of 169, 7: 203 → 204 of 205, 8: 219 of 219,
9: 293 → 294 of 294, 10: 407 → 409 of 426, 11: 410 → 417 of 430, 12: 74 of 78,
13: 48 → 128 of 193. What's left is the backend's (`backend-gaps.md`): 40
string compares of one spelling, 57 matrices (no keys), 22 drawn answers.

The forms that passed are pinned in `src/ui/math-input/signs-input.test.ts`.
tg and ctg are letters on purpose: `\operatorname{tg}` and `\tan` failed the
checker on 41 of 169 sampled tg answers, letters on none.

## In the real window

`harness/` mounts the real TaskModal (LessonTrainer) on tasks exported from
the backend; `drive.mjs` types each reference with the keys (and from the
computer's keyboard for the interval ones and the roots), presses
«Проверить», takes the answer the window sends, shots at 390 and 1280. The
package has no template for these grades yet: the drive needs temporary
chapter maps — `node tools/pilot/keys/harness-maps.mjs write` before vite,
`clean` right after. They match `GRADE_CHAPTER_REGEX` like real ones and must
never reach git or a build.
