import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Input, Label } from '@/components/ui/Field';
import { RegistrantForm } from '@/components/register/RegistrantForm';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/calc';
import {
  deleteRegistration,
  findRegistrationByNamePhone,
  subscribeRegistration,
  updateRegistration,
} from '@/services/registrations';
import { clearRegistrationId, getRegistrationId, saveRegistrationId } from '@/lib/localRegistration';
import type { Registration, RegistrationInput } from '@/types';

type Mode = 'loading' | 'search' | 'detail' | 'edit' | 'error';

export function LookupTab() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [justRegistered] = useState<boolean>(
    () => Boolean((location.state as { justRegistered?: boolean } | null)?.justRegistered),
  );
  const [regId, setRegId] = useState<string | null>(() => getRegistrationId());
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [mode, setMode] = useState<Mode>(regId ? 'loading' : 'search');
  const [showQr, setShowQr] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);

  useEffect(() => {
    if (!regId) {
      setMode('search');
      return;
    }
    setMode('loading');
    const unsubscribe = subscribeRegistration(
      regId,
      (data) => {
        if (!data) {
          clearRegistrationId();
          setRegId(null);
          setRegistration(null);
          setMode('search');
          return;
        }
        setRegistration(data);
        setMode((prev) => (prev === 'edit' ? 'edit' : 'detail'));
      },
      () => setMode('error'),
    );
    return unsubscribe;
  }, [regId]);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearching(true);
    setSearchError('');
    try {
      const found = await findRegistrationByNamePhone(searchName.trim(), searchPhone.trim());
      if (!found) {
        setSearchError('등록 정보를 찾을 수 없습니다. 이름과 연락처를 확인해 주세요.');
        return;
      }
      saveRegistrationId(found.id);
      setRegId(found.id);
    } catch {
      setSearchError('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSearching(false);
    }
  }

  async function handleUpdate(input: RegistrationInput) {
    if (!registration) return;
    setSaving(true);
    try {
      await updateRegistration(registration.id, input, settings);
      setMode('detail');
    } finally {
      setSaving(false);
    }
  }

  function handleGoBack() {
    clearRegistrationId();
    setRegId(null);
    setRegistration(null);
    setSearchName('');
    setSearchPhone('');
    setSearchError('');
    setMode('search');
  }

  async function handleCopyAccountNumber() {
    try {
      await navigator.clipboard.writeText(settings.accountNumber);
      setAccountCopied(true);
      setTimeout(() => setAccountCopied(false), 2000);
    } catch {
      // clipboard access denied or unavailable; silently ignore
    }
  }

  async function handleCancelRegistration() {
    if (!registration) return;
    if (!window.confirm('정말 등록을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.')) return;
    setCancelling(true);
    try {
      await deleteRegistration(registration.id);
      clearRegistrationId();
      navigate('/');
    } finally {
      setCancelling(false);
    }
  }

  if (mode === 'loading') {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (mode === 'error') {
    return <ErrorNotice message="등록 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  if (mode === 'search') {
    return (
      <Card className="space-y-4">
        <p className="text-sm text-gray-500">
          등록하신 이름과 연락처로 등록 정보를 조회할 수 있습니다.
        </p>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="search-name">대표자 이름</Label>
            <Input
              id="search-name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="search-phone">연락처</Label>
            <Input
              id="search-phone"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
            />
          </div>
          {searchError && <p className="text-sm text-rose-500">{searchError}</p>}
          <Button type="submit" className="w-full" disabled={searching}>
            {searching ? '조회 중...' : '조회하기'}
          </Button>
        </form>
      </Card>
    );
  }

  if (!registration) return null;

  if (mode === 'edit') {
    const initialValue: RegistrationInput = {
      name: registration.name,
      affiliation: registration.affiliation,
      phone: registration.phone,
      birthMonth: registration.birthMonth,
      bloodType: registration.bloodType,
      lodging: registration.lodging,
      adults: registration.adults,
      children: registration.children,
      note: registration.note,
    };
    return (
      <RegistrantForm
        initialValue={initialValue}
        settings={settings}
        submitLabel="수정 완료"
        submitting={saving}
        onSubmit={handleUpdate}
        onCancel={() => setMode('detail')}
      />
    );
  }

  const isEarlyBirdRegistration = registration.earlyBirdEligible;

  return (
    <div className="space-y-4">
      {justRegistered && (
        <Card className="animate-fade-in-up border-brand-200 bg-brand-50 text-center">
          <p className="font-semibold text-brand-700">등록 완료 되었습니다.</p>
        </Card>
      )}

      {registration.checkedIn && (
        <Card className="border-brand-200 bg-brand-50 text-center">
          <p className="font-semibold text-brand-700">체크인이 완료되었습니다.</p>
        </Card>
      )}

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-800">등록 정보</h2>
          <div className="flex gap-1.5">
            <Badge tone={isEarlyBirdRegistration ? 'mint' : 'gray'}>
              {isEarlyBirdRegistration ? '얼리버드' : '일반'}
            </Badge>
            <Badge tone="gray">{registration.affiliation}</Badge>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-gray-400">이름</dt>
          <dd className="text-right text-gray-700">{registration.name}</dd>
          <dt className="text-gray-400">연락처</dt>
          <dd className="text-right text-gray-700">{registration.phone}</dd>
          <dt className="text-gray-400">생년월</dt>
          <dd className="text-right text-gray-700">{registration.birthMonth}월</dd>
          <dt className="text-gray-400">혈액형</dt>
          <dd className="text-right text-gray-700">{registration.bloodType}형</dd>
          <dt className="text-gray-400">숙박 여부</dt>
          <dd className="text-right text-gray-700">{registration.lodging}</dd>
        </dl>

        {registration.adults.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-mint-700">성인</p>
            {registration.adults.map((a, i) => (
              <p key={i} className="text-sm text-gray-600">
                {a.name} · {a.birthMonth}월 · {a.bloodType}형
              </p>
            ))}
          </div>
        )}

        {registration.children.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-brand-700">자녀</p>
            {registration.children.map((c, i) => (
              <p key={i} className="text-sm text-gray-600">
                {c.name} · 만 {c.age}세 · {c.schoolStatus}
              </p>
            ))}
          </div>
        )}

        {registration.note && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400">추가 전달사항</p>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{registration.note}</p>
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-base font-bold text-brand-800">입금 안내</h2>
        <div className="rounded-2xl bg-mint-50 p-4 text-sm text-mint-900">
          <div className="flex items-stretch justify-between gap-3">
            <div>
              <p className="font-semibold">입금 계좌: {settings.bankName} {settings.accountNumber}</p>
              <p>예금주 : {settings.accountHolder}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 self-stretch"
              onClick={handleCopyAccountNumber}
            >
              복사하기
            </Button>
          </div>
          {accountCopied && (
            <p className="mt-2 animate-fade-in-up text-xs font-semibold text-brand-600">
              계좌번호가 복사되었습니다.
            </p>
          )}
        </div>
        <p className="text-sm text-gray-500">총 참가 인원 : {registration.totalCount}명</p>
        <p className="text-lg font-bold text-brand-700">{formatCurrency(registration.amountDue)}</p>
        <p
          className={`text-sm font-semibold ${
            registration.paymentStatus === '입금완료' ? 'text-brand-600' : 'text-gray-400'
          }`}
        >
          {registration.paymentStatus === '입금완료'
            ? '입금 완료되었습니다. 감사합니다.'
            : '아직 입금 전입니다.'}
        </p>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setMode('edit')}>
          수정하기
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={handleCancelRegistration}
          disabled={cancelling}
        >
          {cancelling ? '취소 중...' : '취소하기'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleGoBack}>
          돌아가기
        </Button>
      </div>

      <Card className="flex flex-col items-center gap-3 text-center">
        <Button type="button" variant="secondary" className="w-full" onClick={() => setShowQr((v) => !v)}>
          {showQr ? 'QR 코드 닫기' : 'QR 체크인'}
        </Button>
        {showQr && (
          <div className="animate-fade-in-up rounded-2xl border border-brand-100 bg-white p-4">
            <QRCodeSVG value={registration.id} size={200} />
          </div>
        )}
      </Card>
    </div>
  );
}
