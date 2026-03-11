import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isPassword?: boolean;
  error?: string;
}

export function Input({ label, isPassword, error, className, ...props }: InputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : props.type ?? 'text'}
          className={`w-full bg-white/5 border ${
            error ? 'border-red-500' : 'border-white/10'
          } rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-check-green focus:ring-1 focus:ring-check-green transition-colors ${
            isPassword ? 'pr-12' : ''
          } ${className ?? ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
    </div>
  );
}
