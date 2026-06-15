import { ArrowRight, ArrowLeft, MapPin, Star, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroImage1 from '../../assets/hero/slide1.png';
import heroImage2 from '../../assets/hero/slide2.png';
import heroImage3 from '../../assets/hero/slide3.png';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import { getGalleryName, getGalleryCity } from '../../utils/gallery';

// Artistic gradient backgrounds for slides without photos
const SLIDE_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d1b69 100%)',
];

const STATIC_SLIDES = [
  { image: heroImage1, gradient: SLIDE_GRADIENTS[0] },
  { image: heroImage2, gradient: SLIDE_GRADIENTS[1] },
  { image: heroImage3, gradient: SLIDE_GRADIENTS[2] },
];

const HomeHero = () => {
  const { t, i18n } = useTranslation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { data: galleries = [] } = useGalleriesQuery();

  // Build dynamic slides: top rated + newest + static fallback
  const SLIDES = useMemo(() => {
    if (galleries.length === 0) {
      // Fallback to static slides before data loads
      return [
        { id: 'static-1', type: 'static' as const, titleKey: 'home.hero.slide1.title', subtitleKey: 'home.hero.slide1.subtitle', image: heroImage1, gradient: SLIDE_GRADIENTS[0] },
        { id: 'static-2', type: 'static' as const, titleKey: 'home.hero.slide2.title', subtitleKey: 'home.hero.slide2.subtitle', image: heroImage2, gradient: SLIDE_GRADIENTS[1] },
        { id: 'static-3', type: 'static' as const, titleKey: 'home.hero.slide3.title', subtitleKey: 'home.hero.slide3.subtitle', image: heroImage3, gradient: SLIDE_GRADIENTS[2] },
      ];
    }

    // Top rated gallery
    const topRated = [...galleries]
      .filter(g => g.status)
      .sort((a, b) => {
        const rA = a.avg_rating ?? a.rating_avg ?? a.average_rating ?? a.rating ?? 0;
        const rB = b.avg_rating ?? b.rating_avg ?? b.average_rating ?? b.rating ?? 0;
        return rB - rA;
      })[0];

    // Newest gallery
    const newest = [...galleries]
      .filter(g => g.status && g.slug !== topRated?.slug)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    return [
      topRated
        ? { id: topRated.id, type: 'gallery' as const, gallery: topRated, badge: 'top', image: STATIC_SLIDES[0].image, gradient: SLIDE_GRADIENTS[0] }
        : { id: 'static-1', type: 'static' as const, titleKey: 'home.hero.slide1.title', subtitleKey: 'home.hero.slide1.subtitle', image: heroImage1, gradient: SLIDE_GRADIENTS[0] },
      newest
        ? { id: newest.id, type: 'gallery' as const, gallery: newest, badge: 'new', image: STATIC_SLIDES[1].image, gradient: SLIDE_GRADIENTS[1] }
        : { id: 'static-2', type: 'static' as const, titleKey: 'home.hero.slide2.title', subtitleKey: 'home.hero.slide2.subtitle', image: heroImage2, gradient: SLIDE_GRADIENTS[1] },
      { id: 'static-3', type: 'static' as const, titleKey: 'home.hero.slide3.title', subtitleKey: 'home.hero.slide3.subtitle', image: heroImage3, gradient: SLIDE_GRADIENTS[2] },
    ];
  }, [galleries]);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section className="container mx-auto px-4 md:px-6 pt-6 md:pt-10">
      <div
        className="relative h-[400px] md:h-[520px] rounded-[32px] md:rounded-[48px] overflow-hidden group"
        style={{ boxShadow: '0 20px 72px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.15)' }}
      >
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Gradient base */}
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />

            {/* Static image overlay (subtle) */}
            <img
              src={slide.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover opacity-20 transform transition-transform duration-[20000ms] ease-linear ${index === currentSlideIndex ? 'scale-110' : 'scale-100'}`}
            />

            {/* Noise texture overlay for depth */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 md:px-20">
          {currentSlide.type === 'gallery' ? (
            <GallerySlideContent slide={currentSlide} />
          ) : (
            <StaticSlideContent slide={currentSlide} t={t} />
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <NavButton icon={<ArrowLeft size={20} />} onClick={() => setCurrentSlideIndex(v => v === 0 ? SLIDES.length - 1 : v - 1)} />
          <NavButton icon={<ArrowRight size={20} />} onClick={() => setCurrentSlideIndex(v => v === SLIDES.length - 1 ? 0 : v + 1)} />
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-10 bg-[#ffffff]' : 'w-2 bg-[#ffffff]/40 hover:bg-[#ffffff]/70'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Gallery Slide Content ---------- */
type GallerySlide = {
  type: 'gallery';
  gallery: ReturnType<typeof useGalleriesQuery>['data'] extends (infer T)[] ? T : never;
  badge: 'top' | 'new';
  image: string;
  gradient: string;
  id: string | number;
};

const GallerySlideContent = ({ slide }: { slide: GallerySlide }) => {
  const { t, i18n } = useTranslation();
  const name = getGalleryName(slide.gallery as Parameters<typeof getGalleryName>[0], i18n.language);
  const city = getGalleryCity(slide.gallery as Parameters<typeof getGalleryCity>[0], i18n.language);
  const avgRating = (slide.gallery as { avg_rating?: number; rating_avg?: number; average_rating?: number; rating?: number }).avg_rating
    ?? (slide.gallery as { avg_rating?: number; rating_avg?: number; average_rating?: number; rating?: number }).rating_avg
    ?? (slide.gallery as { avg_rating?: number; rating_avg?: number; average_rating?: number; rating?: number }).average_rating
    ?? (slide.gallery as { avg_rating?: number; rating_avg?: number; average_rating?: number; rating?: number }).rating
    ?? 0;

  return (
    <div
      key={`gallery-slide-${slide.gallery.slug}`}
      className="animate-fade-in-up flex flex-col items-center gap-6 max-w-2xl"
    >
      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-lg">
        {slide.badge === 'top' ? (
          <><TrendingUp size={11} className="text-amber-400" /> {t('home.hero.topGallery', 'Топ галерея')}</>
        ) : (
          <><Sparkles size={11} className="text-blue-300" /> {t('home.hero.newGallery', 'Нова галерея')}</>
        )}
      </div>

      {/* Gallery Name */}
      <h1
        key={`title-${slide.gallery.slug}`}
        className="animate-fade-in-up text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.0] drop-shadow-xl uppercase"
      >
        {name}
      </h1>

      {/* City + Rating */}
      <div
        key={`meta-${slide.gallery.slug}`}
        className="animate-fade-in-up flex items-center gap-4 flex-wrap justify-center"
      >
        <span className="flex items-center gap-1.5 text-white/70 text-sm font-semibold">
          <MapPin size={14} className="text-white/50" />
          {city}, {t('common.country')}
        </span>
        {avgRating > 0 && (
          <span className="flex items-center gap-1 text-amber-300 text-sm font-bold">
            <Star size={13} className="fill-amber-300" />
            {avgRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* CTA Button */}
      <Link
        key={`cta-${slide.gallery.slug}`}
        to={`/galleries/${slide.gallery.slug}`}
        className="animate-fade-in-up group flex items-center gap-2 mt-2 px-7 py-3.5 bg-white text-zinc-900 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/90 hover:gap-3 transition-all duration-300 shadow-2xl"
      >
        {t('home.hero.viewGallery', 'Переглянути галерею')}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

/* ---------- Static Slide Content ---------- */
type StaticSlide = {
  type: 'static';
  titleKey: string;
  subtitleKey: string;
  image: string;
  gradient: string;
  id: string;
};

const StaticSlideContent = ({ slide, t }: { slide: StaticSlide; t: (key: string) => string }) => (
  <div
    key={`static-${slide.id}`}
    className="animate-fade-in-up space-y-6 md:space-y-8"
  >
    <div
      key={`badge-${slide.id}`}
      className="animate-fade-in-up px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white shadow-lg inline-block"
    >
      UA Galleries
    </div>

    <h1
      key={`title-${slide.id}`}
      className="animate-fade-in-up text-4xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] max-w-4xl drop-shadow-xl"
    >
      {t(slide.titleKey)}
    </h1>

    <p
      key={`sub-${slide.id}`}
      className="animate-fade-in-up text-base md:text-xl text-white/80 font-medium max-w-lg leading-relaxed drop-shadow-md"
    >
      {t(slide.subtitleKey)}
    </p>
  </div>
);

const NavButton = ({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) => (
  <button onClick={onClick} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 shadow-xl">
    {icon}
  </button>
);

export default HomeHero;