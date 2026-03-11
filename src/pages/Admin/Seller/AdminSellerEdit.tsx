import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useLogout } from '../../../hooks/useAuth';
import { useSellerById, useUpdateSeller } from '../../../hooks/useSellers';
import { CreateSellerSchema, type CreateSeller } from '../../../schemas/seller.schema';
import { getApiErrorMessage } from '../../../components/ApiErrorHandler';

function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function AdminSellerEdit() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: seller, isLoading } = useSellerById(id!);
  const updateSeller = useUpdateSeller();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateSeller>({
    resolver: zodResolver(CreateSellerSchema.partial().required({ name: true, cpf: true, password: true })),
  });

  const cpfValue = watch('cpf', '');

  useEffect(() => {
    if (seller) {
      reset({
        name: seller.name,
        cpf: formatCpf(seller.cpf),
        email: seller.email ?? '',
        phone: seller.phone ?? '',
        password: '',
      });
    }
  }, [seller, reset]);

  const onSubmit = async (data: CreateSeller) => {
    try {
      await updateSeller.mutateAsync({ id: id!, data: { ...data, cpf: data.cpf.replace(/\D/g, '') } });
      toast.success('Vendedor atualizado com sucesso!');
      navigate('/admin/sellers/list');
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-check-blue flex items-center justify-center">
        <Loader2 className="animate-spin text-check-green" size={42} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-check-blue text-white font-sans">
      <HeaderAdmin userName="Admin" onLogout={logout} />

      <main className="p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/sellers/list')}
            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            Editar Vendedor
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-check-card rounded-[2.5rem] p-8 border border-white/5 space-y-5">
          <Input
            label="Nome Completo *"
            placeholder="Nome do vendedor"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="CPF *"
            placeholder="000.000.000-00"
            value={cpfValue}
            onChange={(e) => setValue('cpf', formatCpf(e.target.value))}
            error={errors.cpf?.message}
          />
          <Input
            label="Nova Senha (deixe vazio para manter)"
            isPassword
            placeholder="Mínimo 8 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@empresa.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            placeholder="11999999999"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Button type="submit" loading={updateSeller.isPending}>
            Atualizar Vendedor
          </Button>
        </form>
      </main>
    </div>
  );
}
