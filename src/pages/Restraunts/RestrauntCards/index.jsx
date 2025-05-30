import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
import { FaCheck } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import RestaurantCard
 from "./RestaurantCard";
const initialTypes = ["yelp", "open_table", "resy"];
const ratingtypes = ["5" , "4" , "3" , "2" , "1"];
const cuisinestypes=["Italian" , "Mediterranean" , "Mexican" , "Chinese" , "Thai"];
const Reviewedtype=["most" , "least"];
const RestaurantCards = memo(
  ({
    yelpData,
    openTableData,
    resyData,
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
    onClearFilters
  }) => {
    const { selectedTypes, ratings, cuisinefilter, reviewedFilter, showmore, allCuisines } = filters;
    const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState(formData?.term || "");

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
      let filteredRestaurants = shuffledRestaurants;

      if (selectedPriceFilter != null) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => {
          let price = null;

          if (restaurant.restraunt_type === "yelp") {
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
    }, [selectedTypes, selectedPriceFilter, selectedStarFilter, cuisinefilter, reviewedFilter, ratings, shuffledRestaurants]);
    
    // console.log("filters " , cuisinefilter ,reviewedFilter ,ratings)
    // console.log("filtered " , filteredRestaurants);

    useEffect(() => {
      const copiedRestaurantsData = JSON.parse(JSON.stringify(filteredRestaurants)); 
      setCopiedRestaurants(copiedRestaurantsData);
    }, [filteredRestaurants]);
    
    
    const fillallcuisines = () => {
      const extractedCuisines = new Set(cuisinestypes);
      
      filteredRestaurants.forEach((restaurant) => {
        if (restaurant.primaryCuisine?.name) {
          extractedCuisines.add(restaurant.primaryCuisine.name);
        }
        if (restaurant.categories) {
          restaurant.categories.forEach((category) => extractedCuisines.add(category.title));
        }
      });

      onFilterChange({ 
        allCuisines: [...extractedCuisines],
        showmore: true 
      });
    };
  
    
    const displayedCuisines = showmore ? allCuisines : cuisinestypes;
    
    return (
      <div>
        <div className="bg-plum px-4 sm:px-8 lg:px-24 py-8 sm:py-12 rounded-3xl">
        <div className="border-[0.4px] border-[#B9B9B9] rounded-[30px] p-6 sm:p-10 lg:p-14 bg-white">
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
            />
          </div>

          {/* <div className="p-4 sm:p-8">
            <div className="flex items-center gap-4 sm:gap-10">
              <div className="flex-grow bg-[#39353C] h-[1px]"></div>
              <div>
                <h1 className="text-center font-bold font-agrandir text-shipGrey text-2xl sm:text-3xl lg:text-4xl">
                  Select Platforms
                </h1>
              </div>
              <div className="flex-grow bg-[#39353C] h-[1px]"></div>
            </div>
            <div className="flex flex-col gap-6 xl:flex-row items-center py-5 mb-2 mt-2 justify-center text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 md:gap-8 lg:gap-16 xl:gap-8 my-5 md:my-0">
               
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
                    <span className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full flex items-center justify-center shadow-spanshadow">
                      {selectedTypes.includes("yelp") && <FaCheck size={18} color="#9235e2" />}

                    </span>
                  </label>
                  <img
                    src="/assets/yelp_logo_new.png"
                    alt="Yelp Logo"
                     className="w-28 h-auto sm:w-32 sm:h-14 md:w-40"
                  />
                </div>

        
                <div className="flex gap-2 sm:gap-3 items-center">
                  <label className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("resy")}
                      onChange={() => handleCheckboxChange("resy")}
                      className="hidden peer"
                    />
                    <span className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                      {selectedTypes.includes("resy") && (
                        <FaCheck size={18} color="#9235e2" />
                      )}
                    </span>
                  </label>
                  <img
                    src="/assets/resylogo.png"
                    alt="Resy Logo"
                    className="w-24 h-auto sm:w-32 sm:h-14 md:w-40 rounded-md object-cover"
                  />
                </div>

           
                <div className="flex gap-2 sm:gap-3 items-center">
                  <label className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("open_table")}
                      onChange={() => handleCheckboxChange("open_table")}
                      className="hidden peer"
                    />
                    <span className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow-spanshadow flex items-center justify-center">
                      {selectedTypes.includes("open_table") && (
                        <FaCheck size={18} color="#9235e2" />
                      )}
                    </span>
                  </label>
                  <img
                    src="/assets/opentablelogo.png"
                    alt="Open Table Logo"
                    className="w-28 h-auto sm:w-32 sm:h-14 md:w-40 object-fit"
                  />
                </div>

              </div>
              <div className="my-4 md:my-0">
                <p className="text-sm sm:text-base font-bold font-roboto text-shipGrey">
                  <img
                    src="/assets/send.png"
                    alt=""
                    className="inline mx-1 w-4 h-4"
                  />
                  <a href="" className="underline">
                    Get notified when a new platform is added!
                  </a>
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Filtered Restaurants List */}
        <div className="mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7">
        <div className="hidden lg:block bg-plum p-4 sm:p-5 w-full lg:w-80 xl:w-96 h-auto rounded-3xl border-2 border-[#B9B9B9]">
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
                <p className="font-roboto font-medium text-sm text-white">{cuisine}</p>
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
        <div className="flex-1">
          {copiedRestaurants?.map((data, index) => {
              if (data?.restraunt_type === "resy") {
                return (
                  <a
                    key={index}
                    href={`https://resy.com/cities/${data?.location?.url_slug}/venues/${data?.url_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4 sm:mb-6"
                  >
                    <RestaurantCard data={data} />
                  </a>
                );
              }

              return (
                <Link
                  key={index}
                  to={{
                    pathname: "/restaurant-detail",
                    search: `?${
                      data?.restraunt_type === "yelp"
                        ? "yelp_alias"
                        : "map_url"
                    }=${encodeURIComponent(
                      data?.restraunt_type === "yelp"
                        ? data?.alias
                        : data?.urls?.profileLink?.link
                    )}`,
                  }}
                  className="block mb-4 sm:mb-6"
                >
                  <RestaurantCard data={data} />
                </Link>
              );
            })}
            {/* {copiedRestaurants?.map((data, index) => (
              <Link
                key={index}
                to={{
                  pathname: "/restaurant-detail",
                  search: `?${
                    data?.restraunt_type === "yelp"
                      ? "yelp_alias"
                      : data?.restraunt_type === "open_table"
                      ? "map_url"
                      : data?.restraunt_type === "resy"
                      ? "details"
                      : null
                  }=${encodeURIComponent(
                    data?.restraunt_type === "yelp"
                      ? data?.alias
                      : data?.restraunt_type === "open_table"
                      ? data?.urls?.profileLink?.link
                      : data?.restraunt_type === "resy"
                      ? encodeURIComponent(JSON.stringify(data))
                      : null
                  )}`,
                }}
                className="block mb-4 sm:mb-6"
              >
                <div className="bg-white w-full p-4 sm:p-6 md:p-8 lg:p-10 shadow-cardshadow rounded-[20px] sm:rounded-[30px] flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 lg:w-2/5 h-48 sm:h-56 md:h-64 lg:h-72 mb-4 md:mb-0 md:mr-6">
                    <img
                      className="w-full h-full rounded-xl sm:rounded-2xl object-cover"
                      src={
                        data?.restraunt_type === "yelp"
                          ? data?.image_url
                          : data?.restraunt_type === "resy" &&
                            Array.isArray(data?.images) &&
                            data?.images.length > 0
                          ? data?.images[0]
                          : data?.photos?.profile?.medium?.url
                      }
                      alt={data?.name}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-agrandir mb-1 sm:mb-2 font-bold text-shipGrey">
                        {data?.name?.length > 50
                          ? `${data?.name?.slice(0, 50)}...`
                          : data?.name}
                      </p>

                      <div className="text-grey-darkest py-4 sm:py-6 flex flex-col space-y-3 sm:space-y-4">

                        <div>
                          <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                            <img
                              src="/assets/ratings.png"
                              alt="ratings logo"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                            />
                            <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                              Ratings:
                            </span>
                          </p>
                          <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                            {data.restraunt_type === "yelp"
                              ? data?.rating
                              : data.restraunt_type === "open_table"
                              ? data?.statistics?.reviews?.ratings?.overall
                                  ?.rating
                              : data.restraunt_type === "resy"
                              ? data?.rating?.average
                              : null}
                            <span className="text-sm sm:text-base">/5</span>
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                            <img
                              src="/assets/address.png"
                              alt="address logo"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                            />
                            <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                              Address:
                            </span>
                          </p>
                          <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                            {data.restraunt_type === "yelp" ? (
                              data?.location?.display_address?.join(" ")
                            ) : data?.restraunt_type === "open_table" ? (
                              <>
                                {data?.address?.line1 && `${data?.address?.line1} `}
                                <span> {data?.address?.city}</span>
                              </>
                            ) : data?.restraunt_type === "resy" ? (
                              <>
                                {data?.locality && `${data?.locality} `}
                                <span> {data?.location?.name}</span>
                              </>
                            ) : null}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                            <img
                              src="/assets/contact.png"
                              alt="contact logo"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                            />
                            <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                              Contact:
                            </span>
                          </p>
                          <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                            {data.restraunt_type === "yelp"
                              ? data?.display_phone
                              : data.restraunt_type === "open_table"
                              ? data?.contactInformation?.formattedPhoneNumber
                              : data.restraunt_type === "resy"
                              ? data?.contact?.phone_number
                              : null}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:hidden flex justify-between items-center mt-4">
                      <img
                        src={
                          data.restraunt_type === "yelp"
                            ? "/assets/yelp_logo_new.png"
                            : data.restraunt_type === "open_table"
                            ? "/assets/opentable.png"
                            : data.restraunt_type === "resy"
                            ? "/assets/resy_logo_new.png"
                            : ""
                        }
                        alt={`${data.restraunt_type} logo`}
                        className="h-8 sm:h-10"
                      />
                      <button className="rounded-full px-4 py-2 sm:px-5 sm:py-3 bg-plum text-white text-sm sm:text-base">
                        Reserve a Table
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col justify-between items-center w-24 lg:w-32 ml-4 lg:ml-6">
                    <img
                      src={
                        data.restraunt_type === "yelp"
                          ? "/assets/yelp_logo_new.png"
                          : data.restraunt_type === "open_table"
                          ? "/assets/opentable.png"
                          : data.restraunt_type === "resy"
                          ? "/assets/resy_logo_new.png"
                          : ""
                      }
                      alt={`${data.restraunt_type} logo`}
                      className="h-10 lg:h-14 mb-4"
                    />
                    <button className="rounded-full px-4 py-2 lg:px-5 lg:py-3 bg-plum text-white text-sm lg:text-base">
                      Reserve a Table
                    </button>
                  </div>
                </div>
              </Link>
            ))} */}
          </div>
       </div>
      </div>
    );
  }
);

export default RestaurantCards;
