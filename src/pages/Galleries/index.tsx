import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, MapPin, Filter, ArrowRight, LayoutGrid, 
  Tag, Sparkles, X, Heart, Ticket 
} from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext"; 

// Типи даних для твоєї бази галерей
export type GalleryType = "Contemporary" | "Classic" | "Photo" | "Mix";

export interface Gallery {
  id: number;
  slug: string;
  name: string;
  city: string;
  description: string;
  tags: string[];
  type: GalleryType;
  price: "Free" | "Paid";
  hasCoffee: boolean;
}

// Твої локальні дані для каталогу
export const MOCK_GALLERIES: Gallery[] = [
  { id: 1, slug: 'halereya-kuznya', name: 'Галерея Кузня', city: 'Київ', description: 'Сучасне мистецтво Києва, що поєднує метал та дух.', tags: ['Метал', 'Скульптура'], type: "Contemporary", price: "Free", hasCoffee: true },
  { id: 2, slug: 'pinchuk-art-centre', name: 'PinchukArtCentre', city: 'Київ', description: 'Один з найбільших центрів сучасного мистецтва в Європі.', tags: ['Експериментальне'], type: "Contemporary", price: "Free", hasCoffee: true },
  { id: 3, slug: 'the-naked-room', name: 'The Naked Room', city: 'Київ', description: 'Простір, де мистецтво стає частиною щоденного життя.', tags: ['Графіка'], type: "Photo", price: "Paid", hasCoffee: true },
  { id: 4, slug: 'art-svit', name: 'Арт-центр Світ', city: 'Львів', description: 'Львівська школа живопису та нові медіа.', tags: ['Живопис'], type: "Classic", price: "Paid", hasCoffee: false },
  { id: 5, slug: 'museum-ssm', name: 'Музей ССМ', city: 'Одеса', description: 'Широкий спектр мистецтва південного регіону.', tags: ['Музей'], type: "Classic", price: "Paid", hasCoffee: false },
  { id: 6, slug: 'ya-gallery', name: 'Я Галерея', city: 'Львів', description: 'Проєкт Павла Гудімова про українське візуальне мистецтво.', tags: ['Проєкт'], type: "Mix", price: "Free", hasCoffee: true },
];

const GalleriesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Усі міста");
  const [selectedType, setSelectedType] = useState<string>("Усі типи");
  const [onlyFree, setOnlyFree] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Логіка фільтрації
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
    <div className="min-h-screen bg-transparent pb-32 animate-in fade-in duration-700">
      {/* Секція пошуку та фільтрів */}
      <section className="bg-white/40 backdrop-blur-md border-b border-zinc-200/50 pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-blue-600">
              <Sparkles size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Explore Ukraine Art</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-zinc-800 tracking-tighter uppercase leading-[0.85]">
              Каталог <br /> <span className="text-zinc-400">Галерей</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
              <input 
                type="text" 
                placeholder="Пошук локації або напрямку..."
                className="w-full bg-white border border-zinc-200 rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-zinc-800 transition-all text-base font-medium shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                isFilterOpen ? "bg-zinc-800 text-white border-zinc-800 shadow-xl" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <Filter size={16} /> {isFilterOpen ? "Закрити" : "Фільтри"}
            </button>
          </div>

          {/* Панель фільтрів */}
          {isFilterOpen && (
            <div className="p-10 bg-white/90 backdrop-blur-xl border border-zinc-100 rounded-[40px] shadow-2xl animate-in slide-in-from-top-4 duration-500 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Локація</p>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 text-sm font-bold outline-none cursor-pointer"
                >
                  {["Усі міста", "Київ", "Львів", "Одеса"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Напрямок</p>
                <div className="flex flex-wrap gap-2">
                  {["Усі типи", "Contemporary", "Classic", "Photo", "Mix"].map(t => (
                    <button key={t} onClick={() => setSelectedType(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedType === t ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Вхід</p>
                <button onClick={() => setOnlyFree(!onlyFree)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${onlyFree ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-zinc-100 text-zinc-400"}`}>
                  <span className="text-xs font-black uppercase">Free Entry Only</span>
                  {onlyFree ? <X size={14} /> : <Ticket size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Сітка з галереями */}
      <section className="container mx-auto px-6 max-w-6xl mt-20">
        <div className="flex items-center gap-3 text-zinc-600 font-black text-[11px] uppercase tracking-[0.3em] mb-12">
          <LayoutGrid size={16} /> Знайдено: {filtered.length} локацій
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map(g => <EnhancedGalleryCard key={g.id} gallery={g} />)}
        </div>
      </section>
    </div>
  );
};

const EnhancedGalleryCard = ({ gallery }: { gallery: Gallery }) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  // ВИПРАВЛЕНО: Тепер перевіряємо і за ID, і за Назвою. 
  // Це синхронізує моки з реальною базою Django.
  const active = isFavorite(gallery.id, gallery.name);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Передаємо об'єкт для збереження в Django
    const galleryData = {
      id: gallery.id,
      name: gallery.name, // Це піде як name_ua
      slug: gallery.slug, // Це піде як name_en
    };
    
    toggleFavorite(galleryData);
  };

  return (
    <div className="group relative h-full">
      {/* Кнопка сердечка — тепер вона 100% реагуватиме на стейт */}
      <button 
        type="button"
        onClick={handleToggle}
        className={`absolute top-10 right-10 z-50 p-3 rounded-full transition-all duration-500 transform active:scale-95 ${
          active 
            ? 'text-red-500 bg-red-50 scale-110 shadow-lg shadow-red-100' 
            : 'text-zinc-200 hover:text-red-400 bg-zinc-50 hover:bg-white hover:shadow-xl'
        }`}
      >
        <Heart 
          size={20} 
          fill={active ? "currentColor" : "none"} 
          className="pointer-events-none" 
        />
      </button>

      {/* Картка-посилання */}
      <Link 
        to={`/galleries/${gallery.slug}`}
        className="flex flex-col h-full bg-white border border-zinc-100 rounded-[40px] p-10 hover:shadow-2xl transition-all duration-700 overflow-hidden"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 bg-zinc-800 text-white rounded-[20px] flex items-center justify-center text-2xl font-black group-hover:bg-blue-600 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-6">
            {gallery.name[0]}
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="flex-grow space-y-4">
          <h3 className="text-2xl font-black tracking-tighter text-zinc-800 group-hover:text-blue-600 transition-colors uppercase leading-none">
            {gallery.name}
          </h3>
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            <MapPin size={12} /> {gallery.city}
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium line-clamp-2">
            {gallery.description}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {gallery.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
            {gallery.type}
          </span>
          <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:translate-x-2 shadow-lg shadow-zinc-200">
            <ArrowRight size={20} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GalleriesPage;