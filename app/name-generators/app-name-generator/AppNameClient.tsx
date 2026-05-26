'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'app-name-generator';
const CATEGORIES = ['All', 'Productivity', 'Fitness', 'Finance', 'Education', 'AI', 'Social', 'Utility', 'Game', 'Shopping', 'Health'];
const STYLES = ['All', 'Modern', 'Techy', 'Minimal', 'Fun', 'Premium', 'Startup', 'Futuristic'];

export default function AppNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    industry: 'all',
    style: 'all',
    shortOnly: false,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> App Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="app-keyword">App Keyword or Core Feature</label>
        <input
          id="app-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. focus, budget, run, study..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="app-cat">App Category</label>
        <select id="app-cat" className="ng-select" value={filters.industry || 'all'} onChange={(e) => set('industry', e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c === 'All' ? 'all' : c}>{c}</option>)}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="app-style-label">App Style</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="app-style-label">
          {STYLES.map((s) => (
            <button key={s} className={`ng-chip ${filters.style === (s === 'All' ? 'all' : s) ? 'active' : ''}`} onClick={() => set('style', s === 'All' ? 'all' : s)} aria-pressed={filters.style === (s === 'All' ? 'all' : s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Short app names (≤8 chars)</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Short app names only" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#f59e0b" gradientTo="#ea580c" />
  );
}
