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
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
      attributes: "reservation",
      reservation_covers: 2,
      persons: 2,
      reservation_date: getCurrentDate(),
      date: getCurrentDate(),
      reservation_time: getCurrentTime(),
      location: "",
      term: "",
    });
  

  const [error, setError] = useState(null);

  // Load data from localStorage on component mount
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-lightGrey rounded-sm md:rounded-[3rem] md:py-2 md:flex gap-1 justify-between md:gap-3 md:px-5">
                  <div className=" flex flex-col gap-1 md:flex-row ">
                    
                  <div
                      className={`flex items-center text-base font-roboto font-normal w-full text-black border-r-2 ${
                        error ? "border-red-500" : "border-gray-200"
                      } focus:border-gray-200 focus:outline-none`}
                    >
                      <MdLocationOn size={28} color="#9235E2"
                      className="flex-shrink-0 mx-2"
                      ></MdLocationOn>
                      <GeoApiAuto
                        getLocationData={getLocationData}
                        location={formData.location}
                      />
                    </div>
                    <div
                      className={`flex items-center text-lg font-roboto font-normal w-full text-black border-r-2 ${
                        error ? "border-red-500" : "border-gray-200"
                      } focus:border-gray-200 focus:outline-none`}
                    >
                      <MdOutlineRestaurantMenu size={28} color="#9235E2"
                      className="flex-shrink-0 mx-2"/>
                      <TermApiAuto getTermData={handleTermChange} />
                    </div>

                    <div className="flex items-center border-r-2 w-full">
                    <BsCalendarDateFill size={24} color="#9235E2"
                      className="flex-shrink-0 mx-2" />

                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="text-lg font-roboto font-normal w-full text-slate-400 focus:outline-none bg-transparent"
                      />
                      <style jsx>{`
                        input[type="date"]::-webkit-calendar-picker-indicator {
                          opacity: 0;
                        }
                      `}</style>
                    </div>

                    <div className="flex items-center border-r-2 w-full">
                    <IoTime size={24} color="#9235E2"
                      className="flex-shrink-0 mx-2" />
                      <input
                        type="time"
                        value={formData.reservation_time}
                        onChange={(e) =>
                          handleInputChange("reservation_time", e.target.value)
                        }
                        className="text-lg font-roboto font-normal w-full text-slate-400 focus:outline-none bg-transparent"
                      />
                       <style jsx>{`
                        input[type="time"]::-webkit-calendar-picker-indicator {
                          opacity: 0;
                        }
                      `}</style>
                    </div>
                    <div className="flex items-center border-r-2 w-full">
                      <select
                        value={formData.persons}
                        onChange={(e) =>
                          handleInputChange("persons", e.target.value)
                        }
                        className="text-lg font-roboto font-normal w-full text-slate-400 focus:outline-none bg-transparent"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} Person{i > 0 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

             
                </div>

        <div className=" flex items-center justify-center ">
          <Button
            className="text-lg md:text-xl relative rounded-full w-full md:min-h-[65px] md:min-w-[250px] bg-plum"
            variant="default"
            size="lg"
            onClick={handleSearch}
          >
            <CiSearch className="absolute left-14 text-2xl hidden md:block" />
            <span>Search</span>
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
