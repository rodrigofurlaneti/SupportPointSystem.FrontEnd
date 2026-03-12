import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Landmark, MapPin, ChevronDown, PlusCircle, List, BarChart3, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../components/HeaderAdmin';
import { useLogout } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/auth.store';

const MySwal = withReactContent(Swal);

export default function AdminDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logout = useLogout();
    const userName = useAuthStore((s) => s.userName) ?? 'Administrador';
    const [openSection, setOpenSection] = useState<string | null>('sellers');

    // Efeito de Boas-vindas (Opcional, mas muito profissional)
    useEffect(() => {
        const hasWelcomed = sessionStorage.getItem('hasWelcomed');
        if (!hasWelcomed) {
            MySwal.fire({
                title: <span className="text-white text-2xl font-black italic uppercase">Bem-vindo, {userName}!</span>,
                text: 'O sistema de gestão FSI Point está pronto para uso.',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                background: '#0f172a',
                iconColor: '#84cc16',
                customClass: {
                    popup: 'rounded-[2.5rem] border border-white/5 shadow-2xl',
                }
            });
            sessionStorage.setItem('hasWelcomed', 'true');
        }
    }, [userName]);

    // Função de Logout com Confirmação SweetAlert2
    const handleLogoutClick = async () => {
        const result = await MySwal.fire({
            title: <span className="text-white font-black italic uppercase">Encerrar Sessão?</span>,
            text: 'Você precisará de login e senha para acessar novamente.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sair agora',
            cancelButtonText: 'Permanecer',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#1e293b',
            background: '#0f172a',
            iconColor: '#3b82f6',
            customClass: {
                popup: 'rounded-[2.5rem] border border-white/10 shadow-2xl',
                confirmButton: 'rounded-xl font-bold uppercase tracking-tight px-6',
                cancelButton: 'rounded-xl font-bold uppercase tracking-tight px-6'
            }
        });

        if (result.isConfirmed) {
            logout();
        }
    };

    const sections = [
        {
            id: 'sellers',
            title: t('manage_sellers'),
            icon: <Users size={28} />,
            color: 'text-check-green',
            actions: [
                { label: t('add_new'), icon: <PlusCircle size={20} />, path: '/admin/sellers/new' },
                { label: t('list_all'), icon: <List size={20} />, path: '/admin/sellers/list' },
                { label: t('performance'), icon: <BarChart3 size={20} />, path: '/admin/sellers/performance' },
            ],
        },
        {
            id: 'customers',
            title: t('manage_customers'),
            icon: <Landmark size={28} />,
            color: 'text-blue-400',
            actions: [
                { label: t('add_new'), icon: <PlusCircle size={20} />, path: '/admin/customers/new' },
                { label: t('list_all'), icon: <List size={20} />, path: '/admin/customers/list' },
                { label: t('view_map'), icon: <MapPin size={20} />, path: '/admin/customers/map' },
            ],
        },
        {
            id: 'visits',
            title: t('visit_history'),
            icon: <MapPin size={28} />,
            color: 'text-purple-400',
            actions: [
                { label: t('recent_checkins'), icon: <List size={20} />, path: '/admin/visits/history' },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            {/* Passei a função de logout customizada para o header se necessário */}
            <HeaderAdmin userName={userName} onLogout={handleLogoutClick} />

            <main className="p-6 pt-12 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
                        {t('admin_panel_title')}
                    </h2>
                    <div className="h-1.5 w-24 bg-check-green mx-auto rounded-full shadow-[0_0_15px_rgba(132,204,22,0.4)]" />
                </div>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-check-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                className="w-full p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors outline-none group"
                            >
                                <div className="flex items-center gap-6">
                                    <div
                                        className={`p-5 rounded-[1.5rem] bg-white/5 ${section.color} shadow-inner group-hover:scale-110 transition-transform`}
                                    >
                                        {section.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                                            {section.title}
                                        </h3>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                                            {t('available_actions')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`text-slate-600 transition-transform duration-500 ${openSection === section.id ? 'rotate-180' : ''
                                        }`}
                                    size={28}
                                />
                            </button>

                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${openSection === section.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-8 pb-10 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 mt-2">
                                    {section.actions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => action.path && navigate(action.path)}
                                            className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-check-green hover:text-check-blue transition-all duration-300 group/btn"
                                        >
                                            <div className="text-check-green group-hover/btn:text-check-blue transition-colors scale-125">
                                                {action.icon}
                                            </div>
                                            <span className="font-black text-[11px] uppercase tracking-widest text-center leading-tight">
                                                {action.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleLogoutClick}
                    className="w-full mt-12 flex items-center justify-center gap-3 p-6 bg-white/5 rounded-full border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase italic tracking-widest text-sm">Sair do Painel Admin</span>
                </button>

                <footer className="text-center mt-20 opacity-20">
                    <p className="text-[10px] font-bold uppercase tracking-[0.6em]">
                        FSI Point System • Management Suite 2026
                    </p>
                </footer>
            </main>
        </div>
    );
}