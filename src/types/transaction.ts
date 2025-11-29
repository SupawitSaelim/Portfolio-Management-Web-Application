export type TransactionType = 'deposit' | 'withdrawal';

export interface Transaction {
  id: string;
  userId: string;
  portfolioId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  portfolioId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  notes?: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  date?: Date;
  notes?: string;
}

export interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  netInvested: number;
  transactionCount: number;
}
