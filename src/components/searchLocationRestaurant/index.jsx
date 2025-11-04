import { Button } from "@/components/ui/button";
import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../home/HomeAutoComplete";
import TermApiAuto from "../home/HometermAutoComplete";
import LocationTracker from "@/components/LocationTracker";
import { useToast } from "@/components/ui/use-toast";
import { CiSearch } from "react-icons/ci";
import { getCurrentTime } from "../constants/constants";
import { MdLocationOn } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoTime } from "react-icons/io5";
import { Sliders } from "lucide-react";
import { FaCheck } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SearchLocationV2 = memo(
  ({
    yelpData,
    openTableData,
    resyData,
    formData2,
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTypes, ratings, cuisinefilter, reviewedFilter, showmore, allCuisines } = filters;
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: getCurrentTime(),
    restaurant_name: "",
    cuisine_type: "",
    region_id: "",
    cuisine_id:"",
    location: "",
    term: "",
    rating: "hightolow",
    longitude:"",
    latitude:"",
  });

  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters state
  const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [copiedRestaurants, setCopiedRestaurants] = useState([]);

  const cuisinestypes = ["Italian", "Mexican", "Chinese", "Japanese", "Indian", "American"];
  const ratingtypes = ["1", "2", "3", "4", "5"];
  const Reviewedtype=["most" , "least"];

  useEffect(() => {
    const savedFormData = localStorage.getItem("searchFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const getLocationData = (value) => {
    // Handle both string and object with coordinates
    const locationString = typeof value === 'string' ? value : value?.location || value;
    const firstWord = locationString.split(",")[0].trim();
    const latitude = typeof value === 'object' && value?.latitude ? value.latitude : null;
    const longitude = typeof value === 'object' && value?.longitude ? value.longitude : null;
    
    setFormData((prevData) => ({ 
      ...prevData, 
      location: firstWord,
      latitude: latitude || prevData.latitude || "",
      longitude: longitude || prevData.longitude || ""
    }));
  };

  const handleSearch = () => {
    if (!formData.location && !formData.term) {
      toast({
        title: "Input Required",
        description: "Please enter either a location or a cuisine/restaurant.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem("searchFormData", JSON.stringify(formData));
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  // console.log("form data " , formData)

    useEffect(() => {
    // console.log("handle search called")
    const delayDebounce = setTimeout(() => {
      if (formData.location || formData.term) {
        handleSearch();
      }
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [formData]);



  const handleTermChange = (value) => {
    setFormData((prevData) => {
      // console.log("values " , value)
      const words = value.name.trim().split(/\s+/);
      if (!words.length) return null;
      let word = words[0];
      if (word.endsWith("'s")) {
       word = word.slice(0, -2);
      }
      const result = word.toLowerCase();
      // console.log("result is " , value);
      let updatedData;
      if (value.latitude || value.longitude)
      {
      updatedData = { ...prevData, term: result , latitude:value.latitude , longitude:value.longitude , region_id:value.id};
      }
      else if (value.id || value.latitude==null)
      {
        // updatedData = { ...prevData, term: result , cuisine_id:value.id,region_id:"",latitude:"",longitude:"" };
        updatedData = {
            ...prevData, term:result, cuisine_id: value.id,
          };
          // Remove location-specific fields
          delete updatedData.latitude;
          delete updatedData.longitude;
          delete updatedData.region_id;
      }
      else{
        updatedData = { ...prevData, term: result};
      }
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleInputChange = (field1 ,field2, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field1]: value , [field2]: value };
      return updatedData;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

      useEffect(() => {
        if (
          (yelpData && selectedTypes.includes("yelp")) ||
          (openTableData && selectedTypes.includes("open_table")) ||
          (resyData && selectedTypes.includes("resy"))
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
  
          const shuffledRestaurants = mergedRestaurants.sort((a, b) => {
            const keyA = (a.name + a.id).toLowerCase();
            const keyB = (b.name + b.id).toLowerCase();
            return keyA.localeCompare(keyB);
          });
  
          setShuffledRestaurants(shuffledRestaurants);
        } else {
          setShuffledRestaurants([]);
        }
      }, [yelpData, openTableData, resyData, selectedTypes]);
  
    useEffect(() => {
      let updatedRestaurants = [...shuffledRestaurants];

      // Apply Price Filter
      if (selectedPriceFilter != null) {
        updatedRestaurants = updatedRestaurants.filter((restaurant) => {
          let price = null;
          if (restaurant.restraunt_type === "yelp") {
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
          }
          return rating != null && rating === selectedStarFilter;
        });
      }

      // Apply Cuisine Filter
      if (cuisinefilter.length > 0) {
        updatedRestaurants = updatedRestaurants.filter((restaurant) => {
          const normalizedCuisines = cuisinefilter.map((cuisine) => cuisine.toLowerCase());
          let restaurantCuisine = "";

          if (restaurant.restraunt_type === "yelp") {
            restaurantCuisine = restaurant.categories?.map(cat => cat.title.toLowerCase()) || [];
          } else if (restaurant.restraunt_type === "open_table") {
            restaurantCuisine = [restaurant.primaryCuisine?.name?.toLowerCase()];
          } else if (restaurant.restraunt_type === "resy") {
            restaurantCuisine = restaurant.cuisine?.map(c => c.toLowerCase()) || [];
          }

          return restaurantCuisine.some(cuisine => normalizedCuisines.includes(cuisine));
        });
      }

      // Apply Review Filter
      if (reviewedFilter.includes("most")) {
        updatedRestaurants = updatedRestaurants.sort((a, b) => {
          const reviewsA = (a.statistics?.reviews?.allTimeTextReviewCount ?? a.review_count ?? 0);
          const reviewsB = (b.statistics?.reviews?.allTimeTextReviewCount ?? b.review_count ?? 0);
          return reviewsB - reviewsA;
        });
      } else if (reviewedFilter.includes("least")) {
        updatedRestaurants = updatedRestaurants.sort((a, b) => {
          const reviewsA = (a.statistics?.reviews?.allTimeTextReviewCount ?? a.review_count ?? 0);
          const reviewsB = (b.statistics?.reviews?.allTimeTextReviewCount ?? b.review_count ?? 0);
          return reviewsA - reviewsB;
        });
      }

      // Apply Rating Sort Filter
      if (ratings.length > 0) {
        updatedRestaurants = updatedRestaurants
          .filter(restaurant => {
            const restaurantRating = restaurant?.statistics?.reviews?.ratings?.overall?.rating ?? restaurant?.rating ?? 0;
            return ratings.some(selectedRating => restaurantRating <= parseInt(selectedRating));
          })
          .sort((a, b) => {
            const ratingA = a?.statistics?.reviews?.ratings?.overall?.rating ?? a?.rating ?? 0;
            const ratingB = b?.statistics?.reviews?.ratings?.overall?.rating ?? b?.rating ?? 0;
            return ratingB - ratingA;
          });
      }

      setFilteredRestaurants(updatedRestaurants);
    }, [selectedStarFilter,
      selectedPriceFilter,
      selectedCuisineFilter,
      shuffledRestaurants,]);

    const normalizeString = (str) =>
      str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const fillallcuisines = () => {
      const extractedCuisines = new Set(cuisinestypes);
      
      // Add favorite cuisines from user stats if available
      const favoriteCuisines = userStatistics?.most_common_cuisine_types || [];
      favoriteCuisines.forEach(cuisine => extractedCuisines.add(cuisine));
      
      filteredRestaurants.forEach((restaurant) => {
        if (restaurant.primaryCuisine?.name) {
          extractedCuisines.add(restaurant.primaryCuisine.name );
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

    const handleCheckboxChange = (type) => {
      const newSelectedTypes = selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type];
      onFilterChange({ selectedTypes: newSelectedTypes });
    };


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full max-w-[1550px] mx-auto bg-white rounded-2xl md:rounded-[3rem] shadow-lg border border-gray-100 p-4 md:py-5 md:px-8 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
        {/* Location */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 flex-1 min-w-0">
          <MdLocationOn size={24} color="#9235E2" className=" flex-shrink-0" />
          <div
            className={`text-sm md:text-base font-roboto font-normal z-10 w-full text-shipGrey ${
              error ? "border-red-500" : ""
            }`}
          >
            <GeoApiAuto
              getLocationData={getLocationData}
              location={formData.location}
            />
          </div>
        </div>

        {/* Restaurant/Cuisine */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 text-shipGrey md:pr-4 flex-1 min-w-0">
          <MdOutlineRestaurantMenu size={22} color="#9235E2" className="mr-3 flex-shrink-0" />
          <TermApiAuto getTermData={handleTermChange} />
        </div>

        {/* Date */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 md:pr-4 flex-1 min-w-0">
          <BsCalendarDateFill size={20} color="#9235E2" className="mr-3 flex-shrink-0" />
          <DatePicker
            selected={new Date(formData.date)}
            onChange={(date) =>
              handleInputChange("date","reservation_date", date.toISOString().split("T")[0])
            }
            dateFormat="MMM dd, yyyy"
            className="text-sm md:text-base w-full text-shipGrey font-roboto focus:outline-none bg-transparent cursor-pointer"
            onKeyDown={(e) => e.preventDefault()}
            placeholderText="Select date"
            wrapperClassName="w-full"
          />
        </div>
        
        {/* Time */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 md:pr-4 flex-1 min-w-0">
          <IoTime size={22} color="#9235E2" className="mr-3 flex-shrink-0" />
          <DatePicker
            selected={new Date(`${formData.date}T${formData.reservation_time}`)}
            onChange={(date) =>
              handleInputChange(
                "reservation_time",
                "reservation_time",
                date.toTimeString().slice(0, 5)
              )
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            className="text-sm md:text-base w-full text-shipGrey font-roboto focus:outline-none bg-transparent cursor-pointer"
            onKeyDown={(e) => e.preventDefault()}
            placeholderText="Select time"
            wrapperClassName="w-full"
          />
        </div>

        {/* Persons */}
        <div className="flex items-center border-b md:border-b-0 border-gray-200 md:pr-4 flex-1 min-w-0">
          <select
            value={formData.persons}
            onChange={(e) => handleInputChange("persons", "reservation_covers", e.target.value)}
            className="text-sm md:text-base w-full text-shipGrey font-roboto focus:outline-none bg-transparent cursor-pointer appearance-none"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "Person" : "People"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-center justify-center pt-2 md:pt-0">
          <button
            className="bg-plum hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 p-3 md:p-4 rounded-full text-white shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={handleSearch}
            aria-label="Search restaurants"
          >
            <CiSearch className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="flex text-xs md:text-sm items-center justify-center text-shipGrey">
        <div className="max-w-sm m-auto font-roboto my-2 md:my-3 flex">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
        </div>
      </div>

      {isSidebarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 animate-in fade-in duration-200" onClick={toggleSidebar}>
          <div className="fixed top-0 left-0 w-[85%] sm:w-[400px] h-full bg-white shadow-2xl z-50 p-5 sm:p-6 overflow-y-auto animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ImFilter color="#9235E2" size={24} />
                <h2 className="text-xl font-agrandir font-bold text-shipGrey">Filters</h2>
                {(ratings.length + cuisinefilter.length + reviewedFilter.length) > 0 && (
                  <span className="bg-plum text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {ratings.length + cuisinefilter.length + reviewedFilter.length}
                  </span>
                )}
              </div>
              <button
                className="text-3xl font-bold text-gray-400 hover:text-gray-700 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={toggleSidebar}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            <div>
                <div className="flex flex-col bg-plum p-4 sm:p-5 w-full lg:w-80 xl:w-96 h-auto rounded-3xl border-2 border-[#B9B9B9]">
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
                
                  <div className="flex justify-between">
                               
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
                                checked={Reviewedtype.includes("most")}
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
                                checked={Reviewedtype.includes("least")}
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
            </div>
          </div>
        </div>
        )}

      <div className="lg:hidden flex justify-center mt-2">
          <button
            className="inline-flex items-center gap-2 bg-plum hover:bg-purple-700 text-white font-roboto font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            onClick={toggleSidebar}
          >
            <Sliders size={18} className="inline-block" />
            Filters
            {(ratings.length + cuisinefilter.length + reviewedFilter.length) > 0 && (
              <span className="bg-white text-plum text-xs font-bold px-2 py-0.5 rounded-full">
                {ratings.length + cuisinefilter.length + reviewedFilter.length}
              </span>
            )}
          </button>
      </div>

    </div>
  );
});

export default SearchLocationV2;