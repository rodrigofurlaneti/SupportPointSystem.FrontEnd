import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
  children: ReactNode;
}

export function Button({
  loading,
  variant = 'primary',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-check-green hover:bg-lime-500 text-check-blue shadow-lg shadow-check-green/10',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className ?? ''}`}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
}
