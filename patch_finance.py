import re, os

BASE = r'src\components\calculator-core\forms'

def patch_import(content, old_names, new_names):
    """Add FinanceLayout to an existing import block from SharedComponents."""
    return content.replace(old_names, new_names, 1)

def remove_local_calclayout(content):
    """Remove the local CalcLayout function that wraps Panel."""
    pattern = r'function CalcLayout\(\{[^}]+\}\)\s*\{[\s\S]*?\}\s*\n'
    return re.sub(pattern, '', content, count=1)

def add_finance_layout_to_import(content):
    """Ensure FinanceLayout is in the SharedComponents import."""
    if 'FinanceLayout' in content:
        return content  # already done
    # Find the import from SharedComponents and add FinanceLayout
    content = re.sub(
        r"(from\s+'./SharedComponents';)",
        lambda m: m.group(0),  # no-op if pattern doesn't have the right shape
        content
    )
    # More targeted: find SEOSection or Panel in import and add FinanceLayout after it
    content = re.sub(
        r'(\bSEOSection\b)',
        'SEOSection, FinanceLayout',
        content,
        count=1
    )
    return content

# ── Process each finance file ─────────────────────────────────────────
files = [
    'InvestmentForms.tsx',
    'MortgageForms.tsx',
    'LoanDebtForms.tsx',
    'RetirementForms.tsx',
    'ExtraFinanceForms.tsx',
    'BusinessForms.tsx',
]

for fname in files:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'SKIP (not found): {fname}')
        continue
    content = open(fpath, 'r', encoding='utf-8').read()
    
    # 1. Add FinanceLayout to import
    content = add_finance_layout_to_import(content)
    
    # 2. Remove the local CalcLayout helper function
    content = remove_local_calclayout(content)
    
    open(fpath, 'w', encoding='utf-8').write(content)
    has_fl = 'FinanceLayout' in content
    no_local = 'function CalcLayout' not in content
    print(f'{fname}: FinanceLayout in import={has_fl}, local CalcLayout removed={no_local}')

print('\nDone. Now replacing CalcLayout usages with FinanceLayout in each file...')

# ── Replace CalcLayout usage pattern with FinanceLayout ──────────────
# Pattern: <CalcLayout inputs={inputs} result={res} label="X" />
# We replace: remove `const inputs = (...)` block and transform the CalcLayout call
# This step does a simple targeted swap for files that still use CalcLayout pattern

for fname in files:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        continue
    content = open(fpath, 'r', encoding='utf-8').read()
    
    # Count remaining CalcLayout usages
    count = content.count('<CalcLayout ')
    print(f'{fname}: {count} remaining <CalcLayout usages (manual refactor needed)')

print('\nPhase 1 (import + local fn removal) complete.')
print('The <CalcLayout> JSX usages still need manual replacement with <FinanceLayout>.')
print('This is handled via multi_replace_file_content for each file.')
