import sys, io, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
BASE = 'src/components/calculator-core/forms'
keywords = ['gpa','cgpa','grade','education','academic','course','semester','credit','score','exam']
print('Searching for Education/GPA forms...')
for fname in sorted(os.listdir(BASE)):
    if not fname.endswith('.tsx'): continue
    content = open(os.path.join(BASE, fname), encoding='utf-8').read()
    if any(k in content.lower() for k in keywords):
        lines = content.splitlines()
        print(f'\n=== {fname} ===')
        for m in re.finditer(r'export function (\w+)', content):
            fn_start = content[:m.start()].count('\n')
            fn_body_100 = '\n'.join(lines[fn_start:fn_start+100])
            has_fl = 'FinanceLayout' in fn_body_100
            status = 'DONE' if has_fl else 'NEEDS PANEL'
            print(f'  {m.group(1)}: {status}')
