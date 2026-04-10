const BackgroundDecorator = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 1. БАЗОВИЙ ФОН */}
      <div className="absolute inset-0 bg-white/40 dark:bg-[#070709] transition-colors duration-1000" />
      
      {/* 2. АКЦЕРЕКЛЬНА ПЛЯМА (ЛІВО - ХОЛОДНА) */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/30 dark:bg-blue-900/30 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen" />

      {/* 3. АКЦЕРЕКЛЬНА ПЛЯМА (ПРАВО - ТЕПЛА) */}
      <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-rose-200/30 dark:bg-purple-900/30 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />

      {/* 4. АКЦЕРЕКЛЬНА ПЛЯМА (НИЗ - ГЛИБИНА) */}
      <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[40vw] bg-violet-200/30 dark:bg-indigo-950/40 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen" />

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