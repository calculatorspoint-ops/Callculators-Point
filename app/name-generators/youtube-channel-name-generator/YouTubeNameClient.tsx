'use client';
import { useState } from 'react';
import { toolsConfig } from '@/data/name-generators/tools-config';
import { faqData } from '@/data/name-generators/faq-data';
import { GeneratorLayout } from '@/components/name-generators/GeneratorLayout';
import type { GeneratorFilters } from '@/hooks/name-generators/useGeneratorEngine';

const TOOL_ID = 'youtube-channel-name-generator';
const NICHES = ['All', 'Gaming', 'Vlogs', 'Tech', 'Education', 'Islamic', 'Cooking', 'Fitness', 'Finance', 'Motivation', 'Travel', 'Reviews'];
const TONES = ['All', 'Funny', 'Professional', 'Catchy', 'Personal Brand', 'Viral', 'Minimal'];

export default function YouTubeNameClient() {
  const tool = toolsConfig.find((t) => t.id === TOOL_ID)!;
  const faqs = faqData[TOOL_ID]?.faqs || [];
  const [filters, setFilters] = useState<GeneratorFilters>({
    keyword: '',
    niche: 'all',
    tone: 'all',
    shortOnly: false,
  });
  const set = (key: keyof GeneratorFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const formContent = (
    <div>
      <div className="ng-form-title"><span>⚙️</span> Channel Options</div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="yt-keyword">Channel Keyword / Your Name</label>
        <input
          id="yt-keyword"
          className="ng-input"
          type="text"
          placeholder="e.g. Ahmed, gaming, tech tips..."
          value={filters.keyword || ''}
          onChange={(e) => set('keyword', e.target.value)}
        />
      </div>

      <div className="ng-form-group">
        <label className="ng-form-label" htmlFor="yt-niche">Channel Niche</label>
        <select id="yt-niche" className="ng-select" value={filters.niche || 'all'} onChange={(e) => set('niche', e.target.value)}>
          {NICHES.map((n) => <option key={n} value={n === 'All' ? 'all' : n}>{n}</option>)}
        </select>
      </div>

      <div className="ng-form-group">
        <div className="ng-form-label" id="yt-tone-label">Channel Tone</div>
        <div className="ng-filter-chips" role="group" aria-labelledby="yt-tone-label">
          {TONES.map((t) => (
            <button key={t} className={`ng-chip ${filters.tone === (t === 'All' ? 'all' : t) ? 'active' : ''}`} onClick={() => set('tone', t === 'All' ? 'all' : t)} aria-pressed={filters.tone === (t === 'All' ? 'all' : t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="ng-toggle-row">
        <span className="ng-toggle-label">Short channel names only</span>
        <label className="ng-toggle">
          <input type="checkbox" checked={!!filters.shortOnly} onChange={(e) => set('shortOnly', e.target.checked)} aria-label="Short channel names" />
          <div className="ng-toggle-track" /><div className="ng-toggle-thumb" />
        </label>
      </div>
    </div>
  );

  return (
    <GeneratorLayout tool={tool} allTools={toolsConfig} faqs={faqs} formContent={formContent} filters={filters} gradientFrom="#ef4444" gradientTo="#ea580c" />
  );
}
