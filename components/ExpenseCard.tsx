'use client';

import { Expense } from '@/lib/types';
import { format } from 'date-fns';
import { MapPin, Trash2, Image as ImageIcon } from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '@/lib/analytics';
import { useState } from 'react';

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (expenseId: string, imageUrl?: string) => Promise<void>;
}

export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setDeleting(true);
      try {
        await onDelete(expense.id, expense.imageUrl);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              />
              <span className="text-sm font-medium text-gray-300">
                {getCategoryLabel(expense.category)}
              </span>
            </div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              ₹{expense.amount.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-400">{format(expense.date, 'MMM dd, yyyy - hh:mm a')}</p>

          {expense.location && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>{expense.location.name || 'Location marked'}</span>
            </div>
          )}

          {expense.notes && (
            <p className="text-gray-300 mt-2 line-clamp-2">{expense.notes}</p>
          )}

          {expense.imageUrl && (
            <button
              onClick={() => setShowImage(true)}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mt-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>View Receipt</span>
            </button>
          )}
        </div>
      </div>

      {showImage && expense.imageUrl && (
        <div
          onClick={() => setShowImage(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImage(false)}
              className="absolute -top-12 right-0 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={expense.imageUrl}
              alt="Receipt"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}

function X({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
