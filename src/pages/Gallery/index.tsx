import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Instagram, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
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

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { isAuth } = useAuth();
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
          className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-800 text-[10px] font-black uppercase tracking-widest mb-16"
        >
          <ArrowLeft size={14} />
          {t('gallery.backToGalleries')}
        </Link>

        {/* Cover Image */}
        {gallery.cover_image && (
          <div className="mb-12 rounded-[32px] overflow-hidden">
            <img
              src={gallery.cover_image}
              alt={name}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        <h1 className="text-5xl md:text-7xl font-black text-zinc-800 uppercase mb-4">
          {name}
        </h1>

        <div className="flex items-center gap-4 mb-12">
          <p className="text-zinc-500 font-bold">
            {city} — {address}
          </p>
          {specialization && (
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
              {specialization}
            </span>
          )}
        </div>

        {/* Main content with smooth gradient overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 relative">
          {/* Auth card for non-authenticated users */}
          {!isAuth && (
            <>

              {/* Bottom overlay auth card */}
              <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none animate-[fadeIn_0.5s_ease-out]">
                <div className="container mx-auto px-6 max-w-6xl pb-12">
                  <div
                    className="bg-white rounded-[32px] p-8 shadow-[0_-4px_24px_rgba(0,0,0,0.08),0_-12px_48px_rgba(0,0,0,0.12)] border border-zinc-100 pointer-events-auto"
                  >
                    <div className="max-w-2xl mx-auto">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Icon and text section */}
                        <div className="flex items-center gap-6 flex-1">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-lg opacity-30" />
                              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <Lock className="text-white" size={24} strokeWidth={2.5} />
                              </div>
                            </div>
                          </div>

                          {/* Text */}
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-black text-zinc-900 mb-1">
                              Увійдіть, щоб переглянути повну інформацію
                            </h3>
                            <p className="text-sm text-zinc-500 font-medium">
                              Деталі галереї доступні лише для зареєстрованих користувачів
                            </p>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0 w-full md:w-auto">
                          <button
                            onClick={() => navigate('/auth')}
                            className="group relative w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] font-bold text-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] pointer-events-auto cursor-pointer"
                          >
                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Shimmer */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                              Увійти або зареєструватися
                              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="lg:col-span-7 space-y-10">
            {shortDesc && (
              <div
                className="text-xl text-zinc-600 relative"
                style={!isAuth ? {
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                } : {}}
              >
                {shortDesc}
              </div>
            )}

            {/* Only show full content for authenticated users */}
            {isAuth && (
              <>
                {fullDesc && (
                  <div className="prose prose-zinc max-w-none">
                    {typeof fullDesc === 'string'
                      ? <div className="whitespace-pre-wrap">{fullDesc}</div>
                      : documentToReactComponents(fullDesc as Document)
                    }
                  </div>
                )}

                {/* Founders, Curators, Artists */}
                <div className="space-y-6 pt-8 border-t border-zinc-200">
                  {founders && (
                    <div>
                      <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">
                        {t('gallery.founders')}
                      </p>
                      <p className="text-zinc-700 font-medium">{founders}</p>
                    </div>
                  )}

                  {curators && (
                    <div>
                      <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">
                        {t('gallery.curators')}
                      </p>
                      <p className="text-zinc-700 font-medium">{curators}</p>
                    </div>
                  )}

                  {artists && (
                    <div>
                      <p className="text-[9px] font-black uppercase text-zinc-400 mb-2">
                        {t('gallery.artists')}
                      </p>
                      <p className="text-zinc-700 font-medium">{artists}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="bg-white rounded-[40px] p-10 space-y-8 shadow-sm sticky top-8">
              {/* Founding Year */}
              {gallery.founding_year && (
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400">
                    {t('gallery.founded')}
                  </p>
                  <p className="text-3xl font-black">
                    {gallery.founding_year}
                  </p>
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-3 font-bold">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>

              {/* Contacts */}
              <div className="space-y-3 pt-6 border-t">
                <p className="text-[9px] font-black uppercase text-zinc-400 mb-4">
                  {t('gallery.contacts')}
                </p>

                {gallery.email && (
                  <a
                    href={`mailto:${gallery.email}`}
                    className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                  >
                    <Mail size={16} />
                    {gallery.email}
                  </a>
                )}

                {gallery.phone && (
                  <a
                    href={`tel:${gallery.phone}`}
                    className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                  >
                    <Phone size={16} />
                    {gallery.phone}
                  </a>
                )}

                {gallery.website && (
                  <a
                    href={gallery.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Globe size={16} />
                    {t('gallery.website')}
                  </a>
                )}

                {/* Social Links */}
                {gallery.social_links && Object.keys(gallery.social_links).length > 0 && (
                  <div className="pt-4 border-t">
                    {gallery.social_links.instagram && (
                      <a
                        href={gallery.social_links.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-pink-600 transition-colors"
                      >
                        <Instagram size={16} />
                        Instagram
                      </a>
                    )}
                  </div>
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
