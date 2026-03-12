import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Header } from '../../components/Header';
import { CustomerCard } from '../../components/CustomerCard';
import { MapModal } from '../../components/MapModal';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/useAuth';
import { useCustomers } from '../../hooks/useCustomers';
import { useCheckin, useCheckout } from '../../hooks/useVisits';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import { getApiErrorMessage } from '../../components/ApiErrorHandler';
import type { Customer } from '../../schemas/customer.schema';

export default function SellerDashboard() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { role } = useAuthStore();
  //const sellerName = useAuthStore((s) => s.userId) ?? 'Vendedor';
  const userName = useAuthStore((s) => s.userName) ?? 'Vendedor';

  const { data: customers = [], isLoading } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { coords, error: geoError } = useGeoLocation();
  const checkin = useCheckin();
  const checkout = useCheckout();

  const handleCheckIn = async (customer: Customer) => {
    if (!coords) {
      toast.error(geoError ?? 'GPS não disponível. Aguarde a localização ser obtida.');
      return;
    }

    const confirmed = window.confirm(
      `Deseja registrar chegada em: ${customer.companyName}?`
    );
    if (!confirmed) return;

    try {
      await checkin.mutateAsync({
        customerId: customer.id,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      toast.success(t('checkin_done'));
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleCheckOut = async (customer: Customer) => {
    if (!coords) {
      toast.error(geoError ?? 'GPS não disponível.');
      return;
    }

    const summary = window.prompt(`Resumo da visita em ${customer.companyName}:`);
    if (summary === null) return;
    if (!summary.trim()) {
      toast.error(t('summary_required_error') ?? 'O resumo é obrigatório!');
      return;
    }

    try {
      await checkout.mutateAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
        summary,
      });
      toast.success(t('checkout_done'));
    } catch (err: any) {
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
            <p className="font-bold uppercase tracking-widest text-sm">Nenhum cliente disponível.</p>
          </div>
        ) : (
          customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onSelect={setSelectedCustomer}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          ))
        )}
      </main>

      <MapModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}
