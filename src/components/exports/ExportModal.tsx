import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/expense';
import { exportExpenses, filterExpenses, ExportFormat, ExportResult } from '@/lib/advancedExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState(`expenses-${new Date().toISOString().split('T')[0]}`);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on current criteria
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, startDate, endDate, selectedCategories.length > 0 ? selectedCategories : undefined);
  }, [expenses, startDate, endDate, selectedCategories]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      recordCount: filteredExpenses.length,
      totalAmount: total,
      dateRange: filteredExpenses.length > 0 ? {
        earliest: Math.min(...filteredExpenses.map(e => new Date(e.date).getTime())),
        latest: Math.max(...filteredExpenses.map(e => new Date(e.date).getTime()))
      } : null,
      categoryBreakdown
    };
  }, [filteredExpenses]);

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null);

    try {
      const result = await exportExpenses(filteredExpenses, {
        format,
        filename,
        startDate,
        endDate,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
      });
      
      setExportResult(result);
      
      if (result.success) {
        // Auto-close modal after successful export
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      }
    } catch {
      setExportResult({
        success: false,
        message: 'Export failed unexpectedly',
        recordCount: 0
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setFormat('csv');
    setFilename(`expenses-${new Date().toISOString().split('T')[0]}`);
    setStartDate('');
    setEndDate('');
    setSelectedCategories([]);
    setShowPreview(false);
    setExportResult(null);
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      resetForm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Export Expenses" size="xl">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Format */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'csv', label: 'CSV', desc: 'Spreadsheet format' },
                  { value: 'json', label: 'JSON', desc: 'Structured data' },
                  { value: 'pdf', label: 'PDF', desc: 'Printable report' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value as ExportFormat)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      format === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isExporting}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Filename */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filename</h3>
              <Input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={isExporting}
              />
            </Card>

            {/* Date Range */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isExporting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isExporting}
                  />
                </div>
              </div>
            </Card>

            {/* Category Filter */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedCategories.length === 0 ? 'All categories' : `${selectedCategories.length} selected`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                    disabled={isExporting || selectedCategories.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {EXPENSE_CATEGORIES.map(category => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        disabled={isExporting}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Summary & Preview Panel */}
          <div className="space-y-6">
            {/* Export Summary */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Records:</span>
                  <span className="font-medium">{summary.recordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-medium">${summary.totalAmount.toFixed(2)}</span>
                </div>
                {summary.dateRange && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date Range:</span>
                    <span className="font-medium text-right">
                      {new Date(summary.dateRange.earliest).toLocaleDateString()}
                      <br />
                      to {new Date(summary.dateRange.latest).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Preview Toggle */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={isExporting || filteredExpenses.length === 0}
                >
                  {showPreview ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showPreview && (
                <div className="max-h-64 overflow-y-auto border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Category</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.slice(0, 10).map((expense, index) => (
                        <tr key={expense.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2">{expense.date}</td>
                          <td className="px-3 py-2">{expense.category}</td>
                          <td className="px-3 py-2 text-right">${expense.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredExpenses.length > 10 && (
                    <div className="px-3 py-2 text-xs text-gray-500 border-t">
                      Showing first 10 of {filteredExpenses.length} records
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Export Results */}
            {exportResult && (
              <Card className={`p-4 ${exportResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-sm ${exportResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {exportResult.message}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || filteredExpenses.length === 0 || !filename.trim()}
          >
            {isExporting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </div>
            ) : (
              `Export ${filteredExpenses.length} Records`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}