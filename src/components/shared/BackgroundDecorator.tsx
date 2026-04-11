const BackgroundDecorator = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:bg-[#070709]"
      style={{
        /* Light: pure white centre → subtle warm-grey edges (mirrors the dark glow) */
        background: 'radial-gradient(ellipse at 55% 35%, #ffffff 0%, #f2f2f4 45%, #e6e6ea 100%)',
      }}>

      {/* DARK MODE overlay — overtakes the inline gradient */}
      <div className="absolute inset-0 hidden dark:block bg-[#070709]" />

      {/* 1. FLUID ORB shapes */}
      <div className="absolute top-[-25%] right-[-10%] w-[70vw] h-[60vw] rounded-[40%_60%_70%_30%] border border-zinc-200 dark:border-zinc-800 opacity-40 animate-[spin_40s_linear_infinite] bg-zinc-100/60 dark:bg-zinc-900/30" />
      <div className="absolute bottom-[-30%] left-[-20%] w-[80vw] h-[70vw] rounded-[60%_40%_30%_70%] border border-zinc-200 dark:border-zinc-800 opacity-40 animate-[spin_50s_linear_infinite_reverse] bg-zinc-100/40 dark:bg-zinc-900/20" />

      {/* Central blob */}
      <div className="absolute top-[20%] left-[10%] w-[50vw] h-[40vw] rounded-[50%_40%_60%_40%] border border-zinc-200/60 dark:border-zinc-900 opacity-40 animate-[spin_70s_linear_infinite] bg-white/60 dark:bg-black/20" />

      {/* 2. GLASS PANEL (refraction) */}
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[150vh] bg-white/10 dark:bg-black/10 rotate-12 backdrop-blur-md border-l border-white/50 dark:border-zinc-800/30 z-0" />

      {/* 3. FROSTED GLASS — only in dark mode; light mode keeps body gradient clean */}
      <div className="absolute inset-0 bg-transparent dark:bg-[#070709]/60 dark:backdrop-blur-3xl" />

      {/* 4. NOISE texture */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
        }}
      />
    </div>
  );
};

export default BackgroundDecorator;