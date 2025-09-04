'use client';

import { useState } from 'react';
import { formatCurrency } from '../../../lib/utils/formatting';
import { formatDate } from '../../../lib/utils/date';
import { getConfidenceColor, getConfidenceLabel } from '../../../lib/utils/insights';

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

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  isLoading: boolean;
}

type SortField = 'monthlyEstimate' | 'nextExpected';
type SortDirection = 'asc' | 'desc';

export default function SubscriptionsTable({ subscriptions, isLoading }: SubscriptionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('monthlyEstimate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'monthlyEstimate':
        aValue = a.monthlyEstimate;
        bValue = b.monthlyEstimate;
        break;
      case 'nextExpected':
        aValue = new Date(a.nextExpected).getTime();
        bValue = new Date(b.nextExpected).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCancel = (merchant: string) => {
    alert(`Demo: This would cancel the subscription for ${merchant}. In a real app, this would integrate with your bank or subscription management service.`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
        <p className="text-gray-500">
          We couldn't detect any recurring subscriptions from your transaction data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merchant
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('monthlyEstimate')}
              >
                <div className="flex items-center space-x-1">
                  <span>$/mo</span>
                  {sortField === 'monthlyEstimate' && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodicity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Charge
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nextExpected')}
              >
                <div className="flex items-center space-x-1">
                  <span>Next Expected</span>
                  {sortField === 'nextExpected' && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSubscriptions.map((subscription, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {subscription.merchant}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(subscription.monthlyEstimate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {subscription.periodicityDays} days
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(subscription.lastCharge)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(subscription.nextExpected)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleCancel(subscription.merchant)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
