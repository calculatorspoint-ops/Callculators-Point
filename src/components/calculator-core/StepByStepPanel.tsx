'use client';
/**
 * src/components/calculator-core/StepByStepPanel.tsx
 *
 * Visible by default — shows HOW the answer was derived.
 * Inspired by CalculatorSoup's "show your work" feature.
 */
import { useState } from 'react';

export interface CalcStep {
  label: string;     // "Step 1: Calculate monthly interest rate"
  formula: string;   // "r = 8.5% ÷ 12 = 0.7083%"
  value?: string;    // "0.007083"
  note?: string;     // Optional explanation
}

interface StepByStepPanelProps {
  steps: CalcStep[];
  title?: string;
}

export function StepByStepPanel({ steps, title = 'How this was calculated' }: StepByStepPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!steps || steps.length === 0) return null;

  const copyAll = async () => {
    const text = steps
      .map((s, i) => `Step ${i + 1}: ${s.label}\n  ${s.formula}${s.value ? `\n  = ${s.value}` : ''}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy", e);
    }
  };

  return (
    <div className="steps-panel">
      {/* Header */}
      <div className="steps-header">
        <div className="steps-title">
          <span className="steps-icon">🧮</span>
          <span>{title}</span>
        </div>
        <button
          onClick={copyAll}
          className="steps-copy-btn"
          aria-label="Copy all steps"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Steps */}
      <div className="steps-list">
        {steps.map((step, i) => (
          <div key={i} className="steps-item">
            <div className="steps-num-col">
              <div className="steps-num">{i + 1}</div>
              {i < steps.length - 1 && <div className="steps-line" />}
            </div>
            <div className="steps-content">
              <div className="steps-label">{step.label}</div>
              <div className="steps-formula">{step.formula}</div>
              {step.value && (
                <div className="steps-value">= {step.value}</div>
              )}
              {step.note && (
                <div className="steps-note">💡 {step.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Final result highlight */}
      {steps.length > 0 && steps[steps.length - 1].value && (
        <div className="steps-final">
          <span className="steps-final-label">Final Answer:</span>
          <span className="steps-final-value">{steps[steps.length - 1].value}</span>
        </div>
      )}
    </div>
  );
}
