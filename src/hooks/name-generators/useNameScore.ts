'use client';

export interface NameScoreResult {
  overall: number; // 0-100
  memorability: { score: number; label: 'High' | 'Medium' | 'Low' };
  length: { score: number; label: 'Good' | 'Short' | 'Long' | 'Too Short' | 'Too Long' };
  pronunciation: { score: number; label: 'Easy' | 'Moderate' | 'Difficult' };
  brandability: { score: number; label: 'Strong' | 'Good' | 'Moderate' | 'Weak' };
  seoPotential: { score: number; label: 'High' | 'Medium' | 'Low' };
  uniqueness: { score: number; label: 'High' | 'Medium' | 'Low' };
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (word.endsWith('e') && !word.endsWith('le')) count--;
  return Math.max(1, count);
}

function hasHardClusters(word: string): boolean {
  const hardClusters = /[bcdfghjklmnpqrstvwxyz]{4,}|[^aeiouy]{4,}/i;
  return hardClusters.test(word);
}

function computeUniqueness(word: string): number {
  const commonPatterns = /^(the|get|my|app|pro|plus|max|go|web|net|tech|smart|easy|fast|quick|best|top)/i;
  const hasCommonPattern = commonPatterns.test(word);
  const charVariety = new Set(word.toLowerCase().replace(/[^a-z]/g, '')).size;
  const varietyScore = Math.min(100, (charVariety / word.length) * 150);
  return hasCommonPattern ? Math.max(40, varietyScore - 20) : varietyScore;
}

export function scoreNameField(name: string): NameScoreResult {
  // Clean name — letters only for analysis
  const clean = name.replace(/[^a-zA-Z]/g, '');
  const len = clean.length;
  const syllables = countSyllables(clean);

  // Memorability: based on syllable count (2-3 syllables ideal)
  const memorabilityScore = syllables === 2 ? 95 : syllables === 3 ? 88 : syllables === 1 ? 80 : syllables === 4 ? 70 : 55;
  const memorabilityLabel = memorabilityScore >= 85 ? 'High' : memorabilityScore >= 70 ? 'Medium' : 'Low';

  // Length: ideal 5-10 characters
  const lengthScore = len >= 5 && len <= 8 ? 95 : len >= 4 && len <= 10 ? 85 : len >= 3 && len <= 12 ? 70 : len < 3 ? 40 : 55;
  const lengthLabel = len >= 5 && len <= 10 ? 'Good' : len < 4 ? 'Too Short' : len < 5 ? 'Short' : len <= 12 ? 'Long' : 'Too Long';

  // Pronunciation: check for hard consonant clusters
  const hasHard = hasHardClusters(clean);
  const pronunciationScore = hasHard ? 65 : syllables <= 3 ? 90 : 75;
  const pronunciationLabel = pronunciationScore >= 85 ? 'Easy' : pronunciationScore >= 70 ? 'Moderate' : 'Difficult';

  // Brandability: unique + sounds catchy
  const vowelRatio = (clean.match(/[aeiouy]/gi)?.length ?? 0) / len;
  const brandabilityScore = Math.round(
    (vowelRatio >= 0.3 && vowelRatio <= 0.6 ? 90 : 70) * (hasHard ? 0.8 : 1)
  );
  const brandabilityLabel = brandabilityScore >= 85 ? 'Strong' : brandabilityScore >= 70 ? 'Good' : brandabilityScore >= 55 ? 'Moderate' : 'Weak';

  // SEO Potential: 6-15 chars is ideal for searchability
  const seoScore = len >= 6 && len <= 15 ? 90 : len >= 4 && len <= 18 ? 75 : 60;
  const seoLabel = seoScore >= 85 ? 'High' : seoScore >= 70 ? 'Medium' : 'Low';

  // Uniqueness: based on character variety and common patterns
  const uniquenessScore = Math.round(computeUniqueness(clean));
  const uniquenessLabel = uniquenessScore >= 75 ? 'High' : uniquenessScore >= 55 ? 'Medium' : 'Low';

  const overall = Math.round(
    (memorabilityScore + lengthScore + pronunciationScore + brandabilityScore + seoScore + uniquenessScore) / 6
  );

  return {
    overall,
    memorability: { score: memorabilityScore, label: memorabilityLabel },
    length: { score: lengthScore, label: lengthLabel },
    pronunciation: { score: pronunciationScore, label: pronunciationLabel },
    brandability: { score: brandabilityScore, label: brandabilityLabel },
    seoPotential: { score: seoScore, label: seoLabel },
    uniqueness: { score: uniquenessScore, label: uniquenessLabel },
  };
}

export function useNameScore() {
  return { scoreNameField };
}
