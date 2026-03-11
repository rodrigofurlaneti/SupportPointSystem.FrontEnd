import { Shield, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logotipo.png';

interface HeaderAdminProps {
  userName: string;
  onLogout: () => void;
}

export function HeaderAdmin({ userName, onLogout }: HeaderAdminProps) {
  const { i18n } = useTranslation();

  return (
    <header className="bg-check-card/80 backdrop-blur-md p-6 rounded-b-[2.5rem] shadow-2xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <img src={logoImg} alt="FSI Logo" className="h-10" />
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
            <Shield size={10} className="text-check-green" /> Admin
          </p>
          <h2 className="text-lg font-black tracking-tighter italic leading-none">{userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
          className="bg-check-card border border-white/10 text-[10px] font-bold rounded-lg p-2 outline-none cursor-pointer uppercase text-white"
        >
          <option value="pt">🇧🇷 PT</option>
          <option value="en">🇺🇸 EN</option>
          <option value="es">🇪🇸 ES</option>
        </select>

        <button
          onClick={onLogout}
          className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
