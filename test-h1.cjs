const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '.next', 'server', 'app', 'calculator');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let missing = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (!content.includes('<h1')) {
    missing++;
    console.log(`Missing H1 in ${file}`);
  }
}
console.log(`Total HTML files: ${files.length}`);
console.log(`Files missing H1: ${missing}`);
