import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { lodgingOptions } from '@/lib/options';
import type { LodgingOption } from '@/types';

interface Props {
  value: LodgingOption;
  onChange: (value: LodgingOption) => void;
}

export function LodgingToggle({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">
        상황에 따라 원하는 방이 배정되지 않을 수도 있습니다.
      </p>
      <ToggleButtonGroup options={lodgingOptions} value={value} onChange={onChange} columnsClassName="grid-cols-3" />
    </div>
  );
}
