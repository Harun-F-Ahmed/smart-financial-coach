'use client';

import { formatCurrency, formatDelta } from '../../../lib/utils/formatting';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIData {
  income: number;
  expenses: number;
  savings: number;
  savingsDelta?: number;
}

interface DashboardKPIsProps {
  data: KPIData;
  isLoading: boolean;
}

export default function DashboardKPIs({ data, isLoading }: DashboardKPIsProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              {i === 2 && <div className="h-4 bg-gray-200 rounded w-1/2"></div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass card-hover rounded-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 gradient-success rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.income)}
                </p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </motion.div>

      {/* Expenses */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass card-hover rounded-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 gradient-danger rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-danger rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.expenses)}
                </p>
              </div>
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </motion.div>

      {/* Savings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass card-hover rounded-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 gradient-primary rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Savings</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.savings)}
                  </p>
                  {data.savingsDelta !== undefined && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      data.savingsDelta >= 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {data.savingsDelta >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {formatDelta(data.savingsDelta)}
                    </span>
                  )}
                </div>
                {data.savingsDelta !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">vs last month</p>
                )}
              </div>
            </div>
            {data.savingsDelta !== undefined && (
              data.savingsDelta >= 0 ? 
                <TrendingUp className="w-5 h-5 text-emerald-500" /> : 
                <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
