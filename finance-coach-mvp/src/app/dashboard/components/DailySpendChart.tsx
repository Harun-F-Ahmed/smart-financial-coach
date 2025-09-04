'use client';

import { formatCurrency } from '../../../lib/utils/formatting';
import { formatDateShort } from '../../../lib/utils/date';

interface DailySpendData {
  date: string;
  spend: number;
}

interface DailySpendChartProps {
  data: DailySpendData[];
  isLoading: boolean;
}

export default function DailySpendChart({ data, isLoading }: DailySpendChartProps) {

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Spending</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Spending</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No spending data for this month</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions and scaling
  const maxSpend = Math.max(...data.map(d => d.spend));
  const chartHeight = 200;
  const chartWidth = Math.max(400, data.length * 20);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Spending</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-full" style={{ width: `${chartWidth}px` }}>
          <svg height={chartHeight} width="100%" className="w-full">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1="0"
                  y1={chartHeight * ratio}
                  x2="100%"
                  y2={chartHeight * ratio}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y={chartHeight * ratio - 5}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="start"
                >
                  {formatCurrency(maxSpend * (1 - ratio))}
                </text>
              </g>
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = chartHeight - (d.spend / maxSpend) * chartHeight;
                return `${x}%,${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = chartHeight - (d.spend / maxSpend) * chartHeight;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={y}
                  r="3"
                  fill="#3b82f6"
                  className="hover:r-4 transition-all"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {data.map((d, i) => (
              <span key={i} className="text-center">
                {formatDateShort(d.date)}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-semibold">{formatCurrency(data.reduce((sum, d) => sum + d.spend, 0))}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average</p>
          <p className="font-semibold">{formatCurrency(data.reduce((sum, d) => sum + d.spend, 0) / data.length)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Peak</p>
          <p className="font-semibold">{formatCurrency(maxSpend)}</p>
        </div>
      </div>
    </div>
  );
}
