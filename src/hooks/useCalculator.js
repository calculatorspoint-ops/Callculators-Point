import { useState, useEffect, useCallback, useRef } from "react";
import { compute, formatOutput } from "../utils/calculationEngine.js";
import { useAppStore } from "../store/useAppStore";

/**
 * The main hook powering every calculator.
 * Reads config, manages input state, runs calculations.
 */
export function useCalculator(config) {
  const { addRecent } = useAppStore();
  const tracked = useRef(false);

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
    const v = parseFloat(value);
    if (inputConfig.type === "number" || inputConfig.type === "slider") {
      if (isNaN(v)) return "Enter a valid number";
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
  useEffect(() => {
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const res = compute(config.formula, inputs);
      setResult(res.error ? null : res);
      setLoading(false);
    }, 60); // debounce
    return () => clearTimeout(timer);
  }, [inputs, errors, config.formula]);

  // ── Track recent usage (once) ────────────────────────
  useEffect(() => {
    if (!tracked.current && config.id) {
      addRecent(config.id);
      tracked.current = true;
    }
  }, [config.id, addRecent]);

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
