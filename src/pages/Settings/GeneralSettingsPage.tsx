import React, { useState } from 'react';
import { Globe, ChevronRight, Monitor, Moon, Sun, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const GeneralSettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [activePopup, setActivePopup] = useState<'language' | 'theme' | null>(null);

  const changeLanguage = (newLang: string) => {
    setActivePopup(null);
    if (i18n.language === newLang) return;
    
    // Smooth transition trick
    document.body.style.opacity = '0';
    setTimeout(() => {
      i18n.changeLanguage(newLang);
      document.body.style.opacity = '1';
    }, 300);
  };

  const getThemeText = (tTheme: string) => {
    switch (tTheme) {
      case 'light': return t('settings.light', 'Світла');
      case 'dark': return t('settings.dark', 'Темна');
      default: return t('settings.systemTheme', 'Системна');
    }
  }

  return (
    <div className="max-w-2xl animate-in fade-in duration-700">
      <div className="bg-white/90 backdrop-blur-2xl border border-zinc-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 space-y-10 relative">
        
        {/* Заголовок */}
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">{t('settings.system')}</p>
          <h2 className="text-xl font-bold text-black">{t('settings.general')}</h2>
        </section>

        {/* Списоком налаштувань */}
        <div className="space-y-2 relative">

          <SettingItem
            icon={<Globe size={18} />}
            label={t('settings.language')}
            value={i18n.language === 'uk' ? 'Українська' : 'English'}
            onClick={() => setActivePopup(activePopup === 'language' ? null : 'language')}
            isActive={activePopup === 'language'}
          />

          {activePopup === 'language' && (
            <div className="absolute top-16 right-0 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-20 animate-in slide-in-from-top-2">
              <button onClick={() => changeLanguage('uk')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <span className="text-sm font-bold text-zinc-800">Українська</span>
                {i18n.language === 'uk' && <Check size={16} className="text-zinc-900" />}
              </button>
              <button onClick={() => changeLanguage('en')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <span className="text-sm font-bold text-zinc-800">English</span>
                {i18n.language === 'en' && <Check size={16} className="text-zinc-900" />}
              </button>
            </div>
          )}

          <SettingItem
            icon={<Monitor size={18} />}
            label={t('settings.theme')}
            value={getThemeText(theme)}
            badge="BETA"
            onClick={() => setActivePopup(activePopup === 'theme' ? null : 'theme')}
            isActive={activePopup === 'theme'}
          />

          {activePopup === 'theme' && (
            <div className="absolute top-36 right-0 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-20 animate-in slide-in-from-top-2">
              <button onClick={() => {setTheme('light'); setActivePopup(null);}} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3"><Sun size={14} className="text-zinc-500" /><span className="text-sm font-bold text-zinc-800">{t('settings.light', 'Світла')}</span></div>
                {theme === 'light' && <Check size={16} className="text-zinc-900" />}
              </button>
              <button onClick={() => {setTheme('dark'); setActivePopup(null);}} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                 <div className="flex items-center gap-3"><Moon size={14} className="text-zinc-500" /><span className="text-sm font-bold text-zinc-800">{t('settings.dark', 'Темна')}</span></div>
                {theme === 'dark' && <Check size={16} className="text-zinc-900" />}
              </button>
              <button onClick={() => {setTheme('system'); setActivePopup(null);}} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                 <div className="flex items-center gap-3"><Monitor size={14} className="text-zinc-500" /><span className="text-sm font-bold text-zinc-800">{t('settings.systemTheme', 'Системна')}</span></div>
                {theme === 'system' && <Check size={16} className="text-zinc-900" />}
              </button>
            </div>
          )}

        </div>

        {/* Кнопка збереження */}
        <button className="w-full py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300">
          {t('settings.saveChanges')}
        </button>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, value, badge, onClick, isActive }: { icon: React.ReactNode, label: string, value: string, badge?: string, onClick?: () => void, isActive?: boolean }) => (
  <div className="w-full flex items-center justify-between p-4 rounded-2xl group">
    <div className="flex items-center gap-4">
      <div className="text-zinc-400 group-hover:text-black transition-colors">{icon}</div>
      <span className="text-sm font-bold text-black flex items-center gap-2">
        {label}
        {badge && <span className="bg-zinc-100 text-zinc-500 text-[8px] px-2 py-0.5 rounded-full font-black tracking-widest">{badge}</span>}
      </span>
    </div>
    {onClick ? (
      <button onClick={onClick} className={`flex items-center gap-2 hover:bg-zinc-100 p-2 -mr-2 rounded-xl transition-colors ${isActive ? 'bg-zinc-100' : ''}`}>
        <span className="text-xs font-semibold text-zinc-600">{value}</span>
        <ChevronRight size={14} className={`text-zinc-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
      </button>
    ) : (
      <div className="flex items-center gap-2 p-2 -mr-2">
        <span className="text-xs font-semibold text-zinc-400">{value}</span>
        <ChevronRight size={14} className="text-zinc-300" />
      </div>
    )}
  </div>
);

export default GeneralSettingsPage;