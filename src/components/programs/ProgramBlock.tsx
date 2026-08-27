import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProgramDef } from '@/lib/programData';
import type { Affiliation } from '@/types';

export interface SlotStatus {
  count: number;
  names: string[];
  registered: boolean;
  conflictProgramName?: string;
}

interface Props {
  program: ProgramDef;
  slotStatus: Record<string, SlotStatus>;
  identityAffiliation: Affiliation;
  active: boolean;
  identityReady: boolean;
  pendingSlotId: string | null;
  expanded: boolean;
  onToggleExpanded: () => void;
  onRegister: (slotId: string) => void;
  onCancel: (slotId: string) => void;
}

export function ProgramBlock({
  program,
  slotStatus,
  identityAffiliation,
  active,
  identityReady,
  pendingSlotId,
  expanded,
  onToggleExpanded,
  onRegister,
  onCancel,
}: Props) {
  return (
    <Card className="space-y-3">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <p className="text-base font-bold text-brand-800">{program.name}</p>
          <p className="text-xs text-gray-400">모임장소: {program.location}</p>
        </div>
        <span className="mt-1 shrink-0 text-xs font-medium text-gray-400">
          {expanded ? '명단 접기 ▲' : '명단 보기 ▼'}
        </span>
      </button>

      {program.detail && (
        <div className="border-l-2 border-brand-100 pl-3">
          <p className="text-sm leading-relaxed text-gray-600">{program.detail}</p>
        </div>
      )}

      <div className="space-y-2">
        {program.slots.map((slot) => {
          const status = slotStatus[slot.id] ?? { count: 0, names: [], registered: false };
          const full = slot.capacity !== null && status.count >= slot.capacity;
          const affiliationBlocked =
            !status.registered &&
            Boolean(slot.allowedAffiliations) &&
            !slot.allowedAffiliations!.includes(identityAffiliation);
          const pending = pendingSlotId === slot.id;

          let buttonLabel = '등록';
          let disabled = false;
          let variant: 'primary' | 'outline' = 'primary';

          if (!active) {
            buttonLabel = '대기중';
            disabled = true;
          } else if (status.registered) {
            buttonLabel = pending ? '취소 중...' : '취소';
            variant = 'outline';
            disabled = pending;
          } else if (full) {
            buttonLabel = '마감';
            disabled = true;
          } else if (affiliationBlocked) {
            buttonLabel = '신청 불가';
            disabled = true;
          } else if (status.conflictProgramName) {
            buttonLabel = '타임 중복';
            disabled = true;
          } else if (!identityReady) {
            buttonLabel = '등록';
            disabled = true;
          } else {
            buttonLabel = pending ? '등록 중...' : '등록';
            disabled = pending;
          }

          return (
            <div key={slot.id} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700">
                    {slot.label}
                    {slot.note && <span className="ml-1.5 text-xs font-normal text-gray-400">{slot.note}</span>}
                  </p>
                  <p className="text-xs text-gray-400">
                    {status.count}/{slot.capacity ?? '무제한'}
                    {slot.capacity !== null ? slot.unitLabel : ''}
                  </p>
                  {!status.registered && status.conflictProgramName && (
                    <p className="mt-0.5 text-xs text-amber-600">
                      이미 '{status.conflictProgramName}' 신청됨
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={variant}
                  disabled={disabled}
                  onClick={() => (status.registered ? onCancel(slot.id) : onRegister(slot.id))}
                  className="shrink-0"
                >
                  {buttonLabel}
                </Button>
              </div>

              {expanded && (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  {status.names.length === 0 ? (
                    <p className="text-xs text-gray-400">아직 신청자가 없어요</p>
                  ) : (
                    <p className="text-xs leading-relaxed text-gray-600">{status.names.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
