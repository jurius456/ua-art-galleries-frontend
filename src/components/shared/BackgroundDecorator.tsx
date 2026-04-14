const ARTWORKS = [
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80", // painting portrait
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", // abstract art
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80", // art detail
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&q=80", // painting close
  "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80", // canvas art
];

// Position, rotation, size for each floating painting
const FLOAT_CONFIGS = [
  { top: "8%",  left: "-3%",  rotate: "-6deg", w: 160, h: 200, opacity: 0.12 },
  { top: "5%",  right: "-2%", rotate: "5deg",  w: 140, h: 180, opacity: 0.10 },
  { top: "55%", left: "-4%",  rotate: "8deg",  w: 130, h: 170, opacity: 0.09 },
  { top: "60%", right: "-3%", rotate: "-7deg", w: 150, h: 195, opacity: 0.11 },
  { top: "30%", right: "2%",  rotate: "4deg",  w: 110, h: 140, opacity: 0.08 },
];

const BackgroundDecorator = () => {
  return (
    <>
      {/* ====== LIGHT MODE ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none block dark:hidden bg-white">

        {/* Grey atmosphere blobs */}
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

        {/* Floating artwork frames */}
        {ARTWORKS.map((src, i) => {
          const cfg = FLOAT_CONFIGS[i];
          return (
            <div
              key={i}
              className="absolute overflow-hidden rounded-2xl"
              style={{
                top: cfg.top,
                left: cfg.left ?? undefined,
                right: cfg.right ?? undefined,
                width: cfg.w,
                height: cfg.h,
                transform: `rotate(${cfg.rotate})`,
                opacity: cfg.opacity,
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                // Edge fade mask so paintings blend softly into bg
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
              }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                className="w-full h-full object-cover select-none"
              />
            </div>
          );
        })}
      </div>

      {/* ====== DARK MODE ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block bg-[#070709]">

        {/* Fluid orb shapes */}
        <div className="absolute top-[-25%] right-[-10%] w-[70vw] h-[60vw] rounded-[40%_60%_70%_30%] border border-zinc-800 opacity-40 animate-[spin_40s_linear_infinite] bg-zinc-900/30" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[80vw] h-[70vw] rounded-[60%_40%_30%_70%] border border-zinc-800 opacity-40 animate-[spin_50s_linear_infinite_reverse] bg-zinc-900/20" />
        <div className="absolute top-[20%] left-[10%] w-[50vw] h-[40vw] rounded-[50%_40%_60%_40%] border border-zinc-900 opacity-40 animate-[spin_70s_linear_infinite] bg-black/20" />

        {/* Floating artworks — darker, more atmospheric in dark mode */}
        {ARTWORKS.map((src, i) => {
          const cfg = FLOAT_CONFIGS[i];
          return (
            <div
              key={i}
              className="absolute overflow-hidden rounded-2xl"
              style={{
                top: cfg.top,
                left: cfg.left ?? undefined,
                right: cfg.right ?? undefined,
                width: cfg.w,
                height: cfg.h,
                transform: `rotate(${cfg.rotate})`,
                opacity: cfg.opacity * 0.7,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
              }}
            >
              <img src={src} alt="" draggable={false} className="w-full h-full object-cover select-none" />
            </div>
          );
        })}

        {/* Glass panel */}
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