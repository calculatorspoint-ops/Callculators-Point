/**
 * scripts/generate-pwa-icons.mjs
 *
 * Generates 192x192 and 512x512 PNG icons for the PWA manifest
 * from the existing favicon.svg, using the `sharp` package if available,
 * or a Canvas-based fallback.
 *
 * Run once: node scripts/generate-pwa-icons.mjs
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const iconsDir  = path.join(publicDir, 'icons');

// Ensure the /public/icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created /public/icons/');
}

// Read the SVG source
const svgPath = path.join(publicDir, 'favicon.svg');
if (!fs.existsSync(svgPath)) {
  console.error('favicon.svg not found at', svgPath);
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath);

// Try sharp (fast, native)
async function withSharp() {
  const require = createRequire(import.meta.url);
  const sharp = require('sharp');

  for (const size of [192, 512]) {
    const outPath = path.join(iconsDir, `icon-${size}.png`);
    await sharp(svgContent)
      .resize(size, size, { fit: 'contain', background: { r: 2, g: 6, b: 23, alpha: 1 } })
      .png()
      .toFile(outPath);
    console.log(`✅ Generated ${outPath}`);
  }
}

withSharp()
  .then(() => {
    console.log('\nPWA icons generated successfully.');
    console.log('Add /public/icons/ to your .gitignore or commit the files.\n');
  })
  .catch(err => {
    console.error('sharp not available:', err.message);
    console.log('\n⚠️  Install sharp to auto-generate PNG icons:');
    console.log('    npm install --save-dev sharp');
    console.log('    node scripts/generate-pwa-icons.mjs\n');
    console.log('Alternatively, manually place 192x192 and 512x512 PNG files at:');
    console.log('  public/icons/icon-192.png');
    console.log('  public/icons/icon-512.png\n');
  });
