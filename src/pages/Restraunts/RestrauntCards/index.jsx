import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
import { FaCheck } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";

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
    return (
      <div>
        <div className="bg-plum px-24 pt-12 rounded-3xl">
          <div className="border-[0.4px] border-[#B9B9B9] rounded-[30px] p-14 bg-white">
            <SearchLocationV2 />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-10">
              <div className="flex-grow bg-[#39353C] h-[1px]"></div>
              <div>
                <h1 className="text-center font-bold font-agrandir text-shipGrey text-4xl">Select Platforms</h1>
              </div>
              <div className="flex-grow bg-[#39353C] h-[1px]"></div>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row items-center py-5 mb-2 mt-2 justify-center text-center">
              <div className="flex justify-center sm:items-center gap-16 my-5 md:my-0 sm:justify-center">
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
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-white cursor-pointer 
                    rounded-full flex items-center justify-center shadow-spanshadow"
                    >
                      {selectedTypes.includes("yelp") && <FaCheck size={23} color="#9235e2" />}

                    </span>
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
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-white cursor-pointer rounded-full shadow-spanshadow
                    flex items-center justify-center 
                    ">
                        {selectedTypes.includes("resy") && <FaCheck size={23} color="#9235e2" />}
                    </span>
                  </label>
                  <img
                    src="/assets/resylogo.png"
                    alt="Resy Logo"
                    className="w-26 h-6 sm:w-32 sm:h-12 md:w-40 rounded-md object-cover"
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
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-white cursor-pointer rounded-full shadow-spanshadow
                    flex items-center justify-center 
                    ">
                      {selectedTypes.includes("open_table") && <FaCheck size={23} color="#9235e2" />}
                    </span>
                  </label>
                  <img
                    src="/assets/opentablelogo.png"
                    alt="Open Table Logo"
                    className="w-22 h-7 sm:w-32 sm:h-14 md:w-40 object-fit"
                  />
                </div>

              </div>
              <div className="my-4 md:my-0">
                <p className="text-base font-bold font-roboto text-shipGrey"> 
                <img src="/assets/send.png" alt="" className="inline mx-1" /> 
              <a href="" className="underline">Get notified when a new platform is added!</a></p></div>

            </div>
          </div>
        </div>

        {/* Filtered Restaurants List */}
       <div className="mt-10 px-8 flex gap-7">
        <div className="bg-plum p-5 min-w-80 h-[700px] rounded-3xl border-2 border-[#B9B9B9]">
          <div className="flex gap-4 items-center">
          <ImFilter color="#ffffff"></ImFilter>
          <p className="font-agrandir text-xl font-bold text-white">Filter By</p>
          </div>

          <div className="border-[#FFFFFF] border-t-[0.7px] my-5"></div>

            <p className="font-agrandir text-xs font-bold text-white uppercase">Restaurant Rating</p>
            <div className="my-7 flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                <label className="">
                    <input
                      type="checkbox"
                      id="checkboxr1"
                      name="checkboxr1"
                      checked={ratingtypes.includes("5")}
                      onChange={()=> handleratingschange("5")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                    >
                      {ratings.includes("5") && <FaCheck size={13} color="#9235e2" />}
                      
                    </span>
                  </label>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                </div>
                <div className="flex gap-2 items-center">

                  <label className="">
                    <input
                      type="checkbox"
                      id="checkboxr1"
                      name="checkboxr1"
                      checked={ratingtypes.includes("4")}
                      onChange={()=> handleratingschange("4")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                    >
                      {ratings.includes("4") && <FaCheck size={13} color="#9235e2" />}

                    </span>
                  </label>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="">
                    <input
                      type="checkbox"
                      id="checkboxr1"
                      name="checkboxr1"
                      checked={ratingtypes.includes("3")}
                      onChange={()=> handleratingschange("3")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                    >
                      {ratings.includes("3") && <FaCheck size={13} color="#9235e2" />}

                    </span>
                  </label>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="">
                    <input
                      type="checkbox"
                      id="checkboxr1"
                      name="checkboxr1"
                      checked={ratingtypes.includes("2")}
                      onChange={()=> handleratingschange("2")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                    >
                      {ratings.includes("2") && <FaCheck size={13} color="#9235e2" />}

                    </span>
                  </label>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="">
                    <input
                      type="checkbox"
                      id="checkboxr1"
                      name="checkboxr1"
                      checked={ratingtypes.includes("1")}
                      onChange={()=> handleratingschange("1")}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
                    flex items-center justify-center"
                    >
                      {ratings.includes("1") && <FaCheck size={13} color="#9235e2" />}

                    </span>
                  </label>
                  <IoIosStar color="#FFCC00" size={18}></IoIosStar>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                  <IoIosStarOutline color="#ffffff" size={18}></IoIosStarOutline>
                </div>
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
                onChange={()=> handlereviewtypechange("most")}
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
                onChange={()=> handlereviewtypechange("least")}
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
            <div className="flex gap-4 items-center">
            <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={cuisinestypes.includes("Italian")}
                onChange={()=> handlecuisinetypechange("Italian")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {cuisinefilter.includes("Italian") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Italian</p>
            </div>
            <div className="flex gap-4 items-center">
            <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={cuisinestypes.includes("Mediterranean")}
                onChange={()=> handlecuisinetypechange("Mediterranean")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {cuisinefilter.includes("Mediterranean") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Mediterranean</p>
            </div>

            <div className="flex gap-4 items-center">
            <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={cuisinestypes.includes("Mexican")}
                onChange={()=> handlecuisinetypechange("Mexican")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {cuisinefilter.includes("Mexican") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Mexican</p>
            </div>

            <div className="flex gap-4 items-center">
            <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={cuisinestypes.includes("Chinese")}
                onChange={()=> handlecuisinetypechange("Chinese")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {cuisinefilter.includes("Chinese") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Chinese</p>
            </div>

            <div className="flex gap-4 items-center">
            <label className="">
              <input
                type="checkbox"
                id="checkboxr1"
                name="checkboxr1"
                checked={cuisinestypes.includes("Thai")}
                onChange={()=> handlecuisinetypechange("Thai")}
                className="hidden peer"
              />
              <span className="w-5 h-5 sm:w-5 sm:h-5 rounded-sm bg-white cursor-pointer 
              flex items-center justify-center"
              >
                {cuisinefilter.includes("Thai") && <FaCheck size={13} color="#9235e2" />}
                
              </span>
            </label>
            <p className="font-roboto font-medium text-sm text-white">Thai</p>
            </div>
            <p className="font-roboto font-medium text-sm text-white underline cursor-pointer">Show More</p>
            </div>

        </div>
        <div className="">
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
              <div className="bg-white w-full mb-2 p-10 shadow-cardshadow rounded-[30px] flex flex-col md:flex-row lg:flex-row card">
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
                  
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2  select-none">
                  <div className=" p-5 flex-1">
                    <p className="text-4xl font-agrandir mb-1 font-bold text-shipGrey">
                      {data?.name?.length > 50
                        ? `${data?.name?.slice(0, 50)}...`
                        : data?.name}
                    </p>

                    <div className="text-grey-darkest py-8 flex flex-col space-y-4">
                      <div>
                        <p className="font-semibold flex gap-3 items-center md:text-[1.25rem]">
                          <img
                            src="/assets/ratings.png"
                            alt="ratings logo"
                            className="h-4 w-4 md:h-5 md:w-5"
                          />
                          <span className="font-roboto font-semibold text-xl text-shipGrey">Ratings:</span>
                        </p>

                        <p className="px-8 font-roboto font-normal text-base text-shipGrey">
                          
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

                      <div className="text-sm md:text-base">
                        <p className="font-semibold flex gap-3 items-center md:text-[1.25rem]">
                          <img
                            src="/assets/address.png"
                            alt="address logo"
                            className="h-4 w-4 md:h-5 md:w-5"
                          />
                          <span className="font-roboto font-semibold text-xl text-shipGrey">Address:</span>
                        </p>
                        <p className="px-8 font-roboto font-normal text-base text-shipGrey">
                          {data.restraunt_type === "yelp" ? (
                            <p>{data?.location?.display_address?.join(' ')}</p>
                          ) : data?.restraunt_type === "open_table" ? (
                            <div>
                              <p>
                                {data?.address?.line1 &&
                                  `${data?.address?.line1} `}
                                  <span> {data?.address?.city}</span>
                              </p>
                            </div>
                          ) : data?.restraunt_type === "resy" ? (
                            <div>
                              {data?.locality && `${data?.locality} `}
                              <span> {data?.location?.name}</span>
                            </div>
                          ) : null}
                        </p>
                      </div>
                      <div className="pr-2 text-sm md:text-base">
                        <p className="font-semibold flex gap-3 items-center md:text-[1.25rem]">
                          <img
                            src="/assets/contact.png"
                            alt="address logo"
                            className="h-4 w-4 md:h-5 md:w-5"
                          />
                          <span className="font-roboto font-semibold text-xl text-shipGrey">Contact:</span>
                        </p>
                        <p className="px-8 font-roboto font-normal text-base text-shipGrey">
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
                      <button className="rounded-full p-3 px-4 bg-plum text-white ">
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
      </div>
    );
  }
);

export default RestaurantCards;
