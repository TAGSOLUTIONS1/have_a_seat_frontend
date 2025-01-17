import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { IoIosSend } from "react-icons/io";

import useLocation from "@/services/useLocation";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentDate } from "@/lib/utils";
import TermApiAuto from "@/components/home/HometermAutoComplete";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import LocationTracker from "@/components/LocationTracker";

export default function Hero() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { toast } = useToast();

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

  const getLocationData = (value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location: value };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleSearch = () => {
    let route;
    if (!formData.location) {
      localStorage.setItem(
        "searchFormData",
        JSON.stringify(initialBookingState)
      );
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(initialBookingState)
      )}`;
    } else {
      localStorage.setItem("searchFormData", JSON.stringify(formData));
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(formData)
      )}`;
    }
    navigate(route);
  };

  const handleTermChange = (e) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: e };
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

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <div className="py-8 px-10">
      <div
        className="relative rounded-[30px] overflow-hidden w-full h-[550px] md:h-[700px]"
        id="home"
      >
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/background-img.png"
          alt="Background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/flare.png"
          alt="Overlay"
        />

        <div className="relative z-10 h-full">
          <div className="hidden md:block px-20 py-7"></div>

          <div className="md:px-20">
            <div className="flex w-[90%] m-auto md:w-full flex-col gap-4 md:gap-8 py-4 md:py-20 text-white">
              <div className="max-w-4xl mx-auto flex flex-col gap-4">
                <h1 className="text-3xl md:text-[4.5rem] leading-none font-raleWay font-bold text-white text-center max-w-[990px] mx-auto">
                  All Your Favorite Tables, One Simple Booking
                </h1>
                <p className="text-center max-w-2xl mx-auto text-base md:text-2xl">
                  Search, compare, and reserve at the best restaurants across
                  multiple platforms with ease
                </p>
              </div>
              <div className="max-w-[990px] mx-auto flex flex-col gap-2">
                <div className="bg-lightGrey rounded-sm md:rounded-[3rem] md:py-2 md:flex gap-1 justify-between md:gap-3 md:px-5">
                  <div className=" flex flex-col gap-1 md:flex-row ">
                    
                    <div
                      className={`text-base md:text-lg w-full px-2 text-black border-r-2 ${
                        error ? "border-red-500" : "border-gray-200"
                      } focus:border-gray-200 focus:outline-none`}
                    >
                      <GeoApiAuto
                        getLocationData={getLocationData}
                        location={formData.location}
                      />
                    </div>
                    <div
                      className={` text-base md:text-lg w-full px-2 text-black border-r-2 ${
                        error ? "border-red-500" : "border-gray-200"
                      } focus:border-gray-200 focus:outline-none`}
                    >
                      <TermApiAuto getTermData={handleTermChange} />
                    </div>
                    <div className=" border-r-2 w-full px-2">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="text-base md:text-lg :w-full text-slate-400 px-4 py-2 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className=" border-r-2 w-full px-2">
                      <input
                        type="time"
                        value={formData.reservation_time}
                        onChange={(e) =>
                          handleInputChange("reservation_time", e.target.value)
                        }
                        className="text-base md:text-lg w-full text-slate-400 px-4 py-2 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className=" border-r-2 w-full px-2">
                      <select
                        value={formData.persons}
                        onChange={(e) =>
                          handleInputChange("persons", e.target.value)
                        }
                        className="text-base md:text-lg w-full text-slate-400 px-4 py-2 focus:outline-none bg-transparent"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} Person{i > 0 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

               <div className="flex items-center justify-center">
               <button className="bg-plum   mr-1 md:mt-0 p-2 md:p-4 w-1/2 md:w-full my-2 md:my-0 rounded-full">
                    <Search
                      className="w-3 h-3 md:h-5 md:w-5"
                      onClick={handleSearch}
                    />
                  </button>
               </div>
                </div>

                <div className="flex text-[10px] md:text-base items-center">
                  <div className="max-w-sm m-auto font-pt my-3 flex">
                    {location ? (
                      <LocationTracker
                        handleLocationUpdate={handleLocationUpdate}
                      />
                    ) : (
                      <span>New York</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
