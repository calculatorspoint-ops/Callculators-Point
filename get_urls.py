import glob
import re
import os

slugs = []
for f in glob.glob('src/data/categories/*.ts'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        found = re.findall(r"slug:\s*'([^']+)'", content)
        slugs.extend(found)

artifact_path = r'C:\Users\MK INNOVEXA\.gemini\antigravity\brain\fe5050ec-0b29-4bd2-a82a-4e061503102f\calculator_links.md'
with open(artifact_path, 'w', encoding='utf-8') as f:
    for slug in slugs:
        f.write(f"https://calculatorspoint.com/calculator/{slug}\n")
