import { Expense, DailySummary, CategorySummary, ExpenseCategory } from './types';
import { format, parseISO } from 'date-fns';

export const calculateDailySummary = (expenses: Expense[]): DailySummary[] => {
  const dailyMap = new Map<string, number>();

  expenses.forEach((expense) => {
    const dateKey = format(expense.date, 'yyyy-MM-dd');
    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + expense.amount);
  });

  return Array.from(dailyMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
};

export const calculateCategorySummary = (expenses: Expense[]): CategorySummary[] => {
  const categoryMap = new Map<ExpenseCategory, number>();
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  expenses.forEach((expense) => {
    categoryMap.set(
      expense.category,
      (categoryMap.get(expense.category) || 0) + expense.amount
    );
  });

  return Array.from(categoryMap.entries())
    .map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const calculateTotalSpending = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    food: '#FF6B6B',
    drinks: '#4ECDC4',
    shopping: '#95E1D3',
    experience: '#FFD93D',
    counter: '#6C5CE7',
    travel: '#A29BFE',
    local_commute: '#FD79A8',
  };
  return colors[category];
};

export const getCategoryLabel = (category: ExpenseCategory): string => {
  const labels: Record<ExpenseCategory, string> = {
    food: 'Food',
    drinks: 'Drinks',
    shopping: 'Shopping',
    experience: 'Experience',
    counter: 'Counter',
    travel: 'Travel',
    local_commute: 'Local Commute',
  };
  return labels[category];
};
