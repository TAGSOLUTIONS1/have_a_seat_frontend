import { Base_Url } from "@/baseUrl";
import axios from "axios";
import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import RestrautCards from "./RestrauntCards";
import Loader from "@/components/Loader";
import LoadingScreens from "@/pages/Landing/Section2/LoadingScreens";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import getCoordinates from "@/lib/utils";

// Load filters from localStorage
const loadFiltersFromStorage = () => {
  try {
    const savedFilters = localStorage.getItem("restaurantFilters");
    if (savedFilters) {
      return JSON.parse(savedFilters);
    }
  } catch (e) {
    console.error("Error loading filters from storage:", e);
  }
  return null;
};

// Save filters to localStorage
const saveFiltersToStorage = (filters) => {
  try {
    localStorage.setItem("restaurantFilters", JSON.stringify(filters));
  } catch (e) {
    console.error("Error saving filters to storage:", e);
  }
};

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");
  const { authState } = useAuth();

  const [formData, setFormData] = useState({});
  const [yelpData, setYelpData] = useState();
  const [resyData, setResyData] = useState();
  const [openTableData, setOpenTableData] = useState();
  const [tockData, setTockData] = useState();
  const [tableAgentData, setTableAgentData] = useState();
  const [theForkData, setTheForkData] = useState();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState(null);
  const [userStatistics, setUserStatistics] = useState(null);
  const [filtersFromPreferences, setFiltersFromPreferences] = useState(false);
  const [userLocationCoords, setUserLocationCoords] = useState(null);
  
  // Initialize filters with saved preferences or defaults
  const initializeFilters = () => {
    const savedFilters = loadFiltersFromStorage();
    
    if (savedFilters) {
      // Ensure TheFork is included when old saved filters are missing it
      const savedSelectedTypes = Array.isArray(savedFilters.selectedTypes)
        ? Array.from(new Set([...savedFilters.selectedTypes, "thefork"]))
        : ["yelp", "open_table", "resy", "tock", "tableagent", "thefork"];
      // Ensure all required properties exist
    return {
      selectedTypes: savedSelectedTypes,
      ratings: savedFilters.ratings || [],
      cuisinefilter: savedFilters.cuisinefilter || [],
      reviewedFilter: savedFilters.reviewedFilter || [],
      showmore: savedFilters.showmore || false,
      allCuisines: savedFilters.allCuisines || []
    };
  }
  
  return {
    selectedTypes: ["yelp", "open_table", "resy", "tock", "tableagent", "thefork"],
    ratings: [],
    cuisinefilter: [],
    reviewedFilter: [],
    showmore: false,
    allCuisines: []
  };
  };

  const [filters, setFilters] = useState(initializeFilters);
  const fetchData = async (apiEndpoint, customFormData) => {
    try {
      // console.log("apiEndpoint ", customFormData);
      const response = await axios.get(`${Base_Url}${apiEndpoint}`, {
        params: customFormData,
        headers: {
          accept: "application/json",
        },
      });
      return response.data.data.businesses;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  // Special fetch function for Tock due to different response structure
  const fetchTockData = async (customFormData, userCoords = null) => {
    try {
      // Get current time in HH:MM format if not provided
      const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      // Format city name - handle "New York" case
      let cityName = customFormData.location || customFormData.city || "";
      if (cityName.toLowerCase().includes("new york")) {
        cityName = "New York City";
      }

      // Get time from formData or use current time
      const timeValue = customFormData.reservation_time || customFormData.time || getCurrentTime();
      
      // Format time to HH:MM if needed (in case it comes in different format)
      const formatTime = (timeStr) => {
        if (!timeStr) return getCurrentTime();
        // If already in HH:MM format, return as is
        if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
          return timeStr;
        }
        // Try to parse other formats
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hours = String(parseInt(timeMatch[1])).padStart(2, "0");
          const minutes = timeMatch[2];
          return `${hours}:${minutes}`;
        }
        return getCurrentTime();
      };

      // Build latlng string - prioritize userLocationCoords, then formData
      let latlngValue = "";
      if (userCoords && userCoords.lat && userCoords.lng) {
        // Use userLocationCoords if available (most accurate)
        latlngValue = `${userCoords.lat},${userCoords.lng}`;
      } else if (customFormData.latitude && customFormData.longitude) {
        // Fallback to formData coordinates
        latlngValue = `${customFormData.latitude},${customFormData.longitude}`;
      }

      // Transform formData to Tock API format
      const tockParams = {
        city: cityName,
        date: customFormData.date || customFormData.reservation_date || new Date().toISOString().split('T')[0],
        latlng: latlngValue,
        size: customFormData.persons || 2,
        time: formatTime(timeValue),
        type: customFormData.type || "DINE_IN_EXPERIENCES"
      };

      // Use URLSearchParams to ensure proper URL encoding (%20 for spaces, %2C for comma, %3A for colon)
      const searchParams = new URLSearchParams();
      Object.keys(tockParams).forEach(key => {
        if (tockParams[key] !== null && tockParams[key] !== undefined && tockParams[key] !== "") {
          searchParams.append(key, tockParams[key]);
        }
      });

      const response = await axios.get(`${Base_Url}/api/v1/tock/search_restaurants?${searchParams.toString()}`, {
        headers: {
          accept: "application/json",
        },
      });

      // Transform Tock response to match expected format
      if (response.data?.success && response.data?.data?.availability?.result?.offeringAvailability) {
        const offeringAvailability = response.data.data.availability.result.offeringAvailability;
        
        // Map Tock restaurants to expected format
        const transformedRestaurants = offeringAvailability.map((item) => {
          const business = item.business;
          const location = business.location || {};
          
          return {
            id: business.id?.toString() || "",
            name: business.name || "",
            image_url: business.heroImageUrl || business.profileImage?.[0]?.imageUrl || "",
            is_closed: false,
            url: business.webUrl || "",
            review_count: 0, // Tock doesn't provide review count in this response
            categories: business.cuisines ? business.cuisines.split("/").map(c => ({
              alias: c.trim().toLowerCase().replace(/\s+/g, "-"),
              title: c.trim()
            })) : [],
            rating: 0, // Tock doesn't provide rating in this response
            coordinates: {
              latitude: location.lat || null,
              longitude: location.lng || null,
            },
            transactions: [],
            price: business.priceRange || "",
            location: {
              address1: location.address || "",
              address2: null,
              address3: "",
              city: location.city || business.city || "",
              zip_code: location.zipCode || "",
              country: location.country || business.country || "",
              state: location.state || business.state || "",
              display_address: location.address 
                ? [location.address, `${location.city || ""}, ${location.state || ""} ${location.zipCode || ""}`.trim()]
                : [],
            },
            phone: "",
            display_phone: "",
            distance: item.ranking?.distanceMeters ? item.ranking.distanceMeters * 0.000621371 : null, // Convert meters to miles
            // Store Tock-specific data
            tock_business_id: business.id,
            tock_domain: business.domainName,
            tock_offerings: item.offering || [],
            tock_price_range: business.priceRange || "",
            tock_cuisines: business.cuisines || "",
            tock_distance_meters: item.ranking?.distanceMeters || null,
            restaurant_type: "tock",
            restraunt_type: "tock"
          };
        });

        return transformedRestaurants;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching Tock data:", error);
      return [];
    }
  };

  // Special fetch function for Table Agent due to different response structure
  const fetchTableAgentData = async (customFormData, userCoords = null) => {
    try {
      // Format city name - handle "New York" case
      let cityName = customFormData.location || customFormData.city || "";
      if (cityName.toLowerCase().includes("new york")) {
        cityName = "New York City";
      }

      // Transform formData to Table Agent API format
      const tableAgentParams = {
        city: cityName,
        date: customFormData.date || customFormData.reservation_date || new Date().toISOString().split('T')[0],
        size: customFormData.persons || 2,
        page: 1 // Default to page 1, can be made configurable if needed
      };

      // Use URLSearchParams to ensure proper URL encoding
      const searchParams = new URLSearchParams();
      Object.keys(tableAgentParams).forEach(key => {
        if (tableAgentParams[key] !== null && tableAgentParams[key] !== undefined && tableAgentParams[key] !== "") {
          searchParams.append(key, tableAgentParams[key]);
        }
      });

      const response = await axios.get(`${Base_Url}/api/v1/tableagent/search_restaurants?${searchParams.toString()}`, {
        headers: {
          accept: "application/json",
        },
      });

      // Transform Table Agent response to match expected format
      if (response.data?.success && response.data?.data?.restaurants) {
        const restaurants = response.data.data.restaurants;
        
        // Map Table Agent restaurants to expected format
        const transformedRestaurants = restaurants.map((restaurant) => {
          const addressParts = restaurant.address_parts || {};
          
          return {
            id: restaurant.slug || "",
            name: restaurant.name || "",
            image_url: restaurant.image_url || "",
            is_closed: false,
            url: restaurant.url || "",
            review_count: 0, // Table Agent doesn't provide review count in this response
            categories: [], // Table Agent doesn't provide categories in this response
            rating: restaurant.rating || 0,
            coordinates: {
              latitude: null, // Table Agent doesn't provide coordinates in this response
              longitude: null,
            },
            transactions: [],
            price: restaurant.price_range || "",
            location: {
              address1: addressParts.street || restaurant.address || "",
              address2: null,
              address3: "",
              city: addressParts.locality || "",
              zip_code: addressParts.postal_code || "",
              country: "",
              state: addressParts.region || "",
              display_address: restaurant.address 
                ? [restaurant.address]
                : [],
            },
            phone: "",
            display_phone: "",
            distance: null,
            // Store Table Agent-specific data
            tableagent_slug: restaurant.slug,
            tableagent_city: restaurant.city || cityName,
            tableagent_city_slug: restaurant.city_slug || cityName.toLowerCase().replace(/\s+/g, "-"),
            tableagent_url: restaurant.url,
            tableagent_price_range: restaurant.price_range || "",
            tableagent_rating: restaurant.rating || 0,
            tableagent_description: restaurant.description || "",
            tableagent_image_alt: restaurant.image_alt || "",
            restaurant_type: "tableagent",
            restraunt_type: "tableagent"
          };
        });

        return transformedRestaurants;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching Table Agent data:", error);
      return [];
    }
  };

  // Fetch and normalize TheFork restaurants
  const fetchTheForkData = async (customFormData, userCoords = null) => {
    try {
      const latitude =
        customFormData.latitude ||
        customFormData.lat ||
        userCoords?.lat ||
        40.7127753;
      const longitude =
        customFormData.longitude ||
        customFormData.lng ||
        userCoords?.lng ||
        -74.0059728;

      // Ensure we have coordinates before calling the API
      if (!latitude || !longitude) {
        return [];
      }

      const params = { latitude, longitude };
      const response = await axios.get(
        `${Base_Url}/api/v1/thefork/get_restaurants`,
        {
          params,
          headers: { accept: "application/json" },
        }
      );

      const convertPrice = (valueInCents) => {
        if (!valueInCents && valueInCents !== 0) return "";
        const dollars = valueInCents / 100;
        if (dollars < 20) return "$";
        if (dollars < 50) return "$$";
        if (dollars < 80) return "$$$";
        return "$$$$";
      };

      if (response.data?.success) {
        const list =
          response.data?.data?.pageProps?.searchPageResultsFetchResult?.list || [];
        // console.log("list ", list);
        return list
          .map((item) => {
            // Handle both structures: item.restaurant or item directly
            const restaurant = item?.restaurant || item || {};
            console.log("restaurant 1", restaurant);
            const coordinates =
              restaurant?.geolocation || restaurant?.attributes?.geolocation;

            const categories = [];
            if (restaurant?.servesCuisine) {
              categories.push({
                alias: restaurant.servesCuisine
                  ?.toLowerCase()
                  ?.replace(/\s+/g, "-"),
                title: restaurant.servesCuisine,
              });
            }
            if (Array.isArray(restaurant?.tags)) {
              restaurant.tags.forEach((tag) => {
                if (tag?.name) {
                  categories.push({
                    alias: tag.name.toLowerCase().replace(/\s+/g, "-"),
                    title: tag.name,
                  });
                }
              });
            }

            const formattedAddress =
              restaurant?.attributes?.formattedAddress ||
              restaurant?.address?.street;

              const value = Number(restaurant?.avgPrice?.value);
              const decimalPosition = restaurant?.avgPrice?.currency?.decimalPosition;

            return {
              id: restaurant?.id,
              alias: restaurant?.slug || restaurant?.id,
              name: restaurant?.name,
              tags: restaurant?.tags || [],
              avgPriceValue : (value / Math.pow(10, decimalPosition)).toFixed(decimalPosition),
              image_url:
                restaurant?.mainPhotoUrl ||
                restaurant?.photos?.[0]?.src ||
                restaurant?.photos?.[0]?.url ||
                restaurant?.photos?.[0],
              is_closed: false,
              url: restaurant?.slug
                ? `https://www.thefork.com/restaurant/${restaurant.slug}`
                : restaurant?.attributes?.formattedAddress,
              review_count:
                restaurant?.aggregateRatings?.thefork?.reviewCount || 0,
              rating: restaurant?.aggregateRatings?.thefork?.ratingValue || 0,
              categories,
              price: convertPrice(restaurant?.avgPrice?.value),
              fork_legacyId: restaurant?.legacyId,
              coordinates: coordinates
                ? {
                    latitude: coordinates?.latitude,
                    longitude: coordinates?.longitude,
                  }
                : null,
              transactions: [],
              distance: restaurant?.attributes?.distanceFromGeolocation
                ? restaurant.attributes.distanceFromGeolocation * 0.000621371
                : null,
              location: {
                address1: restaurant?.address?.street || "",
                address2: "",
                address3: "",
                city: restaurant?.address?.locality || "",
                zip_code: restaurant?.address?.zipCode || "",
                country: restaurant?.address?.country || "",
                state: "",
                display_address: formattedAddress ? [formattedAddress] : [],
              },
              phone: "",
              display_phone: "",
              restaurant_type: "thefork",
              restraunt_type: "thefork",
              thefork_slug: restaurant?.slug,
              thefork_main_photo: restaurant?.mainPhotoUrl,
            };
          })
          .filter((item) => item?.name);
      }

      return [];
    } catch (error) {
      console.error("Error fetching TheFork data:", error);
      return [];
    }
  };

  // Fetch user statistics to get favorite cuisines
  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (authState?.isAuthenticated && authState?.accessToken) {
        try {
          const response = await axios.get(
            `${Base_Url}/api/v1/reservation/statistics/`,
            {
              headers: {
                Authorization: `Bearer ${authState.accessToken}`,
                accept: "application/json",
              },
            }
          );
          setUserStatistics(response.data);
          
          // Check if user has favorite cuisines and no saved filters
          const savedFilters = loadFiltersFromStorage();
          if (response.data?.most_common_cuisine_types?.length > 0 && !savedFilters) {
            // Auto-apply favorite cuisines as default filters
            const favoriteCuisines = response.data.most_common_cuisine_types.slice(0, 3); // Top 3 favorites
            const defaultFilters = {
              selectedTypes: ["yelp", "open_table", "resy", "tock", "tableagent", "thefork"],
              ratings: [],
              cuisinefilter: favoriteCuisines,
              reviewedFilter: [],
              showmore: false,
              allCuisines: []
            };
            setFilters(defaultFilters);
            setFiltersFromPreferences(true);
            
            // Save the auto-applied filters
            saveFiltersToStorage(defaultFilters);
          } else if (savedFilters && response.data?.most_common_cuisine_types?.length > 0) {
            // Check if saved filters match user preferences (for showing "Favorite" badge)
            const savedCuisines = savedFilters.cuisinefilter || [];
            const favoriteCuisines = response.data.most_common_cuisine_types || [];
            const matchesPreferences = savedCuisines.some(cuisine => 
              favoriteCuisines.includes(cuisine)
            );
            if (matchesPreferences && savedCuisines.length > 0) {
              setFiltersFromPreferences(true);
            }
            // Ensure saved filters are applied even if they were loaded before user stats
            setFilters(prev => ({
              ...prev,
              cuisinefilter: savedCuisines
            }));
          } else if (savedFilters) {
            // If we have saved filters but no user stats, just apply them
            setFilters(prev => ({
              ...prev,
              cuisinefilter: savedFilters.cuisinefilter || prev.cuisinefilter
            }));
          }
        } catch (error) {
          console.error("Error fetching user statistics:", error);
        }
      }
    };

    fetchUserStatistics();
  }, [authState]);

  useEffect(() => {
    let finalData;
    try {
      if (data !== null) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
    }
    setLoading(false);
  }, [data]);

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

    if (formData && Object.keys(formData).length > 0) {
      fetchUserCoordinates();
    }
  }, [formData?.location, formData?.latitude, formData?.longitude]);

  // useEffect(() => {
  //   if (!loading) {
  //     const fetchDataFromApi = async (apiEndpoint, setData) => {
  //       let customFormData = formData;
  //       if (
  //         apiEndpoint === "/api/v1/opentable/get_restaurants" &&
  //         formData.term
  //       ) {
  //         customFormData = {
  //           ...formData,
  //           categories: formData.term,
  //           term: undefined,
  //         };
  //       }
  //       // console.log("data is for request  " , customFormData);
  //       const data = await fetchData(apiEndpoint, customFormData);
  //       setData(data);
  //     };

  //     fetchDataFromApi("/api/v1/yelp/get_restaurants", setYelpData);
  //     fetchDataFromApi("/api/v1/resy/get_restaurants", setResyData);
  //     fetchDataFromApi("/api/v1/opentable/get_restaurants", setOpenTableData);
  //   }
  // }, [formData, loading]);

  // useEffect=(()=>{
  //     setFormData(localStorage.getItem("searchFormData"));
  //     console.log("change in local state ")
  // },[localStorage])


  useEffect(() => {
  if (!loading) {
    const customFormData =
      formData.term && formData.term.length > 0
        ? { ...formData, categories: formData.term, term: undefined }
        : formData;

    // Fetch and set data for Yelp, Resy, and OpenTable immediately (non-blocking)
    const fetchMainData = async () => {
      // Fetch all three in parallel for faster loading
      const [yelpData, resyData, openTableData, theForkData] = await Promise.all([
        fetchData("/api/v1/yelp/get_restaurants", formData),
        fetchData("/api/v1/resy/get_restaurants", formData),
        fetchData("/api/v1/opentable/get_restaurants", customFormData),
        fetchTheForkData(formData, userLocationCoords)
      ]);

      // Set data immediately so UI can show results
      setYelpData(yelpData || []);
      setResyData(resyData || []);
      setOpenTableData(openTableData || []);
      setTheForkData(theForkData || []);
    };

    // Fetch Tock separately (non-blocking) - will update when ready
    const fetchTockDataAsync = async () => {
      try {
        const tockData = await fetchTockData(formData, userLocationCoords);
        setTockData(tockData || []);
      } catch (error) {
        console.error("Error fetching Tock data:", error);
        setTockData([]);
      }
    };

    // Fetch Table Agent separately (non-blocking) - will update when ready
    const fetchTableAgentDataAsync = async () => {
      try {
        const tableAgentData = await fetchTableAgentData(formData, userLocationCoords);
        setTableAgentData(tableAgentData || []);
      } catch (error) {
        console.error("Error fetching Table Agent data:", error);
        setTableAgentData([]);
      }
    };

    // Start all fetches - main data will show immediately, Tock and Table Agent will be added when ready
    fetchMainData();
    fetchTockDataAsync();
    fetchTableAgentDataAsync();
  }
}, [formData, loading, userLocationCoords]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Save to localStorage whenever filters change
      saveFiltersToStorage(updated);
      // If user manually changes filters, mark that they're not from preferences anymore
      if (newFilters.cuisinefilter && filtersFromPreferences) {
        setFiltersFromPreferences(false);
      }
      return updated;
    });
  };

  // Add these handler functions to your Search component
const handleRatingsChange = (rating) => {
  setFilters(prev => {
    const updated = {
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    };
    saveFiltersToStorage(updated);
    return updated;
  });
};

const handleCuisineChange = (cuisine) => {
  setFilters(prev => {
    const updated = {
      ...prev,
      cuisinefilter: prev.cuisinefilter.includes(cuisine)
        ? prev.cuisinefilter.filter(c => c !== cuisine)
        : [...prev.cuisinefilter, cuisine]
    };
    saveFiltersToStorage(updated);
    // User manually changed cuisine filters, so not from preferences anymore
    if (filtersFromPreferences) {
      setFiltersFromPreferences(false);
    }
    return updated;
  });
};

const handleReviewChange = (type) => {
  setFilters(prev => {
    const updated = {
      ...prev,
      reviewedFilter: prev.reviewedFilter.includes(type)
        ? prev.reviewedFilter.filter(t => t !== type)
        : [...prev.reviewedFilter, type]
    };
    saveFiltersToStorage(updated);
    return updated;
  });
};

const handleShowMore = () => {
  setFilters(prev => ({
    ...prev,
    showmore: !prev.showmore
  }));
};

const clearFilters = (keepFavorites = false) => {
  setFilters(prev => {
    const favoriteCuisines = userStatistics?.most_common_cuisine_types?.slice(0, 3) || [];
    const updated = {
      ...prev,
      ratings: [],
      reviewedFilter: [],
      cuisinefilter: keepFavorites && filtersFromPreferences ? favoriteCuisines : []
    };
    saveFiltersToStorage(updated);
    if (!keepFavorites) {
      setFiltersFromPreferences(false);
    }
    return updated;
  });
};
    

  return (
    <>
    <div className="w-full bg-bgGray">
      <div className="flex flex-col lg:flex-row max-w-[1550px] mx-auto justify-center p-4">

        {isSidebarOpen && (
          // <div
          //   className="fixed inset-0 z-50 bg-white shadow-lg p-4 lg:hidden overflow-auto"
          //   style={{ width: "250px" }}
          // >
          //   <div className="flex justify-between items-center mb-4">
          //     <h1 className="text-xl">
          //       <strong>Filters</strong>
          //     </h1>
          //     <button className="text-2xl" onClick={toggleSidebar}>
          //       &times;
          //     </button>
          //   </div>
          //   <Filters
          //     selectedStarFilter={selectedStarFilter}
          //     setSelectedStarFilter={setSelectedStarFilter}
          //     selectedPriceFilter={selectedPriceFilter}
          //     setSelectedPriceFilter={setSelectedPriceFilter}
          //     selectedCuisineFilter={selectedCuisineFilter}
          //     setSelectedCuisineFilter={setSelectedCuisineFilter}
          //   />
          // </div>
          <></>
        )}

        {yelpData ? (
          <>
            {/* <div className="hidden lg:block w-full md:w-1/3 lg:w-1/3 md:sticky lg:sticky top-0">
              <h1 className="text-xl items-center text-center justify-center">
                <strong>
                  <Sliders size={24} className="inline-block mr-2" />
                  FILTERS
                </strong>
              </h1>
              <Filters
                selectedStarFilter={selectedStarFilter}
                setSelectedStarFilter={setSelectedStarFilter}
                selectedPriceFilter={selectedPriceFilter}
                setSelectedPriceFilter={setSelectedPriceFilter}
                selectedCuisineFilter={selectedCuisineFilter}
                setSelectedCuisineFilter={setSelectedCuisineFilter}
              />
            </div> */}

            <div className="w-full mb-10">
              <RestrautCards
                yelpData={yelpData}
                resyData={resyData}
                openTableData={openTableData}
                tockData={tockData}
                tableAgentData={tableAgentData}
                theForkData={theForkData}
                formData={formData}
                selectedStarFilter={selectedStarFilter}
                selectedPriceFilter={selectedPriceFilter}
                selectedCuisineFilter={selectedCuisineFilter}
                filters={filters}
                onFilterChange={handleFilterChange}
                onRatingsChange={handleRatingsChange}
                onCuisineChange={handleCuisineChange}
                onReviewChange={handleReviewChange}
                onShowMore={handleShowMore}
                onClearFilters={clearFilters}
                filtersFromPreferences={filtersFromPreferences}
                userStatistics={userStatistics}
              />
            </div>
          </>
        ) : (
          <LoadingScreens />
        )}
      </div>
      </div>
    </>
  );
};

export default Search;
