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


        // const shuffledRestaurants = mergedRestaurants.sort((a, b) => {
        //   const keyA = (a.name + a.id).toLowerCase();
        //   const keyB = (b.name + b.id).toLowerCase();
        //   return keyA.localeCompare(keyB);
        // });
        
        setShuffledRestaurants(mergedRestaurants);
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

        </div>

        {/* Filtered Restaurants List */}
        <div className="mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7">
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
              // if (data?.restraunt_type === "resy") {
              //   return (
              //     <a
              //       key={index}
              //       href={`https://resy.com/cities/${data?.location?.url_slug}/venues/${data?.url_slug}`}
              //       target="_blank"
              //       rel="noopener noreferrer"
              //       className="block mb-4 sm:mb-6"
              //     >
              //       <RestaurantCard data={data} />
              //     </a>
              //   );
              // }

              return (
                <Link
                  key={index}
                  to={{
                    pathname: "/restaurant-detail",
                    search: `?${
                      data?.restraunt_type === "yelp"
                        ? "yelp_alias"
                        :data?.restraunt_type === "open_table"
                        ? "map_url"
                        : "resy_alias"
                    }=${encodeURIComponent(
                      data?.restraunt_type === "yelp"
                        ? data?.alias
                        : data?.restraunt_type === "open_table"
                        ? data?.urls?.profileLink?.link
                        : data?.id?.resy
                    )}`,
                  }}
                  className="block mb-4 sm:mb-6"
                >
                  <RestaurantCard data={data} />
                </Link>
              );
            })}

          </div>
       </div>
      </div>
    );
  }
);

export default RestaurantCards;
