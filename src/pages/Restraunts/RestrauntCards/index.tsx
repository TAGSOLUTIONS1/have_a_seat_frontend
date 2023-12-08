import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface RestaurantCardsProps {
  apiData: any[];
}

const RestaurantCards: React.FC<RestaurantCardsProps> = ({ apiData }) => {
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (apiData && apiData.length > 0) {
      setLoading(false);
      console.log(apiData)
    }
  }, [apiData]);
  

  return (
    <div>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div>
          {apiData.map((data, index) => (
            <Link
            to="/restaurant-detail"
            // key={data.id || index}
            // to={{
            //   pathname: "/restaurant-detail",
            //   search: `?${
            //     data.restaurant_type === "open_table" ? "map_url" : "yelp_id"
            //   }=${encodeURIComponent(
            //     data.restaurant_type === "open_table" ? data.url : data.id
            //   )}`,
            // }}
          >          
              <div
                key={index}
                className="bg-white w-full mb-2 p-1  h-60 shadow-xl rounded-2xl flex card text-grey-darkest"
              >
                <img
                  className="w-1/3 h-full rounded-2xl object-cover"
                  src={data.image_url || ""}
                  alt="Restaurant"
                />
                <div className="w-1/2 flex flex-col px-2">
                  <div className="p-4 pb-0 flex-1">
                    <h1 className=" text-3xl font-light mb-1 text-grey-darkest">
                      <strong>{data.name}</strong>
                    </h1>
                    <br />
                    {/* <span className="text-grey-darkest">
                      <h2>Rating</h2>
                      <i className="fas fa-map-marker-alt mr-1 text-grey-dark"></i>
                      {data.rating}
                      <span className="text-base sm:text-lg">/5</span>
                    </span> */}
                    <div className="flex items-center mt-4">
                      <div className="pr-2 text-base">
                        <h2>Address:</h2>
                        <p>
                          {" "}
                          {/* {data.location.address1} , {data.location.city} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-l border-gray-300 h-44 my-6"></div>
                <div className=" w-[150px] justify-center items-center m-6">
                  {data.restaurant_type === "yelp" ? (
                    <img
                      src="/assets/yelp_logo_new.png"
                      alt="yelp logo"
                      width={86}
                      height={64}
                      className=" ml-20 mb-2"
                    />
                  ) : data.restaurant_type === "open_table" ? (
                    <img
                      src="/assets/opentable.png"
                      alt="open table logo"
                      width={106}
                      height={84}
                      className=" ml-16 mb-2"
                    />
                  ) : null}
                  <div className="pr-2 text-base">
                    <h2>{data.price}</h2>
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
