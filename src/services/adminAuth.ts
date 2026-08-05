const ADMIN_PASSWORD = '3040';
const SESSION_KEY = 'admin_session_started_at';
const SESSION_DURATION_MS = 30 * 60 * 1000;

export function login(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  return true;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  const startedAt = Number(raw);
  if (Number.isNaN(startedAt)) return false;
  return Date.now() - startedAt < SESSION_DURATION_MS;
}
