export type ExpenseCategory =
  | 'food'
  | 'drinks'
  | 'shopping'
  | 'experience'
  | 'counter'
  | 'travel'
  | 'local_commute';

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  location?: Location;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget?: number;
  createdAt: Date;
  userId: string;
}

export interface DailySummary {
  date: string;
  total: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  percentage: number;
}
