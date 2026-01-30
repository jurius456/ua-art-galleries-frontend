import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Instagram, Lock, Clock, Calendar, BadgeCheck, Ban, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';

import { fetchGalleryBySlug } from "../../api/galleries";
import type { GalleryDetail } from "../../api/galleries";
import {
  getGalleryName,
  getGalleryCity,
  getGalleryAddress,
  getGalleryShortDescription,
  getGalleryFullDescription,
  getGallerySpecialization,
  getGalleryFounders,
  getGalleryCurators,
  getGalleryArtists,
} from "../../utils/gallery";
import GalleryMap from "../../components/gallery/GalleryMap";

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { isAuth } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);

    fetchGalleryBySlug(slug)
      .then(setGallery)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 text-[10px] font-black uppercase tracking-widest">
        {t('gallery.loading')}
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
          {t('gallery.notFound')}
        </p>
        <Link
          to="/galleries"
          className="text-zinc-800 font-black uppercase text-[10px] tracking-widest border-b border-zinc-800"
        >
          {t('gallery.return')}
        </Link>
      </div>
    );
  }

  const name = getGalleryName(gallery, i18n.language);
  const city = getGalleryCity(gallery, i18n.language);
  const address = getGalleryAddress(gallery, i18n.language);
  const shortDesc = getGalleryShortDescription(gallery, i18n.language);
  const fullDesc = getGalleryFullDescription(gallery, i18n.language);
  const specialization = getGallerySpecialization(gallery, i18n.language);
  const founders = getGalleryFounders(gallery, i18n.language);
  const curators = getGalleryCurators(gallery, i18n.language);
  const artists = getGalleryArtists(gallery, i18n.language);

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-6 max-w-6xl pt-12">
        <Link
          to="/galleries"
          className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-800 text-[10px] font-black uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={14} />
          {t('gallery.backToGalleries')}
        </Link>

        {/* Gallery Header (Mobile Only for Name/City) */}
        <div className="lg:hidden mb-8">
          <h1 className="text-4xl font-black text-zinc-900 uppercase mb-4 leading-none">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
              <MapPin size={12} className="text-zinc-500" />
              <span className="text-xs font-bold uppercase text-zinc-600">{city}</span>
            </div>
            {gallery.status ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full text-green-700">
                <BadgeCheck size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t('gallery.active')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 rounded-full text-red-700">
                <Ban size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t('gallery.inactive')}</span>
              </div>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-8 flex flex-col gap-12">

            {/* Cover Image */}
            {gallery.cover_image && (
              <div className="rounded-[40px] overflow-hidden shadow-sm aspect-video lg:aspect-[16/9]">
                <img
                  src={gallery.cover_image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* About Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">{t('nav.about')}</h2>
              <div className="prose prose-zinc max-w-none text-zinc-600">
                {shortDesc && <p className="text-lg font-medium text-zinc-900 mb-6">{shortDesc}</p>}
                {fullDesc && (
                  <div className="text-base leading-relaxed">
                    {typeof fullDesc === 'string'
                      ? <div className="whitespace-pre-wrap">{fullDesc}</div>
                      : documentToReactComponents(fullDesc as Document)
                    }
                  </div>
                )}
              </div>
            </section>

            {/* Founding Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-zinc-50 rounded-[32px]">
              {founders && (
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">{t('gallery.founders')}</p>
                  <p className="font-bold text-zinc-900">{founders}</p>
                </div>
              )}
              {curators && (
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">{t('gallery.curators')}</p>
                  <p className="font-bold text-zinc-900">{curators}</p>
                </div>
              )}
              {gallery.founding_year && (
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">{t('gallery.founded')}</p>
                  <p className="font-bold text-zinc-900">{gallery.founding_year}</p>
                </div>
              )}
              {specialization && (
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">{t('gallery.specialization')}</p>
                  <p className="font-bold text-zinc-900">{specialization}</p>
                </div>
              )}
            </div>

            {/* RESTRICTED CONTENT */}
            <div className="relative pt-12 border-t border-zinc-100">
              {!isAuth && (
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/60 to-white flex items-center justify-center pt-20">
                  <div className="bg-white p-8 rounded-[32px] shadow-xl border border-zinc-100 max-w-md text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('gallery.loginToView')}</h3>
                    <p className="text-zinc-500 mb-8">{t('gallery.loginDesc')}</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors"
                    >
                      {t('gallery.loginBtn')}
                    </button>
                  </div>
                </div>
              )}

              <div className={`space-y-16 ${!isAuth ? 'blur-md select-none opacity-50' : ''}`}>
                {/* Exhibitions */}
                <section>
                  <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                    <Calendar size={20} className="text-zinc-400" />
                    {t('gallery.exhibitions')}
                  </h3>
                  <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium">No active exhibitions</p>
                  </div>
                </section>

                {/* Artists */}
                <section>
                  <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                    <Globe size={20} className="text-zinc-400" />
                    {t('gallery.artists')}
                  </h3>
                  {artists ? (
                    <div className="p-8 bg-zinc-50 rounded-[32px]">
                      <p className="font-medium text-zinc-800 leading-relaxed">{artists}</p>
                    </div>
                  ) : (
                    <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                      <p className="text-zinc-400 font-medium">No artists info</p>
                    </div>
                  )}
                </section>

                {/* Publications */}
                <section>
                  <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                    <div className="rotate-45"><ArrowLeft size={20} className="text-zinc-400" /></div>
                    {t('gallery.publications')}
                  </h3>
                  <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium">No publications found</p>
                  </div>
                </section>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className="lg:col-span-4 space-y-8">

            {/* Logo & Status Card */}
            <div className="bg-white rounded-[40px] border border-zinc-100 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="w-24 h-24 rounded-full bg-zinc-100 overflow-hidden lg:mx-0">
                  {gallery.image ? (
                    <img src={gallery.image} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 font-black text-2xl uppercase">
                      {name[0]}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    toggleFavorite({
                      id: gallery.slug,
                      name: getGalleryName(gallery, i18n.language),
                      slug: gallery.slug,
                    })
                  }
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${isFavorite(gallery.slug)
                      ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-zinc-100 text-zinc-300 hover:border-zinc-900 hover:text-zinc-900"
                    }`}
                  aria-label="Toggle favorite"
                >
                  <Heart size={20} fill={isFavorite(gallery.slug) ? "currentColor" : "none"} />
                </button>
              </div>

              <h1 className="hidden lg:block text-3xl font-black text-zinc-900 uppercase mb-4 leading-0.9">
                {name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {gallery.status ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-green-700 border border-green-100">
                    <BadgeCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('gallery.active')}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full text-red-700 border border-red-100">
                    <Ban size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('gallery.inactive')}</span>
                  </div>
                )}
              </div>

              {/* Map Block */}
              <div className="mb-8">
                <GalleryMap gallery={gallery} />
              </div>

              {/* Contacts List */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{t('events.city')}</p>
                    <p className="font-bold text-sm leading-tight">{city}, {address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{t('gallery.workingHours')}</p>
                    <p className="font-bold text-sm">11:00 — 19:00</p>
                    <p className="text-xs text-zinc-400">Mon — Sun</p>
                  </div>
                </div>

                {gallery.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{t('gallery.contacts')}</p>
                      <a href={`tel:${gallery.phone}`} className="font-bold text-sm hover:text-blue-600 transition-colors block">{gallery.phone}</a>
                    </div>
                  </div>
                )}

                {gallery.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Email</p>
                      <a href={`mailto:${gallery.email}`} className="font-bold text-sm hover:text-blue-600 transition-colors block truncate">{gallery.email}</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col gap-3">
                {gallery.website && (
                  <a href={gallery.website} target="_blank" rel="noreferrer" className="w-full py-3 border border-zinc-200 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase hover:bg-zinc-50 transition-colors">
                    <Globe size={16} />
                    {t('gallery.website')}
                  </a>
                )}

                {gallery.social_links?.instagram && (
                  <a href={gallery.social_links.instagram} target="_blank" rel="noreferrer" className="w-full py-3 bg-zinc-900 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase hover:bg-zinc-800 transition-colors">
                    <Instagram size={16} />
                    Instagram
                  </a>
                )}
              </div>

            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
