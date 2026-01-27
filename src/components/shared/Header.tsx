import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { useEffect, useRef, useState } from "react";
import { User, Settings, LogOut, ChevronDown, Search, Bookmark, MapPin, Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const { galleries, events, hasResults } = useGlobalSearch(searchQuery);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Показуємо dropdown коли є запит та результати
  const showSearchResults = searchQuery.length >= 2 && searchOpen;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-6 h-[76px] flex items-center justify-between">
        {/* 1. ЛІВА ЧАСТИНА: Лого */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="text-xl font-bold text-neutral-900 hover:text-neutral-600 transition tracking-tight"
          >
            UA Galleries
          </Link>
        </div>

        {/* 2. ЦЕНТРАЛЬНА ЧАСТИНА: Навігація */}
        <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-500 flex-initial">
          <Link to="/about" className="hover:text-black transition">{t('nav.about')}</Link>
          <Link to="/galleries" className="hover:text-black transition">{t('nav.galleries')}</Link>
          <Link to="/events" className="hover:text-black transition">{t('nav.events')}</Link>
        </nav>

        {/* 3. ПРАВА ЧАСТИНА: Пошук + Авторизація + Мова */}
        <div className="flex-1 flex items-center gap-4 justify-end">
          <div className="relative group hidden md:block max-w-[240px] w-full" ref={searchRef}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors z-10">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full bg-white border border-gray-50 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold outline-none placeholder:text-gray-400 text-neutral-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] focus:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.12)] transition-shadow"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {!hasResults ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400 font-medium">
                    {t('header.noResults')}
                  </div>
                ) : (
                  <div className="py-2 max-h-[360px] overflow-y-auto">
                    {/* Галереї */}
                    {galleries.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                          {t('nav.galleries')}
                        </div>
                        {galleries.map((g) => (
                          <Link
                            key={g.id}
                            to={`/galleries/${g.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-bold">
                              {g.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-zinc-800 truncate">{g.name}</p>
                              <p className="flex items-center gap-1 text-[10px] text-gray-400">
                                <MapPin size={10} /> {g.city}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Події */}
                    {events.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-50 mt-2 pt-3">
                          {t('nav.events')}
                        </div>
                        {events.map((e) => (
                          <Link
                            key={e.id}
                            to={`/events/${e.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                              <Calendar size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-zinc-800 truncate">{e.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">{e.galleryName}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            {isLoading ? null : user ? (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all border border-gray-50 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] ${open ? "bg-gray-100 shadow-inner" : "bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ring-2 ring-white">
                    {(user.first_name || user.username)[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-neutral-800 hidden lg:block tracking-tight">
                    {user.first_name || user.username}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-white/95 backdrop-blur-2xl border border-gray-50 rounded-[24px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] py-3 animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                    <div className="px-5 py-3 mb-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">{t('header.account')}</p>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-black truncate leading-tight">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate">{user.email}</span>
                      </div>
                    </div>

                    <div className="px-2 space-y-1">
                      <MenuLink
                        to="/profile"
                        icon={<User size={18} strokeWidth={1.5} />}
                        label={t('header.profile')}
                        onClick={() => setOpen(false)}
                      />
                      {/* НОВА КНОПКА */}
                      <MenuLink
                        to="/settings/archive"
                        icon={<Bookmark size={18} strokeWidth={1.5} />}
                        label={t('header.savedGalleries')}
                        onClick={() => setOpen(false)}
                      />
                      <MenuLink
                        to="/settings"
                        icon={<Settings size={18} strokeWidth={1.5} />}
                        label={t('header.settings')}
                        onClick={() => setOpen(false)}
                      />
                    </div>

                    <div className="mx-5 my-3 border-t border-gray-50" />

                    <div className="px-2">
                      <button
                        onClick={() => { logout(); setOpen(false); }}
                        className="w-full group flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-all duration-300 font-semibold"
                      >
                        <LogOut size={18} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                        {t('header.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl text-zinc-800 bg-transparent border border-zinc-300 hover:border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300"
              >
                {t('header.login')}
              </Link>
            )}
          </div>

          {/* Перемикач мови в кінці */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

interface MenuLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuLink = ({ to, icon, label, onClick }: MenuLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-2xl transition-all duration-300 font-semibold"
  >
    <span className="text-gray-400 group-hover:text-black transition-colors">{icon}</span>
    <span className="font-semibold tracking-tight">{label}</span>
  </Link>
);

export default Header;