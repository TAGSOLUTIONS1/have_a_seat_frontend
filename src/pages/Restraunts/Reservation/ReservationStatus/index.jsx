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
import { PostOpentableReservationwithEmail , PostYelpReservationwithEmail , PostYelpReservation, PostOpentableReservation } from "@/services/reservationwithemail";

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
          null,
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
          // console.log("Authentication state:", authState?.isAuthenticated);
          // console.log("Access token exists:", !!localStorage.getItem('accessToken'));
          
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
              confirmation_number: response.data.data.confirmationNuymber,
              party_size: response.data.data.partySize,
              reservation_datetime: response.data.data.reservationDateTime,
              restaurant_id: response.data.data.restaurantId
            }
          );
          // console.log('Auth state:', authState);
          if(authState?.isAuthenticated){
           try {
             const reservationResult = await PostOpentableReservation(response.data.data.reservationId, "OPENTABLE", myData);
             if (reservationResult?.success) {
               console.log("OpenTable reservation successfully saved to backend");
             } else {
               console.error("Failed to save OpenTable reservation to backend");
             }
           } catch (error) {
             console.error("Error saving OpenTable reservation to backend:", error);
             showNotification(
               'reservation_cancellation',
               'Backend Save Failed ⚠️',
               'Your reservation was created successfully, but there was an issue saving it to your account. Please contact support.',
               {
                 error: error.message,
                 reservation_type: 'OPENTABLE'
               }
             );
           }
          } else {
            // Create user account for the reservation
            try {
              const userData = {
                first_name: myData?.reservationFormData?.first_name,
                last_name: myData?.reservationFormData?.last_name,
                email: myData?.reservationFormData?.email,
                password: 'temp123' // Default password for auto-created users
              };
              
              const usercreated = await createUser(userData);
              console.log("user created", usercreated);
              
              if (usercreated && usercreated.email) {
                // Pass myData to the reservation function
                const reservationResult = await PostOpentableReservationwithEmail(
                  response.data.data.reservationId, 
                  "OPENTABLE", 
                  usercreated.email,
                  myData
                );
                
                if (reservationResult?.success) {
                  console.log("OpenTable reservation successfully saved to backend");
                } else {
                  console.error("Failed to save OpenTable reservation to backend");
                }
              } else {
                console.error("User creation failed - no email returned");
              }
                            
            } catch (error) {
              console.error('Error creating user for OpenTable reservation:', error);
              // Show error notification
              showNotification(
                'reservation_cancellation',
                'User Creation Failed ❌',
                'There was an issue creating your account. Your reservation was made but may not be saved to your account.',
                {
                  error: error.message,
                  reservation_type: 'OPENTABLE'
                }
              );
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
          // console.log("Authentication state:", authState?.isAuthenticated);
          // console.log("Access token exists:", !!localStorage.getItem('accessToken'));
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
           try {
             const reservationResult = await PostYelpReservation(response.data.data.rez_id, "YELP", finalData);
             if (reservationResult?.success) {
               console.log("Yelp reservation successfully saved to backend");
             } else {
               console.error("Failed to save Yelp reservation to backend");
             }
           } catch (error) {
             console.error("Error saving Yelp reservation to backend:", error);
             showNotification(
               'reservation_cancellation',
               'Backend Save Failed ⚠️',
               'Your reservation was created successfully, but there was an issue saving it to your account. Please contact support.',
               {
                 error: error.message,
                 reservation_type: 'YELP'
               }
             );
           }
          } else {
            // Create user account for the reservation
            try {
              const userData = {
                email: finalData?.reservationFormData?.email || 'guest@example.com',
                first_name: finalData?.reservationFormData?.first_name || 'Guest',
                last_name: finalData?.reservationFormData?.last_name || 'User',
                password: 'a' 
              };
              
              const usercreated = await createUser(userData);
              console.log("user created", usercreated , usercreated.email);
              
              if (usercreated && usercreated.email) {
                // Pass finalData to the reservation function
                const reservationResult = await PostYelpReservationwithEmail(
                  response.data.data.rez_id, 
                  "YELP", 
                  usercreated.email,
                  finalData
                );
                
                if (reservationResult?.success) {
                  console.log("Reservation successfully saved to backend");
                } else {
                  console.error("Failed to save reservation to backend");
                }
              } else {
                console.error("User creation failed - no email returned");
              }
              
            } catch (error) {
              console.error('Error creating user for Yelp reservation:', error);
              // Show error notification
              showNotification(
                'reservation_cancellation',
                'User Creation Failed ❌',
                'There was an issue creating your account. Your reservation was made but may not be saved to your account.',
                {
                  error: error.message,
                  reservation_type: 'YELP'
                }
              );
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
