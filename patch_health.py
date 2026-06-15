import re, os, sys, io

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = r'src\components\calculator-core\forms\HealthForms.tsx'
content = open(fpath, encoding='utf-8').read()

HEALTH_PANEL_ICONS = {
    'Daily Calories': ('fire', 'Your Details'),
    'Body Fat %': ('body', 'Your Measurements'),
    'Ideal Weight': ('scale', 'Your Details'),
    'Macros': ('food', 'Your Goals'),
    'Water Intake': ('water', 'Your Details'),
    'Calories Burned': ('run', 'Activity Details'),
    'BSA': ('ruler', 'Your Measurements'),
    'BAC': ('drink', 'Details'),
    'Lean Body Mass': ('muscle', 'Your Measurements'),
    'Protein Calculator': ('protein', 'Your Details'),
    'Healthy Weight': ('check', 'Your Details'),
    'Fat Intake': ('food', 'Your Details'),
    'Army Body Fat': ('army', 'Your Measurements'),
    'Conception': ('baby', 'Your Cycle'),
    'eGFR': ('kidney', 'Your Details'),
}

HEALTH_PANEL_EMOJI = {
    'Daily Calories': 'calories',
    'Body Fat %': 'bodyfat',
    'Ideal Weight': 'idealweight',
    'Macros': 'macros',
    'Water Intake': 'water',
    'Calories Burned': 'burned',
    'BSA': 'bsa',
    'BAC': 'bac',
    'Lean Body Mass': 'lbm',
    'Protein Calculator': 'protein',
    'Healthy Weight': 'healthyw',
    'Fat Intake': 'fat',
    'Army Body Fat': 'army',
    'Conception': 'conception',
    'eGFR': 'egfr',
}

# Use text placeholders for inputIcon (no emoji encoding issues in script)
ICON_TEXT = {
    'Daily Calories': 'Calories',
    'Body Fat %': 'Body Fat',
    'Ideal Weight': 'Weight',
    'Macros': 'Macros',
    'Water Intake': 'Water',
    'Calories Burned': 'Activity',
    'BSA': 'BSA',
    'BAC': 'BAC',
    'Lean Body Mass': 'LBM',
    'Protein Calculator': 'Protein',
    'Healthy Weight': 'Weight',
    'Fat Intake': 'Fat',
    'Army Body Fat': 'Body Fat',
    'Conception': 'Cycle',
    'eGFR': 'GFR',
}

TITLE_TEXT = {
    'Daily Calories': 'Your Details',
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

panel_pattern = re.compile(r'<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"([^/]*/)?>')
panels = list(panel_pattern.finditer(content))
print(f'Found {len(panels)} Panel calls')

replacements = 0
for panel_match in reversed(panels):
    loading_val = panel_match.group(1)
    label = panel_match.group(2)
    panel_start = panel_match.start()
    panel_end = panel_match.end()
    
    search_region = content[:panel_start]
    
    # Find input card div
    input_card_pos = None
    for pat in [
        "<div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,",
        '<div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,',
        "<div style={{background:'var(--surface)',border:'1.5px solid var(--border)', borderRadius:16,",
        "<div style={{background:'var(--surface)', border:'1.5px solid var(--border)',borderRadius:16,",
    ]:
        pos = search_region.rfind(pat)
        if pos != -1:
            if input_card_pos is None or pos > input_card_pos:
                input_card_pos = pos
    
    if input_card_pos is None:
        print(f'  SKIP (no input card): "{label}"')
        continue
    
    # Find closing </div> of input card
    depth = 0
    i = input_card_pos
    input_card_end = None
    while i < panel_start:
        if content[i:i+4] == '<div':
            depth += 1
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                input_card_end = i + 6
                break
        i += 1
    
    if input_card_end is None:
        print(f'  SKIP (no input card end): "{label}"')
        continue
    
    inner_open_end = content.index('>', input_card_pos) + 1
    inputs_content = content[inner_open_end:input_card_end - 6].strip()
    
    # Look for outer wrapper (flex column div)
    outer_pos = None
    for pat in [
        '<div style={{display:"flex",flexDirection:"column",gap:20}}>',
        "<div style={{display:'flex',flexDirection:'column',gap:20}}>",
        '<div style={{display:"flex",flexDirection:"column",gap:16}}>',
        "<div style={{display:'flex',flexDirection:'column',gap:16}}>",
    ]:
        pos = search_region[:input_card_pos].rfind(pat)
        if pos != -1:
            if outer_pos is None or pos > outer_pos:
                outer_pos = pos
    
    if outer_pos is not None:
        outer_end_pos = content.find('</div>', panel_end)
        outer_end = outer_end_pos + 6 if outer_end_pos != -1 else panel_end
    else:
        outer_pos = input_card_pos
        outer_end = panel_end
    
    # Build shareParams if present
    panel_full = content[panel_start:panel_end]
    share_match = re.search(r'shareParams=(\{[^}]+\})', panel_full)
    share_prop = f'\n        shareParams={share_match.group(1)}' if share_match else ''
    
    title = TITLE_TEXT.get(label, 'Your Details')
    
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
    
    content = content[:outer_pos] + replacement + content[outer_end:]
    replacements += 1
    print(f'  OK: "{label}"')

print(f'\nPanel replacements done: {replacements}')
print(f'FinanceLayout count: {content.count("FinanceLayout")}')
print(f'Remaining Panel calls: {content.count("<Panel ")}')

open(fpath, 'w', encoding='utf-8').write(content)
print('Saved HealthForms.tsx')
