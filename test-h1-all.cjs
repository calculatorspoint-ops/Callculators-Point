const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.html')) results.push(file);
    }
  });
  return results;
}

const dir = path.join(__dirname, '.next', 'server', 'app');
const files = walk(dir);

let missing = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<h1')) {
    missing++;
    console.log(`Missing H1: ${file}`);
  }
}
console.log(`Total HTML files: ${files.length}`);
console.log(`Files missing H1: ${missing}`);
