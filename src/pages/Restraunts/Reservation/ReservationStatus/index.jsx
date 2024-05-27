import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Base_Url } from "@/baseUrl";
import ReservationFailed from "./ReservationFailed";
import ReservationSuccessFul from "./ReservationSuccess";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/authContext/AuthProvider";

const ReservationStatus = () => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    if (!authState.user?.id) {
      navigate("/login");
      return;
    }

    if (data) {
      const finalData = JSON.parse(data);
      if (finalData?.bookingInfo) {
        yelpReservation();
        PostReservation();
      } else {
        openTableReservation();
      }
    }
  }, [authState, data, navigate]);

  const PostReservation = async () => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);

        const separator = finalData?.bookingInfo?.formSubmitPath;
        const parts = separator?.split("/");
        const date = parts[4];
        const time = parts[5];
        const people = parts[6];

        const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`;
        const DateAndTime = `${date}T${formattedTime}`;

        const requiredApiParams = {
          reservation_date: DateAndTime,
          restaurant_id: finalData?.formData[0]?.alias,
          restaurant_name: finalData?.bookingInfo?.businessName,
          location: "new york",
          user_id: authState.user.id,
          price: 150,
          num_diners: people,
          cuisine_type: finalData?.bookingInfo?.restaurant?.categories[0],
          indoor_outdoor: "Indoor",
        };

        setLoading(true);
        const response = await axios.post(
          `${Base_Url}/api/v1/add_reservations/`,
          requiredApiParams
        );

        setStatus(true);
        setLoading(false);
        console.log(response, "response in API");
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error :", error);
      setStatus(false);
      setLoading(false);
    }
  };

  const openTableReservation = async () => {
    try {
      if (data) {
        const myData = JSON.parse(decodeURIComponent(data));
        const finalData = myData.formData;
        setFormData(myData.reservationFormData);

        const reservationTime = finalData[0]?.reservation_time;
        const timeDifference = finalData[1]?.timeOffsetMinutes;
        const [hours, minutes] = reservationTime?.split(":");
        const formattedTimeMinutes =
          parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        const calculatedTime = formattedTimeMinutes + timeDifference;
        const calculatedHours = Math.floor(calculatedTime / 60);
        const calculatedMinutes = calculatedTime % 60;
        const formattedHours = ("0" + calculatedHours).slice(-2);
        const formattedMinutes = ("0" + calculatedMinutes).slice(-2);
        const finalTime = `${formattedHours}:${formattedMinutes}`;

        setLoading(true);

        const apiParams = {
          first_name: myData?.reservationFormData?.first_name,
          last_name: myData?.reservationFormData?.last_name,
          mobile_number: myData?.reservationFormData?.phone,
          mobile_country_id: "PK",
          email: myData?.reservationFormData?.email,
          persons: finalData[0]?.reservation_covers,
          restaurant_id: finalData[2],
          seating_option: "default",
          dining_area_id: 1,
          slot_hash: finalData[1]?.slotHash,
          slot_availability_token: finalData[1]?.slotAvailabilityToken,
          country_id: "US",
          date: finalData[0]?.reservation_date,
          time: finalTime,
        };

        const response = await axios.post(
          `${Base_Url}/api/v1/opentable/do_reservation`,
          null,
          {
            params: apiParams,
          }
        );
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

  const yelpReservation = async () => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
        const separator = finalData?.bookingInfo?.formSubmitPath;
        const parts = separator?.split("/");
        const date = parts[4];
        const time = parts[5];

        setLoading(true);
        const apiParams = {
          first_name: finalData?.reservationFormData?.first_name,
          last_name: finalData?.reservationFormData?.last_name,
          mobile_number: 8609600316,
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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : status === true ? (
        <ReservationSuccessFul formData={formData} />
      ) : status === false ? (
        <ReservationFailed formData={formData} />
      ) : (
        <p>No status available</p>
      )}
    </div>
  );
};

export default ReservationStatus;
