import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'
files = sorted(os.listdir(BASE))

print("=" * 70)
print("CALCULATOR LAYOUT AUDIT")
print("=" * 70)

total_funcs = 0
total_fl = 0
total_panel = 0

rows = []

for fname in files:
    if not fname.endswith('.tsx') or fname in ('SharedComponents.tsx',):
        continue
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()

    funcs = re.findall(r'export function (\w+)', content)
    fl_count = len(re.findall(r'<FinanceLayout', content))
    panel_count = len(re.findall(r'<Panel\s+result', content))
    custom_count = len(funcs) - fl_count

    total_funcs += len(funcs)
    total_fl += fl_count
    total_panel += panel_count

    status = 'ALL NEW' if panel_count == 0 else f'NEEDS WORK ({panel_count} Panel left)'
    rows.append((fname, len(funcs), fl_count, panel_count, status))

print(f"\n{'File':<30} {'Forms':>5} {'New':>5} {'Old':>5}  Status")
print("-" * 70)
for fname, nf, nfl, npanel, status in rows:
    flag = '' if npanel == 0 else ' <--'
    print(f"{fname:<30} {nf:>5} {nfl:>5} {npanel:>5}  {status}{flag}")

print("-" * 70)
print(f"{'TOTAL':<30} {total_funcs:>5} {total_fl:>5} {total_panel:>5}")
print()

# Now list all forms that still show <Panel result (still on old layout)
print("\n" + "=" * 70)
print("FORMS STILL USING OLD PANEL (need migration):")
print("=" * 70)
any_found = False
for fname in files:
    if not fname.endswith('.tsx') or fname in ('SharedComponents.tsx',):
        continue
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()
    lines = content.splitlines()
    for i, line in enumerate(lines, 1):
        if '<Panel result' in line:
            print(f"  {fname}:{i}  {line.strip()[:90]}")
            any_found = True

if not any_found:
    print("  (none - all migrated!)")

# List forms that have NEITHER FinanceLayout NOR Panel (custom display - intentional)
print("\n" + "=" * 70)
print("FORMS WITH CUSTOM RESULT DISPLAY (no Panel, no FinanceLayout):")
print("=" * 70)
for fname in files:
    if not fname.endswith('.tsx') or fname in ('SharedComponents.tsx',):
        continue
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()
    funcs = re.findall(r'export function (\w+Form\b)', content)
    fl_count = content.count('<FinanceLayout')
    panel_count = len(re.findall(r'<Panel\s+result', content))
    if funcs and panel_count == 0 and fl_count < len(funcs):
        diff = len(funcs) - fl_count
        print(f"  {fname}: {diff} form(s) with custom display")
        # List them
        for func in funcs:
            # Check if this specific function has FinanceLayout
            func_block = re.search(
                rf'export function {func}[\s\S]*?(?=export function|\Z)', content)
            if func_block:
                block = func_block.group(0)
                has_fl = 'FinanceLayout' in block
                has_panel = '<Panel result' in block
                if not has_fl and not has_panel:
                    print(f"    - {func}")
