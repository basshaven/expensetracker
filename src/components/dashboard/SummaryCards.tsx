import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react';
import { ExpenseSummary } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  summary: ExpenseSummary;
  totalExpenseCount: number;
}

export default function SummaryCards({ summary, totalExpenseCount }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: DollarSign,
      description: `${totalExpenseCount} total transactions`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      icon: Calendar,
      description: 'Current month spending',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Top Category',
      value: summary.topCategory ? formatCurrency(summary.topCategory.amount) : '$0.00',
      icon: Target,
      description: summary.topCategory ? summary.topCategory.category : 'No expenses yet',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Average/Month',
      value: formatCurrency(summary.totalExpenses / Math.max(1, getMonthCount())),
      icon: TrendingUp,
      description: 'Average monthly spending',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  function getMonthCount(): number {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    return currentMonth;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}