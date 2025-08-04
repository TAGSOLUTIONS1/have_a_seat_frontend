import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import { LucideLoader } from "lucide-react";
import DatePicker from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Date";
import Time from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Time";
import PersonCard from "../RestrauntDetailPage/OverviewCards/OverviewCard2/Person";
export default function MakeReservation({ restrauntDetail }) {
  const [reservationCard, setReservationCard] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reservation_covers: null,
    reservation_date: null,
    reservation_time: null,
  });
  const [error, setError] = useState("");
  const [nextData, setNextData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [timeSlots, setTimeSlots] = useState();
  const [openTableTimeSlots, setOpenTableTimeSlots] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setReservationCard(restrauntDetail);
    // console.log(restrauntDetail)
  }, [restrauntDetail]);

  useEffect(() => {
    // console.log(nextData);
  }, [nextData]);
  
  const handleTimeSlots = () => {
    const { reservation_covers, reservation_date, reservation_time } = formData;

    if (!reservation_date) return setError("Date is Required");
    if (!reservation_time) return setError("Time is Required");
    if (!reservation_covers) return setError("Persons are Required");

    setError("");
    reservationCard?.restaurant_type ==="yelp" ? fetchYelpTimeSlots() :
    reservationCard?.restaurant_type ==="open_table" ? fetchOpenTableTimeSlots() :
    fetchResyTimeSlots();
  };

  const handleYelpReservation = (clickedData) => {
    const updatedNextData = [reservationCard, clickedData];
    setNextData(updatedNextData);
    const route = `/reservation?data=${encodeURIComponent(
      JSON.stringify(updatedNextData)
    )}`;
    navigate(route);
    setFormData("");
  };

  const handleOpenTableReservation = (clickedData) => {
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
    const resyTimeParams = {
      venue_id: reservationCard?.results?.venues[0]?.venue?.id?.resy,
      date: formData?.reservation_date,
      persons: formData?.reservation_covers,
    };
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/resy/get_restaurant_details?`,
        {
          params: resyTimeParams,
        }
      );

      if (response.status === 200) {
        setTimeSlots(
          response?.data?.data?.results?.venues[0]?.slots
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


    const [showModal, setShowModal] = useState(false);

      const handleClick = () => {
        setShowModal(true);

        // Open Resy link after a short delay (e.g., 2 seconds)
        setTimeout(() => {
          window.open(
            `https://resy.com/cities/${data?.location?.url_slug}/venues/${data?.url_slug}`,
            "_blank",
            "noopener,noreferrer"
          );
          setShowModal(false); // Optionally close modal
        }, 2000);
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
            <DatePicker setFormData={setFormData} />
          </div>

          <div className="flex-grow w-full md:w-auto border-b-2 md:border-b-0 md:border-r-2 pb-2 md:pb-0">
        <span className="ml-4 font-roboto text-lg md:text-xl text-grayhead font-normal">Time</span>
            <Time setFormData={setFormData} />
          </div>

          <div className="flex-grow w-full md:w-auto border-b-2 md:border-b-0 md:border-r-2 pb-2 md:pb-0">
        <span className="ml-4 font-roboto text-lg md:text-xl text-grayhead font-normal">Guests</span>
            <PersonCard setFormData={setFormData} />
          </div>

          <div className="w-full md:w-auto">
            <button
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
                                className="bg-plum text-white font-semibold font-roboto text-base p-2 px-3 m-1 rounded-lg"
                                onClick={() => handleYelpReservation(data)}
                              >
                                {/* {new Date(data.timestamp * 1000).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} */}
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
                                className="bg-purple-600 text-white p-3 m-1 rounded-lg"
                                onClick={() => handleOpenTableReservation(data)}
                              >
                                {convertOffsetToTime(
                                  data.timeOffsetMinutes,
                                  formData?.reservation_time
                                )}
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
                        <p className="text-2xl font-bold text-shipGrey font-agrandir mb-4">Time Slots resy</p>
                        <div className="flex flex-wrap justify-center">
                          {timeSlots
                            // .filter((data) => !isNaN(data.timeOffsetMinutes))
                            .map((data, index) => (
                              <>
                              <button
                                key={index}
                                className="bg-purple-600 text-white p-3 m-1 rounded-lg"
                                onClick={handleClick}
                                // onClick={() => handleOpenTableReservation(data)}
                              >
                                {/* {convertOffsetToTime(
                                  data.date.start,
                                  formData?.reservation_time
                                )} */}
                                {formatTimeOnly(data.date.start)}
                              </button>

                            {showModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                      <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
                                        <p className="text-lg font-semibold mb-4">
                                          Redirecting to Resy...
                                        </p>
                                        <p className="text-sm text-gray-600">Your reservation is in progress.</p>
                                      </div>
                                    </div>
                                  )}
                              </>
                            ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg text-red-600">No resy slots available.</p>
                    )
                  ) :  <p className="text-lg text-red-600">Couldnot get slots.</p>
                ) : null}

            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
