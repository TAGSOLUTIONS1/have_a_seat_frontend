import { Base_Url } from "@/baseUrl";
import axios from "axios";
import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import RestrautCards from "./RestrauntCards";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/authContext/AuthProvider";

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
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState(null);
  const [userStatistics, setUserStatistics] = useState(null);
  const [filtersFromPreferences, setFiltersFromPreferences] = useState(false);
  
  // Initialize filters with saved preferences or defaults
  const initializeFilters = () => {
    const savedFilters = loadFiltersFromStorage();
    
    if (savedFilters) {
      // Ensure all required properties exist
      return {
        selectedTypes: savedFilters.selectedTypes || ["yelp", "open_table", "resy"],
        ratings: savedFilters.ratings || [],
        cuisinefilter: savedFilters.cuisinefilter || [],
        reviewedFilter: savedFilters.reviewedFilter || [],
        showmore: savedFilters.showmore || false,
        allCuisines: savedFilters.allCuisines || []
      };
    }
    
    return {
      selectedTypes: ["yelp", "open_table", "resy"],
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
              selectedTypes: ["yelp", "open_table", "resy"],
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
    const fetchDataInOrder = async () => {
      const results = [];
      const customFormData =
        formData.term && formData.term.length > 0
          ? { ...formData, categories: formData.term, term: undefined }
          : formData;

      // Yelp
      const yelpData = await fetchData("/api/v1/yelp/get_restaurants", formData);
      results.push({ source: "yelp", data: yelpData });

      // Resy
      const resyData = await fetchData("/api/v1/resy/get_restaurants", formData);
      results.push({ source: "resy", data: resyData });

      // OpenTable
      const openTableData = await fetchData("/api/v1/opentable/get_restaurants", customFormData);
      results.push({ source: "opentable", data: openTableData });

      // Set data in the same order
      setYelpData(results.find(r => r.source === "yelp")?.data || []);
      setResyData(results.find(r => r.source === "resy")?.data || []);
      setOpenTableData(results.find(r => r.source === "opentable")?.data || []);
    };

    fetchDataInOrder();
  }
}, [formData, loading]);

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
          <Loader />
        )}
      </div>
      </div>
    </>
  );
};

export default Search;
