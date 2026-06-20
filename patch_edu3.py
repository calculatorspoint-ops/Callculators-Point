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

def patch(path, outer_div_line, result_marker, input_title):
    content = open(path, encoding='utf-8').read()
    content = add_import(content)

    # Replace outer return div with FinanceLayout opening
    new_open = f"""  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="{input_title}"
      inputContent={{<>"""
    content = content.replace(outer_div_line, new_open, 1)

    # Find result block marker and insert split
    idx = content.find(result_marker)
    if idx == -1:
        print(f"  ERROR: marker not found in {path}")
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

# WeightedGradeCalculator
patch(
    os.path.join(BASE, 'weighted-grade', 'WeightedGradeCalculator.tsx'),
    "  return (\n    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>\n\n      {/* Header Controls */}",
    "      {/* Grade Result Card */}",
    "Your Categories",
)

# CollegeAdmissionEstimator
patch(
    os.path.join(BASE, 'college-admission', 'CollegeAdmissionEstimator.tsx'),
    "  return (\n    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>",
    "      {result && (",
    "Your Profile",
)

# GREScoreCalculator - main component return is at line 220
gre_path = os.path.join(BASE, 'gre', 'GREScoreCalculator.tsx')
gre_content = open(gre_path, encoding='utf-8').read()
gre_content = add_import(gre_content)
# main return outer div:
gre_outer = "  return (\n    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>"
gre_result_marker = "      {/* Results */}"
if gre_result_marker not in gre_content:
    # try alternate marker
    gre_result_marker = "      {/* ── Results"
if gre_result_marker not in gre_content:
    # find by line analysis
    lines = gre_content.splitlines()
    for i in range(250, len(lines)):
        if 'total' in lines[i].lower() and ('result' in lines[i].lower() or '{' in lines[i]):
            gre_result_marker = lines[i].strip()
            break
    print(f"  GRE result marker: {gre_result_marker!r}")

# Just do a manual replacement for GRE
new_open = """  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Scores"
      inputContent={<>"""
gre_content = gre_content.replace(gre_outer, new_open, 1)
# find where results section starts
# GRE: after the inputs, there's a big result section at line ~280
# Look for the total score display section
gre_split_candidates = [
    "      {/* Score Results */}",
    "      {/* Results */}",
    "      {/* ── Score */}",
    "      {/* Score Display */}",
]
split_found = False
for candidate in gre_split_candidates:
    if candidate in gre_content:
        idx = gre_content.find(candidate)
        line_start = gre_content.rfind('\n', 0, idx) + 1
        gre_content = gre_content[:line_start] + '      </>\n      }\n      resultContent={<>\n' + gre_content[line_start:]
        split_found = True
        print(f"  GRE split at: {candidate!r}")
        break

if not split_found:
    # Find lines ~280-300 in GRE - the score display section
    lines = gre_content.splitlines()
    # Look for the total score display which has large font
    for i in range(240, min(350, len(lines))):
        if 'Total Score' in lines[i] or 'total' in lines[i].lower() and 'fontSize: 6' in (lines[i] if i < len(lines) else ''):
            split_marker = lines[i].strip()
            print(f"  GRE fallback split at line {i+1}: {split_marker!r}")
            idx = gre_content.find(lines[i])
            line_start = gre_content.rfind('\n', 0, idx) + 1
            gre_content = gre_content[:line_start] + '      </>\n      }\n      resultContent={<>\n' + gre_content[line_start:]
            split_found = True
            break

if not split_found:
    print("  GRE: could not find split - manual fix needed")

# Close GRE
close_pat = '\n    </div>\n  );\n}'
last = gre_content.rfind(close_pat)
if last != -1:
    gre_content = gre_content[:last] + '\n      </>\n    }\n    />\n  );\n}' + gre_content[last+len(close_pat):]
open(gre_path, 'w', encoding='utf-8').write(gre_content)
print("  GRE saved (may need manual TSC check)")

print("\nAll done! Run: npx tsc --noEmit")
