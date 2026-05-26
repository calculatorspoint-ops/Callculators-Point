'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'baby-name-generator';
const LETTERS = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
const GENDERS = ['All', 'boy', 'girl', 'unisex'];
const ORIGINS = ['All', 'Arabic', 'English', 'Urdu', 'Turkish', 'Persian', 'Indian', 'Modern', 'Classic'];
const LENGTHS = ['All', 'Short', 'Medium', 'Long'];
const STYLES = ['All', 'Modern', 'Traditional', 'Unique', 'Cute', 'Royal'];

export default function BabyNameGeneratorClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    gender: 'all',
    origin: 'all',
    startLetter: 'all',
    length: 'all',
    style: 'all',
    keyword: '',
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title">
        <span>⚙️</span> Generator Options
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="baby-keyword">
          Search by name or meaning
        </label>
        <input
          id="baby-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. ocean, light, grace..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="baby-gender-label">Gender</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="baby-gender-label">
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`ng-chip ${filters.gender === (g === 'All' ? 'all' : g) ? 'active' : ''}`}
              onClick={() => set('gender', g === 'All' ? 'all' : g)}
              aria-pressed={filters.gender === (g === 'All' ? 'all' : g)}
            >
              {g === 'boy' ? '👦 Boy' : g === 'girl' ? '👧 Girl' : g === 'unisex' ? '🌈 Unisex' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="baby-origin">Origin</label>
        <select
          id="baby-origin"
          className="ng-select"
          value={filters.origin || 'all'}
          onChange={(e) => set('origin', e.target.value)}
        >
          {ORIGINS.map((o) => (
            <option key={o} value={o === 'All' ? 'all' : o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="baby-style-label">Style</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="baby-style-label">
          {STYLES.map((s) => (
            <button
              key={s}
              className={`ng-chip ${filters.style === (s === 'All' ? 'all' : s) ? 'active' : ''}`}
              onClick={() => set('style', s === 'All' ? 'all' : s)}
              aria-pressed={filters.style === (s === 'All' ? 'all' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="baby-letter">Starting Letter</label>
        <select
          id="baby-letter"
          className="ng-select"
          value={filters.startLetter || 'all'}
          onChange={(e) => set('startLetter', e.target.value)}
        >
          {LETTERS.map((l) => (
            <option key={l} value={l === 'All' ? 'all' : l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="baby-length-label">Name Length</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="baby-length-label">
          {LENGTHS.map((l) => (
            <button
              key={l}
              className={`ng-chip ${filters.length === (l === 'All' ? 'all' : l) ? 'active' : ''}`}
              onClick={() => set('length', l === 'All' ? 'all' : l)}
              aria-pressed={filters.length === (l === 'All' ? 'all' : l)}
            >
              {l === 'Short' ? '🔹 Short (≤4)' : l === 'Medium' ? '🔷 Medium (5-7)' : l === 'Long' ? '🔶 Long (8+)' : 'All'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      tool={tool}
      allTools={toolsConfig}
      faqs={faqs}
      formContent={formContent}
      filters={filters}
      gradientFrom="#ec4899"
      gradientTo="#f43f5e"
    />
  );
}
