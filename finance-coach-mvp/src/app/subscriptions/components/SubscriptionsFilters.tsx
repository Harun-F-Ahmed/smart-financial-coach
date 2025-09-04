'use client';

interface SubscriptionsFiltersProps {
  showNewOnly: boolean;
  onNewOnlyToggle: (show: boolean) => void;
  hasNewFilter: boolean;
}

export default function SubscriptionsFilters({
  showNewOnly,
  onNewOnlyToggle,
  hasNewFilter
}: SubscriptionsFiltersProps) {
  if (!hasNewFilter) {
    return null; // Don't show filters if there are no new subscriptions
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* New Subscriptions Filter */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="show-new-only"
              type="checkbox"
              checked={showNewOnly}
              onChange={(e) => onNewOnlyToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="show-new-only" className="text-sm font-medium text-gray-700">
              Show only "new in last 30 days"
            </label>
            <p className="text-xs text-gray-500">Recently detected subscriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
