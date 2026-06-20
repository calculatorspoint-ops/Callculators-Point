import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

for fname in ['MathForms.tsx', 'TechForms.tsx']:
    content = open(f'src/components/calculator-core/forms/{fname}', encoding='utf-8').read()
    lines = content.splitlines()
    print(f'=== {fname} ({len(lines)} lines) ===')
    funcs = re.findall(r'export function (\w+)', content)
    print(f'Forms: {funcs}')
    panel_re = re.compile(r'<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"[^/]*/>')
    panel_calls = panel_re.findall(content)
    print(f'Panel calls ({len(panel_calls)}):')
    for lv, lbl in panel_calls:
        print(f'  loading={lv} label={lbl}')
    print()
