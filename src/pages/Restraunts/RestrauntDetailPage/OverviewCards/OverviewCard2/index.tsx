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

  const navigate = useNavigate();

  useEffect(() => {
    setReservationCard(overviewCardsData);
  }, [overviewCardsData]);

  useEffect(() => {
    console.log(nextData); 
  }, [nextData]);

  const handleReservation = () => {

    if(reservationCard?.restaurant_flag === 'opentable'){

      const updatedNextData = [reservationCard?.restaurant, formData]; 
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(JSON.stringify(updatedNextData))}`;
      navigate(route);
      // console.log(updatedNextData);
      setFormData('');
    }else{
      const updatedNextData = [reservationCard, formData]; 
      setNextData(updatedNextData);
      const route = `/reservation?data=${encodeURIComponent(JSON.stringify(updatedNextData))}`;
      navigate(route);
      // console.log(updatedNextData);
      setFormData('');
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
        onClick={handleReservation}
        className="w-full bg-purple-600 mt-12 text-white rounded-lg py-2 mb-4 focus:outline-none"
      >
        Make a reservation
      </button>
    </div>
  );
};

export default OverviewCard2;
