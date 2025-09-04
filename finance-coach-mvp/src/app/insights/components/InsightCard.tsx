'use client';

import { formatCurrency } from '../../../lib/utils/formatting';

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

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h4 className="text-lg font-medium text-gray-900 leading-tight">
          {insight.title}
        </h4>
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
