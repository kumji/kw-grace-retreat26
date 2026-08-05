import { useCallback, useEffect, useRef, useState } from 'react';
import * as adminAuth from '@/services/adminAuth';

export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(() => adminAuth.isAuthenticated());
  const wasAuthenticated = useRef(authenticated);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const stillValid = adminAuth.isAuthenticated();
      if (wasAuthenticated.current && !stillValid) {
        // 30-minute window just lapsed — also sign out of Firebase so the
        // underlying auth token can't be used past the UI's own timeout.
        void adminAuth.logout();
      }
      wasAuthenticated.current = stillValid;
      setAuthenticated(stillValid);
    }, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  const login = useCallback(async (password: string) => {
    const ok = await adminAuth.login(password);
    wasAuthenticated.current = ok;
    setAuthenticated(ok);
    return ok;
  }, []);

  const logout = useCallback(() => {
    wasAuthenticated.current = false;
    setAuthenticated(false);
    void adminAuth.logout();
  }, []);

  return { authenticated, login, logout };
}
