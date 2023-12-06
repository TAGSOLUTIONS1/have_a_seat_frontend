import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useLocation } from "react-router-dom";

import OverviewCards from "./OverviewCards";
import Pictures from "./Pictures";
import Menu from "./Menu";
import TimingHours from "./TimingHours";
import Reviews from "./Reviews";

const RestrauntDetail = () => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [prevId, setPrevId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const yelp_id = params.get("yelp_id");
    if (yelp_id !== prevId) {
      setPrevId(yelp_id);
    }
  }, [location.search, prevId]);

  useEffect(() => {
    const fetchData = async () => {
      if (prevId && !loading) {
        try {
          const accessToken = authState.accessToken;

          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.get(
            `https://tagsolutionsltd.com/restaurant/detail/?yelp_id=${prevId}`,
            {
              params: formData,
              headers: headers,
            }
          );

          console.log("Single Restaurant Detail:", response.data.data);
          setFormData(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [2]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="max-w-full p-4">
        <div className="max-w-full relative w-[1300px] lg:p-0 lg:mx-auto my-4  h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-[url('/assets/main-page.jpg')] bg-no-repeat bg-cover rounded-lg object-cover bg-center"></div>
      </section>
      <section>
        <OverviewCards />
      </section>
      <section>
        <Pictures />
      </section>
      <section>
        <Menu />
      </section>
      <section>
        <TimingHours />
      </section>
      <section>
        <Reviews />
      </section>
    </>
  );
};

export default RestrauntDetail;
