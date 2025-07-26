'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EXPENSE_CATEGORIES, type Expense } from '@/types/expense';
import { generateId } from '@/lib/utils';

const expenseFormSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Amount must be a positive number'),
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters'),
  category: z.enum(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other']),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  initialData?: Partial<Expense>;
  isEditing?: boolean;
}

export default function ExpenseForm({ onSubmit, initialData, isEditing = false }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: initialData?.amount?.toString() || '',
      description: initialData?.description || '',
      category: initialData?.category || 'Other',
      date: initialData?.date || new Date().toISOString().split('T')[0],
    }
  });

  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category,
    label: category
  }));

  const onFormSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      const expense: Expense = {
        id: initialData?.id || generateId(),
        amount: parseFloat(data.amount),
        description: data.description,
        category: data.category,
        date: data.date,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(expense);
      
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />
          </div>
          
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          
          <Input
            label="Description"
            placeholder="Enter expense description"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Adding...') 
                : (isEditing ? 'Update Expense' : 'Add Expense')
              }
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => reset()}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}