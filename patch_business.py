import os, re

fpath = r'src\components\calculator-core\forms\BusinessForms.tsx'
content = open(fpath, encoding='utf-8').read()

# Find SharedComponents import and add FinanceLayout if not present
if 'FinanceLayout' not in content:
    # Add FinanceLayout after the last named import before SharedComponents
    content = re.sub(
        r"(from\s+['\"]./SharedComponents['\"];)",
        lambda m: m.group(0),
        content
    )
    # Find any } from './SharedComponents' and insert FinanceLayout before the closing }
    content = re.sub(
        r'} from ([\'"]./SharedComponents[\'"];)',
        r', FinanceLayout } from \1',
        content,
        count=1
    )

has_fl = 'FinanceLayout' in content
print(f'FinanceLayout in BusinessForms: {has_fl}')
open(fpath, 'w', encoding='utf-8').write(content)

# Also check for any CalcLayout usages
count = content.count('<CalcLayout ')
print(f'CalcLayout usages: {count}')
print('Done')
