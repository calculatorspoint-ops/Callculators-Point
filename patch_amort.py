import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = r'src\components\calculator-core\forms\FinanceFormsNew.tsx'
content = open(fpath, encoding='utf-8').read()
lines = content.splitlines(keepends=True)

print(f'Total lines before: {len(lines)}')

# Find the start of the orphaned block: 
# Look for "// -- TVM Finance Calculator" comment that we inserted 
# and delete everything from AFTER the correct AmortizationForm function end
# to BEFORE the TVMForm export function

# Find the correct end of AmortizationForm (the second `export function AmortizationForm`)
# by looking for the pattern we just introduced: the misplaced TVM comment inline in code
# and the actual TVMForm export

# Strategy: find the newly-inserted "// ── TVM Finance Calculator" comment
# that appears mid-file (inside JSX), and the actual "export function TVMForm" 
# that follows the orphaned block

# Find line numbers
tvm_comment_lines = [i for i, l in enumerate(lines) if '// ── TVM Finance Calculator' in l]
tvm_export_lines = [i for i, l in enumerate(lines) if 'export function TVMForm' in l]

print(f'TVM comment lines (1-indexed): {[i+1 for i in tvm_comment_lines]}')
print(f'TVMForm export lines (1-indexed): {[i+1 for i in tvm_export_lines]}')

# The orphaned block starts right after the AmortizationForm closing brace (line 2279)
# and ends at TVMForm export. Let's find it precisely.
# We inserted "// -- TVM Finance Calculator" as a marker after the correctly closed function.
# The orphaned content is between the marker and the actual TVMForm export.

if len(tvm_comment_lines) >= 1 and len(tvm_export_lines) >= 1:
    # The comment we inserted is the marker for where orphaned content starts
    # Find the FIRST TVMForm export that comes after the TVM comment
    marker_line = tvm_comment_lines[0]  # line index of the misplaced comment
    tvm_export_line = next((i for i in tvm_export_lines if i > marker_line), None)
    
    if tvm_export_line is not None:
        print(f'Orphaned block: lines {marker_line+2} to {tvm_export_line} (1-indexed)')
        # Remove lines from marker_line+1 (the blank line after comment) to tvm_export_line-1
        # Keep the comment line (which is the end of the correct AmortizationForm block)
        # Actually the comment is wrong -- it's inside code. Let's just delete from marker+1 to tvm_export_line-1
        orphan_start = marker_line  # 0-indexed: the line with the misplaced TVM comment
        orphan_end = tvm_export_line  # 0-indexed: the line with export function TVMForm
        
        print(f'Lines to delete: {orphan_start+1} to {orphan_end} inclusive')
        print(f'Line {orphan_start+1}: {lines[orphan_start].rstrip()[:80]}')
        print(f'Line {orphan_end+1}: {lines[orphan_end].rstrip()[:80]}')
        
        # Delete orphaned lines (keep the TVMForm export and everything after)
        new_lines = lines[:orphan_start] + ['\n'] + lines[orphan_end:]
        new_content = ''.join(new_lines)
        open(fpath, 'w', encoding='utf-8').write(new_content)
        print(f'Total lines after: {len(new_lines)}')
    else:
        print('ERROR: Could not find TVMForm export after TVM comment')
else:
    print(f'ERROR: markers not found. TVM comments: {tvm_comment_lines}, TVMForm exports: {tvm_export_lines}')
