'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '../../../lib/utils/formatting';

interface GoalsFormProps {
  onSubmit: (data: { targetAmount: number; months: number }) => void;
  isLoading: boolean;
}

export default function GoalsForm({ onSubmit, isLoading }: GoalsFormProps) {
  const [targetAmount, setTargetAmount] = useState('');
  const [timelineType, setTimelineType] = useState<'months' | 'date'>('months');
  const [months, setMonths] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('goals-form');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTargetAmount(data.targetAmount || '');
        setTimelineType(data.timelineType || 'months');
        setMonths(data.months || '');
        setTargetDate(data.targetDate || '');
      } catch (e) {
        // Ignore invalid localStorage data
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const data = {
      targetAmount,
      timelineType,
      months,
      targetDate
    };
    localStorage.setItem('goals-form', JSON.stringify(data));
  }, [targetAmount, timelineType, months, targetDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate target amount
    const amount = parseFloat(targetAmount);
    if (!targetAmount || isNaN(amount) || amount <= 0) {
      newErrors.targetAmount = 'Enter a positive target amount';
    } else if (amount > 1000000) {
      newErrors.targetAmount = 'Target amount seems too high';
    }

    // Validate timeline
    if (timelineType === 'months') {
      const monthsNum = parseInt(months);
      if (!months || isNaN(monthsNum) || monthsNum < 1 || monthsNum > 120) {
        newErrors.months = 'Enter months between 1 and 120';
      }
    } else {
      if (!targetDate) {
        newErrors.targetDate = 'Select a target date';
      } else {
        const date = new Date(targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(date.getTime())) {
          newErrors.targetDate = 'Invalid date format';
        } else if (date <= today) {
          newErrors.targetDate = 'Target date must be in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMonthsToGoal = (): number => {
    if (timelineType === 'months') {
      return parseInt(months);
    } else {
      const target = new Date(targetDate);
      const today = new Date();
      const yearDiff = target.getFullYear() - today.getFullYear();
      const monthDiff = target.getMonth() - today.getMonth();
      return yearDiff * 12 + monthDiff;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const monthsToGoal = calculateMonthsToGoal();
    const amount = parseFloat(targetAmount);

    onSubmit({
      targetAmount: amount,
      months: monthsToGoal
    });
  };

  const isFormValid = () => {
    return targetAmount && 
           ((timelineType === 'months' && months) || (timelineType === 'date' && targetDate)) &&
           Object.keys(errors).length === 0;
  };

  const formatCurrencyInput = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return formatCurrency(num);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
          Target Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className={`block w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.targetAmount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="5000"
            min="1"
            step="1"
            required
          />
        </div>
        {errors.targetAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          How much do you want to save?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Timeline
        </label>
        
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="timelineType"
              value="months"
              checked={timelineType === 'months'}
              onChange={(e) => setTimelineType(e.target.value as 'months')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">By months</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="timelineType"
              value="date"
              checked={timelineType === 'date'}
              onChange={(e) => setTimelineType(e.target.value as 'date')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">By date</span>
          </label>
        </div>

        {timelineType === 'months' ? (
          <div>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.months ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="12"
              min="1"
              max="120"
              required
            />
            {errors.months && (
              <p className="mt-1 text-sm text-red-600">{errors.months}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              How many months to reach your goal?
            </p>
          </div>
        ) : (
          <div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.targetDate ? 'border-red-300' : 'border-gray-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.targetDate && (
              <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              When do you want to reach your goal?
            </p>
          </div>
        )}
      </div>

      {isFormValid() && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Goal Summary</h4>
          <p className="text-sm text-blue-700">
            Save {formatCurrency(targetAmount)} in {calculateMonthsToGoal()} months
            ({formatCurrency((parseFloat(targetAmount) / calculateMonthsToGoal()).toString())} per month)
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid() || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Goal'}
      </button>
    </form>
  );
}

