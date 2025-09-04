/**
 * Date utility functions
 */

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateShort = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const getPreviousMonth = (year: string, month: string): string => {
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  if (monthNum === 1) {
    return `${yearNum - 1}-12`;
  } else {
    return `${yearNum}-${(monthNum - 1).toString().padStart(2, '0')}`;
  }
};

export const getNextMonth = (year: string, month: string): string => {
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  if (monthNum === 12) {
    return `${yearNum + 1}-01`;
  } else {
    return `${yearNum}-${(monthNum + 1).toString().padStart(2, '0')}`;
  }
};

export const isWithinLast30Days = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return date >= thirtyDaysAgo;
};

export const getMonthDisplayName = (year: string, month: string): string => {
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};
