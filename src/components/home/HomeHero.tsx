import { ArrowRight, ArrowLeft, MapPin, Star, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroImage1 from '../../assets/hero/slide1.png';
import heroImage2 from '../../assets/hero/slide2.png';
import heroImage3 from '../../assets/hero/slide3.png';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import { getGalleryName, getGalleryCity } from '../../utils/gallery';
import type { Gallery } from '../../api/galleries';

/* ---------- Types ---------- */

type StaticSlide = {
  id: string;
  type: 'static';
  titleKey: string;
  subtitleKey: string;
  image: string;
  gradient: string;
};

type GallerySlide = {
  id: string | number;
  type: 'gallery';
  gallery: Gallery;
  badge: 'top' | 'new';
  image: string;
  gradient: string;
};

type Slide = StaticSlide | GallerySlide;

/* ---------- Constants ----------
 * Gradients must be clearly visible against the dark theme background (#070709).
 * Using inline style={{}} so they are immune to Tailwind dark-mode variable remapping.
 */
const SLIDE_GRADIENTS = [
  'linear-gradient(135deg, #1e1e22 0%, #2d2d34 55%, #222228 100%)',   // dark charcoal
  'linear-gradient(135deg, #201e1a 0%, #302c26 55%, #252118 100%)',   // warm dark
  'linear-gradient(135deg, #1a1e24 0%, #262e38 55%, #1e2530 100%)',   // cool dark slate
];

const STATIC_FALLBACK: Slide[] = [
  { id: 'static-1', type: 'static', titleKey: 'home.hero.slide1.title', subtitleKey: 'home.hero.slide1.subtitle', image: heroImage1, gradient: SLIDE_GRADIENTS[0] },
  { id: 'static-2', type: 'static', titleKey: 'home.hero.slide2.title', subtitleKey: 'home.hero.slide2.subtitle', image: heroImage2, gradient: SLIDE_GRADIENTS[1] },
  { id: 'static-3', type: 'static', titleKey: 'home.hero.slide3.title', subtitleKey: 'home.hero.slide3.subtitle', image: heroImage3, gradient: SLIDE_GRADIENTS[2] },
];

/* ---------- Component ---------- */

const HomeHero = () => {
  const { t } = useTranslation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { data: galleries = [] } = useGalleriesQuery();

  const SLIDES = useMemo((): Slide[] => {
    if (galleries.length === 0) return STATIC_FALLBACK;

    const topRated: Gallery | undefined = [...galleries]
      .filter(g => g.status)
      .sort((a, b) => {
        const rA = a.avg_rating ?? a.rating_avg ?? a.average_rating ?? a.rating ?? 0;
        const rB = b.avg_rating ?? b.rating_avg ?? b.average_rating ?? b.rating ?? 0;
        return rB - rA;
      })[0];

    const newest: Gallery | undefined = [...galleries]
      .filter(g => g.status && g.slug !== topRated?.slug)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    const slide1: Slide = topRated
      ? { id: topRated.id, type: 'gallery', gallery: topRated, badge: 'top', image: heroImage1, gradient: SLIDE_GRADIENTS[0] }
      : { id: 'static-1', type: 'static', titleKey: 'home.hero.slide1.title', subtitleKey: 'home.hero.slide1.subtitle', image: heroImage1, gradient: SLIDE_GRADIENTS[0] };

    const slide2: Slide = newest
      ? { id: newest.id, type: 'gallery', gallery: newest, badge: 'new', image: heroImage2, gradient: SLIDE_GRADIENTS[1] }
      : { id: 'static-2', type: 'static', titleKey: 'home.hero.slide2.title', subtitleKey: 'home.hero.slide2.subtitle', image: heroImage2, gradient: SLIDE_GRADIENTS[1] };

    const slide3: Slide = {
      id: 'static-3', type: 'static',
      titleKey: 'home.hero.slide3.title', subtitleKey: 'home.hero.slide3.subtitle',
      image: heroImage3, gradient: SLIDE_GRADIENTS[2],
    };

    return [slide1, slide2, slide3];
  }, [galleries]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section className="w-full pt-0">
      <div
        className="relative h-[480px] md:h-[580px] overflow-hidden group"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Gradient base — inline style avoids dark-mode CSS variable remapping */}
            <div className="absolute inset-0" style={{ background: slide.gradient }} />

            {/* Static image as subtle texture */}
            <img
              src={slide.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover opacity-[0.28] transform transition-transform duration-[20000ms] ease-linear mix-blend-luminosity ${index === currentSlideIndex ? 'scale-110' : 'scale-100'}`}
            />

            {/* Vignette overlays */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%, rgba(0,0,0,0.2) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 md:px-20">
          {currentSlide.type === 'gallery'
            ? <GallerySlideContent slide={currentSlide} />
            : <StaticSlideContent slide={currentSlide} t={t} />
          }
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <NavButton icon={<ArrowLeft size={20} />} onClick={() => setCurrentSlideIndex(v => v === 0 ? SLIDES.length - 1 : v - 1)} />
          <NavButton icon={<ArrowRight size={20} />} onClick={() => setCurrentSlideIndex(v => v === SLIDES.length - 1 ? 0 : v + 1)} />
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              style={{
                height: '6px',
                borderRadius: '999px',
                width: i === currentSlideIndex ? '40px' : '8px',
                background: i === currentSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.5s',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Gallery Slide Content ---------- */

const GallerySlideContent = ({ slide }: { slide: GallerySlide }) => {
  const { t, i18n } = useTranslation();
  const name = getGalleryName(slide.gallery, i18n.language);
  const city = getGalleryCity(slide.gallery, i18n.language);
  const avgRating =
    slide.gallery.avg_rating ??
    slide.gallery.rating_avg ??
    slide.gallery.average_rating ??
    slide.gallery.rating ??
    0;

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 max-w-2xl">
      {/* Badge — all inline styles to stay immune to dark mode */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 16px',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '999px',
        fontSize: '10px', fontWeight: 900,
        textTransform: 'uppercase', letterSpacing: '0.28em',
        color: '#ffffff',
      }}>
        {slide.badge === 'top'
          ? <><TrendingUp size={11} color="#fbbf24" /> {t('home.hero.topGallery')}</>
          : <><Sparkles size={11} color="#93c5fd" /> {t('home.hero.newGallery')}</>
        }
      </div>

      {/* Gallery name */}
      <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, textTransform: 'uppercase', textShadow: '0 4px 24px rgba(0,0,0,0.4)', margin: 0 }}>
        {name}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontWeight: 600 }}>
          <MapPin size={14} color="rgba(255,255,255,0.45)" />
          {city}, {t('common.country')}
        </span>
        {avgRating > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fcd34d', fontSize: '14px', fontWeight: 700 }}>
            <Star size={13} fill="#fcd34d" color="#fcd34d" />
            {avgRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* CTA — immune to dark mode via inline style */}
      <Link
        to={`/galleries/${slide.gallery.slug}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          marginTop: '8px',
          padding: '14px 28px',
          background: '#ffffff',
          color: '#111111',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          transition: 'all 0.25s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)';
          (e.currentTarget as HTMLElement).style.gap = '12px';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = '#ffffff';
          (e.currentTarget as HTMLElement).style.gap = '8px';
        }}
      >
        {t('home.hero.viewGallery')}
        <ArrowRight size={16} color="#111111" />
      </Link>
    </div>
  );
};

/* ---------- Static Slide Content ---------- */

const StaticSlideContent = ({ slide, t }: { slide: StaticSlide; t: (key: string) => string }) => (
  <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
    <div style={{
      padding: '6px 16px',
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '999px',
      fontSize: '10px', fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: '0.3em',
      color: '#ffffff',
    }}>
      UA Galleries
    </div>
    <h1 style={{ color: '#ffffff', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, maxWidth: '56rem', textShadow: '0 4px 32px rgba(0,0,0,0.5)', margin: 0 }}>
      {t(slide.titleKey)}
    </h1>
    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 500, maxWidth: '32rem', lineHeight: 1.6, textShadow: '0 2px 12px rgba(0,0,0,0.4)', margin: 0 }}>
      {t(slide.subtitleKey)}
    </p>
  </div>
);

/* ---------- Nav Button ---------- */

const NavButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: '48px', height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '50%',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = '#ffffff';
      (e.currentTarget as HTMLElement).style.color = '#000000';
      (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.25)';
      (e.currentTarget as HTMLElement).style.color = '#ffffff';
      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
    }}
  >
    {icon}
  </button>
);

export default HomeHero;