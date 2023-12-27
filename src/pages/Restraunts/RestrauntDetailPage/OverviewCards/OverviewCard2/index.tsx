import { useState, useEffect } from "react";
import Date from "./Date";
import PersonCard from "./Person";
import Time from "./Time";
import { useNavigate } from "react-router-dom";

interface OverviewCardProps {
  overviewCardsData: any;
}

const OverviewCard2: React.FC<OverviewCardProps> = ({ overviewCardsData }) => {
  const [reservationCard, setReservationCard] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [nextData, setNextData] = useState<any>([]);
  const [timeSlots, setTimeSlots] = useState<any>();

  const navigate = useNavigate();

  useEffect(() => {
    setReservationCard(overviewCardsData);
  }, [overviewCardsData]);

  useEffect(() => {
    console.log(nextData);
  }, [nextData]);

  const time = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"];

  const handleTimeSlots = () => {
    setTimeSlots(time);
    console.log(formData , "bytimeslots")
  };

  const handleReservation = () => {
    if (reservationCard?.restaurant_flag !== "yelp") {
      const updatedNextData = [reservationCard?.restaurant, formData];
      console.log(formData)
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(
        JSON.stringify(updatedNextData)
      )}`;
      navigate(route);
      // console.log(updatedNextData);
      setFormData("");
    } else {
      const updatedNextData = [reservationCard, formData];
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(
        JSON.stringify(updatedNextData)
      )}`;
      navigate(route);
      // console.log(updatedNextData);
      setFormData("");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h1 className="m-2 text-center text-lg">
        <strong>Make a reservation</strong>{" "}
      </h1>
      <hr className="mt-4 mb-4" />
      <Date setFormData={setFormData} />
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
        <button key={index} className="bg-purple-600 text-white p-3 m-1 rounded-lg" onClick={handleReservation}>
          {data}
        </button>
      ))}
      {/* <TimeSlots /> */}
    </div>
  );
};

export default OverviewCard2;
