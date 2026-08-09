import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'md' | 'lg' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-autumn-500 text-white hover:bg-autumn-600 active:bg-autumn-700 disabled:bg-gray-200 disabled:text-gray-400',
  secondary:
    'bg-mint-100 text-mint-800 hover:bg-mint-200 active:bg-mint-300 disabled:bg-gray-100 disabled:text-gray-400',
  outline:
    'bg-white text-brand-600 border border-brand-300 hover:bg-brand-50 disabled:text-gray-300 disabled:border-gray-200',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50 disabled:text-gray-300',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 disabled:bg-gray-200 disabled:text-gray-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-6 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
