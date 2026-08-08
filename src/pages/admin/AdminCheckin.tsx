import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { subscribeRegistration, setCheckedIn } from '@/services/registrations';
import { formatCurrency } from '@/lib/calc';
import type { Registration } from '@/types';

const SCANNER_ELEMENT_ID = 'checkin-qr-reader';

export function AdminCheckin() {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scannedId) return;

    const scanner = new Html5QrcodeScanner(
      SCANNER_ELEMENT_ID,
      {
        fps: 10,
        qrbox: 250,
        videoConstraints: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          advanced: [{ focusMode: 'continuous' }] as unknown as MediaTrackConstraintSet[],
        },
      },
      false,
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        setScannedId(decodedText);
      },
      () => {},
    );

    return () => {
      scannerRef.current = null;
      scanner.clear().catch(() => {});
    };
  }, [scannedId]);

  useEffect(() => {
    if (!scannedId) return;
    setNotFound(false);
    const unsubscribe = subscribeRegistration(
      scannedId,
      (data) => {
        setRegistration(data);
        setNotFound(!data);
      },
      () => setNotFound(true),
    );
    return unsubscribe;
  }, [scannedId]);

  function handleRescan() {
    setScannedId(null);
    setRegistration(null);
    setNotFound(false);
  }

  async function handleCheckIn() {
    if (!registration) return;
    setCheckingIn(true);
    try {
      await setCheckedIn(registration.id, true);
    } finally {
      setCheckingIn(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">체크인 확인</h1>

      {!scannedId && (
        <Card>
          <p className="mb-3 text-sm text-gray-500">
            참가자의 QR 코드를 카메라에 비춰주세요.
          </p>
          <div id={SCANNER_ELEMENT_ID} className="overflow-hidden rounded-2xl" />
        </Card>
      )}

      {scannedId && notFound && (
        <Card className="space-y-3 text-center">
          <p className="text-sm text-rose-500">등록 정보를 찾을 수 없습니다.</p>
          <Button variant="outline" onClick={handleRescan}>
            다시 스캔
          </Button>
        </Card>
      )}

      {scannedId && registration && (
        <div className="space-y-4">
          {registration.checkedIn && (
            <Card className="border-brand-200 bg-brand-50 text-center">
              <p className="font-semibold text-brand-700">체크인이 완료되었습니다.</p>
            </Card>
          )}

          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-brand-800">{registration.name}</h2>
              <span className="text-sm text-gray-400">{registration.affiliation}</span>
            </div>
            <p className="text-sm text-gray-700">연락처 : {registration.phone}</p>
            <p className="text-sm text-gray-700">숙박 여부 : {registration.lodging}</p>
            <p
              className={`text-sm font-semibold ${
                registration.paymentStatus === '입금완료' ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              입금 여부 : {registration.paymentStatus}
            </p>
            <p className="text-sm text-gray-600">
              총 참가 인원 :{' '}
              <span className="font-semibold text-gray-800">{registration.totalCount}명</span> ·{' '}
              <span className="font-bold text-brand-700">{formatCurrency(registration.amountDue)}</span>
            </p>

            {registration.adults.length > 0 && (
              <div className="space-y-1 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-mint-700">성인</p>
                {registration.adults.map((a, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    {a.name}
                  </p>
                ))}
              </div>
            )}

            {registration.children.length > 0 && (
              <div className="space-y-1 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-brand-700">자녀</p>
                {registration.children.map((c, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    {c.name} · 만 {c.age}세 · {c.schoolStatus}
                  </p>
                ))}
              </div>
            )}

            {registration.note && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400">전달사항</p>
                <p className="whitespace-pre-wrap text-sm text-gray-600">{registration.note}</p>
              </div>
            )}
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleRescan}>
              다시 스캔
            </Button>
            <Button
              className="flex-1"
              disabled={registration.checkedIn || checkingIn}
              onClick={handleCheckIn}
            >
              {registration.checkedIn ? '체크인 완료됨' : checkingIn ? '처리 중...' : '체크인 완료'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
