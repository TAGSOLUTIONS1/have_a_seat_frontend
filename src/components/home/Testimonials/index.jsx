import { useState, useEffect } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Star } from "lucide-react";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 2) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const slides = [
    {
      image: "/assets/testimonial_img_1.jpg",
      title: "Matt Henry",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "China",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/testimonial_img_2.jpg",
      title: "David Convay",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "New York",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/testimonial_img_3.jpg",
      title: "Jimmy Neesham",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "California",
      phoneNumber: "(051)7860123",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 2) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 2 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full flex flex-col items-center mb-44">
      <div className="flex items-center   sm:px-28 md:mx-28 justify-between mt-20">
        <div className="mr-24 sm:mr-0 md:mr-0 lg:mr-0">
          <span className="relative text-purple-600 sm:text-lg md:text-3xl lg:text-3xl  font-bold italic">
            <img
              src="/assets/heading_shapes_1.png"
              alt=""
              className="absolute object-cover left-28 md:left-48 md:top-1/4 sm:h-4 sm:w-10 md:h-6 md:w-16"
            />
            Testimonials
          </span>
          <p className="text-black mt-4 sm:text-lg md:text-4xl font-bold non-italic">
            Our Customer Feedback
          </p>
        </div>
        <div className="flex  mt-12 sm:ml-[300px]  md:ml-[500px]">
          <div className="bg-purple-600 rounded-full h-10 w-10 mr-1  flex items-center justify-center">
            <ArrowLeft onClick={prevSlide} className="text-white w-6 h-6" />
          </div>
          <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
            <ArrowRight onClick={nextSlide} className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center my-8  mx-28 relative w-full overflow-x-auto">
        <div className="flex space-x-8">
          {[currentSlide, (currentSlide + 1) % totalSlides].map((index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg overflow-hidden flex flex-col items-center text-center p-4`}
            >
              <div className="rounded-full overflow-hidden mb-4">
                <img
                  src={slides[index].image}
                  className="h-32 w-32 rounded-full object-cover select-none"
                  alt=""
                />
              </div>
              <div className="mt-2">
                <h1 className="text-purple-600 text-lg font-bold italic select-none">
                  {slides[index].title}
                </h1>
                <p className="text-gray-800 mt-2 text-md font-bold non-italic select-none">
                  {slides[index].intro}
                </p>
                <div className="flex mt-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} fill="Yellow" className="text-black" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;