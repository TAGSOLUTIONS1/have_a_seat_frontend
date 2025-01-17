import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../home/HomeAutoComplete"; 
import TermApiAuto from "../home/HometermAutoComplete";
import LocationTracker from "@/components/LocationTracker";
import { useToast } from '@/components/ui/use-toast'

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchLocationV2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();  // Initialize toast
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: "19:00",
    location: '',
    term: ''
  });

  const [error, setError] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('searchFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const getLocationData = (value) => {
    setFormData((prevData) => ({ ...prevData, location: value }));
  };

  const handleSearch = () => {
    if (!formData.location && !formData.term) {
      toast({
        title: "Input Required",
        description: "Please enter either a location or a cuisine/restaurant.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem('searchFormData', JSON.stringify(formData));
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  const handleTermChange = (value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: value };
      localStorage.setItem('searchFormData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem('searchFormData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/2 bg-white rounded-lg p-2 border-2">
          <GeoApiAuto 
            getLocationData={getLocationData} 
            location={formData.location}
          />
        </div>

        <div className="relative w-full md:w-1/2 bg-white rounded-lg p-2 border-2">
          <TermApiAuto 
            getTermData={handleTermChange} 
            term={formData.term} 
          />
        </div>

        <div className="relative w-full md:w-1/3 flex items-center justify-center">
          <Button
            className="text-sm md:text-xl py-4 px-10 rounded-lg"
            variant="default"
            size="lg"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

      </div>

      <div className="mt-2">
        <LocationTracker onLocationUpdate={handleLocationUpdate} />
      </div>
    </div>
  );
};

export default SearchLocationV2;