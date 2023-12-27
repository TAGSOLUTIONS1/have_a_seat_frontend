import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ReservationForm from "./ReservationForm";
import PreviousData from "./PreviousData";

const Reservation = () => {
  const [formData, setFormData] = useState<any>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  useEffect(() => {
    let finalData: any = null;
    try {
      // console.log("Data received:", data);
      if (data !== null) {
        const decodedData = decodeURIComponent(data);
        // console.log("Decoded data:", decodedData);
        finalData = JSON.parse(decodedData);
        setFormData(finalData);
        console.log("Parsed data:", finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
    }
  }, [data]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-2/4 mt-12">
          <ReservationForm formData={formData} />
        </div>
        <div className="w-1/4 mx-2 mt-28 ml-12">
          <PreviousData formData={formData} />
        </div>
      </div>
    </>
  );
};

export default Reservation;
