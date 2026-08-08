interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  columnsClassName?: string;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  columnsClassName = 'grid-cols-3',
}: Props<T>) {
  return (
    <div className={`grid gap-2 ${columnsClassName}`}>
      {options.map((option) => (
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
