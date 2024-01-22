import { Base_Url } from "@/baseUrl";
import axios from "axios";
import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import RestrautCards from "./RestrauntCards";

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  const [formData, setFormData] = useState({});
  const [yelpData, setYelpData] = useState();
  const [resyData, setResyData] = useState();
  const [openTableData, setOpenTableData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async (apiEndpoint) => {
    try {
      const response = await axios.get(`${Base_Url}${apiEndpoint}`, {
        params: formData,
        headers: {
          accept: "application/json",
        },
      });
      return response.data.data.businesses;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    let finalData;
    try {
      if (data !== null) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    if (!loading) {
      const fetchDataFromApi = async (apiEndpoint, setData) => {
        const data = await fetchData(apiEndpoint);
        setData(data);
      };

      fetchDataFromApi("/api/v1/yelp/get_restaurants", setYelpData);
      fetchDataFromApi("/api/v1/resy/get_restaurants", setResyData);
      fetchDataFromApi("/api/v1/opentable/get_restaurants", setOpenTableData);
    }
  }, [formData]);

  return (
    <>
      <div className="flex flex-col md:flex-row lg:flex-row max-w-[1300px] mx-auto justify-center p-4">
        <div className="w-full md:w-1/3 lg:w-1/3 md:sticky lg:sticky top-[20%] h-[800px]">
          <h1 className="text-xl items-center text-center justify-center">
            <strong>
              <Sliders size={24} className="inline-block mr-2" />
              FILTERS
            </strong>
          </h1>
          <Filters />
        </div>
        <div className="w-full">
          <RestrautCards
            yelpData={yelpData}
            resyData={resyData}
            openTableData={openTableData}
            formData={formData}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
