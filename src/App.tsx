import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SurveyPage } from '@/pages/SurveyPage';

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminSurveyResponses = lazy(() =>
  import('@/pages/admin/AdminSurveyResponses').then((m) => ({ default: m.AdminSurveyResponses })),
);

function AdminFallback() {
  return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyPage />} />

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
        <Route
          index
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminSurveyResponses />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
