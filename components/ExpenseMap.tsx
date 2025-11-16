'use client';

import { useEffect, useState } from 'react';
import { Expense } from '@/lib/types';
import { getCategoryColor } from '@/lib/analytics';

interface ExpenseMapProps {
  expenses: Expense[];
}

export default function ExpenseMap({ expenses }: ExpenseMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);

  const expensesWithLocation = expenses.filter((e) => e.location);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet dynamically
    import('leaflet').then((L) => {
      setMapLoaded(true);

      // Fix default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!map && expensesWithLocation.length > 0) {
        const newMap = L.map('expense-map').setView(
          [expensesWithLocation[0].location!.latitude, expensesWithLocation[0].location!.longitude],
          12
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(newMap);

        expensesWithLocation.forEach((expense) => {
          if (expense.location) {
            const marker = L.circleMarker(
              [expense.location.latitude, expense.location.longitude],
              {
                radius: 8,
                fillColor: getCategoryColor(expense.category),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              }
            ).addTo(newMap);

            marker.bindPopup(`
              <div class="p-2">
                <p class="font-bold">₹${expense.amount.toLocaleString('en-IN')}</p>
                <p class="text-sm text-gray-600">${expense.category}</p>
                ${expense.notes ? `<p class="text-sm mt-1">${expense.notes}</p>` : ''}
              </div>
            `);
          }
        });

        if (expensesWithLocation.length > 1) {
          const bounds = L.latLngBounds(
            expensesWithLocation.map((e) => [e.location!.latitude, e.location!.longitude])
          );
          newMap.fitBounds(bounds, { padding: [50, 50] });
        }

        setMap(newMap);
      }
    });

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [expensesWithLocation.length]);

  if (expensesWithLocation.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
        <p className="text-gray-400">No expenses with location data yet</p>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css"
      />
      <div
        id="expense-map"
        className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700"
      />
    </>
  );
}
