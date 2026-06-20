"""
Patch ConstructionForms.tsx to use FinanceLayout.

Pattern (most forms):
  return (
    <div>
      <div style={{background:'var(--surface)', ...}}>
        [inputs]
      </div>
      {res && <Panel result={res} loading={null} label="X" />}
      OR
      <Panel result={res} loading={null} label="X" />
    </div>
  );

MaterialForm has dynamic label: label={labels[type]} — handled separately.
"""
import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'
fpath = os.path.join(BASE, 'ConstructionForms.tsx')
content = open(fpath, encoding='utf-8').read()
original_lines = len(content.splitlines())

LABEL_MAP = {
    'Concrete': ('accent-construction', 'Your Dimensions'),
    'Paint Calculator': ('accent-construction', 'Room Details'),
    'Square Footage': ('accent-construction', 'Your Area'),
    'Construction Cost': ('accent-construction', 'Project Details'),
    'Electrical Load': ('accent-construction', 'Your Circuits'),
    'Density': ('accent-construction', 'Material Details'),
    'Pressure': ('accent-construction', 'Your Values'),
    'Pipe Volume': ('accent-construction', 'Pipe Dimensions'),
    'Cubic Yard': ('accent-construction', 'Your Dimensions'),
    'Roofing': ('accent-construction', 'Roof Details'),
}

def find_paren_end(text, open_pos):
    depth = 0
    i = open_pos
    while i < len(text):
        if text[i] == '(':
            depth += 1
        elif text[i] == ')':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return None

def find_matching_div_end(content, start_pos):
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

# 1. Add FinanceLayout to import
if 'FinanceLayout' not in content:
    content = content.replace(
        'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency',
        'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, FinanceLayout',
        1
    )
print('FinanceLayout in import:', 'FinanceLayout' in content)

# 2. Handle MaterialForm separately (dynamic label)
# Replace: {res && <Panel result={res} loading={null} label={labels[type]} />}
# in the return block of MaterialForm
mat_panel = '{res && <Panel result={res} loading={null} label={labels[type]} />}'
if mat_panel in content:
    # Find the MaterialForm return block
    mat_return_start = content.rfind('return (', 0, content.find(mat_panel))
    mat_outer_div_start = content.index('<div>', mat_return_start)
    mat_outer_div_end = find_matching_div_end(content, mat_outer_div_start)

    # Extract input card
    input_card_start = content.find("<div style={{background:'var(--surface)'", mat_outer_div_start)
    input_card_inner_open = content.index('>', input_card_start) + 1
    input_card_end = find_matching_div_end(content, input_card_start)
    inputs_content = content[input_card_inner_open:input_card_end-6].strip()

    mat_replacement = (
        'return (\n'
        '    <FinanceLayout\n'
        '      accentClass="accent-construction"\n'
        '      inputTitle="Material Details"\n'
        '      result={res}\n'
        '      loading={null}\n'
        '      label={labels[type]}\n'
        '      inputContent={<>\n'
        f'        {inputs_content}\n'
        '      </>}\n'
        '    />\n'
        '  );'
    )
    end_pos = mat_outer_div_end
    if content[end_pos:end_pos+1] in ('\n', '\r'):
        end_pos += 1
    # Find the ); after the outer div
    semi_pos = content.index(');', mat_outer_div_end)
    content = content[:mat_return_start] + mat_replacement + content[semi_pos+2:]
    print('  OK: MaterialForm (dynamic label)')
else:
    print('  NOTE: MaterialForm pattern not found, skipping')

# 3. Handle remaining Panel-based forms with static labels
# Both patterns: {res && <Panel .../> and <Panel .../> standalone
panel_re = re.compile(
    r'(\{res\s*&&\s*)?<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"[^/]*/>'
    r'(\})?'
)
panels = list(panel_re.finditer(content))
print(f'Static Panel calls remaining: {len(panels)}')

def find_return_block_start(content, panel_pos):
    """Find outermost return( block before panel_pos."""
    # Walk backwards to find 'return ('
    search = content[:panel_pos]
    ret_pos = search.rfind('return (')
    if ret_pos == -1:
        return None, None
    paren_open = content.index('(', ret_pos)
    paren_close = find_paren_end(content, paren_open)
    return ret_pos, paren_close

replacements = 0
for pm in reversed(panels):
    loading_val = pm.group(2)
    label = pm.group(3)
    panel_start = pm.start()
    panel_end = pm.end()

    accent, title = LABEL_MAP.get(label, ('accent-construction', 'Your Inputs'))

    ret_start, ret_end = find_return_block_start(content, panel_start)
    if ret_start is None:
        print(f'  SKIP (no return): "{label}"')
        continue

    paren_open = content.index('(', ret_start)
    jsx_start = paren_open + 1
    while jsx_start < len(content) and content[jsx_start] in ' \t\r\n':
        jsx_start += 1

    if content[jsx_start:jsx_start+4] != '<div':
        print(f'  SKIP (no outer div): "{label}" starts with {content[jsx_start:jsx_start+20]}')
        continue

    outer_end = find_matching_div_end(content, jsx_start)
    if outer_end is None:
        print(f'  SKIP (no outer end): "{label}"')
        continue

    outer_open_end = content.index('>', jsx_start) + 1
    inputs_raw = content[outer_open_end:panel_start].strip()

    replacement = (
        f'return (\n'
        f'    <FinanceLayout\n'
        f'      accentClass="{accent}"\n'
        f'      inputTitle="{title}"\n'
        f'      result={{res}}\n'
        f'      loading={{{loading_val}}}\n'
        f'      label="{label}"\n'
        f'      inputContent={{<>\n'
        f'        {inputs_raw}\n'
        f'      </>}}\n'
        f'    />\n'
        f'  );'
    )

    end_pos = ret_end
    if end_pos < len(content) and content[end_pos] == ';':
        end_pos += 1

    content = content[:ret_start] + replacement + content[end_pos:]
    replacements += 1
    print(f'  OK: "{label}"')

open(fpath, 'w', encoding='utf-8').write(content)
new_lines = len(content.splitlines())
print(f'\nTotal done: {replacements + 1} | Lines: {original_lines} -> {new_lines}')
print(f'FinanceLayout count: {content.count("FinanceLayout")}')
print(f'Panel remaining: {content.count("<Panel ")}')
