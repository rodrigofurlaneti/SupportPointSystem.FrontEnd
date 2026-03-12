import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
     * Registro de Chegada (Check-in)
     */
    const handleCheckIn = async (customer: Customer) => {
        // 1. Identifica o ID correto (tenta 'id' e depois 'customerId')
        const actualCustomerId = customer.id || (customer as any).customerId;

        console.log("ID do cliente capturado:", actualCustomerId);

        if (!actualCustomerId) {
            toast.error("Erro interno: ID do cliente não encontrado no objeto.");
            console.error("Objeto customer completo:", customer);
            return;
        }

        if (!coords) {
            toast.error(geoError ?? 'GPS não disponível. Aguarde a localização ser obtida.');
            return;
        }

        if (!window.confirm(`Deseja registrar chegada em: ${customer.companyName}?`)) return;

        try {
            // Enviamos com a chave 'customerId' (minúsculo) pois seu Swagger aceitou assim
            await checkin.mutateAsync({
                customerId: actualCustomerId,
                latitude: coords.latitude,
                longitude: coords.longitude,
            });

            toast.success(t('checkin_done') || 'Check-in realizado!');
        } catch (err: any) {
            console.error("Erro detalhado do 422:", err.response?.data);
            toast.error(getApiErrorMessage(err));
        }
    };

    /**
     * Registro de Saída (Check-out)
     */
    const handleCheckOut = async (customer: Customer) => {
        const actualCustomerId = customer.id || (customer as any).customerId;

        if (!coords) {
            toast.error(geoError ?? 'GPS não disponível.');
            return;
        }

        const summary = window.prompt(`Resumo da visita em ${customer.companyName}:`);
        if (summary === null) return;

        if (!summary.trim()) {
            toast.error(t('summary_required_error') || 'O resumo é obrigatório!');
            return;
        }

        try {
            await checkout.mutateAsync({
                customerId: actualCustomerId,
                latitude: coords.latitude,
                longitude: coords.longitude,
                summary: summary.trim(),
            });
            toast.success(t('checkout_done') || 'Check-out realizado!');
        } catch (err: any) {
            console.error("Erro Check-out (422?):", err.response?.data);
            toast.error(getApiErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans pb-10">
            <Header userName={userName} onLogout={logout} />

            <main className="p-6 grid gap-6">
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