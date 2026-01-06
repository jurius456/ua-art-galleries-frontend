import { Users, Code2, GraduationCap, Heart, ExternalLink, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700">
      
      {/* 1. HERO SECTION (Чисто білий фон) */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            <GraduationCap size={14} /> Навчальний проєкт
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.9]">
            UA Galleries. <br />
            <span className="text-zinc-400">Цифрова еволюція <br /> мистецтва.</span>
          </h1>
          <p className="max-w-xl mx-auto text-zinc-500 font-medium text-lg leading-relaxed">
            Ми будуємо міст між класичними галереями України та сучасними технологіями, щоб зробити культуру доступною для кожного.
          </p>
        </div>
      </section>

      {/* 2. STATS TRAY (Контрастна секція на сірому фоні) */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <StatItem label="Активних галерей" value="12+" />
            <StatItem label="Завантажених робіт" value="450+" />
            <StatItem label="Студентів у команді" value="7" />
            <StatItem label="Локація проєкту" value="Львів" />
          </div>
        </div>
      </section>

      {/* 3. TEAM SECTION (Знову білий фон, але картки з глибокими тінями) */}
      <section className="py-24 container mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Наша команда</h2>
            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Студенти, що створюють майбутнє</p>
          </div>
          <p className="max-w-xs text-zinc-500 text-sm font-medium italic">
            «Цей проєкт — наш крок від теорії до реальної практики розробки».
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Кожна картка тепер має чітку тінь shadow-2xl */}
          <TeamMember 
            name="Студент Фронтенд" 
            role="Frontend Lead / PM" 
            bio="Відповідає за React-архітектуру та загальне управління проєктом."
            initial="R"
          />
          <TeamMember 
            name="Студен т Backend" 
            role="Backend Developer" 
            bio="Займається розробкою API на Django та логікою бази даних."
            initial="A"
          />
          <TeamMember 
            name="Студент QA" 
            role="DevOps / QA" 
            bio="Відповідає за стабільну роботу сервера та тестування функціоналу."
            initial="S"
          />
        </div>
      </section>

      {/* 4. MISSION BLOCK (Темний акцент для фінального розділення) */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-zinc-900 rounded-[48px] p-10 md:p-20 text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
          <div className="max-w-2xl space-y-8 relative z-10">
            <h2 className="text-4xl font-black tracking-tight uppercase">Наша місія</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              Ми навчаємося будувати складні системи, щоб дати українському мистецтву інструмент, який витримає будь-яке навантаження та час. Це не просто залік — це досвід.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-5 py-2.5 bg-zinc-800 rounded-2xl border border-zinc-700 text-sm font-bold flex items-center gap-2">
                <Code2 size={16} className="text-blue-400" /> React + Django
              </div>
              <div className="px-5 py-2.5 bg-zinc-800 rounded-2xl border border-zinc-700 text-sm font-bold flex items-center gap-2">
                <MapPin size={16} className="text-red-400" /> Lviv, Ukraine
              </div>
            </div>
          </div>
          {/* Декоративний символ на фоні */}
          <div className="absolute right-[-5%] bottom-[-10%] opacity-10 rotate-12 hidden lg:block">
            <GraduationCap size={400} />
          </div>
        </div>
      </section>

    </div>
  );
};

/* --- Допоміжні компоненти з покращеним об'ємом --- */

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</p>
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
  </div>
);

const TeamMember = ({ name, role, bio, initial }: { name: string; role: string; bio: string, initial: string }) => (
  <div className="group bg-white border border-zinc-100 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500">
    <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl mb-8 flex items-center justify-center text-xl font-bold group-hover:rotate-6 transition-transform">
      {initial}
    </div>
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-zinc-900 tracking-tight">{name}</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 underline underline-offset-4">{role}</p>
      </div>
      <p className="text-sm text-zinc-500 font-medium leading-relaxed">{bio}</p>
      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          Contact <ExternalLink size={12} />
        </button>
      </div>
    </div>
  </div>
);

export default AboutPage;