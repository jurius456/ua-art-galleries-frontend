import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Instagram, Facebook, Twitter, Youtube, Linkedin, Lock, Clock, BadgeCheck, Ban, Heart, Info, Users, ExternalLink, Star, MessageSquare, Archive, Zap, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';

import { fetchGalleryBySlug, fetchGalleryReviews, createGalleryReview } from "../../api/galleries";
import type { GalleryDetail, Review } from "../../api/galleries";
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

const getSocialLinkDetails = (url: string, t: (key: string) => string) => {
  if (!url) return { icon: Globe, name: t('gallery.socialNetwork') };
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com')) return { icon: Instagram, name: 'Instagram' };
  if (lowerUrl.includes('facebook.com')) return { icon: Facebook, name: 'Facebook' };
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return { icon: Twitter, name: 'Twitter' };
  if (lowerUrl.includes('youtube.com')) return { icon: Youtube, name: 'YouTube' };
  if (lowerUrl.includes('linkedin.com')) return { icon: Linkedin, name: 'LinkedIn' };
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.org')) return { icon: Globe, name: 'Telegram' };
  if (lowerUrl.includes('tiktok.com')) return { icon: Globe, name: 'TikTok' };
  return { icon: Globe, name: t('gallery.socialNetwork') };
};

const GalleryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { isAuth, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);
    setLoadingReviews(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    fetchGalleryBySlug(slug)
      .then(setGallery)
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetchGalleryReviews(slug)
      .then(setReviews)
      .catch((err) => console.error("Error fetching reviews:", err))
      .finally(() => setLoadingReviews(false));
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    if (newRating < 1 || newRating > 5) {
      setSubmitError(t("gallery.reviewError"));
      return;
    }

    setSubmittingReview(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const data = await createGalleryReview(slug, {
        rating: newRating,
        text: newText,
      });
      setReviews((prev) => [data, ...prev]);
      setNewText("");
      setNewRating(5);
      setSubmitSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || t("gallery.reviewError"));
    } finally {
      setSubmittingReview(false);
    }
  };

  // Split exhibitions into active and archive
  // IMPORTANT: Must be before early returns (Rules of Hooks)
  const today = useMemo(() => new Date(), []);
  const activeExhibitions = useMemo(() => {
    if (!gallery?.exhibitions) return [];
    return gallery.exhibitions.filter(ex => {
      // Use is_active field if present; also validate by end_date
      if (typeof ex.is_active === 'boolean') {
        if (!ex.is_active) return false;
        // Even if is_active is true, treat as archive if end_date is clearly past
        if (ex.end_date) return new Date(ex.end_date) >= today;
        return true;
      }
      if (ex.end_date) return new Date(ex.end_date) >= today;
      return true;
    });
  }, [gallery?.exhibitions, today]);
  const archiveExhibitions = useMemo(() => {
    if (!gallery?.exhibitions) return [];
    return gallery.exhibitions.filter(ex => {
      if (typeof ex.is_active === 'boolean') {
        if (!ex.is_active) return true;
        if (ex.end_date) return new Date(ex.end_date) < today;
        return false;
      }
      if (ex.end_date) return new Date(ex.end_date) < today;
      return false;
    });
  }, [gallery?.exhibitions, today]);

  // Format updated_at date
  const updatedAtFormatted = useMemo(() => {
    if (!gallery?.updated_at) return null;
    try {
      return new Date(gallery.updated_at).toLocaleDateString(
        i18n.language === 'uk' ? 'uk-UA' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    } catch {
      return null;
    }
  }, [gallery?.updated_at, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-transparent pb-32 animate-in fade-in duration-700 font-sans">
      <div className="container mx-auto px-6 max-w-6xl pt-12">
        <Link
          to="/galleries"
          className="group inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-800 text-[10px] font-black uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t('gallery.backToGalleries')}
        </Link>

        {gallery.cover_image && (
          <div className="rounded-[40px] overflow-hidden shadow-sm aspect-[21/9] mb-12">
            <img
              src={gallery.cover_image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-zinc-900 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-xl shrink-0 overflow-hidden">
                  {gallery.image ? (
                    <img src={gallery.image} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{name[0].toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-zinc-800 tracking-tighter uppercase leading-[0.9] mb-4">
                    {name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-zinc-400" />
                    <span className="text-base font-bold text-zinc-500">{city}, {address}</span>
                  </div>
                </div>
              </div>
            </div>

            {(shortDesc || fullDesc) && (
              <div className="prose prose-zinc max-w-none">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 flex items-center gap-2">
                  <Info size={14} /> {t('gallery.about')}
                </h2>
                {shortDesc && <p className="text-xl text-zinc-600 leading-relaxed font-medium mb-6">{shortDesc}</p>}
                {fullDesc && (
                  <div className="text-lg text-zinc-500 leading-relaxed font-medium">
                    {typeof fullDesc === 'string'
                      ? <div className="whitespace-pre-wrap">{fullDesc}</div>
                      : documentToReactComponents(fullDesc as Document)
                    }
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100">
                <Users size={20} className="text-zinc-400 mb-4" />
                <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">{t('gallery.founded')}</h4>
                <p className="text-2xl font-black text-zinc-800">{gallery.founding_year || '—'}</p>
              </div>
              <div className="p-8 bg-white border border-zinc-100 rounded-[40px]">
                {gallery.status ? <BadgeCheck size={20} className="text-green-500 mb-4" /> : <Ban size={20} className="text-red-500 mb-4" />}
                <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">{t('gallery.status')}</h4>
                <p className={`text-lg font-black ${gallery.status ? 'text-green-600' : 'text-red-600'}`}>{gallery.status ? t('gallery.active') : t('gallery.inactive')}</p>
              </div>
            </div>

            <div className="relative pt-12 border-t border-zinc-200 mt-12">
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
                <section>
                  <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                    <Zap size={24} className="text-green-500" />
                    {t('gallery.activeExhibitions')}
                    {activeExhibitions.length > 0 && (
                      <span className="ml-auto text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                        {activeExhibitions.length}
                      </span>
                    )}
                  </h3>
                  {activeExhibitions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {activeExhibitions.map((exhibition) => (
                        <div key={exhibition.id} className="p-8 bg-zinc-50 rounded-[32px] border border-green-100 hover:border-green-200 transition-colors relative overflow-hidden">
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-green-200">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                              {t('events.statusActive')}
                            </span>
                          </div>
                          {exhibition.image_url && (
                            <div className="mb-6 rounded-2xl overflow-hidden aspect-video">
                              <img src={exhibition.image_url} alt={exhibition.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h4 className="text-xl font-black text-zinc-900 mb-2 uppercase pr-20">{exhibition.title}</h4>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                            <span>
                              {exhibition.start_date ? new Date(exhibition.start_date).toLocaleDateString(i18n.language === 'uk' ? 'uk-UA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : t('gallery.dateTBD', 'Дати уточнюються')} 
                              {' — '} 
                              {exhibition.end_date ? new Date(exhibition.end_date).toLocaleDateString(i18n.language === 'uk' ? 'uk-UA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '...'}
                            </span>
                          </div>
                          {exhibition.artists && (
                            <p className="text-sm font-bold text-zinc-600 mb-4 uppercase">{exhibition.artists}</p>
                          )}
                          <p className="text-zinc-600 font-medium leading-relaxed mb-6">{exhibition.description}</p>
                          <a 
                            href={exhibition.source_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-blue-600 transition-colors border-b border-zinc-900 hover:border-blue-600 pb-1"
                          >
                            <ExternalLink size={12} />
                            {t('gallery.sourceLink') || 'Джерело'}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                      <p className="text-zinc-400 font-medium">{t('gallery.noActiveExhibitions')}</p>
                    </div>
                  )}
                </section>

                {archiveExhibitions.length > 0 && (
                  <section className="mt-12">
                    <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-zinc-400">
                      <Archive size={24} className="text-zinc-400" />
                      {t('gallery.archiveExhibitions')}
                      <span className="ml-auto text-xs font-bold bg-zinc-50 text-zinc-500 px-3 py-1 rounded-full border border-zinc-200">
                        {archiveExhibitions.length}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar opacity-75">
                      {archiveExhibitions.map((exhibition) => (
                        <div key={exhibition.id} className="p-6 bg-zinc-50/50 rounded-[28px] border border-zinc-100 hover:border-zinc-200 transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h4 className="text-base font-black text-zinc-600 uppercase">{exhibition.title}</h4>
                            <span className="shrink-0 inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                              <Archive size={9} />
                              {t('events.statusArchive')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                            <span>
                              {exhibition.start_date ? new Date(exhibition.start_date).toLocaleDateString(i18n.language === 'uk' ? 'uk-UA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} 
                              {' — '} 
                              {exhibition.end_date ? new Date(exhibition.end_date).toLocaleDateString(i18n.language === 'uk' ? 'uk-UA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                          </div>
                          {exhibition.artists && (
                            <p className="text-xs font-bold text-zinc-500 mb-2 uppercase">{exhibition.artists}</p>
                          )}
                          <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-4 line-clamp-2">{exhibition.description}</p>
                          {exhibition.source_url && (
                            <a 
                              href={exhibition.source_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors border-b border-zinc-300 hover:border-blue-600 pb-0.5"
                            >
                              <ExternalLink size={10} />
                              {t('gallery.sourceLink') || 'Джерело'}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

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
                      <p className="text-zinc-400 font-medium">{t('gallery.noArtists')}</p>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-16 border-t border-zinc-200 mt-16 space-y-12">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                  <MessageSquare size={24} className="text-zinc-400" />
                  {t('gallery.reviews')}
                </h3>
                {reviews.length > 0 && (
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                    {t('gallery.basedOnReviews', { count: reviews.length })}
                  </span>
                )}
              </div>

              {/* Reviews Summary Stats */}
              {reviews.length > 0 && (() => {
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                const avgRating = (totalRating / reviews.length).toFixed(1);
                
                // Count stars distribution (1 to 5)
                const distribution = [0, 0, 0, 0, 0];
                reviews.forEach(r => {
                  if (r.rating >= 1 && r.rating <= 5) {
                    distribution[r.rating - 1]++;
                  }
                });

                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-zinc-200/60 pr-0 md:pr-8 py-2">
                      <span className="text-6xl font-black text-zinc-800 tracking-tight">{avgRating}</span>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= Math.round(Number(avgRating));
                          return (
                            <Star
                              key={star}
                              size={18}
                              className={filled ? "text-amber-400 fill-amber-400" : "text-zinc-200"}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">
                        {reviews.length} {t('gallery.reviews').toLowerCase()}
                      </span>
                    </div>

                    <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = distribution[stars - 1];
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                            <span className="w-3 text-right">{stars}</span>
                            <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex-grow h-2 bg-zinc-200/55 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-[10px] font-bold text-zinc-400">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Leave Review Form */}
              {(!isAuth || !reviews.some(r => r.username === user?.username)) && (
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
                  <h4 className="text-lg font-black uppercase text-zinc-800 tracking-tight flex items-center gap-2 border-b border-zinc-50 pb-4">
                    {t('gallery.leaveReview')}
                  </h4>

                  {!isAuth ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="flex items-center gap-3">
                        <Lock size={18} className="text-zinc-400" />
                        <p className="text-sm font-semibold text-zinc-500">{t('gallery.loginToLeaveReview')}</p>
                      </div>
                      <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-zinc-950 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-colors shadow-md text-center"
                      >
                        {t('gallery.loginBtnShort')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block">
                          {t('gallery.rating')}
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isHighlighted = star <= (hoveredRating || newRating);
                            return (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 duration-100"
                              >
                                <Star
                                  size={32}
                                  className={`transition-colors duration-150 ${
                                    isHighlighted
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-zinc-200 fill-transparent hover:text-amber-300"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder={t('gallery.reviewPlaceholder')}
                          required
                          className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 focus:bg-white transition-all resize-none"
                        />
                      </div>

                      {submitError && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 animate-in fade-in">
                          {submitError}
                        </div>
                      )}

                      {submitSuccess && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl text-xs font-semibold border border-green-100 animate-in fade-in">
                          {t('gallery.reviewSuccess')}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full py-4 bg-zinc-950 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                      >
                        {submittingReview ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t('gallery.submitting')}
                          </>
                        ) : (
                          t('gallery.submitReview')
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {loadingReviews ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-12 bg-zinc-50 rounded-[32px] text-center border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium text-sm">{t('gallery.noReviews')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-6 bg-white border border-zinc-100 rounded-[28px] shadow-sm space-y-4 hover:border-zinc-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 text-sm border border-zinc-200/50 uppercase select-none">
                              {review.username ? review.username[0] : "?"}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-800 text-sm leading-none">{review.username}</p>
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {new Date(review.created_at).toLocaleDateString(
                                  i18n.language === "uk" ? "uk-UA" : "en-US",
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const filled = star <= review.rating;
                              return (
                                <Star
                                  key={star}
                                  size={14}
                                  className={filled ? "text-amber-400 fill-amber-400" : "text-zinc-100"}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-zinc-600 text-sm font-medium leading-relaxed whitespace-pre-wrap pl-1">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-zinc-100 rounded-[40px] p-8 space-y-8 shadow-sm lg:sticky top-28">
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: name,
                        text: shortDesc || t('gallery.shareText'),
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(t('common.linkCopied'));
                    }
                  }}
                  className="w-14 h-14 rounded-full border-2 border-zinc-100 flex items-center justify-center shrink-0 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  aria-label="Share"
                >
                  <Globe size={20} />
                </button>
                <button
                  onClick={() =>
                    toggleFavorite({
                      id: gallery.slug,
                      name: getGalleryName(gallery, i18n.language),
                      slug: gallery.slug,
                    })
                  }
                  className={`flex-1 h-14 rounded-full border-2 flex items-center justify-center gap-2 transition-colors font-bold uppercase tracking-widest text-xs ${isFavorite(gallery.slug)
                      ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-zinc-100 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900"
                    }`}
                >
                  <Heart size={20} fill={isFavorite(gallery.slug) ? "currentColor" : "none"} />
                  {isFavorite(gallery.slug) ? t('gallery.saved') : t('gallery.save')}
                </button>
              </div>

              {updatedAtFormatted && (
                <div className="flex items-center gap-2 justify-center py-2">
                  <RefreshCw size={11} className="text-zinc-300" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {t('gallery.lastUpdated')}: {updatedAtFormatted}
                  </span>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-zinc-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{t('gallery.specialization')}</p>
                  <p className="text-sm font-bold text-zinc-800 uppercase leading-relaxed">{specialization || '—'}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{t('gallery.contacts')}</p>
                  <div className="space-y-3">
                    {gallery.phone && (
                      <a href={`tel:${gallery.phone}`} className="flex items-center gap-3 text-sm font-bold text-zinc-800 hover:text-blue-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0"><Phone size={14} className="text-zinc-400"/></div>
                        {gallery.phone}
                      </a>
                    )}
                    {gallery.email && (
                      <a href={`mailto:${gallery.email}`} className="flex items-center gap-3 text-sm font-bold text-zinc-800 hover:text-blue-600 transition-colors truncate">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0"><Mail size={14} className="text-zinc-400"/></div>
                        <span className="truncate">{gallery.email}</span>
                      </a>
                    )}
                    {gallery.website && (
                      <a href={gallery.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-zinc-800 hover:text-blue-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0"><ExternalLink size={14} className="text-zinc-400"/></div>
                        {t('gallery.website')}
                      </a>
                    )}
                    {(() => {
                      let links: string[] = [];
                      if (!gallery.social_links) return null;
                      
                      if (Array.isArray(gallery.social_links)) {
                        links = gallery.social_links;
                      } else if (typeof gallery.social_links === 'string') {
                        try {
                          const parsed = JSON.parse(gallery.social_links);
                          if (Array.isArray(parsed)) {
                            links = parsed;
                          } else if (typeof parsed === 'object' && parsed !== null) {
                            links = Object.values(parsed);
                          } else {
                            links = [parsed.toString()];
                          }
                        } catch {
                          links = (gallery.social_links as string).split(',').map((s: string) => s.trim()).filter(Boolean);
                        }
                      } else if (typeof gallery.social_links === 'object') {
                        links = Object.values(gallery.social_links);
                      }

                      return links.filter(link => typeof link === 'string' && link.length > 5).map((link, idx) => {
                        const { icon: Icon, name } = getSocialLinkDetails(link, t);
                        return (
                          <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-zinc-800 hover:text-blue-600 transition-colors truncate">
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0"><Icon size={14} className="text-zinc-400"/></div>
                            <span className="truncate">{name}</span>
                          </a>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-50">
                   <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{t('gallery.workingHours')}</p>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0"><Clock size={14} className="text-zinc-400"/></div>
                      <div>
                        <p className="font-bold text-sm text-zinc-800">11:00 — 19:00</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{t('gallery.workingDays')}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-[24px] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl">
                 <GalleryMap gallery={gallery} />
              </div>

            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default GalleryPage;
