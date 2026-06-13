import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Calendar, LayoutGrid,
  ArrowRight, MapPin, Archive, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useGalleriesQuery } from "../../hooks/useGalleriesQuery";
import { useQueries } from "@tanstack/react-query";
import { fetchGalleryBySlug } from "../../api/galleries";
import type { Exhibition } from "../../api/galleries";
import { getGalleryName, getGalleryCity } from "../../utils/gallery";
import { CustomSelect } from "../../components/shared/CustomSelect";

const PER_PAGE = 18;

interface ExhibitionWithGallery extends Exhibition {
  gallerySlug: string;
  galleryName: string;
  galleryCity: string;
  galleryImage?: string | null;
}

const isExhibitionActive = (ex: Exhibition): boolean => {
  if (typeof ex.is_active === 'boolean') return ex.is_active;
  if (ex.end_date) return new Date(ex.end_date) >= new Date();
  return true;
};

const EventsPage = () => {
  const { t, i18n } = useTranslation();
  const { data: galleries = [], isLoading: galleriesLoading } = useGalleriesQuery();

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGallery, setSelectedGallery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // "" | "active" | "archive"
  const [page, setPage] = useState(1);

  // Fetch detail for each gallery to get exhibitions
  const galleryDetailResults = useQueries({
    queries: galleries.map(g => ({
      queryKey: ["gallery-detail-events", g.slug],
      queryFn: () => fetchGalleryBySlug(g.slug),
      staleTime: 1000 * 60 * 5,
      enabled: galleries.length > 0,
    })),
  });

  const isLoading = galleriesLoading || galleryDetailResults.some(r => r.isLoading);
  const loadedCount = galleryDetailResults.filter(r => r.isSuccess).length;
  const totalCount = galleries.length;

  // Aggregate all exhibitions from loaded galleries
  const allExhibitions = useMemo<ExhibitionWithGallery[]>(() => {
    const result: ExhibitionWithGallery[] = [];
    galleryDetailResults.forEach((res, idx) => {
      if (!res.data || !res.data.exhibitions) return;
      const gallery = galleries[idx];
      if (!gallery) return;
      const galleryName = getGalleryName(gallery, i18n.language);
      const galleryCity = getGalleryCity(gallery, i18n.language);
      res.data.exhibitions.forEach(ex => {
        result.push({
          ...ex,
          gallerySlug: gallery.slug,
          galleryName,
          galleryCity,
          galleryImage: gallery.image,
        });
      });
    });
    return result;
  }, [galleryDetailResults, galleries, i18n.language]);

  // Dynamic filter options
  const cities = useMemo(() => {
    const seen = new Set<string>();
    allExhibitions.forEach(ex => { if (ex.galleryCity) seen.add(ex.galleryCity); });
    return Array.from(seen).sort();
  }, [allExhibitions]);

  const galleryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    allExhibitions.forEach(ex => { if (ex.gallerySlug && ex.galleryName) seen.set(ex.gallerySlug, ex.galleryName); });
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [allExhibitions]);

  // Filter exhibitions
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allExhibitions.filter(ex => {
      const matchSearch = !q ||
        ex.title.toLowerCase().includes(q) ||
        ex.galleryName.toLowerCase().includes(q);
      const matchCity = !selectedCity || ex.galleryCity === selectedCity;
      const matchGallery = !selectedGallery || ex.gallerySlug === selectedGallery;
      const matchStatus =
        !selectedStatus ||
        (selectedStatus === "active" && isExhibitionActive(ex)) ||
        (selectedStatus === "archive" && !isExhibitionActive(ex));
      return matchSearch && matchCity && matchGallery && matchStatus;
    });
  }, [allExhibitions, search, selectedCity, selectedGallery, selectedStatus]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setSelectedCity("");
    setSelectedGallery("");
    setSelectedStatus("");
    setPage(1);
  };

  const hasFilters = search || selectedCity || selectedGallery || selectedStatus;

  return (
    <div className="min-h-screen bg-transparent pb-28 animate-in fade-in duration-700">
      {/* Header */}
      <section className="bg-white/40 backdrop-blur-sm border-b border-zinc-200/50 py-16">
        <div className="container mx-auto px-6 max-w-6xl space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-800 tracking-tighter uppercase leading-none">
              {t('events.title')} <span className="text-zinc-400">{t('events.subtitle')}</span>
            </h1>
            {!galleriesLoading && totalCount > 0 && loadedCount < totalCount && (
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {t('events.loading')} ({loadedCount}/{totalCount})
              </p>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('events.search')}
              className="w-full h-[56px] rounded-2xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 pl-[52px] pr-6 text-[15px] outline-none focus:border-zinc-900 dark:focus:border-zinc-400 bg-white text-zinc-900"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CustomSelect
              value={selectedCity}
              onChange={(v) => { setSelectedCity(v); setPage(1); }}
              options={[
                { value: "", label: t('events.allCities') },
                ...cities.map(c => ({ value: c, label: c })),
              ]}
            />
            <CustomSelect
              value={selectedGallery}
              onChange={(v) => { setSelectedGallery(v); setPage(1); }}
              options={[
                { value: "", label: t('events.allGalleries') },
                ...galleryOptions,
              ]}
            />
            <CustomSelect
              value={selectedStatus}
              onChange={(v) => { setSelectedStatus(v); setPage(1); }}
              options={[
                { value: "", label: t('events.allStatuses') },
                { value: "active", label: t('events.activeOnly') },
                { value: "archive", label: t('events.archiveOnly') },
              ]}
            />
          </div>

          {/* Active filters badge row */}
          {hasFilters && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {t('galleries.filters')}:
              </span>
              {search && (
                <span className="flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  "{search}"
                  <button onClick={() => setSearch("")}><X size={10} /></button>
                </span>
              )}
              {selectedCity && (
                <span className="flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {selectedCity}
                  <button onClick={() => setSelectedCity("")}><X size={10} /></button>
                </span>
              )}
              {selectedGallery && (
                <span className="flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {galleryOptions.find(o => o.value === selectedGallery)?.label}
                  <button onClick={() => setSelectedGallery("")}><X size={10} /></button>
                </span>
              )}
              {selectedStatus && (
                <span className="flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {selectedStatus === "active" ? t('events.activeOnly') : t('events.archiveOnly')}
                  <button onClick={() => setSelectedStatus("")}><X size={10} /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors ml-2"
              >
                {t('events.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 max-w-6xl mt-10">
        <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.25em] mb-10">
          <LayoutGrid size={14} />
          {isLoading
            ? t('events.loading')
            : t('events.foundEvents', { count: filtered.length })
          }
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[32px] border border-zinc-100 bg-white p-0 overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-100" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-zinc-100 rounded-full w-1/3" />
                  <div className="h-5 bg-zinc-100 rounded-full w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-xl mx-auto py-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
              <Calendar size={32} className="text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black uppercase text-zinc-900 mb-2">{t('events.emptyTitle')}</h3>
            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{t('events.emptyDesc')}</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              {t('events.clearFilters')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((ex, idx) => (
                <ExhibitionCard key={`${ex.gallerySlug}-${ex.id}-${idx}`} exhibition={ex} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex flex-wrap justify-center items-center gap-2 md:gap-4 px-6">
                <button
                  disabled={page === 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                  className="p-2 rounded-full border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = page === pageNum;
                    const isNear = Math.abs(page - pageNum) <= 1;
                    const isFirstOrLast = pageNum === 1 || pageNum === totalPages;
                    if (!isNear && !isFirstOrLast && totalPages > 7) {
                      if (pageNum === 2 && page > 4) return <span key="dots-1" className="px-1 text-zinc-400">...</span>;
                      if (pageNum === totalPages - 1 && page < totalPages - 3) return <span key="dots-2" className="px-1 text-zinc-400">...</span>;
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => { setPage(pageNum); window.scrollTo(0, 0); }}
                        className={`min-w-[36px] md:min-w-[44px] h-9 md:h-11 rounded-xl font-bold transition-all text-xs md:text-sm ${isCurrent
                          ? "bg-zinc-900 text-white shadow-lg"
                          : "border border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                  className="p-2 rounded-full border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

const ExhibitionCard = ({ exhibition }: { exhibition: ExhibitionWithGallery }) => {
  const { t, i18n } = useTranslation();
  const active = isExhibitionActive(exhibition);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString(
        i18n.language === 'uk' ? 'uk-UA' : 'en-US',
        { day: 'numeric', month: 'short', year: 'numeric' }
      );
    } catch { return dateStr; }
  };

  return (
    <Link
      to={`/galleries/${exhibition.gallerySlug}`}
      className="group bg-white/80 backdrop-blur-sm border border-zinc-100 rounded-[32px] overflow-hidden hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-52 bg-zinc-100 overflow-hidden">
        {exhibition.image_url ? (
          <img
            src={exhibition.image_url}
            alt={exhibition.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {exhibition.galleryImage ? (
              <img src={exhibition.galleryImage} alt={exhibition.galleryName} className="w-16 h-16 object-cover rounded-2xl opacity-30" />
            ) : (
              <Calendar size={32} className="text-zinc-200" />
            )}
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          {active ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50/95 backdrop-blur-sm text-green-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {t('events.statusActive')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100/95 backdrop-blur-sm text-zinc-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-zinc-200">
              <Archive size={9} />
              {t('events.statusArchive')}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-7 space-y-4 flex-grow">
        <div className="space-y-2">
          {(exhibition.start_date || exhibition.end_date) && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Calendar size={11} />
              {formatDate(exhibition.start_date)}
              {exhibition.end_date && exhibition.end_date !== exhibition.start_date && (
                <> — {formatDate(exhibition.end_date)}</>
              )}
            </div>
          )}
          <h3 className="text-lg font-black tracking-tight text-zinc-800 group-hover:text-zinc-600 transition-colors leading-tight line-clamp-2">
            {exhibition.title}
          </h3>
          {exhibition.artists && (
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest line-clamp-1">
              {exhibition.artists}
            </p>
          )}
        </div>

        {exhibition.description && (
          <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-2">
            {exhibition.description}
          </p>
        )}
      </div>

      {/* Footer — gallery name */}
      <div className="px-7 pb-7 pt-0">
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={12} className="text-zinc-300 shrink-0" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">
              {exhibition.galleryName}{exhibition.galleryCity ? `, ${exhibition.galleryCity}` : ''}
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 group-hover:text-zinc-700 transition-colors">
            {t('events.viewGallery')} <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventsPage;