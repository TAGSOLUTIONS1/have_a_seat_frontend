import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function BestDeals() {
  const settings = {
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
    <div className="mx-8 md:px-6" id="best deals">
      <div className="text-[2rem] font-raleWay md:text-[4.25rem] text-plum text-center py-10 md:py-20 font-bold">
        <h1>
          <span className="text-black">Today’s</span> best deals
        </h1>
      </div>
      <div className="mx-auto max-w-[1120px] my-5">
        <Slider {...settings}>
          <div className="px-3">
            <img src="/assets/slide1.png" alt="" className="rounded-[15px]" />
          </div>
          <div className="px-3"> 
            <img src="/assets/slide2.png" alt="" className="rounded-[15px]" />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default BestDeals;
