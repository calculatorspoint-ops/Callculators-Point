'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'islamic-baby-names';
const LETTERS = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
const GENDERS = ['All', 'boy', 'girl'];

export default function IslamicNamesClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    gender: 'all',
    startLetter: 'all',
    isQuranic: false,
    isSahaba: false,
    keyword: '',
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title">
        <span>⚙️</span> Search Options
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="islamic-keyword">
          Search by name or meaning
        </label>
        <input
          id="islamic-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. Muhammad, light, merciful..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="islamic-gender-label">Gender</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="islamic-gender-label">
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`ng-chip ${filters.gender === (g === 'All' ? 'all' : g) ? 'active' : ''}`}
              onClick={() => set('gender', g === 'All' ? 'all' : g)}
              aria-pressed={filters.gender === (g === 'All' ? 'all' : g)}
            >
              {g === 'boy' ? '👦 Boy' : g === 'girl' ? '👧 Girl' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="islamic-letter">Starting Letter</label>
        <select
          id="islamic-letter"
          className="ng-select"
          value={filters.startLetter || 'all'}
          onChange={(e) => set('startLetter', e.target.value)}
        >
          {LETTERS.map((l) => (
            <option key={l} value={l === 'All' ? 'all' : l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">🕌 Quranic Names Only</span>
        <label className="ng-toggle">
          <input
            type="checkbox"
            checked={!!filters.isQuranic}
            onChange={(e) => set('isQuranic', e.target.checked)}
            aria-label="Filter Quranic names only"
          />
          <div className="ng-toggle-track" />
          <div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">⭐ Sahaba / Sahabiyat Names</span>
        <label className="ng-toggle">
          <input
            type="checkbox"
            checked={!!filters.isSahaba}
            onChange={(e) => set('isSahaba', e.target.checked)}
            aria-label="Filter Sahaba names only"
          />
          <div className="ng-toggle-track" />
          <div className="ng-toggle-thumb" />
        </label>
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
      gradientFrom="#10b981"
      gradientTo="#0f766e"
      disclaimer="Always verify Islamic name meanings with a trusted Islamic scholar or authentic source before finalizing your baby's name."
    />
  );
}
