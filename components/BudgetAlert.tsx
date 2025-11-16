'use client';

import { Trip, Expense } from '@/lib/types';
import { calculateTotalSpending } from '@/lib/analytics';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface BudgetAlertProps {
  trip: Trip;
  expenses: Expense[];
}

export default function BudgetAlert({ trip, expenses }: BudgetAlertProps) {
  if (!trip.budget) return null;

  const totalSpent = calculateTotalSpending(expenses);
  const percentage = (totalSpent / trip.budget) * 100;
  const remaining = trip.budget - totalSpent;

  const getAlertLevel = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  const alertLevel = getAlertLevel();

  if (alertLevel === 'normal') return null;

  return (
    <div
      className={`border-l-4 rounded-lg p-4 mb-6 ${
        alertLevel === 'danger'
          ? 'bg-red-500/10 border-red-500'
          : 'bg-yellow-500/10 border-yellow-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`w-6 h-6 flex-shrink-0 ${
            alertLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'
          }`}
        />
        <div className="flex-1">
          <h3
            className={`font-bold mb-1 ${
              alertLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'
            }`}
          >
            {alertLevel === 'danger' ? 'Budget Exceeded!' : 'Budget Warning'}
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            {alertLevel === 'danger'
              ? `You've exceeded your budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}`
              : `You've spent ${percentage.toFixed(0)}% of your budget. ₹${remaining.toLocaleString('en-IN')} remaining.`}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                alertLevel === 'danger'
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
