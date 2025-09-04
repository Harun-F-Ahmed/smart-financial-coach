'use client';

interface InsightsSummaryProps {
  txCount: number;
  totalExpenses: number;
  discretionaryExpenses: number;
  generated: number;
  returned: number;
}

export default function InsightsSummary({
  txCount,
  totalExpenses,
  discretionaryExpenses,
  generated,
  returned
}: InsightsSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const discretionaryPercentage = totalExpenses > 0 
    ? Math.round((discretionaryExpenses / totalExpenses) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Month Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{txCount}</p>
          <p className="text-sm text-gray-500">Transactions</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-sm text-gray-500">Total Expenses</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(discretionaryExpenses)}
          </p>
          <p className="text-sm text-gray-500">Discretionary</p>
          <p className="text-xs text-gray-400">
            ({discretionaryPercentage}%)
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{generated}</p>
          <p className="text-sm text-gray-500">Insights Generated</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{returned}</p>
          <p className="text-sm text-gray-500">Insights Shown</p>
        </div>
      </div>
    </div>
  );
}
