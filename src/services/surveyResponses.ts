import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { guardSnapshotTimeout, withTimeout } from '@/lib/timeout';
import type { SurveyResponseMeta } from '@/types';

const COLLECTION = 'surveyResponses';

function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

function docToMeta(snap: QueryDocumentSnapshot<DocumentData>): SurveyResponseMeta {
  const data = snap.data();
  return {
    id: snap.id,
    answers: data.answers ?? [],
    createdAt: toMillis(data.createdAt) ?? Date.now(),
  };
}

export async function submitSurveyResponse(answers: string[]): Promise<void> {
  const docRef = doc(collection(db, COLLECTION));
  await withTimeout(setDoc(docRef, { answers, createdAt: serverTimestamp() }));
}

export function subscribeSurveyResponses(
  callback: (responses: SurveyResponseMeta[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const guard = guardSnapshotTimeout(onError);
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(
    q,
    (snap) => {
      guard.markSettled();
      callback(snap.docs.map(docToMeta));
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
