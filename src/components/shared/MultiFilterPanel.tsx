import { useState } from 'react';
import { SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MultiFilterPanelProps {
  cities: string[];
  years: string[];
  selectedCities: string[];
  selectedYears: string[];
  selectedStatuses: string[];
  minRating: number;
  onCitiesChange: (v: string[]) => void;
  onYearsChange: (v: string[]) => void;
  onStatusesChange: (v: string[]) => void;
  onMinRatingChange: (v: number) => void;
  onReset: () => void;
}

function toggle(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-150 whitespace-nowrap select-none
      ${active
        ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm scale-[1.02]'
        : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 hover:scale-[1.01]'
      }`}
  >
    {label}
  </button>
);

const ActiveChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold text-zinc-700">
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

export const MultiFilterPanel = ({
  cities,
  years,
  selectedCities,
  selectedYears,
  selectedStatuses,
  minRating,
  onCitiesChange,
  onYearsChange,
  onStatusesChange,
  onMinRatingChange,
  onReset,
}: MultiFilterPanelProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const activeCount =
    selectedCities.length +
    selectedYears.length +
    selectedStatuses.length +
    (minRating > 0 ? 1 : 0);

  const hasActive = activeCount > 0;

  return (
    <div className="space-y-3 w-full">
      {/* ── Trigger row ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-2 h-[56px] px-5 rounded-2xl border font-bold text-sm transition-all duration-200 shrink-0
            ${open
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
              : hasActive
                ? 'border-zinc-900 bg-white text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
            }`}
        >
          <SlidersHorizontal size={15} />
          <span>{t('galleries.filters')}</span>
          {activeCount > 0 && (
            <span className={`min-w-[20px] h-5 rounded-full text-[10px] font-black flex items-center justify-center px-1.5
              ${open ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Active filter chips inline */}
        {hasActive && (
          <>
            {selectedCities.map(c => (
              <ActiveChip key={`city-${c}`} label={c} onRemove={() => onCitiesChange(toggle(selectedCities, c))} />
            ))}
            {selectedStatuses.map(s => (
              <ActiveChip
                key={`status-${s}`}
                label={s === 'active' ? t('gallery.active') : t('gallery.inactive')}
                onRemove={() => onStatusesChange(toggle(selectedStatuses, s))}
              />
            ))}
            {selectedYears.map(y => (
              <ActiveChip key={`year-${y}`} label={y} onRemove={() => onYearsChange(toggle(selectedYears, y))} />
            ))}
            {minRating > 0 && (
              <ActiveChip label={`★ ${minRating}+`} onRemove={() => onMinRatingChange(0)} />
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors border-b border-dashed border-zinc-300 hover:border-zinc-900 pb-px ml-1"
            >
              {t('galleries.clearAll')}
            </button>
          </>
        )}
      </div>

      {/* ── Expandable filter panel ── */}
      {open && (
        <div className="rounded-[28px] border border-zinc-100 bg-white shadow-[0_12px_48px_rgb(0,0,0,0.07)] p-7 space-y-7 animate-in fade-in slide-in-from-top-2 duration-200">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* Cities */}
            {cities.length > 0 && (
              <FilterSection label={t('galleries.cityFilter')}>
                <div className="flex flex-wrap gap-2">
                  {cities.map(c => (
                    <Chip
                      key={c}
                      label={c}
                      active={selectedCities.includes(c)}
                      onClick={() => onCitiesChange(toggle(selectedCities, c))}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Status */}
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

          </div>

          {/* Rating */}
          <div className="border-t border-zinc-50 pt-6">
            <FilterSection label={t('galleries.minRating')}>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = star <= (hoveredStar || minRating);
                  const selected = star <= minRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onMinRatingChange(minRating === star ? 0 : star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95 duration-100"
                      aria-label={`${star} stars minimum`}
                    >
                      <Star
                        size={30}
                        className={`transition-colors duration-100 ${
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-200 fill-zinc-100'
                        } ${selected ? 'drop-shadow-sm' : ''}`}
                      />
                    </button>
                  );
                })}
                {minRating > 0 && (
                  <span className="ml-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    {minRating}+ ★
                  </span>
                )}
                {minRating === 0 && (
                  <span className="ml-3 text-[11px] font-medium text-zinc-300 uppercase tracking-widest">
                    {t('galleries.anyRating')}
                  </span>
                )}
              </div>
            </FilterSection>
          </div>

          {/* Years */}
          {years.length > 0 && (
            <div className="border-t border-zinc-50 pt-6">
              <FilterSection label={t('galleries.yearFilter')}>
                <div className="flex flex-wrap gap-2 max-h-[88px] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {years.map(y => (
                    <Chip
                      key={y}
                      label={y}
                      active={selectedYears.includes(y)}
                      onClick={() => onYearsChange(toggle(selectedYears, y))}
                    />
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
