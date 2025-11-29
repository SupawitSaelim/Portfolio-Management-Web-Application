import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';
import { useTransaction } from '../hooks/useTransaction';
import { useNavigate } from 'react-router-dom';
import { PortfolioList } from '../components/PortfolioList';
import { CreatePortfolioModal } from '../components/CreatePortfolioModal';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ViewTransactionsModal } from '../components/ViewTransactionsModal';
import type { Portfolio } from '../types/portfolio';

export function Dashboard() {
  const { appUser, logout } = useAuth();
  const { portfolios, isLoading, createPortfolio, deletePortfolio, stats, refreshPortfolios } = usePortfolio();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isViewTransactionsModalOpen, setIsViewTransactionsModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const { createTransaction } = useTransaction(selectedPortfolio?.id);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const handleAddTransaction = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsTransactionModalOpen(true);
  };

  const handleViewTransactions = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsViewTransactionsModalOpen(true);
  };

  const handleTransactionCreated = async () => {
    // Refresh portfolios to update stats
    await refreshPortfolios();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Manager</h1>
                <p className="text-sm text-gray-500">Welcome back, {appUser?.displayName}!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Grid - Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Portfolio Value Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Portfolio Value</dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalValue)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolios Count Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Portfolios</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.portfolioCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Invested Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Invested</dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalInvested)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      stats.totalReturn >= 0 
                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                        : 'bg-gradient-to-br from-red-500 to-red-600'
                    }`}>
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Return</dt>
                      <dd className={`text-2xl font-bold ${
                        stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(stats.totalReturnPercentage)}
                      </dd>
                      <dd className={`text-sm ${
                        stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(stats.totalReturn)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Portfolio Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Portfolios</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Portfolio
            </button>
          </div>

          {/* Portfolio List */}
          {isLoading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading portfolios...</p>
            </div>
          ) : (
            <PortfolioList
              portfolios={portfolios}
              onDelete={deletePortfolio}
              onAddTransaction={handleAddTransaction}
              onViewTransactions={handleViewTransactions}
            />
          )}

          {/* Create Portfolio Modal */}
          <CreatePortfolioModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={createPortfolio}
          />

          {/* Add Transaction Modal */}
          <AddTransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => {
              setIsTransactionModalOpen(false);
              setSelectedPortfolio(null);
            }}
            onCreate={async (input) => {
              await createTransaction(input);
              await handleTransactionCreated();
            }}
            portfolioId={selectedPortfolio?.id || ''}
            portfolioName={selectedPortfolio?.name || ''}
          />

          {/* View Transactions Modal */}
          <ViewTransactionsModal
            isOpen={isViewTransactionsModalOpen}
            onClose={() => {
              setIsViewTransactionsModalOpen(false);
              setSelectedPortfolio(null);
              refreshPortfolios();
            }}
            portfolio={selectedPortfolio}
          />
        </div>
      </main>
    </div>
  );
}
