'use client';
import { useState, useCallback } from 'react';
import { babyNames, type BabyName } from '@/data/name-generators/baby-names';
import { islamicNames, type IslamicName } from '@/data/name-generators/islamic-names';
import { businessPrefixes, businessSuffixes, businessStandalones } from '@/data/name-generators/business-prefixes';
import { brandWords } from '@/data/name-generators/brand-words';
import { youtubeTemplates, videoIdeas } from '@/data/name-generators/youtube-templates';
import { instagramTemplates, bioSuggestions, hashtagSuggestions } from '@/data/name-generators/instagram-templates';
import { domainPrefixes, domainSuffixes } from '@/data/name-generators/domain-words';
import { appPrefixes, appSuffixes } from '@/data/name-generators/app-words';

export interface GeneratedName {
  id: string;
  name: string;
  meaning?: string;
  tagline?: string;
  description?: string;
  origin?: string;
  pronunciation?: string;
  arabicSpelling?: string;
  meaningUr?: string;
  isQuranic?: boolean;
  isSahaba?: boolean;
  similarNames?: string[];
  domainSuggestion?: string;
  socialHandle?: string;
  colorPalette?: string[];
  logoDirection?: string;
  videoIdeas?: string[];
  bioSuggestion?: string;
  hashtagSuggestions?: string[];
  category?: string;
  style?: string;
  extension?: string;
}

export interface GeneratorFilters {
  keyword?: string;
  gender?: string;
  origin?: string;
  startLetter?: string;
  length?: string;
  style?: string;
  industry?: string;
  tone?: string;
  niche?: string;
  extension?: string;
  isQuranic?: boolean;
  isSahaba?: boolean;
  shortOnly?: boolean;
  noNumbers?: boolean;
  addDots?: boolean;
  addUnderscores?: boolean;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Color palettes for brand/app
const colorPalettes: Record<string, string[]> = {
  Premium: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
  Minimal: ['#ffffff', '#f8f9fa', '#dee2e6', '#343a40'],
  Bold: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec'],
  Fun: ['#06d6a0', '#118ab2', '#ffd166', '#ef476f'],
  Corporate: ['#003049', '#d62828', '#f77f00', '#fcbf49'],
  Futuristic: ['#7400b8', '#6930c3', '#5e60ce', '#48bfe3'],
  Elegant: ['#f8f0e3', '#eadbc8', '#dac0a3', '#102c57'],
  Modern: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
};

const logoDirections: Record<string, string> = {
  Premium: 'Serif wordmark with gold accent, minimal iconography',
  Minimal: 'Clean sans-serif, single-color logomark, lots of whitespace',
  Bold: 'Strong geometric icon, bold condensed typeface',
  Fun: 'Playful rounded letters, vibrant gradient icon',
  Corporate: 'Shield or abstract mark, professional sans-serif',
  Futuristic: 'Geometric abstract icon, monospace-inspired typeface',
  Elegant: 'Script lettering with refined flourish, muted tones',
  Modern: 'Flat design icon, clean geometric typeface',
};

const taglineTemplates: Record<string, string[]> = {
  Professional: ['Excellence in every detail', 'Your trusted partner', 'Built for success'],
  Luxury: ['Where excellence meets elegance', 'The finest choice', 'Crafted for the discerning'],
  Modern: ['Shaping the future', 'Built for tomorrow', 'Innovation at its core'],
  Creative: ['Imagination unleashed', 'Ideas that inspire', 'Creativity without limits'],
  Friendly: ['Here for you', 'Friendly, fast, and reliable', 'Your neighborhood experts'],
  Local: ['Proudly serving your community', 'Local expertise, global standards'],
  Corporate: ['Driving business forward', 'Strategic excellence', 'Results that matter'],
  Fun: ['Life is better with us', 'Smile guaranteed', 'Fun is our business'],
  Minimal: ['Simple. Powerful.', 'Less, but better', 'Clarity above all'],
};

function getTagline(tone: string, _name: string): string {
  const templates = taglineTemplates[tone] || taglineTemplates.Modern;
  return templates[Math.floor(Math.random() * templates.length)];
}

function toDomainSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
}

// ─── BABY NAME GENERATOR ────────────────────────────────────────────────────
function generateBabyNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  let pool = [...babyNames];

  if (filters.gender && filters.gender !== 'all') {
    pool = pool.filter(n => n.gender === filters.gender || n.gender === 'unisex');
  }
  if (filters.origin && filters.origin !== 'all') {
    pool = pool.filter(n => n.origin === filters.origin);
  }
  if (filters.startLetter && filters.startLetter !== 'all') {
    pool = pool.filter(n => n.name.toLowerCase().startsWith(filters.startLetter!.toLowerCase()));
  }
  if (filters.length && filters.length !== 'all') {
    pool = pool.filter(n => n.length === filters.length);
  }
  if (filters.style && filters.style !== 'all') {
    pool = pool.filter(n => n.style === filters.style);
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    const filtered = pool.filter(n =>
      n.name.toLowerCase().includes(kw) ||
      n.meaning.toLowerCase().includes(kw)
    );
    if (filtered.length > 0) pool = filtered;
  }

  return shuffle(pool).slice(0, count).map((n: BabyName) => ({
    id: generateId(),
    name: n.name,
    meaning: n.meaning,
    origin: n.origin,
    pronunciation: n.pronunciation,
    similarNames: n.similarNames,
    category: n.gender,
    style: n.style,
  }));
}

// ─── ISLAMIC NAME GENERATOR ──────────────────────────────────────────────────
function generateIslamicNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  let pool = [...islamicNames];

  if (filters.gender && filters.gender !== 'all') {
    pool = pool.filter(n => n.gender === filters.gender);
  }
  if (filters.isQuranic) {
    pool = pool.filter(n => n.isQuranic);
  }
  if (filters.isSahaba) {
    pool = pool.filter(n => n.isSahaba);
  }
  if (filters.startLetter && filters.startLetter !== 'all') {
    pool = pool.filter(n => n.name.toLowerCase().startsWith(filters.startLetter!.toLowerCase()));
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    const filtered = pool.filter(n =>
      n.name.toLowerCase().includes(kw) ||
      n.meaningEn.toLowerCase().includes(kw) ||
      n.meaningUr.toLowerCase().includes(kw)
    );
    if (filtered.length > 0) pool = filtered;
  }

  return shuffle(pool).slice(0, count).map((n: IslamicName) => ({
    id: generateId(),
    name: n.name,
    arabicSpelling: n.arabicSpelling,
    meaning: n.meaningEn,
    meaningUr: n.meaningUr,
    pronunciation: n.pronunciation,
    isQuranic: n.isQuranic,
    isSahaba: n.isSahaba,
    origin: n.origin,
    category: n.gender,
  }));
}

// ─── BUSINESS NAME GENERATOR ─────────────────────────────────────────────────
function generateBusinessNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const results: GeneratedName[] = [];
  const kw = filters.keyword ? capitalize(filters.keyword.trim().split(' ')[0]) : 'Pro';
  const tone = filters.tone || 'Professional';
  const industry = filters.industry || 'Tech';

  // Filter prefix/suffix pools by industry/tone
  const prefixPool = shuffle([
    ...businessPrefixes.filter(p =>
      p.industry.includes(industry) || p.tone.includes(tone)
    ),
    ...businessPrefixes.slice(0, 20)
  ]);

  const suffixPool = shuffle(businessSuffixes);
  const standalone = shuffle(businessStandalones);

  for (let i = 0; i < count; i++) {
    let name: string;
    const rand = Math.random();
    if (rand < 0.3) {
      // prefix + keyword
      const prefix = prefixPool[i % prefixPool.length]?.word || 'Apex';
      name = `${prefix}${kw}`;
    } else if (rand < 0.6) {
      // keyword + suffix
      const suffix = suffixPool[i % suffixPool.length]?.word || 'Solutions';
      name = `${kw} ${suffix}`;
    } else if (rand < 0.8) {
      // prefix + suffix
      const prefix = prefixPool[i % prefixPool.length]?.word || 'Nova';
      const suffix = suffixPool[i % suffixPool.length]?.word || 'Group';
      name = `${prefix} ${suffix}`;
    } else {
      // standalone
      name = standalone[i % standalone.length]?.word || `${kw}Corp`;
    }
    results.push({
      id: generateId(),
      name,
      tagline: getTagline(tone, name),
      description: `A ${tone.toLowerCase()} ${industry.toLowerCase()} business built for growth and success.`,
      domainSuggestion: `${toDomainSlug(name)}.com`,
      socialHandle: `@${toDomainSlug(name)}`,
      category: industry,
      style: tone,
    });
  }
  return results;
}

// ─── BRAND NAME GENERATOR ────────────────────────────────────────────────────
function generateBrandNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const kw = filters.keyword ? capitalize(filters.keyword.trim().split(' ')[0]) : 'Brand';
  const style = (filters.style || 'Modern') as string;
  const styleWords = brandWords.filter(w => w.style.includes(style) || w.feel === style.toLowerCase());
  const allWords = shuffle([...styleWords, ...brandWords]).slice(0, 60);

  const results: GeneratedName[] = [];
  for (let i = 0; i < count; i++) {
    const word = allWords[i % allWords.length];
    let name: string;
    if (word.type === 'prefix') name = `${word.word}${kw}`;
    else if (word.type === 'suffix') name = `${kw}${word.word}`;
    else name = word.word;

    const palette = colorPalettes[style] || colorPalettes.Modern;
    results.push({
      id: generateId(),
      name,
      tagline: getTagline(style, name),
      description: `${name} — a ${style.toLowerCase()} brand that ${style === 'Premium' ? 'exudes luxury and quality' : style === 'Bold' ? 'makes a powerful statement' : 'stands out from the crowd'}.`,
      colorPalette: palette,
      logoDirection: logoDirections[style] || logoDirections.Modern,
      domainSuggestion: `${toDomainSlug(name)}.com`,
      socialHandle: `@${toDomainSlug(name)}`,
      category: filters.industry || 'General',
      style,
    });
  }
  return results;
}

// ─── YOUTUBE CHANNEL NAME GENERATOR ─────────────────────────────────────────
function generateYouTubeNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const kw = filters.keyword ? capitalize(filters.keyword.trim().split(' ')[0]) : 'Creator';
  const niche = filters.niche || 'Tech';
  const tone = filters.tone || 'Professional';

  const templates = shuffle(youtubeTemplates.filter(t =>
    t.niche.includes(niche) || t.tone === tone
  ));
  const fallbackTemplates = shuffle(youtubeTemplates);
  const pool = templates.length >= count ? templates : [...templates, ...fallbackTemplates];

  const ideas = videoIdeas[niche] || videoIdeas['Tech'] || [];

  return pool.slice(0, count).map((t) => {
    const name = t.pattern.replace('{keyword}', kw).replace('{Keyword}', kw);
    return {
      id: generateId(),
      name,
      tagline: `Your go-to ${niche.toLowerCase()} channel`,
      description: `${name} — ${tone.toLowerCase()} ${niche.toLowerCase()} content that educates, entertains, and inspires.`,
      videoIdeas: shuffle(ideas).slice(0, 5),
      socialHandle: `@${toDomainSlug(name)}`,
      category: niche,
      style: tone,
    };
  });
}

// ─── INSTAGRAM USERNAME GENERATOR ───────────────────────────────────────────
function generateInstagramUsernames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const kw = (filters.keyword || 'creator').toLowerCase().trim().replace(/\s+/g, '');
  const niche = filters.niche || 'Personal';
  const style = filters.style || 'Aesthetic';

  const templates = shuffle(instagramTemplates.filter(t =>
    t.niche.includes(niche) || t.style === style
  ));
  const fallback = shuffle(instagramTemplates);
  const pool = templates.length >= count ? templates : [...templates, ...fallback];

  const bios = bioSuggestions[niche] || bioSuggestions['Personal'] || [];
  const hashtags = hashtagSuggestions[niche] || hashtagSuggestions['Personal'] || [];

  return pool.slice(0, count).map((t) => {
    let username = t.pattern.replace('{keyword}', kw).replace('{Keyword}', kw);
    if (filters.addDots) username = username.replace(/_/g, '.');
    if (filters.addUnderscores && !username.includes('_')) username = `_${username}_`;
    if (filters.shortOnly) username = username.slice(0, 15);
    if (filters.noNumbers) username = username.replace(/\d+/g, '');

    return {
      id: generateId(),
      name: username,
      meaning: `A ${style.toLowerCase()} ${niche.toLowerCase()} username`,
      tagline: shuffle(bios)[0] || '✨ Living my best life',
      bioSuggestion: shuffle(bios)[0],
      hashtagSuggestions: shuffle(hashtags).slice(0, 10),
      category: niche,
      style,
    };
  });
}

// ─── DOMAIN NAME GENERATOR ───────────────────────────────────────────────────
function generateDomainNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const kw = (filters.keyword || 'domain').toLowerCase().trim().replace(/\s+/g, '');
  const ext = filters.extension || '.com';
  const results: GeneratedName[] = [];

  const prefixPool = shuffle(domainPrefixes);
  const suffixPool = shuffle(domainSuffixes);

  const patterns: Array<() => string> = [
    () => `${kw}${suffixPool[Math.floor(Math.random() * suffixPool.length)]?.word || 'hub'}`,
    () => `${prefixPool[Math.floor(Math.random() * prefixPool.length)]?.word || 'get'}${kw}`,
    () => `${kw}${ext.replace('.', '')}`,
    () => `${kw}pro`,
    () => `${kw}app`,
    () => `my${kw}`,
    () => `the${kw}`,
    () => `${kw}hq`,
    () => `try${kw}`,
    () => `use${kw}`,
    () => `go${kw}`,
    () => `${kw}ly`,
    () => `${kw}ify`,
    () => `${kw}io`,
    () => `smart${kw}`,
  ];

  const used = new Set<string>();
  let attempts = 0;
  while (results.length < count && attempts < 100) {
    attempts++;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const domain = pattern();
    if (!used.has(domain)) {
      used.add(domain);
      results.push({
        id: generateId(),
        name: `${domain}${ext}`,
        meaning: `A ${filters.shortOnly ? 'short' : 'brandable'} domain for your ${filters.industry || 'business'}`,
        tagline: 'Domain suggestion — check availability at a registrar',
        extension: ext,
        category: filters.industry || 'General',
        style: filters.style || 'Brandable',
      });
    }
  }
  return results;
}

// ─── APP NAME GENERATOR ──────────────────────────────────────────────────────
function generateAppNames(filters: GeneratorFilters, count: number): GeneratedName[] {
  const kw = filters.keyword ? capitalize(filters.keyword.trim().split(' ')[0]) : 'App';
  const category = filters.industry || 'Productivity';
  const style = filters.style || 'Modern';

  const prefixPool = shuffle(appPrefixes.filter(w =>
    w.category.includes(category) || w.style === style
  ).concat(appPrefixes));
  const suffixPool = shuffle(appSuffixes);

  const palette = colorPalettes[style] || colorPalettes.Modern;
  const iconIdeas: Record<string, string> = {
    Productivity: 'Lightning bolt in a clean rounded square',
    Fitness: 'Dumbbell or running figure with gradient background',
    Finance: 'Upward trend arrow with coin accent',
    Education: 'Open book or graduation cap icon',
    AI: 'Neural network nodes or brain circuit icon',
    Social: 'Speech bubble with hearts or stars',
    Utility: 'Wrench or gear in minimal flat design',
    Game: 'Game controller or joystick with vibrant colors',
    Shopping: 'Shopping bag with sparkle effect',
    Health: 'Heart rate line or leaf in soothing green',
  };

  const results: GeneratedName[] = [];
  for (let i = 0; i < count; i++) {
    const prefix = prefixPool[i % prefixPool.length]?.word || 'Smart';
    const suffix = suffixPool[i % suffixPool.length]?.word || 'ly';
    const rand = Math.random();
    let name: string;
    if (rand < 0.35) name = `${prefix}${kw}`;
    else if (rand < 0.65) name = `${kw}${suffix}`;
    else name = `${prefix}${suffix}`;

    results.push({
      id: generateId(),
      name,
      tagline: getTagline(style === 'Fun' ? 'Fun' : style === 'Minimal' ? 'Minimal' : 'Modern', name),
      description: `${name} is a ${style.toLowerCase()} ${category.toLowerCase()} app designed to help you achieve more with less effort.`,
      colorPalette: palette,
      logoDirection: iconIdeas[category] || 'Clean minimal icon with brand color gradient',
      domainSuggestion: `${toDomainSlug(name)}.app`,
      socialHandle: `@${toDomainSlug(name)}`,
      category,
      style,
    });
  }
  return results;
}

// ─── MAIN HOOK ───────────────────────────────────────────────────────────────
export function useGeneratorEngine(toolId: string) {
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const BATCH_SIZE = 12;

  const generate = useCallback(async (filters: GeneratorFilters, append = false) => {
    setIsLoading(true);
    // Simulate async AI-like generation delay
    await new Promise(r => setTimeout(r, 1200));

    let newResults: GeneratedName[] = [];

    switch (toolId) {
      case 'baby-name-generator':
        newResults = generateBabyNames(filters, BATCH_SIZE);
        break;
      case 'islamic-baby-names':
        newResults = generateIslamicNames(filters, BATCH_SIZE);
        break;
      case 'business-name-generator':
        newResults = generateBusinessNames(filters, BATCH_SIZE);
        break;
      case 'brand-name-generator':
        newResults = generateBrandNames(filters, BATCH_SIZE);
        break;
      case 'youtube-channel-name-generator':
        newResults = generateYouTubeNames(filters, BATCH_SIZE);
        break;
      case 'instagram-username-generator':
        newResults = generateInstagramUsernames(filters, BATCH_SIZE);
        break;
      case 'domain-name-generator':
        newResults = generateDomainNames(filters, BATCH_SIZE);
        break;
      case 'app-name-generator':
        newResults = generateAppNames(filters, BATCH_SIZE);
        break;
      default:
        newResults = [];
    }

    setResults(prev => append ? [...prev, ...newResults] : newResults);
    setIsLoading(false);
    setHasGenerated(true);
  }, [toolId]);

  const generateMore = useCallback((filters: GeneratorFilters) => {
    return generate(filters, true);
  }, [generate]);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasGenerated(false);
  }, []);

  return { results, isLoading, hasGenerated, generate, generateMore, clearResults };
}
