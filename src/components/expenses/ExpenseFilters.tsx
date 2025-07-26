'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EXPENSE_CATEGORIES, type ExpenseFilters } from '@/types/expense';
import { X } from 'lucide-react';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

export default function ExpenseFiltersComponent({ filters, onFiltersChange }: ExpenseFiltersProps) {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...EXPENSE_CATEGORIES.map(category => ({
      value: category,
      label: category
    }))
  ];

  const updateFilter = (key: keyof ExpenseFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          placeholder="Search descriptions..."
          value={filters.searchTerm || ''}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value)}
        />

        <Input
          label="From Date"
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => updateFilter('startDate', e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => updateFilter('endDate', e.target.value)}
        />
      </div>
    </div>
  );
}