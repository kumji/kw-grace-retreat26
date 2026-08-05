import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Input, Select } from '@/components/ui/Field';
import { subscribeRegistrations, setPaymentStatus } from '@/services/registrations';
import { formatCurrency } from '@/lib/calc';
import { affiliationOptions } from '@/lib/options';
import type { Affiliation, PaymentStatus, Registration } from '@/types';

const affiliationFilters: Array<Affiliation | '전체'> = ['전체', ...affiliationOptions];
const paymentFilters: Array<PaymentStatus | '전체'> = ['전체', '입금전', '입금완료'];

export function AdminPayments() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [affiliation, setAffiliation] = useState<Affiliation | '전체'>('전체');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | '전체'>('전체');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchesAffiliation = affiliation === '전체' || r.affiliation === affiliation;
      const matchesPayment = paymentFilter === '전체' || r.paymentStatus === paymentFilter;
      const matchesSearch = !search.trim() || r.name.includes(search.trim());
      return matchesAffiliation && matchesPayment && matchesSearch;
    });
  }, [registrations, affiliation, paymentFilter, search]);

  const stats = useMemo(() => {
    const totalRegistrants = filtered.length;
    const paidRegistrants = filtered.filter((r) => r.paymentStatus === '입금완료').length;
    const pendingAmount = filtered
      .filter((r) => r.paymentStatus === '입금전')
      .reduce((sum, r) => sum + r.amountDue, 0);
    const paidAmount = filtered
      .filter((r) => r.paymentStatus === '입금완료')
      .reduce((sum, r) => sum + r.amountDue, 0);
    return { totalRegistrants, paidRegistrants, pendingAmount, paidAmount };
  }, [filtered]);

  async function handleTogglePayment(r: Registration) {
    setUpdatingId(r.id);
    try {
      await setPaymentStatus(r.id, r.paymentStatus === '입금완료' ? '입금전' : '입금완료');
    } finally {
      setUpdatingId(null);
    }
  }

  function goToRegistration(name: string) {
    navigate(`/admin/registrations?search=${encodeURIComponent(name)}`);
  }

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (loadError) {
    return <ErrorNotice message="입금 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-gray-400">등록자 현황</p>
          <p className="mt-1 text-xl font-bold text-brand-700">
            총 등록자 {stats.totalRegistrants}명 / 입금 완료 {stats.paidRegistrants}명
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">입금 현황</p>
          <p className="text-sm text-gray-500">
            입금 완료 <span className="font-bold text-brand-700">{formatCurrency(stats.paidAmount)}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            총액 <span className="font-bold text-gray-700">{formatCurrency(stats.pendingAmount)}</span>
          </p>
        </Card>
      </div>

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
            className="sm:w-36"
          >
            {affiliationFilters.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | '전체')}
            className="sm:w-36"
          >
            {paymentFilters.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                {['등록자', '소속', '등록 인원', '등록비', '입금 여부', '등록자 정보', '입금 확인'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-brand-50/40">
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-800">{r.name}</td>
                  <td className="whitespace-nowrap px-3 py-2">{r.affiliation}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                    성인 {1 + r.adults.length}명 / 자녀 {r.children.length}명
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{formatCurrency(r.amountDue)}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={r.paymentStatus === '입금완료' ? 'text-brand-600' : 'text-gray-400'}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <Button variant="ghost" size="sm" onClick={() => goToRegistration(r.name)}>
                      등록자 정보
                    </Button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <Button
                      size="sm"
                      variant={r.paymentStatus === '입금완료' ? 'outline' : 'primary'}
                      disabled={updatingId === r.id}
                      onClick={() => handleTogglePayment(r)}
                    >
                      {r.paymentStatus === '입금완료' ? '취소하기' : '입금 확인'}
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-gray-400">
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
