import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../HomeAutoComplete";
import TermApiAuto from "../HometermAutoComplete";
import LocationTracker from "@/components/LocationTracker";
import { useToast } from "@/components/ui/use-toast"; 

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchLocation = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: "19:00",
    location: '',
    term: '',
  });
  
  const [error, setError] = useState(null);

  const getLocationData = (value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location: value };
      localStorage.setItem('searchFormData', JSON.stringify(updatedData)); // Store updated location in local storage
      return updatedData;
    });
  };

  const handleSearch = () => {
    if (!formData.location && !formData.term) {
      toast({
        title: "Input Required",
        description: "Please Enter  a Location",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    
    if (!formData.location) {
      getCurrentLocation();
      return;
    }
    
    localStorage.setItem('searchFormData', JSON.stringify(formData)); // Store form data before navigating
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  const handleTermChange = (e) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: e };
      localStorage.setItem('searchFormData', JSON.stringify(updatedData)); // Store updated term in local storage
      return updatedData;
    });
  };

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem('searchFormData', JSON.stringify(updatedData)); // Store updated location in local storage
      return updatedData;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-auto bg-white rounded-full p-2">
          <div
            className={`w-full p-4 text-base md:text-lg text-black rounded-full border-2 ${
              error ? "border-red-500" : "border-gray-200"
            } focus:border-gray-200 focus:outline-none`}
          >
            <GeoApiAuto 
              getLocationData={getLocationData} 
              location={formData.location}
            />
          </div>
        </div>

        <div className="relative w-full md:w-auto bg-white rounded-full p-2">
          <div
            className={`w-full p-4 text-base md:text-lg text-black rounded-full border-2 ${
              error ? "border-red-500" : "border-gray-200"
            } focus:border-gray-200 focus:outline-none`}
          >
            <TermApiAuto getTermData={handleTermChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <Button
          className="text-sm md:text-xl py-6 px-6 rounded-full"
          variant="default"
          size="lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      <div className="flex items-center justify-center mt-2">
        <div className="flex-1">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
        </div>
      </div>
    </div>
  );
};

export default SearchLocation;