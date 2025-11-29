import { useState, useEffect } from 'react';
import type { Portfolio } from '../types/portfolio';

interface UpdateNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (navPerUnit: number) => Promise<void>;
  portfolio: Portfolio | null;
}

export function UpdateNavModal({ isOpen, onClose, onUpdate, portfolio }: UpdateNavModalProps) {
  const [navPerUnit, setNavPerUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && portfolio?.currentNavPerUnit) {
      setNavPerUnit(portfolio.currentNavPerUnit.toString());
    } else if (isOpen) {
      setNavPerUnit('');
    }
  }, [isOpen, portfolio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const navValue = parseFloat(navPerUnit);

    if (!navValue || navValue <= 0) {
      setError('NAV must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      await onUpdate(navValue);
      setNavPerUnit('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setNavPerUnit('');
      onClose();
    }
  };

  if (!isOpen || !portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Update NAV</h2>
              <p className="text-sm text-gray-500 mt-1">{portfolio.name}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium">Enter the current Net Asset Value (NAV) per unit</p>
                <p className="mt-1">This will recalculate your portfolio value based on total units owned.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current NAV (if exists) */}
            {portfolio.currentNavPerUnit && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Current NAV</p>
                <p className="text-lg font-bold text-gray-900">
                  ฿{portfolio.currentNavPerUnit.toFixed(4)} per unit
                </p>
              </div>
            )}

            {/* NAV Input */}
            <div>
              <label htmlFor="navPerUnit" className="block text-sm font-medium text-gray-700 mb-1">
                New NAV per Unit (THB) *
              </label>
              <input
                id="navPerUnit"
                type="number"
                required
                min="0"
                step="0.0001"
                value={navPerUnit}
                onChange={(e) => setNavPerUnit(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0000"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Check your fund's latest NAV from your provider
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update NAV'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
