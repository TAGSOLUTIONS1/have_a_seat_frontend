import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroVideo from "/assets/videos/HeroVideo.mp4";
import loc from "/assets/location.png";
import { Phone, Search } from "lucide-react";
import { Send } from "lucide-react";
import useLocation from "@/services/useLocation";
import Navbar from "../nav/Navbar";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentDate } from "@/lib/utils";
import TermApiAuto from "@/components/home/HometermAutoComplete";
import { initialBookingState } from "@/components/constants/constants";

export default function Hero() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: "19:00",
    location: "",
    term: "",
  });

  const getLocationData = (value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location: value };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData)); // Store updated location in local storage
      return updatedData;
    });
  };

  const handleSearch = () => {
    // if (!formData.location && !formData.term) {
    //   toast({
    //     title: "Input Required",
    //     description: "Please Enter a Location",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }
    // if current locaion not choose ny
    // if (!formData.location) {
    //   getCurrentLocation();
    //   return;
    // }
    let route;
    if (!formData.location) {
      localStorage.setItem(
        "searchFormData",
        JSON.stringify(initialBookingState)
      ); // Store form data before navigating
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(initialBookingState)
      )}`;
    } else {
      localStorage.setItem("searchFormData", JSON.stringify(formData)); // Store form data before navigating
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(formData)
      )}`;
    }
    console.log("form data", formData);

    navigate(route);
  };

  const handleTermChange = (e) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: e };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData)); // Store updated term in local storage
      return updatedData;
    });
  };

  // const handleLocationUpdate = (location) => {
  //   setFormData((prevData) => {
  //     const updatedData = { ...prevData, location };
  //     localStorage.setItem("searchFormData", JSON.stringify(updatedData)); // Store updated location in local storage
  //     return updatedData;
  //   });
  // };
  return (
    <div className="relative w-full h-[900px] shadow-lg" id="home">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={HeroVideo}
        autoPlay
        loop
        muted
      />

      {/* Content Over Video */}
      <div className="relative z-10 h-full bg-black/50">
        <div className="hidden md:block px-20 py-7 border-b-2 border-white">
          <div className="flex justify-between text-white ">
            <div className="flex gap-3 items-center">
              <img src={loc} alt="" className="h-7 w-7" />
              {location ? (
                <div>
                  <span>{location.city.trim().split(" ")[0]},</span>
                  <span> {location.state}</span>
                </div>
              ) : (
                <span>New,York</span>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <Phone />
              <p className="font-bold">+1 (860) 960-0316</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <Navbar />

        <div className="md:px-20">
          <div className="flex w-[90%] m-auto md:w-full flex-col gap-8 text-white">
            <div>
              <h1 className="text-[45px] md:text-[82px] font-cabinet text-white text-center max-w-[990px] mx-auto">
                All Your Favorite Tables, One Simple Booking
              </h1>
            </div>
            <div className="max-w-[990px] mx-auto flex flex-col gap-2">
              {/* Searchbar */}
              <div className="bg-lightGrey rounded-[3rem] md:py-2 flex gap-1 justify-between md:gap-3 md:px-5">
                <div className="md:flex gap-1">
                  <div
                    className={`  text-base md:text-lg text-black rounded-full border-2 ${
                      error ? "border-red-500" : "border-gray-200"
                    } focus:border-gray-200 focus:outline-none`}
                  >
                    <GeoApiAuto
                      getLocationData={getLocationData}
                      location={formData.location}
                    />
                  </div>
                  <div
                    className={`hidden md:block  text-base md:text-lg text-black rounded-full border-2 ${
                      error ? "border-red-500" : "border-gray-200"
                    } focus:border-gray-200 focus:outline-none`}
                  >
                    <TermApiAuto getTermData={handleTermChange} />
                  </div>
                </div>
                <button className="bg-plum p-4 rounded-full">
                  <Search onClick={handleSearch} />
                </button>
              </div>

              <div className="flex  text-[10px]  md:text-base items-center">
                <p className="max-w-sm m-auto font-pt">
                  It looks like you're in
                  {location ? (
                    <>
                      <span> {location.city.trim().split(" ")[0]},</span>
                      <span> {location.state}</span>
                    </>
                  ) : (
                    <span>New,York</span>
                  )}
                </p>
                {/* <div
                  className="flex gap-1 cursor-pointer"
                  onClick={getCurrentLocation}
                >
                  <Send />
                  <p>Get current location</p>
                </div> */}
              </div>
            </div>

            <div>
              <p className=" font-pt text-lg md:text-xl max-w-[575px] mx-auto text-center">
                Search, compare, and reserve at the best restaurants across
                multiple platforms with ease
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
