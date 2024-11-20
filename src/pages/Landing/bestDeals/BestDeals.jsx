import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import offer1 from "/assets/speOffer1.png";

import Slider from "react-slick";

function BestDeals() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
  return (
    <div className="px-[75px] py-[50px]">
      <div className="text-[4.25rem] text-plum text-center font-bold">
        <h1>Today’s best deals</h1>
      </div>
      <div className="slider-container border border-red-100 max-w-[1220px] m-auto">
        <Slider {...settings}>
          <div>hi</div>
          <div>bye</div>
        </Slider>
      </div>
    </div>
  );
}

export default BestDeals;
