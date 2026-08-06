import { lodgingOptions } from '@/lib/options';
import type { LodgingOption } from '@/types';

interface Props {
  value: LodgingOption;
  onChange: (value: LodgingOption) => void;
}

export function LodgingToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {lodgingOptions.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors ${
            value === option
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-gray-200 bg-white text-gray-500 hover:border-brand-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
