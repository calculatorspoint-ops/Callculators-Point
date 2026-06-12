/**
 * src/utils/calcWorker.ts
 *
 * Inline Web Worker source for heavy financial math calculations.
 *
 * WHY A WORKER:
 *   A 30-year amortization schedule = 360 loop iterations × 2 passes
 *   (base + prepayment comparison). On a mid-range mobile CPU this can
 *   take 8-15 ms synchronously — enough to drop a frame and cause jank.
 *   Offloading to a Worker thread keeps the main thread free for input
 *   response and animations.
 *
 * PATTERN:
 *   We use the "inline worker" pattern: the worker source is a string
 *   embedded in the bundle, instantiated via URL.createObjectURL(Blob).
 *   This avoids needing a separate /public/worker.js file and works
 *   with Next.js static exports and edge deployments.
 *
 * PROTOCOL:
 *   postMessage({ type: 'amortization', payload: { P, annualRate, termYears, extraPmt } })
 *   → onmessage: { type: 'amortization', result: AmortizationResult | null }
 *
 *   postMessage({ type: 'ping' })
 *   → onmessage: { type: 'pong' }
 */

// ── Worker source (serialised as a string, runs in a separate thread) ─────────

const WORKER_SOURCE = /* javascript */ `
"use strict";

/**
 * Build a full amortization schedule off the main thread.
 * @param {number} P          - Principal loan amount
 * @param {number} annualRate - Annual interest rate in % (e.g. 8.5)
 * @param {number} termYears  - Loan term in years
 * @param {number} extraPmt   - Extra monthly payment (may be 0)
 * @returns {object|null}
 */
function buildAmortizationSchedule(P, annualRate, termYears, extraPmt) {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;

  if (!P || !annualRate || !termYears || r <= 0) return null;

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  let bal = P;
  let totalInterest = 0;
  let months = 0;
  const rows = [];

  while (bal > 0.005 && months < n + 1) {
    months++;
    const interestPmt = bal * r;
    let principalPmt = Math.min(emi - interestPmt + extraPmt, bal);
    if (principalPmt < 0) principalPmt = 0;
    bal = Math.max(0, bal - principalPmt);
    totalInterest += interestPmt;
    rows.push({
      month: months,
      year: Math.ceil(months / 12),
      payment: emi + extraPmt,
      principal: principalPmt,
      interest: interestPmt,
      balance: bal,
      cumInterest: totalInterest,
      cumPrincipal: P - bal,
    });
    if (bal < 0.005) break;
  }

  // Aggregate to yearly buckets
  const byYear = {};
  rows.forEach(function(row) {
    if (!byYear[row.year]) {
      byYear[row.year] = { year: row.year, payment: 0, principal: 0, interest: 0, balance: row.balance, months: 0 };
    }
    byYear[row.year].payment   += row.payment;
    byYear[row.year].principal += row.principal;
    byYear[row.year].interest  += row.interest;
    byYear[row.year].balance    = row.balance;
    byYear[row.year].months++;
  });

  const yearly = Object.values(byYear).map(function(y) {
    return {
      year:      y.year,
      payment:   Math.round(y.payment),
      principal: Math.round(y.principal),
      interest:  Math.round(y.interest),
      balance:   Math.round(y.balance),
      months:    y.months,
    };
  });

  const originalInterest = emi * n - P;
  // Payoff date — serialise as ISO string so it survives structured clone
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);

  return {
    rows,
    yearly,
    emi,
    totalMonths: months,
    totalInterest,
    originalInterest,
    payoffDateISO: payoffDate.toISOString(),
    n,
  };
}

// ── Message handler ────────────────────────────────────────────────────────────

self.onmessage = function(event) {
  var msg = event.data;

  if (msg.type === 'ping') {
    self.postMessage({ type: 'pong' });
    return;
  }

  if (msg.type === 'amortization') {
    var p = msg.payload;
    var result = buildAmortizationSchedule(p.P, p.annualRate, p.termYears, p.extraPmt);
    self.postMessage({ type: 'amortization', id: msg.id, result: result });
    return;
  }
};
`;

// ── Public API ─────────────────────────────────────────────────────────────────

let _workerUrl: string | null = null;

/**
 * Returns (and memoises) the object URL for the inline worker blob.
 * The URL is created once and reused across all hook instances.
 */
export function getCalcWorkerUrl(): string {
  if (typeof window === 'undefined') {
    // SSR guard — workers don't exist on the server
    throw new Error('[calcWorker] Workers are browser-only');
  }
  if (!_workerUrl) {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
    _workerUrl = URL.createObjectURL(blob);
  }
  return _workerUrl;
}

// ── Types (exported for the hook) ─────────────────────────────────────────────

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumInterest: number;
  cumPrincipal: number;
}

export interface YearlyRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  months: number;
}

export interface AmortizationResult {
  rows: AmortizationRow[];
  yearly: YearlyRow[];
  emi: number;
  totalMonths: number;
  totalInterest: number;
  originalInterest: number;
  /** ISO-8601 date string — convert with new Date(payoffDateISO) */
  payoffDateISO: string;
  n: number;
}

export interface AmortizationPayload {
  P: number;
  annualRate: number;
  termYears: number;
  extraPmt: number;
}
