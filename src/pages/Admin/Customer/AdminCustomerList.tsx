import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, PlusCircle, Search, Loader2, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { useLogout } from '../../../hooks/useAuth';
import { useCustomers, useDeleteCustomer } from '../../../hooks/useCustomers';
import { getApiErrorMessage } from '../../../components/ApiErrorHandler';

const MySwal = withReactContent(Swal);

export default function AdminCustomerList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logout = useLogout();
    const { data: customers = [], isLoading } = useCustomers();
    const deleteCustomer = useDeleteCustomer();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = customers.filter(
        (c) =>
            c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.cnpj?.includes(searchTerm)
    );

    const handleDelete = async (id: string, name: string) => {
        // Alerta de confirmação estilizado
        const result = await MySwal.fire({
            title: <span className="text-white text-2xl font-black italic">Remover Cliente?</span>,
            html: (
                <p className="text-slate-400">
                    Deseja remover permanentemente <b>{name}</b>?<br />
                    Esta ação não poderá ser desfeita.
                </p>
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#84cc16', // check-green
            cancelButtonColor: '#ef4444', // red-500
            background: '#0f172a', // check-card
            iconColor: '#84cc16',
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/5 shadow-2xl',
                confirmButton: 'rounded-xl font-bold uppercase tracking-tight px-6',
                cancelButton: 'rounded-xl font-bold uppercase tracking-tight px-6'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteCustomer.mutateAsync(id);
                toast.success('Cliente removido com sucesso!');
            } catch (err: any) {
                toast.error(getApiErrorMessage(err));
            }
        }
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="Admin" onLogout={logout} />

            <main className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                        {t('manage_customers')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por razão social ou CNPJ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-check-card border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-check-green transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/admin/customers/new')}
                        className="flex items-center gap-2 bg-check-green text-check-blue font-black text-sm px-6 py-3 rounded-2xl hover:bg-lime-500 transition-colors"
                    >
                        <PlusCircle size={18} /> {t('add_new')}
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-check-green" size={36} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase text-sm tracking-widest">
                        Nenhum cliente encontrado.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((customer) => (
                            <div
                                key={customer.id}
                                className="bg-check-card border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-base uppercase tracking-tight">
                                            {customer.companyName}
                                        </h3>
                                        <p className="text-slate-400 text-xs mt-0.5">{customer.cnpj}</p>
                                        {customer.address && (
                                            <p className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5 uppercase font-bold">
                                                <MapPin size={10} className="text-check-green" />
                                                {customer.address.city} - {customer.address.state}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
                                        className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-check-green transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer.id, customer.companyName)}
                                        className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}