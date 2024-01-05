import { useState, useEffect } from "react";
import DatePicker from "./Date";
import PersonCard from "./Person";
import Time from "./Time";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "@/baseUrl";

interface OverviewCardProps {
  overviewCardsData: any;
}

const OverviewCard2: React.FC<OverviewCardProps> = ({ overviewCardsData }) => {
  const [reservationCard, setReservationCard] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [nextData, setNextData] = useState<any>([]);
  const [timeSlots, setTimeSlots] = useState<any>();
  const [openTableTimeSlots, setOpenTableTimeSlots] = useState<any>();

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
    console.log(formData, "bytimeslots");
  };

  const handleYelpReservation = (clickedData: any) => {
    console.log("Clicked data:", clickedData);
    const updatedNextData = [reservationCard, clickedData];
    console.log(formData);
    setNextData(updatedNextData);
    const route = `/reservation?data=${encodeURIComponent(
      JSON.stringify(updatedNextData)
    )}`;
    navigate(route);
    setFormData("");
  };

  const handleOpenTableReservation = (clickedData: any) => {
    console.log("Clicked data:", clickedData);
    console.log(reservationCard?.restaurant?.resturantId);
    const restraunt_id = reservationCard?.restaurant?.resturantId;
    const updatedNextData = [formData, clickedData, restraunt_id];
    console.log(updatedNextData, "ddddaaaattttaaaa");
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
        console.log(
          response?.data?.data?.availability_data[0]?.availability_list
        );
        setTimeSlots(
          response?.data?.data?.availability_data[0]?.availability_list
        );
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

        console.log(response?.data?.data?.data?.availability);
       setOpenTableTimeSlots(response?.data?.data?.data?.availability)

      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function convertOffsetToTime(offset: any, baseTime: string) {
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
      {overviewCardsData?.alias
        ? Array.isArray(timeSlots) &&
          timeSlots.map((data: any, index: number) => (
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
        : Array.isArray(openTableTimeSlots) &&
          openTableTimeSlots[0]?.availabilityDays[0]?.slots.map((data: any, index: number) => (
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
  );
};

export default OverviewCard2;
