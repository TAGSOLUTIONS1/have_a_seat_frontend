import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import Loader from "@/components/Loader";
import Menu from "./Menu";
import OverviewCards from "./OverviewCards";
import Pictures from "./Pictures";
import Reviews from "./Reviews";
import TimingHours from "./TimingHours";

import { ResyRestrauntDetail } from "@/mockData";

const RestrauntDetail = () => {
  const [restrauntDetail, setRestrauntDetail] = useState({});
  const [prevId, setPrevId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [endpoint, setEndPoint] = useState();
  const [key, setKey] = useState();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const map_url = params.get("map_url");
    const yelp_alias = params.get("yelp_alias");
    const venue_id = params.get("venue_id");

    const resyParams = {
      venue_id: venue_id,
      date: "2024-01-25",
      persons: 2,
    };

    if (yelp_alias === null && venue_id === null) {
      setPrevId(map_url);
      const openTableParamUrl = map_url?.replace(
        "https://www.opentable.com/",
        ""
      );
      setKey("open_table");
      setEndPoint(
        `${Base_Url}/api/v1/opentable/get_restaurant_details?map_url=${openTableParamUrl}`
      );
    } else if (map_url === null && venue_id === null) {
      setPrevId(yelp_alias);
      setKey("yelp");
      setEndPoint(
        `${Base_Url}/api/v1/yelp/get_restaurant_details/${yelp_alias}`
      );
    } else if (map_url === null && yelp_alias === null) {
      setKey("resy");
      setEndPoint(
        `${Base_Url}/api/v1/resy/get_restaurant_details?venue_id=${resyParams.venue_id}&date=${resyParams.date}&persons=${resyParams.persons}`
      );
    }
  }, [location.search, prevId]);

  useEffect(() => {
    const fetchData = async () => {
      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          if (key === "open_table") {
            setRestrauntDetail(response?.data?.data);
          } else if (key === "yelp") {
            setRestrauntDetail(response.data.data);
          } else if (key === "resy") {
            console.log(response?.data?.data?.results?.venues[0]);
            setRestrauntDetail(response?.data?.data?.results?.venues[0]);
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
    console.log(randomKey)
    return randomKey;
  };

  const randomTemplateKey = restrauntDetail?.templates
    ? getRandomKey(restrauntDetail?.templates)
    : null;

  const randomTemplate =
    randomTemplateKey && restrauntDetail?.templates[randomTemplateKey];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <section
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
                  ? `url(${restrauntDetail?.restaurant?.photos?.profile?.large?.url})`
                  : `url(${randomTemplate?.images[0]})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "95%",
                height: "500px",
                borderRadius: "10px",
                marginLeft: "30px",
              }}
            ></div>
          </section>
          <section>
            <OverviewCards restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <Pictures restrauntDetail={restrauntDetail} />
          </section>
          {/* {restrauntDetail?.alias ? null : ( */}
          <section>
            <Menu restrauntDetail={restrauntDetail} />
          </section>
          {/* )} */}
          <section>
            <TimingHours restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <Reviews restrauntDetail={restrauntDetail} />
          </section>
        </>
      )}
    </div>
  );
};

export default RestrauntDetail;
