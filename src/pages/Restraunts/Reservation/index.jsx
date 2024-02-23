import { useEffect, useState } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import PreviousData from "./PreviousData";
import ReservationForm from "./ReservationForm";
import YelpBookingInfo from "./YelpBookingInfo";
import Loader from "@/components/Loader";

const Reservation = () => {
  const [formData, setFormData] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    let finalData = null;
    try {
      if (data !== null) {
        const decodedData = decodeURIComponent(data);
        finalData = JSON.parse(decodedData);
        setFormData(finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
    }
  }, [data]);

  useEffect(() => {
    if (formData && formData[0]?.alias) {
      fetchBookingInfo();
    }
  }, [formData]);

  const fetchBookingInfo = async () => {
    setLoading(true);
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

    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/get_restaurant_booking_info`,
        {
          params: bookingInfoParams,
        }
      );

      if (response.status === 200) {
        setBookingInfo(response?.data?.data);
        setLoading(false);
      } else {
        console.error("Request failed with status:", response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center mb-24 ">
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
      )}
    </>
  );
};

export default Reservation;
