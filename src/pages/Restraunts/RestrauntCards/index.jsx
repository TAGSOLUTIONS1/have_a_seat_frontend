import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
const initialTypes = ["yelp", "open_table", "resy"];
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/assets/slider_img_1.png",
  "/assets/slider_img_2.png",
  "/assets/slider_img_3.png",
];

const timeSlots = ["4:30", "5:15", "3:30", "6:45", "10:15", "11:30"];
const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[10px]  top-1/2 transform  bg-white rounded-full w-5 h-5  flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronLeft className="text-gray text-base" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2  top-1/2 transform  bg-white rounded-full w-5 h-5  flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronRight className="text-gray text-base" />
  </div>
);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};
const reviews = [
  {
    name: "Laura K., Miami",
    date: "30 August 2024",
    review:
      "This is easily one of the best spots I've been to in recent years. I go to man...",
    rating: 5,
  },
  {
    name: "Samantha R., Los Angeles",
    date: "10 September 2024",
    review:
      "I came here for a team dinner with colleagues. The restaurant is in a renovated ...",
    rating: 4.5,
  },
  {
    name: "Mark H., Houston",
    date: "11 October 2024",
    review:
      "Backroom was beautiful & moody. Sitting in the front wouldn't be such a vibe. S...",
    rating: 4,
  },
];

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} className="text-yellow-500" />);
    } else if (i - rating === 0.5) {
      stars.push(<AiTwotoneStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-gray-400" />);
    }
  }
  return stars;
};
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
    const [searchTerm, setSearchTerm] = useState(formData?.term || "");

    const [selectedTypes, setSelectedTypes] = useState(initialTypes);

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

      setFilteredRestaurants(filteredRestaurants);
    }, [
      selectedStarFilter,
      selectedPriceFilter,
      selectedCuisineFilter,
      shuffledRestaurants,
    ]);

    // const handleCheckboxChange = (type) => {
    //   setSelectedTypes((prevSelectedTypes) => {
    //     if (prevSelectedTypes.includes(type)) {
    //       return prevSelectedTypes.filter((t) => t !== type);
    //     } else {
    //       return [...prevSelectedTypes, type];
    //     }
    //   });
    // };

    const handleCheckboxChange = (type) => {
      setSelectedTypes((prevSelectedTypes) => {
        if (prevSelectedTypes.includes(type)) {
          // Remove type when unchecked
          return prevSelectedTypes.filter((t) => t !== type);
        } else {
          // Add type when checked
          return [...prevSelectedTypes, type];
        }
      });
    };

    // const shuffleArray = (array) => {
    //   for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    //   }
    //   return array;
    // };

    return (
      <div>
        <div className=" border-gray-200 rounded-lg shadow-sm bg-white">
          <SearchLocationV2 />
        </div>

        <div className="p-10">
          <div className="flex items-center gap-10">
            <div className="flex-grow bg-[#39353C] h-[1px]"></div>
            <div>
              <h1 className="text-center text-3xl">Select Platforms</h1>
            </div>
            <div className="flex-grow bg-[#39353C] h-[1px]"></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center py-5 mb-2 mt-2 justify-center text-center">
            <div className="flex justify-center sm:items-center gap-10 sm:justify-center">
              {/* Yelp */}
              <div className="flex gap-3 items-center">
                <label className="relative">
                  <input
                    type="checkbox"
                    id="checkbox3"
                    name="checkbox3"
                    checked={selectedTypes.includes("yelp")}
                    onChange={() => handleCheckboxChange("yelp")}
                    className="hidden peer"
                  />
                  <span className="w-8 h-8 sm:w-10 sm:h-10 bg-plum cursor-pointer rounded-full flex items-center justify-center peer-checked:before:content-['✔'] peer-checked:before:text-white peer-checked:before:text-xl peer-checked:bg-plum"></span>
                </label>
                <img
                  src="/assets/yelp_logo_new.png"
                  alt="Yelp Logo"
                  className="w-20 h-7 sm:w-32 sm:h-14 md:w-40"
                />
              </div>

              {/* Resy */}
              <div className="flex gap-3 items-center">
                <label className="relative">
                  <input
                    type="checkbox"
                    id="checkbox1"
                    name="checkbox1"
                    checked={selectedTypes.includes("resy")}
                    onChange={() => handleCheckboxChange("resy")}
                    className="hidden peer"
                  />
                  <span className="w-8 h-8 sm:w-10 sm:h-10 bg-plum cursor-pointer rounded-full flex items-center justify-center peer-checked:before:content-['✔'] peer-checked:before:text-white peer-checked:before:text-xl peer-checked:bg-plum"></span>
                </label>
                <img
                  src="/assets/resy_logo_new.png"
                  alt="Resy Logo"
                  className="w-20 h-8 sm:w-32 sm:h-12 md:w-40 rounded-md"
                />
              </div>

              {/* OpenTable */}
              <div className="flex gap-3 items-center">
                <label className="relative">
                  <input
                    type="checkbox"
                    id="checkbox2"
                    name="checkbox2"
                    checked={selectedTypes.includes("open_table")}
                    onChange={() => handleCheckboxChange("open_table")}
                    className="hidden peer"
                  />
                  <span className="w-8 h-8 sm:w-10 sm:h-10 bg-plum cursor-pointer rounded-full flex items-center justify-center peer-checked:before:content-['✔'] peer-checked:before:text-white peer-checked:before:text-xl peer-checked:bg-plum"></span>
                </label>
                <img
                  src="/assets/opentable.png"
                  alt="Open Table Logo"
                  className="w-22 h-7 sm:w-32 sm:h-14 md:w-40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filtered Restaurants List */}
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
              <div className="bg-white w-full mb-2 p-10  shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest">
                <div className="w-full md:w-1/3 lg:w-1/3 md:h-[15rem] lg:h-[20rem]">
                  <img
                    className="h-1/3 md:h-full lg:h-full w-full rounded-2xl object-cover"
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
                  {console.log("open table phtotos", data?.photos)}
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2  select-none">
                  <div className=" p-5 flex-1">
                    <h1 className="text-3xl mb-1 font-semibold text-grey-darkest">
                      {data?.name?.length > 50
                        ? `${data?.name?.slice(0, 50)}...`
                        : data?.name}
                    </h1>

                    <div className="text-grey-darkest py-8 flex flex-col space-y-4">
                      <div>
                        <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                          <img
                            src="/assets/ratings.png"
                            alt="ratings logo"
                            className="h-5 w-5"
                          />
                          <span>Ratings:</span>
                        </h4>

                        <p className="px-8">
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

                      <div className="stext-base">
                        <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                          <img
                            src="/assets/address.png"
                            alt="address logo"
                            className="h-5 w-5"
                          />
                          <span>Address:</span>
                        </h4>
                        <p className="px-8">
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
                        </p>
                      </div>
                      <div className="pr-2 text-base">
                        <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                          <img
                            src="/assets/contact.png"
                            alt="address logo"
                            className="h-5 w-5"
                          />
                          <span>Contact:</span>
                        </h4>
                        <p className="px-8">
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
                </div>
                <div className="hidden md:block lg:block  border-gray-300  my-6"></div>
                <div className="w-full flex justify-center items-center md:w-[150px] lg:w-[150px] mx-auto md:mx-6 lg:mx-6">
                  <div className="flex flex-col justify-between h-full">
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
                      width={100}
                      height={64}
                      className="mb-2"
                    />

                    <div className="flex-grow"></div>
                    <div className="bg-grey-lighter  flex items-center justify-between transition hover:bg-grey-light cursor-pointer mt-2">
                      <button className="rounded-full p-3 bg-purple-600 text-white ">
                        Reserve a Table
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
