'use client';

import { formatCurrency } from '../../../lib/utils/formatting';

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

interface SubscriptionsSummaryProps {
  subscriptions: Subscription[];
}

export default function SubscriptionsSummary({ subscriptions }: SubscriptionsSummaryProps) {

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.monthlyEstimate, 0);
  const totalAnnual = totalMonthly * 12;
  const grayCount = subscriptions.filter(sub => sub.isGray).length;
  const grayMonthly = subscriptions
    .filter(sub => sub.isGray)
    .reduce((sum, sub) => sum + sub.monthlyEstimate, 0);
  const avgConfidence = subscriptions.length > 0 
    ? subscriptions.reduce((sum, sub) => sum + sub.confidence, 0) / subscriptions.length 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{subscriptions.length}</p>
          <p className="text-sm text-gray-500">Total Subscriptions</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(totalMonthly)}
          </p>
          <p className="text-sm text-gray-500">Monthly Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(totalAnnual)}
          </p>
          <p className="text-sm text-gray-500">Annual Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-600">{grayCount}</p>
          <p className="text-sm text-gray-500">Gray Charges</p>
          <p className="text-xs text-gray-400">
            ({formatCurrency(grayMonthly)}/mo)
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {Math.round(avgConfidence * 100)}%
          </p>
          <p className="text-sm text-gray-500">Avg Confidence</p>
        </div>
      </div>
    </div>
  );
}
