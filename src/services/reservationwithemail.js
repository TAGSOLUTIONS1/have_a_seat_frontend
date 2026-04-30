const API_URL = "http://127.0.0.1:8000/api/v1"
import axios from "axios";

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

export const PostYelpReservationwithEmail = async (reservationId, restaurantType, email_for_reservation, finalData) => {
    try {
      console.log("finalData", finalData , email_for_reservation);
      if (!finalData) {
        throw new Error("Final data is required for reservation creation");
      }

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

      console.log('Creating Yelp reservation with email:', requiredApiParams);
      
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
        console.log('Yelp reservation saved to backend successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Error creating Yelp reservation with email:", error);
      throw error;
    }
  };

export const PostOpentableReservationwithEmail = async (reservationId, restaurantType, email_for_reservation, finalData) => {
    try {
      if (!finalData) {
        throw new Error("Final data is required for reservation creation");
      }

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

      console.log('Creating OpenTable reservation with email:', requiredApiParams);

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

      // ✅ Trigger notification for successful reservation
      if (response.status === 200 || response.status === 201) {
        console.log('OpenTable reservation saved to backend successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

    } catch (error) {
      console.error("Error creating OpenTable reservation with email:", error);
      throw error;
    }
  };

export const PostOpentableReservation = async (reservationId, restaurantType, finalData) => {
    try {
      if (!finalData) {
        throw new Error("Final data is required for reservation creation");
      }

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

      console.log('Creating OpenTable reservation for authenticated user:', requiredApiParams);
      // Get accessToken from localStorage
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      if (!token) {
        throw new Error("No access token found. User must be authenticated.");
      }

      console.log('Making API call to create reservation...');
      const response = await axios.post(
        `${API_URL}/reservation/create_reservation/`,
        null,
        {
          params: requiredApiParams,
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      console.log('Backend API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      // ✅ Trigger notification for successful reservation
      if (response.status === 200 || response.status === 201) {
        console.log('OpenTable reservation saved to backend successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

    } catch (error) {
      console.error("Error creating OpenTable reservation:", error);
      throw error;
    }
  };

export const PostYelpReservation = async (reservationId, restaurantType, finalData) => {
    try {
      if (!finalData) {
        throw new Error("Final data is required for reservation creation");
      }

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

      console.log('Creating Yelp reservation for authenticated user:', requiredApiParams);
      
      // Get accessToken from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No access token found. User must be authenticated.");
      }

      const response = await axios.post(
        `${API_URL}/reservation/create_reservation/`, 
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
        console.log('Yelp reservation saved to backend successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Error creating Yelp reservation:", error);
      throw error;
    }
  };

export const PostResyReservation = async (reservationId, restaurantType, finalData) => {
    try {
      if (!finalData) {
        throw new Error("Final data is required for reservation creation");
      }

      // Extract data from Resy booking response
      const bookingResponse = finalData?.bookingResponse;
      const bookingDetails = finalData?.bookingDetails;
      const formData = finalData?.formData;
      const reservationDate = finalData?.reservationDate;
      const selectedTimeSlot = finalData?.selectedTimeSlot;
      const partySize = finalData?.partySize;

      // Get venue information
      const venue = bookingDetails?.venue || bookingResponse?.data?.venue;
      const restaurantName = venue?.name || finalData?.restaurantName || 'Restaurant';
      const restaurantId = venue?.id?.resy || venue?.id || finalData?.restaurantId || 'unknown';
      const location = venue?.location;
      const city = location?.locality || location?.city || 'Unknown';

      // Format date and time
      let formattedDate = reservationDate;
      let formattedTime = null;
      
      if (selectedTimeSlot?.date?.start) {
        try {
          const timeDate = new Date(selectedTimeSlot.date.start);
          if (!isNaN(timeDate.getTime())) {
            const hours = timeDate.getHours().toString().padStart(2, '0');
            const minutes = timeDate.getMinutes().toString().padStart(2, '0');
            formattedTime = `${hours}:${minutes}`;
          }
        } catch (e) {
          console.error("Error formatting time:", e);
        }
      }

      // Format date as YYYY-MM-DD
      if (formattedDate) {
        if (formattedDate.includes('T')) {
          formattedDate = formattedDate.split('T')[0];
        } else if (typeof formattedDate === 'string' && formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already in YYYY-MM-DD format
          formattedDate = formattedDate;
        } else {
          // Try to parse and format
          const dateObj = new Date(formattedDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split('T')[0];
          }
        }
      }

      const DateAndTime = formattedTime && formattedDate ? `${formattedDate}T${formattedTime}` : formattedDate;

      // Get reservation ID from booking response
      const resyReservationId = reservationId || 
                                bookingResponse?.data?.reservation_id || 
                                bookingResponse?.data?.id ||
                                'unknown';

      // Calculate price from payment amounts if available
      const paymentAmounts = bookingDetails?.payment?.amounts || bookingResponse?.data?.payment?.amounts;
      const price = paymentAmounts?.total || paymentAmounts?.reservation_charge || 0;

      // Get cuisine type from venue
      const cuisineType = venue?.content?.find(c => c.name === "about")?.body ? 
                         'Unknown' : 'Unknown'; // Resy doesn't always provide cuisine type

      const requiredApiParams = {
        reservation_id: resyReservationId,
        reservation_type: restaurantType || "RESY",
        reservation_status: "CONFIRMED",
        reservation_date: DateAndTime,
        restaurant_id: restaurantId.toString(),
        restaurant_name: restaurantName,
        location: city,
        price: price,
        num_diners: partySize || 2,
        cuisine_type: cuisineType,
        indoor_outdoor: "Indoor",
      };

      console.log('Creating Resy reservation for authenticated user:', requiredApiParams);
      
      // Get accessToken from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No access token found. User must be authenticated.");
      }

      const response = await axios.post(
        `${API_URL}/reservation/create_reservation/`, 
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
        console.log('Resy reservation saved to backend successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Error creating Resy reservation:", error);
      throw error;
    }
  };