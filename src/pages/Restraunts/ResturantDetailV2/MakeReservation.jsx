import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import { LucideLoader } from "lucide-react";
import DatePicker from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Date";
import Time from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Time";
import PersonCard from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Person";
import GuestSignInModal from "@/components/common/GuestSignInModal";
import ReservationConflictModal from "@/components/common/ReservationConflictModal";
import ResyDetailsModal from "@/components/common/ResyDetailsModal";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNotificationToast } from '@/hooks/useNotificationToast';
import { PostResyReservation } from "@/services/reservationwithemail";
export default function MakeReservation({ restrauntDetail }) {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { showNotification } = useNotificationToast();
  const [reservationCard, setReservationCard] = useState();
  const [loading, setLoading] = useState(false);
  
  // Initialize formData from localStorage if available (filter search data)
  const getInitialFormData = () => {
    const savedFormData = localStorage.getItem("searchFormData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        return {
          reservation_covers: parsed.reservation_covers || parsed.persons || 2,
          reservation_date: parsed.reservation_date || parsed.date || null,
          reservation_time: parsed.reservation_time || null,
        };
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
    return {
      reservation_covers: null,
      reservation_date: null,
      reservation_time: null,
    };
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  const [error, setError] = useState("");
  const [nextData, setNextData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedReservationType, setSelectedReservationType] = useState(null);
  const [timeSlots, setTimeSlots] = useState();
  const [openTableTimeSlots, setOpenTableTimeSlots] = useState();
  
  // Conflict checking state
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictingReservations, setConflictingReservations] = useState([]);
  const [pendingReservationData, setPendingReservationData] = useState(null);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get map_url from URL params for OpenTable
  const getMapUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("map_url");
  };

  // Extract OpenTable slug from map_url
  const getOpenTableSlug = () => {
    const mapUrl = getMapUrl();
    if (mapUrl && mapUrl.includes('opentable.com/r/')) {
      // Extract the slug from URLs like: https://www.opentable.com/r/restaurant-slug
      const match = mapUrl.match(/opentable\.com\/r\/([^/?]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    // Fallback to alias if map_url is not available
    return reservationCard?.alias;
  };

  useEffect(() => {
    setReservationCard(restrauntDetail);
    // console.log("restrauntDetail", restrauntDetail)
  }, [restrauntDetail]);

  useEffect(() => {
    // console.log(nextData);
  }, [nextData]);

  // Check for pending reservations after authentication
  // useEffect(() => {
  //   if (authState?.isAuthenticated) {
  //     const pendingReservation = localStorage.getItem('pendingReservation');
  //     if (pendingReservation) {
  //       try {
  //         const reservationData = JSON.parse(pendingReservation);
  //         // Check if the reservation is not too old (24 hours)
  //         const isRecent = Date.now() - reservationData.timestamp < 24 * 60 * 60 * 1000;
          
  //         if (isRecent && reservationData.returnPath === window.location.pathname) {
  //           // Restore the reservation data
  //           setFormData(reservationData.formData);
  //           setSelectedTimeSlot(reservationData.selectedTimeSlot);
  //           setSelectedReservationType(reservationData.reservationData?.restaurant_type);
            
  //           // Clear the pending reservation
  //           localStorage.removeItem('pendingReservation');
            
  //           // Show a toast notification
  //           toast({
  //             title: "Welcome back!",
  //             description: "Your reservation details have been restored. You can now proceed with your booking.",
  //             status: "success",
  //             duration: 5000,
  //           });

  //           // If we have a selected time slot, automatically proceed with the reservation
  //           if (reservationData.selectedTimeSlot) {
  //             // Small delay to ensure state is updated
  //             setTimeout(() => {
  //               if (reservationData.reservationData?.restaurant_type === 'yelp') {
  //                 handleYelpReservation(reservationData.selectedTimeSlot);
  //               } else if (reservationData.reservationData?.restaurant_type === 'open_table') {
  //                 handleOpenTableReservation(reservationData.selectedTimeSlot);
  //               }
  //             }, 1000);
  //           }
  //         } else {
  //           // Clear old or invalid pending reservation
  //           localStorage.removeItem('pendingReservation');
  //         }
  //       } catch (error) {
  //         console.error('Error parsing pending reservation:', error);
  //         localStorage.removeItem('pendingReservation');
  //       }
  //     }
  //   }
  // }, [authState?.isAuthenticated]);

  // Cleanup pending reservations on unmount
  useEffect(() => {
    return () => {
      // Only clear if user is not authenticated (they left without signing in)
      if (!authState?.isAuthenticated) {
        const pendingReservation = localStorage.getItem('pendingReservation');
        if (pendingReservation) {
          const reservationData = JSON.parse(pendingReservation);
          // Only clear if it's from this page
          if (reservationData.returnPath === window.location.pathname) {
            localStorage.removeItem('pendingReservation');
          }
        }
      }
    };
  }, []);

  // Function to check for reservation conflicts
  const checkReservationConflicts = async (reservationDate) => {
    if (!authState?.isAuthenticated) {
      console.log('User not authenticated, skipping conflict check');
      return { has_conflict: false, conflicting_reservations: [] };
    }

    try {
      setIsCheckingConflicts(true);
      
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      const response = await fetch(`${Base_Url}/api/v1/reservation/check_conflict?reservation_date=${encodeURIComponent(reservationDate)}`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        const result = await response.json(); 
        return result;
      } else {
        const errorText = await response.text();
        console.error('Failed to get reservations conflicts:', response.status, errorText);
        return { has_conflict: false, conflicting_reservations: [] };
      }
    } catch (error) {
      console.error('Error checking reservation conflicts:', error);
      return { has_conflict: false, conflicting_reservations: [] };
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  // Function to handle conflict modal actions
  const handleConflictContinue = () => {
    setShowConflictModal(false);
    // Proceed with navigation to reservation
    proceedWithReservation();
  };

  const handleConflictCancel = () => {
    setShowConflictModal(false);
    // Clear any pending data
    setPendingReservationData(null);
  };

  // Function to proceed with reservation navigation
  const proceedWithReservation = () => {
    if (pendingReservationData) {
      const { reservationType, timeSlotData } = pendingReservationData;
      if (reservationType === 'yelp') {
        const updatedNextData = [reservationCard, timeSlotData];
        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      } else if (reservationType === 'open_table') {
        const restaurant_id = reservationCard?.id;
        const restaurantName = reservationCard?.name;
        const restaurantAddress = reservationCard?.address;
        const restaurantCuisines = reservationCard?.cuisines;
        const updatedNextData = [
          formData,
          timeSlotData,
          restaurant_id,
          restaurantName,
          restaurantAddress,
          restaurantCuisines,
        ];
        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      } else if (reservationType === 'resy') {
        // For Resy, open the Resy details modal after conflict acknowledgement
        setSelectedResySlot(restrauntDetail?.results?.resy2);
        setSelectedTimeSlot(timeSlotData);
        setShowResyDetailsModal(true);
      }
      // Clear pending data after navigation
      setPendingReservationData(null);
    }
  };
  
  const handleTimeSlots = () => {
    const { reservation_covers, reservation_date, reservation_time } = formData;

    if (!reservation_date) return setError("Date is Required");
    if (!reservation_time) return setError("Time is Required");
    if (!reservation_covers) return setError("Persons are Required");

    setError("");
    reservationCard?.restaurant_type ==="yelp" ? fetchYelpTimeSlots() :
    reservationCard?.restaurant_type ==="open_table" ? fetchOpenTableTimeSlots() :
    reservationCard?.restaurant_type ==="tock" ? fetchTockTimeSlots() :
    fetchResyTimeSlots();
  };

  // If Tock details already include open times, seed the slots so the user sees them immediately.
  useEffect(() => {
    if (
      restrauntDetail?.restaurant_type === "tock" &&
      Array.isArray(restrauntDetail?.tock_open_time) &&
      restrauntDetail.tock_open_time.length > 0
    ) {
      setTimeSlots(restrauntDetail.tock_open_time);
      setIsDataLoaded(true);
    }
  }, [restrauntDetail]);

  const handleYelpReservation = async (clickedData) => {
    // Prevent rapid clicking
    if (isCheckingConflicts) return;

    if(authState?.isAuthenticated){
      const selectedSlotTime = clickedData.formatted_time || formData.reservation_time;
      const result = clickedData.isodate ? clickedData.isodate.slice(0,19) : `${formData.reservation_date}T${formData.reservation_time}`;
      
      const conflictResult = await checkReservationConflicts(result);
      
      if (conflictResult && conflictResult.has_conflict) {
        // Store conflicting reservations and show modal
        setConflictingReservations(conflictResult.conflicting_reservations || []);
        setPendingReservationData({
          restaurant_name: reservationCard?.name,
          reservation_date: formData.reservation_date,
          reservation_time: selectedSlotTime,
          num_diners: formData.reservation_covers,
          reservationType: 'yelp',
          timeSlotData: clickedData
        });
        setShowConflictModal(true);
      } else {
        // No conflicts, proceed directly
        const updatedNextData = [reservationCard, clickedData];
        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      }
    }
    else
    {
      setSelectedTimeSlot(clickedData);
      setSelectedReservationType('yelp');
      setShowGuestModal(true);
    }
  };

  const handleOpenTableReservation = async (clickedData) => {
    // Prevent rapid clicking
    if (isCheckingConflicts) return;

    if(authState?.isAuthenticated){
      // Convert offset to time format for OpenTable
      const reservationTime = formData.reservation_time;
      const timeDifference = clickedData?.timeOffsetMinutes;
      const [hours, minutes] = reservationTime?.split(":");
      const formattedTimeMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      const calculatedTime = formattedTimeMinutes + timeDifference;
      const calculatedHours = Math.floor(calculatedTime / 60);
      const calculatedMinutes = calculatedTime % 60;
      const finalTime = `${("0" + calculatedHours).slice(-2)}:${("0" + calculatedMinutes).slice(-2)}:00`;

      const conflictResult = await checkReservationConflicts(
        `${formData.reservation_date}T${finalTime}`
      );
      
      if (conflictResult && conflictResult.has_conflict) {
        // Store conflicting reservations and show modal
        setConflictingReservations(conflictResult.conflicting_reservations || []);
        setPendingReservationData({
          restaurant_name: reservationCard?.name,
          reservation_date: formData.reservation_date,
          reservation_time: finalTime,
          num_diners: formData.reservation_covers,
          reservationType: 'open_table',
          timeSlotData: clickedData
        });
        setShowConflictModal(true);
      } else {
        // No conflicts, proceed directly
        const restaurant_id = reservationCard?.id;
        const restaurantName = reservationCard?.name;
        const restaurantAddress = reservationCard?.address;
        const restaurantCuisines = reservationCard?.cuisines;
        const updatedNextData = [
          formData,
          clickedData,
          restaurant_id,
          restaurantName,
          restaurantAddress,
          restaurantCuisines,
        ];

        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      }
    }
    else{
      setSelectedTimeSlot(clickedData);
      setSelectedReservationType('open_table');
      setShowGuestModal(true);
    }
  };

  const fetchTockTimeSlots = async () => {
    setLoading(true);
    // Try domain from props first, then fall back to parsing the URL
    const tockDomain =
      restrauntDetail?.tock_domain ||
      restrauntDetail?.restaurant_alias ||
      restrauntDetail?.url?.split("/")?.filter(Boolean)?.[2];

    if (!tockDomain) {
      setLoading(false);
      setIsDataLoaded(true);
      setTimeSlots([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/tock/get_restaurant_timings/${encodeURIComponent(
          tockDomain
        )}`
      );

      if (response.status === 200) {
        const calendarOfferings =
          response?.data?.data?.calendar?.offerings || {};
        // Tock returns open dates and open times; we surface available times directly.
        const openTimes = calendarOfferings?.openTime || [];
        setTimeSlots(Array.isArray(openTimes) ? openTimes : []);
        setLoading(false);
        setIsDataLoaded(true);
      } else {
        setLoading(fasle);
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchYelpTimeSlots = async () => {
    setLoading(true);
    const yelpTimeParams = {
      restaurant_id: reservationCard?.id,
      restaurat_alias: reservationCard?.alias,
      longitude: reservationCard.coordinates.longitude,
      latitude: reservationCard.coordinates.latitude,
      date: formData?.reservation_date,
      time: formData?.reservation_time,
      search_option: "SAME_WEEK_SEARCH",
      persons: formData?.reservation_covers,
    };
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/get_restaurant_timings?`,
        {
          params: yelpTimeParams,
        }
      );

      if (response.status === 200) {
        setTimeSlots(
          response?.data?.data?.availability_data[0]?.availability_list
        );
        setLoading(false);
        setIsDataLoaded(true);
      } else {
        setLoading(fasle);
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

    const fetchResyTimeSlots = async () => {
    setLoading(true);
    
    // Extract parameters from reservationCard - support both old and new structure
    const venueId = reservationCard?.results?.resy2?.id?.resy || 
                    reservationCard?.id?.resy || 
                    reservationCard?.results?.venues[0]?.venue?.id?.resy;
    const location = reservationCard?.results?.resy2?.location?.url_slug || 
                     reservationCard?.location?.url_slug;
    const urlSlug = reservationCard?.results?.resy2?.url_slug || 
                    reservationCard?.url_slug;
    
    const resyTimeParams = {
      venue_id: venueId,
      date: formData?.reservation_date,
      persons: formData?.reservation_covers,
      ...(location && { location }),
      ...(urlSlug && { url_slug: urlSlug }),
    };
    
    try {
      const response = await axios.get(
        `https://have-a-seatonline.com/api/v1/resy/get_restaurant_details?`,
        {
          params: resyTimeParams,
        }
      );

      if (response.status === 200 && response?.data?.success) {
        // New API structure: slots might be in results.venues[0].slots or data.slots
        // Try both structures for backward compatibility
        const slots = response?.data?.data?.results?.venues?.[0]?.slots || 
                      response?.data?.data?.slots || 
                      [];
        setTimeSlots(slots);
        setLoading(false);
        setIsDataLoaded(true);
      } else {
        setLoading(false);
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchOpenTableTimeSlots = async () => {
    setLoading(true);
    const openTableTimeParams = {
      date: formData?.reservation_date,
      time: formData?.reservation_time,
      persons: formData?.reservation_covers,
      restaurant_id: reservationCard?.id,
    };
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/opentable/get_restaurant_timings?`,
        {
          params: openTableTimeParams,
        }
      );
      if (response.status === 200) {
        setOpenTableTimeSlots(response?.data?.data?.data?.availability);
        setIsDataLoaded(true);
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  function convertOffsetToTime(offset, baseTime) {
    const [hours, minutes] = baseTime.split(":").map(Number);
    const baseTimeDate = new Date();
    baseTimeDate.setHours(hours, minutes, 0, 0);
    const time = new Date(baseTimeDate.getTime() + offset * 60000);
    const formattedHours = time.getHours() % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = String(time.getMinutes()).padStart(2, "0");
    const amPm = time.getHours() >= 12 ? "PM" : "AM";
    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  }

  const formatTimeOnly = (datetimeString) => {
  return new Date(datetimeString.replace(' ', 'T')).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};


    const [showResyDetailsModal, setShowResyDetailsModal] = useState(false);
    const [selectedResySlot, setSelectedResySlot] = useState(null);

    const handleResyClick = async (clickedData) => {
      // Prevent rapid clicking during conflict checks
      if (isCheckingConflicts) return;

      setSelectedReservationType('resy');
      setSelectedTimeSlot(clickedData);

      // If authenticated, check for conflicts before proceeding
      if (authState?.isAuthenticated) {
        const reservationDateTime = clickedData?.date?.start || (formData?.reservation_date && formData?.reservation_time ? `${formData.reservation_date}T${formData.reservation_time}` : null);
        if (reservationDateTime) {
          const conflictResult = await checkReservationConflicts(reservationDateTime);
          if (conflictResult?.has_conflict) {
            setConflictingReservations(conflictResult.conflicting_reservations || []);
            setPendingReservationData({
              restaurant_name: reservationCard?.name,
              reservation_date: formData?.reservation_date,
              reservation_time: formData?.reservation_time,
              num_diners: formData?.reservation_covers,
              reservationType: 'resy',
              timeSlotData: clickedData
            });
            setShowConflictModal(true);
            return;
          }
        }
      }

      // For Resy, show the details modal directly
      setSelectedResySlot(restrauntDetail?.results?.resy2);
      setShowResyDetailsModal(true);
    };

    // Handle guest continuation
    const handleContinueAsGuest = (timeSlot, reservationData) => {
      if (selectedReservationType === 'yelp') {
        const updatedNextData = [reservationCard, timeSlot];
        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      } else if (selectedReservationType === 'open_table') {
        const restaurant_id = reservationCard?.id;
        const restaurantName = reservationCard?.name;
        const restaurantAddress = reservationCard?.address;
        const restaurantCuisines = reservationCard?.cuisines;
        const updatedNextData = [
          formData,
          timeSlot,
          restaurant_id,
          restaurantName,
          restaurantAddress,
          restaurantCuisines,
        ];
        setNextData(updatedNextData);
        const route = `/reservation?data=${encodeURIComponent(
          JSON.stringify(updatedNextData)
        )}`;
        navigate(route);
        setFormData("");
      } else if (selectedReservationType === 'resy') {
        // For Resy, show the Resy details modal
        setSelectedResySlot(restrauntDetail?.results?.resy2);
        setShowResyDetailsModal(true);
      }
    };

    // Handle Resy details save
    const handleResyDetailsSave = async (details, saveForFuture) => {
      // console.log("Resy details saved:", details, saveForFuture);
      
      const bookingResponse = details?.bookingResponse;
      const bookingDetails = details?.bookingDetails;
      // Use reservationDate from details if available, otherwise from formData
      const reservationDate = details?.reservationDate || formData?.reservation_date;
      // Use selectedTimeSlot from details if available, otherwise from state
      const timeSlot = details?.selectedTimeSlot || selectedTimeSlot;
      // Use partySize from details if available, otherwise from formData
      const partySize = details?.partySize || formData?.reservation_covers;
      
      // Extract reservation ID from booking response
      const reservationId = bookingResponse?.data?.reservation_id || 
                           bookingResponse?.data?.id ||
                           bookingResponse?.data?.data?.reservation_id ||
                           bookingResponse?.reservation_id ||
                           null;

      // Get restaurant name
      const venue = bookingDetails?.venue || bookingResponse?.data?.venue;
      const restaurantName = venue?.name || reservationCard?.name || reservationCard?.results?.resy2?.name || 'Restaurant';
      
      // Format time for display
      const formattedTime = timeSlot?.date?.start ? 
        new Date(timeSlot.date.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        null;
      
      // Show notification for successful booking
      if (bookingResponse?.success) {
        showNotification(
          'reservation_confirmation',
          'Reservation Confirmed! 🎉',
          `Your table at ${restaurantName} is confirmed for ${reservationDate}${formattedTime ? ' at ' + formattedTime : ''}`,
          {
            restaurant_name: restaurantName,
            reservation_date: reservationDate,
            reservation_time: formattedTime,
            num_diners: partySize || 2,
            reservation_id: reservationId?.toString() || 'unknown',
            reservation_type: 'RESY'
          }
        );
      }

      // Save to backend if user is authenticated
      if (authState?.isAuthenticated && reservationId) {
        try {
          const finalData = {
            bookingResponse: { success: bookingResponse?.success, data: bookingResponse },
            bookingDetails: bookingDetails,
            formData: details,
            reservationDate: reservationDate,
            selectedTimeSlot: timeSlot,
            partySize: partySize,
            restaurantName: restaurantName,
            restaurantId: reservationCard?.id?.resy || reservationCard?.results?.resy2?.id?.resy || null,
          };

          const reservationResult = await PostResyReservation(reservationId, "RESY", finalData);
          console.log("Backend reservation result:", reservationResult);
          if (reservationResult?.success) {
            console.log("Resy reservation successfully saved to backend");
          } else {
            console.error("Failed to save Resy reservation to backend");
          }
        } catch (error) {
          console.error("Error saving Resy reservation to backend:", error);
          showNotification(
            'reservation_cancellation',
            'Backend Save Failed ⚠️',
            'Your reservation was created successfully, but there was an issue saving it to your account. Please contact support.',
            {
              error: error.message,
              reservation_type: 'RESY'
            }
          );
        }
      }

      // Close the modal
      setShowResyDetailsModal(false);
      setSelectedResySlot(null);
      setSelectedTimeSlot(null);
    };

    // Handle Resy details skip
    const handleResyDetailsSkip = () => {
      console.log("Skipping Resy details" , reservationCard);
      // Just redirect to Resy without saving
      if (reservationCard?.links?.web) {
        window.open(reservationCard?.links?.web, '_blank', 'noopener,noreferrer');
      }
      else{
        window.open(`https://resy.com/cities/${reservationCard?.location?.url_slug}/venues/${reservationCard?.url_slug}`, '_blank', 'noopener,noreferrer');
      }
      setShowResyDetailsModal(false);
      setSelectedResySlot(null);
    };

    const handlenotimeslots = () => {
      console.log("no time slots available" , reservationCard);
      if (reservationCard?.restaurant_type === "yelp") {
        window.location.href = `https://www.yelp.com/biz/${reservationCard?.alias}?osq=${reservationCard?.name}`;
      }
      else if (reservationCard?.restaurant_type === "open_table") {
        // Use map_url slug if available, otherwise fallback to alias
        const openTableSlug = getOpenTableSlug();
        window.location.href = `https://www.opentable.com/r/${openTableSlug}`;
      }
      else if (reservationCard?.restaurant_type === "resy") {
        window.location.href = `${reservationCard?.links?.web}`;
      }
      else if (reservationCard?.restaurant_type === "tableagent" || reservationCard?.restaurant_type === "tock") {
        window.location.href = `${reservationCard?.url}`;
      }
      else{
        window.location.href = `https://www.google.com/search?q=${reservationCard?.name}`;
      }
    };


  return (
    <>
    <div className="overflow-hidden">
      <h1 className=" font-bold my-10 text-4xl font-agrandir text-shipGrey sm:text-3xl lg:text-4xl">
        Make a Reservation
      </h1>
      <div className="w-full">
    <div className="flex flex-col md:flex-row gap-4 items-center border-[0.4px] border-[#B9B9B9] bg-white px-4 py-4 md:px-5 md:py-2 rounded-2xl">
      
    <div className="flex-grow w-full md:w-auto border-b-2 md:border-b-0 md:border-r-2 pb-2 md:pb-0">
        <span className="ml-4 font-roboto text-lg md:text-xl text-grayhead font-normal">Date</span>
            <DatePicker setFormData={setFormData} initialDate={formData.reservation_date} />
          </div>

          <div className="flex-grow w-full md:w-auto border-b-2 md:border-b-0 md:border-r-2 pb-2 md:pb-0">
        <span className="ml-4 font-roboto text-lg md:text-xl text-grayhead font-normal">Time</span>
            <Time setFormData={setFormData} initialTime={formData.reservation_time} />
          </div>

          <div className="flex-grow w-full md:w-auto border-b-2 md:border-b-0 md:border-r-2 pb-2 md:pb-0">
        <span className="ml-4 font-roboto text-lg md:text-xl text-grayhead font-normal">Guests</span>
            <PersonCard setFormData={setFormData} initialGuests={formData.reservation_covers} />
          </div>

          <div className="w-full md:w-auto">
            <button
              // onClick={(reservationCard?.restaurant_type === "resy" ||
              //   reservationCard?.restaurant_type === "open_table"
              // ) ? handleTimeSlots : handlenotimeslots}
              onClick={handleTimeSlots}
              className="bg-plum px-4 py-2 text-white rounded-full w-full md:w-auto"
            >
              Find a Table
            </button>
        </div>
        </div>
        <div>
          {error && error !== null ? (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          ) : null}

          {loading ? (
            <LucideLoader className="w-6 h-6 justify-center animate-spin align-middle mx-auto" />
          ) : (
            <div className="py-3 sm:py-10 text-center">
              {isDataLoaded ? (
                  restrauntDetail?.restaurant_type === "yelp" ? (
                    Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-shipGrey font-agrandir mb-4">Time Slots</p>
                        <div className="flex flex-wrap justify-center">
                          {timeSlots
                            .filter((data) => !isNaN(data.timestamp))
                            .map((data, index) => (
                              <button
                                key={index}
                                className={`bg-plum text-white font-semibold font-roboto text-base p-2 px-3 m-1 rounded-lg ${isCheckingConflicts ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isCheckingConflicts && handleYelpReservation(data)}
                                disabled={isCheckingConflicts}
                              >
                                {/* {new Date(data.timestamp * 1000).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} */}
                                {/* {isCheckingConflicts ? "Checking..." : data.formatted_time} */}
                                {data.formatted_time}
                              </button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg text-red-600">No slots available.</p>
                    )
                  ) : restrauntDetail?.restaurant_type === "open_table" ? (
                    Array.isArray(openTableTimeSlots) &&
                    openTableTimeSlots[0]?.availabilityDays[0]?.slots.length > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-shipGrey font-agrandir mb-4">Time Slots</p>
                        <div className="flex flex-wrap justify-center">
                          {openTableTimeSlots[0]?.availabilityDays[0]?.slots
                            .filter((data) => !isNaN(data.timeOffsetMinutes))
                            .map((data, index) => (
                              <button
                                key={index}
                                className={`bg-purple-600 text-white p-3 m-1 rounded-lg ${isCheckingConflicts ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isCheckingConflicts && handleOpenTableReservation(data)}
                                disabled={isCheckingConflicts}
                              >
                                {convertOffsetToTime(
                                  data.timeOffsetMinutes,
                                  formData?.reservation_time
                                )}
                                {/* {isCheckingConflicts ? "Checking..." : convertOffsetToTime(
                                  data.timeOffsetMinutes,
                                  formData?.reservation_time
                                )} */}
                              </button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg text-red-600">No opentable slots available.</p>
                    )
                  ) : restrauntDetail?.restaurant_type === "resy" ? (
                    timeSlots.length > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-shipGrey font-agrandir mb-4">Time Slots</p>
                        <div className="flex flex-wrap justify-center">
                          {timeSlots
                            // .filter((data) => !isNaN(data.timeOffsetMinutes))
                            .map((data, index) => (
                              <button
                                key={index}
                                className="bg-purple-600 text-white p-3 m-1 rounded-lg"
                                onClick={() => handleResyClick(data)}
                              >
                                {/* {convertOffsetToTime(
                                  data.date.start,
                                  formData?.reservation_time
                                )} */}
                                {formatTimeOnly(data.date.start)}
                              </button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg text-red-600">No resy slots available.</p>
                    )
              ) : restrauntDetail?.restaurant_type === "tock" ? (
                Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold text-shipGrey font-agrandir mb-4">Time Slots</p>
                    <div className="flex flex-wrap justify-center">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          className="bg-purple-600 text-white p-3 m-1 rounded-lg"
                          onClick={() => window.open(restrauntDetail?.url || reservationCard?.url, "_blank", "noopener,noreferrer")}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-lg text-red-600">No tock slots available.</p>
                )
              ) :  <p className="text-lg text-red-600">Couldnot get slots.</p>
                ) : null}

            </div>
          )}
        </div>
      </div>
      </div>

      <ResyDetailsModal
        isOpen={showResyDetailsModal}
        onClose={() => {
          setShowResyDetailsModal(false);
          setSelectedResySlot(null);
          setSelectedTimeSlot(null);
        }}
        onSave={handleResyDetailsSave}
        onSkip={handleResyDetailsSkip}
        selectedTimeSlot={selectedTimeSlot}
        reservationDate={formData.reservation_date}
        partySize={formData.reservation_covers}
        venueLocationSlug={reservationCard?.results?.resy2?.location?.url_slug || reservationCard?.location?.url_slug}
        venueSlug={reservationCard?.results?.resy2?.url_slug || reservationCard?.url_slug}
      />

      <GuestSignInModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onContinueAsGuest={handleContinueAsGuest}
        selectedTimeSlot={selectedTimeSlot}
        reservationData={reservationCard}
        formData={formData}
      />

      <ReservationConflictModal
        isOpen={showConflictModal}
        onClose={handleConflictCancel}
        onContinue={handleConflictContinue}
        conflictingReservations={conflictingReservations}
        newReservationDetails={pendingReservationData}
      />
    </>
  );
}