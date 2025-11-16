'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { getTrip, getExpenses, deleteExpense } from '@/lib/firestore';
import { Trip, Expense } from '@/lib/types';
import { calculateTotalSpending, calculateCategorySummary } from '@/lib/analytics';
import ExpenseCard from '@/components/ExpenseCard';
import AddExpenseModal from '@/components/AddExpenseModal';
import ExpenseMap from '@/components/ExpenseMap';
import ExpenseCharts from '@/components/ExpenseCharts';
import BudgetAlert from '@/components/BudgetAlert';
import { Plus, ArrowLeft, Map, BarChart3, List, Wallet } from 'lucide-react';

type ViewMode = 'list' | 'map' | 'analytics';

export default function TripPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && tripId) {
      loadTripData();
    }
  }, [user, tripId]);

  const loadTripData = async () => {
    setLoadingData(true);
    try {
      const [tripData, expensesData] = await Promise.all([
        getTrip(tripId),
        getExpenses(tripId),
      ]);
      setTrip(tripData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading trip data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string, imageUrl?: string) => {
    await deleteExpense(expenseId, imageUrl);
    loadTripData();
  };

  if (loading || loadingData || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const totalSpending = calculateTotalSpending(expenses);
  const categorySummary = calculateCategorySummary(expenses);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-2">
            {trip.name}
          </h1>
          <p className="text-gray-400">{trip.destination}</p>
        </div>

        <BudgetAlert trip={trip} expenses={expenses} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">Total Spent</p>
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              ₹{totalSpending.toLocaleString('en-IN')}
            </p>
          </div>

          {trip.budget && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">Budget Remaining</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                ₹{Math.max(0, trip.budget - totalSpending).toLocaleString('en-IN')}
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-500">
              {expenses.length}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                viewMode === 'analytics'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <>
            {expenses.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No expenses yet</h2>
                <p className="text-gray-400 mb-6">Add your first expense to start tracking</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === 'map' && <ExpenseMap expenses={expenses} />}

        {viewMode === 'analytics' && <ExpenseCharts expenses={expenses} />}

        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          tripId={tripId}
          onExpenseAdded={loadTripData}
        />
      </div>
    </div>
  );
}
