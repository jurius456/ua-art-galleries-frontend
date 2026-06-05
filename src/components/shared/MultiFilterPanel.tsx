import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, Star, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option { value: string; label: string; }

interface CityOption { value: string; label: string; } // value = city_en (stable), label = translated

interface MultiFilterPanelProps {
  cities: CityOption[];
  years: string[];
  selectedCities: string[];
  selectedYears: string[];
  selectedStatuses: string[];
  minRating: number;
  sortValue: string;
  sortOptions: Option[];
  onCitiesChange: (v: string[]) => void;
  onYearsChange: (v: string[]) => void;
  onStatusesChange: (v: string[]) => void;
  onMinRatingChange: (v: number) => void;
  onSortChange: (v: string) => void;
  onReset: () => void;
}

function toggle(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

/* ── Sub-components ── */

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-150 whitespace-nowrap select-none
      ${active
        ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900'
      }`}
  >
    {label}
  </button>
);

const ActiveChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold text-zinc-700 whitespace-nowrap">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="w-4 h-4 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
    >
      <X size={9} />
    </button>
  </span>
);

const FilterSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">{label}</p>
    {children}
  </div>
);

/* ── Main component ── */

export const MultiFilterPanel = ({
  cities, years,
  selectedCities, selectedYears, selectedStatuses, minRating,
  sortValue, sortOptions,
  onCitiesChange, onYearsChange, onStatusesChange, onMinRatingChange, onSortChange,
  onReset,
}: MultiFilterPanelProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount =
    selectedCities.length + selectedYears.length + selectedStatuses.length + (minRating > 0 ? 1 : 0);
  const hasActive = activeCount > 0;
  const currentSortLabel = sortOptions.find(o => o.value === sortValue)?.label ?? '';

  return (
    <div className="space-y-3 w-full">

      {/* ══ Unified trigger bar ══ */}
      <div className={`flex items-center w-full h-[56px] rounded-2xl border bg-white transition-all duration-200
        ${open
          ? 'border-zinc-900 shadow-md'
          : 'border-zinc-200 hover:border-zinc-300'
        }`}
      >
        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-2 h-full pl-5 pr-4 shrink-0 font-bold text-sm transition-colors
            ${open ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          <SlidersHorizontal size={15} />
          <span>{t('galleries.filters')}</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 rounded-full text-[10px] font-black flex items-center justify-center px-1.5 bg-zinc-900 text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-200 shrink-0" />

        {/* Active chips — horizontally scrollable */}
        <div className="flex-1 flex items-center gap-2 px-3 overflow-x-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {hasActive ? (
            <>
              {selectedCities.map(c => {
                const label = cities.find(o => o.value === c)?.label ?? c;
                return (
                  <ActiveChip key={`c-${c}`} label={label} onRemove={() => onCitiesChange(toggle(selectedCities, c))} />
                );
              })}
              {selectedStatuses.map(s => (
                <ActiveChip
                  key={`s-${s}`}
                  label={s === 'active' ? t('gallery.active') : t('gallery.inactive')}
                  onRemove={() => onStatusesChange(toggle(selectedStatuses, s))}
                />
              ))}
              {selectedYears.map(y => (
                <ActiveChip key={`y-${y}`} label={y} onRemove={() => onYearsChange(toggle(selectedYears, y))} />
              ))}
              {minRating > 0 && (
                <ActiveChip label={`★ ${minRating}+`} onRemove={() => onMinRatingChange(0)} />
              )}
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors whitespace-nowrap border-b border-dashed border-zinc-300 hover:border-zinc-900 pb-px ml-1 shrink-0"
              >
                {t('galleries.clearAll')}
              </button>
            </>
          ) : (
            <span className="text-[12px] text-zinc-300 select-none">
              {t('galleries.noActiveFilters', 'Фільтри не застосовано')}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-200 shrink-0" />

        {/* Inline sort */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center gap-2 h-full px-5 text-[12px] font-bold text-zinc-600 hover:text-zinc-900 transition-colors whitespace-nowrap"
          >
            <ArrowUpDown size={13} className="text-zinc-400" />
            <span>{currentSortLabel}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl py-2 z-50 w-52 animate-in fade-in zoom-in-95 duration-150">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onSortChange(opt.value); setSortOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 text-[12px] font-bold transition-colors flex items-center justify-between
                    ${opt.value === sortValue
                      ? 'text-zinc-900 bg-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                >
                  {opt.label}
                  {opt.value === sortValue && <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ Expandable filter panel ══ */}
      {open && (
        <div className="rounded-[28px] border border-zinc-100 bg-white shadow-[0_12px_48px_rgb(0,0,0,0.07)] p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Cities */}
          {cities.length > 0 && (
            <FilterSection label={t('galleries.cityFilter')}>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <Chip key={c.value} label={c.label} active={selectedCities.includes(c.value)} onClick={() => onCitiesChange(toggle(selectedCities, c.value))} />
                ))}
              </div>
            </FilterSection>
          )}

          {/* Status + Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-50">
            <FilterSection label={t('galleries.statusFilter')}>
              <div className="flex flex-wrap gap-2">
                {(['active', 'inactive'] as const).map(s => (
                  <Chip
                    key={s}
                    label={s === 'active' ? t('gallery.active') : t('gallery.inactive')}
                    active={selectedStatuses.includes(s)}
                    onClick={() => onStatusesChange(toggle(selectedStatuses, s))}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection label={t('galleries.minRating')}>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = star <= (hoveredStar || minRating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onMinRatingChange(minRating === star ? 0 : star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95 duration-100"
                    >
                      <Star
                        size={26}
                        className={`transition-colors duration-100 ${active ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-100'}`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-[11px] font-bold text-zinc-400">
                  {minRating > 0 ? `${minRating}+` : t('galleries.anyRating')}
                </span>
              </div>
            </FilterSection>
          </div>

          {/* Years */}
          {years.length > 0 && (
            <div className="pt-6 border-t border-zinc-50">
              <FilterSection label={t('galleries.yearFilter')}>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {years.map(y => (
                    <Chip key={y} label={y} active={selectedYears.includes(y)} onClick={() => onYearsChange(toggle(selectedYears, y))} />
                  ))}
                </div>
              </FilterSection>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
