import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BestDealsCard from "./BestDealsCard";
import { bestDeals } from "@/components/constants/constants";
import Slider from "react-slick";

function BestDeals() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    centerMode: false, // Ensures slides fit within the container
    responsive: [
      {
        breakpoint: 768, // For devices with width <= 768px
        settings: {
          slidesToShow: 1, // Show only one slide
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="px-6 py-10">
      <div className="text-[2rem] font-inter md:text-[4.25rem] text-plum text-center font-bold">
        <h1>Today’s best deals</h1>
      </div>
      <div className="mx-auto max-w-[1120px] my-10">
        <Slider {...settings}>
          {bestDeals.map((deal, index) => (
            <div key={index} className="px-2">
              {/* Adds spacing between slides */}
              <BestDealsCard img={deal.img} text={deal.text} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BestDeals;
