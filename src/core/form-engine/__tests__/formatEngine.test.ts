import { describe, it, expect } from 'vitest';
import { numericLiveFormatter } from '../formatters/liveFormatter';
import { numericBlurFormatter } from '../formatters/blurFormatter';
import { parseNumericString } from '../parsers/numericParser';

describe('Format Engine & Parser Reversibility', () => {
  describe('Transient State Preservation', () => {
    it('preserves lonely minus sign', () => {
      expect(numericLiveFormatter('-')).toBe('-');
      expect(parseNumericString('-')).toBe('-');
    });

    it('preserves lonely decimal point', () => {
      expect(numericLiveFormatter('.')).toBe('.');
      expect(numericLiveFormatter('0.')).toBe('0.');
    });

    it('preserves trailing decimal without collapsing', () => {
      expect(numericLiveFormatter('1200.')).toBe('1,200.');
      expect(parseNumericString('1,200.')).toBe('1200.');
    });
  });

  describe('Scientific Notation', () => {
    it('preserves scientific notation during live typing', () => {
      expect(numericLiveFormatter('1e')).toBe('1e');
      expect(numericLiveFormatter('1e-')).toBe('1e-');
      expect(numericLiveFormatter('3.2e-8')).toBe('3.2e-8');
    });

    it('correctly parses scientific notation into numbers', () => {
      expect(parseNumericString('1e6')).toBe(1000000);
      expect(parseNumericString('1e-3')).toBe(0.001);
    });
  });

  describe('Reversibility and Sync', () => {
    it('perfectly cycles String -> Parser -> Formatter', () => {
      const rawInput = '1,234,567.89';
      const parsed = parseNumericString(rawInput);
      expect(parsed).toBe(1234567.89);
      
      const blurred = numericBlurFormatter(parsed as number);
      expect(blurred).toBe('1,234,567.89');
    });
  });
});
