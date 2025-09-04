import { getPreviousMonth, getNextMonth, isWithinLast30Days } from '../date';

describe('date utilities', () => {
  describe('getPreviousMonth', () => {
    it('should return previous month in same year', () => {
      expect(getPreviousMonth('2023', '11')).toBe('2023-10');
      expect(getPreviousMonth('2023', '06')).toBe('2023-05');
    });

    it('should handle January to December rollover', () => {
      expect(getPreviousMonth('2023', '01')).toBe('2022-12');
      expect(getPreviousMonth('2024', '01')).toBe('2023-12');
    });
  });

  describe('getNextMonth', () => {
    it('should return next month in same year', () => {
      expect(getNextMonth('2023', '10')).toBe('2023-11');
      expect(getNextMonth('2023', '05')).toBe('2023-06');
    });

    it('should handle December to January rollover', () => {
      expect(getNextMonth('2023', '12')).toBe('2024-01');
      expect(getNextMonth('2022', '12')).toBe('2023-01');
    });
  });

  describe('isWithinLast30Days', () => {
    it('should return true for recent dates', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isWithinLast30Days(yesterday.toISOString())).toBe(true);
    });

    it('should return false for old dates', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35);
      
      expect(isWithinLast30Days(oldDate.toISOString())).toBe(false);
    });
  });
});
