import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { BarChart } from '@/components/BarChart';
import { subscribeRegistrations } from '@/services/registrations';
import {
  getAffiliationStats,
  getBloodTypeGroups,
  getMemberTypeStats,
  getSeasonGroups,
  getTotalParticipants,
} from '@/lib/participantStats';
import type { Registration } from '@/types';

const bloodTypeOrder = ['A', 'B', 'AB', 'O'] as const;
const bloodTypeAccent: Record<(typeof bloodTypeOrder)[number], string> = {
  A: 'border-mint-100 bg-mint-50',
  B: 'border-brand-100 bg-brand-50',
  AB: 'border-amber-100 bg-amber-50',
  O: 'border-rose-100 bg-rose-50',
};

const seasonOrder = ['겨울', '봄', '여름', '가을'] as const;
const seasonAccent: Record<(typeof seasonOrder)[number], string> = {
  겨울: 'border-sky-100 bg-sky-50',
  봄: 'border-brand-100 bg-brand-50',
  여름: 'border-amber-100 bg-amber-50',
  가을: 'border-orange-100 bg-orange-50',
};
const seasonSubLabel: Record<(typeof seasonOrder)[number], string> = {
  겨울: '12월 ~ 2월생',
  봄: '3월 ~ 5월생',
  여름: '6월 ~ 8월생',
  가을: '9월 ~ 11월생',
};

function GroupCard({
  title,
  subLabel,
  names,
  accentClass,
}: {
  title: string;
  subLabel?: string;
  names: string[];
  accentClass: string;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${accentClass}`}>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <span className="text-xs text-gray-400">{names.length}명</span>
      </div>
      {subLabel && <p className="mb-2 -mt-1 text-xs text-gray-400">{subLabel}</p>}
      {names.length === 0 ? (
        <p className="text-xs text-gray-400">아직 없어요</p>
      ) : (
        <p className="text-sm leading-relaxed text-gray-600">{names.join(', ')}</p>
      )}
    </div>
  );
}

export function RegistrationStatusTab() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeRegistrations(
      (data) => {
        setRegistrations(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setLoadError(true);
      },
    );
    return unsubscribe;
  }, []);

  const total = useMemo(() => getTotalParticipants(registrations), [registrations]);
  const memberTypeStats = useMemo(() => getMemberTypeStats(registrations), [registrations]);
  const affiliationStats = useMemo(() => getAffiliationStats(registrations), [registrations]);
  const bloodTypeGroups = useMemo(() => getBloodTypeGroups(registrations), [registrations]);
  const seasonGroups = useMemo(() => getSeasonGroups(registrations), [registrations]);

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (loadError) {
    return <ErrorNotice message="등록 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-brand-100 bg-[#a38e26] p-5 text-center text-white shadow-sm shadow-brand-100/40 sm:p-6">
        <p className="text-lg font-bold leading-snug sm:text-xl">
          현재까지 총 {total}명의 지체가 참여합니다.
          <br />더 많이 함께해요!
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-brand-700">성인 / 취학 아동 / 미취학 아동</h2>
        <BarChart items={memberTypeStats} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-brand-700">청장1부 / 청장2부 / 지성전</h2>
        <BarChart items={affiliationStats} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-brand-700">
          나랑 같은 혈액형을 가진 지체를 찾아보아요!
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {bloodTypeOrder.map((type) => (
            <GroupCard
              key={type}
              title={`${type}형`}
              names={bloodTypeGroups[type]}
              accentClass={bloodTypeAccent[type]}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-brand-700">
          나랑 같은 계절에 태어난 지체는 누굴까요?
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {seasonOrder.map((season) => (
            <GroupCard
              key={season}
              title={season}
              subLabel={seasonSubLabel[season]}
              names={seasonGroups[season]}
              accentClass={seasonAccent[season]}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
