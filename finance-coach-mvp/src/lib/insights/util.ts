// Utility functions for insights engine

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  merchant: string;
  category: string;
  accountId: string;
  description: string | null;
}

// Date utilities
export function parseMonth(monthStr: string): DateRange {
  const [year, month] = monthStr.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1); // First day of next month
  return { start, end };
}

export function getPreviousMonth(monthStr: string): DateRange {
  const [year, month] = monthStr.split('-').map(Number);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return parseMonth(`${prevYear}-${prevMonth.toString().padStart(2, '0')}`);
}

export function getDaysInMonth(monthStr: string): number {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

export function getDayOfMonth(date: Date): number {
  return date.getDate();
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

// Statistical utilities
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

export function mean(values: number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const avgSquaredDiff = mean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

export function iqr(values: number[]): { q1: number; q3: number; iqr: number } {
  if (values.length === 0) return { q1: 0, q3: 0, iqr: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  return { q1, q3, iqr: q3 - q1 };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundToWhole(value: number): number {
  return Math.round(value);
}

// Transaction filtering utilities
export function filterByDateRange(transactions: Transaction[], range: DateRange): Transaction[] {
  return transactions.filter(t => t.date >= range.start && t.date < range.end);
}

export function filterByCategory(transactions: Transaction[], category: string): Transaction[] {
  return transactions.filter(t => t.category === category);
}

export function filterByMerchantKeywords(transactions: Transaction[], keywords: string[]): Transaction[] {
  return transactions.filter(t => 
    keywords.some(keyword => 
      t.merchant.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

export function filterByAmountRange(transactions: Transaction[], min: number, max: number): Transaction[] {
  return transactions.filter(t => Math.abs(t.amount) >= min && Math.abs(t.amount) <= max);
}

export function getIncome(transactions: Transaction[]): Transaction[] {
  return transactions.filter(t => t.amount > 0);
}

export function getExpenses(transactions: Transaction[]): Transaction[] {
  return transactions.filter(t => t.amount < 0);
}

export function getExpenseAmounts(transactions: Transaction[]): number[] {
  return getExpenses(transactions).map(t => Math.abs(t.amount));
}

// Grouping utilities
export function groupByMerchant(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    if (!groups[t.merchant]) groups[t.merchant] = [];
    groups[t.merchant].push(t);
  });
  return groups;
}

export function groupByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  return groups;
}

export function groupByWeekday(transactions: Transaction[]): { weekday: Transaction[]; weekend: Transaction[] } {
  return {
    weekday: transactions.filter(t => !isWeekend(t.date)),
    weekend: transactions.filter(t => isWeekend(t.date))
  };
}

// Merchant redaction for privacy
const MERCHANT_REDACTION_MAP: Record<string, string> = {
  'starbucks': 'coffee shop',
  'dunkin': 'coffee shop',
  'dunkin donuts': 'coffee shop',
  'peet\'s coffee': 'coffee shop',
  'local coffee': 'coffee shop',
  'netflix': 'streaming service',
  'spotify': 'music service',
  'amazon': 'online retailer',
  'apple icloud': 'cloud storage',
  'uber': 'rideshare service',
  'lyft': 'rideshare service',
  'whole foods': 'grocery store',
  'target': 'retail store',
  'costco': 'wholesale store',
  'chipotle': 'restaurant',
  'sweetgreen': 'restaurant',
  'panera': 'restaurant',
  'mcdonald\'s': 'restaurant',
  'subway': 'restaurant',
  'olive garden': 'restaurant',
  'local bistro': 'restaurant',
  'shell': 'gas station',
  'cvs': 'pharmacy',
  'employer': 'employer'
};

export function redactMerchant(merchant: string): string {
  const lower = merchant.toLowerCase();
  return MERCHANT_REDACTION_MAP[lower] || 'a service';
}

// Keyword matching
export function containsKeywords(text: string | null, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(keyword => lower.includes(keyword.toLowerCase()));
}

export const FEE_KEYWORDS = ['fee', 'atm fee', 'overdraft', 'service fee'];
export const TRIAL_KEYWORDS = ['trial', 'renewal', 'promo'];

// Discretionary categories
export const DISCRETIONARY_CATEGORIES = [
  'Restaurants',
  'Coffee', 
  'Rideshare',
  'Entertainment',
  'Subscriptions'
];

// Coffee detection
export const COFFEE_KEYWORDS = ['starbucks', 'dunkin', 'coffee', 'peet\'s'];

export function isCoffeeTransaction(transaction: Transaction): boolean {
  return transaction.category === 'Coffee' || 
         containsKeywords(transaction.merchant, COFFEE_KEYWORDS);
}

// Amount matching for duplicate detection
export function amountsMatch(amount1: number, amount2: number, tolerance: number = 1.0): boolean {
  return Math.abs(Math.abs(amount1) - Math.abs(amount2)) <= tolerance;
}

// Date utilities for duplicate detection
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}
