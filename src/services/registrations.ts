import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { calcAmountDue, calcTotalCount } from '@/lib/calc';
import { guardSnapshotTimeout, withTimeout } from '@/lib/timeout';
import { normalizePhone } from '@/lib/phone';
import type { Registration, RegistrationInput, Settings } from '@/types';

const COLLECTION = 'registrations';

function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

function docToRegistration(
  snap: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>,
): Registration | null {
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name,
    affiliation: data.affiliation,
    phone: data.phone,
    birthMonth: data.birthMonth,
    bloodType: data.bloodType,
    lodging: data.lodging,
    adults: data.adults ?? [],
    children: data.children ?? [],
    note: data.note ?? '',
    totalCount: data.totalCount,
    amountDue: data.amountDue,
    paymentStatus: data.paymentStatus,
    checkedIn: data.checkedIn ?? false,
    checkedInAt: toMillis(data.checkedInAt),
    createdAt: toMillis(data.createdAt) ?? Date.now(),
    updatedAt: toMillis(data.updatedAt) ?? Date.now(),
  };
}

export async function createRegistration(
  input: RegistrationInput,
  settings: Pick<Settings, 'adultFee' | 'childFee'>,
): Promise<string> {
  const ref = doc(collection(db, COLLECTION));
  const totalCount = calcTotalCount(input.adults, input.children);
  const amountDue = calcAmountDue(input.adults, input.children, settings);

  await withTimeout(
    setDoc(ref, {
      ...input,
      phoneNormalized: normalizePhone(input.phone),
      totalCount,
      amountDue,
      paymentStatus: '입금전',
      checkedIn: false,
      checkedInAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );

  return ref.id;
}

export async function getRegistration(id: string): Promise<Registration | null> {
  const snap = await withTimeout(getDoc(doc(db, COLLECTION, id)));
  return docToRegistration(snap);
}

export async function findRegistrationByNamePhone(
  name: string,
  phone: string,
): Promise<Registration | null> {
  const q = query(
    collection(db, COLLECTION),
    where('name', '==', name),
    where('phoneNormalized', '==', normalizePhone(phone)),
  );
  const snaps = await withTimeout(getDocs(q));
  if (snaps.empty) return null;
  return docToRegistration(snaps.docs[0]!);
}

export function subscribeRegistration(
  id: string,
  callback: (registration: Registration | null) => void,
  onError?: (error: Error) => void,
): () => void {
  const guard = guardSnapshotTimeout(onError);
  const unsubscribe = onSnapshot(
    doc(db, COLLECTION, id),
    (snap) => {
      guard.markSettled();
      callback(docToRegistration(snap));
    },
    (error) => {
      guard.markSettled();
      onError?.(error);
    },
  );
  return () => {
    guard.dispose();
    unsubscribe();
  };
}

export function subscribeRegistrations(
  callback: (registrations: Registration[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const guard = guardSnapshotTimeout(onError);
  const unsubscribe = onSnapshot(
    collection(db, COLLECTION),
    (snap) => {
      guard.markSettled();
      callback(snap.docs.map((d) => docToRegistration(d)).filter((r): r is Registration => r !== null));
    },
    (error) => {
      guard.markSettled();
      onError?.(error);
    },
  );
  return () => {
    guard.dispose();
    unsubscribe();
  };
}

export async function updateRegistration(
  id: string,
  input: RegistrationInput,
  settings: Pick<Settings, 'adultFee' | 'childFee'>,
): Promise<void> {
  const totalCount = calcTotalCount(input.adults, input.children);
  const amountDue = calcAmountDue(input.adults, input.children, settings);

  await withTimeout(
    updateDoc(doc(db, COLLECTION, id), {
      ...input,
      phoneNormalized: normalizePhone(input.phone),
      totalCount,
      amountDue,
      updatedAt: serverTimestamp(),
    }),
  );
}

export async function deleteRegistration(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)));
}

export async function setPaymentStatus(
  id: string,
  paymentStatus: Registration['paymentStatus'],
): Promise<void> {
  await withTimeout(
    updateDoc(doc(db, COLLECTION, id), { paymentStatus, updatedAt: serverTimestamp() }),
  );
}

export async function setCheckedIn(id: string, checkedIn: boolean): Promise<void> {
  await withTimeout(
    updateDoc(doc(db, COLLECTION, id), {
      checkedIn,
      checkedInAt: checkedIn ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    }),
  );
}
