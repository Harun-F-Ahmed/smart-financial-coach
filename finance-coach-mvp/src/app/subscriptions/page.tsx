'use client';

import { useState, useEffect } from 'react';
import SubscriptionsFilters from './components/SubscriptionsFilters';
import SubscriptionsSummary from './components/SubscriptionsSummary';
import SubscriptionsTable from './components/SubscriptionsTable';

interface Subscription {
  merchant: string;
  periodicityDays: number;
  monthlyEstimate: number;
  lastCharge: string;
  nextExpected: string;
  isGray: boolean;
  confidence: number;
  features: {
    n: number;
    periodicityStrength: number;
    amountStability: number;
    domStability: number;
    recencyBoost: number;
  };
}

interface SubscriptionsResponse {
  items: Subscription[];
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGrayOnly, setShowGrayOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Apply filters when subscriptions or filter states change
  useEffect(() => {
    let filtered = [...subscriptions];

    if (showGrayOnly) {
      filtered = filtered.filter(sub => sub.isGray);
    }

    if (showNewOnly) {
      // Filter for subscriptions that started in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter(sub => {
        const lastChargeDate = new Date(sub.lastCharge);
        // If we have fewer than 3 occurrences, it's likely new
        return sub.features.n < 3 || lastChargeDate >= thirtyDaysAgo;
      });
    }

    setFilteredSubscriptions(filtered);
  }, [subscriptions, showGrayOnly, showNewOnly]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscriptions');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subscriptions');
      }

      const result: SubscriptionsResponse = await response.json();
      setSubscriptions(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchSubscriptions();
  };

  // Check if we have enough data to show the "new" filter
  const hasNewFilter = subscriptions.some(sub => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const lastChargeDate = new Date(sub.lastCharge);
    return sub.features.n < 3 || lastChargeDate >= thirtyDaysAgo;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="mt-2 text-gray-600">Manage your recurring subscriptions and detect gray charges</p>
      </div>

      {/* Filters */}
      <SubscriptionsFilters
        showGrayOnly={showGrayOnly}
        onGrayOnlyToggle={setShowGrayOnly}
        showNewOnly={showNewOnly}
        onNewOnlyToggle={setShowNewOnly}
        hasNewFilter={hasNewFilter}
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
              <h3 className="text-sm font-medium text-red-800">Failed to load subscriptions</h3>
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

      {/* Summary */}
      {!isLoading && !error && subscriptions.length > 0 && (
        <SubscriptionsSummary subscriptions={subscriptions} />
      )}

      {/* Table */}
      <SubscriptionsTable 
        subscriptions={filteredSubscriptions} 
        isLoading={isLoading}
      />
    </div>
  );
}