import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReservationSuccessFul from "./ReservationSuccess";
import ReservationFailed from "./ReservationFailed";

const ReservationStatus = () => {
  
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean | null>(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    let finalData: any = null;

    try {

      if (data !== null) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
        setLoading(true);

        if (finalData) {
          const endpoint = "https://tagsolutionsltd.com/reservation/create/";
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const apiParams = {
            diningAreaId: formData?.diningAreaId,
            first_name: formData?.first_name,
            last_name: formData?.last_name,
            phone: formData?.phone,
            email: formData?.email,
          };

          console.log(apiParams);

          axios
            .post(endpoint, apiParams, config)
            .then((response) => {
              console.log("API Response:", response.data);
              setStatus(true);
              setLoading(false);
            })
            .catch((error) => {
              console.error("API Error:", error);
              setStatus(false);
              setLoading(false);
            });
        }
      } else {
        console.error("Data parameter is null or undefined");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
      setLoading(false);
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
