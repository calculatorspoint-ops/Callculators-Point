"""
Patch MathForms.tsx and TechForms.tsx to use FinanceLayout.

These files have a simpler pattern than FinanceForms:
  return (
    <div>
      [inputs: N, Row2, Sel, Tabs, etc.]
      {res && <Panel result={res} loading={null} label="X" />}
    </div>
  );

OR (for 3 forms in MathForms with a styled input card):
  return (
    <div>
      <div style={{background:'var(--surface)', ...}}>
        [inputs]
      </div>
      <Panel result={res} loading={null} label="X" />
    </div>
  );

Strategy: for each Panel call (including {res && <Panel .../>}), find the enclosing
function's return block, extract the non-Panel content as inputContent, and wrap everything
in FinanceLayout.
"""
import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'

LABEL_MAP = {
    # MathForms
    'Quadratic': ('accent-math', 'Your Equation'),
    'Pythagorean': ('accent-math', 'Your Triangle'),
    'Logarithm Result': ('accent-math', 'Your Values'),
    'Ratio Result': ('accent-math', 'Your Values'),
    'Reading Time': ('accent-math', 'Your Text'),
    'LCM & GCF': ('accent-math', 'Your Numbers'),
    'Factor Calculator': ('accent-math', 'Your Number'),
    'Triangle': ('accent-math', 'Your Triangle'),
    'Circle': ('accent-math', 'Your Circle'),
    'Volume': ('accent-math', 'Your Shape'),
    'Z-Score': ('accent-math', 'Your Values'),
    'Permutation & Combination': ('accent-math', 'Your Values'),
    'Average': ('accent-math', 'Your Numbers'),
    'Percent Error': ('accent-math', 'Your Values'),
    'Linear Equation': ('accent-math', 'Your Equation'),
    'Distance': ('accent-math', 'Your Points'),
    # TechForms
    'Subnet': ('accent-tech', 'Network Details'),
    'ASCII': ('accent-tech', 'Your Input'),
    'Data Transfer': ('accent-tech', 'Transfer Details'),
    'Password Strength': ('accent-tech', 'Your Password'),
    'Hash Generator': ('accent-tech', 'Your Input'),
    'Bandwidth': ('accent-tech', 'Network Details'),
    'IP Range': ('accent-tech', 'Network Details'),
    'Hex Converter': ('accent-tech', 'Your Values'),
    'Number Base': ('accent-tech', 'Your Values'),
    'Random String': ('accent-tech', 'Your Options'),
}

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

def find_return_block(content, panel_pos):
    """Find the return ( ... ); block containing panel_pos by walking backwards."""
    search = content[:panel_pos]
    # Find the last 'return (' before the panel
    ret_pos = search.rfind('return (')
    if ret_pos == -1:
        ret_pos = search.rfind('return(')
    if ret_pos == -1:
        return None, None
    
    # Find the opening ( of return
    paren_start = content.index('(', ret_pos)
    
    # Now find the matching closing ) of the return
    depth = 0
    i = paren_start
    while i < len(content):
        if content[i] == '(':
            depth += 1
        elif content[i] == ')':
            depth -= 1
            if depth == 0:
                return ret_pos, i + 1
        i += 1
    return None, None

def patch_file(fname, default_accent):
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()
    original_lines = len(content.splitlines())

    # 1. Add FinanceLayout to import
    if 'FinanceLayout' not in content:
        content = content.replace(
            'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney',
            'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout',
            1
        )
        print(f'Added FinanceLayout import to {fname}')

    # 2. Find Panel calls — both inline and conditional
    # Pattern: <Panel result={res} loading={null} label="X" />
    # or: {res && <Panel result={res} loading={null} label="X" />}
    panel_re = re.compile(
        r'(\{res\s*&&\s*)?<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"[^/]*/>'
        r'(\})?'
    )
    panels = list(panel_re.finditer(content))
    print(f'{fname}: {len(panels)} Panel calls found')

    replacements = 0
    for pm in reversed(panels):
        full_match = pm.group(0)
        loading_val = pm.group(2)
        label = pm.group(3)

        accent, title = LABEL_MAP.get(label, (default_accent, 'Your Inputs'))

        panel_start = pm.start()
        panel_end = pm.end()

        # Find the return block containing this Panel
        ret_start, ret_end = find_return_block(content, panel_start)
        if ret_start is None:
            print(f'  SKIP (no return block): "{label}"')
            continue

        # The return block is: return ( [JSX] );
        # Find the outer JSX element (the root element inside return)
        paren_open = content.index('(', ret_start)
        # Skip whitespace after (
        jsx_start = paren_open + 1
        while jsx_start < len(content) and content[jsx_start] in ' \t\r\n':
            jsx_start += 1

        # Get the content between return( and the closing )
        # Everything before the Panel is the inputContent
        # Everything at/after the Panel to end of outer div is discarded

        # Find the outer wrapper div (the outermost element in return)
        if content[jsx_start:jsx_start+4] != '<div' and content[jsx_start:jsx_start+2] != '<>':
            print(f'  SKIP (return does not start with <div>): "{label}" — starts with: {content[jsx_start:jsx_start+30]}')
            continue

        # Find end of outer div
        if content[jsx_start:jsx_start+2] == '<>':
            # Fragment — find </>
            outer_end = content.find('</>', panel_end)
            if outer_end == -1:
                print(f'  SKIP (no </> fragment end): "{label}"')
                continue
            outer_end += 3
            outer_open_end = jsx_start + 2
        else:
            outer_end = find_matching_div_end(content, jsx_start)
            if outer_end is None:
                print(f'  SKIP (no outer div end): "{label}"')
                continue
            outer_open_end = content.index('>', jsx_start) + 1

        # Extract the inputContent: everything INSIDE the outer div, BEFORE the Panel call
        # (skip leading whitespace)
        inputs_raw = content[outer_open_end:panel_start].strip()

        # Also check if there's content after the Panel (e.g. a closing tag follows immediately)
        # We'll ignore any content after Panel inside the return

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

        # Replace from ret_start to the closing ); of the return
        # ret_end points to the character after the closing )
        # We also need to include the ; after )
        end_pos = ret_end
        # Skip optional semicolon
        if end_pos < len(content) and content[end_pos] == ';':
            end_pos += 1

        content = content[:ret_start] + replacement + content[end_pos:]
        replacements += 1
        print(f'  OK: "{label}"')

    open(fpath, 'w', encoding='utf-8').write(content)
    new_lines = len(content.splitlines())
    print(f'  Done: {replacements} replacements | Lines: {original_lines} -> {new_lines}')
    print(f'  FinanceLayout count: {content.count("FinanceLayout")}')
    print(f'  Panel remaining: {content.count("<Panel ")}')
    print()

patch_file('MathForms.tsx', 'accent-math')
patch_file('TechForms.tsx', 'accent-tech')
print('All done.')
