import { ArrowRight, ArrowLeft, MapPin, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import heroImage1 from '../../assets/hero/slide1.png';
import heroImage2 from '../../assets/hero/slide2.png';
import heroImage3 from '../../assets/hero/slide3.png';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import { fetchGalleryReviews } from '../../api/galleries';
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
  avgRating: number;
};

type Slide = StaticSlide | GallerySlide;

/* ---------- Constants ---------- */

const SLIDE_GRADIENTS = [
  'linear-gradient(160deg, #1e1e22 0%, #2d2d34 60%, #1a1a1f 100%)',
  'linear-gradient(160deg, #201e1a 0%, #302c26 60%, #1e1a14 100%)',
  'linear-gradient(160deg, #1a1e24 0%, #262e38 60%, #161c24 100%)',
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

  // Take first 15 active galleries to check ratings
  const candidates = useMemo(() =>
    galleries.filter(g => g.status).slice(0, 15),
    [galleries]
  );

  // Fetch real ratings for each candidate
  const ratingResults = useQueries({
    queries: candidates.map(g => ({
      queryKey: ['gallery-rating-hero', g.slug],
      queryFn: async () => {
        const reviews = await fetchGalleryReviews(g.slug);
        if (!reviews || reviews.length === 0) return { slug: g.slug, avg: 0 };
        const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        return { slug: g.slug, avg };
      },
      staleTime: 1000 * 60 * 10,
      enabled: candidates.length > 0,
    })),
  });

  const SLIDES = useMemo((): Slide[] => {
    if (galleries.length === 0) return STATIC_FALLBACK;

    // Build rating map from fetched data
    const ratingMap = new Map<string, number>();
    ratingResults.forEach(r => {
      if (r.data) ratingMap.set(r.data.slug, r.data.avg);
    });

    // Sort candidates by real rating, pick top 2
    const sorted = [...candidates]
      .map(g => ({ g, avg: ratingMap.get(g.slug) ?? 0 }))
      .filter(x => x.avg > 0)
      .sort((a, b) => b.avg - a.avg);

    const top1 = sorted[0]?.g;
    const top2 = sorted[1]?.g;
    const top1Rating = sorted[0]?.avg ?? 0;
    const top2Rating = sorted[1]?.avg ?? 0;

    const slide1: Slide = top1
      ? { id: top1.id, type: 'gallery', gallery: top1, badge: 'top', image: heroImage1, gradient: SLIDE_GRADIENTS[0], avgRating: top1Rating }
      : { id: 'static-1', type: 'static', titleKey: 'home.hero.slide1.title', subtitleKey: 'home.hero.slide1.subtitle', image: heroImage1, gradient: SLIDE_GRADIENTS[0] };

    const slide2: Slide = top2
      ? { id: top2.id, type: 'gallery', gallery: top2, badge: 'top', image: heroImage2, gradient: SLIDE_GRADIENTS[1], avgRating: top2Rating }
      : { id: 'static-2', type: 'static', titleKey: 'home.hero.slide2.title', subtitleKey: 'home.hero.slide2.subtitle', image: heroImage2, gradient: SLIDE_GRADIENTS[1] };

    const slide3: Slide = {
      id: 'static-3', type: 'static',
      titleKey: 'home.hero.slide3.title', subtitleKey: 'home.hero.slide3.subtitle',
      image: heroImage3, gradient: SLIDE_GRADIENTS[2],
    };

    return [slide1, slide2, slide3];
  }, [galleries, candidates, ratingResults]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section
      className="w-full flex items-center justify-center px-4 md:px-6"
      style={{ minHeight: 'calc(100svh - 76px)' }}
    >
      <div className="container mx-auto">
      <div
        className="relative w-full h-[460px] md:h-[540px] rounded-[32px] md:rounded-[40px] overflow-hidden group"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── Slides background ── */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0" style={{ background: slide.gradient }} />
            <img
              src={slide.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-luminosity transform transition-transform duration-[20000ms] ease-linear ${index === currentSlideIndex ? 'scale-110' : 'scale-100'}`}
            />
            {/* Bottom gradient for text readability */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />
          </div>
        ))}



        {/* ── Thin vertical accent line ── */}
        <div
          className="absolute left-10 md:left-16 top-12 bottom-12 w-px z-20"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent 100%)' }}
        />



        {/* ── UA Galleries badge top-left ── */}
        <div
          className="absolute top-10 left-16 md:top-12 md:left-24 z-30"
          style={{
            fontSize: '9px', fontWeight: 900, letterSpacing: '0.35em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
          }}
        >
          UA GALLERIES
        </div>

        {/* ── Main content — bottom left editorial layout ── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pl-14 md:pl-24 pr-6 md:pr-16 pb-10 md:pb-14">
          {currentSlide.type === 'gallery'
            ? <GallerySlideContent slide={currentSlide} slideIndex={currentSlideIndex} />
            : <StaticSlideContent slide={currentSlide} t={t} slideIndex={currentSlideIndex} />
          }
        </div>

        {/* ── Bottom navigation dots (right-aligned) ── */}
        <div className="absolute bottom-10 md:bottom-12 right-10 md:right-14 flex items-center gap-2 z-30">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              style={{
                width: i === currentSlideIndex ? '28px' : '6px',
                height: '6px',
                borderRadius: '999px',
                background: i === currentSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── Arrow navigation ── */}
        <div className="absolute bottom-10 md:bottom-12 right-24 md:right-32 flex items-center gap-2 z-30">
          <NavButton icon={<ArrowLeft size={14} />} onClick={() => setCurrentSlideIndex(v => v === 0 ? SLIDES.length - 1 : v - 1)} />
          <NavButton icon={<ArrowRight size={14} />} onClick={() => setCurrentSlideIndex(v => v === SLIDES.length - 1 ? 0 : v + 1)} />
        </div>
      </div>
      </div>
    </section>
  );
};

/* ---------- Gallery Slide Content — Editorial ---------- */

const GallerySlideContent = ({ slide, slideIndex }: { slide: GallerySlide; slideIndex: number }) => {
  const { t, i18n } = useTranslation();
  const name = getGalleryName(slide.gallery, i18n.language);
  const city = getGalleryCity(slide.gallery, i18n.language);
  const avgRating = slide.avgRating;

  return (
    <div key={`g-${slideIndex}`} className="animate-fade-in-up space-y-5 max-w-2xl">
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '9px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
        {slide.badge === 'top'
          ? <><TrendingUp size={10} color="#fbbf24" /> <span style={{ color: '#fbbf24' }}>{t('home.hero.topGallery')}</span></>
          : <><Sparkles size={10} color="#93c5fd" /> <span style={{ color: '#93c5fd' }}>{t('home.hero.newGallery')}</span></>
        }
      </div>

      {/* Gallery name */}
      <h1 style={{
        color: '#ffffff',
        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        lineHeight: 0.95,
        textTransform: 'uppercase',
        margin: 0,
        textShadow: '0 4px 32px rgba(0,0,0,0.5)',
      }}>
        {name}
      </h1>

      {/* Thin divider + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '32px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <MapPin size={11} color="rgba(255,255,255,0.4)" />
            {city}
          </span>
          {avgRating > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map(i => {
                const filled = i <= Math.round(avgRating);
                return (
                  <Star
                    key={i}
                    size={13}
                    fill={filled ? '#fcd34d' : 'none'}
                    color={filled ? '#fcd34d' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={1.5}
                  />
                );
              })}
              <span style={{ marginLeft: '5px', fontSize: '11px', fontWeight: 700, color: '#fcd34d' }}>
                {avgRating.toFixed(1)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/galleries/${slide.gallery.slug}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '12px 24px',
          background: 'rgba(255,255,255,1)',
          color: '#111',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          textDecoration: 'none',
          transition: 'all 0.25s',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.88)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,1)'; }}
      >
        {t('home.hero.viewGallery')}
        <ArrowRight size={14} color="#111" />
      </Link>
    </div>
  );
};

/* ---------- Static Slide Content — Editorial ---------- */

const StaticSlideContent = ({ slide, t, slideIndex }: { slide: StaticSlide; t: (key: string) => string; slideIndex: number }) => (
  <div key={`s-${slideIndex}`} className="animate-fade-in-up space-y-5 max-w-2xl">
    <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
      Discover
    </div>
    <h1 style={{
      color: '#ffffff',
      fontSize: 'clamp(2.2rem, 5vw, 4rem)',
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 0.95,
      textTransform: 'uppercase',
      margin: 0,
      textShadow: '0 4px 32px rgba(0,0,0,0.5)',
    }}>
      {t(slide.titleKey)}
    </h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '32px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
      <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.02em' }}>
        {t(slide.subtitleKey)}
      </p>
    </div>
  </div>
);

/* ---------- Nav Button ---------- */

const NavButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: '36px', height: '36px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '50%',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.25s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
  >
    {icon}
  </button>
);

export default HomeHero;