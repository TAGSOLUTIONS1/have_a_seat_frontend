import React, { useState } from "react";
import {
  hotels,
  initialBookingState,
  resturantsList,
} from "@/components/constants/constants";
import tick from "/assets/tick.png";
import plate from "/assets/plate.png";
import cal from "/assets/calender.png";
import { useNavigate } from "react-router-dom";
initialBookingState;
function Restaurants() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialBookingState);
  const handleSearch = () => {
    localStorage.setItem("searchFormData", JSON.stringify(formData)); // Store form data before navigating
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;

    navigate(route);
  };
  return (
    <div className="bg-shipGrey relative" id="about">
      <div className="pb-[15rem] pt-[5rem] md:py-[10rem] px-5 md:px-[75px]">
        <div className=" w-[90%] m-auto md:w-full flex flex-col-reverse md:flex-row text-white gap-[100px]">
          {/* // images listing */}
          <div className="flex flex-col  gap-[60px] max-h-[1200px] overflow-y-auto no-scrollbar">
            {hotels.map((hotel) => (
              <img
                src={hotel}
                key={hotel}
                className="h-[330px] w-[420px] rounded-[1.25rem]"
              />
            ))}
          </div>
          {/* content */}
          <div className="max-w-[555px] relative flex flex-col gap-9">
            <div className=" text-[2.75rem] md:text-[4.25rem] font-cabinet font-extrabold">
              Discover Dining Delights Across Top Platforms
            </div>
            <div className="font-pt">
              <p className="text-xl">
                Explore and book from an extensive selection of restaurants
                sourced from top dining platforms, all through a single,
                easy-to-use interface
              </p>
            </div>
            <ul className="flex flex-col gap-5 ">
              {resturantsList.map((li) => (
                <li className="text-lg flex gap-3 items-center " key={li}>
                  <img src={tick} alt="tick " className="h-5 w-5" />
                  {li}
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={handleSearch}
                className="bg-frenchPink text-plum items-center max-w-fit flex gap-2 text-lg font-bold rounded-lg py-3 px-9 hover:bg-[#d5ccdb]"
              >
                <img src={cal} alt="calender icon" className="h-5 w-5" />
                Reserve Today
              </button>
            </div>
          </div>
        </div>
      </div>
      <img
        src={plate}
        alt="food plate"
        className="absolute bottom-[-12rem] md:right-[250px]"
      />
    </div>
  );
}

export default Restaurants;
