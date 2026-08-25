import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { guardSnapshotTimeout, withTimeout } from '@/lib/timeout';
import { findProgramSlot, getOccupiedSlotIds } from '@/lib/programData';
import type { ProgramSignup, ProgramSignupInput } from '@/types';

const COLLECTION = 'programSignups';

function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  return null;
}

function docToSignup(snap: QueryDocumentSnapshot<DocumentData>): ProgramSignup {
  const data = snap.data();
  return {
    id: snap.id,
    programId: data.programId,
    slotId: data.slotId,
    name: data.name,
    affiliation: data.affiliation,
    createdAt: toMillis(data.createdAt) ?? Date.now(),
  };
}

export function subscribeProgramSignups(
  callback: (signups: ProgramSignup[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const guard = guardSnapshotTimeout(onError);
  const unsubscribe = onSnapshot(
    collection(db, COLLECTION),
    (snap) => {
      guard.markSettled();
      callback(snap.docs.map(docToSignup));
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

export class ProgramSlotFullError extends Error {}
export class ProgramSlotConflictError extends Error {}

export async function createProgramSignup(
  input: ProgramSignupInput,
  capacity: number | null,
): Promise<void> {
  // 같은 사람(이름+소속)이 겹치는 시간대에 두 프로그램을 동시에 들을 수 없으므로,
  // 프로그램과 무관하게 이 사람의 다른 신청들과 시간대가 겹치는지 확인한다.
  // (예: '강단 꽃꽂이'는 타임1 신청 한 건으로 타임1·타임2를 모두 차지한다.)
  const targetOccupied = getOccupiedSlotIds(findProgramSlot(input.programId, input.slotId) ?? { id: input.slotId });
  const myQuery = query(
    collection(db, COLLECTION),
    where('name', '==', input.name),
    where('affiliation', '==', input.affiliation),
  );
  const mySnaps = await withTimeout(getDocs(myQuery));

  if (mySnaps.docs.some((d) => d.data().programId === input.programId && d.data().slotId === input.slotId)) {
    return;
  }

  const conflict = mySnaps.docs.some((d) => {
    const data = d.data();
    const occupied = getOccupiedSlotIds(findProgramSlot(data.programId, data.slotId) ?? { id: data.slotId });
    return occupied.some((id) => targetOccupied.includes(id));
  });
  if (conflict) {
    throw new ProgramSlotConflictError('이미 같은 타임에 다른 프로그램을 신청하셨습니다.');
  }

  if (capacity !== null) {
    const slotQuery = query(
      collection(db, COLLECTION),
      where('programId', '==', input.programId),
      where('slotId', '==', input.slotId),
    );
    const slotSnaps = await withTimeout(getDocs(slotQuery));
    if (slotSnaps.size >= capacity) {
      throw new ProgramSlotFullError('선착순 마감되었습니다.');
    }
  }

  const ref = doc(collection(db, COLLECTION));
  await withTimeout(setDoc(ref, { ...input, createdAt: serverTimestamp() }));
}

export async function deleteProgramSignup(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)));
}
