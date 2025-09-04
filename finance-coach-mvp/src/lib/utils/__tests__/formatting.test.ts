import { formatCurrency, formatCurrencyDetailed, formatPercentage, formatDelta, formatNumber } from '../formatting';

describe('formatting utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235');
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,235');
      expect(formatCurrency(-100)).toBe('-$100');
    });
  });

  describe('formatCurrencyDetailed', () => {
    it('should format with 2 decimal places', () => {
      expect(formatCurrencyDetailed(1234.56)).toBe('$1,234.56');
      expect(formatCurrencyDetailed(100)).toBe('$100.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(75.5)).toBe('75.5%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });

  describe('formatDelta', () => {
    it('should format positive deltas with + sign', () => {
      expect(formatDelta(100)).toBe('+$100');
      expect(formatDelta(0)).toBe('+$0');
    });

    it('should format negative deltas with - sign', () => {
      expect(formatDelta(-100)).toBe('-$100');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });
});
