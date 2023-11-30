import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useLocation } from "react-router-dom";
import { Sliders } from "lucide-react";

import RestrautCards from "./RestrauntCards";
import Filters from "./Filters";

const Search = () => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [apiData, setApiData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    let finalData: any = null;

    try {
      if (data !== null) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
        setLoading(false);
        console.log(finalData);
      } else {
        console.error("Data parameter is null or undefined");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) {
        try {
          const accessToken = authState.accessToken;

          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.get(
            "https://tagsolutionsltd.com/restaurant/search/",
            {
              params: formData,
              headers: headers,
            }
          );

          console.log("API Response:", response.data.data);
          setApiData(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [authState.accessToken, formData, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex max-w-full relative w-[1300px] justify-center p-4 ">
      <div className="w-1/3 sticky top-0">
        <h1 className="text-xl items-center text-center justify-center">
          <strong>
            <Sliders size={24} className="inline-block mr-2" />
            FILTERS
          </strong>
        </h1>
        <Filters />
      </div>
      <div className=" w-full">
        <RestrautCards apiData={apiData} />
      </div>
    </div>
  );
};

export default Search;
