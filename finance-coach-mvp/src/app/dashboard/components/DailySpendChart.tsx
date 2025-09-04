'use client';

import { formatCurrency } from '../../../lib/utils/formatting';
import { formatDateShort } from '../../../lib/utils/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface DailySpendData {
  date: string;
  spend: number;
}

interface DailySpendChartProps {
  data: DailySpendData[];
  isLoading: boolean;
}

export default function DailySpendChart({ data, isLoading }: DailySpendChartProps) {

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Spending</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
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
          <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Spending</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No spending data for this month</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    formattedDate: formatDateShort(d.date)
  }));

  const totalSpend = data.reduce((sum, d) => sum + d.spend, 0);
  const averageSpend = totalSpend / data.length;
  const maxSpend = Math.max(...data.map(d => d.spend));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Spending</h3>
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="spend" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(totalSpend)}</p>
        </div>
        <div className="text-center p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(averageSpend)}</p>
        </div>
        <div className="text-center p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Peak</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(maxSpend)}</p>
        </div>
      </div>
    </motion.div>
  );
}
