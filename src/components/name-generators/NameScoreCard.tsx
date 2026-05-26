'use client';
import { useEffect, useRef, useState } from 'react';
import type { NameScoreResult } from '@/hooks/name-generators/useNameScore';

interface NameScoreCardProps {
  score: NameScoreResult;
  compact?: boolean;
}

function getScoreColor(score: number): { fill: string; stroke: string; text: string } {
  if (score >= 80) return { fill: 'fill-high', stroke: 'stroke-high', text: 'score-high' };
  if (score >= 60) return { fill: 'fill-med', stroke: 'stroke-med', text: 'score-med' };
  return { fill: 'fill-low', stroke: 'stroke-low', text: 'score-low' };
}

const METRICS = [
  { key: 'memorability', label: 'Memorability' },
  { key: 'length', label: 'Length' },
  { key: 'pronunciation', label: 'Pronunciation' },
  { key: 'brandability', label: 'Brandability' },
  { key: 'seoPotential', label: 'SEO Potential' },
  { key: 'uniqueness', label: 'Uniqueness' },
] as const;

export function NameScoreCard({ score, compact = false }: NameScoreCardProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const overallColor = getScoreColor(score.overall);
  const circumference = 2 * Math.PI * 20; // r=20
  const dashOffset = circumference - (animated ? (score.overall / 100) * circumference : circumference);

  return (
    <div className="ng-score-card" ref={ref} role="region" aria-label="Name Score">
      {/* Overall Score Header */}
      <div className="ng-score-header">
        <div className="ng-score-overall">
          <div className="ng-score-ring" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="52" height="52">
              <circle className="ng-score-ring-bg" cx="24" cy="24" r="20" />
              <circle
                className={`ng-score-ring-fill ${overallColor.stroke}`}
                cx="24" cy="24" r="20"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
              />
            </svg>
            <span className={`ng-score-number ${overallColor.text}`}>{score.overall}</span>
          </div>
          <div>
            <div className="ng-score-label">Name Score</div>
            <div className={`ng-score-sublabel ${overallColor.text}`}>
              {score.overall >= 80 ? '🏆 Excellent' : score.overall >= 65 ? '✅ Good' : '⚡ Fair'}
            </div>
          </div>
        </div>
        <div className="text-xs text-right" style={{ color: 'var(--ng-text-light)', lineHeight: 1.5 }}>
          <div className="font-bold" style={{ color: 'var(--ng-text-muted)' }}>out of</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ng-text)' }}>100</div>
        </div>
      </div>

      {/* Sub-metrics */}
      {!compact && (
        <div className="ng-score-metrics">
          {METRICS.map(({ key, label }) => {
            const metric = score[key];
            const colors = getScoreColor(metric.score);
            return (
              <div key={key} className="ng-metric-row">
                <span className="ng-metric-name">{label}</span>
                <div className="ng-metric-bar" role="progressbar" aria-valuenow={metric.score} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={`ng-metric-fill ${colors.fill}`}
                    style={{ width: animated ? `${metric.score}%` : '0%' }}
                  />
                </div>
                <span className={`ng-metric-value ${colors.text}`}>{metric.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
