import type { StatItem } from '@/lib/participantStats';

export function BarChart({ items }: { items: StatItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-bold" style={{ color: item.color }}>
              {item.value}명
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
