import { Label, Input } from '@/components/ui/Field';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { schoolStatusOptions } from '@/lib/options';
import type { FamilyChild } from '@/types';

interface Props {
  index: number;
  value: FamilyChild;
  onChange: (value: FamilyChild) => void;
  onRemove: () => void;
}

const SCHOOL_AGE_THRESHOLD = 7;

export function FamilyChildCard({ index, value, onChange, onRemove }: Props) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-brand-800">자녀 {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-gray-400 hover:text-rose-500"
        >
          삭제
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <Label>이름</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>만 나이</Label>
            <Input
              type="number"
              placeholder="0"
              value={value.age === 0 ? "" : value.age}
              onChange={(e) => {
                const age = Number(e.target.value);
                onChange({
                  ...value,
                  age,
                  schoolStatus: age >= SCHOOL_AGE_THRESHOLD ? '취학' : '미취학',
                });
              }}
            />
          </div>
          <div>
            <Label>취학 여부</Label>
            <ToggleButtonGroup
              options={schoolStatusOptions}
              value={value.schoolStatus}
              onChange={(schoolStatus) => onChange({ ...value, schoolStatus })}
              columnsClassName="grid-cols-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
