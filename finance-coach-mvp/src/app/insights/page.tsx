export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="mt-2 text-gray-600">Smart analysis of your spending patterns</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
        <p className="text-gray-500 mb-6">
          Once you have transaction data, we'll analyze your spending patterns and provide personalized insights.
        </p>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Coffee spending analysis and savings suggestions</p>
          <p>• Top merchant changes month-over-month</p>
          <p>• Weekend vs weekday spending patterns</p>
          <p>• Subscription cost optimization tips</p>
        </div>
      </div>

      {/* Placeholder for Future Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Insights</h3>
        <div className="space-y-4">
          <div className="h-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-gray-500">Insights will appear here</p>
          </div>
          <div className="h-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-gray-500">More insights coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
