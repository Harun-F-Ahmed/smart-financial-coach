'use client';

import { useState, useEffect } from 'react';
import MonthSelector from './components/MonthSelector';
import DashboardKPIs from './components/DashboardKPIs';
import DailySpendChart from './components/DailySpendChart';
import TopCategoriesChart from './components/TopCategoriesChart';
import { getPreviousMonth } from '../../lib/utils/date';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: string;
  accountId: string;
  description: string | null;
}

interface CategoryRollup {
  category: string;
  total: number;
}

interface DailySpend {
  date: string;
  spend: number;
}

interface TransactionResponse {
  month: string;
  items: Transaction[];
  rollups: {
    totals: {
      income: number;
      expenses: number;
      savings: number;
    };
    byCategory: CategoryRollup[];
    dailySpend: DailySpend[];
  };
  meta: {
    txCount: number;
  };
}

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2023'); // Default to seeded year
  const [selectedMonth, setSelectedMonth] = useState('11'); // Default to seeded month (November)
  const [currentData, setCurrentData] = useState<TransactionResponse | null>(null);
  const [previousData, setPreviousData] = useState<TransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when month changes
  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const monthParam = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      
      // Fetch current month data
      const currentResponse = await fetch(`/api/transactions?month=${monthParam}`);
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current month data');
      }
      const current = await currentResponse.json();
      setCurrentData(current);

      // Fetch previous month data for comparison
      const prevMonth = getPreviousMonth(selectedYear, selectedMonth);
      const prevResponse = await fetch(`/api/transactions?month=${prevMonth}`);
      if (prevResponse.ok) {
        const previous = await prevResponse.json();
        setPreviousData(previous);
      } else {
        // Previous month might not exist, that's okay
        setPreviousData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const handleRetry = () => {
    fetchData();
  };

  // Calculate savings delta
  const savingsDelta = currentData && previousData 
    ? currentData.rollups.totals.savings - previousData.rollups.totals.savings
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your financial activity</p>
      </div>

      {/* Month Selector */}
      <MonthSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Failed to load dashboard data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {currentData && (
        <DashboardKPIs
          data={{
            income: currentData.rollups.totals.income,
            expenses: currentData.rollups.totals.expenses,
            savings: currentData.rollups.totals.savings,
            savingsDelta
          }}
          isLoading={isLoading}
        />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spend Chart */}
        <DailySpendChart
          data={currentData?.rollups.dailySpend || []}
          isLoading={isLoading}
        />

        {/* Top Categories Chart */}
        <TopCategoriesChart
          data={currentData?.rollups.byCategory || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}