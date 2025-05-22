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
import { MdLocationOn } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoTime } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [startDate, setStartDate] = useState(new Date());

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
              <div className="max-w-5xl mx-auto flex flex-col gap-4">
                <h1 className="font-agrandir uppercase text-3xl sm:text-5xl lg:text-[4rem] leading-none font-bold text-white text-center max-w-[990px] mx-auto">
                Why stress over endless sites when you can “Have a Seat” in seconds?
                </h1>
                <p className="text-center max-w-2xl mx-auto text-base md:text-2xl font-roboto">
                Search, compare, and reserve at the best restaurants across multiple platforms in the US.
                </p>
              </div>

              <div className="w-full max-w-[990px] mx-auto bg-white rounded-lg md:rounded-[3rem] p-4 md:py-4 md:px-6 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
                
                {/* <div className="bg-lightGrey rounded-sm md:rounded-[3rem] md:py-2 md:flex gap-1 justify-between md:gap-3 md:px-5"> */}
                  {/* <div className=" flex flex-col justify-between text-center gap-1 md:flex-row "> */}
                    
                  <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2">
              <MdLocationOn size={28} color="#9235E2" className="mr-2" />
              <div
                  className={`text-base font-agrandir font-bold w-full text-black ${
                    error ? "border-red-500" : "border-gray-200"
                  } focus:border-gray-200 focus:outline-none`}
                >
                  <GeoApiAuto
                    getLocationData={getLocationData}
                    location={formData.location}
                  />
                </div>
            </div>
                  <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 text-black pr-2">
                  <MdOutlineRestaurantMenu size={24} color="#9235E2" className="mr-2" />
                  <TermApiAuto getTermData={handleTermChange} />
                </div>

                <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2">
                  <BsCalendarDateFill size={24} color="#9235E2" className="mr-2" />
                  <DatePicker
                    selected={new Date(formData.date)}
                    onChange={(date) =>
                      handleInputChange("date", date.toISOString().split("T")[0])
                    }
                    dateFormat="yyyy-MM-dd"
                    className="text-sm w-full text-slate-400 focus:outline-none bg-transparent"
                    onKeyDown={(e) => e.preventDefault()}
                    // calendarStartDay={0}
                    placeholderText="Select a date"
                  />
                </div>



                <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pr-2">
                    <IoTime size={24} color="#9235E2" className="mr-2" />
                    <DatePicker
                      selected={new Date(`${formData.date}T${formData.reservation_time}`)}
                      onChange={(date) =>
                        handleInputChange(
                          "reservation_time",
                          date.toTimeString().slice(0, 5)
                        )
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      className="text-sm w-full text-slate-400 focus:outline-none bg-transparent"
                      onKeyDown={(e) => e.preventDefault()}
                      placeholderText="Select time"
                    />
                  </div>



                   <div className="flex items-center justify-center sm:ml-auto">
                  <button
                    className="bg-plum hover:bg-purple-800 transition p-3 md:p-4 rounded-full text-white"
                    onClick={handleSearch}
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
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
                      <span className="bg-[#e8d3f5] relative rounded-full px-4 py-1 text-plum">New York</span>
                    )}
                  </div>
                </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
