import { useState, useEffect } from "react";
import DatePicker from "./Date";
import PersonCard from "./Person";
import Time from "./Time";
import axios from "axios";
import { yelpTimeSLots } from "@/mockData";
import { yelpDetailRestraunt } from "@/mockData";
import { useNavigate } from "react-router-dom";

interface OverviewCardProps {
  overviewCardsData: any;
}

const OverviewCard2: React.FC<OverviewCardProps> = ({ overviewCardsData }) => {
  const [reservationCard, setReservationCard] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [nextData, setNextData] = useState<any>([]);
  const [yelpTimeSlots , setYelpTimeSlots] = useState<any>()
  const [timeSlots, setTimeSlots] = useState<any>();

  const navigate = useNavigate();

  useEffect(() => {
    setReservationCard(overviewCardsData);
  }, [overviewCardsData]);

  useEffect(() => {
    console.log(nextData);
  }, [nextData]);

  const handleTimeSlots = () => {
    setTimeSlots(yelpTimeSLots?.availability_data[0]?.availability_list);
    console.log(formData, "bytimeslots");
  };

  const handleReservation =  (clickedData: any) => {
    console.log("Clicked data:", clickedData);
    if (reservationCard?.alias !== "osaka-fusion-sushi-brooklyn-2") {
      const updatedNextData = [reservationCard?.restaurant, clickedData];
      console.log(formData);
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(
        JSON.stringify(updatedNextData)
      )}`;
      navigate(route);
      setFormData("");
    } else {
      const updatedNextData = [reservationCard, clickedData];
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(
        JSON.stringify(updatedNextData)
      )}`;
      navigate(route);
      setFormData("");
    }
  };

  useEffect(() => {
    if (yelpDetailRestraunt.alias === "osaka-fusion-sushi-brooklyn-2" ) {
      const fetchTimeSlots = async () => {
        const yelpTimeParams = {
          restaurant_id: yelpDetailRestraunt?.id,
          restaurat_alias: yelpDetailRestraunt?.alias,
          longitude: yelpDetailRestraunt.coordinates.longitude,
          latitude: yelpDetailRestraunt.coordinates.latitude,
          date: formData?.reservation_date,
          time: formData?.reservation_time,
          search_option: "INITIAL_SEARCH",
          persons: formData?.reservation_covers
        };
  
        try {
          const response = await axios.get("/api/v1/yelp/get_restaurant_timings", {
            params: yelpTimeParams
          });
  
          if (response.status === 200) {
            console.log(response.data);
            setYelpTimeSlots(response.data)
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchTimeSlots();
    }
  }, []);

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h1 className="m-2 text-center text-lg">
        <strong>Make a reservation</strong>{" "}
      </h1>
      <hr className="mt-4 mb-4" />
      <DatePicker setFormData={setFormData} />
      <hr className="mt-4 mb-4" />
      <Time setFormData={setFormData} reservationCard={reservationCard} />
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
      {timeSlots?.map((data: any, index: number) => (
        <button
          key={index}
          className="bg-purple-600 text-white p-3 m-1 rounded-lg"
          onClick={() => handleReservation(data)}
        >
         {new Date(data.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        </button>
      ))}
    </div>
  );
};

export default OverviewCard2;
