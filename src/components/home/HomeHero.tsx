import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const SLIDES = [
  { id: 1, title: 'Відкрийте нове мистецтво', subtitle: 'Досліджуйте українські галереї', color: 'from-zinc-900 to-zinc-800' },
  { id: 2, title: 'Спеціальна виставка', subtitle: 'ПінчукАртЦентр: Весняна колекція', color: 'from-blue-900 to-indigo-900' },
  { id: 3, title: 'На карті світу', subtitle: 'Знайдіть галереї у вашому місті', color: 'from-zinc-800 to-neutral-900' },
];

const HomeHero = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section className="container mx-auto px-6 pt-8">
      <div className={`relative h-[450px] rounded-[40px] overflow-hidden bg-gradient-to-br ${currentSlide.color} transition-all duration-700 shadow-2xl`}>
        
        {/* Контент слайда */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 space-y-6 px-12">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
            <Sparkles size={12} /> UA Galleries Spotlight
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight animate-in slide-in-from-bottom-4 duration-500">
            {currentSlide.title}
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-xl">
            {currentSlide.subtitle}
          </p>
          <button className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
            Докладніше <ArrowRight size={16} />
          </button>
        </div>

        {/* Стрілки управління */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-20">
          <NavButton icon={<ArrowLeft />} onClick={() => setCurrentSlideIndex(v => v === 0 ? SLIDES.length-1 : v-1)} />
          <NavButton icon={<ArrowRight />} onClick={() => setCurrentSlideIndex(v => v === SLIDES.length-1 ? 0 : v+1)} />
        </div>

        {/* Індикатор слайдів */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === currentSlideIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

const NavButton = ({ icon, onClick }: any) => (
  <button onClick={onClick} className="p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all">
    {icon}
  </button>
);

export default HomeHero;