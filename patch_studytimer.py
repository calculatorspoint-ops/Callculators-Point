import os
import re

path = r'src\modules\education\study-timer\StudyTimer.tsx'
os.system(f'git restore {path}')

content = open(path, encoding='utf-8').read()
content = "import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';\n" + content

# Find where export function StudyTimer() starts
fn_idx = content.find('export function StudyTimer()')
if fn_idx == -1: 
    print('Could not find function StudyTimer()')
    exit(1)

# Search for the return block starting from fn_idx
match = re.search(r'  return \(\n    <div[^>]*>', content[fn_idx:])
if match:
    outer_div_line = match.group(0)
    new_open = '''  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Timer Settings"
      inputContent={<>'''
    content = content[:fn_idx] + content[fn_idx:].replace(outer_div_line, new_open, 1)

    result_marker = '      {/* Circle Timer */}'
    idx = content.find(result_marker)
    if idx != -1:
        line_start = content.rfind('\n', 0, idx) + 1
        content = content[:line_start] + '      </>\n      }\n      resultContent={<>\n' + content[line_start:]
        
        close_pat = '\n    </div>\n  );\n}'
        last = content.rfind(close_pat)
        if last != -1:
            content = content[:last] + '\n      </>\n    }\n    />\n  );\n}' + content[last+len(close_pat):]
            open(path, 'w', encoding='utf-8').write(content)
            print('StudyTimer patched successfully.')
        else:
            print('Could not find close_pat.')
    else:
        print('Could not find result_marker.')
else:
    print('Could not find outer div return in StudyTimer.')
