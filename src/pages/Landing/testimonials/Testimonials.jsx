import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { testimonials } from "../constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestiMonialCard from "./TestiMonialCard";

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronLeft className="text-white text-2xl" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg z-10"
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
    <div className="p-[120px] bg-lightGrey">
      {/* content */}
      <div className="max-w-[640px] m-auto flex flex-col gap-6">
        <h1 className="text-[44px] font-bold text-plum text-center">
          Stories from Our Guests
        </h1>
        <p className="text-[19px] text-shipGrey text-center max-w-[570px]">
          Our consistent positive feedback highlights the quality of our
          service. Guests appreciate the seamless access to a wide array of
          dining options.
        </p>
      </div>
      <div>
        <div className="slider-container max-w-[880px] m-auto py-[60px]">
          <Slider {...settings}>
            {testimonials.map((test) => (
              <TestiMonialCard test={test} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

// {/* Image Section */}
// <div className="flex-shrink-0 border border-red-50">
// <img
//   src={testImg}
//   alt="User"
//   className="rounded-full h-[290px] w-[290px] object-cover"
// />
// </div>
