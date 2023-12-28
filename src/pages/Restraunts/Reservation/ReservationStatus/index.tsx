import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReservationSuccessFul from "./ReservationSuccess";
import ReservationFailed from "./ReservationFailed";
import { bookingInfo } from "@/mockData";

const ReservationStatus = () => {
  
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let finalData: any = null;
        if (data !== null) {
          finalData = JSON.parse(decodeURIComponent(data));
          console.log(finalData);
          setFormData(finalData);
          setLoading(true);
  
          if (finalData) {
            const endpoint = "https://tagsolutionsltd.com/api/v1/yelp/do_reservation";
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };

            const apiParams = {
              // diningAreaId: formData[1].[0]?.diningAreaId,
              first_name: finalData.first_name,
              last_name: finalData.last_name,
              phone: finalData.phone,
              email: finalData.email,
            };
  
            const response = await axios.post(endpoint, apiParams, config);
  
            console.log("API Response:", response.data);
            setStatus(true);
            setLoading(false);
          }
        } else {
          console.error("Data parameter is null or undefined");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing JSON or decoding URI:", error);
        setStatus(false);
        setLoading(false);
      }
    };
  
    if (data !== null) {
      fetchData();
    }
  }, [data]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : status === true ? (
        <ReservationSuccessFul />
      ) : status === false ? (
        <ReservationFailed />
      ) : (
        <p>No status available</p>
      )}
    </div>
  );
};

export default ReservationStatus;
