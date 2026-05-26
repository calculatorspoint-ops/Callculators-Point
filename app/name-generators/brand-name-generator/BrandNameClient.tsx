'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'brand-name-generator';
const STYLES = ['All', 'Premium', 'Minimal', 'Bold', 'Fun', 'Corporate', 'Futuristic', 'Elegant'];
const CATEGORIES = ['All', 'Fashion', 'Tech', 'Food', 'Health', 'Finance', 'Beauty', 'Education', 'Agency'];

export default function BrandNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    style: 'all',
    industry: 'all',
    shortOnly: false,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> Brand Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="brand-keyword">Brand Keyword</label>
        <input
          id="brand-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. luxury, spark, glow..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="brand-style-label">Brand Style</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="brand-style-label">
          {STYLES.map((s) => (
            <button key={s} className={`ng-chip ${filters.style === (s === 'All' ? 'all' : s) ? 'active' : ''}`} onClick={() => set('style', s === 'All' ? 'all' : s)} aria-pressed={filters.style === (s === 'All' ? 'all' : s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="brand-cat">Industry / Category</label>
        <select id="brand-cat" className="ng-select" value={filters.industry || 'all'} onChange={(e) => set('industry', e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c === 'All' ? 'all' : c}>{c}</option>)}
        </select>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Easy pronunciation only</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Easy pronunciation" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-disclaimer" role="note" style={{ marginTop: 16 }}>
        <span>⚠️</span>
        <span>Always conduct a trademark search before using a brand name commercially.</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#8b5cf6" gradientTo="#6d28d9" />
  );
}
