import React from 'react';
import { Target, Users, Map, Mail, Handshake } from 'lucide-react';

const HomeAbout = () => {
  return (
    <section className="space-y-10 pb-20">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Контекст</p>
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Про проєкт</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">
        
        {/* Головна картка - Місія (6 колонок) */}
        <div className="md:col-span-6 bg-zinc-900 rounded-[32px] p-10 flex flex-col justify-between text-white relative overflow-hidden group shadow-xl">
          <Target className="text-blue-500 mb-8" size={40} strokeWidth={1.5} />
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black uppercase tracking-tight">Наша Місія</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Ми створюємо цифрову екосистему для українського мистецтва, де кожна галерея знаходить свій голос, а кожен поціновувач — свою картину.
            </p>
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Target size={300} />
          </div>
        </div>

        {/* Права сітка (6 колонок) */}
        <div className="md:col-span-6 grid grid-cols-2 gap-6">
          <BentoTile icon={<Users className="text-orange-500" />} label="Команда" />
          <BentoTile icon={<Map className="text-green-500" />} label="Дорожня карта" />
          <BentoTile icon={<Mail className="text-purple-500" />} label="Контакти" />
          <BentoTile icon={<Handshake className="text-blue-400" />} label="Партнери" />
        </div>
      </div>
    </section>
  );
};

const BentoTile = ({ icon, label }: any) => (
  <div className="bg-white border border-zinc-100 rounded-[32px] p-6 flex flex-col justify-between hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-100 transition-all cursor-pointer group">
    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-sm font-black uppercase tracking-widest text-zinc-900">{label}</span>
  </div>
);

export default HomeAbout;