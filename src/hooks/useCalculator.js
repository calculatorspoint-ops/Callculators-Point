import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import { compute, formatOutput } from "../utils/calculationEngine";
import { useAppStore } from "../store/useAppStore";

/**
 * The main hook powering every calculator.
 * Reads config, manages input state, runs calculations.
 */
export function useCalculator(config) {
  const { addRecent } = useAppStore();
  const tracked = useRef(false);
  // eslint-disable-next-line no-unused-vars
  const [isPending, startTransition] = useTransition();

  // ── Input state (keyed by input.id) ───────────────────
  const buildDefaults = useCallback(() =>
    config.inputs.reduce((acc, inp) => {
      acc[inp.id] = inp.default ?? "";
      return acc;
    }, {}),
  [config]);

  const [inputs,  setInputs]  = useState(buildDefaults);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  // ── Validate a single input ───────────────────────────
  const validate = useCallback((id, value, inputConfig) => {
    if (inputConfig.type === "number" || inputConfig.type === "slider") {
      const isStrictNumber = /^-?\d+(\.\d+)?$/.test(String(value).trim());
      if (value !== "" && !isStrictNumber) return "Enter a valid number";
      const v = Number(String(value).trim());
      if (inputConfig.min !== undefined && v < inputConfig.min) return `Minimum is ${inputConfig.min}`;
      if (inputConfig.max !== undefined && v > inputConfig.max) return `Maximum is ${inputConfig.max}`;
    }
    return null;
  }, []);

  // ── Update an input ────────────────────────────────────
  const setInput = useCallback((id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }));
    const inputConfig = config.inputs.find(i => i.id === id);
    if (inputConfig) {
      const err = validate(id, value, inputConfig);
      setErrors(prev => err ? { ...prev, [id]: err } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== id)));
    }
  }, [config.inputs, validate]);

  // ── Apply a preset ─────────────────────────────────────
  const applyPreset = useCallback((preset) => {
    setInputs(prev => ({ ...prev, ...preset.values }));
    setErrors({});
  }, []);

  // ── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setInputs(buildDefaults());
    setErrors({});
    setResult(null);
  }, [buildDefaults]);

  // ── Auto-compute on input change ───────────────────────
  // Debounce: 200ms is optimal — inputs feel instant (state update is immediate)
  // while the expensive compute() runs only after the user pauses typing.
  // startTransition() marks the result state update as non-urgent so React
  // can yield the main thread back to higher-priority events (clicks, keystrokes)
  // before committing the new result — this directly improves INP.
  useEffect(() => {
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    const timer = setTimeout(() => {
      startTransition(() => {
        const res = compute(config.formula, inputs);
        setResult(res.error ? null : res);
        setLoading(false);
      });
    }, 200); // raised from 60ms → 200ms for better INP
    return () => clearTimeout(timer);
  }, [inputs, errors, config.formula, startTransition]);

  // Track recent usage is now handled exclusively in Calculator.tsx

  // ── Format outputs ─────────────────────────────────────
  const formattedOutputs = result?.outputs
    ? config.outputs.reduce((acc, out) => {
        acc[out.id] = formatOutput(result.outputs[out.id], out.format);
        return acc;
      }, {})
    : null;

  return {
    inputs, setInput, applyPreset, reset, errors,
    result, loading, formattedOutputs,
  };
}
