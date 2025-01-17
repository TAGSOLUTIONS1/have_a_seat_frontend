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

      {/* reviews */}
      <Reviews restrauntDetail={restrauntDetail} />
    </div>
  );
}
