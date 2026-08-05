import type { HTMLAttributes } from 'react';

type Tone = 'brand' | 'mint' | 'gray' | 'amber' | 'rose';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-700',
  mint: 'bg-mint-100 text-mint-700',
  gray: 'bg-gray-100 text-gray-600',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
};

export function Badge({
  tone = 'brand',
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
