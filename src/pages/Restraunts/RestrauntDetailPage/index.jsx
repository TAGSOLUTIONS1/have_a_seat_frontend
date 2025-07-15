import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import Loader from "@/components/Loader";


import { ResyRestrauntDetail } from "@/mockData";
import RestaurantDetailsV2 from "../ResturantDetailV2/RestaurantDetailsV2";

const RestrauntDetail = () => {
  const [restrauntDetail, setRestrauntDetail] = useState({});
  const [prevId, setPrevId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [endpoint, setEndPoint] = useState();
  const [key, setKey] = useState();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const detailsParam = searchParams.get("details");

    if (detailsParam) {
      // Decode the parameter and set it in state
      const decodedDetails = JSON.parse(decodeURIComponent(detailsParam));
      // console.log(decodedDetails);
      setRestrauntDetail(decodedDetails);
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const map_url = params.get("map_url");
    const yelp_alias = params.get("yelp_alias");
    const resy_alias = params.get("resy_alias");
    if (map_url) {
      setPrevId(map_url);
      const openTableParamUrl = map_url?.replace(
        "https://www.opentable.com/",
        ""
      );
      setKey("open_table");
      setEndPoint(
        `${Base_Url}/api/v1/opentable/get_restaurant_details?map_url=${openTableParamUrl}`
      );
    } else if (yelp_alias) {
      setPrevId(yelp_alias);
      setKey("yelp");
      setEndPoint(
        `${Base_Url}/api/v1/yelp/get_restaurant_details/${yelp_alias}`
      );
    }
    else if(resy_alias){
    setPrevId(resy_alias);
      setKey("resy");
      setEndPoint(
        `${Base_Url}/api/v1/resy/get_restaurant_details/?venue_id=${resy_alias}&persons=2&date=${formattedDate}`
      );
    } 
    else {
      null;
    }
  }, [location.search, prevId]);

  useEffect(() => {
    const fetchData = async () => {
      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          
          if (key === "open_table") {
            const data = response?.data?.data;
            setRestrauntDetail({
              ...data,
              restaurant_type: "open_table",
            });
            // setRestrauntDetail(response?.data?.data);
          } else if (key === "yelp") {
            const data = response?.data?.data;
             setRestrauntDetail({
              ...data,
              restaurant_type: "yelp",
            });
            // setRestrauntDetail(response.data.data);
          } 
          else if (key === "resy") {
            const data = response?.data?.data;
            const additionalApiUrl = `${Base_Url}/api/v1/resy/get_restaurant_details_v2?url_slug=omakase-ichi&location=new-york-ny`;
            const additionalResponse = await axios.get(additionalApiUrl);
            const additionalData = additionalResponse?.data?.data || {};
            // console.log("additional dtaa is " , additionalData)
             setRestrauntDetail({
              ...data,
              results: {
                ...data.results,
                resy2: additionalData,              
              },
              restaurant_type: "resy",
            });
          }
          else {
            return;
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [endpoint, key]);

  const getRandomKey = (obj) => {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    // console.log(randomKey);
    return randomKey;
  };

  const randomTemplateKey = restrauntDetail?.templates
    ? getRandomKey(restrauntDetail?.templates)
    : null;

  const randomTemplate =
    randomTemplateKey && restrauntDetail?.templates[randomTemplateKey];

  return (
    <div className="mb-24 bg-bgGray">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <section
            className="max-w-full p-4"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundImage: restrauntDetail?.alias
                  ? `url(${restrauntDetail?.image_url})`
                  : restrauntDetail?.restaurant
                  ? `url(${restrauntDetail?.restaurant?.photos?.gallery?.photos[0]?.thumbnails[6]?.url})`
                  : `url(${restrauntDetail?.images[0]})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "500px",
                borderRadius: "10px",
                // marginLeft: "30px",
              }}
            ></div>
          </section> */}

          <RestaurantDetailsV2 restrauntDetail={restrauntDetail} />
        
        </>
      )}
    </div>
  );
};

export default RestrauntDetail;
