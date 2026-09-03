import { useState, type FormEvent } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const ok = await login(password);
    if (ok) {
      navigate(from, { replace: true });
      return;
    }
    setError('비밀번호가 올바르지 않습니다.');
    setPassword('');
    setSubmitting(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 via-white to-white px-4">
      <NavLink
        to="/"
        className="absolute left-4 top-4 text-sm font-medium text-gray-400 hover:text-brand-600 sm:left-6 sm:top-6"
      >
        메인으로
      </NavLink>
      <Card className="w-full max-w-sm animate-fade-in-up">
        <h1 className="mb-1 text-center text-lg font-bold text-brand-800">관리자 로그인</h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          광림교회 2026 청장년부 가을영성수련회
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-password">비밀번호</Label>
            <Input
              id="admin-password"
              type="password"
              inputMode="numeric"
              autoFocus
              disabled={submitting}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="비밀번호 입력"
            />
            {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
