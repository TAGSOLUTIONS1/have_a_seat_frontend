import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";
// import { yelpRestraunt } from "@/mockData";
// import { openTableRestraunt } from "@/mockData";

interface RestaurantCardsProps {
  openTableData: any[];
  yelpData:any[];
}

const RestaurantCards: React.FC<RestaurantCardsProps> = ({ yelpData,openTableData }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [yelpRestraunt , setYelpRestraunt] = useState<any>()
  const [openTableRestraunt , setOpenTableRestraunt] = useState<any>()

  useEffect(() => {
    if ((openTableData && openTableData?.length > 0) && (yelpData && yelpData?.length > 0)) {
      setLoading(false);
      setYelpRestraunt(yelpData)
      setOpenTableRestraunt(openTableData)
      console.log(openTableData , "ooppeennttaabbllee");
    }
  }, [openTableData , yelpData]);

  const mergeAndShuffleRestaurants = () => {
    const mergedRestaurants:any = [];
    const maxLength = Math.max(yelpRestraunt?.length, openTableRestraunt?.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < yelpRestraunt?.length) {
        const yelpRestaurant = { ...yelpRestraunt[i], restraunt_type: "yelp" };
        mergedRestaurants.push(yelpRestaurant);
      }
      if (i < openTableRestraunt?.length) {
        const openTableRestaurant = {
          ...openTableRestraunt[i],
          restraunt_type: "open_table",
        };
        mergedRestaurants.push(openTableRestaurant);
      }
    }

    for (let i = mergedRestaurants?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mergedRestaurants[i], mergedRestaurants[j]] = [
        mergedRestaurants[j],
        mergedRestaurants[i],
      ];
    }
    return mergedRestaurants;
  };

  const shuffledRestaurants = mergeAndShuffleRestaurants();
  console.log(shuffledRestaurants)

  return (
    <div>
      {loading ? (
        <Loader/>
      ) : (
      <div>
        {shuffledRestaurants?.map((data:any, index:any) => (
          <Link
            key={index}
            to={{
              pathname: "/restaurant-detail",
              search: `?${
                data?.restraunt_type === "yelp" ? "yelp_alias" : "map_url"
              }=${encodeURIComponent(
                data?.restraunt_type === "yelp"
                  ? data?.alias
                  : data?.urls?.profileLink?.link
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
                  data.restraunt_type === "yelp"
                    ? data?.image_url
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
                    <h2  className="font-bold">Rating</h2>
                    <i className="fas fa-map-marker-alt mr-1 text-grey-dark"></i>
                    {data.restraunt_type === "yelp"
                      ? data?.rating
                      : data?.statistics?.reviews?.ratings?.overall?.rating}
                    <span className="text-base sm:text-lg">/5</span>
                  </span>
                  <div className="flex items-center mt-4">
                    <div className="pr-2 text-base">
                      <h2  className="font-bold">Address:</h2>
                      <div>
                        {" "}
                        {data.restraunt_type === "yelp" ? (
                          <p>
                            {data?.location?.display_address}
                          </p>
                        ) : (
                          <div>
                            <p>
                              {data?.address?.line1 &&
                                `${data?.address?.line1} `}
                              {data?.address?.city}
                            </p>
                          </div>
                        )}
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
                ) : null}
                <div className="md:mt-4 lg:mt-4"> 
                  {data.restraunt_type === "yelp"
                      ? data?.display_phone
                      : data?.contactInformation?.formattedPhoneNumber
                      }
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
