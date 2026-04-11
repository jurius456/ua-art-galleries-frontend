const BackgroundDecorator = () => {
  return (
    <>
      {/* LIGHT MODE: just the body radial-gradient, no extra layers needed */}

      {/* DARK MODE: animated orbs + frosted glass for the glow effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block bg-[#070709]">

        {/* Fluid orb shapes */}
        <div className="absolute top-[-25%] right-[-10%] w-[70vw] h-[60vw] rounded-[40%_60%_70%_30%] border border-zinc-800 opacity-40 animate-[spin_40s_linear_infinite] bg-zinc-900/30" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[80vw] h-[70vw] rounded-[60%_40%_30%_70%] border border-zinc-800 opacity-40 animate-[spin_50s_linear_infinite_reverse] bg-zinc-900/20" />
        <div className="absolute top-[20%] left-[10%] w-[50vw] h-[40vw] rounded-[50%_40%_60%_40%] border border-zinc-900 opacity-40 animate-[spin_70s_linear_infinite] bg-black/20" />

        {/* Glass panel */}
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[150vh] bg-black/10 rotate-12 backdrop-blur-md border-l border-zinc-800/30 z-0" />

        {/* Frosted smoke overlay */}
        <div className="absolute inset-0 bg-[#070709]/60 backdrop-blur-3xl" />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
        />
      </div>
    </>
  );
};

export default BackgroundDecorator;