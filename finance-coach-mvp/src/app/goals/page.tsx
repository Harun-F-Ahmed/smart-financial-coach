'use client';

import { useState } from 'react';

export default function GoalsPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [months, setMonths] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAmount && months) {
      setIsSubmitted(true);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount ($)
              </label>
              <input
                type="number"
                id="targetAmount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
                Timeline (months)
              </label>
              <input
                type="number"
                id="months"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12"
                min="1"
                max="120"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Analyze Goal
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Analysis</h3>
          
          {!isSubmitted ? (
            <div className="text-center py-12">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Enter your goal details to see the analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* On Track Status */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Goal Status</h4>
                    <p className="text-sm text-yellow-700">Currently not on track</p>
                  </div>
                </div>
              </div>

              {/* Required Monthly Savings */}
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Monthly Savings</h4>
                <p className="text-2xl font-semibold text-gray-900">
                  ${targetAmount && months ? (parseFloat(targetAmount) / parseFloat(months)).toFixed(2) : '0'}
                </p>
              </div>

              {/* Suggestions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Suggested Cuts</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Reduce coffee spending by $50/month</p>
                  <p>• Cut restaurant expenses by $100/month</p>
                  <p>• Review subscription services</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Visualization</h3>
        <div className="h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-500">Progress chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
