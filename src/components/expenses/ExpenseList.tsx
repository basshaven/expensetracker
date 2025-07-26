'use client';

import { useState } from 'react';
import { Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExpenseFiltersComponent from './ExpenseFilters';
import { type Expense, type ExpenseFilters } from '@/types/expense';
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

export default function ExpenseList({ 
  expenses, 
  onEdit, 
  onDelete, 
  filters, 
  onFiltersChange 
}: ExpenseListProps) {
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredExpenses = expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) {
      return false;
    }
    
    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return expense.description.toLowerCase().includes(searchLower) ||
             expense.category.toLowerCase().includes(searchLower);
    }
    
    return true;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const exportData = sortedExpenses.map(expense => ({
      Date: formatDate(expense.date),
      Amount: expense.amount,
      Category: expense.category,
      Description: expense.description
    }));
    
    exportToCSV(exportData, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <ExpenseFiltersComponent 
        filters={filters} 
        onFiltersChange={onFiltersChange} 
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Expenses ({sortedExpenses.length})
            </CardTitle>
            {sortedExpenses.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No expenses found.</p>
              <p className="text-sm">Try adjusting your filters or add a new expense.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th 
                      className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortField === 'date' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      {sortField === 'amount' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortField === 'category' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('description')}
                    >
                      Description
                      {sortField === 'description' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(expense)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(expense.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedExpenses.map((expense) => (
                <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {expense.description}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(expense)}
                          className="text-gray-500 hover:text-blue-600 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(expense.id)}
                          className="text-gray-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}