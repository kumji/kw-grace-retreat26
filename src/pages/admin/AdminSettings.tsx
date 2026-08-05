import { useEffect, useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { getSettings, saveSettings, defaultSettings } from '@/services/settings';
import type { RegistrationState, Settings } from '@/types';

const registrationStateOptions: RegistrationState[] = ['등록예정', '등록중', '등록마감'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-brand-800">{title}</h2>
      {children}
    </Card>
  );
}

export function AdminSettings() {
  const [saved, setSaved] = useState<Settings>(defaultSettings);
  const [draft, setDraft] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getSettings()
      .then((data) => {
        if (!active) return;
        setSaved(data);
        setDraft(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setMessage('');
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings(draft);
      setSaved(draft);
      setMessage('설정이 저장되었습니다.');
    } catch {
      setMessage('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setDraft(saved);
    setMessage('');
  }

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (loadError) {
    return <ErrorNotice message="설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-lg font-bold text-gray-800">설정</h1>

      <Section title="1. 얼리버드 등록 기간">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="eb-start">시작일</Label>
            <Input
              id="eb-start"
              type="date"
              value={draft.earlyBirdStart}
              onChange={(e) => update('earlyBirdStart', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="eb-end">종료일</Label>
            <Input
              id="eb-end"
              type="date"
              value={draft.earlyBirdEnd}
              onChange={(e) => update('earlyBirdEnd', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title="2. 일반 등록 기간">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="reg-start">시작일</Label>
            <Input
              id="reg-start"
              type="date"
              value={draft.regularStart}
              onChange={(e) => update('regularStart', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reg-end">종료일</Label>
            <Input
              id="reg-end"
              type="date"
              value={draft.regularEnd}
              onChange={(e) => update('regularEnd', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title="3. 성인 등록비">
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={draft.adultFee === 0 ? "" : draft.adultFee}
            onChange={(e) => update('adultFee', Number(e.target.value))}
            className="pr-12"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            원
          </span>
        </div>
      </Section>

      <Section title="4. 자녀 등록비">
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={draft.childFee === 0 ? "" : draft.childFee}
            onChange={(e) => update('childFee', Number(e.target.value))}
            className="pr-12"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            원
          </span>
        </div>
      </Section>

      <Section title="5. 입금 계좌">
        <div className="space-y-3">
          <div>
            <Label htmlFor="bank-name">은행명</Label>
            <Input
              id="bank-name"
              value={draft.bankName}
              onChange={(e) => update('bankName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="account-number">계좌번호</Label>
            <Input
              id="account-number"
              value={draft.accountNumber}
              onChange={(e) => update('accountNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="account-holder">예금주</Label>
            <Input
              id="account-holder"
              value={draft.accountHolder}
              onChange={(e) => update('accountHolder', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title="6. 얼리버드 혜택 안내">
        <Textarea
          value={draft.earlyBirdBenefit}
          onChange={(e) => update('earlyBirdBenefit', e.target.value)}
          placeholder="얼리버드 기간에만 안내 탭에 노출됩니다."
        />
      </Section>

      <Section title="7. 공지사항">
        <Textarea
          value={draft.notice}
          onChange={(e) => update('notice', e.target.value)}
          placeholder="수련회 안내 탭 상단에 표시됩니다."
        />
      </Section>

      <Section title="8. 수련회 안내">
        <Textarea
          value={draft.guideText}
          onChange={(e) => update('guideText', e.target.value)}
          placeholder="줄바꿈, 번호목록, 글머리기호를 사용할 수 있습니다."
          className="min-h-48"
        />
      </Section>

      <Section title="9. 등록 상태">
        <div className="grid grid-cols-3 gap-2">
          {registrationStateOptions.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => update('registrationState', state)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                draft.registrationState === state
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-brand-200'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          날짜 설정보다 우선 적용됩니다. 예: 일반 등록 기간 중이어도 '등록마감' 선택 시 즉시 등록이 중단됩니다.
        </p>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm font-medium text-brand-600">{message}</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
              취소
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '완료'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

