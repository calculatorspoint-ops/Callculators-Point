'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'domain-name-generator';
const EXTENSIONS = ['.com', '.net', '.org', '.io', '.ai', '.pk', '.store', '.app', '.online'];
const INDUSTRIES = ['All', 'Tech', 'Business', 'Health', 'Education', 'Finance', 'Shopping', 'Creative'];
const STYLES = ['Brandable', 'SEO-Friendly', 'Short', 'Exact Match'];

export default function DomainNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    extension: '.com',
    industry: 'all',
    style: 'Brandable',
    shortOnly: false,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> Domain Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="domain-keyword">Keyword or Business Name</label>
        <input
          id="domain-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. techflow, shopnow, myapp..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="ext-label">Domain Extension</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="ext-label">
          {EXTENSIONS.map((ext) => (
            <button key={ext} className={`ng-chip ${filters.extension === ext ? 'active' : ''}`} onClick={() => set('extension', ext)} aria-pressed={filters.extension === ext}>{ext}</button>
          ))}
        </div>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="domain-industry">Industry</label>
        <select id="domain-industry" className="ng-select" value={filters.industry || 'all'} onChange={(e) => set('industry', e.target.value)}>
          {INDUSTRIES.map((i) => <option key={i} value={i === 'All' ? 'all' : i}>{i}</option>)}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="domain-style-label">Domain Style</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="domain-style-label">
          {STYLES.map((s) => (
            <button key={s} className={`ng-chip ${filters.style === s ? 'active' : ''}`} onClick={() => set('style', s)} aria-pressed={filters.style === s}>{s}</button>
          ))}
        </div>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Short domains only (≤10 chars)</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Short domains only" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>

      <div className="ng-disclaimer" role="note" style={{ marginTop: 12 }}>
        <span>⚠️</span>
        <span>Check domain availability at a registrar (Namecheap, GoDaddy) before purchasing.</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#0891b2" gradientTo="#1d4ed8" />
  );
}
