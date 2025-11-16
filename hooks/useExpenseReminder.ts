'use client';

import { useEffect } from 'react';

export function useExpenseReminder() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Set up reminder (every 6 hours)
    const reminderInterval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Travel Expense Tracker', {
          body: "Don't forget to add your expenses!",
          icon: '/icon.png',
          tag: 'expense-reminder',
        });
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(reminderInterval);
  }, []);
}
