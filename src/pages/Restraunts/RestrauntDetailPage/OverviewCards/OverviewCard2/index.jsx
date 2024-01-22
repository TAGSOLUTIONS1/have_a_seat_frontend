import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import DatePicker from "./Date";
import PersonCard from "./Person";
import Time from "./Time";

const OverviewCard2 = ({ overviewCardsData }) => {
  const [reservationCard, setReservationCard] = useState();
  const [formData, setFormData] = useState();
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
    if (reservationCard?.alias) {
      fetchYelpTimeSlots();
    } else {
      fetchOpenTableTimeSlots();
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
    const yelpTimeParams = {
      restaurant_id: reservationCard?.id,
      restaurat_alias: reservationCard?.alias,
      longitude: reservationCard.coordinates.longitude,
      latitude: reservationCard.coordinates.latitude,
      date: formData?.reservation_date,
      time: formData?.reservation_time,
      search_option: "INITIAL_SEARCH",
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
        setIsDataLoaded(true);
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchOpenTableTimeSlots = async () => {
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
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
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
      <hr className="mt-4 mb-4" />
      <h1 className="mt-4 text-lg mb-4 font-bold">Time Slots</h1>
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
      ) : (
        Array.isArray(openTableTimeSlots) &&
        openTableTimeSlots[0]?.availabilityDays[0]?.slots.map((data, index) => (
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
        ))
      )}
    </div>
  );
};

export default OverviewCard2;
