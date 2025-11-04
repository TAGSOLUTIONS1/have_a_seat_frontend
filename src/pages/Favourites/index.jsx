import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { getFavorites } from "@/services/favoritesService";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Base_Url } from "@/baseUrl";
import axios from "axios";
import { FaHeart } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { Search } from "lucide-react";
import FavoritesCard from "@/components/common/FavoritesCard";
import getCoordinates from "@/lib/utils";

const Favourites = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [enrichedFavorites, setEnrichedFavorites] = useState([]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [userLocationCoords, setUserLocationCoords] = useState(null);
  const [error, setError] = useState(null);

  console.log("authState", authState);
  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    console.log("lat1", lat1);
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    // Convert to miles and format
    const miles = distance * 0.621371;
    if (miles < 0.1) {
      return `${Math.round(miles * 5280)} ft`;
    } else if (miles < 1) {
      return `${miles.toFixed(1)} mi`;
    } else {
      return `${miles.toFixed(1)} mi`;
    }
  };

  // Fetch favorites - memoized to prevent unnecessary re-renders
  const fetchFavorites = useCallback(async () => {
    if (!authState?.isAuthenticated || !authState?.accessToken) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getFavorites(authState.accessToken);
      // API returns { favorites: [...], total_count: N }
      const favoritesData = response?.favorites || response?.data?.favorites || response?.data || [];
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites. Please try again.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [authState?.isAuthenticated, authState?.accessToken]);
  console.log("favorites", favorites);

  // Function to enrich favorites with restaurant details
  const enrichFavorites = async (favoritesData) => {
    try {
      const enriched = await Promise.all(
        favoritesData.map(async (fav) => {
          try {
            const type = (fav?.restaurant_type || "").toString().toLowerCase();
            if (type === "yelp") {
              const alias = fav?.restaurant_alias || fav?.alias;
              if (!alias) return fav;
              const detailsResp = await axios.get(
                `${Base_Url}/api/v1/yelp/get_restaurant_details/${encodeURIComponent(alias)}`
              );
              const data = detailsResp?.data?.data || {};
              return {
                ...fav,
                details: { 
                  ...data, 
                  restaurant_type: "yelp",
                  restraunt_type: "yelp",  // Add restraunt_type to details for RestaurantCard
                  alias,  // Add alias to details
                  restaurant_alias: fav?.restaurant_alias  // Add restaurant_alias to details
                },
                alias,
                restraunt_type: "yelp",
              };
            }

            if (type === "open_table" || type === "opentable") {
              // Attempt to derive map_url from stored fields
              const fullLink = fav?.restaurant_alias;
              if (!fullLink) return fav;
              
              const mapPath = fullLink.replace("https://www.opentable.com/", "");
              const detailsResp = await axios.get(
                `${Base_Url}/api/v1/opentable/get_restaurant_details`,
                { params: { map_url: mapPath } }
              );
              const data = detailsResp?.data?.data || {};
              return {
                ...fav,
                details: { 
                  ...data, 
                  restaurant_type: "open_table",
                  restraunt_type: "open_table",  // Add restraunt_type to details for RestaurantCard
                  restaurant_alias: fav?.restaurant_alias,  // Add restaurant_alias to details
                  // Ensure urls structure for navigation
                  urls: {
                    ...data?.urls,
                    profileLink: {
                      ...data?.urls?.profileLink,
                      link: fullLink.startsWith("http") 
                        ? fullLink 
                        : `https://www.opentable.com/${fullLink}`
                    }
                  }
                },
                restraunt_type: "open_table",
              };
            }

            // Unknown type: return as-is
            return fav;
          } catch (e) {
            console.error("Error enriching favorite:", e);
            // Fallback to original favorite if details fetch fails
            return fav;
          }
        })
      );
      return enriched;
    } catch (error) {
      console.error("Error enriching favorites:", error);
      return favoritesData;
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated && authState?.accessToken) {
      fetchFavorites();
    }
  }, [authState?.isAuthenticated, authState?.accessToken]);

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      setIsEnriching(true);
      enrichFavorites(favorites).then((enriched) => {
        // Calculate distances after enrichment when coordinates are available
        const enrichedWithDistance = enriched.map((item) => {
          console.log("item", item);
          let restaurantDistance = null;
          const restType = item?.restaurant_type || item?.restraunt_type;
          console.log("userLocationCoords", userLocationCoords , restType);
          if (userLocationCoords) {
            if (restType === "open_table" && item?.details?.geo) {
              restaurantDistance = calculateDistance(
                userLocationCoords.lat,
                userLocationCoords.lng,
                item.details.geo.latitude,
                item.details.geo.longitude
              );
            } else if (restType === "yelp" && item?.details?.coordinates) {
              restaurantDistance = calculateDistance(
                userLocationCoords.lat,
                userLocationCoords.lng,
                item.details.coordinates.latitude,
                item.details.coordinates.longitude
              );
            } else if (restType === "resy" && 
                       item?.details?.location && 
                       item?.details?.location.latitude && 
                       item?.details?.location.longitude) {
              restaurantDistance = calculateDistance(
                userLocationCoords.lat,
                userLocationCoords.lng,
                item.details.location.latitude,
                item.details.location.longitude
              );
            }
          }
          
          return {
            ...item,
            calculatedDistance: restaurantDistance
          };
        });
        
        setEnrichedFavorites(enrichedWithDistance);
        setFavoriteRestaurants(enrichedWithDistance);
        setFilteredRestaurants(enrichedWithDistance);
        setIsEnriching(false);
      });
    } else {
      setEnrichedFavorites([]);
      setFavoriteRestaurants([]);
      setFilteredRestaurants([]);
      setIsEnriching(false);
    }
  }, [favorites, userLocationCoords]);

  // Get user location from localStorage or formData
  useEffect(() => {
    const fetchUserCoordinates = async () => {
      try {
        // First check if coordinates are in saved formData
        const savedFormData = localStorage.getItem("searchFormData");
        if (savedFormData) {
          try {
            const formData = JSON.parse(savedFormData);
            if (formData?.latitude && formData?.longitude) {
              setUserLocationCoords({
                lat: parseFloat(formData.latitude),
                lng: parseFloat(formData.longitude)
              });
              return;
            }
          } catch (e) {
            console.error("Error parsing formData:", e);
          }
        }
        
        // Fallback: geocode location string if coordinates not available
        const location = localStorage.getItem("location");
        if (location) {
          try {
            const coords = await getCoordinates(location);
            if (coords && coords.lat && coords.lng) {
              setUserLocationCoords({
                lat: coords.lat,
                lng: coords.lng
              });
            }
          } catch (error) {
            console.error("Error geocoding location:", error);
            setUserLocationCoords(null);
          }
        } else {
          setUserLocationCoords(null);
        }
      } catch (error) {
        console.error("Error fetching user coordinates:", error);
        setUserLocationCoords(null);
      }
    };

    fetchUserCoordinates();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim()) {
      const filtered = favoriteRestaurants.filter((restaurant) => {
        const details = restaurant?.details;
        if (!details) return false;
        
        return (
          details?.name?.toLowerCase().includes(text.toLowerCase()) ||
          details?.categories?.some?.((c) => c?.title?.toLowerCase().includes(text.toLowerCase())) ||
          details?.location?.display_address?.[0]?.toLowerCase().includes(text.toLowerCase())
        );
      });
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(favoriteRestaurants);
    }
  };

  // Handle case when authState is still loading
  if (!authState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authState?.accessToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Please log in to view your favorites</p>
          <Link
            to="/login"
            className="mt-4 inline-block px-6 py-2 bg-plum text-white rounded-full hover:bg-plum/90 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchFavorites}
            className="px-6 py-2 bg-plum text-white rounded-full hover:bg-plum/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("filteredRestaurants", filteredRestaurants);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-agrandir font-bold text-shipGrey mb-2">
            Favourites
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative flex items-center bg-white rounded-full px-4 py-3 border border-gray-200 shadow-sm">
            <Search className="text-gray-500 mr-3 w-5 h-5" />
            <input
              type="text"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Search your favorites..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <button
                onClick={() => handleSearch("")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <IoIosCloseCircle size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && !isEnriching && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
              <FaHeart className="text-plum" size={16} />
              <span className="text-sm font-semibold text-plum">
                {filteredRestaurants.length} favorite{filteredRestaurants.length !== 1 ? 's' : ''}
              </span>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 italic">
                matching "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {/* Restaurant List */}
        {loading || isEnriching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum mb-4"></div>
            <p className="text-gray-600">
              {loading ? "Loading your favorites..." : "Loading restaurant details..."}
            </p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaHeart
              className={`w-16 h-16 text-gray-300 mb-4 ${searchTerm ? "hidden" : ""}`}
            />
            {searchTerm && <Search className="w-16 h-16 text-gray-300 mb-4" />}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "No matches found" : "No favorites yet"}
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              {searchTerm
                ? `No restaurants match "${searchTerm}"`
                : "Start adding restaurants to your favorites to see them here"}
            </p>
            {!searchTerm && (
              <Link
                to="/restraunts"
                className="mt-6 px-6 py-3 bg-plum text-white rounded-full hover:bg-plum/90 transition-colors font-semibold"
              >
                Explore Restaurants
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredRestaurants
              .filter((item) => item?.details && item?.details?.name) // Only show items with valid details
              .map((item, index) => {
                try {
                  const handlePress = (restaurantItem) => {
                    const restType = restaurantItem?.restaurant_type || restaurantItem?.restraunt_type;
                    let url = "#";
                    
                    if (restType === "yelp") {
                      const alias = restaurantItem?.details?.alias || restaurantItem?.alias || restaurantItem?.restaurant_alias;
                      if (alias) {
                        url = `/restaurant-detail?yelp_alias=${encodeURIComponent(alias)}`;
                      }
                    } else if (restType === "open_table") {
                      const link = restaurantItem?.details?.urls?.profileLink?.link || restaurantItem?.restaurant_alias;
                      if (link) {
                        url = `/restaurant-detail?map_url=${encodeURIComponent(link)}`;
                      }
                    } else if (restType === "resy") {
                      const resyId = restaurantItem?.details?.id?.resy || restaurantItem?.restaurant_alias || restaurantItem?.id?.resy;
                      if (resyId) {
                        url = `/restaurant-detail?resy_alias=${encodeURIComponent(resyId)}`;
                      }
                    }
                    
                    navigate(url);
                  };

                  return (
                    <FavoritesCard
                      key={`${item?.restaurant_alias || item?.alias || index}`}
                      item={item}
                      distance={item?.calculatedDistance || null}
                      onPress={handlePress}
                    />
                  );
                } catch (error) {
                  console.error("Error rendering restaurant card:", error, item);
                  return null; // Skip this item if there's an error
                }
              })
              .filter(Boolean) // Remove any null values
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;

