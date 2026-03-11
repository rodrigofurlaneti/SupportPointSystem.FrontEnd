import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { LoginRequestSchema, type LoginRequest } from '../../schemas/auth.schema';
import { useLogin } from '../../hooks/useAuth';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import logoImg from '../../assets/logotipo.png';

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  const cpfValue = watch('cpf', '');

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setValue('cpf', formatted);
  };

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen bg-check-blue flex items-center justify-center p-4 text-white relative">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          {t('language')}:
        </span>
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
          className="bg-check-card border border-white/10 text-[10px] font-bold rounded-lg p-2 outline-none cursor-pointer uppercase"
        >
          <option value="pt">Português 🇧🇷</option>
          <option value="en">English 🇺🇸</option>
          <option value="es">Español 🇪🇸</option>
        </select>
      </div>

      <div className="w-full max-w-md bg-check-card p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center">
        <img src={logoImg} alt="Logo" className="w-44 mb-8" />
        <p className="text-slate-400 mb-8 text-sm">{t('login_subtitle')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <Input
            label={t('cpf')}
            placeholder="000.000.000-00"
            value={cpfValue}
            onChange={handleCpfChange}
            error={errors.cpf?.message}
          />
          <Input
            label={t('password')}
            isPassword
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={login.isPending}>
            {t('enter_system')}
          </Button>
        </form>

        <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          FSI Point System • 2026
        </p>
      </div>
    </div>
  );
}
