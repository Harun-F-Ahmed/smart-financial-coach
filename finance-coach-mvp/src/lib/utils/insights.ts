/**
 * Insights utility functions
 */

export interface Insight {
  id: string;
  title: string;
  detail: string;
  impact: { monthly: number; annual: number };
  confidence: number;
  tags: string[];
}

export const calculateInsightScore = (insight: Insight): number => {
  // Score = impact.monthly_normalized * 0.6 + confidence * 0.4
  // For monthly_normalized, we'll use a simple normalization based on typical monthly expenses
  const monthlyNormalized = Math.min(insight.impact.monthly / 1000, 1); // Cap at $1000 for normalization
  return monthlyNormalized * 0.6 + insight.confidence * 0.4;
};

export const rankInsights = (insights: Insight[]): Insight[] => {
  return insights
    .map(insight => ({
      ...insight,
      score: calculateInsightScore(insight)
    }))
    .sort((a, b) => b.score - a.score);
};

export const selectTopInsights = (insights: Insight[], limit: number = 5): Insight[] => {
  const ranked = rankInsights(insights);
  return ranked.slice(0, limit);
};

export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Low';
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-500';
  if (confidence >= 0.6) return 'bg-yellow-500';
  return 'bg-red-500';
};
