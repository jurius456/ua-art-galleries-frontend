import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleriesQuery } from "../../hooks/useGalleriesQuery";
import { useFavorites } from "../../context/FavoritesContext";
import type { Gallery } from "../../api/galleries";
import { useTranslation } from 'react-i18next';

const PER_PAGE = 18;

const GalleriesPage = () => {
  const { t } = useTranslation();
  const { data: galleries = [], isLoading } = useGalleriesQuery();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [page, setPage] = useState(1);

  /* ---------- CITIES ---------- */
  const cities = useMemo(() => {
    const unique = Array.from(
      new Set(galleries.map((g) => g.city).filter(Boolean))
    );
    return unique;
  }, [galleries]);

  /* ---------- FILTERING ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return galleries.filter((g) => {
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q);

      const matchCity = city === "all" || g.city === city;

      return matchSearch && matchCity;
    });
  }, [galleries, search, city]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const visible = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 font-semibold">
        {t('galleries.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* ---------- HEADER ---------- */}
      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <h1 className="text-5xl font-black uppercase tracking-tight">
            {t('galleries.title')} <span className="text-zinc-400">{t('galleries.subtitle')}</span>
          </h1>

          {/* SEARCH + CITY */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* SEARCH */}
            <div className="relative flex-1">
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
                className="
                  w-full
                  h-[56px]
                  rounded-2xl
                  border
                  border-zinc-200
                  pl-[52px]
                  pr-6
                  text-[15px]
                  outline-none
                  focus:border-zinc-900
                "
              />
            </div>

            {/* CITY */}
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="
                h-[56px]
                rounded-2xl
                border
                border-zinc-200
                px-5
                text-sm
                font-semibold
                outline-none
                focus:border-zinc-900
              "
            >
              <option value="all">{t('galleries.allCities')}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="max-w-6xl mx-auto px-6 mb-10 text-xs uppercase tracking-widest text-zinc-400 font-bold">
        {t('common.found')}: {filtered.length}
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visible.map((gallery) => (
          <GalleryCard
            key={gallery.id}
            gallery={gallery}
            favorite={isFavorite(gallery.id)}
            onToggle={() =>
              toggleFavorite({
                id: gallery.id,
                name: gallery.name,
                slug: gallery.slug,
              })
            }
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-full border disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-xl font-bold ${page === i + 1
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-full border disabled:opacity-30"
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
  return (
    <Link
      to={`/galleries/${gallery.slug}`}
      className="group block rounded-[28px] border border-zinc-200 bg-white p-8 hover:border-zinc-900 transition"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black">
          {gallery.name[0]}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className={`transition ${favorite
              ? "text-red-500"
              : "text-zinc-300 hover:text-zinc-900"
            }`}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="font-black uppercase text-lg leading-tight">
        {gallery.name}
      </h3>

      <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400">
        {gallery.city}
      </p>
    </Link>
  );
};

export default GalleriesPage;
