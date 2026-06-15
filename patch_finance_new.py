import re, os

fpath = r'src\components\calculator-core\forms\FinanceFormsNew.tsx'
content = open(fpath, encoding='utf-8').read()

# 1. Add FinanceLayout to import
content = re.sub(
    r"} from (['\"]./SharedComponents['\"];)",
    r', FinanceLayout } from \1',
    content,
    count=1
)
print('FinanceLayout in import:', 'FinanceLayout' in content)

# 2. The pattern in FinanceFormsNew is:
#    return (
#      <div style={{display:"flex",flexDirection:"column",gap:20}}>
#        <div style={{background:'var(--surface)',border:...}}>
#          [inputs]
#        </div>
#        <Panel result={res} loading={null} label="X" />
#      </div>
#    );
#
# We need to transform this to FinanceLayout.
# Strategy: find the Panel calls and their containing wrapper.

# Pattern to match:
#   <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,...}}>
#     [inputs_content]
#   </div>
#   <Panel result={res} loading={null} label="LABEL" />
# within:
#   <div style={{display:"flex",flexDirection:"column",gap:20}}>
#     ...
#   </div>

# Find all Panel calls with their labels first
panel_pattern = re.compile(r'<Panel\s+result=\{res\}\s+loading=\{null\}\s+label="([^"]+)"\s*/>')
panels = list(panel_pattern.finditer(content))
print(f'Found {len(panels)} Panel calls')
for p in panels:
    print(f'  label="{p.group(1)}"')

# For FinanceFormsNew, these forms all use the simple stacked wrapper pattern.
# The outer wrapper is <div style={{display:"flex",flexDirection:"column",gap:20}}>
# We replace the entire return(...)  block for each form.

# Actually simpler: replace the outer flex wrapper pattern
# Pattern:
#   <div style={{display:"flex",flexDirection:"column",gap:20}}>
#      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
#        [inputs]
#      </div>
#      <Panel result={res} loading={null} label="LABEL" />
#    </div>
# ->
#   <FinanceLayout
#     accentClass="accent-LOAN"
#     inputTitle="LABEL"
#     inputIcon="ICON"
#     inputContent={<>[inputs]</>}
#     result={res}
#     label="LABEL"
#   />

ACCENT_MAP = {
    'Mortgage Payoff': 'accent-loan',
    'House Affordability': 'accent-loan',
    'Rent vs Buy': 'accent-loan',
    'APR': 'accent-finance',
    'Auto Loan': 'accent-loan',
    'Personal Loan': 'accent-loan',
    'Student Loan': 'accent-loan',
    'Credit Card': 'accent-loan',
    'Debt Payoff': 'accent-loan',
    '401k': 'accent-invest',
    'Commission': 'accent-finance',
    'Depreciation': 'accent-finance',
    'Budget': 'accent-finance',
    'Present Value': 'accent-finance',
    'IRR': 'accent-invest',
    'Down Payment': 'accent-loan',
    'College Cost': 'accent-finance',
    'HELOC': 'accent-loan',
    'Auto Lease': 'accent-loan',
    'Bond': 'accent-invest',
    'CD': 'accent-invest',
    'Roth IRA': 'accent-invest',
    'Annuity': 'accent-invest',
    'Pension': 'accent-invest',
    'Social Security': 'accent-invest',
    'RMD': 'accent-invest',
    'Estate Tax': 'accent-tax',
    'Marriage Tax': 'accent-tax',
    'Boat Loan': 'accent-loan',
    'Debt Consolidation': 'accent-loan',
    'Future Value': 'accent-invest',
    'Average Return': 'accent-invest',
    'Amortization': 'accent-loan',
    'TVM': 'accent-finance',
    'Investment': 'accent-invest',
    'Generic Loan': 'accent-loan',
}

ICON_MAP = {
    'Mortgage Payoff': '🏠',
    'House Affordability': '🏡',
    'Rent vs Buy': '🏘️',
    'APR': '📊',
    'Auto Loan': '🚗',
    'Personal Loan': '💳',
    'Student Loan': '🎓',
    'Credit Card': '💳',
    'Debt Payoff': '💸',
    '401k': '🏦',
    'Commission': '💼',
    'Depreciation': '📉',
    'Budget': '📋',
    'Present Value': '💹',
    'IRR': '📈',
    'Down Payment': '🏦',
    'College Cost': '🎓',
    'HELOC': '🏠',
    'Auto Lease': '🚘',
    'Bond': '📜',
    'CD': '🏦',
    'Roth IRA': '💰',
    'Annuity': '📅',
    'Pension': '🏛️',
    'Social Security': '🏛️',
    'RMD': '💰',
    'Estate Tax': '⚖️',
    'Marriage Tax': '💍',
    'Boat Loan': '⛵',
    'Debt Consolidation': '💸',
    'Future Value': '💹',
    'Average Return': '📈',
    'Amortization': '📋',
    'TVM': '⏱️',
    'Investment': '💰',
    'Generic Loan': '🏦',
}

def get_accent(label):
    for key, val in ACCENT_MAP.items():
        if key.lower() in label.lower():
            return val
    return 'accent-finance'

def get_icon(label):
    for key, val in ICON_MAP.items():
        if key.lower() in label.lower():
            return val
    return '💰'

# Replace the outer flex wrapper pattern with FinanceLayout
# Pattern 1: <div style={{display:"flex",flexDirection:"column",gap:20}}>
outer_start_patterns = [
    '<div style={{display:"flex",flexDirection:"column",gap:20}}>',
    "<div style={{display:'flex',flexDirection:'column',gap:20}}>",
]

# For each Panel call, find its surrounding structure and replace
replacements_done = 0

for panel_match in reversed(panels):
    label = panel_match.group(1)
    panel_start = panel_match.start()
    panel_end = panel_match.end()
    
    # Find the outer wrapper div that starts before this Panel
    # Look backwards for the outer flex div
    search_region = content[:panel_start]
    
    outer_pos = None
    for pat in outer_start_patterns:
        pos = search_region.rfind(pat)
        if pos != -1:
            if outer_pos is None or pos > outer_pos:
                outer_pos = pos
    
    if outer_pos is None:
        print(f'  Could not find outer wrapper for label="{label}"')
        continue
    
    # Find the inner input div (immediately after outer div start)
    inner_start = content.find('<div style={{background:', outer_pos)
    if inner_start == -1 or inner_start > panel_start:
        # Try alternative inner div pattern
        inner_start = content.find("<div style={{background:'var", outer_pos)
    if inner_start == -1 or inner_start > panel_start:
        print(f'  Could not find inner input div for label="{label}"')
        continue
    
    # Find the closing </div> of the inner input div
    # Count depth from inner_start
    depth = 0
    i = inner_start
    inner_end = None
    while i < panel_start:
        if content[i:i+4] == '<div':
            depth += 1
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                inner_end = i + 6
                break
        i += 1
    
    if inner_end is None:
        print(f'  Could not find inner div end for label="{label}"')
        continue
    
    # Extract inputs content (between inner_start and inner_end, excluding the wrapper div)
    # Find where the inner div's opening tag ends (first >)
    inner_open_end = content.index('>', inner_start) + 1
    inputs_content = content[inner_open_end:inner_end - 6].strip()  # -6 for </div>
    
    # Find outer end </div> after the Panel tag
    outer_end_pos = content.find('</div>', panel_end)
    if outer_end_pos == -1:
        print(f'  Could not find outer div end for label="{label}"')
        continue
    outer_end = outer_end_pos + 6
    
    accent = get_accent(label)
    icon = get_icon(label)
    
    replacement = f'''<FinanceLayout
      accentClass="{accent}"
      inputTitle="{label}"
      inputIcon="{icon}"
      inputContent={{<>
        {inputs_content}
      </>}}
      result={{res}}
      label="{label}"
    />'''
    
    # Check panel has a loading prop variant
    panel_text = content[panel_start:panel_end]
    if 'loading={null}' not in panel_text:
        replacement = replacement  # keep as is
    
    content = content[:outer_pos] + replacement + content[outer_end:]
    replacements_done += 1
    print(f'  Replaced "{label}" -> FinanceLayout({accent})')

print(f'\nTotal replacements: {replacements_done}')
print(f'FinanceLayout count: {content.count("FinanceLayout")}')
print(f'Remaining Panel calls: {content.count("<Panel ")}')

open(fpath, 'w', encoding='utf-8').write(content)
print('Saved FinanceFormsNew.tsx')
