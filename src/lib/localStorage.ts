import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-expenses';

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses to localStorage:', error);
  }
};

export const loadExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load expenses from localStorage:', error);
    return [];
  }
};

export const addExpense = (expense: Expense): Expense[] => {
  const expenses = loadExpenses();
  const updatedExpenses = [expense, ...expenses];
  saveExpenses(updatedExpenses);
  return updatedExpenses;
};

export const updateExpense = (updatedExpense: Expense): Expense[] => {
  const expenses = loadExpenses();
  const updatedExpenses = expenses.map(expense => 
    expense.id === updatedExpense.id ? updatedExpense : expense
  );
  saveExpenses(updatedExpenses);
  return updatedExpenses;
};

export const deleteExpense = (expenseId: string): Expense[] => {
  const expenses = loadExpenses();
  const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
  saveExpenses(updatedExpenses);
  return updatedExpenses;
};