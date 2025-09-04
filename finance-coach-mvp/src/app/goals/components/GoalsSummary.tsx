'use client';

interface Forecast {
  method: 'mean' | 'regression' | 'expSmooth';
  savings: number;
  interval: { low: number; high: number };
  probabilityOnTrack: number;
}

interface GoalsSummaryProps {
  onTrack: boolean;
  monthlyTarget: number;
  forecast: Forecast;
}

export default function GoalsSummary({ onTrack, monthlyTarget, forecast }: GoalsSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'mean': return 'Average';
      case 'regression': return 'Trend';
      case 'expSmooth': return 'Recent';
      default: return method;
    }
  };

  const probabilityPercentage = Math.round(forecast.probabilityOnTrack * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Goal Analysis</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          onTrack 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {onTrack ? 'On Track' : 'Needs Adjustment'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Target */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Monthly Target</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(monthlyTarget)}
          </p>
        </div>

        {/* Forecasted Savings */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Forecasted Savings</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(forecast.savings)}
          </p>
          <p className="text-xs text-gray-500">
            {getMethodLabel(forecast.method)} method
          </p>
        </div>

        {/* Probability */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Success Probability</p>
          <p className="text-2xl font-semibold text-gray-900">
            {probabilityPercentage}%
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  probabilityPercentage >= 70 ? 'bg-green-500' :
                  probabilityPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${probabilityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Interval */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Forecast range: {formatCurrency(forecast.interval.low)} - {formatCurrency(forecast.interval.high)}
        </p>
      </div>
    </div>
  );
}

