import { useState } from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { TransactionList } from './TransactionList';
import type { Portfolio } from '../types/portfolio';

interface ViewTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
}

export function ViewTransactionsModal({ isOpen, onClose, portfolio }: ViewTransactionsModalProps) {
  const { transactions, isLoading, deleteTransaction } = useTransaction(portfolio?.id);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (transactionId: string) => {
    setDeletingId(transactionId);
    try {
      await deleteTransaction(transactionId);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen || !portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-500 mt-1">{portfolio.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600 text-sm">Loading transactions...</p>
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
          </div>

          {/* Close Button */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
