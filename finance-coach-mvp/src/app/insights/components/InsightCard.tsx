'use client';

import { formatCurrency } from '../../../lib/utils/formatting';
import { getConfidenceColor, getConfidenceLabel } from '../../../lib/utils/insights';

interface Insight {
  id: string;
  title: string;
  detail: string;
  impact: { monthly: number; annual: number };
  confidence: number;
  tags: string[];
}

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {

  const confidencePercentage = Math.round(insight.confidence * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-medium text-gray-900 leading-tight">
          {insight.title}
        </h4>
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className={`h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {getConfidenceLabel(insight.confidence)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed" style={{ maxWidth: '60ch' }}>
        {insight.detail}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {insight.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Monthly impact:</span>{' '}
          <span className="text-green-600 font-semibold">
            {formatCurrency(insight.impact.monthly)}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Annual:</span>{' '}
          <span className="text-green-600 font-semibold">
            {formatCurrency(insight.impact.annual)}
          </span>
        </div>
      </div>
    </div>
  );
}
