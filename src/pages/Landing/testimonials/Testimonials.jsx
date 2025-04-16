import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { testimonials } from "../../../components/constants/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestiMonialCard from "./TestiMonialCard";
import plate from "/assets/plate.png";
import Testimonial from "./Testimonial";

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[10px] md:left-[-1.75rem] top-1/2 transform -translate-y-1/2 bg-plum rounded-full w-5 h-5 md:h-16 md:w-16 flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronLeft className="text-white text-2xl" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 md:right-[-1.75rem] top-1/2 transform -translate-y-1/2 bg-plum rounded-full w-5 h-5 md:h-16 md:w-16 flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronRight className="text-white text-2xl" />
  </div>
);

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};
export default function Testimonials() {
  return (
    <div className="md:p-[120px] relative" id="testimonials">
     
      <div className="w-full m-auto items-center flex flex-col gap-6 px-2 sm:px-0 py-10">
        <p className="text-[38px] w-[85%] md:w-full m-auto md:text-7xl font-bold font-agrandir text-center">
          <span className="text-shipGrey">Stories From <span className="text-plum">Our Guests</span> </span> 
        </p>
        <p className="w-full md:w-[65%] text-xl font-normal font-roboto text-shipGrey text-center">
        So why do they choose us and what sets us apart? Let them tell you
        </p>
        <div className="w-[80%] md:w-full m-auto ">
          <div className="w-[200px]  m-auto  border-2 border-plum"></div>
        </div>
      </div>
      <div>
        <Testimonial />
      </div>
    </div>
  );
}
