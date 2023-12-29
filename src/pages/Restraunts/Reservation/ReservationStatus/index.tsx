import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReservationSuccessFul from "./ReservationSuccess";
import ReservationFailed from "./ReservationFailed";
// import { Base_Url } from "@/baseUrl";
import { bookingInfo } from "@/mockData";
import { Base_Url } from "@/baseUrl";

const ReservationStatus = () => {
  const [formData, setFormData] = useState<any>();
  // const [formData2, setFormData2] = useState<any>();
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
          setFormData(finalData);
          console.log(finalData?.bookingInfo?.formSubmitPath);
          const separator = finalData?.bookingInfo?.formSubmitPath;
          const parts = separator?.split("/");
          const date = parts[4];
          const time = parts[5];

          setLoading(true);
          const apiParams = {
            first_name: finalData?.reservationFormData?.first_name,
            last_name: finalData?.reservationFormData?.last_name,
            mobile_number: 3613043530,
            email: finalData?.reservationFormData?.email,
            csrf_token: finalData?.bookingInfo?.csrfToken,
            user_token: finalData?.bookingInfo?.userToken,
            hold_id: finalData?.bookingInfo?.holdId,
            persons: finalData?.bookingInfo?.covers,
            restaurant_alias: finalData?.formData[0]?.alias,
            date: date,
            time: time,
          };
          const response = await axios.post(
            `${Base_Url}/api/v1/yelp/do_reservation`,
            null,
            {
              params: apiParams,
            }
          );
          console.log("API Response:", response.data);
          setStatus(true);
          setLoading(false);
        } else {
          console.error("Data parameter is null or undefined");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error :", error);
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
