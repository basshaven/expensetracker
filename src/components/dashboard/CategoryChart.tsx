import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getExpensesByCategory } from '@/lib/expenseAnalytics';
import { formatCurrency } from '@/lib/utils';
import { Expense } from '@/types/expense';

interface CategoryChartProps {
  expenses: Expense[];
}

const categoryColors = {
  Food: 'bg-red-500',
  Transportation: 'bg-blue-500',
  Entertainment: 'bg-green-500',
  Shopping: 'bg-yellow-500',
  Bills: 'bg-purple-500',
  Other: 'bg-gray-500',
};

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const categoryData = getExpensesByCategory(expenses);

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No expense data available</p>
            <p className="text-sm">Add some expenses to see category breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxAmount = Math.max(...categoryData.map(item => item.amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      categoryColors[item.category]
                    }`}
                  />
                  <span className="font-medium">{item.category}</span>
                  <span className="text-gray-500">({item.count} expenses)</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    categoryColors[item.category]
                  }`}
                  style={{
                    width: `${(item.amount / maxAmount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}