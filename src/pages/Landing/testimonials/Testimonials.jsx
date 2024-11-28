import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { testimonials } from "../../../components/constants/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestiMonialCard from "./TestiMonialCard";
import plate from "/assets/plate.png";

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
    <div className="md:p-[120px] relative bg-lightGrey" id="about">
      {/* <img
        src={plate}
        alt=""
        className="absolute top-[-35%] left-1/2 transform -translate-x-1/2 "
      /> */}
      {/* content */}
      <div className="w-full md:max-w-[640px] m-auto flex font-inter flex-col gap-6">
        <h1 className="text-[34px] w-[85%] md:w-full m-auto md:text-[44px] font-bold text-plum text-center">
          Stories from Our Guests
        </h1>
        <p className="text-lg w-[85%] md:w-full m-auto md:text-[19px] text-shipGrey text-center max-w-[570px]">
          Our consistent positive feedback highlights the quality of our
          service. Guests appreciate the seamless access to a wide array of
          dining options.
        </p>
        <div className="w-[80%] md:w-full m-auto ">
          <div className="w-[100px]  m-auto  border-2 border-plum"></div>
        </div>
      </div>
      <div>
        <div className="slider-container max-w-[880px] m-auto py-[60px]">
          <Slider {...settings}>
            {testimonials.map((test) => (
              <TestiMonialCard test={test} key={test} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
