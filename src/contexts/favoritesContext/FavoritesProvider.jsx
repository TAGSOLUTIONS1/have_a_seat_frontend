import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { getFavorites } from "@/services/favoritesService";

const FavoritesContext = createContext({
  favorites: [],
  loading: false,
  refreshFavorites: () => {},
});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    // Fallback: return empty favorites if context not available
    return { favorites: [], loading: false, refreshFavorites: () => {} };
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { authState } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!authState?.isAuthenticated || !authState?.accessToken) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getFavorites(authState.accessToken);
      // API returns { favorites: [...], total_count: N }
      const favoritesData = response?.favorites || response?.data?.favorites || response?.data || [];
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [authState?.isAuthenticated, authState?.accessToken]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        refreshFavorites: fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

