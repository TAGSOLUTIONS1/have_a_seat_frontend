import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
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
  const [formData] = useState(initialBookingState);

  const handleSearch = () => {
    localStorage.setItem("searchFormData", JSON.stringify(formData));
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  return (
    <div
      className="relative block overflow-hidden bg-lightGrey"
      id="about"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-frenchPink/40 via-bgGray/50 to-plum/[0.07]"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
        <div className="flex flex-row items-center gap-8 lg:gap-12 xl:gap-20">
          {/* Vertical Swiper — autoplay + wheel / drag */}
          <div className="flex-1 min-w-0 justify-center lg:justify-center lg:pr-2 hidden md:block">
            <div className="flex w-full max-w-[380px] xl:max-w-[400px] flex-col items-center">
              <Swiper
                direction="vertical"
                modules={[Autoplay, Mousewheel, Pagination]}
                slidesPerView={1.12}
                centeredSlides
                spaceBetween={-80}
                speed={700}
                loop={hotels.length > 2}
                watchOverflow
                mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="h-[min(64vh,480px)] xl:h-[min(64vh,500px)] w-full !pb-2
                  [&_.swiper-pagination]:!left-auto [&_.swiper-pagination]:!right-1 [&_.swiper-pagination]:!top-1/2
                  [&_.swiper-pagination]:!-translate-y-1/2 [&_.swiper-pagination]:!w-2.5
                  [&_.swiper-pagination]:!flex [&_.swiper-pagination]:!flex-col [&_.swiper-pagination]:!gap-1.5
                  [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!bg-plum/35
                  [&_.swiper-pagination-bullet-active]:!bg-plum [&_.swiper-pagination-bullet-active]:!opacity-100"
              >
                {hotels.map((hotel, index) => (
                  <SwiperSlide
                    key={`${hotel}-${index}`}
                    className="!flex items-stretch justify-center !box-border"
                  >
                    <div className="h-[330px] w-[420px]  rounded-[1.25rem] overflow-hidden">
                    <img
                        src={hotel}
                        alt={`Restaurant platform ${index + 1}`}
                        className="h-full w-full object-cover rounded-[1.25rem]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* <p className="mt-3 text-center text-[11px] md:text-xs font-inter text-graysublabel leading-snug max-w-[280px]">
                Auto-advancing • Hover to pause • Scroll or drag to explore
              </p> */}
              <p className="mt-8 md:mt-12 lg:mt-16 xl:mt-32">
                </p>
            </div>
          </div>

          {/* Copy */}
          <div className="flex-1 min-w-0 max-w-lg lg:max-w-[520px] xl:max-w-[560px] pl-1 lg:pl-0">
            <div className="flex flex-col gap-6 lg:gap-7 lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-agrandir font-bold text-shipGrey">
                  Discover Dining Delights{" "}
                  <span className="text-plum">Across Top Platforms</span>
                </h2>
                <p className="text-base md:text-lg text-graysublabel font-inter leading-relaxed">
                  Explore and book from an extensive selection of restaurants
                  sourced from top dining platforms, all through a single,
                  easy-to-use interface.
                </p>
              </div>

              <ul className="flex flex-col gap-4">
                {resturantsList.map((li) => (
                  <li
                    className="text-base md:text-lg font-inter text-shipGrey flex gap-3 items-start"
                    key={li}
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-plum/25 ring-0.5 ring-plum/25">
                      <img
                        src={tick}
                        alt=""
                        className="h-3 w-3 md:h-3.5 md:w-3.5"
                      />
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleSearch}
                className="bg-plum text-white items-center max-w-fit flex gap-2 text-base md:text-lg font-agrandir font-bold py-3 px-5 md:px-9 rounded-full shadow-md hover:bg-plum/90 hover:shadow-lg transition-all border border-plum/20 mt-1"
              >
                <img
                  src={cal}
                  alt=""
                  className="md:h-5 md:w-5 h-4 w-4 brightness-0 invert"
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
        className="hidden lg:block pointer-events-none absolute top-24 right-0 w-32 xl:w-40 opacity-[0.12] mix-blend-multiply"
      />
      <img
        src="/assets/penneg.png"
        alt=""
        className="hidden lg:block pointer-events-none absolute bottom-16 right-4 h-[220px] xl:h-[260px] opacity-[0.1] mix-blend-multiply"
      />
    </div>
  );
}

export default Restaurants;
