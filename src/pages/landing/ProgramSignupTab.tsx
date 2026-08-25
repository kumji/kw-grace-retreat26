import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Input, Label, Select } from '@/components/ui/Field';
import { ProgramBlock, type SlotStatus } from '@/components/programs/ProgramBlock';
import { useSettings } from '@/hooks/useSettings';
import { isProgramSignupActive } from '@/lib/registrationState';
import { affiliationOptions } from '@/lib/options';
import { PROGRAMS, getOccupiedSlotIds } from '@/lib/programData';
import { getProgramIdentity, saveProgramIdentity } from '@/lib/programIdentity';
import {
  ProgramSlotConflictError,
  ProgramSlotFullError,
  createProgramSignup,
  deleteProgramSignup,
  subscribeProgramSignups,
} from '@/services/programSignups';
import type { Affiliation, ProgramSignup } from '@/types';

export function ProgramSignupTab() {
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();

  const savedIdentity = useMemo(() => getProgramIdentity(), []);
  const [name, setName] = useState(savedIdentity?.name ?? '');
  const [affiliation, setAffiliation] = useState<Affiliation>(savedIdentity?.affiliation ?? '청장1부');

  const [signups, setSignups] = useState<ProgramSignup[]>([]);
  const [signupsLoading, setSignupsLoading] = useState(true);
  const [signupsError, setSignupsError] = useState(false);

  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeProgramSignups(
      (data) => {
        setSignups(data);
        setSignupsLoading(false);
      },
      () => {
        setSignupsLoading(false);
        setSignupsError(true);
      },
    );
    return unsubscribe;
  }, []);

  const trimmedName = name.trim();
  const identityReady = trimmedName.length > 0;

  useEffect(() => {
    if (!identityReady) return;
    saveProgramIdentity({ name: trimmedName, affiliation });
  }, [identityReady, trimmedName, affiliation]);

  // 이 사람(이름+소속)이 이미 신청해 둔 프로그램들과, 각각이 차지하는 시간대.
  // '강단 꽃꽂이'처럼 하나의 신청이 타임1·타임2를 모두 차지하는 경우가 있어
  // slotId가 아니라 실제 차지하는 시간대가 겹치는지로 충돌을 판단한다.
  const myOccupiedEntries = useMemo(() => {
    if (!identityReady) return [];
    return signups
      .filter((s) => s.name === trimmedName && s.affiliation === affiliation)
      .map((s) => {
        const program = PROGRAMS.find((p) => p.id === s.programId);
        const slot = program?.slots.find((sl) => sl.id === s.slotId);
        return {
          programId: s.programId,
          programName: program?.name ?? '',
          occupiesSlotIds: getOccupiedSlotIds(slot ?? { id: s.slotId }),
        };
      });
  }, [signups, identityReady, trimmedName, affiliation]);

  const statusByProgram = useMemo(() => {
    const result: Record<string, Record<string, SlotStatus>> = {};
    for (const program of PROGRAMS) {
      const slotStatus: Record<string, SlotStatus> = {};
      for (const slot of program.slots) {
        const matches = signups.filter((s) => s.programId === program.id && s.slotId === slot.id);
        const registered =
          identityReady && matches.some((s) => s.name === trimmedName && s.affiliation === affiliation);
        const slotOccupied = getOccupiedSlotIds(slot);
        const conflictEntry = myOccupiedEntries.find(
          (e) => e.programId !== program.id && e.occupiesSlotIds.some((id) => slotOccupied.includes(id)),
        );
        slotStatus[slot.id] = {
          count: matches.length,
          names: matches.map((s) => `${s.name}(${s.affiliation})`),
          registered,
          conflictProgramName: conflictEntry?.programName,
        };
      }
      result[program.id] = slotStatus;
    }
    return result;
  }, [signups, identityReady, trimmedName, affiliation, myOccupiedEntries]);

  if (settingsLoading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (settingsError) {
    return <ErrorNotice message={settingsError} />;
  }

  const active = isProgramSignupActive(settings);

  async function handleRegister(programId: string, slotId: string, capacity: number | null) {
    const key = `${programId}:${slotId}`;
    setPendingKey(key);
    setError('');
    setExpandedProgramId(programId);
    try {
      await createProgramSignup({ programId, slotId, name: trimmedName, affiliation }, capacity);
    } catch (e) {
      if (e instanceof ProgramSlotFullError) {
        setError('방금 정원이 마감되었습니다. 다른 프로그램을 확인해 주세요.');
      } else if (e instanceof ProgramSlotConflictError) {
        setError('이미 같은 타임에 다른 프로그램을 신청하셨습니다.');
      } else {
        setError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setPendingKey(null);
    }
  }

  async function handleCancel(programId: string, slotId: string) {
    const match = signups.find(
      (s) =>
        s.programId === programId &&
        s.slotId === slotId &&
        s.name === trimmedName &&
        s.affiliation === affiliation,
    );
    if (!match) return;
    const key = `${programId}:${slotId}`;
    setPendingKey(key);
    setError('');
    try {
      await deleteProgramSignup(match.id);
    } catch {
      setError('취소 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-brand-800">신청자 정보</h2>
          <p className="mt-1 text-sm text-gray-500">
            이름과 소속을 입력한 뒤, 원하는 프로그램의 '등록' 버튼을 눌러 신청해 주세요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="program-name">성명</Label>
            <Input
              id="program-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
            />
          </div>
          <div>
            <Label htmlFor="program-affiliation">소속</Label>
            <Select
              id="program-affiliation"
              value={affiliation}
              onChange={(e) => {
                setAffiliation(e.target.value as Affiliation);
                setError('');
              }}
            >
              {affiliationOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {!identityReady && <p className="text-xs text-amber-600">성명을 입력하면 신청할 수 있어요.</p>}
      </Card>

      <Card>
        {active ? (
          <Badge tone="mint">선택 프로그램 신청 가능 시간입니다</Badge>
        ) : (
          <Badge tone="gray">대기중 · 신청 가능 시간이 아닙니다</Badge>
        )}
      </Card>

      {error && <p className="text-center text-sm text-rose-500">{error}</p>}

      {signupsLoading ? (
        <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : signupsError ? (
        <ErrorNotice message="프로그램 신청 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />
      ) : (
        <div className="space-y-3">
          {PROGRAMS.map((program) => (
            <ProgramBlock
              key={program.id}
              program={program}
              slotStatus={statusByProgram[program.id] ?? {}}
              identityAffiliation={affiliation}
              active={active}
              identityReady={identityReady}
              pendingSlotId={
                pendingKey?.startsWith(`${program.id}:`) ? pendingKey.slice(program.id.length + 1) : null
              }
              expanded={expandedProgramId === program.id}
              onToggleExpanded={() =>
                setExpandedProgramId((prev) => (prev === program.id ? null : program.id))
              }
              onRegister={(slotId) => {
                const slot = program.slots.find((s) => s.id === slotId);
                void handleRegister(program.id, slotId, slot?.capacity ?? null);
              }}
              onCancel={(slotId) => void handleCancel(program.id, slotId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
