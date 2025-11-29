export type TransactionType = 'deposit' | 'withdrawal';

// Mutual fund specific details
export interface MutualFundDetails {
  fundName: string;
  installmentNo: number;
  unitsPurchased: number;
  pricePerUnit: number;
}

// Stock specific details
export interface StockDetails {
  stockName: string;
  installmentNo: number;
  unitsPurchased: number;
  pricePerUnitUSD: number;
  exchangeRate: number;
  purchaseValueTHB: number;
}

// PVD specific details
export interface PVDDetails {
  year: number;
  period: number;
  month: string;
  employeeContribution: number;
  employerContribution: number;
}

// Cooperative specific details
export interface CooperativeDetails {
  year: number;
  period: number;
  month: string;
}

export interface Transaction {
  id: string;
  userId: string;
  portfolioId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  notes?: string;
  // Mutual fund specific fields (optional, only for mutual_fund type)
  mutualFundDetails?: MutualFundDetails;
  // Stock specific fields (optional, only for stock type)
  stockDetails?: StockDetails;
  // PVD specific fields (optional, only for pvd type)
  pvdDetails?: PVDDetails;
  // Cooperative specific fields (optional, only for cooperative type)
  cooperativeDetails?: CooperativeDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  portfolioId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  notes?: string;
  // Mutual fund specific fields (optional)
  mutualFundDetails?: MutualFundDetails;
  // Stock specific fields (optional)
  stockDetails?: StockDetails;
  // PVD specific fields (optional)
  pvdDetails?: PVDDetails;
  // Cooperative specific fields (optional)
  cooperativeDetails?: CooperativeDetails;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  date?: Date;
  notes?: string;
  mutualFundDetails?: MutualFundDetails;
  stockDetails?: StockDetails;
  pvdDetails?: PVDDetails;
  cooperativeDetails?: CooperativeDetails;
}

export interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  netInvested: number;
  transactionCount: number;
}
