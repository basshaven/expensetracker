import { useState } from 'react';
import SummaryCards from './SummaryCards';
import CategoryChart from './CategoryChart';
import RecentExpenses from './RecentExpenses';
import { calculateExpenseSummary } from '@/lib/expenseAnalytics';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { ExportModal } from '@/components/exports/ExportModal';

interface DashboardProps {
  expenses: Expense[];
}

export default function Dashboard({ expenses }: DashboardProps) {
  const summary = calculateExpenseSummary(expenses);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Overview of your spending habits
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsExportModalOpen(true)}
          disabled={expenses.length === 0}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Advanced Export</span>
        </Button>
      </div>

      <SummaryCards 
        summary={summary} 
        totalExpenseCount={expenses.length} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart expenses={expenses} />
        <RecentExpenses expenses={expenses} />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}