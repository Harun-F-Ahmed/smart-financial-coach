'use client';

interface SubscriptionsFiltersProps {
  showGrayOnly: boolean;
  onGrayOnlyToggle: (show: boolean) => void;
  showNewOnly: boolean;
  onNewOnlyToggle: (show: boolean) => void;
  hasNewFilter: boolean;
}

export default function SubscriptionsFilters({
  showGrayOnly,
  onGrayOnlyToggle,
  showNewOnly,
  onNewOnlyToggle,
  hasNewFilter
}: SubscriptionsFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Gray Charges Filter */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="show-gray-only"
              type="checkbox"
              checked={showGrayOnly}
              onChange={(e) => onGrayOnlyToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="show-gray-only" className="text-sm font-medium text-gray-700">
              Show only "gray" charges
            </label>
            <p className="text-xs text-gray-500">Subscriptions that may be unwanted or forgotten</p>
          </div>
        </div>

        {/* New Subscriptions Filter */}
        {hasNewFilter && (
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
        )}
      </div>
    </div>
  );
}
