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
import Menu from "../RestrauntDetailPage/Menu";
import MenuDetails from "./MenuDetails";

const timeSlots = ["4:30", "5:15", "3:30", "6:45", "10:15", "11:30"];

export default function RestaurantDetailsV2({ restrauntDetail }) {
  // console.log("restaurns " , restrauntDetail)
  return (
    <div className="max-w-[1600px] mx-auto mt-2">
      <div className="p-10 bg-plum md:p-[5rem] grid grid-cols-1 md:grid-cols-2 md:gap-20">
        {/* Restaurant details */}
        <Restaurant restrauntDetail={restrauntDetail} />
        {/* Slider */}
        <ImageSlider restrauntDetail={restrauntDetail} />
      </div>
      <div className="px-10 md:px-[5rem]">
      <MakeReservation restrauntDetail={restrauntDetail} />

      {/* reviews */}
      <Reviews restrauntDetail={restrauntDetail} />
      {restrauntDetail.menus || restrauntDetail?.restaurant_type==="resy" ? 
        (<>
               <MenuDetails restrauntDetail={restrauntDetail}></MenuDetails>
        </>)
        :(
        <>
        <div className="">
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-4">
          <strong>Menu</strong>
        </h2>
        <p className="text-gray-500">
              At present, we do not have menu information for this restaurant.
              Please see the{" "}
              <a
                href={restrauntDetail?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-plum underline hover:text-purple-800"
              >
                website
              </a>{" "}
              or wait to visit the restaurant to learn more.
            </p>

          </div>
        </>)
      }
      </div>
      <div>
        {/* <Menu restrauntDetail={restrauntDetail} ></Menu> */}
       
      </div>
    </div>
  );
}
