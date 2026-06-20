import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'src\modules\education'
IMPORT_LINE = "import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';"

def add_import(content):
    if 'FinanceLayout' in content:
        return content
    lines = content.split('\n')
    last_i = max((i for i, l in enumerate(lines) if l.startswith('import ')), default=0)
    lines.insert(last_i + 1, IMPORT_LINE)
    return '\n'.join(lines)

def patch(path, result_marker, input_title):
    try:
        content = open(path, encoding='utf-8').read()
    except Exception as e:
        print(f"Failed to read {path}: {e}")
        return False
        
    content = add_import(content)

    # Replace outer return div with FinanceLayout opening
    # We look for the first occurrence of:
    # return (
    #   <div ...
    # but we need to be careful not to match inner returns.
    
    # Let's find the main function return
    match = re.search(r'  return \(\n    <div[^>]*>', content)
    if not match:
        print(f"  ERROR: main return div not found in {path}")
        return False
    
    outer_div_line = match.group(0)
    
    new_open = f"""  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="{input_title}"
      inputContent={{<>"""
      
    content = content.replace(outer_div_line, new_open, 1)

    # Find result block marker and insert split
    idx = content.find(result_marker)
    if idx == -1:
        print(f"  ERROR: marker {result_marker!r} not found in {path}")
        return False
        
    line_start = content.rfind('\n', 0, idx) + 1
    content = content[:line_start] + '      </>\n      }\n      resultContent={<>\n' + content[line_start:]

    # Close the last outer div
    close_pat = '\n    </div>\n  );\n}'
    last = content.rfind(close_pat)
    if last == -1:
        close_pat = '\n  </div>\n  );\n}'
        last = content.rfind(close_pat)
        
    if last == -1:
        print(f"  ERROR: close not found in {path}")
        open(path, 'w', encoding='utf-8').write(content)
        return False
        
    content = content[:last] + '\n      </>\n    }\n    />\n  );\n}' + content[last+len(close_pat):]
    open(path, 'w', encoding='utf-8').write(content)
    print(f"  Patched: {os.path.basename(path)}")
    return True

files_to_patch = [
    (os.path.join(BASE, 'sat', 'SATScoreCalculator.tsx'), "      {/* Total Score Result */}", "Your Scores"),
    (os.path.join(BASE, 'required-grade', 'RequiredGradeCalculator.tsx'), "      {/* Results */}", "Your Situation"),
    (os.path.join(BASE, 'gmat', 'GMATScoreCalculator.tsx'), "      {/* Total Score Result */}", "Your Scores"),
    (os.path.join(BASE, 'study-timer', 'StudyTimer.tsx'), "      {/* Circle Timer */}", "Timer Settings"),
    (os.path.join(BASE, 'toefl', 'TOEFLScoreCalculator.tsx'), "      {/* Total Score Result */}", "Your Scores"),
    (os.path.join(BASE, 'assignment-grade', 'AssignmentGradeCalculator.tsx'), "      {/* ── Result card", "Your Assignments"),
]

for p, m, t in files_to_patch:
    patch(p, m, t)

print("\nDone patching!")
