'use client';

import { formatCurrency } from '../../../lib/utils/formatting';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface CategoryData {
  category: string;
  total: number;
}

interface TopCategoriesChartProps {
  data: CategoryData[];
  isLoading: boolean;
}

export default function TopCategoriesChart({ data, isLoading }: TopCategoriesChartProps) {

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No category data for this month</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Take top 5 categories
  const topCategories = data.slice(0, 5);
  const maxAmount = Math.max(...topCategories.map(c => c.total));

  // Color palette for categories
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center mb-6">
        <PieChart className="w-5 h-5 text-purple-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
      </div>
      
      <div className="space-y-4">
        {topCategories.map((category, index) => {
          const percentage = (category.total / maxAmount) * 100;
          const color = colors[index % colors.length];
          
          return (
            <motion.div 
              key={category.category} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/30 transition-colors"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {category.category}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(category.total)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total of top 5:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(topCategories.reduce((sum, c) => sum + c.total, 0))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
