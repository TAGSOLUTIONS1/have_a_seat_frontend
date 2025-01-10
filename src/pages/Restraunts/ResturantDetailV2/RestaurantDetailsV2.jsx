import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import ImageSlider from "./Slider";
import Restaurant from "./Restaurant";
import MakeReservation from "./MakeReservation";
import Reviews from "./Reviews";

const timeSlots = ["4:30", "5:15", "3:30", "6:45", "10:15", "11:30"];

export default function RestaurantDetailsV2({ restrauntDetail }) {
  return (
    <div className="p-10 md:p-[6rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
        {/* Restaurant details */}
        <Restaurant restrauntDetail={restrauntDetail} />
        {/* Slider */}
        <ImageSlider restrauntDetail={restrauntDetail} />
      </div>
      <MakeReservation restrauntDetail={restrauntDetail} />

      {/* time slots */}
      {/* <div className="py-5">
        <h4 className="text-2xl font-bold">Time Slots</h4>
        <div className="flex gap-5 flex-wrap py-10">
          {timeSlots.map((time, index) => (
            <button
              key={index}
              className="bg-plum hover:bg-purple-700 text-white rounded-md py-2 px-6"
            >
              {time}
            </button>
          ))}
        </div>
      </div> */}
      {/* reviews */}
      <Reviews restrauntDetail={restrauntDetail} />
    </div>
  );
}
