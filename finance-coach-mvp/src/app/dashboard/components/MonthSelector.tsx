'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';

interface MonthSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthSelector({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange
}: MonthSelectorProps) {
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center mb-6">
        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Select Month</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Month Selector */}
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <div className="relative">
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year Selector */}
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <div className="relative">
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
