const fs = require('fs');

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

// 1. ExportToolbar prop in calculator-client.tsx
fix('app/calculator/[slug]/calculator-client.tsx', content => {
  return content.replace(/<ExportToolbar calc=\{calc\} \/>/g, '<ExportToolbar filenamePrefix={calc.name} />');
});

// 2. .tsx imports in all registries
const registries = fs.readdirSync('src/components/calculator-core/registries');
for (const file of registries) {
  if (file.endsWith('.ts')) {
    fix('src/components/calculator-core/registries/' + file, content => {
      return content.replace(/\.tsx'/g, "'");
    });
  }
}

// 3. Calculator.tsx
fix('src/views/Calculator.tsx', content => {
  let c = content;
  c = c.replace(/\.tsx'/g, "'");
  return c;
});

// 4. import.meta.env
fix('src/components/calculator-core/CalculatorWidget.tsx', content => {
  return content.replace(/import\.meta\.env\.VITE_APP_ENV/g, "process.env.NODE_ENV");
});
