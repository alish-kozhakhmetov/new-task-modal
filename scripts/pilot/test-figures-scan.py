"""
Grade pilot: test generators whose figures the package's test template cannot
draw. TestFigures (src/modules/tasks/ui/templates/test/shared/test-figures.tsx)
draws only text 10, angle list 50 and image 160; any other figure shows
«Unsupported figure type N». The source of each generator (the monolith's
.ex file) is scanned for the figure modules; validated against rendered samples.

  python3 scripts/pilot/test-figures-scan.py --grade=5 --catalog=<backend-task-catalog.json> --monolith=<clone>
"""
import json, os, re, sys

args = dict(a.lstrip('-').split('=', 1) for a in sys.argv[1:])
grade = int(args.get('grade', 5))
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cache = os.path.join(root, '.pilot-cache', f'grade-{grade}')
catalog = {g['type']: g for g in json.load(open(args['catalog']))['generators']}
mono = args['monolith']
FIG = {
    'NumberLine': 20, 'EulerEllipse': 30, 'IntervalNumberLine': 40, 'Rectangle': 60, 'Hexagon': 70, 'Cube': 80,
    'TwoParallelOneIntersection': 90, 'TwoParallelTwoIntersection': 100, 'CoordinatePlane': 110, 'Table': 120,
    'PositiveCoordinatePlane': 130, 'FrequencyPolygon': 190, 'FrequencyHistogram': 200, 'DrawingPolygon': 220,
    'CoordinatePlane3D': 110,
}
rx = re.compile(r'(?<![\w.])(?:Figures\.)?(' + '|'.join(sorted(FIG, key=len, reverse=True)) + r')(?=\.new|\{|\s*\.|\b)(?!TaskDescription)')
mapping = json.load(open(os.path.join(cache, 'mapping.json')))
out = {}
for m in mapping:
    if m.get('template') != 'test.plain' and (m.get('classified') or '') != 'test.plain':
        continue
    g = catalog.get(m['type'])
    if not g:
        out[m['key']] = {'figures': None, 'why': 'not in catalog'}
        continue
    src = open(os.path.join(mono, g['sourceFile']), encoding='utf8').read()
    found = sorted({FIG[x] for x in rx.findall(src)})
    out[m['key']] = {'figures': found, 'file': g['sourceFile']}
json.dump(out, open(os.path.join(cache, 'test-figures.json'), 'w'), indent=1)
bad = [k for k, v in out.items() if v['figures']]
print(f'test.plain generators scanned {len(out)}, with figures the test template does not draw: {len(bad)}')
