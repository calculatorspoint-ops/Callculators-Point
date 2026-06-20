"""
Patch TechForms.tsx to use FinanceLayout.
These forms use: const left = (...); const right = (...); return twoColWrap(left, right);

The key fix vs the previous broken script: find the OUTERMOST return block of the
FUNCTION (not a .map callback). We identify this by finding:
  1. The function body start (the { after the function signature)
  2. Walking forward to find 'const left' (which only appears once per function)
  3. Then 'const right'  
  4. Then 'return twoColWrap'

This avoids hitting return( inside .map() callbacks.
"""
import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'
fpath = os.path.join(BASE, 'TechForms.tsx')
content = open(fpath, encoding='utf-8').read()
original = content  # keep a backup

LABEL_MAP = {
    'Subnet': ('accent-tech', 'Network Details'),
    'ASCII': ('accent-tech', 'Your Input'),
    'Data Transfer': ('accent-tech', 'Transfer Details'),
    'Password Strength': ('accent-tech', 'Your Password'),
    'Hash Generator': ('accent-tech', 'Your Input'),
    'Bandwidth': ('accent-tech', 'Network Details'),
    'IP Range': ('accent-tech', 'Network Details'),
    'Hex Converter': ('accent-tech', 'Your Values'),
    'Decimal Value': ('accent-tech', 'Your Values'),
    'Calculator': ('accent-tech', 'Your Input'),
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

def find_brace_end(text, open_pos):
    depth = 0
    i = open_pos
    while i < len(text):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return None

# 1. Add FinanceLayout to import
content = content.replace(
    'L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency',
    'L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency, FinanceLayout',
    1
)
print('Import updated:', 'FinanceLayout' in content)

# 2. Find each 'return twoColWrap(left, right);' and patch
twocol_re = re.compile(r'return twoColWrap\(left,\s*right\);')
matches = list(twocol_re.finditer(content))
print(f'Found {len(matches)} twoColWrap calls')

replacements = 0
for m in reversed(matches):
    tc_end = m.end()
    tc_start = m.start()
    
    # Find 'const right = (' immediately before the twoColWrap
    search_before = content[:tc_start]
    right_kw = search_before.rfind('const right = (')
    if right_kw == -1:
        right_kw = search_before.rfind('const right=(')
    if right_kw == -1:
        print(f'  SKIP: no const right before twoColWrap')
        continue
    
    # Parse the right block
    right_paren_open = content.index('(', right_kw)
    right_paren_close = find_paren_end(content, right_paren_open)
    right_inner = content[right_paren_open+1:right_paren_close].strip()
    
    # Get label from Panel in right block
    pm = re.search(r'label="([^"]+)"', right_inner)
    label = pm.group(1) if pm else 'Calculator'
    accent, title = LABEL_MAP.get(label, ('accent-tech', 'Your Input'))
    
    # Find 'const left = (' immediately before const right
    search_before_right = content[:right_kw]
    left_kw = search_before_right.rfind('const left = (')
    if left_kw == -1:
        left_kw = search_before_right.rfind('const left=(')
    if left_kw == -1:
        print(f'  SKIP: no const left before const right for "{label}"')
        continue

    # Parse the left block
    left_paren_open = content.index('(', left_kw)
    left_paren_close = find_paren_end(content, left_paren_open)
    left_inner = content[left_paren_open+1:left_paren_close].strip()

    # Build replacement — from left_kw to tc_end
    replacement = (
        f'return (\n'
        f'    <FinanceLayout\n'
        f'      accentClass="{accent}"\n'
        f'      inputTitle="{title}"\n'
        f'      result={{res}}\n'
        f'      loading={{null}}\n'
        f'      label="{label}"\n'
        f'      inputContent={{<>\n'
        f'        {left_inner}\n'
        f'      </>}}\n'
        f'    />\n'
        f'  );'
    )

    content = content[:left_kw] + replacement + content[tc_end:]
    replacements += 1
    print(f'  OK: "{label}"')

print(f'\nDone: {replacements} replacements')
print(f'FinanceLayout count: {content.count("FinanceLayout")}')
print(f'Panel remaining: {content.count("<Panel ")}')

open(fpath, 'w', encoding='utf-8').write(content)
print(f'Lines: {len(content.splitlines())}')
