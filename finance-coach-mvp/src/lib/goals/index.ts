// Main goals engine that orchestrates forecasting and cut planning

import { Transaction } from '../insights/util';
import { MonthlyData, forecastSavings } from './forecast';
import { optimizeCutPlan, CutPlan } from './optimizer';

export interface GoalsRequest {
  targetAmount: number;
  months?: number;
  by?: string;
  extras?: 'debug';
  aiSuggest?: boolean;
}

export interface GoalsResponse {
  onTrack: boolean;
  monthlyTarget: number;
  forecast: {
    method: 'mean' | 'regression' | 'expSmooth';
    savings: number;
    interval: { low: number; high: number };
    probabilityOnTrack: number;
  };
  shortfall: number;
  plan: Array<{
    category: string;
    proposedCut: number;
    rationale: string;
    microActions: string[];
  }>;
  alternatives: {
    cancelSubscriptions: Array<{ label: string; save: number }>;
  };
  meta: {
    monthsAnalyzed: number;
    methodTried: string[];
    chosen: string;
    debug?: any;
  };
}

// Discretionary categories for cut planning
const DISCRETIONARY_CATEGORIES = [
  'Restaurants',
  'Coffee',
  'Rideshare',
  'Entertainment',
  'Subscriptions'
];

// Parse date string to Date object
function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
}

// Calculate months between two dates
function monthsBetween(start: Date, end: Date): number {
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  return yearDiff * 12 + monthDiff;
}

// Group transactions by month
function groupTransactionsByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const monthKey = `${transaction.date.getFullYear()}-${(transaction.date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(transaction);
  });
  
  return groups;
}

// Calculate monthly aggregates
function calculateMonthlyAggregates(transactions: Transaction[]): MonthlyData {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const savings = income - expenses;
  
  return {
    month: 0, // Will be set by caller
    income: Math.round(income),
    expenses: Math.round(expenses),
    savings: Math.round(savings)
  };
}

// Calculate category spends for a month
function calculateCategorySpends(transactions: Transaction[]): Record<string, number> {
  const spends: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    
    if (!spends[category]) {
      spends[category] = 0;
    }
    spends[category] += amount;
  });
  
  // Round all values
  Object.keys(spends).forEach(category => {
    spends[category] = Math.round(spends[category]);
  });
  
  return spends;
}

// Get last N full months of data
function getLastNMonths(monthGroups: Record<string, Transaction[]>, n: number): MonthlyData[] {
  const sortedMonths = Object.keys(monthGroups).sort();
  const lastNMonths = sortedMonths.slice(-n);
  
  return lastNMonths.map((monthKey, index) => {
    const transactions = monthGroups[monthKey];
    const aggregates = calculateMonthlyAggregates(transactions);
    return {
      ...aggregates,
      month: index
    };
  });
}

// Get category spend history
function getCategorySpendHistory(
  monthGroups: Record<string, Transaction[]>, 
  categories: string[]
): Record<string, number[]> {
  const history: Record<string, number[]> = {};
  
  // Initialize arrays for each category
  categories.forEach(category => {
    history[category] = [];
  });
  
  // Sort months and collect data
  const sortedMonths = Object.keys(monthGroups).sort();
  
  sortedMonths.forEach(monthKey => {
    const transactions = monthGroups[monthKey];
    const categorySpends = calculateCategorySpends(transactions);
    
    categories.forEach(category => {
      history[category].push(categorySpends[category] || 0);
    });
  });
  
  return history;
}

// Main goals engine function
export function processGoalsRequest(
  request: GoalsRequest,
  allTransactions: Transaction[],
  graySubscriptions: Array<{ merchant: string; monthlyEstimate: number }> = []
): GoalsResponse {
  // Calculate months to goal
  let monthsToGoal: number;
  
  if (request.months) {
    monthsToGoal = request.months;
  } else if (request.by) {
    const targetDate = parseDate(request.by);
    const currentDate = new Date();
    monthsToGoal = monthsBetween(currentDate, targetDate);
  } else {
    throw new Error('Either months or by date must be provided');
  }
  
  if (monthsToGoal <= 0) {
    throw new Error('Goal timeline must be in the future');
  }
  
  // Calculate required monthly savings
  const monthlyTarget = Math.round(request.targetAmount / monthsToGoal);
  
  // Group transactions by month
  const monthGroups = groupTransactionsByMonth(allTransactions);
  
  // Get last 6 months of data (or fewer if not available)
  const availableMonths = Object.keys(monthGroups).length;
  const monthsToAnalyze = Math.min(6, Math.max(3, availableMonths));
  
  const monthlyData = getLastNMonths(monthGroups, monthsToAnalyze);
  
  if (monthlyData.length === 0) {
    throw new Error('No transaction data available');
  }
  
  // Get most recent month for cut planning
  const mostRecentMonth = Object.keys(monthGroups).sort().pop()!;
  const mostRecentTransactions = monthGroups[mostRecentMonth];
  const currentCategorySpends = calculateCategorySpends(mostRecentTransactions);
  
  // Filter to discretionary categories only
  const discretionarySpends: Record<string, number> = {};
  DISCRETIONARY_CATEGORIES.forEach(category => {
    if (currentCategorySpends[category]) {
      discretionarySpends[category] = currentCategorySpends[category];
    }
  });
  
  // Get category spend history for volatility calculation
  const categorySpendHistory = getCategorySpendHistory(monthGroups, DISCRETIONARY_CATEGORIES);
  
  // Forecast savings
  const forecast = forecastSavings(monthlyData, monthlyTarget);
  
  // Check if on track
  const onTrack = forecast.savings >= monthlyTarget;
  const shortfall = Math.max(0, monthlyTarget - forecast.savings);
  
  // Generate cut plan if needed
  let plan: CutPlan['plan'] = [];
  let alternatives: CutPlan['alternatives'] = { cancelSubscriptions: [] };
  
  if (!onTrack && shortfall > 0) {
    const cutPlan = optimizeCutPlan(
      categorySpendHistory,
      discretionarySpends,
      shortfall,
      graySubscriptions
    );
    
    plan = cutPlan.plan;
    alternatives = cutPlan.alternatives;
  }
  
  // Prepare response
  const response: GoalsResponse = {
    onTrack,
    monthlyTarget,
    forecast,
    shortfall,
    plan,
    alternatives,
    meta: {
      monthsAnalyzed: monthlyData.length,
      methodTried: ['mean', 'regression', 'expSmooth'],
      chosen: forecast.method
    }
  };
  
  // Add debug info if requested
  if (request.extras === 'debug') {
    response.meta.debug = {
      monthlyData,
      categorySpendHistory,
      discretionarySpends,
      monthsToGoal,
      availableMonths
    };
  }
  
  return response;
}
