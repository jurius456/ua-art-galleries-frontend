import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GraduationCap, ExternalLink } from "lucide-react";
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
      <section id="team" className="py-32 scroll-mt-32 bg-zinc-50 container mx-auto px-6 max-w-6xl rounded-[40px] mb-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900">
            {t('about.teamTitle')}
          </h2>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest italic">
            - {t('about.quote')} -
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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

      {/* 4. MISSION SECTION */}
      <section className="py-20 container mx-auto px-6 max-w-4xl text-center">
        <div className="w-16 h-1 bg-zinc-200 mx-auto mb-12 rounded-full" />
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">{t('about.missionTitle')}</h2>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium">
          {t('about.mission')}
        </p>
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

const TeamMember = ({ name, role, bio, initial }: any) => (
  <div className="bg-white/40 backdrop-blur-sm border border-white/60 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:bg-white transition-all duration-500 group">
    <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl mb-6 flex items-center justify-center font-bold group-hover:rotate-6 transition-transform shadow-lg shadow-zinc-200">
      {initial}
    </div>
    <div className="space-y-1 mb-4">
      <h3 className="font-black text-zinc-900 tracking-tight">{name}</h3>
      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{role}</p>
    </div>
    <p className="text-xs text-zinc-500 leading-relaxed mb-6">{bio}</p>
    <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      Contact <ExternalLink size={12} />
    </button>
  </div>
);

export default AboutPage;