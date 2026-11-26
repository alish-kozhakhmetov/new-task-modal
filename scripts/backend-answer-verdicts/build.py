#!/usr/bin/env python3
"""Rebuild src/modules/tasks/lib/data/backend-answer-verdicts.json from the backend itself.

The backend's TaskChecker is run locally on compiled beams of matheducator
(primary_school_tasks/_build, high_school_tasks/_build — they carry the
compiled matheducator_task_common). For every generator of the inventory's
`ans:*` work items (and every grade 5–6 generator whose answer may hold a
fraction) each seed builds a task, round-trips its fields through Poison as
the API stores them, rebuilds it as task_controller.check_user_answer does,
and asks TaskChecker.user_answer_correct?/2 about candidate records.

    python3 -I scripts/backend-answer-verdicts/build.py

Env: MATHEDUCATOR (clone with _build), QALAN_ASSETS (repo with
qalan-docs/trainer/grades-inventory/inventory.json and contracts/), ERLANG_BIN,
WORK (scratch dir), SEEDS (default 8). Needs elixir + erlang on the machine.
"""
import json
import math
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))
HOME = os.path.expanduser('~')
ME = os.environ.get('MATHEDUCATOR', f'{HOME}/Documents/Projects/qalan/matheducator')
ASSETS = os.environ.get('QALAN_ASSETS', f'{HOME}/Documents/Projects/qalan/assets')
ERL = os.environ.get('ERLANG_BIN', '/opt/homebrew/opt/erlang@28/bin')
WORK = os.environ.get('WORK', os.path.join(PKG, 'test-artifacts', 'backend-answer-verdicts'))
SEEDS = os.environ.get('SEEDS', '8')
OUT = os.path.join(PKG, 'src/modules/tasks/lib/data/backend-answer-verdicts.json')
os.makedirs(WORK, exist_ok=True)


def w(name):
    return os.path.join(WORK, name)


def elixir(script, *args):
    lib = f'{ME}/high_school_tasks/_build/dev/lib'
    pa = []
    for d in sorted(os.listdir(lib)):
        pa += ['-pa', f'{lib}/{d}/ebin']
    pa += ['-pa', f'{ME}/primary_school_tasks/_build/dev/lib/primary_school_tasks/ebin']
    env = dict(os.environ, PATH=f"{ERL}:{os.environ['PATH']}")
    subprocess.run(['elixir', *pa, os.path.join(HERE, script), *args], check=True, env=env)


def grade(i):
    return int(re.match(r'Task_(\d+)_', i).group(1))


# 1. targets: inventory ans:* forms + grade 5–6 generators that may hold fractions
inv = json.load(open(f'{ASSETS}/qalan-docs/trainer/grades-inventory/inventory.json'))
cov = json.load(open(f'{ASSETS}/qalan-docs/trainer/contracts/fixtures/coverage.json'))['generators']
diff = {g['taskType'].replace('Elixir.', ''): g.get('difficulty') for g in cov}
want = defaultdict(set)
for f in inv['forms']:
    if f['code'].startswith('ans:'):
        for i in f['ids']:
            want[i].add(f['code'])
FRACTION_HOLDERS = {'Fraction', 'MultipleTaskAnswer', 'TaskAnswers.AnyOfThemTaskAnswer',
                    'list (any-of match)', 'TaskAnswers.TwoAnswersTaskAnswer'}
for g in cov:
    i = g['taskType'].replace('Elixir.', '')
    m = re.match(r'Task_(\d+)_', i)
    if m and m.group(1) in ('5', '6') and g.get('answerElixirType') in FRACTION_HOLDERS:
        want[i].add('scan:5-6')
json.dump([{'id': i, 'difficulty': diff.get(i), 'codes': sorted(c)} for i, c in sorted(want.items())],
          open(w('targets.json'), 'w'))

# 2. generate
elixir('gen.exs', w('targets.json'), SEEDS, w('gen.json'))
rows = [r for r in json.load(open(w('gen.json'))) if 'error' not in r]


def rule_of(r):
    return next((c for c in r['codes'] if c.startswith('ans:')), None)


# 3. candidates
def disp(sign, whole, a, b):
    s = '-' if sign == -1 else ''
    if a == 0:
        return f"{'-' if sign == -1 and whole else ''}{whole}"
    return f"{s}{whole if whole else ''}\\frac{{{a}}}{{{b}}}"


def fraction_forms(p):
    sign, whole, a, b = p['sign'], abs(p['integer']), p['a'], p['b']
    if b == 0:
        return {}
    n_all = whole * b + a
    g = math.gcd(n_all, b) or 1
    n, d = n_all // g, b // g
    out = {'ref': p['str'], 'mixedReduced': disp(sign, n // d, n % d, d)}
    if n % d and n > d:
        out['improperReduced'] = disp(sign, 0, n, d)
    if re.fullmatch(r'-\\frac\{\d+\}\{\d+\}', p['str']):
        num, den = re.findall(r'\d+', p['str'])
        out['negRef'] = p['str']
        out['minusInNumerator'] = f'\\frac{{-{num}}}{{{den}}}'
        out['minusInDenominator'] = f'\\frac{{{num}}}{{-{den}}}'
    return out


def fraction_parts(ans, path=()):
    if ans['k'] == 'fraction':
        yield path, ans
    elif ans['k'] in ('multiple', 'anyof', 'list', 'two'):
        for i, p in enumerate(ans['parts']):
            yield from fraction_parts(p, path + (i,))


def wire_with(ans, path, repl):
    if not path:
        return repl
    i, k = path[0], ans['k']
    if k in ('multiple', 'two'):
        parts = [p['str'] for p in ans['parts']]
        parts[i] = wire_with(ans['parts'][i], path[1:], repl)
        return (';;' if k == 'multiple' else ';').join(parts)
    return wire_with(ans['parts'][i], path[1:], repl)  # any-of: one alternative alone


STRING_FRACTION = re.compile(r'^(-?)(\d*)\\frac\{(\d+)\}\{(\d+)\}$')
cases = []
for r in rows:
    a, k, rule = r['answer'], r['answer']['k'], rule_of(r)
    c = []
    for path, p in fraction_parts(a):
        for label, f in fraction_forms(p).items():
            c.append((label, wire_with(a, path, f)))
    if k == 'str' and STRING_FRACTION.match(a['str']):
        c.append(('ref', a['str']))
    if rule and rule != 'ans:fraction-5-6':
        if k == 'two':
            p = [x['str'] for x in a['parts']]
            c += [('ref', a['str']), ('p1;p2', f'{p[0]};{p[1]}'), ('p2;p1', f'{p[1]};{p[0]}'),
                  ('p1,p2', f'{p[0]},{p[1]}'), ('only p2', p[1])]
        elif k == 'float':
            clean = ('%.10f' % a['v']).rstrip('0').rstrip('.')
            c += [('ref', a['str']), ('comma', clean.replace('.', ','))]
        elif k == 'int':
            c += [('ref', a['str'])]
        elif k == 'eqsys':
            pairs = [f"({x['str']};{y['str']})" for x, y in a['pairs']]
            c += [('ref', a['str']), (';-joined', ';'.join(pairs)), (',-joined', ','.join(pairs)),
                  ('no parens', ';'.join(q.strip('()') for q in pairs))]
        elif k == 'periodic':
            c += [('ref', a['str']), ('dot', a['str'].replace(',', '.'))]
        elif k == 'nil':
            c += [('anything', '3')]
    if c:
        cases.append({'id': r['id'], 'seed': r['seed'], 'grade': grade(r['id']), 'rule': rule,
                      'kind': k, 'fields': r['fields'],
                      'candidates': [{'label': l, 'wire': x} for l, x in dict.fromkeys(c)]})
json.dump(cases, open(w('cases.json'), 'w'))

# 4. ask the checker
elixir('check.exs', w('cases.json'), w('verdicts.json'))
verdicts = json.load(open(w('verdicts.json')))

# 5. fixture: what the pupil types (the reference record) and what the checker said
TYPABLE = re.compile(r'^(?:-|\d|,|;|\(|\)|\\frac\{\d+\}\{\d+\})*$')
TYPED_LABEL = {'two': 'p1;p2', 'float': 'comma', 'eqsys': ';-joined'}
out_cases, negs, seen = [], [], Counter()
for c in verdicts:
    cand = {k['label']: k for k in c['candidates']}
    rule = c['rule'] or ('scan:fraction-5-6' if c['grade'] in (5, 6) else 'scan')
    typed = cand.get(TYPED_LABEL.get(c['kind'], 'ref'))
    limit = 1 if rule.endswith('fraction-5-6') else 2
    if typed and typed['ok'] is True and TYPABLE.match(typed['wire']) and seen[c['id']] < limit:
        seen[c['id']] += 1
        out_cases.append({'rule': rule, 'id': c['id'], 'grade': c['grade'], 'seed': c['seed'],
                          'type': typed['wire'],
                          'accepted': sorted({k['wire'] for k in c['candidates'] if k['ok'] is True}),
                          'rejected': sorted({k['wire'] for k in c['candidates'] if k['ok'] is False})})
    num = cand.get('minusInNumerator')
    if num and num['ok'] is False and cand['negRef']['ok'] is True and seen[(c['id'], 'neg')] < 1:
        seen[(c['id'], 'neg')] += 1
        den = cand.get('minusInDenominator')
        negs.append({'id': c['id'], 'grade': c['grade'], 'seed': c['seed'], 'accepted': cand['negRef']['wire'],
                     'minusInNumerator': num['wire'],
                     'minusInDenominator': den['wire'] if den else None,
                     'minusInDenominatorOk': den['ok'] if den else None})

json.dump({
    '_source': 'matheducator TaskChecker.user_answer_correct?/2 run locally on compiled beams; task rebuilt '
               'from its Poison-round-tripped fields as task_controller.check_user_answer does. '
               'Rebuilt by scripts/backend-answer-verdicts/build.py.',
    '_fields': "type — the backend's own reference record, typed by the pupil; accepted / rejected — wire "
               'strings the checker accepted / rejected for that task instance.',
    'cases': out_cases,
    'minusInsideFraction': negs,
}, open(OUT, 'w'), ensure_ascii=False, indent=2)
print(f'{len(out_cases)} cases, {len(negs)} minus-inside-fraction generators → {OUT}', file=sys.stderr)
