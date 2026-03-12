import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useLogout } from '../../../hooks/useAuth';
import { useCreateSeller } from '../../../hooks/useSellers';
import { CreateSellerSchema, type CreateSeller } from '../../../schemas/seller.schema';
import { getApiErrorMessage } from '../../../components/ApiErrorHandler';

const MySwal = withReactContent(Swal);

function formatCpf(value: string): string {
    const d = value.replace(/\D/g, '').slice(0, 11);
    return d
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function AdminSellerCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logout = useLogout();
    const createSeller = useCreateSeller();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateSeller>({
        resolver: zodResolver(CreateSellerSchema),
    });

    const cpfValue = watch('cpf', '');

    const onSubmit = async (data: CreateSeller) => {
        try {
            await createSeller.mutateAsync({
                ...data,
                cpf: data.cpf.replace(/\D/g, ''),
            });

            // Alerta de sucesso personalizado
            await MySwal.fire({
                title: <span className="text-white text-2xl font-black uppercase italic">Vendedor Criado!</span>,
                html: (
                    <p className="text-slate-400">
                        O acesso de <b>{data.name}</b> foi gerado com sucesso no sistema.
                    </p>
                ),
                icon: 'success',
                background: '#0f172a', // check-card
                confirmButtonColor: '#84cc16', // check-green
                confirmButtonText: 'Continuar',
                iconColor: '#84cc16',
                customClass: {
                    popup: 'rounded-[2.5rem] border border-white/5 shadow-2xl',
                    confirmButton: 'rounded-xl px-10 font-bold uppercase tracking-tight',
                },
            });

            navigate('/admin/sellers/list');
        } catch (err: any) {
            toast.error(getApiErrorMessage(err));
        }
    };

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
                        {t('add_new')} Vendedor
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-check-card rounded-[2.5rem] p-8 border border-white/5 space-y-5 shadow-2xl"
                >
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
                        label="Senha *"
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
                    <Button type="submit" loading={createSeller.isPending}>
                        Salvar Vendedor
                    </Button>
                </form>
            </main>
        </div>
    );
}