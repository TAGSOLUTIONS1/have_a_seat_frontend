import React, { useState } from "react";
import {
  hotels,
  initialBookingState,
  resturantsList,
} from "@/components/constants/constants";
import tick from "/assets/tick.png";
import cal from "/assets/calender.png";
import { useNavigate } from "react-router-dom";

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
    <div className="bg-shipGrey relative hidden md:block" id="about">
      <div className="pb-[15rem] pt-[5rem] md:py-[10rem] px-5 md:px-[75px]">
        <div className="w-[90%] m-auto md:w-full flex flex-col-reverse md:flex-row text-white gap-[100px]">
          {/* Images listing with stack scrolling */}
          <div className="relative flex flex-col gap-[60px]">
          {hotels.map((hotel, index) => (
      <div        key={hotel}
    className="h-[330px] w-[420px] rounded-[1.25rem] overflow-hidden"
    style={{
      position: 'sticky',
      top: `0`,
      zIndex: index+1*10, 
    }}
  >
    <img
      src={hotel}
      alt={`Hotel ${index}`}
      className="h-full w-full object-cover rounded-[1.25rem]"
    />
  </div>
))}

          </div>

          {/* Content */}
          <div className=" max-w-[570px] relative flex flex-col gap-9">
            
          <div className="flex flex-col gap-8 sticky top-20">
            <h1 className="text-[1.75rem] md:text-[4rem] font-agrandir font-bold">
              Discover Dining Delights Across Top Platforms
            </h1>
              <p className="text-base md:text-xl font-normal font-roboto">
                Explore and book from an extensive selection of restaurants
                sourced from top dining platforms, all through a single,
                easy-to-use interface
              </p>
            
            <ul className="flex flex-col gap-5">
              {resturantsList.map((li) => (
                <li className="text-base md:text-xl font-normal font-roboto flex gap-3 items-center" key={li}>
                  <img
                    src={tick}
                    alt="tick"
                    className="h-4 w-4 md:h-5 md:w-5"
                  />
                  <span className="text-base">{li}</span>
                </li>
              ))}
            </ul>
         
              <button
                onClick={handleSearch}
                className="bg-white text-plum items-center max-w-fit flex gap-2 text-base md:text-lg font-bold py-3 px-5 md:px-9 rounded-full hover:bg-[#d5ccdb]"
              >
                <img
                  src={cal}
                  alt="calender icon"
                  className="md:h-5 md:w-5 h-4 w-4"
                />
                Reserve Today
              </button>
          </div>
            
          </div>
        </div>
      </div>
      <img
        src="/assets/fries.png"
        alt=""
        className="hidden md:block absolute top-4 right-0"
      />
      <img
        src="/assets/penneg.png"
        alt=""
        className="hidden md:block absolute bottom-20 h-[300px] right-0"
      />
    </div>
  );
}

export default Restaurants;
