import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/authContext/AuthProvider"
import axios from "axios"

import Card1 from "./Card1"
import Card2 from "./Card2"
import Card3 from "./Card3"
import Card4 from "./Card4"

const HomeCards = () => {
  const { authState } = useAuth();
  const [apiData, setApiData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = authState.accessToken;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const params = {
          location: 'china',
          attributes: 'reservation',
          latitude: 40.772385,
          longitude: -73.956516,
          reservation_covers: 2,
          reservation_date: '2023-11-28',
          reservation_time: '03:00',
        }

        const response = await axios.get(
          "https://tagsolutionsltd.com/restaurant/search/",
          {
            params,
            headers,
          }
        );

        if (response.data && response.data.data.length > 0) {
          console.log("API Response:", response.data.data);
          setApiData(response.data.data);
          setLoading(false); 
        } else {
          setLoading(true); 
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(true); 
      }
    };

    fetchData();
  }, [authState.accessToken]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 sm:col-span-6">
              <Card1 apiData={apiData} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <Card2 apiData={apiData} />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-8 mt-10">
            <div className="col-span-12 sm:col-span-6">
              <Card3 apiData={apiData}  />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <Card4 apiData={apiData} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HomeCards
