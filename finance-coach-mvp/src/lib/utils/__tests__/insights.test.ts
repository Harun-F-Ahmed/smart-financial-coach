import { calculateInsightScore, rankInsights, selectTopInsights, getConfidenceLabel, getConfidenceColor } from '../insights';
import type { Insight } from '../insights';

describe('insights utilities', () => {
  const mockInsight: Insight = {
    id: 'test-1',
    title: 'Test Insight',
    detail: 'Test detail',
    impact: { monthly: 100, annual: 1200 },
    confidence: 0.8,
    tags: ['test']
  };

  describe('calculateInsightScore', () => {
    it('should calculate score correctly', () => {
      const score = calculateInsightScore(mockInsight);
      // monthlyNormalized = 100/1000 = 0.1, confidence = 0.8
      // score = 0.1 * 0.6 + 0.8 * 0.4 = 0.06 + 0.32 = 0.38
      expect(score).toBeCloseTo(0.38, 2);
    });

    it('should cap monthly impact normalization at 1', () => {
      const highImpactInsight = { ...mockInsight, impact: { monthly: 2000, annual: 24000 } };
      const score = calculateInsightScore(highImpactInsight);
      // monthlyNormalized = 1 (capped), confidence = 0.8
      // score = 1 * 0.6 + 0.8 * 0.4 = 0.6 + 0.32 = 0.92
      expect(score).toBeCloseTo(0.92, 2);
    });
  });

  describe('rankInsights', () => {
    it('should rank insights by score descending', () => {
      const insights: Insight[] = [
        { ...mockInsight, id: 'low', confidence: 0.3, impact: { monthly: 50, annual: 600 } },
        { ...mockInsight, id: 'high', confidence: 0.9, impact: { monthly: 500, annual: 6000 } },
        { ...mockInsight, id: 'medium', confidence: 0.6, impact: { monthly: 200, annual: 2400 } }
      ];

      const ranked = rankInsights(insights);
      expect(ranked[0].id).toBe('high');
      expect(ranked[1].id).toBe('medium');
      expect(ranked[2].id).toBe('low');
    });
  });

  describe('selectTopInsights', () => {
    it('should return top N insights', () => {
      const insights: Insight[] = [
        { ...mockInsight, id: '1', confidence: 0.9 },
        { ...mockInsight, id: '2', confidence: 0.8 },
        { ...mockInsight, id: '3', confidence: 0.7 },
        { ...mockInsight, id: '4', confidence: 0.6 },
        { ...mockInsight, id: '5', confidence: 0.5 }
      ];

      const top3 = selectTopInsights(insights, 3);
      expect(top3).toHaveLength(3);
      expect(top3[0].id).toBe('1');
      expect(top3[1].id).toBe('2');
      expect(top3[2].id).toBe('3');
    });
  });

  describe('getConfidenceLabel', () => {
    it('should return correct labels', () => {
      expect(getConfidenceLabel(0.9)).toBe('High');
      expect(getConfidenceLabel(0.7)).toBe('Medium');
      expect(getConfidenceLabel(0.5)).toBe('Low');
    });
  });

  describe('getConfidenceColor', () => {
    it('should return correct colors', () => {
      expect(getConfidenceColor(0.9)).toBe('bg-green-500');
      expect(getConfidenceColor(0.7)).toBe('bg-yellow-500');
      expect(getConfidenceColor(0.5)).toBe('bg-red-500');
    });
  });
});
