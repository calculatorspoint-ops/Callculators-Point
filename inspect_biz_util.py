import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

for fname in ['BusinessForms.tsx', 'UtilityForms.tsx']:
    content = open(f'src/components/calculator-core/forms/{fname}', encoding='utf-8').read()
    lines = content.splitlines()
    print(f'=== {fname} ({len(lines)} lines) ===')
    funcs = re.findall(r'export function (\w+)', content)
    print(f'Forms ({len(funcs)}): {funcs}')
    for i, line in enumerate(lines, 1):
        if '<Panel ' in line or ('export function' in line and 'Form' in line):
            print(f'  {i}: {line.rstrip()[:110]}')
    print()
