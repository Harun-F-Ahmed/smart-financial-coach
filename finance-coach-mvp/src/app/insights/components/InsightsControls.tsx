'use client';

interface InsightsControlsProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  showExtras: boolean;
  onExtrasToggle: (show: boolean) => void;
  coachTone: boolean;
  onCoachToneToggle: (tone: boolean) => void;
}

export default function InsightsControls({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  showExtras,
  onExtrasToggle,
  coachTone,
  onCoachToneToggle
}: InsightsControlsProps) {
  // Generate year options (2023-2025)
  const generateYearOptions = () => {
    const years = [];
    for (let year = 2023; year <= 2025; year++) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  // Generate month options for the selected year
  const generateMonthOptions = () => {
    const options = [];
    const year = parseInt(selectedYear);
    const currentDate = new Date();
    
    // If selected year is current year, only show months up to current month
    const maxMonth = year === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;
    
    for (let month = 1; month <= maxMonth; month++) {
      const date = new Date(year, month - 1, 1);
      const monthStr = month.toString().padStart(2, '0');
      const label = date.toLocaleDateString('en-US', { month: 'long' });
      options.push({ value: monthStr, label });
    }
    
    return options;
  };

  const yearOptions = generateYearOptions();
  const monthOptions = generateMonthOptions();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Insights Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Year Selector */}
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Show Extras Toggle */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="show-extras"
              type="checkbox"
              checked={showExtras}
              onChange={(e) => onExtrasToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="show-extras" className="text-sm font-medium text-gray-700">
              Show extras
            </label>
            <p className="text-xs text-gray-500">Include bonus insights</p>
          </div>
        </div>

        {/* Coach Tone Toggle */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="coach-tone"
              type="checkbox"
              checked={coachTone}
              onChange={(e) => onCoachToneToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="coach-tone" className="text-sm font-medium text-gray-700">
              Coach tone
            </label>
            <p className="text-xs text-gray-500">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
