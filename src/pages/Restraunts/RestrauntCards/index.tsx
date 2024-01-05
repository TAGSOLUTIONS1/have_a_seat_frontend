import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface RestaurantCardsProps {
  openTableData: any[];
  yelpData: any[];
  resyData: any[];
}

const RestaurantCards: React.FC<RestaurantCardsProps> = ({
  yelpData,
  openTableData,
  resyData,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [shuffledRestaurants, setShuffledRestaurants] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (
      (yelpData && yelpData.length > 0) ||
      (openTableData && openTableData.length > 0) ||
      (resyData && resyData.length > 0)
    ) {
      const mergedRestaurants: any = [];

      if (yelpData && yelpData.length > 0) {
        mergedRestaurants.push(
          ...yelpData.map((restaurant: any) => ({
            ...restaurant,
            restraunt_type: "yelp",
          }))
        );
      }
      if (openTableData && openTableData.length > 0) {
        mergedRestaurants.push(
          ...openTableData.map((restaurant: any) => ({
            ...restaurant,
            restraunt_type: "open_table",
          }))
        );
      }
      if (resyData && resyData.length > 0) {
        mergedRestaurants.push(
          ...resyData.map((restaurant: any) => ({
            ...restaurant,
            restraunt_type: "resy",
          }))
        );
      }

      for (let i = mergedRestaurants?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mergedRestaurants[i], mergedRestaurants[j]] = [
          mergedRestaurants[j],
          mergedRestaurants[i],
        ];
      }

      setShuffledRestaurants(mergedRestaurants);
      setLoading(false);
    } else {
      setErrorMessage("OOPS! No restaurant to display");
      setLoading(false);
    }
  }, [yelpData, openTableData, resyData]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {errorMessage && errorMessage !== null ? (
            <h1 className="text-3xl text-red-600 italic">{errorMessage}</h1>
          ) : null}
          {shuffledRestaurants?.map((data: any, index: any) => (
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
                    ? "venue_id"
                    : null
                }=${encodeURIComponent(
                  data?.restraunt_type === "yelp"
                    ? data?.alias
                    : data?.restraunt_type === "open_table"
                    ? data?.urls?.profileLink?.link
                    : data?.restraunt_type === "resy"
                    ? data?.id?.resy
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
                  alt="Restaurant"
                />
                <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2">
                  <div className="p-4 pb-0 flex-1">
                    <h1 className=" text-3xl font-light mb-1 text-grey-darkest">
                      <strong>{data.name}</strong>
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
                      Book Now
                    </button>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantCards;
