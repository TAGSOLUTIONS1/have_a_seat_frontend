import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ReservationForm from "./ReservationForm";
import PreviousData from "./PreviousData";
import YelpBookingInfo from "./YelpBookingInfo";
import axios from "axios";
import { Base_Url } from "@/baseUrl";

const Reservation = () => {
  const [formData, setFormData] = useState<any>();
  const [bookingInfo, setBookingInfo] = useState<any>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data: any = params.get("data");

  useEffect(() => {
    let finalData = null;
    try {
      if (data !== null) {
        const decodedData = decodeURIComponent(data);
        finalData = JSON.parse(decodedData);
        setFormData(finalData);
        // console.log("Parsed data:", finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
      // console.log("Malformed data:", data); // Log the malformed data
    }
  }, [data]);

  useEffect(() => {
    if (formData && formData[0]?.alias) {
      fetchBookingInfo();
    }
  }, [formData]);

  const fetchBookingInfo = async () => {
    const separator = formData[1]?.form_action;
    const parts = separator?.split("/");
    const alias = parts[2];
    const date = parts[4];
    const time = parts[5];
    const persons = parseInt(parts[6]);

    const bookingInfoParams = {
      csrf_token: formData[1].csrf_token,
      restaurant_alias: alias,
      date: date,
      time: time,
      persons: persons,
    };

    // console.log(bookingInfoParams);

    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/get_restaurant_booking_info`,
        {
          params: bookingInfoParams,
        }
      );

      if (response.status === 200) {
        // console.log("Request successful");
        // console.log("Response data:", response?.data?.data);
        setBookingInfo(response?.data?.data);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center ">
        <div className="w-3/4 mt-12">
          <ReservationForm formData={formData} bookingInfo={bookingInfo} />
        </div>
        {formData && formData[0]?.alias ? (
          <div className="w-3/4  mt-28">
            <YelpBookingInfo bookingInfo={bookingInfo} />
          </div>
        ) : (
          <div className="w-3/4  mt-28">
            <PreviousData formData={formData} bookingInfo={bookingInfo} />
          </div>
        )}
      </div>
    </>
  );
};

export default Reservation;
