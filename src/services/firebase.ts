import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const alreadyInitialized = getApps().length > 0;
export const app = alreadyInitialized ? getApps()[0]! : initializeApp(firebaseConfig);

// 일부 네트워크(사내망, 특정 와이파이)는 Firestore 기본 스트리밍 연결(WebChannel)을
// 막아 요청이 멈춰버린다. long-polling으로 자동 대체되도록 해 그런 환경에서도
// 등록/제출이 끊기지 않게 한다.
export const db = alreadyInitialized
  ? getFirestore(app)
  : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
