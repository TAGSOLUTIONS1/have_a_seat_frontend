import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import {
  LucideLoader,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GuestSignInModal from "@/components/common/GuestSignInModal";
import ReservationConflictModal from "@/components/common/ReservationConflictModal";
import ResyDetailsModal from "@/components/common/ResyDetailsModal";
import DiningAreaSelectionModal from "@/components/common/DiningAreaSelectionModal";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNotificationToast } from '@/hooks/useNotificationToast';
import { PostResyReservation } from "@/services/reservationwithemail";

const PLATFORM_LABELS = {
  yelp: "Yelp",
  open_table: "OpenTable",
  resy: "Resy",
  tock: "Tock",
  tableagent: "TableAgent",
  thefork: "TheFork",
};

const DINNER_START = "17:00";
const DINNER_END = "22:00";

const buildTimeOptions = () => {
  const out = [];
  for (let h = 8; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
};

const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh} ${ampm}` : `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
};

const FIELD_LABEL =
  "text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-[#6b6478] font-roboto";

export default function MakeReservation({ restrauntDetail, hideTitle = false }) {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { showNotification } = useNotificationToast();
  const [reservationCard, setReservationCard] = useState();
  const [loading, setLoading] = useState(false);
  
  // Initialize formData from localStorage if available (filter search data)
  const getInitialFormData = () => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const savedFormData = localStorage.getItem("searchFormData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        const savedDate = parsed.reservation_date || parsed.date || null;
        return {
          reservation_covers:
            Number(parsed.reservation_covers || parsed.persons) || 2,
          reservation_date:
            savedDate && savedDate >= todayStr ? savedDate : todayStr,
          reservation_time: parsed.reservation_time || "19:00",
        };
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
    return {
      reservation_covers: 2,
      reservation_date: todayStr,
      reservation_time: "19:00",
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [showAllTimes, setShowAllTimes] = useState(() => {
    const t = getInitialFormData().reservation_time;
    return Boolean(t && (t < DINNER_START || t > DINNER_END));
  });
  const [moreGuestsOpen, setMoreGuestsOpen] = useState(false);
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
  
  // Dining area selection state
  const [showDiningAreaModal, setShowDiningAreaModal] = useState(false);
  const [pendingTimeSlotData, setPendingTimeSlotData] = useState(null);
  
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
        proceedWithOpenTableReservation(timeSlotData);
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

    // Store the time slot data and show dining area selection modal
    setPendingTimeSlotData(clickedData);
    setShowDiningAreaModal(true);
  };

  // Handle dining area selection
  const handleDiningAreaSelected = async (selectedData) => {
    setShowDiningAreaModal(false);
    
    // Merge dining area data with time slot data
    const timeSlotWithDiningArea = {
      ...pendingTimeSlotData,
      diningAreaId: selectedData.dining_area_id,
      dining_area_id: selectedData.dining_area_id,
      dining_area_name: selectedData.dining_area_name,
      seating_option: selectedData.seating_option,
      seating_description: selectedData.seating_description,
    };

    if(authState?.isAuthenticated){
      // Convert offset to time format for OpenTable
      const reservationTime = formData.reservation_time;
      const timeDifference = timeSlotWithDiningArea?.timeOffsetMinutes;
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
          timeSlotData: timeSlotWithDiningArea
        });
        setShowConflictModal(true);
      } else {
        // No conflicts, proceed directly
        proceedWithOpenTableReservation(timeSlotWithDiningArea);
      }
    }
    else{
      setSelectedTimeSlot(timeSlotWithDiningArea);
      setSelectedReservationType('open_table');
      setShowGuestModal(true);
    }
    
    setPendingTimeSlotData(null);
  };

  // Helper function to proceed with OpenTable reservation
  const proceedWithOpenTableReservation = (timeSlotData) => {
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
        `${Base_Url}/api/v1/tock/get_restaurant_timings/${encodeURIComponent(
          tockDomain
        )}`
      );

      if (response.status === 200) {
        const calendarOfferings =
          response?.data?.data?.calendar?.offerings || {};
        // Tock returns open dates and open times; we surface available times directly.
        const openTimes = calendarOfferings?.openTime || [];
        const normalizedTimes = Array.isArray(openTimes) ? openTimes : [];
        setTimeSlots(normalizedTimes);
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
        const yelpSlots =
          response?.data?.data?.availability_data[0]?.availability_list || [];
        setTimeSlots(yelpSlots);
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
        const openTableSlots = response?.data?.data?.data?.availability || [];
        setOpenTableTimeSlots(openTableSlots);
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
        proceedWithOpenTableReservation(timeSlot);
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
      else if (reservationCard?.restaurant_type === "thefork") {
        window.location.href = `https://www.thefork.com/restaurant/${reservationCard?.slug}-r${reservationCard?.legacyId}`;
      }
      else{
        window.location.href = `https://www.google.com/search?q=${reservationCard?.name}`;
      }
    };


  const restaurantType = reservationCard?.restaurant_type;
  const platformLabel = PLATFORM_LABELS[restaurantType] || "the restaurant";
  const canFetchInline =
    restaurantType === "resy" || restaurantType === "open_table";

  // Any change to the form invalidates previously fetched slots.
  const updateForm = (patch) => {
    setError("");
    setIsDataLoaded(false);
    setFormData((prev) => ({
      ...(prev && typeof prev === "object" ? prev : {}),
      ...patch,
    }));
  };

  const selectedDate = formData?.reservation_date;
  const selectedTime = formData?.reservation_time;
  const selectedCovers = Number(formData?.reservation_covers) || null;

  const dayChips = Array.from({ length: 5 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      value: format(d, "yyyy-MM-dd"),
      dow: i === 0 ? "Today" : format(d, "EEE"),
      day: format(d, "d"),
    };
  });

  const customDateChip = (() => {
    if (!selectedDate || dayChips.some((d) => d.value === selectedDate))
      return null;
    const d = new Date(`${selectedDate}T00:00:00`);
    if (isNaN(d.getTime())) return null;
    return { value: selectedDate, dow: format(d, "EEE"), day: format(d, "MMM d") };
  })();

  const allTimes = buildTimeOptions();
  const collapsedTimes = allTimes.filter(
    (t) => t >= DINNER_START && t <= DINNER_END
  );
  const visibleTimes = showAllTimes ? allTimes : collapsedTimes;

  const slotChips = (() => {
    if (restaurantType === "yelp") {
      return (Array.isArray(timeSlots) ? timeSlots : [])
        .filter((d) => !isNaN(d.timestamp))
        .map((d, i) => ({
          key: `yelp-${i}`,
          label: d.formatted_time,
          onClick: () => !isCheckingConflicts && handleYelpReservation(d),
        }));
    }
    if (restaurantType === "open_table") {
      const slots = openTableTimeSlots?.[0]?.availabilityDays?.[0]?.slots || [];
      return slots
        .filter((d) => !isNaN(d.timeOffsetMinutes))
        .map((d, i) => ({
          key: `ot-${i}`,
          label: convertOffsetToTime(d.timeOffsetMinutes, selectedTime),
          onClick: () => !isCheckingConflicts && handleOpenTableReservation(d),
        }));
    }
    if (restaurantType === "resy") {
      return (Array.isArray(timeSlots) ? timeSlots : [])
        .filter((d) => d?.date?.start)
        .map((d, i) => ({
          key: `resy-${i}`,
          label: formatTimeOnly(d.date.start),
          onClick: () => handleResyClick(d),
        }));
    }
    if (restaurantType === "tock") {
      return (Array.isArray(timeSlots) ? timeSlots : []).map((t, i) => ({
        key: `tock-${i}`,
        label: t,
        onClick: () =>
          window.open(
            restrauntDetail?.url || reservationCard?.url,
            "_blank",
            "noopener,noreferrer"
          ),
      }));
    }
    return [];
  })();

  const dayChipClass = (active) =>
    `flex-1 min-w-0 py-[9px] rounded-[14px] border-[1.5px] text-center transition-all ${
      active
        ? "bg-[#8b2fd6] border-[#8b2fd6] text-white"
        : "bg-white border-[#ece5f6] text-[#1f1b2e] hover:border-[#8b2fd6]"
    }`;

  const timeChipClass = (active) =>
    `py-2.5 px-1 rounded-xl border-[1.5px] text-[13px] font-bold font-roboto whitespace-nowrap transition-all ${
      active
        ? "bg-[#8b2fd6] border-[#8b2fd6] text-white"
        : "bg-white border-[#ece5f6] text-[#1f1b2e] hover:border-[#8b2fd6]"
    }`;

  const panelBody = (
    <>
      <div className="px-5 pb-[18px]">
        <div className={`${FIELD_LABEL} mb-[9px]`}>Date</div>
        <div className="flex items-stretch gap-[7px]">
          {dayChips.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => updateForm({ reservation_date: d.value })}
              className={dayChipClass(selectedDate === d.value)}
            >
              <span className="block text-[10.5px] font-bold tracking-[0.06em] uppercase opacity-75 font-roboto">
                {d.dow}
              </span>
              <span className="block text-[19px] font-extrabold leading-tight">
                {d.day}
              </span>
            </button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              {customDateChip ? (
                <button
                  type="button"
                  aria-label="Pick another date"
                  className={`${dayChipClass(true)} px-1`}
                >
                  <span className="block text-[10.5px] font-bold tracking-[0.06em] uppercase opacity-75 font-roboto">
                    {customDateChip.dow}
                  </span>
                  <span className="block text-[13px] font-extrabold leading-[1.85] whitespace-nowrap">
                    {customDateChip.day}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Pick another date"
                  className="flex-1 min-w-0 py-[9px] rounded-[14px] border-[1.5px] border-dashed border-[#d9cdec] bg-white text-[#7723bd] flex flex-col items-center justify-center gap-1 hover:border-[#8b2fd6] transition-all"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase font-roboto">
                    More
                  </span>
                </button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={
                  selectedDate
                    ? new Date(`${selectedDate}T00:00:00`)
                    : undefined
                }
                onSelect={(d) => {
                  if (d)
                    updateForm({ reservation_date: format(d, "yyyy-MM-dd") });
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className={`${FIELD_LABEL} mt-4 mb-[9px]`}>Guests</div>
        <div className="flex gap-1 p-1 bg-[#f4f0fa] rounded-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateForm({ reservation_covers: n })}
              className={`flex-1 min-w-0 py-2 rounded-full text-sm font-bold font-roboto transition-all ${
                selectedCovers === n
                  ? "bg-white text-[#7723bd] shadow-[0_2px_8px_rgba(31,27,46,0.10)]"
                  : "text-[#6b6478] hover:text-[#1f1b2e]"
              }`}
            >
              {n}
            </button>
          ))}
          <Popover open={moreGuestsOpen} onOpenChange={setMoreGuestsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="More than 8 guests"
                className={`flex-1 min-w-0 py-2 rounded-full text-sm font-bold font-roboto whitespace-nowrap transition-all ${
                  selectedCovers >= 9
                    ? "bg-white text-[#7723bd] shadow-[0_2px_8px_rgba(31,27,46,0.10)]"
                    : "text-[#6b6478] hover:text-[#1f1b2e]"
                }`}
              >
                {selectedCovers >= 9 ? selectedCovers : "9+"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className={`${FIELD_LABEL} px-1 pb-2`}>Party size</div>
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 12 }, (_, i) => i + 9).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      updateForm({ reservation_covers: n });
                      setMoreGuestsOpen(false);
                    }}
                    className={`w-10 py-2 rounded-xl border-[1.5px] text-sm font-bold font-roboto transition-all ${
                      selectedCovers === n
                        ? "bg-[#8b2fd6] border-[#8b2fd6] text-white"
                        : "bg-white border-[#ece5f6] text-[#1f1b2e] hover:border-[#8b2fd6]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center justify-between mt-4 mb-[9px]">
          <span className={FIELD_LABEL}>Time</span>
          <button
            type="button"
            onClick={() => setShowAllTimes((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7723bd] hover:text-[#8b2fd6] font-roboto"
          >
            {showAllTimes ? "Fewer times" : "More times"}
            {showAllTimes ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div
          className={`grid grid-cols-3 min-[380px]:grid-cols-4 gap-[7px] ${
            showAllTimes ? "max-h-[236px] overflow-y-auto pr-1" : ""
          }`}
        >
          {visibleTimes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateForm({ reservation_time: t })}
              className={timeChipClass(selectedTime === t)}
            >
              {fmt12(t)}
            </button>
          ))}
        </div>

        {error ? <p className="text-red-500 text-sm mt-3">{error}</p> : null}

        <button
          type="button"
          onClick={canFetchInline ? handleTimeSlots : handlenotimeslots}
          disabled={loading}
          className="mt-[18px] w-full h-12 rounded-full bg-[#8b2fd6] hover:bg-[#7723bd] disabled:opacity-70 text-white font-roboto text-[15px] font-bold shadow-[0_6px_16px_rgba(139,47,214,0.28)] transition-all inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LucideLoader className="w-4 h-4 animate-spin" />
              Checking availability…
            </>
          ) : canFetchInline ? (
            "Find a table"
          ) : (
            `Book on ${platformLabel}`
          )}
        </button>
      </div>

      {loading || isDataLoaded ? (
        <div className="bg-[#faf7ff] border-t border-[#ece5f6] px-5 pt-3.5 pb-5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className={FIELD_LABEL}>Available times</span>
            <span className="text-[11px] font-extrabold tracking-[0.06em] uppercase font-roboto text-[#7723bd]">
              {loading ? "Checking…" : `via ${platformLabel}`}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-11 rounded-[14px] bg-[linear-gradient(90deg,#ece5f6_0%,#f7f3fd_45%,#ece5f6_85%)] bg-[length:320px_100%] animate-[seatShimmer_1.1s_linear_infinite]"
                  style={{ animationDelay: `${i * 0.14}s` }}
                />
              ))}
            </div>
          ) : slotChips.length > 0 ? (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-3 min-[380px]:grid-cols-4 gap-[7px]">
                {slotChips.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={s.onClick}
                    disabled={isCheckingConflicts}
                    className={`py-2.5 px-1 rounded-xl border-[1.5px] border-[#ece5f6] bg-white text-[13px] font-bold font-roboto text-[#1f1b2e] shadow-[0_1px_6px_rgba(31,27,46,0.05)] whitespace-nowrap transition-all hover:bg-[#8b2fd6] hover:border-[#8b2fd6] hover:text-white ${
                      isCheckingConflicts ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-[11.5px] text-[#6b6478] mt-3 leading-normal font-roboto">
                One tap continues the booking — no re-entering details.
              </p>
            </div>
          ) : (
            <div className="border-[1.5px] border-dashed border-[#cfc3e4] rounded-[14px] bg-white px-4 py-[18px] animate-fadeIn">
              <div className="text-base font-extrabold">
                Nothing at {fmt12(selectedTime)}
              </div>
              <p className="text-[13px] text-[#6b6478] mt-1.5 leading-normal font-roboto">
                No tables for {selectedCovers || 2}{" "}
                {selectedCovers === 1 ? "guest" : "guests"} then. Try a
                different time, or book directly on {platformLabel}.
              </p>
              <button
                type="button"
                onClick={handlenotimeslots}
                className="mt-3 h-10 px-4 rounded-full border-[1.5px] border-[#ece5f6] bg-white text-sm font-bold font-roboto text-[#1f1b2e] hover:border-[#8b2fd6] hover:text-[#7723bd] transition-all"
              >
                Open {platformLabel}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );

  return (
    <>
      {hideTitle ? (
        <div>{panelBody}</div>
      ) : (
        <div>
          <h1 className="font-bold my-10 text-4xl font-agrandir text-shipGrey sm:text-3xl lg:text-4xl">
            Make a Reservation
          </h1>
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(31,27,46,0.09)] overflow-hidden pt-4">
            {panelBody}
          </div>
        </div>
      )}

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

      <DiningAreaSelectionModal
        isOpen={showDiningAreaModal}
        onClose={() => {
          setShowDiningAreaModal(false);
          setPendingTimeSlotData(null);
        }}
        onSelect={handleDiningAreaSelected}
        timeSlotData={pendingTimeSlotData}
        formData={formData}
        restaurantId={reservationCard?.id}
      />
    </>
  );
}