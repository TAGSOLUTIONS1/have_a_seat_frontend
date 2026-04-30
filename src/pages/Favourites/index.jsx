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

            if (type === "resy") {
              // Resy: restaurant_alias is the venue_id as a string (e.g., "85380")
              const venueId = fav?.restaurant_alias;
              if (!venueId) return fav;
              
              const today = new Date();
              const formattedDate = today.toISOString().split('T')[0];
              
              // First, get basic data to extract location and url_slug
              const detailsResp = await axios.get(
                `http://127.0.0.1:8000/api/v1/resy/get_restaurant_details?venue_id=${venueId}&persons=2&date=${formattedDate}`
              );
              const responseData = detailsResp?.data?.data || {};
              
              // Extract location and url_slug from first response for v2 API call
              const venueData = responseData?.results?.venues?.[0]?.venue || {};
              const locationSlug = venueData?.location?.url_slug || responseData?.location?.url_slug;
              const urlSlug = venueData?.url_slug || responseData?.url_slug;
              
              // Call v2 API with proper parameters
              let v2ResponseData = {};
              let v2VenueData = {};
              if (locationSlug && urlSlug) {
                try {
                  const v2Params = new URLSearchParams({
                    venue_id: venueId,
                    persons: '2',
                    date: formattedDate,
                    location: locationSlug,
                    url_slug: urlSlug,
                  });
                  const v2Resp = await axios.get(
                    `http://127.0.0.1:8000/api/v1/resy/get_restaurant_details?${v2Params.toString()}`
                  );
                  v2ResponseData = v2Resp?.data?.data || {};
                  // Extract venue data from nested structure: data.results.venues[0].venue
                  v2VenueData = v2ResponseData?.results?.venues?.[0]?.venue || {};
                } catch (error) {
                  console.error("Error fetching v2 data:", error);
                  // Fall back to using data from first response
                }
              }
              
              // Use v2 venue data if available, otherwise fall back to original response
              const finalVenueData = v2VenueData && Object.keys(v2VenueData).length > 0 ? v2VenueData : venueData;
              
              // Convert venue_id string back to number for id.resy structure
              const resyIdNum = parseInt(venueId, 10);
              
              // Extract images from responsive_images (v2 structure)
              const images = finalVenueData?.responsive_images?.originals 
                ? Object.values(finalVenueData.responsive_images.originals).map(img => img.url)
                : finalVenueData?.images || [];
              
              // Get first image URL for image_url
              const imageUrl = images.length > 0 ? images[0] : null;
              
              // Convert cuisine type (string) to array format
              const cuisine = finalVenueData?.type ? [finalVenueData.type] : [];
              
              return {
                ...fav,
                details: {
                  // Spread the full response data to preserve structure
                  ...responseData,
                  // Spread venue data at top level for easier access
                  ...finalVenueData,
                  // Ensure name is at top level (required for filtering)
                  name: finalVenueData?.name || "",
                  // Extract images array
                  images: images,
                  image_url: imageUrl,
                  // Cuisine as array
                  cuisine: cuisine,
                  // Rating structure - rating is directly on venue object in v2 API
                  rating: {
                    average: finalVenueData?.rating || 0,
                    total: finalVenueData?.total_ratings || 0
                  },
                  // Location structure for address display
                  locality: finalVenueData?.location?.neighborhood || "",
                  // ID structure: id.resy (number) - saved as string in restaurant_alias
                  id: {
                    resy: resyIdNum
                  },
                  restaurant_type: "resy",
                  restraunt_type: "resy",
                  restaurant_alias: venueId,  // Keep as string for consistency
                },
                restraunt_type: "resy",
              };
            }

            if (type === "tock") {
              const domain = fav?.restaurant_alias || fav?.tock_domain;
              if (!domain) return fav;
              const detailsResp = await axios.get(
                `${Base_Url}/api/v1/tock/get_restaurant_details/${encodeURIComponent(domain)}`
              );
              const data = detailsResp?.data?.data || {};
              const address = data?.address || {};
              // Transform Tock schema.org format to match expected structure
              const transformedData = {
                name: data?.name || "",
                description: data?.description || "",
                url: data?.url || "",
                phone: data?.telephone || "", // Map telephone to phone for component
                telephone: data?.telephone || "",
                email: data?.email || "",
                logo: data?.logo || "",
                priceRange: data?.priceRange || "",
                servesCuisine: data?.servesCuisine || "",
                // Transform cuisine to array format expected by component
                cuisine: data?.servesCuisine ? [data.servesCuisine] : [],
                categories: data?.servesCuisine ? [{ title: data.servesCuisine }] : [],
                // Transform address to expected format
                address: {
                  street: address?.streetAddress || "",
                  city: address?.addressLocality || "",
                  state: address?.addressRegion || "",
                  zipCode: address?.postalCode || "",
                  country: address?.addressCountry || "",
                  streetAddress: address?.streetAddress || "",
                  addressLocality: address?.addressLocality || "",
                  addressRegion: address?.addressRegion || "",
                  postalCode: address?.postalCode || "",
                  addressCountry: address?.addressCountry || ""
                },
                location: {
                  address1: address?.streetAddress || "",
                  city: address?.addressLocality || "",
                  state: address?.addressRegion || "",
                  zipCode: address?.postalCode || "",
                  country: address?.addressCountry || "",
                  display_address: address?.streetAddress 
                    ? [`${address.streetAddress}`, `${address.addressLocality || ""}, ${address.addressRegion || ""} ${address.postalCode || ""}`.trim()]
                    : []
                },
                sameAs: data?.sameAs || [],
                image_url: data?.logo || "",
                restaurant_type: "tock",
                restraunt_type: "tock",
                tock_domain: domain,
                tock_data: data
              };
              return {
                ...fav,
                details: transformedData,
                restraunt_type: "tock",
                tock_domain: domain
              };
            }
            if (type === "tableagent") {
              // Get slug from id.tableagent (saved as string in restaurant_alias) or fallback to other fields
              const slug = String(fav?.id?.tableagent || fav?.restaurant_alias || fav?.tableagent_slug || fav?.slug || "");
              const city = fav?.tableagent_city || fav?.city || "New York City";
              if (!slug) return fav;
              
              const detailsResp = await axios.get(
                `${Base_Url}/api/v1/tableagent/get_restaurant_details/${encodeURIComponent(city)}/${encodeURIComponent(slug)}`
              );
              // Handle response structure: response.data.data or response.data
              const responseData = detailsResp?.data?.data || detailsResp?.data || {};
              const addressParts = responseData?.address_parts || {};
              const tableagentSlug = String(responseData?.slug || slug);
              
              // Extract images from gallery_photos or images array
              const images = responseData?.gallery_photos?.length > 0
                ? responseData.gallery_photos.map(photo => photo.original_url || photo.thumbnail_url)
                : responseData?.images || [];
              
              // Get first image URL
              const imageUrl = responseData?.image_url || images[0] || null;
              
              // Transform Table Agent response to match expected structure
              const transformedData = {
                name: responseData?.name || "",
                description: responseData?.description || "",
                url: responseData?.url || "",
                website: responseData?.website || "",
                phone: responseData?.phone || "",
                rating: responseData?.rating || 0,
                price_range: responseData?.price_range || "",
                priceRange: responseData?.price_range || "",
                // Transform cuisines to array format expected by component
                cuisines: responseData?.cuisines || [],
                cuisine: responseData?.cuisines || [],
                categories: responseData?.cuisines?.map(cuisine => ({ title: cuisine })) || [],
                // Images
                images: images,
                image_url: imageUrl,
                gallery_photos: responseData?.gallery_photos || [],
                // Transform address to expected format
                address: typeof responseData?.address === "string"
                  ? responseData.address
                  : {
                      street: addressParts?.street || "",
                      city: addressParts?.city || "",
                      state: addressParts?.state || "",
                      zipCode: addressParts?.postal_code || "",
                      postalCode: addressParts?.postal_code || "",
                    },
                address_parts: addressParts,
                location: {
                  address1: addressParts?.street || "",
                  city: addressParts?.city || "",
                  state: addressParts?.state || "",
                  zipCode: addressParts?.postal_code || "",
                  display_address: typeof responseData?.address === "string"
                    ? [responseData.address]
                    : addressParts?.street
                      ? [`${addressParts.street}, ${addressParts.city}, ${addressParts.state} ${addressParts.postal_code}`.trim()]
                      : []
                },
                // Business hours and reviews
                business_hours: responseData?.business_hours || {},
                reviews: responseData?.reviews || {},
                // ID structure similar to Resy - save slug as string
                id: {
                  tableagent: tableagentSlug
                },
                slug: tableagentSlug,
                city: responseData?.city || city,
                city_slug: responseData?.city_slug || city.toLowerCase().replace(/\s+/g, "-"),
                restaurant_type: "tableagent",
                restraunt_type: "tableagent",
                tableagent_slug: tableagentSlug,
                tableagent_city: city,
                tableagent_data: responseData
              };
              return {
                ...fav,
                details: transformedData,
                restraunt_type: "tableagent",
                tableagent_slug: tableagentSlug,
                tableagent_city: city
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
                        // Include url_slug and location if available
                        const urlSlug = restaurantItem?.details?.url_slug || restaurantItem?.url_slug;
                        const locationSlug = restaurantItem?.details?.location?.url_slug || restaurantItem?.location?.url_slug;
                        
                        url = `/restaurant-detail?resy_alias=${encodeURIComponent(resyId)}`;
                        if (urlSlug) {
                          url += `&url_slug=${encodeURIComponent(urlSlug)}`;
                        }
                        if (locationSlug) {
                          url += `&location=${encodeURIComponent(locationSlug)}`;
                        }
                      }
                    } else if (restType === "tock") {
                      const domain = restaurantItem?.tock_domain || restaurantItem?.details?.tock_domain || restaurantItem?.restaurant_alias;
                      if (domain) {
                        url = `/restaurant-detail?tock_domain=${encodeURIComponent(domain)}`;
                      }
                    } else if (restType === "tableagent") {
                      const slug = restaurantItem?.details?.id?.tableagent || restaurantItem?.id?.tableagent || restaurantItem?.tableagent_slug || restaurantItem?.details?.slug || restaurantItem?.restaurant_alias;
                      const city = restaurantItem?.tableagent_city || restaurantItem?.details?.city || restaurantItem?.city || "New York City";
                      if (slug) {
                        url = `/restaurant-detail?tableagent_slug=${encodeURIComponent(slug)}&tableagent_city=${encodeURIComponent(city)}`;
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

