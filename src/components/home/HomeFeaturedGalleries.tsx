import React from 'react';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURED = [
  { id: 1, name: 'PinchukArtCentre', city: 'Київ', rating: 4.9, tags: ['Сучасне мистецтво'] },
  { id: 2, name: 'Львівська Галерея', city: 'Львів', rating: 4.8, tags: ['Класика', 'Ренесанс'] },
  { id: 3, name: 'Галерея Кузня', city: 'Київ', rating: 4.7, tags: ['Скульптура'] },
];

const HomeFeaturedGalleries = () => {
  return (
    <section className="space-y-12">
      {/* Заголовок у нашому фірмовому стилі */}
      <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Ексклюзивно</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Популярні галереї</h2>
        </div>
        <Link 
          to="/galleries" 
          className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-all"
        >
          Дивитися всі <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Сітка карток */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED.map((gallery) => (
          <div key={gallery.id} className="group cursor-pointer space-y-5">
            {/* Плейсхолдер під фото з ефектом "скла" */}
            <div className="aspect-[16/10] bg-zinc-100 rounded-[32px] overflow-hidden relative shadow-inner">
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-2xl flex items-center gap-1.5 shadow-sm">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[11px] font-black text-zinc-900">{gallery.rating}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>

            {/* Інфо про галерею */}
            <div className="space-y-3 px-2">
              <div className="flex gap-2">
                {gallery.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-none mb-1">
                  {gallery.name}
                </h3>
                <div className="flex items-center gap-1 text-zinc-400">
                  <MapPin size={12} />
                  <span className="text-xs font-medium">{gallery.city}, Україна</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFeaturedGalleries;