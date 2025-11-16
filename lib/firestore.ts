import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Trip, Expense } from './types';

// Trip operations
export const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'trips'), {
    ...tripData,
    startDate: Timestamp.fromDate(tripData.startDate),
    endDate: Timestamp.fromDate(tripData.endDate),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getTrips = async (userId: string): Promise<Trip[]> => {
  const q = query(
    collection(db, 'trips'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
    } as Trip;
  });
};

export const getTrip = async (tripId: string): Promise<Trip | null> => {
  const docRef = doc(db, 'trips', tripId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
    } as Trip;
  }
  return null;
};

export const updateTrip = async (tripId: string, tripData: Partial<Trip>) => {
  const docRef = doc(db, 'trips', tripId);
  const updateData: any = { ...tripData };
  if (tripData.startDate) {
    updateData.startDate = Timestamp.fromDate(tripData.startDate);
  }
  if (tripData.endDate) {
    updateData.endDate = Timestamp.fromDate(tripData.endDate);
  }
  await updateDoc(docRef, updateData);
};

export const deleteTrip = async (tripId: string) => {
  // Delete all expenses for this trip
  const expenses = await getExpenses(tripId);
  for (const expense of expenses) {
    await deleteExpense(expense.id, expense.imageUrl);
  }
  // Delete the trip
  await deleteDoc(doc(db, 'trips', tripId));
};

// Expense operations
export const createExpense = async (
  expenseData: Omit<Expense, 'id' | 'createdAt'>,
  imageFile?: File
) => {
  let imageUrl: string | undefined;

  if (imageFile) {
    const storageRef = ref(storage, `expenses/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, 'expenses'), {
    ...expenseData,
    date: Timestamp.fromDate(expenseData.date),
    imageUrl,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getExpenses = async (tripId: string): Promise<Expense[]> => {
  const q = query(
    collection(db, 'expenses'),
    where('tripId', '==', tripId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
    } as Expense;
  });
};

export const updateExpense = async (
  expenseId: string,
  expenseData: Partial<Expense>,
  imageFile?: File
) => {
  const docRef = doc(db, 'expenses', expenseId);
  const updateData: any = { ...expenseData };

  if (expenseData.date) {
    updateData.date = Timestamp.fromDate(expenseData.date);
  }

  if (imageFile) {
    const storageRef = ref(storage, `expenses/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    updateData.imageUrl = await getDownloadURL(storageRef);
  }

  await updateDoc(docRef, updateData);
};

export const deleteExpense = async (expenseId: string, imageUrl?: string) => {
  if (imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
  await deleteDoc(doc(db, 'expenses', expenseId));
};
