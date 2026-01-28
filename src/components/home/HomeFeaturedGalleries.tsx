import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGalleriesQuery } from '../../hooks/useGalleriesQuery';
import { useState, useEffect } from 'react';
import { getGalleryName, getGalleryCity, getGallerySpecialization } from '../../utils/gallery';

const HomeFeaturedGalleries = () => {
  const { t, i18n } = useTranslation();
  const { data: galleries = [] } = useGalleriesQuery();
  const [randomGalleries, setRandomGalleries] = useState<typeof galleries>([]);

  // Randomize galleries only once when data is loaded to prevent re-shuffle on every render
  useEffect(() => {
    if (galleries.length > 0) {
      const shuffled = [...galleries].sort(() => 0.5 - Math.random());
      setRandomGalleries(shuffled.slice(0, 3));
    }
  }, [galleries]);

  if (randomGalleries.length === 0) return null; // Don't render empty section until loaded

  return (
    <section className="space-y-12">
      {/* Заголовок у нашому фірмовому стилі */}
      <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{t('home.featured.badge')}</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('home.featured.title')}</h2>
        </div>
        <Link
          to="/galleries"
          className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-all"
        >
          {t('home.featured.viewAll')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Сітка карток */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {randomGalleries.map((gallery, index) => {
          const name = getGalleryName(gallery, i18n.language);
          const city = getGalleryCity(gallery, i18n.language);
          const specialization = getGallerySpecialization(gallery, i18n.language);

          return (
            <Link
              key={gallery.id}
              to={`/galleries/${gallery.slug}`}
              className="group cursor-pointer space-y-5 animate-fade-in-up opacity-0 block"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              {/* Плейсхолдер під фото з ефектом "скла" */}
              <div className="aspect-[16/10] bg-zinc-100 rounded-[32px] overflow-hidden relative shadow-inner">
                {/* Fake badge for visual balance (optional) or remove */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-2xl flex items-center gap-1.5 shadow-sm z-10">
                  <span className="text-[10px] font-black text-zinc-900 uppercase tracking-wider">UA ART</span>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                {/* Gradient Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:scale-105 transition-transform duration-700" />

                {/* Show first letter as placeholder art if no image */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-black text-9xl opacity-20 pointer-events-none">
                  {name[0]}
                </div>
              </div>

              {/* Інфо про галерею */}
              <div className="space-y-3 px-2">
                <div className="flex gap-2">
                  {specialization && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                      {specialization}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">
                    {name}
                  </h3>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <MapPin size={12} />
                    <span className="text-xs font-medium">{city}, Україна</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default HomeFeaturedGalleries;