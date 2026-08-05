import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navItems = [
  { to: '/admin/registrations', label: '등록 현황' },
  { to: '/admin/payments', label: '입금 확인' },
  { to: '/admin/checkin', label: '체크인 확인' },
  { to: '/admin/settings', label: '설정' },
];

export function AdminLayout() {
  const { authenticated, logout } = useAdminAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-9 z-10 border-b border-gray-100 bg-white/90 backdrop-blur sm:top-10">
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
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
