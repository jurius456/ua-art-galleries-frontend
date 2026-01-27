import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-10">
            {shortDesc && (
              <p className="text-xl text-zinc-600">
                {shortDesc}
              </p>
            )}

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
