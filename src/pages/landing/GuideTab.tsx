import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { useSettings } from '@/hooks/useSettings';
import { getRegistrationStatus, isEarlyBirdActive } from '@/lib/registrationState';
import { findRegistrationByNamePhone } from '@/services/registrations';
import { saveRegistrationId } from '@/lib/localRegistration';

export function GuideTab() {
  const { settings, loading, error } = useSettings();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');

  async function handleCheck(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      setCheckError('이름과 전화번호를 입력해 주세요.');
      return;
    }

    setChecking(true);
    setCheckError('');
    try {
      const found = await findRegistrationByNamePhone(trimmedName, trimmedPhone);
      if (found) {
        saveRegistrationId(found.id);
        navigate('/lookup', { state: { justRegistered: true } });
      } else {
        navigate('/register', { state: { name: trimmedName, phone: trimmedPhone } });
      }
    } catch {
      setCheckError('확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (error) {
    return <ErrorNotice message={error} />;
  }

  const status = getRegistrationStatus(settings);

  return (
    <div className="space-y-4">
      {settings.notice && (
        <Card>
          <h2 className="mb-2 text-sm font-bold text-brand-700">공지사항</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-600">{settings.notice}</p>
        </Card>
      )}

      {isEarlyBirdActive(settings) && settings.earlyBirdBenefit && (
        <Card className="border-mint-200 bg-mint-50">
          <div className="mb-2 flex items-center gap-2">
            <Badge tone="mint">얼리버드 혜택</Badge>
          </div>
          <p className="whitespace-pre-wrap text-sm text-mint-900">{settings.earlyBirdBenefit}</p>
        </Card>
      )}

      <Card>
        <h2 className="mb-2 text-sm font-bold text-brand-700">수련회 안내</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {settings.guideText || '안내 내용이 준비 중입니다.'}
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-bold text-brand-700">행사 시간표</h2>
        <p className="text-sm text-gray-400">추후 업데이트 예정입니다.</p>
      </Card>

      <Card className="space-y-4">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <Label htmlFor="guide-name">이름</Label>
            <Input id="guide-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="guide-phone">전화번호</Label>
            <Input
              id="guide-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
            />
          </div>
          {checkError && <p className="text-sm text-rose-500">{checkError}</p>}
          {!status.canRegister && <p className="text-sm text-gray-400">{status.message}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={checking || !status.canRegister}>
            {checking ? '확인 중...' : '등록하기'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
