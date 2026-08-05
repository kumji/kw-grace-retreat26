import { Label, Input, Select } from '@/components/ui/Field';
import { lodgingOptions } from '@/lib/options';
import type { FamilyChild } from '@/types';

interface Props {
  index: number;
  value: FamilyChild;
  onChange: (value: FamilyChild) => void;
  onRemove: () => void;
}

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
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>이름</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div>
          <Label>만 나이</Label>
          <Input
            type="number"
            placeholder="0"
            value={value.age === 0 ? "" : value.age}
            onChange={(e) => onChange({ ...value, age: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>숙박 여부</Label>
          <Select
            value={value.lodging}
            onChange={(e) => onChange({ ...value, lodging: e.target.value as FamilyChild['lodging'] })}
          >
            {lodgingOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
