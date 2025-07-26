import SummaryCards from './SummaryCards';
import CategoryChart from './CategoryChart';
import RecentExpenses from './RecentExpenses';
import { calculateExpenseSummary } from '@/lib/expenseAnalytics';
import { exportExpensesToCSV } from '@/lib/csvExport';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';

interface DashboardProps {
  expenses: Expense[];
}

export default function Dashboard({ expenses }: DashboardProps) {
  const summary = calculateExpenseSummary(expenses);

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
          variant="secondary" 
          onClick={() => exportExpensesToCSV(expenses)}
          disabled={expenses.length === 0}
        >
          Export Data
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
    </div>
  );
}