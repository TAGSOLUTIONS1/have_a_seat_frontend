import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchLocation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    location: 'china',
    attributes: 'reservation',
    latitude: 40.772385 ,
    longitude: -73.956516,
    reservation_covers: 2,
    reservation_date: '2023-12-28',
    reservation_time: '02:00',
  });

  const handleSearch = () => {
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
    console.log(formData)
  };

  return (
    <>
      <div className="mt-2 relative w-full bg-white rounded-full p-2">
        <input
          type="text"
          placeholder="Search Location..."
          className="w-full p-5 text-base md:text-lg text-black rounded-full border-2 border-gray-200 focus:border-gray-200 focus:outline-none"
        />
        <Button
          className="absolute text-xl py-7 px-12 right-0 top-4  mr-4 rounded-full"
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
