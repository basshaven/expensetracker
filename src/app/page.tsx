'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Dashboard from '@/components/dashboard/Dashboard';
import ExpenseForm from '@/components/forms/ExpenseForm';
import ExpenseList from '@/components/expenses/ExpenseList';
import { Expense, ExpenseFilters } from '@/types/expense';
import { loadExpenses, addExpense, updateExpense, deleteExpense } from '@/lib/localStorage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});

  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  const handleAddExpense = (expense: Expense) => {
    const updatedExpenses = addExpense(expense);
    setExpenses(updatedExpenses);
    setActiveTab('dashboard');
  };

  const handleUpdateExpense = (expense: Expense) => {
    const updatedExpenses = updateExpense(expense);
    setExpenses(updatedExpenses);
    setEditingExpense(null);
    setActiveTab('expenses');
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = deleteExpense(expenseId);
      setExpenses(updatedExpenses);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={expenses} />;
      case 'add':
        return (
          <ExpenseForm
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            initialData={editingExpense || undefined}
            isEditing={!!editingExpense}
          />
        );
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            filters={filters}
            onFiltersChange={setFilters}
          />
        );
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab !== 'add') {
            setEditingExpense(null);
          }
          setActiveTab(tab);
        }} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
