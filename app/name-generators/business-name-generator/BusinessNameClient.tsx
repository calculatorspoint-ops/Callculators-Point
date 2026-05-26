'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'business-name-generator';
const INDUSTRIES = ['All', 'Food', 'Tech', 'Fashion', 'Education', 'Real Estate', 'Health', 'Finance', 'Beauty', 'Agency', 'Ecommerce'];
const TONES = ['All', 'Professional', 'Luxury', 'Modern', 'Creative', 'Friendly', 'Local', 'Corporate'];

export default function BusinessNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    industry: 'all',
    tone: 'all',
    shortOnly: false,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> Generator Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="biz-keyword">Business Keyword</label>
        <input
          id="biz-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. tech, coffee, fashion..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="biz-industry">Industry</label>
        <select id="biz-industry" className="ng-select" value={filters.industry || 'all'} onChange={(e) => set('industry', e.target.value)}>
          {INDUSTRIES.map((i) => <option key={i} value={i === 'All' ? 'all' : i}>{i}</option>)}
        </select>
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="biz-tone">Brand Tone</label>
        <select id="biz-tone" className="ng-select" value={filters.tone || 'all'} onChange={(e) => set('tone', e.target.value)}>
          {TONES.map((t) => <option key={t} value={t === 'All' ? 'all' : t}>{t}</option>)}
        </select>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Short names only (≤10 chars)</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Short names only" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#3b82f6" gradientTo="#4f46e5" />
  );
}
