import React, { useState } from 'react';
import { Globe, Bell, ChevronRight, Monitor } from "lucide-react";

const GeneralSettingsPage = () => {
  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Скляна картка, як у ChangePassword */}
      <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 space-y-10">
        
        {/* Заголовок */}
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Система</p>
          <h2 className="text-xl font-bold text-black">Загальні налаштування</h2>
        </section>

        {/* Списоком налаштувань */}
        <div className="space-y-2">
          
          <SettingItem 
            icon={<Globe size={18} />} 
            label="Мова інтерфейсу" 
            value="Українська" 
          />
          
          <SettingItem 
            icon={<Monitor size={18} />} 
            label="Тема оформлення" 
            value="Системна" 
          />

          <div className="pt-4 mt-4 border-t border-gray-100">
            <ToggleItem 
              icon={<Bell size={18} />} 
              label="Сповіщення про події" 
              description="Отримувати пуш-повідомлення про нові виставки"
              initialState={true}
            />
          </div>

        </div>

        {/* Кнопка збереження */}
        <button className="w-full py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300">
          Зберегти зміни
        </button>
      </div>
    </div>
  );
};

/* Рядок налаштування з вибором */
const SettingItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
    <div className="flex items-center gap-4">
      <div className="text-zinc-400 group-hover:text-black transition-colors">{icon}</div>
      <span className="text-sm font-bold text-black">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-zinc-400">{value}</span>
      <ChevronRight size={14} className="text-zinc-300" />
    </div>
  </button>
);

/* Рядок з перемикачем (Toggle) */
const ToggleItem = ({ icon, label, description, initialState }: any) => {
  const [enabled, setEnabled] = useState(initialState);
  
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="text-zinc-400">{icon}</div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-black">{label}</p>
          <p className="text-[10px] text-zinc-400 font-medium">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`w-10 h-6 rounded-full transition-all relative ${enabled ? 'bg-black' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );
};

export default GeneralSettingsPage;