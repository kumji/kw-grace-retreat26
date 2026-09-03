import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function AdminLayout() {
  const { authenticated, logout } = useAdminAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/" className="text-sm font-bold text-brand-700">
            메인으로
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-medium text-gray-400 hover:text-rose-500"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
