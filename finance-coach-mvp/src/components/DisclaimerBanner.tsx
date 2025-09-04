'use client';

import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="glass border-l-4 border-amber-400 p-4 mb-6 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-gray-700">
            <strong className="text-amber-600">Synthetic data • Not financial advice</strong> — This demo uses generated transaction data for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
