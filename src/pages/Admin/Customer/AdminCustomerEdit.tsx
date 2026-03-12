import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useLogout } from '../../../hooks/useAuth';
import { useCustomerById, useUpsertCustomer } from '../../../hooks/useCustomers';
import { UpsertCustomerSchema, type UpsertCustomer } from '../../../schemas/customer.schema';
import { getApiErrorMessage } from '../../../components/ApiErrorHandler';

const MySwal = withReactContent(Swal);

function formatCnpj(value: string): string {
    if (!value) return '';
    const d = value.replace(/\D/g, '').slice(0, 14);
    return d
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export default function AdminCustomerEdit() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const logout = useLogout();

    const { data: customer, isLoading } = useCustomerById(id!);
    const upsertCustomer = useUpsertCustomer();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UpsertCustomer>({
        resolver: zodResolver(UpsertCustomerSchema),
    });

    const cnpjValue = watch('cnpj', '');

    useEffect(() => {
        if (customer) {
            reset({
                companyName: customer.companyName,
                cnpj: formatCnpj(customer.cnpj),
                latitude: customer.latitude,
                longitude: customer.longitude,
            });
        }
    }, [customer, reset]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocalização não suportada.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue('latitude', pos.coords.latitude);
                setValue('longitude', pos.coords.longitude);
                toast.success('Coordenadas atualizadas com sucesso!');
            },
            () => {
                MySwal.fire({
                    title: <span className="text-white">Erro de GPS</span>,
                    text: 'Certifique-se de que as permissões de localização estão ativas.',
                    icon: 'error',
                    background: '#0f172a',
                    confirmButtonColor: '#ef4444',
                    customClass: { popup: 'rounded-[2rem] border border-white/10' }
                });
            }
        );
    };

    const onSubmit = async (data: UpsertCustomer) => {
        try {
            await upsertCustomer.mutateAsync({ ...data, cnpj: data.cnpj.replace(/\D/g, '') });

            await MySwal.fire({
                title: <span className="text-white text-2xl font-black uppercase italic">Cliente Atualizado!</span>,
                html: <p className="text-slate-400">Os dados de <b>{data.companyName}</b> foram alterados com sucesso.</p>,
                icon: 'success',
                background: '#0f172a',
                confirmButtonColor: '#84cc16',
                confirmButtonText: 'Concluir',
                iconColor: '#84cc16',
                customClass: {
                    popup: 'rounded-[2.5rem] border border-white/5 shadow-2xl',
                    confirmButton: 'rounded-xl px-10 font-bold uppercase'
                }
            });

            navigate('/admin/customers/list');
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
                        onClick={() => navigate('/admin/customers/list')}
                        className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                        Editar Cliente
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-check-card rounded-[2.5rem] p-8 border border-white/5 space-y-5 shadow-2xl">
                    <Input
                        label="Razão Social *"
                        placeholder="Nome da empresa"
                        error={errors.companyName?.message}
                        {...register('companyName')}
                    />
                    <Input
                        label="CNPJ *"
                        placeholder="00.000.000/0000-00"
                        value={cnpjValue}
                        onChange={(e) => setValue('cnpj', formatCnpj(e.target.value))}
                        error={errors.cnpj?.message}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Latitude *"
                            type="number"
                            step="any"
                            error={errors.latitude?.message}
                            {...register('latitude', { valueAsNumber: true })}
                        />
                        <Input
                            label="Longitude *"
                            type="number"
                            step="any"
                            error={errors.longitude?.message}
                            {...register('longitude', { valueAsNumber: true })}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGetLocation}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-check-green transition-all flex items-center justify-center gap-2"
                    >
                        📍 Atualizar Localização via GPS
                    </button>

                    <Button type="submit" loading={upsertCustomer.isPending}>
                        Atualizar Cliente
                    </Button>
                </form>
            </main>
        </div>
    );
}