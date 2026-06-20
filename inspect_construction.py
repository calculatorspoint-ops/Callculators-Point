import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
content = open(r'src/components/calculator-core/forms/ConstructionForms.tsx', encoding='utf-8').read()
lines = content.splitlines()
print(f'Total lines: {len(lines)}')
funcs = re.findall(r'export function (\w+)', content)
print(f'Forms ({len(funcs)}): {funcs}')
print()
for i, line in enumerate(lines, 1):
    if '<Panel ' in line or ('export function' in line and 'Form' in line):
        print(f'{i}: {line.rstrip()[:120]}')
