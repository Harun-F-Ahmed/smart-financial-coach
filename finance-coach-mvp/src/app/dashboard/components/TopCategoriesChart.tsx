'use client';

interface CategoryData {
  category: string;
  total: number;
}

interface TopCategoriesChartProps {
  data: CategoryData[];
  isLoading: boolean;
}

export default function TopCategoriesChart({ data, isLoading }: TopCategoriesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No category data for this month</p>
          </div>
        </div>
      </div>
    );
  }

  // Take top 5 categories
  const topCategories = data.slice(0, 5);
  const maxAmount = Math.max(...topCategories.map(c => c.total));

  // Color palette for categories
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
      
      <div className="space-y-3">
        {topCategories.map((category, index) => {
          const percentage = (category.total / maxAmount) * 100;
          const color = colors[index % colors.length];
          
          return (
            <div key={category.category} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600 truncate">
                {category.category}
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
              <div className="w-20 text-sm font-medium text-gray-900 text-right">
                {formatCurrency(category.total)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total of top 5:</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(topCategories.reduce((sum, c) => sum + c.total, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
