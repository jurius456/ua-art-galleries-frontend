import { LogOut, ShieldCheck, User, Mail, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initial = (user.first_name || user.username || "U")[0].toUpperCase();

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Головна скляна картка */}
      <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 space-y-10">
        
        {/* Секція Аватара та Заголовка — зробили шрифт м'якшим */}
        <section className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-50">
          <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
            {initial}
          </div>
          <div className="text-center md:text-left space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Особистий профіль</p>
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center justify-center md:justify-start gap-2 tracking-tight">
              {user.first_name} {user.last_name}
              {user.is_active && <ShieldCheck size={20} className="text-blue-500/80" />}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-zinc-400 text-sm font-medium">
              <AtSign size={13} strokeWidth={2.5} />
              <span>{user.username}</span>
            </div>
          </div>
        </section>

        {/* Дані профілю — зменшили жирність значень */}
        <section className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          <InfoField 
            label="Електронна пошта" 
            value={user.email || "—"} 
            icon={<Mail size={14} />} 
          />
          <InfoField 
            label="Ім'я" 
            value={user.first_name || "—"} 
            icon={<User size={14} />} 
          />
          <InfoField 
            label="Прізвище" 
            value={user.last_name || "—"} 
            icon={<User size={14} />} 
          />
          <InfoField 
            label="Статус акаунта" 
            value={user.is_active ? "Активний" : "Неактивний"} 
            icon={<ShieldCheck size={14} />} 
            isStatus
          />
        </section>

        {/* Підвал картки */}
        <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-zinc-400">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-50">
            ID: {user.id}
          </p>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="group flex items-center gap-2 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            <LogOut size={14} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            Вийти з профілю
          </button>
        </div>
      </div>
    </div>
  );
};

/* Оновлений компонент для поля інформації */
const InfoField = ({ label, value, icon, isStatus = false }: any) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-colors group-hover:text-zinc-600">
      <span className="opacity-70">{icon}</span>
      {label}
    </div>
    <div className="relative">
      <p className={`text-base font-semibold border-b border-gray-100 pb-2 tracking-tight transition-colors group-hover:border-zinc-200 ${
        isStatus && value === "Активний" ? "text-blue-500" : "text-zinc-800"
      }`}>
        {value}
      </p>
    </div>
  </div>
);

export default ProfilePage;