import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GraduationCap, Code2, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#team') {
      const el = document.getElementById('team');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return (
    <div className="relative z-0 animate-in fade-in duration-700">

      {/* 1. HERO — Компактний і чистий */}
      <section className="py-20 md:py-28 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 shadow-sm rounded-full text-zinc-500 text-[10px] font-black uppercase tracking-widest">
          <GraduationCap size={14} className="text-zinc-900" /> {t('about.badge')}
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-tight">
          {t('about.title')} <br />
          <span className="text-zinc-400">{t('about.subtitle')}</span>
        </h1>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-zinc-500 font-medium text-lg leading-loose text-center">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* 2. STATS — "Скляний" блок, який виділяється на текстурному фоні */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-white/70 backdrop-blur-md border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[32px] py-10 px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatItem label={t('about.activeGalleries')} value="12+" />
            <StatItem label={t('about.artworks')} value="450+" />
            <StatItem label={t('about.students')} value="7" />
            <StatItem label={t('about.location')} value="Львів" />
          </div>
        </div>
      </section>

      {/* 3. TEAM SECTION */}
      <section id="team" className="py-20 bg-zinc-50 container mx-auto px-6 max-w-6xl rounded-[40px] mb-20">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('about.team')}</p>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tight">{t('about.teamTitle')}</h2>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest italic">
            {t('about.quote')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          <TeamMember initial="D" name={t('about.teamMembers.dmytro.name')} role={t('about.teamMembers.dmytro.role')} />
          <TeamMember initial="R" name={t('about.teamMembers.roman.name')} role={t('about.teamMembers.roman.role')} />
          <TeamMember initial="N" name={t('about.teamMembers.nazar.name')} role={t('about.teamMembers.nazar.role')} />
          <TeamMember initial="R" name={t('about.teamMembers.rostyslav.name')} role={t('about.teamMembers.rostyslav.role')} />
          <TeamMember initial="S" name={t('about.teamMembers.stanislav.name')} role={t('about.teamMembers.stanislav.role')} />
          <TeamMember initial="O" name={t('about.teamMembers.oleksandr.name')} role={t('about.teamMembers.oleksandr.role')} />
          <TeamMember initial="Y" name={t('about.teamMembers.yulia.name')} role={t('about.teamMembers.yulia.role')} />
          <TeamMember initial="M" name={t('about.teamMembers.mykhailo.name')} role={t('about.teamMembers.mykhailo.role')} />
          <TeamMember initial="D" name={t('about.teamMembers.danylo.name')} role={t('about.teamMembers.danylo.role')} />
        </div>
      </section>

      {/* 4. MISSION — Акцентний блок */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-zinc-900 rounded-[40px] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-6 relative z-10">
            <h2 className="text-3xl font-black uppercase">{t('about.ourMission')}</h2>
            <p className="text-zinc-400 text-base font-medium leading-relaxed">
              {t('about.missionText')}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-zinc-800 rounded-xl border border-zinc-700 text-[11px] font-bold flex items-center gap-2">
                <Code2 size={14} className="text-blue-400" /> React + Django
              </div>
              <div className="px-4 py-2 bg-zinc-800 rounded-xl border border-zinc-700 text-[11px] font-bold flex items-center gap-2">
                <MapPin size={14} className="text-red-400" /> Lviv, Ukraine
              </div>
            </div>
          </div>
          <div className="absolute right-[-5%] bottom-[-10%] opacity-10 rotate-12 hidden lg:block scale-110">
            <GraduationCap size={350} />
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- Компоненти --- */

const StatItem = ({ label, value }: any) => (
  <div className="text-center md:text-left space-y-1">
    <p className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</p>
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
  </div>
);

const TeamMember = ({ name, role, initial }: any) => (
  <div className="flex flex-col items-center text-center space-y-4 group cursor-default">
    <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-2xl font-black text-zinc-300 group-hover:bg-black group-hover:text-white transition-colors duration-500">
      {initial}
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-zinc-900 leading-tight">{name}</h3>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{role}</p>
    </div>
  </div>
);

export default AboutPage;