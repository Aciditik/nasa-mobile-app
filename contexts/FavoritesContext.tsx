import { APOD } from "@/services/api.service";
import { backendService } from "@/services/backend.service";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: APOD[];
  isLoading: boolean;
  addFavorite: (apod: APOD) => Promise<void>;
  removeFavorite: (date: string) => Promise<void>;
  isFavorite: (date: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<APOD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      console.log("Loading favorites, isAuthenticated:", isAuthenticated);
      const savedFavorites = await backendService.favorites.getAll();
      console.log("Loaded favorites count:", savedFavorites.length);
      setFavorites(savedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (apod: APOD) => {
    try {
      await backendService.favorites.add({
        date: apod.date,
        title: apod.title,
        explanation: apod.explanation,
        url: apod.url,
        media_type: apod.media_type,
        hdurl: apod.hdurl,
        copyright: apod.copyright,
      });
      await loadFavorites();
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  const removeFavorite = async (date: string) => {
    try {
      await backendService.favorites.remove(date);
    } catch (error: any) {
      if (!error?.message?.includes("not found")) {
        console.error("Error removing favorite:", error);
      }
    } finally {
      await loadFavorites();
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

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
