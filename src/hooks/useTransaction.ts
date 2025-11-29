import { useState, useEffect } from 'react';
import { transactionService } from '../services/transaction';
import { useAuth } from './useAuth';
import type { Transaction, CreateTransactionInput, UpdateTransactionInput } from '../types/transaction';

export function useTransaction(portfolioId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load transactions on mount
  useEffect(() => {
    if (portfolioId) {
      loadTransactions();
    }
  }, [portfolioId]);

  const loadTransactions = async () => {
    if (!portfolioId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionService.getPortfolioTransactions(portfolioId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (input: CreateTransactionInput): Promise<Transaction> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      const newTransaction = await transactionService.createTransaction(user.uid, input);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTransaction = async (
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<void> => {
    if (!portfolioId) throw new Error('Portfolio ID is required');

    try {
      setError(null);
      await transactionService.updateTransaction(transactionId, portfolioId, input);
      
      // Refresh transactions to get updated stats and accurate data
      await loadTransactions();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaction = async (transactionId: string): Promise<void> => {
    if (!portfolioId) throw new Error('Portfolio ID is required');

    try {
      setError(null);
      await transactionService.deleteTransaction(transactionId, portfolioId);
      
      // Update local state
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const refreshTransactions = () => {
    loadTransactions();
  };

  // Calculate statistics
  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const netInvested = totalDeposits - totalWithdrawals;

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    stats: {
      totalDeposits,
      totalWithdrawals,
      netInvested,
      transactionCount: transactions.length,
    },
  };
}
