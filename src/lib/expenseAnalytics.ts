import { Expense, ExpenseCategory, ExpenseSummary } from '@/types/expense';
import { getCurrentMonth } from './utils';

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const { start: monthStart, end: monthEnd } = getCurrentMonth();
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyExpenses = expenses.filter(expense => 
    expense.date >= monthStart && expense.date <= monthEnd
  );
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] += expense.amount;
  });
  
  const topCategory = Object.entries(categoryTotals)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)[0];
  
  return {
    totalExpenses,
    monthlyTotal,
    categoryTotals,
    topCategory: topCategory ? {
      category: topCategory[0] as ExpenseCategory,
      amount: topCategory[1]
    } : null,
  };
};

export const getExpensesByMonth = (expenses: Expense[]): Record<string, number> => {
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const month = expense.date.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
  });
  
  return monthlyData;
};

export const getRecentExpenses = (expenses: Expense[], limit: number = 5): Expense[] => {
  return [...expenses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getExpensesByCategory = (expenses: Expense[]): Array<{
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
}> => {
  const categoryData: Record<ExpenseCategory, { amount: number; count: number }> = {
    Food: { amount: 0, count: 0 },
    Transportation: { amount: 0, count: 0 },
    Entertainment: { amount: 0, count: 0 },
    Shopping: { amount: 0, count: 0 },
    Bills: { amount: 0, count: 0 },
    Other: { amount: 0, count: 0 },
  };
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  expenses.forEach(expense => {
    categoryData[expense.category].amount += expense.amount;
    categoryData[expense.category].count += 1;
  });
  
  return Object.entries(categoryData)
    .map(([category, data]) => ({
      category: category as ExpenseCategory,
      amount: data.amount,
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
};