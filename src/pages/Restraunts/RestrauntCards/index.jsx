import React, { memo, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Loader from "@/components/Loader";

import InfiniteScroll from "react-infinite-scroll-component";

const RestaurantCards = memo(
  ({
    yelpData,
    openTableData,
    resyData,
    formData,
    selectedStarFilter,
    selectedPriceFilter,
    selectedCuisineFilter,
  }) => {
    const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    localStorage.getItem("user");
    const user = JSON.parse(localStorage.getItem("user"));
    

    const initialTypes = user
      ? [
          user?.link_restaurant?.yelp ? "yelp" : null,
          user?.link_restaurant?.opentable ? "open_table" : null,
          user?.link_restaurant?.resy ? "resy" : null,
        ].filter(Boolean) // Only include linked platforms
      : ["yelp", "open_table", "resy"]; 

      console.log(initialTypes)
    const [selectedTypes, setSelectedTypes] = useState(initialTypes);

    useEffect(() => {
      setItemsPerPage(10);
      if (
        (yelpData && yelpData.length > 0 && selectedTypes.includes("yelp")) ||
        (openTableData &&
          openTableData.length > 0 &&
          selectedTypes.includes("open_table")) ||
        (resyData && resyData.length > 0 && selectedTypes.includes("resy"))
      ) {
        const mergedRestaurants = [];

        if (yelpData && yelpData.length > 0 && selectedTypes.includes("yelp")) {
          mergedRestaurants.push(
            ...yelpData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "yelp",
            }))
          );
        }

        if (
          openTableData &&
          openTableData.length > 0 &&
          selectedTypes.includes("open_table")
        ) {
          mergedRestaurants.push(
            ...openTableData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "open_table",
            }))
          );
        }

        if (resyData && resyData.length > 0 && selectedTypes.includes("resy")) {
          mergedRestaurants.push(
            ...resyData.map((restaurant) => ({
              ...restaurant,
              restraunt_type: "resy",
            }))
          );
        }

        const shuffledRestaurants = shuffleArray(mergedRestaurants);

        const termLowerCase = formData?.term?.trim()?.toLowerCase() || "";

        const matchedRestaurant = shuffledRestaurants.find((restaurant) => {
          const name = restaurant.name.toLowerCase();
          return name === termLowerCase && termLowerCase !== "";
        });

        const filteredRestaurants = shuffledRestaurants.filter((restaurant) => {
          const name = restaurant.name.toLowerCase();
          return !(name === termLowerCase && termLowerCase !== "");
        });

        if (matchedRestaurant) {
          filteredRestaurants.unshift(matchedRestaurant);
        }

        setShuffledRestaurants(filteredRestaurants);
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
          } else if (
            restaurant.restraunt_type === "open_table" ||
            restaurant.restraunt_type === "resy"
          ) {
            switch (restaurant.priceBand?.priceBandId || restaurant.price_range_id) {
              case 1:
                price = 1;
                break;
              case 2:
                price = 2;
                break;
              case 3:
                price = 3;
                break;
              case 4:
                price = 4;
                break;
              default:
                price = null;
            }
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
            cuisine = restaurant?.categories?.map((category) => category.title.toLowerCase()).join(", ");
          } else if (restaurant.restraunt_type === "open_table") {
            cuisine = restaurant?.primaryCuisine?.name?.toLowerCase();
          } else if (restaurant.restraunt_type === "resy") {
            cuisine = restaurant?.cuisine?.map((cuisineItem) => cuisineItem.toLowerCase()).join(", ");
          }
      
          return cuisine != null && cuisine.includes(selectedCuisineFilter.toLowerCase());
        });
      }

      setFilteredRestaurants(filteredRestaurants);
      console.log(filteredRestaurants);
    }, [
      selectedStarFilter,
      selectedPriceFilter,
      selectedCuisineFilter,
      shuffledRestaurants,
    ]);

    const handleCheckboxChange = (type) => {
      setSelectedTypes((prevSelectedTypes) => {
        if (prevSelectedTypes.includes(type)) {
          return prevSelectedTypes.filter((t) => t !== type);
        } else {
          return [...prevSelectedTypes, type];
        }
      });
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return (
      <div>
        <div className="flex flex-col small:flex-row items-center p-1 mb-2 mt-2 justify-center text-center border-2 rounded-lg shadow-sm">
          <div className="flex flex-row justify-center md:flex-row sm:items-center sm:justify-center">
            <div className="flex justify-between sm:mr-4 sm:mb-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="checkbox1"
                  name="checkbox1"
                  checked={selectedTypes.includes("resy")}
                  className="h-4 w-4 rounded-full sm:h-6 sm:w-6 mr-1"
                  onChange={() => handleCheckboxChange("resy")}
                />
              </div>
              <img
                src="/assets/resy_logo_new.png"
                alt="Logo 1"
                className="w-20 h-8 sm:w-32 sm:h-12 md:w-36 lg:w-36 mr-1 small:w-20 small:h-9 rounded-full"
              />
            </div>

            <div className="flex justify-center sm:mr-4 sm:mb-0">
              <div className="flex items-center mr-2 sm:mr-4">
                <input
                  type="checkbox"
                  id="checkbox3"
                  name="checkbox3"
                  checked={selectedTypes.includes("yelp")}
                  className="h-4 w-4 rounded-full sm:h-6 sm:w-6 text-purple-600"
                  onChange={() => handleCheckboxChange("yelp")}
                />
              </div>
              <img
                src="/assets/yelp_logo_new.png"
                alt="Logo 3"
                className="w-20 h-7 sm:w-32 sm:h-14 md:w-36 lg:w-36 small:w-20 small:h-9"
              />
            </div>
          </div>

          <div className="flex justify-center mt-2 sm:ml-4">
            <div className="flex items-center mr-2 sm:mr-4">
              <input
                type="checkbox"
                id="checkbox2"
                name="checkbox2"
                checked={selectedTypes.includes("open_table")}
                className="h-4 w-4 rounded-full sm:h-6 sm:w-6"
                onChange={() => handleCheckboxChange("open_table")}
              />
            </div>
            <img
              src="/assets/opentable.png"
              alt="Logo 2"
              className="w-13 h-7 sm:w-32 sm:h-12 md:w-36 md:h-11 lg:w-36 "
            />
          </div>
        </div>
        <div>
          {filteredRestaurants?.map((data, index) => (
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
            >
              <div
                key={index}
                className="bg-white w-full mb-2 p-1 md:h-[15rem] lg:h-[15rem] shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest"
              >
                <img
                  className="w-full md:w-1/3 lg:w-1/3 h-1/3 md:h-full lg:h-full rounded-2xl object-cover"
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
                <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2 select-none">
                  <div className="p-4 pb-0 flex-1">
                    <h1 className="text-2xl lg:text-3xl font-light mb-1 text-grey-darkest">
                      <strong>
                        {data?.name?.length > 50
                          ? `${data?.name?.slice(0, 50)}...`
                          : data?.name}
                      </strong>
                    </h1>
                    <br />
                    <span className="text-grey-darkest">
                      <h2 className="font-bold">Rating</h2>
                      <i className="fas fa-map-marker-alt mr-1 text-grey-dark"></i>

                      {data.restraunt_type === "yelp"
                        ? data?.rating
                        : data.restraunt_type === "open_table"
                        ? data?.statistics?.reviews?.ratings?.overall?.rating
                        : data.restraunt_type === "resy"
                        ? data?.rating?.average
                        : null}

                      <span className="text-base sm:text-lg">/5</span>
                    </span>
                    
                    {data?.statistics?.recentReservationCount > 0 && (
                  <div className="flex justify-between text-sm items-center">
                    <div className="flex items-center">
                      <span>
                        <strong>Booked {data.statistics.recentReservationCount} times today</strong>
                      </span>
                    </div>
                  </div>
                )}
                    <div className="flex items-center mt-4">
                      <div className="pr-2 text-base">
                        <h2 className="font-bold">Address:</h2>
                        <div>
                          {" "}
                          {data.restraunt_type === "yelp" ? (
                            <p>{data?.location?.display_address}</p>
                          ) : data?.restraunt_type === "open_table" ? (
                            <div>
                              <p>
                                {data?.address?.line1 &&
                                  `${data?.address?.line1} `}
                                {data?.address?.city}
                              </p>
                            </div>
                          ) : data?.restraunt_type === "resy" ? (
                            <div>
                              {data?.locality && `${data?.locality} `}
                              {data?.location?.name}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
                <div className="hidden md:block lg:block border-l border-gray-300 h-44 my-6"></div>
                <div className="w-full flex justify-center items-center md:w-[150px] lg:w-[150px] mx-auto md:mx-6 lg:mx-6">
                  <div className="flex flex-col items-center">
                    {data.restraunt_type === "yelp" ? (
                      <img
                        src="/assets/yelp_logo_new.png"
                        alt="yelp logo"
                        width={86}
                        height={64}
                        className="mb-2"
                      />
                    ) : data.restraunt_type === "open_table" ? (
                      <img
                        src="/assets/opentable.png"
                        alt="open table logo"
                        width={106}
                        height={84}
                        className="mb-2"
                      />
                    ) : data.restraunt_type === "resy" ? (
                      <img
                        src="/assets/resy_logo_new.png"
                        alt="resy logo"
                        width={76}
                        height={54}
                        className="mb-2"
                      />
                    ) : null}

                    <div className="text-center md:mt-4 lg:mt-4">
                      {data.restraunt_type === "yelp"
                        ? data?.display_phone
                        : data.restraunt_type === "open_table"
                        ? data?.contactInformation?.formattedPhoneNumber
                        : data.restraunt_type === "resy"
                        ? data?.contact?.phone_number
                        : null}
                    </div>

                    <div className="bg-grey-lighter p-3 flex items-center justify-between transition hover:bg-grey-light cursor-pointer mt-2">
                      <button className="rounded-full bg-purple-600 text-white p-2">
                        Detail
                      </button>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
);

export default RestaurantCards;
