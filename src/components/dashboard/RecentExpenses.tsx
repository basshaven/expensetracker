import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getRecentExpenses } from '@/lib/expenseAnalytics';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Expense } from '@/types/expense';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = getRecentExpenses(expenses, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent expenses</p>
            <p className="text-sm">Add your first expense to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate pr-2">
                      {expense.description}
                    </h4>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}