import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Componentes
import { Header } from '../../components/Header';
import { CustomerCard } from '../../components/CustomerCard';
import { MapModal } from '../../components/MapModal';
import { getApiErrorMessage } from '../../components/ApiErrorHandler';

// Stores e Hooks
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/useAuth';
import { useCustomers } from '../../hooks/useCustomers';
import { useCheckin, useCheckout } from '../../hooks/useVisits';
import { useGeoLocation } from '../../hooks/useGeoLocation';

// Tipos
import type { Customer } from '../../schemas/customer.schema';

const MySwal = withReactContent(Swal);

export default function SellerDashboard() {
    const { t } = useTranslation();
    const logout = useLogout();
    const userName = useAuthStore((s) => s.userName) ?? 'Vendedor';

    const { data: customers = [], isLoading } = useCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { coords, error: geoError } = useGeoLocation();

    const checkin = useCheckin();
    const checkout = useCheckout();

    /**
     * Registro de Chegada (Check-in) com SweetAlert2
     */
    const handleCheckIn = async (customer: Customer) => {
        const actualCustomerId = customer.id || (customer as any).customerId;

        if (!coords) {
            toast.error(geoError ?? 'GPS não disponível. Aguarde a localização.');
            return;
        }

        const result = await MySwal.fire({
            title: <span className="text-white text-2xl font-black italic uppercase">Registrar Chegada?</span>,
            html: <p className="text-slate-400">Confirmar visita em <b>{customer.companyName}</b>?</p>,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Check-in',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#84cc16',
            cancelButtonColor: '#1e293b',
            background: '#0f172a',
            iconColor: '#84cc16',
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/5 shadow-2xl',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            try {
                await checkin.mutateAsync({
                    customerId: actualCustomerId,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                toast.success(t('checkin_done') || 'Check-in realizado!');
            } catch (err: any) {
                toast.error(getApiErrorMessage(err));
            }
        }
    };

    /**
     * Registro de Saída (Check-out) com Input do SweetAlert2
     */
    const handleCheckOut = async (customer: Customer) => {
        const actualCustomerId = customer.id || (customer as any).customerId;

        if (!coords) {
            toast.error(geoError ?? 'GPS não disponível.');
            return;
        }

        // Usando o SweetAlert2 como um Prompt customizado
        const { value: summary, isConfirmed } = await MySwal.fire({
            title: <span className="text-white text-2xl font-black italic uppercase">Finalizar Visita</span>,
            input: 'textarea',
            inputLabel: `Resumo da visita em ${customer.companyName}:`,
            inputPlaceholder: 'O que foi conversado ou resolvido?',
            showCancelButton: true,
            confirmButtonText: 'Finalizar Check-out',
            cancelButtonText: 'Voltar',
            confirmButtonColor: '#3b82f6', // Azul para checkout
            background: '#0f172a',
            inputAttributes: {
                'aria-label': 'Resumo da visita',
                'className': 'bg-black/20 text-white rounded-xl border-white/10'
            },
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/5',
                input: 'text-sm text-slate-200 focus:border-check-green transition-all'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'O resumo é obrigatório para encerrar a visita!';
                }
            }
        });

        if (isConfirmed && summary) {
            try {
                await checkout.mutateAsync({
                    customerId: actualCustomerId,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    summary: summary.trim(),
                });
                toast.success(t('checkout_done') || 'Check-out realizado!');
            } catch (err: any) {
                toast.error(getApiErrorMessage(err));
            }
        }
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans pb-10">
            <Header userName={userName} onLogout={logout} />

            <main className="p-6 grid gap-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                        Seus Clientes
                    </h2>
                    {coords && (
                        <span className="text-[10px] font-bold text-check-green bg-check-green/10 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                            GPS Ativo
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-check-green" size={42} />
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            {t('syncing_customers')}
                        </p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="font-bold uppercase tracking-widest text-sm">
                            Nenhum cliente disponível.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {customers.map((customer) => (
                            <CustomerCard
                                key={customer.id || (customer as any).customerId}
                                customer={customer}
                                onSelect={setSelectedCustomer}
                                onCheckIn={handleCheckIn}
                                onCheckOut={handleCheckOut}
                            />
                        ))}
                    </div>
                )}
            </main>

            <MapModal
                customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />
        </div>
    );
}