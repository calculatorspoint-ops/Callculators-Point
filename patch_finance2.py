"""
Replace old CalcLayout pattern:
  const inputs = ( ... );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="X" />
      <SEOSection ...>...</SEOSection>
    </>
  );

With FinanceLayout pattern (keeping all input JSX inline in inputContent):
  return (
    <>
      <FinanceLayout
        accentClass="..."
        inputContent={<> [inputs JSX] </>}
        result={res}
        label="X"
      />
      <SEOSection ...>...</SEOSection>
    </>
  );

Strategy: for each form file, do a regex that:
1. Captures the `const inputs = (` block
2. Captures the `<CalcLayout inputs={inputs} result={res} label="X" />` line
3. Replaces with inline FinanceLayout

This is a structural transformation, done carefully per file.
"""

import re, os

BASE = r'src\components\calculator-core\forms'

# accent mapping by label
ACCENT_MAP = {
    'Stock Return': 'accent-invest',
    'NPV / IRR': 'accent-invest',
    'Portfolio Rebalance': 'accent-invest',
    'Dividend Yield': 'accent-invest',
    'House Affordability': 'accent-loan',
    'Rent vs Buy': 'accent-loan',
    'Mortgage': 'accent-loan',
    'Auto Loan': 'accent-loan',
    'Personal Loan': 'accent-loan',
    'Student Loan': 'accent-loan',
    'Credit Card': 'accent-loan',
    'Debt Payoff': 'accent-loan',
    'NPS': 'accent-invest',
    'EPF': 'accent-invest',
    'APR': 'accent-finance',
    'Budget Planner': 'accent-finance',
    'Mortgage Payoff': 'accent-loan',
    'Present Value': 'accent-finance',
    'Down Payment': 'accent-loan',
    'Commission': 'accent-finance',
}

ICON_MAP = {
    'Stock Return': '📈',
    'NPV / IRR': '💰',
    'Portfolio Rebalance': '🥧',
    'Dividend Yield': '📊',
    'House Affordability': '🏠',
    'Rent vs Buy': '🏡',
    'Auto Loan': '🚗',
    'Personal Loan': '💳',
    'Student Loan': '🎓',
    'Credit Card': '💳',
    'Debt Payoff': '💸',
    'NPS': '🏛️',
    'EPF': '🏦',
    'APR': '📊',
    'Budget Planner': '📋',
    'Mortgage Payoff': '🏠',
    'Present Value': '💹',
    'Down Payment': '🏦',
    'Commission': '💼',
}

def replace_calclayout_in_file(fpath):
    content = open(fpath, 'r', encoding='utf-8').read()
    
    # Pattern: <CalcLayout inputs={inputs} result={res} label="LABEL" />
    calclayout_pattern = re.compile(
        r'<CalcLayout\s+inputs=\{inputs\}\s+result=\{res\}\s+label="([^"]+)"\s*/>'
    )
    
    matches = list(calclayout_pattern.finditer(content))
    if not matches:
        print(f'  No <CalcLayout> found in {os.path.basename(fpath)}')
        return content
    
    for match in reversed(matches):  # reverse to preserve positions
        label = match.group(1)
        accent = ACCENT_MAP.get(label, 'accent-finance')
        icon = ICON_MAP.get(label, '💰')
        
        replacement = f'''<FinanceLayout
        accentClass="{accent}"
        inputTitle="{label}"
        inputIcon="{icon}"
        inputContent={{inputs}}
        result={{res}}
        label="{label}"
      />'''
        
        content = content[:match.start()] + replacement + content[match.end():]
        print(f'  Replaced <CalcLayout label="{label}"> -> <FinanceLayout accentClass="{accent}">')
    
    return content

files = [
    'InvestmentForms.tsx',
    'MortgageForms.tsx',
    'LoanDebtForms.tsx',
    'RetirementForms.tsx',
    'ExtraFinanceForms.tsx',
]

for fname in files:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'SKIP: {fname}')
        continue
    print(f'\n{fname}:')
    new_content = replace_calclayout_in_file(fpath)
    open(fpath, 'w', encoding='utf-8').write(new_content)
    remaining = new_content.count('<CalcLayout ')
    print(f'  Remaining <CalcLayout usages: {remaining}')
    print(f'  FinanceLayout usages: {new_content.count("<FinanceLayout")}')

print('\nAll done.')
