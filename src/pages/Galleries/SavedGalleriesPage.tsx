import { Link } from "react-router-dom";
import { ArrowRight, Trash2, BookmarkX } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

// ВИПРАВЛЕНО: Використовуємо 'type' для Gallery та перевіряємо шлях
import { MOCK_GALLERIES, type Gallery } from "../Galleries";

const SavedGalleriesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();

  // ВИПРАВЛЕНО: Додано тип (g: Gallery), щоб прибрати помилку "implicit any"
  const savedItems = MOCK_GALLERIES.filter((g: Gallery) => favorites.includes(g.id));

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 space-y-8">
        
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Персональна колекція</p>
          <h2 className="text-xl font-bold text-black uppercase tracking-tight">Мій Архів</h2>
        </section>

        {savedItems.length > 0 ? (
          <div className="space-y-3">
            {savedItems.map((g: Gallery) => (
              <div key={g.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
                <Link to={`/galleries/${g.slug}`} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-sm">
                    {g.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black leading-tight uppercase tracking-tight">{g.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{g.city}</p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleFavorite(g.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Link 
                    to={`/galleries/${g.slug}`}
                    className="p-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <BookmarkX size={24} />
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Архів порожній</p>
            <Link to="/galleries" className="inline-block text-[10px] font-black uppercase tracking-widest text-blue-600 pt-2 hover:underline">
              До каталогу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedGalleriesPage;