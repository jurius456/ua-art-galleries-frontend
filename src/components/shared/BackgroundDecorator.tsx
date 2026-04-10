const BackgroundDecorator = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 1. БАЗОВИЙ ФОН */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-[#070709] transition-colors duration-1000" />
      
      {/* 2. ПРЕМІУМ СВІТІННЯ (ЛІВО) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-white dark:bg-zinc-800/20 rounded-full blur-[120px] opacity-70 dark:opacity-40" />

      {/* 3. ПРЕМІУМ СВІТІННЯ (ПРАВО) */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-zinc-100/80 dark:bg-zinc-900/40 rounded-full blur-[150px] opacity-60 dark:opacity-40" />

      {/* 4. ШУМ (Glassmorphism grain) */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] mix-blend-multiply dark:mix-blend-overlay" 
        style={{ 
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
        }} 
      />
    </div>
  );
};

export default BackgroundDecorator;