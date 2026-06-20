"""
Bulk patch Batch 2 education calculators to use FinanceLayout.
Each file is patched by finding a split marker between inputs and results.
"""
import os, sys, re
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\modules\education'
IMPORT_LINE = "import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';"

def add_import(content):
    if 'FinanceLayout' in content:
        return content
    lines = content.split('\n')
    last_import = 0
    for i, l in enumerate(lines):
        if l.strip().startswith('import '):
            last_import = i
    lines.insert(last_import + 1, IMPORT_LINE)
    return '\n'.join(lines)

def wrap(path, fn_name, input_title, input_end_marker, result_start_marker, extra_info=""):
    """
    Wrap a component's return block with FinanceLayout.
    - input_end_marker: unique string just BEFORE the result section (will go in inputContent)
    - result_start_marker: unique string that STARTS the result section (will go in resultContent)
    """
    content = open(path, encoding='utf-8').read()
    content = add_import(content)
    
    # Find the outer return div opening
    # Strategy: find 'return (\n    <div' and replace with FinanceLayout
    # Find where inputContent ends (just before result_start_marker)
    
    idx_result = content.find(result_start_marker)
    if idx_result == -1:
        print(f"  ERROR in {fn_name}: result marker not found: {result_start_marker[:40]!r}")
        return False
    
    # Find the return( and the opening outer div
    # We'll look backwards from idx_result to find the return
    pre = content[:idx_result]
    
    # Find the newline before the result - that's where we insert the split
    # Insert: </>\n      }\n      resultContent={<>\n before the result marker
    
    # Find the outer div that wraps everything - it's in the return(
    # Pattern: return (\n    <div ...>
    outer_div_pat = re.search(r'  return \(\n    (<div[^>]*>)\n', pre)
    if not outer_div_pat:
        print(f"  ERROR in {fn_name}: outer div pattern not found")
        return False
    
    outer_div = outer_div_pat.group(1)
    outer_div_full = f'  return (\n    {outer_div}\n'
    
    new_opening = f'''  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="{input_title}"
      inputContent={{<>
'''
    content = content.replace(outer_div_full, new_opening, 1)
    
    # Now adjust idx_result since content changed
    idx_result = content.find(result_start_marker)
    
    # Find the line start just before result_start_marker
    line_start = content.rfind('\n', 0, idx_result) + 1
    
    # Insert split
    split_str = '      </>\n      }\n      resultContent={<>\n'
    content = content[:line_start] + split_str + content[line_start:]
    
    # Close: replace the final </div>\n  );\n} with the FinanceLayout close
    # Find the LAST occurrence of closing pattern
    close_pat = '\n    </div>\n  );\n}'
    last_close = content.rfind(close_pat)
    if last_close == -1:
        # try with different indent
        close_pat = '\n  </div>\n  );\n}'
        last_close = content.rfind(close_pat)
    
    if last_close == -1:
        print(f"  ERROR in {fn_name}: closing div not found")
        # Still save what we have
        open(path, 'w', encoding='utf-8').write(content)
        return False
    
    new_close = '\n      </>\n    }\n    />\n  );\n}'
    content = content[:last_close] + new_close + content[last_close + len(close_pat):]
    
    open(path, 'w', encoding='utf-8').write(content)
    print(f"  ✅ {fn_name} patched")
    return True


errors = []

# 1. ReadingLevelCalculator - result starts at line ~171
ok = wrap(
    os.path.join(BASE, 'reading-level', 'ReadingLevelCalculator.tsx'),
    'ReadingLevelCalculator',
    'Your Text',
    '',  # not used
    '      {result && (',
)
if not ok: errors.append('ReadingLevelCalculator')

# 2. ACTScoreCalculator - result starts at line ~151
ok = wrap(
    os.path.join(BASE, 'act', 'ACTScoreCalculator.tsx'),
    'ACTScoreCalculator',
    'Your Scores',
    '',
    '      {result && (',
)
if not ok: errors.append('ACTScoreCalculator')

# 3. ClassRankCalculator - result starts at line ~278
ok = wrap(
    os.path.join(BASE, 'class-rank', 'ClassRankCalculator.tsx'),
    'ClassRankCalculator',
    'Your Standing',
    '',
    '      {result && (',
)
if not ok: errors.append('ClassRankCalculator')

# 4. TestScoreCalculator - result starts at line ~331
ok = wrap(
    os.path.join(BASE, 'test-score', 'TestScoreCalculator.tsx'),
    'TestScoreCalculator',
    'Your Test',
    '',
    '      {result && (',
)
if not ok: errors.append('TestScoreCalculator')

# 5. ScholarshipGPAPlanner - result starts at line ~287
ok = wrap(
    os.path.join(BASE, 'scholarship-gpa', 'ScholarshipGPAPlanner.tsx'),
    'ScholarshipGPAPlanner',
    'Your Profile',
    '',
    '      {results && (',
)
if not ok: errors.append('ScholarshipGPAPlanner')

# 6. StudySchedulePlanner - result starts at line ~441
ok = wrap(
    os.path.join(BASE, 'study-schedule', 'StudySchedulePlanner.tsx'),
    'StudySchedulePlanner',
    'Your Schedule',
    '',
    '      {results.length > 0 && (',
)
if not ok: errors.append('StudySchedulePlanner')

# 7. CumulativeGPACalculator - result block
ok = wrap(
    os.path.join(BASE, 'cumulative-gpa', 'CumulativeGPACalculator.tsx'),
    'CumulativeGPACalculator',
    'Your Semesters',
    '',
    '      {result && (',
)
if not ok: errors.append('CumulativeGPACalculator')

print(f"\nErrors: {errors if errors else 'None'}")
print("Script done.")
