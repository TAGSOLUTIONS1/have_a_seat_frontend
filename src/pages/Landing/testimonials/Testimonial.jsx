import React, { useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y , Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const testimonials = [
  {
    name: "Mike T.",
    location: "Austin, Texas",
    text: "I didn’t know finding a table could be this easy! Just two clicks, and I was sitting down before my coffee even had a chance to cool. And the best thing about. “Have a Seat” is its smart AI search. It just pulls the data of every restaurant you are looking for and helps you reserve the seat without changing the multiple sites. You will find every option you love here",
    img: "/assets/testimonial_img_1.jpg", 
  },
  {
    name: "Sarah J.",
    location: "Multitasking entrepreneur mom with a packed schedule",
    text: "I’m the kind of guy who’s always tied up with meetings, family stuff, and everything in between. Honestly, writing this review wasn’t even on my radar. At first, I thought, “I don’t have time for another app”...But I just thought I’d give it a try because my childhood friend suggested it. And guess what? It’s been a lifesaver. Now I can easily book a seat at any restaurant without a hassle or juggling multiple sites to find the favorite spot I love. So yeah, thanks now I can “HAVE a SEAT” whenever I want. Love it guys.",
    img: "/assets/test3.jpg",
  },
  {
    name: "Daniel P.",
    location: "New York, New York",
    text: "I’m the kind of person who hates waiting and tech is something that overwhelms me and I was just tired of checking & changing different sites. This website has completely changed my dining experience…I’m seated, fed, and satisfied.",
    img: "/assets/testimonial_img_3.jpg",
  },
  {
    name: "Emma R.",
    location: "Chicago, Illinois",
    text: "When you’re starving after work, the last thing you want to do is wait. (yeah, that’s real), but not anymore because this website gets me straight to my plate every single time (whenever I want)",
    img: "/assets/test2.jpg",
  },
  {
    name: "Jake B.",
    location: "Chicago, Illinois",
    text: "Well…I just hate driving around at 10 p.m. trying to figure out who’s still open…especially when I am craving something to satisfy my late-night hunger. And with this website? Thank God, Now I know exactly where to go, and I’m never stuck waiting.",
    img: "/assets/test2.jpg",
  },
  {
    name: "Chris L.",
    location: "Chicago, Illinois",
    text: "I was visiting from out of town, had no clue where to go, and didn’t want to end up in a tourist trap. But I just found an amazing local place here using the “Have a Seat” website, and my table was ready when I arrived. It’s awesome, love it.",
    img: "/assets/test2.jpg",
  },
  {
    name: "John D.",
    location: "Chicago, Illinois",
    text: "I’m that type of guy who always spends an hour choosing where to eat...Lol. Now I just open this easy-to-navigate website, compare spots, and book the seats. No debates, no stress. Just hanging with my guys whenever I want. BOOM",
    img: "/assets/test2.jpg",
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAvatarClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="testimonial-section text-center p-8">
      {/* Testimonial Display */}
      <div className="testimonial-text">
        <p className="text-grayblu font-agrandir font-normal tracking-[-1.3%] text-sm sm:text-xl mb-2 max-w-[90%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[55%] mx-auto min-h-[220px]">{testimonials[activeIndex].text}</p>
        <p className="font-extrabold text-blu text-base sm:text-lg font-jakarta">{testimonials[activeIndex].name}</p>
        <p className="text-grayblu text-xs sm:text-sm font-agrandir font-medium">{testimonials[activeIndex].location}</p>
      </div>

      {/* Avatar Navigation */}
      {/* <div className="avatar-navigation flex justify-center space-x-4 mt-7">
        {testimonials.map((testimonial, index) => (
          <img
            key={index}
            src={testimonial.img}
            alt={testimonial.name}
            className={`h-7 w-7 sm:w-9 sm:h-9 rounded-full cursor-pointer object-cover ${
              index === activeIndex
                ? " transform scale-110"
                : "opacity-50"
            }`}
            onClick={() => handleAvatarClick(index)}
          />
        ))}
      </div> */}

      <div className="mt-5 w-2/3 flex mx-auto">
         <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y , Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            // navigation
            autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className={`h-9 w-9 sm:h-11 sm:w-11 rounded-full cursor-pointer object-cover mx-auto transition-transform duration-300 ${
                  index === activeIndex ? "scale-125 border-2 border-purple-600" : "opacity-50"
                }`}
                onClick={() => handleAvatarClick(index)}
              />
            </SwiperSlide>

          ))}
          </Swiper>
      </div>

       {/* <div className="mt-8 max-w-3xl mx-auto">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full"
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <img
                src={testimonial.img}
                alt={testimonial.name}
                onClick={() => setActiveIndex(index)}
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover cursor-pointer mx-auto transition duration-300 ${
                  index === activeIndex ? "scale-110 border-2 border-purple-600" : "opacity-50"
                }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}
    </div>
  );
};

export default Testimonial;
