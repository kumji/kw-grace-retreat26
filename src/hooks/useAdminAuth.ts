import { useCallback, useEffect, useState } from 'react';
import * as adminAuth from '@/services/adminAuth';

export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(() => adminAuth.isAuthenticated());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAuthenticated(adminAuth.isAuthenticated());
    }, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  const login = useCallback((password: string) => {
    const ok = adminAuth.login(password);
    setAuthenticated(ok);
    return ok;
  }, []);

  const logout = useCallback(() => {
    adminAuth.logout();
    setAuthenticated(false);
  }, []);

  return { authenticated, login, logout };
}
