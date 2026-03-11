import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, UserPlus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { useLogout } from '../../../hooks/useAuth';
import { useSellers, useDeleteSeller } from '../../../hooks/useSellers';
import { getApiErrorMessage } from '../../../components/ApiErrorHandler';

export default function AdminSellerList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: sellers = [], isLoading } = useSellers();
  const deleteSeller = useDeleteSeller();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = sellers.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cpf?.includes(searchTerm) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`${t('delete_confirm_msg') || 'Deseja excluir o vendedor'}: ${name}?`)) return;
    try {
      await deleteSeller.mutateAsync(id);
      toast.success(t('deleted_success') || 'Excluído com sucesso!');
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
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
            {t('manage_sellers')}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-check-card border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-check-green transition-colors"
            />
          </div>
          <button
            onClick={() => navigate('/admin/sellers/new')}
            className="flex items-center gap-2 bg-check-green text-check-blue font-black text-sm px-6 py-3 rounded-2xl hover:bg-lime-500 transition-colors"
          >
            <UserPlus size={18} /> {t('add_new')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-check-green" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-bold uppercase text-sm tracking-widest">
            Nenhum vendedor encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((seller) => (
              <div
                key={seller.id}
                className="bg-check-card border border-white/5 rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight">{seller.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{seller.cpf}</p>
                  {seller.email && <p className="text-slate-500 text-xs">{seller.email}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                      seller.active
                        ? 'bg-check-green/20 text-check-green'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {seller.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/sellers/edit/${seller.id}`)}
                    className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-check-green transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id, seller.name)}
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
