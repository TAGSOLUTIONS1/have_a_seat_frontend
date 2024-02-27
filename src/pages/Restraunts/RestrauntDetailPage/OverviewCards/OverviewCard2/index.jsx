import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import DatePicker from "./Date";
import PersonCard from "./Person";
import Time from "./Time";
import { LucideLoader } from "lucide-react";

const OverviewCard2 = ({ overviewCardsData }) => {
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
    setReservationCard(overviewCardsData);
  }, [overviewCardsData]);

  useEffect(() => {
    console.log(nextData);
  }, [nextData]);

  const handleTimeSlots = () => {
    const { reservation_covers, reservation_date, reservation_time } = formData;

    if (reservation_date === null || reservation_date === undefined) {
      setError("Date is Required");
    } else if (reservation_time === null || reservation_time === undefined) {
      setError("Time is Required");
    } else if (
      reservation_covers === null ||
      reservation_covers === undefined
    ) {
      setError("Persons are Required");
    } else {
      setError("");
      if (reservationCard?.alias) {
        fetchYelpTimeSlots();
      } else {
        fetchOpenTableTimeSlots();
      }
    }
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
    console.log(reservationCard?.restaurant?.restaurantId);
    const restraunt_id = reservationCard?.restaurant?.restaurantId;
    const updatedNextData = [formData, clickedData, restraunt_id];
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

  const fetchOpenTableTimeSlots = async () => {
    setLoading(true);
    const openTableTimeParams = {
      restaurant_id: reservationCard?.restaurant?.restaurantId,
      date: formData?.reservation_date,
      time: formData?.reservation_time,
      persons: formData?.reservation_covers,
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
    const formattedHours = String(time.getHours()).padStart(2, "0");
    const formattedMinutes = String(time.getMinutes()).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  }

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h1 className="m-2 text-center text-lg">
        <strong>Make a reservation</strong>{" "}
      </h1>
      <hr className="mt-4 mb-4" />
      <DatePicker setFormData={setFormData} />
      <hr className="mt-4 mb-4" />
      <Time setFormData={setFormData} />
      <hr className="mt-4 mb-4" />
      <PersonCard setFormData={setFormData} />

      <button
        onClick={handleTimeSlots}
        className="w-full bg-purple-600 mt-4 text-white rounded-lg py-2 focus:outline-none"
      >
        Find a time
      </button>
      {error && error !== null ? (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      ) : null}
      <hr className="mt-4 mb-4" />
      <h1 className="mt-4 text-lg mb-4 font-bold">Time Slots</h1>
      {loading ? (
        <LucideLoader className="w-6 h-6 justify-center animate-spin align-middle mx-auto" />
      ) : (
        <div>
          {overviewCardsData?.alias ? (
            isDataLoaded ? (
              Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                timeSlots.map((data, index) => (
                  <button
                    key={index}
                    className="bg-purple-600 text-white p-3 m-1 rounded-lg"
                    onClick={() => handleYelpReservation(data)}
                  >
                    {new Date(data.timestamp * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))
              ) : (
                <p className="text-lg text-red-600">No slots available.</p>
              )
            ) : (
              <p></p>
            )
          ) : isDataLoaded ? (
            Array.isArray(openTableTimeSlots) &&
            openTableTimeSlots[0]?.availabilityDays[0]?.slots.length > 0 ? (
              openTableTimeSlots[0]?.availabilityDays[0]?.slots.map(
                (data, index) => (
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
                )
              )
            ) : (
              <p className="text-lg text-red-600">No slots available.</p>
            )
          ) : (
            <p></p>
          )}
        </div>
      )}
    </div>
  );
};

export default OverviewCard2;
