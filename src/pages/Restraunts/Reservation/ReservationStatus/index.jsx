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
    const finalData = JSON.parse(data);
    console.log(finalData, "final data");
    if (finalData?.bookingInfo) {
      yelpReservation();
      PostYelpReservation();
    } else {
      PostOpentableReservation();
      openTableReservation();
    }
  }, []);

  const PostOpentableReservation = async () => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        console.log(finalData);
        setFormData(finalData);

        const newDate = finalData?.formData[0]?.reservation_date;

        const newTime = finalData?.formData[0]?.reservation_time;
        const newTimeOffset = finalData?.formData[1]?.timeOffsetMinutes;
        const id = finalData?.formData[2].toString();

        const [hours, minutes] = newTime.split(":").map(Number);

        const Finaldate = new Date();
        Finaldate.setHours(hours);
        Finaldate.setMinutes(minutes);

        Finaldate.setMinutes(Finaldate.getMinutes() + newTimeOffset);

        const newFormattedTime = `${Finaldate.getHours()
          .toString()
          .padStart(2, "0")}:${Finaldate.getMinutes()
          .toString()
          .padStart(2, "0")}`;

        const FinalApiTime = `${newDate}T${newTime}`;
        const cousine = finalData?.formData[5]
        const people = finalData?.formData[0]?.reservation_covers;

        const requiredApiParams = {
          reservation_date: FinalApiTime,
          restaurant_id: id,
          restaurant_name: finalData?.formData[3],
          location: finalData?.formData[4]?.city,
          price: 150,
          num_diners: people,
          cuisine_type: cousine[0]?.name,
          indoor_outdoor: "Indoor",
        };

        console.log(requiredApiParams , "requiredApiParams")

        setLoading(true);
        const response = await axios.post(
          `${Base_Url}/api/v1/reservation/create_reservation/`,
          requiredApiParams,
          {
            headers: {
              Authorization: `Bearer ${authState?.accessToken}`,
              accept: "application/json",
            },
          }
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

  const PostYelpReservation = async () => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        console.log(finalData);
        setFormData(finalData);

        const address = finalData?.bookingInfo?.formattedAddress;
        const cityParts = address?.split("<br>");
        const cityStateZip = cityParts[1];
        const cityPartsPro = cityStateZip.split(", ");
        const city = cityPartsPro[0];

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
          location: city,
          price: 150,
          num_diners: people,
          cuisine_type: finalData?.bookingInfo?.restaurant?.categories[0],
          indoor_outdoor: "Indoor",
        };

        setLoading(true);
        const response = await axios.post(
          `${Base_Url}/api/v1/reservation/create_reservation/`,
          requiredApiParams,
          {
            headers: {
              Authorization: `Bearer ${authState?.accessToken}`,
              accept: "application/json",
            },
          }
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
