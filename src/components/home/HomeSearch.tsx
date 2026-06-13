import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { getGalleryName, getGalleryCity } from "../../utils/gallery";

const HomeSearch = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Typewriter effect
  const placeholders = [
    "PinchukArtCentre",
    "Nationale Art Museum",
    "The Naked Room",
    "Voloshyn Gallery",
    "Ya Gallery",
    "M17 Art Center",
    "Gudimov Art Project"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = placeholders[placeholderIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.substring(0, currentText.length + 1));
        } else {
          // Pause at the end of word
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, placeholderIndex, placeholders]);

  const { galleries, hasResults } = useGlobalSearch(searchQuery);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSearchResults = searchQuery.length >= 2 && searchOpen;

  return (
    <div className="container mx-auto px-4 md:px-6 relative z-40 -mt-10 mb-20" ref={searchRef}>
      <div className="max-w-3xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 rounded-[32px] animate-fade-in-up delay-300 border border-zinc-200/60 bg-white">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder={searchQuery ? "" : `${t('header.search')} ${currentText}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full bg-transparent rounded-[32px] pl-[64px] pr-6 py-5 text-[15px] font-medium outline-none placeholder:text-zinc-400 text-zinc-900 focus:bg-white transition-all"
          />

          {showSearchResults && (
            <div className="absolute top-[calc(100%+16px)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-zinc-100 rounded-[32px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300 transform-gpu">
              {!hasResults ? (
                <div className="px-6 py-10 text-center text-sm text-zinc-400 font-medium">
                  {t('header.noResults')}
                </div>
              ) : (
                <div className="py-4 max-h-[400px] overflow-y-auto">
                  {galleries.length > 0 && (
                    <div>
                      <div className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {t('nav.galleries')}
                      </div>
                      {galleries.map((g) => {
                        const name = getGalleryName(g, i18n.language);
                        const city = getGalleryCity(g, i18n.language);
                        return (
                          <Link
                            key={g.id}
                            to={`/galleries/${g.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-lg font-black shrink-0">
                              {name && name.length > 0 ? name[0].toUpperCase() : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-base font-bold text-zinc-900 truncate">{name}</p>
                                {(() => {
                                  const avgRating = g.average_rating ?? g.rating_avg ?? g.avg_rating ?? g.rating;
                                  if (avgRating === undefined || avgRating === null || Number(avgRating) <= 0) return null;
                                  return (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                                      <Star size={10} className="fill-amber-400 text-amber-400" />
                                      {Number(avgRating).toFixed(1)}
                                    </span>
                                  );
                                })()}
                              </div>
                              <p className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                                <MapPin size={12} /> {city}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}



                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;
