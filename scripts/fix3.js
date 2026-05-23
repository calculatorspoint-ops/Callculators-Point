import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes("'")) {
    content = content.replace(/\'/g, "'");
    changed = true;
  }
  if (content.includes(".tsx\"")) {
    content = content.replace(/\"/g, '"');
    changed = true;
  }

  if (file.endsWith('Calculator')) {
    if (content.includes("calc.status === 'beta'")) {
      content = content.replace(/calc\.status === 'beta'/g, "false");
      changed = true;
    }
    if (content.includes("calc.status === 'deprecated'")) {
      content = content.replace(/calc\.status === 'deprecated'/g, "false");
      changed = true;
    }
  }

  if (file.endsWith('page') && file.includes('tools')) {
    if (content.includes("ALL_LANDINGS")) {
      content = content.replace(/ALL_LANDINGS/g, "SEO_LANDINGS");
      changed = true;
    }
  }

  if (file.endsWith('next.config.ts')) {
    if (content.includes("import type { webpack }")) {
      content = content.replace(/import type \{ webpack \}[^\n]*\n/, "");
      changed = true;
    }
  }

  if (file.endsWith('CalculatorWidget')) {
    if (content.includes("process.env.NEXT_PUBLIC_APP_ENV")) {
      content = content.replace(/import\.meta\.env\.VITE_APP_ENV/g, "process.env.NODE_ENV");
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + file);
  }
});
