import fs from 'fs';

function fix(filePath, replacer) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let oldContent = content;
    content = replacer(content);
    if (content !== oldContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed ' + filePath);
    }
  }
}

fix('app/tools/[slug]/page.tsx', c => c.replace(/SEO_LANDINGS/g, 'SEO_LANDING_PAGES'));
fix('src/components/calculator-core/CalculatorWidget.tsx', c => c.replace(/import\.meta\.env\..+/g, '"production"'));
fix('next.config.ts', c => c.replace(/import\('webpack'\)\.Compiler/g, 'any'));
