'use client';

import { formatCurrency } from '../../../lib/utils/formatting';

interface QuickWin {
  label: string;
  save: number;
}

interface QuickWinsCardProps {
  cancelSubscriptions: QuickWin[];
}

export default function QuickWinsCard({ cancelSubscriptions }: QuickWinsCardProps) {

  if (cancelSubscriptions.length === 0) {
    return null;
  }

  const totalSavings = cancelSubscriptions.reduce((sum, item) => sum + item.save, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">Quick Wins</h3>
          <p className="text-sm text-gray-500">
            Potential savings from unused subscriptions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {cancelSubscriptions.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">
                  Monthly subscription
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(item.save)}/mo
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(item.save * 12)}/year
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total potential savings:</span>
          <span className="text-lg font-semibold text-green-600">
            {formatCurrency(totalSavings)}/mo
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatCurrency(totalSavings * 12)} annually
        </p>
      </div>

      <div className="mt-4">
        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium">
          Review Subscriptions
        </button>
      </div>
    </div>
  );
}

