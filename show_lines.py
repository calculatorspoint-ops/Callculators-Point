import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
content = open(r'src/components/calculator-core/forms/MathForms.tsx', encoding='utf-8').read()
lines = content.splitlines()
for i, line in enumerate(lines, 1):
    if '<Panel ' in line or ('export function' in line and 'Form' in line):
        print(f'{i}: {line.rstrip()[:100]}')
