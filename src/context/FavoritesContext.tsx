import React, { createContext, useContext, useEffect, useState } from "react";

type Favorite = {
  id: string;
  name: string;
  slug: string;
};

interface FavoritesContextType {
  favorites: Favorite[];
  toggleFavorite: (gallery: Favorite) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "ua-art-galleries-favorites";

// 🔑 СИНХРОННЕ ЗЧИТУВАННЯ (КЛЮЧ)
function loadInitialFavorites(): Favorite[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Favorite[]>(loadInitialFavorites);

  // 🔁 ЗБЕРІГАННЯ (без race condition)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = (gallery: Favorite) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === gallery.id);
      if (exists) {
        return prev.filter((f) => f.id !== gallery.id);
      }
      return [...prev, gallery];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
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
