import { useEffect, useState } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import { Sliders } from "lucide-react";

import { Base_Url } from "@/baseUrl";
import RestrautCards from "./RestrauntCards";
import Filters from "./Filters";

const Search = () => {
  const [formData, setFormData] = useState<any>({});
  const [yelpData, setYelpData] = useState<any>();
  const [resyData, setResyData] = useState<any>();
  const [openTableData, setOpenTableData] = useState<any>();
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
    const fetchYelpData = async () => {
      if (!loading) {
        try {
          const response = await axios.get(
            `${Base_Url}/api/v1/yelp/get_restaurants`,
            {
              params: formData,
              headers: {
                accept: "application/json",
              },
            }
          );
          setYelpData(response.data.data.businesses);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchYelpData();
  }, [formData, loading]);

  useEffect(() => {
    const fetchResyData = async () => {
      if (!loading) {
        try {
          const response = await axios.get(
            `${Base_Url}/api/v1/resy/get_restaurants`,
            {
              params: formData,
              headers: {
                accept: "application/json",
              },
            }
          );
          setResyData(response?.data?.data?.businesses);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchResyData();
  }, [loading]);

  useEffect(() => {
    const fetchOpenTableData = async () => {
      if (!loading) {
        try {
          const response = await axios.get(
            `${Base_Url}/api/v1/opentable/get_restaurants`,
            {
              params: formData,
              headers: {
                accept: "application/json",
              },
            }
          );
          setOpenTableData(response?.data?.data?.businesses);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchOpenTableData();
  }, [formData, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row lg:flex-row max-w-[1300px] mx-auto justify-center p-4">
        <div className="w-full md:w-1/3 lg:w-1/3 md:sticky lg:sticky top-0 h-[800px]">
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
