import React, { memo, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Loader from "@/components/Loader";

import InfiniteScroll from "react-infinite-scroll-component";

const RestaurantCards = memo(
  ({ yelpData, openTableData, resyData, formData }) => {
    const [shuffledRestaurants, setShuffledRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState([
      "yelp",
      "open_table",
      "resy",
    ]);

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

        const termLowerCase =
          formData?.term?.trim()?.toLowerCase() || '';
    
        const matchedRestaurant = shuffledRestaurants.find((restaurant) => {
          const name = restaurant.name.toLowerCase();
          return name === termLowerCase && termLowerCase !== '';
        });
    
        const filteredRestaurants = shuffledRestaurants.filter((restaurant) => {
          const name = restaurant.name.toLowerCase();
          return !(name === termLowerCase && termLowerCase !== '');
        });
    
        if (matchedRestaurant) {
          filteredRestaurants.unshift(matchedRestaurant);
        }

        filteredRestaurants.forEach((restaurant) => {
          console.log(restaurant.name);
        });
    
        setShuffledRestaurants(filteredRestaurants);
      } else {
        setShuffledRestaurants([]);
      }
    }, [yelpData, openTableData, resyData, selectedTypes, formData.term]);

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

    const fetchMoreData = () => {
      if (!hasMore) {
        return;
      }
      const allData = [...yelpData, ...openTableData, ...resyData];
      const startIdx = currentPage * itemsPerPage;
      const endIdx = (currentPage + 1) * itemsPerPage;
      if (startIdx >= allData.length) {
        setHasMore(false);
        return;
      }
      const shuffledData = shuffleArray(allData.slice(startIdx, endIdx));
      setShuffledRestaurants((prevData) => [...prevData, ...shuffledData]);
      setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
      <div>
        <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row items-center p-1 mb-2 mt-8 justify-center text-center  border-2 rounded-lg shadow-sm">
          <div className="md:mr-4 lg:mr-4">
            <input
              type="checkbox"
              id="checkbox1"
              name="checkbox1"
              defaultChecked
              className=" h-6 w-6 rounded-full"
              onChange={() => handleCheckboxChange("resy")}
            />
          </div>
          <img
            src="/assets/resy_logo_new.png"
            alt="Logo 1"
            className="w-[40%] md:w-[10%] lg:w-[10%] sm:w-[40%] h-12 md:h-9 lg:h-9 mb-1 md:mr-10 lg:mr-10"
          />
          <div className="border-r hidden md:block lg:block border-gray-300 h-10 my-1 mx-4"></div>
          <div className="md:mr-4 lg:mr-4 mt-4 md:mt-0 lg:mt-0">
            <input
              type="checkbox"
              id="checkbox2"
              name="checkbox2"
              defaultChecked
              className="h-6 w-6 md:ml-10 lg:ml-10"
              onChange={() => handleCheckboxChange("open_table")}
            />
          </div>
          <img
            src="/assets/opentable.png"
            alt="Logo 2"
            className="w-[50%] md:w-[14%] lg:w-[14%] h-14 md:h-10 lg:h-10 mb-1 md:mr-10 lg:mr-10"
          />
          <div className="border-r hidden md:block lg:block border-gray-300 h-10 my-1 mx-4"></div>
          <div>
            <input
              type="checkbox"
              id="checkbox3"
              name="checkbox3"
              defaultChecked
              className="mr-4 md:ml-6 lg:ml-6 h-6 w-6 text-purple-600"
              onChange={() => handleCheckboxChange("yelp")}
            />
          </div>
          <img
            src="/assets/yelp_logo_new.png"
            alt="Logo 3"
            className=" mb-1 w-[40%] md:w-[8%] lg:w-[8%] h-14 md:h-8 lg:h-8"
          />
        </div>
          <div>
            {shuffledRestaurants?.map((data, index) => (
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
                  className="bg-white w-full mb-2 p-1 h-[640px] md:h-[15rem] lg:h-[15rem] shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest"
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
                      <h1 className=" text-3xl font-light mb-1 text-grey-darkest">
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
                  <div className=" w-full md:w-[150px] lg:w-[150px] ml-6  justify-center items-center md:m-6 lg:m-6">
                    {data.restraunt_type === "yelp" ? (
                      <img
                        src="/assets/yelp_logo_new.png"
                        alt="yelp logo"
                        width={86}
                        height={64}
                        className=" ml-30 md:ml-10 lg:ml-16 mb-2"
                      />
                    ) : data.restraunt_type === "open_table" ? (
                      <img
                        src="/assets/opentable.png"
                        alt="open table logo"
                        width={106}
                        height={84}
                        className=" ml-30 md:ml-8 lg:ml-16 mb-2"
                      />
                    ) : data?.restraunt_type === "resy" ? (
                      <img
                        src="/assets/resy_logo_new.png"
                        alt="open table logo"
                        width={76}
                        height={54}
                        className=" ml-30 md:ml-8 lg:ml-16 mb-2"
                      />
                    ) : null}
                    <div className="md:mt-4 lg:mt-4">
                      {data.restraunt_type === "yelp"
                        ? data?.display_phone
                        : data.restraunt_type === "open_table"
                        ? data?.contactInformation?.formattedPhoneNumber
                        : data.restraunt_type === "resy"
                        ? data?.contact?.phone_number
                        : null}
                    </div>
                    <div className="bg-grey-lighter p-3 flex items-center justify-between transition hover:bg-grey-light cursor-pointer">
                      <button className="rounded-full bg-purple-600 text-white p-2">
                        Detail
                      </button>
                      <i className="fas fa-chevron-right"></i>
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
