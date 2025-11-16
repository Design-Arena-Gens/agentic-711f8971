'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getTrips, deleteTrip } from '@/lib/firestore';
import { Trip } from '@/lib/types';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';
import { Plus, LogOut, Sparkles } from 'lucide-react';
import { useExpenseReminder } from '@/hooks/useExpenseReminder';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useExpenseReminder();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;
    setLoadingTrips(true);
    try {
      const userTrips = await getTrips(user.uid);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    await deleteTrip(tripId);
    loadTrips();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              My Trips
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto mb-8 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Trip
        </button>

        {loadingTrips ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No trips yet</h2>
            <p className="text-gray-400 mb-6">Create your first trip to start tracking expenses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => router.push(`/trip/${trip.id}`)}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}

        <CreateTripModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTripCreated={loadTrips}
        />
      </div>
    </div>
  );
}
