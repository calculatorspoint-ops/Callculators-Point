import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = r'src\components\calculator-core\forms\ConstructionForms.tsx'
content = open(fpath, encoding='utf-8').read()

# Fix 1: Remove double ); -> replace );); with );
content = content.replace('););', ');')
print(f'Fixed );); occurrences')

# Fix 2: Remove orphaned </div> that appears right before </> } /> pattern
# Pattern: the original outer <div> closing tag was left in the inputContent
# It looks like:    </div>
#                   </>}
# where </div> is at the end of the inputContent (the closing of the styled input card)
# but the outer <div> wrapper was removed. The styled inner card div is fine.
# Actually the issue is different: the inputContent includes:
#   [inputs]
#   </div>   <- from the styled input card (correct)
# but AFTER the styled card, there was {res && <Panel/>} which is now removed.
# So the </div> is correct, it closes the styled input card.

# Let's just verify no double );
print('Double ); remaining:', content.count('););'))
print('Lines:', len(content.splitlines()))

open(fpath, 'w', encoding='utf-8').write(content)
print('Done.')
