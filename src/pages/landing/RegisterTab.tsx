import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { RegistrantForm } from '@/components/register/RegistrantForm';
import { useSettings } from '@/hooks/useSettings';
import { getRegistrationStatus } from '@/lib/registrationState';
import { createRegistration } from '@/services/registrations';
import { saveRegistrationId } from '@/lib/localRegistration';
import type { RegistrationInput } from '@/types';

const emptyValue: RegistrationInput = {
  name: '',
  affiliation: '청장1부',
  phone: '',
  birthMonth: 1,
  bloodType: 'A',
  lodging: 'X',
  adults: [],
  children: [],
  note: '',
};

export function RegisterTab() {
  const { settings, loading, error: settingsError } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const prefill = location.state as { name?: string; phone?: string } | null;
  const initialValue: RegistrationInput = {
    ...emptyValue,
    name: prefill?.name ?? emptyValue.name,
    phone: prefill?.phone ?? emptyValue.phone,
  };

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (settingsError) {
    return <ErrorNotice message={settingsError} />;
  }

  const status = getRegistrationStatus(settings);

  async function handleSubmit(input: RegistrationInput) {
    setSubmitting(true);
    setError('');
    try {
      const id = await createRegistration(input, settings);
      saveRegistrationId(id);
      navigate('/lookup');
    } catch {
      setError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-gray-500">가족은 대표 1명만 신청합니다.</p>
        <div className="mt-3">
          {status.phase === 'earlybird' && <Badge tone="mint">얼리버드 등록 중</Badge>}
          {status.phase === 'regular' && <Badge tone="brand">일반 등록 중</Badge>}
          {(status.phase === 'pending' || status.phase === 'closed') && (
            <Badge tone="gray">{status.message}</Badge>
          )}
        </div>
      </Card>

      {!status.canRegister ? (
        <Card className="text-center">
          <p className="py-6 text-base font-semibold text-gray-500">{status.message}</p>
        </Card>
      ) : (
        <>
          <RegistrantForm
            initialValue={initialValue}
            settings={settings}
            submitLabel="신청하기"
            submitting={submitting}
            onSubmit={handleSubmit}
          />
          {error && <p className="text-center text-sm text-rose-500">{error}</p>}
        </>
      )}
    </div>
  );
}
