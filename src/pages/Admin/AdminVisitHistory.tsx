import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { HeaderAdmin } from '../../components/HeaderAdmin';
import { useLogout } from '../../hooks/useAuth';
import { useVisitHistory } from '../../hooks/useVisits';
import { useAuthStore } from '../../stores/auth.store';

function formatDate(iso: string): string {
    if (!iso) return '-';
    try {
        return new Date(iso).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch { return '-'; }
}

export default function AdminVisitHistory() {
    const navigate = useNavigate();
    const logout = useLogout();
    const userName = useAuthStore((s) => s.userName) ?? 'Administrador';
    const [page, setPage] = useState(1);

    const { data, isLoading } = useVisitHistory(page);

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName={userName} onLogout={logout} />

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
                ) : !data || data.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase text-sm tracking-widest">
                        Nenhuma visita encontrada.
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {data.map((visit) => (
                                <div
                                    key={visit.visitId}
                                    className="bg-check-card border border-white/5 rounded-[2rem] p-6 hover:border-white/20 transition-all duration-300 shadow-xl"
                                >
                                    {/* Cabeçalho do Card */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-check-green font-black uppercase italic tracking-tighter text-xl leading-none mb-1">
                                                {visit.customerName}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Vendedor:</span>
                                                <span className="text-xs font-black text-slate-200 uppercase">{visit.sellerName}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5`}>
                                                <span className={`w-2 h-2 rounded-full ${visit.isOpen ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-check-green'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                    {visit.isOpen ? 'Em aberto' : 'Encerrada'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-600 font-mono bg-black/20 px-2 py-1 rounded">
                                                #{visit.visitId.slice(0, 8)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Grid de Métricas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <CheckCircle2 size={16} className="text-check-green" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">Entrada</p>
                                                <p className="text-slate-200 font-medium">{formatDate(visit.checkinTimestamp)}</p>
                                            </div>
                                        </div>

                                        {visit.checkoutTimestamp && (
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Clock size={16} className="text-blue-400" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-600 uppercase">Saída</p>
                                                    <p className="text-slate-200 font-medium">{formatDate(visit.checkoutTimestamp)}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-slate-400">
                                            <MapPin size={16} className="text-slate-500" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">Precisão GPS</p>
                                                <p className="text-slate-200 font-medium">{visit.checkinDistanceMeters.toFixed(1)}m de distância</p>
                                            </div>
                                        </div>

                                        {visit.durationMinutes !== null && (
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Clock size={16} className="text-slate-500" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-600 uppercase">Permanência</p>
                                                    <p className="text-slate-200 font-medium">{visit.durationMinutes} minutos</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Resumo/Observações */}
                                    {visit.checkoutSummary && (
                                        <div className="mt-4 p-4 bg-check-green/5 rounded-xl border-l-4 border-check-green">
                                            <p className="text-[9px] font-black text-check-green uppercase mb-1 tracking-widest">Relatório da Visita</p>
                                            <p className="text-sm text-slate-300 italic leading-relaxed">
                                                "{visit.checkoutSummary}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Paginação Estilizada */}
                        <div className="flex justify-center items-center gap-8 mt-16 mb-20">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:bg-white/10 transition-all border border-white/5"
                            >
                                ← Voltar
                            </button>

                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Página Atual</p>
                                <p className="text-check-green text-xl font-black">{page}</p>
                            </div>

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={data.length < 20}
                                className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:bg-white/10 transition-all border border-white/5"
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