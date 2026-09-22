import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useFavorites } from "@/contexts/favoritesContext/FavoritesProvider";
import { addToFavorites, removeFromFavorites } from "@/services/favoritesService";
import { useToast } from "@/components/ui/use-toast";

const FavoriteButton = ({ 
  restaurantAlias, 
  restaurantType, 
  size = 24, 
  className = "",
  onToggle = null,
  favoritesList = null, // Optional: override with custom favorites list
  onFavoriteChange = null // Optional: callback when favorites change
}) => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { favorites: globalFavorites, refreshFavorites } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use provided favoritesList or fallback to global favorites - simple matching
  const favoritesToCheck = favoritesList !== null ? favoritesList : globalFavorites;

  // Check if current restaurant is favorited - simple matching against favorites list
  useEffect(() => {
    if (Array.isArray(favoritesToCheck) && favoritesToCheck.length > 0) {
      // Simple match: check if restaurant_alias + restaurant_type exists in favorites
      const isFavorite = favoritesToCheck.some(
        fav => fav.restaurant_alias === restaurantAlias && fav.restaurant_type === restaurantType
      );
      setIsFavorited(isFavorite);
    } else {
      setIsFavorited(false);
    }
  }, [favoritesToCheck, restaurantAlias, restaurantType]);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!authState?.isAuthenticated || !authState?.accessToken) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add favorites",
        variant: "destructive",
      });
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(restaurantAlias, restaurantType, authState.accessToken);
        setIsFavorited(false);
        // Refresh global favorites or notify parent
        if (favoritesList === null) {
          refreshFavorites(); // Refresh global favorites
        } else if (onFavoriteChange) {
          onFavoriteChange(); // Notify parent to refresh
        }
        toast({
          title: "Removed from favorites",
          description: "Restaurant removed from your favorites",
        });
      } else {
        await addToFavorites(restaurantAlias, restaurantType, authState.accessToken);
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Restaurant added to your favorites",
        });
        // Refresh global favorites or notify parent
        if (favoritesList === null) {
          refreshFavorites(); // Refresh global favorites
        } else if (onFavoriteChange) {
          onFavoriteChange(); // Notify parent to refresh
        }
      }
      
      if (onToggle) {
        onToggle(!isFavorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authState?.isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full p-2 flex items-center justify-center hover:bg-black/50 transition-all disabled:opacity-50 ${className}`}
      style={{
        width: `${size + 8}px`,
        height: `${size + 8}px`,
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorited ? (
        <FaHeart size={size} color="#FF6B6B" />
      ) : (
        <FaRegHeart size={size} color="#FFFFFF" />
      )}
    </button>
  );
};

export default FavoriteButton;

