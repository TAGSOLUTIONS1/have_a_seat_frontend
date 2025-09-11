import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Base_Url } from "@/baseUrl";
import ReservationFailed from "./ReservationFailed";
import ReservationSuccessFul from "./ReservationSuccess";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useNotificationToast } from '@/hooks/useNotificationToast';
import { createUser } from "@/services/auth";

const ReservationStatus = () => {
  const { authState } = useAuth();
  const { showNotification } = useNotificationToast();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    const finalData = JSON.parse(data);
        
        if (finalData?.bookingInfo) {
      yelpReservation();
    } else {
      openTableReservation();
    }
  }, []);
  

  const [accessTokenforReservation, setAccessTokenforReservation] = useState(null);

  console.log("accessTokenforReservation" , accessTokenforReservation , localStorage.getItem('accessToken'))
  const PostOpentableReservation = async (reservationId, restaurantType) => {
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
          `${Base_Url}/api/v1/reservation/create_reservation/`,
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
          
          // Clear access token after successful reservation
          localStorage.removeItem('accessToken');
          setAccessTokenforReservation(null);
          console.log('Access token cleared from localStorage');
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

  const PostYelpReservation = async (reservationId, restaurantType) => {
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
        const token = authState?.accessToken || localStorage.getItem('accessToken') || accessTokenforReservation;
        const response = await axios.post(
          `${Base_Url}/api/v1/reservation/create_reservation/`, 
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
          
          // Clear access token after successful reservation
          localStorage.removeItem('accessToken');
          setAccessTokenforReservation(null);
          console.log('Access token cleared from localStorage');
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

  const openTableReservation = async () => {
    try {
      if (data) {
        const myData = JSON.parse(decodeURIComponent(data));
        const finalData = myData.formData;
        setFormData(myData);

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
          mobile_country_id: "US",
          email: myData?.reservationFormData?.email,
          persons: finalData[0]?.reservation_covers || 1,
          restaurant_id: finalData[2] || 'unknown',
          restaurant_name: finalData[3] || "the restaurant",
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
          {
            params: apiParams,
          }
        );
        console.log("Response:" , response)
        setStatus(true);
        setLoading(false);
        if (response.data.success === true) {
          console.log("Reservation created successfully");
        if (response.data.data && response.data.data.reservationId) {
          console.log("Reservation created successfully");
          
          // ✅ Trigger notification for successful OpenTable reservation
          showNotification(
            'reservation_confirmation',
            'Reservation Confirmed! 🎉',
            `Your table at ${finalData[3] || 'Restaurant'} is confirmed for ${finalData[0]?.reservation_date} at ${finalData[0]?.reservation_time}`,
            {
              restaurant_name: finalData[3] || 'Restaurant',
              reservation_date: finalData[0]?.reservation_date,
              reservation_time: finalData[0]?.reservation_time,
              num_diners: finalData[0]?.reservation_covers || 1,
              reservation_id: response.data.data.reservationId,
              reservation_type: 'OPENTABLE',
              confirmation_number: response.data.data.confirmationNumber,
              party_size: response.data.data.partySize,
              reservation_datetime: response.data.data.reservationDateTime,
              restaurant_id: response.data.data.restaurantId
            }
          );
          
          if(authState?.isAuthenticated){
            PostOpentableReservation(response.data.data.reservationId, "OPENTABLE");
          } else {
            // Create user account for the reservation
            try {
              const userData = {
                email: finalData[0]?.reservationFormData?.email || 'guest@example.com',
                first_name: finalData[0]?.reservationFormData?.first_name || 'Guest',
                last_name: finalData[0]?.reservationFormData?.last_name || 'User',
                password: 'temp123' // Default password for auto-created users
              };
              
              const usercreated = await createUser(userData);
              console.log("user created", usercreated);
              
              // Create login form data
              const loginFormData = new FormData();
              loginFormData.append('username', usercreated.email);
              loginFormData.append('password', usercreated.password);
              loginFormData.append('grant_type', '');
              loginFormData.append('client_id', '');
              loginFormData.append('client_secret', '');

              const requestOptions = {
                method: "POST",
                body: loginFormData,
                redirect: "follow",
              };
              const loginResponse = await fetch(`${Base_Url}/api/v1/auth/jwt/login`, requestOptions);
              
              if (loginResponse.ok) {
                const loginResult = await loginResponse.json();
                localStorage.setItem('accessToken', loginResult.access_token);
                setAccessTokenforReservation(loginResult.access_token);
                console.log("accessToken stored:", loginResult.access_token);
              }
              // Create reservation for the new user with JWT token
              await PostOpentableReservation(response.data.data.reservationId, "OPENTABLE");
              
            } catch (error) {
              console.error('Error creating user for OpenTable reservation:', error);
            }
          }
          }
        } 
      } else {
        console.error("Data parameter is null or undefined");
        setLoading(false);
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
        console.log(response, "response in API");
        if (response.data.success === true) {
          console.log("Reservation created successfully");
        if (response.data.data && response.data.data.rez_id) {
          console.log("Reservation created successfully");
          // ✅ Trigger notification for successful Yelp reservation
          showNotification(
            'reservation_confirmation',
            'Reservation Confirmed! 🎉',
            `Your table at ${finalData?.formData[0]?.name || 'Restaurant'} is confirmed for ${date} at ${time}`,
            {
              restaurant_name: finalData?.formData[0]?.name || 'Restaurant',
              reservation_date: date,
              reservation_time: time,
              num_diners: finalData?.bookingInfo?.covers,
              reservation_id: response.data.data.rez_id,
              reservation_type: 'YELP'
            }
          );
          if(authState?.isAuthenticated){
            PostYelpReservation(response.data.data.rez_id, "YELP");
          } else {
            // Create user account for the reservation
            try {
              const userData = {
                email: finalData?.reservationFormData?.email || 'guest@example.com',
                first_name: finalData?.reservationFormData?.first_name || 'Guest',
                last_name: finalData?.reservationFormData?.last_name || 'User',
                password: 'a' // Default password for auto-created users
              };
              
              const usercreated = await createUser(userData);
              console.log("user created", usercreated);
              
              // Create login form data
              const loginFormData = new FormData();
              loginFormData.append('username', usercreated.email);
              loginFormData.append('password', usercreated.password);
              loginFormData.append('grant_type', '');
              loginFormData.append('client_id', '');
              loginFormData.append('client_secret', '');

              const requestOptions = {
                method: "POST",
                body: loginFormData,
                redirect: "follow",
              };
              const loginResponse = await fetch(`${Base_Url}/api/v1/auth/jwt/login`, requestOptions);
              
              if (loginResponse.ok) {
                const loginResult = await loginResponse.json();
                localStorage.setItem('accessToken', loginResult.access_token);
                setAccessTokenforReservation(loginResult.access_token);
                console.log("accessToken stored:", loginResult.access_token);
              }
              // Create reservation for the new user with JWT token
              await PostYelpReservation(response.data.data.rez_id, "YELP" );
              
            } catch (error) {
              console.error('Error creating user for Yelp reservation:', error);
            }
          }
        }
      } else {
        console.error("Data parameter is null or undefined");
        setLoading(false);
        }
      }
   } catch (error) {
      console.error("Error :", error);
      
      // ✅ Trigger notification for failed Yelp reservation
      showNotification(
        'reservation_cancellation',
        'Reservation Failed ❌',
        'There was an issue processing your Yelp reservation. Please try again.',
        {
          error: error.message,
          reservation_type: 'YELP'
        }
      );
      
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
