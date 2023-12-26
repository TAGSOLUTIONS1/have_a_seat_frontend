import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ShoppingBag } from "lucide-react";
import { Heart } from "lucide-react";
import { Eye } from "lucide-react";

const CardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      image: "/assets/download_slider_1.jpg",
      title: "New Cafe",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "Los Angles",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/download_slider_2.jpg",
      title: "Ocean's View",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "New York",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/download_slider_2.jpg",
      title: "Richard's Villa",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "California",
      phoneNumber: "(051)7860123",
    },
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjOxySYAhLCdR_TLtd_8h-0lq-A8tNwTVEtQ&usqp=CAU",
      title: "Bars",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "Arazona",
      phoneNumber: "(051)7860123",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mt-20">
        <div className="text-center">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-purple-600 sm:text-4xl">
                <span className="relative">
                  <img
                    src="/assets/heading_shapes_1.png"
                    alt=""
                    className="absolute left-0 bottom-0 h-6 w-16 ml-40 mb-2 md:ml-56 lg:ml-56"
                  />
                  Daily Offer
                </span>
              </h2>
              <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Upto 75% off for today
              </p>
            </div>
            <div className="flex ml-24 mt-8 sm:mt-12">
              <div
                className="flex items-center justify-center p-2 rounded-full bg-purple-600 mr-4 sm:mr-8 cursor-pointer"
                onClick={prevSlide}
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </div>
              <div
                className="flex items-center justify-center p-2 rounded-full bg-gray-600 cursor-pointer"
                onClick={nextSlide}
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative my-8 w-full">
          <div className="flex justify-center space-x-6 sm:space-x-8">
            <div className="sm:flex sm:space-x-4">
              {[currentSlide, (currentSlide + 1) % totalSlides].map((index) => (
                <div
                  key={index}
                  className={`flex flex-col bg-white rounded-lg shadow-lg h-[430px] overflow-hidden ${
                    index === currentSlide
                      ? "transition-transform duration-500"
                      : ""
                  } ${
                    index === currentSlide
                      ? "transform-none"
                      : "-translate-x-full sm:translate-x-0"
                  }`}
                >
                  <div>
                    <img
                      src={slides[index].image}
                      className="h-[220px] object-cover w-[340px]"
                      alt=""
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-purple-600 text-white border-2 border-white rounded-full p-2 absolute top-1/2 left-[258px] transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                      <span className="text-center font-bold ml-2">
                        45% <p>off</p>
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 mx-8 z-10 w-[270px]">
                    <h1 className="text-purple-600 ml-8 text-xl font-bold italic">
                      {slides[index].title}
                    </h1>
                    <p className="text-gray-600 mt-2 ml-8 text-md font-bold non-italic">
                      {slides[index].intro}
                    </p>
                    <p className="text-purple-600 mt-2 ml-8 text-md font-bold italic">
                      {slides[index].location}
                    </p>
                    <div className="flex">
                      <ShoppingBag className="text-purple-600 mt-4 ml-8" />
                      <Heart className="text-purple-600 mt-4 ml-4" />
                      <Eye className="text-purple-600 mt-4 ml-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsSlider;
