import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import {
  formatDateRangeKorean,
  getCountdownParts,
  getRegistrationStatus,
} from '@/lib/registrationState';

export function TopTimerBar() {
  const { settings, loading, error } = useSettings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  if (loading || error) return null;

  const status = getRegistrationStatus(settings);
  let message: string;

  switch (status.phase) {
    case 'pending': {
      const range = formatDateRangeKorean(settings.earlyBirdStart, settings.earlyBirdEnd);
      message = range ? `얼리버드 등록 기간은 ${range} 입니다.` : '등록 예정입니다.';
      break;
    }
    case 'earlybird': {
      const { days, hours, minutes } = getCountdownParts(settings.earlyBirdEnd, now);
      message = `얼리버드 등록 마감 ${days}일 ${hours}시 ${minutes}분 전`;
      break;
    }
    case 'regular': {
      const { days, hours, minutes } = getCountdownParts(settings.regularEnd, now);
      message = `일반 등록 마감 ${days}일 ${hours}시 ${minutes}분 전`;
      break;
    }
    case 'closed':
    default:
      message = '등록이 마감되었습니다.';
      break;
  }

  return (
    <div className="sticky top-0 z-50 flex h-9 items-center justify-center bg-[#d4853b] px-4 text-center sm:h-10">
      <p className="truncate text-xs font-medium text-white sm:text-sm">{message}</p>
    </div>
  );
}
