import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl bg-white border border-brand-100 shadow-sm shadow-brand-100/40 p-5 sm:p-6 ${className}`}
      {...props}
    />
  );
}
