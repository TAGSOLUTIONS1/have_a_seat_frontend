import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../home/HomeAutoComplete";
import TermApiAuto from "../home/HometermAutoComplete";
import LocationTracker from "@/components/LocationTracker";
import { useToast } from "@/components/ui/use-toast";
import { CiSearch } from "react-icons/ci";
import { getCurrentTime } from "../constants/constants";
import { MdLocationOn } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoTime } from "react-icons/io5";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SearchLocationV2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: getCurrentTime(),
    restaurant_name: "",
    cuisine_type: "",
    location: "",
    term: "",
    rating: "hightolow",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const savedFormData = localStorage.getItem("searchFormData");
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

    localStorage.setItem("searchFormData", JSON.stringify(formData));
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  const handleTermChange = (value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: value };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full max-w-[990px] mx-auto bg-lightGrey rounded-lg md:rounded-[3rem] p-4 md:py-4 md:px-6 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
        {/* Location */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2 flex-1">
          <MdLocationOn size={24} color="#9235E2" className="mr-2" />
          <div
            className={`text-base font-roboto font-normal z-50 w-full text-black ${
              error ? "border-red-500" : "border-gray-200"
            } focus:border-gray-200 focus:outline-none`}
          >
            <GeoApiAuto
              getLocationData={getLocationData}
              location={formData.location}
            />
          </div>
        </div>

        {/* Restaurant/Cuisine */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 text-black pr-2 flex-1">
          <MdOutlineRestaurantMenu size={24} color="#9235E2" className="mr-2" />
          <TermApiAuto getTermData={handleTermChange} />
        </div>

        {/* Date */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2 flex-1">
          <BsCalendarDateFill size={20} color="#9235E2" className="mr-2" />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="text-sm w-full text-slate-400 focus:outline-none bg-transparent"
          />
          <style jsx>{`
            input[type="date"]::-webkit-calendar-picker-indicator {
              opacity: 0;
            }
          `}</style>
        </div>

        {/* Time */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2 flex-1">
          <IoTime size={20} color="#9235E2" className="mr-2" />
          <input
            type="time"
            value={formData.reservation_time}
            onChange={(e) => handleInputChange("reservation_time", e.target.value)}
            className="text-sm w-full text-slate-400 focus:outline-none bg-transparent"
          />
          <style jsx>{`
            input[type="time"]::-webkit-calendar-picker-indicator {
              opacity: 0;
            }
          `}</style>
        </div>

        {/* Persons */}
        <div className="flex items-center border-b md:border-b-0 border-gray-200 pr-2 flex-1">
          <select
            value={formData.persons}
            onChange={(e) => handleInputChange("persons", e.target.value)}
            className="text-sm w-full text-slate-400 focus:outline-none bg-transparent"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "Person" : "People"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-center justify-center mt-2 md:mt-0">
          <button
            className="bg-plum hover:bg-purple-800 transition p-3 md:p-4 rounded-full text-white"
            onClick={handleSearch}
          >
            <CiSearch className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="flex text-[10px] md:text-base items-center justify-center">
        <div className="max-w-sm m-auto font-pt my-3 flex">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
        </div>
      </div>
    </div>
  );
};

export default SearchLocationV2;