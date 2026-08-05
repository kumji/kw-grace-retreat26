import { NavLink, Outlet } from 'react-router-dom';
import { ForestBackground } from '@/components/ForestBackground';

const tabs = [
  { to: '/', label: '수련회 안내', end: true },
  { to: '/lookup', label: '등록확인/수정', end: false },
];

export function LandingLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <ForestBackground />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <header className="relative mb-6 text-center">
          <NavLink
            to="/admin"
            className="absolute right-0 top-0 text-xs font-medium text-gray-400 hover:text-brand-600"
          >
            관리자 페이지
          </NavLink>
          <h1 className="mx-auto max-w-xs text-xl font-bold leading-snug text-brand-800 sm:max-w-none sm:text-2xl">
            광림교회 청장년부
            <br />
            2026 영성수련회
          </h1>
        </header>

        <nav className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-brand-100/60 p-1.5">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `rounded-xl px-2 py-2.5 text-center text-sm font-semibold transition-colors sm:text-base ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-brand-500/70 hover:text-brand-700'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <main className="animate-fade-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
