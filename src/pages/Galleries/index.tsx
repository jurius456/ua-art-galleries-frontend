import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Building2,
  Heart,
  MapPin,
} from "lucide-react";

import { useFavorites } from "../../context/FavoritesContext";
import { useGalleriesQuery } from "../../hooks/useGalleriesQuery";
import type { Gallery } from "../../api/galleries";

const ITEMS_PER_PAGE = 18;

const GalleriesPage = () => {
  const { data: galleries = [], isLoading, error } = useGalleriesQuery();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("ALL");
  const [country, setCountry] = useState("ALL");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // 🔎 FILTER + SEARCH
  const filtered = useMemo(() => {
    return galleries.filter((g) => {
      const q = query.toLowerCase();

      const matchesQuery =
        g.name.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        (g.address?.toLowerCase().includes(q) ?? false) ||
        (g.country?.toLowerCase().includes(q) ?? false);

      const matchesCity = city === "ALL" || g.city === city;

      const matchesCountry =
        country === "ALL" ||
        (country === "UA" && g.country === "Ukraine") ||
        (country === "ABROAD" && g.country !== "Ukraine");

      return matchesQuery && matchesCity && matchesCountry;
    });
  }, [galleries, query, city, country]);

  // 🔢 PAGINATION
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // reset page on filters
  useEffect(() => {
    setPage(1);
  }, [query, city, country]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 font-black uppercase">
        Loading galleries…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-black uppercase">
        Failed to load galleries
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-700">
      {/* HEADER */}
      <section className="pt-20 pb-12 border-b border-zinc-100 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900">
            Каталог <span className="text-zinc-400">галерей</span>
          </h1>

          {/* SEARCH + FILTER */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук за назвою, містом, адресою…"
                className="w-full rounded-2xl border border-zinc-200 py-4 pl-14 pr-6 text-sm focus:border-zinc-900 outline-none"
              />
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest"
            >
              <Filter size={16} /> Фільтри
            </button>
          </div>

          {/* FILTERS */}
          {filtersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-zinc-200 rounded-2xl p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Країна
                </p>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                >
                  <option value="ALL">Усі</option>
                  <option value="UA">Україна</option>
                  <option value="ABROAD">За кордоном</option>
                </select>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Місто
                </p>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                >
                  <option value="ALL">Усі міста</option>
                  {[...new Set(galleries.map((g) => g.city))].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-10">
          Знайдено: {filtered.length}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((g) => {
            const active = isFavorite(g.id);

            return (
              <Link
                key={g.id}
                to={`/galleries/${g.slug}`}
                className="group relative rounded-3xl border border-zinc-200 bg-white p-7 hover:border-zinc-900 transition"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite({
                      id: g.id,
                      name: g.name,
                      slug: g.slug,
                    });
                  }}
                  className={`absolute top-6 right-6 ${
                    active
                      ? "text-red-500"
                      : "text-zinc-300 hover:text-zinc-800"
                  }`}
                >
                  <Heart size={18} fill={active ? "currentColor" : "none"} />
                </button>

                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
                  <Building2 size={20} className="text-zinc-600" />
                </div>

                <h3 className="text-sm font-black uppercase tracking-wide mb-2">
                  {g.name}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-bold uppercase">
                  <MapPin size={12} />
                  {g.city}
                </div>
              </Link>
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-black ${
                    page === p
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-300 text-zinc-600 hover:border-zinc-900"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default GalleriesPage;
