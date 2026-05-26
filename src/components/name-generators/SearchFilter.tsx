'use client';
import { useState, useMemo } from 'react';

interface SearchFilterProps {
  totalCount: number;
  onFilter: (query: string) => void;
  placeholder?: string;
}

export function SearchFilter({ totalCount, onFilter, placeholder = 'Search results...' }: SearchFilterProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onFilter(val);
  };

  const handleClear = () => {
    setQuery('');
    onFilter('');
  };

  return (
    <div className="ng-results-header">
      <p className="ng-results-count" aria-live="polite">
        {totalCount > 0 ? `${totalCount} names generated` : 'Ready to generate'}
      </p>
      {totalCount > 0 && (
        <div className="ng-search-bar" role="search">
          <span aria-hidden="true" style={{ color: 'var(--ng-text-light)', flexShrink: 0 }}>🔍</span>
          <input
            type="search"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label="Filter generated names"
          />
          {query && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ng-text-light)',
                padding: 0,
                fontSize: '16px',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
