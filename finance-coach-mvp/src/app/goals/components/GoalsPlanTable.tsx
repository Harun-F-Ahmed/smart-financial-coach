'use client';

interface PlanItem {
  category: string;
  proposedCut: number;
  rationale: string;
  microActions: string[];
}

interface GoalsPlanTableProps {
  plan: PlanItem[];
  shortfall: number;
}

export default function GoalsPlanTable({ plan, shortfall }: GoalsPlanTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalProposedSavings = plan.reduce((sum, item) => sum + item.proposedCut, 0);

  if (plan.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Efficiency Ideas</h3>
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Great job!</h4>
              <p className="text-sm text-green-700">
                You're on track to meet your goal. Here are some optional efficiency ideas:
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Coffee:</strong> Brew at home 3×/week; keep 2 café visits as treats
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Transportation:</strong> Replace 2 weekend rides with transit/carpool
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Entertainment:</strong> Skip one ticketed event; use free/low-cost options
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Cut Plan</h3>
          <div className="text-sm text-gray-500">
            Covers {formatCurrency(totalProposedSavings)} of {formatCurrency(shortfall)} shortfall
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proposed Cut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rationale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Micro-actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plan.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(item.proposedCut)}/mo
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs">
                    {item.rationale}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ul className="text-sm text-gray-700 space-y-1">
                    {item.microActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalProposedSavings < shortfall && (
        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This plan covers {formatCurrency(totalProposedSavings)} of your {formatCurrency(shortfall)} shortfall. 
                Consider additional cuts or extending your timeline.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

