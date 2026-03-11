import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { useLogout } from '../../../hooks/useAuth';
import { useVisitHistory } from '../../../hooks/useVisits';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminVisitHistory() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVisitHistory(page);

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
            Histórico de Visitas
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-check-green" size={36} />
          </div>
        ) : !data?.items?.length ? (
          <div className="text-center py-20 text-slate-500 font-bold uppercase text-sm tracking-widest">
            Nenhuma visita encontrada.
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {data.items.map((visit) => (
                <div
                  key={visit.visitId}
                  className="bg-check-card border border-white/5 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          visit.isOpen ? 'bg-check-green' : 'bg-slate-500'
                        }`}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {visit.isOpen ? 'Em aberto' : 'Encerrada'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {visit.visitId.slice(0, 8)}...
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <CheckCircle2 size={12} className="text-check-green" />
                      <span>Check-in: {formatDate(visit.checkinTimestamp)}</span>
                    </div>
                    {visit.checkoutTimestamp && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} className="text-red-400" />
                        <span>Check-out: {formatDate(visit.checkoutTimestamp)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={12} />
                      <span>Distância: {visit.checkinDistanceMeters.toFixed(0)}m</span>
                    </div>
                    {visit.durationMinutes !== null && (
                      <div className="text-slate-400">
                        Duração: {visit.durationMinutes} min
                      </div>
                    )}
                  </div>

                  {visit.checkoutSummary && (
                    <p className="mt-3 text-xs text-slate-500 italic border-t border-white/5 pt-3">
                      "{visit.checkoutSummary}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 bg-white/5 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-white/10 transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-5 py-2 text-slate-400 text-sm">Página {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.items?.length || data.items.length < 20}
                className="px-5 py-2 bg-white/5 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-white/10 transition-colors"
              >
                Próxima →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
