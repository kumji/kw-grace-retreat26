import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { guardSnapshotTimeout, withTimeout } from '@/lib/timeout';
import type { Settings } from '@/types';

const SETTINGS_DOC = doc(db, 'settings', 'config');

export const defaultSettings: Settings = {
  earlyBirdStart: '',
  earlyBirdEnd: '',
  regularStart: '',
  regularEnd: '',
  adultFee: 0,
  schoolAgeChildFee: 0,
  preschoolChildFee: 0,
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  earlyBirdBenefit: '',
  notice: '',
  guideText: '',
  registrationState: '등록예정',
  programSignupStart: '',
  programSignupEnd: '',
};

export async function getSettings(): Promise<Settings> {
  const snap = await withTimeout(getDoc(SETTINGS_DOC));
  if (!snap.exists()) return defaultSettings;
  return { ...defaultSettings, ...(snap.data() as Partial<Settings>) };
}

export function subscribeSettings(
  callback: (settings: Settings) => void,
  onError?: (error: Error) => void,
): () => void {
  const guard = guardSnapshotTimeout(onError);
  const unsubscribe = onSnapshot(
    SETTINGS_DOC,
    (snap) => {
      guard.markSettled();
      if (!snap.exists()) {
        callback(defaultSettings);
        return;
      }
      callback({ ...defaultSettings, ...(snap.data() as Partial<Settings>) });
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

export async function saveSettings(settings: Settings): Promise<void> {
  await withTimeout(setDoc(SETTINGS_DOC, settings));
}
