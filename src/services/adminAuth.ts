import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebase';

// Initialized here (not in the shared firebase.ts) so `firebase/auth` only
// gets bundled/loaded for the already-lazy admin routes, not the public
// registration flow that never needs it.
const auth = getAuth(app);

// The login screen only asks for a password (spec 4.0) — this fixed account
// email is an implementation detail behind that single field, letting the
// app use real Firebase Auth (and therefore Firestore rules can trust
// request.auth.uid) without changing the admin-facing UX.
const ADMIN_EMAIL = 'admin@kw-grace-retreat26.app';
const SESSION_KEY = 'admin_session_started_at';
const SESSION_DURATION_MS = 30 * 60 * 1000;

export async function login(password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  } catch {
    return false;
  }
  sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  return true;
}

export async function logout(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
  await signOut(auth).catch(() => {});
}

export function isAuthenticated(): boolean {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  const startedAt = Number(raw);
  if (Number.isNaN(startedAt)) return false;
  return Date.now() - startedAt < SESSION_DURATION_MS;
}
