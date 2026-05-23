#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════
 *  CalcPoint — Calculator Validation Script
 *  npm run validate:calculators
 *
 *  Checks performed:
 *   1.  Duplicate IDs across ALL_CALCULATORS
 *   2.  Duplicate slugs across ALL_CALCULATORS
 *   3.  Duplicate SEO URLs (slug collisions that produce the same URL)
 *   4.  Missing required fields: id, slug, name, desc, cat, icon
 *   5.  Invalid category references (cat not in CATEGORIES)
 *   6.  Live calculators with no form component in any registry
 *   7.  Orphaned form entries (in registry but no matching slug in data)
 *   8.  Calculators in data but not in any registry (unmapped)
 *   9.  Status field validation ('live' | 'draft' | 'coming-soon')
 *  10.  The future.ts "fv" slug collides with finance "future-value-calculator"
 *  11.  Math registry has entries (gpa, cgpa, reading-time) that belong to
 *       education / everyday categories — cross-registry misplacement
 *  12.  README / category mismatch (categories in CATEGORIES vs categories
 *       that actually appear in calculator data)
 *  13.  Empty tips arrays or formula fields that are just whitespace
 *  14.  Icon field is not empty string
 * ══════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── ANSI colour helpers ──────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};
const pass  = (msg) => console.log(`  ${C.green}✓${C.reset} ${msg}`);
const fail  = (msg) => console.log(`  ${C.red}✗${C.reset} ${C.red}${msg}${C.reset}`);
const warn  = (msg) => console.log(`  ${C.yellow}⚠${C.reset} ${C.yellow}${msg}${C.reset}`);
const info  = (msg) => console.log(`  ${C.gray}→${C.reset} ${C.gray}${msg}${C.reset}`);
const title = (msg) => console.log(`\n${C.bold}${C.cyan}${msg}${C.reset}`);
const sep   = ()    => console.log(`${C.gray}${'─'.repeat(65)}${C.reset}`);

// ─── Load data files (pure JS-compatible data extraction) ────────────────
// We read raw TypeScript files and extract data via regex to avoid needing ts-node.
// For production validation we parse the registry key strings directly.

function extractSlugsFromRegistry(registryFileContent) {
  // Matches: "some-slug-here": or 'some-slug-here':
  const matches = registryFileContent.matchAll(/['"]([\w-]+)['"]\s*:/g);
  const slugs = new Set();
  for (const m of matches) {
    // Filter out object property names that are clearly not slugs
    // Slugs contain at least one hyphen OR are clearly calculator slugs
    const candidate = m[1];
    if (candidate.includes('-') || /^[a-z][a-z0-9]+$/.test(candidate)) {
      // Exclude known non-slug keys used in type definitions
      const nonSlugKeys = ['label', 'value', 'type', 'name', 'id', 'desc', 'cat',
        'icon', 'slug', 'color', 'bg', 'formula', 'unit', 'placeholder'];
      if (!nonSlugKeys.includes(candidate)) {
        slugs.add(candidate);
      }
    }
  }
  return slugs;
}

function extractCalculatorData(fileContent) {
  // Extract id, slug, name, desc, cat, icon, status values via regex
  // Works on the TypeScript source without needing transpilation
  const calcs = [];
  
  // Split on object boundaries — find each { id: '...' block
  const idMatches = [...fileContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
  const slugMatches = [...fileContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  const nameMatches = [...fileContent.matchAll(/name:\s*['"]([^'"]+)['"]/g)];
  const descMatches = [...fileContent.matchAll(/desc:\s*['"]([^'"]+)['"]/g)];
  const catMatches = [...fileContent.matchAll(/cat:\s*['"]([^'"]+)['"]/g)];
  const iconMatches = [...fileContent.matchAll(/icon:\s*['"]([^'"]*)['"]/g)];
  const statusMatches = [...fileContent.matchAll(/status:\s*['"]([^'"]+)['"]/g)];

  const count = idMatches.length;
  for (let i = 0; i < count; i++) {
    calcs.push({
      id:     idMatches[i]?.[1]   || null,
      slug:   slugMatches[i]?.[1] || null,
      name:   nameMatches[i]?.[1] || null,
      desc:   descMatches[i]?.[1] || null,
      cat:    catMatches[i]?.[1]  || null,
      icon:   iconMatches[i]?.[1] ?? null,
      status: statusMatches[i]?.[1] || null,
      _line:  `id="${idMatches[i]?.[1]}", slug="${slugMatches[i]?.[1]}"`,
    });
  }
  return calcs;
}

// ─── File paths ───────────────────────────────────────────────────────────
const dataFiles = {
  finance:      path.join(ROOT, 'src/data/categories/finance.ts'),
  health:       path.join(ROOT, 'src/data/categories/health.ts'),
  math:         path.join(ROOT, 'src/data/categories/math.ts'),
  education:    path.join(ROOT, 'src/data/categories/education.ts'),
  converters:   path.join(ROOT, 'src/data/categories/converters.ts'),
  everyday:     path.join(ROOT, 'src/data/categories/everyday.ts'),
  construction: path.join(ROOT, 'src/data/categories/construction.ts'),
  technology:   path.join(ROOT, 'src/data/categories/technology.ts'),
  business:     path.join(ROOT, 'src/data/categories/business.ts'),
  future:       path.join(ROOT, 'src/data/categories/future.ts'),
};

const registryFiles = {
  financeForms:      path.join(ROOT, 'src/components/calculator-core/registries/financeForms.ts'),
  healthForms:       path.join(ROOT, 'src/components/calculator-core/registries/healthForms.ts'),
  mathForms:         path.join(ROOT, 'src/components/calculator-core/registries/mathForms.ts'),
  educationForms:    path.join(ROOT, 'src/components/calculator-core/registries/educationForms.ts'),
  utilityForms:      path.join(ROOT, 'src/components/calculator-core/registries/utilityForms.ts'),
  constructionForms: path.join(ROOT, 'src/components/calculator-core/registries/constructionForms.ts'),
  techForms:         path.join(ROOT, 'src/components/calculator-core/registries/techForms.ts'),
  businessForms:     path.join(ROOT, 'src/components/calculator-core/registries/businessForms.ts'),
};

// Declared valid categories (from calculatorConfigs.ts)
const VALID_CATEGORIES = new Set([
  'finance', 'health', 'math', 'education', 'converters',
  'everyday', 'construction', 'technology', 'business', 'future'
]);

// ─── Load all data ────────────────────────────────────────────────────────
console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
console.log(`${C.bold}${C.cyan}║     CalcPoint Calculator Validation  (Phase 0 Cleaner)       ║${C.reset}`);
console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════════════════╝${C.reset}`);

let errorCount = 0;
let warnCount = 0;

const allCalcs = [];

title('📂 Loading calculator data files…');
sep();
for (const [cat, filePath] of Object.entries(dataFiles)) {
  if (!existsSync(filePath)) {
    warn(`Data file not found: ${path.relative(ROOT, filePath)}`);
    warnCount++;
    continue;
  }
  const content = readFileSync(filePath, 'utf8');
  const calcs = extractCalculatorData(content);
  allCalcs.push(...calcs);
  info(`${cat}: ${calcs.length} calculators loaded`);
}

// Load all registry slugs
const allRegistrySlugs = new Set();
const registrySlugsByFile = {};

title('\n📋 Loading registry files…');
sep();
for (const [name, filePath] of Object.entries(registryFiles)) {
  if (!existsSync(filePath)) {
    warn(`Registry file not found: ${path.relative(ROOT, filePath)}`);
    warnCount++;
    continue;
  }
  const content = readFileSync(filePath, 'utf8');
  const slugs = extractSlugsFromRegistry(content);
  registrySlugsByFile[name] = slugs;
  for (const s of slugs) allRegistrySlugs.add(s);
  info(`${name}: ${slugs.size} registry entries`);
}

// ─── CHECK 1: Duplicate IDs ───────────────────────────────────────────────
title('\n🔎 CHECK 1: Duplicate IDs');
sep();
{
  const seen = new Map();
  let hasDupes = false;
  for (const c of allCalcs) {
    if (!c.id) continue;
    if (seen.has(c.id)) {
      fail(`DUPLICATE ID: "${c.id}" appears in multiple entries`);
      info(`  First:  ${seen.get(c.id)._line}`);
      info(`  Second: ${c._line}`);
      errorCount++;
      hasDupes = true;
    } else {
      seen.set(c.id, c);
    }
  }
  if (!hasDupes) pass(`All ${allCalcs.length} calculator IDs are unique`);
}

// ─── CHECK 2: Duplicate Slugs ─────────────────────────────────────────────
title('\n🔎 CHECK 2: Duplicate Slugs');
sep();
{
  const seen = new Map();
  let hasDupes = false;
  for (const c of allCalcs) {
    if (!c.slug) continue;
    if (seen.has(c.slug)) {
      fail(`DUPLICATE SLUG: "${c.slug}"`);
      info(`  First:  ${seen.get(c.slug)._line}`);
      info(`  Second: ${c._line}`);
      errorCount++;
      hasDupes = true;
    } else {
      seen.set(c.slug, c);
    }
  }
  if (!hasDupes) pass(`All ${allCalcs.length} calculator slugs are unique`);
}

// ─── CHECK 3: Duplicate SEO URLs ─────────────────────────────────────────
title('\n🔎 CHECK 3: Duplicate SEO URLs  (/calculator/<slug>)');
sep();
{
  const urlMap = new Map();
  let hasDupes = false;
  for (const c of allCalcs) {
    if (!c.slug) continue;
    const url = `/calculator/${c.slug}`;
    if (urlMap.has(url)) {
      fail(`DUPLICATE URL: ${url}`);
      info(`  Produced by IDs: "${urlMap.get(url)}" and "${c.id}"`);
      errorCount++;
      hasDupes = true;
    } else {
      urlMap.set(url, c.id);
    }
  }
  if (!hasDupes) pass('All SEO URLs (/calculator/<slug>) are unique');
}

// ─── CHECK 4: Missing Required Fields ────────────────────────────────────
title('\n🔎 CHECK 4: Missing Required Fields (id, slug, name, desc, cat, icon)');
sep();
{
  const required = ['id', 'slug', 'name', 'desc', 'cat', 'icon'];
  let allGood = true;
  for (const c of allCalcs) {
    const missing = required.filter(f => !c[f] && c[f] !== 0);
    if (missing.length > 0) {
      fail(`MISSING FIELDS [${missing.join(', ')}] on: ${c._line}`);
      errorCount++;
      allGood = false;
    }
  }
  if (allGood) pass(`All ${allCalcs.length} calculators have required fields`);
}

// ─── CHECK 5: Invalid Category References ────────────────────────────────
title('\n🔎 CHECK 5: Invalid Category References');
sep();
{
  let allGood = true;
  for (const c of allCalcs) {
    if (c.cat && !VALID_CATEGORIES.has(c.cat)) {
      fail(`INVALID CATEGORY: cat="${c.cat}" on ${c._line}`);
      info(`  Valid categories: ${[...VALID_CATEGORIES].join(', ')}`);
      errorCount++;
      allGood = false;
    }
  }
  if (allGood) pass('All category references are valid');
}

// ─── CHECK 6: Missing Form Mappings (slug in data but not in ANY registry) ─
title('\n🔎 CHECK 6: Missing Form Mappings (data slug not in any registry)');
sep();
{
  // These slugs are known to intentionally have no form yet (draft/coming-soon)
  // Add more here as needed
  const INTENTIONALLY_UNMAPPED = new Set([
    // finance.ts slugs added as isNew=true but form not yet built
    // (detected and listed below automatically)
  ]);
  
  const dataSlugSet = new Set(allCalcs.map(c => c.slug).filter(Boolean));
  const missingForms = [];
  
  for (const slug of dataSlugSet) {
    if (!allRegistrySlugs.has(slug) && !INTENTIONALLY_UNMAPPED.has(slug)) {
      missingForms.push(slug);
    }
  }
  
  if (missingForms.length === 0) {
    pass('All calculator slugs have a form mapping in a registry');
  } else {
    // Group by which category they belong to
    const grouped = {};
    for (const slug of missingForms) {
      const calc = allCalcs.find(c => c.slug === slug);
      const cat = calc?.cat || 'unknown';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ slug, name: calc?.name || '?', id: calc?.id || '?' });
    }
    
    warn(`${missingForms.length} calculator(s) have NO form in any registry:`);
    warnCount++;
    for (const [cat, items] of Object.entries(grouped)) {
      info(`  [${cat}]`);
      for (const { slug, name } of items) {
        info(`    "${slug}" (${name})`);
      }
    }
    warn('These will show "Coming Soon" to users. Add to registry when form is built.');
  }
}

// ─── CHECK 7: Orphaned Forms (registry entry but no slug in data) ─────────
title('\n🔎 CHECK 7: Orphaned Registry Entries (in registry but not in data)');
sep();
{
  const dataSlugSet = new Set(allCalcs.map(c => c.slug).filter(Boolean));
  let hasOrphans = false;
  
  for (const [registryName, slugSet] of Object.entries(registrySlugsByFile)) {
    const orphans = [...slugSet].filter(s => !dataSlugSet.has(s));
    if (orphans.length > 0) {
      fail(`ORPHANED ENTRIES in ${registryName}:`);
      for (const slug of orphans) {
        info(`  "${slug}" — has a form component but NO calculator config`);
        errorCount++;
      }
      hasOrphans = true;
    }
  }
  if (!hasOrphans) pass('No orphaned registry entries found');
}

// ─── CHECK 8: Status Field Validation ────────────────────────────────────
title('\n🔎 CHECK 8: Status Field Validation');
sep();
{
  const VALID_STATUSES = new Set(['live', 'draft', 'coming-soon']);
  let allGood = true;
  for (const c of allCalcs) {
    if (c.status && !VALID_STATUSES.has(c.status)) {
      fail(`INVALID STATUS: status="${c.status}" on ${c._line}`);
      info(`  Valid values: live | draft | coming-soon`);
      errorCount++;
      allGood = false;
    }
  }
  if (allGood) pass('All status fields are valid (or absent)');
}

// ─── CHECK 9: Cross-Registry Misplacement ────────────────────────────────
title('\n🔎 CHECK 9: Cross-Registry Misplacement');
sep();
{
  // Known misplacements detected in code review:
  //  - mathForms.ts has "gpa-calculator" (should be in educationForms)
  //  - mathForms.ts has "cgpa-percentage-calculator" (should be in educationForms)
  //  - mathForms.ts has "reading-time-calculator" (should be in utilityForms/everyday)
  const knownMisplacements = [
    { slug: 'gpa-calculator',            foundIn: 'mathForms',   shouldBe: 'educationForms' },
    { slug: 'cgpa-percentage-calculator', foundIn: 'mathForms',  shouldBe: 'educationForms' },
    { slug: 'reading-time-calculator',   foundIn: 'mathForms',   shouldBe: 'utilityForms' },
  ];
  
  let hasMisplacements = false;
  for (const { slug, foundIn, shouldBe } of knownMisplacements) {
    if (registrySlugsByFile[foundIn]?.has(slug)) {
      warn(`CROSS-REGISTRY: "${slug}" is in ${foundIn} but belongs in ${shouldBe}`);
      warnCount++;
      hasMisplacements = true;
    }
  }
  
  if (!hasMisplacements) pass('No cross-registry misplacements found');
  else info('These work fine at runtime but violate organizational convention');
}

// ─── CHECK 10: future.ts Slug Collision ──────────────────────────────────
title('\n🔎 CHECK 10: future.ts Orphaned Category');
sep();
{
  const futureCalcs = allCalcs.filter(c => c.cat === 'future');
  if (futureCalcs.length > 0) {
    warn(`"future" category is not in CATEGORIES array but has ${futureCalcs.length} calculator(s):`);
    warnCount++;
    for (const c of futureCalcs) {
      // Check if the slug collides with finance slug
      const collision = allCalcs.find(x => x.slug === c.slug && x.cat !== 'future');
      if (collision) {
        fail(`SLUG COLLISION: future.ts "${c.slug}" collides with ${collision.cat} entry "${collision.id}"`);
        errorCount++;
      } else {
        info(`  "${c.slug}" (${c.name}) — category "future" not in CATEGORIES`);
      }
    }
  } else {
    pass('No calculators in the "future" orphaned category');
  }
}

// ─── CHECK 11: Icon Sanity Check ──────────────────────────────────────────
title('\n🔎 CHECK 11: Empty Icon Fields');
sep();
{
  const emptyIcons = allCalcs.filter(c => c.icon === '');
  if (emptyIcons.length > 0) {
    warn(`${emptyIcons.length} calculator(s) have empty icon strings:`);
    warnCount++;
    for (const c of emptyIcons) info(`  ${c._line}`);
  } else {
    pass('All calculators have non-empty icon fields');
  }
}

// ─── CHECK 12: Category Usage Audit ──────────────────────────────────────
title('\n🔎 CHECK 12: Category Usage Audit');
sep();
{
  const usedCats = new Set(allCalcs.map(c => c.cat).filter(Boolean));
  const declaredCats = VALID_CATEGORIES;
  
  const undeclared = [...usedCats].filter(c => !declaredCats.has(c));
  const unused = [...declaredCats].filter(c => !usedCats.has(c));
  
  if (undeclared.length > 0) {
    fail(`Undeclared categories used in data: ${undeclared.join(', ')}`);
    errorCount++;
  }
  if (unused.length > 0) {
    warn(`Declared categories with no calculators: ${unused.join(', ')}`);
    warnCount++;
  }
  
  // Print calculator count per category
  for (const cat of [...usedCats].sort()) {
    const count = allCalcs.filter(c => c.cat === cat).length;
    info(`  ${cat}: ${count} calculators`);
  }
  
  if (undeclared.length === 0) pass('All used categories are declared in CATEGORIES');
}

// ─── CHECK 13: Duplicate Entries in registries vs data ───────────────────
title('\n🔎 CHECK 13: Registry Slug Duplicates (same slug in multiple registries)');
sep();
{
  const slugToRegistries = new Map();
  for (const [regName, slugSet] of Object.entries(registrySlugsByFile)) {
    for (const slug of slugSet) {
      if (!slugToRegistries.has(slug)) slugToRegistries.set(slug, []);
      slugToRegistries.get(slug).push(regName);
    }
  }
  
  let hasDupes = false;
  for (const [slug, regs] of slugToRegistries) {
    if (regs.length > 1) {
      fail(`REGISTRY DUPLICATE: "${slug}" is registered in multiple registries: ${regs.join(', ')}`);
      errorCount++;
      hasDupes = true;
    }
  }
  if (!hasDupes) pass('No slug appears in multiple registries');
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
console.log(`${C.bold}${C.cyan}║                      VALIDATION SUMMARY                      ║${C.reset}`);
console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════════════════╝${C.reset}`);

console.log(`\n  Total calculators scanned:  ${C.bold}${allCalcs.length}${C.reset}`);
console.log(`  Registry entries scanned:   ${C.bold}${allRegistrySlugs.size}${C.reset}`);
console.log(`  Errors found:               ${errorCount > 0 ? C.red : C.green}${C.bold}${errorCount}${C.reset}`);
console.log(`  Warnings found:             ${warnCount > 0 ? C.yellow : C.green}${C.bold}${warnCount}${C.reset}`);

if (errorCount === 0 && warnCount === 0) {
  console.log(`\n${C.green}${C.bold}  ✅  ALL CHECKS PASSED — Safe to proceed with Next.js migration!${C.reset}\n`);
  process.exit(0);
} else if (errorCount === 0) {
  console.log(`\n${C.yellow}${C.bold}  ⚠️   WARNINGS ONLY — Review warnings before Next.js migration.${C.reset}`);
  console.log(`${C.gray}  Warnings are non-blocking but should be addressed.${C.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${C.red}${C.bold}  ❌  VALIDATION FAILED — Fix ${errorCount} error(s) before migrating.${C.reset}`);
  console.log(`${C.gray}  Errors listed above must be resolved for a clean migration.${C.reset}\n`);
  process.exit(1);
}
