import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ChevronLeft, ChevronRight, BadgeCheck, Ban, Star } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useGalleriesQuery } from "../../hooks/useGalleriesQuery";
import { useFavorites } from "../../context/FavoritesContext";
import type { Gallery } from "../../api/galleries";
import { fetchGalleryReviews } from "../../api/galleries";
import { useTranslation } from 'react-i18next';
import { getGalleryName, getGalleryCity, getGalleryAddress } from "../../utils/gallery";
import { useGalleryRating } from "../../hooks/useGalleryRating";
import { MultiFilterPanel } from "../../components/shared/MultiFilterPanel";

const PER_PAGE = 18;

const GalleriesPage = () => {
  const { t, i18n } = useTranslation();
  const { data: galleries = [], isLoading } = useGalleriesQuery();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("alphabetical");
  const [page, setPage] = useState(1);

  /* ---------- CITIES & YEARS ---------- */
  // Use city_en as stable key, label is translated for display
  const cities = useMemo(() => {
    const seen = new Map<string, string>(); // city_en -> translated label
    galleries.forEach(g => {
      if (g.city_en && !seen.has(g.city_en)) {
        seen.set(g.city_en, getGalleryCity(g, i18n.language));
      }
    });
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [galleries, i18n.language]);

  const years = useMemo(() => {
    const unique = Array.from(
      new Set(galleries.map((g) => g.founding_year).filter(Boolean))
    ).sort((a, b) => Number(b) - Number(a));
    return unique as string[];
  }, [galleries]);

  /* ---------- RATINGS (prefetch when needed for filter/sort) ---------- */
  const needsRatings = minRating > 0 || sort === "rating";

  const ratingResults = useQueries({
    queries: galleries.map(g => ({
      queryKey: ["gallery-rating", g.slug],
      queryFn: async () => {
        const reviews = await fetchGalleryReviews(g.slug);
        if (!reviews || reviews.length === 0) return { avgRating: 0, reviewsCount: 0 };
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return { avgRating: total / reviews.length, reviewsCount: reviews.length };
      },
      staleTime: 1000 * 60 * 5,
      enabled: needsRatings,
    })),
  });

  /* ---------- FILTERING & SORTING ---------- */
  const sortedAndFiltered = useMemo(() => {
    // Build ratings map inline from cached query results
    const rMap = new Map<string, number>();
    if (needsRatings) {
      ratingResults.forEach((result, i) => {
        if (result.data && galleries[i]) {
          rMap.set(galleries[i].slug, result.data.avgRating);
        }
      });
    }

    const q = search.trim().toLowerCase();

    const filtered = galleries.filter((g) => {
      const name = getGalleryName(g, i18n.language);
      const cityName = getGalleryCity(g, i18n.language);

      const matchSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        cityName.toLowerCase().includes(q);

      const matchCity = selectedCities.length === 0 || selectedCities.includes(g.city_en ?? '');
      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.some(s => s === "active" ? g.status : !g.status);
      const matchYear =
        selectedYears.length === 0 || selectedYears.includes(g.founding_year ?? "");
      const matchRating =
        minRating === 0 || (rMap.get(g.slug) ?? 0) >= minRating;

      return matchSearch && matchCity && matchStatus && matchYear && matchRating;
    });

    return filtered.sort((a, b) => {
      if (sort === "alphabetical") {
        const locale = i18n.language === 'uk' ? 'uk' : 'en';
        return getGalleryName(a, i18n.language).localeCompare(getGalleryName(b, i18n.language), locale);
      } else if (sort === "rating") {
        return (rMap.get(b.slug) ?? 0) - (rMap.get(a.slug) ?? 0);
      } else if (sort === "newest") {
        return Number(b.founding_year || 0) - Number(a.founding_year || 0);
      } else if (sort === "oldest") {
        return Number(a.founding_year || 9999) - Number(b.founding_year || 9999);
      }
      return 0;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleries, search, selectedCities, selectedStatuses, selectedYears, minRating, sort, i18n.language, needsRatings,
    // Stable signature derived from rating results — only re-runs when actual data changes
    ratingResults.map(r => r.dataUpdatedAt).join(','),
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCities([]);
    setSelectedStatuses([]);
    setSelectedYears([]);
    setMinRating(0);
    setPage(1);
  };

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(sortedAndFiltered.length / PER_PAGE);

  const visible = sortedAndFiltered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* ---------- HEADER ---------- */}
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <h1 className="text-5xl font-black uppercase tracking-tight">
            {t('galleries.title')} <span className="text-zinc-400">{t('galleries.subtitle')}</span>
          </h1>

          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t('galleries.search')}
              className="w-full h-[56px] rounded-2xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 pl-[52px] pr-6 text-[15px] outline-none focus:border-zinc-900 dark:focus:border-zinc-400 bg-white text-zinc-900 transition-colors"
            />
          </div>

          {/* FILTER & SORT BAR — all in one unified component */}
          <MultiFilterPanel
            cities={cities}
            years={years}
            selectedCities={selectedCities}
            selectedYears={selectedYears}
            selectedStatuses={selectedStatuses}
            minRating={minRating}
            sortValue={sort}
            sortOptions={[
              { value: "alphabetical", label: t('galleries.sortAlpha') },
              { value: "rating", label: t('galleries.sortByRating') },
              { value: "newest", label: t('galleries.sortNewest') },
              { value: "oldest", label: t('galleries.sortOldest') },
            ]}
            onCitiesChange={(v) => { setSelectedCities(v); setPage(1); }}
            onYearsChange={(v) => { setSelectedYears(v); setPage(1); }}
            onStatusesChange={(v) => { setSelectedStatuses(v); setPage(1); }}
            onMinRatingChange={(v) => { setMinRating(v); setPage(1); }}
            onSortChange={(v) => { setSort(v); setPage(1); }}
            onReset={resetFilters}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mb-10 text-xs uppercase tracking-widest text-zinc-400 font-bold">
        {t('common.found')}: {sortedAndFiltered.length}
      </div>

      {/* MAIN CONTENT */}
      {visible.length === 0 ? (
        <div className="max-w-xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <Search size={32} className="text-zinc-300" />
          </div>
          <h3 className="text-2xl font-black uppercase text-zinc-900 mb-2">{t('galleries.emptyTitle')}</h3>
          <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
            {t('galleries.emptyDesc')}
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            {t('galleries.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visible.map((gallery, index) => (
            <div
              key={gallery.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${Math.min(index * 100, 1000)}ms`, animationFillMode: 'forwards' }}
            >
              <GalleryCard
                gallery={gallery}
                favorite={isFavorite(gallery.slug)}
                onToggle={() =>
                  toggleFavorite({
                    id: gallery.slug,
                    name: getGalleryName(gallery, i18n.language),
                    slug: gallery.slug,
                  })
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-20 flex flex-wrap justify-center items-center gap-2 md:gap-4 px-6">
          <button
            disabled={page === 1}
            onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0); }}
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
            onClick={() => { setPage((p) => p + 1); window.scrollTo(0, 0); }}
            className="p-2 rounded-full border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- CARD ---------- */

const GalleryCard = ({
  gallery,
  favorite,
  onToggle,
}: {
  gallery: Gallery;
  favorite: boolean;
  onToggle: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const name = getGalleryName(gallery, i18n.language);
  const city = getGalleryCity(gallery, i18n.language);
  const address = getGalleryAddress(gallery, i18n.language);
  const { data: ratingData } = useGalleryRating(gallery.slug);

  return (
    <Link
      to={`/galleries/${gallery.slug}`}
      className="group block rounded-[28px] border border-zinc-200 bg-white p-8 hover:border-zinc-900 transition-all duration-300 h-full flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:shadow-none"
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black overflow-hidden">
            {gallery.image ? (
              <img src={gallery.image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{name && name.length > 0 ? name[0].toUpperCase() : '?'}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className={`transition-colors ${favorite
              ? "text-red-500 hover:text-red-600"
              : "text-zinc-300 hover:text-zinc-900"
              }`}
            aria-label="Toggle favorite"
          >
            <Heart size={18} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="font-black uppercase text-lg leading-tight mb-2">
          {name}
        </h3>

        <div className="space-y-1 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
            {city}
          </p>
          <p className="text-[11px] text-zinc-400 font-medium leading-tight">
            {address}
          </p>
        </div>

        {ratingData && ratingData.avgRating > 0 && (
          <div className="flex items-center gap-1.5 mb-4 animate-in fade-in duration-350">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.round(ratingData.avgRating);
                return (
                  <Star
                    key={star}
                    size={12}
                    className={filled ? "text-amber-400 fill-amber-400" : "text-zinc-200"}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-bold text-zinc-500">
              {ratingData.avgRating.toFixed(1)}
              {ratingData.reviewsCount > 0 && ` (${ratingData.reviewsCount})`}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${gallery.status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {gallery.status ? <BadgeCheck size={12} /> : <Ban size={12} />}
          {gallery.status ? t('gallery.active') : t('gallery.inactive')}
        </div>
      </div>
    </Link>
  );
};

export default GalleriesPage;
