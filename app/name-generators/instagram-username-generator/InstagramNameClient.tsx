'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'instagram-username-generator';
const NICHES = ['All', 'Personal', 'Fashion', 'Fitness', 'Business', 'Photography', 'Gaming', 'Travel', 'Beauty', 'Creator'];
const STYLES = ['All', 'Aesthetic', 'Cool', 'Professional', 'Cute', 'Minimal', 'Luxury', 'Bold'];

export default function InstagramNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    niche: 'all',
    style: 'all',
    addDots: false,
    addUnderscores: false,
    shortOnly: false,
    noNumbers: true,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> Username Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="ig-keyword">Your Name or Keyword</label>
        <input
          id="ig-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. Sara, fashion, travel..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="ig-niche">Niche</label>
        <select id="ig-niche" className="ng-select" value={filters.niche || 'all'} onChange={(e) => set('niche', e.target.value)}>
          {NICHES.map((n) => <option key={n} value={n === 'All' ? 'all' : n}>{n}</option>)}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="ig-style-label">Username Style</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="ig-style-label">
          {STYLES.map((s) => (
            <button key={s} className={`ng-chip ${filters.style === (s === 'All' ? 'all' : s) ? 'active' : ''}`} onClick={() => set('style', s === 'All' ? 'all' : s)} aria-pressed={filters.style === (s === 'All' ? 'all' : s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Add dots (.)</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.addDots} onChange={(e) => set('addDots', e.target.checked)} aria-label="Add dots" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Add underscores (_)</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.addUnderscores} onChange={(e) => set('addUnderscores', e.target.checked)} aria-label="Add underscores" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Short usernames only</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Short usernames" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">No numbers</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.noNumbers} onChange={(e) => set('noNumbers', e.target.checked)} aria-label="No numbers" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-disclaimer" role="note" style={{ marginTop: 12 }}>
        <span>⚠️</span>
        <span>Check username availability directly on Instagram before deciding.</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#d946ef" gradientTo="#db2777" />
  );
}
