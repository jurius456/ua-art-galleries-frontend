import { useState, useMemo } from "react";
import { 
  Search, MapPin, Filter, ArrowRight, LayoutGrid, 
  ChevronDown, Coffee, Ticket 
} from "lucide-react";

export type GalleryType = "Contemporary" | "Classic" | "Photo" | "Mix";

export interface Gallery {
  id: number;
  name: string;
  city: string;
  description: string;
  tags: string[];
  type: GalleryType;
  price: "Free" | "Paid";
  hasCoffee: boolean;
}

const MOCK_GALLERIES: Gallery[] = [
  { id: 1, name: 'Галерея Кузня', city: 'Київ', description: 'Сучасне мистецтво Києва, що поєднує метал та дух.', tags: ['Метал', 'Скульптура'], type: "Contemporary", price: "Free", hasCoffee: true },
  { id: 2, name: 'PinchukArtCentre', city: 'Київ', description: 'Один з найбільших центрів сучасного мистецтва в Європі.', tags: ['Експериментальне'], type: "Contemporary", price: "Free", hasCoffee: true },
  { id: 3, name: 'The Naked Room', city: 'Київ', description: 'Простір, де мистецтво стає частиною щоденного життя.', tags: ['Графіка'], type: "Photo", price: "Paid", hasCoffee: true },
  { id: 4, name: 'Арт-центр Світ', city: 'Львів', description: 'Львівська школа живопису та нові медіа.', tags: ['Живопис'], type: "Classic", price: "Paid", hasCoffee: false },
  { id: 5, name: 'Музей ССМ', city: 'Одеса', description: 'Широкий спектр мистецтва південного регіону.', tags: ['Музей'], type: "Classic", price: "Paid", hasCoffee: false },
  { id: 6, name: 'Я Галерея', city: 'Львів', description: 'Проєкт Павла Гудімова про українське візуальне мистецтво.', tags: ['Кураторський проєкт'], type: "Mix", price: "Free", hasCoffee: true },
];

const GalleriesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Усі міста");
  const [selectedType, setSelectedType] = useState<string>("Усі типи");
  const [onlyFree, setOnlyFree] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_GALLERIES.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                            g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCity = selectedCity === "Усі міста" || g.city === selectedCity;
      const matchesType = selectedType === "Усі типи" || g.type === selectedType;
      const matchesFree = !onlyFree || g.price === "Free";
      return matchesSearch && matchesCity && matchesType && matchesFree;
    });
  }, [search, selectedCity, selectedType, onlyFree]);

  return (
    <div className="min-h-screen bg-white pb-24 animate-in fade-in duration-700">
      <section className="bg-zinc-50 border-b border-zinc-100 py-16">
        <div className="container mx-auto px-6 space-y-10">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Навігатор</p>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase">Каталог</h1>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  placeholder="Пошук галереї або напрямку..."
                  className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-zinc-900 transition-all text-sm font-bold shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold transition-all border ${
                  isFilterOpen ? "bg-zinc-900 text-white border-zinc-900 shadow-xl" : "bg-white text-zinc-900 border-zinc-200 shadow-sm hover:bg-zinc-50"
                }`}
              >
                <Filter size={18} />
                Фільтри
                <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {isFilterOpen && (
              <div className="p-8 bg-white border border-zinc-100 rounded-[32px] shadow-2xl animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 md:grid-cols-3 gap-10">
                <FilterGroup label="Місто">
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-zinc-50 border-none rounded-xl p-3 text-sm font-bold outline-none cursor-pointer"
                  >
                    {["Усі міста", "Київ", "Львів", "Одеса"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FilterGroup>

                <FilterGroup label="Напрямок">
                  <div className="flex flex-wrap gap-2">
                    {["Усі типи", "Contemporary", "Classic", "Photo", "Mix"].map(t => (
                      <button 
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                          selectedType === t ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup label="Додатково">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={onlyFree} 
                      onChange={() => setOnlyFree(!onlyFree)}
                      className="w-5 h-5 rounded-lg border-zinc-200 text-zinc-900 focus:ring-0 transition-all cursor-pointer"
                    />
                    <span className="text-sm font-bold text-zinc-600 group-hover:text-black">Тільки безкоштовний вхід</span>
                  </label>
                </FilterGroup>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-16">
        <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest mb-10">
          <LayoutGrid size={14} /> Знайдено {filtered.length} локацій
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map(g => (
            <EnhancedGalleryCard key={g.id} gallery={g} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-[40px]">
             <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Нічого не знайдено</p>
          </div>
        )}
      </section>
    </div>
  );
};

const FilterGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
    {children}
  </div>
);

const EnhancedGalleryCard = ({ gallery }: { gallery: Gallery }) => (
  <div className="group bg-white border border-zinc-100 rounded-[32px] p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full">
    <div className="relative z-10 space-y-6">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-zinc-200 group-hover:rotate-6 transition-transform">
          {gallery.name[0]}
        </div>
        <div className="flex gap-2 bg-zinc-50 p-2 rounded-xl">
          {gallery.price === "Free" && (
            <span title="Безкоштовно">
              <Ticket size={16} className="text-green-500" />
            </span>
          )}
          {gallery.hasCoffee && (
            <span title="Є кав'ярня">
              <Coffee size={16} className="text-orange-400" />
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">{gallery.name}</h3>
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
          <MapPin size={12} /> {gallery.city}
        </div>
      </div>

      <p className="text-sm text-zinc-500 leading-relaxed font-medium line-clamp-2">
        {gallery.description}
      </p>
    </div>

    <div className="pt-6 mt-6 flex items-center justify-between border-t border-zinc-50 relative z-10">
      <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-1 rounded">
        {gallery.type}
      </span>
      <ArrowRight size={20} className="text-zinc-200 group-hover:text-zinc-900 group-hover:translate-x-2 transition-all" />
    </div>
  </div>
);

export default GalleriesPage;