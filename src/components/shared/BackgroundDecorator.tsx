const BackgroundDecorator = () => {
  return (
    <>
      {/* ====== LIGHT MODE: grey blobs on white ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none block dark:hidden bg-white">

        <div
          className="absolute -top-[20%] -right-[15%] w-[65vw] h-[65vw] rounded-full animate-[spin_40s_linear_infinite]"
          style={{
            background: 'radial-gradient(circle at center, rgba(24,24,27,0.18) 0%, rgba(24,24,27,0.08) 45%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute -bottom-[20%] -left-[15%] w-[70vw] h-[70vw] rounded-full animate-[spin_55s_linear_infinite_reverse]"
          style={{
            background: 'radial-gradient(circle at center, rgba(39,39,42,0.14) 0%, rgba(39,39,42,0.06) 45%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute top-[15%] left-[5%] w-[45vw] h-[45vw] rounded-full animate-[spin_70s_linear_infinite]"
          style={{
            background: 'radial-gradient(circle at center, rgba(63,63,70,0.10) 0%, transparent 65%)',
            filter: 'blur(25px)',
          }}
        />
      </div>

      {/* ====== DARK MODE: animated orbs + frosted glass ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block bg-[#070709]">
        <div className="absolute top-[-25%] right-[-10%] w-[70vw] h-[60vw] rounded-[40%_60%_70%_30%] border border-zinc-800 opacity-40 animate-[spin_40s_linear_infinite] bg-zinc-900/30" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[80vw] h-[70vw] rounded-[60%_40%_30%_70%] border border-zinc-800 opacity-40 animate-[spin_50s_linear_infinite_reverse] bg-zinc-900/20" />
        <div className="absolute top-[20%] left-[10%] w-[50vw] h-[40vw] rounded-[50%_40%_60%_40%] border border-zinc-900 opacity-40 animate-[spin_70s_linear_infinite] bg-black/20" />
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[150vh] bg-black/10 rotate-12 backdrop-blur-md border-l border-zinc-800/30 z-0" />
        <div className="absolute inset-0 bg-[#070709]/60 backdrop-blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
        />
      </div>
    </>
  );
};

export default BackgroundDecorator;