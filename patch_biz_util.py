"""
Patch BusinessForms.tsx and UtilityForms.tsx to use FinanceLayout.

BusinessForms pattern:
  return (
    <div>
      <div style={{...input card...}}>
        [inputs]
      </div>
      <Panel result={res} loading={null} label="X" />
      <ScenarioCompare .../>     <- optional, goes in FinanceLayout children
    </div>
  );

UtilityForms/FuelForm pattern:
  return (
    <div>
      [direct inputs: N, Sl, Row2, ...]
      <Panel result={res} loading={null} label="Trip Cost"/>
    </div>
  );
"""
import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'

LABEL_MAP = {
    # BusinessForms
    'Markup': ('accent-finance', 'Pricing Details'),
    'Inventory Turnover': ('accent-finance', 'Inventory Details'),
    'EOQ': ('accent-finance', 'Order Details'),
    'Time Card': ('accent-finance', 'Work Hours'),
    'Overtime Pay': ('accent-finance', 'Pay Details'),
    'Salary to Hourly': ('accent-finance', 'Salary Details'),
    'Meeting Cost': ('accent-finance', 'Meeting Details'),
    'Conversion Rate': ('accent-finance', 'Campaign Details'),
    'Customer Lifetime Value': ('accent-finance', 'Customer Details'),
    'CPC / CPA / ROAS': ('accent-finance', 'Ad Campaign Details'),
    'Employee Cost': ('accent-finance', 'Employee Details'),
    # UtilityForms
    'Trip Cost': ('accent-utility', 'Trip Details'),
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

def patch_file(fname, default_accent):
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()
    original_lines = len(content.splitlines())

    # Add FinanceLayout to import if missing
    if 'FinanceLayout' not in content:
        # Try various import patterns
        for old, new in [
            ('L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney',
             'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout'),
            ('L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency',
             'L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, FinanceLayout'),
            ("} from './SharedComponents';",
             ", FinanceLayout } from './SharedComponents';"),
        ]:
            if old in content:
                content = content.replace(old, new, 1)
                break
    print(f'{fname}: FinanceLayout in import: {"FinanceLayout" in content}')

    # Find all Panel calls (both inline and {res && ...} and standalone)
    panel_re = re.compile(
        r'(\{res\s*&&\s*)?<Panel\s+result=\{res\}\s+loading=\{([^}]+)\}\s+label="([^"]+)"[^/]*/>'
        r'(\})?'
    )
    panels = list(panel_re.finditer(content))
    print(f'  Panel calls: {len(panels)}')

    replacements = 0
    for pm in reversed(panels):
        loading_val = pm.group(2)
        label = pm.group(3)
        panel_start = pm.start()
        panel_end = pm.end()

        accent, title = LABEL_MAP.get(label, (default_accent, 'Your Inputs'))

        # Find outermost return( before this Panel
        search = content[:panel_start]
        ret_pos = search.rfind('return (')
        if ret_pos == -1:
            print(f'  SKIP (no return): "{label}"')
            continue

        paren_open = content.index('(', ret_pos)
        paren_close = find_paren_end(content, paren_open)
        if paren_close is None:
            print(f'  SKIP (no paren end): "{label}"')
            continue

        # Outer JSX element
        jsx_start = paren_open + 1
        while jsx_start < len(content) and content[jsx_start] in ' \t\r\n':
            jsx_start += 1

        if content[jsx_start:jsx_start+4] != '<div':
            print(f'  SKIP (no outer div): "{label}" -> {content[jsx_start:jsx_start+20]}')
            continue

        outer_end = find_matching_div_end(content, jsx_start)
        if outer_end is None:
            print(f'  SKIP (no outer end): "{label}"')
            continue

        outer_open_end = content.index('>', jsx_start) + 1

        # Everything between outer_open_end and panel_start is the inputContent
        inputs_raw = content[outer_open_end:panel_start].strip()

        # Check for ScenarioCompare AFTER Panel (goes in children)
        after_panel = content[panel_end:outer_end].strip()
        # Remove closing </div> from after_panel (it's the outer div close)
        if after_panel.endswith('</div>'):
            after_panel = after_panel[:-6].strip()

        has_children = bool(after_panel)

        if has_children:
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
                f'    >\n'
                f'      {after_panel}\n'
                f'    </FinanceLayout>\n'
                f'  );'
            )
        else:
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

        end_pos = paren_close + 1
        if end_pos < len(content) and content[end_pos] == ';':
            end_pos += 1

        content = content[:ret_pos] + replacement + content[end_pos:]
        replacements += 1
        print(f'  OK{"(+children)" if has_children else ""}: "{label}"')

    open(fpath, 'w', encoding='utf-8').write(content)
    new_lines = len(content.splitlines())
    print(f'  Done: {replacements} | Lines: {original_lines} -> {new_lines}')
    print(f'  FinanceLayout count: {content.count("FinanceLayout")}')
    print(f'  Panel remaining: {content.count("<Panel ")}')
    print()

patch_file('BusinessForms.tsx', 'accent-finance')
patch_file('UtilityForms.tsx', 'accent-utility')
print('All done.')
