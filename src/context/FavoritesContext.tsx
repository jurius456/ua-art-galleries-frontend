import React, { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, toggleFavorite as toggleFavoriteAPI } from "../api/favorites";
import { useAuth } from "./AuthContext";

type Favorite = {
  id: string;
  name: string;
  slug: string;
};

interface FavoritesContextType {
  favorites: Favorite[];
  toggleFavorite: (gallery: Favorite) => void;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Завантажити улюблені галереї при монтуванні або зміні користувача
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      // Очистити улюблені якщо користувач вийшов
      setFavorites([]);
      setFavoriteSlugs([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const slugs = await getFavorites();
      setFavoriteSlugs(slugs);
      // Конвертуємо slugs у Favorite об'єкти (тимчасово)
      const favs = slugs.map(slug => ({
        id: slug,
        slug: slug,
        name: slug
      }));
      setFavorites(favs);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (id: string) => {
    return favoriteSlugs.includes(id);
  };

  const toggleFavorite = async (gallery: Favorite) => {
    if (!user) {
      // Якщо користувач не авторизований, нічого не робимо
      console.warn("User must be logged in to save favorites");
      return;
    }

    try {
      const result = await toggleFavoriteAPI(gallery.slug);

      // Оновити локальний стан
      if (result.is_favorite) {
        setFavorites(prev => [...prev, gallery]);
        setFavoriteSlugs(prev => [...prev, gallery.slug]);
      } else {
        setFavorites(prev => prev.filter(f => f.slug !== gallery.slug));
        setFavoriteSlugs(prev => prev.filter(s => s !== gallery.slug));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, isLoading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};
