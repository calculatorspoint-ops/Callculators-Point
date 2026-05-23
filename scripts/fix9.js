import fs from 'fs';
import path from 'path';

const registriesDir = path.join(process.cwd(), 'src/components/calculator-core/registries');
const files = fs.readdirSync(registriesDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(registriesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to replace: ({ default: m.ComponentName }))
    // With: ({ default: m.ComponentName || (() => null) }))
    
    // Regex matches `{ default: m.SomeName }`
    content = content.replace(/\{\s*default:\s*m\.([A-Za-z0-9_]+)\s*\}/g, "{ default: m.$1 || (() => null) }");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched lazy loading in ' + file);
  }
});
