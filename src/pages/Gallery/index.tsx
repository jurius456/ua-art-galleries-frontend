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
  const artists = getGalleryArtists(gallery, i18n.language);

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-6 max-w-4xl pt-12">
        <Link
          to="/galleries"
          className="group inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-800 text-[10px] font-black uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={14} />
          {t('gallery.backToGalleries')}
        </Link>

        {/* 1. ФОТО (Cover Image + Title/Logo) */}
        <div className="mb-12">
          {gallery.cover_image && (
            <div className="rounded-[40px] overflow-hidden shadow-sm aspect-video mb-8">
              <img
                src={gallery.cover_image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-zinc-100 overflow-hidden shrink-0 hidden md:block border border-zinc-200 shadow-sm">
                {gallery.image ? (
                  <img src={gallery.image} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 font-black text-2xl uppercase">
                    {name[0]}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase leading-none mb-3">
                  {name}
                </h1>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-500">{city}, {address}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                toggleFavorite({
                  id: gallery.slug,
                  name: getGalleryName(gallery, i18n.language),
                  slug: gallery.slug,
                })
              }
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isFavorite(gallery.slug)
                  ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                  : "border-zinc-100 text-zinc-300 hover:border-zinc-900 hover:text-zinc-900"
                }`}
              aria-label="Toggle favorite"
            >
              <Heart size={24} fill={isFavorite(gallery.slug) ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Info Grid (Contacts, Hours, Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* 2. КОНТАКТИ */}
          <div className="p-8 bg-zinc-50 rounded-[32px] space-y-6">
            <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-200 pb-4 mb-4">{t('gallery.contacts')}</h3>
            <div className="space-y-4">
              {gallery.phone && (
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-zinc-400" />
                  <a href={`tel:${gallery.phone}`} className="font-bold text-sm text-zinc-800 hover:text-blue-600 transition-colors">{gallery.phone}</a>
                </div>
              )}
              {gallery.email && (
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-zinc-400" />
                  <a href={`mailto:${gallery.email}`} className="font-bold text-sm text-zinc-800 hover:text-blue-600 transition-colors truncate">{gallery.email}</a>
                </div>
              )}
              {gallery.website && (
                <div className="flex items-center gap-4">
                  <Globe size={18} className="text-zinc-400" />
                  <a href={gallery.website} target="_blank" rel="noreferrer" className="font-bold text-sm text-zinc-800 hover:text-blue-600 transition-colors">{t('gallery.website')}</a>
                </div>
              )}
              {gallery.social_links?.instagram && (
                <div className="flex items-center gap-4">
                  <Instagram size={18} className="text-zinc-400" />
                  <a href={gallery.social_links.instagram} target="_blank" rel="noreferrer" className="font-bold text-sm text-zinc-800 hover:text-blue-600 transition-colors">Instagram</a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* 3. ГОДИНИ РОБОТИ */}
            <div className="p-8 bg-zinc-50 rounded-[32px]">
              <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-200 pb-4 mb-4">{t('gallery.workingHours')}</h3>
              <div className="flex items-center gap-4">
                <Clock size={18} className="text-zinc-400" />
                <div>
                  <p className="font-bold text-sm text-zinc-800">11:00 — 19:00</p>
                  <p className="text-xs text-zinc-500">Понеділок — Неділя</p>
                </div>
              </div>
            </div>

            {/* ADDITIONAL: MAP */}
            <div className="h-32 rounded-[32px] overflow-hidden border border-zinc-100">
               <GalleryMap gallery={gallery} />
            </div>
          </div>
        </div>

        {/* 4. ПРО ГАЛЕРЕЮ */}
        {(shortDesc || fullDesc) && (
          <div className="mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">{t('nav.about')}</h2>
            <div className="prose prose-zinc max-w-none text-zinc-600 p-8 md:p-12 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
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
          </div>
        )}

        {/* 5, 6, 7. РІК, СПЕЦІАЛІЗАЦІЯ, СТАТУС */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20 font-medium">
          <div className="p-6 bg-zinc-50 rounded-[24px]">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">{t('gallery.founded')}</p>
            <p className="text-2xl font-black text-zinc-900">{gallery.founding_year || '—'}</p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-[24px]">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">{t('gallery.specialization')}</p>
            <p className="font-bold text-zinc-900">{specialization || '—'}</p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-[24px]">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Статус</p>
            {gallery.status ? (
              <div className="flex items-center gap-2 text-green-700">
                <BadgeCheck size={20} />
                <span className="font-bold">{t('gallery.active')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <Ban size={20} />
                <span className="font-bold">{t('gallery.inactive')}</span>
              </div>
            )}
          </div>
        </div>

        {/* RESTRICTED CONTENT (Exhibitions, Artists, Publications) */}
        <div className="relative pt-12 border-t border-zinc-200">
          {!isAuth && (
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/60 to-white flex items-center justify-center pt-20">
              <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-zinc-100 max-w-md text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('gallery.loginToView')}</h3>
                <p className="text-zinc-500 mb-8">{t('gallery.loginDesc')}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors shadow-lg"
                >
                  {t('gallery.loginBtn')}
                </button>
              </div>
            </div>
          )}

          <div className={`space-y-16 ${!isAuth ? 'blur-md select-none opacity-40' : ''}`}>
            {/* Exhibitions */}
            <section>
              <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <Calendar size={24} className="text-zinc-400" />
                {t('gallery.exhibitions')}
              </h3>
              <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                <p className="text-zinc-400 font-medium">No active exhibitions</p>
              </div>
            </section>

            {/* Artists */}
            <section>
              <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <Globe size={24} className="text-zinc-400" />
                {t('gallery.artists')}
              </h3>
              {artists ? (
                <div className="p-8 bg-zinc-50 rounded-[32px] text-zinc-800 leading-relaxed font-medium">
                  {artists}
                </div>
              ) : (
                <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                  <p className="text-zinc-400 font-medium">No artists info</p>
                </div>
              )}
            </section>

            {/* Publications */}
            <section>
              <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <div className="rotate-45"><ArrowLeft size={24} className="text-zinc-400" /></div>
                {t('gallery.publications')}
              </h3>
              <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                <p className="text-zinc-400 font-medium">No publications found</p>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GalleryPage;
