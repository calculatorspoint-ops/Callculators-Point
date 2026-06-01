import React, { useState, useCallback } from 'react';

// Syllable counting: count vowel groups per word (approximation of Flesch method)
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length === 0) return 0;
  // Remove trailing 'e' (silent e rule)
  const trimmed = word.replace(/e$/, '') || word;
  const matches = trimmed.match(/[aeiou]+/g);
  const count = matches ? matches.length : 1;
  return Math.max(1, count);
}

function countSentences(text: string): number {
  // Split on .  !  ? followed by space or end
  const matches = text.match(/[.!?]+(\s|$)/g);
  if (!matches || matches.length === 0) {
    // Treat whole text as one sentence
    return 1;
  }
  return matches.length;
}

function getReadingEaseInfo(score: number): { grade: string; label: string; color: string; description: string } {
  if (score >= 90) return { grade: '5th grade', label: 'Very Easy', color: '#15803d', description: 'Easily understood by an average 11-year-old student.' };
  if (score >= 80) return { grade: '6th grade', label: 'Easy', color: '#16a34a', description: 'Conversational English for consumers.' };
  if (score >= 70) return { grade: '7th grade', label: 'Fairly Easy', color: '#65a30d', description: 'Fairly easy to read. Simple, direct prose.' };
  if (score >= 60) return { grade: '8th–9th grade', label: 'Standard', color: '#d97706', description: 'Plain English. Easily understood by 13–15 year olds.' };
  if (score >= 50) return { grade: '10th–12th grade', label: 'Fairly Difficult', color: '#ea580c', description: 'Fairly difficult to read. High school level.' };
  if (score >= 30) return { grade: 'College level', label: 'Difficult', color: '#dc2626', description: 'Difficult to read. Best for college-educated readers.' };
  return { grade: 'College graduate', label: 'Very Confusing', color: '#7c3aed', description: 'Very difficult. Best for university graduates.' };
}

type AnalysisResult = {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  fleschEase: number;
  fkGradeLevel: number;
  easeInfo: ReturnType<typeof getReadingEaseInfo>;
};

export function ReadingLevelCalculator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [warning, setWarning] = useState('');

  const handleTextChange = (val: string) => {
    setText(val);
    setCharCount(val.length);
    if (result) setResult(null); // Reset result on text change
  };

  const analyze = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setWarning('Please enter at least some text to analyze.');
      return;
    }
    if (trimmed.length < 100) {
      setWarning('⚠️ Short text (< 100 chars) may give inaccurate results. For best accuracy, use 300+ words.');
    } else {
      setWarning('');
    }

    // Word count
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Sentence count
    const sentenceCount = countSentences(trimmed);

    // Syllable count
    let syllableCount = 0;
    for (const w of words) {
      syllableCount += countSyllables(w);
    }

    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / wordCount;

    // Flesch Reading Ease
    const fleschEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    const clampedEase = Math.min(121, Math.max(0, fleschEase));

    // Flesch-Kincaid Grade Level
    const fkGradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
    const clampedGrade = Math.max(0, fkGradeLevel);

    setResult({
      wordCount,
      sentenceCount,
      syllableCount,
      avgWordsPerSentence,
      avgSyllablesPerWord,
      fleschEase: clampedEase,
      fkGradeLevel: clampedGrade,
      easeInfo: getReadingEaseInfo(clampedEase),
    });
  }, [text]);

  const handleClear = () => {
    setText('');
    setCharCount(0);
    setResult(null);
    setWarning('');
  };

  const inp: React.CSSProperties = {
    padding: '10px 14px',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontWeight: 400,
    resize: 'vertical',
    lineHeight: 1.6,
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Textarea */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>
            Paste Your Text
          </label>
          <span style={{ fontSize: 11, color: charCount >= 100 ? 'var(--brand)' : 'var(--text3)', fontWeight: 700 }}>
            {charCount} chars{charCount < 100 ? ` (${100 - charCount} more recommended)` : ' ✓'}
          </span>
        </div>
        <textarea
          style={{ ...inp, minHeight: 160 }}
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          placeholder="Paste or type your text here. Recommended: 300+ words for accurate analysis. Works with essays, articles, textbooks, student writing, and any written content..."
        />
      </div>

      {/* Warning */}
      {warning && (
        <div style={{ padding: '10px 14px', background: '#fef3c722', border: '1px solid #d9770655', borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: '#d97706', margin: 0, fontWeight: 600 }}>{warning}</p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={analyze}
          style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', background: 'var(--brand)', color: '#fff', border: 'none', letterSpacing: '.03em' }}
        >
          📊 Analyze Reading Level
        </button>
        <button
          onClick={handleClear}
          style={{ padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--surface2)', color: 'var(--text3)', border: '1.5px solid var(--border)' }}
        >
          ✕ Clear
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main score cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Flesch Reading Ease */}
            <div style={{ padding: '22px', background: `linear-gradient(135deg, ${result.easeInfo.color}22, ${result.easeInfo.color}0a)`, border: `2px solid ${result.easeInfo.color}55`, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: result.easeInfo.color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                Flesch Reading Ease
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, color: result.easeInfo.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.fleschEase.toFixed(1)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: result.easeInfo.color, marginTop: 8 }}>{result.easeInfo.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{result.easeInfo.description}</div>
              {/* Scale bar */}
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, result.fleschEase)}%`, height: '100%', background: result.easeInfo.color, borderRadius: 99 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>Hard (0)</span>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>Easy (100)</span>
              </div>
            </div>

            {/* FK Grade Level */}
            <div style={{ padding: '22px', background: `linear-gradient(135deg, var(--brand)22, var(--brand)0a)`, border: `2px solid var(--brand)55`, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                Flesch-Kincaid Grade Level
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--brand)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.fkGradeLevel.toFixed(1)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', marginTop: 8 }}>
                Grade {Math.round(result.fkGradeLevel)} equivalent
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{result.easeInfo.grade}</div>
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (result.fkGradeLevel / 16) * 100)}%`, height: '100%', background: 'var(--brand)', borderRadius: 99 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>K (0)</span>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>Grad (16+)</span>
              </div>
            </div>
          </div>

          {/* Text Statistics */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 12 }}>📈 Text Statistics</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Words', value: result.wordCount.toLocaleString() },
                { label: 'Sentences', value: result.sentenceCount.toLocaleString() },
                { label: 'Syllables', value: result.syllableCount.toLocaleString() },
                { label: 'Avg Words/Sentence', value: result.avgWordsPerSentence.toFixed(1) },
                { label: 'Avg Syllables/Word', value: result.avgSyllablesPerWord.toFixed(2) },
                { label: 'Characters', value: charCount.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '10px', background: 'var(--surface2)', borderRadius: 10, textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Level Scale */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              📚 Flesch Reading Ease Scale
            </p>
            {[
              { range: '90–100', label: 'Very Easy', grade: '5th grade', color: '#15803d' },
              { range: '80–89', label: 'Easy', grade: '6th grade', color: '#16a34a' },
              { range: '70–79', label: 'Fairly Easy', grade: '7th grade', color: '#65a30d' },
              { range: '60–69', label: 'Standard', grade: '8th–9th grade', color: '#d97706' },
              { range: '50–59', label: 'Fairly Difficult', grade: '10th–12th grade', color: '#ea580c' },
              { range: '30–49', label: 'Difficult', grade: 'College level', color: '#dc2626' },
              { range: '0–29', label: 'Very Confusing', grade: 'Graduate level', color: '#7c3aed' },
            ].map(({ range, label, grade, color }, i, arr) => {
              const isActive = result.easeInfo.label === label;
              return (
                <div key={range} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                  borderRadius: 8, marginBottom: 2,
                  background: isActive ? `${color}18` : 'transparent',
                  border: isActive ? `1.5px solid ${color}55` : '1.5px solid transparent',
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, fontWeight: isActive ? 800 : 600, color: isActive ? color : 'var(--text2)', flex: 1 }}>
                    {range} — {label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{grade}</div>
                  {isActive && <span style={{ fontSize: 10, fontWeight: 800, color, background: `${color}22`, padding: '1px 7px', borderRadius: 99 }}>← Your Text</span>}
                </div>
              );
            })}
          </div>

          {/* Use cases */}
          <div style={{ padding: '12px 14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 6 }}>💡 Use Cases</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Textbook Evaluation', 'Student Writing Assessment', 'Content Readability', 'News Article Grading', 'Marketing Copy', 'Legal Document Review'].map(tag => (
                <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: 'var(--brand)18', color: 'var(--brand)', border: '1px solid var(--brand)33' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
