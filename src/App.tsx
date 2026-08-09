import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TopTimerBar } from '@/components/TopTimerBar';
import { LandingLayout } from '@/pages/landing/LandingLayout';
import { GuideTab } from '@/pages/landing/GuideTab';
import { RegisterTab } from '@/pages/landing/RegisterTab';
import { LookupTab } from '@/pages/landing/LookupTab';
import { RegistrationStatusTab } from '@/pages/landing/RegistrationStatusTab';
import { ProgramSignupTab } from '@/pages/landing/ProgramSignupTab';

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminRegistrations = lazy(() =>
  import('@/pages/admin/AdminRegistrations').then((m) => ({ default: m.AdminRegistrations })),
);
const AdminPayments = lazy(() =>
  import('@/pages/admin/AdminPayments').then((m) => ({ default: m.AdminPayments })),
);
const AdminCheckin = lazy(() =>
  import('@/pages/admin/AdminCheckin').then((m) => ({ default: m.AdminCheckin })),
);
const AdminSettings = lazy(() =>
  import('@/pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })),
);

function AdminFallback() {
  return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
}

export default function App() {
  return (
    <>
      <TopTimerBar />
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<GuideTab />} />
          <Route path="register" element={<RegisterTab />} />
          <Route path="lookup" element={<LookupTab />} />
          <Route path="status" element={<RegistrationStatusTab />} />
          <Route path="programs" element={<ProgramSignupTab />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Navigate to="registrations" replace />} />
          <Route
            path="registrations"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminRegistrations />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminPayments />
              </Suspense>
            }
          />
          <Route
            path="checkin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminCheckin />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminSettings />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
