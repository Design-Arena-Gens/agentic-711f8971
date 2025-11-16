'use client';

import { Trip } from '@/lib/types';
import { format } from 'date-fns';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
  onDelete: (tripId: string) => Promise<void>;
}

export default function TripCard({ trip, onClick, onDelete }: TripCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip? All expenses will be deleted.')) {
      setDeleting(true);
      try {
        await onDelete(trip.id);
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
    >
      <div className="bg-gray-900 rounded-2xl p-6 h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-white">{trip.name}</h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>
              {format(trip.startDate, 'MMM dd')} - {format(trip.endDate, 'MMM dd, yyyy')}
            </span>
          </div>

          {trip.budget && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">Budget</p>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                ₹{trip.budget.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
