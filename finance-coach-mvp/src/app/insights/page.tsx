'use client';

import { useState, useEffect } from 'react';
import InsightsControls from './components/InsightsControls';
import InsightsSummary from './components/InsightsSummary';
import InsightCard from './components/InsightCard';

interface Insight {
  id: string;
  title: string;
  detail: string;
  impact: { monthly: number; annual: number };
  confidence: number;
  tags: string[];
}

interface InsightsResponse {
  month: string;
  insights: Insight[];
  meta: {
    txCount: number;
    hasPrevMonth: boolean;
    totalExpenses: number;
    discretionaryExpenses: number;
    selection: { generated: number; returned: number };
    debug?: any;
  };
}

export default function InsightsPage() {
  const [selectedYear, setSelectedYear] = useState('2023'); // Default to seeded year
  const [selectedMonth, setSelectedMonth] = useState('11'); // Default to seeded month (November)
  const [showExtras, setShowExtras] = useState(false);
  const [coachTone, setCoachTone] = useState(false);
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Check for debug mode in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setDebugMode(urlParams.get('debug') === '1');
  }, []);

  // Fetch insights when controls change
  useEffect(() => {
    fetchInsights();
  }, [selectedYear, selectedMonth, showExtras, coachTone]);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const monthParam = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
      const params = new URLSearchParams({
        month: monthParam
      });

      if (showExtras) {
        params.append('extras', 'all');
      }

      if (debugMode) {
        params.append('debug', '1');
      }

      const response = await fetch(`/api/insights?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.hint || errorData.error || 'Failed to fetch insights');
      }

      const result: InsightsResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchInsights();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="mt-2 text-gray-600">Smart analysis of your spending patterns</p>
      </div>

      {/* Controls */}
      <InsightsControls
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        showExtras={showExtras}
        onExtrasToggle={setShowExtras}
        coachTone={coachTone}
        onCoachToneToggle={setCoachTone}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <h3 className="text-sm font-medium text-red-800">Failed to load insights</h3>
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

      {/* Data Display */}
      {data && !isLoading && (
        <div className="space-y-6">
          {/* Summary */}
          <InsightsSummary
            txCount={data.meta.txCount}
            totalExpenses={data.meta.totalExpenses}
            discretionaryExpenses={data.meta.discretionaryExpenses}
            generated={data.meta.selection.generated}
            returned={data.meta.selection.returned}
          />

          {/* Insights */}
          {data.insights.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights for this month</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any actionable insights for {selectedYear}-{selectedMonth.padStart(2, '0')}. Try a different month or enable "Show extras" for more insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}

          {/* Debug Info */}
          {debugMode && data.meta.debug && (
            <div className="bg-gray-50 rounded-lg p-6">
              <details className="group">
                <summary className="cursor-pointer text-lg font-medium text-gray-900 mb-4">
                  Debug Information
                  <span className="ml-2 text-sm text-gray-500 group-open:hidden">(click to expand)</span>
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto bg-white p-4 rounded border">
                  {JSON.stringify(data.meta.debug, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}