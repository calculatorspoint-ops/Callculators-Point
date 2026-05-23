import fs from 'fs';
import path from 'path';

const formsDir = path.join(process.cwd(), 'src/components/calculator-core/forms');
const files = fs.readdirSync(formsDir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(formsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <ComingSoon ... /> with null
    content = content.replace(/<ComingSoon[^>]*\/>/g, "null");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ComingSoon in ' + file);
  }
});
