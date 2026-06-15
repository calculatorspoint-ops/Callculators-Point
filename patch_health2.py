"""
Safe, function-scoped replacement of Panel-based health forms.
For each form, replaces only the return(...) block — does not touch any other function.
"""
import re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = r'src\components\calculator-core\forms\HealthForms.tsx'
content = open(fpath, encoding='utf-8').read()

# Step 1: Add FinanceLayout to import
if 'FinanceLayout' not in content:
    content = content.replace(
        'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney',
        'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout',
        1
    )
    print('Added FinanceLayout to import')

# Step 2: For Panel-based forms, do a targeted return block replacement.
# Each Panel form has this exact return structure:
#
#   return (
#     <div style={{display:"flex",flexDirection:"column",gap:20}}>
#       <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
#         <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'24px 28px 20px',marginBottom:20}}>
#           <p style={{...}}>TITLE</p>
#           [inputs]
#         </div>
#       </div>
#       <Panel result={res} loading={null} label="LABEL" [shareParams=...]/>
#     </div>
#   );
#
# We replace the entire block:
#   <div style={{display:...flex...}}> ... </div>
# with:
#   <FinanceLayout ... inputContent={<> [inputs] </>} result={res} label="LABEL" />
#
# Method: for each Panel match, find the surrounding return block and replace it surgically.

TITLES = {
    'Body Fat %': 'Your Measurements',
    'Ideal Weight': 'Your Details',
    'Macros': 'Your Goals',
    'Water Intake': 'Your Details',
    'Calories Burned': 'Activity Details',
    'BSA': 'Your Measurements',
    'BAC': 'Details',
    'Lean Body Mass': 'Your Measurements',
    'Protein Calculator': 'Your Details',
    'Healthy Weight': 'Your Details',
    'Fat Intake': 'Your Details',
    'Army Body Fat': 'Your Measurements',
    'Conception': 'Your Cycle',
    'eGFR': 'Your Details',
}

# For CalorieForm, the Panel is in the middle of a complex result block — skip it for now
SKIP_LABELS = {'Daily Calories'}  # has extra custom result JSX around the Panel

# Panel pattern
panel_re = re.compile(r'<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"([^/]*/)?>')

# We need to find, for each Panel, the exact span to replace.
# The span is: the outer flex-column div that contains both the input card and the Panel.
# We identify this by finding the Panel, then walking backwards to find the nearest
# '<div style={{display:' that opened before the input card.

def find_outer_flex_start(content, before_pos):
    """Find the last <div style={{display:...flex... that opens before before_pos."""
    # Search backwards for div with display flex/column
    search = content[:before_pos]
    # Find all positions of outer flex divs
    candidates = []
    for pat in [
        '<div style={{display:"flex",flexDirection:"column",gap:20}}>',
        "<div style={{display:'flex',flexDirection:'column',gap:20}}>",
        '<div style={{display:"flex",flexDirection:"column",gap:16}}>',
        "<div style={{display:'flex',flexDirection:'column',gap:16}}>",
    ]:
        pos = search.rfind(pat)
        if pos != -1:
            candidates.append((pos, len(pat)))
    if not candidates:
        return None, None
    best = max(candidates, key=lambda x: x[0])
    return best  # (start_pos, pat_len)

def find_matching_div_end(content, start_pos):
    """Find the closing </div> that matches the opening <div at start_pos."""
    depth = 0
    i = start_pos
    while i < len(content):
        if content[i:i+4] == '<div':
            depth += 1
            i += 4
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
            i += 6
        else:
            i += 1
    return None

def extract_inputs_from_nested_card(content, card_start, card_end):
    """Extract the content inside the innermost input card div."""
    # The inner card div: <div style={{background:'var(--surface)',...}}>
    inner_start = None
    for pat in [
        "<div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'24px 28px 20px'",
        "<div style={{background:'var(--surface)', border:'1.5px solid var(--border)',borderRadius:16,padding:'24px 28px 20px'",
        '<div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,padding:"24px 28px 20px"',
    ]:
        pos = content.find(pat, card_start)
        if pos != -1 and pos < card_end:
            if inner_start is None or pos < inner_start:
                inner_start = pos
    
    if inner_start is None:
        # Try the outer card directly (some forms have only one level)
        inner_start = card_start
    
    # Find inner content (skip the opening tag)
    inner_open_end = content.index('>', inner_start) + 1
    inner_close = find_matching_div_end(content, inner_start)
    if inner_close is None:
        return None
    inputs = content[inner_open_end:inner_close - 6].strip()
    return inputs

replacements = 0
panels = list(panel_re.finditer(content))
print(f'Found {len(panels)} Panel calls total')

for panel_match in reversed(panels):
    loading_val = panel_match.group(1)
    label = panel_match.group(2)
    
    if label in SKIP_LABELS:
        print(f'  SKIP: "{label}" (complex custom result)')
        continue
    
    panel_start = panel_match.start()
    panel_end = panel_match.end()
    
    # Find outer flex div start
    outer_start, pat_len = find_outer_flex_start(content, panel_start)
    if outer_start is None:
        print(f'  SKIP (no outer flex div): "{label}"')
        continue
    
    # Find outer flex div end
    outer_end = find_matching_div_end(content, outer_start)
    if outer_end is None:
        print(f'  SKIP (no outer end): "{label}"')
        continue
    
    # The outer div should contain the Panel — verify
    if panel_start < outer_start or panel_start > outer_end:
        print(f'  SKIP (Panel not inside outer): "{label}"')
        continue
    
    # Find the input card div (first child of outer that is NOT the Panel)
    # It should start immediately after the outer opening tag
    outer_open_end = content.index('>', outer_start) + 1
    # Skip whitespace
    inner_region_start = outer_open_end
    while inner_region_start < panel_start and content[inner_region_start] in ' \t\r\n':
        inner_region_start += 1
    
    # The input card div starts here
    if not content[inner_region_start:inner_region_start+4] == '<div':
        print(f'  SKIP (no input card div after outer open): "{label}"')
        continue
    
    input_card_end = find_matching_div_end(content, inner_region_start)
    if input_card_end is None or input_card_end > panel_start:
        print(f'  SKIP (input card bleeds into Panel): "{label}"')
        continue
    
    # Extract inputs from inside the input card
    inputs_content = extract_inputs_from_nested_card(content, inner_region_start, input_card_end)
    if inputs_content is None:
        inputs_content = content[content.index('>', inner_region_start)+1:input_card_end-6].strip()
    
    # Build shareParams prop if present
    panel_text = panel_match.group(0)
    share_match = re.search(r'shareParams=(\{[^}]+\})', panel_text)
    share_prop = f'\n      shareParams={share_match.group(1)}' if share_match else ''
    
    title = TITLES.get(label, 'Your Details')
    
    replacement = (
        f'<FinanceLayout\n'
        f'      accentClass="accent-health"\n'
        f'      inputTitle="{title}"\n'
        f'      result={{res}}\n'
        f'      loading={{{loading_val}}}\n'
        f'      label="{label}"{share_prop}\n'
        f'      inputContent={{<>\n'
        f'        {inputs_content}\n'
        f'      </>}}\n'
        f'    />'
    )
    
    content = content[:outer_start] + replacement + content[outer_end:]
    replacements += 1
    print(f'  OK: "{label}"')

print(f'\nDone: {replacements} replacements')
print(f'FinanceLayout count: {content.count("FinanceLayout")}')
print(f'Panel remaining: {content.count("<Panel ")}')

open(fpath, 'w', encoding='utf-8').write(content)
print(f'Lines: {len(content.splitlines())}')
