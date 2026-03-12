import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../components/HeaderAdmin';
import { useLogout } from '../../hooks/useAuth';
import { useVisitHistory } from '../../hooks/useVisits';
import { useAuthStore } from '../../stores/auth.store';

const MySwal = withReactContent(Swal);

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

    // Função para abrir detalhes da visita com SweetAlert2
    const handleViewDetails = (visit: any) => {
        MySwal.fire({
            title: <span className="text-check-green font-black italic uppercase tracking-tighter">{visit.customerName}</span>,
            html: (
                <div className="text-left space-y-4 mt-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Informações Gerais</p>
                        <p className="text-sm text-slate-200"><b>Vendedor:</b> {visit.sellerName}</p>
                        <p className="text-sm text-slate-200"><b>Status:</b> {visit.isOpen ? 'Em aberto' : 'Finalizada'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Check-in</p>
                            <p className="text-xs text-slate-300">{formatDate(visit.checkinTimestamp)}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Check-out</p>
                            <p className="text-xs text-slate-300">{formatDate(visit.checkoutTimestamp) || 'Pendente'}</p>
                        </div>
                    </div>

                    {visit.checkoutSummary && (
                        <div className="bg-check-green/10 p-4 rounded-2xl border border-check-green/20">
                            <p className="text-[10px] font-bold text-check-green uppercase mb-1">Relatório Completo</p>
                            <p className="text-sm text-slate-300 italic">"{visit.checkoutSummary}"</p>
                        </div>
                    )}
                </div>
            ),
            background: '#0f172a',
            showConfirmButton: true,
            confirmButtonText: 'Fechar',
            confirmButtonColor: '#84cc16',
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/10 shadow-2xl',
                confirmButton: 'rounded-xl font-black uppercase px-8'
            }
        });
    };

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
                                    onClick={() => handleViewDetails(visit)}
                                    className="bg-check-card border border-white/5 rounded-[2rem] p-6 hover:border-white/20 hover:bg-white/[0.03] cursor-pointer transition-all duration-300 shadow-xl group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-check-green font-black uppercase italic tracking-tighter text-xl leading-none mb-1 group-hover:text-lime-400 transition-colors">
                                                    {visit.customerName}
                                                </h3>
                                                <Eye size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Vendedor:</span>
                                                <span className="text-xs font-black text-slate-200 uppercase">{visit.sellerName}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                <span className={`w-2 h-2 rounded-full ${visit.isOpen ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-check-green'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                    {visit.isOpen ? 'Em aberto' : 'Encerrada'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-black/20 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <CheckCircle2 size={16} className="text-check-green" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">Check-in</p>
                                                <p className="text-slate-200 font-medium">{formatDate(visit.checkinTimestamp)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-400">
                                            <MapPin size={16} className="text-slate-500" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">Distância</p>
                                                <p className="text-slate-200 font-medium">{visit.checkinDistanceMeters.toFixed(1)}m do alvo</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginação */}
                        <div className="flex justify-center items-center gap-8 mt-16 mb-20">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 hover:bg-white/10 transition-all border border-white/5"
                            >
                                ← Anterior
                            </button>

                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Página</p>
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