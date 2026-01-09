import React, { createContext, useContext, useState, useEffect } from "react";

interface Gallery {
  id: number;
  name_ua: string;
  name_en: string;
  image?: string;
}

interface FavoritesContextType {
  favorites: number[]; 
  galleryItems: Gallery[];
  toggleFavorite: (gallery: any) => Promise<void>;
  isFavorite: (galleryId: number, galleryName?: string) => boolean;
  loading: boolean;
}

const API_URL = "http://localhost:8000/api/galleries/";
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Завантаження даних при старті
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data: Gallery[] = await response.json();
          setGalleryItems(data);
          // Зберігаємо ID з бази
          setFavorites(data.map((item) => item.id));
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // 2. Гнучка перевірка "Обраного"
  const isFavorite = (galleryId: number, galleryName?: string) => {
    // Перевіряємо або за ID (якщо воно з бази), 
    // або за назвою (якщо це локальний мок)
    return galleryItems.some(item => 
      item.id === galleryId || (galleryName && item.name_ua === galleryName)
    );
  };

  const toggleFavorite = async (gallery: any) => {
    const galleryName = gallery.name || gallery.name_ua;
    
    // Шукаємо, чи є вже така галерея в базі (за назвою)
    const existingInDb = galleryItems.find(item => item.name_ua === galleryName);

    if (existingInDb) {
      // ВИДАЛЕННЯ: використовуємо ID саме з бази даних
      try {
        const response = await fetch(`${API_URL}${existingInDb.id}/`, { method: "DELETE" });
        if (response.ok) {
          setFavorites(prev => prev.filter(id => id !== existingInDb.id));
          setGalleryItems(prev => prev.filter(item => item.id !== existingInDb.id));
        }
      } catch (error) {
        console.error("Помилка видалення:", error);
      }
    } else {
      // ДОДАВАННЯ
      const payload = {
        name_ua: galleryName,
        name_en: gallery.slug || gallery.name_en,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newGallery = await response.json();
          // Оновлюємо стейт новими даними з бази
          setFavorites(prev => [...prev, newGallery.id]);
          setGalleryItems(prev => [...prev, newGallery]);
        }
      } catch (error) {
        console.error("Помилка мережі:", error);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, galleryItems, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};