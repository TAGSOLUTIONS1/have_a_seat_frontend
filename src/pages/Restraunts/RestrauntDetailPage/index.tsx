import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import OverviewCards from "./OverviewCards";
import Pictures from "./Pictures";
import Menu from "./Menu";
import TimingHours from "./TimingHours";
import Reviews from "./Reviews";
import Loader from "@/components/Loader";

const RestrauntDetail = () => {
  const [restrauntDetail, setRestrauntDetail] = useState<any>({});
  const [prevId, setPrevId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [key, setKey] = useState<any>();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const map_url = params.get("map_url");
    const yelp_id = params.get("yelp_id");

    if (yelp_id === null) {
      setPrevId(map_url);
      setKey("map_url");
    } else {
      setPrevId(yelp_id);
      setKey("yelp_id");
    }
  }, [location.search, prevId]);

  useEffect(() => {
    const fetchData = async () => {
      if (prevId && !loading) {
        try {
          const response = await axios.get(
            `https://tagsolutionsltd.com/restaurant/detail/?${key}=${prevId}`
          );
          console.log("Single Restaurant Detail:", response.data.data);
          setRestrauntDetail(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [location.search, prevId]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : Object.keys(restrauntDetail).length !== 0 ? (
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
                backgroundImage:
                  restrauntDetail?.restaurant_flag === "opentable"
                    ? `url(${restrauntDetail?.restaurant?.photos?.profile?.large?.url})`
                    : restrauntDetail?.restaurant_flag === "yelp"
                    ? `url(${restrauntDetail?.image_url})`
                    : "",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "90%",
                height: "500px",
                borderRadius: "10px",
              }}
            ></div>
          </section>
          <section>
            <OverviewCards restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <Pictures restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <Menu restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <TimingHours restrauntDetail={restrauntDetail} />
          </section>
          <section>
            <Reviews restrauntDetail={restrauntDetail} />
          </section>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RestrauntDetail;
