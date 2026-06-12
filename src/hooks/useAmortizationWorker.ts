/**
 * src/hooks/useAmortizationWorker.ts
 *
 * React hook that provides an off-main-thread amortization calculator
 * powered by a Web Worker (see src/utils/calcWorker.ts).
 *
 * USAGE:
 *   const { calculate, loading } = useAmortizationWorker();
 *
 *   // Inside a useEffect or event handler:
 *   const result = await calculate({ P: 500000, annualRate: 8.5, termYears: 20, extraPmt: 0 });
 *   // result is AmortizationResult | null
 *
 * LIFECYCLE:
 *   - Worker is created lazily on first call to calculate().
 *   - Worker is terminated on component unmount.
 *   - If a new calculation is requested while one is in flight, a new
 *     unique message ID ensures the older result is discarded.
 *   - Falls back to synchronous calculation if Workers are unavailable
 *     (e.g., during SSR or in unsupported environments).
 */
'use client';

import { useRef, useCallback, useState } from 'react';
import { getCalcWorkerUrl, type AmortizationPayload, type AmortizationResult } from '@/utils/calcWorker';

// Synchronous fallback (mirrors worker logic exactly, used when Worker unavailable)
function buildAmortizationSync(
  P: number,
  annualRate: number,
  termYears: number,
  extraPmt: number,
): AmortizationResult | null {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (!P || !annualRate || !termYears || r <= 0) return null;

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  let bal = P;
  let totalInterest = 0;
  let months = 0;
  const rows: AmortizationResult['rows'] = [];

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

  const byYear: Record<number, AmortizationResult['yearly'][0]> = {};
  rows.forEach(row => {
    if (!byYear[row.year]) {
      byYear[row.year] = { year: row.year, payment: 0, principal: 0, interest: 0, balance: row.balance, months: 0 };
    }
    byYear[row.year].payment   += row.payment;
    byYear[row.year].principal += row.principal;
    byYear[row.year].interest  += row.interest;
    byYear[row.year].balance    = row.balance;
    byYear[row.year].months++;
  });

  const yearly = Object.values(byYear).map(y => ({
    ...y,
    payment:   Math.round(y.payment),
    principal: Math.round(y.principal),
    interest:  Math.round(y.interest),
    balance:   Math.round(y.balance),
  }));

  const originalInterest = emi * n - P;
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);

  return { rows, yearly, emi, totalMonths: months, totalInterest, originalInterest, payoffDateISO: payoffDate.toISOString(), n };
}

let _msgId = 0;

export function useAmortizationWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(
    (payload: AmortizationPayload): Promise<AmortizationResult | null> => {
      // SSR guard
      if (typeof window === 'undefined') {
        return Promise.resolve(buildAmortizationSync(payload.P, payload.annualRate, payload.termYears, payload.extraPmt));
      }

      // Try to use (or create) the Worker
      let worker: Worker | null = workerRef.current;
      if (!worker) {
        try {
          worker = new Worker(getCalcWorkerUrl());
          workerRef.current = worker;

          // If the worker errors fatally, clear the ref so the next call recreates it
          worker.onerror = () => { workerRef.current = null; };
        } catch {
          // Workers blocked (e.g., strict CSP, old browser) — fall back to sync
          return Promise.resolve(buildAmortizationSync(payload.P, payload.annualRate, payload.termYears, payload.extraPmt));
        }
      }

      const id = ++_msgId;
      setLoading(true);

      return new Promise<AmortizationResult | null>((resolve) => {
        const handler = (event: MessageEvent) => {
          const msg = event.data;
          // Discard stale responses from superseded calculations
          if (msg.type === 'amortization' && msg.id === id) {
            worker!.removeEventListener('message', handler);
            setLoading(false);
            resolve(msg.result as AmortizationResult | null);
          }
        };

        worker!.addEventListener('message', handler);
        worker!.postMessage({ type: 'amortization', id, payload });
      });
    },
    [],
  );

  // Cleanup: terminate worker on unmount
  // (called via useEffect cleanup in the consuming component)
  const terminate = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  return { calculate, terminate, loading };
}
