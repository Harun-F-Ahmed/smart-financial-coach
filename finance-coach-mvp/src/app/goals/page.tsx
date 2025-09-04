'use client';

import { useState, useEffect } from 'react';
import GoalsForm from './components/GoalsForm';
import GoalsSummary from './components/GoalsSummary';
import GoalsPlanTable from './components/GoalsPlanTable';
import QuickWinsCard from './components/QuickWinsCard';

interface GoalsResponse {
  onTrack: boolean;
  monthlyTarget: number;
  forecast: {
    method: 'mean' | 'regression' | 'expSmooth';
    savings: number;
    interval: { low: number; high: number };
    probabilityOnTrack: number;
  };
  shortfall: number;
  plan: Array<{
    category: string;
    proposedCut: number;
    rationale: string;
    microActions: string[];
  }>;
  alternatives: {
    cancelSubscriptions: Array<{ label: string; save: number }>;
  };
  meta: {
    monthsAnalyzed: number;
    methodTried: string[];
    chosen: string;
    debug?: any;
  };
}

export default function GoalsPage() {
  const [result, setResult] = useState<GoalsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Check for debug mode in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setDebugMode(urlParams.get('debug') === '1');
  }, []);

  const handleSubmit = async (data: { targetAmount: number; months: number }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: any = {
        targetAmount: data.targetAmount,
        months: data.months
      };

      if (debugMode) {
        payload.extras = 'debug';
      }

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.hint || errorData.error || 'Failed to analyze goal');
      }

      const resultData: GoalsResponse = await response.json();
      setResult(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
        <p className="mt-2 text-gray-600">Set savings targets and get personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goal Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Set Your Goal</h3>
          <GoalsForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Results Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Analysis</h3>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Analyzing your goal...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Analysis Failed</h4>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && !result && (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Enter your goal details to see the analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <GoalsSummary
            onTrack={result.onTrack}
            monthlyTarget={result.monthlyTarget}
            forecast={result.forecast}
          />

          {/* Cut Plan or Efficiency Ideas */}
          <GoalsPlanTable
            plan={result.plan}
            shortfall={result.shortfall}
          />

          {/* Quick Wins */}
          {result.alternatives.cancelSubscriptions.length > 0 && (
            <QuickWinsCard
              cancelSubscriptions={result.alternatives.cancelSubscriptions}
            />
          )}

          {/* Debug Info */}
          {debugMode && result.meta.debug && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Debug Information</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(result.meta.debug, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
