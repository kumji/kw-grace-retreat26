import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Input, Select } from '@/components/ui/Field';
import { subscribeRegistrations } from '@/services/registrations';
import { buildDisplayRows, countMembers } from '@/lib/adminTable';
import { exportRegistrationsToExcel } from '@/lib/exportExcel';
import { affiliationOptions } from '@/lib/options';
import type { Affiliation, Registration } from '@/types';

const affiliationFilters: Array<Affiliation | '전체'> = ['전체', ...affiliationOptions];

export function AdminRegistrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [affiliation, setAffiliation] = useState<Affiliation | '전체'>('전체');

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

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (search) next.set('search', search);
    else next.delete('search');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchesAffiliation = affiliation === '전체' || r.affiliation === affiliation;
      const matchesSearch = !search.trim() || r.name.includes(search.trim());
      return matchesAffiliation && matchesSearch;
    });
  }, [registrations, affiliation, search]);

  const rows = useMemo(() => buildDisplayRows(filtered), [filtered]);
  const stats = useMemo(() => countMembers(filtered), [filtered]);

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (loadError) {
    return <ErrorNotice message="등록 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-brand-500 text-white">
        <p className="text-sm text-brand-100">총 참가 인원</p>
        <p className="mt-1 text-2xl font-bold">
          성인 {stats.adults}명 / 자녀 {stats.children}명 / 총 {stats.total}명
        </p>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="등록자 이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:flex-1"
          />
          <Select
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value as Affiliation | '전체')}
            className="sm:w-40"
          >
            {affiliationFilters.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => exportRegistrationsToExcel(buildDisplayRows(registrations))}
          >
            엑셀 다운로드
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                {['분류', '등록자', '이름', '소속', '연락처', '생년월', '혈액형', '숙박', '입금', '체크인', '기타'].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => (
                <tr key={`${row.registrationId}-${i}`} className="hover:bg-brand-50/40">
                  <td className="px-3 py-2">
                    <Badge tone={row.category === '대표' ? 'brand' : row.category === '성인' ? 'mint' : 'gray'}>
                      {row.category}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-500">{row.registrantName}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-800">{row.name}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.affiliation}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.phone}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.birthMonth === '' ? '' : `${row.birthMonth}월`}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.bloodType}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.lodging}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.paymentStatus}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.checkedIn ? 'O' : 'X'}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-500">{row.etc}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-gray-400">
                    등록된 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
