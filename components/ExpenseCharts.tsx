'use client';

import { Expense } from '@/lib/types';
import { calculateCategorySummary, calculateDailySummary, getCategoryColor, getCategoryLabel } from '@/lib/analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

interface ExpenseChartsProps {
  expenses: Expense[];
}

export default function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  const categorySummary = calculateCategorySummary(expenses);
  const dailySummary = calculateDailySummary(expenses);

  const categoryData = categorySummary.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.total,
    color: getCategoryColor(item.category),
  }));

  const dailyData = dailySummary.map((item) => ({
    date: format(parseISO(item.date), 'MMM dd'),
    amount: item.total,
  }));

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
        <p className="text-gray-400">No expenses to display charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {categorySummary.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              />
              <div>
                <p className="text-sm text-gray-400">{getCategoryLabel(item.category)}</p>
                <p className="font-semibold text-white">
                  ₹{item.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Daily Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
