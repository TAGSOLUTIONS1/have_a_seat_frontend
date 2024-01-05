import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../HomeAutoComplete";

const SearchLocation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
   attributes: "reservation",
    // latitude: 40.772385,
    // longitude: -73.956516,
    reservation_covers: 2,
    persons: 2,
    reservation_date: "2024-01-05",
    date: "2024-01-05",
    reservation_time: "19:00",
  });

  const getLocationData = (value: string) => {
    setFormData({ ...formData, location: value });
  };

  const handleSearch = () => {
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
    console.log(formData);
    setFormData("");
  };


  return (
    <>
      <div className="mt-2 relative w-full bg-white rounded-full p-2">
        <div className=" w-full p-5 text-base md:text-lg text-black rounded-full border-2 border-gray-200 focus:border-gray-200 focus:outline-none">
          <GeoApiAuto getLocationData={getLocationData} />
        </div>
        <Button
          className="absolute sm:text-sm md:text-xl sm:py-4 sm:px-6 md:py-7 md:px-12 right-0 top-7 md:top-5 lg:top-5  mr-4 rounded-full"
          variant="default"
          size="lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </>
  );
};

export default SearchLocation;
