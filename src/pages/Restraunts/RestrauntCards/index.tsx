import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "@/contexts/authContext/AuthProvider";
import Loader from "@/components/Loader";

interface RestaurantCardsProps {
  apiData: any[];
}

const RestaurantCards: React.FC<RestaurantCardsProps> = ({ apiData }) => {
  const [loading, setLoading] = useState<boolean>(true);
  // const { authState } = useAuth();
  
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      setLoading(false);
      console.log(apiData)
      // console.log(authState.accessToken)

    }
  }, [apiData]);
  
  return (
    <div>
      {loading ? (
        <Loader/>
      ) : (
        <div>
          {apiData.map((data, index) => (
            <Link
            // to="/restaurant-detail"
            key={data.id || index}
            to={{
              pathname: "/restaurant-detail",
              search: `?${
                data.restaurant_type === "open_table" ? "map_url" : "yelp_id"
              }=${encodeURIComponent(
                data.restaurant_type === "open_table" ? data.url : data.id
              )}`,
            }}
          >          
              <div
                key={index}
                className="bg-white w-full mb-2 p-1 h-[640px] md:h-[15rem] lg:h-[15rem] shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest"
              >
                <img
                  className="w-full md:w-1/3 lg:w-1/3 h-1/3 md:h-full lg:h-full rounded-2xl object-cover"
                  src={data.image_url || ""}
                  alt="Restaurant"
                />
                <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2">
                  <div className="p-4 pb-0 flex-1">
                    <h1 className=" text-3xl font-light mb-1 text-grey-darkest">
                      <strong>{data.name}</strong>
                    </h1>
                    <br />
                    <span className="text-grey-darkest">
                      <h2>Rating</h2>
                      <i className="fas fa-map-marker-alt mr-1 text-grey-dark"></i>
                      {data.rating}
                      <span className="text-base sm:text-lg">/5</span>
                    </span>
                    <div className="flex items-center mt-4">
                      <div className="pr-2 text-base">
                        <h2>Address:</h2>
                        <p>
                          {" "}
                          {data.location.address1} , {data.location.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block lg:block border-l border-gray-300 h-44 my-6"></div>
                <div className=" w-full md:w-[150px] lg:w-[150px] ml-6  justify-center items-center md:m-6 lg:m-6">
                  {data.restaurant_type === "yelp" ? (
                    <img
                      src="/assets/yelp_logo_new.png"
                      alt="yelp logo"
                      width={86}
                      height={64}
                      className=" ml-30 md:ml-10 lg:ml-16 mb-2"
                    />
                  ) : data.restaurant_type === "open_table" ? (
                    <img
                      src="/assets/opentable.png"
                      alt="open table logo"
                      width={106}
                      height={84}
                      className=" ml-30 md:ml-8 lg:ml-16 mb-2"
                    />
                  ) : data.restaurant_type === "Google" ? (
                    <img
                      src="/assets/google-logo.png"
                      alt="google Logo"
                      width={56}
                      height={34}
                      className=" ml-30 md:ml-14 lg:ml-20 mb-2"
                    />
                  ) :
                   null}
                  <div className="pr-2 text-base">
                  </div>
                  <div className="">
                    {data.isclosed === true ? <h2>CLOSED</h2> : <h2>Opened</h2>}
                  </div>
                  <div>
                    <h2>{data.display_phone}</h2>
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
