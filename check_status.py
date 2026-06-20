import sys, io, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
BASE = 'src/components/calculator-core/forms'
checks = {
    'HealthForms.tsx': ['BMIForm','SleepForm','BodyTypeForm'],
    'MathForms.tsx': ['FractionForm','GPAForm','ScientificForm'],
    'UtilityForms.tsx': ['AgeForm','PasswordForm','TimeZoneForm','UnitForm'],
    'RetirementForms.tsx': ['RetirementPlanForm'],
    'PeriodForm.tsx': ['PeriodForm'],
}
for fname, forms in checks.items():
    content = open(os.path.join(BASE, fname), encoding='utf-8').read()
    lines = content.splitlines()
    print(f'=== {fname} ===')
    for form in forms:
        m = re.search(rf'export function {form}\b', content)
        if not m:
            print(f'  {form}: NOT FOUND')
            continue
        # Get function block (next 80 lines)
        start_line = content[:m.start()].count('\n')
        block = '\n'.join(lines[start_line:start_line+80])
        has_fl = 'FinanceLayout' in block
        status = 'DONE' if has_fl else 'NEEDS PATCH'
        print(f'  {form}: {status}')
