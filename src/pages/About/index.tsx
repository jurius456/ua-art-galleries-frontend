import { GraduationCap, Code2, MapPin, ExternalLink } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="relative z-0 animate-in fade-in duration-700">
      
      {/* 1. HERO — Компактний і чистий */}
      <section className="py-20 md:py-28 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 shadow-sm rounded-full text-zinc-500 text-[10px] font-black uppercase tracking-widest">
          <GraduationCap size={14} className="text-zinc-900" /> Навчальний проєкт
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-tight">
          UA Galleries. <br />
          <span className="text-zinc-400">Цифрова еволюція мистецтва.</span>
        </h1>
        <p className="max-w-xl mx-auto text-zinc-500 font-medium text-base leading-relaxed px-6">
          Ми будуємо міст між класичними галереями України та сучасними технологіями, щоб зробити культуру доступною для кожного.
        </p>
      </section>

      {/* 2. STATS — "Скляний" блок, який виділяється на текстурному фоні */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-white/70 backdrop-blur-md border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[32px] py-10 px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatItem label="Активних галерей" value="12+" />
            <StatItem label="Завантажених робіт" value="450+" />
            <StatItem label="Студентів" value="7" />
            <StatItem label="Локація" value="Львів" />
          </div>
        </div>
      </section>

      {/* 3. TEAM SECTION — Прозорі картки */}
      <section className="container mx-auto px-6 py-12 space-y-12">
        <div className="flex justify-between items-end border-b border-zinc-200 pb-8">
           <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Наша команда</h2>
           <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest hidden md:block italic">
             «Від теорії до реальної практики»
           </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <TeamMember initial="R" name="Роман Масляна" role="Frontend Lead / PM" bio="Архітектура React та управління проєктом." />
          <TeamMember initial="A" name="Андрійович" role="Backend Lead" bio="Розробка API на Django та логіка баз даних." />
          <TeamMember initial="S" name="Студент QA" role="QA Engineer" bio="Тестування та стабільність системи." />
        </div>
      </section>

      {/* 4. MISSION — Акцентний блок */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-zinc-900 rounded-[40px] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-6 relative z-10">
            <h2 className="text-3xl font-black uppercase">Наша місія</h2>
            <p className="text-zinc-400 text-base font-medium leading-relaxed">
              Ми навчаємося будувати складні системи, щоб дати українському мистецтву інструмент майбутнього.
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