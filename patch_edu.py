"""
Patch all Batch 2 education calculator files to use FinanceLayout.
Strategy: read each file, find the return( block, split into inputContent/resultContent.
"""
import re, os, sys
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = r'c:\Users\MK INNOVEXA\Downloads\calcpoint-react\src\modules\education'
IMPORT_LINE = "import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';\n"

def add_import(content):
    """Add FinanceLayout import after the last existing import line."""
    if 'FinanceLayout' in content:
        return content  # already imported
    # Insert after last import statement
    lines = content.split('\n')
    last_import = 0
    for i, l in enumerate(lines):
        if l.strip().startswith('import '):
            last_import = i
    lines.insert(last_import + 1, IMPORT_LINE.rstrip())
    return '\n'.join(lines)

# CumulativeGPACalculator - split: inputs=lines 195-330, results=lines 331-553
print("Patching CumulativeGPACalculator...")
path = os.path.join(BASE, 'cumulative-gpa', 'CumulativeGPACalculator.tsx')
content = open(path, encoding='utf-8').read()
content = add_import(content)

OLD = '''  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Semester list ── */}'''

NEW = '''  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Semesters"
      inputContent={<>
      {/* ── Semester list ── */}'''

content = content.replace(OLD, NEW, 1)

# Find the split: after the add buttons closing div (line 330 area)
# The result section starts with: {/* ── Results ── */}
OLD2 = '''      {/* ── Informational note ── */}
      <div style={{
        padding: '14px',
        background: 'linear-gradient(135deg, var(--brand-l), var(--surface))',
        border: '1px solid var(--border)',
        borderRadius: 12,
      }}>'''

# Split before results block
SPLIT_MARKER = "      {result && ("
idx = content.find(SPLIT_MARKER)
if idx == -1:
    print("  ERROR: Could not find result block")
else:
    # Insert resultContent split
    content = content[:idx] + "      </>\n      }\n      resultContent={<>\n      " + content[idx:]
    # Close the resultContent before the final </div>
    # Find the last occurrence of closing the outer div
    OLD_END = "    </div>\n  );\n}"
    NEW_END = "      </>\n    }\n    />\n  );\n}"
    content = content[::-1].replace(OLD_END[::-1], NEW_END[::-1], 1)[::-1]
    print("  CumulativeGPA patched!")

open(path, 'w', encoding='utf-8').write(content)

print("Done!")
