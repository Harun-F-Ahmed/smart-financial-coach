'use client';

interface KPIData {
  income: number;
  expenses: number;
  savings: number;
  savingsDelta?: number;
}

interface DashboardKPIsProps {
  data: KPIData;
  isLoading: boolean;
}

export default function DashboardKPIs({ data, isLoading }: DashboardKPIsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDelta = (delta: number) => {
    const isPositive = delta >= 0;
    const sign = isPositive ? '+' : '';
    return `${sign}${formatCurrency(delta)}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              {i === 2 && <div className="h-4 bg-gray-200 rounded w-1/2"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Income</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(data.income)}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Expenses</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(data.expenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Savings</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data.savings)}
              </p>
              {data.savingsDelta !== undefined && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.savingsDelta >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formatDelta(data.savingsDelta)}
                </span>
              )}
            </div>
            {data.savingsDelta !== undefined && (
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
