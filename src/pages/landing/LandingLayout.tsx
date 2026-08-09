import { NavLink, Outlet } from 'react-router-dom';
import { ForestBackground } from '@/components/ForestBackground';

const tabs = [
  { to: '/', label: '수련회 안내 및 등록', end: true },
  { to: '/lookup', label: '등록 확인/수정/취소', end: false },
  { to: '/status', label: '수련회 등록 현황', end: false },
  { to: '/programs', label: '선택 프로그램 신청', end: false },
];

export function LandingLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <ForestBackground />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <NavLink
          to="/admin"
          className="absolute right-4 top-4 text-xs font-medium text-gray-400 hover:text-brand-600 sm:right-6 sm:top-6"
        >
          관리자 페이지
        </NavLink>

        <header className="mb-6 text-center">
          <h1 className="mx-auto max-w-xs text-xl font-bold leading-snug text-brand-800 sm:max-w-none sm:text-2xl">
            광림교회 2026 청장년부
            <br />
            가을영성수련회
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
