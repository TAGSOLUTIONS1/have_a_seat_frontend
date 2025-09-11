const API_URL = "http://127.0.0.1:8000/api/v1"

import axios from "axios";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useState } from "react";
import { useNotificationToast } from '@/hooks/useNotificationToast';

export const register = async (formData) => {
  console.log("formData for register is ", formData);
  const registerResponse = await axios.post(
    `${API_URL}/auth/register`,
    formData
  );
  switch (registerResponse.status) {
    case 201:
      if (registerResponse.status === 201) {
        const verifyResponse = await axios.post(
          `${API_URL}/auth/request-verify-token`,
          {
            email: formData.email,
          }
        );
        return registerResponse.data;
      } else {
        throw new Error(
          registerResponse.data.message ||
            "Something went wrong during registration"
        );
      }
    case 400:
      throw new Error(registerResponse.data.message);
    default:
      throw new Error("Something went wrong");
  }
};

export const PostYelpReservationwithEmail = async (reservationId, restaurantType , email_for_reservation) => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
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
          reservation_id: reservationId,
          reservation_type: restaurantType,
          reservation_status: "CONFIRMED",
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
          `${API_URL}/reservation/create_reservation_with_email/`, 
          null, 
          {
            params: requiredApiParams,
            headers: {
              'Auth-Email': `${email_for_reservation}`,
              accept: "application/json",
            },
          }
        );
        
        // ✅ Trigger notification for successful backend save
        if (response.status === 200 || response.status === 201) {
          // Notification already sent in yelpReservation, no need to send again
          console.log('Reservation saved to backend successfully');
        }
        
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

export const PostOpentableReservationwithEmail = async (reservationId, restaurantType , email_for_reservation) => {
    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        // console.log("opne tbale final daata " , finalData)
        setFormData(finalData);

        const newDate = finalData?.formData[0]?.reservation_date;
        const newTime = finalData?.formData[0]?.reservation_time;
        const newTimeOffset = finalData?.formData[1]?.timeOffsetMinutes;
        const id = finalData?.formData[2]?.toString();

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
        const cousine = finalData?.formData[5];
        const people = finalData?.formData[0]?.reservation_covers;

        const requiredApiParams = {
          reservation_id: reservationId,
          reservation_type: restaurantType,
          reservation_status: "CONFIRMED",
          reservation_date: FinalApiTime,
          restaurant_id: id,
          restaurant_name: finalData?.formData[3] || 'Restaurant',
          location: finalData?.formData[4]?.city || 'Unknown',
          price: 150,
          num_diners: people || 1,
          cuisine_type: cousine?.[0]?.name || 'Unknown',
          indoor_outdoor: "Indoor",
        };

        console.log(requiredApiParams , "requiredApiParams")

        setLoading(true);
        const response = await axios.post(
          `${API_URL}/reservation/create_reservation_with_email/`,
          {
            params: requiredApiParams,
            headers: {
              'Auth-Email': `${email_for_reservation}`,
              accept: "application/json",
            },
          }
        );

        // ✅ Trigger notification for successful reservation
        if (response.status === 200 || response.status === 201) {
          // Notification already sent in openTableReservation, no need to send again
          console.log('Reservation saved to backend successfully');
          
        }

        setStatus(true);
        setLoading(false);
        console.log(response, "response in API");
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error :", error);
      
      // ✅ Trigger notification for failed reservation
      showNotification(
        'reservation_cancellation',
        'Reservation Failed ❌',
        'There was an issue processing your OpenTable reservation. Please try again.',
        {
          error: error.message,
          reservation_type: 'OPENTABLE'
        }
      );
      
      // setStatus(false);
      setLoading(false);
    }
  };

export const PostOpentableReservation = async (reservationId, restaurantType) => {
  const { authState } = useAuth();

    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
        // console.log("opne tbale final daata " , finalData)
        setFormData(finalData);

        const newDate = finalData?.formData[0]?.reservation_date;
        const newTime = finalData?.formData[0]?.reservation_time;
        const newTimeOffset = finalData?.formData[1]?.timeOffsetMinutes;
        const id = finalData?.formData[2]?.toString();

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
        const cousine = finalData?.formData[5];
        const people = finalData?.formData[0]?.reservation_covers;

        const requiredApiParams = {
          reservation_id: reservationId,
          reservation_type: restaurantType,
          reservation_status: "CONFIRMED",
          reservation_date: FinalApiTime,
          restaurant_id: id,
          restaurant_name: finalData?.formData[3] || 'Restaurant',
          location: finalData?.formData[4]?.city || 'Unknown',
          price: 150,
          num_diners: people || 1,
          cuisine_type: cousine?.[0]?.name || 'Unknown',
          indoor_outdoor: "Indoor",
        };

        console.log(requiredApiParams , "requiredApiParams")

        setLoading(true);
        // Use accessToken from localStorage if authState doesn't have it
        const token = authState?.accessToken || localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_URL}/api/v1/reservation/create_reservation/`,
          {
            params: requiredApiParams,
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );

        // ✅ Trigger notification for successful reservation
        if (response.status === 200 || response.status === 201) {
          // Notification already sent in openTableReservation, no need to send again
          console.log('Reservation saved to backend successfully');
        
        }

        setStatus(true);
        setLoading(false);
        console.log(response, "response in API");
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error :", error);
      
      // ✅ Trigger notification for failed reservation
      showNotification(
        'reservation_cancellation',
        'Reservation Failed ❌',
        'There was an issue processing your OpenTable reservation. Please try again.',
        {
          error: error.message,
          reservation_type: 'OPENTABLE'
        }
      );
      
      // setStatus(false);
      setLoading(false);
    }
  };

export const PostYelpReservation = async (reservationId, restaurantType) => {
  const { authState } = useAuth();

    try {
      let finalData = null;
      if (data) {
        finalData = JSON.parse(decodeURIComponent(data));
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
          reservation_id: reservationId,
          reservation_type: restaurantType,
          reservation_status: "CONFIRMED",
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
        // Use accessToken from localStorage if authState doesn't have it
        const token = authState?.accessToken || localStorage.getItem('accessToken') ;
        const response = await axios.post(
          `${API_URL}/api/v1/reservation/create_reservation/`, 
          null, 
          {
            params: requiredApiParams,
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );
        
        // ✅ Trigger notification for successful backend save
        if (response.status === 200 || response.status === 201) {
          // Notification already sent in yelpReservation, no need to send again
          console.log('Reservation saved to backend successfully');
        }
        
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