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
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
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
  
  if (content.includes("(process.env.NODE_ENV !== 'production')")) {
    content = content.replace(/import\.meta\.env\.DEV/g, "(process.env.NODE_ENV !== 'production')");
    changed = true;
  }
  if (content.includes("(process.env.NODE_ENV === 'production')")) {
    content = content.replace(/import\.meta\.env\.PROD/g, "(process.env.NODE_ENV === 'production')");
    changed = true;
  }
  if (content.includes("process.env.VITE_")) {
    // Replace process.env.NEXT_PUBLIC_FOO with process.env.NEXT_PUBLIC_FOO
    content = content.replace(/import\.meta\.env\.VITE_([A-Za-z0-9_]+)/g, "process.env.NEXT_PUBLIC_$1");
    changed = true;
  }
  if (content.includes("import.meta.env.")) {
    // Catch-all for any other import.meta.env
    content = content.replace(/import\.meta\.env\.([A-Za-z0-9_]+)/g, "process.env.$1");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed import.meta.env in ' + file);
  }
});
