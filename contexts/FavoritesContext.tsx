import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/services/storage.service';
import { APOD } from '@/services/api.service';

interface FavoritesContextType {
  favorites: APOD[];
  isLoading: boolean;
  addFavorite: (apod: APOD) => Promise<void>;
  removeFavorite: (date: string) => Promise<void>;
  isFavorite: (date: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<APOD[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await storageService.getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (apod: APOD) => {
    try {
      await storageService.addFavorite(apod);
      setFavorites((prev) => [...prev, { ...apod, isFavorite: true }]);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (date: string) => {
    try {
      await storageService.removeFavorite(date);
      setFavorites((prev) => prev.filter((fav) => fav.date !== date));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (date: string): boolean => {
    return favorites.some((fav) => fav.date === date);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
