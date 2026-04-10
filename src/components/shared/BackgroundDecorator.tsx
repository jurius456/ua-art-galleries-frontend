const BackgroundDecorator = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 1. БАЗОВИЙ ФОН */}
      <div className="absolute inset-0 bg-white/40 dark:bg-[#070709] transition-colors duration-1000" />
      
      {/* 2. АБСТРАКТНА СТРУКТУРНА ТІНЬ (ЛІВОРУЧ) */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-zinc-200/60 dark:bg-zinc-800/30 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen" />

      {/* 3. АБСТРАКТНА СТРУКТУРНА ТІНЬ (ПРАВОРУЧ) */}
      <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-zinc-300/40 dark:bg-zinc-900/60 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />

      {/* 4. АБСТРАКТНА СТРУКТУРНА ТІНЬ (НИЗ) */}
      <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[40vw] bg-zinc-400/20 dark:bg-black/80 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen" />

      {/* 5. ШУМ (Glassmorphism grain) */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.015] mix-blend-multiply dark:mix-blend-overlay" 
        style={{ 
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
        }} 
      />
    </div>
  );
};

export default BackgroundDecorator;