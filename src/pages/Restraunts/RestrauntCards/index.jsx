import React, { memo, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
import { FaCheck } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { MapPin, List } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import Map from "@/components/shared/Map";
import getCoordinates from "@/lib/utils";

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
const initialTypes = ["yelp", "open_table", "resy", "tock", "tableagent"];
const ratingtypes = ["5" , "4" , "3" , "2" , "1"];
const cuisinestypes=["Italian" , "Mediterranean" , "Mexican" , "Chinese" , "Thai"];
const Reviewedtype=["most" , "least"];
const RestaurantCards = memo(
  ({
    yelpData,
    openTableData,
    resyData,
    tockData,
    tableAgentData,
    formData,
    selectedStarFilter,
    selectedPriceFilter,
    selectedCuisineFilter,
    filters,
    onFilterChange,
    onRatingsChange,
    onCuisineChange,
    onReviewChange,
    onShowMore,
    onClearFilters,
    userStatistics,
    filtersFromPreferences
  }) => {
    const { selectedTypes, ratings, cuisinefilter, reviewedFilter, showmore, allCuisines } = filters;
    const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState(formData?.term || "");
    const [viewMode, setViewMode] = useState("list"); // "list" or "map"
    const [userLocationCoords, setUserLocationCoords] = useState(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = (type) => {
      const newSelectedTypes = selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type];
      onFilterChange({ selectedTypes: newSelectedTypes });
    };

    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
      if (
        (yelpData && selectedTypes.includes("yelp")) ||
        (openTableData && selectedTypes.includes("open_table")) ||
        (resyData && selectedTypes.includes("resy")) ||
        (tockData && selectedTypes.includes("tock")) ||
        (tableAgentData && selectedTypes.includes("tableagent"))
      ) {
        const mergedRestaurants = [];

        if (yelpData && selectedTypes.includes("yelp")) {
          mergedRestaurants.push(
            ...yelpData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "yelp",
            }))
          );
        }

        if (openTableData && selectedTypes.includes("open_table")) {
          mergedRestaurants.push(
            ...openTableData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "open_table",
            }))
          );
        }

        if (resyData && selectedTypes.includes("resy")) {
          mergedRestaurants.push(
            ...resyData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "resy",
            }))
          );
        }

        if (tockData && selectedTypes.includes("tock")) {
          mergedRestaurants.push(
            ...tockData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "tock",
            }))
          );
        }

        if (tableAgentData && selectedTypes.includes("tableagent")) {
          mergedRestaurants.push(
            ...tableAgentData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "tableagent",
            }))
          );
        }


        // const shuffledRestaurants = mergedRestaurants.sort((a, b) => {
        //   const keyA = (a.name + a.id).toLowerCase();
        //   const keyB = (b.name + b.id).toLowerCase();
        //   return keyA.localeCompare(keyB);
        // });
        
        setShuffledRestaurants(mergedRestaurants);
      } else {
        setShuffledRestaurants([]);
      }
    }, [yelpData, openTableData, resyData, tockData, tableAgentData, selectedTypes]);

    useEffect(() => {
      let filteredRestaurants = shuffledRestaurants;

      if (selectedPriceFilter != null) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => {
          let price = null;

          if (restaurant.restraunt_type === "yelp" || restaurant.restraunt_type === "tock" || restaurant.restraunt_type === "tableagent") {
            switch (restaurant.price) {
              case "$":
                price = 1;
                break;
              case "$$":
                price = 2;
                break;
              case "$$$":
                price = 3;
                break;
              case "$$$$":
                price = 4;
                break;
              default:
                price = null;
            }
          } else {
            price =
              restaurant.priceBand?.priceBandId || restaurant.price_range_id;
          }
          return price != null && price == selectedPriceFilter;
        });
      }

      if (selectedStarFilter != null) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => {
          let rating = null;

          if (restaurant.restraunt_type === "yelp") {
            rating = Math.floor(parseFloat(restaurant.rating));
          } else if (restaurant.restraunt_type === "open_table") {
            rating = Math.floor(
              parseFloat(
                restaurant.statistics?.reviews?.ratings?.overall?.rating
              )
            );
          } else if (restaurant.restraunt_type === "resy") {
            rating = Math.floor(parseFloat(restaurant.rating?.average));
          } else if (restaurant.restraunt_type === "tock") {
            // Tock doesn't provide rating in search response, so skip rating filter for Tock
            rating = null;
          } else if (restaurant.restraunt_type === "tableagent") {
            rating = Math.floor(parseFloat(restaurant.rating || restaurant.tableagent_rating || 0));
          }
          return rating != null && rating === selectedStarFilter;
        });
      }

      if (selectedCuisineFilter != null) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => {
          let cuisine = null;
          if (restaurant.restraunt_type === "yelp") {
            cuisine = restaurant?.categories
              ?.map((category) => category.title.toLowerCase())
              .join(", ");
          } else if (restaurant.restraunt_type === "open_table") {
            cuisine = restaurant?.primaryCuisine?.name?.toLowerCase();
          } else if (restaurant.restraunt_type === "resy") {
            cuisine = restaurant?.cuisine
              ?.map((cuisineItem) => cuisineItem.toLowerCase())
              .join(", ");
          } else if (restaurant.restraunt_type === "tock") {
            cuisine = restaurant?.categories
              ?.map((category) => category.title.toLowerCase())
              .join(", ");
          } else if (restaurant.restraunt_type === "tableagent") {
            // Table Agent doesn't provide categories in search response
            cuisine = "";
          }
          return (
            cuisine != null &&
            cuisine.includes(selectedCuisineFilter.toLowerCase())
          );
        });
      }

      //////// extra filters 
      // if (formData.cuisine_type != ""){
      //   const inputText = normalizeString(formData?.cuisine_type || "");
    
      // const primaryCuisine = restaurant?.primaryCuisine?.name 
      //   ? normalizeString(restaurant.primaryCuisine.name) 
      //   : "";
    
      // return (
      //   (restaurant?.categories?.some(category => 
      //     normalizeString(category.title).includes(inputText)
      //   )) || primaryCuisine.includes(inputText)
      // );
      // }
      // if (formData.restaurant_name != "")
      // {
      //   const restaurantName = normalizeString(restaurant.name);
      //   const inputText = normalizeString(formData?.restaurant_name || "");
      
      //   return restaurantName.includes(inputText) || inputText.includes(restaurantName);
      // }

      setFilteredRestaurants(filteredRestaurants);
    }, [
      selectedStarFilter,
      selectedPriceFilter,
      selectedCuisineFilter,
      shuffledRestaurants,
    ]);


    // console.log("~~ filtered restaurannts " , ratings , reviewedFilter , cuisinefilter);

    const normalizeString = (str) => 
      str.toLowerCase().replace(/[^a-z0-9]/g, ''); 
    
    const matchingRestaurants = filteredRestaurants.filter(restaurant => {
      const restaurantName = normalizeString(restaurant.name);
      const inputText = normalizeString(formData?.restaurant_name || "");
    
      return restaurantName.includes(inputText) || inputText.includes(restaurantName);
    });
    
    const [copiedRestaurants, setCopiedRestaurants] = useState([]);
    const matchingcuisine = filteredRestaurants.filter(restaurant => {
      const normalizedCuisines = cuisinefilter.map(normalizeString);
    
      const primaryCuisine = restaurant?.primaryCuisine?.name 
        ? normalizeString(restaurant.primaryCuisine.name) 
        : "";
    
      return (
        restaurant?.categories?.some(category => 
          normalizedCuisines.includes(normalizeString(category.title))
        ) || normalizedCuisines.includes(primaryCuisine)
      );
    });
    
    useEffect(() => {
      let updatedRestaurants = [...shuffledRestaurants]; // Start with merged & shuffled data
        
      // Apply Price Filter
      if (selectedPriceFilter != null) {
        updatedRestaurants = updatedRestaurants.filter((restaurant) => {
          let price = null;
          if (restaurant.restraunt_type === "yelp" || restaurant.restraunt_type === "tock" || restaurant.restraunt_type === "tableagent") {
            price = restaurant.price ? restaurant.price.length : null;
          } else {
            price = restaurant.priceBand?.priceBandId || restaurant.price_range_id;
          }
          return price != null && price == selectedPriceFilter;
        });
      }
    
      // Apply Star Rating Filter
      if (selectedStarFilter != null) {
        updatedRestaurants = updatedRestaurants.filter((restaurant) => {
          let rating = null;
          if (restaurant.restraunt_type === "yelp") {
            rating = Math.floor(parseFloat(restaurant.rating));
          } else if (restaurant.restraunt_type === "open_table") {
            rating = Math.floor(parseFloat(restaurant.statistics?.reviews?.ratings?.overall?.rating));
          } else if (restaurant.restraunt_type === "resy") {
            rating = Math.floor(parseFloat(restaurant.rating?.average));
          } else if (restaurant.restraunt_type === "tock") {
            // Tock doesn't provide rating in search response, so skip rating filter for Tock
            rating = null;
          } else if (restaurant.restraunt_type === "tableagent") {
            rating = Math.floor(parseFloat(restaurant.rating || restaurant.tableagent_rating || 0));
          }
          return rating != null && rating === selectedStarFilter;
        });
      }
    
      // Apply Cuisine Filter
      if (cuisinefilter.length > 0) {
        updatedRestaurants = updatedRestaurants.filter((restaurant) => {
          const normalizedCuisines = cuisinefilter.map((cuisine) => cuisine.toLowerCase());
          let restaurantCuisine = "";
    
          if (restaurant.restraunt_type === "yelp" || restaurant.restraunt_type === "tock") {
            restaurantCuisine = restaurant.categories?.map(cat => cat.title.toLowerCase()) || [];
          } else if (restaurant.restraunt_type === "open_table") {
            restaurantCuisine = [restaurant.primaryCuisine?.name?.toLowerCase()];
          } else if (restaurant.restraunt_type === "resy") {
            restaurantCuisine = restaurant.cuisine?.map(c => c.toLowerCase()) || [];
          } else if (restaurant.restraunt_type === "tableagent") {
            // Table Agent doesn't provide categories in search response
            restaurantCuisine = [];
          }
    
          return restaurantCuisine.some(cuisine => normalizedCuisines.includes(cuisine));
        });
      }
    
      // Apply Review Filter
      if (reviewedFilter.includes("most")) {
        updatedRestaurants = updatedRestaurants.sort((a, b) => {
          const reviewsA = (a.statistics?.reviews?.allTimeTextReviewCount ?? a.review_count ?? 0);
          const reviewsB = (b.statistics?.reviews?.allTimeTextReviewCount ?? b.review_count ?? 0);
          return reviewsB - reviewsA; // Sort descending
        });
      } else if (reviewedFilter.includes("least")) {
        updatedRestaurants = updatedRestaurants.sort((a, b) => {
          const reviewsA = (a.statistics?.reviews?.allTimeTextReviewCount ?? a.review_count ?? 0);
          const reviewsB = (b.statistics?.reviews?.allTimeTextReviewCount ?? b.review_count ?? 0);
          return reviewsA - reviewsB; // Sort ascending
        });
      }
    
      // Apply Rating Sort Filter
      if (ratings.length > 0) {
        updatedRestaurants = updatedRestaurants
          .filter(restaurant => {
            const restaurantRating = restaurant?.statistics?.reviews?.ratings?.overall?.rating ?? restaurant?.rating?.average ?? restaurant?.rating ?? 0;
            return ratings.some(selectedRating => restaurantRating <= parseInt(selectedRating));
          })
          .sort((a, b) => {
            const ratingA = parseFloat(a?.statistics?.reviews?.ratings?.overall?.rating ?? a?.rating?.average ?? a?.rating ?? 0);
            const ratingB = parseFloat(b?.statistics?.reviews?.ratings?.overall?.rating ?? b?.rating?.average ?? b?.rating ?? 0);
            return ratingB - ratingA;
          });
      }
    
      setFilteredRestaurants(updatedRestaurants);
    }, [selectedTypes, selectedPriceFilter, selectedStarFilter, cuisinefilter, reviewedFilter, ratings, shuffledRestaurants]);
    
    // console.log("filters " , cuisinefilter ,reviewedFilter ,ratings)
    // console.log("filtered " , filteredRestaurants);

    useEffect(() => {
      const copiedRestaurantsData = JSON.parse(JSON.stringify(filteredRestaurants)); 
      setCopiedRestaurants(copiedRestaurantsData);
    }, [filteredRestaurants]);

    
    const fillallcuisines = () => {
      const extractedCuisines = new Set(cuisinestypes);
      
      // Add favorite cuisines from user stats if available
      const favoriteCuisines = userStatistics?.most_common_cuisine_types || [];
      favoriteCuisines.forEach(cuisine => extractedCuisines.add(cuisine));
      
      filteredRestaurants.forEach((restaurant) => {
        if (restaurant.primaryCuisine?.name) {
          extractedCuisines.add(restaurant.primaryCuisine.name);
        }
        if (restaurant.categories) {
          restaurant.categories.forEach((category) => extractedCuisines.add(category.title));
        }
        if (restaurant.cuisine){
          restaurant.cuisine.forEach((category) => extractedCuisines.add(category));
        }
      });

      onFilterChange({ 
        allCuisines: [...extractedCuisines],
        showmore: true 
      });
    };
  
    // Get favorite cuisines from user stats
    const favoriteCuisines = userStatistics?.most_common_cuisine_types || [];
    
    // Prepare displayed cuisines with favorites at top
    const prepareDisplayedCuisines = () => {
      const baseCuisines = showmore ? allCuisines : cuisinestypes;
      const cuisineSet = new Set(baseCuisines);
      
      // Add favorite cuisines if not present
      favoriteCuisines.forEach(cuisine => cuisineSet.add(cuisine));
      
      const allCuisinesList = Array.from(cuisineSet);
      
      // Sort: favorites first, then others
      return allCuisinesList.sort((a, b) => {
        const aIsFavorite = favoriteCuisines.includes(a);
        const bIsFavorite = favoriteCuisines.includes(b);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return a.localeCompare(b);
      });
    };
    
    const displayedCuisines = prepareDisplayedCuisines();
    
    // Check if a cuisine is favorite
    const isFavoriteCuisine = (cuisine) => {
      return favoriteCuisines.includes(cuisine);
    };

    // Extract coordinates from restaurant data
    const getRestaurantCoordinates = (restaurant) => {
      if (restaurant.restraunt_type === "yelp" && restaurant.coordinates) {
        return {
          lat: restaurant.coordinates.latitude,
          lng: restaurant.coordinates.longitude,
        };
      } else if (restaurant.restraunt_type === "open_table") {
        // OpenTable might have coordinates in different locations
        if (restaurant.coordinates) {
          return {
            lat: restaurant.coordinates.latitude || restaurant.coordinates.lat,
            lng: restaurant.coordinates.longitude || restaurant.coordinates.lng,
          };
        }
      } else if (restaurant.restraunt_type === "resy") {
        // Resy has coordinates in location object
        if (restaurant.location && restaurant.location.latitude && restaurant.location.longitude) {
          return {
            lat: restaurant.location.latitude,
            lng: restaurant.location.longitude,
          };
        } else if (restaurant.coordinates) {
          return {
            lat: restaurant.coordinates.latitude || restaurant.coordinates.lat,
            lng: restaurant.coordinates.longitude || restaurant.coordinates.lng,
          };
        }
      } else if (restaurant.restraunt_type === "tock" && restaurant.coordinates) {
        return {
          lat: restaurant.coordinates.latitude,
          lng: restaurant.coordinates.longitude,
        };
      }
      // Table Agent restaurants are excluded from map
      return null;
    };

    // Prepare map markers from filtered restaurants with distance calculation
    const mapMarkers = useMemo(() => {
      return copiedRestaurants
        .filter((restaurant) => restaurant.restraunt_type !== "tableagent") // Exclude Table Agent from map
        .map((restaurant) => {
          const coords = getRestaurantCoordinates(restaurant);
          if (!coords) return null;

          const address =
            restaurant.restraunt_type === "yelp"
              ? restaurant.location?.display_address?.join(" ")
              : restaurant.restraunt_type === "open_table"
              ? `${restaurant.address?.line1 || ""} ${restaurant.address?.city || ""}`.trim()
              : restaurant.restraunt_type === "resy"
              ? `${restaurant.locality || ""} ${restaurant.location?.name || ""}`.trim()
              : restaurant.restraunt_type === "tock"
              ? restaurant.location?.display_address?.join(" ") || `${restaurant.location?.address1 || ""} ${restaurant.location?.city || ""}`.trim()
              : "";

          // Extract cuisine information
          let cuisine = "";
          if (restaurant.restraunt_type === "yelp" || restaurant.restraunt_type === "tock") {
            cuisine = restaurant.categories?.map(cat => cat.title).join(", ") || "N/A";
          } else if (restaurant.restraunt_type === "open_table") {
            cuisine = restaurant.primaryCuisine?.name || "N/A";
          } else if (restaurant.restraunt_type === "resy") {
            cuisine = restaurant.cuisine?.join(", ") || "N/A";
          }

          // Calculate distance
          let distance = null;
          
          // Handle OpenTable restaurants
          if (restaurant.restraunt_type === "open_table" && 
              restaurant.coordinates && 
              userLocationCoords) {
            distance = calculateDistance(
              userLocationCoords.lat,
              userLocationCoords.lng,
              restaurant.coordinates.latitude,
              restaurant.coordinates.longitude
            );
          } 
          // Handle Yelp restaurants
          else if (restaurant.restraunt_type === "yelp" && restaurant.distance) {
            // Yelp provides distance in meters, convert to miles
            const miles = restaurant.distance * 0.000621371;
            if (miles < 0.1) {
              distance = `${Math.round(miles * 5280)} ft`;
            } else {
              distance = `${miles.toFixed(1)} mi`;
            }
          } else if (restaurant.restraunt_type === "yelp" && 
                     restaurant.coordinates &&
                     userLocationCoords) {
            distance = calculateDistance(
              userLocationCoords.lat,
              userLocationCoords.lng,
              restaurant.coordinates.latitude,
              restaurant.coordinates.longitude
            );
          }
          // Handle Resy restaurants
          else if (restaurant.restraunt_type === "resy" && 
                   restaurant.location && 
                   restaurant.location.latitude && 
                   restaurant.location.longitude &&
                   userLocationCoords) {
            distance = calculateDistance(
              userLocationCoords.lat,
              userLocationCoords.lng,
              restaurant.location.latitude,
              restaurant.location.longitude
            );
          }

          return {
            lat: coords.lat,
            lng: coords.lng,
            title: restaurant.name,
            description: address,
            cuisine: cuisine,
            distance: distance,
            restaurant: restaurant, // Store full restaurant data
            restaurantType: restaurant.restraunt_type, // Pass restaurant type for colored markers
          };
        })
        .filter(Boolean);
    }, [copiedRestaurants, userLocationCoords]);

    // console.log("copiedRestaurants", copiedRestaurants);
    // Calculate map center - prioritize user's searched location, then restaurant markers average, then default
    const mapCenter = useMemo(() => {
      // First priority: Use user's searched location if available
      if (userLocationCoords && userLocationCoords.lat && userLocationCoords.lng) {
        return [userLocationCoords.lat, userLocationCoords.lng];
      }
      
      // Second priority: Use average of restaurant markers if available
      if (mapMarkers.length > 0) {
        return [
          mapMarkers.reduce((sum, m) => sum + m.lat, 0) / mapMarkers.length,
          mapMarkers.reduce((sum, m) => sum + m.lng, 0) / mapMarkers.length,
        ];
      }
      
      // Default: New York coordinates
      return [40.7128, -74.0060];
    }, [mapMarkers, userLocationCoords]);

    // Handle popup navigation (when clicking on popup content)
    const handlePopupNavigate = (marker) => {
      const restaurant = marker.restaurant;
      if (!restaurant) return;
      
      const pathname = "/restaurant-detail";
      let search = "";
      if (restaurant?.restraunt_type === "tableagent") {
        const slug = restaurant?.tableagent_slug || restaurant?.slug || restaurant?.id;
        let city = restaurant?.tableagent_city || restaurant?.city || formData?.location || formData?.city || "New York City";
        // Format city name - handle "New York" case
        if (city.toLowerCase().includes("new york") && !city.toLowerCase().includes("new york city")) {
          city = "New York City";
        }
        search = `?tableagent_slug=${encodeURIComponent(slug)}&tableagent_city=${encodeURIComponent(city)}`;
      } else {
        if (restaurant?.restraunt_type === "resy") {
          // For Resy, include url_slug and location if available
          const resyId = restaurant?.id?.resy;
          const urlSlug = restaurant?.url_slug;
          const locationSlug = restaurant?.location?.url_slug;
          
          let searchParams = `resy_alias=${encodeURIComponent(resyId)}`;
          if (urlSlug) {
            searchParams += `&url_slug=${encodeURIComponent(urlSlug)}`;
          }
          if (locationSlug) {
            searchParams += `&location=${encodeURIComponent(locationSlug)}`;
          }
          search = `?${searchParams}`;
        } else {
          search = `?${
            restaurant?.restraunt_type === "yelp"
              ? "yelp_alias"
              : restaurant?.restraunt_type === "open_table"
              ? "map_url"
              : restaurant?.restraunt_type === "tock"
              ? "tock_domain"
              : "resy_alias"
          }=${encodeURIComponent(
            restaurant?.restraunt_type === "yelp"
              ? restaurant?.alias
              : restaurant?.restraunt_type === "open_table"
              ? restaurant?.urls?.profileLink?.link
              : restaurant?.restraunt_type === "tock"
              ? restaurant?.tock_domain || restaurant?.tock_business_id?.toString() || restaurant?.id
              : restaurant?.id?.resy
          )}`;
        }
      }
      navigate({ pathname, search });
    };
    // Geocode location string to get coordinates if lat/lng not available
    useEffect(() => {
      const fetchUserCoordinates = async () => {
        // If we already have lat/lng, use them
        if (formData?.latitude && formData?.longitude) {
          setUserLocationCoords({
            lat: parseFloat(formData.latitude),
            lng: parseFloat(formData.longitude)
          });
          return;
        }
        
        // If we have a location string but no coordinates, geocode it
        if (formData?.location && !formData?.latitude && !formData?.longitude) {
          try {
            const coords = await getCoordinates(formData.location);
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
      };

      fetchUserCoordinates();
    }, [formData?.location, formData?.latitude, formData?.longitude]);

    // console.log("formData", formData);
    // console.log("userLocationCoords", userLocationCoords);
    return (
      <div>
        <div className="bg-plum px-4 sm:px-8 lg:px-24 py-8 sm:py-12 rounded-3xl">
        <div className="border-[0.4px] border-[#B9B9B9] rounded-[30px] p-6 sm:p-10 lg:p-14 bg-white max-w-[1550px] mx-auto">
            <SearchLocationV2 
            yelpData={yelpData}
            resyData={resyData}
            openTableData={openTableData}
            formData={formData}
            selectedStarFilter={selectedStarFilter}
            selectedPriceFilter={selectedPriceFilter}
            selectedCuisineFilter={selectedCuisineFilter}
            filters={filters}
            onFilterChange={onFilterChange}
            onRatingsChange={onRatingsChange}
            onCuisineChange={onCuisineChange}
            onReviewChange={onReviewChange}
            onShowMore={onShowMore}
            onClearFilters={onClearFilters}
            userStatistics={userStatistics}
            filtersFromPreferences={filtersFromPreferences}
            />
          </div>

        </div>

        {/* Cuisine Selector Section - Show Favorites Only */}
        {favoriteCuisines.length > 0 && (
          <div className="mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 max-w-[1550px] mx-auto">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h3 className="font-agrandir text-lg sm:text-xl font-bold text-shipGrey mb-4">Select Cuisines</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {favoriteCuisines.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer border-2 transition-colors"
                    style={{
                      borderColor: cuisinefilter.includes(cuisine) ? "#9235e2" : "#e5e7eb",
                      backgroundColor: cuisinefilter.includes(cuisine) ? "#f3e8ff" : "#f9fafb"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={cuisinefilter.includes(cuisine)}
                      onChange={() => onCuisineChange(cuisine)}
                      className="hidden peer"
                    />
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm bg-white border-2 flex items-center justify-center"
                      style={{
                        borderColor: cuisinefilter.includes(cuisine) ? "#9235e2" : "#d1d5db"
                      }}
                    >
                      {cuisinefilter.includes(cuisine) && <FaCheck size={10} color="#9235e2" />}
                    </span>
                    <span className="font-roboto font-medium text-xs sm:text-sm text-shipGrey">
                      {cuisine}
                    </span>
                    <FaHeart size={12} color="#FFD700" className="ml-1" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Filter Header */}
              <div className="sticky top-0 bg-plum p-4 flex justify-between items-center rounded-t-3xl z-10">
                <div className="flex items-center gap-2">
                  <ImFilter color="#ffffff" size={20} />
                  <p className="font-agrandir text-lg font-bold text-white">Filter By</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClearFilters}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs font-agrandir font-bold transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-white text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Mobile Filter Content */}
              <div className="p-4 bg-plum">
                {/* Platform Types */}
                <div className="mb-6">
                  <p className="font-agrandir text-xs font-bold text-white uppercase mb-3">Platforms</p>
                  <div className="flex flex-wrap gap-3">
                    {["yelp", "resy", "open_table", "tock", "tableagent"].map((type) => (
                      <div key={type} className="flex gap-2 items-center">
                        <label className="relative">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleCheckboxChange(type)}
                            className="hidden peer"
                          />
                          <span className="w-5 h-5 bg-white cursor-pointer rounded-full flex items-center justify-center shadow-md">
                            {selectedTypes.includes(type) && <FaCheck size={12} color="#9235e2" />}
                          </span>
                        </label>
                        <p className="font-agrandir text-xs font-bold text-white uppercase">
                          {type === "open_table" ? "Open Table" : type === "tableagent" ? "Table Agent" : type.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-white/20 border-t my-4"></div>

                {/* Restaurant Rating */}
                <div className="mb-6">
                  <p className="font-agrandir text-xs font-bold text-white uppercase mb-3">Restaurant Rating</p>
                  <div className="flex flex-col gap-3">
                    {ratingtypes.map((rating) => (
                      <div key={rating} className="flex gap-3 items-center">
                        <label>
                          <input
                            type="checkbox"
                            checked={ratings.includes(rating)}
                            onChange={() => onRatingsChange(rating)}
                            className="hidden peer"
                          />
                          <span className="w-5 h-5 rounded-sm bg-white cursor-pointer flex items-center justify-center">
                            {ratings.includes(rating) && <FaCheck size={12} color="#9235e2" />}
                          </span>
                        </label>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) =>
                            index < parseInt(rating) ? (
                              <IoIosStar key={index} color="#FFCC00" size={18} />
                            ) : (
                              <IoIosStarOutline key={index} color="#ffffff" size={18} />
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-white/20 border-t my-4"></div>

                {/* Reviews */}
                <div className="mb-6">
                  <p className="font-agrandir text-xs font-bold text-white uppercase mb-3">Reviews</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                      <label>
                        <input
                          type="checkbox"
                          checked={reviewedFilter.includes("most")}
                          onChange={() => onReviewChange("most")}
                          className="hidden peer"
                        />
                        <span className="w-5 h-5 rounded-sm bg-white cursor-pointer flex items-center justify-center">
                          {reviewedFilter.includes("most") && <FaCheck size={12} color="#9235e2" />}
                        </span>
                      </label>
                      <p className="font-roboto font-medium text-sm text-white">Most Reviewed</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <label>
                        <input
                          type="checkbox"
                          checked={reviewedFilter.includes("least")}
                          onChange={() => onReviewChange("least")}
                          className="hidden peer"
                        />
                        <span className="w-5 h-5 rounded-sm bg-white cursor-pointer flex items-center justify-center">
                          {reviewedFilter.includes("least") && <FaCheck size={12} color="#9235e2" />}
                        </span>
                      </label>
                      <p className="font-roboto font-medium text-sm text-white">Least Reviewed</p>
                    </div>
                  </div>
                </div>

                <div className="border-white/20 border-t my-4"></div>

                {/* Cuisines */}
                <div className="mb-6">
                  <p className="font-agrandir text-xs font-bold text-white uppercase mb-3">Cuisines</p>
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                    {displayedCuisines.map((cuisine) => (
                      <div key={cuisine} className="flex gap-3 items-center">
                        <label>
                          <input
                            type="checkbox"
                            checked={cuisinefilter.includes(cuisine)}
                            onChange={() => onCuisineChange(cuisine)}
                            className="hidden peer"
                          />
                          <span className="w-5 h-5 rounded-sm bg-white cursor-pointer flex items-center justify-center">
                            {cuisinefilter.includes(cuisine) && <FaCheck size={12} color="#9235e2" />}
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="font-roboto font-medium text-sm text-white">{cuisine}</p>
                          {isFavoriteCuisine(cuisine) && <FaHeart size={12} color="#FFD700" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={showmore ? () => onShowMore() : fillallcuisines}
                    className="mt-3 font-roboto font-medium text-sm text-white underline"
                  >
                    {showmore ? "Show Less" : "Show More"}
                  </button>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => {
                    setIsFiltering(true);
                    setTimeout(() => {
                      setIsFiltering(false);
                      setIsMobileFilterOpen(false);
                    }, 300);
                  }}
                  className="w-full bg-white text-plum py-3 rounded-xl font-agrandir font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-100"
                >
                  {isFiltering ? "Applying..." : "Apply Filters"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtered Restaurants List */}
        <div className="mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7 pb-20 lg:pb-0">
        <div className="hidden lg:block bg-plum p-4 sm:p-5 w-full lg:w-80 xl:w-96 h-fit rounded-3xl border-2 border-[#B9B9B9]">
              <div className="flex justify-between">
                <div className="flex gap-2 sm:gap-4 items-center">
                  <ImFilter color="#ffffff" />
            <p className="font-agrandir text-xl font-bold text-white">Filter By</p>
            </div>
            <div className="bg-purple-100 justify-end px-3 sm:px-4 py-1 rounded-3xl">
                  <p
                    className="font-agrandir text-xs sm:text-sm font-bold cursor-pointer text-plum"
                    onClick={onClearFilters}
                  >
                    Clear
                  </p>
                </div>
          </div>

          <div className="border-[#FFFFFF] border-t-[0.7px] my-5"></div>

            <div className="flex flex-wrap gap-x-4 gap-y-3">
               
               <div className="flex gap-2 sm:gap-3 items-center">
                  <label className="relative">
                    <input
                      type="checkbox"
                      id="checkbox3"
                      name="checkbox3"
                      checked={selectedTypes.includes("yelp")}
                      onChange={() => handleCheckboxChange("yelp")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 bg-white cursor-pointer rounded-full flex items-center justify-center shadow-spanshadowside">
                      {selectedTypes.includes("yelp") && <FaCheck size={14} color="#9235e2" />}

                    </span>
                  </label>
                    <p className="font-agrandir text-sm font-bold text-white uppercase">YELP</p>
                </div>

                <div className="flex gap-2 sm:gap-3 items-center">
                  <label className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("resy")}
                      onChange={() => handleCheckboxChange("resy")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                      {selectedTypes.includes("resy") && (
                        <FaCheck size={14} color="#9235e2" />
                      )}
                    </span>
                  </label>
                   <p className="font-agrandir text-sm font-bold text-white uppercase">RESY</p>
                </div>

                 <div className="flex gap-2 sm:gap-3 items-center">
                  <label className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("open_table")}
                      onChange={() => handleCheckboxChange("open_table")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                      {selectedTypes.includes("open_table") && (
                        <FaCheck size={14} color="#9235e2" />
                      )}
                    </span>
                  </label>
                  <p className="font-agrandir text-sm font-bold text-white uppercase">Open Table</p>
                </div>

                <div className="flex gap-2 sm:gap-3 items-center">
                                  <label className="relative">
                                    <input
                                      type="checkbox"
                                      checked={selectedTypes.includes("tock")}
                                      onChange={() => handleCheckboxChange("tock")}
                                      className="hidden peer"
                                    />
                                    <span className="w-5 h-5 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                                      {selectedTypes.includes("tock") && (
                                        <FaCheck size={14} color="#9235e2" />
                                      )}
                                    </span>
                                  </label>
                                  <p className="font-agrandir text-sm font-bold text-white uppercase">TOCK</p>
                </div>

                <div className="flex gap-2 sm:gap-3 items-center">
                                  <label className="relative">
                                    <input
                                      type="checkbox"
                                      checked={selectedTypes.includes("tableagent")}
                                      onChange={() => handleCheckboxChange("tableagent")}
                                      className="hidden peer"
                                    />
                                    <span className="w-5 h-5 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                                      {selectedTypes.includes("tableagent") && (
                                        <FaCheck size={14} color="#9235e2" />
                                      )}
                                    </span>
                                  </label>
                                  <p className="font-agrandir text-sm font-bold text-white uppercase">TABLE AGENT</p>
                </div>

            </div>

          <div className="border-[#FFFFFF] border-t-[0.7px] my-5"></div>

            <p className="font-agrandir text-xs font-bold text-white uppercase">Restaurant Rating</p>
            <div className="my-7 flex flex-col gap-3">
            {ratingtypes.map((rating) => (
              <div key={rating} className="flex gap-2 items-center">
                <label className="">
                  <input
                    type="checkbox"
                    id={`checkbox-${rating}`} // Unique ID
                    name={`checkbox-${rating}`}
                    checked={ratings.includes(rating)}
                    onChange={() => onRatingsChange(rating)}
                    className="hidden peer"
                  />
                  <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                  flex items-center justify-center"
                  >
                    {ratings.includes(rating) && <FaCheck size={13} color="#9235e2" />}
                  </span>
                </label>

                {/* Render stars dynamically */}
                {[...Array(5)].map((_, index) => (
                  index < parseInt(rating) ? (
                    <IoIosStar key={index} color="#FFCC00" size={18} />
                  ) : (
                    <IoIosStarOutline key={index} color="#ffffff" size={18} />
                  )
                ))}
              </div>
            ))}
            </div>
            
            <div className="border-[#FFFFFF] border-t-[0.7px] my-5"></div>

           <div className="flex flex-col gap-3">
           <p className="font-agrandir text-xs font-bold text-white uppercase">Reviews</p>
           <div className="flex gap-4 items-center">
           <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={reviewedFilter.includes("most")}
                onChange={()=> onReviewChange("most")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {reviewedFilter.includes("most") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Most Reviewed</p>
          </div>
          <div className="flex gap-4 items-center">
          <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={reviewedFilter.includes("least")}
                onChange={()=> onReviewChange("least")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {reviewedFilter.includes("least") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Least Reviewed</p>
          </div>
           </div>

           <div className="border-[#FFFFFF] border-t-[0.7px] my-5"></div>

            <div className="flex flex-col gap-3">
            <p className="font-agrandir text-xs font-bold text-white uppercase">Cuisines</p>

            {displayedCuisines.map((cuisine) => (
              <div key={cuisine} className="flex gap-4 items-center">
                <label>
                  <input
                    type="checkbox"
                    checked={cuisinefilter.includes(cuisine)}
                    onChange={() => onCuisineChange(cuisine)}
                    className="hidden peer"
                  />
                  <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                  >
                    {cuisinefilter.includes(cuisine) && <FaCheck size={13} color="#9235e2" />}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <p className="font-roboto font-medium text-sm text-white">{cuisine}</p>
                  {isFavoriteCuisine(cuisine) && (
                    <FaHeart size={14} color="#FFD700" className="ml-1" />
                  )}
                </div>
              </div>
            ))}

              <p
                className="font-roboto font-medium text-sm text-white underline cursor-pointer"
                onClick={showmore ? () => onShowMore() : fillallcuisines}
              >
                {showmore ? "Show Less" : "Show More"}
              </p>
            </div>

        </div>
        
        {/* List/Map Toggle and View Section */}
        <div className="flex-1">
          {/* Toggle Buttons */}
          <div className="mb-6 flex justify-end gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-agrandir font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-plum text-white shadow-md"
                  : "bg-white text-plum border-2 border-plum hover:bg-plum/10"
              }`}
            >
              <List className="w-5 h-5" />
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-agrandir font-semibold transition-all ${
                viewMode === "map"
                  ? "bg-plum text-white shadow-md"
                  : "bg-white text-plum border-2 border-plum hover:bg-plum/10"
              }`}
            >
              <MapPin className="w-5 h-5" />
              Map
            </button>
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <div>
              {copiedRestaurants?.map((data, index) => {
                // Calculate distance for this restaurant
                let restaurantDistance = null;
                
                // Handle OpenTable restaurants
                if (data.restraunt_type === "open_table" && 
                    data.coordinates && 
                    userLocationCoords) {
                  restaurantDistance = calculateDistance(
                    userLocationCoords.lat,
                    userLocationCoords.lng,
                    data.coordinates.latitude,
                    data.coordinates.longitude
                  );
                } 
                // Handle Yelp restaurants
                else if (data.restraunt_type === "yelp" && data.distance) {
                  // Yelp provides distance in meters, convert to miles
                  const miles = data.distance * 0.000621371;
                  if (miles < 0.1) {
                    restaurantDistance = `${Math.round(miles * 5280)} ft`;
                  } else {
                    restaurantDistance = `${miles.toFixed(1)} mi`;
                  }
                } else if (data.restraunt_type === "yelp" && 
                           data.coordinates &&
                           userLocationCoords) {
                  restaurantDistance = calculateDistance(
                    userLocationCoords.lat,
                    userLocationCoords.lng,
                    data.coordinates.latitude,
                    data.coordinates.longitude
                  );
                }
                // Handle Resy restaurants
                else if (data.restraunt_type === "resy" && 
                         data.location && 
                         data.location.latitude && 
                         data.location.longitude &&
                         userLocationCoords) {
                  restaurantDistance = calculateDistance(
                    userLocationCoords.lat,
                    userLocationCoords.lng,
                    data.location.latitude,
                    data.location.longitude
                  );
                }
                // Handle Tock restaurants - use distance from ranking (already converted to miles)
                else if (data.restraunt_type === "tock" && data.distance) {
                  const miles = data.distance;
                  if (miles < 0.1) {
                    restaurantDistance = `${Math.round(miles * 5280)} ft`;
                  } else {
                    restaurantDistance = `${miles.toFixed(1)} mi`;
                  }
                } else if (data.restraunt_type === "tock" && 
                          data.tock_distance_meters) {
                  // Fallback: convert from meters if distance not already converted
                  const miles = data.tock_distance_meters * 0.000621371;
                  if (miles < 0.1) {
                    restaurantDistance = `${Math.round(miles * 5280)} ft`;
                  } else {
                    restaurantDistance = `${miles.toFixed(1)} mi`;
                  }
                } else if (data.restraunt_type === "tock" &&
                          data.coordinates &&
                          userLocationCoords) {
                  // Final fallback: calculate from coordinates
                  restaurantDistance = calculateDistance(
                    userLocationCoords.lat,
                    userLocationCoords.lng,
                    data.coordinates.latitude,
                    data.coordinates.longitude
                  );
                }

              const getSearchParams = () => {
                if (data?.restraunt_type === "tableagent") {
                  const slug = data?.tableagent_slug || data?.slug || data?.id;
                  let city = data?.tableagent_city || data?.city || formData?.location || formData?.city || "New York City";
                  // Format city name - handle "New York" case
                  if (city.toLowerCase().includes("new york") && !city.toLowerCase().includes("new york city")) {
                    city = "New York City";
                  }
                  return `?tableagent_slug=${encodeURIComponent(slug)}&tableagent_city=${encodeURIComponent(city)}`;
                } else if (data?.restraunt_type === "resy") {
                  // For Resy, include url_slug and location if available
                  const resyId = data?.id?.resy;
                  const urlSlug = data?.url_slug;
                  const locationSlug = data?.location?.url_slug;
                  
                  let searchParams = `resy_alias=${encodeURIComponent(resyId)}`;
                  if (urlSlug) {
                    searchParams += `&url_slug=${encodeURIComponent(urlSlug)}`;
                  }
                  if (locationSlug) {
                    searchParams += `&location=${encodeURIComponent(locationSlug)}`;
                  }
                  return `?${searchParams}`;
                } else {
                  return `?${
                    data?.restraunt_type === "yelp"
                      ? "yelp_alias"
                      : data?.restraunt_type === "open_table"
                      ? "map_url"
                      : data?.restraunt_type === "tock"
                      ? "tock_domain"
                      : "resy_alias"
                  }=${encodeURIComponent(
                    data?.restraunt_type === "yelp"
                      ? data?.alias
                      : data?.restraunt_type === "open_table"
                      ? data?.urls?.profileLink?.link
                      : data?.restraunt_type === "tock"
                      ? data?.tock_domain || data?.tock_business_id?.toString() || data?.id
                      : data?.id?.resy
                  )}`;
                }
              };

              return (
                <Link
                  key={index}
                  to={{
                    pathname: "/restaurant-detail",
                    search: getSearchParams(),
                  }}
                  className="block mb-4 sm:mb-6"
                >
                  <RestaurantCard data={data} distance={restaurantDistance} formData={formData} />
                </Link>
              );
            })}
            </div>
          )}

          {/* Map View */}
          {viewMode === "map" && (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                {mapMarkers.length > 0 ? (
                  <Map
                    center={mapCenter}
                    zoom={mapMarkers.length === 1 ? 15 : 12}
                    markers={mapMarkers}
                    height="600px"
                    onNavigate={handlePopupNavigate}
                    userLocation={userLocationCoords}
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-3xl">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="font-agrandir text-lg text-gray-600">
                        No restaurants with location data available
                      </p>
                      <p className="font-roboto text-sm text-gray-500 mt-2">
                        Switch to list view to see all restaurants
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
       </div>
      </div>
    );
  }
);

export default RestaurantCards;
