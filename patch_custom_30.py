"""
Improved patch: find the LAST return( in each function body (the JSX return),
not an inner return inside useEffect/setTimeout callbacks.

Also handles:
- MortgageForm which uses <> fragment instead of <div> as outer element
- Functions where outer is <> fragment
"""
import re, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\components\calculator-core\forms'

CONFIG = {
    'BMIForm':             ('accent-health', 'Your Details'),
    'BMRForm':             ('accent-health', 'Your Details'),
    'HeartRateForm':       ('accent-health', 'Your Details'),
    'OneRMForm':           ('accent-health', 'Your Lift'),
    'PregnancyForm':       ('accent-health', 'Your Details'),
    'SleepForm':           ('accent-health', 'Your Schedule'),
    'BodyTypeForm':        ('accent-health', 'Your Measurements'),
    'PercentageForm':      ('accent-math', 'Your Values'),
    'StatsForm':           ('accent-math', 'Your Numbers'),
    'FractionForm':        ('accent-math', 'Your Fractions'),
    'GPAForm':             ('accent-math', 'Your Courses'),
    'CGPAForm':            ('accent-math', 'Your Semesters'),
    'ScientificForm':      ('accent-math', 'Your Expression'),
    'PrimeForm':           ('accent-math', 'Your Number'),
    'UnitForm':            ('accent-utility', 'Your Values'),
    'TemperatureForm':     ('accent-utility', 'Your Temperature'),
    'AgeForm':             ('accent-utility', 'Your Details'),
    'DateDiffForm':        ('accent-utility', 'Your Dates'),
    'CountdownForm':       ('accent-utility', 'Your Event'),
    'WorkHoursForm':       ('accent-utility', 'Your Hours'),
    'PasswordForm':        ('accent-utility', 'Password Options'),
    'RomanForm':           ('accent-utility', 'Your Number'),
    'WordCountForm':       ('accent-utility', 'Your Text'),
    'Base64Form':          ('accent-utility', 'Your Input'),
    'AreaForm':            ('accent-utility', 'Your Shape'),
    'RandomForm':          ('accent-utility', 'Your Options'),
    'TimeZoneForm':        ('accent-utility', 'Your Time'),
    'MortgageForm':        ('accent-loan', 'Loan Details'),
    'PeriodForm':          ('accent-health', 'Your Details'),
    'RetirementPlanForm':  ('accent-invest', 'Your Plan'),
}

TARGETS = {
    'HealthForms.tsx':    ['BMIForm','BMRForm','HeartRateForm','OneRMForm','PregnancyForm','SleepForm','BodyTypeForm'],
    'MathForms.tsx':      ['PercentageForm','StatsForm','FractionForm','GPAForm','CGPAForm','ScientificForm','PrimeForm'],
    'UtilityForms.tsx':   ['UnitForm','TemperatureForm','AgeForm','DateDiffForm','CountdownForm','WorkHoursForm',
                           'PasswordForm','RomanForm','WordCountForm','Base64Form','AreaForm','RandomForm','TimeZoneForm'],
    'MortgageForms.tsx':  ['MortgageForm'],
    'PeriodForm.tsx':     ['PeriodForm'],
    'RetirementForms.tsx':['RetirementPlanForm'],
}

def find_paren_end(text, open_pos):
    depth, i = 0, open_pos
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
    depth, i = 0, open_pos
    while i < len(text):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return None

def find_tag_end(content, start_pos, tag='div'):
    open_tag, close_tag = f'<{tag}', f'</{tag}>'
    depth, i = 0, start_pos
    while i < len(content):
        if content[i:i+len(open_tag)] == open_tag and (i+len(open_tag) >= len(content) or content[i+len(open_tag)] in ' \t\r\n/>'):
            depth += 1
            i += len(open_tag)
        elif content[i:i+len(close_tag)] == close_tag:
            depth -= 1
            if depth == 0:
                return i + len(close_tag)
            i += len(close_tag)
        else:
            i += 1
    return None

def find_fragment_end(content, start_pos):
    """Find closing </> for <> at start_pos."""
    depth, i = 0, start_pos
    while i < len(content):
        if content[i:i+2] == '<>' or content[i:i+2] == '<\n':
            depth += 1
            i += 2
        elif content[i:i+3] == '</>':
            depth -= 1
            if depth == 0:
                return i + 3
            i += 3
        elif content[i:i+4] == '<div' and content[i+4] in ' \t\r\n/>':
            # nested div doesn't change fragment depth
            i += 4
        else:
            i += 1
    return None

def get_function_bounds(content, func_name):
    """Return (func_start, func_end) — func_end is after the closing } of the function body."""
    m = re.search(rf'export function {re.escape(func_name)}\b', content)
    if not m:
        return None, None
    # Find opening { of function body
    brace_open = content.index('{', m.end())
    brace_close = find_brace_end(content, brace_open)
    if brace_close is None:
        return None, None
    return m.start(), brace_close + 1

def find_last_return_in_function(content, func_start, func_end):
    """
    Find the LAST 'return (' inside the function body that starts a JSX block.
    We identify JSX returns by checking that the content after '(' starts with '<'.
    """
    func_body = content[func_start:func_end]
    
    # Find all 'return (' positions inside this function
    pattern = re.compile(r'\breturn\s*\(')
    candidates = list(pattern.finditer(func_body))
    
    # Walk through from the last one backwards until we find one whose ( opens JSX
    for m in reversed(candidates):
        rel_paren = func_body.index('(', m.start())
        abs_paren = func_start + rel_paren
        paren_close = find_paren_end(content, abs_paren)
        if paren_close is None:
            continue
        
        # Check what's inside: skip whitespace after (
        inner_start = abs_paren + 1
        while inner_start < len(content) and content[inner_start] in ' \t\r\n':
            inner_start += 1
        
        # Valid JSX return starts with < (element, fragment, or <>)
        if content[inner_start] == '<':
            ret_start = func_start + m.start()
            end_pos = paren_close + 1
            if end_pos < len(content) and content[end_pos] == ';':
                end_pos += 1
            return ret_start, end_pos, inner_start, paren_close
    
    return None, None, None, None

def patch_form(content, func_name):
    accent, title = CONFIG.get(func_name, ('accent-finance', 'Your Inputs'))

    func_start, func_end = get_function_bounds(content, func_name)
    if func_start is None:
        print(f'    SKIP {func_name}: function not found')
        return content

    # Skip if already patched
    func_body = content[func_start:func_end]
    if 'FinanceLayout' in func_body:
        print(f'    SKIP {func_name}: already has FinanceLayout')
        return content

    ret_start, end_pos, jsx_start, paren_close = find_last_return_in_function(content, func_start, func_end)
    if ret_start is None:
        print(f'    SKIP {func_name}: no JSX return found')
        return content

    # Determine the outer JSX element type
    outer = content[jsx_start:jsx_start+10]

    if content[jsx_start:jsx_start+2] == '<>':
        # Fragment outer — find </> close
        outer_open_end = jsx_start + 2
        outer_end = find_fragment_end(content, jsx_start)
        if outer_end is None:
            print(f'    SKIP {func_name}: cannot find </> end')
            return content
        inner = content[outer_open_end:outer_end - 3].strip()  # -3 for </>
    elif content[jsx_start:jsx_start+4] == '<div':
        outer_end = find_tag_end(content, jsx_start)
        if outer_end is None:
            print(f'    SKIP {func_name}: cannot find </div> end')
            return content
        outer_open_end = content.index('>', jsx_start) + 1
        inner = content[outer_open_end:outer_end - 6].strip()  # -6 for </div>
    else:
        print(f'    SKIP {func_name}: outer is not <div> or <> (got: {outer!r})')
        return content

    # === Split inner into inputs + result ===
    # Strategy: look for a styled input card first
    input_card_patterns = [
        "style={{background:'var(--surface)',border:'1.5px solid var(--border)'",
        "style={{background:'var(--surface)', border:'1.5px solid var(--border)'",
        'style={{background:"var(--surface)",border:"1.5px solid var(--border)"',
        'style={{background:"var(--surface)", border:"1.5px solid var(--border)"',
        "style={{background:'var(--surface)',border:'1px solid var(--border)'",
        "style={{background: 'var(--surface)', border: '1.5px solid var(--border)'",
    ]

    input_card_start = None
    for pat in input_card_patterns:
        # Search in the absolute content, starting from outer_open_end
        pos = content.find(pat, outer_open_end if content[jsx_start:jsx_start+2] != '<>' else outer_open_end)
        if pos != -1 and pos < (outer_end - 6):
            card_div_pos = content.rfind('<div', outer_open_end, pos)
            if card_div_pos != -1:
                input_card_start = card_div_pos
                break

    if input_card_start is not None:
        card_end = find_tag_end(content, input_card_start)
        if card_end is not None:
            card_open_end = content.index('>', input_card_start) + 1
            inputs_raw = content[card_open_end:card_end - 6].strip()
            result_raw = content[card_end:outer_end - (6 if content[jsx_start:jsx_start+4]=='<div' else 3)].strip()
        else:
            inputs_raw = inner
            result_raw = ''
    else:
        # No styled card — split on conditional result block
        cond = re.search(
            r'\{(?:bmiData|bmrData|hrData|ormData|pregData|sleepData|btData|data|res|result|calc|calc2|ages?|diff|output|bases)\s*(?:&&|\?)',
            inner
        )
        if cond:
            inputs_raw = inner[:cond.start()].strip()
            result_raw = inner[cond.start():].strip()
        else:
            inputs_raw = inner
            result_raw = ''

    # Build FinanceLayout replacement
    if result_raw:
        replacement = (
            f'return (\n'
            f'    <FinanceLayout\n'
            f'      accentClass="{accent}"\n'
            f'      inputTitle="{title}"\n'
            f'      resultContent={{<>\n'
            f'        {result_raw}\n'
            f'      </>}}\n'
            f'      inputContent={{<>\n'
            f'        {inputs_raw}\n'
            f'      </>}}\n'
            f'    />\n'
            f'  );'
        )
    else:
        replacement = (
            f'return (\n'
            f'    <FinanceLayout\n'
            f'      accentClass="{accent}"\n'
            f'      inputTitle="{title}"\n'
            f'      inputContent={{<>\n'
            f'        {inputs_raw}\n'
            f'      </>}}\n'
            f'    />\n'
            f'  );'
        )

    content = content[:ret_start] + replacement + content[end_pos:]
    tag = '[has resultContent]' if result_raw else '[inputs only]'
    print(f'    OK: {func_name}  {tag}')
    return content


grand_total = 0
for fname, forms in TARGETS.items():
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'SKIP {fname}: not found')
        continue
    content = open(fpath, encoding='utf-8').read()
    orig_lines = len(content.splitlines())
    print(f'\n=== {fname} ({orig_lines} lines) ===')

    # Add FinanceLayout to import if needed
    if 'FinanceLayout' not in content:
        for old, new in [
            ("L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney",
             "L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout"),
            ("L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency",
             "L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, FinanceLayout"),
            ("L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency",
             "L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency, FinanceLayout"),
            ("} from './SharedComponents';",
             ", FinanceLayout } from './SharedComponents';"),
        ]:
            if old in content:
                content = content.replace(old, new, 1)
                print('  Added FinanceLayout import')
                break

    ok = 0
    for func_name in forms:
        before = content
        content = patch_form(content, func_name)
        if content != before:
            ok += 1
            grand_total += 1

    open(fpath, 'w', encoding='utf-8').write(content)
    new_lines = len(content.splitlines())
    fl = content.count('<FinanceLayout')
    print(f'  Saved | Lines: {orig_lines} -> {new_lines} | FinanceLayout: {fl} | Patched this run: {ok}')

print(f'\n{"="*55}')
print(f'GRAND TOTAL PATCHED: {grand_total} / 30')
