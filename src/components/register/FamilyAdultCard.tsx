import { Label, Input, Select } from '@/components/ui/Field';
import { birthMonthOptions, bloodTypeOptions, lodgingOptions } from '@/lib/options';
import type { FamilyAdult } from '@/types';

interface Props {
  index: number;
  value: FamilyAdult;
  onChange: (value: FamilyAdult) => void;
  onRemove: () => void;
}

export function FamilyAdultCard({ index, value, onChange, onRemove }: Props) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-mint-100 bg-mint-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-mint-800">성인 {index + 1}</span>
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
          <Label>생년월</Label>
          <Select
            value={value.birthMonth}
            onChange={(e) => onChange({ ...value, birthMonth: Number(e.target.value) })}
          >
            {birthMonthOptions.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>혈액형</Label>
          <Select
            value={value.bloodType}
            onChange={(e) => onChange({ ...value, bloodType: e.target.value as FamilyAdult['bloodType'] })}
          >
            {bloodTypeOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-2">
          <Label>숙박 여부</Label>
          <Select
            value={value.lodging}
            onChange={(e) => onChange({ ...value, lodging: e.target.value as FamilyAdult['lodging'] })}
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
